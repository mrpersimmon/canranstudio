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
    placements: {
      lesson49: { top: 3.4, left: 3.4, width: 49 },
      lesson50: { top: 18.8, right: 3.4, width: 47 },
      lesson51: { top: 40.1, left: 4.8, width: 50 },
      lesson52: { top: 67.1, right: 4.6, width: 47 }
    },
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
    flagAsset: {
      version: ROUTE_PAGE_ART_VERSION,
      png: 'assets/adventure-map/mascot/explorer-flag-purple-gold.png',
      variants: [64, 96, 128].map(width => ({
        width,
        avif: `assets/adventure-map/mascot/explorer-flag-purple-gold-${ROUTE_PAGE_ART_VERSION}-${width}.avif`,
        webp: `assets/adventure-map/mascot/explorer-flag-purple-gold-${ROUTE_PAGE_ART_VERSION}-${width}.webp`
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

  const REVIEW_ROUTE_PAGE_ART_VERSION = 'route-page-review-20260806-01';
  const DISTRICT5_PAGE2_REVIEW = deepFreeze({
    id: 'district5-page2-review',
    districtId: 'first-book-49-60',
    reviewOnly: true,
    title: '气候家庭街',
    subtitle: 'Lesson 53–56 · 各地气候与家庭作息',
    locationIds: ['lesson53', 'lesson54', 'lesson55', 'lesson56'],
    canvas: { width: 940, height: 1672 },
    placements: {
      lesson53: { top: 4.8, left: 3.8, width: 48 },
      lesson54: { top: 24.2, right: 3.5, width: 49 },
      lesson55: { top: 49.6, left: 4.8, width: 47 },
      lesson56: { top: 71.8, right: 4.6, width: 47 }
    },
    backgroundAsset: {
      version: REVIEW_ROUTE_PAGE_ART_VERSION,
      png: 'assets/adventure-map/route-pages/district5-page2/background-review-v1.png',
      variants: [512, 768, 940].map(width => ({
        width,
        avif: `assets/adventure-map/route-pages/district5-page2/background-${REVIEW_ROUTE_PAGE_ART_VERSION}-${width}.avif`,
        webp: `assets/adventure-map/route-pages/district5-page2/background-${REVIEW_ROUTE_PAGE_ART_VERSION}-${width}.webp`
      }))
    }
  });
  const LANDMARK_REVIEW_ROUTE_PAGES = deepFreeze([
    GOLDEN_ROUTE_PAGE,
    DISTRICT5_PAGE2_REVIEW
  ]);

  function routePageForLocation(locationId, routePages = LANDMARK_REVIEW_ROUTE_PAGES) {
    if (typeof locationId !== 'string' || !Array.isArray(routePages)) return null;
    return routePages.find(page => (
      Array.isArray(page?.locationIds) && page.locationIds.includes(locationId)
    )) || null;
  }

  function routePageNeighbors(pageId, routePages = LANDMARK_REVIEW_ROUTE_PAGES) {
    if (!Array.isArray(routePages)) return deepFreeze({ previous: null, next: null });
    const index = routePages.findIndex(page => page?.id === pageId);
    if (index < 0) return deepFreeze({ previous: null, next: null });
    return deepFreeze({
      previous: routePages[index - 1] || null,
      next: routePages[index + 1] || null
    });
  }

  function buildRoutePageSpread(pageId, routePages = LANDMARK_REVIEW_ROUTE_PAGES) {
    if (!Array.isArray(routePages) || routePages.length === 0) return Object.freeze([]);
    const selectedIndex = routePages.findIndex(page => page?.id === pageId);
    if (selectedIndex < 0) return Object.freeze([]);
    const leftIndex = Math.floor(selectedIndex / 2) * 2;
    const leftPage = routePages[leftIndex];
    const rightPage = routePages[leftIndex + 1] || deepFreeze({
      id: `${leftPage?.districtId || 'district'}-endpaper-${Math.floor(leftIndex / 2) + 1}`,
      districtId: leftPage?.districtId || null,
      kind: 'endpaper',
      title: '冒险仍在继续'
    });
    return Object.freeze([leftPage, rightPage]);
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

  function selectCurrentRoutePage(
    courses,
    profile = null,
    focusedId = null,
    routePages = LANDMARK_REVIEW_ROUTE_PAGES
  ) {
    if (!Array.isArray(courses) || !Array.isArray(routePages) || routePages.length === 0) return null;
    const published = buildLocationModels(courses, profile).filter(location => (
      location.kind === 'lesson' && location.status === 'published'
    ));
    const publishedById = new Map(published.map(location => [location.id, location]));
    const pageForPublished = locationId => (
      publishedById.has(locationId) ? routePageForLocation(locationId, routePages) : null
    );

    const focusedPage = pageForPublished(focusedId);
    if (focusedPage) return focusedPage;

    const recentId = profile?.lastVisitedLocationId;
    const recent = publishedById.get(recentId);
    if (recent && recent.progressState !== 'complete') {
      const recentPage = routePageForLocation(recent.id, routePages);
      if (recentPage) return recentPage;
    }

    const earliestUnfinished = published.find(location => location.progressState !== 'complete');
    if (earliestUnfinished) {
      const unfinishedPage = routePageForLocation(earliestUnfinished.id, routePages);
      if (unfinishedPage) return unfinishedPage;
    }

    const completedRecentPage = pageForPublished(recentId);
    if (completedRecentPage) return completedRecentPage;
    return routePages.find(page => (
      page?.locationIds?.some(id => publishedById.has(id))
    )) || null;
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
    REVIEW_ROUTE_PAGE_ART_VERSION,
    GOLDEN_ROUTE_PAGE,
    DISTRICT5_PAGE2_REVIEW,
    LANDMARK_REVIEW_ROUTE_PAGES,
    routePageForLocation,
    routePageNeighbors,
    buildRoutePageSpread,
    buildLocationModels,
    buildRoutePageLocationModels,
    selectRecommendedLocation,
    selectCurrentRoutePage,
    selectRouteAvatarTarget,
    buildMapChangeSummary
  });
});
