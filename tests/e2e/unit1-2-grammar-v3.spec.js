'use strict';
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
const previous = require('../support/unit12-grammar-predecessor');
test.use({ actionTimeout: 5000, reducedMotion: 'reduce' });

test('前版27题已完成：语法新题从空白开始，八道未改综合题和原证书信息保留', async ({ page }) => {
  test.setTimeout(90000);
  const restore = await previous.install(page, 3);
  await flow.story(page, '1-2');
  for (const [id, items] of Object.entries(previous.answers(3))) {
    await page.goto(`/unit1-2/#learn/${id}`); const room = page.locator('.stage-' + id);
    for (const [index, answer] of items.entries()) {
      await flow.select(room, answer); await room.getByRole('button', { name: '检查答案', exact: true }).click();
      await expect(room.locator('.fb')).toHaveText('答对了！');
      await room.getByRole('button', { name: index < items.length - 1 ? '下一题' : id === 'exam' ? '查看本次记录' : '完成这一站', exact: true }).click();
    }
  }
  await page.goto('/unit1-2/#learn/certificate');
  const claim = page.getByRole('button', { name: '领取单元证书', exact: true });
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('问句小探索家');
  await claim.click(); const date = await page.locator('#certificateDate').innerText(); await page.keyboard.press('Escape');
  const metadata = await page.evaluate(() => { const a=JSON.parse(localStorage.getItem('canran:unit1-2:learning:v1')).activity; return [a.unitName,a.unitCertificateIssuedAt]; });
  await restore(); await page.reload(); await expect(claim).toHaveCount(0);
  await expect(page.locator('#certificateName')).toHaveText('登录后显示姓名');
  await expect(page.locator('#certificateDate')).toBeHidden();
  for (const [id, count] of [['trans', '第 1 / 12 题'], ['exam', '第 9 / 10 题']]) {
    await page.goto(`/unit1-2/#learn/${id}`); const room = page.locator('.stage-' + id);
    await expect(room.locator('.progress-copy')).toHaveText(count);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(room.locator('.fb')).toBeEmpty();
  }
  await flow.complete(page, '1-2');
  expect(await page.evaluate(() => { const a=JSON.parse(localStorage.getItem('canran:unit1-2:learning:v1')).activity; return [a.unitName,a.unitCertificateIssuedAt]; })).toEqual(metadata);
  await expect(page.locator('#certificateDate')).toBeHidden();
  await page.keyboard.press('Escape');
  await page.goto('/unit1-2/#learn/exam'); const exam = page.locator('.stage-exam');
  await exam.getByRole('button', { name: '再练一轮', exact: true }).click();
  await page.reload(); await expect(exam.locator('.progress-copy')).toHaveText('第 1 / 10 题');
  await expect(exam.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
});
