'use strict';
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
const tasks = require('../support/units1-30-tasks');
const { submitSubject } = require('../support/l49-subject-flow');
const { unitSubjectAnswers } = require('../support/unit49-50-flow');
const { expectCompactCompletion } = require('../support/completion-layout');
test.use({ actionTimeout: 5000 });

// Counts and language come from the reviewed teaching flows, never page state.
for (const [pair, count] of [
  ['3-4', 5], ['5-6', 4], ['7-8', 11], ['9-10', 13], ['11-12', 10],
  ['13-14', 15], ['15-16', 8], ['17-18', 8], ['19-20', 15], ['21-22', 10],
  ['23-24', 13], ['25-26', 7], ['27-28', 8], ['29-30', 10],
  ['31-32', 8], ['33-34', 7], ['35-36', 5], ['37-38', 4], ['39-40', 4]
]) test(`${pair} 共用结算按提交计次，手机三卡完整，刷新保留`, async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 320, height: 568 });
  if (Number(pair.split('-')[0]) >= 31) await require('../support/unit' + pair + '-flow').activity(page, 'listen', '/lesson');
  else await (pair === '25-26' ? flow : tasks).activity(page, pair, 'listen', { base: '/lesson' });
  const room = page.locator('.stage-listen'), results = room.getByRole('list', { name: '本轮成果', exact: true });
  await expect(results.locator('.completion-stat-label')).toHaveText(['连续答对', '本次答对', '本次答错']);
  await expect(results.locator('.completion-number')).toHaveText([String(count), String(count), '0']);
  await expect(results.locator('.completion-unit')).toHaveText(['次', '次', '次']);
  await expect.poll(() => results.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  expect(await results.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await expectCompactCompletion(page, room);
  if (['3-4', '5-6', '25-26', '39-40'].includes(pair)) await room.screenshot({ path: `output/playwright/submission-statistics/${pair}-320.png` });
  await page.reload();
  await expect(results.locator('.completion-number')).toHaveText([String(count), String(count), '0']);
  await expectCompactCompletion(page, room);
  await expect(page.locator('.stage-words, .stage-text').getByRole('list', { name: '本轮成果' })).toHaveCount(0);
});

test('整组配对和多空只按一次检查计数，选改、提示和已判分按钮不增加次数', async ({ page }) => {
  await page.goto('/unit1-2/#learn/exam');
  const room = page.locator('.stage-exam');
  await flow.select(room, { fills: ['Yes, it is.', 'Yes?'] });
  // Choosing a wrong answer is not an incorrect submission.
  await flow.select(room, { fills: ['Yes?', 'Yes, it is.'] });
  await room.getByRole('button', { name: '检查答案', exact: true }).press('Enter');
  await page.keyboard.press('Enter');
  await expect(room.locator('.fb')).toHaveText('答对了！');
  await page.reload();
  await flow.activity(page, '1-2', 'exam', { capture: async (activity, index, phase) => {
    if (index === 3 && phase === 'blank') {
      await activity.getByRole('button', { name: '给点线索', exact: true }).click();
      await expect(activity.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    }
  } });
  await expect(room.locator('.completion-number')).toHaveText(['10', '10', '0']);
  await flow.activity(page, '1-2', 'listen');
  await expect(page.locator('.stage-listen .completion-number')).toHaveText(['5', '5', '0']);
});

test('49–50 分拣按真实回练顺序计算，订正后仍保留首次结果', async ({ page }) => {
  await page.goto('/lesson/unit49-50/#learn/subjects');
  const room = page.locator('.stage-subjects');
  for (const [index, answer] of unitSubjectAnswers.entries()) {
    if (index === 2) for (let repeat = 0; repeat < 2; repeat++) {
      await submitSubject(room, '第一人称', false);
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await page.reload();
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    await submitSubject(room, answer);
  }
  // 对、对、错、错、对，再连续答对剩余八题。
  await expect(room.locator('.completion-number')).toHaveText(['9', '11', '2']);
  await expect(room).toContainText('基础题首次答对 10 / 11');
  await page.reload(); await expect(room.locator('.completion-number')).toHaveText(['9', '11', '2']);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  for (const answer of unitSubjectAnswers) await submitSubject(room, answer);
  await expect(room.locator('.completion-number')).toHaveText(['11', '11', '0']);
});
