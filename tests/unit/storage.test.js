'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  VERSION,
  normalizeProgress,
  loadProgress,
  saveProgress
} = require('../../core/storage');

const IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];

function memoryStorage(seed = {}, failure = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem(key) {
      if (failure.get) throw new Error('get blocked');
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      if (failure.set) throw new Error('set blocked');
      data.set(key, String(value));
    },
    removeItem(key) {
      if (failure.remove) throw new Error('remove blocked');
      data.delete(key);
    }
  };
}

test('normalizeProgress accepts only finite integer ratings in range', () => {
  assert.deepEqual(
    normalizeProgress({
      version: 2,
      ratings: { l1: -1, l2: '2.9', l3: 999, l4: null, l5: [] }
    }, IDS),
    {
      version: VERSION,
      ratings: { l1: 0, l2: 2, l3: 3, l4: 0, l5: 0 }
    }
  );
});

test('loadProgress migrates and removes legacy level ratings only after v2 write', () => {
  const storage = memoryStorage({
    'l49-stars-v1': JSON.stringify({ l1: 1, l2: -8, l3: 2, l4: 4, l5: 3 })
  });

  const result = loadProgress({
    storage,
    key: 'canran:l49:progress:v2',
    legacyKey: 'l49-stars-v1',
    ids: IDS,
    legacyMode: 'ratings'
  });

  assert.equal(result.migrated, true);
  assert.equal(result.persisted, true);
  assert.deepEqual(result.progress.ratings, { l1: 1, l2: 0, l3: 2, l4: 3, l5: 3 });
  assert.equal(storage.getItem('l49-stars-v1'), null);
});

test('loadProgress resets soundmark legacy totals without inferring achievements', () => {
  const storage = memoryStorage({ 'phonics-magic-stars-v1': '12' });
  const result = loadProgress({
    storage,
    key: 'canran:soundmark:progress:v2',
    legacyKey: 'phonics-magic-stars-v1',
    ids: ['vs', 'g1', 'g2', 'g3'],
    legacyMode: 'reset'
  });

  assert.equal(result.resetLegacy, true);
  assert.deepEqual(result.progress.ratings, { vs: 0, g1: 0, g2: 0, g3: 0 });
  assert.equal(storage.getItem('phonics-magic-stars-v1'), null);
});

test('invalid JSON is repaired instead of escaping to page initialization', () => {
  const storage = memoryStorage({ 'canran:l50:progress:v2': '{broken' });
  const result = loadProgress({
    storage,
    key: 'canran:l50:progress:v2',
    ids: IDS
  });

  assert.equal(result.repaired, true);
  assert.deepEqual(result.progress.ratings, { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 });
  assert.doesNotThrow(() => JSON.parse(storage.getItem('canran:l50:progress:v2')));
});

test('storage write failure returns normalized in-memory progress and preserves legacy', () => {
  const storage = memoryStorage(
    { 'l49-stars-v1': JSON.stringify({ l1: 2 }) },
    { set: true }
  );
  const result = loadProgress({
    storage,
    key: 'canran:l49:progress:v2',
    legacyKey: 'l49-stars-v1',
    ids: IDS,
    legacyMode: 'ratings'
  });

  assert.equal(result.persisted, false);
  assert.equal(result.progress.ratings.l1, 2);
  assert.notEqual(storage.getItem('l49-stars-v1'), null);
});

test('saveProgress never persists out-of-range ratings', () => {
  const storage = memoryStorage();
  const result = saveProgress({
    storage,
    key: 'canran:l49:progress:v2',
    progress: { version: 2, ratings: { l1: 99, l2: -1 } },
    ids: IDS
  });

  assert.equal(result.persisted, true);
  assert.deepEqual(
    JSON.parse(storage.getItem('canran:l49:progress:v2')).ratings,
    { l1: 3, l2: 0, l3: 0, l4: 0, l5: 0 }
  );
});
