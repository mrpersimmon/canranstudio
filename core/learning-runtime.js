(function attachLearningRuntime(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningRuntime = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningRuntimeFactory() {
  'use strict';

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function create({ unit, ledger, effectSink = () => {}, seed = 1 } = {}) {
    if (!unit?.unitId || !Array.isArray(unit.beats) || unit.beats.length !== 5) {
      throw new TypeError('learning runtime requires a five-beat teaching unit');
    }
    if (!ledger || typeof ledger.read !== 'function' || typeof ledger.apply !== 'function') {
      throw new TypeError('learning runtime requires a ledger with read and apply');
    }
    if (typeof effectSink !== 'function') throw new TypeError('effectSink must be a function');
    if (!Number.isFinite(Number(seed))) throw new TypeError('seed must be numeric');

    let audioSequence = 0;
    let randomState = (Number(seed) >>> 0) || 1;

    let state = {
      status: 'idle',
      mode: null,
      unitId: unit.unitId,
      entryLesson: null,
      beatId: null,
      microstepId: null,
      contextId: null,
      buildStage: 0,
      supportLevel: 0,
      audio: null
    };

    function snapshot() {
      return clone(state);
    }

    function publish(effects) {
      for (const effect of effects) effectSink(clone(effect));
      return { snapshot: snapshot(), effects: clone(effects) };
    }

    function nextEventId(event) {
      const beatId = event.beatId || 'unit';
      const subjectId = event.targetId || event.checkpointId || 'unit';
      const microstepId = state.microstepId || 'complete';
      return `runtime:${unit.unitId}:${Number(seed)}:${beatId}:${microstepId}:${event.type}:${subjectId}`;
    }

    function applyEvent(event) {
      const result = ledger.apply({ eventId: nextEventId(event), unitId: unit.unitId, ...event });
      if (result?.persisted !== true) {
        return {
          ok: false,
          effects: [{
            type: 'runtime/persistence-failed',
            operation: event.type,
            reason: result?.reason || result?.status || 'unavailable',
            retryable: true
          }]
        };
      }
      return { ok: true, effects: Array.isArray(result.effects) ? result.effects : [] };
    }

    function nextRandom() {
      randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0;
      return randomState / 0x100000000;
    }

    function alternateContext(target, currentContextId) {
      const choices = (target?.contextIds || []).filter(contextId => contextId !== currentContextId);
      if (choices.length === 0) return currentContextId;
      return choices[Math.floor(nextRandom() * choices.length)];
    }

    function authoredAnswer(action) {
      const beat = unit.beats.find(candidate => candidate.beatId === state.beatId);
      const task = beat?.task;
      const binding = task?.formativeBinding || null;
      const target = binding
        ? unit.targets?.find(candidate => candidate.targetId === binding.targetId)
        : null;
      const expectedAnswerId = task?.answerKeyByContext?.[state.contextId];
      if (!task || (binding && !target) || typeof expectedAnswerId !== 'string' || typeof action.answerId !== 'string') {
        return null;
      }
      return {
        correct: action.answerId === expectedAnswerId,
        target,
        contextIds: Object.keys(task.answerKeyByContext),
        formativeBinding: binding,
        contextId: state.contextId,
        targetId: binding?.targetId || null,
        evidenceMode: binding?.evidenceMode || null
      };
    }

    function enter({ entryLesson } = {}) {
      if (!unit.lessonIds.includes(entryLesson)) throw new RangeError(`${entryLesson} is not part of ${unit.unitId}`);
      const projection = ledger.read()?.units?.[unit.unitId] || {};
      const buildStage = Number.isInteger(projection.buildStage) ? projection.buildStage : 0;
      if (buildStage >= 5) {
        state = {
          ...state,
          status: 'unit-built',
          mode: 'standard',
          entryLesson,
          beatId: null,
          microstepId: null,
          contextId: unit.targets?.[0]?.contextIds?.[0] || null,
          buildStage: 5,
          supportLevel: 0,
          audio: null
        };
        return publish([{ type: 'runtime/unit-built', unitId: unit.unitId }]);
      }
      if (entryLesson === unit.lessonIds[0] && buildStage >= 2) {
        state = {
          ...state,
          status: 'handoff',
          mode: 'standard',
          entryLesson,
          beatId: null,
          microstepId: null,
          contextId: unit.targets?.[0]?.contextIds?.[0] || null,
          buildStage,
          supportLevel: 0,
          audio: null
        };
        return publish([{ type: 'navigation/handoff', entryLesson: unit.lessonIds[1] }]);
      }
      const needsBridge = entryLesson === unit.lessonIds[1] && buildStage < 2;
      const beatIndex = Math.min(buildStage, 4);
      const beat = unit.beats[beatIndex];
      const initialMicrostepId = !needsBridge && beat.beatId === 'understand'
        ? 'understand-audio'
        : (needsBridge ? `bridge-${beat.beatId}-check` : `${beat.beatId}-check`);
      state = {
        ...state,
        status: 'active',
        mode: needsBridge ? 'bridge' : 'standard',
        entryLesson,
        beatId: beat.beatId,
        microstepId: initialMicrostepId,
        contextId: unit.targets?.[0]?.contextIds?.[0] || null,
        buildStage
      };
      return publish([{
        type: 'scene/show',
        beatId: state.beatId,
        microstepId: state.microstepId,
        contextId: state.contextId
      }]);
    }

    function dispatch(action = {}) {
      if (state.status !== 'active') return publish([]);
      if (action.type === 'audio/play' && state.microstepId === 'understand-audio') {
        const effects = [];
        if (state.audio?.status === 'playing') {
          effects.push({ type: 'audio/cancel', requestId: state.audio.requestId });
        }
        audioSequence += 1;
        const requestId = `audio:${unit.unitId}:${Number(seed)}:${audioSequence}`;
        state.audio = { requestId, audioId: action.audioId, status: 'playing' };
        effects.push({ type: 'audio/play', requestId, audioId: action.audioId });
        return publish(effects);
      }
      if (action.type === 'audio/completed') {
        if (state.audio?.status !== 'playing' || action.requestId !== state.audio.requestId) {
          return publish([]);
        }
        state.audio = { ...state.audio, status: 'completed' };
        state.microstepId = 'understand-check';
        return publish([{
          type: 'scene/show',
          beatId: state.beatId,
          microstepId: state.microstepId,
          contextId: state.contextId
        }]);
      }
      if (action.type === 'audio/failed') {
        if (state.audio?.status !== 'playing' || action.requestId !== state.audio.requestId) {
          return publish([]);
        }
        state.audio = { ...state.audio, status: 'failed' };
        state.microstepId = 'understand-check';
        return publish([
          {
            type: 'audio/fallback',
            requestId: state.audio.requestId,
            audioId: state.audio.audioId,
            reason: typeof action.reason === 'string' ? action.reason : 'unavailable',
            fallback: 'text-image'
          },
          {
            type: 'scene/show',
            beatId: state.beatId,
            microstepId: state.microstepId,
            contextId: state.contextId
          }
        ]);
      }
      const answer = action.type === 'answer/submit' ? authoredAnswer(action) : null;
      if (action.type === 'answer/submit' && !answer) {
        return publish([{ type: 'runtime/invalid-action', actionType: action.type }]);
      }
      if (
        action.type === 'answer/submit' &&
        answer.correct === false &&
        state.supportLevel >= 3 &&
        state.microstepId.endsWith('-near-transfer')
      ) {
        const effects = [];
        if (answer.formativeBinding) {
          const applied = applyEvent({
            type: 'formative-attempt',
            beatId: state.beatId,
            targetId: answer.targetId,
            outcome: 'failed',
            contextId: answer.contextId,
            evidenceMode: answer.evidenceMode,
            source: state.mode === 'bridge' ? 'compressed-bridge' : 'new-learning'
          });
          effects.push(...applied.effects);
          if (!applied.ok) return publish(effects);
        }
        const endedBeatId = state.beatId;
        state = {
          ...state,
          status: 'needs-review',
          microstepId: `${endedBeatId}-attempt-ended`
        };
        effects.push({ type: 'feedback/failed', supportLevel: 3, retryable: true });
        effects.push({
          type: 'runtime/attempt-ended',
          unitId: unit.unitId,
          beatId: endedBeatId,
          outcome: 'failed',
          retryable: true
        });
        return publish(effects);
      }
      if (action.type === 'answer/submit' && answer.correct === false) {
        const target = answer.target || { contextIds: answer.contextIds };
        const ladder = target?.supportLadder || ['reobserve', 'partial-cue', 'model', 'near-transfer'];
        const nextLevel = Math.min(state.supportLevel + 1, 3);
        state.supportLevel = nextLevel;
        const effects = [{
          type: 'feedback/support',
          level: nextLevel,
          supportKind: ladder[nextLevel - 1],
          revealsAnswer: nextLevel >= 3
        }];
        if (nextLevel === 3) {
          const fromContextId = state.contextId;
          state.contextId = alternateContext(target, fromContextId);
          state.microstepId = `${state.beatId}-near-transfer`;
          effects.push({
            type: 'scene/near-transfer',
            fromContextId,
            contextId: state.contextId,
            microstepId: state.microstepId
          });
        }
        return publish(effects);
      }
      if (action.type === 'answer/submit' && answer.correct === true && state.mode === 'bridge') {
        const effects = [];
        const answerContextId = answer.contextId;
        let applied;
        if (answer.formativeBinding) {
          applied = applyEvent({
            type: 'formative-attempt',
            beatId: state.beatId,
            targetId: answer.targetId,
            outcome: state.supportLevel > 0 ? 'supported' : 'practice-only',
            contextId: answerContextId,
            evidenceMode: answer.evidenceMode,
            source: 'compressed-bridge'
          });
          effects.push(...applied.effects);
          if (!applied.ok) return publish(effects);
        }

        const completedBeat = state.beatId;
        const completedStage = completedBeat === unit.beats[0].beatId ? 1 : 2;
        applied = applyEvent({
          type: 'checkpoint-completed',
          beatId: completedBeat,
          checkpointId: `${completedBeat}:complete`,
          buildStage: completedStage,
          source: 'compressed-bridge'
        });
        effects.push(...applied.effects);
        if (!applied.ok) return publish(effects);
        state.buildStage = completedStage;
        effects.push({ type: 'landmark/build-stage', buildStage: completedStage });

        const nextBeat = unit.beats[completedStage];
        state.mode = completedStage >= 2 ? 'standard' : 'bridge';
        state.beatId = nextBeat.beatId;
        state.microstepId = state.mode === 'bridge'
          ? `bridge-${nextBeat.beatId}-check`
          : `${nextBeat.beatId}-check`;
        state.contextId = answerContextId;
        state.supportLevel = 0;
        effects.push({
          type: 'scene/show',
          beatId: state.beatId,
          microstepId: state.microstepId,
          contextId: state.contextId
        });
        return publish(effects);
      }
      if (action.type === 'answer/submit' && answer.correct === true && state.mode === 'standard') {
        if (!state.microstepId.endsWith('-check') && !state.microstepId.endsWith('-near-transfer')) {
          return publish([]);
        }
        const effects = [];
        const completedBeatIndex = unit.beats.findIndex(beat => beat.beatId === state.beatId);
        const completedBeat = unit.beats[completedBeatIndex];
        const outcome = state.supportLevel > 0 ? 'supported' : 'practice-only';
        const contextId = answer.contextId;

        if (completedBeat.buildStage < 5) {
          let applied;
          if (answer.formativeBinding) {
            applied = applyEvent({
              type: 'formative-attempt',
              beatId: completedBeat.beatId,
              targetId: answer.targetId,
              outcome,
              contextId,
              evidenceMode: answer.evidenceMode,
              source: 'new-learning'
            });
            effects.push(...applied.effects);
            if (!applied.ok) return publish(effects);
          }
          applied = applyEvent({
            type: 'checkpoint-completed',
            beatId: completedBeat.beatId,
            checkpointId: `${completedBeat.beatId}:complete`,
            buildStage: completedBeat.buildStage,
            source: 'new-learning'
          });
          effects.push(...applied.effects);
          if (!applied.ok) return publish(effects);
          state.buildStage = completedBeat.buildStage;
          state.contextId = contextId;
          effects.push({ type: 'landmark/build-stage', buildStage: state.buildStage });

          if (state.entryLesson === unit.lessonIds[0] && completedBeat.buildStage === 2) {
            state = {
              ...state,
              status: 'handoff',
              beatId: null,
              microstepId: null,
              supportLevel: 0,
              audio: null
            };
            effects.push({ type: 'navigation/handoff', entryLesson: unit.lessonIds[1] });
            return publish(effects);
          }

          const nextBeat = unit.beats[completedBeatIndex + 1];
          state.beatId = nextBeat.beatId;
          state.microstepId = nextBeat.beatId === 'understand'
            ? 'understand-audio'
            : `${nextBeat.beatId}-check`;
          state.supportLevel = 0;
          state.audio = null;
          effects.push({
            type: 'scene/show',
            beatId: state.beatId,
            microstepId: state.microstepId,
            contextId: state.contextId
          });
          return publish(effects);
        }

        const applied = applyEvent({
          type: 'unit-built',
          beatId: completedBeat.beatId,
          buildStage: 5,
          source: 'new-learning'
        });
        effects.push(...applied.effects);
        if (!applied.ok) return publish(effects);
        state = {
          ...state,
          status: 'unit-built',
          beatId: null,
          microstepId: null,
          buildStage: 5,
          supportLevel: 0,
          audio: null
        };
        effects.push({ type: 'landmark/build-stage', buildStage: 5 });
        effects.push({ type: 'runtime/unit-built', unitId: unit.unitId });
        return publish(effects);
      }
      return publish([]);
    }

    function destroy() {
      const effects = state.audio?.status === 'playing'
        ? [{ type: 'audio/cancel', requestId: state.audio.requestId }]
        : [];
      state = { ...state, status: 'destroyed', audio: null };
      return publish(effects);
    }

    return Object.freeze({ enter, dispatch, snapshot, destroy });
  }

  return Object.freeze({ create });
});
