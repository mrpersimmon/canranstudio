(function attachLandmarkReview(root, factory) {
  'use strict';
  const catalogApi = typeof module === 'object' && module.exports
    ? require('../../core/course-catalog')
    : root?.CanranCore?.courseCatalog;
  const atlasApi = typeof module === 'object' && module.exports
    ? require('../../core/adventure-atlas')
    : root?.CanranCore?.adventureAtlas;
  const api = factory(catalogApi, atlasApi);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranPoc = root.CanranPoc || {};
    root.CanranPoc.landmarkReview = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function landmarkReviewFactory(catalogApi, atlasApi) {
  'use strict';

  const VIEWPORTS = Object.freeze(['huawei', 'tablet', 'master']);
  const REVIEWS = Object.freeze(['art', 'placement']);
  const VIEWPORT_WIDTHS = Object.freeze({ huawei: 466, tablet: 768, master: 1024 });
  const REVIEW_ASSET_WIDTHS = Object.freeze([512, 768, 1024]);
  const REVIEW_CACHE_NAME = 'canran-landmark-review-assets-v1';
  const PRELOAD_CONCURRENCY = 2;

  function freezeList(items) {
    items.forEach(Object.freeze);
    return Object.freeze(items);
  }

  function getReviewLocations(catalog = catalogApi) {
    if (!catalog || !Array.isArray(catalog.COURSES)) return Object.freeze([]);
    return freezeList(catalog.COURSES
      .filter(course => (
        course?.courseStatus === 'published' &&
        catalog.assessLearningLocation(course).status === 'published' &&
        course.map?.landmarkMode === 'states' &&
        Array.isArray(course.map.stateAssets) &&
        course.map.stateAssets.length > 0
      ))
      .map(course => ({
        id: course.id,
        kind: course.kind,
        lesson: course.lesson,
        title: course.title,
        subtitle: course.subtitle,
        tone: course.tone,
        stateAssets: course.map.stateAssets,
        stageIds: course.map.stages.map(stage => stage.progressId)
      })));
  }

  function canReviewPlacement(locationId, routePage) {
    return Array.isArray(routePage?.locationIds) &&
      routePage.locationIds.includes(locationId) &&
      Boolean(routePage?.placements?.[locationId]);
  }

  function normalizeReviewState(search, locations, routePage) {
    const params = new URLSearchParams(search || '');
    const requestedLocation = params.get('location');
    const location = locations.find(candidate => candidate.id === requestedLocation) || locations[0];
    if (!location) return Object.freeze({ location: null, stage: 0, review: 'art', viewport: 'huawei' });

    const parsedStage = Number.parseInt(params.get('stage'), 10);
    const stage = Math.min(
      location.stateAssets.length - 1,
      Math.max(0, Number.isFinite(parsedStage) ? parsedStage : 0)
    );
    const requestedReview = params.get('review');
    const supportedReview = REVIEWS.includes(requestedReview) ? requestedReview : 'art';
    const review = supportedReview === 'placement' && !canReviewPlacement(location.id, routePage)
      ? 'art'
      : supportedReview;
    const requestedViewport = params.get('viewport');
    const viewport = VIEWPORTS.includes(requestedViewport) ? requestedViewport : 'huawei';
    return Object.freeze({ location: location.id, stage, review, viewport });
  }

  function serializeReviewState(state) {
    const params = new URLSearchParams();
    params.set('location', state.location);
    params.set('stage', String(state.stage));
    params.set('review', state.review);
    params.set('viewport', state.viewport);
    return `?${params.toString()}`;
  }

  function stageLabels(location) {
    return location.stateAssets.map((asset, index) => {
      if (index === 0) return '初始';
      if (index === location.stateAssets.length - 1) return '完成';
      return String(index);
    });
  }

  function buildPlacementModels(locations, state, routePage) {
    const byId = new Map(locations.map(location => [location.id, location]));
    return freezeList((routePage?.locationIds || []).flatMap(id => {
      const location = byId.get(id);
      const placement = routePage?.placements?.[id];
      if (!location || !placement) return [];
      return [{
        ...location,
        placement,
        stage: id === state.location
          ? Math.min(state.stage, location.stateAssets.length - 1)
          : 0
      }];
    }));
  }

  function versionedUrl(path, version) {
    return `/${path}?v=${encodeURIComponent(version)}`;
  }

  function buildReviewAssetPlan(location) {
    if (!location || !Array.isArray(location.stateAssets)) return Object.freeze([]);
    return freezeList(location.stateAssets.flatMap((asset, stage) => REVIEW_ASSET_WIDTHS.map(width => {
      const variants = Array.isArray(asset.variants) ? asset.variants : [];
      const variant = variants.find(candidate => candidate.width === width) || variants
        .slice()
        .sort((left, right) => Math.abs(left.width - width) - Math.abs(right.width - width))[0];
      const candidates = [variant?.avif, variant?.webp, asset.png]
        .filter((path, index, list) => path && list.indexOf(path) === index)
        .map(path => ({
          path,
          format: path.split('.').pop().toLowerCase(),
          relativeUrl: versionedUrl(path, asset.version)
        }));
      return {
        key: `${location.id}:${stage}:${width}`,
        locationId: location.id,
        stage,
        width,
        candidates
      };
    })));
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function createReviewAssetPool({ windowRef, onStatus }) {
    let session = null;
    let generation = 0;
    const objectUrls = new Set();
    const cachePromise = windowRef.caches?.open
      ? windowRef.caches.open(REVIEW_CACHE_NAME).catch(() => null)
      : Promise.resolve(null);

    function snapshot(activeSession = session) {
      if (!activeSession) {
        return Object.freeze({
          state: 'idle', ready: 0, total: 0, failed: 0,
          transferredBytes: 0, cacheHits: 0, fallbacks: 0, current: null
        });
      }
      const complete = activeSession.ready + activeSession.failed === activeSession.total;
      return Object.freeze({
        state: complete
          ? (activeSession.failed > 0 ? 'failed' : 'ready')
          : 'loading',
        ready: activeSession.ready,
        total: activeSession.total,
        failed: activeSession.failed,
        transferredBytes: activeSession.transferredBytes,
        cacheHits: activeSession.cacheHits,
        fallbacks: activeSession.fallbacks,
        current: activeSession.current,
        locationId: activeSession.locationId,
        failedJobs: [...activeSession.errors.keys()].map(key => activeSession.allJobs.get(key))
          .filter(Boolean)
      });
    }

    function emit(activeSession = session) {
      if (activeSession !== session) return;
      onStatus(snapshot(activeSession));
    }

    function releaseObjectUrl(url) {
      if (!url || !objectUrls.has(url)) return;
      objectUrls.delete(url);
      windowRef.URL.revokeObjectURL(url);
    }

    function cancelSession() {
      if (!session) return;
      session.cancelled = true;
      session.controller.abort();
      session.queue.length = 0;
      for (const listeners of session.waiters.values()) {
        for (const resolve of listeners) resolve(null);
      }
      session.waiters.clear();
      for (const record of session.records.values()) releaseObjectUrl(record.objectUrl);
      session.records.clear();
      session = null;
    }

    async function decodedRecord(response, candidate) {
      const blob = await response.blob();
      const objectUrl = windowRef.URL.createObjectURL(blob);
      objectUrls.add(objectUrl);
      const image = new windowRef.Image();
      image.decoding = 'async';
      image.src = objectUrl;
      try {
        if (typeof image.decode === 'function') await image.decode();
        else await new Promise((resolve, reject) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', reject, { once: true });
        });
      } catch (error) {
        releaseObjectUrl(objectUrl);
        throw error;
      }
      return { objectUrl, candidate, byteSize: blob.size };
    }

    async function fetchCandidate(activeSession, candidate) {
      const absoluteUrl = new URL(candidate.relativeUrl, windowRef.location.href).href;
      const cache = await cachePromise;
      if (!activeSession.forceReload && cache) {
        const cached = await cache.match(absoluteUrl);
        if (cached) {
          const record = await decodedRecord(cached, { ...candidate, absoluteUrl });
          return { ...record, cacheHit: true, transferredBytes: 0 };
        }
      }

      let lastError = null;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await windowRef.fetch(absoluteUrl, {
            cache: activeSession.forceReload ? 'reload' : 'force-cache',
            credentials: 'same-origin',
            signal: activeSession.controller.signal
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const cacheCopy = response.clone();
          const record = await decodedRecord(response, { ...candidate, absoluteUrl });
          if (cache) await cache.put(absoluteUrl, cacheCopy).catch(() => {});
          return {
            ...record,
            cacheHit: false,
            transferredBytes: record.byteSize
          };
        } catch (error) {
          if (activeSession.controller.signal.aborted) throw error;
          lastError = error;
          if (cache) await cache.delete(absoluteUrl).catch(() => {});
        }
      }
      throw lastError || new Error(`unable to prepare ${absoluteUrl}`);
    }

    async function prepareJob(activeSession, job) {
      let lastError = null;
      for (let index = 0; index < job.candidates.length; index += 1) {
        const candidate = job.candidates[index];
        try {
          return {
            ...(await fetchCandidate(activeSession, candidate)),
            fallback: index > 0
          };
        } catch (error) {
          if (activeSession.controller.signal.aborted) throw error;
          lastError = error;
        }
      }
      throw lastError || new Error(`no usable asset for ${job.key}`);
    }

    function resolveWaiters(activeSession, key, record) {
      const listeners = activeSession.waiters.get(key) || [];
      activeSession.waiters.delete(key);
      for (const resolve of listeners) resolve(record);
    }

    function settle(activeSession) {
      if (activeSession !== session || activeSession.cancelled) return;
      if (activeSession.active > 0 || activeSession.queue.length > 0) return;
      activeSession.current = null;
      emit(activeSession);
      activeSession.resolve(snapshot(activeSession));
    }

    function pump(activeSession) {
      if (activeSession !== session || activeSession.cancelled) return;
      while (activeSession.active < PRELOAD_CONCURRENCY && activeSession.queue.length > 0) {
        const job = activeSession.queue.shift();
        activeSession.active += 1;
        activeSession.current = job;
        emit(activeSession);
        prepareJob(activeSession, job)
          .then(record => {
            if (activeSession !== session || activeSession.cancelled) {
              releaseObjectUrl(record.objectUrl);
              return;
            }
            activeSession.records.set(job.key, {
              ...record,
              key: job.key,
              stage: job.stage,
              width: job.width
            });
            resolveWaiters(activeSession, job.key, activeSession.records.get(job.key));
            activeSession.ready += 1;
            activeSession.transferredBytes += record.transferredBytes;
            if (record.cacheHit) activeSession.cacheHits += 1;
            if (record.fallback) activeSession.fallbacks += 1;
          })
          .catch(error => {
            if (activeSession !== session || activeSession.cancelled) return;
            activeSession.failed += 1;
            activeSession.errors.set(job.key, error);
            resolveWaiters(activeSession, job.key, null);
          })
          .finally(() => {
            activeSession.active -= 1;
            emit(activeSession);
            pump(activeSession);
            settle(activeSession);
          });
      }
      settle(activeSession);
    }

    function prioritize(queue, stage, width) {
      return queue.slice().sort((left, right) => {
        const leftRank = [
          left.stage === stage ? 0 : 1,
          left.width === width ? 0 : 1,
          Math.abs(left.stage - stage),
          REVIEW_ASSET_WIDTHS.indexOf(left.width)
        ];
        const rightRank = [
          right.stage === stage ? 0 : 1,
          right.width === width ? 0 : 1,
          Math.abs(right.stage - stage),
          REVIEW_ASSET_WIDTHS.indexOf(right.width)
        ];
        for (let index = 0; index < leftRank.length; index += 1) {
          if (leftRank[index] !== rightRank[index]) return leftRank[index] - rightRank[index];
        }
        return 0;
      });
    }

    function start(location, { stage = 0, viewport = 'huawei', forceReload = false } = {}) {
      const targetWidth = REVIEW_ASSET_WIDTHS.find(width => width >= VIEWPORT_WIDTHS[viewport]) || 1024;
      if (session && session.locationId === location.id && !forceReload) {
        session.queue = prioritize(session.queue, stage, targetWidth);
        emit(session);
        return session.done;
      }
      cancelSession();
      generation += 1;
      let resolveDone;
      const done = new Promise(resolve => { resolveDone = resolve; });
      const plan = buildReviewAssetPlan(location);
      session = {
        generation,
        locationId: location.id,
        forceReload,
        queue: prioritize(plan, stage, targetWidth),
        allJobs: new Map(plan.map(job => [job.key, job])),
        active: 0,
        ready: 0,
        total: plan.length,
        failed: 0,
        transferredBytes: 0,
        cacheHits: 0,
        fallbacks: 0,
        current: null,
        records: new Map(),
        errors: new Map(),
        waiters: new Map(),
        cancelled: false,
        controller: new windowRef.AbortController(),
        done,
        resolve: resolveDone
      };
      emit(session);
      pump(session);
      return done;
    }

    function getRecord(locationId, stage, viewport) {
      if (!session || session.locationId !== locationId) return null;
      const width = REVIEW_ASSET_WIDTHS.find(candidate => candidate >= VIEWPORT_WIDTHS[viewport]) || 1024;
      return session.records.get(`${locationId}:${stage}:${width}`) || null;
    }

    function ensure(location, stage, viewport) {
      const width = REVIEW_ASSET_WIDTHS.find(candidate => candidate >= VIEWPORT_WIDTHS[viewport]) || 1024;
      if (!session || session.locationId !== location.id) {
        start(location, { stage, viewport });
      }
      const key = `${location.id}:${stage}:${width}`;
      const record = session.records.get(key);
      if (record) return Promise.resolve(record);
      if (session.errors.has(key)) return Promise.resolve(null);
      session.queue = prioritize(session.queue, stage, width);
      pump(session);
      return new Promise(resolve => {
        const listeners = session.waiters.get(key) || [];
        listeners.push(resolve);
        session.waiters.set(key, listeners);
      });
    }

    function retryFailed() {
      if (!session || session.errors.size === 0) return;
      const jobs = [...session.errors.keys()]
        .map(key => session.allJobs.get(key))
        .filter(Boolean);
      for (const job of jobs) session.errors.delete(job.key);
      session.failed = Math.max(0, session.failed - jobs.length);
      session.queue.unshift(...jobs);
      emit(session);
      pump(session);
    }

    return Object.freeze({
      start,
      ensure,
      retryFailed,
      getRecord,
      getSnapshot: () => snapshot(),
      destroy() {
        cancelSession();
        for (const url of [...objectUrls]) releaseObjectUrl(url);
      }
    });
  }

  function pictureElement(documentRef, asset, {
    alt = '',
    sizes = '100vw',
    marker = null,
    className = ''
  } = {}) {
    const picture = documentRef.createElement('picture');
    const variants = Array.isArray(asset?.variants) ? asset.variants : [];
    for (const format of ['avif', 'webp']) {
      const source = documentRef.createElement('source');
      source.type = `image/${format}`;
      source.sizes = sizes;
      source.srcset = variants.map(variant => (
        `${versionedUrl(variant[format], asset.version)} ${variant.width}w`
      )).join(', ');
      picture.append(source);
    }
    const image = documentRef.createElement('img');
    image.src = versionedUrl(asset.png, asset.version);
    image.alt = alt;
    image.sizes = sizes;
    image.className = className;
    image.decoding = 'async';
    image.draggable = false;
    if (marker) image.setAttribute(marker, '');
    picture.append(image);
    return { picture, image };
  }

  function placementStyle(element, placement) {
    for (const side of ['top', 'right', 'bottom', 'left', 'width']) {
      if (Number.isFinite(placement?.[side])) element.style[side] = `${placement[side]}%`;
    }
  }

  function mount(rootElement, {
    catalog = catalogApi,
    atlas = atlasApi,
    windowRef = typeof window !== 'undefined' ? window : null,
    documentRef = typeof document !== 'undefined' ? document : null
  } = {}) {
    if (!rootElement || !catalog || !atlas || !windowRef || !documentRef) {
      throw new Error('landmark review dependencies are unavailable');
    }
    const locations = getReviewLocations(catalog);
    const routePage = atlas.GOLDEN_ROUTE_PAGE;
    let state = normalizeReviewState(windowRef.location.search, locations, routePage);
    let renderGeneration = 0;
    let warmupHandle = null;
    let warmupHandleType = null;
    const picker = rootElement.querySelector('[data-location-picker]');
    const stageStrip = rootElement.querySelector('[data-stage-strip]');
    const reviewTabs = rootElement.querySelector('[data-review-tabs]');
    const viewportTabs = rootElement.querySelector('[data-viewport-tabs]');
    const frame = rootElement.querySelector('[data-review-frame]');
    const preloadStatus = rootElement.querySelector('[data-review-preload-status]');
    const preloadCount = rootElement.querySelector('[data-review-preload-count]');
    const preloadDetail = rootElement.querySelector('[data-review-preload-detail]');
    const preloadProgress = rootElement.querySelector('[data-review-preload-progress]');

    function renderPreloadStatus(status) {
      preloadStatus.dataset.state = status.state;
      if (status.locationId) preloadStatus.dataset.locationId = status.locationId;
      else delete preloadStatus.dataset.locationId;
      preloadCount.textContent = `${status.ready}/${status.total}`;
      preloadProgress.max = Math.max(1, status.total);
      preloadProgress.value = status.ready;
      const transfer = formatBytes(status.transferredBytes);
      if (status.state === 'ready') {
        const fallback = status.fallbacks > 0 ? ` · 兼容格式 ${status.fallbacks}` : '';
        preloadDetail.textContent = `${transfer} · 缓存命中 ${status.cacheHits}${fallback} · 三档已解码`;
      } else if (status.state === 'failed') {
        const first = status.failedJobs?.[0];
        const formats = first?.candidates?.map(candidate => candidate.format.toUpperCase()).join('/') || '';
        const resource = first
          ? ` · Stage ${first.stage} · ${first.width}px${formats ? ` · ${formats}` : ''}`
          : '';
        preloadDetail.textContent = `${status.failed} 项失败${resource} · ${transfer} · 可重试`;
      } else if (status.current) {
        const format = status.current.candidates?.[0]?.format?.toUpperCase() || '图片';
        preloadDetail.textContent = `Stage ${status.current.stage} · ${status.current.width}px · ${format} · ${transfer}`;
      } else {
        preloadDetail.textContent = '等待当前图片';
      }
      const retry = rootElement.querySelector('[data-review-retry]');
      if (retry) retry.hidden = status.failed === 0;
    }

    const assetPool = createReviewAssetPool({ windowRef, onStatus: renderPreloadStatus });

    function reviewAssetElement(location, stage, {
      alt = '',
      sizes = '100vw',
      marker = null,
      className = ''
    } = {}) {
      const asset = location.stateAssets[stage];
      const record = assetPool.getRecord(location.id, stage, state.viewport);
      if (!record) {
        const fallback = pictureElement(documentRef, asset, { alt, sizes, marker, className });
        fallback.image.dataset.sourcePath = asset.png;
        return { element: fallback.picture, image: fallback.image };
      }
      const image = documentRef.createElement('img');
      image.src = record.objectUrl;
      image.alt = alt;
      image.sizes = sizes;
      image.className = className;
      image.decoding = 'async';
      image.draggable = false;
      image.dataset.sourcePath = asset.png;
      image.dataset.preparedWidth = String(record.candidate?.width || record.width || '');
      if (marker) image.setAttribute(marker, '');
      return { element: image, image };
    }

    picker.replaceChildren(...locations.map(location => {
      const option = documentRef.createElement('option');
      option.value = location.id;
      option.textContent = location.lesson
        ? `Lesson ${location.lesson} · ${location.title}`
        : location.title;
      return option;
    }));

    function currentLocation() {
      return locations.find(location => location.id === state.location) || locations[0];
    }

    function syncUrl() {
      const next = `${windowRef.location.pathname}${serializeReviewState(state)}${windowRef.location.hash}`;
      windowRef.history.replaceState(null, '', next);
    }

    function cancelWarmupSchedule() {
      if (warmupHandle !== null) {
        if (warmupHandleType === 'idle' && typeof windowRef.cancelIdleCallback === 'function') {
          windowRef.cancelIdleCallback(warmupHandle);
        } else if (warmupHandleType === 'timeout') {
          windowRef.clearTimeout(warmupHandle);
        }
      }
      warmupHandle = null;
      warmupHandleType = null;
    }

    function warmAllStages(location, stage, image) {
      cancelWarmupSchedule();
      const schedule = () => {
        const run = () => {
          warmupHandle = null;
          warmupHandleType = null;
          assetPool.start(location, { stage, viewport: state.viewport });
        };
        if (typeof windowRef.requestIdleCallback === 'function') {
          warmupHandle = windowRef.requestIdleCallback(run, { timeout: 250 });
          warmupHandleType = 'idle';
        } else {
          warmupHandle = windowRef.setTimeout(run, 40);
          warmupHandleType = 'timeout';
        }
      };
      const afterDecode = async () => {
        if (typeof image.decode === 'function') await image.decode().catch(() => {});
        schedule();
      };
      if (image.complete) afterDecode();
      else image.addEventListener('load', afterDecode, { once: true });
    }

    function renderArtAsset(location, stage, previewing = false) {
      const artboard = frame.querySelector('[data-artboard]');
      if (!artboard) return;
      const targetWidth = VIEWPORT_WIDTHS[state.viewport];
      const { element, image } = reviewAssetElement(location, stage, {
        alt: `${location.title} · ${stageLabels(location)[stage]}`,
        sizes: `${targetWidth}px`,
        marker: 'data-current-art'
      });
      artboard.replaceChildren(element);
      artboard.dataset.previewingPrevious = String(previewing);
      artboard.dataset.displayedStage = String(stage);
      if (!previewing) warmAllStages(location, stage, image);
    }

    function restoreCurrentArt() {
      const artboard = frame.querySelector('[data-artboard]');
      if (!artboard || artboard.dataset.previewingPrevious !== 'true') return;
      renderArtAsset(currentLocation(), state.stage, false);
    }

    function renderArt(location) {
      const artboard = documentRef.createElement('button');
      artboard.type = 'button';
      artboard.className = 'artboard';
      artboard.dataset.artboard = '';
      artboard.dataset.previewingPrevious = 'false';
      artboard.setAttribute('aria-label', state.stage > 0
        ? '按住查看上一阶段，松开恢复当前阶段'
        : `${location.title} 初始阶段`);
      frame.replaceChildren(artboard);
      renderArtAsset(location, state.stage, false);

      artboard.addEventListener('pointerdown', event => {
        if (state.stage <= 0 || event.button > 0) return;
        event.preventDefault();
        renderArtAsset(location, state.stage - 1, true);
      });
      for (const eventName of ['pointerup', 'pointercancel', 'pointerleave', 'lostpointercapture']) {
        artboard.addEventListener(eventName, restoreCurrentArt);
      }
    }

    function renderPlacement(location) {
      const map = documentRef.createElement('div');
      map.className = 'placement-map';
      map.dataset.placementMap = '';
      map.setAttribute('aria-label', `${routePage.title}地图落位`);
      const targetWidth = Math.min(VIEWPORT_WIDTHS[state.viewport], routePage.canvas.width);
      const background = pictureElement(documentRef, routePage.backgroundAsset, {
        alt: '',
        sizes: `${targetWidth}px`,
        className: 'placement-map__background'
      }).picture;
      background.className = 'placement-map__paper';
      background.setAttribute('aria-hidden', 'true');
      map.append(background);

      const list = documentRef.createElement('ol');
      list.className = 'placement-locations';
      let selectedImage = null;
      for (const model of buildPlacementModels(locations, state, routePage)) {
        const item = documentRef.createElement('li');
        item.className = 'placement-location';
        item.dataset.placementLocation = '';
        item.dataset.locationId = model.id;
        item.dataset.stage = String(model.stage);
        placementStyle(item, model.placement);

        const art = documentRef.createElement('div');
        art.className = 'placement-location__art';
        const artWidth = Math.round(targetWidth * model.placement.width / 100);
        if (model.id === state.location) {
          const prepared = reviewAssetElement(model, model.stage, {
            alt: '',
            sizes: `${artWidth}px`,
            marker: 'data-current-art'
          });
          selectedImage = prepared.image;
          art.append(prepared.element);
        } else {
          art.append(pictureElement(documentRef, model.stateAssets[model.stage], {
            alt: '',
            sizes: `${artWidth}px`
          }).picture);
        }

        const plaque = documentRef.createElement('div');
        plaque.className = 'placement-plaque';
        const kind = documentRef.createElement('span');
        kind.className = 'placement-kind';
        kind.textContent = model.lesson ? `LESSON ${model.lesson}` : 'SPECIAL QUEST';
        const title = documentRef.createElement('strong');
        title.className = 'placement-title';
        title.textContent = model.title;
        const stamps = documentRef.createElement('span');
        stamps.className = 'placement-stamps';
        for (let index = 0; index < model.stageIds.length; index += 1) {
          const stamp = documentRef.createElement('span');
          stamp.className = 'placement-stamp';
          stamp.dataset.earned = String(index < model.stage);
          stamps.append(stamp);
        }
        plaque.append(kind, title, stamps);
        item.append(art, plaque);
        list.append(item);
      }
      map.append(list);
      frame.replaceChildren(map);
      if (selectedImage) warmAllStages(location, state.stage, selectedImage);
    }

    function renderControls(location) {
      picker.value = location.id;
      stageStrip.replaceChildren(...stageLabels(location).map((label, index) => {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.className = 'stage-button';
        button.dataset.stageButton = String(index);
        button.setAttribute('aria-label', `阶段 ${label}`);
        button.setAttribute('aria-pressed', String(index === state.stage));
        button.textContent = label;
        return button;
      }));

      const reviewChoices = [
        { id: 'art', label: '状态美术' },
        ...(canReviewPlacement(location.id, routePage)
          ? [{ id: 'placement', label: '地图落位' }]
          : [])
      ];
      reviewTabs.replaceChildren(...reviewChoices.map(choice => {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.dataset.reviewButton = choice.id;
        button.setAttribute('aria-pressed', String(state.review === choice.id));
        button.textContent = choice.label;
        return button;
      }));
      for (const button of viewportTabs.querySelectorAll('[data-viewport-button]')) {
        button.setAttribute('aria-pressed', String(button.dataset.viewportButton === state.viewport));
      }
    }

    function render({ updateUrl = false } = {}) {
      renderGeneration += 1;
      const location = currentLocation();
      state = normalizeReviewState(serializeReviewState(state), locations, routePage);
      delete frame.dataset.pendingStage;
      delete frame.dataset.pendingReview;
      delete frame.dataset.pendingViewport;
      frame.dataset.viewport = state.viewport;
      frame.dataset.review = state.review;
      renderControls(location);
      if (state.review === 'placement') renderPlacement(location);
      else renderArt(location);
      if (updateUrl) syncUrl();
    }

    function transitionWithinLocation(nextState, { updateUrl = false } = {}) {
      state = normalizeReviewState(serializeReviewState(nextState), locations, routePage);
      const location = currentLocation();
      const generation = ++renderGeneration;
      frame.dataset.pendingStage = String(state.stage);
      frame.dataset.pendingReview = state.review;
      frame.dataset.pendingViewport = state.viewport;
      renderControls(location);
      if (updateUrl) syncUrl();
      assetPool.ensure(location, state.stage, state.viewport).then(record => {
        if (generation !== renderGeneration || !record) return;
        delete frame.dataset.pendingStage;
        delete frame.dataset.pendingReview;
        delete frame.dataset.pendingViewport;
        frame.dataset.viewport = state.viewport;
        frame.dataset.review = state.review;
        if (state.review === 'placement') renderPlacement(location);
        else renderArt(location);
      });
    }

    picker.addEventListener('change', () => {
      state = { ...state, location: picker.value };
      render({ updateUrl: true });
    });
    rootElement.addEventListener('click', event => {
      const recheckButton = event.target.closest('[data-review-recheck]');
      if (recheckButton) {
        cancelWarmupSchedule();
        assetPool.start(currentLocation(), {
          stage: state.stage,
          viewport: state.viewport,
          forceReload: true
        });
        return;
      }
      const retryButton = event.target.closest('[data-review-retry]');
      if (retryButton) {
        assetPool.retryFailed();
        return;
      }
      const stageButton = event.target.closest('[data-stage-button]');
      if (stageButton) {
        transitionWithinLocation({
          ...state,
          stage: Number(stageButton.dataset.stageButton)
        }, { updateUrl: true });
        return;
      }
      const reviewButton = event.target.closest('[data-review-button]');
      if (reviewButton) {
        transitionWithinLocation({
          ...state,
          review: reviewButton.dataset.reviewButton
        }, { updateUrl: true });
        return;
      }
      const viewportButton = event.target.closest('[data-viewport-button]');
      if (viewportButton) {
        transitionWithinLocation({
          ...state,
          viewport: viewportButton.dataset.viewportButton
        }, { updateUrl: true });
        return;
      }
      const stepButton = event.target.closest('[data-location-step]');
      if (stepButton) {
        const index = locations.findIndex(location => location.id === state.location);
        const direction = stepButton.dataset.locationStep === 'previous' ? -1 : 1;
        const nextIndex = (index + direction + locations.length) % locations.length;
        state = { ...state, location: locations[nextIndex].id };
        render({ updateUrl: true });
      }
    });
    windowRef.addEventListener('pointerup', restoreCurrentArt);
    windowRef.addEventListener('pointercancel', restoreCurrentArt);
    windowRef.addEventListener('blur', restoreCurrentArt);
    function handlePopState() {
      state = normalizeReviewState(windowRef.location.search, locations, routePage);
      render();
    }
    windowRef.addEventListener('popstate', handlePopState);
    render({ updateUrl: true });

    return Object.freeze({
      getState: () => ({ ...state }),
      destroy() {
        cancelWarmupSchedule();
        assetPool.destroy();
        windowRef.removeEventListener('pointerup', restoreCurrentArt);
        windowRef.removeEventListener('pointercancel', restoreCurrentArt);
        windowRef.removeEventListener('blur', restoreCurrentArt);
        windowRef.removeEventListener('popstate', handlePopState);
      }
    });
  }

  return Object.freeze({
    VIEWPORTS,
    getReviewLocations,
    normalizeReviewState,
    serializeReviewState,
    stageLabels,
    buildPlacementModels,
    mount
  });
});
