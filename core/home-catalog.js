(function attachHomeCatalog(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.homeCatalog = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function homeCatalogFactory() {
  'use strict';

  const RANGES = Object.freeze([
    { start: 1, end: 24 },
    { start: 25, end: 48 },
    { start: 49, end: 72 },
    { start: 73, end: 96 },
    { start: 97, end: 120 },
    { start: 121, end: 144 }
  ].map(range => Object.freeze(range)));

  function lessonNumber(value) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!/^\d+$/.test(trimmed)) return null;
      value = Number(trimmed);
    }
    return Number.isInteger(value) && value >= 1 && value <= 144 ? value : null;
  }

  function rangeForLesson(value) {
    const lesson = lessonNumber(value);
    if (lesson === null) return null;
    const range = RANGES.find(candidate => (
      lesson >= candidate.start && lesson <= candidate.end
    ));
    return range ? { start: range.start, end: range.end } : null;
  }

  function validNumberedCourses(courses) {
    if (!Array.isArray(courses)) return [];
    return courses.filter(course => (
      course &&
      course.kind === 'lesson' &&
      lessonNumber(course.lesson) !== null &&
      typeof course.route === 'string' &&
      course.route.length > 0 &&
      Number.isFinite(course.stars) &&
      course.stars >= 0 &&
      Number.isFinite(course.max) &&
      course.max > 0
    ));
  }

  function pickContinueCourse(courses) {
    const numbered = validNumberedCourses(courses);
    const unfinished = numbered.filter(course => course.stars < course.max);
    const inProgress = unfinished
      .filter(course => course.stars > 0)
      .sort((left, right) => right.stars - left.stars || right.lesson - left.lesson);
    if (inProgress.length) return inProgress[0];

    const untouched = unfinished.sort((left, right) => left.lesson - right.lesson);
    if (untouched.length) return untouched[0];

    const completed = numbered
      .filter(course => course.stars >= course.max)
      .sort((left, right) => right.lesson - left.lesson);
    return completed[0] || null;
  }

  function resolveLessonSearch(value, courses) {
    const lesson = lessonNumber(value);
    if (lesson === null) return { status: 'invalid', lesson: null, range: null };

    const range = rangeForLesson(lesson);
    const course = Array.isArray(courses)
      ? courses.find(candidate => (
        candidate && candidate.kind === 'lesson' && candidate.lesson === lesson
      ))
      : null;
    if (!course) return { status: 'missing', lesson, range };
    return {
      status: typeof course.route === 'string' && course.route.length > 0
        ? 'available'
        : 'placeholder',
      lesson,
      range
    };
  }

  return Object.freeze({
    RANGES,
    rangeForLesson,
    pickContinueCourse,
    resolveLessonSearch
  });
});
