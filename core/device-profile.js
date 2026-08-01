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

  const PROFILE_VERSION = 1;
  const PROFILE_KEY = 'canran:adventure-profile:v1';

  function mapCourses(courses) {
    return Array.isArray(courses)
      ? courses.filter(course => (
        course?.kind === 'lesson' && course.map?.v1Visible === true
      ))
      : [];
  }

  function stageIds(course) {
    return Array.isArray(course?.map?.stages)
      ? course.map.stages.map(stage => stage?.progressId).filter(Boolean)
      : [];
  }

  function districtIds(courses) {
    return [...new Set(
      mapCourses(courses).map(course => course.map.districtId).filter(Boolean)
    )];
  }

  function souvenirId(course) {
    return typeof course?.map?.souvenir?.id === 'string'
      ? course.map.souvenir.id
      : null;
  }

  function knownSouvenirIds(courses) {
    return [...new Set(mapCourses(courses).map(souvenirId).filter(Boolean))];
  }

  function hasSouvenir(profile, id) {
    return typeof id === 'string' &&
      Array.isArray(profile?.souvenirs) &&
      profile.souvenirs.includes(id);
  }

  function courseIsComplete(profile, course) {
    const required = stageIds(course);
    if (required.length === 0) return false;
    const completed = new Set(profile.completedStages[course.id] || []);
    return required.every(id => completed.has(id));
  }

  function refreshSouvenirs(profile, courses, sourceSouvenirs = profile.souvenirs) {
    const owned = new Set(
      Array.isArray(sourceSouvenirs)
        ? sourceSouvenirs.filter(id => typeof id === 'string')
        : []
    );
    for (const course of mapCourses(courses)) {
      const id = souvenirId(course);
      if (id && courseIsComplete(profile, course)) owned.add(id);
    }
    profile.souvenirs = knownSouvenirIds(courses).filter(id => owned.has(id));
  }

  function emptyDeviceProfile(courses) {
    return {
      version: PROFILE_VERSION,
      currentDistrictId: null,
      souvenirs: [],
      completedStages: Object.fromEntries(
        mapCourses(courses).map(course => [course.id, []])
      )
    };
  }

  function normalizeDeviceProfile(raw, courses) {
    const profile = emptyDeviceProfile(courses);
    const validProfile = raw && typeof raw === 'object' && !Array.isArray(raw) &&
      raw.version === PROFILE_VERSION &&
      raw.completedStages && typeof raw.completedStages === 'object' &&
      !Array.isArray(raw.completedStages);
    const source = validProfile ? raw.completedStages : {};
    const knownDistricts = new Set(districtIds(courses));
    if (validProfile && knownDistricts.has(raw.currentDistrictId)) {
      profile.currentDistrictId = raw.currentDistrictId;
    }

    for (const course of mapCourses(courses)) {
      const completed = Array.isArray(source[course.id]) ? source[course.id] : [];
      const completedSet = new Set(completed.filter(id => typeof id === 'string'));
      profile.completedStages[course.id] = stageIds(course)
        .filter(id => completedSet.has(id));
    }
    refreshSouvenirs(profile, courses, validProfile ? raw.souvenirs : []);
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

  function mergeProvenStages(profile, course, progress) {
    const completed = new Set(profile.completedStages[course.id] || []);
    for (const id of stageIds(course)) {
      if (progress?.ratings?.[id] > 0) completed.add(id);
    }
    profile.completedStages[course.id] = stageIds(course)
      .filter(id => completed.has(id));
  }

  function initializeDeviceProfile({ storage, courses }) {
    const blank = emptyDeviceProfile(courses);
    if (!storageApi || !storage) return { profile: blank, persisted: false };

    let encoded;
    try {
      encoded = storage.getItem(PROFILE_KEY);
    } catch {
      return { profile: blank, persisted: false };
    }

    const profile = parseProfile(encoded, courses);
    let persisted = true;
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
    if (encoded !== normalized) {
      try {
        storage.setItem(PROFILE_KEY, normalized);
      } catch {
        persisted = false;
      }
    }
    return { profile, persisted };
  }

  function visitDistrict({ storage, courses, profile, districtId }) {
    const normalized = normalizeDeviceProfile(profile, courses);
    if (!districtIds(courses).includes(districtId)) {
      return { profile: normalized, persisted: false };
    }
    normalized.currentDistrictId = districtId;
    if (!storage) return { profile: normalized, persisted: false };
    try {
      storage.setItem(PROFILE_KEY, JSON.stringify(normalized));
      return { profile: normalized, persisted: true };
    } catch {
      return { profile: normalized, persisted: false };
    }
  }

  function ownedStorageKeys(courses) {
    const keys = new Set([PROFILE_KEY]);
    for (const course of Array.isArray(courses) ? courses : []) {
      if (course?.progress?.key) keys.add(course.progress.key);
      if (course?.progress?.legacyKey) keys.add(course.progress.legacyKey);
    }
    return [...keys];
  }

  function restartAdventure({ storage, courses }) {
    const profile = emptyDeviceProfile(courses);
    if (!storage) return { profile, cleared: false, persisted: false };

    let cleared = true;
    for (const key of ownedStorageKeys(courses)) {
      try {
        storage.removeItem(key);
      } catch {
        cleared = false;
      }
    }

    let persisted = false;
    try {
      storage.setItem(PROFILE_KEY, JSON.stringify(profile));
      persisted = true;
    } catch {
      persisted = false;
    }
    return { profile, cleared, persisted };
  }

  return Object.freeze({
    PROFILE_VERSION,
    PROFILE_KEY,
    hasSouvenir,
    initializeDeviceProfile,
    visitDistrict,
    restartAdventure
  });
});
