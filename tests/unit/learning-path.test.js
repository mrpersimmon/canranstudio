'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const { setup, unit, story, runtime, store, catalog } = require('./support/learning-path-harness');
const clone = value => JSON.parse(JSON.stringify(value));
const priorSets = [
  ['lesson1-2-v3.1', require('./fixtures/learning-path-v31-records.json')],
  ['lesson1-2-v3.2', require('./fixtures/learning-path-v32-records.json')],
  ['lesson1-2-v3.3', require('./fixtures/learning-path-v33-records.json')],
  ['lesson1-2-v3.4', require('./fixtures/learning-path-v34-records.json')],
  ['lesson1-2-v3.5', require('./fixtures/learning-path-v35-records.json')]
];
function all(s = setup()) { for (const n of unit.nodes) s.finishNode(n.id); return s; }
function firstLine(s) { s.send({ type: 'open-node', nodeId: 'K01' }); s.send({ type: 'story-start' }); s.hear(); }

test('V3.6 is one interactive story and nine later activities; V2 and all seven source lines remain intact', () => {
  assert.deepEqual(catalog.validatePathExperience(), []);
  assert.equal(unit.nodes.length, 3); assert.equal(unit.nodes.flatMap(n => n.activityIds).length, 10);
  assert.deepEqual(unit.nodes[0].activityIds, [story.id]);
  assert.equal(Object.values(unit.activities).filter(a => a.assessment?.scope === 'assessment').length, 7);
  assert.equal(Object.values(unit.activities).filter(a => a.assessment?.scope === 'practice').length, 2);
  assert.equal(Object.values(unit.activities).filter(a => ['role', 'dialogue'].includes(a.kind)).length, 0);
  const original = catalog.getTeachingUnit('NCE-U01'); assert.equal(original.experienceRevision, 'lesson1-2-v2.6');
  for (const ref of unit.dialogueRefs) assert.equal(unit.sources[ref].text, original.lessonContent.lesson1.sources[ref].text);
  for (const id of unit.experience.scene.actorEntityIds) assert.equal(unit.entities[id].characterSpecies, 'cat');
});
test('the whole path completes with separately scoped answers, matching support, and actual story hearing', () => {
  const s = all(), v = s.view();
  assert.equal(v.completedCount, 3); assert.equal(Object.keys(v.record.results).length, 9);
  assert.equal(Object.keys(v.record.completed).length, 13); assert.ok(runtime.validRecord(v.record, unit));
  assert.equal(Object.keys(v.record.storyProgress[story.id].beats).length, 10);
  for (const ref of unit.dialogueRefs) assert.ok(v.record.sourceContacts[ref].modes.includes('heard'));
  for (const ref of ['L01-I01', 'L02-I01']) {
    assert.ok(v.record.sourceContacts[ref].modes.includes('implemented-in-flow'));
    assert.ok(!v.record.sourceContacts[ref].modes.includes('observed'), 'hidden boilerplate was not read');
  }
  assert.ok(!v.record.sourceContacts['L01-N01'], 'unopened optional notes were not read');
  assert.ok(v.record.sourceContacts['L01-Q01'].modes.includes('posed-in-context'));
  assert.ok(v.record.storyFacts['handbag-returned']); assert.ok(v.record.storyFacts['customer-arrived-home']);
  assert.ok(Object.values(v.record.results).every(r => r.initialEvidence === 'independent'));
  assert.ok(!JSON.stringify(v.record.results).includes('oral-proficiency'));
});
test('later nodes remain locked until the last original story line has actually finished and saved', () => {
  const s = setup(); s.send({ type: 'open-node', nodeId: 'K03' }); assert.equal(s.view().screen, 'map');
  s.send({ type: 'open-node', nodeId: 'K01' });
  for (let i = 0; i < 9; i++) s.completeStep();
  assert.equal(s.view().audio.sequence[0].ref, 'L01-D07');
  s.send({ type: 'continue' }); assert.equal(s.view().completedCount, 0);
  s.hear(); s.send({ type: 'continue' }); assert.equal(s.view().completedCount, 1);
  assert.ok(s.view().nodes[1].available);
});
test('refresh resumes the next unsaved beat without replaying completed story sections', () => {
  const s = setup(); firstLine(s); s.send({ type: 'continue' }); s.hear(); s.send({ type: 'continue' });
  const other = setup({ adapter: s.adapter }); other.send({ type: 'open-node', nodeId: 'K01' });
  assert.equal(other.view().storyIndex, 2); assert.equal(other.view().audio, null);
  assert.ok(other.html().includes('data-turn-ref="L01-D01"')); assert.ok(!other.html().includes('data-turn-ref="L01-D03"'));
  other.send({ type: 'story-start' }); assert.equal(other.view().audio.sequence[0].ref, 'L01-D03');
});
test('story choices remain reversible before checking, and confirmation persists at Continue', () => {
  const s = setup(); s.reach('v3.6:story:owner'); const a = unit.activities[s.view().activityId];
  s.send({ type: 'select', id: 'station-keeper' }); assert.equal(s.view().wrong, 0);
  s.send({ type: 'select', id: 'handbag-owner' }); s.send({ type: 'check' });
  assert.equal(s.view().feedback, 'correct'); assert.equal(s.view().audio, null);
  assert.ok(!s.view().record.completed[a.id]); s.send({ type: 'continue' });
  assert.equal(s.view().record.results[a.resultId].initialEvidence, 'independent');
  assert.ok(s.view().record.storyFacts['handbag-returned']); assert.ok(runtime.validRecord(s.view().record, unit));
});
test('wrong story choices survive refresh and two errors provide support without replaying the whole story', () => {
  const s = setup(); s.reach('v3.6:story:repair'); const a = unit.activities[s.view().activityId];
  const wrong = a.options.find(o => !a.answer.includes(o.id)).id;
  s.send({ type: 'select', id: wrong }); s.send({ type: 'check' }); assert.equal(s.view().feedback, 'retry');
  s.send({ type: 'continue' }); assert.equal(s.view().activityId, a.id);
  const r = setup({ adapter: s.adapter }); r.send({ type: 'open-node', nodeId: 'K01' });
  assert.equal(r.view().activityId, a.id); assert.equal(r.view().wrong, 1); assert.equal(r.view().hintUsed, true);
  r.send({ type: 'select', id: wrong }); r.send({ type: 'check' }); assert.equal(r.view().feedback, 'modeled');
  r.send({ type: 'continue' }); assert.equal(r.view().storyIndex, 5);
  while (r.view().screen === 'activity') r.completeStep();
  assert.equal(r.view().record.results[a.resultId].initialEvidence, 'modeled');
  assert.equal(r.view().screen, 'celebration'); assert.ok(!r.view().extraPractice);
});
test('an explicit story note is optional and recorded only after the learner opens it', () => {
  const s = setup(); firstLine(s);
  assert.ok(!s.view().record.sourceContacts['L01-N01']);
  s.send({ type: 'story-help' }); assert.ok(s.html().includes(unit.sources['L01-N01'].text));
  assert.deepEqual(s.view().record.sourceContacts['L01-N01'].modes, ['observed']);
  assert.ok(!s.view().record.completed[story.id]);
});
test('failed story saves stay on the same beat and retry commits once before advancing', () => {
  const memory = store.createMemoryAdapter(); let failing = true, writes = 0;
  const adapter = { load: memory.load, commit(...args) { writes++; return failing ? { status: 'unavailable', persisted: false } : memory.commit(...args); } };
  const s = setup({ adapter }); firstLine(s); s.send({ type: 'continue' });
  assert.equal(s.view().saveState, 'failed'); assert.equal(s.view().storyIndex, 0);
  assert.deepEqual(s.view().record.storyProgress, {}); s.send({ type: 'continue' }); assert.equal(writes, 1);
  failing = false; s.send({ type: 'save-retry' }); assert.equal(writes, 2); assert.equal(s.view().storyIndex, 1);
  assert.equal(s.view().audio.sequence[0].ref, 'L01-D02'); assert.ok(runtime.validRecord(s.view().record, unit));
});
test('failed checkpoint persistence cannot advance, lose the answer, or credit a new line', () => {
  const s = setup(); s.reach('v3.6:story:thanks'); let fail = true;
  const r = setup({ adapter: { load: s.adapter.load, commit(...args) { return fail ? { status: 'unavailable', persisted: false } : s.adapter.commit(...args); } } });
  r.send({ type: 'open-node', nodeId: 'K01' }); r.answer(); r.send({ type: 'continue' });
  assert.equal(r.view().saveState, 'failed'); assert.equal(r.view().storyIndex, 8);
  fail = false; r.send({ type: 'save-retry' }); assert.equal(r.view().storyIndex, 9);
  assert.ok(!r.view().record.completed[story.id]); assert.ok(runtime.validRecord(r.view().record, unit));
});
test('conflicting tabs cannot overwrite newer story progress', () => {
  const memory = store.createMemoryAdapter(), a = setup({ adapter: memory }), b = setup({ adapter: memory });
  firstLine(a); firstLine(b); a.send({ type: 'continue' }); b.send({ type: 'continue' });
  assert.equal(b.view().saveState, 'conflict'); b.send({ type: 'reload' }); b.send({ type: 'open-node', nodeId: 'K01' });
  assert.equal(b.view().storyIndex, 1); assert.equal(memory.load(a.rt.storageKey).revision, 1);
});
test('corrupt storage at entry or after opening is never overwritten', () => {
  let writes = 0, broken = false; const memory = store.createMemoryAdapter();
  const adapter = { load: key => broken ? { status: 'corrupt', revision: 0, value: null } : memory.load(key), commit(...args) { writes++; return memory.commit(...args); } };
  const s = setup({ adapter }); firstLine(s); broken = true; s.send({ type: 'continue' });
  assert.equal(s.view().saveState, 'unreadable'); s.send({ type: 'save-retry' }); assert.equal(writes, 0);
  const other = setup({ adapter }); assert.equal(other.view().screen, 'blocked'); assert.equal(writes, 0);
});
test('story proof rejects skipped lines, wrong speakers, missing answer proof and premature completion', () => {
  const full = all().view().record;
  for (const corrupt of [
    r => delete r.storyProgress[story.id].beats['L01-D03'],
    r => r.storyProgress[story.id].beats['L01-D02'].actorEntityId = 'station-keeper',
    r => delete r.results['v3.6:story:owner:result'],
    r => delete r.completed['v3.6:story:owner'],
    r => r.storyProgress[story.id].beats['alien'] = { kind: 'line', at: 'now' },
    r => delete r.completed[story.id]
  ]) { const record = clone(full); corrupt(record); assert.equal(runtime.validRecord(record, unit), false); }
  const empty = runtime.emptyRecord(unit); empty.completed[story.id] = { at: 'now' }; assert.equal(runtime.validRecord(empty, unit), false);
});
test('replaying a completed story uses a fresh local session and cannot change saved progress or scores', () => {
  const s = setup(); s.finishNode('K01'); const before = clone(s.adapter.load(s.rt.storageKey));
  s.send({ type: 'open-node', nodeId: 'K01' }); assert.equal(s.view().mode, 'repeat'); assert.equal(s.view().storyIndex, 0);
  assert.deepEqual(s.view().storyBeats, {}); s.send({ type: 'story-start' }); s.hear(); s.send({ type: 'story-help' });
  while (s.view().screen === 'activity') s.completeStep();
  assert.deepEqual(s.adapter.load(s.rt.storageKey), before);
});
test('daily review supplies context for embedded questions, then updates review dates without rewriting the story', () => {
  let date = '2026-09-05'; const s = setup({ now: () => new Date(`${date}T12:00:00`) }); s.finishNode('K01');
  const proof = clone(s.view().record.storyProgress); date = '2026-09-06'; s.send({ type: 'review' });
  assert.equal(s.view().mode, 'review'); assert.equal(s.view().storyActivityId, null); assert.equal(s.view().requiredDone, false);
  const a = unit.activities[s.view().activityId]; assert.deepEqual(s.view().audio.sequence.map(x => x.ref), a.requiredAudio.map(x => x.ref));
  s.send({ type: 'select', id: a.answer[0] }); assert.deepEqual(s.view().selected, []);
  let guard = 0; while (s.view().screen === 'activity' && guard++ < 20) s.completeStep();
  assert.equal(s.view().screen, 'review-complete'); assert.deepEqual(s.view().record.storyProgress, proof);
  assert.ok(Object.values(s.view().record.results).every(r => r.nextDueDay === '2026-09-09' && r.initialEvidence === 'independent'));
});
for (const [revision, fixtures] of priorSets) test(`${revision} migration archives the exact old record and never credits the new interactive story`, () => {
  for (const old of Object.values(fixtures).filter(v => v && typeof v === 'object' && v.schema)) {
    const key = `poc:learning-path:${unit.unitId}:${revision}`, memory = store.createMemoryAdapter({ [key]: { revision: 7, value: old } });
    const before = memory.load(key), s = setup({ adapter: memory }), r = s.view().record;
    assert.equal(s.view().screen, 'map'); assert.ok(runtime.validRecord(r, unit));
    assert.deepEqual(r.archivedProgress[revision], old); assert.deepEqual(memory.load(key), before);
    assert.deepEqual(r.storyProgress, {}); assert.deepEqual(r.roleTurns, {}); assert.ok(!r.completed[story.id]);
    for (const a of Object.values(unit.activities).filter(a => a.embeddedIn)) assert.ok(!r.results[a.resultId]);
    for (const [id, result] of Object.entries(r.results)) {
      assert.deepEqual({ ...old.results[id], assessment: unit.activities[result.activityId].assessment }, result);
    }
    for (const [id, attempt] of Object.entries(r.attempts)) assert.deepEqual(attempt, old.attempts[id]);
    s.send({ type: 'open-node', nodeId: 'K01' }); assert.equal(s.view().storyIndex, 0); assert.equal(s.view().audio, null);
    s.send({ type: 'reload' }); assert.equal(memory.load(s.rt.storageKey).revision, 1);
  }
});
test('a completed V3.5 path retains both unchanged later nodes while requiring the new opening', () => {
  const old = require('./fixtures/learning-path-v35-records.json').fullPath, key = `poc:learning-path:${unit.unitId}:lesson1-2-v3.5`;
  const s = setup({ adapter: store.createMemoryAdapter({ [key]: { revision: 4, value: old } }) });
  assert.equal(s.view().completedCount, 2); assert.deepEqual(s.view().nodes.map(n => n.done), [false, true, true]);
  s.finishNode('K01'); assert.equal(s.view().completedCount, 3);
});
test('compatible migration retries a failed save once; existing V3.6 records take precedence', () => {
  const old = require('./fixtures/learning-path-v35-records.json').fullPath;
  const key = `poc:learning-path:${unit.unitId}:lesson1-2-v3.5`, memory = store.createMemoryAdapter({ [key]: { revision: 4, value: old } });
  let failing = true; const s = setup({ adapter: { load: memory.load, commit(...args) { return failing ? { status: 'unavailable', persisted: false } : memory.commit(...args); } } });
  assert.equal(s.view().saveState, 'failed'); assert.equal(memory.load(s.rt.storageKey).value, null);
  failing = false; s.send({ type: 'save-retry' }); assert.equal(s.view().completedCount, 2); assert.deepEqual(memory.load(key).value, old);
  const empty = runtime.emptyRecord(unit), currentKey = s.rt.storageKey;
  const both = store.createMemoryAdapter({ [key]: { revision: 4, value: old }, [currentKey]: { revision: 2, value: empty } });
  assert.deepEqual(setup({ adapter: both }).view().record, empty);
});
test('malformed compatible records block migration without destroying the old envelope', () => {
  const old = clone(require('./fixtures/learning-path-v35-records.json').fullPath); old.completed.alien = { at: 'now' };
  const key = `poc:learning-path:${unit.unitId}:lesson1-2-v3.5`, memory = store.createMemoryAdapter({ [key]: { revision: 4, value: old } });
  let writes = 0; const s = setup({ adapter: { load: memory.load, commit() { writes++; } } });
  assert.equal(s.view().screen, 'blocked'); assert.equal(writes, 0); assert.deepEqual(memory.load(key).value, old);
});
test('legacy V2 hearing stays historical and never completes the new interactive story', () => {
  const old = { schemaVersion: 1, units: { [unit.unitId]: { experienceRevision: unit.legacy.revision, completedMicrotaskIds: ['L01-M07'], sourceContacts: Object.fromEntries(unit.dialogueRefs.map(ref => [ref, { contactModes: ['audio-ended'] }])) } } };
  const memory = store.createMemoryAdapter({ [unit.legacy.storageKey]: { revision: 1, value: old } });
  const s = setup({ adapter: memory }); assert.ok(s.view().record.legacyFacts.fullDialogueHeard);
  assert.deepEqual(s.view().record.completed, {}); assert.deepEqual(s.view().record.storyProgress, {});
  assert.deepEqual(memory.load(unit.legacy.storageKey).value, old);
});
