(function attachCoursePackageServiceWorker(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (
    root
    && typeof root.addEventListener === 'function'
    && root.registration
    && root.caches
  ) api.attach(root);
})(typeof globalThis !== 'undefined' ? globalThis : this, function coursePackageServiceWorkerFactory() {
  'use strict';

  const META_CACHE_NAME = 'course-package:activation:v1';
  const ACTIVE_POINTER_PATH = '__course-package-active__';

  function parseByteRange(value, totalBytes) {
    if (typeof value !== 'string' || !Number.isSafeInteger(totalBytes) || totalBytes <= 0) {
      return null;
    }
    const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
    if (!match || (!match[1] && !match[2])) return null;
    let start;
    let end;
    if (!match[1]) {
      const suffixLength = Number(match[2]);
      if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null;
      start = Math.max(0, totalBytes - suffixLength);
      end = totalBytes - 1;
    } else {
      start = Number(match[1]);
      end = match[2] ? Number(match[2]) : totalBytes - 1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return null;
      end = Math.min(end, totalBytes - 1);
    }
    if (start < 0 || start >= totalBytes || end < start) return null;
    return { start, end };
  }

  async function rangedResponse(response, rangeHeader) {
    const bytes = await response.arrayBuffer();
    const range = parseByteRange(rangeHeader, bytes.byteLength);
    if (!range) {
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${bytes.byteLength}` }
      });
    }
    const headers = new Headers(response.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${bytes.byteLength}`);
    headers.set('Content-Length', String(range.end - range.start + 1));
    return new Response(bytes.slice(range.start, range.end + 1), {
      status: 206,
      statusText: 'Partial Content',
      headers
    });
  }

  function shouldBypassPackage(request) {
    if (!request || request.method && request.method !== 'GET') return true;
    if (request.mode === 'navigate') return true;
    if (request.headers?.get?.('X-Course-Package-Manifest') === '1') return true;
    if (request.headers?.get?.('X-Course-Package-Install') === '1') return true;
    try {
      return new URL(request.url).pathname.endsWith('/course-package-manifest.json');
    } catch {
      return true;
    }
  }

  const mediaFlights = new Map();
  async function verifiedMedia(scope, cache, request, entry, cached) {
    const cryptoApi = scope.crypto || globalThis.crypto;
    async function checked(response) {
      if (!response?.ok) return null;
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength !== entry.bytes) return null;
      const hash = [...new Uint8Array(await cryptoApi.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
      if (hash !== entry.sha256) return null;
      const headers = new Headers(response.headers);
      headers.delete('Content-Range'); headers.delete('Content-Encoding');
      headers.set('Content-Length', String(bytes.byteLength));
      headers.set('X-Course-Media-Verified', hash);
      return new Response(bytes,{status:200,headers});
    }
    const valid = await checked(cached);
    if (valid) return valid;
    const key = request.url+'@'+entry.sha256;
    if (!mediaFlights.has(key)) {
      const pending = (async()=>{
        const headers = new Headers(request.headers); headers.delete('Range');
        const response = await scope.fetch(new Request(request,{headers,cache:'no-store'}));
        const result = await checked(response);
        if (!result) throw Error('Course media integrity check failed');
        await cache.put(request.url,result.clone());
        return result;
      })();
      mediaFlights.set(key,pending);
      pending.catch(()=>{}).finally(()=>mediaFlights.delete(key));
    }
    return (await mediaFlights.get(key)).clone();
  }

  async function activePackageResponse(scope, request) {
    const meta = await scope.caches.open(META_CACHE_NAME);
    const pointerKey = new URL(ACTIVE_POINTER_PATH, scope.registration.scope).href;
    const pointerResponse = await meta.match(pointerKey);
    if (!pointerResponse) return null;
    let pointer;
    try {
      pointer = await pointerResponse.json();
    } catch {
      return null;
    }
    if (!pointer?.cacheName) return null;
    const cache = await scope.caches.open(pointer.cacheName);
    const cached = await cache.match(request, { ignoreSearch: true });
    const url = new URL(request.url);
    if (!/\.(?:webp|png|avif|jpe?g|mp3)$/i.test(url.pathname)) return cached;
    // Legacy releases were entirely eager. New releases pin the media index
    // in the activation pointer, so losing it cannot fall back to unchecked media.
    if (!pointer.mediaIndex) return cached;
    const indexResponse = await cache.match(new URL(pointer.mediaIndex.url,scope.registration.scope).href);
    if (!indexResponse) throw Error('Course media index is missing');
    const indexBytes = await indexResponse.arrayBuffer();
    const indexHash = [...new Uint8Array(await (scope.crypto || globalThis.crypto).subtle.digest('SHA-256',indexBytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
    if (indexBytes.byteLength !== pointer.mediaIndex.bytes || indexHash !== pointer.mediaIndex.sha256) throw Error('Course media index integrity check failed');
    const index = JSON.parse(new TextDecoder().decode(indexBytes));
    const entry = index.entries?.find(item=>item.url===url.pathname);
    if (!entry) {
      if (cached) return cached;
      throw Error('Media is outside the active course package');
    }
    if (!['audio','image'].includes(entry.kind) || !Number.isSafeInteger(entry.bytes) || entry.bytes<=0 || !/^[a-f0-9]{64}$/.test(entry.sha256)) throw Error('Invalid deferred media entry');
    return verifiedMedia(scope,cache,request,entry,cached);
  }

  function attach(scope) {
    scope.addEventListener('install', event => {
      event.waitUntil(scope.skipWaiting());
    });
    scope.addEventListener('activate', event => {
      event.waitUntil(scope.clients.claim());
    });
    scope.addEventListener('fetch', event => {
      if (shouldBypassPackage(event.request)) return;
      event.respondWith((async () => {
        const cached = await activePackageResponse(scope, event.request);
        if (!cached) return scope.fetch(event.request);
        const range = event.request.headers.get('Range');
        return range ? rangedResponse(cached, range) : cached;
      })().catch(()=>new Response(null,{status:502,statusText:'Course media verification failed'})));
    });
  }

  return Object.freeze({
    META_CACHE_NAME,
    ACTIVE_POINTER_PATH,
    parseByteRange,
    rangedResponse,
    shouldBypassPackage,
    activePackageResponse,
    verifiedMedia,
    attach
  });
});
