'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const catalog = require('../../core/learning-course-catalog');
const runtime = require('../../core/learning-path-runtime');
const store = require('../../core/learning-store');
const scene = require('../../core/learning-path-scene');
const boot = fs.readFileSync(require.resolve('../../poc/lesson1-2-experience/path.js'), 'utf8');

test('the page plays original recordings at native speed, stops stale media and advances story only on clicks', async () => {
  const unit = catalog.getCourse(), audioElements = [], handlers = {};
  const root = { dataset: { unitId: unit.unitId }, innerHTML: '', querySelector: () => null, querySelectorAll: () => [], addEventListener: (type, handler) => { handlers[type] = handler; } };
  let rt;
  class AudioStub {
    constructor(src) { this.src = src; this.events = {}; audioElements.push(this); }
    addEventListener(type, handler) { this.events[type] = handler; }
    play() { this.playedRate = this.playbackRate; this.keptPitch = this.preservesPitch; return Promise.resolve(); }
    pause() { this.paused = true; }
    removeAttribute(name) { delete this[name]; }
    load() {}
  }
  const context = {
    Audio: AudioStub, Promise, navigator: {}, console,
    localStorage: {}, scrollTo() {}, addEventListener() {},
    document: { querySelector: () => root, activeElement: null, addEventListener() {} },
    CanranCore: {
      curriculumCatalog: { getTeachingUnit: () => unit },
      learningStore: { createLocalStorageAdapter: () => store.createMemoryAdapter() },
      learningPathRuntime: { createRuntime(options) { rt = runtime.createRuntime(options); return rt; } },
      learningPathScene: scene
    }
  };
  vm.runInNewContext(boot, context);
  const flush = () => new Promise(resolve => setImmediate(resolve));
  async function click(action, id) {
    handlers.click({ target: { closest: () => ({ dataset: { action, id }, disabled: false }) } });
    await flush();
  }
  await click('open-node', 'K01');
  assert.equal(audioElements.length, 0);
  await click('story-start');
  const first = audioElements.at(-1); assert.equal(first.playedRate, 1);
  await click('replay'); const replay = audioElements.at(-1);
  assert.equal(first.paused, true); assert.equal(first.src, undefined);
  assert.equal(replay.defaultPlaybackRate, 1); assert.equal(replay.src, unit.sources['L01-D01'].audioSrc);
  assert.equal(replay.playedRate, 1); assert.equal(replay.keptPitch, undefined);
  first.events.ended(); await flush(); assert.equal(rt.snapshot().canContinue, false);
  replay.events.ended(); await flush(); assert.equal(rt.snapshot().canContinue, true);
  assert.equal(rt.snapshot().storyIndex, 0); assert.equal(audioElements.length, 2);
  await click('continue'); assert.equal(rt.snapshot().storyIndex, 1);
  assert.equal(audioElements.at(-1).src, unit.sources['L01-D02'].audioSrc);
  assert.equal(rt.snapshot().canContinue, false);
  await click('map'); assert.equal(audioElements.at(-1).paused, true);
  audioElements.at(-1).events.ended(); await flush(); assert.equal(rt.snapshot().screen, 'map');
});
