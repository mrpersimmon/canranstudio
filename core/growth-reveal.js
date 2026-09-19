(function attachGrowthReveal(root, factory) {
  'use strict';
  const catalogApi = typeof module === 'object' && module.exports
    ? require('./course-catalog')
    : root?.CanranCore?.courseCatalog;
  const profileApi = typeof module === 'object' && module.exports
    ? require('./device-profile')
    : root?.CanranCore?.deviceProfile;
  const api = factory(catalogApi, profileApi);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.growthReveal = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function growthRevealFactory(catalogApi, profileApi) {
  'use strict';

  function publicAsset(path) {
    return typeof path === 'string' && path.startsWith('/') ? path : `/${path || ''}`;
  }

  function stateAssetUrl(path, stateAsset) {
    return catalogApi?.mapStateAssetUrl
      ? catalogApi.mapStateAssetUrl(path, stateAsset)
      : publicAsset(path);
  }

  function nearestVariant(stateAsset, targetWidth) {
    const variants = Array.isArray(stateAsset?.variants)
      ? [...stateAsset.variants].sort((left, right) => left.width - right.width)
      : [];
    return variants.find(variant => variant.width >= targetWidth) || variants.at(-1) || null;
  }

  async function preloadStateAsset(stateAsset, {
    ImageCtor = typeof Image !== 'undefined' ? Image : null,
    targetWidth = 1024
  } = {}) {
    if (!stateAsset?.png || typeof ImageCtor !== 'function') return false;
    const variant = nearestVariant(stateAsset, Math.max(1, Number(targetWidth) || 1024));
    const candidates = [variant?.avif, variant?.webp, stateAsset.png].filter(Boolean);
    for (const path of candidates) {
      try {
        const image = new ImageCtor();
        image.decoding = 'async';
        image.fetchPriority = 'low';
        image.src = stateAssetUrl(path, stateAsset);
        if (typeof image.decode === 'function') {
          await image.decode();
        } else {
          await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
          });
        }
        return true;
      } catch {
        // Try the next supported format. PNG remains the final compatibility path.
      }
    }
    return false;
  }

  function findCourse(courses, courseId) {
    return Array.isArray(courses) ? courses.find(course => course.id === courseId) || null : null;
  }

  function buildRevealModel({ courses, courseId, stageId, completedStageCount = null }) {
    const course = findCourse(courses, courseId);
    const stages = Array.isArray(course?.map?.stages) ? course.map.stages : [];
    const index = stages.findIndex(stage => stage.progressId === stageId);
    if (!course || index < 0) return null;
    const earnedCount = Number.isInteger(completedStageCount)
      ? Math.max(1, Math.min(completedStageCount, stages.length))
      : index + 1;
    const stage = stages[earnedCount - 1];
    const beforeStateAsset = course.map?.stateAssets?.[earnedCount - 1] || null;
    const afterStateAsset = course.map?.stateAssets?.[earnedCount] || null;
    if (!beforeStateAsset || !afterStateAsset) return null;
    const isFinalStage = earnedCount === stages.length;
    return Object.freeze({
      courseId,
      stageId,
      stageNumber: earnedCount,
      stageCount: stages.length,
      courseTitle: course.title,
      beforeStateAsset,
      afterStateAsset,
      title: stage.revealTitle,
      copy: stage.revealCopy,
      soundAsset: stage.soundAsset || null,
      isFinalStage,
      souvenir: isFinalStage ? course.map.souvenir : null
    });
  }

  function recordStageResult(options) {
    if (!profileApi) return { persisted: false, firstCompletion: false, shouldReveal: false, reveal: null };
    const result = profileApi.recordStageCompletion(options);
    return {
      ...result,
      reveal: result.shouldReveal
        ? buildRevealModel({
          ...options,
          completedStageCount: result.profile?.completedStages?.[options.courseId]?.length
        })
        : null
    };
  }

  function createInertController() {
    return Object.freeze({
      open: () => false,
      openWhenReady: async () => false,
      prepare: async () => false,
      preloadNext: async () => false,
      close: () => false,
      destroy: () => false,
      isOpen: () => false
    });
  }

  function create({
    document: doc = typeof document !== 'undefined' ? document : null,
    window: win = typeof window !== 'undefined' ? window : null,
    storage = null,
    courses = catalogApi?.COURSES || [],
    courseId = null,
    gateMs = 700,
    soundEnabled = true,
    onStopAudio = null
  } = {}) {
    if (!doc?.createElement || !doc.body) return createInertController();

    const overlay = doc.createElement('div');
    overlay.className = 'growth-reveal';
    overlay.hidden = true;
    overlay.tabIndex = -1;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'growthRevealTitle');
    overlay.setAttribute('aria-describedby', 'growthRevealCopy growthRevealHint');
    overlay.innerHTML = `
      <div class="growth-reveal__veil" aria-hidden="true"></div>
      <div class="growth-reveal__card">
        <p class="growth-reveal__eyebrow">✦ 图鉴更新 ✦</p>
        <div class="growth-reveal__scene" aria-hidden="true">
          <div class="growth-reveal__halo"></div>
          <div class="growth-reveal__snapshots"></div>
          <span class="growth-reveal__stamp">地点完成</span>
        </div>
        <div class="growth-reveal__copy">
          <p class="growth-reveal__stage"></p>
          <h2 id="growthRevealTitle"></h2>
          <p id="growthRevealCopy"></p>
          <div class="growth-reveal__souvenir" hidden></div>
        </div>
        <p class="growth-reveal__hint" id="growthRevealHint">轻触任意位置继续</p>
      </div>`;
    doc.body.appendChild(overlay);

    const snapshots = overlay.querySelector('.growth-reveal__snapshots');
    const title = overlay.querySelector('#growthRevealTitle');
    const copy = overlay.querySelector('#growthRevealCopy');
    const stage = overlay.querySelector('.growth-reveal__stage');
    const souvenir = overlay.querySelector('.growth-reveal__souvenir');
    let opened = false;
    let openedAt = 0;
    let currentModel = null;
    let restoreFocus = null;
    let restoreOverflow = '';
    const preparedAssets = new Map();

    function targetDecodeWidth() {
      const viewportWidth = Number(win?.innerWidth) || 1024;
      const devicePixelRatio = Math.max(1, Number(win?.devicePixelRatio) || 1);
      return Math.min(1024, Math.ceil(Math.min(520, viewportWidth * 0.82) * devicePixelRatio));
    }

    function prepare(asset) {
      if (!asset?.png) return Promise.resolve(false);
      const key = `${asset.version || ''}:${asset.png}`;
      if (!preparedAssets.has(key)) {
        preparedAssets.set(key, preloadStateAsset(asset, {
          ImageCtor: win?.Image,
          targetWidth: targetDecodeWidth()
        }));
      }
      return preparedAssets.get(key);
    }

    function preloadNext(selectedCourseId = courseId) {
      const course = findCourse(courses, selectedCourseId);
      if (!course || !profileApi || !storage) return Promise.resolve(false);
      const initialized = profileApi.initializeDeviceProfile({ storage, courses });
      const completed = initialized.profile?.completedStages?.[selectedCourseId]?.length || 0;
      const next = course.map?.stateAssets?.[Math.min(completed + 1, course.map.stages.length)] || null;
      if (!next || completed >= course.map.stages.length) return Promise.resolve(false);
      return prepare(next);
    }

    function makeImage(asset, className, stateAsset = null) {
      const img = doc.createElement('img');
      img.src = stateAsset ? stateAssetUrl(asset, stateAsset) : publicAsset(asset);
      img.alt = '';
      img.decoding = 'async';
      img.className = className;
      img.addEventListener('error', () => { img.hidden = true; }, { once: true });
      return img;
    }

    function makeSnapshot(asset, className) {
      const picture = doc.createElement('picture');
      picture.className = className;
      for (const type of ['avif', 'webp']) {
        const source = doc.createElement('source');
        source.type = `image/${type}`;
        source.sizes = '(max-width: 520px) 82vw, 520px';
        source.srcset = asset.variants
          .map(variant => `${stateAssetUrl(variant[type], asset)} ${variant.width}w`)
          .join(', ');
        picture.appendChild(source);
      }
      const image = makeImage(asset.png, 'growth-reveal__snapshot-image', asset);
      image.width = 1024;
      image.height = 1024;
      image.loading = 'eager';
      image.fetchPriority = 'high';
      picture.appendChild(image);
      return picture;
    }

    function playFeedback(model) {
      if (!soundEnabled) return;
      try {
        if (model.soundAsset && win?.Audio) {
          const audio = new win.Audio(publicAsset(model.soundAsset));
          audio.volume = 0.3;
          const promise = audio.play();
          promise?.catch?.(() => {});
          return;
        }
        const AudioContext = win?.AudioContext || win?.webkitAudioContext;
        if (!AudioContext) return;
        const context = new AudioContext();
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.34);
        gain.connect(context.destination);
        [523.25, 783.99].forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          oscillator.type = index === 0 ? 'sine' : 'triangle';
          oscillator.frequency.value = frequency;
          oscillator.connect(gain);
          oscillator.start(context.currentTime + index * 0.08);
          oscillator.stop(context.currentTime + 0.36);
        });
        win.setTimeout?.(() => context.close?.(), 500);
      } catch {
        // Sound is enhancement only; visual feedback and dismissal remain available.
      }
    }

    function render(model) {
      snapshots.replaceChildren(
        makeSnapshot(model.beforeStateAsset, 'growth-reveal__snapshot growth-reveal__snapshot--before'),
        makeSnapshot(model.afterStateAsset, 'growth-reveal__snapshot growth-reveal__snapshot--after')
      );
      stage.textContent = `第 ${model.stageNumber} / ${model.stageCount} 处成长`;
      title.textContent = model.title || '图鉴已经更新';
      copy.textContent = model.copy || '你为这处地点带来了新的变化！';
      overlay.classList.toggle('growth-reveal--final', model.isFinalStage);
      if (model.isFinalStage && model.souvenir) {
        souvenir.hidden = false;
        souvenir.replaceChildren(
          makeImage(model.souvenir.asset, 'growth-reveal__souvenir-image'),
          Object.assign(doc.createElement('span'), { textContent: `永久纪念 · ${model.souvenir.title}` })
        );
      } else {
        souvenir.hidden = true;
        souvenir.replaceChildren();
      }
    }

    function open(model) {
      if (!model || opened) return false;
      currentModel = model;
      restoreFocus = doc.activeElement;
      restoreOverflow = doc.body.style.overflow;
      render(model);
      try { onStopAudio?.(); } catch {}
      overlay.hidden = false;
      doc.body.style.overflow = 'hidden';
      opened = true;
      openedAt = Date.now();
      overlay.classList.remove('growth-reveal--entering');
      void overlay.offsetWidth;
      overlay.classList.add('growth-reveal--entering');
      overlay.focus({ preventScroll: true });
      playFeedback(model);
      return true;
    }

    async function openWhenReady(model) {
      if (!model || opened) return false;
      await Promise.allSettled([
        prepare(model.beforeStateAsset),
        prepare(model.afterStateAsset)
      ]);
      return open(model);
    }

    function close(force = false) {
      if (!opened || (!force && Date.now() - openedAt < gateMs)) return false;
      opened = false;
      overlay.hidden = true;
      overlay.classList.remove('growth-reveal--entering');
      doc.body.style.overflow = restoreOverflow;
      if (currentModel && profileApi && storage) {
        profileApi.markCourseRevealSeen({
          storage,
          courses,
          courseId: currentModel.courseId,
          stageId: currentModel.stageId
        });
      }
      currentModel = null;
      if (restoreFocus?.focus) {
        try { restoreFocus.focus({ preventScroll: true }); } catch {}
      }
      return true;
    }

    function onClick(event) {
      event.preventDefault();
      event.stopPropagation();
      close(false);
    }

    function onKeydown(event) {
      if (!['Enter', ' ', 'Escape'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      close(false);
    }

    overlay.addEventListener('click', onClick);
    overlay.addEventListener('keydown', onKeydown);

    function destroy() {
      close(true);
      overlay.removeEventListener('click', onClick);
      overlay.removeEventListener('keydown', onKeydown);
      overlay.remove();
      return true;
    }

    if (courseId) Promise.resolve().then(() => preloadNext(courseId));

    return Object.freeze({
      open,
      openWhenReady,
      prepare,
      preloadNext,
      close,
      destroy,
      isOpen: () => opened
    });
  }

  return Object.freeze({ buildRevealModel, recordStageResult, preloadStateAsset, create });
});
