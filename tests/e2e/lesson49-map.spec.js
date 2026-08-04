'use strict';

const { test, expect } = require('@playwright/test');

const PROFILE_KEY = 'canran:adventure-profile:v1';
const L49_PROGRESS_KEY = 'canran:l49:progress:v2';
const MAP_RETURN = '/?district=first-book-49-60&focus=lesson49';

async function finishRealListeningStage(page) {
  await page.locator('#lgStartBtn').click();
  for (let round = 0; round < 8; round += 1) {
    const answer = await page.evaluate(() => window.eval('LG.cur.en'));
    await page.locator('#lgOpts .opt-btn').filter({ hasText: answer })
      .evaluate(button => button.click());
    await expect.poll(() => page.evaluate(() => window.eval('LG.round')), { timeout: 5_000 })
      .toBe(round + 1);
  }
  await expect(page.locator('#lgResult')).toBeVisible({ timeout: 2_500 });
}

test('Lesson 49 real completion advances one complete snapshot, returns to the landmark, and persists the souvenir', async ({ page }) => {
  test.setTimeout(90_000);
  await page.addInitScript(({ profileKey, progressKey }) => {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value() {
        queueMicrotask(() => this.dispatchEvent(new Event('ended')));
        return Promise.resolve();
      }
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        getVoices: () => [],
        addEventListener: () => {},
        removeEventListener: () => {},
        speak: utterance => queueMicrotask(() => utterance.onend?.()),
        cancel: () => {}
      }
    });
    if (sessionStorage.getItem('lesson49-map-seeded') === 'yes') return;
    localStorage.setItem(progressKey, JSON.stringify({
      version: 2,
      ratings: { l1: 0, l2: 1, l3: 0, l4: 0, l5: 0 }
    }));
    localStorage.setItem(profileKey, JSON.stringify({
      version: 2,
      currentDistrictId: 'first-book-49-60',
      lastVisitedLocationId: 'lesson49',
      souvenirs: [],
      completedStages: { lesson49: ['l2'] },
      courseRevealSeen: { lesson49: ['l2'] },
      pendingMapChanges: {},
      mapChangeSeen: { lesson49: ['l2'] }
    }));
    sessionStorage.setItem('lesson49-map-seeded', 'yes');
  }, { profileKey: PROFILE_KEY, progressKey: L49_PROGRESS_KEY });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(MAP_RETURN);

  const landmark = page.locator('[data-location-id="lesson49"]');
  await expect(landmark).toHaveAttribute('data-map-guidance', 'active');
  await expect(landmark.locator('[data-landmark-snapshot="1"]')).toHaveCount(1);
  await expect(landmark.locator('[data-souvenir-id]')).toHaveCount(0);
  const initialMarkerBox = await landmark.locator('.landmark-stack').boundingBox();

  await landmark.getByRole('link').click();
  await finishRealListeningStage(page);
  const reveal = page.locator('.growth-reveal');
  await expect(reveal).toBeVisible();
  await expect(reveal).toContainText('新鲜展示台');
  await page.waitForTimeout(750);
  await reveal.click({ position: { x: 8, y: 8 } });
  await expect(reveal).toBeHidden();

  await page.locator(`a[href="${MAP_RETURN}"]`).first().click();
  await expect(page.locator('#currentDistrict')).toBeVisible();
  await expect(landmark.locator('[data-landmark-snapshot="2"]')).toHaveCount(1);
  expect((await landmark.locator('.landmark-stack').boundingBox()).width)
    .toBeCloseTo(initialMarkerBox.width, 4);
  const profileAfterStage = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), PROFILE_KEY);
  expect(profileAfterStage.completedStages.lesson49).toEqual(['l1', 'l2']);

  await page.evaluate(({ profileKey, progressKey }) => {
    localStorage.setItem(progressKey, JSON.stringify({
      version: 2,
      ratings: { l1: 3, l2: 1, l3: 1, l4: 1, l5: 1 }
    }));
    localStorage.setItem(profileKey, JSON.stringify({
      version: 1,
      currentDistrictId: 'first-book-49-60',
      completedStages: { lesson49: ['l1', 'l2', 'l3', 'l4', 'l5'] }
    }));
  }, { profileKey: PROFILE_KEY, progressKey: L49_PROGRESS_KEY });
  await page.reload();

  await expect(landmark.locator('[data-landmark-snapshot="5"]')).toHaveCount(1);
  await expect(landmark.locator('[data-souvenir-id="food-basket"]')).toBeVisible();
  await expect(page.locator('[data-map-guidance="active"]')).toHaveAttribute('data-location-id', 'lesson50');
  await expect(landmark.getByRole('link')).toHaveAccessibleName(/学习进度 5\/5/);
  await expect(landmark.locator('.landmark-stack img')).toHaveCount(1);

  await page.getByRole('button', { name: '设备冒险设置' }).click();
  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '确认重开', exact: true }).click();
  await expect(page.locator('#worldOverview')).toBeVisible();
  await page.getByRole('button', { name: '进入暖灯集市', exact: true }).click();
  await expect(landmark.locator('[data-landmark-snapshot="0"]')).toHaveCount(1);
  await expect(landmark.locator('[data-souvenir-id]')).toHaveCount(0);
  await expect(page.locator('[data-map-guidance="active"]')).toHaveAttribute('data-location-id', 'lesson49');
});

test('a completed numbered district has no review recommendation and never duplicates landmarks', async ({ page }) => {
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
        lesson54: complete
      }
    }));
  }, PROFILE_KEY);

  await page.goto(MAP_RETURN);
  await expect(page.locator('[data-map-guidance]')).toHaveCount(0);
  await expect(page.locator('#districtRecommendation')).toHaveCount(0);
  await expect(page.locator('#districtLocations a[href="/lesson49/"]')).toHaveCount(1);
  await expect(page.locator('[data-location-id="lesson49"] .landmark-stack')).toHaveCount(1);
});
