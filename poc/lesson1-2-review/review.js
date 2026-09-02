(function lessonOneTwoReview() {
  'use strict';

  const UNIT_ID = 'NCE-U01';
  const root = document.querySelector('[data-lesson1-2-review]');
  const core = globalThis.CanranCore || {};
  const unit = core.curriculumCatalog?.getTeachingUnit?.(UNIT_ID);
  if (!root || !unit?.experienceRevision || !core.learningReviewRuntime?.create) return;

  const copy = unit.experience.uiCopy;
  const reviewContract = unit.experience.reviewRun;
  const reviewCopy = reviewContract.copy;
  const revisionScopedStorageKey = `poc:learning-experience:${unit.unitId}:${unit.experienceRevision}`;
  const store = core.learningStore.createLocalStorageAdapter(globalThis.localStorage);
  const clock = Object.freeze({
    learningDay() {
      const now = new Date();
      const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60_000));
      return local.toISOString().slice(0, 10);
    }
  });
  const ledger = core.learningLedger.open({
    store,
    key: revisionScopedStorageKey,
    catalog: core.curriculumCatalog,
    clock
  });

  let runtime;
  let audioElement = null;
  let audioSession = null;
  let audioTimer = null;
  let supportTimer = null;
  let rescueTimer = null;
  let transientFeedback = null;
  let transientFeedbackCellId = null;
  let feedbackTimer = null;
  const orderedSelections = new Map();

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function findSource(sourceRef) {
    for (const lesson of Object.values(unit.lessonContent || {})) {
      if (lesson.sources?.[sourceRef]) return lesson.sources[sourceRef];
    }
    return null;
  }

  function findChallenge(challengeRef) {
    for (const beat of unit.beats || []) {
      for (const task of beat.microtasks || []) {
        for (const step of task.steps || []) {
          const challenge = (step.challenges || []).find(candidate => (
            candidate.challengeRef === challengeRef
          ));
          if (challenge) return challenge;
        }
      }
    }
    return null;
  }

  function challengeForCell(reviewCellId) {
    for (const beat of unit.beats || []) {
      for (const task of beat.microtasks || []) {
        for (const step of task.steps || []) {
          const challenge = (step.challenges || []).find(candidate => (
            candidate.reviewCellId === reviewCellId
          ));
          if (challenge) return challenge;
        }
      }
    }
    return null;
  }

  function entity(entityId) {
    return unit.entities?.[entityId] || null;
  }

  function authoredContent(contentRef) {
    return unit.authoredContent?.[contentRef] || null;
  }

  function picture(source, className = '') {
    if (!source?.assetSrc) return '';
    const fallback = source.assetFallbackSrc
      ? `<source srcset="${escapeHtml(source.assetFallbackSrc)}">`
      : '';
    return `<picture class="${escapeHtml(className)}">
      <source srcset="${escapeHtml(source.assetSrc)}">
      ${fallback}
      <img src="${escapeHtml(source.assetFallbackSrc || source.assetSrc)}" alt="${escapeHtml(source.title || '')}">
    </picture>`;
  }

  function contextBackdropStyle(context) {
    if (!context?.backdropAssetSrc) return '';
    const asset = String(context.backdropAssetSrc).replace(/["\\\n\r]/g, '');
    const position = String(context.backdropPosition || 'center').replace(/[;{}]/g, '');
    return `style="${escapeHtml([
      `--review-context-backdrop:url("${asset}")`,
      `--review-context-position:${position}`
    ].join(';'))}"`;
  }

  function reviewAction(type, extra = {}) {
    const snapshot = runtime.snapshot();
    return runtime.dispatch({
      type,
      experienceRevision: snapshot.experienceRevision,
      stateVersion: snapshot.stateVersion,
      reviewRunId: snapshot.reviewRunId,
      attemptRevision: snapshot.attemptRevision,
      reviewChallengeRef: snapshot.reviewChallengeRef,
      ...extra
    });
  }

  function stopAudio() {
    if (audioTimer) clearTimeout(audioTimer);
    audioTimer = null;
    if (audioElement) {
      audioElement.onended = null;
      audioElement.onerror = null;
      audioElement.pause();
    }
    audioElement = null;
    audioSession = null;
  }

  function startAudio(effect) {
    stopAudio();
    const session = {
      requestId: effect.requestId,
      segmentId: effect.segmentId,
      reviewChallengeRef: effect.reviewChallengeRef,
      visibleText: effect.visibleText
    };
    audioSession = session;
    const play = () => {
      if (audioSession !== session) return;
      const audio = new Audio(effect.src);
      audio.preload = 'auto';
      audioElement = audio;
      let settled = false;
      audio.onended = () => {
        if (settled || audioSession !== session) return;
        settled = true;
        audioElement = null;
        audioSession = null;
        reviewAction('audio/ended', {
          requestId: session.requestId,
          segmentId: session.segmentId
        });
      };
      const failed = error => {
        if (settled || audioSession !== session) return;
        settled = true;
        audioElement = null;
        audioSession = null;
        reviewAction('audio/failed', {
          requestId: session.requestId,
          segmentId: session.segmentId,
          failureKind: error?.name === 'AbortError' ? 'aborted' : 'transient'
        });
      };
      audio.onerror = failed;
      const started = audio.play();
      if (started && typeof started.catch === 'function') started.catch(failed);
    };
    if (effect.delayMs > 0) audioTimer = setTimeout(play, effect.delayMs);
    else play();
  }

  function setFeedback(effect) {
    if (feedbackTimer) clearTimeout(feedbackTimer);
    const challenge = challengeForCell(effect.reviewCellId);
    transientFeedback = challenge?.correctFeedback?.copy || null;
    transientFeedbackCellId = effect.reviewCellId;
    if (transientFeedback) {
      feedbackTimer = setTimeout(() => {
        transientFeedback = null;
        transientFeedbackCellId = null;
        render(runtime.snapshot());
      }, 900);
    }
  }

  function processEffects(effects) {
    for (const effect of effects || []) {
      if (effect.type === 'audio/play') startAudio(effect);
      if (effect.type === 'audio/cancel') stopAudio();
      if (effect.type === 'review/feedback-correct') setFeedback(effect);
      if (effect.type === 'review/support') {
        transientFeedback = effect.copy || copy.feedback.supportFallback;
        transientFeedbackCellId = runtime.snapshot().currentCell?.reviewCellId || null;
        if (supportTimer) clearTimeout(supportTimer);
        supportTimer = setTimeout(() => reviewAction('support/ended'), 1350);
      }
      if (effect.type === 'review/rescue-model') {
        transientFeedback = effect.copy || reviewCopy.rescueBody;
        transientFeedbackCellId = runtime.snapshot().currentCell?.reviewCellId || null;
        if (rescueTimer) clearTimeout(rescueTimer);
        rescueTimer = setTimeout(() => reviewAction('rescue/model-ended'), 1900);
      }
    }
  }

  function heartGauge(snapshot) {
    const maximum = unit.experience.adventureHearts.maximum;
    const remaining = snapshot.heartsRemaining ?? maximum;
    return `<div class="review-hearts" aria-label="${escapeHtml(copy.hearts.ariaPrefix)}${remaining}">
      ${Array.from({ length: maximum }, (_, index) => (
        `<span class="review-heart${index < remaining ? ' is-full' : ''}" aria-hidden="true">♥</span>`
      )).join('')}
    </div>`;
  }

  function contextScene(snapshot) {
    const context = snapshot.currentContext;
    if (!context) return '';
    const explorer = entity('explorer-cat');
    const sceneEntities = (context.entityIds || []).map(entity).filter(Boolean);
    const characters = sceneEntities.filter(candidate => candidate.entityKind === 'character');
    const objects = sceneEntities.filter(candidate => candidate.entityKind !== 'character');
    const showExplorer = ['supporting', 'rescue-model'].includes(snapshot.phase);
    return `<section class="review-diorama" data-review-context="${escapeHtml(context.contextId)}"
      data-review-context-cell="${escapeHtml(snapshot.currentCell.reviewContextId)}"
      ${contextBackdropStyle(context)}>
      <div class="review-diorama__sky" aria-hidden="true"></div>
      <h1 class="review-context-title">${escapeHtml(context.title)}</h1>
      <div class="review-characters">
        ${characters.map(candidate => picture(candidate, 'review-character')).join('')}
      </div>
      <div class="review-props">
        ${objects.map(candidate => picture(candidate, 'review-prop')).join('')}
      </div>
      ${showExplorer ? picture(explorer, 'review-cat') : ''}
    </section>`;
  }

  function instructionFor(challenge) {
    const interaction = copy.interaction;
    if (challenge.answerRule?.type === 'ordered-blocks') return interaction.orderedBlocksPrefix;
    if (challenge.answerRule?.type === 'connect-reference') return interaction.referenceThread;
    if (challenge.candidateSourceRefs?.length) return interaction.selectExpression;
    return interaction.selectItem;
  }

  function optionLabel(kind, identifier) {
    if (kind === 'entity') return entity(identifier)?.title || copy.fallbackEntityTitle;
    if (kind === 'source') return findSource(identifier)?.text || '';
    const authored = authoredContent(identifier);
    return authored?.text || authored?.title || '';
  }

  function answerGrid(snapshot, challenge) {
    const optionSets = [
      ['entity', snapshot.currentCell.candidateEntityIds || []],
      ['source', snapshot.currentCell.candidateSourceRefs || []],
      ['content', snapshot.currentCell.candidateContentRefs || []]
    ];
    const [kind, identifiers] = optionSets.find(([, values]) => values.length) || ['entity', []];
    const ordered = challenge.answerRule?.type === 'ordered-blocks';
    const selected = orderedSelections.get(snapshot.reviewChallengeRef) || [];
    const boundaryRefs = ['partial-cue', 'model'].includes(snapshot.supportLevel)
      ? new Set(challenge.boundaryContentRefs || [])
      : new Set();
    const selectedTrack = ordered
      ? `<div class="review-order-track" aria-label="${escapeHtml(copy.interaction.sequenceTrackLabel)}">
          ${selected.map(identifier => (
            `<button type="button" data-action="review-remove-block" data-option-id="${escapeHtml(identifier)}" class="${boundaryRefs.has(identifier) ? 'is-boundary-cue' : ''}">${escapeHtml(optionLabel(kind, identifier))}</button>`
          )).join('')}
          ${selected.length ? `<button class="review-order-reset" type="button" data-action="review-reset-blocks">${escapeHtml(copy.interaction.reorderLabel || '')}</button>` : ''}
        </div>`
      : '';
    return `<div class="review-answer-area" data-answer-kind="${escapeHtml(kind)}">
      ${selectedTrack}
      <div class="review-options" data-review-options>
        ${identifiers.map(identifier => {
          const candidate = kind === 'entity' ? entity(identifier) : null;
          const disabled = selected.includes(identifier) ? ' disabled' : '';
          return `<button class="review-option${boundaryRefs.has(identifier) ? ' is-boundary-cue' : ''}" type="button" data-review-option
            data-option-kind="${escapeHtml(kind)}" data-option-id="${escapeHtml(identifier)}"${disabled}>
            ${candidate ? picture(candidate, 'review-option__picture') : ''}
            <span>${escapeHtml(optionLabel(kind, identifier))}</span>
          </button>`;
        }).join('')}
      </div>
    </div>`;
  }

  function audioPanel(snapshot) {
    if (!['audio-ready', 'audio-playing', 'audio-paused', 'audio-failed'].includes(snapshot.phase)) {
      return '';
    }
    const failed = snapshot.phase === 'audio-failed';
    const paused = snapshot.phase === 'audio-paused';
    const title = failed ? unit.experience.audioFailure.title : '';
    const detail = failed
      ? unit.experience.audioFailure.copy
      : snapshot.phase === 'audio-playing'
        ? copy.languageAudio.playingHint
        : copy.languageAudio.listenHint;
    const label = failed ? reviewCopy.retryAudioLabel : copy.languageAudio.playLabel;
    const action = failed || paused ? 'audio-retry' : 'audio-play';
    return `<section class="review-audio" data-review-audio data-audio-phase="${escapeHtml(snapshot.phase)}">
      <div class="review-audio__orb" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="review-audio__copy">
        ${title ? `<strong>${escapeHtml(title)}</strong>` : ''}
        ${detail ? `<small>${escapeHtml(detail)}</small>` : ''}
      </div>
      ${snapshot.phase === 'audio-playing' ? '' : (
        `<button type="button" class="review-audio__button" data-action="${action}">${escapeHtml(label)}</button>`
      )}
    </section>`;
  }

  function feedbackPanel(snapshot) {
    const feedbackBelongsToCell = transientFeedbackCellId === snapshot.currentCell?.reviewCellId;
    if ((!transientFeedback || !feedbackBelongsToCell)
      && !['supporting', 'rescue-model'].includes(snapshot.phase)) return '';
    const rescue = snapshot.phase === 'rescue-model';
    const label = rescue ? reviewCopy.rescueTitle : copy.feedback.labels.support;
    return `<aside class="review-feedback${rescue ? ' is-rescue' : ''}"
      ${rescue ? 'data-review-rescue' : 'data-review-feedback'}>
      <span class="review-feedback__star" aria-hidden="true">★</span>
      <div><strong>${escapeHtml(label)}</strong><p>${escapeHtml(transientFeedback || copy.feedback.rescueFallback)}</p></div>
    </aside>`;
  }

  function activeView(snapshot) {
    const challenge = findChallenge(snapshot.currentCell?.authoredChallengeRef);
    if (!challenge) return unavailableView();
    const responseOpen = ['awaiting-response', 'supporting'].includes(snapshot.phase);
    return `<article class="review-app" data-review-status="active" data-review-phase="${escapeHtml(snapshot.phase)}">
      <header class="review-topbar">
        <div class="review-brand"><span>${escapeHtml(reviewCopy.activeKicker)}</span><strong>${escapeHtml(unit.title)}</strong></div>
        <div class="review-run-meter" aria-label="${escapeHtml(copy.navigation.dayProgressLabel)}">
          <span>${snapshot.currentIndex + 1}${escapeHtml(reviewCopy.progressSeparator)}${snapshot.cellCount}</span>
          <i style="--review-progress:${((snapshot.currentIndex + 1) / snapshot.cellCount) * 100}%"></i>
        </div>
        ${heartGauge(snapshot)}
      </header>
      ${contextScene(snapshot)}
      <section class="review-mission" data-review-cell="${escapeHtml(snapshot.currentCell.reviewCellId)}">
        <p class="review-instruction" data-copy-purpose="task" data-copy-priority="primary">${escapeHtml(instructionFor(challenge))}</p>
        <div class="review-target" data-review-target data-visible-english>${escapeHtml(snapshot.currentCell.targetText)}</div>
        ${audioPanel(snapshot)}
        ${responseOpen ? answerGrid(snapshot, challenge) : ''}
        ${feedbackPanel(snapshot)}
      </section>
      <button class="review-defer" type="button" data-action="defer">${escapeHtml(reviewContract.deferLabel)}</button>
    </article>`;
  }

  function quietView({ status, kicker, title, detail, attribute, action }) {
    const explorer = entity('explorer-cat');
    const showExplorer = ['entry', 'completed'].includes(status);
    const quietContext = Object.values(unit.reviewContexts || {})[0] || null;
    return `<article class="review-app review-app--quiet" data-review-status="${escapeHtml(status)}"
      ${attribute} ${contextBackdropStyle(quietContext)}>
      <div class="quiet-sky" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="quiet-card">
        ${showExplorer ? picture(explorer, 'quiet-cat') : ''}
        <span class="quiet-star" aria-hidden="true">✦</span>
        ${kicker ? `<span class="quiet-kicker">${escapeHtml(kicker)}</span>` : ''}
        <h1>${escapeHtml(title)}</h1>
        ${detail ? `<p>${escapeHtml(detail)}</p>` : ''}
        ${action || ''}
      </section>
    </article>`;
  }

  function courseLink() {
    return `<a class="quiet-action" href="/poc/lesson1-2-experience/">${escapeHtml(reviewCopy.returnLabel)}</a>`;
  }

  function entryView(plan) {
    const [minimumSeconds, maximumSeconds] = reviewContract.durationSecondsRange;
    return quietView({
      status: 'entry',
      kicker: reviewCopy.entryKicker,
      title: reviewCopy.entryTitle,
      detail: reviewCopy.entryBody,
      attribute: 'data-review-entry',
      action: `<div class="quiet-meta"><span>${plan.length} ${escapeHtml(reviewCopy.itemCountSuffix)}</span><span>${escapeHtml(reviewCopy.durationPrefix)} ${minimumSeconds}–${maximumSeconds}s</span></div>
        <button class="quiet-action" type="button" data-action="start-review">${escapeHtml(reviewCopy.startLabel)}</button>`
    });
  }

  function emptyView() {
    return quietView({
      status: 'empty',
      kicker: reviewCopy.emptyKicker,
      title: reviewCopy.emptyTitle,
      detail: reviewCopy.emptyBody,
      attribute: 'data-review-empty',
      action: courseLink()
    });
  }

  function unavailableView() {
    return quietView({
      status: 'unavailable',
      kicker: reviewCopy.emptyKicker,
      title: unit.experience.saveFailure.title,
      detail: unit.experience.saveFailure.copy,
      attribute: 'data-review-unavailable',
      action: courseLink()
    });
  }

  function render(snapshot) {
    document.title = unit.experience.documentTitle;
    if (snapshot.status === 'active') root.innerHTML = activeView(snapshot);
    else if (snapshot.status === 'empty') root.innerHTML = emptyView();
    else if (snapshot.status === 'completed' || snapshot.status === 'deferred') {
      root.innerHTML = quietView({
        status: snapshot.status,
        kicker: snapshot.status === 'completed'
          ? reviewCopy.completedKicker
          : reviewCopy.deferredKicker,
        title: snapshot.status === 'completed'
          ? reviewCopy.completedTitle
          : reviewCopy.deferredTitle,
        detail: snapshot.status === 'completed'
          ? reviewCopy.completedBody
          : reviewCopy.deferredBody,
        attribute: 'data-review-finished',
        action: courseLink()
      });
    } else root.innerHTML = unavailableView();
  }

  function responseFor(challenge, kind, identifier) {
    if (kind === 'source') return { sourceRef: identifier };
    if (kind === 'entity') {
      if (challenge.answerRule?.type === 'connect-reference') {
        return { sourceRef: challenge.answerRule.sourceRef, entityId: identifier };
      }
      return { sourceRef: challenge.sourceRef, entityId: identifier };
    }
    return { contentRef: identifier };
  }

  root.addEventListener('click', event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'start-review') {
      runtime.enter();
      return;
    }
    if (action === 'defer') {
      stopAudio();
      runtime.defer();
      return;
    }
    if (action === 'audio-play') {
      reviewAction('audio/play');
      return;
    }
    if (action === 'audio-retry') {
      reviewAction('audio/retry');
      return;
    }
    if (action === 'review-remove-block' || action === 'review-reset-blocks') {
      const snapshot = runtime.snapshot();
      if (snapshot.phase !== 'awaiting-response') return;
      const selected = orderedSelections.get(snapshot.reviewChallengeRef) || [];
      orderedSelections.set(
        snapshot.reviewChallengeRef,
        action === 'review-reset-blocks'
          ? []
          : selected.filter(identifier => identifier !== event.target.closest('[data-option-id]')?.dataset.optionId)
      );
      render(snapshot);
      return;
    }
    const option = event.target.closest('[data-review-option]');
    if (!option) return;
    const snapshot = runtime.snapshot();
    if (snapshot.phase !== 'awaiting-response') return;
    const challenge = findChallenge(snapshot.currentCell.authoredChallengeRef);
    const kind = option.dataset.optionKind;
    const identifier = option.dataset.optionId;
    if (challenge.answerRule?.type === 'ordered-blocks') {
      const selected = [...(orderedSelections.get(snapshot.reviewChallengeRef) || []), identifier];
      orderedSelections.set(snapshot.reviewChallengeRef, selected);
      if (selected.length < snapshot.currentCell.candidateContentRefs.length) {
        render(snapshot);
        return;
      }
      reviewAction('response/submit', { response: { blockRefs: selected } });
      return;
    }
    reviewAction('response/submit', { response: responseFor(challenge, kind, identifier) });
  });

  runtime = core.learningReviewRuntime.create({
    unit,
    ledger,
    effectSink(effects, snapshot) {
      processEffects(effects);
      render(snapshot);
    }
  });
  globalThis.__lessonReview = Object.freeze({ runtime, ledger });
  const initialPlan = ledger.planReview({ unitId: unit.unitId });
  if (initialPlan.length === 0) {
    runtime.enter();
  } else {
    root.innerHTML = entryView(initialPlan);
  }
})();
