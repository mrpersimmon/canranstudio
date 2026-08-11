'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = require('../../core/curriculum-catalog');
const { open } = require('../../core/learning-ledger');
const { createMemoryAdapter } = require('../../core/learning-store');
const { create: createRuntime } = require('../../core/learning-runtime');

function fixedClock(initialDay = '2026-08-10') {
  let day = initialDay;
  return {
    learningDay: () => day,
    set(nextDay) {
      day = nextDay;
    }
  };
}

function recordingStore(loadResult = { status: 'ok', revision: 0, value: null }) {
  let record = structuredClone(loadResult);
  return {
    load() {
      return structuredClone(record);
    },
    commit(key, { expectedRevision, value }) {
      if (record.status !== 'ok' && record.status !== 'corrupt') {
        return { status: 'unavailable', persisted: false, revision: record.revision || 0, value: null };
      }
      if ((record.revision || 0) !== expectedRevision) {
        return {
          status: 'conflict',
          persisted: false,
          revision: record.revision || 0,
          value: structuredClone(record.value)
        };
      }
      record = {
        status: 'ok',
        revision: expectedRevision + 1,
        value: structuredClone(value)
      };
      return { status: 'committed', persisted: true, revision: record.revision, value: structuredClone(value) };
    }
  };
}

function reviewEvent({
  eventId,
  unitId = 'FLC-U01',
  targetId = 'FLC-U01-T01',
  outcome = 'independent',
  contextId = 'breakfast-stall',
  evidenceMode = 'audio-image-quantity-match'
}) {
  return { eventId, type: 'review-attempt', unitId, targetId, outcome, contextId, evidenceMode };
}

test('open normalizes missing, corrupt, and old-schema records to one safe projection', () => {
  const sources = [
    { status: 'ok', revision: 0, value: null },
    { status: 'corrupt', revision: 0, value: '{not-json' },
    { status: 'ok', revision: 7, value: { schemaVersion: 0, challengeStars: 999 } }
  ];

  for (const source of sources) {
    const ledger = open({
      store: recordingStore(source),
      key: 'learner',
      catalog,
      clock: fixedClock()
    });
    const projection = ledger.read();

    assert.equal(projection.schemaVersion, 1);
    assert.equal(projection.units['FLC-U01'].buildStage, 0);
    assert.equal(projection.units['FLC-U01'].mastered, false);
    assert.equal(projection.districts['first-book-49-60'].challengeStars, 0);
  }
});

test('schema-one normalization removes duplicate-day evidence instead of trapping mastery', () => {
  const target = catalog.getTeachingUnit('FLC-U01').targets[0];
  const duplicate = {
    learningDay: '2026-08-10',
    contextId: target.contextIds[0],
    evidenceMode: target.evidenceModes[0],
    outcome: 'independent'
  };
  const seed = {
    schemaVersion: 1,
    processedEventIds: [],
    units: { 'FLC-U01': { checkpoint: null, buildStage: 0 } },
    targets: { [target.targetId]: { evidence: [duplicate, duplicate] } },
    districts: { 'first-book-49-60': { challengeStars: 0, starredUnitIds: [] } },
    learningClock: { maxObservedDay: '2026-08-10', dailyChallengeStars: 0 }
  };
  const clock = fixedClock('2026-08-11');
  const ledger = open({
    store: recordingStore({ status: 'ok', revision: 3, value: seed }),
    key: 'learner',
    catalog,
    clock
  });

  assert.equal(ledger.read().units['FLC-U01'].targets[target.targetId].evidenceCount, 1);
  const result = ledger.apply(reviewEvent({
    eventId: 'normalized-second-day',
    targetId: target.targetId,
    contextId: target.contextIds[1],
    evidenceMode: target.evidenceModes[0]
  }));
  assert.equal(result.snapshot.units['FLC-U01'].targets[target.targetId].mastered, true);
});

test('the real memory adapter reopens the same durable ledger projection', () => {
  const store = createMemoryAdapter();
  const clock = fixedClock();
  const first = open({ store, key: 'learner', catalog, clock });
  first.apply(reviewEvent({ eventId: 'persist-and-reopen' }));

  const reopened = open({ store, key: 'learner', catalog, clock });
  assert.equal(reopened.read().revision, 1);
  assert.equal(reopened.read().units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 1);
  assert.equal(reopened.read().districts['first-book-49-60'].challengeStars, 1);
});

test('formative success persists learning readiness without independent evidence or stars', () => {
  const clock = fixedClock();
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });

  const result = ledger.apply({
    eventId: 'formative-1',
    type: 'formative-attempt',
    unitId: 'FLC-U01',
    targetId: 'FLC-U01-T01',
    outcome: 'practice-only',
    contextId: 'breakfast-stall',
    evidenceMode: 'audio-image-quantity-match',
    learningDay: '1999-01-01'
  });

  assert.equal(result.status, 'applied');
  assert.equal(result.persisted, true);
  assert.equal(result.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 0);
  assert.equal(result.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].nextDueDay, '2026-08-11');
  assert.equal(result.snapshot.districts['first-book-49-60'].challengeStars, 0);
  assert.deepEqual(result.effects, []);
});

test('independent review records clock-derived evidence and one challenge star', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });

  const result = ledger.apply({
    eventId: 'review-1',
    type: 'review-attempt',
    unitId: 'FLC-U01',
    targetId: 'FLC-U01-T01',
    outcome: 'independent',
    contextId: 'breakfast-stall',
    evidenceMode: 'audio-image-quantity-match',
    learningDay: '1999-01-01'
  });
  const target = result.snapshot.units['FLC-U01'].targets['FLC-U01-T01'];

  assert.equal(result.status, 'applied');
  assert.deepEqual(target.evidence, [{
    learningDay: '2026-08-10',
    contextId: 'breakfast-stall',
    evidenceMode: 'audio-image-quantity-match',
    outcome: 'independent'
  }]);
  assert.equal(target.mastered, false);
  assert.equal(result.snapshot.districts['first-book-49-60'].challengeStars, 1);
  assert.deepEqual(result.effects.map(effect => effect.type), ['evidence-recorded', 'star-awarded']);
});

test('eventId replay is idempotent and every production event requires an id', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });
  const event = {
    eventId: 'review-idempotent',
    type: 'review-attempt',
    unitId: 'FLC-U01',
    targetId: 'FLC-U01-T01',
    outcome: 'independent',
    contextId: 'breakfast-stall',
    evidenceMode: 'audio-image-quantity-match'
  };

  assert.equal(ledger.apply(event).status, 'applied');
  const replay = ledger.apply(event);
  assert.equal(replay.status, 'duplicate');
  assert.equal(replay.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 1);
  assert.equal(replay.snapshot.districts['first-book-49-60'].challengeStars, 1);

  const missingId = ledger.apply({ ...event, eventId: '' });
  assert.equal(missingId.status, 'rejected');
  assert.equal(missingId.reason, 'eventId-required');
});

test('supported and failed reviews remain distinct without evidence, stars, or interval advance', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });
  const base = {
    type: 'review-attempt',
    unitId: 'FLC-U01',
    contextId: 'breakfast-stall',
    evidenceMode: 'audio-image-quantity-match'
  };

  ledger.apply({ ...base, eventId: 'supported-1', targetId: 'FLC-U01-T01', outcome: 'supported' });
  const result = ledger.apply({ ...base, eventId: 'failed-1', targetId: 'FLC-U01-T01', outcome: 'failed' });
  const target = result.snapshot.units['FLC-U01'].targets['FLC-U01-T01'];

  assert.equal(target.lastOutcome, 'failed');
  assert.equal(target.evidenceCount, 0);
  assert.equal(target.intervalStage, 0);
  assert.equal(result.snapshot.districts['first-book-49-60'].challengeStars, 0);
});

test('mastery needs two different learning days and two different valid contexts', () => {
  const clock = fixedClock();
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });

  ledger.apply(reviewEvent({ eventId: 'mastery-day-1' }));
  const sameDay = ledger.apply(reviewEvent({
    eventId: 'mastery-same-day',
    contextId: 'picnic-supply'
  }));
  assert.equal(sameDay.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 1);
  assert.equal(sameDay.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].intervalStage, 1);
  assert.equal(sameDay.snapshot.districts['first-book-49-60'].challengeStars, 1);

  clock.set('2026-08-11');
  const mastered = ledger.apply(reviewEvent({
    eventId: 'mastery-day-2',
    contextId: 'picnic-supply'
  }));
  assert.equal(mastered.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].mastered, true);
  assert.equal(mastered.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 2);
  assert.ok(mastered.effects.some(effect => effect.type === 'target-mastered'));
});

test('a repeated same-context success cannot trap a later cross-context mastery', () => {
  const clock = fixedClock('2026-08-10');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });

  ledger.apply(reviewEvent({ eventId: 'same-context-day-1' }));
  clock.set('2026-08-11');
  const repeated = ledger.apply(reviewEvent({ eventId: 'same-context-day-2' }));
  assert.equal(repeated.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].mastered, false);
  assert.equal(repeated.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 2);

  clock.set('2026-08-12');
  const recovered = ledger.apply(reviewEvent({
    eventId: 'new-context-day-3',
    contextId: 'picnic-supply'
  }));
  const target = recovered.snapshot.units['FLC-U01'].targets['FLC-U01-T01'];
  assert.equal(target.mastered, true);
  assert.equal(target.evidenceCount, 2);
  assert.deepEqual(new Set(target.evidence.map(item => item.contextId)), new Set([
    'breakfast-stall',
    'picnic-supply'
  ]));
});

test('checkpoints advance construction monotonically and unit-built stops at state-5', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });

  const checkpoint = ledger.apply({
    eventId: 'checkpoint-discover',
    type: 'checkpoint-completed',
    unitId: 'FLC-U01',
    checkpointId: 'discover:complete',
    beatId: 'discover'
  });
  assert.equal(checkpoint.snapshot.units['FLC-U01'].buildStage, 1);
  assert.equal(checkpoint.snapshot.units['FLC-U01'].checkpoint.checkpointId, 'discover:complete');

  const built = ledger.apply({ eventId: 'unit-built', type: 'unit-built', unitId: 'FLC-U01' });
  assert.equal(built.snapshot.units['FLC-U01'].buildStage, 5);
  assert.equal(built.snapshot.units['FLC-U01'].visualState, 'state-5');
  assert.equal(built.snapshot.units['FLC-U01'].mastered, false);
  assert.ok(built.effects.some(effect => effect.type === 'landmark-built'));
});

test('checkpoint-completed accepts an explicit validated buildStage for runtime bridges', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });

  const result = ledger.apply({
    eventId: 'bridge-stage-2',
    type: 'checkpoint-completed',
    unitId: 'FLC-U01',
    checkpointId: 'bridge-understand:complete',
    buildStage: 2
  });

  assert.equal(result.status, 'applied');
  assert.equal(result.snapshot.units['FLC-U01'].buildStage, 2);
  assert.equal(result.snapshot.units['FLC-U01'].checkpoint.checkpointId, 'bridge-understand:complete');
});

test('microtask checkpoints advance recovery without implicitly growing the current beat', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });

  ledger.apply({
    eventId: 'lesson49-m01',
    type: 'checkpoint-completed',
    unitId: 'FLC-U01',
    beatId: 'discover',
    microtaskId: 'L49-M01',
    checkpointId: 'L49-M01:complete',
    buildStage: 1,
    completionStatus: 'completed-independent'
  });
  const middle = ledger.apply({
    eventId: 'lesson49-m05',
    type: 'checkpoint-completed',
    unitId: 'FLC-U01',
    beatId: 'understand',
    microtaskId: 'L49-M05',
    checkpointId: 'L49-M05:complete',
    completionStatus: 'completed-supported'
  });

  assert.equal(middle.snapshot.units['FLC-U01'].buildStage, 1);
  assert.deepEqual(middle.snapshot.units['FLC-U01'].checkpoint, {
    checkpointId: 'L49-M05:complete',
    beatId: 'understand',
    microtaskId: 'L49-M05',
    completionStatus: 'completed-supported',
    learningDay: '2026-08-10'
  });

  const stale = ledger.apply({
    eventId: 'lesson49-m04-late',
    type: 'checkpoint-completed',
    unitId: 'FLC-U01',
    beatId: 'understand',
    microtaskId: 'L49-M04',
    checkpointId: 'L49-M04:complete',
    completionStatus: 'completed-independent'
  });
  assert.equal(stale.snapshot.units['FLC-U01'].buildStage, 1);
  assert.equal(stale.snapshot.units['FLC-U01'].checkpoint.microtaskId, 'L49-M05');
});

test('the real Lesson 50 bridge writes state-2 through practice-only ledger events', () => {
  const store = createMemoryAdapter();
  const ledger = open({ store, key: 'learner', catalog, clock: fixedClock() });
  const unit = catalog.getTeachingUnit('FLC-U01');
  const runtime = createRuntime({ unit, ledger, seed: 17 });
  runtime.enter({ entryLesson: 'lesson50' });

  for (const [index, beat] of unit.beats.slice(0, 2).entries()) {
    const snapshot = runtime.snapshot();
    runtime.dispatch({
      type: 'answer/submit',
      answerId: beat.task.answerKeyByContext[snapshot.contextId]
    });
    assert.equal(ledger.read().units[unit.unitId].buildStage, index + 1);
  }

  const projection = ledger.read();
  assert.equal(projection.units[unit.unitId].buildStage, 2);
  assert.equal(projection.units[unit.unitId].checkpoint.checkpointId, 'understand:complete');
  assert.equal(projection.districts[unit.districtId].challengeStars, 0);
  assert.equal(projection.districts[unit.districtId].masteredTargetCount, 0);
  assert.equal(projection.units[unit.unitId].targets['FLC-U01-T01'].lastOutcome, 'practice-only');
  assert.equal(projection.units[unit.unitId].targets['FLC-U01-T02'].lastOutcome, null);
});

test('an out-of-order checkpoint cannot regress the last stable checkpoint', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });
  ledger.apply({
    eventId: 'checkpoint-stage-2',
    type: 'checkpoint-completed',
    unitId: 'FLC-U01',
    checkpointId: 'understand:complete',
    beatId: 'understand',
    buildStage: 2
  });

  const stale = ledger.apply({
    eventId: 'checkpoint-late-stage-1',
    type: 'checkpoint-completed',
    unitId: 'FLC-U01',
    checkpointId: 'discover:complete',
    beatId: 'discover',
    buildStage: 1
  });

  assert.equal(stale.snapshot.units['FLC-U01'].buildStage, 2);
  assert.equal(stale.snapshot.units['FLC-U01'].checkpoint.checkpointId, 'understand:complete');
});

test('a state-5 landmark becomes state-mastered only after all five targets are mastered', () => {
  const clock = fixedClock();
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });
  const unit = catalog.getTeachingUnit('FLC-U01');
  ledger.apply({ eventId: 'built-before-mastery', type: 'unit-built', unitId: unit.unitId });

  for (const target of unit.targets) {
    ledger.apply(reviewEvent({
      eventId: `first-${target.targetId}`,
      targetId: target.targetId,
      contextId: target.contextIds[0],
      evidenceMode: target.evidenceModes[0]
    }));
  }
  assert.equal(ledger.read().units[unit.unitId].visualState, 'state-5');

  clock.set('2026-08-11');
  let result;
  for (const target of unit.targets) {
    result = ledger.apply(reviewEvent({
      eventId: `second-${target.targetId}`,
      targetId: target.targetId,
      contextId: target.contextIds[1],
      evidenceMode: target.evidenceModes[0]
    }));
  }

  assert.equal(result.snapshot.units[unit.unitId].visualState, 'state-mastered');
  assert.equal(result.snapshot.units[unit.unitId].mastered, true);
  assert.ok(result.effects.some(effect => effect.type === 'landmark-mastered'));
});

test('daily stars stop at three while evidence continues, and clock rollback creates neither', () => {
  const clock = fixedClock();
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });
  const unit = catalog.getTeachingUnit('FLC-U01');

  for (const [index, target] of unit.targets.slice(0, 4).entries()) {
    ledger.apply(reviewEvent({
      eventId: `daily-${index}`,
      targetId: target.targetId,
      contextId: target.contextIds[0],
      evidenceMode: target.evidenceModes[0]
    }));
  }
  const capped = ledger.read();
  assert.equal(capped.districts['first-book-49-60'].challengeStars, 3);
  assert.equal(capped.units['FLC-U01'].targets['FLC-U01-T04'].evidenceCount, 1);

  clock.set('2026-08-09');
  const target = unit.targets[4];
  const rolledBack = ledger.apply(reviewEvent({
    eventId: 'rollback-review',
    targetId: target.targetId,
    contextId: target.contextIds[0],
    evidenceMode: target.evidenceModes[0]
  }));
  assert.equal(rolledBack.snapshot.units['FLC-U01'].targets[target.targetId].evidenceCount, 0);
  assert.equal(rolledBack.snapshot.districts['first-book-49-60'].challengeStars, 3);
  assert.deepEqual(rolledBack.effects, [{ type: 'clock-rollback-blocked', learningDay: '2026-08-09' }]);
});

test('review evidence is rejected unless context and evidence mode belong to the target', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });

  const wrongContext = ledger.apply(reviewEvent({ eventId: 'wrong-context', contextId: 'not-in-unit' }));
  assert.equal(wrongContext.status, 'rejected');
  assert.equal(wrongContext.reason, 'context-invalid');

  const wrongMode = ledger.apply(reviewEvent({ eventId: 'wrong-mode', evidenceMode: 'generic-click' }));
  assert.equal(wrongMode.status, 'rejected');
  assert.equal(wrongMode.reason, 'evidence-mode-invalid');
  assert.equal(ledger.read().districts['first-book-49-60'].challengeStars, 0);
});

test('commit failure reports no durable effects and leaves the handle projection unchanged', () => {
  const store = {
    load: () => ({ status: 'ok', revision: 0, value: null }),
    commit: () => ({ status: 'unavailable', persisted: false, revision: 0, value: null })
  };
  const ledger = open({ store, key: 'learner', catalog, clock: fixedClock() });

  const result = ledger.apply(reviewEvent({ eventId: 'cannot-save' }));

  assert.equal(result.status, 'not-persisted');
  assert.equal(result.persisted, false);
  assert.deepEqual(result.effects, []);
  assert.equal(result.snapshot.revision, 0);
  assert.equal(result.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 0);
  assert.equal(result.snapshot.districts['first-book-49-60'].challengeStars, 0);
});

test('a stale handle rebases one event on the latest revision instead of overwriting it', () => {
  const store = createMemoryAdapter();
  const clock = fixedClock();
  const first = open({ store, key: 'learner', catalog, clock });
  const stale = open({ store, key: 'learner', catalog, clock });

  first.apply(reviewEvent({ eventId: 'concurrent-first' }));
  const target = catalog.getTeachingUnit('FLC-U01').targets[1];
  const rebased = stale.apply(reviewEvent({
    eventId: 'concurrent-second',
    targetId: target.targetId,
    contextId: target.contextIds[0],
    evidenceMode: target.evidenceModes[0]
  }));

  assert.equal(rebased.status, 'applied');
  assert.equal(rebased.snapshot.revision, 2);
  assert.equal(rebased.snapshot.units['FLC-U01'].targets['FLC-U01-T01'].evidenceCount, 1);
  assert.equal(rebased.snapshot.units['FLC-U01'].targets['FLC-U01-T02'].evidenceCount, 1);
  assert.equal(rebased.snapshot.districts['first-book-49-60'].challengeStars, 2);
});

test('processed event maintenance stays bounded and does not persist an event log', () => {
  const store = recordingStore();
  const ledger = open({ store, key: 'learner', catalog, clock: fixedClock() });
  const event = {
    type: 'formative-attempt',
    unitId: 'FLC-U01',
    targetId: 'FLC-U01-T01',
    outcome: 'supported',
    contextId: 'breakfast-stall',
    evidenceMode: 'audio-image-quantity-match'
  };

  for (let index = 0; index < 300; index += 1) {
    ledger.apply({ ...event, eventId: `bounded-${index}` });
  }
  const persisted = store.load('learner').value;

  assert.equal(persisted.processedEventIds.length, 256);
  assert.equal(persisted.processedEventIds[0], 'bounded-44');
  assert.equal('events' in persisted, false);
  assert.equal('eventLog' in persisted, false);
});

test('district stage badges require both 15/30/45 stars and 2/4/6 landmark coverage', () => {
  const clock = fixedClock('2026-09-01');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });
  const units = catalog.listTeachingUnitsForDistrict('first-book-49-60');
  const thresholdResults = new Map();

  for (let index = 0; index < 45; index += 1) {
    const day = Math.floor(index / 3) + 1;
    clock.set(`2026-09-${String(day).padStart(2, '0')}`);
    const unit = units[index % units.length];
    const target = unit.targets[0];
    const result = ledger.apply(reviewEvent({
      eventId: `badge-${index + 1}`,
      unitId: unit.unitId,
      targetId: target.targetId,
      contextId: target.contextIds[Math.floor(index / units.length) % 2],
      evidenceMode: target.evidenceModes[0]
    }));
    if ([14, 15, 29, 30, 44, 45].includes(index + 1)) thresholdResults.set(index + 1, result);
  }

  assert.equal(thresholdResults.get(14).snapshot.districts['first-book-49-60'].stageBadges[0].eligible, false);
  assert.equal(thresholdResults.get(15).snapshot.districts['first-book-49-60'].stageBadges[0].eligible, true);
  assert.equal(thresholdResults.get(29).snapshot.districts['first-book-49-60'].stageBadges[1].eligible, false);
  assert.equal(thresholdResults.get(30).snapshot.districts['first-book-49-60'].stageBadges[1].eligible, true);
  assert.equal(thresholdResults.get(44).snapshot.districts['first-book-49-60'].stageBadges[2].eligible, false);
  assert.equal(thresholdResults.get(45).snapshot.districts['first-book-49-60'].stageBadges[2].eligible, true);
  assert.equal(thresholdResults.get(45).snapshot.districts['first-book-49-60'].landmarkCoverage, 6);
  assert.ok(thresholdResults.get(45).effects.some(effect => (
    effect.type === 'stage-badge-eligible' && effect.badgeId === 'stage-3'
  )));
});

test('star totals alone cannot unlock a stage badge without landmark breadth', () => {
  const clock = fixedClock('2026-11-01');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });
  const firstUnit = catalog.getTeachingUnit('FLC-U01');
  const firstTarget = firstUnit.targets[0];

  for (let day = 1; day <= 15; day += 1) {
    clock.set(`2026-11-${String(day).padStart(2, '0')}`);
    ledger.apply(reviewEvent({
      eventId: `narrow-${day}`,
      targetId: firstTarget.targetId,
      contextId: firstTarget.contextIds[day % 2],
      evidenceMode: firstTarget.evidenceModes[0]
    }));
  }
  let district = ledger.read().districts['first-book-49-60'];
  assert.equal(district.challengeStars, 15);
  assert.equal(district.landmarkCoverage, 1);
  assert.equal(district.stageBadges[0].eligible, false);

  clock.set('2026-11-16');
  const secondUnit = catalog.getTeachingUnit('FLC-U02');
  const secondTarget = secondUnit.targets[0];
  const broadened = ledger.apply(reviewEvent({
    eventId: 'breadth-2',
    unitId: secondUnit.unitId,
    targetId: secondTarget.targetId,
    contextId: secondTarget.contextIds[0],
    evidenceMode: secondTarget.evidenceModes[0]
  }));
  district = broadened.snapshot.districts['first-book-49-60'];
  assert.equal(district.landmarkCoverage, 2);
  assert.equal(district.stageBadges[0].eligible, true);
});

test('the final crest checks all thirty mastered targets and all six mastered landmarks', () => {
  const clock = fixedClock('2026-10-01');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock });
  const units = catalog.listTeachingUnitsForDistrict('first-book-49-60');

  for (const unit of units) {
    ledger.apply({ eventId: `build-${unit.unitId}`, type: 'unit-built', unitId: unit.unitId });
    for (const target of unit.targets) {
      ledger.apply(reviewEvent({
        eventId: `crest-first-${target.targetId}`,
        unitId: unit.unitId,
        targetId: target.targetId,
        contextId: target.contextIds[0],
        evidenceMode: target.evidenceModes[0]
      }));
    }
  }
  assert.equal(ledger.read().districts['first-book-49-60'].finalCrestEligible, false);

  clock.set('2026-10-02');
  let result;
  for (const unit of units) {
    for (const target of unit.targets) {
      result = ledger.apply(reviewEvent({
        eventId: `crest-second-${target.targetId}`,
        unitId: unit.unitId,
        targetId: target.targetId,
        contextId: target.contextIds[1],
        evidenceMode: target.evidenceModes[0]
      }));
    }
  }

  const district = result.snapshot.districts['first-book-49-60'];
  assert.equal(district.masteredTargetCount, 30);
  assert.equal(district.masteredLandmarkCount, 6);
  assert.equal(district.finalCrestEligible, true);
  assert.ok(result.effects.some(effect => effect.type === 'final-crest-eligible'));
});
