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
      if (typeof rule.acceptedEntityId === 'string' || Array.isArray(rule.acceptedEntityIds)) {
        const acceptedEntityIds = Array.isArray(rule.acceptedEntityIds)
          ? rule.acceptedEntityIds
          : [rule.acceptedEntityId];
        const correct = acceptedEntityIds.includes(response.entityId);
        return { correct, mismatchPath: correct ? null : [...path, 'entityId'] };
      }
      if (checks.length !== 1) return { correct: false, mismatchPath: path };
      const [field, expected] = checks[0];
      const correct = response[field] === expected;
      return { correct, mismatchPath: correct ? null : [...path, field] };
    }
    if (rule.type === 'match-entity') {
      if (
        typeof rule.acceptedSourceRef === 'string'
        && typeof rule.acceptedEntityId === 'string'
      ) {
        const sourceMatches = response.sourceRef === rule.acceptedSourceRef;
        const entityMatches = response.entityId === rule.acceptedEntityId;
        return {
          correct: sourceMatches && entityMatches,
          mismatchPath: sourceMatches && entityMatches
            ? null
            : [...path, sourceMatches ? 'entityId' : 'sourceRef']
        };
      }
      const expected = rule.pairs?.[response.sourceRef];
      const correct = typeof expected === 'string' && response.entityId === expected;
      return { correct, mismatchPath: correct ? null : [...path, 'entityId'] };
    }
    if (rule.type === 'place-in-slot') {
      const correct = response.slotId === rule.slotId && response.entityId === rule.entityId;
      return { correct, mismatchPath: correct ? null : [...path, 'slotId'] };
    }
    if (rule.type === 'ordered-blocks') {
      const expected = Array.isArray(rule.acceptedOrder)
        ? rule.acceptedOrder
        : rule.acceptedByEntityId?.[response.selectedEntityId];
      const actual = response.blockRefs;
      const correct = Array.isArray(expected)
        && Array.isArray(actual)
        && expected.length === actual.length
        && expected.every((blockRef, index) => blockRef === actual[index]);
      return { correct, mismatchPath: correct ? null : [...path, 'blockRefs'] };
    }
    if (rule.type === 'ordered-sequence') {
      const expected = rule.acceptedOrder;
      const actual = response.sequenceIds;
      const correct = Array.isArray(expected)
        && Array.isArray(actual)
        && expected.length === actual.length
        && expected.every((panelId, index) => panelId === actual[index]);
      return { correct, mismatchPath: correct ? null : [...path, 'sequenceIds'] };
    }
    if (rule.type === 'connect-reference') {
      const correct = response.sourceRef === rule.sourceRef && response.entityId === rule.entityId;
      return { correct, mismatchPath: correct ? null : [...path, 'entityId'] };
    }
    if (rule.type === 'detect-error') {
      const checks = [
        ['sourceRef', rule.acceptedSourceRef],
        ['contentRef', rule.acceptedContentRef]
      ].filter(([, expected]) => typeof expected === 'string');
      if (checks.length !== 1) return { correct: false, mismatchPath: path };
      const [field, expected] = checks[0];
      const correct = response[field] === expected;
      return { correct, mismatchPath: correct ? null : [...path, field] };
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
      if (Array.isArray(rule.rules)) {
        for (const [index, nestedRule] of rule.rules.entries()) {
          const evaluated = evaluateRule(nestedRule, response, [...path, 'rules', index]);
          if (!evaluated.correct) return evaluated;
        }
        return { correct: true, mismatchPath: null };
      }
      const expected = [...new Set(rule.requiredFactIds || [])].sort();
      const actual = [...new Set(response.factIds || [])].sort();
      const correct = expected.length === actual.length
        && expected.every((factId, index) => factId === actual[index]);
      return { correct, mismatchPath: correct ? null : [...path, 'factIds'] };
    }
    return { correct: false, mismatchPath: path };
  }

  function fnv1a32(value) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    let state = seed >>> 0;
    return function nextRandom() {
      let value = state += 0x6d2b79f5;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffledIds(ids, seed) {
    const shuffled = [...ids];
    const random = mulberry32(seed);
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function shuffledIdsWithConstraint(ids, seed, constraint, acceptedOrder) {
    const shuffled = shuffledIds(ids, seed);
    if (constraint !== 'not-accepted-order' || shuffled.length < 2) return shuffled;
    const accepted = Array.isArray(acceptedOrder) ? acceptedOrder : [];
    const matches = shuffled.length === accepted.length
      && accepted.every((value, index) => shuffled[index] === value);
    if (!matches) return shuffled;
    return [...shuffled.slice(1), shuffled[0]];
  }

  let audioRequestNamespaceSequence = 0;

  function createLesson12V2({ unit, ledger, effectSink, seed, outbox }) {
    const authoredTasks = unit.beats.flatMap(beat => (
      (beat.microtasks || []).map(task => ({ beatId: beat.beatId, task }))
    ));
    const shuffleAlgorithmVersion = 'fnv1a32-v1+mulberry32-v1+fisher-yates-v1';
    let activeTaskIndex = -1;
    let audioRequestSequence = 0;
    const audioRequestNamespace = ++audioRequestNamespaceSequence;
    let sandboxActive = false;
    let sandboxOrigin = null;
    let skipRecoveryActive = false;
    let skipRecoveryOrigin = null;
    let endedPresentationMomentIds = new Set();
    let pendingPresentationContinuation = null;
    let durableRolePracticeProgress = {};
    let volatileOutbox = { revision: 0, value: null };
    const pendingCommitKey = `learning-runtime:${unit.unitId}:${unit.experienceRevision}:pending-commit`;
    let state = {
      stateVersion: 0,
      status: 'idle',
      mode: 'microtask-v2',
      unitId: unit.unitId,
      experienceRevision: unit.experienceRevision,
      unitAttemptId: null,
      entryLesson: null,
      beatId: null,
      microtaskId: null,
      microtaskStatus: null,
      stepId: null,
      stepIndex: null,
      phase: null,
      currentPresentationMomentId: null,
      presentationAwaitingEnd: false,
      attemptRevision: 0,
      challengeRef: null,
      challengeSourceRef: null,
      challengeIndex: 0,
      completedStepIds: [],
      adventureHearts: 3,
      adventureHeartsRemaining: 3,
      supportLevel: 'none',
      supportDepth: 0,
      rescueUsed: false,
      shuffleAlgorithmVersion,
      shuffleSeed: null,
      optionIds: [],
      temporaryResults: [],
      temporaryAudioContactRefs: [],
      temporaryMissingAudioRefs: [],
      pendingCommit: null,
      pendingUiContinuation: null,
      rolePracticeProgress: null,
      rolePracticeSkipStatus: null,
      committedFacts: [],
      completedMicrotaskIds: [],
      skippedMicrotaskIds: [],
      reachedMicrotaskIds: [],
      stageNavigation: [],
      nextRestStop: null,
      buildStage: 0,
      diagnosticArchive: null,
      audio: null
    };

    function snapshot() {
      return clone(state);
    }

    function publish(effects = []) {
      for (const effect of effects) effectSink(clone(effect));
      return { snapshot: snapshot(), effects: clone(effects) };
    }

    function currentTask() {
      return authoredTasks[activeTaskIndex]?.task || null;
    }

    function currentStep() {
      return currentTask()?.steps?.[state.stepIndex] || null;
    }

    function currentChallenge() {
      const step = currentStep();
      if (!step) return null;
      return Array.isArray(step.challenges)
        ? step.challenges[state.challengeIndex] || null
        : step;
    }

    function candidateIds(challenge) {
      return clone(
        challenge?.candidateEntityIds
        || challenge?.candidateSourceRefs
        || challenge?.candidateContentRefs
        || challenge?.optionEntityIds
        || challenge?.optionSourceRefs
        || challenge?.optionContentRefs
        || []
      );
    }

    function semanticRef(challenge) {
      return challenge?.sourceRef || challenge?.contentRef || null;
    }

    function presentationConditionIsMet(condition, candidateState) {
      if (!condition || typeof condition !== 'object') return false;
      if (condition.kind === 'microtask-start') return true;
      if (condition.kind === 'step-active') return candidateState.stepId === condition.stepId;
      if (condition.kind === 'step-completed') {
        return candidateState.completedStepIds.includes(condition.stepId);
      }
      if (condition.kind === 'challenge-active') {
        return candidateState.challengeRef === condition.challengeRef;
      }
      if (condition.kind === 'phase') return candidateState.phase === condition.phase;
      if (condition.kind === 'challenge-completed') {
        return candidateState.temporaryResults.some(result => (
          result.challengeRef === condition.challengeRef
        ));
      }
      if (condition.kind === 'microtask-complete') {
        return ['completed', 'practice-complete'].includes(candidateState.microtaskStatus);
      }
      return false;
    }

    function resolvePresentationMoment(candidateState, reset = false) {
      const moments = currentTask()?.presentation?.moments || [];
      if (moments.length === 0) return null;
      const currentIndex = reset
        ? -1
        : moments.findIndex(moment => moment.momentId === candidateState.currentPresentationMomentId);
      if (currentIndex >= 0 && !endedPresentationMomentIds.has(moments[currentIndex].momentId)) {
        return moments[currentIndex].momentId;
      }
      for (let index = currentIndex + 1; index < moments.length; index += 1) {
        if (presentationConditionIsMet(moments[index].enterWhen, candidateState)) {
          return moments[index].momentId;
        }
      }
      return currentIndex >= 0 ? moments[currentIndex].momentId : null;
    }

    function transition(patch) {
      const resetPresentation = Object.prototype.hasOwnProperty.call(
        patch,
        'currentPresentationMomentId'
      ) && patch.currentPresentationMomentId === null;
      const nextState = { ...state, ...patch, stateVersion: state.stateVersion + 1 };
      nextState.currentPresentationMomentId = resolvePresentationMoment(
        nextState,
        resetPresentation
      );
      nextState.presentationAwaitingEnd = Boolean(nextState.currentPresentationMomentId)
        && !endedPresentationMomentIds.has(nextState.currentPresentationMomentId);
      state = nextState;
    }

    function restorePresentationMoment() {
      const moments = currentTask()?.presentation?.moments || [];
      let restoredIndex = -1;
      for (let index = 0; index < moments.length; index += 1) {
        if (presentationConditionIsMet(moments[index].enterWhen, state)) restoredIndex = index;
      }
      endedPresentationMomentIds = new Set(
        moments.slice(0, Math.max(0, restoredIndex)).map(moment => moment.momentId)
      );
      const restoredMomentId = restoredIndex >= 0 ? moments[restoredIndex].momentId : null;
      state = {
        ...state,
        currentPresentationMomentId: restoredMomentId,
        presentationAwaitingEnd: Boolean(restoredMomentId)
      };
    }

    function refreshNavigation(currentMicrotaskId = state.microtaskId) {
      const reached = new Set([
        ...state.completedMicrotaskIds,
        ...state.skippedMicrotaskIds,
        ...(currentMicrotaskId ? [currentMicrotaskId] : [])
      ]);
      state = {
        ...state,
        reachedMicrotaskIds: authoredTasks
          .map(({ task }) => task.microtaskId)
          .filter(microtaskId => reached.has(microtaskId)),
        stageNavigation: authoredTasks.map(({ task }) => ({
          microtaskId: task.microtaskId,
          title: task.navigationTitle || task.presentation?.title || task.microtaskId,
          status: state.completedMicrotaskIds.includes(task.microtaskId)
            ? 'completed'
            : (state.skippedMicrotaskIds.includes(task.microtaskId)
                ? 'skipped'
                : (task.microtaskId === currentMicrotaskId ? 'current' : 'locked'))
        }))
      };
    }

    function challengePhase(step, challenge) {
      if (step?.kind === 'role-enactment') return 'role-practice-ready';
      if (challenge?.audioSequence || (!challenge?.challengeRef && step?.audioSequence)) {
        return 'audio-ready';
      }
      return challenge?.answerRule || step?.answerRule ? 'awaiting-response' : 'presenting';
    }

    function activateChallenge(challengeIndex) {
      const task = currentTask();
      const step = currentStep();
      const challenge = Array.isArray(step?.challenges)
        ? step.challenges[challengeIndex]
        : step;
      if (!task || !step || !challenge) return false;
      const attemptRevision = Number.isInteger(state.attemptRevision) ? state.attemptRevision : 0;
      const challengeRef = challenge.challengeRef || null;
      const channel = challenge.channel || step.channel || 'story';
      const seedDomain = JSON.stringify([
        unit.experienceRevision,
        state.unitAttemptId,
        task.microtaskId,
        attemptRevision,
        channel,
        challengeRef
      ]);
      const shuffleSeed = challengeRef ? fnv1a32(seedDomain) : null;
      transition({
        phase: challengePhase(step, challenge),
        challengeRef,
        challengeSourceRef: semanticRef(challenge),
        challengeIndex,
        shuffleSeed,
        optionIds: shuffleSeed === null
          ? candidateIds(challenge)
          : shuffledIdsWithConstraint(
              candidateIds(challenge),
              shuffleSeed,
              challenge.shuffleConstraint || step.shuffleConstraint,
              challenge.answerRule?.acceptedOrder || step.answerRule?.acceptedOrder
            ),
        supportLevel: 'none',
        supportDepth: 0,
        audio: null
      });
      return true;
    }

    function activateStep(stepIndex) {
      const task = currentTask();
      const step = task?.steps?.[stepIndex];
      if (!step) return false;
      state = {
        ...state,
        stepId: step.stepId,
        stepIndex,
        challengeIndex: 0,
        rolePracticeProgress: step.kind === 'role-enactment'
          ? {
              practiceId: step.practice.practiceId,
              completedRoundIds: sandboxActive
                ? []
                : clone(
                    durableRolePracticeProgress[step.practice.practiceId]?.completedRoundIds || []
                  ),
              skippedRoundIds: sandboxActive
                ? []
                : clone(
                    durableRolePracticeProgress[step.practice.practiceId]?.skippedRoundIds || []
                  )
            }
          : null
      };
      return activateChallenge(0);
    }

    function findSource(sourceRef) {
      for (const lesson of Object.values(unit.lessonContent || {})) {
        if (lesson.sources?.[sourceRef]) return lesson.sources[sourceRef];
      }
      return null;
    }

    function findContent(contentRef) {
      return unit.authoredContent?.[contentRef] || null;
    }

    function normalizeAudioSegments(sequence, challenge, purpose) {
      const raw = Array.isArray(sequence)
        ? sequence
        : (Array.isArray(sequence?.segments) ? sequence.segments : []);
      const segments = raw.map((audioPart, index) => {
        const item = audioPart.sourceRef
          ? findSource(audioPart.sourceRef)
          : (audioPart.contentRef ? findContent(audioPart.contentRef) : null);
        return {
          segmentId: audioPart.segmentId
            || `${challenge.challengeRef || state.stepId}:${purpose}:${String(index + 1).padStart(2, '0')}`,
          sourceRef: audioPart.sourceRef || null,
          contentRef: audioPart.contentRef || null,
          src: audioPart.src || audioPart.audioSrc || item?.audioSrc || null,
          text: audioPart.text || item?.text || '',
          speaker: audioPart.speaker || item?.speaker || null
        };
      });
      if (segments.length > 0) return segments;
      const sourceRef = challenge.sourceRef || null;
      const contentRef = challenge.contentRef || null;
      const item = sourceRef ? findSource(sourceRef) : findContent(contentRef);
      return item?.audioSrc ? [{
        segmentId: `${challenge.challengeRef || state.stepId}:${purpose}:01`,
        sourceRef,
        contentRef,
        src: item.audioSrc,
        text: item.text || '',
        speaker: item.speaker || null
      }] : [];
    }

    function audioEffect(audio, delayMs = 0) {
      const audioPart = audio.segments[audio.segmentIndex];
      return {
        type: 'audio/play',
        experienceRevision: unit.experienceRevision,
        microtaskId: state.microtaskId,
        attemptRevision: state.attemptRevision,
        requestId: audio.requestId,
        segmentId: audioPart.segmentId,
        src: audioPart.src,
        visibleText: audioPart.text,
        speaker: audioPart.speaker,
        sourceRef: audioPart.sourceRef,
        contentRef: audioPart.contentRef,
        purpose: audio.purpose,
        retryAttempt: audio.retryAttempt,
        delayMs
      };
    }

    function audioCancelEffect(audio) {
      return {
        type: 'audio/cancel',
        experienceRevision: unit.experienceRevision,
        microtaskId: state.microtaskId,
        attemptRevision: state.attemptRevision,
        requestId: audio.requestId
      };
    }

    function startAudio({
      sequence,
      challenge,
      purpose,
      after,
      retryAttempt = 0,
      delayMs = 0,
      startSegmentIndex = 0
    }) {
      const segments = normalizeAudioSegments(sequence, challenge, purpose);
      if (segments.length === 0) return null;
      const segmentIndex = Math.max(0, Math.min(startSegmentIndex, segments.length - 1));
      const requestId = `audio:${unit.experienceRevision}:${state.unitAttemptId}:${state.microtaskId}:${state.attemptRevision}:${Date.now()}:${audioRequestNamespace}:${++audioRequestSequence}`;
      const audio = {
        status: 'playing', requestId, segments, segmentIndex,
        segmentId: segments[segmentIndex].segmentId, purpose, after, retryAttempt,
        manualRetryRequired: false
      };
      audio.refs = segments.map(audioPart => ({
        refId: audioPart.sourceRef || audioPart.contentRef || audioPart.segmentId,
        text: audioPart.text,
        speaker: audioPart.speaker,
        sourceRef: audioPart.sourceRef,
        contentRef: audioPart.contentRef
      }));
      audio.currentSegment = clone(segments[segmentIndex]);
      audio.visibleText = segments[segmentIndex].text;
      audio.unresolvedRefs = audio.refs.slice(segmentIndex).map(ref => ref.refId);
      transition({ phase: delayMs > 0 ? 'audio-retry' : 'audio-playing', audio });
      return audioEffect(audio, delayMs);
    }

    function startReadyAudio() {
      if (state.phase !== 'audio-ready') return null;
      const challenge = currentChallenge();
      const step = currentStep();
      return startAudio({
        sequence: challenge?.audioSequence || step?.audioSequence,
        challenge,
        purpose: 'instruction',
        after: challenge?.answerRule || step?.answerRule ? 'open-response' : 'advance-challenge'
      });
    }

    function resultForChallenge(challenge) {
      return (currentTask()?.targetResults || []).find(result => (
        result.challengeRef === challenge.challengeRef
        || (challenge.resultId && result.resultId === challenge.resultId)
      )) || null;
    }

    function loadPendingCommit() {
      if (outbox && typeof outbox.load === 'function') return outbox.load(pendingCommitKey);
      return { status: 'ok', revision: volatileOutbox.revision, value: clone(volatileOutbox.value) };
    }

    function restorablePendingCommit(pendingRecord) {
      if (pendingRecord?.status !== 'ok') return null;
      const value = pendingRecord.value;
      if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
      if (
        value.experienceRevision !== unit.experienceRevision
        || value.unitAttemptId !== state.unitAttemptId
        || typeof value.microtaskId !== 'string'
      ) return null;
      const pendingIndex = authoredTasks.findIndex(({ task }) => (
        task.microtaskId === value.microtaskId
      ));
      if (pendingIndex < 0) return null;
      const authored = authoredTasks[pendingIndex];
      const payload = value.payload;
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
      const expectedCheckpointId = authored.task.checkpointAfterSuccess?.checkpointId
        || `${authored.task.microtaskId}:complete`;
      if (
        payload.type !== 'microtask-completed'
        || payload.unitId !== unit.unitId
        || payload.experienceRevision !== unit.experienceRevision
        || payload.unitAttemptId !== state.unitAttemptId
        || payload.microtaskId !== value.microtaskId
        || payload.beatId !== authored.beatId
        || payload.checkpointId !== expectedCheckpointId
        || !Number.isInteger(payload.attemptRevision)
        || payload.attemptRevision < 0
        || typeof payload.eventId !== 'string'
        || !['completed-independent', 'completed-supported', 'completed-partner-rescue']
          .includes(payload.completionStatus)
      ) return null;
      if (
        !Array.isArray(payload.targetResults)
        || !payload.targetResults.every(result => (
          result && typeof result === 'object' && !Array.isArray(result)
          && typeof result.challengeRef === 'string'
        ))
        || !Array.isArray(payload.sourceContacts)
        || !payload.sourceContacts.every(contact => (
          contact && typeof contact === 'object' && !Array.isArray(contact)
          && typeof contact.sourceRef === 'string'
          && Array.isArray(contact.contactModes)
          && contact.contactModes.every(mode => typeof mode === 'string')
        ))
        || !Array.isArray(payload.audioContactRefs)
        || !payload.audioContactRefs.every(ref => typeof ref === 'string')
        || !Array.isArray(payload.missingAudioRefs)
        || !payload.missingAudioRefs.every(ref => typeof ref === 'string')
        || !Array.isArray(payload.storyFacts)
        || !payload.storyFacts.every(factId => typeof factId === 'string')
      ) return null;
      return { pendingIndex, payload, outboxRevision: pendingRecord.revision };
    }

    function commitPendingValue(expectedRevision, value) {
      if (outbox && typeof outbox.commit === 'function') {
        return outbox.commit(pendingCommitKey, { expectedRevision, value: clone(value) });
      }
      if (volatileOutbox.revision !== expectedRevision) {
        return {
          status: 'conflict', persisted: false,
          revision: volatileOutbox.revision, value: clone(volatileOutbox.value)
        };
      }
      volatileOutbox = { revision: expectedRevision + 1, value: clone(value) };
      return {
        status: 'committed', persisted: true,
        revision: volatileOutbox.revision, value: clone(volatileOutbox.value),
        volatile: true
      };
    }

    function completionPayload() {
      const task = currentTask();
      const sourceRefs = Array.isArray(task.exposureRefs)
        ? [...new Set(task.exposureRefs)]
        : [...new Set((task.sourceContacts || []).map(contact => contact.sourceRef))];
      return {
        eventId: `runtime:${unit.unitId}:${unit.experienceRevision}:${state.unitAttemptId}:${task.microtaskId}:${state.attemptRevision}:microtask-completed`,
        type: 'microtask-completed',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        unitAttemptId: state.unitAttemptId,
        attemptRevision: state.attemptRevision,
        beatId: authoredTasks[activeTaskIndex].beatId,
        microtaskId: task.microtaskId,
        checkpointId: task.checkpointAfterSuccess?.checkpointId || `${task.microtaskId}:complete`,
        completionStatus: state.rescueUsed
          ? 'completed-partner-rescue'
          : (state.temporaryResults.some(result => result.outcome === 'supported')
              ? 'completed-supported'
              : 'completed-independent'),
        targetResults: clone(state.temporaryResults),
        sourceContacts: sourceRefs.map(sourceRef => ({
          sourceRef,
          contactModes: [
            'experienced',
            ...(state.temporaryAudioContactRefs.includes(sourceRef) ? ['audio-ended'] : [])
          ]
        })),
        audioContactRefs: clone(state.temporaryAudioContactRefs),
        missingAudioRefs: clone(state.temporaryMissingAudioRefs),
        storyFacts: clone(task.persistence?.checkpointFacts || []),
        adventureHeartsRemaining: state.adventureHearts,
        source: 'new-learning'
      };
    }

    function clearPendingCommit(outboxRevision) {
      return commitPendingValue(outboxRevision, null);
    }

    function durableContinuation() {
      return clone(ledger.read()?.units?.[unit.unitId]?.pendingUiContinuation || null);
    }

    function acknowledgeDurableContinuation(acknowledgement, identity = {}) {
      const pending = state.pendingUiContinuation;
      if (!pending) return { persisted: true, effects: [] };
      const event = {
        eventId: [
          'runtime', unit.unitId, unit.experienceRevision, pending.unitAttemptId || state.unitAttemptId,
          pending.microtaskId, pending.attemptRevision, acknowledgement
        ].join(':'),
        type: 'ui-continuation-acknowledged',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        unitAttemptId: pending.unitAttemptId,
        attemptRevision: pending.attemptRevision,
        microtaskId: pending.microtaskId,
        acknowledgement,
        ...identity
      };
      const applied = ledger.apply(event);
      if (applied?.persisted !== true) {
        return {
          persisted: false,
          effects: [{
            type: 'runtime/persistence-failed',
            operation: 'ui-continuation-acknowledged',
            reason: applied?.reason || applied?.status || 'unavailable',
            retryable: true
          }]
        };
      }
      transition({ pendingUiContinuation: durableContinuation() });
      return {
        persisted: true,
        effects: [{
          type: 'runtime/ui-continuation-acknowledged',
          experienceRevision: unit.experienceRevision,
          microtaskId: pending.microtaskId,
          acknowledgement
        }]
      };
    }

    function verifyUnitAndBuild() {
      transition({ status: 'active', phase: 'unit-verifying' });
      const firstReadback = ledger.read();
      const firstUnit = firstReadback?.units?.[unit.unitId] || {};
      if (
        firstUnit.experienceRevision !== unit.experienceRevision
        || firstUnit.completionReadback?.readyForBuild !== true
      ) {
        return [{
          type: 'runtime/unit-readback-incomplete',
          experienceRevision: unit.experienceRevision,
          unitId: unit.unitId,
          retryable: true
        }];
      }
      const effects = [{
        type: 'runtime/unit-readback-complete',
        experienceRevision: unit.experienceRevision,
        unitId: unit.unitId
      }];
      const builtEvent = {
        eventId: `runtime:${unit.unitId}:${unit.experienceRevision}:unit-built`,
        type: 'unit-built',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision
      };
      const built = ledger.apply(builtEvent);
      if (built?.persisted !== true) {
        return [...effects, {
          type: 'runtime/persistence-failed',
          operation: 'unit-built',
          reason: built?.reason || built?.status || 'unavailable',
          retryable: true
        }];
      }
      effects.push({
        type: 'runtime/unit-built-committed',
        experienceRevision: unit.experienceRevision,
        unitId: unit.unitId
      });
      const finalReadback = ledger.read();
      const finalUnit = finalReadback?.units?.[unit.unitId] || {};
      if (
        finalUnit.experienceRevision !== unit.experienceRevision
        || finalUnit.buildStage !== 5
      ) {
        return [...effects, {
          type: 'runtime/build-stage-readback-incomplete',
          experienceRevision: unit.experienceRevision,
          unitId: unit.unitId,
          retryable: true
        }];
      }
      transition({
        status: 'unit-built',
        phase: 'completed',
        microtaskStatus: 'completed',
        stepId: null,
        stepIndex: null,
        challengeRef: null,
        challengeSourceRef: null,
        buildStage: 5,
        nextRestStop: clone(currentTask()?.restStop || null),
        audio: null
      });
      refreshNavigation(null);
      return [...effects, {
        type: 'landmark/build-stage',
        experienceRevision: unit.experienceRevision,
        unitId: unit.unitId,
        buildStage: 5
      }, {
        type: 'runtime/unit-built',
        experienceRevision: unit.experienceRevision,
        unitId: unit.unitId
      }];
    }

    function presentationGateIsOpen() {
      return !state.currentPresentationMomentId
        || endedPresentationMomentIds.has(state.currentPresentationMomentId);
    }

    function runPendingPresentationContinuation() {
      if (!pendingPresentationContinuation || !presentationGateIsOpen()) return [];
      const continuation = pendingPresentationContinuation;
      pendingPresentationContinuation = null;
      if (continuation.kind === 'activate-first-step') {
        activateStep(0);
        const audio = startReadyAudio();
        return audio ? [audio] : [];
      }
      if (continuation.kind === 'advance-challenge-or-step') {
        return advanceChallengeOrStep({ presentationGateEnded: true });
      }
      if (continuation.kind === 'next-task') {
        const next = enterTask(continuation.taskIndex);
        if (!next) return [];
        const effects = [{
          type: 'scene/show', experienceRevision: unit.experienceRevision,
          beatId: next.beatId, microtaskId: next.task.microtaskId,
          stepId: next.task.steps[0].stepId
        }];
        const audio = startReadyAudio();
        if (audio) effects.push(audio);
        return effects;
      }
      if (continuation.kind === 'rest-stop') {
        const task = currentTask();
        const nextMicrotaskId = task.restStop.nextMicrotaskId || null;
        transition({
          status: 'rest-stop',
          phase: 'completed',
          stepId: null,
          stepIndex: null,
          challengeRef: null,
          challengeSourceRef: null,
          nextRestStop: clone(task.restStop),
          reachedMicrotaskIds: [...new Set([
            ...state.completedMicrotaskIds,
            ...(nextMicrotaskId ? [nextMicrotaskId] : [])
          ])],
          audio: null
        });
        refreshNavigation(nextMicrotaskId);
        return [{
          type: 'runtime/rest-stop',
          experienceRevision: unit.experienceRevision,
          microtaskId: task.microtaskId,
          restStopId: task.restStop.restStopId,
          restStopType: task.restStop.type,
          nextMicrotaskId
        }];
      }
      if (continuation.kind === 'enter-unit-verifying') {
        transition({
          status: 'active',
          phase: 'unit-verifying',
          nextRestStop: clone(currentTask()?.restStop || null)
        });
        refreshNavigation(null);
        pendingPresentationContinuation = { kind: 'verify-unit' };
        return runPendingPresentationContinuation();
      }
      if (continuation.kind === 'verify-unit') return verifyUnitAndBuild();
      return [];
    }

    function armPresentationContinuation(continuation) {
      pendingPresentationContinuation = continuation;
      return runPendingPresentationContinuation();
    }

    function activateFirstStepOrWaitForIntro() {
      const firstMoment = currentTask()?.presentation?.moments?.[0];
      if (
        firstMoment?.enterWhen?.kind === 'microtask-start'
        && state.currentPresentationMomentId === firstMoment.momentId
        && state.presentationAwaitingEnd
      ) {
        pendingPresentationContinuation = { kind: 'activate-first-step' };
        return false;
      }
      return activateStep(0);
    }

    function finishPersistedTask(payload, outboxRevision) {
      const cleared = Number.isInteger(outboxRevision)
        ? clearPendingCommit(outboxRevision)
        : { persisted: true };
      if (cleared.persisted !== true) {
        transition({ phase: 'persistence-retry' });
        return [{
          type: 'runtime/persistence-failed', operation: 'pending-commit-clear',
          reason: cleared.reason || cleared.status || 'unavailable', retryable: true
        }];
      }
      const task = currentTask();
      const completedMicrotaskIds = [...new Set([...state.completedMicrotaskIds, task.microtaskId])];
      const skippedMicrotaskIds = state.skippedMicrotaskIds
        .filter(microtaskId => microtaskId !== task.microtaskId);
      const committedFacts = [...new Set([...state.committedFacts, ...(payload.storyFacts || [])])];
      const pendingUiContinuation = durableContinuation();
      transition({
        pendingCommit: null,
        pendingUiContinuation,
        completedMicrotaskIds,
        skippedMicrotaskIds,
        committedFacts,
        temporaryResults: [],
        temporaryAudioContactRefs: [],
        temporaryMissingAudioRefs: [],
        microtaskStatus: 'completed'
      });
      const effects = [{
        type: 'runtime/microtask-completed',
        experienceRevision: unit.experienceRevision,
        microtaskId: task.microtaskId,
        checkpointId: payload.checkpointId,
        completionStatus: payload.completionStatus
      }];
      if (skipRecoveryActive) {
        effects.push(...restoreSkipRecoveryOrigin({ completed: true }));
        return effects;
      }
      if (task.growthBoundary === 'unit-verifying') {
        effects.push(...armPresentationContinuation({ kind: 'enter-unit-verifying' }));
        return effects;
      }
      if (task.restStop && task.growthBoundary !== 'unit-verifying') {
        effects.push(...armPresentationContinuation({ kind: 'rest-stop' }));
        return effects;
      }
      effects.push(...armPresentationContinuation({
        kind: 'next-task',
        taskIndex: activeTaskIndex + 1
      }));
      return effects;
    }

    function persistPendingCommit() {
      const pending = state.pendingCommit;
      if (!pending?.payload) return [{ type: 'runtime/persistence-failed', reason: 'pending-commit-missing' }];
      const applied = ledger.apply(clone(pending.payload));
      if (applied?.persisted !== true) {
        transition({ phase: 'persistence-retry' });
        return [{
          type: 'runtime/persistence-failed',
          operation: pending.payload.type,
          reason: applied?.reason || applied?.status || 'unavailable',
          retryable: true
        }];
      }
      return finishPersistedTask(pending.payload, pending.outboxRevision);
    }

    function beginPendingCommit() {
      transition({ phase: 'answered-awaiting-save', microtaskStatus: 'answered' });
      if (sandboxActive) {
        transition({ status: 'sandbox-complete', phase: 'completed', microtaskStatus: 'practice-complete' });
        return [{
          type: 'runtime/sandbox-completed',
          experienceRevision: unit.experienceRevision,
          microtaskId: state.microtaskId,
          persistence: 'none'
        }];
      }
      const payload = completionPayload();
      const loaded = loadPendingCommit();
      if (loaded.status !== 'ok') {
        transition({
          phase: 'persistence-retry',
          pendingCommit: { status: 'memory-only', payload, outboxRevision: null }
        });
        return [{
          type: 'runtime/pending-commit-unprotected',
          microtaskId: state.microtaskId,
          leavingRepeatsMicrotask: true
        }];
      }
      const storedValue = {
        experienceRevision: unit.experienceRevision,
        unitAttemptId: state.unitAttemptId,
        microtaskId: state.microtaskId,
        payload
      };
      const stored = commitPendingValue(loaded.revision, storedValue);
      if (stored.persisted !== true) {
        transition({
          phase: 'persistence-retry',
          pendingCommit: { status: 'memory-only', payload, outboxRevision: null }
        });
        return [{
          type: 'runtime/pending-commit-unprotected',
          microtaskId: state.microtaskId,
          leavingRepeatsMicrotask: true
        }];
      }
      transition({
        pendingCommit: { status: 'stored', payload, outboxRevision: stored.revision }
      });
      return [{
        type: 'runtime/pending-commit-stored',
        experienceRevision: unit.experienceRevision,
        microtaskId: state.microtaskId
      }, ...persistPendingCommit()];
    }

    function advanceChallengeOrStep({ presentationGateEnded = false } = {}) {
      const step = currentStep();
      const completesStep = !Array.isArray(step?.challenges)
        || state.challengeIndex + 1 >= step.challenges.length;
      if (completesStep && step?.stepId && !state.completedStepIds.includes(step.stepId)) {
        transition({
          completedStepIds: [...state.completedStepIds, step.stepId]
        });
      }
      if (!presentationGateEnded && !presentationGateIsOpen()) {
        pendingPresentationContinuation = { kind: 'advance-challenge-or-step' };
        transition({ phase: 'presentation-settling', audio: null });
        return [];
      }
      if (Array.isArray(step?.challenges) && state.challengeIndex + 1 < step.challenges.length) {
        activateChallenge(state.challengeIndex + 1);
        const audio = startReadyAudio();
        return audio ? [audio] : [];
      }
      if (currentTask()?.steps?.[state.stepIndex + 1]) {
        activateStep(state.stepIndex + 1);
        const audio = startReadyAudio();
        return audio ? [audio] : [];
      }
      return beginPendingCommit();
    }

    function reject(reason) {
      return publish([{
        type: 'runtime/command-rejected', reason,
        experienceRevision: unit.experienceRevision,
        stateVersion: state.stateVersion,
        challengeRef: state.challengeRef
      }]);
    }

    function validateCommand(action, { challenge = false, media = false } = {}) {
      if (action.experienceRevision !== unit.experienceRevision) return 'experience-revision-mismatch';
      if (action.stateVersion !== state.stateVersion) return 'state-version-mismatch';
      if (challenge && action.challengeRef !== state.challengeRef) return 'challenge-ref-mismatch';
      if (media) {
        if (action.microtaskId !== state.microtaskId) return 'microtask-mismatch';
        if (action.attemptRevision !== state.attemptRevision) return 'attempt-revision-mismatch';
        if (action.requestId !== state.audio?.requestId) return 'audio-request-mismatch';
        if (action.segmentId !== state.audio?.segmentId) return 'audio-part-mismatch';
      }
      return null;
    }

    function activeRolePractice() {
      const step = currentStep();
      return step?.kind === 'role-enactment' && step.practice?.kind === 'role-enactment'
        ? step.practice
        : null;
    }

    function roleRoundEvidence(round, disposition) {
      const dialogueTurnRefs = clone(round.dialogueTurnRefs || []);
      if (disposition === 'skipped') {
        return {
          targetResults: [], sourceContacts: [], audioContactRefs: [],
          missingAudioRefs: [], storyFacts: []
        };
      }
      return {
        targetResults: [],
        sourceContacts: dialogueTurnRefs.map(sourceRef => ({
          sourceRef,
          contactModes: ['experienced', 'audio-ended']
        })),
        audioContactRefs: dialogueTurnRefs,
        missingAudioRefs: [],
        storyFacts: []
      };
    }

    function skipResolvedRolePractice(task) {
      const event = {
        eventId: [
          'runtime', unit.unitId, unit.experienceRevision, state.unitAttemptId,
          task.microtaskId, 'skipped'
        ].join(':'),
        type: 'microtask-skipped',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        unitAttemptId: state.unitAttemptId,
        attemptRevision: state.attemptRevision,
        beatId: authoredTasks[activeTaskIndex].beatId,
        microtaskId: task.microtaskId,
        checkpointId: task.checkpointAfterSuccess?.checkpointId || `${task.microtaskId}:complete`,
        completionStatus: 'skipped',
        targetResults: [],
        sourceContacts: [],
        audioContactRefs: [],
        missingAudioRefs: [],
        storyFacts: [],
        adventureHeartsRemaining: state.adventureHearts
      };
      const applied = ledger.apply(event);
      if (applied?.persisted !== true) {
        return [{
          type: 'runtime/persistence-failed',
          operation: event.type,
          reason: applied?.reason || applied?.status || 'unavailable',
          retryable: true
        }];
      }
      const projected = ledger.read()?.units?.[unit.unitId] || {};
      if (!(projected.skippedMicrotaskIds || []).includes(task.microtaskId)) {
        return [{
          type: 'runtime/skip-readback-incomplete',
          microtaskId: task.microtaskId,
          retryable: true
        }];
      }
      transition({
        skippedMicrotaskIds: clone(projected.skippedMicrotaskIds || []),
        completedMicrotaskIds: clone(projected.completedMicrotaskIds || []),
        microtaskStatus: 'skipped'
      });
      const effects = [{
        type: 'runtime/microtask-skipped',
        experienceRevision: unit.experienceRevision,
        microtaskId: task.microtaskId,
        completionStatus: 'skipped'
      }];
      const next = enterTask(activeTaskIndex + 1);
      if (!next) {
        effects.push(...verifyUnitAndBuild());
        return effects;
      }
      effects.push({
        type: 'scene/show',
        experienceRevision: unit.experienceRevision,
        beatId: next.beatId,
        microtaskId: next.task.microtaskId,
        stepId: next.task.steps[0].stepId,
        advancedFromSkip: true
      });
      const audio = startReadyAudio();
      if (audio) effects.push(audio);
      return effects;
    }

    function saveRolePracticeRoundDisposition(action, disposition) {
      const invalid = validateCommand(action);
      if (invalid) return reject(invalid);
      const task = currentTask();
      const practice = activeRolePractice();
      if (!practice || state.phase !== 'role-practice-ready') {
        return reject('role-practice-not-active');
      }
      if (action.practiceId !== practice.practiceId) return reject('practice-id-mismatch');
      const round = (practice.rounds || []).find(candidate => candidate.roundId === action.roundId);
      if (!round) return reject('role-round-invalid');
      if (task.skipPolicy?.kind !== 'role-round-child-confirmed') {
        return reject('role-practice-disposition-policy-invalid');
      }
      if (disposition === 'completed'
        && state.rolePracticeProgress?.completedRoundIds.includes(action.roundId)) {
        return reject('role-round-already-complete');
      }
      if (sandboxActive) {
        if (disposition !== 'completed') return reject('sandbox-cannot-skip');
        const completedRoundIds = [
          ...state.rolePracticeProgress.completedRoundIds,
          action.roundId
        ];
        transition({
          rolePracticeProgress: {
            practiceId: practice.practiceId,
            completedRoundIds,
            skippedRoundIds: (state.rolePracticeProgress.skippedRoundIds || [])
              .filter(roundId => roundId !== action.roundId)
          },
          temporaryAudioContactRefs: [...new Set([
            ...state.temporaryAudioContactRefs,
            ...(round.dialogueTurnRefs || [])
          ])]
        });
        return publish([{
          type: 'runtime/role-practice-round-saved',
          experienceRevision: unit.experienceRevision,
          microtaskId: state.microtaskId,
          practiceId: practice.practiceId,
          roundId: action.roundId,
          disposition,
          completedRoundIds: clone(completedRoundIds),
          skippedRoundIds: clone(state.rolePracticeProgress.skippedRoundIds || []),
          persistence: 'none'
        }]);
      }
      const event = {
        eventId: [
          'runtime', unit.unitId, unit.experienceRevision, state.unitAttemptId,
          state.microtaskId, practice.practiceId, action.roundId, disposition
        ].join(':'),
        type: disposition === 'completed'
          ? 'role-practice-round-completed'
          : 'role-practice-round-skipped',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        unitAttemptId: state.unitAttemptId,
        microtaskId: state.microtaskId,
        practiceId: practice.practiceId,
        roundId: action.roundId,
        ...roleRoundEvidence(round, disposition)
      };
      const applied = ledger.apply(event);
      if (applied?.persisted !== true) {
        return publish([{
          type: 'runtime/persistence-failed',
          operation: event.type,
          reason: applied?.reason || applied?.status || 'unavailable',
          retryable: true
        }]);
      }
      const projected = clone(
        ledger.read()?.units?.[unit.unitId]?.rolePracticeProgress?.[practice.practiceId]
      );
      const dispositionPersisted = disposition === 'completed'
        ? projected?.completedRoundIds?.includes(action.roundId)
        : (
            projected?.completedRoundIds?.includes(action.roundId)
            || projected?.skippedRoundIds?.includes(action.roundId)
          );
      if (!dispositionPersisted) {
        return publish([{
          type: 'runtime/role-practice-readback-incomplete',
          practiceId: practice.practiceId,
          roundId: action.roundId,
          retryable: true
        }]);
      }
      durableRolePracticeProgress[practice.practiceId] = projected;
      const completed = new Set(projected.completedRoundIds || []);
      const skipped = new Set(projected.skippedRoundIds || []);
      const completedAudioRefs = (practice.rounds || [])
        .filter(candidate => completed.has(candidate.roundId))
        .flatMap(candidate => candidate.dialogueTurnRefs || []);
      transition({
        rolePracticeProgress: {
          practiceId: practice.practiceId,
          completedRoundIds: clone(projected.completedRoundIds || []),
          skippedRoundIds: clone(projected.skippedRoundIds || [])
        },
        temporaryAudioContactRefs: [...new Set(completedAudioRefs)]
      });
      const effects = [{
        type: 'runtime/role-practice-round-saved',
        experienceRevision: unit.experienceRevision,
        microtaskId: state.microtaskId,
        practiceId: practice.practiceId,
        roundId: action.roundId,
        disposition,
        completedRoundIds: clone(projected.completedRoundIds || []),
        skippedRoundIds: clone(projected.skippedRoundIds || []),
        persistence: 'durable'
      }];
      const allDisposed = (practice.rounds || []).every(candidate => (
        completed.has(candidate.roundId) || skipped.has(candidate.roundId)
      ));
      if (allDisposed && skipped.size > 0 && !skipRecoveryActive) {
        effects.push(...skipResolvedRolePractice(task));
      }
      return publish(effects);
    }

    function completeRolePracticeRound(action) {
      return saveRolePracticeRoundDisposition(action, 'completed');
    }

    function skipRolePracticeRound(action) {
      return saveRolePracticeRoundDisposition(action, 'skipped');
    }

    function completeRolePractice(action) {
      const invalid = validateCommand(action);
      if (invalid) return reject(invalid);
      const practice = activeRolePractice();
      if (!practice || state.phase !== 'role-practice-ready') {
        return reject('role-practice-not-active');
      }
      if (action.practiceId !== practice.practiceId) return reject('practice-id-mismatch');
      const completed = new Set(state.rolePracticeProgress?.completedRoundIds || []);
      if (!(practice.rounds || []).every(round => completed.has(round.roundId))) {
        return reject('role-practice-incomplete');
      }
      const activeMoment = currentTask()?.presentation?.moments?.find(moment => (
        moment.momentId === state.currentPresentationMomentId
      ));
      if (activeMoment?.enterWhen?.kind === 'step-active') {
        endedPresentationMomentIds.add(activeMoment.momentId);
      }
      transition({ completedStepIds: [...new Set([...state.completedStepIds, state.stepId])] });
      return publish(beginPendingCommit());
    }

    function restoreSkipRecoveryOrigin({ completed = false } = {}) {
      if (!skipRecoveryActive || !skipRecoveryOrigin) return [];
      const origin = skipRecoveryOrigin;
      const nextVersion = state.stateVersion + 1;
      const projected = ledger.read()?.units?.[unit.unitId] || {};
      const originAudio = clone(origin.state.audio);
      const restartOriginAudio = originAudio
        && ['audio-playing', 'audio-retry', 'audio-suspended', 'audio-blocked'].includes(origin.state.phase);
      skipRecoveryActive = false;
      skipRecoveryOrigin = null;
      activeTaskIndex = origin.activeTaskIndex;
      endedPresentationMomentIds = new Set(origin.endedPresentationMomentIds || []);
      pendingPresentationContinuation = clone(origin.pendingPresentationContinuation || null);
      durableRolePracticeProgress = clone(projected.rolePracticeProgress || {});
      state = {
        ...clone(origin.state),
        stateVersion: nextVersion,
        mode: 'microtask-v2',
        completedMicrotaskIds: clone(projected.completedMicrotaskIds || []),
        skippedMicrotaskIds: clone(projected.skippedMicrotaskIds || []),
        committedFacts: clone(projected.storyFacts || []),
        buildStage: Number.isInteger(projected.buildStage) ? projected.buildStage : origin.state.buildStage,
        rolePracticeSkipStatus: null,
        ...(restartOriginAudio ? { phase: 'audio-ready', audio: null } : {})
      };
      refreshNavigation(state.status === 'unit-built' ? null : state.microtaskId);
      const effects = [{
        type: completed
          ? 'runtime/skipped-stage-completed'
          : 'runtime/skipped-stage-returned',
        experienceRevision: unit.experienceRevision,
        microtaskId: 'L01-M12'
      }, {
        type: 'scene/show',
        experienceRevision: unit.experienceRevision,
        beatId: state.beatId,
        microtaskId: state.microtaskId,
        stepId: state.stepId,
        resumedFromSkipRecovery: true
      }];
      if (restartOriginAudio) {
        const audio = startReadyAudio();
        if (audio) effects.push(audio);
      }
      return effects;
    }

    function enterTask(taskIndex) {
      const authored = authoredTasks[taskIndex];
      if (!authored) return null;
      activeTaskIndex = taskIndex;
      endedPresentationMomentIds = new Set();
      pendingPresentationContinuation = null;
      transition({
        status: 'active',
        beatId: authored.beatId,
        microtaskId: authored.task.microtaskId,
        microtaskStatus: 'in-progress',
        stepId: null,
        stepIndex: null,
        phase: null,
        currentPresentationMomentId: null,
        challengeRef: null,
        challengeSourceRef: null,
        challengeIndex: 0,
        completedStepIds: [],
        attemptRevision: 0,
        temporaryResults: [],
        temporaryAudioContactRefs: [],
        temporaryMissingAudioRefs: [],
        pendingCommit: null,
        pendingUiContinuation: null,
        rolePracticeProgress: null,
        rolePracticeSkipStatus: null,
        supportLevel: 'none',
        supportDepth: 0,
        rescueUsed: false,
        audio: null
      });
      activateFirstStepOrWaitForIntro();
      refreshNavigation(state.microtaskId);
      return authored;
    }

    function restoreDurableUiContinuation(pending) {
      if (!pending || pending.unitAttemptId !== state.unitAttemptId) return null;
      const taskIndex = authoredTasks.findIndex(({ task }) => task.microtaskId === pending.microtaskId);
      if (taskIndex < 0 || !state.completedMicrotaskIds.includes(pending.microtaskId)) return null;
      const authored = enterTask(taskIndex);
      transition({
        microtaskStatus: 'completed',
        phase: 'completed',
        stepId: null,
        stepIndex: null,
        challengeRef: null,
        challengeSourceRef: null,
        completedStepIds: [],
        temporaryResults: [],
        pendingUiContinuation: clone(pending),
        audio: null
      });
      if (pending.kind === 'terminal-presentation') {
        restorePresentationMoment();
        if (state.currentPresentationMomentId !== pending.momentId) return null;
        pendingPresentationContinuation = authored.task.restStop
          ? { kind: 'rest-stop' }
          : (authored.task.growthBoundary === 'unit-verifying'
              ? { kind: 'enter-unit-verifying' }
              : { kind: 'next-task', taskIndex: taskIndex + 1 });
        refreshNavigation(pending.microtaskId);
        return publish([{
          type: 'runtime/terminal-presentation-restored',
          experienceRevision: unit.experienceRevision,
          microtaskId: pending.microtaskId,
          momentId: pending.momentId
        }]);
      }
      if (pending.kind === 'rest-stop' && authored.task.restStop) {
        endedPresentationMomentIds = new Set(
          (authored.task.presentation?.moments || []).map(moment => moment.momentId)
        );
        state = {
          ...state,
          status: 'rest-stop',
          currentPresentationMomentId: null,
          presentationAwaitingEnd: false,
          nextRestStop: clone(authored.task.restStop)
        };
        refreshNavigation(authored.task.restStop.nextMicrotaskId || null);
        return publish([{
          type: 'runtime/rest-stop-restored',
          experienceRevision: unit.experienceRevision,
          microtaskId: pending.microtaskId,
          restStopId: authored.task.restStop.restStopId,
          restStopType: authored.task.restStop.type,
          nextMicrotaskId: authored.task.restStop.nextMicrotaskId || null
        }]);
      }
      return null;
    }

    function enter({ entryLesson, unitAttemptId } = {}) {
      if (!unit.lessonIds.includes(entryLesson)) {
        throw new TypeError(`entryLesson must belong to ${unit.unitId}`);
      }
      const projection = ledger.read();
      const stored = projection?.units?.[unit.unitId] || {};
      const compatible = stored.experienceRevision === unit.experienceRevision ? stored : {};
      durableRolePracticeProgress = clone(compatible.rolePracticeProgress || {});
      const compatibleHearts = Number.isInteger(compatible.adventureHeartsRemaining)
        ? compatible.adventureHeartsRemaining
        : (Number.isInteger(compatible.adventureHearts) ? compatible.adventureHearts : 3);
      transition({
        entryLesson,
        unitAttemptId: unitAttemptId || compatible.unitAttemptId || `unit-attempt:${seed}`,
        adventureHearts: compatibleHearts,
        adventureHeartsRemaining: compatibleHearts,
        completedMicrotaskIds: clone(compatible.completedMicrotaskIds || []),
        skippedMicrotaskIds: clone(compatible.skippedMicrotaskIds || []),
        committedFacts: clone(compatible.storyFacts || []),
        buildStage: Number.isInteger(compatible.buildStage) ? compatible.buildStage : 0,
        diagnosticArchive: stored.experienceRevision
          && stored.experienceRevision !== unit.experienceRevision
          ? {
              ignoredExperienceRevision: stored.experienceRevision,
              reason: 'experience-revision-mismatch'
            }
          : null
      });
      const restoredContinuation = restoreDurableUiContinuation(
        clone(compatible.pendingUiContinuation || null)
      );
      if (restoredContinuation) return restoredContinuation;
      const firstForLesson = authoredTasks.findIndex(({ task }) => task.lessonId === entryLesson);
      const pending = restorablePendingCommit(loadPendingCommit());
      if (pending) {
        enterTask(pending.pendingIndex);
        transition({
          phase: 'persistence-retry',
          microtaskStatus: 'answered',
          temporaryResults: clone(pending.payload.targetResults),
          pendingCommit: {
            status: 'stored', payload: clone(pending.payload),
            outboxRevision: pending.outboxRevision
          }
        });
        restorePresentationMoment();
        return publish([{
          type: 'runtime/pending-commit-restored',
          experienceRevision: unit.experienceRevision,
          microtaskId: pending.payload.microtaskId
        }]);
      }
      const allAuthoredTasksCompleted = authoredTasks.every(({ task }) => (
        state.completedMicrotaskIds.includes(task.microtaskId)
        || state.skippedMicrotaskIds.includes(task.microtaskId)
      ));
      if (allAuthoredTasksCompleted) {
        enterTask(authoredTasks.length - 1);
        if (state.buildStage === 5) {
          transition({
            status: 'unit-built',
            phase: 'completed',
            microtaskStatus: 'completed',
            audio: null
          });
          endedPresentationMomentIds = new Set();
          state = {
            ...state,
            currentPresentationMomentId: null,
            presentationAwaitingEnd: false
          };
          refreshNavigation(null);
          return publish([{
            type: 'runtime/unit-built-restored',
            experienceRevision: unit.experienceRevision,
            unitId: unit.unitId,
            buildStage: 5
          }]);
        }
        transition({
          status: 'active',
          phase: 'unit-verifying',
          microtaskStatus: 'completed',
          audio: null
        });
        restorePresentationMoment();
        pendingPresentationContinuation = { kind: 'verify-unit' };
        refreshNavigation(null);
        return publish([{
          type: 'runtime/unit-verification-restored',
          experienceRevision: unit.experienceRevision,
          unitId: unit.unitId,
          retryable: true
        }]);
      }
      const nextIndex = authoredTasks.findIndex(({ task }, index) => (
        index >= Math.max(0, firstForLesson)
        && !state.completedMicrotaskIds.includes(task.microtaskId)
        && !state.skippedMicrotaskIds.includes(task.microtaskId)
      ));
      const authored = enterTask(nextIndex < 0 ? firstForLesson : nextIndex);
      if (!authored) return publish([]);
      const effects = [{
        type: 'scene/show',
        experienceRevision: unit.experienceRevision,
        beatId: authored.beatId,
        microtaskId: authored.task.microtaskId,
        stepId: authored.task.steps[0].stepId
      }];
      const audio = startReadyAudio();
      if (audio) effects.push(audio);
      return publish(effects);
    }

    function preview({ microtaskId, unitAttemptId = `preview:${seed}` } = {}) {
      const targetIndex = authoredTasks.findIndex(({ task }) => task.microtaskId === microtaskId);
      if (targetIndex < 0) throw new TypeError(`unknown preview microtask ${microtaskId}`);
      sandboxActive = true;
      sandboxOrigin = null;
      state = { ...state, mode: 'microtask-v2-sandbox', unitAttemptId };
      const authored = enterTask(targetIndex);
      const effects = [{
        type: 'scene/show', experienceRevision: unit.experienceRevision,
        beatId: authored.beatId, microtaskId, stepId: authored.task.steps[0].stepId,
        sandbox: true
      }];
      const audio = startReadyAudio();
      if (audio) effects.push(audio);
      return publish(effects);
    }

    function dispatch(action = {}) {
      if (action.type === 'navigation/exit-sandbox') {
        const invalid = validateCommand(action);
        if (invalid) return reject(invalid);
        if (!sandboxActive || !sandboxOrigin) return reject('sandbox-not-active');
        const cancelEffect = state.audio && ['playing', 'scheduled'].includes(state.audio.status)
          ? audioCancelEffect(state.audio)
          : null;
        const origin = sandboxOrigin;
        const nextVersion = state.stateVersion + 1;
        const originAudio = clone(origin.state.audio);
        const restartOriginAudio = originAudio
          && ['audio-playing', 'audio-retry', 'audio-suspended', 'audio-blocked'].includes(origin.state.phase);
        sandboxActive = false;
        sandboxOrigin = null;
        activeTaskIndex = origin.activeTaskIndex;
        endedPresentationMomentIds = new Set(origin.endedPresentationMomentIds || []);
        pendingPresentationContinuation = clone(origin.pendingPresentationContinuation || null);
        state = {
          ...clone(origin.state),
          stateVersion: nextVersion,
          mode: 'microtask-v2',
          ...(restartOriginAudio ? { phase: 'audio-ready', audio: null } : {})
        };
        const effects = [
          ...(cancelEffect ? [cancelEffect] : []),
          {
            type: 'scene/show', experienceRevision: unit.experienceRevision,
            beatId: state.beatId, microtaskId: state.microtaskId,
            stepId: state.stepId, resumedFromSandbox: true
          }
        ];
        if (restartOriginAudio) {
          const segmentIndex = Math.max(0, Math.min(
            originAudio.segmentIndex || 0,
            originAudio.segments.length - 1
          ));
          const restartedAudio = {
            ...originAudio,
            status: 'playing',
            requestId: `audio:${unit.experienceRevision}:${state.unitAttemptId}:${state.microtaskId}:${state.attemptRevision}:${Date.now()}:${audioRequestNamespace}:${++audioRequestSequence}`,
            segmentIndex,
            segmentId: originAudio.segments[segmentIndex].segmentId,
            retryAttempt: 0,
            manualRetryRequired: false,
            currentSegment: clone(originAudio.segments[segmentIndex]),
            visibleText: originAudio.segments[segmentIndex].text,
            unresolvedRefs: originAudio.refs.slice(segmentIndex).map(ref => ref.refId)
          };
          transition({ phase: 'audio-playing', audio: restartedAudio });
          effects.push(audioEffect(restartedAudio));
        } else if (state.phase === 'audio-ready') {
          const audio = startReadyAudio();
          if (audio) effects.push(audio);
        }
        return publish(effects);
      }
      if (action.type === 'presentation/ended') {
        if (!['active', 'sandbox-complete', 'rest-stop'].includes(state.status)) {
          return reject('runtime-not-active');
        }
        const invalid = validateCommand(action);
        if (invalid) return reject(invalid);
        if (action.microtaskId !== state.microtaskId) return reject('microtask-mismatch');
        if (action.attemptRevision !== state.attemptRevision) {
          return reject('attempt-revision-mismatch');
        }
        if (action.momentId !== state.currentPresentationMomentId) {
          return reject('presentation-moment-mismatch');
        }
        if (!action.momentId) return reject('presentation-moment-missing');
        if (endedPresentationMomentIds.has(action.momentId)) {
          return reject('presentation-moment-already-ended');
        }
        let acknowledgementEffects = [];
        if (
          state.pendingUiContinuation?.kind === 'terminal-presentation'
          && state.pendingUiContinuation.momentId === action.momentId
        ) {
          const acknowledged = acknowledgeDurableContinuation('presentation-ended', {
            momentId: action.momentId
          });
          if (!acknowledged.persisted) return publish(acknowledged.effects);
          acknowledgementEffects = acknowledged.effects;
        }
        const previousMomentId = state.currentPresentationMomentId;
        endedPresentationMomentIds.add(previousMomentId);
        transition({});
        const effects = [{
          type: 'runtime/presentation-moment-ended',
          experienceRevision: unit.experienceRevision,
          microtaskId: state.microtaskId,
          attemptRevision: state.attemptRevision,
          momentId: previousMomentId,
          nextMomentId: state.currentPresentationMomentId
        }, ...acknowledgementEffects];
        effects.push(...runPendingPresentationContinuation());
        return publish(effects);
      }
      if (action.type === 'navigation/open-stage') {
        const invalid = validateCommand(action);
        if (invalid) return reject(invalid);
        if (sandboxActive && state.status !== 'sandbox-complete') {
          return reject('sandbox-already-active');
        }
        if (!state.reachedMicrotaskIds.includes(action.microtaskId)) return reject('stage-not-reached');
        const skippedStage = state.skippedMicrotaskIds.includes(action.microtaskId);
        if (!state.completedMicrotaskIds.includes(action.microtaskId) && !skippedStage) {
          return reject('current-stage-already-open');
        }
        const targetIndex = authoredTasks.findIndex(({ task }) => task.microtaskId === action.microtaskId);
        if (targetIndex < 0) return reject('unknown-stage');
        const cancelEffect = state.audio && ['playing', 'scheduled'].includes(state.audio.status)
          ? audioCancelEffect(state.audio)
          : null;
        if (skippedStage) {
          if (skipRecoveryActive) return reject('skip-recovery-already-active');
          skipRecoveryOrigin = {
            activeTaskIndex,
            state: clone(state),
            endedPresentationMomentIds: [...endedPresentationMomentIds],
            pendingPresentationContinuation: clone(pendingPresentationContinuation)
          };
          skipRecoveryActive = true;
          const mainReached = clone(state.reachedMicrotaskIds);
          const mainNavigation = clone(state.stageNavigation);
          const authored = enterTask(targetIndex);
          state = {
            ...state,
            mode: 'microtask-v2-skip-recovery',
            reachedMicrotaskIds: mainReached,
            stageNavigation: mainNavigation
          };
          const effects = [
            ...(cancelEffect ? [cancelEffect] : []),
            {
              type: 'scene/show', experienceRevision: unit.experienceRevision,
              beatId: authored.beatId, microtaskId: authored.task.microtaskId,
              stepId: authored.task.steps[0].stepId, skipRecovery: true
            }
          ];
          const audio = startReadyAudio();
          if (audio) effects.push(audio);
          return publish(effects);
        }
        if (!sandboxActive) {
          sandboxOrigin = {
            activeTaskIndex,
            state: clone(state),
            endedPresentationMomentIds: [...endedPresentationMomentIds],
            pendingPresentationContinuation: clone(pendingPresentationContinuation)
          };
          sandboxActive = true;
        }
        transition({
          mode: 'microtask-v2-sandbox',
          adventureHearts: 3,
          adventureHeartsRemaining: 3,
          rescueUsed: false
        });
        const mainReached = clone(state.reachedMicrotaskIds);
        const mainNavigation = clone(state.stageNavigation);
        const authored = enterTask(targetIndex);
        state = {
          ...state,
          mode: 'microtask-v2-sandbox',
          reachedMicrotaskIds: mainReached,
          stageNavigation: mainNavigation
        };
        const effects = [
          ...(cancelEffect ? [cancelEffect] : []),
          {
            type: 'scene/show', experienceRevision: unit.experienceRevision,
            beatId: authored.beatId, microtaskId: authored.task.microtaskId,
            stepId: authored.task.steps[0].stepId, sandbox: true
          }
        ];
        const audio = startReadyAudio();
        if (audio) effects.push(audio);
        return publish(effects);
      }
      if (
        state.status === 'rest-stop'
        && ['rest-stop/continue', 'chapter/continue'].includes(action.type)
      ) {
        const invalid = validateCommand(action);
        if (invalid) return reject(invalid);
        const acknowledged = acknowledgeDurableContinuation('rest-stop-continue', {
          restStopId: state.nextRestStop?.restStopId || null
        });
        if (!acknowledged.persisted) return publish(acknowledged.effects);
        const nextMicrotaskId = state.nextRestStop?.nextMicrotaskId;
        const nextIndex = authoredTasks.findIndex(({ task }) => task.microtaskId === nextMicrotaskId);
        const next = enterTask(nextIndex);
        if (!next) return reject('rest-stop-next-microtask-missing');
        transition({ nextRestStop: null });
        const effects = [...acknowledged.effects, {
          type: 'scene/show', experienceRevision: unit.experienceRevision,
          beatId: next.beatId, microtaskId: next.task.microtaskId,
          stepId: next.task.steps[0].stepId
        }];
        const audio = startReadyAudio();
        if (audio) effects.push(audio);
        return publish(effects);
      }
      if (action.type === 'navigation/exit-skip-recovery') {
        const invalid = validateCommand(action);
        if (invalid) return reject(invalid);
        if (!skipRecoveryActive) return reject('skip-recovery-not-active');
        return publish(restoreSkipRecoveryOrigin());
      }
      if (state.status !== 'active') return reject('runtime-not-active');
      if (action.type === 'role-practice/round-complete') {
        return completeRolePracticeRound(action);
      }
      if (action.type === 'role-practice/round-skip') {
        return skipRolePracticeRound(action);
      }
      if (action.type === 'role-practice/complete') {
        return completeRolePractice(action);
      }
      if (action.type === 'unit/verify-retry') {
        const invalid = validateCommand(action);
        if (invalid) return reject(invalid);
        if (state.phase !== 'unit-verifying') return reject('unit-verification-not-active');
        if (
          pendingPresentationContinuation?.kind === 'verify-unit'
          && state.presentationAwaitingEnd
        ) {
          return reject('presentation-moment-not-ended');
        }
        return publish(verifyUnitAndBuild());
      }
      if (action.type === 'audio/play') {
        const invalid = validateCommand(action, { challenge: Boolean(state.challengeRef) });
        if (invalid) return reject(invalid);
        if (!['audio-ready', 'audio-playing', 'audio-failed'].includes(state.phase)) {
          return reject('audio-not-ready');
        }
        const challenge = currentChallenge();
        const step = currentStep();
        const previousPhase = state.phase;
        const previousAudio = state.audio;
        const restarting = ['audio-playing', 'audio-failed'].includes(previousPhase)
          && previousAudio?.segments?.length > 0;
        const audio = startAudio({
          sequence: restarting
            ? { segments: previousAudio.segments }
            : (challenge?.audioSequence || step?.audioSequence),
          challenge,
          purpose: restarting ? previousAudio.purpose : 'instruction',
          after: restarting
            ? previousAudio.after
            : (challenge?.answerRule || step?.answerRule ? 'open-response' : 'advance-challenge')
        });
        if (!audio) return reject('required-audio-missing');
        return publish([
          ...(previousPhase === 'audio-playing' ? [audioCancelEffect(previousAudio)] : []),
          audio
        ]);
      }
      if (action.type === 'audio/retry') {
        const invalid = validateCommand(action, { challenge: Boolean(state.challengeRef) });
        if (invalid) return reject(invalid);
        if (state.phase !== 'audio-failed' || state.audio?.manualRetryRequired !== true) {
          return reject('audio-retry-not-required');
        }
        const failedAudio = state.audio;
        const audio = startAudio({
          sequence: { segments: failedAudio.segments },
          challenge: currentChallenge(),
          purpose: failedAudio.purpose,
          after: failedAudio.after,
          startSegmentIndex: failedAudio.segmentIndex
        });
        return audio ? publish([audio]) : reject('required-audio-missing');
      }
      if (action.type === 'audio/suspend') {
        const invalid = validateCommand(action, { media: true });
        if (invalid) return reject(invalid);
        if (!['audio-playing', 'audio-retry'].includes(state.phase)) {
          return reject('audio-not-playing');
        }
        const suspendedAudio = state.audio;
        transition({
          phase: 'audio-suspended',
          audio: { ...suspendedAudio, status: 'suspended' }
        });
        return publish([audioCancelEffect(suspendedAudio)]);
      }
      if (action.type === 'audio/blocked') {
        const invalid = validateCommand(action, { media: true });
        if (invalid) return reject(invalid);
        if (!['audio-playing', 'audio-retry'].includes(state.phase)) {
          return reject('audio-not-playing');
        }
        const blockedAudio = state.audio;
        transition({
          phase: 'audio-blocked',
          audio: {
            ...blockedAudio,
            status: 'blocked',
            reason: typeof action.reason === 'string' ? action.reason : 'autoplay-policy',
            manualRetryRequired: false
          }
        });
        return publish([audioCancelEffect(blockedAudio)]);
      }
      if (action.type === 'audio/resume') {
        const invalid = validateCommand(action, { challenge: Boolean(state.challengeRef) });
        if (invalid) return reject(invalid);
        if (
          !['audio-suspended', 'audio-blocked'].includes(state.phase)
          || !['suspended', 'blocked'].includes(state.audio?.status)
        ) {
          return reject('audio-not-suspended');
        }
        const suspendedAudio = state.audio;
        const audio = startAudio({
          sequence: { segments: suspendedAudio.segments },
          challenge: currentChallenge(),
          purpose: suspendedAudio.purpose,
          after: suspendedAudio.after,
          retryAttempt: suspendedAudio.retryAttempt,
          startSegmentIndex: suspendedAudio.segmentIndex
        });
        return audio ? publish([audio]) : reject('required-audio-missing');
      }
      if (action.type === 'response/submit') {
        const invalid = validateCommand(action, { challenge: Boolean(state.challengeRef) });
        if (invalid) return reject(invalid);
        if (!presentationGateIsOpen()) return reject('presentation-moment-not-ended');
        if (state.phase !== 'awaiting-response') return reject('response-not-open');
        const step = currentStep();
        const challenge = currentChallenge();
        const answerRule = challenge?.answerRule || step?.answerRule;
        const evaluated = evaluateRule(answerRule, action.response);
        if (!evaluated.correct) {
          const formal = (challenge?.submissionMode || step?.submissionMode) === 'formal';
          const supportLayers = challenge?.supportLayers || step?.supportLayers || [];
          const nextSupportDepth = Math.min(3, state.supportDepth + 1);
          const nextHearts = formal ? Math.max(0, state.adventureHearts - 1) : state.adventureHearts;
          const depleted = formal && nextHearts === 0;
          const supportDepth = depleted ? 3 : nextSupportDepth;
          const layer = supportLayers[supportDepth - 1] || {
            level: ['reobserve', 'partial-cue', 'model'][supportDepth - 1]
          };
          transition({
            supportDepth,
            supportLevel: layer.level,
            adventureHearts: nextHearts,
            adventureHeartsRemaining: nextHearts,
            ...(depleted ? { phase: 'rescue-model', rescueUsed: true } : {})
          });
          if (depleted) {
            return publish([{
              type: 'feedback/partner-demo',
              experienceRevision: unit.experienceRevision,
              microtaskId: state.microtaskId,
              challengeRef: state.challengeRef,
              supportKind: 'changed-example-model',
              message: layer.copy || layer.message || null,
              changedExample: true,
              revealsAnswer: false
            }]);
          }
          return publish([{
            type: 'feedback/support',
            experienceRevision: unit.experienceRevision,
            microtaskId: state.microtaskId,
            challengeRef: state.challengeRef,
            supportKind: layer.level,
            supportDepth,
            message: layer.copy || layer.message || null,
            revealsAnswer: false,
            mismatchPath: clone(evaluated.mismatchPath)
          }]);
        }
        const result = resultForChallenge(challenge);
        const supportLevel = state.supportLevel;
        const outcome = state.rescueUsed
          ? 'partner-rescue'
          : (state.supportDepth > 0 ? 'supported' : 'independent');
        const formal = (challenge?.submissionMode || step?.submissionMode) === 'formal';
        const heartsAfter = formal
          ? Math.min(3, state.adventureHearts + 1)
          : state.adventureHearts;
        const temporaryResults = result && !state.temporaryResults.some(item => item.resultId === result.resultId)
          ? [...state.temporaryResults, {
              ...clone(result), challengeRef: challenge.challengeRef,
              outcome, supportLevel: state.rescueUsed ? 'model' : supportLevel,
              rescueUsed: state.rescueUsed,
              heartsRemaining: heartsAfter,
              adventureHeartsRemaining: heartsAfter
            }]
          : state.temporaryResults;
        transition({
          temporaryResults,
          adventureHearts: heartsAfter,
          adventureHeartsRemaining: heartsAfter
        });
        const effects = [{
          type: 'feedback/correct', experienceRevision: unit.experienceRevision,
          microtaskId: state.microtaskId, stepId: state.stepId,
          challengeRef: state.challengeRef, outcome,
          message: challenge?.correctFeedback?.copy || step?.correctFeedback || null
        }];
        const stepOwnsFeedbackAudio = !Array.isArray(step?.challenges)
          && Boolean(step?.feedbackAudioSequence);
        if (stepOwnsFeedbackAudio && step?.stepId && !state.completedStepIds.includes(step.stepId)) {
          transition({ completedStepIds: [...state.completedStepIds, step.stepId] });
        }
        if (challenge?.feedbackAudioSequence || challenge?.channel === 'word-form') {
          const audio = startAudio({
            sequence: challenge.feedbackAudioSequence,
            challenge,
            purpose: stepOwnsFeedbackAudio ? 'story-response' : 'word-form-answer',
            after: 'advance-challenge'
          });
          if (!audio) return reject('required-audio-missing');
          effects.push(audio);
          return publish(effects);
        }
        effects.push(...advanceChallengeOrStep());
        return publish(effects);
      }
      if (action.type === 'audio/ended') {
        const invalid = validateCommand(action, { media: true });
        if (invalid) return reject(invalid);
        if (!['audio-playing', 'audio-retry'].includes(state.phase)) return reject('audio-not-playing');
        const audio = state.audio;
        const completedSegment = audio.segments[audio.segmentIndex];
        if (
          completedSegment.sourceRef
          && !state.temporaryAudioContactRefs.includes(completedSegment.sourceRef)
        ) {
          state = {
            ...state,
            temporaryAudioContactRefs: [
              ...state.temporaryAudioContactRefs,
              completedSegment.sourceRef
            ]
          };
        }
        const nextSegmentIndex = audio.segmentIndex + 1;
        if (nextSegmentIndex < audio.segments.length) {
          const nextAudio = {
            ...audio,
            segmentIndex: nextSegmentIndex,
            segmentId: audio.segments[nextSegmentIndex].segmentId,
            retryAttempt: 0,
            currentSegment: clone(audio.segments[nextSegmentIndex]),
            visibleText: audio.segments[nextSegmentIndex].text,
            unresolvedRefs: audio.refs.slice(nextSegmentIndex).map(ref => ref.refId)
          };
          transition({ audio: nextAudio });
          return publish([audioEffect(nextAudio)]);
        }
        transition({ audio: { ...audio, status: 'completed' } });
        if (audio.after === 'open-response') {
          transition({ phase: 'awaiting-response' });
          return publish([]);
        }
        return publish(advanceChallengeOrStep());
      }
      if (action.type === 'audio/failed') {
        const invalid = validateCommand(action, { media: true });
        if (invalid) return reject(invalid);
        if (!['audio-playing', 'audio-retry'].includes(state.phase)) return reject('audio-not-playing');
        const failedAudio = state.audio;
        const failedSegment = failedAudio.segments[failedAudio.segmentIndex];
        const transient = action.failureKind === 'transient';
        if (transient && failedAudio.retryAttempt < 2) {
          const retryAttempt = failedAudio.retryAttempt + 1;
          const retryEffect = startAudio({
            sequence: { segments: failedAudio.segments },
            challenge: currentChallenge(),
            purpose: failedAudio.purpose,
            after: failedAudio.after,
            retryAttempt,
            delayMs: retryAttempt === 1 ? 250 : 750,
            startSegmentIndex: failedAudio.segmentIndex
          });
          return publish([retryEffect]);
        }
        transition({
          phase: 'audio-failed',
          audio: {
            ...failedAudio,
            status: 'failed',
            reason: typeof action.reason === 'string' ? action.reason : 'unavailable',
            manualRetryRequired: true,
            unresolvedRefs: failedAudio.refs
              .slice(failedAudio.segmentIndex)
              .map(ref => ref.refId)
          }
        });
        return publish([{
          type: 'audio/failure',
          experienceRevision: unit.experienceRevision,
          microtaskId: state.microtaskId,
          attemptRevision: state.attemptRevision,
          requestId: failedAudio.requestId,
          segmentId: failedSegment.segmentId,
          reason: state.audio.reason,
          failClosed: true,
          visibleText: failedSegment.text,
          canRetry: true
        }]);
      }
      if (action.type === 'rescue/model-ended') {
        const invalid = validateCommand(action, { challenge: true });
        if (invalid) return reject(invalid);
        if (action.microtaskId !== state.microtaskId) return reject('microtask-mismatch');
        if (action.attemptRevision !== state.attemptRevision) return reject('attempt-revision-mismatch');
        if (state.phase !== 'rescue-model') return reject('rescue-model-not-active');
        const previousAttemptRevision = state.attemptRevision;
        endedPresentationMomentIds = new Set();
        pendingPresentationContinuation = null;
        state = {
          ...state,
          temporaryResults: [],
          completedStepIds: [],
          attemptRevision: previousAttemptRevision + 1,
          adventureHearts: 3,
          adventureHeartsRemaining: 3,
          supportLevel: 'model',
          supportDepth: 3,
          rescueUsed: true,
          audio: null,
          phase: 'restarting',
          currentPresentationMomentId: null,
          stateVersion: state.stateVersion + 1
        };
        transition({ phase: null });
        activateFirstStepOrWaitForIntro();
        const effects = [
          { type: 'runtime/temporary-cleared', microtaskId: state.microtaskId },
          {
            type: 'runtime/attempt-revision-incremented',
            microtaskId: state.microtaskId,
            from: previousAttemptRevision,
            to: state.attemptRevision
          },
          { type: 'adventure-hearts/refilled', microtaskId: state.microtaskId, hearts: 3 },
          {
            type: 'scene/restart-microtask', microtaskId: state.microtaskId,
            stepId: state.stepId, attemptRevision: state.attemptRevision
          }
        ];
        const audio = startReadyAudio();
        if (audio) effects.push(audio);
        return publish(effects);
      }
      if (action.type === 'persistence/retry') {
        const invalid = validateCommand(action);
        if (invalid) return reject(invalid);
        if (state.phase !== 'persistence-retry') return reject('persistence-retry-not-active');
        return publish(persistPendingCommit());
      }
      return reject('command-not-allowed');
    }

    function destroy() {
      const effects = state.audio && ['playing', 'scheduled'].includes(state.audio.status)
        ? [audioCancelEffect(state.audio)]
        : [];
      transition({ status: 'destroyed', phase: 'destroyed', audio: null });
      return publish(effects);
    }

    return Object.freeze({ enter, preview, dispatch, snapshot, destroy });
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
      adventureHeartsRemaining: 3,
      assistanceMode: false,
      partnerRescueActive: false,
      optionRevision: 0,
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

    function adventureHearts() {
      return Number.isInteger(state.adventureHeartsRemaining)
        ? state.adventureHeartsRemaining
        : 3;
    }

    function withAdventureHearts(nextValue) {
      const normalized = Math.max(0, Math.min(3, Number(nextValue) || 0));
      return {
        adventureHeartsRemaining: normalized,
        heartsRemaining: normalized
      };
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
        assistanceMode: state.partnerRescueActive
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
          assistanceMode: state.partnerRescueActive
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
      return {
        kind,
        refId,
        src: item.audioSrc,
        text: item.text,
        ...(item.speaker ? { speaker: item.speaker } : {})
      };
    }

    function audioRefsForStep(step) {
      if (!step) return [];
      if (Array.isArray(step.audioSourceRefs) || Array.isArray(step.audioContentRefs)) {
        return [
          ...(step.audioContentRefs || []).map(refId => resolveAudioRef(refId, 'content')),
          ...(step.audioSourceRefs || []).map(refId => resolveAudioRef(refId))
        ].filter(Boolean);
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
        purpose: audio.purpose,
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
          heartsRemaining: adventureHearts(),
          adventureHeartsRemaining: adventureHearts()
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

    function startFeedbackAudio(audioRef, after) {
      if (!audioRef) return null;
      const audio = {
        status: 'playing',
        requestId: `audio:${unit.unitId}:${seed}:${++audioSequence}`,
        segmentIndex: 0,
        refs: [clone(audioRef)],
        stepId: state.stepId,
        batchIndex: state.batchIndex,
        after,
        purpose: 'feedback'
      };
      state = {
        ...state,
        phase: 'audio-playing',
        audio
      };
      return audioEffect(audio, 0);
    }

    function startCurrentStepAudio(purpose) {
      const refs = audioRefsForStep(currentStep());
      if (refs.length === 0) return null;
      const audio = {
        status: 'playing',
        requestId: `audio:${unit.unitId}:${seed}:${++audioSequence}`,
        segmentIndex: 0,
        refs: clone(refs),
        stepId: state.stepId,
        batchIndex: state.batchIndex,
        after: ['match-entity', 'match-entity-batch'].includes(currentStep()?.kind)
          ? 'open-response'
          : 'advance-step',
        purpose
      };
      state = { ...state, phase: 'audio-playing', audio };
      return audioEffect(audio, 0);
    }

    function autoStartReadyAudio({ purpose, withinMicrotaskId }) {
      if (state.microtaskId !== withinMicrotaskId || state.phase !== 'audio-ready') return null;
      return startCurrentStepAudio(purpose);
    }

    function taskCompletionStatus() {
      if (state.partnerRescueActive) return 'completed-partner-rescue';
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
        adventureHeartsRemaining: adventureHearts(),
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

    function enterTask(taskIndex, {
      refillAdventureHearts = false,
      partnerRescueActive = false,
      optionRevision = 0
    } = {}) {
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
        ...withAdventureHearts(refillAdventureHearts ? 3 : adventureHearts()),
        assistanceMode: partnerRescueActive,
        partnerRescueActive,
        optionRevision,
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
      state = {
        ...state,
        ...withAdventureHearts(Number.isInteger(durable.adventureHeartsRemaining)
          ? durable.adventureHeartsRemaining
          : 3),
        partnerRescueActive: false,
        optionRevision: 0
      };
      const completedId = typeof durable.checkpoint === 'object'
        ? durable.checkpoint?.microtaskId
        : null;
      const completedIndex = authoredTasks.findIndex(item => item.task.microtaskId === completedId);
      const retiredResumeTargetId = unit.retiredMicrotaskResumeTargets?.[completedId];
      const retiredResumeIndex = authoredTasks.findIndex(item => (
        item.task.microtaskId === retiredResumeTargetId
        && item.task.lessonId === entryLesson
      ));
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
      let nextIndex = completedIndex >= 0
        ? completedIndex + 1
        : (retiredResumeIndex >= 0 ? retiredResumeIndex : 0);
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
        ...withAdventureHearts(3),
        partnerRescueActive: false,
        optionRevision: 0,
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
        && state.phase === 'partner-rescue'
        && action.type === 'partner-rescue/continue'
      ) {
        const restarted = enterTask(activeTaskIndex, {
          refillAdventureHearts: true,
          partnerRescueActive: true,
          optionRevision: state.optionRevision + 1
        });
        return publish(restarted ? [{
          type: 'scene/restart-microtask',
          microtaskId: restarted.task.microtaskId,
          stepId: restarted.task.steps[0].stepId,
          reshuffle: true,
          optionRevision: state.optionRevision
        }] : []);
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
      if (action.type === 'step/continue' && state.phase === 'response') {
        const step = currentStep();
        if (!step || step.answerRule || step.submissionMode === 'formal') return publish([]);
        const withinMicrotaskId = state.microtaskId;
        const effects = advanceAfterStep();
        const autoAudioEffect = autoStartReadyAudio({ purpose: 'followup', withinMicrotaskId });
        if (autoAudioEffect) effects.push(autoAudioEffect);
        return publish(effects);
      }
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
        } else if (state.audio.after === 'advance-batch-auto-audio') {
          const withinMicrotaskId = state.microtaskId;
          const effects = advanceBatchOrStep();
          const followupEffect = autoStartReadyAudio({
            purpose: 'followup',
            withinMicrotaskId
          });
          if (followupEffect) effects.push(followupEffect);
          return publish(effects);
        } else if (state.audio.after === 'advance-step-auto-audio') {
          const withinMicrotaskId = state.microtaskId;
          const effects = advanceAfterStep();
          const followupEffect = autoStartReadyAudio({
            purpose: 'followup',
            withinMicrotaskId
          });
          if (followupEffect) effects.push(followupEffect);
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
        const stepPreconditionsMet = previewMode
          || (step.preconditionFactIds || []).every(factId => durableFacts.has(factId));
        const durablePreconditionsMet = stepPreconditionsMet && (
          step.answerRule.type !== 'all-of'
          || (step.answerRule.requiredFactIds || []).every(factId => durableFacts.has(factId))
        );
        const evaluated = durablePreconditionsMet
          ? evaluateRule(step.answerRule, response)
          : { correct: false, mismatchPath: ['factIds'] };
        const changesAdventureHearts = step.submissionMode === 'formal'
          && step.affectsAdventureHearts !== false;
        if (!evaluated.correct) {
          const nextLevel = Math.min(3, state.supportLevel + 1);
          const nextHearts = changesAdventureHearts
            ? Math.max(0, adventureHearts() - 1)
            : adventureHearts();
          const depleted = changesAdventureHearts && nextHearts === 0;
          state = {
            ...state,
            supportLevel: nextLevel,
            ...withAdventureHearts(nextHearts),
            assistanceMode: depleted || state.partnerRescueActive,
            partnerRescueActive: depleted || state.partnerRescueActive,
            ...(depleted ? { phase: 'partner-rescue' } : {})
          };
          if (depleted) {
            return publish([{
              type: 'feedback/partner-demo',
              microtaskId: state.microtaskId,
              stepId: state.stepId,
              level: 3,
              supportKind: 'changed-example-model',
              message: step.support?.[2] || null,
              changedExample: true,
              revealsAnswer: false,
              requiresChildAction: true
            }, {
              type: 'adventure-hearts/star-rewind',
              microtaskId: state.microtaskId,
              delayMs: 1400,
              restartScope: 'current-microtask'
            }]);
          }
          return publish([{
            type: 'feedback/support',
            microtaskId: state.microtaskId,
            stepId: state.stepId,
            level: nextLevel,
            supportKind: ['reobserve', 'partial-cue', 'model'][nextLevel - 1],
            message: step.support?.[nextLevel - 1] || null,
            revealsAnswer: false
          }]);
        }
        if (changesAdventureHearts) {
          state = {
            ...state,
            ...withAdventureHearts(Math.min(3, adventureHearts() + 1))
          };
        }
        const outcome = pendingTask.audioUnavailableSteps.includes(step.stepId)
          ? 'audio-unavailable'
          : (state.partnerRescueActive
              ? 'partner-rescue'
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
        const feedbackEffect = startFeedbackAudio(
          feedbackAudio,
          isBatch ? 'advance-batch-auto-audio' : 'advance-step-auto-audio'
        );
        if (feedbackEffect) {
          effects.push(feedbackEffect);
          return publish(effects);
        }
        const withinMicrotaskId = state.microtaskId;
        const advanceEffects = isBatch ? advanceBatchOrStep() : advanceAfterStep();
        if (advanceEffects.some(effect => effect.type === 'runtime/persistence-failed')) {
          return publish(advanceEffects);
        }
        effects.push(...advanceEffects);
        const autoAudioEffect = autoStartReadyAudio({
          purpose: 'feedback',
          withinMicrotaskId
        });
        if (autoAudioEffect) effects.push(autoAudioEffect);
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

  function create({ unit, ledger, effectSink = () => {}, seed = 1, outbox = null } = {}) {
    if (!unit?.unitId || !Array.isArray(unit.beats) || unit.beats.length !== 5) {
      throw new TypeError('learning runtime requires a five-beat teaching unit');
    }
    if (!ledger || typeof ledger.read !== 'function' || typeof ledger.apply !== 'function') {
      throw new TypeError('learning runtime requires a ledger with read and apply');
    }
    if (typeof effectSink !== 'function') throw new TypeError('effectSink must be a function');
    if (!Number.isFinite(Number(seed))) throw new TypeError('seed must be numeric');
    if (/^lesson1-2-v2(?:\.\d+)?$/.test(unit.experienceRevision || '')) {
      return createLesson12V2({ unit, ledger, effectSink, seed: Number(seed), outbox });
    }
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
