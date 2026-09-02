'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/curriculum-catalog');
const review = require('../../core/story-review-runtime');

const unit = catalog.getTeachingUnit('NCE-U02');

function endPending(state) {
  return review.reduce(unit, state, {
    type: 'AUDIO_ENDED',
    requestId: state.pendingAudio.requestId
  });
}

test('Lesson 3–4 review owns an isolated three-heart run and records mastery only after completion', () => {
  let state = review.createInitialState(unit);
  assert.equal(state.phase, 'entry');
  assert.equal(state.heartsRemaining, 3);

  state = review.reduce(unit, state, { type: 'START' });
  assert.equal(state.phase, 'audio-ready');
  for (const item of unit.experience.reviewRun.items) {
    state = review.reduce(unit, state, { type: 'PLAY_AUDIO' });
    assert.deepEqual(state.pendingAudio.audioRefs, [item.sourceRef]);
    state = endPending(state);
    const response = item.acceptedEntityId
      ? { type: 'ANSWER', entityId: item.acceptedEntityId }
      : { type: 'ANSWER', optionId: item.acceptedOptionId };
    state = review.reduce(unit, state, response);
  }
  assert.equal(state.phase, 'complete');
  assert.equal(state.results.length, 3);
  assert.equal(review.serialize(unit, state).longTermMastery.status, 'reviewed-independent');
});

test('review rescue restarts the entire run with a changed example and cannot alter lesson hearts', () => {
  let state = review.reduce(unit, review.createInitialState(unit), { type: 'START' });
  state = review.reduce(unit, state, { type: 'PLAY_AUDIO' });
  state = endPending(state);
  for (let count = 0; count < 3; count += 1) {
    state = review.reduce(unit, state, { type: 'ANSWER', entityId: 'book' });
  }
  assert.equal(state.phase, 'rescue-ready');
  assert.equal(state.heartsRemaining, 0);

  state = review.reduce(unit, state, { type: 'START_RESCUE' });
  assert.deepEqual(state.pendingAudio.audioRefs, unit.experience.rescueExample.audioRefs);
  state = endPending(state);
  assert.equal(state.phase, 'audio-ready');
  assert.equal(state.currentIndex, 0);
  assert.equal(state.heartsRemaining, 3);
  assert.equal(state.rescueUsed, true);
  assert.deepEqual(state.results, []);
  assert.equal(Object.hasOwn(review.serialize(unit, state), 'adventureHeartsRemaining'), false);
});

test('review audio failure is fail-closed and retry receives a new request id', () => {
  let state = review.reduce(unit, review.createInitialState(unit), { type: 'START' });
  state = review.reduce(unit, state, { type: 'PLAY_AUDIO' });
  const requestId = state.pendingAudio.requestId;
  state = review.reduce(unit, state, { type: 'AUDIO_FAILED', requestId });
  assert.equal(state.phase, 'audio-failed');
  assert.equal(state.currentIndex, 0);
  state = review.reduce(unit, state, { type: 'RETRY_AUDIO' });
  assert.ok(state.pendingAudio.requestId > requestId);
});

test('cross-day review opens only after a resolved journey reaches the next local calendar day', () => {
  const completionTime = new Date(2026, 8, 2, 20, 30, 0);
  const progress = {
    revision: unit.experienceRevision,
    journey: {
      status: 'resolved',
      completedAt: completionTime.toISOString()
    }
  };

  assert.equal(review.isEligible(unit, progress, new Date(2026, 8, 2, 23, 59, 59)), false);
  assert.equal(review.isEligible(unit, progress, new Date(2026, 8, 3, 0, 0, 0)), true);
  assert.equal(review.isEligible(unit, { ...progress, revision: 'stale-revision' }, new Date(2026, 8, 3)), false);
  assert.equal(review.isEligible(unit, { ...progress, journey: { status: 'in-progress' } }, new Date(2026, 8, 3)), false);
});
