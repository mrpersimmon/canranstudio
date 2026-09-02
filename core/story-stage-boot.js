(function bootStoryStageExperience() {
  'use strict';

  const root = document.querySelector('[data-story-stage-experience]');
  if (!root) return;

  const unitId = root.dataset.unitId;
  const bootRevision = root.dataset.bootRevision;

  function showFailure(reason, error) {
    const section = document.createElement('section');
    section.className = 'experience-startup experience-startup--failed';
    section.dataset.startupState = 'failed';
    section.dataset.startupReason = reason;
    section.setAttribute('role', 'alert');

    const ticket = document.createElement('div');
    ticket.className = 'experience-startup__ticket';
    ticket.textContent = '!';
    const kicker = document.createElement('p');
    kicker.className = 'experience-startup__kicker';
    kicker.textContent = 'NEW CONCEPT ENGLISH';
    const title = document.createElement('h1');
    title.textContent = '这一站还没有准备好';
    const copy = document.createElement('p');
    copy.textContent = '请重新加载；已经完成的阶段不会丢失。';
    const reload = document.createElement('button');
    reload.type = 'button';
    reload.className = 'story-button';
    reload.textContent = '重新加载';
    reload.addEventListener('click', () => globalThis.location.reload());
    section.append(ticket, kicker, title, copy, reload);
    root.replaceChildren(section);
    globalThis.console?.error?.('[story-stage-startup]', reason, error);
  }

  async function boot() {
    try {
      const core = globalThis.CanranCore || {};
      const unit = core.curriculumCatalog?.getTeachingUnit?.(unitId);
      if (
        !unit
        || unit.experienceRevision !== bootRevision
        || !core.storyStageRuntime
        || !core.storyStageScene?.mount
      ) {
        throw new Error(`${unitId || 'unknown unit'} dependencies are unavailable or out of revision`);
      }
      document.title = unit.experience.documentTitle;
      await core.storyStageScene.mount({ root, unit });
    } catch (error) {
      showFailure('mount-failed', error);
    }
  }

  void boot();
})();
