(function attachCoursePackageInstaller(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.coursePackageInstaller = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function coursePackageInstallerFactory() {
  'use strict';

  const META_CACHE_NAME = 'course-package:activation:v1';
  const ACTIVE_POINTER_PATH = '__course-package-active__';
  const SHA_HEADER = 'X-Course-Package-Sha256';
  const SIZE_HEADER = 'X-Course-Package-Bytes';
  const PACKAGE_HEADER = 'X-Course-Package-Id';

  function invariant(condition, message) {
    if (!condition) throw new Error(message);
  }

  function absoluteUrl(value, origin) {
    return new URL(value, origin).href;
  }

  function validateManifest(manifest, { origin, scopeUrl } = {}) {
    invariant(manifest && typeof manifest === 'object' && !Array.isArray(manifest),
      'course-package manifest must be an object');
    invariant(manifest.schema === 1, 'course-package manifest schema must be 1');
    invariant(typeof manifest.packageId === 'string' && /^[A-Za-z0-9._@-]+$/.test(manifest.packageId),
      'course-package manifest packageId is invalid');
    invariant(typeof manifest.unitId === 'string' && /^[A-Za-z0-9._-]+$/.test(manifest.unitId),
      'course-package manifest unitId is invalid');
    invariant(typeof manifest.revision === 'string' && manifest.revision.length > 0,
      'course-package manifest revision is required');
    const expectedOrigin = new URL(origin || scopeUrl).origin;
    const expectedScopePath = new URL(scopeUrl || origin).pathname;
    invariant(manifest.scopePath === expectedScopePath,
      'course-package manifest scopePath must match the installer scope');
    invariant(Array.isArray(manifest.entries) && manifest.entries.length > 0,
      'course-package manifest entries are required');

    const seen = new Set();
    let totalBytes = 0;
    let previousUrl = null;
    for (const entry of manifest.entries) {
      invariant(entry && typeof entry === 'object' && !Array.isArray(entry),
        'course-package manifest entry must be an object');
      invariant(typeof entry.url === 'string' && entry.url.length > 0,
        'course-package entry URL is required');
      const parsed = new URL(entry.url, expectedOrigin);
      invariant(parsed.origin === expectedOrigin, 'course-package entries must be same-origin');
      invariant(entry.url.startsWith('/'), 'course-package entry URL must be root-relative');
      invariant(!entry.url.includes('..') && !entry.url.includes('?') && !entry.url.includes('#'),
        `course-package entry URL is unsafe: ${entry.url}`);
      invariant(!seen.has(parsed.href), `duplicate package URL: ${entry.url}`);
      seen.add(parsed.href);
      invariant(previousUrl === null || previousUrl.localeCompare(entry.url) < 0,
        'course-package entries must be sorted by URL');
      previousUrl = entry.url;
      invariant(typeof entry.kind === 'string' && entry.kind.length > 0,
        `course-package entry kind is required: ${entry.url}`);
      invariant(Number.isSafeInteger(entry.bytes) && entry.bytes > 0,
        `course-package entry bytes are invalid: ${entry.url}`);
      invariant(typeof entry.sha256 === 'string' && /^[a-f0-9]{64}$/.test(entry.sha256),
        `course-package entry sha256 is invalid: ${entry.url}`);
      totalBytes += entry.bytes;
    }
    invariant(Number.isSafeInteger(manifest.totalBytes) && manifest.totalBytes === totalBytes,
      'course-package manifest totalBytes must equal its entry byte total');
    if (manifest.mediaIndexUrl !== undefined) invariant(manifest.entries.some(entry => entry.url === manifest.mediaIndexUrl),
      'course-package media index must be a verified startup entry');
    return manifest;
  }

  function toHex(bytes) {
    return [...new Uint8Array(bytes)]
      .map(value => value.toString(16).padStart(2, '0'))
      .join('');
  }

  async function sha256Hex(cryptoApi, bytes) {
    invariant(cryptoApi?.subtle?.digest, 'Web Crypto SHA-256 is unavailable');
    return toHex(await cryptoApi.subtle.digest('SHA-256', bytes));
  }

  function cacheNameFor(manifest, manifestSha256) {
    return `course-package:${manifest.packageId}:${manifestSha256.slice(0, 16)}`;
  }

  function pointerUrl(scopeUrl) {
    return new URL(ACTIVE_POINTER_PATH, scopeUrl).href;
  }

  async function verifiedStoredBytes(response, entry, packageId, cryptoApi) {
    if (
      !response
      || response.headers.get(SHA_HEADER) !== entry.sha256
      || Number(response.headers.get(SIZE_HEADER)) !== entry.bytes
      || response.headers.get(PACKAGE_HEADER) !== packageId
    ) return null;
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength !== entry.bytes) return null;
    return await sha256Hex(cryptoApi, bytes) === entry.sha256 ? bytes : null;
  }

  function responseWithIntegrity(response, bytes, entry, packageId) {
    const headers = new Headers(response.headers);
    headers.set(SHA_HEADER, entry.sha256);
    headers.set(SIZE_HEADER, String(entry.bytes));
    headers.set(PACKAGE_HEADER, packageId);
    if (!headers.has('Content-Length')) headers.set('Content-Length', String(entry.bytes));
    return new Response(bytes, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  async function readPointer(cacheStorage, scopeUrl) {
    const meta = await cacheStorage.open(META_CACHE_NAME);
    const response = await meta.match(pointerUrl(scopeUrl));
    if (!response) return null;
    try {
      const value = await response.json();
      return value && value.schema === 1 ? value : null;
    } catch {
      return null;
    }
  }

  async function writePointer(cacheStorage, scopeUrl, pointer) {
    const meta = await cacheStorage.open(META_CACHE_NAME);
    await meta.put(pointerUrl(scopeUrl), new Response(JSON.stringify(pointer), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    }));
  }

  async function verifiedEntries(cache, manifest, origin, cryptoApi) {
    const checks = await Promise.all(manifest.entries.map(async entry => {
      const response = await cache.match(absoluteUrl(entry.url, origin), { ignoreSearch: true });
      const bytes = await verifiedStoredBytes(response, entry, manifest.packageId, cryptoApi);
      return bytes ? entry.url : null;
    }));
    return new Set(checks.filter(Boolean));
  }

  function progressSnapshot(phase, manifest, preparedBytes, details = {}) {
    return Object.freeze({
      phase,
      unitId: manifest.unitId,
      revision: manifest.revision,
      preparedBytes,
      totalBytes: manifest.totalBytes,
      percent: manifest.totalBytes > 0
        ? Math.min(100, Math.floor((preparedBytes / manifest.totalBytes) * 100))
        : 0,
      ...details
    });
  }

  function createInstaller({
    cacheStorage,
    fetch: fetchImpl,
    crypto: cryptoApi,
    scopeUrl,
    origin,
    maxConcurrency = 4
  } = {}) {
    invariant(cacheStorage?.open, 'Cache Storage is unavailable');
    invariant(typeof fetchImpl === 'function', 'fetch is unavailable');
    const normalizedScope = new URL(scopeUrl).href;
    const normalizedOrigin = new URL(origin || normalizedScope).origin;
    const concurrency = Math.max(1, Math.min(8, Number(maxConcurrency) || 1));

    async function loadManifest(manifestUrl, expectedManifestSha256, signal) {
      invariant(/^[a-f0-9]{64}$/.test(expectedManifestSha256 || ''),
        'expected course-package manifest SHA-256 is invalid');
      let response;
      try { response = await fetchImpl(new Request(manifestUrl, {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { 'X-Course-Package-Manifest': '1' },
        signal
      })); } catch(error) {
        if(signal?.aborted)throw error;
        const pointer=await readPointer(cacheStorage,normalizedScope);
        if(pointer?.manifestSha256!==expectedManifestSha256 || pointer.manifestUrl!==manifestUrl || !pointer.shell)throw error;
        response=await (await cacheStorage.open(pointer.cacheName)).match(manifestUrl);
        if(!response)throw error;
      }
      invariant(response?.ok, `course-package manifest request failed with ${response?.status || 0}`);
      const bytes = await response.arrayBuffer();
      const actualHash = await sha256Hex(cryptoApi, bytes);
      invariant(actualHash === expectedManifestSha256,
        'course-package manifest integrity check failed');
      let manifest;
      try {
        manifest = JSON.parse(new TextDecoder().decode(bytes));
      } catch {
        throw new Error('course-package manifest is not valid JSON');
      }
      validateManifest(manifest, { origin: normalizedOrigin, scopeUrl: normalizedScope });
      return { manifest, manifestSha256: actualHash, bytes };
    }

    async function prepare({
      manifestUrl,
      expectedManifestSha256,
      onProgress = () => {},
      shellUrl,
      signal
    } = {}) {
      const loaded = await loadManifest(manifestUrl, expectedManifestSha256, signal);
      const { manifest, manifestSha256 } = loaded;
      onProgress(progressSnapshot('checking', manifest, 0));
      async function cacheBootstrap(cache, pointer) {
        await cache.put(manifestUrl,new Response(loaded.bytes,{headers:{'Content-Type':'application/json'}}));
        if(!shellUrl)return {manifestUrl};
        const url=new URL(shellUrl);url.search='';url.hash='';
        invariant(url.origin===normalizedOrigin && [new URL(normalizedScope).pathname,new URL('index.html',normalizedScope).pathname].includes(url.pathname),'course shell is outside installer scope');
        if(pointer?.shell) {
          const response=await cache.match(pointer.shell.url);
          if(response){const bytes=await response.arrayBuffer();if(bytes.byteLength===pointer.shell.bytes && await sha256Hex(cryptoApi,bytes)===pointer.shell.sha256)return {manifestUrl,shell:pointer.shell};}
        }
        const response=await fetchImpl(new Request(url.href,{cache:'no-store',headers:{'X-Course-Package-Install':'1'},signal}));
        invariant(response?.ok,'course shell request failed');
        const bytes=await response.arrayBuffer(),html=new TextDecoder().decode(bytes);
        invariant(html.includes('data-manifest-sha256="'+manifestSha256+'"'),'course shell manifest version mismatch');
        const shell={url:normalizedScope,bytes:bytes.byteLength,sha256:await sha256Hex(cryptoApi,bytes)};
        await cache.put(shell.url,new Response(bytes,{headers:{'Content-Type':'text/html; charset=utf-8'}}));
        const saved=await cache.match(shell.url);
        invariant(saved && await sha256Hex(cryptoApi,await saved.arrayBuffer())===shell.sha256,'course shell storage verification failed');
        return {manifestUrl,shell};
      }


      const baseCacheName = cacheNameFor(manifest, manifestSha256);
      const repairCacheName = `${baseCacheName}:repair`;
      const pointer = await readPointer(cacheStorage, normalizedScope);
      const pointerMatchesManifest = pointer?.packageId === manifest.packageId
        && pointer?.manifestSha256 === manifestSha256
        && [baseCacheName, repairCacheName].includes(pointer?.cacheName);
      let activeCache = null;
      if (pointerMatchesManifest) {
        activeCache = await cacheStorage.open(pointer.cacheName);
        const activeVerified = await verifiedEntries(
          activeCache,
          manifest,
          normalizedOrigin,
          cryptoApi
        );
        if (activeVerified.size === manifest.entries.length) {
          const bootstrap=await cacheBootstrap(activeCache,pointer);
          await writePointer(cacheStorage,normalizedScope,{...pointer,...bootstrap});
          const ready = progressSnapshot('ready', manifest, manifest.totalBytes, { warm: true });
          onProgress(ready);
          return Object.freeze({
            status: 'ready', warm: true, manifest, manifestSha256,
            cacheName: pointer.cacheName,
            preparedBytes: manifest.totalBytes, totalBytes: manifest.totalBytes
          });
        }
      }

      const cacheName = pointerMatchesManifest
        ? (pointer.cacheName === baseCacheName ? repairCacheName : baseCacheName)
        : baseCacheName;
      const cache = await cacheStorage.open(cacheName);
      const verified = await verifiedEntries(cache, manifest, normalizedOrigin, cryptoApi);

      let preparedBytes = manifest.entries
        .filter(entry => verified.has(entry.url))
        .reduce((sum, entry) => sum + entry.bytes, 0);
      onProgress(progressSnapshot('downloading', manifest, preparedBytes, { warm: false }));

      let previousCache = pointerMatchesManifest ? activeCache : null;
      if (!previousCache && pointer?.cacheName && pointer.cacheName !== cacheName) {
        previousCache = await cacheStorage.open(pointer.cacheName);
      }

      let cursor = 0;
      const workers = Array.from(
        { length: Math.min(concurrency, manifest.entries.length) },
        async () => {
          for (;;) {
            if (signal?.aborted) throw signal.reason || new DOMException('Aborted', 'AbortError');
            const index = cursor;
            cursor += 1;
            if (index >= manifest.entries.length) return;
            const entry = manifest.entries[index];
            if (verified.has(entry.url)) continue;
            const url = absoluteUrl(entry.url, normalizedOrigin);

            if (previousCache) {
              const reusable = await previousCache.match(url, { ignoreSearch: true });
              const bytes = await verifiedStoredBytes(
                reusable,
                entry,
                pointer.packageId,
                cryptoApi
              );
              if (bytes) {
                const copied = responseWithIntegrity(reusable, bytes, entry, manifest.packageId);
                await cache.put(url, copied);
                verified.add(entry.url);
                preparedBytes += entry.bytes;
                onProgress(progressSnapshot('verifying', manifest, preparedBytes, {
                  currentUrl: entry.url,
                  reused: true
                }));
                continue;
              }
            }

            const response = await fetchImpl(new Request(url, {
              cache: 'no-store',
              credentials: 'same-origin',
              headers: { 'X-Course-Package-Install': '1' },
              signal
            }));
            invariant(response?.ok, `course-package asset request failed: ${entry.url}`);
            const bytes = await response.arrayBuffer();
            invariant(bytes.byteLength === entry.bytes,
              `course-package asset size check failed: ${entry.url}`);
            const actualHash = await sha256Hex(cryptoApi, bytes);
            invariant(actualHash === entry.sha256,
              `course-package asset integrity check failed: ${entry.url}`);
            await cache.put(url, responseWithIntegrity(response, bytes, entry, manifest.packageId));
            verified.add(entry.url);
            preparedBytes += entry.bytes;
            onProgress(progressSnapshot('verifying', manifest, preparedBytes, {
              currentUrl: entry.url,
              reused: false
            }));
          }
        }
      );
      await Promise.all(workers);

      const finalVerified = await verifiedEntries(cache, manifest, normalizedOrigin, cryptoApi);
      invariant(finalVerified.size === manifest.entries.length,
        'course-package verification did not cover every manifest entry');
      const bootstrap=await cacheBootstrap(cache);
      const active = Object.freeze({
        ...bootstrap,
        schema: 1,
        unitId: manifest.unitId,
        packageId: manifest.packageId,
        revision: manifest.revision,
        cacheName,
        manifestSha256,
        totalBytes: manifest.totalBytes,
        ...(manifest.mediaIndexUrl ? {mediaIndex: manifest.entries.find(entry => entry.url === manifest.mediaIndexUrl)} : {})
      });
      await writePointer(cacheStorage, normalizedScope, active);
      const ready = progressSnapshot('ready', manifest, manifest.totalBytes, { warm: false });
      onProgress(ready);
      return Object.freeze({
        status: 'ready', warm: false, manifest, manifestSha256, cacheName,
        preparedBytes: manifest.totalBytes, totalBytes: manifest.totalBytes
      });
    }

    return Object.freeze({ prepare });
  }

  return Object.freeze({
    META_CACHE_NAME,
    ACTIVE_POINTER_PATH,
    SHA_HEADER,
    SIZE_HEADER,
    PACKAGE_HEADER,
    validateManifest,
    sha256Hex,
    createInstaller
  });
});
