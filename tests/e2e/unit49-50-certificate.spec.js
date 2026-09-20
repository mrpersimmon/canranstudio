'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const { completeUnit } = require('../support/unit49-50-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

let earnedSession;
test.beforeAll(async ({ browser }) => {
  test.setTimeout(90000);
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await completeUnit(page);
  earnedSession = await context.storageState();
  await context.close();
});
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(state => {
    if (localStorage.getItem('canran:unit49-50:learning:v1')) return;
    for (const origin of state.origins) if (origin.origin === location.origin) {
      for (const entry of origin.localStorage) localStorage.setItem(entry.name, entry.value);
    }
  }, earnedSession);
});
async function openCertificate(page, name = '小小采购员') {
  await page.goto('/unit49-50/#learn/certificate');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill(name);
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  return page.getByRole('dialog', { name: '采购纪念', exact: true });
}

test('领奖后保留姓名与首次领取日，五关徽章、角色和真实 PNG 都可见', async ({ page }) => {
  const dialog = await openCertificate(page);
  await expect(dialog.locator('.certificate-paper')).toHaveCSS('animation-name', 'none');
  await expect(dialog.locator('.certificate-paper')).toHaveCSS('opacity', '1');
  await expect(dialog.getByRole('heading', { name: '晚餐采购小达人', exact: true })).toBeVisible();
  await expect(dialog.getByRole('list', { name: '我的五关徽章', exact: true }).getByRole('listitem')).toHaveText(['采购准备', '肉店小剧场', '帮忙买晚餐', '表达训练场', '晚餐准备好了']);
  for (const label of ['肉店老板', '伯德夫人']) {
    const image = dialog.getByRole('img', { name: label, exact: true });
    expect(await image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  const date = await dialog.locator('#certificateDate').textContent();
  await expect(dialog).toContainText('15 颗星 · 五关完成');
  const download = page.waitForEvent('download', { timeout: 15000 });
  await dialog.getByRole('button', { name: '保存图片', exact: true }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('Lesson49-50-采购纪念.png');
  await file.saveAs('output/playwright/certificate-design/03-export.png');
  const png = await fs.readFile('output/playwright/certificate-design/03-export.png');
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect(png.readUInt32BE(16)).toBe(1440); expect(png.readUInt32BE(20)).toBe(1100);
  const band = await dialog.locator('.certificate-paper').evaluate(el => getComputedStyle(el, '::before').backgroundColor.match(/\d+/g).slice(0, 3).map(Number));
  const pixel = await require('sharp')(png).extract({left:100,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();
  expect([...pixel], '保存的纪念图片与页面使用同一单元主题').toEqual(band);
  await expect(dialog.getByRole('status')).toContainText('纪念图片已保存');
  await dialog.screenshot({ path: 'output/playwright/certificate-design/04-dialog.png' });
  await dialog.getByRole('button', { name: '关闭', exact: true }).click();
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('小小采购员');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(dialog.locator('#certificateDate')).toHaveText(date);
  await expect(dialog.getByRole('status')).toBeEmpty();
  await dialog.getByRole('button', { name: '关闭', exact: true }).press('Escape');
  await expect(dialog).not.toBeVisible();
});

for (const width of [320, 390, 768]) test(`${width} 像素下长名字不越界，徽章可读，保存和关闭可操作`, async ({ page }) => {
  await page.setViewportSize({ width, height: 740 });
  const dialog = await openCertificate(page, '热爱探险和英语学习的小朋友李明小明');
  const paper = dialog.getByRole('article', { name: '我的冒险纪念证书', exact: true });
  await expect(dialog.locator('#certificateName')).toHaveText('热爱探险和英语学习的小朋友李明小明');
  expect((await dialog.locator('#certificateName').boundingBox()).height).toBeLessThanOrEqual(100);
  expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  const bounds = await paper.boundingBox();
  for (const box of await paper.locator('h3, p, li, img').evaluateAll(nodes => nodes.map(node => {
    const r = node.getBoundingClientRect(); return { left: r.left, right: r.right };
  }))) {
    expect(box.left).toBeGreaterThanOrEqual(bounds.x - 1);
    expect(box.right).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
  }
  const save = dialog.getByRole('button', { name: '保存图片', exact: true });
  expect((await save.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await dialog.screenshot({ path: `output/playwright/certificate-design/05-narrow-${width}.png` });
  const download = page.waitForEvent('download', { timeout: 15000 }); await save.click(); await download;
  await dialog.getByRole('button', { name: '关闭', exact: true }).click();
  await expect(dialog).not.toBeVisible();
});

test('只打印奖状本身，保留名字、角色和徽章，A4 单页无操作按钮', async ({ page }) => {
  const dialog = await openCertificate(page, '小小采购员');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#topbar')).not.toBeVisible();
  await expect(dialog.getByRole('button', { name: '保存图片', exact: true })).not.toBeVisible();
  await expect(dialog.getByRole('heading', { name: '采购纪念', exact: true })).not.toBeVisible();
  await expect(dialog.locator('#certificateName')).toBeVisible();
  const pdf = await page.pdf({ path: 'output/playwright/certificate-design/06-print.pdf', printBackground: true, preferCSSPageSize: true });
  expect(pdf.toString('latin1').match(/\/Type\s*\/Page(?:\s|\/|>)/g)).toHaveLength(1);
  await page.screenshot({ path: 'output/playwright/certificate-design/06-print.png', fullPage: true });
});

test('图像加载失败时提示重试；恢复后可保存，空名字有友好称呼', async ({ page }) => {
  await page.route('**/assets/lesson49/icons/bird.svg', route => route.abort());
  const dialog = await openCertificate(page, '');
  await expect(dialog.locator('#certificateName')).toHaveText('采购小学徒');
  await dialog.getByRole('button', { name: '保存图片', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('图片暂时没有生成');
  await expect(dialog.getByRole('button', { name: '保存图片', exact: true })).toBeEnabled();
  await page.unroute('**/assets/lesson49/icons/bird.svg');
  await page.reload();
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const download = page.waitForEvent('download', { timeout: 15000 });
  await dialog.getByRole('button', { name: '保存图片', exact: true }).click();
  await download;
});

test('没有完成任务时只有待集齐徽章，不能领证，继续按钮到真实下一站', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const page = await context.newPage();
  await page.goto('/unit49-50/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  const track = page.getByRole('list', { name: '五关进度', exact: true });
  await expect(track.getByRole('listitem', { name: /未完成/ })).toHaveCount(5);
  await page.getByRole('button', { name: '继续：听音寻宝', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
  await context.close();
});
