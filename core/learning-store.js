(function attachLearningStore(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningStore = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningStoreFactory() {
  'use strict';

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isValidEnvelope(record) {
    return Boolean(record) &&
      typeof record === 'object' &&
      !Array.isArray(record) &&
      Number.isSafeInteger(record.revision) &&
      record.revision > 0 &&
      Object.prototype.hasOwnProperty.call(record, 'value');
  }

  function createMemoryAdapter(seed = {}) {
    const records = new Map();
    for (const [key, record] of Object.entries(seed)) records.set(key, clone(record));
    return Object.freeze({
      load(key) {
        if (!records.has(key)) return { status: 'ok', revision: 0, value: null };
        const record = records.get(key);
        if (!isValidEnvelope(record)) return { status: 'corrupt', revision: 0, value: null };
        return { status: 'ok', revision: record.revision, value: clone(record.value) };
      },
      commit(key, { expectedRevision, value }) {
        const stored = records.get(key);
        const current = isValidEnvelope(stored) ? stored : { revision: 0, value: null };
        if (current.revision !== expectedRevision) {
          return {
            status: 'conflict',
            persisted: false,
            revision: current.revision,
            value: clone(current.value)
          };
        }
        const record = { revision: expectedRevision + 1, value: clone(value) };
        records.set(key, record);
        return {
          status: 'committed',
          persisted: true,
          revision: record.revision,
          value: clone(record.value)
        };
      }
    });
  }

  function createLocalStorageAdapter(storage) {
    return Object.freeze({
      load(key) {
        let encoded;
        try {
          encoded = storage.getItem(key);
        } catch {
          return { status: 'unavailable', revision: 0, value: null };
        }
        if (encoded === null) return { status: 'ok', revision: 0, value: null };
        let record;
        try {
          record = JSON.parse(encoded);
        } catch {
          return { status: 'corrupt', revision: 0, value: null };
        }
        if (!isValidEnvelope(record)) return { status: 'corrupt', revision: 0, value: null };
        return { status: 'ok', revision: record.revision, value: clone(record.value) };
      },
      commit(key, { expectedRevision, value }) {
        let encoded;
        try {
          encoded = storage.getItem(key);
        } catch {
          return {
            status: 'unavailable',
            persisted: false,
            revision: 0,
            value: null
          };
        }
        let stored = { revision: 0, value: null };
        if (encoded !== null) {
          try {
            stored = JSON.parse(encoded);
          } catch {
            stored = null;
          }
        }
        const current = isValidEnvelope(stored) ? stored : { revision: 0, value: null };
        if (current.revision !== expectedRevision) {
          return {
            status: 'conflict',
            persisted: false,
            revision: current.revision,
            value: clone(current.value)
          };
        }
        const record = { revision: expectedRevision + 1, value: clone(value) };
        const nextEncoded = JSON.stringify(record);
        try {
          storage.setItem(key, nextEncoded);
        } catch {
          return {
            status: 'unavailable',
            persisted: false,
            revision: current.revision,
            value: clone(current.value)
          };
        }
        try {
          if (storage.getItem(key) !== nextEncoded) {
            return {
              status: 'unavailable',
              persisted: false,
              revision: current.revision,
              value: clone(current.value)
            };
          }
        } catch {
          return {
            status: 'unavailable',
            persisted: false,
            revision: current.revision,
            value: clone(current.value)
          };
        }
        return {
          status: 'committed',
          persisted: true,
          revision: record.revision,
          value: clone(record.value)
        };
      }
    });
  }

  return Object.freeze({ createMemoryAdapter, createLocalStorageAdapter });
});
