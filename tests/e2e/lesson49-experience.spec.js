'use strict';

const { test, expect } = require('@playwright/test');

const EXPERIENCE_PATH = '/poc/lesson49-experience/';
const STORAGE_KEY = 'poc:lesson49-experience:v1';

async function installInstantAudio(page, { fail = false } = {}) {
  await page.addInitScript(({ shouldFail }) => {
    class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.preload = '';
        this.currentTime = 0;
      }
      load() {}
      pause() {}
      play() {
        window.__lesson49AudioPlayCount = (window.__lesson49AudioPlayCount || 0) + 1;
        queueMicrotask(() => this.dispatchEvent(new Event(shouldFail ? 'error' : 'ended')));
        return Promise.resolve();
      }
    }
    Object.defineProperty(window, 'Audio', { configurable: true, value: FakeAudio });
    if (shouldFail) {
      Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: null });
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: null });
    }
  }, { shouldFail: fail });
}

async function installManualAudio(page) {
  await page.addInitScript(() => {
    class ManualAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.preload = '';
        this.currentTime = 0;
      }
      load() {}
      pause() {}
      play() {
        window.__lesson49AudioPlayCount = (window.__lesson49AudioPlayCount || 0) + 1;
        window.__lesson49PendingAudio = this;
        return Promise.resolve();
      }
    }
    window.__finishLesson49Audio = () => {
      window.__lesson49PendingAudio?.dispatchEvent(new Event('ended'));
    };
    Object.defineProperty(window, 'Audio', { configurable: true, value: ManualAudio });
  });
}

async function openFresh(page) {
  await page.goto(EXPERIENCE_PATH);
  await page.evaluate(key => localStorage.removeItem(key), STORAGE_KEY);
  return page.reload();
}

test('a child can finish Lesson 49 from arrival through two durable landmark reveals', async ({ page }) => {
  await installInstantAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await openFresh(page);

  await page.evaluate(() => {
    localStorage.setItem('canran:l49:progress:v2', 'production-progress-sentinel');
    localStorage.setItem('canran:adventure-map:profile:v1', 'atlas-profile-sentinel');
    sessionStorage.setItem('lesson49:unrelated', 'session-sentinel');
  });

  expect(response.status()).toBe(200);
  const root = page.locator('[data-lesson49-experience]');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(root).toHaveAttribute('data-view', 'arrival');
  await expect(page.locator('[data-start-adventure]')).toHaveAccessibleName(/开始冒险/);
  await expect(page.locator('[data-debug-controls]')).toHaveCount(0);

  await page.locator('[data-start-adventure]').click();
  await expect(root).toHaveAttribute('data-runtime-beat', 'discover');
  await expect(root).toHaveAttribute('data-build-stage', '0');
  await page.locator('[data-answer="quantity"]').click();

  const reveal = page.locator('[data-growth-reveal]');
  await expect(reveal).toBeVisible();
  await expect(reveal).toContainText('遮阳棚');
  await expect(root).toHaveAttribute('data-build-stage', '1');
  await reveal.click();

  await expect(root).toHaveAttribute('data-runtime-beat', 'understand');
  await expect(page.locator('[data-audio-play]')).toBeVisible();
  await expect(page.locator('[data-answer-grid]')).toBeHidden();
  await page.locator('[data-audio-play]').click();
  await expect(page.locator('[data-answer-grid]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__lesson49AudioPlayCount)).toBe(2);
  await page.locator('[data-audio-play]').click();
  await expect.poll(() => page.evaluate(() => window.__lesson49AudioPlayCount)).toBe(4);
  await expect(page.locator('[data-answer-grid]')).toBeVisible();
  await page.locator('[data-answer="beef"]').click();

  await expect(reveal).toBeVisible();
  await expect(reveal).toContainText('展示台');
  await expect(root).toHaveAttribute('data-build-stage', '2');
  await reveal.click();

  await expect(root).toHaveAttribute('data-view', 'complete');
  await expect(page.locator('[data-lesson-complete]')).toContainText('Lesson 49');
  await expect(page.locator('[data-lesson-complete]')).toContainText('2 / 5');
  await expect(page.locator('[data-map-return]')).toHaveAttribute(
    'href',
    '/?district=first-book-49-60&focus=lesson49'
  );

  const projection = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(projection.revision).toBeGreaterThanOrEqual(2);
  expect(projection.value.units['FLC-U01'].buildStage).toBe(2);
  await expect.poll(() => page.evaluate(() => ({
    progress: localStorage.getItem('canran:l49:progress:v2'),
    atlas: localStorage.getItem('canran:adventure-map:profile:v1'),
    session: sessionStorage.getItem('lesson49:unrelated')
  }))).toEqual({
    progress: 'production-progress-sentinel',
    atlas: 'atlas-profile-sentinel',
    session: 'session-sentinel'
  });
});

test('the answer dock stays closed until both real dialogue lines have ended', async ({ page }) => {
  await installManualAudio(page);
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await page.locator('[data-answer="quantity"]').click();
  await page.locator('[data-growth-reveal]').click();
  await page.locator('[data-audio-play]').click();

  await expect(page.locator('[data-answer-grid]')).toBeHidden();
  await page.evaluate(() => window.__finishLesson49Audio());
  await expect.poll(() => page.evaluate(() => window.__lesson49AudioPlayCount)).toBe(2);
  await expect(page.locator('[data-answer-grid]')).toBeHidden();
  await page.evaluate(() => window.__finishLesson49Audio());
  await expect(page.locator('[data-answer-grid]')).toBeVisible();
});

test('the first wrong answer gives a non-revealing observation cue and never grows the landmark', async ({ page }) => {
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await page.locator('[data-answer="person"]').click();

  const root = page.locator('[data-lesson49-experience]');
  await expect(root).toHaveAttribute('data-support-level', '1');
  await expect(root).toHaveAttribute('data-build-stage', '0');
  await expect(page.locator('[data-feedback]')).toContainText('重新观察');
  await expect(page.locator('[data-feedback]')).not.toContainText('正确答案');
  await expect(page.locator('[data-answer="quantity"]')).not.toHaveAttribute('data-correct', 'true');
  await expect(page.locator('[data-growth-reveal]')).toBeHidden();
});

test('audio failure opens a text-image fallback without blocking Lesson 49', async ({ page }) => {
  await installInstantAudio(page, { fail: true });
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await page.locator('[data-answer="quantity"]').click();
  await page.locator('[data-growth-reveal]').click();
  await page.locator('[data-audio-play]').click();

  await expect(page.locator('[data-audio-fallback]')).toBeVisible();
  await expect(page.locator('[data-audio-fallback]')).toContainText('Beef, please.');
  await expect(page.locator('[data-answer-grid]')).toBeVisible();
});

test('a saved first checkpoint resumes at the listening mission instead of replaying growth', async ({ page }) => {
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await page.locator('[data-answer="quantity"]').click();
  await expect(page.locator('[data-growth-reveal]')).toBeVisible();
  await page.reload();

  await expect(page.locator('[data-start-adventure]')).toContainText('继续冒险');
  await page.locator('[data-start-adventure]').click();
  await expect(page.locator('[data-lesson49-experience]')).toHaveAttribute('data-runtime-beat', 'understand');
  await expect(page.locator('[data-growth-reveal]')).toBeHidden();
});

test('a failed local save leaves the landmark at its last durable stage', async ({ page }) => {
  await page.addInitScript(key => {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function guardedSetItem(candidate, value) {
      if (candidate === key) throw new DOMException('quota unavailable', 'QuotaExceededError');
      return nativeSetItem.call(this, candidate, value);
    };
  }, STORAGE_KEY);
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await page.locator('[data-answer="quantity"]').click();

  const root = page.locator('[data-lesson49-experience]');
  await expect(root).toHaveAttribute('data-build-stage', '0');
  await expect(page.locator('[data-growth-reveal]')).toBeHidden();
  await expect(page.locator('[data-feedback]')).toContainText('暂时没有保存');
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
});

test('reduced motion can finish the same durable Lesson 49 flow', async ({ page }) => {
  await installInstantAudio(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openFresh(page);
  await page.locator('[data-start-adventure]').click();
  await page.locator('[data-answer="quantity"]').click();
  await page.locator('[data-growth-reveal]').click();
  await page.locator('[data-audio-play]').click();
  await page.locator('[data-answer="beef"]').click();
  await page.locator('[data-growth-reveal]').click();

  await expect(page.locator('[data-lesson49-experience]')).toHaveAttribute('data-view', 'complete');
  await expect(page.locator('[data-lesson49-experience]')).toHaveAttribute('data-build-stage', '2');
});

for (const viewport of [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'Huawei', width: 466, height: 980 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 }
]) {
  test(`${viewport.name} keeps the child experience inside one viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openFresh(page);
    const startBox = await page.locator('[data-start-adventure]').boundingBox();
    const backBox = await page.locator('.map-back').boundingBox();
    expect(startBox.height).toBeGreaterThanOrEqual(44);
    expect(backBox.height).toBeGreaterThanOrEqual(44);
    await page.locator('[data-start-adventure]').click();

    for (const button of await page.locator('[data-answer-grid] button').all()) {
      const box = await button.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    const headerBox = await page.locator('.story-header').boundingBox();
    const missionBox = await page.locator('[data-mission]').boundingBox();
    expect(missionBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 1);
    expect(missionBox.y + missionBox.height).toBeLessThanOrEqual(viewport.height + 1);

    const geometry = await page.evaluate(() => ({
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      },
      body: {
        width: document.body.scrollWidth,
        height: document.body.scrollHeight
      }
    }));
    expect(geometry.document.width).toBeLessThanOrEqual(geometry.viewport.width + 1);
    expect(geometry.document.height).toBeLessThanOrEqual(geometry.viewport.height + 1);
    expect(geometry.body.width).toBeLessThanOrEqual(geometry.viewport.width + 1);
    expect(geometry.body.height).toBeLessThanOrEqual(geometry.viewport.height + 1);
  });
}
