'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {setup}=require('./support/course-harness');
const {store,runtime}=require('./support/learning-path-harness');
const unit=require('../../core/learning-course-catalog').getCourse();
const placement=require('../../core/learning-placement'),answers=require('../../core/learning-challenges');
function open(h,id='umbrella') {h.send({type:'open-placement',id});assert.equal(h.view().screen,'placement-intro');h.send({type:'placement-start'});}
function identity(h){const a=h.view().placementAttempt;return {attemptId:a.id,questionId:a.questionIds[a.cursor]};}
function input(h,value){const q=placement.question(unit,identity(h).questionId);if(value==='unfinished draft'||value==='other tab')h.send({type:'exercise-select',questionId:q.id,id:q.options[0].id});else require('./support/tap-exercise').answer(h,q,value!=='wrong answer');}
function grade(h,correct=true){const q=placement.question(unit,identity(h).questionId);input(h,correct?true:'wrong answer');h.send({type:'placement-check',...identity(h)});}
function finish(h,wrong=0){for(let i=0;i<20 && h.view().screen==='placement';i++){grade(h,i>=wrong);if(h.view().feedback)h.send({type:'placement-next',...identity(h)});}}

test('foundation uses picture choice and word banks with no editable answers',()=>{
 const watch=unit.placement.questions.find(q=>q.sourceRef==='L02-W04');assert.equal(watch.form,'T02');
 assert.ok(watch.options.every(o=>o.entityId));
 const q=unit.placement.questions.find(q=>q.sourceRef==='NCE-U01-C-Q-WATCH');assert.equal(q.mechanism,'order');
 const h=setup();open(h);const html=require('../../core/learning-path-scene').createRenderer(unit).render(h.view());assert.doesNotMatch(html,/<input|<textarea|翻译这句话/);
});

test('every skip destination has 20 unique, bounded questions; wide jumps cover the skipped range',()=>{
  for(const [i,c] of unit.chapters.entries()) if(i){
    const ids=placement.sample(unit,'found',c.id,37),qs=ids.map(id=>placement.question(unit,id));
    assert.equal(ids.length,20);assert.equal(new Set(qs.map(q=>answers.normalize(unit.sources[q.sourceRef].text))).size,20);
    assert.ok(qs.every(q=>unit.chapters.findIndex(c=>c.id===q.chapterId)<i));
    assert.ok(qs.some(q=>q.chapterId===unit.chapters[i-1].id),'latest prerequisite '+c.id);
    assert.deepEqual(ids,placement.sample(unit,'found',c.id,37));
  }
  const from=unit.chapters[20].id,target=unit.chapters[60].id;
  const qs=placement.sample(unit,from,target,481).map(id=>placement.question(unit,id));
  assert.equal(qs.filter(q=>unit.chapters.findIndex(c=>c.id===q.chapterId)<20).length,6);
  assert.ok(new Set(qs.map(q=>q.chapterId)).size>=14);
  assert.notDeepEqual(placement.sample(unit,from,target,481),placement.sample(unit,from,target,482));
});
test('fifth mistake fails immediately; duplicate checks and late drafts cannot consume more lives',()=>{
  const h=setup();open(h);const original=structuredClone(h.view().record.completed);
  for(let i=0;i<5;i++){
    const token=identity(h);grade(h,false);
    const saved=structuredClone(h.view().record);
    h.send({type:'placement-check',...token});h.send({type:'placement-input',value:'late',...token});
    assert.deepEqual(h.view().record,saved);
    assert.equal(placement.mistakes(h.view().placementAttempt),i+1);
    if(i<4){assert.equal(h.view().screen,'placement');h.send({type:'placement-next',...token});
      const current=structuredClone(h.view().record);h.send({type:'placement-next',...token});assert.deepEqual(h.view().record,current);}
  }
  assert.equal(h.view().screen,'placement-result');assert.equal(h.view().placementAttempt.status,'failed');
  assert.equal(h.view().nodes[3].available,false);assert.deepEqual(h.view().record.completed,original);
  const seed=h.view().placementAttempt.seed;
  h.send({type:'placement-retry'});h.send({type:'placement-start'});
  assert.notEqual(h.view().placementAttempt.seed,seed);assert.equal(h.view().placementAttempt.responses.length,0);
});
test('fixed questions, current draft, feedback and mistakes survive leave and refresh',()=>{
  let h=setup();open(h,'lesson-21-22');grade(h,false);
  const before=structuredClone(h.view().placementAttempt);
  h.send({type:'map'});h=setup({adapter:h.adapter});open(h,'lesson-21-22');
  assert.deepEqual(h.view().placementAttempt,before);assert.equal(h.view().feedback,'incorrect');
  h.send({type:'placement-next',...identity(h)});input(h,'unfinished draft');
  const saved=structuredClone(h.view().placementAttempt);
  h=setup({adapter:h.adapter});open(h,'lesson-21-22');
  assert.deepEqual(h.view().placementAttempt,saved);assert.deepEqual(h.view().response.selected,[placement.question(unit,identity(h).questionId).options[0].id]);
  assert.equal(h.view().sessionProgress.completed,1);assert.equal(h.view().sessionProgress.total,20);
});
test('four mistakes may pass only after all 20 responses; skipping never fabricates learned evidence',()=>{
  const h=setup();h.finish('K01');h.send({type:'map'});
  const before=structuredClone(h.view().record);
  open(h,'friends');finish(h,4);
  assert.equal(h.view().placementAttempt.status,'passed');assert.equal(h.view().passedCount,6);
  assert.equal(h.view().completedCount,1);assert.deepEqual(h.view().sessionProgress,{completed:20,total:20});
  for(const key of ['completed','results','attempts','storyProgress','teachingProgress','sourceContacts','reviewEvents','challenges'])assert.deepEqual(h.view().record[key],before[key],key);
  assert.ok(h.view().nodes[6].available);assert.equal(h.view().nodes[7].available,false);
  assert.ok(h.view().nodes[1].skipped);assert.equal(h.view().nodes[0].skipped,false);
  h.send({type:'map'});h.send({type:'open-node',nodeId:'K03'});
  assert.equal(h.view().mode,'main','a skipped node can still be learned for real');
  h.step();assert.ok(Object.keys(h.view().record.completed).length>Object.keys(before.completed).length);
});
test('reset scopes and undo preserve the distinction between placement and regular challenges',()=>{
  const h=setup();open(h);finish(h);h.send({type:'map'});
  const saved=structuredClone(h.view().record);
  h.send({type:'reset-request',scope:'challenges'});h.send({type:'reset-confirm'});
  assert.deepEqual(h.view().record.placement,saved.placement);assert.equal(h.view().passedCount,3);
  h.send({type:'reset-request',scope:'course'});h.send({type:'reset-confirm'});assert.equal(h.view().passedCount,0);
  assert.equal(h.view().record.placement,undefined);h.send({type:'reset-undo'});assert.equal(h.view().passedCount,3);
});
test('saving the final answer must succeed before unlocking; stale tabs cannot overwrite an attempt',()=>{
  const backing=store.createMemoryAdapter();let fail=false;
  const adapter={load:backing.load,commit:(...args)=>fail?{status:'unavailable',persisted:false}:backing.commit(...args)};
  const h=setup({adapter});open(h);
  for(let i=0;i<19;i++){grade(h);h.send({type:'placement-next',...identity(h)});}
  input(h,true);
  fail=true;h.rt.dispatch({type:'placement-check',...identity(h)});
  assert.equal(h.view().saveState,'failed');assert.equal(h.view().passedCount,0);
  assert.equal(backing.load(h.rt.storageKey).value.placement.attempts.umbrella.responses.length,19);
  fail=false;h.send({type:'save-retry'});assert.equal(h.view().passedCount,3);
  h.send({type:'map'});open(h,'friends');
  const other=setup({adapter});open(other,'friends');input(other,'other tab');
  h.rt.dispatch({type:'exercise-select',id:placement.question(unit,identity(h).questionId).options[1].id,questionId:identity(h).questionId});
  assert.equal(h.view().saveState,'conflict');assert.ok(backing.load(h.rt.storageKey).value.placement.attempts.friends.draft.selected.length);
});
test('damaged or fabricated placement responses are rejected without touching stored progress',()=>{
  const h=setup();open(h);grade(h,false);const good=structuredClone(h.view().record);
  for(const damage of [a=>a.status='passed',a=>a.responses[0].correct=true,a=>a.questionIds.reverse(),a=>a.cursor=9,a=>a.targetId='friends',a=>a.draft=null,a=>a.responses[0]=null]){
    const bad=structuredClone(good);damage(bad.placement.attempts.umbrella);
    assert.equal(runtime.validRecord(bad,unit),false);
    const adapter=store.createMemoryAdapter({[h.rt.storageKey]:{revision:1,value:bad}});
    assert.equal(runtime.createRuntime({unit,adapter}).snapshot().screen,'blocked');
  }
});
test('current chapter cannot be skipped, and opening an invitation does not mutate the learner record',()=>{
  const h=setup(),before=structuredClone(h.view().record);
  h.send({type:'open-placement',id:'found'});assert.equal(h.view().screen,'map');
  h.send({type:'open-placement',id:'unknown'});assert.equal(h.view().screen,'map');
  h.send({type:'open-placement',id:'umbrella'});assert.deepEqual(h.view().record,before);
  h.send({type:'placement-check'});assert.deepEqual(h.view().record,before);
});
