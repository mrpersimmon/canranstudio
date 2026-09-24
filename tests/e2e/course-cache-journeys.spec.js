'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
for (let first = 7; first <= 29; first += 2) {
  const id = 'unit' + first + '-' + (first + 1);
  const run = require('../support/' + id + '-flow')['completeUnit' + first + (first + 1)];
  test(id + ' 缓存后断网完成真实题型和证书', async ({ page, context }) => {
    test.setTimeout(60000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.incompleteFrames = [];
      const inspect = () => {
        const covered = document.documentElement.hasAttribute('data-course-preparing') || document.documentElement.hasAttribute('data-course-painting');
        if (!covered) for (const image of document.images) {
          if (image.getAttribute('src') && image.getClientRects().length && getComputedStyle(image).visibility !== 'hidden' && (!image.complete || !image.naturalWidth)) window.incompleteFrames.push(image.src);
        }
        requestAnimationFrame(inspect);
      };
      requestAnimationFrame(inspect);
    });
    await page.goto('/lesson/' + id + '/#learn/words');
    await expect(page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true })).toBeVisible();
    await context.setOffline(true);
    await run(page, '/lesson');
    await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('课程小伙伴');
    await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
    const download = page.waitForEvent('download', { timeout: 15000 });
    await page.getByRole('button', { name: '保存图片', exact: true }).click();
    const saved = await download;
    expect((await fs.stat(await saved.path())).size).toBeGreaterThan(10000);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => window.incompleteFrames)).toEqual([]);
  });
}
for (const width of [320, 390, 768, 1280]) test('加载失败界面在 ' + width + ' 宽度可以看清并用键盘重试', async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 568 });
  let broken = true;
  await page.route(/\/handbag\.svg$/, route => broken ? route.fulfill({ status: 404, body: 'missing' }) : route.continue());
  await page.goto('/lesson/unit1-2/#learn/words');
  const retry = page.getByRole('button', { name: '再试一次', exact: true });
  await expect(retry).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  await page.screenshot({ path: testInfo.outputPath('loader-' + width + '.png') });
  broken = false;
  await retry.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '物品小图鉴', exact: true })).toBeVisible();
});

test('关闭脚本时可看课程导航，课程入口给出明确恢复方式', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/lesson/unit1-2/');
    await expect(page.getByText('请开启浏览器的 JavaScript 后再进入课程。', { exact: true })).toBeVisible();
    await expect(page.locator('#courseLoader')).not.toBeVisible();
    await page.getByRole('link', { name: '返回课程', exact: true }).click();
    await expect(page.getByRole('link', { name: '开始学习：礼貌小帮手', exact: true })).toHaveAttribute('href', '/lesson/unit1-2/#learn/words');
    await page.locator('noscript').getByText('单课练习', { exact: true }).click();
    await expect(page.locator('noscript main a')).toHaveCount(23);
    await expect(page.locator('img:visible')).toHaveCount(0);
  } finally { await context.close(); }
});
