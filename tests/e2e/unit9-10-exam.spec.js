'use strict';
const { test, expect } = require('@playwright/test');
const { EXAM, selectAnswer, finishExamFrom } = require('../support/unit9-10-exam');
const { isFeedbackAudio } = require('../support/course-resource-urls');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('9–10 十题覆盖问候、回问、告别、缩写和观察，全部声音失败仍能独立作答', async ({ page }) => {
  test.setTimeout(60000);
  const voices = [], errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route => {
    if (!isFeedbackAudio(route.request().url())) voices.push(route.request().url());
    return route.abort();
  });
  await page.addInitScript(() => {
    window.challengeSpeechCalls = 0;
    const speak = speechSynthesis.speak;
    speechSynthesis.speak = function (...args) { window.challengeSpeechCalls++; return Reflect.apply(speak, this, args); };
  });
  await page.goto('/unit9-10/#learn/exam'); const room = page.locator('.stage-exam');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  for (const [i, question] of EXAM.entries()) {
    await expect(room.locator('.practice-content h3')).toContainText(question.prompt);
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled();
    if (i === 0) {
      await selectAnswer(room, question.wrong); await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await expect(room.locator('.practice-options .correct,.practice-options .good')).toHaveCount(0);
      await expect(room.getByRole('button', { name: '下一题', exact: true })).toHaveCount(0);
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    if (i === 3) await room.getByRole('button', { name: '给点线索', exact: true }).click();
    if (i >= 7) {
      await page.reload(); await expect(check).toBeDisabled();
      await expect(room.locator('.practice-options button[aria-pressed="true"]')).toHaveCount(0);
      await expect(room.getByRole('status')).toBeEmpty();
    }
    await selectAnswer(room, question.answer); await check.click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    await room.getByRole('button', { name: i === 9 ? '查看本次记录' : '下一题', exact: true }).click();
  }
  await expect(room).toContainText('首次独立答对 8 / 10');
  await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  expect(voices).toEqual([]); expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.challengeSpeechCalls)).toBe(0);
});

for (const width of [320, 390, 768, 1280]) test(`${width} 十题的题面、长选项与词块完整，作答操作和结束按钮稳定`, async ({ page }) => {
  test.setTimeout(60000); await page.setViewportSize({ width, height: 844 });
  await page.goto('/lesson/unit9-10/#learn/exam'); await page.evaluate(() => document.fonts.ready);
  const room = page.locator('.stage-exam');
  for (const [i, question] of EXAM.entries()) {
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
      const h = await hint.boundingBox(), c = await room.getByRole('button', { name: '检查答案', exact: true }).boundingBox();
      expect(h.x + h.width).toBeLessThan(c.x); await hint.click(); expect(await position()).toBeCloseTo(before, 0);
    }
    await selectAnswer(room, question.answer); expect(await position()).toBeCloseTo(before, 0);
    if (Array.isArray(question.answer)) {
      const selected = room.getByRole('group', { name: '已选词块', exact: true });
      expect(await selected.evaluate(el => el.scrollHeight <= el.clientHeight + 1), '已选词块必须完整显示').toBe(true);
    }
    if (i >= 6) await room.screenshot({ path: `output/playwright/unit9-10-exam/q${i + 1}-${width}.png` });
    await room.getByRole('button', { name: '检查答案', exact: true }).click(); await expect(room.getByRole('status')).toHaveText('答对了！');
    expect(await position()).toBeCloseTo(before, 0);
    await room.getByRole('button', { name: i === 9 ? '查看本次记录' : '下一题', exact: true }).click();
  }
  const finish = room.getByRole('group', { name: '完成后的操作', exact: true }); await expect(finish.getByRole('button')).toHaveCount(2);
  for (const control of await finish.getByRole('button').all()) {
    const b = await control.boundingBox(); expect(b.x).toBeGreaterThanOrEqual(0); expect(b.x + b.width).toBeLessThanOrEqual(width); expect(b.height).toBeGreaterThanOrEqual(44);
  }
  await room.screenshot({ path: `output/playwright/unit9-10-exam/finish-${width}.png` });
});
