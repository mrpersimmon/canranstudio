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

test('placement view resolves each review page and never renders unpublished landmarks', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?location=lesson51&stage=3&review=placement&viewport=tablet`);

  await expect(page.locator('[data-placement-map]')).toBeVisible();
  await expect(page.locator('[data-placement-location]')).toHaveCount(4);
  await expect(page.locator('[data-placement-location][data-location-id="lesson51"]')).toHaveAttribute('data-stage', '3');
  for (const id of ['lesson49', 'lesson50', 'lesson52']) {
    await expect(page.locator(`[data-placement-location][data-location-id="${id}"]`))
      .toHaveAttribute('data-stage', '0');
  }

  await page.locator('[data-location-picker]').selectOption('lesson53');
  await expect(page).toHaveURL(/location=lesson53&stage=3&review=placement&viewport=tablet/);
  await expect(page.locator('[data-placement-map]')).toHaveAttribute(
    'data-route-page-id', 'district5-page2-review'
  );
  await expect(page.locator('[data-placement-map]')).toHaveAttribute('aria-label', '气候家庭街地图落位');
  await expect(page.locator('[data-placement-location]')).toHaveCount(2);
  await expect(page.locator('[data-placement-location][data-location-id="lesson53"]'))
    .toHaveAttribute('data-stage', '3');
  await expect(page.locator('[data-placement-location][data-location-id="lesson54"]'))
    .toHaveAttribute('data-stage', '0');
  await expect(page.locator('[data-placement-location][data-location-id="lesson55"]')).toHaveCount(0);
  await expect(page.locator('[data-placement-location][data-location-id="lesson56"]')).toHaveCount(0);

  await page.locator('[data-location-picker]').selectOption('soundmark');
  await expect(page).toHaveURL(/location=soundmark&stage=3&review=art&viewport=tablet/);
  await expect(page.locator('[data-review-button="placement"]')).toHaveCount(0);
  await expect(page.locator('[data-placement-map]')).toHaveCount(0);
});

test('student preview renders one complete four-landmark route page on phones', async ({ page }) => {
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto(
    `${REVIEW_PATH}?location=lesson51&stage=3&review=student&viewport=huawei&scenario=journey`
  );

  const preview = page.locator('[data-student-preview]');
  await expect(preview).toHaveAttribute('data-layout', 'single');
  await expect(preview).toHaveAttribute('data-simulated-width', '466');
  await expect(preview).toHaveAttribute('data-simulated-height', '980');
  await expect(page.locator('[data-student-route-page]')).toHaveCount(1);
  await expect(page.locator('[data-student-route-page]')).toHaveAttribute(
    'data-route-page-id', 'district5-page1'
  );
  await expect(page.locator('[data-student-location]')).toHaveCount(4);
  await expect(page.locator('[data-student-location][data-location-id="lesson49"]')).toHaveAttribute('data-stage', '5');
  await expect(page.locator('[data-student-location][data-location-id="lesson50"]')).toHaveAttribute('data-stage', '5');
  await expect(page.locator('[data-student-location][data-location-id="lesson51"]'))
    .toHaveAttribute('data-current', 'true');
  await expect(page.locator('[data-student-location][data-location-id="lesson51"]')).toHaveAttribute('data-stage', '3');
  await expect(page.locator('[data-student-location][data-location-id="lesson52"]')).toHaveAttribute('data-stage', '0');
  await expect(page.locator('[data-scenario-tabs]')).toBeVisible();
});

test('desktop student preview uses the fixed two-page spread and scenario controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(
    `${REVIEW_PATH}?location=lesson54&stage=4&review=student&viewport=desktop&scenario=journey`
  );

  const preview = page.locator('[data-student-preview]');
  await expect(preview).toHaveAttribute('data-layout', 'spread');
  await expect(page.locator('[data-student-route-page]')).toHaveCount(2);
  await expect(page.locator('[data-page-name]')).toHaveText(['风味四季路', '气候家庭街']);
  await expect(page.locator('[data-page-name="district5-page2-review"]')).toHaveAttribute('data-current', 'true');
  await expect(page.locator('[data-student-location]')).toHaveCount(6);

  await page.locator('[data-scenario-button="complete"]').click();
  await expect(page).toHaveURL(/scenario=complete/);
  await expect(page.locator('[data-student-location][data-stage="5"]')).toHaveCount(6);
});

test('student preview page turns and landmark probes never navigate or write learner storage', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('review-sentinel', 'untouched'));
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto(
    `${REVIEW_PATH}?location=lesson51&stage=3&review=student&viewport=huawei&scenario=journey`
  );

  await page.locator('[data-student-location][data-location-id="lesson51"]').click();
  await expect(page.locator('[data-student-message]')).toContainText('Lesson 51');
  await expect(page).toHaveURL(/location=lesson51/);
  expect(await page.evaluate(() => localStorage.getItem('review-sentinel'))).toBe('untouched');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['review-sentinel']);

  await page.locator('[data-page-turn="next"]').click();
  await expect(page).toHaveURL(/location=lesson53/);
  await expect(page.locator('[data-student-route-page]')).toHaveAttribute(
    'data-route-page-id', 'district5-page2-review'
  );
  await expect(page.locator('[data-page-turn="previous"]')).toContainText('风味四季路');
});

test('student preview waits for the whole visible page and shows feedback after 180ms', async ({ page }) => {
  await page.route(/district5-page1\/background-.*\.(?:avif|webp)/, async route => {
    await new Promise(resolve => setTimeout(resolve, 520));
    await route.continue();
  });
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto(
    `${REVIEW_PATH}?location=lesson51&stage=3&review=student&viewport=huawei&scenario=journey`,
    { waitUntil: 'domcontentloaded' }
  );

  await expect(page.locator('[data-student-preview]')).toHaveAttribute('data-ready', 'false');
  await expect(page.locator('[data-student-loader]')).toBeVisible();
  await expect(page.locator('[data-student-preview]')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-student-loader]')).toBeHidden();
});

test('empty-map swipe turns pages while a drag beginning on a landmark does not', async ({ page }) => {
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto(
    `${REVIEW_PATH}?location=lesson51&stage=3&review=student&viewport=huawei&scenario=journey`
  );

  const landmark = page.locator('[data-student-location][data-location-id="lesson51"]');
  const landmarkBox = await landmark.boundingBox();
  await landmark.dispatchEvent('pointerdown', {
    pointerId: 7,
    pointerType: 'touch',
    isPrimary: true,
    clientX: landmarkBox.x + landmarkBox.width * .8,
    clientY: landmarkBox.y + landmarkBox.height * .5
  });
  await landmark.dispatchEvent('pointerup', {
    pointerId: 7,
    pointerType: 'touch',
    isPrimary: true,
    clientX: landmarkBox.x + landmarkBox.width * .2,
    clientY: landmarkBox.y + landmarkBox.height * .5
  });
  await page.waitForTimeout(330);
  await expect(page).toHaveURL(/location=lesson51/);

  const book = page.locator('[data-student-book]');
  const bookBox = await book.boundingBox();
  await book.dispatchEvent('pointerdown', {
    pointerId: 9,
    pointerType: 'touch',
    isPrimary: true,
    clientX: bookBox.x + bookBox.width * .75,
    clientY: bookBox.y + bookBox.height * .55
  });
  await book.dispatchEvent('pointerup', {
    pointerId: 9,
    pointerType: 'touch',
    isPrimary: true,
    clientX: bookBox.x + bookBox.width * .25,
    clientY: bookBox.y + bookBox.height * .55
  });
  await expect(page).toHaveURL(/location=lesson53/);
});

test('all five student-preview sizes preserve complete page geometry without distortion', async ({ page }) => {
  const cases = [
    { mode: 'iphone', location: 'lesson51', layout: 'single', pages: 1 },
    { mode: 'huawei', location: 'lesson51', layout: 'single', pages: 1 },
    { mode: 'tablet', location: 'lesson51', layout: 'single', pages: 1 },
    { mode: 'desktop', location: 'lesson54', layout: 'spread', pages: 2 },
    { mode: 'master', location: 'lesson54', layout: 'single', pages: 1 }
  ];

  for (const item of cases) {
    await page.goto(
      `${REVIEW_PATH}?location=${item.location}&stage=3&review=student&viewport=${item.mode}&scenario=journey`
    );
    const preview = page.locator('[data-student-preview]');
    await expect(preview).toHaveAttribute('data-layout', item.layout);
    await expect(preview).toHaveAttribute('data-ready', 'true');
    await expect(page.locator('[data-student-route-page]')).toHaveCount(item.pages);

    const geometry = await preview.evaluate(element => {
      const previewBox = element.getBoundingClientRect();
      const pages = [...element.querySelectorAll('[data-student-route-page]')].map(pageElement => {
        const pageBox = pageElement.getBoundingClientRect();
        const locations = [...pageElement.querySelectorAll('[data-student-location]')].map(location => {
          const box = location.getBoundingClientRect();
          return {
            left: box.left - pageBox.left,
            right: pageBox.right - box.right,
            top: box.top - pageBox.top,
            bottom: pageBox.bottom - box.bottom
          };
        });
        return { ratio: pageBox.width / pageBox.height, locations };
      });
      return {
        previewWidth: previewBox.width,
        previewHeight: previewBox.height,
        simulatedWidth: Number(element.dataset.simulatedWidth),
        simulatedHeight: Number(element.dataset.simulatedHeight),
        pages
      };
    });
    expect(geometry.previewWidth / geometry.previewHeight)
      .toBeCloseTo(geometry.simulatedWidth / geometry.simulatedHeight, 2);
    for (const routePage of geometry.pages) {
      expect(routePage.ratio).toBeCloseTo(940 / 1672, 2);
      for (const location of routePage.locations) {
        expect(Math.min(location.left, location.right, location.top, location.bottom))
          .toBeGreaterThanOrEqual(-1);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(await page.evaluate(() => document.documentElement.clientWidth));
  }
});

test('the Lesson 53–56 review page keeps its authored ratio and published landmarks inside every viewport', async ({ page }) => {
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto(`${REVIEW_PATH}?location=lesson53&stage=5&review=placement&viewport=huawei`);

  for (const mode of ['huawei', 'tablet', 'master']) {
    await page.locator(`[data-viewport-button="${mode}"]`).click();
    const map = page.locator('[data-placement-map]');
    await expect(map).toHaveAttribute('data-route-page-id', 'district5-page2-review');
    await expect(map.locator('.placement-map__background')).toHaveAttribute(
      'src', /district5-page2\/background-review-v1\.png/
    );
    const geometry = await page.evaluate(() => {
      const mapElement = document.querySelector('[data-placement-map]');
      const mapBox = mapElement.getBoundingClientRect();
      const locations = [...document.querySelectorAll('[data-placement-location]')]
        .map(element => {
          const box = element.getBoundingClientRect();
          return {
            left: box.left - mapBox.left,
            right: mapBox.right - box.right,
            top: box.top - mapBox.top,
            bottom: mapBox.bottom - box.bottom
          };
        });
      return {
        ratio: mapBox.width / mapBox.height,
        locations,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });
    expect(geometry.ratio).toBeCloseTo(940 / 1672, 2);
    expect(geometry.scrollWidth).toBe(geometry.clientWidth);
    expect(geometry.locations).toHaveLength(2);
    for (const location of geometry.locations) {
      expect(Math.min(location.left, location.right, location.top, location.bottom)).toBeGreaterThanOrEqual(0);
    }
  }
});

test('all five observation sizes stay inside the page at phone and tablet widths', async ({ page }) => {
  for (const viewport of [
    { width: 466, height: 980 },
    { width: 768, height: 1024 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${REVIEW_PATH}?location=lesson51&stage=5&review=art&viewport=huawei`);

    for (const mode of ['iphone', 'huawei', 'tablet', 'desktop', 'master']) {
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
