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
    return cache.match(request, { ignoreSearch: true });
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
      })());
    });
  }

  return Object.freeze({
    META_CACHE_NAME,
    ACTIVE_POINTER_PATH,
    parseByteRange,
    rangedResponse,
    shouldBypassPackage,
    activePackageResponse,
    attach
  });
});
