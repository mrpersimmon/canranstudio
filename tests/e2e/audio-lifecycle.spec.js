'use strict';

const { test, expect } = require('@playwright/test');

function installManualAudio(page) {
  return page.addInitScript(() => {
    window.__audios = [];
    window.Audio = class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.currentTime = 0;
        this.paused = false;
        this.handlers = {};
        window.__audios.push(this);
      }
      addEventListener(type, handler, options) {
        if (type === 'ended' || type === 'error') this.handlers[type] = handler;
        super.addEventListener(type, handler, options);
      }
      play() {
        return Promise.resolve();
      }
      pause() {
        this.paused = true;
      }
    };
  });
}

test('starting a second soundmark word clears the first playing state', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/soundmark/');
  const bit = page.locator('.wchip[data-audio-word="bit"]');
  const fit = page.locator('.wchip[data-audio-word="fit"]');

  await bit.click();
  await expect(bit).toHaveClass(/playing/);
  await page.evaluate(() => {
    window.__bitAudio = window.__audios
      .filter(audio => audio.src.endsWith('audio/bit.mp3'))
      .at(-1);
    window.__bitAudio.currentTime = 1;
  });
  expect(await page.evaluate(() => window.__bitAudio.src)).toMatch(/audio\/bit\.mp3$/);
  await fit.click();
  await page.evaluate(() => {
    window.__fitAudio = window.__audios
      .filter(audio => audio.src.endsWith('audio/fit.mp3'))
      .at(-1);
  });
  expect(await page.evaluate(() => window.__fitAudio.src)).toMatch(/audio\/fit\.mp3$/);

  await expect(bit).not.toHaveClass(/playing/);
  await expect(fit).toHaveClass(/playing/);
  expect(await page.evaluate(() => window.__bitAudio.paused)).toBe(true);
  expect(await page.evaluate(() => window.__bitAudio.currentTime)).toBe(0);

  await page.evaluate(() => {
    window.__bitAudio.handlers.ended();
  });
  await expect(fit).toHaveClass(/playing/);

  await page.evaluate(() => {
    window.__fitAudio.handlers.ended();
  });
  await expect(fit).not.toHaveClass(/playing/);
});

test('unsupported soundmark audio clears playing state and warns once', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.addInitScript(() => {
    window.Audio = undefined;
    Reflect.deleteProperty(window, 'speechSynthesis');
    Reflect.deleteProperty(window, 'SpeechSynthesisUtterance');
  });
  await page.goto('/soundmark/');
  await page.evaluate(() => {
    window.__audioWarnings = [];
    const originalToast = toast;
    toast = message => {
      window.__audioWarnings.push(message);
      return originalToast(message);
    };
    speechWarned = false;
  });

  const bit = page.locator('.wchip[data-audio-word="bit"]');
  const fit = page.locator('.wchip[data-audio-word="fit"]');
  await bit.click();
  await fit.click();

  expect(pageErrors).toEqual([]);
  await expect(bit).not.toHaveClass(/playing/);
  await expect(fit).not.toHaveClass(/playing/);
  expect(await page.evaluate(() => window.__audioWarnings)).toEqual([
    '当前浏览器不支持语音朗读，可以用 Chrome / Edge 打开试试～'
  ]);
});
