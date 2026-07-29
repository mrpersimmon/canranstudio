'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createAttempt,
  submitAttempt,
  shuffleOptions
} = require('../../core/assessment');

test('a wrong answer followed by a correct retry solves without scoring', () => {
  const wrong = submitAttempt(createAttempt(), false);
  const corrected = submitAttempt(wrong.state, true);

  assert.equal(wrong.scored, false);
  assert.equal(wrong.state.firstTry, false);
  assert.equal(corrected.solved, true);
  assert.equal(corrected.scored, false);
});

test('a first-try correct answer scores exactly once', () => {
  const correct = submitAttempt(createAttempt(), true);
  const duplicate = submitAttempt(correct.state, true);

  assert.equal(correct.scored, true);
  assert.equal(duplicate.accepted, false);
  assert.equal(duplicate.scored, false);
});

test('shuffleOptions keeps semantic identity independent of output position', () => {
  const values = [0, 0, 0];
  const entries = shuffleOptions(['A', 'B', 'C', 'D'], 2, () => values.shift() ?? 0);
  const correct = entries.find(entry => entry.correct);

  assert.equal(correct.id, 2);
  assert.equal(correct.text, 'C');
  assert.notEqual(entries.indexOf(correct), correct.id);
});
