'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {setup}=require('./support/course-harness');
const store=require('../../core/learning-store');
const unit=require('../../core/learning-course-catalog').getCourse();
const scene=require('../../core/learning-path-scene').createRenderer(unit);

test('settlement measures this visit, freezes time, excludes hidden time and resets on replay',()=>{
  let time=0;const h=setup({now:()=>new Date(Date.UTC(2026,8,9)+time)});
  h.send({type:'open-node',nodeId:'K01'});h.step();time=15000;
  h.send({type:'session-visibility',hidden:true});time=75000;
  h.send({type:'session-visibility',hidden:false});time=118000;
  while(h.view().screen==='activity')h.step();
  const s=h.view().settlement;
  assert.equal(s.completed,10);assert.equal(s.elapsedMs,58000);
  assert.equal(s.assessed,3);assert.equal(s.independent,3);assert.equal(s.bestStreak,3);
  const html=scene.render(h.view());
  assert.match(html,/0:58/);assert.doesNotMatch(html,/<header|学习记录|经验|role="progressbar"/);
  assert.equal((html.match(/data-settlement-value/g)||[]).length,3);
  time+=3600000;h.send({type:'continue'});h.send({type:'session-visibility',hidden:true});
  assert.deepEqual(h.view().settlement,s,'waiting on results cannot inflate time or award twice');
  h.send({type:'session-visibility',hidden:false});h.send({type:'map'});
  assert.equal(h.view().settlement,null);
  h.send({type:'open-node',nodeId:'K01'});time+=9000;
  while(h.view().screen==='activity')h.step();
  assert.equal(h.view().settlement.completed,10);assert.equal(h.view().settlement.elapsedMs,9000);
  assert.equal(h.view().settlement.independent,3);
});

test('wrong and helped answers break the streak; resumed history is not awarded again',()=>{
  const h=setup();h.send({type:'open-node',nodeId:'K01'});
  while(!unit.activities[h.view().activityId].resultId)h.step();
  const a=unit.activities[h.view().activityId];
  h.send({type:'select',id:a.options.find(o=>!a.answer.includes(o.id)).id});
  h.send({type:'check'});h.send({type:'retry'});h.step();
  const resumed=setup({adapter:h.adapter});resumed.send({type:'open-node',nodeId:'K01'});
  const remaining=resumed.view().sessionProgress.total;
  while(resumed.view().screen==='activity')resumed.step();
  assert.equal(resumed.view().settlement.completed,remaining);
  assert.equal(resumed.view().settlement.assessed,2);
  assert.equal(resumed.view().settlement.independent,2);
  assert.equal(resumed.view().settlement.bestStreak,2);
  h.send({type:'reload'});h.send({type:'open-node',nodeId:'K01'});
  while(!unit.activities[h.view().activityId].resultId)h.step();
  h.send({type:'hint'});h.step();
  while(h.view().screen==='activity')h.step();
  assert.equal(h.view().settlement.independent,2);assert.equal(h.view().settlement.bestStreak,2);
});

test('settlement is shown only after durable completion, and saving twice cannot award twice',()=>{
  const backing=store.createMemoryAdapter();let fail=false;
  const adapter={load:backing.load,commit:(...args)=>fail?{status:'unavailable',persisted:false}:backing.commit(...args)};
  const h=setup({adapter});h.send({type:'open-node',nodeId:'K01'});
  while(h.view().storyIndex<unit.activities['v3.6:interactive-story'].beats.length-1)h.step();
  h.hear();fail=true;h.rt.dispatch({type:'continue'});
  assert.equal(h.view().saveState,'failed');assert.equal(h.view().settlement,null);
  fail=false;h.send({type:'save-retry'});const s=h.view().settlement;
  assert.equal(s.completed,10);assert.equal(s.assessed,3);
  h.send({type:'save-retry'});assert.deepEqual(h.view().settlement,s);
});

test('input challenge resumes only remaining questions and assisted answers are not a streak',()=>{
  const h=setup();for(const n of unit.nodes.slice(0,3))h.finish(n.id);
  h.send({type:'map'});h.send({type:'open-challenge',id:'CH12'});h.send({type:'challenge-start'});
  const questions=unit.challenges.find(c=>c.id==='CH12').questions;
  h.send({type:'challenge-input',value:questions[0].answers[0]});h.send({type:'challenge-check'});h.send({type:'challenge-next'});
  const r=setup({adapter:h.adapter});r.send({type:'open-challenge',id:'CH12'});r.send({type:'challenge-start'});
  for(const [i,q] of questions.slice(1).entries()){
    if(i===0)r.send({type:'challenge-hint'});
    r.send({type:'challenge-input',value:q.answers[0]});r.send({type:'challenge-check'});r.send({type:'challenge-next'});
  }
  assert.equal(r.view().screen,'challenge-complete');assert.equal(r.view().settlement.completed,questions.length-1);
  assert.equal(r.view().settlement.independent,questions.length-2);assert.equal(r.view().settlement.bestStreak,questions.length-2);
  const record=structuredClone(r.view().record);r.send({type:'map'});assert.deepEqual(r.view().record,record);
});
