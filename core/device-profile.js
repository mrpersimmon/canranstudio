(function attachDeviceProfile(root, factory) {
  'use strict';
  const storageApi = typeof module === 'object' && module.exports
    ? require('./storage')
    : root?.CanranCore?.storage;
  const api = factory(storageApi);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.deviceProfile = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function deviceProfileFactory(storageApi) {
  'use strict';

  const PROFILE_VERSION = 2;
  // The storage key stays stable so existing V1 devices can be migrated in place.
  const PROFILE_KEY = 'canran:adventure-profile:v1';

  function mapCourses(courses) {
    return Array.isArray(courses)
      ? courses.filter(course => course?.map?.v1Visible === true)
      : [];
  }

  function findMapCourse(courses, courseId) {
    return mapCourses(courses).find(course => course.id === courseId) || null;
  }

  function stageIds(course) {
    return Array.isArray(course?.map?.stages)
      ? course.map.stages.map(stage => stage?.progressId).filter(Boolean)
      : [];
  }

  function orderedKnown(values, order) {
    const set = new Set(Array.isArray(values) ? values.filter(value => typeof value === 'string') : []);
    return order.filter(value => set.has(value));
  }

  function districtIds(courses) {
    return [...new Set(mapCourses(courses).map(course => course.map.districtId).filter(Boolean))];
  }

  function souvenirId(course) {
    return typeof course?.map?.souvenir?.id === 'string' ? course.map.souvenir.id : null;
  }

  function knownSouvenirIds(courses) {
    return [...new Set(mapCourses(courses).map(souvenirId).filter(Boolean))];
  }

  function hasSouvenir(profile, id) {
    return typeof id === 'string' && Array.isArray(profile?.souvenirs) && profile.souvenirs.includes(id);
  }

  function courseIsComplete(profile, course) {
    const required = stageIds(course);
    if (required.length === 0) return false;
    const completed = new Set(profile.completedStages[course.id] || []);
    return required.every(id => completed.has(id));
  }

  function refreshSouvenirs(profile, courses, sourceSouvenirs = profile.souvenirs) {
    const owned = new Set(Array.isArray(sourceSouvenirs)
      ? sourceSouvenirs.filter(id => typeof id === 'string')
      : []);
    for (const course of mapCourses(courses)) {
      const id = souvenirId(course);
      if (id && courseIsComplete(profile, course)) owned.add(id);
    }
    profile.souvenirs = knownSouvenirIds(courses).filter(id => owned.has(id));
  }

  function emptyStageMap(courses) {
    return Object.fromEntries(mapCourses(courses).map(course => [course.id, []]));
  }

  function emptyDeviceProfile(courses) {
    return {
      version: PROFILE_VERSION,
      currentDistrictId: null,
      lastVisitedLocationId: null,
      souvenirs: [],
      completedStages: emptyStageMap(courses),
      courseRevealSeen: emptyStageMap(courses),
      pendingMapChanges: emptyStageMap(courses),
      mapChangeSeen: emptyStageMap(courses)
    };
  }

  function normalizeDeviceProfile(raw, courses) {
    const profile = emptyDeviceProfile(courses);
    const object = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : null;
    const sourceVersion = object?.version === 1 || object?.version === PROFILE_VERSION
      ? object.version
      : null;
    if (!sourceVersion || !object.completedStages || typeof object.completedStages !== 'object') {
      return profile;
    }

    const knownDistricts = new Set(districtIds(courses));
    if (knownDistricts.has(object.currentDistrictId)) profile.currentDistrictId = object.currentDistrictId;
    if (findMapCourse(courses, object.lastVisitedLocationId)) {
      profile.lastVisitedLocationId = object.lastVisitedLocationId;
    }

    for (const course of mapCourses(courses)) {
      const order = stageIds(course);
      const completed = orderedKnown(object.completedStages?.[course.id], order);
      profile.completedStages[course.id] = completed;
      if (sourceVersion === 1) {
        // Existing progress predates growth reveals and must never trigger a retroactive reward.
        profile.courseRevealSeen[course.id] = [...completed];
        profile.mapChangeSeen[course.id] = [...completed];
      } else {
        profile.courseRevealSeen[course.id] = orderedKnown(object.courseRevealSeen?.[course.id], order);
        profile.pendingMapChanges[course.id] = orderedKnown(object.pendingMapChanges?.[course.id], order)
          .filter(id => completed.includes(id));
        profile.mapChangeSeen[course.id] = orderedKnown(object.mapChangeSeen?.[course.id], order);
      }
    }
    refreshSouvenirs(profile, courses, object.souvenirs);
    return profile;
  }

  function parseProfile(encoded, courses) {
    if (encoded === null) return emptyDeviceProfile(courses);
    try {
      return normalizeDeviceProfile(JSON.parse(encoded), courses);
    } catch {
      return emptyDeviceProfile(courses);
    }
  }

  function readProfile(storage, courses) {
    if (!storage) return { profile: emptyDeviceProfile(courses), encoded: null, readable: false };
    try {
      const encoded = storage.getItem(PROFILE_KEY);
      return { profile: parseProfile(encoded, courses), encoded, readable: true };
    } catch {
      return { profile: emptyDeviceProfile(courses), encoded: null, readable: false };
    }
  }

  function persistProfile(storage, profile) {
    if (!storage) return false;
    try {
      storage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch {
      return false;
    }
  }

  function addOrdered(list, id, order) {
    return orderedKnown([...(Array.isArray(list) ? list : []), id], order);
  }

  function mergeProvenStages(profile, course, progress) {
    const order = stageIds(course);
    const completed = new Set(profile.completedStages[course.id] || []);
    for (const id of order) {
      if (progress?.ratings?.[id] <= 0 || completed.has(id)) continue;
      completed.add(id);
      // A stage discovered during initialization is historical. It should not replay a reveal.
      profile.courseRevealSeen[course.id] = addOrdered(profile.courseRevealSeen[course.id], id, order);
      profile.mapChangeSeen[course.id] = addOrdered(profile.mapChangeSeen[course.id], id, order);
    }
    profile.completedStages[course.id] = order.filter(id => completed.has(id));
  }

  function initializeDeviceProfile({ storage, courses }) {
    const read = readProfile(storage, courses);
    const profile = read.profile;
    if (!storageApi || !storage) return { profile, persisted: false };

    let persisted = read.readable;
    for (const course of mapCourses(courses)) {
      if (!course.progress) continue;
      const loaded = storageApi.loadProgress({
        storage,
        key: course.progress.key,
        legacyKey: course.progress.legacyKey,
        ids: course.progress.ids,
        legacyMode: course.progress.legacyMode
      });
      persisted = persisted && loaded.persisted;
      mergeProvenStages(profile, course, loaded.progress);
    }
    refreshSouvenirs(profile, courses);

    const normalized = JSON.stringify(profile);
    if (read.encoded !== normalized) persisted = persistProfile(storage, profile) && persisted;
    return { profile, persisted };
  }

  function recordStageCompletion({
    storage,
    courses,
    courseId,
    stageId,
    previousRating,
    nextRating,
    progressPersisted
  }) {
    const read = readProfile(storage, courses);
    const course = findMapCourse(courses, courseId);
    const order = stageIds(course);
    const validTransition = Boolean(course) && order.includes(stageId) &&
      Number(previousRating) <= 0 && Number(nextRating) > 0 && progressPersisted === true;
    const alreadyCompleted = read.profile.completedStages[courseId]?.includes(stageId) === true;
    if (!validTransition || alreadyCompleted) {
      return {
        profile: read.profile,
        persisted: read.readable && Boolean(storage),
        firstCompletion: false,
        shouldReveal: false
      };
    }

    const nextProfile = normalizeDeviceProfile(read.profile, courses);
    nextProfile.completedStages[courseId] = addOrdered(nextProfile.completedStages[courseId], stageId, order);
    nextProfile.pendingMapChanges[courseId] = addOrdered(nextProfile.pendingMapChanges[courseId], stageId, order);
    refreshSouvenirs(nextProfile, courses);
    const persisted = persistProfile(storage, nextProfile);
    if (!persisted) {
      return { profile: read.profile, persisted: false, firstCompletion: false, shouldReveal: false };
    }
    return {
      profile: nextProfile,
      persisted: true,
      firstCompletion: true,
      shouldReveal: !nextProfile.courseRevealSeen[courseId].includes(stageId)
    };
  }

  function markCourseRevealSeen({ storage, courses, courseId, stageId }) {
    const read = readProfile(storage, courses);
    const course = findMapCourse(courses, courseId);
    const order = stageIds(course);
    if (!course || !order.includes(stageId) || !read.profile.completedStages[courseId].includes(stageId)) {
      return { profile: read.profile, persisted: false };
    }
    const nextProfile = normalizeDeviceProfile(read.profile, courses);
    nextProfile.courseRevealSeen[courseId] = addOrdered(nextProfile.courseRevealSeen[courseId], stageId, order);
    return { profile: nextProfile, persisted: persistProfile(storage, nextProfile) };
  }

  function recordLocationVisit({ storage, courses, courseId }) {
    const read = readProfile(storage, courses);
    const course = findMapCourse(courses, courseId);
    if (!course) return { profile: read.profile, persisted: false };
    const nextProfile = normalizeDeviceProfile(read.profile, courses);
    nextProfile.currentDistrictId = course.map.districtId;
    nextProfile.lastVisitedLocationId = course.id;
    return { profile: nextProfile, persisted: persistProfile(storage, nextProfile) };
  }

  function consumeMapChanges({ storage, courses, courseId }) {
    const read = readProfile(storage, courses);
    const course = findMapCourse(courses, courseId);
    if (!course) return { profile: read.profile, persisted: false, consumedStageIds: [] };
    const order = stageIds(course);
    const pending = orderedKnown(read.profile.pendingMapChanges[courseId], order);
    if (pending.length === 0) {
      return { profile: read.profile, persisted: true, consumedStageIds: [] };
    }
    const nextProfile = normalizeDeviceProfile(read.profile, courses);
    nextProfile.pendingMapChanges[courseId] = [];
    nextProfile.mapChangeSeen[courseId] = orderedKnown([
      ...nextProfile.mapChangeSeen[courseId],
      ...pending
    ], order);
    const persisted = persistProfile(storage, nextProfile);
    return {
      profile: persisted ? nextProfile : read.profile,
      persisted,
      consumedStageIds: persisted ? pending : []
    };
  }

  function visitDistrict({ storage, courses, profile, districtId }) {
    const normalized = normalizeDeviceProfile(profile, courses);
    if (!districtIds(courses).includes(districtId)) return { profile: normalized, persisted: false };
    normalized.currentDistrictId = districtId;
    return { profile: normalized, persisted: persistProfile(storage, normalized) };
  }

  function ownedStorageKeys(courses) {
    const keys = new Set([PROFILE_KEY]);
    for (const course of Array.isArray(courses) ? courses : []) {
      if (course?.progress?.key) keys.add(course.progress.key);
      if (course?.progress?.legacyKey) keys.add(course.progress.legacyKey);
      if (course?.progress?.learningKey) keys.add(course.progress.learningKey);
    }
    return [...keys];
  }

  function restartAdventure({ storage, courses }) {
    const profile = emptyDeviceProfile(courses);
    if (!storage) return { profile, cleared: false, persisted: false };
    let cleared = true;
    for (const key of ownedStorageKeys(courses)) {
      try { storage.removeItem(key); } catch { cleared = false; }
    }
    return { profile, cleared, persisted: persistProfile(storage, profile) };
  }

  return Object.freeze({
    PROFILE_VERSION,
    PROFILE_KEY,
    hasSouvenir,
    initializeDeviceProfile,
    recordStageCompletion,
    markCourseRevealSeen,
    recordLocationVisit,
    consumeMapChanges,
    visitDistrict,
    restartAdventure
  });
});
