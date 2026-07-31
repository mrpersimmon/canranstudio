'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { completionState } = require('../../core/certificate-gate');

const LESSON_TARGETS = [
  { id: 'l1', selector: '#l1', label: '单词' },
  { id: 'l2', selector: '#l2', label: '课文' },
  { id: 'l3', selector: '#l3', label: '句型' },
  { id: 'l4', selector: '#l4', label: '语法' },
  { id: 'l5', selector: '#l5', label: '考核' }
];

test('numbered lesson requires fifteen stars and reports the first incomplete target', () => {
  const state = completionState(
    { l1: 3, l2: 2, l3: 3, l4: 0, l5: 3 },
    LESSON_TARGETS
  );
  assert.equal(state.eligible, false);
  assert.equal(state.earnedStars, 11);
  assert.equal(state.maxStars, 15);
  assert.equal(state.missingStars, 4);
  assert.equal(state.incompleteCount, 2);
  assert.equal(state.firstIncomplete.id, 'l2');
  assert.equal(state.firstIncomplete.label, '课文');
});

test('only three stars in every numbered target is eligible', () => {
  assert.equal(completionState(
    { l1: 3, l2: 3, l3: 3, l4: 3, l5: 2 },
    LESSON_TARGETS
  ).eligible, false);
  assert.equal(completionState(
    { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 },
    LESSON_TARGETS
  ).eligible, true);
});

test('soundmark requires twelve stars', () => {
  const targets = ['vs', 'g1', 'g2', 'g3'].map(id => ({
    id, selector: `#${id}`, label: id
  }));
  assert.equal(completionState({ vs: 3, g1: 3, g2: 3, g3: 2 }, targets).eligible, false);
  assert.equal(completionState({ vs: 3, g1: 3, g2: 3, g3: 3 }, targets).eligible, true);
});

test('missing and malformed ratings safely normalize to zero through three', () => {
  const state = completionState(
    { l1: 999, l2: 2.9, l3: '3', l4: Infinity, l5: -4 },
    LESSON_TARGETS
  );
  assert.equal(state.earnedStars, 5);
  assert.equal(state.missingStars, 10);
  assert.equal(state.incompleteCount, 4);
  assert.equal(state.firstIncomplete.id, 'l2');
});
