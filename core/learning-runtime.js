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

  function evaluateResponse(responseKey, response, path = []) {
    if (!responseKey || typeof responseKey !== 'object') {
      return { correct: false, mismatchPath: path };
    }
    if (responseKey.type === 'single') {
      const accepted = Array.isArray(responseKey.acceptedValues)
        ? responseKey.acceptedValues
        : [responseKey.value];
      return accepted.includes(response)
        ? { correct: true, mismatchPath: null }
        : { correct: false, mismatchPath: path };
    }
    if (responseKey.type === 'set') {
      if (!Array.isArray(response)) return { correct: false, mismatchPath: path };
      const expected = [...new Set(responseKey.values || [])].sort();
      const actual = [...new Set(response)].sort();
      const correct = expected.length === actual.length
        && expected.every((value, index) => value === actual[index]);
      return { correct, mismatchPath: correct ? null : path };
    }
    if (responseKey.type === 'ordered') {
      if (!Array.isArray(response)) return { correct: false, mismatchPath: path };
      const expected = responseKey.values || [];
      const correct = expected.length === response.length
        && expected.every((value, index) => value === response[index]);
      return { correct, mismatchPath: correct ? null : path };
    }
    if (responseKey.type === 'mapping') {
      if (!response || typeof response !== 'object' || Array.isArray(response)) {
        return { correct: false, mismatchPath: path };
      }
      for (const [fieldId, expected] of Object.entries(responseKey.entries || {})) {
        if (response[fieldId] !== expected) {
          return { correct: false, mismatchPath: [...path, fieldId] };
        }
      }
      const correct = Object.keys(response).length === Object.keys(responseKey.entries || {}).length;
      return { correct, mismatchPath: correct ? null : path };
    }
    if (responseKey.type === 'composition') {
      if (!response || typeof response !== 'object' || Array.isArray(response)) {
        return { correct: false, mismatchPath: path };
      }
      for (const [fieldId, nestedKey] of Object.entries(responseKey.fields || {})) {
        const evaluated = evaluateResponse(nestedKey, response[fieldId], [...path, fieldId]);
        if (!evaluated.correct) return evaluated;
      }
      const correct = Object.keys(response).length === Object.keys(responseKey.fields || {}).length;
      return { correct, mismatchPath: correct ? null : path };
    }
    return { correct: false, mismatchPath: path };
  }

  function evaluateRule(rule, response, path = []) {
    if (!rule || typeof rule !== 'object' || !response || typeof response !== 'object') {
      return { correct: false, mismatchPath: path };
    }
    if (rule.type === 'select-one') {
      const checks = [
        ['sourceRef', rule.acceptedSourceRef],
        ['contentRef', rule.acceptedContentRef]
      ].filter(([, expected]) => typeof expected === 'string');
      if (Array.isArray(rule.acceptedEntityIds)) {
        const correct = rule.acceptedEntityIds.includes(response.entityId);
        return { correct, mismatchPath: correct ? null : [...path, 'entityId'] };
      }
      if (checks.length !== 1) return { correct: false, mismatchPath: path };
      const [field, expected] = checks[0];
      const correct = response[field] === expected;
      return { correct, mismatchPath: correct ? null : [...path, field] };
    }
    if (rule.type === 'match-entity') {
      const expected = rule.pairs?.[response.sourceRef];
      const correct = typeof expected === 'string' && response.entityId === expected;
      return { correct, mismatchPath: correct ? null : [...path, 'entityId'] };
    }
    if (rule.type === 'place-in-slot') {
      const correct = response.slotId === rule.slotId && response.entityId === rule.entityId;
      return { correct, mismatchPath: correct ? null : [...path, 'slotId'] };
    }
    if (rule.type === 'ordered-blocks') {
      const expected = rule.acceptedByEntityId?.[response.selectedEntityId];
      const actual = response.blockRefs;
      const correct = Array.isArray(expected)
        && Array.isArray(actual)
        && expected.length === actual.length
        && expected.every((blockRef, index) => blockRef === actual[index]);
      return { correct, mismatchPath: correct ? null : [...path, 'blockRefs'] };
    }
    if (rule.type === 'perform-action') {
      const expectedEntityId = rule.entityFactId
        ? response.factValues?.[rule.entityFactId]
        : rule.entityId;
      const correct = response.action === rule.action
        && response.entityId === expectedEntityId
        && response.targetEntityId === rule.targetEntityId;
      return { correct, mismatchPath: correct ? null : [...path, 'action'] };
    }
    if (rule.type === 'all-of') {
      const expected = [...new Set(rule.requiredFactIds || [])].sort();
      const actual = [...new Set(response.factIds || [])].sort();
      const correct = expected.length === actual.length
        && expected.every((factId, index) => factId === actual[index]);
      return { correct, mismatchPath: correct ? null : [...path, 'factIds'] };
    }
    return { correct: false, mismatchPath: path };
  }

  function createMicrotaskV2({ unit, ledger, effectSink, seed }) {
    const authoredTasks = unit.beats.flatMap(beat => (
      (beat.microtasks || []).map(task => ({ beatId: beat.beatId, task }))
    ));
    let activeTaskIndex = -1;
    let audioSequence = 0;
    let pendingTask = null;
    let pendingPersistence = null;
    let durableFacts = new Set();
    let previewMode = false;
    let state = {
      status: 'idle',
      mode: 'microtask-v2',
      unitId: unit.unitId,
      entryLesson: null,
      beatId: null,
      microtaskId: null,
      stepId: null,
      stepIndex: null,
      phase: null,
      batchIndex: 0,
      challengeRef: null,
      supportLevel: 0,
      heartsRemaining: 3,
      assistanceMode: false,
      buildStage: 0,
      audio: null
    };

    function snapshot() {
      return clone(state);
    }

    function publish(effects) {
      for (const effect of effects) effectSink(clone(effect));
      return { snapshot: snapshot(), effects: clone(effects) };
    }

    function phaseForStep(step) {
      if (step?.kind === 'audio-sequence') return 'audio-ready';
      if (step?.kind === 'source-reveal') {
        return Array.isArray(step.audioSourceRefs) && step.audioSourceRefs.length > 0
          ? 'audio-ready'
          : 'response';
      }
      if (
        ['match-entity', 'match-entity-batch'].includes(step?.kind)
        && step.challengeMode !== 'word-form'
      ) return 'audio-ready';
      return 'response';
    }

    function currentTask() {
      return authoredTasks[activeTaskIndex]?.task || null;
    }

    function currentStep() {
      return currentTask()?.steps?.[state.stepIndex] || null;
    }

    function activateStep(stepIndex) {
      const step = currentTask()?.steps?.[stepIndex];
      if (!step) return false;
      const challengeRefs = step.challengeSourceRefs || step.sourceRefs || [];
      state = {
        ...state,
        stepId: step.stepId,
        stepIndex,
        phase: phaseForStep(step),
        batchIndex: 0,
        challengeRef: challengeRefs[0] || null,
        supportLevel: 0,
        heartsRemaining: 3,
        assistanceMode: false
      };
      return true;
    }

    function advanceBatchOrStep() {
      const step = currentStep();
      const challengeRefs = step?.challengeSourceRefs || step?.sourceRefs || [];
      const nextBatchIndex = state.batchIndex + 1;
      if (nextBatchIndex < challengeRefs.length) {
        state = {
          ...state,
          batchIndex: nextBatchIndex,
          challengeRef: challengeRefs[nextBatchIndex],
          phase: step.kind === 'explore-batch'
            ? 'response'
            : (step.challengeMode === 'word-form' ? 'response' : 'audio-ready'),
          supportLevel: 0,
          heartsRemaining: 3,
          assistanceMode: false
        };
        return [];
      }
      return advanceAfterStep();
    }

    function findSource(sourceRef) {
      for (const lesson of Object.values(unit.lessonContent || {})) {
        if (lesson.sources?.[sourceRef]) return lesson.sources[sourceRef];
      }
      return null;
    }

    function resolveAudioRef(refId, kind = 'source') {
      const item = kind === 'content'
        ? unit.authoredContent?.[refId]
        : findSource(refId);
      if (!item?.audioSrc) return null;
      return { kind, refId, src: item.audioSrc, text: item.text };
    }

    function audioRefsForStep(step) {
      if (!step) return [];
      if (Array.isArray(step.audioSourceRefs)) {
        return step.audioSourceRefs.map(refId => resolveAudioRef(refId)).filter(Boolean);
      }
      if (Array.isArray(step.audioContentRefs)) {
        return step.audioContentRefs.map(refId => resolveAudioRef(refId, 'content')).filter(Boolean);
      }
      if (['match-entity', 'match-entity-batch'].includes(step.kind)) {
        const refId = step.challengeSourceRefs?.[state.batchIndex];
        const resolved = resolveAudioRef(refId);
        return resolved ? [resolved] : [];
      }
      return [];
    }

    function audioEffect(audio, segmentIndex) {
      return {
        type: 'audio/play',
        requestId: audio.requestId,
        segmentIndex,
        audioRef: clone(audio.refs[segmentIndex])
      };
    }

    function targetResultsForStep(stepId) {
      return (currentTask()?.targetResults || []).filter(result => result.stepId === stepId);
    }

    function recordStepResults(step, outcome) {
      for (const result of targetResultsForStep(step.stepId)) {
        if (pendingTask.results.some(candidate => candidate.resultId === result.resultId)) continue;
        pendingTask.results.push({
          ...clone(result),
          outcome,
          supportLevel: state.supportLevel,
          heartsRemaining: state.heartsRemaining
        });
      }
    }

    function feedbackAudioForStep(step, response) {
      if (step.feedbackAudioSourceRef) {
        return resolveAudioRef(step.feedbackAudioSourceRef);
      }
      if (step.feedbackAudioContentRef) {
        return resolveAudioRef(step.feedbackAudioContentRef, 'content');
      }
      if (step.feedbackAudioContentByEntityId) {
        const refId = step.feedbackAudioContentByEntityId[response.selectedEntityId];
        return refId ? resolveAudioRef(refId, 'content') : null;
      }
      if (
        ['match-entity', 'match-entity-batch'].includes(step.kind)
        && step.challengeMode === 'word-form'
        && step.feedbackGate
      ) {
        return resolveAudioRef(step.challengeSourceRefs?.[state.batchIndex]);
      }
      return null;
    }

    function queueFeedbackAudio(audioRef, after) {
      if (!audioRef) return false;
      state = {
        ...state,
        phase: 'audio-ready',
        audio: {
          status: 'ready',
          requestId: null,
          segmentIndex: 0,
          refs: [clone(audioRef)],
          stepId: state.stepId,
          batchIndex: state.batchIndex,
          after,
          purpose: 'feedback'
        }
      };
      return true;
    }

    function taskCompletionStatus() {
      const outcomes = pendingTask.results.map(result => result.outcome);
      if (outcomes.includes('assisted') || outcomes.includes('audio-unavailable')) {
        return 'completed-assisted';
      }
      if (outcomes.includes('supported')) return 'completed-supported';
      return 'completed-independent';
    }

    function completionEvent() {
      const task = currentTask();
      return {
        eventId: `runtime:${unit.unitId}:${seed}:${task.microtaskId}:microtask-completed`,
        type: 'microtask-completed',
        unitId: unit.unitId,
        beatId: authoredTasks[activeTaskIndex].beatId,
        microtaskId: task.microtaskId,
        checkpointId: task.checkpointAfterSuccess.checkpointId,
        completionStatus: taskCompletionStatus(),
        targetResults: clone(pendingTask.results),
        sourceContacts: (task.exposureRefs || []).map(sourceRef => ({
          sourceRef,
          contactModes: [
            'experienced',
            ...(pendingTask.audioContactRefs.includes(sourceRef) ? ['audio-ended'] : []),
            ...(pendingTask.missingAudioRefs.includes(sourceRef) ? ['audio-unavailable'] : [])
          ]
        })),
        audioContactRefs: clone(pendingTask.audioContactRefs),
        missingAudioRefs: clone(pendingTask.missingAudioRefs),
        storyFacts: clone(task.persistence?.checkpointFacts || []),
        ...(task.checkpointAfterSuccess.buildStage === undefined
          ? {}
          : { buildStage: task.checkpointAfterSuccess.buildStage }),
        source: 'new-learning'
      };
    }

    function persistCompletedTask(event) {
      const task = currentTask();
      const result = previewMode ? { persisted: true } : ledger.apply(event);
      if (result?.persisted !== true) {
        pendingPersistence = clone(event);
        state = { ...state, phase: 'persistence-retry' };
        return [{
          type: 'runtime/persistence-failed',
          operation: event.type,
          reason: result?.reason || result?.status || 'unavailable',
          retryable: true
        }];
      }
      pendingPersistence = null;
      for (const factId of event.storyFacts) durableFacts.add(factId);
      const effects = [{
        type: previewMode ? 'runtime/microtask-preview-completed' : 'runtime/microtask-completed',
        microtaskId: task.microtaskId,
        checkpointId: event.checkpointId,
        completionStatus: event.completionStatus
      }];
      if (task.growthBoundary === 'chapter-interior') {
        state = {
          ...state,
          status: 'chapter-stop',
          phase: 'completed',
          audio: null
        };
        effects.push(previewMode
          ? { type: 'chapter/preview-stop', lessonId: task.lessonId }
          : {
              type: 'chapter/interior-complete',
              lessonId: task.lessonId,
              storyFacts: clone(event.storyFacts)
            });
        return effects;
      }
      if (task.growthBoundary === 'unit-built') {
        state = {
          ...state,
          status: 'unit-built',
          phase: 'completed',
          buildStage: previewMode ? state.buildStage : 5,
          audio: null
        };
        if (previewMode) {
          effects.push({ type: 'runtime/preview-complete', unitId: unit.unitId });
        } else {
          effects.push({ type: 'landmark/build-stage', buildStage: 5 });
          effects.push({ type: 'runtime/unit-built', unitId: unit.unitId });
        }
        return effects;
      }
      const next = enterTask(activeTaskIndex + 1);
      if (next) {
        effects.push({
          type: 'scene/show',
          beatId: next.beatId,
          microtaskId: next.task.microtaskId,
          stepId: next.task.steps[0].stepId
        });
      }
      return effects;
    }

    function completeCurrentTask() {
      return persistCompletedTask(completionEvent());
    }

    function advanceAfterStep() {
      if (activateStep(state.stepIndex + 1)) return [];
      return completeCurrentTask();
    }

    function enterTask(taskIndex) {
      const authored = authoredTasks[taskIndex];
      const step = authored?.task.steps?.[0];
      if (!authored || !step) return null;
      activeTaskIndex = taskIndex;
      pendingTask = {
        results: [],
        audioContactRefs: [],
        missingAudioRefs: [],
        audioUnavailableSteps: [],
        factValues: {}
      };
      state = {
        ...state,
        status: 'active',
        beatId: authored.beatId,
        microtaskId: authored.task.microtaskId,
        stepId: step.stepId,
        stepIndex: 0,
        phase: phaseForStep(step),
        batchIndex: 0,
        challengeRef: step.challengeSourceRefs?.[0] || step.sourceRefs?.[0] || null,
        supportLevel: 0,
        heartsRemaining: 3,
        assistanceMode: false,
        audio: null
      };
      return authored;
    }

    function enter({ entryLesson } = {}) {
      if (!unit.lessonIds.includes(entryLesson)) {
        throw new TypeError(`entryLesson must belong to ${unit.unitId}`);
      }
      previewMode = false;
      const projection = ledger.read();
      const durable = projection?.units?.[unit.unitId] || {};
      durableFacts = new Set(Array.isArray(durable.storyFacts) ? durable.storyFacts : []);
      state.entryLesson = entryLesson;
      state.mode = 'microtask-v2';
      state.buildStage = Number.isInteger(durable.buildStage) ? durable.buildStage : 0;
      const completedId = typeof durable.checkpoint === 'object'
        ? durable.checkpoint?.microtaskId
        : null;
      const completedIndex = authoredTasks.findIndex(item => item.task.microtaskId === completedId);
      const completedTask = authoredTasks[completedIndex]?.task;
      if (
        completedTask?.growthBoundary === 'chapter-interior'
        && entryLesson === completedTask.lessonId
      ) {
        activeTaskIndex = completedIndex;
        state = {
          ...state,
          status: 'chapter-stop',
          beatId: authoredTasks[completedIndex].beatId,
          microtaskId: completedTask.microtaskId,
          stepId: null,
          stepIndex: null,
          phase: 'completed',
          audio: null
        };
        return publish([{ type: 'chapter/interior-restored', lessonId: completedTask.lessonId }]);
      }
      let nextIndex = completedIndex >= 0 ? completedIndex + 1 : 0;
      if (completedIndex < 0 && entryLesson === unit.lessonIds[1]) {
        nextIndex = authoredTasks.findIndex(item => item.task.lessonId === entryLesson);
      }
      const authored = enterTask(nextIndex);
      if (!authored) {
        state = { ...state, status: 'unit-built', beatId: null, microtaskId: null, stepId: null, phase: null };
        return publish([]);
      }
      return publish([{
        type: 'scene/show',
        beatId: authored.beatId,
        microtaskId: authored.task.microtaskId,
        stepId: authored.task.steps[0].stepId
      }]);
    }

    function preview({ microtaskId } = {}) {
      if (state.status !== 'idle') {
        throw new TypeError('microtask preview requires a fresh runtime');
      }
      const targetIndex = authoredTasks.findIndex(item => item.task.microtaskId === microtaskId);
      if (targetIndex < 0) throw new TypeError(`unknown preview microtask ${microtaskId}`);
      previewMode = true;
      pendingPersistence = null;
      durableFacts = new Set(authoredTasks
        .slice(0, targetIndex)
        .flatMap(item => item.task.persistence?.checkpointFacts || []));
      state = {
        ...state,
        mode: 'microtask-v2-preview',
        entryLesson: authoredTasks[targetIndex].task.lessonId,
        buildStage: 0,
        audio: null
      };
      const authored = enterTask(targetIndex);
      return publish([{
        type: 'scene/show',
        beatId: authored.beatId,
        microtaskId: authored.task.microtaskId,
        stepId: authored.task.steps[0].stepId,
        preview: true
      }]);
    }

    function dispatch(action = {}) {
      if (state.status === 'chapter-stop' && action.type === 'chapter/continue') {
        const next = enterTask(activeTaskIndex + 1);
        return next
          ? publish([{
              type: 'scene/show',
              beatId: next.beatId,
              microtaskId: next.task.microtaskId,
              stepId: next.task.steps[0].stepId
            }])
          : publish([]);
      }
      if (
        state.status === 'active'
        && state.phase === 'persistence-retry'
        && action.type === 'persistence/retry'
        && pendingPersistence
      ) {
        return publish(persistCompletedTask(clone(pendingPersistence)));
      }
      if (state.status !== 'active') return publish([]);
      if (action.type === 'audio/play' && ['audio-ready', 'audio-playing'].includes(state.phase)) {
        const refs = state.audio?.stepId === state.stepId
          && state.audio?.batchIndex === state.batchIndex
          && state.audio?.refs?.length
          ? state.audio.refs
          : audioRefsForStep(currentStep());
        if (refs.length === 0) return publish([]);
        const effects = [];
        if (state.audio?.status === 'playing') {
          effects.push({ type: 'audio/cancel', requestId: state.audio.requestId });
        }
        const audio = {
          status: 'playing',
          requestId: `audio:${unit.unitId}:${seed}:${++audioSequence}`,
          segmentIndex: 0,
          refs: clone(refs),
          stepId: state.stepId,
          batchIndex: state.batchIndex,
          after: state.audio?.status === 'ready' && state.audio?.after
            ? state.audio.after
            : (['match-entity', 'match-entity-batch'].includes(currentStep()?.kind)
                ? 'open-response'
                : 'advance-step'),
          purpose: state.audio?.status === 'ready' && state.audio?.purpose
            ? state.audio.purpose
            : 'instruction'
        };
        state = { ...state, phase: 'audio-playing', audio };
        effects.push(audioEffect(audio, 0));
        return publish(effects);
      }
      if (action.type === 'audio/ended' && state.phase === 'audio-playing') {
        if (
          action.requestId !== state.audio?.requestId
          || action.segmentIndex !== state.audio?.segmentIndex
        ) return publish([]);
        const completedAudioRef = state.audio.refs[state.audio.segmentIndex];
        const completedRef = completedAudioRef?.kind === 'source' ? completedAudioRef.refId : null;
        if (completedRef && !pendingTask.audioContactRefs.includes(completedRef)) {
          pendingTask.audioContactRefs.push(completedRef);
        }
        const nextSegmentIndex = state.audio.segmentIndex + 1;
        if (nextSegmentIndex < state.audio.refs.length) {
          state = {
            ...state,
            audio: { ...state.audio, segmentIndex: nextSegmentIndex }
          };
          return publish([audioEffect(state.audio, nextSegmentIndex)]);
        }
        state = {
          ...state,
          audio: { ...state.audio, status: 'completed' }
        };
        if (state.audio.after === 'open-response') {
          state = { ...state, phase: 'response' };
        } else if (state.audio.after === 'advance-batch') {
          const effects = advanceBatchOrStep();
          return publish(effects);
        } else {
          const effects = advanceAfterStep();
          return publish(effects);
        }
        return publish([]);
      }
      if (action.type === 'audio/failed' && state.phase === 'audio-playing') {
        if (action.requestId !== state.audio?.requestId) return publish([]);
        const unresolvedRefs = state.audio.refs
          .slice(state.audio.segmentIndex)
          .map(ref => ref.refId);
        const unresolvedSourceRefs = state.audio.refs
          .slice(state.audio.segmentIndex)
          .filter(ref => ref.kind === 'source')
          .map(ref => ref.refId);
        state = {
          ...state,
          phase: 'audio-fallback',
          audio: {
            ...state.audio,
            status: 'failed',
            reason: typeof action.reason === 'string' ? action.reason : 'unavailable',
            unresolvedRefs,
            unresolvedSourceRefs
          }
        };
        return publish([{
          type: 'audio/fallback',
          requestId: state.audio.requestId,
          reason: state.audio.reason,
          fallback: 'text-image',
          audioRefs: clone(unresolvedRefs),
          requiresExplicitContinue: true
        }]);
      }
      if (action.type === 'audio/continue-without-sound' && state.phase === 'audio-fallback') {
        for (const sourceRef of state.audio.unresolvedSourceRefs || []) {
          if (!pendingTask.missingAudioRefs.includes(sourceRef)) {
            pendingTask.missingAudioRefs.push(sourceRef);
          }
        }
        if (
          state.audio.after === 'open-response'
          && !pendingTask.audioUnavailableSteps.includes(state.stepId)
        ) {
          pendingTask.audioUnavailableSteps.push(state.stepId);
        }
        state = { ...state, audio: { ...state.audio, status: 'skipped' } };
        if (state.audio.after === 'open-response') {
          state = { ...state, phase: 'response' };
          return publish([{
            type: 'audio/fallback-continued',
            stepId: state.stepId,
            soundContactRecorded: false
          }]);
        }
        if (state.audio.after === 'advance-batch') {
          return publish(advanceBatchOrStep());
        }
        return publish(advanceAfterStep());
      }
      if (action.type === 'explore/activate' && state.phase === 'response') {
        const step = currentStep();
        if (step?.kind !== 'explore-batch') return publish([]);
        const expectedSourceRef = step.sourceRefs?.[state.batchIndex];
        const expectedEntityId = step.entityIds?.[state.batchIndex];
        if (action.sourceRef !== expectedSourceRef || action.entityId !== expectedEntityId) {
          return publish([]);
        }
        const audioRef = resolveAudioRef(expectedSourceRef);
        if (!audioRef) return publish([]);
        const audio = {
          status: 'playing',
          requestId: `audio:${unit.unitId}:${seed}:${++audioSequence}`,
          segmentIndex: 0,
          refs: [audioRef],
          stepId: state.stepId,
          batchIndex: state.batchIndex,
          after: 'advance-batch'
        };
        state = { ...state, phase: 'audio-playing', audio };
        return publish([audioEffect(audio, 0)]);
      }
      if (action.type === 'response/submit' && state.phase === 'response') {
        const step = currentStep();
        if (!step?.answerRule) return publish([]);
        const response = {
          ...(action.response && typeof action.response === 'object' ? action.response : {}),
          factValues: clone(pendingTask.factValues)
        };
        if (step.answerRule.type === 'ordered-blocks' && step.selectedEntityFactId) {
          response.selectedEntityId = pendingTask.factValues[step.selectedEntityFactId];
        }
        const durablePreconditionsMet = step.answerRule.type !== 'all-of'
          || (step.answerRule.requiredFactIds || []).every(factId => durableFacts.has(factId));
        const evaluated = durablePreconditionsMet
          ? evaluateRule(step.answerRule, response)
          : { correct: false, mismatchPath: ['factIds'] };
        if (!evaluated.correct) {
          const nextLevel = Math.min(3, state.supportLevel + 1);
          state = {
            ...state,
            supportLevel: nextLevel,
            heartsRemaining: Math.max(0, 3 - nextLevel),
            assistanceMode: nextLevel >= 3
          };
          const partnerDemo = nextLevel >= 3;
          return publish([{
            type: partnerDemo ? 'feedback/partner-demo' : 'feedback/support',
            microtaskId: state.microtaskId,
            stepId: state.stepId,
            level: nextLevel,
            supportKind: ['reobserve', 'partial-cue', 'model'][nextLevel - 1],
            message: step.support?.[nextLevel - 1] || null,
            revealsAnswer: false
          }]);
        }
        const outcome = pendingTask.audioUnavailableSteps.includes(step.stepId)
          ? 'audio-unavailable'
          : (state.assistanceMode
              ? 'assisted'
              : (state.supportLevel > 0 ? 'supported' : 'independent'));
        recordStepResults(step, outcome);
        if (step.storesFactId && typeof response.entityId === 'string') {
          pendingTask.factValues[step.storesFactId] = response.entityId;
        }
        const effects = [{
          type: 'feedback/correct',
          microtaskId: state.microtaskId,
          stepId: step.stepId,
          outcome
        }];
        const isBatch = ['match-entity', 'match-entity-batch'].includes(step.kind);
        const feedbackAudio = feedbackAudioForStep(step, response);
        if (queueFeedbackAudio(feedbackAudio, isBatch ? 'advance-batch' : 'advance-step')) {
          return publish(effects);
        }
        const advanceEffects = isBatch ? advanceBatchOrStep() : advanceAfterStep();
        if (advanceEffects.some(effect => effect.type === 'runtime/persistence-failed')) {
          return publish(advanceEffects);
        }
        effects.push(...advanceEffects);
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

    return Object.freeze({ enter, preview, dispatch, snapshot, destroy });
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
    if (unit.runtimeProfile === 'microtask-v2') {
      return createMicrotaskV2({ unit, ledger, effectSink, seed: Number(seed) });
    }

    let audioSequence = 0;
    let randomState = (Number(seed) >>> 0) || 1;

    let state = {
      status: 'idle',
      mode: null,
      unitId: unit.unitId,
      entryLesson: null,
      beatId: null,
      microstepId: null,
      microtaskId: null,
      phase: null,
      baseContextId: null,
      activeContextId: null,
      contextId: null,
      buildStage: 0,
      supportLevel: 0,
      assistanceMode: false,
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
      const resultId = event.outcome || event.completionStatus || 'complete';
      return `runtime:${unit.unitId}:${Number(seed)}:${beatId}:${microstepId}:${event.type}:${subjectId}:${resultId}`;
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

    function currentMicrotask() {
      return unit.beats
        .flatMap(beat => beat.microtasks || [])
        .find(task => task.microtaskId === state.microtaskId) || null;
    }

    function audioSequenceFor(microtask) {
      if (!microtask?.audioSequenceId) return null;
      return unit.lessonContent?.[microtask.lessonId]
        ?.audioSequences?.[microtask.audioSequenceId] || null;
    }

    function authoredAudioEffects(sequence, requestId, segmentIndex) {
      const effects = [];
      const nextLine = sequence.lines[segmentIndex + 1];
      if (nextLine) {
        effects.push({
          type: 'audio/preload',
          requestId,
          activeAudioSequenceId: sequence.audioSequenceId,
          segmentIndex: segmentIndex + 1,
          line: clone(nextLine)
        });
      }
      effects.push({
        type: 'audio/play',
        requestId,
        activeAudioSequenceId: sequence.audioSequenceId,
        segmentIndex,
        line: clone(sequence.lines[segmentIndex])
      });
      return effects;
    }

    function moveToMicrotask(microtask) {
      const beat = unit.beats.find(candidate => candidate.microtasks?.includes(microtask));
      if (!beat) return false;
      const baseContextId = microtask.contextVariants?.[state.baseContextId]
        ? state.baseContextId
        : (Object.keys(microtask.contextVariants || {})[0] || state.baseContextId);
      state.beatId = beat.beatId;
      state.microtaskId = microtask.microtaskId;
      state.phase = microtask.audioSequenceId ? 'stimulus' : 'response';
      state.microstepId = microtask.audioSequenceId
        ? `${beat.beatId}-audio`
        : `${beat.beatId}-check`;
      state.baseContextId = baseContextId;
      state.activeContextId = baseContextId;
      state.contextId = baseContextId;
      state.supportLevel = 0;
      state.assistanceMode = false;
      state.audio = null;
      return true;
    }

    function nextMicrotaskAfter(microtask) {
      const sequence = unit.beats.flatMap(beat => beat.microtasks || []);
      const index = sequence.findIndex(candidate => candidate.microtaskId === microtask.microtaskId);
      return index >= 0 ? sequence[index + 1] || null : null;
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
          microtaskId: null,
          phase: null,
          baseContextId: unit.targets?.[0]?.contextIds?.[0] || null,
          activeContextId: unit.targets?.[0]?.contextIds?.[0] || null,
          contextId: unit.targets?.[0]?.contextIds?.[0] || null,
          buildStage: 5,
          supportLevel: 0,
          assistanceMode: false,
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
          microtaskId: null,
          phase: 'transition',
          baseContextId: unit.targets?.[0]?.contextIds?.[0] || null,
          activeContextId: unit.targets?.[0]?.contextIds?.[0] || null,
          contextId: unit.targets?.[0]?.contextIds?.[0] || null,
          buildStage,
          supportLevel: 0,
          assistanceMode: false,
          audio: null
        };
        return publish([{ type: 'navigation/handoff', entryLesson: unit.lessonIds[1] }]);
      }
      const needsBridge = entryLesson === unit.lessonIds[1] && buildStage < 2;
      const beatIndex = Math.min(buildStage, 4);
      let beat = unit.beats[beatIndex];
      let microtask = beat.microtasks?.[0] || null;
      if (!needsBridge && projection.checkpoint?.microtaskId) {
        const authoredSequence = unit.beats.flatMap(candidateBeat => (
          (candidateBeat.microtasks || []).map(candidateTask => ({
            beat: candidateBeat,
            microtask: candidateTask
          }))
        ));
        const completedIndex = authoredSequence.findIndex(candidate => (
          candidate.microtask.microtaskId === projection.checkpoint.microtaskId
        ));
        const resumed = authoredSequence[completedIndex + 1];
        if (completedIndex >= 0 && resumed?.microtask?.lessonId === entryLesson) {
          beat = resumed.beat;
          microtask = resumed.microtask;
        }
      }
      const baseContextId = unit.targets?.[0]?.contextIds?.[0] || null;
      const initialMicrostepId = !needsBridge && microtask?.audioSequenceId
        ? `${beat.beatId}-audio`
        : (needsBridge ? `bridge-${beat.beatId}-check` : `${beat.beatId}-check`);
      state = {
        ...state,
        status: 'active',
        mode: needsBridge ? 'bridge' : 'standard',
        entryLesson,
        beatId: beat.beatId,
        microstepId: initialMicrostepId,
        microtaskId: microtask?.microtaskId || null,
        phase: microtask?.audioSequenceId ? 'stimulus' : 'response',
        baseContextId,
        activeContextId: baseContextId,
        contextId: baseContextId,
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
      if (action.type === 'response/submit') {
        const microtask = currentMicrotask();
        if (!microtask || state.phase !== 'response') {
          return publish([{ type: 'runtime/invalid-action', actionType: action.type }]);
        }
        const responseKey = microtask.responseKeyByContext?.[state.activeContextId];
        const evaluation = evaluateResponse(responseKey, action.response);
        if (!evaluation.correct) {
          if (
            !state.assistanceMode
            && state.supportLevel >= 3
            && state.activeContextId !== state.baseContextId
          ) {
            const effects = [];
            if (microtask.formativeBinding) {
              const failed = applyEvent({
                type: 'formative-attempt',
                beatId: state.beatId,
                targetId: microtask.formativeBinding.targetId,
                outcome: 'failed',
                contextId: state.activeContextId,
                evidenceMode: microtask.formativeBinding.evidenceMode,
                source: state.mode === 'bridge' ? 'compressed-bridge' : 'new-learning'
              });
              effects.push(...failed.effects);
              if (!failed.ok) return publish(effects);
            }
            state.assistanceMode = true;
            effects.push({
              type: 'feedback/assisted',
              microtaskId: microtask.microtaskId,
              mismatchPath: evaluation.mismatchPath,
              requiresChildAction: true
            });
            return publish(effects);
          }
          if (state.assistanceMode) {
            return publish([{
              type: 'feedback/assisted',
              microtaskId: microtask.microtaskId,
              mismatchPath: evaluation.mismatchPath,
              requiresChildAction: true
            }]);
          }
          const nextLevel = Math.min(state.supportLevel + 1, 3);
          state.supportLevel = nextLevel;
          const effects = [{
            type: 'feedback/support',
            microtaskId: microtask.microtaskId,
            level: nextLevel,
            supportKind: microtask.support?.ladder?.[nextLevel - 1] || 'reobserve',
            mismatchPath: evaluation.mismatchPath,
            revealsAnswer: false
          }];
          if (nextLevel === 3 && state.activeContextId === state.baseContextId) {
            const fromContextId = state.activeContextId;
            const nearTransferContextId = microtask.support?.nearTransferContextId;
            if (
              nearTransferContextId
              && nearTransferContextId !== fromContextId
              && microtask.contextVariants?.[nearTransferContextId]
            ) {
              state.activeContextId = nearTransferContextId;
              state.contextId = nearTransferContextId;
              effects.push({
                type: 'scene/near-transfer',
                microtaskId: microtask.microtaskId,
                fromContextId,
                contextId: nearTransferContextId
              });
            }
          }
          return publish(effects);
        }

        const completionStatus = state.assistanceMode
          ? 'completed-assisted'
          : (state.supportLevel > 0 ? 'completed-supported' : 'completed-independent');
        const checkpoint = microtask.checkpointAfterSuccess || {};
        const effects = [];
        if (microtask.formativeBinding && !state.assistanceMode) {
          const formative = applyEvent({
            type: 'formative-attempt',
            beatId: state.beatId,
            targetId: microtask.formativeBinding.targetId,
            outcome: state.supportLevel > 0 ? 'supported' : 'independent',
            contextId: state.activeContextId,
            evidenceMode: microtask.formativeBinding.evidenceMode,
            source: state.mode === 'bridge' ? 'compressed-bridge' : 'new-learning'
          });
          effects.push(...formative.effects);
          if (!formative.ok) return publish(effects);
        }
        const applied = applyEvent({
          type: 'checkpoint-completed',
          beatId: state.beatId,
          microtaskId: microtask.microtaskId,
          checkpointId: checkpoint.checkpointId || `${microtask.microtaskId}:complete`,
          ...(checkpoint.buildStage === undefined ? {} : { buildStage: checkpoint.buildStage }),
          completionStatus,
          source: state.mode === 'bridge' ? 'compressed-bridge' : 'new-learning'
        });
        effects.push(...applied.effects);
        if (!applied.ok) return publish(effects);

        effects.push({
          type: 'feedback/completed',
          microtaskId: microtask.microtaskId,
          completionStatus
        });
        if (Number.isInteger(checkpoint.buildStage) && checkpoint.buildStage > state.buildStage) {
          state.buildStage = checkpoint.buildStage;
          effects.push({ type: 'landmark/build-stage', buildStage: state.buildStage });
        }

        const nextMicrotask = nextMicrotaskAfter(microtask);
        if (nextMicrotask?.lessonId === state.entryLesson) {
          moveToMicrotask(nextMicrotask);
          effects.push({
            type: 'scene/show',
            beatId: state.beatId,
            microtaskId: state.microtaskId,
            microstepId: state.microstepId,
            contextId: state.activeContextId
          });
          return publish(effects);
        }

        if (state.entryLesson === unit.lessonIds[0] && state.buildStage >= 2) {
          state = {
            ...state,
            status: 'handoff',
            beatId: null,
            microstepId: null,
            microtaskId: null,
            phase: 'transition',
            supportLevel: 0,
            assistanceMode: false,
            audio: null
          };
          effects.push({ type: 'navigation/handoff', entryLesson: unit.lessonIds[1] });
          return publish(effects);
        }
        return publish(effects);
      }
      if (action.type === 'audio/play') {
        const microtask = currentMicrotask();
        const sequence = audioSequenceFor(microtask);
        if (sequence && state.phase === 'stimulus' && action.audioId === undefined) {
          const effects = [];
          if (state.audio?.status === 'playing') {
            effects.push({ type: 'audio/cancel', requestId: state.audio.requestId });
          }
          audioSequence += 1;
          const requestId = `audio:${unit.unitId}:${Number(seed)}:${audioSequence}`;
          state.audio = {
            requestId,
            activeAudioSequenceId: sequence.audioSequenceId,
            segmentIndex: 0,
            status: 'playing'
          };
          effects.push(...authoredAudioEffects(sequence, requestId, 0));
          return publish(effects);
        }
      }
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
      if (action.type === 'audio/ended') {
        if (
          state.audio?.status !== 'playing'
          || action.requestId !== state.audio.requestId
          || action.segmentIndex !== state.audio.segmentIndex
          || !state.audio.activeAudioSequenceId
        ) {
          return publish([]);
        }
        const microtask = currentMicrotask();
        const sequence = audioSequenceFor(microtask);
        if (!sequence || sequence.audioSequenceId !== state.audio.activeAudioSequenceId) {
          return publish([]);
        }
        const nextSegmentIndex = state.audio.segmentIndex + 1;
        if (nextSegmentIndex < sequence.lines.length) {
          state.audio = { ...state.audio, segmentIndex: nextSegmentIndex };
          return publish(authoredAudioEffects(sequence, state.audio.requestId, nextSegmentIndex));
        }
        state.audio = { ...state.audio, status: 'completed' };
        state.phase = 'response';
        state.microstepId = `${state.beatId}-check`;
        return publish([{
          type: 'scene/show',
          beatId: state.beatId,
          microtaskId: state.microtaskId,
          microstepId: state.microstepId,
          contextId: state.activeContextId
        }]);
      }
      if (action.type === 'audio/completed') {
        if (state.audio?.status !== 'playing' || action.requestId !== state.audio.requestId) {
          return publish([]);
        }
        state.audio = { ...state.audio, status: 'completed' };
        state.phase = 'response';
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
        state.phase = 'response';
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

  return Object.freeze({ create, evaluateRule });
});
