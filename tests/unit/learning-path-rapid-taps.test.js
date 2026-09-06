'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { setup, store } = require('./support/learning-path-harness');
const course = require('../../core/learning-course-catalog').getCourse();
function start(activity, adapter = store.createMemoryAdapter()) {
  const node = { ...course.nodes.find(n => n.id === activity.nodeId), activityIds: [activity.id] };
  const unit = { ...course, nodes: [node], checkpointIds: [node.id], checkpointActivities: { [node.id]: [activity.id] } };
  const h = setup({ unit, adapter });
  h.send({ type: 'open-node', nodeId: node.id });
  return h;
}
function finishOne(h) {
  const a = h.view().audio;
  return h.send({ type: 'audio-ended', requestId: a.requestId, index: a.index });
}
test('rapid taps on every teaching group queue explicit choices and persist every real ending once', () => {
  for (const a of Object.values(course.activities).filter(a => a.kind === 'teach')) {
    const h = start(a);
    for (const item of a.items) h.send({ type: 'word-play', id: item.sourceRef });
    assert.equal(h.view().audio.sequence[0].ref, a.items[0].sourceRef, a.id + ': first click must not be interrupted');
    assert.deepEqual(h.view().heardWords, []);
    for (let i = 0; i < a.items.length; i++) {
      assert.equal(h.view().audio.sequence[0].ref, a.items[i].sourceRef);
      const active = h.view().audio;
      finishOne(h);
      // Duplicate or late media events cannot count twice or finish the next word.
      h.send({ type: 'audio-ended', requestId: active.requestId, index: active.index });
      const expected = a.items.slice(0, i + 1).map(item => item.sourceRef);
      assert.deepEqual(h.view().heardWords, expected);
      assert.deepEqual(h.view().record.teachingProgress[a.id], expected);
    }
    assert.equal(h.view().canContinue, true);
    assert.equal(h.view().audio.status, 'ended');
    assert.deepEqual(start(a, h.adapter).view().heardWords, a.items.map(item => item.sourceRef));
  }
});
test('repeated rapid taps do not restart or duplicate the current and queued words', () => {
  const a = course.activities['v3.1:words:clothes'], h = start(a);
  h.send({ type: 'word-play', id: a.items[0].sourceRef });
  const id = h.view().audio.requestId;
  for (let i = 0; i < 20; i++) for (const item of a.items.slice(0, 2)) h.send({ type: 'word-play', id: item.sourceRef });
  assert.equal(h.view().audio.requestId, id);
  assert.deepEqual(h.view().wordQueue, [a.items[1].sourceRef]);
  h.hear(); assert.equal(h.view().heardWords.length, 2);
  assert.equal(h.view().audio.status, 'ended');
});
test('queued words wait through pause and failed audio, then stop when leaving the activity', () => {
  const a = course.activities['v3.1:words:clothes'], h = start(a);
  for (const item of a.items) h.send({ type: 'word-play', id: item.sourceRef });
  h.send({ type: 'pause' }); const first = h.view().audio;
  finishOne(h); assert.deepEqual(h.view().heardWords, []);
  h.send({ type: 'resume-audio' });
  h.send({ type: 'audio-error', requestId: first.requestId, index: 0, blocked: true });
  assert.deepEqual(h.view().heardWords, []); assert.equal(h.view().canContinue, false);
  h.send({ type: 'retry-audio' }); finishOne(h);
  assert.deepEqual(h.view().heardWords, [a.items[0].sourceRef]);
  const pending = h.view().audio;
  h.send({ type: 'map' });
  h.send({ type: 'audio-ended', requestId: pending.requestId, index: 0 });
  assert.equal(h.view().audio, null); assert.deepEqual(h.view().wordQueue, []);
  const restored = start(a, h.adapter);
  assert.deepEqual(restored.view().heardWords, [a.items[0].sourceRef]);
  assert.equal(restored.view().audio, null);
});

test('a failed save pauses the queue and retry resumes only after evidence is persisted', () => {
  const a=course.activities['v3.1:words:clothes'], memory=store.createMemoryAdapter();
  let failed=false;
  const adapter={load:key=>memory.load(key),commit:(...args)=>failed?{status:'unavailable',persisted:false}:memory.commit(...args)};
  const h=start(a,adapter);
  for(const item of a.items)h.send({type:'word-play',id:item.sourceRef});
  failed=true;finishOne(h);
  assert.equal(h.view().saveState,'failed');assert.equal(h.view().audio,null);
  assert.equal(h.view().record.teachingProgress[a.id],undefined);
  assert.equal(h.view().wordQueue.length,a.items.length-1);
  failed=false;h.send({type:'save-retry'});
  assert.deepEqual(h.view().record.teachingProgress[a.id],[a.items[0].sourceRef]);
  assert.equal(h.view().audio.sequence[0].ref,a.items[1].sourceRef);
  h.hear();assert.equal(h.view().canContinue,true);
  // Even a replay of an already-heard word must finish before leaving.
  h.send({type:'word-play',id:a.items[0].sourceRef});h.send({type:'continue'});
  assert.equal(h.view().screen,'activity');h.hear();h.send({type:'continue'});
  assert.equal(h.view().screen,'celebration');
});
