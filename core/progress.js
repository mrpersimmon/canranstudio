(function attachProgress(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.progress = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function progressFactory() {
  'use strict';

  function clampRating(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(3, Math.trunc(number)));
  }

  function ratingFor(score, bands) {
    const number = Number(score);
    if (!Number.isFinite(number)) return 0;
    for (const band of bands) {
      if (number >= band.min) return clampRating(band.rating);
    }
    return 0;
  }

  function awardRating(ratings, id, rating) {
    const current = clampRating(ratings[id]);
    const candidate = clampRating(rating);
    if (candidate <= current) return { ratings: { ...ratings }, changed: false };
    return { ratings: { ...ratings, [id]: candidate }, changed: true };
  }

  function totalRatings(ratings, ids) {
    return ids.reduce((total, id) => total + clampRating(ratings[id]), 0);
  }

  function allAtLeast(ratings, ids, minimum) {
    const required = clampRating(minimum);
    return ids.every(id => clampRating(ratings[id]) >= required);
  }

  return Object.freeze({ ratingFor, awardRating, totalRatings, allAtLeast });
});
