(function attachStorage(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.storage = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function storageFactory() {
  'use strict';

  const VERSION = 2;

  function clampRating(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(3, Math.trunc(value)));
  }

  function clampLegacyRating(value) {
    if (typeof value === 'number') return clampRating(value);
    if (typeof value !== 'string' || value.trim() === '') return 0;
    const number = Number(value);
    return clampRating(number);
  }

  function emptyProgress(ids) {
    return {
      version: VERSION,
      ratings: Object.fromEntries(ids.map(id => [id, 0]))
    };
  }

  function normalizeRatings(source, ids, normalizeRating) {
    const progress = emptyProgress(ids);
    for (const id of ids) progress.ratings[id] = normalizeRating(source[id]);
    return progress;
  }

  function normalizeProgress(raw, ids) {
    const object = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const source = object.version === VERSION &&
      object.ratings &&
      typeof object.ratings === 'object' &&
      !Array.isArray(object.ratings)
      ? object.ratings
      : {};
    return normalizeRatings(source, ids, clampRating);
  }

  function normalizeLegacyProgress(raw, ids) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    return normalizeRatings(source, ids, clampLegacyRating);
  }

  function parseJson(text) {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch {
      return { ok: false, value: null };
    }
  }

  function loadProgress({
    storage,
    key,
    legacyKey = null,
    ids,
    legacyMode = 'ratings'
  }) {
    let raw = null;
    let encodedV2 = null;
    let migrated = false;
    let repaired = false;
    let resetLegacy = false;
    let readable = true;
    let legacyRatings = false;

    try {
      encodedV2 = storage.getItem(key);
      if (encodedV2 !== null) {
        const parsed = parseJson(encodedV2);
        raw = parsed.value;
        repaired = !parsed.ok;
      } else if (legacyKey) {
        const encodedLegacy = storage.getItem(legacyKey);
        if (encodedLegacy !== null) {
          migrated = true;
          if (legacyMode === 'reset') {
            resetLegacy = true;
          } else {
            const parsed = parseJson(encodedLegacy);
            raw = parsed.value;
            repaired = !parsed.ok;
            legacyRatings = true;
          }
        }
      }
    } catch {
      readable = false;
    }

    const progress = legacyRatings
      ? normalizeLegacyProgress(raw, ids)
      : normalizeProgress(raw, ids);
    const normalizedText = JSON.stringify(progress);
    let persisted = false;

    if (readable) {
      try {
        if (encodedV2 !== normalizedText) {
          storage.setItem(key, normalizedText);
          if (encodedV2 !== null) repaired = true;
        }
        persisted = true;
        if (migrated && legacyKey) storage.removeItem(legacyKey);
      } catch {
        persisted = false;
      }
    }

    return { progress, migrated, repaired, resetLegacy, persisted };
  }

  function saveProgress({ storage, key, progress, ids }) {
    const normalized = normalizeProgress(progress, ids);
    try {
      storage.setItem(key, JSON.stringify(normalized));
      return { progress: normalized, persisted: true };
    } catch {
      return { progress: normalized, persisted: false };
    }
  }

  return Object.freeze({
    VERSION,
    clampRating,
    emptyProgress,
    normalizeProgress,
    loadProgress,
    saveProgress
  });
});
