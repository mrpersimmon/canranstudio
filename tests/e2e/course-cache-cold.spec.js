'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const os = require('node:os');

test.use({ trace: 'off' });
test('固定 10 Mbps 与 150 毫秒环境记录首次点课到完整画面的耗时', { tag: '@cache-performance' }, async ({ page, context, browser }, testInfo) => {
  test.setTimeout(60000);
  await context.addInitScript(() => {
    document.addEventListener('click', event => {
      if (event.target.closest('a[href="/lesson/unit1-2/#learn/words"]')) {
        sessionStorage.setItem('coldCourseClickedAt', String(performance.timeOrigin + performance.now()));
      }
    }, true);
    if (!location.pathname.endsWith('/unit1-2/')) return;
    const sample = () => {
      const card = document.querySelector('.stage-words .unit-word');
      if (card && !card.disabled && card.checkVisibility({ visibilityProperty: true, opacityProperty: true })
          && !document.querySelector('#courseLoader') && document.fonts.status === 'loaded'
          && [...document.images].every(image => !image.getAttribute('src') || image.complete && image.naturalWidth > 0)) {
        requestAnimationFrame(() => {
          const clickedAt = Number(sessionStorage.getItem('coldCourseClickedAt'));
          window.coldCourseUsableAt = clickedAt ? performance.timeOrigin + performance.now() - clickedAt : null;
        });
      } else requestAnimationFrame(sample);
    };
    document.addEventListener('canran:course-ready', () => requestAnimationFrame(sample), { once: true });
  });
  const network = await context.newCDPSession(page);
  await network.send('Network.enable');
  await network.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1250000, uploadThroughput: 1250000, connectionType: 'cellular3g' });
  await page.goto('/lesson/', { waitUntil: 'domcontentloaded' });
  const entry = page.locator('a[href="/lesson/unit1-2/#learn/words"]');
  await expect(entry).toBeVisible({ timeout: 30000 });
  const report = { browser: browser.version(), cpu: os.cpus()[0].model, downMbps: 10, latencyMs: 150,
    from: 'prepared navigation', target: 'unit1-2', trace: false,
    timing: 'actual click to fully usable rendered frame', elapsedMs: null, driverElapsedMs: null };
  try {
    const start = Date.now();
    await entry.click();
    await expect(page.getByRole('heading', { name: '单词小图鉴', exact: true })).toBeVisible({ timeout: 30000 });
    report.driverElapsedMs = Date.now() - start;
    await page.waitForFunction(() => window.coldCourseUsableAt > 0);
    report.elapsedMs = await page.evaluate(() => window.coldCourseUsableAt);
    await expect.poll(() => page.locator('img:visible').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    // Include fonts, images, an enabled card and a rendered frame. Do not charge
    // Playwright's pre-click auto-wait or later assertion polling to the child.
    expect(report.elapsedMs).toBeLessThan(5000);
  } finally {
    const body = JSON.stringify(report, null, 2);
    await fs.writeFile(testInfo.outputPath('first-visit.json'), body);
    await testInfo.attach('first-visit.json', { contentType: 'application/json', body: Buffer.from(body) });
    console.log('Cold course timing: ' + JSON.stringify(report));
  }
});
