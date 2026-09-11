'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {setup}=require('./support/course-harness');
const {answer}=require('./support/tap-exercise');
const unit=require('../../content/learning-course.json');
const placement=require('../../core/learning-placement');
const scene=require('../../core/learning-path-scene').createRenderer(unit);
const store=require('../../core/learning-store');
const sounds=r=>r.effects.filter(e=>e.type==='play-feedback').map(e=>e.sound);
function randomStream(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function current(h){const a=h.view().placementAttempt,index=h.view().placementIndex,q=placement.question(unit,a.questionIds[index],a.version);return {a,q,event:{attemptId:a.id,questionId:q.id}};}
function start(h){h.send({type:'open-placement',id:'friends'});h.send({type:'placement-start'});}

test('grading a picture preserves every option identity, position and heard reference with changing random values',()=>{
  for(const seed of [1,8,37,93]){
    const h=setup({random:randomStream(seed)});start(h);
    while(h.view().screen==='placement'){
      const {q,event}=current(h);answer(h,q);
      const before=h.view();h.send({type:'placement-check',...event});
      if(q.form==='T02'){
        assert.deepEqual(h.view().exerciseOptionOrder,before.exerciseOptionOrder,'grading must not shuffle options again');
        assert.deepEqual(h.view().heardRefs,before.heardRefs,'grading must retain the completed listening');
        assert.deepEqual(h.view().response,before.response);break;
      }
      h.send({type:'placement-next',...event});
    }
  }
});

for(const correct of [true,false])test(`final ${correct?'correct':'incorrect'} answer waits for manual continue, including reload`,()=>{
  const h=setup();start(h);let last;
  for(let i=0;i<(correct?20:5);i++){
    last=current(h);answer(h,last.q,correct);
    const result=h.rt.dispatch({type:'placement-check',...last.event});
    assert.deepEqual(sounds(result),[correct?'correct':'incorrect']);
    if(i<(correct?19:4))h.send({type:'placement-next',...last.event});
  }
  assert.equal(h.view().screen,'placement');assert.equal(h.view().feedback,correct?'correct':'incorrect');
  assert.equal(h.view().placementIndex,correct?19:4);
  assert.equal(placement.skippedUntil(unit,h.view().record),0,'the final feedback cannot unlock the destination before continue');
  assert.deepEqual(sounds(h.rt.dispatch({type:'placement-check',...last.event})),[]);
  const resumed=setup({adapter:h.adapter});resumed.send({type:'open-placement',id:'friends'});
  assert.match(scene.render(resumed.view()),new RegExp('剩余 '+(correct?5:0)+' 次机会，共 5 次'),'resuming final feedback retains the actual hearts');
  resumed.send({type:'placement-start'});
  assert.equal(resumed.view().screen,'placement');assert.equal(resumed.view().feedback,correct?'correct':'incorrect');
  assert.equal(resumed.view().placementIndex,correct?19:4);
  const result=resumed.rt.dispatch({type:'placement-next',...last.event});
  assert.equal(result.view.screen,'placement-result');assert.deepEqual(sounds(result),[correct?'complete':'failed']);
  assert.deepEqual(sounds(resumed.rt.dispatch({type:'placement-next',...last.event})),[]);
  assert.equal(resumed.view().placementAttempt.responses.length,correct?20:5);
});

test('placement persists foreground time, excludes background and offline gaps, freezes on the last grade',()=>{
  let time=0;const now=()=>new Date(Date.UTC(2026,8,11)+time),h=setup({now});start(h);
  time=12000;h.send({type:'session-visibility',hidden:true});
  assert.equal(h.view().placementAttempt.elapsedMs,12000);
  time=72000;h.send({type:'session-visibility',hidden:false});
  time=82000;h.send({type:'map'});
  assert.equal(h.view().record.placement.attempts.friends.elapsedMs,22000);
  time=182000;const resumed=setup({now,adapter:h.adapter});start(resumed);
  let last;
  for(let i=0;i<20;i++){last=current(resumed);time+=1000;answer(resumed,last.q);resumed.send({type:'placement-check',...last.event});if(i<19)resumed.send({type:'placement-next',...last.event});}
  assert.equal(resumed.view().placementAttempt.elapsedMs,42000);
  time+=60000;resumed.send({type:'placement-next',...last.event});
  const html=scene.render(resumed.view());assert.match(html,/剩余机会/);assert.match(html,/chances-heart\.webp/);assert.doesNotMatch(html,/本次用时/);
  resumed.send({type:'session-visibility',hidden:true});assert.equal(resumed.view().placementAttempt.elapsedMs,42000);
});

test('completed attempts without a duration still show their real remaining chances',()=>{
  const h=setup();start(h);let a=h.view().placementAttempt;
  while(a.status==='active'){
    const q=placement.question(unit,a.questionIds[a.cursor],a.version);
    a=placement.grade(unit,a,require('../../core/learning-exercises').solution(q),'2026-09-10T01:00:00Z',q.listenRefs);
    if(a.status==='active'){a.cursor++;a.draft=require('../../core/learning-exercises').empty();}
  }
  delete a.elapsedMs;delete a.feedbackPending;a.cursor=a.responses.length;a.draft=require('../../core/learning-exercises').empty();
  const record={...h.view().record,placement:{attempts:{friends:a}}};
  assert.equal(placement.validProgress(record.placement,unit),true);
  const html=scene.render({...h.view(),screen:'placement-result',record,placementAttempt:a});
  assert.match(html,/剩余机会/);assert.match(html,/chances-heart\.webp/);assert.doesNotMatch(html,/未记录|本次用时/);
  const restored=setup({adapter:store.createMemoryAdapter({[h.rt.storageKey]:{revision:1,value:record}})});
  assert.equal(restored.view().screen,'map');assert.ok(placement.skippedUntil(unit,restored.view().record)>0);
});

test('saving time on visibility changes retains a selected draft and reload excludes time away',()=>{
  let time=0;const h=setup({now:()=>new Date(Date.UTC(2026,8,11)+time)});start(h);
  const {q}=current(h);h.send({type:'exercise-select',questionId:q.id,id:q.options[0].id});
  const response=h.view().response;time=10000;h.send({type:'session-visibility',hidden:true});
  const restored=setup({adapter:h.adapter});start(restored);assert.deepEqual(restored.view().response,response);
  h.send({type:'session-visibility',hidden:false});time=15000;h.send({type:'reload'});
  time=60000;start(h);const before=h.view().placementAttempt.elapsedMs;time=65000;h.send({type:'map'});
  assert.equal(before,15000);assert.equal(h.view().record.placement.attempts.friends.elapsedMs,20000);
});

test('background time remains excluded while a placement draft save is waiting for retry',()=>{
  let time=0,fail=false;const base=store.createMemoryAdapter();
  const h=setup({now:()=>new Date(Date.UTC(2026,8,11)+time),adapter:{...base,saveDraft:(...args)=>fail?{status:'failed'}:base.saveDraft(...args)}});start(h);
  const {q}=current(h);time=10000;fail=true;
  h.rt.dispatch({type:'exercise-select',questionId:q.id,id:q.options[0].id});
  assert.equal(h.view().saveState,'failed');
  time=12000;h.rt.dispatch({type:'session-visibility',hidden:true});
  time=72000;h.rt.dispatch({type:'session-visibility',hidden:false});
  fail=false;h.send({type:'save-retry'});time=82000;h.send({type:'map'});
  assert.equal(h.view().record.placement.attempts.friends.elapsedMs,22000);
});
