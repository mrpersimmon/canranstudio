'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const legacy = require('../fixtures/unit5-6-voiced-before/flow');
test.use({ actionTimeout: 6000 });
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

async function voicedEdition(page) {
  let prior = true;
  const files = Object.fromEntries(await Promise.all(['index.html', 'content.js', 'unit.js', 'unit.css'].map(async name => [name, await fs.readFile('tests/fixtures/unit5-6-voiced-before/' + name)])));
  await page.route(/\/unit5-6\/(?:index\.html)?(?:\?.*)?$/, route => prior ? route.fulfill({ contentType: 'text/html', body: files['index.html'] }) : route.continue());
  for (const name of ['content.js', 'unit.js', 'unit.css']) await page.route('**/unit5-6/' + name + '*', route => prior ? route.fulfill({ contentType: name.endsWith('css') ? 'text/css' : 'text/javascript', body: files[name] }) : route.continue());
  return () => { prior = false; };
}

test('真实旧录音中断后按已显示的句子续读，词卡翻页保留', async ({ page }) => {
  const upgrade = await voicedEdition(page);
  await page.goto('/unit5-6/#learn/words');
  await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  await page.goto('/unit5-6/#learn/text'); const room = page.locator('.stage-text');
  await room.getByRole('button', { name: '开始听课文', exact: true }).click();
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeEnabled({ timeout: 15000 });
  await page.route('**/unit5-6/audio/l05-d02.mp3', route => route.abort());
  await room.getByRole('button', { name: '下一句', exact: true }).click();
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  upgrade(); await page.reload();
  await expect(room.locator('.btext span')).toHaveText(legacy.DIALOGUE.slice(0, 2));
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeEnabled();
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.goto('/unit5-6/#learn/words'); await expect(page.locator('#wordPageProgress')).toHaveText('2 / 4');
});

test('真实旧15星升级为12星，未改题与姓名保留，新词义题不由听辨代答', async ({ page }) => {
  test.setTimeout(200000); const upgrade = await voicedEdition(page);
  await legacy.completeUnit56(page);
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('小伙伴');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await page.keyboard.press('Escape'); upgrade(); await page.reload();
  await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('小伙伴');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('12');
  await page.goto('/unit5-6/#learn/listen'); const room = page.locator('.stage-listen');
  await expect(room).toContainText('French 表示什么？');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.locator('.practice-options button[aria-pressed="true"]')).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '学习手记', exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('听辨 French');
});

test('旧版重练空白回合优先，删去前题不会复活品牌题的历史答案', async ({ page }) => {
  const upgrade = await voicedEdition(page);
  await legacy.completeActivity(page, 'choice');
  const room = page.locator('.stage-choice'); await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  upgrade(); await page.reload();
  await expect(room).toContainText('第 1 / 1 题');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: "It's a Volvo.", exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});
