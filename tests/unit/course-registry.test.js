'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const catalog = require('../../core/course-catalog');

test('published course registry is a compatibility view of the shared catalog', () => {
  const registry = require('../../scripts/course-registry');

  assert.equal(registry.PUBLISHED_COURSES, catalog.PUBLISHED_COURSES);
  assert.deepEqual(
    registry.PUBLISHED_COURSES.map(course => course.id),
    ['lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson54', 'soundmark']
  );
  assert.equal(Object.isFrozen(registry.PUBLISHED_COURSES), true);
  assert.equal(registry.PUBLISHED_COURSES.every(course =>
    Object.isFrozen(course) && Object.isFrozen(course.assetDirectories)
  ), true);
  assert.equal(new Set(registry.PUBLISHED_COURSES.map(course => course.id)).size, registry.PUBLISHED_COURSES.length);
  assert.equal(new Set(registry.PUBLISHED_COURSES.map(course => course.route)).size, registry.PUBLISHED_COURSES.length);
  assert.equal(new Set(registry.PUBLISHED_COURSES.map(course => course.entry)).size, registry.PUBLISHED_COURSES.length);
  assert.equal(registry.PUBLISHED_COURSES.every(course => course.route.startsWith('/') &&
    course.route.endsWith('/') &&
    !path.posix.isAbsolute(course.entry)
  ), true);
});
