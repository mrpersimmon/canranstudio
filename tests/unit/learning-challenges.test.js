'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {setup}=require('./support/course-harness');
const {store,runtime}=require('./support/learning-path-harness');
const catalog=require('../../core/learning-course-catalog'), rules=require('../../core/learning-challenges');
const unit=catalog.getCourse();
function unlock(h,id='R02'){for(const n of unit.nodes){h.finish(n.id);if(n.id===id)break;}h.send({type:'map'});}
function open(h,id='CH12'){h.send({type:'open-challenge',id});assert.equal(h.view().screen,'challenge-intro');h.send({type:'challenge-start'});}
function answer(h,value){h.send({type:'challenge-input',value});h.send({type:'challenge-check'});}
function reset(h,scope='course',id){h.send({type:'reset-request',scope,id});h.send({type:'reset-confirm'});}

test('challenge answer contract accepts presentation variants but rejects changed language',()=>{
  assert.deepEqual(catalog.validateCourse(),[]);
  const sentence=unit.challenges[1].questions[1];
  for(const value of ['THIS IS NOT MY UMBRELLA !',"This isn’t my umbrella.",'  This  is not my umbrella。']) {
    assert.equal(rules.accepts(sentence,value),true,value);
  }
  for(const value of ['', 'This my umbrella.','This is my umbrella.','This is not your umbrella.'])assert.equal(rules.accepts(sentence,value),false,value);
  const bad=structuredClone(unit);bad.challenges[0].questions[0].answers=['mine'];
  assert.ok(catalog.validateCourse(bad).some(error=>error.includes('challenge answer differs')));
});
test('all optional challenges complete without changing the main route or review evidence',()=>{
  const h=setup();
  h.send({type:'open-challenge',id:'CH12'});assert.equal(h.view().screen,'map');
  unlock(h);const before=structuredClone(h.view().record);
  for(const c of unit.challenges){
    open(h,c.id);assert.equal(h.view().sessionProgress.completed,0);
    for(const [i,q] of c.questions.entries()){
      assert.equal(h.view().challengeIndex,i);assert.equal(h.view().audio,null,'answers cannot be heard before retrieval');
      answer(h,q.answers.at(-1));assert.equal(h.view().feedback,'correct');
      assert.equal(h.view().challengeIndex,i,'checking does not auto advance');
      h.send({type:'challenge-next'});
    }
    assert.equal(h.view().screen,'challenge-complete');
    assert.deepEqual(h.view().sessionProgress,{completed:6,total:6});
    assert.equal(h.view().record.challenges[c.id].answers.length,6);
    h.send({type:'map'});
  }
  for(const key of ['completed','results','storyProgress','teachingProgress','reviewEvents'])assert.deepEqual(h.view().record[key],before[key],key);
  assert.equal(h.view().completedCount,11);
});
test('draft, mistakes and hints survive refresh and never become independent evidence',()=>{
  const h=setup();unlock(h,'K04');open(h);
  answer(h,'mine');assert.equal(h.view().feedback,'retry');
  h.send({type:'challenge-retry'});h.send({type:'challenge-input',value:'you'});
  h.send({type:'challenge-save-draft',id:'CH12',questionId:'CH12-1'});
  const r=setup({adapter:h.adapter});open(r);
  assert.equal(r.view().challengeAnswer,'you');assert.equal(r.view().challengeWrong,1);
  answer(r,'your');r.send({type:'challenge-next'});
  assert.equal(r.view().record.challenges.CH12.answers[0].evidence,'supported');
  r.send({type:'challenge-save-draft',id:'CH12',questionId:'CH12-1'});
  assert.equal(r.view().record.challenges.CH12.draft,undefined,'late draft from the previous question is ignored');
});
test('scoped reset requires confirmation, keeps main progress, supports undo and persists across refresh',()=>{
  const h=setup();unlock(h,'K04');open(h);answer(h,'your');h.send({type:'challenge-next'});h.send({type:'map'});
  const before=structuredClone(h.view().record);
  h.send({type:'reset-confirm'});assert.deepEqual(h.view().record,before);
  h.send({type:'reset-request',scope:'challenges'});h.send({type:'reset-cancel'});assert.deepEqual(h.view().record,before);
  reset(h,'challenges');assert.deepEqual(h.view().record.challenges,{});assert.equal(h.view().completedCount,3);
  const r=setup({adapter:h.adapter});assert.equal(r.view().completedCount,3);assert.deepEqual(r.view().record.challenges,{});
  r.send({type:'reset-undo'});assert.deepEqual(r.view().record,before);
});
test('damaged challenge records are rejected without crashing the course loader',()=>{
  const h=setup();unlock(h,'K04');open(h);answer(h,'your');h.send({type:'challenge-next'});
  const good=structuredClone(h.view().record);
  for(const damage of [p=>p.answers[0]=null,p=>p.completedAt=true,p=>p.draft=[]]){
    const bad=structuredClone(good);damage(bad.challenges.CH12);
    assert.equal(runtime.validRecord(bad,unit),false);
    const adapter=store.createMemoryAdapter({[h.rt.storageKey]:{revision:1,value:bad}});
    const loaded=runtime.createRuntime({unit,adapter});
    assert.equal(loaded.snapshot().screen,'blocked');
  }
});
test('resetting one challenge preserves every other challenge and allows starting at zero',()=>{
  const h=setup();unlock(h);open(h,'CH12');answer(h,'your');h.send({type:'challenge-next'});h.send({type:'map'});
  open(h,'CH34');answer(h,'my');h.send({type:'challenge-next'});h.send({type:'map'});
  const before=structuredClone(h.view().record);
  reset(h,'challenge','CH12');assert.equal(h.view().record.challenges.CH12,undefined);
  assert.deepEqual(h.view().record.challenges.CH34,before.challenges.CH34);
  assert.deepEqual(h.view().record.completed,before.completed);
  open(h,'CH12');assert.equal(h.view().challengeIndex,0);assert.equal(h.view().challengeAnswer,'');
  assert.deepEqual(h.view().sessionProgress,{completed:0,total:6});
});
test('full reset writes an empty current record, cannot reimport old progress or erase unrelated data',()=>{
  const old=require('./support/learning-path-harness').setup();for(const n of require('./support/learning-path-harness').unit.nodes)old.finishNode(n.id);
  old.adapter.commit('other-app',{expectedRevision:0,value:{keep:true}});
  const h=setup({adapter:old.adapter});const legacy=old.adapter.load(old.rt.storageKey);assert.equal(h.view().completedCount,3);
  reset(h);assert.equal(h.view().completedCount,0);assert.equal(h.view().nodes[1].available,false);
  const r=setup({adapter:h.adapter});assert.equal(r.view().completedCount,0);assert.deepEqual(r.view().record.results,{});
  assert.deepEqual(old.adapter.load(old.rt.storageKey),legacy);assert.deepEqual(old.adapter.load('other-app').value,{keep:true});
  r.send({type:'reset-undo'});assert.equal(r.view().completedCount,3);
  reset(r);r.send({type:'open-node',nodeId:'K01'});r.step();assert.equal(r.view().record.resetBackup,undefined,'new learning closes the undo window');
});
test('failed resets do not claim success; retries and stale-tab conflicts keep saved data intact',()=>{
  const backing=store.createMemoryAdapter();let fail=false;
  const adapter={load:backing.load,commit:(...args)=>fail?{status:'unavailable',persisted:false}:backing.commit(...args)};
  const h=setup({adapter});unlock(h,'K04');const before=backing.load(h.rt.storageKey);
  h.send({type:'reset-request',scope:'course'});fail=true;
  h.rt.dispatch({type:'reset-confirm'});assert.equal(h.view().saveState,'failed');assert.equal(h.view().completedCount,3);
  assert.deepEqual(backing.load(h.rt.storageKey),before);
  fail=false;h.send({type:'save-retry'});assert.equal(h.view().completedCount,0);
  h.send({type:'reset-undo'});open(h);answer(h,'your');
  const other=setup({adapter});reset(other,'challenges');
  h.rt.dispatch({type:'challenge-next'});
  assert.equal(h.view().saveState,'conflict');assert.deepEqual(backing.load(h.rt.storageKey).value.challenges,{});
  h.send({type:'reload'});assert.equal(h.view().completedCount,3);
  assert.ok(runtime.validRecord(h.view().record,unit));
});
