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

  function isAutoplayPolicyBlock(error) {
    return error?.name === 'NotAllowedError';
  }

  function uiIcon(name, className = '') {
    return `<img class="ui-icon${className ? ` ${escapeHtml(className)}` : ''}" src="/poc/lesson1-2-experience/assets/icons/${escapeHtml(name)}.svg" alt="" aria-hidden="true">`;
  }

  function imageMime(value) {
    if (/\.avif(?:\?|$)/i.test(value || '')) return 'image/avif';
    if (/\.webp(?:\?|$)/i.test(value || '')) return 'image/webp';
    if (/\.png(?:\?|$)/i.test(value || '')) return 'image/png';
    return 'image/jpeg';
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
    const {
      catalog, storeFactory, ledgerFactory, runtimeFactory, outcomePracticeFactory
    } = dependencies || {};
    if (!catalog || !storeFactory || !ledgerFactory || !runtimeFactory) {
      throw new TypeError('scene dependencies are incomplete');
    }

    const tasks = unit.beats.flatMap(beat => (beat.microtasks || []).map(task => ({ beat, task })));
    const stagePreviewEnabled = unit.experience?.stagePreviewEnabled === true;
    const uiCopy = unit.experience?.uiCopy || {};
    const feedbackCopy = uiCopy.feedback || {};
    const dialogueCopy = uiCopy.dialogue || {};
    const feedbackAudioCopybook = uiCopy.feedbackAudio || {};
    const languageAudioCopy = uiCopy.languageAudio || {};
    const interactionCopy = uiCopy.interaction || {};
    const navigationCopy = uiCopy.navigation || {};
    const stageNavigationCopy = unit.experience?.stageNavigation || {};
    const previewCopy = uiCopy.preview || {};
    const reviewRun = unit.experience?.reviewRun || {};
    const outcomePractices = unit.experience?.outcomePractices || [];
    if (outcomePractices.length > 0 && !outcomePracticeFactory?.create) {
      throw new TypeError('scene outcome practice dependency is incomplete');
    }
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

    function dueReviewAvailable() {
      try {
        return durableLedger.planReview({ unitId: unit.unitId })
          .some(cell => cell.due === true);
      } catch {
        return false;
      }
    }

    function durableResumeAvailable() {
      const stored = durableLedger.read().units?.[unit.unitId];
      if (!stored) return false;
      return Boolean(
        stored.checkpoint
        || stored.pendingUiContinuation
        || stored.unitAttemptId
        || stored.buildStage > 0
        || (Array.isArray(stored.completedMicrotaskIds)
          && stored.completedMicrotaskIds.length > 0)
        || (Array.isArray(stored.skippedMicrotaskIds)
          && stored.skippedMicrotaskIds.length > 0)
        || Object.keys(stored.rolePracticeProgress || {}).length > 0
      );
    }

    const ui = {
      view: 'mission',
      pendingEffects: [],
      lastStepKey: null,
      lastNavigationRenderKey: null,
      selectedEntityId: null,
      selectedTargetId: null,
      selectedSourceRef: null,
      selectedContentRef: null,
      selectedBlockRefs: [],
      selectedSequenceIds: [],
      selectedCaseByTask: {},
      feedback: null,
      resting: false,
      knowledgeExpanded: false,
      settingsOpen: false,
      stageMapOpen: false,
      restartConfirmOpen: false,
      roleSkipConfirmOpen: false,
      previewMode: false,
      skipRecoveryMode: false,
      previewTargetId: null,
      stageReplayOrigin: null,
      rewinding: false,
      rescueTimer: null,
      presentationCompletionKey: null,
      presentationArmGeneration: 0,
      presentationCleanup: null,
      dialogueFollowEnabled: true,
      dialogueLastFollowKey: null,
      dialogueProgrammaticScroll: false,
      freeAudioRef: null,
      practiceAudioRef: null,
      voice: null,
      voiceTimer: null,
      pendingVoiceRequestId: null,
      destroyed: false
    };

    let runtimeSequence = 1200;
    let outcomePracticeRuntime = null;
    let outcomePracticeConfig = null;
    let responsiveSceneLayoutFrame = null;
    const surfaceEntryAnimationCleanups = new Set();
    const audioPreloadCache = new Map();
    const imagePreloadCache = new Map();

    function audioCacheKey(src) {
      try { return new URL(src, global.location.href).href; } catch { return String(src || ''); }
    }

    function acquireAudio(src) {
      const key = audioCacheKey(src);
      const prepared = global.__coursePackage?.takePreparedAudio?.(src)
        || audioPreloadCache.get(key)
        || new global.Audio(src);
      audioPreloadCache.delete(key);
      prepared.preload = 'auto';
      return prepared;
    }

    function preloadAudio(src) {
      if (!src) return;
      const key = audioCacheKey(src);
      if (audioPreloadCache.has(key)) return;
      const prepared = global.__coursePackage?.takePreparedAudio?.(src) || new global.Audio(src);
      prepared.preload = 'auto';
      audioPreloadCache.set(key, prepared);
      try { prepared.load?.(); } catch { /* Playback still has the verified package byte fallback. */ }
    }

    function taskEntityIds(task) {
      const knownIds = new Set(Object.keys(unit.entities || {}));
      const found = new Set();
      const seen = new Set();
      const visit = value => {
        if (typeof value === 'string') {
          if (knownIds.has(value)) found.add(value);
          return;
        }
        if (!value || typeof value !== 'object' || seen.has(value)) return;
        seen.add(value);
        for (const nested of Object.values(value)) visit(nested);
      };
      visit(task);
      return [...found];
    }

    function entityImageCandidates(entityId) {
      const item = unit.entities?.[entityId] || {};
      return [...new Set([
        item.assetSrc,
        item.assetFallbackSrc,
        item.assets?.preferred,
        item.assets?.avif,
        item.assets?.webp,
        item.assets?.png
      ].filter(Boolean))];
    }

    function preloadImageGroup(candidates) {
      const key = candidates.join('|');
      if (!key || typeof global.Image !== 'function') return Promise.resolve(null);
      if (!imagePreloadCache.has(key)) {
        imagePreloadCache.set(key, (async () => {
          for (const url of candidates) {
            try {
              await new Promise((resolve, reject) => {
                const image = new global.Image();
                image.onload = async () => {
                  try { await image.decode?.(); resolve(); } catch (error) { reject(error); }
                };
                image.onerror = reject;
                image.src = url;
              });
              return url;
            } catch {
              // Older catalogs can still offer a second compatible format.
            }
          }
          return null;
        })());
      }
      return imagePreloadCache.get(key);
    }

    function primeTaskImageWindow(snapshot) {
      const index = Math.max(0, tasks.findIndex(task => task.microtaskId === snapshot.microtaskId));
      for (const task of tasks.slice(index, index + 2)) {
        for (const entityId of taskEntityIds(task)) {
          void preloadImageGroup(entityImageCandidates(entityId));
        }
      }
    }

    function updateResponsiveSceneLayout() {
      const world = root.querySelector?.('.station-world[data-scene-mode]');
      const props = world?.querySelector?.('.scene-props');
      if (!props?.style?.removeProperty) return;
      // Scene entities use the authored master anchors. A viewport measurement
      // must never move a real object away from the painted counter/rack.
      props.style.removeProperty('--scene-prop-shift-y');
    }

    function scheduleResponsiveSceneLayout() {
      if (typeof global.requestAnimationFrame !== 'function') {
        updateResponsiveSceneLayout();
        return;
      }
      if (responsiveSceneLayoutFrame !== null) {
        global.cancelAnimationFrame?.(responsiveSceneLayoutFrame);
      }
      responsiveSceneLayoutFrame = global.requestAnimationFrame(() => {
        responsiveSceneLayoutFrame = global.requestAnimationFrame(() => {
          responsiveSceneLayoutFrame = null;
          updateResponsiveSceneLayout();
        });
      });
    }

    function createRuntime(activeLedger, activeOutbox) {
      return runtimeFactory.create({
        unit,
        ledger: activeLedger,
        outbox: activeOutbox,
        seed: ++runtimeSequence,
        effectSink(effect) {
          ui.pendingEffects.push(effect);
        }
      });
    }
    let runtime = createRuntime(ledger, durableStore);

    function source(sourceRef) {
      return sourceIndex[sourceRef] || null;
    }

    function content(contentRef) {
      return unit.authoredContent?.[contentRef] || null;
    }

    function entity(entityId) {
      return unit.entities?.[entityId] || {
        entityId,
        title: uiCopy.fallbackEntityTitle || '',
        visualType: 'generic-target',
        symbol: '✦'
      };
    }

    function outcomePracticeForSnapshot(snapshot, practiceId = null) {
      if (ui.previewMode) return null;
      const origin = practiceOrigin(snapshot);
      return outcomePractices.find(practice => {
        if (practiceId && practice.practiceId !== practiceId) return false;
        if (practice.kind === 'manual-dialogue') {
          if (!practiceId) return false;
          const completed = durableLedger.read().units?.[unit.unitId]?.completedMicrotaskIds || [];
          return completed.includes(practice.unlockAfterStageId);
        }
        return practice.availableAt?.outcomeNodeId === origin.outcomeNodeId
          && practice.availableAt?.status === origin.status
          && practice.availableAt?.buildStage === origin.buildStage;
      }) || null;
    }

    function unlockedManualDialogue(snapshot = runtime.snapshot()) {
      return outcomePractices.find(practice => (
        practice.kind === 'manual-dialogue'
        && outcomePracticeForSnapshot(snapshot, practice.practiceId) === practice
      )) || null;
    }

    function practiceOrigin(snapshot) {
      const outcomeNodeId = snapshot.status === 'rest-stop'
        ? unit.experience?.restStops?.[snapshot.nextRestStop?.restStopId]?.outcomeNodeId
        : unit.experience?.completion?.outcomeNodeId;
      return { outcomeNodeId, status: snapshot.status, buildStage: snapshot.buildStage };
    }

    function startOutcomePractice(practiceId) {
      const config = outcomePracticeForSnapshot(runtime.snapshot(), practiceId);
      if (!config) return false;
      pauseVoice();
      outcomePracticeRuntime?.destroy();
      outcomePracticeConfig = config;
      outcomePracticeRuntime = outcomePracticeFactory.create(config, {
        evaluateRule: runtimeFactory.evaluateRule
      });
      const effects = outcomePracticeRuntime.enter(
        config.kind === 'manual-dialogue' ? config.availableAt : practiceOrigin(runtime.snapshot())
      );
      ui.settingsOpen = false;
      ui.stageMapOpen = false;
      processPracticeEffects(effects);
      return true;
    }

    function persistRequiredRoleDisposition({ practiceId, roundId }, disposition) {
      const snapshot = runtime.snapshot();
      primeTaskImageWindow(snapshot);
      const result = runtime.dispatch({
        type: disposition === 'completed'
          ? 'role-practice/round-complete'
          : 'role-practice/round-skip',
        experienceRevision: snapshot.experienceRevision,
        stateVersion: snapshot.stateVersion,
        practiceId,
        roundId
      });
      const emitted = ui.pendingEffects.splice(0);
      for (const effect of emitted) processEffect(effect);
      const failure = result.effects.find(effect => (
        effect.type === 'runtime/persistence-failed'
        || effect.type === 'runtime/role-practice-readback-incomplete'
        || effect.type === 'runtime/skip-readback-incomplete'
        || effect.type === 'runtime/command-rejected'
      ));
      const saved = result.effects.find(effect => (
        effect.type === 'runtime/role-practice-round-saved'
        && effect.practiceId === practiceId
        && effect.roundId === roundId
      ));
      return failure
        ? { persisted: false, reason: failure.reason || failure.type }
        : {
            persisted: true,
            completedRoundIds: saved?.completedRoundIds || [],
            skippedRoundIds: saved?.skippedRoundIds || []
          };
    }

    function saveRequiredRoleRound(identity) {
      return persistRequiredRoleDisposition(identity, 'completed');
    }

    function skipRequiredRoleRound(identity) {
      return persistRequiredRoleDisposition(identity, 'skipped');
    }

    function ensureRequiredRolePractice(snapshot) {
      const step = currentStep(snapshot);
      const config = step?.kind === 'role-enactment' ? step.practice : null;
      if (!config || snapshot.phase !== 'role-practice-ready') return false;
      if (outcomePracticeRuntime && outcomePracticeConfig?.practiceId === config.practiceId) {
        return true;
      }
      pauseVoice();
      outcomePracticeRuntime?.destroy();
      outcomePracticeConfig = config;
      outcomePracticeRuntime = outcomePracticeFactory.create(config, {
        saveRound: saveRequiredRoleRound,
        skipRound: skipRequiredRoleRound
      });
      outcomePracticeRuntime.enter({
        completedRoundIds: snapshot.rolePracticeProgress?.completedRoundIds || [],
        skippedRoundIds: snapshot.rolePracticeProgress?.skippedRoundIds || []
      });
      return true;
    }

    function exitOutcomePractice({ openStages = false } = {}) {
      if (!outcomePracticeRuntime) return;
      const active = outcomePracticeRuntime;
      const effects = active.exit();
      for (const effect of effects) {
        if (effect.type === 'practice/audio-cancel') pauseVoice();
      }
      active.destroy();
      outcomePracticeRuntime = null;
      outcomePracticeConfig = null;
      ui.settingsOpen = false;
      ui.stageMapOpen = openStages;
      render();
    }

    function orderedFromSnapshot(values, snapshot, identity = value => (
      typeof value === 'string' ? value : value?.refId || value?.panelId
    )) {
      const items = [...(values || [])];
      if (items.length < 2) return items;
      const orderedIds = Array.isArray(snapshot?.optionIds) ? snapshot.optionIds : [];
      if (orderedIds.length === 0) return items;
      const byId = new Map(items.map(item => [identity(item), item]));
      const ordered = orderedIds.map(optionId => byId.get(optionId)).filter(Boolean);
      const usedIds = new Set(ordered.map(identity));
      return [...ordered, ...items.filter(item => !usedIds.has(identity(item)))];
    }

    function emphasizedCatalogText(text, emphasis) {
      const value = String(text || '');
      const marker = String(emphasis || '');
      if (!marker) return escapeHtml(value);
      const index = value.toLocaleLowerCase().indexOf(marker.toLocaleLowerCase());
      if (index < 0) return escapeHtml(value);
      return `${escapeHtml(value.slice(0, index))}<b>${escapeHtml(value.slice(index, index + marker.length))}</b>${escapeHtml(value.slice(index + marker.length))}`;
    }

    function currentTask(snapshot = runtime.snapshot()) {
      return tasks.find(item => item.task.microtaskId === snapshot.microtaskId) || null;
    }

    function currentStep(snapshot = runtime.snapshot()) {
      return currentTask(snapshot)?.task.steps.find(step => step.stepId === snapshot.stepId) || null;
    }

    function currentPresentationMoment(snapshot = runtime.snapshot(), task = currentTask(snapshot)?.task) {
      if (!task || !snapshot.currentPresentationMomentId) return null;
      return (task.presentation?.moments || []).find(moment => (
        moment.momentId === snapshot.currentPresentationMomentId
      )) || null;
    }

    function stepById(stepId) {
      for (const { task } of tasks) {
        const step = task.steps.find(candidate => candidate.stepId === stepId);
        if (step) return step;
      }
      return null;
    }

    function reachedMicrotaskIds(snapshot = runtime.snapshot()) {
      const durableUnit = durableLedger.read().units?.[unit.unitId] || {};
      const completedIds = Array.isArray(durableUnit.completedMicrotaskIds)
        ? durableUnit.completedMicrotaskIds
        : [];
      const skippedIds = Array.isArray(durableUnit.skippedMicrotaskIds)
        ? durableUnit.skippedMicrotaskIds
        : [];
      const resolvedSet = new Set([...completedIds, ...skippedIds]);
      const currentId = tasks.find(({ task }) => !resolvedSet.has(task.microtaskId))?.task.microtaskId;
      const runtimeReached = !ui.previewMode && Array.isArray(snapshot.reachedMicrotaskIds)
        ? snapshot.reachedMicrotaskIds
        : [];
      return new Set([...completedIds, ...skippedIds, ...runtimeReached, currentId].filter(Boolean));
    }

    function resetSessionUi() {
      outcomePracticeRuntime?.destroy();
      outcomePracticeRuntime = null;
      outcomePracticeConfig = null;
      ui.pendingEffects.length = 0;
      ui.lastStepKey = null;
      ui.selectedEntityId = null;
      ui.selectedTargetId = null;
      ui.selectedSourceRef = null;
      ui.selectedContentRef = null;
      ui.selectedBlockRefs = [];
      ui.selectedSequenceIds = [];
      ui.selectedCaseByTask = {};
      ui.feedback = null;
      ui.resting = false;
      ui.knowledgeExpanded = false;
      ui.settingsOpen = false;
      ui.stageMapOpen = false;
      ui.restartConfirmOpen = false;
      ui.roleSkipConfirmOpen = false;
      ui.skipRecoveryMode = false;
      ui.rewinding = false;
      ui.presentationCompletionKey = null;
      ui.presentationArmGeneration += 1;
      if (ui.presentationCleanup) {
        ui.presentationCleanup();
        ui.presentationCleanup = null;
      }
      ui.dialogueFollowEnabled = true;
      ui.dialogueLastFollowKey = null;
      ui.dialogueProgrammaticScroll = false;
      ui.freeAudioRef = null;
      ui.practiceAudioRef = null;
      if (
        ui.stageReplayOrigin?.outcomePracticeRuntime
        && ui.stageReplayOrigin.outcomePracticeRuntime !== outcomePracticeRuntime
      ) {
        ui.stageReplayOrigin.outcomePracticeRuntime.destroy();
      }
      ui.stageReplayOrigin = null;
      if (ui.rescueTimer !== null) {
        global.clearTimeout(ui.rescueTimer);
        ui.rescueTimer = null;
      }
    }

    function startPreview(targetMicrotaskId) {
      if (!stagePreviewEnabled) return;
      const snapshot = runtime.snapshot();
      const navigationItem = snapshot.stageNavigation?.find(item => (
        item.microtaskId === targetMicrotaskId
      ));
      if (navigationItem?.status === 'current') {
        if (ui.previewMode) exitPreview();
        else {
          ui.settingsOpen = false;
          ui.stageMapOpen = false;
          render();
        }
        return;
      }
      if (!['completed', 'skipped'].includes(navigationItem?.status)) return;
      const recoveringSkippedStage = navigationItem.status === 'skipped';
      if (!ui.previewMode) {
        const practiceSnapshot = outcomePracticeRuntime?.snapshot();
        if (practiceSnapshot?.phase === 'audio-playing' && practiceSnapshot.audio) {
          const audio = practiceSnapshot.audio;
          const effects = outcomePracticeRuntime.dispatch({
            type: 'audio/failed',
            practiceSessionId: audio.practiceSessionId,
            stateVersion: audio.stateVersion,
            requestId: audio.requestId,
            segmentId: audio.segmentId,
            reason: 'stage-replay'
          });
          processPracticeEffects(effects);
        }
        pauseVoice();
        ui.stageReplayOrigin = {
          view: ui.view,
          lastStepKey: ui.lastStepKey,
          selectedEntityId: ui.selectedEntityId,
          selectedTargetId: ui.selectedTargetId,
          selectedSourceRef: ui.selectedSourceRef,
          selectedContentRef: ui.selectedContentRef,
          selectedBlockRefs: [...ui.selectedBlockRefs],
          selectedSequenceIds: [...ui.selectedSequenceIds],
          selectedCaseByTask: { ...ui.selectedCaseByTask },
          feedback: ui.feedback ? { ...ui.feedback } : null,
          resting: ui.resting,
          knowledgeExpanded: ui.knowledgeExpanded,
          dialogueFollowEnabled: ui.dialogueFollowEnabled,
          dialogueLastFollowKey: ui.dialogueLastFollowKey,
          dialogueProgrammaticScroll: ui.dialogueProgrammaticScroll,
          outcomePracticeRuntime,
          outcomePracticeConfig,
          locationLabel: currentTask(snapshot)?.task.navigationTitle || unit.title
        };
        outcomePracticeRuntime = null;
        outcomePracticeConfig = null;
      } else {
        pauseVoice();
        outcomePracticeRuntime?.destroy();
        outcomePracticeRuntime = null;
        outcomePracticeConfig = null;
      }
      ui.previewMode = !recoveringSkippedStage;
      ui.skipRecoveryMode = recoveringSkippedStage;
      ui.stageMapOpen = false;
      ui.settingsOpen = false;
      ui.previewTargetId = targetMicrotaskId;
      ui.view = 'mission';
      dispatch({ type: 'navigation/open-stage', microtaskId: targetMicrotaskId });
    }

    function exitPreview() {
      if (!ui.previewMode) return;
      const origin = ui.stageReplayOrigin;
      pauseVoice();
      outcomePracticeRuntime?.destroy();
      outcomePracticeRuntime = null;
      outcomePracticeConfig = null;
      ui.previewMode = false;
      ui.previewTargetId = null;
      ui.stageReplayOrigin = null;
      if (origin) {
        ui.view = origin.view;
        ui.lastStepKey = origin.lastStepKey;
        ui.selectedEntityId = origin.selectedEntityId;
        ui.selectedTargetId = origin.selectedTargetId;
        ui.selectedSourceRef = origin.selectedSourceRef;
        ui.selectedContentRef = origin.selectedContentRef;
        ui.selectedBlockRefs = [...origin.selectedBlockRefs];
        ui.selectedSequenceIds = [...origin.selectedSequenceIds];
        ui.selectedCaseByTask = { ...origin.selectedCaseByTask };
        ui.feedback = origin.feedback ? { ...origin.feedback } : null;
        ui.resting = origin.resting;
        ui.knowledgeExpanded = origin.knowledgeExpanded;
        ui.dialogueFollowEnabled = origin.dialogueFollowEnabled;
        ui.dialogueLastFollowKey = origin.dialogueLastFollowKey;
        ui.dialogueProgrammaticScroll = origin.dialogueProgrammaticScroll;
        outcomePracticeRuntime = origin.outcomePracticeRuntime || null;
        outcomePracticeConfig = origin.outcomePracticeConfig || null;
      }
      dispatch({ type: 'navigation/exit-sandbox' });
    }

    function finishSkipRecoveryUi() {
      if (!ui.skipRecoveryMode) return;
      const origin = ui.stageReplayOrigin;
      pauseVoice();
      outcomePracticeRuntime?.destroy();
      outcomePracticeRuntime = null;
      outcomePracticeConfig = null;
      ui.skipRecoveryMode = false;
      ui.previewTargetId = null;
      ui.roleSkipConfirmOpen = false;
      ui.stageReplayOrigin = null;
      if (!origin) return;
      ui.view = origin.view;
      ui.lastStepKey = origin.lastStepKey;
      ui.selectedEntityId = origin.selectedEntityId;
      ui.selectedTargetId = origin.selectedTargetId;
      ui.selectedSourceRef = origin.selectedSourceRef;
      ui.selectedContentRef = origin.selectedContentRef;
      ui.selectedBlockRefs = [...origin.selectedBlockRefs];
      ui.selectedSequenceIds = [...origin.selectedSequenceIds];
      ui.selectedCaseByTask = { ...origin.selectedCaseByTask };
      ui.feedback = origin.feedback ? { ...origin.feedback } : null;
      ui.resting = origin.resting;
      ui.knowledgeExpanded = origin.knowledgeExpanded;
      ui.dialogueFollowEnabled = origin.dialogueFollowEnabled;
      ui.dialogueLastFollowKey = origin.dialogueLastFollowKey;
      ui.dialogueProgrammaticScroll = origin.dialogueProgrammaticScroll;
      outcomePracticeRuntime = origin.outcomePracticeRuntime || null;
      outcomePracticeConfig = origin.outcomePracticeConfig || null;
    }

    function pauseVoice() {
      if (ui.voiceTimer !== null) {
        global.clearTimeout(ui.voiceTimer);
        ui.voiceTimer = null;
      }
      ui.pendingVoiceRequestId = null;
      if (!ui.voice) return;
      ui.voice.finished = true;
      try { ui.voice.audio.pause(); } catch { /* no-op */ }
      ui.voice = null;
      ui.freeAudioRef = null;
      ui.practiceAudioRef = null;
      syncFreeAudioPresentation();
    }

    function suspendRequiredAudio() {
      if (ui.destroyed) return;
      const practiceSnapshot = outcomePracticeRuntime?.snapshot();
      if (practiceSnapshot?.phase === 'audio-playing' && practiceSnapshot.audio) {
        const audio = practiceSnapshot.audio;
        pauseVoice();
        processPracticeEffects(outcomePracticeRuntime.dispatch({
          type: 'audio/failed',
          practiceSessionId: audio.practiceSessionId,
          stateVersion: audio.stateVersion,
          requestId: audio.requestId,
          segmentId: audio.segmentId,
          reason: 'document-hidden'
        }));
        return;
      }
      if (practiceSnapshot?.status === 'active') return;
      const snapshot = runtime.snapshot();
      const audio = snapshot.audio;
      pauseVoice();
      if (!audio || !['audio-playing', 'audio-retry'].includes(snapshot.phase)) return;
      dispatch({
        type: 'audio/suspend',
        microtaskId: snapshot.microtaskId,
        attemptRevision: snapshot.attemptRevision,
        requestId: audio.requestId,
        segmentId: audio.segmentId
      });
    }

    function resumeRequiredAudio() {
      if (ui.destroyed) return;
      const practiceSnapshot = outcomePracticeRuntime?.snapshot();
      if (
        practiceSnapshot?.phase === 'audio-retry'
        && practiceSnapshot.audio?.failureReason === 'document-hidden'
      ) {
        processPracticeEffects(outcomePracticeRuntime.dispatch({
          type: 'audio/retry',
          practiceSessionId: practiceSnapshot.practiceSessionId,
          stateVersion: practiceSnapshot.stateVersion,
          requestId: practiceSnapshot.audio.requestId,
          segmentId: practiceSnapshot.audio.segmentId
        }));
        return;
      }
      if (practiceSnapshot?.status === 'active') return;
      const snapshot = runtime.snapshot();
      if (!['audio-suspended', 'audio-blocked'].includes(snapshot.phase)) return;
      dispatch({ type: 'audio/resume' });
    }

    function onVisibilityChange() {
      if (global.document.hidden) suspendRequiredAudio();
      else resumeRequiredAudio();
    }

    function startFreeVoiceSequence(refIds, refKind = 'source') {
      const segments = (refIds || []).map(refId => ({
        refId,
        item: refKind === 'content' ? content(refId) : source(refId)
      })).filter(audioItem => audioItem.item?.audioSrc);
      if (segments.length === 0) return;
      pauseVoice();
      const session = {
        audio: null,
        requestId: null,
        segmentIndex: 0,
        finished: false,
        free: true
      };
      ui.voice = session;

      const finishSequence = () => {
        if (session.finished) return;
        session.finished = true;
        if (ui.voice === session) ui.voice = null;
        ui.freeAudioRef = null;
        syncFreeAudioPresentation();
      };

      const playSegment = index => {
        if (session.finished || ui.voice !== session) return;
        const audioItem = segments[index];
        if (!audioItem) {
          finishSequence();
          return;
        }
        const audio = acquireAudio(audioItem.item.audioSrc);
        session.audio = audio;
        session.segmentIndex = index;
        ui.freeAudioRef = audioItem.refId;
        syncFreeAudioPresentation();

        const advance = () => {
          if (session.finished || ui.voice !== session) return;
          if (index + 1 < segments.length) playSegment(index + 1);
          else finishSequence();
        };
        audio.addEventListener('ended', advance, { once: true });
        audio.addEventListener('error', finishSequence, { once: true });
        try {
          const playing = audio.play();
          if (playing && typeof playing.catch === 'function') playing.catch(finishSequence);
        } catch {
          finishSequence();
        }
      };

      playSegment(0);
    }

    function startFreeVoice(refId, refKind = 'source') {
      startFreeVoiceSequence([refId], refKind);
    }

    function dispatch(action) {
      const snapshot = runtime.snapshot();
      const identifiedAction = {
        experienceRevision: snapshot.experienceRevision,
        stateVersion: snapshot.stateVersion,
        ...(snapshot.challengeRef ? { challengeRef: snapshot.challengeRef } : {}),
        ...action
      };
      const result = runtime.dispatch(identifiedAction);
      flushEffectsAndRender();
      return result;
    }

    function presentationCompletionKey(snapshot, moment) {
      if (!moment) return null;
      return [
        snapshot.experienceRevision,
        snapshot.microtaskId,
        snapshot.attemptRevision,
        moment.momentId
      ].join(':');
    }

    function finishPresentationMoment(snapshot, moment) {
      const latest = runtime.snapshot();
      const key = presentationCompletionKey(snapshot, moment);
      if (!key || ui.presentationCompletionKey === key) return;
      if (
        latest.presentationAwaitingEnd !== true
        || latest.microtaskId !== snapshot.microtaskId
        || latest.attemptRevision !== snapshot.attemptRevision
        || latest.currentPresentationMomentId !== moment.momentId
      ) return;
      ui.presentationCompletionKey = key;
      dispatch({
        type: 'presentation/ended',
        microtaskId: latest.microtaskId,
        attemptRevision: latest.attemptRevision,
        momentId: latest.currentPresentationMomentId
      });
    }

    function armPresentationMoment(snapshot, task, moment) {
      if (!moment || snapshot.presentationAwaitingEnd !== true) return;
      if (ui.settingsOpen || ui.stageMapOpen || ui.restartConfirmOpen) return;
      if (moment.advancePolicy === 'explicit-child-continue') return;
      const key = presentationCompletionKey(snapshot, moment);
      if (!key || ui.presentationCompletionKey === key) return;
      const armGeneration = ui.presentationArmGeneration;
      global.queueMicrotask(() => {
        if (armGeneration !== ui.presentationArmGeneration) return;
        const world = root.querySelector('.station-world[data-presentation-moment]');
        if (!world || world.dataset.presentationMoment !== moment.momentId) return;
        if (world.querySelector('[data-presentation-manual="true"]')) return;

        let completed = false;
        let onMotionEnd = null;
        const cleanup = () => {
          if (onMotionEnd) {
            world.removeEventListener('animationend', onMotionEnd);
            world.removeEventListener('transitionend', onMotionEnd);
          }
          if (ui.presentationCleanup === cleanup) ui.presentationCleanup = null;
        };
        const complete = () => {
          if (completed) return;
          completed = true;
          cleanup();
          if (armGeneration !== ui.presentationArmGeneration) return;
          finishPresentationMoment(snapshot, moment);
        };
        onMotionEnd = event => {
          if (
            (event.type === 'animationend'
              && String(event.animationName || '').startsWith('moment-'))
            || (event.type === 'transitionend' && event.target === world)
          ) complete();
        };
        ui.presentationCleanup = cleanup;
        world.addEventListener('animationend', onMotionEnd);
        world.addEventListener('transitionend', onMotionEnd);

        if (global.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
          global.queueMicrotask(complete);
          return;
        }

        const inspectAnimations = () => {
          const candidates = typeof world.getAnimations === 'function'
            ? world.getAnimations({ subtree: true })
            : [...world.querySelectorAll('*')].flatMap(element => (
                typeof element.getAnimations === 'function' ? element.getAnimations() : []
              ));
          const animated = candidates.filter(animation => {
            const iterations = animation.effect?.getTiming?.().iterations;
            return animation.playState !== 'idle' && iterations !== Infinity;
          });
          if (animated.length === 0) {
            complete();
            return;
          }
          Promise.allSettled(animated.map(animation => animation.finished)).then(results => {
            if (results.every(result => result.status === 'fulfilled')) complete();
          });
        };
        if (typeof global.requestAnimationFrame === 'function') {
          global.requestAnimationFrame(inspectAnimations);
        } else {
          global.queueMicrotask(inspectAnimations);
        }
      });
    }

    function startVoice(effect) {
      pauseVoice();
      const audioRef = effect.audioRef || {
        src: effect.src,
        text: effect.visibleText,
        refId: effect.sourceRef || effect.contentRef,
        segmentId: effect.segmentId
      };
      if (!audioRef.src) return;
      const audio = acquireAudio(audioRef.src);
      const activeSnapshot = runtime.snapshot();
      const session = {
        audio,
        experienceRevision: effect.experienceRevision || activeSnapshot.experienceRevision,
        microtaskId: effect.microtaskId || activeSnapshot.microtaskId,
        attemptRevision: effect.attemptRevision ?? activeSnapshot.attemptRevision,
        requestId: effect.requestId,
        segmentIndex: effect.segmentIndex,
        segmentId: effect.segmentId || audioRef.segmentId || audioRef.refId,
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
            experienceRevision: session.experienceRevision,
            microtaskId: session.microtaskId,
            attemptRevision: session.attemptRevision,
            requestId: session.requestId,
            segmentIndex: session.segmentIndex,
            segmentId: session.segmentId
          });
        } else if (type === 'blocked') {
          dispatch({
            type: 'audio/blocked',
            experienceRevision: session.experienceRevision,
            microtaskId: session.microtaskId,
            attemptRevision: session.attemptRevision,
            requestId: session.requestId,
            segmentIndex: session.segmentIndex,
            segmentId: session.segmentId,
            reason: reason || 'autoplay-policy'
          });
        } else {
          dispatch({
            type: 'audio/failed',
            experienceRevision: session.experienceRevision,
            microtaskId: session.microtaskId,
            attemptRevision: session.attemptRevision,
            requestId: session.requestId,
            segmentIndex: session.segmentIndex,
            segmentId: session.segmentId,
            failureKind: 'transient',
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
        } catch (error) {
          finish(
            isAutoplayPolicyBlock(error) ? 'blocked' : 'failed',
            isAutoplayPolicyBlock(error) ? 'autoplay-policy' : 'play-threw'
          );
          return;
        }
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(error => finish(
            isAutoplayPolicyBlock(error) ? 'blocked' : 'failed',
            isAutoplayPolicyBlock(error) ? 'autoplay-policy' : 'play-rejected'
          ));
        }
      }

      playLanguageAudio();
    }

    function startPracticeVoice(effect) {
      pauseVoice();
      const audioSource = source(effect.audioRef);
      const fail = reason => {
        if (!outcomePracticeRuntime) return;
        const effects = outcomePracticeRuntime.dispatch({
          type: 'audio/failed',
          practiceSessionId: effect.practiceSessionId,
          stateVersion: effect.stateVersion,
          requestId: effect.requestId,
          segmentId: effect.segmentId,
          reason
        });
        processPracticeEffects(effects);
      };
      if (!audioSource?.audioSrc) {
        fail('missing-audio-source');
        return;
      }
      const audio = acquireAudio(audioSource.audioSrc);
      const session = {
        audio,
        practice: true,
        practiceSessionId: effect.practiceSessionId,
        stateVersion: effect.stateVersion,
        requestId: effect.requestId,
        segmentId: effect.segmentId,
        audioRef: effect.audioRef,
        finished: false
      };
      ui.voice = session;
      ui.practiceAudioRef = effect.audioRef;
      render();

      function finish(type, reason) {
        if (session.finished) return;
        session.finished = true;
        if (ui.voice === session) ui.voice = null;
        ui.practiceAudioRef = null;
        if (!outcomePracticeRuntime) return;
        const effects = outcomePracticeRuntime.dispatch({
          type: type === 'ended' ? 'audio/ended' : 'audio/failed',
          practiceSessionId: session.practiceSessionId,
          stateVersion: session.stateVersion,
          requestId: session.requestId,
          segmentId: session.segmentId,
          ...(type === 'ended' ? {} : { reason: reason || 'media-error' })
        });
        processPracticeEffects(effects);
      }

      audio.addEventListener('ended', () => finish('ended'), { once: true });
      audio.addEventListener('error', () => finish('failed', 'media-error'), { once: true });
      try {
        const playing = audio.play();
        if (playing && typeof playing.catch === 'function') {
          playing.catch(() => finish('failed', 'play-rejected'));
        }
      } catch {
        finish('failed', 'play-threw');
      }
    }

    function processPracticeEffects(effects = []) {
      const audioStarts = [];
      for (const effect of effects) {
        if (effect.type === 'practice/audio-play') {
          audioStarts.push(effect);
        } else if (effect.type === 'practice/audio-cancel') {
          if (
            ui.voice?.practice === true
            && ui.voice.practiceSessionId === effect.practiceSessionId
            && ui.voice.stateVersion === effect.stateVersion
            && ui.voice.requestId === effect.requestId
            && ui.voice.segmentId === effect.segmentId
          ) pauseVoice();
        }
      }
      render();
      for (const effect of audioStarts) startPracticeVoice(effect);
    }

    function processEffect(effect) {
      if (effect.type === 'audio/preload') {
        preloadAudio(effect.audioRef?.src || effect.line?.audioSrc || effect.src);
        return;
      }
      if (effect.type === 'audio/cancel') {
        if (
          ui.voice?.requestId === effect.requestId
          || ui.pendingVoiceRequestId === effect.requestId
        ) pauseVoice();
        return;
      }
      if (effect.type === 'audio/play') {
        const delayMs = Number(effect.delayMs || effect.retryDelayMs || 0);
        if (delayMs > 0) {
          pauseVoice();
          ui.pendingVoiceRequestId = effect.requestId;
          ui.voiceTimer = global.setTimeout(() => {
            ui.voiceTimer = null;
            ui.pendingVoiceRequestId = null;
            startVoice(effect);
          }, delayMs);
        } else {
          startVoice(effect);
        }
        return;
      }
      if (effect.type === 'feedback/support') {
        ui.feedback = { tone: 'support', message: effect.message || feedbackCopy.supportFallback || '' };
        return;
      }
      if (effect.type === 'feedback/partner-demo') {
        ui.feedback = { tone: 'partner', message: effect.message || feedbackCopy.rescueFallback || '' };
        ui.rewinding = true;
        const rescueSnapshot = runtime.snapshot();
        if (ui.rescueTimer !== null) global.clearTimeout(ui.rescueTimer);
        ui.rescueTimer = global.setTimeout(() => {
          ui.rescueTimer = null;
          ui.rewinding = false;
          dispatch({
            type: 'rescue/model-ended',
            microtaskId: rescueSnapshot.microtaskId,
            attemptRevision: rescueSnapshot.attemptRevision,
            challengeRef: rescueSnapshot.challengeRef
          });
        }, effect.delayMs || 1400);
        return;
      }
      if (effect.type === 'adventure-hearts/star-rewind') {
        ui.rewinding = true;
        if (ui.rescueTimer !== null) global.clearTimeout(ui.rescueTimer);
        ui.rescueTimer = global.setTimeout(() => {
          ui.rescueTimer = null;
          ui.rewinding = false;
          dispatch({ type: 'partner-rescue/continue' });
        }, effect.delayMs || 1400);
        return;
      }
      if (effect.type === 'feedback/correct') {
        ui.feedback = {
          tone: 'correct',
          challengeRef: effect.challengeRef || null,
          message: effect.outcome === 'independent'
            ? (effect.message || stepById(effect.stepId)?.correctFeedback || '')
            : (feedbackCopy.assistedCorrect || '')
        };
        return;
      }
      if (effect.type === 'runtime/microtask-skipped') {
        pauseVoice();
        outcomePracticeRuntime?.destroy();
        outcomePracticeRuntime = null;
        outcomePracticeConfig = null;
        ui.roleSkipConfirmOpen = false;
        global.queueMicrotask(() => root.querySelector('[data-copy-purpose="task"], .station-brand strong')?.focus?.());
        return;
      }
      if (effect.type === 'runtime/skipped-stage-completed'
        || effect.type === 'runtime/skipped-stage-returned') {
        finishSkipRecoveryUi();
        return;
      }
      if (effect.type === 'runtime/persistence-failed') {
        ui.feedback = { tone: 'danger', message: feedbackCopy.saveFailed || '' };
      }
    }

    function flushEffectsAndRender({ deferAudio = false } = {}) {
      const effects = ui.pendingEffects.splice(0);
      const audioStarts = [];
      for (const effect of effects) {
        if (effect.type === 'audio/play') audioStarts.push(effect);
        else processEffect(effect);
      }
      render();
      const startAudio = () => {
        if (ui.destroyed) return;
        for (const effect of audioStarts) processEffect(effect);
      };
      if (deferAudio && audioStarts.length > 0) global.queueMicrotask(startAudio);
      else startAudio();
    }

    function resetStepSelections(snapshot) {
      const activeChallenge = snapshot.challengeRef || snapshot.challengeIndex || snapshot.batchIndex || 0;
      const stepKey = `${snapshot.microtaskId || 'none'}:${snapshot.stepId || 'none'}:${activeChallenge}:${snapshot.optionRevision || 0}`;
      if (ui.lastStepKey === stepKey) {
        if (
          ui.feedback?.tone === 'correct'
          && ui.feedback.challengeRef !== snapshot.challengeRef
          && snapshot.phase !== 'audio-playing'
        ) ui.feedback = null;
        return;
      }
      ui.lastStepKey = stepKey;
      ui.selectedEntityId = null;
      ui.selectedTargetId = null;
      ui.selectedSourceRef = null;
      ui.selectedContentRef = null;
      ui.selectedBlockRefs = [];
      ui.selectedSequenceIds = [];
      const preserveCorrectForFollowingAudio = ui.feedback?.tone === 'correct'
        && snapshot.phase === 'audio-playing';
      if (snapshot.phase !== 'completed' && !preserveCorrectForFollowingAudio) ui.feedback = null;
    }

    function entityPicture(item) {
      return item.assetSrc
        ? (item.assetFallbackSrc
            ? `<picture><source srcset="${escapeHtml(item.assetSrc)}" type="${imageMime(item.assetSrc)}"><img src="${escapeHtml(item.assetFallbackSrc)}" alt="" draggable="false"></picture>`
            : `<img src="${escapeHtml(item.assetSrc)}" alt="" draggable="false">`)
        : `<span aria-hidden="true">${escapeHtml(item.symbol || '✦')}</span>`;
    }

    function entityVisual(entityId, { compact = false } = {}) {
      const item = entity(entityId);
      const visual = entityPicture(item);
      return `<span class="entity-visual${compact ? ' entity-visual--compact' : ''}" data-entity-id="${escapeHtml(entityId)}" data-entity-kind="${escapeHtml(item.entityKind || 'prop')}" ${item.characterIdentityId ? `data-character-identity="${escapeHtml(item.characterIdentityId)}"` : ''} data-visual-type="${escapeHtml(item.visualType)}">${visual}</span>`;
    }

    function activeSpeakerRole(snapshot) {
      if (ui.freeAudioRef) {
        return (source(ui.freeAudioRef) || content(ui.freeAudioRef))?.speaker || null;
      }
      if (snapshot.phase !== 'audio-playing') return null;
      return snapshot.audio?.refs?.[snapshot.audio.segmentIndex || 0]?.speaker || null;
    }

    function speakerEntityId(personIds, speakerRole) {
      return personIds.find(entityId => entity(entityId).voiceRole === speakerRole) || null;
    }

    // Optional replay is presentation-only state. Updating the existing nodes
    // keeps the painted room, cast, props and child's place on the page stable;
    // only the active line, speaker and replay control are allowed to change.
    function syncFreeAudioPresentation() {
      if (typeof root.querySelectorAll !== 'function') return;
      const activeRef = ui.freeAudioRef;
      const activeItem = activeRef ? (source(activeRef) || content(activeRef)) : null;
      const freeAudioActive = Boolean(activeRef && ui.voice?.free && !ui.voice.finished);

      for (const button of root.querySelectorAll('[data-action="free-audio"]')) {
        const active = freeAudioActive && button.dataset.value === activeRef;
        button.classList.toggle('is-playing', active);
        button.disabled = active;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      }

      const dialogueReplay = root.querySelector('[data-action="dialogue-replay"]');
      if (dialogueReplay) {
        dialogueReplay.classList.toggle('is-playing', freeAudioActive);
        dialogueReplay.disabled = freeAudioActive;
        dialogueReplay.setAttribute('aria-pressed', freeAudioActive ? 'true' : 'false');
      }

      for (const line of root.querySelectorAll('.dialogue-listen--complete .dialogue-line')) {
        const current = freeAudioActive && line.dataset.languageRef === activeRef;
        line.classList.add('is-heard');
        line.classList.toggle('is-current', current);
        if (current) line.setAttribute('aria-current', 'true');
        else line.removeAttribute('aria-current');
      }

      for (const character of root.querySelectorAll('.scene-character[data-speaker-role]')) {
        character.classList.toggle(
          'is-active-speaker',
          freeAudioActive && Boolean(activeItem?.speaker)
            && character.dataset.speakerRole === activeItem.speaker
        );
      }
    }

    function momentEntityState(task, moment, entityId) {
      if (!task || !moment) return '';
      const currentIndex = (task.presentation?.moments || []).findIndex(candidate => (
        candidate.momentId === moment.momentId
      ));
      if (currentIndex < 0) return '';
      const states = (task.presentation?.moments || [])
        .slice(0, currentIndex + 1)
        .flatMap(candidate => candidate.endState?.entityStates || [])
        .filter(state => state.entityId === entityId)
        .map(state => state.state);
      return [...new Set(states)].join(' ');
    }

    function correctFeedbackEntityIds(task, step) {
      if (ui.feedback?.tone !== 'correct') return new Set();
      const feedbackStep = step || (task?.steps || []).find(candidateStep => (
        (candidateStep.challenges || []).some(candidate => (
          candidate.challengeRef === ui.feedback.challengeRef
        ))
      ));
      const challenge = (feedbackStep?.challenges || []).find(candidate => (
        candidate.challengeRef === ui.feedback.challengeRef
      ));
      const rule = challenge?.answerRule || feedbackStep?.answerRule || {};
      return new Set([
        ...(rule.acceptedEntityIds || []),
        rule.acceptedEntityId,
        rule.entityId,
        rule.targetEntityId
      ].filter(Boolean));
    }

    function sceneCharacter(entityId, snapshot, step, moment, task, interactionEnabled = false) {
      const item = entity(entityId);
      const candidateLabel = task?.presentation?.candidateLabels?.[entityId] || item.title;
      const targetable = (step?.kind === 'perform-action'
        && (step.targetEntityIds || []).includes(entityId));
      const selectable = step?.kind === 'select-entity'
        && (step.optionEntityIds || []).includes(entityId);
      const actionEligible = targetable || selectable;
      const selected = actionEligible && (
        ui.selectedEntityId === entityId || ui.selectedTargetId === entityId
      );
      const action = actionEligible
        ? (interactionEnabled
            ? ` data-action="${selectable ? 'select-entity' : 'perform-direct'}" data-value="${escapeHtml(entityId)}"`
            : ' disabled aria-disabled="true"')
        : ' disabled aria-disabled="true" aria-hidden="true"';
      const pressed = actionEligible ? ` aria-pressed="${selected ? 'true' : 'false'}"` : '';
      const active = item.voiceRole && item.voiceRole === activeSpeakerRole(snapshot);
      const focused = moment?.focusEntityIds?.includes(entityId);
      const correct = correctFeedbackEntityIds(task, step).has(entityId);
      return `<button type="button" class="scene-character scene-character--${escapeHtml(item.dialogueSide || 'center')}${selectable ? ' is-choice-candidate' : ''}${active ? ' is-active-speaker' : ''}${focused ? ' is-moment-focus' : ''}${selected ? ' is-selected' : ''}${correct ? ' is-correct-response' : ''}"${action}${pressed} data-entity-id="${escapeHtml(entityId)}" data-entity-kind="character" data-dialogue-side="${escapeHtml(item.dialogueSide || 'center')}" data-speaker-role="${escapeHtml(item.voiceRole || '')}" data-moment-state="${escapeHtml(momentEntityState(task, moment, entityId))}">
        ${entityPicture(item)}
        <span class="scene-character__name">${escapeHtml(candidateLabel)}</span>
      </button>`;
    }

    function sceneCompanion(snapshot, step, moment, task, interactionEnabled = false) {
      const item = entity('explorer-cat');
      const childIsTarget = step?.kind === 'perform-action'
        && (step.targetEntityIds || []).some(entityId => entity(entityId).characterIdentityId === 'explorer-cat');
      const childTargetId = (step?.targetEntityIds || [])
        .find(entityId => entity(entityId).characterIdentityId === 'explorer-cat');
      const action = childIsTarget
        ? (interactionEnabled
            ? ` data-action="perform-direct" data-value="${escapeHtml(childTargetId)}"`
            : ' disabled aria-disabled="true"')
        : ' disabled aria-disabled="true" aria-hidden="true"';
      const focused = moment?.focusEntityIds?.includes('explorer-cat');
      return `<button type="button" class="scene-companion scene-companion--featured${focused ? ' is-moment-focus' : ''}"${action} data-entity-id="explorer-cat" data-entity-kind="character" data-character-identity="explorer-cat" data-moment-state="${escapeHtml(momentEntityState(task, moment, 'explorer-cat'))}">
        ${entityPicture(item)}
        <span class="scene-companion__name">${escapeHtml(item.title)}</span>
      </button>`;
    }

    function sceneProp(entityId, snapshot, step, moment, task, interactionEnabled = false) {
      const item = entity(entityId);
      const selectable = ['match-entity', 'match-entity-batch', 'connect-reference'].includes(step?.kind)
        && (step.optionEntityIds || []).includes(entityId);
      const interactive = selectable;
      const selected = interactive && ui.selectedEntityId === entityId;
      const action = interactive
        ? (interactionEnabled
            ? ` data-action="${step.kind === 'connect-reference' ? 'connect-reference' : 'select-entity'}" data-value="${escapeHtml(entityId)}"`
            : ' disabled aria-disabled="true"')
        : ' disabled aria-disabled="true" aria-hidden="true"';
      const pressed = interactive ? ` aria-pressed="${selected ? 'true' : 'false'}"` : '';
      const focused = moment?.focusEntityIds?.includes(entityId);
      const correct = correctFeedbackEntityIds(task, step).has(entityId);
      return `<button type="button" class="scene-prop${selectable ? ' is-choice-candidate' : ''}${focused ? ' is-moment-focus' : ''}${selected ? ' is-selected' : ''}${correct ? ' is-correct-response' : ''}"${action}${pressed} data-entity-id="${escapeHtml(entityId)}" data-entity-kind="prop" data-visual-type="${escapeHtml(item.visualType || '')}" data-moment-state="${escapeHtml(momentEntityState(task, moment, entityId))}">
        ${entityPicture(item)}
        <span class="scene-prop__name">${escapeHtml(item.title)}</span>
      </button>`;
    }

    function activeChallenge(snapshot, step) {
      return (step?.challenges || []).find(challenge => (
        challenge.challengeRef === snapshot.challengeRef
      )) || null;
    }

    function representedLanguageRefs(snapshot, step) {
      if (!step) return new Set();
      const challenge = activeChallenge(snapshot, step);
      const refs = new Set();
      const add = values => {
        for (const value of values || []) if (value) refs.add(value);
      };
      if (['audio-ready', 'audio-playing', 'audio-retry', 'audio-failed', 'audio-suspended', 'audio-blocked'].includes(snapshot.phase)) {
        const visibleAudioRefs = step.kind === 'audio-sequence'
          ? (snapshot.audio?.refs || [])
          : [snapshot.audio?.refs?.[snapshot.audio?.segmentIndex || 0]].filter(Boolean);
        add(visibleAudioRefs.map(ref => ref.sourceRef || ref.contentRef || ref.refId));
        return refs;
      }
      if (['persistence-retry', 'answered-awaiting-save', 'unit-verifying'].includes(snapshot.phase)) {
        return refs;
      }
      if (['match-entity', 'match-entity-batch'].includes(step.kind)) {
        add([snapshot.challengeSourceRef || challenge?.sourceRef]);
      }
      if (step.kind === 'select-one') add(step.optionSourceRefs);
      if (step.kind === 'grammar-compare') {
        add([step.statementContentRef, step.questionSourceRef]);
      }
      if (step.kind === 'connect-reference') add([step.answerSourceRef || step.sourceRef]);
      if (step.kind === 'detect-error') {
        add([...(step.optionSourceRefs || []), step.diagnosticContentRef]);
      }
      if (step.kind === 'ordered-sequence') {
        add((step.sequencePanels || []).flatMap(panel => panel.sourceRefs || []));
      }
      if (step.kind === 'ordered-blocks') {
        add([...(step.blockContentRefs || []), ...(step.blockSourceRefs || [])]);
        const selectedCase = ui.selectedCaseByTask[snapshot.microtaskId];
        if (selectedCase) add([entity(selectedCase).sourceRef]);
      }
      return refs;
    }

    function momentLanguageMarkup(snapshot, step, moment) {
      if (!moment?.visibleLanguageRefs?.length) return '';
      const represented = representedLanguageRefs(snapshot, step);
      const forceTerminalLanguage = ['microtask-start', 'microtask-complete', 'step-completed', 'phase']
        .includes(moment.enterWhen?.kind);
      const refs = moment.visibleLanguageRefs.filter(refId => (
        forceTerminalLanguage || !represented.has(refId)
      ));
      if (refs.length === 0) return '';
      const entries = refs.map(refId => {
        const item = source(refId) || content(refId);
        const label = item?.text || item?.title || '';
        const primaryTask = refId === step?.promptSourceRef;
        return label
          ? `<span class="moment-language__item" data-language-ref="${escapeHtml(refId)}"${primaryTask ? ' data-copy-purpose="task" data-copy-priority="primary"' : ''}>${escapeHtml(label)}</span>`
          : '';
      }).filter(Boolean).join('');
      return entries
        ? `<aside class="moment-language" data-moment-language aria-live="polite">${entries}</aside>`
        : '';
    }

    function knowledgeLayerMarkup(task, moment) {
      const refs = task.knowledgeCardRefs || [];
      if (refs.length === 0 || !refs.some(ref => moment?.visibleLanguageRefs?.includes(ref))) return '';
      const summary = content(refs[0]);
      const detail = content(refs[1]);
      if (!summary) return '';
      return `<section class="knowledge-card knowledge-layer" data-presentation-manual="true" aria-labelledby="knowledge-layer-title">
        <span class="knowledge-card__seal" aria-hidden="true">${uiIcon('star-fill')}</span>
        <div class="knowledge-card__copy">
          <small>${escapeHtml(uiCopy.knowledge?.label || '')}</small>
          <h2 id="knowledge-layer-title">${escapeHtml(summary.title)}</h2>
          <p>${escapeHtml(summary.text)}</p>
          ${detail && ui.knowledgeExpanded ? `<div class="knowledge-card__detail"><strong>${escapeHtml(detail.title)}</strong><p>${escapeHtml(detail.text)}</p></div>` : ''}
          <div class="knowledge-card__actions">
            ${detail ? `<button class="knowledge-card__expand" type="button" data-action="knowledge-expand" aria-expanded="${ui.knowledgeExpanded ? 'true' : 'false'}">${escapeHtml(ui.knowledgeExpanded ? (uiCopy.knowledge?.collapseLabel || '') : detail.title)}</button>` : ''}
            <button class="knowledge-card__continue" type="button" data-action="presentation-end">${escapeHtml(uiCopy.knowledge?.continueLabel || '')}</button>
          </div>
        </div>
      </section>`;
    }

    function explicitPresentationMarkup(snapshot, step, adultEntityIds, moment) {
      if (moment?.advancePolicy !== 'explicit-child-continue') return '';
      if (step?.kind === 'audio-sequence') {
        return dialogueAudioPanel(snapshot, step, adultEntityIds, {
          completed: true,
          sourceRefs: moment.visibleLanguageRefs
        });
      }
      const audioStillActive = [
        'audio-ready', 'audio-playing', 'audio-retry', 'audio-suspended', 'audio-blocked'
      ].includes(snapshot.phase);
      return `<section class="presentation-continue" data-presentation-manual="true">
        ${momentLanguageMarkup(snapshot, step, moment)}
        ${audioStillActive ? '' : `<button class="story-listen-button presentation-continue__button" type="button" data-action="presentation-end">
          <strong>${escapeHtml(uiCopy.presentation?.continueLabel || '')}</strong>
          ${uiIcon('arrow-right')}
        </button>`}
      </section>`;
    }

    function choiceButton({ action, value, label, selected, visual = '', extra = '' }) {
      return `<button class="choice-token${selected ? ' is-selected' : ''}" type="button" data-action="${escapeHtml(action)}" data-value="${escapeHtml(value)}" ${extra} aria-pressed="${selected ? 'true' : 'false'}">${visual}<strong>${escapeHtml(label)}</strong></button>`;
    }

    function adventureHeartGauge(snapshot) {
      const remaining = Number.isInteger(snapshot.adventureHeartsRemaining)
        ? snapshot.adventureHeartsRemaining
        : (Number.isInteger(snapshot.adventureHearts) ? snapshot.adventureHearts : 3);
      return `<div class="adventure-heart-gauge${ui.rewinding ? ' is-rewinding' : ''}" aria-label="${escapeHtml(uiCopy.hearts?.ariaPrefix || '')}${remaining} / 3">
        <span class="adventure-heart-gauge__label">${escapeHtml(uiCopy.hearts?.label || '')}</span>
        <span class="adventure-heart-gauge__hearts">
          ${[0, 1, 2].map(index => `<span class="adventure-heart${index < remaining ? ' is-full' : ''}" aria-hidden="true">${uiIcon('heart-fill')}</span>`).join('')}
        </span>
      </div>`;
    }

    function shouldShowAdventureHearts(snapshot, step) {
      const challenge = activeChallenge(snapshot, step);
      const formal = (challenge?.submissionMode || step?.submissionMode) === 'formal';
      return snapshot.status === 'active'
        && snapshot.microtaskStatus === 'in-progress'
        && formal
        && [
          'audio-ready', 'audio-playing', 'audio-retry', 'audio-suspended', 'audio-blocked',
          'awaiting-response', 'rescue-model', 'partner-rescue'
        ].includes(snapshot.phase);
    }

    function dialogueAudioPanel(snapshot, step, personIds, {
      completed = false,
      sourceRefs = step.audioSourceRefs || []
    } = {}) {
      const refs = sourceRefs;
      const isPlaying = !completed && snapshot.phase === 'audio-playing';
      const replayIndex = completed ? refs.indexOf(ui.freeAudioRef) : -1;
      const isReplaying = completed && replayIndex >= 0;
      const currentIndex = isPlaying
        ? (snapshot.audio?.segmentIndex || 0)
        : replayIndex;
      const lines = refs.map((refId, index) => {
        const item = source(refId) || {};
        const stateClass = completed
          ? ` is-heard${index === currentIndex ? ' is-current' : ''}`
          : (index === currentIndex
              ? ' is-current'
              : (index < currentIndex ? ' is-heard' : ''));
        const speakingEntityId = speakerEntityId(personIds, item.speaker);
        const speakerName = speakingEntityId ? entity(speakingEntityId).title : (item.speaker || dialogueCopy.speakerFallback || '');
        return `<li class="dialogue-line${stateClass}" data-language-ref="${escapeHtml(refId)}" data-speaker="${escapeHtml(item.speaker || 'speaker')}" data-speaker-entity="${escapeHtml(speakingEntityId || '')}" ${index === currentIndex ? 'aria-current="true"' : ''}>
          <span class="dialogue-line__speaker-name">${escapeHtml(speakerName)}</span>
          <span class="dialogue-line__text">${escapeHtml(item.text || '')}</span>
        </li>`;
      }).join('');
      return `<section class="dialogue-listen${completed ? ' dialogue-listen--complete' : ''}" aria-label="${escapeHtml(dialogueCopy.regionLabel || '')}">
        <ol class="dialogue-script">${lines}</ol>
        ${completed ? '' : `<button class="dialogue-return-current" type="button" data-action="dialogue-return-current" ${ui.dialogueFollowEnabled ? 'hidden' : ''}>${escapeHtml(dialogueCopy.followCurrentLabel || '')}</button>`}
        ${completed
          ? `<div class="dialogue-player dialogue-player--complete" data-presentation-manual="true">
              <div class="dialogue-complete-actions">
                <button class="story-listen-button story-replay-button${isReplaying ? ' is-playing' : ''}" type="button" data-action="dialogue-replay" aria-label="${escapeHtml(dialogueCopy.replayAriaLabel || '')}" aria-pressed="${isReplaying ? 'true' : 'false'}"${isReplaying ? ' disabled' : ''}>
                  ${uiIcon('arrow-counterclockwise')}
                  <strong>${escapeHtml(dialogueCopy.replayLabel || '')}</strong>
                </button>
                <button class="story-listen-button story-continue-button" type="button" data-action="presentation-end">
                  <strong>${escapeHtml(dialogueCopy.continueLabel || '')}</strong>
                  ${uiIcon('arrow-right')}
                </button>
              </div>
            </div>`
          : `<div class="dialogue-player">
              <button class="story-listen-button" type="button" data-action="audio-play" ${isPlaying ? `aria-label="${escapeHtml(dialogueCopy.replayAriaLabel || '')}"` : ''}>
                ${uiIcon(isPlaying ? 'arrow-counterclockwise' : 'play-fill')}
                <strong>${escapeHtml(isPlaying ? dialogueCopy.replayLabel : dialogueCopy.playLabel)}</strong>
              </button>
              <small role="status">${escapeHtml(isPlaying ? `${dialogueCopy.playingPrefix || ''} ${currentIndex + 1} / ${refs.length}` : dialogueCopy.listenHint || '')}</small>
            </div>`}
      </section>`;
    }

    function scrollCurrentDialogueLine() {
      const line = root.querySelector('.dialogue-line[aria-current="true"]');
      if (!line) return;
      ui.dialogueProgrammaticScroll = true;
      line.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
      const release = () => { ui.dialogueProgrammaticScroll = false; };
      if (typeof global.requestAnimationFrame === 'function') global.requestAnimationFrame(release);
      else global.queueMicrotask(release);
    }

    function scheduleDialogueFollow(snapshot, step) {
      if (
        !ui.dialogueFollowEnabled
        || step?.kind !== 'audio-sequence'
        || (step.audioSourceRefs || []).length < 2
        || snapshot.phase !== 'audio-playing'
      ) return;
      const followKey = `${snapshot.audio?.requestId || ''}:${snapshot.audio?.segmentId || ''}`;
      if (!snapshot.audio?.segmentId || followKey === ui.dialogueLastFollowKey) return;
      ui.dialogueLastFollowKey = followKey;
      global.queueMicrotask(scrollCurrentDialogueLine);
    }

    function stopDialogueFollowing() {
      if (ui.dialogueProgrammaticScroll || !ui.dialogueFollowEnabled) return;
      if (!root.querySelector('.dialogue-line[aria-current="true"]')) return;
      ui.dialogueFollowEnabled = false;
      const returnButton = root.querySelector('[data-action="dialogue-return-current"]');
      if (returnButton) returnButton.hidden = false;
    }

    function feedbackAudioCopy(snapshot, step) {
      if (ui.feedback?.tone === 'correct' && ui.feedback.message) {
        return ui.feedback.message;
      }
      if (snapshot.audio?.purpose === 'followup') {
        return feedbackAudioCopybook.followupFallback || '';
      }
      if (['match-entity', 'match-entity-batch'].includes(step?.kind)) {
        return step.challengeMode === 'word-form'
          ? feedbackAudioCopybook.wordFormCorrect
          : feedbackAudioCopybook.audioFormCorrect;
      }
      if (step?.kind === 'select-one') return feedbackAudioCopybook.selectCorrect || '';
      if (['place-in-slot', 'ordered-blocks'].includes(step?.kind)) {
        return feedbackAudioCopybook.orderedCorrect || '';
      }
      return feedbackAudioCopybook.genericCorrect || '';
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
          ${feedbackAudioCopy(snapshot, step) ? `<span>${escapeHtml(feedbackAudioCopy(snapshot, step))}</span>` : ''}
          ${feedbackAudioCopybook.autoContinue ? `<small>${escapeHtml(feedbackAudioCopybook.autoContinue)}</small>` : ''}
        </div>
      </div>`;
    }

    function audioItemsForStep(snapshot, step) {
      if (snapshot.audio?.refs?.length) return snapshot.audio.refs;
      if (step?.audioSourceRefs?.length || step?.audioContentRefs?.length) {
        return [
          ...(step.audioContentRefs || []).map(refId => ({ refId, ...(content(refId) || {}) })),
          ...(step.audioSourceRefs || []).map(refId => ({ refId, ...(source(refId) || {}) }))
        ];
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
      return `<section class="language-audio-panel" aria-label="${escapeHtml(languageAudioCopy.regionLabel || '')}">
        <div class="language-audio-panel__text">${lines}</div>
        <button class="language-audio-play" type="button" data-action="audio-play">${escapeHtml(isPlaying ? languageAudioCopy.replayLabel : languageAudioCopy.playLabel)}</button>
        ${(isPlaying ? languageAudioCopy.playingHint : languageAudioCopy.listenHint)
          ? `<small role="status">${escapeHtml(isPlaying ? languageAudioCopy.playingHint : languageAudioCopy.listenHint)}</small>`
          : ''}
      </section>`;
    }

    function sharedListenReplay(snapshot, step) {
      const challenge = activeChallenge(snapshot, step);
      const activeRef = snapshot.audio?.currentSegment?.sourceRef
        || snapshot.audio?.currentSegment?.contentRef
        || snapshot.challengeSourceRef
        || challenge?.sourceRef
        || step.challengeSourceRefs?.[snapshot.batchIndex]
        || step.sourceRef;
      if (!activeRef) return '';
      const requiredAudioPlaying = snapshot.phase === 'audio-playing'
        && snapshot.audio?.purpose === 'instruction';
      const requiredAudioBlocked = snapshot.phase === 'audio-blocked'
        && snapshot.audio?.purpose === 'instruction';
      const freeAudioPlaying = ui.freeAudioRef === activeRef;
      const playing = requiredAudioPlaying || freeAudioPlaying;
      const refKind = content(activeRef) ? 'content' : 'source';
      return `<div class="shared-listen-replay" role="group" aria-label="${escapeHtml(languageAudioCopy.regionLabel || '')}">
        <button class="language-audio-play shared-listen-replay__button${playing ? ' is-playing' : ''}" type="button" data-action="${requiredAudioBlocked ? 'audio-play' : 'free-audio'}"${requiredAudioBlocked ? '' : ` data-value="${escapeHtml(activeRef)}" data-ref-kind="${refKind}"`} aria-label="${escapeHtml(requiredAudioBlocked ? (languageAudioCopy.playLabel || '') : (languageAudioCopy.replayLabel || ''))}" title="${escapeHtml(requiredAudioBlocked ? (languageAudioCopy.playLabel || '') : (languageAudioCopy.replayLabel || ''))}"${playing ? ' disabled' : ''}>
          <img src="/poc/lesson1-2-experience/assets/starlight-audio-replay-v1.png" alt="" aria-hidden="true">
        </button>
      </div>`;
    }

    function audioPanel(snapshot, step, personIds = []) {
      if (
        snapshot.phase === 'audio-playing'
        && ['feedback', 'followup'].includes(snapshot.audio?.purpose)
      ) {
        return feedbackAudioPanel(snapshot, step);
      }
      if (step?.kind === 'audio-sequence' && step.currentSegmentHighlight === true) {
        return dialogueAudioPanel(snapshot, step, personIds);
      }
      return languageAudioPanel(snapshot, step);
    }

    function inPlaceAnswerPronunciation(snapshot, step) {
      if (['match-entity', 'match-entity-batch', 'connect-reference'].includes(step?.kind)) {
        return '';
      }
      const active = snapshot.audio?.currentSegment
        || snapshot.audio?.refs?.[snapshot.audio?.segmentIndex || 0];
      if (!active?.text) return '';
      return `<p class="language-audio-line answer-pronunciation-line is-current" lang="en" aria-current="true">${escapeHtml(active.text)}</p>`;
    }

    function fallbackPanel(snapshot) {
      const texts = (snapshot.audio?.unresolvedRefs || []).map(refId => (
        source(refId)?.text || content(refId)?.text
      )).filter(Boolean);
      const failure = unit.experience?.audioFailure || {};
      const manualRetryRequired = snapshot.audio?.manualRetryRequired === true
        || ['audio-failed', 'audio-fallback'].includes(snapshot.phase);
      const waitingForAutomaticRetry = snapshot.phase === 'audio-retry' && !manualRetryRequired;
      return `<section class="sound-fallback" role="alert">
        <span aria-hidden="true">${uiIcon('play-fill')}</span>
        <div><strong>${escapeHtml(waitingForAutomaticRetry ? (failure.retryingTitle || '') : (failure.title || ''))}</strong>${(texts.length || (waitingForAutomaticRetry ? failure.retryingCopy : failure.copy)) ? `<p>${texts.map(escapeHtml).join(' &nbsp; ') || escapeHtml(waitingForAutomaticRetry ? (failure.retryingCopy || '') : (failure.copy || ''))}</p>` : ''}</div>
        ${manualRetryRequired ? `<button type="button" data-action="audio-retry">${escapeHtml(failure.retryLabel || '')}</button>` : ''}
      </section>`;
    }

    function persistencePanel(snapshot) {
      const copy = unit.experience?.saveFailure || {};
      const retryable = snapshot.phase === 'persistence-retry';
      return `<section class="persistence-panel" role="status" aria-live="polite">
        <span class="persistence-panel__seal" aria-hidden="true">${uiIcon(retryable ? 'arrow-counterclockwise' : 'star-fill')}</span>
        <div><strong>${escapeHtml(retryable ? (copy.title || '') : (copy.savingTitle || ''))}</strong>
        ${(retryable ? copy.copy : copy.savingCopy) ? `<p>${escapeHtml(retryable ? copy.copy : copy.savingCopy)}</p>` : ''}</div>
        ${retryable ? `<button type="button" data-action="persistence-retry">${escapeHtml(copy.retryLabel || '')}</button>` : ''}
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
      </div><p class="gentle-hint">${escapeHtml(interactionCopy.exploreHint || '')}</p>`;
    }

    function matchResponse(snapshot, step) {
      const activeChallenge = (step.challenges || [])
        .find(challenge => challenge.challengeRef === snapshot.challengeRef);
      const challengeRef = snapshot.challengeSourceRef
        || activeChallenge?.sourceRef
        || step.challengeSourceRefs?.[snapshot.batchIndex];
      const replay = step.audioResponsePresentation?.startsWith('shared-')
        ? sharedListenReplay(snapshot, step)
        : '';
      return `<div class="inline-language-replay" data-response-kind="match"><div class="word-plaque" lang="en">${escapeHtml(source(challengeRef)?.text || '')}</div>${replay}</div>`;
    }

    function selectOneResponse(snapshot, step) {
      const optionSourceRefs = orderedFromSnapshot(step.optionSourceRefs, snapshot);
      if (step.optionPresentation === 'word-labels') {
        return `<div class="word-label-choice-grid" data-response-kind="select-one" data-option-presentation="word-labels">
          ${optionSourceRefs.map(sourceRef => {
            const selected = ui.selectedSourceRef === sourceRef;
            return `<button class="word-label-choice${selected ? ' is-selected' : ''}" type="button" data-action="select-source" data-value="${escapeHtml(sourceRef)}" lang="en">${escapeHtml(source(sourceRef)?.text || '')}</button>`;
          }).join('')}
        </div>`;
      }
      return `<div class="speech-choice-grid" data-response-kind="select-one">
        ${optionSourceRefs.map(sourceRef => `<article class="speech-choice-card${ui.selectedSourceRef === sourceRef ? ' is-selected' : ''}">
          <button class="speech-choice-card__body" type="button" data-action="select-source" data-value="${escapeHtml(sourceRef)}">
            <span class="speech-mark" aria-hidden="true">“</span><strong lang="en">${escapeHtml(source(sourceRef)?.text || '')}</strong>
          </button>
        </article>`).join('')}
      </div>`;
    }

    function grammarCompareResponse(step) {
      const statement = content(step.statementContentRef)?.text || '';
      const question = source(step.questionSourceRef)?.text || '';
      return `<div class="grammar-lab" data-response-kind="grammar-compare">
        <div class="grammar-lab__sign"><span>${escapeHtml(interactionCopy.grammarTitle || '')}</span><small>${escapeHtml(interactionCopy.grammarSubtitle || '')}</small></div>
        <div class="grammar-compare">
          <div class="grammar-sentence grammar-sentence--statement"><small>${escapeHtml(interactionCopy.statementLabel || '')}</small><strong lang="en">${escapeHtml(statement)}</strong></div>
          <span class="grammar-gear" aria-hidden="true">↔</span>
          <div class="grammar-sentence grammar-sentence--question"><small>${escapeHtml(interactionCopy.questionLabel || '')}</small><strong lang="en">${escapeHtml(question)}</strong></div>
        </div>
        <div class="grammar-notes">${(step.teachingTerms || []).map(item => `<p><b>${escapeHtml(item.term)}</b><span>${escapeHtml(item.copy)}</span></p>`).join('')}</div>
        <button class="grammar-continue" type="button" data-action="step-continue">${escapeHtml(interactionCopy.grammarContinue || '')}</button>
      </div>`;
    }

    function connectReferenceResponse(snapshot, step) {
      const answerText = source(step.answerSourceRef || step.sourceRef)?.text || '';
      return `<div class="reference-lab" data-response-kind="connect-reference">
        <div class="inline-language-replay"><div class="reference-answer" lang="en">${emphasizedCatalogText(answerText, step.emphasisText)}</div>${step.audioResponsePresentation === 'shared-locked-until-ended' ? sharedListenReplay(snapshot, step) : ''}</div>
        <div class="grammar-notes">${(step.teachingTerms || []).map(item => `<p><b>${escapeHtml(item.term)}</b><span>${escapeHtml(item.copy)}</span></p>`).join('')}</div>
      </div>`;
    }

    function detectErrorResponse(snapshot, step) {
      const sourceOptions = (step.optionSourceRefs || []).map(sourceRef => ({
        refKind: 'source', refId: sourceRef, text: source(sourceRef)?.text || ''
      }));
      const diagnostic = step.diagnosticContentRef ? [{
        refKind: 'content', refId: step.diagnosticContentRef,
        text: content(step.diagnosticContentRef)?.text || ''
      }] : [];
      const options = orderedFromSnapshot(
        [sourceOptions[0], ...diagnostic, ...sourceOptions.slice(1)].filter(Boolean),
        snapshot,
        option => option.refId
      );
      return `<div class="error-detect" data-response-kind="detect-error">
        <p class="error-detect__question">${escapeHtml(step.prompt)}</p>
        <div class="speech-choice-grid">${options.map(option => choiceButton({
          action: 'select-diagnostic', value: option.refId, label: option.text,
          selected: option.refKind === 'source'
            ? ui.selectedSourceRef === option.refId
            : ui.selectedContentRef === option.refId,
          visual: '<span class="speech-mark" aria-hidden="true">“</span>',
          extra: `data-ref-kind="${escapeHtml(option.refKind)}"`
        })).join('')}</div>
      </div>`;
    }

    function storySequenceResponse(snapshot, step) {
      const panels = step.sequencePanels || [];
      const presentedPanels = orderedFromSnapshot(panels, snapshot, panel => panel.panelId);
      const selected = new Map(ui.selectedSequenceIds.map((panelId, index) => [panelId, index + 1]));
      const momentArt = panel => `<div class="story-sequence-card__art" data-visual-moment="${escapeHtml(panel.visualMoment || panel.panelId)}" aria-hidden="true">
        ${(panel.characterEntityIds || []).map((entityId, index) => `<div class="story-moment__character story-moment__character--${index === 0 ? 'left' : 'right'}">${entityPicture(entity(entityId))}</div>`).join('')}
        ${(panel.propEntityIds || []).map(entityId => `<div class="story-moment__prop">${entityPicture(entity(entityId))}</div>`).join('')}
        ${panel.cueSymbol ? `<div class="story-moment__signal">${escapeHtml(panel.cueSymbol)}</div>` : ''}
      </div>`;
      return `<div class="story-sequence" data-response-kind="ordered-sequence">
        <div class="story-sequence__track" aria-label="${escapeHtml(interactionCopy.sequenceTrackLabel || '')}">
          ${ui.selectedSequenceIds.length
            ? ui.selectedSequenceIds.map((panelId, index) => `<button type="button" data-action="remove-sequence" data-value="${escapeHtml(panelId)}"><b>${index + 1}</b><span>${escapeHtml(panels.find(panel => panel.panelId === panelId)?.title || '')}</span></button>`).join('')
            : `<span>${escapeHtml(interactionCopy.sequenceInstruction || '')}</span>`}
        </div>
        <div class="story-sequence__bank">${presentedPanels.map(panel => {
          const position = selected.get(panel.panelId);
          return `<article class="story-sequence-card${position ? ' is-selected' : ''}">
            ${position ? `<b class="story-sequence-card__order">${position}</b>` : ''}
            ${momentArt(panel)}
            <h3>${escapeHtml(panel.title)}</h3>
            <div class="story-sequence-card__english" lang="en">${(panel.sourceRefs || []).map(sourceRef => `<span><em>${escapeHtml(source(sourceRef)?.text || '')}</em><button type="button" data-action="free-audio" data-value="${escapeHtml(sourceRef)}" data-ref-kind="source" aria-label="${escapeHtml(interactionCopy.listenOnlyPrefix || '')} ${escapeHtml(source(sourceRef)?.text || '')}">${uiIcon('play-fill')}</button></span>`).join('')}</div>
            <button type="button" data-action="add-sequence" data-value="${escapeHtml(panel.panelId)}" ${position ? 'disabled' : ''}>${escapeHtml(position ? `${interactionCopy.sequencePositionPrefix || ''} ${position} ${interactionCopy.sequencePositionSuffix || ''}` : interactionCopy.addNext || '')}</button>
          </article>`;
        }).join('')}</div>
      </div>`;
    }

    function continueResponse(step) {
      return `<div class="story-beat" data-response-kind="story-continue">
        <span class="story-beat__spark" aria-hidden="true">✦</span>
        <p>${escapeHtml(step.prompt)}</p>
        <button type="button" data-action="step-continue">${escapeHtml(interactionCopy.continueCase || '')}</button>
      </div>`;
    }

    function performRule(step) {
      if (step.answerRule?.type === 'perform-action') return step.answerRule;
      return step.answerRule?.rules?.find(rule => rule.type === 'perform-action') || null;
    }

    function actionSubmitLabel(step) {
      const action = performRule(step)?.action;
      return interactionCopy.actionLabels?.[action]
        || interactionCopy.actionLabels?.default
        || '';
    }

    function actionResponse(snapshot, step, sceneEntityIds = []) {
      const actionRule = performRule(step) || {};
      const storedCase = ui.selectedCaseByTask[snapshot.microtaskId];
      const itemIds = actionRule.entityFactId && storedCase
        ? [storedCase]
        : (step.entityIds || []).filter(entityId => !sceneEntityIds.includes(entityId));
      if (['stamp', 'pull'].includes(actionRule.action)) {
        return `<button class="milestone-action" type="button" data-action="perform-direct">${escapeHtml(actionSubmitLabel(step))}</button>`;
      }
      const characterTarget = (step.targetEntityIds || [])
        .some(entityId => entity(entityId).entityKind === 'character');
      if (characterTarget) return '';
      const targetIds = (step.targetEntityIds || [])
        .filter(entityId => entity(entityId).entityKind !== 'character');
      return `<div class="action-stage" data-response-kind="perform-action">
        ${itemIds.length ? `<div class="action-stage__rail"><span>${escapeHtml(interactionCopy.selectItem || '')}</span>${itemIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId, { compact: true })
        })).join('')}</div>` : ''}
        ${targetIds.length ? `<span class="action-arrow" aria-hidden="true">${uiIcon('arrow-right')}</span>` : ''}
        ${targetIds.length ? `<div class="action-stage__rail"><span>${escapeHtml(interactionCopy.selectTarget || '')}</span>${targetIds.map(entityId => choiceButton({
          action: 'select-target', value: entityId, label: entity(entityId).title,
          selected: ui.selectedTargetId === entityId, visual: entityVisual(entityId, { compact: true })
        })).join('')}</div>` : ''}
      </div>`;
    }

    function slotResponse(step) {
      const optionEntityIds = step.optionEntityIds || step.entityIds || [];
      return `<div class="slot-stage" data-response-kind="place-in-slot">
        <div class="prop-shelf">${optionEntityIds.map(entityId => choiceButton({
          action: 'select-entity', value: entityId, label: entity(entityId).title,
          selected: ui.selectedEntityId === entityId, visual: entityVisual(entityId)
        })).join('')}</div>
        <div class="sentence-slot"><span>${escapeHtml(interactionCopy.completeQuestionLabel || '')}</span><strong>${ui.selectedEntityId ? escapeHtml(entity(ui.selectedEntityId).title) : escapeHtml(interactionCopy.putObjectPrompt || '')}</strong></div>
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
      return '';
    }

    function orderedBlocksResponse(snapshot, step) {
      const selectedCase = ui.selectedCaseByTask[snapshot.microtaskId];
      const nounRef = selectedCase ? entity(selectedCase).sourceRef : null;
      const available = orderedFromSnapshot([
        ...(step.blockContentRefs || []),
        ...(step.blockSourceRefs || []),
        nounRef
      ].filter(Boolean), snapshot);
      const expectedLength = step.answerRule?.acceptedOrder?.length
        || step.answerRule?.acceptedByEntityId?.[selectedCase]?.length
        || available.length;
      const challenge = activeChallenge(snapshot, step);
      const boundaryRefs = snapshot.supportDepth >= 2
        ? new Set(challenge?.boundaryContentRefs || [])
        : new Set();
      return `<div class="block-builder" data-response-kind="ordered-blocks">
        <div class="block-builder__track">${ui.selectedBlockRefs.length
          ? ui.selectedBlockRefs.map(refId => `<button class="${boundaryRefs.has(refId) ? 'is-boundary-cue' : ''}" type="button" data-action="remove-block" data-value="${escapeHtml(refId)}">${escapeHtml(content(refId)?.text || source(refId)?.text || '')}</button>`).join('')
          : `<span>${escapeHtml(interactionCopy.orderedBlocksPrefix || '')} ${expectedLength} ${escapeHtml(interactionCopy.orderedBlocksSuffix || '')}</span>`}</div>
        <div class="block-builder__bank">${available.map(refId => choiceButton({
          action: 'add-block', value: refId, label: content(refId)?.text || source(refId)?.text || '',
          selected: ui.selectedBlockRefs.includes(refId),
          extra: boundaryRefs.has(refId) ? 'data-boundary-cue="true"' : ''
        })).join('')}</div>
        ${step.allowReset && ui.selectedBlockRefs.length ? `<button class="block-builder__reset" type="button" data-action="reset-blocks">${escapeHtml(interactionCopy.reorderLabel || '')}</button>` : ''}
      </div>`;
    }

    function responsePanel(snapshot, step, sceneEntityIds = []) {
      if (!step) return '';
      if (step.kind === 'grammar-compare') return grammarCompareResponse(step);
      if (step.kind === 'connect-reference') return connectReferenceResponse(snapshot, step);
      if (step.kind === 'detect-error') return detectErrorResponse(snapshot, step);
      if (step.kind === 'ordered-sequence') return storySequenceResponse(snapshot, step);
      if (step.kind === 'explore-batch') return exploreResponse(snapshot, step);
      if (!step.answerRule && step.submissionMode !== 'formal') return continueResponse(step);
      if (['match-entity', 'match-entity-batch'].includes(step.kind)) return matchResponse(snapshot, step);
      if (step.kind === 'select-one') return selectOneResponse(snapshot, step);
      if (step.kind === 'select-entity') return entityChoiceResponse();
      if (step.kind === 'perform-action') return actionResponse(snapshot, step, sceneEntityIds);
      if (step.kind === 'place-in-slot') return slotResponse(step);
      if (step.kind === 'select-case') return caseResponse(step);
      if (step.kind === 'ordered-blocks') return orderedBlocksResponse(snapshot, step);
      return '';
    }

    function feedbackMarkup(snapshot, step) {
      if (!ui.feedback) return '';
      if (ui.feedback.tone === 'correct') return '';
      if (ui.feedback.tone === 'support') {
        return `<aside class="feedback-mission-bar" data-tone="support" role="status" aria-live="polite">
          <span class="feedback-mission-bar__seal" aria-hidden="true">${uiIcon('star-fill')}</span>
          <div class="feedback-mission-bar__copy">
            <small>${escapeHtml(feedbackCopy.labels?.support || '')}</small>
            <p>${escapeHtml(ui.feedback.message)}</p>
          </div>
        </aside>`;
      }
      const cat = unit.entities?.['explorer-cat'];
      const labels = feedbackCopy.labels || {};
      const emblem = ui.feedback.tone === 'partner' && cat?.assetSrc
        ? `<span class="feedback-bubble__guide" aria-hidden="true"><img src="${escapeHtml(cat.assetSrc)}" alt=""></span>`
        : '<span class="feedback-bubble__seal" aria-hidden="true"></span>';
      const changedExample = ui.feedback.tone === 'partner' && step?.rescueModel?.text
        ? `<div class="feedback-bubble__example" data-changed-example="true">${escapeHtml(step.rescueModel.text)}</div>`
        : '';
      return `<aside class="feedback-bubble" data-tone="${escapeHtml(ui.feedback.tone)}" role="status" aria-live="polite">
        ${emblem}
        <div class="feedback-bubble__copy"><strong>${escapeHtml(labels[ui.feedback.tone] || '')}</strong><p>${escapeHtml(ui.feedback.message)}</p>${changedExample}</div>
      </aside>`;
    }

    function milestoneCompanion(label) {
      const item = entity('explorer-cat');
      return `<div class="milestone-companion" data-character-identity="explorer-cat" role="img" aria-label="${escapeHtml(label)}">
        ${entityPicture(item)}
      </div>`;
    }

    function sceneFramePicture() {
      const frames = unit.experience?.sceneFrames;
      if (frames?.selectionPolicy !== 'responsive-picture') return '';
      const portrait = frames.masters?.portrait;
      const wide = frames.masters?.wide;
      if (!portrait?.assetSrc || !wide?.assetSrc) return '';
      const portraitSources = [portrait.assetSrc, portrait.assetFallbackSrc]
        .filter((value, index, values) => value && values.indexOf(value) === index)
        .map(value => `<source media="${escapeHtml(portrait.media || '(max-aspect-ratio: 4/5)')}" srcset="${escapeHtml(value)}" type="${imageMime(value)}">`)
        .join('');
      const wideSources = [wide.assetSrc, wide.assetFallbackSrc]
        .filter((value, index, values) => value && values.indexOf(value) === index)
        .map(value => `<source media="${escapeHtml(wide.media || '(min-aspect-ratio: 4/5)')}" srcset="${escapeHtml(value)}" type="${imageMime(value)}">`)
        .join('');
      return `<picture class="scene-frame" data-scene-frame-policy="responsive-picture" aria-hidden="true">
        ${portraitSources}${wideSources}
        <img src="${escapeHtml(wide.assetFallbackSrc || wide.assetSrc)}" alt="" data-frame-id="${escapeHtml(wide.frameId || 'wide')}">
      </picture>`;
    }

    function sceneSurfaceStyle(propSurface) {
      const masters = unit.experience?.sceneFrames?.masters;
      const portraitActor = masters?.portrait?.actorLayout;
      const wideActor = masters?.wide?.actorLayout;
      if (!portraitActor || !wideActor) return '';
      const percent = value => Math.max(0, Math.min(100, Number(value)));
      const actorValues = [
        portraitActor.targetHeightPercent, portraitActor.groundYPercent,
        wideActor.targetHeightPercent, wideActor.groundYPercent
      ];
      if (!actorValues.every(value => Number.isFinite(Number(value)))) return '';
      const declarations = [
        `--scene-actor-height-portrait:${percent(portraitActor.targetHeightPercent)}%`,
        `--scene-actor-ground-portrait:${percent(portraitActor.groundYPercent)}%`,
        `--scene-actor-height-wide:${percent(wideActor.targetHeightPercent)}%`,
        `--scene-actor-ground-wide:${percent(wideActor.groundYPercent)}%`
      ];
      if (propSurface) {
        const portrait = masters?.portrait?.surfaceAnchors?.[propSurface];
        const wide = masters?.wide?.surfaceAnchors?.[propSurface];
        const surfaceValues = [
          portrait?.xPercent, portrait?.yPercent, wide?.xPercent, wide?.yPercent
        ];
        if (surfaceValues.every(value => Number.isFinite(Number(value)))) {
          declarations.push(
            `--scene-surface-x-portrait:${percent(portrait.xPercent)}%`,
            `--scene-surface-y-portrait:${percent(portrait.yPercent)}%`,
            `--scene-surface-x-wide:${percent(wide.xPercent)}%`,
            `--scene-surface-y-wide:${percent(wide.yPercent)}%`
          );
        }
      }
      return ` style="${declarations.join(';')}"`;
    }

    function commonShell(body, snapshot, shellPresentation = {}) {
      const authoredTask = currentTask(snapshot)?.task;
      const presentationMoment = currentPresentationMoment(snapshot, authoredTask);
      const outcomeScene = ['chapter-stop', 'rest-stop', 'unit-built'].includes(snapshot.status);
      const sceneMode = shellPresentation.sceneMode
        || (outcomeScene ? 'outcome-rest' : (authoredTask?.presentation?.sceneMode || ''));
      const sceneVariant = shellPresentation.sceneVariant
        || (outcomeScene
          ? (snapshot.nextRestStop?.restStopId || snapshot.status)
          : (authoredTask?.presentation?.sceneVariant || ''));
      const propSurface = shellPresentation.propSurface
        || (outcomeScene ? '' : (authoredTask?.presentation?.propSurface || ''));
      const surfaceStyle = sceneSurfaceStyle(propSurface);
      const presentationMomentId = presentationMoment?.momentId || '';
      const primaryMotion = presentationMoment?.primaryMotion?.kind || '';
      const endStateId = presentationMoment?.endState?.stateId || '';
      const visibleLanguageRefs = presentationMoment?.visibleLanguageRefs?.join(' ') || '';
      const candidatePresentation = currentStep(snapshot)?.candidatePresentation || '';
      const challenge = activeChallenge(snapshot, currentStep(snapshot));
      const answerEvidenceChannel = challenge?.answerFairness?.targetEvidenceChannel || '';
      const intentionalSupportRefs = (challenge?.answerFairness?.intentionalPreSubmitSupport || [])
        .map(item => item.sourceRef)
        .join(' ');
      const taskIndex = Math.max(0, tasks.findIndex(item => item.task.microtaskId === snapshot.microtaskId));
      const durableUnit = ledger.read().units?.[unit.unitId] || {};
      const completed = new Set([
        ...(durableUnit.completedMicrotaskIds || []),
        ...(durableUnit.skippedMicrotaskIds || [])
      ]).size;
      const progress = snapshot.status === 'unit-built'
        ? 100
        : Math.round(((ui.previewMode ? taskIndex + 1 : completed) / tasks.length) * 100);
      const shownPosition = snapshot.status === 'unit-built'
        ? tasks.length
        : (snapshot.microtaskId ? taskIndex + 1 : completed);
      const stageNavigationAvailable = stagePreviewEnabled && snapshot.status !== 'idle';
      const backgroundInactive = (ui.restartConfirmOpen || ui.roleSkipConfirmOpen || ui.stageMapOpen)
        ? ' inert aria-hidden="true"'
        : '';
      const highlightedPreviewId = ui.previewMode
        ? (snapshot.microtaskId || ui.previewTargetId)
        : null;
      const reachedIds = reachedMicrotaskIds(snapshot);
      const stageButtons = tasks.map(({ task }, index) => {
        const runtimeNavigation = snapshot.stageNavigation?.find(item => (
          item.microtaskId === task.microtaskId
        ));
        const status = runtimeNavigation?.status
          || (reachedIds.has(task.microtaskId) ? 'completed' : 'locked');
        const reached = ['completed', 'current', 'skipped'].includes(status);
        const stateLabel = status === 'current'
          ? stageNavigationCopy.currentLabel
          : (status === 'completed'
              ? stageNavigationCopy.practiceLabel
              : (status === 'skipped'
                  ? `${stageNavigationCopy.skippedLabel || ''} · ${stageNavigationCopy.completeSkippedLabel || ''}`
                  : stageNavigationCopy.lockedLabel));
        return `<button class="stage-jump-button${status === 'current' ? ' is-current' : ''}${status === 'skipped' ? ' is-skipped' : ''}${task.microtaskId === highlightedPreviewId ? ' is-previewed' : ''}${reached ? ' is-reached' : ' is-locked'}" type="button" data-action="preview-jump" data-value="${escapeHtml(task.microtaskId)}" aria-label="${escapeHtml(navigationCopy.stageAriaPrefix || '')} ${index + 1}${escapeHtml(navigationCopy.stageAriaSeparator || '')}${escapeHtml(task.presentation.title)}，${escapeHtml(stateLabel || '')}" ${status === 'current' ? 'aria-current="true"' : ''} ${reached ? '' : 'disabled aria-disabled="true"'}>
          <b>${index + 1}</b><span><strong>${escapeHtml(task.presentation.title)}</strong><small>${escapeHtml(stateLabel || '')}</small></span>
        </button>`;
      }).join('');
      const manualDialogue = unlockedManualDialogue(snapshot);
      const manualDialogueTool = manualDialogue ? `<button class="stage-practice-tool" type="button" data-action="start-outcome-practice" data-value="${escapeHtml(manualDialogue.practiceId)}">
          <span aria-hidden="true">✦</span><span>${manualDialogue.entryKicker ? `<small>${escapeHtml(manualDialogue.entryKicker)}</small>` : ''}<strong>${escapeHtml(manualDialogue.entryLabel || '')}</strong>${manualDialogue.entryHint ? `<p>${escapeHtml(manualDialogue.entryHint)}</p>` : ''}</span>
        </button>` : '';
      const settings = ui.settingsOpen ? `<aside class="settings-tray" id="course-settings-panel" aria-label="${escapeHtml(navigationCopy.settingsLabel || '')}">
          ${stageNavigationAvailable ? `<button class="restart-control stage-navigation-control" type="button" data-action="open-stages" aria-haspopup="dialog" aria-controls="course-stage-map">
            <span aria-hidden="true">${uiIcon('arrow-right')}</span><span><strong>${escapeHtml(navigationCopy.chooseStageTitle || '')}</strong>${navigationCopy.chooseStageCopy ? `<small>${escapeHtml(navigationCopy.chooseStageCopy)}</small>` : ''}</span>
          </button>` : ''}
          ${ui.previewMode
            ? `<button class="restart-control preview-exit-control" type="button" data-action="preview-exit">
                <span aria-hidden="true">${uiIcon('arrow-counterclockwise')}</span><span><strong>${escapeHtml(navigationCopy.exitPreviewTitle || '')}</strong>${navigationCopy.exitPreviewCopy ? `<small>${escapeHtml(navigationCopy.exitPreviewCopy)}</small>` : ''}</span>
              </button>`
            : `<button class="restart-control" type="button" data-action="restart-request">
                <span aria-hidden="true">${uiIcon('arrow-counterclockwise')}</span><span><strong>${escapeHtml(navigationCopy.restartTitle || '')}</strong>${navigationCopy.restartCopy ? `<small>${escapeHtml(navigationCopy.restartCopy)}</small>` : ''}</span>
              </button>`}
        </aside>` : '';
      const reviewEntry = dueReviewAvailable() && reviewRun.href ? `<a class="review-entry" href="${escapeHtml(reviewRun.href)}">
          <span>${escapeHtml(reviewRun.copy?.entryKicker || '')}</span>
          <strong>${escapeHtml(reviewRun.copy?.entryTitle || '')}</strong>
          <b>${escapeHtml(reviewRun.copy?.startLabel || '')}${uiIcon('arrow-right')}</b>
        </a>` : '';
      const stageMapPreviewExit = ui.previewMode ? `<button class="restart-control preview-exit-control stage-map__preview-exit" type="button" data-action="preview-exit">
          <span aria-hidden="true">${uiIcon('arrow-counterclockwise')}</span><span><strong>${escapeHtml(navigationCopy.exitPreviewTitle || '')}</strong>${navigationCopy.exitPreviewCopy ? `<small>${escapeHtml(navigationCopy.exitPreviewCopy)}</small>` : ''}</span>
        </button>` : '';
      const stageMap = ui.stageMapOpen && stageNavigationAvailable ? `<div class="stage-map-backdrop">
          <section class="stage-map" id="course-stage-map" role="dialog" aria-modal="true" aria-labelledby="course-stage-map-title">
            <header class="stage-map__header">
              <div>${!ui.previewMode && navigationCopy.previewNoSave ? `<p>${escapeHtml(navigationCopy.previewNoSave)}</p>` : ''}<h2 id="course-stage-map-title">${escapeHtml(navigationCopy.heading || '')}</h2></div>
              <button type="button" data-action="close-stages" aria-label="${escapeHtml(navigationCopy.closeMapLabel || '')}">×</button>
            </header>
            ${reviewEntry}
            <div class="stage-jump-grid" role="group" aria-label="${escapeHtml(navigationCopy.jumpLabel || '')}">${stageButtons}</div>
            ${manualDialogueTool}
            ${stageMapPreviewExit}
          </section>
        </div>` : '';
      const restartConfirm = ui.restartConfirmOpen ? `<div class="restart-backdrop">
          <section class="restart-dialog" role="dialog" aria-modal="true" aria-labelledby="restart-dialog-title" aria-describedby="restart-dialog-copy">
            <span class="restart-seal" aria-hidden="true">${uiIcon('arrow-counterclockwise')}</span>
            ${navigationCopy.dialogKicker ? `<p class="kicker">${escapeHtml(navigationCopy.dialogKicker)}</p>` : ''}
            <h2 id="restart-dialog-title">${escapeHtml(navigationCopy.dialogTitle || '')}</h2>
            <p id="restart-dialog-copy">${escapeHtml(navigationCopy.dialogCopy || '')}</p>
            <div class="restart-dialog__actions">
              <button class="restart-cancel" type="button" data-action="restart-cancel">${escapeHtml(navigationCopy.cancelRestart || '')}</button>
              <button class="restart-confirm" type="button" data-action="restart-confirm">${escapeHtml(navigationCopy.confirmRestart || '')}</button>
            </div>
          </section>
        </div>` : '';
      const roleSkipCopy = uiCopy.roleSkip || {};
      const roleSkipDescription = roleSkipCopy.dialogCopy
        ? `<p id="role-skip-dialog-copy">${escapeHtml(roleSkipCopy.dialogCopy)}</p>`
        : '';
      const roleSkipConfirm = ui.roleSkipConfirmOpen ? `<div class="restart-backdrop role-skip-backdrop">
          <section class="restart-dialog role-skip-dialog" role="dialog" aria-modal="true" aria-labelledby="role-skip-dialog-title"${roleSkipDescription ? ' aria-describedby="role-skip-dialog-copy"' : ''}>
            <h2 id="role-skip-dialog-title">${escapeHtml(roleSkipCopy.dialogTitle || '')}</h2>
            ${roleSkipDescription}
            <div class="restart-dialog__actions">
              <button class="restart-cancel" type="button" data-action="role-skip-cancel">${escapeHtml(roleSkipCopy.cancelLabel || '')}</button>
              <button class="restart-confirm" type="button" data-action="role-skip-confirm">${escapeHtml(roleSkipCopy.confirmLabel || '')}</button>
            </div>
          </section>
        </div>` : '';
      return `<div class="station-app" data-view="${escapeHtml(ui.view)}" data-preview-mode="${ui.previewMode ? 'true' : 'false'}" data-skip-recovery="${ui.skipRecoveryMode ? 'true' : 'false'}" data-runtime-status="${escapeHtml(snapshot.status)}" data-runtime-phase="${escapeHtml(snapshot.phase || 'none')}" data-runtime-microtask="${escapeHtml(snapshot.microtaskId || 'none')}" data-runtime-step="${escapeHtml(snapshot.stepId || 'none')}" data-runtime-challenge="${escapeHtml(snapshot.challengeRef || 'none')}" data-adventure-hearts="${snapshot.adventureHeartsRemaining ?? snapshot.adventureHearts ?? 3}" data-partner-rescue="${snapshot.rescueUsed || snapshot.partnerRescueActive ? 'true' : 'false'}" data-build-stage="${snapshot.buildStage || 0}" data-scene-mode="${escapeHtml(sceneMode)}" data-scene-variant="${escapeHtml(sceneVariant)}" data-prop-surface="${escapeHtml(propSurface)}" data-presentation-moment="${escapeHtml(presentationMomentId)}" data-primary-motion="${escapeHtml(primaryMotion)}" data-end-state="${escapeHtml(endStateId)}" data-candidate-presentation="${escapeHtml(candidatePresentation)}" data-answer-evidence-channel="${escapeHtml(answerEvidenceChannel)}" data-intentional-support-refs="${escapeHtml(intentionalSupportRefs)}">
        <p class="portrait-hint" role="status">${escapeHtml(uiCopy.scene?.portraitHint || '')}</p>
        <header class="station-header"${backgroundInactive}>
          <div class="station-brand"><span>${escapeHtml(unit.experience?.lessonLabel || '')}</span><strong tabindex="-1">${escapeHtml(currentTask(snapshot)?.task.navigationTitle || unit.title)}</strong></div>
          ${stageNavigationAvailable
            ? `<button class="case-progress" type="button" data-action="toggle-stages" aria-expanded="${ui.stageMapOpen ? 'true' : 'false'}" aria-controls="course-stage-map" aria-label="${escapeHtml(ui.previewMode ? navigationCopy.previewProgressLabel : navigationCopy.dayProgressLabel)}"><span style="--progress:${progress}%"></span><b>${shownPosition} / ${tasks.length}</b></button>`
            : `<div class="case-progress is-static" role="status" aria-label="${escapeHtml(navigationCopy.dayProgressLabel || '')}"><span style="--progress:${progress}%"></span><b>${shownPosition} / ${tasks.length}</b></div>`}
          <div class="header-actions">
            <button class="settings-toggle" type="button" data-action="toggle-settings" aria-expanded="${ui.settingsOpen ? 'true' : 'false'}" aria-controls="course-settings-panel" aria-label="${escapeHtml(navigationCopy.settingsLabel || '')}">${uiIcon('gear-fill')}</button>
          </div>
          ${ui.previewMode ? `<button class="preview-mode-badge" type="button" data-action="preview-exit">${escapeHtml(navigationCopy.previewBadge || '')}</button>` : ''}
          ${settings}
        </header>
        <section class="station-world" data-scene-mode="${escapeHtml(sceneMode)}" data-scene-variant="${escapeHtml(sceneVariant)}" data-prop-surface="${escapeHtml(propSurface)}" data-presentation-moment="${escapeHtml(presentationMomentId)}" data-primary-motion="${escapeHtml(primaryMotion)}" data-end-state="${escapeHtml(endStateId)}" data-candidate-presentation="${escapeHtml(candidatePresentation)}" data-visible-language-refs="${escapeHtml(visibleLanguageRefs)}" data-answer-evidence-channel="${escapeHtml(answerEvidenceChannel)}" data-intentional-support-refs="${escapeHtml(intentionalSupportRefs)}"${surfaceStyle}${backgroundInactive}>${sceneFramePicture()}${body}</section>
        ${stageMap}
        ${restartConfirm}
        ${roleSkipConfirm}
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
        <button class="door-handle" type="button" data-action="start">${escapeHtml(resumed ? navigationCopy.resumeActionLabel : arrival.actionLabel)}${uiIcon('arrow-right')}</button>
      </div>`, snapshot);
    }

    function briefingMarkup(snapshot) {
      const briefing = unit.experience?.briefing || {};
      return commonShell(`<article class="briefing-card" aria-labelledby="briefing-title">
        <figure class="briefing-visual">
          <picture>${briefing.imageFallbackSrc ? `<source srcset="${escapeHtml(briefing.imageSrc || '')}" type="${imageMime(briefing.imageSrc)}">` : ''}<img src="${escapeHtml(briefing.imageFallbackSrc || briefing.imageSrc || '')}" alt="${escapeHtml(briefing.imageAlt || '')}"></picture>
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
      const moment = currentPresentationMoment(snapshot, task);
      // The painted scene remains visible while audio, transitions and durable
      // saves finish, but it is only an answer surface during the one phase in
      // which the runtime is actually accepting a child response.
      const interactiveSceneStep = snapshot.phase === 'awaiting-response'
        && snapshot.presentationAwaitingEnd !== true
        ? step
        : null;
      resetStepSelections(snapshot);
      const fallbackPersonIds = [
        ...(task.presentation?.characterEntityIds || []),
        ...(step?.characterEntityIds || []),
        ...(step?.targetEntityIds || []),
        ...((['select-case', 'select-entity'].includes(step?.kind)) ? (step.optionEntityIds || []) : [])
      ];
      const personIds = [...new Set(moment
        ? moment.participantEntityIds
        : fallbackPersonIds
      )].filter(entityId => unit.entities?.[entityId]?.entityKind === 'character');
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
      const fallbackSceneEntityIds = [
        ...(task.presentation?.sceneEntityIds || []),
        ...(step?.sceneEntityIds || []),
        ...(['match-entity', 'match-entity-batch'].includes(step?.kind)
          ? (step.optionEntityIds || [])
          : [])
      ];
      const sceneEntityIds = orderedFromSnapshot(
        [...new Set([
          ...fallbackSceneEntityIds,
          ...(moment?.focusEntityIds || [])
        ].filter(entityId => unit.entities?.[entityId]?.entityKind !== 'character'))],
        snapshot
      );
      const knowledgeLayer = knowledgeLayerMarkup(task, moment);
      const explicitPresentation = explicitPresentationMarkup(
        snapshot, step, adultEntityIds, moment
      );
      const manualPresentation = knowledgeLayer || explicitPresentation;
      const sharedListenAnswer = step?.audioResponsePresentation === 'shared-locked-until-ended';
      const sharedInstructionAudio = sharedListenAnswer
        && ['audio-ready', 'audio-playing', 'audio-suspended', 'audio-blocked'].includes(snapshot.phase)
        && (!snapshot.audio?.purpose || snapshot.audio.purpose === 'instruction');
      const correctAudioInPlace = ui.feedback?.tone === 'correct'
        && ['audio-ready', 'audio-playing', 'audio-suspended'].includes(snapshot.phase)
        && [
          'feedback', 'followup', 'word-form-answer', 'story-response'
        ].includes(snapshot.audio?.purpose);
      const body = manualPresentation || (
        ['persistence-retry', 'answered-awaiting-save', 'unit-verifying'].includes(snapshot.phase)
          ? persistencePanel(snapshot)
          : (['audio-fallback', 'audio-retry', 'audio-failed'].includes(snapshot.phase)
              ? fallbackPanel(snapshot)
              : (['audio-ready', 'audio-playing', 'audio-suspended', 'audio-blocked'].includes(snapshot.phase)
                  ? (sharedInstructionAudio || correctAudioInPlace
                      ? responsePanel(snapshot, step, sceneEntityIds)
                      : audioPanel(snapshot, step, adultEntityIds))
                  : responsePanel(snapshot, step, sceneEntityIds)))
      );
      const supportFeedback = ui.feedback?.tone === 'support';
      const integratedCorrectFeedback = ui.feedback?.tone === 'correct'
        && ['audio-ready', 'audio-playing'].includes(snapshot.phase);
      const partnerRescueScene = snapshot.phase === 'rescue-model'
        || snapshot.phase === 'partner-rescue';
      const responseLockedByPresentation = snapshot.presentationAwaitingEnd === true
        && !manualPresentation;
      const responseLockedByRequiredAudio = sharedInstructionAudio
        && snapshot.phase !== 'audio-blocked';
      const responseLocked = responseLockedByPresentation
        || responseLockedByRequiredAudio
        || correctAudioInPlace
        || snapshot.phase === 'audio-suspended';
      const hideCompletedAssembly = correctAudioInPlace && step?.kind === 'ordered-blocks';
      const visibleMomentLanguage = manualPresentation
        ? ''
        : momentLanguageMarkup(snapshot, step, moment);
      const promptAlreadyRendered = Boolean(
        step?.promptSourceRef
        && moment?.visibleLanguageRefs?.includes(step.promptSourceRef)
      );
      const dedicatedRecovery = [
        'persistence-retry', 'answered-awaiting-save', 'unit-verifying',
        'audio-fallback', 'audio-retry', 'audio-failed'
      ].includes(snapshot.phase);
      const sceneActionSurface = !manualPresentation && !dedicatedRecovery && (
        step?.kind === 'select-entity'
        || (
          step?.kind === 'perform-action'
          && (step.targetEntityIds || []).some(entityId => (
            unit.entities?.[entityId]?.entityKind === 'character'
          ))
        )
      );
      const promptRenderedInScene = adultEntityIds.length > 0
        && !promptAlreadyRendered
        && !sceneActionSurface;
      const supportActionBeforeGuidance = supportFeedback && step?.kind === 'select-entity';
      return commonShell(`${promptRenderedInScene ? `<p class="stage-prompt" data-copy-purpose="task" data-copy-priority="primary">${escapeHtml(step?.prompt || task.presentation.prompt)}</p>` : ''}
        <div class="scene-people scene-cast${adultEntityIds.length ? ' scene-cast--with-adults' : ''}" data-scene-mode="${escapeHtml(task.presentation.sceneMode || '')}" data-scene-variant="${escapeHtml(task.presentation.sceneVariant || '')}" data-presentation-moment="${escapeHtml(moment?.momentId || '')}" aria-label="${escapeHtml(uiCopy.scene?.charactersLabel || '')}">
          ${adultEntityIds.map(id => sceneCharacter(id, snapshot, step, moment, task, Boolean(interactiveSceneStep))).join('')}
          ${showSceneCompanion ? sceneCompanion(snapshot, step, moment, task, Boolean(interactiveSceneStep)) : ''}
        </div>
        ${sceneEntityIds.length ? `<div class="scene-props" data-prop-surface="${escapeHtml(task.presentation.propSurface || '')}" aria-label="${escapeHtml(uiCopy.scene?.itemsLabel || '')}">${sceneEntityIds.map(id => sceneProp(id, snapshot, step, moment, task, Boolean(interactiveSceneStep))).join('')}</div>` : ''}
        <section class="mission-console${adultEntityIds.length ? ' mission-console--with-cast' : ''}${supportFeedback ? ' mission-console--support' : ''}${partnerRescueScene ? ' mission-console--rewinding' : ''}${sceneActionSurface ? ' mission-console--scene-action' : ''}"${sceneActionSurface ? ' data-task-surface="scene-action"' : ''}${sharedListenAnswer ? ` data-audio-response-presentation="${escapeHtml(step.audioResponsePresentation)}"` : ''}>
          ${shouldShowAdventureHearts(snapshot, step) ? adventureHeartGauge(snapshot) : ''}
          ${supportFeedback ? '' : visibleMomentLanguage}
          ${(promptAlreadyRendered || promptRenderedInScene) ? '' : `<p class="mission-prompt" data-copy-purpose="task" data-copy-priority="primary">${escapeHtml(step?.prompt || task.presentation.prompt)}</p>`}
          ${supportActionBeforeGuidance ? `<div class="support-action-instruction">${body}</div>` : ''}
          ${supportFeedback ? `<div class="support-guidance">${feedbackMarkup(snapshot, step)}${visibleMomentLanguage}</div>` : ''}
          <div class="interaction-space" data-response-fields ${(partnerRescueScene || responseLocked) ? 'inert' : ''}${partnerRescueScene ? ' aria-hidden="true"' : ''}>${correctAudioInPlace ? inPlaceAnswerPronunciation(snapshot, step) : ''}${supportActionBeforeGuidance || hideCompletedAssembly ? '' : body}</div>
          ${supportFeedback || integratedCorrectFeedback ? '' : feedbackMarkup(snapshot, step)}
        </section>`, snapshot);
    }

    function outcomePracticeEntryMarkup(snapshot) {
      const practice = outcomePracticeForSnapshot(snapshot);
      if (!practice) return '';
      return `<aside class="optional-practice-entry" aria-label="${escapeHtml(uiCopy.outcomePractice?.regionLabel || '')}">
        <div>${practice.entryKicker ? `<small>${escapeHtml(practice.entryKicker)}</small>` : ''}<strong>${escapeHtml(practice.entryLabel || '')}</strong>${practice.entryHint ? `<p>${escapeHtml(practice.entryHint)}</p>` : ''}</div>
        <button type="button" data-action="start-outcome-practice" data-value="${escapeHtml(practice.practiceId)}">${escapeHtml(practice.entryActionLabel || practice.entryLabel || '')}</button>
      </aside>`;
    }

    function practicePortrait(entityId, active = false) {
      const item = entity(entityId);
      return `<figure class="practice-portrait${active ? ' is-child-role' : ''}" data-entity-id="${escapeHtml(entityId)}">
        ${entityPicture(item)}
        <figcaption><small>${active ? escapeHtml(uiCopy.outcomePractice?.roleLabel || '') : ''}</small><strong>${escapeHtml(item.title)}</strong></figcaption>
      </figure>`;
    }

    function practiceSpeakerEntityId(sourceRef, fallbackEntityId = null) {
      const speaker = source(sourceRef)?.speaker;
      return (outcomePracticeConfig.castOrder || []).find(entityId => (
        entity(entityId).voiceRole === speaker
      )) || fallbackEntityId;
    }

    function fixedPracticeCharacter(entityId, side, practiceSnapshot, {
      childRoleEntityId = null,
      completed = false,
      selectable = false
    } = {}) {
      const item = entity(entityId);
      const audioSpeakerEntityId = ui.practiceAudioRef
        ? practiceSpeakerEntityId(ui.practiceAudioRef)
        : null;
      const currentSpeaker = (audioSpeakerEntityId || practiceSnapshot.currentTurn?.speakerEntityId) === entityId;
      const childRole = childRoleEntityId === entityId;
      const tag = selectable ? 'button' : 'div';
      const action = selectable
        ? ` type="button" data-action="practice-role-select" data-value="${escapeHtml((outcomePracticeConfig.rounds || []).find(round => round.roleEntityId === entityId)?.roundId || '')}"`
        : '';
      return `<${tag} class="role-practice-character role-practice-character--${side}${childRole ? ' is-child-role' : ''}${currentSpeaker ? ' is-current-speaker' : ''}${completed ? ' is-completed-role' : ''}"${action} data-entity-id="${escapeHtml(entityId)}">
        ${entityPicture(item)}
        <span class="role-practice-character__name">${escapeHtml(item.title)}</span>
        ${childRole ? `<strong class="role-practice-character__badge">${escapeHtml(outcomePracticeConfig.currentRoleLabel || '')}</strong>` : ''}
        ${currentSpeaker ? `<strong class="role-practice-character__speaker">${escapeHtml(outcomePracticeConfig.currentSpeakerLabel || '')}</strong>` : ''}
        ${completed ? `<span class="role-practice-character__complete" aria-label="${escapeHtml(outcomePracticeConfig.completedRoleLabel || '')}">✓</span>` : ''}
      </${tag}>`;
    }

    function fixedPracticeWorld(practiceSnapshot, inner, {
      childRoleEntityId = null,
      selectable = false
    } = {}) {
      const cast = outcomePracticeConfig.castOrder || [];
      const completed = new Set(practiceSnapshot.completedRoundIds || []);
      const roleCompleted = entityId => (outcomePracticeConfig.rounds || []).some(round => (
        round.roleEntityId === entityId && completed.has(round.roundId)
      ));
      const propId = outcomePracticeConfig.propEntityIds?.[0];
      return `<div class="role-practice-world" data-practice-kind="${escapeHtml(practiceSnapshot.kind)}">
        ${cast[0] ? fixedPracticeCharacter(cast[0], 'left', practiceSnapshot, {
          childRoleEntityId, completed: roleCompleted(cast[0]), selectable
        }) : ''}
        ${cast[1] ? fixedPracticeCharacter(cast[1], 'right', practiceSnapshot, {
          childRoleEntityId, completed: roleCompleted(cast[1]), selectable
        }) : ''}
        ${propId ? `<div class="role-practice-counter-surface" data-prop-surface="${escapeHtml(outcomePracticeConfig.propSurface || '')}">
          <div class="role-practice-counter-prop" data-entity-id="${escapeHtml(propId)}">${entityPicture(entity(propId))}</div>
        </div>` : ''}
        <section class="role-practice-console">${inner}</section>
      </div>`;
    }

    function roleEnactmentLine(sourceRef, practiceSnapshot, round) {
      const turn = source(sourceRef) || {};
      const childTurn = (round.hiddenTurnRefs || []).includes(sourceRef);
      const revealed = (practiceSnapshot.revealedTurnRefs || []).includes(sourceRef);
      const hidden = childTurn && !revealed;
      const current = practiceSnapshot.currentTurn?.turnRef === sourceRef;
      const speakerId = practiceSpeakerEntityId(sourceRef, round.partnerEntityId);
      return `<li class="role-practice-line${hidden ? ' is-hidden' : ''}${current ? ' is-current' : ''}${current && practiceSnapshot.phase === 'audio-playing' ? ' is-playing' : ''}" data-source-ref="${escapeHtml(sourceRef)}">
        <span>${escapeHtml(entity(speakerId).title)}</span>
        <strong>${hidden ? escapeHtml(outcomePracticeConfig.hiddenTurnLabel || outcomePracticeConfig.revealLabel || '') : escapeHtml(turn.text || '')}</strong>
      </li>`;
    }

    function roleSkipControl(practiceSnapshot) {
      const mainSnapshot = runtime.snapshot();
      const task = currentTask(mainSnapshot)?.task;
      if (
        task?.skipPolicy?.kind !== 'role-round-child-confirmed'
        || mainSnapshot.mode === 'microtask-v2-sandbox'
        || !['awaiting-reveal', 'audio-retry'].includes(practiceSnapshot.phase)
      ) {
        return '';
      }
      const copy = uiCopy.roleSkip || {};
      return `<button class="quiet-action role-skip-action" type="button" data-action="practice-skip">${escapeHtml(copy.actionLabel || '')}</button>`;
    }

    function roleRecoveryControl() {
      const mainSnapshot = runtime.snapshot();
      if (mainSnapshot.mode !== 'microtask-v2-skip-recovery') return '';
      return `<button class="quiet-action role-recovery-return" type="button" data-action="practice-return-learning">${escapeHtml(outcomePracticeConfig.returnLearningLabel || '')}</button>`;
    }

    function roleEnactmentPracticeMarkup(practiceSnapshot) {
      const phase = practiceSnapshot.phase;
      const round = practiceSnapshot.currentRound;
      const completed = new Set(practiceSnapshot.completedRoundIds || []);
      const skipped = new Set(practiceSnapshot.skippedRoundIds || []);
      const recoveryActive = runtime.snapshot().mode === 'microtask-v2-skip-recovery';
      if (phase === 'role-selection') {
        const choices = (outcomePracticeConfig.rounds || []).map(roleRound => {
          const done = completed.has(roleRound.roundId);
          const wasSkipped = skipped.has(roleRound.roundId);
          const status = done
            ? outcomePracticeConfig.completedRoleLabel
            : (wasSkipped ? outcomePracticeConfig.skippedRoleLabel : '');
          return `<div class="role-choice-slot${done ? ' is-complete' : ''}${wasSkipped ? ' is-skipped' : ''}${!done && !wasSkipped ? ' is-primary' : ''}">
            <button class="role-choice" type="button" data-action="practice-role-select" data-value="${escapeHtml(roleRound.roundId)}" ${done ? 'disabled' : ''}><strong>${escapeHtml(roleRound.title || '')}</strong></button>
            ${status ? `<small class="role-choice-status" role="status">${escapeHtml(status)}</small>` : ''}
          </div>`;
        }).join('');
        return fixedPracticeWorld(practiceSnapshot, `<div class="role-practice-copy">
            ${outcomePracticeConfig.kicker ? `<p class="kicker">${escapeHtml(outcomePracticeConfig.kicker)}</p>` : ''}
            <h1 data-copy-purpose="task" data-copy-priority="primary">${escapeHtml(outcomePracticeConfig.title || '')}</h1>
            ${outcomePracticeConfig.intro ? `<p>${escapeHtml(outcomePracticeConfig.intro)}</p>` : ''}
          </div>
          ${outcomePracticeConfig.roleSelectionLabel ? `<div class="role-choice-label">${escapeHtml(outcomePracticeConfig.roleSelectionLabel)}</div>` : ''}
          <div class="role-choice-grid">${choices}</div>
          <div class="outcome-practice-actions role-recovery-actions">${roleRecoveryControl()}</div>`, { selectable: false });
      }
      if (phase === 'all-roles-complete') {
        return fixedPracticeWorld(practiceSnapshot, `<div class="role-practice-copy role-practice-copy--complete">
            ${outcomePracticeConfig.kicker ? `<p class="kicker">${escapeHtml(outcomePracticeConfig.kicker)}</p>` : ''}
            <h1>${escapeHtml(outcomePracticeConfig.allCompleteTitle || '')}</h1>
            ${outcomePracticeConfig.allCompleteCopy ? `<p>${escapeHtml(outcomePracticeConfig.allCompleteCopy)}</p>` : ''}
          </div>
          <div class="outcome-practice-actions role-practice-finish-actions">
            ${recoveryActive
              ? `<button class="door-handle" type="button" data-action="practice-complete-recovery">${escapeHtml(outcomePracticeConfig.returnLearningLabel || '')}</button>`
              : `<button class="door-handle" type="button" data-action="practice-enter-manual">${escapeHtml(outcomePracticeConfig.manualEntryLabel || '')}</button>
                <button class="door-handle door-handle--secondary" type="button" data-action="practice-continue-course">${escapeHtml(outcomePracticeConfig.continueCourseLabel || '')}</button>`}
          </div>`, { selectable: false });
      }
      const lines = round ? (round.dialogueTurnRefs || [])
        .map(sourceRef => roleEnactmentLine(sourceRef, practiceSnapshot, round)).join('') : '';
      const hint = practiceSnapshot.currentHint;
      const hintMarkup = hint ? `<aside class="manual-dialogue-hint role-enactment-hint" role="status">
          <span><small>${escapeHtml(outcomePracticeConfig.hintIntentLabel || '')}</small><strong>${escapeHtml(hint.intent || '')}</strong></span>
          ${hint.openingChunk ? `<span><small>${escapeHtml(outcomePracticeConfig.hintOpeningLabel || '')}</small><strong>${escapeHtml(hint.openingChunk)}</strong></span>` : ''}
        </aside>` : '';
      let action = '';
      if (phase === 'awaiting-reveal') {
        const hintControl = practiceSnapshot.hintLevel < 2
          ? `<button class="quiet-action" type="button" data-action="practice-hint">${escapeHtml(practiceSnapshot.hintLevel === 0 ? outcomePracticeConfig.hintLabel : outcomePracticeConfig.nextHintLabel)}</button>`
          : '';
        action = `<button class="door-handle" type="button" data-action="practice-reveal">${escapeHtml(outcomePracticeConfig.revealLabel || '')}</button>${hintControl}${roleSkipControl(practiceSnapshot)}`;
      } else if (phase === 'audio-retry') {
        action = `<div class="practice-audio-retry" role="status"><p>${escapeHtml(outcomePracticeConfig.audioRetryCopy || '')}</p><button class="door-handle" type="button" data-action="practice-audio-retry">${escapeHtml(outcomePracticeConfig.audioRetryLabel || '')}</button></div>${roleSkipControl(practiceSnapshot)}`;
      } else if (phase === 'round-save-failed' || phase === 'round-skip-save-failed') {
        const skippedSave = phase === 'round-skip-save-failed';
        action = `<div class="practice-audio-retry" role="status"><p>${escapeHtml(skippedSave ? outcomePracticeConfig.roundSkipSaveRetryCopy : outcomePracticeConfig.roundSaveRetryCopy || '')}</p><button class="door-handle" type="button" data-action="practice-round-save-retry">${escapeHtml(skippedSave ? outcomePracticeConfig.roundSkipSaveRetryLabel : outcomePracticeConfig.roundSaveRetryLabel || '')}</button></div>`;
      }
      return fixedPracticeWorld(practiceSnapshot, `<div class="role-practice-copy role-practice-copy--active">
          ${outcomePracticeConfig.kicker ? `<p class="kicker">${escapeHtml(outcomePracticeConfig.kicker)}</p>` : ''}
          <h1 data-copy-purpose="task" data-copy-priority="primary">${escapeHtml(round?.title || '')}</h1>${round?.instruction ? `<p>${escapeHtml(round.instruction)}</p>` : ''}
        </div>
        <ol class="role-practice-dialogue">${lines}</ol>
        ${hintMarkup}
        <div class="outcome-practice-actions">${action}</div>`, {
        childRoleEntityId: round?.roleEntityId || null
      });
    }

    function manualDialogueLine(sourceRef, practiceSnapshot) {
      const turn = source(sourceRef) || {};
      const revealed = (practiceSnapshot.revealedTurnRefs || []).includes(sourceRef);
      const current = practiceSnapshot.currentTurn?.turnRef === sourceRef;
      const speakerId = practiceSpeakerEntityId(sourceRef);
      const replayable = revealed && practiceSnapshot.phase !== 'audio-playing';
      return `<li class="role-practice-line manual-dialogue-line${revealed ? ' is-revealed' : ' is-hidden'}${current ? ' is-current' : ''}${ui.practiceAudioRef === sourceRef ? ' is-playing' : ''}" data-source-ref="${escapeHtml(sourceRef)}">
        <span>${escapeHtml(entity(speakerId).title)}</span>
        ${revealed
          ? `<button type="button" data-action="practice-line-replay" data-value="${escapeHtml(sourceRef)}" ${replayable ? '' : 'disabled'}><strong>${escapeHtml(turn.text || '')}</strong></button>`
          : `<strong>${current ? escapeHtml(outcomePracticeConfig.hiddenTurnLabel || '') : ''}</strong>`}
      </li>`;
    }

    function manualDialoguePracticeMarkup(practiceSnapshot) {
      const finished = practiceSnapshot.phase === 'manual-complete';
      const lines = (outcomePracticeConfig.dialogueTurnRefs || [])
        .map(sourceRef => manualDialogueLine(sourceRef, practiceSnapshot)).join('');
      const hint = practiceSnapshot.currentHint;
      const hintMarkup = hint ? `<aside class="manual-dialogue-hint" role="status">
          <span><small>${escapeHtml(outcomePracticeConfig.hintIntentLabel || '')}</small><strong>${escapeHtml(hint.intent || '')}</strong></span>
          ${hint.openingChunk ? `<span><small>${escapeHtml(outcomePracticeConfig.hintOpeningLabel || '')}</small><strong>${escapeHtml(hint.openingChunk)}</strong></span>` : ''}
        </aside>` : '';
      let action = '';
      if (practiceSnapshot.phase === 'awaiting-manual-reveal') {
        const hintControl = practiceSnapshot.hintLevel < 2
          ? `<button class="quiet-action" type="button" data-action="practice-hint">${escapeHtml(practiceSnapshot.hintLevel === 0 ? outcomePracticeConfig.hintLabel : outcomePracticeConfig.nextHintLabel)}</button>`
          : '';
        action = `<button class="door-handle" type="button" data-action="practice-reveal">${escapeHtml(outcomePracticeConfig.revealLabel || '')}</button>${hintControl}`;
      } else if (practiceSnapshot.phase === 'audio-retry') {
        action = `<div class="practice-audio-retry" role="status"><p>${escapeHtml(outcomePracticeConfig.audioRetryCopy || '')}</p><button class="door-handle" type="button" data-action="practice-audio-retry">${escapeHtml(outcomePracticeConfig.audioRetryLabel || '')}</button></div>`;
      } else if (finished) {
        action = `<button class="door-handle" type="button" data-action="practice-restart">${escapeHtml(outcomePracticeConfig.restartLabel || '')}</button>
          <button class="door-handle door-handle--secondary" type="button" data-action="practice-return-mainline">${escapeHtml(outcomePracticeConfig.returnMainlineLabel || '')}</button>`;
      }
      const title = finished ? outcomePracticeConfig.finishedTitle : outcomePracticeConfig.kicker;
      const intro = finished ? outcomePracticeConfig.finishedCopy : outcomePracticeConfig.intro;
      return fixedPracticeWorld(practiceSnapshot, `<div class="role-practice-copy${finished ? ' role-practice-copy--complete' : ''}">
          <h1${finished ? '' : ' data-copy-purpose="task" data-copy-priority="primary"'}>${escapeHtml(title || '')}</h1>${intro ? `<p>${escapeHtml(intro)}</p>` : ''}
        </div>
        <ol class="role-practice-dialogue manual-dialogue-list">${lines}</ol>
        ${hintMarkup}
        <div class="outcome-practice-actions">${action}${finished ? '' : `<button class="quiet-action" type="button" data-action="practice-exit">${escapeHtml(outcomePracticeConfig.exitLabel || '')}</button>`}</div>`, {
        childRoleEntityId: null
      });
    }

    function roleSwapPracticeMarkup(practiceSnapshot) {
      const round = practiceSnapshot.currentRound;
      const people = [round.roleEntityId, round.partnerEntityId].filter(Boolean);
      const revealedTurnRefs = new Set(practiceSnapshot.revealedTurnRefs || []);
      const lines = (round.dialogueTurnRefs || []).map(sourceRef => {
        const turn = source(sourceRef) || {};
        const childTurn = (round.hiddenTurnRefs || []).includes(sourceRef);
        const hidden = childTurn && !revealedTurnRefs.has(sourceRef);
        const current = practiceSnapshot.currentTurn?.turnRef === sourceRef;
        const speakerId = people.find(entityId => entity(entityId).voiceRole === turn.speaker)
          || round.partnerEntityId;
        return `<li class="practice-dialogue-line${hidden ? ' is-hidden-turn' : ''}${current ? ' is-current-turn' : ''}" data-source-ref="${escapeHtml(sourceRef)}">
          <span>${escapeHtml(entity(speakerId).title)}</span>
          ${hidden
            ? `<strong>${escapeHtml(uiCopy.outcomePractice?.hiddenTurnLabel || '')}</strong><small>${escapeHtml(uiCopy.outcomePractice?.revealHint || '')}</small>`
            : `<strong>${escapeHtml(turn.text || '')}</strong>${current && practiceSnapshot.phase === 'audio-playing'
              ? `<small class="practice-playing-label">${escapeHtml(uiCopy.outcomePractice?.playingLabel || '')}</small>`
              : ''}`}
        </li>`;
      }).join('');
      const finalRound = practiceSnapshot.currentIndex === outcomePracticeConfig.rounds.length - 1;
      let primaryAction = '';
      if (practiceSnapshot.phase === 'awaiting-reveal') {
        primaryAction = `<button class="door-handle" type="button" data-action="practice-reveal">${escapeHtml(outcomePracticeConfig.revealLabel || '')}</button>`;
      } else if (practiceSnapshot.phase === 'audio-retry') {
        primaryAction = `<div class="practice-audio-retry" role="status"><p>${escapeHtml(uiCopy.outcomePractice?.audioRetryCopy || '')}</p><button class="door-handle" type="button" data-action="practice-audio-retry">${escapeHtml(uiCopy.outcomePractice?.audioRetryLabel || '')}</button></div>`;
      } else if (practiceSnapshot.phase === 'round-complete') {
        primaryAction = `<button class="door-handle" type="button" data-action="practice-${finalRound ? 'finish' : 'next'}">${escapeHtml(finalRound ? outcomePracticeConfig.finishLabel : outcomePracticeConfig.nextLabel)}</button>`;
      }
      return `<div class="practice-cast">${people.map(entityId => practicePortrait(entityId, entityId === round.roleEntityId)).join('')}</div>
        <div class="practice-copy"><h1 data-copy-purpose="task" data-copy-priority="primary">${escapeHtml(round.title || '')}</h1>${(round.instruction || outcomePracticeConfig.intro) ? `<p>${escapeHtml(round.instruction || outcomePracticeConfig.intro)}</p>` : ''}</div>
        <ol class="practice-dialogue">${lines}</ol>
        <div class="outcome-practice-actions">
          ${primaryAction}
          <button class="quiet-action" type="button" data-action="practice-exit">${escapeHtml(outcomePracticeConfig.exitLabel || '')}</button>
        </div>`;
    }

    function recapOptionMarkup(option, practiceSnapshot) {
      const selected = practiceSnapshot.lastResponse?.optionId === option.optionId;
      const answered = ['audio-playing', 'audio-retry', 'answered'].includes(practiceSnapshot.phase);
      if (option.entityId) {
        const item = entity(option.entityId);
        return `<button class="practice-option${selected ? ' is-selected' : ''}" type="button" data-action="practice-submit" data-value="${escapeHtml(option.optionId)}" ${answered ? 'disabled' : ''}>${entityVisual(option.entityId, { compact: true })}<strong>${escapeHtml(option.label || item.title)}</strong></button>`;
      }
      const item = source(option.sourceRef) || {};
      return `<button class="practice-option practice-option--language${selected ? ' is-selected' : ''}" type="button" data-action="practice-submit" data-value="${escapeHtml(option.optionId)}" ${answered ? 'disabled' : ''}><strong>${escapeHtml(item.text || '')}</strong></button>`;
    }

    function caseRecapPracticeMarkup(practiceSnapshot) {
      const item = practiceSnapshot.currentItem;
      const prompt = content(item.promptRef) || {};
      const finalItem = practiceSnapshot.currentIndex === outcomePracticeConfig.items.length - 1;
      const feedbackCopy = practiceSnapshot.lastResponse
        ? (practiceSnapshot.lastResponse.correct
            ? outcomePracticeConfig.correctCopy
            : outcomePracticeConfig.wrongCopy)
        : '';
      const feedback = feedbackCopy
        ? `<p class="practice-answer-feedback is-${practiceSnapshot.lastResponse.correct ? 'correct' : 'wrong'}" role="status">${escapeHtml(feedbackCopy)}</p>`
        : '';
      const answerAudio = practiceSnapshot.lastResponse?.correct
        ? source(item.correctAudioRef)
        : null;
      const answerAudioMarkup = answerAudio
        ? `<div class="practice-answer-audio${practiceSnapshot.phase === 'audio-retry' ? ' is-retry' : ''}" data-source-ref="${escapeHtml(item.correctAudioRef)}"><strong>${escapeHtml(answerAudio.text || '')}</strong>${practiceSnapshot.phase === 'audio-playing' ? `<small>${escapeHtml(uiCopy.outcomePractice?.playingLabel || '')}</small>` : ''}</div>`
        : '';
      let primaryAction = '';
      if (practiceSnapshot.phase === 'audio-retry') {
        primaryAction = `<div class="practice-audio-retry" role="status"><p>${escapeHtml(uiCopy.outcomePractice?.audioRetryCopy || '')}</p><button class="door-handle" type="button" data-action="practice-audio-retry">${escapeHtml(uiCopy.outcomePractice?.audioRetryLabel || '')}</button></div>`;
      } else if (practiceSnapshot.phase === 'answered') {
        primaryAction = `<button class="door-handle" type="button" data-action="practice-${finalItem ? 'finish' : 'next'}">${escapeHtml(finalItem ? outcomePracticeConfig.finishLabel : outcomePracticeConfig.nextLabel)}</button>`;
      }
      return `<div class="practice-copy">
          <p class="practice-position">${escapeHtml(uiCopy.outcomePractice?.itemPrefix || '')}${practiceSnapshot.currentIndex + 1}${escapeHtml(uiCopy.outcomePractice?.itemSeparator || '')}${outcomePracticeConfig.items.length}${escapeHtml(uiCopy.outcomePractice?.itemSuffix || '')}</p>
          <h1 data-copy-purpose="task" data-copy-priority="primary">${escapeHtml(prompt.text || '')}</h1>${outcomePracticeConfig.intro ? `<p>${escapeHtml(outcomePracticeConfig.intro)}</p>` : ''}
        </div>
        ${(item.sceneEntityIds || []).length ? `<div class="practice-scene-entities">${item.sceneEntityIds.map(entityId => entityVisual(entityId)).join('')}</div>` : ''}
        <div class="practice-options">${(item.options || []).map(option => recapOptionMarkup(option, practiceSnapshot)).join('')}</div>
        ${feedback}
        ${answerAudioMarkup}
        <div class="outcome-practice-actions">
          ${primaryAction}
          <button class="quiet-action" type="button" data-action="practice-exit">${escapeHtml(outcomePracticeConfig.exitLabel || '')}</button>
        </div>`;
    }

    function outcomePracticeMarkup(snapshot, practiceSnapshot) {
      if (practiceSnapshot.kind === 'role-enactment') {
        return commonShell(`<section class="outcome-practice-card outcome-practice-card--role-enactment" data-practice-id="${escapeHtml(practiceSnapshot.practiceId)}" data-practice-kind="role-enactment" data-practice-phase="${escapeHtml(practiceSnapshot.phase)}" data-practice-session="${escapeHtml(practiceSnapshot.practiceSessionId)}" aria-label="${escapeHtml(uiCopy.outcomePractice?.regionLabel || '')}">
          ${roleEnactmentPracticeMarkup(practiceSnapshot)}
        </section>`, snapshot, outcomePracticeConfig);
      }
      if (practiceSnapshot.kind === 'manual-dialogue') {
        return commonShell(`<section class="outcome-practice-card outcome-practice-card--manual-dialogue" data-practice-id="${escapeHtml(practiceSnapshot.practiceId)}" data-practice-kind="manual-dialogue" data-practice-phase="${escapeHtml(practiceSnapshot.phase)}" data-practice-session="${escapeHtml(practiceSnapshot.practiceSessionId)}" aria-label="${escapeHtml(uiCopy.outcomePractice?.regionLabel || '')}">
          ${manualDialoguePracticeMarkup(practiceSnapshot)}
        </section>`, snapshot, outcomePracticeConfig);
      }
      if (practiceSnapshot.status === 'finished') {
        return commonShell(`<section class="outcome-practice-card practice-finished" aria-label="${escapeHtml(uiCopy.outcomePractice?.regionLabel || '')}">
          ${milestoneCompanion(previewCopy.companionCompleteLabel || '')}
          ${outcomePracticeConfig.kicker ? `<p class="kicker">${escapeHtml(outcomePracticeConfig.kicker)}</p>` : ''}
          <h1>${escapeHtml(outcomePracticeConfig.finishedTitle || '')}</h1>
          ${outcomePracticeConfig.finishedCopy ? `<p>${escapeHtml(outcomePracticeConfig.finishedCopy)}</p>` : ''}
          <button class="door-handle" type="button" data-action="practice-exit">${escapeHtml(outcomePracticeConfig.returnLabel || '')}</button>
        </section>`, snapshot);
      }
      const body = practiceSnapshot.kind === 'role-swap'
        ? roleSwapPracticeMarkup(practiceSnapshot)
        : caseRecapPracticeMarkup(practiceSnapshot);
      return commonShell(`<section class="outcome-practice-card outcome-practice-card--${escapeHtml(practiceSnapshot.kind)}" data-practice-id="${escapeHtml(practiceSnapshot.practiceId)}" data-practice-kind="${escapeHtml(practiceSnapshot.kind)}" data-practice-phase="${escapeHtml(practiceSnapshot.phase)}" data-practice-session="${escapeHtml(practiceSnapshot.practiceSessionId)}" aria-label="${escapeHtml(uiCopy.outcomePractice?.regionLabel || '')}">
        ${outcomePracticeConfig.kicker ? `<p class="kicker">${escapeHtml(outcomePracticeConfig.kicker)}</p>` : ''}
        ${body}
      </section>`, snapshot);
    }

    function chapterMarkup(snapshot) {
      const chapter = unit.experience?.restStops?.[snapshot.nextRestStop?.restStopId]
        || unit.experience?.chapterStop
        || {};
      const kicker = ui.previewMode ? previewCopy.kicker : chapter.kicker;
      const detail = ui.previewMode
        ? previewCopy.chapterCopy
        : (ui.resting ? (chapter.restingCopy || previewCopy.defaultRestingCopy || '') : chapter.copy);
      return commonShell(`<div class="milestone-card chapter-card">
        ${milestoneCompanion(previewCopy.companionChapterLabel || '')}
        <div class="milestone-lamp" aria-hidden="true"><span>★</span></div>
        ${kicker ? `<p class="kicker">${escapeHtml(kicker)}</p>` : ''}
        <h1>${escapeHtml(chapter.title)}</h1>
        ${detail ? `<p>${escapeHtml(detail)}</p>` : ''}
        <div class="chapter-actions">
          <button class="door-handle" type="button" data-action="chapter-continue">${escapeHtml(chapter.continueLabel)}</button>
          ${ui.previewMode
            ? `<button class="quiet-action" type="button" data-action="preview-exit">${escapeHtml(previewCopy.exitLabel || '')}</button>`
            : `<button class="door-handle door-handle--secondary" type="button" data-action="rest">${escapeHtml(chapter.restLabel)}</button>`}
        </div>
        ${ui.previewMode ? '' : outcomePracticeEntryMarkup(snapshot)}
      </div>`, snapshot);
    }

    function completionMarkup(snapshot) {
      const complete = unit.experience?.completion || {};
      const kicker = ui.previewMode ? previewCopy.completeKicker : complete.kicker;
      const detail = ui.previewMode ? previewCopy.completeCopy : complete.copy;
      return commonShell(`<div class="milestone-card completion-card">
        ${milestoneCompanion(previewCopy.companionCompleteLabel || '')}
        <div class="opening-stars" aria-hidden="true"><i>★</i><i>★</i><i>★</i></div>
        ${kicker ? `<p class="kicker">${escapeHtml(kicker)}</p>` : ''}
        <h1>${escapeHtml(complete.title)}</h1>
        ${detail ? `<p>${escapeHtml(detail)}</p>` : ''}
        ${!ui.previewMode && previewCopy.savedTitle
          ? `<div class="saved-landmark"><strong>${escapeHtml(previewCopy.savedTitle)}</strong></div>`
          : ''}
        <div class="chapter-actions completion-actions">
          ${ui.previewMode
            ? `<button class="quiet-action" type="button" data-action="preview-exit">${escapeHtml(previewCopy.exitLabel || '')}</button>`
            : `<button class="door-handle" type="button" data-action="replay">${escapeHtml(complete.replayLabel)}</button><a class="door-handle door-handle--secondary" href="${escapeHtml(complete.leaveHref || '/')}">${escapeHtml(complete.leaveLabel || '')}</a>`}
        </div>
        ${ui.previewMode ? '' : outcomePracticeEntryMarkup(snapshot)}
      </div>`, snapshot);
    }

    function stageReplayCompleteMarkup(snapshot) {
      const returnLocation = ui.stageReplayOrigin?.locationLabel || unit.title;
      return commonShell(`<div class="milestone-card stage-replay-complete" data-stage-replay-complete="true">
        <div class="milestone-lamp stage-replay-complete__seal" aria-hidden="true"><span>✓</span></div>
        ${previewCopy.completeKicker ? `<p class="kicker">${escapeHtml(previewCopy.completeKicker)}</p>` : ''}
        <h1>${escapeHtml(previewCopy.replayCompleteTitle || '')}</h1>
        ${previewCopy.replayCompleteCopy ? `<p>${escapeHtml(previewCopy.replayCompleteCopy)}</p>` : ''}
        <div class="stage-replay-complete__origin"><span>${escapeHtml(previewCopy.returnLocationPrefix || '')}</span><strong>${escapeHtml(returnLocation)}</strong></div>
        <div class="chapter-actions stage-replay-complete__actions">
          <button class="door-handle" type="button" data-action="preview-exit">${escapeHtml(previewCopy.returnLearningLabel || '')}</button>
          <button class="door-handle door-handle--secondary" type="button" data-action="preview-select-stage">${escapeHtml(previewCopy.chooseAnotherStageLabel || '')}</button>
        </div>
      </div>`, snapshot);
    }

    function stableDomKey(node) {
      if (!node || node.nodeType !== 1) return null;
      if (node.id) return `id:${node.id}`;
      const keyedAttributes = [
        'data-entity-id',
        'data-language-ref',
        'data-source-ref',
        'data-content-ref',
        'data-challenge-ref',
        'data-sequence-id',
        'data-block-ref'
      ];
      for (const name of keyedAttributes) {
        const value = node.getAttribute(name);
        if (value) return `${name}:${value}`;
      }
      const action = node.getAttribute('data-action');
      if (action) return `action:${action}:${node.getAttribute('data-value') || ''}`;
      const stableClasses = [
        'station-header',
        'station-world',
        'scene-frame',
        'scene-people',
        'scene-props',
        'mission-console',
        'interaction-space'
      ];
      const stableClass = stableClasses.find(name => node.classList?.contains(name));
      return stableClass ? `class:${stableClass}` : null;
    }

    function sameDomShape(current, next) {
      if (!current || !next || current.nodeType !== next.nodeType) return false;
      if (current.nodeType === 1 && current.tagName !== next.tagName) return false;
      const currentKey = stableDomKey(current);
      const nextKey = stableDomKey(next);
      return currentKey || nextKey ? currentKey === nextKey : true;
    }

    function syncElementAttributes(current, next) {
      const preserveEntryAnimation = current.classList?.contains('is-entering');
      for (const attribute of [...current.attributes]) {
        if (!next.hasAttribute(attribute.name)) current.removeAttribute(attribute.name);
      }
      for (const attribute of [...next.attributes]) {
        if (current.getAttribute(attribute.name) !== attribute.value) {
          current.setAttribute(attribute.name, attribute.value);
        }
      }
      if (preserveEntryAnimation) current.classList.add('is-entering');
    }

    function morphDomNode(current, next) {
      if (current.nodeType === 3 || current.nodeType === 8) {
        if (current.nodeValue !== next.nodeValue) current.nodeValue = next.nodeValue;
        return;
      }
      if (current.nodeType !== 1) return;
      syncElementAttributes(current, next);
      morphDomChildren(current, next);
    }

    function morphDomChildren(current, next) {
      const originalChildren = [...current.childNodes];
      const used = new Set();
      const targetChildren = [...next.childNodes].map(nextChild => {
        const nextKey = stableDomKey(nextChild);
        const match = originalChildren.find(currentChild => (
          !used.has(currentChild)
          && sameDomShape(currentChild, nextChild)
          && (nextKey ? stableDomKey(currentChild) === nextKey : !stableDomKey(currentChild))
        ));
        if (!match) return nextChild.cloneNode(true);
        used.add(match);
        morphDomNode(match, nextChild);
        return match;
      });

      targetChildren.forEach((child, index) => {
        const currentAtIndex = current.childNodes[index] || null;
        if (currentAtIndex !== child) current.insertBefore(child, currentAtIndex);
      });
      for (const child of originalChildren) {
        if (!used.has(child) && child.parentNode === current) child.remove();
      }
    }

    function clearSurfaceEntryAnimations() {
      for (const cleanup of [...surfaceEntryAnimationCleanups]) cleanup();
    }

    function armSurfaceEntryAnimations() {
      if (global.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
      const entries = [
        { selector: '.mission-console', animationName: 'console-rise' },
        { selector: '.scene-character', animationName: 'character-card-arrive' }
      ];
      for (const { selector, animationName } of entries) {
        for (const element of root.querySelectorAll?.(selector) || []) {
          let timer = null;
          let cleaned = false;
          const onAnimationEnd = event => {
            if (event.target !== element || event.animationName !== animationName) return;
            cleanup();
          };
          const onAnimationCancel = event => {
            if (event.target !== element || event.animationName !== animationName) return;
            cleanup();
          };
          const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            element.classList.remove('is-entering');
            element.removeEventListener('animationend', onAnimationEnd);
            element.removeEventListener('animationcancel', onAnimationCancel);
            if (timer !== null) global.clearTimeout?.(timer);
            surfaceEntryAnimationCleanups.delete(cleanup);
          };
          element.classList.add('is-entering');
          element.addEventListener('animationend', onAnimationEnd);
          element.addEventListener('animationcancel', onAnimationCancel);
          timer = global.setTimeout?.(cleanup, 900) ?? null;
          surfaceEntryAnimationCleanups.add(cleanup);
        }
      }
    }

    function replaceRenderedSurface(markup) {
      clearSurfaceEntryAnimations();
      root.innerHTML = markup;
      armSurfaceEntryAnimations();
    }

    function writeRenderedSurface(markup, { preserve = false } = {}) {
      if (
        !preserve
        || typeof global.document.createElement !== 'function'
        || !root.firstElementChild
      ) {
        replaceRenderedSurface(markup);
        return;
      }
      const template = global.document.createElement('template');
      if (!template.content) {
        replaceRenderedSurface(markup);
        return;
      }
      template.innerHTML = markup.trim();
      const next = template.content.firstElementChild;
      const current = root.firstElementChild;
      if (!next || !sameDomShape(current, next)) {
        replaceRenderedSurface(markup);
        return;
      }
      morphDomNode(current, next);
    }

    function render() {
      ui.presentationArmGeneration += 1;
      if (ui.presentationCleanup) {
        ui.presentationCleanup();
        ui.presentationCleanup = null;
      }
      const snapshot = runtime.snapshot();
      global.document.title = unit.experience?.documentTitle || unit.title;
      ensureRequiredRolePractice(snapshot);
      const practiceSnapshot = outcomePracticeRuntime?.snapshot();
      const navigationRenderKey = practiceSnapshot && ['active', 'finished'].includes(practiceSnapshot.status)
        ? `practice:${outcomePracticeConfig?.practiceId || practiceSnapshot.practiceId || 'active'}`
        : [
            ui.previewMode ? 'preview' : 'mainline',
            snapshot.status || 'idle',
            snapshot.microtaskId || ui.view || 'arrival'
          ].join(':');
      const preserveRenderedSurface = ui.lastNavigationRenderKey === navigationRenderKey;
      if (
        ui.lastNavigationRenderKey !== null
        && ui.lastNavigationRenderKey !== navigationRenderKey
      ) global.scrollTo?.(0, 0);
      ui.lastNavigationRenderKey = navigationRenderKey;
      if (practiceSnapshot && ['active', 'finished'].includes(practiceSnapshot.status)) {
        writeRenderedSurface(outcomePracticeMarkup(snapshot, practiceSnapshot), {
          preserve: preserveRenderedSurface
        });
        return;
      }
      if (ui.view === 'arrival' && snapshot.status === 'idle') {
        writeRenderedSurface(arrivalMarkup(snapshot), { preserve: preserveRenderedSurface });
        return;
      }
      if (ui.view === 'briefing' && snapshot.status === 'idle') {
        writeRenderedSurface(briefingMarkup(snapshot), { preserve: preserveRenderedSurface });
        return;
      }
      if (ui.previewMode && snapshot.status === 'sandbox-complete') {
        ui.view = 'complete';
        writeRenderedSurface(stageReplayCompleteMarkup(snapshot), {
          preserve: preserveRenderedSurface
        });
        return;
      }
      if (['chapter-stop', 'rest-stop'].includes(snapshot.status)) {
        ui.view = 'chapter';
        writeRenderedSurface(chapterMarkup(snapshot), { preserve: preserveRenderedSurface });
        return;
      }
      if (snapshot.status === 'unit-built') {
        ui.view = 'complete';
        writeRenderedSurface(completionMarkup(snapshot), { preserve: preserveRenderedSurface });
        return;
      }
      ui.view = 'mission';
      const authored = currentTask(snapshot);
      writeRenderedSurface(
        authored ? missionMarkup(snapshot, authored) : arrivalMarkup(snapshot),
        { preserve: preserveRenderedSurface }
      );
      if (authored) {
        updateResponsiveSceneLayout();
        scheduleResponsiveSceneLayout();
        armPresentationMoment(
          snapshot,
          authored.task,
          currentPresentationMoment(snapshot, authored.task)
        );
        scheduleDialogueFollow(snapshot, currentStep(snapshot));
      }
    }

    function responseFor(snapshot, step) {
      if (['match-entity', 'match-entity-batch'].includes(step.kind)) {
        return {
          sourceRef: snapshot.challengeSourceRef
            || step.challengeSourceRefs?.[snapshot.challengeIndex ?? snapshot.batchIndex],
          entityId: ui.selectedEntityId
        };
      }
      if (step.kind === 'select-one') return { sourceRef: ui.selectedSourceRef };
      if (step.kind === 'detect-error') {
        return ui.selectedContentRef
          ? { contentRef: ui.selectedContentRef }
          : { sourceRef: ui.selectedSourceRef };
      }
      if (step.kind === 'connect-reference') {
        return { sourceRef: step.answerRule.sourceRef, entityId: ui.selectedEntityId };
      }
      if (step.kind === 'ordered-sequence') {
        return { sequenceIds: [...ui.selectedSequenceIds] };
      }
      if (step.kind === 'select-entity') return { entityId: ui.selectedEntityId };
      if (step.kind === 'select-case') return { entityId: ui.selectedEntityId };
      if (step.kind === 'place-in-slot') {
        return { entityId: ui.selectedEntityId, slotId: step.answerRule.slotId };
      }
      if (step.kind === 'perform-action') {
        const actionRule = performRule(step) || {};
        return {
          action: actionRule.action,
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

    function submitCurrentResponse(snapshot, step) {
      dispatch({
        type: 'response/submit',
        challengeRef: snapshot.challengeRef,
        response: responseFor(snapshot, step)
      });
    }

    function completeRequiredRolePractice({ enterManual = false } = {}) {
      const practiceSnapshot = outcomePracticeRuntime?.snapshot();
      if (
        practiceSnapshot?.kind !== 'role-enactment'
        || practiceSnapshot.phase !== 'all-roles-complete'
      ) return false;
      const practiceId = outcomePracticeConfig.practiceId;
      pauseVoice();
      outcomePracticeRuntime.destroy();
      outcomePracticeRuntime = null;
      outcomePracticeConfig = null;
      dispatch({ type: 'role-practice/complete', practiceId });
      const manualDialogue = enterManual ? unlockedManualDialogue(runtime.snapshot()) : null;
      if (manualDialogue) startOutcomePractice(manualDialogue.practiceId);
      return true;
    }

    root.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button || !root.contains(button)) return;
      const action = button.dataset.action;
      const value = button.dataset.value;
      const snapshot = runtime.snapshot();
      const step = currentStep(snapshot);

      if (action === 'start-outcome-practice') {
        startOutcomePractice(value);
        return;
      }
      if (action === 'practice-exit') {
        exitOutcomePractice();
        return;
      }
      if (action === 'practice-skip') {
        if (button.disabled) return;
        ui.roleSkipConfirmOpen = true;
        render();
        global.queueMicrotask(() => root.querySelector('[data-action="role-skip-cancel"]')?.focus());
        return;
      }
      if (action === 'practice-skip-retry') {
        const effects = outcomePracticeRuntime?.dispatch({ type: 'role/save-retry' }) || [];
        processPracticeEffects(effects);
        return;
      }
      if (action === 'practice-return-learning') {
        pauseVoice();
        outcomePracticeRuntime?.destroy();
        outcomePracticeRuntime = null;
        outcomePracticeConfig = null;
        dispatch({ type: 'navigation/exit-skip-recovery' });
        return;
      }
      if (action === 'practice-complete-recovery') {
        completeRequiredRolePractice();
        return;
      }
      if (outcomePracticeRuntime && action.startsWith('practice-')) {
        const practiceSnapshot = outcomePracticeRuntime.snapshot();
        let effects = [];
        if (action === 'practice-reveal') effects = outcomePracticeRuntime.reveal();
        else if (action === 'practice-submit') effects = outcomePracticeRuntime.submit(value);
        else if (action === 'practice-next') effects = outcomePracticeRuntime.next();
        else if (action === 'practice-finish') effects = outcomePracticeRuntime.finish();
        else if (action === 'practice-role-select') {
          effects = outcomePracticeRuntime.dispatch({ type: 'role/select', roundId: value });
        } else if (action === 'practice-round-save-retry') {
          effects = outcomePracticeRuntime.dispatch({ type: 'role/save-retry' });
        } else if (action === 'practice-hint') {
          effects = outcomePracticeRuntime.dispatch({ type: 'hint/show' });
        } else if (action === 'practice-line-replay') {
          effects = outcomePracticeRuntime.dispatch({ type: 'line/replay', turnRef: value });
        } else if (action === 'practice-restart') {
          effects = outcomePracticeRuntime.dispatch({ type: 'manual/restart' });
        } else if (action === 'practice-return-mainline') {
          exitOutcomePractice();
          return;
        } else if (action === 'practice-enter-manual') {
          completeRequiredRolePractice({ enterManual: true });
          return;
        } else if (action === 'practice-continue-course') {
          completeRequiredRolePractice();
          return;
        } else if (action === 'practice-audio-retry') {
          effects = outcomePracticeRuntime.dispatch({
            type: 'audio/retry',
            practiceSessionId: practiceSnapshot.practiceSessionId,
            stateVersion: practiceSnapshot.stateVersion,
            requestId: practiceSnapshot.audio?.requestId,
            segmentId: practiceSnapshot.audio?.segmentId
          });
        }
        processPracticeEffects(effects);
        return;
      }

      if (action === 'toggle-settings') {
        ui.stageMapOpen = false;
        ui.settingsOpen = !ui.settingsOpen;
        render();
        return;
      }
      if (action === 'toggle-stages') {
        ui.settingsOpen = false;
        if (!ui.stageMapOpen && ui.voice?.free) pauseVoice();
        ui.stageMapOpen = !ui.stageMapOpen;
        render();
        if (ui.stageMapOpen) {
          global.queueMicrotask(() => root.querySelector('.stage-map [data-action="preview-jump"]:not(:disabled)')?.focus());
        }
        return;
      }
      if (action === 'open-stages') {
        ui.settingsOpen = false;
        if (ui.voice?.free) pauseVoice();
        ui.stageMapOpen = true;
        render();
        global.queueMicrotask(() => root.querySelector('.stage-map [data-action="preview-jump"]:not(:disabled)')?.focus());
        return;
      }
      if (action === 'close-stages') {
        ui.stageMapOpen = false;
        render();
        global.queueMicrotask(() => root.querySelector('[data-action="toggle-stages"]')?.focus());
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
      if (action === 'preview-select-stage') {
        ui.settingsOpen = false;
        ui.stageMapOpen = true;
        render();
        global.queueMicrotask(() => root.querySelector('.stage-map [data-action="preview-jump"]:not(:disabled)')?.focus());
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
      if (action === 'role-skip-cancel') {
        ui.roleSkipConfirmOpen = false;
        render();
        global.queueMicrotask(() => root.querySelector('[data-action="practice-skip"]')?.focus());
        return;
      }
      if (action === 'role-skip-confirm') {
        ui.roleSkipConfirmOpen = false;
        const effects = outcomePracticeRuntime?.dispatch({ type: 'role/skip' }) || [];
        processPracticeEffects(effects);
        return;
      }
      if (action === 'restart-confirm') {
        pauseVoice();
        try { global.localStorage.removeItem(storageKey); } catch { /* no-op */ }
        global.location.reload();
        return;
      }
      if (action === 'audio-play') {
        dispatch({
          type: ['audio-suspended', 'audio-blocked'].includes(snapshot.phase)
            ? 'audio/resume'
            : 'audio/play'
        });
        return;
      }
      if (action === 'audio-retry') {
        dispatch({ type: 'audio/retry' });
        return;
      }
      if (action === 'dialogue-replay') {
        const moment = currentPresentationMoment(snapshot);
        if (
          step?.kind === 'audio-sequence'
          && moment?.advancePolicy === 'explicit-child-continue'
        ) {
          startFreeVoiceSequence(moment.visibleLanguageRefs?.length
            ? moment.visibleLanguageRefs
            : step.audioSourceRefs);
        }
        return;
      }
      if (action === 'dialogue-return-current') {
        ui.dialogueFollowEnabled = true;
        scrollCurrentDialogueLine();
        button.hidden = true;
        return;
      }
      if (action === 'free-audio') {
        startFreeVoice(value, button.dataset.refKind || 'source');
        return;
      }
      if (action === 'perform-direct' && step?.kind === 'perform-action') {
        const actionRule = performRule(step) || {};
        ui.selectedEntityId = actionRule.entityId;
        ui.selectedTargetId = actionRule.targetEntityId;
        submitCurrentResponse(snapshot, step);
        return;
      }
      if (action === 'step-continue') {
        dispatch({ type: 'step/continue' });
        return;
      }
      if (action === 'presentation-end') {
        if (ui.voice?.free) pauseVoice();
        finishPresentationMoment(snapshot, currentPresentationMoment(snapshot));
        return;
      }
      if (action === 'knowledge-expand') {
        ui.knowledgeExpanded = !ui.knowledgeExpanded;
        render();
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
          submitCurrentResponse(snapshot, step);
          return;
        }
        if (step?.kind === 'perform-action' && ui.selectedTargetId) {
          submitCurrentResponse(snapshot, step);
          return;
        }
        if (step?.kind === 'place-in-slot') {
          submitCurrentResponse(snapshot, step);
          return;
        }
        if (step?.kind === 'select-entity') {
          submitCurrentResponse(snapshot, step);
          return;
        }
        if (step?.kind === 'select-case') {
          ui.selectedCaseByTask[snapshot.microtaskId] = value;
          submitCurrentResponse(snapshot, step);
          return;
        }
      }
      if (action === 'select-target') {
        ui.selectedTargetId = value;
        if (step?.kind === 'perform-action' && ui.selectedEntityId) {
          submitCurrentResponse(snapshot, step);
          return;
        }
      }
      if (action === 'select-source') {
        ui.selectedSourceRef = value;
        if (step?.kind === 'select-one') {
          submitCurrentResponse(snapshot, step);
          return;
        }
      }
      if (action === 'select-diagnostic') {
        if (button.dataset.refKind === 'content') {
          ui.selectedContentRef = value;
          ui.selectedSourceRef = null;
        } else {
          ui.selectedSourceRef = value;
          ui.selectedContentRef = null;
        }
        submitCurrentResponse(snapshot, step);
        return;
      }
      if (action === 'connect-reference') {
        ui.selectedEntityId = value;
        submitCurrentResponse(snapshot, step);
        return;
      }
      if (action === 'add-block' && !ui.selectedBlockRefs.includes(value)) {
        ui.selectedBlockRefs.push(value);
        const selectedCase = ui.selectedCaseByTask[snapshot.microtaskId];
        const requiredBlockCount = step?.answerRule?.acceptedOrder?.length
          || step?.answerRule?.acceptedByEntityId?.[selectedCase]?.length
          || 0;
        if (step?.kind === 'ordered-blocks' && ui.selectedBlockRefs.length === requiredBlockCount) {
          submitCurrentResponse(snapshot, step);
          return;
        }
      }
      if (action === 'remove-block') ui.selectedBlockRefs = ui.selectedBlockRefs.filter(refId => refId !== value);
      if (action === 'reset-blocks') ui.selectedBlockRefs = [];
      if (action === 'add-sequence' && !ui.selectedSequenceIds.includes(value)) {
        ui.selectedSequenceIds.push(value);
        if (step?.kind === 'ordered-sequence'
          && ui.selectedSequenceIds.length === step.answerRule.acceptedOrder.length) {
          submitCurrentResponse(snapshot, step);
          return;
        }
      }
      if (action === 'remove-sequence') {
        ui.selectedSequenceIds = ui.selectedSequenceIds.filter(panelId => panelId !== value);
      }
      if ([
        'select-entity', 'select-target', 'select-source', 'add-block', 'remove-block', 'reset-blocks',
        'add-sequence', 'remove-sequence'
      ].includes(action)) {
        render();
        return;
      }
      if (action === 'chapter-continue') {
        ui.resting = false;
        dispatch({
          type: snapshot.status === 'rest-stop' ? 'rest-stop/continue' : 'chapter/continue',
          restStopId: snapshot.nextRestStop?.restStopId
        });
        return;
      }
      if (action === 'rest') {
        ui.resting = true;
        render();
        return;
      }
      if (action === 'replay') {
        ui.settingsOpen = false;
        ui.stageMapOpen = true;
        render();
        global.queueMicrotask(() => root.querySelector('.stage-map [data-action="preview-jump"]:not(:disabled)')?.focus());
        return;
      }
      if (action === 'persistence-retry') dispatch({ type: 'persistence/retry' });
    });

    function onGlobalKeydown(event) {
      if (event.key !== 'Escape' || !ui.roleSkipConfirmOpen) return;
      event.preventDefault();
      ui.roleSkipConfirmOpen = false;
      render();
      global.queueMicrotask(() => root.querySelector('[data-action="practice-skip"]')?.focus());
    }

    global.addEventListener('pagehide', suspendRequiredAudio);
    global.addEventListener('pageshow', resumeRequiredAudio);
    global.addEventListener('wheel', stopDialogueFollowing, { passive: true });
    global.addEventListener('touchmove', stopDialogueFollowing, { passive: true });
    global.addEventListener('resize', scheduleResponsiveSceneLayout);
    global.addEventListener('keydown', onGlobalKeydown);
    global.document.addEventListener('visibilitychange', onVisibilityChange);
    const hasDurableResume = durableResumeAvailable();
    runtime.enter({ entryLesson });
    flushEffectsAndRender({ deferAudio: hasDurableResume });
    return Object.freeze({
      destroy: () => {
        if (ui.destroyed) return { snapshot: runtime.snapshot(), effects: [] };
        ui.destroyed = true;
        global.removeEventListener('pagehide', suspendRequiredAudio);
        global.removeEventListener('pageshow', resumeRequiredAudio);
        global.removeEventListener('wheel', stopDialogueFollowing);
        global.removeEventListener('touchmove', stopDialogueFollowing);
        global.removeEventListener('resize', scheduleResponsiveSceneLayout);
        global.removeEventListener('keydown', onGlobalKeydown);
        if (responsiveSceneLayoutFrame !== null) {
          global.cancelAnimationFrame?.(responsiveSceneLayoutFrame);
          responsiveSceneLayoutFrame = null;
        }
        for (const audio of audioPreloadCache.values()) {
          try { audio.pause?.(); } catch { /* no-op */ }
        }
        audioPreloadCache.clear();
        global.document.removeEventListener('visibilitychange', onVisibilityChange);
        if (
          ui.stageReplayOrigin?.outcomePracticeRuntime
          && ui.stageReplayOrigin.outcomePracticeRuntime !== outcomePracticeRuntime
        ) ui.stageReplayOrigin.outcomePracticeRuntime.destroy();
        outcomePracticeRuntime?.destroy();
        outcomePracticeRuntime = null;
        outcomePracticeConfig = null;
        if (ui.presentationCleanup) {
          ui.presentationCleanup();
          ui.presentationCleanup = null;
        }
        clearSurfaceEntryAnimations();
        pauseVoice();
        const result = runtime.destroy();
        ui.pendingEffects.length = 0;
        return result;
      },
      get runtime() { return runtime; },
      get ledger() { return ledger; }
    });
  }

  return Object.freeze({ mount });
});
