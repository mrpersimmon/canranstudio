'use strict';

const { test, expect } = require('@playwright/test');

const KEY = 'canran:l51:progress:v2';
const IDS = ['l1', 'l2', 'l3', 'l4', 'l5'];
const MONTH_TO_SEASON = {
  march: 'spring', april: 'spring', may: 'spring', june: 'summer',
  july: 'summer', august: 'summer', september: 'autumn', october: 'autumn',
  november: 'autumn', december: 'winter', january: 'winter', february: 'winter'
};
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

async function storedRatings(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)).ratings, KEY);
}

async function completeListeningRun(page, wrongFirstCount) {
  for (let item = 0; item < 5; item += 1) {
    const options = page.locator('#lgOpts .lg-opt');
    await expect(options).toHaveCount(4);
    if (item < wrongFirstCount) await options.nth(1).click();
    await options.nth(0).click();
    if (item < 4) {
      await expect(page.locator('#lgNext')).toBeEnabled();
      await page.locator('#lgNext').click();
    }
  }
}

async function completeMonths(page, wrongFirstCount) {
  const months = await page.locator('#monthPool .mchip').evaluateAll(
    chips => chips.map(chip => chip.dataset.m)
  );
  expect(months).toHaveLength(12);
  for (const [index, month] of months.entries()) {
    await page.locator(`.mchip[data-m="${month}"]`).click();
    const correct = MONTH_TO_SEASON[month];
    if (index < wrongFirstCount) {
      const wrong = SEASONS.find(season => season !== correct);
      await page.locator(`.sbox[data-s="${wrong}"]`).click();
    }
    await page.locator(`.sbox[data-s="${correct}"]`).click();
  }
}

async function completeFrequencyRun(page, wrongFirstCount) {
  const cards = page.locator('#freqCards .fcard');
  await expect(cards).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    const card = cards.nth(index);
    const correct = await card.getAttribute('data-lv');
    await card.click();
    if (index < wrongFirstCount) {
      const wrong = ['always', 'often', 'sometimes'].find(level => level !== correct);
      await page.locator(`.rung[data-f="${wrong}"]`).click();
    }
    await page.locator(`.rung[data-f="${correct}"]`).click();
  }
}

async function completeQuiz(page, wrongFirstCount) {
  for (let question = 0; question < 8; question += 1) {
    const answer = await page.evaluate(() => {
      const text = document.getElementById('qQ').textContent;
      return QUIZ.find(item => item.q === text).a;
    });
    const options = page.locator('#qOpts .q-opt');
    const optionCount = await options.count();
    if (question < wrongFirstCount) await options.nth((answer + 1) % optionCount).click();
    await options.nth(answer).click();
    if (question < 7) {
      await expect(page.locator('#qNext')).toBeEnabled();
      await page.locator('#qNext').click();
    }
  }
}

test('Lesson 51 resets a negative legacy scalar without crashing', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('l51-stars-v1', '-1'));
  await page.goto('/lesson51/');
  expect(errors).toEqual([]);
  expect(await storedRatings(page)).toEqual(Object.fromEntries(IDS.map(id => [id, 0])));
  expect(await page.evaluate(() => localStorage.getItem('l51-stars-v1'))).toBeNull();
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#btnPrint')).toBeDisabled();
});

test('Lesson 51 repairs corrupt v2 progress', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(key => {
    localStorage.setItem(key, JSON.stringify({
      version: 2,
      ratings: { l1: -1, l2: 999999, l3: '3', l4: [], l5: null }
    }));
  }, KEY);
  await page.goto('/lesson51/');
  expect(errors).toEqual([]);
  expect(await storedRatings(page)).toEqual({ l1: 0, l2: 3, l3: 0, l4: 0, l5: 0 });
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 repairs invalid JSON', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, '{not-json'), KEY);
  await page.goto('/lesson51/');
  expect(await storedRatings(page)).toEqual(Object.fromEntries(IDS.map(id => [id, 0])));
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('Lesson 51 survives blocked storage', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Storage.prototype[method] = () => { throw new DOMException('storage blocked', 'SecurityError'); };
    }
  });
  await page.goto('/lesson51/');
  expect(errors).toEqual([]);
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#btnPrint')).toBeDisabled();
});

test('Lesson 51 certificate cannot be forged and eligible printing is real', async ({ page }) => {
  await page.addInitScript(key => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify({ version: 2, ratings: { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 } }));
    }
    window.__printCalls = 0;
    window.print = () => { window.__printCalls += 1; };
  }, KEY);
  await page.goto('/lesson51/');
  await page.locator('#certName').fill('测试学生');
  await page.evaluate(() => { document.getElementById('btnPrint').disabled = false; });
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(() => window.__printCalls)).toBe(0);
  await page.evaluate(key => localStorage.setItem(key, JSON.stringify({
    version: 2, ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
  })), KEY);
  await page.reload();
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(() => window.__printCalls)).toBe(0);
  await page.locator('#certName').fill('测试学生');
  await page.locator('#btnPrint').click();
  expect(await page.evaluate(() => window.__printCalls)).toBe(1);
  await expect(page.locator('#certStars')).toHaveText(/^★{5}☆{10}$/);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#cert')).toBeVisible();
  await expect(page.locator('#coursenav')).toBeHidden();
  await expect(page.locator('#btnPrint')).toBeHidden();
});

test('Lesson 51 quiz stores one historical rating instead of additive stars', async ({ page }) => {
  await page.goto('/lesson51/');
  await completeQuiz(page, 1);
  expect((await storedRatings(page)).l5).toBe(2);
  await page.reload();
  await completeQuiz(page, 0);
  expect((await storedRatings(page)).l5).toBe(3);
  await page.reload();
  await completeQuiz(page, 8);
  expect((await storedRatings(page)).l5).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 listening ratings improve without accumulating', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/lesson51/');
  await completeListeningRun(page, 2);
  expect((await storedRatings(page)).l1).toBe(2);
  await page.reload();
  await completeListeningRun(page, 0);
  expect((await storedRatings(page)).l1).toBe(3);
  await page.reload();
  await completeListeningRun(page, 5);
  expect((await storedRatings(page)).l1).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 month ratings improve without accumulating', async ({ page }) => {
  await page.goto('/lesson51/');
  await completeMonths(page, 3);
  expect((await storedRatings(page)).l3).toBe(2);
  await page.reload();
  await completeMonths(page, 0);
  expect((await storedRatings(page)).l3).toBe(3);
  await page.reload();
  await completeMonths(page, 12);
  expect((await storedRatings(page)).l3).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 51 full theater playback awards level 2 and unlocks the certificate gate', async ({ page }) => {
  await page.addInitScript(key => {
    localStorage.setItem(key, JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 0, l3: 1, l4: 1, l5: 1 }
    }));
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, _delay, ...args) => nativeSetTimeout(callback, 0, ...args);
    window.Audio = class {
      addEventListener(type, callback) {
        if (type === 'ended') this.onended = callback;
      }
      removeEventListener(type, callback) {
        if (type === 'ended' && this.onended === callback) this.onended = null;
      }
      play() {
        queueMicrotask(() => this.onended && this.onended());
        return Promise.resolve();
      }
      pause() {}
    };
  }, KEY);
  await page.goto('/lesson51/');
  await expect(page.locator('#btnPrint')).toBeDisabled();
  await page.locator('#playAll').click();
  await expect.poll(async () => (await storedRatings(page)).l2).toBe(3);
  await expect(page.locator('#btnPrint')).toBeEnabled();
});

test('Lesson 51 ordinary speech and Stop cannot complete an interrupted theater run', async ({ page }) => {
  await page.addInitScript(key => {
    localStorage.setItem(key, JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 0, l3: 1, l4: 1, l5: 1 }
    }));
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, _delay, ...args) => nativeSetTimeout(callback, 0, ...args);
    let audioCount = 0;
    window.Audio = class {
      constructor() { this.id = audioCount += 1; }
      addEventListener(type, callback) {
        if (type === 'ended') this.onended = callback;
      }
      removeEventListener(type, callback) {
        if (type === 'ended' && this.onended === callback) this.onended = null;
      }
      play() {
        if (this.id > 2) queueMicrotask(() => this.onended && this.onended());
        return Promise.resolve();
      }
      pause() {
        if (this.id === 1) this.onended && this.onended();
      }
    };
  }, KEY);
  await page.goto('/lesson51/');
  await page.locator('#playAll').click();
  await page.locator('#heroQ').click();
  await page.waitForTimeout(100);
  expect((await storedRatings(page)).l2).toBe(0);
  await expect(page.locator('#btnPrint')).toBeDisabled();

  await page.reload();
  await page.locator('#playAll').click();
  await page.locator('#stopAll').click();
  await page.waitForTimeout(100);
  expect((await storedRatings(page)).l2).toBe(0);
  await expect(page.locator('#btnPrint')).toBeDisabled();
});

test('Lesson 51 preserves six frequency sources while rendering one card per category', async ({ page }) => {
  await page.goto('/lesson51/');
  expect(await page.evaluate(() => FREQ)).toEqual([
    ['The sun shines every day.', 'always'], ["It's always hot in July.", 'always'],
    ["It's often windy in March.", 'often'], ["It's often cold in November.", 'often'],
    ['It rains sometimes.', 'sometimes'], ['It snows sometimes.', 'sometimes']
  ]);
  await expect(page.locator('#freqCards .fcard')).toHaveCount(3);
  await expect(page.locator('#freqCards .fcard[data-lv="always"]')).toHaveCount(1);
  await expect(page.locator('#freqCards .fcard[data-lv="often"]')).toHaveCount(1);
  await expect(page.locator('#freqCards .fcard[data-lv="sometimes"]')).toHaveCount(1);
});

test('Lesson 51 selects either frequency representative while rendering one card per category', async ({ page }) => {
  const cards = async () => page.locator('#freqCards .fcard').evaluateAll(items =>
    items.map(item => [item.dataset.lv, item.textContent.trim()])
  );
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/lesson51/');
  await expect(page.locator('#freqCards .fcard')).toHaveCount(3);
  expect(await cards()).toEqual([
    ['always', '「The sun shines every day.」→ 送到哪个台阶？'],
    ['often', '「It\'s often windy in March.」→ 送到哪个台阶？'],
    ['sometimes', '「It rains sometimes.」→ 送到哪个台阶？']
  ]);
  await page.addInitScript(() => { Math.random = () => 0.999999; });
  await page.reload();
  await expect(page.locator('#freqCards .fcard')).toHaveCount(3);
  expect(await cards()).toEqual([
    ['always', '「It\'s always hot in July.」→ 送到哪个台阶？'],
    ['often', '「It\'s often cold in November.」→ 送到哪个台阶？'],
    ['sometimes', '「It snows sometimes.」→ 送到哪个台阶？']
  ]);
  await expect(page.locator('#freqCards .fcard[data-lv="always"]')).toHaveCount(1);
  await expect(page.locator('#freqCards .fcard[data-lv="often"]')).toHaveCount(1);
  await expect(page.locator('#freqCards .fcard[data-lv="sometimes"]')).toHaveCount(1);
});

test('Lesson 51 frequency ratings improve without accumulating', async ({ page }) => {
  await page.goto('/lesson51/');
  await completeFrequencyRun(page, 1);
  expect((await storedRatings(page)).l4).toBe(2);
  await page.reload();
  await completeFrequencyRun(page, 0);
  expect((await storedRatings(page)).l4).toBe(3);
  await page.reload();
  await completeFrequencyRun(page, 3);
  expect((await storedRatings(page)).l4).toBe(3);
  await expect(page.locator('#starCount')).toHaveText('3');
});
