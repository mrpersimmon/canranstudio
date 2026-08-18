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
    window.__courseAudioStarts = [];
    window.__ambientAudioStarts = 0;
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
        if (isCourseAudio) {
          window.__courseAudioStarts.push(String(this.src));
          window.__pendingCourseAudio = this;
        } else {
          window.__ambientAudioStarts += 1;
        }
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

test('the arrival card keeps only the child-facing story and action', async ({ page }) => {
  await openFresh(page);
  const arrival = page.locator('.arrival-card');
  await expect(arrival).toBeVisible();
  await expect(arrival.getByText('不打字 · 不开麦 · 听完再动手')).toHaveCount(0);
  await expect(arrival.getByText(/AI 生成|老师审核/)).toHaveCount(0);
});

test('Lesson 1 opens as a seven-line story listen and follows the active line', async ({ page }) => {
  await installManualAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);
  await page.locator('[data-action="start"]').click();

  const firstStep = tasks.find(task => task.microtaskId === 'L01-M01').steps[0];
  const expectedLines = firstStep.audioSourceRefs.map(refId => unit.lessonContent.lesson1.sources[refId].text);
  await expect(page.getByRole('heading', { name: '门铃响了' })).toBeVisible();
  await expect(page.getByText('客人进门了，听听他们说什么')).toBeVisible();
  await expect(page.getByText('完整听七句')).toHaveCount(0);
  await expect(page.locator('.dialogue-line')).toHaveCount(7);
  expect(await page.locator('.dialogue-line__text').allTextContents()).toEqual(expectedLines);
  const geometry = await page.locator('.mission-console').evaluate(element => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    bottom: element.getBoundingClientRect().bottom,
    viewportHeight: window.innerHeight
  }));
  expect(geometry.scrollHeight).toBeLessThanOrEqual(geometry.clientHeight + 1);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewportHeight);

  await page.locator('[data-action="audio-play"]').click();
  await expect(page.locator('.dialogue-line').nth(0)).toHaveClass(/is-current/);
  await page.evaluate(() => window.__finishCourseAudio());
  await expect(page.locator('.dialogue-line').nth(0)).toHaveClass(/is-heard/);
  await expect(page.locator('.dialogue-line').nth(1)).toHaveClass(/is-current/);
});

test('the guide uses the approved front-facing pose in the first story scene', async ({ page }) => {
  await openFresh(page);
  await page.locator('[data-action="start"]').click();
  const guide = page.locator('.scene-people [data-visual-type="cat"] img');
  await expect(guide).toBeVisible();
  await expect(guide).toHaveAttribute('src', /\/mascot\/loader\/frame-1-route-page-20260806-01-256\.webp$/);
});

test('the polite-attention choice asks the child what to say', async ({ page }) => {
  await openFresh(page);
  await page.locator('[data-action="toggle-settings"]').click();
  await page.getByRole('button', { name: '阶段 2：礼貌问一问' }).click();
  await expect(page.locator('.mission-prompt')).toHaveText('礼貌叫住她，应该怎么说？');
  await expect(page.getByText('礼貌叫住她', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Excuse me!' }).click();
  await expect(page.getByRole('button', { name: '就说这句' })).toBeVisible();
  await expect(page.getByRole('button', { name: '确认这条线索' })).toHaveCount(0);
});

test('a correct word-form choice plays its feedback automatically without another play click', async ({ page }) => {
  await installManualAudio(page);
  await openFresh(page);
  await page.locator('[data-action="toggle-settings"]').click();
  await page.getByRole('button', { name: '阶段 7：标签认领' }).click();
  await page.getByRole('button', { name: '手提包' }).click();
  await page.getByRole('button', { name: '就是它' }).click();

  await expect(app(page)).toHaveAttribute('data-runtime-phase', 'audio-playing');
  await expect(page.getByRole('button', { name: '听一听' })).toHaveCount(0);
  expect(await page.evaluate(() => window.__courseAudioStarts.filter(
    src => src.endsWith('/l01-w07.mp3')
  ).length)).toBe(1);

  await page.evaluate(() => window.__finishCourseAudio());
  await expect(app(page)).toHaveAttribute('data-runtime-phase', 'response');
  await expect(app(page)).toHaveAttribute('data-runtime-challenge', 'L02-W04');
});

test('physical actions use a concrete verb instead of a system-style confirmation', async ({ page }) => {
  await installManualAudio(page);
  await openFresh(page);
  await page.locator('[data-action="toggle-settings"]').click();
  await page.getByRole('button', { name: '阶段 4：换个角色说谢谢' }).click();
  await page.getByRole('button', { name: '听一听' }).click();
  await page.evaluate(() => window.__finishCourseAudio());
  await page.getByRole('button', { name: '星灯探险徽章' }).click();
  await page.getByRole('button', { name: '小探险家' }).click();

  await expect(page.getByRole('button', { name: '接过来' })).toBeVisible();
  await expect(page.getByRole('button', { name: '完成动作' })).toHaveCount(0);
});

test('finding the handbag uses one required word sound before a visual label reveal', async ({ page }) => {
  await installManualAudio(page);
  await openFresh(page);
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="audio-play"]').click();
  for (let index = 0; index < 7; index += 1) {
    await page.evaluate(() => window.__finishCourseAudio());
  }
  await clickValue(page, 'select-entity', 'handbag');
  await clickValue(page, 'select-target', 'handbag-owner');
  await page.locator('[data-action="response-submit"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await page.evaluate(() => window.__finishCourseAudio());
  await clickValue(page, 'select-entity', 'handbag');
  await page.locator('[data-action="response-submit"]').click();

  await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S04');
  await expect(page.locator('[data-action="audio-play"]')).toHaveCount(0);
  await expect(page.locator('.source-label-reveal')).toContainText('handbag');
  expect(await page.evaluate(() => (
    window.__courseAudioStarts.filter(src => src.endsWith('/l01-w07.mp3')).length
  ))).toBe(1);

  await page.getByRole('button', { name: '收好标签' }).click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M02');
  expect(await page.evaluate(() => (
    window.__courseAudioStarts.filter(src => src.endsWith('/l01-w07.mp3')).length
  ))).toBe(1);
});

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
    if (step.kind === 'source-reveal') {
      await page.locator('[data-action="response-submit"]').click();
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
  await page.getByRole('button', { name: '收好标签' }).click();
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

test('one-tap background music opt-in persists independently of course progress', async ({ page }) => {
  await installInstantAudio(page);
  await openFresh(page);
  const music = page.locator('[data-action="toggle-music"]');
  await expect(music).toHaveAttribute('aria-pressed', 'true');
  await music.click();
  await expect(music).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(key => localStorage.getItem(key), MUSIC_KEY)).toBe('false');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  await page.reload();
  await expect(page.locator('[data-action="toggle-music"]')).toHaveAttribute('aria-pressed', 'false');
});

test('a fresh child session keeps the provisional tone bed off until explicit music opt-in', async ({ page }) => {
  await installManualAudio(page);
  await openFresh(page);
  const music = page.locator('[data-action="toggle-music"]');

  await expect(music).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="audio-play"]').click();
  expect(await page.evaluate(() => window.__ambientAudioStarts)).toBe(0);

  await music.click();
  await expect(music).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => window.__ambientAudioStarts)).toBe(1);
});

test('a child can cancel or confirm restarting mid-unit without changing the music preference', async ({ page }) => {
  await installInstantAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);
  await page.locator('[data-action="toggle-music"]').click();
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S02');

  await clickValue(page, 'select-entity', 'handbag');
  await clickValue(page, 'select-target', 'handbag-owner');
  await page.locator('[data-action="response-submit"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S03');
  await clickValue(page, 'select-entity', 'handbag');
  await page.locator('[data-action="response-submit"]').click();
  await page.getByRole('button', { name: '收好标签' }).click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M02');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).not.toBeNull();

  await page.locator('[data-action="toggle-settings"]').click();
  await page.getByRole('button', { name: '重新开始本单元' }).click();
  const dialog = page.getByRole('dialog', { name: '要重新开始吗？' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '继续学习' }).click();
  await expect(dialog).toBeHidden();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M02');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).not.toBeNull();

  await page.locator('[data-action="toggle-settings"]').click();
  await page.getByRole('button', { name: '重新开始本单元' }).click();
  await page.getByRole('dialog', { name: '要重新开始吗？' })
    .getByRole('button', { name: '确认重新开始' }).click();
  await expect(page.locator('[data-action="start"]')).toBeVisible();
  await expect(page.locator('[data-action="toggle-music"]')).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  expect(await page.evaluate(key => localStorage.getItem(key), MUSIC_KEY)).toBe('false');
});

test('the local stage navigator previews any microtask without changing durable progress', async ({ page }) => {
  await installInstantAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);
  await page.locator('[data-action="start"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-step', 'L01-M01:S02');
  await clickValue(page, 'select-entity', 'handbag');
  await clickValue(page, 'select-target', 'handbag-owner');
  await page.locator('[data-action="response-submit"]').click();
  await page.locator('[data-action="audio-play"]').click();
  await clickValue(page, 'select-entity', 'handbag');
  await page.locator('[data-action="response-submit"]').click();
  await page.getByRole('button', { name: '收好标签' }).click();
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M02');
  const durableBefore = await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY);

  await page.locator('[data-action="toggle-settings"]').click();
  for (const [index, task] of tasks.entries()) {
    await expect(page.getByRole('button', { name: `阶段 ${index + 1}：${task.presentation.title}` }))
      .toBeVisible();
  }
  await page.getByRole('button', { name: '阶段 12：三案合闸' }).click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'true');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L02-M07');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe(durableBefore);

  for (const factId of ['claim-record-1', 'claim-record-2', 'claim-record-3']) {
    await clickValue(page, 'toggle-fact', factId);
  }
  await page.locator('[data-action="response-submit"]').click();
  await clickValue(page, 'select-entity', 'opening-lever');
  await clickValue(page, 'select-target', 'station-power');
  await page.locator('[data-action="response-submit"]').click();
  await expect(app(page)).toHaveAttribute('data-runtime-status', 'unit-built');
  await expect(page.locator('.case-progress')).toContainText('12 / 12');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe(durableBefore);

  await page.getByRole('button', { name: '退出阶段预览' }).click();
  await expect(app(page)).toHaveAttribute('data-preview-mode', 'false');
  await expect(app(page)).toHaveAttribute('data-runtime-microtask', 'L01-M02');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe(durableBefore);
});
