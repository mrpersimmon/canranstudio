'use strict';

const { test, expect } = require('@playwright/test');

async function setLiveRatings(page, ratings) {
  await page.evaluate(value => {
    window.eval(`stars=${JSON.stringify(value)}`);
  }, ratings);
}

test('Lesson 49 repairs legacy ratings and does not crash on negative values', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('l49-stars-v1', JSON.stringify({
      l1: -1,
      l2: '2.9',
      l3: 999,
      l4: null,
      l5: 1
    }));
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/lesson49/');

  expect(errors).toEqual([]);
  await expect(page.locator('#st-l1')).toHaveText('☆☆☆');
  await expect(page.locator('#st-l2')).toHaveText('★★☆');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l49:progress:v2'))
  );
  expect(saved.ratings).toEqual({ l1: 0, l2: 2, l3: 3, l4: 0, l5: 1 });
  await expect(page.locator('#certBtn')).toBeEnabled();
  await expect(page.locator('#certBtn')).toHaveAttribute('data-certificate-state', 'locked');
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
});

test('Lesson 49 rejects all-corrupt v2 ratings before certificate gating', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: true, l2: [3], l3: ['2'], l4: '3', l5: [1] }
    }));
  });

  await page.goto('/lesson49/');

  const repaired = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('canran:l49:progress:v2'))
  );
  expect(repaired.ratings).toEqual({ l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 });
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#certBtn')).toBeEnabled();
  expect(await page.evaluate(() => window.eval('canIssueL49Certificate()'))).toBe(false);

  await page.locator('#certBtn').evaluate(button => {
    button.dataset.certificateState = 'ready';
    button.classList.remove('is-locked');
  });
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
  await expect(page.locator('[data-certificate-gate]')).toBeVisible();
});

test('Lesson 49 keeps its locked certificate entry visible from zero stars', async ({ page }) => {
  await page.goto('/lesson49/#l5');
  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeEnabled();
  await expect(page.locator('#certBtn')).toHaveAttribute('data-certificate-state', 'locked');
});

test('Lesson 49 five one-star levels remain locked', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
    version: 2, ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
  })));
  await page.goto('/lesson49/#l5');
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
  await expect(page.locator('[data-certificate-count]')).toHaveText('还差 10 颗星，还有 5 关未满星。');
});

test('Lesson 49 gate guides partial progress and restores focus', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
    version: 2, ratings: { l1: 3, l2: 2, l3: 3, l4: 0, l5: 3 }
  })));
  await page.goto('/lesson49/#l5');

  await page.locator('#certBtn').click();
  await expect(page.locator('[data-certificate-count]')).toHaveText('还差 4 颗星，还有 2 关未满星。');
  await expect(page.locator('[data-certificate-go]')).toHaveText('前往「课文剧场」补满星');
  await expect(page.locator('[data-certificate-go]')).toBeFocused();

  await page.locator('[data-certificate-dismiss]').click();
  await expect(page.locator('[data-certificate-gate]')).toBeHidden();
  await expect(page.locator('#certBtn')).toBeFocused();
  await page.locator('#certBtn').click();
  await page.locator('[data-certificate-go]').click();
  await expect(page).toHaveURL(/#l2$/);
  await expect(page.locator('#l2 h2')).toBeFocused();
});

test('Lesson 49 certificate opens only when all five levels have three stars', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
    version: 2, ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
  })));
  await page.goto('/lesson49/#l5');

  await expect(page.locator('#certBtn')).toHaveAttribute('data-certificate-state', 'ready');
  await expect(page.locator('#certGateMsg')).toHaveText('15/15 颗星已集齐，可以生成证书。');
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).toBeVisible();
});

test('Lesson 49 dialog, save, and print paths recheck live eligibility', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2, ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
    }));
    window.__printCalls = 0;
    window.print = () => { window.__printCalls += 1; };
  });
  await page.goto('/lesson49/#l5');

  const incomplete = { l1: 3, l2: 2, l3: 3, l4: 3, l5: 3 };
  for (const action of ['dialog', 'save', 'print']) {
    await setLiveRatings(page, { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 });
    await page.evaluate(() => window.renderL49CertificateGate());
    await page.locator('#certBtn').click();
    await expect(page.locator('#certModal')).toBeVisible();
    await setLiveRatings(page, incomplete);

    if (action === 'dialog') {
      await page.evaluate(() => window.openL49CertificateDialog());
    } else {
      await page.locator(action === 'save' ? '#certSave' : '#certPrint').click();
    }

    await expect(page.locator('#certModal')).not.toBeVisible();
    await expect(page.locator('[data-certificate-gate]')).toBeVisible();
    await expect(page.locator('[data-certificate-count]')).toHaveText('还差 1 颗星，还有 1 关未满星。');
    await page.locator('[data-certificate-dismiss]').click();
  }
  await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
  expect(await page.evaluate(() => window.__printCalls)).toBe(0);
});
