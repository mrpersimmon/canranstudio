'use strict';
const assert = require('node:assert/strict');
const catalog = require('../../../core/curriculum-catalog');
const runtime = require('../../../core/learning-path-runtime');
const store = require('../../../core/learning-store');
const scene = require('../../../core/learning-path-scene');
const unit = catalog.getPathExperience();
const story = Object.values(unit.activities).find(a => a.kind === 'interactive-story');
function setup(options = {}) {
  const adapter = options.adapter || store.createMemoryAdapter();
  const rt = runtime.createRuntime({ unit, adapter, now: () => new Date('2026-09-05T12:00:00'), random: () => .37, ...options });
  const send = event => rt.dispatch(event).view, view = rt.snapshot;
  function hear() {
    let guard = 0;
    while (view().audio?.status === 'playing' && guard++ < 20) {
      const a = view().audio; send({ type: 'audio-ended', requestId: a.requestId, index: a.index });
    }
  }
  function answer(a = unit.activities[view().activityId]) {
    for (const id of a.answer) send({ type: 'select', id });
    send({ type: 'check' }); hear();
  }
  function completeStep() {
    const a = unit.activities[view().activityId];
    if (a.kind === 'interactive-story' && !view().storyRevealed) send({ type: 'story-start' });
    hear();
    if (a.kind === 'teach') for (const item of a.items) { send({ type: 'word-play', id: item.sourceRef }); hear(); }
    else if (a.kind === 'match') for (const item of a.items) { send({ type: 'match-word', id: item.sourceRef }); send({ type: 'match-image', id: item.entityId }); }
    else if (a.resultId) answer(a);
    send({ type: 'continue' });
  }
  function finishNode(nodeId) {
    send({ type: 'open-node', nodeId }); let guard = 0;
    while (view().screen === 'activity' && guard++ < 100) completeStep();
    assert.equal(view().screen, 'celebration');
  }
  function reach(id) {
    for (const n of unit.nodes) {
      send({ type: 'open-node', nodeId: n.id }); let guard = 0;
      while (view().screen === 'activity' && guard++ < 100) { if (view().activityId === id) return; completeStep(); }
    }
    throw Error(`Activity not reached: ${id}`);
  }
  return { adapter, rt, send, view, hear, answer, completeStep, finishNode, reach, html: () => scene.createRenderer(options.unit || unit).render(view()) };
}
module.exports = { setup, unit, story, runtime, store, catalog };
