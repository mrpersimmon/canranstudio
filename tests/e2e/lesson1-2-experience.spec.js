'use strict';

const { test, expect } = require('@playwright/test');
const catalog = require('../../core/curriculum-catalog');

const EXPERIENCE_PATH = '/poc/lesson1-2-experience/';
const STORAGE_KEY = 'poc:lesson1-2-experience:v1';
const MUSIC_KEY = `${STORAGE_KEY}:music-muted`;
const unit = catalog.getTeachingUnit('NCE-U01');
const tasks = unit.beats.flatMap(beat => beat.microtasks || []);

async function openFresh(page) {
  await page.goto(EXPERIENCE_PATH);
  await page.evaluate(({ progress, music }) => {
    localStorage.removeItem(progress);
    localStorage.removeItem(music);
  }, { progress: STORAGE_KEY, music: MUSIC_KEY });
  return page.reload();
}

async function installInstantAudio(page, { failVoice = false } = {}) {
  await page.addInitScript(({ shouldFailVoice, ambienceSuffix }) => {
    class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.preload = '';
        this.loop = false;
        this.volume = 1;
      }
      pause() {}
      play() {
        const isAmbience = String(this.src).endsWith(ambienceSuffix);
        queueMicrotask(() => this.dispatchEvent(new Event(
          shouldFailVoice && !isAmbience ? 'error' : 'ended'
        )));
        return Promise.resolve();
      }
    }
    Object.defineProperty(window, 'Audio', { configurable: true, value: FakeAudio });
  }, { shouldFailVoice: failVoice, ambienceSuffix: 'starlight-station-ambience.mp3' });
}

async function installManualAudio(page) {
  await page.addInitScript(ambienceSuffix => {
    class ManualAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.preload = '';
        this.loop = false;
        this.volume = 1;
      }
      pause() {}
      play() {
        const isCourseAudio = !String(this.src).endsWith(ambienceSuffix);
        if (isCourseAudio) window.__pendingCourseAudio = this;
        return Promise.resolve();
      }
    }
    window.__finishCourseAudio = () => {
      const pending = window.__pendingCourseAudio;
      window.__pendingCourseAudio = null;
      if (!pending) return null;
      pending.dispatchEvent(new Event('ended'));
      return pending.src;
    };
    Object.defineProperty(window, 'Audio', { configurable: true, value: ManualAudio });
  }, 'starlight-station-ambience.mp3');
}

function app(page) {
  return page.locator('.station-app');
}

async function clickValue(page, action, value) {
  await page.locator(`button[data-action="${action}"][data-value="${value}"]`).click();
}

async function settle(page) {
  await page.waitForTimeout(12);
}

test('the whole child UI completes twelve catalog tasks and grows only at the final boundary', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.stack || error.message));
  await installManualAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await openFresh(page);
  expect(response.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('[data-action="start"]')).toBeVisible();
  await page.locator('[data-action="start"]').click();

  const selectedCaseByTask = {};
  for (let guard = 0; guard < 320; guard += 1) {
    const status = await app(page).getAttribute('data-runtime-status');
    if (status === 'unit-built') break;
    if (status === 'chapter-stop') {
      const saved = JSON.parse(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY));
      expect(saved.value.units['NCE-U01'].buildStage).toBe(0);
      expect(saved.value.units['NCE-U01'].completedMicrotaskIds).toHaveLength(5);
      await page.locator('[data-action="chapter-continue"]').click();
      continue;
    }

    const phase = await app(page).getAttribute('data-runtime-phase');
    if (phase === 'audio-ready') {
      await page.locator('[data-action="audio-play"]').click();
      await settle(page);
      continue;
    }
    if (phase === 'audio-playing') {
      const finished = await page.evaluate(() => window.__finishCourseAudio());
      expect(finished).not.toBeNull();
      await settle(page);
      continue;
    }
    expect(phase).toBe('response');
    const microtaskId = await app(page).getAttribute('data-runtime-microtask');
    const stepId = await app(page).getAttribute('data-runtime-step');
    const task = tasks.find(candidate => candidate.microtaskId === microtaskId);
    const step = task.steps.find(candidate => candidate.stepId === stepId);
    const rule = step.answerRule;

    if (step.kind === 'explore-batch') {
      const selected = page.locator('button[data-action="explore"].is-selected');
      await selected.click();
      await settle(page);
      continue;
    }
    if (rule.type === 'match-entity') {
      const challengeRef = await app(page).getAttribute('data-runtime-challenge');
      await clickValue(page, 'select-entity', rule.pairs[challengeRef]);
      await page.locator('[data-action="response-submit"]').click();
      await settle(page);
      continue;
    }
    if (rule.type === 'select-one') {
      if (rule.acceptedSourceRef) await clickValue(page, 'select-source', rule.acceptedSourceRef);
      if (rule.acceptedEntityIds) {
        const selected = rule.acceptedEntityIds[0];
        selectedCaseByTask[microtaskId] = selected;
        await clickValue(page, 'select-entity', selected);
      }
    }
    if (rule.type === 'place-in-slot') await clickValue(page, 'select-entity', rule.entityId);
    if (rule.type === 'perform-action') {
      const entityId = rule.entityFactId ? selectedCaseByTask[microtaskId] : rule.entityId;
      await clickValue(page, 'select-entity', entityId);
      await clickValue(page, 'select-target', rule.targetEntityId);
    }
    if (rule.type === 'ordered-blocks') {
      const selected = selectedCaseByTask[microtaskId];
      for (const refId of rule.acceptedByEntityId[selected]) await clickValue(page, 'add-block', refId);
    }
    if (rule.type === 'all-of') {
      for (const factId of rule.requiredFactIds) await clickValue(page, 'toggle-fact', factId);
    }
    await page.locator('[data-action="response-submit"]').click();
    await settle(page);
  }

  await expect(app(page)).toHaveAttribute('data-runtime-status', 'unit-built');
  await expect(app(page)).toHaveAttribute('data-build-stage', '5');
  const stored = JSON.parse(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY));
  const projection = stored.value.units['NCE-U01'];
  expect(projection.completedMicrotaskIds).toHaveLength(12);
  expect(projection.buildStage).toBe(5);
  expect(Object.keys(stored.value.targets['NCE-U01-T01'].variantCells)).toHaveLength(22);
  expect(stored.value.districts['first-book-1-12'].challengeStars).toBe(0);
  expect(pageErrors).toEqual([]);
});

test('real ended callbacks gate progress and the next microtask is restored after reload', async ({ page }) => {
  await installManualAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="audio-play"]').click();

  for (let segment = 0; segment < 6; segment += 1) {
    await page.evaluate(() => window.__finishCourseAudio());
    await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S01');
  }
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  await page.evaluate(() => window.__finishCourseAudio());
  await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S02');

  await clickValue(page, 'select-entity', 'handbag');
  await clickValue(page, 'select-target', 'handbag-owner');
  await page.locator('[data-action="response-submit"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await page.evaluate(() => window.__finishCourseAudio());
  await clickValue(page, 'select-entity', 'handbag');
  await page.locator('[data-action="response-submit"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await page.evaluate(() => window.__finishCourseAudio());
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M02');

  const stored = JSON.parse(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY));
  expect(stored.value.units['NCE-U01'].checkpoint.microtaskId).toBe('L01-M01');
  expect(stored.value.units['NCE-U01'].buildStage).toBe(0);
  await page.reload();
  await page.locator('[data-action="start"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M02');
});

test('audio failure requires an explicit visual fallback and never advances on elapsed time', async ({ page }) => {
  await installInstantAudio(page, { failVoice: true });
  await openFresh(page);
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-phase', 'audio-fallback');
  await page.waitForTimeout(80);
  await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S01');
  await page.locator('[data-action="audio-continue"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S02');
});

test('one-tap background music mute persists independently of course progress', async ({ page }) => {
  await installInstantAudio(page);
  await openFresh(page);
  const music = page.locator('[data-action="toggle-music"]');
  await expect(music).toHaveAttribute('aria-pressed', 'false');
  await music.click();
  await expect(music).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(key => localStorage.getItem(key), MUSIC_KEY)).toBe('true');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  await page.reload();
  await expect(page.locator('[data-action="toggle-music"]')).toHaveAttribute('aria-pressed', 'true');
});
