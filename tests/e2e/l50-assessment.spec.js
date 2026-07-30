'use strict';

const { test, expect } = require('@playwright/test');

async function installInstantAudio(page) {
  await page.addInitScript(() => {
    window.Audio = class FakeAudio extends EventTarget {
      constructor(src) {
        super();
        this.src = src;
        this.currentTime = 0;
      }
      play() {
        setTimeout(() => this.dispatchEvent(new Event('ended')), 0);
        return Promise.resolve();
      }
      pause() {}
    };
  });
}

async function globalValue(page, expression) {
  return page.evaluate(code => window.eval(code), expression);
}

test('final quiz highlights the semantic correct answer after shuffle', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.locator('#quizStartBtn').click();
  const correct = await globalValue(page, 'QUIZ[QZ.idx].a');
  const wrong = correct === 0 ? 1 : 0;

  await page.locator(`#quizOpts [data-option-id="${wrong}"]`).click();

  await expect(page.locator(`#quizOpts [data-option-id="${correct}"]`)).toHaveClass(/good/);
});

test('listen challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.evaluate(() => startListen());
  const correct = await globalValue(page, 'LG.cur.en');

  await page.locator('#lgOpts .opt-btn').evaluateAll((buttons, answer) => {
    buttons.find(button => button.dataset.en !== answer).click();
  }, correct);
  await expect.poll(() => globalValue(page, 'LG.lock')).toBe(false);
  await page.locator(`#lgOpts [data-en="${correct}"]`).click();

  await expect.poll(() => globalValue(page, 'LG.round')).toBe(1);
  expect(await globalValue(page, 'LG.score')).toBe(0);
  await expect.poll(() => globalValue(page, 'LG.lock')).toBe(false);
  const nextCorrect = await globalValue(page, 'LG.cur.en');
  await page.locator(`#lgOpts [data-en="${nextCorrect}"]`).click();

  await expect.poll(() => globalValue(page, 'LG.round')).toBe(2);
  expect(await globalValue(page, 'LG.score')).toBe(1);
});

test('feeding challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.evaluate(() => resetFeed());
  const correct = await globalValue(page, 'TABLE[FD.idx].like');

  await page.locator(correct ? '#feedNo' : '#feedYes').click();
  await expect.poll(() => globalValue(page, 'FD.lock')).toBe(false);
  await page.locator(correct ? '#feedYes' : '#feedNo').click();

  await expect.poll(() => globalValue(page, 'FD.idx')).toBe(1);
  expect(await globalValue(page, 'FD.score')).toBe(0);
  const nextCorrect = await globalValue(page, 'TABLE[FD.idx].like');
  await page.locator(nextCorrect ? '#feedYes' : '#feedNo').click();

  await expect.poll(() => globalValue(page, 'FD.idx')).toBe(2);
  expect(await globalValue(page, 'FD.score')).toBe(1);
});

test('sorting-pot challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.locator('.tabbtn[data-tab="t3"]').click();
  await page.evaluate(() => resetPot());
  const correct = await globalValue(page, 'POT.order[POT.idx].pot');

  await page.locator('.pot').evaluateAll((buttons, answer) => {
    buttons.find(button => button.dataset.pot !== answer).click();
  }, correct);
  await expect.poll(() => globalValue(page, 'POT.lock')).toBe(false);
  await page.locator(`.pot[data-pot="${correct}"]`).click();

  await expect.poll(() => globalValue(page, 'POT.idx')).toBe(1);
  expect(await globalValue(page, 'POT.score')).toBe(0);
  const nextCorrect = await globalValue(page, 'POT.order[POT.idx].pot');
  await page.locator(`.pot[data-pot="${nextCorrect}"]`).click();

  await expect.poll(() => globalValue(page, 'POT.idx')).toBe(2);
  expect(await globalValue(page, 'POT.score')).toBe(1);
});

test('do-does challenge solves a retry without adding first-try score', async ({ page }) => {
  await installInstantAudio(page);
  await page.goto('/lesson50/');
  await page.evaluate(() => startDD());
  const correct = await globalValue(page, 'DD.order[DD.idx].does');

  await page.locator(correct ? '#ddDo' : '#ddDoes').click();
  await expect.poll(() => globalValue(page, 'DD.lock')).toBe(false);
  await page.locator(correct ? '#ddDoes' : '#ddDo').click();

  await expect.poll(() => globalValue(page, 'DD.idx')).toBe(1);
  expect(await globalValue(page, 'DD.score')).toBe(0);
  const nextCorrect = await globalValue(page, 'DD.order[DD.idx].does');
  await page.locator(nextCorrect ? '#ddDoes' : '#ddDo').click();

  await expect.poll(() => globalValue(page, 'DD.idx')).toBe(2);
  expect(await globalValue(page, 'DD.score')).toBe(1);
});

test('legacy Lesson 50 ratings migrate and clamp without a page error', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('l50-stars-v1', JSON.stringify({
      l1: -1,
      l2: 8,
      l3: '2.9',
      l4: null,
      l5: 1
    }));
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/lesson50/');

  expect(errors).toEqual([]);
  await expect(page.locator('#st-l1')).toHaveText('☆☆☆');
  await expect(page.locator('#st-l2')).toHaveText('★★★');
  await expect(page.locator('#st-l3')).toHaveText('★★☆');
  const stored = await page.evaluate(() => ({
    v2: JSON.parse(localStorage.getItem('canran:l50:progress:v2')),
    legacy: localStorage.getItem('l50-stars-v1')
  }));
  expect(stored.v2).toEqual({
    version: 2,
    ratings: { l1: 0, l2: 3, l3: 2, l4: 0, l5: 1 }
  });
  expect(stored.legacy).toBeNull();
});

test('corrupted v2 Lesson 50 ratings are repaired and persisted', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: {
        l1: -99,
        l2: 999,
        l3: '2.9',
        l4: null,
        l5: []
      }
    }));
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/lesson50/');

  expect(errors).toEqual([]);
  await expect(page.locator('#st-l1')).toHaveText('☆☆☆');
  await expect(page.locator('#st-l2')).toHaveText('★★★');
  await expect(page.locator('#st-l3')).toHaveText('☆☆☆');
  const repaired = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l50:progress:v2'))
  );
  expect(repaired).toEqual({
    version: 2,
    ratings: { l1: 0, l2: 3, l3: 0, l4: 0, l5: 0 }
  });
});

test('all-corrupt v2 Lesson 50 ratings cannot unlock its certificate', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: true, l2: [3], l3: ['2'], l4: '3', l5: [1] }
    }));
  });

  await page.goto('/lesson50/');

  const repaired = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l50:progress:v2'))
  );
  expect(repaired.ratings).toEqual({ l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 });
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#certBtn')).toBeDisabled();
  expect(await globalValue(page, 'canIssueL50Certificate()')).toBe(false);

  await page.locator('#certArea').evaluate(area => area.classList.remove('hidden'));
  await page.locator('#certBtn').evaluate(button => { button.disabled = false; });
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
});

test('invalid v2 Lesson 50 JSON is repaired without interrupting initialization', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l50:progress:v2', '{not-json');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/lesson50/');

  expect(errors).toEqual([]);
  const repaired = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l50:progress:v2'))
  );
  expect(repaired).toEqual({
    version: 2,
    ratings: { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 }
  });
});

test('certificate entry follows final-attempt visibility but cannot bypass eligibility', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 0, l5: 1 }
    }));
  });
  await page.goto('/lesson50/');

  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeDisabled();
  await page.locator('#certBtn').evaluate(button => { button.disabled = false; });
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
});

test('certificate entry stays hidden before the final assessment has a rating', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 0 }
    }));
  });

  await page.goto('/lesson50/');

  await expect(page.locator('#certArea')).toBeHidden();
  expect(await globalValue(page, 'canIssueL50Certificate()')).toBe(false);
});

test('certificate becomes available only after all five levels have ratings', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
  });

  await page.goto('/lesson50/');

  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeEnabled();
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).toBeVisible();
});
