'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = require('../../core/curriculum-catalog');
const { create, evaluateRule } = require('../../core/learning-runtime');
const learningLedger = require('../../core/learning-ledger');
const { createMemoryAdapter } = require('../../core/learning-store');

const unit = catalog.getTeachingUnit('FLC-U01');
const nceUnit = catalog.getTeachingUnit('NCE-U01');

function fakeNceLedger({
  checkpoint = null,
  buildStage = 0,
  storyFacts = [],
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
          [nceUnit.unitId]: { checkpoint, buildStage, storyFacts }
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

function finishActiveNceAudio(runtime) {
  let result = { snapshot: runtime.snapshot() };
  if (result.snapshot.phase === 'audio-ready') {
    result = runtime.dispatch({ type: 'audio/play' });
  }
  assert.equal(result.snapshot.phase, 'audio-playing');
  const requestId = result.snapshot.audio.requestId;
  const segmentCount = result.snapshot.audio.refs.length;
  for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex += 1) {
    result = runtime.dispatch({ type: 'audio/ended', requestId, segmentIndex });
  }
  return result;
}

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
      acceptedByEntityId: { 'car-key': ['block-question', 'L02-W09'] }
    },
    { selectedEntityId: 'car-key', blockRefs: ['block-question', 'L02-W09'] }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'perform-action', action: 'give', entityId: 'watch', targetEntityId: 'visitor' },
    { action: 'give', entityId: 'watch', targetEntityId: 'visitor' }
  ).correct, true);
  assert.equal(evaluateRule(
    { type: 'all-of', requiredFactIds: ['one', 'two', 'three'] },
    { factIds: ['three', 'one', 'two'] }
  ).correct, true);
});

test('Lesson 1 enters the first authored step of the first durable microtask', () => {
  const runtime = create({ unit: nceUnit, ledger: fakeNceLedger(), seed: 101 });

  const entered = runtime.enter({ entryLesson: 'lesson1' });

  assert.equal(entered.snapshot.status, 'active');
  assert.equal(entered.snapshot.mode, 'microtask-v2');
  assert.equal(entered.snapshot.microtaskId, 'L01-M01');
  assert.equal(entered.snapshot.stepId, 'L01-M01:S01');
  assert.equal(entered.snapshot.phase, 'audio-ready');
  assert.deepEqual(entered.effects, [{
    type: 'scene/show',
    beatId: 'discover',
    microtaskId: 'L01-M01',
    stepId: 'L01-M01:S01'
  }]);
});

test('microtask preview enters any authored stage and never writes learning progress', () => {
  const ledger = learningLedger.open({
    store: createMemoryAdapter(),
    key: 'preview-runtime',
    catalog,
    clock: { learningDay: () => '2026-08-17' }
  });
  const effects = [];
  const authoredTasks = nceUnit.beats.flatMap(beat => beat.microtasks || []);
  const before = ledger.read();
  for (const [index, task] of authoredTasks.entries()) {
    const candidate = create({ unit: nceUnit, ledger, seed: 102 + index });
    const entered = candidate.preview({ microtaskId: task.microtaskId });
    assert.equal(entered.snapshot.microtaskId, task.microtaskId);
    assert.equal(entered.snapshot.stepId, task.steps[0].stepId);
    assert.equal(entered.snapshot.mode, 'microtask-v2-preview');
    assert.deepEqual(ledger.read(), before);
    candidate.destroy();
  }

  const runtime = create({
    unit: nceUnit,
    ledger,
    seed: 202,
    effectSink: effect => effects.push(effect)
  });

  const entered = runtime.preview({ microtaskId: 'L02-M07' });
  assert.equal(entered.snapshot.microtaskId, 'L02-M07');
  assert.equal(entered.snapshot.stepId, 'L02-M07:S01');
  assert.equal(entered.snapshot.mode, 'microtask-v2-preview');

  runtime.dispatch({
    type: 'response/submit',
    response: { factIds: ['claim-record-1', 'claim-record-2', 'claim-record-3'] }
  });
  const completed = runtime.dispatch({
    type: 'response/submit',
    response: { action: 'pull', entityId: 'opening-lever', targetEntityId: 'station-power' }
  });

  assert.equal(completed.snapshot.status, 'unit-built');
  assert.equal(completed.snapshot.buildStage, 0);
  assert.deepEqual(ledger.read(), before);
  assert.ok(!effects.some(effect => effect.type === 'landmark/build-stage'));
});

test('Lesson 1 full listening advances only after every active real audio ended callback', () => {
  const ledger = fakeNceLedger();
  const runtime = create({ unit: nceUnit, ledger, seed: 103 });
  runtime.enter({ entryLesson: 'lesson1' });

  assert.deepEqual(runtime.dispatch({
    type: 'response/submit',
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
  }).effects, []);
  const playing = runtime.dispatch({ type: 'audio/play' });
  const requestId = playing.snapshot.audio.requestId;
  assert.equal(playing.snapshot.phase, 'audio-playing');
  assert.equal(playing.effects[0].audioRef.refId, 'L01-D01');
  assert.equal(playing.effects[0].audioRef.src, nceUnit.lessonContent.lesson1.sources['L01-D01'].audioSrc);

  assert.deepEqual(runtime.dispatch({ type: 'time/elapsed', milliseconds: 120_000 }).effects, []);
  assert.deepEqual(runtime.dispatch({
    type: 'audio/ended', requestId: 'stale-request', segmentIndex: 0
  }).effects, []);

  let result;
  for (let segmentIndex = 0; segmentIndex < 7; segmentIndex += 1) {
    result = runtime.dispatch({ type: 'audio/ended', requestId, segmentIndex });
    if (segmentIndex < 6) {
      assert.equal(result.snapshot.stepId, 'L01-M01:S01');
      assert.equal(result.effects[0].audioRef.refId, `L01-D0${segmentIndex + 2}`);
    }
  }

  assert.equal(result.snapshot.stepId, 'L01-M01:S02');
  assert.equal(result.snapshot.phase, 'response');
  assert.equal(result.snapshot.audio.status, 'completed');
  assert.deepEqual(ledger.events, []);
});

test('Lesson 1 turns three wrong actions into teaching support and still requires the child correction', () => {
  const ledger = fakeNceLedger();
  const runtime = create({ unit: nceUnit, ledger, seed: 107 });
  runtime.enter({ entryLesson: 'lesson1' });
  finishActiveNceAudio(runtime);
  const wrong = {
    type: 'response/submit',
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'station-keeper' },
    correct: true
  };

  const first = runtime.dispatch(wrong);
  const second = runtime.dispatch(wrong);
  const third = runtime.dispatch(wrong);

  assert.equal(first.snapshot.supportLevel, 1);
  assert.equal(first.snapshot.heartsRemaining, 2);
  assert.equal(second.snapshot.supportLevel, 2);
  assert.equal(second.snapshot.heartsRemaining, 1);
  assert.equal(third.snapshot.supportLevel, 3);
  assert.equal(third.snapshot.heartsRemaining, 0);
  assert.equal(third.snapshot.assistanceMode, true);
  assert.deepEqual(
    [first, second, third].map(result => result.effects[0].type),
    ['feedback/support', 'feedback/support', 'feedback/partner-demo']
  );
  assert.equal(third.snapshot.stepId, 'L01-M01:S02');
  assert.deepEqual(ledger.events, []);

  const corrected = runtime.dispatch({
    type: 'response/submit',
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
  });
  assert.equal(corrected.snapshot.stepId, 'L01-M01:S03');
  assert.equal(corrected.snapshot.phase, 'audio-ready');
  assert.equal(corrected.snapshot.supportLevel, 0);
  assert.equal(corrected.snapshot.heartsRemaining, 3);
  assert.deepEqual(ledger.events, []);
});

test('Lesson 1 M01 persists after one word sound and a visual label filing', () => {
  const ledger = fakeNceLedger();
  const runtime = create({ unit: nceUnit, ledger, seed: 109 });
  runtime.enter({ entryLesson: 'lesson1' });
  finishActiveNceAudio(runtime);
  runtime.dispatch({
    type: 'response/submit',
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
  });
  finishActiveNceAudio(runtime);
  const matched = runtime.dispatch({
    type: 'response/submit',
    response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });

  assert.equal(matched.snapshot.stepId, 'L01-M01:S04');
  assert.equal(matched.snapshot.phase, 'response');
  assert.deepEqual(ledger.events, []);

  const completed = runtime.dispatch({
    type: 'response/submit',
    response: { sourceRef: 'L01-W07' }
  });

  assert.equal(completed.snapshot.microtaskId, 'L01-M02');
  assert.equal(completed.snapshot.stepId, 'L01-M02:S01');
  assert.equal(completed.snapshot.phase, 'response');
  assert.equal(ledger.events.length, 1);
  assert.deepEqual({
    type: ledger.events[0].type,
    microtaskId: ledger.events[0].microtaskId,
    checkpointId: ledger.events[0].checkpointId,
    completionStatus: ledger.events[0].completionStatus,
    buildStage: ledger.events[0].buildStage
  }, {
    type: 'microtask-completed',
    microtaskId: 'L01-M01',
    checkpointId: 'L01-M01:complete',
    completionStatus: 'completed-independent',
    buildStage: undefined
  });
  assert.deepEqual(
    ledger.events[0].targetResults.map(result => [result.resultId, result.outcome]),
    [
      ['NCE-U01-T04:L01-M01:owner', 'independent'],
      ['NCE-U01-T01:L01-W07:audio', 'independent']
    ]
  );
  assert.deepEqual(ledger.events[0].audioContactRefs, [
    'L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07', 'L01-W07'
  ]);
  assert.deepEqual(ledger.events[0].storyFacts, ['handbag-returned', 'case-clue-owner']);
  assert.ok(!completed.effects.some(effect => effect.type === 'landmark/build-stage'));
});

test('Lesson 2 M01 keeps each four-way choice and saves the four audio cells as one microtask', () => {
  const ledger = fakeNceLedger({
    checkpoint: {
      checkpointId: 'L01-M05:complete',
      beatId: 'discover',
      microtaskId: 'L01-M05',
      completionStatus: 'completed-independent'
    },
    storyFacts: ['lesson1-complete', 'work-lamp-on', 'sorting-room-open']
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 113 });
  const entered = runtime.enter({ entryLesson: 'lesson2' });
  assert.equal(entered.snapshot.microtaskId, 'L02-M01');
  assert.equal(entered.snapshot.stepId, 'L02-M01:S01');

  const explorations = [
    ['L02-W01', 'pen'],
    ['L02-W02', 'pencil'],
    ['L02-W03', 'book'],
    ['L02-W04', 'watch']
  ];
  for (const [sourceRef, entityId] of explorations) {
    const playing = runtime.dispatch({ type: 'explore/activate', sourceRef, entityId });
    assert.equal(playing.snapshot.phase, 'audio-playing');
    assert.equal(playing.effects[0].audioRef.refId, sourceRef);
    runtime.dispatch({
      type: 'audio/ended',
      requestId: playing.snapshot.audio.requestId,
      segmentIndex: 0
    });
  }
  assert.equal(runtime.snapshot().stepId, 'L02-M01:S02');

  const challenges = [
    ['L02-W03', 'book'],
    ['L02-W01', 'pen'],
    ['L02-W04', 'watch'],
    ['L02-W02', 'pencil']
  ];
  for (const [sourceRef, entityId] of challenges) {
    const heard = finishActiveNceAudio(runtime);
    assert.equal(heard.snapshot.phase, 'response');
    assert.equal(heard.snapshot.challengeRef, sourceRef);
    assert.equal(
      nceUnit.beats.flatMap(beat => beat.microtasks || [])
        .find(task => task.microtaskId === 'L02-M01').steps[1].optionEntityIds.length,
      4
    );
    runtime.dispatch({
      type: 'response/submit',
      response: { sourceRef, entityId }
    });
  }

  assert.equal(runtime.snapshot().microtaskId, 'L02-M02');
  assert.equal(runtime.snapshot().stepId, 'L02-M02:S01');
  assert.equal(runtime.snapshot().phase, 'response');
  assert.equal(ledger.events.length, 1);
  assert.deepEqual(
    ledger.events[0].targetResults.map(result => [result.sourceRef, result.channel]),
    [
      ['L02-W03', 'audio'],
      ['L02-W01', 'audio'],
      ['L02-W04', 'audio'],
      ['L02-W02', 'audio']
    ]
  );
});

test('Lesson 2 word-form cells wait for their own feedback audio ended before advancing', () => {
  const ledger = fakeNceLedger({
    checkpoint: {
      checkpointId: 'L02-M01:complete', beatId: 'understand',
      microtaskId: 'L02-M01', completionStatus: 'completed-independent'
    },
    storyFacts: ['pocket-shelf-ready']
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 127 });
  runtime.enter({ entryLesson: 'lesson2' });
  assert.equal(runtime.snapshot().stepId, 'L02-M02:S01');
  assert.equal(runtime.snapshot().challengeRef, 'L01-W07');

  const submitted = runtime.dispatch({
    type: 'response/submit', response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  assert.equal(submitted.snapshot.phase, 'audio-playing');
  assert.equal(submitted.snapshot.batchIndex, 0);
  assert.equal(submitted.snapshot.audio.purpose, 'feedback');
  assert.equal(submitted.effects.at(-1).type, 'audio/play');
  assert.deepEqual(runtime.dispatch({
    type: 'response/submit', response: { sourceRef: 'L02-W04', entityId: 'watch' }
  }).effects, []);

  const feedback = finishActiveNceAudio(runtime);
  assert.equal(feedback.snapshot.batchIndex, 1);
  assert.equal(feedback.snapshot.challengeRef, 'L02-W04');
  assert.equal(feedback.snapshot.phase, 'response');
  assert.deepEqual(ledger.events, []);
});

test('Lesson 2 sentence building is bound to the case the child actually selected', () => {
  const ledger = fakeNceLedger({
    checkpoint: {
      checkpointId: 'L02-M05:complete', beatId: 'transfer',
      microtaskId: 'L02-M05', completionStatus: 'completed-independent'
    },
    storyFacts: ['key-box-ready']
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 129 });
  runtime.enter({ entryLesson: 'lesson2' });

  runtime.dispatch({
    type: 'response/submit', response: { sourceRef: 'L02-W09', entityId: 'car-key' }
  });
  finishActiveNceAudio(runtime);
  runtime.dispatch({
    type: 'response/submit', response: { sourceRef: 'L02-W10', entityId: 'house-key' }
  });
  finishActiveNceAudio(runtime);
  assert.equal(runtime.snapshot().stepId, 'L02-M06:S02');

  runtime.dispatch({ type: 'response/submit', response: { entityId: 'car-key' } });
  runtime.dispatch({ type: 'response/submit', response: { sourceRef: 'L01-D01' } });
  finishActiveNceAudio(runtime);
  finishActiveNceAudio(runtime);
  assert.equal(runtime.snapshot().stepId, 'L02-M06:S05');

  const forgedBranch = runtime.dispatch({
    type: 'response/submit',
    response: {
      selectedEntityId: 'house-key',
      blockRefs: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'L02-W10']
    }
  });
  assert.equal(forgedBranch.snapshot.stepId, 'L02-M06:S05');
  assert.equal(forgedBranch.snapshot.supportLevel, 1);

  const selectedBranch = runtime.dispatch({
    type: 'response/submit',
    response: {
      selectedEntityId: 'house-key',
      blockRefs: ['NCE-U01-C-BLOCK-IS-THIS-YOUR', 'L02-W09']
    }
  });
  assert.equal(selectedBranch.snapshot.phase, 'audio-playing');
  assert.equal(selectedBranch.effects.at(-1).type, 'audio/play');
  assert.equal(selectedBranch.snapshot.audio.refs[0].refId, 'NCE-U01-C-Q-CAR');
});

test('microtask v2 audio failure needs explicit fallback and never forges an audio contact', () => {
  const ledger = fakeNceLedger();
  const runtime = create({ unit: nceUnit, ledger, seed: 131 });
  runtime.enter({ entryLesson: 'lesson1' });

  let playing = runtime.dispatch({ type: 'audio/play' });
  const failedDialogue = runtime.dispatch({
    type: 'audio/failed', requestId: playing.snapshot.audio.requestId, reason: 'decode-error'
  });
  assert.equal(failedDialogue.snapshot.phase, 'audio-fallback');
  assert.equal(failedDialogue.effects[0].type, 'audio/fallback');
  assert.deepEqual(runtime.dispatch({ type: 'time/elapsed', milliseconds: 999_999 }).effects, []);
  runtime.dispatch({ type: 'audio/continue-without-sound' });
  runtime.dispatch({
    type: 'response/submit',
    response: { action: 'give', entityId: 'handbag', targetEntityId: 'handbag-owner' }
  });

  playing = runtime.dispatch({ type: 'audio/play' });
  runtime.dispatch({
    type: 'audio/failed', requestId: playing.snapshot.audio.requestId, reason: 'offline'
  });
  runtime.dispatch({ type: 'audio/continue-without-sound' });
  runtime.dispatch({
    type: 'response/submit', response: { sourceRef: 'L01-W07', entityId: 'handbag' }
  });
  const completed = runtime.dispatch({
    type: 'response/submit', response: { sourceRef: 'L01-W07' }
  });

  assert.equal(completed.snapshot.microtaskId, 'L01-M02');
  assert.equal(ledger.events.length, 1);
  assert.deepEqual(ledger.events[0].audioContactRefs, []);
  assert.deepEqual(ledger.events[0].missingAudioRefs, [
    'L01-D01', 'L01-D02', 'L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07', 'L01-W07'
  ]);
  assert.deepEqual(
    ledger.events[0].targetResults.map(result => [result.resultId, result.outcome]),
    [
      ['NCE-U01-T04:L01-M01:owner', 'independent'],
      ['NCE-U01-T01:L01-W07:audio', 'audio-unavailable']
    ]
  );
  assert.equal(ledger.events[0].completionStatus, 'completed-assisted');
});

test('Lesson 1 archive stops inside the station and resumes Lesson 2 only after the child chooses it', () => {
  const storyFacts = [
    'case-clue-owner', 'case-clue-attention', 'case-clue-repair', 'case-clue-thanks'
  ];
  const ledger = fakeNceLedger({
    checkpoint: {
      checkpointId: 'L01-M04:complete', beatId: 'discover',
      microtaskId: 'L01-M04', completionStatus: 'completed-independent'
    },
    storyFacts
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 137 });
  runtime.enter({ entryLesson: 'lesson1' });
  assert.equal(runtime.snapshot().microtaskId, 'L01-M05');

  runtime.dispatch({ type: 'response/submit', response: { factIds: storyFacts } });
  const archived = runtime.dispatch({
    type: 'response/submit',
    response: { action: 'stamp', entityId: 'case-stamp', targetEntityId: 'case-file' }
  });
  assert.equal(archived.snapshot.status, 'chapter-stop');
  assert.equal(archived.snapshot.buildStage, 0);
  assert.ok(archived.effects.some(effect => effect.type === 'chapter/interior-complete'));
  assert.ok(!archived.effects.some(effect => effect.type === 'landmark/build-stage'));

  const continued = runtime.dispatch({ type: 'chapter/continue' });
  assert.equal(continued.snapshot.status, 'active');
  assert.equal(continued.snapshot.microtaskId, 'L02-M01');
  assert.equal(continued.snapshot.stepId, 'L02-M01:S01');

  const restored = create({
    unit: nceUnit,
    ledger: fakeNceLedger({
      checkpoint: {
        checkpointId: 'L01-M05:complete', beatId: 'discover',
        microtaskId: 'L01-M05', completionStatus: 'completed-independent'
      },
      storyFacts: [...storyFacts, 'lesson1-complete', 'work-lamp-on', 'sorting-room-open']
    }),
    seed: 139
  }).enter({ entryLesson: 'lesson1' });
  assert.equal(restored.snapshot.status, 'chapter-stop');
  assert.equal(restored.snapshot.microtaskId, 'L01-M05');
  assert.deepEqual(restored.effects, [{ type: 'chapter/interior-restored', lessonId: 'lesson1' }]);
});

test('the station grows only after Lesson 2 M07 is atomically persisted and read as complete', () => {
  const claimFacts = ['claim-record-1', 'claim-record-2', 'claim-record-3'];
  const ledger = fakeNceLedger({
    checkpoint: {
      checkpointId: 'L02-M06:complete', beatId: 'transfer',
      microtaskId: 'L02-M06', completionStatus: 'completed-independent'
    },
    storyFacts: claimFacts
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 149 });
  runtime.enter({ entryLesson: 'lesson2' });
  assert.equal(runtime.snapshot().microtaskId, 'L02-M07');

  const stamps = runtime.dispatch({
    type: 'response/submit', response: { factIds: ['claim-record-3', 'claim-record-1', 'claim-record-2'] }
  });
  assert.equal(stamps.snapshot.stepId, 'L02-M07:S02');
  assert.ok(!stamps.effects.some(effect => effect.type === 'landmark/build-stage'));
  assert.deepEqual(ledger.events, []);

  const opened = runtime.dispatch({
    type: 'response/submit',
    response: { action: 'pull', entityId: 'opening-lever', targetEntityId: 'station-power' }
  });
  assert.equal(opened.snapshot.status, 'unit-built');
  assert.equal(opened.snapshot.buildStage, 5);
  assert.equal(ledger.events.length, 1);
  assert.equal(ledger.events[0].type, 'microtask-completed');
  assert.equal(ledger.events[0].microtaskId, 'L02-M07');
  assert.equal(ledger.events[0].buildStage, 5);
  assert.deepEqual(
    opened.effects.filter(effect => effect.type === 'landmark/build-stage'),
    [{ type: 'landmark/build-stage', buildStage: 5 }]
  );
  assert.ok(!JSON.stringify(ledger.events).includes('mastered'));
});

test('a failed Lesson 2 M07 write cannot reveal growth and can retry the same atomic event', () => {
  const claimFacts = ['claim-record-1', 'claim-record-2', 'claim-record-3'];
  const ledger = fakeNceLedger({
    checkpoint: {
      checkpointId: 'L02-M06:complete', beatId: 'transfer',
      microtaskId: 'L02-M06', completionStatus: 'completed-independent'
    },
    storyFacts: claimFacts,
    failOnType: 'microtask-completed',
    failures: 1
  });
  const runtime = create({ unit: nceUnit, ledger, seed: 151 });
  runtime.enter({ entryLesson: 'lesson2' });
  runtime.dispatch({ type: 'response/submit', response: { factIds: claimFacts } });
  const failed = runtime.dispatch({
    type: 'response/submit',
    response: { action: 'pull', entityId: 'opening-lever', targetEntityId: 'station-power' }
  });

  assert.equal(failed.snapshot.status, 'active');
  assert.equal(failed.snapshot.phase, 'persistence-retry');
  assert.equal(failed.snapshot.buildStage, 0);
  assert.deepEqual(failed.effects, [{
    type: 'runtime/persistence-failed',
    operation: 'microtask-completed',
    reason: 'unavailable',
    retryable: true
  }]);
  assert.ok(!failed.effects.some(effect => effect.type === 'landmark/build-stage'));

  const retried = runtime.dispatch({ type: 'persistence/retry' });
  assert.equal(retried.snapshot.status, 'unit-built');
  assert.equal(retried.snapshot.buildStage, 5);
  assert.equal(ledger.events.length, 2);
  assert.deepEqual(ledger.events[1], ledger.events[0]);
  assert.ok(retried.effects.some(effect => effect.type === 'landmark/build-stage'));
});

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
  const state = runtime.snapshot();
  const beat = teachingUnit.beats.find(candidate => candidate.beatId === state.beatId);
  const expectedAnswerId = beat.task.answerKeyByContext[state.contextId];
  return {
    type: 'answer/submit',
    answerId: correct ? expectedAnswerId : `wrong:${expectedAnswerId}`,
    ...spoof
  };
}

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
