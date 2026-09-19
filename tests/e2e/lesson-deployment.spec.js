'use strict';
const { test, expect } = require('@playwright/test');
const { completeUnit } = require('../support/unit49-50-flow');

test('lesson 子目录直接显示导航，组合单元和返回导航都留在子目录', async ({ page }) => {
  const outside = [], failures = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin === 'http://127.0.0.1:4173' && !url.pathname.startsWith('/lesson/')) outside.push(url.pathname);
  });
  page.on('pageerror', error => failures.push(error.message));
  await page.goto('/lesson/');
  await expect(page.getByRole('heading', { name: '今天，去哪儿冒险？' })).toBeVisible();
  await page.getByRole('link', { name: '开始学习', exact: true }).click();
  await expect(page).toHaveURL(/\/lesson\/unit49-50\/#learn\/words$/);
  await expect(page.getByRole('heading', { name: '采购小图鉴', exact: true })).toBeVisible();
  await expect.poll(() => page.locator('.unit-word img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await page.getByRole('link', { name: '我的课程', exact: true }).click();
  await expect(page).toHaveURL(/\/lesson\/$/);
  expect(outside).toEqual([]);
  expect(failures).toEqual([]);
});

test('每个课程入口和资源都留在 lesson 下，原版记录不被重开操作删除', async ({ page }) => {
  const outside = [], errors = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin === 'http://127.0.0.1:4173' && !url.pathname.startsWith('/lesson/')) outside.push(url.pathname);
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/lesson/');
  await page.evaluate(() => localStorage.setItem('canran:unit49-50:learning:v1', 'original-app-record'));
  await page.getByText('单课练习', { exact: true }).click();
  const entries = await page.locator('main a').evaluateAll(links => links.map(link => ({ href: link.href, text: link.textContent })));
  expect(entries).toHaveLength(8);
  for (const entry of entries) {
    expect(new URL(entry.href).pathname).toMatch(/^\/lesson\//);
    const response = await page.goto(entry.href);
    expect(response.status()).toBe(200);
    await expect(page.locator('body')).not.toContainText('Not Found');
  }
  await page.goto('/lesson/');
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '确认重开', exact: true }).click();
  await expect(page).toHaveURL(/\/lesson\/$/);
  expect(await page.evaluate(() => localStorage.getItem('canran:unit49-50:learning:v1'))).toBe('original-app-record');
  expect(outside).toEqual([]); expect(errors).toEqual([]);
});

test('lesson 中走完整单元并下载新版证书，返回导航能继续学习', async ({ page }) => {
  test.setTimeout(90000);
  await completeUnit(page, { basePath: '/lesson/' });
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('采购小伙伴');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '采购纪念', exact: true });
  await expect(dialog.getByRole('heading', { name: '晚餐采购小达人', exact: true })).toBeVisible();
  const download = page.waitForEvent('download', { timeout: 15000 });
  await dialog.getByRole('button', { name: '保存图片', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('Lesson49-50-采购纪念.png');
  await dialog.getByRole('button', { name: '关闭', exact: true }).click();
  await page.getByRole('link', { name: '我的课程', exact: true }).click();
  await expect(page.getByRole('link', { name: '继续学习', exact: true })).toHaveAttribute('href', '/lesson/unit49-50/#learn/certificate');
});

test('旧官网的根目录缓存不会阻止 lesson 录音，原生播放可以结束', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/tests/fixtures/root-media-worker.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  await page.goto('/lesson/unit49-50/#learn/words');
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL)).toContain('/lesson/core/subpath-worker.js');
  await expect(page.getByRole('heading', { name: '采购小图鉴', exact: true })).toBeVisible();
  const outcome = await page.evaluate(() => new Promise(resolve => {
    const audio = new Audio('/lesson/lesson49/audio/butcher.mp3');
    audio.addEventListener('ended', () => resolve('ended'), { once: true });
    audio.addEventListener('error', () => resolve('error'), { once: true });
    audio.play().catch(() => resolve('rejected'));
  }));
  expect(outcome).toBe('ended');
});

test('手机 lesson 导航与单元没有横向溢出，旧首页入口返回新导航', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/lesson/home/');
  await expect(page).toHaveURL(/\/lesson\/$/);
  await expect(page.getByRole('heading', { name: '今天，去哪儿冒险？' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('link', { name: '开始学习', exact: true }).click();
  await expect(page.getByRole('heading', { name: '采购小图鉴', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
