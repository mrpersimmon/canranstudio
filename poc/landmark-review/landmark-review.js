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
    let idleHandle = null;
    let idleHandleType = null;
    let preloadImages = [];
    let preloadGeneration = 0;
    const picker = rootElement.querySelector('[data-location-picker]');
    const stageStrip = rootElement.querySelector('[data-stage-strip]');
    const reviewTabs = rootElement.querySelector('[data-review-tabs]');
    const viewportTabs = rootElement.querySelector('[data-viewport-tabs]');
    const frame = rootElement.querySelector('[data-review-frame]');

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

    function cancelPreload() {
      preloadGeneration += 1;
      if (idleHandle !== null) {
        if (idleHandleType === 'idle' && typeof windowRef.cancelIdleCallback === 'function') {
          windowRef.cancelIdleCallback(idleHandle);
        } else if (idleHandleType === 'timeout') {
          windowRef.clearTimeout(idleHandle);
        }
      }
      idleHandle = null;
      idleHandleType = null;
      for (const image of preloadImages) image.src = '';
      preloadImages = [];
    }

    function preloadAdjacent(location, stage, image) {
      cancelPreload();
      const generation = preloadGeneration;
      const run = () => {
        if (generation !== preloadGeneration) return;
        for (const adjacent of [stage - 1, stage + 1]) {
          const asset = location.stateAssets[adjacent];
          if (!asset) continue;
          const preloader = new windowRef.Image();
          const targetWidth = VIEWPORT_WIDTHS[state.viewport];
          const preferred = [...asset.variants].reverse()
            .find(variant => variant.width <= targetWidth) || asset.variants[0];
          preloader.src = versionedUrl(preferred.webp, asset.version);
          preloadImages.push(preloader);
        }
      };
      const schedule = () => {
        if (typeof windowRef.requestIdleCallback === 'function') {
          idleHandle = windowRef.requestIdleCallback(run, { timeout: 1200 });
          idleHandleType = 'idle';
        } else {
          idleHandle = windowRef.setTimeout(run, 80);
          idleHandleType = 'timeout';
        }
      };
      if (image.complete) schedule();
      else image.addEventListener('load', schedule, { once: true });
    }

    function renderArtAsset(location, stage, previewing = false) {
      const artboard = frame.querySelector('[data-artboard]');
      if (!artboard) return;
      const asset = location.stateAssets[stage];
      const targetWidth = VIEWPORT_WIDTHS[state.viewport];
      const { picture, image } = pictureElement(documentRef, asset, {
        alt: `${location.title} · ${stageLabels(location)[stage]}`,
        sizes: `${targetWidth}px`,
        marker: 'data-current-art'
      });
      artboard.replaceChildren(picture);
      artboard.dataset.previewingPrevious = String(previewing);
      artboard.dataset.displayedStage = String(stage);
      if (!previewing) preloadAdjacent(location, stage, image);
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
      cancelPreload();
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
        art.append(pictureElement(documentRef, model.stateAssets[model.stage], {
          alt: '',
          sizes: `${artWidth}px`
        }).picture);

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
      const location = currentLocation();
      state = normalizeReviewState(serializeReviewState(state), locations, routePage);
      frame.dataset.viewport = state.viewport;
      frame.dataset.review = state.review;
      renderControls(location);
      if (state.review === 'placement') renderPlacement(location);
      else renderArt(location);
      if (updateUrl) syncUrl();
    }

    picker.addEventListener('change', () => {
      state = { ...state, location: picker.value };
      render({ updateUrl: true });
    });
    rootElement.addEventListener('click', event => {
      const stageButton = event.target.closest('[data-stage-button]');
      if (stageButton) {
        state = { ...state, stage: Number(stageButton.dataset.stageButton) };
        render({ updateUrl: true });
        return;
      }
      const reviewButton = event.target.closest('[data-review-button]');
      if (reviewButton) {
        state = { ...state, review: reviewButton.dataset.reviewButton };
        render({ updateUrl: true });
        return;
      }
      const viewportButton = event.target.closest('[data-viewport-button]');
      if (viewportButton) {
        state = { ...state, viewport: viewportButton.dataset.viewportButton };
        render({ updateUrl: true });
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
        cancelPreload();
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
