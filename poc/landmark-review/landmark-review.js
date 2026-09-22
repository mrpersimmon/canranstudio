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

  const VIEWPORTS = Object.freeze(['iphone', 'huawei', 'tablet', 'desktop', 'master']);
  const REVIEWS = Object.freeze(['art', 'placement', 'student']);
  const SCENARIOS = Object.freeze(['journey', 'initial', 'complete']);
  const VIEWPORT_WIDTHS = Object.freeze({
    iphone: 390,
    huawei: 466,
    tablet: 768,
    desktop: 1024,
    master: 1024
  });
  const REVIEW_ASSET_WIDTHS = Object.freeze([512, 768, 1024]);
  const REVIEW_CACHE_NAME = 'canran-landmark-review-assets-v1';
  const PRELOAD_CONCURRENCY = 2;
  const STUDENT_VIEWPORTS = Object.freeze({
    iphone: Object.freeze({ width: 390, height: 844, label: 'iPhone 12' }),
    huawei: Object.freeze({ width: 466, height: 980, label: '华为大屏手机' }),
    tablet: Object.freeze({ width: 768, height: 1024, label: '常用平板' }),
    desktop: Object.freeze({ width: 1366, height: 768, label: '电脑双页摊开' }),
    master: Object.freeze({ width: 940, height: 1672, label: '美术母版' })
  });
  const STUDENT_TOOLBAR_HEIGHT = 56;
  const STUDENT_CAT_POSITIONS = Object.freeze({
    'district5-page2-review': Object.freeze({
      lesson53: Object.freeze({ left: 45, top: 18.2 }),
      lesson54: Object.freeze({ left: 42, top: 45.5, flip: true }),
      'route-exit': Object.freeze({ left: 43, top: 91.2 })
    })
  });

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

  function reviewRoutePages(routePages) {
    if (Array.isArray(routePages)) return routePages;
    return routePages ? [routePages] : [];
  }

  function resolveReviewRoutePage(locationId, routePages) {
    return reviewRoutePages(routePages).find(routePage => (
      Array.isArray(routePage?.locationIds) &&
      routePage.locationIds.includes(locationId) &&
      Boolean(routePage?.placements?.[locationId])
    )) || null;
  }

  function canReviewPlacement(locationId, routePages) {
    return Boolean(resolveReviewRoutePage(locationId, routePages));
  }

  function normalizeReviewState(search, locations, routePages) {
    const params = new URLSearchParams(search || '');
    const requestedLocation = params.get('location');
    const location = locations.find(candidate => candidate.id === requestedLocation) || locations[0];
    if (!location) {
      return Object.freeze({
        location: null,
        stage: 0,
        review: 'art',
        viewport: 'huawei',
        scenario: 'journey'
      });
    }

    const parsedStage = Number.parseInt(params.get('stage'), 10);
    const stage = Math.min(
      location.stateAssets.length - 1,
      Math.max(0, Number.isFinite(parsedStage) ? parsedStage : 0)
    );
    const requestedReview = params.get('review');
    const supportedReview = REVIEWS.includes(requestedReview) ? requestedReview : 'art';
    const review = ['placement', 'student'].includes(supportedReview) &&
      !canReviewPlacement(location.id, routePages)
      ? 'art'
      : supportedReview;
    const requestedViewport = params.get('viewport');
    const viewport = VIEWPORTS.includes(requestedViewport) ? requestedViewport : 'huawei';
    const requestedScenario = params.get('scenario');
    const scenario = SCENARIOS.includes(requestedScenario) ? requestedScenario : 'journey';
    return Object.freeze({ location: location.id, stage, review, viewport, scenario });
  }

  function serializeReviewState(state) {
    const params = new URLSearchParams();
    params.set('location', state.location);
    params.set('stage', String(state.stage));
    params.set('review', state.review);
    params.set('viewport', state.viewport);
    if (state.review === 'student') params.set('scenario', state.scenario || 'journey');
    return `?${params.toString()}`;
  }

  function previewLayoutForSize(width, height) {
    if (!Number.isFinite(width) || !Number.isFinite(height)) return 'single';
    const pageWidthFromCanvas = Math.max(0, (width - 18) / 2);
    const pageWidthFromHeight = Math.max(0, height - 56) * (940 / 1672);
    return Math.min(pageWidthFromCanvas, pageWidthFromHeight) >= 390 ? 'spread' : 'single';
  }

  function studentPreviewGeometry(viewportName) {
    const viewport = STUDENT_VIEWPORTS[viewportName] || STUDENT_VIEWPORTS.huawei;
    const layout = viewportName === 'master'
      ? 'single'
      : previewLayoutForSize(viewport.width, viewport.height);
    const contentHeight = viewport.height - STUDENT_TOOLBAR_HEIGHT;
    const pageRatio = 940 / 1672;
    const pageCount = layout === 'spread' ? 2 : 1;
    const spine = layout === 'spread' ? 18 : 0;
    const widthLimit = (viewport.width - spine) / pageCount;
    const pageWidth = Math.min(widthLimit, contentHeight * pageRatio);
    return Object.freeze({
      ...viewport,
      layout,
      pageWidth,
      pageHeight: pageWidth / pageRatio,
      toolbarHeight: STUDENT_TOOLBAR_HEIGHT
    });
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

  function buildStudentPreviewModels(locations, state, routePages) {
    const byId = new Map(locations.map(location => [location.id, location]));
    const ordered = reviewRoutePages(routePages).flatMap(routePage => (
      (routePage?.locationIds || []).flatMap(id => {
        const location = byId.get(id);
        const placement = routePage?.placements?.[id];
        if (!location || !placement) return [];
        return [{ ...location, routePageId: routePage.id, placement }];
      })
    ));
    const selectedIndex = ordered.findIndex(location => location.id === state.location);
    return freezeList(ordered.map((location, index) => {
      let stage = 0;
      if (state.scenario === 'complete') {
        stage = location.stateAssets.length - 1;
      } else if (state.scenario === 'journey') {
        if (index < selectedIndex) stage = location.stateAssets.length - 1;
        else if (index === selectedIndex) {
          stage = Math.min(Math.max(0, state.stage || 0), location.stateAssets.length - 1);
        }
      }
      return {
        ...location,
        stage,
        current: index === selectedIndex
      };
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

    function throwIfCancelled(activeSession) {
      if (!activeSession.cancelled && !activeSession.controller.signal.aborted) return;
      const error = new Error('review preload session cancelled');
      error.name = 'AbortError';
      throw error;
    }

    async function fetchCandidate(activeSession, candidate) {
      throwIfCancelled(activeSession);
      const absoluteUrl = new URL(candidate.relativeUrl, windowRef.location.href).href;
      const cache = await cachePromise;
      throwIfCancelled(activeSession);
      if (!activeSession.forceReload && cache) {
        const cached = await cache.match(absoluteUrl);
        throwIfCancelled(activeSession);
        if (cached) {
          const record = await decodedRecord(cached, { ...candidate, absoluteUrl });
          if (activeSession.cancelled || activeSession.controller.signal.aborted) {
            releaseObjectUrl(record.objectUrl);
            throwIfCancelled(activeSession);
          }
          return { ...record, cacheHit: true, transferredBytes: 0 };
        }
      }

      let lastError = null;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          throwIfCancelled(activeSession);
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
      cancel() { cancelSession(); emit(); },
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
    const routePages = atlas.LANDMARK_REVIEW_ROUTE_PAGES || [atlas.GOLDEN_ROUTE_PAGE];
    let state = normalizeReviewState(windowRef.location.search, locations, routePages);
    let renderGeneration = 0;
    let warmupHandle = null;
    let warmupHandleType = null;
    let studentTurnTimer = null;
    let immersiveControlsTimer = null;
    let immersiveNativeActive = false;
    let immersiveNativeEnteredAt = 0;
    let immersiveReturnFocus = null;
    const picker = rootElement.querySelector('[data-location-picker]');
    const stageStrip = rootElement.querySelector('[data-stage-strip]');
    const reviewTabs = rootElement.querySelector('[data-review-tabs]');
    const viewportTabs = rootElement.querySelector('[data-viewport-tabs]');
    const scenarioPanel = rootElement.querySelector('[data-scenario-panel]');
    const scenarioTabs = rootElement.querySelector('[data-scenario-tabs]');
    const frame = rootElement.querySelector('[data-review-frame]');
    const preloadStatus = rootElement.querySelector('[data-review-preload-status]');
    const preloadCount = rootElement.querySelector('[data-review-preload-count]');
    const preloadDetail = rootElement.querySelector('[data-review-preload-detail]');
    const preloadProgress = rootElement.querySelector('[data-review-preload-progress]');
    const immersiveStatus = rootElement.querySelector('[data-immersive-status]');

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

    function currentRoutePage() {
      return resolveReviewRoutePage(state.location, routePages);
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
      const isCurrentImage = () => image.isConnected && state.location === location.id;
      const schedule = () => {
        if (!isCurrentImage()) return;
        const run = () => {
          warmupHandle = null;
          warmupHandleType = null;
          if (!isCurrentImage()) return;
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
      const routePage = currentRoutePage();
      if (!routePage) {
        renderArt(location);
        return;
      }
      const map = documentRef.createElement('div');
      map.className = 'placement-map';
      map.dataset.placementMap = '';
      map.dataset.routePageId = routePage.id;
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

    function studentPageTarget(routePage, direction) {
      if (!routePage || typeof atlas.routePageNeighbors !== 'function') return null;
      const neighbor = atlas.routePageNeighbors(routePage.id, routePages)?.[direction] || null;
      if (!neighbor) return null;
      const locationId = (neighbor.locationIds || []).find(id => (
        locations.some(location => location.id === id)
      ));
      return locationId ? { routePage: neighbor, locationId } : null;
    }

    function createStudentMascot(routePage) {
      const placement = routePage.mascotPlacement;
      const position = placement?.entranceAnchors?.[state.location] ||
        STUDENT_CAT_POSITIONS[routePage.id]?.[state.location];
      const mascotAsset = routePage.mascotAsset || atlas.GOLDEN_ROUTE_PAGE?.mascotAsset;
      const flagAsset = routePage.flagAsset || atlas.GOLDEN_ROUTE_PAGE?.flagAsset;
      if (!position || !mascotAsset || !flagAsset) return null;
      const mascot = documentRef.createElement('div');
      mascot.className = 'student-mascot';
      mascot.dataset.studentMascot = '';
      mascot.dataset.locationId = state.location;
      mascot.dataset.flip = String(Boolean(position.flip));
      mascot.style.left = `${position.left}%`;
      mascot.style.top = `${position.top}%`;
      if (Number.isFinite(placement?.width)) mascot.style.width = `${placement.width}%`;
      const flag = pictureElement(documentRef, flagAsset, {
        alt: '',
        sizes: '96px'
      }).picture;
      flag.className = 'student-mascot__flag';
      flag.dataset.studentFlag = '';
      flag.setAttribute('aria-hidden', 'true');
      const cat = pictureElement(documentRef, mascotAsset, {
        alt: '',
        sizes: '112px'
      }).picture;
      cat.className = 'student-mascot__cat';
      cat.setAttribute('aria-hidden', 'true');
      mascot.append(flag, cat);
      return mascot;
    }

    function createStudentLocation(model, targetWidth) {
      const item = documentRef.createElement('button');
      item.type = 'button';
      item.className = 'student-location';
      item.dataset.studentLocation = '';
      item.dataset.locationId = model.id;
      item.dataset.stage = String(model.stage);
      item.dataset.current = String(model.current);
      item.setAttribute('aria-label', `预览 Lesson ${model.lesson} ${model.title}`);
      placementStyle(item, model.placement);

      const art = documentRef.createElement('span');
      art.className = 'student-location__art';
      const artWidth = Math.round(targetWidth * model.placement.width / 100);
      const prepared = model.current
        ? reviewAssetElement(model, model.stage, {
          alt: '',
          sizes: `${artWidth}px`,
          marker: 'data-current-art'
        })
        : pictureElement(documentRef, model.stateAssets[model.stage], {
          alt: '',
          sizes: `${artWidth}px`
        });
      art.append(prepared.element || prepared.picture);

      const plaque = documentRef.createElement('span');
      plaque.className = 'student-location__plaque';
      const kind = documentRef.createElement('span');
      kind.className = 'student-location__kind';
      kind.textContent = `LESSON ${model.lesson}`;
      const title = documentRef.createElement('strong');
      title.className = 'student-location__title';
      title.textContent = model.title;
      const stamps = documentRef.createElement('span');
      stamps.className = 'student-location__stamps';
      for (let index = 0; index < model.stageIds.length; index += 1) {
        const stamp = documentRef.createElement('i');
        stamp.dataset.earned = String(index < model.stage);
        stamps.append(stamp);
      }
      plaque.append(kind, title, stamps);
      item.append(art, plaque);
      return { item, image: prepared.image || null };
    }

    function createStudentRoutePage(routePage, models, geometry, currentPage) {
      if (routePage?.kind === 'endpaper') {
        const endpaper = documentRef.createElement('section');
        endpaper.className = 'student-route-page student-endpaper';
        endpaper.dataset.studentRoutePage = '';
        endpaper.dataset.routePageId = routePage.id;
        const flourish = documentRef.createElement('div');
        flourish.innerHTML = '<span aria-hidden="true">✦</span><strong>冒险仍在继续</strong><small>新的路线正在绘制</small>';
        endpaper.append(flourish);
        return { page: endpaper, selectedImage: null };
      }

      const page = documentRef.createElement('section');
      page.className = 'student-route-page';
      page.dataset.studentRoutePage = '';
      page.dataset.routePageId = routePage.id;
      page.dataset.current = String(routePage.id === currentPage.id);
      page.setAttribute('aria-label', routePage.title);

      const background = pictureElement(documentRef, routePage.backgroundAsset, {
        alt: '',
        sizes: `${Math.round(geometry.pageWidth)}px`,
        className: 'student-route-page__background'
      }).picture;
      background.className = 'student-route-page__paper';
      background.setAttribute('aria-hidden', 'true');
      page.append(background);

      const name = documentRef.createElement('span');
      name.className = 'student-page-name';
      name.dataset.pageName = routePage.id;
      name.dataset.current = String(routePage.id === currentPage.id);
      name.textContent = routePage.title;
      page.append(name);

      const list = documentRef.createElement('div');
      list.className = 'student-locations';
      let selectedImage = null;
      for (const model of models.filter(candidate => candidate.routePageId === routePage.id)) {
        const created = createStudentLocation(model, geometry.pageWidth);
        if (model.current) selectedImage = created.image;
        list.append(created.item);
      }
      page.append(list);

      if (routePage.id === currentPage.id) {
        const mascot = createStudentMascot(routePage);
        if (mascot) page.append(mascot);
      }

      return { page, selectedImage };
    }

    function appendStudentPageTurns(book, routePage) {
      for (const direction of ['previous', 'next']) {
        const target = studentPageTarget(routePage, direction);
        if (!target) continue;
        const turn = documentRef.createElement('button');
        turn.type = 'button';
        turn.className = `student-page-turn student-page-turn--${direction}`;
        turn.dataset.pageTurn = direction;
        turn.dataset.targetLocation = target.locationId;
        turn.textContent = `前往 · ${target.routePage.title}`;
        book.append(turn);
      }
    }

    function waitForStudentImage(image) {
      if (!image) return Promise.resolve();
      const decode = () => (
        typeof image.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve()
      );
      if (image.complete) return decode();
      return new Promise(resolve => {
        const settle = () => decode().finally(resolve);
        image.addEventListener('load', settle, { once: true });
        image.addEventListener('error', resolve, { once: true });
      });
    }

    function createStudentLoader() {
      const loader = documentRef.createElement('div');
      loader.className = 'student-loader';
      loader.dataset.studentLoader = '';
      loader.hidden = true;
      loader.setAttribute('aria-label', '小猫正在整理地图');
      const frames = atlas.GOLDEN_ROUTE_PAGE?.loaderFrames || [];
      for (const frameAsset of frames) {
        const frame = pictureElement(documentRef, frameAsset, {
          alt: '',
          sizes: '220px',
          className: 'student-loader__image'
        }).picture;
        frame.className = 'student-loader__frame';
        frame.setAttribute('aria-hidden', 'true');
        loader.append(frame);
      }
      const copy = documentRef.createElement('strong');
      copy.textContent = '小猫正在整理地图…';
      loader.append(copy);
      return loader;
    }

    function adjacentStudentAssets(routePage, models, geometry) {
      if (!routePage || typeof atlas.routePageNeighbors !== 'function') return [];
      const neighbors = atlas.routePageNeighbors(routePage.id, routePages);
      const nextPage = neighbors.next || neighbors.previous;
      if (!nextPage) return [];
      const assets = [nextPage.backgroundAsset];
      for (const model of models.filter(candidate => candidate.routePageId === nextPage.id)) {
        assets.push(model.stateAssets[model.stage]);
      }
      const targetWidth = Math.round(geometry.pageWidth);
      return assets.flatMap(asset => {
        if (!asset) return [];
        const variants = Array.isArray(asset.variants) ? asset.variants : [];
        const variant = variants.find(candidate => candidate.width >= targetWidth) || variants.at(-1);
        return variant?.avif ? [versionedUrl(variant.avif, asset.version)] : [];
      });
    }

    function warmAdjacentStudentPage(routePage, models, geometry) {
      const run = () => {
        for (const url of adjacentStudentAssets(routePage, models, geometry)) {
          const image = new windowRef.Image();
          image.decoding = 'async';
          image.src = url;
        }
      };
      if (typeof windowRef.requestIdleCallback === 'function') {
        windowRef.requestIdleCallback(run, { timeout: 1200 });
      } else {
        windowRef.setTimeout(run, 120);
      }
    }

    function prepareStudentPreview(preview, routePage, models, geometry, generation) {
      const loader = preview.querySelector('[data-student-loader]');
      const images = [...preview.querySelectorAll('.student-book img')];
      preview.dataset.ready = 'false';
      const feedbackTimer = windowRef.setTimeout(() => {
        if (generation === renderGeneration && preview.dataset.ready !== 'true') loader.hidden = false;
      }, 180);
      const safeTimer = windowRef.setTimeout(() => {
        if (generation !== renderGeneration || preview.dataset.ready === 'true') return;
        preview.dataset.fallback = 'true';
        preview.dataset.ready = 'true';
        loader.hidden = true;
      }, 4500);
      Promise.all(images.map(waitForStudentImage)).then(() => {
        if (generation !== renderGeneration) return;
        windowRef.clearTimeout(feedbackTimer);
        windowRef.clearTimeout(safeTimer);
        preview.dataset.ready = 'true';
        loader.hidden = true;
        warmAdjacentStudentPage(routePage, models, geometry);
      });
    }

    function turnStudentPage(direction, targetLocation) {
      if (!targetLocation || studentTurnTimer !== null) return;
      const preview = frame.querySelector('[data-student-preview]');
      if (!preview) return;
      preview.dataset.turning = direction;
      const reducedMotion = windowRef.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      const delay = reducedMotion ? 0 : 280;
      studentTurnTimer = windowRef.setTimeout(() => {
        studentTurnTimer = null;
        state = { ...state, location: targetLocation };
        render({ updateUrl: true });
      }, delay);
    }

    function bindStudentSwipe(book, routePage) {
      let gesture = null;
      book.addEventListener('pointerdown', event => {
        if (!event.isPrimary) return;
        if (event.target.closest('button,.student-page-name,.student-toolbar')) return;
        const bounds = book.getBoundingClientRect();
        const localX = event.clientX - bounds.left;
        if (localX < 24 || localX > bounds.width - 24) return;
        gesture = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      });
      book.addEventListener('pointerup', event => {
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        const deltaX = event.clientX - gesture.x;
        const deltaY = event.clientY - gesture.y;
        gesture = null;
        if (Math.abs(deltaX) < 54 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.35) return;
        const direction = deltaX < 0 ? 'next' : 'previous';
        const target = studentPageTarget(routePage, direction);
        if (target) turnStudentPage(direction, target.locationId);
        else {
          book.dataset.boundaryBounce = direction;
          windowRef.setTimeout(() => delete book.dataset.boundaryBounce, 240);
        }
      });
      book.addEventListener('pointercancel', () => { gesture = null; });
    }

    function fitStudentPreview() {
      const fit = frame.querySelector('[data-student-preview-fit]');
      const preview = frame.querySelector('[data-student-preview]');
      if (!fit || !preview) return;
      const simulatedWidth = Number(preview.dataset.simulatedWidth);
      const simulatedHeight = Number(preview.dataset.simulatedHeight);
      if (!simulatedWidth || !simulatedHeight) return;
      const immersive = rootElement.dataset.immersive === 'true';
      const widthScale = frame.clientWidth / simulatedWidth;
      const heightScale = immersive && frame.clientHeight > 0
        ? frame.clientHeight / simulatedHeight
        : Number.POSITIVE_INFINITY;
      const scale = Math.min(immersive ? 1.5 : 1, widthScale, heightScale);
      fit.style.width = `${simulatedWidth * scale}px`;
      fit.style.height = `${simulatedHeight * scale}px`;
      fit.dataset.scale = scale.toFixed(4);
      preview.style.transform = `scale(${scale})`;
    }

    function renderStudent(location) {
      const currentPage = currentRoutePage();
      if (!currentPage) {
        renderArt(location);
        return;
      }
      const geometry = studentPreviewGeometry(state.viewport);
      const models = buildStudentPreviewModels(locations, state, routePages);
      const visiblePages = geometry.layout === 'spread' && typeof atlas.buildRoutePageSpread === 'function'
        ? atlas.buildRoutePageSpread(currentPage.id, routePages)
        : [currentPage];

      const fit = documentRef.createElement('div');
      fit.className = 'student-preview-fit';
      fit.dataset.studentPreviewFit = '';
      const preview = documentRef.createElement('section');
      preview.className = 'student-preview';
      preview.dataset.studentPreview = '';
      preview.dataset.layout = geometry.layout;
      preview.dataset.viewport = state.viewport;
      preview.dataset.simulatedWidth = String(geometry.width);
      preview.dataset.simulatedHeight = String(geometry.height);
      const verticalGap = (geometry.height - geometry.toolbarHeight - geometry.pageHeight) / 2;
      const horizontalGap = (geometry.width - geometry.pageWidth) / 2;
      preview.dataset.navAxis = verticalGap >= 44
        ? 'bottom'
        : horizontalGap >= 58
          ? 'side'
          : 'corner';
      preview.style.width = `${geometry.width}px`;
      preview.style.height = `${geometry.height}px`;
      preview.style.setProperty('--student-page-width', `${geometry.pageWidth}px`);
      preview.style.setProperty('--student-page-height', `${geometry.pageHeight}px`);

      const toolbar = documentRef.createElement('header');
      toolbar.className = 'student-toolbar';
      const toolbarTitle = geometry.layout === 'spread' ? '四季生活城' : currentPage.title;
      toolbar.innerHTML = `
        <button type="button" data-student-chrome="back" aria-label="返回世界图鉴">←</button>
        <div><strong>${toolbarTitle}</strong></div>
        <button type="button" data-student-chrome="settings" aria-label="设备设置">⚙</button>
      `;

      const book = documentRef.createElement('div');
      book.className = 'student-book';
      book.dataset.studentBook = '';
      let selectedImage = null;
      visiblePages.forEach((routePage, index) => {
        if (index === 1 && geometry.layout === 'spread') {
          const spine = documentRef.createElement('span');
          spine.className = 'student-book__spine';
          spine.setAttribute('aria-hidden', 'true');
          book.append(spine);
        }
        const created = createStudentRoutePage(routePage, models, geometry, currentPage);
        if (created.selectedImage) selectedImage = created.selectedImage;
        book.append(created.page);
      });
      if (geometry.layout === 'single' && state.viewport !== 'master') {
        appendStudentPageTurns(book, currentPage);
      }

      const message = documentRef.createElement('p');
      message.className = 'student-message';
      message.dataset.studentMessage = '';
      message.setAttribute('role', 'status');
      message.setAttribute('aria-live', 'polite');
      message.hidden = true;
      const loader = createStudentLoader();
      preview.append(toolbar, book, loader, message);
      fit.append(preview);
      frame.replaceChildren(fit);
      windowRef.requestAnimationFrame(fitStudentPreview);
      if (geometry.layout === 'single') bindStudentSwipe(book, currentPage);
      prepareStudentPreview(preview, currentPage, models, geometry, renderGeneration);
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
        ...(canReviewPlacement(location.id, routePages)
          ? [
            { id: 'placement', label: '地图落位' },
            { id: 'student', label: '孩子端成品预览' }
          ]
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
      scenarioPanel.hidden = state.review !== 'student';
      for (const button of scenarioTabs.querySelectorAll('[data-scenario-button]')) {
        button.setAttribute('aria-pressed', String(button.dataset.scenarioButton === state.scenario));
      }
    }

    function render({ updateUrl = false } = {}) {
      if (studentTurnTimer !== null) {
        windowRef.clearTimeout(studentTurnTimer);
        studentTurnTimer = null;
      }
      renderGeneration += 1;
      const location = currentLocation();
      if (assetPool.getSnapshot().locationId !== location.id) {
        cancelWarmupSchedule();
        assetPool.cancel();
      }
      state = normalizeReviewState(serializeReviewState(state), locations, routePages);
      delete frame.dataset.pendingStage;
      delete frame.dataset.pendingReview;
      delete frame.dataset.pendingViewport;
      frame.dataset.viewport = state.viewport;
      frame.dataset.review = state.review;
      renderControls(location);
      if (state.review === 'placement') renderPlacement(location);
      else if (state.review === 'student') renderStudent(location);
      else renderArt(location);
      if (updateUrl) syncUrl();
    }

    function transitionWithinLocation(nextState, { updateUrl = false } = {}) {
      state = normalizeReviewState(serializeReviewState(nextState), locations, routePages);
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
        else if (state.review === 'student') renderStudent(location);
        else renderArt(location);
      });
    }

    function syncImmersiveControls() {
      const immersive = rootElement.dataset.immersive === 'true';
      for (const button of rootElement.querySelectorAll('[data-immersive-toggle]')) {
        button.setAttribute('aria-pressed', String(immersive));
      }
      if (immersiveStatus) {
        immersiveStatus.textContent = immersive
          ? '已进入全屏审图。左右方向键切换阶段，Esc 退出。'
          : '已退出全屏审图。';
      }
    }

    function clearImmersiveControlsTimer() {
      if (immersiveControlsTimer === null) return;
      windowRef.clearTimeout(immersiveControlsTimer);
      immersiveControlsTimer = null;
    }

    function revealImmersiveControls() {
      if (rootElement.dataset.immersive !== 'true') return;
      clearImmersiveControlsTimer();
      rootElement.dataset.controlsVisible = 'true';
      immersiveControlsTimer = windowRef.setTimeout(() => {
        immersiveControlsTimer = null;
        rootElement.dataset.controlsVisible = 'false';
      }, 2200);
    }

    function applyImmersiveState(enabled, { restoreFocus = true } = {}) {
      clearImmersiveControlsTimer();
      rootElement.dataset.immersive = String(enabled);
      if (documentRef.body) documentRef.body.dataset.reviewImmersive = String(enabled);
      if (enabled) {
        immersiveReturnFocus = documentRef.activeElement;
        revealImmersiveControls();
      } else {
        rootElement.dataset.controlsVisible = 'false';
        if (restoreFocus && immersiveReturnFocus?.isConnected &&
          typeof immersiveReturnFocus.focus === 'function') {
          try {
            immersiveReturnFocus.focus({ preventScroll: true });
          } catch (error) {
            immersiveReturnFocus.focus();
          }
        }
        immersiveReturnFocus = null;
      }
      syncImmersiveControls();
      windowRef.requestAnimationFrame(fitStudentPreview);
    }

    function enterImmersive() {
      if (rootElement.dataset.immersive === 'true') return;
      applyImmersiveState(true);
      const requestFullscreen = rootElement.requestFullscreen || rootElement.webkitRequestFullscreen;
      if (typeof requestFullscreen !== 'function') return;
      try {
        Promise.resolve(requestFullscreen.call(rootElement))
          .catch(() => {
            if (immersiveStatus && rootElement.dataset.immersive === 'true') {
              immersiveStatus.textContent = '浏览器未开放系统全屏，已使用铺满窗口审图。';
            }
          });
      } catch (error) {
        if (immersiveStatus) immersiveStatus.textContent = '已使用铺满窗口审图。';
      }
    }

    function exitImmersive({ restoreFocus = true } = {}) {
      if (rootElement.dataset.immersive !== 'true') return;
      applyImmersiveState(false, { restoreFocus });
      const nativeElement = documentRef.fullscreenElement || documentRef.webkitFullscreenElement;
      if (nativeElement !== rootElement) return;
      const exitFullscreen = documentRef.exitFullscreen || documentRef.webkitExitFullscreen;
      if (typeof exitFullscreen === 'function') {
        try {
          Promise.resolve(exitFullscreen.call(documentRef)).catch(() => {});
        } catch (error) {
          // CSS immersive mode is already closed; native exit is best effort.
        }
      }
    }

    function toggleImmersive() {
      if (rootElement.dataset.immersive === 'true') exitImmersive();
      else enterImmersive();
    }

    function handleFullscreenChange() {
      const nativeElement = documentRef.fullscreenElement || documentRef.webkitFullscreenElement;
      if (nativeElement === rootElement) {
        immersiveNativeActive = true;
        immersiveNativeEnteredAt = windowRef.performance?.now?.() || Date.now();
        return;
      }
      const wasNativeActive = immersiveNativeActive;
      immersiveNativeActive = false;
      if (wasNativeActive && rootElement.dataset.immersive === 'true') {
        const now = windowRef.performance?.now?.() || Date.now();
        if (now - immersiveNativeEnteredAt < 1000) {
          if (immersiveStatus) {
            immersiveStatus.textContent = '系统全屏被浏览器中止，已继续使用铺满窗口审图。';
          }
          revealImmersiveControls();
          windowRef.requestAnimationFrame(fitStudentPreview);
        } else {
          applyImmersiveState(false);
        }
      }
    }

    function isEditableTarget(target) {
      return Boolean(target?.closest?.('input,select,textarea,[contenteditable="true"]'));
    }

    function handleImmersiveKeydown(event) {
      if (isEditableTarget(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      if (!event.repeat && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleImmersive();
        return;
      }
      if (rootElement.dataset.immersive !== 'true') return;
      revealImmersiveControls();
      if (event.key === 'Escape') {
        event.preventDefault();
        exitImmersive();
        return;
      }
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const location = currentLocation();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      const nextStage = Math.min(
        location.stateAssets.length - 1,
        Math.max(0, state.stage + direction)
      );
      if (nextStage === state.stage) return;
      event.preventDefault();
      transitionWithinLocation({ ...state, stage: nextStage }, { updateUrl: true });
    }

    picker.addEventListener('change', () => {
      state = { ...state, location: picker.value };
      render({ updateUrl: true });
    });
    rootElement.addEventListener('click', event => {
      const immersiveToggle = event.target.closest('[data-immersive-toggle]');
      if (immersiveToggle) {
        toggleImmersive();
        return;
      }
      const pageTurn = event.target.closest('[data-page-turn]');
      if (pageTurn) {
        turnStudentPage(pageTurn.dataset.pageTurn, pageTurn.dataset.targetLocation);
        return;
      }
      const studentLocation = event.target.closest('[data-student-location]');
      if (studentLocation) {
        const selected = locations.find(location => location.id === studentLocation.dataset.locationId);
        const message = frame.querySelector('[data-student-message]');
        if (message && selected) {
          message.textContent = `将进入 Lesson ${selected.lesson} · ${selected.title}（内部预览不跳转）`;
          message.hidden = false;
        }
        return;
      }
      const studentChrome = event.target.closest('[data-student-chrome]');
      if (studentChrome) {
        const message = frame.querySelector('[data-student-message]');
        if (message) {
          message.textContent = '内部成品预览：不执行真实跳转';
          message.hidden = false;
        }
        return;
      }
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
      const scenarioButton = event.target.closest('[data-scenario-button]');
      if (scenarioButton) {
        transitionWithinLocation({
          ...state,
          scenario: scenarioButton.dataset.scenarioButton
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
    windowRef.addEventListener('resize', fitStudentPreview);
    windowRef.addEventListener('keydown', handleImmersiveKeydown);
    documentRef.addEventListener('fullscreenchange', handleFullscreenChange);
    documentRef.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    rootElement.addEventListener('pointermove', revealImmersiveControls, { passive: true });
    rootElement.addEventListener('pointerdown', revealImmersiveControls, { passive: true });
    rootElement.addEventListener('focusin', revealImmersiveControls);
    function handlePopState() {
      state = normalizeReviewState(windowRef.location.search, locations, routePages);
      render();
    }
    windowRef.addEventListener('popstate', handlePopState);
    applyImmersiveState(false, { restoreFocus: false });
    render({ updateUrl: true });

    return Object.freeze({
      getState: () => ({ ...state }),
      destroy() {
        cancelWarmupSchedule();
        clearImmersiveControlsTimer();
        if (studentTurnTimer !== null) windowRef.clearTimeout(studentTurnTimer);
        if (rootElement.dataset.immersive === 'true') exitImmersive({ restoreFocus: false });
        assetPool.destroy();
        windowRef.removeEventListener('pointerup', restoreCurrentArt);
        windowRef.removeEventListener('pointercancel', restoreCurrentArt);
        windowRef.removeEventListener('blur', restoreCurrentArt);
        windowRef.removeEventListener('resize', fitStudentPreview);
        windowRef.removeEventListener('keydown', handleImmersiveKeydown);
        documentRef.removeEventListener('fullscreenchange', handleFullscreenChange);
        documentRef.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        rootElement.removeEventListener('pointermove', revealImmersiveControls);
        rootElement.removeEventListener('pointerdown', revealImmersiveControls);
        rootElement.removeEventListener('focusin', revealImmersiveControls);
        windowRef.removeEventListener('popstate', handlePopState);
      }
    });
  }

  return Object.freeze({
    VIEWPORTS,
    SCENARIOS,
    getReviewLocations,
    resolveReviewRoutePage,
    normalizeReviewState,
    serializeReviewState,
    previewLayoutForSize,
    stageLabels,
    buildPlacementModels,
    buildStudentPreviewModels,
    mount
  });
});
