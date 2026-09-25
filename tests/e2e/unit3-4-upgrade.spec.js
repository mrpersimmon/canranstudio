'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const legacy = require('../fixtures/unit3-4-voiced-before/flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 6000 });

async function voicedEdition(page) {
  let prior = true;
  const files = Object.fromEntries(await Promise.all(['index.html','content.js','unit.js'].map(async name => [name, await fs.readFile('tests/fixtures/unit3-4-voiced-before/' + name)])));
  await page.route(/\/unit3-4\/(?:index\.html)?(?:\?.*)?$/, route => prior ? route.fulfill({ contentType: 'text/html', body: files['index.html'] }) : route.continue());
  for (const name of ['content.js','unit.js']) await page.route('**/unit3-4/' + name + '*', route => prior ? route.fulfill({ contentType: 'text/javascript', body: files[name] }) : route.continue());
  return () => { prior = false; };
}

test('真实旧录音中断后续读，不再卡住，也不伪称听完', async ({ page }) => {
  const upgrade = await voicedEdition(page);
  await page.goto('/unit3-4/#learn/words');
  await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  await page.goto('/unit3-4/#learn/text'); const room = page.locator('.stage-text');
  await room.getByRole('button', { name: '开始听课文', exact: true }).click();
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeEnabled({ timeout: 15000 });
  await page.route('**/unit3-4/audio/l03-d02.mp3', route => route.abort());
  await room.getByRole('button', { name: '下一句', exact: true }).click();
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await expect(room.locator('.bubble-row')).toHaveCount(2);
  upgrade(); await page.reload();
  await expect(room.locator('.btext span')).toHaveText(legacy.DIALOGUE.slice(0,2));
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeEnabled();
  await expect(room.getByRole('button', { name: /重听|开始听/ })).toHaveCount(0);
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.goto('/unit3-4/#learn/words'); await expect(page.locator('#wordPageProgress')).toHaveText('2 / 5');
});

test('真实旧15星保留有效题前缀和姓名，新的阅读题不会被旧听辨代答', async ({ page }) => {
  test.setTimeout(150000); const upgrade = await voicedEdition(page);
  await legacy.completeUnit34(page);
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('小伞');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await page.keyboard.press('Escape'); upgrade(); await page.reload();
  await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('小伞');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('1');
  for (const [id, completed, question] of [['listen',0,'哪一个词对应图中的物品？'],['roles',2,'客人的寄存牌是几号？'],['reply',3,'同学对你说'],['exam',2,'这位是你的老师吗']]) {
    await page.goto('/unit3-4/#learn/' + id); const room = page.locator('.stage-' + id);
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(completed));
    await expect(room).toContainText(question);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(room.locator('.practice-options button[aria-pressed=true]')).toHaveCount(0);
  }
  await page.getByRole('button', { name: '学习手记', exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('听辨 umbrella');
});

test('旧重练的空白状态优先于历史成绩，不复活旧回合答案', async ({ page }) => {
  test.setTimeout(40000); const upgrade = await voicedEdition(page);
  await legacy.completeActivity(page, 'reply');
  const room = page.locator('.stage-reply');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  upgrade(); await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: 'your', exact: true })).toHaveAttribute('aria-pressed','false');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});
