'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

test('published course registry is complete, unique, and deeply frozen', () => {
  let registry;
  assert.doesNotThrow(() => {
    registry = require('../../scripts/course-registry');
  });

  const expected = [
    {
      id: 'lesson49',
      route: '/lesson49/',
      entry: 'lesson49/index.html',
      assetDirectories: ['lesson49/audio'],
      title: '肉店大冒险'
    },
    {
      id: 'lesson50',
      route: '/lesson50/',
      entry: 'lesson50/index.html',
      assetDirectories: ['lesson50/audio'],
      title: '挑食小王子大冒险'
    },
    {
      id: 'soundmark',
      route: '/soundmark/',
      entry: 'soundmark/index.html',
      assetDirectories: ['soundmark/audio'],
      title: '音标魔法乐园'
    },
    {
      id: 'lesson51',
      route: '/lesson51/',
      entry: 'lesson51/index.html',
      assetDirectories: ['lesson51/audio'],
      title: '希腊四季之旅'
    }
  ];

  assert.deepEqual(registry.PUBLISHED_COURSES, expected);
  assert.equal(Object.isFrozen(registry.PUBLISHED_COURSES), true);
  assert.equal(registry.PUBLISHED_COURSES.every(course =>
    Object.isFrozen(course) && Object.isFrozen(course.assetDirectories)
  ), true);
  assert.equal(new Set(expected.map(course => course.id)).size, expected.length);
  assert.equal(new Set(expected.map(course => course.route)).size, expected.length);
  assert.equal(new Set(expected.map(course => course.entry)).size, expected.length);
  assert.equal(expected.every(course => course.route.startsWith('/') &&
    course.route.endsWith('/') &&
    !path.posix.isAbsolute(course.entry)
  ), true);
});
