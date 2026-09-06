/* Test-only adapter. The release server never serves this directory. */
(async function () {
  'use strict';
  const entry = document.querySelector('[data-learning-path]');
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = src;
    script.onload = resolve; script.onerror = () => reject(Error('Script failed: ' + src));
    document.head.append(script);
  });
  const loadStyle = href => new Promise((resolve, reject) => {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href;
    link.onload = resolve; link.onerror = () => reject(Error('Style failed: ' + href));
    document.head.append(link);
  });
  const reloadSeed = window.parent.fixtureReloadSeed;
  delete window.parent.fixtureReloadSeed;
  const control = window.fixture = { audio: [], errors: [], dispatchCount: 0, now: reloadSeed?.now || '2026-09-06T12:00:00Z', failSave: false, throwNext: false };
  window.addEventListener('error', event => control.errors.push(event.message));
  window.addEventListener('unhandledrejection', event => control.errors.push(String(event.reason)));
  class TestAudio extends EventTarget {
    constructor(src) { super(); this.src = src; control.audio.push(this); }
    play() { this.playing = true; return Promise.resolve(); }
    pause() { this.playing = false; }
    removeAttribute() { this.src = null; }
    load() {}
    finish() { this.playing = false; this.dispatchEvent(new Event('ended')); }
  }
  try {
    await Promise.all(JSON.parse(entry.dataset.courseStyles).map(loadStyle));
    control.unit = await (await fetch(entry.dataset.unitCatalogUrl)).json();
    for (const src of JSON.parse(entry.dataset.courseScripts)) {
      // Install adapters just before the actual production controller boots.
      if (src.includes('/course/path.js')) {
        const core = window.CanranCore;
        core.curriculumCatalog = { getTeachingUnit: () => control.unit };
        control.adapter = core.learningStore.createMemoryAdapter(reloadSeed?.records);
        core.learningStore = { ...core.learningStore, createLocalStorageAdapter: () => ({
          load: key => control.adapter.load(key),
          commit: (...args) => control.failSave ? {status:'unavailable', persisted:false} : control.adapter.commit(...args)
        }) };
        const runtime = core.learningPathRuntime;
        core.learningPathRuntime = { ...runtime, createRuntime: options => {
          const real = runtime.createRuntime({ ...options, now: () => new Date(control.now), random: () => .37 });
          control.runtime = real;
          return { ...real, dispatch: event => {
            control.dispatchCount++;
            if (control.throwNext) { control.throwNext = false; throw Error('Intentional QA controller failure'); }
            return real.dispatch(event);
          } };
        } };
        window.Audio = TestAudio;
      }
      await loadScript(src);
    }
    await loadScript('/__qa__/axe.js');
    await document.fonts.ready;
    control.ready = true;
  } catch (error) { control.errors.push(String(error)); }
})();
