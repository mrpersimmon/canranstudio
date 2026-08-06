'use strict';

const { test, expect } = require('@playwright/test');

const REVIEW_PATH = '/poc/landmark-review/';

test('the noindex review route restores URL state without touching learner storage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('review-sentinel', 'local');
    sessionStorage.setItem('review-sentinel', 'session');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  const response = await page.goto(
    `${REVIEW_PATH}?location=lesson51&stage=3&review=art&viewport=huawei`
  );

  expect(response.status()).toBe(200);
  expect(errors).toEqual([]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('[data-location-picker] option')).toHaveCount(7);
  await expect(page.locator('[data-location-picker]')).toHaveValue('lesson51');
  await expect(page.locator('[data-stage-button][aria-pressed="true"]')).toHaveText('3');
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /lesson51\/states\/state-3\.png/);

  expect(await page.evaluate(() => ({
    local: Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])),
    session: Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])),
    cookie: document.cookie
  }))).toEqual({
    local: { 'review-sentinel': 'local' },
    session: { 'review-sentinel': 'session' },
    cookie: ''
  });
});

test('stage changes are instant, replace the URL, and press-hold reveals only the previous state', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson49&stage=1&review=art&viewport=huawei`);

  await page.getByRole('button', { name: '阶段 4' }).click();
  await expect(page).toHaveURL(/location=lesson49&stage=4&review=art&viewport=huawei/);
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /state-4\.png/);

  const artboard = page.locator('[data-artboard]');
  await artboard.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', isPrimary: true });
  await expect(artboard).toHaveAttribute('data-previewing-previous', 'true');
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /state-3\.png/);
  await expect(page).toHaveURL(/stage=4/);

  await artboard.dispatchEvent('pointercancel', { pointerId: 1, pointerType: 'touch', isPrimary: true });
  await expect(artboard).toHaveAttribute('data-previewing-previous', 'false');
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /state-4\.png/);

  await page.reload();
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /state-4\.png/);
});

test('placement view exists only for the official route page and keeps other landmarks at state zero', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=placement&viewport=tablet`);

  await expect(page.locator('[data-placement-map]')).toBeVisible();
  await expect(page.locator('[data-placement-location]')).toHaveCount(4);
  await expect(page.locator('[data-placement-location][data-location-id="lesson51"]')).toHaveAttribute('data-stage', '3');
  for (const id of ['lesson49', 'lesson50', 'lesson52']) {
    await expect(page.locator(`[data-placement-location][data-location-id="${id}"]`))
      .toHaveAttribute('data-stage', '0');
  }

  await page.locator('[data-location-picker]').selectOption('lesson53');
  await expect(page).toHaveURL(/location=lesson53&stage=3&review=art&viewport=tablet/);
  await expect(page.locator('[data-review-button="placement"]')).toHaveCount(0);
  await expect(page.locator('[data-placement-map]')).toHaveCount(0);
});

test('all three observation sizes stay inside the page at phone and tablet widths', async ({ page }) => {
  for (const viewport of [
    { width: 466, height: 980 },
    { width: 768, height: 1024 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${REVIEW_PATH}?location=lesson51&stage=5&review=art&viewport=huawei`);

    for (const mode of ['huawei', 'tablet', 'master']) {
      await page.locator(`[data-viewport-button="${mode}"]`).click();
      await expect(page.locator('[data-review-frame]')).toHaveAttribute('data-viewport', mode);
      expect(await page.evaluate(() => document.documentElement.scrollWidth))
        .toBe(await page.evaluate(() => document.documentElement.clientWidth));
      const imageRatio = await page.locator('[data-current-art]').evaluate(image => {
        const box = image.getBoundingClientRect();
        return box.width / box.height;
      });
      expect(imageRatio).toBeCloseTo(1, 2);
    }
  }
});

test('the child atlas does not expose a link to the review bench', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="landmark-review"]')).toHaveCount(0);
});

test('art review loads only the selected state and its adjacent idle previews', async ({ page }) => {
  const stateRequests = [];
  page.on('request', request => {
    const match = request.url().match(/adventure-map\/(lesson\d+|soundmark)\/states\/state-(\d+)/);
    if (match) stateRequests.push({ location: match[1], stage: Number(match[2]) });
  });

  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=art&viewport=huawei`);
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /state-3\.png/);
  await page.waitForTimeout(350);

  expect([...new Set(stateRequests.map(request => request.location))]).toEqual(['lesson51']);
  expect([...new Set(stateRequests.map(request => request.stage))].sort()).toEqual([2, 3, 4]);
});
