'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const atlas = require('../../core/adventure-atlas');
const review = require('../../poc/landmark-review/landmark-review');

const locations = review.getReviewLocations(catalog);

test('review locations come from every complete published map contract', () => {
  assert.deepEqual(locations.map(location => location.id), [
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark'
  ]);
  assert.deepEqual(locations.map(location => location.stateAssets.length), [6, 6, 6, 6, 6, 6, 5]);
  assert.equal(Object.isFrozen(locations), true);
});

test('query state restores a valid review and safely normalizes invalid values', () => {
  assert.deepEqual(
    review.normalizeReviewState(
      '?location=lesson51&stage=3&review=placement&viewport=tablet',
      locations,
      atlas.GOLDEN_ROUTE_PAGE
    ),
    { location: 'lesson51', stage: 3, review: 'placement', viewport: 'tablet' }
  );

  assert.deepEqual(
    review.normalizeReviewState(
      '?location=missing&stage=99&review=placement&viewport=giant',
      locations,
      atlas.GOLDEN_ROUTE_PAGE
    ),
    { location: 'lesson49', stage: 5, review: 'placement', viewport: 'huawei' }
  );

  assert.deepEqual(
    review.normalizeReviewState(
      '?location=soundmark&stage=-9&review=placement&viewport=master',
      locations,
      atlas.GOLDEN_ROUTE_PAGE
    ),
    { location: 'soundmark', stage: 0, review: 'art', viewport: 'master' }
  );
});

test('stage labels and serialized URLs adapt to each location contract', () => {
  assert.deepEqual(review.stageLabels(locations[0]), ['初始', '1', '2', '3', '4', '完成']);
  assert.deepEqual(review.stageLabels(locations.at(-1)), ['初始', '1', '2', '3', '完成']);
  assert.equal(
    review.serializeReviewState({
      location: 'lesson51', stage: 3, review: 'art', viewport: 'huawei'
    }),
    '?location=lesson51&stage=3&review=art&viewport=huawei'
  );
});

test('placement review changes only the selected location and never invents new placements', () => {
  const placed = review.buildPlacementModels(
    locations,
    { location: 'lesson51', stage: 4 },
    atlas.GOLDEN_ROUTE_PAGE
  );

  assert.deepEqual(placed.map(location => location.id), [
    'lesson49', 'lesson50', 'lesson51', 'lesson52'
  ]);
  assert.deepEqual(placed.map(location => location.stage), [0, 0, 4, 0]);
  assert.equal(placed.some(location => location.id === 'lesson53'), false);
  assert.equal(placed.every(location => location.placement), true);
});
