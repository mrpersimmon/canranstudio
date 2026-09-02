'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {
  createInstaller,
  validateManifest,
  META_CACHE_NAME
} = require('../../core/course-package-installer');

const ORIGIN = 'https://course.test';
const SCOPE = `${ORIGIN}/poc/lesson/`;
const MANIFEST_URL = `${SCOPE}course-package-manifest.json`;

function digest(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function manifestFor(revision, files) {
  const entries = Object.entries(files).map(([url, body]) => {
    const bytes = Buffer.from(body);
    return {
      url,
      kind: url.endsWith('.mp3') ? 'audio' : 'runtime',
      bytes: bytes.byteLength,
      sha256: digest(bytes)
    };
  });
  return {
    schema: 1,
    packageId: `NCE-U01@${revision}`,
    unitId: 'NCE-U01',
    revision,
    scopePath: '/poc/lesson/',
    totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
    entries
  };
}

function manifestBytes(manifest) {
  return Buffer.from(`${JSON.stringify(manifest)}\n`);
}

function requestUrl(input) {
  return typeof input === 'string' ? input : input.url;
}

class MemoryCache {
  constructor() {
    this.responses = new Map();
  }

  async match(input, options = {}) {
    const url = requestUrl(input);
    if (!options.ignoreSearch) return this.responses.get(url)?.clone();
    const wanted = new URL(url);
    for (const [candidate, response] of this.responses) {
      const parsed = new URL(candidate);
      if (parsed.origin === wanted.origin && parsed.pathname === wanted.pathname) {
        return response.clone();
      }
    }
    return undefined;
  }

  async put(input, response) {
    this.responses.set(requestUrl(input), response.clone());
  }

  async delete(input) {
    return this.responses.delete(requestUrl(input));
  }

  async keys() {
    return [...this.responses.keys()].map(url => new Request(url));
  }
}

class MemoryCacheStorage {
  constructor() {
    this.caches = new Map();
  }

  async open(name) {
    if (!this.caches.has(name)) this.caches.set(name, new MemoryCache());
    return this.caches.get(name);
  }

  async keys() {
    return [...this.caches.keys()];
  }

  async delete(name) {
    return this.caches.delete(name);
  }
}

function fakeNetwork(manifest, files, options = {}) {
  const bytes = manifestBytes(manifest);
  const calls = [];
  const failures = new Map(Object.entries(options.failures || {}));
  const corrupt = new Set(options.corrupt || []);
  const fetch = async input => {
    const url = requestUrl(input);
    calls.push(url);
    if (url === MANIFEST_URL) {
      return new Response(bytes, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Content-Length': String(bytes.byteLength) }
      });
    }
    const remaining = Number(failures.get(url) || 0);
    if (remaining > 0) {
      failures.set(url, remaining - 1);
      throw new TypeError(`network failed for ${url}`);
    }
    const path = new URL(url).pathname;
    if (!Object.hasOwn(files, path)) return new Response('missing', { status: 404 });
    const body = Buffer.from(files[path]);
    if (corrupt.has(path) && body.length > 0) body[0] ^= 0xff;
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': path.endsWith('.mp3') ? 'audio/mpeg' : 'text/javascript',
        'Content-Length': String(body.byteLength)
      }
    });
  };
  return { fetch, calls, manifestHash: digest(bytes), corrupt };
}

function installerFor(cacheStorage, fetch) {
  return createInstaller({
    cacheStorage,
    fetch,
    crypto: globalThis.crypto,
    scopeUrl: SCOPE,
    origin: ORIGIN,
    maxConcurrency: 1
  });
}

async function activePointer(cacheStorage) {
  const meta = await cacheStorage.open(META_CACHE_NAME);
  const response = await meta.match(`${SCOPE}__course-package-active__`);
  return response ? response.json() : null;
}

test('course-package manifest validation rejects unsafe, duplicate, and unaccounted entries', () => {
  const files = {
    '/core/runtime.js': 'runtime-v1',
    '/poc/lesson/audio/line.mp3': 'audio-v1'
  };
  const manifest = manifestFor('v1', files);
  assert.deepEqual(validateManifest(manifest, { origin: ORIGIN, scopeUrl: SCOPE }), manifest);

  const duplicate = structuredClone(manifest);
  duplicate.entries.push({ ...duplicate.entries[0] });
  duplicate.totalBytes += duplicate.entries[0].bytes;
  assert.throws(
    () => validateManifest(duplicate, { origin: ORIGIN, scopeUrl: SCOPE }),
    /duplicate package URL/i
  );

  const crossOrigin = structuredClone(manifest);
  crossOrigin.entries[0].url = 'https://example.com/runtime.js';
  assert.throws(
    () => validateManifest(crossOrigin, { origin: ORIGIN, scopeUrl: SCOPE }),
    /same-origin/i
  );

  const wrongTotal = structuredClone(manifest);
  wrongTotal.totalBytes += 1;
  assert.throws(
    () => validateManifest(wrongTotal, { origin: ORIGIN, scopeUrl: SCOPE }),
    /totalBytes/i
  );
});

test('cold preparation verifies every byte before one atomic activation', async () => {
  const files = {
    '/core/runtime.js': 'runtime-v1',
    '/poc/lesson/audio/line.mp3': 'audio-v1'
  };
  const manifest = manifestFor('v1', files);
  const network = fakeNetwork(manifest, files);
  const cacheStorage = new MemoryCacheStorage();
  const progress = [];
  const result = await installerFor(cacheStorage, network.fetch).prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: network.manifestHash,
    onProgress: update => progress.push(update)
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.warm, false);
  assert.equal(result.preparedBytes, manifest.totalBytes);
  assert.deepEqual(network.calls, [
    MANIFEST_URL,
    `${ORIGIN}/core/runtime.js`,
    `${ORIGIN}/poc/lesson/audio/line.mp3`
  ]);
  assert.ok(progress.some(update => update.phase === 'checking'));
  assert.ok(progress.some(update => update.phase === 'downloading'));
  assert.equal(progress.at(-1).phase, 'ready');
  assert.equal(progress.at(-1).preparedBytes, manifest.totalBytes);
  assert.deepEqual(await activePointer(cacheStorage), {
    schema: 1,
    unitId: 'NCE-U01',
    packageId: 'NCE-U01@v1',
    revision: 'v1',
    cacheName: `course-package:NCE-U01@v1:${network.manifestHash.slice(0, 16)}`,
    manifestSha256: network.manifestHash,
    totalBytes: manifest.totalBytes
  });
});

test('an interrupted install retains verified files and resumes without downloading them again', async () => {
  const files = {
    '/core/runtime.js': 'runtime-v1',
    '/poc/lesson/audio/line.mp3': 'audio-v1'
  };
  const manifest = manifestFor('v1', files);
  const network = fakeNetwork(manifest, files, {
    failures: { [`${ORIGIN}/poc/lesson/audio/line.mp3`]: 1 }
  });
  const cacheStorage = new MemoryCacheStorage();
  const installer = installerFor(cacheStorage, network.fetch);

  await assert.rejects(
    installer.prepare({
      manifestUrl: MANIFEST_URL,
      expectedManifestSha256: network.manifestHash
    }),
    /network failed/i
  );
  assert.equal(await activePointer(cacheStorage), null);

  const resumed = await installer.prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: network.manifestHash
  });
  assert.equal(resumed.status, 'ready');
  assert.equal(
    network.calls.filter(url => url === `${ORIGIN}/core/runtime.js`).length,
    1
  );
  assert.equal(
    network.calls.filter(url => url === `${ORIGIN}/poc/lesson/audio/line.mp3`).length,
    2
  );
});

test('a corrupt response cannot activate and a clean retry replaces only that asset', async () => {
  const files = {
    '/core/runtime.js': 'runtime-v1',
    '/poc/lesson/audio/line.mp3': 'audio-v1'
  };
  const manifest = manifestFor('v1', files);
  const network = fakeNetwork(manifest, files, {
    corrupt: ['/poc/lesson/audio/line.mp3']
  });
  const cacheStorage = new MemoryCacheStorage();
  const installer = installerFor(cacheStorage, network.fetch);

  await assert.rejects(
    installer.prepare({
      manifestUrl: MANIFEST_URL,
      expectedManifestSha256: network.manifestHash
    }),
    /integrity/i
  );
  assert.equal(await activePointer(cacheStorage), null);

  network.corrupt.delete('/poc/lesson/audio/line.mp3');
  const result = await installer.prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: network.manifestHash
  });
  assert.equal(result.status, 'ready');
  assert.equal(
    network.calls.filter(url => url === `${ORIGIN}/core/runtime.js`).length,
    1
  );
});

test('a revision reuses unchanged verified bytes and keeps the old active package until switch', async () => {
  const v1Files = {
    '/core/runtime.js': 'runtime-v1',
    '/poc/lesson/audio/line.mp3': 'audio-shared'
  };
  const cacheStorage = new MemoryCacheStorage();
  const v1 = manifestFor('v1', v1Files);
  const v1Network = fakeNetwork(v1, v1Files);
  await installerFor(cacheStorage, v1Network.fetch).prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: v1Network.manifestHash
  });

  const v2Files = {
    '/core/runtime.js': 'runtime-v2',
    '/poc/lesson/audio/line.mp3': 'audio-shared'
  };
  const v2 = manifestFor('v2', v2Files);
  const failingV2 = fakeNetwork(v2, v2Files, {
    failures: { [`${ORIGIN}/core/runtime.js`]: 1 }
  });
  await assert.rejects(
    installerFor(cacheStorage, failingV2.fetch).prepare({
      manifestUrl: MANIFEST_URL,
      expectedManifestSha256: failingV2.manifestHash
    }),
    /network failed/i
  );
  assert.equal((await activePointer(cacheStorage)).packageId, 'NCE-U01@v1');

  const v2Network = fakeNetwork(v2, v2Files);
  const updated = await installerFor(cacheStorage, v2Network.fetch).prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: v2Network.manifestHash
  });
  assert.equal(updated.status, 'ready');
  assert.equal((await activePointer(cacheStorage)).packageId, 'NCE-U01@v2');
  assert.deepEqual(v2Network.calls, [MANIFEST_URL, `${ORIGIN}/core/runtime.js`]);
  assert.ok((await cacheStorage.keys()).includes(
    `course-package:NCE-U01@v1:${v1Network.manifestHash.slice(0, 16)}`
  ));
});

test('same-version warm preparation performs a manifest verdict without asset network misses', async () => {
  const files = {
    '/core/runtime.js': 'runtime-v1',
    '/poc/lesson/audio/line.mp3': 'audio-v1'
  };
  const manifest = manifestFor('v1', files);
  const network = fakeNetwork(manifest, files);
  const cacheStorage = new MemoryCacheStorage();
  const installer = installerFor(cacheStorage, network.fetch);
  await installer.prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: network.manifestHash
  });
  network.calls.length = 0;

  const warm = await installer.prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: network.manifestHash
  });
  assert.equal(warm.status, 'ready');
  assert.equal(warm.warm, true);
  assert.deepEqual(network.calls, [MANIFEST_URL]);
});

test('a corrupt active cache is rehashed and repaired in a separate cache before pointer switch', async () => {
  const files = {
    '/core/runtime.js': 'runtime-v1',
    '/poc/lesson/audio/line.mp3': 'audio-v1'
  };
  const manifest = manifestFor('v1', files);
  const initialNetwork = fakeNetwork(manifest, files);
  const cacheStorage = new MemoryCacheStorage();
  const installer = installerFor(cacheStorage, initialNetwork.fetch);
  await installer.prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: initialNetwork.manifestHash
  });
  const initialPointer = await activePointer(cacheStorage);
  const active = await cacheStorage.open(initialPointer.cacheName);
  const runtimeUrl = `${ORIGIN}/core/runtime.js`;
  const original = await active.match(runtimeUrl);
  await active.put(runtimeUrl, new Response('xxxxxxxxxx', {
    status: 200,
    headers: original.headers
  }));

  const repairNetwork = fakeNetwork(manifest, files, {
    failures: { [runtimeUrl]: 1 }
  });
  await assert.rejects(
    installerFor(cacheStorage, repairNetwork.fetch).prepare({
      manifestUrl: MANIFEST_URL,
      expectedManifestSha256: repairNetwork.manifestHash
    }),
    /network failed/i
  );
  assert.equal((await activePointer(cacheStorage)).cacheName, initialPointer.cacheName);

  const repaired = await installerFor(cacheStorage, repairNetwork.fetch).prepare({
    manifestUrl: MANIFEST_URL,
    expectedManifestSha256: repairNetwork.manifestHash
  });
  assert.equal(repaired.warm, false);
  assert.equal(repaired.cacheName, `${initialPointer.cacheName}:repair`);
  assert.equal((await activePointer(cacheStorage)).cacheName, repaired.cacheName);
  assert.equal(repairNetwork.calls.filter(url => url === runtimeUrl).length, 2);
  assert.equal(
    repairNetwork.calls.filter(url => url === `${ORIGIN}/poc/lesson/audio/line.mp3`).length,
    0
  );
});
