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

async function settleLesson50InitializationAudio(page) {
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 450)));
  const audioCount = await page.evaluate(() => window.__audios.length);
  expect(audioCount).toBeLessThanOrEqual(1);
  if (audioCount === 1) {
    await page.evaluate(() => window.__audios[0].dispatchEvent(new Event('ended')));
    await expect.poll(() => page.evaluate(() => speechBusy)).toBe(false);
  } else {
    expect(await page.evaluate(() => speechBusy)).toBe(false);
  }
  await page.evaluate(() => {
    window.__audios.length = 0;
    speechQ.length = 0;
  });
}

test('starting a second soundmark word clears the first playing state', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/soundmark/');
  const initialGameAudio = page.locator('#g1Hear');
  const bit = page.locator('.wchip[data-audio-word="bit"]');
  const fit = page.locator('.wchip[data-audio-word="fit"]');

  expect(await page.evaluate(() => window.__audios.length)).toBe(0);
  await initialGameAudio.click();
  await expect.poll(() => page.evaluate(() => window.__audios.length)).toBe(1);
  await expect(initialGameAudio).toHaveClass(/playing/);
  await page.evaluate(() => {
    window.__audios[0].dispatchEvent(new Event('ended'));
    window.__audios.length = 0;
  });
  await expect(initialGameAudio).not.toHaveClass(/playing/);

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

test('Lesson 50 queued speech advances only after the active item finishes', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/lesson50/');
  await page.locator('body').dispatchEvent('pointerdown');
  await settleLesson50InitializationAudio(page);

  await page.evaluate(() => {
    speakLater('apple');
    speakLater('banana');
  });
  await expect.poll(() => page.evaluate(() => window.__audios.length)).toBe(1);
  expect(await page.evaluate(() => speechBusy)).toBe(true);

  await page.evaluate(() => window.__audios[0].dispatchEvent(new Event('ended')));
  await expect.poll(() => page.evaluate(() => window.__audios.length)).toBe(2);
  expect(await page.evaluate(() => window.__audios[1].src.endsWith('audio/banana.mp3'))).toBe(true);

  await page.evaluate(() => window.__audios[1].dispatchEvent(new Event('ended')));
  await expect.poll(() => page.evaluate(() => speechBusy)).toBe(false);
  expect(await page.evaluate(() => speechQ.length)).toBe(0);
});

test('Lesson 50 interruption finalizes stale work exactly once', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/lesson50/');

  await page.evaluate(() => {
    window.__firstDone = 0;
    window.__secondDone = 0;
    speak('apple', () => { window.__firstDone += 1; });
    speak('banana', () => { window.__secondDone += 1; });
  });

  expect(await page.evaluate(() => window.__audios[0].paused)).toBe(true);
  expect(await page.evaluate(() => window.__firstDone)).toBe(1);
  await page.evaluate(() => window.__audios[1].dispatchEvent(new Event('ended')));
  await expect.poll(() => page.evaluate(() => window.__secondDone)).toBe(1);
  expect(await page.evaluate(() => window.__firstDone)).toBe(1);
  expect(await page.evaluate(() => speechBusy)).toBe(false);
});

test('Lesson 50 synchronous cancellation reentry keeps the newest request and queue', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/lesson50/');
  await page.locator('body').dispatchEvent('pointerdown');
  await settleLesson50InitializationAudio(page);

  await page.evaluate(() => {
    window.__speechResults = [];
    speak('apple', result => {
      window.__cancelBusy = speechBusy;
      window.__speechResults.push(['apple', result?.reason]);
      speak('cherry', nextResult => {
        window.__speechResults.push(['cherry', nextResult?.reason]);
      });
      speakLater('pear');
    });
    window.__appleAudio = window.__audios.at(-1);
    speak('banana', result => {
      window.__speechResults.push(['banana', result?.reason]);
    });
  });

  expect(await page.evaluate(() => window.__audios.map(audio => audio.src))).toEqual([
    expect.stringMatching(/audio\/apple\.mp3$/),
    expect.stringMatching(/audio\/cherry\.mp3$/)
  ]);
  expect(await page.evaluate(() => window.__speechResults)).toEqual([
    ['apple', 'cancelled'],
    ['banana', 'cancelled']
  ]);
  expect(await page.evaluate(() => window.__cancelBusy)).toBe(false);
  expect(await page.evaluate(() => speechQ.length)).toBe(1);
  expect(await page.evaluate(() => speechBusy)).toBe(true);

  await page.evaluate(() => window.__appleAudio.handlers.ended());
  expect(await page.evaluate(() => window.__audios.length)).toBe(2);
  expect(await page.evaluate(() => window.__speechResults)).toEqual([
    ['apple', 'cancelled'],
    ['banana', 'cancelled']
  ]);

  await page.evaluate(() => window.__audios[1].handlers.ended());
  await expect.poll(() => page.evaluate(() => window.__audios.length)).toBe(3);
  expect(await page.evaluate(() => window.__audios[2].src.endsWith('audio/pear.mp3'))).toBe(true);
  expect(await page.evaluate(() => window.__speechResults)).toEqual([
    ['apple', 'cancelled'],
    ['banana', 'cancelled'],
    ['cherry', 'ended']
  ]);

  await page.evaluate(() => window.__audios[2].handlers.ended());
  await expect.poll(() => page.evaluate(() => speechBusy)).toBe(false);
  expect(await page.evaluate(() => speechQ.length)).toBe(0);
});

test('unsupported Lesson 50 speech completes without voice lookup errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.addInitScript(() => {
    window.Audio = undefined;
    Reflect.deleteProperty(window, 'speechSynthesis');
    Reflect.deleteProperty(window, 'SpeechSynthesisUtterance');
  });
  await page.goto('/lesson50/');
  await page.evaluate(() => {
    window.__speechWarnings = [];
    window.alert = message => window.__speechWarnings.push(message);
    window.__firstDone = 0;
    window.__secondDone = 0;
    speechWarned = false;
    speak('apple', () => { window.__firstDone += 1; });
    speak('banana', () => { window.__secondDone += 1; });
  });

  expect(pageErrors).toEqual([]);
  expect(await page.evaluate(() => [window.__firstDone, window.__secondDone])).toEqual([1, 1]);
  expect(await page.evaluate(() => window.__speechWarnings)).toEqual([
    '当前浏览器不支持语音朗读 😢 可以用 Chrome / Edge 打开试试～'
  ]);
  expect(await page.evaluate(() => speechBusy)).toBe(false);
});

test('Lesson 49 replaces an active recording without leaving two players', async ({ page }) => {
  await installManualAudio(page);
  await page.goto('/lesson49/#learn/words');

  await page.locator('#cardGrid .fcard-in').nth(0).click();
  await page.locator('#cardGrid .fcard-in').nth(1).click();

  expect(await page.evaluate(() => window.__audios.length)).toBe(2);
  expect(await page.evaluate(() => window.__audios[0].paused)).toBe(true);
  expect(await page.evaluate(() => window.__audios[1].paused)).toBe(false);
});

test('Lesson 49 falls back to speech when active recording playback errors', async ({ page }) => {
  await installManualAudio(page);
  await page.addInitScript(() => {
    window.__spoken = [];
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        addEventListener() {},
        cancel() {},
        getVoices() {
          return [];
        },
        speak(utterance) {
          window.__spoken.push(utterance.text);
        }
      }
    });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class {
        constructor(text) {
          this.text = text;
        }
      }
    });
  });
  await page.goto('/lesson49/#learn/words');

  await page.locator('#cardGrid .fcard-in').first().click();
  await expect.poll(() => page.evaluate(() => window.__audios.length)).toBe(1);
  await page.evaluate(() => window.__audios[0].dispatchEvent(new Event('error')));

  await expect.poll(() => page.evaluate(() => window.__spoken)).toEqual(['butcher']);
});

test('unsupported Lesson 49 speech gives visible retry guidance without voice lookup errors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.addInitScript(() => {
    window.Audio = undefined;
    Reflect.deleteProperty(window, 'speechSynthesis');
    Reflect.deleteProperty(window, 'SpeechSynthesisUtterance');
  });
  await page.goto('/lesson49/#learn/words');
  await page.locator('#cardGrid .fcard-in').nth(0).click();
  await page.locator('#cardGrid .fcard-in').nth(1).click();
  await expect(page.locator('#speechNotice')).toHaveText('声音暂时没有播放，请再点一次试试。');
  expect(pageErrors).toEqual([]);
});
