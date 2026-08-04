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

  function stageIds(course) {
    return Array.isArray(course?.map?.stages)
      ? course.map.stages.map(stage => stage.progressId)
      : [];
  }

  function orderedProfileStages(course, field, profile) {
    const selected = new Set(Array.isArray(profile?.[field]?.[course.id])
      ? profile[field][course.id]
      : []);
    return stageIds(course).filter(id => selected.has(id));
  }

  function ownedSouvenir(course, profile) {
    const id = course?.map?.souvenir?.id;
    return typeof id === 'string' && Array.isArray(profile?.souvenirs) && profile.souvenirs.includes(id);
  }

  function buildLocationModels(courses, profile = null) {
    if (!catalogApi || !Array.isArray(courses)) return Object.freeze([]);
    let publishedSlot = 0;
    return deepFreeze(courses.map((course, index) => {
      const publication = catalogApi.assessLearningLocation(course);
      const published = publication.status === 'published';
      if (published) publishedSlot += 1;
      const completedIds = published ? orderedProfileStages(course, 'completedStages', profile) : [];
      const completedSet = new Set(completedIds);
      const pendingMapChanges = published
        ? orderedProfileStages(course, 'pendingMapChanges', profile).filter(id => completedSet.has(id))
        : [];
      const visibleGrowthAssets = published
        ? course.map.stages.filter(stage => completedSet.has(stage.progressId)).map(stage => stage.growthAsset)
        : [];
      const completedStageCount = completedIds.length;
      const totalStageCount = Array.isArray(course.map?.stages) ? course.map.stages.length : 0;
      const progressState = !published
        ? 'drawing'
        : completedStageCount === 0
          ? 'ready'
          : completedStageCount === totalStageCount
            ? 'complete'
            : 'growing';
      return {
        id: course.id,
        kind: course.kind,
        lesson: course.lesson,
        title: course.courseStatus === 'published' ? course.title : '新地点',
        slot: published ? publishedSlot : index + 1,
        status: publication.status,
        route: publication.route,
        recommendable: publication.recommendable,
        landmarkMode: published ? course.map.landmarkMode : null,
        baseAsset: published ? course.map.baseAsset : null,
        landmarkAsset: null,
        mobilePreview: published ? course.map.mobilePreview : null,
        completedStageIds: completedIds,
        visibleGrowthAssets,
        completedStageCount,
        totalStageCount,
        progressState,
        progressStamps: published
          ? course.map.stages.map(stage => ({ id: stage.progressId, earned: completedSet.has(stage.progressId) }))
          : [],
        pendingMapChanges,
        pendingChangeCount: pendingMapChanges.length,
        souvenir: published && ownedSouvenir(course, profile) ? course.map.souvenir : null
      };
    }));
  }

  function selectRecommendedLocation(locations, profile = null) {
    if (!Array.isArray(locations)) return null;
    const unfinished = locations.filter(location => (
      location.kind === 'lesson' && location.recommendable && location.progressState !== 'complete'
    ));
    if (unfinished.length === 0) return null;
    const recentId = profile?.lastVisitedLocationId;
    const recent = unfinished.find(location => location.id === recentId);
    if (recent) return recent;
    return unfinished.find(location => location.progressState === 'ready') || unfinished[0] || null;
  }

  function buildMapChangeSummary(location) {
    const stageIds = Array.isArray(location?.pendingMapChanges) ? location.pendingMapChanges : [];
    if (!location?.id || stageIds.length === 0) return null;
    const complete = location.progressState === 'complete' &&
      location.progressStamps?.at(-1)?.earned === true;
    return deepFreeze({
      courseId: location.id,
      stageIds: [...stageIds],
      count: stageIds.length,
      complete,
      copy: complete ? '地点完成' : `这里新增了 ${stageIds.length} 处变化`
    });
  }

  return Object.freeze({ buildLocationModels, selectRecommendedLocation, buildMapChangeSummary });
});
