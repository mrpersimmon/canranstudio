(function bootCoursePackageEntry(global) {
  'use strict';

  const root = global.document?.querySelector?.('[data-course-package-entry]');
  if (!root) return;
  const shell = root.querySelector('[data-course-package-shell]');
  const progress = shell?.querySelector('[data-package-progress]');
  const progressFill = shell?.querySelector('[data-package-progress-fill]');
  const percent = shell?.querySelector('[data-package-percent]');
  const byteCount = shell?.querySelector('[data-package-bytes]');
  const phase = shell?.querySelector('[data-package-phase]');
  const status = shell?.querySelector('[data-package-status]');
  const recovery = shell?.querySelector('[data-package-recovery]');
  const retryButton = shell?.querySelector('[data-package-retry]');
  const continueButton = shell?.querySelector('[data-package-continue]');
  const slowNote = shell?.querySelector('[data-package-slow]');
  const childActionCopy = root.dataset.packageCopyMode === 'child-action';
  const configuredCopy = {
    checking: root.dataset.packageCopyChecking,
    downloading: root.dataset.packageCopyDownloading,
    verifying: root.dataset.packageCopyVerifying,
    ready: root.dataset.packageCopyReady,
    entering: root.dataset.packageCopyEntering,
    slow: root.dataset.packageCopySlow,
    failed: root.dataset.packageCopyFailed
  };
  const state = {
    phase: 'checking',
    preparedBytes: 0,
    totalBytes: 0,
    lastProgressAt: global.performance?.now?.() || Date.now(),
    startedAt: global.performance?.now?.() || Date.now(),
    result: null,
    abortController: null,
    slowTimer: null,
    entering: false,
    preparedAudio: null,
    progressHistory: [],
    packageReadyMs: null,
    courseEntryMs: null,
    enteredAt: null,
    takePreparedAudio
  };
  global.__coursePackage = state;

  function parseList(value) {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) && parsed.every(item => typeof item === 'string')
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  function megabytes(bytes) {
    return `${(Math.max(0, bytes) / (1024 * 1024)).toFixed(1)} MB`;
  }

  function phaseCopy(value) {
    const fallback = {
      checking: '检查已准备内容',
      downloading: '下载课程内容',
      verifying: '安全保存并核对',
      ready: '课程已准备完成',
      failed: '这次还没有准备好',
      entering: '正在打开课程'
    }[value] || '准备课程内容';
    return configuredCopy[value] || fallback;
  }

  function renderProgress(update) {
    state.progressHistory.push(Object.freeze({
      phase: update.phase,
      preparedBytes: update.preparedBytes || 0,
      totalBytes: update.totalBytes || 0,
      percent: update.percent || 0
    }));
    if (state.progressHistory.length > 256) state.progressHistory.shift();
    const previousBytes = state.preparedBytes;
    state.phase = update.phase;
    state.preparedBytes = update.preparedBytes || 0;
    state.totalBytes = update.totalBytes || 0;
    if (state.preparedBytes > previousBytes) {
      state.lastProgressAt = global.performance?.now?.() || Date.now();
      if (slowNote) slowNote.hidden = true;
      if (recovery && update.phase !== 'failed') recovery.hidden = true;
    }
    const checking = update.phase === 'checking';
    const value = update.phase === 'ready' ? 100 : Math.max(0, Math.min(99, update.percent || 0));
    if (shell) shell.dataset.packageState = update.phase;
    if (progress) {
      if (checking) progress.removeAttribute('aria-valuenow');
      else progress.setAttribute('aria-valuenow', String(value));
      progress.setAttribute(
        'aria-valuetext',
        checking ? phaseCopy(update.phase) : `${phaseCopy(update.phase)} ${value}%`
      );
    }
    if (progressFill) progressFill.style.width = checking ? '18%' : `${value}%`;
    if (percent) percent.textContent = checking ? '检查中' : `${value}%`;
    if (byteCount) {
      byteCount.textContent = state.totalBytes > 0
        ? `已准备 ${megabytes(state.preparedBytes)} / ${megabytes(state.totalBytes)}`
        : '正在读取课程清单';
    }
    if (phase) phase.textContent = phaseCopy(update.phase);
    if (status && update.phase !== 'failed') {
      status.textContent = childActionCopy
        ? phaseCopy(update.phase)
        : (update.phase === 'ready'
            ? (update.warm ? '已找到上次准备好的内容，正在进入课程。' : '所有人物、图片和声音都已准备好，正在进入课程。')
            : '请稍等，准备完成后将自动进入课程。');
    }
  }

  function showFailure(error) {
    state.phase = 'failed';
    if (shell) shell.dataset.packageState = 'failed';
    if (phase) phase.textContent = phaseCopy('failed');
    if (status) {
      status.textContent = childActionCopy
        ? (configuredCopy.failed || phaseCopy('failed'))
        : '连接可能中断了。已经准备好的内容会保留，可以从这里继续。';
    }
    if (recovery) recovery.hidden = false;
    if (retryButton) retryButton.hidden = false;
    if (continueButton) continueButton.hidden = true;
    global.console?.error?.('[course-package]', error);
  }

  function armSlowNetworkFeedback() {
    global.clearInterval(state.slowTimer);
    state.slowTimer = global.setInterval(() => {
      if (['ready', 'failed', 'entering'].includes(state.phase)) return;
      const now = global.performance?.now?.() || Date.now();
      const idleFor = now - state.lastProgressAt;
      if (idleFor >= 3000) {
        if (childActionCopy && status) {
          status.textContent = configuredCopy.slow || '网络有点慢，探险猫猫还在准备课程。';
        } else if (slowNote) {
          slowNote.hidden = false;
          slowNote.textContent = '网络有点慢，探险猫猫还在整理课程。';
        }
      }
      if (idleFor >= 10000 && recovery) {
        recovery.hidden = false;
        if (retryButton) retryButton.hidden = false;
        if (continueButton) continueButton.hidden = false;
      }
    }, 500);
  }

  function waitForController(timeoutMs = 2500) {
    if (global.navigator.serviceWorker.controller) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const timer = global.setTimeout(() => {
        cleanup();
        reject(new Error('course-package service worker did not take control'));
      }, timeoutMs);
      const onChange = () => {
        if (!global.navigator.serviceWorker.controller) return;
        cleanup();
        resolve();
      };
      const cleanup = () => {
        global.clearTimeout(timer);
        global.navigator.serviceWorker.removeEventListener('controllerchange', onChange);
      };
      global.navigator.serviceWorker.addEventListener('controllerchange', onChange);
    });
  }

  async function prepareServiceWorker() {
    if (!global.isSecureContext || !global.navigator?.serviceWorker) {
      throw new Error('course-package service worker is unavailable');
    }
    const scopeUrl = new URL('./', global.location.href);
    await global.navigator.serviceWorker.register(root.dataset.serviceWorkerUrl, {
      scope: scopeUrl.pathname,
      updateViaCache: 'none'
    });
    await global.navigator.serviceWorker.ready;
    await waitForController();
    return scopeUrl;
  }

  function takePreparedAudio(value) {
    if (!state.preparedAudio || !value) return null;
    const requestedUrl = new URL(value, global.location.href).href;
    if (state.preparedAudio.url !== requestedUrl) return null;
    const prepared = state.preparedAudio.audio;
    state.preparedAudio = null;
    return prepared;
  }

  async function prepareFirstAudio() {
    const value = root.dataset.courseFirstAudio;
    if (!value || typeof global.Audio !== 'function') return;
    const url = new URL(value, global.location.href).href;
    const audio = new global.Audio(url);
    audio.preload = 'auto';
    state.preparedAudio = { url, audio };
    await new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        global.clearTimeout(timer);
        audio.removeEventListener('canplay', finish);
        audio.removeEventListener('error', finish);
        resolve();
      };
      const timer = global.setTimeout(finish, 180);
      audio.addEventListener('canplay', finish, { once: true });
      audio.addEventListener('error', finish, { once: true });
      try { audio.load?.(); } catch { finish(); }
    });
  }

  async function runPreparation() {
    state.abortController?.abort?.();
    try { state.preparedAudio?.audio?.pause?.(); } catch { /* no-op */ }
    state.preparedAudio = null;
    state.abortController = new AbortController();
    state.startedAt = global.performance?.now?.() || Date.now();
    state.lastProgressAt = state.startedAt;
    if (recovery) recovery.hidden = true;
    renderProgress({ phase: 'checking', preparedBytes: 0, totalBytes: 0, percent: 0 });
    armSlowNetworkFeedback();
    try {
      const scopeUrl = await prepareServiceWorker();
      const api = global.CanranCore?.coursePackageInstaller;
      if (!api?.createInstaller) throw new Error('course-package installer is unavailable');
      const installer = api.createInstaller({
        cacheStorage: global.caches,
        fetch: global.fetch.bind(global),
        crypto: global.crypto,
        scopeUrl: scopeUrl.href,
        origin: global.location.origin,
        maxConcurrency: 4
      });
      state.result = await installer.prepare({
        manifestUrl: new URL(root.dataset.manifestUrl, global.location.href).href,
        expectedManifestSha256: root.dataset.manifestSha256,
        signal: state.abortController.signal,
        onProgress: renderProgress
      });
      await prepareFirstAudio();
      global.clearInterval(state.slowTimer);
      state.packageReadyMs = Math.round(
        (global.performance?.now?.() || Date.now()) - state.startedAt
      );
      shell.dataset.packageWarm = String(state.result.warm);
      shell.dataset.packageReadyMs = String(state.packageReadyMs);
      await enterCourse();
    } catch (error) {
      global.clearInterval(state.slowTimer);
      if (error?.name === 'AbortError') return;
      showFailure(error);
    }
  }

  function loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = global.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = () => reject(new Error(`course style failed to load: ${url}`));
      global.document.head.append(link);
    });
  }

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = global.document.createElement('script');
      script.src = url;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`course script failed to load: ${url}`));
      global.document.body.append(script);
    });
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const nested of Object.values(value)) deepFreeze(nested);
    return Object.freeze(value);
  }

  async function loadUnitCatalog() {
    const url = new URL(root.dataset.unitCatalogUrl, global.location.href).href;
    const response = await global.fetch(url, {
      cache: 'no-store',
      credentials: 'same-origin'
    });
    if (!response.ok) throw new Error(`course unit catalog failed to load: ${response.status}`);
    const unit = await response.json();
    const expectedRevision = state.result?.manifest?.revision;
    if (
      unit?.unitId !== root.dataset.unitId
      || (expectedRevision && unit?.experienceRevision !== expectedRevision)
    ) {
      throw new Error('course unit catalog does not match the prepared package');
    }
    deepFreeze(unit);
    const units = Object.freeze([unit]);
    const catalog = Object.freeze({
      TEACHING_UNITS: units,
      getTeachingUnit: unitId => unitId === unit.unitId ? unit : null,
      getTeachingUnitForLesson: lessonId => unit.lessonIds?.includes(lessonId) ? unit : null,
      listTeachingUnitsForDistrict: districtId => unit.districtId === districtId ? units : [],
      validate: () => []
    });
    global.CanranCore = global.CanranCore || {};
    global.CanranCore.curriculumCatalog = catalog;
    return catalog;
  }

  function collectEntityIds(value, knownIds, found, seen = new Set()) {
    if (typeof value === 'string') {
      if (knownIds.has(value)) found.add(value);
      return;
    }
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    for (const nested of Object.values(value)) collectEntityIds(nested, knownIds, found, seen);
  }

  function initialImageGroups(unit) {
    const knownIds = new Set(Object.keys(unit.entities || {}));
    const found = new Set(unit.experience?.scene?.actorEntityIds || []);
    const sequence = unit.experience?.stages
      || unit.beats?.flatMap(beat => beat.microtasks || [])
      || [];
    for (const item of sequence.slice(0, 2)) collectEntityIds(item, knownIds, found);
    const groups = [...found].map(entityId => {
      const entity = unit.entities?.[entityId] || {};
      return [
        entity.assets?.preferred,
        entity.assets?.avif,
        entity.assets?.webp,
        entity.assets?.png,
        entity.assetSrc,
        entity.assetFallbackSrc
      ].filter(Boolean);
    }).filter(group => group.length > 0);
    const scene = unit.experience?.scene || {};
    groups.push(...[
      [scene.backgroundWide, scene.backgroundWideFallback],
      [scene.backgroundPortrait, scene.backgroundPortraitFallback]
    ].filter(group => group.some(Boolean)));
    const masters = unit.experience?.sceneFrames?.masters || {};
    groups.push(...Object.values(masters).map(master => (
      [master.assetSrc, master.assetFallbackSrc].filter(Boolean)
    )).filter(group => group.length > 0));
    return groups;
  }

  function decodeImage(url) {
    return new Promise((resolve, reject) => {
      const image = new global.Image();
      image.onload = async () => {
        try {
          await image.decode?.();
          resolve(url);
        } catch (error) {
          reject(error);
        }
      };
      image.onerror = reject;
      image.src = url;
    });
  }

  async function prepareInitialImages(unit) {
    if (typeof global.Image !== 'function') return;
    const startedAt = global.performance?.now?.() || Date.now();
    const decoded = [];
    await Promise.all(initialImageGroups(unit).map(async candidates => {
      for (const url of [...new Set(candidates)]) {
        try {
          decoded.push(await decodeImage(url));
          return;
        } catch {
          // The next catalog-owned format is still part of older package catalogs.
        }
      }
      throw new Error('course package could not decode an initial-stage image');
    }));
    state.initialImageDecodeUrls = decoded;
    state.initialImageDecodeMs = Math.round(
      (global.performance?.now?.() || Date.now()) - startedAt
    );
  }

  async function waitFor(selector, timeoutMs = 5000) {
    const deadline = (global.performance?.now?.() || Date.now()) + timeoutMs;
    for (;;) {
      const found = root.querySelector(selector);
      if (found) return found;
      if ((global.performance?.now?.() || Date.now()) >= deadline) {
        throw new Error(`course surface did not appear: ${selector}`);
      }
      await new Promise(resolve => global.setTimeout(resolve, 16));
    }
  }

  async function enterCourse() {
    if (state.entering) return;
    const entryStartedAt = global.performance?.now?.() || Date.now();
    state.entering = true;
    state.phase = 'entering';
    global.clearInterval(state.slowTimer);
    if (shell) shell.dataset.packageState = 'entering';
    if (phase) phase.textContent = phaseCopy('entering');
    if (childActionCopy && status) status.textContent = phaseCopy('entering');
    try {
      const catalog = await loadUnitCatalog();
      await Promise.all([
        prepareInitialImages(catalog.TEACHING_UNITS[0]),
        ...parseList(root.dataset.courseStyles).map(loadStyle)
      ]);
      for (const script of parseList(root.dataset.courseScripts)) await loadScript(script);
      root.dataset.coursePackageEntered = 'true';
      if (root.dataset.unitId === 'NCE-U01') {
        await waitFor('.station-app');
      } else {
        await waitFor('.story-stage-experience');
      }
      state.enteredAt = global.performance?.now?.() || Date.now();
      state.courseEntryMs = Math.round(state.enteredAt - entryStartedAt);
    } catch (error) {
      state.entering = false;
      showFailure(error);
    }
  }

  retryButton?.addEventListener('click', () => void runPreparation());
  continueButton?.addEventListener('click', () => {
    if (recovery) recovery.hidden = true;
    state.lastProgressAt = global.performance?.now?.() || Date.now();
    if (childActionCopy && status) status.textContent = phaseCopy(state.phase);
  });
  global.addEventListener('pagehide', () => state.abortController?.abort?.());
  global.addEventListener('pageshow', event => {
    if (event.persisted && !['ready', 'entering'].includes(state.phase)) void runPreparation();
  });

  const testBypass = ['127.0.0.1', 'localhost'].includes(global.location.hostname)
    && new URLSearchParams(global.location.search).get('package-test-bypass') === '1';
  if (testBypass) {
    state.phase = 'ready';
    state.result = { status: 'ready', warm: true, bypass: true };
    void enterCourse();
  } else {
    void runPreparation();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
