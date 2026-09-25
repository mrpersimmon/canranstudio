'use strict';
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  await self.clients.claim();
  for (const client of await self.clients.matchAll({ type: 'window' })) {
    if (/^\/lesson(?:\/|$)/.test(new URL(client.url).pathname)) void client.navigate('/').catch(() => {});
  }
})()));
// Keep a network-only tombstone: do not revive old public shells or erase records.
self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') event.respondWith(fetch(event.request));
});
