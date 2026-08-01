'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const VIEWPORTS = [
  { label: 'phone', width: 390, height: 844 },
  { label: 'tablet portrait', width: 768, height: 1024 },
  { label: 'tablet landscape', width: 1024, height: 768 },
  { label: 'desktop', width: 1280, height: 900 }
];
const DISTRICT_LESSONS = [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];

async function expectNoHorizontalOverflow(page) {
  await expect.poll(() => page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth
  }))).toEqual(await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.clientWidth
  })));
}

async function expectMinimumTarget(locator, minimum = 44) {
  const box = await locator.boundingBox();
  expect(box, `missing target box for ${await locator.evaluate(element => element.outerHTML.slice(0, 160))}`)
    .not.toBeNull();
  expect(box.width).toBeGreaterThanOrEqual(minimum);
  expect(box.height).toBeGreaterThanOrEqual(minimum);
}

async function expectHorizontalBounds(page, locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 0.5);
}

test('the first world overview defers production map artwork until its district opens', async ({ page }) => {
  const mapRequests = [];
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith('/assets/adventure-map/')) mapRequests.push(path);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#worldOverview')).toBeVisible();
  expect(mapRequests).toEqual([]);

  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#currentDistrict')).toBeVisible();
  expect(new Set(mapRequests)).toEqual(new Set([
    '/assets/adventure-map/lesson49/base.png',
    '/assets/adventure-map/lesson49/mobile-preview.png'
  ]));
});

test('phone, tablet rotations, and desktop preserve one atlas order and operable semantics', async ({ page }) => {
  await page.addInitScript(profileKey => localStorage.removeItem(profileKey), PROFILE_KEY);

  for (const viewport of VIEWPORTS) {
    await test.step(viewport.label, async () => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await expect(page.locator('#worldOverview')).toBeVisible();
      await expectNoHorizontalOverflow(page);

      const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewportMeta).toContain('width=device-width');
      expect(viewportMeta).not.toMatch(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i);

      const entrance = page.getByRole('button', { name: '进入暖灯集市', exact: true });
      await expectMinimumTarget(entrance);
      await expectHorizontalBounds(page, entrance);
      await entrance.focus();
      await expect(entrance).toBeFocused();
      expect(await entrance.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
      await page.keyboard.press('Enter');

      await expect(page.locator('#currentDistrictTitle')).toBeFocused();
      await expect(page.locator('#districtLocations [data-map-slot]')).toHaveCount(12);
      expect(await page.locator('#districtLocations [data-map-slot]').evaluateAll(locations => (
        locations.map(location => Number(location.dataset.mapLesson))
      ))).toEqual(DISTRICT_LESSONS);
      const drawingLocations = page.locator('#districtLocations [data-location-status="drawing"]');
      await expect(drawingLocations).toHaveCount(11);
      expect((await drawingLocations.allTextContents()).every(text => text.includes('正在绘制')))
        .toBe(true);
      await expect(page.locator('[data-map-lesson="49"] a')).toHaveAccessibleName(
        /LESSON 49.*肉店大冒险.*可以出发.*0 \/ 5/
      );
      const recommendation = page.locator('#districtRecommendation a');
      await expect(recommendation).toHaveAccessibleName(
        /推荐出发.*LESSON 49.*肉店大冒险.*开始冒险/
      );

      await page.keyboard.press('Tab');
      await expect(recommendation).toBeFocused();
      for (const selector of [
        '#backToWorld',
        '#districtRecommendation a',
        '[data-map-lesson="49"] a',
        '#previousRange',
        '#nextRange',
        '#lessonSearch',
        '#lessonSearchForm button',
        '#openDeviceSettings'
      ]) {
        await expectMinimumTarget(page.locator(selector));
        await expectHorizontalBounds(page, page.locator(selector));
      }
      await expectNoHorizontalOverflow(page);

      const scrollContract = await page.evaluate(() => ({
        pageTallerThanViewport: document.documentElement.scrollHeight > window.innerHeight,
        mapTouchAction: getComputedStyle(document.querySelector('.district-map')).touchAction
      }));
      expect(scrollContract.pageTallerThanViewport).toBe(true);
      expect(scrollContract.mapTouchAction).not.toBe('none');

      await page.goto('/lesson49/present/');
      await expectNoHorizontalOverflow(page);
      for (const control of await page.locator('[data-presentation-control]').all()) {
        await expectMinimumTarget(control);
        await expectHorizontalBounds(page, control);
      }
    });
  }
});

test('Lesson 49 growth layers retain one fixed canvas and anchor through all six states', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const stages = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const states = [];

  for (let completed = 0; completed <= stages.length; completed += 1) {
    await page.evaluate(({ profileKey, completedStages }) => {
      localStorage.setItem(profileKey, JSON.stringify({
        version: 1,
        currentDistrictId: 'first-book-49-60',
        completedStages: { lesson49: completedStages }
      }));
    }, { profileKey: PROFILE_KEY, completedStages: stages.slice(0, completed) });
    await page.reload();

    const landmark = page.locator('[data-map-lesson="49"]');
    const layers = landmark.locator('[data-landmark-layer]');
    await expect(layers).toHaveCount(completed + 1);
    await expect.poll(() => layers.evaluateAll(images => images.map(image => (
      [image.naturalWidth, image.naturalHeight]
    )))).toEqual(Array.from({ length: completed + 1 }, () => [1024, 1024]));
    const evidencePath = testInfo.outputPath(`lesson49-landmark-stage-${completed}.png`);
    await landmark.locator('.published-marker').screenshot({
      animations: 'disabled',
      path: evidencePath
    });
    await testInfo.attach(`lesson49-landmark-stage-${completed}`, {
      path: evidencePath,
      contentType: 'image/png'
    });
    states.push(await landmark.evaluate(element => {
      const slot = element.getBoundingClientRect();
      const marker = element.querySelector('.landmark-stack').getBoundingClientRect();
      const base = element.querySelector('[data-landmark-layer="base"]').getBoundingClientRect();
      return {
        marker: [marker.x - slot.x, marker.y - slot.y, marker.width, marker.height],
        base: [base.x - marker.x, base.y - marker.y, base.width, base.height]
      };
    }));
  }

  for (const state of states.slice(1)) {
    state.marker.forEach((value, index) => expect(value).toBeCloseTo(states[0].marker[index], 4));
    state.base.forEach((value, index) => expect(value).toBeCloseTo(states[0].base[index], 4));
  }
  expect(states[0].marker[2]).toBeGreaterThanOrEqual(146);
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
      for (const tab of await page.locator('#coursenav .tab').all()) {
        await expectMinimumTarget(tab);
        await expectHorizontalBounds(page, tab);
      }
      await expectNoHorizontalOverflow(page);
      const obstruction = await page.evaluate(() => {
        const action = document.getElementById('startBtn').getBoundingClientRect();
        const navigation = document.getElementById('coursenav').getBoundingClientRect();
        return action.bottom <= navigation.top;
      });
      expect(obstruction).toBe(true);
    });
  }
});

test('safe areas and reduced motion keep atlas, story, and presentation tasks complete', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ['/', '/lesson50/', '/lesson49/present/']) {
    await page.goto(route);
    const styleText = await page.locator('head style').allTextContents();
    const joined = styleText.join('\n');
    for (const inset of ['top', 'right', 'bottom', 'left']) {
      expect(joined).toContain(`safe-area-inset-${inset}`);
    }
    await expectNoHorizontalOverflow(page);
  }

  await page.goto('/');
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  await expect(page.locator('#currentDistrictTitle')).toBeFocused();
  await expect(page.locator('[data-map-lesson="49"] [data-landmark-layer="base"]')).toBeVisible();
  expect(await page.locator('.published-location').evaluate(element => (
    getComputedStyle(element).transitionDuration
  ))).toBe('0s');

  await page.goto('/lesson50/');
  await page.locator('#startBtn').click();
  await expect(page.locator('#l1')).toBeInViewport();

  await page.goto('/lesson49/present/');
  await page.locator('#nextControl').click();
  await expect(page.locator('#presentationProgress')).toHaveText('第 2 / 5 步');
});
