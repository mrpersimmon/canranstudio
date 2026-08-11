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
  const ALL_OUTCOMES = new Set([...REVIEW_OUTCOMES, ...FORMATIVE_OUTCOMES]);
  const EVENT_TYPES = new Set([
    'checkpoint-completed',
    'unit-built',
    'formative-attempt',
    'review-attempt'
  ]);
  const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30];
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
      units[unit.unitId] = { checkpoint: null, buildStage: 0 };
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
          nextDueDay: null
        };
      }
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      processedEventIds: [],
      units,
      targets,
      districts,
      learningClock: { maxObservedDay: null, dailyChallengeStars: 0 }
    };
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
      defaults.units[unit.unitId].buildStage = Number.isInteger(stored.buildStage)
        ? Math.max(0, Math.min(5, stored.buildStage))
        : 0;
      if (stored.checkpoint && typeof stored.checkpoint === 'object') {
        defaults.units[unit.unitId].checkpoint = {
          checkpointId: typeof stored.checkpoint.checkpointId === 'string'
            ? stored.checkpoint.checkpointId
            : null,
          beatId: typeof stored.checkpoint.beatId === 'string' ? stored.checkpoint.beatId : null,
          learningDay: validLearningDay(stored.checkpoint.learningDay)
            ? stored.checkpoint.learningDay
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

  function validateEvent(event, catalog) {
    if (!event || typeof event !== 'object') return 'event-required';
    if (typeof event.eventId !== 'string' || event.eventId.trim() === '') return 'eventId-required';
    if (!EVENT_TYPES.has(event.type)) return 'event-type-invalid';
    const unit = catalog.getTeachingUnit(event.unitId);
    if (!unit) return 'unit-invalid';

    if (event.type === 'checkpoint-completed') {
      if (typeof event.checkpointId !== 'string' || event.checkpointId.trim() === '') {
        return 'checkpointId-required';
      }
      const beat = event.beatId ? unit.beats.find(candidate => candidate.beatId === event.beatId) : null;
      if (event.beatId && !beat) return 'beat-invalid';
      if (event.buildStage !== undefined && (!Number.isInteger(event.buildStage)
        || event.buildStage < 0 || event.buildStage > 5)) return 'buildStage-invalid';
      if (beat && event.buildStage !== undefined && beat.buildStage !== event.buildStage) {
        return 'buildStage-mismatch';
      }
      return null;
    }
    if (event.type === 'unit-built') {
      if (event.buildStage !== undefined && event.buildStage !== 5) return 'buildStage-invalid';
      return null;
    }

    const target = findTarget(unit, event.targetId);
    if (!target) return 'target-invalid';
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
    const buildStage = event.buildStage ?? beat?.buildStage;
    if (Number.isInteger(buildStage) && buildStage < stored.buildStage) return [];
    if (Number.isInteger(buildStage)) stored.buildStage = Math.max(stored.buildStage, buildStage);
    stored.checkpoint = {
      checkpointId: event.checkpointId,
      beatId: beat?.beatId || null,
      learningDay
    };
    return [];
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
        targetProjection[target.targetId] = {
          targetId: target.targetId,
          mastered,
          evidenceCount: targetState.evidence.length,
          evidence: clone(targetState.evidence),
          lastOutcome: targetState.lastOutcome,
          lastLearningDay: targetState.lastLearningDay,
          intervalStage: targetState.intervalStage,
          nextDueDay: targetState.nextDueDay,
          nextDue
        };
      }
      const mastered = stored.buildStage === 5
        && Object.values(targetProjection).every(target => target.mastered);
      units[unit.unitId] = {
        unitId: unit.unitId,
        districtId: unit.districtId,
        landmarkId: unit.landmarkId,
        lessonIds: [...unit.lessonIds],
        checkpoint: clone(stored.checkpoint),
        buildStage: stored.buildStage,
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
    if (event.type === 'unit-built') effects = applyUnitBuilt(candidate, event);
    if (event.type === 'formative-attempt') effects = applyFormative(candidate, event, learningDay);
    if (event.type === 'review-attempt') effects = applyReview(candidate, event, learningDay, catalog);
    effects = effects.concat(transitionEffects(
      before,
      project(candidate, baseRevision + 1, catalog, learningDay)
    ));
    candidate.processedEventIds.push(event.eventId);
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

    function apply(event) {
      const validationError = validateEvent(event, catalog);
      if (validationError) {
        return {
          status: 'rejected',
          persisted: false,
          reason: validationError,
          effects: [],
          snapshot: read()
        };
      }
      if (state.processedEventIds.includes(event.eventId)) {
        return { status: 'duplicate', persisted: true, reason: null, effects: [], snapshot: read() };
      }

      const learningDay = clock.learningDay();
      if (!validLearningDay(learningDay)) throw new TypeError('clock.learningDay() must return YYYY-MM-DD');
      for (let attempt = 0; attempt < 2; attempt += 1) {
        if (state.processedEventIds.includes(event.eventId)) {
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

    return Object.freeze({ apply, read });
  }

  return Object.freeze({ open });
});
