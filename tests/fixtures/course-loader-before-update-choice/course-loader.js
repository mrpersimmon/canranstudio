(function () {
  'use strict';
  const entryScript = document.currentScript;
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
  if (retryAfterReload) {
    entryUrl.searchParams.delete('course-retry');
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
    if (detail) detail.textContent = '学习记录会保留。错误编号：' + code;
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
    if (api.controller?.scriptURL === ownUrl) {
      try {
        if ((await rpc(api.controller, { type: 'course:hello' })).protocol === 1) {
          api.register(ownUrl, { scope: base, updateViaCache: 'none' }).then(registration => {
            const activate = () => registration.waiting?.postMessage({ type: 'course:activate', protocol: 1 });
            activate(); registration.installing?.addEventListener('statechange', activate);
          }).catch(() => {});
          return true;
        }
      } catch {}
    }
    try {
      const registration = await api.register(ownUrl, { scope: base, updateViaCache: 'none' });
      const activate = () => registration.waiting?.postMessage({ type: 'course:activate', protocol: 1 });
      activate(); registration.installing?.addEventListener('statechange', activate);
      if (api.controller?.scriptURL !== ownUrl) await new Promise((resolve, reject) => {
        const timer = setTimeout(() => { api.removeEventListener('controllerchange', changed); reject(new Error('Course control unavailable')); }, 8000);
        function changed() { if (api.controller?.scriptURL === ownUrl) { clearTimeout(timer); api.removeEventListener('controllerchange', changed); resolve(); } }
        api.addEventListener('controllerchange', changed); changed();
      });
      return (await rpc(api.controller, { type: 'course:hello' })).protocol === 1;
    } catch { return false; }
  }
  async function read(url) {
    const target = new URL(url, location.origin);
    if (target.origin !== location.origin || !target.pathname.startsWith(base)) throw failure('L02', '课程地址不正确');
    // Older WebViews have AbortController but not AbortSignal.any/timeout.
    // Keep the deadline active until the response body has also arrived.
    const controller = new AbortController(), cancel = () => controller.abort();
    cancellation.signal.addEventListener('abort', cancel, { once: true });
    if (cancellation.signal.aborted) cancel();
    const timer = setTimeout(cancel, 15000);
    try {
      const response = await fetch(target.href, { cache: 'no-cache', signal: controller.signal });
      if (!response.ok) throw failure('L01', '资源暂未准备好');
      return await response.arrayBuffer();
    } catch (error) {
      if (!error.courseCode) error.courseCode = 'L01';
      throw error;
    } finally {
      clearTimeout(timer);
      cancellation.signal.removeEventListener('abort', cancel);
    }
  }
  async function latest() {
    try {
      const index = JSON.parse(new TextDecoder().decode(await read(base + 'course-index.json')));
      if (index.schema !== 1 || index.basePath !== base || index.protocol !== 1) throw new Error('课程清单不兼容');
      await store.put('meta', 'withdrawn', Array.isArray(index.withdrawn) ? index.withdrawn : []).catch(() => {});
      updates?.postMessage({ withdrawn: index.withdrawn || [] });
      if (activePack && index.withdrawn?.includes(activePack.id + '@' + activePack.revision)) withdrawn = true;
      const descriptor = index.courses[courseId];
      if (!descriptor) throw new Error('课程暂未准备好');
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
  async function background(pack) {
    const audioQueue = [...pack.audio];
    Promise.all(Array.from({ length: 2 }, async () => {
      while (audioQueue.length && !cancellation.signal.aborted) {
        try { await store.obtain(audioQueue.shift(), { signal: cancellation.signal }); } catch {}
      }
    })).catch(() => {});
    if (!controlled || !navigator.onLine || navigator.connection?.saveData) return;
    replacement = (async () => { let next; try {
      next = await latest();
      if (next.revision === pack.revision) return;
      await prepare(next, false);
      await store.commit(next);
    } catch { /* Keep the current complete version unless explicitly withdrawn. */ }
    finally { if (next) await store.remove('meta', leaseKey(next)).catch(() => {}); }
    })();
    await replacement;
    rpc(navigator.serviceWorker.controller, { type: 'course:trim' }, 15000).catch(() => {});
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
  async function boot(refresh = retryAfterReload) {
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
      let pack = allowed(cachedPack) ? cachedPack : null;
      if (refresh || !pack) {
        try { pack = await latest(); }
        catch (error) {
          // A failed update must not destroy a usable offline package. Recheck
          // withdrawal/access metadata after latest(), then verify every byte.
          const fallback = await store.current(courseId);
          if (!allowed(fallback)) throw error;
          pack = fallback;
        }
      }
      phase = 'L03';
      let resources;
      try { resources = await prepare(pack); }
      catch (error) {
        // A session-only recovery may not have been able to save its new pack.
        // If the cached pack is now broken, try the current server version once
        // rather than trapping every revisit behind the same expired URL.
        // Keep a usable offline pack and never clear a child's learning data.
        if (refresh || pack !== cachedPack || cancellation.signal.aborted || !['L03', 'L04', 'L05'].includes(error.courseCode)) throw error;
        let next;
        try { next = await latest(); } catch { throw error; }
        if (next.revision === pack.revision) throw error;
        pack = next;
        resources = await prepare(pack);
      }
      phase = 'L05';
      await start(pack, resources);
    } catch (error) {
      showFailure(error, phase);
    } finally { clearTimeout(slow); clearTimeout(retryTimer); running = false; }
  }
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    cancellation.abort();
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
    document.getElementById('courseLoadingRetry').addEventListener('click', () => startAttempted || running ? reloadForRetry() : boot(true));
    boot();
  });
})();
