'use strict';

const { test, expect } = require('@playwright/test');

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
  await expect(page.locator('#certBtn')).toBeDisabled();
  await page.locator('#certBtn').evaluate(button => { button.disabled = false; });
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
  await expect(page.locator('#certBtn')).toBeDisabled();
  expect(await page.evaluate(() => window.eval('canIssueL49Certificate()'))).toBe(false);

  await page.locator('#certArea').evaluate(area => area.classList.remove('hidden'));
  await page.locator('#certBtn').evaluate(button => { button.disabled = false; });
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).not.toBeVisible();
});

test('Lesson 49 certificate requires all five levels', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
  });

  await page.goto('/lesson49/');

  await expect(page.locator('#certArea')).toBeVisible();
  await expect(page.locator('#certBtn')).toBeEnabled();
  await page.locator('#certBtn').click();
  await expect(page.locator('#certModal')).toBeVisible();
});
