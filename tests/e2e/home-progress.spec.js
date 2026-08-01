'use strict';

const { test, expect } = require('@playwright/test');

test('welcome page reads normalized v2 totals', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }
    }));
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
    localStorage.setItem('canran:soundmark:progress:v2', JSON.stringify({
      version: 2,
      ratings: { vs: 3, g1: 3, g2: 3, g3: 3 }
    }));
  });

  await page.goto('/');

  await expect(page.locator('#pt49')).toHaveText('15');
  await expect(page.locator('#pt50')).toHaveText('5');
  await expect(page.locator('#ptSM')).toHaveText('12');
});

test('welcome page separates numbered lessons from the special station', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#lessonRoute a[href="/lesson49/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson50/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson51/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson52/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson54/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/soundmark/"]')).toHaveCount(0);
  await expect(page.locator('#specialStation a[href="/soundmark/"]')).toHaveCount(1);
  await expect(page.locator('[data-range-start="49"]')).toHaveAttribute('aria-pressed', 'true');
  const columns = await page.locator('#lessonStations').evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.split(' ').length
  );
  expect(columns).toBe(5);
});

test('welcome page exposes and renders the shared course catalog', async ({ page }) => {
  await page.goto('/');

  const contract = await page.evaluate(() => {
    const catalog = window.CanranCore.courseCatalog;
    return {
      ids: catalog.HOME_COURSES.map(course => course.id),
      deeplyFrozen: Object.isFrozen(catalog.COURSES) &&
        catalog.COURSES.every(course => Object.isFrozen(course)),
      lesson49Location: catalog.assessLearningLocation(
        catalog.COURSES.find(course => course.id === 'lesson49')
      ),
      renderedLessons: [...document.querySelectorAll('#lessonStations [data-lesson]')]
        .map(element => Number(element.dataset.lesson)),
      specialRoute: document.querySelector('#specialStation a')?.getAttribute('href')
    };
  });

  assertCatalogContract(contract);
});

function assertCatalogContract(contract) {
  expect(contract.ids).toEqual([
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53',
    'lesson54', 'lesson55', 'lesson56', 'soundmark'
  ]);
  expect(contract.deeplyFrozen).toBe(true);
  expect(contract.lesson49Location.status).toBe('published');
  expect(contract.lesson49Location.route).toBe('/lesson49/');
  expect(contract.lesson49Location.recommendable).toBe(true);
  expect(contract.lesson49Location.missing).toEqual([]);
  expect(contract.renderedLessons).toEqual([49, 50, 51, 52, 53, 54, 55, 56]);
  expect(contract.specialRoute).toBe('/soundmark/');
}

test('range tickets and numbered search expose one bounded catalogue segment', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-range-start="1"]').click();
  await expect(page.locator('#routeEmpty')).toBeVisible();
  await expect(page.locator('#specialStation')).toBeVisible();

  await page.locator('#lessonSearch').fill('51');
  await page.locator('#lessonSearchForm').press('Enter');
  await expect(page.locator('[data-lesson="51"]')).toBeFocused();

  await page.locator('#lessonSearch').fill('100');
  await page.locator('#lessonSearchForm').press('Enter');
  await expect(page.locator('[data-range-start="97"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#lessonSearchStatus')).toHaveText('Lesson 100 还未加入目录。');
});

test('continue learning chooses the highest-progress unfinished numbered lesson', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2, ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
    localStorage.setItem('canran:l50:progress:v2', JSON.stringify({
      version: 2, ratings: { l1: 2, l2: 2, l3: 2, l4: 2, l5: 2 }
    }));
    localStorage.setItem('canran:l51:progress:v2', JSON.stringify({
      version: 2, ratings: { l1: 1, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
  });
  await page.goto('/');
  await expect(page.locator('#continueCourse')).toHaveAttribute('data-route', '/lesson50/');
  await expect(page.locator('#continueCourse')).toContainText('挑食小王子大冒险');
});

test('home route stays within a 390px viewport while range tickets remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
    range: document.getElementById('rangeTickets').scrollWidth
  }));
  expect(sizes.page).toBe(sizes.viewport);
  expect(sizes.range).toBeGreaterThanOrEqual(sizes.viewport - 36);
  const columns = await page.locator('#lessonStations').evaluate(element =>
    getComputedStyle(element).gridTemplateColumns.split(' ').length
  );
  expect(columns).toBe(1);
});

test('home route loads without browser console or page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  await page.goto('/');
  await expect(page.locator('#lessonStations')).toBeVisible();
  expect(errors).toEqual([]);
});
