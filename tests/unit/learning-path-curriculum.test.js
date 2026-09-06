'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const catalog = require('../../core/curriculum-catalog');
const { createRuntime, validRecord } = require('../../core/learning-path-runtime');
const { createMemoryAdapter } = require('../../core/learning-store');
const { createRenderer } = require('../../core/learning-path-scene');
const previous = require('./fixtures/learning-path-v34-records.json');
const unit = catalog.getPathExperience();
function start(id, adapter = createMemoryAdapter(), now = () => new Date('2026-09-05T12:00:00')) {
  const a = unit.activities[id], node = { ...unit.nodes.find(n => n.id === a.nodeId), activityIds: [id] };
  const scoped = { ...unit, nodes: [node], checkpointIds: [node.id], checkpointActivities: { [node.id]: [id] } };
  const rt = createRuntime({ unit: scoped, adapter, now, random: () => .37 });
  const send = event => rt.dispatch(event);
  send({ type: 'open-node', nodeId: node.id });
  const end = () => { const audio = rt.snapshot().audio; return send({ type: 'audio-ended', requestId: audio.requestId, index: audio.index }); };
  const hear = () => { let guard = 0; while (rt.snapshot().audio?.status === 'playing' && guard++ < 10) end(); };
  const pair = item => { send({ type: 'match-word', id: item.sourceRef }); return send({ type: 'match-image', id: item.entityId }); };
  return { rt, send, end, hear, pair, adapter, view: rt.snapshot, html: () => createRenderer(scoped).render(rt.snapshot()) };
}

test('matching uses visible-word evidence, accepts either selection order, and saves elimination separately', () => {
  const a = unit.activities['v3.5:match:pocket'], s = start(a.id);
  assert.ok(s.html().includes('lp-match-board'));
  assert.equal((s.html().match(/data-action="match-word"/g) || []).length, 4);
  assert.equal((s.html().match(/data-action="match-image"/g) || []).length, 4);
  assert.ok(!s.html().includes('data-action="check"'));
  assert.equal(s.view().audio, null);
  s.send({ type: 'match-listen', id: a.items[0].sourceRef });
  assert.equal(s.view().audio, null, 'unmatched words have no audio cue in a reading task');
  s.send({ type: 'check' }); s.send({ type: 'continue' });
  assert.deepEqual(s.view().record.completed, {});
  s.send({ type: 'match-image', id: a.items[0].entityId });
  assert.equal(Object.keys(s.view().matchedPairs).length, 0);
  s.send({ type: 'match-word', id: a.items[0].sourceRef });
  assert.equal(s.view().matchedPairs[a.items[0].sourceRef].evidence, 'matched-with-options');
  const version = s.adapter.load(s.rt.storageKey).revision;
  s.send({ type: 'match-word', id: a.items[0].sourceRef }); s.send({ type: 'match-image', id: a.items[0].entityId });
  assert.equal(s.adapter.load(s.rt.storageKey).revision, version, 'matched pairs cannot be resubmitted');
  for (const item of a.items.slice(1)) s.pair(item);
  assert.equal(s.view().matchedPairs[a.items.at(-1).sourceRef].evidence, 'elimination-supported');
  s.send({ type: 'continue' });
  const result = s.view().record.results[a.resultId];
  assert.equal(result.assessment.scope, 'practice');
  assert.equal(result.assessment.cue, 'printed-word');
  assert.equal(Object.keys(result.pairs).length, 4);
  assert.ok(validRecord(s.view().record, unit));
  assert.ok(s.html().includes('辅助练习'));
  for (const item of a.items) assert.ok(!s.view().record.sourceContacts[item.sourceRef].modes.includes('retrieved'));
});

test('an incorrect pair stays available, records support, and refresh resumes only unfinished pairs', () => {
  const a = unit.activities['v3.5:match:clothes'], s = start(a.id);
  s.send({ type: 'match-word', id: a.items[0].sourceRef });
  s.send({ type: 'match-image', id: a.items[1].entityId });
  assert.equal(s.view().wrong, 1);
  assert.equal(Object.keys(s.view().matchedPairs).length, 0);
  assert.equal(s.view().matchMessage, 'retry');
  s.pair(a.items[0]);
  assert.equal(s.view().matchedPairs[a.items[0].sourceRef].evidence, 'retry-supported');
  const resumed = start(a.id, s.adapter);
  assert.equal(resumed.view().wrong, 1);
  assert.equal(resumed.view().hintUsed, true);
  assert.equal(Object.keys(resumed.view().matchedPairs).length, 1);
  assert.equal((resumed.html().match(/data-action="match-listen"/g) || []).length, 1);
  for (const item of a.items.slice(1)) resumed.pair(item);
  resumed.send({ type: 'continue' });
  assert.equal(resumed.view().record.results[a.resultId].initialEvidence, 'supported');
  assert.equal(resumed.view().screen, 'celebration', 'a corrected guided group does not force four repeated pairs at the node end');
  assert.equal(resumed.view().record.results[a.resultId].wrong, 1, 'practice never rewrites first-attempt evidence');
});

test('failed or conflicting pair persistence blocks progression and cannot erase another tab', () => {
  const a = unit.activities['v3.5:match:pocket'], memory = createMemoryAdapter();
  let failing = true;
  const adapter = { load: memory.load, commit(...args) { return failing ? { status: 'unavailable', persisted: false } : memory.commit(...args); } };
  const s = start(a.id, adapter);
  s.pair(a.items[0]);
  assert.equal(s.view().saveState, 'failed');
  s.pair(a.items[1]);
  assert.equal(Object.keys(s.view().matchedPairs).length, 1);
  assert.equal(memory.load(s.rt.storageKey).value, null);
  failing = false; s.send({ type: 'save-retry' });
  assert.equal(s.view().saveState, null);
  assert.equal(Object.keys(s.view().record.attempts[a.id].matchedPairs).length, 1);
  const other = start(a.id, memory);
  s.pair(a.items[1]); other.pair(a.items[2]);
  assert.equal(other.view().saveState, 'conflict');
  other.send({ type: 'reload' }); other.send({ type: 'open-node', nodeId: a.nodeId });
  assert.deepEqual(Object.keys(other.view().matchedPairs).sort(), a.items.slice(0, 2).map(item => item.sourceRef).sort());
});

test('matching models are explicit support; matched words replay one at a time using the selected native recording', () => {
  const a = unit.activities['v3.5:match:pocket'], s = start(a.id);
  s.send({ type: 'match-model' });
  const ref = a.items[0].sourceRef;
  assert.equal(s.view().matchedPairs[ref].evidence, 'modeled');
  assert.equal(s.view().hintUsed, true);
  assert.equal(s.view().audio, null);
  s.send({ type: 'match-listen', id: ref });
  assert.equal(s.view().audio.sequence.length, 1);
  assert.equal(s.view().audio.sequence[0].src, unit.sources[ref].audioSrc);
  const stale = s.view().audio;
  s.send({ type: 'match-listen', id: ref });
  assert.equal(s.view().audio.sequence[0].src, unit.sources[ref].audioSrc);
  s.send({ type: 'audio-ended', requestId: stale.requestId, index: 0 });
  assert.equal(s.view().audio.status, 'playing');
  const end = s.end();
  assert.ok(!end.effects.some(effect => effect.type === 'play-audio'));
  assert.equal(s.view().canContinue, false);
  for (const item of a.items.slice(1)) s.pair(item);
  assert.equal(s.view().feedback, 'modeled');
});

test('finishing the final pair survives reload before Continue and rejects malformed pair records', () => {
  const a = unit.activities['v3.5:match:pocket'], s = start(a.id);
  for (const item of a.items) s.pair(item);
  const resumed = start(a.id, s.adapter);
  assert.equal(resumed.view().canContinue, true);
  assert.ok(!resumed.view().record.completed[a.id]);
  resumed.send({ type: 'continue' });
  const record = resumed.view().record;
  assert.ok(record.completed[a.id]); assert.ok(validRecord(record, unit));
  const invalid = JSON.parse(JSON.stringify(record));
  invalid.results[a.resultId].pairs[a.items[0].sourceRef].entityId = 'house';
  assert.equal(validRecord(invalid, unit), false);
});

test('matching review starts a fresh board and repeat cannot modify saved facts', () => {
  const a = unit.activities['v3.5:match:pocket']; let date = '2026-09-05';
  const s = start(a.id, createMemoryAdapter(), () => new Date(`${date}T12:00:00`));
  for (const item of a.items) s.pair(item);
  s.send({ type: 'continue' });
  const original = JSON.stringify(s.adapter.load(s.rt.storageKey));
  s.send({ type: 'open-node', nodeId: a.nodeId });
  assert.equal(s.view().mode, 'repeat');
  assert.deepEqual(s.view().matchedPairs, {});
  s.send({ type: 'match-model' });
  for (const item of a.items.slice(1)) s.pair(item);
  s.send({ type: 'continue' });
  assert.equal(JSON.stringify(s.adapter.load(s.rt.storageKey)), original);
  date = '2026-09-10'; s.send({ type: 'review' });
  assert.equal(s.view().mode, 'review'); assert.deepEqual(s.view().matchedPairs, {});
  for (const item of a.items) s.pair(item);
  s.send({ type: 'continue' });
  assert.equal(s.view().screen, 'review-complete');
  assert.equal(s.view().record.results[a.resultId].nextDueDay, '2026-09-13');
});

test('sentence and dialogue listening lock answers until real ending and hide transcripts before checking', () => {
  for (const id of ['v3.5:listen-watch', 'v3.5:listen-confirmation']) {
    const a = unit.activities[id], s = start(id);
    for (const item of a.requiredAudio) assert.ok(!s.html().includes(item.text));
    assert.ok(!s.html().includes('is-accepted'));
    s.send({ type: 'select', id: a.answer[0] }); s.send({ type: 'check' });
    assert.deepEqual(s.view().selected, []); assert.equal(s.view().feedback, null);
    const old = s.view().audio;
    s.send({ type: 'replay' });
    s.send({ type: 'audio-ended', requestId: old.requestId, index: old.index });
    assert.equal(s.view().requiredDone, false);
    for (const item of a.requiredAudio) { assert.equal(s.view().audio.sequence[s.view().audio.index].src, unit.sources[item.ref].audioSrc); s.end(); }
    s.send({ type: 'replay' });
    assert.equal(s.view().requiredDone, true, 'optional replay does not revoke first-listening evidence');
    s.send({ type: 'select', id: a.answer[0] }); s.send({ type: 'check' });
    assert.equal(s.view().feedback, 'correct');
    if (a.feedbackPlayback === 'support-only') assert.equal(s.view().audio, null, 'correct keyword recognition needs no forced echo');
    else {
      assert.deepEqual(a.requiredAudio.map(item => item.ref), ['NCE-U01-C-Q-CAR', 'L01-D04']);
      assert.deepEqual(s.view().audio.sequence.map(item => item.ref), ['NCE-U01-C-Q-CAR', 'L01-D06'], 'the chosen action makes the keeper repeat and the customer confirm');
      assert.equal(s.view().canContinue, false); s.hear();
    }
    assert.ok(s.html().includes(a.requiredAudio[0].text));
    s.send({ type: 'continue' });
    const result = s.view().record.results[a.resultId];
    assert.equal(result.assessment.skill, id.includes('watch') ? 'sentence-keyword' : 'listening-meaning');
  }
});

test('picture cloze exposes only the sentence frame before checking and records lexical support, not grammar mastery', () => {
  const a = unit.activities['v3.5:complete-coat'], s = start(a.id);
  assert.ok(s.html().includes('lp-cloze-slot'));
  assert.ok(!s.html().includes('Is this your coat?'));
  s.send({ type: 'replay' });
  assert.equal(s.view().audio, null);
  s.send({ type: 'select', id: a.options.find(item => item.id !== a.answer[0]).id });
  s.send({ type: 'check' }); assert.equal(s.view().feedback, 'retry');
  s.send({ type: 'retry' }); s.send({ type: 'select', id: a.answer[0] }); s.send({ type: 'check' });
  assert.ok(s.html().includes('Is this your coat?'));
  assert.equal(s.view().canContinue, false);
  s.send({ type: 'replay' });
  assert.equal(s.view().audio.sequence[0].src, unit.sources['NCE-U01-C-Q-COAT'].audioSrc);
  s.hear(); s.send({ type: 'continue' });
  assert.equal(s.view().record.results[a.resultId].assessment.skill, 'lexical-completion');
  assert.equal(s.view().record.results[a.resultId].initialEvidence, 'supported');
});

test('V3.4 migration preserves the original envelope and cannot credit new matching or listening tasks', () => {
  for (const old of Object.values(previous)) {
    const adapter = createMemoryAdapter(), key = `poc:learning-path:${unit.unitId}:lesson1-2-v3.4`;
    adapter.commit(key, { expectedRevision: 0, value: old });
    const before = adapter.load(key), rt = createRuntime({ unit, adapter }), record = rt.snapshot().record;
    assert.ok(validRecord(record, unit));
    assert.deepEqual(adapter.load(key), before);
    assert.deepEqual(record.archivedProgress['lesson1-2-v3.4'], old);
    for (const id of ['v3.5:match:pocket', 'v3.5:match:clothes', 'v3.5:listen-watch', 'v3.5:complete-coat', 'v3.5:listen-confirmation']) {
      assert.ok(!record.completed[id]); assert.ok(!record.results[unit.activities[id].resultId]);
    }
    assert.deepEqual(record.roleTurns, {});
    assert.deepEqual(record.storyProgress, {});
    assert.equal(rt.snapshot().completedCount, 0);
    for (const result of Object.values(record.results)) assert.equal(result.initialEvidence, old.results[unit.activities[result.activityId].resultId].initialEvidence);
  }
});

test('the user reference stays byte-identical and original recordings stay intact after retiring slow variants', () => {
  const root = path.resolve(__dirname, '../..'), base = path.join(root, 'poc/lesson1-2-experience');
  const sha = bytes => createHash('sha256').update(bytes).digest('hex');
  for (const folder of ['slow-v34', 'slow-v35']) {
    const manifest = JSON.parse(fs.readFileSync(path.join(base, 'audio', folder, 'manifest.json')));
    for (const file of manifest.files) {
      const source = unit.sources[file.sourceId];
      assert.equal(file.originalSha256, sha(fs.readFileSync(path.join(base, source.audioSrc.replace('/poc/lesson-1-2/course/', '')))));
      assert.ok(!source.slowAudio);
    }
  }
  const reference = fs.readFileSync(path.join(root, 'docs/references/duolingo/2026-09-05/用户提供-题型与学习活动汇总.txt'));
  assert.equal(sha(reference), '7ceefda38f56230cebc4530abf91e51725e38e99aabfd591a0d7d8da04bf7e70');
});
