'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const flow = require('../support/thirteen-types-flow');

test('五区成绩登录后同步，课程首页和另一设备都显示一颗已获星', async ({ page, browser }) => {
  test.setTimeout(90000);
  await adminLogin(page);
  const account = await createStudent(page, '五区衔接验收', '小雨', [/Lesson 1–2 /]);
  const first = await studentLogin(browser, account); let second;
  try {
    await first.page.emulateMedia({ reducedMotion: 'reduce' });
    await flow.activity(first.page, '1-2', 'listen', { base: '/lesson' });
    await expect(first.page.locator('#starCountWrap')).toContainText('1/5');
    await expect(first.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await page.getByRole('button', { name: '查看学习进度', exact: true }).click();
    const report = page.locator('[data-learning-course="unit1-2"]');
    await expect(report).toContainText('学习中');
    await expect(report.locator('.learning-stars')).toHaveAttribute('aria-label', '已获得 1 颗星');
    await first.page.goto('/lesson/');
    await expect(first.page.locator('.course')).toContainText('1 / 5');
    second = await studentLogin(browser, account);
    await expect(second.page.locator('.course')).toContainText('1 / 5');
    await second.page.goto('/lesson/unit1-2/#learn/listen');
    await expect(second.page.locator('#starCountWrap')).toContainText('1/5');
    const room = second.page.locator('.stage-listen');
    await expect(room.getByRole('list', { name: '本轮成果' }).locator('strong')).toHaveText(['5', '5', '0']);
    await room.getByRole('button', { name: '再练一轮', exact: true }).click();
    await second.page.reload();
    await expect(second.page.locator('#starCountWrap')).toContainText('1/5');
    await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');
  } finally { await first.context.close(); await second?.context.close(); }
});

test('错答后完成可继续学习，首页与另一设备均不把完成换算成星星', async ({ page, browser }) => {
  test.setTimeout(60000);
  await adminLogin(page);
  const account = await createStudent(page, '五区错答验收', '小禾', [/Lesson 1–2 /]);
  const first = await studentLogin(browser, account); let second;
  try {
    await first.page.goto('/lesson/unit1-2/#learn/manners'); const room = first.page.locator('.stage-manners');
    await flow.select(room, { fills: ['it'] }); await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: '再试一次', exact: true }).click();
    await flow.activity(first.page, '1-2', 'manners', { base: '/lesson' });
    await expect(first.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await page.getByRole('button', { name: '查看学习进度', exact: true }).click();
    const report = page.locator('[data-learning-course="unit1-2"]');
    await expect(report).toContainText('学习中');
    await expect(report.locator('.learning-stars')).toHaveAttribute('aria-label', '已获得 0 颗星');
    second = await studentLogin(browser, account);
    await expect(second.page.locator('.course')).toContainText('0 / 5');
    await expect(second.page.getByRole('link', { name: '继续学习：礼貌小帮手', exact: true })).toBeVisible();
    await second.page.goto('/lesson/unit1-2/#learn/manners');
    await expect(second.page.locator('#starCount')).toHaveText('0');
    await expect(second.page.locator('.stage-manners').getByRole('list', { name: '本轮成果' }).locator('strong')).toHaveText(['4', '4', '1']);
  } finally { await first.context.close(); await second?.context.close(); }
});
