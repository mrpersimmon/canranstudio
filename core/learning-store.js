(function attachLearningStore(root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningStore = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningStoreFactory(root) {
  'use strict';

  const table = typeof module === 'object' && module.exports ? require('./course-catalog-wire') : root.CanranCore.courseCatalogWire;

  function decodeEnvelope(raw) {
    const envelope=JSON.parse(raw);
    if(envelope?.encoding===undefined)return envelope;
    if(envelope.encoding!=='record-table-v1'||!isValidEnvelope(envelope))throw Error('Invalid record encoding');
    return {revision:envelope.revision,value:table.decode(envelope.value)};
  }

  function encodeEnvelope(envelope) {
    const plain=JSON.stringify(envelope),value=envelope.value;
    // Keep original migration/quarantine bytes untouched. Only new, large
    // archived records share repeated strings and subtrees on disk.
    if(plain.length<65536||!(value?.keyboardArchive||value?.resetBackup?.record?.keyboardArchive))return plain;
    const packed=JSON.stringify({revision:envelope.revision,encoding:'record-table-v1',value:table.encode(value)});
    return packed.length<plain.length?packed:plain;
  }

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
    const records = new Map(Object.entries(seed).map(([key,value]) => [key,JSON.stringify(value)]));
    return createLocalStorageAdapter({getItem:key=>records.get(key)??null,setItem:(key,value)=>records.set(key,String(value)),removeItem:key=>records.delete(key)});
  }

  function createLocalStorageAdapter(storage) {
    const readRaw = key => storage.getItem(key);
    function verifiedWrite(key, raw) {
      storage.setItem(key,raw);
      if (readRaw(key) !== raw) throw new Error('Storage readback differs');
    }
    const draftReads = new Map();
    return Object.freeze({
      decodeEnvelope,
      inspect(key) {
        try { return {status:'ok',raw:readRaw(key),backup:readRaw(key+':recovery:backup'),migration:readRaw(key+':recovery:migration')}; }
        catch { return {status:'unavailable'}; }
      },
      checkpoint(key, {expectedRevision, migration = false}) {
        try {
          const raw = readRaw(key);
          if (raw === null) return {status:'ok'};
          const record = JSON.parse(raw);
          if (!isValidEnvelope(record) || record.revision !== expectedRevision) return {status:'conflict'};
          const backupKey = key+':recovery:'+(migration?'migration':'backup');
          if (!migration || readRaw(backupKey) === null) verifiedWrite(backupKey,raw);
          return {status:readRaw(key)===raw?'ok':'conflict'};
        } catch { return {status:'unavailable'}; }
      },
      recover(key, {expectedRaw,value}) {
        try {
          if (readRaw(key) !== expectedRaw) return {status:'conflict',persisted:false};
          if (expectedRaw !== null) verifiedWrite(key+':recovery:quarantine',expectedRaw);
          // Recheck after the backup write; a competing tab must not be erased.
          if (readRaw(key) !== expectedRaw) return {status:'conflict',persisted:false};
          let old; try { old=JSON.parse(expectedRaw); } catch {}
          const next={revision:(isValidEnvelope(old)?old.revision:0)+1,value:clone(value)};
          verifiedWrite(key,encodeEnvelope(next));
          return {status:'committed',persisted:true,...next};
        } catch { return {status:'unavailable',persisted:false}; }
      },
      loadDraft(key) {
        try {
          const raw=readRaw(key+':draft'); draftReads.set(key,raw);
          if (raw===null) return {status:'ok',value:null};
          const value=JSON.parse(raw);
          return {status:'ok',value};
        } catch { return {status:'unavailable',value:null}; }
      },
      saveDraft(key, value) {
        try {
          const primary=readRaw(key),envelope=primary===null?null:JSON.parse(primary);
          if((envelope?.revision||0)!==value.baseRevision)return {status:'conflict'};
          const raw=readRaw(key+':draft');
          if (draftReads.has(key) && draftReads.get(key)!==raw) return {status:'conflict'};
          const encoded=JSON.stringify(value);
          verifiedWrite(key+':draft',encoded); draftReads.set(key,encoded);
          return {status:'ok'};
        } catch { return {status:'unavailable'}; }
      },
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
          record = decodeEnvelope(encoded);
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
            stored = decodeEnvelope(encoded);
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
        const nextEncoded = encodeEnvelope(record);
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
