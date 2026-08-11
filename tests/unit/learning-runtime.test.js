'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = require('../../core/curriculum-catalog');
const { create } = require('../../core/learning-runtime');

const unit = catalog.getTeachingUnit('FLC-U01');

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
