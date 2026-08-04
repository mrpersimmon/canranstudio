'use strict';

const { test, expect } = require('@playwright/test');

const PUBLISHED_LOCATION_IDS = [
  'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark'
];

async function enterLaunchDistrict(page) {
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
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
  await expect(page.getByRole('button', { name: '进入暖灯集市', exact: true })).toBeVisible();

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

test('launch district renders only the seven complete publication contracts', async ({ page }) => {
  await page.goto('/');
  await enterLaunchDistrict(page);

  await expect(page.locator('#worldOverview')).toBeHidden();
  await expect(page.locator('#districtLocations .map-location')).toHaveCount(7);
  await expect(page.locator('#districtLocations [data-location-status="published"]')).toHaveCount(7);
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

  expect(contract.renderedIds).toEqual(PUBLISHED_LOCATION_IDS);
  expect(contract.catalogIds).toEqual([
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54',
    'lesson55', 'lesson56', 'lesson57', 'lesson58', 'lesson59', 'lesson60', 'soundmark'
  ]);
  expect(contract.recommendableIds).toEqual(PUBLISHED_LOCATION_IDS);
  expect(contract.currentDistrictId).toBe('first-book-49-60');
});

test('every published landmark is a one-click course link', async ({ page }) => {
  await page.goto('/');
  await enterLaunchDistrict(page);

  const expectedRoutes = {
    lesson49: '/lesson49/',
    lesson50: '/lesson50/',
    lesson51: '/lesson51/',
    lesson52: '/lesson52/',
    lesson53: '/lesson53/',
    lesson54: '/lesson54/',
    soundmark: '/soundmark/'
  };
  for (const [id, route] of Object.entries(expectedRoutes)) {
    const location = page.locator(`[data-location-id="${id}"]`);
    await expect(location.getByRole('link')).toHaveCount(1);
    await expect(location.getByRole('link')).toHaveAttribute('href', route);
  }
  await expect(page.locator('[data-location-id="lesson49"] a')).toHaveAccessibleName(
    /继续冒险.*LESSON 49.*肉店大冒险.*学习进度 0\/5/
  );
  await expect(page.locator('[data-location-id="soundmark"] a')).toHaveAccessibleName(
    /专项支线.*音标魔法乐园.*学习进度 0\/4/
  );
});

test('progress is embedded in each plaque and the special branch keeps four real stamps', async ({ page }) => {
  await page.goto('/');
  await enterLaunchDistrict(page);

  for (const id of PUBLISHED_LOCATION_IDS) {
    const location = page.locator(`[data-location-id="${id}"]`);
    const plaque = location.locator('.location-plaque');
    await expect(plaque).toHaveCount(1);
    await expect(plaque.locator('.location-kind')).toHaveCount(1);
    await expect(plaque.locator('.location-title')).toHaveCount(1);
    await expect(plaque.locator('.progress-stamp')).toHaveCount(id === 'soundmark' ? 4 : 5);
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
  await expect(page.getByRole('button', { name: '进入暖灯集市', exact: true })).toBeFocused();
});

test('invalid atlas query parameters fail safely to the world overview', async ({ page }) => {
  for (const query of [
    '?district=unknown&focus=lesson49',
    '?district=first-book-49-60&focus=lesson60',
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
  expect(ratio).toBeCloseTo(914 / 1721, 2);
});

test('every published landmark stays fully inside the Huawei district parchment', async ({ page }) => {
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

test('existing course URLs remain public direct entries', async ({ page }) => {
  await page.goto('/lesson49/');
  await expect(page).toHaveURL(/\/lesson49\/$/);
  await expect(page.locator('body')).toContainText('肉店大冒险');
});
