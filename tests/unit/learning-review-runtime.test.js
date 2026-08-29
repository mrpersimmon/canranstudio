'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { open } = require('../../core/learning-ledger');
const { createMemoryAdapter } = require('../../core/learning-store');
const { create, evaluateRule } = require('../../core/learning-review-runtime');

function fixedClock(initialDay = '2026-08-10') {
  let day = initialDay;
  return {
    learningDay: () => day,
    set(nextDay) {
      day = nextDay;
    }
  };
}

function testCatalog() {
  const results = [
    {
      resultId: 'R1', reviewCellId: 'R1', challengeRef: 'M01:C01',
      targetId: 'T1', stepId: 'M01:S01', sourceRef: 'S1',
      channel: 'audio-form-supported', contextId: 'main-counter',
      reviewContextId: 'review-schoolbag-check', evidenceMode: 'audio-form-object-match',
      variantId: 'handbag', resultKind: 'formative'
    },
    {
      resultId: 'R2', reviewCellId: 'R2', challengeRef: 'M01:C02',
      targetId: 'T1', stepId: 'M01:S01', sourceRef: 'S2',
      channel: 'word-form', contextId: 'main-counter',
      reviewContextId: 'review-schoolbag-check', evidenceMode: 'word-form-object-match',
      variantId: 'book', resultKind: 'formative'
    }
  ];
  const challenge = (result, entityId, audioKind) => ({
    challengeRef: result.challengeRef,
    resultId: result.resultId,
    reviewCellId: result.reviewCellId,
    sourceRef: result.sourceRef,
    channel: result.channel,
    targetText: result.sourceRef === 'S1' ? 'handbag' : 'book',
    candidateEntityIds: ['handbag', 'book', 'watch'],
    answerRule: {
      type: 'match-entity',
      acceptedSourceRef: result.sourceRef,
      acceptedEntityId: entityId
    },
    supportLayers: [
      { level: 'reobserve', copy: '再看一次。' },
      { level: 'partial-cue', copy: '看开头和结尾。' },
      { level: 'model', copy: '小猫换一个例子示范。' }
    ],
    [audioKind]: {
      sequenceId: `${result.challengeRef}:${audioKind}`,
      gate: 'ended',
      automaticRetryDelaysMs: [250, 750],
      maxPlaybackAttempts: 3,
      segments: [{
        segmentId: `${result.challengeRef}:${audioKind}:A01`,
        sourceRef: result.sourceRef,
        text: result.sourceRef === 'S1' ? 'handbag' : 'book',
        audioSrc: result.sourceRef === 'S1' ? '/audio/handbag.mp3' : '/audio/book.mp3'
      }]
    }
  });
  const task = {
    microtaskId: 'M01',
    checkpointAfterSuccess: { checkpointId: 'M01:complete' },
    exposureRefs: ['S1', 'S2'],
    targetResults: results,
    steps: [{
      stepId: 'M01:S01',
      submissionMode: 'formal',
      challenges: [
        challenge(results[0], 'handbag', 'audioSequence'),
        challenge(results[1], 'book', 'feedbackAudioSequence')
      ]
    }],
    persistence: { checkpointFacts: ['fact-one'] }
  };
  const unit = {
    unitId: 'V2-REVIEW-U01',
    experienceRevision: 'lesson1-2-v2',
    runtimeProfile: 'microtask-v2',
    districtId: 'review-district',
    landmarkId: 'review-landmark',
    lessonIds: ['lesson1', 'lesson2'],
    lessonContent: {
      lesson1: {
        sources: {
          S1: { sourceRef: 'S1', text: 'handbag', audioSrc: '/audio/handbag.mp3' },
          S2: { sourceRef: 'S2', text: 'book', audioSrc: '/audio/book.mp3' }
        }
      }
    },
    reviewContexts: {
      'review-schoolbag-check': {
        contextId: 'review-schoolbag-check',
        title: '晨光书包核对',
        changeType: 'changed-object-position',
        entityIds: ['handbag', 'book', 'watch']
      }
    },
    targets: [{
      targetId: 'T1',
      contextIds: ['main-counter', 'review-schoolbag-check'],
      evidenceModes: ['audio-form-object-match', 'word-form-object-match']
    }],
    beats: [{ beatId: 'B1', buildStage: 0, microtasks: [task] }]
  };
  return {
    TEACHING_UNITS: [unit],
    unit,
    task,
    getTeachingUnit(unitId) {
      return unitId === unit.unitId ? unit : null;
    }
  };
}

function completedMicrotaskEvent(task) {
  return {
    eventId: 'mainline-completed',
    type: 'microtask-completed',
    unitId: 'V2-REVIEW-U01',
    experienceRevision: 'lesson1-2-v2',
    beatId: 'B1',
    microtaskId: task.microtaskId,
    checkpointId: task.checkpointAfterSuccess.checkpointId,
    completionStatus: 'completed-independent',
    targetResults: task.targetResults.map(result => ({
      ...structuredClone(result),
      outcome: 'independent',
      supportLevel: 'none',
      rescueUsed: false,
      heartsRemaining: 1,
      adventureHeartsRemaining: 1
    })),
    sourceContacts: task.exposureRefs.map(sourceRef => ({
      sourceRef,
      contactModes: ['experienced', 'audio-ended']
    })),
    audioContactRefs: [...task.exposureRefs],
    missingAudioRefs: [],
    storyFacts: [...task.persistence.checkpointFacts],
    adventureHeartsRemaining: 1
  };
}

function deterministicIds() {
  const counters = new Map();
  return kind => {
    const next = (counters.get(kind) || 0) + 1;
    counters.set(kind, next);
    return `${kind}-${next}`;
  };
}

function setup() {
  const catalog = testCatalog();
  const clock = fixedClock();
  const ledger = open({
    store: createMemoryAdapter(),
    key: 'review-runtime-test',
    catalog,
    clock
  });
  assert.equal(ledger.apply(completedMicrotaskEvent(catalog.task)).status, 'applied');
  clock.set('2026-08-11');
  const runtime = create({
    unit: catalog.unit,
    ledger,
    idFactory: deterministicIds(),
    now: () => '2026-08-11T01:00:00.000Z'
  });
  return { catalog, clock, ledger, runtime };
}

function command(runtime, type, extra = {}) {
  const snapshot = runtime.snapshot();
  return runtime.dispatch({
    type,
    experienceRevision: snapshot.experienceRevision,
    stateVersion: snapshot.stateVersion,
    reviewRunId: snapshot.reviewRunId,
    attemptRevision: snapshot.attemptRevision,
    reviewChallengeRef: snapshot.reviewChallengeRef,
    ...(snapshot.audio ? {
      requestId: snapshot.audio.requestId,
      segmentId: snapshot.audio.segmentId
    } : {}),
    ...extra
  });
}

test('enter starts the ledger plan as a short catalog-authored review run', () => {
  const { ledger, runtime } = setup();

  const effects = runtime.enter({ reviewRunId: 'review-run-1' });
  const snapshot = runtime.snapshot();

  assert.deepEqual(effects.map(effect => effect.type), ['review/run-started', 'review/audio-ready']);
  assert.equal(snapshot.status, 'active');
  assert.equal(snapshot.reviewRunId, 'review-run-1');
  assert.equal(snapshot.cellCount, 2);
  assert.equal(snapshot.estimatedSeconds, 60);
  assert.equal(snapshot.heartsRemaining, 3);
  assert.equal(snapshot.currentCell.reviewCellId, 'R1');
  assert.equal(snapshot.currentCell.reviewContextId, 'review-schoolbag-check');
  assert.deepEqual(snapshot.currentContext, {
    contextId: 'review-schoolbag-check',
    title: '晨光书包核对',
    changeType: 'changed-object-position',
    entityIds: ['handbag', 'book', 'watch']
  });
  assert.equal(snapshot.reviewChallengeRef, 'review-run-1:R0:C01');
  assert.equal(snapshot.phase, 'audio-ready');
  assert.equal(ledger.read().units['V2-REVIEW-U01'].adventureHeartsRemaining, 1);
  assert.equal(ledger.read().reviewRuns['review-run-1'].heartsRemaining, 3);
  assert.throws(() => {
    snapshot.currentContext.title = '页面临时改题';
  }, TypeError);
});

test('a review run shuffles candidates from its stable run seed and resumes that order after refresh', () => {
  const { catalog, ledger, runtime } = setup();
  runtime.enter({ reviewRunId: 'review-run-1' });
  const first = runtime.snapshot();

  assert.equal(first.currentCell.candidateShuffleSeed, 3864350432);
  assert.deepEqual(first.currentCell.candidateEntityIds, ['book', 'handbag', 'watch']);

  const refreshed = create({
    unit: catalog.unit,
    ledger,
    idFactory: deterministicIds(),
    now: () => '2026-08-11T01:00:00.000Z'
  });
  const effects = refreshed.enter({ reviewRunId: 'review-run-1' });

  assert.equal(effects[0].type, 'review/run-resumed');
  assert.equal(refreshed.snapshot().attemptRevision, 0);
  assert.equal(refreshed.snapshot().currentCell.candidateShuffleSeed, 3864350432);
  assert.deepEqual(refreshed.snapshot().currentCell.candidateEntityIds, [
    'book', 'handbag', 'watch'
  ]);
});

test('current request and segment ended gates prompt audio and post-answer word audio', () => {
  const { ledger, runtime } = setup();
  runtime.enter({ reviewRunId: 'review-run-1' });

  const prompt = command(runtime, 'audio/play');
  const promptState = runtime.snapshot();
  assert.equal(prompt[0].type, 'audio/play');
  assert.equal(prompt[0].visibleText, 'handbag');
  assert.equal(promptState.phase, 'audio-playing');
  assert.equal(promptState.audio.purpose, 'prompt');

  const stale = command(runtime, 'audio/ended', { requestId: 'old-request' });
  assert.equal(stale[0].type, 'review/command-rejected');
  assert.equal(stale[0].reason, 'audio-request-mismatch');
  assert.equal(runtime.snapshot().phase, 'audio-playing');

  const staleSegment = command(runtime, 'audio/ended', { segmentId: 'old-segment' });
  assert.equal(staleSegment[0].reason, 'audio-part-mismatch');
  assert.equal(runtime.snapshot().phase, 'audio-playing');

  const opened = command(runtime, 'audio/ended');
  assert.equal(opened[0].type, 'review/response-ready');
  assert.equal(runtime.snapshot().phase, 'awaiting-response');

  const firstCorrect = command(runtime, 'response/submit', {
    response: { sourceRef: 'S1', entityId: 'handbag' }
  });
  assert.deepEqual(firstCorrect.map(effect => effect.type), [
    'review/feedback-correct', 'review/response-ready'
  ]);
  assert.equal(runtime.snapshot().currentCell.reviewCellId, 'R2');
  assert.equal(
    ledger.read().reviewRuns['review-run-1'].temporaryResults.R1.outcome,
    'independent-retrieval'
  );

  const secondCorrect = command(runtime, 'response/submit', {
    response: { sourceRef: 'S2', entityId: 'book' }
  });
  const answerAudio = runtime.snapshot();
  assert.deepEqual(secondCorrect.map(effect => effect.type), [
    'review/feedback-correct', 'audio/play'
  ]);
  assert.equal(answerAudio.phase, 'audio-playing');
  assert.equal(answerAudio.audio.purpose, 'correct-feedback');
  assert.equal(answerAudio.audio.visibleText, 'book');
  assert.equal(ledger.read().reviewRuns['review-run-1'].temporaryResults.R2, undefined);

  const completed = command(runtime, 'audio/ended');
  assert.deepEqual(completed.map(effect => effect.type), [
    'review/cell-completed', 'review/run-completed'
  ]);
  assert.equal(runtime.snapshot().status, 'completed');
  assert.equal(runtime.snapshot().heartsRemaining, null);
  assert.equal(ledger.read().reviewRuns['review-run-1'], undefined);
  const cells = ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells;
  assert.equal(cells.R1.lastIndependentDay, '2026-08-11');
  assert.equal(cells.R2.lastIndependentDay, '2026-08-11');
  assert.equal(cells.R1.nextDueDay, '2026-08-12');
  assert.equal(ledger.read().units['V2-REVIEW-U01'].adventureHeartsRemaining, 1);
});

test('audio gets two automatic retries, then fails closed until a manual retry', () => {
  const { ledger, runtime } = setup();
  runtime.enter({ reviewRunId: 'audio-run' });
  command(runtime, 'audio/play');
  const firstRequestId = runtime.snapshot().audio.requestId;
  const beforeCell = ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells.R1;

  const retryOne = command(runtime, 'audio/failed', { failureKind: 'transient' });
  const retryOneState = runtime.snapshot();
  assert.equal(retryOne[0].type, 'audio/play');
  assert.equal(retryOne[0].delayMs, 250);
  assert.equal(retryOne[0].retryAttempt, 1);
  assert.notEqual(retryOneState.audio.requestId, firstRequestId);

  const lateEnded = command(runtime, 'audio/ended', { requestId: firstRequestId });
  assert.equal(lateEnded[0].reason, 'audio-request-mismatch');
  assert.equal(runtime.snapshot().phase, 'audio-playing');

  const retryTwo = command(runtime, 'audio/failed', { failureKind: 'transient' });
  assert.equal(retryTwo[0].delayMs, 750);
  assert.equal(retryTwo[0].retryAttempt, 2);
  const lastAutomaticRequestId = runtime.snapshot().audio.requestId;

  const exhausted = command(runtime, 'audio/failed', { failureKind: 'transient' });
  assert.equal(exhausted[0].type, 'review/audio-failure');
  assert.equal(exhausted[0].canRetry, true);
  assert.equal(runtime.snapshot().phase, 'audio-failed');
  assert.equal(ledger.read().reviewRuns['audio-run'].heartsRemaining, 3);
  const afterCell = ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells.R1;
  assert.equal(afterCell.nextDueDay, beforeCell.nextDueDay);
  assert.equal(afterCell.audioUnavailable, true);
  assert.equal(ledger.read().units['V2-REVIEW-U01'].adventureHeartsRemaining, 1);

  const manual = command(runtime, 'audio/retry');
  assert.equal(manual[0].type, 'audio/play');
  assert.equal(manual[0].delayMs, 0);
  assert.equal(manual[0].retryAttempt, 0);
  assert.notEqual(runtime.snapshot().audio.requestId, lastAutomaticRequestId);
  assert.equal(runtime.snapshot().phase, 'audio-playing');
});

test('cancelled and aborted audio remain replayable without failure evidence or retry loss', () => {
  for (const failureKind of ['cancelled', 'aborted']) {
    const { ledger, runtime } = setup();
    const reviewRunId = `${failureKind}-run`;
    runtime.enter({ reviewRunId });
    command(runtime, 'audio/play');
    const before = structuredClone(
      ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells.R1
    );
    const retryAttempt = runtime.snapshot().audio.retryAttempt;

    const interrupted = command(runtime, 'audio/failed', { failureKind });

    assert.equal(interrupted[0].type, 'review/audio-cancelled');
    assert.equal(interrupted[0].canRetry, true);
    assert.equal(runtime.snapshot().phase, 'audio-paused');
    assert.equal(runtime.snapshot().audio.status, 'paused');
    assert.equal(runtime.snapshot().audio.retryAttempt, retryAttempt);
    assert.equal(ledger.read().reviewRuns[reviewRunId].heartsRemaining, 3);
    assert.deepEqual(ledger.read().reviewRuns[reviewRunId].attemptLog, []);
    const after = ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells.R1;
    assert.equal(after.audioUnavailable, false);
    assert.equal(after.nextDueDay, before.nextDueDay);
    assert.equal(after.reviewAttempts.length, before.reviewAttempts.length);

    const replayed = command(runtime, 'audio/retry');
    assert.equal(replayed[0].type, 'audio/play');
    assert.equal(runtime.snapshot().audio.retryAttempt, retryAttempt);
    assert.equal(runtime.snapshot().phase, 'audio-playing');
  }
});

test('a wrong answer loses a review heart and a child correction restores it as assisted practice', () => {
  const { ledger, runtime } = setup();
  runtime.enter({ reviewRunId: 'support-run' });
  command(runtime, 'audio/play');
  command(runtime, 'audio/ended');

  const wrong = command(runtime, 'response/submit', {
    response: { sourceRef: 'S1', entityId: 'watch' }
  });
  assert.deepEqual(wrong.map(effect => effect.type), [
    'review/feedback-incorrect', 'review/heart-lost', 'review/support'
  ]);
  assert.equal(runtime.snapshot().phase, 'supporting');
  assert.equal(runtime.snapshot().supportLevel, 'reobserve');
  assert.equal(runtime.snapshot().heartsRemaining, 2);
  assert.equal(ledger.read().units['V2-REVIEW-U01'].adventureHeartsRemaining, 1);

  command(runtime, 'support/ended');
  const corrected = command(runtime, 'response/submit', {
    response: { sourceRef: 'S1', entityId: 'handbag' }
  });
  assert.deepEqual(corrected.map(effect => effect.type), [
    'review/feedback-correct', 'review/response-ready'
  ]);
  assert.equal(runtime.snapshot().heartsRemaining, 3);
  assert.equal(runtime.snapshot().currentCell.reviewCellId, 'R2');
  const saved = ledger.read().reviewRuns['support-run'].temporaryResults.R1;
  assert.equal(saved.outcome, 'review-assisted-practice');
  assert.equal(saved.supportLevel, 'reobserve');
  assert.equal(saved.rescueUsed, false);
});

test('heart zero shows a changed example, then clears and restarts the whole short run', () => {
  const { ledger, runtime } = setup();
  runtime.enter({ reviewRunId: 'rescue-run' });
  command(runtime, 'audio/play');
  command(runtime, 'audio/ended');
  command(runtime, 'response/submit', {
    response: { sourceRef: 'S1', entityId: 'handbag' }
  });
  assert.deepEqual(runtime.snapshot().completedReviewCellIds, ['R1']);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    command(runtime, 'response/submit', {
      response: { sourceRef: 'S2', entityId: 'watch' }
    });
    if (attempt < 2) command(runtime, 'support/ended');
  }

  const rescue = runtime.snapshot();
  const ledgerRun = ledger.read().reviewRuns['rescue-run'];
  assert.equal(rescue.phase, 'rescue-model');
  assert.equal(rescue.heartsRemaining, 0);
  assert.equal(rescue.attemptRevision, 0);
  assert.equal(rescue.rescueUsed, true);
  assert.deepEqual(rescue.completedReviewCellIds, []);
  assert.equal(ledgerRun.heartsRemaining, 3);
  assert.equal(ledgerRun.attemptRevision, 1);
  assert.deepEqual(ledgerRun.temporaryResults, {});

  const restarted = command(runtime, 'rescue/model-ended');
  assert.deepEqual(restarted.map(effect => effect.type), [
    'review/temporary-cleared',
    'review/attempt-revision-changed',
    'review/hearts-refilled',
    'review/run-restarted',
    'review/audio-ready'
  ]);
  assert.equal(runtime.snapshot().attemptRevision, 1);
  assert.equal(runtime.snapshot().heartsRemaining, 3);
  assert.equal(runtime.snapshot().currentCell.reviewCellId, 'R1');
  assert.equal(runtime.snapshot().reviewChallengeRef, 'rescue-run:R1:C01');

  command(runtime, 'audio/play');
  command(runtime, 'audio/ended');
  command(runtime, 'response/submit', {
    response: { sourceRef: 'S1', entityId: 'handbag' }
  });
  command(runtime, 'response/submit', {
    response: { sourceRef: 'S2', entityId: 'book' }
  });
  command(runtime, 'audio/ended');

  assert.equal(runtime.snapshot().status, 'completed');
  const cells = ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells;
  assert.equal(cells.R1.lastIndependentDay, null);
  assert.equal(cells.R1.lastReviewOutcome, 'review-assisted-practice');
  assert.equal(cells.R1.nextDueDay, '2026-08-12');
  assert.equal(cells.R1.reviewAttempts.at(-1).supportLevel, 'model');
  assert.equal(cells.R1.reviewAttempts.at(-1).rescueUsed, true);
  assert.equal(ledger.read().units['V2-REVIEW-U01'].adventureHeartsRemaining, 1);
});

test('defer cancels current media and changes neither hearts nor review scheduling', () => {
  const { ledger, runtime } = setup();
  runtime.enter({ reviewRunId: 'defer-run' });
  command(runtime, 'audio/play');
  const requestId = runtime.snapshot().audio.requestId;
  const before = structuredClone(
    ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells.R1
  );

  const effects = runtime.defer();

  assert.deepEqual(effects, [
    { type: 'audio/cancel', requestId },
    { type: 'review/run-deferred', reviewRunId: 'defer-run' }
  ]);
  assert.equal(runtime.snapshot().status, 'deferred');
  assert.equal(runtime.snapshot().heartsRemaining, null);
  assert.equal(ledger.read().reviewRuns['defer-run'], undefined);
  const after = ledger.read().units['V2-REVIEW-U01'].targets.T1.variantCells.R1;
  assert.equal(after.nextDueDay, before.nextDueDay);
  assert.equal(after.lastIndependentDay, before.lastIndependentDay);
  assert.equal(after.reviewAttempts.length, before.reviewAttempts.length);
  assert.equal(ledger.read().units['V2-REVIEW-U01'].adventureHeartsRemaining, 1);
});

test('declarative catalog rules, not a page supplied correctness flag, judge responses', () => {
  assert.deepEqual(evaluateRule(
    { type: 'select-one', acceptedEntityId: 'handbag' },
    { entityId: 'watch', correct: true }
  ), { correct: false, mismatchPath: ['entityId'] });
  assert.equal(evaluateRule(
    { type: 'match-entity', acceptedSourceRef: 'S1', acceptedEntityId: 'handbag' },
    { sourceRef: 'S1', entityId: 'handbag', correct: false }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'ordered-blocks', acceptedOrder: ['is-this-your', 'handbag', '?'] },
    { blockRefs: ['is-this-your', 'handbag', '?'] }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'connect-reference', sourceRef: 'L01-W09', entityId: 'watch' },
    { sourceRef: 'L01-W09', entityId: 'watch' }
  ).correct, true);
});
