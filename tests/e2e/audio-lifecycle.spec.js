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
        window.__audios.push(this);
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
    window.__bitAudio = window.__audios.at(-1);
    window.__bitAudio.currentTime = 1;
  });
  await fit.click();

  await expect(bit).not.toHaveClass(/playing/);
  await expect(fit).toHaveClass(/playing/);
  expect(await page.evaluate(() => window.__bitAudio.paused)).toBe(true);
  expect(await page.evaluate(() => window.__bitAudio.currentTime)).toBe(0);

  await page.evaluate(() => {
    window.__bitAudio.dispatchEvent(new Event('ended'));
  });
  await expect(fit).toHaveClass(/playing/);

  await page.evaluate(() => {
    window.__audios.at(-1).dispatchEvent(new Event('ended'));
  });
  await expect(fit).not.toHaveClass(/playing/);
});
