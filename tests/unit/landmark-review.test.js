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
      atlas.LANDMARK_REVIEW_ROUTE_PAGES
    ),
    { location: 'lesson51', stage: 3, review: 'placement', viewport: 'tablet', scenario: 'journey' }
  );

  assert.deepEqual(
    review.normalizeReviewState(
      '?location=missing&stage=99&review=placement&viewport=giant',
      locations,
      atlas.LANDMARK_REVIEW_ROUTE_PAGES
    ),
    { location: 'lesson49', stage: 5, review: 'placement', viewport: 'huawei', scenario: 'journey' }
  );

  assert.deepEqual(
    review.normalizeReviewState(
      '?location=soundmark&stage=-9&review=placement&viewport=master',
      locations,
      atlas.LANDMARK_REVIEW_ROUTE_PAGES
    ),
    { location: 'soundmark', stage: 0, review: 'art', viewport: 'master', scenario: 'journey' }
  );
});

test('student preview state is shareable across five viewports and three progress scenarios', () => {
  assert.deepEqual(review.VIEWPORTS, ['iphone', 'huawei', 'tablet', 'desktop', 'master']);
  assert.deepEqual(
    review.normalizeReviewState(
      '?location=lesson54&stage=4&review=student&viewport=desktop&scenario=complete',
      locations,
      atlas.LANDMARK_REVIEW_ROUTE_PAGES
    ),
    { location: 'lesson54', stage: 4, review: 'student', viewport: 'desktop', scenario: 'complete' }
  );
  assert.equal(
    review.serializeReviewState({
      location: 'lesson54', stage: 4, review: 'student', viewport: 'desktop', scenario: 'complete'
    }),
    '?location=lesson54&stage=4&review=student&viewport=desktop&scenario=complete'
  );
  assert.equal(review.previewLayoutForSize(390, 844), 'single');
  assert.equal(review.previewLayoutForSize(768, 1024), 'single');
  assert.equal(review.previewLayoutForSize(1024, 768), 'spread');
  assert.equal(review.previewLayoutForSize(1366, 768), 'spread');
});

test('placement review resolves the page that owns the selected landmark', () => {
  assert.equal(
    review.resolveReviewRoutePage('lesson51', atlas.LANDMARK_REVIEW_ROUTE_PAGES).id,
    'district5-page1'
  );
  assert.equal(
    review.resolveReviewRoutePage('lesson53', atlas.LANDMARK_REVIEW_ROUTE_PAGES).id,
    'district5-page2-review'
  );
  assert.equal(review.resolveReviewRoutePage('soundmark', atlas.LANDMARK_REVIEW_ROUTE_PAGES), null);

  assert.deepEqual(
    review.normalizeReviewState(
      '?location=lesson53&stage=5&review=placement&viewport=tablet',
      locations,
      atlas.LANDMARK_REVIEW_ROUTE_PAGES
    ),
    { location: 'lesson53', stage: 5, review: 'placement', viewport: 'tablet', scenario: 'journey' }
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

  const secondPage = review.buildPlacementModels(
    locations,
    { location: 'lesson53', stage: 5 },
    atlas.LANDMARK_REVIEW_ROUTE_PAGES[1]
  );
  assert.deepEqual(secondPage.map(location => location.id), ['lesson53', 'lesson54']);
  assert.deepEqual(secondPage.map(location => location.stage), [5, 0]);
  assert.equal(secondPage.some(location => ['lesson55', 'lesson56'].includes(location.id)), false);
});

test('student preview scenarios deterministically stage every published route landmark', () => {
  const journey = review.buildStudentPreviewModels(
    locations,
    { location: 'lesson53', stage: 3, scenario: 'journey' },
    atlas.LANDMARK_REVIEW_ROUTE_PAGES
  );
  assert.deepEqual(journey.map(model => model.id), [
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54'
  ]);
  assert.deepEqual(journey.map(model => model.stage), [5, 5, 5, 5, 3, 0]);
  assert.equal(journey.find(model => model.id === 'lesson53').current, true);
  assert.equal(journey.every(model => model.placement), true);
  assert.equal(Object.isFrozen(journey), true);

  const initial = review.buildStudentPreviewModels(
    locations,
    { location: 'lesson53', stage: 3, scenario: 'initial' },
    atlas.LANDMARK_REVIEW_ROUTE_PAGES
  );
  assert.deepEqual(initial.map(model => model.stage), [0, 0, 0, 0, 0, 0]);

  const complete = review.buildStudentPreviewModels(
    locations,
    { location: 'lesson53', stage: 0, scenario: 'complete' },
    atlas.LANDMARK_REVIEW_ROUTE_PAGES
  );
  assert.deepEqual(complete.map(model => model.stage), [5, 5, 5, 5, 5, 5]);
});
