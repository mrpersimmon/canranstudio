"use strict";
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
test.use({ actionTimeout: 5000, reducedMotion: 'reduce' });

test('旧锦囊入口进入连续十二题，短示范与答对小结嵌入题目', async ({ page }) => {
  await page.goto('/unit1-2/#learn/phrases');
  const room = page.getByRole('region', { name: '语法小工坊', exact: true });
  await expect(room).toBeVisible();
  await expect(page).toHaveURL(/#learn\/trans$/);
  await expect(room.locator('.progress-copy')).toHaveText('第 1 / 12 题');
  await expect(room.getByRole('region', { name: '短示范' })).toContainText('This is your pen.');
  await expect(room.getByRole('region', { name: '短示范' })).toContainText('Is this your pen?');
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  await expect(check).toBeDisabled();
  await flow.select(room, 'This is your book.'); await check.click();
  await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  await expect(room.locator('.grammar-rule')).toBeHidden();
  await expect(room.locator('.is-correct')).toHaveCount(0);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await flow.select(room, 'Is this your book?'); await check.click();
  await expect(room.locator('.grammar-rule')).toContainText('询问');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.locator('.progress-copy')).toHaveText('第 2 / 12 题');
  await expect(room.getByRole('region', { name: '短示范' })).toHaveCount(0);
  await expect(check).toBeDisabled();
});

test('十二题循序学习，are 与 am 不混教，提示和错答保留，结束固定三张卡', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [], voice = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (/\/audio\/|\/tts(?:\/|\?)/.test(r.url())) voice.push(r.url()); });
  await page.goto('/unit1-2/#learn/trans');
  const room = page.locator('.stage-trans');
  for (const [i, answer] of flow.ANSWERS['1-2'].trans.entries()) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(room.locator('.progress-copy')).toHaveText(`第 ${i + 1} / 12 题`);
    await expect(check).toBeDisabled();
    if (i === 3) {
      await expect(room).toContainText('You are a student.');
      for (let attempt = 0; attempt < 2; attempt++) {
        await flow.select(room, { fills: [attempt ? 'Am' : 'Is'] }); await check.click();
        await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
        await expect(room.locator('.grammar-rule')).toBeHidden();
        await expect(room.locator('.is-correct')).toHaveCount(0);
        await page.reload();
        await expect(room.locator('.progress-copy')).toHaveText('第 4 / 12 题');
        await room.getByRole('button', { name: '再试一次', exact: true }).click();
      }
    }
    if (i === 4) {
      await expect(room).toContainText('问自己：我是学生吗？');
      const bank = room.getByRole('group', { name: '待选词块', exact: true });
      await bank.getByRole('button', { name: 'Am', exact: true }).press('Enter');
      await expect(check).toBeDisabled(); await page.reload();
      await expect(room.getByRole('group', { name: '已选词块', exact: true })).toContainText('Am');
      await expect(check).toBeDisabled();
    }
    if (i === 5) {
      await expect(room).toContainText('女士：I（我）');
      await expect(room).toContainText('男士问她：you（你）');
      await room.getByRole('button', { name: '给点线索', exact: true }).click();
      await expect(room.locator('.practice-hint')).toContainText('现在换男士直接问她');
      await page.reload(); await expect(room.locator('.practice-hint')).toBeVisible();
    }
    if (i >= 10) {
      await expect(room.getByRole('region', { name: '短示范' })).toHaveCount(0);
      await expect(room.locator('.grammar-phase')).toHaveText('自己试试');
      await expect(room.locator('.fb')).toBeEmpty();
    }
    await flow.select(room, answer); await check.click();
    await expect(room.locator('.fb')).toHaveText('答对了！');
    if (i === 4) await expect(room.locator('.grammar-rule')).toContainText('不需要改成 you');
    if (i === 5) await expect(room.locator('.grammar-rule')).toContainText('不是一变问句就改成 you');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    await room.getByRole('button', { name: i === 11 ? '完成这一站' : '下一题', exact: true }).click();
  }
  const cards = room.getByRole('list', { name: '本轮成果', exact: true }).getByRole('listitem'); await expect(cards).toHaveCount(3);
  await expect(cards.locator('.completion-stat-label')).toHaveText(['最高连对','本次答对','本次答错']);
  await expect(cards.locator('strong')).toHaveText(['8','11','1']);
  await expect(cards.nth(2).locator('img')).toHaveAttribute('src', /\/incorrect-v1\.png$/);
  await page.reload(); await expect(cards.locator('strong')).toHaveText(['8','11','1']);
  await room.getByRole('button', { name: '下一站：帮忙还手提包', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/manners$/);
  await page.goto('/unit1-2/#learn/trans');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(room.locator('.progress-copy')).toHaveText('第 1 / 12 题');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(cards).toHaveCount(0);
  expect(errors).toEqual([]); expect(voice).toEqual([]);
});
