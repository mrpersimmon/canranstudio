'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';

test('first persisted stage completion reveals once, blocks event-through, and closes anywhere after the gate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lesson49/');

  await page.evaluate(() => window.eval('award("l1", 1)'));
  const reveal = page.locator('.growth-reveal');
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveAttribute('role', 'dialog');
  await expect(reveal).toContainText('红白遮阳棚');
  await expect(reveal).toContainText('肉店挂上了红白遮阳棚');
  await expect(reveal.locator('button')).toHaveCount(0);
  await expect(reveal.locator('.growth-reveal__layer')).toHaveCount(2);
  await expect(reveal.locator('.growth-reveal__layer--new')).toHaveAttribute(
    'src', '/assets/adventure-map/lesson49/growth-01-awning.png'
  );
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await reveal.click({ force: true, position: { x: 4, y: 4 } });
  await expect(reveal).toBeVisible();
  await page.waitForTimeout(720);
  await reveal.click({ force: true, position: { x: 4, y: 4 } });
  await expect(reveal).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

  const stored = await page.evaluate(key => ({
    profile: JSON.parse(localStorage.getItem(key)),
    progress: JSON.parse(localStorage.getItem('canran:l49:progress:v2'))
  }), PROFILE_KEY);
  expect(stored.progress.ratings.l1).toBe(1);
  expect(stored.profile.completedStages.lesson49).toEqual(['l1']);
  expect(stored.profile.courseRevealSeen.lesson49).toEqual(['l1']);
  expect(stored.profile.pendingMapChanges.lesson49).toEqual(['l1']);

  await page.evaluate(() => window.eval('award("l1", 3)'));
  await expect(reveal).toBeHidden();
  await page.reload();
  await expect(page.locator('.growth-reveal')).toBeHidden();
});

test('fifth stage adds the completion stamp and souvenir, then the map shows one final summary', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 0 }
    }));
  });
  await page.goto('/lesson49/');

  await page.evaluate(() => window.eval('award("l5", 1)'));
  const reveal = page.locator('.growth-reveal');
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveClass(/growth-reveal--final/);
  await expect(reveal.locator('.growth-reveal__stamp')).toHaveText('地点完成');
  await expect(reveal.locator('.growth-reveal__souvenir')).toContainText('永久纪念 · 食物篮子');
  await expect(reveal.locator('.growth-reveal__layer')).toHaveCount(6);

  await page.waitForTimeout(720);
  await page.keyboard.press('Escape');
  await expect(reveal).toBeHidden();
  await page.locator('a[href="/?district=first-book-49-60&focus=lesson49"]').first().click();

  await expect(page.locator('#currentDistrict')).toBeVisible();
  await expect(page.locator('#mapUpdateToast')).toContainText('地点完成');
  await expect(page.locator('[data-location-id="lesson49"] [data-souvenir-id="food-basket"]')).toBeVisible();
  await expect(page.locator('[data-location-id="lesson49"] [data-landmark-layer="growth"]')).toHaveCount(5);
  await expect(page.locator('#mapUpdateToast')).toBeHidden({ timeout: 4_000 });
  await page.reload();
  await expect(page.locator('#mapUpdateToast')).toBeHidden();
});

test('image failures and rotation keep a readable, full-screen, dismissible reveal', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('**/assets/adventure-map/lesson49/**', route => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lesson49/');
  await page.evaluate(() => window.eval('award("l1", 1)'));

  const reveal = page.locator('.growth-reveal');
  await expect(reveal).toBeVisible();
  await expect(reveal).toContainText('肉店挂上了红白遮阳棚');
  await page.setViewportSize({ width: 1024, height: 768 });
  const box = await reveal.boundingBox();
  expect(box).toEqual({ x: 0, y: 0, width: 1024, height: 768 });
  await expect.poll(() => reveal.locator('img[hidden]').count()).toBeGreaterThanOrEqual(1);
  await page.waitForTimeout(720);
  await page.keyboard.press('Enter');
  await expect(reveal).toBeHidden();
  expect(pageErrors).toEqual([]);
});

test('unwritable storage never claims permanent growth but leaves the course usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'setItem', {
      configurable: true,
      value() { throw new DOMException('blocked', 'QuotaExceededError'); }
    });
  });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/lesson49/');
  await page.evaluate(() => window.eval('award("l1", 1)'));

  await expect(page.locator('.growth-reveal')).toBeHidden();
  await expect(page.locator('#l1')).toBeAttached();
  expect(pageErrors).toEqual([]);
});

test('the same runtime respects the soundmark side quest four-stage contract', async ({ page }) => {
  await page.goto('/soundmark/');
  await page.evaluate(() => window.eval('awardSoundmark("vs", 1)'));

  const reveal = page.locator('.growth-reveal');
  await expect(reveal).toBeVisible();
  await expect(reveal.locator('.growth-reveal__stage')).toHaveText('第 1 / 4 处成长');
  await expect(reveal).toContainText('元音水晶环');
  await expect(reveal).not.toHaveClass(/growth-reveal--final/);
  await page.waitForTimeout(720);
  await reveal.click({ position: { x: 4, y: 4 } });
  await expect(reveal).toBeHidden();
});
