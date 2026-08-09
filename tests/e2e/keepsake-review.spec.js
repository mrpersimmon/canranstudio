'use strict';

const { test, expect } = require('@playwright/test');

const REVIEW_PATH = '/poc/keepsake-review/';

test('keepsake review restores the approved stage-two state without learner persistence', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('keepsake-review-sentinel', 'untouched'));
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto(`${REVIEW_PATH}?state=stage2`);

  expect(response.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('[data-keepsake-root]')).toHaveAttribute('data-state', 'stage2');
  await expect(page.locator('[data-stage-slot="1"]')).toHaveAttribute('data-badge-state', 'earned');
  await expect(page.locator('[data-stage-slot="2"]')).toHaveAttribute('data-badge-state', 'current');
  await expect(page.locator('[data-stage-slot="3"]')).toHaveAttribute('data-badge-state', 'locked');
  await expect(page.locator('[data-badge="final"]')).toHaveAttribute('data-badge-state', 'locked');
  await expect(page.locator('[data-star-value]')).toHaveText('8/12');
  await expect(page.locator('[data-footprint-value]')).toHaveText('4/6');
  expect(await page.evaluate(() => localStorage.getItem('keepsake-review-sentinel'))).toBe('untouched');
});

test('the earned badge uses the authored story ribbon and inscription plaque', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${REVIEW_PATH}?state=stage2`);

  const earnedBadge = page.locator('[data-stage-slot="1"]');
  const badgeArt = earnedBadge.locator('.badge-art');
  const earnedFrame = earnedBadge.locator('[data-earned-frame]');

  await expect(earnedFrame).toBeVisible();
  await expect(earnedFrame).toHaveAttribute('src', /earned-badge-frame-v2-768\.webp$/);
  await expect(earnedBadge.getByText('已获得', { exact: true })).toBeVisible();
  await expect(earnedBadge.locator('.earned-inscription')).toHaveText('丰盛餐桌的奉献');
  await expect(earnedBadge.locator('.earned-inscription')).toBeVisible();

  const geometry = await page.evaluate(() => {
    const art = document.querySelector('[data-stage-slot="1"] .badge-art').getBoundingClientRect();
    const frame = document.querySelector('[data-stage-slot="1"] [data-earned-frame]').getBoundingClientRect();
    return {
      centerDelta: Math.abs((art.left + art.width / 2) - (frame.left + frame.width / 2)),
      frameWidthRatio: frame.width / art.width,
      overlapsBadgeEdge: frame.top < art.bottom
    };
  });

  expect(geometry.centerDelta).toBeLessThan(2);
  expect(geometry.frameWidthRatio).toBeGreaterThan(0.72);
  expect(geometry.frameWidthRatio).toBeLessThan(0.94);
  expect(geometry.overlapsBadgeEdge).toBe(true);
});

test('the current badge opens a useful clue and every click-away closes it', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?state=stage2`);

  await page.getByRole('button', { name: '四季罗盘纪念章，当前目标' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('本城挑战星 8/12');
  await expect(page.getByRole('dialog')).toContainText('地标足迹 4/6');

  await page.getByRole('button', { name: '关闭纪念章说明' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('review controls can walk every stage and the final crest awards automatically', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?state=stage2`);

  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/state=stage3/);
  await expect(page.locator('[data-stage-slot="3"]')).toHaveAttribute('data-badge-state', 'current');

  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/state=complete/);
  await expect(page.locator('[data-badge="final"]')).toHaveAttribute('data-badge-state', 'earned');
  await expect(page.locator('[data-final-progress]')).toHaveText('地标落成 12/12');
});

for (const viewport of [
  { name: 'iPhone 12', width: 390, height: 844, spread: false },
  { name: 'Huawei large phone', width: 466, height: 980, spread: false },
  { name: 'portrait tablet', width: 768, height: 1024, spread: false },
  { name: 'desktop spread', width: 1440, height: 1000, spread: true }
]) {
  test(`${viewport.name} keeps one fixed, distortion-free collection surface`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${REVIEW_PATH}?state=stage2`);

    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      innerWidth,
      innerHeight,
      spread: getComputedStyle(document.querySelector('.book-spine')).display !== 'none',
      images: [...document.images].map(image => ({
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight
      }))
    }));

    expect(metrics.scrollWidth).toBe(metrics.innerWidth);
    expect(metrics.scrollHeight).toBe(metrics.innerHeight);
    expect(metrics.spread).toBe(viewport.spread);
    expect(metrics.images.every(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0))
      .toBe(true);
  });
}
