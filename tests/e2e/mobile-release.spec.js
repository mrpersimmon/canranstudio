'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const VIEWPORTS = [
  { label: 'phone', width: 390, height: 844 },
  { label: 'tablet portrait', width: 768, height: 1024 },
  { label: 'tablet landscape', width: 1024, height: 768 },
  { label: 'desktop', width: 1280, height: 900 }
];
const PUBLISHED_IDS = [
  'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark'
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

test('world overview loads one entrance preview and defers full district artwork', async ({ page }) => {
  const mapRequests = [];
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/assets/adventure-map/')) mapRequests.push(path);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#worldOverview')).toBeVisible();
  expect(new Set(mapRequests)).toEqual(new Set([
    '/assets/adventure-map/lesson49/mobile-preview.png'
  ]));

  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#currentDistrict')).toBeVisible();
  for (const required of [
    '/assets/adventure-map/atlas/warm-lantern-parchment.jpg',
    '/assets/adventure-map/lesson49/landmark-base.png',
    '/assets/adventure-map/lesson50/landmark-base.png',
    '/assets/adventure-map/lesson51/landmark-base.png',
    '/assets/adventure-map/lesson52/landmark-base.png',
    '/assets/adventure-map/lesson53/landmark-base.png',
    '/assets/adventure-map/lesson54/landmark-base.png',
    '/assets/adventure-map/soundmark/landmark-base.png'
  ]) expect(mapRequests).toContain(required);
  expect(mapRequests.some(path => path.includes('/growth-'))).toBe(false);
});

test('phone, tablet rotations, and desktop preserve one atlas order and touch-safe controls', async ({ page }) => {
  for (const viewport of VIEWPORTS) {
    await test.step(viewport.label, async () => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await expect(page.locator('#worldOverview')).toBeVisible();
      await expectNoHorizontalOverflow(page);

      const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewportMeta).toContain('width=device-width');
      expect(viewportMeta).toContain('viewport-fit=cover');
      expect(viewportMeta).not.toMatch(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i);

      const entrance = page.getByRole('button', { name: '进入暖灯集市', exact: true });
      await expectMinimumTarget(entrance);
      await entrance.focus();
      await expect(entrance).toBeFocused();
      await page.keyboard.press('Enter');

      await expect(page.locator('#currentDistrictTitle')).toBeFocused();
      expect(await page.locator('#districtLocations [data-location-id]').evaluateAll(elements => (
        elements.map(element => element.dataset.locationId)
      ))).toEqual(PUBLISHED_IDS);
      await expect(page.locator('[data-location-status="drawing"]')).toHaveCount(0);
      await expect(page.locator('#districtLocations')).not.toContainText('正在绘制');
      await expectMinimumTarget(page.getByRole('button', { name: '返回世界总览', exact: true }));
      await expectMinimumTarget(page.locator('#currentDistrict [data-open-settings]'));
      await expectNoHorizontalOverflow(page);

      const scrolling = await page.evaluate(() => ({
        pageTallerThanViewport: document.documentElement.scrollHeight > innerHeight,
        mapTouchAction: getComputedStyle(document.querySelector('.district-map')).touchAction
      }));
      expect(scrolling.pageTallerThanViewport).toBe(true);
      expect(scrolling.mapTouchAction).not.toBe('none');
    });
  }
});

test('all published landmarks use one fixed transparent canvas per base and incremental layer', async ({ page }) => {
  await page.addInitScript(profileKey => {
    const complete = ['l1', 'l2', 'l3', 'l4', 'l5'];
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      completedStages: {
        lesson49: complete,
        lesson50: complete,
        lesson51: complete,
        lesson52: complete,
        lesson53: complete,
        lesson54: complete,
        soundmark: ['vs', 'g1', 'g2', 'g3']
      }
    }));
  }, PROFILE_KEY);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?district=first-book-49-60&focus=lesson49');

  for (const id of PUBLISHED_IDS) {
    const stack = page.locator(`[data-location-id="${id}"] .landmark-stack`);
    const expectedGrowth = id === 'soundmark' ? 4 : 5;
    await expect(stack.locator('[data-landmark-layer="base"]')).toHaveCount(1);
    await expect(stack.locator('[data-landmark-layer="growth"]')).toHaveCount(expectedGrowth);
    await expect.poll(() => stack.locator('img').evaluateAll(images => images.map(image => (
      [image.naturalWidth, image.naturalHeight]
    )))).toEqual(Array.from({ length: expectedGrowth + 1 }, () => [1024, 1024]));
  }
});

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
      const unobstructed = await page.evaluate(() => {
        const action = document.getElementById('startBtn').getBoundingClientRect();
        const navigation = document.getElementById('coursenav').getBoundingClientRect();
        return action.bottom <= navigation.top;
      });
      expect(unobstructed).toBe(true);
    });
  }
});

test('safe areas and reduced motion keep atlas and full-screen growth reveal usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const atlasCss = await page.locator('head style').textContent();
  for (const inset of ['top', 'right', 'bottom', 'left']) {
    expect(atlasCss).toContain(`safe-area-inset-${inset}`);
  }
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  expect(await page.locator('[data-map-guidance="active"] .published-location').evaluate(element => (
    getComputedStyle(element).transitionDuration
  ))).toBe('0s');

  await page.goto('/lesson49/');
  await page.evaluate(() => window.eval('award("l1", 1)'));
  const reveal = page.locator('.growth-reveal');
  await expect(reveal).toBeVisible();
  expect(await reveal.locator('.growth-reveal__layer--new').evaluate(element => (
    getComputedStyle(element).animationDuration
  ))).toBe('0s');
  await expectNoHorizontalOverflow(page);
  const coverage = await reveal.boundingBox();
  expect(coverage.x).toBe(0);
  expect(coverage.y).toBe(0);
  expect(coverage.width).toBe(390);
  expect(coverage.height).toBe(844);
  await page.waitForTimeout(750);
  await reveal.click({ position: { x: 4, y: 4 } });
  await expect(reveal).toBeHidden();
});
