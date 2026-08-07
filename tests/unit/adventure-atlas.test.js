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
  assert.deepEqual(atlas.GOLDEN_ROUTE_PAGE.placements, {
    lesson49: { top: 3.4, left: 3.4, width: 49 },
    lesson50: { top: 18.8, right: 3.4, width: 47 },
    lesson51: { top: 40.1, left: 4.8, width: 50 },
    lesson52: { top: 67.1, right: 4.6, width: 47 }
  });
  assert.deepEqual(atlas.GOLDEN_ROUTE_PAGE.mascotPlacement, {
    width: 17,
    entranceAnchors: {
      lesson49: { left: 35, top: 22.4, flip: false },
      lesson50: { left: 45, top: 33.5, flip: true },
      lesson51: { left: 40.5, top: 58.9, flip: false },
      lesson52: { left: 40, top: 85.3, flip: true },
      'route-exit': { left: 34, top: 92.2, flip: false }
    }
  });
  assert.equal(Object.isFrozen(atlas.GOLDEN_ROUTE_PAGE), true);
  assert.equal(Object.isFrozen(atlas.GOLDEN_ROUTE_PAGE.backgroundAsset), true);
});

test('the internal review contract adds one isolated Lesson 53–56 route page', () => {
  assert.deepEqual(atlas.LANDMARK_REVIEW_ROUTE_PAGES.map(page => page.id), [
    'district5-page1', 'district5-page2-review'
  ]);
  assert.equal(atlas.LANDMARK_REVIEW_ROUTE_PAGES[0], atlas.GOLDEN_ROUTE_PAGE);
  const page = atlas.LANDMARK_REVIEW_ROUTE_PAGES[1];
  assert.equal(page.reviewOnly, true);
  assert.deepEqual(page.locationIds, ['lesson53', 'lesson54', 'lesson55', 'lesson56']);
  assert.deepEqual(Object.keys(page.placements), page.locationIds);
  assert.equal(page.canvas.width, 940);
  assert.equal(page.canvas.height, 1672);
  assert.equal(Object.isFrozen(page), true);
});

test('route pages resolve locations, fixed spreads, and non-looping neighbours', () => {
  const pages = atlas.LANDMARK_REVIEW_ROUTE_PAGES;

  assert.equal(atlas.routePageForLocation('lesson49', pages).id, 'district5-page1');
  assert.equal(atlas.routePageForLocation('lesson54', pages).id, 'district5-page2-review');
  assert.equal(atlas.routePageForLocation('soundmark', pages), null);

  const firstNeighbours = atlas.routePageNeighbors('district5-page1', pages);
  assert.equal(firstNeighbours.previous, null);
  assert.equal(firstNeighbours.next.id, 'district5-page2-review');
  const lastNeighbours = atlas.routePageNeighbors('district5-page2-review', pages);
  assert.equal(lastNeighbours.previous.id, 'district5-page1');
  assert.equal(lastNeighbours.next, null);

  assert.deepEqual(
    atlas.buildRoutePageSpread('district5-page2-review', pages).map(page => page.id),
    ['district5-page1', 'district5-page2-review']
  );

  const page3 = Object.freeze({
    id: 'district5-page3-review',
    districtId: 'first-book-49-60',
    locationIds: ['lesson57']
  });
  const laterSpread = atlas.buildRoutePageSpread(page3.id, [...pages, page3]);
  assert.equal(laterSpread[0], page3);
  assert.equal(laterSpread[1].kind, 'endpaper');
  assert.equal(Object.isFrozen(laterSpread), true);
});

test('current route-page selection follows focus, recent work, curriculum, and completed fallback', () => {
  const pages = atlas.LANDMARK_REVIEW_ROUTE_PAGES;
  const courses = catalog.MAP_COURSES;
  assert.equal(
    atlas.selectCurrentRoutePage(courses, profile(), 'lesson53', pages).id,
    'district5-page2-review'
  );
  assert.equal(
    atlas.selectCurrentRoutePage(courses, profile({
      lastVisitedLocationId: 'lesson54',
      completedStages: { lesson54: ['l1'] }
    }), null, pages).id,
    'district5-page2-review'
  );
  assert.equal(
    atlas.selectCurrentRoutePage(courses, profile({
      completedStages: { lesson49: ['l1'] }
    }), null, pages).id,
    'district5-page1'
  );

  const allStages = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const completedStages = Object.fromEntries(
    ['lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54']
      .map(id => [id, allStages])
  );
  assert.equal(
    atlas.selectCurrentRoutePage(courses, profile({
      lastVisitedLocationId: 'lesson54',
      completedStages
    }), null, pages).id,
    'district5-page2-review'
  );
  assert.equal(
    atlas.selectCurrentRoutePage(courses, profile({ completedStages }), null, pages).id,
    'district5-page1'
  );
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
