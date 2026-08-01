'use strict';

const { test, expect } = require('@playwright/test');

test('first visit presents twelve districts with only the launch district actionable', async ({ page }) => {
  await page.goto('/');

  const world = page.locator('#worldOverview');
  await expect(world).toBeVisible();
  await expect(page.locator('#currentDistrict')).toBeHidden();
  await expect(page.locator('#worldDistricts [data-district-id]')).toHaveCount(12);
  await expect(world.locator('button')).toHaveCount(1);
  await expect(world.locator('a')).toHaveCount(0);
  await expect(page.locator('#worldDistricts [data-district-status="distant"]')).toHaveCount(11);
  await expect(page.getByRole('button', { name: '进入暖灯集市', exact: true })).toBeVisible();

  const distantInteractivity = await page.locator(
    '#worldDistricts [data-district-status="distant"]'
  ).evaluateAll(districts => districts.reduce((count, district) => (
    count + district.querySelectorAll('a,button,[tabindex]').length
  ), 0));
  expect(distantInteractivity).toBe(0);
});

test('launch district is a stable twelve-location map and drawings are truly inert', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();

  const district = page.locator('#currentDistrict');
  await expect(district).toBeVisible();
  await expect(page.locator('#worldOverview')).toBeHidden();
  await expect(page.locator('#districtLocations [data-map-slot]')).toHaveCount(12);
  await expect(page.locator('#districtLocations [data-location-status="drawing"]')).toHaveCount(12);
  await expect(page.locator('#districtLocations')).toContainText('正在绘制');

  const contract = await page.evaluate(() => ({
    lessons: [...document.querySelectorAll('#districtLocations [data-map-slot]')]
      .map(location => Number(location.dataset.mapLesson)),
    slots: [...document.querySelectorAll('#districtLocations [data-map-slot]')]
      .map(location => Number(location.dataset.mapSlot)),
    drawingInteractivity: document.querySelectorAll(
      '#districtLocations [data-location-status="drawing"] a, ' +
      '#districtLocations [data-location-status="drawing"] button, ' +
      '#districtLocations [data-location-status="drawing"] [tabindex]'
    ).length,
    recommendableDrawings: CanranCore.courseCatalog.MAP_COURSES
      .filter(course => CanranCore.courseCatalog.assessLearningLocation(course).recommendable)
      .length,
    currentDistrictId: JSON.parse(
      localStorage.getItem('canran:adventure-profile:v1')
    ).currentDistrictId
  }));

  expect(contract.lessons).toEqual([49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);
  expect(contract.slots).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  expect(contract.drawingInteractivity).toBe(0);
  expect(contract.recommendableDrawings).toBe(0);
  expect(contract.currentDistrictId).toBe('first-book-49-60');
});

test('a location becomes a real link when the shared publication contract is complete', async ({ page }) => {
  await page.goto('/');

  const rendered = await page.evaluate(() => {
    const course = structuredClone(
      CanranCore.courseCatalog.COURSES.find(candidate => candidate.id === 'lesson49')
    );
    course.map.declaredStatus = 'published';
    course.map.baseAsset = 'assets/adventure-map/lesson49/base.png';
    course.map.stages = course.map.stages.map((stage, index) => ({
      ...stage,
      growthAsset: `assets/adventure-map/lesson49/growth-${index + 1}.png`
    }));
    course.map.souvenir.asset = 'assets/adventure-map/lesson49/food-basket.png';
    course.map.mobilePreview = 'assets/adventure-map/lesson49/mobile-preview.png';
    course.map.regressionTest = 'tests/e2e/lesson49-map.spec.js';

    const model = CanranCore.adventureAtlas.buildLocationModels([course])[0];
    const host = document.createElement('ol');
    host.innerHTML = locationMarkup(model);
    const location = host.querySelector('[data-location-status]');
    const link = location.querySelector('a');
    return {
      status: location.dataset.locationStatus,
      linkCount: location.querySelectorAll('a').length,
      route: link?.getAttribute('href'),
      label: link?.getAttribute('aria-label')
    };
  });

  expect(rendered).toEqual({
    status: 'published',
    linkCount: 1,
    route: '/lesson49/',
    label: '进入 Lesson 49 · 肉店大冒险'
  });
});

test('return visits open the current district and keep an explicit world overview route', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  await page.reload();

  await expect(page.locator('#currentDistrict')).toBeVisible();
  await expect(page.locator('#worldOverview')).toBeHidden();
  await page.getByRole('button', { name: '返回世界总览', exact: true }).click();
  await expect(page.locator('#worldOverview')).toBeVisible();
  await expect(page.getByRole('button', { name: '进入暖灯集市', exact: true })).toBeFocused();
});

test('both atlas levels fit a 390px mobile viewport without zoom or horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const worldWidths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
    atlas: document.getElementById('worldOverview').scrollWidth
  }));
  expect(worldWidths.page).toBe(worldWidths.viewport);
  expect(worldWidths.atlas).toBeLessThanOrEqual(worldWidths.viewport);

  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  const districtWidths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
    atlas: document.getElementById('currentDistrict').scrollWidth
  }));
  expect(districtWidths.page).toBe(districtWidths.viewport);
  expect(districtWidths.atlas).toBeLessThanOrEqual(districtWidths.viewport);
  await expect(page.getByRole('button', { name: '返回世界总览', exact: true })).toBeVisible();
});

test('existing course URLs remain public direct entries', async ({ page }) => {
  await page.goto('/lesson49/');
  await expect(page).toHaveURL(/\/lesson49\/$/);
  await expect(page.locator('body')).toContainText('肉店大冒险');
});
