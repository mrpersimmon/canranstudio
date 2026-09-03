'use strict';

const { test, expect } = require('@playwright/test');
const catalog = require('../../core/curriculum-catalog');

const EXPERIENCE_PATH = '/poc/lesson1-2-experience/?package-test-bypass=1';
const unit = catalog.getTeachingUnit('NCE-U01');
const tasks = unit.beats.flatMap(beat => beat.microtasks || []);
const taskById = new Map(tasks.map(task => [task.microtaskId, task]));
const STORAGE_KEY = `poc:learning-experience:${unit.unitId}:${unit.experienceRevision}`;
const PENDING_COMMIT_KEY = `learning-runtime:${unit.unitId}:${unit.experienceRevision}:pending-commit`;
const ACTIVE_SCENE_MODES = new Set([
  'dialogue-stage',
  'object-workbench',
  'grammar-lab',
  'story-journey'
]);
const OUTCOME_REST_VARIANTS = new Set([
  'lesson1-chapter-stop',
  'lesson2-midpoint-rest-stop',
  'unit-built'
]);
const outcomePracticeById = new Map((unit.experience.outcomePractices || []).map(practice => (
  [practice.practiceId, practice]
)));
const sourceByRef = new Map(Object.values(unit.lessonContent).flatMap(lesson => (
  Object.entries(lesson.sources || {})
)));

function app(page) {
  return page.locator('.station-app');
}

async function installHarness(page, { audioMode = 'manual' } = {}) {
  await page.addInitScript(({ mode, ledgerKey }) => {
    const core = {};
    const wrappedValues = new Map();
    const wrapCoreApi = (name, wrap) => {
      Object.defineProperty(core, name, {
        configurable: true,
        enumerable: true,
        get: () => wrappedValues.get(name),
        set: value => wrappedValues.set(name, wrap(value))
      });
    };

    window.__runtimeEffects = [];
    window.__lessonMotionStarts = [];
    addEventListener('animationstart', event => {
      const snapshot = window.__lessonScene?.runtime?.snapshot?.() || null;
      window.__lessonMotionStarts.push({
        animationName: event.animationName,
        segmentId: snapshot?.audio?.segmentId || null,
        speakerRole: event.target?.dataset?.speakerRole || null,
        targetClass: event.target?.className || ''
      });
    }, true);
    wrapCoreApi('learningRuntime', api => ({
      ...api,
      create(options) {
        const originalSink = options.effectSink;
        return api.create({
          ...options,
          effectSink(effect) {
            window.__runtimeEffects.push(structuredClone(effect));
            originalSink(effect);
          }
        });
      }
    }));
    wrapCoreApi('learningMicrotaskScene', api => ({
      ...api,
      mount(options) {
        const mounted = api.mount(options);
        window.__lessonScene = mounted;
        return mounted;
      }
    }));
    Object.defineProperty(window, 'CanranCore', {
      configurable: true,
      get: () => core,
      set: value => {
        if (value && value !== core) Object.assign(core, value);
      }
    });

    window.__audioStarts = [];
    window.__pendingCourseAudio = [];
    window.__courseAudioGestureGranted = false;
    addEventListener('click', () => {
      window.__courseAudioGestureGranted = true;
    }, true);
    let audioSequence = 0;
    class ControlledAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = String(src || '');
        this.preload = '';
        this.loop = false;
        this.volume = 1;
        this.sequence = ++audioSequence;
        this.paused = false;
        this.finished = false;
      }
      pause() {
        this.paused = true;
      }
      play() {
        this.paused = false;
        const runtimeSnapshot = window.__lessonScene?.runtime?.snapshot?.() || null;
        const renderedApp = document.querySelector('.station-app');
        const renderedWorld = document.querySelector('.station-world');
        window.__audioStarts.push({
          src: this.src,
          runtimeMicrotaskId: runtimeSnapshot?.microtaskId || null,
          runtimeMomentId: runtimeSnapshot?.currentPresentationMomentId || null,
          renderedMicrotaskId: renderedApp?.dataset.runtimeMicrotask || null,
          renderedMomentId: renderedWorld?.dataset.presentationMoment || null
        });
        if (mode === 'autoplay-blocked' && !window.__courseAudioGestureGranted) {
          return Promise.reject(new DOMException(
            'Autoplay requires a user gesture',
            'NotAllowedError'
          ));
        }
        window.__pendingCourseAudio.push(this);
        if (mode === 'instant') queueMicrotask(() => this.finish());
        return Promise.resolve();
      }
      finish() {
        if (this.finished || this.paused) return false;
        this.finished = true;
        this.dispatchEvent(new Event('ended'));
        return true;
      }
    }
    window.__finishNextCourseAudio = () => {
      const pending = window.__pendingCourseAudio.find(audio => !audio.finished && !audio.paused);
      if (!pending) return null;
      const src = pending.src;
      pending.finish();
      return src;
    };
    window.__pendingCourseAudioCount = () => (
      window.__pendingCourseAudio.filter(audio => !audio.finished && !audio.paused).length
    );
    Object.defineProperty(window, 'Audio', { configurable: true, value: ControlledAudio });

    const originalSetItem = Storage.prototype.setItem;
    window.__failLedgerWrites = false;
    Storage.prototype.setItem = function guardedSetItem(key, value) {
      if (window.__failLedgerWrites && String(key) === ledgerKey) {
        throw new DOMException('injected ledger write failure', 'QuotaExceededError');
      }
      return originalSetItem.call(this, key, value);
    };
  }, { mode: audioMode, ledgerKey: STORAGE_KEY });
}

async function openFresh(page, options = {}) {
  await page.emulateMedia({ reducedMotion: options.reducedMotion || 'reduce' });
  await installHarness(page, options);
  await page.goto(EXPERIENCE_PATH);
  await page.evaluate(([progressKey, pendingKey]) => {
    localStorage.removeItem(progressKey);
    localStorage.removeItem(pendingKey);
  }, [STORAGE_KEY, PENDING_COMMIT_KEY]);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(window.__lessonScene))).toBe(true);
}

async function startOrResume(page) {
  await expect.poll(() => app(page).getAttribute('data-runtime-status'))
    .not.toBe('idle');
  await expect(page.locator('[data-action="start"]')).toHaveCount(0);
}

async function reloadAndResume(page) {
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(window.__lessonScene))).toBe(true);
  await startOrResume(page);
}

async function runtimeSnapshot(page) {
  return page.evaluate(() => window.__lessonScene.runtime.snapshot());
}

async function ledgerProjection(page) {
  return page.evaluate(() => window.__lessonScene.ledger.read());
}

async function durableLedgerRecord(page) {
  return page.evaluate(storageKey => localStorage.getItem(storageKey), STORAGE_KEY);
}

async function mainlineIsolationRecord(page) {
  return page.evaluate(storageKey => ({
    snapshot: window.__lessonScene.runtime.snapshot(),
    ledger: window.__lessonScene.ledger.read(),
    rawStorage: localStorage.getItem(storageKey)
  }), STORAGE_KEY);
}

async function expectMainlineUnchanged(page, baseline) {
  expect(await mainlineIsolationRecord(page)).toEqual(baseline);
}

async function expectOptionalPracticeHasNoGamification(page) {
  const practice = page.locator('.outcome-practice-card');
  await expect(practice).toBeVisible();
  await expect(page.locator('.adventure-heart-gauge, [aria-label*="冒险心"]')).toHaveCount(0);
  await expect(practice.locator([
    '.practice-score', '[data-practice-score]', 'meter', 'progress',
    '.practice-microphone', '[data-microphone]', '[data-action*="record"]',
    '[data-action*="microphone"]', '.certificate', '[data-certificate]'
  ].join(','))).toHaveCount(0);
  await expect(practice.getByRole('button', {
    name: /录音|麦克风|开始说话|领取证书|查看证书/
  })).toHaveCount(0);
}

async function courseAudioStartCount(page) {
  return page.evaluate(() => window.__audioStarts.length);
}

async function expectPracticeAudioStarted(page, sourceRef, startsBefore) {
  const authored = sourceByRef.get(sourceRef);
  expect(authored?.audioSrc, `${sourceRef} must own a catalog audio asset`).toBeTruthy();
  await expect.poll(() => courseAudioStartCount(page)).toBe(startsBefore + 1);
  const latest = await page.evaluate(() => window.__audioStarts.at(-1));
  expect(latest.src.endsWith(authored.audioSrc)).toBe(true);
  await expect.poll(() => page.evaluate(() => window.__pendingCourseAudioCount())).toBe(1);
  return startsBefore + 1;
}

async function finishRoleSwapTurn(page, sourceRef, { hidden, startsBefore }) {
  const line = page.locator(`.practice-dialogue-line[data-source-ref="${sourceRef}"]`);
  if (hidden) {
    await expect(line).toHaveClass(/is-hidden-turn/);
    await page.locator('[data-action="practice-reveal"]').click();
    await expect(line).not.toHaveClass(/is-hidden-turn/);
  }
  await expect(line).toContainText(sourceByRef.get(sourceRef).text);
  const startsAfter = await expectPracticeAudioStarted(page, sourceRef, startsBefore);
  await expect(page.locator(
    '[data-action="practice-next"], [data-action="practice-finish"]'
  )).toHaveCount(0);
  await finishOneAudio(page);
  return startsAfter;
}

async function finishFormalRoleRound(page, practice, round, startsBefore) {
  await page.locator(
    `[data-action="practice-role-select"][data-value="${round.roundId}"]`
  ).click();
  await expect(page.locator('.outcome-practice-card--role-enactment'))
    .toHaveAttribute('data-practice-phase', /awaiting-reveal|audio-playing/);
  for (const sourceRef of round.dialogueTurnRefs) {
    const line = page.locator(`.role-practice-line[data-source-ref="${sourceRef}"]`);
    if (round.hiddenTurnRefs.includes(sourceRef)) {
      await expect(line).toHaveClass(/is-hidden/);
      await page.locator('[data-action="practice-reveal"]').click();
      await expect(line).not.toHaveClass(/is-hidden/);
    }
    await expect(line).toContainText(sourceByRef.get(sourceRef).text);
    startsBefore = await expectPracticeAudioStarted(page, sourceRef, startsBefore);
    await expect(page.locator('[data-action="practice-role-select"]')).toHaveCount(0);
    await finishOneAudio(page);
  }
  return startsBefore;
}

async function completeFormalRoleStage(page, tracking = {}) {
  const task = taskById.get('L01-M12');
  const practice = task.steps[0].practice;
  await expect(page.locator('.outcome-practice-card--role-enactment')).toBeVisible();
  let startsBefore = await courseAudioStartCount(page);
  for (const round of practice.rounds) {
    startsBefore = await finishFormalRoleRound(page, practice, round, startsBefore);
  }
  await expect(page.locator('.outcome-practice-card--role-enactment'))
    .toHaveAttribute('data-practice-phase', 'all-roles-complete');
  tracking.activeTaskIds?.add(task.microtaskId);
  tracking.sceneModes?.add(task.presentation.sceneMode);
  tracking.presentationMoments?.add(`${task.microtaskId}:${task.presentation.moments[0].momentId}`);
  await page.locator('[data-action="practice-continue-course"]').click();
}

function recapOptionMatchesRule(option, rule) {
  if (rule.acceptedEntityId) return option.entityId === rule.acceptedEntityId;
  if (rule.acceptedSourceRef) return option.sourceRef === rule.acceptedSourceRef;
  if (rule.acceptedContentRef) return option.contentRef === rule.acceptedContentRef;
  return Array.isArray(rule.acceptedEntityIds) && rule.acceptedEntityIds.includes(option.entityId);
}

async function answerRecapCorrectly(page, item, finalItem) {
  const correctOption = item.options.find(option => recapOptionMatchesRule(option, item.answerRule));
  expect(correctOption, `${item.itemId} must declare one accepted option`).toBeTruthy();
  const startsBefore = await courseAudioStartCount(page);
  await page.locator(
    `[data-action="practice-submit"][data-value="${correctOption.optionId}"]`
  ).click();
  await expectPracticeAudioStarted(page, item.correctAudioRef, startsBefore);
  if (item.answerFairness?.candidateLanguageBoundary === 'source-text-only') {
    await expect(page.locator('.practice-options strong')).toHaveText(
      item.options.map(option => sourceByRef.get(option.sourceRef).text)
    );
    await expect(page.locator('.practice-options small')).toHaveCount(0);
    await expect(page.locator('.practice-answer-feedback.is-correct')).toHaveCount(0);
  }
  await expect(page.locator(
    '[data-action="practice-next"], [data-action="practice-finish"]'
  )).toHaveCount(0);
  await finishOneAudio(page);
  await expect(page.locator(
    `[data-action="practice-${finalItem ? 'finish' : 'next'}"]`
  )).toBeVisible();
}

function activeContract(snapshot) {
  const task = taskById.get(snapshot.microtaskId);
  const step = task?.steps.find(candidate => candidate.stepId === snapshot.stepId);
  const challenge = step?.challenges?.find(candidate => (
    candidate.challengeRef === snapshot.challengeRef
  )) || null;
  return { task, step, challenge };
}

function languageText(refId) {
  const item = sourceByRef.get(refId) || unit.authoredContent?.[refId];
  return item?.text || item?.title || null;
}

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

async function presentationObservation(page) {
  return page.evaluate(() => {
    const snapshot = window.__lessonScene.runtime.snapshot();
    const station = document.querySelector('.station-app');
    const world = document.querySelector('.station-world');
    const directIds = selector => [...document.querySelectorAll(selector)]
      .map(element => element.dataset.entityId)
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right));
    return {
      snapshot,
      station: station ? {
        sceneMode: station.dataset.sceneMode || '',
        sceneVariant: station.dataset.sceneVariant || '',
        presentationMoment: station.dataset.presentationMoment || '',
        primaryMotion: station.dataset.primaryMotion || '',
        endState: station.dataset.endState || ''
      } : null,
      world: world ? {
        sceneMode: world.dataset.sceneMode || '',
        sceneVariant: world.dataset.sceneVariant || '',
        presentationMoment: world.dataset.presentationMoment || '',
        primaryMotion: world.dataset.primaryMotion || '',
        endState: world.dataset.endState || '',
        visibleLanguageRefs: (world.dataset.visibleLanguageRefs || '').split(/\s+/).filter(Boolean)
      } : null,
      participantEntityIds: directIds([
        '.scene-people > [data-entity-id]',
        '.role-practice-world > .role-practice-character[data-entity-id]'
      ].join(',')),
      focusEntityIds: directIds([
        '.scene-people > [data-entity-id].is-moment-focus',
        '.scene-props > [data-entity-id].is-moment-focus',
        '.role-practice-world > .role-practice-character[data-entity-id]',
        '.role-practice-counter-surface > .role-practice-counter-prop[data-entity-id]'
      ].join(',')),
      manualPresentation: Boolean(world?.querySelector('[data-presentation-manual="true"]'))
    };
  });
}

async function expectExactVisibleText(page, text, refId) {
  expect(text, `${refId} must resolve to catalog-owned visible language`).toBeTruthy();
  await expect.poll(() => page.evaluate(expectedText => (
    [...document.querySelectorAll('.station-world *')].some(element => {
      const rendered = (element.innerText || '').trim();
      if (rendered !== expectedText) return false;
      const style = getComputedStyle(element);
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity || 1) > 0
        && element.getClientRects().length > 0;
    })
  ), text), { message: `${refId} must be visibly rendered as ${JSON.stringify(text)}` }).toBe(true);
}

async function settleSceneViewport(page, viewport) {
  const portraitMaster = viewport.width <= 680 || viewport.width * 5 <= viewport.height * 4;
  const expectedMinHeight = portraitMaster ? 1140 : 650;
  await expect.poll(() => page.locator('.station-world').evaluate((world, expected) => ({
    width: innerWidth,
    height: innerHeight,
    minHeightReady: Number.parseFloat(getComputedStyle(world).minHeight) >= expected.minHeight
  }), { minHeight: expectedMinHeight })).toEqual({
    width: viewport.width,
    height: viewport.height,
    minHeightReady: true
  });
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
}

async function expectNoProtectedRegionCollision(page) {
  const report = await page.locator('.station-world').evaluate(world => {
    const visibleBox = element => {
      if (!element) return null;
      const style = getComputedStyle(element);
      if (
        style.display === 'none'
        || style.visibility === 'hidden'
        || Number(style.opacity || 1) === 0
        || element.getClientRects().length === 0
      ) return null;
      const box = element.getBoundingClientRect();
      return {
        label: element.matches('.scene-prop')
          ? `prop:${element.dataset.entityId}`
          : element.className,
        left: box.left, top: box.top, right: box.right, bottom: box.bottom
      };
    };
    const overlapArea = (left, right) => (
      Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left))
      * Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top))
    );
    const props = [...world.querySelectorAll('.scene-props > .scene-prop')]
      .map(visibleBox).filter(Boolean);
    const protectedRegions = [
      world.querySelector('.mission-console'),
      world.querySelector('.stage-prompt'),
      world.querySelector('.scene-heading')
    ].map(visibleBox).filter(Boolean);
    const mission = world.querySelector('.mission-console');
    const missionStyle = mission ? getComputedStyle(mission) : null;
    return {
      world: {
        box: visibleBox(world),
        minHeight: getComputedStyle(world).minHeight,
        desktopCounterMedia: matchMedia('(min-width: 681px) and (min-height: 601px)').matches
      },
      propSurface: world.dataset.propSurface || '',
      propContainerSurface: world.querySelector('.scene-props')?.dataset.propSurface || '',
      props,
      protectedRegions,
      mission: mission ? {
        height: missionStyle.height,
        minHeight: missionStyle.minHeight,
        padding: missionStyle.padding,
        children: [...mission.children].map(child => ({
          box: visibleBox(child),
          children: [...child.children].map(visibleBox).filter(Boolean)
        })).filter(child => child.box)
      } : null,
      collisions: props.flatMap(prop => protectedRegions.flatMap(region => {
        const area = overlapArea(prop, region);
        return area > 1 ? [{ prop: prop.label, region: region.label, area }] : [];
      }))
    };
  });
  if (await page.locator('.scene-props > .scene-prop').count()) {
    expect(report.propSurface, JSON.stringify(report)).toBeTruthy();
    expect(report.propContainerSurface, JSON.stringify(report)).toBe(report.propSurface);
  }
  expect(
    report.protectedRegions.every(region => (
      region.left >= report.world.box.left - 1
      && region.right <= report.world.box.right + 1
    )),
    JSON.stringify(report)
  ).toBe(true);
  expect(report.collisions, JSON.stringify(report)).toEqual([]);
}

async function expectPresentationContract(page, tracking = {}) {
  await expect.poll(async () => {
    const observation = await presentationObservation(page);
    return observation.snapshot.status !== 'active'
      || (
        observation.station?.presentationMoment === observation.snapshot.currentPresentationMomentId
        && observation.world?.presentationMoment === observation.snapshot.currentPresentationMomentId
      );
  }, { message: 'runtime moment and rendered scene must stay coherent' }).toBe(true);

  const observation = await presentationObservation(page);
  const { snapshot } = observation;
  if (snapshot.status !== 'active') return observation;
  const task = taskById.get(snapshot.microtaskId);
  expect(task, `${snapshot.microtaskId} must be catalog-authored`).toBeTruthy();
  expect(ACTIVE_SCENE_MODES.has(task.presentation.sceneMode)).toBe(true);
  const moment = task.presentation.moments.find(candidate => (
    candidate.momentId === snapshot.currentPresentationMomentId
  ));
  expect(moment, `${snapshot.currentPresentationMomentId} must belong to ${snapshot.microtaskId}`).toBeTruthy();

  const exactAttributes = {
    sceneMode: task.presentation.sceneMode,
    sceneVariant: task.presentation.sceneVariant,
    presentationMoment: moment.momentId,
    primaryMotion: moment.primaryMotion.kind,
    endState: moment.endState.stateId
  };
  expect(observation.station).toEqual(exactAttributes);
  expect(observation.world).toEqual({
    ...exactAttributes,
    visibleLanguageRefs: moment.visibleLanguageRefs
  });
  expect(observation.participantEntityIds).toEqual(sorted(moment.participantEntityIds));
  expect(observation.focusEntityIds).toEqual(sorted(moment.focusEntityIds));

  if (['audio-playing', 'audio-retry'].includes(snapshot.phase)) {
    const audioRef = snapshot.audio?.currentSegment?.sourceRef
      || snapshot.audio?.currentSegment?.contentRef;
    expect(audioRef, `${snapshot.microtaskId} playing audio must retain its semantic ref`).toBeTruthy();
    if (snapshot.audio?.purpose === 'instruction') {
      expect(
        moment.visibleLanguageRefs,
        `${audioRef} instruction must not start while ${moment.momentId} is still focused on an earlier ref`
      ).toContain(audioRef);
    }
    const starts = await page.evaluate(() => window.__audioStarts);
    expect(starts.length).toBeGreaterThan(0);
    const latestStart = starts.at(-1);
    expect(latestStart, 'audio may start only after the matching moment DOM is rendered').toMatchObject({
      runtimeMicrotaskId: snapshot.microtaskId,
      runtimeMomentId: moment.momentId,
      renderedMicrotaskId: snapshot.microtaskId,
      renderedMomentId: moment.momentId
    });
  }

  const knowledgeExpand = page.locator('[data-action="knowledge-expand"]');
  if (
    observation.manualPresentation
    && await knowledgeExpand.count()
    && await knowledgeExpand.getAttribute('aria-expanded') === 'false'
  ) {
    await knowledgeExpand.click();
    await expect(knowledgeExpand).toHaveAttribute('aria-expanded', 'true');
  }

  if (snapshot.phase !== 'role-practice-ready') {
    for (const refId of moment.visibleLanguageRefs) {
      await expectExactVisibleText(page, languageText(refId), refId);
    }
  }
  await expectNoProtectedRegionCollision(page);
  tracking.activeTaskIds?.add(task.microtaskId);
  tracking.sceneModes?.add(task.presentation.sceneMode);
  tracking.presentationMoments?.add(`${task.microtaskId}:${moment.momentId}`);
  return observation;
}

async function settlePresentation(page, tracking = {}) {
  for (let guard = 0; guard < 30; guard += 1) {
    const observation = await expectPresentationContract(page, tracking);
    if (observation.snapshot.status !== 'active') return observation.snapshot;
    if (observation.snapshot.phase === 'role-practice-ready') return observation.snapshot;
    if (!observation.snapshot.presentationAwaitingEnd || observation.manualPresentation) {
      return observation.snapshot;
    }
    const before = {
      momentId: observation.snapshot.currentPresentationMomentId,
      awaiting: observation.snapshot.presentationAwaitingEnd,
      stateVersion: observation.snapshot.stateVersion
    };
    await expect.poll(async () => {
      const next = await runtimeSnapshot(page);
      return {
        momentId: next.currentPresentationMomentId,
        awaiting: next.presentationAwaitingEnd,
        stateVersion: next.stateVersion
      };
    }, { message: `${before.momentId} must end through the rendered motion gate` }).not.toEqual(before);
  }
  throw new Error('presentation moments did not settle after thirty rendered transitions');
}

async function expectOutcomeRest(page, expectedVariant, tracking = {}) {
  expect(OUTCOME_REST_VARIANTS.has(expectedVariant)).toBe(true);
  await expect(app(page)).toHaveAttribute('data-scene-mode', 'outcome-rest');
  await expect(app(page)).toHaveAttribute('data-scene-variant', expectedVariant);
  await expect(page.locator('.station-world')).toHaveAttribute('data-scene-mode', 'outcome-rest');
  await expect(page.locator('.station-world')).toHaveAttribute('data-scene-variant', expectedVariant);
  await expect(page.locator('.adventure-heart-gauge')).toHaveCount(0);
  await expect(app(page)).toHaveAttribute('data-runtime-challenge', 'none');
  await expect(page.locator('[data-response-fields], .knowledge-layer')).toHaveCount(0);
  tracking.outcomeRestVariants?.add(expectedVariant);
}

async function expectActiveAudioText(page, snapshot) {
  const text = snapshot.audio?.currentSegment?.text || snapshot.audio?.visibleText;
  expect(text, `${snapshot.microtaskId}/${snapshot.stepId} must expose its English audio text`).toBeTruthy();
  const visibleEnglish = page.locator([
    '.dialogue-line__text',
    '.language-audio-line',
    '.feedback-audio-state__english',
    '.word-plaque',
    '.reference-answer',
    '.moment-language__item'
  ].join(',')).filter({ hasText: text });
  await expect(visibleEnglish.first()).toBeVisible();
}

async function expectActiveSpeakerVisual(page, snapshot) {
  const expectedRole = snapshot.audio?.currentSegment?.speaker;
  expect(expectedRole, `${snapshot.microtaskId}/${snapshot.stepId} must identify the current speaker`).toBeTruthy();
  const speakerState = await page.locator('.scene-character[data-speaker-role]')
    .evaluateAll(characters => characters.map(character => {
      const style = getComputedStyle(character);
      return {
        role: character.dataset.speakerRole,
        active: character.classList.contains('is-active-speaker'),
        opacity: style.opacity,
        transform: style.transform,
        filter: style.filter,
        animationName: style.animationName
      };
    }));
  const active = speakerState.filter(character => character.active);
  const inactive = speakerState.filter(character => !character.active);
  expect(active).toHaveLength(1);
  expect(active[0].role).toBe(expectedRole);
  expect(inactive.length).toBeGreaterThan(0);
  expect(active[0].animationName).toContain('moment-active-speaker-turn');
  expect(inactive.every(character => !character.animationName.includes('moment-active-speaker-turn'))).toBe(true);
  expect([active[0].opacity, active[0].transform, active[0].filter])
    .not.toEqual([inactive[0].opacity, inactive[0].transform, inactive[0].filter]);
  await expect.poll(() => page.evaluate(segmentId => {
    const starts = window.__lessonMotionStarts.filter(event => event.segmentId === segmentId);
    return starts.findLast(event => event.animationName === 'moment-active-speaker-turn')
      ?.speakerRole || null;
  }, snapshot.audio.segmentId)).toBe(expectedRole);
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  const consoleRestarts = await page.evaluate(segmentId => (
    window.__lessonMotionStarts.filter(event => (
      event.segmentId === segmentId
      && event.animationName === 'console-rise'
      && String(event.targetClass).includes('mission-console')
    )).length
  ), snapshot.audio.segmentId);
  expect(consoleRestarts).toBe(0);
}

async function armSameConsoleRiseGuard(page) {
  await page.locator('.mission-console').evaluate(async consoleElement => {
    const characterElements = [...document.querySelectorAll('.scene-character[data-entity-id]')];
    const activeEntryAnimations = [consoleElement, ...characterElements]
      .flatMap(element => element.getAnimations())
      .filter(animation => (
        ['console-rise', 'character-card-arrive'].includes(animation.animationName)
      ));
    await Promise.allSettled(activeEntryAnimations.map(animation => animation.finished));

    if (window.__sameConsoleRiseGuardListener) {
      removeEventListener('animationstart', window.__sameConsoleRiseGuardListener, true);
    }
    window.__sameConsoleRiseGuardElement = consoleElement;
    window.__sameCharacterEntryGuardElements = characterElements.map(element => ({
      entityId: element.dataset.entityId,
      element
    }));
    window.__sameConsoleRiseGuardStarts = [];
    window.__sameCharacterEntryGuardStarts = [];
    window.__sameConsoleRiseGuardListener = event => {
      if (
        event.target === window.__sameConsoleRiseGuardElement
        && event.animationName === 'console-rise'
      ) {
        const snapshot = window.__lessonScene.runtime.snapshot();
        window.__sameConsoleRiseGuardStarts.push({
          microtaskId: snapshot.microtaskId,
          phase: snapshot.phase,
          challengeRef: snapshot.challengeRef || null
        });
      }
      if (
        event.animationName === 'character-card-arrive'
        && window.__sameCharacterEntryGuardElements.some(({ element }) => element === event.target)
      ) {
        const snapshot = window.__lessonScene.runtime.snapshot();
        window.__sameCharacterEntryGuardStarts.push({
          entityId: event.target.dataset.entityId,
          microtaskId: snapshot.microtaskId,
          phase: snapshot.phase,
          challengeRef: snapshot.challengeRef || null
        });
      }
    };
    addEventListener('animationstart', window.__sameConsoleRiseGuardListener, true);
  });
}

async function sameConsoleRiseGuardReport(page) {
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  return page.evaluate(() => ({
    sameConsole: window.__sameConsoleRiseGuardElement === document.querySelector('.mission-console'),
    sameCharacters: window.__sameCharacterEntryGuardElements.every(({ entityId, element }) => (
      element === document.querySelector(`.scene-character[data-entity-id="${entityId}"]`)
    )),
    consoleRiseStarts: [...window.__sameConsoleRiseGuardStarts],
    characterEntryStarts: [...window.__sameCharacterEntryGuardStarts]
  }));
}

async function finishOneAudio(page) {
  await expect.poll(() => page.evaluate(() => window.__pendingCourseAudioCount())).toBeGreaterThan(0);
  const finished = await page.evaluate(() => window.__finishNextCourseAudio());
  expect(finished).toBeTruthy();
}

async function drainAudio(page, seenAudioTexts = [], tracking = {}) {
  for (let guard = 0; guard < 40; guard += 1) {
    const snapshot = await settlePresentation(page, tracking);
    if (['audio-playing', 'audio-retry'].includes(snapshot.phase)) {
      await expectActiveAudioText(page, snapshot);
      seenAudioTexts.push(snapshot.audio.currentSegment.text);
      await finishOneAudio(page);
      continue;
    }
    if (['audio-ready', 'audio-failed'].includes(snapshot.phase)) {
      const action = snapshot.phase === 'audio-failed' ? 'audio-retry' : 'audio-play';
      await page.locator(`[data-action="${action}"]`).click();
      continue;
    }
    return snapshot;
  }
  throw new Error('audio did not settle after forty segments');
}

function acceptedValue(rule, challenge, correct) {
  if (rule.type === 'select-one') {
    if (rule.acceptedEntityId || rule.acceptedEntityIds) {
      const accepted = rule.acceptedEntityId || rule.acceptedEntityIds[0];
      if (correct) return { action: 'select-entity', value: accepted };
      return {
        action: 'select-entity',
        value: challenge.candidateEntityIds.find(candidate => candidate !== accepted)
      };
    }
    if (rule.acceptedSourceRef) {
      if (correct) return { action: 'select-source', value: rule.acceptedSourceRef };
      return {
        action: 'select-source',
        value: challenge.candidateSourceRefs.find(candidate => candidate !== rule.acceptedSourceRef)
      };
    }
    if (rule.acceptedContentRef) {
      if (correct) return { action: 'select-diagnostic', value: rule.acceptedContentRef };
      return {
        action: 'select-diagnostic',
        value: challenge.candidateContentRefs.find(candidate => candidate !== rule.acceptedContentRef)
      };
    }
  }
  if (rule.type === 'match-entity') {
    const accepted = rule.acceptedEntityId || rule.pairs?.[rule.acceptedSourceRef];
    return {
      action: 'select-entity',
      value: correct
        ? accepted
        : challenge.candidateEntityIds.find(candidate => candidate !== accepted)
    };
  }
  if (rule.type === 'connect-reference') {
    return {
      action: 'connect-reference',
      value: correct
        ? rule.entityId
        : challenge.candidateEntityIds.find(candidate => candidate !== rule.entityId)
    };
  }
  return null;
}

async function submitRule(page, rule, challenge, { correct = true } = {}) {
  const single = acceptedValue(rule, challenge || {}, correct);
  if (single) {
    await page.locator(`button[data-action="${single.action}"][data-value="${single.value}"]`).first().click();
    return;
  }
  if (rule.type === 'ordered-blocks') {
    const accepted = rule.acceptedOrder || [];
    const values = correct ? accepted : [accepted[1], accepted[0], ...accepted.slice(2)];
    for (const value of values) {
      await page.locator(`button[data-action="add-block"][data-value="${value}"]`).click();
    }
    return;
  }
  if (rule.type === 'perform-action') {
    const targetValue = correct
      ? rule.targetEntityId
      : await page.locator('button[data-action="perform-direct"]')
        .evaluateAll((buttons, accepted) => (
          buttons.map(button => button.dataset.value).find(value => value !== accepted) || accepted
        ), rule.targetEntityId);
    const target = page.locator(
      `button[data-action="perform-direct"][data-value="${targetValue}"]`
    ).first();
    await target.scrollIntoViewIfNeeded();
    await target.click();
    return;
  }
  throw new Error(`E2E helper does not support ${rule.type}`);
}

async function answerCurrent(page, {
  correct = true,
  observedChallenges,
  storyActions,
  seenAudioTexts,
  ...presentationTracking
} = {}) {
  const snapshot = await drainAudio(page, seenAudioTexts, presentationTracking);
  expect(snapshot.phase).toBe('awaiting-response');
  const { step, challenge } = activeContract(snapshot);
  expect(step).toBeTruthy();
  const primaryTask = page.locator(
    '[data-copy-purpose="task"][data-copy-priority="primary"]:visible'
  );
  await expect(primaryTask).toHaveCount(1);
  if (challenge) {
    expect(challenge.challengeRef).toBe(snapshot.challengeRef);
    const diagnosticCandidates = challenge.candidateEntityIds
      || challenge.candidateSourceRefs
      || challenge.candidateContentRefs;
    expect(snapshot.optionIds).toHaveLength(diagnosticCandidates.length);
    expect(new Set(snapshot.optionIds)).toEqual(new Set(diagnosticCandidates));
    expect(Number.isInteger(snapshot.shuffleSeed)).toBe(true);
    expect(snapshot.shuffleAlgorithmVersion).toContain('fisher-yates');
    observedChallenges?.add(challenge.challengeRef);
  }
  const rule = challenge?.answerRule || step.answerRule;
  let handoffMoment = null;
  if (!challenge && rule.type === 'perform-action') {
    await expect(page.locator('[data-task-surface="scene-action"]')).toHaveCount(1);
    if (step.actionInstruction) {
      await expect(primaryTask).toHaveText(step.prompt);
      await expect(page.locator('.action-stage__hint, .direct-action-instruction'))
        .toHaveCount(0);
    }
    storyActions?.push(`${rule.entityId}->${rule.targetEntityId}`);
    await expect(page.locator('.adventure-heart-gauge')).toHaveCount(0);
    if (presentationTracking.handoffMomentIds) {
      handoffMoment = activeContract(snapshot).task.presentation.moments.find(moment => (
        moment.enterWhen?.kind === 'step-completed'
        && moment.enterWhen.stepId === snapshot.stepId
      ));
      expect(handoffMoment, `${snapshot.microtaskId}/${snapshot.stepId} needs an after-action handoff moment`)
        .toBeTruthy();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      expect(snapshot.currentPresentationMomentId).not.toBe(handoffMoment.momentId);
      const beforeStates = await page.locator([
        '.scene-people > [data-moment-state]',
        '.scene-props > [data-moment-state]'
      ].join(',')).evaluateAll(elements => elements.flatMap(element => (
        (element.dataset.momentState || '').split(/\s+/).filter(Boolean)
      )));
      for (const { state } of handoffMoment.endState.entityStates) {
        expect(beforeStates, `${state} must not be shown before the child completes the handoff`)
          .not.toContain(state);
      }
    }
  }
  const startsBefore = await page.evaluate(() => window.__audioStarts.length);
  await submitRule(page, rule, challenge, { correct });
  if (correct && handoffMoment) {
    if (step.feedbackAudioSequence) {
      await expect.poll(() => runtimeSnapshot(page).then(current => current.phase))
        .toBe('audio-playing');
      for (let guard = 0; guard < 10; guard += 1) {
        const playing = await runtimeSnapshot(page);
        if (!['audio-playing', 'audio-retry'].includes(playing.phase)) break;
        await expectActiveAudioText(page, playing);
        seenAudioTexts?.push(playing.audio.currentSegment.text);
        await finishOneAudio(page);
      }
    }
    await expect.poll(() => runtimeSnapshot(page).then(current => (
      current.currentPresentationMomentId
    )), { message: `${handoffMoment.momentId} must begin only after the real story action` })
      .toBe(handoffMoment.momentId);
    const handoffSnapshot = await runtimeSnapshot(page);
    expect(handoffSnapshot.presentationAwaitingEnd).toBe(true);
    await expectPresentationContract(page, presentationTracking);
    for (const { entityId, state } of handoffMoment.endState.entityStates) {
      await expect(page.locator(
        `[data-entity-id="${entityId}"][data-moment-state~="${state}"]`
      ).first()).toBeVisible();
    }
    presentationTracking.handoffMomentIds.add(
      `${snapshot.microtaskId}:${handoffMoment.momentId}`
    );
    if (handoffMoment.advancePolicy === 'explicit-child-continue') {
      await expect(page.locator('[data-presentation-manual="true"] [data-action="presentation-end"]'))
        .toBeVisible();
    } else {
      await expect.poll(() => runtimeSnapshot(page).then(current => (
        current.currentPresentationMomentId !== handoffMoment.momentId
        || current.presentationAwaitingEnd === false
      )), { message: `${handoffMoment.momentId} must finish through its rendered motion` }).toBe(true);
      await settlePresentation(page, presentationTracking);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
  }
  if (correct && challenge?.feedbackAudioSequence) {
    await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
    await expect.poll(() => page.evaluate(() => window.__audioStarts.length)).toBeGreaterThan(startsBefore);
    await expectActiveAudioText(page, await runtimeSnapshot(page));
  }
}

async function completeCurrentMicrotask(page, tracking = {}) {
  const initial = await runtimeSnapshot(page);
  const microtaskId = initial.microtaskId;
  for (let guard = 0; guard < 40; guard += 1) {
    const current = await runtimeSnapshot(page);
    if (
      current.microtaskId !== microtaskId
      || ['rest-stop', 'unit-built', 'sandbox-complete'].includes(current.status)
    ) return current;
    if (current.phase === 'role-practice-ready') {
      await completeFormalRoleStage(page, tracking);
      continue;
    }
    const settled = await drainAudio(page, tracking.seenAudioTexts, tracking);
    if (
      settled.microtaskId !== microtaskId
      || ['rest-stop', 'unit-built', 'sandbox-complete'].includes(settled.status)
    ) return settled;
    const manualPresentation = page.locator('[data-presentation-manual="true"]');
    if (settled.presentationAwaitingEnd && await manualPresentation.count()) {
      if (tracking.pauseAtManualPresentation) return settled;
      await page.locator('[data-action="presentation-end"]').click();
      continue;
    }
    if (settled.phase === 'awaiting-response') {
      await answerCurrent(page, tracking);
      continue;
    }
    if (settled.phase === 'presenting') {
      await page.locator('[data-action="step-continue"]').click();
      continue;
    }
    if (['answered-awaiting-save', 'unit-verifying'].includes(settled.phase)) {
      const before = {
        stateVersion: settled.stateVersion,
        phase: settled.phase,
        status: settled.status,
        momentId: settled.currentPresentationMomentId,
        awaiting: settled.presentationAwaitingEnd
      };
      await expect.poll(async () => {
        const next = await runtimeSnapshot(page);
        return {
          stateVersion: next.stateVersion,
          phase: next.phase,
          status: next.status,
          momentId: next.currentPresentationMomentId,
          awaiting: next.presentationAwaitingEnd
        };
      }, { message: `${microtaskId} save/readback must advance without a timer bypass` }).not.toEqual(before);
      continue;
    }
    throw new Error(`cannot complete ${microtaskId} from ${settled.status}/${settled.phase}`);
  }
  throw new Error(`${microtaskId} did not complete`);
}

async function continueRestStop(page, expectedRestStopId, tracking = {}) {
  const snapshot = await runtimeSnapshot(page);
  expect(snapshot.status).toBe('rest-stop');
  expect(snapshot.nextRestStop.restStopId).toBe(expectedRestStopId);
  await expectOutcomeRest(page, expectedRestStopId, tracking);
  const authored = unit.experience.restStops[expectedRestStopId];
  await expect(page.getByRole('heading', { name: authored.title })).toBeVisible();
  await page.locator('[data-action="rest"]').click();
  await expect(page.getByText(authored.restingCopy, { exact: true })).toBeVisible();
  await page.locator('[data-action="chapter-continue"]').click();
}

async function advanceTo(page, targetMicrotaskId, tracking = {}) {
  const visited = [];
  for (let guard = 0; guard < tasks.length + 2; guard += 1) {
    const snapshot = await runtimeSnapshot(page);
    visited.push(`${snapshot.microtaskId}:${snapshot.status}/${snapshot.phase}`);
    if (snapshot.microtaskId === targetMicrotaskId && snapshot.status === 'active') {
      return drainAudio(page, tracking.seenAudioTexts, tracking);
    }
    if (snapshot.status === 'rest-stop') {
      await continueRestStop(page, snapshot.nextRestStop.restStopId, tracking);
      continue;
    }
    if (snapshot.status === 'unit-built') {
      throw new Error(`passed ${targetMicrotaskId}; visited ${visited.join(' -> ')}`);
    }
    await completeCurrentMicrotask(page, tracking);
  }
  throw new Error(`could not reach ${targetMicrotaskId}; visited ${visited.join(' -> ')}`);
}

async function noForbiddenScroll(page) {
  const failures = await page.evaluate(() => {
    const failures = [];
    const app = document.querySelector('[data-runtime-microtask]');
    const context = [
      app?.getAttribute('data-runtime-microtask') || 'no-task',
      app?.getAttribute('data-runtime-phase') || 'no-phase',
      document.querySelector('.station-world')?.getAttribute('data-scene-mode') || 'no-scene'
    ].join('/');
    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      failures.push(`document:${document.documentElement.scrollWidth}>${window.innerWidth}`);
    }
    const selector = [
      '.mission-console', '.interaction-space', '.dialogue-script',
      '.language-audio-panel', '.prop-shelf', '.speech-choice-grid',
      '.block-builder', '.reference-lab', '.knowledge-layer', '.moment-language',
      '.milestone-card'
    ].join(',');
    document.querySelectorAll(selector).forEach(element => {
      const style = getComputedStyle(element);
      if (element.scrollWidth > element.clientWidth + 1) {
        const bounds = element.getBoundingClientRect();
        const offenders = [...element.querySelectorAll('*')].flatMap(child => {
          const childBounds = child.getBoundingClientRect();
          if (childBounds.left >= bounds.left - 1 && childBounds.right <= bounds.right + 1) return [];
          const childStyle = getComputedStyle(child);
          return [`${child.className || child.tagName}[${Math.round(childBounds.left - bounds.left)},${Math.round(childBounds.right - bounds.right)};${childStyle.transform};${childStyle.filter}]`];
        }).slice(0, 4).join('|');
        const replayGeometry = [...element.querySelectorAll('.inline-language-replay, .word-plaque, .shared-listen-replay, .shared-listen-replay__button')]
          .map(child => {
            const childBounds = child.getBoundingClientRect();
            const childStyle = getComputedStyle(child);
            return `${child.className}[${Math.round(childBounds.left - bounds.left)},${Math.round(childBounds.width)};w=${childStyle.width};min=${childStyle.minWidth};flex=${childStyle.flex};m=${childStyle.marginInline}]`;
          }).join('|');
        failures.push(
          `${window.innerWidth}x${window.innerHeight}:${context}:${element.className}:horizontal:${element.scrollWidth}>${element.clientWidth}:${offenders}:${replayGeometry}`
        );
      }
      if (
        element.scrollHeight > element.clientHeight + 1
        && ['auto', 'scroll'].includes(style.overflowY)
      ) failures.push(`${window.innerWidth}x${window.innerHeight}:${element.className}:nested-vertical`);
    });
    return failures;
  });
  expect(failures).toEqual([]);
}

test('uses the revision-scoped storage key and folds the story premise into the first stage', async ({ page }) => {
  const entryRecoveryNavigations = [];
  page.on('framenavigated', frame => {
    if (
      frame === page.mainFrame()
      && new URL(frame.url()).searchParams.get('recover') === 'entry-noop'
    ) entryRecoveryNavigations.push(frame.url());
  });
  await openFresh(page);
  expect(STORAGE_KEY).toBe(`poc:learning-experience:NCE-U01:${unit.experienceRevision}`);
  expect(STORAGE_KEY).not.toContain(':v1');
  await expect(app(page)).toHaveAttribute('data-view', 'mission');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', tasks[0].microtaskId);
  await expect(page.locator('.arrival-card, .briefing-card, #course-stage-map')).toHaveCount(0);
  await expect(page.locator('[data-action="start"]')).toHaveCount(0);
  await expect(page.locator('.station-brand strong')).toHaveText(tasks[0].presentation.title);
  await expect(page.getByText(/AI 生成|老师审核|不打字/)).toHaveCount(0);
  expect((await runtimeSnapshot(page)).status).toBe('active');
  await settlePresentation(page);
  expect(entryRecoveryNavigations).toEqual([]);
  const storedKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(storedKeys.every(key => key !== 'poc:lesson1-2-experience:v1')).toBe(true);
});

test('an autoplay policy block stays in the first stage with a neutral play action', async ({ page }) => {
  await openFresh(page, { audioMode: 'autoplay-blocked' });
  await startOrResume(page);

  await expect.poll(async () => (await runtimeSnapshot(page)).phase).toBe('audio-blocked');
  await expect(page.locator('.sound-fallback')).toHaveCount(0);
  await expect(page.getByText('这句英语还没有播放成功', { exact: true })).toHaveCount(0);
  const play = page.locator('[data-action="audio-play"]');
  await expect(play).toHaveText('播放课文');
  expect(await runtimeSnapshot(page)).toMatchObject({
    microtaskId: tasks[0].microtaskId,
    phase: 'audio-blocked',
    audio: {
      status: 'blocked',
      segmentIndex: 0,
      retryAttempt: 0,
      reason: 'autoplay-policy'
    }
  });

  await play.click();
  await expect.poll(async () => (await runtimeSnapshot(page)).phase).toBe('audio-playing');
  await finishOneAudio(page);
  await expect.poll(async () => (await runtimeSnapshot(page)).audio.segmentIndex).toBe(1);
  expect((await page.evaluate(() => window.__runtimeEffects)).filter(
    effect => effect.type === 'audio/failure'
  )).toEqual([]);
});

test('the first listen keeps all seven lines visible and advances only after the seventh real ended', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  await settlePresentation(page);

  const firstTask = tasks[0];
  const firstStep = firstTask.steps[0];
  const expectedLines = firstStep.audioSourceRefs.map(sourceRef => (
    unit.lessonContent.lesson1.sources[sourceRef].text
  ));
  await expect(page.locator('.station-brand strong')).toHaveText(firstTask.presentation.title);
  await expect(page.getByText(firstTask.presentation.title, { exact: true })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: firstTask.presentation.title })).toHaveCount(0);
  expect(await page.locator('.dialogue-line__text, .language-audio-line').allTextContents()).toEqual(expectedLines);
  await expect(page.locator('.adventure-heart-gauge')).toHaveCount(0);

  const returnToCurrent = page.locator('[data-action="dialogue-return-current"]');
  await expect(returnToCurrent).toBeHidden();
  await page.evaluate(() => new Promise(resolve => (
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  )));
  await page.locator('.dialogue-script').hover();
  await page.mouse.wheel(0, 420);
  await expect(returnToCurrent).toBeVisible();
  await returnToCurrent.click();
  await expect(returnToCurrent).toBeHidden();
  const followedLineGeometry = await page.locator('.dialogue-line[aria-current="true"]')
    .evaluate(element => {
      const line = element.getBoundingClientRect();
      const script = element.closest('.dialogue-script').getBoundingClientRect();
      return { lineTop: line.top, lineBottom: line.bottom, scriptTop: script.top, scriptBottom: script.bottom };
    });
  expect(followedLineGeometry.lineTop).toBeGreaterThanOrEqual(followedLineGeometry.scriptTop - 1);
  expect(followedLineGeometry.lineBottom).toBeLessThanOrEqual(followedLineGeometry.scriptBottom + 1);

  await expectActiveSpeakerVisual(page, await runtimeSnapshot(page));
  await finishOneAudio(page);
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.audio.segmentIndex)).toBe(1);
  const beforePagehide = await runtimeSnapshot(page);
  const pagehideSnapshotKey = 'e2e:lesson1-2:pagehide-snapshot';
  const lifecycleToken = 'lesson1-2-first-listen-document';
  await page.evaluate(([key, token]) => {
    window.__pageLifecycleToken = token;
    addEventListener('pagehide', () => {
      sessionStorage.setItem(key, JSON.stringify({
        snapshot: window.__lessonScene.runtime.snapshot(),
        effects: window.__runtimeEffects
      }));
    }, { once: true });
  }, [pagehideSnapshotKey, lifecycleToken]);
  await page.goto('/poc/lesson1-2-review/');
  const pagehideCapture = JSON.parse(await page.evaluate(
    key => sessionStorage.getItem(key), pagehideSnapshotKey
  ));
  const suspended = pagehideCapture.snapshot;
  expect(suspended).toMatchObject({
    microtaskId: beforePagehide.microtaskId,
    phase: 'audio-suspended',
    adventureHeartsRemaining: beforePagehide.adventureHeartsRemaining
  });
  expect(suspended.audio.segmentId).toBe(beforePagehide.audio.segmentId);
  expect(pagehideCapture.effects).toContainEqual(expect.objectContaining({
    type: 'audio/cancel',
    requestId: beforePagehide.audio.requestId
  }));
  await page.goBack();
  await expect.poll(() => page.evaluate(() => Boolean(window.__lessonScene))).toBe(true);
  const sameDocument = await page.evaluate(token => window.__pageLifecycleToken === token, lifecycleToken);
  if (!sameDocument) await startOrResume(page);
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.phase)).toBe('audio-playing');
  const resumed = await runtimeSnapshot(page);
  expect(resumed.microtaskId).toBe(beforePagehide.microtaskId);
  if (sameDocument) {
    expect(resumed.audio.segmentId).toBe(beforePagehide.audio.segmentId);
    expect(resumed.audio.requestId).not.toBe(beforePagehide.audio.requestId);
  } else {
    expect(resumed.audio.segmentIndex).toBe(0);
  }
  expect(resumed.adventureHeartsRemaining).toBe(beforePagehide.adventureHeartsRemaining);
  await expectActiveAudioText(page, resumed);
  await expectActiveSpeakerVisual(page, resumed);
  await expect.poll(() => page.evaluate(() => window.__pendingCourseAudioCount())).toBe(1);

  for (let index = resumed.audio.segmentIndex; index < 6; index += 1) {
    const snapshot = await runtimeSnapshot(page);
    expect(snapshot.microtaskId).toBe('L01-M07');
    expect(snapshot.audio.segmentIndex).toBe(index);
    await expectActiveAudioText(page, snapshot);
    await expectActiveSpeakerVisual(page, snapshot);
    await finishOneAudio(page);
  }
  expect((await runtimeSnapshot(page)).microtaskId).toBe('L01-M07');
  await finishOneAudio(page);
  await expect.poll(async () => {
    const snapshot = await runtimeSnapshot(page);
    return {
      microtaskId: snapshot.microtaskId,
      momentId: snapshot.currentPresentationMomentId,
      awaiting: snapshot.presentationAwaitingEnd
    };
  }).toEqual({
    microtaskId: 'L01-M07',
    momentId: 'listen-complete',
    awaiting: true
  });
  await expect(page.locator('.dialogue-line__text')).toHaveText(expectedLines);
  const replayButton = page.locator(
    '[data-presentation-manual="true"] [data-action="dialogue-replay"]'
  );
  const continueButton = page.locator(
    '[data-presentation-manual="true"] [data-action="presentation-end"]'
  );
  await expect(replayButton).toBeVisible();
  await expect(continueButton).toBeVisible();
  const heldBeforeReplay = await runtimeSnapshot(page);
  const startsBeforeReplay = await courseAudioStartCount(page);
  await replayButton.click();
  await expect.poll(() => courseAudioStartCount(page)).toBe(startsBeforeReplay + 1);
  await expect(page.locator('[data-language-ref="L01-D01"]')).toHaveClass(/is-current/);
  for (let index = 0; index < expectedLines.length; index += 1) {
    await expect(page.locator(`[data-language-ref="L01-D0${index + 1}"]`)).toHaveClass(/is-current/);
    await finishOneAudio(page);
  }
  await expect.poll(() => page.evaluate(() => window.__pendingCourseAudioCount())).toBe(0);
  expect(await runtimeSnapshot(page)).toMatchObject({
    microtaskId: heldBeforeReplay.microtaskId,
    stateVersion: heldBeforeReplay.stateVersion,
    currentPresentationMomentId: heldBeforeReplay.currentPresentationMomentId,
    presentationAwaitingEnd: true
  });

  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  const stageEntry = page.locator('[data-action="toggle-stages"]');
  await expect(stageEntry).toBeInViewport();
  await stageEntry.click();
  await expect(page.locator('#course-stage-map')).toBeVisible();
  await page.locator('[data-action="close-stages"]').click();
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  expect((await runtimeSnapshot(page)).microtaskId).toBe('L01-M07');
  await continueButton.click();
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.microtaskId)).toBe('L01-M08');
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test('completed dialogue keeps one stable scene with only equal replay and continue actions', async ({ page }) => {
  await page.setViewportSize({ width: 1428, height: 1147 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  const settled = await drainAudio(page);
  expect(settled).toMatchObject({
    microtaskId: 'L01-M07',
    currentPresentationMomentId: 'listen-complete',
    presentationAwaitingEnd: true
  });

  await expect(page.locator('.dialogue-complete-hint')).toHaveCount(0);
  const replay = page.locator('[data-action="dialogue-replay"]');
  const proceed = page.locator('[data-action="presentation-end"]');
  await expect(replay).toHaveText('重新播放');
  await expect(proceed).toHaveText('继续');
  const actionWidths = await page.locator(
    '.dialogue-complete-actions > button'
  ).evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().width));
  expect(actionWidths).toHaveLength(2);
  expect(Math.abs(actionWidths[0] - actionWidths[1])).toBeLessThanOrEqual(1);
  await expect(page.locator('.station-header')).toContainText('听听是谁丢了手提包');
  await expect(page.locator('.scene-heading')).toHaveCount(0);

  await page.evaluate(() => {
    window.__r2StableWorld = document.querySelector('.station-world');
    window.__r2StableConsole = document.querySelector('.mission-console');
  });
  await replay.click();
  await expect(page.locator('.dialogue-complete-hint')).toHaveCount(0);
  expect(await page.evaluate(() => (
    window.__r2StableWorld === document.querySelector('.station-world')
    && window.__r2StableConsole === document.querySelector('.mission-console')
  ))).toBe(true);
});

test('the counter handbag keeps one real-background anchor without a second drawn counter', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page);
  await startOrResume(page);

  const counterHandbagGeometry = () => page.locator('.station-world').evaluate(world => {
    const handbag = world.querySelector('.scene-prop[data-entity-id="handbag"]');
    const surface = handbag?.closest('.scene-props');
    if (!handbag || !surface) return null;
    const worldBox = world.getBoundingClientRect();
    const handbagBox = handbag.getBoundingClientRect();
    const surfaceStyle = getComputedStyle(surface);
    return {
      centerFromWorldTop: ((handbagBox.top + handbagBox.bottom) / 2) - worldBox.top,
      surface: {
        backgroundImage: surfaceStyle.backgroundImage,
        backgroundColor: surfaceStyle.backgroundColor,
        borderBottomWidth: surfaceStyle.borderBottomWidth,
        boxShadow: surfaceStyle.boxShadow
      }
    };
  });

  let snapshot = await drainAudio(page);
  expect(snapshot).toMatchObject({
    microtaskId: 'L01-M07',
    currentPresentationMomentId: 'listen-complete',
    presentationAwaitingEnd: true
  });
  const listenAnchor = await counterHandbagGeometry();
  expect(listenAnchor).toBeTruthy();

  await page.locator('[data-presentation-manual="true"] [data-action="presentation-end"]').click();
  snapshot = await drainAudio(page);
  expect(snapshot).toMatchObject({ microtaskId: 'L01-M08', challengeRef: 'L01-M08:C01' });
  const ownerAnchor = await counterHandbagGeometry();
  expect(ownerAnchor).toBeTruthy();

  for (const anchor of [listenAnchor, ownerAnchor]) {
    expect(anchor.surface).toEqual({
      backgroundImage: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderBottomWidth: '0px',
      boxShadow: 'none'
    });
  }
  expect(
    Math.abs(listenAnchor.centerFromWorldTop - ownerAnchor.centerFromWorldTop),
    JSON.stringify({ listenAnchor, ownerAnchor })
  ).toBeLessThanOrEqual(12);
});

test('R2 scene masters keep actors and the independent handbag inside their authored geometry', async ({ page }) => {
  await page.setViewportSize({ width: 2539, height: 1202 });
  await openFresh(page);
  await startOrResume(page);
  for (let guard = 0; guard < 20; guard += 1) {
    const snapshot = await runtimeSnapshot(page);
    if (snapshot.phase === 'audio-playing') {
      await finishOneAudio(page);
      continue;
    }
    if (snapshot.phase === 'audio-ready') {
      await page.locator('[data-action="audio-play"]').click();
      continue;
    }
    if (snapshot.presentationAwaitingEnd) break;
    await page.waitForTimeout(10);
  }

  const readGeometry = () => page.locator('.station-world').evaluate(world => {
    const worldBox = world.getBoundingClientRect();
    const actors = [...world.querySelectorAll('.scene-people > .scene-character')].map(actor => {
      const box = actor.getBoundingClientRect();
      const image = actor.querySelector('img');
      const paintedHeight = image?.naturalWidth && image?.naturalHeight
        ? Math.min(box.height, box.width * image.naturalHeight / image.naturalWidth)
        : box.height;
      return {
        entityId: actor.dataset.entityId,
        paintedHeightRatio: paintedHeight / worldBox.height,
        groundYRatio: (box.bottom - worldBox.top) / worldBox.height
      };
    });
    const handbag = world.querySelector('.scene-prop[data-entity-id="handbag"]');
    const handbagBox = handbag?.getBoundingClientRect();
    const propSurface = handbag?.closest('.scene-props');
    return {
      actors,
      handbagBottomRatio: handbagBox
        ? (handbagBox.bottom - worldBox.top) / worldBox.height
        : null,
      runtimeShift: propSurface?.style.getPropertyValue('--scene-prop-shift-y') || ''
    };
  });

  let geometry = await readGeometry();
  expect(geometry.actors).toHaveLength(2);
  for (const actor of geometry.actors) {
    expect(actor.paintedHeightRatio, JSON.stringify(geometry)).toBeGreaterThanOrEqual(.65);
    expect(actor.paintedHeightRatio, JSON.stringify(geometry)).toBeLessThanOrEqual(.75);
    expect(actor.groundYRatio, JSON.stringify(geometry)).toBeCloseTo(1, 2);
  }
  expect(geometry.handbagBottomRatio, JSON.stringify(geometry)).toBeCloseTo(.75, 1);
  expect(geometry.runtimeShift).toBe('');

  await page.setViewportSize({ width: 390, height: 844 });
  await settleSceneViewport(page, { width: 390, height: 844 });
  geometry = await readGeometry();
  expect(geometry.actors).toHaveLength(2);
  for (const actor of geometry.actors) {
    expect(actor.paintedHeightRatio, JSON.stringify(geometry)).toBeGreaterThanOrEqual(.34);
    expect(actor.paintedHeightRatio, JSON.stringify(geometry)).toBeLessThanOrEqual(.42);
    expect(actor.groundYRatio, JSON.stringify(geometry)).toBeCloseTo(.76, 2);
  }
  expect(geometry.handbagBottomRatio, JSON.stringify(geometry)).toBeCloseTo(.65, 1);
  expect(geometry.runtimeShift).toBe('');
});

test('R2 classroom typography and replay control stay readable from a teaching screen', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M09');

  const classroomSizes = await page.locator('.station-world').evaluate(world => {
    const px = selector => Number.parseFloat(getComputedStyle(world.querySelector(selector)).fontSize);
    return {
      action: px('.stage-prompt'),
      option: px('.speech-choice-card__body strong')
    };
  });
  expect(classroomSizes.action).toBeGreaterThanOrEqual(38);
  expect(classroomSizes.action).toBeLessThanOrEqual(44);
  expect(classroomSizes.option).toBeGreaterThanOrEqual(26);
  expect(classroomSizes.option).toBeLessThanOrEqual(30);

  await advanceTo(page, 'L02-M13');
  await expect(page.locator('.gentle-hint')).toHaveCount(0);
  const languageSizes = await page.locator('.station-world').evaluate(world => {
    const word = world.querySelector('.word-plaque');
    const replay = world.querySelector('.shared-listen-replay__button');
    const replayBox = replay.getBoundingClientRect();
    return {
      word: Number.parseFloat(getComputedStyle(word).fontSize),
      replayWidth: replayBox.width,
      replayHeight: replayBox.height
    };
  });
  expect(languageSizes.word).toBeGreaterThanOrEqual(36);
  expect(languageSizes.word).toBeLessThanOrEqual(42);
  expect(languageSizes.replayWidth).toBeGreaterThanOrEqual(60);
  expect(languageSizes.replayHeight).toBeGreaterThanOrEqual(60);

  await page.setViewportSize({ width: 390, height: 844 });
  await settleSceneViewport(page, { width: 390, height: 844 });
  const phoneReplay = await page.locator('.shared-listen-replay__button').evaluate(button => {
    const box = button.getBoundingClientRect();
    return { width: box.width, height: box.height };
  });
  expect(phoneReplay.width).toBeGreaterThanOrEqual(52);
  expect(phoneReplay.height).toBeGreaterThanOrEqual(52);
});

test('completed seven-line scroll stays inside the clear lane between both actors', async ({ page }) => {
  await page.setViewportSize({ width: 1428, height: 1147 });
  await openFresh(page);
  await startOrResume(page);
  await drainAudio(page);

  const geometry = await page.locator('.station-world').evaluate(world => {
    const panel = world.querySelector('.mission-console').getBoundingClientRect();
    const characters = [...world.querySelectorAll('.scene-character')].map(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    });
    const overlapArea = character => {
      const width = Math.max(0, Math.min(panel.right, character.right) - Math.max(panel.left, character.left));
      const height = Math.max(0, Math.min(panel.bottom, character.bottom) - Math.max(panel.top, character.top));
      return width * height;
    };
    return {
      panel: { left: panel.left, right: panel.right, top: panel.top, bottom: panel.bottom },
      characters,
      overlapAreas: characters.map(overlapArea)
    };
  });

  expect(geometry.characters).toHaveLength(2);
  expect(geometry.overlapAreas, JSON.stringify(geometry)).toEqual([0, 0]);
  expect(geometry.panel.left).toBeGreaterThanOrEqual(geometry.characters[0].right);
  expect(geometry.panel.right).toBeLessThanOrEqual(geometry.characters[1].left);
});

test('owner recall keeps both neutral candidates reachable before revealing the lost-item tray', async ({ page }) => {
  await page.setViewportSize({ width: 1428, height: 1147 });
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  await drainAudio(page);

  let snapshot = await runtimeSnapshot(page);
  expect(snapshot.challengeRef).toBe('L01-M08:C01');
  await expect(page.locator('.stage-prompt')).toHaveCount(0);
  await expect(page.locator('.mission-prompt')).toHaveCount(0);
  await expect(page.locator('.moment-language__item')).toHaveText(['Whose handbag is it?']);
  await expect(page.locator('.action-stage__hint')).toHaveCount(0);
  await expect(page.locator(
    '[data-copy-purpose="task"][data-copy-priority="primary"]:visible'
  )).toHaveText('Whose handbag is it?');
  await expect(page.locator('.scene-character')).toHaveCount(2);
  await expect(page.locator('.scene-character.is-moment-focus')).toHaveCount(0);
  await expect(page.locator('.mission-console'))
    .toHaveAttribute('data-task-surface', 'scene-action');
  const ownerRecallCastIds = await page.locator('.scene-people > .scene-character')
    .evaluateAll(characters => characters.map(character => character.dataset.entityId).sort());
  const candidateBoxes = await page.locator('button.scene-character').evaluateAll(elements => (
    elements.map(element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { width: box.width, opacity: style.opacity, filter: style.filter };
    })
  ));
  expect(candidateBoxes).toHaveLength(2);
  expect(Math.abs(candidateBoxes[0].width - candidateBoxes[1].width)).toBeLessThanOrEqual(2);
  expect(candidateBoxes[0].opacity).toBe(candidateBoxes[1].opacity);
  expect(candidateBoxes[0].filter).toBe(candidateBoxes[1].filter);

  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 762, height: 430 }
  ]) {
    await page.setViewportSize(viewport);
    await settleSceneViewport(page, viewport);
    const geometry = await page.locator('.station-world').evaluate(world => {
      const panel = world.querySelector('[data-task-surface="scene-action"]');
      const task = panel.querySelector('.moment-language, .mission-prompt');
      const panelBox = panel.getBoundingClientRect();
      const taskStyle = getComputedStyle(task);
      const lineHeight = Number.parseFloat(taskStyle.lineHeight);
      const overlapArea = element => {
        const box = element.getBoundingClientRect();
        return Math.max(0, Math.min(panelBox.right, box.right) - Math.max(panelBox.left, box.left))
          * Math.max(0, Math.min(panelBox.bottom, box.bottom) - Math.max(panelBox.top, box.top));
      };
      return {
        panelHeight: panelBox.height,
        taskHeight: task.getBoundingClientRect().height,
        twoLineLimit: Number.isFinite(lineHeight) ? lineHeight * 2 + 16 : 80,
        candidateOverlapAreas: [...world.querySelectorAll('button.scene-character')]
          .map(overlapArea)
      };
    });
    expect(geometry.panelHeight, JSON.stringify({ viewport, geometry })).toBeLessThanOrEqual(190);
    expect(geometry.taskHeight, JSON.stringify({ viewport, geometry }))
      .toBeLessThanOrEqual(geometry.twoLineLimit);
    expect(geometry.candidateOverlapAreas, JSON.stringify({ viewport, geometry }))
      .toEqual([0, 0]);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  const phoneCandidateVisibility = await page.locator('button.scene-character').evaluateAll(elements => (
    elements.map(element => {
      const box = element.getBoundingClientRect();
      return {
        left: box.left,
        right: box.right,
        visibleHeight: Math.max(0, Math.min(innerHeight, box.bottom) - Math.max(0, box.top))
      };
    })
  ));
  expect(phoneCandidateVisibility).toHaveLength(2);
  for (const candidate of phoneCandidateVisibility) {
    expect(candidate.left, JSON.stringify(phoneCandidateVisibility)).toBeGreaterThanOrEqual(-6);
    expect(candidate.right, JSON.stringify(phoneCandidateVisibility)).toBeLessThanOrEqual(396);
    expect(candidate.visibleHeight, JSON.stringify(phoneCandidateVisibility)).toBeGreaterThanOrEqual(150);
  }

  const shortDesktopViewport = { width: 1280, height: 720 };
  await page.setViewportSize(shortDesktopViewport);
  await settleSceneViewport(page, shortDesktopViewport);
  const desktopCandidateVisibility = await page.locator('button.scene-character').evaluateAll(elements => (
    elements.map(element => {
      const box = element.getBoundingClientRect();
      const image = element.querySelector('img');
      const paintedHeight = image?.naturalWidth && image?.naturalHeight
        ? Math.min(box.height, box.width * image.naturalHeight / image.naturalWidth)
        : box.height;
      const paintedTop = box.bottom - paintedHeight;
      return Math.max(0, Math.min(innerHeight, box.bottom) - Math.max(0, paintedTop));
    })
  ));
  expect(desktopCandidateVisibility).toHaveLength(2);
  for (const visibleHeight of desktopCandidateVisibility) {
    expect(visibleHeight, JSON.stringify(desktopCandidateVisibility)).toBeGreaterThanOrEqual(300);
  }

  const shortDesktopHandbagVisibility = await page.locator('.scene-prop[data-entity-id="handbag"]')
    .evaluate(element => {
      const box = element.getBoundingClientRect();
      return Math.max(0, Math.min(innerHeight, box.bottom) - Math.max(0, box.top));
    });
  expect(shortDesktopHandbagVisibility).toBeGreaterThanOrEqual(100);

  await expect(page.locator('.scene-prop[data-entity-id="handbag"]')).toBeVisible();
  await expect(page.locator('.scene-prop[data-entity-id="book"]')).toHaveCount(0);
  await expect(page.locator('.scene-prop[data-entity-id="watch"]')).toHaveCount(0);
  const heartIcons = page.locator('.adventure-heart .ui-icon');
  await expect(heartIcons).toHaveCount(3);
  expect(await heartIcons.evaluateAll(images => images.map(image => image.getAttribute('src'))))
    .toEqual(Array(3).fill('/poc/lesson1-2-experience/assets/icons/heart-fill.svg'));

  const ownerChallenge = activeContract(snapshot).challenge;
  await submitRule(page, ownerChallenge.answerRule, ownerChallenge, { correct: true });
  await drainAudio(page);
  snapshot = await runtimeSnapshot(page);
  expect(snapshot.challengeRef).toBe('L01-M08:C02');
  expect(await page.locator('.scene-people > .scene-character')
    .evaluateAll(characters => characters.map(character => character.dataset.entityId).sort()))
    .toEqual(ownerRecallCastIds);
  for (const entityId of ['handbag', 'book', 'watch']) {
    await expect(page.locator(`.scene-prop[data-entity-id="${entityId}"]`)).toBeVisible();
  }
});

test('audio-form questions keep one answer surface visible and unlock it only after real ended', async ({ page }) => {
  await page.setViewportSize({ width: 1428, height: 980 });
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  let snapshot = await drainAudio(page);
  expect(snapshot.challengeRef).toBe('L01-M08:C01');

  const ownerChallenge = activeContract(snapshot).challenge;
  await submitRule(page, ownerChallenge.answerRule, ownerChallenge, { correct: true });
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
  snapshot = await runtimeSnapshot(page);
  expect(snapshot).toMatchObject({
    stepId: 'L01-M08:S02',
    challengeRef: 'L01-M08:C02',
    phase: 'audio-playing'
  });

  const sharedSurface = page.locator('[data-audio-response-presentation="shared-locked-until-ended"]');
  await expect(sharedSurface).toBeVisible();
  await expect(page.locator('.language-audio-panel')).toHaveCount(0);
  await expect(sharedSurface.locator('.word-plaque')).toHaveText('handbag');
  await expect(sharedSurface.locator('[data-response-fields]')).toHaveAttribute('inert', '');
  await expect(page.locator('.scene-prop')).toHaveCount(3);
  await expect(page.locator('button.scene-prop[data-action="select-entity"]')).toHaveCount(0);

  await finishOneAudio(page);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('awaiting-response');
  await expect(sharedSurface).toBeVisible();
  await expect(sharedSurface.locator('.word-plaque')).toHaveText('handbag');
  await expect(sharedSurface.locator('[data-response-fields]')).not.toHaveAttribute('inert', '');
  await expect(page.locator('button.scene-prop[data-action="select-entity"]')).toHaveCount(3);

  const unlockedSnapshot = await runtimeSnapshot(page);
  const replay = sharedSurface.locator('[data-action="free-audio"]');
  await expect(replay).toBeVisible();
  await replay.click();
  await expect.poll(() => page.evaluate(() => window.__pendingCourseAudioCount())).toBe(1);
  expect(await runtimeSnapshot(page)).toMatchObject({
    phase: unlockedSnapshot.phase,
    challengeRef: unlockedSnapshot.challengeRef,
    stateVersion: unlockedSnapshot.stateVersion
  });
  await finishOneAudio(page);
  await expect(sharedSurface.locator('[data-response-fields]')).not.toHaveAttribute('inert', '');
});

test('handbag question workbench keeps the prop clear of hearts and sentence controls', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  const snapshot = await advanceTo(page, 'L01-M10');

  expect(snapshot.challengeRef).toBe('L01-M10:C01');
  const viewports = [
    { width: 1220, height: 1197 },
    { width: 360, height: 640 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 844, height: 390 }
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await settleSceneViewport(page, viewport);
    const geometry = await page.locator('.station-world').evaluate(world => {
      const bounds = selector => {
        const element = world.querySelector(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return {
          left: box.left,
          top: box.top,
          right: box.right,
          bottom: box.bottom
        };
      };
      const overlapArea = (left, right) => (
        Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left))
        * Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top))
      );
      const handbag = bounds('.scene-prop[data-entity-id="handbag"]');
      const panel = bounds('.mission-console');
      const protectedControls = [
        bounds('.adventure-heart-gauge'),
        bounds('.block-builder__track'),
        bounds('.block-builder__bank')
      ];
      return {
        viewport: { width: innerWidth, height: innerHeight },
        handbag,
        panel,
        protectedControls,
        overlapAreas: protectedControls.map(control => overlapArea(handbag, control))
      };
    });

    expect(geometry.handbag, JSON.stringify(geometry)).toBeTruthy();
    expect(geometry.protectedControls.every(Boolean), JSON.stringify(geometry)).toBe(true);
    expect(geometry.handbag.left, JSON.stringify(geometry)).toBeGreaterThanOrEqual(0);
    expect(geometry.handbag.right, JSON.stringify(geometry)).toBeLessThanOrEqual(viewport.width);
    expect(geometry.handbag.top, JSON.stringify(geometry)).toBeGreaterThanOrEqual(geometry.panel.bottom);
    expect(geometry.overlapAreas, JSON.stringify(geometry)).toEqual([0, 0, 0]);
    await noForbiddenScroll(page);
  }
});

test('handbag question rests the handbag on the painted counter edge in both scene masters', async ({ page }) => {
  await page.setViewportSize({ width: 1220, height: 1011 });
  await openFresh(page);
  await startOrResume(page);
  const snapshot = await advanceTo(page, 'L01-M10');

  expect(snapshot.challengeRef).toBe('L01-M10:C01');

  for (const viewport of [
    { width: 1220, height: 1011, counterEdgeRatio: 0.75 },
    { width: 390, height: 844, counterEdgeRatio: 0.65 }
  ]) {
    await page.setViewportSize(viewport);
    await settleSceneViewport(page, viewport);
    const geometry = await page.locator('.station-world').evaluate(world => {
      const worldBox = world.getBoundingClientRect();
      const handbagBox = world.querySelector('.scene-prop[data-entity-id="handbag"]')
        .getBoundingClientRect();
      const panelBox = world.querySelector('.mission-console').getBoundingClientRect();
      return {
        world: { top: worldBox.top, height: worldBox.height },
        handbag: { top: handbagBox.top, bottom: handbagBox.bottom },
        panel: { top: panelBox.top, bottom: panelBox.bottom }
      };
    });
    const paintedCounterEdge = geometry.world.top + geometry.world.height * viewport.counterEdgeRatio;

    expect(geometry.handbag.top, JSON.stringify({ viewport, geometry }))
      .toBeGreaterThanOrEqual(geometry.panel.bottom);
    expect(Math.abs(geometry.handbag.bottom - paintedCounterEdge), JSON.stringify({ viewport, geometry }))
      .toBeLessThanOrEqual(28);
  }
});

test('watch reference keeps every candidate prop neutral and clear of the answer controls', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L02-M15');
  expect(snapshot.challengeRef).toBe('L02-M15:C01');
  const questionChallenge = activeContract(snapshot).challenge;
  await submitRule(page, questionChallenge.answerRule, questionChallenge, { correct: true });

  for (let guard = 0; guard < 20; guard += 1) {
    snapshot = await settlePresentation(page);
    if (snapshot.stepId === 'L02-M15:S03' && snapshot.phase === 'audio-playing') break;
    if (['audio-playing', 'audio-retry'].includes(snapshot.phase)) {
      await finishOneAudio(page);
      continue;
    }
    await page.waitForTimeout(10);
  }
  expect(snapshot).toMatchObject({
    stepId: 'L02-M15:S03',
    challengeRef: 'L02-M15:C02',
    phase: 'audio-playing'
  });

  const viewports = [
    { width: 1259, height: 1090 },
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 844, height: 390 }
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await settleSceneViewport(page, viewport);
    await expect(page.locator('.scene-props > .scene-prop')).toHaveCount(3);
    expect(await page.locator('.scene-props > .scene-prop').evaluateAll(props => (
      props.map(prop => prop.dataset.entityId).sort()
    ))).toEqual(['book', 'handbag', 'watch']);
    await expectNoProtectedRegionCollision(page);
    await noForbiddenScroll(page);
  }

  await finishOneAudio(page);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('awaiting-response');
  await expect(page.locator('.reference-answer')).toHaveText('Yes, it is.');
  await expectNoProtectedRegionCollision(page);
});

test('the handbag conversation does not cut to a different scene before the question', async ({ page }) => {
  await page.setViewportSize({ width: 1428, height: 1147 });
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M09');

  const sceneFrame = () => page.locator('.station-world').evaluate(world => {
    const characterFrames = [...world.querySelectorAll('.scene-people > .scene-character')]
      .map(character => {
        const style = getComputedStyle(character);
        return {
          entityId: character.dataset.entityId,
          width: style.width,
          height: style.height
        };
      })
      .sort((left, right) => left.entityId.localeCompare(right.entityId));
    const style = getComputedStyle(world);
    return {
      sceneMode: world.dataset.sceneMode,
      backgroundImage: style.backgroundImage,
      backgroundPosition: style.backgroundPosition,
      backgroundSize: style.backgroundSize,
      characterFrames
    };
  });

  const before = await sceneFrame();
  expect(before.sceneMode).toBe('dialogue-stage');
  await completeCurrentMicrotask(page);
  const snapshot = await drainAudio(page);
  expect(snapshot.microtaskId).toBe('L01-M10');

  const after = await sceneFrame();
  expect(after.sceneMode).toBe(before.sceneMode);
  expect(after.backgroundImage).toBe(before.backgroundImage);
  expect(after.backgroundPosition).toBe(before.backgroundPosition);
  expect(after.backgroundSize).toBe(before.backgroundSize);
  expect(after.characterFrames).toEqual(before.characterFrames);
});

test('handbag word-form returns later as a return label instead of a repeated object hunt', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L01-M09');

  expect(snapshot.challengeRef).toBe('L01-M09:C01');
  await expect(page.locator('.stage-prompt')).toHaveText('礼貌叫住她，应该怎么说？');
  await expect(page.locator('.word-plaque')).toHaveCount(0);
  await expect(page.locator('.scene-prop[data-entity-id="handbag"]')).toBeVisible();
  await expect(page.locator('.scene-prop[data-entity-id="book"]')).toHaveCount(0);
  await expect(page.locator('.scene-prop[data-entity-id="watch"]')).toHaveCount(0);

  await completeCurrentMicrotask(page);
  await completeCurrentMicrotask(page);
  snapshot = await advanceTo(page, 'L01-M11');
  expect(snapshot.challengeRef).toBe('L01-M11:C01');
  await expect(page.locator('.stage-prompt')).toHaveText('看一看场景中的物品，选择对应的英文名称。');
  await expect(page.locator('.word-label-choice-grid')).toBeVisible();
  await expect.poll(() => page.locator(
    '.word-label-choice-grid [data-action="select-source"]'
  ).allTextContents().then(values => values.map(value => value.trim()).sort()))
    .toEqual(['excuse', 'handbag', 'pardon']);
  await expect(page.locator('.scene-prop[data-entity-id="handbag"]')).toBeVisible();
  await expect(page.locator('.scene-prop[data-entity-id="book"]')).toHaveCount(0);
  await expect(page.locator('.scene-prop[data-entity-id="watch"]')).toHaveCount(0);
});

test('direct intent keeps one click per learning decision and one click for the final handoff', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page, { reducedMotion: 'reduce' });
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L01-M11');
  expect(snapshot).toMatchObject({
    microtaskId: 'L01-M11',
    challengeRef: 'L01-M11:C01',
    phase: 'awaiting-response',
    adventureHeartsRemaining: 3
  });

  await expect(page.locator('[data-drag-source], [data-drop-target], [draggable="true"]'))
    .toHaveCount(0);
  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge, { correct: false });
  await expect(app(page)).toHaveAttribute('data-adventure-hearts', '2');
  await expect(page.locator('.feedback-mission-bar')).toContainText(challenge.supportLayers[0].copy);
  await submitRule(page, challenge.answerRule, challenge);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
  snapshot = await drainAudio(page);

  expect(snapshot.challengeRef).toBe('L01-M11:C02');
  const thanksChallenge = activeContract(snapshot).challenge;
  await submitRule(page, thanksChallenge.answerRule, thanksChallenge);
  snapshot = await drainAudio(page);
  expect(snapshot.stepId).toBe('L01-M11:S03');
  await page.locator(
    'button.scene-character[data-action="perform-direct"][data-entity-id="handbag-owner"]'
  ).click();
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
  snapshot = await runtimeSnapshot(page);
  expect(snapshot.audio.currentSegment).toMatchObject({
    text: 'Thank you very much.',
    speaker: 'woman'
  });
  await expect(page.locator(
    '[data-entity-id="handbag"][data-moment-state*="handbag-with-owner"]'
  )).toBeVisible();
  await expect(page.locator('[data-action="presentation-end"]')).toHaveCount(0);
  await finishOneAudio(page);
  await expect(page.locator('[data-action="presentation-end"]')).toBeVisible();
});

test('word-form object choices stay visually neutral until the child answers', async ({ page }) => {
  await page.setViewportSize({ width: 1220, height: 1011 });
  await openFresh(page);
  await startOrResume(page);
  const snapshot = await advanceTo(page, 'L02-M13');

  expect(snapshot).toMatchObject({
    microtaskId: 'L02-M13',
    challengeRef: 'L02-M13:C01',
    phase: 'awaiting-response'
  });
  await page.mouse.move(1, 1);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  const candidates = await page.locator('.scene-props > .scene-prop').evaluateAll(elements => (
    elements.map(element => {
      const style = getComputedStyle(element);
      return {
        entityId: element.dataset.entityId,
        selected: element.classList.contains('is-selected'),
        opacity: style.opacity,
        transform: style.transform,
        filter: style.filter,
        outline: style.outline
      };
    })
  ));

  expect(candidates.map(candidate => candidate.entityId).sort()).toEqual([
    'book', 'pen', 'pencil', 'watch'
  ]);
  expect(candidates.every(candidate => !candidate.selected)).toBe(true);
  expect(new Set(candidates.map(candidate => JSON.stringify({
    opacity: candidate.opacity,
    transform: candidate.transform,
    filter: candidate.filter,
    outline: candidate.outline
  }))).size).toBe(1);
});

test('formal candidates use the runtime shuffle and two wrong answers reveal catalog support layers', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  await drainAudio(page);

  let snapshot = await runtimeSnapshot(page);
  expect(snapshot.challengeRef).toBe('L01-M08:C01');
  await expect(page.locator('.adventure-heart-gauge')).toHaveAttribute('aria-label', '冒险心：3 / 3');
  const firstChallenge = activeContract(snapshot).challenge;
  await submitRule(page, firstChallenge.answerRule, firstChallenge, { correct: true });
  await drainAudio(page);

  snapshot = await runtimeSnapshot(page);
  const challenge = activeContract(snapshot).challenge;
  expect(snapshot.challengeRef).toBe('L01-M08:C02');
  expect(snapshot.shuffleAlgorithmVersion).toContain('fisher-yates');
  expect(Number.isInteger(snapshot.shuffleSeed)).toBe(true);
  expect(new Set(snapshot.optionIds)).toEqual(new Set(challenge.candidateEntityIds));
  const displayed = await page.locator('button.scene-prop[data-action="select-entity"]')
    .evaluateAll(buttons => buttons.map(button => button.dataset.value));
  expect(displayed).toEqual(snapshot.optionIds);

  await submitRule(page, challenge.answerRule, challenge, { correct: false });
  await expect(app(page)).toHaveAttribute('data-adventure-hearts', '2');
  await expect(page.locator('.feedback-mission-bar')).toContainText(challenge.supportLayers[0].copy);
  await submitRule(page, challenge.answerRule, challenge, { correct: false });
  await expect(app(page)).toHaveAttribute('data-adventure-hearts', '1');
  await expect(page.locator('.feedback-mission-bar')).toContainText(challenge.supportLayers[1].copy);
});

test('owner correction keeps the action instruction ahead of one compact clue group', async ({ page }) => {
  await page.setViewportSize({ width: 986, height: 634 });
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  await drainAudio(page);

  const snapshot = await runtimeSnapshot(page);
  const challenge = activeContract(snapshot).challenge;
  expect(snapshot.challengeRef).toBe('L01-M08:C01');
  await submitRule(page, challenge.answerRule, challenge, { correct: false });
  await expect(page.locator('.feedback-mission-bar')).toContainText(challenge.supportLayers[0].copy);
  await expect(page.locator('.feedback-mission-bar__copy')).toContainText(
    unit.experience.uiCopy.feedback.labels.support
  );
  const supportLayout = await page.locator('.support-guidance').evaluate(element => {
    const instruction = element.parentElement.querySelector('.support-action-instruction')
      .getBoundingClientRect();
    const hint = element.querySelector('.feedback-mission-bar').getBoundingClientRect();
    const language = element.querySelector('.moment-language').getBoundingClientRect();
    return {
      instructionBottom: instruction.bottom,
      hintTop: hint.top,
      hintBottom: hint.bottom,
      hintWidth: hint.width,
      languageTop: language.top,
      supportWidth: element.getBoundingClientRect().width
    };
  });
  expect(supportLayout.instructionBottom).toBeLessThanOrEqual(supportLayout.hintTop + 1);
  expect(supportLayout.hintBottom).toBeLessThanOrEqual(supportLayout.languageTop + 2);
  expect(supportLayout.hintWidth / supportLayout.supportWidth).toBeGreaterThan(.9);
});

test('zero hearts clears temporary answers and restarts the whole current microtask', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  await drainAudio(page);

  const first = activeContract(await runtimeSnapshot(page)).challenge;
  await submitRule(page, first.answerRule, first, { correct: true });
  await drainAudio(page);
  const secondSnapshot = await runtimeSnapshot(page);
  const second = activeContract(secondSnapshot).challenge;
  expect(secondSnapshot.temporaryResults).toHaveLength(1);

  await submitRule(page, second.answerRule, second, { correct: false });
  await submitRule(page, second.answerRule, second, { correct: false });
  await submitRule(page, second.answerRule, second, { correct: false });
  await expect(app(page)).toHaveAttribute('data-adventure-hearts', '0');
  await expect(page.locator('.feedback-bubble[data-tone="partner"]')).toContainText(second.supportLayers[2].copy);
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => ({
    microtaskId: snapshot.microtaskId,
    challengeRef: snapshot.challengeRef,
    attemptRevision: snapshot.attemptRevision,
    hearts: snapshot.adventureHeartsRemaining,
    temporaryResults: snapshot.temporaryResults.length
  })), { timeout: 5000 }).toEqual({
    microtaskId: 'L01-M08',
    challengeRef: 'L01-M08:C01',
    attemptRevision: 1,
    hearts: 3,
    temporaryResults: 0
  });
});

test('word-form success speaks automatically with visible English and no speaker confirmation click', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M11');

  const snapshot = await runtimeSnapshot(page);
  const challenge = activeContract(snapshot).challenge;
  expect(challenge.channel).toBe('word-form');
  await expect(page.locator('.word-label-choice-grid')).toContainText(challenge.targetText);
  const startsBefore = await page.evaluate(() => window.__audioStarts.length);
  await submitRule(page, challenge.answerRule, challenge, { correct: true });
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
  await expect.poll(() => page.evaluate(() => window.__audioStarts.length)).toBeGreaterThan(startsBefore);
  await expectActiveAudioText(page, await runtimeSnapshot(page));
  await expect(page.getByRole('button', { name: /确认发音|听完继续|播放后确认/ })).toHaveCount(0);
  await finishOneAudio(page);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.stepId)).toBe('L01-M11:S04');
});

test('R3 regression: stage 5 instruction does not disclose the correct English label', async ({ page }) => {
  test.setTimeout(120_000);
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M11');

  const instruction = page.locator([
    '.station-brand strong',
    '.stage-prompt',
    '.mission-prompt',
    '.action-stage__hint',
    '.support-action-instruction'
  ].join(',')).filter({ visible: true });
  await expect(instruction).not.toHaveCount(0);
  const instructionCopy = (await instruction.allTextContents()).join(' ');
  expect(instructionCopy).not.toMatch(/\bhandbag\b/i);
});

test('R3 regression: homeward scene choices stay readable on desktop and phone', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  await openFresh(page);
  await startOrResume(page);
  const expectChoiceGeometry = async (minimumWidth, minimumHeight) => {
    const choices = page.locator('button[data-action="select-entity"]:has(img)');
    await expect(choices).toHaveCount(2);
    const geometry = await choices.evaluateAll(buttons => buttons.map(button => {
      const image = button.querySelector('img');
      const box = image.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      const buttonStyle = getComputedStyle(button);
      const naturalRatio = image.naturalWidth / image.naturalHeight;
      const boxRatio = box.width / box.height;
      const paintedWidth = boxRatio > naturalRatio ? box.height * naturalRatio : box.width;
      const paintedHeight = boxRatio > naturalRatio ? box.height : box.width / naturalRatio;
      const paintedLeft = box.left + ((box.width - paintedWidth) / 2);
      const paintedTop = box.top + ((box.height - paintedHeight) / 2);
      const clipLeft = buttonBox.left + parseFloat(buttonStyle.borderLeftWidth || '0');
      const clipRight = buttonBox.right - parseFloat(buttonStyle.borderRightWidth || '0');
      const clipTop = buttonBox.top + parseFloat(buttonStyle.borderTopWidth || '0');
      const clipBottom = buttonBox.bottom - parseFloat(buttonStyle.borderBottomWidth || '0');
      const visiblePaintedWidth = Math.max(
        0,
        Math.min(paintedLeft + paintedWidth, clipRight) - Math.max(paintedLeft, clipLeft)
      );
      const visiblePaintedHeight = Math.max(
        0,
        Math.min(paintedTop + paintedHeight, clipBottom) - Math.max(paintedTop, clipTop)
      );
      return {
        width: box.width,
        height: box.height,
        paintedWidth,
        paintedHeight,
        visiblePaintedWidth,
        visiblePaintedHeight,
        objectFit: getComputedStyle(image).objectFit
      };
    }));
    for (const box of geometry) {
      expect(box.visiblePaintedWidth, JSON.stringify(geometry)).toBeGreaterThanOrEqual(minimumWidth);
      expect(box.visiblePaintedHeight, JSON.stringify(geometry)).toBeGreaterThanOrEqual(minimumHeight);
      expect(box.objectFit, JSON.stringify(geometry)).toBe('contain');
    }
  };

  await advanceTo(page, 'L02-M20');
  await expectChoiceGeometry(144, 144);
  await completeCurrentMicrotask(page);
  await advanceTo(page, 'L02-M21');
  await expectChoiceGeometry(144, 144);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));
  await expectChoiceGeometry(132, 132);
});

test('reached stages open as an isolated sandbox while future stages stay disabled', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  const before = await durableLedgerRecord(page);

  await page.locator('[data-action="toggle-stages"]').click();
  await expect(page.locator('.stage-map [data-action="preview-exit"]')).toHaveCount(0);
  const completedButton = page.locator('[data-action="preview-jump"][data-value="L01-M07"]');
  const currentButton = page.locator('[data-action="preview-jump"][data-value="L01-M08"]');
  const futureButton = page.locator('[data-action="preview-jump"][data-value="L01-M09"]');
  await expect(completedButton).toBeEnabled();
  await expect(currentButton).toBeEnabled();
  await expect(futureButton).toBeDisabled();
  await expect(completedButton).toContainText('回看');
  await expect(currentButton).toContainText('继续学习');
  await expect(futureButton).toContainText('未到达');
  await expect(completedButton).toHaveAccessibleName(
    `阶段 1：${tasks[0].presentation.title}，${unit.experience.stageNavigation.practiceLabel}`
  );

  const currentBefore = await runtimeSnapshot(page);
  await currentButton.click();
  await expect(page.locator('#course-stage-map')).toHaveCount(0);
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'false');
  expect(await runtimeSnapshot(page)).toMatchObject({
    microtaskId: currentBefore.microtaskId,
    stepId: currentBefore.stepId,
    challengeRef: currentBefore.challengeRef,
    adventureHeartsRemaining: currentBefore.adventureHeartsRemaining
  });
  expect(await durableLedgerRecord(page)).toBe(before);

  await page.locator('[data-action="toggle-stages"]').click();

  await completedButton.click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'true');
  const persistentExit = page.locator('.station-header [data-action="preview-exit"]');
  await expect(persistentExit).toBeVisible();
  await expect(persistentExit).toHaveText('退出回看 · 不保存');
  const replayed = await completeCurrentMicrotask(page);
  expect(replayed.status).toBe('sandbox-complete');
  expect(await durableLedgerRecord(page)).toBe(before);
  const replayComplete = page.locator('[data-stage-replay-complete="true"]');
  await expect(replayComplete).toBeVisible();
  await expect(replayComplete).toContainText('阶段回看完成');
  await expect(replayComplete).toContainText(`回到：${tasks[1].navigationTitle}`);
  await expect(replayComplete.getByRole('button', { name: '返回继续学习' })).toBeVisible();
  await expect(replayComplete.getByRole('button', { name: '选择其他阶段' })).toBeVisible();

  await replayComplete.getByRole('button', { name: '返回继续学习' }).click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M08');
  expect(await durableLedgerRecord(page)).toBe(before);
});

test('leaving a stage replay restores the exact active mainline attempt and restarts its audio', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M09');

  let current = await runtimeSnapshot(page);
  const challenge = activeContract(current).challenge;
  await submitRule(page, challenge.answerRule, challenge, { correct: false });
  await submitRule(page, challenge.answerRule, challenge, { correct: false });
  await submitRule(page, challenge.answerRule, challenge, { correct: true });
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.phase)).toBe('audio-playing');
  const origin = await runtimeSnapshot(page);
  expect(origin.adventureHeartsRemaining).toBe(2);
  expect(origin.temporaryResults).toHaveLength(1);

  await page.locator('[data-action="toggle-stages"]').click();
  await page.locator('[data-action="preview-jump"][data-value="L01-M08"]').click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'true');
  const startsBeforeReturn = await courseAudioStartCount(page);
  await page.locator('.station-header [data-action="preview-exit"]').click();

  await expect(app(page)).toHaveAttribute('data-preview-mode', 'false');
  current = await runtimeSnapshot(page);
  expect(current.microtaskId).toBe(origin.microtaskId);
  expect(current.stepId).toBe(origin.stepId);
  expect(current.challengeRef).toBe(origin.challengeRef);
  expect(current.adventureHeartsRemaining).toBe(origin.adventureHeartsRemaining);
  expect(current.optionIds).toEqual(origin.optionIds);
  expect(current.temporaryResults).toEqual(origin.temporaryResults);
  expect(current.phase).toBe('audio-playing');
  expect(current.audio.segmentId).toBe(origin.audio.segmentId);
  expect(current.audio.requestId).not.toBe(origin.audio.requestId);
  await expect.poll(() => courseAudioStartCount(page)).toBe(startsBeforeReturn + 1);
});

test('a completed replay can switch directly to another completed stage without changing progress', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M09');
  const before = await durableLedgerRecord(page);

  await page.locator('[data-action="toggle-stages"]').click();
  await page.locator('[data-action="preview-jump"][data-value="L01-M07"]').click();
  expect((await completeCurrentMicrotask(page)).status).toBe('sandbox-complete');

  await page.getByRole('button', { name: '选择其他阶段' }).click();
  await expect(page.locator('#course-stage-map')).toBeVisible();
  await page.locator('[data-action="preview-jump"][data-value="L01-M08"]').click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'true');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M08');
  expect(await durableLedgerRecord(page)).toBe(before);

  expect((await completeCurrentMicrotask(page)).status).toBe('sandbox-complete');
  await page.getByRole('button', { name: '返回继续学习' }).click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'false');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M09');
  expect(await durableLedgerRecord(page)).toBe(before);
});

test('stage replay keeps its exit and both completion choices visible on an accepted phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);

  await page.locator('[data-action="toggle-stages"]').click();
  await page.locator('[data-action="preview-jump"][data-value="L01-M07"]').click();
  await expect(page.locator('.station-header [data-action="preview-exit"]')).toBeVisible();
  expect((await completeCurrentMicrotask(page)).status).toBe('sandbox-complete');

  const terminal = page.locator('[data-stage-replay-complete="true"]');
  await expect(terminal.getByRole('button', { name: '返回继续学习' })).toBeVisible();
  await expect(terminal.getByRole('button', { name: '选择其他阶段' })).toBeVisible();
  const actionGeometry = await terminal.locator('button').evaluateAll(buttons => buttons.map(button => {
    const box = button.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, left: box.left, right: box.right };
  }));
  for (const box of actionGeometry) {
    expect(box.top).toBeGreaterThanOrEqual(0);
    expect(box.bottom).toBeLessThanOrEqual(844);
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(390);
  }
  await noForbiddenScroll(page);
});

test('settings offers an explicit entry into the existing reached-stage map', async ({ page }) => {
  await openFresh(page);
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  const before = await durableLedgerRecord(page);

  await page.locator('[data-action="toggle-settings"]').click();
  const stageEntry = page.locator('[data-action="open-stages"]');
  await expect(stageEntry).toBeVisible();
  await expect(stageEntry).toContainText(unit.experience.uiCopy.navigation.chooseStageTitle);
  await expect(page.locator('#course-stage-map')).toHaveCount(0);

  await stageEntry.click();
  await expect(page.locator('#course-settings-panel')).toHaveCount(0);
  await expect(page.locator('#course-stage-map')).toBeVisible();
  await expect(page.locator('[data-action="preview-jump"][data-value="L01-M07"]')).toBeEnabled();
  await expect(page.locator('[data-action="preview-jump"][data-value="L01-M08"]')).toBeEnabled();
  await expect(page.locator('[data-action="preview-jump"][data-value="L01-M09"]')).toBeDisabled();
  expect(await durableLedgerRecord(page)).toBe(before);
});

test('a due review remains a nonblocking reminder and never opens the stage map on entry', async ({ page }) => {
  await openFresh(page);
  await completeCurrentMicrotask(page);
  await completeCurrentMicrotask(page);
  await page.evaluate(storageKey => {
    const record = JSON.parse(localStorage.getItem(storageKey));
    const pending = [record.value];
    let cell = null;
    while (pending.length && !cell) {
      const value = pending.shift();
      if (!value || typeof value !== 'object') continue;
      if (value.reviewCellId && Object.hasOwn(value, 'nextDueDay')) {
        cell = value;
        break;
      }
      pending.push(...Object.values(value));
    }
    if (!cell) throw new Error('fixture review cell is missing');
    cell.nextDueDay = '2000-01-01';
    localStorage.setItem(storageKey, JSON.stringify(record));
  }, STORAGE_KEY);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(window.__lessonScene))).toBe(true);

  await expect(app(page)).toHaveAttribute('data-view', 'mission');
  await expect(page.locator('#course-stage-map')).toHaveCount(0);
  await expect(page.locator('[data-action="toggle-stages"]')).toBeVisible();
  await page.locator('[data-action="toggle-stages"]').click();
  await expect(page.locator('#course-stage-map')).toBeVisible();
  await expect(page.locator('.review-entry')).toBeVisible();
});

test('the real page completes 17 recoverable stages and 29 stable challenges exactly once', async ({ page }) => {
  test.setTimeout(120_000);
  await openFresh(page);
  await startOrResume(page);
  const observedChallenges = new Set();
  const storyActions = [];
  const seenAudioTexts = [];
  const activeTaskIds = new Set();
  const sceneModes = new Set();
  const presentationMoments = new Set();
  const outcomeRestVariants = new Set();
  const handoffMomentIds = new Set();
  const tracking = {
    observedChallenges,
    storyActions,
    seenAudioTexts,
    activeTaskIds,
    sceneModes,
    presentationMoments,
    outcomeRestVariants,
    handoffMomentIds
  };

  for (const [index, task] of tasks.entries()) {
    let snapshot = await runtimeSnapshot(page);
    expect(snapshot.microtaskId).toBe(task.microtaskId);
    expect(snapshot.buildStage).toBe(0);

    await reloadAndResume(page);
    snapshot = await runtimeSnapshot(page);
    expect(snapshot.microtaskId).toBe(task.microtaskId);
    if (task.microtaskId === 'L02-M15') tracking.pauseAtManualPresentation = true;
    const completed = await completeCurrentMicrotask(page, tracking);
    delete tracking.pauseAtManualPresentation;

    const projection = (await ledgerProjection(page)).units[unit.unitId];
    expect(projection.completedMicrotaskIds).toContain(task.microtaskId);
    expect(projection.completedMicrotaskIds).toHaveLength(index + 1);
    if (task.microtaskId === 'L01-M12') {
      await continueRestStop(page, 'lesson1-chapter-stop', tracking);
    }
    if (task.microtaskId === 'L02-M15') {
      const terminalMoment = task.presentation.moments.at(-1);
      expect(completed).toMatchObject({
        status: 'active',
        microtaskId: task.microtaskId,
        microtaskStatus: 'completed',
        currentPresentationMomentId: terminalMoment.momentId,
        presentationAwaitingEnd: true
      });
      expect(terminalMoment.enterWhen).toEqual({ kind: 'microtask-complete' });
      await expect(app(page)).toHaveAttribute('data-scene-mode', 'grammar-lab');
      await expect(page.locator('.knowledge-layer')).toContainText(
        unit.authoredContent['NCE-U01-C-KNOWLEDGE-QUESTION'].text
      );
      await expect(page.locator('.knowledge-card__detail')).toContainText(
        unit.authoredContent['NCE-U01-C-KNOWLEDGE-IT'].text
      );
      await expect(page.locator('[data-action="knowledge-expand"]')).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      await expect(page.locator('[data-action="knowledge-expand"]')).toHaveText('收起');
      await expect(page.locator('[data-action="presentation-end"]')).toBeEnabled();
      await expect(app(page)).toHaveAttribute('data-runtime-status', 'active');
      await page.locator('[data-action="presentation-end"]').click();
      await expect.poll(() => runtimeSnapshot(page).then(current => current.status)).toBe('rest-stop');
      await continueRestStop(page, 'lesson2-midpoint-rest-stop', tracking);
    }
  }

  const finalSnapshot = await runtimeSnapshot(page);
  const finalProjection = (await ledgerProjection(page)).units[unit.unitId];
  expect(finalSnapshot.status).toBe('unit-built');
  expect(finalSnapshot.buildStage).toBe(5);
  await expectOutcomeRest(page, 'unit-built', tracking);
  expect(finalProjection.completedMicrotaskIds).toEqual(tasks.map(task => task.microtaskId));
  expect(Object.keys(finalProjection.reviewCells)).toHaveLength(29);
  expect(observedChallenges).toEqual(new Set(tasks.flatMap(task => (
    task.steps.flatMap(step => (step.challenges || []).map(challenge => challenge.challengeRef))
  ))));
  expect(storyActions).toEqual([
    'handbag->handbag-owner',
    'coat->handbag-owner'
  ]);
  expect(seenAudioTexts.length).toBeGreaterThan(29);
  expect(seenAudioTexts.every(text => typeof text === 'string' && text.length > 0)).toBe(true);
  expect(activeTaskIds).toEqual(new Set(tasks.map(task => task.microtaskId)));
  expect(sceneModes).toEqual(ACTIVE_SCENE_MODES);
  expect(presentationMoments.size).toBeGreaterThanOrEqual(tasks.length);
  expect(outcomeRestVariants).toEqual(OUTCOME_REST_VARIANTS);
  expect(handoffMomentIds).toEqual(new Set([
    'L01-M11:single-handoff',
    'L02-M19:coat-handoff'
  ]));
  expect(taskById.get('L02-M21').presentation.moments.map(moment => moment.momentId))
    .toEqual(expect.arrayContaining(['owner-boards-car', 'car-arrives-home']));
  const growthEffects = await page.evaluate(() => window.__runtimeEffects.filter(effect => (
    effect.type === 'landmark/build-stage'
  )));
  expect(growthEffects).toHaveLength(1);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(window.__lessonScene))).toBe(true);
  await expect(app(page)).toHaveAttribute('data-view', 'complete');
  await expect(app(page)).toHaveAttribute('data-runtime-status', 'unit-built');
  await expect(app(page)).toHaveAttribute('data-build-stage', '5');
  await expect(page.locator('.completion-card')).toBeVisible();
  await expect(page.locator('.opening-stars i')).toHaveText(['★', '★', '★']);
  await expect(page.locator('[data-action="start"]')).toHaveCount(0);
});

test('Lesson 1 saves whole-role recovery, then unlocks a no-progress seven-line manual replay', async ({ page }) => {
  test.setTimeout(120_000);
  const formal = taskById.get('L01-M12').steps[0].practice;
  const manual = outcomePracticeById.get('L01-RS01:manual-dialogue');
  expect(formal?.rounds).toHaveLength(2);
  expect(manual?.dialogueTurnRefs).toHaveLength(7);
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M12');
  await expect(page.locator('.outcome-practice-card--role-enactment')).toBeVisible();
  if (process.env.CAPTURE_LESSON_ROLE_QA === '1') {
    await page.screenshot({
      path: 'output/playwright/lesson1-role-selection-desktop.png',
      fullPage: true
    });
  }
  const desktopViewport = page.viewportSize();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.outcome-practice-card--role-enactment')).toBeVisible();
  await expect(page.locator('.role-practice-character__name')).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  if (process.env.CAPTURE_LESSON_ROLE_QA === '1') {
    await page.screenshot({
      path: 'output/playwright/lesson1-role-selection-phone.png',
      fullPage: true
    });
  }
  await page.setViewportSize(desktopViewport);
  await expectOptionalPracticeHasNoGamification(page);
  const leftCharacter = page.locator('.role-practice-character--left');
  const rightCharacter = page.locator('.role-practice-character--right');
  await expect(leftCharacter).toHaveAttribute('data-entity-id', formal.castOrder[0]);
  await expect(rightCharacter).toHaveAttribute('data-entity-id', formal.castOrder[1]);

  const ownerRound = formal.rounds.find(round => round.roleEntityId === 'handbag-owner');
  const keeperRound = formal.rounds.find(round => round.roleEntityId === 'station-keeper');
  let startsBefore = await courseAudioStartCount(page);
  startsBefore = await finishFormalRoleRound(page, formal, ownerRound, startsBefore);
  const afterOwner = (await ledgerProjection(page)).units[unit.unitId];
  expect(afterOwner.completedMicrotaskIds).not.toContain('L01-M12');
  expect(afterOwner.rolePracticeProgress[formal.practiceId].completedRoundIds)
    .toEqual([ownerRound.roundId]);

  await reloadAndResume(page);
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M12');
  await expect(page.locator(
    `[data-action="practice-role-select"][data-value="${ownerRound.roundId}"]`
  )).toBeDisabled();
  await expect(leftCharacter).toHaveAttribute('data-entity-id', formal.castOrder[0]);
  await expect(rightCharacter).toHaveAttribute('data-entity-id', formal.castOrder[1]);
  startsBefore = await courseAudioStartCount(page);
  await finishFormalRoleRound(page, formal, keeperRound, startsBefore);
  await expect(page.locator('.outcome-practice-card--role-enactment'))
    .toHaveAttribute('data-practice-phase', 'all-roles-complete');
  await expect(page.locator('[data-action="practice-enter-manual"]')).toBeVisible();
  await page.locator('[data-action="practice-continue-course"]').click();
  await expectOutcomeRest(page, 'lesson1-chapter-stop');

  const baseline = await mainlineIsolationRecord(page);
  await page.locator('[data-action="toggle-stages"]').click();
  const manualEntry = page.locator(
    `.stage-practice-tool[data-action="start-outcome-practice"][data-value="${manual.practiceId}"]`
  );
  await expect(manualEntry).toBeVisible();
  await manualEntry.click();
  await expect(page.locator('.outcome-practice-card--manual-dialogue')).toBeVisible();
  await expect(app(page)).toHaveAttribute('data-scene-mode', manual.sceneMode);
  await expect(app(page)).toHaveAttribute('data-scene-variant', manual.sceneVariant);
  await expect(page.locator('.station-world')).toHaveAttribute('data-prop-surface', manual.propSurface);
  await expect(page.locator('.role-practice-counter-surface')).toHaveCount(1);
  await expect(page.locator(
    '.role-practice-counter-surface > .role-practice-counter-prop[data-entity-id="handbag"]'
  )).toBeVisible();
  if (process.env.CAPTURE_LESSON_ROLE_QA === '1') {
    await page.screenshot({
      path: 'output/playwright/lesson1-manual-dialogue-desktop.png',
      fullPage: true
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.outcome-practice-card--manual-dialogue')).toBeVisible();
  await expect(page.locator('.role-practice-character__speaker')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  if (process.env.CAPTURE_LESSON_ROLE_QA === '1') {
    await page.screenshot({
      path: 'output/playwright/lesson1-manual-dialogue-phone.png',
      fullPage: true
    });
  }
  await page.setViewportSize(desktopViewport);
  await expectOptionalPracticeHasNoGamification(page);
  await expectMainlineUnchanged(page, baseline);
  for (const sourceRef of manual.dialogueTurnRefs) {
    await expect(page.getByText(sourceByRef.get(sourceRef).text, { exact: true })).toHaveCount(0);
  }

  const firstHint = manual.turnHints[0];
  await page.locator('[data-action="practice-hint"]').click();
  await expect(page.locator('.manual-dialogue-hint')).toContainText(firstHint.intent);
  await expect(page.locator('.manual-dialogue-hint')).not.toContainText(firstHint.openingChunk);
  await page.locator('[data-action="practice-hint"]').click();
  await expect(page.locator('.manual-dialogue-hint')).toContainText(firstHint.openingChunk);
  await expect(page.locator('[data-action="practice-hint"]')).toHaveCount(0);

  startsBefore = await courseAudioStartCount(page);
  for (const [index, sourceRef] of manual.dialogueTurnRefs.entries()) {
    const line = page.locator(`.manual-dialogue-line[data-source-ref="${sourceRef}"]`);
    await expect(line).toHaveClass(/is-current/);
    await page.locator('[data-action="practice-reveal"]').click();
    await expect(line).toContainText(sourceByRef.get(sourceRef).text);
    startsBefore = await expectPracticeAudioStarted(page, sourceRef, startsBefore);
    await expect(page.locator('[data-action="practice-reveal"]')).toHaveCount(0);
    await finishOneAudio(page);
    if (index === 0) {
      const secondLine = page.locator(
        `.manual-dialogue-line[data-source-ref="${manual.dialogueTurnRefs[1]}"]`
      );
      await expect(secondLine).toHaveClass(/is-current/);
      await line.locator('[data-action="practice-line-replay"]').click();
      startsBefore = await expectPracticeAudioStarted(page, sourceRef, startsBefore);
      await finishOneAudio(page);
      await expect(secondLine).toHaveClass(/is-current/);
    }
  }
  await expect(page.locator('.outcome-practice-card--manual-dialogue'))
    .toHaveAttribute('data-practice-phase', 'manual-complete');
  await expect(page.locator('[data-action="practice-restart"]')).toBeVisible();
  await expect(page.locator('[data-action="practice-return-mainline"]'))
    .toHaveText(manual.returnMainlineLabel);
  for (const sourceRef of manual.dialogueTurnRefs) {
    await expect(page.locator(
      `.manual-dialogue-line[data-source-ref="${sourceRef}"]`
    )).toContainText(sourceByRef.get(sourceRef).text);
  }
  await expectMainlineUnchanged(page, baseline);
  await page.locator('[data-action="practice-return-mainline"]').click();
  await expect(page.locator('#course-stage-map')).toHaveCount(0);
  await expectOutcomeRest(page, 'lesson1-chapter-stop');
  await expectMainlineUnchanged(page, baseline);
});

test('role practice skips one role truthfully, hides unavailable actions, and recovers from the map', async ({ page }) => {
  test.setTimeout(120_000);
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M12');

  await expect(page.locator('.station-brand strong')).toHaveText('角色扮演');
  const formal = taskById.get('L01-M12').steps[0].practice;
  const ownerRound = formal.rounds.find(round => round.roleEntityId === 'handbag-owner');
  const keeperRound = formal.rounds.find(round => round.roleEntityId === 'station-keeper');
  await expect(page.locator('.role-practice-copy h1')).toHaveText('选择你想扮演的角色');
  await expect(page.locator('[data-action="practice-skip"]')).toHaveCount(0);
  await expect(page.locator('.role-choice strong')).toHaveText([
    '你来当招领员', '你来当女顾客'
  ]);
  await expect(page.locator('.role-choice-grid')).not.toContainText('完整演完七句');

  await page.locator(
    `[data-action="practice-role-select"][data-value="${ownerRound.roundId}"]`
  ).click();
  const skip = page.locator('[data-action="practice-skip"]');
  await expect.poll(() => page.evaluate(() => window.__pendingCourseAudioCount())).toBe(1);
  await expect(skip).toHaveCount(0);
  await expect(page.locator('[data-action="practice-hint"]')).toHaveCount(0);
  await finishOneAudio(page);
  await expect(skip).toBeVisible();
  await expect(skip).toHaveText(unit.experience.uiCopy.roleSkip.actionLabel);

  const hint = formal.turnHints.find(item => item.turnRef === 'L01-D02');
  const hintButton = page.locator('[data-action="practice-hint"]');
  await expect(hintButton).toHaveText('提示');
  await hintButton.click();
  await expect(page.locator('.role-enactment-hint')).toContainText(hint.intent);
  await expect(page.locator('.role-enactment-hint')).not.toContainText(hint.openingChunk);
  await expect(hintButton).toHaveText('再提示');
  await hintButton.click();
  await expect(page.locator('.role-enactment-hint')).toContainText(hint.openingChunk);
  await expect(hintButton).toHaveCount(0);

  await skip.click();
  const dialog = page.locator('.role-skip-dialog');
  await expect(dialog.locator('h2')).toHaveText('跳过这个角色？');
  await expect(dialog.locator('p')).toHaveCount(0);
  await expect(dialog.locator('[data-action="role-skip-cancel"]')).toHaveText('继续扮演');
  await expect(dialog.locator('[data-action="role-skip-confirm"]')).toHaveText('跳过这个角色');
  await expect.poll(() => page.evaluate(() => document.activeElement?.dataset.action))
    .toBe('role-skip-cancel');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);

  await skip.click();
  await page.evaluate(() => { window.__failLedgerWrites = true; });
  await page.locator('[data-action="role-skip-confirm"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M12');
  await expect(page.locator('.outcome-practice-card--role-enactment'))
    .toHaveAttribute('data-practice-phase', 'round-skip-save-failed');
  await expect(page.locator('[data-action="practice-round-save-retry"]')).toBeVisible();
  await expect(page.locator('[data-action="practice-skip"]')).toHaveCount(0);
  expect((await ledgerProjection(page)).units[unit.unitId].skippedMicrotaskIds)
    .not.toContain('L01-M12');

  await page.evaluate(() => { window.__failLedgerWrites = false; });
  await page.locator('[data-action="practice-round-save-retry"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M12');
  await expect(page.locator(
    `[data-action="practice-role-select"][data-value="${ownerRound.roundId}"]`
  )).toBeEnabled();
  await expect(page.locator('.role-choice-slot.is-skipped .role-choice-status'))
    .toHaveText('已跳过');
  const partialProjection = (await ledgerProjection(page)).units[unit.unitId];
  expect(partialProjection.skippedMicrotaskIds).not.toContain('L01-M12');
  expect(partialProjection.rolePracticeProgress[formal.practiceId].skippedRoundIds)
    .toEqual([ownerRound.roundId]);

  let startsBefore = await courseAudioStartCount(page);
  await finishFormalRoleRound(page, formal, keeperRound, startsBefore);
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L02-M11');
  const skippedProjection = (await ledgerProjection(page)).units[unit.unitId];
  expect(skippedProjection.skippedMicrotaskIds).toContain('L01-M12');
  expect(skippedProjection.completedMicrotaskIds).not.toContain('L01-M12');
  expect(skippedProjection.rolePracticeProgress[formal.practiceId]).toMatchObject({
    completedRoundIds: [keeperRound.roundId], skippedRoundIds: [ownerRound.roundId]
  });

  await page.locator('[data-action="toggle-stages"]').click();
  const skippedStage = page.locator(
    '[data-action="preview-jump"][data-value="L01-M12"]'
  );
  await expect(skippedStage).toHaveClass(/is-skipped/);
  await expect(skippedStage).toContainText(unit.experience.stageNavigation.skippedLabel);
  await expect(page.locator('[data-action="start-outcome-practice"]')).toHaveCount(0);
  await skippedStage.click();
  await expect(app(page)).toHaveAttribute('data-skip-recovery', 'true');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M12');
  await expect(page.locator(
    `[data-action="practice-role-select"][data-value="${keeperRound.roundId}"]`
  )).toBeDisabled();
  await expect(page.locator(
    `[data-action="practice-role-select"][data-value="${ownerRound.roundId}"]`
  )).toBeEnabled();
  await expect(page.locator('[data-action="practice-return-learning"]'))
    .toHaveText(formal.returnLearningLabel);

  startsBefore = await courseAudioStartCount(page);
  await finishFormalRoleRound(page, formal, ownerRound, startsBefore);
  await expect(page.locator('.outcome-practice-card--role-enactment'))
    .toHaveAttribute('data-practice-phase', 'all-roles-complete');
  await expect(page.locator('[data-action="practice-enter-manual"]')).toHaveCount(0);
  await page.locator('[data-action="practice-complete-recovery"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L02-M11');
  await expect(app(page)).toHaveAttribute('data-skip-recovery', 'false');
  const completedProjection = (await ledgerProjection(page)).units[unit.unitId];
  expect(completedProjection.skippedMicrotaskIds).not.toContain('L01-M12');
  expect(completedProjection.completedMicrotaskIds).toContain('L01-M12');
});

test('stage eleven uses five editable word tokens and keeps wrong work available for correction', async ({ page }) => {
  test.setTimeout(120_000);
  await openFresh(page);
  await startOrResume(page);
  const snapshot = await advanceTo(page, 'L02-M15');
  const challenge = activeContract(snapshot).challenge;
  const accepted = challenge.answerRule.acceptedOrder;
  expect(accepted).toHaveLength(5);

  const bank = page.locator('.block-builder__bank [data-action="add-block"]');
  const track = page.locator('.block-builder__track [data-action="remove-block"]');
  await expect(bank).toHaveCount(5);
  expect(await bank.evaluateAll(buttons => buttons.map(button => button.dataset.value)))
    .not.toEqual(accepted);
  await expect(track).toHaveCount(0);

  const originalViewport = page.viewportSize();
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 762, height: 430 }
  ]) {
    await page.setViewportSize(viewport);
    await settleSceneViewport(page, viewport);
    await expect(bank).toHaveCount(5);
    expect(await bank.evaluateAll(buttons => buttons.every(button => {
      const box = button.getBoundingClientRect();
      return box.width >= 44 && box.height >= 44;
    }))).toBe(true);
    await noForbiddenScroll(page);
  }
  await page.setViewportSize(originalViewport);
  await settleSceneViewport(page, originalViewport);

  const wrongOrder = [accepted[1], accepted[0], ...accepted.slice(2)];
  for (const value of wrongOrder) {
    await page.locator(`[data-action="add-block"][data-value="${value}"]`).click();
  }
  await expect(track).toHaveCount(5);
  await expect(page.locator('[data-action="reset-blocks"]')).toHaveText(
    unit.experience.uiCopy.interaction.reorderLabel
  );
  const resetBox = await page.locator('[data-action="reset-blocks"]').evaluate(button => {
    const box = button.getBoundingClientRect();
    return { width: box.width, height: box.height };
  });
  expect(resetBox.width).toBeGreaterThanOrEqual(44);
  expect(resetBox.height).toBeGreaterThanOrEqual(44);
  await track.first().click();
  await expect(track).toHaveCount(4);
  await page.locator('[data-action="reset-blocks"]').click();
  await expect(track).toHaveCount(0);
  await expect(bank).toHaveCount(5);

  for (const value of wrongOrder) {
    await page.locator(`[data-action="add-block"][data-value="${value}"]`).click();
  }
  const boundaryValues = await page.locator(
    '.block-builder [data-boundary-cue="true"], .block-builder .is-boundary-cue'
  ).evaluateAll(elements => [...new Set(elements.map(element => element.dataset.value))].sort());
  expect(boundaryValues).toEqual([accepted[0], accepted.at(-1)].sort());
  await page.locator('[data-action="reset-blocks"]').click();
  for (const value of accepted) {
    await page.locator(`[data-action="add-block"][data-value="${value}"]`).click();
  }
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
  const feedback = await runtimeSnapshot(page);
  expect(feedback.audio).toMatchObject({
    purpose: 'word-form-answer',
    currentSegment: { text: 'Is this your watch?' }
  });
  await expect(page.getByText('Is this your watch?', { exact: true })).toBeVisible();

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 762, height: 430 }
  ]) {
    await page.setViewportSize(viewport);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('unit recap gates all three answers on real ended and replay only opens the completed stage map', async ({ page }) => {
  test.setTimeout(120_000);
  const practice = outcomePracticeById.get('NCE-U01-OUTCOME:case-recap');
  expect(practice?.items).toHaveLength(3);
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L02-M21');
  await completeCurrentMicrotask(page);
  await expectOutcomeRest(page, 'unit-built');

  const baseline = await mainlineIsolationRecord(page);
  expect(baseline.rawStorage).toBeTruthy();
  const entry = page.locator(
    `[data-action="start-outcome-practice"][data-value="${practice.practiceId}"]`
  );
  await expect(entry).toBeVisible({ timeout: 5_000 });
  await entry.click();
  await expect(page.locator('.outcome-practice-card--case-recap')).toBeVisible();
  await expect(page.locator('.outcome-practice-card--case-recap .kicker')).toHaveCount(0);
  await expect(page.locator('.outcome-practice-card--case-recap .practice-copy > p:not(.practice-position)'))
    .toHaveCount(0);
  await expect(page.locator(
    '[data-copy-purpose="task"][data-copy-priority="primary"]:visible'
  )).toHaveCount(1);
  await expectOptionalPracticeHasNoGamification(page);
  await expectMainlineUnchanged(page, baseline);
  await expect(page.locator('.practice-options')).toContainText('女顾客');
  await expect(page.locator('.practice-options')).not.toContainText('手提包主人');

  const firstItem = practice.items[0];
  const firstWrong = firstItem.options.find(option => (
    !recapOptionMatchesRule(option, firstItem.answerRule)
  ));
  const startsBeforeWrong = await courseAudioStartCount(page);
  await page.locator(
    `[data-action="practice-submit"][data-value="${firstWrong.optionId}"]`
  ).click();
  await expect(page.locator('.practice-answer-feedback.is-wrong')).toHaveText(practice.wrongCopy);
  expect(await courseAudioStartCount(page)).toBe(startsBeforeWrong);
  await expect(page.locator(
    '[data-action="practice-next"], [data-action="practice-finish"]'
  )).toHaveCount(0);
  await expectMainlineUnchanged(page, baseline);

  await page.locator('[data-action="practice-exit"]').click();
  await expectOutcomeRest(page, 'unit-built');
  await expectMainlineUnchanged(page, baseline);
  await expect(entry).toBeVisible({ timeout: 5_000 });
  await entry.click();
  await expect(page.locator('.outcome-practice-card--case-recap')).toBeVisible();
  await expectMainlineUnchanged(page, baseline);

  await page.locator(
    `[data-action="practice-submit"][data-value="${firstWrong.optionId}"]`
  ).click();
  await expect(page.locator('.practice-answer-feedback.is-wrong')).toHaveText(practice.wrongCopy);
  await expectMainlineUnchanged(page, baseline);

  for (const [index, item] of practice.items.entries()) {
    await expect(page.getByRole('heading', {
      name: unit.authoredContent[item.promptRef].text
    })).toBeVisible();
    if (item.itemId === 'recap-new-route') {
      await expect(page.locator('.practice-options strong')).toHaveText(['house', 'car', 'watch']);
      await expect(page.locator('.practice-options small')).toHaveCount(0);
      await expect(page.locator('.practice-options')).not.toContainText(/房子|小汽车|手表/);
      await page.locator(
        '[data-action="practice-submit"][data-value="route-car"]'
      ).click();
      await expect(page.locator('.practice-answer-feedback.is-wrong'))
        .toHaveText(practice.wrongCopy);
      await expect(page.locator('.practice-options strong')).toHaveText(['house', 'car', 'watch']);
      await expect(page.locator('.practice-options small')).toHaveCount(0);
      await expect(page.locator('.practice-options')).not.toContainText(/房子|小汽车|手表/);
    }
    await answerRecapCorrectly(page, item, index === practice.items.length - 1);
    if (item.itemId === 'recap-new-route') {
      await expect(page.locator('.practice-options strong')).toHaveText(['house', 'car', 'watch']);
      await expect(page.locator('.practice-options small')).toHaveCount(0);
      await expect(page.locator('.practice-options')).not.toContainText(/房子|小汽车|手表/);
      await expect(page.locator('.practice-answer-feedback.is-correct')).toHaveCount(0);
      await expect(page.locator('.practice-answer-audio > strong')).toHaveText('house');
      expect(await page.locator('.practice-options .practice-option').evaluateAll(buttons => (
        buttons.map(button => button.getAttribute('aria-label') || button.textContent.trim())
      ))).toEqual(['house', 'car', 'watch']);
    }
    await expectMainlineUnchanged(page, baseline);
    if (index < practice.items.length - 1) {
      await page.locator('[data-action="practice-next"]').click();
    }
  }

  await page.locator('[data-action="practice-finish"]').click();
  await expect(page.locator('.practice-finished')).toContainText(practice.finishedTitle);
  await expect(page.locator('.practice-finished > p')).toHaveCount(0);
  await expectOptionalPracticeHasNoGamification(page);
  await expectMainlineUnchanged(page, baseline);
  await page.locator('[data-action="practice-exit"]').click();
  await expectOutcomeRest(page, 'unit-built');
  await expectMainlineUnchanged(page, baseline);

  await page.locator('[data-action="replay"]').click();
  await expect(page.locator('#course-stage-map')).toBeVisible();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'false');
  await expect(page.locator(
    '#course-stage-map [data-action="preview-jump"]:not(:disabled)'
  )).toHaveCount(tasks.length);
  await expectMainlineUnchanged(page, baseline);
  await page.locator('[data-action="close-stages"]').click();
  await expect(page.locator('.completion-card')).toBeVisible();
  await expectMainlineUnchanged(page, baseline);
});

test('a final save failure cannot grow the landmark and a retry grows it only once', async ({ page }) => {
  test.setTimeout(120_000);
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L02-M21');
  const observedChallenges = new Set();
  const tracking = { observedChallenges, storyActions: [], seenAudioTexts: [] };

  while ((await runtimeSnapshot(page)).challengeRef !== 'L02-M21:C02') {
    await answerCurrent(page, tracking);
    await drainAudio(page, tracking.seenAudioTexts);
  }
  await page.evaluate(() => { window.__failLedgerWrites = true; });
  await answerCurrent(page, tracking);
  await drainAudio(page, tracking.seenAudioTexts, tracking);
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.phase)).toBe('persistence-retry');
  const failedSnapshot = await settlePresentation(page, tracking);
  expect(failedSnapshot.buildStage).toBe(0);
  const pendingRecordBeforeReload = await page.evaluate(pendingKey => (
    localStorage.getItem(pendingKey)
  ), PENDING_COMMIT_KEY);
  expect(pendingRecordBeforeReload).toBeTruthy();
  const pendingPayloadBeforeReload = JSON.parse(pendingRecordBeforeReload).value.payload;
  expect(pendingPayloadBeforeReload.microtaskId).toBe('L02-M21');
  expect(pendingPayloadBeforeReload.targetResults).toEqual(failedSnapshot.temporaryResults);
  expect((await ledgerProjection(page)).units[unit.unitId].completedMicrotaskIds).not.toContain('L02-M21');
  expect(await page.evaluate(() => window.__runtimeEffects.filter(effect => (
    effect.type === 'landmark/build-stage'
  )).length)).toBe(0);
  await expect(page.locator('[data-action="persistence-retry"]')).toBeVisible();

  await reloadAndResume(page);
  const restored = await settlePresentation(page, tracking);
  expect(restored).toMatchObject({
    microtaskId: 'L02-M21',
    phase: 'persistence-retry',
    microtaskStatus: 'answered',
    buildStage: 0
  });
  expect(restored.pendingCommit.payload).toEqual(pendingPayloadBeforeReload);
  expect(restored.temporaryResults).toEqual(pendingPayloadBeforeReload.targetResults);
  expect(await page.evaluate(pendingKey => localStorage.getItem(pendingKey), PENDING_COMMIT_KEY))
    .toBe(pendingRecordBeforeReload);
  await expect(page.locator('[data-action="persistence-retry"]')).toBeVisible();
  await expect(page.locator([
    '[data-action="select-entity"]',
    '[data-action="select-target"]',
    '[data-action="select-source"]',
    '[data-action="select-diagnostic"]',
    '[data-action="add-block"]',
    '[data-action="connect-reference"]'
  ].join(','))).toHaveCount(0);

  await page.locator('[data-action="persistence-retry"]').click();
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.status)).toBe('unit-built');
  expect((await runtimeSnapshot(page)).buildStage).toBe(5);
  expect(await page.evaluate(() => window.__runtimeEffects.filter(effect => (
    effect.type === 'landmark/build-stage'
  )).length)).toBe(1);
  await expect(page.locator('[data-action="persistence-retry"]')).toHaveCount(0);
  expect(JSON.parse(await page.evaluate(pendingKey => (
    localStorage.getItem(pendingKey)
  ), PENDING_COMMIT_KEY)).value).toBeNull();
  await expectOutcomeRest(page, 'unit-built');
});

test('desktop and accepted phone widths have no horizontal or nested-card scrolling', async ({ page }) => {
  test.setTimeout(120_000);
  await openFresh(page);
  await startOrResume(page);
  const viewports = [
    { width: 1440, height: 900 },
    { width: 360, height: 640 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 844, height: 390, landscape: true },
    { width: 390, height: 844 }
  ];
  const inspectAllViewports = async () => {
    const beforeRotation = await runtimeSnapshot(page);
    const stableRuntimePosition = {
      status: beforeRotation.status,
      phase: beforeRotation.phase,
      microtaskId: beforeRotation.microtaskId,
      challengeRef: beforeRotation.challengeRef,
      currentPresentationMomentId: beforeRotation.currentPresentationMomentId,
      temporaryResults: beforeRotation.temporaryResults
    };
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      if (viewport.landscape) {
        await expect(page.locator('.portrait-hint')).toBeVisible();
        await expect(page.locator('.portrait-hint')).toHaveText(unit.experience.uiCopy.scene.portraitHint);
      } else {
        await expect(page.locator('.portrait-hint')).toBeHidden();
      }
      await noForbiddenScroll(page);
      const afterRotation = await runtimeSnapshot(page);
      expect({
        status: afterRotation.status,
        phase: afterRotation.phase,
        microtaskId: afterRotation.microtaskId,
        challengeRef: afterRotation.challengeRef,
        currentPresentationMomentId: afterRotation.currentPresentationMomentId,
        temporaryResults: afterRotation.temporaryResults
      }).toEqual(stableRuntimePosition);
    }
  };

  await inspectAllViewports();
  await advanceTo(page, 'L01-M12');
  await completeCurrentMicrotask(page);
  await expectOutcomeRest(page, 'lesson1-chapter-stop');
  await inspectAllViewports();
  await continueRestStop(page, 'lesson1-chapter-stop');
  await expect(app(page)).toHaveAttribute('data-scene-mode', 'object-workbench');
  await inspectAllViewports();
  await advanceTo(page, 'L02-M15');
  await expect(app(page)).toHaveAttribute('data-scene-mode', 'grammar-lab');
  await inspectAllViewports();
  await completeCurrentMicrotask(page, { pauseAtManualPresentation: true });
  await inspectAllViewports();
  await page.locator('[data-action="presentation-end"]').click();
  await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.status)).toBe('rest-stop');
  await expectOutcomeRest(page, 'lesson2-midpoint-rest-stop');
  await inspectAllViewports();
  await continueRestStop(page, 'lesson2-midpoint-rest-stop');
  await advanceTo(page, 'L02-M20');
  await expect(app(page)).toHaveAttribute('data-scene-mode', 'story-journey');
  await inspectAllViewports();
  await advanceTo(page, 'L02-M21');
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('.portrait-hint')).toBeVisible();
  await completeCurrentMicrotask(page);
  await expectOutcomeRest(page, 'unit-built');
  await inspectAllViewports();
});

test('the main experience links to the isolated catalog-owned cross-day review contract', async () => {
  expect(unit.experience.reviewRun).toMatchObject({
    href: '/poc/lesson1-2-review/',
    itemRange: [2, 4],
    durationSecondsRange: [45, 90],
    deferLabel: expect.any(String),
    heartPool: 'isolated-three-hearts',
    zeroAction: 'restart-entire-review-run'
  });
  expect(unit.experience.reviewRun.copy).toMatchObject({
    entryTitle: expect.any(String),
    startLabel: expect.any(String)
  });
  expect(Object.keys(unit.reviewContexts)).toHaveLength(4);
});

test('inspection remediation keeps the role scene on the real counter with stable desktop characters', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M07');

  const storyGeometry = await page.locator(
    '.scene-people > .scene-character[data-entity-id]'
  ).evaluateAll(elements => Object.fromEntries(elements.map(element => {
    const box = element.getBoundingClientRect();
    return [element.dataset.entityId, {
      width: box.width,
      height: box.height,
      bottom: window.innerHeight - box.bottom
    }];
  })));
  expect(Object.keys(storyGeometry).sort()).toEqual(['handbag-owner', 'station-keeper']);

  await advanceTo(page, 'L01-M12');
  const practiceGeometry = await page.locator(
    '.role-practice-character[data-entity-id]'
  ).evaluateAll(elements => Object.fromEntries(elements.map(element => {
    const box = element.getBoundingClientRect();
    return [element.dataset.entityId, {
      width: box.width,
      height: box.height,
      bottom: window.innerHeight - box.bottom
    }];
  })));
  expect(Object.keys(practiceGeometry).sort()).toEqual(['handbag-owner', 'station-keeper']);
  for (const entityId of Object.keys(storyGeometry)) {
    const widthRatio = practiceGeometry[entityId].width / storyGeometry[entityId].width;
    const heightRatio = practiceGeometry[entityId].height / storyGeometry[entityId].height;
    expect(widthRatio, `${entityId} width must stay stable within the desktop profile`)
      .toBeGreaterThanOrEqual(0.88);
    expect(widthRatio, `${entityId} width must stay stable within the desktop profile`)
      .toBeLessThanOrEqual(1.12);
    expect(heightRatio, `${entityId} height must stay stable within the desktop profile`)
      .toBeGreaterThanOrEqual(0.88);
    expect(heightRatio, `${entityId} height must stay stable within the desktop profile`)
      .toBeLessThanOrEqual(1.12);
    expect(Math.abs(practiceGeometry[entityId].bottom - storyGeometry[entityId].bottom))
      .toBeLessThanOrEqual(32);
  }

  const counterPaint = await page.locator('.role-practice-counter-surface').evaluate(element => {
    const style = getComputedStyle(element);
    return {
      backgroundImage: style.backgroundImage,
      backgroundColor: style.backgroundColor,
      borderTopWidth: style.borderTopWidth,
      borderRightWidth: style.borderRightWidth,
      borderBottomWidth: style.borderBottomWidth,
      borderLeftWidth: style.borderLeftWidth,
      boxShadow: style.boxShadow
    };
  });
  expect(counterPaint).toEqual({
    backgroundImage: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderTopWidth: '0px',
    borderRightWidth: '0px',
    borderBottomWidth: '0px',
    borderLeftWidth: '0px',
    boxShadow: 'none'
  });
});

test('inspection remediation atomically leaves role practice when replaying stage one', async ({ page }) => {
  test.setTimeout(180_000);
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M12');
  await expect(page.locator('.outcome-practice-card--role-enactment')).toBeVisible();

  await page.locator('[data-action="toggle-stages"]').click();
  await page.locator('[data-action="preview-jump"][data-value="L01-M07"]').click();

  await expect(app(page)).toHaveAttribute('data-preview-mode', 'true');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M07');
  await expect(page.locator('.outcome-practice-card--role-enactment')).toHaveCount(0);
  await expect(page.locator('.dialogue-listen')).toBeVisible();
  const replayed = await runtimeSnapshot(page);
  expect(replayed).toMatchObject({ microtaskId: 'L01-M07', status: 'active' });
});

test('inspection remediation removes drag affordances from the four personal-item stages', async ({ page }) => {
  test.setTimeout(240_000);
  await openFresh(page);
  await startOrResume(page);

  for (const microtaskId of ['L02-M11', 'L02-M12', 'L02-M13', 'L02-M14']) {
    await advanceTo(page, microtaskId);
    await expect(app(page)).toHaveAttribute('data-runtime-microtask', microtaskId);
    await expect(page.locator('[data-drag-source], [data-drop-target], [draggable="true"]'))
      .toHaveCount(0);
    await expect(page.locator('.stage-prompt, .mission-prompt').first())
      .not.toContainText(/拖|贴到|放到|放回/);
    await completeCurrentMicrotask(page);
  }
});

test('inspection remediation keeps both people in stage eleven and uses the theme replay icon only', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page);
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L02-M15');

  const people = page.locator('.scene-people > .scene-character[data-entity-id]');
  await expect(people).toHaveCount(2);
  await expect(page.locator('.scene-character[data-entity-id="station-keeper"]')).toBeVisible();
  await expect(page.locator('.scene-character[data-entity-id="handbag-owner"]')).toBeVisible();

  const firstChallenge = activeContract(snapshot).challenge;
  await submitRule(page, firstChallenge.answerRule, firstChallenge);
  snapshot = await drainAudio(page);
  expect(snapshot).toMatchObject({ microtaskId: 'L02-M15', stepId: 'L02-M15:S03' });

  const replay = page.locator('.shared-listen-replay');
  await expect(replay).toBeVisible();
  await expect(replay.locator('small')).toHaveCount(0);
  const replayButton = replay.getByRole('button', { name: '重新播放英文' });
  await expect(replayButton).toBeVisible();
  await expect(replayButton).toHaveText('');
  await expect(replayButton.locator('img[src*="starlight-audio-replay-v1"]')).toHaveCount(1);
  await expect(page.locator('.scene-props > button.scene-prop')).toHaveCount(3);
  await expect(page.locator('.interaction-space .prop-shelf')).toHaveCount(0);
});

test('inspection remediation hands the bag to its owner with one click and waits after her thanks', async ({ page }) => {
  test.setTimeout(180_000);
  await openFresh(page);
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L01-M11');
  const labelChallenge = activeContract(snapshot).challenge;
  await submitRule(page, labelChallenge.answerRule, labelChallenge);
  snapshot = await drainAudio(page);
  expect(snapshot).toMatchObject({ microtaskId: 'L01-M11', stepId: 'L01-M11:S04' });
  const thanksChallenge = activeContract(snapshot).challenge;
  await submitRule(page, thanksChallenge.answerRule, thanksChallenge);
  snapshot = await drainAudio(page);
  expect(snapshot).toMatchObject({ microtaskId: 'L01-M11', stepId: 'L01-M11:S03' });

  await expect(page.locator('.mission-console'))
    .toHaveAttribute('data-task-surface', 'scene-action');

  await expect(page.locator('[data-drag-source], [data-drop-target], [draggable="true"]'))
    .toHaveCount(0);
  const inactiveHandbag = page.locator('button.scene-prop[data-entity-id="handbag"]');
  await expect(inactiveHandbag).toBeDisabled();
  await expect(inactiveHandbag).not.toHaveAttribute('data-action');
  const owner = page.locator('button.scene-character[data-entity-id="handbag-owner"]');
  await expect(owner).toBeVisible();
  await owner.click();

  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase))
    .toBe('audio-playing');
  snapshot = await runtimeSnapshot(page);
  expect(snapshot.audio.currentSegment.text).toBe('Thank you very much.');
  expect(snapshot.audio.currentSegment.speaker).toBe('woman');
  await expect(page.locator('[data-action="presentation-end"]')).toHaveCount(0);
  await finishOneAudio(page);
  await expect(page.locator('[data-action="presentation-end"]')).toBeVisible();
  expect(await runtimeSnapshot(page)).toMatchObject({
    microtaskId: 'L01-M11',
    status: 'active'
  });
});

test('R2 keeps listen, replay, real candidates and correct pronunciation in one stable workbench', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L02-M11');

  await expect(page.locator('.inline-language-replay')).toBeVisible();
  await expect(page.locator('.shared-listen-replay__button')).toBeVisible();
  await expect(page.locator('.scene-props > button.scene-prop')).toHaveCount(4);
  await expect(page.locator('.interaction-space .prop-shelf')).toHaveCount(0);
  await expect(page.locator('.feedback-audio-state')).toHaveCount(0);
  await expect(page.locator('.scene-prop.is-correct-response')).toHaveCount(0);

  await page.evaluate(() => {
    window.__r2StableWordWorld = document.querySelector('.station-world');
    window.__r2StableWordConsole = document.querySelector('.mission-console');
  });
  await page.locator('.shared-listen-replay__button').click();
  expect(await page.evaluate(() => (
    window.__r2StableWordWorld === document.querySelector('.station-world')
    && window.__r2StableWordConsole === document.querySelector('.mission-console')
  ))).toBe(true);
  await finishOneAudio(page);

  snapshot = await runtimeSnapshot(page);
  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
  await expect(page.locator('.feedback-audio-state, .feedback-bubble[data-tone="correct"]'))
    .toHaveCount(0);
  await expect(page.locator('.inline-language-replay')).toBeVisible();
  await expect(page.locator('.scene-props > .scene-prop')).toHaveCount(4);
  const correctEntity = page.locator('.scene-prop.is-correct-response');
  await expect(correctEntity).toHaveCount(1);
  await expect(correctEntity).toHaveAttribute('data-entity-id', 'pen');
  expect(await correctEntity.evaluate(element => getComputedStyle(element).animationName))
    .toContain('r2-correct-settle');
  await expect(page.locator('.adventure-heart-gauge')).toBeVisible();
  await expect(page.locator('.adventure-heart.is-full')).toHaveCount(3);
});

test('QA-MUST-01 flicker regression: same-stage actions never remount the story stage', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L02-M11');

  await page.evaluate(() => {
    window.__flickerGuardWorld = document.querySelector('.station-world');
    window.__flickerGuardFrame = document.querySelector('.scene-frame');
    window.__flickerGuardFrameImage = document.querySelector('.scene-frame img');
    window.__flickerGuardConsole = document.querySelector('.mission-console');
    window.__flickerGuardEntities = [...document.querySelectorAll(
      '.scene-character[data-entity-id], .scene-prop[data-entity-id]'
    )].map(element => ({
      entityId: element.dataset.entityId,
      element,
      picture: element.querySelector('picture'),
      image: element.querySelector('img')
    }));
  });
  const stableStage = () => page.evaluate(() => ({
    world: window.__flickerGuardWorld === document.querySelector('.station-world'),
    frame: window.__flickerGuardFrame === document.querySelector('.scene-frame')
      && window.__flickerGuardFrameImage === document.querySelector('.scene-frame img'),
    console: window.__flickerGuardConsole === document.querySelector('.mission-console'),
    entities: window.__flickerGuardEntities.every(({ entityId, element, picture, image }) => {
      const current = document.querySelector(`[data-entity-id="${entityId}"]`);
      return element === current
        && picture === current?.querySelector('picture')
        && image === current?.querySelector('img');
    })
  }));
  const visibleStage = () => page.evaluate(() => {
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0
        && box.width > 0
        && box.height > 0;
    };
    const consoleElement = document.querySelector('.mission-console');
    const characters = [...document.querySelectorAll('.scene-character[data-entity-id]')];
    const content = [...(consoleElement?.querySelectorAll('*') || [])].filter(element => (
      element.textContent?.trim()
      && !element.closest('.adventure-heart-gauge, .heart-row')
    ));
    return {
      world: visible(document.querySelector('.station-world')),
      frame: visible(document.querySelector('.scene-frame')),
      console: visible(consoleElement),
      visibleCharacters: characters.filter(visible).length,
      visibleContent: content.filter(visible).length
    };
  });
  const expectedVisibleCharacters = (await visibleStage()).visibleCharacters;

  await page.locator('.shared-listen-replay__button').click();
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });

  await finishOneAudio(page);
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });

  snapshot = await runtimeSnapshot(page);
  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge);
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });

  await finishOneAudio(page);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase))
    .toBe('awaiting-response');
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });

  snapshot = await runtimeSnapshot(page);
  const nextChallenge = activeContract(snapshot).challenge;
  await submitRule(page, nextChallenge.answerRule, nextChallenge, { correct: false });
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });

  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#course-settings-panel')).toBeVisible();
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });
  await page.locator('[data-action="toggle-settings"]').click();
  await expect(page.locator('#course-settings-panel')).toHaveCount(0);
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });

  await page.locator('[data-action="toggle-stages"]').click();
  await expect(page.locator('#course-stage-map')).toBeVisible();
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });
  await page.locator('[data-action="close-stages"]').click();
  await expect(page.locator('#course-stage-map')).toHaveCount(0);
  expect(await stableStage()).toEqual({ world: true, frame: true, console: true, entities: true });

  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 844, height: 390 }
  ]) {
    await page.setViewportSize(viewport);
    await expect.poll(() => page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }))).toEqual(viewport);
    await page.evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
    expect(await stableStage(), JSON.stringify(viewport)).toEqual({
      world: true,
      frame: true,
      console: true,
      entities: true
    });
    expect(await visibleStage(), JSON.stringify(viewport)).toMatchObject({
      world: true,
      frame: true,
      console: true,
      visibleCharacters: expectedVisibleCharacters
    });
    expect((await visibleStage()).visibleContent).toBeGreaterThan(0);
    await page.locator('[data-action="toggle-stages"]').click();
    await expect(page.locator('#course-stage-map')).toBeVisible();
    expect(await stableStage(), JSON.stringify(viewport)).toEqual({
      world: true,
      frame: true,
      console: true,
      entities: true
    });
    expect(await visibleStage(), JSON.stringify(viewport)).toMatchObject({
      world: true,
      frame: true,
      console: true,
      visibleCharacters: expectedVisibleCharacters
    });
    expect((await visibleStage()).visibleContent).toBeGreaterThan(0);
    await page.locator('[data-action="close-stages"]').click();
    await expect(page.locator('#course-stage-map')).toHaveCount(0);
    expect(await stableStage(), JSON.stringify(viewport)).toEqual({
      world: true,
      frame: true,
      console: true,
      entities: true
    });
    expect(await visibleStage(), JSON.stringify(viewport)).toMatchObject({
      world: true,
      frame: true,
      console: true,
      visibleCharacters: expectedVisibleCharacters
    });
    expect((await visibleStage()).visibleContent).toBeGreaterThan(0);
  }
});

test('QA-MUST-01 flicker regression: stage replay enters and returns without an empty frame', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  await completeCurrentMicrotask(page);
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M08');
  await page.locator('.scene-frame img').evaluate(async image => {
    if (!image.complete) {
      await new Promise((resolve, reject) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', reject, { once: true });
      });
    }
    await image.decode?.();
  });

  await page.evaluate(() => {
    window.__atomicFrameGuard = {
      active: true,
      samples: 0,
      failures: []
    };
    const sample = () => {
      const guard = window.__atomicFrameGuard;
      if (!guard?.active) return;
      const worlds = document.querySelectorAll('.station-world');
      const frames = document.querySelectorAll('.scene-frame');
      const consoles = document.querySelectorAll('.mission-console');
      const characters = [...document.querySelectorAll('.scene-character[data-entity-id]')];
      const world = worlds[0];
      const frame = frames[0];
      const consoleElement = consoles[0];
      const image = frame?.querySelector('img');
      const worldBox = world?.getBoundingClientRect();
      const frameBox = frame?.getBoundingClientRect();
      const consoleBox = consoleElement?.getBoundingClientRect();
      const frameStyle = frame ? getComputedStyle(frame) : null;
      const consoleStyle = consoleElement ? getComputedStyle(consoleElement) : null;
      const visible = element => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number(style.opacity) > 0
          && box.width > 0
          && box.height > 0;
      };
      const visibleCharacters = characters.filter(visible);
      const visibleContent = [...(consoleElement?.querySelectorAll('*') || [])].filter(element => (
        element.textContent?.trim()
        && !element.closest('.adventure-heart-gauge, .heart-row')
        && visible(element)
      ));
      guard.samples += 1;
      if (
        worlds.length !== 1
        || frames.length !== 1
        || consoles.length !== 1
        || !image
        || !image.complete
        || image.naturalWidth === 0
        || !image.currentSrc
        || !worldBox?.width
        || !worldBox?.height
        || !frameBox?.width
        || !frameBox?.height
        || !consoleBox?.width
        || !consoleBox?.height
        || frameStyle?.display === 'none'
        || frameStyle?.visibility === 'hidden'
        || Number(frameStyle?.opacity) === 0
        || consoleStyle?.display === 'none'
        || consoleStyle?.visibility === 'hidden'
        || Number(consoleStyle?.opacity) === 0
        || visibleCharacters.length !== 2
        || visibleContent.length === 0
        || document.querySelector('[data-experience-startup]')
      ) {
        guard.failures.push({
          sample: guard.samples,
          worldCount: worlds.length,
          frameCount: frames.length,
          consoleCount: consoles.length,
          imageComplete: Boolean(image?.complete),
          imageNaturalWidth: image?.naturalWidth || 0,
          imageSource: image?.currentSrc || '',
          worldSize: [worldBox?.width || 0, worldBox?.height || 0],
          frameSize: [frameBox?.width || 0, frameBox?.height || 0],
          consoleSize: [consoleBox?.width || 0, consoleBox?.height || 0],
          frameVisibility: [frameStyle?.display || '', frameStyle?.visibility || '', frameStyle?.opacity || ''],
          consoleVisibility: [consoleStyle?.display || '', consoleStyle?.visibility || '', consoleStyle?.opacity || ''],
          characterCounts: [characters.length, visibleCharacters.length],
          visibleContentCount: visibleContent.length,
          hasStartupFallback: Boolean(document.querySelector('[data-experience-startup]'))
        });
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });

  await page.locator('[data-action="toggle-stages"]').click();
  await page.locator('[data-action="preview-jump"][data-value="L01-M07"]').click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'true');
  await page.locator('.station-header [data-action="preview-exit"]').click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'false');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M08');
  await page.evaluate(() => new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));

  const report = await page.evaluate(() => {
    window.__atomicFrameGuard.active = false;
    return {
      samples: window.__atomicFrameGuard.samples,
      failures: window.__atomicFrameGuard.failures
    };
  });
  expect(report.samples).toBeGreaterThan(0);
  expect(report.failures).toEqual([]);
});

test('QA-MUST-01 flicker regression: L01-M07 does not replay console-rise inside one microtask', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  expect(await runtimeSnapshot(page)).toMatchObject({
    microtaskId: 'L01-M07'
  });
  await armSameConsoleRiseGuard(page);
  expect(await settlePresentation(page)).toMatchObject({
    microtaskId: 'L01-M07',
    phase: 'audio-playing'
  });

  for (let guard = 0; guard < 10; guard += 1) {
    const before = await runtimeSnapshot(page);
    if (!['audio-playing', 'audio-retry'].includes(before.phase)) break;
    await finishOneAudio(page);
    await expect.poll(() => runtimeSnapshot(page).then(snapshot => snapshot.stateVersion))
      .not.toBe(before.stateVersion);
  }

  expect(await runtimeSnapshot(page)).toMatchObject({
    microtaskId: 'L01-M07',
    currentPresentationMomentId: 'listen-complete',
    presentationAwaitingEnd: true
  });
  expect(await sameConsoleRiseGuardReport(page)).toEqual({
    sameConsole: true,
    sameCharacters: true,
    consoleRiseStarts: [],
    characterEntryStarts: []
  });
  const restingAnimationNames = await page.locator('.mission-console').evaluate(consoleElement => (
    getComputedStyle(consoleElement).animationName.split(',').map(name => name.trim())
  ));
  expect(restingAnimationNames).not.toContain('console-rise');
});

test('QA-MUST-01 flicker regression: L02-M11 wrong then correct never falls back to console-rise', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L02-M11');
  expect(snapshot).toMatchObject({
    microtaskId: 'L02-M11',
    challengeRef: 'L02-M11:C01',
    phase: 'awaiting-response'
  });

  await armSameConsoleRiseGuard(page);
  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge, { correct: false });
  await expect(page.locator('.mission-console')).toHaveClass(/mission-console--support/);
  await page.locator('.mission-console').evaluate(async consoleElement => {
    const supportAnimations = consoleElement.getAnimations().filter(animation => (
      animation.animationName === 'gentle-answer-shake'
    ));
    await Promise.allSettled(supportAnimations.map(animation => animation.finished));
  });

  snapshot = await runtimeSnapshot(page);
  expect(snapshot).toMatchObject({
    microtaskId: 'L02-M11',
    challengeRef: 'L02-M11:C01',
    phase: 'awaiting-response'
  });
  await submitRule(page, challenge.answerRule, challenge);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase))
    .toBe('audio-playing');
  await finishOneAudio(page);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.challengeRef))
    .toBe('L02-M11:C02');
  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase))
    .toBe('awaiting-response');

  expect(await sameConsoleRiseGuardReport(page)).toEqual({
    sameConsole: true,
    sameCharacters: true,
    consoleRiseStarts: [],
    characterEntryStarts: []
  });
  const restingAnimationNames = await page.locator('.mission-console').evaluate(consoleElement => (
    getComputedStyle(consoleElement).animationName.split(',').map(name => name.trim())
  ));
  expect(restingAnimationNames).not.toContain('console-rise');
});

test('QA-MUST-01 flicker regression: L01-M08 keeps character entity nodes when interaction eligibility changes', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page, { reducedMotion: 'no-preference' });
  await startOrResume(page);
  const snapshot = await advanceTo(page, 'L01-M08');
  expect(snapshot).toMatchObject({
    microtaskId: 'L01-M08',
    challengeRef: 'L01-M08:C01',
    phase: 'awaiting-response'
  });

  const characterEntityIds = ['station-keeper', 'handbag-owner'];
  await page.evaluate(entityIds => {
    window.__stableEligibilityEntities = entityIds.map(entityId => ({
      entityId,
      element: document.querySelector(`.scene-character[data-entity-id="${entityId}"]`)
    }));
  }, characterEntityIds);
  await expect(page.locator('.scene-character[data-entity-id]')).toHaveCount(2);
  const activeCharacters = page.locator('.scene-character[data-action="select-entity"]');
  await expect(activeCharacters).toHaveCount(2);
  expect(await activeCharacters.evaluateAll(elements => elements.every(element => (
    !element.disabled && getComputedStyle(element).pointerEvents === 'auto'
  )))).toBe(true);

  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.challengeRef))
    .toBe('L01-M08:C02');

  const identityReport = await page.evaluate(() => (
    window.__stableEligibilityEntities.map(({ entityId, element }) => {
      const current = document.querySelector(`.scene-character[data-entity-id="${entityId}"]`);
      return {
        entityId,
        presentBefore: Boolean(element),
        presentAfter: Boolean(current),
        sameNode: element === current
      };
    })
  ));
  expect(identityReport).toEqual(characterEntityIds.map(entityId => ({
    entityId,
    presentBefore: true,
    presentAfter: true,
    sameNode: true
  })));
  expect(await page.locator('.scene-character[data-entity-id]').evaluateAll(elements => (
    elements.every(element => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) > 0
        && box.width > 0
        && box.height > 0;
    })
  ))).toBe(true);
  const inactiveCharacterReport = await page.locator('.scene-character[data-entity-id]')
    .evaluateAll(elements => elements.map(element => ({
      disabled: element.disabled,
      action: element.dataset.action || null,
      ariaHidden: element.getAttribute('aria-hidden'),
      pointerEvents: getComputedStyle(element).pointerEvents
    })));
  expect(inactiveCharacterReport).toEqual(characterEntityIds.map(() => ({
    disabled: true,
    action: null,
    ariaHidden: 'true',
    pointerEvents: 'none'
  })));
});

test('I01 gives every actionable stage-two person stable hover, focus, and press feedback', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page);
  await startOrResume(page);
  const snapshot = await advanceTo(page, 'L01-M08');
  expect(snapshot).toMatchObject({
    microtaskId: 'L01-M08',
    challengeRef: 'L01-M08:C01',
    phase: 'awaiting-response'
  });

  const candidates = page.locator('button.scene-character[data-action="select-entity"]');
  await expect(candidates).toHaveCount(2);

  const styleOf = locator => locator.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      filter: style.filter,
      transform: style.transform,
      touchAction: style.touchAction
    };
  });

  for (const entityId of ['station-keeper', 'handbag-owner']) {
    const candidate = page.locator(`button.scene-character[data-entity-id="${entityId}"]`);
    const resting = await styleOf(candidate);

    await candidate.hover();
    const hovered = await styleOf(candidate);
    expect(hovered.filter, `${entityId} hover should light the visible cutout`)
      .not.toBe(resting.filter);
    expect(hovered.transform, `${entityId} hover should lift the candidate`)
      .not.toBe(resting.transform);

    await page.mouse.move(720, 40);
    await candidate.focus();
    const focused = await styleOf(candidate);
    expect(focused.filter, `${entityId} keyboard focus should light the visible cutout`)
      .not.toBe(resting.filter);
    expect(focused.transform, `${entityId} keyboard focus should lift the candidate`)
      .not.toBe(resting.transform);
    expect(focused.touchAction, `${entityId} must accept a direct touch press`)
      .toBe('manipulation');

    const box = await candidate.boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const pressed = await styleOf(candidate);
    await page.mouse.move(720, 40);
    await page.mouse.up();
    expect(pressed.filter, `${entityId} press should keep visible pointing feedback`)
      .not.toBe(resting.filter);
    expect(pressed.transform, `${entityId} press should keep a tactile lift`)
      .not.toBe(resting.transform);
  }

  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.challengeRef))
    .toBe('L01-M08:C02');
  const lockedPeople = page.locator('button.scene-character[data-entity-id]');
  await expect(lockedPeople).toHaveCount(2);
  expect(await lockedPeople.evaluateAll(elements => elements.every(element => (
    element.disabled
      && !element.dataset.action
      && getComputedStyle(element).pointerEvents === 'none'
  )))).toBe(true);
});

test('I01 keeps both stage-two people independently hittable on a phone', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);
  await startOrResume(page);
  await advanceTo(page, 'L01-M08');

  const hitReport = await page.locator(
    'button.scene-character[data-action="select-entity"]'
  ).evaluateAll(elements => elements.map(element => {
    const bounds = element.getBoundingClientRect();
    const hitOwner = document.elementFromPoint(
      bounds.left + bounds.width / 2,
      Math.min(innerHeight - 20, bounds.top + 100)
    )?.closest?.('button.scene-character');
    return {
      entityId: element.dataset.entityId,
      left: bounds.left,
      right: bounds.right,
      hitOwner: hitOwner?.dataset.entityId || null
    };
  }));

  expect(hitReport.map(item => item.entityId)).toEqual(['station-keeper', 'handbag-owner']);
  expect(hitReport[0].right).toBeLessThanOrEqual(hitReport[1].left + 1);
  expect(hitReport.map(item => item.hitOwner)).toEqual([
    'station-keeper',
    'handbag-owner'
  ]);
});

test('I02 renders the neutral stage-two contract without hiding the legitimate English evidence', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page);
  await startOrResume(page);
  const snapshot = await advanceTo(page, 'L01-M08');
  expect(snapshot).toMatchObject({
    microtaskId: 'L01-M08',
    challengeRef: 'L01-M08:C01',
    phase: 'awaiting-response'
  });

  await expect(page.locator('.station-brand strong')).toHaveText('柜台边的新线索');
  await expect(page.locator('.action-stage__hint')).toHaveCount(0);
  await expect(page.locator(
    '[data-copy-purpose="task"][data-copy-priority="primary"]:visible'
  )).toHaveText('Whose handbag is it?');
  await expect(page.locator('.scene-character[data-entity-id="station-keeper"] .scene-character__name'))
    .toHaveText('招领员');
  await expect(page.locator('.scene-character[data-entity-id="handbag-owner"] .scene-character__name'))
    .toHaveText('女顾客');
  await expect(page.getByText('Whose handbag is it?', { exact: true })).toBeVisible();
  await expect(page.locator('.station-world')).toHaveAttribute(
    'data-answer-evidence-channel',
    'meaning'
  );
  await expect(page.locator('.station-world')).toHaveAttribute(
    'data-intentional-support-refs',
    'L01-Q01'
  );

  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge);
  await expect.poll(() => runtimeSnapshot(page).then(current => current.challengeRef))
    .toBe('L01-M08:C02');
  await expect(page.locator('.station-brand strong')).toHaveText('柜台边的新线索');
  await expect(page.locator('.stage-prompt, .mission-prompt').filter({
    hasText: '听一听，点中声音说的物品。'
  })).toHaveCount(1);
  await expect(page.locator('.station-world')).toHaveAttribute(
    'data-answer-evidence-channel',
    'audio-form-supported'
  );
  await expect(page.locator('.station-world')).toHaveAttribute(
    'data-intentional-support-refs',
    'L01-W07'
  );
});

test('R2 word-form checks pronounce the answer in place instead of opening a feedback page', async ({ page }) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFresh(page);
  await startOrResume(page);
  let snapshot = await advanceTo(page, 'L02-M13');

  await expect(page.locator('.word-plaque')).toHaveText('pen');
  await expect(page.locator('.shared-listen-replay__button')).toBeVisible();
  await expect(page.locator('.scene-props > button.scene-prop')).toHaveCount(4);
  const challenge = activeContract(snapshot).challenge;
  await submitRule(page, challenge.answerRule, challenge);

  await expect.poll(() => runtimeSnapshot(page).then(current => current.phase)).toBe('audio-playing');
  await expect(page.locator('.feedback-audio-state, .feedback-bubble[data-tone="correct"]'))
    .toHaveCount(0);
  await expect(page.locator('.word-plaque')).toHaveText('pen');
  await expect(page.locator('.scene-props > .scene-prop')).toHaveCount(4);
  await expect(page.locator('.adventure-heart.is-full')).toHaveCount(3);
  await finishOneAudio(page);
  await expect(page.locator('.word-plaque')).toHaveText('pencil');
  await expect(page.locator('.scene-props > button.scene-prop')).toHaveCount(4);
});
