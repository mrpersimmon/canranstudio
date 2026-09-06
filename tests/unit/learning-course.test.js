'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const catalog=require('../../core/learning-course-catalog');
const runtime=require('../../core/learning-path-runtime');
const scene=require('../../core/learning-path-scene');
const store=require('../../core/learning-store');
const oldHarness=require('./support/learning-path-harness');
const unit=catalog.getCourse();

function setup(options={}) {
  const adapter=options.adapter||store.createMemoryAdapter();
  const rt=runtime.createRuntime({unit,adapter,now:()=>new Date('2026-09-06T12:00:00'),random:()=>.37,...options});
  const view=rt.snapshot;
  const send=event=>{const v=rt.dispatch(event).view;assert.notEqual(v.screen,'blocked',JSON.stringify(event));assert.equal(v.saveState,null);assert.ok(runtime.validRecord(v.record,unit),JSON.stringify(event));assert.doesNotMatch(scene.createRenderer(unit).render(v),/src="(?:undefined)?"/);return v;};
  const hear=()=>{for(let i=0;view().audio?.status==='playing'&&i<25;i++){const a=view().audio;send({type:'audio-ended',requestId:a.requestId,index:a.index});}};
  function step(){const a=unit.activities[view().activityId];if(a.kind==='interactive-story'&&!view().storyRevealed)send({type:'story-start'});hear();
    if(a.kind==='teach')for(const item of a.items){send({type:'word-play',id:item.sourceRef});hear();}
    else if(a.kind==='match')for(const item of a.items){send({type:'match-word',id:item.sourceRef});send({type:'match-image',id:item.entityId});}
    else if(a.resultId){for(const id of a.answer)send({type:'select',id});send({type:'check'});hear();}
    send({type:'continue'});
  }
  function finish(id){send({type:'open-node',nodeId:id});let guard=0;while(view().screen==='activity'&&guard++<100)step();assert.equal(view().screen,'celebration',id);}
  function reach(id){for(const node of unit.nodes){send({type:'open-node',nodeId:node.id});let guard=0;while(view().screen==='activity'&&guard++<100){if(view().activityId===id)return;step();}}throw Error('Cannot reach '+id);}
  return {adapter,rt,view,send,hear,step,finish,reach};
}

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
  h.send({type:'continue-course'});assert.equal(h.view().activityId,'C06:cloak-words');
});

test('manual teaching cards persist only ended recordings and recover after refresh',()=>{
  const h=setup();h.reach('C06:cloak-words');
  assert.equal(h.view().audio,null);assert.equal(h.view().canContinue,false);
  h.send({type:'word-play',id:'L03-W01'});const obsolete=h.view().audio;
  h.send({type:'word-play',id:'L03-W05'});
  assert.deepEqual(h.view().heardWords,[]);assert.equal(h.view().audio.requestId,obsolete.requestId);
  h.send({type:'audio-ended',requestId:obsolete.requestId,index:0});
  assert.deepEqual(h.view().heardWords,['L03-W01']);h.hear();assert.deepEqual(h.view().heardWords,['L03-W01','L03-W05']);
  const r=setup({adapter:h.adapter});r.send({type:'continue-course'});assert.deepEqual(r.view().heardWords,['L03-W01','L03-W05']);assert.equal(r.view().canContinue,false);
  r.send({type:'continue'});assert.equal(r.view().activityId,'C06:cloak-words');
});

test('new story advances only after ended audio and a manual continue, and restores the next turn',()=>{
  const h=setup();h.reach('C06:umbrella-story');
  h.send({type:'continue'});assert.equal(h.view().storyIndex,0);
  h.send({type:'story-start'});h.send({type:'continue'});assert.equal(h.view().storyIndex,0);
  h.hear();assert.equal(h.view().storyIndex,0);h.send({type:'continue'});assert.equal(h.view().storyIndex,1);
  const r=setup({adapter:h.adapter});r.send({type:'continue-course'});assert.equal(r.view().storyIndex,1);assert.equal(r.view().audio,null);
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
  const r=setup({adapter:h.adapter});r.send({type:'continue-course'});r.hear();assert.equal(r.view().wrong,1);assert.equal(r.view().hintUsed,true);
  r.step();assert.equal(r.view().record.results[a.resultId].initialEvidence,'supported');
});

test('missing or changed textbook lines and non-cat actors are rejected',()=>{
  const bad=structuredClone(unit);bad.sources['L05-D01'].text='Changed';bad.activities['C06:friends-first'].beats[0].actorEntityId='volvo';
  assert.ok(catalog.validateCourse(bad).some(e=>e.includes('textbook text changed')));
  assert.ok(catalog.validateCourse(bad).some(e=>e.includes('story actor must be cat')));
});

module.exports={setup};
