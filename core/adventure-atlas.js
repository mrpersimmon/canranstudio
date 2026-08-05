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

  const ROUTE_PAGE_ART_VERSION = 'route-page-20260806-01';
  const GOLDEN_ROUTE_PAGE = deepFreeze({
    id: 'district5-page1',
    districtId: 'first-book-49-60',
    title: '风味四季路',
    subtitle: 'Lesson 49–52 · 食物口味与各地气候',
    locationIds: ['lesson49', 'lesson50', 'lesson51', 'lesson52'],
    canvas: { width: 940, height: 1672 },
    backgroundAsset: {
      version: ROUTE_PAGE_ART_VERSION,
      png: 'assets/adventure-map/route-pages/district5-page1/background-master.png',
      variants: [512, 768, 940].map(width => ({
        width,
        avif: `assets/adventure-map/route-pages/district5-page1/background-${ROUTE_PAGE_ART_VERSION}-${width}.avif`,
        webp: `assets/adventure-map/route-pages/district5-page1/background-${ROUTE_PAGE_ART_VERSION}-${width}.webp`
      }))
    },
    mascotAsset: {
      version: ROUTE_PAGE_ART_VERSION,
      png: 'assets/adventure-map/mascot/explorer-cat-walking.png',
      variants: [128, 192, 256].map(width => ({
        width,
        avif: `assets/adventure-map/mascot/explorer-cat-walking-${ROUTE_PAGE_ART_VERSION}-${width}.avif`,
        webp: `assets/adventure-map/mascot/explorer-cat-walking-${ROUTE_PAGE_ART_VERSION}-${width}.webp`
      }))
    },
    markerAsset: {
      version: ROUTE_PAGE_ART_VERSION,
      png: 'assets/adventure-map/mascot/current-route-marker.png',
      variants: [64, 96, 128].map(width => ({
        width,
        avif: `assets/adventure-map/mascot/current-route-marker-${ROUTE_PAGE_ART_VERSION}-${width}.avif`,
        webp: `assets/adventure-map/mascot/current-route-marker-${ROUTE_PAGE_ART_VERSION}-${width}.webp`
      }))
    },
    loaderFrames: [1, 2, 3, 4].map(frame => ({
      frame,
      version: ROUTE_PAGE_ART_VERSION,
      png: `assets/adventure-map/mascot/loader/frame-${frame}.png`,
      variants: [128, 192, 256].map(width => ({
        width,
        avif: `assets/adventure-map/mascot/loader/frame-${frame}-${ROUTE_PAGE_ART_VERSION}-${width}.avif`,
        webp: `assets/adventure-map/mascot/loader/frame-${frame}-${ROUTE_PAGE_ART_VERSION}-${width}.webp`
      }))
    }))
  });

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
      const completedStageCount = completedIds.length;
      const totalStageCount = Array.isArray(course.map?.stages) ? course.map.stages.length : 0;
      const landmarkAsset = published
        ? course.map.stateAssets?.[Math.min(completedStageCount, totalStageCount)] || null
        : null;
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
        baseAsset: null,
        landmarkAsset,
        mobilePreview: published ? course.map.mobilePreview : null,
        completedStageIds: completedIds,
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

  function buildRoutePageLocationModels(courses, profile = null, routePage = GOLDEN_ROUTE_PAGE) {
    if (!Array.isArray(courses) || !Array.isArray(routePage?.locationIds)) return Object.freeze([]);
    const byId = new Map(courses.map(course => [course?.id, course]));
    const pageCourses = routePage.locationIds.map(id => byId.get(id)).filter(Boolean);
    return buildLocationModels(pageCourses, profile);
  }

  function selectRouteAvatarTarget(locations, focusedId = null, profile = null) {
    if (!Array.isArray(locations) || locations.length === 0) return null;
    const focused = locations.find(location => (
      location.id === focusedId && location.status === 'published'
    ));
    if (focused) return focused.id;
    return selectRecommendedLocation(locations, profile)?.id || 'route-exit';
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

  return Object.freeze({
    ROUTE_PAGE_ART_VERSION,
    GOLDEN_ROUTE_PAGE,
    buildLocationModels,
    buildRoutePageLocationModels,
    selectRecommendedLocation,
    selectRouteAvatarTarget,
    buildMapChangeSummary
  });
});
