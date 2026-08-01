'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/course-catalog');
const atlas = require('../../core/adventure-atlas');

function completedLesson49Contract() {
  const course = structuredClone(
    catalog.COURSES.find(candidate => candidate.id === 'lesson49')
  );
  course.map.declaredStatus = 'published';
  course.map.baseAsset = 'assets/adventure-map/lesson49/base.png';
  course.map.stages = course.map.stages.map((stage, index) => ({
    ...stage,
    growthAsset: `assets/adventure-map/lesson49/growth-${index + 1}.png`
  }));
  course.map.souvenir.asset = 'assets/adventure-map/lesson49/food-basket.png';
  course.map.mobilePreview = 'assets/adventure-map/lesson49/mobile-preview.png';
  course.map.regressionTest = 'tests/e2e/lesson49-map.spec.js';
  return course;
}

test('atlas location models follow the shared publication contract', () => {
  const drawing = atlas.buildLocationModels([
    catalog.COURSES.find(course => course.id === 'lesson49')
  ])[0];
  const published = atlas.buildLocationModels([completedLesson49Contract()])[0];

  assert.deepEqual(drawing, {
    id: 'lesson49',
    lesson: 49,
    title: '肉店大冒险',
    slot: 1,
    status: 'drawing',
    route: null,
    recommendable: false,
    baseAsset: null
  });
  assert.deepEqual(published, {
    id: 'lesson49',
    lesson: 49,
    title: '肉店大冒险',
    slot: 1,
    status: 'published',
    route: '/lesson49/',
    recommendable: true,
    baseAsset: 'assets/adventure-map/lesson49/base.png'
  });
  assert.equal(Object.isFrozen(drawing), true);
  assert.equal(Object.isFrozen(published), true);
});
