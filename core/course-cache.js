(function (root) {
  'use strict';
  const stores = new Map();
  const digest = async buffer => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buffer)), value => value.toString(16).padStart(2, '0')).join('');
  const delay = time => new Promise(resolve => setTimeout(resolve, time));
  function open(base) {
    if (stores.has(base)) return stores.get(base);
    const prefix = 'canran:' + (base === '/' ? 'preview-root' : base.slice(1, -1).replaceAll('/', ':')) + ':course-cache:v1';
    const memory = new Map(), tasks = new Map();
    const cacheKey = item => base + 'resources/' + item.sha256;
    const maintain = work => root.navigator?.locks ? root.navigator.locks.request(prefix + ':maintenance', work) : work();
    let persistent = true;
    const database = new Promise((resolve, reject) => {
      const request = indexedDB.open(prefix, 1);
      request.onupgradeneeded = () => { for (const name of ['packages', 'meta', 'pins']) request.result.createObjectStore(name); };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('课程存储暂不可用'));
    }).catch(() => { persistent = false; return null; });
    const cache = Promise.resolve().then(() => caches.open(prefix)).catch(() => { persistent = false; return null; });
    async function get(table, key) {
      const db = await database;
      if (!db) return null;
      return new Promise((resolve, reject) => {
        const request = db.transaction(table).objectStore(table).get(key);
        request.onsuccess = () => resolve(request.result || null); request.onerror = () => reject(request.error);
      }).catch(() => { persistent = false; return null; });
    }
    async function put(table, key, value) {
      const db = await database;
      if (!db) return false;
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, 'readwrite'); transaction.objectStore(table).put(value, key);
        transaction.oncomplete = () => resolve(true); transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error);
      });
    }
    async function remove(table, key) {
      const db = await database;
      if (!db) return;
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(table, 'readwrite'); transaction.objectStore(table).delete(key);
        transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error);
      });
    }
    async function all(table) {
      const db = await database;
      if (!db) return [];
      return new Promise((resolve, reject) => {
        const request = db.transaction(table).objectStore(table).getAll();
        request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
    }
    function validateItem(item) {
      const url = new URL(item.url, root.location.origin);
      if (url.origin !== root.location.origin || !url.pathname.startsWith(base + 'resources/' + item.sha256 + '/') || !/^[a-f0-9]{64}$/.test(item.sha256) || !Number.isSafeInteger(item.bytes) || item.bytes < 1) throw new Error('无效课程资源');
    }
    async function validBuffer(response, item) {
      if (!response?.ok || response.status !== 200) return null;
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength !== item.bytes || await digest(buffer) !== item.sha256) return null;
      return buffer;
    }
    async function cached(item) {
      validateItem(item);
      if (memory.has(item.sha256)) return memory.get(item.sha256);
      const disk = await cache;
      if (!disk) return null;
      const response = await disk.match(cacheKey(item)).catch(() => null);
      if (!response) return null;
      const buffer = await validBuffer(response, item);
      if (!buffer) { await disk.delete(cacheKey(item)); return null; }
      memory.set(item.sha256, buffer);
      return buffer;
    }
    async function download(item, signal) {
      let lastError;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (signal?.aborted) throw new DOMException('已取消准备', 'AbortError');
        const controller = new AbortController();
        const cancel = () => controller.abort(); signal?.addEventListener('abort', cancel, { once: true });
        let timer;
        const reset = () => { clearTimeout(timer); timer = setTimeout(cancel, 15000); }; reset();
        try {
          const response = await fetch(item.url, { signal: controller.signal, cache: 'no-cache', credentials: 'same-origin' });
          const receivedType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
          const expectedType = item.type.split(';')[0];
          const compatible = receivedType === expectedType || expectedType === 'text/javascript' && receivedType === 'application/javascript';
          if (response.status !== 200 || !compatible) throw new Error('资源未正确返回');
          const reader = response.body.getReader(), chunks = []; let size = 0;
          for (;;) {
            const value = await reader.read(); if (value.done) break;
            reset(); chunks.push(value.value); size += value.value.byteLength;
            if (size > item.bytes) { await reader.cancel(); throw new Error('资源大小不正确'); }
          }
          const bytes = new Uint8Array(size); let offset = 0;
          for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
          if (size !== item.bytes || await digest(bytes.buffer) !== item.sha256) throw new Error('资源校验失败');
          memory.set(item.sha256, bytes.buffer);
          const disk = await cache;
          if (disk) {
            const save = () => disk.put(cacheKey(item), new Response(bytes, { headers: { 'Content-Type': item.type, 'Content-Length': String(item.bytes), 'X-Course-Hash': item.sha256 } }));
            try { await save(); }
            catch {
              try { if (!api.onQuota) throw new Error('No cleanup available'); await api.onQuota(); await save(); }
              catch { persistent = false; }
            }
          }
          return bytes.buffer;
        } catch (error) { lastError = error; if (signal?.aborted) throw error; }
        finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel); }
        if (attempt < 2) await delay(350 * (attempt + 1));
      }
      throw lastError;
    }
    async function obtain(item, { signal, network = true } = {}) {
      const found = await cached(item); if (found) return found;
      if (!network) return null;
      if (!tasks.has(item.sha256)) {
        const work = async () => await cached(item) || download(item, signal);
        const promise = root.navigator?.locks ? root.navigator.locks.request(prefix + ':' + item.sha256, work) : work();
        tasks.set(item.sha256, promise);
        promise.finally(() => tasks.delete(item.sha256)).catch(() => {});
      }
      return tasks.get(item.sha256);
    }
    const key = pack => pack.id + '@' + pack.revision;
    async function current(id) {
      const revision = await get('meta', 'active:' + id);
      const withdrawn = await get('meta', 'withdrawn') || [];
      if (!revision || withdrawn.includes(id + '@' + revision)) return null;
      const pack = await get('packages', id + '@' + revision);
      return pack?.protocol === 1 && pack.basePath === base ? pack : null;
    }
    async function commit(pack, activate = true) {
      const db = await database, disk = await cache;
      if (!db || !disk || !persistent) return false;
      for (const item of pack.required) if (!await disk.match(cacheKey(item))) return false;
      try {
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(['packages', 'meta'], 'readwrite');
          transaction.objectStore('packages').put({ ...pack, lastUsed: Date.now() }, key(pack));
          if (activate) transaction.objectStore('meta').put(pack.revision, 'active:' + pack.id);
          transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error);
        });
        return true;
      } catch { persistent = false; return false; }
    }
    async function prune(protectedKeys, manual = false, budget = 128 * 1024 * 1024) {
      const disk = await cache;
      if (!disk) return;
      const packages = await all('packages'), leases = (await all('meta')).filter(value => value?.expires > Date.now() && Array.isArray(value.resources));
      const retained = new Map(packages.map(pack => [key(pack), pack]));
      for (const lease of leases) if (lease.pack) protectedKeys.add(lease.pack);
      const referenced = () => new Set([...retained.values()].flatMap(pack => [...pack.required, ...pack.audio].map(item => item.sha256)).concat(leases.flatMap(lease => lease.resources)));
      const sizes = new Map(packages.flatMap(pack => [...pack.required, ...pack.audio].map(item => [item.sha256, item.bytes])));
      let total = [...referenced()].reduce((sum, value) => sum + (sizes.get(value) || 0), 0);
      for (const pack of [...packages].sort((a, b) => a.lastUsed - b.lastUsed)) {
        if (!manual && total <= budget) break;
        if (protectedKeys.has(key(pack))) continue;
        retained.delete(key(pack));
        await remove('packages', key(pack));
        if (await get('meta', 'active:' + pack.id) === pack.revision) await remove('meta', 'active:' + pack.id);
        total = [...referenced()].reduce((sum, value) => sum + (sizes.get(value) || 0), 0);
      }
      const keep = referenced();
      for (const request of await disk.keys()) {
        const sha = new URL(request.url).pathname.split('/').pop();
        if (!keep.has(sha)) { await disk.delete(request); memory.delete(sha); }
      }
    }
    const api = { base, prefix, digest, obtain, cached, current, commit: (pack, activate = true) => maintain(() => commit(pack, activate)), maintain, get, put, remove, all, prune, database, cache, memory, get persistent() { return persistent; } };
    stores.set(base, api); return api;
  }
  root.CanranCourseCache = { open, digest };
})(typeof self !== 'undefined' ? self : globalThis);
