'use strict';

const { test, expect } = require('@playwright/test');
const catalog = require('../../core/course-catalog');

const futurePublishedCourses = catalog.PUBLISHED_COURSES.filter(
  course => catalog.directoryMapStatus(course) === 'v2'
);

async function isPerceivableInViewport(locator) {
  if (await locator.count() !== 1 || !await locator.isVisible()) return false;
  return locator.evaluate(element => {
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (current.getAttribute('aria-hidden') === 'true' ||
        Number.parseFloat(style.opacity) <= 0 ||
        style.visibility !== 'visible' ||
        style.display === 'none' ||
        style.contentVisibility === 'hidden') return false;
      if (style.clipPath && style.clipPath !== 'none') return false;
      if (style.clip && style.clip !== 'auto' && /rect\(0(?:px)?[, ]+0(?:px)?[, ]+0(?:px)?[, ]+0(?:px)?\)/.test(style.clip)) {
        return false;
      }
    }
    const box = element.getBoundingClientRect();
    const intersects = box.width > 0 && box.height > 0 &&
      box.right > 0 && box.bottom > 0 &&
      box.left < document.documentElement.clientWidth &&
      box.top < document.documentElement.clientHeight;
    if (!intersects) return false;
    const left = Math.max(0, box.left);
    const right = Math.min(document.documentElement.clientWidth, box.right);
    const top = Math.max(0, box.top);
    const bottom = Math.min(document.documentElement.clientHeight, box.bottom);
    const points = [
      [(left + right) / 2, (top + bottom) / 2],
      [left + 1, top + 1],
      [right - 1, top + 1],
      [left + 1, bottom - 1],
      [right - 1, bottom - 1]
    ];
    return points.some(([x, y]) => {
      const hit = document.elementFromPoint(x, y);
      return hit === element || element.contains(hit);
    });
  });
}

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
  await expect(page.locator('#routeIntro')).toContainText('找指定课号');
  await expect(page.locator('#routeIntro')).toContainText('地图将在 V2 到来');
  await expect(page.locator('#lessonRoute a[href="/lesson49/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson50/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson51/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson52/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/lesson54/"]')).toHaveCount(1);
  await expect(page.locator('#lessonRoute a[href="/soundmark/"]')).toHaveCount(0);
  await expect(page.locator('#specialStation a[href="/soundmark/"]')).toHaveCount(1);
  await expect(page.locator('[data-lesson="49"] [data-map-status="published"]')).toHaveText('地图地点已开放');
  await expect(page.locator('[data-lesson="50"] [data-map-status="drawing"]')).toHaveText('课程可进入 · 地图正在绘制');
  await expect(page.locator('[data-lesson="53"] [data-map-status="drawing"]')).toHaveText('课程尚未开放 · 地图正在绘制');
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
  await expect(page.locator('#lessonSearchStatus')).toHaveText(
    '已定位到 Lesson 51。课程可直接进入，地图正在绘制。'
  );

  await page.locator('#lessonSearch').fill('100');
  await page.locator('#lessonSearchForm').press('Enter');
  await expect(page.locator('[data-range-start="97"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#lessonSearchStatus')).toHaveText('Lesson 100 还未加入目录。');

  await page.locator('#lessonSearch').fill('145');
  await page.locator('#lessonSearchForm').press('Enter');
  await expect(page.locator('#lessonSearchStatus')).toHaveText('请输入 1–144 的 Lesson 编号。');
});

test('a future published lesson renders as a direct directory route without entering the V1 map', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(() => {
    const catalog = window.CanranCore.courseCatalog;
    const source = catalog.requirePublishedCourse('lesson50');
    const future = {
      ...source,
      id: 'lesson61',
      lesson: 61,
      route: '/lesson61/',
      title: '未来课程示例',
      subtitle: 'Future Lesson',
      map: catalog.createLessonMap(61),
      stars: 0,
      max: 15
    };
    future.mapStatus = catalog.directoryMapStatus(future);
    const host = document.createElement('div');
    host.id = 'futureCourseFixture';
    host.innerHTML = window.stationMarkup(future);
    document.body.appendChild(host);
    return {
      mapStatus: future.mapStatus,
      appearsInV1Map: catalog.MAP_COURSES.some(course => course.lesson === 61)
    };
  });

  expect(result).toEqual({ mapStatus: 'v2', appearsInV1Map: false });
  const future = page.locator('#futureCourseFixture [data-lesson="61"]');
  await expect(future).toHaveAttribute('href', '/lesson61/');
  await expect(future.locator('[data-map-status="v2"]')).toHaveText('课程可进入 · 地图将在 V2 到来');
});

test('every future direct course shows its V2 map notice in the rendered page', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const course of futurePublishedCourses) {
      await page.goto(course.route);
      const notice = page.locator('[data-course-map-status="v2"]');
      await expect(notice).toHaveCount(1);
      await notice.scrollIntoViewIfNeeded();
      expect(await isPerceivableInViewport(notice)).toBe(true);
      await expect(notice).toContainText(/地图将在\s*V2\s*到来/);
    }
  }
});

test('browser visibility rejects V2 notices hidden by their context or computed style', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const hiddenFixtures = [
    '<div hidden><p data-course-map-status="v2">地图将在 V2 到来</p></div>',
    '<div aria-hidden="true"><p data-course-map-status="v2">地图将在 V2 到来</p></div>',
    '<template><p data-course-map-status="v2">地图将在 V2 到来</p></template>',
    '<noscript><p data-course-map-status="v2">地图将在 V2 到来</p></noscript>',
    '<style>.concealed{visibility:hidden}</style><p class="concealed" data-course-map-status="v2">地图将在 V2 到来</p>',
    '<p data-course-map-status="v2" style="display:none">地图将在 V2 到来</p>',
    '<div style="opacity:0"><p data-course-map-status="v2">地图将在 V2 到来</p></div>',
    '<p data-course-map-status="v2" style="position:absolute;left:-10000px">地图将在 V2 到来</p>',
    '<p data-course-map-status="v2" style="position:absolute;clip:rect(0,0,0,0)">地图将在 V2 到来</p>',
    '<style>@media(max-width:420px){[data-course-map-status="v2"]{display:none}}</style><p data-course-map-status="v2">地图将在 V2 到来</p>'
  ];
  for (const markup of hiddenFixtures) {
    await page.setContent(markup);
    expect(await isPerceivableInViewport(page.locator('[data-course-map-status="v2"]'))).toBe(false);
  }
  await page.setContent('<p data-course-map-status="v2">课程可进入，地图将在 V2 到来。</p>');
  expect(await isPerceivableInViewport(page.locator('[data-course-map-status="v2"]'))).toBe(true);
});

test('generated course fallback keeps direct routes usable without JavaScript', async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: testInfo.project.use.baseURL
  });
  const page = await context.newPage();
  await page.goto('/');
  const fallback = page.locator('[data-course-catalog-fallback]');
  await expect(fallback).toBeVisible();
  for (const course of catalog.PUBLISHED_COURSES.filter(item => item.directoryVisible)) {
    await expect(fallback.locator(`a[href="${course.route}"]`)).toHaveCount(1);
  }
  await context.close();
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
