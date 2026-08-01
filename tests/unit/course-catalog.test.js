'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const catalog = require('../../core/course-catalog');

function assertDeepFrozen(value) {
  if (!value || typeof value !== 'object') return;
  assert.equal(Object.isFrozen(value), true);
  for (const nested of Object.values(value)) assertDeepFrozen(nested);
}

test('course catalog is the complete immutable contract for lessons and special courses', () => {
  assert.deepEqual(
    catalog.COURSES.map(course => [course.id, course.kind, course.lesson, course.courseStatus]),
    [
      ['lesson49', 'lesson', 49, 'published'],
      ['lesson50', 'lesson', 50, 'published'],
      ['lesson51', 'lesson', 51, 'published'],
      ['lesson52', 'lesson', 52, 'published'],
      ['lesson53', 'lesson', 53, 'planned'],
      ['lesson54', 'lesson', 54, 'published'],
      ['lesson55', 'lesson', 55, 'planned'],
      ['lesson56', 'lesson', 56, 'planned'],
      ['lesson57', 'lesson', 57, 'planned'],
      ['lesson58', 'lesson', 58, 'planned'],
      ['lesson59', 'lesson', 59, 'planned'],
      ['lesson60', 'lesson', 60, 'planned'],
      ['soundmark', 'special', null, 'published']
    ]
  );

  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  assert.deepEqual(
    {
      route: lesson49.route,
      entry: lesson49.entry,
      assetDirectories: lesson49.assetDirectories,
      progress: lesson49.progress,
      districtId: lesson49.map.districtId,
      declaredStatus: lesson49.map.declaredStatus,
      stages: lesson49.map.stages.map(stage => stage.progressId),
      souvenir: lesson49.map.souvenir
    },
    {
      route: '/lesson49/',
      entry: 'lesson49/index.html',
      assetDirectories: ['lesson49/audio'],
      progress: {
        key: 'canran:l49:progress:v2',
        legacyKey: 'l49-stars-v1',
        ids: ['l1', 'l2', 'l3', 'l4', 'l5'],
        legacyMode: 'ratings',
        max: 15
      },
      districtId: 'first-book-49-60',
      declaredStatus: 'drawing',
      stages: ['l1', 'l2', 'l3', 'l4', 'l5'],
      souvenir: {
        id: 'food-basket',
        title: '食物篮子',
        asset: null
      }
    }
  );

  const soundmark = catalog.COURSES.find(course => course.id === 'soundmark');
  assert.deepEqual(soundmark.progress.ids, ['vs', 'g1', 'g2', 'g3']);
  assert.equal(soundmark.map.declaredStatus, 'not-applicable');
  assert.equal(soundmark.map.districtId, null);

  assertDeepFrozen(catalog.COURSES);
});

test('learning locations stay drawing and non-navigable until the full publication contract is met', () => {
  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const drawing = catalog.assessLearningLocation(lesson49);
  assert.deepEqual(
    {
      status: drawing.status,
      route: drawing.route,
      recommendable: drawing.recommendable,
      missing: drawing.missing
    },
    {
      status: 'drawing',
      route: null,
      recommendable: false,
      missing: [
        'baseLandmark',
        'growthLayers',
        'souvenir',
        'mobilePreview',
        'regressionVerification'
      ]
    }
  );

  const complete = structuredClone(lesson49);
  complete.map.declaredStatus = 'published';
  complete.map.baseAsset = 'assets/adventure-map/lesson49/base.png';
  complete.map.stages = complete.map.stages.map((stage, index) => ({
    ...stage,
    growthAsset: `assets/adventure-map/lesson49/growth-${index + 1}.png`
  }));
  complete.map.souvenir.asset = 'assets/adventure-map/lesson49/food-basket.png';
  complete.map.mobilePreview = 'assets/adventure-map/lesson49/mobile-preview.png';
  complete.map.regressionTest = 'tests/e2e/lesson49-map.spec.js';

  assert.deepEqual(catalog.assessLearningLocation(complete), {
    status: 'published',
    route: '/lesson49/',
    recommendable: true,
    checklist: {
      coursePage: true,
      prerecordedAudio: true,
      stageMapping: true,
      baseLandmark: true,
      growthLayers: true,
      souvenir: true,
      mobilePreview: true,
      regressionVerification: true
    },
    missing: []
  });

  const forged = structuredClone(complete);
  forged.map.baseAsset = 'README.md';
  forged.map.stages = forged.map.stages.map(stage => ({
    ...stage,
    growthAsset: 'README.md'
  }));
  forged.map.souvenir.asset = 'README.md';
  forged.map.mobilePreview = 'README.md';
  forged.map.regressionTest = 'README.md';
  assert.deepEqual(catalog.assessLearningLocation(forged).missing, [
    'baseLandmark',
    'growthLayers',
    'souvenir',
    'mobilePreview',
    'regressionVerification'
  ]);
  assert.equal(catalog.assessLearningLocation(forged).status, 'drawing');

  complete.map.mobilePreview = null;
  assert.equal(catalog.assessLearningLocation(complete).status, 'drawing');

  const soundmark = catalog.COURSES.find(course => course.id === 'soundmark');
  assert.deepEqual(catalog.assessLearningLocation(soundmark), {
    status: 'not-applicable',
    route: null,
    recommendable: false,
    checklist: null,
    missing: []
  });
});

test('catalog validation rejects duplicate routes and incomplete published locations', () => {
  assert.deepEqual(catalog.validateCatalog(catalog.COURSES), []);

  const invalid = structuredClone(catalog.COURSES);
  invalid.find(course => course.id === 'lesson49').map.declaredStatus = 'published';
  invalid.find(course => course.id === 'lesson50').route = '/lesson49/';

  assert.deepEqual(catalog.validateCatalog(invalid), [
    'lesson49: published map contract missing baseLandmark, growthLayers, souvenir, mobilePreview, regressionVerification',
    'lesson50: duplicate route /lesson49/ (already used by lesson49)'
  ]);
  assert.throws(
    () => catalog.assertValidCatalog(invalid),
    /course catalog contract failed:[\s\S]*lesson49[\s\S]*lesson50/
  );
});

test('map consumers receive only V1 learning locations from the shared catalog', () => {
  assert.deepEqual(
    catalog.MAP_COURSES.map(course => [course.id, course.lesson, course.map.districtId]),
    [
      ['lesson49', 49, 'first-book-49-60'],
      ['lesson50', 50, 'first-book-49-60'],
      ['lesson51', 51, 'first-book-49-60'],
      ['lesson52', 52, 'first-book-49-60'],
      ['lesson53', 53, 'first-book-49-60'],
      ['lesson54', 54, 'first-book-49-60'],
      ['lesson55', 55, 'first-book-49-60'],
      ['lesson56', 56, 'first-book-49-60'],
      ['lesson57', 57, 'first-book-49-60'],
      ['lesson58', 58, 'first-book-49-60'],
      ['lesson59', 59, 'first-book-49-60'],
      ['lesson60', 60, 'first-book-49-60']
    ]
  );
  assert.equal(Object.isFrozen(catalog.MAP_COURSES), true);
  assert.equal(catalog.MAP_COURSES.every(course => (
    catalog.assessLearningLocation(course).status === 'drawing' &&
    catalog.assessLearningLocation(course).route === null &&
    catalog.assessLearningLocation(course).recommendable === false
  )), true);

  const outsideV1 = structuredClone(catalog.COURSES.find(course => course.id === 'lesson56'));
  outsideV1.id = 'lesson61';
  outsideV1.lesson = 61;
  outsideV1.map = {
    districtId: null,
    v1Visible: false,
    declaredStatus: 'not-applicable',
    baseAsset: null,
    stages: [],
    souvenir: null,
    mobilePreview: null,
    regressionTest: null
  };
  assert.deepEqual(catalog.validateCatalog([outsideV1]), []);
  assert.equal(catalog.assessLearningLocation(outsideV1).status, 'not-applicable');
});
