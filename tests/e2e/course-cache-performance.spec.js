'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const os = require('node:os');

// Trace snapshots are useful for functional failures, but recording twenty
// navigations adds work to the browser being measured. Keep the real page,
// animations, cache and the 1500 ms budget; retain diagnostics separately.
test.use({ trace: 'off' });
test('完整缓存 20 次复访恢复可操作位置并记录实际耗时', async ({ page, browser }, testInfo) => {
  test.setTimeout(90000);
  const samples = [], fetched = [], errors = [];
  let phase = 'first visit', attempt = 0;
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  try {
    await page.goto('/lesson/unit29-30/#learn/words');
    const next = page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true });
    await expect(next).toBeVisible();
    page.on('request', request => { if (/\/resources\/.*\.(?:svg|png|woff2|js|html)$/.test(request.url())) fetched.push(request.url()); });
    for (let i = 0; i < 20; i++) {
      attempt = i + 1; phase = 'reload';
      const start = Date.now();
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
      // Measure when the real control becomes visible. Assertion retries back
      // off by up to a second, which measures polling delay as page-load time.
      phase = 'ready control';
      await next.waitFor({ state: 'visible', timeout: 5000 });
      samples.push(Date.now() - start);
      await expect(next).toBeEnabled();
    }
    phase = 'performance budget';
    const p95 = [...samples].sort((a, b) => a - b)[18];
    expect(fetched).toEqual([]);
    expect(p95).toBeLessThan(1500);
  } finally {
    // Report partial samples too, so an interrupted run identifies the failing
    // visit instead of losing all evidence to the outer test timeout.
    const report = { browser: browser.version(), platform: process.platform, cpu: os.cpus()[0].model, trace: false, attempt, phase, samples, p95: samples.length === 20 ? [...samples].sort((a, b) => a - b)[18] : null, errors, fetched };
    const body = JSON.stringify(report, null, 2);
    await fs.writeFile(testInfo.outputPath('warm-visits.json'), body);
    await testInfo.attach('warm-visits.json', { contentType: 'application/json', body: Buffer.from(body) });
    console.log('Cache revisit measurement: ' + JSON.stringify(report));
  }
});
