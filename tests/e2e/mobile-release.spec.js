'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const VIEWPORTS = [
  { label: 'narrow phone', width: 360, height: 800 },
  { label: 'phone', width: 390, height: 844 },
  { label: 'Huawei Mate 60 Pro+', width: 466, height: 980 },
  { label: 'tablet portrait', width: 768, height: 1024 },
  { label: 'tablet landscape', width: 1024, height: 768 },
  { label: 'desktop', width: 1280, height: 900 }
];
async function expectNoHorizontalOverflow(page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth
  }));
  expect(widths.page).toBe(widths.viewport);
}

async function expectMinimumTarget(locator, minimum = 44) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThanOrEqual(minimum);
  expect(box.height).toBeGreaterThanOrEqual(minimum);
}

test('the optional Lesson 50 story stays reachable and unobstructed in every release viewport', async ({ page }) => {
  await page.addInitScript(profileKey => {
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      souvenirs: ['food-basket'],
      completedStages: { lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'] }
    }));
  }, PROFILE_KEY);

  for (const viewport of VIEWPORTS) {
    await test.step(viewport.label, async () => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/lesson50/');
      await expect(page.locator('#lesson50Story')).toHaveAttribute('data-story-variant', 'basket');
      await expect(page.locator('#lesson50Story')).toContainText('篮子里的香味');
      await expectMinimumTarget(page.locator('#startBtn'));
      await expectMinimumTarget(page.locator('#storySkip'));
      await expectNoHorizontalOverflow(page);
      await page.locator('#startBtn').evaluate(element => {
        element.scrollIntoView({ block: 'center', inline: 'nearest' });
      });
      await page.waitForFunction(() => {
        const action = document.getElementById('startBtn').getBoundingClientRect();
        const navigation = document.getElementById('coursenav').getBoundingClientRect();
        return action.bottom <= navigation.top;
      });
      const unobstructed = await page.evaluate(() => {
        const action = document.getElementById('startBtn').getBoundingClientRect();
        const navigation = document.getElementById('coursenav').getBoundingClientRect();
        return action.bottom <= navigation.top;
      });
      expect(unobstructed).toBe(true);
    });
  }
});
