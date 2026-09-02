'use strict';

const { test, expect } = require('@playwright/test');
const catalog = require('../../core/curriculum-catalog');
const { open } = require('../../core/learning-ledger');

const REVIEW_PATH = '/poc/lesson1-2-review/';
const unit = catalog.getTeachingUnit('NCE-U01');
const STORAGE_KEY = `poc:learning-experience:${unit.unitId}:${unit.experienceRevision}`;
const reviewCopy = unit.experience.reviewRun.copy;

function microtask(microtaskId) {
  return unit.beats.flatMap(beat => beat.microtasks || [])
    .find(task => task.microtaskId === microtaskId);
}

function audioRefs(task) {
  const refs = new Set();
  const collect = sequence => {
    for (const segment of sequence?.segments || []) {
      if (segment.sourceRef) refs.add(segment.sourceRef);
    }
  };
  for (const step of task.steps || []) {
    collect(step.audioSequence);
    for (const challenge of step.challenges || []) {
      collect(challenge.audioSequence);
      collect(challenge.feedbackAudioSequence);
    }
  }
  return [...refs];
}

function seededLedgerRecord(microtaskIds = ['L02-M11']) {
  let record = null;
  const store = {
    load() {
      return record
        ? { status: 'ok', revision: record.revision, value: structuredClone(record.value) }
        : { status: 'ok', revision: 0, value: null };
    },
    commit(key, { expectedRevision, value }) {
      record = { revision: expectedRevision + 1, value: structuredClone(value) };
      return {
        status: 'committed', persisted: true, revision: record.revision,
        value: structuredClone(record.value)
      };
    }
  };
  const ledger = open({
    store,
    key: STORAGE_KEY,
    catalog,
    clock: { learningDay: () => '2026-08-10' }
  });
  for (const microtaskId of microtaskIds) {
    const task = microtask(microtaskId);
    const beat = unit.beats.find(candidate => candidate.microtasks.includes(task));
    const completedAudioRefs = audioRefs(task);
    const applied = ledger.apply({
      eventId: `e2e-seed:${microtaskId}`,
      type: 'microtask-completed',
      unitId: unit.unitId,
      experienceRevision: unit.experienceRevision,
      beatId: beat.beatId,
      microtaskId,
      checkpointId: task.checkpointAfterSuccess.checkpointId,
      completionStatus: 'completed-independent',
      targetResults: task.targetResults.map(result => ({
        ...structuredClone(result),
        outcome: 'independent',
        supportLevel: 'none',
        rescueUsed: false,
        heartsRemaining: 3,
        adventureHeartsRemaining: 3
      })),
      sourceContacts: task.exposureRefs.map(sourceRef => ({
        sourceRef,
        contactModes: completedAudioRefs.includes(sourceRef)
          ? ['experienced', 'audio-ended']
          : ['experienced']
      })),
      audioContactRefs: completedAudioRefs,
      missingAudioRefs: [],
      storyFacts: [...(task.persistence?.checkpointFacts || [])],
      adventureHeartsRemaining: 3
    });
    if (applied.status !== 'applied') throw new Error(applied.reason);
  }
  return record;
}

async function installHarness(page, record) {
  await page.addInitScript(({ key, seed }) => {
    if (seed) {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(seed));
    } else localStorage.removeItem(key);
    window.__reviewAudio = [];
    class ControlledAudio {
      constructor(src) {
        this.src = String(src || '');
        this.preload = '';
        this.paused = false;
        this.finished = false;
        this.onended = null;
        this.onerror = null;
      }
      play() {
        this.paused = false;
        window.__reviewAudio.push(this);
        if (window.__reviewAudioPlayRejection) {
          const error = new Error('controlled playback rejection');
          error.name = window.__reviewAudioPlayRejection;
          window.__reviewAudioPlayRejection = null;
          return Promise.reject(error);
        }
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
      finish() {
        if (this.finished || this.paused) return false;
        this.finished = true;
        if (typeof this.onended === 'function') this.onended(new Event('ended'));
        return true;
      }
      fail() {
        if (this.finished || this.paused) return false;
        this.finished = true;
        if (typeof this.onerror === 'function') this.onerror(new Event('error'));
        return true;
      }
    }
    Object.defineProperty(window, 'Audio', { configurable: true, value: ControlledAudio });
    window.__finishReviewAudio = () => {
      const current = window.__reviewAudio.find(audio => !audio.finished && !audio.paused);
      return current ? current.finish() : false;
    };
    window.__failReviewAudio = () => {
      const current = window.__reviewAudio.find(audio => !audio.finished && !audio.paused);
      return current ? current.fail() : false;
    };
    window.__pendingReviewAudio = () => (
      window.__reviewAudio.filter(audio => !audio.finished && !audio.paused).length
    );
  }, { key: STORAGE_KEY, seed: record });
}

async function openReview(page, record) {
  await installHarness(page, record);
  await page.goto(REVIEW_PATH);
  await expect.poll(() => page.evaluate(() => Boolean(window.__lessonReview))).toBe(true);
}

async function snapshot(page) {
  return page.evaluate(() => window.__lessonReview.runtime.snapshot());
}

async function startReview(page) {
  await page.locator('[data-action="start-review"]').click();
  await expect(page.locator('.review-app')).toHaveAttribute('data-review-status', 'active');
}

async function playAndFinishPrompt(page) {
  await page.locator('[data-action="audio-play"]').click();
  await expect.poll(() => page.evaluate(() => window.__pendingReviewAudio())).toBe(1);
  const state = await snapshot(page);
  await expect(page.locator('[data-visible-english]')).toHaveText(state.audio.visibleText);
  expect(await page.evaluate(() => window.__finishReviewAudio())).toBe(true);
  await expect.poll(async () => (await snapshot(page)).phase).toBe('awaiting-response');
}

async function chooseEntity(page, entityId) {
  await page.locator(`[data-review-option][data-option-id="${entityId}"]`).click();
}

test('an unlearned unit shows the catalog empty state and no review entry', async ({ page }) => {
  await openReview(page, null);

  await expect(page.locator('[data-review-empty]')).toBeVisible();
  await expect(page.locator('[data-review-empty]')).toContainText(reviewCopy.emptyTitle);
  await expect(page.locator('[data-review-empty]')).toContainText(reviewCopy.emptyBody);
  await expect(page.locator('[data-review-entry]')).toHaveCount(0);
  await expect(page.locator('[data-action="start-review"]')).toHaveCount(0);
});

test('a due two-cell visit uses a changed catalog context, visible English, and isolated hearts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openReview(page, seededLedgerRecord());

  await expect(page.locator('[data-review-entry]')).toContainText(`2 ${reviewCopy.itemCountSuffix}`);
  await startReview(page);
  let state = await snapshot(page);
  expect(state.cellCount).toBe(2);
  expect(state.estimatedSeconds).toBeGreaterThanOrEqual(45);
  expect(state.estimatedSeconds).toBeLessThanOrEqual(90);
  await expect(page.locator('.review-timing')).toHaveCount(0);
  await expect(page.locator('.review-target, .review-audio__english')).toHaveCount(1);
  await expect(page.locator(
    '[data-copy-purpose="task"][data-copy-priority="primary"]:visible'
  )).toHaveCount(1);
  await expect(page.locator('[data-review-context]')).toHaveAttribute(
    'data-review-context-cell',
    state.currentCell.reviewContextId
  );
  const reviewContext = unit.reviewContexts[state.currentCell.reviewContextId];
  await expect(page.locator('[data-review-context]')).toHaveAttribute(
    'style',
    new RegExp(reviewContext.backdropAssetSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );
  await expect(page.locator('[data-review-context]')).not.toHaveAttribute('data-change-type', /.+/);
  await expect(page.locator('.review-cat')).toHaveCount(0);
  await expect(page.locator('.review-heart.is-full')).toHaveCount(3);

  await playAndFinishPrompt(page);
  state = await snapshot(page);
  await expect(page.locator('.review-target, .review-audio__english')).toHaveCount(1);
  const challenge = microtask('L02-M11').steps[0].challenges.find(candidate => (
    candidate.challengeRef === state.currentCell.authoredChallengeRef
  ));
  const wrongEntity = challenge.candidateEntityIds.find(candidate => (
    candidate !== challenge.answerRule.acceptedEntityId
  ));
  await chooseEntity(page, wrongEntity);
  await expect(page.locator('.review-cat')).toBeVisible();
  await expect(page.locator('.review-heart.is-full')).toHaveCount(2);
  await expect(page.locator('[data-review-feedback]')).toBeVisible();
  await expect.poll(async () => (await snapshot(page)).phase, { timeout: 3000 }).toBe('awaiting-response');

  await chooseEntity(page, challenge.answerRule.acceptedEntityId);
  await expect.poll(async () => (await snapshot(page)).currentIndex).toBe(1);
  await expect(page.locator('.review-heart.is-full')).toHaveCount(3);
  expect(await page.locator('.review-feedback').count()).toBe(0);
  const geometry = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: innerWidth
  }));
  expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
});

test('English SourceRef choices use the catalog expression instruction', async ({ page }) => {
  await openReview(page, seededLedgerRecord(['L01-M09', 'L01-M10']));
  await startReview(page);

  const state = await snapshot(page);
  const challenge = microtask('L01-M09').steps.flatMap(step => step.challenges || [])
    .find(candidate => candidate.challengeRef === state.currentCell.authoredChallengeRef);
  expect(challenge.candidateSourceRefs.length).toBeGreaterThan(0);
  await expect(page.locator('.review-instruction')).toHaveText(
    unit.experience.uiCopy.interaction.selectExpression
  );
  await expect(page.locator('[data-answer-kind="source"] [data-review-option]')).toHaveCount(
    challenge.candidateSourceRefs.length
  );
});

test('refresh resumes the same review run and stable candidate order', async ({ page }) => {
  await openReview(page, seededLedgerRecord());
  await startReview(page);
  const before = await snapshot(page);

  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(window.__lessonReview))).toBe(true);
  await startReview(page);
  const after = await snapshot(page);

  expect(after.reviewRunId).toBe(before.reviewRunId);
  expect(after.attemptRevision).toBe(before.attemptRevision);
  expect(after.currentCell.candidateShuffleSeed).toBe(before.currentCell.candidateShuffleSeed);
  expect(after.currentCell.candidateEntityIds).toEqual(before.currentCell.candidateEntityIds);
});

test('the review planner caps a four-cell visit at ninety seconds', async ({ page }) => {
  await openReview(page, seededLedgerRecord(['L02-M11', 'L02-M12']));

  await expect(page.locator('[data-review-entry]')).toContainText(`4 ${reviewCopy.itemCountSuffix}`);
  await startReview(page);
  const state = await snapshot(page);
  expect(state.cellCount).toBe(4);
  expect(state.estimatedSeconds).toBe(90);
});

test('system audio failure never removes a heart and manual retry stays fail-closed', async ({ page }) => {
  await openReview(page, seededLedgerRecord());
  await startReview(page);
  await page.locator('[data-action="audio-play"]').click();

  for (const delay of [0, 250, 750]) {
    await expect.poll(() => page.evaluate(() => window.__pendingReviewAudio()), {
      timeout: delay + 2000
    }).toBe(1);
    expect(await page.evaluate(() => window.__failReviewAudio())).toBe(true);
  }
  await expect.poll(async () => (await snapshot(page)).phase).toBe('audio-failed');
  await expect(page.locator('.review-heart.is-full')).toHaveCount(3);
  await expect(page.locator('[data-action="audio-retry"]')).toHaveText(reviewCopy.retryAudioLabel);
  await page.locator('[data-action="audio-retry"]').click();
  await expect.poll(async () => (await snapshot(page)).phase).toBe('audio-playing');
  await expect(page.locator('.review-heart.is-full')).toHaveCount(3);
});

test('an aborted playback returns to a neutral replay state without a failure or lost retry', async ({ page }) => {
  await openReview(page, seededLedgerRecord());
  await startReview(page);
  await page.evaluate(() => { window.__reviewAudioPlayRejection = 'AbortError'; });
  await page.locator('[data-action="audio-play"]').click();
  const before = await snapshot(page);

  await expect.poll(async () => (await snapshot(page)).phase).toBe('audio-paused');
  const paused = await snapshot(page);
  expect(paused.audio.retryAttempt).toBe(before.audio.retryAttempt);
  await expect(page.locator('[data-review-audio]')).toHaveAttribute('data-audio-phase', 'audio-paused');
  await expect(page.locator('[data-action="audio-retry"]')).toHaveText(
    unit.experience.uiCopy.languageAudio.playLabel
  );
  await expect(page.locator('.review-heart.is-full')).toHaveCount(3);
  await page.locator('[data-action="audio-retry"]').click();
  await expect.poll(async () => (await snapshot(page)).phase).toBe('audio-playing');
  expect((await snapshot(page)).audio.retryAttempt).toBe(before.audio.retryAttempt);
});

test('three child errors show the cat model and restart the whole visit with three hearts', async ({ page }) => {
  await openReview(page, seededLedgerRecord());
  await startReview(page);
  await playAndFinishPrompt(page);
  const state = await snapshot(page);
  const challenge = microtask('L02-M11').steps[0].challenges.find(candidate => (
    candidate.challengeRef === state.currentCell.authoredChallengeRef
  ));
  const wrongEntity = challenge.candidateEntityIds.find(candidate => (
    candidate !== challenge.answerRule.acceptedEntityId
  ));

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await chooseEntity(page, wrongEntity);
    if (attempt < 2) {
      await expect.poll(async () => (await snapshot(page)).phase, { timeout: 3000 })
        .toBe('awaiting-response');
    }
  }
  await expect(page.locator('[data-review-rescue]')).toContainText(reviewCopy.rescueTitle);
  await expect(page.locator('.review-heart.is-full')).toHaveCount(0);
  await expect.poll(async () => (await snapshot(page)).attemptRevision, { timeout: 3500 }).toBe(1);
  const restarted = await snapshot(page);
  expect(restarted.currentIndex).toBe(0);
  expect(restarted.heartsRemaining).toBe(3);
  expect(restarted.completedReviewCellIds).toEqual([]);
});

test('a child can defer the short visit without changing mainline hearts', async ({ page }) => {
  await openReview(page, seededLedgerRecord());
  await startReview(page);
  await page.locator('[data-action="audio-play"]').click();
  await page.locator('[data-action="defer"]').click();

  await expect(page.locator('[data-review-finished]')).toContainText(reviewCopy.deferredTitle);
  const projection = await page.evaluate(() => window.__lessonReview.ledger.read());
  expect(projection.units[unit.unitId].adventureHeartsRemaining).toBe(3);
  expect(Object.keys(projection.reviewRuns)).toEqual([]);
});

test('two independently recovered cells complete and persist the short visit', async ({ page }) => {
  await openReview(page, seededLedgerRecord());
  await startReview(page);

  for (let index = 0; index < 2; index += 1) {
    await playAndFinishPrompt(page);
    const state = await snapshot(page);
    const challenge = microtask('L02-M11').steps[0].challenges.find(candidate => (
      candidate.challengeRef === state.currentCell.authoredChallengeRef
    ));
    await chooseEntity(page, challenge.answerRule.acceptedEntityId);
  }

  await expect(page.locator('[data-review-finished]')).toContainText(reviewCopy.completedTitle);
  const state = await snapshot(page);
  expect(state.status).toBe('completed');
  const projection = await page.evaluate(() => window.__lessonReview.ledger.read());
  const cells = projection.units[unit.unitId].targets['NCE-U01-T01'].variantCells;
  expect(cells['NCE-U01-T01:L02-W01:audio-form-supported'].lastReviewOutcome)
    .toBe('independent-retrieval');
  expect(cells['NCE-U01-T01:L02-W02:audio-form-supported'].lastReviewOutcome)
    .toBe('independent-retrieval');
});

test('the watch-question review keeps the same five-token editable assembly contract', async ({ page }) => {
  await openReview(page, seededLedgerRecord(['L02-M15']));
  await startReview(page);

  let state = await snapshot(page);
  expect(state.currentCell.authoredChallengeRef).toBe('L02-M15:C02');
  await playAndFinishPrompt(page);
  await chooseEntity(page, 'watch');
  await expect.poll(async () => (await snapshot(page)).currentIndex).toBe(1);

  state = await snapshot(page);
  expect(state.currentCell.authoredChallengeRef).toBe('L02-M15:C01');
  const challenge = microtask('L02-M15').steps[0].challenges[0];
  const accepted = challenge.answerRule.acceptedOrder;
  expect(state.currentCell.candidateContentRefs).toHaveLength(5);
  expect(state.currentCell.candidateContentRefs).not.toEqual(accepted);

  const option = identifier => page.locator(
    `[data-review-option][data-option-id="${identifier}"]`
  );
  const track = page.locator('[data-action="review-remove-block"]');
  const wrongOrder = [accepted[1], accepted[0], ...accepted.slice(2)];
  for (const identifier of wrongOrder) await option(identifier).click();
  await expect(track).toHaveCount(5);
  await expect.poll(async () => (await snapshot(page)).phase).toBe('awaiting-response');
  await expect(page.locator('[data-action="review-reset-blocks"]')).toHaveText(
    unit.experience.uiCopy.interaction.reorderLabel
  );
  await track.first().click();
  await expect(track).toHaveCount(4);
  await page.locator('[data-action="review-reset-blocks"]').click();

  for (const identifier of wrongOrder) await option(identifier).click();
  await expect.poll(async () => (await snapshot(page)).phase).toBe('awaiting-response');
  state = await snapshot(page);
  expect(state.supportLevel).toBe('partial-cue');
  const boundaryValues = await page.locator(
    '.review-answer-area .is-boundary-cue'
  ).evaluateAll(elements => [...new Set(elements.map(element => element.dataset.optionId))].sort());
  expect(boundaryValues).toEqual([accepted[0], accepted.at(-1)].sort());
  await page.locator('[data-action="review-reset-blocks"]').click();

  for (const identifier of accepted) await option(identifier).click();
  await expect.poll(async () => (await snapshot(page)).phase).toBe('audio-playing');
  state = await snapshot(page);
  expect(state.audio).toMatchObject({
    purpose: 'correct-feedback',
    segments: [{ text: 'Is this your watch?' }]
  });
});
