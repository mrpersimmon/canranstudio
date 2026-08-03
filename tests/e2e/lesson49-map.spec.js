'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const L49_PROGRESS_KEY = 'canran:l49:progress:v2';

async function finishRealListeningStage(page) {
  await page.locator('#lgStartBtn').click();
  for (let round = 0; round < 8; round += 1) {
    const answer = await page.evaluate(() => window.eval('LG.cur.en'));
    await page.locator('#lgOpts .opt-btn').filter({ hasText: answer }).evaluate(button => button.click());
    await expect.poll(() => page.evaluate(() => window.eval('LG.round')), { timeout: 5000 })
      .toBe(round + 1);
  }
  await expect(page.locator('#lgResult')).toBeVisible({ timeout: 2500 });
}

test('Lesson 49 recommendation, real-stage growth, souvenir persistence, and restart form one loop', async ({ page }) => {
  test.setTimeout(90_000);

  await page.addInitScript(({ profileKey, progressKey }) => {
    // Voice discovery can block macOS headless Chromium for tens of seconds and is unrelated to map progress.
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [],
        addEventListener: () => {},
        removeEventListener: () => {},
        speak: utterance => queueMicrotask(() => utterance.onend?.()),
        cancel: () => {}
      }
    });
    if (sessionStorage.getItem('lesson49-map-seeded') === 'yes') return;
    localStorage.setItem(progressKey, JSON.stringify({
      version: 2,
      ratings: { l1: 0, l2: 1, l3: 0, l4: 0, l5: 0 }
    }));
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      completedStages: { lesson49: ['l2'] }
    }));
    sessionStorage.setItem('lesson49-map-seeded', 'yes');
  }, { profileKey: PROFILE_KEY, progressKey: L49_PROGRESS_KEY });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const recommendation = page.locator('#districtRecommendation');
  await expect(recommendation).toBeVisible();
  await expect(recommendation).toContainText('推荐继续');
  await expect(recommendation).toContainText('1 / 5');
  await expect(recommendation.getByRole('link', { name: /推荐继续.*LESSON 49.*肉店大冒险.*1 \/ 5/ })).toBeVisible();

  const landmark = page.locator('[data-map-lesson="49"]');
  await expect(landmark.locator('[data-landmark-layer]')).toHaveCount(1);
  await expect(landmark.locator('[data-landmark-state="growth-1"]')).toBeVisible();
  await expect(landmark.locator('[data-souvenir-id]')).toHaveCount(0);
  const initialMarkerBox = await landmark.locator('.landmark-stack').boundingBox();
  expect(initialMarkerBox).not.toBeNull();

  await recommendation.getByRole('link', { name: /推荐继续.*LESSON 49.*肉店大冒险/ }).click();
  expect(await page.evaluate(() => location.pathname)).toBe('/lesson49/');
  await finishRealListeningStage(page);
  await page.getByRole('link', { name: '返回世界地图' }).first().click();

  await expect(page.locator('#currentDistrict')).toBeVisible();
  await expect(landmark.locator('[data-landmark-layer]')).toHaveCount(1);
  await expect(landmark.locator('[data-landmark-state="growth-2"]')).toBeVisible();
  const grownMarkerBox = await landmark.locator('.landmark-stack').boundingBox();
  expect(grownMarkerBox.width).toBe(initialMarkerBox.width);
  expect(grownMarkerBox.height).toBe(initialMarkerBox.height);
  const profileAfterStage = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), PROFILE_KEY);
  expect(profileAfterStage.completedStages.lesson49).toEqual(['l1', 'l2']);

  await page.evaluate(({ profileKey, progressKey }) => {
    localStorage.setItem(progressKey, JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      completedStages: { lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'] }
    }));
  }, { profileKey: PROFILE_KEY, progressKey: L49_PROGRESS_KEY });
  await page.reload();

  await expect(landmark.locator('[data-landmark-layer]')).toHaveCount(1);
  await expect(landmark.locator('[data-landmark-state="growth-5"]')).toBeVisible();
  await expect(landmark.locator('[data-souvenir-id="food-basket"]')).toBeVisible();
  await expect(page.locator('#districtRecommendation')).toContainText('推荐出发');
  await expect(page.locator('#districtRecommendation')).toContainText('LESSON 51');
  await expect(landmark.getByRole('link')).toHaveAccessibleName(/地点完成.*5 \/ 5.*永久纪念.*食物篮子/);
  const finalMarkerBox = await landmark.locator('.landmark-stack').boundingBox();
  expect(finalMarkerBox.width).toBe(initialMarkerBox.width);
  expect(finalMarkerBox.height).toBe(initialMarkerBox.height);
  await expect.poll(() => landmark.locator('[data-landmark-layer]').evaluateAll(images => (
    images.map(image => [image.naturalWidth, image.naturalHeight])
  ))).toEqual([[1024, 1024]]);
  await expect.poll(() => landmark.locator('[data-souvenir-id] img').evaluate(image => (
    [image.naturalWidth, image.naturalHeight]
  ))).toEqual([1024, 1024]);
  await expect.poll(() => recommendation.locator('img').evaluate(image => (
    [image.naturalWidth, image.naturalHeight]
  ))).toEqual([1024, 1024]);
  await page.reload();
  await expect(landmark.locator('[data-souvenir-id="food-basket"]')).toBeVisible();

  await page.getByRole('button', { name: '设备冒险设置' }).click();
  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '确认重开', exact: true }).click();

  await expect(page.locator('#worldOverview')).toBeVisible();
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  await expect(landmark.locator('[data-landmark-layer]')).toHaveCount(1);
  await expect(landmark.locator('[data-landmark-state="base"]')).toBeVisible();
  await expect(landmark.locator('[data-souvenir-id]')).toHaveCount(0);
  await expect(page.locator('#districtRecommendation')).toContainText('推荐出发');
});
