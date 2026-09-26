'use strict';
const { test, expect } = require('@playwright/test');
const { EXAMS, choose } = require('../support/units1-6-exam');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
for (const unit of ['1-2', '3-4', '5-6']) for (const width of [320, 390, 768, 1280]) {
  test(`${unit} ${width} 综合挑战的长选项和词块完整，选择与线索不推移操作区`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 844 }); await page.goto(`/lesson/unit${unit}/#learn/exam`);
    await page.evaluate(() => document.fonts.ready);
    const room = page.locator('.stage-exam'), questions = EXAMS[unit];
    for (const [i, question] of questions.entries()) {
      await expect(room.locator('.practice-content h3')).toContainText(question.prompt);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const control of await room.locator('.practice-options button').all()) {
        expect(await control.evaluate(el => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1)).toBe(true);
        expect((await control.boundingBox()).height).toBeGreaterThanOrEqual(44);
      }
      const actions = room.getByRole('group', { name: '作答操作', exact: true });
      const position = () => actions.evaluate(el => el.getBoundingClientRect().top + scrollY);
      const before = await position();
      if (i === 3) {
        const hint = room.getByRole('button', { name: '给点线索', exact: true });
        const h = await hint.boundingBox(), check = await room.getByRole('button', { name: '检查答案', exact: true }).boundingBox();
        expect(h.x + h.width).toBeLessThan(check.x); await hint.click(); expect(await position()).toBeCloseTo(before, 0);
      }
      await choose(room, question); expect(await position()).toBeCloseTo(before, 0);
      if (Array.isArray(question.answer)) {
        const selected = room.getByRole('group', { name: '已选词块', exact: true });
        expect(await selected.evaluate(el => el.scrollHeight <= el.clientHeight + 1), '已选词块不能被固定高度裁掉').toBe(true);
      }
      if (Array.isArray(question.answer) || i === questions.length - 1 || (unit === '5-6' && i === 7)) await room.screenshot({ path: `output/playwright/units1-6-exam/unit${unit}-q${i + 1}-${width}.png` });
      await room.getByRole('button', { name: '检查答案', exact: true }).click(); await expect(room.getByRole('status')).toHaveText('答对了！');
      expect(await position()).toBeCloseTo(before, 0);
      await room.getByRole('button', { name: i === questions.length - 1 ? '查看本次记录' : '下一题', exact: true }).click();
    }
    const finish = room.getByRole('group', { name: '完成后的操作', exact: true }); await expect(finish.getByRole('button')).toHaveCount(2);
    for (const control of await finish.getByRole('button').all()) {
      const b = await control.boundingBox(); expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(width); expect(b.height).toBeGreaterThanOrEqual(44);
    }
    await room.screenshot({ path: `output/playwright/units1-6-exam/unit${unit}-finish-${width}.png` });
  });
}
for (const unit of ['1-2', '3-4', '5-6']) test(`${unit} 缓存课程断网刷新仍保留未提交答案，下一题为空`, async ({ page, context }) => {
  test.setTimeout(60000);
  await page.goto(`/lesson/unit${unit}/#learn/exam`); const room = page.locator('.stage-exam');
  await choose(room, EXAMS[unit][0]);
  await context.setOffline(true);
  const response = await page.reload(); expect(response.headers()['x-course-offline']).toBe('1');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('status')).toBeEmpty();
  await expect(room.getByRole('button', { name: EXAMS[unit][0].answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await context.setOffline(false);
});
