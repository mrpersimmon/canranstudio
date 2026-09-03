'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = require('../../core/curriculum-catalog');
const { create, evaluateRule } = require('../../core/learning-runtime');
const learningLedger = require('../../core/learning-ledger');
const { createMemoryAdapter } = require('../../core/learning-store');

const unit = catalog.getTeachingUnit('FLC-U01');
const nceUnit = catalog.getTeachingUnit('NCE-U01');

function roleStageLedger({ completedRoundIds = [], skippedRoundIds = [] } = {}) {
  const events = [];
  const completedMicrotaskIds = ['L01-M07', 'L01-M08', 'L01-M09', 'L01-M10', 'L01-M11'];
  const practiceId = 'L01-M12:role-enactment';
  const state = {
    experienceRevision: nceUnit.experienceRevision,
    checkpoint: { checkpointId: 'L01-M11:complete', microtaskId: 'L01-M11' },
    buildStage: 0, storyFacts: [], adventureHeartsRemaining: 3,
    unitAttemptId: 'role-stage-attempt', completedMicrotaskIds,
    skippedMicrotaskIds: [],
    pendingUiContinuation: null,
    rolePracticeProgress: completedRoundIds.length || skippedRoundIds.length ? {
      [practiceId]: {
        microtaskId: 'L01-M12', unitAttemptId: 'role-stage-attempt',
        completedRoundIds: [...completedRoundIds], skippedRoundIds: [...skippedRoundIds]
      }
    } : {}
  };
  return {
    events,
    read() { return { units: { [nceUnit.unitId]: structuredClone(state) } }; },
    apply(event) {
      events.push(structuredClone(event));
      if (event.type === 'role-practice-round-completed') {
        const progress = state.rolePracticeProgress[event.practiceId] || {
          microtaskId: event.microtaskId, unitAttemptId: event.unitAttemptId,
          completedRoundIds: [], skippedRoundIds: []
        };
        if (!progress.completedRoundIds.includes(event.roundId)) {
          progress.completedRoundIds.push(event.roundId);
        }
        progress.skippedRoundIds = progress.skippedRoundIds
          .filter(roundId => roundId !== event.roundId);
        state.rolePracticeProgress[event.practiceId] = progress;
      }
      if (event.type === 'role-practice-round-skipped') {
        const progress = state.rolePracticeProgress[event.practiceId] || {
          microtaskId: event.microtaskId, unitAttemptId: event.unitAttemptId,
          completedRoundIds: [], skippedRoundIds: []
        };
        if (!progress.completedRoundIds.includes(event.roundId)
          && !progress.skippedRoundIds.includes(event.roundId)) {
          progress.skippedRoundIds.push(event.roundId);
        }
        state.rolePracticeProgress[event.practiceId] = progress;
      }
      if (event.type === 'microtask-completed') {
        if (!state.completedMicrotaskIds.includes(event.microtaskId)) {
          state.completedMicrotaskIds.push(event.microtaskId);
        }
        delete state.rolePracticeProgress[practiceId];
        state.skippedMicrotaskIds = state.skippedMicrotaskIds
          .filter(microtaskId => microtaskId !== event.microtaskId);
      }
      if (event.type === 'microtask-skipped') {
        if (!state.skippedMicrotaskIds.includes(event.microtaskId)) {
          state.skippedMicrotaskIds.push(event.microtaskId);
        }
        state.checkpoint = {
          checkpointId: event.checkpointId,
          microtaskId: event.microtaskId,
          completionStatus: 'skipped'
        };
      }
      return { status: 'applied', persisted: true, effects: [], snapshot: this.read() };
    }
  };
}

function fakeNceLedger({
  checkpoint = null,
  buildStage = 0,
  storyFacts = [],
  adventureHeartsRemaining = 3,
  failOnType = null,
  failures = 0
} = {}) {
  const events = [];
  let failuresRemaining = failures;
  return {
    events,
    read() {
      return {
        units: {
          [nceUnit.unitId]: { checkpoint, buildStage, storyFacts, adventureHeartsRemaining }
        }
      };
    },
    apply(event) {
      events.push(structuredClone(event));
      if (event.type === failOnType && failuresRemaining > 0) {
        failuresRemaining -= 1;
        return { status: 'not-persisted', persisted: false, reason: 'unavailable', effects: [] };
      }
      return { status: 'applied', persisted: true, effects: [] };
    }
  };
}

function lesson12V2Fixture() {
  const formalResult = {
    resultId: 'NCE-U01-T01:L01-W07:word-form',
    reviewCellId: 'NCE-U01-T01:L01-W07:word-form',
    challengeRef: 'L01-M07:C01',
    targetId: 'NCE-U01-T01',
    stepId: 'L01-M07:S01',
    sourceRef: 'L01-W07',
    channel: 'word-form',
    contextId: 'lost-and-found-counter',
    variantId: 'handbag',
    resultKind: 'formative'
  };
  const secondResult = {
    resultId: 'NCE-U01-T01:L02-W03:word-form',
    reviewCellId: 'NCE-U01-T01:L02-W03:word-form',
    challengeRef: 'L01-M07:C02',
    targetId: 'NCE-U01-T01',
    stepId: 'L01-M07:S02',
    sourceRef: 'L02-W03',
    channel: 'word-form',
    contextId: 'lost-and-found-counter',
    variantId: 'book',
    resultKind: 'formative'
  };
  const firstTask = {
    microtaskId: 'L01-M07',
    lessonId: 'lesson1',
    targetResults: [formalResult, secondResult],
    presentation: { title: '手提包标签' },
    persistence: { atomic: true, checkpointFacts: ['handbag-labelled'] },
    checkpointAfterSuccess: { checkpointId: 'L01-M07:complete' },
    steps: [{
      stepId: 'L01-M07:S01',
      kind: 'match-entity',
      submissionMode: 'formal',
      challengeRef: formalResult.challengeRef,
      resultId: formalResult.resultId,
      reviewCellId: formalResult.reviewCellId,
      sourceRef: formalResult.sourceRef,
      channel: formalResult.channel,
      contextId: formalResult.contextId,
      candidateEntityIds: ['handbag', 'book', 'watch', 'pen'],
      answerRule: { type: 'match-entity', pairs: { 'L01-W07': 'handbag' } },
      supportLayers: [
        { level: 'reobserve', message: '看看哪一件是手提包。' },
        { level: 'partial-cue', message: '注意单词开头和物品形状。' },
        { level: 'model', message: '小猫用另一件物品示范。' }
      ]
    }, {
      stepId: 'L01-M07:S02',
      kind: 'match-entity',
      submissionMode: 'formal',
      challengeRef: secondResult.challengeRef,
      resultId: secondResult.resultId,
      reviewCellId: secondResult.reviewCellId,
      sourceRef: secondResult.sourceRef,
      channel: secondResult.channel,
      contextId: secondResult.contextId,
      candidateEntityIds: ['handbag', 'book', 'watch', 'pen'],
      answerRule: { type: 'match-entity', pairs: { 'L02-W03': 'book' } },
      supportLayers: [
        { level: 'reobserve', message: '再看一看。' },
        { level: 'partial-cue', message: '注意开头字母。' },
        { level: 'model', message: '小猫换一个词示范。' }
      ]
    }]
  };
  const laterTask = {
    microtaskId: 'L01-M08',
    lessonId: 'lesson1',
    targetResults: [],
    presentation: { title: '下一段' },
    persistence: { atomic: true, checkpointFacts: [] },
    checkpointAfterSuccess: { checkpointId: 'L01-M08:complete' },
    steps: [{
      stepId: 'L01-M08:S01', kind: 'story-action', submissionMode: 'story',
      answerRule: { type: 'perform-action', action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
    }]
  };
  return {
    unitId: 'NCE-U01',
    experienceRevision: 'lesson1-2-v2.2',
    runtimeProfile: 'microtask-v2',
    lessonIds: ['lesson1', 'lesson2'],
    shuffleProtocol: {
      hash: 'fnv1a32-v1', prng: 'mulberry32-v1', permutation: 'fisher-yates-v1',
      seedDomain: ['experienceRevision', 'unitAttemptId', 'microtaskId', 'attemptRevision', 'channel', 'challengeRef']
    },
    entities: {
      handbag: { entityId: 'handbag' }, book: { entityId: 'book' },
      watch: { entityId: 'watch' }, pen: { entityId: 'pen' }
    },
    lessonContent: {
      lesson1: { sources: { 'L01-W07': { sourceId: 'L01-W07', text: 'handbag', audioSrc: '/handbag.mp3' } } },
      lesson2: { sources: { 'L02-W03': { sourceId: 'L02-W03', text: 'book', audioSrc: '/book.mp3' } } }
    },
    authoredContent: {},
    beats: [
      { beatId: 'discover', microtasks: [firstTask, laterTask] },
      { beatId: 'understand', microtasks: [] },
      { beatId: 'teach', microtasks: [] },
      { beatId: 'transfer', microtasks: [] },
      { beatId: 'build', microtasks: [] }
    ]
  };
}

function lesson12PresentationFixture() {
  const unitV2 = lesson12V2Fixture();
  const [firstTask, laterTask] = unitV2.beats[0].microtasks;
  firstTask.presentation.moments = [
    { momentId: 'task-enter', enterWhen: { kind: 'microtask-start' } },
    { momentId: 'first-instruction-audio', enterWhen: { kind: 'phase', phase: 'audio-playing' } },
    { momentId: 'first-response-open', enterWhen: { kind: 'phase', phase: 'awaiting-response' } },
    {
      momentId: 'first-challenge-complete',
      enterWhen: { kind: 'challenge-completed', challengeRef: 'L01-M07:C01' }
    },
    {
      momentId: 'second-challenge-active',
      enterWhen: { kind: 'challenge-active', challengeRef: 'L01-M07:C02' }
    },
    {
      momentId: 'second-challenge-complete',
      enterWhen: { kind: 'challenge-completed', challengeRef: 'L01-M07:C02' }
    },
    { momentId: 'save-retry', enterWhen: { kind: 'phase', phase: 'persistence-retry' } },
    { momentId: 'task-complete', enterWhen: { kind: 'microtask-complete' } }
  ];
  laterTask.presentation.moments = [
    { momentId: 'story-enter', enterWhen: { kind: 'microtask-start' } },
    { momentId: 'story-action', enterWhen: { kind: 'step-active', stepId: 'L01-M08:S01' } },
    { momentId: 'story-save-retry', enterWhen: { kind: 'phase', phase: 'persistence-retry' } },
    { momentId: 'story-complete', enterWhen: { kind: 'microtask-complete' } }
  ];
  return unitV2;
}

function durableContinuationFixture({
  terminalMomentId = 'knowledge-layer',
  restStopId = 'lesson2-midpoint-rest-stop',
  restStopType = 'section'
} = {}) {
  const firstTask = {
    microtaskId: restStopType === 'chapter' ? 'L01-M11' : 'L02-M15',
    lessonId: restStopType === 'chapter' ? 'lesson1' : 'lesson2',
    exposureRefs: [],
    targetResults: [],
    presentation: {
      title: '待确认成果',
      moments: [
        { momentId: 'task-enter', enterWhen: { kind: 'microtask-start' } },
        { momentId: 'story-action', enterWhen: { kind: 'step-active', stepId: 'S01' } },
        ...(terminalMomentId ? [{
          momentId: terminalMomentId,
          enterWhen: { kind: 'microtask-complete' }
        }] : [])
      ]
    },
    persistence: { atomic: true, checkpointFacts: [] },
    checkpointAfterSuccess: { checkpointId: 'first:complete' },
    restStop: {
      restStopId,
      type: restStopType,
      nextMicrotaskId: 'NEXT-M01'
    },
    steps: [{
      stepId: 'S01', kind: 'story-action', submissionMode: 'story',
      answerRule: { type: 'perform-action', action: 'confirm' }
    }]
  };
  const nextTask = {
    microtaskId: 'NEXT-M01',
    lessonId: 'lesson2',
    exposureRefs: [],
    targetResults: [],
    presentation: {
      title: '下一阶段',
      moments: [{ momentId: 'next-enter', enterWhen: { kind: 'microtask-start' } }]
    },
    persistence: { atomic: true, checkpointFacts: [] },
    checkpointAfterSuccess: { checkpointId: 'next:complete' },
    steps: [{
      stepId: 'NEXT:S01', kind: 'story-action', submissionMode: 'story',
      answerRule: { type: 'perform-action', action: 'continue' }
    }]
  };
  const unitV2 = {
    unitId: 'DURABLE-U01',
    experienceRevision: 'lesson1-2-v2.2',
    runtimeProfile: 'microtask-v2',
    districtId: 'durable-district',
    landmarkId: 'durable-landmark',
    lessonIds: ['lesson1', 'lesson2'],
    entities: {}, lessonContent: { lesson1: { sources: {} }, lesson2: { sources: {} } },
    authoredContent: {}, targets: [], reviewContexts: {},
    beats: [
      { beatId: 'story', microtasks: [firstTask, nextTask] },
      { beatId: 'understand', microtasks: [] },
      { beatId: 'teach', microtasks: [] },
      { beatId: 'transfer', microtasks: [] },
      { beatId: 'build', microtasks: [] }
    ]
  };
  return {
    unit: unitV2,
    catalog: {
      TEACHING_UNITS: [unitV2],
      getTeachingUnit(unitId) { return unitId === unitV2.unitId ? unitV2 : null; }
    }
  };
}

function openDurableFixtureLedger(fixture, store = createMemoryAdapter()) {
  return learningLedger.open({
    store,
    key: 'durable-continuation-ledger',
    catalog: fixture.catalog,
    clock: { learningDay: () => '2026-08-23' }
  });
}

function endPresentation(runtime, result) {
  return runtime.dispatch({
    type: 'presentation/ended',
    experienceRevision: result.snapshot.experienceRevision,
    stateVersion: result.snapshot.stateVersion,
    microtaskId: result.snapshot.microtaskId,
    attemptRevision: result.snapshot.attemptRevision,
    momentId: result.snapshot.currentPresentationMomentId
  });
}

function fakeRevisionLedger({ unitState = null, failOnType = null, failures = 0 } = {}) {
  const events = [];
  let remainingFailures = failures;
  return {
    events,
    read() {
      return { units: unitState ? { 'NCE-U01': structuredClone(unitState) } : {} };
    },
    apply(event) {
      events.push(structuredClone(event));
      if (event.type === failOnType && remainingFailures > 0) {
        remainingFailures -= 1;
        return { persisted: false, status: 'not-persisted', reason: 'unavailable' };
      }
      if (event.type === 'role-practice-round-completed' && unitState) {
        unitState.rolePracticeProgress = unitState.rolePracticeProgress || {};
        const progress = unitState.rolePracticeProgress[event.practiceId] || {
          microtaskId: event.microtaskId,
          unitAttemptId: event.unitAttemptId,
          completedRoundIds: []
        };
        if (!progress.completedRoundIds.includes(event.roundId)) {
          progress.completedRoundIds.push(event.roundId);
        }
        unitState.rolePracticeProgress[event.practiceId] = progress;
      }
      return { persisted: true, status: 'applied' };
    }
  };
}

function fakeLedger({ checkpoint = null, buildStage = 0, failOnType = null } = {}) {
  const events = [];
  return {
    events,
    read() {
      return {
        units: {
          [unit.unitId]: { checkpoint, buildStage }
        }
      };
    },
    apply(event) {
      events.push(structuredClone(event));
      if (event.type === failOnType) {
        return { status: 'not-persisted', persisted: false, reason: 'unavailable', effects: [] };
      }
      return { status: 'applied', persisted: true, effects: [] };
    }
  };
}

function answerAction(runtime, { correct = true, teachingUnit = unit, spoof = {} } = {}) {
  const runtimeState = runtime.snapshot();
  const beat = teachingUnit.beats.find(candidate => candidate.beatId === runtimeState.beatId);
  const expectedAnswerId = beat.task.answerKeyByContext[runtimeState.contextId];
  return {
    type: 'answer/submit',
    answerId: correct ? expectedAnswerId : `wrong:${expectedAnswerId}`,
    ...spoof
  };
}

function endAvailablePresentation(runtime, current, limit = 32) {
  let result = current;
  for (let count = 0; result.snapshot.presentationAwaitingEnd; count += 1) {
    assert.ok(count < limit, 'presentation moments must settle without an unbounded loop');
    result = runtime.dispatch({
      type: 'presentation/ended',
      experienceRevision: result.snapshot.experienceRevision,
      stateVersion: result.snapshot.stateVersion,
      microtaskId: result.snapshot.microtaskId,
      attemptRevision: result.snapshot.attemptRevision,
      momentId: result.snapshot.currentPresentationMomentId
    });
  }
  return result;
}

test('Lesson 1–2 V2 publishes the frozen deterministic shuffle vector through its current challenge snapshot', () => {
  const unitV2 = lesson12V2Fixture();
  const first = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 1 })
    .enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-alpha' });
  const second = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 999 })
    .enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-alpha' });

  assert.deepEqual({
    experienceRevision: first.snapshot.experienceRevision,
    unitAttemptId: first.snapshot.unitAttemptId,
    attemptRevision: first.snapshot.attemptRevision,
    challengeRef: first.snapshot.challengeRef,
    challengeSourceRef: first.snapshot.challengeSourceRef,
    shuffleSeed: first.snapshot.shuffleSeed,
    shuffleAlgorithmVersion: first.snapshot.shuffleAlgorithmVersion,
    optionIds: first.snapshot.optionIds
  }, {
    experienceRevision: 'lesson1-2-v2.2',
    unitAttemptId: 'attempt-alpha',
    attemptRevision: 0,
    challengeRef: 'L01-M07:C01',
    challengeSourceRef: 'L01-W07',
    shuffleSeed: 991944543,
    shuffleAlgorithmVersion: 'fnv1a32-v1+mulberry32-v1+fisher-yates-v1',
    optionIds: ['watch', 'handbag', 'book', 'pen']
  });
  assert.deepEqual(second.snapshot.optionIds, first.snapshot.optionIds);
});

test('Lesson 1–2 V2 advances presentation moments only from authored runtime conditions', () => {
  const unitV2 = lesson12PresentationFixture();
  const firstChallenge = unitV2.beats[0].microtasks[0].steps[0];
  firstChallenge.audioSequence = {
    segments: [{
      segmentId: 'L01-M07:C01:instruction', sourceRef: 'L01-W07',
      text: 'handbag', audioSrc: '/handbag.mp3'
    }]
  };
  const ledger = fakeRevisionLedger();
  const runtime = create({ unit: unitV2, ledger, seed: 201 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'moment-path' });

  assert.equal(current.snapshot.currentPresentationMomentId, 'task-enter');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.snapshot.phase, null);
  assert.deepEqual(current.effects.map(effect => effect.type), ['scene/show']);
  assert.deepEqual(current.snapshot.temporaryResults, []);
  assert.equal(current.snapshot.adventureHearts, 3);
  assert.equal(ledger.events.length, 0);

  const redrawn = runtime.snapshot();
  assert.equal(redrawn.currentPresentationMomentId, 'task-enter');
  const reducedMotion = runtime.dispatch({
    type: 'preferences/reduced-motion', reduced: true,
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(reducedMotion.effects[0].reason, 'command-not-allowed');
  assert.equal(reducedMotion.snapshot.currentPresentationMomentId, 'task-enter');
  assert.equal(reducedMotion.snapshot.stateVersion, current.snapshot.stateVersion);

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-instruction-audio');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.deepEqual(current.effects.map(effect => effect.type), [
    'runtime/presentation-moment-ended', 'audio/play'
  ]);

  const stalePresentation = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: 'task-enter'
  });
  assert.equal(stalePresentation.effects[0].reason, 'presentation-moment-mismatch');
  assert.equal(stalePresentation.snapshot.currentPresentationMomentId, 'first-instruction-audio');

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-instruction-audio');
  assert.equal(current.snapshot.presentationAwaitingEnd, false);

  const duplicatePresentation = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(duplicatePresentation.effects[0].reason, 'presentation-moment-already-ended');
  assert.equal(duplicatePresentation.snapshot.currentPresentationMomentId, 'first-instruction-audio');
  assert.equal(duplicatePresentation.snapshot.presentationAwaitingEnd, false);
  assert.deepEqual(duplicatePresentation.snapshot.temporaryResults, []);
  assert.equal(duplicatePresentation.snapshot.adventureHearts, 3);
  assert.equal(ledger.events.length, 0);

  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-response-open');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C01');
  assert.deepEqual(current.snapshot.temporaryResults, []);
  assert.equal(current.snapshot.adventureHearts, 3);
  assert.equal(ledger.events.length, 0);

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-response-open');

  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-challenge-complete');
  assert.equal(current.snapshot.phase, 'audio-playing');
  const completedAudioIdentity = {
    requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision
  };

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-challenge-complete');

  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    ...completedAudioIdentity
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'second-challenge-active');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C02');

  const late = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    ...completedAudioIdentity
  });
  assert.equal(late.effects[0].reason, 'audio-request-mismatch');
  assert.equal(late.snapshot.currentPresentationMomentId, 'second-challenge-active');

  const refreshed = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 999 })
    .enter({ entryLesson: 'lesson1', unitAttemptId: 'moment-path' });
  const sandbox = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 777 })
    .preview({ microtaskId: 'L01-M07', unitAttemptId: 'moment-path' });
  assert.equal(refreshed.snapshot.currentPresentationMomentId, 'task-enter');
  assert.equal(sandbox.snapshot.currentPresentationMomentId, 'task-enter');
  assert.equal(refreshed.snapshot.presentationAwaitingEnd, true);
  assert.equal(sandbox.snapshot.presentationAwaitingEnd, true);
});

test('Lesson 1–2 V2 does not start the next audio challenge before the submitted challenge settle moment ends', () => {
  const unitV2 = lesson12PresentationFixture();
  const secondStep = unitV2.beats[0].microtasks[0].steps[1];
  secondStep.audioSequence = {
    segments: [{
      segmentId: 'L01-M07:C02:instruction', sourceRef: 'L02-W03',
      text: 'book', audioSrc: '/book.mp3'
    }]
  };
  const runtime = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 206 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'settle-before-next-audio' });

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-response-open');
  const fastTap = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(fastTap.effects[0].reason, 'presentation-moment-not-ended');
  assert.deepEqual(fastTap.snapshot.temporaryResults, []);
  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-challenge-complete');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C01');

  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-challenge-complete');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C01');
  assert.equal(current.effects.some(effect => effect.type === 'audio/play'), false);

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'second-challenge-active');
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C02');
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.equal(current.effects.at(-1).type, 'audio/play');
  assert.equal(current.effects.at(-1).sourceRef, 'L02-W03');
});

test('Lesson 1–2 V2 derives story, save, and sandbox-complete moments without extra evidence', () => {
  const unitV2 = lesson12PresentationFixture();
  unitV2.beats[0].microtasks = [unitV2.beats[0].microtasks[1]];
  const ledger = fakeRevisionLedger({ failOnType: 'microtask-completed', failures: 1 });
  const runtime = create({ unit: unitV2, ledger, seed: 202 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'story-moments' });

  assert.equal(current.snapshot.currentPresentationMomentId, 'story-enter');
  assert.equal(current.snapshot.phase, null);
  assert.deepEqual(current.snapshot.temporaryResults, []);
  assert.equal(current.snapshot.adventureHearts, 3);

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-action');
  assert.equal(current.snapshot.phase, 'awaiting-response');
  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-action');

  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-save-retry');
  assert.equal(current.snapshot.phase, 'persistence-retry');
  assert.deepEqual(current.snapshot.temporaryResults, []);
  assert.deepEqual(current.snapshot.completedMicrotaskIds, []);
  assert.equal(current.snapshot.adventureHearts, 3);
  assert.deepEqual(ledger.events.map(event => event.type), ['microtask-completed']);

  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-save-retry');

  current = runtime.dispatch({
    type: 'persistence/retry', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-complete');
  assert.equal(current.snapshot.microtaskStatus, 'completed');
  assert.deepEqual(current.snapshot.completedMicrotaskIds, ['L01-M08']);
  assert.deepEqual(ledger.events.map(event => event.type), [
    'microtask-completed', 'microtask-completed'
  ]);

  const sandboxLedger = fakeRevisionLedger();
  const sandboxRuntime = create({ unit: unitV2, ledger: sandboxLedger, seed: 203 });
  let sandbox = sandboxRuntime.preview({ microtaskId: 'L01-M08', unitAttemptId: 'story-sandbox' });
  assert.equal(sandbox.snapshot.currentPresentationMomentId, 'story-enter');
  sandbox = sandboxRuntime.dispatch({
    type: 'presentation/ended', experienceRevision: sandbox.snapshot.experienceRevision,
    stateVersion: sandbox.snapshot.stateVersion, microtaskId: sandbox.snapshot.microtaskId,
    attemptRevision: sandbox.snapshot.attemptRevision,
    momentId: sandbox.snapshot.currentPresentationMomentId
  });
  assert.equal(sandbox.snapshot.currentPresentationMomentId, 'story-action');
  sandbox = sandboxRuntime.dispatch({
    type: 'presentation/ended', experienceRevision: sandbox.snapshot.experienceRevision,
    stateVersion: sandbox.snapshot.stateVersion, microtaskId: sandbox.snapshot.microtaskId,
    attemptRevision: sandbox.snapshot.attemptRevision,
    momentId: sandbox.snapshot.currentPresentationMomentId
  });
  sandbox = sandboxRuntime.dispatch({
    type: 'response/submit', experienceRevision: sandbox.snapshot.experienceRevision,
    stateVersion: sandbox.snapshot.stateVersion,
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
  });
  assert.equal(sandbox.snapshot.currentPresentationMomentId, 'story-complete');
  assert.equal(sandbox.snapshot.microtaskStatus, 'practice-complete');
  assert.deepEqual(sandbox.snapshot.completedMicrotaskIds, []);
  assert.equal(sandbox.snapshot.adventureHearts, 3);
  assert.equal(sandboxLedger.events.length, 0);
});

test('Lesson 1–2 V2 holds a saved microtask completion moment before entering the next task', () => {
  const unitV2 = lesson12PresentationFixture();
  const persisted = {
    experienceRevision: unitV2.experienceRevision,
    unitAttemptId: 'terminal-gate',
    completedMicrotaskIds: [],
    storyFacts: [],
    adventureHeartsRemaining: 3,
    buildStage: 0
  };
  const ledger = {
    events: [],
    read() { return { units: { [unitV2.unitId]: structuredClone(persisted) } }; },
    apply(event) {
      this.events.push(structuredClone(event));
      if (event.type === 'microtask-completed') {
        persisted.completedMicrotaskIds = [...new Set([
          ...persisted.completedMicrotaskIds,
          event.microtaskId
        ])];
        persisted.storyFacts = [...new Set([...persisted.storyFacts, ...event.storyFacts])];
        persisted.adventureHeartsRemaining = event.adventureHeartsRemaining;
      }
      return { persisted: true, status: 'applied' };
    }
  };
  const runtime = create({ unit: unitV2, ledger, seed: 204 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'terminal-gate' });

  function endCurrentMoment() {
    current = runtime.dispatch({
      type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
      attemptRevision: current.snapshot.attemptRevision,
      momentId: current.snapshot.currentPresentationMomentId
    });
  }

  endCurrentMoment();
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-response-open');
  endCurrentMoment();
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'first-challenge-complete');
  endCurrentMoment();
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'second-challenge-active');
  endCurrentMoment();
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L02-W03', entityId: 'book' }
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'second-challenge-complete');
  endCurrentMoment();
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });

  assert.equal(current.snapshot.microtaskId, 'L01-M07');
  assert.equal(current.snapshot.microtaskStatus, 'completed');
  assert.equal(current.snapshot.currentPresentationMomentId, 'task-complete');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.deepEqual(current.snapshot.completedMicrotaskIds, ['L01-M07']);
  assert.equal(ledger.events.length, 1);
  assert.equal(current.snapshot.adventureHearts, 3);

  endCurrentMoment();
  assert.equal(current.snapshot.microtaskId, 'L01-M08');
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-enter');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.snapshot.adventureHearts, 3);
  assert.equal(ledger.events.length, 1);

  const refreshed = create({ unit: unitV2, ledger, seed: 205 })
    .enter({ entryLesson: 'lesson1', unitAttemptId: 'terminal-gate' });
  assert.equal(refreshed.snapshot.microtaskId, 'L01-M08');
  assert.equal(refreshed.snapshot.currentPresentationMomentId, 'story-enter');
  assert.equal(ledger.events.length, 1);
});

test('Lesson 1–2 V2 refresh restores the saved knowledge terminal, then the section rest, without re-answering', () => {
  const fixture = durableContinuationFixture();
  const store = createMemoryAdapter();
  const outbox = createMemoryAdapter();
  const ledger = openDurableFixtureLedger(fixture, store);
  const firstRuntime = create({ unit: fixture.unit, ledger, outbox, seed: 210 });
  let current = firstRuntime.enter({ entryLesson: 'lesson2', unitAttemptId: 'durable-attempt' });

  current = endPresentation(firstRuntime, current);
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-action');
  current = endPresentation(firstRuntime, current);
  current = firstRuntime.dispatch({
    type: 'response/submit',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    response: { action: 'confirm' }
  });
  assert.equal(current.snapshot.microtaskId, 'L02-M15');
  assert.equal(current.snapshot.microtaskStatus, 'completed');
  assert.equal(current.snapshot.currentPresentationMomentId, 'knowledge-layer');
  assert.equal(ledger.read().units['DURABLE-U01'].pendingUiContinuation.kind, 'terminal-presentation');
  assert.deepEqual(current.snapshot.temporaryResults, []);

  const refreshedRuntime = create({ unit: fixture.unit, ledger, outbox, seed: 211 });
  let refreshed = refreshedRuntime.enter({ entryLesson: 'lesson2', unitAttemptId: 'durable-attempt' });
  assert.equal(refreshed.snapshot.microtaskId, 'L02-M15');
  assert.equal(refreshed.snapshot.microtaskStatus, 'completed');
  assert.equal(refreshed.snapshot.currentPresentationMomentId, 'knowledge-layer');
  assert.equal(refreshed.snapshot.presentationAwaitingEnd, true);
  assert.deepEqual(refreshed.snapshot.temporaryResults, []);
  assert.deepEqual(ledger.read().units['DURABLE-U01'].completedMicrotaskIds, ['L02-M15']);

  refreshed = endPresentation(refreshedRuntime, refreshed);
  assert.equal(refreshed.snapshot.status, 'rest-stop');
  assert.equal(ledger.read().units['DURABLE-U01'].pendingUiContinuation.kind, 'rest-stop');

  const restRuntime = create({ unit: fixture.unit, ledger, outbox, seed: 212 });
  let atRest = restRuntime.enter({ entryLesson: 'lesson2', unitAttemptId: 'durable-attempt' });
  assert.equal(atRest.snapshot.status, 'rest-stop');
  assert.equal(atRest.snapshot.microtaskId, 'L02-M15');
  assert.deepEqual(atRest.snapshot.nextRestStop, {
    restStopId: 'lesson2-midpoint-rest-stop', type: 'section', nextMicrotaskId: 'NEXT-M01'
  });

  atRest = restRuntime.dispatch({
    type: 'rest-stop/continue',
    experienceRevision: atRest.snapshot.experienceRevision,
    stateVersion: atRest.snapshot.stateVersion
  });
  assert.equal(atRest.snapshot.microtaskId, 'NEXT-M01');
  assert.equal(atRest.snapshot.currentPresentationMomentId, 'next-enter');
  assert.equal(ledger.read().units['DURABLE-U01'].pendingUiContinuation, null);

  const afterContinue = create({ unit: fixture.unit, ledger, outbox, seed: 213 })
    .enter({ entryLesson: 'lesson2', unitAttemptId: 'durable-attempt' });
  assert.equal(afterContinue.snapshot.microtaskId, 'NEXT-M01');
  assert.equal(afterContinue.snapshot.currentPresentationMomentId, 'next-enter');
});

test('Lesson 1–2 V2 refresh restores a saved chapter rest until the child explicitly continues', () => {
  const fixture = durableContinuationFixture({
    terminalMomentId: null,
    restStopId: 'lesson1-chapter-stop',
    restStopType: 'chapter'
  });
  const store = createMemoryAdapter();
  const outbox = createMemoryAdapter();
  const ledger = openDurableFixtureLedger(fixture, store);
  const runtime = create({ unit: fixture.unit, ledger, outbox, seed: 214 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'chapter-attempt' });
  current = endPresentation(runtime, current);
  current = endPresentation(runtime, current);
  current = runtime.dispatch({
    type: 'response/submit',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    response: { action: 'confirm' }
  });
  assert.equal(current.snapshot.status, 'rest-stop');

  const refreshed = create({ unit: fixture.unit, ledger, outbox, seed: 215 })
    .enter({ entryLesson: 'lesson1', unitAttemptId: 'chapter-attempt' });
  assert.equal(refreshed.snapshot.status, 'rest-stop');
  assert.equal(refreshed.snapshot.microtaskId, 'L01-M11');
  assert.equal(refreshed.snapshot.nextRestStop.restStopId, 'lesson1-chapter-stop');
  assert.deepEqual(ledger.read().units['DURABLE-U01'].completedMicrotaskIds, ['L01-M11']);
});

test('Lesson 1–2 V2 settles only the submitted current challenge and keeps the full candidate set for the next one', () => {
  const runtime = create({ unit: lesson12V2Fixture(), ledger: fakeRevisionLedger(), seed: 2 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-alpha' });

  const missingIdentity = runtime.dispatch({
    type: 'response/submit', response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(missingIdentity.effects[0].type, 'runtime/command-rejected');
  assert.equal(missingIdentity.effects[0].reason, 'experience-revision-mismatch');
  assert.deepEqual(missingIdentity.snapshot.temporaryResults, []);

  current = runtime.dispatch({
    type: 'response/submit',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.equal(current.snapshot.temporaryResults.length, 1);
  assert.equal(current.snapshot.temporaryResults[0].resultId, 'NCE-U01-T01:L01-W07:word-form');
  assert.deepEqual(current.effects.map(effect => effect.type), ['feedback/correct', 'audio/play']);
  assert.equal(current.effects[1].visibleText, 'handbag');

  current = runtime.dispatch({
    type: 'audio/ended',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C02');
  assert.equal(current.snapshot.challengeSourceRef, 'L02-W03');
  assert.deepEqual([...current.snapshot.optionIds].sort(), ['book', 'handbag', 'pen', 'watch']);

  const late = runtime.dispatch({
    type: 'response/submit',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    challengeRef: 'L01-M07:C01',
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(late.effects[0].reason, 'challenge-ref-mismatch');
  assert.deepEqual(late.snapshot.temporaryResults.map(result => result.resultId), [
    'NCE-U01-T01:L01-W07:word-form'
  ]);
});

test('Lesson 1–2 V2 opens an audio-led response only for the current request and segment real ended command', () => {
  const unitV2 = lesson12V2Fixture();
  const result = unitV2.beats[0].microtasks[0].targetResults[0];
  const challenge = unitV2.beats[0].microtasks[0].steps[0];
  result.channel = 'audio-form-supported';
  challenge.channel = 'audio-form-supported';
  challenge.audioSequence = {
    segments: [{
      segmentId: 'L01-M07:C01:prompt', sourceRef: 'L01-W07',
      text: 'handbag', audioSrc: '/handbag.mp3'
    }]
  };
  const runtime = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 3 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-audio' });
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.equal(current.effects.at(-1).type, 'audio/play');

  const beforeSound = runtime.dispatch({
    type: 'response/submit',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(beforeSound.effects[0].reason, 'response-not-open');
  assert.deepEqual(beforeSound.snapshot.temporaryResults, []);

  assert.equal(current.snapshot.phase, 'audio-playing');
  const playEffect = current.effects.at(-1);
  assert.deepEqual({
    experienceRevision: playEffect.experienceRevision,
    microtaskId: playEffect.microtaskId,
    attemptRevision: playEffect.attemptRevision,
    segmentId: playEffect.segmentId,
    visibleText: playEffect.visibleText
  }, {
    experienceRevision: 'lesson1-2-v2.2',
    microtaskId: 'L01-M07',
    attemptRevision: 0,
    segmentId: 'L01-M07:C01:prompt',
    visibleText: 'handbag'
  });

  const originalRequestId = current.snapshot.audio.requestId;
  const replayed = runtime.dispatch({
    type: 'audio/play',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    challengeRef: current.snapshot.challengeRef
  });
  assert.deepEqual(replayed.effects.map(effect => effect.type), ['audio/cancel', 'audio/play']);
  assert.equal(replayed.effects[0].requestId, originalRequestId);
  assert.notEqual(replayed.snapshot.audio.requestId, originalRequestId);
  current = replayed;

  const stale = runtime.dispatch({
    type: 'audio/ended',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: originalRequestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(stale.effects[0].reason, 'audio-request-mismatch');
  assert.equal(stale.snapshot.phase, 'audio-playing');
  assert.deepEqual(stale.snapshot.temporaryResults, []);

  current = runtime.dispatch({
    type: 'audio/ended',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.phase, 'awaiting-response');
  assert.deepEqual(current.snapshot.temporaryResults, []);
});

test('Lesson 1–2 V2 suspends required audio across page lifecycle without spending a retry or accepting a late ended', () => {
  const unitV2 = lesson12V2Fixture();
  const result = unitV2.beats[0].microtasks[0].targetResults[0];
  const challenge = unitV2.beats[0].microtasks[0].steps[0];
  result.channel = 'audio-form-supported';
  challenge.channel = 'audio-form-supported';
  challenge.audioSequence = {
    segments: [{
      segmentId: 'L01-M07:C01:prompt', sourceRef: 'L01-W07',
      text: 'handbag', audioSrc: '/handbag.mp3'
    }]
  };
  const runtime = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 304 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'page-lifecycle' });
  const original = {
    requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId,
    retryAttempt: current.snapshot.audio.retryAttempt,
    hearts: current.snapshot.adventureHeartsRemaining
  };

  current = runtime.dispatch({
    type: 'audio/suspend',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.phase, 'audio-suspended');
  assert.equal(current.snapshot.audio.status, 'suspended');
  assert.deepEqual(current.effects, [{
    type: 'audio/cancel',
    experienceRevision: 'lesson1-2-v2.2',
    microtaskId: 'L01-M07',
    attemptRevision: 0,
    requestId: original.requestId
  }]);
  assert.equal(current.snapshot.audio.retryAttempt, original.retryAttempt);
  assert.equal(current.snapshot.adventureHeartsRemaining, original.hearts);
  assert.deepEqual(current.snapshot.temporaryResults, []);

  const late = runtime.dispatch({
    type: 'audio/ended',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: original.requestId,
    segmentId: original.segmentId
  });
  assert.equal(late.effects[0].reason, 'audio-not-playing');
  assert.equal(late.snapshot.phase, 'audio-suspended');
  assert.deepEqual(late.snapshot.temporaryAudioContactRefs, []);

  current = runtime.dispatch({
    type: 'audio/resume',
    experienceRevision: late.snapshot.experienceRevision,
    stateVersion: late.snapshot.stateVersion,
    challengeRef: late.snapshot.challengeRef
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.equal(current.snapshot.audio.segmentId, original.segmentId);
  assert.notEqual(current.snapshot.audio.requestId, original.requestId);
  assert.equal(current.snapshot.audio.retryAttempt, original.retryAttempt);
  assert.equal(current.snapshot.adventureHeartsRemaining, original.hearts);
  assert.equal(current.effects[0].type, 'audio/play');
  assert.equal(current.effects[0].visibleText, 'handbag');
});

test('Lesson 1–2 V2 keeps autoplay policy blocks neutral and resumes from the same segment', () => {
  const unitV2 = lesson12V2Fixture();
  const result = unitV2.beats[0].microtasks[0].targetResults[0];
  const challenge = unitV2.beats[0].microtasks[0].steps[0];
  result.channel = 'audio-form-supported';
  challenge.channel = 'audio-form-supported';
  challenge.audioSequence = {
    segments: [{
      segmentId: 'L01-M07:C01:prompt', sourceRef: 'L01-W07',
      text: 'handbag', audioSrc: '/handbag.mp3'
    }]
  };
  const runtime = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 305 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'autoplay-policy' });
  const original = {
    requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId,
    retryAttempt: current.snapshot.audio.retryAttempt,
    hearts: current.snapshot.adventureHeartsRemaining
  };

  current = runtime.dispatch({
    type: 'audio/blocked',
    reason: 'autoplay-policy',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.phase, 'audio-blocked');
  assert.equal(current.snapshot.audio.status, 'blocked');
  assert.equal(current.snapshot.audio.reason, 'autoplay-policy');
  assert.equal(current.snapshot.audio.manualRetryRequired, false);
  assert.equal(current.snapshot.audio.retryAttempt, original.retryAttempt);
  assert.equal(current.snapshot.adventureHeartsRemaining, original.hearts);
  assert.deepEqual(current.snapshot.temporaryAudioContactRefs, []);
  assert.deepEqual(current.effects, [{
    type: 'audio/cancel',
    experienceRevision: 'lesson1-2-v2.2',
    microtaskId: 'L01-M07',
    attemptRevision: 0,
    requestId: original.requestId
  }]);

  current = runtime.dispatch({
    type: 'audio/resume',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    challengeRef: current.snapshot.challengeRef
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.equal(current.snapshot.audio.segmentId, original.segmentId);
  assert.notEqual(current.snapshot.audio.requestId, original.requestId);
  assert.equal(current.snapshot.audio.retryAttempt, original.retryAttempt);
  assert.equal(current.effects[0].type, 'audio/play');
  assert.equal(current.effects[0].visibleText, 'handbag');
});

test('Lesson 1–2 V2 retries transient audio at 250 and 750 ms then remains visibly fail-closed', () => {
  const unitV2 = lesson12V2Fixture();
  const challenge = unitV2.beats[0].microtasks[0].steps[0];
  unitV2.beats[0].microtasks[0].targetResults[0].channel = 'audio-form-supported';
  challenge.channel = 'audio-form-supported';
  challenge.audioSequence = {
    segments: [{ segmentId: 'word-prompt', sourceRef: 'L01-W07', text: 'handbag', audioSrc: '/handbag.mp3' }]
  };
  const runtime = create({ unit: unitV2, ledger: fakeRevisionLedger(), seed: 4 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-retry' });
  const initialRequestId = current.snapshot.audio.requestId;

  current = runtime.dispatch({
    type: 'audio/failed', failureKind: 'transient', reason: 'network',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: current.snapshot.audio.requestId, segmentId: current.snapshot.audio.segmentId
  });
  assert.notEqual(current.snapshot.audio.requestId, initialRequestId);
  assert.equal(current.snapshot.phase, 'audio-retry');
  assert.equal(current.snapshot.audio.retryAttempt, 1);
  assert.equal(current.snapshot.audio.manualRetryRequired, false);
  assert.equal(current.effects[0].type, 'audio/play');
  assert.equal(current.effects[0].delayMs, 250);
  assert.equal(current.effects[0].visibleText, 'handbag');

  current = runtime.dispatch({
    type: 'audio/failed', failureKind: 'transient', reason: 'network',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: current.snapshot.audio.requestId, segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.audio.retryAttempt, 2);
  assert.equal(current.effects[0].delayMs, 750);

  current = runtime.dispatch({
    type: 'audio/failed', failureKind: 'transient', reason: 'network',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    requestId: current.snapshot.audio.requestId, segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.phase, 'audio-failed');
  assert.equal(current.snapshot.audio.manualRetryRequired, true);
  assert.equal(current.effects[0].type, 'audio/failure');
  assert.equal(current.effects[0].failClosed, true);
  assert.equal(current.effects[0].visibleText, 'handbag');
  assert.equal(current.snapshot.adventureHearts, 3);
  assert.deepEqual(current.snapshot.temporaryResults, []);

  const bypass = runtime.dispatch({
    type: 'audio/continue-without-sound',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(bypass.effects[0].reason, 'command-not-allowed');
  assert.equal(bypass.snapshot.phase, 'audio-failed');

  const replay = runtime.dispatch({
    type: 'audio/retry', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef
  });
  assert.equal(replay.snapshot.phase, 'audio-playing');
  assert.equal(replay.snapshot.audio.retryAttempt, 0);
  assert.notEqual(replay.snapshot.audio.requestId, current.snapshot.audio.requestId);
});

test('Lesson 1–2 V2 audio requests stay unique across runtime reconstruction in the same millisecond', () => {
  const originalNow = Date.now;
  Date.now = () => 123456789;
  try {
    const firstRuntime = create({ unit: nceUnit, ledger: fakeRevisionLedger(), seed: 41 });
    const secondRuntime = create({ unit: nceUnit, ledger: fakeRevisionLedger(), seed: 41 });
    let first = firstRuntime.enter({ entryLesson: 'lesson1', unitAttemptId: 'same-attempt' });
    let second = secondRuntime.enter({ entryLesson: 'lesson1', unitAttemptId: 'same-attempt' });
    first = endAvailablePresentation(firstRuntime, first);
    second = endAvailablePresentation(secondRuntime, second);
    assert.notEqual(first.snapshot.audio.requestId, second.snapshot.audio.requestId);
  } finally {
    Date.now = originalNow;
  }
});

test('Lesson 1–2 V2 audio retry remains on the failed segment instead of replaying completed segments', () => {
  const runtime = create({ unit: nceUnit, ledger: fakeRevisionLedger(), seed: 42 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'segment-retry' });
  current = endAvailablePresentation(runtime, current);
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  const failedSegmentId = current.snapshot.audio.segmentId;
  const failedText = current.snapshot.audio.visibleText;

  current = runtime.dispatch({
    type: 'audio/failed', failureKind: 'transient', reason: 'network',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });

  assert.equal(current.snapshot.audio.segmentId, failedSegmentId);
  assert.equal(current.snapshot.audio.visibleText, failedText);
  assert.equal(current.effects[0].segmentId, failedSegmentId);
  assert.equal(current.effects[0].delayMs, 250);
});

test('Lesson 1–2 V2 keeps support after a correction and restarts the whole current microtask after rescue', () => {
  const runtime = create({ unit: lesson12V2Fixture(), ledger: fakeRevisionLedger(), seed: 5 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-rescue' });
  const command = (response, challengeRef = current.snapshot.challengeRef) => ({
    type: 'response/submit',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    challengeRef,
    response
  });

  current = runtime.dispatch(command({ sourceRef: 'L01-W07', entityId: 'book' }));
  assert.equal(current.snapshot.adventureHearts, 2);
  assert.equal(current.snapshot.supportLevel, 'reobserve');
  assert.equal(current.effects[0].supportKind, 'reobserve');

  current = runtime.dispatch(command({ sourceRef: 'L01-W07', entityId: 'handbag' }));
  assert.equal(current.snapshot.adventureHearts, 3);
  assert.equal(current.snapshot.temporaryResults[0].outcome, 'supported');
  assert.equal(current.snapshot.temporaryResults[0].supportLevel, 'reobserve');
  assert.equal(current.snapshot.temporaryResults[0].heartsRemaining, 3);
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C02');

  for (let count = 0; count < 3; count += 1) {
    current = runtime.dispatch(command({ sourceRef: 'L02-W03', entityId: 'pen' }));
  }
  assert.equal(current.snapshot.phase, 'rescue-model');
  assert.equal(current.snapshot.adventureHearts, 0);
  assert.equal(current.snapshot.temporaryResults.length, 1);
  assert.deepEqual(current.effects.map(effect => effect.type), ['feedback/partner-demo']);
  assert.equal(current.effects[0].changedExample, true);
  assert.equal(current.effects[0].revealsAnswer, false);

  current = runtime.dispatch({
    type: 'rescue/model-ended',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    challengeRef: current.snapshot.challengeRef
  });
  assert.deepEqual(current.effects.map(effect => effect.type), [
    'runtime/temporary-cleared',
    'runtime/attempt-revision-incremented',
    'adventure-hearts/refilled',
    'scene/restart-microtask'
  ]);
  assert.equal(current.snapshot.microtaskId, 'L01-M07');
  assert.equal(current.snapshot.challengeRef, 'L01-M07:C01');
  assert.equal(current.snapshot.attemptRevision, 1);
  assert.equal(current.snapshot.adventureHearts, 3);
  assert.equal(current.snapshot.rescueUsed, true);
  assert.deepEqual(current.snapshot.temporaryResults, []);

  for (const response of [
    { sourceRef: 'L01-W07', entityId: 'handbag' },
    { sourceRef: 'L02-W03', entityId: 'book' }
  ]) {
    current = runtime.dispatch(command(response));
    current = runtime.dispatch({
      type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
      attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
      segmentId: current.snapshot.audio.segmentId
    });
    current = endAvailablePresentation(runtime, current);
  }
  current = endAvailablePresentation(runtime, current);
  assert.equal(current.snapshot.microtaskId, 'L01-M08');
  assert.equal(current.snapshot.rescueUsed, false);
  assert.equal(current.snapshot.supportLevel, 'none');
});

test('Lesson 1–2 V2 always uses the model layer when a carried-over final heart is depleted', () => {
  const ledger = fakeRevisionLedger({
    unitState: {
      experienceRevision: 'lesson1-2-v2.6',
      completedMicrotaskIds: ['L01-M07'],
      adventureHeartsRemaining: 1,
      storyFacts: [],
      buildStage: 0
    }
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 51 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'last-heart' });
  const task = nceUnit.beats.flatMap(beat => beat.microtasks || [])
    .find(candidate => candidate.microtaskId === 'L01-M08');
  const modelLayer = task.steps[0].challenges[0].supportLayers[2];

  current = endAvailablePresentation(runtime, current);
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { entityId: 'station-keeper' }
  });

  assert.equal(current.snapshot.phase, 'rescue-model');
  assert.equal(current.snapshot.supportLevel, 'model');
  assert.equal(current.effects[0].supportKind, 'changed-example-model');
  assert.equal(current.effects[0].message, modelLayer.copy);
});

test('Lesson 1–2 V2 restores a revision-scoped pending commit and retries persistence without re-answering', () => {
  const unitV2 = lesson12PresentationFixture();
  const outbox = createMemoryAdapter();
  const unavailableLedger = fakeRevisionLedger({
    failOnType: 'microtask-completed', failures: 1
  });
  const runtime = create({
    unit: unitV2, ledger: unavailableLedger, outbox, seed: 6
  });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-outbox' });
  current = endAvailablePresentation(runtime, current);

  for (const response of [
    { sourceRef: 'L01-W07', entityId: 'handbag' },
    { sourceRef: 'L02-W03', entityId: 'book' }
  ]) {
    current = runtime.dispatch({
      type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
      response
    });
    current = runtime.dispatch({
      type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
      attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
      segmentId: current.snapshot.audio.segmentId
    });
    current = endAvailablePresentation(runtime, current);
  }

  assert.equal(current.snapshot.phase, 'persistence-retry');
  assert.equal(current.snapshot.pendingCommit.status, 'stored');
  assert.equal(current.snapshot.pendingCommit.payload.experienceRevision, 'lesson1-2-v2.2');
  assert.deepEqual(
    current.snapshot.pendingCommit.payload.targetResults.map(result => result.challengeRef),
    ['L01-M07:C01', 'L01-M07:C02']
  );
  assert.equal(unavailableLedger.events.length, 1);
  assert.equal(unavailableLedger.events[0].type, 'microtask-completed');

  const restoredLedger = fakeRevisionLedger();
  const restored = create({
    unit: unitV2, ledger: restoredLedger, outbox, seed: 600
  });
  current = restored.enter({ entryLesson: 'lesson1', unitAttemptId: 'attempt-outbox' });
  assert.equal(current.snapshot.microtaskId, 'L01-M07');
  assert.equal(current.snapshot.phase, 'persistence-retry');
  assert.equal(current.snapshot.currentPresentationMomentId, 'save-retry');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  assert.equal(current.effects[0].type, 'runtime/pending-commit-restored');

  current = restored.dispatch({
    type: 'persistence/retry',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  current = endAvailablePresentation(restored, current);
  assert.equal(restoredLedger.events.length, 1);
  assert.equal(restoredLedger.events[0].eventId, unavailableLedger.events[0].eventId);
  assert.equal(current.snapshot.microtaskId, 'L01-M08');
  assert.equal(current.snapshot.pendingCommit, null);
  assert.deepEqual(current.snapshot.completedMicrotaskIds, ['L01-M07']);
});

test('Lesson 1–2 V2 ignores malformed pending commits instead of crashing the page bootstrap', () => {
  const unitV2 = lesson12PresentationFixture();
  const attemptId = 'attempt-malformed-outbox';
  const firstBeat = unitV2.beats[0];
  const firstTask = firstBeat.microtasks[0];
  const pendingCommitKey = `learning-runtime:${unitV2.unitId}:${unitV2.experienceRevision}:pending-commit`;
  const validPayloadShape = {
    eventId: 'fixture:malformed-pending',
    type: 'microtask-completed',
    unitId: unitV2.unitId,
    experienceRevision: unitV2.experienceRevision,
    unitAttemptId: attemptId,
    attemptRevision: 0,
    beatId: firstBeat.beatId,
    microtaskId: firstTask.microtaskId,
    checkpointId: firstTask.checkpointAfterSuccess.checkpointId,
    completionStatus: 'completed-independent',
    targetResults: [],
    sourceContacts: [],
    audioContactRefs: [],
    missingAudioRefs: [],
    storyFacts: [],
    adventureHeartsRemaining: 3,
    source: 'new-learning'
  };
  const malformedValues = [
    {
      experienceRevision: unitV2.experienceRevision,
      unitAttemptId: attemptId,
      microtaskId: firstTask.microtaskId
    },
    {
      experienceRevision: unitV2.experienceRevision,
      unitAttemptId: attemptId,
      microtaskId: firstTask.microtaskId,
      payload: { ...validPayloadShape, targetResults: null }
    },
    {
      experienceRevision: unitV2.experienceRevision,
      unitAttemptId: attemptId,
      microtaskId: firstTask.microtaskId,
      payload: { ...validPayloadShape, targetResults: {} }
    },
    {
      experienceRevision: unitV2.experienceRevision,
      unitAttemptId: attemptId,
      microtaskId: firstTask.microtaskId,
      payload: { ...validPayloadShape, targetResults: [null] }
    }
  ];

  for (const value of malformedValues) {
    const outbox = createMemoryAdapter({
      [pendingCommitKey]: { revision: 1, value }
    });
    const runtime = create({
      unit: unitV2,
      ledger: fakeRevisionLedger(),
      outbox,
      seed: 62
    });
    let current;

    assert.doesNotThrow(() => {
      current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: attemptId });
    });
    assert.equal(current.snapshot.microtaskId, firstTask.microtaskId);
    assert.equal(current.snapshot.pendingCommit, null);
    assert.notEqual(current.snapshot.phase, 'persistence-retry');
    assert.equal(
      current.effects.some(effect => effect.type === 'runtime/pending-commit-restored'),
      false
    );
  }
});

test('Lesson 1–2 V2 permits a current-session save retry when durable outbox storage is unavailable', () => {
  const unavailableOutbox = {
    load() { return { status: 'unavailable', revision: 0, value: null }; },
    commit() { return { status: 'unavailable', persisted: false, revision: 0, value: null }; }
  };
  const ledger = fakeRevisionLedger();
  const runtime = create({
    unit: lesson12V2Fixture(), ledger, outbox: unavailableOutbox, seed: 61
  });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'volatile-save' });

  for (const response of [
    { sourceRef: 'L01-W07', entityId: 'handbag' },
    { sourceRef: 'L02-W03', entityId: 'book' }
  ]) {
    current = runtime.dispatch({
      type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
      response
    });
    current = runtime.dispatch({
      type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
      attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
      segmentId: current.snapshot.audio.segmentId
    });
  }
  assert.equal(current.snapshot.phase, 'persistence-retry');
  assert.equal(current.snapshot.pendingCommit.status, 'memory-only');
  assert.equal(current.effects[0].type, 'runtime/pending-commit-unprotected');

  current = runtime.dispatch({
    type: 'persistence/retry', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  current = endAvailablePresentation(runtime, current);
  assert.equal(current.snapshot.microtaskId, 'L01-M08');
  assert.equal(current.snapshot.pendingCommit, null);
  assert.equal(ledger.events.length, 1);
});

test('Lesson 1–2 V2 isolates every legacy progress field when the stored experience revision differs', () => {
  const runtime = create({
    unit: lesson12V2Fixture(),
    ledger: fakeRevisionLedger({
      unitState: {
        experienceRevision: 'lesson1-2-v1',
        unitAttemptId: 'old-attempt',
        completedMicrotaskIds: ['L01-M07', 'L01-M08'],
        checkpoint: { microtaskId: 'L01-M08' },
        adventureHearts: 0,
        buildStage: 5,
        storyFacts: ['old-story-fact'],
        resultCells: { old: { outcome: 'independent' } }
      }
    }),
    seed: 7
  });

  const entered = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'fresh-attempt' });

  assert.equal(entered.snapshot.microtaskId, 'L01-M07');
  assert.equal(entered.snapshot.unitAttemptId, 'fresh-attempt');
  assert.equal(entered.snapshot.adventureHearts, 3);
  assert.equal(entered.snapshot.buildStage, 0);
  assert.deepEqual(entered.snapshot.completedMicrotaskIds, []);
  assert.deepEqual(entered.snapshot.committedFacts, []);
  assert.deepEqual(entered.snapshot.diagnosticArchive, {
    ignoredExperienceRevision: 'lesson1-2-v1',
    reason: 'experience-revision-mismatch'
  });
});

test('Lesson 1–2 V2 restores completed language directly into verification or the built state', () => {
  const completedMicrotaskIds = nceUnit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => task.microtaskId);
  const verifyingLedger = fakeRevisionLedger({
    unitState: {
      experienceRevision: 'lesson1-2-v2.6', completedMicrotaskIds,
      adventureHeartsRemaining: 3, storyFacts: [], buildStage: 0,
      completionReadback: { readyForBuild: true }
    }
  });
  const verifyingRuntime = create({ unit: nceUnit, ledger: verifyingLedger, seed: 71 });
  const verifying = verifyingRuntime
    .enter({ entryLesson: 'lesson2', unitAttemptId: 'verify-restore' });
  assert.equal(verifying.snapshot.microtaskId, 'L02-M21');
  assert.equal(verifying.snapshot.status, 'active');
  assert.equal(verifying.snapshot.phase, 'unit-verifying');
  assert.equal(verifying.snapshot.currentPresentationMomentId, 'save-readback');
  assert.equal(verifying.snapshot.presentationAwaitingEnd, true);
  assert.equal(verifyingLedger.events.length, 0);
  const prematureVerification = verifyingRuntime.dispatch({
    type: 'unit/verify-retry', experienceRevision: verifying.snapshot.experienceRevision,
    stateVersion: verifying.snapshot.stateVersion
  });
  assert.equal(prematureVerification.effects[0].reason, 'presentation-moment-not-ended');
  assert.equal(verifyingLedger.events.length, 0);

  const builtLedger = fakeRevisionLedger({
    unitState: {
      experienceRevision: 'lesson1-2-v2.6', completedMicrotaskIds,
      adventureHeartsRemaining: 3, storyFacts: [], buildStage: 5,
      completionReadback: { readyForBuild: true }
    }
  });
  const built = create({ unit: nceUnit, ledger: builtLedger, seed: 72 })
    .enter({ entryLesson: 'lesson2', unitAttemptId: 'built-restore' });
  assert.equal(built.snapshot.status, 'unit-built');
  assert.equal(built.snapshot.phase, 'completed');
  assert.equal(built.snapshot.buildStage, 5);
  assert.equal(built.snapshot.reachedMicrotaskIds.length, 17);
  assert.equal(builtLedger.events.length, 0);
});

test('Lesson 1–2 V2 declarative rules accept the catalog single-entity challenge shape', () => {
  assert.deepEqual(evaluateRule(
    { type: 'select-one', acceptedEntityId: 'handbag-owner' },
    { entityId: 'handbag-owner' }
  ), { correct: true, mismatchPath: null });
  assert.deepEqual(evaluateRule(
    { type: 'match-entity', acceptedSourceRef: 'L01-W07', acceptedEntityId: 'handbag' },
    { sourceRef: 'L01-W07', entityId: 'handbag' }
  ), { correct: true, mismatchPath: null });
  assert.equal(evaluateRule(
    { type: 'match-entity', acceptedSourceRef: 'L01-W07', acceptedEntityId: 'handbag' },
    { sourceRef: 'L01-W07', entityId: 'book' }
  ).correct, false);
});

test('the real Lesson 1 first listen publishes all seven visible lines and their authored speakers', () => {
  const runtime = create({ unit: nceUnit, ledger: fakeRevisionLedger(), seed: 8 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'actual-first-listen' });

  assert.equal(current.snapshot.microtaskId, 'L01-M07');
  assert.equal(current.snapshot.currentPresentationMomentId, 'story-briefing');
  assert.equal(current.snapshot.phase, null);
  assert.deepEqual(current.effects.map(effect => effect.type), ['scene/show']);
  current = runtime.dispatch({
    type: 'presentation/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision,
    momentId: current.snapshot.currentPresentationMomentId
  });
  assert.equal(current.snapshot.currentPresentationMomentId, 'seven-line-listen');
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.deepEqual(current.effects.map(effect => effect.type), [
    'runtime/presentation-moment-ended', 'audio/play'
  ]);
  assert.equal(current.snapshot.audio.refs.length, 7);
  assert.deepEqual(current.snapshot.audio.refs.map(ref => ref.text), [
    'Excuse me!', 'Yes?', 'Is this your handbag?', 'Pardon?',
    'Is this your handbag?', 'Yes, it is.', 'Thank you very much.'
  ]);
  assert.deepEqual(current.snapshot.audio.refs.map(ref => ref.speaker), [
    'man', 'woman', 'man', 'woman', 'man', 'woman', 'woman'
  ]);
  assert.equal(current.effects[1].speaker, 'man');
  assert.equal(current.effects[1].visibleText, 'Excuse me!');
  current = endAvailablePresentation(runtime, current);
  assert.equal(current.snapshot.phase, 'audio-playing');

  while (current.snapshot.phase === 'audio-playing') {
    current = runtime.dispatch({
      type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
      attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
      segmentId: current.snapshot.audio.segmentId
    });
  }
  assert.deepEqual({
    microtaskId: current.snapshot.microtaskId,
    phase: current.snapshot.phase,
    momentId: current.snapshot.currentPresentationMomentId,
    presentationAwaitingEnd: current.snapshot.presentationAwaitingEnd
  }, {
    microtaskId: 'L01-M07',
    phase: 'answered-awaiting-save',
    momentId: 'listen-complete',
    presentationAwaitingEnd: true
  });
  current = endAvailablePresentation(runtime, current);
  const activeTask = nceUnit.beats.flatMap(beat => beat.microtasks || [])
    .find(task => task.microtaskId === current.snapshot.microtaskId);
  const firstChallenge = activeTask.steps
    .flatMap(step => step.challenges || [])
    .find(challenge => challenge.challengeRef === current.snapshot.challengeRef);
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { entityId: 'station-keeper' }
  });
  assert.equal(current.effects[0].type, 'feedback/support');
  assert.equal(current.effects[0].message, firstChallenge.supportLayers[0].copy);
});

test('the real Lesson 1 first-listen Source contacts pass the revisioned ledger contract', () => {
  const ledger = learningLedger.open({
    store: createMemoryAdapter(),
    key: 'lesson12-v2-source-contacts',
    catalog,
    clock: { learningDay: () => '2026-08-23' }
  });
  const runtime = create({
    unit: nceUnit, ledger, outbox: createMemoryAdapter(), seed: 81
  });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'source-contacts' });
  current = endAvailablePresentation(runtime, current);

  while (current.snapshot.microtaskId === 'L01-M07' && current.snapshot.phase === 'audio-playing') {
    current = runtime.dispatch({
      type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
      attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
      segmentId: current.snapshot.audio.segmentId
    });
  }
  current = endAvailablePresentation(runtime, current);

  const storedUnit = ledger.read().units['NCE-U01'];
  assert.equal(current.snapshot.microtaskId, 'L01-M08');
  assert.ok(storedUnit.completedMicrotaskIds.includes('L01-M07'));
  assert.deepEqual(storedUnit.sourceContacts['L01-D01'].contactModes, ['experienced', 'audio-ended']);
  assert.deepEqual(storedUnit.sourceContacts['L01-W04'].contactModes, ['experienced']);
});

test('Lesson 1 completion stops at its authored rest point before Lesson 2 and resumes explicitly', () => {
  const ledger = fakeRevisionLedger({
    unitState: {
      experienceRevision: 'lesson1-2-v2.6', unitAttemptId: 'rest-attempt',
      completedMicrotaskIds: ['L01-M07', 'L01-M08', 'L01-M09', 'L01-M10'],
      storyFacts: [], adventureHearts: 3, buildStage: 0
    }
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 9 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'rest-attempt' });
  assert.equal(current.snapshot.microtaskId, 'L01-M11');

  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  current = endAvailablePresentation(runtime, current);
  assert.notEqual(current.snapshot.currentPresentationMomentId, 'single-handoff');
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07' }
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  current = endAvailablePresentation(runtime, current);
  assert.equal(current.snapshot.stepId, 'L01-M11:S04');
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-D07' }
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  current = endAvailablePresentation(runtime, current);
  assert.equal(current.snapshot.stepId, 'L01-M11:S03');
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.equal(current.snapshot.currentPresentationMomentId, 'single-handoff');
  assert.equal(current.snapshot.presentationAwaitingEnd, true);
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  assert.equal(current.snapshot.phase, 'presentation-settling');
  current = endAvailablePresentation(runtime, current);

  assert.equal(current.snapshot.microtaskId, 'L01-M12');
  assert.equal(current.snapshot.phase, 'role-practice-ready');
  for (const roundId of ['keeper-round', 'owner-round']) {
    current = runtime.dispatch({
      type: 'role-practice/round-complete',
      experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion,
      practiceId: 'L01-M12:role-enactment',
      roundId
    });
  }
  current = runtime.dispatch({
    type: 'role-practice/complete',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    practiceId: 'L01-M12:role-enactment'
  });

  assert.equal(current.snapshot.status, 'rest-stop');
  assert.deepEqual(current.snapshot.nextRestStop, {
    restStopId: 'lesson1-chapter-stop',
    type: 'chapter',
    nextMicrotaskId: 'L02-M11'
  });
  assert.equal(current.effects.at(-1).type, 'runtime/rest-stop');
  assert.ok(current.snapshot.reachedMicrotaskIds.includes('L02-M11'));

  current = runtime.dispatch({
    type: 'rest-stop/continue', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  current = endAvailablePresentation(runtime, current);
  assert.equal(current.snapshot.status, 'active');
  assert.equal(current.snapshot.microtaskId, 'L02-M11');
  assert.equal(current.snapshot.challengeRef, 'L02-M11:C01');
});

test('reached-stage navigation runs completed stages in an isolated sandbox and keeps future stages locked', () => {
  const ledger = fakeRevisionLedger({
    unitState: {
      experienceRevision: 'lesson1-2-v2.6', unitAttemptId: 'sandbox-attempt',
      completedMicrotaskIds: ['L01-M07', 'L01-M08'],
      storyFacts: ['lesson1-dialogue-first-listen-complete', 'handbag-owner-identified'],
      adventureHeartsRemaining: 2, buildStage: 0
    }
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 10 });
  let current = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'sandbox-attempt' });
  assert.equal(current.snapshot.microtaskId, 'L01-M09');
  assert.deepEqual(current.snapshot.reachedMicrotaskIds, ['L01-M07', 'L01-M08', 'L01-M09']);

  current = endAvailablePresentation(runtime, current);
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-D04' }
  });
  assert.equal(current.snapshot.adventureHearts, 1);
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-D01' }
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  const origin = structuredClone(current.snapshot);

  const locked = runtime.dispatch({
    type: 'navigation/open-stage', microtaskId: 'L01-M10',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(locked.effects[0].reason, 'stage-not-reached');

  current = runtime.dispatch({
    type: 'navigation/open-stage', microtaskId: 'L01-M08',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(current.snapshot.mode, 'microtask-v2-sandbox');
  assert.equal(current.snapshot.microtaskId, 'L01-M08');
  assert.equal(current.snapshot.adventureHearts, 3);

  current = endAvailablePresentation(runtime, current);
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { entityId: 'handbag-owner' }
  });
  assert.equal(current.snapshot.phase, 'audio-playing');
  current = runtime.dispatch({
    type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
    attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
    segmentId: current.snapshot.audio.segmentId
  });
  current = endAvailablePresentation(runtime, current);
  current = runtime.dispatch({
    type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(current.snapshot.status, 'sandbox-complete');
  assert.equal(ledger.events.length, 0);

  current = runtime.dispatch({
    type: 'navigation/open-stage', microtaskId: 'L01-M07',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(current.snapshot.mode, 'microtask-v2-sandbox');
  assert.equal(current.snapshot.status, 'active');
  assert.equal(current.snapshot.microtaskId, 'L01-M07');
  assert.equal(current.snapshot.adventureHeartsRemaining, 3);
  assert.equal(ledger.events.length, 0);

  current = runtime.dispatch({
    type: 'navigation/exit-sandbox', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(current.snapshot.mode, 'microtask-v2');
  assert.equal(current.snapshot.status, 'active');
  assert.equal(current.snapshot.microtaskId, 'L01-M09');
  assert.equal(current.snapshot.stepId, origin.stepId);
  assert.equal(current.snapshot.challengeRef, origin.challengeRef);
  assert.equal(current.snapshot.adventureHearts, origin.adventureHearts);
  assert.deepEqual(current.snapshot.optionIds, origin.optionIds);
  assert.deepEqual(current.snapshot.temporaryResults, origin.temporaryResults);
  assert.equal(current.snapshot.phase, 'audio-playing');
  assert.equal(current.snapshot.audio.segmentId, origin.audio.segmentId);
  assert.notEqual(current.snapshot.audio.requestId, origin.audio.requestId);
  assert.equal(current.effects.at(-1).type, 'audio/play');
  assert.equal(current.effects.at(-1).segmentId, origin.audio.segmentId);
  assert.deepEqual(current.snapshot.reachedMicrotaskIds, ['L01-M07', 'L01-M08', 'L01-M09']);
  assert.equal(current.snapshot.stageNavigation.find(item => item.microtaskId === 'L01-M10').status, 'locked');
});

test('Lesson 1–2 V2 destroy cancels the active audio request before closing the runtime', () => {
  const runtime = create({ unit: nceUnit, ledger: fakeRevisionLedger(), seed: 12 });
  let entered = runtime.enter({ entryLesson: 'lesson1', unitAttemptId: 'destroy-audio' });
  entered = endAvailablePresentation(runtime, entered);

  const destroyed = runtime.destroy();

  assert.equal(destroyed.snapshot.status, 'destroyed');
  assert.equal(destroyed.snapshot.audio, null);
  assert.deepEqual(destroyed.effects, [{
    type: 'audio/cancel',
    experienceRevision: 'lesson1-2-v2.6',
    microtaskId: 'L01-M07',
    attemptRevision: 0,
    requestId: entered.snapshot.audio.requestId
  }]);
});

test('the final route grows the landmark only after full readback, idempotent unit-built, and buildStage 5 readback', () => {
  const taskIds = nceUnit.beats.flatMap(beat => beat.microtasks || [])
    .map(task => task.microtaskId);
  const events = [];
  let readyForBuild = false;
  let buildStage = 0;
  const ledger = {
    events,
    read() {
      return {
        units: {
          'NCE-U01': {
            experienceRevision: 'lesson1-2-v2.6', unitAttemptId: 'final-attempt',
            completedMicrotaskIds: taskIds.slice(0, -1), storyFacts: [],
            adventureHearts: 3, buildStage,
            completionReadback: { readyForBuild }
          }
        }
      };
    },
    apply(event) {
      events.push(structuredClone(event));
      if (event.type === 'unit-built') {
        if (!readyForBuild) {
          return { persisted: false, reason: 'unit-readback-incomplete' };
        }
        buildStage = 5;
      }
      return { persisted: true, status: 'applied' };
    },
    makeReady() { readyForBuild = true; }
  };
  const runtime = create({ unit: nceUnit, ledger, seed: 11 });
  let current = runtime.enter({ entryLesson: 'lesson2', unitAttemptId: 'final-attempt' });
  assert.equal(current.snapshot.microtaskId, 'L02-M21');

  for (const response of [
    { sourceRef: 'L02-W09', entityId: 'car' },
    { sourceRef: 'L02-W10', entityId: 'house' }
  ]) {
    current = endAvailablePresentation(runtime, current);
    current = runtime.dispatch({
      type: 'response/submit', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, challengeRef: current.snapshot.challengeRef,
      response
    });
    current = runtime.dispatch({
      type: 'audio/ended', experienceRevision: current.snapshot.experienceRevision,
      stateVersion: current.snapshot.stateVersion, microtaskId: current.snapshot.microtaskId,
      attemptRevision: current.snapshot.attemptRevision, requestId: current.snapshot.audio.requestId,
      segmentId: current.snapshot.audio.segmentId
    });
    current = endAvailablePresentation(runtime, current);
  }
  assert.equal(current.snapshot.phase, 'unit-verifying');
  assert.equal(current.snapshot.buildStage, 0);
  assert.deepEqual(ledger.events.map(event => event.type), ['microtask-completed']);
  assert.equal(ledger.events[0].microtaskId, 'L02-M21');
  assert.equal(ledger.events[0].targetResults.length, 2);
  assert.ok(ledger.events[0].storyFacts.includes('owner-home-arrival'));
  assert.ok(!current.effects.some(effect => effect.type === 'landmark/build-stage'));

  ledger.makeReady();
  current = runtime.dispatch({
    type: 'unit/verify-retry', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.deepEqual(ledger.events.map(event => event.type), ['microtask-completed', 'unit-built']);
  assert.equal(current.snapshot.status, 'unit-built');
  assert.equal(current.snapshot.buildStage, 5);
  assert.deepEqual(current.effects.map(effect => effect.type), [
    'runtime/unit-readback-complete', 'runtime/unit-built-committed',
    'landmark/build-stage', 'runtime/unit-built'
  ]);

  const duplicate = runtime.dispatch({
    type: 'unit/verify-retry', experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(duplicate.effects[0].reason, 'runtime-not-active');
  assert.equal(ledger.events.filter(event => event.type === 'unit-built').length, 1);
});

test('microtask v2 answer rules judge stable semantic identities rather than presentation order', () => {
  assert.deepEqual(
    evaluateRule(
      { type: 'select-one', acceptedSourceRef: 'L01-D01' },
      { sourceRef: 'L01-D01', presentationIndex: 99 }
    ),
    { correct: true, mismatchPath: null }
  );
  assert.equal(evaluateRule(
    { type: 'match-entity', pairs: { 'L02-W01': 'pen' } },
    { sourceRef: 'L02-W01', entityId: 'pencil' }
  ).correct, false);
  assert.equal(evaluateRule(
    { type: 'place-in-slot', slotId: 'ownership-item', entityId: 'watch' },
    { slotId: 'ownership-item', entityId: 'watch' }
  ).correct, true);
  assert.equal(evaluateRule(
    {
      type: 'ordered-blocks',
      acceptedByEntityId: { car: ['block-question', 'L02-W09'] }
    },
    { selectedEntityId: 'car', blockRefs: ['block-question', 'L02-W09'] }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'ordered-blocks', acceptedOrder: ['is', 'this', 'your', 'watch'] },
    { blockRefs: ['is', 'this', 'your', 'watch'], presentationOrder: [3, 1, 0, 2] }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'ordered-sequence', acceptedOrder: ['attention', 'ownership', 'repair', 'thanks'] },
    { sequenceIds: ['attention', 'ownership', 'repair', 'thanks'] }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'connect-reference', sourceRef: 'L01-W09', entityId: 'handbag' },
    { sourceRef: 'L01-W09', entityId: 'handbag' }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'detect-error', acceptedSourceRef: 'L01-D06' },
    { sourceRef: 'L01-D06' }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'perform-action', action: 'give', entityId: 'watch', targetEntityId: 'visitor' },
    { action: 'give', entityId: 'watch', targetEntityId: 'visitor' }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'all-of', requiredFactIds: ['one', 'two', 'three'] },
    { factIds: ['three', 'one', 'two'] }
  ).correct, true);
  assert.equal(evaluateRule(
    {
      type: 'all-of',
      rules: [{ type: 'perform-action', action: 'stamp', entityId: 'case-stamp', targetEntityId: 'case-file' }]
    },
    { action: 'stamp', entityId: 'case-stamp', targetEntityId: 'case-file' }
  ).correct, true);
});

 test('Lesson 49 with no progress enters the first beat', () => {
  const runtime = create({ unit, ledger: fakeLedger(), seed: 7 });

  const result = runtime.enter({ entryLesson: 'lesson49' });

  assert.equal(result.snapshot.status, 'active');
  assert.equal(result.snapshot.mode, 'standard');
  assert.equal(result.snapshot.beatId, 'discover');
  assert.equal(result.snapshot.microstepId, 'discover-check');
  assert.deepEqual(result.effects, [{
    type: 'scene/show',
    beatId: 'discover',
    microstepId: 'discover-check',
    contextId: 'breakfast-stall'
  }]);
});

test('Lesson 49 exposes the first authored microtask and stable response phase', () => {
  const runtime = create({ unit, ledger: fakeLedger(), seed: 7 });

  const result = runtime.enter({ entryLesson: 'lesson49' });

  assert.equal(result.snapshot.microtaskId, 'L49-M01');
  assert.equal(result.snapshot.phase, 'response');
  assert.equal(result.snapshot.baseContextId, 'breakfast-stall');
  assert.equal(result.snapshot.activeContextId, 'breakfast-stall');
  assert.equal(result.snapshot.contextId, 'breakfast-stall');
});

test('Lesson 49 resumes at the microtask after its last durable checkpoint', () => {
  const checkpoint = {
    checkpointId: 'L49-M05:complete',
    beatId: 'understand',
    microtaskId: 'L49-M05',
    completionStatus: 'completed-supported',
    learningDay: '2026-08-10'
  };
  const runtime = create({
    unit,
    ledger: fakeLedger({ checkpoint, buildStage: 1 }),
    seed: 7
  });

  const result = runtime.enter({ entryLesson: 'lesson49' });

  assert.equal(result.snapshot.status, 'active');
  assert.equal(result.snapshot.beatId, 'understand');
  assert.equal(result.snapshot.microtaskId, 'L49-M06');
  assert.equal(result.snapshot.phase, 'stimulus');
  assert.equal(result.snapshot.buildStage, 1);
});

test('a declarative composite response completes only the current Lesson 49 microtask', () => {
  const ledger = fakeLedger();
  const runtime = create({ unit, ledger, seed: 7 });
  runtime.enter({ entryLesson: 'lesson49' });

  const result = runtime.dispatch({
    type: 'response/submit',
    response: {
      missingInformation: ['quantity', 'wanted', 'unwanted'],
      firstClue: 'preference'
    },
    correct: false,
    targetId: 'FLC-U01-T99'
  });

  assert.equal(result.snapshot.status, 'active');
  assert.equal(result.snapshot.microtaskId, 'L49-M02');
  assert.equal(result.snapshot.beatId, 'understand');
  assert.equal(result.snapshot.phase, 'stimulus');
  assert.equal(result.snapshot.buildStage, 1);
  assert.deepEqual(ledger.events.map(event => ({
    type: event.type,
    microtaskId: event.microtaskId,
    checkpointId: event.checkpointId,
    buildStage: event.buildStage,
    completionStatus: event.completionStatus,
    targetId: event.targetId
  })), [{
    type: 'checkpoint-completed',
    microtaskId: 'L49-M01',
    checkpointId: 'L49-M01:complete',
    buildStage: 1,
    completionStatus: 'completed-independent',
    targetId: undefined
  }]);
  assert.ok(result.effects.some(effect => (
    effect.type === 'landmark/build-stage' && effect.buildStage === 1
  )));
  assert.ok(!result.effects.some(effect => effect.type === 'navigation/handoff'));
});

test('an authored audio sequence opens its response only after the final real ended action', () => {
  const checkpoint = {
    checkpointId: 'L49-M01:complete',
    beatId: 'discover',
    microtaskId: 'L49-M01',
    completionStatus: 'completed-independent',
    learningDay: '2026-08-10'
  };
  const ledger = fakeLedger({ checkpoint, buildStage: 1 });
  const runtime = create({ unit, ledger, seed: 11 });
  runtime.enter({ entryLesson: 'lesson49' });

  const premature = runtime.dispatch({
    type: 'response/submit',
    response: {
      worker: 'butcher', category: 'meat', beefTray: 'beef', lambTray: 'lamb',
      steakTray: 'steak', minceTray: 'mince', chickenTray: 'chicken'
    }
  });
  assert.equal(premature.snapshot.phase, 'stimulus');
  assert.deepEqual(ledger.events, []);

  let result = runtime.dispatch({ type: 'audio/play' });
  const requestId = result.snapshot.audio.requestId;
  assert.equal(result.snapshot.audio.activeAudioSequenceId, 'L49-A-WAKE-SHELF');
  assert.equal(result.effects.find(effect => effect.type === 'audio/play').line.sourceRef, 'L49-W01');

  for (let segmentIndex = 0; segmentIndex < 7; segmentIndex += 1) {
    result = runtime.dispatch({ type: 'audio/ended', requestId, segmentIndex });
    if (segmentIndex < 6) {
      assert.equal(result.snapshot.phase, 'stimulus');
      assert.equal(result.effects.find(effect => effect.type === 'audio/play').segmentIndex, segmentIndex + 1);
    }
  }

  assert.equal(result.snapshot.phase, 'response');
  assert.equal(result.snapshot.microtaskId, 'L49-M02');
  assert.equal(result.snapshot.audio.status, 'completed');
  assert.deepEqual(ledger.events, []);
});

test('restarting an authored audio sequence cancels the old request and ignores its stale callbacks', () => {
  const checkpoint = {
    checkpointId: 'L49-M01:complete',
    beatId: 'discover',
    microtaskId: 'L49-M01',
    completionStatus: 'completed-independent',
    learningDay: '2026-08-10'
  };
  const runtime = create({
    unit,
    ledger: fakeLedger({ checkpoint, buildStage: 1 }),
    seed: 12
  });
  runtime.enter({ entryLesson: 'lesson49' });

  const first = runtime.dispatch({ type: 'audio/play' });
  const firstRequestId = first.snapshot.audio.requestId;
  const restarted = runtime.dispatch({ type: 'audio/play' });
  const activeRequestId = restarted.snapshot.audio.requestId;

  assert.notEqual(activeRequestId, firstRequestId);
  assert.equal(restarted.effects[0].type, 'audio/cancel');
  assert.equal(restarted.effects[0].requestId, firstRequestId);
  const staleEnded = runtime.dispatch({
    type: 'audio/ended',
    requestId: firstRequestId,
    segmentIndex: 0
  });
  const staleFailed = runtime.dispatch({
    type: 'audio/failed',
    requestId: firstRequestId,
    reason: 'late-error'
  });
  const wrongSegment = runtime.dispatch({
    type: 'audio/ended',
    requestId: activeRequestId,
    segmentIndex: 1
  });

  assert.deepEqual(staleEnded.effects, []);
  assert.deepEqual(staleFailed.effects, []);
  assert.deepEqual(wrongSegment.effects, []);
  assert.equal(runtime.snapshot().phase, 'stimulus');
  assert.equal(runtime.snapshot().audio.requestId, activeRequestId);
  assert.equal(runtime.snapshot().audio.segmentIndex, 0);
});

test('the first declarative response error adds non-revealing field support without persistence', () => {
  const ledger = fakeLedger();
  const runtime = create({ unit, ledger, seed: 13 });
  runtime.enter({ entryLesson: 'lesson49' });

  const result = runtime.dispatch({
    type: 'response/submit',
    response: {
      missingInformation: ['wanted', 'quantity'],
      firstClue: 'preference'
    }
  });

  assert.equal(result.snapshot.microtaskId, 'L49-M01');
  assert.equal(result.snapshot.supportLevel, 1);
  assert.equal(result.snapshot.activeContextId, 'breakfast-stall');
  assert.deepEqual(result.effects, [{
    type: 'feedback/support',
    microtaskId: 'L49-M01',
    level: 1,
    supportKind: 'reobserve',
    mismatchPath: ['missingInformation'],
    revealsAnswer: false
  }]);
  assert.doesNotMatch(JSON.stringify(result.effects), /unwanted/);
  assert.deepEqual(ledger.events, []);
});

test('the third declarative error moves only the active task into its authored near transfer', () => {
  const runtime = create({ unit, ledger: fakeLedger(), seed: 17 });
  runtime.enter({ entryLesson: 'lesson49' });
  const wrong = {
    type: 'response/submit',
    response: {
      missingInformation: ['wanted'],
      firstClue: 'preference'
    }
  };

  runtime.dispatch(wrong);
  runtime.dispatch(wrong);
  const result = runtime.dispatch(wrong);

  assert.equal(result.snapshot.microtaskId, 'L49-M01');
  assert.equal(result.snapshot.supportLevel, 3);
  assert.equal(result.snapshot.baseContextId, 'breakfast-stall');
  assert.equal(result.snapshot.activeContextId, 'picnic-supply');
  assert.equal(result.snapshot.contextId, 'picnic-supply');
  assert.deepEqual(result.effects, [
    {
      type: 'feedback/support',
      microtaskId: 'L49-M01',
      level: 3,
      supportKind: 'model',
      mismatchPath: ['missingInformation'],
      revealsAnswer: false
    },
    {
      type: 'scene/near-transfer',
      microtaskId: 'L49-M01',
      fromContextId: 'breakfast-stall',
      contextId: 'picnic-supply'
    }
  ]);
  assert.doesNotMatch(JSON.stringify(result.effects), /unwanted/);
});

test('a bounded failed near transfer requires a child-completed assisted correction', () => {
  const checkpoint = {
    checkpointId: 'L49-M05:complete',
    beatId: 'understand',
    microtaskId: 'L49-M05',
    completionStatus: 'completed-supported',
    learningDay: '2026-08-10'
  };
  const ledger = fakeLedger({ checkpoint, buildStage: 1 });
  const runtime = create({ unit, ledger, seed: 19 });
  runtime.enter({ entryLesson: 'lesson49' });
  let result = runtime.dispatch({ type: 'audio/play' });
  const requestId = result.snapshot.audio.requestId;
  result = runtime.dispatch({ type: 'audio/ended', requestId, segmentIndex: 0 });
  result = runtime.dispatch({ type: 'audio/ended', requestId, segmentIndex: 1 });
  assert.equal(result.snapshot.phase, 'response');

  const wrong = {
    type: 'response/submit',
    response: {
      suggestedItem: 'beef',
      referencedPiece: 'plain-piece',
      quantityItem: 'two-pounds-mince'
    }
  };
  runtime.dispatch(wrong);
  runtime.dispatch(wrong);
  runtime.dispatch(wrong);
  const assisted = runtime.dispatch(wrong);

  assert.equal(assisted.snapshot.microtaskId, 'L49-M06');
  assert.equal(assisted.snapshot.activeContextId, 'picnic-supply');
  assert.equal(assisted.snapshot.assistanceMode, true);
  assert.equal(assisted.snapshot.phase, 'response');
  assert.deepEqual(ledger.events.map(event => ({
    type: event.type,
    outcome: event.outcome,
    targetId: event.targetId,
    contextId: event.contextId
  })), [{
    type: 'formative-attempt',
    outcome: 'failed',
    targetId: 'FLC-U01-T01',
    contextId: 'picnic-supply'
  }]);
  assert.ok(assisted.effects.some(effect => effect.type === 'feedback/assisted'));
  assert.ok(!assisted.effects.some(effect => effect.type === 'landmark/build-stage'));

  const completed = runtime.dispatch({
    type: 'response/submit',
    response: {
      suggestedItem: 'sandwich',
      referencedPiece: 'round-sandwich',
      quantityItem: 'two-bottles-water'
    }
  });

  assert.equal(completed.snapshot.microtaskId, 'L49-M07');
  assert.equal(completed.snapshot.activeContextId, 'breakfast-stall');
  assert.equal(completed.snapshot.assistanceMode, false);
  assert.equal(completed.snapshot.buildStage, 1);
  assert.deepEqual(ledger.events.map(event => ({
    type: event.type,
    microtaskId: event.microtaskId,
    completionStatus: event.completionStatus,
    outcome: event.outcome
  })), [
    {
      type: 'formative-attempt',
      microtaskId: undefined,
      completionStatus: undefined,
      outcome: 'failed'
    },
    {
      type: 'checkpoint-completed',
      microtaskId: 'L49-M06',
      completionStatus: 'completed-assisted',
      outcome: undefined
    }
  ]);
});

test('Lesson 49 completes nine durable microtasks but grows only after each whole beat', () => {
  const ledger = fakeLedger();
  const runtime = create({ unit, ledger, seed: 23 });
  runtime.enter({ entryLesson: 'lesson49' });
  const responses = {
    'L49-M01': {
      missingInformation: ['wanted', 'unwanted', 'quantity'],
      firstClue: 'preference'
    },
    'L49-M02': {
      worker: 'butcher', category: 'meat', beefTray: 'beef', lambTray: 'lamb',
      steakTray: 'steak', minceTray: 'mince', chickenTray: 'chicken'
    },
    'L49-M03': 'steak',
    'L49-M04': {
      acceptsMeat: 'yes-please',
      selectedItem: 'beef',
      pitchPath: ['beef-rise', 'lamb-fall']
    },
    'L49-M05': {
      'mrs-bird': 'likes-lamb',
      'mr-bird': 'does-not-like-lamb'
    },
    'L49-M06': {
      suggestedItem: 'steak',
      referencedPiece: 'striped-piece',
      quantityItem: 'one-pound-mince'
    },
    'L49-M07': {
      orderAction: 'remove-chicken',
      birdPreference: { likes: 'steak', dislikes: 'chicken' },
      butcherPreference: 'does-not-like-chicken-either',
      truthPhrase: 'speaking-honestly',
      negativeAlso: 'either'
    },
    'L49-M08': {
      finalOrder: ['beef', 'steak', 'mince'],
      evidence: {
        replaceLamb: 'beef-please',
        removeChicken: 'no-thank-you',
        addMince: 'pound-of-mince'
      },
      transaction: [
        'ask-meat', 'choose-beef-or-lamb', 'compare-lamb-preference',
        'choose-steak', 'add-mince', 'refuse-chicken'
      ]
    },
    'L49-M09': {
      textbookAnswer: 'steak',
      preferenceSentence: ['he', 'likes', 'steak', 'but', 'he', 'does-not', 'like', 'chicken'],
      purchasedItems: ['beef', 'steak', 'mince']
    }
  };
  const growthStages = [];

  for (let index = 1; index <= 9; index += 1) {
    const microtaskId = `L49-M${String(index).padStart(2, '0')}`;
    assert.equal(runtime.snapshot().microtaskId, microtaskId);
    if (runtime.snapshot().phase === 'stimulus') {
      let audio = runtime.dispatch({ type: 'audio/play' });
      const requestId = audio.snapshot.audio.requestId;
      const task = unit.beats.flatMap(beat => beat.microtasks || [])
        .find(candidate => candidate.microtaskId === microtaskId);
      const lineCount = unit.lessonContent.lesson49.audioSequences[task.audioSequenceId].lines.length;
      for (let segmentIndex = 0; segmentIndex < lineCount; segmentIndex += 1) {
        audio = runtime.dispatch({ type: 'audio/ended', requestId, segmentIndex });
      }
      assert.equal(audio.snapshot.phase, 'response');
    }
    const result = runtime.dispatch({ type: 'response/submit', response: responses[microtaskId] });
    growthStages.push(...result.effects
      .filter(effect => effect.type === 'landmark/build-stage')
      .map(effect => effect.buildStage));
  }

  assert.equal(runtime.snapshot().status, 'handoff');
  assert.equal(runtime.snapshot().buildStage, 2);
  assert.deepEqual(growthStages, [1, 2]);
  const checkpoints = ledger.events.filter(event => event.type === 'checkpoint-completed');
  assert.deepEqual(
    checkpoints.map(event => event.microtaskId),
    Array.from({ length: 9 }, (_, index) => `L49-M${String(index + 1).padStart(2, '0')}`)
  );
  assert.deepEqual(checkpoints.map(event => event.buildStage), [1, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 2]);
  const formative = ledger.events.filter(event => event.type === 'formative-attempt');
  assert.deepEqual(formative.map(event => ({
    targetId: event.targetId,
    outcome: event.outcome,
    evidenceMode: event.evidenceMode
  })), [{
    targetId: 'FLC-U01-T01',
    outcome: 'independent',
    evidenceMode: 'audio-image-quantity-match'
  }]);
  assert.doesNotMatch(JSON.stringify(ledger.events), /challenge-star|mastered/);
});

test('a failed M09 checkpoint cannot grow state two or emit the Lesson 50 handoff', () => {
  const checkpoint = {
    checkpointId: 'L49-M08:complete',
    beatId: 'understand',
    microtaskId: 'L49-M08',
    completionStatus: 'completed-independent',
    learningDay: '2026-08-10'
  };
  const runtime = create({
    unit,
    ledger: fakeLedger({ checkpoint, buildStage: 1, failOnType: 'checkpoint-completed' }),
    seed: 24
  });
  const entered = runtime.enter({ entryLesson: 'lesson49' });
  assert.equal(entered.snapshot.microtaskId, 'L49-M09');

  const failed = runtime.dispatch({
    type: 'response/submit',
    response: {
      textbookAnswer: 'steak',
      preferenceSentence: ['he', 'likes', 'steak', 'but', 'he', 'does-not', 'like', 'chicken'],
      purchasedItems: ['beef', 'steak', 'mince']
    }
  });

  assert.equal(failed.snapshot.status, 'active');
  assert.equal(failed.snapshot.microtaskId, 'L49-M09');
  assert.equal(failed.snapshot.buildStage, 1);
  assert.deepEqual(failed.effects, [{
    type: 'runtime/persistence-failed',
    operation: 'checkpoint-completed',
    reason: 'unavailable',
    retryable: true
  }]);
  assert.ok(!failed.effects.some(effect => effect.type === 'landmark/build-stage'));
  assert.ok(!failed.effects.some(effect => effect.type === 'navigation/handoff'));
});

test('Lesson 50 resumes at beat three after the first two checkpoints', () => {
  const ledger = fakeLedger({ checkpoint: 'understand:complete', buildStage: 2 });
  const runtime = create({ unit, ledger, seed: 7 });

  const result = runtime.enter({ entryLesson: 'lesson50' });

  assert.equal(result.snapshot.mode, 'standard');
  assert.equal(result.snapshot.beatId, 'teach');
  assert.equal(result.snapshot.microstepId, 'teach-check');
  assert.equal(result.snapshot.buildStage, 2);
});

test('Lesson 49 with its two beats complete stops at the Lesson 50 handoff camp', () => {
  const ledger = fakeLedger({ checkpoint: 'understand:complete', buildStage: 2 });
  const runtime = create({ unit, ledger, seed: 7 });

  const result = runtime.enter({ entryLesson: 'lesson49' });

  assert.equal(result.snapshot.status, 'handoff');
  assert.equal(result.snapshot.beatId, null);
  assert.equal(result.snapshot.buildStage, 2);
  assert.deepEqual(result.effects, [{ type: 'navigation/handoff', entryLesson: 'lesson50' }]);
});

test('Lesson 50 bridge completes two checkpoints but records only semantically matched formative evidence', () => {
  const ledger = fakeLedger();
  const runtime = create({ unit, ledger, seed: 7 });

  const entered = runtime.enter({ entryLesson: 'lesson50' });
  assert.equal(entered.snapshot.mode, 'bridge');
  assert.equal(entered.snapshot.microstepId, 'bridge-discover-check');

  const first = runtime.dispatch(answerAction(runtime));
  assert.equal(first.snapshot.mode, 'bridge');
  assert.equal(first.snapshot.beatId, 'understand');
  assert.equal(first.snapshot.microstepId, 'bridge-understand-check');
  assert.equal(first.snapshot.buildStage, 1);

  const second = runtime.dispatch(answerAction(runtime));
  assert.equal(second.snapshot.mode, 'standard');
  assert.equal(second.snapshot.beatId, 'teach');
  assert.equal(second.snapshot.microstepId, 'teach-check');
  assert.equal(second.snapshot.buildStage, 2);

  assert.deepEqual(ledger.events.map(event => ({
    type: event.type,
    beatId: event.beatId,
    outcome: event.outcome,
    checkpointId: event.checkpointId,
    buildStage: event.buildStage
  })), [
    {
      type: 'checkpoint-completed', beatId: 'discover', outcome: undefined,
      checkpointId: 'discover:complete', buildStage: 1
    },
    {
      type: 'formative-attempt', beatId: 'understand', outcome: 'practice-only',
      checkpointId: undefined, buildStage: undefined
    },
    {
      type: 'checkpoint-completed', beatId: 'understand', outcome: undefined,
      checkpointId: 'understand:complete', buildStage: 2
    }
  ]);

  const serialized = JSON.stringify(ledger.events);
  assert.doesNotMatch(serialized, /independent-evidence|challenge-star|mastered/);
});

test('an audio microstep advances only after the matching completed action', () => {
  const runtime = create({
    unit,
    ledger: fakeLedger({ checkpoint: 'discover:complete', buildStage: 1 }),
    seed: 11
  });
  const entered = runtime.enter({ entryLesson: 'lesson49' });
  assert.equal(entered.snapshot.microstepId, 'understand-audio');

  const playing = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  const playEffect = playing.effects.at(-1);
  assert.deepEqual(playEffect, {
    type: 'audio/play',
    requestId: 'audio:FLC-U01:11:1',
    audioId: 'bird-line-1'
  });
  assert.equal(playing.snapshot.microstepId, 'understand-audio');
  assert.equal(playing.snapshot.audio.status, 'playing');

  const pending = runtime.dispatch({ type: 'time/elapsed', milliseconds: 99_000 });
  assert.equal(pending.snapshot.microstepId, 'understand-audio');

  const completed = runtime.dispatch({
    type: 'audio/completed',
    requestId: playEffect.requestId
  });
  assert.equal(completed.snapshot.microstepId, 'understand-check');
  assert.equal(completed.snapshot.audio.status, 'completed');
});

test('replaying audio cancels the old request and stale completion is ignored', () => {
  const runtime = create({
    unit,
    ledger: fakeLedger({ checkpoint: 'discover:complete', buildStage: 1 }),
    seed: 13
  });
  runtime.enter({ entryLesson: 'lesson49' });

  const first = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  const firstRequestId = first.snapshot.audio.requestId;
  const replay = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  const secondRequestId = replay.snapshot.audio.requestId;

  assert.notEqual(secondRequestId, firstRequestId);
  assert.deepEqual(replay.effects, [
    { type: 'audio/cancel', requestId: firstRequestId },
    { type: 'audio/play', requestId: secondRequestId, audioId: 'bird-line-1' }
  ]);

  const stale = runtime.dispatch({ type: 'audio/completed', requestId: firstRequestId });
  assert.equal(stale.snapshot.microstepId, 'understand-audio');
  assert.equal(stale.snapshot.audio.requestId, secondRequestId);
});

test('only a matching audio failure opens the text and image fallback without blocking the check', () => {
  const runtime = create({
    unit,
    ledger: fakeLedger({ checkpoint: 'discover:complete', buildStage: 1 }),
    seed: 14
  });
  runtime.enter({ entryLesson: 'lesson49' });
  const first = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  const replay = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });

  const stale = runtime.dispatch({
    type: 'audio/failed',
    requestId: first.snapshot.audio.requestId,
    reason: 'stale-network-error'
  });
  assert.deepEqual(stale.effects, []);
  assert.equal(stale.snapshot.microstepId, 'understand-audio');
  assert.equal(stale.snapshot.audio.status, 'playing');

  const failed = runtime.dispatch({
    type: 'audio/failed',
    requestId: replay.snapshot.audio.requestId,
    reason: 'network-error'
  });
  assert.equal(failed.snapshot.microstepId, 'understand-check');
  assert.equal(failed.snapshot.audio.status, 'failed');
  assert.deepEqual(failed.effects, [
    {
      type: 'audio/fallback',
      requestId: replay.snapshot.audio.requestId,
      audioId: 'bird-line-1',
      reason: 'network-error',
      fallback: 'text-image'
    },
    {
      type: 'scene/show',
      beatId: 'understand',
      microstepId: 'understand-check',
      contextId: 'breakfast-stall'
    }
  ]);
});

test('the first wrong answer adds one non-revealing support step and no checkpoint', () => {
  const ledger = fakeLedger({ checkpoint: 'understand:complete', buildStage: 2 });
  const runtime = create({ unit, ledger, seed: 17 });
  runtime.enter({ entryLesson: 'lesson50' });

  const result = runtime.dispatch(answerAction(runtime, { correct: false }));

  assert.equal(result.snapshot.beatId, 'teach');
  assert.equal(result.snapshot.microstepId, 'teach-check');
  assert.equal(result.snapshot.supportLevel, 1);
  assert.deepEqual(result.effects, [{
    type: 'feedback/support',
    level: 1,
    supportKind: 'reobserve',
    revealsAnswer: false
  }]);
  assert.deepEqual(ledger.events, []);
});

test('answer submission trusts only the authored answerId and records authored evidence bindings', () => {
  const ledger = fakeLedger({ checkpoint: 'discover:complete', buildStage: 1 });
  const runtime = create({ unit, ledger, seed: 18 });
  runtime.enter({ entryLesson: 'lesson49' });
  const playing = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  runtime.dispatch({ type: 'audio/completed', requestId: playing.snapshot.audio.requestId });

  const forged = runtime.dispatch({
    type: 'answer/submit',
    answerId: 'steak',
    correct: true,
    targetId: 'FLC-U01-T99',
    contextId: 'moon-market',
    evidenceMode: 'page-asserted'
  });

  assert.equal(forged.snapshot.supportLevel, 1);
  assert.equal(forged.snapshot.contextId, 'breakfast-stall');
  assert.deepEqual(ledger.events, []);

  runtime.dispatch({
    type: 'answer/submit',
    answerId: 'beef',
    correct: false,
    targetId: 'FLC-U01-T99',
    contextId: 'moon-market',
    evidenceMode: 'page-asserted'
  });

  assert.equal(ledger.events[0].type, 'formative-attempt');
  assert.equal(ledger.events[0].targetId, 'FLC-U01-T01');
  assert.equal(ledger.events[0].contextId, 'breakfast-stall');
  assert.equal(ledger.events[0].evidenceMode, 'audio-image-quantity-match');
});

test('a model is followed by a different-context near transfer and success is supported', () => {
  const ledger = fakeLedger({ checkpoint: 'understand:complete', buildStage: 2 });
  const runtime = create({ unit, ledger, seed: 19 });
  runtime.enter({ entryLesson: 'lesson50' });
  runtime.dispatch(answerAction(runtime, { correct: false }));
  runtime.dispatch(answerAction(runtime, { correct: false }));
  const model = runtime.dispatch(answerAction(runtime, { correct: false }));

  assert.equal(model.snapshot.supportLevel, 3);
  assert.equal(model.snapshot.contextId, 'picnic-supply');
  assert.equal(model.snapshot.microstepId, 'teach-near-transfer');
  assert.deepEqual(model.effects, [
    { type: 'feedback/support', level: 3, supportKind: 'model', revealsAnswer: true },
    {
      type: 'scene/near-transfer',
      fromContextId: 'breakfast-stall',
      contextId: 'picnic-supply',
      microstepId: 'teach-near-transfer'
    }
  ]);

  const corrected = runtime.dispatch(answerAction(runtime));

  assert.equal(corrected.snapshot.beatId, 'transfer');
  assert.equal(corrected.snapshot.microstepId, 'transfer-check');
  assert.equal(corrected.snapshot.buildStage, 3);
  assert.equal(corrected.snapshot.supportLevel, 0);
  assert.deepEqual(ledger.events.map(event => event.type), ['checkpoint-completed']);
  assert.equal(ledger.events[0].checkpointId, 'teach:complete');
  assert.equal(ledger.events[0].buildStage, 3);
  assert.equal(ledger.events[0].targetId, undefined);
  assert.doesNotMatch(JSON.stringify(ledger.events), /independent-evidence|challenge-star|mastered/);
});

test('a fourth wrong answer after near transfer persists failed and ends the bounded attempt', () => {
  const ledger = fakeLedger({ checkpoint: 'discover:complete', buildStage: 1 });
  const runtime = create({ unit, ledger, seed: 20 });
  runtime.enter({ entryLesson: 'lesson49' });
  const playing = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  runtime.dispatch({ type: 'audio/completed', requestId: playing.snapshot.audio.requestId });
  runtime.dispatch(answerAction(runtime, { correct: false }));
  runtime.dispatch(answerAction(runtime, { correct: false }));
  runtime.dispatch(answerAction(runtime, { correct: false }));

  const ended = runtime.dispatch(answerAction(runtime, { correct: false }));

  assert.equal(ended.snapshot.status, 'needs-review');
  assert.equal(ended.snapshot.beatId, 'understand');
  assert.equal(ended.snapshot.microstepId, 'understand-attempt-ended');
  assert.equal(ended.snapshot.buildStage, 1);
  assert.deepEqual(ledger.events.map(event => event.type), ['formative-attempt']);
  assert.deepEqual({
    outcome: ledger.events[0].outcome,
    targetId: ledger.events[0].targetId,
    contextId: ledger.events[0].contextId,
    evidenceMode: ledger.events[0].evidenceMode
  }, {
    outcome: 'failed',
    targetId: 'FLC-U01-T01',
    contextId: 'picnic-supply',
    evidenceMode: 'audio-image-quantity-match'
  });
  assert.deepEqual(ended.effects, [
    { type: 'feedback/failed', supportLevel: 3, retryable: true },
    {
      type: 'runtime/attempt-ended',
      unitId: 'FLC-U01',
      beatId: 'understand',
      outcome: 'failed',
      retryable: true
    }
  ]);
});

test('a checkpoint-only task also ends after near transfer without inventing target evidence', () => {
  const ledger = fakeLedger({ checkpoint: 'understand:complete', buildStage: 2 });
  const runtime = create({ unit, ledger, seed: 21 });
  runtime.enter({ entryLesson: 'lesson50' });
  runtime.dispatch(answerAction(runtime, { correct: false }));
  runtime.dispatch(answerAction(runtime, { correct: false }));
  runtime.dispatch(answerAction(runtime, { correct: false }));

  const ended = runtime.dispatch(answerAction(runtime, { correct: false }));

  assert.equal(ended.snapshot.status, 'needs-review');
  assert.equal(ended.snapshot.microstepId, 'teach-attempt-ended');
  assert.equal(ended.snapshot.buildStage, 2);
  assert.deepEqual(ledger.events, []);
  assert.ok(ended.effects.some(effect => effect.type === 'runtime/attempt-ended'));
  assert.ok(!ended.effects.some(effect => effect.type === 'landmark/build-stage'));
});

test('failed-attempt persistence failure keeps the near-transfer state stable for retry', () => {
  const ledger = fakeLedger({
    checkpoint: 'discover:complete',
    buildStage: 1,
    failOnType: 'formative-attempt'
  });
  const runtime = create({ unit, ledger, seed: 22 });
  runtime.enter({ entryLesson: 'lesson49' });
  const playing = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  runtime.dispatch({ type: 'audio/completed', requestId: playing.snapshot.audio.requestId });
  runtime.dispatch(answerAction(runtime, { correct: false }));
  runtime.dispatch(answerAction(runtime, { correct: false }));
  runtime.dispatch(answerAction(runtime, { correct: false }));
  const before = runtime.snapshot();

  const failed = runtime.dispatch(answerAction(runtime, { correct: false }));

  assert.equal(failed.snapshot.status, 'active');
  assert.equal(failed.snapshot.microstepId, before.microstepId);
  assert.equal(failed.snapshot.contextId, before.contextId);
  assert.equal(failed.snapshot.supportLevel, before.supportLevel);
  assert.deepEqual(failed.effects, [{
    type: 'runtime/persistence-failed',
    operation: 'formative-attempt',
    reason: 'unavailable',
    retryable: true
  }]);
  const firstEventId = ledger.events[0].eventId;
  runtime.dispatch(answerAction(runtime, { correct: false }));
  assert.equal(ledger.events[1].eventId, firstEventId);
});

test('completing the fifth beat submits only unit-built and never awards or masters', () => {
  const ledger = fakeLedger({ checkpoint: 'transfer:complete', buildStage: 4 });
  const runtime = create({ unit, ledger, seed: 23 });
  const entered = runtime.enter({ entryLesson: 'lesson50' });
  assert.equal(entered.snapshot.beatId, 'build');

  const completed = runtime.dispatch(answerAction(runtime));

  assert.equal(completed.snapshot.status, 'unit-built');
  assert.equal(completed.snapshot.buildStage, 5);
  assert.equal(completed.snapshot.beatId, null);
  assert.deepEqual(ledger.events.map(event => event.type), ['unit-built']);
  assert.deepEqual({
    beatId: ledger.events[0].beatId,
    buildStage: ledger.events[0].buildStage,
    source: ledger.events[0].source
  }, {
    beatId: 'build',
    buildStage: 5,
    source: 'new-learning'
  });
  assert.doesNotMatch(JSON.stringify(ledger.events), /challenge-star|mastered/);
  assert.deepEqual(completed.effects.slice(-2), [
    { type: 'landmark/build-stage', buildStage: 5 },
    { type: 'runtime/unit-built', unitId: 'FLC-U01' }
  ]);
});

test('destroy cancels active audio and late completion can no longer mutate runtime state', () => {
  const runtime = create({
    unit,
    ledger: fakeLedger({ checkpoint: 'discover:complete', buildStage: 1 }),
    seed: 29
  });
  runtime.enter({ entryLesson: 'lesson49' });
  const playing = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  const requestId = playing.snapshot.audio.requestId;

  const destroyed = runtime.destroy();
  assert.equal(destroyed.snapshot.status, 'destroyed');
  assert.deepEqual(destroyed.effects, [{ type: 'audio/cancel', requestId }]);

  const late = runtime.dispatch({ type: 'audio/completed', requestId });
  assert.equal(late.snapshot.status, 'destroyed');
  assert.equal(late.snapshot.beatId, 'understand');
  assert.equal(late.snapshot.microstepId, 'understand-audio');
  assert.equal(late.snapshot.audio, null);
  assert.deepEqual(late.effects, []);
});

test('transient interactions and wrong attempts never write a stable checkpoint', () => {
  const ledger = fakeLedger();
  const runtime = create({ unit, ledger, seed: 31 });
  runtime.enter({ entryLesson: 'lesson49' });

  const transient = runtime.dispatch({
    type: 'scene/interact',
    interaction: 'inspect-order-board'
  });
  assert.equal(transient.snapshot.buildStage, 0);
  assert.deepEqual(ledger.events, []);

  runtime.dispatch(answerAction(runtime, { correct: false }));
  assert.equal(runtime.snapshot().buildStage, 0);
  assert.deepEqual(ledger.events, []);

  runtime.dispatch(answerAction(runtime));
  assert.equal(runtime.snapshot().buildStage, 1);
  assert.deepEqual(ledger.events.map(event => event.type), ['checkpoint-completed']);
});

test('the same seed produces the same near-transfer context choice', () => {
  const seededUnit = structuredClone(unit);
  for (const [index, target] of seededUnit.targets.entries()) {
    target.contextIds = ['breakfast-stall', 'picnic-supply', 'festival-stall'];
    seededUnit.beats[index].task.answerKeyByContext['festival-stall'] =
      seededUnit.beats[index].task.answerKeyByContext['breakfast-stall'];
  }

  function choose(seed) {
    const runtime = create({
      unit: seededUnit,
      ledger: fakeLedger({ checkpoint: 'understand:complete', buildStage: 2 }),
      seed
    });
    runtime.enter({ entryLesson: 'lesson50' });
    runtime.dispatch(answerAction(runtime, { correct: false, teachingUnit: seededUnit }));
    runtime.dispatch(answerAction(runtime, { correct: false, teachingUnit: seededUnit }));
    return runtime.dispatch(answerAction(runtime, {
      correct: false,
      teachingUnit: seededUnit
    })).snapshot.contextId;
  }

  assert.equal(choose(37), choose(37));
  assert.notEqual(choose(37), 'breakfast-stall');
});

test('a previously built unit resumes as built without submitting a duplicate event', () => {
  const ledger = fakeLedger({ checkpoint: 'build:complete', buildStage: 5 });
  const runtime = create({ unit, ledger, seed: 41 });

  const result = runtime.enter({ entryLesson: 'lesson50' });

  assert.equal(result.snapshot.status, 'unit-built');
  assert.equal(result.snapshot.buildStage, 5);
  assert.equal(result.snapshot.beatId, null);
  assert.deepEqual(result.effects, [{ type: 'runtime/unit-built', unitId: 'FLC-U01' }]);
  assert.deepEqual(ledger.events, []);
});

test('deterministic event ids remain distinct when the same seed resumes at a later beat', () => {
  const firstLedger = fakeLedger();
  const firstRuntime = create({ unit, ledger: firstLedger, seed: 43 });
  firstRuntime.enter({ entryLesson: 'lesson49' });
  firstRuntime.dispatch(answerAction(firstRuntime));

  const resumedLedger = fakeLedger({ checkpoint: 'discover:complete', buildStage: 1 });
  const resumedRuntime = create({ unit, ledger: resumedLedger, seed: 43 });
  resumedRuntime.enter({ entryLesson: 'lesson49' });
  const playing = resumedRuntime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
  resumedRuntime.dispatch({ type: 'audio/completed', requestId: playing.snapshot.audio.requestId });
  resumedRuntime.dispatch(answerAction(resumedRuntime));

  const ids = [...firstLedger.events, ...resumedLedger.events].map(event => event.eventId);
  assert.equal(new Set(ids).size, ids.length);
});

test('formative or checkpoint persistence failure leaves the bridge at its prior stable state', () => {
  const cases = [
    {
      failOnType: 'checkpoint-completed',
      ledgerState: {},
      entryLesson: 'lesson50',
      beatId: 'discover',
      microstepId: 'bridge-discover-check',
      buildStage: 0
    },
    {
      failOnType: 'formative-attempt',
      ledgerState: { checkpoint: 'discover:complete', buildStage: 1 },
      entryLesson: 'lesson49',
      beatId: 'understand',
      microstepId: 'understand-check',
      buildStage: 1,
      finishAudio: true
    }
  ];
  for (const current of cases) {
    const { failOnType } = current;
    const ledger = fakeLedger({ ...current.ledgerState, failOnType });
    const runtime = create({ unit, ledger, seed: 47 });
    runtime.enter({ entryLesson: current.entryLesson });
    if (current.finishAudio) {
      const playing = runtime.dispatch({ type: 'audio/play', audioId: 'bird-line-1' });
      runtime.dispatch({ type: 'audio/completed', requestId: playing.snapshot.audio.requestId });
    }

    const result = runtime.dispatch(answerAction(runtime));

    assert.equal(result.snapshot.status, 'active');
    assert.equal(result.snapshot.beatId, current.beatId);
    assert.equal(result.snapshot.microstepId, current.microstepId);
    assert.equal(result.snapshot.buildStage, current.buildStage);
    assert.equal(ledger.events.at(-1).type, failOnType);
    if (failOnType === 'formative-attempt') {
      assert.deepEqual(ledger.events.map(event => event.type), ['formative-attempt']);
    }
    assert.deepEqual(result.effects, [{
      type: 'runtime/persistence-failed',
      operation: failOnType,
      reason: 'unavailable',
      retryable: true
    }]);
    assert.ok(!result.effects.some(effect => effect.type === 'landmark/build-stage'));
    assert.ok(!result.effects.some(effect => effect.type === 'navigation/handoff'));

    if (failOnType === 'checkpoint-completed') {
      const firstAttemptIds = ledger.events.map(event => event.eventId);
      runtime.dispatch(answerAction(runtime));
      assert.deepEqual(
        ledger.events.slice(firstAttemptIds.length).map(event => event.eventId),
        firstAttemptIds
      );
    }
  }
});

test('unit-built persistence failure cannot claim permanent construction', () => {
  const ledger = fakeLedger({
    checkpoint: 'transfer:complete',
    buildStage: 4,
    failOnType: 'unit-built'
  });
  const runtime = create({ unit, ledger, seed: 53 });
  runtime.enter({ entryLesson: 'lesson50' });

  const result = runtime.dispatch(answerAction(runtime));

  assert.equal(result.snapshot.status, 'active');
  assert.equal(result.snapshot.beatId, 'build');
  assert.equal(result.snapshot.microstepId, 'build-check');
  assert.equal(result.snapshot.buildStage, 4);
  assert.deepEqual(result.effects, [{
    type: 'runtime/persistence-failed',
    operation: 'unit-built',
    reason: 'unavailable',
    retryable: true
  }]);
  assert.ok(!result.effects.some(effect => effect.type === 'landmark/build-stage'));
  assert.ok(!result.effects.some(effect => effect.type === 'runtime/unit-built'));
});

test('page-supplied metadata cannot create target evidence for a checkpoint-only task', () => {
  const ledger = fakeLedger({ checkpoint: 'teach:complete', buildStage: 3 });
  const runtime = create({ unit, ledger, seed: 61 });
  runtime.enter({ entryLesson: 'lesson50' });

  runtime.dispatch(answerAction(runtime, {
    spoof: {
      correct: false,
      targetId: 'FLC-U01-T99',
      contextId: 'picnic-supply',
      evidenceMode: 'page-asserted'
    }
  }));

  assert.deepEqual(ledger.events.map(event => event.type), ['checkpoint-completed']);
  assert.equal(ledger.events[0].targetId, undefined);
  assert.equal(ledger.events[0].contextId, undefined);
  assert.equal(ledger.events[0].evidenceMode, undefined);
  assert.equal(runtime.snapshot().contextId, 'breakfast-stall');
});

test('role stage persists whole-role checkpoints, restores them, and completes with no result or heart change', () => {
  const ledger = roleStageLedger();
  let runtime = create({ unit: nceUnit, ledger, seed: 801 });
  let entered = runtime.enter({ entryLesson: 'lesson1' });
  assert.equal(entered.snapshot.microtaskId, 'L01-M12');
  assert.equal(entered.snapshot.phase, 'role-practice-ready');
  assert.deepEqual(entered.snapshot.rolePracticeProgress.completedRoundIds, []);

  let current = runtime.snapshot();
  let saved = runtime.dispatch({
    type: 'role-practice/round-complete',
    experienceRevision: current.experienceRevision,
    stateVersion: current.stateVersion,
    practiceId: 'L01-M12:role-enactment',
    roundId: 'keeper-round'
  });
  assert.equal(saved.effects.at(-1).type, 'runtime/role-practice-round-saved');
  assert.deepEqual(saved.snapshot.rolePracticeProgress.completedRoundIds, ['keeper-round']);
  assert.equal(saved.snapshot.adventureHeartsRemaining, 3);
  assert.deepEqual(saved.snapshot.temporaryResults, []);

  runtime.destroy();
  runtime = create({ unit: nceUnit, ledger, seed: 802 });
  entered = runtime.enter({ entryLesson: 'lesson1' });
  assert.equal(entered.snapshot.microtaskId, 'L01-M12');
  assert.deepEqual(entered.snapshot.rolePracticeProgress.completedRoundIds, ['keeper-round']);

  current = runtime.snapshot();
  runtime.dispatch({
    type: 'role-practice/round-complete',
    experienceRevision: current.experienceRevision,
    stateVersion: current.stateVersion,
    practiceId: 'L01-M12:role-enactment',
    roundId: 'owner-round'
  });
  current = runtime.snapshot();
  const completed = runtime.dispatch({
    type: 'role-practice/complete',
    experienceRevision: current.experienceRevision,
    stateVersion: current.stateVersion,
    practiceId: 'L01-M12:role-enactment'
  });
  assert.equal(completed.snapshot.status, 'rest-stop');
  assert.equal(completed.snapshot.nextRestStop.restStopId, 'lesson1-chapter-stop');
  assert.equal(completed.snapshot.adventureHeartsRemaining, 3);
  assert.ok(completed.snapshot.completedMicrotaskIds.includes('L01-M12'));
  const completionEvent = ledger.events.find(event => (
    event.type === 'microtask-completed' && event.microtaskId === 'L01-M12'
  ));
  assert.ok(completionEvent);
  assert.deepEqual(completionEvent.targetResults, []);
  assert.deepEqual(completionEvent.audioContactRefs,
    Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`));
});

test('role-round skip advances only after both roles are disposed and map recovery can replace it', () => {
  const ledger = roleStageLedger();
  const runtime = create({ unit: nceUnit, ledger, seed: 901 });
  let current = runtime.enter({ entryLesson: 'lesson1' });

  current = runtime.dispatch({
    type: 'role-practice/round-complete',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    practiceId: 'L01-M12:role-enactment', roundId: 'keeper-round'
  });
  assert.equal(current.snapshot.microtaskId, 'L01-M12');
  assert.deepEqual(current.snapshot.rolePracticeProgress, {
    practiceId: 'L01-M12:role-enactment',
    completedRoundIds: ['keeper-round'], skippedRoundIds: []
  });
  current = runtime.dispatch({
    type: 'role-practice/round-skip',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    practiceId: 'L01-M12:role-enactment', roundId: 'owner-round'
  });

  assert.equal(current.snapshot.microtaskId, 'L02-M11');
  assert.equal(current.snapshot.status, 'active');
  assert.deepEqual(current.snapshot.skippedMicrotaskIds, ['L01-M12']);
  assert.equal(current.snapshot.completedMicrotaskIds.includes('L01-M12'), false);
  const skipEvent = ledger.events.find(event => event.type === 'microtask-skipped');
  assert.ok(skipEvent);
  for (const field of ['targetResults', 'sourceContacts', 'audioContactRefs', 'storyFacts']) {
    assert.deepEqual(skipEvent[field], []);
  }

  current = runtime.dispatch({
    type: 'navigation/open-stage',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: 'L01-M12'
  });
  assert.equal(current.snapshot.mode, 'microtask-v2-skip-recovery');
  assert.equal(current.snapshot.microtaskId, 'L01-M12');
  assert.deepEqual(current.snapshot.rolePracticeProgress.completedRoundIds, ['keeper-round']);
  assert.deepEqual(current.snapshot.rolePracticeProgress.skippedRoundIds, ['owner-round']);

  current = runtime.dispatch({
    type: 'role-practice/round-complete',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    practiceId: 'L01-M12:role-enactment', roundId: 'owner-round'
  });
  current = runtime.dispatch({
    type: 'role-practice/complete',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    practiceId: 'L01-M12:role-enactment'
  });

  assert.equal(current.snapshot.mode, 'microtask-v2');
  assert.equal(current.snapshot.microtaskId, 'L02-M11');
  assert.ok(current.snapshot.completedMicrotaskIds.includes('L01-M12'));
  assert.equal(current.snapshot.skippedMicrotaskIds.includes('L01-M12'), false);
  assert.ok(current.effects.some(effect => effect.type === 'runtime/skipped-stage-completed'));
});

test('skip-complete and skip-skip role combinations resolve as skipped without false completion', () => {
  for (const [caseIndex, dispositions] of [
    ['skipped', 'completed'],
    ['skipped', 'skipped']
  ].entries()) {
    const ledger = roleStageLedger();
    const runtime = create({ unit: nceUnit, ledger, seed: 1100 + caseIndex });
    let current = runtime.enter({ entryLesson: 'lesson1' });
    for (const [index, disposition] of dispositions.entries()) {
      current = runtime.dispatch({
        type: disposition === 'completed'
          ? 'role-practice/round-complete'
          : 'role-practice/round-skip',
        experienceRevision: current.snapshot.experienceRevision,
        stateVersion: current.snapshot.stateVersion,
        practiceId: 'L01-M12:role-enactment',
        roundId: index === 0 ? 'keeper-round' : 'owner-round'
      });
      if (index === 0) assert.equal(current.snapshot.microtaskId, 'L01-M12');
    }
    assert.equal(current.snapshot.microtaskId, 'L02-M11');
    assert.ok(current.snapshot.skippedMicrotaskIds.includes('L01-M12'));
    assert.equal(current.snapshot.completedMicrotaskIds.includes('L01-M12'), false);
    assert.equal(ledger.events.some(event => (
      event.type === 'microtask-completed' && event.microtaskId === 'L01-M12'
    )), false);
  }
});

test('refresh restores a single role disposition and skip recovery can return to the exact mainline state', () => {
  let ledger = roleStageLedger({ skippedRoundIds: ['keeper-round'] });
  let runtime = create({ unit: nceUnit, ledger, seed: 1001 });
  let current = runtime.enter({ entryLesson: 'lesson1' });
  assert.equal(current.snapshot.microtaskId, 'L01-M12');
  assert.deepEqual(current.snapshot.rolePracticeProgress, {
    practiceId: 'L01-M12:role-enactment',
    completedRoundIds: [], skippedRoundIds: ['keeper-round']
  });

  ledger = roleStageLedger({ skippedRoundIds: ['keeper-round', 'owner-round'] });
  ledger.apply({
    eventId: 'seed-stage-skip', type: 'microtask-skipped',
    unitId: nceUnit.unitId, experienceRevision: nceUnit.experienceRevision,
    unitAttemptId: 'role-stage-attempt', attemptRevision: 0,
    beatId: 'teach', microtaskId: 'L01-M12', checkpointId: 'L01-M12:complete',
    completionStatus: 'skipped', targetResults: [], sourceContacts: [],
    audioContactRefs: [], missingAudioRefs: [], storyFacts: [], adventureHeartsRemaining: 3
  });
  runtime = create({ unit: nceUnit, ledger, seed: 1002 });
  current = runtime.enter({ entryLesson: 'lesson2' });
  const origin = structuredClone(current.snapshot);
  current = runtime.dispatch({
    type: 'navigation/open-stage',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    microtaskId: 'L01-M12'
  });
  current = runtime.dispatch({
    type: 'role-practice/round-complete',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion,
    practiceId: 'L01-M12:role-enactment', roundId: 'keeper-round'
  });
  assert.equal(current.snapshot.mode, 'microtask-v2-skip-recovery');
  assert.deepEqual(current.snapshot.rolePracticeProgress.completedRoundIds, ['keeper-round']);
  assert.deepEqual(current.snapshot.rolePracticeProgress.skippedRoundIds, ['owner-round']);

  current = runtime.dispatch({
    type: 'navigation/exit-skip-recovery',
    experienceRevision: current.snapshot.experienceRevision,
    stateVersion: current.snapshot.stateVersion
  });
  assert.equal(current.snapshot.mode, 'microtask-v2');
  assert.equal(current.snapshot.microtaskId, origin.microtaskId);
  assert.equal(current.snapshot.stepId, origin.stepId);
  assert.equal(current.snapshot.phase, origin.phase);
  assert.ok(current.effects.some(effect => effect.type === 'runtime/skipped-stage-returned'));
});
