'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const {
  PROFILE_VERSION,
  PROFILE_KEY,
  hasSouvenir,
  initializeDeviceProfile,
  recordStageCompletion,
  markCourseRevealSeen,
  recordLocationVisit,
  consumeMapChanges,
  visitDistrict,
  restartAdventure
} = require('../../core/device-profile');

const EMPTY_COMPLETED_STAGES = Object.freeze({
  lesson49: [],
  lesson50: [],
  lesson51: [],
  lesson52: [],
  lesson53: [],
  lesson54: [],
  lesson55: [],
  lesson56: [],
  lesson57: [],
  lesson58: [],
  lesson59: [],
  lesson60: [],
  soundmark: []
});

function emptyCompletedStages() {
  return Object.fromEntries(
    Object.entries(EMPTY_COMPLETED_STAGES).map(([courseId, stages]) => [courseId, [...stages]])
  );
}

function emptyProfile(overrides = {}) {
  const completedStages = emptyCompletedStages();
  return {
    version: 2,
    currentDistrictId: null,
    lastVisitedLocationId: null,
    souvenirs: [],
    completedStages,
    courseRevealSeen: emptyCompletedStages(),
    pendingMapChanges: emptyCompletedStages(),
    mapChangeSeen: emptyCompletedStages(),
    ...overrides
  };
}

function memoryStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    }
  };
}

test('first device profile initialization inherits only proven stages and is idempotent', () => {
  const storage = memoryStorage({
    'canran:l49:progress:v2': JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 2, l3: 1, l4: 0, l5: 3 }
    })
  });

  const first = initializeDeviceProfile({ storage, courses: catalog.COURSES });
  const firstStored = storage.getItem(PROFILE_KEY);
  const second = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  assert.equal(first.persisted, true);
  assert.deepEqual(first.profile, emptyProfile({
    completedStages: {
      ...emptyCompletedStages(),
      lesson49: ['l1', 'l2', 'l3', 'l5']
    },
    courseRevealSeen: {
      ...emptyCompletedStages(),
      lesson49: ['l1', 'l2', 'l3', 'l5']
    },
    mapChangeSeen: {
      ...emptyCompletedStages(),
      lesson49: ['l1', 'l2', 'l3', 'l5']
    }
  }));
  assert.equal(storage.getItem(PROFILE_KEY), firstStored);
  assert.deepEqual(second.profile, first.profile);
});

test('restart clears every catalog-owned record and preserves unrelated storage', () => {
  const storage = memoryStorage({
    [PROFILE_KEY]: JSON.stringify({
      version: 1,
      currentDistrictId: catalog.LAUNCH_DISTRICT.id,
      souvenirs: ['food-basket'],
      completedStages: { lesson49: ['l1', 'l2'] }
    }),
    'canran:l49:progress:v2': JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 0, l4: 0, l5: 0 }
    }),
    'l49-stars-v1': JSON.stringify({ l1: 3 }),
    'canran:soundmark:progress:v2': JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 0, g3: 0 }
    }),
    'phonics-magic-stars-v1': '12',
    'another-site:preference': 'keep-me'
  });

  const result = restartAdventure({ storage, courses: catalog.COURSES });

  assert.equal(result.cleared, true);
  assert.equal(result.persisted, true);
  assert.deepEqual(JSON.parse(storage.getItem(PROFILE_KEY)), emptyProfile());
  assert.equal(storage.getItem('canran:l49:progress:v2'), null);
  assert.equal(storage.getItem('l49-stars-v1'), null);
  assert.equal(storage.getItem('canran:soundmark:progress:v2'), null);
  assert.equal(storage.getItem('phonics-magic-stars-v1'), null);
  assert.equal(storage.getItem('another-site:preference'), 'keep-me');
});

test('legacy and corrupt course records initialize without inventing completed stages', () => {
  const storage = memoryStorage({
    [PROFILE_KEY]: '{broken-profile',
    'l49-stars-v1': JSON.stringify({ l1: '3', l2: 'wrong', l3: 2 }),
    'canran:l50:progress:v2': '{broken-progress'
  });

  const result = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  assert.deepEqual(result.profile.completedStages.lesson49, ['l1', 'l3']);
  assert.deepEqual(result.profile.completedStages.lesson50, []);
  assert.equal(storage.getItem('l49-stars-v1'), null);
  assert.deepEqual(
    JSON.parse(storage.getItem('canran:l50:progress:v2')).ratings,
    { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 }
  );
});

test('a proven device stage never regresses when a later course rating is lower', () => {
  const storage = memoryStorage({
    [PROFILE_KEY]: JSON.stringify({
      version: 1,
      completedStages: { lesson49: ['l1', 'l2'] }
    }),
    'canran:l49:progress:v2': JSON.stringify({
      version: 2,
      ratings: { l1: 0, l2: 1, l3: 3, l4: 0, l5: 0 }
    })
  });

  const result = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  assert.deepEqual(result.profile.completedStages.lesson49, ['l1', 'l2', 'l3']);
});

test('a completed map course awards its known souvenir once and never regresses', () => {
  const storage = memoryStorage({
    [PROFILE_KEY]: JSON.stringify({
      version: 1,
      souvenirs: ['unknown-token'],
      completedStages: { lesson49: [] }
    }),
    'canran:l49:progress:v2': JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
    })
  });

  const awarded = initializeDeviceProfile({ storage, courses: catalog.COURSES });
  assert.deepEqual(awarded.profile.souvenirs, ['food-basket']);
  assert.equal(hasSouvenir(awarded.profile, 'food-basket'), true);
  assert.equal(hasSouvenir(awarded.profile, 'unknown-token'), false);

  storage.setItem('canran:l49:progress:v2', JSON.stringify({
    version: 2,
    ratings: { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 }
  }));
  const returned = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  assert.deepEqual(returned.profile.souvenirs, ['food-basket']);
  assert.equal(hasSouvenir(returned.profile, 'food-basket'), true);
});

test('an older completed profile backfills a missing souvenir field', () => {
  const storage = memoryStorage({
    [PROFILE_KEY]: JSON.stringify({
      version: 1,
      completedStages: { lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'] }
    })
  });

  const result = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  assert.deepEqual(result.profile.souvenirs, ['food-basket']);
  assert.equal(hasSouvenir(result.profile, 'food-basket'), true);
});

test('visiting the launch district becomes the device return view without changing progress', () => {
  const storage = memoryStorage();
  const initialized = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  const visited = visitDistrict({
    storage,
    courses: catalog.COURSES,
    profile: initialized.profile,
    districtId: catalog.LAUNCH_DISTRICT.id
  });
  const returned = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  assert.equal(visited.persisted, true);
  assert.equal(visited.profile.currentDistrictId, 'first-book-49-60');
  assert.deepEqual(visited.profile.completedStages, initialized.profile.completedStages);
  assert.equal(returned.profile.currentDistrictId, 'first-book-49-60');
});

test('v1 profile migrates to v2 without replaying historical growth reveals', () => {
  const storage = memoryStorage({
    [PROFILE_KEY]: JSON.stringify({
      version: 1,
      currentDistrictId: catalog.LAUNCH_DISTRICT.id,
      souvenirs: ['food-basket'],
      completedStages: { lesson49: ['l1', 'l2'] }
    })
  });

  const result = initializeDeviceProfile({ storage, courses: catalog.COURSES });

  assert.equal(PROFILE_VERSION, 2);
  assert.equal(result.profile.version, 2);
  assert.deepEqual(result.profile.completedStages.lesson49, ['l1', 'l2']);
  assert.deepEqual(result.profile.courseRevealSeen.lesson49, ['l1', 'l2']);
  assert.deepEqual(result.profile.mapChangeSeen.lesson49, ['l1', 'l2']);
  assert.deepEqual(result.profile.pendingMapChanges.lesson49, []);
  assert.equal(result.profile.lastVisitedLocationId, null);
});

test('only a persisted zero-to-positive stage transition creates one pending reveal', () => {
  const storage = memoryStorage();
  initializeDeviceProfile({ storage, courses: catalog.COURSES });

  const first = recordStageCompletion({
    storage,
    courses: catalog.COURSES,
    courseId: 'lesson49',
    stageId: 'l1',
    previousRating: 0,
    nextRating: 2,
    progressPersisted: true
  });
  const improved = recordStageCompletion({
    storage,
    courses: catalog.COURSES,
    courseId: 'lesson49',
    stageId: 'l1',
    previousRating: 2,
    nextRating: 3,
    progressPersisted: true
  });

  assert.equal(first.shouldReveal, true);
  assert.equal(first.firstCompletion, true);
  assert.deepEqual(first.profile.pendingMapChanges.lesson49, ['l1']);
  assert.equal(improved.shouldReveal, false);
  assert.deepEqual(improved.profile.pendingMapChanges.lesson49, ['l1']);

  const seen = markCourseRevealSeen({
    storage,
    courses: catalog.COURSES,
    courseId: 'lesson49',
    stageId: 'l1'
  });
  assert.deepEqual(seen.profile.courseRevealSeen.lesson49, ['l1']);
});

test('map changes merge in course order and are consumed once without losing progress', () => {
  const storage = memoryStorage();
  initializeDeviceProfile({ storage, courses: catalog.COURSES });
  for (const stageId of ['l3', 'l1', 'l2']) {
    recordStageCompletion({
      storage,
      courses: catalog.COURSES,
      courseId: 'lesson49',
      stageId,
      previousRating: 0,
      nextRating: 1,
      progressPersisted: true
    });
  }
  recordLocationVisit({ storage, courses: catalog.COURSES, courseId: 'lesson49' });

  const first = consumeMapChanges({
    storage,
    courses: catalog.COURSES,
    courseId: 'lesson49'
  });
  const second = consumeMapChanges({
    storage,
    courses: catalog.COURSES,
    courseId: 'lesson49'
  });

  assert.deepEqual(first.consumedStageIds, ['l1', 'l2', 'l3']);
  assert.equal(first.profile.lastVisitedLocationId, 'lesson49');
  assert.deepEqual(first.profile.completedStages.lesson49, ['l1', 'l2', 'l3']);
  assert.deepEqual(second.consumedStageIds, []);
});

test('unwritable storage never claims permanent landmark growth', () => {
  const storage = memoryStorage();
  initializeDeviceProfile({ storage, courses: catalog.COURSES });
  storage.setItem = () => { throw new Error('quota'); };

  const result = recordStageCompletion({
    storage,
    courses: catalog.COURSES,
    courseId: 'lesson49',
    stageId: 'l1',
    previousRating: 0,
    nextRating: 3,
    progressPersisted: true
  });

  assert.equal(result.persisted, false);
  assert.equal(result.shouldReveal, false);
  assert.equal(result.firstCompletion, false);
});
