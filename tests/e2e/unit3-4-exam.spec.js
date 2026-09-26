'use strict';
const { test, expect } = require('@playwright/test');
const { EXAMS, choose } = require('../support/units1-6-exam');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
test('3–4 九题认领综合练习，全声音失败仍可逐题完成，末三题刷新不代答', async ({ page }) => {
  test.setTimeout(60000);
  const voices = [], errors = []; page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/unit3-4\/audio\//.test(request.url())) voices.push(request.url()); });
  await page.route(/\.mp3(?:\?|$)/, route => route.abort());
  await page.goto('/unit3-4/#learn/exam'); const room = page.locator('.stage-exam');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '9');
  for (const [i, question] of EXAMS['3-4'].entries()) {
    await expect(room.locator('.practice-content h3')).toContainText(question.prompt);
    const check = room.getByRole('button', { name: '检查答案', exact: true }); await expect(check).toBeDisabled();
    if (i === 0) {
      await room.getByRole('button', { name: question.wrong, exact: true }).click(); await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await expect(room.locator('.practice-options .correct')).toHaveCount(0);
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    if (i === 3) await room.getByRole('button', { name: '给点线索', exact: true }).click();
    if (i >= 6) { await page.reload(); await expect(check).toBeDisabled(); await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0); }
    await choose(room, question); await check.click(); await expect(room.getByRole('status')).toHaveText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    await room.getByRole('button', { name: i === 8 ? '查看本次记录' : '下一题', exact: true }).click();
  }
  await expect(room).toContainText('首次独立答对 7 / 9');
  await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  expect(voices).toEqual([]); expect(errors).toEqual([]);
});
