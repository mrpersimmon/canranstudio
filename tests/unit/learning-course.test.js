'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const catalog=require('../../core/learning-course-catalog');
const runtime=require('../../core/learning-path-runtime');
const scene=require('../../core/learning-path-scene');
const store=require('../../core/learning-store');
const oldHarness=require('./support/learning-path-harness');
const unit=catalog.getCourse();

const {setup}=require('./support/course-harness');

test('all six lessons complete through actual runtime actions, with every original dialogue once',()=>{
  assert.deepEqual(catalog.validateCourse(unit),[]);
  const h=setup();
  h.send({type:'open-node',nodeId:'C04'});assert.equal(h.view().screen,'map');
  for(const n of unit.nodes)h.finish(n.id);
  assert.equal(h.view().completedCount,11);
  assert.equal(Object.keys(h.view().record.completed).length,Object.keys(unit.activities).length);
  for(const ref of unit.dialogueRefs)assert.ok(h.view().record.sourceContacts[ref].modes.includes('heard'),ref);
  const restored=setup({adapter:h.adapter});assert.equal(restored.view().completedCount,11);
  restored.send({type:'course-summary'});assert.equal(restored.view().screen,'celebration');
  const recap=scene.createRenderer(unit).render(restored.view());assert.match(recap,/<details class="lp-completion-details">/);assert.match(recap,/<dt>看例子练习<\/dt>/);assert.match(recap,/<dt>选择冠词<\/dt>/);
  const before=JSON.stringify(h.adapter.load(h.rt.storageKey));h.finish('C07');assert.equal(JSON.stringify(h.adapter.load(h.rt.storageKey)),before,'completed-node replay does not change learning evidence');
});

test('imports original V3.6 results and story proof without modifying the old record',()=>{
  const old=oldHarness.setup();for(const n of oldHarness.unit.nodes)old.finishNode(n.id);
  const before=JSON.stringify(old.adapter.load(old.rt.storageKey));
  const h=setup({adapter:old.adapter});assert.equal(h.view().completedCount,3);assert.equal(h.view().nodes.find(n=>n.id==='C04').available,true);
  assert.equal(JSON.stringify(old.adapter.load(old.rt.storageKey)),before);
  assert.deepEqual(h.view().record.results,old.view().record.results);
  assert.deepEqual(h.view().record.storyProgress,old.view().record.storyProgress);
  h.send({type:'open-node',nodeId:'C04'});assert.equal(h.view().activityId,'C06:cloak-words');
});

test('manual teaching cards persist only ended recordings and recover after refresh',()=>{
  const h=setup();h.reach('C06:cloak-words');
  assert.equal(h.view().audio,null);assert.equal(h.view().canContinue,false);
  h.send({type:'word-play',id:'L03-W01'});const obsolete=h.view().audio;
  h.send({type:'word-play',id:'L03-W05'});
  assert.deepEqual(h.view().heardWords,[]);assert.equal(h.view().audio.requestId,obsolete.requestId);
  h.send({type:'audio-ended',requestId:obsolete.requestId,index:0});
  assert.deepEqual(h.view().heardWords,['L03-W01']);h.hear();assert.deepEqual(h.view().heardWords,['L03-W01','L03-W05']);
  const r=setup({adapter:h.adapter});r.send({type:'open-node',nodeId:'C04'});assert.deepEqual(r.view().heardWords,['L03-W01','L03-W05']);assert.equal(r.view().canContinue,false);
  r.send({type:'continue'});assert.equal(r.view().activityId,'C06:cloak-words');
});

test('new story advances only after ended audio and a manual continue, and restores the next turn',()=>{
  const h=setup();h.reach('C06:umbrella-story');
  h.send({type:'continue'});assert.equal(h.view().storyIndex,0);
  h.send({type:'story-start'});h.send({type:'continue'});assert.equal(h.view().storyIndex,0);
  h.hear();assert.equal(h.view().storyIndex,0);h.send({type:'continue'});assert.equal(h.view().storyIndex,1);
  const r=setup({adapter:h.adapter});r.send({type:'open-node',nodeId:'C04'});assert.equal(r.view().storyIndex,1);assert.equal(r.view().audio,null);
});

test('cross-lesson review is limited, does not duplicate a target, and preserves initial results',()=>{
  const h=setup();for(const n of unit.nodes)h.finish(n.id);
  const initial=structuredClone(h.view().record.results);
  const r=setup({adapter:h.adapter,now:()=>new Date('2026-09-09T12:00:00')});
  assert.equal(r.view().dueCount,4);r.send({type:'review'});
  const ids=[];while(r.view().screen==='activity'){ids.push(r.view().activityId);r.step();assert.ok(ids.length<=4);}
  assert.equal(r.view().screen,'review-complete');assert.equal(new Set(ids.map(id=>unit.activities[id].targetId)).size,4);
  assert.equal(r.view().record.reviewEvents.length,4);assert.equal(r.view().completedCount,11);
  for(const [id,v]of Object.entries(initial))assert.equal(r.view().record.results[id].initialEvidence,v.initialEvidence);
});

test('reference listening supports pause, retry, and contact without awarding completion',()=>{
  const h=setup();h.send({type:'references'});h.send({type:'reference-section',id:'lesson3'});h.send({type:'reference-play',id:'L03-D01'});
  h.send({type:'pause'});assert.equal(h.view().audio.status,'paused');h.send({type:'resume-audio'});
  const a=h.view().audio;h.send({type:'audio-error',requestId:a.requestId,index:0,blocked:true});
  h.send({type:'retry-audio'});h.hear();assert.equal(h.view().completedCount,0);assert.deepEqual(h.view().record.completed,{});
  assert.ok(h.view().record.sourceContacts['L03-D01'].modes.includes('heard-in-reference'));
});

test('wrong answer and hint survive refresh without turning supported work into independent work',()=>{
  const h=setup();h.reach('C06:whose-suit');h.hear();const a=unit.activities[h.view().activityId];
  h.send({type:'select',id:a.options.find(o=>!a.answer.includes(o.id)).id});h.send({type:'check'});assert.equal(h.view().feedback,'retry');
  const r=setup({adapter:h.adapter});r.send({type:'open-node',nodeId:'C05'});r.hear();assert.equal(r.view().wrong,1);assert.equal(r.view().hintUsed,true);
  r.step();assert.equal(r.view().record.results[a.resultId].initialEvidence,'supported');
});

test('missing or changed textbook lines and non-cat actors are rejected',()=>{
  const bad=structuredClone(unit);bad.sources['L05-D01'].text='Changed';bad.activities['C06:friends-first'].beats[0].actorEntityId='volvo';
  assert.ok(catalog.validateCourse(bad).some(e=>e.includes('textbook text changed')));
  assert.ok(catalog.validateCourse(bad).some(e=>e.includes('story actor must be cat')));
});

module.exports={setup};

test('every completed node returns through its visible primary action to the path',()=>{
  const h=setup(),render=scene.createRenderer(unit).render;
  for(const node of unit.nodes){
    h.finish(node.id);
    const saved=JSON.stringify(h.view().record);
    const footer=render(h.view()).split('<footer class="lp-footer">').at(-1);
    const action=footer.match(/data-action="([^"]+)"[^>]*class="[^"]*lp-primary/)?.[1];
    assert.equal(action,'map',node.id+': completion must return to the path');
    h.send({type:action});
    assert.equal(h.view().screen,'map');assert.equal(h.view().activityId,null);
    assert.equal(h.view().audio,null);assert.equal(JSON.stringify(h.view().record),saved);
    const restored=setup({adapter:h.adapter});assert.equal(restored.view().screen,'map');
    assert.equal(restored.view().completedCount,h.view().completedCount);
  }
});

test('completion rejects a direct next-node event until the learner returns to the map',()=>{
  const h=setup();h.finish('K01');const saved=JSON.stringify(h.view().record);
  h.send({type:'continue-course'});assert.equal(h.view().screen,'celebration','obsolete continuous-course action must not start another node');
  h.send({type:'open-node',nodeId:'K03'});assert.equal(h.view().screen,'celebration');
  assert.equal(JSON.stringify(h.view().record),saved);
  h.send({type:'map'});h.send({type:'open-node',nodeId:'K03'});
  assert.equal(h.view().screen,'activity');assert.equal(h.view().nodeId,'K03');
});
