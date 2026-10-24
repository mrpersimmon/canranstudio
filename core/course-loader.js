(function () {
  'use strict';
  const entryScript = document.currentScript;
  const updateBrandImage = document.querySelector('#courseLoader img')?.getAttribute('src');
  const base = entryScript.dataset.base, courseId = entryScript.dataset.course;
  const store = CanranCourseCache.open(base);
  const updates = typeof BroadcastChannel === 'function' ? new BroadcastChannel(store.prefix) : null;
  const memoryUrls = new Map(), heldImages = new Map();
  const cancellation = new AbortController();
  const taskKey = 'preparing:' + crypto.randomUUID();
  // A partly executed course must restart in a clean document. Carry only the
  // recovery intent through that reload; never clear account or learning data.
  const entryUrl = new URL(location.href);
  const retryAfterReload = entryUrl.searchParams.get('course-retry') === '1';
  // Older bookmarks may carry an explicit-upgrade flag; every entry now uses
  // the latest authorized release, so the flag is only a compatible alias.
  const legacyUpdate = entryUrl.searchParams.get('course-update') === '1';
  if (retryAfterReload || legacyUpdate) {
    entryUrl.searchParams.delete('course-retry');
    entryUrl.searchParams.delete('course-update');
    history.replaceState(history.state, '', entryUrl.href);
  }
  function reloadForRetry() {
    const url = new URL(location.href); url.searchParams.set('course-retry', '1');
    location.replace(url.href);
  }
  let observer, painting = false, withdrawn = false, replacement;
  const leaseKey = pack => taskKey + ':' + pack.revision;
  let running = false, initialized = false, controlled = false, activePack = null;
  let startAttempted = false, executionStarted = false, visualFailure = false;
  let updateNotice, offeredRevision, checkingUpdate = false, updateTimer, lastUpdateCheck = 0;
  let candidatePack = null, preparedRevision = null, updateFailures = 0, nextUpdateCheck = 0, updateRetryAt = 0;
  let withdrawalTimer, checkingWithdrawal = false, withdrawalFailures = 0;
  const metadataResponses = new Map();
  const updateDelay = () => Math.min(1680000, 180000 * 2 ** Math.min(updateFailures, 4)) + Math.random() * 120000;
  function scheduleUpdate(delay = updateDelay()) {
    clearTimeout(updateTimer);
    nextUpdateCheck = Date.now() + delay;
    if (!cancellation.signal.aborted) updateTimer = setTimeout(() => { void checkUpdate(); }, delay);
  }
  const ready = document.readyState === 'loading' ? new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true })) : Promise.resolve();
  const hash = CanranCourseCache.digest;
  const status = text => { const node = document.getElementById('courseLoadingStatus'); if (node && node.textContent !== text) node.textContent = text; };
  const failure = (code, message) => Object.assign(new Error(message), { courseCode: code });
  const failureMessages = {
    L00: '还没准备好，再试一次。',
    L01: '课程连接失败，请再试一次。',
    L02: '课程需要更新，请再试一次。',
    L03: '有个文件没准备好，再试一次。',
    L04: '文件不完整，再试一次。',
    L05: '画面还没准备好，再试一次。',
    L06: '课程未能打开，再试一次。',
    L07: '请返回课程，确认登录状态。'
  };
  function showFailure(error, fallback = 'L00', message) {
    const code = failureMessages[error?.courseCode] ? error.courseCode : fallback;
    status(message || failureMessages[code]);
    const retry = document.getElementById('courseLoadingRetry'); if (retry) retry.hidden = false;
    const detail = document.getElementById('courseLoadingDetail');
    if (detail) detail.textContent = '已获得的证书会保留。错误编号：' + code;
    console.warn('Course preparation failed [' + code + ']:', error);
  }
  function preparing(text) {
    status(text);
    const detail = document.getElementById('courseLoadingDetail'); if (detail) detail.textContent = '';
    const retry = document.getElementById('courseLoadingRetry'); if (retry) retry.hidden = true;
  }
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  function rpc(worker, message, timeout = 1200) {
    return new Promise((resolve, reject) => {
      if (!worker) { reject(new Error('No course worker')); return; }
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Course worker unavailable')); }, timeout);
      channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
      worker.postMessage(message, [channel.port2]);
    });
  }
  async function connectWorker() {
    const api = navigator.serviceWorker;
    if (!api) return false;
    const ownUrl = new URL(base + 'core/subpath-worker.js', location.origin).href;
    const needsArchives = Boolean(window.CanranStudentAccess?.systemUpgrade);
    const compatible = hello => hello?.protocol === 1 && (!needsArchives || hello.archiveAssets === true);
    function activateRegistration(registration) {
      const workers = new Set();
      const activate = () => registration.waiting?.postMessage({ type: 'course:activate', protocol: 1 });
      const watch = () => { activate(); const worker = registration.installing; if (worker && !workers.has(worker)) { workers.add(worker); worker.addEventListener('statechange', activate); } };
      registration.addEventListener('updatefound', watch); watch();
      return () => { registration.removeEventListener('updatefound', watch); for (const worker of workers) worker.removeEventListener('statechange', activate); };
    }
    if (api.controller?.scriptURL === ownUrl) {
      try {
        if (compatible(await rpc(api.controller, { type: 'course:hello' }))) {
          // A capable controller retains the normal fast revisit path. Only
          // incompatible controllers block entry while their update installs.
          api.register(ownUrl, { scope: base, updateViaCache: 'none' }).then(registration => {
            const activate = () => registration.waiting?.postMessage({ type: 'course:activate', protocol: 1 });
            activate(); registration.installing?.addEventListener('statechange', activate);
          }).catch(() => {});
          return true;
        }
        if (needsArchives) status('正在准备新版课程…');
      } catch {}
    }
    try {
      return await new Promise((resolve, reject) => {
        let finished = false, stopWatching;
        const finish = error => { if (finished) return; finished = true; clearTimeout(timer); api.removeEventListener('controllerchange', changed); stopWatching?.(); error ? reject(error) : resolve(true); };
        const check = async () => {
          const worker = api.controller;
          if (finished || worker?.scriptURL !== ownUrl) return false;
          try { if (compatible(await rpc(worker, { type: 'course:hello' })) && worker === api.controller) { finish(); return true; } } catch {}
          return false;
        };
        const changed = () => { void check(); };
        // Include registration/update networking in this existing deadline.
        const timer = setTimeout(() => finish(new Error('Course control unavailable')), 8000);
        api.addEventListener('controllerchange', changed);
        (async () => {
          const registration = await api.register(ownUrl, { scope: base, updateViaCache: 'none' });
          if (finished) return;
          stopWatching = activateRegistration(registration);
          if (await check() || finished) return;
          if (needsArchives) { await registration.update(); await check(); }
        })().catch(finish);
      });
    } catch {
      // A still-active old worker also intercepts the memory fallback's archive
      // URLs. Do not pin/execute the new course under that incompatible owner.
      if (needsArchives && api.controller) throw failure('L02', '课程支持程序需要更新');
      return false;
    }
  }
  async function read(url, conditional = false) {
    const target = new URL(url, location.origin);
    if (target.origin !== location.origin || !target.pathname.startsWith(base)) throw failure('L02', '课程地址不正确');
    // Older WebViews have AbortController but not AbortSignal.any/timeout.
    // Keep the deadline active until the response body has also arrived.
    const controller = new AbortController(), cancel = () => controller.abort();
    cancellation.signal.addEventListener('abort', cancel, { once: true });
    if (cancellation.signal.aborted) cancel();
    const timer = setTimeout(cancel, 15000);
    try {
      const prior = conditional && metadataResponses.get(target.href);
      const response = await fetch(target.href, { cache: conditional ? 'no-store' : 'no-cache', signal: controller.signal,
        ...(prior?.etag ? {headers:{'If-None-Match':prior.etag}} : {}) });
      if (response.status === 304 && prior) return prior.buffer;
      if (!response.ok) throw failure('L01', '资源暂未准备好');
      const buffer = await response.arrayBuffer();
      if (conditional) metadataResponses.set(target.href, {etag:response.headers.get('etag'),buffer});
      return buffer;
    } catch (error) {
      if (!error.courseCode) error.courseCode = 'L01';
      throw error;
    } finally {
      clearTimeout(timer);
      cancellation.signal.removeEventListener('abort', cancel);
    }
  }
  async function rememberWithdrawals(values) {
    if (!Array.isArray(values) || values.some(value => typeof value !== 'string' || !/^[\w-]+@[a-f0-9]{64}$/.test(value))) throw failure('L02','撤回清单不兼容');
    if (activePack && values.includes(activePack.id + '@' + activePack.revision)) withdrawn = true;
    const previous = await store.get('meta','withdrawn');
    if (JSON.stringify(previous || []) !== JSON.stringify(values)) {
      await store.put('meta','withdrawn',values).catch(() => {});
      updates?.postMessage({withdrawn:values});
    }
  }
  async function metadata(kind) {
    const value = JSON.parse(new TextDecoder().decode(await read(base + kind + '/' + courseId + '.json',true)));
    if (value.schema !== 1 || value.protocol !== 1 || value.basePath !== base || value.courseId !== courseId) throw failure('L02','更新清单不兼容');
    await rememberWithdrawals(value.withdrawn);
    return value;
  }
  async function latest(known = null, lightweight = false) {
    try {
      const index = lightweight ? await metadata('course-status') : JSON.parse(new TextDecoder().decode(await read(base + 'course-index.json')));
      if (index.schema !== 1 || index.basePath !== base || index.protocol !== 1) throw new Error('课程清单不兼容');
      if (!lightweight) await rememberWithdrawals(index.withdrawn || []);
      const descriptor = lightweight ? index.descriptor : index.courses[courseId];
      if (!descriptor) throw new Error('课程暂未准备好');
      if (index.withdrawn?.includes(courseId + '@' + descriptor.revision)) throw new Error('课程正在更新');
      if (known && descriptor.revision === known.revision) return known;
      const buffer = await read(descriptor.manifest);
      if (await hash(buffer) !== descriptor.sha256) throw new Error('课程清单需要重新准备');
      const pack = JSON.parse(new TextDecoder().decode(buffer));
      if (pack.id !== courseId || pack.revision !== descriptor.revision || pack.protocol !== 1 || pack.basePath !== base || !Array.isArray(pack.required) || !Array.isArray(pack.audio)) throw new Error('课程内容不兼容');
      if (index.withdrawn?.includes(pack.id + '@' + pack.revision)) throw new Error('课程正在更新');
      return pack;
    } catch (error) {
      if (!error.courseCode) error.courseCode = 'L02';
      throw error;
    }
  }
  function blobUrl(item, buffer) {
    if (!memoryUrls.has(item.key)) memoryUrls.set(item.key, URL.createObjectURL(new Blob([buffer], { type: item.type })));
    return memoryUrls.get(item.key);
  }
  async function imageReady(src) {
    const image = new Image(); image.src = src;
    try { await image.decode(); }
    catch { throw failure('L05', '图片暂未准备好'); }
    if (!image.naturalWidth) throw failure('L05', '图片暂未准备好');
    return image;
  }
  async function holdImage(src) {
    if (!heldImages.has(src)) heldImages.set(src, imageReady(src));
    try { return await heldImages.get(src); }
    catch (error) { heldImages.delete(src); throw error; }
  }
  async function prepare(pack, foreground = true) {
    await store.maintain(() => store.put('meta', leaseKey(pack), { pack: pack.id + '@' + pack.revision, expires: Date.now() + 30 * 60 * 1000, resources: [...pack.required, ...pack.audio].map(item => item.sha256) })).catch(() => {});
    let done = 0;
    // Start the large fonts/images first, allowing small files to finish while
    // those transfers are in flight. Every declared resource is still checked
    // and decoded before entry; nothing is deferred or removed from readiness.
    const resources = new Map(), queue = [...pack.required].sort((a,b)=>b.bytes-a.bytes);
    const total = queue.reduce((sum, item) => sum + item.bytes, 0);
    await Promise.all(Array.from({ length: foreground ? 6 : 2 }, async () => {
      while (queue.length) {
        const item = queue.shift(), buffer = await store.obtain(item, { signal: cancellation.signal });
        resources.set(item.key, { item, buffer });
        // Previously committed bytes were decoded on first preparation. Their
        // hashes are still checked above; current DOM images are decoded below.
        if (!pack.lastUsed && item.type.startsWith('image/')) {
          const temporary = URL.createObjectURL(new Blob([buffer], { type: item.type }));
          try { await imageReady(temporary); } finally { URL.revokeObjectURL(temporary); }
        }
        done += item.bytes;
        const progress = foreground && document.getElementById('courseLoadingProgress');
        if (progress) progress.value = Math.floor(90 * done / total);
      }
    }));
    return resources;
  }
  function resourceAddress(url, relativeTo = location.href) {
    if (/^(?:data:|blob:|#)/.test(url)) return url;
    const parsed = new URL(url, relativeTo);
    return !controlled && memoryUrls.has(parsed.pathname) ? memoryUrls.get(parsed.pathname) : parsed.href;
  }
  function cssUrls(css, relativeTo) {
    return css.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g, (_, quote, value) => 'url("' + resourceAddress(value, relativeTo) + '")');
  }
  function fallbackImages() {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', { configurable: true, get: descriptor.get, set(value) { descriptor.set.call(this, resourceAddress(value)); } });
    const original = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) { return original.call(this, name, this instanceof HTMLImageElement && name === 'src' ? resourceAddress(value) : value); };
  }
  async function start(pack, resources) {
    startAttempted = true;
    status('正在准备画面…');
    const persistent = await store.commit(pack, !pack.lastUsed);
    controlled = controlled && persistent && (await rpc(navigator.serviceWorker.controller, { type: 'course:pin', id: pack.id, revision: pack.revision })).ok;
    await store.remove('meta', leaseKey(pack)).catch(() => {});
    if (!controlled) {
      for (const { item, buffer } of resources.values()) {
        if (item.type.startsWith('image/')) blobUrl(item, buffer);
        if (item.type.startsWith('font/')) {
          const bytes = new Uint8Array(buffer); let encoded = '';
          for (let start = 0; start < bytes.length; start += 16384) encoded += String.fromCharCode(...bytes.subarray(start, start + 16384));
          memoryUrls.set(item.key, 'data:' + item.type + ';base64,' + btoa(encoded));
        }
      }
      fallbackImages();
    }
    // Validating cached bytes through a temporary blob URL does not prepare the
    // URL used by a later card or character. Keep every actual display image
    // decoded before entry, so routine DOM swaps never reopen the page guard.
    const pictures = [...resources.values()].filter(({ item }) => item.type.startsWith('image/'));
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (pictures.length) await holdImage(resourceAddress(pictures.shift().item.key));
    }));
    const parsed = new DOMParser().parseFromString(new TextDecoder().decode(resources.get(pack.entry).buffer), 'text/html');
    const scripts = [...parsed.querySelectorAll('script')].map(script => ({ src: script.getAttribute('src'), text: script.textContent, type: script.type }));
    parsed.querySelectorAll('script').forEach(script => script.remove());
    for (const link of parsed.querySelectorAll('link[rel="stylesheet"]')) {
      const key = new URL(link.getAttribute('href'), new URL(pack.entry, location.origin)).pathname;
      const value = resources.get(key);
      if (!value) throw failure('L02', '课程样式未列入清单');
      const style = parsed.createElement('style');
      style.textContent = cssUrls(new TextDecoder().decode(value.buffer), new URL(key, location.origin).href);
      link.replaceWith(style);
    }
    for (const style of parsed.querySelectorAll('style')) style.textContent = cssUrls(style.textContent, new URL(pack.entry, location.origin).href);
    for (const image of parsed.images) if (image.hasAttribute('src')) image.setAttribute('src', resourceAddress(image.getAttribute('src'), new URL(pack.entry, location.origin).href));
    const overlay = document.getElementById('courseLoader'), loaderStyle = document.getElementById('courseLoaderStyle');
    document.head.replaceChildren(loaderStyle, ...[...parsed.head.children].map(node => document.importNode(node, true)));
    document.body.replaceChildren(overlay, ...[...parsed.body.childNodes].map(node => document.importNode(node, true)));
    document.body.className = parsed.body.className;
    for (const attribute of parsed.documentElement.attributes) if (attribute.name !== 'data-course-preparing') document.documentElement.setAttribute(attribute.name, attribute.value);
    const backgrounds = new Set([...document.querySelectorAll('style')].flatMap(style => [...style.textContent.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)].map(match => match[1])).filter(url => /\.(?:svg|png|webp|avif|jpe?g)(?:[?#]|$)/.test(url) || url.startsWith('blob:')));
    for (const url of backgrounds) await holdImage(resourceAddress(url));
    await Promise.all([...document.fonts].map(font => font.load()));
    for (const original of scripts) {
      executionStarted = true;
      const script = document.createElement('script');
      if (original.type) script.type = original.type;
      if (original.src) {
        const key = new URL(original.src, new URL(pack.entry, location.origin)).pathname;
        if (!resources.has(key)) throw failure('L02', '课程脚本未列入清单');
        script.textContent = new TextDecoder().decode(resources.get(key).buffer) + '\n//# sourceURL=' + key;
      } else script.textContent = original.text;
      document.body.append(script);
      if (visualFailure) throw failure('L06', '课程未能完整启动');
    }
    await document.fonts.ready;
    await Promise.all([...document.images].filter(image => image.getAttribute('src')).map(image => { image.loading = 'eager'; return image.decode(); }));
    initialized = true; activePack = pack;
    if (!controlled) {
      const note = document.createElement('p'); note.id = 'courseResourceNotice'; note.setAttribute('role', 'status');
      note.textContent = '这次可正常学习，下次可能需要重新准备。'; document.body.prepend(note);
    }
    document.documentElement.removeAttribute('data-course-preparing');
    await nextFrame();
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await nextFrame();
    overlay.remove();
    setupPageGuard(overlay);
    setupCleanup();
    document.dispatchEvent(new Event('canran:course-ready'));
    background(pack);
  }
  function enterLatest() {
    const url = new URL(location.href); url.searchParams.set('course-update', '1');
    location.assign(url.href);
  }
  function showUpdate(next) {
    if (next.id === 'home' || withdrawn) return null;
    if (!updateNotice) {
      const style = document.createElement('style');
      style.textContent = `
        #courseUpdateNotice{position:sticky;top:8px;z-index:110;display:flex;align-items:center;gap:24px;box-sizing:border-box;width:calc(100% - 32px);max-width:1088px;margin:16px auto;padding:20px 24px;border:1px solid #d9cbb7;border-radius:24px;background:#fffaf0;color:#443e32;box-shadow:0 5px 0 #e9e0d1,0 12px 28px #4a32260a;font:500 14px/1.6 "Lesson Gothic",system-ui,sans-serif;font-synthesis:none}
        #courseUpdateNotice .course-update-message{display:grid;grid-template-columns:48px minmax(0,1fr);column-gap:16px;flex:1;min-width:0}
        #courseUpdateNotice .course-update-brand{grid-column:1;grid-row:1/4;display:block;width:48px;height:58px;align-self:center;border-radius:16px;background:#fff0c1 var(--update-brand) center/36px 42px no-repeat}
        #courseUpdateNotice strong{grid-column:2;display:block;font:inherit;font-size:21px;line-height:1.4;color:#344d3c}
        #courseUpdateNotice p{grid-column:2;margin:6px 0 0;font:inherit;font-size:13px;color:#706353;line-height:1.65}
        #courseUpdateNotice #courseUpdateStatus{margin-top:4px;font-size:12px;color:#637254}
        #courseUpdateNotice button{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font:inherit;font-size:15px;min-width:140px;min-height:46px;padding:9px 20px;border:1px solid #36553e;border-radius:14px;background:#42674d;color:#fff;box-shadow:0 3px 0 #2c4835;cursor:pointer}
        #courseUpdateNotice button:focus-visible{outline:3px solid #c38a21;outline-offset:4px}
        @media(max-width:720px){#courseUpdateNotice{align-items:stretch;flex-direction:column;gap:14px;width:calc(100% - 24px);padding:18px;border-radius:22px}#courseUpdateNotice strong{font-size:20px}#courseUpdateNotice button{width:100%}}
        @media print{#courseUpdateNotice{display:none!important}}
      `;
      document.head.append(style);
      updateNotice = document.createElement('section'); updateNotice.id = 'courseUpdateNotice'; updateNotice.setAttribute('role', 'region'); updateNotice.setAttribute('aria-label', '课程更新');
      if (updateBrandImage) updateNotice.style.setProperty('--update-brand', 'url("' + updateBrandImage + '")');
      const message = document.createElement('div'), title = document.createElement('strong'), detail = document.createElement('p'), state = document.createElement('p'), brand = document.createElement('span');
      message.className = 'course-update-message'; brand.className = 'course-update-brand'; brand.setAttribute('aria-hidden', 'true');
      title.textContent = '课程已更新'; detail.textContent = '刷新后使用最新版，已获得的证书会保留。'; state.id = 'courseUpdateStatus'; state.setAttribute('role', 'status');
      message.append(brand, title, detail, state);
      const refresh = document.createElement('button'); refresh.type = 'button'; refresh.textContent = '刷新课程'; refresh.onclick = enterLatest;
      updateNotice.append(message, refresh); document.body.prepend(updateNotice);
    }
    if (offeredRevision !== next.revision) { offeredRevision = next.revision; document.body.prepend(updateNotice); }
    return document.getElementById('courseUpdateStatus');
  }
  function checkUpdate(force = false, urgent = false) {
    if (!initialized || checkingUpdate || cancellation.signal.aborted) return replacement;
    if (!navigator.onLine || document.hidden) { scheduleUpdate(); return replacement; }
    const due = Math.max(updateRetryAt, lastUpdateCheck + 30000, force ? 0 : nextUpdateCheck);
    if (!urgent && Date.now() < due) { scheduleUpdate(due - Date.now()); return replacement; }
    clearTimeout(updateTimer);
    checkingUpdate = true; lastUpdateCheck = Date.now();
    replacement = (async () => {
      let next, note;
      try {
        next = await latest(candidatePack || activePack, true);
        if (next.revision === activePack.revision) { candidatePack = null; preparedRevision = null; updateFailures = 0; updateRetryAt = 0; updateNotice?.remove(); updateNotice = null; offeredRevision = null; return; }
        candidatePack = next;
        note = showUpdate(next);
        if (preparedRevision === next.revision && !withdrawn) { updateFailures = 0; updateRetryAt = 0; return; }
        if (note) note.textContent = '刷新时会准备完整课程。';
        // Lightweight discovery works without a worker and in data-saving mode.
        // Only optional background downloads depend on those capabilities.
        if ((!controlled || navigator.connection?.saveData) && !withdrawn) { updateFailures = 0; updateRetryAt = 0; return; }
        if (note) note.textContent = '正在后台准备更新…';
        await prepare(next, false);
        // Keep the active document pinned until it is refreshed. Every new
        // entry independently checks the server revision before using this cache.
        const saved = await store.commit(next, withdrawn || next.id === 'home');
        preparedRevision = next.revision;
        updateFailures = 0; updateRetryAt = 0;
        if (note?.isConnected) note.textContent = saved ? '新版已准备好，刷新即可使用。' : '刷新时会准备完整课程。';
      } catch {
        updateFailures++;
        updateRetryAt = Date.now() + updateDelay();
        if (note?.isConnected) note.textContent = '更新暂时未准备好，刷新后可重试。';
      } finally {
        if (next) await store.remove('meta', leaseKey(next)).catch(() => {});
        checkingUpdate = false;
        scheduleUpdate(updateRetryAt ? Math.max(1000, updateRetryAt - Date.now()) : updateDelay());
        document.dispatchEvent(new Event('canran:course-update-checked'));
      }
    })();
    return replacement;
  }
  function scheduleWithdrawals() {
    clearTimeout(withdrawalTimer);
    // Ordinary releases can wait a few minutes; known teaching withdrawals
    // must not inherit that interval or its longer failure backoff.
    const delay = withdrawalFailures ? Math.min(55000,15000 * 2 ** Math.min(withdrawalFailures - 1,2)) + Math.random() * 5000 : 45000 + Math.random() * 15000;
    if (!cancellation.signal.aborted) withdrawalTimer = setTimeout(checkWithdrawals,delay);
  }
  async function checkWithdrawals() {
    if (checkingWithdrawal || cancellation.signal.aborted) return;
    if (!initialized || !navigator.onLine || document.hidden) { scheduleWithdrawals(); return; }
    checkingWithdrawal = true;
    try {
      await metadata('course-withdrawals'); withdrawalFailures = 0;
      if (withdrawn) await checkUpdate(true,true);
    } catch { withdrawalFailures++; }
    finally {
      checkingWithdrawal = false; scheduleWithdrawals();
      document.dispatchEvent(new Event('canran:course-withdrawals-checked'));
    }
  }
  async function background(pack) {
    const audioQueue = [...pack.audio];
    Promise.all(Array.from({ length: 2 }, async () => {
      while (audioQueue.length && !cancellation.signal.aborted) {
        try { await store.obtain(audioQueue.shift(), { signal: cancellation.signal }); } catch {}
      }
    })).catch(() => {});
    scheduleWithdrawals();
    window.addEventListener('online', () => { void checkUpdate(true); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void checkUpdate(true); });
    await checkUpdate(true);
    if (controlled) rpc(navigator.serviceWorker.controller, { type: 'course:trim' }, 15000).catch(() => {});
  }
  function setupCleanup() {
    const panel = document.getElementById('settingsOverview');
    if (!panel) return;
    const row = document.createElement('div'); row.className = 'settings-actions';
    const button = document.createElement('button'); button.type = 'button'; button.textContent = '清理课程资源';
    const detail = document.createElement('p'); detail.setAttribute('role', 'status'); detail.textContent = '保留学习记录和正在打开的课程。';
    row.append(button); panel.append(row, detail);
    button.disabled = !controlled;
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const result = await rpc(navigator.serviceWorker.controller, { type: 'course:clean' }, 30000);
        if (!result.ok) throw new Error('Cleanup incomplete');
        detail.textContent = '已清理未使用的课程资源，学习记录已保留。';
      } catch { detail.textContent = '暂时无法清理，请再试一次。'; }
      finally { button.disabled = false; }
    });
  }
  function setupPageGuard(overlay) {
    let generation = 0, paintFailed = false;
    const inspect = async () => {
      if (painting || withdrawn || paintFailed) return;
      const images = [...document.images].filter(image => image.getAttribute('src') && !image.closest('#courseLoader'));
      if (images.every(image => image.complete && image.naturalWidth > 0)) return;
      painting = true; const current = ++generation;
      document.documentElement.setAttribute('data-course-painting', '');
      document.body.append(overlay); preparing('正在准备画面…');
      try {
        for (const image of images) {
          image.loading = 'eager';
          if (!controlled && memoryUrls.has(new URL(image.src).pathname)) image.src = resourceAddress(image.src);
        }
        await Promise.all(images.map(image => image.decode()));
        if (generation !== current) return;
        overlay.remove(); document.documentElement.removeAttribute('data-course-painting');
      } catch (error) {
        paintFailed = true;
        showFailure(error, 'L05');
      } finally { painting = false; if (!paintFailed) queueMicrotask(inspect); }
    };
    observer = new MutationObserver(inspect);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset'] });
    window.addEventListener('pageshow', event => { if (event.persisted) inspect(); });
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState !== 'visible' || !controlled || painting) return;
      // Recheck actual persistent bytes, not merely a previous readiness flag.
      store.memory.clear();
      try { await prepare(activePack, false); await store.remove('meta', leaseKey(activePack)); await inspect(); }
      catch (error) { document.documentElement.setAttribute('data-course-painting', ''); document.body.append(overlay); showFailure(error, 'L05'); }
    });
    document.addEventListener('click', async event => {
      if (!withdrawn || !event.target.closest('button') || event.target.closest('#courseLoader')) return;
      event.preventDefault(); event.stopImmediatePropagation();
      document.documentElement.setAttribute('data-course-painting', ''); document.body.append(overlay); preparing('课程正在更新，请稍候…');
      await replacement;
      if (await store.current(courseId)) location.reload();
      else showFailure(failure('L02', '当前课包已撤回'), 'L02', '课程需要更新，请联网后再试。');
    }, true);
  }
  async function boot() {
    if (running) return;
    running = true; visualFailure = false;
    const slow = setTimeout(() => status('网络有点慢，正在准备…'), 8000);
    const retryTimer = setTimeout(() => { const button = document.getElementById('courseLoadingRetry'); if (button) button.hidden = false; }, 30000);
    preparing('正在准备课程…');
    document.getElementById('courseLoadingProgress').value = 0;
    let phase = 'L07';
    try {
      if (window.CanranAccessReady) await window.CanranAccessReady;
      phase = 'L00';
      controlled = await connectWorker();
      store.onQuota = controlled ? () => rpc(navigator.serviceWorker.controller, { type: 'course:clean' }, 15000) : null;
      const cachedPack = await store.current(courseId);
      const allowed = pack => pack && (!window.CanranAccessReady || pack.accessPolicy === 'class-v1');
      // Cached bytes are reusable; a cached version decision is not. Even a
      // complete old pack cannot bypass the current authorized release index.
      const pack = await latest(allowed(cachedPack) ? cachedPack : null);
      phase = 'L03';
      const resources = await prepare(pack);
      phase = 'L05';
      await start(pack, resources);
    } catch (error) {
      showFailure(error, phase);
    } finally { clearTimeout(slow); clearTimeout(retryTimer); running = false; }
  }
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    cancellation.abort();
    clearTimeout(updateTimer); clearTimeout(withdrawalTimer); metadataResponses.clear();
    observer?.disconnect();
    updates?.close();
    for (const image of heldImages.values()) image.then(value => value.removeAttribute('src'), () => {});
    heldImages.clear();
    store.memory.clear();
    for (const url of memoryUrls.values()) if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    memoryUrls.clear();
  });
  if (updates) updates.onmessage = event => { if (activePack && event.data?.withdrawn?.includes(activePack.id + '@' + activePack.revision)) withdrawn = true; };
  window.addEventListener('error', event => { if (executionStarted && !initialized && event instanceof ErrorEvent) visualFailure = true; });
  ready.then(() => {
    document.getElementById('courseLoadingRetry').addEventListener('click', () => startAttempted || running ? reloadForRetry() : boot());
    boot();
  });
})();
