'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const curriculumCatalog = require('../../core/curriculum-catalog');

const ROOT = path.resolve(__dirname, '../..');
const LESSON_UNIT = curriculumCatalog.getTeachingUnit('NCE-U01');
const LESSON_STORAGE_KEY = `poc:learning-experience:${LESSON_UNIT.unitId}:${LESSON_UNIT.experienceRevision}`;
const LESSON_MICROTASKS = LESSON_UNIT.beats.flatMap(beat => beat.microtasks || []);
const bootstrapSource = fs.readFileSync(path.join(
  ROOT,
  'poc/lesson1-2-experience/experience.js'
), 'utf8');
const pageSource = fs.readFileSync(path.join(
  ROOT,
  'poc/lesson1-2-experience/index.html'
), 'utf8');

function runBootstrap({ mount, includeScene = true } = {}) {
  const reloadListeners = [];
  const errors = [];
  const reloadButton = {
    addEventListener(type, listener) {
      if (type === 'click') reloadListeners.push(listener);
    }
  };
  const root = {
    innerHTML: '<section data-experience-startup data-startup-state="loading"></section>',
    querySelector(selector) {
      return selector === '[data-startup-reload]' ? reloadButton : null;
    }
  };
  const unit = { unitId: 'NCE-U01', experienceRevision: 'lesson1-2-v2.1' };
  const CanranCore = {
    curriculumCatalog: { getTeachingUnit: () => unit },
    learningStore: {},
    learningLedger: {},
    learningRuntime: {},
    learningOutcomePractice: {}
  };
  if (includeScene) CanranCore.learningMicrotaskScene = { mount };
  const context = vm.createContext({
    CanranCore,
    document: {
      querySelector(selector) {
        return selector === '[data-learning-microtask-experience]' ? root : null;
      }
    },
    location: { reload() {} },
    console: { error(...args) { errors.push(args); } }
  });

  let thrown = null;
  try {
    vm.runInContext(bootstrapSource, context, { filename: 'experience.js' });
  } catch (error) {
    thrown = error;
  }
  return { root, errors, reloadListeners, thrown };
}

test('Lesson 1–2 HTML paints an automatic course-package loader before any runtime script can run', () => {
  assert.match(pageSource, /<main[^>]*data-learning-microtask-experience[^>]*data-course-package-entry/);
  assert.match(pageSource, /data-course-package-shell[^>]*data-package-state="checking"/);
  assert.match(pageSource, /data-package-progress/);
  assert.doesNotMatch(pageSource, /data-package-start/);
  assert.equal((pageSource.match(/course-package-cat[\s\S]*?<\/div>/)?.[0].match(/<img\b/g) || []).length, 4);
  assert.doesNotMatch(pageSource, /data-experience-startup|class="station-app"/);
});

test('Lesson 1–2 loader is a single child-facing status surface, not a package explanation', () => {
  const bodyMarkup = pageSource.slice(pageSource.indexOf('<body>'));
  assert.match(bodyMarkup, /<h1>Lesson 1–2<\/h1>/);
  assert.equal((bodyMarkup.match(/data-package-progress(?=[\s=>])/g) || []).length, 1);
  assert.equal((bodyMarkup.match(/data-package-status\b/g) || []).length, 1);
  assert.equal((bodyMarkup.match(/data-package-percent\b/g) || []).length, 1);
  assert.doesNotMatch(bodyMarkup, /course-package-intro|data-package-bytes|data-package-phase|data-package-slow/);
  assert.doesNotMatch(
    bodyMarkup,
    /先把整课|开始后就不用再等|所有人物、图片和声音|课程清单|\bMB\b/
  );
  assert.match(bodyMarkup, /data-package-continue[^>]*>继续等待<\/button>/);
});

test('Lesson 1–2 bootstrap replaces a missing core dependency with recovery UI', () => {
  const result = runBootstrap({ includeScene: false });

  assert.equal(result.thrown, null);
  assert.match(result.root.innerHTML, /data-startup-state="failed"/);
  assert.match(result.root.innerHTML, /data-startup-reload/);
  assert.equal(result.reloadListeners.length, 1);
});

test('Lesson 1–2 bootstrap catches a mount failure instead of leaving a black screen', () => {
  const result = runBootstrap({ mount() { throw new Error('fixture mount failure'); } });

  assert.equal(result.thrown, null);
  assert.match(result.root.innerHTML, /data-startup-state="failed"/);
  assert.match(result.root.innerHTML, /data-startup-reload/);
  assert.equal(result.reloadListeners.length, 1);
  assert.equal(result.errors.length, 1);
});

test('Lesson 1–2 bootstrap still delegates the healthy path to the scene mount', () => {
  let mounted = false;
  const result = runBootstrap({
    mount(options) {
      mounted = options.storageKey === 'poc:learning-experience:NCE-U01:lesson1-2-v2.1';
      options.root.innerHTML = '<section data-mounted></section>';
    }
  });

  assert.equal(result.thrown, null);
  assert.equal(mounted, true);
  assert.match(result.root.innerHTML, /data-mounted/);
  assert.equal(result.errors.length, 0);
});

const pageScriptSources = [...pageSource.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)]
  .map(match => match[1]);
const runtimeScriptSources = JSON.parse(pageSource.match(/data-course-scripts='([^']+)'/)?.[1] || '[]');
const pageStylesheetSources = JSON.parse(pageSource.match(/data-course-styles='([^']+)'/)?.[1] || '[]');
const pageScriptPaths = pageScriptSources
  .map(source => new URL(source, 'http://lesson.local').pathname);
const pageDocumentRevision = new URL(
  runtimeScriptSources.at(-1),
  'http://lesson.local'
).searchParams.get('v');
const bootstrapRevision = bootstrapSource.match(
  /const BOOT_REVISION = '([^']+)'/
)?.[1] || '';
test('Lesson 1–2 pins bootstrap and deferred runtime behind one hashed manifest', () => {
  const bootstrapRevisions = pageScriptSources.map(source => (
    new URL(source, 'http://lesson.local').searchParams.get('v')
  ));
  const runtimeRevisions = runtimeScriptSources.map(source => (
    new URL(source, 'http://lesson.local').searchParams.get('v')
  ));
  const stylesheetRevisions = pageStylesheetSources.map(source => (
    new URL(source, 'http://lesson.local').searchParams.get('v')
  ));
  const expectedManifestHash = pageSource.match(/data-manifest-sha256="([a-f0-9]{64})"/)?.[1];
  const actualManifestHash = createHash('sha256').update(fs.readFileSync(path.join(
    ROOT,
    'poc/lesson1-2-experience/course-package-manifest.json'
  ))).digest('hex');

  assert.deepEqual(pageScriptPaths, [
    '/core/course-package-installer.js',
    '/core/course-package-entry.js'
  ]);
  assert.deepEqual(bootstrapRevisions, ['course-package-v1', 'course-package-v1']);
  assert.equal(runtimeRevisions.length, 6);
  assert.ok(runtimeRevisions.every(Boolean));
  assert.equal(new Set(runtimeRevisions).size, 1);
  assert.ok(pageStylesheetSources.length > 0);
  assert.ok(stylesheetRevisions.every(Boolean));
  assert.equal(bootstrapRevision, runtimeRevisions[0]);
  assert.equal(expectedManifestHash, actualManifestHash);
});

function runRealPageScripts({ initialHtml = null, omitSource = null, storedEntries = [] } = {}) {
  const stored = new Map();
  const errors = [];
  const reloadListeners = [];
  const replacementUrls = [];
  const captureClickListeners = [];
  const bubbleClickListeners = [];
  const rootClickListeners = [];
  for (const [key, value] of storedEntries) stored.set(key, value);
  const reloadButton = {
    addEventListener(type, listener) {
      if (type === 'click') reloadListeners.push(listener);
    }
  };
  const root = {
    innerHTML: initialHtml
      || '<section data-experience-startup data-startup-state="loading"></section>',
    addEventListener(type, listener, options) {
      if (type !== 'click') return;
      rootClickListeners.push(listener);
      const capture = options === true || options?.capture === true;
      (capture ? captureClickListeners : bubbleClickListeners).push(listener);
    },
    contains() { return true; },
    querySelector(selector) {
      return selector === '[data-startup-reload]' ? reloadButton : null;
    }
  };
  const document = {
    title: '',
    visibilityState: 'visible',
    querySelector(selector) {
      return selector === '[data-learning-microtask-experience]' ? root : null;
    },
    addEventListener() {},
    removeEventListener() {}
  };
  const context = vm.createContext({
    CanranCore: { curriculumCatalog },
    document,
    localStorage: {
      getItem(key) { return stored.has(key) ? stored.get(key) : null; },
      setItem(key, value) { stored.set(key, String(value)); },
      removeItem(key) { stored.delete(key); }
    },
    location: {
      reload() {},
      replace(url) { replacementUrls.push(String(url)); }
    },
    console: { error(...args) { errors.push(args); } },
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    clearTimeout,
    queueMicrotask,
    structuredClone
  });
  context.globalThis = context;
  context.window = context;

  function clickAction(action, value) {
    const button = {
      dataset: { action, ...(value === undefined ? {} : { value }) },
      closest(selector) {
        return selector === 'button[data-action]'
          || (selector === 'button[data-action="start"]' && action === 'start')
          ? this
          : null;
      }
    };
    for (const listener of rootClickListeners) listener({ target: button });
  }

  async function clickActionWithCaptureCheckpoint(action, value) {
    const button = {
      dataset: { action, ...(value === undefined ? {} : { value }) },
      closest(selector) {
        return selector === 'button[data-action]'
          || (selector === 'button[data-action="start"]' && action === 'start')
          ? this
          : null;
      }
    };
    const event = { target: button };
    for (const listener of captureClickListeners) listener(event);
    await new Promise(resolve => queueMicrotask(resolve));
    for (const listener of bubbleClickListeners) listener(event);
  }

  const loadedSources = [];
  let thrown = null;
  try {
    for (const source of runtimeScriptSources) {
      const sourcePath = new URL(source, 'http://lesson.local').pathname;
      if (source === omitSource || sourcePath === omitSource) continue;
      const filename = sourcePath.replace(/^\//, '');
      vm.runInContext(fs.readFileSync(path.join(ROOT, filename), 'utf8'), context, { filename });
      loadedSources.push(source);
    }
  } catch (error) {
    thrown = error;
  }

  return {
    clickAction,
    clickActionWithCaptureCheckpoint,
    captureClickListeners,
    document,
    errors,
    loadedSources,
    reloadListeners,
    replacementUrls,
    root,
    rootClickListeners,
    thrown
  };
}

function encodedLessonProgress(unitState) {
  return JSON.stringify({
    revision: 1,
    value: {
      schemaVersion: 1,
      units: {
        [LESSON_UNIT.unitId]: {
          experienceRevision: LESSON_UNIT.experienceRevision,
          adventureHeartsRemaining: 3,
          rolePracticeProgress: {},
          storyFacts: [],
          sourceContacts: {},
          ...unitState
        }
      }
    }
  });
}

test('Lesson 1–2 deferred runtime script chain boots the first mission without an uncaught error', () => {
  assert.deepEqual(runtimeScriptSources.map(source => new URL(source, 'http://lesson.local').pathname), [
    '/core/learning-store.js',
    '/core/learning-ledger.js',
    '/core/learning-runtime.js',
    '/core/learning-outcome-practice.js',
    '/core/learning-microtask-scene.js',
    '/poc/lesson1-2-experience/experience.js'
  ]);

  const result = runRealPageScripts();

  assert.equal(result.thrown, null);
  assert.equal(result.loadedSources.length, 6);
  assert.equal(result.errors.length, 0);
  assert.match(result.root.innerHTML, /class="station-app"/);
  assert.match(result.root.innerHTML, /data-view="mission"/);
  assert.match(result.root.innerHTML, /data-runtime-microtask="L01-M07"/);
  assert.match(result.root.innerHTML, /data-presentation-moment="story-briefing"/);
  assert.doesNotMatch(result.root.innerHTML, /class="arrival-card"|class="briefing-card"/);
  assert.equal(result.document.title, 'Lesson 1–2 · 星灯失物招领站');
});

test('I04 package readiness enters the first mission without a start gate or stage map', () => {
  assert.doesNotMatch(pageSource, /data-package-start/);

  const result = runRealPageScripts();

  assert.equal(result.thrown, null);
  assert.match(result.root.innerHTML, /data-view="mission"/);
  assert.match(result.root.innerHTML, /data-runtime-microtask="L01-M07"/);
  assert.doesNotMatch(
    result.root.innerHTML,
    /class="arrival-card"|class="briefing-card"|id="course-stage-map"/
  );
});

test('Lesson 1–2 deferred runtime restores a completed unit when the package gate opens', () => {
  const result = runRealPageScripts({
    storedEntries: [[LESSON_STORAGE_KEY, encodedLessonProgress({
      unitAttemptId: 'completed-attempt',
      buildStage: 5,
      completedMicrotaskIds: LESSON_MICROTASKS.map(task => task.microtaskId)
    })]]
  });

  assert.equal(result.thrown, null);
  assert.match(result.root.innerHTML, /data-view="complete"/);
  assert.match(result.root.innerHTML, /data-runtime-status="unit-built"/);
  assert.match(result.root.innerHTML, /data-build-stage="5"/);
  assert.doesNotMatch(result.root.innerHTML, /class="arrival-card"|data-action="start"/);
  assert.deepEqual(result.replacementUrls, []);
});

test('Lesson 1–2 deferred runtime restores a saved terminal presentation when the package gate opens', () => {
  const firstTask = LESSON_MICROTASKS[0];
  const terminalMoment = firstTask.presentation.moments.find(moment => (
    moment.enterWhen?.kind === 'microtask-complete'
  ));
  const result = runRealPageScripts({
    storedEntries: [[LESSON_STORAGE_KEY, encodedLessonProgress({
      unitAttemptId: 'partial-attempt',
      buildStage: 0,
      completedMicrotaskIds: [firstTask.microtaskId],
      checkpoint: {
        checkpointId: firstTask.checkpointAfterSuccess.checkpointId,
        beatId: 'discover',
        microtaskId: firstTask.microtaskId,
        completionStatus: 'completed-independent',
        learningDay: '2026-08-28'
      },
      pendingUiContinuation: {
        kind: 'terminal-presentation',
        microtaskId: firstTask.microtaskId,
        unitAttemptId: 'partial-attempt',
        attemptRevision: 0,
        momentId: terminalMoment.momentId,
        restStop: null
      }
    })]]
  });

  assert.equal(result.thrown, null);
  assert.match(result.root.innerHTML, /data-view="mission"/);
  assert.match(result.root.innerHTML, new RegExp(`data-runtime-microtask="${firstTask.microtaskId}"`));
  assert.match(result.root.innerHTML, new RegExp(`data-presentation-moment="${terminalMoment.momentId}"`));
  assert.doesNotMatch(result.root.innerHTML, /class="arrival-card"|data-action="start"/);
  assert.deepEqual(result.replacementUrls, []);
});

test('Lesson 1–2 real bootstrap paints failed startup UI when outcome practice core is absent', () => {
  const result = runRealPageScripts({ omitSource: '/core/learning-outcome-practice.js' });

  assert.equal(result.thrown, null);
  assert.ok(result.root.innerHTML.length > 0);
  assert.match(result.root.innerHTML, /data-experience-startup/);
  assert.match(result.root.innerHTML, /data-startup-state="failed"/);
  assert.match(result.root.innerHTML, /data-startup-reload/);
  assert.equal(result.reloadListeners.length, 1);
  assert.equal(result.errors.length, 1);
});

test('Lesson 1–2 enters the first mission without a synthetic start click', async () => {
  const result = runRealPageScripts();
  assert.equal(result.rootClickListeners.length, 1);
  await new Promise(resolve => queueMicrotask(resolve));
  assert.match(result.root.innerHTML, /data-view="mission"/);
  assert.match(result.root.innerHTML, /data-runtime-microtask="L01-M07"/);
  assert.doesNotMatch(result.root.innerHTML, /class="arrival-card"|class="briefing-card"/);
  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.replacementUrls, []);
});

test('Lesson 1–2 deferred runtime keeps only its ordinary delegated interaction listener', async () => {
  const result = runRealPageScripts();
  assert.match(result.root.innerHTML, /data-view="mission"/);
  assert.equal(result.rootClickListeners.length, 1);
  assert.equal(result.captureClickListeners.length, 0);
  assert.doesNotMatch(result.root.innerHTML, /data-action="start"/);
  assert.deepEqual(result.replacementUrls, []);
});

test('Lesson 1–2 malformed recovery record still falls back to the first mission', () => {
  const result = runRealPageScripts({
    storedEntries: [['poc:learning-experience:NCE-U01:lesson1-2-v2.1', '{malformed-json']]
  });
  assert.equal(result.thrown, null);
  assert.match(result.root.innerHTML, /data-view="mission"/);
  assert.match(result.root.innerHTML, /data-runtime-microtask="L01-M07"/);
  assert.doesNotMatch(result.root.innerHTML, /class="arrival-card"|class="briefing-card"/);
  assert.equal(result.errors.length, 0);
});

test('Lesson 1–2 initial document does not eagerly include deferred course scripts', () => {
  for (const source of runtimeScriptSources) {
    assert.equal(pageScriptSources.includes(source), false);
  }
  assert.equal(pageDocumentRevision, bootstrapRevision);
});
