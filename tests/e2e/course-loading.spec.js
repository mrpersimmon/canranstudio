'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const { isFeedbackAudio } = require('../support/course-resource-urls');
test('服务器实际使用的 JavaScript 类型仍能完成准备', async ({ page }) => {
  await page.route(/\/resources\/.*\.js$/, async route => {
    const response = await route.fetch();
    await route.fulfill({ response, contentType: 'application/javascript; charset=utf-8' });
  });
  await page.goto('/lesson/unit29-30/#learn/words');
  await expect(page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true })).toBeVisible();
});
test('清理课程资源保留学习位置、活动课程和官网缓存', async ({ page, context }) => {
  await page.goto('/lesson/unit29-30/#learn/words');
  await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  const other = await context.newPage();
  await other.goto('/lesson/unit1-2/#learn/words');
  await expect(other.getByRole('heading', { name: '物品小图鉴', exact: true })).toBeVisible();
  await page.goto('/lesson/');
  await page.evaluate(async () => {
    const cache = await caches.open('root-site-cache');
    await cache.put('/root-site-file', new Response('official-site'));
  });
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await page.getByRole('button', { name: '清理课程资源', exact: true }).click();
  await expect(page.getByText('已清理未使用的课程资源，学习记录已保留。', { exact: true })).toBeVisible();
  expect(await page.evaluate(async () => (await (await caches.open('root-site-cache')).match('/root-site-file')).text())).toBe('official-site');
  await context.setOffline(true);
  await other.reload();
  await expect(other.getByRole('heading', { name: '物品小图鉴', exact: true })).toBeVisible();
  await context.setOffline(false);
  await page.goto('/lesson/unit29-30/#learn/words');
  await expect(page.locator('.stage-words')).toContainText('2 / 5');
});
for (const fault of ['404', 'html', 'corrupt', 'font']) test(fault + ' 失败留在准备页，重试复用好文件后进入原章节', async ({ page }) => {
  let broken = true;
  const requests = new Map();
  page.on('request', request => { if (/\/resources\//.test(request.url())) requests.set(request.url(), (requests.get(request.url()) || 0) + 1); });
  await page.route(fault === 'font' ? /\.woff2$/ : /\/handbag\.svg$/, route => broken
    ? route.fulfill({ status: fault === '404' ? 404 : 200, contentType: fault === 'html' ? 'text/html' : fault === 'font' ? 'font/woff2' : 'image/svg+xml', body: '<html>bad resource</html>' })
    : route.continue());
  await page.goto('/lesson/unit1-2/#learn/words', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: '再试一次', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '物品小图鉴', exact: true })).not.toBeVisible();
  const before = new Map(requests);
  broken = false;
  await page.getByRole('button', { name: '再试一次', exact: true }).click();
  await expect(page.getByRole('heading', { name: '物品小图鉴', exact: true })).toBeVisible();
  for (const [url, count] of before) if (!/\/handbag\.svg$|\.woff2$/.test(url)) expect(requests.get(url)).toBe(count);
});

test('浏览器禁止保存资源仍能在本次会话断网换词卡，不假称永久保存', async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
    Object.defineProperty(window, 'caches', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/lesson/unit29-30/#learn/words', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('这次可正常学习，下次可能需要重新准备。', { exact: true })).toBeVisible();
  await context.setOffline(true);
  const words = page.locator('.stage-words');
  for (let i = 0; i < 4; i++) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await expect(words).toContainText('5 / 5');
  await expect.poll(() => words.locator('img').evaluateAll(images => images.length > 0 && images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await context.close();
});
const entries = ['home', ...fs.readdirSync(process.cwd()).filter(name => /^unit\d+-\d+$/.test(name)), 'lesson49', 'lesson50', 'lesson51', 'lesson52', 'lesson53', 'lesson54', 'soundmark'];

for (const id of entries) test(`${id} 完整准备后显示原有课程，必需资源无缺项`, async ({ page }) => {
  const failures = [], errors = [], voices = [];
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/\.mp3(?:\?|$)/.test(request.url()) && !isFeedbackAudio(request.url())) voices.push(request.url()); });
  await page.goto('/lesson/' + (id === 'home' ? '' : id + '/'), { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#courseLoader')).toHaveCount(0, { timeout: 20000 });
  await expect(page.locator('body')).not.toBeEmpty();
  await expect.poll(() => page.locator('img:visible').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(errors).toEqual([]);
  expect(failures).toEqual([]);
  if (/^unit/.test(id) && !['unit1-2', 'unit49-50'].includes(id)) expect(voices).toEqual([]);
});

test('整课的手提包尚未准备好时留在加载页，准备好后完整进入指定章节', async ({ page }) => {
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route(/handbag\.svg(?:\?|$)/, async route => { await held; await route.continue(); });
  try {
    await page.goto('/lesson/unit1-2/#learn/words', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: '物品小图鉴', exact: true })).not.toBeVisible();
    await expect(page.getByRole('status', { name: '课程准备状态', exact: true })).toContainText('准备');
  } finally {
    release();
  }
  await expect(page.getByRole('heading', { name: '物品小图鉴', exact: true })).toBeVisible();
  await expect(page.getByRole('status', { name: '课程准备状态', exact: true })).toHaveCount(0);
  await expect.poll(() => page.locator('.stage-words img').evaluateAll(images =>
    images.every(image => image.complete && image.naturalWidth > 0)
  )).toBe(true);
  await expect(page).toHaveURL(/\/lesson\/unit1-2\/#learn\/words$/);
});

test('准备过的无配音课断网刷新后恢复词卡位置，后续图片仍完整', async ({ page, context }) => {
  await page.goto('/lesson/unit29-30/#learn/words', { waitUntil: 'domcontentloaded' });
  const words = page.locator('.stage-words');
  await expect(words.getByRole('button', { name: '下一组词卡', exact: true })).toBeVisible();
  await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await expect(words).toContainText('2 / 5');
  await expect(page.getByText('这次可正常学习，下次可能需要重新准备。', { exact: true })).toHaveCount(0);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(words).toContainText('2 / 5');
  await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await expect(words).toContainText('3 / 5');
  await expect.poll(() => words.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await expect(page.locator('#starCount')).toHaveText('0');
});
