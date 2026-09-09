'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { setup } = require('./support/course-harness');
const unit = require('../../core/learning-course-catalog').getCourse();
const scene = require('../../core/learning-path-scene');
test('each run measures only its own work and finishes at 100 percent', () => {
  const h = setup();
  for (const node of unit.nodes) {
    h.send({type:'map'}); h.send({type:'open-node',nodeId:node.id});
    assert.equal(h.view().sessionProgress.completed,0,node.id);
    let previous = 0;
    while(h.view().screen==='activity') {
      h.step();
      const p = h.view().sessionProgress;
      assert.ok(p.completed>=previous&&p.completed<=p.total,node.id);
      previous=p.completed;
    }
    const p=h.view().sessionProgress;
    assert.equal(p.completed,p.total,node.id);
    const html=scene.createRenderer(unit).render(h.view());
    assert.doesNotMatch(html,/<header|role="progressbar"/,'settlement no longer looks like an active lesson');
    assert.equal(h.view().settlement.completed,p.total);
    assert.equal(h.view().settlement.finished,true);
    assert.equal((html.match(/data-settlement-value/g)||[]).length,3);
  }
  h.send({type:'map'});h.send({type:'open-node',nodeId:'K01'});
  assert.equal(h.view().sessionProgress.completed,0,'replay starts a new run');
});
test('resuming a story counts remaining beats; references do not masquerade as a lesson', () => {
  const h=setup();h.send({type:'open-node',nodeId:'K01'});h.step();h.step();
  const r=setup({adapter:h.adapter});r.send({type:'open-node',nodeId:'K01'});
  assert.deepEqual(r.view().sessionProgress,{completed:0,total:8});
  r.send({type:'references'});
  assert.doesNotMatch(scene.createRenderer(unit).render(r.view()).match(/<header[^]*?<\/header>/)[0],/role="progressbar"/);
});
