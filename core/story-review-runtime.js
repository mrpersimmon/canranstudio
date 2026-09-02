(function attachStoryReviewRuntime(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.storyReviewRuntime = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function storyReviewRuntimeFactory() {
  'use strict';

  function items(unit) {
    return unit?.experience?.reviewRun?.items || [];
  }

  function localDayStart(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  function isEligible(unit, mainlineProgress, now = new Date()) {
    if (!unit || mainlineProgress?.revision !== unit.experienceRevision) return false;
    if (mainlineProgress?.journey?.status !== 'resolved') return false;
    const completedDay = localDayStart(mainlineProgress.journey.completedAt);
    const currentDay = localDayStart(now);
    if (completedDay === null || currentDay === null) return false;
    return currentDay > completedDay;
  }

  function createInitialState(unit) {
    if (!items(unit).length) throw new Error('Story review items are required');
    return {
      revision: unit.experienceRevision,
      phase: 'entry',
      currentIndex: null,
      heartsRemaining: 3,
      results: [],
      rescueUsed: false,
      requestCounter: 0,
      pendingAudio: null,
      failedAudio: null,
      wrongAttempts: 0
    };
  }

  function requestAudio(state, audioRefs, purpose) {
    const requestId = state.requestCounter + 1;
    return {
      ...state,
      phase: 'audio-playing',
      requestCounter: requestId,
      failedAudio: null,
      pendingAudio: { requestId, audioRefs: [...audioRefs], purpose }
    };
  }

  function accepted(item, action) {
    if (item.acceptedEntityId) return action.entityId === item.acceptedEntityId;
    if (item.acceptedOptionId) return action.optionId === item.acceptedOptionId;
    return false;
  }

  function reduce(unit, state, action) {
    if (!action?.type) return state;
    if (action.type === 'START' && state.phase === 'entry') {
      return { ...state, phase: 'audio-ready', currentIndex: 0 };
    }
    if (action.type === 'PLAY_AUDIO' && state.phase === 'audio-ready') {
      return requestAudio(state, [items(unit)[state.currentIndex].sourceRef], 'unlock-response');
    }
    if (action.type === 'ANSWER' && state.phase === 'awaiting-response') {
      const item = items(unit)[state.currentIndex];
      if (!accepted(item, action)) {
        const heartsRemaining = Math.max(0, state.heartsRemaining - 1);
        return {
          ...state,
          heartsRemaining,
          wrongAttempts: state.wrongAttempts + 1,
          phase: heartsRemaining === 0 ? 'rescue-ready' : 'awaiting-response'
        };
      }
      const result = {
        reviewId: item.reviewId,
        sourceRef: item.sourceRef,
        outcome: state.rescueUsed ? 'review-assisted-practice' : 'independent-retrieval'
      };
      const results = [...state.results, result];
      const nextIndex = state.currentIndex + 1;
      return {
        ...state,
        results,
        currentIndex: nextIndex < items(unit).length ? nextIndex : state.currentIndex,
        phase: nextIndex < items(unit).length ? 'audio-ready' : 'complete',
        heartsRemaining: Math.min(3, state.heartsRemaining + 1),
        wrongAttempts: 0
      };
    }
    if (action.type === 'START_RESCUE' && state.phase === 'rescue-ready') {
      return requestAudio(state, unit.experience.rescueExample.audioRefs, 'rescue-example');
    }
    if (action.type === 'AUDIO_ENDED') {
      if (!state.pendingAudio || action.requestId !== state.pendingAudio.requestId) return state;
      if (state.pendingAudio.purpose === 'rescue-example') {
        return {
          ...state,
          phase: 'audio-ready',
          currentIndex: 0,
          heartsRemaining: 3,
          results: [],
          rescueUsed: true,
          wrongAttempts: 0,
          pendingAudio: null
        };
      }
      return { ...state, phase: 'awaiting-response', pendingAudio: null };
    }
    if (action.type === 'AUDIO_FAILED') {
      if (!state.pendingAudio || action.requestId !== state.pendingAudio.requestId) return state;
      return { ...state, phase: 'audio-failed', failedAudio: state.pendingAudio, pendingAudio: null };
    }
    if (action.type === 'RETRY_AUDIO' && state.phase === 'audio-failed' && state.failedAudio) {
      return requestAudio(state, state.failedAudio.audioRefs, state.failedAudio.purpose);
    }
    if (action.type === 'RESTART') return createInitialState(unit);
    return state;
  }

  function serialize(unit, state) {
    return {
      revision: unit.experienceRevision,
      completedAt: state.phase === 'complete' ? new Date().toISOString() : null,
      results: state.results.map(result => ({ ...result })),
      longTermMastery: {
        status: state.phase === 'complete'
          ? (state.rescueUsed ? 'reviewed-assisted' : 'reviewed-independent')
          : 'not-assessed'
      }
    };
  }

  return Object.freeze({ createInitialState, isEligible, reduce, serialize });
});
