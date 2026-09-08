'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {getCourse} = require('../../core/learning-course-catalog');
const {createRuntime} = require('../../core/learning-path-runtime');
const {createMemoryAdapter} = require('../../core/learning-store');
const {describe, render} = require('../../core/learning-journey');
const unit = getCourse();
function setup() { const adapter = createMemoryAdapter(); return {adapter, rt:createRuntime({unit, adapter})}; }

test('paired Lesson sections and exact review coverage stay visible without changing node identities', () => {
  assert.deepEqual(unit.chapters.map(c=>c.lessonIds),Array.from({length:72},(_,i)=>[2*i+1,2*i+2]));
  assert.deepEqual(unit.nodes.slice(0,11).map(n=>n.id), ['K01','K03','K04','C04','C05','R01','C07','C08','C09','C10','R02']);
  const {rt}=setup(),v=rt.snapshot(),html=render(unit,v);
  for(const [first,second] of Array.from({length:72},(_,i)=>[2*i+1,2*i+2])) assert.ok(html.includes(`Lesson ${first} &amp; ${second}`));
  for(const [id,label] of [['C04','Lesson 3'],['R01','Lesson 1–4'],['R02','Lesson 1–6']]) {
    const preview=render(unit,{...v,journeyUI:{tab:'path',selectedNodeId:id}});
    assert.ok(preview.includes(label));
  }
  for(const node of unit.nodes)assert.ok(unit.chapters.some(c=>c.id===node.chapterId));
});

test('journey previews and tabs are read-only and locked previews cannot start a later lesson', () => {
  const {rt, adapter} = setup();
  const before = adapter.load(rt.storageKey);
  for (const tab of ['path', 'review', 'progress']) {
    const html = render(unit, {...rt.snapshot(), journeyUI:{tab, selectedNodeId:'C04'}});
    assert.doesNotMatch(html, /(?:undefined|NaN)/);
    if (tab === 'path') {
      assert.match(html, /data-action="open-placement" data-id="umbrella"/);
      assert.doesNotMatch(html, /data-action="open-node" data-id="C04"/);
    }
  }
  const locked=render(unit,{...rt.snapshot(),journeyUI:{tab:'path',selectedNodeId:'C05'}});
  assert.match(locked,/data-action="open-node" data-id="C05"[^>]* disabled/);
  assert.deepEqual(adapter.load(rt.storageKey), before);
  assert.equal(rt.dispatch({type:'open-node', nodeId:'C04'}).view.screen, 'map');
  assert.equal(rt.snapshot().completedCount, 0);
});

test('journey reports real heard evidence without treating reference listening as lesson completion', () => {
  const {rt} = setup();
  assert.equal(describe(unit,rt.snapshot()).heard,0);
  rt.dispatch({type:'references'}); rt.dispatch({type:'reference-section',id:'lesson1'});
  let v = rt.dispatch({type:'reference-play',id:'L01-D01'}).view;
  assert.equal(describe(unit,v).heard,0,'starting audio is not hearing it');
  v = rt.dispatch({type:'audio-ended',requestId:v.audio.requestId,index:v.audio.index}).view;
  const model = describe(unit,v);
  assert.equal(model.heard,1);
  assert.equal(model.currentId,'K01');
  assert.equal(model.practiced,0);
  assert.equal(model.chapters[0].done,0);
});

test('all roadmap titles remain inspectable and the current node is uniquely identified', () => {
  const {rt} = setup(); const v = rt.snapshot();
  const html = render(unit,v);
  assert.equal((html.match(/data-journey-current/g)||[]).length,1);
  for (const node of unit.nodes) {
    const preview = render(unit,{...v,journeyUI:{tab:'path',selectedNodeId:node.id}});
    assert.ok(preview.includes('id="journey-preview-'+node.id+'"'));
    assert.ok(preview.includes(node.title));
  }
  assert.ok(!html.includes('data-action="review"'),'empty review is a destination, not a dead start action');
});

test('a partly heard story shows Continue while keeping its node incomplete', () => {
  const {rt} = setup(); rt.dispatch({type:'open-node',nodeId:'K01'});
  const v = rt.dispatch({type:'story-start'}).view;
  rt.dispatch({type:'audio-ended',requestId:v.audio.requestId,index:v.audio.index});
  rt.dispatch({type:'continue'}); const map = rt.dispatch({type:'map'}).view;
  const model = describe(unit,map);
  assert.equal(model.nodes[0].started,true);
  assert.equal(model.nodes[0].done,false);
  assert.match(render(unit,map), /journey-start-hint[^>]*><span>继续<\/span>/);
});
