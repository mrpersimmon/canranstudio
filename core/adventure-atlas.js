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

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const nested of Object.values(value)) deepFreeze(nested);
    return Object.freeze(value);
  }

  function completedStageIds(course, profile) {
    const completed = new Set(
      Array.isArray(profile?.completedStages?.[course.id])
        ? profile.completedStages[course.id]
        : []
    );
    return course.map.stages
      .map(stage => stage.progressId)
      .filter(id => completed.has(id));
  }

  function ownedSouvenir(course, profile) {
    const id = course?.map?.souvenir?.id;
    return typeof id === 'string' &&
      Array.isArray(profile?.souvenirs) &&
      profile.souvenirs.includes(id);
  }

  function buildLocationModels(courses, profile = null) {
    if (!catalogApi || !Array.isArray(courses)) return Object.freeze([]);
    return deepFreeze(courses.map((course, index) => {
      const publication = catalogApi.assessLearningLocation(course);
      const published = publication.status === 'published';
      const completedIds = published ? completedStageIds(course, profile) : [];
      const completedSet = new Set(completedIds);
      const visibleGrowthAssets = published
        ? course.map.stages
          .filter(stage => completedSet.has(stage.progressId))
          .map(stage => stage.growthAsset)
        : [];
      const completedStageCount = completedIds.length;
      const totalStageCount = Array.isArray(course.map?.stages)
        ? course.map.stages.length
        : 0;
      const landmarkMode = published ? course.map.landmarkMode : null;
      const landmarkAsset = !published || landmarkMode === 'layers'
        ? null
        : completedStageCount === 0
          ? course.map.baseAsset
          : course.map.stages[completedStageCount - 1].growthAsset;
      const progressState = !published
        ? 'drawing'
        : completedStageCount === 0
          ? 'ready'
          : completedStageCount === totalStageCount
            ? 'complete'
            : 'growing';
      return {
        id: course.id,
        lesson: course.lesson,
        title: course.courseStatus === 'published' ? course.title : '新地点',
        slot: index + 1,
        status: publication.status,
        route: publication.route,
        recommendable: publication.recommendable,
        landmarkMode,
        baseAsset: published ? course.map.baseAsset : null,
        landmarkAsset,
        mobilePreview: published ? course.map.mobilePreview : null,
        completedStageIds: completedIds,
        visibleGrowthAssets,
        completedStageCount,
        totalStageCount,
        progressState,
        souvenir: published && ownedSouvenir(course, profile)
          ? course.map.souvenir
          : null
      };
    }));
  }

  function selectRecommendedLocation(locations) {
    if (!Array.isArray(locations)) return null;
    return locations.find(location => (
      location.recommendable && location.progressState !== 'complete'
    )) || locations.find(location => location.recommendable) || null;
  }

  return Object.freeze({ buildLocationModels, selectRecommendedLocation });
});
