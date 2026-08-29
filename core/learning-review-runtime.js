(function attachLearningReviewRuntime(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningReviewRuntime = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningReviewRuntimeFactory() {
  'use strict';

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
  }

  function fnv1a32(value) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return () => {
      value |= 0;
      value = (value + 0x6D2B79F5) | 0;
      let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
      mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(values, seed) {
    const ordered = [...values];
    const random = mulberry32(seed);
    for (let index = ordered.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
    }
    return ordered;
  }

  function evaluateRule(rule, response, path = []) {
    if (!rule || typeof rule !== 'object' || !response || typeof response !== 'object') {
      return { correct: false, mismatchPath: path };
    }
    if (rule.type === 'select-one') {
      if (typeof rule.acceptedEntityId === 'string' || Array.isArray(rule.acceptedEntityIds)) {
        const accepted = Array.isArray(rule.acceptedEntityIds)
          ? rule.acceptedEntityIds
          : [rule.acceptedEntityId];
        const correct = accepted.includes(response.entityId);
        return { correct, mismatchPath: correct ? null : [...path, 'entityId'] };
      }
      for (const [field, accepted] of [
        ['sourceRef', rule.acceptedSourceRef],
        ['contentRef', rule.acceptedContentRef]
      ]) {
        if (typeof accepted === 'string') {
          const correct = response[field] === accepted;
          return { correct, mismatchPath: correct ? null : [...path, field] };
        }
      }
      return { correct: false, mismatchPath: path };
    }
    if (rule.type === 'match-entity') {
      const expected = typeof rule.acceptedEntityId === 'string'
        ? rule.acceptedEntityId
        : rule.pairs?.[response.sourceRef];
      const sourceMatches = typeof rule.acceptedSourceRef !== 'string'
        || response.sourceRef === rule.acceptedSourceRef;
      const correct = sourceMatches && typeof expected === 'string' && response.entityId === expected;
      return {
        correct,
        mismatchPath: correct ? null : [...path, sourceMatches ? 'entityId' : 'sourceRef']
      };
    }
    if (rule.type === 'ordered-blocks') {
      const expected = Array.isArray(rule.acceptedOrder)
        ? rule.acceptedOrder
        : rule.acceptedByEntityId?.[response.selectedEntityId];
      const actual = response.blockRefs;
      const correct = Array.isArray(expected) && Array.isArray(actual)
        && expected.length === actual.length
        && expected.every((blockRef, index) => blockRef === actual[index]);
      return { correct, mismatchPath: correct ? null : [...path, 'blockRefs'] };
    }
    if (rule.type === 'connect-reference') {
      const correct = response.sourceRef === rule.sourceRef && response.entityId === rule.entityId;
      return { correct, mismatchPath: correct ? null : [...path, 'entityId'] };
    }
    return { correct: false, mismatchPath: path };
  }

  function create({ unit, ledger, effectSink = () => {}, idFactory, now } = {}) {
    if (!unit?.unitId || !/^lesson1-2-v2(?:\.\d+)?$/.test(unit.experienceRevision || '')) {
      throw new TypeError('learning review runtime requires a lesson1-2-v2 catalog unit');
    }
    if (!ledger || typeof ledger.read !== 'function'
      || typeof ledger.apply !== 'function' || typeof ledger.planReview !== 'function') {
      throw new TypeError('learning review runtime requires ledger read/apply/planReview');
    }
    if (typeof effectSink !== 'function') throw new TypeError('effectSink must be a function');
    let generatedId = 0;
    const makeId = typeof idFactory === 'function'
      ? idFactory
      : kind => `${kind}:${Date.now()}:${++generatedId}`;
    const currentTime = typeof now === 'function' ? now : () => new Date().toISOString();
    let state = {
      stateVersion: 0,
      status: 'idle',
      phase: null,
      unitId: unit.unitId,
      experienceRevision: unit.experienceRevision,
      reviewRunId: null,
      attemptRevision: 0,
      cellCount: 0,
      estimatedSeconds: 0,
      currentIndex: null,
      reviewChallengeRef: null,
      currentCell: null,
      currentContext: null,
      heartsRemaining: null,
      supportLevel: 'none',
      rescueUsed: false,
      completedReviewCellIds: [],
      pendingCorrect: null,
      audio: null
    };
    let plan = [];

    function snapshot() {
      return deepFreeze(clone(state));
    }

    function publish(effects) {
      const frozen = deepFreeze(clone(effects));
      effectSink(frozen, snapshot());
      return frozen;
    }

    function challengeFor(cell) {
      for (const beat of unit.beats || []) {
        for (const task of beat.microtasks || []) {
          for (const step of task.steps || []) {
            const challenge = (step.challenges || []).find(candidate => (
              candidate.challengeRef === cell.challengeRef
                && candidate.reviewCellId === cell.reviewCellId
                && candidate.resultId === cell.resultId
            ));
            if (challenge) return challenge;
          }
        }
      }
      return null;
    }

    function sourceFor(sourceRef) {
      for (const lesson of Object.values(unit.lessonContent || {})) {
        if (lesson.sources?.[sourceRef]) return lesson.sources[sourceRef];
      }
      return null;
    }

    function normalizedSegments(sequence, challenge) {
      return (sequence?.segments || []).map((audioPart, index) => {
        const authored = audioPart.sourceRef ? sourceFor(audioPart.sourceRef) : null;
        return {
          segmentId: audioPart.segmentId
            || `${challenge.challengeRef}:audio:A${String(index + 1).padStart(2, '0')}`,
          sourceRef: audioPart.sourceRef || null,
          contentRef: audioPart.contentRef || null,
          src: audioPart.src || audioPart.audioSrc || authored?.audioSrc || null,
          text: audioPart.text || authored?.text || challenge.targetText || '',
          speaker: audioPart.speaker || authored?.speaker || null
        };
      });
    }

    function currentReviewChallengeRef(index = state.currentIndex, revision = state.attemptRevision) {
      return `${state.reviewRunId}:R${revision}:C${String(index + 1).padStart(2, '0')}`;
    }

    function candidateSeed(cell, kind) {
      return fnv1a32([
        unit.experienceRevision,
        state.reviewRunId,
        state.attemptRevision,
        cell.reviewCellId,
        `candidate-${kind}`
      ].join('|'));
    }

    function activate(index) {
      const cell = plan[index];
      const context = unit.reviewContexts?.[cell?.reviewContextId];
      const challenge = cell ? challengeFor(cell) : null;
      if (!cell || !context || context.contextId !== cell.reviewContextId || !challenge) {
        throw new TypeError('review plan must resolve to catalog challenge and review context');
      }
      const phase = challenge.audioSequence ? 'audio-ready' : 'awaiting-response';
      const candidateShuffleSeeds = {
        entities: candidateSeed(cell, 'entities'),
        sources: candidateSeed(cell, 'sources'),
        contents: candidateSeed(cell, 'contents')
      };
      const candidateEntityIds = shuffled(
        challenge.candidateEntityIds || [], candidateShuffleSeeds.entities
      );
      const candidateSourceRefs = shuffled(
        challenge.candidateSourceRefs || [], candidateShuffleSeeds.sources
      );
      const candidateContentRefs = shuffled(
        challenge.candidateContentRefs || [], candidateShuffleSeeds.contents
      );
      state = {
        ...state,
        stateVersion: state.stateVersion + 1,
        phase,
        currentIndex: index,
        reviewChallengeRef: currentReviewChallengeRef(index),
        currentCell: {
          ...clone(cell),
          authoredChallengeRef: challenge.challengeRef,
          targetText: challenge.targetText || sourceFor(cell.sourceRef)?.text || '',
          candidateShuffleSeed: candidateEntityIds.length
            ? candidateShuffleSeeds.entities
            : candidateSourceRefs.length
              ? candidateShuffleSeeds.sources
              : candidateShuffleSeeds.contents,
          candidateShuffleSeeds,
          candidateEntityIds,
          candidateSourceRefs,
          candidateContentRefs
        },
        currentContext: clone(context),
        supportLevel: state.rescueUsed ? 'model' : 'none',
        pendingCorrect: null,
        audio: null
      };
      return phase === 'audio-ready'
        ? [{
            type: 'review/audio-ready',
            reviewRunId: state.reviewRunId,
            reviewChallengeRef: state.reviewChallengeRef,
            reviewCellId: cell.reviewCellId,
            purpose: 'prompt'
          }]
        : [{
            type: 'review/response-ready',
            reviewRunId: state.reviewRunId,
            reviewChallengeRef: state.reviewChallengeRef,
            reviewCellId: cell.reviewCellId
          }];
    }

    function reject(reason) {
      return publish([{
        type: 'review/command-rejected',
        reason,
        experienceRevision: unit.experienceRevision,
        stateVersion: state.stateVersion,
        reviewRunId: state.reviewRunId,
        reviewChallengeRef: state.reviewChallengeRef
      }]);
    }

    function validate(action, { challenge = false, media = false } = {}) {
      if (action.experienceRevision !== unit.experienceRevision) {
        return 'experience-revision-mismatch';
      }
      if (action.stateVersion !== state.stateVersion) return 'state-version-mismatch';
      if (action.reviewRunId !== state.reviewRunId) return 'review-run-mismatch';
      if (action.attemptRevision !== state.attemptRevision) return 'attempt-revision-mismatch';
      if (challenge && action.reviewChallengeRef !== state.reviewChallengeRef) {
        return 'review-challenge-ref-mismatch';
      }
      if (media) {
        if (action.requestId !== state.audio?.requestId) return 'audio-request-mismatch';
        if (action.segmentId !== state.audio?.segmentId) return 'audio-part-mismatch';
      }
      return null;
    }

    function audioEffect(audio, delayMs = 0) {
      const audioPart = audio.segments[audio.segmentIndex];
      return {
        type: 'audio/play',
        experienceRevision: unit.experienceRevision,
        reviewRunId: state.reviewRunId,
        attemptRevision: state.attemptRevision,
        reviewChallengeRef: state.reviewChallengeRef,
        reviewCellId: state.currentCell.reviewCellId,
        requestId: audio.requestId,
        segmentId: audioPart.segmentId,
        sourceRef: audioPart.sourceRef,
        contentRef: audioPart.contentRef,
        src: audioPart.src,
        visibleText: audioPart.text,
        speaker: audioPart.speaker,
        purpose: audio.purpose,
        retryAttempt: audio.retryAttempt,
        delayMs
      };
    }

    function startAudio({ sequence, purpose, after, retryAttempt = 0, delayMs = 0 }) {
      const challenge = challengeFor(state.currentCell);
      const segments = normalizedSegments(sequence, challenge);
      if (segments.length === 0 || segments.some(audioPart => !audioPart.src || !audioPart.text)) return null;
      const audio = {
        status: 'playing',
        requestId: makeId('audio-request'),
        purpose,
        after,
        retryAttempt,
        automaticRetryDelaysMs: clone(sequence.automaticRetryDelaysMs || [250, 750]),
        maxPlaybackAttempts: sequence.maxPlaybackAttempts || 3,
        segments,
        segmentIndex: 0,
        segmentId: segments[0].segmentId,
        visibleText: segments[0].text
      };
      state = {
        ...state,
        stateVersion: state.stateVersion + 1,
        phase: 'audio-playing',
        audio
      };
      return audioEffect(audio, delayMs);
    }

    function retryAudio({ manual, preserveAttempt = false }) {
      const previous = state.audio;
      const retryAttempt = preserveAttempt
        ? previous.retryAttempt
        : manual ? 0 : previous.retryAttempt + 1;
      const audio = {
        ...previous,
        status: 'playing',
        requestId: makeId('audio-request'),
        retryAttempt,
        manualRetryRequired: false
      };
      state = {
        ...state,
        stateVersion: state.stateVersion + 1,
        phase: 'audio-playing',
        audio
      };
      const delayMs = manual || preserveAttempt
        ? 0
        : audio.automaticRetryDelaysMs[retryAttempt - 1];
      return audioEffect(audio, delayMs);
    }

    function attemptEvent(outcome, supportLevel) {
      const cell = state.currentCell;
      return {
        eventId: makeId('review-event'),
        type: 'review-attempt',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        reviewRunId: state.reviewRunId,
        reviewChallengeRef: state.reviewChallengeRef,
        reviewCellId: cell.reviewCellId,
        targetId: cell.targetId,
        sourceRef: cell.sourceRef,
        channel: cell.channel,
        contextId: cell.reviewContextId,
        evidenceMode: cell.evidenceMode,
        outcome,
        supportLevel,
        attemptedAt: currentTime()
      };
    }

    function synchronizeRun(result) {
      const run = result.snapshot?.reviewRuns?.[state.reviewRunId]
        || ledger.read()?.reviewRuns?.[state.reviewRunId];
      if (!run) return null;
      state = {
        ...state,
        heartsRemaining: run.heartsRemaining,
        rescueUsed: run.rescueUsed === true,
        completedReviewCellIds: Object.keys(run.temporaryResults || {})
      };
      return run;
    }

    function applyAttempt(outcome, supportLevel) {
      const applied = ledger.apply(attemptEvent(outcome, supportLevel));
      if (!['applied', 'duplicate'].includes(applied.status)) return { applied, run: null };
      return { applied, run: synchronizeRun(applied) };
    }

    function completeRun() {
      const completed = ledger.apply({
        eventId: makeId('review-event'),
        type: 'review-run-completed',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        reviewRunId: state.reviewRunId
      });
      if (!['applied', 'duplicate'].includes(completed.status)) {
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          phase: 'persistence-retry'
        };
        return [{
          type: 'review/persistence-failed',
          operation: 'review-run-completed',
          reason: completed.reason || completed.status
        }];
      }
      state = {
        ...state,
        stateVersion: state.stateVersion + 1,
        status: 'completed',
        phase: 'completed',
        heartsRemaining: null,
        pendingCorrect: null,
        audio: null
      };
      return [{ type: 'review/run-completed', reviewRunId: state.reviewRunId }];
    }

    function commitCorrect({ emitCellCompleted = false } = {}) {
      const outcome = state.rescueUsed || state.supportLevel !== 'none'
        ? 'review-assisted-practice'
        : 'independent-retrieval';
      const applied = applyAttempt(outcome, state.rescueUsed ? 'model' : state.supportLevel);
      if (!applied.run) {
        return [{
          type: 'review/persistence-failed',
          operation: 'review-attempt',
          reason: applied.applied.reason || applied.applied.status
        }];
      }
      const completedCellId = state.currentCell.reviewCellId;
      const effects = emitCellCompleted
        ? [{ type: 'review/cell-completed', reviewCellId: completedCellId, outcome }]
        : [];
      if (state.currentIndex + 1 < plan.length) return [...effects, ...activate(state.currentIndex + 1)];
      return [...effects, ...completeRun()];
    }

    function enter({ reviewRunId } = {}) {
      if (state.status !== 'idle') {
        return publish([{ type: 'review/command-rejected', reason: 'review-already-entered' }]);
      }
      const projection = ledger.read();
      const storedRun = Object.values(projection.reviewRuns || {}).find(run => (
        run.unitId === unit.unitId
          && run.experienceRevision === unit.experienceRevision
          && (!reviewRunId || run.reviewRunId === reviewRunId)
      ));
      if (storedRun) {
        const reviewCells = projection.units?.[unit.unitId]?.reviewCells || {};
        plan = storedRun.reviewCellIds.map(reviewCellId => {
          const cell = reviewCells[reviewCellId];
          return cell ? {
            ...clone(cell),
            mainContextId: cell.contextId,
            reviewContextIds: Object.keys(unit.reviewContexts || {})
          } : null;
        });
        if (plan.some(cell => !cell) || plan.length < 2 || plan.length > 4) {
          state = {
            ...state,
            stateVersion: state.stateVersion + 1,
            status: 'unavailable',
            phase: null
          };
          return publish([{ type: 'review/unavailable', reason: 'review-resume-invalid' }]);
        }
        const firstIncompleteIndex = storedRun.reviewCellIds.findIndex(reviewCellId => (
          !storedRun.temporaryResults?.[reviewCellId]
        ));
        const resumeIndex = firstIncompleteIndex < 0 ? 0 : firstIncompleteIndex;
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          status: 'active',
          reviewRunId: storedRun.reviewRunId,
          attemptRevision: storedRun.attemptRevision || 0,
          cellCount: plan.length,
          estimatedSeconds: Math.min(90, Math.max(45, 30 + (plan.length * 15))),
          heartsRemaining: storedRun.heartsRemaining,
          rescueUsed: storedRun.rescueUsed === true,
          completedReviewCellIds: Object.keys(storedRun.temporaryResults || {})
        };
        const nextEffects = activate(resumeIndex);
        return publish([{
          type: 'review/run-resumed',
          reviewRunId: storedRun.reviewRunId,
          reviewCellIds: [...storedRun.reviewCellIds],
          estimatedSeconds: state.estimatedSeconds,
          heartsRemaining: state.heartsRemaining,
          attemptedAt: currentTime()
        }, ...nextEffects]);
      }
      const selected = ledger.planReview({ unitId: unit.unitId });
      if (!Array.isArray(selected) || selected.length === 0) {
        state = { ...state, stateVersion: state.stateVersion + 1, status: 'empty' };
        return publish([{ type: 'review/empty' }]);
      }
      if (selected.length < 2 || selected.length > 4) {
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          status: 'unavailable',
          phase: null
        };
        return publish([{ type: 'review/unavailable', reason: 'review-plan-size-invalid' }]);
      }
      plan = clone(selected);
      const nextRunId = reviewRunId || makeId('review-run');
      const started = ledger.apply({
        eventId: makeId('review-event'),
        type: 'review-run-started',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        reviewRunId: nextRunId,
        reviewCellIds: plan.map(cell => cell.reviewCellId)
      });
      if (!['applied', 'duplicate'].includes(started.status)) {
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          status: 'save-error',
          phase: null
        };
        return publish([{
          type: 'review/persistence-failed',
          operation: 'review-run-started',
          reason: started.reason || started.status
        }]);
      }
      const startedRun = started.snapshot?.reviewRuns?.[nextRunId]
        || ledger.read()?.reviewRuns?.[nextRunId];
      state = {
        ...state,
        stateVersion: state.stateVersion + 1,
        status: 'active',
        reviewRunId: nextRunId,
        attemptRevision: startedRun?.attemptRevision || 0,
        cellCount: plan.length,
        estimatedSeconds: Math.min(90, Math.max(45, 30 + (plan.length * 15))),
        heartsRemaining: startedRun?.heartsRemaining ?? 3,
        rescueUsed: startedRun?.rescueUsed === true
      };
      const nextEffects = activate(0);
      return publish([{
        type: 'review/run-started',
        reviewRunId: nextRunId,
        reviewCellIds: plan.map(cell => cell.reviewCellId),
        estimatedSeconds: state.estimatedSeconds,
        heartsRemaining: state.heartsRemaining,
        attemptedAt: currentTime()
      }, ...nextEffects]);
    }

    function defer() {
      if (state.status !== 'active') return reject('review-not-active');
      const cancel = state.phase === 'audio-playing'
        ? [{ type: 'audio/cancel', requestId: state.audio.requestId }]
        : [];
      const deferred = ledger.apply({
        eventId: makeId('review-event'),
        type: 'review-run-deferred',
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        reviewRunId: state.reviewRunId
      });
      if (!['applied', 'duplicate'].includes(deferred.status)) {
        return publish([...cancel, {
          type: 'review/persistence-failed',
          operation: 'review-run-deferred',
          reason: deferred.reason || deferred.status
        }]);
      }
      state = {
        ...state,
        stateVersion: state.stateVersion + 1,
        status: 'deferred',
        phase: null,
        heartsRemaining: null,
        pendingCorrect: null,
        audio: null
      };
      return publish([...cancel, { type: 'review/run-deferred', reviewRunId: state.reviewRunId }]);
    }

    function dispatch(action = {}) {
      if (state.status !== 'active') return reject('review-not-active');
      if (action.type === 'audio/play') {
        const invalid = validate(action, { challenge: true });
        if (invalid) return reject(invalid);
        if (state.phase !== 'audio-ready') return reject('audio-not-ready');
        const challenge = challengeFor(state.currentCell);
        const effect = startAudio({
          sequence: challenge.audioSequence,
          purpose: 'prompt',
          after: 'open-response'
        });
        if (!effect) return reject('required-audio-missing');
        return publish([effect]);
      }
      if (action.type === 'audio/ended') {
        const invalid = validate(action, { challenge: true, media: true });
        if (invalid) return reject(invalid);
        if (state.phase !== 'audio-playing') return reject('audio-not-playing');
        const audio = state.audio;
        const nextSegmentIndex = audio.segmentIndex + 1;
        if (nextSegmentIndex < audio.segments.length) {
          const nextAudio = {
            ...audio,
            segmentIndex: nextSegmentIndex,
            segmentId: audio.segments[nextSegmentIndex].segmentId,
            visibleText: audio.segments[nextSegmentIndex].text
          };
          state = {
            ...state,
            stateVersion: state.stateVersion + 1,
            audio: nextAudio
          };
          return publish([audioEffect(nextAudio)]);
        }
        if (audio.after === 'open-response') {
          state = {
            ...state,
            stateVersion: state.stateVersion + 1,
            phase: 'awaiting-response',
            audio: { ...audio, status: 'completed' }
          };
          return publish([{
            type: 'review/response-ready',
            reviewRunId: state.reviewRunId,
            reviewChallengeRef: state.reviewChallengeRef,
            reviewCellId: state.currentCell.reviewCellId
          }]);
        }
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          audio: { ...audio, status: 'completed' },
          pendingCorrect: null
        };
        return publish(commitCorrect({ emitCellCompleted: true }));
      }
      if (action.type === 'audio/failed') {
        const invalid = validate(action, { challenge: true, media: true });
        if (invalid) return reject(invalid);
        if (state.phase !== 'audio-playing') return reject('audio-not-playing');
        if (['cancelled', 'aborted'].includes(action.failureKind)) {
          const cancelledAudio = state.audio;
          state = {
            ...state,
            stateVersion: state.stateVersion + 1,
            phase: 'audio-paused',
            audio: {
              ...cancelledAudio,
              status: 'paused',
              reason: action.failureKind,
              manualRetryRequired: true
            }
          };
          return publish([{
            type: 'review/audio-cancelled',
            requestId: cancelledAudio.requestId,
            segmentId: cancelledAudio.segmentId,
            visibleText: cancelledAudio.visibleText,
            canRetry: true
          }]);
        }
        if (
          action.failureKind === 'transient'
          && state.audio.retryAttempt < state.audio.automaticRetryDelaysMs.length
        ) {
          return publish([retryAudio({ manual: false })]);
        }
        const audio = state.audio;
        const failed = applyAttempt('audio-failure', 'none');
        if (!failed.run) {
          return publish([{
            type: 'review/persistence-failed',
            operation: 'review-audio-failure',
            reason: failed.applied.reason || failed.applied.status
          }]);
        }
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          phase: 'audio-failed',
          audio: {
            ...audio,
            status: 'failed',
            reason: action.reason || action.failureKind || 'unavailable',
            manualRetryRequired: true
          }
        };
        return publish([{
          type: 'review/audio-failure',
          requestId: audio.requestId,
          segmentId: audio.segmentId,
          visibleText: audio.visibleText,
          reason: state.audio.reason,
          failClosed: true,
          canRetry: true
        }]);
      }
      if (action.type === 'audio/retry') {
        const invalid = validate(action, { challenge: true });
        if (invalid) return reject(invalid);
        if (!['audio-failed', 'audio-paused'].includes(state.phase)
          || !state.audio?.manualRetryRequired) {
          return reject('manual-audio-retry-not-available');
        }
        return publish([retryAudio({
          manual: state.phase === 'audio-failed',
          preserveAttempt: state.phase === 'audio-paused'
        })]);
      }
      if (action.type === 'response/submit') {
        const invalid = validate(action, { challenge: true });
        if (invalid) return reject(invalid);
        if (state.phase !== 'awaiting-response') return reject('response-not-ready');
        const challenge = challengeFor(state.currentCell);
        const evaluated = evaluateRule(challenge.answerRule, action.response);
        if (!evaluated.correct) {
          const supportLayers = challenge.supportLayers || [];
          const runBefore = ledger.read()?.reviewRuns?.[state.reviewRunId];
          const priorErrors = runBefore?.errorsByCell?.[state.currentCell.reviewCellId] || 0;
          const support = supportLayers[Math.min(priorErrors, Math.max(0, supportLayers.length - 1))]
            || { level: priorErrors === 0 ? 'reobserve' : 'partial-cue', copy: null };
          const failed = applyAttempt('failed', support.level);
          if (!failed.run) {
            return publish([{
              type: 'review/persistence-failed',
              operation: 'review-attempt',
              reason: failed.applied.reason || failed.applied.status
            }]);
          }
          const restarted = failed.applied.effects?.some(effect => (
            effect.type === 'review-run-restarted'
          ));
          if (restarted) {
            state = {
              ...state,
              stateVersion: state.stateVersion + 1,
              phase: 'rescue-model',
              heartsRemaining: 0,
              supportLevel: 'model',
              rescueUsed: true,
              completedReviewCellIds: [],
              pendingCorrect: null,
              audio: null
            };
            return publish([{
              type: 'review/feedback-incorrect',
              reviewCellId: state.currentCell.reviewCellId,
              mismatchPath: clone(evaluated.mismatchPath)
            }, {
              type: 'review/heart-lost', heartsRemaining: 0
            }, {
              type: 'review/rescue-model',
              reviewRunId: state.reviewRunId,
              reviewChallengeRef: state.reviewChallengeRef,
              contextId: state.currentContext.contextId,
              changedExample: true,
              revealsCurrentAnswer: false,
              copy: supportLayers.at(-1)?.copy || null
            }]);
          }
          state = {
            ...state,
            stateVersion: state.stateVersion + 1,
            phase: 'supporting',
            supportLevel: support.level
          };
          return publish([{
            type: 'review/feedback-incorrect',
            reviewCellId: state.currentCell.reviewCellId,
            mismatchPath: clone(evaluated.mismatchPath)
          }, {
            type: 'review/heart-lost', heartsRemaining: state.heartsRemaining
          }, {
            type: 'review/support',
            supportLevel: support.level,
            copy: support.copy || null,
            revealsAnswer: false
          }]);
        }
        const outcome = state.rescueUsed || state.supportLevel !== 'none'
          ? 'review-assisted-practice'
          : 'independent-retrieval';
        const effects = [{
          type: 'review/feedback-correct',
          reviewCellId: state.currentCell.reviewCellId,
          outcome
        }];
        if (challenge.feedbackAudioSequence) {
          state = {
            ...state,
            pendingCorrect: {
              reviewCellId: state.currentCell.reviewCellId,
              outcome,
              supportLevel: state.supportLevel
            }
          };
          const audio = startAudio({
            sequence: challenge.feedbackAudioSequence,
            purpose: 'correct-feedback',
            after: 'commit-correct'
          });
          if (!audio) {
            state = { ...state, pendingCorrect: null };
            return publish([...effects, {
              type: 'review/command-rejected',
              reason: 'required-audio-missing',
              experienceRevision: unit.experienceRevision,
              stateVersion: state.stateVersion,
              reviewRunId: state.reviewRunId,
              reviewChallengeRef: state.reviewChallengeRef
            }]);
          }
          return publish([...effects, audio]);
        }
        return publish([...effects, ...commitCorrect()]);
      }
      if (action.type === 'support/ended') {
        const invalid = validate(action, { challenge: true });
        if (invalid) return reject(invalid);
        if (state.phase !== 'supporting') return reject('support-not-active');
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          phase: 'awaiting-response'
        };
        return publish([{
          type: 'review/response-ready',
          reviewRunId: state.reviewRunId,
          reviewChallengeRef: state.reviewChallengeRef,
          reviewCellId: state.currentCell.reviewCellId,
          supportLevel: state.supportLevel
        }]);
      }
      if (action.type === 'rescue/model-ended') {
        const invalid = validate(action, { challenge: true });
        if (invalid) return reject(invalid);
        if (state.phase !== 'rescue-model') return reject('rescue-model-not-active');
        const run = ledger.read()?.reviewRuns?.[state.reviewRunId];
        if (!run || run.attemptRevision <= state.attemptRevision) {
          return reject('review-restart-not-persisted');
        }
        const priorRevision = state.attemptRevision;
        state = {
          ...state,
          stateVersion: state.stateVersion + 1,
          attemptRevision: run.attemptRevision,
          heartsRemaining: 3,
          rescueUsed: true,
          completedReviewCellIds: [],
          pendingCorrect: null,
          audio: null
        };
        const next = activate(0);
        return publish([{
          type: 'review/temporary-cleared', reviewRunId: state.reviewRunId
        }, {
          type: 'review/attempt-revision-changed',
          from: priorRevision,
          to: state.attemptRevision
        }, {
          type: 'review/hearts-refilled', heartsRemaining: 3
        }, {
          type: 'review/run-restarted',
          reviewRunId: state.reviewRunId,
          attemptRevision: state.attemptRevision
        }, ...next]);
      }
      return reject('command-not-allowed');
    }

    return Object.freeze({ enter, defer, dispatch, snapshot });
  }

  return Object.freeze({ create, evaluateRule });
});
