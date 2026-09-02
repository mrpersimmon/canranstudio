'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/curriculum-catalog');
const runtime = require('../../core/story-stage-runtime');

const unit = catalog.getTeachingUnit('NCE-U02');

function stateAt(stageIndex, details = {}) {
  const completedStageIds = unit.experience.stages
    .slice(0, stageIndex)
    .map(stage => stage.stageId);
  return runtime.createInitialState(unit, {
    currentStageId: unit.experience.stages[stageIndex].stageId,
    completedStageIds,
    ...details
  });
}

function endPending(state) {
  assert.ok(state.pendingAudio, 'expected one pending audio request');
  return runtime.reduce(unit, state, {
    type: 'AUDIO_ENDED',
    requestId: state.pendingAudio.requestId
  });
}

function runRole(state, roleId, assigned = false) {
  const originStageId = runtime.getStage(unit, state).stageId;
  state = runtime.reduce(unit, state, assigned
    ? { type: 'START_ASSIGNED_ROLE' }
    : { type: 'SELECT_ROLE', roleId });
  let guard = 100;
  while (
    runtime.getStage(unit, state).stageId === originStageId
    && !['stage-complete', 'unit-complete', 'replay-complete', 'makeup-complete'].includes(state.phase)
    && guard > 0
  ) {
    guard -= 1;
    if (state.phase === 'audio-playing') state = endPending(state);
    else if (state.phase === 'awaiting-response') {
      state = runtime.reduce(unit, state, { type: 'PLAY_ROLE_LINE' });
    } else {
      assert.fail(`unexpected role phase ${state.phase}`);
    }
  }
  assert.ok(guard > 0, 'role enactment must terminate');
  return state;
}

test('Lesson 3–4 starts at S01 and naturally enters S02 after the current audio ends', () => {
  let state = runtime.createInitialState(unit);
  state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
  const currentRequestId = state.pendingAudio.requestId;

  const stale = runtime.reduce(unit, state, {
    type: 'AUDIO_ENDED',
    requestId: currentRequestId + 100
  });
  assert.equal(stale, state);

  state = runtime.reduce(unit, state, { type: 'AUDIO_ENDED', requestId: currentRequestId });
  assert.equal(state.phase, 'stage-ready');
  assert.deepEqual(state.completedStageIds, ['NCE-U02-S01']);
  assert.ok(state.contactedSourceRefs.includes('L03-W10'));
  assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S02');
});

test('S02 keeps the comprehension answer locked until the twelve-line sequence ends', () => {
  let state = stateAt(1);
  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'returned' });
  assert.equal(state.phase, 'stage-ready');

  state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
  assert.equal(state.pendingAudio.audioRefs.length, 12);
  state = endPending(state);
  assert.equal(state.phase, 'awaiting-response');

  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'not-returned' });
  assert.equal(state.phase, 'awaiting-response');
  assert.equal(state.stageData.supportLevel, 1);

  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'returned' });
  assert.equal(state.phase, 'audio-playing');
  state = endPending(state);
  assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S03');
  assert.equal(state.phase, 'awaiting-response');
  assert.ok(state.evidenceRecords.some(record => record.sourceRef === 'L03-D12'));
});

test('S05 completes two umbrella judgements on one stage without an interstitial stage', () => {
  let state = stateAt(4);
  assert.equal(state.stageData.roundIndex, 0);

  state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
  state = endPending(state);
  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'no' });
  state = endPending(state);
  assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S05');
  assert.equal(state.stageData.roundIndex, 1);
  assert.equal(state.phase, 'stage-ready');

  state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
  state = endPending(state);
  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'yes' });
  state = endPending(state);
  assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S06');
  assert.equal(state.phase, 'awaiting-response');
  assert.ok(state.completedStageIds.includes('NCE-U02-S05'));
});

test('S07 contacts fifteen prompts in three groups but requires only one retrieval per group', () => {
  let state = stateAt(6);
  const stage = runtime.getStage(unit, state);
  assert.equal(state.phase, 'stage-ready');

  for (const [groupIndex, group] of stage.groups.entries()) {
    state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
    assert.deepEqual(state.pendingAudio.audioRefs, group.sourceRefs);
    state = endPending(state);
    assert.deepEqual(state.pendingAudio.audioRefs, [group.retrievalSourceRef]);
    state = endPending(state);
    assert.equal(state.phase, 'awaiting-response');
    assert.ok(group.sourceRefs.every(sourceRef => state.contactedSourceRefs.includes(sourceRef)));

    state = runtime.reduce(unit, state, { type: 'ANSWER', entityId: group.acceptedEntityId });
    assert.deepEqual(state.pendingAudio.audioRefs, [group.retrievalSourceRef]);
    state = endPending(state);
    if (groupIndex < stage.groups.length - 1) {
      assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S07');
      assert.equal(state.stageData.activeGroupIndex, groupIndex + 1);
      assert.equal(state.phase, 'stage-ready');
    }
  }

  assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S08');
  assert.deepEqual(
    state.evidenceRecords.filter(record => record.stageId === 'NCE-U02-S07').map(record => record.sourceRef),
    ['L04-P03', 'L04-P08', 'L04-P12']
  );
});

test('S06 and S10 assign complementary roles and finish only after all turns end', () => {
  let first = stateAt(5);
  first = runRole(first, 'visitor');
  assert.equal(runtime.getStage(unit, first).stageId, 'NCE-U02-S07');
  assert.equal(first.phase, 'stage-ready');
  assert.deepEqual(first.completedRoleIds, ['visitor']);
  assert.equal(first.firstRoleId, 'visitor');

  let second = stateAt(9, {
    firstRoleId: first.firstRoleId,
    completedRoleIds: first.completedRoleIds
  });
  assert.equal(second.phase, 'role-ready');
  assert.equal(second.stageData.roleId, 'cloakroom-attendant');
  second = runRole(second, null, true);
  assert.equal(second.phase, 'unit-complete');
  assert.deepEqual(new Set(second.completedRoleIds), new Set(runtime.roleIds(unit)));
  const progress = runtime.serialize(unit, second);
  assert.equal(typeof progress.journey.completedAt, 'string');
  assert.equal(Number.isNaN(Date.parse(progress.journey.completedAt)), false);
});

test('refresh-safe progress keeps only reached catalog stages and stable evidence', () => {
  const state = stateAt(3, {
    currentStageId: 'NCE-U02-S10',
    completedStageIds: ['NCE-U02-S01', 'NCE-U02-S02', 'unknown-stage'],
    contactedSourceRefs: ['L03-W10', 'L03-W10']
  });
  assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S03');
  assert.deepEqual(state.completedStageIds, ['NCE-U02-S01', 'NCE-U02-S02']);
  assert.deepEqual(state.contactedSourceRefs, ['L03-W10']);

  const serialized = runtime.serialize(unit, state);
  assert.equal(serialized.revision, 'lesson3-4-v2');
  assert.equal(serialized.currentStageId, 'NCE-U02-S03');
  assert.equal(Object.hasOwn(serialized, 'pendingAudio'), false);
  assert.equal(Object.hasOwn(serialized, 'stageData'), false);
});

test('a completed refresh always restores the completion page at the final marker', () => {
  const completedStageIds = unit.experience.stages.map(stage => stage.stageId);
  const state = runtime.createInitialState(unit, {
    currentStageId: 'NCE-U02-S03',
    completedStageIds,
    completedRoleIds: ['visitor', 'cloakroom-attendant']
  });
  assert.equal(state.phase, 'unit-complete');
  assert.equal(state.currentStageIndex, unit.experience.stages.length - 1);
});

test('failed audio never completes a stage and retry receives a fresh request id', () => {
  let state = runtime.createInitialState(unit);
  state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
  const firstRequest = state.pendingAudio.requestId;
  state = runtime.reduce(unit, state, { type: 'AUDIO_FAILED', requestId: firstRequest });
  assert.equal(state.phase, 'audio-failed');
  assert.deepEqual(state.completedStageIds, []);

  state = runtime.reduce(unit, state, { type: 'RETRY_AUDIO' });
  assert.equal(state.phase, 'audio-playing');
  assert.ok(state.pendingAudio.requestId > firstRequest);
  assert.deepEqual(state.pendingAudio.audioRefs, ['L03-W10']);
});

test('formal mistakes spend hearts, zero starts a changed-example rescue, and assisted evidence stays honest', () => {
  let state = stateAt(3);
  assert.equal(state.adventureHeartsRemaining, 3);

  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'mine' });
  assert.equal(state.adventureHeartsRemaining, 2);
  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'mine' });
  assert.equal(state.adventureHeartsRemaining, 1);
  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'mine' });
  assert.equal(state.phase, 'rescue-ready');
  assert.equal(state.adventureHeartsRemaining, 0);

  state = runtime.reduce(unit, state, { type: 'START_RESCUE' });
  assert.equal(state.phase, 'audio-playing');
  assert.deepEqual(state.pendingAudio.audioRefs, unit.experience.rescueExample.audioRefs);
  state = endPending(state);
  assert.equal(state.phase, 'awaiting-response');
  assert.equal(state.adventureHeartsRemaining, 3);
  assert.equal(state.stageData.wrongAttempts, 0);
  assert.equal(state.stageData.assisted, true);

  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'not-mine' });
  state = endPending(state);
  const result = state.evidenceRecords.find(record => record.stageId === 'NCE-U02-S04');
  assert.equal(result.result, 'assisted');
});

test('each role round can be truthfully skipped, assigns the complementary role, and remains available for makeup', () => {
  let first = stateAt(5);
  first = runtime.reduce(unit, first, { type: 'SELECT_ROLE', roleId: 'visitor' });
  first = runtime.reduce(unit, first, { type: 'SKIP_ROLE' });
  assert.equal(runtime.getStage(unit, first).stageId, 'NCE-U02-S07');
  assert.deepEqual(first.skippedStageIds, ['NCE-U02-S06']);
  assert.deepEqual(first.completedRoleIds, []);
  assert.deepEqual(first.roleStageDispositions['NCE-U02-S06'], {
    status: 'skipped', roleId: 'visitor'
  });

  let second = stateAt(9, {
    skippedStageIds: first.skippedStageIds,
    roleStageDispositions: first.roleStageDispositions,
    firstRoleId: first.firstRoleId
  });
  assert.equal(second.stageData.roleId, 'cloakroom-attendant');
  second = runtime.reduce(unit, second, { type: 'SKIP_ROLE' });
  assert.equal(second.phase, 'unit-complete');
  assert.deepEqual(new Set(second.skippedStageIds), new Set(['NCE-U02-S06', 'NCE-U02-S10']));
  assert.deepEqual(second.completedRoleIds, []);

  second = runtime.reduce(unit, second, { type: 'NAVIGATE_STAGE', stageId: 'NCE-U02-S06' });
  assert.equal(second.navigationSession.mode, 'makeup');
  second = runRole(second, 'visitor');
  assert.equal(second.phase, 'makeup-complete');
  assert.equal(second.skippedStageIds.includes('NCE-U02-S06'), false);
  assert.equal(second.completedStageIds.includes('NCE-U02-S06'), true);
  second = runtime.reduce(unit, second, { type: 'EXIT_STAGE_SESSION' });
  assert.equal(second.phase, 'unit-complete');
});

test('completed-stage replay is isolated and restores the exact active mainline state', () => {
  let state = stateAt(3);
  state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'mine' });
  const origin = runtime.serialize(unit, state);
  const originStageData = structuredClone(state.stageData);

  state = runtime.reduce(unit, state, { type: 'NAVIGATE_STAGE', stageId: 'NCE-U02-S01' });
  assert.equal(state.navigationSession.mode, 'replay');
  assert.equal(state.adventureHeartsRemaining, 3);
  state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
  state = endPending(state);
  assert.equal(state.phase, 'replay-complete');
  assert.deepEqual(runtime.serialize(unit, state), origin);

  state = runtime.reduce(unit, state, { type: 'EXIT_STAGE_SESSION' });
  assert.equal(runtime.getStage(unit, state).stageId, 'NCE-U02-S04');
  assert.equal(state.adventureHeartsRemaining, 2);
  assert.deepEqual(state.stageData, originStageData);
});

test('serialized completion separates journey resolution, first-session evidence, and unassessed mastery', () => {
  const allStages = unit.experience.stages.map(stage => stage.stageId);
  const state = runtime.createInitialState(unit, {
    completedStageIds: allStages.filter(stageId => stageId !== 'NCE-U02-S06'),
    skippedStageIds: ['NCE-U02-S06'],
    roleStageDispositions: {
      'NCE-U02-S06': { status: 'skipped', roleId: 'visitor' },
      'NCE-U02-S10': { status: 'completed', roleId: 'cloakroom-attendant' }
    }
  });
  assert.equal(state.phase, 'unit-complete');
  const progress = runtime.serialize(unit, state);
  assert.equal(progress.journey.status, 'resolved');
  assert.deepEqual(progress.journey.skippedStageIds, ['NCE-U02-S06']);
  assert.equal(progress.firstSession.status, 'recorded');
  assert.equal(progress.longTermMastery.status, 'not-assessed');
});
