'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';

async function enterDistrict(page) {
  await page.getByRole('button', { name: '进入四季生活城', exact: true }).click();
  await expect(page.locator('#currentDistrict')).toBeVisible();
}

test('normalized course progress becomes plaque stamps and numbered-location completion', async ({ page }) => {
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
  await expect(page.locator('#worldCompletedCount')).toHaveText('2');
  await enterDistrict(page);

  await expect(page.locator('[data-location-id="lesson49"] [data-earned="true"]')).toHaveCount(5);
  await expect(page.locator('[data-location-id="lesson50"] [data-earned="true"]')).toHaveCount(5);
  await expect(page.locator('[data-location-id="soundmark"]')).toHaveCount(0);
});

test('the atlas is the only visible student navigation surface', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#worldOverview')).toBeVisible();
  await expect(page.locator('main')).not.toContainText('找指定课号');
  await expect(page.locator('main')).not.toContainText('番外站');
  await expect(page.locator('main')).not.toContainText('继续学习');
  await expect(page.locator('input, select')).toHaveCount(0);
  await expect(page.locator('main a')).toHaveCount(0);

  const focusable = await page.locator('#worldOverview button:not([disabled]), #worldOverview [tabindex="0"]')
    .evaluateAll(elements => elements.map(element => element.getAttribute('aria-label')));
  expect(focusable).toEqual(['设备冒险设置', '进入四季生活城']);
  const hiddenDistrictButtons = page.locator('#currentDistrict button');
  await expect(hiddenDistrictButtons).toHaveCount(4);
  expect(await hiddenDistrictButtons.evaluateAll(buttons =>
    buttons.map(button => button.getAttribute('aria-label'))
  )).toEqual(['返回世界总览', '设备冒险设置', '上一页', '下一页']);
  for (const button of await hiddenDistrictButtons.all()) {
    await expect(button).toBeHidden();
  }
});

test('home exposes the immutable catalog but renders only complete map locations', async ({ page }) => {
  await page.goto('/');
  await enterDistrict(page);

  const contract = await page.evaluate(() => {
    const catalog = window.CanranCore.courseCatalog;
    return {
      deeplyFrozen: Object.isFrozen(catalog.COURSES) &&
        catalog.COURSES.every(course => Object.isFrozen(course)),
      publishedMapIds: catalog.MAP_COURSES
        .filter(course => catalog.assessLearningLocation(course).status === 'published')
        .map(course => course.id),
      renderedIds: [...document.querySelectorAll('[data-location-id]')]
        .map(element => element.dataset.locationId)
    };
  });

  expect(contract.deeplyFrozen).toBe(true);
  expect(contract.publishedMapIds).toEqual([
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark'
  ]);
  expect(contract.renderedIds).toEqual([
    'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54'
  ]);
});

test('recent unfinished route location is marked by the explorer cat without a recommendation card', async ({ page }) => {
  await page.addInitScript(profileKey => {
    localStorage.setItem(profileKey, JSON.stringify({
      version: 2,
      currentDistrictId: 'first-book-49-60',
      lastVisitedLocationId: 'lesson51',
      souvenirs: [],
      completedStages: { lesson49: ['l1'], lesson51: ['l1', 'l2'] },
      courseRevealSeen: { lesson49: ['l1'], lesson51: ['l1', 'l2'] },
      pendingMapChanges: {},
      mapChangeSeen: { lesson49: ['l1'], lesson51: ['l1', 'l2'] }
    }));
  }, PROFILE_KEY);

  await page.goto('/?district=first-book-49-60&focus=lesson51');
  await expect(page.locator('[data-map-guidance="active"]')).toHaveAttribute(
    'data-location-id', 'lesson51'
  );
  await expect(page.locator('#routeMascot')).toHaveAttribute('data-route-avatar-target', 'lesson51');
  await expect(page.locator('.location-guide')).toHaveCount(0);
  await expect(page.locator('#districtRecommendation')).toHaveCount(0);
});

test('all numbered locations complete leaves no forced recommendation', async ({ page }) => {
  await page.addInitScript(profileKey => {
    const complete = ['l1', 'l2', 'l3', 'l4', 'l5'];
    localStorage.setItem(profileKey, JSON.stringify({
      version: 2,
      currentDistrictId: 'first-book-49-60',
      lastVisitedLocationId: 'lesson54',
      souvenirs: [],
      completedStages: {
        lesson49: complete,
        lesson50: complete,
        lesson51: complete,
        lesson52: complete,
        lesson53: complete,
        lesson54: complete
      },
      courseRevealSeen: {},
      pendingMapChanges: {},
      mapChangeSeen: {}
    }));
  }, PROFILE_KEY);

  await page.goto('/');
  await enterDistrict(page);
  await expect(page.locator('[data-map-guidance="active"]')).toHaveCount(0);
  await expect(page.locator('#routeMascot')).toHaveAttribute('data-route-avatar-target', 'route-exit');
  await page.getByRole('button', { name: '返回世界总览', exact: true }).click();
  await expect(page.locator('#worldCompletedCount')).toHaveText('6');
});

test('returning from a course shows one merged map update and consumes it only after display', async ({ page }) => {
  await page.addInitScript(profileKey => {
    localStorage.setItem('canran:l49:progress:v2', JSON.stringify({
      version: 2,
      ratings: { l1: 2, l2: 1, l3: 0, l4: 0, l5: 0 }
    }));
    localStorage.setItem(profileKey, JSON.stringify({
      version: 2,
      currentDistrictId: 'first-book-49-60',
      lastVisitedLocationId: 'lesson49',
      souvenirs: [],
      completedStages: { lesson49: ['l1', 'l2'] },
      courseRevealSeen: { lesson49: ['l1', 'l2'] },
      pendingMapChanges: { lesson49: ['l2', 'l1'] },
      mapChangeSeen: { lesson49: [] }
    }));
  }, PROFILE_KEY);

  await page.goto('/?district=first-book-49-60&focus=lesson49');
  await expect(page.locator('[data-location-id="lesson49"] .new-change-sticker')).toHaveText('新变化');
  await expect(page.locator('#mapUpdateToast')).toContainText('这里新增了 2 处变化');
  await expect(page.locator('#mapUpdateToast')).toBeHidden({ timeout: 4_000 });

  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), PROFILE_KEY);
  expect(after.pendingMapChanges.lesson49).toEqual([]);
  expect(after.mapChangeSeen.lesson49).toEqual(['l1', 'l2']);
  expect(after.completedStages.lesson49).toEqual(['l1', 'l2']);

  await page.reload();
  await expect(page.locator('#mapUpdateToast')).toBeHidden();
  await expect(page.locator('[data-location-id="lesson49"] .new-change-sticker')).toHaveCount(0);
});
