'use strict';

const { test, expect } = require('@playwright/test');

const ROUTE_PAGE_LOCATION_IDS = ['lesson49', 'lesson50', 'lesson51', 'lesson52'];

async function enterLaunchDistrict(page) {
  await page.getByRole('button', { name: '进入四季生活城', exact: true }).click();
  await expect(page.locator('#currentDistrict')).toBeVisible();
}

test('plain home is the atlas overview with one real district entrance and eleven scenic regions', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#worldOverview')).toBeVisible();
  await expect(page.locator('#currentDistrict')).toBeHidden();
  await expect(page.locator('#worldDistricts .distant-region')).toHaveCount(11);
  await expect(page.locator('#worldDistricts [data-district-id]')).toHaveCount(0);
  await expect(page.locator('#worldDistricts button')).toHaveCount(1);
  await expect(page.locator('#worldDistricts a')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '进入四季生活城', exact: true })).toBeVisible();

  const scenicInteractivity = await page.locator('#worldDistricts .distant-region')
    .evaluateAll(regions => regions.reduce((count, region) => (
      count + region.querySelectorAll('a,button,[tabindex]').length
    ), 0));
  expect(scenicInteractivity).toBe(0);

  for (const removed of [
    '#lessonStations', '#lessonRoute', '#specialStation', '#continuePanel',
    '#lessonSearch', 'footer'
  ]) {
    await expect(page.locator(removed)).toHaveCount(0);
  }
});

test('the first route page renders only the four approved Lessons 49–52', async ({ page }) => {
  await page.goto('/');
  await enterLaunchDistrict(page);

  await expect(page.locator('#worldOverview')).toBeHidden();
  await expect(page.locator('#districtLocations .map-location')).toHaveCount(4);
  await expect(page.locator('#districtLocations [data-location-status="published"]')).toHaveCount(4);
  await expect(page.locator('#districtLocations [data-location-status="drawing"]')).toHaveCount(0);
  await expect(page.locator('#districtLocations')).not.toContainText('正在绘制');

  const contract = await page.evaluate(() => ({
    renderedIds: [...document.querySelectorAll('#districtLocations [data-location-id]')]
      .map(location => location.dataset.locationId),
    catalogIds: CanranCore.courseCatalog.MAP_COURSES.map(course => course.id),
    recommendableIds: CanranCore.courseCatalog.MAP_COURSES
      .filter(course => CanranCore.courseCatalog.assessLearningLocation(course).recommendable)
      .map(course => course.id),
    currentDistrictId: JSON.parse(
      localStorage.getItem('canran:adventure-profile:v1')
    ).currentDistrictId
  }));

  expect(contract.renderedIds).toEqual(ROUTE_PAGE_LOCATION_IDS);
  expect(contract.catalogIds).toEqual([
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54',
    'lesson55', 'lesson56', 'lesson57', 'lesson58', 'lesson59', 'lesson60', 'soundmark'
  ]);
  expect(contract.recommendableIds).toEqual([
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark'
  ]);
  expect(contract.currentDistrictId).toBe('first-book-49-60');
});

test('every route-page landmark is a one-click course link', async ({ page }) => {
  await page.goto('/');
  await enterLaunchDistrict(page);

  const expectedRoutes = {
    lesson49: '/lesson49/',
    lesson50: '/lesson50/',
    lesson51: '/lesson51/',
    lesson52: '/lesson52/'
  };
  for (const [id, route] of Object.entries(expectedRoutes)) {
    const location = page.locator(`[data-location-id="${id}"]`);
    await expect(location.getByRole('link')).toHaveCount(1);
    await expect(location.getByRole('link')).toHaveAttribute('href', route);
  }
  await expect(page.locator('[data-location-id="lesson49"] a')).toHaveAccessibleName(
    /当前冒险位置.*LESSON 49.*肉店大冒险.*学习进度 0\/5/
  );
});

test('progress is embedded in each of the four lesson plaques', async ({ page }) => {
  await page.goto('/');
  await enterLaunchDistrict(page);

  for (const id of ROUTE_PAGE_LOCATION_IDS) {
    const location = page.locator(`[data-location-id="${id}"]`);
    const plaque = location.locator('.location-plaque');
    await expect(plaque).toHaveCount(1);
    await expect(plaque.locator('.location-kind')).toHaveCount(1);
    await expect(plaque.locator('.location-title')).toHaveCount(1);
    await expect(plaque.locator('.progress-stamp')).toHaveCount(5);
    await expect(location.locator('.location-status')).toHaveCount(0);
  }
});

test('plain reload always returns to world while an explicit course-return query opens and focuses the district', async ({ page }) => {
  await page.goto('/');
  await enterLaunchDistrict(page);
  await page.reload();
  await expect(page.locator('#worldOverview')).toBeVisible();
  await expect(page.locator('#currentDistrict')).toBeHidden();

  await page.goto('/?district=first-book-49-60&focus=lesson51');
  await expect(page.locator('#currentDistrict')).toBeVisible();
  await expect(page.locator('#worldOverview')).toBeHidden();
  await expect(page.locator('[data-location-id="lesson51"]')).toBeVisible();

  await page.getByRole('button', { name: '返回世界总览', exact: true }).click();
  await expect(page.locator('#worldOverview')).toBeVisible();
  await expect(page.getByRole('button', { name: '进入四季生活城', exact: true })).toBeFocused();
});

test('invalid atlas query parameters fail safely to the world overview', async ({ page }) => {
  for (const query of [
    '?district=unknown&focus=lesson49',
    '?district=first-book-49-60&focus=lesson53',
    '?focus=lesson49'
  ]) {
    await page.goto(`/${query}`);
    await expect(page.locator('#worldOverview')).toBeVisible();
    await expect(page.locator('#currentDistrict')).toBeHidden();
  }
});

test('both atlas levels fit phone and tablet viewports without horizontal overflow', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));

    await enterLaunchDistrict(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));
    const back = page.getByRole('button', { name: '返回世界总览', exact: true });
    const box = await back.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test('the district parchment keeps its authored proportion on the Huawei viewport', async ({ page }) => {
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto('/');
  await enterLaunchDistrict(page);

  const ratio = await page.locator('#districtMap').evaluate(map => {
    const box = map.getBoundingClientRect();
    return box.width / box.height;
  });
  expect(ratio).toBeCloseTo(940 / 1672, 2);
});

test('every route-page landmark stays fully inside the Huawei district parchment', async ({ page }) => {
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto('/');
  await enterLaunchDistrict(page);

  const clipped = await page.locator('#districtLocations .map-location').evaluateAll(locations => {
    const map = document.getElementById('districtMap').getBoundingClientRect();
    return locations.flatMap(location => {
      const box = location.getBoundingClientRect();
      const inside = box.left >= map.left && box.top >= map.top &&
        box.right <= map.right && box.bottom <= map.bottom;
      return inside ? [] : [location.dataset.locationId];
    });
  });
  expect(clipped).toEqual([]);
});

test('the explorer cat marks one current route position without covering landmark links', async ({ page }) => {
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto('/?district=first-book-49-60&focus=lesson51');

  const mascot = page.locator('#routeMascot');
  await expect(mascot).toHaveAttribute('data-route-avatar-target', 'lesson51');
  await expect(mascot.locator('[data-route-cat-image]')).toHaveCount(1);
  await expect(page.locator('[data-map-guidance="active"]')).toHaveAttribute('data-location-id', 'lesson51');
  await expect(page.locator('[data-location-id="lesson51"] a')).toHaveAttribute('aria-current', 'step');
  expect(await mascot.evaluate(element => getComputedStyle(element).pointerEvents)).toBe('none');
});

test('the four whole-pose loader frames appear only while key route artwork is pending', async ({ page }) => {
  await page.route(/background-route-page-.*\.avif/, async route => {
    await new Promise(resolve => setTimeout(resolve, 650));
    await route.continue();
  });
  await page.goto('/?district=first-book-49-60&focus=lesson51', {
    waitUntil: 'domcontentloaded'
  });

  const loader = page.locator('#mapLoader');
  await expect(loader).toHaveAttribute('data-visible', 'true');
  await expect(loader.locator('.map-loader__frame')).toHaveCount(4);
  await expect(loader.locator('[data-route-loader-image]')).toHaveCount(4);
  await expect(loader).toBeHidden({ timeout: 5_000 });
});

test('existing course URLs remain public direct entries', async ({ page }) => {
  await page.goto('/lesson49/');
  await expect(page).toHaveURL(/\/lesson49\/$/);
  await expect(page.locator('body')).toContainText('肉店大冒险');
});
