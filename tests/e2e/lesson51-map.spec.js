'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const STAGES = ['l1', 'l2', 'l3', 'l4', 'l5'];

async function seedCompletedStages(page, completedStages) {
  await page.evaluate(({ profileKey, stages, allStages }) => {
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      souvenirs: [],
      completedStages: { lesson51: stages }
    }));
    localStorage.setItem('canran:l51:progress:v2', JSON.stringify({
      version: 2,
      ratings: Object.fromEntries(allStages.map(id => [id, stages.includes(id) ? 3 : 0]))
    }));
  }, { profileKey: PROFILE_KEY, stages: completedStages, allStages: STAGES });
}

test('Lesson 51 的旧地图返回地址聚焦课程卡片，各阶段星星和已得纪念物保留', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?district=first-book-49-60&focus=lesson51');
  const card = page.locator('[data-course="lesson51"]');

  for (let completed = 0; completed <= STAGES.length; completed += 1) {
    await seedCompletedStages(page, STAGES.slice(0, completed));
    await page.reload();
    await expect(card).toBeFocused();
    await expect(card.locator('.course-progress')).toHaveText(completed ? `${completed * 3} / 15 颗星` : '');
    await expect(card.locator('img')).toHaveAttribute('src', '/assets/lesson49/icons/map.svg');
    await expect.poll(() => card.locator('img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator('[data-map-lesson], [data-landmark-snapshot]')).toHaveCount(0);

    if (completed === STAGES.length) {
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).souvenirs, PROFILE_KEY))
        .toContain('four-seasons-guide-compass');
    }
  }
});

test('Lesson 51 卡片在手机和平板无溢出，点击进入真实课程并保留进度', async ({ page }) => {
  await page.goto('/?district=first-book-49-60&focus=lesson51');
  await seedCompletedStages(page, STAGES.slice(0, 3));

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 }
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();
    const card = page.locator('[data-course="lesson51"]');
    await expect(card).toBeVisible();
    await expect(card).toContainText('9 / 15 颗星');
    const box = await card.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
  }

  await page.locator('[data-course="lesson51"]').click();
  await expect(page).toHaveURL(/\/lesson51\/$/);
  await expect(page.locator('body')).toContainText('希腊四季之旅');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('canran:l51:progress:v2')).ratings))
    .toEqual({ l1: 3, l2: 3, l3: 3, l4: 0, l5: 0 });
});
