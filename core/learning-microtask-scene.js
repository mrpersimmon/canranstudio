(function attachLearningMicrotaskScene(root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningMicrotaskScene = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningMicrotaskSceneFactory(global) {
  'use strict';

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function uiIcon(name, className = '') {
    return `<img class="ui-icon${className ? ` ${escapeHtml(className)}` : ''}" src="/poc/lesson1-2-experience/assets/icons/${escapeHtml(name)}.svg" alt="" aria-hidden="true">`;
  }

  function learningDay() {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date());
    } catch {
      return new Date().toISOString().slice(0, 10);
    }
  }

  function mount({ root, unit, entryLesson, storageKey, dependencies } = {}) {
    if (!root || !unit || !storageKey) throw new TypeError('scene requires root, unit, and storage key');
    const { catalog, storeFactory, ledgerFactory, runtimeFactory } = dependencies || {};
    if (!catalog || !storeFactory || !ledgerFactory || !runtimeFactory) {
      throw new TypeError('scene dependencies are incomplete');
    }

    const tasks = unit.beats.flatMap(beat => (beat.microtasks || []).map(task => ({ beat, task })));
    const stagePreviewEnabled = unit.experience?.stagePreviewEnabled === true;
    const sourceIndex = Object.values(unit.lessonContent || {}).reduce((index, lesson) => {
      for (const [sourceId, source] of Object.entries(lesson.sources || {})) index[sourceId] = source;
      return index;
    }, {});
    const durableStore = storeFactory.createLocalStorageAdapter(global.localStorage);
    const durableLedger = ledgerFactory.open({
      store: durableStore,
      key: storageKey,
      catalog,
      clock: { learningDay }
    });
    let ledger = durableLedger;

    const ui = {
      view: 'arrival',
      pendingEffects: [],
      lastStepKey: null,
      selectedEntityId: null,
      selectedTargetId: null,
      selectedSourceRef: null,
      selectedBlockRefs: [],
      selectedCaseByTask: {},
      feedback: null,
      resting: false,
      settingsOpen: false,
      restartConfirmOpen: false,
      previewMode: false,
      previewTargetId: null,
      previewReturnStarted: false,
      voice: null
    };

    let runtimeSequence = 1200;
    function createRuntime(activeLedger) {
      return runtimeFactory.create({
        unit,
        ledger: activeLedger,
        seed: ++runtimeSequence,
        effectSink(effect) {
          ui.pendingEffects.push(effect);
        }
      });
    }
    let runtime = createRuntime(ledger);

    function source(sourceRef) {
      return sourceIndex[sourceRef] || null;
    }

    function content(contentRef) {
      return unit.authoredContent?.[contentRef] || null;
    }

    function entity(entityId) {
      return unit.entities?.[entityId] || {
        entityId,
        title: '目标位置',
        visualType: 'generic-target',
        symbol: '✦'
      };
    }

    function currentTask(snapshot = runtime.snapshot()) {
      return tasks.find(item => item.task.microtaskId === snapshot.microtaskId) || null;
    }

    function currentStep(snapshot = runtime.snapshot()) {
      return currentTask(snapshot)?.task.steps.find(step => step.stepId === snapshot.stepId) || null;
    }

    function stepById(stepId) {
      for (const { task } of tasks) {
        const step = task.steps.find(candidate => candidate.stepId === stepId);
        if (step) return step;
      }
      return null;
    }

    function correctFeedbackCopy(stepId) {
      const kind = stepById(stepId)?.kind;
      if (['match-entity', 'match-entity-batch'].includes(kind)) return '找对了！';
      if (kind === 'select-entity') return '找到主人了！';
      if (kind === 'select-one') return '这句话正合适！';
      if (['place-in-slot', 'ordered-blocks'].includes(kind)) return '问句排好了！';
      return '完成啦！';
    }

    function createPreviewLedger(targetMicrotaskId) {
      const target = tasks.find(item => item.task.microtaskId === targetMicrotaskId);
      if (!target) return null;
      const previewStore = storeFactory.createMemoryAdapter();
      const previewLedger = ledgerFactory.open({
        store: previewStore,
        key: `${storageKey}:preview`,
        catalog,
        clock: { learningDay }
      });
      return { ledger: previewLedger, target };
    }

    function resetSessionUi() {
      ui.pendingEffects.length = 0;
      ui.lastStepKey = null;
      ui.selectedEntityId = null;
      ui.selectedTargetId = null;
      ui.selectedSourceRef = null;
      ui.selectedBlockRefs = [];
      ui.selectedCaseByTask = {};
      ui.feedback = null;
      ui.resting = false;
      ui.settingsOpen = false;
      ui.restartConfirmOpen = false;
    }

    function replaceRuntime(nextLedger) {
      pauseVoice();
      runtime.destroy();
      resetSessionUi();
      ledger = nextLedger;
      runtime = createRuntime(ledger);
    }

    function startPreview(targetMicrotaskId) {
      if (!stagePreviewEnabled) return;
      const prepared = createPreviewLedger(targetMicrotaskId);
      if (!prepared) return;
      const returnStarted = ui.previewMode
        ? ui.previewReturnStarted
        : runtime.snapshot().status !== 'idle';
      replaceRuntime(prepared.ledger);
      ui.previewMode = true;
      ui.previewTargetId = targetMicrotaskId;
      ui.previewReturnStarted = returnStarted;
      ui.view = 'mission';
      runtime.preview({ microtaskId: prepared.target.task.microtaskId });
      processEffects();
      render();
    }

    function exitPreview() {
      if (!ui.previewMode) return;
      const returnStarted = ui.previewReturnStarted;
      replaceRuntime(durableLedger);
      ui.previewMode = false;
      ui.previewTargetId = null;
      ui.previewReturnStarted = false;
      ui.view = returnStarted ? 'mission' : 'arrival';
      if (returnStarted) {
        runtime.enter({ entryLesson });
        processEffects();
      }
      render();
    }

    function pauseVoice() {
      if (!ui.voice) return;
      ui.voice.finished = true;
      try { ui.voice.audio.pause(); } catch { /* no-op */ }
      ui.voice = null;
    }

    function dispatch(action) {
      const result = runtime.dispatch(action);
      processEffects();
      render();
      return result;
    }

    function startVoice(effect) {
      pauseVoice();
      const audio = new global.Audio(effect.audioRef.src);
      audio.preload = 'auto';
      const session = {
        audio,
        requestId: effect.requestId,
        segmentIndex: effect.segmentIndex,
        languageStarted: false,
        finished: false
      };
      ui.voice = session;

      function finish(type, reason) {
        if (session.finished) return;
        session.finished = true;
        if (ui.voice === session) ui.voice = null;
        if (type === 'ended') {
          dispatch({
            type: 'audio/ended',
            requestId: session.requestId,
            segmentIndex: session.segmentIndex
          });
        } else {
          dispatch({
            type: 'audio/failed',
            requestId: session.requestId,
            reason: reason || 'media-error'
          });
        }
      }

      function playLanguageAudio() {
        if (session.finished || session.languageStarted) return;
        session.languageStarted = true;
        audio.addEventListener('ended', () => finish('ended'), { once: true });
        audio.addEventListener('error', () => finish('failed', 'media-error'), { once: true });
        let playResult;
        try {
          playResult = audio.play();
        } catch {
          finish('failed', 'play-threw');
          return;
        }
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(() => finish('failed', 'play-rejected'));
        }
      }

      playLanguageAudio();
    }

    function processEffect(effect) {
      if (effect.type === 'audio/cancel') {
        if (ui.voice?.requestId === effect.requestId) pauseVoice();
        return;
      }
      if (effect.type === 'audio/play') {
        startVoice(effect);
        return;
      }
      if (effect.type === 'feedback/support') {
        ui.feedback = { tone: 'support', message: effect.message || '再看一看场景里的线索。' };
        return;
      }
      if (effect.type === 'feedback/partner-demo') {
        ui.feedback = { tone: 'partner', message: effect.message || '小猫换一个例子示范，这一步仍由你完成。' };
        return;
      }
      if (effect.type === 'feedback/correct') {
        ui.feedback = {
          tone: 'correct',
          message: effect.outcome === 'independent'
            ? correctFeedbackCopy(effect.stepId)
            : '你用上了好办法，继续前进。'
        };
        return;
      }
      if (effect.type === 'runtime/persistence-failed') {
        ui.feedback = { tone: 'danger', message: '这一步还没有保存，请再试一次。' };
      }
    }

    function processEffects() {
      const effects = ui.pendingEffects.splice(0);
      for (const effect of effects) processEffect(effect);
    }

    function resetStepSelections(snapshot) {
      const stepKey = `${snapshot.microtaskId || 'none'}:${snapshot.stepId || 'none'}:${snapshot.batchIndex}`;
      if (ui.lastStepKey === stepKey) return;
      ui.lastStepKey = stepKey;
      ui.selectedEntityId = null;
      ui.selectedTargetId = null;
      ui.selectedSourceRef = null;
      ui.selectedBlockRefs = [];
      if (snapshot.phase !== 'completed') ui.feedback = null;
    }

    function entityPicture(item) {
      return item.assetSrc
        ? (item.assetFallbackSrc
            ? `<picture><source srcset="${escapeHtml(item.assetSrc)}" type="image/avif"><img src="${escapeHtml(item.assetFallbackSrc)}" alt=""></picture>`
            : `<img src="${escapeHtml(item.assetSrc)}" alt="">`)
        : `<span aria-hidden="true">${escapeHtml(item.symbol || '✦')}</span>`;
    }

    function entityVisual(entityId, { compact = false } = {}) {
      const item = entity(entityId);
      const visual = entityPicture(item);
      return `<span class="entity-visual${compact ? ' entity-visual--compact' : ''}" data-entity-id="${escapeHtml(entityId)}" data-entity-kind="${escapeHtml(item.entityKind || 'prop')}" ${item.characterIdentityId ? `data-character-identity="${escapeHtml(item.characterIdentityId)}"` : ''} data-visual-type="${escapeHtml(item.visualType)}">${visual}</span>`;
    }

    function activeSpeakerRole(snapshot) {
      if (snapshot.phase !== 'audio-playing') return null;
      return snapshot.audio?.refs?.[snapshot.audio.segmentIndex || 0]?.speaker || null;
    }

    function speakerEntityId(personIds, speakerRole) {
      return personIds.find(entityId => entity(entityId).voiceRole === speakerRole) || null;
    }

    function sceneCharacter(entityId, snapshot, step) {
      const item = entity(entityId);
      const targetable = (step?.kind === 'perform-action'
        && (step.targetEntityIds || []).includes(entityId));
      const selectable = step?.kind === 'select-entity'
        && (step.optionEntityIds || []).includes(entityId);
      const interactive = targetable || selectable;
      const tag = interactive ? 'button' : 'div';
      const action = interactive
        ? ` type="button" data-action="${selectable ? 'select-entity' : 'select-target'}" data-value="${escapeHtml(entityId)}"`
        : '';
      const active = item.voiceRole && item.voiceRole === activeSpeakerRole(snapshot);
      return `<${tag} class="scene-character scene-character--${escapeHtml(item.dialogueSide || 'center')}${active ? ' is-active-speaker' : ''}"${action} data-entity-id="${escapeHtml(entityId)}" data-entity-kind="character" data-dialogue-side="${escapeHtml(item.dialogueSide || 'center')}" data-speaker-role="${escapeHtml(item.voiceRole || '')}">
        ${entityPicture(item)}
        <span class="scene-character__name">${escapeHtml(item.title)}</span>
      </${tag}>`;
    }

    function sceneCompanion(snapshot, step) {
      const item = entity('cat-guide');
      const childIsTarget = step?.kind === 'perform-action'
        && (step.targetEntityIds || []).some(entityId => entity(entityId).characterIdentityId === 'explorer-cat');
      const tag = childIsTarget ? 'button' : 'div';
      const childTargetId = (step?.targetEntityIds || [])
        .find(entityId => entity(entityId).characterIdentityId === 'explorer-cat');
      const action = childIsTarget
        ? ` type="button" data-action="select-target" data-value="${escapeHtml(childTargetId)}"`
        : '';
      return `<${tag} class="scene-companion scene-companion--featured"${action} data-entity-id="cat-guide" data-entity-kind="character" data-character-identity="explorer-cat">
        ${entityPicture(item)}
        <span class="scene-companion__name">${escapeHtml(item.title)}</span>
      </${tag}>`;
    }

    function sceneProp(entityId, step) {
      const item = entity(entityId);
      const targetable = step?.kind === 'perform-action'
        && (step.entityIds || []).includes(entityId);
      const tag = targetable ? 'button' : 'div';
      const action = targetable
        ? ` type="button" data-action="select-entity" data-value="${escapeHtml(entityId)}"`
        : '';
      return `<${tag} class="scene-prop"${action} data-entity-id="${escapeHtml(entityId)}" data-entity-kind="prop" data-visual-type="${escapeHtml(item.visualType || '')}">
        ${entityPicture(item)}
        <span class="scene-prop__name">${escapeHtml(item.title)}</span>
      </${tag}>`;
    }

    function choiceButton({ action, value, label, selected, visual = '', extra = '' }) {
      return `<button class="choice-token${selected ? ' is-selected' : ''}" type="button" data-action="${escapeHtml(action)}" data-value="${escapeHtml(value)}" ${extra} aria-pressed="${selected ? 'true' : 'false'}">${visual}<strong>${escapeHtml(label)}</strong></button>`;
    }

    function hearts(snapshot, step) {
      if (!Array.isArray(step?.support) || step.support.length === 0) return '';
      return `<div class="heart-row" aria-label="还有 ${snapshot.heartsRemaining} 颗尝试心">
        ${[0, 1, 2].map(index => `<span class="${index < snapshot.heartsRemaining ? 'is-full' : ''}" aria-hidden="true">${uiIcon('heart-fill')}</span>`).join('')}
      </div>`;
    }

    function dialogueAudioPanel(snapshot, step, personIds) {
      const refs = step.audioSourceRefs || [];
      const isPlaying = snapshot.phase === 'audio-playing';
      const currentIndex = isPlaying ? (snapshot.audio?.segmentIndex || 0) : -1;
      const lines = refs.map((refId, index) => {
        const item = source(refId) || {};
        const stateClass = index === currentIndex
          ? ' is-current'
          : (index < currentIndex ? ' is-heard' : '');
        const speakingEntityId = speakerEntityId(personIds, item.speaker);
        const speakerName = speakingEntityId ? entity(speakingEntityId).title : (item.speaker || '说话人');
        return `<li class="dialogue-line${stateClass}" data-speaker="${escapeHtml(item.speaker || 'speaker')}" data-speaker-entity="${escapeHtml(speakingEntityId || '')}" ${index === currentIndex ? 'aria-current="true"' : ''}>
          <span class="dialogue-line__speaker-name">${escapeHtml(speakerName)}</span>
          <span class="dialogue-line__text">${escapeHtml(item.text || '')}</span>
        </li>`;
      }).join('');
      return `<section class="dialogue-listen" aria-label="课文听读">
        <ol class="dialogue-script">${lines}</ol>
        <div class="dialogue-player">
          <button class="story-listen-button" type="button" data-action="audio-play" ${isPlaying ? 'aria-label="从第一句重新听课文"' : ''}>
            ${uiIcon(isPlaying ? 'arrow-counterclockwise' : 'play-fill')}
            <strong>${isPlaying ? '从头重听' : '播放课文'}</strong>
          </button>
          <small role="status">${isPlaying ? `正在听 ${currentIndex + 1} / ${refs.length}` : '看着课文听一遍'}</small>
        </div>
      </section>`;
    }

    function feedbackAudioCopy(snapshot, step) {
      if (snapshot.audio?.purpose === 'followup') {
        return step?.prompt || '接着听他们怎么说';
      }
      if (['match-entity', 'match-entity-batch'].includes(step?.kind)) {
        return step.challengeMode === 'word-form'
          ? '找对了，听听这个词'
          : '找对了，听下一个声音';
      }
      if (step?.kind === 'select-one') return '答对啦，听听这句话';
      if (['place-in-slot', 'ordered-blocks'].includes(step?.kind)) {
        return '问句排好了，听听整句';
      }
      return '答对了，接着听';
    }

    function feedbackAudioPanel(snapshot, step) {
      const activeAudio = snapshot.audio?.refs?.[snapshot.audio?.segmentIndex || 0];
      const tone = ui.feedback?.tone === 'correct' ? 'correct' : 'listen';
      return `<div class="feedback-audio-state" data-tone="${tone}" role="status" aria-live="polite">
        ${tone === 'correct'
          ? `<span class="feedback-audio-state__star" aria-hidden="true">${uiIcon('star-fill')}</span>`
          : ''}
        <div class="feedback-audio-state__copy">
          <strong class="feedback-audio-state__english" lang="en">${escapeHtml(activeAudio?.text || '')}</strong>
          <span>${escapeHtml(feedbackAudioCopy(snapshot, step))}</span>
          <small>读完会自动继续</small>
        </div>
      </div>`;
    }

    function audioItemsForStep(snapshot, step) {
      if (snapshot.audio?.refs?.length) return snapshot.audio.refs;
      if (step?.audioSourceRefs?.length) {
        return step.audioSourceRefs.map(refId => ({ refId, ...(source(refId) || {}) }));
      }
      if (step?.audioContentRefs?.length) {
        return step.audioContentRefs.map(refId => ({ refId, ...(content(refId) || {}) }));
      }
      const challengeRef = step?.challengeSourceRefs?.[snapshot.batchIndex]
        || step?.sourceRefs?.[snapshot.batchIndex];
      return challengeRef ? [{ refId: challengeRef, ...(source(challengeRef) || {}) }] : [];
    }

    function languageAudioPanel(snapshot, step) {
      const isPlaying = snapshot.phase === 'audio-playing';
      const currentIndex = isPlaying ? (snapshot.audio?.segmentIndex || 0) : -1;
      const lines = audioItemsForStep(snapshot, step).map((item, index) => (
        `<p class="language-audio-line${index === currentIndex ? ' is-current' : ''}" lang="en" ${index === currentIndex ? 'aria-current="true"' : ''}>${escapeHtml(item.text || '')}</p>`
      )).join('');
      return `<section class="language-audio-panel" aria-label="英文听读">
        <div class="language-audio-panel__text">${lines}</div>
        <button class="language-audio-play" type="button" data-action="audio-play">${isPlaying ? '重新播放英文' : '播放英文'}</button>
        <small role="status">${isPlaying ? '正在播放，英文会一直留在这里' : '看着英文听一遍'}</small>
      </section>`;
    }

    function audioPanel(snapshot, step, personIds = []) {
      if (
        snapshot.phase === 'audio-playing'
        && ['feedback', 'followup'].includes(snapshot.audio?.purpose)
      ) {
        return feedbackAudioPanel(snapshot, step);
      }
      if (step?.kind === 'audio-sequence' && step.textVisibility === 'visible-during-listen') {
        return dialogueAudioPanel(snapshot, step, personIds);
      }
      return languageAudioPanel(snapshot, step);
    }

    function fallbackPanel(snapshot) {
      const texts = (snapshot.audio?.unresolvedRefs || []).map(refId => (
        source(refId)?.text || content(refId)?.text
      )).filter(Boolean);
      return `<section class="sound-fallback" role="alert">
        <span aria-hidden="true">🎧</span>
        <div><strong>声音暂时没有播出</strong><p>${texts.map(escapeHtml).join(' &nbsp; ') || '可以看画面继续，这次不会记为听音成功。'}</p></div>
        <button type="button" data-action="audio-continue">看画面继续</button>
      </section>`;
    }

    function exploreResponse(snapshot, step) {
      const activeSourceRef = step.sourceRefs[snapshot.batchIndex];
      const activeEntityId = step.entityIds[snapshot.batchIndex];
      return `<div class="prop-shelf" data-response-kind="explore">
        ${step.entityIds.map(entityId => choiceButton({
          action: 'explore',
          value: entityId,
          label: entity(entityId).title,
          selected: entityId === activeEntityId,
          visual: entityVisual(entityId),
          extra: `data-source-ref="${escapeHtml(activeSourceRef)}"`
        })).join('')}
      </div><p class="gentle-hint">找到发光的物品，点它听声音</p>`;
    }

    function matchResponse(snapshot, step) {
      const challengeRef = step.challengeSourceRefs[snapshot.batchIndex];
      const showForm = step.challengeMode === 'word-form';
      return `<div class="word-plaque" lang="en">${escapeHtml(source(challengeRef)?.text || '')}</div>
        ${showForm ? '' : '<p class="sound-clue"><strong>刚才听到的是哪个物品？</strong></p>'}
        <div class="prop-shelf" data-response-kind="match">
          ${step.optionEntityIds.map(entityId => choiceButton({
            action: 'select-entity', value: entityId, label: entity(entityId).title,
            selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId)
          })).join('')}
        </div>`;
    }

    function selectOneResponse(step) {
      return `<div class="speech-choice-grid" data-response-kind="select-one">
        ${step.optionSourceRefs.map(sourceRef => choiceButton({
          action: 'select-source', value: sourceRef, label: source(sourceRef)?.text || '',
          selected: ui.selectedSourceRef === sourceRef,
          visual: '<span class="speech-mark" aria-hidden="true">“</span>'
        })).join('')}
      </div>`;
    }

    function actionSubmitLabel(step) {
      const action = step.answerRule?.action;
      if (['give', 'give-selected'].includes(action)) return '交给对方';
      if (action === 'receive') return '接过来';
      if (action === 'stamp') return '盖下印章';
      if (action === 'pull') return '拉下拉杆';
      return '完成';
    }

    function actionResponse(snapshot, step, sceneEntityIds = []) {
      const storedCase = ui.selectedCaseByTask[snapshot.microtaskId];
      const itemIds = step.answerRule.entityFactId && storedCase
        ? [storedCase]
        : (step.entityIds || []).filter(entityId => !sceneEntityIds.includes(entityId));
      if (['stamp', 'pull'].includes(step.answerRule.action)) {
        return `<button class="milestone-action" type="button" data-action="perform-direct">${escapeHtml(actionSubmitLabel(step))}</button>`;
      }
      const targetIds = (step.targetEntityIds || [])
        .filter(entityId => entity(entityId).entityKind !== 'character');
      return `<div class="action-stage" data-response-kind="perform-action">
        ${itemIds.length ? `<div class="action-stage__rail"><span>选物品</span>${itemIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId, { compact: true })
        })).join('')}</div>` : '<p class="action-stage__hint">点柜台上的物品，再点场景中的人物</p>'}
        ${targetIds.length ? `<span class="action-arrow" aria-hidden="true">${uiIcon('arrow-right')}</span>` : ''}
        ${targetIds.length ? `<div class="action-stage__rail"><span>选位置</span>${targetIds.map(entityId => choiceButton({
          action: 'select-target', value: entityId, label: entity(entityId).title,
          selected: ui.selectedTargetId === entityId, visual: entityVisual(entityId, { compact: true })
        })).join('')}</div>` : (itemIds.length ? '<p class="action-stage__hint">再点场景中的人物</p>' : '')}
      </div>`;
    }

    function slotResponse(step) {
      const optionEntityIds = step.optionEntityIds || step.entityIds || [];
      return `<div class="slot-stage" data-response-kind="place-in-slot">
        <div class="prop-shelf">${optionEntityIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId)
        })).join('')}</div>
        <div class="sentence-slot"><span>完整问句</span><strong>${ui.selectedEntityId ? escapeHtml(entity(ui.selectedEntityId).title) : '点一个物品放进来'}</strong></div>
      </div>`;
    }

    function caseResponse(step) {
      return `<div class="case-window" data-response-kind="select-case">
        ${step.optionEntityIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId)
        })).join('')}
      </div>`;
    }

    function entityChoiceResponse() {
      return '<div class="action-stage"><p class="action-stage__hint">点场景中的人物</p></div>';
    }

    function orderedBlocksResponse(snapshot, step) {
      const selectedCase = ui.selectedCaseByTask[snapshot.microtaskId];
      const nounRef = entity(selectedCase).sourceRef;
      const available = [...(step.blockContentRefs || []), nounRef].filter(Boolean);
      return `<div class="block-builder" data-response-kind="ordered-blocks">
        <div class="block-builder__track">${ui.selectedBlockRefs.length
          ? ui.selectedBlockRefs.map(refId => `<button type="button" data-action="remove-block" data-value="${escapeHtml(refId)}">${escapeHtml(content(refId)?.text || source(refId)?.text || '')}</button>`).join('')
          : '<span>按顺序点两块词语</span>'}</div>
        <div class="block-builder__bank">${available.map(refId => choiceButton({
          action: 'add-block', value: refId, label: content(refId)?.text || source(refId)?.text || '',
          selected: ui.selectedBlockRefs.includes(refId)
        })).join('')}</div>
      </div>`;
    }

    function responsePanel(snapshot, step, sceneEntityIds = []) {
      if (step.kind === 'explore-batch') return exploreResponse(snapshot, step);
      if (['match-entity', 'match-entity-batch'].includes(step.kind)) return matchResponse(snapshot, step);
      if (step.kind === 'select-one') return selectOneResponse(step);
      if (step.kind === 'select-entity') return entityChoiceResponse();
      if (step.kind === 'perform-action') return actionResponse(snapshot, step, sceneEntityIds);
      if (step.kind === 'place-in-slot') return slotResponse(step);
      if (step.kind === 'select-case') return caseResponse(step);
      if (step.kind === 'ordered-blocks') return orderedBlocksResponse(snapshot, step);
      return '';
    }

    function feedbackMarkup(snapshot, step) {
      if (!ui.feedback) return '';
      if (ui.feedback.tone === 'support') {
        return `<aside class="feedback-mission-bar" data-tone="support" role="status" aria-live="polite">
          ${hearts(snapshot, step)}
          <p>${escapeHtml(ui.feedback.message)}</p>
        </aside>`;
      }
      const cat = unit.entities?.['cat-guide'];
      const labels = {
        support: '星灯提示',
        partner: '小猫来帮忙',
        correct: '线索找到了',
        danger: '保存提醒'
      };
      const emblem = ui.feedback.tone === 'partner' && cat?.assetSrc
        ? `<span class="feedback-bubble__guide" aria-hidden="true"><img src="${escapeHtml(cat.assetSrc)}" alt=""></span>`
        : '<span class="feedback-bubble__seal" aria-hidden="true"></span>';
      return `<aside class="feedback-bubble" data-tone="${escapeHtml(ui.feedback.tone)}" role="status" aria-live="polite">
        ${emblem}
        <div class="feedback-bubble__copy"><strong>${escapeHtml(labels[ui.feedback.tone] || '星灯提示')}</strong><p>${escapeHtml(ui.feedback.message)}</p></div>
      </aside>`;
    }

    function milestoneCompanion(label) {
      const item = entity('cat-guide');
      return `<div class="milestone-companion" data-character-identity="explorer-cat" role="img" aria-label="${escapeHtml(label)}">
        ${entityPicture(item)}
      </div>`;
    }

    function commonShell(body, snapshot) {
      const taskIndex = Math.max(0, tasks.findIndex(item => item.task.microtaskId === snapshot.microtaskId));
      const completed = ledger.read().units?.[unit.unitId]?.completedMicrotaskIds?.length || 0;
      const progress = snapshot.status === 'unit-built'
        ? 100
        : Math.round(((ui.previewMode ? taskIndex + 1 : completed) / tasks.length) * 100);
      const shownPosition = snapshot.status === 'unit-built'
        ? tasks.length
        : (snapshot.microtaskId ? taskIndex + 1 : completed);
      const backgroundInactive = ui.restartConfirmOpen ? ' inert aria-hidden="true"' : '';
      const highlightedPreviewId = ui.previewMode
        ? (snapshot.microtaskId || ui.previewTargetId)
        : null;
      const stageButtons = tasks.map(({ task }, index) => (
        `<button class="stage-jump-button${task.microtaskId === highlightedPreviewId ? ' is-current' : ''}" type="button" data-action="preview-jump" data-value="${escapeHtml(task.microtaskId)}" aria-label="阶段 ${index + 1}：${escapeHtml(task.presentation.title)}" ${task.microtaskId === highlightedPreviewId ? 'aria-current="true"' : ''}>
          <b>${index + 1}</b><span>${escapeHtml(task.presentation.title)}</span>
        </button>`
      )).join('');
      const settings = ui.settingsOpen ? `<aside class="settings-tray${stagePreviewEnabled ? ' settings-tray--stages' : ''}" id="course-settings-panel" aria-label="课程设置">
          ${stagePreviewEnabled
            ? `<div class="settings-tray__heading"><strong>阶段导航</strong><small>预览不会保存学习进度</small></div>
               <div class="stage-jump-grid" role="group" aria-label="跳转到阶段">${stageButtons}</div>`
            : ''}
          ${ui.previewMode
            ? `<button class="restart-control preview-exit-control" type="button" data-action="preview-exit">
                <span aria-hidden="true">${uiIcon('arrow-counterclockwise')}</span><span><strong>退出阶段预览</strong><small>回到原来的学习位置</small></span>
              </button>`
            : `<button class="restart-control" type="button" data-action="restart-request">
                <span aria-hidden="true">${uiIcon('arrow-counterclockwise')}</span><span><strong>重新开始本单元</strong><small>回到学习起点</small></span>
              </button>`}
        </aside>` : '';
      const restartConfirm = ui.restartConfirmOpen ? `<div class="restart-backdrop">
          <section class="restart-dialog" role="dialog" aria-modal="true" aria-labelledby="restart-dialog-title" aria-describedby="restart-dialog-copy">
            <span class="restart-seal" aria-hidden="true">${uiIcon('arrow-counterclockwise')}</span>
            <p class="kicker">课程设置</p>
            <h2 id="restart-dialog-title">要重新开始吗？</h2>
            <p id="restart-dialog-copy">已经保存的学习进度会清除，并回到本单元起点。</p>
            <div class="restart-dialog__actions">
              <button class="restart-cancel" type="button" data-action="restart-cancel">继续学习</button>
              <button class="restart-confirm" type="button" data-action="restart-confirm">确认重新开始</button>
            </div>
          </section>
        </div>` : '';
      return `<div class="station-app" data-view="${escapeHtml(ui.view)}" data-preview-mode="${ui.previewMode ? 'true' : 'false'}" data-runtime-status="${escapeHtml(snapshot.status)}" data-runtime-phase="${escapeHtml(snapshot.phase || 'none')}" data-runtime-microtask="${escapeHtml(snapshot.microtaskId || 'none')}" data-runtime-step="${escapeHtml(snapshot.stepId || 'none')}" data-runtime-challenge="${escapeHtml(snapshot.challengeRef || 'none')}" data-build-stage="${snapshot.buildStage || 0}">
        <header class="station-header"${backgroundInactive}>
          <div class="station-brand"><span>${escapeHtml(unit.experience?.lessonLabel || '')}</span><strong>${escapeHtml(unit.title)}</strong></div>
          <div class="case-progress" aria-label="${ui.previewMode ? '预览阶段位置' : '当日学习进度'}"><span style="--progress:${progress}%"></span><b>${shownPosition} / ${tasks.length}</b></div>
          <div class="header-actions">
            <button class="settings-toggle" type="button" data-action="toggle-settings" aria-expanded="${ui.settingsOpen ? 'true' : 'false'}" aria-controls="course-settings-panel" aria-label="课程设置">${uiIcon('gear-fill')}</button>
          </div>
          ${ui.previewMode ? '<span class="preview-mode-badge" role="status">阶段预览 · 不保存</span>' : ''}
          ${settings}
        </header>
        <section class="station-world"${backgroundInactive}>${body}</section>
        ${restartConfirm}
      </div>`;
    }

    function arrivalMarkup(snapshot) {
      const arrival = unit.experience?.arrival || {};
      const durable = ledger.read().units?.[unit.unitId];
      const resumed = Boolean(durable?.checkpoint);
      return commonShell(`<div class="arrival-card">
        <p class="kicker">${escapeHtml(arrival.kicker)}</p>
        <h1>${escapeHtml(arrival.title)}</h1>
        <p>${escapeHtml(arrival.copy)}</p>
        <div class="arrival-seal" aria-hidden="true"><i></i><span>✦</span><i></i></div>
        <button class="door-handle" type="button" data-action="start">${escapeHtml(resumed ? '继续今天的案件' : arrival.actionLabel)}${uiIcon('arrow-right')}</button>
      </div>`, snapshot);
    }

    function briefingMarkup(snapshot) {
      const briefing = unit.experience?.briefing || {};
      return commonShell(`<article class="briefing-card" aria-labelledby="briefing-title">
        <figure class="briefing-visual">
          <picture>
            <source srcset="${escapeHtml(briefing.imageSrc || '')}" type="image/avif">
            <img src="${escapeHtml(briefing.imageFallbackSrc || briefing.imageSrc || '')}" alt="${escapeHtml(briefing.imageAlt || '')}">
          </picture>
        </figure>
        <div class="briefing-copy">
          <p class="kicker">${escapeHtml(briefing.kicker)}</p>
          <h1 id="briefing-title">${escapeHtml(briefing.title)}</h1>
          <p>${escapeHtml(briefing.copy)}</p>
          <button class="door-handle" type="button" data-action="start">${escapeHtml(briefing.actionLabel)}${uiIcon('arrow-right')}</button>
        </div>
      </article>`, snapshot);
    }

    function missionMarkup(snapshot, authored) {
      const { task } = authored;
      const step = currentStep(snapshot);
      resetStepSelections(snapshot);
      const personIds = [...new Set([
        ...(task.presentation?.characterEntityIds || []),
        ...(step?.characterEntityIds || []),
        ...(step?.targetEntityIds || []),
        ...((['select-case', 'select-entity'].includes(step?.kind)) ? (step.optionEntityIds || []) : [])
      ])].filter(entityId => unit.entities?.[entityId]?.entityKind === 'character');
      const showSceneCompanion = personIds.some(entityId => (
        entity(entityId).characterIdentityId === 'explorer-cat'
      ));
      const seenCharacterIdentities = new Set(['explorer-cat']);
      const adultEntityIds = personIds.filter(entityId => {
        const identityId = entity(entityId).characterIdentityId || entityId;
        if (seenCharacterIdentities.has(identityId)) return false;
        seenCharacterIdentities.add(identityId);
        return true;
      });
      const sceneEntityIds = task.presentation?.sceneEntityIds || [];
      const body = snapshot.phase === 'audio-fallback'
        ? fallbackPanel(snapshot)
        : (['audio-ready', 'audio-playing'].includes(snapshot.phase)
            ? audioPanel(snapshot, step, adultEntityIds)
            : responsePanel(snapshot, step, sceneEntityIds));
      const supportFeedback = ui.feedback?.tone === 'support';
      const sceneOnlySupport = supportFeedback
        && step?.kind === 'select-entity'
        && sceneEntityIds.length > 0;
      const integratedCorrectFeedback = ui.feedback?.tone === 'correct'
        && ['audio-ready', 'audio-playing'].includes(snapshot.phase);
      return commonShell(`<div class="scene-heading">
          <div><p>${escapeHtml(task.presentation.stepLabel)}</p><h1>${escapeHtml(task.presentation.title)}</h1></div>
        </div>
        ${adultEntityIds.length ? `<p class="stage-prompt">${escapeHtml(step?.prompt || task.presentation.prompt)}</p>` : ''}
        <div class="scene-people scene-cast${adultEntityIds.length ? ' scene-cast--with-adults' : ''}" data-scene-mode="${escapeHtml(task.presentation.sceneMode || '')}" aria-label="故事人物">
          ${adultEntityIds.map(id => sceneCharacter(id, snapshot, step)).join('')}
          ${showSceneCompanion ? sceneCompanion(snapshot, step) : ''}
        </div>
        ${sceneEntityIds.length ? `<div class="scene-props" aria-label="故事物品">${sceneEntityIds.map(id => sceneProp(id, step)).join('')}</div>` : ''}
        <section class="mission-console${adultEntityIds.length ? ' mission-console--with-cast' : ''}${supportFeedback ? ' mission-console--support' : ''}${sceneOnlySupport ? ' mission-console--support-scene' : ''}">
          ${supportFeedback ? feedbackMarkup(snapshot, step) : hearts(snapshot, step)}
          ${supportFeedback ? '' : `<p class="mission-prompt">${escapeHtml(step?.prompt || task.presentation.prompt)}</p>`}
          ${sceneOnlySupport ? '' : `<div class="interaction-space" data-response-fields>${body}</div>`}
          ${supportFeedback || integratedCorrectFeedback ? '' : feedbackMarkup(snapshot, step)}
        </section>`, snapshot);
    }

    function chapterMarkup(snapshot) {
      const chapter = unit.experience?.chapterStop || {};
      return commonShell(`<div class="milestone-card chapter-card">
        ${milestoneCompanion('探险小猫和你一起庆祝案件归档')}
        <div class="milestone-lamp" aria-hidden="true"><span>★</span></div>
        <p class="kicker">${escapeHtml(ui.previewMode ? '阶段预览' : chapter.kicker)}</p>
        <h1>${escapeHtml(chapter.title)}</h1>
        <p>${escapeHtml(ui.previewMode
          ? '这是章节停靠点预览，没有写入真实学习进度。'
          : (ui.resting ? '进度已经保存。可以关掉页面，下次会从整理室继续。' : chapter.copy))}</p>
        <div class="chapter-actions">
          <button class="door-handle" type="button" data-action="chapter-continue">${escapeHtml(chapter.continueLabel)}</button>
          ${ui.previewMode
            ? '<button class="quiet-action" type="button" data-action="preview-exit">退出阶段预览</button>'
            : `<button class="quiet-action" type="button" data-action="rest">${escapeHtml(chapter.restLabel)}</button>`}
        </div>
      </div>`, snapshot);
    }

    function completionMarkup(snapshot) {
      const complete = unit.experience?.completion || {};
      return commonShell(`<div class="milestone-card completion-card">
        ${milestoneCompanion('探险小猫和你一起庆祝小站开张')}
        <div class="opening-stars" aria-hidden="true"><i>✦</i><i>★</i><i>✦</i></div>
        <p class="kicker">${escapeHtml(ui.previewMode ? '阶段预览完成' : complete.kicker)}</p>
        <h1>${escapeHtml(complete.title)}</h1>
        <p>${escapeHtml(ui.previewMode ? '这段体验已经走完，可以换一个阶段继续查看。' : complete.copy)}</p>
        ${ui.previewMode
          ? '<div class="saved-landmark"><span>隔离预览</span><strong>没有写入学习进度</strong><small>退出后回到原来的稳定位置</small></div>'
          : '<div class="saved-landmark"><span>当日建设</span><strong>已安全保存</strong><small>长期掌握会在之后的回访中点亮</small></div>'}
        ${ui.previewMode
          ? '<button class="quiet-action" type="button" data-action="preview-exit">退出阶段预览</button>'
          : `<button class="quiet-action" type="button" data-action="replay">${escapeHtml(complete.replayLabel)}</button>`}
      </div>`, snapshot);
    }

    function render() {
      const snapshot = runtime.snapshot();
      global.document.title = unit.experience?.documentTitle || unit.title;
      if (ui.view === 'arrival' && snapshot.status === 'idle') {
        root.innerHTML = arrivalMarkup(snapshot);
        return;
      }
      if (ui.view === 'briefing' && snapshot.status === 'idle') {
        root.innerHTML = briefingMarkup(snapshot);
        return;
      }
      if (snapshot.status === 'chapter-stop') {
        ui.view = 'chapter';
        root.innerHTML = chapterMarkup(snapshot);
        return;
      }
      if (snapshot.status === 'unit-built') {
        ui.view = 'complete';
        root.innerHTML = completionMarkup(snapshot);
        return;
      }
      ui.view = 'mission';
      const authored = currentTask(snapshot);
      root.innerHTML = authored ? missionMarkup(snapshot, authored) : arrivalMarkup(snapshot);
    }

    function responseFor(snapshot, step) {
      if (['match-entity', 'match-entity-batch'].includes(step.kind)) {
        return { sourceRef: snapshot.challengeRef, entityId: ui.selectedEntityId };
      }
      if (step.kind === 'select-one') return { sourceRef: ui.selectedSourceRef };
      if (step.kind === 'select-entity') return { entityId: ui.selectedEntityId };
      if (step.kind === 'select-case') return { entityId: ui.selectedEntityId };
      if (step.kind === 'place-in-slot') {
        return { entityId: ui.selectedEntityId, slotId: step.answerRule.slotId };
      }
      if (step.kind === 'perform-action') {
        return {
          action: step.answerRule.action,
          entityId: ui.selectedEntityId,
          targetEntityId: ui.selectedTargetId
        };
      }
      if (step.kind === 'ordered-blocks') {
        return {
          selectedEntityId: ui.selectedCaseByTask[snapshot.microtaskId],
          blockRefs: [...ui.selectedBlockRefs]
        };
      }
      return {};
    }

    root.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button || !root.contains(button)) return;
      const action = button.dataset.action;
      const value = button.dataset.value;
      const snapshot = runtime.snapshot();
      const step = currentStep(snapshot);

      if (action === 'toggle-settings') {
        ui.settingsOpen = !ui.settingsOpen;
        render();
        return;
      }
      if (action === 'preview-jump') {
        startPreview(value);
        return;
      }
      if (action === 'preview-exit') {
        exitPreview();
        return;
      }
      if (action === 'restart-request') {
        ui.settingsOpen = false;
        ui.restartConfirmOpen = true;
        render();
        global.queueMicrotask(() => root.querySelector('[data-action="restart-cancel"]')?.focus());
        return;
      }
      if (action === 'restart-cancel') {
        ui.restartConfirmOpen = false;
        render();
        global.queueMicrotask(() => root.querySelector('[data-action="toggle-settings"]')?.focus());
        return;
      }
      if (action === 'restart-confirm') {
        pauseVoice();
        try { global.localStorage.removeItem(storageKey); } catch { /* no-op */ }
        global.location.reload();
        return;
      }
      if (action === 'start') {
        const durable = ledger.read().units?.[unit.unitId];
        if (
          ui.view === 'arrival'
          && !durable?.checkpoint
          && unit.experience?.briefing
        ) {
          ui.view = 'briefing';
          render();
          return;
        }
        ui.view = 'mission';
        runtime.enter({ entryLesson });
        processEffects();
        render();
        return;
      }
      if (action === 'audio-play') {
        dispatch({ type: 'audio/play' });
        return;
      }
      if (action === 'audio-continue') {
        dispatch({ type: 'audio/continue-without-sound' });
        return;
      }
      if (action === 'perform-direct' && step?.kind === 'perform-action') {
        ui.selectedEntityId = step.answerRule.entityId;
        ui.selectedTargetId = step.answerRule.targetEntityId;
        dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
        return;
      }
      if (action === 'explore') {
        dispatch({
          type: 'explore/activate',
          sourceRef: button.dataset.sourceRef,
          entityId: value
        });
        return;
      }
      if (action === 'select-entity') {
        ui.selectedEntityId = value;
        if (['match-entity', 'match-entity-batch'].includes(step?.kind)) {
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
        if (step?.kind === 'perform-action' && ui.selectedTargetId) {
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
        if (step?.kind === 'place-in-slot') {
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
        if (step?.kind === 'select-entity') {
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
        if (step?.kind === 'select-case') {
          ui.selectedCaseByTask[snapshot.microtaskId] = value;
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
      }
      if (action === 'select-target') {
        ui.selectedTargetId = value;
        if (step?.kind === 'perform-action' && ui.selectedEntityId) {
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
      }
      if (action === 'select-source') {
        ui.selectedSourceRef = value;
        if (step?.kind === 'select-one') {
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
      }
      if (action === 'add-block' && !ui.selectedBlockRefs.includes(value)) {
        ui.selectedBlockRefs.push(value);
        const selectedCase = ui.selectedCaseByTask[snapshot.microtaskId];
        const requiredBlockCount = step?.answerRule?.acceptedByEntityId?.[selectedCase]?.length || 0;
        if (step?.kind === 'ordered-blocks' && ui.selectedBlockRefs.length === requiredBlockCount) {
          dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
          return;
        }
      }
      if (action === 'remove-block') ui.selectedBlockRefs = ui.selectedBlockRefs.filter(refId => refId !== value);
      if (['select-entity', 'select-target', 'select-source', 'add-block', 'remove-block'].includes(action)) {
        render();
        return;
      }
      if (action === 'chapter-continue') {
        ui.resting = false;
        dispatch({ type: 'chapter/continue' });
        return;
      }
      if (action === 'rest') {
        ui.resting = true;
        render();
        return;
      }
      if (action === 'replay') {
        try { global.localStorage.removeItem(storageKey); } catch { /* no-op */ }
        global.location.reload();
      }
      if (action === 'persistence-retry') dispatch({ type: 'persistence/retry' });
    });

    global.addEventListener('pagehide', pauseVoice);
    render();
    return Object.freeze({
      destroy: () => runtime.destroy(),
      get runtime() { return runtime; },
      get ledger() { return ledger; }
    });
  }

  return Object.freeze({ mount });
});
