'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { evaluateRule } = require('../../core/learning-runtime');
const { create, validateConfig } = require('../../core/learning-outcome-practice');

const ROLE_ORIGIN = Object.freeze({ outcomeNodeId: 'L01-RS01', status: 'rest-stop', buildStage: 0 });
const RECAP_ORIGIN = Object.freeze({
  outcomeNodeId: 'NCE-U01-OUTCOME', status: 'unit-built', buildStage: 5
});

function roleSwapConfig() {
  return {
    practiceId: 'L01-RS01:role-swap', kind: 'role-swap', availableAt: { ...ROLE_ORIGIN },
    rounds: [
      {
        roundId: 'keeper-round', roleEntityId: 'station-keeper', partnerEntityId: 'handbag-owner',
        dialogueTurnRefs: ['L01-D01', 'L01-D02', 'L01-D03', 'L01-D04'],
        hiddenTurnRefs: ['L01-D01', 'L01-D03'], partnerTurnRefs: ['L01-D02', 'L01-D04']
      },
      {
        roundId: 'owner-round', roleEntityId: 'handbag-owner', partnerEntityId: 'station-keeper',
        dialogueTurnRefs: ['L01-D03', 'L01-D04', 'L01-D05', 'L01-D06', 'L01-D07'],
        hiddenTurnRefs: ['L01-D04', 'L01-D06', 'L01-D07'], partnerTurnRefs: ['L01-D03', 'L01-D05']
      }
    ]
  };
}

function fullRoleEnactmentConfig() {
  const dialogueTurnRefs = Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`);
  return {
    practiceId: 'L01-M12:role-enactment', kind: 'role-enactment',
    castOrder: ['station-keeper', 'handbag-owner'], propEntityIds: ['handbag'],
    rounds: [
      {
        roundId: 'keeper-round', roleEntityId: 'station-keeper', partnerEntityId: 'handbag-owner',
        dialogueTurnRefs, hiddenTurnRefs: ['L01-D01', 'L01-D03', 'L01-D05'],
        partnerTurnRefs: ['L01-D02', 'L01-D04', 'L01-D06', 'L01-D07']
      },
      {
        roundId: 'owner-round', roleEntityId: 'handbag-owner', partnerEntityId: 'station-keeper',
        dialogueTurnRefs, hiddenTurnRefs: ['L01-D02', 'L01-D04', 'L01-D06', 'L01-D07'],
        partnerTurnRefs: ['L01-D01', 'L01-D03', 'L01-D05']
      }
    ]
  };
}

function manualDialogueConfig() {
  const dialogueTurnRefs = Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`);
  return {
    practiceId: 'L01-RS01:manual-dialogue', kind: 'manual-dialogue',
    availableAt: { ...ROLE_ORIGIN }, unlockAfterStageId: 'L01-M12',
    castOrder: ['station-keeper', 'handbag-owner'], propEntityIds: ['handbag'],
    dialogueTurnRefs,
    turnHints: dialogueTurnRefs.map(turnRef => ({
      turnRef, intent: `意图 ${turnRef}`, openingChunk: `开头 ${turnRef}`
    })),
    countsTowardProgress: false, producesLearningEvidence: false, affectsAdventureHearts: false
  };
}

function caseRecapConfig() {
  return {
    practiceId: 'NCE-U01-OUTCOME:case-recap', kind: 'case-recap',
    diagnosticKind: 'same-day-practice', availableAt: { ...RECAP_ORIGIN },
    items: [
      {
        itemId: 'recap-story-owner', practiceTarget: 'discourse-understanding',
        promptRef: 'NCE-U01-C-RECAP-OWNER', correctAudioRef: 'L01-D06',
        options: [
          { optionId: 'owner-woman', entityId: 'handbag-owner' },
          { optionId: 'owner-keeper', entityId: 'station-keeper' },
          { optionId: 'owner-cat', entityId: 'explorer-cat' }
        ],
        answerRule: { type: 'select-one', acceptedEntityId: 'handbag-owner' }
      },
      {
        itemId: 'recap-polite-repair', practiceTarget: 'communication-structure',
        promptRef: 'NCE-U01-C-RECAP-REPAIR', correctAudioRef: 'L01-D04',
        options: [
          { optionId: 'repair-pardon', sourceRef: 'L01-D04' },
          { optionId: 'repair-excuse', sourceRef: 'L01-D01' },
          { optionId: 'repair-thanks', sourceRef: 'L01-D07' }
        ],
        answerRule: { type: 'select-one', acceptedSourceRef: 'L01-D04' }
      },
      {
        itemId: 'recap-new-route', practiceTarget: 'vocabulary-transfer',
        promptRef: 'NCE-U01-C-RECAP-ROUTE', correctAudioRef: 'L02-W10',
        options: [
          { optionId: 'route-house', sourceRef: 'L02-W10' },
          { optionId: 'route-car', sourceRef: 'L02-W09' },
          { optionId: 'route-watch', sourceRef: 'L02-W04' }
        ],
        answerRule: { type: 'select-one', acceptedSourceRef: 'L02-W10' }
      }
    ]
  };
}

function runtimeFor(config) {
  return create(config, { evaluateRule });
}

function audioAction(type, audio, extra = {}) {
  return {
    type,
    practiceSessionId: audio.practiceSessionId,
    stateVersion: audio.stateVersion,
    requestId: audio.requestId,
    segmentId: audio.segmentId,
    ...extra
  };
}

function audioEffect(effects) {
  return effects.find(effect => effect.type === 'practice/audio-play');
}

test('requires catalog availability plus exactly two role rounds or three recap items', () => {
  assert.deepEqual(validateConfig(roleSwapConfig()), []);
  assert.deepEqual(validateConfig(caseRecapConfig()), []);
  const oneRound = roleSwapConfig(); oneRound.rounds.pop();
  assert.match(validateConfig(oneRound).join('\n'), /exactly two role-swap rounds/i);
  const twoItems = caseRecapConfig(); twoItems.items.pop();
  assert.match(validateConfig(twoItems).join('\n'), /exactly three recap items/i);
  const noAvailability = roleSwapConfig(); delete noAvailability.availableAt;
  assert.match(validateConfig(noAvailability).join('\n'), /availableAt.*outcomeNodeId.*status.*buildStage/i);
});

test('rejects mainline-shaped fields recursively', () => {
  for (const [field, value] of [
    ['resultId', 'R30'], ['challengeRef', 'M17:C01'], ['targetResults', []],
    ['evidenceMode', 'independent'], ['adventureHearts', 3], ['landmarkId', 'landmark'],
    ['schedulingPolicy', 'tomorrow'], ['nextDueDay', '2026-08-25'],
    ['mastery', true], ['checkpointFacts', ['fact']], ['buildStage', 5]
  ]) {
    const config = roleSwapConfig(); config.rounds[0].nested = { [field]: value };
    assert.match(validateConfig(config).join('\n'), new RegExp(field, 'i'));
    assert.throws(() => runtimeFor(config), /forbidden mainline field/i);
  }
});

test('enter validates outcomeNodeId, status, and buildStage before allocating a session', () => {
  const runtime = runtimeFor(roleSwapConfig());
  const before = runtime.snapshot();
  assert.deepEqual(runtime.enter({ ...ROLE_ORIGIN, buildStage: 1 }), [{
    type: 'practice/command-rejected', reason: 'practice-origin-not-available'
  }]);
  assert.deepEqual(runtime.snapshot(), before);
  const entered = runtime.enter(ROLE_ORIGIN);
  assert.equal(entered[0].type, 'practice/entered');
  assert.match(entered[0].practiceSessionId, /^L01-RS01:role-swap:S1$/);
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D01');
  assert.equal(runtime.snapshot().currentTurn.visibility, 'hidden');
  assert.equal(runtime.snapshot().phase, 'awaiting-reveal');
});

test('role-swap walks dialogueTurnRefs: hidden child turns reveal, partner turns autoplay', () => {
  const runtime = runtimeFor(roleSwapConfig()); runtime.enter(ROLE_ORIGIN);
  let effects = runtime.reveal(); let audio = audioEffect(effects);
  assert.equal(audio.audioRef, 'L01-D01');
  assert.equal(runtime.snapshot().currentTurn.visibility, 'visible');
  effects = runtime.dispatch(audioAction('audio/ended', audio)); audio = audioEffect(effects);
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D02');
  assert.equal(runtime.snapshot().currentTurn.role, 'partner');
  assert.equal(audio.audioRef, 'L01-D02');
  effects = runtime.dispatch(audioAction('audio/ended', audio));
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D03');
  assert.equal(runtime.snapshot().phase, 'awaiting-reveal');
  audio = audioEffect(runtime.reveal()); effects = runtime.dispatch(audioAction('audio/ended', audio));
  audio = audioEffect(effects); assert.equal(audio.audioRef, 'L01-D04');
  runtime.dispatch(audioAction('audio/ended', audio));
  assert.equal(runtime.snapshot().phase, 'round-complete');
  effects = runtime.next(); audio = audioEffect(effects);
  assert.equal(runtime.snapshot().currentRound.roundId, 'owner-round');
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D03');
  assert.equal(audio.audioRef, 'L01-D03');
});

test('audio ended requires current session, version, request and segment identities', () => {
  const runtime = runtimeFor(roleSwapConfig()); runtime.enter(ROLE_ORIGIN);
  const first = audioEffect(runtime.reveal()); const before = runtime.snapshot();
  for (const stale of [
    { ...audioAction('audio/ended', first), practiceSessionId: 'stale-session' },
    { ...audioAction('audio/ended', first), stateVersion: first.stateVersion - 1 },
    { ...audioAction('audio/ended', first), requestId: 'stale-request' },
    { ...audioAction('audio/ended', first), segmentId: 'stale-segment' }
  ]) {
    assert.equal(runtime.dispatch(stale)[0].type, 'practice/command-rejected');
    assert.deepEqual(runtime.snapshot(), before);
  }
  const nextAudio = audioEffect(runtime.dispatch(audioAction('audio/ended', first)));
  const afterAdvance = runtime.snapshot();
  assert.equal(runtime.dispatch(audioAction('audio/ended', first))[0].reason, 'stale-audio-event');
  assert.deepEqual(runtime.snapshot(), afterAdvance);
  assert.equal(nextAudio.audioRef, 'L01-D02');
});

test('audio failure exposes retry, does not advance, and replaces request identity', () => {
  const runtime = runtimeFor(roleSwapConfig()); runtime.enter(ROLE_ORIGIN);
  const first = audioEffect(runtime.reveal());
  const failed = runtime.dispatch(audioAction('audio/failed', first, { reason: 'decode-error' }));
  assert.equal(failed[0].type, 'practice/audio-retry-visible');
  assert.equal(runtime.snapshot().phase, 'audio-retry');
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D01');
  assert.equal(runtime.dispatch(audioAction('audio/ended', first))[0].reason, 'audio-not-playing');
  const retrySnapshot = runtime.snapshot();
  assert.equal(runtime.dispatch({
    type: 'audio/retry', practiceSessionId: retrySnapshot.practiceSessionId,
    stateVersion: retrySnapshot.stateVersion, requestId: 'stale-request',
    segmentId: retrySnapshot.audio.segmentId
  })[0].reason, 'stale-audio-retry');
  const retry = audioEffect(runtime.dispatch({
    type: 'audio/retry', practiceSessionId: runtime.snapshot().practiceSessionId,
    stateVersion: runtime.snapshot().stateVersion,
    requestId: runtime.snapshot().audio.requestId,
    segmentId: runtime.snapshot().audio.segmentId
  }));
  assert.notEqual(retry.requestId, first.requestId);
  runtime.dispatch(audioAction('audio/ended', retry));
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D02');
});

test('case recap maps stable optionId to response and uses the main runtime evaluator', () => {
  let evaluatorCalls = 0;
  const runtime = create(caseRecapConfig(), { evaluateRule(rule, response) {
    evaluatorCalls += 1; return evaluateRule(rule, response);
  } });
  runtime.enter(RECAP_ORIGIN);
  const wrong = runtime.submit('owner-cat');
  assert.equal(wrong[0].correct, false);
  assert.equal(runtime.snapshot().attemptsByItemId['recap-story-owner'], 1);
  const correctEffects = runtime.submit('owner-woman');
  const correctAudio = audioEffect(correctEffects);
  assert.equal(correctEffects[0].correct, true);
  assert.equal(correctAudio.audioRef, 'L01-D06');
  assert.equal(runtime.snapshot().phase, 'audio-playing');
  assert.deepEqual(runtime.snapshot().correctItemIds, []);
  assert.equal(runtime.next()[0].reason, 'item-audio-not-ended');
  runtime.dispatch(audioAction('audio/ended', correctAudio));
  assert.equal(runtime.snapshot().phase, 'answered');
  assert.deepEqual(runtime.snapshot().correctItemIds, ['recap-story-owner']);
  assert.equal(runtime.next()[0].entryId, 'recap-polite-repair');
  assert.equal(evaluatorCalls, 2);
});

test('case correct-audio failure retries without adding an attempt or completing item', () => {
  const runtime = runtimeFor(caseRecapConfig()); runtime.enter(RECAP_ORIGIN);
  const audio = audioEffect(runtime.submit('owner-woman'));
  const attempts = runtime.snapshot().attemptsByItemId['recap-story-owner'];
  runtime.dispatch(audioAction('audio/failed', audio, { reason: 'network' }));
  assert.equal(runtime.snapshot().phase, 'audio-retry');
  assert.equal(runtime.snapshot().attemptsByItemId['recap-story-owner'], attempts);
  assert.deepEqual(runtime.snapshot().correctItemIds, []);
  assert.equal(runtime.next()[0].reason, 'item-audio-not-ended');
});

test('exit and destroy cancel current audio, clear memory, and stale ended cannot advance', () => {
  const runtime = runtimeFor(caseRecapConfig()); runtime.enter(RECAP_ORIGIN);
  const audio = audioEffect(runtime.submit('owner-woman'));
  const exited = runtime.exit();
  assert.equal(exited[0].type, 'practice/audio-cancel');
  assert.deepEqual(
    Object.fromEntries(['practiceSessionId', 'stateVersion', 'requestId', 'segmentId']
      .map(field => [field, exited[0][field]])),
    Object.fromEntries(['practiceSessionId', 'stateVersion', 'requestId', 'segmentId']
      .map(field => [field, audio[field]]))
  );
  assert.equal(exited[1].type, 'practice/exited');
  assert.equal(runtime.snapshot().status, 'idle');
  assert.equal(runtime.snapshot().practiceSessionId, null);
  assert.deepEqual(runtime.snapshot().attemptsByItemId, {});
  assert.equal(runtime.dispatch(audioAction('audio/ended', audio))[0].reason, 'practice-not-active');
  runtime.enter(RECAP_ORIGIN); const secondAudio = audioEffect(runtime.submit('owner-woman'));
  const destroyed = runtime.destroy();
  assert.equal(destroyed[0].type, 'practice/audio-cancel');
  assert.equal(destroyed[1].type, 'practice/destroyed');
  assert.equal(runtime.snapshot().status, 'destroyed');
  assert.equal(runtime.dispatch(audioAction('audio/ended', secondAudio))[0].reason, 'practice-destroyed');
});

test('configuration and snapshots stay cloned, frozen, and answer rules remain private', () => {
  const config = caseRecapConfig(); const runtime = runtimeFor(config);
  config.items[0].options[0].entityId = 'MUTATED'; runtime.enter(RECAP_ORIGIN);
  const snapshot = runtime.snapshot();
  assert.equal(snapshot.currentItem.options[0].entityId, 'handbag-owner');
  assert.equal('answerRule' in snapshot.currentItem, false);
  assert.ok(Object.isFrozen(snapshot));
  assert.throws(() => snapshot.currentItem.options.push({ optionId: 'x' }), TypeError);
});

test('accepts the production catalog contracts and a fresh runtime never restores memory', () => {
  const catalog = require('../../core/curriculum-catalog');
  const [roleSwap, recap] = catalog.getTeachingUnit('NCE-U01').experience.outcomePractices;
  assert.deepEqual(validateConfig(roleSwap), []);
  assert.deepEqual(validateConfig(recap), []);

  const first = runtimeFor(roleSwap);
  first.enter(roleSwap.availableAt);
  first.reveal();
  assert.equal(first.snapshot().status, 'active');

  const refreshed = runtimeFor(roleSwap);
  assert.equal(refreshed.snapshot().status, 'idle');
  assert.equal(refreshed.snapshot().practiceSessionId, null);

  const recapRuntime = runtimeFor(recap);
  assert.equal(recapRuntime.enter(recap.availableAt)[0].entryId, 'recap-story-owner');
});

test('attaches the CommonJS API to global CanranCore', () => {
  const api = require('../../core/learning-outcome-practice');
  assert.equal(globalThis.CanranCore.learningOutcomePractice, api);
  assert.deepEqual(Object.keys(api).sort(), ['create', 'validateConfig']);
});

test('formal role enactment starts from role selection, completes either role first, and saves only whole roles', () => {
  const savedRoundIds = [];
  const runtime = create(fullRoleEnactmentConfig(), {
    saveRound({ roundId }) {
      savedRoundIds.push(roundId);
      return { persisted: true };
    }
  });

  const entered = runtime.enter({ completedRoundIds: [] });
  assert.equal(entered[0].type, 'practice/entered');
  assert.equal(runtime.snapshot().phase, 'role-selection');
  assert.deepEqual(runtime.snapshot().completedRoundIds, []);

  let effects = runtime.dispatch({ type: 'role/select', roundId: 'owner-round' });
  let audio = audioEffect(effects);
  assert.equal(runtime.snapshot().currentRound.roundId, 'owner-round');
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D01');
  assert.equal(runtime.snapshot().currentTurn.role, 'partner');
  assert.equal(audio.audioRef, 'L01-D01');

  while (runtime.snapshot().phase !== 'role-selection') {
    const snapshot = runtime.snapshot();
    if (snapshot.phase === 'awaiting-reveal') {
      audio = audioEffect(runtime.reveal());
    } else if (snapshot.phase === 'audio-playing') {
      audio = snapshot.audio;
    } else {
      assert.fail(`unexpected phase ${snapshot.phase}`);
    }
    runtime.dispatch(audioAction('audio/ended', audio));
  }
  assert.deepEqual(savedRoundIds, ['owner-round']);
  assert.deepEqual(runtime.snapshot().completedRoundIds, ['owner-round']);
  assert.equal(runtime.dispatch({ type: 'role/select', roundId: 'owner-round' })[0].reason,
    'role-already-complete');

  runtime.dispatch({ type: 'role/select', roundId: 'keeper-round' });
  while (runtime.snapshot().phase !== 'all-roles-complete') {
    const snapshot = runtime.snapshot();
    const nextAudio = snapshot.phase === 'awaiting-reveal'
      ? audioEffect(runtime.reveal())
      : snapshot.audio;
    runtime.dispatch(audioAction('audio/ended', nextAudio));
  }
  assert.deepEqual(savedRoundIds, ['owner-round', 'keeper-round']);
  assert.deepEqual(new Set(runtime.snapshot().completedRoundIds), new Set(['owner-round', 'keeper-round']));
});

test('formal role enactment restores completed roles while an unfinished role restarts at D01', () => {
  const runtime = create(fullRoleEnactmentConfig(), {
    saveRound: () => ({ persisted: true })
  });
  runtime.enter({ completedRoundIds: ['keeper-round'] });
  assert.equal(runtime.snapshot().phase, 'role-selection');
  assert.deepEqual(runtime.snapshot().completedRoundIds, ['keeper-round']);

  const effects = runtime.dispatch({ type: 'role/select', roundId: 'owner-round' });
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D01');
  assert.equal(audioEffect(effects).audioRef, 'L01-D01');
});

test('manual dialogue reveals exactly one line, uses two hint levels, and replay never advances', () => {
  const runtime = runtimeFor(manualDialogueConfig());
  runtime.enter(ROLE_ORIGIN);
  assert.equal(runtime.snapshot().phase, 'awaiting-manual-reveal');
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D01');
  assert.equal(runtime.snapshot().currentTurn.visibility, 'hidden');
  assert.deepEqual(runtime.snapshot().revealedTurnRefs, []);

  runtime.dispatch({ type: 'hint/show' });
  assert.equal(runtime.snapshot().hintLevel, 1);
  assert.equal(runtime.snapshot().currentHint.intent, '意图 L01-D01');
  assert.equal(runtime.snapshot().currentHint.openingChunk, null);
  runtime.dispatch({ type: 'hint/show' });
  assert.equal(runtime.snapshot().hintLevel, 2);
  assert.equal(runtime.snapshot().currentHint.openingChunk, '开头 L01-D01');

  let audio = audioEffect(runtime.reveal());
  assert.equal(audio.audioRef, 'L01-D01');
  runtime.dispatch(audioAction('audio/ended', audio));
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D02');
  assert.equal(runtime.snapshot().phase, 'awaiting-manual-reveal');
  assert.equal(runtime.snapshot().hintLevel, 0);
  assert.deepEqual(runtime.snapshot().revealedTurnRefs, ['L01-D01']);

  audio = audioEffect(runtime.dispatch({ type: 'line/replay', turnRef: 'L01-D01' }));
  assert.equal(audio.purpose, 'replay-revealed-turn');
  runtime.dispatch(audioAction('audio/ended', audio));
  assert.equal(runtime.snapshot().currentTurn.turnRef, 'L01-D02');
  assert.equal(runtime.snapshot().phase, 'awaiting-manual-reveal');

  while (runtime.snapshot().phase !== 'manual-complete') {
    audio = audioEffect(runtime.reveal());
    runtime.dispatch(audioAction('audio/ended', audio));
  }
  assert.deepEqual(runtime.snapshot().revealedTurnRefs,
    Array.from({ length: 7 }, (_, index) => `L01-D0${index + 1}`));

  const fresh = runtimeFor(manualDialogueConfig());
  fresh.enter(ROLE_ORIGIN);
  assert.deepEqual(fresh.snapshot().revealedTurnRefs, []);
  assert.equal(fresh.snapshot().currentTurn.turnRef, 'L01-D01');
});
