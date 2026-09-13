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
  class AudioStub extends EventTarget {
    constructor(src) { super(); this.src = src; this.readyState = 4; this.events = {}; audioElements.push(this); }
    addEventListener(type, handler, options) { this.events[type] = handler; super.addEventListener(type, handler, options); }
    play() { this.playedRate = this.playbackRate; this.keptPitch = this.preservesPitch; this.dispatchEvent(new Event('playing')); return Promise.resolve(); }
    pause() { this.paused = true; }
    removeAttribute(name) { delete this[name]; }
    load() {}
  }
  const context = {
    Audio: AudioStub, Promise, navigator: {}, console, AbortController, setTimeout, clearTimeout,
    Image: class { decode() { return Promise.resolve(); } }, fetch: async () => ({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}),
    localStorage: {}, scrollTo() {}, addEventListener() {}, matchMedia: () => ({ matches: true }),
    document: { documentElement: { classList: { toggle() {} } }, querySelector: selector => selector === '[data-learning-path]' ? root : null, activeElement: null, addEventListener() {} },
    CanranCore: {
      curriculumCatalog: { getTeachingUnit: () => unit },
      learningStore: { createLocalStorageAdapter: () => store.createMemoryAdapter() },
      learningPathRuntime: { createRuntime(options) { rt = runtime.createRuntime(options); return rt; } },
      learningPathScene: scene
    }
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../../core/learning-media.js'),'utf8'), context);
  vm.runInNewContext(boot, context);
  const flush = () => new Promise(resolve => setImmediate(resolve));
  async function click(action, id) {
    const button = { dataset: { action, id }, disabled: false };
    handlers.click({ target: { closest: selector => selector === 'button[data-action]' ? button : null } });
    await flush();
  }
  await click('open-node', 'K01');
  assert.equal(audioElements.filter(a=>a.playedRate).length, 0);
  await click('story-start');
  const first = audioElements.find(a=>a.playedRate), staleEnded=first.events.ended; assert.equal(first.playedRate, 1);
  await click('replay'); const replay = first;
  assert.equal(first.paused, true);
  assert.equal(replay.defaultPlaybackRate, 1); assert.equal(replay.src, unit.sources['L01-D01'].audioSrc);
  assert.equal(replay.playedRate, 1); assert.equal(replay.keptPitch, undefined);
  staleEnded(); await flush(); assert.equal(rt.snapshot().canContinue, false);
  replay.events.ended(); await flush(); assert.equal(rt.snapshot().canContinue, true);
  assert.equal(rt.snapshot().storyIndex, 0);
  await click('continue'); assert.equal(rt.snapshot().storyIndex, 1);
  const second=audioElements.find(a=>a.src===unit.sources['L01-D02'].audioSrc);assert.equal(second.playedRate,1);
  assert.equal(rt.snapshot().canContinue, false);
  await click('map'); assert.equal(second.paused, true);
  second.events.ended(); await flush(); assert.equal(rt.snapshot().screen, 'map');
  const before = JSON.stringify(rt.snapshot().record);
  await click('journey-nav', 'review'); assert.match(root.innerHTML, /data-journey-tab="review"/);
  await click('journey-nav', 'progress'); assert.match(root.innerHTML, /data-journey-tab="progress"/);
  await click('journey-nav', 'path'); assert.match(root.innerHTML, /data-journey-tab="path"/);
  await click('preview-node', 'C04'); assert.match(root.innerHTML, /id="journey-preview-C04"/);
  handlers.keydown({ key: 'Escape' }); assert.doesNotMatch(root.innerHTML, /id="journey-preview-C04"/);
  assert.equal(JSON.stringify(rt.snapshot().record), before);
});
