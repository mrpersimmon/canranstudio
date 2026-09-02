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

function catalogWithVersionedNceUnit() {
  const unit = structuredClone(catalog.getTeachingUnit('NCE-U01'));
  unit.experienceRevision = 'lesson1-2-v2';
  return {
    TEACHING_UNITS: [unit],
    getTeachingUnit(unitId) {
      return unitId === unit.unitId ? unit : null;
    }
  };
}

function smallV2Catalog({ microtaskCount = 1, resultCount = 2 } = {}) {
  const targetId = 'V2-T01';
  const sourceIds = Array.from({ length: Math.max(resultCount, microtaskCount) }, (_, index) => `S${index + 1}`);
  const resultContracts = Array.from({ length: resultCount }, (_, index) => ({
    resultId: `R${index + 1}`,
    reviewCellId: `R${index + 1}`,
    challengeRef: `M01:C${String(index + 1).padStart(2, '0')}`,
    targetId,
    stepId: 'M01:S01',
    sourceRef: sourceIds[index],
    channel: index % 2 === 0 ? 'audio-form-supported' : 'word-form',
    contextId: 'main-context',
    reviewContextId: 'review-schoolbag-check',
    evidenceMode: 'meaning-match',
    variantId: index < 2 ? 'same-word' : `word-${index + 1}`,
    resultKind: 'formative'
  }));
  const microtasks = Array.from({ length: microtaskCount }, (_, index) => ({
    microtaskId: `M${String(index + 1).padStart(2, '0')}`,
    checkpointAfterSuccess: { checkpointId: `M${String(index + 1).padStart(2, '0')}:complete` },
    exposureRefs: [sourceIds[index % sourceIds.length]],
    targetResults: index === 0 ? resultContracts : [],
    steps: [{ stepId: `M${String(index + 1).padStart(2, '0')}:S01`, audioSourceRefs: [sourceIds[index % sourceIds.length]] }],
    persistence: { checkpointFacts: [`fact-${index + 1}`] }
  }));
  const unit = {
    unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2',
    runtimeProfile: 'microtask-v2',
    districtId: 'v2-district',
    landmarkId: 'v2-landmark',
    lessonIds: ['lesson1', 'lesson2'],
    lessonContent: {
      lesson1: { sources: Object.fromEntries(sourceIds.map(sourceRef => [sourceRef, { sourceRef }])) }
    },
    reviewContexts: {
      'review-schoolbag-check': { contextId: 'review-schoolbag-check' },
      'review-help-desk-exchange': { contextId: 'review-help-desk-exchange' }
    },
    targets: [{
      targetId,
      contextIds: ['main-context', 'review-schoolbag-check', 'review-help-desk-exchange'],
      evidenceModes: ['meaning-match']
    }],
    beats: [{ beatId: 'v2-story', buildStage: 0, microtasks }]
  };
  return {
    TEACHING_UNITS: [unit],
    getTeachingUnit(unitId) {
      return unitId === unit.unitId ? unit : null;
    }
  };
}

function v2MicrotaskEvent(task, overrides = {}) {
  return {
    eventId: 'v2-microtask-complete',
    type: 'microtask-completed',
    unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2',
    beatId: 'v2-story',
    microtaskId: task.microtaskId,
    checkpointId: task.checkpointAfterSuccess.checkpointId,
    completionStatus: 'completed-partner-rescue',
    targetResults: task.targetResults.map(contract => ({
      ...structuredClone(contract),
      outcome: 'partner-rescue',
      supportLevel: 'model',
      rescueUsed: true,
      heartsRemaining: 2,
      adventureHeartsRemaining: 2
    })),
    sourceContacts: task.exposureRefs.map(sourceRef => ({
      sourceRef,
      contactModes: ['experienced', 'audio-ended']
    })),
    audioContactRefs: [...task.exposureRefs],
    missingAudioRefs: [],
    storyFacts: [...task.persistence.checkpointFacts],
    adventureHeartsRemaining: 2,
    ...overrides
  };
}

function v2ReviewAttempt(overrides = {}) {
  return {
    eventId: 'review-attempt',
    type: 'review-attempt',
    unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2',
    reviewRunId: 'review-run-1',
    reviewChallengeRef: 'review-run-1:C01',
    reviewCellId: 'R1',
    targetId: 'V2-T01',
    sourceRef: 'S1',
    channel: 'audio-form-supported',
    contextId: 'review-schoolbag-check',
    evidenceMode: 'meaning-match',
    outcome: 'independent-retrieval',
    supportLevel: 'none',
    attemptedAt: '2026-08-11T01:00:00.000Z',
    ...overrides
  };
}

function roleRoundEvent(unit, task, roundId, disposition, overrides = {}) {
  const practice = task.steps[0].practice;
  const round = practice.rounds.find(candidate => candidate.roundId === roundId);
  const completed = disposition === 'completed';
  return {
    eventId: `role-round:${roundId}:${disposition}`,
    type: completed ? 'role-practice-round-completed' : 'role-practice-round-skipped',
    unitId: unit.unitId,
    experienceRevision: unit.experienceRevision,
    unitAttemptId: 'lesson1-role-attempt',
    microtaskId: task.microtaskId,
    practiceId: practice.practiceId,
    roundId,
    targetResults: [],
    sourceContacts: completed ? round.dialogueTurnRefs.map(sourceRef => ({
      sourceRef, contactModes: ['experienced', 'audio-ended']
    })) : [],
    audioContactRefs: completed ? [...round.dialogueTurnRefs] : [],
    missingAudioRefs: [],
    storyFacts: [],
    ...overrides
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

test('role-practice round checkpoints are revision-scoped resume state, not results or mastery evidence', () => {
  const store = createMemoryAdapter();
  const ledger = open({
    store, key: 'lesson1-role-progress', catalog,
    clock: fixedClock('2026-08-25')
  });
  const unit = catalog.getTeachingUnit('NCE-U01');
  const roleTask = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(task => task.microtaskId === 'L01-M12');

  const saved = ledger.apply(roleRoundEvent(unit, roleTask, 'keeper-round', 'completed'));
  assert.equal(saved.persisted, true);
  let projection = ledger.read().units[unit.unitId];
  assert.deepEqual(projection.rolePracticeProgress, {
    'L01-M12:role-enactment': {
      microtaskId: 'L01-M12', unitAttemptId: 'lesson1-role-attempt',
      completedRoundIds: ['keeper-round'], skippedRoundIds: []
    }
  });
  assert.equal(projection.completedMicrotaskIds.includes('L01-M12'), false);
  assert.equal(projection.reviewCells && Object.keys(projection.reviewCells).length > 29, false);

  const secondRound = ledger.apply(roleRoundEvent(unit, roleTask, 'owner-round', 'completed', {
    eventId: 'role-progress:owner'
  }));
  assert.equal(secondRound.persisted, true);

  const completion = ledger.apply({
    eventId: 'role-stage:complete', type: 'microtask-completed',
    unitId: unit.unitId, experienceRevision: unit.experienceRevision,
    unitAttemptId: 'lesson1-role-attempt', attemptRevision: 0,
    beatId: unit.beats.find(beat => beat.microtasks.includes(roleTask)).beatId,
    microtaskId: roleTask.microtaskId,
    checkpointId: roleTask.checkpointAfterSuccess.checkpointId,
    completionStatus: 'completed-independent', targetResults: [],
    sourceContacts: roleTask.exposureRefs.map(sourceRef => ({
      sourceRef, contactModes: ['experienced', 'audio-ended']
    })),
    audioContactRefs: [...roleTask.exposureRefs], missingAudioRefs: [],
    storyFacts: [...roleTask.persistence.checkpointFacts],
    adventureHeartsRemaining: 3
  });
  assert.equal(completion.persisted, true);
  projection = ledger.read().units[unit.unitId];
  assert.deepEqual(projection.rolePracticeProgress, {});
  assert.equal(projection.completedMicrotaskIds.includes('L01-M12'), true);
});

test('a skipped role stage is durable progress without completion, contacts, facts, or result evidence', () => {
  const store = createMemoryAdapter();
  const ledger = open({
    store, key: 'lesson1-role-skip', catalog,
    clock: fixedClock('2026-08-25')
  });
  const unit = catalog.getTeachingUnit('NCE-U01');
  const beat = unit.beats.find(candidate => (
    candidate.microtasks?.some(task => task.microtaskId === 'L01-M12')
  ));
  const task = beat.microtasks.find(candidate => candidate.microtaskId === 'L01-M12');
  const practiceId = task.steps[0].practice.practiceId;

  ledger.apply(roleRoundEvent(unit, task, 'keeper-round', 'completed', {
    eventId: 'role-skip:keeper', unitAttemptId: 'role-skip-attempt'
  }));
  ledger.apply(roleRoundEvent(unit, task, 'owner-round', 'skipped', {
    eventId: 'role-skip:owner', unitAttemptId: 'role-skip-attempt'
  }));
  const skipped = ledger.apply({
    eventId: 'role-skip:confirmed', type: 'microtask-skipped',
    unitId: unit.unitId, experienceRevision: unit.experienceRevision,
    unitAttemptId: 'role-skip-attempt', attemptRevision: 0,
    beatId: beat.beatId, microtaskId: task.microtaskId,
    checkpointId: task.checkpointAfterSuccess.checkpointId,
    completionStatus: 'skipped', targetResults: [], sourceContacts: [],
    audioContactRefs: [], missingAudioRefs: [], storyFacts: [],
    adventureHeartsRemaining: 3
  });

  assert.equal(skipped.persisted, true);
  const projection = ledger.read().units[unit.unitId];
  assert.deepEqual(projection.skippedMicrotaskIds, ['L01-M12']);
  assert.equal(projection.completedMicrotaskIds.includes('L01-M12'), false);
  assert.equal(projection.checkpoint.completionStatus, 'skipped');
  assert.deepEqual(projection.rolePracticeProgress[practiceId].completedRoundIds, ['keeper-round']);
  assert.deepEqual(projection.rolePracticeProgress[practiceId].skippedRoundIds, ['owner-round']);
  assert.equal(projection.storyFacts.includes('lesson1-full-role-enactment-complete'), false);
  assert.deepEqual(projection.sourceContacts['L01-D01'].contactModes, ['experienced', 'audio-ended']);
  assert.equal(projection.completionReadback.skippedMicrotaskCount, 1);
});

test('role dispositions merge monotonically and completed wins stale concurrent skips', () => {
  const store = createMemoryAdapter();
  const clock = fixedClock('2026-08-25');
  const first = open({ store, key: 'role-disposition-race', catalog, clock });
  const stale = open({ store, key: 'role-disposition-race', catalog, clock });
  const unit = catalog.getTeachingUnit('NCE-U01');
  const task = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(candidate => candidate.microtaskId === 'L01-M12');

  assert.equal(first.apply(roleRoundEvent(unit, task, 'keeper-round', 'skipped', {
    eventId: 'race:skip:first'
  })).persisted, true);
  assert.equal(stale.apply(roleRoundEvent(unit, task, 'keeper-round', 'completed', {
    eventId: 'race:complete'
  })).persisted, true);
  assert.equal(first.apply(roleRoundEvent(unit, task, 'keeper-round', 'skipped', {
    eventId: 'race:skip:stale'
  })).persisted, true);

  const readback = open({ store, key: 'role-disposition-race', catalog, clock })
    .read().units[unit.unitId].rolePracticeProgress[task.steps[0].practice.practiceId];
  assert.deepEqual(readback.completedRoundIds, ['keeper-round']);
  assert.deepEqual(readback.skippedRoundIds, []);
});

test('a versioned unit starts from an empty projection when stored experienceRevision is missing or stale', () => {
  const versionedCatalog = catalogWithVersionedNceUnit();
  const unit = versionedCatalog.getTeachingUnit('NCE-U01');
  const firstTargetId = unit.targets[0].targetId;
  const legacy = {
    schemaVersion: 1,
    processedEventIds: ['old-completion'],
    units: {
      [unit.unitId]: {
        checkpoint: { checkpointId: 'legacy:complete', microtaskId: 'L01-M01' },
        buildStage: 5,
        adventureHeartsRemaining: 1,
        completedMicrotaskIds: ['L01-M01'],
        storyFacts: ['handbag-with-owner'],
        sourceContacts: { 'L01-D01': { contactModes: ['experienced'] } }
      }
    },
    targets: {
      [firstTargetId]: {
        lastOutcome: 'independent',
        variantCells: {
          legacy: {
            resultId: 'legacy', variantId: 'legacy', sourceRef: 'L01-W07',
            channel: 'word-form', attemptCount: 1, lastOutcome: 'independent',
            lastSupportLevel: 0, lastLearningDay: '2026-08-10', nextDueDay: '2026-08-11'
          }
        }
      }
    },
    districts: {},
    learningClock: { maxObservedDay: '2026-08-10', dailyChallengeStars: 0 }
  };
  const ledger = open({
    store: recordingStore({ status: 'ok', revision: 9, value: legacy }),
    key: 'learner',
    catalog: versionedCatalog,
    clock: fixedClock()
  });

  const projection = ledger.read().units[unit.unitId];
  assert.equal(projection.experienceRevision, 'lesson1-2-v2');
  assert.equal(projection.buildStage, 0);
  assert.equal(projection.adventureHeartsRemaining, 3);
  assert.equal(projection.checkpoint, null);
  assert.deepEqual(projection.completedMicrotaskIds, []);
  assert.deepEqual(projection.storyFacts, []);
  assert.deepEqual(projection.sourceContacts, {});
  assert.deepEqual(projection.targets[firstTargetId].variantCells, {});
  assert.deepEqual(projection.diagnosticArchive, {
    reason: 'experience-revision-mismatch',
    storedExperienceRevision: null
  });
});

test('a V2 microtask atomically stores one immutable cell per authored challenge and is idempotent', () => {
  const v2Catalog = smallV2Catalog();
  const unit = v2Catalog.getTeachingUnit('V2-U01');
  const task = unit.beats[0].microtasks[0];
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock: fixedClock() });
  const event = v2MicrotaskEvent(task);

  const applied = ledger.apply(event);
  const replay = ledger.apply(event);
  const projection = applied.snapshot.units[unit.unitId];

  assert.equal(applied.status, 'applied');
  assert.equal(replay.status, 'duplicate');
  assert.deepEqual(Object.keys(projection.targets['V2-T01'].variantCells), ['R1', 'R2']);
  assert.deepEqual(projection.targets['V2-T01'].variantCells.R1, {
    resultId: 'R1',
    reviewCellId: 'R1',
    challengeRef: 'M01:C01',
    targetId: 'V2-T01',
    variantId: 'same-word',
    sourceRef: 'S1',
    channel: 'audio-form-supported',
    contextId: 'main-context',
    reviewContextId: 'review-schoolbag-check',
    evidenceMode: 'meaning-match',
    outcome: 'partner-rescue',
    supportLevel: 'model',
    rescueUsed: true,
    attemptCount: 1,
    lastLearningDay: '2026-08-10',
    lastIndependentDay: null,
    intervalStage: 0,
    nextDueDay: '2026-08-11',
    hadError: true,
    audioUnavailable: false,
    reviewAttempts: []
  });
  assert.deepEqual(projection.storyFacts, ['fact-1']);
  assert.deepEqual(projection.sourceContacts.S1.contactModes, ['experienced', 'audio-ended']);
});

test('V2 UI continuation acknowledgements are durable and idempotent without changing learning evidence', () => {
  const fixture = smallV2Catalog({ microtaskCount: 2, resultCount: 2 });
  const unit = fixture.getTeachingUnit('V2-U01');
  const task = unit.beats[0].microtasks[0];
  task.presentation = {
    moments: [{ momentId: 'knowledge-layer', enterWhen: { kind: 'microtask-complete' } }]
  };
  task.restStop = {
    restStopId: 'lesson2-midpoint-rest-stop', type: 'section', nextMicrotaskId: 'M02'
  };
  const ledger = open({
    store: createMemoryAdapter(), key: 'ui-continuation', catalog: fixture,
    clock: fixedClock()
  });
  const completed = ledger.apply(v2MicrotaskEvent(task, {
    unitAttemptId: 'attempt-1', attemptRevision: 4
  }));
  assert.equal(completed.persisted, true);
  const learned = ledger.read().units['V2-U01'];
  assert.deepEqual(learned.pendingUiContinuation, {
    kind: 'terminal-presentation', microtaskId: 'M01', unitAttemptId: 'attempt-1',
    attemptRevision: 4, momentId: 'knowledge-layer', restStop: task.restStop
  });
  const cellsBefore = structuredClone(learned.reviewCells);

  const terminalAck = {
    eventId: 'ack-terminal', type: 'ui-continuation-acknowledged', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', unitAttemptId: 'attempt-1', attemptRevision: 4,
    microtaskId: 'M01', acknowledgement: 'presentation-ended', momentId: 'knowledge-layer'
  };
  assert.equal(ledger.apply(terminalAck).status, 'applied');
  assert.equal(ledger.apply(terminalAck).status, 'duplicate');
  assert.equal(ledger.read().units['V2-U01'].pendingUiContinuation.kind, 'rest-stop');

  const restAck = {
    eventId: 'ack-rest', type: 'ui-continuation-acknowledged', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', unitAttemptId: 'attempt-1', attemptRevision: 4,
    microtaskId: 'M01', acknowledgement: 'rest-stop-continue',
    restStopId: 'lesson2-midpoint-rest-stop'
  };
  assert.equal(ledger.apply(restAck).status, 'applied');
  assert.equal(ledger.apply(restAck).status, 'duplicate');
  const continued = ledger.read().units['V2-U01'];
  assert.equal(continued.pendingUiContinuation, null);
  assert.equal(continued.adventureHeartsRemaining, 2);
  assert.equal(continued.buildStage, 0);
  assert.deepEqual(continued.completedMicrotaskIds, ['M01']);
  assert.deepEqual(continued.reviewCells, cellsBefore);
});

test('the ledger plans a deterministic two-to-four-cell review without adjacent channels of one word', () => {
  const v2Catalog = smallV2Catalog({ resultCount: 4 });
  const task = v2Catalog.getTeachingUnit('V2-U01').beats[0].microtasks[0];
  const clock = fixedClock('2026-08-10');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock });
  assert.equal(ledger.apply(v2MicrotaskEvent(task)).status, 'applied');

  clock.set('2026-08-11');
  const plan = ledger.planReview({ unitId: 'V2-U01' });

  assert.deepEqual(plan.map(item => item.reviewCellId), ['R1', 'R3', 'R2', 'R4']);
  assert.ok(plan.length >= 2 && plan.length <= 4);
  assert.ok(plan.every(item => (
    item.targetId === 'V2-T01'
      && item.nextDueDay === '2026-08-11'
      && item.due === true
  )));
  assert.notEqual(plan[0].variantId, plan[1].variantId);
  assert.notEqual(plan[1].variantId, plan[2].variantId);
});

test('the ledger balances audio, word-form, and communicative cells within one priority tier', () => {
  const v2Catalog = smallV2Catalog({ resultCount: 6 });
  const task = v2Catalog.getTeachingUnit('V2-U01').beats[0].microtasks[0];
  const channels = [
    'audio-form-supported', 'audio-form-supported',
    'word-form', 'word-form',
    'meaning', 'assembly'
  ];
  task.targetResults.forEach((result, index) => {
    result.channel = channels[index];
    result.variantId = `word-${index + 1}`;
  });
  const clock = fixedClock('2026-08-10');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock });
  assert.equal(ledger.apply(v2MicrotaskEvent(task)).status, 'applied');

  clock.set('2026-08-11');
  const plan = ledger.planReview({ unitId: 'V2-U01' });

  assert.deepEqual(plan.map(item => item.reviewCellId), ['R1', 'R3', 'R5', 'R2']);
  assert.deepEqual(plan.map(item => item.reviewChannelGroup), [
    'word-audio', 'word-form', 'communicative', 'word-audio'
  ]);
});

test('a review run owns a fresh three-heart pool and child answers never touch mainline hearts', () => {
  const v2Catalog = smallV2Catalog();
  const task = v2Catalog.getTeachingUnit('V2-U01').beats[0].microtasks[0];
  const clock = fixedClock('2026-08-10');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock });
  const mainline = v2MicrotaskEvent(task, {
    adventureHeartsRemaining: 1,
    targetResults: v2MicrotaskEvent(task).targetResults.map(result => ({
      ...result, heartsRemaining: 1, adventureHeartsRemaining: 1
    }))
  });
  assert.equal(ledger.apply(mainline).status, 'applied');
  clock.set('2026-08-11');

  const started = ledger.apply({
    eventId: 'review-run-1-start',
    type: 'review-run-started',
    unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2',
    reviewRunId: 'review-run-1',
    reviewCellIds: ['R1', 'R2']
  });
  assert.equal(started.status, 'applied');
  assert.equal(started.snapshot.reviewRuns['review-run-1'].heartsRemaining, 3);
  assert.equal(started.snapshot.units['V2-U01'].adventureHeartsRemaining, 1);

  const failed = ledger.apply({
    eventId: 'review-run-1-r1-failed',
    type: 'review-attempt',
    unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2',
    reviewRunId: 'review-run-1',
    reviewChallengeRef: 'review-run-1:C01',
    reviewCellId: 'R1',
    targetId: 'V2-T01',
    sourceRef: 'S1',
    channel: 'audio-form-supported',
    contextId: 'review-schoolbag-check',
    evidenceMode: 'meaning-match',
    outcome: 'failed',
    supportLevel: 'consequence',
    attemptedAt: '2026-08-11T01:00:00.000Z',
    nextDueDay: undefined
  });
  assert.equal(failed.status, 'applied');
  assert.equal(failed.snapshot.reviewRuns['review-run-1'].heartsRemaining, 2);
  assert.equal(failed.snapshot.units['V2-U01'].adventureHeartsRemaining, 1);

  const corrected = ledger.apply({
    eventId: 'review-run-1-r1-correct',
    type: 'review-attempt',
    unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2',
    reviewRunId: 'review-run-1',
    reviewChallengeRef: 'review-run-1:C01',
    reviewCellId: 'R1',
    targetId: 'V2-T01',
    sourceRef: 'S1',
    channel: 'audio-form-supported',
    contextId: 'review-schoolbag-check',
    evidenceMode: 'meaning-match',
    outcome: 'review-assisted-practice',
    supportLevel: 'consequence',
    attemptedAt: '2026-08-11T01:00:10.000Z'
  });
  assert.equal(corrected.status, 'applied');
  assert.equal(corrected.snapshot.reviewRuns['review-run-1'].heartsRemaining, 3);
  assert.equal(corrected.snapshot.units['V2-U01'].adventureHeartsRemaining, 1);
});

test('completing a clean review run records cell evidence and derives its interval from ledger time', () => {
  const v2Catalog = smallV2Catalog();
  const task = v2Catalog.getTeachingUnit('V2-U01').beats[0].microtasks[0];
  const clock = fixedClock('2026-08-10');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock });
  ledger.apply(v2MicrotaskEvent(task));
  clock.set('2026-08-11');
  ledger.apply({
    eventId: 'clean-run-start', type: 'review-run-started', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', reviewRunId: 'clean-run', reviewCellIds: ['R1', 'R2']
  });
  ledger.apply(v2ReviewAttempt({
    eventId: 'clean-r1', reviewRunId: 'clean-run', reviewChallengeRef: 'clean-run:C01',
    learningDay: '1999-01-01'
  }));
  ledger.apply(v2ReviewAttempt({
    eventId: 'clean-r2', reviewRunId: 'clean-run', reviewChallengeRef: 'clean-run:C02',
    reviewCellId: 'R2', sourceRef: 'S2', channel: 'word-form',
    attemptedAt: '2026-08-11T01:00:10.000Z', learningDay: '1999-01-01'
  }));

  const completed = ledger.apply({
    eventId: 'clean-run-complete',
    type: 'review-run-completed',
    unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2',
    reviewRunId: 'clean-run'
  });
  const target = completed.snapshot.units['V2-U01'].targets['V2-T01'];

  assert.equal(completed.status, 'applied');
  assert.equal(completed.snapshot.reviewRuns['clean-run'], undefined);
  assert.equal(target.variantCells.R1.lastIndependentDay, '2026-08-11');
  assert.equal(target.variantCells.R1.intervalStage, 1);
  assert.equal(target.variantCells.R1.nextDueDay, '2026-08-12');
  assert.equal(target.variantCells.R1.reviewAttempts[0].learningDay, '2026-08-11');
  assert.equal(target.variantCells.R1.reviewAttempts[0].outcome, 'independent-retrieval');
  assert.equal(target.evidenceCount, 1);
});

test('same-day practice cannot become independent retrieval evidence', () => {
  const v2Catalog = smallV2Catalog();
  const task = v2Catalog.getTeachingUnit('V2-U01').beats[0].microtasks[0];
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock: fixedClock() });
  ledger.apply(v2MicrotaskEvent(task));
  ledger.apply({
    eventId: 'same-day-run-start', type: 'review-run-started', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', reviewRunId: 'same-day-run', reviewCellIds: ['R1', 'R2']
  });
  ledger.apply(v2ReviewAttempt({
    eventId: 'same-day-r1', reviewRunId: 'same-day-run', reviewChallengeRef: 'same-day-run:C01'
  }));
  ledger.apply(v2ReviewAttempt({
    eventId: 'same-day-r2', reviewRunId: 'same-day-run', reviewChallengeRef: 'same-day-run:C02',
    reviewCellId: 'R2', sourceRef: 'S2', channel: 'word-form'
  }));
  const completed = ledger.apply({
    eventId: 'same-day-run-complete', type: 'review-run-completed', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', reviewRunId: 'same-day-run'
  });
  const target = completed.snapshot.units['V2-U01'].targets['V2-T01'];

  assert.equal(target.evidenceCount, 0);
  assert.equal(target.variantCells.R1.lastIndependentDay, null);
  assert.equal(target.variantCells.R1.lastReviewOutcome, 'review-assisted-practice');
  assert.equal(target.variantCells.R1.nextDueDay, '2026-08-11');
});

test('review heart zero clears the short-run draft and forces assisted next-day scheduling', () => {
  const v2Catalog = smallV2Catalog();
  const task = v2Catalog.getTeachingUnit('V2-U01').beats[0].microtasks[0];
  const clock = fixedClock('2026-08-10');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock });
  ledger.apply(v2MicrotaskEvent(task));
  clock.set('2026-08-11');
  ledger.apply({
    eventId: 'rescue-run-start', type: 'review-run-started', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', reviewRunId: 'rescue-run', reviewCellIds: ['R1', 'R2']
  });
  ledger.apply(v2ReviewAttempt({
    eventId: 'rescue-r2-before-zero', reviewRunId: 'rescue-run',
    reviewChallengeRef: 'rescue-run:C02', reviewCellId: 'R2', sourceRef: 'S2', channel: 'word-form'
  }));
  for (let index = 1; index <= 3; index += 1) {
    ledger.apply(v2ReviewAttempt({
      eventId: `rescue-r1-fail-${index}`,
      reviewRunId: 'rescue-run',
      reviewChallengeRef: 'rescue-run:C01',
      outcome: 'failed',
      supportLevel: index === 1 ? 'consequence' : 'focused-cue',
      attemptedAt: `2026-08-11T01:00:0${index}.000Z`
    }));
  }
  const restarted = ledger.read().reviewRuns['rescue-run'];
  assert.equal(restarted.heartsRemaining, 3);
  assert.equal(restarted.attemptRevision, 1);
  assert.equal(restarted.rescueUsed, true);
  assert.deepEqual(restarted.temporaryResults, {});

  ledger.apply(v2ReviewAttempt({
    eventId: 'rescue-r1-after-zero', reviewRunId: 'rescue-run', reviewChallengeRef: 'rescue-run:C01'
  }));
  ledger.apply(v2ReviewAttempt({
    eventId: 'rescue-r2-after-zero', reviewRunId: 'rescue-run',
    reviewChallengeRef: 'rescue-run:C02', reviewCellId: 'R2', sourceRef: 'S2', channel: 'word-form'
  }));
  const completed = ledger.apply({
    eventId: 'rescue-run-complete', type: 'review-run-completed', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', reviewRunId: 'rescue-run'
  });
  const unit = completed.snapshot.units['V2-U01'];

  assert.equal(completed.status, 'applied');
  assert.equal(unit.adventureHeartsRemaining, 2);
  assert.equal(unit.targets['V2-T01'].evidenceCount, 0);
  assert.equal(unit.targets['V2-T01'].variantCells.R1.lastIndependentDay, null);
  assert.equal(unit.targets['V2-T01'].variantCells.R1.nextDueDay, '2026-08-12');
  assert.equal(
    unit.targets['V2-T01'].variantCells.R1.reviewAttempts.at(-1).outcome,
    'review-assisted-practice'
  );
  assert.equal(unit.targets['V2-T01'].variantCells.R1.reviewAttempts.at(-1).supportLevel, 'model');
});

test('a V2 landmark builds only after ledger readback proves all 16 stages, 29 cells, facts, and contacts', () => {
  const v2Catalog = smallV2Catalog({ microtaskCount: 16, resultCount: 29 });
  const unit = v2Catalog.getTeachingUnit('V2-U01');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock: fixedClock() });

  for (const [index, task] of unit.beats[0].microtasks.entries()) {
    const completed = ledger.apply(v2MicrotaskEvent(task, {
      eventId: `complete-${task.microtaskId}`,
      completionStatus: task.targetResults.length ? 'completed-partner-rescue' : 'completed-independent'
    }));
    assert.equal(completed.status, 'applied');
    if (index === 14) {
      const early = ledger.apply({
        eventId: 'build-too-early', type: 'unit-built', unitId: unit.unitId,
        experienceRevision: unit.experienceRevision
      });
      assert.equal(early.status, 'rejected');
      assert.equal(early.reason, 'unit-readback-incomplete');
      assert.equal(early.snapshot.units[unit.unitId].buildStage, 0);
    }
  }

  const beforeBuild = ledger.read().units[unit.unitId];
  assert.deepEqual(beforeBuild.completionReadback, {
    requiredMicrotaskCount: 16,
    completedMicrotaskCount: 16,
    skippedMicrotaskCount: 0,
    resolvedMicrotaskCount: 16,
    requiredResultCellCount: 29,
    completedResultCellCount: 29,
    requiredStoryFactCount: 16,
    completedStoryFactCount: 16,
    requiredSourceContactCount: 16,
    completedSourceContactCount: 16,
    requiredAudioSourceContactCount: 16,
    completedAudioSourceContactCount: 16,
    readyForBuild: true
  });
  assert.equal(beforeBuild.buildStage, 0);

  const builtEvent = {
    eventId: 'v2-unit-built', type: 'unit-built', unitId: unit.unitId,
    experienceRevision: unit.experienceRevision
  };
  const built = ledger.apply(builtEvent);
  const duplicate = ledger.apply(builtEvent);
  const semanticRetry = ledger.apply({ ...builtEvent, eventId: 'v2-unit-built-retry' });

  assert.equal(built.status, 'applied');
  assert.equal(built.snapshot.units[unit.unitId].buildStage, 5);
  assert.deepEqual(built.effects.filter(effect => effect.type === 'landmark-built'), [
    { type: 'landmark-built', unitId: unit.unitId }
  ]);
  assert.equal(duplicate.status, 'duplicate');
  assert.equal(semanticRetry.status, 'applied');
  assert.deepEqual(semanticRetry.effects, []);
  assert.equal(semanticRetry.snapshot.units[unit.unitId].buildStage, 5);
});

test('review audio failure changes neither hearts nor schedule and callers cannot submit nextDueDay', () => {
  const v2Catalog = smallV2Catalog();
  const task = v2Catalog.getTeachingUnit('V2-U01').beats[0].microtasks[0];
  const clock = fixedClock('2026-08-10');
  const ledger = open({ store: recordingStore(), key: 'learner', catalog: v2Catalog, clock });
  ledger.apply(v2MicrotaskEvent(task));
  clock.set('2026-08-11');
  ledger.apply({
    eventId: 'audio-run-start', type: 'review-run-started', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', reviewRunId: 'audio-run', reviewCellIds: ['R1', 'R2']
  });
  const before = ledger.read().units['V2-U01'].targets['V2-T01'].variantCells.R1.nextDueDay;
  const failed = ledger.apply(v2ReviewAttempt({
    eventId: 'audio-system-failed', reviewRunId: 'audio-run',
    reviewChallengeRef: 'audio-run:C01', outcome: 'audio-failure'
  }));
  const forged = ledger.apply(v2ReviewAttempt({
    eventId: 'caller-scheduled', reviewRunId: 'audio-run',
    reviewChallengeRef: 'audio-run:C01', nextDueDay: '2099-12-31'
  }));
  const deferred = ledger.apply({
    eventId: 'audio-run-later', type: 'review-run-deferred', unitId: 'V2-U01',
    experienceRevision: 'lesson1-2-v2', reviewRunId: 'audio-run'
  });

  assert.equal(failed.status, 'applied');
  assert.equal(failed.snapshot.reviewRuns['audio-run'].heartsRemaining, 3);
  assert.deepEqual(failed.snapshot.reviewRuns['audio-run'].temporaryResults, {});
  assert.equal(
    failed.snapshot.units['V2-U01'].targets['V2-T01'].variantCells.R1.audioUnavailable,
    true
  );
  assert.equal(
    failed.snapshot.units['V2-U01'].targets['V2-T01'].variantCells.R1.nextDueDay,
    before
  );
  assert.equal(forged.status, 'rejected');
  assert.equal(forged.reason, 'nextDueDay-forbidden');
  assert.equal(deferred.status, 'applied');
  assert.equal(deferred.snapshot.reviewRuns['audio-run'], undefined);
  assert.equal(deferred.snapshot.units['V2-U01'].adventureHeartsRemaining, 2);
  assert.equal(
    deferred.snapshot.units['V2-U01'].targets['V2-T01'].variantCells.R1.nextDueDay,
    before
  );
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

test('microtask v2 completion atomically stores checkpoint, contacts, story facts, and variant outcomes', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });
  const unit = catalog.getTeachingUnit('NCE-U01');
  const task = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(candidate => candidate.microtaskId === 'L01-M08');
  const targetResults = task.targetResults.map(result => ({
    ...structuredClone(result),
    outcome: 'independent',
    supportLevel: 'none',
    rescueUsed: false,
    heartsRemaining: 2,
    adventureHeartsRemaining: 2
  }));

  const result = ledger.apply({
    eventId: 'nce-l01-m08-complete',
    type: 'microtask-completed',
    unitId: unit.unitId,
    experienceRevision: unit.experienceRevision,
    beatId: 'discover',
    microtaskId: task.microtaskId,
    checkpointId: task.checkpointAfterSuccess.checkpointId,
    completionStatus: 'completed-independent',
    targetResults,
    sourceContacts: task.exposureRefs.map(sourceRef => ({
      sourceRef,
      contactModes: sourceRef === 'L01-W07' ? ['experienced', 'audio-ended'] : ['experienced']
    })),
    audioContactRefs: ['L01-W07'],
    missingAudioRefs: [],
    storyFacts: task.persistence.checkpointFacts,
    adventureHeartsRemaining: 2,
    source: 'new-learning'
  });
  const projection = result.snapshot.units[unit.unitId];

  assert.equal(result.status, 'applied');
  assert.equal(result.snapshot.revision, 1);
  assert.equal(projection.experienceRevision, 'lesson1-2-v2.6');
  assert.equal(projection.checkpoint.microtaskId, 'L01-M08');
  assert.equal(projection.adventureHeartsRemaining, 2);
  assert.deepEqual(projection.completedMicrotaskIds, ['L01-M08']);
  assert.deepEqual(projection.storyFacts, ['handbag-owner-identified', 'handbag-awaiting-return']);
  assert.deepEqual(projection.sourceContacts['L01-W07'].contactModes, ['experienced', 'audio-ended']);
  assert.deepEqual(projection.sourceContacts['L01-Q01'].contactModes, ['experienced']);
  const cell = projection.targets['NCE-U01-T01']
    .variantCells['NCE-U01-T01:L01-W07:audio-form-supported'];
  assert.equal(cell.reviewCellId, 'NCE-U01-T01:L01-W07:audio-form-supported');
  assert.equal(cell.challengeRef, 'L01-M08:C02');
  assert.equal(cell.sourceRef, 'L01-W07');
  assert.equal(cell.channel, 'audio-form-supported');
  assert.equal(cell.contextId, 'handbag-counter');
  assert.equal(cell.outcome, 'independent');
  assert.equal(cell.supportLevel, 'none');
  assert.equal(cell.rescueUsed, false);
  assert.equal(cell.attemptCount, 1);
  assert.equal(cell.nextDueDay, '2026-08-11');
  assert.equal(projection.targets['NCE-U01-T01'].evidenceCount, 0);
  assert.equal(projection.targets['NCE-U01-T01'].mastered, false);
  assert.equal(result.snapshot.districts['first-book-1-12'].challengeStars, 0);
  assert.equal(projection.buildStage, 0);
});

test('a malformed microtask audio claim is rejected without throwing from the ledger boundary', () => {
  const ledger = open({ store: recordingStore(), key: 'learner', catalog, clock: fixedClock() });
  const unit = catalog.getTeachingUnit('NCE-U01');
  const task = unit.beats.flatMap(beat => beat.microtasks || [])
    .find(candidate => candidate.microtaskId === 'L01-M08');
  let result;

  assert.doesNotThrow(() => {
    result = ledger.apply({
      eventId: 'malformed-audio-claim',
      type: 'microtask-completed',
      unitId: unit.unitId,
      experienceRevision: unit.experienceRevision,
      beatId: 'discover',
      microtaskId: task.microtaskId,
      checkpointId: task.checkpointAfterSuccess.checkpointId,
      completionStatus: 'completed-independent',
      targetResults: task.targetResults.map(contract => ({
        ...structuredClone(contract), outcome: 'independent', supportLevel: 'none',
        rescueUsed: false, heartsRemaining: 3
      })),
      sourceContacts: task.exposureRefs.map((sourceRef, index) => ({
        sourceRef,
        contactModes: index === 0 ? ['experienced', 'audio-ended'] : ['experienced']
      })),
      storyFacts: task.persistence.checkpointFacts,
      adventureHeartsRemaining: 3,
      source: 'new-learning'
    });
  });
  assert.equal(result.status, 'rejected');
  assert.equal(result.reason, 'audio-contacts-invalid');
});

test('the real V2 catalog and ledger commit seventeen microtasks and twenty-nine review cells before build', () => {
  const store = createMemoryAdapter();
  const clock = fixedClock();
  const ledger = open({ store, key: 'nce-learner', catalog, clock });
  const unit = catalog.getTeachingUnit('NCE-U01');
  const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
  function audioRefsFor(task) {
    const refs = [];
    function collect(sequence) {
      for (const segment of sequence?.segments || []) {
        if (segment.sourceRef) refs.push(segment.sourceRef);
      }
    }
    for (const step of task.steps) {
      collect(step.audioSequence);
      collect(step.feedbackAudioSequence);
      for (const challenge of step.challenges || []) {
        collect(challenge.audioSequence);
        collect(challenge.feedbackAudioSequence);
      }
    }
    return [...new Set(refs)];
  }

  for (const task of tasks) {
    const beat = unit.beats.find(candidate => candidate.microtasks.includes(task));
    if (task.microtaskId === 'L01-M12') {
      for (const round of task.steps[0].practice.rounds) {
        const disposition = ledger.apply(roleRoundEvent(unit, task, round.roundId, 'completed', {
          eventId: `complete-${task.microtaskId}:${round.roundId}`,
          unitAttemptId: 'catalog-completion-attempt'
        }));
        assert.equal(disposition.status, 'applied', `${round.roundId}: ${disposition.reason}`);
      }
    }
    const audioContactRefs = task.microtaskId === 'L01-M12'
      ? [...task.exposureRefs]
      : audioRefsFor(task);
    const result = ledger.apply({
      eventId: `complete-${task.microtaskId}`,
      type: 'microtask-completed',
      unitId: unit.unitId,
      experienceRevision: unit.experienceRevision,
      ...(task.microtaskId === 'L01-M12'
        ? { unitAttemptId: 'catalog-completion-attempt' }
        : {}),
      beatId: beat.beatId,
      microtaskId: task.microtaskId,
      checkpointId: task.checkpointAfterSuccess.checkpointId,
      completionStatus: 'completed-independent',
      targetResults: task.targetResults.map(contract => ({
        ...structuredClone(contract),
        outcome: 'independent',
        supportLevel: 'none',
        rescueUsed: false,
        heartsRemaining: 3,
        adventureHeartsRemaining: 3
      })),
      sourceContacts: task.exposureRefs.map(sourceRef => ({
        sourceRef,
        contactModes: audioContactRefs.includes(sourceRef)
          ? ['experienced', 'audio-ended']
          : ['experienced']
      })),
      audioContactRefs,
      missingAudioRefs: [],
      storyFacts: task.persistence.checkpointFacts,
      adventureHeartsRemaining: 3
    });
    assert.equal(result.status, 'applied', `${task.microtaskId}: ${result.reason}`);
  }
  const built = ledger.apply({
    eventId: 'nce-v2-unit-built',
    type: 'unit-built',
    unitId: unit.unitId,
    experienceRevision: unit.experienceRevision
  });

  const projection = ledger.read().units[unit.unitId];
  assert.equal(built.status, 'applied');
  assert.equal(projection.buildStage, 5);
  assert.equal(projection.completedMicrotaskIds.length, 17);
  assert.equal(projection.adventureHeartsRemaining, 3);
  assert.equal(Object.keys(projection.targets['NCE-U01-T01'].variantCells).length, 22);
  assert.equal(Object.values(projection.targets)
    .reduce((count, target) => count + Object.keys(target.variantCells).length, 0), 29);
  assert.equal(projection.completionReadback.readyForBuild, true);
  assert.ok(Object.values(projection.targets).every(target => (
    target.evidenceCount === 0 && target.mastered === false
  )));
  assert.equal(ledger.read().districts['first-book-1-12'].challengeStars, 0);
  assert.equal(projection.sourceContacts['L02-E01'], undefined);
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
