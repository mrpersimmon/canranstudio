'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { test, expect } = require('@playwright/test');
const { TEST_ORIGIN } = require('../support/test-origin');

const EXPERIENCE_PATH = '/poc/lesson-1-2/';
const COURSE_ASSET_PATH = `${EXPERIENCE_PATH}course/`;
const MANIFEST_PATH = path.resolve(
  __dirname,
  '../../poc/lesson1-2-experience/course-package-manifest.json'
);
const manifestBytes = fs.readFileSync(MANIFEST_PATH);
const manifest = JSON.parse(manifestBytes);
const manifestHash = createHash('sha256').update(manifestBytes).digest('hex');

function isCourseAsset(url) {
  return /\.(?:avif|css|jpe?g|js|json|mp3|png|svg|webp|woff2)(?:\?|$)/i.test(url);
}

test('I03 cold preparation shows real progress, then auto-enters with course assets from the active package', async ({ page }) => {
  test.setTimeout(60000);
  const responses = [];
  page.on('response', response => {
    responses.push({
      url: response.url(),
      fromServiceWorker: response.fromServiceWorker(),
      status: response.status()
    });
  });

  await page.goto(EXPERIENCE_PATH, { waitUntil: 'domcontentloaded' });
  const shell = page.locator('[data-course-package-shell]');
  await expect(shell).toBeVisible();
  await expect(page.locator('.course-package-cat img')).toHaveCount(4);
  await expect(page.locator('.station-app')).toHaveCount(0);
  expect(await page.evaluate(() => (
    performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd
  ))).toBeLessThanOrEqual(180);
  expect(await page.evaluate(() => globalThis.CanranCore?.learningRuntime)).toBeUndefined();

  await expect.poll(() => page.evaluate(() => (
    globalThis.__coursePackage?.progressHistory.some(update => update.phase === 'ready')
  )), { timeout: 45000 }).toBe(true);
  const responseBoundary = responses.length;
  const prepared = await page.evaluate(() => ({
    preparedBytes: globalThis.__coursePackage.preparedBytes,
    totalBytes: globalThis.__coursePackage.totalBytes,
    warm: globalThis.__coursePackage.result.warm,
    readyPercent: globalThis.__coursePackage.progressHistory.findLast(
      update => update.phase === 'ready'
    )?.percent
  }));
  expect(prepared).toEqual({
    preparedBytes: manifest.totalBytes,
    totalBytes: manifest.totalBytes,
    warm: false,
    readyPercent: 100
  });

  await expect(page.locator('.station-app[data-view="mission"]')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('[data-package-start]')).toHaveCount(0);
  await expect(page.locator('.arrival-card, .briefing-card, #course-stage-map')).toHaveCount(0);
  const entryMetrics = await page.evaluate(() => ({
    courseEntryMs: globalThis.__coursePackage.courseEntryMs,
    imageDecodeMs: globalThis.__coursePackage.initialImageDecodeMs,
    imageDecodeCount: globalThis.__coursePackage.initialImageDecodeUrls?.length || 0
  }));
  expect(entryMetrics.courseEntryMs).toBeLessThanOrEqual(1000);
  expect(entryMetrics.imageDecodeCount).toBeGreaterThan(0);
  const visibleImage = page.locator('.station-app img').first();
  await expect(visibleImage).toBeVisible();
  expect(await visibleImage.evaluate(image => image.naturalWidth)).toBeGreaterThan(0);

  const rangedAudio = await page.evaluate(async () => {
    const response = await fetch('/poc/lesson-1-2/course/audio/l01-d01.mp3', {
      headers: { Range: 'bytes=0-63' }
    });
    return {
      status: response.status,
      contentRange: response.headers.get('Content-Range'),
      bytes: (await response.arrayBuffer()).byteLength
    };
  });
  expect(rangedAudio.status).toBe(206);
  expect(rangedAudio.contentRange).toMatch(/^bytes 0-63\/\d+$/);
  expect(rangedAudio.bytes).toBe(64);

  const postStartAssets = responses.slice(responseBoundary).filter(item => isCourseAsset(item.url));
  expect(postStartAssets.length).toBeGreaterThan(0);
  expect(postStartAssets.filter(item => !item.fromServiceWorker)).toEqual([]);
});

test('I03 same-version warm preparation auto-enters within one second without fake zero progress', async ({ page }) => {
  test.setTimeout(60000);
  await page.addInitScript(() => {
    addEventListener('DOMContentLoaded', () => {
      globalThis.__packagePercentHistory = [];
      const percent = document.querySelector('[data-package-percent]');
      if (!percent) return;
      const record = () => globalThis.__packagePercentHistory.push(percent.textContent);
      record();
      new MutationObserver(record).observe(percent, { childList: true, subtree: true });
    });
  });

  await page.goto(EXPERIENCE_PATH);
  await expect(page.locator('.station-app[data-view="mission"]')).toBeVisible({ timeout: 45000 });

  const warmResponses = [];
  page.on('response', response => {
    warmResponses.push({
      url: response.url(),
      fromServiceWorker: response.fromServiceWorker()
    });
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.station-app[data-view="mission"]')).toBeVisible({ timeout: 5000 });
  const warmMetrics = await page.evaluate(() => ({
    warm: globalThis.__coursePackage.result.warm,
    packageReadyMs: globalThis.__coursePackage.packageReadyMs
  }));
  expect(warmMetrics.warm).toBe(true);
  expect(warmMetrics.packageReadyMs).toBeLessThanOrEqual(1000);
  await expect(page.locator('[data-package-start]')).toHaveCount(0);
  expect(await page.evaluate(() => globalThis.__packagePercentHistory)).not.toContain('0%');

  const allowedNetworkChecks = new Set([
    new URL(EXPERIENCE_PATH, TEST_ORIGIN).href,
    new URL(`${COURSE_ASSET_PATH}course-package-manifest.json`, TEST_ORIGIN).href,
    new URL('/poc/lesson-1-2/core/course-package-service-worker.js?v=course-package-v1', TEST_ORIGIN).href
  ]);
  const packageMisses = warmResponses.filter(item => (
    isCourseAsset(item.url)
    && !item.fromServiceWorker
    && !allowedNetworkChecks.has(item.url)
  ));
  expect(packageMisses).toEqual([]);
});

test('I03 resumes from verified browser cache bytes instead of restarting a partial package', async ({ page }) => {
  test.setTimeout(60000);
  const retainedEntries = manifest.entries.filter(entry => entry.kind === 'audio').slice(0, 3);
  const retainedBytes = retainedEntries.reduce((sum, entry) => sum + entry.bytes, 0);
  const cacheName = `course-package:${manifest.packageId}:${manifestHash.slice(0, 16)}`;

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async ({ entries, packageId, targetCacheName }) => {
    const cache = await caches.open(targetCacheName);
    for (const entry of entries) {
      const url = new URL(entry.url, location.origin).href;
      const response = await fetch(url, { cache: 'no-store' });
      const body = await response.arrayBuffer();
      const headers = new Headers(response.headers);
      headers.set('X-Course-Package-Sha256', entry.sha256);
      headers.set('X-Course-Package-Bytes', String(entry.bytes));
      headers.set('X-Course-Package-Id', packageId);
      await cache.put(url, new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers
      }));
    }
  }, {
    entries: retainedEntries,
    packageId: manifest.packageId,
    targetCacheName: cacheName
  });

  await page.goto(EXPERIENCE_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.station-app[data-view="mission"]')).toBeVisible({ timeout: 45000 });
  const preparation = await page.evaluate(() => ({
    warm: globalThis.__coursePackage.result.warm,
    cacheName: globalThis.__coursePackage.result.cacheName,
    firstDownload: globalThis.__coursePackage.progressHistory.find(
      update => update.phase === 'downloading'
    )
  }));

  expect(preparation.warm).toBe(false);
  expect(preparation.cacheName).toBe(cacheName);
  expect(preparation.firstDownload.preparedBytes).toBe(retainedBytes);
  expect(preparation.firstDownload.preparedBytes).toBeLessThan(manifest.totalBytes);
});

test('I03 loader keeps the second map-explorer cat frame fixed for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/course-package-manifest.json', async route => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.goto(EXPERIENCE_PATH, { waitUntil: 'domcontentloaded' });
  const frames = await page.locator('.course-package-cat img').evaluateAll(images => images.map(image => {
    const style = getComputedStyle(image);
    return { opacity: style.opacity, animationName: style.animationName };
  }));
  expect(frames).toEqual([
    { opacity: '0', animationName: 'none' },
    { opacity: '1', animationName: 'none' },
    { opacity: '0', animationName: 'none' },
    { opacity: '0', animationName: 'none' }
  ]);
});

test('Lesson 1–2 loading copy stays minimal at desktop and phone widths', async ({ page }) => {
  await page.route('**/course-package-manifest.json', async route => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(EXPERIENCE_PATH, { waitUntil: 'domcontentloaded' });

  const shell = page.locator('[data-course-package-shell]');
  await expect(shell).toBeVisible();
  await expect(shell.getByRole('heading', { name: 'Lesson 1–2' })).toBeVisible();
  await expect(page.locator('[data-package-progress]')).toHaveCount(1);
  await expect(page.locator('[data-package-status]')).toHaveCount(1);
  await expect(page.locator('[data-package-percent]')).toHaveCount(1);
  await expect(page.locator(
    '.course-package-intro, [data-package-bytes], [data-package-phase], [data-package-slow]'
  )).toHaveCount(0);
  await expect(shell).not.toContainText(/先把整课|开始后就不用再等|所有人物、图片和声音|课程清单|\bMB\b/);
  await expect(page.locator('[data-package-continue]')).toHaveText('继续等待');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('I03 service worker is explicitly allowed to control each course scope', async ({ request }) => {
  const response = await request.get('/poc/lesson-1-2/core/course-package-service-worker.js');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['service-worker-allowed']).toBe('/poc/lesson-1-2/');
});

test('I03 stalled preparation exposes slow-network copy and all three recovery paths', async ({ page }) => {
  test.setTimeout(30000);
  let manifestAttempt = 0;
  await page.route('**/course-package-manifest.json', async route => {
    manifestAttempt += 1;
    if (manifestAttempt === 1) {
      await new Promise(resolve => setTimeout(resolve, 11000));
      try { await route.continue(); } catch { /* Retry already aborted the first request. */ }
      return;
    }
    await route.continue();
  });

  await page.goto(EXPERIENCE_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-package-status]')).toContainText('网络有点慢', { timeout: 5000 });
  await expect(page.locator('[data-package-slow]')).toHaveCount(0);
  await expect(page.locator('[data-package-recovery]')).toBeVisible({ timeout: 11000 });
  await expect(page.locator('[data-package-retry]')).toBeVisible();
  await expect(page.locator('[data-package-continue]')).toBeVisible();
  await expect(page.locator('[data-package-return]')).toBeVisible();

  await page.locator('[data-package-retry]').click();
  await expect(page.locator('.station-app[data-view="mission"]')).toBeVisible({ timeout: 10000 });
  expect(manifestAttempt).toBeGreaterThanOrEqual(2);
});

test('I03 rehashes a corrupt active byte and repairs it before switching caches', async ({ page }) => {
  test.setTimeout(60000);
  const target = manifest.entries.find(entry => entry.url.endsWith('/audio/l02-w10.mp3'));
  await page.goto(EXPERIENCE_PATH);
  await expect(page.locator('.station-app[data-view="mission"]')).toBeVisible({ timeout: 45000 });
  const originalPointer = await page.evaluate(async ({ targetUrl, bytes }) => {
    const meta = await caches.open('course-package:activation:v1');
    const pointer = await (await meta.match(
      new URL('__course-package-active__', location.href).href
    )).json();
    const active = await caches.open(pointer.cacheName);
    const url = new URL(targetUrl, location.origin).href;
    const original = await active.match(url);
    await active.put(url, new Response(new Uint8Array(bytes).fill(0x5a), {
      status: 200,
      headers: original.headers
    }));
    return pointer;
  }, { targetUrl: target.url, bytes: target.bytes });

  const repairedResponses = [];
  page.on('response', response => {
    if (new URL(response.url()).pathname === target.url) {
      repairedResponses.push({ fromServiceWorker: response.fromServiceWorker() });
    }
  });
  await page.reload();
  await expect(page.locator('.station-app[data-view="mission"]')).toBeVisible({ timeout: 45000 });
  expect(await page.evaluate(() => globalThis.__coursePackage.result.warm)).toBe(false);
  const repairedPointer = await page.evaluate(async () => {
    const meta = await caches.open('course-package:activation:v1');
    return (await meta.match(new URL('__course-package-active__', location.href).href)).json();
  });

  expect(repairedPointer.cacheName).toBe(`${originalPointer.cacheName}:repair`);
  expect(repairedResponses.some(response => !response.fromServiceWorker)).toBe(true);
});

for (const lesson of [
  { label: 'Lesson 3–4', path: '/poc/lesson3-4-experience/' },
  { label: 'Lesson 5–6', path: '/poc/lesson5-6-experience/' },
  { label: 'Lesson 7–8', path: '/poc/lesson7-8-experience/' }
]) {
  test(`I03 ${lesson.label} prepares its own package before mounting the story`, async ({ page }) => {
    test.setTimeout(60000);
    const responses = [];
    page.on('response', response => responses.push({
      url: response.url(),
      fromServiceWorker: response.fromServiceWorker()
    }));

    await page.goto(lesson.path, { waitUntil: 'domcontentloaded' });
    const shell = page.locator('[data-course-package-shell]');
    await expect(shell).toBeVisible();
    await expect(page.locator('.story-stage-experience')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (
      globalThis.__coursePackage?.progressHistory.some(update => update.phase === 'ready')
    )), { timeout: 45000 }).toBe(true);
    const boundary = responses.length;
    await expect(page.locator('.story-stage-experience')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-package-start]')).toHaveCount(0);
    const catalogUrl = new URL('./course-package/unit-catalog.json', page.url()).href;
    const catalogResponse = page.waitForResponse(response => response.url() === catalogUrl);
    expect(await page.evaluate(async url => (await fetch(url, { cache: 'no-store' })).ok, catalogUrl))
      .toBe(true);
    expect((await catalogResponse).fromServiceWorker()).toBe(true);
    const postStartAssets = responses.slice(boundary).filter(item => isCourseAsset(item.url));
    expect(postStartAssets.length).toBeGreaterThan(0);
    expect(postStartAssets.filter(item => !item.fromServiceWorker)).toEqual([]);
  });
}
