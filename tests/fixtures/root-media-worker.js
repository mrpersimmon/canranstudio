'use strict';
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
// Reproduce an existing root package which rejects another app's media.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/lesson/') && /\.(?:mp3|png|webp)$/.test(url.pathname)) {
    event.respondWith(new Response(null, { status: 502 }));
  }
});
