'use strict';

const { test, expect } = require('@playwright/test');

async function installMockAudio(page, { speech = 'unsupported' } = {}) {
  await page.addInitScript(({ speechMode }) => {
    window.__mockAudios = [];

    class MockAudio {
      constructor(src) {
        this.src = src;
        this.currentTime = 0;
        this.paused = false;
        this.listeners = new Map();
        window.__mockAudios.push(this);
      }
      addEventListener(type, listener, options = {}) {
        const listeners = this.listeners.get(type) || [];
        listeners.push({ listener, once: Boolean(options && options.once) });
        this.listeners.set(type, listeners);
      }
      removeEventListener(type, listener) {
        this.listeners.set(
          type,
          (this.listeners.get(type) || []).filter(entry => entry.listener !== listener)
        );
      }
      play() {
        this.paused = false;
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
      emit(type) {
        for (const entry of [...(this.listeners.get(type) || [])]) {
          entry.listener.call(this, { type, target: this });
          if (entry.once) this.removeEventListener(type, entry.listener);
        }
      }
    }

    window.Audio = MockAudio;
    if (speechMode === 'pending') {
      class MockUtterance {
        constructor(text) {
          this.text = text;
          this.onend = null;
          this.onerror = null;
        }
      }
      Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        configurable: true,
        value: MockUtterance
      });
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: {
          addEventListener() {},
          getVoices() { return []; },
          speak(utterance) { this.lastUtterance = utterance; },
          cancel() { this.cancelled = true; }
        }
      });
    } else {
      Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        configurable: true,
        value: undefined
      });
      Object.defineProperty(window, 'speechSynthesis', {
        configurable: true,
        value: null
      });
    }
  }, { speechMode: speech });
}

async function storyRating(page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l51:progress:v2')).ratings.l2
  );
}

test('manual speech cancels play-all and clears stale line state', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await expect(page.locator('.line.playing')).toHaveCount(1);

  await page.evaluate(() => document.getElementById('heroQ').click());
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(2);
  await page.evaluate(() => window.__mockAudios.at(-1).emit('ended'));
  await page.waitForTimeout(700);

  await expect(page.locator('.line.playing')).toHaveCount(0);
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(2);
  expect(await page.evaluate(() => window.__mockAudios[0].paused)).toBe(true);
});

test('only uninterrupted final-line completion awards story theatre', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  const lineCount = await page.locator('#scenes .line').count();
  await page.locator('#playAll').click();

  for (let index = 0; index < lineCount; index += 1) {
    expect(await page.evaluate(() => window.__mockAudios.length)).toBe(index + 1);
    await page.evaluate(i => window.__mockAudios[i].emit('ended'), index);
    if (index === lineCount - 2) expect(await storyRating(page)).toBe(0);
    if (index < lineCount - 1) await page.waitForTimeout(550);
  }

  expect(await storyRating(page)).toBe(3);
  await expect(page.locator('.line.playing')).toHaveCount(0);
});

test('audio error with unsupported fallback never awards story theatre', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await page.evaluate(() => window.__mockAudios[0].emit('error'));

  expect(await storyRating(page)).toBe(0);
  await expect(page.locator('.line.playing')).toHaveCount(0);
});

test('manual stop never awards story theatre', async ({ page }) => {
  await installMockAudio(page);
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await page.locator('#stopAll').click();

  expect(await storyRating(page)).toBe(0);
  await expect(page.locator('.line.playing')).toHaveCount(0);
  expect(await page.evaluate(() => window.__mockAudios[0].paused)).toBe(true);
});

test('speech timeout never awards story theatre', async ({ page }) => {
  await installMockAudio(page, { speech: 'pending' });
  await page.clock.install();
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  expect(await page.evaluate(() => window.__mockAudios.length)).toBe(1);
  await page.evaluate(() => window.__mockAudios[0].emit('error'));
  await page.clock.fastForward(60_000);

  expect(await storyRating(page)).toBe(0);
  await expect(page.locator('.line.playing')).toHaveCount(0);
});
