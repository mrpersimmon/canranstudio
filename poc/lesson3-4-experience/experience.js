(function lessonThreeFourExperience() {
  'use strict';

  const UNIT_ID = 'NCE-U02';
  const BOOT_REVISION = 'lesson3-4-v2';
  const root = document.querySelector('[data-lesson-three-four-experience]');
  if (!root) return;

  function showStartupFailure(reason, error) {
    const section = document.createElement('section');
    section.className = 'experience-startup experience-startup--failed';
    section.dataset.startupState = 'failed';
    section.dataset.startupReason = reason;
    section.setAttribute('role', 'alert');
    const ticket = document.createElement('div');
    ticket.className = 'experience-startup__ticket';
    ticket.textContent = '5';
    const kicker = document.createElement('p');
    kicker.className = 'experience-startup__kicker';
    kicker.textContent = 'LESSON 3–4 · STARLIGHT CLOAKROOM';
    const title = document.createElement('h1');
    title.textContent = '衣帽间这次没有准备好';
    const copy = document.createElement('p');
    copy.textContent = '请重新加载；已经完成的阶段不会丢失。';
    const reload = document.createElement('button');
    reload.type = 'button';
    reload.className = 'story-button';
    reload.textContent = '重新加载';
    reload.addEventListener('click', () => globalThis.location.reload());
    section.append(ticket, kicker, title, copy, reload);
    root.replaceChildren(section);
    try {
      globalThis.console?.error?.('[lesson3-4-startup]', reason, error);
    } catch {
      // The visible recovery surface does not depend on logging.
    }
  }

  async function boot() {
    try {
      const core = globalThis.CanranCore || {};
      const unit = core.curriculumCatalog?.getTeachingUnit?.(UNIT_ID);
      if (
        !unit
        || unit.experienceRevision !== BOOT_REVISION
        || !core.storyStageRuntime
        || !core.storyStageScene?.mount
      ) {
        throw new Error('Lesson 3–4 dependencies are unavailable or out of revision');
      }
      document.title = unit.experience.documentTitle;
      await core.storyStageScene.mount({ root, unit });
    } catch (error) {
      showStartupFailure('mount-failed', error);
    }
  }

  boot();
})();
