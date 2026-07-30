'use strict';

const { test, expect } = require('@playwright/test');

async function openDeterministicSoundmark(page) {
  await page.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay = 0, ...args) =>
      nativeSetTimeout(callback, Math.min(delay, 20), ...args);
    Math.random = () => 0;
  });
  await page.goto('/soundmark/');
}

const domClick = locator => locator.evaluate(element => element.click());

async function readSoundmarkRatings(page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:soundmark:progress:v2')).ratings
  );
}

async function completeG1Round(page, firstTryCorrect) {
  for (let round = 0; round < firstTryCorrect.length; round += 1) {
    if (!firstTryCorrect[round]) {
      await domClick(page.locator('#g1Opts [data-sym="i:"]'));
      await expect(page.locator('#g1Opts [data-sym="i:"]')).toHaveClass(/wrong/);
    }
    await domClick(page.locator('#g1Opts [data-sym="ɪ"]'));
    if (round < firstTryCorrect.length - 1) {
      await expect(page.locator('#g1Fb')).toHaveText('');
    }
  }
  await expect(page.locator('#g1Score')).toContainText('本轮完成');
}

test('syllable station labels the stressed syllable as 重音', async ({ page }) => {
  await page.goto('/soundmark/');

  await expect(page.locator('#syll .rule small')).toContainText('红色徽章是「重音」');
  await domClick(page.locator('#btnSlice'));
  await expect(page.locator('#syllDisplay .stress')).toHaveCount(1);
  await expect(page.locator('#syllDisplay .stress')).toHaveText('重音');
});

test('legacy integer stars reset once and cannot crash rendering', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('phonics-magic-stars-v1', '-1');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/soundmark/');

  expect(errors).toEqual([]);
  await expect(page.locator('#starCount')).toHaveText('0');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:soundmark:progress:v2'))
  );
  expect(saved.ratings).toEqual({ vs: 0, g1: 0, g2: 0, g3: 0 });
  expect(await page.evaluate(() => localStorage.getItem('phonics-magic-stars-v1'))).toBeNull();
});

test('all-corrupt v2 soundmark ratings cannot unlock its certificate', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: [3], g1: ['3'], g2: '3', g3: [3] }
    }));
  });

  await page.goto('/soundmark/');

  const repaired = await readSoundmarkRatings(page);
  expect(repaired).toEqual({ vs: 0, g1: 0, g2: 0, g3: 0 });
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#btnOpenCert')).toBeDisabled();
  expect(await page.evaluate(() => window.eval('canIssueSoundmarkCertificate()'))).toBe(false);

  await page.locator('#btnOpenCert').evaluate(button => { button.disabled = false; });
  await page.locator('#certName').fill('小明');
  await page.locator('#btnOpenCert').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('soundmark certificate requires twelve finite stars and a non-empty name', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 3 }
    }));
    window.__printed = false;
    window.print = () => { window.__printed = true; };
  });

  await page.goto('/soundmark/');
  await expect(page.locator('#btnOpenCert')).toBeEnabled();
  await page.locator('#btnOpenCert').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await page.evaluate(() => window.__printed)).toBe(false);
  await expect(page.locator('#certName')).toBeFocused();

  await page.locator('#certName').fill('小明');
  await page.locator('#btnOpenCert').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('#certPrintAction').click();
  expect(await page.evaluate(() => window.__printed)).toBe(true);
});

test('eleven stars cannot issue the soundmark certificate', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 2 }
    }));
    window.__printed = false;
    window.print = () => { window.__printed = true; };
  });

  await page.goto('/soundmark/');

  await expect(page.locator('#starCount')).toHaveText('11');
  await expect(page.locator('#btnOpenCert')).toBeDisabled();
  await expect(page.locator('#certNeed')).toContainText('还差 1 颗星');
  await page.locator('#btnOpenCert').evaluate(button => { button.disabled = false; });
  await page.locator('#certName').fill('小明');
  await page.locator('#btnOpenCert').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await page.evaluate(() => window.__printed)).toBe(false);
});

test('soundmark print re-checks eligibility after its certificate dialog opens', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 3 }
    }));
    window.__printed = false;
    window.print = () => { window.__printed = true; };
  });

  await page.goto('/soundmark/');
  await page.locator('#certName').fill('小明');
  await page.locator('#btnOpenCert').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.evaluate(() => {
    window.eval('soundRatings={vs:3,g1:3,g2:3,g3:2}');
  });
  await page.locator('#certPrintAction').click();

  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#btnOpenCert')).toBeDisabled();
  await expect(page.locator('#certNeed')).toContainText('还差 1 颗星');
  expect(await page.evaluate(() => window.__printed)).toBe(false);
});

test('real g1 replays raise but never lower the historical rating', async ({ page }) => {
  await openDeterministicSoundmark(page);

  await completeG1Round(page, [true, true, true, false, false]);
  expect((await readSoundmarkRatings(page)).g1).toBe(1);

  await domClick(page.locator('#g1Next'));
  await completeG1Round(page, [true, true, true, true, true]);
  expect((await readSoundmarkRatings(page)).g1).toBe(3);

  await domClick(page.locator('#g1Next'));
  await completeG1Round(page, [false, false, false, false, false]);
  expect((await readSoundmarkRatings(page)).g1).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('next consumes an active failed question in all three games', async ({ page }) => {
  await openDeterministicSoundmark(page);

  await domClick(page.locator('#g1Opts [data-sym="i:"]'));
  await domClick(page.locator('#g1Next'));
  await expect(page.locator('#g1Score')).toHaveText('本关：1 / 5');
  for (let round = 0; round < 4; round += 1) {
    await domClick(page.locator('#g1Opts [data-sym="ɪ"]'));
    if (round < 3) await expect(page.locator('#g1Fb')).toHaveText('');
  }
  await expect(page.locator('#g1Score')).toHaveText('本轮完成 · 获得 2 星');

  await domClick(page.locator('.gtab[data-g="g2"]'));
  await domClick(page.locator('#g2Next'));
  await domClick(page.locator('#g2Opts [data-w="sheep"]'));
  await domClick(page.locator('#g2Next'));
  await expect(page.locator('#g2Score')).toHaveText('本关：1 / 5');
  for (let round = 0; round < 4; round += 1) {
    await domClick(page.locator('#g2Opts [data-w="ship"]'));
    if (round < 3) await expect(page.locator('#g2Fb')).toHaveText('');
  }
  await expect(page.locator('#g2Score')).toHaveText('本轮完成 · 获得 2 星');

  await domClick(page.locator('.gtab[data-g="g3"]'));
  await domClick(page.locator('#g3Opts .g-opt', { hasText: 'feet' }));
  await domClick(page.locator('#g3Next'));
  await expect(page.locator('#g3Score')).toHaveText('本关：1 / 5');
  for (let round = 0; round < 4; round += 1) {
    await domClick(page.locator('#g3Opts .g-opt', { hasText: 'fish' }));
    if (round < 3) await expect(page.locator('#g3Fb')).toHaveText('');
  }
  await expect(page.locator('#g3Score')).toHaveText('本轮完成 · 获得 2 星');

  expect(await readSoundmarkRatings(page)).toEqual({ vs: 0, g1: 2, g2: 2, g3: 2 });
});

test('next cannot duplicate a solved question transition', async ({ page }) => {
  await openDeterministicSoundmark(page);

  const transitionFeedback = await page.evaluate(() => {
    document.querySelector('#g1Opts [data-sym="ɪ"]').click();
    document.getElementById('g1Next').click();
    return document.getElementById('g1Fb').textContent;
  });
  expect(transitionFeedback).toContain('答对啦');
  await expect(page.locator('#g1Score')).toHaveText('本关：1 / 5');
  await expect(page.locator('#g1Fb')).toHaveText('');
  await expect(page.locator('#g1Score')).toHaveText('本关：1 / 5');

  await completeG1Round(page, [true, true, true, true]);
  expect((await readSoundmarkRatings(page)).g1).toBe(3);

  await domClick(page.locator('#g1Next'));
  await expect(page.locator('#g1Score')).toHaveText('本关：0 / 5');
});

test('vowel challenge ignores rapid input until the next question is visible', async ({ page }) => {
  await openDeterministicSoundmark(page);

  await page.evaluate(() => {
    document.querySelector('.vs-pick[data-a="v"]').click();
    document.querySelector('.vs-pick[data-a="c"]').click();
  });
  await expect(page.locator('#vsTarget')).toHaveText('/p/');
  await expect(page.locator('#vsFb')).toContainText('第 2 / 10 题');

  const vowels = new Set(['/e/', '/æ/', '/ʊ/', '/ɑ:/', '/u:/']);
  for (let index = 1; index < 10; index += 1) {
    const target = await page.locator('#vsTarget').textContent();
    const correct = vowels.has(target) ? 'v' : 'c';
    await domClick(page.locator(`.vs-pick[data-a="${correct}"]`));
    if (index < 9) {
      await expect(page.locator('#vsFb')).toContainText(`第 ${index + 2} / 10 题`);
    }
  }

  await expect(page.locator('#vsFb')).toContainText('本轮首次答对 10 / 10，获得 3 星');
  expect((await readSoundmarkRatings(page)).vs).toBe(3);
});

test('soundmark rounds score only first attempts and finish at fixed lengths', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay = 0, ...args) =>
      nativeSetTimeout(callback, Math.min(delay, 20), ...args);
    Math.random = () => 0;
  });
  await page.goto('/soundmark/');

  const vowels = new Set(['/e/', '/æ/', '/ʊ/', '/ɑ:/', '/u:/']);
  for (let index = 0; index < 10; index += 1) {
    const target = await page.locator('#vsTarget').textContent();
    const correct = vowels.has(target) ? 'v' : 'c';
    const wrong = correct === 'v' ? 'c' : 'v';
    await domClick(page.locator(`.vs-pick[data-a="${wrong}"]`));
    await expect(page.locator(`.vs-pick[data-a="${wrong}"]`)).toHaveClass(/wrong/);
    await domClick(page.locator(`.vs-pick[data-a="${correct}"]`));
    if (index < 9) {
      await expect(page.locator('#vsFb')).toContainText(`第 ${index + 2} / 10 题`);
    }
  }
  await expect(page.locator('#vsFb')).toContainText('本轮首次答对 0 / 10，获得 0 星');

  await domClick(page.locator('.gtab[data-g="g1"]'));
  for (let round = 1; round <= 5; round += 1) {
    await domClick(page.locator('#g1Opts [data-sym="i:"]'));
    await expect(page.locator('#g1Opts [data-sym="i:"]')).toHaveClass(/wrong/);
    await domClick(page.locator('#g1Opts [data-sym="ɪ"]'));
    if (round < 5) {
      await expect(page.locator('#g1Score')).toHaveText(`本关：${round} / 5`);
      await expect(page.locator('#g1Fb')).toHaveText('');
    }
  }
  await expect(page.locator('#g1Score')).toHaveText('本轮完成 · 获得 0 星');

  await domClick(page.locator('.gtab[data-g="g2"]'));
  await domClick(page.locator('#g2Next'));
  expect(await page.evaluate(() => Math.random())).toBe(0);
  for (let round = 1; round <= 5; round += 1) {
    const wrongClass = await page.locator('#g2Opts [data-w="sheep"]').evaluate(element => {
      element.click();
      return element.className;
    });
    expect(wrongClass).toMatch(/wrong/);
    await domClick(page.locator('#g2Opts [data-w="ship"]'));
    if (round < 5) {
      await expect(page.locator('#g2Score')).toHaveText(`本关：${round} / 5`);
      await expect(page.locator('#g2Fb')).toHaveText('');
    }
  }
  await expect(page.locator('#g2Score')).toHaveText('本轮完成 · 获得 0 星');

  await domClick(page.locator('.gtab[data-g="g3"]'));
  for (let round = 1; round <= 5; round += 1) {
    await domClick(page.locator('#g3Opts .g-opt', { hasText: 'feet' }));
    await expect(page.locator('#g3Opts .g-opt', { hasText: 'feet' })).toHaveClass(/wrong/);
    await domClick(page.locator('#g3Opts .g-opt', { hasText: 'fish' }));
    if (round < 5) {
      await expect(page.locator('#g3Score')).toHaveText(`本关：${round} / 5`);
      await expect(page.locator('#g3Fb')).toHaveText('');
    }
  }
  await expect(page.locator('#g3Score')).toHaveText('本轮完成 · 获得 0 星');

  const ratings = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:soundmark:progress:v2')).ratings
  );
  expect(ratings).toEqual({ vs: 0, g1: 0, g2: 0, g3: 0 });
  await expect(page.locator('#starCount')).toHaveText('0');
});
