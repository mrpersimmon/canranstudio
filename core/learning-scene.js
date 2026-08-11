(function attachLearningScene(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningScene = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningSceneFactory() {
  'use strict';

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function localLearningDay() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function mount({
    root,
    unit,
    entryLesson,
    storageKey,
    mapReturn,
    stageAsset,
    dependencies = {},
    clock = Object.freeze({ learningDay: localLearningDay })
  } = {}) {
    if (!root || typeof root.querySelector !== 'function') {
      throw new TypeError('learning scene requires a root element');
    }
    if (!unit?.lessonIds?.includes(entryLesson)) {
      throw new TypeError('learning scene requires an authored entry lesson');
    }
    if (!storageKey || typeof storageKey !== 'string') {
      throw new TypeError('learning scene requires an isolated storage key');
    }
    if (typeof stageAsset !== 'function') {
      throw new TypeError('learning scene requires a stage asset resolver');
    }

    const document = root.ownerDocument;
    const lesson = unit.lessonContent?.[entryLesson];
    const experience = lesson?.experience;
    const {
      catalog,
      storeFactory,
      ledgerFactory,
      runtimeFactory,
      audioFactory,
      storage = root.ownerDocument.defaultView.localStorage
    } = dependencies;

    const ui = {
      arrival: root.querySelector('[data-arrival]'),
      mission: root.querySelector('[data-mission]'),
      complete: root.querySelector('[data-lesson-complete]'),
      fatal: root.querySelector('[data-fatal]'),
      start: root.querySelector('[data-start-adventure]'),
      lessonLabel: root.querySelector('[data-lesson-label]'),
      headerTitle: root.querySelector('[data-header-title]'),
      stageNumber: root.querySelector('[data-stage-number]'),
      landmarkSource: root.querySelector('[data-landmark-source]'),
      landmarkImage: root.querySelector('[data-landmark-image]'),
      arrivalKicker: root.querySelector('[data-arrival-kicker]'),
      arrivalTitle: root.querySelector('[data-arrival-title]'),
      arrivalCopy: root.querySelector('[data-arrival-copy]'),
      arrivalPromises: root.querySelector('[data-arrival-promises]'),
      missionStep: root.querySelector('[data-mission-step]'),
      missionEyebrow: root.querySelector('[data-mission-eyebrow]'),
      missionTitle: root.querySelector('[data-mission-title]'),
      missionCopy: root.querySelector('[data-mission-copy]'),
      sceneItems: root.querySelector('[data-scene-items]'),
      audioMission: root.querySelector('[data-audio-mission]'),
      audioPlay: root.querySelector('[data-audio-play]'),
      audioLabel: root.querySelector('[data-audio-label]'),
      audioSpeaker: root.querySelector('[data-audio-speaker]'),
      audioFallback: root.querySelector('[data-audio-fallback]'),
      audioFallbackCopy: root.querySelector('[data-audio-fallback-copy]'),
      modelCard: root.querySelector('[data-model-card]'),
      modelSteps: root.querySelector('[data-model-steps]'),
      feedback: root.querySelector('[data-feedback]'),
      responseDock: root.querySelector('[data-response-dock]'),
      responseHint: root.querySelector('[data-response-hint]'),
      responseFields: root.querySelector('[data-response-fields]'),
      submitResponse: root.querySelector('[data-submit-response]'),
      growth: root.querySelector('[data-growth-reveal]'),
      growthBeforeSource: root.querySelector('[data-growth-before-source]'),
      growthBefore: root.querySelector('[data-growth-before]'),
      growthAfterSource: root.querySelector('[data-growth-after-source]'),
      growthAfter: root.querySelector('[data-growth-after]'),
      growthStep: root.querySelector('[data-growth-step]'),
      growthTitle: root.querySelector('[data-growth-title]'),
      growthCopy: root.querySelector('[data-growth-copy]'),
      completeKicker: root.querySelector('[data-complete-kicker]'),
      completeTitle: root.querySelector('[data-complete-title]'),
      completeCopy: root.querySelector('[data-complete-copy]'),
      completeStage: root.querySelector('[data-complete-stage]'),
      continueLesson: root.querySelector('[data-continue-lesson]'),
      mapReturn: root.querySelector('[data-map-return]'),
      replay: root.querySelector('[data-replay]')
    };

    const ready = Boolean(
      experience
      && catalog?.getTeachingUnit
      && storeFactory?.createLocalStorageAdapter
      && ledgerFactory?.open
      && runtimeFactory?.create
      && audioFactory?.createAudioPlayer
      && Object.values(ui).every(Boolean)
    );

    let ledger = null;
    let runtime = null;
    let audioPlayer = null;
    let activeAudio = null;
    let replayGeneration = 0;
    let draft = {};
    let draftIdentity = '';
    let lastFeedback = null;
    let lastMismatchPath = null;
    let modelSteps = [];
    let pendingGrowth = null;
    let replayAudioPlaying = false;
    let destroyed = false;

    function allMicrotasks() {
      return unit.beats.flatMap(beat => beat.microtasks || []);
    }

    function currentMicrotask(snapshot) {
      return allMicrotasks().find(task => task.microtaskId === snapshot?.microtaskId) || null;
    }

    function currentContext(task, snapshot) {
      return task?.contextVariants?.[snapshot?.activeContextId]
        || task?.contextVariants?.[snapshot?.baseContextId]
        || null;
    }

    function responseKey(task, snapshot) {
      return task?.responseKeyByContext?.[snapshot?.activeContextId] || null;
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
      const normalized = Math.max(0, Math.min(5, Number(stage) || 0));
      root.dataset.buildStage = String(normalized);
      ui.stageNumber.textContent = String(normalized);
      if (!updateImage) return;
      setPicture(ui.landmarkSource, ui.landmarkImage, normalized);
      ui.landmarkImage.alt = experience.stageAlts?.[normalized]
        || `成长到第 ${normalized} 阶段的教学地标`;
    }

    function projectionStage() {
      const value = ledger?.read?.()?.units?.[unit.unitId]?.buildStage;
      return Number.isInteger(value) ? Math.min(5, Math.max(0, value)) : 0;
    }

    function showView(view) {
      root.dataset.view = view;
      ui.arrival.hidden = view !== 'arrival';
      ui.mission.hidden = view !== 'mission';
      ui.complete.hidden = view !== 'complete';
      ui.responseDock.hidden = view !== 'mission';
    }

    function setFeedback(message, tone = 'error') {
      lastFeedback = message ? { message, tone } : null;
      ui.feedback.hidden = !lastFeedback;
      ui.feedback.textContent = lastFeedback?.message || '';
      ui.feedback.dataset.tone = lastFeedback?.tone || '';
    }

    function renderModel() {
      ui.modelCard.hidden = modelSteps.length === 0;
      ui.modelSteps.replaceChildren();
      for (const step of modelSteps) {
        const item = document.createElement('li');
        item.textContent = step;
        ui.modelSteps.append(item);
      }
    }

    function renderSceneItems(items, activeSpeaker = '') {
      ui.sceneItems.replaceChildren();
      ui.sceneItems.hidden = !items?.length;
      for (const value of items || []) {
        const item = document.createElement('li');
        item.textContent = value;
        if (activeSpeaker && value === activeSpeaker) item.dataset.active = 'true';
        ui.sceneItems.append(item);
      }
    }

    function renderAudioFallback(sequence) {
      ui.audioFallbackCopy.replaceChildren();
      for (const line of sequence?.lines || []) {
        const item = document.createElement('span');
        item.className = 'audio-fallback__line';
        if (line.speaker) {
          const speaker = document.createElement('strong');
          speaker.textContent = `${line.speaker}: `;
          item.append(speaker);
        }
        item.append(document.createTextNode(line.text));
        ui.audioFallbackCopy.append(item);
      }
    }

    function ensureDraft(task, snapshot) {
      const identity = `${task.microtaskId}:${snapshot.activeContextId}`;
      if (draftIdentity === identity) return;
      draftIdentity = identity;
      draft = {};
    }

    function fieldValue(fieldId, mappingKey) {
      if (mappingKey) return draft[fieldId]?.[mappingKey];
      return draft[fieldId];
    }

    function choiceSelected(field, optionId, mappingKey) {
      const value = fieldValue(field.fieldId, mappingKey);
      if (field.kind === 'set') return Array.isArray(value) && value.includes(optionId);
      if (field.kind === 'ordered') return Array.isArray(value) && value.includes(optionId);
      return value === optionId;
    }

    function createChoiceButton(field, option, mappingKey) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'response-choice';
      button.dataset.fieldId = field.fieldId;
      button.dataset.choiceId = option.id;
      if (mappingKey) button.dataset.mappingKey = mappingKey;
      const selected = choiceSelected(field, option.id, mappingKey);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      if (selected) button.dataset.selected = 'true';
      const title = document.createElement('b');
      title.textContent = option.title;
      button.append(title);
      if (option.subtitle) {
        const subtitle = document.createElement('span');
        subtitle.textContent = option.subtitle;
        button.append(subtitle);
      }
      return button;
    }

    function renderOrderedValue(field, wrapper) {
      const values = Array.isArray(draft[field.fieldId]) ? draft[field.fieldId] : [];
      const sequence = document.createElement('div');
      sequence.className = 'response-sequence';
      sequence.setAttribute('aria-label', `${field.label} 当前顺序`);
      if (values.length === 0) {
        const empty = document.createElement('span');
        empty.textContent = '按顺序点选下方词卡';
        sequence.append(empty);
      } else {
        values.forEach((value, index) => {
          const chip = document.createElement('span');
          const title = field.options.find(option => option.id === value)?.title || value;
          chip.textContent = `${index + 1}. ${title}`;
          sequence.append(chip);
        });
        const clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'response-clear';
        clear.dataset.clearField = field.fieldId;
        clear.textContent = '清空顺序';
        sequence.append(clear);
      }
      wrapper.append(sequence);
    }

    function renderField(field) {
      const wrapper = document.createElement('fieldset');
      wrapper.className = `response-field response-field--${field.kind}`;
      wrapper.dataset.responseField = field.fieldId;
      if (lastMismatchPath?.[0] === field.fieldId) wrapper.dataset.conflict = 'true';
      const legend = document.createElement('legend');
      legend.textContent = field.label;
      wrapper.append(legend);

      if (field.kind === 'mapping') {
        for (const row of field.rows || []) {
          const rowElement = document.createElement('div');
          rowElement.className = 'response-map-row';
          if (
            lastMismatchPath?.[0] === field.fieldId
            && lastMismatchPath?.[1] === row.mappingKey
          ) {
            rowElement.dataset.conflict = 'true';
          }
          const label = document.createElement('span');
          label.textContent = row.label;
          const choices = document.createElement('div');
          choices.className = 'response-choices';
          for (const option of row.options) {
            choices.append(createChoiceButton(field, option, row.mappingKey));
          }
          rowElement.append(label, choices);
          wrapper.append(rowElement);
        }
        return wrapper;
      }

      if (field.kind === 'ordered') renderOrderedValue(field, wrapper);
      const choices = document.createElement('div');
      choices.className = 'response-choices';
      for (const option of field.options || []) choices.append(createChoiceButton(field, option));
      wrapper.append(choices);
      return wrapper;
    }

    function responseReady(key, value) {
      if (!key) return false;
      if (key.type === 'single') return typeof value === 'string' && value.length > 0;
      if (key.type === 'set') return Array.isArray(value) && value.length === (key.values || []).length;
      if (key.type === 'ordered') return Array.isArray(value) && value.length === (key.values || []).length;
      if (key.type === 'mapping') {
        return value && typeof value === 'object'
          && Object.keys(key.entries || {}).every(fieldId => typeof value[fieldId] === 'string');
      }
      if (key.type === 'composition') {
        return value && typeof value === 'object'
          && Object.entries(key.fields || {}).every(([fieldId, nested]) => (
            responseReady(nested, value[fieldId])
          ));
      }
      return false;
    }

    function submittedResponse(key) {
      if (['single', 'set', 'ordered'].includes(key?.type)) return clone(draft.response);
      return clone(draft);
    }

    function renderResponse(task, context, snapshot) {
      ensureDraft(task, snapshot);
      ui.responseFields.replaceChildren();
      for (const field of context.responseFields) ui.responseFields.append(renderField(field));
      ui.responseHint.textContent = snapshot.assistanceMode
        ? context.assistedPrompt
        : context.copy;
      ui.submitResponse.textContent = context.submitLabel;
      ui.submitResponse.disabled = replayAudioPlaying
        || snapshot.phase !== 'response'
        || !responseReady(responseKey(task, snapshot), submittedResponse(responseKey(task, snapshot)));
      ui.responseDock.hidden = snapshot.phase !== 'response';
    }

    function updateDraft(field, choiceId, mappingKey) {
      if (field.kind === 'mapping') {
        draft[field.fieldId] = { ...(draft[field.fieldId] || {}), [mappingKey]: choiceId };
        return;
      }
      if (field.kind === 'single') {
        draft[field.fieldId] = choiceId;
        return;
      }
      if (field.kind === 'set') {
        const values = Array.isArray(draft[field.fieldId]) ? [...draft[field.fieldId]] : [];
        const index = values.indexOf(choiceId);
        if (index >= 0) values.splice(index, 1);
        else values.push(choiceId);
        draft[field.fieldId] = values;
        return;
      }
      if (field.kind === 'ordered') {
        const values = Array.isArray(draft[field.fieldId]) ? [...draft[field.fieldId]] : [];
        const repeatable = field.repeatableOptionIds?.includes(choiceId);
        if (repeatable || !values.includes(choiceId)) values.push(choiceId);
        draft[field.fieldId] = values;
      }
    }

    function renderMission(snapshot, effects = []) {
      const task = currentMicrotask(snapshot);
      const context = currentContext(task, snapshot);
      if (!task || !context) return showFatal();
      const sequence = lesson.audioSequences?.[task.audioSequenceId] || null;
      const currentLine = snapshot.audio?.status === 'playing'
        ? sequence?.lines?.[snapshot.audio.segmentIndex]
        : null;
      const isAudioPlaying = snapshot.audio?.status === 'playing' || replayAudioPlaying;

      showView('mission');
      root.dataset.runtimeBeat = snapshot.beatId || 'none';
      root.dataset.runtimeMicrotask = task.microtaskId;
      root.dataset.runtimePhase = snapshot.phase || 'none';
      root.dataset.runtimeStatus = snapshot.status;
      root.dataset.supportLevel = String(snapshot.supportLevel || 0);
      root.dataset.runtimeContext = snapshot.activeContextId || 'none';
      root.dataset.assistanceMode = snapshot.assistanceMode ? 'true' : 'false';
      root.dataset.audioPlaying = isAudioPlaying ? 'true' : 'false';

      ui.missionStep.textContent = task.presentation.stepLabel;
      ui.missionEyebrow.textContent = context.eyebrow;
      ui.missionTitle.textContent = context.title;
      ui.missionCopy.textContent = context.copy;
      renderSceneItems(context.sceneItems, currentLine?.speaker);
      renderModel();

      ui.audioMission.hidden = !sequence;
      ui.audioPlay.disabled = isAudioPlaying;
      ui.audioLabel.textContent = isAudioPlaying
        ? (replayAudioPlaying
            ? '正在重播这段线索'
            : `正在播放 ${Number(snapshot.audio.segmentIndex) + 1} / ${sequence?.lines.length || 1}`)
        : (snapshot.phase === 'stimulus' ? '播放并听完整段' : '再听一次');
      ui.audioSpeaker.hidden = !currentLine?.speaker;
      ui.audioSpeaker.textContent = currentLine?.speaker || '';
      ui.audioFallback.hidden = snapshot.audio?.status !== 'failed';
      if (snapshot.audio?.status === 'failed') renderAudioFallback(sequence);
      else ui.audioFallbackCopy.replaceChildren();
      renderResponse(task, context, snapshot);

      if (effects.some(effect => effect.type === 'runtime/persistence-failed')) {
        setFeedback('这一步暂时没有保存。地标不会假装成长，请再试一次。');
      } else if (lastFeedback) {
        setFeedback(lastFeedback.message, lastFeedback.tone);
      } else {
        setFeedback('');
      }
    }

    function renderComplete() {
      const completedStage = runtime?.snapshot?.().buildStage ?? projectionStage();
      showView('complete');
      root.dataset.runtimeBeat = 'handoff';
      root.dataset.runtimeMicrotask = 'complete';
      root.dataset.runtimePhase = 'transition';
      root.dataset.runtimeStatus = 'handoff';
      root.dataset.supportLevel = '0';
      showStage(completedStage);
      ui.completeKicker.textContent = experience.completion.kicker;
      ui.completeTitle.textContent = experience.completion.title;
      ui.completeCopy.textContent = experience.completion.copy;
      ui.completeStage.textContent = String(completedStage);
      ui.continueLesson.textContent = experience.completion.primaryActionLabel;
      ui.continueLesson.href = experience.completion.primaryActionHref;
      ui.mapReturn.textContent = experience.completion.mapActionLabel;
      ui.mapReturn.href = mapReturn;
      ui.replay.textContent = experience.completion.replayActionLabel;
    }

    function showFatal() {
      ui.fatal.hidden = false;
      ui.arrival.hidden = true;
      ui.mission.hidden = true;
      ui.complete.hidden = true;
      ui.responseDock.hidden = true;
    }

    function createPersistence() {
      const store = storeFactory.createLocalStorageAdapter(storage);
      ledger = ledgerFactory.open({ store, key: storageKey, catalog, clock });
      audioPlayer = audioFactory.createAudioPlayer();
    }

    function resetTransient() {
      lastFeedback = null;
      lastMismatchPath = null;
      modelSteps = [];
      draft = {};
      draftIdentity = '';
      replayGeneration += 1;
      activeAudio?.cancel?.();
      activeAudio = null;
      replayAudioPlaying = false;
      root.dataset.audioPlaying = 'false';
    }

    function createRuntime() {
      runtime?.destroy?.();
      resetTransient();
      runtime = runtimeFactory.create({ unit, ledger, seed: 49 });
      return runtime.enter({ entryLesson });
    }

    function startAdventure() {
      const result = createRuntime();
      showStage(result.snapshot.buildStage);
      if (result.snapshot.status === 'handoff') renderComplete();
      else renderMission(result.snapshot, result.effects);
    }

    function handleAudioResult(result) {
      if (destroyed) return;
      replayAudioPlaying = false;
      for (const effect of result.effects || []) {
        if (effect.type === 'audio/preload') audioPlayer.preload({ src: effect.line.src });
      }
      const play = (result.effects || []).find(effect => effect.type === 'audio/play' && effect.line);
      if (!play) {
        if (result.snapshot.status === 'handoff') renderComplete();
        else renderMission(result.snapshot, result.effects);
        return;
      }
      renderMission(result.snapshot, result.effects);
      activeAudio = audioPlayer.play({
        text: play.line.text,
        src: play.line.src,
        rate: .87,
        onFinish: finish => {
          if (finish.reason === 'cancelled' || destroyed) return;
          const action = finish.reason === 'ended'
            ? {
                type: 'audio/ended',
                requestId: play.requestId,
                segmentIndex: play.segmentIndex
              }
            : {
                type: 'audio/failed',
                requestId: play.requestId,
                reason: finish.reason
              };
          handleAudioResult(runtime.dispatch(action));
        }
      });
    }

    function playReplayLine(sequence, index, generation) {
      if (destroyed || generation !== replayGeneration) return;
      const line = sequence.lines[index];
      if (sequence.lines[index + 1]) audioPlayer.preload({ src: sequence.lines[index + 1].src });
      activeAudio = audioPlayer.play({
        text: line.text,
        src: line.src,
        rate: .87,
        onFinish: finish => {
          if (destroyed || generation !== replayGeneration || finish.reason === 'cancelled') return;
          if (finish.reason === 'ended' && index + 1 < sequence.lines.length) {
            playReplayLine(sequence, index + 1, generation);
            return;
          }
          root.dataset.audioPlaying = 'false';
          activeAudio = null;
          replayAudioPlaying = false;
          if (finish.reason !== 'ended') {
            setFeedback('声音暂时不可用，文字线索已经保留，可以继续。');
          }
          renderMission(runtime.snapshot(), []);
        }
      });
    }

    function playMissionAudio() {
      const snapshot = runtime?.snapshot?.();
      const task = currentMicrotask(snapshot);
      const sequence = lesson.audioSequences?.[task?.audioSequenceId];
      if (!sequence || snapshot?.status !== 'active') return;
      if (snapshot.phase === 'stimulus') {
        handleAudioResult(runtime.dispatch({ type: 'audio/play' }));
        return;
      }
      replayGeneration += 1;
      audioPlayer.stop();
      replayAudioPlaying = true;
      renderMission(snapshot, []);
      playReplayLine(sequence, 0, replayGeneration);
    }

    function showGrowth(beforeStage, afterStage, task, result) {
      pendingGrowth = { afterStage, result };
      showStage(afterStage, { updateImage: false });
      setPicture(ui.growthBeforeSource, ui.growthBefore, beforeStage);
      setPicture(ui.growthAfterSource, ui.growthAfter, afterStage);
      ui.growthStep.textContent = `地标成长 ${afterStage} / 5`;
      ui.growthTitle.textContent = task.presentation.growth.title;
      ui.growthCopy.textContent = task.presentation.growth.copy;
      ui.growth.hidden = false;
      ui.growth.focus({ preventScroll: true });
    }

    function finishGrowth() {
      if (!pendingGrowth) return;
      const { afterStage, result } = pendingGrowth;
      pendingGrowth = null;
      ui.growth.hidden = true;
      showStage(afterStage);
      if (result.snapshot.status === 'handoff') renderComplete();
      else renderMission(result.snapshot, result.effects);
    }

    function applyRuntimeFeedback(result, previousTask) {
      const support = result.effects.find(effect => effect.type === 'feedback/support');
      const assisted = result.effects.find(effect => effect.type === 'feedback/assisted');
      const completed = result.effects.find(effect => effect.type === 'feedback/completed');
      if (support) {
        lastMismatchPath = clone(support.mismatchPath);
        const context = currentContext(previousTask, result.snapshot)
          || previousTask.contextVariants[result.snapshot.baseContextId];
        lastFeedback = {
          message: context.support[Math.max(0, support.level - 1)],
          tone: support.level >= 3 ? 'guide' : 'error'
        };
        modelSteps = support.level >= 3 ? [context.support[2]] : [];
      } else if (assisted) {
        lastMismatchPath = clone(assisted.mismatchPath);
        const context = currentContext(previousTask, result.snapshot);
        lastFeedback = { message: context.assistedPrompt, tone: 'guide' };
        modelSteps = [context.assistedPrompt];
      } else if (completed) {
        lastMismatchPath = null;
        lastFeedback = {
          message: previousTask.presentation.completedFeedback,
          tone: completed.completionStatus === 'completed-independent' ? 'success' : 'guide'
        };
        modelSteps = [];
      }
    }

    function submitResponse() {
      const before = runtime?.snapshot?.();
      const task = currentMicrotask(before);
      const key = responseKey(task, before);
      if (!task || before.phase !== 'response' || !responseReady(key, submittedResponse(key))) return;
      const beforeStage = before.buildStage;
      const result = runtime.dispatch({
        type: 'response/submit',
        response: submittedResponse(key)
      });
      applyRuntimeFeedback(result, task);
      const growth = result.effects.find(effect => effect.type === 'landmark/build-stage');
      if (growth && task.presentation.growth) {
        showGrowth(beforeStage, growth.buildStage, task, result);
        return;
      }
      if (result.snapshot.status === 'handoff') renderComplete();
      else renderMission(result.snapshot, result.effects);
    }

    function replay() {
      audioPlayer?.stop?.();
      runtime?.destroy?.();
      storage.removeItem(storageKey);
      createPersistence();
      resetTransient();
      showStage(0);
      root.dataset.runtimeBeat = 'none';
      root.dataset.runtimeMicrotask = 'none';
      root.dataset.runtimeStatus = 'idle';
      root.dataset.supportLevel = '0';
      ui.start.textContent = `${experience.arrival.actionLabel} →`;
      showView('arrival');
    }

    function initializeContent() {
      document.title = experience.documentTitle;
      ui.lessonLabel.textContent = experience.lessonLabel;
      ui.headerTitle.textContent = experience.headerTitle;
      ui.arrivalKicker.textContent = experience.arrival.kicker;
      ui.arrivalTitle.textContent = experience.arrival.title;
      ui.arrivalCopy.textContent = experience.arrival.copy;
      ui.arrivalPromises.replaceChildren();
      experience.arrival.promises.forEach((promise, index) => {
        const item = document.createElement('span');
        const number = document.createElement('b');
        number.textContent = String(index + 1);
        item.append(number, document.createTextNode(` ${promise}`));
        ui.arrivalPromises.append(item);
      });
      ui.start.textContent = `${experience.arrival.actionLabel} →`;
      ui.mapReturn.href = mapReturn;
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      replayGeneration += 1;
      activeAudio?.cancel?.();
      audioPlayer?.stop?.();
      runtime?.destroy?.();
    }

    ui.start.addEventListener('click', startAdventure);
    ui.audioPlay.addEventListener('click', playMissionAudio);
    ui.responseFields.addEventListener('click', event => {
      const clear = event.target.closest('button[data-clear-field]');
      if (clear) {
        draft[clear.dataset.clearField] = [];
        renderMission(runtime.snapshot(), []);
        return;
      }
      const button = event.target.closest('button[data-choice-id]');
      if (!button) return;
      const task = currentMicrotask(runtime.snapshot());
      const context = currentContext(task, runtime.snapshot());
      const field = context.responseFields.find(candidate => candidate.fieldId === button.dataset.fieldId);
      if (!field) return;
      updateDraft(field, button.dataset.choiceId, button.dataset.mappingKey);
      renderMission(runtime.snapshot(), []);
    });
    ui.submitResponse.addEventListener('click', submitResponse);
    ui.growth.addEventListener('click', finishGrowth);
    ui.replay.addEventListener('click', replay);
    root.ownerDocument.defaultView.addEventListener('pagehide', destroy, { once: true });

    if (!ready) {
      showFatal();
      return Object.freeze({ destroy });
    }

    initializeContent();
    createPersistence();
    const currentStage = projectionStage();
    showStage(currentStage);
    ui.start.textContent = currentStage > 0
      ? `继续${experience.arrival.actionLabel.replace(/^开始/, '')} →`
      : `${experience.arrival.actionLabel} →`;
    root.dataset.runtimeStatus = currentStage >= 2 ? 'handoff' : 'idle';
    root.dataset.reducedMotion = root.ownerDocument.defaultView
      .matchMedia('(prefers-reduced-motion: reduce)').matches ? 'true' : 'false';
    showView('arrival');

    return Object.freeze({ destroy });
  }

  return Object.freeze({ mount });
});
