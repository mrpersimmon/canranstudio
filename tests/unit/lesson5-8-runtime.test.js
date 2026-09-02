'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/curriculum-catalog');
const runtime = require('../../core/story-stage-runtime');

const units = ['NCE-U03', 'NCE-U04'].map(unitId => catalog.getTeachingUnit(unitId));

function stateAt(unit, stageIndex, details = {}) {
  return runtime.createInitialState(unit, {
    currentStageId: unit.experience.stages[stageIndex].stageId,
    completedStageIds: unit.experience.stages.slice(0, stageIndex).map(stage => stage.stageId),
    ...details
  });
}

function endPending(unit, state) {
  assert.ok(state.pendingAudio);
  return runtime.reduce(unit, state, {
    type: 'AUDIO_ENDED', requestId: state.pendingAudio.requestId
  });
}

function runRole(unit, state, roleId) {
  state = runtime.reduce(unit, state, { type: 'SELECT_ROLE', roleId });
  for (let guard = 0; guard < 100; guard += 1) {
    if (['stage-complete', 'unit-complete'].includes(state.phase)) return state;
    if (state.phase === 'audio-playing') state = endPending(unit, state);
    else if (state.phase === 'awaiting-response') {
      state = runtime.reduce(unit, state, { type: 'PLAY_ROLE_LINE' });
    } else assert.fail(`unexpected role phase ${state.phase}`);
  }
  assert.fail('role enactment did not terminate');
}

for (const unit of units) {
  test(`${unit.unitLabel} locks the diagnostic answer until the full dialogue ends`, () => {
    let state = runtime.createInitialState(unit);
    assert.equal(state.phase, 'stage-ready');
    const locked = runtime.reduce(unit, state, { type: 'ANSWER', optionId: 'wrong' });
    assert.equal(locked, state);

    state = runtime.reduce(unit, state, { type: 'PLAY_PRIMARY' });
    assert.equal(state.pendingAudio.audioRefs.length, unit.lessonIds[0] === 'lesson5' ? 20 : 16);
    const stale = runtime.reduce(unit, state, {
      type: 'AUDIO_ENDED', requestId: state.pendingAudio.requestId + 1
    });
    assert.equal(stale, state);
    state = endPending(unit, state);
    assert.equal(state.phase, 'awaiting-response');

    const accepted = unit.experience.stages[0].answerRule.acceptedOptionId;
    state = runtime.reduce(unit, state, { type: 'ANSWER', optionId: accepted });
    state = endPending(unit, state);
    assert.equal(state.phase, 'stage-complete');
    assert.equal(state.completedStageIds[0], unit.experience.stages[0].stageId);
  });

  test(`${unit.unitLabel} album requires every catalog-owned item`, () => {
    const stageIndex = unit.experience.stages.findIndex(stage => stage.kind === 'prompt-album');
    let state = stateAt(unit, stageIndex);
    const refs = unit.experience.stages[stageIndex].groups.flatMap(group => group.sourceRefs);
    for (const [index, sourceRef] of refs.entries()) {
      state = runtime.reduce(unit, state, { type: 'PLAY_ALBUM_ITEM', sourceRef });
      state = endPending(unit, state);
      assert.equal(
        state.phase,
        index === refs.length - 1 ? 'stage-complete' : 'awaiting-response'
      );
    }
    assert.ok(refs.every(sourceRef => state.contactedSourceRefs.includes(sourceRef)));
  });

  test(`${unit.unitLabel} role sequence uses roles declared by the unit`, () => {
    const stageIndex = unit.experience.stages.findIndex(stage => stage.kind === 'role-enactment');
    const stage = unit.experience.stages[stageIndex];
    let state = stateAt(unit, stageIndex);
    state = runRole(unit, state, stage.roles[0]);
    assert.equal(state.phase, 'stage-complete');
    assert.deepEqual(state.completedRoleIds, [stage.roles[0]]);
    assert.deepEqual(new Set(runtime.roleIds(unit)), new Set(stage.roles));
  });

  test(`${unit.unitLabel} restore is revision-scoped and completion-safe`, () => {
    const complete = runtime.createInitialState(unit, {
      currentStageId: unit.experience.stages[2].stageId,
      completedStageIds: unit.experience.stages.map(stage => stage.stageId),
      completedRoleIds: runtime.roleIds(unit)
    });
    assert.equal(complete.phase, 'unit-complete');
    assert.equal(complete.currentStageIndex, 9);

    const serialized = runtime.serialize(unit, complete);
    assert.equal(serialized.revision, unit.experienceRevision);
    assert.equal(Object.hasOwn(serialized, 'pendingAudio'), false);
    assert.equal(Object.hasOwn(serialized, 'stageData'), false);
  });
}
