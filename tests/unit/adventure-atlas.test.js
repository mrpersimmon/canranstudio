'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const atlas = require('../../core/adventure-atlas');

function profileWithLesson49(...completedStageIds) {
  return {
    version: 1,
    currentDistrictId: 'first-book-49-60',
    completedStages: { lesson49: completedStageIds }
  };
}

test('atlas location models follow the shared publication contract and device stages', () => {
  const drawing = atlas.buildLocationModels([
    catalog.COURSES.find(course => course.id === 'lesson50')
  ])[0];
  const published = atlas.buildLocationModels([
    catalog.COURSES.find(course => course.id === 'lesson49')
  ], profileWithLesson49('l2', 'l4'))[0];

  assert.deepEqual(drawing, {
    id: 'lesson50',
    lesson: 50,
    title: '挑食小王子大冒险',
    slot: 1,
    status: 'drawing',
    route: null,
    recommendable: false,
    baseAsset: null,
    mobilePreview: null,
    completedStageIds: [],
    visibleGrowthAssets: [],
    completedStageCount: 0,
    totalStageCount: 5,
    progressState: 'drawing',
    souvenir: null
  });
  assert.deepEqual(published, {
    id: 'lesson49',
    lesson: 49,
    title: '肉店大冒险',
    slot: 1,
    status: 'published',
    route: '/lesson49/',
    recommendable: true,
    baseAsset: 'assets/adventure-map/lesson49/base.png',
    mobilePreview: 'assets/adventure-map/lesson49/mobile-preview.png',
    completedStageIds: ['l2', 'l4'],
    visibleGrowthAssets: [
      'assets/adventure-map/lesson49/growth-2.png',
      'assets/adventure-map/lesson49/growth-4.png'
    ],
    completedStageCount: 2,
    totalStageCount: 5,
    progressState: 'growing',
    souvenir: null
  });
  assert.equal(Object.isFrozen(drawing), true);
  assert.equal(Object.isFrozen(published), true);
});

test('Lesson 49 renders base plus exactly the cumulative layers for stages zero through five', () => {
  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const stageIds = lesson49.map.stages.map(stage => stage.progressId);

  for (let completed = 0; completed <= stageIds.length; completed += 1) {
    const model = atlas.buildLocationModels(
      [lesson49],
      profileWithLesson49(...stageIds.slice(0, completed))
    )[0];
    assert.equal(model.completedStageCount, completed);
    assert.deepEqual(
      model.visibleGrowthAssets,
      lesson49.map.stages.slice(0, completed).map(stage => stage.growthAsset)
    );
    assert.equal(
      model.progressState,
      completed === 0 ? 'ready' : completed === 5 ? 'complete' : 'growing'
    );
    assert.deepEqual(
      model.souvenir,
      completed === 5 ? lesson49.map.souvenir : null
    );
  }
});

test('recommendation prefers an unfinished published location and stays deterministic', () => {
  const lesson49 = catalog.COURSES.find(course => course.id === 'lesson49');
  const ready = atlas.buildLocationModels([lesson49], profileWithLesson49());
  const complete = atlas.buildLocationModels(
    [lesson49],
    profileWithLesson49('l1', 'l2', 'l3', 'l4', 'l5')
  );

  assert.equal(atlas.selectRecommendedLocation(ready).id, 'lesson49');
  assert.equal(atlas.selectRecommendedLocation(complete).id, 'lesson49');
  assert.equal(atlas.selectRecommendedLocation([]), null);
});
