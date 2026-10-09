'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const os = require('node:os');

// Measure the documented return visit: reopen the site, click a course and
// resume an actual learning position. Keep rapid same-tab reloads as a separate
// stability test; their unreclaimed-document backlog is a different workload.
test.use({ trace: 'off' });
test('完整缓存 20 次重新打开导航并点课恢复学习位置', { tag: '@cache-performance' }, async ({ page, context, browser }, testInfo) => {
  test.setTimeout(120000);
  const samples = [], navigationSamples = [], driverSamples = [], fetched = [], errors = [];
  let phase = 'first visit', attempt = 0, measuring = false;
  const observe = opened => {
    opened.on('pageerror', error => errors.push(error.message));
    opened.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  };
  observe(page); context.on('page', observe);
  context.on('request', request => {
    if (measuring && /\/resources\/.*\.(?:svg|png|webp|avif|jpe?g|woff2|css|js|html)(?:[?#]|$)/.test(request.url())) fetched.push(request.url());
  });
  await context.addInitScript(() => {
    document.addEventListener('click', event => {
      if (event.target.closest('#unit2930Entry')) sessionStorage.setItem('courseEntryClickedAt', String(performance.timeOrigin + performance.now()));
    }, true);
    if (!location.pathname.endsWith('/unit29-30/')) return;
    const sample = () => {
      const next = [...document.querySelectorAll('.stage-words button')].find(button => button.textContent === '下一组词卡');
      if (next && !next.disabled && next.checkVisibility({ visibilityProperty: true, opacityProperty: true })
          && !document.querySelector('#courseLoader') && document.fonts.status === 'loaded'
          && [...document.images].every(image => !image.getAttribute('src') || image.complete && image.naturalWidth > 0)) {
        requestAnimationFrame(() => {
          const clickedAt = Number(sessionStorage.getItem('courseEntryClickedAt'));
          window.courseUsableAt = { navigation: performance.now(), click: clickedAt ? performance.timeOrigin + performance.now() - clickedAt : null };
        });
      } else requestAnimationFrame(sample);
    };
    document.addEventListener('canran:course-ready', () => requestAnimationFrame(sample), { once: true });
  });
  try {
    await page.goto('/lesson/unit29-30/#learn/words');
    await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
    await expect(page.locator('.stage-words')).toContainText('2 / 5');
    await page.getByRole('link', { name: '我的课程', exact: true }).click();
    await expect(page.locator('#unit2930Entry')).toBeVisible();
    await expect(page.locator('#courseLoader')).toHaveCount(0);
    await page.close();
    measuring = true;
    for (let i = 0; i < 20; i++) {
      attempt = i + 1; phase = 'reopen navigation';
      const visit = await context.newPage();
      try {
        await visit.goto('/lesson/', { waitUntil: 'domcontentloaded', timeout: 10000 });
        const entry = visit.locator('#unit2930Entry');
        await expect(entry).toBeVisible();
        phase = 'click course';
        const start = Date.now();
        await entry.click();
        phase = 'ready control';
        await visit.waitForFunction(() => window.courseUsableAt?.click > 0, null, { timeout: 5000 });
        const ready = await visit.evaluate(() => window.courseUsableAt);
        samples.push(ready.click); navigationSamples.push(ready.navigation); driverSamples.push(Date.now() - start);
        const words = visit.locator('.stage-words');
        const position = i % 2 === 0 ? 2 : 3;
        await expect(words).toContainText(position + ' / 5');
        // Save a different real position for the next visit, without seeding storage.
        await words.getByRole('button', { name: position === 2 ? '下一组词卡' : '上一组词卡', exact: true }).click();
        await expect(words).toContainText((position === 2 ? 3 : 2) + ' / 5');
        await expect(visit.locator('#courseLoader')).toHaveCount(0);
      } finally { await visit.close(); }
    }
    phase = 'performance budget';
    expect(errors).toEqual([]);
    expect(fetched).toEqual([]);
    expect([...samples].sort((a, b) => a - b)[18]).toBeLessThan(1500);
  } finally {
    const report = { browser: browser.version(), platform: process.platform, cpu: os.cpus()[0].model, trace: false, attempt, phase, scenario: 'reopen navigation, click course, restore alternating word-card pages 2 and 3', timing: 'actual click to fully usable rendered frame', samples, navigationSamples, driverSamples, p95: samples.length === 20 ? [...samples].sort((a, b) => a - b)[18] : null, errors, fetched };
    const body = JSON.stringify(report, null, 2);
    await fs.writeFile(testInfo.outputPath('warm-visits.json'), body);
    await testInfo.attach('warm-visits.json', { contentType: 'application/json', body: Buffer.from(body) });
    console.log('Cache revisit measurement: ' + JSON.stringify(report));
  }
});

test('同一标签连续刷新 20 次仍保留位置、完整图片与可操作按钮', async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const errors = [], fetched = [], samples = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'warning' || message.type() === 'error') errors.push(message.text()); });
  await page.goto('/lesson/unit29-30/#learn/words');
  const words = page.locator('.stage-words');
  const next = words.getByRole('button', { name: '下一组词卡', exact: true });
  await next.click();
  await expect(words).toContainText('2 / 5');
  page.on('request', request => { if (/\/resources\/.*\.(?:svg|png|webp|avif|jpe?g|woff2|css|js|html)(?:[?#]|$)/.test(request.url())) fetched.push(request.url()); });
  try {
    for (let i = 0; i < 20; i++) {
      const start = Date.now();
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
      await expect(next).toBeVisible();
      await expect(next).toBeEnabled();
      await expect(words).toContainText('2 / 5');
      await expect(page.locator('#courseLoader')).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => document.fonts.status === 'loaded'
        && [...document.images].every(image => !image.getAttribute('src') || image.complete && image.naturalWidth > 0))).toBe(true);
      samples.push(Date.now() - start);
    }
    await next.click();
    await expect(words).toContainText('3 / 5');
    expect(errors).toEqual([]);
    expect(fetched).toEqual([]);
  } finally {
    await testInfo.attach('rapid-reloads.json', { contentType: 'application/json', body: Buffer.from(JSON.stringify({ scenario: 'same-tab rapid reload stress, driver timings', samples, errors, fetched }, null, 2)) });
  }
});
