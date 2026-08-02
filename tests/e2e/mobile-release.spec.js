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

async function compareMarkerToBaseline(page, actualPng, baselineName) {
  return page.evaluate(async ({ actualDataUrl, baselineUrl }) => {
    const loadImage = source => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Unable to decode visual evidence: ${source}`));
      image.src = source;
    });
    const [actual, baseline] = await Promise.all([
      loadImage(actualDataUrl),
      loadImage(baselineUrl)
    ]);
    if (actual.width !== baseline.width || actual.height !== baseline.height) {
      return {
        actualSize: [actual.width, actual.height],
        baselineSize: [baseline.width, baseline.height],
        meanAbsoluteDifference: Infinity,
        strongDifferenceRatio: 1
      };
    }

    const pixelsFor = image => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height).data;
    };
    const actualPixels = pixelsFor(actual);
    const baselinePixels = pixelsFor(baseline);
    let absoluteDifference = 0;
    let strongDifferenceCount = 0;
    const pixelCount = actual.width * actual.height;
    for (let index = 0; index < actualPixels.length; index += 4) {
      let strongestChannelDifference = 0;
      for (let channel = 0; channel < 4; channel += 1) {
        const difference = Math.abs(actualPixels[index + channel] - baselinePixels[index + channel]);
        absoluteDifference += difference;
        strongestChannelDifference = Math.max(strongestChannelDifference, difference);
      }
      if (strongestChannelDifference > 40) strongDifferenceCount += 1;
    }
    return {
      actualSize: [actual.width, actual.height],
      baselineSize: [baseline.width, baseline.height],
      meanAbsoluteDifference: absoluteDifference / (pixelCount * 4),
      strongDifferenceRatio: strongDifferenceCount / pixelCount
    };
  }, {
    actualDataUrl: `data:image/png;base64,${actualPng.toString('base64')}`,
    baselineUrl: `/tests/e2e/snapshots/mobile-release.spec.js/${baselineName}`
  });
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

test('Lesson 49 presents one coherent landmark snapshot at every growth state', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const stages = ['l1', 'l2', 'l3', 'l4', 'l5'];

  for (let completed = 0; completed <= stages.length; completed += 1) {
    await page.evaluate(({ profileKey, completedStages }) => {
      localStorage.setItem(profileKey, JSON.stringify({
        version: 1,
        currentDistrictId: 'first-book-49-60',
        completedStages: { lesson49: completedStages }
      }));
    }, { profileKey: PROFILE_KEY, completedStages: stages.slice(0, completed) });
    await page.reload();

    const markerImages = page.locator('[data-map-lesson="49"] .published-marker img');
    await expect(markerImages).toHaveCount(1);
    await expect(markerImages).toHaveAttribute(
      'src',
      completed === 0
        ? '/assets/adventure-map/lesson49/base.png'
        : `/assets/adventure-map/lesson49/growth-${completed}.png`
    );
    await expect(markerImages).toHaveAttribute(
      'data-landmark-state',
      completed === 0 ? 'base' : `growth-${completed}`
    );
  }
});

test('Lesson 49 landmark snapshots retain one fixed canvas through all six states', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const stages = ['l1', 'l2', 'l3', 'l4', 'l5'];
  const states = [];
  let stageZeroPng;

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
    const snapshots = landmark.locator('[data-landmark-layer="snapshot"]');
    await expect(snapshots).toHaveCount(1);
    await expect.poll(() => snapshots.evaluateAll(images => images.map(image => (
      [image.naturalWidth, image.naturalHeight]
    )))).toEqual([[1024, 1024]]);
    const evidencePath = testInfo.outputPath(`lesson49-landmark-stage-${completed}.png`);
    const marker = landmark.locator('.published-marker');
    const actualPng = await marker.screenshot({
      animations: 'disabled',
      path: evidencePath
    });
    if (completed === 0) stageZeroPng = actualPng;
    const visualDifference = await compareMarkerToBaseline(
      page,
      actualPng,
      `lesson49-landmark-stage-${completed}.png`
    );
    expect(visualDifference.actualSize).toEqual([147, 147]);
    expect(visualDifference.baselineSize).toEqual([147, 147]);
    expect(visualDifference.meanAbsoluteDifference).toBeLessThanOrEqual(2.5);
    expect(visualDifference.strongDifferenceRatio).toBeLessThanOrEqual(0.02);
    await testInfo.attach(`lesson49-landmark-stage-${completed}`, {
      path: evidencePath,
      contentType: 'image/png'
    });
    states.push(await landmark.evaluate(element => {
      const slot = element.getBoundingClientRect();
      const marker = element.querySelector('.landmark-stack').getBoundingClientRect();
      const snapshot = element.querySelector('[data-landmark-layer="snapshot"]').getBoundingClientRect();
      return {
        marker: [marker.x - slot.x, marker.y - slot.y, marker.width, marker.height],
        snapshot: [snapshot.x - marker.x, snapshot.y - marker.y, snapshot.width, snapshot.height]
      };
    }));
  }

  for (const state of states.slice(1)) {
    state.marker.forEach((value, index) => expect(value).toBeCloseTo(states[0].marker[index], 4));
    state.snapshot.forEach((value, index) => expect(value).toBeCloseTo(states[0].snapshot[index], 4));
  }
  expect(states[0].marker[2]).toBeGreaterThanOrEqual(146);

  const deliberateMismatch = await compareMarkerToBaseline(
    page,
    stageZeroPng,
    'lesson49-landmark-stage-5.png'
  );
  expect(deliberateMismatch.meanAbsoluteDifference).toBeGreaterThan(2.5);
  expect(deliberateMismatch.strongDifferenceRatio).toBeGreaterThan(0.02);
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
  await expect(page.locator('[data-map-lesson="49"] [data-landmark-state="base"]')).toBeVisible();
  expect(await page.locator('.published-location').evaluate(element => (
    getComputedStyle(element).transitionDuration
  ))).toBe('0s');
  await page.evaluate(profileKey => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 0, l3: 0, l4: 0, l5: 0 }
    }));
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      completedStages: { lesson49: ['l1'] }
    }));
  }, PROFILE_KEY);
  await page.reload();
  await expect(page.locator('[data-map-lesson="49"] [data-landmark-state="growth-1"]')).toBeVisible();
  expect(await page.locator('[data-landmark-state="growth-1"]').evaluate(element => (
    getComputedStyle(element).animationDuration
  ))).toBe('0s');
  await page.getByRole('button', { name: '返回世界总览', exact: true }).click();
  await expect(page.getByRole('button', { name: '进入暖灯集市', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#currentDistrictTitle')).toBeFocused();

  await page.goto('/lesson50/');
  await page.locator('#startBtn').click();
  await expect(page.locator('#l1')).toBeInViewport();

  await page.goto('/lesson49/present/');
  for (let step = 2; step <= 5; step += 1) {
    await page.locator('#nextControl').click();
    await expect(page.locator('#presentationProgress')).toHaveText(`第 ${step} / 5 步`);
  }
  await expect(page.locator('#nextControl')).toHaveText('回到开场');
  await page.locator('#nextControl').click();
  await expect(page.locator('#presentationProgress')).toHaveText('第 1 / 5 步');
});
