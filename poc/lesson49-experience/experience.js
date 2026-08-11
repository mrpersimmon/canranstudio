(function lesson49Experience() {
  'use strict';

  const STORAGE_KEY = 'poc:lesson49-experience:v1';
  const MAP_RETURN = '/?district=first-book-49-60&focus=lesson49';
  const UNIT_ID = 'FLC-U01';
  const ENTRY_LESSON = 'lesson49';
  const root = document.querySelector('[data-lesson49-experience]');
  if (!root) return;

  const core = globalThis.CanranCore || {};
  const catalog = core.curriculumCatalog;
  const storeFactory = core.learningStore;
  const ledgerFactory = core.learningLedger;
  const runtimeFactory = core.learningRuntime;
  const audioFactory = core.audio;
  const unit = catalog?.getTeachingUnit?.(UNIT_ID);

  const ui = {
    arrival: document.querySelector('[data-arrival]'),
    mission: document.querySelector('[data-mission]'),
    complete: document.querySelector('[data-lesson-complete]'),
    fatal: document.querySelector('[data-fatal]'),
    start: document.querySelector('[data-start-adventure]'),
    stageNumber: document.querySelector('[data-stage-number]'),
    landmarkSource: document.querySelector('[data-landmark-source]'),
    landmarkImage: document.querySelector('[data-landmark-image]'),
    missionStep: document.querySelector('[data-mission-step]'),
    missionEyebrow: document.querySelector('[data-mission-eyebrow]'),
    missionTitle: document.querySelector('[data-mission-title]'),
    missionCopy: document.querySelector('[data-mission-copy]'),
    orderSlots: [...document.querySelectorAll('[data-order-slot]')],
    audioMission: document.querySelector('[data-audio-mission]'),
    audioPlay: document.querySelector('[data-audio-play]'),
    audioLabel: document.querySelector('[data-audio-label]'),
    audioFallback: document.querySelector('[data-audio-fallback]'),
    audioFallbackCopy: document.querySelector('[data-audio-fallback-copy]'),
    modelCard: document.querySelector('[data-model-card]'),
    modelSteps: document.querySelector('[data-model-steps]'),
    feedback: document.querySelector('[data-feedback]'),
    retry: document.querySelector('[data-retry-beat]'),
    answerDock: document.querySelector('[data-answer-dock]'),
    actionHint: document.querySelector('[data-action-hint]'),
    answerGrid: document.querySelector('[data-answer-grid]'),
    growth: document.querySelector('[data-growth-reveal]'),
    growthBeforeSource: document.querySelector('[data-growth-before-source]'),
    growthBefore: document.querySelector('[data-growth-before]'),
    growthAfterSource: document.querySelector('[data-growth-after-source]'),
    growthAfter: document.querySelector('[data-growth-after]'),
    growthStep: document.querySelector('[data-growth-step]'),
    growthTitle: document.querySelector('[data-growth-title]'),
    growthCopy: document.querySelector('[data-growth-copy]'),
    replay: document.querySelector('[data-replay]'),
    mapReturn: document.querySelector('[data-map-return]')
  };

  const ready = Boolean(
    unit?.lessonIds?.includes(ENTRY_LESSON)
    && unit.beats?.slice(0, 2).every(beat => beat.task?.presentation?.contexts)
    && storeFactory?.createLocalStorageAdapter
    && ledgerFactory?.open
    && runtimeFactory?.create
    && audioFactory?.createAudioPlayer
  );

  let store;
  let ledger;
  let runtime = null;
  let audioPlayer = null;
  let activeAudio = null;
  let currentStage = 0;
  let pendingSnapshot = null;
  let pendingEffects = [];
  let pendingStage = null;
  let lastFeedback = null;
  let lastModelSteps = [];
  let answering = false;
  let replayingAudio = false;

  function localLearningDay() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function stageAsset(stage, size, format) {
    return `/assets/adventure-map/lesson49/states/state-${stage}-${size}.${format}`;
  }

  function stageAlt(stage) {
    if (stage === 0) return '等待建设的暖灯肉铺';
    if (stage === 1) return '已经装好红白遮阳棚的暖灯肉铺';
    if (stage === 2) return '已经装好遮阳棚和新鲜展示台的暖灯肉铺';
    return `成长到第${stage}阶段的暖灯肉铺`;
  }

  function setPicture(source, image, stage) {
    source.srcset = [512, 768, 1024]
      .map(size => `${stageAsset(stage, size, 'avif')} ${size}w`)
      .join(', ');
    image.src = stageAsset(stage, 768, 'webp');
    image.srcset = [512, 768, 1024]
      .map(size => `${stageAsset(stage, size, 'webp')} ${size}w`)
      .join(', ');
  }

  function showStage(stage, { updateImage = true } = {}) {
    currentStage = stage;
    root.dataset.buildStage = String(stage);
    ui.stageNumber.textContent = String(stage);
    if (!updateImage) return;
    setPicture(ui.landmarkSource, ui.landmarkImage, stage);
    ui.landmarkImage.alt = stageAlt(stage);
  }

  function projectionStage() {
    const value = ledger?.read?.()?.units?.[UNIT_ID]?.buildStage;
    return Number.isInteger(value) ? Math.min(5, Math.max(0, value)) : 0;
  }

  function createPersistence() {
    store = storeFactory.createLocalStorageAdapter(localStorage);
    ledger = ledgerFactory.open({
      store,
      key: STORAGE_KEY,
      catalog,
      clock: Object.freeze({ learningDay: localLearningDay })
    });
    audioPlayer = audioFactory.createAudioPlayer();
    currentStage = projectionStage();
  }

  function resetTransientState() {
    lastFeedback = null;
    lastModelSteps = [];
    answering = false;
    replayingAudio = false;
    root.dataset.audioPlaying = 'false';
    activeAudio?.cancel?.();
    activeAudio = null;
  }

  function showView(view) {
    root.dataset.view = view;
    ui.arrival.hidden = view !== 'arrival';
    ui.mission.hidden = view !== 'mission';
    ui.complete.hidden = view !== 'complete';
    if (view !== 'mission') ui.answerDock.hidden = true;
  }

  function currentBeat(snapshot) {
    return unit.beats.find(beat => beat.beatId === snapshot?.beatId) || null;
  }

  function sceneFor(beat, contextId) {
    return beat?.task?.presentation?.contexts?.[contextId]
      || beat?.task?.presentation?.contexts?.[beat?.task?.contextId]
      || null;
  }

  function setFeedback(message, tone = 'error') {
    lastFeedback = message ? { message, tone } : null;
    ui.feedback.hidden = !lastFeedback;
    ui.feedback.textContent = lastFeedback?.message || '';
    ui.feedback.dataset.tone = lastFeedback?.tone || '';
  }

  function renderModel() {
    ui.modelCard.hidden = lastModelSteps.length === 0;
    ui.modelSteps.replaceChildren();
    for (const step of lastModelSteps) {
      const item = document.createElement('li');
      item.textContent = step;
      ui.modelSteps.append(item);
    }
  }

  function renderAnswers(scene, enabled) {
    ui.answerGrid.replaceChildren();
    for (const option of scene.options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.answer = option.id;
      button.disabled = !enabled;
      const title = document.createElement('b');
      title.textContent = option.title;
      const subtitle = document.createElement('span');
      subtitle.textContent = option.subtitle;
      button.append(title, subtitle);
      ui.answerGrid.append(button);
    }
  }

  function audioGateOpen(snapshot, beat) {
    if (!beat.task.presentation.audio) return true;
    return snapshot.microstepId !== 'understand-audio';
  }

  function renderMission(snapshot, effects = []) {
    const beat = currentBeat(snapshot);
    const scene = sceneFor(beat, snapshot.contextId);
    if (!beat || !scene) return showFatal();

    showView('mission');
    root.dataset.runtimeBeat = beat.beatId;
    root.dataset.runtimeStatus = snapshot.status;
    root.dataset.supportLevel = String(snapshot.supportLevel || 0);
    root.dataset.runtimeContext = snapshot.contextId || 'none';
    root.dataset.runtimeMicrostep = snapshot.microstepId || 'none';
    const audioPlaying = snapshot.audio?.status === 'playing' || replayingAudio;
    root.dataset.audioPlaying = audioPlaying ? 'true' : 'false';

    ui.missionStep.textContent = beat.task.presentation.stepLabel;
    ui.missionEyebrow.textContent = scene.eyebrow;
    ui.missionTitle.textContent = scene.title;
    ui.missionCopy.textContent = scene.copy;
    ui.actionHint.textContent = scene.hint;
    ui.orderSlots.forEach((slot, index) => { slot.textContent = scene.order[index] || '—'; });

    const audio = beat.task.presentation.audio || null;
    const gateOpen = audioGateOpen(snapshot, beat);
    ui.audioMission.hidden = !audio;
    ui.audioPlay.disabled = audioPlaying;
    ui.audioLabel.textContent = audioPlaying
      ? '正在播放完整对话'
      : (gateOpen ? '再听一次' : '播放完整对话');
    ui.audioFallback.hidden = snapshot.audio?.status !== 'failed';
    ui.audioFallbackCopy.textContent = audio?.fallbackText || '';
    ui.answerDock.hidden = !gateOpen;
    renderAnswers(scene, gateOpen && snapshot.status === 'active' && !answering);
    renderModel();

    const persistenceFailed = effects.some(effect => effect.type === 'runtime/persistence-failed');
    if (persistenceFailed) {
      setFeedback('这一步暂时没有保存。地标不会假装已经成长，请再试一次。');
    }
    if (lastFeedback) setFeedback(lastFeedback.message, lastFeedback.tone);

    const attemptEnded = snapshot.status === 'needs-review';
    ui.retry.hidden = !attemptEnded;
    if (attemptEnded) {
      ui.answerDock.hidden = true;
      setFeedback('这次先停在这里。换口气，再用同一个方法试一次。');
    }
  }

  function renderComplete() {
    showView('complete');
    root.dataset.runtimeBeat = 'handoff';
    root.dataset.runtimeStatus = 'handoff';
    root.dataset.supportLevel = '0';
    showStage(2);
    ui.mapReturn.href = MAP_RETURN;
  }

  function showFatal() {
    ui.fatal.hidden = false;
    ui.arrival.hidden = true;
    ui.mission.hidden = true;
    ui.complete.hidden = true;
    ui.answerDock.hidden = true;
  }

  function createRuntime() {
    runtime?.destroy?.();
    resetTransientState();
    runtime = runtimeFactory.create({ unit, ledger, seed: 49 });
    return runtime.enter({ entryLesson: ENTRY_LESSON });
  }

  function startAdventure() {
    const result = createRuntime();
    showStage(result.snapshot.buildStage);
    if (result.snapshot.status === 'handoff') {
      renderComplete();
      return;
    }
    renderMission(result.snapshot, result.effects);
  }

  function finishAudio(requestId, beat, lines, index, result) {
    if (runtime?.snapshot?.().audio?.requestId !== requestId) return;
    if (result.reason === 'cancelled') return;
    if (result.reason === 'ended' && index + 1 < lines.length) {
      playAudioLine(requestId, beat, lines, index + 1);
      return;
    }
    const action = result.reason === 'ended'
      ? { type: 'audio/completed', requestId }
      : { type: 'audio/failed', requestId, reason: result.reason };
    const next = runtime.dispatch(action);
    root.dataset.audioPlaying = 'false';
    activeAudio = null;
    renderMission(next.snapshot, next.effects);
  }

  function playAudioLine(requestId, beat, lines, index) {
    const line = lines[index];
    const nextLine = lines[index + 1];
    if (nextLine) audioPlayer.preload({ src: nextLine.src });
    activeAudio = audioPlayer.play({
      text: line.text,
      src: line.src,
      rate: .87,
      onFinish: result => finishAudio(requestId, beat, lines, index, result)
    });
  }

  function finishReplayAudio(beat, lines, index, result) {
    if (!replayingAudio || result.reason === 'cancelled') return;
    if (result.reason === 'ended' && index + 1 < lines.length) {
      playReplayLine(beat, lines, index + 1);
      return;
    }
    replayingAudio = false;
    activeAudio = null;
    if (result.reason !== 'ended') {
      setFeedback('声音暂时没有播放，可以直接根据屏幕上的完整对话继续。');
    }
    renderMission(runtime.snapshot(), []);
  }

  function playReplayLine(beat, lines, index) {
    const line = lines[index];
    const nextLine = lines[index + 1];
    if (nextLine) audioPlayer.preload({ src: nextLine.src });
    activeAudio = audioPlayer.play({
      text: line.text,
      src: line.src,
      rate: .87,
      onFinish: result => finishReplayAudio(beat, lines, index, result)
    });
  }

  function playMissionAudio() {
    const before = runtime?.snapshot?.();
    const beat = currentBeat(before);
    const audio = beat?.task?.presentation?.audio;
    if (!audio || before.microstepId !== 'understand-audio') {
      if (audio && before.status === 'active') {
        audioPlayer.stop();
        replayingAudio = true;
        renderMission(before, []);
        playReplayLine(beat, audio.lines, 0);
      }
      return;
    }

    const started = runtime.dispatch({ type: 'audio/play', audioId: audio.audioId });
    const requestId = started.snapshot.audio?.requestId;
    if (!requestId) return;
    root.dataset.audioPlaying = 'true';
    renderMission(started.snapshot, started.effects);
    playAudioLine(requestId, beat, audio.lines, 0);
  }

  function showGrowth(beforeStage, afterStage, growth, snapshot, effects) {
    pendingSnapshot = snapshot;
    pendingEffects = effects;
    pendingStage = afterStage;
    showStage(afterStage, { updateImage: false });
    setPicture(ui.growthBeforeSource, ui.growthBefore, beforeStage);
    setPicture(ui.growthAfterSource, ui.growthAfter, afterStage);
    ui.growthStep.textContent = `地标成长 ${afterStage} / 5`;
    ui.growthTitle.textContent = growth.title;
    ui.growthCopy.textContent = growth.copy;
    ui.growth.hidden = false;
    ui.growth.focus({ preventScroll: true });
  }

  function finishGrowth() {
    if (ui.growth.hidden || !pendingSnapshot) return;
    ui.growth.hidden = true;
    showStage(pendingStage);
    const snapshot = pendingSnapshot;
    const effects = pendingEffects;
    pendingSnapshot = null;
    pendingEffects = [];
    pendingStage = null;
    lastFeedback = null;
    lastModelSteps = [];
    if (snapshot.status === 'handoff') renderComplete();
    else renderMission(snapshot, effects);
  }

  function submitAnswer(answerId) {
    if (!runtime || answering) return;
    const before = runtime.snapshot();
    if (before.status !== 'active') return;
    const beat = currentBeat(before);
    const scene = sceneFor(beat, before.contextId);
    const beforeStage = before.buildStage;
    answering = true;
    renderAnswers(scene, false);

    const result = runtime.dispatch({ type: 'answer/submit', answerId });
    answering = false;
    const persistenceFailed = result.effects.some(effect => effect.type === 'runtime/persistence-failed');
    if (persistenceFailed) {
      setFeedback('这一步暂时没有保存。地标不会假装已经成长，请再试一次。');
      renderMission(result.snapshot, result.effects);
      return;
    }

    if (result.snapshot.buildStage > beforeStage) {
      showGrowth(
        beforeStage,
        result.snapshot.buildStage,
        beat.task.presentation.growth,
        result.snapshot,
        result.effects
      );
      return;
    }

    const support = result.effects.find(effect => effect.type === 'feedback/support');
    if (support) {
      lastFeedback = {
        message: scene.support[Math.max(0, support.level - 1)],
        tone: support.level >= 3 ? 'success' : 'error'
      };
      lastModelSteps = support.level >= 3 ? [...scene.modelSteps] : [];
    }
    renderMission(result.snapshot, result.effects);
  }

  function retryBeat() {
    const result = createRuntime();
    renderMission(result.snapshot, result.effects);
  }

  function replay() {
    audioPlayer?.stop?.();
    runtime?.destroy?.();
    localStorage.removeItem(STORAGE_KEY);
    createPersistence();
    showStage(0);
    root.dataset.runtimeBeat = 'none';
    root.dataset.runtimeStatus = 'idle';
    root.dataset.supportLevel = '0';
    ui.start.textContent = '开始冒险 →';
    showView('arrival');
  }

  ui.start.addEventListener('click', startAdventure);
  ui.audioPlay.addEventListener('click', playMissionAudio);
  ui.answerGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-answer]');
    if (button && !button.disabled) submitAnswer(button.dataset.answer);
  });
  ui.growth.addEventListener('click', finishGrowth);
  ui.retry.addEventListener('click', retryBeat);
  ui.replay.addEventListener('click', replay);
  window.addEventListener('pagehide', () => {
    audioPlayer?.stop?.();
    runtime?.destroy?.();
  }, { once: true });

  if (!ready) {
    showFatal();
    return;
  }

  createPersistence();
  showStage(currentStage);
  ui.start.textContent = currentStage > 0 ? '继续冒险 →' : '开始冒险 →';
  root.dataset.runtimeStatus = currentStage >= 2 ? 'handoff' : 'idle';
  root.dataset.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'true' : 'false';
  showView('arrival');
})();
