(function attachAdventureAtlas(root, factory) {
  'use strict';
  const catalogApi = typeof module === 'object' && module.exports
    ? require('./course-catalog')
    : root?.CanranCore?.courseCatalog;
  const api = factory(catalogApi);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.adventureAtlas = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function adventureAtlasFactory(catalogApi) {
  'use strict';

  function buildLocationModels(courses) {
    if (!catalogApi || !Array.isArray(courses)) return Object.freeze([]);
    return Object.freeze(courses.map((course, index) => {
      const publication = catalogApi.assessLearningLocation(course);
      const published = publication.status === 'published';
      return Object.freeze({
        id: course.id,
        lesson: course.lesson,
        title: course.courseStatus === 'published' ? course.title : '新地点',
        slot: index + 1,
        status: publication.status,
        route: publication.route,
        recommendable: publication.recommendable,
        baseAsset: published ? course.map.baseAsset : null
      });
    }));
  }

  return Object.freeze({ buildLocationModels });
});
