/* The build prepends course-cache.js; the worker never imports a mutable dependency. */
'use strict';
const COURSE_BASE = new URL(self.registration.scope).pathname;
const courseStore = CanranCourseCache.open(COURSE_BASE);
const coursePins = new Map();
const accessPins = new Map();
async function cleanup(manual = false) {
  return courseStore.maintain(async () => {
  const active = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const protectedKeys = new Set();
  const home = await courseStore.current('home');
  if (home) protectedKeys.add(home.id + '@' + home.revision);
  for (const connection of active) {
    const pack = await pinFor(connection.id);
    if (pack) {
      protectedKeys.add(pack.id + '@' + pack.revision);
      const next = await courseStore.current(pack.id);
      if (next) protectedKeys.add(next.id + '@' + next.revision);
    }
  }
  await courseStore.prune(protectedKeys, manual);
  });
}
courseStore.onQuota = () => cleanup(true);
self.addEventListener('install', event => {
  if (self.courseAccessRequired || !self.registration.active) event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => event.waitUntil((async()=>{
  // Only an already controlled page needs the old public-cache access check.
  // claim() also takes over fresh login pages; reloading those would erase a
  // student's input while the first service worker finishes installing.
  const previousClients = self.courseAccessRequired ? await self.clients.matchAll({type:'window'}) : [];
  await self.clients.claim();
  for (const client of previousClients) {
    // Navigation may wait for this activation to finish; awaiting it here
    // would deadlock an existing cached classroom tab during migration.
    const pathname = new URL(client.url).pathname;
    const relative = pathname.startsWith(COURSE_BASE) ? pathname.slice(COURSE_BASE.length) : null;
    if (relative !== null && /^(?:$|(?:lesson\d+|soundmark|unit\d+-\d+)\/)/.test(relative)) void client.navigate(client.url).catch(()=>{});
  }
})()));
self.addEventListener('message', event => {
  const message = event.data || {}, port = event.ports[0];
  const respond = value => port?.postMessage(value);
  event.waitUntil((async () => {
    if (message.type === 'identity:changed') { coursePins.clear(); accessPins.clear(); for(const client of await self.clients.matchAll({type:'window'})){await courseStore.remove('pins',client.id);if(client.id!==event.source?.id)client.postMessage({type:'identity:changed'});} return; }
    if (message.type === 'course:activate' && message.protocol === 1) { await self.skipWaiting(); return; }
    if (message.type === 'course:hello') { respond({ protocol: 1, base: COURSE_BASE }); return; }
    if (message.type === 'course:clean' || message.type === 'course:trim') { await cleanup(message.type === 'course:clean'); respond({ ok: true }); return; }
    if (message.type === 'course:pin') {
      await courseStore.maintain(async () => {
      const pack = await courseStore.get('packages', message.id + '@' + message.revision);
      if (!pack || pack.protocol !== 1 || !event.source?.id) { respond({ ok: false }); return; }
      if (self.courseAccessRequired) {
        const response=await fetch(COURSE_BASE+'api/courses/'+encodeURIComponent(pack.id)+'/permit',{cache:'no-store'});
        if (!response.ok) { respond({ok:false}); return; }
        accessPins.set(event.source.id,await response.json());
      }
      coursePins.set(event.source.id, pack);
      await courseStore.put('pins', event.source.id, { id: pack.id, revision: pack.revision, access:self.courseAccessRequired ? accessPins.get(event.source.id) : undefined });
      respond({ ok: true });
      });
    }
  })().catch(() => respond({ ok: false })));
});

async function pinFor(connection) {
  if (self.courseAccessRequired) {
    if(!accessPins.has(connection)){const saved=await courseStore.get('pins',connection);if(saved?.access)accessPins.set(connection,saved.access);}
    if(!accessPins.has(connection)||accessPins.get(connection).expires<=Date.now())return null;
  }
  if (coursePins.has(connection)) return coursePins.get(connection);
  const pin = await courseStore.get('pins', connection);
  const pack = pin && await courseStore.get('packages', pin.id + '@' + pin.revision);
  if (pack) coursePins.set(connection, pack);
  return pack;
}
function responseFor(buffer, item, range, local = true) {
  const headers = { ...self.courseResponseHeaders, 'Content-Type': item.type, 'X-Course-Cache': local ? 'hit' : 'repaired', 'X-Course-Offline': local ? '1' : '0', 'Accept-Ranges': 'bytes' };
  if (!range) return new Response(buffer, { headers });
  const match = range.match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + buffer.byteLength } });
  const start = match[1] ? Number(match[1]) : Math.max(0, buffer.byteLength - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), buffer.byteLength - 1) : buffer.byteLength - 1;
  if (start > end || start >= buffer.byteLength) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + buffer.byteLength } });
  headers['Content-Range'] = `bytes ${start}-${end}/${buffer.byteLength}`; headers['Content-Length'] = String(end - start + 1);
  return new Response(buffer.slice(start, end + 1), { status: 206, headers });
}
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(COURSE_BASE)) return;
  const relative = url.pathname.slice(COURSE_BASE.length);
  if (self.courseAccessRequired && COURSE_BASE === '/' && /^(?:exercise|lesson)(?:\/|$)/.test(relative)) return;
  if (self.courseAccessRequired && event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(()=>new Response('<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>联网后再进入</title><body style="font:18px/1.8 system-ui;text-align:center;padding:48px 20px;background:#fcf8ef;color:#4b3428"><h1>联网后再进入</h1><p>课程资源和学习记录都还在。</p><button onclick="location.reload()" style="font:inherit;padding:12px 24px">再试一次</button> <a href="' + COURSE_BASE + '">返回课程</a></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}})));
    return;
  }
  // Immutable downloads are verified by the foreground preparer, never recursively intercepted.
  if (/^(?:resources\/|course-packages\/|course-index\.json|core\/subpath-worker\.js)/.test(relative)) return;
  if (event.request.mode === 'navigate' && /^(?:(?:unit\d+-\d+|lesson\d+|soundmark)\/)?(?:index\.html)?$/.test(relative)) {
    event.respondWith((async () => {
      const id = relative.split('/')[0] || 'home';
      const pack = await courseStore.current(id === 'index.html' ? 'home' : id);
      if (pack) {
        const item = pack.required.find(resource => resource.key === pack.shell);
        const buffer = item && await courseStore.cached(item);
        if (buffer) {
          if (event.resultingClientId) {
            coursePins.set(event.resultingClientId, pack);
            await courseStore.put('pins', event.resultingClientId, { id: pack.id, revision: pack.revision });
          }
          return responseFor(buffer, item);
        }
      }
      try { return await fetch(event.request); }
      catch { return new Response('<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>课程需要联网准备</title><body style="margin:0;padding:40px 24px;text-align:center;background:#fcf8ef;color:#4b3428;font:18px/1.7 system-ui"><h1>这节课还没准备好</h1><p>联网后再试，学习记录会保留。</p><button style="font:inherit;padding:12px 28px" onclick="location.reload()">再试一次</button> <a href="' + COURSE_BASE + '">返回课程</a></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } }); }
    })());
    return;
  }
  if (!/\.(?:js|css|woff2|svg|png|webp|avif|jpe?g|mp3)$/.test(url.pathname)) return;
  event.respondWith((async () => {
    const pack = await pinFor(event.clientId);
    if (!pack) return fetch(event.request);
    const item = [...pack.required, ...pack.audio].find(resource => resource.key === url.pathname);
    if (!item) return new Response('Resource not declared by this course version', { status: 409 });
    const found = await courseStore.cached(item);
    const buffer = found || await courseStore.obtain(item);
    return responseFor(buffer, item, event.request.headers.get('range'), !!found);
  })().catch(() => new Response('Course resource unavailable', { status: 503 })));
});
