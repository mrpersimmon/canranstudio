'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { setup, unit, store } = require('./support/learning-path-harness');
function start(a) {
  const node = { ...unit.nodes.find(n => n.id === a.nodeId), activityIds: [a.id] };
  const scoped = { ...unit, nodes: [node], checkpointIds: [node.id], checkpointActivities: { [node.id]: [a.id] } };
  const s = setup({ unit: scoped, adapter: store.createMemoryAdapter() }); s.send({ type: 'open-node', nodeId: node.id }); return s;
}
test('all three vocabulary groups play one original word per tap with no automatic next word', () => {
  const groups = Object.values(unit.activities).filter(a => a.kind === 'teach');
  assert.deepEqual(groups.map(a => a.items.length), [4, 4, 2]);
  for (const a of groups) {
    const s = start(a); assert.equal(s.view().audio, null);
    for (const item of a.items) {
      assert.equal(s.view().canContinue, false); s.send({ type: 'word-play', id: item.sourceRef });
      const v = s.view(); assert.equal(v.audio.sequence.length, 1); assert.equal(v.audio.rate, 1);
      assert.equal(v.audio.sequence[0].src, unit.sources[item.sourceRef].audioSrc);
      const end = s.rt.dispatch({ type: 'audio-ended', requestId: v.audio.requestId, index: 0 });
      assert.ok(!end.effects.some(e => e.type === 'play-audio')); assert.ok(end.view.heardWords.includes(item.sourceRef));
    }
    assert.equal(s.view().canContinue, true);
  }
});
test('leaving cards cancels playback without crediting stale endings or failed audio', () => {
  const a = Object.values(unit.activities).find(a => a.kind === 'teach'), s = start(a);
  s.send({ type: 'word-play', id: a.items[0].sourceRef }); const stale = s.view().audio;
  s.send({ type: 'map' }); s.send({ type: 'open-node', nodeId: a.nodeId });
  s.send({ type: 'word-play', id: a.items[1].sourceRef }); s.send({ type: 'audio-ended', requestId: stale.requestId, index: 0 });
  assert.deepEqual(s.view().heardWords, []); const current = s.view().audio;
  s.send({ type: 'audio-error', requestId: current.requestId, index: 0, blocked: true });
  s.send({ type: 'continue' }); assert.equal(s.view().screen, 'activity'); assert.deepEqual(s.view().heardWords, []);
  s.send({ type: 'retry-audio' }); s.hear(); assert.deepEqual(s.view().heardWords, [a.items[1].sourceRef]);
});
test('retired speed actions cannot start or switch audio and active sources contain no slow variant', () => {
  assert.equal(unit.audioPolicy.mode, 'original-recordings');
  for (const source of Object.values(unit.sources)) assert.ok(!source.slowAudio);
  const a = Object.values(unit.activities).find(a => a.kind === 'teach'), s = start(a);
  for (const type of ['pace-slow', 'pace-normal', 'replay-slow']) s.send({ type });
  assert.equal(s.view().audio, null);
  s.send({ type: 'word-play', id: a.items[0].sourceRef }); const audio = s.view().audio;
  s.send({ type: 'pace-slow' }); assert.deepEqual(s.view().audio, audio);
});
