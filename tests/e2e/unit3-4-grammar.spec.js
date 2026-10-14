'use strict';
const { test, expect } = require('@playwright/test');
const { select } = require('../support/units1-30-tasks');
const { GRAMMAR, TRANSFER, predecessor } = require('../support/unit34-grammar');
const { completeActivity, completeUnit34 } = require('../support/unit3-4-flow');
const { EXAMS, choose } = require('../support/units1-6-exam');
test.use({ actionTimeout: 5000 });

test('旧锦囊入口进入语法小工坊：先示范，错答不揭底，再撤去示范', async ({ page }) => {
  await page.goto('/unit3-4/#learn/phrases');
  const room = page.getByRole('region', { name: '语法小工坊', exact: true });
  await expect(room).toBeVisible();
  await expect(page).toHaveURL(/#learn\/reply$/);
  await expect(room.locator('.progress-copy')).toHaveText('第 1 / 10 题');
  await expect(room.getByRole('region', { name: '短示范' })).toContainText('This is not my pen.');
  await select(room, 'This is my coat.');
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  await expect(room.locator('.grammar-rule')).toBeHidden();
  await expect(room.locator('.is-correct')).toHaveCount(0);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await select(room, 'This is not my coat.');
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.locator('.grammar-rule')).toContainText('not');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.getByRole('region', { name: '短示范' })).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

test('十题完成：拼句撤回、逐空选择、配对、提示、错答和刷新均保留真实结果', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [], voices = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/\/audio\/|\/tts(?:\/|\?)/.test(request.url())) voices.push(request.url()); });
  await page.goto('/unit3-4/#learn/reply'); const room = page.locator('.stage-reply');
  for (const [i, answer] of GRAMMAR.entries()) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled();
    await expect(room.locator('.progress-copy')).toHaveText(`第 ${i + 1} / 10 题`);
    if (i === 2) {
      await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: 'This', exact: true }).press('Enter');
      await page.reload();
      await expect(room.getByRole('group', { name: '已选词块', exact: true })).toContainText('This');
      await room.getByRole('button', { name: '撤回 This', exact: true }).click();
      await expect(check).toBeDisabled();
    }
    if (i === 3) {
      await select(room, { fills: ['is not', 'am not'] }); await check.click();
      await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
      await expect(room.locator('.grammar-rule')).toBeHidden();
      await expect(room.locator('.is-correct')).toHaveCount(0); await page.reload();
      await expect(room.locator('.progress-copy')).toHaveText('第 4 / 10 题');
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    if (i === 5) {
      await room.getByRole('button', { name: '给点线索', exact: true }).click(); await page.reload();
      await expect(room.locator('.practice-hint')).toBeVisible();
    }
    if (i >= 7) {
      await expect(room.getByRole('region', { name: '短示范' })).toHaveCount(0);
      await page.reload(); await expect(check).toBeDisabled();
      await expect(room.locator('.fb')).toBeEmpty();
    }
    await select(room, answer); await check.click();
    await expect(room.locator('.fb')).toHaveText('答对了！');
    await room.getByRole('button', { name: i === 9 ? '完成这一站' : '下一题', exact: true }).click();
  }
  const cards = room.getByRole('list', { name: '本轮成果', exact: true });
  await expect(cards.locator('li')).toHaveCount(3);
  await expect(cards.locator('.completion-number')).toHaveText(['7', '10', '1']);
  await expect(page.locator('#starCount')).toHaveText('0');
  for (const [i, name] of ['streak', 'correct', 'incorrect'].entries()) await expect(cards.locator('img').nth(i)).toHaveAttribute('src', `/assets/unit1-2/completion/${name}-v1.png`);
  await page.reload(); await expect(cards.locator('.completion-number')).toHaveText(['7', '10', '1']);
  await room.getByRole('button', { name: '下一站：认领柜台', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/manners$/);
  await page.goto('/unit3-4/#learn/reply'); await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await completeActivity(page, 'reply');
  await expect(page.locator('#starCount')).toHaveText('1');
  await expect(cards.locator('.completion-number')).toHaveText(['10', '10', '0']);
  expect(errors).toEqual([]); expect(voices).toEqual([]);
});

for (const selected of [false, true]) test(`旧${selected ? '选过但未提交' : '空白草稿'}升级后，新语法首轮全对正常获星`, async ({ page }) => {
  test.setTimeout(60000); const upgrade = await predecessor(page);
  await page.goto('/unit3-4/#learn/reply');
  if (selected) await select(page.locator('.stage-reply'), { fills: ['my', 'your'] });
  await upgrade(); await page.reload();
  await expect(page.locator('.stage-reply .progress-copy')).toHaveText('第 1 / 10 题');
  await expect(page.locator('.stage-reply').getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await completeActivity(page, 'reply'); await expect(page.locator('#starCount')).toHaveText('1');
});

test('旧综合挑战全对升级：保留九题学习记录，新两题不代答，重练才取得新版星星', async ({ page }) => {
  test.setTimeout(90000); const upgrade = await predecessor(page);
  await page.goto('/unit3-4/#learn/exam'); const room = page.locator('.stage-exam');
  // The frozen predecessor contains nine questions; the current manuscript
  // also includes two transfer questions that must only be answered after upgrade.
  for (const [i, q] of EXAMS['3-4'].slice(0, 9).entries()) {
    await expect(room.locator('.progress-copy')).toHaveText(`第 ${i + 1} / 9 题`);
    await choose(room, q); await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: i === 8 ? '查看本次记录' : '下一题', exact: true }).click();
  }
  await expect(page.locator('#starCount')).toHaveText('1');
  await page.keyboard.press('Escape'); await upgrade(); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('0');
  for (const [i, answer] of TRANSFER.entries()) {
    await expect(room.locator('.progress-copy')).toHaveText(`第 ${i + 10} / 11 题`);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(room.getByRole('region', { name: '短示范' })).toHaveCount(0);
    await select(room, answer); await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: i ? '查看本次记录' : '下一题', exact: true }).click();
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('dialog.award-reveal[open]')).toContainText('课程已升级');
  await page.keyboard.press('Escape');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await completeActivity(page, 'exam'); await expect(page.locator('#starCount')).toHaveText('1');
});

for (const width of [320, 390, 768, 1280]) test(`${width} 宽：示范、长选项、词块和结算完整可用`, async ({ page }, testInfo) => {
  test.setTimeout(60000); await page.setViewportSize({ width, height: 844 });
  await page.goto('/unit3-4/#learn/reply');
  await completeActivity(page, 'reply', { inspect: async (surface, i) => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([0, 3, 6, 7, 9].includes(i)) {
      const model = surface.getByRole('region', { name: '短示范' });
      if (await model.count()) await expect(model).toBeInViewport();
      await surface.screenshot({ path: testInfo.outputPath('question-' + (i + 1) + '.png') });
    }
  } });
  const room = page.locator('.stage-reply');
  await expect(room.getByRole('list', { name: '本轮成果', exact: true }).locator('li')).toHaveCount(3);
  await expect(room.locator('.completion-number')).toHaveText(['10', '10', '0']);
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion', 'finished');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await room.screenshot({ path: testInfo.outputPath('completion.png') });
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.getByRole('region', { name: '短示范' })).toBeInViewport();
  await room.screenshot({ path: testInfo.outputPath('grammar.png') });
  const hint = await room.getByRole('button', { name: '给点线索', exact: true }).boundingBox();
  const check = await room.getByRole('button', { name: '检查答案', exact: true }).boundingBox();
  expect(hint.x + hint.width).toBeLessThanOrEqual(check.x);
});

test('真实五区完成后保留五星日期，阅读不额外计星', async ({ page }) => {
  test.setTimeout(90000); await completeUnit34(page);
  const date = await page.locator('#certificateDate').textContent(); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('5');
  await expect(page.locator('#certificateDate')).toHaveText(date);
});
