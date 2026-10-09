'use strict';
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
const previous = require('../support/unit12-grammar-predecessor');
test.use({ actionTimeout: 5000, reducedMotion: 'reduce' });
for (const version of [1, 2]) test(`更早 v${version} 的真实旧轮次升级：改写题未答，未改记录和证书姓名日期保留`, async ({ page }) => {
  test.setTimeout(90000);
  const restore = await previous.install(page, version);
  await flow.story(page, '1-2');
  for (const [id, items] of Object.entries(previous.answers(version))) {
    await page.goto(`/unit1-2/#learn/${id}`); const room = page.locator('.stage-' + id);
    for (const [i, answer] of items.entries()) {
      await flow.select(room, answer); await room.getByRole('button', { name: '检查答案', exact: true }).click();
      await expect(room.locator('.fb')).toHaveText('答对了！');
      await room.getByRole('button', { name: i < items.length - 1 ? '下一题' : id === 'exam' ? '查看本次记录' : '完成这一站', exact: true }).click();
    }
  }
  await page.goto('/unit1-2/#learn/certificate'); const claim = page.getByRole('button', { name: '领取单元证书', exact: true });
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('语法小探索家');
  await claim.click(); const date = await page.locator('#certificateDate').innerText(); await page.keyboard.press('Escape');
  const metadata = await page.evaluate(() => { const a=JSON.parse(localStorage.getItem('canran:unit1-2:learning:v1')).activity; return [a.unitName,a.unitCertificateIssuedAt]; });
  await restore(); await page.reload(); await expect(claim).toHaveCount(0);
  await expect(page.locator('#certificateName')).toHaveText('登录后显示姓名');
  await expect(page.locator('#certificateDate')).toBeHidden();
  for (const [id, text] of [['trans', '第 1 / 12 题'], ['exam', '第 2 / 10 题']]) {
    await page.goto(`/unit1-2/#learn/${id}`); const room = page.locator('.stage-' + id);
    await expect(room.locator('.progress-copy')).toHaveText(text);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  }
  await flow.complete(page, '1-2'); expect(await page.evaluate(() => { const a=JSON.parse(localStorage.getItem('canran:unit1-2:learning:v1')).activity; return [a.unitName,a.unitCertificateIssuedAt]; })).toEqual(metadata);
  await expect(page.locator('#certificateDate')).toBeHidden();
});
