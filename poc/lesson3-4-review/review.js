(function lessonThreeFourReview() {
  'use strict';

  const root = document.querySelector('[data-lesson-three-four-review]');
  const core = globalThis.CanranCore || {};
  const unit = core.curriculumCatalog?.getTeachingUnit?.('NCE-U02');
  const runtime = core.storyReviewRuntime;
  if (!root || !unit || !runtime) return;

  const contract = unit.experience.reviewRun;
  const copy = contract.copy;
  const sources = new Map(Object.values(unit.lessonContent || {})
    .flatMap(lesson => Object.values(lesson.sources || {}))
    .map(source => [source.sourceId, source]));
  const reviewKey = `poc:learning-review:${unit.unitId}:${unit.experienceRevision}`;
  let state = runtime.createInitialState(unit);
  let audio = null;
  let activeRequestId = null;
  let feedback = '';

  function picture(entity, className = '') {
    const node = document.createElement('picture');
    node.className = className;
    const image = document.createElement('img');
    image.src = entity.assets.preferred || entity.assets.avif || entity.assets.webp || entity.assets.png;
    image.alt = entity.label;
    image.decoding = 'async';
    node.append(image);
    return node;
  }

  function eligible() {
    if (new URLSearchParams(location.search).get('preview') === '1') return true;
    try {
      const progress = JSON.parse(localStorage.getItem(unit.experience.storageKey) || 'null');
      return runtime.isEligible(unit, progress, new Date());
    } catch {
      return false;
    }
  }

  function shell() {
    const world = document.createElement('section');
    world.className = 'review-world';
    const background = document.createElement('picture');
    background.className = 'review-world__background';
    const portrait = document.createElement('source');
    portrait.media = '(max-aspect-ratio: 4/5)';
    portrait.srcset = unit.experience.scene.backgroundPortrait;
    const image = document.createElement('img');
    image.src = unit.experience.scene.backgroundWide;
    image.alt = '';
    background.append(portrait, image);
    const card = document.createElement('section');
    card.className = 'review-card';
    card.dataset.reviewCard = '';
    const status = document.createElement('p');
    status.className = 'review-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    world.append(background, card, status);
    root.replaceChildren(world);
    return { world, card, status };
  }

  const nodes = shell();

  function addText(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function action(label, name, className = 'review-action') {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = className;
    node.dataset.action = name;
    node.textContent = label;
    return node;
  }

  function heartGauge() {
    const gauge = document.createElement('div');
    gauge.className = 'review-hearts';
    gauge.setAttribute('aria-label', `${copy.heartAriaPrefix} ${state.heartsRemaining} ${copy.heartAriaSuffix}`);
    for (let index = 0; index < 3; index += 1) {
      const heart = addText('span', 'review-heart', '♥');
      heart.dataset.filled = String(index < state.heartsRemaining);
      heart.setAttribute('aria-hidden', 'true');
      gauge.append(heart);
    }
    return gauge;
  }

  function renderEntry() {
    const ready = eligible();
    nodes.card.replaceChildren(
      addText('p', 'review-kicker', copy.entryKicker),
      addText('h1', 'review-title', ready ? copy.entryTitle : copy.unavailableTitle),
      addText('p', 'review-copy', ready ? copy.entryBody : copy.unavailableBody)
    );
    if (ready) nodes.card.append(action(copy.startLabel, 'start'));
    else {
      const back = document.createElement('a');
      back.className = 'review-action review-action--quiet';
      back.href = contract.returnHref;
      back.textContent = copy.returnLabel;
      nodes.card.append(back);
    }
  }

  function renderActive() {
    const item = contract.items[state.currentIndex];
    const meta = document.createElement('div');
    meta.className = 'review-meta';
    meta.append(addText('span', 'review-progress', `${state.currentIndex + 1} / ${contract.items.length}`), heartGauge());
    nodes.card.replaceChildren(
      addText('p', 'review-kicker', copy.entryKicker),
      meta,
      addText('h1', 'review-title', item.prompt)
    );
    if (state.phase === 'audio-ready') {
      nodes.card.append(action(copy.listenLabel, 'play-audio', 'review-action review-action--audio'));
      return;
    }
    if (state.phase === 'audio-playing') {
      nodes.card.append(addText('p', 'review-copy', copy.playingCopy));
      return;
    }
    if (state.phase === 'audio-failed') {
      nodes.card.append(
        addText('p', 'review-copy', copy.audioFailureCopy),
        action(copy.retryLabel, 'retry-audio', 'review-action review-action--audio')
      );
      return;
    }
    if (state.phase === 'rescue-ready') {
      const rescue = document.createElement('div');
      rescue.className = 'review-rescue';
      rescue.append(
        picture(unit.entities[unit.experience.rescueExample.entityId]),
        addText('p', 'review-copy', unit.experience.rescueExample.copy)
      );
      nodes.card.append(rescue, action(copy.rescueLabel, 'start-rescue', 'review-action review-action--audio'));
      return;
    }
    const grid = document.createElement('div');
    grid.className = item.entityIds ? 'review-grid' : 'review-grid review-grid--text';
    if (item.entityIds) {
      item.entityIds.forEach(entityId => {
        const entity = unit.entities[entityId];
        const choice = action('', 'answer-entity', 'review-choice');
        choice.dataset.entityId = entityId;
        choice.append(picture(entity), addText('span', '', entity.label));
        grid.append(choice);
      });
    } else {
      item.options.forEach(option => {
        const choice = action(option.label, 'answer-option', 'review-choice');
        choice.dataset.optionId = option.optionId;
        grid.append(choice);
      });
    }
    nodes.card.append(grid);
  }

  function renderComplete() {
    nodes.card.replaceChildren(
      addText('p', 'review-kicker', copy.entryKicker),
      addText('h1', 'review-title', copy.completeTitle),
      addText('p', 'review-copy', copy.completeBody),
      action(copy.restartLabel, 'restart')
    );
  }

  function render() {
    nodes.status.textContent = feedback;
    if (state.phase === 'entry') renderEntry();
    else if (state.phase === 'complete') renderComplete();
    else renderActive();
  }

  function stopAudio() {
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    audio = null;
    activeRequestId = null;
  }

  function playPending() {
    const pending = state.pendingAudio;
    if (!pending || pending.requestId === activeRequestId) return;
    stopAudio();
    activeRequestId = pending.requestId;
    const source = sources.get(pending.audioRefs[0]);
    audio = new Audio(source.audioSrc);
    audio.preload = 'auto';
    audio.onended = () => dispatch({ type: 'AUDIO_ENDED', requestId: pending.requestId });
    audio.onerror = () => dispatch({ type: 'AUDIO_FAILED', requestId: pending.requestId });
    audio.play().catch(() => dispatch({ type: 'AUDIO_FAILED', requestId: pending.requestId }));
  }

  function dispatch(event) {
    const previous = state;
    state = runtime.reduce(unit, state, event);
    if (state === previous) return;
    if (event.type === 'ANSWER') feedback = state.phase === 'rescue-ready'
      ? copy.rescueFeedback
      : (state.wrongAttempts ? copy.retryFeedback : copy.correctFeedback);
    else feedback = '';
    if (state.phase === 'complete') localStorage.setItem(reviewKey, JSON.stringify(runtime.serialize(unit, state)));
    render();
    if (state.pendingAudio) playPending();
  }

  nodes.world.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const actionName = target.dataset.action;
    if (actionName === 'start') dispatch({ type: 'START' });
    else if (actionName === 'play-audio') dispatch({ type: 'PLAY_AUDIO' });
    else if (actionName === 'retry-audio') dispatch({ type: 'RETRY_AUDIO' });
    else if (actionName === 'start-rescue') dispatch({ type: 'START_RESCUE' });
    else if (actionName === 'answer-entity') dispatch({ type: 'ANSWER', entityId: target.dataset.entityId });
    else if (actionName === 'answer-option') dispatch({ type: 'ANSWER', optionId: target.dataset.optionId });
    else if (actionName === 'restart') {
      stopAudio();
      state = runtime.createInitialState(unit);
      state = runtime.reduce(unit, state, { type: 'START' });
      render();
    }
  });

  document.title = copy.documentTitle;
  render();
})();
