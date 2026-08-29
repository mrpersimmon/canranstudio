'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
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

test('Lesson 1–2 HTML paints a startup surface before any script can run', () => {
  assert.match(pageSource, /<main[^>]*data-learning-microtask-experience[^>]*>[\s\S]*data-experience-startup/);
  assert.match(pageSource, /data-startup-state="loading"/);
  assert.match(pageSource, /data-startup-reload/);
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
const pageStylesheetSources = [...pageSource.matchAll(
  /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="([^"]+)")[^>]*>/g
)].map(match => match[1]);
const pageScriptPaths = pageScriptSources
  .map(source => new URL(source, 'http://lesson.local').pathname);
const pageDocumentRevision = new URL(
  pageScriptSources[0],
  'http://lesson.local'
).searchParams.get('v');
const bootstrapRevision = bootstrapSource.match(
  /const BOOT_REVISION = '([^']+)'/
)?.[1] || '';
const entryRescueSource = pageSource.match(
  /<script\s+data-entry-rescue>([\s\S]*?)<\/script>/
)?.[1] || '';

test('Lesson 1–2 pins scripts, stylesheets, and bootstrap recovery to one document revision', () => {
  const scriptRevisions = pageScriptSources.map(source => (
    new URL(source, 'http://lesson.local').searchParams.get('v')
  ));
  const stylesheetRevisions = pageStylesheetSources.map(source => (
    new URL(source, 'http://lesson.local').searchParams.get('v')
  ));

  assert.equal(scriptRevisions.length, 7);
  assert.ok(scriptRevisions.every(Boolean));
  assert.equal(new Set(scriptRevisions).size, 1);
  assert.ok(pageStylesheetSources.length > 0);
  assert.ok(stylesheetRevisions.every(Boolean));
  assert.deepEqual(
    stylesheetRevisions,
    Array(pageStylesheetSources.length).fill(scriptRevisions[0])
  );
  assert.equal(bootstrapRevision, scriptRevisions[0]);
  assert.match(pageSource, new RegExp(`data-startup-reload href="\\?v=${scriptRevisions[0]}"`));
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
    if (entryRescueSource) {
      vm.runInContext(entryRescueSource, context, { filename: 'entry-rescue.js' });
    }
    for (const source of pageScriptSources) {
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

test('Lesson 1–2 real index script chain boots the arrival scene without an uncaught error', () => {
  assert.deepEqual(pageScriptPaths, [
    '/core/curriculum-catalog.js',
    '/core/learning-store.js',
    '/core/learning-ledger.js',
    '/core/learning-runtime.js',
    '/core/learning-outcome-practice.js',
    '/core/learning-microtask-scene.js',
    '/poc/lesson1-2-experience/experience.js'
  ]);

  const result = runRealPageScripts();

  assert.equal(result.thrown, null);
  assert.equal(result.loadedSources.length, 7);
  assert.equal(result.errors.length, 0);
  assert.match(result.root.innerHTML, /class="station-app"/);
  assert.match(result.root.innerHTML, /class="arrival-card"/);
  assert.equal(result.document.title, 'Lesson 1–2 · 星灯失物招领站');
});

test('Lesson 1–2 real bootstrap restores a completed unit before the first page paint', () => {
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

test('Lesson 1–2 real bootstrap restores a saved terminal presentation before the first page paint', () => {
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

test('Lesson 1–2 real arrival entry click advances through briefing into the first mission', async () => {
  const result = runRealPageScripts();
  assert.equal(result.rootClickListeners.length, entryRescueSource ? 2 : 1);
  assert.match(result.root.innerHTML, /class="arrival-card"/);

  result.clickAction('start');
  assert.match(result.root.innerHTML, /class="briefing-card"/);

  result.clickAction('start');
  await new Promise(resolve => queueMicrotask(resolve));
  assert.match(result.root.innerHTML, /data-view="mission"/);
  assert.match(result.root.innerHTML, /data-runtime-microtask="L01-M07"/);
  assert.doesNotMatch(result.root.innerHTML, /class="arrival-card"|class="briefing-card"/);
  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.replacementUrls, []);
});

test('Lesson 1–2 entry rescue waits for the ordinary start listener across a capture microtask checkpoint', async () => {
  const result = runRealPageScripts();
  assert.match(result.root.innerHTML, /class="arrival-card"/);

  await result.clickActionWithCaptureCheckpoint('start');
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.match(result.root.innerHTML, /class="briefing-card"/);
  assert.deepEqual(result.replacementUrls, []);
});

test('Lesson 1–2 real arrival entry remains clickable with a malformed recovery record', () => {
  const result = runRealPageScripts({
    storedEntries: [['poc:learning-experience:NCE-U01:lesson1-2-v2.1', '{malformed-json']]
  });
  assert.equal(result.thrown, null);
  assert.match(result.root.innerHTML, /class="arrival-card"/);

  result.clickAction('start');
  assert.match(result.root.innerHTML, /class="briefing-card"/);
  assert.equal(result.errors.length, 0);
});

test('Lesson 1–2 entry rescue fresh-navigates a painted arrival when bootstrap did not run', async () => {
  const healthy = runRealPageScripts();
  const detached = runRealPageScripts({
    initialHtml: healthy.root.innerHTML,
    omitSource: '/poc/lesson1-2-experience/experience.js'
  });
  assert.match(detached.root.innerHTML, /class="arrival-card"/);
  assert.equal(detached.rootClickListeners.length, 1);

  const beforeClick = detached.root.innerHTML;
  detached.clickAction('start');
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(detached.root.innerHTML, beforeClick);
  assert.deepEqual(detached.replacementUrls, [`?v=${pageDocumentRevision}&recover=entry-noop`]);
});
