'use strict';
const { test, expect } = require('@playwright/test');
const { EXAMS, choose } = require('../support/units1-6-exam');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
test('1–2 八题覆盖礼貌话轮、指代、词义、问句组织和整句听辨', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/unit1-2/#learn/exam'); const room = page.locator('.stage-exam');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '8');
  for (const [i, question] of EXAMS['1-2'].entries()) {
    await expect(room.locator('.practice-content h3')).toContainText(question.prompt);
    const check = room.getByRole('button', { name: '检查答案', exact: true }); await expect(check).toBeDisabled();
    if (i === 0) {
      await room.getByRole('button', { name: question.wrong, exact: true }).click(); await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await expect(room.locator('.practice-options .correct')).toHaveCount(0);
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    if (i === 3) await room.getByRole('button', { name: '给点线索', exact: true }).click();
    if (i >= 5) { await page.reload(); await expect(check).toBeDisabled(); }
    await choose(room, question); await check.click(); await expect(room.getByRole('status')).toHaveText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    await room.getByRole('button', { name: i === 7 ? '查看本次记录' : '下一题', exact: true }).click();
  }
  await expect(room).toContainText('首次独立答对 6 / 8');
  await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});
