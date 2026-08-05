'use strict';

const { test, expect } = require('@playwright/test');
const { MAP_STATE_VERSION } = require('../../core/course-catalog');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const STAGES = ['l1', 'l2', 'l3', 'l4', 'l5'];

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

test('Lesson 51 loads exactly one complete responsive snapshot for each cumulative state', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?district=first-book-49-60&focus=lesson51');
  const location = page.locator('[data-map-lesson="51"]');
  let firstStackBox;

  for (let completed = 0; completed <= STAGES.length; completed += 1) {
    await seedCompletedStages(page, STAGES.slice(0, completed));
    await page.reload();

    const stack = location.locator('.landmark-stack');
    const snapshot = stack.locator('[data-landmark-snapshot]');
    await expect(snapshot).toHaveCount(1);
    await expect(snapshot).toHaveAttribute('data-landmark-snapshot', String(completed));
    await expect(snapshot).toHaveAttribute(
      'src', `/assets/adventure-map/lesson51/states/state-${completed}.png?v=${MAP_STATE_VERSION}`
    );
    await expect(stack.locator('source')).toHaveCount(2);
    await expect.poll(() => snapshot.evaluate(image => image.currentSrc)).toContain(
      `/assets/adventure-map/lesson51/states/state-${completed}-`
    );
    expect(await stack.locator('img').count()).toBe(1);

    const stackBox = await stack.boundingBox();
    expect(stackBox).not.toBeNull();
    if (!firstStackBox) firstStackBox = stackBox;
    expect(stackBox.width).toBeCloseTo(firstStackBox.width, 4);
    expect(stackBox.height).toBeCloseTo(firstStackBox.height, 4);

    if (completed < STAGES.length) {
      await expect(location.locator('[data-souvenir-id]')).toHaveCount(0);
    } else {
      await expect(location.locator('[data-souvenir-id]')).toHaveCount(0);
      await expect(location.getByRole('link')).toHaveAccessibleName(
        /地点完成.*5\/5/
      );
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).souvenirs, PROFILE_KEY))
        .toContain('four-seasons-guide-compass');
    }
  }
});

test('Lesson 51 complete snapshot stays usable on phone and tablet and opens the real course', async ({ page }) => {
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
    await expect(location.locator('[data-landmark-snapshot="3"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));
  }

  await page.locator('[data-map-lesson="51"] a').click();
  await expect(page).toHaveURL(/\/lesson51\/$/);
  await expect(page.locator('body')).toContainText('希腊四季之旅');
});
