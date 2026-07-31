'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const catalog = require('../../core/home-catalog');

test('rangeForLesson maps the 1–144 boundaries and rejects other input', () => {
  assert.deepEqual(catalog.rangeForLesson(1), { start: 1, end: 24 });
  assert.deepEqual(catalog.rangeForLesson(49), { start: 49, end: 72 });
  assert.deepEqual(catalog.rangeForLesson(144), { start: 121, end: 144 });
  assert.equal(catalog.rangeForLesson(0), null);
  assert.equal(catalog.rangeForLesson(145), null);
  assert.equal(catalog.rangeForLesson('49.5'), null);
});

test('pickContinueCourse prefers the most progressed unfinished numbered lesson', () => {
  const courses = [
    { kind: 'lesson', lesson: 49, route: '/lesson49/', stars: 6, max: 15 },
    { kind: 'lesson', lesson: 50, route: '/lesson50/', stars: 9, max: 15 },
    { kind: 'lesson', lesson: 51, route: '/lesson51/', stars: 9, max: 15 },
    { kind: 'special', lesson: null, route: '/soundmark/', stars: 12, max: 12 }
  ];
  assert.equal(catalog.pickContinueCourse(courses).lesson, 51);
});

test('pickContinueCourse falls back to first unfinished then latest completed lesson', () => {
  const untouched = [
    { kind: 'lesson', lesson: 49, route: '/lesson49/', stars: 0, max: 15 },
    { kind: 'lesson', lesson: 50, route: '/lesson50/', stars: 0, max: 15 }
  ];
  assert.equal(catalog.pickContinueCourse(untouched).lesson, 49);
  const complete = untouched.map(course => ({ ...course, stars: 15 }));
  assert.equal(catalog.pickContinueCourse(complete).lesson, 50);
});

test('resolveLessonSearch distinguishes available, placeholder, missing, and invalid lessons', () => {
  const courses = [
    { kind: 'lesson', lesson: 51, route: '/lesson51/' },
    { kind: 'lesson', lesson: 52, route: null }
  ];
  assert.deepEqual(catalog.resolveLessonSearch('51', courses), {
    status: 'available', lesson: 51, range: { start: 49, end: 72 }
  });
  assert.equal(catalog.resolveLessonSearch('52', courses).status, 'placeholder');
  assert.equal(catalog.resolveLessonSearch('100', courses).status, 'missing');
  assert.equal(catalog.resolveLessonSearch('145', courses).status, 'invalid');
});
