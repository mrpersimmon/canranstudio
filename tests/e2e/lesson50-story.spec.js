'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';

test('direct Lesson 50 entry has a complete standalone opening without a basket', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lesson50/');

  const story = page.locator('#lesson50Story');
  await expect(story).toHaveAttribute('data-story-variant', 'standalone');
  await expect(story).toContainText('一封来自城堡的求助信');
  await expect(story).toContainText('不用准备任何道具');
  await expect(story.locator('img')).toHaveCount(0);
  await expect(page.locator('#storySkip')).toBeHidden();
  await expect(page.getByRole('button', { name: '🚀 开始冒险！' })).toBeVisible();
  await expect(page.locator('#l1')).toBeAttached();
  await expect(page.getByRole('button', { name: '🎖️ 领取结业证书' })).toBeAttached();
  await expect(page.locator('#coursenav a[href="/lesson49/"]')).toBeVisible();
});

test('the food basket adds a skippable story but never gates Lesson 50', async ({ page }) => {
  await page.addInitScript(profileKey => {
    if (sessionStorage.getItem('lesson50-story-seeded') === 'yes') return;
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      souvenirs: ['food-basket'],
      completedStages: { lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'] }
    }));
    sessionStorage.setItem('lesson50-story-seeded', 'yes');
  }, PROFILE_KEY);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lesson50/');

  const story = page.locator('#lesson50Story');
  await expect(story).toHaveAttribute('data-story-variant', 'basket');
  await expect(story).toContainText('篮子里的香味');
  await expect(story.locator('img[alt="食物篮子"]')).toBeVisible();
  await expect(page.getByRole('button', { name: '🧺 带着篮子开始' })).toBeVisible();
  await expect(page.locator('#l1')).toBeAttached();
  await expect(page.getByRole('button', { name: '🎖️ 领取结业证书' })).toBeAttached();

  await page.getByRole('button', { name: '跳过小故事，直接开始' }).click();
  await expect(story).toBeHidden();
  await expect(page.locator('#l1')).toBeInViewport();

  await page.reload();
  await expect(story).toBeVisible();
  await expect(story).toHaveAttribute('data-story-variant', 'basket');
});

test('restarting the device adventure removes the basket bridge', async ({ page }) => {
  await page.addInitScript(profileKey => {
    if (sessionStorage.getItem('lesson50-restart-seeded') === 'yes') return;
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      souvenirs: ['food-basket'],
      completedStages: { lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'] }
    }));
    sessionStorage.setItem('lesson50-restart-seeded', 'yes');
  }, PROFILE_KEY);

  await page.goto('/');
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '确认重开', exact: true }).click();
  await page.goto('/lesson50/');

  await expect(page.locator('#lesson50Story')).toHaveAttribute('data-story-variant', 'standalone');
  await expect(page.locator('#lesson50Story img')).toHaveCount(0);
  const profile = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), PROFILE_KEY);
  expect(profile.souvenirs).toEqual([]);
});
