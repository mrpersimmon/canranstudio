'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const flow = require('../support/thirteen-types-flow');
test.use({ actionTimeout: 5000 });

test('账号课程与纪念册文案统一，短记录同步、目录状态和保存动图清楚', async ({ page, browser }) => {
  test.setTimeout(90000);
  const base = process.env.AWARD_TEST_BASE || '/lesson/';
  await adminLogin(page, base);
  const account = await createStudent(page, '文案页面验收', '小禾', [/Lesson 1–2/]);
  const student = await studentLogin(browser, account, base), p = student.page;
  try {
    await p.goto(base + 'awards/');
    await expect(p.getByRole('heading', { name: '我的纪念册', exact: true })).toBeVisible();
    await expect(p.getByText('点亮第一颗星，收藏第一张纪念卡。', { exact: true })).toBeVisible();
    await flow.activity(p, '1-2', 'listen', { base: base.slice(0, -1), keepAward: true });
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    const reveal = p.getByRole('dialog', { name: /纪念卡结算/ });
    await expect(reveal).toBeVisible(); await reveal.press('Escape');
    await p.getByRole('button', { name: '学习记录', exact: true }).click();
    const record = p.getByRole('dialog', { name: '学习记录', exact: true });
    await expect(record.getByText('首次答对', { exact: true })).toHaveCount(5);
    await expect(record.locator('#learningSaveStatus')).toHaveText('已同步');
    await record.getByRole('button', { name: '关闭', exact: true }).click();
    await p.getByRole('button', { name: '学习设置', exact: true }).click();
    const settings = p.getByRole('dialog', { name: '学习设置', exact: true });
    await expect(settings.getByText('小禾', { exact: true })).toBeVisible();
    await settings.getByRole('button', { name: '关闭', exact: true }).click();
    await p.goto(base + 'awards/');
    await expect(p.locator('.book')).toHaveAttribute('aria-busy', 'false');
    await expect(p.getByRole('heading', { name: '我的纪念册', exact: true })).toBeVisible();
    await expect(p.locator('.page-count')).toHaveText('第 1 / 1 页');
    await p.getByRole('button', { name: '目录', exact: true }).click();
    const directory = p.getByRole('dialog', { name: '目录', exact: true });
    await expect(directory.getByText('手提包的故事', { exact: true })).toHaveCount(0);
    const motion = directory.getByRole('switch', { name: '翻页动画', exact: true });
    const on = await motion.getAttribute('aria-checked') === 'true';
    await expect(motion).toHaveText(on ? '已开启' : '已关闭');
    await motion.click(); await expect(motion).toHaveText(on ? '已关闭' : '已开启');
    await directory.getByRole('button', { name: '关闭目录', exact: true }).click();
    const card = p.getByRole('button', { name: '放大 Lesson 1–2 礼貌小帮手', exact: true });
    await card.click();
    const detail = p.getByRole('dialog', { name: 'Lesson 1–2 纪念卡', exact: true });
    await expect(detail.getByRole('heading', { name: 'Lesson 1–2', exact: true })).toHaveCount(0);
    await expect(detail.getByRole('button', { name: '返回纪念册', exact: true })).toHaveCount(0);
    const file = p.waitForEvent('download');
    await detail.getByRole('button', { name: '保存动图', exact: true }).click();
    expect((await file).suggestedFilename()).toMatch(/\.gif$/);
    await expect(detail.getByText('动图已生成', { exact: true })).toBeVisible();
    await detail.press('Escape'); await expect(card).toBeFocused();
  } finally { await student.context.close(); }
});


test('草稿、正在同步与联网后同步分别提示，不把未提交到服务器的记录标成已同步', async ({ page, browser }) => {
  test.setTimeout(90000);
  const base = process.env.AWARD_TEST_BASE || '/lesson/';
  await adminLogin(page, base);
  const account = await createStudent(page, '同步文案验收', '小河', [/Lesson 1–2/]);
  const learner = await studentLogin(browser, account, base), p = learner.page;
  try {
    await p.goto(base + 'unit1-2/#learn/manners');
    const room = p.locator('.stage-manners');
    await flow.select(room, { fills: ['me'] });
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await p.getByRole('button', { name: '学习记录', exact: true }).click();
    const record = p.getByRole('dialog', { name: '学习记录', exact: true });
    await expect(record.locator('#learningSaveStatus')).toHaveText('本轮草稿已保存到本机。');
    await record.getByRole('button', { name: '关闭', exact: true }).click();
    await room.getByRole('button', { name: '下一题', exact: true }).click();
    let held;
    await p.route('**/api/progress', route => { held = route; });
    await flow.activity(p, '1-2', 'manners', { base: base.slice(0, -1) });
    await expect(room.locator('.award-round-result')).toHaveText('正在同步星星…');
    await expect.poll(() => Boolean(held)).toBe(true);
    await held.abort();
    await expect(room.locator('.award-round-result')).toHaveText('已保存，联网后同步星星。');
    await expect(p.locator('#starCount')).toHaveText('0');
    await p.getByRole('button', { name: '学习记录', exact: true }).click();
    await expect(record.locator('#learningSaveStatus')).toHaveText('已保存到本机 · 联网后同步');
    await record.getByRole('button', { name: '关闭', exact: true }).click();
    await p.unroute('**/api/progress');
    await p.reload();
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    await expect(p.locator('#starCount')).toHaveText('1');
  } finally { await learner.context.close(); }
});
