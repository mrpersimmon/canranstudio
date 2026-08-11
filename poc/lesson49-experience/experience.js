(function lesson49Experience() {
  'use strict';

  const STORAGE_KEY = 'poc:lesson49-experience:v1';
  const UNIT_ID = 'FLC-U01';
  const ENTRY_LESSON = 'lesson49';
  const MAP_RETURN = '/?district=first-book-49-60&focus=lesson49';
  const root = document.querySelector('[data-lesson49-experience]');
  const core = globalThis.CanranCore || {};

  if (!root || !core.learningScene?.mount) return;

  core.learningScene.mount({
    root,
    unit: core.curriculumCatalog?.getTeachingUnit?.(UNIT_ID),
    entryLesson: ENTRY_LESSON,
    storageKey: STORAGE_KEY,
    mapReturn: MAP_RETURN,
    stageAsset(stage, size, format) {
      return `/assets/adventure-map/lesson49/states/state-${stage}-${size}.${format}`;
    },
    dependencies: {
      catalog: core.curriculumCatalog,
      storeFactory: core.learningStore,
      ledgerFactory: core.learningLedger,
      runtimeFactory: core.learningRuntime,
      audioFactory: core.audio
    }
  });
})();
