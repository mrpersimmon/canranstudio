'use strict';

const { test, expect } = require('@playwright/test');

const REVIEW_PATH = '/poc/landmark-review/';

test('the noindex review route restores URL state without touching learner storage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('review-sentinel', 'local');
    sessionStorage.setItem('review-sentinel', 'session');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  const response = await page.goto(
    `${REVIEW_PATH}?location=lesson51&stage=3&review=art&viewport=huawei`
  );

  expect(response.status()).toBe(200);
  expect(errors).toEqual([]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('[data-location-picker] option')).toHaveCount(7);
  await expect(page.locator('[data-location-picker]')).toHaveValue('lesson51');
  await expect(page.locator('[data-stage-button][aria-pressed="true"]')).toHaveText('3');
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /lesson51\/states\/state-3\.png/);

  expect(await page.evaluate(() => ({
    local: Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])),
    session: Object.fromEntries(Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])),
    cookie: document.cookie
  }))).toEqual({
    local: { 'review-sentinel': 'local' },
    session: { 'review-sentinel': 'session' },
    cookie: ''
  });
});

test('stage changes are instant, replace the URL, and press-hold reveals only the previous state', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson49&stage=1&review=art&viewport=huawei`);

  await page.getByRole('button', { name: '阶段 4' }).click();
  await expect(page).toHaveURL(/location=lesson49&stage=4&review=art&viewport=huawei/);
  await expect(page.locator('[data-current-art]')).toHaveAttribute('data-source-path', /state-4\.png/);

  const artboard = page.locator('[data-artboard]');
  await artboard.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', isPrimary: true });
  await expect(artboard).toHaveAttribute('data-previewing-previous', 'true');
  await expect(page.locator('[data-current-art]')).toHaveAttribute('data-source-path', /state-3\.png/);
  await expect(page).toHaveURL(/stage=4/);

  await artboard.dispatchEvent('pointercancel', { pointerId: 1, pointerType: 'touch', isPrimary: true });
  await expect(artboard).toHaveAttribute('data-previewing-previous', 'false');
  await expect(page.locator('[data-current-art]')).toHaveAttribute('data-source-path', /state-4\.png/);

  await page.reload();
  await expect(page.locator('[data-current-art]')).toHaveAttribute('data-source-path', /state-4\.png/);
});

test('placement view exists only for the official route page and keeps other landmarks at state zero', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=placement&viewport=tablet`);

  await expect(page.locator('[data-placement-map]')).toBeVisible();
  await expect(page.locator('[data-placement-location]')).toHaveCount(4);
  await expect(page.locator('[data-placement-location][data-location-id="lesson51"]')).toHaveAttribute('data-stage', '3');
  for (const id of ['lesson49', 'lesson50', 'lesson52']) {
    await expect(page.locator(`[data-placement-location][data-location-id="${id}"]`))
      .toHaveAttribute('data-stage', '0');
  }

  await page.locator('[data-location-picker]').selectOption('lesson53');
  await expect(page).toHaveURL(/location=lesson53&stage=3&review=art&viewport=tablet/);
  await expect(page.locator('[data-review-button="placement"]')).toHaveCount(0);
  await expect(page.locator('[data-placement-map]')).toHaveCount(0);
});

test('all three observation sizes stay inside the page at phone and tablet widths', async ({ page }) => {
  for (const viewport of [
    { width: 466, height: 980 },
    { width: 768, height: 1024 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${REVIEW_PATH}?location=lesson51&stage=5&review=art&viewport=huawei`);

    for (const mode of ['huawei', 'tablet', 'master']) {
      await page.locator(`[data-viewport-button="${mode}"]`).click();
      await expect(page.locator('[data-review-frame]')).toHaveAttribute('data-viewport', mode);
      expect(await page.evaluate(() => document.documentElement.scrollWidth))
        .toBe(await page.evaluate(() => document.documentElement.clientWidth));
      const imageRatio = await page.locator('[data-current-art]').evaluate(image => {
        const box = image.getBoundingClientRect();
        return box.width / box.height;
      });
      expect(imageRatio).toBeCloseTo(1, 2);
    }
  }
});

test('the child atlas does not expose a link to the review bench', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="landmark-review"]')).toHaveCount(0);
});

test('review bench prepares every stage at all three inspection sizes for the selected landmark', async ({ page }) => {
  const stateRequests = new Set();
  page.on('request', request => {
    const match = request.url().match(
      /adventure-map\/(lesson\d+|soundmark)\/states\/state-(\d+)-(512|768|1024)\.(avif|webp)/
    );
    if (match) stateRequests.add(`${match[1]}:${match[2]}:${match[3]}`);
  });

  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=art&viewport=huawei`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('[data-review-preload-count]')).toHaveText('18/18');

  expect([...stateRequests].sort()).toEqual(
    Array.from({ length: 6 }, (_, stage) => [512, 768, 1024]
      .map(width => `lesson51:${stage}:${width}`))
      .flat()
      .sort()
  );
});

test('ready landmark stages are shared across stage, review, and viewport changes', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=art&viewport=huawei`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');

  const selectedLandmarkRequests = [];
  page.on('request', request => {
    if (/adventure-map\/lesson51\/states\//.test(request.url())) {
      selectedLandmarkRequests.push(request.url());
    }
  });

  const stageSwitchMs = await page.evaluate(() => new Promise(resolve => {
    const start = performance.now();
    document.querySelector('[data-stage-button="5"]').click();
    const check = () => {
      if (document.querySelector('[data-artboard]')?.dataset.displayedStage === '5') {
        resolve(performance.now() - start);
      } else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }));
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /^blob:/);
  const reviewSwitchMs = await page.evaluate(() => new Promise(resolve => {
    const start = performance.now();
    document.querySelector('[data-review-button="placement"]').click();
    const check = () => {
      if (document.querySelector('[data-placement-map]')) resolve(performance.now() - start);
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }));
  const viewportSwitchMs = await page.evaluate(() => new Promise(resolve => {
    const start = performance.now();
    document.querySelector('[data-viewport-button="master"]').click();
    const check = () => {
      if (document.querySelector('[data-review-frame]')?.dataset.viewport === 'master') {
        resolve(performance.now() - start);
      } else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }));

  await expect(page.locator('[data-placement-location][data-location-id="lesson51"] [data-current-art]'))
    .toHaveAttribute('src', /^blob:/);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');
  expect(selectedLandmarkRequests).toEqual([]);
  expect(Math.max(stageSwitchMs, reviewSwitchMs, viewportSwitchMs)).toBeLessThan(100);
});

test('an uncached stage keeps the current art visible while the selected target jumps the queue', async ({ page }) => {
  await page.route(/lesson51\/states\/state-5-512\.avif/, async route => {
    await new Promise(resolve => setTimeout(resolve, 650));
    await route.continue();
  });
  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=0&review=art&viewport=huawei`);
  const currentArt = page.locator('[data-current-art]');
  const originalSource = await currentArt.getAttribute('src');

  await page.getByRole('button', { name: '阶段 完成' }).click();
  await expect(page.locator('[data-review-frame]')).toHaveAttribute('data-pending-stage', '5');
  await page.waitForTimeout(120);
  await expect(currentArt).toHaveAttribute('src', originalSource);

  await expect(page.locator('[data-review-frame]')).not.toHaveAttribute('data-pending-stage', '5');
  await expect(page.locator('[data-artboard]')).toHaveAttribute('data-displayed-stage', '5');
  await expect(page.locator('[data-current-art]')).toHaveAttribute('src', /^blob:/);
});

test('a failed preferred format retries twice and then uses the compatible format', async ({ page }) => {
  let avifAttempts = 0;
  let webpAttempts = 0;
  await page.route(/lesson51\/states\/state-2-768\.avif/, route => {
    avifAttempts += 1;
    return route.abort('failed');
  });
  await page.route(/lesson51\/states\/state-2-768\.webp/, route => {
    webpAttempts += 1;
    return route.continue();
  });

  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=0&review=art&viewport=huawei`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('[data-review-preload-detail]')).toContainText('兼容格式 1');
  expect(avifAttempts).toBe(3);
  expect(webpAttempts).toBe(1);
});

test('an exhausted resource is identified and can be retried without restarting the landmark', async ({ page }) => {
  let failing = true;
  const failingResource = /lesson51\/states\/(?:state-2-768\.(?:avif|webp)|state-2\.png)/;
  await page.route(failingResource, route => (
    failing ? route.abort('failed') : route.continue()
  ));

  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=0&review=art&viewport=huawei`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'failed');
  await expect(page.locator('[data-review-preload-detail]')).toContainText('Stage 2 · 768px');
  await expect(page.locator('[data-review-retry]')).toBeVisible();

  failing = false;
  await page.locator('[data-review-retry]').click();
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('[data-review-preload-count]')).toHaveText('18/18');
  await expect(page.locator('[data-review-retry]')).toBeHidden();
});

test('cold-cache recheck reloads only the current landmark resources', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=art&viewport=tablet`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');

  const recheckRequests = new Set();
  page.on('request', request => {
    const match = request.url().match(
      /adventure-map\/(lesson\d+|soundmark)\/states\/state-(\d+)-(512|768|1024)\.(avif|webp)/
    );
    if (match) recheckRequests.add(`${match[1]}:${match[2]}:${match[3]}`);
  });
  await page.route(/lesson51\/states\/state-\d+-(?:512|768|1024)\.avif/, async route => {
    await new Promise(resolve => setTimeout(resolve, 25));
    await route.continue();
  });

  await page.locator('[data-review-recheck]').click();
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'loading');
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');

  expect([...recheckRequests].sort()).toEqual(
    Array.from({ length: 6 }, (_, stage) => [512, 768, 1024]
      .map(width => `lesson51:${stage}:${width}`))
      .flat()
      .sort()
  );
});

test('a refreshed review restores every prepared size from the versioned cache', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=art&viewport=tablet`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');

  await page.reload();
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('[data-review-preload-detail]')).toContainText('缓存命中 18');
});

test('stage count comes from the selected location contract', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=soundmark&stage=4&review=art&viewport=master`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('[data-review-preload-count]')).toHaveText('15/15');
});

test('switching landmarks stops the old queue before starting the new contract', async ({ page }) => {
  let switched = false;
  const oldRequestsAfterSwitch = [];
  page.on('request', request => {
    if (switched && /adventure-map\/lesson49\/states\//.test(request.url())) {
      oldRequestsAfterSwitch.push(request.url());
    }
  });
  await page.route(/lesson49\/states\/state-\d+-(?:512|768|1024)\.avif/, async route => {
    await new Promise(resolve => setTimeout(resolve, 90));
    await route.continue();
  });

  await page.goto(`${REVIEW_PATH}?location=lesson49&stage=0&review=art&viewport=huawei`);
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'loading');
  switched = true;
  await page.locator('[data-location-picker]').selectOption('lesson52');

  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-location-id', 'lesson52');
  await expect(page.locator('[data-review-preload-status]')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('[data-review-preload-count]')).toHaveText('18/18');
  expect(oldRequestsAfterSwitch).toEqual([]);
});
