(function lessonOneTwoExperience() {
  'use strict';

  const STORAGE_KEY = 'poc:lesson1-2-experience:v1';
  const UNIT_ID = 'NCE-U01';
  const root = document.querySelector('[data-learning-microtask-experience]');
  const core = globalThis.CanranCore || {};

  if (!root || !core.learningMicrotaskScene?.mount) return;

  core.learningMicrotaskScene.mount({
    root,
    unit: core.curriculumCatalog?.getTeachingUnit?.(UNIT_ID),
    entryLesson: 'lesson1',
    storageKey: STORAGE_KEY,
    dependencies: {
      catalog: core.curriculumCatalog,
      storeFactory: core.learningStore,
      ledgerFactory: core.learningLedger,
      runtimeFactory: core.learningRuntime
    }
  });
})();
