(function attachLearningOutcomePractice(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningOutcomePractice = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningOutcomePracticeFactory() {
  'use strict';

  const FORBIDDEN_MAINLINE_FIELD = /(?:result|challenge|reviewcell|evidence|heart|landmark|schedul|nextdue|mastery|checkpoint|storyfact|completionstatus|progress|microtask|beatid|ledger|store|outbox|pendingcommit)/i;
  const ALLOWED_ROOT_NO_PROGRESS_FIELDS = new Set([
    'countsTowardProgress', 'producesLearningEvidence', 'affectsAdventureHearts'
  ]);
  const ROLE_KINDS = new Set(['role-swap', 'role-enactment']);

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
  }

  function nonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function findForbiddenFields(value, errors, path = 'config', seen = new Set()) {
    if (!value || typeof value !== 'object') return;
    if (seen.has(value)) {
      errors.push(`${path} must not contain circular references`);
      return;
    }
    seen.add(value);
    for (const [field, child] of Object.entries(value)) {
      const allowedAvailabilityBuildStage = field === 'buildStage' && path === 'config.availableAt';
      const allowedNoProgressDeclaration = path === 'config'
        && ALLOWED_ROOT_NO_PROGRESS_FIELDS.has(field)
        && child === false;
      if (!allowedAvailabilityBuildStage
        && !allowedNoProgressDeclaration
        && (field === 'buildStage' || FORBIDDEN_MAINLINE_FIELD.test(field))) {
        errors.push(`forbidden mainline field ${field} at ${path}.${field}`);
      }
      findForbiddenFields(child, errors, `${path}.${field}`, seen);
    }
    seen.delete(value);
  }

  function validateStringRefs(values, path, errors, { min = 0, max = Infinity } = {}) {
    if (!Array.isArray(values)) {
      errors.push(`${path} must be an array`);
      return new Set();
    }
    if (values.length < min || values.length > max) {
      errors.push(`${path} must contain ${min}${max === Infinity ? ' or more' : `–${max}`} refs`);
    }
    const refs = new Set();
    values.forEach((value, index) => {
      if (!nonEmptyString(value)) errors.push(`${path}[${index}] must be a non-empty string`);
      if (refs.has(value)) errors.push(`${path} has duplicate ref ${value}`);
      refs.add(value);
    });
    return refs;
  }

  function optionResponse(option) {
    if (!option || typeof option !== 'object' || Array.isArray(option)) return null;
    const response = {};
    for (const field of ['entityId', 'sourceRef', 'contentRef']) {
      if (nonEmptyString(option[field])) response[field] = option[field];
    }
    return response;
  }

  function optionMatchesSelectOne(rule, option) {
    const response = optionResponse(option);
    if (!response) return false;
    if (nonEmptyString(rule.acceptedEntityId)) return response.entityId === rule.acceptedEntityId;
    if (Array.isArray(rule.acceptedEntityIds)) return rule.acceptedEntityIds.includes(response.entityId);
    if (nonEmptyString(rule.acceptedSourceRef)) return response.sourceRef === rule.acceptedSourceRef;
    if (nonEmptyString(rule.acceptedContentRef)) return response.contentRef === rule.acceptedContentRef;
    return false;
  }

  function validateAvailability(availableAt, errors) {
    if (!availableAt || typeof availableAt !== 'object' || Array.isArray(availableAt)) {
      errors.push('availableAt must declare outcomeNodeId, status, and buildStage');
      return;
    }
    if (!nonEmptyString(availableAt.outcomeNodeId)
      || !nonEmptyString(availableAt.status)
      || !Number.isInteger(availableAt.buildStage)
      || availableAt.buildStage < 0) {
      errors.push('availableAt must declare outcomeNodeId, status, and buildStage');
    }
  }

  function validateRoleRounds(config, errors) {
    if (!Array.isArray(config.rounds) || config.rounds.length !== 2) {
      errors.push(`${config.kind} must declare exactly two ${config.kind} rounds`);
      return;
    }
    const roundIds = new Set();
    config.rounds.forEach((round, index) => {
      const path = `rounds[${index}]`;
      if (!round || typeof round !== 'object' || Array.isArray(round)) {
        errors.push(`${path} must be an object`);
        return;
      }
      if (!nonEmptyString(round.roundId)) errors.push(`${path}.roundId must be a non-empty string`);
      if (roundIds.has(round.roundId)) errors.push(`duplicate roundId ${round.roundId}`);
      roundIds.add(round.roundId);
      if (!nonEmptyString(round.roleEntityId)) errors.push(`${path}.roleEntityId must be a non-empty string`);
      if (!nonEmptyString(round.partnerEntityId)) errors.push(`${path}.partnerEntityId must be a non-empty string`);
      const dialogue = validateStringRefs(round.dialogueTurnRefs, `${path}.dialogueTurnRefs`, errors, {
        min: config.kind === 'role-enactment' ? 7 : 2,
        max: config.kind === 'role-enactment' ? 7 : Infinity
      });
      const hidden = validateStringRefs(round.hiddenTurnRefs, `${path}.hiddenTurnRefs`, errors, {
        min: 1,
        max: config.kind === 'role-enactment' ? 4 : 3
      });
      const partner = validateStringRefs(round.partnerTurnRefs, `${path}.partnerTurnRefs`, errors, { min: 1 });
      for (const ref of hidden) {
        if (!dialogue.has(ref)) errors.push(`${path} hidden turn ${ref} is outside dialogueTurnRefs`);
        if (partner.has(ref)) errors.push(`${path} turn ${ref} cannot be both hidden and partner`);
      }
      for (const ref of partner) {
        if (!dialogue.has(ref)) errors.push(`${path} partner turn ${ref} is outside dialogueTurnRefs`);
      }
      for (const ref of dialogue) {
        if (!hidden.has(ref) && !partner.has(ref)) {
          errors.push(`${path} dialogue turn ${ref} must be hidden or partner`);
        }
      }
    });
  }

  function validateManualDialogue(config, errors) {
    validateAvailability(config.availableAt, errors);
    if (!nonEmptyString(config.unlockAfterStageId)) {
      errors.push('manual-dialogue must declare unlockAfterStageId');
    }
    if (config.countsTowardProgress !== false
      || config.producesLearningEvidence !== false
      || config.affectsAdventureHearts !== false) {
      errors.push('manual-dialogue must explicitly remain no-progress, no-evidence, and no-hearts');
    }
    const dialogue = validateStringRefs(
      config.dialogueTurnRefs,
      'dialogueTurnRefs',
      errors,
      { min: 7, max: 7 }
    );
    if (!Array.isArray(config.turnHints) || config.turnHints.length !== dialogue.size) {
      errors.push('manual-dialogue must declare one two-level hint for every dialogue turn');
      return;
    }
    const hintRefs = new Set();
    for (const [index, hint] of config.turnHints.entries()) {
      const path = `turnHints[${index}]`;
      if (!hint || !dialogue.has(hint.turnRef)
        || !nonEmptyString(hint.intent) || !nonEmptyString(hint.openingChunk)) {
        errors.push(`${path} must declare turnRef, intent, and openingChunk`);
        continue;
      }
      if (hintRefs.has(hint.turnRef)) errors.push(`${path} duplicates ${hint.turnRef}`);
      hintRefs.add(hint.turnRef);
    }
  }

  function validateCaseRecap(config, errors) {
    validateAvailability(config.availableAt, errors);
    if (config.diagnosticKind !== 'same-day-practice') {
      errors.push('case-recap diagnosticKind may only be same-day-practice');
    }
    if (!Array.isArray(config.items) || config.items.length !== 3) {
      errors.push('case-recap must declare exactly three recap items');
      return;
    }
    const itemIds = new Set();
    config.items.forEach((item, index) => {
      const path = `items[${index}]`;
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errors.push(`${path} must be an object`);
        return;
      }
      if (!nonEmptyString(item.itemId)) errors.push(`${path}.itemId must be a non-empty string`);
      if (itemIds.has(item.itemId)) errors.push(`duplicate itemId ${item.itemId}`);
      itemIds.add(item.itemId);
      if (!nonEmptyString(item.correctAudioRef)) errors.push(`${path}.correctAudioRef must be a non-empty string`);
      if (!Array.isArray(item.options) || item.options.length < 2) {
        errors.push(`${path} must declare at least two stable options`);
        return;
      }
      const optionIds = new Set();
      item.options.forEach((option, optionIndex) => {
        if (!option || typeof option !== 'object' || !nonEmptyString(option.optionId)) {
          errors.push(`${path}.options[${optionIndex}] must declare stable optionId`);
          return;
        }
        if (optionIds.has(option.optionId)) errors.push(`duplicate optionId ${option.optionId} in ${item.itemId}`);
        optionIds.add(option.optionId);
        if (Object.keys(optionResponse(option)).length !== 1) {
          errors.push(`${path}.options[${optionIndex}] must map optionId to exactly one response field`);
        }
      });
      if (!item.answerRule || item.answerRule.type !== 'select-one') {
        errors.push(`${path}.answerRule must use existing select-one semantics`);
      } else if (!item.options.some(option => optionMatchesSelectOne(item.answerRule, option))) {
        errors.push(`${path}.answerRule must accept one declared option response`);
      }
    });
  }

  function validateConfig(config) {
    const errors = [];
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      return ['config must be an object'];
    }
    findForbiddenFields(config, errors);
    if (!nonEmptyString(config.practiceId)) errors.push('practiceId must be a non-empty string');
    if (!['role-swap', 'role-enactment', 'manual-dialogue', 'case-recap'].includes(config.kind)) {
      errors.push('kind must be role-swap, role-enactment, manual-dialogue, or case-recap');
      return errors;
    }
    if (config.kind === 'role-swap') validateAvailability(config.availableAt, errors);
    if (ROLE_KINDS.has(config.kind)) validateRoleRounds(config, errors);
    if (config.kind === 'manual-dialogue') validateManualDialogue(config, errors);
    if (config.kind === 'case-recap') validateCaseRecap(config, errors);
    return errors;
  }

  function create(sourceConfig, { evaluateRule, saveRound } = {}) {
    const errors = validateConfig(sourceConfig);
    if (errors.length > 0) throw new TypeError(errors.join('; '));
    if (sourceConfig.kind === 'case-recap' && typeof evaluateRule !== 'function') {
      throw new TypeError('case-recap requires the main learning-runtime evaluateRule');
    }
    if (sourceConfig.kind === 'role-enactment' && typeof saveRound !== 'function') {
      throw new TypeError('role-enactment requires a whole-round save callback');
    }
    const config = deepFreeze(clone(sourceConfig));
    let stateVersion = 0;
    let sessionOrdinal = 0;
    let audioOrdinal = 0;
    let destroyed = false;
    let state = emptyState('idle');

    function emptyState(status) {
      return {
        stateVersion,
        status,
        practiceId: null,
        practiceSessionId: null,
        kind: null,
        diagnosticKind: null,
        phase: null,
        currentIndex: null,
        currentRound: null,
        currentTurnIndex: null,
        currentTurn: null,
        currentItem: null,
        completedRoundIds: [],
        pendingRoundId: null,
        revealedTurnRefs: [],
        hintLevel: 0,
        currentHint: null,
        correctItemIds: [],
        attemptsByItemId: {},
        lastResponse: null,
        pendingCorrectItemId: null,
        audio: null
      };
    }

    function bump() {
      stateVersion += 1;
      state = { ...state, stateVersion };
    }

    function snapshot() {
      return deepFreeze(clone(state));
    }

    function reject(reason) {
      return deepFreeze([{ type: 'practice/command-rejected', reason }]);
    }

    function publicItem(item) {
      const visible = clone(item);
      delete visible.answerRule;
      return visible;
    }

    function audioPlay(audioRef, purpose, extra = {}) {
      audioOrdinal += 1;
      const audio = {
        status: 'playing',
        practiceSessionId: state.practiceSessionId,
        stateVersion: state.stateVersion,
        requestId: `${state.practiceSessionId}:A${audioOrdinal}`,
        segmentId: `${state.practiceSessionId}:SEG${audioOrdinal}`,
        audioRef,
        purpose,
        ...clone(extra)
      };
      state = { ...state, phase: 'audio-playing', audio };
      return { type: 'practice/audio-play', ...audio };
    }

    function activateRoleTurn(round, turnIndex) {
      const turnRef = round.dialogueTurnRefs[turnIndex];
      const role = round.hiddenTurnRefs.includes(turnRef) ? 'child' : 'partner';
      const currentTurn = {
        turnRef,
        role,
        speakerEntityId: role === 'child' ? round.roleEntityId : round.partnerEntityId,
        visibility: role === 'child' ? 'hidden' : 'visible'
      };
      state = {
        ...state,
        currentTurnIndex: turnIndex,
        currentTurn,
        phase: role === 'child' ? 'awaiting-reveal' : 'audio-playing',
        hintLevel: 0,
        currentHint: null,
        audio: null
      };
      const effects = [{
        type: 'practice/turn-ready',
        roundId: round.roundId,
        turnRef,
        role,
        visibility: currentTurn.visibility
      }];
      if (role === 'partner') effects.push(audioPlay(turnRef, 'partner-turn'));
      return effects;
    }

    function manualSpeakerEntityId(turnIndex) {
      const explicit = config.turnSpeakerEntityIds?.[turnIndex];
      if (nonEmptyString(explicit)) return explicit;
      return config.castOrder?.[turnIndex % 2] || null;
    }

    function activateManualTurn(turnIndex) {
      const turnRef = config.dialogueTurnRefs[turnIndex];
      state = {
        ...state,
        currentIndex: turnIndex,
        currentTurnIndex: turnIndex,
        currentTurn: {
          turnRef,
          role: 'shared',
          speakerEntityId: manualSpeakerEntityId(turnIndex),
          visibility: 'hidden'
        },
        phase: 'awaiting-manual-reveal',
        hintLevel: 0,
        currentHint: null,
        audio: null
      };
      return [{
        type: 'practice/turn-ready',
        turnRef,
        role: 'shared',
        visibility: 'hidden'
      }];
    }

    function originAvailable(origin) {
      const expected = config.availableAt;
      return origin && expected
        && origin.outcomeNodeId === expected.outcomeNodeId
        && origin.status === expected.status
        && origin.buildStage === expected.buildStage;
    }

    function completedRoleIds(origin) {
      const allowed = new Set((config.rounds || []).map(round => round.roundId));
      return [...new Set((Array.isArray(origin?.completedRoundIds) ? origin.completedRoundIds : [])
        .filter(roundId => allowed.has(roundId)))];
    }

    function enter(origin) {
      if (destroyed) return reject('practice-destroyed');
      if (state.status === 'active') return reject('practice-already-active');
      if (config.kind !== 'role-enactment' && !originAvailable(origin)) {
        return reject('practice-origin-not-available');
      }
      sessionOrdinal += 1;
      audioOrdinal = 0;
      bump();
      const completedRoundIds = config.kind === 'role-enactment' ? completedRoleIds(origin) : [];
      const roleEnactmentComplete = config.kind === 'role-enactment'
        && completedRoundIds.length === config.rounds.length;
      state = {
        ...emptyState('active'),
        stateVersion,
        practiceId: config.practiceId,
        practiceSessionId: `${config.practiceId}:S${sessionOrdinal}`,
        kind: config.kind,
        diagnosticKind: config.kind === 'case-recap' ? config.diagnosticKind : null,
        currentIndex: config.kind === 'role-swap' || config.kind === 'case-recap' ? 0 : null,
        currentRound: config.kind === 'role-swap' ? clone(config.rounds[0]) : null,
        currentItem: config.kind === 'case-recap' ? publicItem(config.items[0]) : null,
        completedRoundIds,
        phase: config.kind === 'role-swap'
          ? 'awaiting-reveal'
          : (config.kind === 'case-recap'
              ? 'awaiting-response'
              : (config.kind === 'manual-dialogue'
                  ? 'awaiting-manual-reveal'
                  : (roleEnactmentComplete ? 'all-roles-complete' : 'role-selection')))
      };
      const entryId = config.kind === 'role-swap'
        ? config.rounds[0].roundId
        : (config.kind === 'case-recap'
            ? config.items[0].itemId
            : (config.kind === 'manual-dialogue' ? config.dialogueTurnRefs[0] : null));
      const effects = [{
        type: 'practice/entered',
        practiceId: config.practiceId,
        practiceSessionId: state.practiceSessionId,
        kind: config.kind,
        entryId
      }];
      if (config.kind === 'role-swap') effects.push(...activateRoleTurn(config.rounds[0], 0));
      if (config.kind === 'manual-dialogue') effects.push(...activateManualTurn(0));
      return deepFreeze(effects);
    }

    function selectRole(roundId) {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (config.kind !== 'role-enactment') return reject('command-not-allowed');
      if (state.phase !== 'role-selection') return reject('role-selection-not-open');
      const round = config.rounds.find(candidate => candidate.roundId === roundId);
      if (!round) return reject('unknown-role-round');
      if (state.completedRoundIds.includes(roundId)) return reject('role-already-complete');
      bump();
      state = {
        ...state,
        currentIndex: config.rounds.indexOf(round),
        currentRound: clone(round),
        currentTurnIndex: null,
        currentTurn: null,
        revealedTurnRefs: [],
        pendingRoundId: null
      };
      return deepFreeze([{
        type: 'practice/role-selected',
        roundId,
        roleEntityId: round.roleEntityId
      }, ...activateRoleTurn(round, 0)]);
    }

    function reveal() {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      const roleReveal = ROLE_KINDS.has(config.kind) && state.phase === 'awaiting-reveal';
      const manualReveal = config.kind === 'manual-dialogue'
        && state.phase === 'awaiting-manual-reveal';
      if (!roleReveal && !manualReveal) return reject('turn-not-awaiting-reveal');
      const turnRef = state.currentTurn.turnRef;
      bump();
      state = {
        ...state,
        currentTurn: { ...state.currentTurn, visibility: 'visible' },
        revealedTurnRefs: state.revealedTurnRefs.includes(turnRef)
          ? state.revealedTurnRefs
          : [...state.revealedTurnRefs, turnRef]
      };
      return deepFreeze([{
        type: 'practice/turn-revealed',
        ...(state.currentRound ? { roundId: state.currentRound.roundId } : {}),
        turnRef
      }, audioPlay(turnRef, manualReveal ? 'manual-revealed-turn' : 'revealed-child-turn')]);
    }

    function showHint() {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (config.kind !== 'manual-dialogue' || state.phase !== 'awaiting-manual-reveal') {
        return reject('hint-not-available');
      }
      const authoredHint = config.turnHints.find(hint => hint.turnRef === state.currentTurn.turnRef);
      const hintLevel = Math.min(2, state.hintLevel + 1);
      bump();
      state = {
        ...state,
        hintLevel,
        currentHint: {
          turnRef: authoredHint.turnRef,
          intent: authoredHint.intent,
          openingChunk: hintLevel >= 2 ? authoredHint.openingChunk : null
        }
      };
      return deepFreeze([{
        type: 'practice/hint-shown',
        turnRef: authoredHint.turnRef,
        hintLevel,
        hint: clone(state.currentHint)
      }]);
    }

    function replayLine(turnRef) {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (config.kind !== 'manual-dialogue') return reject('command-not-allowed');
      if (!['awaiting-manual-reveal', 'manual-complete'].includes(state.phase)) {
        return reject('line-replay-not-available');
      }
      if (!state.revealedTurnRefs.includes(turnRef)) return reject('line-not-revealed');
      const resumePhase = state.phase;
      bump();
      return deepFreeze([audioPlay(turnRef, 'replay-revealed-turn', { resumePhase })]);
    }

    function submit(optionId) {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (config.kind !== 'case-recap') return reject('command-not-allowed');
      if (state.phase !== 'awaiting-response') return reject('item-not-awaiting-response');
      const item = config.items[state.currentIndex];
      const option = item.options.find(candidate => candidate.optionId === optionId);
      if (!option) return reject('unknown-option-id');
      const evaluated = evaluateRule(item.answerRule, optionResponse(option));
      const correct = evaluated?.correct === true;
      const attempt = (state.attemptsByItemId[item.itemId] || 0) + 1;
      bump();
      state = {
        ...state,
        attemptsByItemId: { ...state.attemptsByItemId, [item.itemId]: attempt },
        lastResponse: { itemId: item.itemId, optionId, correct, attempt },
        pendingCorrectItemId: correct ? item.itemId : null,
        phase: correct ? 'audio-playing' : 'awaiting-response'
      };
      const effects = [{
        type: 'practice/answer-checked', itemId: item.itemId, optionId, correct, attempt
      }];
      if (correct) effects.push(audioPlay(item.correctAudioRef, 'correct-answer'));
      return deepFreeze(effects);
    }

    function validateAudioAction(action) {
      const audio = state.audio;
      if (!audio
        || action.practiceSessionId !== audio.practiceSessionId
        || action.stateVersion !== audio.stateVersion
        || action.requestId !== audio.requestId
        || action.segmentId !== audio.segmentId) {
        return 'stale-audio-event';
      }
      return null;
    }

    function saveCompletedRound(roundId) {
      let saved;
      try {
        saved = saveRound({ practiceId: config.practiceId, roundId });
      } catch (error) {
        saved = { persisted: false, reason: error?.message || 'save-failed' };
      }
      if (saved?.persisted !== true) {
        state = { ...state, phase: 'round-save-failed', pendingRoundId: roundId };
        return [{
          type: 'practice/round-save-failed',
          roundId,
          reason: saved?.reason || saved?.status || 'unavailable',
          retryable: true
        }];
      }
      const completedRoundIds = state.completedRoundIds.includes(roundId)
        ? state.completedRoundIds
        : [...state.completedRoundIds, roundId];
      const allComplete = completedRoundIds.length === config.rounds.length;
      state = {
        ...state,
        completedRoundIds,
        pendingRoundId: null,
        currentRound: null,
        currentTurnIndex: null,
        currentTurn: null,
        currentIndex: null,
        phase: allComplete ? 'all-roles-complete' : 'role-selection'
      };
      return [{
        type: 'practice/round-saved',
        roundId,
        completedRoundIds: clone(completedRoundIds),
        allRolesComplete: allComplete
      }];
    }

    function retryRoundSave() {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (config.kind !== 'role-enactment' || state.phase !== 'round-save-failed') {
        return reject('round-save-retry-not-required');
      }
      bump();
      return deepFreeze(saveCompletedRound(state.pendingRoundId));
    }

    function audioEnded(action) {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (state.phase !== 'audio-playing') return reject('audio-not-playing');
      const invalid = validateAudioAction(action);
      if (invalid) return reject(invalid);
      const ended = state.audio;
      bump();
      state = { ...state, audio: null };
      const effects = [{
        type: 'practice/audio-ended',
        practiceSessionId: ended.practiceSessionId,
        requestId: ended.requestId,
        segmentId: ended.segmentId,
        audioRef: ended.audioRef
      }];
      if (ended.purpose === 'replay-revealed-turn') {
        state = { ...state, phase: ended.resumePhase || 'awaiting-manual-reveal' };
        return deepFreeze(effects);
      }
      if (config.kind === 'case-recap') {
        const itemId = state.pendingCorrectItemId;
        state = {
          ...state,
          phase: 'answered',
          pendingCorrectItemId: null,
          correctItemIds: [...state.correctItemIds, itemId]
        };
        effects.push({ type: 'practice/item-answered', itemId });
        return deepFreeze(effects);
      }
      if (config.kind === 'manual-dialogue') {
        const nextTurnIndex = state.currentTurnIndex + 1;
        if (nextTurnIndex >= config.dialogueTurnRefs.length) {
          state = { ...state, phase: 'manual-complete', currentTurn: null, currentTurnIndex: null };
          effects.push({ type: 'practice/manual-complete' });
        } else {
          effects.push(...activateManualTurn(nextTurnIndex));
        }
        return deepFreeze(effects);
      }
      const nextTurnIndex = state.currentTurnIndex + 1;
      if (nextTurnIndex >= state.currentRound.dialogueTurnRefs.length) {
        const roundId = state.currentRound.roundId;
        if (config.kind === 'role-enactment') {
          effects.push({ type: 'practice/round-complete', roundId });
          effects.push(...saveCompletedRound(roundId));
        } else {
          state = { ...state, phase: 'round-complete' };
          effects.push({ type: 'practice/round-complete', roundId });
        }
      } else {
        effects.push(...activateRoleTurn(state.currentRound, nextTurnIndex));
      }
      return deepFreeze(effects);
    }

    function audioFailed(action) {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (state.phase !== 'audio-playing') return reject('audio-not-playing');
      const invalid = validateAudioAction(action);
      if (invalid) return reject(invalid);
      bump();
      state = {
        ...state,
        phase: 'audio-retry',
        audio: { ...state.audio, status: 'retry', failureReason: action.reason || 'unknown' }
      };
      return deepFreeze([{
        type: 'practice/audio-retry-visible',
        practiceSessionId: state.practiceSessionId,
        stateVersion: state.stateVersion,
        requestId: state.audio.requestId,
        segmentId: state.audio.segmentId,
        audioRef: state.audio.audioRef,
        reason: state.audio.failureReason
      }]);
    }

    function retryAudio(action) {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (state.phase !== 'audio-retry') return reject('audio-retry-not-visible');
      if (
        action.practiceSessionId !== state.practiceSessionId
        || action.stateVersion !== state.stateVersion
        || action.requestId !== state.audio?.requestId
        || action.segmentId !== state.audio?.segmentId
      ) {
        return reject('stale-audio-retry');
      }
      const { audioRef, purpose, resumePhase } = state.audio;
      bump();
      return deepFreeze([audioPlay(audioRef, purpose, { resumePhase })]);
    }

    function next() {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (config.kind === 'role-enactment' || config.kind === 'manual-dialogue') {
        return reject('command-not-allowed');
      }
      const ready = config.kind === 'role-swap'
        ? state.phase === 'round-complete'
        : state.phase === 'answered';
      if (!ready) {
        if (config.kind === 'case-recap' && ['audio-playing', 'audio-retry'].includes(state.phase)) {
          return reject('item-audio-not-ended');
        }
        return reject(config.kind === 'role-swap' ? 'round-not-complete' : 'item-not-answered');
      }
      const entries = config.kind === 'role-swap' ? config.rounds : config.items;
      if (state.currentIndex >= entries.length - 1) return reject('last-entry-requires-finish');
      bump();
      const currentIndex = state.currentIndex + 1;
      const entry = entries[currentIndex];
      state = {
        ...state,
        currentIndex,
        currentRound: config.kind === 'role-swap' ? clone(entry) : null,
        currentTurnIndex: null,
        currentTurn: null,
        currentItem: config.kind === 'case-recap' ? publicItem(entry) : null,
        phase: config.kind === 'role-swap' ? 'awaiting-reveal' : 'awaiting-response',
        lastResponse: null,
        pendingCorrectItemId: null,
        audio: null
      };
      const effects = [{
        type: 'practice/entry-advanced',
        practiceId: config.practiceId,
        entryId: config.kind === 'role-swap' ? entry.roundId : entry.itemId,
        currentIndex
      }];
      if (config.kind === 'role-swap') effects.push(...activateRoleTurn(entry, 0));
      return deepFreeze(effects);
    }

    function restartManual() {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      if (config.kind !== 'manual-dialogue') return reject('command-not-allowed');
      if (state.phase === 'audio-playing' || state.phase === 'audio-retry') {
        return reject('audio-still-active');
      }
      bump();
      state = {
        ...state,
        revealedTurnRefs: [],
        hintLevel: 0,
        currentHint: null,
        audio: null
      };
      return deepFreeze([{
        type: 'practice/manual-restarted',
        practiceId: config.practiceId
      }, ...activateManualTurn(0)]);
    }

    function finish() {
      if (destroyed) return reject('practice-destroyed');
      if (state.status !== 'active') return reject('practice-not-active');
      let ready = false;
      if (config.kind === 'role-swap') {
        ready = state.phase === 'round-complete' && state.currentIndex === config.rounds.length - 1;
      } else if (config.kind === 'role-enactment') {
        ready = state.phase === 'all-roles-complete';
      } else if (config.kind === 'manual-dialogue') {
        ready = state.phase === 'manual-complete';
      } else {
        ready = state.phase === 'answered' && state.currentIndex === config.items.length - 1;
      }
      if (!ready) {
        if (config.kind === 'case-recap' && ['audio-playing', 'audio-retry'].includes(state.phase)) {
          return reject('item-audio-not-ended');
        }
        return reject('practice-not-complete');
      }
      bump();
      state = { ...state, status: 'finished', phase: 'finished' };
      return deepFreeze([{
        type: 'practice/finished',
        practiceId: config.practiceId,
        practiceSessionId: state.practiceSessionId,
        kind: config.kind
      }]);
    }

    function cancelEffect() {
      return state.audio ? {
        type: 'practice/audio-cancel',
        practiceSessionId: state.practiceSessionId,
        stateVersion: state.audio.stateVersion,
        requestId: state.audio.requestId,
        segmentId: state.audio.segmentId
      } : null;
    }

    function exit() {
      if (destroyed) return reject('practice-destroyed');
      const cancel = cancelEffect();
      bump();
      state = { ...emptyState('idle'), stateVersion };
      return deepFreeze([
        ...(cancel ? [cancel] : []),
        { type: 'practice/exited', practiceId: config.practiceId }
      ]);
    }

    function destroy() {
      const cancel = cancelEffect();
      if (!destroyed) bump();
      destroyed = true;
      state = { ...emptyState('destroyed'), stateVersion };
      return deepFreeze([
        ...(cancel ? [cancel] : []),
        { type: 'practice/destroyed', practiceId: config.practiceId }
      ]);
    }

    function dispatch(action = {}) {
      if (['enter', 'practice/enter'].includes(action.type)) return enter(action.origin);
      if (action.type === 'role/select') return selectRole(action.roundId);
      if (['reveal', 'role-swap/reveal', 'manual-dialogue/reveal'].includes(action.type)) return reveal();
      if (action.type === 'hint/show') return showHint();
      if (action.type === 'line/replay') return replayLine(action.turnRef);
      if (action.type === 'role/save-retry') return retryRoundSave();
      if (['submit', 'response/submit', 'case-recap/submit'].includes(action.type)) {
        return submit(action.optionId);
      }
      if (action.type === 'audio/ended') return audioEnded(action);
      if (action.type === 'audio/failed') return audioFailed(action);
      if (action.type === 'audio/retry') return retryAudio(action);
      if (['next', 'practice/next'].includes(action.type)) return next();
      if (['manual/restart', 'practice/restart'].includes(action.type)) return restartManual();
      if (['finish', 'practice/finish'].includes(action.type)) return finish();
      if (['exit', 'practice/exit'].includes(action.type)) return exit();
      if (['destroy', 'practice/destroy'].includes(action.type)) return destroy();
      return reject('command-not-allowed');
    }

    return Object.freeze({
      enter, reveal, submit, next, finish, exit, destroy, dispatch, snapshot
    });
  }

  return Object.freeze({ create, validateConfig });
});
