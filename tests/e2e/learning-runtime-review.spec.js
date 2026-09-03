'use strict';

const { test, expect } = require('@playwright/test');
const { TEST_ORIGIN } = require('../support/test-origin');

const REVIEW_PATH = '/poc/learning-runtime-review/';

test('the noindex learning review restores a fixture without touching learner storage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('learning-review-sentinel', 'untouched');
    sessionStorage.setItem('learning-review-sentinel', 'untouched');
  });
  const externalRequests = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== TEST_ORIGIN) externalRequests.push(request.url());
  });

  const response = await page.goto(
    `${REVIEW_PATH}?beat=discover&state=ready&viewport=iphone12&microstep=task&motion=reduced`
  );

  expect(response.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('[data-learning-review-root]')).toHaveAttribute('data-beat', 'discover');
  await expect(page.locator('[data-learning-review-root]')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('[data-learning-review-root]')).toHaveAttribute('data-viewport', 'iphone12');
  await expect(page.locator('[data-learning-review-root]')).toHaveAttribute('data-microstep', 'task');
  await expect(page.locator('[data-learning-review-root]')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('[data-review-controls]')).toBeVisible();
  await expect(page.locator('[data-child-scene]')).toBeVisible();
  expect(await page.evaluate(() => ({
    local: localStorage.getItem('learning-review-sentinel'),
    session: sessionStorage.getItem('learning-review-sentinel'),
    keys: Object.keys(localStorage)
  }))).toEqual({ local: 'untouched', session: 'untouched', keys: ['learning-review-sentinel'] });
  expect(externalRequests).toEqual([]);
});

test('microstep and motion fixtures are shareable and expose audio lifecycle states', async ({ page }) => {
  const root = page.locator('[data-learning-review-root]');
  await page.goto(`${REVIEW_PATH}?beat=understand&state=ready&viewport=iphone12&microstep=audio-waiting&motion=full`);
  await expect(root).toHaveAttribute('data-microstep', 'audio-waiting');
  await expect(root).toHaveAttribute('data-runtime-microstep', 'understand-audio');
  await expect(page.locator('[data-audio-status]')).toContainText('等待播放');

  await page.locator('[data-microstep-controls] button[data-value="audio-playing"]').click();
  await expect(page).toHaveURL(/microstep=audio-playing/);
  await expect(root).toHaveAttribute('data-runtime-audio-status', 'playing');
  await expect(page.locator('[data-audio-status]')).toContainText('正在播放');

  await page.locator('[data-microstep-controls] button[data-value="audio-completed"]').click();
  await expect(root).toHaveAttribute('data-runtime-microstep', 'understand-check');
  await expect(page.locator('[data-audio-status]')).toContainText('播放完成');

  await page.locator('[data-microstep-controls] button[data-value="audio-fallback"]').click();
  await expect(root).toHaveAttribute('data-runtime-effects', /audio\/fallback/);
  await expect(page.locator('[data-audio-status]')).toContainText('无声替代');

  await page.locator('[data-motion-controls] button[data-value="reduced"]').click();
  await expect(page).toHaveURL(/motion=reduced/);
  await expect(root).toHaveAttribute('data-motion', 'reduced');
});

test('review controls expose the five beats without leaking the answer after a first error', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?beat=discover&state=ready&viewport=huawei`);

  await page.locator('[data-beat-controls] button[data-value="teach"]').click();
  await expect(page).toHaveURL(/beat=teach&state=ready&viewport=huawei/);
  await expect(page.locator('[data-learning-review-root]')).toHaveAttribute('data-beat', 'teach');
  await expect(page.locator('[data-mission-title]')).toContainText('doesn’t likes');

  await page.locator('[data-state-controls] button[data-value="first-error"]').click();
  const childScene = page.locator('[data-child-scene]');
  await expect(page).toHaveURL(/beat=teach&state=first-error&viewport=huawei/);
  await expect(page.locator('[data-feedback]')).toContainText('重新观察');
  await expect(childScene).not.toContainText('正确形式是 like');
});

test('model and near-transfer fixtures show genuinely different contexts without revealing an answer', async ({ page }) => {
  const scene = page.locator('[data-child-scene]');
  await page.goto(`${REVIEW_PATH}?beat=teach&state=model&viewport=huawei&microstep=task&motion=reduced`);
  await expect(scene).toHaveAttribute('data-scene-mode', 'model');
  const modelTitle = await page.locator('[data-mission-title]').textContent();
  const modelCopy = await page.locator('[data-mission-copy]').textContent();
  await expect(scene).toContainText('小猫示范');

  await page.goto(`${REVIEW_PATH}?beat=teach&state=near-transfer&viewport=huawei&microstep=task&motion=reduced`);
  await expect(scene).toHaveAttribute('data-scene-mode', 'near-transfer');
  const transferTitle = await page.locator('[data-mission-title]').textContent();
  const transferCopy = await page.locator('[data-mission-copy]').textContent();
  expect(transferTitle).not.toBe(modelTitle);
  expect(transferCopy).not.toBe(modelCopy);
  await expect(scene).not.toContainText('正确答案');
  for (const attribute of ['aria-current', 'aria-selected', 'aria-pressed']) {
    await expect(page.locator(`[data-answer-grid] button[${attribute}]`)).toHaveCount(0);
  }
});

test('review scenarios come from the real in-memory ledger and runtime', async ({ page }) => {
  const root = page.locator('[data-learning-review-root]');

  await page.goto(`${REVIEW_PATH}?beat=discover&state=correct&viewport=iphone12`);
  await expect(root).toHaveAttribute('data-runtime-status', 'active');
  await expect(root).toHaveAttribute('data-runtime-beat', 'understand');
  await expect(root).toHaveAttribute('data-runtime-build-stage', '1');
  await expect(root).toHaveAttribute('data-runtime-persisted', 'true');

  await page.goto(`${REVIEW_PATH}?beat=teach&state=first-error&viewport=iphone12`);
  await expect(root).toHaveAttribute('data-runtime-beat', 'teach');
  await expect(root).toHaveAttribute('data-runtime-build-stage', '2');
  await expect(root).toHaveAttribute('data-runtime-support-level', '1');
  await expect(root).toHaveAttribute('data-runtime-effects', /feedback\/support/);

  await page.goto(`${REVIEW_PATH}?beat=discover&state=storage-failure&viewport=iphone12`);
  await expect(root).toHaveAttribute('data-runtime-beat', 'discover');
  await expect(root).toHaveAttribute('data-runtime-build-stage', '0');
  await expect(root).toHaveAttribute('data-runtime-persisted', 'false');
  await expect(root).not.toHaveAttribute('data-runtime-effects', /landmark\/build-stage/);
});

test('child full-screen fallback hides the bench and fits the selected device without page scroll', async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = () => Promise.reject(new Error('native fullscreen unavailable'));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${REVIEW_PATH}?beat=understand&state=ready&viewport=iphone12`);

  await page.locator('[data-immersive-toggle]').click();
  const root = page.locator('[data-learning-review-root]');
  await expect(root).toHaveAttribute('data-immersive', 'true');
  await expect(page.locator('[data-review-controls]')).toBeHidden();
  await expect(page.locator('[data-immersive-exit]')).toBeVisible();

  const geometry = await page.evaluate(() => {
    const frame = document.querySelector('[data-device-frame]').getBoundingClientRect();
    return {
      frame: { left: frame.left, top: frame.top, right: frame.right, bottom: frame.bottom },
      viewport: { width: innerWidth, height: innerHeight },
      scroll: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      }
    };
  });
  expect(geometry.frame.left).toBeGreaterThanOrEqual(-1);
  expect(geometry.frame.top).toBeGreaterThanOrEqual(-1);
  expect(geometry.frame.right).toBeLessThanOrEqual(geometry.viewport.width + 1);
  expect(geometry.frame.bottom).toBeLessThanOrEqual(geometry.viewport.height + 1);
  expect(geometry.scroll).toEqual(geometry.viewport);

  await page.keyboard.press('Escape');
  await expect(root).toHaveAttribute('data-immersive', 'false');
  await expect(page.locator('[data-review-controls]')).toBeVisible();
});

test('phone child mode gives the mission a readable full-width card above the landmark', async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = () => Promise.reject(new Error('native fullscreen unavailable'));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${REVIEW_PATH}?beat=teach&state=first-error&viewport=iphone12`);
  await page.locator('[data-immersive-toggle]').click();

  const layout = await page.evaluate(() => {
    const frame = document.querySelector('[data-device-frame]').getBoundingClientRect();
    const card = document.querySelector('.mission-card').getBoundingClientRect();
    const market = document.querySelector('.market-landmark').getBoundingClientRect();
    return {
      cardWidthRatio: card.width / frame.width,
      cardInside: card.left >= frame.left && card.right <= frame.right,
      cardAboveMarket: card.bottom <= market.top + 4
    };
  });

  expect(layout.cardWidthRatio).toBeGreaterThan(0.78);
  expect(layout.cardInside).toBe(true);
  expect(layout.cardAboveMarket).toBe(true);
});

test('phone review bench stays inside the viewport and exposes every control group', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${REVIEW_PATH}?beat=discover&state=ready&viewport=iphone12`);

  const geometry = await page.evaluate(() => {
    const frame = document.querySelector('[data-device-frame]').getBoundingClientRect();
    return {
      frameLeft: frame.left,
      frameRight: frame.right,
      viewportWidth: innerWidth,
      documentWidth: document.documentElement.scrollWidth
    };
  });
  expect(geometry.frameLeft).toBeGreaterThanOrEqual(0);
  expect(geometry.frameRight).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.documentWidth).toBe(geometry.viewportWidth);
  await expect(page.locator('[data-beat-controls]')).toBeVisible();
  await expect(page.locator('[data-state-controls]')).toBeVisible();
  await expect(page.locator('[data-viewport-controls]')).toBeVisible();

  const discover = page.locator('[data-beat-controls] button[data-value="discover"]');
  await discover.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/beat=understand/);
  await expect(page.locator('[data-beat-controls] button[data-value="understand"]')).toBeFocused();
});

test('CSS child mode survives an immediate native fullscreen exit', async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = () => {
      queueMicrotask(() => document.dispatchEvent(new Event('fullscreenchange')));
      return Promise.resolve();
    };
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${REVIEW_PATH}?beat=discover&state=ready&viewport=iphone12`);

  await page.locator('[data-immersive-toggle]').click();
  await page.waitForTimeout(50);
  await expect(page.locator('[data-learning-review-root]')).toHaveAttribute('data-immersive', 'true');
  const exit = page.locator('[data-immersive-exit]');
  await expect(exit).toBeVisible();
  const overlap = await page.evaluate(() => {
    const first = document.querySelector('[data-immersive-exit]').getBoundingClientRect();
    const second = document.querySelector('[data-beat-progress]').getBoundingClientRect();
    return first.left < second.right && first.right > second.left
      && first.top < second.bottom && first.bottom > second.top;
  });
  expect(overlap).toBe(false);
});

test('all four child viewports preserve aspect ratio and fit without document scrolling', async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = () => Promise.reject(new Error('native fullscreen unavailable'));
  });
  const cases = [
    { viewport: 'iphone12', width: 390, height: 844, ratio: 390 / 844 },
    { viewport: 'huawei', width: 466, height: 980, ratio: 466 / 980 },
    { viewport: 'tablet', width: 768, height: 1024, ratio: 768 / 1024 },
    { viewport: 'desktop', width: 1440, height: 1000, ratio: 1440 / 1000 }
  ];

  for (const item of cases) {
    await page.setViewportSize({ width: item.width, height: item.height });
    await page.goto(`${REVIEW_PATH}?beat=transfer&state=ready&viewport=${item.viewport}`);
    await page.locator('[data-immersive-toggle]').click();
    const geometry = await page.evaluate(() => {
      const frame = document.querySelector('[data-device-frame]').getBoundingClientRect();
      return {
        ratio: frame.width / frame.height,
        inside: frame.left >= -1 && frame.top >= -1
          && frame.right <= innerWidth + 1 && frame.bottom <= innerHeight + 1,
        noScroll: document.documentElement.scrollWidth === innerWidth
          && document.documentElement.scrollHeight === innerHeight
      };
    });
    expect(geometry.ratio).toBeCloseTo(item.ratio, 2);
    expect(geometry.inside).toBe(true);
    expect(geometry.noScroll).toBe(true);
  }
});

test('selected-device typography follows the device frame rather than the host viewport', async ({ page }) => {
  async function measure(hostWidth, hostHeight) {
    await page.setViewportSize({ width: hostWidth, height: hostHeight });
    await page.goto(`${REVIEW_PATH}?beat=discover&state=ready&viewport=iphone12&microstep=task&motion=reduced`);
    return page.evaluate(() => {
      const frame = document.querySelector('[data-device-frame]').getBoundingClientRect();
      const title = document.querySelector('[data-mission-title]');
      return {
        frameWidth: frame.width,
        titleFont: Number.parseFloat(getComputedStyle(title).fontSize)
      };
    });
  }
  const phoneHost = await measure(390, 844);
  const desktopHost = await measure(1440, 1000);
  expect(phoneHost.titleFont / phoneHost.frameWidth)
    .toBeCloseTo(desktopHost.titleFont / desktopHost.frameWidth, 2);
});

test('primary child and review controls meet a 44px touch target', async ({ page }) => {
  await page.setViewportSize({ width: 466, height: 980 });
  await page.goto(`${REVIEW_PATH}?beat=discover&state=ready&viewport=huawei&microstep=task&motion=reduced`);
  const undersized = await page.locator([
    '[data-immersive-toggle]',
    '[data-beat-controls] button',
    '[data-state-controls] button',
    '[data-microstep-controls] button',
    '[data-motion-controls] button',
    '[data-viewport-controls] button',
    '.scene-back',
    '[data-answer-grid] button'
  ].join(',')).evaluateAll(elements => elements
    .filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
    })
    .map(element => ({ label: element.textContent.trim(), width: element.offsetWidth, height: element.offsetHeight })));
  expect(undersized).toEqual([]);
});

test('tablet review bench fits one viewport without a stray page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${REVIEW_PATH}?beat=transfer&state=ready&viewport=tablet`);
  const layout = await page.evaluate(() => ({
    viewportHeight: innerHeight,
    documentHeight: document.documentElement.scrollHeight
  }));
  expect(layout.documentHeight).toBeLessThanOrEqual(layout.viewportHeight + 1);
});

test('progress and immersive focus expose state to keyboard and screen-reader users', async ({ page }) => {
  await page.addInitScript(() => {
    Element.prototype.requestFullscreen = () => Promise.reject(new Error('native fullscreen unavailable'));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${REVIEW_PATH}?beat=transfer&state=ready&viewport=iphone12`);

  const current = page.locator('[data-beat-progress] li[aria-current="step"]');
  await expect(current).toHaveAttribute('aria-label', '第4幕，当前');
  await page.locator('[data-immersive-toggle]').click();
  await expect(page.locator('[data-immersive-exit]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-immersive-toggle]')).toBeFocused();
});

test('first-error fixtures do not encode the correct answer as the first or selected option', async ({ page }) => {
  await page.goto(`${REVIEW_PATH}?beat=teach&state=first-error&viewport=iphone12`);
  const answers = page.locator('[data-answer-grid] button');
  await expect(answers.first()).not.toHaveAttribute('data-answer', 'like');
  await expect(page.locator('[data-answer-grid] button[data-answer="like"]')).toHaveCount(1);
  for (const attribute of ['aria-current', 'aria-selected', 'aria-pressed']) {
    await expect(page.locator(`[data-answer-grid] button[${attribute}]`)).toHaveCount(0);
  }
});
