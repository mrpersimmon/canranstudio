'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ratingFor,
  awardRating,
  totalRatings,
  allAtLeast
} = require('../../core/progress');

test('ratingFor exposes every branch including zero', () => {
  const bands = [
    { min: 7, rating: 3 },
    { min: 5, rating: 2 },
    { min: 1, rating: 1 }
  ];
  assert.equal(ratingFor(8, bands), 3);
  assert.equal(ratingFor(5, bands), 2);
  assert.equal(ratingFor(1, bands), 1);
  assert.equal(ratingFor(0, bands), 0);
});

test('awardRating is finite, immutable, and keeps the historic maximum', () => {
  const original = { l1: 1, l2: 0 };
  const higher = awardRating(original, 'l1', 3);
  const lower = awardRating(higher.ratings, 'l1', 2);
  const oversized = awardRating(lower.ratings, 'l2', 99);

  assert.deepEqual(original, { l1: 1, l2: 0 });
  assert.equal(higher.changed, true);
  assert.equal(lower.changed, false);
  assert.equal(oversized.ratings.l2, 3);
});

test('certificate predicates require every named challenge', () => {
  const ids = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const complete = { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 };
  const missing = { ...complete, l4: 0 };

  assert.equal(allAtLeast(complete, ids, 1), true);
  assert.equal(allAtLeast(missing, ids, 1), false);
  assert.equal(totalRatings(complete, ids), 5);
});

test('every approved course rating table reaches zero through three stars', () => {
  const tables = [
    {
      name: 'lesson49',
      bands: [{ min: 7, rating: 3 }, { min: 5, rating: 2 }, { min: 1, rating: 1 }],
      scores: [0, 1, 5, 7]
    },
    {
      name: 'lesson50',
      bands: [{ min: 7, rating: 3 }, { min: 5, rating: 2 }, { min: 1, rating: 1 }],
      scores: [0, 1, 5, 7]
    },
    {
      name: 'soundmark-vs',
      bands: [{ min: 9, rating: 3 }, { min: 7, rating: 2 }, { min: 5, rating: 1 }],
      scores: [4, 5, 7, 9]
    },
    {
      name: 'soundmark-games',
      bands: [{ min: 5, rating: 3 }, { min: 4, rating: 2 }, { min: 3, rating: 1 }],
      scores: [2, 3, 4, 5]
    }
  ];

  for (const table of tables) {
    assert.deepEqual(
      table.scores.map(score => ratingFor(score, table.bands)),
      [0, 1, 2, 3],
      table.name
    );
  }
});
