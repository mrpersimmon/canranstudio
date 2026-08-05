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
      ['lesson53', 'lesson', 53, 'published'],
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
      landmarkMode: lesson49.map.landmarkMode,
      baseAsset: lesson49.map.baseAsset,
      stages: lesson49.map.stages,
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
      declaredStatus: 'published',
      landmarkMode: 'states',
      baseAsset: 'assets/adventure-map/lesson49/landmark-base.png',
      stages: [
        {
          progressId: 'l1',
          growthAsset: 'assets/adventure-map/lesson49/growth-01-awning.png',
          revealTitle: '红白遮阳棚',
          revealCopy: '肉店挂上了红白遮阳棚！',
          soundAsset: null
        },
        {
          progressId: 'l2',
          growthAsset: 'assets/adventure-map/lesson49/growth-02-display.png',
          revealTitle: '新鲜展示台',
          revealCopy: '木台上摆好了新鲜肉品！',
          soundAsset: null
        },
        {
          progressId: 'l3',
          growthAsset: 'assets/adventure-map/lesson49/growth-03-sign.png',
          revealTitle: '牛排招牌',
          revealCopy: '门前挂上了会摇摆的牛排招牌！',
          soundAsset: null
        },
        {
          progressId: 'l4',
          growthAsset: 'assets/adventure-map/lesson49/growth-04-delivery.png',
          revealTitle: '送货小车',
          revealCopy: '送货小车把木箱稳稳送到了门口！',
          soundAsset: null
        },
        {
          progressId: 'l5',
          growthAsset: 'assets/adventure-map/lesson49/growth-05-celebration.png',
          revealTitle: '暖灯庆典开张',
          revealCopy: '彩旗和暖灯点亮了肉店，食物篮子也收藏进图鉴！',
          soundAsset: null
        }
      ],
      souvenir: {
        id: 'food-basket',
        title: '食物篮子',
        asset: 'assets/adventure-map/lesson49/food-basket.png'
      }
    }
  );

  const lesson51 = catalog.COURSES.find(course => course.id === 'lesson51');
  assert.deepEqual(
    {
      landmarkMode: lesson51.map.landmarkMode,
      baseAsset: lesson51.map.baseAsset,
      growthAssets: lesson51.map.stages.map(stage => stage.growthAsset),
      souvenir: lesson51.map.souvenir,
      mobilePreview: lesson51.map.mobilePreview,
      regressionTest: lesson51.map.regressionTest
    },
    {
      landmarkMode: 'states',
      baseAsset: 'assets/adventure-map/lesson51/landmark-base.png',
      growthAssets: [
        'assets/adventure-map/lesson51/growth-01-weather.png',
        'assets/adventure-map/lesson51/growth-02-theatre.png',
        'assets/adventure-map/lesson51/growth-03-seasons.png',
        'assets/adventure-map/lesson51/growth-04-sundial.png',
        'assets/adventure-map/lesson51/growth-05-celebration.png'
      ],
      souvenir: {
        id: 'four-seasons-guide-compass',
        title: '四季导游罗盘',
        asset: 'assets/adventure-map/lesson51/four-seasons-guide-compass.png'
      },
      mobilePreview: 'assets/adventure-map/lesson51/mobile-preview.png',
      regressionTest: 'tests/e2e/lesson51-map.spec.js'
    }
  );
  assert.equal(lesson51.map.stateAssets.length, 6);
  assert.deepEqual(lesson51.map.stateAssets[5], {
    stageCount: 5,
    version: catalog.MAP_STATE_VERSION,
    png: 'assets/adventure-map/lesson51/states/state-5.png',
    variants: [512, 768, 1024].map(width => ({
      width,
      avif: `assets/adventure-map/lesson51/states/state-5-${width}.avif`,
      webp: `assets/adventure-map/lesson51/states/state-5-${width}.webp`
    }))
  });

  const soundmark = catalog.COURSES.find(course => course.id === 'soundmark');
  assert.deepEqual(soundmark.progress.ids, ['vs', 'g1', 'g2', 'g3']);
  assert.equal(soundmark.map.declaredStatus, 'published');
  assert.equal(soundmark.map.districtId, 'first-book-49-60');
  assert.equal(soundmark.map.stages.length, 4);

  assertDeepFrozen(catalog.COURSES);
});

test('landmark state URLs carry one immutable content version', () => {
  const state = catalog.requirePublishedCourse('lesson51').map.stateAssets[5];
  assert.match(catalog.MAP_STATE_VERSION, /^[a-z0-9][a-z0-9-]+$/);
  assert.equal(
    catalog.mapStateAssetUrl(state.png, state),
    `/assets/adventure-map/lesson51/states/state-5.png?v=${catalog.MAP_STATE_VERSION}`
  );
  assert.equal(
    catalog.mapStateAssetUrl(state.variants[2].avif, state),
    `/assets/adventure-map/lesson51/states/state-5-1024.avif?v=${catalog.MAP_STATE_VERSION}`
  );
  assert.throws(() => catalog.mapStateAssetUrl('../private.png', state), /invalid map state path/);
});

test('world atlas declares twelve immutable districts with one V1 entrance', () => {
  assert.deepEqual(
    catalog.DISTRICTS.map(district => [
      district.id,
      district.lessonStart,
      district.lessonEnd,
      district.v1Accessible
    ]),
    [
      ['first-book-1-12', 1, 12, false],
      ['first-book-13-24', 13, 24, false],
      ['first-book-25-36', 25, 36, false],
      ['first-book-37-48', 37, 48, false],
      ['first-book-49-60', 49, 60, true],
      ['first-book-61-72', 61, 72, false],
      ['first-book-73-84', 73, 84, false],
      ['first-book-85-96', 85, 96, false],
      ['first-book-97-108', 97, 108, false],
      ['first-book-109-120', 109, 120, false],
      ['first-book-121-132', 121, 132, false],
      ['first-book-133-144', 133, 144, false]
    ]
  );
  assert.equal(catalog.LAUNCH_DISTRICT.id, 'first-book-49-60');
  assert.equal(catalog.LAUNCH_DISTRICT.title, '四季生活城');
  assertDeepFrozen(catalog.DISTRICTS);
});

test('published course pages resolve their progress contract from the shared catalog', () => {
  const lesson49 = catalog.requirePublishedCourse('lesson49');
  const lesson52 = catalog.requirePublishedCourse('lesson52');

  assert.equal(lesson49, catalog.COURSES.find(course => course.id === 'lesson49'));
  assert.equal(lesson49.progress.key, 'canran:l49:progress:v2');
  assert.equal(lesson52, catalog.COURSES.find(course => course.id === 'lesson52'));
  assert.equal(lesson52.progress.key, 'canran:l52:progress:v2');
  assert.throws(
    () => catalog.requirePublishedCourse('missing'),
    /published course not found: missing/
  );
});

test('learning locations stay drawing and non-navigable until the full publication contract is met', () => {
  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const published = catalog.assessLearningLocation(lesson49);
  assert.deepEqual(published, {
    status: 'published',
    route: '/lesson49/',
    recommendable: true,
    checklist: {
      coursePage: true,
      prerecordedAudio: true,
      stageMapping: true,
      renderingMode: true,
      authoringSources: true,
      stateSnapshots: true,
      revealCopy: true,
      souvenir: true,
      mobilePreview: true,
      regressionVerification: true
    },
    missing: []
  });

  const incomplete = structuredClone(lesson49);
  incomplete.map.mobilePreview = null;
  const drawing = catalog.assessLearningLocation(incomplete);
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
      missing: ['mobilePreview']
    }
  );

  const forged = structuredClone(lesson49);
  forged.map.baseAsset = 'README.md';
  forged.map.stages = forged.map.stages.map(stage => ({
    ...stage,
    growthAsset: 'README.md'
  }));
  forged.map.souvenir.asset = 'README.md';
  forged.map.mobilePreview = 'README.md';
  forged.map.regressionTest = 'README.md';
  assert.deepEqual(catalog.assessLearningLocation(forged).missing, [
    'authoringSources',
    'souvenir',
    'mobilePreview',
    'regressionVerification'
  ]);
  assert.equal(catalog.assessLearningLocation(forged).status, 'drawing');

  const missingSnapshot = structuredClone(lesson49);
  missingSnapshot.map.stateAssets.pop();
  assert.deepEqual(catalog.assessLearningLocation(missingSnapshot).missing, ['stateSnapshots']);

  const unsupportedRendering = structuredClone(lesson49);
  unsupportedRendering.map.landmarkMode = 'mixed';
  assert.deepEqual(catalog.assessLearningLocation(unsupportedRendering).missing, [
    'renderingMode'
  ]);
  assert.equal(catalog.assessLearningLocation(unsupportedRendering).status, 'drawing');

  const soundmark = catalog.COURSES.find(course => course.id === 'soundmark');
  const soundmarkAssessment = catalog.assessLearningLocation(soundmark);
  assert.equal(soundmarkAssessment.status, 'published');
  assert.equal(soundmarkAssessment.route, '/soundmark/');
  assert.equal(soundmarkAssessment.recommendable, true);
  assert.deepEqual(soundmarkAssessment.missing, []);
});

test('catalog validation rejects duplicate routes and incomplete published locations', () => {
  assert.deepEqual(catalog.validateCatalog(catalog.COURSES), []);

  const invalid = structuredClone(catalog.COURSES);
  invalid.find(course => course.id === 'lesson49').map.mobilePreview = null;
  invalid.find(course => course.id === 'lesson50').route = '/lesson49/';

  assert.deepEqual(catalog.validateCatalog(invalid), [
    'lesson49: published map contract missing mobilePreview',
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
      ['lesson60', 60, 'first-book-49-60'],
      ['soundmark', null, 'first-book-49-60']
    ]
  );
  assert.equal(Object.isFrozen(catalog.MAP_COURSES), true);
  assert.deepEqual(
    catalog.MAP_COURSES.map(course => catalog.assessLearningLocation(course).status),
    ['published', 'published', 'published', 'published', 'published', 'published', 'drawing', 'drawing', 'drawing', 'drawing', 'drawing', 'drawing', 'published']
  );

  const outsideV1 = structuredClone(catalog.COURSES.find(course => course.id === 'lesson50'));
  outsideV1.id = 'lesson61';
  outsideV1.lesson = 61;
  outsideV1.route = '/lesson61/';
  outsideV1.entry = 'lesson61/index.html';
  outsideV1.assetDirectories = ['lesson61/audio'];
  outsideV1.progress.key = 'canran:l61:progress:v2';
  delete outsideV1.progress.legacyKey;
  delete outsideV1.progress.legacyMode;
  outsideV1.map = catalog.createLessonMap(61);
  assert.deepEqual(catalog.validateCatalog([outsideV1]), []);
  assert.equal(catalog.assessLearningLocation(outsideV1).status, 'not-applicable');
  assert.equal(catalog.directoryMapStatus(outsideV1), 'v2');

  const polluted = structuredClone(outsideV1);
  polluted.map.baseAsset = 'assets/adventure-map/lesson61/base.png';
  assert.deepEqual(catalog.validateCatalog([polluted]), [
    'lesson61: lessons outside 49-60 must use a not-applicable map contract'
  ]);
});

test('lesson map creation and directory status keep future courses outside V1', () => {
  assert.deepEqual(catalog.createLessonMap(61), {
    districtId: null,
    v1Visible: false,
    declaredStatus: 'not-applicable',
    landmarkMode: null,
    baseAsset: null,
    stateAssets: [],
    stages: [],
    souvenir: null,
    mobilePreview: null,
    regressionTest: null
  });
  assert.equal(Object.isFrozen(catalog.createLessonMap(61)), true);

  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const lesson50 = catalog.COURSES.find(course => course.id === 'lesson50');
  const soundmark = catalog.COURSES.find(course => course.id === 'soundmark');
  assert.equal(catalog.directoryMapStatus(lesson49), 'published');
  assert.equal(catalog.directoryMapStatus(lesson50), 'published');
  assert.equal(catalog.directoryMapStatus(
    catalog.COURSES.find(course => course.id === 'lesson51')
  ), 'published');
  assert.equal(catalog.directoryMapStatus(soundmark), 'not-applicable');
});

test('catalog publishes one complete classroom presentation without making other courses appear ready', () => {
  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const lesson50 = catalog.COURSES.find(course => course.id === 'lesson50');

  assert.deepEqual(catalog.PRESENTATION_COURSES.map(course => course.id), ['lesson49']);
  assert.deepEqual(
    {
      declaredStatus: lesson49.presentation.declaredStatus,
      route: lesson49.presentation.route,
      entry: lesson49.presentation.entry,
      controls: lesson49.presentation.controls,
      stepIds: lesson49.presentation.steps.map(step => step.id),
      audioAssets: lesson49.presentation.steps.map(step => step.audioAsset),
      regressionTest: lesson49.presentation.regressionTest
    },
    {
      declaredStatus: 'published',
      route: '/lesson49/present/',
      entry: 'lesson49/present/index.html',
      controls: ['fullscreen', 'audio', 'hint', 'previous', 'next', 'exit'],
      stepIds: ['welcome', 'vocabulary', 'dialogue', 'grammar', 'recap'],
      audioAssets: [
        'lesson49/audio/butcher.mp3',
        'lesson49/audio/beef.mp3',
        'lesson49/audio/do_you_want_any_meat_today_mrs_bird.mp3',
        'lesson49/audio/are_you_a_teacher.mp3',
        'lesson49/audio/to_tell_you_the_truth_mrs_bird_i_don_t_like_chicken_either.mp3'
      ],
      regressionTest: 'tests/e2e/classroom-presentation.spec.js'
    }
  );
  assert.deepEqual(catalog.assessClassroomPresentation(lesson49), {
    status: 'published',
    route: '/lesson49/present/',
    checklist: {
      publicPage: true,
      completeControls: true,
      teachingSteps: true,
      prerecordedAudio: true,
      regressionVerification: true
    },
    missing: []
  });
  assert.deepEqual(catalog.assessClassroomPresentation(lesson50), {
    status: 'not-ready',
    route: null,
    checklist: null,
    missing: []
  });
  assertDeepFrozen(catalog.PRESENTATION_COURSES);

  const invalid = structuredClone(catalog.COURSES);
  invalid.find(course => course.id === 'lesson49').presentation.controls = ['fullscreen'];
  assert.deepEqual(catalog.validateCatalog(invalid), [
    'lesson49: published presentation contract missing completeControls'
  ]);
});

test('every published map stage declares a child-readable growth reveal', () => {
  const publishedLocations = catalog.MAP_COURSES
    .filter(course => catalog.assessLearningLocation(course).status === 'published');

  assert.ok(publishedLocations.length >= 2);
  for (const course of publishedLocations) {
    for (const stage of course.map.stages) {
      assert.match(stage.revealTitle, /\S/);
      assert.match(stage.revealCopy, /\S/);
      assert.notEqual(stage.growthAsset, course.map.baseAsset);
    }
  }
});
