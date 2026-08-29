(function lessonOneTwoExperience() {
  'use strict';

  const UNIT_ID = 'NCE-U01';
  const BOOT_REVISION = 'lesson1-2-v2-20260830-r6';
  const root = document.querySelector('[data-learning-microtask-experience]');
  if (!root) return;

  function showStartupFailure(reason, error) {
    root.innerHTML = `<section class="experience-startup" data-experience-startup data-startup-state="failed" data-startup-reason="${reason}" role="alert">
      <div class="experience-startup__beacon" aria-hidden="true"><span>★</span><i></i></div>
      <p class="experience-startup__kicker">LEARNING ADVENTURE</p>
      <h1>这次没有准备好</h1>
      <p>请重新加载，已经保存的学习进度不会丢失。</p>
      <a class="experience-startup__reload experience-startup__reload--primary" data-startup-reload href="?v=${BOOT_REVISION}">重新加载</a>
    </section>`;
    root.querySelector('[data-startup-reload]')?.addEventListener('click', event => {
      event.preventDefault();
      globalThis.location?.reload?.();
    });
    try {
      globalThis.console?.error?.('[lesson1-2-startup]', reason, error);
    } catch {
      // The visible recovery surface must not depend on developer logging.
    }
  }

  try {
    const core = globalThis.CanranCore || {};
    const unit = core.curriculumCatalog?.getTeachingUnit?.(UNIT_ID);
    if (!unit?.experienceRevision || !core.learningMicrotaskScene?.mount) {
      showStartupFailure('dependency-unavailable', new Error('learning experience dependencies are unavailable'));
      return;
    }
    const revisionScopedStorageKey = `poc:learning-experience:${unit.unitId}:${unit.experienceRevision}`;

    core.learningMicrotaskScene.mount({
      root,
      unit,
      entryLesson: 'lesson1',
      storageKey: revisionScopedStorageKey,
      dependencies: {
        catalog: core.curriculumCatalog,
        storeFactory: core.learningStore,
        ledgerFactory: core.learningLedger,
        runtimeFactory: core.learningRuntime,
        outcomePracticeFactory: core.learningOutcomePractice
      }
    });
  } catch (error) {
    showStartupFailure('mount-failed', error);
  }
})();
