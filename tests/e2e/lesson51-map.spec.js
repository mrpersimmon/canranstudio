'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const STAGES = ['l1', 'l2', 'l3', 'l4', 'l5'];
const BASE_ASSET = '/assets/adventure-map/lesson51/landmark-base.png';
const GROWTH_ASSETS = [
  '/assets/adventure-map/lesson51/growth-01-weather.png',
  '/assets/adventure-map/lesson51/growth-02-theatre.png',
  '/assets/adventure-map/lesson51/growth-03-seasons.png',
  '/assets/adventure-map/lesson51/growth-04-sundial.png',
  '/assets/adventure-map/lesson51/growth-05-celebration.png'
];

async function seedCompletedStages(page, completedStages) {
  await page.evaluate(({ profileKey, stages }) => {
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      souvenirs: [],
      completedStages: { lesson51: stages }
    }));
  }, { profileKey: PROFILE_KEY, stages: completedStages });
}

test('Lesson 51 keeps one fixed base and cumulatively reveals five independent growth layers', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?district=first-book-49-60&focus=lesson51');
  const location = page.locator('[data-map-lesson="51"]');
  let firstStackBox;

  for (let completed = 0; completed <= STAGES.length; completed += 1) {
    await seedCompletedStages(page, STAGES.slice(0, completed));
    await page.reload();

    const stack = location.locator('.landmark-stack');
    const base = stack.locator('[data-landmark-layer="base"]');
    const growth = stack.locator('[data-landmark-layer="growth"]');
    await expect(base).toHaveCount(1);
    await expect(base).toHaveAttribute('src', BASE_ASSET);
    await expect(growth).toHaveCount(completed);
    await expect(stack.locator('[data-landmark-layer="snapshot"]')).toHaveCount(0);
    expect(await growth.evaluateAll(images => images.map(image => image.getAttribute('src'))))
      .toEqual(GROWTH_ASSETS.slice(0, completed));
    await expect.poll(() => stack.locator('img').evaluateAll(images => images.map(image => (
      [image.naturalWidth, image.naturalHeight]
    )))).toEqual(Array.from({ length: completed + 1 }, () => [1024, 1024]));

    const stackBox = await stack.boundingBox();
    expect(stackBox).not.toBeNull();
    if (!firstStackBox) firstStackBox = stackBox;
    expect(stackBox.width).toBeCloseTo(firstStackBox.width, 4);
    expect(stackBox.height).toBeCloseTo(firstStackBox.height, 4);

    if (completed < STAGES.length) {
      await expect(location.locator('[data-souvenir-id]')).toHaveCount(0);
    } else {
      await expect(location.locator('[data-souvenir-id="four-seasons-guide-compass"]')).toBeVisible();
      await expect(location.getByRole('link')).toHaveAccessibleName(
        /地点完成.*5\/5.*永久纪念.*四季导游罗盘/
      );
    }
  }
});

test('Lesson 51 layered landmark stays usable on phone and tablet and opens the real course', async ({ page }) => {
  await page.goto('/?district=first-book-49-60&focus=lesson51');
  await seedCompletedStages(page, STAGES.slice(0, 3));

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 }
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();
    const location = page.locator('[data-map-lesson="51"]');
    await expect(location.locator('[data-landmark-layer="growth"]')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));
  }

  await page.locator('[data-map-lesson="51"] a').click();
  await expect(page).toHaveURL(/\/lesson51\/$/);
  await expect(page.locator('body')).toContainText('希腊四季之旅');
});
