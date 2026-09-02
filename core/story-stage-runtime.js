(function attachStoryStageRuntime(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.storyStageRuntime = api;
    root.CanranCore.lessonThreeFourRuntime = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function storyStageRuntimeFactory() {
  'use strict';

  const unique = values => [...new Set(values)];
  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const copy = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

  function roleIds(unit) {
    return unique([
      ...Object.keys(unit?.experience?.roles || {}),
      ...(unit?.experience?.stages || []).flatMap(stage => stage.roles || [])
    ]);
  }

  function allSources(unit) {
    return Object.values(unit.lessonContent || {})
      .flatMap(lesson => Object.values(lesson.sources || {}));
  }

  function sourceMap(unit) {
    return new Map(allSources(unit).map(source => [source.sourceId, source]));
  }

  function getStage(unit, state) {
    return unit.experience.stages[state.currentStageIndex];
  }

  function stageIds(unit) {
    return unit.experience.stages.map(stage => stage.stageId);
  }

  function resolvedStageIds(state) {
    return unique([...(state.completedStageIds || []), ...(state.skippedStageIds || [])]);
  }

  function isJourneyComplete(unit, state) {
    const resolved = new Set(resolvedStageIds(state));
    return stageIds(unit).every(stageId => resolved.has(stageId));
  }

  function firstUnresolvedIndex(unit, state, afterIndex = -1) {
    const resolved = new Set(resolvedStageIds(state));
    const stages = unit.experience.stages;
    for (let index = Math.max(0, afterIndex + 1); index < stages.length; index += 1) {
      if (!resolved.has(stages[index].stageId)) return index;
    }
    return -1;
  }

  function handledRoleIds(state) {
    return unique([
      ...(state.completedRoleIds || []),
      ...Object.values(state.roleStageDispositions || {})
        .map(disposition => disposition?.roleId)
        .filter(Boolean)
    ]);
  }

  function initialStageData(stage, state) {
    const common = { wrongAttempts: 0, supportLevel: 0, assisted: false };
    if (stage.kind === 'sequence-choice') return { ...common, roundIndex: 0 };
    if (stage.kind === 'prompt-album' || stage.kind === 'sampled-prompt-groups') {
      return { ...common, activeGroupIndex: 0 };
    }
    if (stage.kind === 'role-enactment') {
      const availableRoleIds = stage.roles || [];
      const handled = handledRoleIds(state);
      const unhandledRole = availableRoleIds.find(roleId => !handled.includes(roleId));
      return {
        ...common,
        roleId: stage.roleMode === 'unplayed-role'
          ? (unhandledRole || availableRoleIds.find(roleId => !state.completedRoleIds.includes(roleId)) || availableRoleIds[0])
          : null,
        turnIndex: 0,
        revealed: false
      };
    }
    return common;
  }

  function initialPhase(stage, stageData) {
    if (stage.kind === 'listen' || stage.kind === 'dialogue-comprehension') return 'stage-ready';
    if (stage.kind === 'sequence-choice') return stage.rounds[0].promptAudioRefs?.length
      ? 'stage-ready'
      : 'awaiting-response';
    if (stage.kind === 'sampled-prompt-groups') return 'stage-ready';
    if (stage.kind === 'entity-action' && stage.promptAudioRefs?.length) return 'stage-ready';
    if (stage.kind === 'role-enactment' && stageData.roleId) return 'role-ready';
    return 'awaiting-response';
  }

  function sanitizeRoleDispositions(unit, value) {
    const validRoles = new Set(roleIds(unit));
    const roleStages = new Map(unit.experience.stages
      .filter(stage => stage.kind === 'role-enactment')
      .map(stage => [stage.stageId, stage]));
    const safe = {};
    for (const [stageId, disposition] of Object.entries(value || {})) {
      const stage = roleStages.get(stageId);
      if (!stage || !['completed', 'skipped'].includes(disposition?.status)) continue;
      if (!validRoles.has(disposition.roleId) || !stage.roles.includes(disposition.roleId)) continue;
      safe[stageId] = { status: disposition.status, roleId: disposition.roleId };
    }
    return safe;
  }

  function sanitizeProgress(unit, progress = {}) {
    const stages = unit.experience.stages;
    const validStageIds = new Set(stageIds(unit));
    const skippedStageIds = unique(progress.skippedStageIds || [])
      .filter(stageId => validStageIds.has(stageId));
    const skipped = new Set(skippedStageIds);
    const completedStageIds = unique(progress.completedStageIds || [])
      .filter(stageId => validStageIds.has(stageId) && !skipped.has(stageId));
    const resolved = new Set([...completedStageIds, ...skippedStageIds]);
    const firstUnresolved = stages.findIndex(stage => !resolved.has(stage.stageId));
    const furthestIndex = firstUnresolved < 0 ? stages.length - 1 : firstUnresolved;
    const requestedIndex = stages.findIndex(stage => stage.stageId === progress.currentStageId);
    const currentStageIndex = requestedIndex >= 0 && requestedIndex <= furthestIndex
      ? requestedIndex
      : Math.max(0, furthestIndex);
    const maximumHearts = unit.experience.adventureHearts?.maximum || 3;
    const requestedHearts = Number.isInteger(progress.adventureHeartsRemaining)
      ? progress.adventureHeartsRemaining
      : maximumHearts;
    const requestedJourneyCompletedAt = progress.journeyCompletedAt || progress.journey?.completedAt;
    const journeyCompletedAt = typeof requestedJourneyCompletedAt === 'string'
      && !Number.isNaN(Date.parse(requestedJourneyCompletedAt))
      ? requestedJourneyCompletedAt
      : null;
    return {
      currentStageIndex,
      completedStageIds,
      skippedStageIds,
      completedRoleIds: unique(progress.completedRoleIds || []).filter(role => roleIds(unit).includes(role)),
      roleStageDispositions: sanitizeRoleDispositions(unit, progress.roleStageDispositions),
      firstRoleId: roleIds(unit).includes(progress.firstRoleId) ? progress.firstRoleId : null,
      contactedSourceRefs: unique(progress.contactedSourceRefs || []),
      evidenceRecords: Array.isArray(progress.evidenceRecords) ? copy(progress.evidenceRecords) : [],
      adventureHeartsRemaining: clamp(requestedHearts, 0, maximumHearts),
      journeyCompletedAt,
      updatedAt: typeof progress.updatedAt === 'string' ? progress.updatedAt : new Date().toISOString()
    };
  }

  function createInitialState(unit, progress = {}) {
    if (!unit?.experience?.stages?.length) throw new Error('Story-stage experience stages are required');
    const safe = sanitizeProgress(unit, progress);
    const base = {
      revision: unit.experienceRevision,
      ...safe,
      phase: 'stage-ready',
      requestCounter: 0,
      pendingAudio: null,
      failedAudio: null,
      stageData: null,
      lastOutcome: null,
      navigationSession: null
    };
    if (isJourneyComplete(unit, base)) base.currentStageIndex = unit.experience.stages.length - 1;
    const stage = getStage(unit, base);
    base.stageData = initialStageData(stage, base);
    base.phase = isJourneyComplete(unit, base) ? 'unit-complete' : initialPhase(stage, base.stageData);
    return base;
  }

  function requestAudio(state, audioRefs, purpose, details = {}) {
    if (!Array.isArray(audioRefs) || audioRefs.length === 0) return state;
    const requestId = state.requestCounter + 1;
    return {
      ...state,
      phase: 'audio-playing',
      requestCounter: requestId,
      failedAudio: null,
      pendingAudio: { ...details, requestId, audioRefs: [...audioRefs], purpose }
    };
  }

  function evidenceResult(state) {
    return state.stageData?.assisted ? 'assisted' : 'independent';
  }

  function recordStageSources(state, stage) {
    const contactedSourceRefs = unique([
      ...state.contactedSourceRefs,
      ...(stage.exposureRefs || []),
      ...(stage.evidenceRefs || [])
    ]);
    const newRecords = (stage.evidenceRefs || []).map(sourceRef => ({
      stageId: stage.stageId,
      sourceRef,
      result: evidenceResult(state)
    }));
    const keys = new Set(newRecords.map(record => `${record.stageId}:${record.sourceRef}`));
    return {
      contactedSourceRefs,
      evidenceRecords: [
        ...state.evidenceRecords.filter(record => !keys.has(`${record.stageId}:${record.sourceRef}`)),
        ...newRecords
      ]
    };
  }

  function enterStage(unit, state, stageIndex) {
    const next = {
      ...state,
      currentStageIndex: clamp(stageIndex, 0, unit.experience.stages.length - 1),
      pendingAudio: null,
      failedAudio: null,
      lastOutcome: null
    };
    const stage = getStage(unit, next);
    next.stageData = initialStageData(stage, next);
    next.phase = initialPhase(stage, next.stageData);
    return next;
  }

  function updateRoleCompletion(state, stage, status) {
    if (stage.kind !== 'role-enactment' || !state.stageData.roleId) return state;
    const roleId = state.stageData.roleId;
    return {
      ...state,
      completedRoleIds: status === 'completed'
        ? unique([...state.completedRoleIds, roleId])
        : state.completedRoleIds.filter(id => id !== roleId),
      firstRoleId: state.firstRoleId || roleId,
      roleStageDispositions: {
        ...state.roleStageDispositions,
        [stage.stageId]: { status, roleId }
      }
    };
  }

  function finishNavigationSession(state, phase) {
    return { ...state, pendingAudio: null, failedAudio: null, phase, lastOutcome: 'correct' };
  }

  function continueJourney(unit, state, afterIndex) {
    if (isJourneyComplete(unit, state)) {
      return {
        ...state,
        phase: 'unit-complete',
        pendingAudio: null,
        failedAudio: null,
        journeyCompletedAt: state.journeyCompletedAt || new Date().toISOString()
      };
    }
    const nextIndex = firstUnresolvedIndex(unit, state, afterIndex);
    return enterStage(unit, state, nextIndex < 0 ? state.currentStageIndex : nextIndex);
  }

  function completeStage(unit, state) {
    if (state.navigationSession?.mode === 'replay') return finishNavigationSession(state, 'replay-complete');
    const stage = getStage(unit, state);
    const sourceRecords = recordStageSources(state, stage);
    let completed = {
      ...state,
      ...sourceRecords,
      completedStageIds: unique([...state.completedStageIds, stage.stageId]),
      skippedStageIds: state.skippedStageIds.filter(stageId => stageId !== stage.stageId),
      pendingAudio: null,
      lastOutcome: 'correct'
    };
    completed = updateRoleCompletion(completed, stage, 'completed');
    if (state.navigationSession?.mode === 'makeup') return finishNavigationSession(completed, 'makeup-complete');
    if (unit.experience.stageTransition?.mode === 'story-consequence-auto') {
      return continueJourney(unit, completed, state.currentStageIndex);
    }
    return { ...completed, phase: isJourneyComplete(unit, completed) ? 'unit-complete' : 'stage-complete' };
  }

  function skipRole(unit, state) {
    const stage = getStage(unit, state);
    if (state.navigationSession || stage.kind !== 'role-enactment' || !stage.skippableRoleRound) return state;
    if (!state.stageData.roleId) return state;
    let skipped = {
      ...state,
      completedStageIds: state.completedStageIds.filter(stageId => stageId !== stage.stageId),
      skippedStageIds: unique([...state.skippedStageIds, stage.stageId]),
      pendingAudio: null,
      failedAudio: null,
      lastOutcome: 'skipped'
    };
    skipped = updateRoleCompletion(skipped, stage, 'skipped');
    return continueJourney(unit, skipped, state.currentStageIndex);
  }

  function prepareRoleTurn(unit, state) {
    const stage = getStage(unit, state);
    if (state.stageData.turnIndex >= stage.dialogueRefs.length) return completeStage(unit, state);
    const ref = stage.dialogueRefs[state.stageData.turnIndex];
    const source = sourceMap(unit).get(ref);
    if (source?.speakerRole === state.stageData.roleId) {
      return {
        ...state,
        phase: 'awaiting-response',
        stageData: { ...state.stageData, revealed: false },
        lastOutcome: null
      };
    }
    return requestAudio(state, [ref], 'role-turn', {
      turnIndex: state.stageData.turnIndex,
      childTurn: false
    });
  }

  function accepted(stageOrRound, action) {
    const rule = stageOrRound.answerRule || stageOrRound;
    if (!rule) return false;
    if (rule.acceptedOptionId) return action.optionId === rule.acceptedOptionId;
    if (rule.acceptedEntityId) return action.entityId === rule.acceptedEntityId;
    return false;
  }

  function wrong(unit, state) {
    const stage = getStage(unit, state);
    const wrongAttempts = state.stageData.wrongAttempts + 1;
    const formal = stage.affectsAdventureHearts === true;
    const adventureHeartsRemaining = formal
      ? Math.max(0, state.adventureHeartsRemaining - 1)
      : state.adventureHeartsRemaining;
    return {
      ...state,
      phase: formal && adventureHeartsRemaining === 0 ? 'rescue-ready' : 'awaiting-response',
      pendingAudio: null,
      lastOutcome: 'wrong',
      adventureHeartsRemaining,
      stageData: {
        ...state.stageData,
        wrongAttempts,
        supportLevel: Math.min(2, wrongAttempts)
      }
    };
  }

  function rewardCorrect(unit, state) {
    if (getStage(unit, state).affectsAdventureHearts !== true) return state;
    const maximum = unit.experience.adventureHearts?.maximum || 3;
    return { ...state, adventureHeartsRemaining: Math.min(maximum, state.adventureHeartsRemaining + 1) };
  }

  function playPrimary(unit, state) {
    const stage = getStage(unit, state);
    if (stage.kind === 'listen') return requestAudio(state, stage.audioRefs, 'complete-stage');
    if (stage.kind === 'dialogue-comprehension') return requestAudio(state, stage.audioRefs, 'unlock-response');
    if (stage.kind === 'entity-action' && stage.promptAudioRefs?.length) {
      return requestAudio(state, stage.promptAudioRefs, 'unlock-response');
    }
    if (stage.kind === 'sequence-choice') {
      return requestAudio(state, stage.rounds[state.stageData.roundIndex].promptAudioRefs, 'unlock-response');
    }
    if (stage.kind === 'sampled-prompt-groups') {
      const group = stage.groups[state.stageData.activeGroupIndex];
      return requestAudio(state, group.sourceRefs, 'sampled-group-contact', {
        groupIndex: state.stageData.activeGroupIndex
      });
    }
    return state;
  }

  function answer(unit, state, action) {
    const stage = getStage(unit, state);
    const subject = stage.kind === 'sequence-choice'
      ? stage.rounds[state.stageData.roundIndex]
      : stage.kind === 'sampled-prompt-groups'
        ? stage.groups[state.stageData.activeGroupIndex]
        : stage;
    if (!accepted(subject, action)) return wrong(unit, state);
    const rewarded = rewardCorrect(unit, state);
    if (stage.kind === 'sampled-prompt-groups') {
      return requestAudio(rewarded, [subject.retrievalSourceRef], 'advance-sampled-group', {
        groupIndex: state.stageData.activeGroupIndex,
        sourceRef: subject.retrievalSourceRef
      });
    }
    const audioRefs = subject.successAudioRefs || [];
    if (stage.kind === 'sequence-choice') {
      return audioRefs.length
        ? requestAudio(rewarded, audioRefs, 'advance-round', { roundIndex: state.stageData.roundIndex })
        : advanceRound(unit, rewarded);
    }
    return audioRefs.length
      ? requestAudio(rewarded, audioRefs, 'complete-stage')
      : completeStage(unit, rewarded);
  }

  function advanceRound(unit, state) {
    const stage = getStage(unit, state);
    const nextRoundIndex = state.stageData.roundIndex + 1;
    if (nextRoundIndex >= stage.rounds.length) return completeStage(unit, state);
    const nextRound = stage.rounds[nextRoundIndex];
    return {
      ...state,
      pendingAudio: null,
      phase: nextRound.promptAudioRefs?.length ? 'stage-ready' : 'awaiting-response',
      lastOutcome: 'correct',
      stageData: {
        ...state.stageData,
        roundIndex: nextRoundIndex,
        wrongAttempts: 0,
        supportLevel: 0
      }
    };
  }

  function advanceSampledGroup(unit, state) {
    const stage = getStage(unit, state);
    const nextGroupIndex = state.stageData.activeGroupIndex + 1;
    if (nextGroupIndex >= stage.groups.length) return completeStage(unit, state);
    return {
      ...state,
      pendingAudio: null,
      phase: 'stage-ready',
      lastOutcome: 'correct',
      stageData: {
        ...state.stageData,
        activeGroupIndex: nextGroupIndex,
        wrongAttempts: 0,
        supportLevel: 0
      }
    };
  }

  function resetAfterRescue(unit, state) {
    const stage = getStage(unit, state);
    const stageData = { ...initialStageData(stage, state), assisted: true };
    return {
      ...state,
      pendingAudio: null,
      failedAudio: null,
      adventureHeartsRemaining: unit.experience.adventureHearts?.maximum || 3,
      stageData,
      phase: initialPhase(stage, stageData),
      lastOutcome: 'assisted'
    };
  }

  function audioEnded(unit, state, action) {
    const pending = state.pendingAudio;
    if (!pending || action.requestId !== pending.requestId) return state;
    if (pending.purpose === 'complete-stage') return completeStage(unit, state);
    if (pending.purpose === 'unlock-response') {
      return { ...state, phase: 'awaiting-response', pendingAudio: null, lastOutcome: null };
    }
    if (pending.purpose === 'advance-round') return advanceRound(unit, state);
    if (pending.purpose === 'rescue-example') return resetAfterRescue(unit, state);
    if (pending.purpose === 'sampled-group-contact') {
      const group = getStage(unit, state).groups[pending.groupIndex];
      const contactedSourceRefs = unique([...state.contactedSourceRefs, ...group.sourceRefs]);
      return requestAudio(
        { ...state, contactedSourceRefs, pendingAudio: null },
        [group.retrievalSourceRef],
        'sampled-group-question',
        { groupIndex: pending.groupIndex, sourceRef: group.retrievalSourceRef }
      );
    }
    if (pending.purpose === 'sampled-group-question') {
      return { ...state, phase: 'awaiting-response', pendingAudio: null, lastOutcome: null };
    }
    if (pending.purpose === 'advance-sampled-group') return advanceSampledGroup(unit, state);
    if (pending.purpose === 'album-contact') {
      const contactedSourceRefs = unique([...state.contactedSourceRefs, pending.sourceRef]);
      const required = getStage(unit, state).groups.flatMap(group => group.sourceRefs);
      const next = { ...state, contactedSourceRefs, pendingAudio: null, phase: 'awaiting-response' };
      return required.every(ref => contactedSourceRefs.includes(ref)) ? completeStage(unit, next) : next;
    }
    if (pending.purpose === 'role-turn') {
      return prepareRoleTurn(unit, {
        ...state,
        pendingAudio: null,
        stageData: {
          ...state.stageData,
          turnIndex: state.stageData.turnIndex + 1,
          revealed: false
        }
      });
    }
    return { ...state, pendingAudio: null, phase: 'awaiting-response' };
  }

  function formalOrigin(state) {
    return {
      ...state,
      pendingAudio: null,
      failedAudio: null,
      navigationSession: null,
      stageData: copy(state.stageData)
    };
  }

  function startNavigationSession(unit, state, stageIndex, mode) {
    const origin = formalOrigin(state);
    const entered = enterStage(unit, state, stageIndex);
    return {
      ...entered,
      adventureHeartsRemaining: unit.experience.adventureHearts?.maximum || 3,
      navigationSession: { mode, origin }
    };
  }

  function exitNavigationSession(state) {
    const session = state.navigationSession;
    if (!session) return state;
    if (session.mode === 'replay' || state.phase !== 'makeup-complete') return copy(session.origin);
    return {
      ...copy(session.origin),
      completedStageIds: [...state.completedStageIds],
      skippedStageIds: [...state.skippedStageIds],
      completedRoleIds: [...state.completedRoleIds],
      roleStageDispositions: copy(state.roleStageDispositions),
      firstRoleId: state.firstRoleId,
      contactedSourceRefs: [...state.contactedSourceRefs],
      evidenceRecords: copy(state.evidenceRecords)
    };
  }

  function reduce(unit, state, action) {
    if (!action?.type) return state;
    if (action.type === 'PLAY_PRIMARY' && ['stage-ready', 'audio-failed'].includes(state.phase)) {
      return playPrimary(unit, state);
    }
    if (action.type === 'ANSWER' && state.phase === 'awaiting-response') return answer(unit, state, action);
    if (action.type === 'START_RESCUE' && state.phase === 'rescue-ready') {
      return requestAudio(state, unit.experience.rescueExample?.audioRefs || [], 'rescue-example');
    }
    if (action.type === 'PLAY_ALBUM_ITEM' && state.phase === 'awaiting-response') {
      const refs = getStage(unit, state).groups?.flatMap(group => group.sourceRefs) || [];
      if (!refs.includes(action.sourceRef)) return state;
      return requestAudio(state, [action.sourceRef], 'album-contact', { sourceRef: action.sourceRef });
    }
    if (action.type === 'SET_ALBUM_GROUP' && state.phase === 'awaiting-response') {
      const stage = getStage(unit, state);
      if (!stage.groups?.[action.groupIndex]) return state;
      return { ...state, stageData: { ...state.stageData, activeGroupIndex: action.groupIndex } };
    }
    if (action.type === 'SELECT_ROLE' && state.phase === 'awaiting-response') {
      const stage = getStage(unit, state);
      if (stage.kind !== 'role-enactment' || !stage.roles.includes(action.roleId)) return state;
      if (stage.roleMode === 'unplayed-role' && action.roleId !== state.stageData.roleId) return state;
      return prepareRoleTurn(unit, {
        ...state,
        firstRoleId: state.firstRoleId || action.roleId,
        stageData: { ...state.stageData, roleId: action.roleId, turnIndex: 0, revealed: false }
      });
    }
    if (action.type === 'START_ASSIGNED_ROLE' && state.phase === 'role-ready') return prepareRoleTurn(unit, state);
    if (action.type === 'SKIP_ROLE' && ['role-ready', 'awaiting-response', 'audio-failed'].includes(state.phase)) {
      return skipRole(unit, state);
    }
    if (action.type === 'PLAY_ROLE_LINE' && state.phase === 'awaiting-response') {
      const stage = getStage(unit, state);
      if (stage.kind !== 'role-enactment' || !state.stageData.roleId) return state;
      const sourceRef = stage.dialogueRefs[state.stageData.turnIndex];
      const source = sourceMap(unit).get(sourceRef);
      if (source?.speakerRole !== state.stageData.roleId) return state;
      return requestAudio({
        ...state,
        stageData: { ...state.stageData, revealed: true }
      }, [sourceRef], 'role-turn', { turnIndex: state.stageData.turnIndex, childTurn: true });
    }
    if (action.type === 'AUDIO_ENDED') return audioEnded(unit, state, action);
    if (action.type === 'AUDIO_FAILED') {
      if (!state.pendingAudio || action.requestId !== state.pendingAudio.requestId) return state;
      return { ...state, phase: 'audio-failed', failedAudio: state.pendingAudio, pendingAudio: null };
    }
    if (action.type === 'RETRY_AUDIO' && state.phase === 'audio-failed' && state.failedAudio) {
      return requestAudio(state, state.failedAudio.audioRefs, state.failedAudio.purpose, state.failedAudio);
    }
    if (action.type === 'CONTINUE' && state.phase === 'stage-complete') {
      return continueJourney(unit, state, state.currentStageIndex);
    }
    if (action.type === 'NAVIGATE_STAGE') {
      if (state.phase === 'audio-playing' || state.navigationSession) return state;
      const requested = unit.experience.stages.findIndex(stage => stage.stageId === action.stageId);
      if (requested < 0) return state;
      if (state.completedStageIds.includes(action.stageId)) {
        return startNavigationSession(unit, state, requested, 'replay');
      }
      if (state.skippedStageIds.includes(action.stageId)) {
        return startNavigationSession(unit, state, requested, 'makeup');
      }
      return state;
    }
    if (action.type === 'EXIT_STAGE_SESSION') return exitNavigationSession(state);
    if (action.type === 'RESTART') return createInitialState(unit);
    return state;
  }

  function stateForSerialization(state) {
    if (!state.navigationSession) return state;
    if (state.navigationSession.mode === 'replay' || state.phase !== 'makeup-complete') {
      return state.navigationSession.origin;
    }
    return exitNavigationSession(state);
  }

  function serialize(unit, state) {
    const durable = stateForSerialization(state);
    const resolved = resolvedStageIds(durable);
    return {
      revision: unit.experienceRevision,
      currentStageId: getStage(unit, durable).stageId,
      completedStageIds: [...durable.completedStageIds],
      skippedStageIds: [...durable.skippedStageIds],
      firstRoleId: durable.firstRoleId,
      completedRoleIds: [...durable.completedRoleIds],
      roleStageDispositions: copy(durable.roleStageDispositions),
      contactedSourceRefs: [...durable.contactedSourceRefs],
      evidenceRecords: copy(durable.evidenceRecords),
      adventureHeartsRemaining: durable.adventureHeartsRemaining,
      journey: {
        status: resolved.length === unit.experience.stages.length ? 'resolved' : 'in-progress',
        completedStageIds: [...durable.completedStageIds],
        skippedStageIds: [...durable.skippedStageIds],
        completedAt: durable.journeyCompletedAt
      },
      firstSession: { status: 'recorded', evidenceRecords: copy(durable.evidenceRecords) },
      longTermMastery: { status: 'not-assessed' },
      updatedAt: durable.updatedAt
    };
  }

  return Object.freeze({
    roleIds,
    resolvedStageIds,
    isJourneyComplete,
    createInitialState,
    reduce,
    serialize,
    getStage,
    sourceMap
  });
});
