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

  const MUSIC_STORAGE_SUFFIX = ':music-muted';
  const MUSIC_VOLUME = 0.06;
  const MUSIC_DUCKED_VOLUME = 0.012;

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
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
      selectedFactIds: new Set(),
      selectedBlockRefs: [],
      selectedCaseByTask: {},
      feedback: null,
      resting: false,
      settingsOpen: false,
      restartConfirmOpen: false,
      previewMode: false,
      previewTargetId: null,
      previewReturnStarted: false,
      voice: null,
      music: null,
      musicMuted: true
    };

    try {
      const savedMusicPreference = global.localStorage.getItem(`${storageKey}${MUSIC_STORAGE_SUFFIX}`);
      ui.musicMuted = savedMusicPreference === null ? true : savedMusicPreference === 'true';
    } catch {
      ui.musicMuted = true;
    }

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
      if (kind === 'select-one') return '这句话正合适！';
      if (['place-in-slot', 'ordered-blocks'].includes(kind)) return '问句排好了！';
      if (kind === 'all-of') return '都点亮了！';
      if (kind === 'source-reveal') return '标签收好了！';
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
      ui.selectedFactIds = new Set();
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
      if (ui.music) ui.music.volume = ui.musicMuted ? 0 : MUSIC_VOLUME;
    }

    function ensureMusic() {
      const src = unit.experience?.ambientAudioSrc;
      if (!src || ui.music || ui.musicMuted) return;
      const music = new global.Audio(src);
      music.loop = true;
      music.preload = 'auto';
      music.volume = MUSIC_VOLUME;
      ui.music = music;
      const started = music.play();
      if (started && typeof started.catch === 'function') started.catch(() => {});
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
        finished: false
      };
      ui.voice = session;
      if (ui.music) ui.music.volume = ui.musicMuted ? 0 : MUSIC_DUCKED_VOLUME;

      function finish(type, reason) {
        if (session.finished) return;
        session.finished = true;
        if (ui.voice === session) ui.voice = null;
        if (ui.music) ui.music.volume = ui.musicMuted ? 0 : MUSIC_VOLUME;
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
      ui.selectedFactIds = new Set();
      ui.selectedBlockRefs = [];
      if (snapshot.phase !== 'completed') ui.feedback = null;
    }

    function entityVisual(entityId, { compact = false } = {}) {
      const item = entity(entityId);
      const visual = item.assetSrc
        ? `<img src="${escapeHtml(item.assetSrc)}" alt="">`
        : `<span aria-hidden="true">${escapeHtml(item.symbol || '✦')}</span>`;
      return `<span class="entity-visual${compact ? ' entity-visual--compact' : ''}" data-visual-type="${escapeHtml(item.visualType)}">${visual}</span>`;
    }

    function choiceButton({ action, value, label, selected, visual = '', extra = '' }) {
      return `<button class="choice-token${selected ? ' is-selected' : ''}" type="button" data-action="${escapeHtml(action)}" data-value="${escapeHtml(value)}" ${extra} aria-pressed="${selected ? 'true' : 'false'}">${visual}<strong>${escapeHtml(label)}</strong></button>`;
    }

    function hearts(snapshot, step) {
      if (!Array.isArray(step?.support) || step.support.length === 0) return '';
      return `<div class="heart-row" aria-label="还有 ${snapshot.heartsRemaining} 颗尝试心">
        ${[0, 1, 2].map(index => `<span class="${index < snapshot.heartsRemaining ? 'is-full' : ''}" aria-hidden="true">♥</span>`).join('')}
      </div>`;
    }

    function dialogueAudioPanel(snapshot, step) {
      const refs = step.audioSourceRefs || [];
      const isPlaying = snapshot.phase === 'audio-playing';
      const currentIndex = isPlaying ? (snapshot.audio?.segmentIndex || 0) : -1;
      const lines = refs.map((refId, index) => {
        const item = source(refId) || {};
        const stateClass = index === currentIndex
          ? ' is-current'
          : (index < currentIndex ? ' is-heard' : '');
        return `<li class="dialogue-line${stateClass}" data-speaker="${escapeHtml(item.speaker || 'speaker')}" ${index === currentIndex ? 'aria-current="true"' : ''}>
          <span class="dialogue-line__speaker" aria-hidden="true"></span>
          <span class="dialogue-line__text">${escapeHtml(item.text || '')}</span>
        </li>`;
      }).join('');
      return `<section class="dialogue-listen" aria-label="课文听读">
        <ol class="dialogue-script">${lines}</ol>
        <div class="dialogue-player">
          <button class="story-listen-button" type="button" data-action="audio-play" ${isPlaying ? 'aria-label="从第一句重新听课文"' : ''}>
            <span aria-hidden="true">${isPlaying ? '↺' : '▶'}</span>
            <strong>${isPlaying ? '从头重听' : '播放课文'}</strong>
          </button>
          <small role="status">${isPlaying ? `正在听 ${currentIndex + 1} / ${refs.length}` : '看着课文听一遍'}</small>
        </div>
      </section>`;
    }

    function audioPanel(snapshot, step) {
      if (step?.kind === 'audio-sequence' && step.textVisibility === 'visible-during-listen') {
        return dialogueAudioPanel(snapshot, step);
      }
      const isPlaying = snapshot.phase === 'audio-playing';
      const clipNumber = isPlaying ? (snapshot.audio?.segmentIndex || 0) + 1 : 0;
      const total = snapshot.audio?.refs?.length || 0;
      return `<div class="listening-orb ${isPlaying ? 'is-playing' : ''}">
        <div class="listening-orb__rings" aria-hidden="true"><i></i><i></i><i></i></div>
        <button class="listen-button" type="button" data-action="audio-play" ${isPlaying ? 'aria-label="重新从这段开始听"' : ''}>
          <span aria-hidden="true">${isPlaying ? '♫' : '▶'}</span>
          <strong>${isPlaying ? '正在听' : '听一听'}</strong>
        </button>
        ${isPlaying && total > 1
          ? `<small>${clipNumber} / ${total}</small>`
          : `<small>${snapshot.audio?.purpose === 'feedback' ? '听听这个词' : '听完就继续'}</small>`}
      </div>`;
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
      return `${showForm ? `<div class="word-plaque">${escapeHtml(source(challengeRef)?.text || '')}</div>` : '<div class="sound-clue"><span aria-hidden="true">♫</span><strong>刚才听到的是哪个物品？</strong></div>'}
        <div class="prop-shelf" data-response-kind="match">
          ${step.optionEntityIds.map(entityId => choiceButton({
            action: 'select-entity', value: entityId, label: entity(entityId).title,
            selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId)
          })).join('')}
        </div>
        ${submitButton(Boolean(ui.selectedEntityId), '就是它')}`;
    }

    function selectOneResponse(step) {
      return `<div class="speech-choice-grid" data-response-kind="select-one">
        ${step.optionSourceRefs.map(sourceRef => choiceButton({
          action: 'select-source', value: sourceRef, label: source(sourceRef)?.text || '',
          selected: ui.selectedSourceRef === sourceRef,
          visual: '<span class="speech-mark" aria-hidden="true">“</span>'
        })).join('')}
      </div>${submitButton(Boolean(ui.selectedSourceRef), '就说这句')}`;
    }

    function actionSubmitLabel(step) {
      const action = step.answerRule?.action;
      if (['give', 'give-selected'].includes(action)) return '交给对方';
      if (action === 'receive') return '接过来';
      if (action === 'stamp') return '盖下印章';
      if (action === 'pull') return '拉下拉杆';
      return '完成';
    }

    function actionResponse(snapshot, step) {
      const storedCase = ui.selectedCaseByTask[snapshot.microtaskId];
      const itemIds = step.answerRule.entityFactId && storedCase
        ? [storedCase]
        : (step.entityIds || []);
      const targetIds = step.targetEntityIds || [];
      return `<div class="action-stage" data-response-kind="perform-action">
        <div class="action-stage__rail"><span>选物品</span>${itemIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId, { compact: true })
        })).join('')}</div>
        <span class="action-arrow" aria-hidden="true">➜</span>
        <div class="action-stage__rail"><span>选位置</span>${targetIds.map(entityId => choiceButton({
          action: 'select-target', value: entityId, label: entity(entityId).title,
          selected: ui.selectedTargetId === entityId, visual: entityVisual(entityId, { compact: true })
        })).join('')}</div>
      </div>${submitButton(
        Boolean(ui.selectedEntityId && ui.selectedTargetId),
        actionSubmitLabel(step)
      )}`;
    }

    function slotResponse(step) {
      const optionEntityIds = step.optionEntityIds || step.entityIds || [];
      return `<div class="slot-stage" data-response-kind="place-in-slot">
        <div class="prop-shelf">${optionEntityIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId)
        })).join('')}</div>
        <div class="sentence-slot"><span>完整问句</span><strong>${ui.selectedEntityId ? escapeHtml(entity(ui.selectedEntityId).title) : '点一个物品放进来'}</strong></div>
      </div>${submitButton(Boolean(ui.selectedEntityId), '放进问句')}`;
    }

    function caseResponse(step) {
      return `<div class="case-window" data-response-kind="select-case">
        ${step.optionEntityIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId)
        })).join('')}
      </div>${submitButton(Boolean(ui.selectedEntityId), '就选这份')}`;
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
          selected: ui.selectedBlockRefs.includes(refId), visual: '<span class="block-pin" aria-hidden="true">●</span>'
        })).join('')}</div>
      </div>${submitButton(ui.selectedBlockRefs.length === available.length, '排好问句')}`;
    }

    function allOfResponse(step) {
      const itemLabel = step.stepId === 'L02-M07:S01' ? '认领记录' : '案件线索';
      return `<div class="fact-console" data-response-kind="all-of">
        ${step.factIds.map((factId, index) => choiceButton({
          action: 'toggle-fact', value: factId, label: `${itemLabel} ${index + 1}`,
          selected: ui.selectedFactIds.has(factId), visual: '<span class="case-light" aria-hidden="true">✦</span>'
        })).join('')}
      </div>${submitButton(ui.selectedFactIds.size === step.factIds.length, '全部点亮')}`;
    }

    function sourceRevealResponse(step) {
      const item = source(step.sourceRef) || {};
      return `<div class="source-label-reveal" data-response-kind="source-reveal">
        <span aria-hidden="true">✦</span>
        <small>黄铜物品签</small>
        <strong>${escapeHtml(item.text || '')}</strong>
        <button class="commit-action" type="button" data-action="response-submit">收好标签<span aria-hidden="true">➜</span></button>
      </div>`;
    }

    function submitButton(enabled, label = '确认') {
      return `<button class="commit-action" type="button" data-action="response-submit" ${enabled ? '' : 'disabled'}>${escapeHtml(label)}<span aria-hidden="true">✦</span></button>`;
    }

    function responsePanel(snapshot, step) {
      if (step.kind === 'explore-batch') return exploreResponse(snapshot, step);
      if (['match-entity', 'match-entity-batch'].includes(step.kind)) return matchResponse(snapshot, step);
      if (step.kind === 'select-one') return selectOneResponse(step);
      if (step.kind === 'perform-action') return actionResponse(snapshot, step);
      if (step.kind === 'place-in-slot') return slotResponse(step);
      if (step.kind === 'select-case') return caseResponse(step);
      if (step.kind === 'ordered-blocks') return orderedBlocksResponse(snapshot, step);
      if (step.kind === 'all-of') return allOfResponse(step);
      if (step.kind === 'source-reveal') return sourceRevealResponse(step);
      return '';
    }

    function feedbackMarkup() {
      if (!ui.feedback) return '';
      const cat = unit.entities?.['cat-guide'];
      const image = ui.feedback.tone === 'partner' && cat?.assetSrc
        ? `<img src="${escapeHtml(cat.assetSrc)}" alt="">`
        : `<span aria-hidden="true">${ui.feedback.tone === 'correct' ? '★' : '✦'}</span>`;
      return `<aside class="feedback-bubble" data-tone="${escapeHtml(ui.feedback.tone)}" role="status" aria-live="polite">${image}<p>${escapeHtml(ui.feedback.message)}</p></aside>`;
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
                <span aria-hidden="true">↩</span><span><strong>退出阶段预览</strong><small>回到原来的学习位置</small></span>
              </button>`
            : `<button class="restart-control" type="button" data-action="restart-request">
                <span aria-hidden="true">↺</span><span><strong>重新开始本单元</strong><small>回到学习起点</small></span>
              </button>`}
        </aside>` : '';
      const restartConfirm = ui.restartConfirmOpen ? `<div class="restart-backdrop">
          <section class="restart-dialog" role="dialog" aria-modal="true" aria-labelledby="restart-dialog-title" aria-describedby="restart-dialog-copy">
            <span class="restart-seal" aria-hidden="true">↺</span>
            <p class="kicker">课程设置</p>
            <h2 id="restart-dialog-title">要重新开始吗？</h2>
            <p id="restart-dialog-copy">已经保存的学习进度会清除，并回到本单元起点。背景音乐设置会保留。</p>
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
            <button class="music-toggle" type="button" data-action="toggle-music" aria-pressed="${ui.musicMuted ? 'true' : 'false'}" aria-label="${ui.musicMuted ? '打开背景音乐' : '关闭背景音乐'}"><span aria-hidden="true">${ui.musicMuted ? '🔇' : '🎵'}</span></button>
            <button class="settings-toggle" type="button" data-action="toggle-settings" aria-expanded="${ui.settingsOpen ? 'true' : 'false'}" aria-controls="course-settings-panel" aria-label="课程设置"><span aria-hidden="true">⚙</span></button>
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
        <button class="door-handle" type="button" data-action="start">${escapeHtml(resumed ? '继续今天的案件' : arrival.actionLabel)}<span aria-hidden="true">➜</span></button>
      </div>`, snapshot);
    }

    function missionMarkup(snapshot, authored) {
      const { task } = authored;
      const step = currentStep(snapshot);
      resetStepSelections(snapshot);
      const body = snapshot.phase === 'audio-fallback'
        ? fallbackPanel(snapshot)
        : (['audio-ready', 'audio-playing'].includes(snapshot.phase)
            ? audioPanel(snapshot, step)
            : responsePanel(snapshot, step));
      const personIds = [...new Set([
        ...(step?.targetEntityIds || []),
        ...((step?.kind === 'select-case') ? (step.optionEntityIds || []) : [])
      ])].filter(entityId => unit.entities?.[entityId]?.visualType?.includes('visitor')
        || ['keeper', 'child'].includes(unit.entities?.[entityId]?.visualType));
      return commonShell(`<div class="scene-heading">
          <div><p>${escapeHtml(task.presentation.stepLabel)}</p><h1>${escapeHtml(task.presentation.title)}</h1></div>
          ${hearts(snapshot, step)}
        </div>
        <div class="scene-people" aria-hidden="true">
          ${personIds.length ? personIds.map(id => entityVisual(id)).join('') : entityVisual('cat-guide')}
        </div>
        <section class="mission-console">
          <p class="mission-prompt">${escapeHtml(step?.prompt || task.presentation.prompt)}</p>
          <div class="interaction-space" data-response-fields>${body}</div>
        </section>
        ${feedbackMarkup()}`, snapshot);
    }

    function chapterMarkup(snapshot) {
      const chapter = unit.experience?.chapterStop || {};
      return commonShell(`<div class="milestone-card chapter-card">
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
      if (step.kind === 'all-of') return { factIds: [...ui.selectedFactIds] };
      if (step.kind === 'source-reveal') return { sourceRef: step.sourceRef };
      return {};
    }

    root.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button || !root.contains(button)) return;
      const action = button.dataset.action;
      const value = button.dataset.value;
      const snapshot = runtime.snapshot();
      const step = currentStep(snapshot);

      if (action === 'toggle-music') {
        ui.musicMuted = !ui.musicMuted;
        try { global.localStorage.setItem(`${storageKey}${MUSIC_STORAGE_SUFFIX}`, String(ui.musicMuted)); } catch { /* no-op */ }
        if (!ui.musicMuted) ensureMusic();
        if (ui.music) {
          ui.music.volume = ui.musicMuted
            ? 0
            : (ui.voice ? MUSIC_DUCKED_VOLUME : MUSIC_VOLUME);
        }
        render();
        return;
      }
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
        try { ui.music?.pause(); } catch { /* no-op */ }
        try { global.localStorage.removeItem(storageKey); } catch { /* no-op */ }
        global.location.reload();
        return;
      }
      if (action === 'start') {
        ensureMusic();
        ui.view = 'mission';
        runtime.enter({ entryLesson });
        processEffects();
        render();
        return;
      }
      if (action === 'audio-play') {
        ensureMusic();
        dispatch({ type: 'audio/play' });
        return;
      }
      if (action === 'audio-continue') {
        dispatch({ type: 'audio/continue-without-sound' });
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
      if (action === 'select-entity') ui.selectedEntityId = value;
      if (action === 'select-target') ui.selectedTargetId = value;
      if (action === 'select-source') ui.selectedSourceRef = value;
      if (action === 'toggle-fact') {
        if (ui.selectedFactIds.has(value)) ui.selectedFactIds.delete(value);
        else ui.selectedFactIds.add(value);
      }
      if (action === 'add-block' && !ui.selectedBlockRefs.includes(value)) ui.selectedBlockRefs.push(value);
      if (action === 'remove-block') ui.selectedBlockRefs = ui.selectedBlockRefs.filter(refId => refId !== value);
      if (['select-entity', 'select-target', 'select-source', 'toggle-fact', 'add-block', 'remove-block'].includes(action)) {
        render();
        return;
      }
      if (action === 'response-submit' && step) {
        if (step.kind === 'select-case') ui.selectedCaseByTask[snapshot.microtaskId] = ui.selectedEntityId;
        dispatch({ type: 'response/submit', response: responseFor(snapshot, step) });
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
