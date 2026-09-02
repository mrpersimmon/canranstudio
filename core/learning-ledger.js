(function attachLearningLedger(root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.CanranCore = root.CanranCore || {};
    root.CanranCore.learningLedger = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function learningLedgerFactory() {
  'use strict';

  const SCHEMA_VERSION = 1;
  const PROCESSED_EVENT_LIMIT = 256;
  const REVIEW_OUTCOMES = new Set(['independent', 'supported', 'failed']);
  const FORMATIVE_OUTCOMES = new Set(['practice-only', 'independent', 'supported', 'failed']);
  const MICROTASK_OUTCOMES = new Set([
    'independent', 'supported', 'assisted', 'partner-rescue', 'audio-unavailable'
  ]);
  const ALL_OUTCOMES = new Set([...REVIEW_OUTCOMES, ...FORMATIVE_OUTCOMES, ...MICROTASK_OUTCOMES]);
  const COMPLETION_STATUSES = new Set([
    'completed-independent',
    'completed-supported',
    'completed-assisted',
    'completed-partner-rescue'
  ]);
  const CHECKPOINT_STATUSES = new Set([...COMPLETION_STATUSES, 'skipped']);
  const EVENT_TYPES = new Set([
    'checkpoint-completed',
    'microtask-completed',
    'microtask-skipped',
    'unit-built',
    'formative-attempt',
    'review-attempt',
    'review-run-started',
    'review-run-completed',
    'review-run-deferred',
    'role-practice-round-completed',
    'role-practice-round-skipped',
    'ui-continuation-acknowledged'
  ]);
  const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30];
  const V2_SUPPORT_LEVELS = new Set([
    'none', 'consequence', 'focused-cue', 'reobserve', 'partial-cue', 'model'
  ]);
  const V2_REVIEW_OUTCOMES = new Set([
    'independent-retrieval', 'review-assisted-practice', 'failed', 'system-failure', 'audio-failure'
  ]);
  const STAGE_BADGE_THRESHOLDS = [
    { badgeId: 'stage-1', challengeStars: 15, landmarkCoverage: 2 },
    { badgeId: 'stage-2', challengeStars: 30, landmarkCoverage: 4 },
    { badgeId: 'stage-3', challengeStars: 45, landmarkCoverage: 6 }
  ];

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const nested of Object.values(value)) deepFreeze(nested);
    return Object.freeze(value);
  }

  function catalogUnits(catalog) {
    return Array.isArray(catalog?.TEACHING_UNITS) ? catalog.TEACHING_UNITS : [];
  }

  function defaultState(catalog) {
    const units = {};
    const targets = {};
    const districts = {};

    for (const unit of catalogUnits(catalog)) {
      units[unit.unitId] = {
        experienceRevision: unit.experienceRevision || null,
        diagnosticArchive: null,
        checkpoint: null,
        unitAttemptId: null,
        pendingUiContinuation: null,
        rolePracticeProgress: {},
        buildStage: 0,
        adventureHeartsRemaining: 3,
        completedMicrotaskIds: [],
        skippedMicrotaskIds: [],
        storyFacts: [],
        sourceContacts: {}
      };
      districts[unit.districtId] = districts[unit.districtId] || {
        challengeStars: 0,
        starredUnitIds: []
      };
      for (const target of unit.targets) {
        targets[target.targetId] = {
          evidence: [],
          lastOutcome: null,
          lastLearningDay: null,
          lastEvidenceDay: null,
          lastStarDay: null,
          intervalStage: 0,
          nextDueDay: null,
          variantCells: {}
        };
      }
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      processedEventIds: [],
      units,
      targets,
      districts,
      reviewRuns: {},
      learningClock: { maxObservedDay: null, dailyChallengeStars: 0 }
    };
  }

  function unitMicrotasks(unit) {
    return (unit?.beats || []).flatMap(beat => beat.microtasks || []);
  }

  function terminalPresentationMoment(task) {
    const moments = task?.presentation?.moments || [];
    for (let index = moments.length - 1; index >= 0; index -= 1) {
      if (moments[index]?.enterWhen?.kind === 'microtask-complete') return moments[index];
    }
    return null;
  }

  function continuationForCompletedTask(event, task) {
    const base = {
      microtaskId: task.microtaskId,
      unitAttemptId: typeof event.unitAttemptId === 'string' ? event.unitAttemptId : null,
      attemptRevision: nonNegativeInteger(event.attemptRevision)
    };
    const terminalMoment = terminalPresentationMoment(task);
    if (terminalMoment) {
      return {
        ...base,
        kind: 'terminal-presentation',
        momentId: terminalMoment.momentId,
        restStop: clone(task.restStop || null)
      };
    }
    return task.restStop ? { ...base, kind: 'rest-stop', restStop: clone(task.restStop) } : null;
  }

  function unitSourceIds(unit) {
    return new Set(Object.values(unit?.lessonContent || {})
      .flatMap(lesson => Object.keys(lesson.sources || {})));
  }

  function authoredStoryFacts(unit) {
    return new Set(unitMicrotasks(unit)
      .flatMap(task => task.persistence?.checkpointFacts || []));
  }

  function authoredSourceContacts(unit) {
    return new Set(unitMicrotasks(unit).flatMap(task => (
      Array.isArray(task.sourceContacts) && task.sourceContacts.length
        ? task.sourceContacts.map(contact => contact.sourceRef)
        : (task.exposureRefs || [])
    )));
  }

  function rolePracticeContracts(unit) {
    return unitMicrotasks(unit).flatMap(task => (task.steps || []).map(step => ({
      task,
      step,
      practice: step.practice
    }))).filter(({ practice }) => practice?.kind === 'role-enactment');
  }

  function completionReadback(state, unit) {
    const stored = state.units[unit.unitId];
    const expectedMicrotaskCount = Number.isInteger(unit.experience?.progressDenominator)
      ? unit.experience.progressDenominator
      : 16;
    const allMicrotasks = unitMicrotasks(unit);
    const requiredMicrotaskIds = allMicrotasks.map(task => task.microtaskId);
    const skippedMicrotaskIds = new Set(stored.skippedMicrotaskIds || []);
    const evidenceRequiredTasks = allMicrotasks.filter(task => !skippedMicrotaskIds.has(task.microtaskId));
    const requiredResultCellIds = evidenceRequiredTasks
      .flatMap(task => task.targetResults || [])
      .map(result => result.reviewCellId || result.resultId);
    const requiredChallengeRefs = evidenceRequiredTasks
      .flatMap(task => task.targetResults || [])
      .map(result => result.challengeRef);
    const completedResultCellIds = new Set(unit.targets.flatMap(target => (
      Object.keys(state.targets[target.targetId]?.variantCells || {})
    )));
    const requiredStoryFactIds = [...new Set(evidenceRequiredTasks
      .flatMap(task => task.persistence?.checkpointFacts || []))];
    const requiredSourceRefs = [...new Set(evidenceRequiredTasks.flatMap(task => (
      Array.isArray(task.sourceContacts) && task.sourceContacts.length
        ? task.sourceContacts.map(contact => contact.sourceRef)
        : (task.exposureRefs || [])
    )))];
    const requiredAudioSourceRefs = [...new Set(evidenceRequiredTasks.flatMap(microtaskAudioSourceRefs))];
    const completedMicrotaskCount = requiredMicrotaskIds
      .filter(microtaskId => stored.completedMicrotaskIds.includes(microtaskId)).length;
    const resolvedMicrotaskCount = requiredMicrotaskIds.filter(microtaskId => (
      stored.completedMicrotaskIds.includes(microtaskId) || skippedMicrotaskIds.has(microtaskId)
    )).length;
    const completedResultCellCount = requiredResultCellIds
      .filter(reviewCellId => completedResultCellIds.has(reviewCellId)).length;
    const completedStoryFactCount = requiredStoryFactIds
      .filter(factId => stored.storyFacts.includes(factId)).length;
    const completedSourceContactCount = requiredSourceRefs
      .filter(sourceRef => stored.sourceContacts[sourceRef]?.contactModes?.length).length;
    const completedAudioSourceContactCount = requiredAudioSourceRefs
      .filter(sourceRef => stored.sourceContacts[sourceRef]?.contactModes?.includes('audio-ended')).length;
    return {
      requiredMicrotaskCount: requiredMicrotaskIds.length,
      completedMicrotaskCount,
      skippedMicrotaskCount: skippedMicrotaskIds.size,
      resolvedMicrotaskCount,
      requiredResultCellCount: requiredResultCellIds.length,
      completedResultCellCount,
      requiredStoryFactCount: requiredStoryFactIds.length,
      completedStoryFactCount,
      requiredSourceContactCount: requiredSourceRefs.length,
      completedSourceContactCount,
      requiredAudioSourceContactCount: requiredAudioSourceRefs.length,
      completedAudioSourceContactCount,
      readyForBuild: requiredMicrotaskIds.length === expectedMicrotaskCount
        && new Set(requiredMicrotaskIds).size === expectedMicrotaskCount
        && requiredResultCellIds.length === 29
        && new Set(requiredResultCellIds).size === 29
        && new Set(requiredChallengeRefs).size === 29
        && resolvedMicrotaskCount === requiredMicrotaskIds.length
        && completedResultCellCount === requiredResultCellIds.length
        && completedStoryFactCount === requiredStoryFactIds.length
        && completedSourceContactCount === requiredSourceRefs.length
        && completedAudioSourceContactCount === requiredAudioSourceRefs.length
    };
  }

  function targetResultContracts(unit, targetId) {
    return unitMicrotasks(unit)
      .flatMap(task => task.targetResults || [])
      .filter(result => result.targetId === targetId);
  }

  function normalizeSupportLevel(value) {
    if (V2_SUPPORT_LEVELS.has(value)) return value;
    if (Number.isInteger(value)) return Math.min(3, Math.max(0, value));
    return 0;
  }

  function orderedUnique(values, allowed) {
    return [...new Set((Array.isArray(values) ? values : [])
      .filter(value => typeof value === 'string' && (!allowed || allowed.has(value))))];
  }

  function normalizeContactModes(value) {
    const allowed = new Set(['experienced', 'audio-ended', 'audio-unavailable']);
    return ['experienced', 'audio-ended', 'audio-unavailable']
      .filter(mode => Array.isArray(value) && value.includes(mode) && allowed.has(mode));
  }

  function normalizeState(loadResult, catalog) {
    const defaults = defaultState(catalog);
    if (loadResult?.status !== 'ok') return defaults;
    const value = loadResult.value;
    if (!value || value.schemaVersion !== SCHEMA_VERSION || typeof value !== 'object') return defaults;

    defaults.processedEventIds = Array.isArray(value.processedEventIds)
      ? value.processedEventIds.filter(id => typeof id === 'string' && id).slice(-PROCESSED_EVENT_LIMIT)
      : [];

    for (const unit of catalogUnits(catalog)) {
      const stored = value.units?.[unit.unitId];
      if (!stored || typeof stored !== 'object') continue;
      if (unit.experienceRevision && stored.experienceRevision !== unit.experienceRevision) {
        defaults.units[unit.unitId].diagnosticArchive = {
          reason: 'experience-revision-mismatch',
          storedExperienceRevision: typeof stored.experienceRevision === 'string'
            ? stored.experienceRevision
            : null
        };
        continue;
      }
      defaults.units[unit.unitId].buildStage = Number.isInteger(stored.buildStage)
        ? Math.max(0, Math.min(5, stored.buildStage))
        : 0;
      defaults.units[unit.unitId].adventureHeartsRemaining = Number.isInteger(
        stored.adventureHeartsRemaining
      )
        ? Math.max(0, Math.min(3, stored.adventureHeartsRemaining))
        : 3;
      if (stored.checkpoint && typeof stored.checkpoint === 'object') {
        defaults.units[unit.unitId].checkpoint = {
          checkpointId: typeof stored.checkpoint.checkpointId === 'string'
            ? stored.checkpoint.checkpointId
            : null,
          beatId: typeof stored.checkpoint.beatId === 'string' ? stored.checkpoint.beatId : null,
          ...(typeof stored.checkpoint.microtaskId === 'string'
            ? { microtaskId: stored.checkpoint.microtaskId }
            : {}),
          ...(CHECKPOINT_STATUSES.has(stored.checkpoint.completionStatus)
            ? { completionStatus: stored.checkpoint.completionStatus }
            : {}),
          learningDay: validLearningDay(stored.checkpoint.learningDay)
            ? stored.checkpoint.learningDay
            : null
        };
      }
      const microtaskOrder = unitMicrotasks(unit).map(task => task.microtaskId);
      const allowedMicrotaskIds = new Set(microtaskOrder);
      defaults.units[unit.unitId].completedMicrotaskIds = orderedUnique(
        stored.completedMicrotaskIds,
        allowedMicrotaskIds
      ).sort((left, right) => microtaskOrder.indexOf(left) - microtaskOrder.indexOf(right));
      defaults.units[unit.unitId].skippedMicrotaskIds = orderedUnique(
        stored.skippedMicrotaskIds,
        allowedMicrotaskIds
      ).filter(microtaskId => !defaults.units[unit.unitId].completedMicrotaskIds.includes(microtaskId))
        .sort((left, right) => microtaskOrder.indexOf(left) - microtaskOrder.indexOf(right));
      defaults.units[unit.unitId].unitAttemptId = typeof stored.unitAttemptId === 'string'
        && stored.unitAttemptId
        ? stored.unitAttemptId
        : null;
      for (const { task, practice } of rolePracticeContracts(unit)) {
        const saved = stored.rolePracticeProgress?.[practice.practiceId];
        if (!saved || typeof saved !== 'object' || Array.isArray(saved)) continue;
        if (defaults.units[unit.unitId].completedMicrotaskIds.includes(task.microtaskId)) continue;
        if (saved.microtaskId !== task.microtaskId
          || typeof saved.unitAttemptId !== 'string'
          || !saved.unitAttemptId
          || saved.unitAttemptId !== defaults.units[unit.unitId].unitAttemptId) continue;
        const roundOrder = (practice.rounds || []).map(round => round.roundId);
        const completedRoundIds = orderedUnique(
          saved.completedRoundIds,
          new Set(roundOrder)
        ).sort((left, right) => roundOrder.indexOf(left) - roundOrder.indexOf(right));
        const skippedRoundIds = orderedUnique(
          saved.skippedRoundIds,
          new Set(roundOrder)
        ).filter(roundId => !completedRoundIds.includes(roundId))
          .sort((left, right) => roundOrder.indexOf(left) - roundOrder.indexOf(right));
        if (completedRoundIds.length === 0 && skippedRoundIds.length === 0) continue;
        defaults.units[unit.unitId].rolePracticeProgress[practice.practiceId] = {
          microtaskId: task.microtaskId,
          unitAttemptId: saved.unitAttemptId,
          completedRoundIds,
          skippedRoundIds
        };
      }
      const pendingContinuation = stored.pendingUiContinuation;
      if (pendingContinuation && typeof pendingContinuation === 'object') {
        const pendingTask = unitMicrotasks(unit).find(task => (
          task.microtaskId === pendingContinuation.microtaskId
        ));
        const pendingAttemptMatches = pendingContinuation.unitAttemptId === null
          || typeof pendingContinuation.unitAttemptId === 'string';
        if (
          pendingTask
          && defaults.units[unit.unitId].completedMicrotaskIds.includes(pendingTask.microtaskId)
          && pendingAttemptMatches
        ) {
          if (pendingContinuation.kind === 'terminal-presentation') {
            const terminalMoment = terminalPresentationMoment(pendingTask);
            if (terminalMoment?.momentId === pendingContinuation.momentId) {
              defaults.units[unit.unitId].pendingUiContinuation = {
                kind: 'terminal-presentation',
                microtaskId: pendingTask.microtaskId,
                unitAttemptId: pendingContinuation.unitAttemptId || null,
                attemptRevision: nonNegativeInteger(pendingContinuation.attemptRevision),
                momentId: terminalMoment.momentId,
                restStop: clone(pendingTask.restStop || null)
              };
            }
          } else if (pendingContinuation.kind === 'rest-stop' && pendingTask.restStop) {
            defaults.units[unit.unitId].pendingUiContinuation = {
              kind: 'rest-stop',
              microtaskId: pendingTask.microtaskId,
              unitAttemptId: pendingContinuation.unitAttemptId || null,
              attemptRevision: nonNegativeInteger(pendingContinuation.attemptRevision),
              restStop: clone(pendingTask.restStop)
            };
          }
        }
      }
      const storyFactOrder = unitMicrotasks(unit)
        .flatMap(task => task.persistence?.checkpointFacts || []);
      defaults.units[unit.unitId].storyFacts = orderedUnique(
        stored.storyFacts,
        authoredStoryFacts(unit)
      ).sort((left, right) => storyFactOrder.indexOf(left) - storyFactOrder.indexOf(right));
      const allowedSourceIds = unitSourceIds(unit);
      for (const [sourceRef, contact] of Object.entries(stored.sourceContacts || {})) {
        if (!allowedSourceIds.has(sourceRef) || !contact || typeof contact !== 'object') continue;
        const contactModes = normalizeContactModes(contact.contactModes);
        if (contactModes.length === 0) continue;
        defaults.units[unit.unitId].sourceContacts[sourceRef] = {
          contactModes,
          lastLearningDay: validLearningDay(contact.lastLearningDay)
            ? contact.lastLearningDay
            : null
        };
      }

      const district = value.districts?.[unit.districtId];
      if (district && typeof district === 'object') {
        defaults.districts[unit.districtId].challengeStars = nonNegativeInteger(district.challengeStars);
        defaults.districts[unit.districtId].starredUnitIds = Array.isArray(district.starredUnitIds)
          ? [...new Set(district.starredUnitIds.filter(id => typeof id === 'string'))]
            .filter(unitId => catalog.getTeachingUnit(unitId)?.districtId === unit.districtId)
          : [];
      }

      for (const target of unit.targets) {
        const source = value.targets?.[target.targetId];
        if (!source || typeof source !== 'object') continue;
        const normalized = defaults.targets[target.targetId];
        const seenDays = new Set();
        normalized.evidence = (Array.isArray(source.evidence) ? source.evidence : [])
          .filter(item => {
            if (!validEvidence(item, target) || seenDays.has(item.learningDay)) return false;
            seenDays.add(item.learningDay);
            return true;
          })
          .slice(0, 2)
          .map(clone);
        const evidenceDays = normalized.evidence
          .map(item => item.learningDay)
          .sort();
        const lastEvidenceDay = evidenceDays[evidenceDays.length - 1] || null;
        normalized.lastOutcome = ALL_OUTCOMES.has(source.lastOutcome) ? source.lastOutcome : null;
        normalized.lastLearningDay = validLearningDay(source.lastLearningDay)
          ? source.lastLearningDay
          : lastEvidenceDay;
        normalized.lastEvidenceDay = validLearningDay(source.lastEvidenceDay)
          ? source.lastEvidenceDay
          : lastEvidenceDay;
        normalized.lastStarDay = validLearningDay(source.lastStarDay)
          ? source.lastStarDay
          : lastEvidenceDay;
        normalized.intervalStage = Math.min(5, nonNegativeInteger(source.intervalStage));
        normalized.nextDueDay = validLearningDay(source.nextDueDay) ? source.nextDueDay : null;
        const contracts = targetResultContracts(unit, target.targetId);
        for (const contract of contracts) {
          const cellId = contract.reviewCellId || `${contract.variantId}:${contract.channel}`;
          const storedCell = source.variantCells?.[cellId];
          if (!storedCell || typeof storedCell !== 'object') continue;
          if (unit.experienceRevision) {
            normalized.variantCells[cellId] = {
              resultId: contract.resultId,
              reviewCellId: contract.reviewCellId,
              challengeRef: contract.challengeRef,
              targetId: contract.targetId,
              variantId: contract.variantId,
              sourceRef: contract.sourceRef,
              ...(Array.isArray(contract.relatedSourceRefs)
                ? { relatedSourceRefs: clone(contract.relatedSourceRefs) }
                : {}),
              ...(contract.contentRef ? { contentRef: contract.contentRef } : {}),
              channel: contract.channel,
              contextId: contract.contextId,
              reviewContextId: contract.reviewContextId,
              evidenceMode: contract.evidenceMode,
              outcome: MICROTASK_OUTCOMES.has(storedCell.outcome) ? storedCell.outcome : null,
              supportLevel: normalizeSupportLevel(storedCell.supportLevel),
              rescueUsed: storedCell.rescueUsed === true,
              attemptCount: nonNegativeInteger(storedCell.attemptCount),
              lastLearningDay: validLearningDay(storedCell.lastLearningDay)
                ? storedCell.lastLearningDay
                : null,
              lastIndependentDay: validLearningDay(storedCell.lastIndependentDay)
                ? storedCell.lastIndependentDay
                : null,
              intervalStage: Math.min(REVIEW_INTERVAL_DAYS.length, nonNegativeInteger(storedCell.intervalStage)),
              nextDueDay: validLearningDay(storedCell.nextDueDay)
                ? storedCell.nextDueDay
                : null,
              hadError: storedCell.hadError === true,
              audioUnavailable: storedCell.audioUnavailable === true,
              reviewAttempts: Array.isArray(storedCell.reviewAttempts)
                ? storedCell.reviewAttempts.filter(item => item && typeof item === 'object').slice(-16).map(clone)
                : [],
              ...(V2_REVIEW_OUTCOMES.has(storedCell.lastReviewOutcome)
                ? { lastReviewOutcome: storedCell.lastReviewOutcome }
                : {})
            };
          } else {
            normalized.variantCells[cellId] = {
              resultId: contract.resultId,
              variantId: contract.variantId,
              sourceRef: contract.sourceRef,
              channel: contract.channel,
              attemptCount: nonNegativeInteger(storedCell.attemptCount),
              lastOutcome: MICROTASK_OUTCOMES.has(storedCell.lastOutcome)
                ? storedCell.lastOutcome
                : null,
              lastSupportLevel: Math.min(3, nonNegativeInteger(storedCell.lastSupportLevel)),
              lastLearningDay: validLearningDay(storedCell.lastLearningDay)
                ? storedCell.lastLearningDay
                : null,
              nextDueDay: validLearningDay(storedCell.nextDueDay)
                ? storedCell.nextDueDay
                : null
            };
          }
        }
      }
    }

    if (value.learningClock && typeof value.learningClock === 'object') {
      defaults.learningClock.maxObservedDay = validLearningDay(value.learningClock.maxObservedDay)
        ? value.learningClock.maxObservedDay
        : null;
      defaults.learningClock.dailyChallengeStars = Math.min(
        3,
        nonNegativeInteger(value.learningClock.dailyChallengeStars)
      );
    }
    for (const [reviewRunId, storedRun] of Object.entries(value.reviewRuns || {})) {
      if (!storedRun || typeof storedRun !== 'object' || storedRun.reviewRunId !== reviewRunId) continue;
      const unit = catalog.getTeachingUnit(storedRun.unitId);
      if (!unit || !unit.experienceRevision
        || storedRun.experienceRevision !== unit.experienceRevision) continue;
      const knownCellIds = new Set(unit.targets.flatMap(target => (
        Object.keys(defaults.targets[target.targetId]?.variantCells || {})
      )));
      const reviewCellIds = orderedUnique(storedRun.reviewCellIds, knownCellIds);
      if (reviewCellIds.length < 2 || reviewCellIds.length > 4) continue;
      const temporaryResults = {};
      for (const [reviewCellId, attempt] of Object.entries(storedRun.temporaryResults || {})) {
        if (!knownCellIds.has(reviewCellId) || !attempt || typeof attempt !== 'object') continue;
        temporaryResults[reviewCellId] = clone(attempt);
      }
      defaults.reviewRuns[reviewRunId] = {
        reviewRunId,
        unitId: unit.unitId,
        experienceRevision: unit.experienceRevision,
        reviewCellIds,
        heartsRemaining: Number.isInteger(storedRun.heartsRemaining)
          ? Math.max(0, Math.min(3, storedRun.heartsRemaining))
          : 3,
        attemptRevision: nonNegativeInteger(storedRun.attemptRevision),
        rescueUsed: storedRun.rescueUsed === true,
        temporaryResults,
        errorsByCell: Object.fromEntries(Object.entries(storedRun.errorsByCell || {})
          .filter(([reviewCellId, count]) => knownCellIds.has(reviewCellId) && nonNegativeInteger(count) > 0)
          .map(([reviewCellId, count]) => [reviewCellId, nonNegativeInteger(count)])),
        attemptLog: Array.isArray(storedRun.attemptLog)
          ? storedRun.attemptLog.filter(item => item && typeof item === 'object').slice(-32).map(clone)
          : []
      };
    }
    return defaults;
  }

  function nonNegativeInteger(value) {
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  }

  function validLearningDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    if (year < 1 || month < 1 || month > 12 || day < 1) return false;
    return day <= daysInMonth(year, month);
  }

  function daysInMonth(year, month) {
    if (month === 2) {
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      return leap ? 29 : 28;
    }
    return [4, 6, 9, 11].includes(month) ? 30 : 31;
  }

  function addDays(learningDay, count) {
    let [year, month, day] = learningDay.split('-').map(Number);
    for (let index = 0; index < count; index += 1) {
      day += 1;
      if (day > daysInMonth(year, month)) {
        day = 1;
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }
    }
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function validEvidence(item, target) {
    return item && typeof item === 'object'
      && validLearningDay(item.learningDay)
      && target.contextIds.includes(item.contextId)
      && target.evidenceModes.includes(item.evidenceMode)
      && item.outcome === 'independent';
  }

  function findTarget(unit, targetId) {
    return unit?.targets.find(target => target.targetId === targetId) || null;
  }

  function findReviewCell(state, unit, reviewCellId) {
    for (const target of unit.targets) {
      const cell = state.targets[target.targetId]?.variantCells?.[reviewCellId];
      if (cell) return cell;
    }
    return null;
  }

  function sameStringSet(actual, expected) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
    const actualValues = [...new Set(actual)];
    const expectedValues = [...new Set(expected)];
    return actualValues.length === actual.length
      && expectedValues.length === expected.length
      && actualValues.length === expectedValues.length
      && actualValues.every(value => expectedValues.includes(value));
  }

  function processedEventToken(event, catalog) {
    const unit = catalog.getTeachingUnit(event.unitId);
    return unit?.experienceRevision
      ? `${unit.unitId}|${unit.experienceRevision}|${event.eventId}`
      : event.eventId;
  }

  function microtaskAudioSourceRefs(task) {
    const refs = [];
    function addSequence(sequence) {
      for (const audioPart of sequence?.segments || []) {
        if (typeof audioPart.sourceRef === 'string') refs.push(audioPart.sourceRef);
      }
    }
    for (const step of task.steps || []) {
      if (step.kind === 'role-enactment' && step.practice?.kind === 'role-enactment') {
        refs.push(...(step.practice.rounds || []).flatMap(round => round.dialogueTurnRefs || []));
      }
      refs.push(...(step.audioSourceRefs || []));
      refs.push(...(step.challengeSourceRefs || []));
      if (step.kind === 'explore-batch') refs.push(...(step.sourceRefs || []));
      if (step.feedbackAudioSourceRef) refs.push(step.feedbackAudioSourceRef);
      addSequence(step.audioSequence);
      addSequence(step.feedbackAudioSequence);
      for (const challenge of step.challenges || []) {
        addSequence(challenge.audioSequence);
        addSequence(challenge.feedbackAudioSequence);
      }
    }
    return [...new Set(refs)];
  }

  function validateMicrotaskCompletion(event, unit, state) {
    if (unit.runtimeProfile !== 'microtask-v2') return 'runtime-profile-invalid';
    if (unit.experienceRevision && event.experienceRevision !== unit.experienceRevision) {
      return 'experience-revision-mismatch';
    }
    if (event.nextDueDay !== undefined) return 'nextDueDay-forbidden';
    const beat = unit.beats.find(candidate => candidate.beatId === event.beatId);
    const task = beat?.microtasks?.find(candidate => candidate.microtaskId === event.microtaskId);
    if (!task) return 'microtask-invalid';
    if (task.skipPolicy?.kind === 'role-round-child-confirmed') {
      const contract = rolePracticeContracts(unit).find(({ task: authoredTask }) => (
        authoredTask.microtaskId === task.microtaskId
      ));
      const progress = contract
        ? state.units[event.unitId]?.rolePracticeProgress?.[contract.practice.practiceId]
        : null;
      const completed = new Set(progress?.completedRoundIds || []);
      if (!contract || !(contract.practice.rounds || []).every(round => completed.has(round.roundId))) {
        return 'role-practice-incomplete';
      }
    }
    if (event.checkpointId !== task.checkpointAfterSuccess?.checkpointId) {
      return 'checkpointId-invalid';
    }
    if (!COMPLETION_STATUSES.has(event.completionStatus)) return 'completionStatus-invalid';
    if (!Number.isInteger(event.adventureHeartsRemaining)
      || event.adventureHeartsRemaining < 0 || event.adventureHeartsRemaining > 3) {
      return 'adventure-hearts-invalid';
    }
    const expectedBuildStage = task.checkpointAfterSuccess?.buildStage;
    if (event.buildStage !== expectedBuildStage) return 'buildStage-mismatch';

    const expectedResults = task.targetResults || [];
    if (!Array.isArray(event.targetResults) || event.targetResults.length !== expectedResults.length) {
      return 'target-results-incomplete';
    }
    const seenResults = new Set();
    const seenReviewCells = new Set();
    const seenChallenges = new Set();
    for (const submitted of event.targetResults) {
      if (!submitted || typeof submitted !== 'object' || seenResults.has(submitted.resultId)) {
        return 'target-results-invalid';
      }
      seenResults.add(submitted.resultId);
      const authored = expectedResults.find(result => result.resultId === submitted.resultId);
      if (!authored) return 'target-result-invalid';
      for (const field of [
        'targetId', 'stepId', 'sourceRef', 'channel', 'evidenceMode', 'variantId', 'resultKind',
        ...(unit.experienceRevision ? ['reviewCellId', 'challengeRef', 'contextId', 'reviewContextId'] : [])
      ]) {
        if (submitted[field] !== authored[field]) return 'target-result-forged';
      }
      if (unit.experienceRevision) {
        if (submitted.contentRef !== authored.contentRef
          || !sameStringSet(submitted.relatedSourceRefs || [], authored.relatedSourceRefs || [])) {
          return 'target-result-forged';
        }
        if (submitted.reviewCellId !== submitted.resultId
          || seenReviewCells.has(submitted.reviewCellId)
          || seenChallenges.has(submitted.challengeRef)) return 'target-result-identity-invalid';
        seenReviewCells.add(submitted.reviewCellId);
        seenChallenges.add(submitted.challengeRef);
        if (submitted.nextDueDay !== undefined) return 'nextDueDay-forbidden';
      }
      if (!MICROTASK_OUTCOMES.has(submitted.outcome)) return 'target-result-outcome-invalid';
      if (!(Number.isInteger(submitted.supportLevel)
        && submitted.supportLevel >= 0 && submitted.supportLevel <= 3)
        && !V2_SUPPORT_LEVELS.has(submitted.supportLevel)) {
        return 'target-result-support-invalid';
      }
      if (unit.experienceRevision && typeof submitted.rescueUsed !== 'boolean') {
        return 'target-result-rescue-invalid';
      }
      if (!Number.isInteger(submitted.heartsRemaining)
        || submitted.heartsRemaining < 0 || submitted.heartsRemaining > 3) {
        return 'target-result-hearts-invalid';
      }
      if (submitted.adventureHeartsRemaining !== undefined
        && submitted.adventureHeartsRemaining !== submitted.heartsRemaining) {
        return 'target-result-adventure-hearts-invalid';
      }
    }
    if (unit.experienceRevision) {
      const rescued = event.targetResults.some(result => (
        result.rescueUsed || result.outcome === 'partner-rescue'
      ));
      if (event.targetResults.some(result => (
        (result.rescueUsed || result.outcome === 'partner-rescue')
          && (result.outcome !== 'partner-rescue' || result.supportLevel !== 'model' || !result.rescueUsed)
      ))) return 'target-results-rescue-incomplete';
      if (rescued && event.targetResults.some(result => !result.rescueUsed)
        || rescued && event.completionStatus !== 'completed-partner-rescue') {
        return 'target-results-rescue-incomplete';
      }
      if (!rescued && event.targetResults.length > 0
        && event.completionStatus === 'completed-partner-rescue') {
        return 'target-results-rescue-incomplete';
      }
    }

    if (!Array.isArray(event.sourceContacts) || event.sourceContacts.length !== task.exposureRefs.length) {
      return 'source-contacts-incomplete';
    }
    const submittedSourceRefs = event.sourceContacts.map(contact => contact?.sourceRef);
    if (!sameStringSet(submittedSourceRefs, task.exposureRefs)) return 'source-contacts-invalid';
    const allowedAudioRefs = microtaskAudioSourceRefs(task);
    if (!Array.isArray(event.audioContactRefs)
      || !sameStringSet(event.audioContactRefs, event.audioContactRefs)
      || !event.audioContactRefs.every(sourceRef => allowedAudioRefs.includes(sourceRef))) {
      return 'audio-contacts-invalid';
    }
    if (!Array.isArray(event.missingAudioRefs)
      || !sameStringSet(event.missingAudioRefs, event.missingAudioRefs)
      || !event.missingAudioRefs.every(sourceRef => allowedAudioRefs.includes(sourceRef))) {
      return 'missing-audio-invalid';
    }
    if (event.audioContactRefs.some(sourceRef => event.missingAudioRefs.includes(sourceRef))) {
      return 'audio-contact-conflict';
    }
    if (unit.experienceRevision) {
      if (!sameStringSet(event.audioContactRefs, allowedAudioRefs)) return 'audio-contacts-incomplete';
      if (event.missingAudioRefs.length > 0) return 'audio-fail-closed';
    }
    for (const contact of event.sourceContacts) {
      const modes = normalizeContactModes(contact.contactModes);
      if (!sameStringSet(modes, contact.contactModes)) return 'source-contact-mode-invalid';
      if (modes.includes('audio-ended') && !event.audioContactRefs.includes(contact.sourceRef)) {
        return 'source-contact-audio-invalid';
      }
      if (modes.includes('audio-unavailable') && !event.missingAudioRefs.includes(contact.sourceRef)) {
        return 'source-contact-audio-invalid';
      }
    }
    if (!sameStringSet(event.storyFacts, task.persistence?.checkpointFacts || [])) {
      return 'story-facts-invalid';
    }
    return null;
  }

  function validateMicrotaskSkip(event, unit, state) {
    if (unit.runtimeProfile !== 'microtask-v2') return 'runtime-profile-invalid';
    if (unit.experienceRevision && event.experienceRevision !== unit.experienceRevision) {
      return 'experience-revision-mismatch';
    }
    const beat = unit.beats.find(candidate => candidate.beatId === event.beatId);
    const task = beat?.microtasks?.find(candidate => candidate.microtaskId === event.microtaskId);
    if (!task) return 'microtask-invalid';
    if (!['child-confirmed', 'role-round-child-confirmed'].includes(task.skipPolicy?.kind)) {
      return 'microtask-not-skippable';
    }
    if (task.skipPolicy.kind === 'role-round-child-confirmed') {
      const contract = rolePracticeContracts(unit).find(({ task: authoredTask }) => (
        authoredTask.microtaskId === task.microtaskId
      ));
      const progress = contract
        ? state.units[event.unitId]?.rolePracticeProgress?.[contract.practice.practiceId]
        : null;
      const completed = new Set(progress?.completedRoundIds || []);
      const skipped = new Set(progress?.skippedRoundIds || []);
      const rounds = contract?.practice.rounds || [];
      if (rounds.length === 0
        || !rounds.every(round => completed.has(round.roundId) || skipped.has(round.roundId))
        || !rounds.some(round => skipped.has(round.roundId))) {
        return 'role-practice-dispositions-incomplete';
      }
    }
    if (state.units[event.unitId]?.completedMicrotaskIds.includes(event.microtaskId)) {
      return 'microtask-already-completed';
    }
    if (typeof event.unitAttemptId !== 'string' || !event.unitAttemptId) {
      return 'unitAttemptId-required';
    }
    if (!Number.isInteger(event.attemptRevision) || event.attemptRevision < 0) {
      return 'attempt-revision-invalid';
    }
    if (event.checkpointId !== task.checkpointAfterSuccess?.checkpointId) {
      return 'checkpointId-invalid';
    }
    if (event.completionStatus !== 'skipped') return 'completionStatus-invalid';
    if (!Number.isInteger(event.adventureHeartsRemaining)
      || event.adventureHeartsRemaining < 0 || event.adventureHeartsRemaining > 3) {
      return 'adventure-hearts-invalid';
    }
    for (const field of ['targetResults', 'sourceContacts', 'audioContactRefs', 'missingAudioRefs', 'storyFacts']) {
      if (!Array.isArray(event[field]) || event[field].length !== 0) return 'skip-evidence-forbidden';
    }
    return null;
  }

  function validateEvent(event, catalog, state) {
    if (!event || typeof event !== 'object') return 'event-required';
    if (typeof event.eventId !== 'string' || event.eventId.trim() === '') return 'eventId-required';
    if (!EVENT_TYPES.has(event.type)) return 'event-type-invalid';
    const unit = catalog.getTeachingUnit(event.unitId);
    if (!unit) return 'unit-invalid';
    if (unit.experienceRevision && event.experienceRevision !== unit.experienceRevision) {
      return 'experience-revision-mismatch';
    }
    if (state.processedEventIds.includes(processedEventToken(event, catalog))) return null;

    if (
      event.type === 'role-practice-round-completed'
      || event.type === 'role-practice-round-skipped'
    ) {
      if (typeof event.unitAttemptId !== 'string' || !event.unitAttemptId) {
        return 'unitAttemptId-required';
      }
      const contract = rolePracticeContracts(unit).find(({ task, practice }) => (
        task.microtaskId === event.microtaskId
        && practice.practiceId === event.practiceId
      ));
      if (!contract) return 'role-practice-invalid';
      const round = (contract.practice.rounds || [])
        .find(candidate => candidate.roundId === event.roundId);
      if (!round) return 'role-practice-round-invalid';
      if (contract.task.skipPolicy?.kind !== 'role-round-child-confirmed') {
        return 'role-practice-disposition-policy-invalid';
      }
      const stored = state.units[event.unitId];
      if (stored.completedMicrotaskIds.includes(event.microtaskId)) {
        return 'microtask-already-completed';
      }
      const activeProgress = stored.rolePracticeProgress[event.practiceId];
      if (activeProgress && activeProgress.unitAttemptId !== event.unitAttemptId) {
        return 'unit-attempt-mismatch';
      }
      if (stored.unitAttemptId && stored.unitAttemptId !== event.unitAttemptId) {
        return 'unit-attempt-mismatch';
      }
      const emptyEvidenceFields = ['targetResults', 'storyFacts', 'missingAudioRefs'];
      for (const field of emptyEvidenceFields) {
        if (!Array.isArray(event[field]) || event[field].length !== 0) {
          return 'role-practice-evidence-invalid';
        }
      }
      if (event.type === 'role-practice-round-skipped') {
        for (const field of ['sourceContacts', 'audioContactRefs']) {
          if (!Array.isArray(event[field]) || event[field].length !== 0) {
            return 'role-practice-skip-evidence-forbidden';
          }
        }
        return null;
      }
      if (!Array.isArray(event.sourceContacts)
        || event.sourceContacts.length !== round.dialogueTurnRefs.length
        || !sameStringSet(
          event.sourceContacts.map(contact => contact?.sourceRef),
          round.dialogueTurnRefs
        )) {
        return 'role-practice-source-contacts-invalid';
      }
      for (const contact of event.sourceContacts) {
        if (!sameStringSet(contact?.contactModes, ['experienced', 'audio-ended'])) {
          return 'role-practice-source-contact-mode-invalid';
        }
      }
      if (!sameStringSet(event.audioContactRefs, round.dialogueTurnRefs)) {
        return 'role-practice-audio-contacts-invalid';
      }
      return null;
    }

    if (event.type === 'ui-continuation-acknowledged') {
      const pending = state.units[event.unitId]?.pendingUiContinuation;
      if (!pending) return 'ui-continuation-not-pending';
      if (event.microtaskId !== pending.microtaskId) return 'microtask-invalid';
      if (event.unitAttemptId !== pending.unitAttemptId) return 'unit-attempt-mismatch';
      if (event.attemptRevision !== pending.attemptRevision) return 'attempt-revision-mismatch';
      if (event.acknowledgement === 'presentation-ended') {
        if (pending.kind !== 'terminal-presentation') return 'terminal-presentation-not-pending';
        if (event.momentId !== pending.momentId) return 'presentation-moment-mismatch';
        return null;
      }
      if (event.acknowledgement === 'rest-stop-continue') {
        if (pending.kind !== 'rest-stop') return 'rest-stop-not-pending';
        if (event.restStopId !== pending.restStop?.restStopId) return 'rest-stop-mismatch';
        return null;
      }
      return 'ui-acknowledgement-invalid';
    }

    if (event.type === 'review-run-started') {
      if (!unit.experienceRevision || event.experienceRevision !== unit.experienceRevision) {
        return 'experience-revision-mismatch';
      }
      if (typeof event.reviewRunId !== 'string' || !event.reviewRunId) return 'reviewRunId-required';
      if (!Array.isArray(event.reviewCellIds) || event.reviewCellIds.length < 2
        || event.reviewCellIds.length > 4 || new Set(event.reviewCellIds).size !== event.reviewCellIds.length) {
        return 'review-cells-invalid';
      }
      if (!event.reviewCellIds.every(reviewCellId => findReviewCell(state, unit, reviewCellId))) {
        return 'review-cell-unlearned';
      }
      if (state.reviewRuns[event.reviewRunId]) return 'review-run-exists';
      return null;
    }

    if (event.type === 'review-run-completed' || event.type === 'review-run-deferred') {
      const run = state.reviewRuns[event.reviewRunId];
      if (!run || run.unitId !== unit.unitId) return 'review-run-invalid';
      if (event.experienceRevision !== unit.experienceRevision) return 'experience-revision-mismatch';
      if (event.type === 'review-run-completed'
        && !run.reviewCellIds.every(reviewCellId => run.temporaryResults[reviewCellId])) {
        return 'review-run-incomplete';
      }
      return null;
    }

    if (event.type === 'microtask-completed') {
      return validateMicrotaskCompletion(event, unit, state);
    }
    if (event.type === 'microtask-skipped') {
      return validateMicrotaskSkip(event, unit, state);
    }
    if (event.type === 'checkpoint-completed') {
      if (typeof event.checkpointId !== 'string' || event.checkpointId.trim() === '') {
        return 'checkpointId-required';
      }
      const beat = event.beatId ? unit.beats.find(candidate => candidate.beatId === event.beatId) : null;
      if (event.beatId && !beat) return 'beat-invalid';
      if (event.microtaskId !== undefined) {
        if (typeof event.microtaskId !== 'string' || !event.microtaskId) return 'microtaskId-invalid';
        if (!beat?.microtasks?.some(task => task.microtaskId === event.microtaskId)) {
          return 'microtask-invalid';
        }
      }
      if (event.completionStatus !== undefined && !CHECKPOINT_STATUSES.has(event.completionStatus)) {
        return 'completionStatus-invalid';
      }
      if (event.buildStage !== undefined && (!Number.isInteger(event.buildStage)
        || event.buildStage < 0 || event.buildStage > 5)) return 'buildStage-invalid';
      if (beat && event.buildStage !== undefined && beat.buildStage !== event.buildStage) {
        return 'buildStage-mismatch';
      }
      return null;
    }
    if (event.type === 'unit-built') {
      if (event.buildStage !== undefined && event.buildStage !== 5) return 'buildStage-invalid';
      if (unit.experienceRevision) {
        if (event.experienceRevision !== unit.experienceRevision) return 'experience-revision-mismatch';
        if (!completionReadback(state, unit).readyForBuild) return 'unit-readback-incomplete';
      }
      return null;
    }

    const target = findTarget(unit, event.targetId);
    if (!target) return 'target-invalid';
    if (event.type === 'review-attempt' && event.reviewRunId !== undefined) {
      if (event.nextDueDay !== undefined) return 'nextDueDay-forbidden';
      if (event.experienceRevision !== unit.experienceRevision) return 'experience-revision-mismatch';
      const run = state.reviewRuns[event.reviewRunId];
      if (!run || run.unitId !== unit.unitId || run.experienceRevision !== unit.experienceRevision) {
        return 'review-run-invalid';
      }
      if (!run.reviewCellIds.includes(event.reviewCellId)) return 'review-cell-invalid';
      const cell = findReviewCell(state, unit, event.reviewCellId);
      if (!cell || cell.targetId !== event.targetId || cell.sourceRef !== event.sourceRef
        || cell.channel !== event.channel || cell.evidenceMode !== event.evidenceMode
        || cell.reviewContextId !== event.contextId) return 'review-cell-forged';
      if (typeof event.reviewChallengeRef !== 'string' || !event.reviewChallengeRef) {
        return 'reviewChallengeRef-required';
      }
      if (!V2_REVIEW_OUTCOMES.has(event.outcome)) return 'outcome-invalid';
      if (!target.contextIds.includes(event.contextId)) return 'context-invalid';
      if (!Object.prototype.hasOwnProperty.call(unit.reviewContexts || {}, event.contextId)) {
        return 'review-context-invalid';
      }
      if (!target.evidenceModes.includes(event.evidenceMode)) return 'evidence-mode-invalid';
      if (!V2_SUPPORT_LEVELS.has(event.supportLevel)) return 'support-level-invalid';
      if (typeof event.attemptedAt !== 'string' || Number.isNaN(Date.parse(event.attemptedAt))) {
        return 'attemptedAt-invalid';
      }
      return null;
    }
    const outcomes = event.type === 'formative-attempt' ? FORMATIVE_OUTCOMES : REVIEW_OUTCOMES;
    if (!outcomes.has(event.outcome)) return 'outcome-invalid';
    if (!target.contextIds.includes(event.contextId)) return 'context-invalid';
    if (!target.evidenceModes.includes(event.evidenceMode)) return 'evidence-mode-invalid';
    return null;
  }

  function applyFormative(state, event, learningDay) {
    const target = state.targets[event.targetId];
    target.lastOutcome = event.outcome;
    target.lastLearningDay = learningDay;
    target.nextDueDay = addDays(learningDay, 1);
    return [];
  }

  function applyCheckpoint(state, event, learningDay, catalog) {
    const unit = catalog.getTeachingUnit(event.unitId);
    const beat = event.beatId ? unit.beats.find(candidate => candidate.beatId === event.beatId) : null;
    const stored = state.units[event.unitId];
    const buildStage = event.microtaskId ? event.buildStage : (event.buildStage ?? beat?.buildStage);
    if (Number.isInteger(buildStage) && buildStage < stored.buildStage) return [];
    if (Number.isInteger(buildStage)) stored.buildStage = Math.max(stored.buildStage, buildStage);

    if (event.microtaskId && stored.checkpoint?.microtaskId) {
      const microtaskIds = unit.beats.flatMap(currentBeat => (
        currentBeat.microtasks || []
      )).map(task => task.microtaskId);
      const incomingIndex = microtaskIds.indexOf(event.microtaskId);
      const storedIndex = microtaskIds.indexOf(stored.checkpoint.microtaskId);
      if (incomingIndex >= 0 && storedIndex >= 0 && incomingIndex < storedIndex) return [];
    }
    stored.checkpoint = {
      checkpointId: event.checkpointId,
      beatId: beat?.beatId || null,
      ...(event.microtaskId ? { microtaskId: event.microtaskId } : {}),
      ...(event.completionStatus ? { completionStatus: event.completionStatus } : {}),
      learningDay
    };
    return [];
  }

  function applyRolePracticeRoundDisposition(state, event, learningDay, catalog) {
    const unit = catalog.getTeachingUnit(event.unitId);
    const contract = rolePracticeContracts(unit).find(({ practice }) => (
      practice.practiceId === event.practiceId
    ));
    const stored = state.units[event.unitId];
    const existing = stored.rolePracticeProgress[event.practiceId] || {
      microtaskId: event.microtaskId,
      unitAttemptId: event.unitAttemptId,
      completedRoundIds: [],
      skippedRoundIds: []
    };
    const completed = new Set(existing.completedRoundIds || []);
    const skipped = new Set(existing.skippedRoundIds || []);
    if (event.type === 'role-practice-round-completed') {
      completed.add(event.roundId);
      skipped.delete(event.roundId);
      for (const contact of event.sourceContacts) {
        const existingContact = stored.sourceContacts[contact.sourceRef] || {
          contactModes: [],
          lastLearningDay: null
        };
        stored.sourceContacts[contact.sourceRef] = {
          contactModes: normalizeContactModes([
            ...existingContact.contactModes,
            ...contact.contactModes
          ]),
          lastLearningDay: learningDay
        };
      }
    } else if (!completed.has(event.roundId)) {
      skipped.add(event.roundId);
    }
    const roundOrder = (contract?.practice.rounds || []).map(round => round.roundId);
    stored.unitAttemptId = event.unitAttemptId;
    stored.rolePracticeProgress[event.practiceId] = {
      microtaskId: event.microtaskId,
      unitAttemptId: event.unitAttemptId,
      completedRoundIds: roundOrder.filter(roundId => completed.has(roundId)),
      skippedRoundIds: roundOrder.filter(roundId => skipped.has(roundId) && !completed.has(roundId))
    };
    return [{
      type: event.type,
      unitId: event.unitId,
      microtaskId: event.microtaskId,
      practiceId: event.practiceId,
      roundId: event.roundId
    }];
  }

  function applyMicrotaskCompletion(state, event, learningDay, catalog) {
    const unit = catalog.getTeachingUnit(event.unitId);
    const stored = state.units[event.unitId];
    const microtaskIds = unitMicrotasks(unit).map(task => task.microtaskId);
    const incomingIndex = microtaskIds.indexOf(event.microtaskId);
    const storedIndex = microtaskIds.indexOf(stored.checkpoint?.microtaskId);
    const completionIsBackfill = storedIndex >= 0 && incomingIndex < storedIndex;
    if (storedIndex >= 0 && incomingIndex < storedIndex
      && !stored.skippedMicrotaskIds.includes(event.microtaskId)) return [];

    const previousBuildStage = stored.buildStage;
    applyCheckpoint(state, event, learningDay, catalog);
    if (typeof event.unitAttemptId === 'string' && event.unitAttemptId) {
      stored.unitAttemptId = event.unitAttemptId;
    }
    stored.pendingUiContinuation = completionIsBackfill
      ? null
      : continuationForCompletedTask(event, (
          unit.beats.flatMap(beat => beat.microtasks || [])
            .find(task => task.microtaskId === event.microtaskId)
        ));
    stored.adventureHeartsRemaining = event.adventureHeartsRemaining;
    for (const [practiceId, progress] of Object.entries(stored.rolePracticeProgress)) {
      if (progress.microtaskId === event.microtaskId) delete stored.rolePracticeProgress[practiceId];
    }
    if (!stored.completedMicrotaskIds.includes(event.microtaskId)) {
      stored.completedMicrotaskIds.push(event.microtaskId);
      stored.completedMicrotaskIds.sort((left, right) => (
        microtaskIds.indexOf(left) - microtaskIds.indexOf(right)
      ));
    }
    stored.skippedMicrotaskIds = stored.skippedMicrotaskIds
      .filter(microtaskId => microtaskId !== event.microtaskId);
    for (const factId of event.storyFacts) {
      if (!stored.storyFacts.includes(factId)) stored.storyFacts.push(factId);
    }
    for (const contact of event.sourceContacts) {
      const existing = stored.sourceContacts[contact.sourceRef] || {
        contactModes: [],
        lastLearningDay: null
      };
      stored.sourceContacts[contact.sourceRef] = {
        contactModes: normalizeContactModes([
          ...existing.contactModes,
          ...contact.contactModes
        ]),
        lastLearningDay: learningDay
      };
    }
    for (const result of event.targetResults) {
      const target = state.targets[result.targetId];
      const cellId = result.reviewCellId || `${result.variantId}:${result.channel}`;
      const existing = target.variantCells[cellId];
      const normalizedResultSupport = normalizeSupportLevel(result.supportLevel);
      const usedSupport = normalizedResultSupport !== 0 && normalizedResultSupport !== 'none';
      target.variantCells[cellId] = unit.experienceRevision
        ? {
          resultId: result.resultId,
          reviewCellId: result.reviewCellId,
          challengeRef: result.challengeRef,
          targetId: result.targetId,
          variantId: result.variantId,
          sourceRef: result.sourceRef,
          ...(Array.isArray(result.relatedSourceRefs)
            ? { relatedSourceRefs: clone(result.relatedSourceRefs) }
            : {}),
          ...(result.contentRef ? { contentRef: result.contentRef } : {}),
          channel: result.channel,
          contextId: result.contextId,
          reviewContextId: result.reviewContextId,
          evidenceMode: result.evidenceMode,
          outcome: result.outcome,
          supportLevel: normalizedResultSupport,
          rescueUsed: result.rescueUsed,
          attemptCount: (existing?.attemptCount || 0) + 1,
          lastLearningDay: learningDay,
          lastIndependentDay: existing?.lastIndependentDay || null,
          intervalStage: existing?.intervalStage || 0,
          nextDueDay: addDays(learningDay, 1),
          hadError: result.outcome !== 'independent' || usedSupport,
          audioUnavailable: result.outcome === 'audio-unavailable',
          reviewAttempts: existing?.reviewAttempts || []
        }
        : {
          resultId: result.resultId,
          variantId: result.variantId,
          sourceRef: result.sourceRef,
          channel: result.channel,
          attemptCount: (existing?.attemptCount || 0) + 1,
          lastOutcome: result.outcome,
          lastSupportLevel: result.supportLevel,
          lastLearningDay: learningDay,
          nextDueDay: addDays(learningDay, 1)
        };
      target.lastOutcome = result.outcome;
      target.lastLearningDay = learningDay;
      target.nextDueDay = addDays(learningDay, 1);
    }
    return previousBuildStage < 5 && stored.buildStage === 5
      ? [{ type: 'landmark-built', unitId: event.unitId }]
      : [];
  }

  function applyUiContinuationAcknowledgement(state, event) {
    const stored = state.units[event.unitId];
    const pending = stored.pendingUiContinuation;
    if (event.acknowledgement === 'presentation-ended' && pending?.restStop) {
      stored.pendingUiContinuation = {
        kind: 'rest-stop',
        microtaskId: pending.microtaskId,
        unitAttemptId: pending.unitAttemptId,
        attemptRevision: pending.attemptRevision,
        restStop: clone(pending.restStop)
      };
    } else {
      stored.pendingUiContinuation = null;
    }
    return [{
      type: 'ui-continuation-acknowledged',
      unitId: event.unitId,
      microtaskId: event.microtaskId,
      acknowledgement: event.acknowledgement
    }];
  }

  function applyUnitBuilt(state, event) {
    const stored = state.units[event.unitId];
    if (stored.buildStage >= 5) return [];
    stored.buildStage = 5;
    return [{ type: 'landmark-built', unitId: event.unitId }];
  }

  function prepareLearningDay(state, learningDay) {
    const observed = state.learningClock.maxObservedDay;
    if (observed && learningDay < observed) return false;
    if (!observed || learningDay > observed) {
      state.learningClock.maxObservedDay = learningDay;
      state.learningClock.dailyChallengeStars = 0;
    }
    return true;
  }

  function applyReview(state, event, learningDay, catalog) {
    if (!prepareLearningDay(state, learningDay)) {
      return [{ type: 'clock-rollback-blocked', learningDay }];
    }

    const unit = catalog.getTeachingUnit(event.unitId);
    const target = state.targets[event.targetId];
    target.lastOutcome = event.outcome;
    target.lastLearningDay = learningDay;

    if (event.outcome !== 'independent') {
      target.nextDueDay = addDays(learningDay, 1);
      return [];
    }

    if (target.lastEvidenceDay === learningDay) return [];

    const effects = [];
    if (!isTargetMastered(target)) {
      const evidence = {
        learningDay,
        contextId: event.contextId,
        evidenceMode: event.evidenceMode,
        outcome: 'independent'
      };
      target.evidence = retainMasteryEvidence(target.evidence, evidence);
      effects.push({ type: 'evidence-recorded', targetId: event.targetId, learningDay });
    }
    target.lastEvidenceDay = learningDay;

    if (target.lastStarDay !== learningDay && state.learningClock.dailyChallengeStars < 3) {
      const district = state.districts[unit.districtId];
      district.challengeStars += 1;
      if (!district.starredUnitIds.includes(unit.unitId)) district.starredUnitIds.push(unit.unitId);
      state.learningClock.dailyChallengeStars += 1;
      target.lastStarDay = learningDay;
      effects.push({
        type: 'star-awarded',
        awardId: `${unit.unitId}:${event.targetId}:${learningDay}`,
        districtId: unit.districtId,
        unitId: unit.unitId,
        targetId: event.targetId,
        learningDay
      });
    }

    target.intervalStage = Math.min(REVIEW_INTERVAL_DAYS.length, target.intervalStage + 1);
    const interval = REVIEW_INTERVAL_DAYS[Math.max(0, target.intervalStage - 1)];
    target.nextDueDay = addDays(learningDay, interval);
    return effects;
  }

  function applyMicrotaskSkip(state, event, learningDay, catalog) {
    const unit = catalog.getTeachingUnit(event.unitId);
    const stored = state.units[event.unitId];
    const microtaskIds = unitMicrotasks(unit).map(task => task.microtaskId);
    applyCheckpoint(state, event, learningDay, catalog);
    stored.unitAttemptId = event.unitAttemptId;
    stored.pendingUiContinuation = null;
    stored.adventureHeartsRemaining = event.adventureHeartsRemaining;
    if (!stored.skippedMicrotaskIds.includes(event.microtaskId)) {
      stored.skippedMicrotaskIds.push(event.microtaskId);
      stored.skippedMicrotaskIds.sort((left, right) => (
        microtaskIds.indexOf(left) - microtaskIds.indexOf(right)
      ));
    }
    return [{
      type: 'microtask-skipped',
      unitId: event.unitId,
      microtaskId: event.microtaskId,
      completionStatus: 'skipped'
    }];
  }

  function applyReviewRunStart(state, event) {
    state.reviewRuns[event.reviewRunId] = {
      reviewRunId: event.reviewRunId,
      unitId: event.unitId,
      experienceRevision: event.experienceRevision,
      reviewCellIds: [...event.reviewCellIds],
      heartsRemaining: 3,
      attemptRevision: 0,
      rescueUsed: false,
      temporaryResults: {},
      errorsByCell: {},
      attemptLog: []
    };
    return [{ type: 'review-run-started', reviewRunId: event.reviewRunId, heartsRemaining: 3 }];
  }

  function applyV2ReviewAttempt(state, event, learningDay) {
    const run = state.reviewRuns[event.reviewRunId];
    const attempt = {
      reviewRunId: event.reviewRunId,
      reviewChallengeRef: event.reviewChallengeRef,
      reviewCellId: event.reviewCellId,
      targetId: event.targetId,
      sourceRef: event.sourceRef,
      channel: event.channel,
      contextId: event.contextId,
      evidenceMode: event.evidenceMode,
      outcome: event.outcome,
      supportLevel: event.supportLevel,
      learningDay,
      attemptedAt: event.attemptedAt
    };
    run.attemptLog.push(attempt);
    run.attemptLog = run.attemptLog.slice(-32);
    if (event.outcome === 'audio-failure') {
      state.targets[event.targetId].variantCells[event.reviewCellId].audioUnavailable = true;
      return [];
    }
    if (event.outcome === 'system-failure') return [];
    if (event.outcome === 'failed') {
      run.errorsByCell[event.reviewCellId] = (run.errorsByCell[event.reviewCellId] || 0) + 1;
      run.heartsRemaining = Math.max(0, run.heartsRemaining - 1);
      if (run.heartsRemaining > 0) {
        return [{ type: 'review-heart-lost', reviewRunId: run.reviewRunId, heartsRemaining: run.heartsRemaining }];
      }
      run.attemptRevision += 1;
      run.rescueUsed = true;
      run.temporaryResults = {};
      run.errorsByCell = {};
      run.heartsRemaining = 3;
      return [{
        type: 'review-run-restarted',
        reviewRunId: run.reviewRunId,
        attemptRevision: run.attemptRevision,
        heartsRemaining: 3,
        rescueUsed: true
      }];
    }
    const assisted = run.rescueUsed || (run.errorsByCell[event.reviewCellId] || 0) > 0
      || event.supportLevel !== 'none' || event.outcome === 'review-assisted-practice';
    run.temporaryResults[event.reviewCellId] = {
      ...attempt,
      outcome: assisted ? 'review-assisted-practice' : 'independent-retrieval',
      supportLevel: run.rescueUsed ? 'model' : event.supportLevel,
      rescueUsed: run.rescueUsed
    };
    run.heartsRemaining = Math.min(3, run.heartsRemaining + 1);
    return [{ type: 'review-heart-restored', reviewRunId: run.reviewRunId, heartsRemaining: run.heartsRemaining }];
  }

  function applyReviewRunCompleted(state, event, learningDay, catalog) {
    if (!prepareLearningDay(state, learningDay)) {
      return [{ type: 'clock-rollback-blocked', learningDay }];
    }
    const run = state.reviewRuns[event.reviewRunId];
    const effects = [];
    for (const reviewCellId of run.reviewCellIds) {
      const attempt = run.temporaryResults[reviewCellId];
      const cell = findReviewCell(state, catalog.getTeachingUnit(event.unitId), reviewCellId);
      const independent = !run.rescueUsed
        && attempt.outcome === 'independent-retrieval'
        && attempt.supportLevel === 'none'
        && validLearningDay(cell.lastLearningDay)
        && learningDay > cell.lastLearningDay
        && attempt.contextId !== cell.contextId;
      const recorded = {
        ...attempt,
        outcome: independent ? 'independent-retrieval' : 'review-assisted-practice',
        supportLevel: run.rescueUsed ? 'model' : attempt.supportLevel,
        rescueUsed: run.rescueUsed || attempt.rescueUsed === true,
        learningDay
      };
      cell.reviewAttempts = [...(cell.reviewAttempts || []), recorded].slice(-16);
      cell.lastReviewOutcome = recorded.outcome;
      cell.lastLearningDay = learningDay;
      cell.audioUnavailable = false;
      if (independent) {
        cell.lastIndependentDay = learningDay;
        cell.intervalStage = Math.min(REVIEW_INTERVAL_DAYS.length, (cell.intervalStage || 0) + 1);
        cell.nextDueDay = addDays(
          learningDay,
          REVIEW_INTERVAL_DAYS[Math.max(0, cell.intervalStage - 1)]
        );
        effects.push(...applyReview(state, {
          unitId: event.unitId,
          targetId: attempt.targetId,
          outcome: 'independent',
          contextId: attempt.contextId,
          evidenceMode: attempt.evidenceMode
        }, learningDay, catalog));
      } else {
        cell.hadError = true;
        cell.nextDueDay = addDays(learningDay, 1);
        effects.push(...applyReview(state, {
          unitId: event.unitId,
          targetId: attempt.targetId,
          outcome: 'supported',
          contextId: attempt.contextId,
          evidenceMode: attempt.evidenceMode
        }, learningDay, catalog));
      }
    }
    delete state.reviewRuns[event.reviewRunId];
    effects.push({ type: 'review-run-completed', reviewRunId: event.reviewRunId });
    return effects;
  }

  function isTargetMastered(targetState) {
    if (targetState.evidence.length < 2) return false;
    return new Set(targetState.evidence.map(item => item.learningDay)).size >= 2
      && new Set(targetState.evidence.map(item => item.contextId)).size >= 2;
  }

  function retainMasteryEvidence(existing, nextEvidence) {
    if (existing.length < 2) return [...existing, nextEvidence];
    if (isTargetMastered({ evidence: existing })) return existing;

    const complementary = [...existing]
      .reverse()
      .find(item => item.learningDay !== nextEvidence.learningDay
        && item.contextId !== nextEvidence.contextId);
    if (complementary) return [complementary, nextEvidence];
    return [existing[existing.length - 1], nextEvidence];
  }

  function reviewRiskRank(cell) {
    if (cell.audioUnavailable) return 0;
    if (cell.rescueUsed || cell.outcome === 'partner-rescue'
      || cell.outcome === 'supported' || cell.supportLevel === 'model'
      || cell.supportLevel === 'focused-cue' || cell.supportLevel === 'partial-cue'
      || cell.supportLevel === 'reobserve') return 1;
    if (cell.hadError) return 2;
    return 3;
  }

  function compareReviewCells(left, right) {
    const leftRisk = Number.isInteger(left.riskRank) ? left.riskRank : reviewRiskRank(left);
    const rightRisk = Number.isInteger(right.riskRank) ? right.riskRank : reviewRiskRank(right);
    return String(left.nextDueDay || '9999-12-31').localeCompare(String(right.nextDueDay || '9999-12-31'))
      || leftRisk - rightRisk
      || String(left.lastIndependentDay || '').localeCompare(String(right.lastIndependentDay || ''))
      || left.reviewCellId.localeCompare(right.reviewCellId);
  }

  function reviewChannelGroup(channel) {
    if (String(channel).includes('audio')) return 'word-audio';
    if (channel === 'word-form') return 'word-form';
    return 'communicative';
  }

  function sameReviewPriority(left, right) {
    return left.nextDueDay === right.nextDueDay
      && left.riskRank === right.riskRank
      && (left.lastIndependentDay || null) === (right.lastIndependentDay || null);
  }

  function balanceReviewChannels(cells) {
    const balanced = [];
    for (let start = 0; start < cells.length;) {
      let end = start + 1;
      while (end < cells.length && sameReviewPriority(cells[start], cells[end])) end += 1;
      const priorityTier = cells.slice(start, end);
      const buckets = new Map([
        ['word-audio', []],
        ['word-form', []],
        ['communicative', []]
      ]);
      for (const cell of priorityTier) buckets.get(cell.reviewChannelGroup).push(cell);
      while ([...buckets.values()].some(bucket => bucket.length)) {
        for (const bucket of buckets.values()) {
          if (bucket.length) balanced.push(bucket.shift());
        }
      }
      start = end;
    }
    return balanced;
  }

  function separateAdjacentVariants(cells) {
    const ordered = [...cells];
    for (let index = 1; index < ordered.length; index += 1) {
      if (ordered[index - 1].variantId !== ordered[index].variantId) continue;
      const swapIndex = ordered.findIndex((candidate, candidateIndex) => (
        candidateIndex > index && candidate.variantId !== ordered[index - 1].variantId
      ));
      if (swapIndex < 0) continue;
      [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
    }
    return ordered;
  }

  function transitionEffects(before, after) {
    const effects = [];
    for (const [unitId, unit] of Object.entries(after.units)) {
      const previous = before.units[unitId];
      for (const [targetId, target] of Object.entries(unit.targets)) {
        if (!previous.targets[targetId].mastered && target.mastered) {
          effects.push({ type: 'target-mastered', unitId, targetId });
        }
      }
      if (!previous.mastered && unit.mastered) {
        effects.push({ type: 'landmark-mastered', unitId, landmarkId: unit.landmarkId });
      }
    }
    for (const [districtId, district] of Object.entries(after.districts)) {
      const previous = before.districts[districtId];
      for (const badge of district.stageBadges) {
        const previousBadge = previous.stageBadges.find(candidate => candidate.badgeId === badge.badgeId);
        if (!previousBadge.eligible && badge.eligible) {
          effects.push({ type: 'stage-badge-eligible', districtId, badgeId: badge.badgeId });
        }
      }
      if (!previous.finalCrestEligible && district.finalCrestEligible) {
        effects.push({ type: 'final-crest-eligible', districtId });
      }
    }
    return effects;
  }

  function project(state, revision, catalog, currentDay) {
    const units = {};
    const districts = {};

    for (const unit of catalogUnits(catalog)) {
      const stored = state.units[unit.unitId];
      const targetProjection = {};
      for (const target of unit.targets) {
        const targetState = state.targets[target.targetId];
        const mastered = isTargetMastered(targetState);
        const nextDue = validLearningDay(currentDay)
          && (!state.learningClock.maxObservedDay || currentDay >= state.learningClock.maxObservedDay)
          && Boolean(targetState.nextDueDay)
          && currentDay >= targetState.nextDueDay;
        const projectedCells = Object.fromEntries(Object.entries(targetState.variantCells || {})
          .map(([cellId, cell]) => [cellId, unit.experienceRevision ? clone(cell) : {
            variantId: cell.variantId,
            sourceRef: cell.sourceRef,
            channel: cell.channel,
            attemptCount: cell.attemptCount,
            lastOutcome: cell.lastOutcome,
            lastSupportLevel: cell.lastSupportLevel,
            lastLearningDay: cell.lastLearningDay,
            nextDueDay: cell.nextDueDay
          }]));
        targetProjection[target.targetId] = {
          targetId: target.targetId,
          mastered,
          evidenceCount: targetState.evidence.length,
          evidence: clone(targetState.evidence),
          lastOutcome: targetState.lastOutcome,
          lastLearningDay: targetState.lastLearningDay,
          intervalStage: targetState.intervalStage,
          nextDueDay: targetState.nextDueDay,
          nextDue,
          variantCells: projectedCells,
          ...(unit.experienceRevision ? { reviewCells: clone(projectedCells) } : {})
        };
      }
      const mastered = stored.buildStage === 5
        && Object.values(targetProjection).every(target => target.mastered);
      const unitReviewCells = unit.experienceRevision
        ? Object.assign({}, ...Object.values(targetProjection).map(target => target.reviewCells))
        : null;
      units[unit.unitId] = {
        unitId: unit.unitId,
        experienceRevision: stored.experienceRevision,
        diagnosticArchive: clone(stored.diagnosticArchive),
        districtId: unit.districtId,
        landmarkId: unit.landmarkId,
        lessonIds: [...unit.lessonIds],
        checkpoint: clone(stored.checkpoint),
        unitAttemptId: stored.unitAttemptId,
        pendingUiContinuation: clone(stored.pendingUiContinuation),
        rolePracticeProgress: clone(stored.rolePracticeProgress),
        completedMicrotaskIds: clone(stored.completedMicrotaskIds),
        skippedMicrotaskIds: clone(stored.skippedMicrotaskIds),
        resolvedMicrotaskIds: [...new Set([
          ...stored.completedMicrotaskIds,
          ...stored.skippedMicrotaskIds
        ])],
        storyFacts: clone(stored.storyFacts),
        sourceContacts: clone(stored.sourceContacts),
        buildStage: stored.buildStage,
        adventureHeartsRemaining: stored.adventureHeartsRemaining,
        ...(unit.experienceRevision ? { completionReadback: completionReadback(state, unit) } : {}),
        ...(unit.experienceRevision ? { reviewCells: clone(unitReviewCells) } : {}),
        mastered,
        visualState: mastered ? 'state-mastered' : `state-${stored.buildStage}`,
        nextDue: Object.values(targetProjection).some(target => target.nextDue),
        targets: targetProjection
      };
    }

    for (const districtId of new Set(catalogUnits(catalog).map(unit => unit.districtId))) {
      const districtUnits = Object.values(units).filter(unit => unit.districtId === districtId);
      const challengeStars = state.districts[districtId]?.challengeStars || 0;
      const landmarkCoverage = state.districts[districtId]?.starredUnitIds.length || 0;
      const masteredTargetCount = districtUnits
        .flatMap(unit => Object.values(unit.targets))
        .filter(target => target.mastered).length;
      const masteredLandmarkCount = districtUnits.filter(unit => unit.mastered).length;
      districts[districtId] = {
        districtId,
        challengeStars,
        landmarkCoverage,
        masteredTargetCount,
        masteredLandmarkCount,
        stageBadges: STAGE_BADGE_THRESHOLDS.map(threshold => ({
          ...threshold,
          eligible: challengeStars >= threshold.challengeStars
            && landmarkCoverage >= threshold.landmarkCoverage
        })),
        finalCrestEligible: masteredTargetCount === districtUnits
          .flatMap(unit => Object.values(unit.targets)).length
          && masteredLandmarkCount === districtUnits.length
      };
    }

    return deepFreeze({
      schemaVersion: SCHEMA_VERSION,
      revision,
      units,
      districts,
      reviewRuns: clone(state.reviewRuns),
      learningClock: {
        currentLearningDay: validLearningDay(currentDay) ? currentDay : null,
        maxObservedDay: state.learningClock.maxObservedDay,
        dailyChallengeStars: currentDay === state.learningClock.maxObservedDay
          ? state.learningClock.dailyChallengeStars
          : 0
      }
    });
  }

  function reduceEvent(baseState, baseRevision, event, learningDay, catalog) {
    const before = project(baseState, baseRevision, catalog, learningDay);
    const candidate = clone(baseState);
    let effects = [];
    if (event.type === 'checkpoint-completed') {
      effects = applyCheckpoint(candidate, event, learningDay, catalog);
    }
    if (event.type === 'microtask-completed') {
      effects = applyMicrotaskCompletion(candidate, event, learningDay, catalog);
    }
    if (event.type === 'microtask-skipped') {
      effects = applyMicrotaskSkip(candidate, event, learningDay, catalog);
    }
    if (
      event.type === 'role-practice-round-completed'
      || event.type === 'role-practice-round-skipped'
    ) {
      effects = applyRolePracticeRoundDisposition(candidate, event, learningDay, catalog);
    }
    if (event.type === 'ui-continuation-acknowledged') {
      effects = applyUiContinuationAcknowledgement(candidate, event);
    }
    if (event.type === 'unit-built') effects = applyUnitBuilt(candidate, event);
    if (event.type === 'formative-attempt') effects = applyFormative(candidate, event, learningDay);
    if (event.type === 'review-run-started') effects = applyReviewRunStart(candidate, event);
    if (event.type === 'review-run-completed') {
      effects = applyReviewRunCompleted(candidate, event, learningDay, catalog);
    }
    if (event.type === 'review-run-deferred') {
      delete candidate.reviewRuns[event.reviewRunId];
      effects = [{ type: 'review-run-deferred', reviewRunId: event.reviewRunId }];
    }
    if (event.type === 'review-attempt') {
      effects = event.reviewRunId
        ? applyV2ReviewAttempt(candidate, event, learningDay)
        : applyReview(candidate, event, learningDay, catalog);
    }
    effects = effects.concat(transitionEffects(
      before,
      project(candidate, baseRevision + 1, catalog, learningDay)
    ));
    candidate.processedEventIds.push(processedEventToken(event, catalog));
    candidate.processedEventIds = candidate.processedEventIds.slice(-PROCESSED_EVENT_LIMIT);
    return { candidate, effects };
  }

  function open({ store, key, catalog, clock }) {
    if (!store || typeof store.load !== 'function' || typeof store.commit !== 'function') {
      throw new TypeError('learning-ledger requires a store with load and commit');
    }
    if (!key || typeof key !== 'string') throw new TypeError('learning-ledger requires a storage key');
    if (!catalog) throw new TypeError('learning-ledger requires a curriculum catalog');
    if (!clock || typeof clock.learningDay !== 'function') {
      throw new TypeError('learning-ledger clock must expose learningDay()');
    }

    const loaded = store.load(key);
    let revision = Number.isInteger(loaded?.revision) && loaded.revision >= 0 ? loaded.revision : 0;
    let state = normalizeState(loaded, catalog);

    function read() {
      return project(state, revision, catalog, clock.learningDay());
    }

    function planReview({ unitId, limit = 4 } = {}) {
      const unit = catalog.getTeachingUnit(unitId);
      if (!unit) throw new TypeError('planReview requires a valid unitId');
      const learningDay = clock.learningDay();
      if (!validLearningDay(learningDay)) throw new TypeError('clock.learningDay() must return YYYY-MM-DD');
      const boundedLimit = Math.max(2, Math.min(4, Number.isInteger(limit) ? limit : 4));
      const cells = unit.targets.flatMap(target => (
        Object.values(state.targets[target.targetId]?.variantCells || {})
          .filter(cell => cell.reviewCellId && cell.nextDueDay)
          .map(cell => ({
            reviewCellId: cell.reviewCellId,
            resultId: cell.resultId,
            challengeRef: cell.challengeRef,
            targetId: target.targetId,
            variantId: cell.variantId,
            sourceRef: cell.sourceRef,
            channel: cell.channel,
            reviewChannelGroup: reviewChannelGroup(cell.channel),
            mainContextId: cell.contextId,
            reviewContextId: cell.reviewContextId,
            evidenceMode: cell.evidenceMode,
            reviewContextIds: Object.keys(unit.reviewContexts || {}),
            nextDueDay: cell.nextDueDay,
            lastIndependentDay: cell.lastIndependentDay,
            riskRank: reviewRiskRank(cell),
            due: learningDay >= cell.nextDueDay
          }))
      ));
      if (cells.length === 0) return deepFreeze([]);
      const due = balanceReviewChannels(cells.filter(cell => cell.due).sort(compareReviewCells));
      const upcoming = balanceReviewChannels(cells.filter(cell => !cell.due).sort(compareReviewCells));
      const selected = due.slice(0, boundedLimit);
      for (const candidate of upcoming) {
        if (selected.length >= Math.min(2, boundedLimit)) break;
        selected.push(candidate);
      }
      return deepFreeze(separateAdjacentVariants(selected).map(clone));
    }

    function apply(event) {
      const validationError = validateEvent(event, catalog, state);
      if (validationError) {
        return {
          status: 'rejected',
          persisted: false,
          reason: validationError,
          effects: [],
          snapshot: read()
        };
      }
      const eventToken = processedEventToken(event, catalog);
      if (state.processedEventIds.includes(eventToken)) {
        return { status: 'duplicate', persisted: true, reason: null, effects: [], snapshot: read() };
      }

      const learningDay = clock.learningDay();
      if (!validLearningDay(learningDay)) throw new TypeError('clock.learningDay() must return YYYY-MM-DD');
      for (let attempt = 0; attempt < 2; attempt += 1) {
        if (state.processedEventIds.includes(eventToken)) {
          return { status: 'duplicate', persisted: true, reason: null, effects: [], snapshot: read() };
        }
        const { candidate, effects } = reduceEvent(state, revision, event, learningDay, catalog);
        const committed = store.commit(key, { expectedRevision: revision, value: candidate });
        if (committed?.status === 'committed' && committed.persisted === true) {
          state = normalizeState({ status: 'ok', value: candidate }, catalog);
          revision = Number.isInteger(committed.revision) ? committed.revision : revision + 1;
          return { status: 'applied', persisted: true, reason: null, effects, snapshot: read() };
        }
        if (committed?.status === 'conflict' && Number.isInteger(committed.revision)) {
          state = normalizeState({ status: 'ok', value: committed.value }, catalog);
          revision = committed.revision;
          continue;
        }
        return {
          status: 'not-persisted',
          persisted: false,
          reason: committed?.status || 'unavailable',
          effects: [],
          snapshot: read()
        };
      }
      return {
        status: 'not-persisted',
        persisted: false,
        reason: 'conflict',
        effects: [],
        snapshot: read()
      };
    }

    return Object.freeze({ apply, read, planReview });
  }

  return Object.freeze({ open });
});
