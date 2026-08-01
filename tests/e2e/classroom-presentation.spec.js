'use strict';

const { test, expect } = require('@playwright/test');

test('Lesson 49 has a clear public entry and exit for classroom presentation', async ({ page }) => {
  await page.goto('/lesson49/');
  const entry = page.getByRole('link', { name: /课堂投屏/ });
  await expect(entry).toHaveAttribute('href', '/lesson49/present/');
  await entry.click();

  await expect(page).toHaveURL(/\/lesson49\/present\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lesson 49 · 肉店大冒险');
  await expect(page.locator('#stepTitle')).toBeFocused();
  await expect(page.locator('#presentationProgress')).toHaveText('第 1 / 5 步');

  const exit = page.getByRole('link', { name: '退出投屏' });
  await expect(exit).toHaveAttribute('href', '/lesson49/');
  await exit.click();
  await expect(page).toHaveURL(/\/lesson49\/$/);
});

test('presentation controls advance, reveal hints, manage focus, and support keyboard shortcuts', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/lesson49/present/');

  const controls = page.locator('[data-presentation-control]');
  await expect(controls).toHaveCount(6);
  for (const control of await controls.all()) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  const hint = page.locator('#teacherHint');
  await expect(hint).toBeHidden();
  await page.keyboard.press('h');
  await expect(hint).toBeVisible();
  await expect(page.locator('#hintControl')).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#presentationProgress')).toHaveText('第 2 / 5 步');
  await expect(page.locator('#stepTitle')).toHaveText('beef');
  await expect(page.locator('#stepTitle')).toBeFocused();
  await expect(hint).toBeHidden();

  await page.locator('#nextControl').click();
  await expect(page.locator('#presentationProgress')).toHaveText('第 3 / 5 步');
  await page.locator('#previousControl').click();
  await expect(page.locator('#presentationProgress')).toHaveText('第 2 / 5 步');
});

test('presentation audio waits for a user gesture, replays same-origin recording, and never blocks next', async ({ page }) => {
  await page.addInitScript(() => {
    window.__presentationAudios = [];
    class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = new URL(src, location.href).href;
        this.paused = true;
        this.currentTime = 0;
        window.__presentationAudios.push(this);
      }
      play() { this.paused = false; return Promise.resolve(); }
      pause() { this.paused = true; }
    }
    window.Audio = FakeAudio;
  });
  await page.goto('/lesson49/present/');

  expect(await page.evaluate(() => window.__presentationAudios.length)).toBe(0);
  await page.locator('#audioControl').click();
  await expect.poll(() => page.evaluate(() => window.__presentationAudios.length)).toBe(1);
  expect(await page.evaluate(() => window.__presentationAudios[0].src)).toMatch(
    /\/lesson49\/audio\/butcher\.mp3$/
  );
  await expect(page.locator('#audioControl')).toHaveText(/重播录音/);
  await page.evaluate(() => window.__presentationAudios[0].dispatchEvent(new Event('ended')));
  await expect(page.locator('#audioStatus')).toContainText('播放完成');

  await page.locator('#audioControl').click();
  await expect.poll(() => page.evaluate(() => window.__presentationAudios.length)).toBe(2);
  await expect(page.locator('#nextControl')).toBeEnabled();
});

test('restricted audio and rejected fullscreen provide feedback without a navigation dead end', async ({ page }) => {
  await page.addInitScript(() => {
    class BlockedAudio extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; }
      play() { return Promise.reject(new Error('gesture restricted')); }
      pause() {}
    }
    window.Audio = BlockedAudio;
    Object.defineProperty(window, 'speechSynthesis', { value: undefined });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: undefined });
    Element.prototype.requestFullscreen = () => Promise.reject(new Error('fullscreen unavailable'));
  });
  await page.goto('/lesson49/present/');

  await page.locator('#audioControl').click();
  await expect(page.locator('#audioStatus')).toContainText('录音未能播放');
  await expect(page.locator('#nextControl')).toBeEnabled();
  await page.locator('#nextControl').click();
  await expect(page.locator('#presentationProgress')).toHaveText('第 2 / 5 步');

  await page.locator('#fullscreenControl').click();
  await expect(page.locator('#modeStatus')).toContainText('未进入全屏');
  await expect(page.locator('#nextControl')).toBeEnabled();
});

test('fullscreen toggles through its public control', async ({ page }) => {
  await page.addInitScript(() => {
    let fullscreenElement = null;
    Object.defineProperty(document, 'fullscreenElement', { get: () => fullscreenElement });
    Element.prototype.requestFullscreen = async function requestFullscreen() {
      fullscreenElement = this;
      document.dispatchEvent(new Event('fullscreenchange'));
    };
    document.exitFullscreen = async function exitFullscreen() {
      fullscreenElement = null;
      document.dispatchEvent(new Event('fullscreenchange'));
    };
  });
  await page.goto('/lesson49/present/');

  const fullscreen = page.locator('#fullscreenControl');
  await fullscreen.click();
  await expect(fullscreen).toHaveText(/退出全屏/);
  await fullscreen.click();
  await expect(fullscreen).toHaveText(/进入全屏/);
});

test('presentation never reads device storage or renders personal learning data', async ({ page }) => {
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    originalSetItem.call(localStorage, 'canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 },
      privateMarker: 'PRIVATE_CHILD_NAME'
    }));
    window.__presentationStorageAccesses = [];
    for (const method of ['getItem', 'setItem', 'removeItem', 'clear', 'key']) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function trackedStorageMethod(...args) {
        window.__presentationStorageAccesses.push({ method, key: String(args[0] ?? '') });
        return original.apply(this, args);
      };
    }
  });
  await page.goto('/lesson49/present/');

  expect(await page.evaluate(() => window.__presentationStorageAccesses)).toEqual([]);
  await expect(page.locator('body')).not.toContainText('PRIVATE_CHILD_NAME');
  await expect(page.locator('body')).not.toContainText(/昵称|个人进度|学习码|纪念物|星星汇总/);
  const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name));
  expect(resources.some(url => /core\/(?:storage|device-profile)\.js/.test(url))).toBe(false);
});

test('reduced motion keeps the complete presentation flow operable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/lesson49/present/');
  await page.locator('#hintControl').click();
  await expect(page.locator('#teacherHint')).toBeVisible();
  await page.locator('#nextControl').click();
  await expect(page.locator('#presentationProgress')).toHaveText('第 2 / 5 步');
  expect(await page.locator('#presentationStage').evaluate(element => (
    getComputedStyle(element).transitionDuration
  ))).toBe('0s');
});

test('presentation controls remain large and unobstructed in a 390px mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lesson49/present/');
  const layout = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth
  }));
  expect(layout.page).toBe(layout.viewport);

  const controls = page.locator('[data-presentation-control]');
  await expect(controls).toHaveCount(6);
  for (const control of await controls.all()) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await page.locator('#nextControl').click();
  await expect(page.locator('#presentationProgress')).toHaveText('第 2 / 5 步');
  await expect(page.locator('#stepTitle')).toBeFocused();
});
