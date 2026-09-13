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
  const control = window.fixture = { audio: [], feedbackAudio: [], errors: [], dispatchCount: 0, completedDispatches: {}, now: reloadSeed?.now || '2026-09-06T12:00:00Z', failSave: false, throwNext: false };
  window.addEventListener('error', event => control.errors.push(event.message));
  window.addEventListener('unhandledrejection', event => control.errors.push(String(event.reason)));
  class TestAudio extends EventTarget {
    constructor(src) { super(); this.src = src; this.readyState = 4; }
    play() { this.playing = true; const list=this.src.includes('/assets/feedback/')?control.feedbackAudio:control.audio;list.push(this);this.dispatchEvent(new Event('playing')); return Promise.resolve(); }
    pause() { this.playing = false; }
    removeAttribute() { this.src = null; }
    load() {}
    finish() { this.playing = false; this.dispatchEvent(new Event('ended')); }
  }
  try {
    await Promise.all(JSON.parse(entry.dataset.courseStyles).map(loadStyle));
    await loadScript('/core/course-catalog-wire.js');
    control.unit = window.CanranCore.courseCatalogWire.decode(await (await fetch(entry.dataset.unitCatalogUrl)).json());
    // Test-only short/empty bank. Keep actual authored questions and controls.
    if(Number.isInteger(reloadSeed?.placementPoolSize))control.unit.placement.questions=control.unit.placement.questions.filter(q=>q.chapterId==='found').slice(0,reloadSeed.placementPoolSize);
    for (const src of JSON.parse(entry.dataset.courseScripts)) {
      // Install adapters just before the actual production controller boots.
      if (src.includes('/course/path.js')) {
        const core = window.CanranCore;
        core.curriculumCatalog = { getTeachingUnit: () => control.unit };
        control.adapter = core.learningStore.createMemoryAdapter(reloadSeed?.records);
        if(reloadSeed?.draft)control.adapter.saveDraft(reloadSeed.key,reloadSeed.draft);
        core.learningStore = { ...core.learningStore, createLocalStorageAdapter: () => ({
          ...control.adapter,
          saveDraft:(...args)=>control.failSave?{status:'unavailable'}:control.adapter.saveDraft(...args),
          load: key => control.adapter.load(key),
          commit: (...args) => control.failSave ? {status:'unavailable', persisted:false} : control.adapter.commit(...args)
        }) };
        const runtime = core.learningPathRuntime;
        core.learningPathRuntime = { ...runtime, createRuntime: options => {
          control.randomState=reloadSeed?.randomSeed;
          const random=()=>control.randomState===undefined?.37:((control.randomState=(Math.imul(control.randomState,1664525)+1013904223)>>>0)/4294967296);
          const real = runtime.createRuntime({ ...options, now: () => new Date(control.now), random });
          control.runtime = {...real,snapshot:()=>real.snapshot(true)};
          return { ...real, dispatch: (event,options) => {
            control.dispatchCount++;
            try {
              if (control.throwNext) { control.throwNext = false; throw Error('Intentional QA controller failure'); }
              return real.dispatch(event,options);
            } finally {
              control.completedDispatches[event.type]=(control.completedDispatches[event.type]||0)+1;
            }
          } };
        } };
        window.Audio = TestAudio;
      }
      await loadScript(src);
    }
    await loadScript('/__qa__/axe.js');
    await document.fonts.ready;
    // The controller's first read is asynchronous and waits for its storage
    // lock. Script onload alone can precede both dispatch and the initial DOM.
    const deadline=performance.now()+15000;
    while(!control.completedDispatches.reload || !entry.querySelector('.lp-shell')){
      if(performance.now()>deadline)throw Error('Initial course reload did not render');
      await new Promise(resolve=>setTimeout(resolve,5));
    }
    control.ready = true;
    // Local-only, reproducible completion states for screenshot review. Uses
    // production controls/runtime with this file's memory/audio adapters.
    if (new URLSearchParams(location.search).has('settlement')) await loadScript('/__qa__/settlement-preview.js');
  } catch (error) { control.errors.push(String(error)); }
})();
