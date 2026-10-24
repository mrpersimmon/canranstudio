'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { createHash, webcrypto, randomUUID } = require('node:crypto');

const source = fs.readFileSync(require('node:path').join(__dirname, '../../core/course-cache.js'), 'utf8');
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; };
function cacheFixture(disk, database) {
  const base = '/cancel-' + randomUUID() + '/', bytes = Buffer.from('verified course font');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const item = { key: base + 'font.woff2', url: base + 'resources/' + sha256 + '/font.woff2', type: 'font/woff2', bytes: bytes.length, sha256 };
  let downloads = 0;
  const root = { navigator: { locks: navigator.locks }, location: { origin: 'https://course.test' } };
  const sandbox = { self: root, crypto: webcrypto, URL, Response, DOMException, AbortController, Uint8Array,
    setTimeout, clearTimeout, indexedDB: { open() {
      if (!database) throw new Error('No database needed for resource-lock tests');
      const request = { result: database }; queueMicrotask(() => request.onsuccess()); return request;
    } },
    caches: { open: async () => disk }, fetch: async () => { downloads++; return new Response(bytes, { headers: { 'Content-Type': item.type } }); } };
  vm.runInNewContext(source, sandbox);
  return { store: root.CanranCourseCache.open(base), item, bytes, downloads: () => downloads,
    repeatScript() { vm.runInNewContext(source, sandbox); return root.CanranCourseCache.open(base); } };
}

test('leaving a directory releases a lock waiting on cache reads and discards the late result', async () => {
  const reading = deferred(), late = deferred(); let reads = 0, writes = 0, deletes = 0;
  const { store, item, downloads } = cacheFixture({
    async match() { if (++reads === 2) { reading.resolve(); return late.promise; } return undefined; },
    async put() { writes++; }, async delete() { deletes++; }
  });
  const controller = new AbortController(), work = store.obtain(item, { signal: controller.signal });
  await reading.promise;
  controller.abort();
  await assert.rejects(work, { name: 'AbortError' });
  assert.equal((await navigator.locks.query()).held.some(lock => lock.name === store.prefix + ':' + item.sha256), false);
  late.resolve(new Response('invalid old result'));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(deletes, 0); assert.equal(writes, 0); assert.equal(downloads(), 0); assert.equal(store.memory.size, 0);
  // A fresh visit can acquire the same resource; the cancelled task is gone.
  assert.equal((await store.obtain(item)).byteLength, item.bytes);
  assert.equal(downloads(), 1); assert.equal(writes, 1);
});

test('leaving while queued for another page resource lock cancels without a download', async () => {
  const entered = deferred(), release = deferred();
  const { store, item, downloads } = cacheFixture({ match: async () => undefined, put: async () => {} });
  const name = store.prefix + ':' + item.sha256;
  const owner = navigator.locks.request(name, async () => { entered.resolve(); await release.promise; });
  await entered.promise;
  const controller = new AbortController(), waiting = store.obtain(item, { signal: controller.signal });
  await new Promise(resolve => setImmediate(resolve));
  controller.abort();
  await assert.rejects(waiting, { name: 'AbortError' });
  assert.equal(downloads(), 0);
  release.resolve(); await owner;
  await new Promise(resolve => setImmediate(resolve));
  assert.equal((await navigator.locks.query()).pending.some(lock => lock.name === name), false);
  assert.equal(downloads(), 0);
});

test('cancelling an in-flight cache write waits for its real completion before releasing the lock', async () => {
  const writing = deferred(), finish = deferred(); let committed = false, settled = false;
  const { store, item } = cacheFixture({ match: async () => undefined,
    async put() { writing.resolve(); await finish.promise; committed = true; } });
  const controller = new AbortController(), work = store.obtain(item, { signal: controller.signal });
  work.then(() => { settled = true; }, () => { settled = true; });
  await writing.promise;
  controller.abort();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(settled, false); assert.equal(committed, false);
  const name = store.prefix + ':' + item.sha256;
  assert.equal((await navigator.locks.query()).held.some(lock => lock.name === name), true);
  finish.resolve();
  await assert.rejects(work, { name: 'AbortError' });
  assert.equal(committed, true);
  assert.equal((await navigator.locks.query()).held.some(lock => lock.name === name), false);
});

test('a late script after retry keeps the same cache memory and task registry', async () => {
  const fixture = cacheFixture({ match: async () => undefined, put: async () => {} });
  await fixture.store.obtain(fixture.item);
  const same = fixture.repeatScript();
  assert.equal(same, fixture.store);
  await same.obtain(fixture.item);
  assert.equal(fixture.downloads(), 1);
});

test('a transaction error without an error object still rejects the original no-signal put', async () => {
  const database = { transaction() {
    const transaction = { error: null, objectStore: () => ({ put() { queueMicrotask(() => transaction.onerror()); } }) };
    return transaction;
  } };
  const { store } = cacheFixture({}, database);
  await assert.rejects(store.put('meta', 'lease', {}), error => error === null);
});
