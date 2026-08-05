'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const atlas = require('../../core/adventure-atlas');

function profile(overrides = {}) {
  return {
    version: 2,
    currentDistrictId: catalog.LAUNCH_DISTRICT.id,
    lastVisitedLocationId: null,
    souvenirs: [],
    completedStages: {},
    pendingMapChanges: {},
    ...overrides
  };
}

test('only complete publication contracts become visible single-state landmarks', () => {
  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const lesson55 = catalog.COURSES.find(course => course.id === 'lesson55');
  const [published, drawing] = atlas.buildLocationModels(
    [lesson49, lesson55],
    profile({ completedStages: { lesson49: ['l2', 'l4'] } })
  );

  assert.equal(published.status, 'published');
  assert.equal(published.landmarkMode, 'states');
  assert.equal(published.baseAsset, null);
  assert.equal(published.landmarkAsset.stageCount, 2);
  assert.equal(published.landmarkAsset.png, 'assets/adventure-map/lesson49/states/state-2.png');
  assert.equal(
    published.landmarkAsset.variants[0].avif,
    'assets/adventure-map/lesson49/states/state-2-512.avif'
  );
  assert.deepEqual(published.completedStageIds, ['l2', 'l4']);
  assert.equal('visibleGrowthAssets' in published, false);
  assert.deepEqual(published.progressStamps.map(stamp => stamp.earned), [false, true, false, true, false]);
  assert.equal(drawing.status, 'drawing');
  assert.equal(drawing.route, null);
  assert.equal(drawing.baseAsset, null);
  assert.equal(Object.isFrozen(published), true);
});

test('soundmark remains a four-stage side quest without a fabricated fifth stamp', () => {
  const soundmark = catalog.COURSES.find(course => course.id === 'soundmark');
  const model = atlas.buildLocationModels([soundmark], profile({
    completedStages: { soundmark: ['vs', 'g2'] }
  }))[0];

  assert.equal(model.kind, 'special');
  assert.equal(model.lesson, null);
  assert.equal(model.totalStageCount, 4);
  assert.deepEqual(model.progressStamps.map(stamp => stamp.id), ['vs', 'g1', 'g2', 'g3']);
  assert.deepEqual(model.progressStamps.map(stamp => stamp.earned), [true, false, true, false]);
});

test('recommendation uses last unfinished visit, then earliest unstarted, and none after completion', () => {
  const courses = ['lesson49', 'lesson50'].map(id => catalog.COURSES.find(course => course.id === id));
  const models = atlas.buildLocationModels(courses, profile({
    lastVisitedLocationId: 'lesson50',
    completedStages: { lesson49: [], lesson50: ['l1'] }
  }));
  assert.equal(atlas.selectRecommendedLocation(models, { lastVisitedLocationId: 'lesson50' }).id, 'lesson50');

  const withoutRecent = atlas.buildLocationModels(courses, profile({
    completedStages: { lesson49: [], lesson50: ['l1'] }
  }));
  assert.equal(atlas.selectRecommendedLocation(withoutRecent, {}).id, 'lesson49');

  const complete = atlas.buildLocationModels(courses, profile({
    completedStages: {
      lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'],
      lesson50: ['l1', 'l2', 'l3', 'l4', 'l5']
    }
  }));
  assert.equal(atlas.selectRecommendedLocation(complete, {}), null);
  assert.equal(atlas.selectRecommendedLocation([], {}), null);
});

test('the approved golden route page contains exactly Lessons 49–52 in curriculum order', () => {
  const models = atlas.buildRoutePageLocationModels(catalog.MAP_COURSES, profile());

  assert.deepEqual(models.map(model => model.id), [
    'lesson49', 'lesson50', 'lesson51', 'lesson52'
  ]);
  assert.equal(atlas.GOLDEN_ROUTE_PAGE.canvas.width, 940);
  assert.equal(atlas.GOLDEN_ROUTE_PAGE.canvas.height, 1672);
  assert.equal(Object.isFrozen(atlas.GOLDEN_ROUTE_PAGE), true);
  assert.equal(Object.isFrozen(atlas.GOLDEN_ROUTE_PAGE.backgroundAsset), true);
});

test('the explorer cat follows a focused course, then the next adventure, then the route exit', () => {
  const focusedModels = atlas.buildRoutePageLocationModels(catalog.MAP_COURSES, profile({
    lastVisitedLocationId: 'lesson50'
  }));
  assert.equal(
    atlas.selectRouteAvatarTarget(focusedModels, 'lesson51', { lastVisitedLocationId: 'lesson50' }),
    'lesson51'
  );
  assert.equal(
    atlas.selectRouteAvatarTarget(focusedModels, null, { lastVisitedLocationId: 'lesson50' }),
    'lesson50'
  );

  const complete = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const completedModels = atlas.buildRoutePageLocationModels(catalog.MAP_COURSES, profile({
    completedStages: {
      lesson49: complete,
      lesson50: complete,
      lesson51: complete,
      lesson52: complete
    }
  }));
  assert.equal(atlas.selectRouteAvatarTarget(completedModels, null, {}), 'route-exit');
  assert.equal(atlas.selectRouteAvatarTarget([], null, {}), null);
});

test('pending map changes collapse into one child-readable summary', () => {
  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const growing = atlas.buildLocationModels([lesson49], profile({
    completedStages: { lesson49: ['l1', 'l2', 'l3'] },
    pendingMapChanges: { lesson49: ['l1', 'l3'] }
  }))[0];
  assert.deepEqual(atlas.buildMapChangeSummary(growing), {
    courseId: 'lesson49',
    stageIds: ['l1', 'l3'],
    count: 2,
    complete: false,
    copy: '这里新增了 2 处变化'
  });

  const complete = atlas.buildLocationModels([lesson49], profile({
    completedStages: { lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'] },
    pendingMapChanges: { lesson49: ['l4', 'l5'] },
    souvenirs: ['food-basket']
  }))[0];
  assert.equal(atlas.buildMapChangeSummary(complete).copy, '地点完成');
  assert.deepEqual(complete.souvenir, lesson49.map.souvenir);
});
