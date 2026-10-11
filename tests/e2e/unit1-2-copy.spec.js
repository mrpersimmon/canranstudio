'use strict';
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
async function showStarProgress(page) {
  const tasks = page.locator('.story-award-tasks');
  if (await tasks.getAttribute('open') === null) await tasks.getByText('星星进度', { exact: true }).click();
}

test('星星进度区分开始、继续、订正后重练和已获星查看', async ({ page }) => {
  await page.goto('/unit1-2/#learn/certificate');
  await showStarProgress(page);
  const task = page.locator('.story-award-tasks li').filter({ hasText: '帮忙还手提包' });
  await expect(task).toContainText('未开始');
  await task.getByRole('button', { name: '开始', exact: true }).click();
  const room = page.locator('.stage-manners');
  await flow.select(room, { fills: ['it'] });
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await page.goto('/unit1-2/#learn/certificate');
  await showStarProgress(page);
  await expect(task).toContainText('进行中');
  await task.getByRole('button', { name: '继续', exact: true }).click();
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await flow.activity(page, '1-2', 'manners');
  await room.getByRole('button', { name: '下一站：综合挑战', exact: true }).click();
  await page.goto('/unit1-2/#learn/certificate');
  await showStarProgress(page);
  await expect(task).toContainText('已完成 · 未获星');
  await task.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await flow.activity(page, '1-2', 'manners');
  await page.goto('/unit1-2/#learn/certificate');
  await showStarProgress(page);
  await expect(task).toContainText('已获星');
  await task.getByRole('button', { name: '查看', exact: true }).click();
  await expect(room.getByRole('list', { name: '本轮成果' }).locator('.completion-number')).toHaveText(['5', '5', '0']);
});

test('短题干、阅读摘录和语法示范保留必要条件，所有题仍可完成', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/unit1-2/#learn/words');
  const words = page.getByRole('region', { name: '单词小图鉴', exact: true });
  await expect(words.locator('.word-phonetic')).toHaveCount(6);
  await words.getByRole('button', { name: '下一组', exact: true }).click();
  await flow.story(page, '1-2');
  await flow.activity(page, '1-2', 'roles', { capture: async (room, i, state) => {
    if (state !== 'blank') return;
    if (i === 1) {
      const reading = room.getByRole('region', { name: '手提包的故事', exact: true });
      await expect(reading.locator('.task-reading-turn:visible')).toHaveCount(3);
      await reading.getByText('完整故事', { exact: true }).click();
      await expect(reading.locator('.task-reading-turn:visible')).toHaveCount(7);
      await reading.getByText('完整故事', { exact: true }).click();
    }
    if (i === 2) {
      await expect(room.getByRole('heading', { name: '哪一组词表示“非常”？', exact: true })).toBeVisible();
      await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
    }
  } });
  await flow.activity(page, '1-2', 'trans', { capture: async (room, i, state) => {
    if (state !== 'blank') return;
    await expect(page.getByRole('heading', { name: '语法小工坊', exact: true })).toHaveCount(1);
    await expect(room.locator('.grammar-phase')).toHaveCount(0);
    if (i === 4) await expect(room.getByRole('heading', { name: '猜猜自己的身份：我是学生吗？', exact: true })).toBeVisible();
    if (i === 5) {
      await expect(room.getByText('I 指说话人；you 指听话人。', { exact: true })).toBeVisible();
      await expect(room.getByText('I am a student.', { exact: true })).toBeVisible();
    }
    if (i === 11) await expect(room.getByText('同学问你是否准备好开始游戏。', { exact: true })).toHaveCount(0);
  } });
  await flow.activity(page, '1-2', 'exam', { capture: async (room, i, state) => {
    if (state !== 'blank') return;
    if (i === 1) await expect(room.getByRole('heading', { name: '手表不是你的，你怎么回答？', exact: true })).toBeVisible();
    if (i === 2) {
      await expect(room.getByRole('heading', { name: '读对话，选一选', exact: true })).toBeVisible();
      await expect(room).toContainText('这里的 your 表示');
      await expect(room).toContainText('回答中的 it 指');
    }
  } });
  await page.goto('/unit1-2/#learn/certificate');
  await expect(page.getByRole('region', { name: '我的纪念卡', exact: true })).toBeVisible();
});

test('订正完成明确区分首次结果，学习记录收起详细信息', async ({ page }) => {
  await page.goto('/unit1-2/#learn/manners');
  const room = page.locator('.stage-manners');
  await flow.select(room, { fills: ['it'] });
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await flow.activity(page, '1-2', 'manners');
  const result = room.getByRole('list', { name: '本轮成果', exact: true });
  await expect(result.locator('.completion-number')).toHaveText(['4', '4', '1']);
  await expect(room.getByText('本次答错', { exact: true })).toBeVisible();
  await page.reload();
  await expect(result.locator('.completion-number')).toHaveText(['4', '4', '1']);
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.getByRole('button', { name: '学习记录', exact: true }).click();
  const log = page.getByRole('dialog', { name: '学习记录', exact: true });
  await expect(log.getByText('订正完成', { exact: true })).toBeVisible();
  await expect(log.getByText('首次答对', { exact: true })).toHaveCount(4);
  await expect(log.getByText('最高连续首次答对 4 题', { exact: true })).toBeHidden();
  await log.getByText('本轮详情', { exact: true }).click();
  await expect(log.getByText('最高连续首次答对 4 题', { exact: true })).toBeVisible();
  await expect(log.getByText('提交 2 次', { exact: true })).toBeHidden();
  await log.getByRole('button', { name: '关闭', exact: true }).click();
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await flow.activity(page, '1-2', 'manners');
  await expect(result.locator('.completion-number')).toHaveText(['5', '5', '0']);
  await expect(page.locator('#starCount')).toHaveText('1');
});


test('仅更新文案保留中途作答，继续全对仍获星且不提示课程升级', async ({ page }) => {
  const fs = require('node:fs/promises');
  await page.route('**/unit1-2/content.js*', async route => route.fulfill({
    contentType: 'text/javascript', body: await fs.readFile('tests/fixtures/unit1-2-copy-before/content.js')
  }));
  await page.goto('/unit1-2/#learn/listen');
  const room = page.locator('.stage-listen');
  await expect(room.getByRole('heading', { name: '给衣服选择配对', exact: true })).toBeVisible();
  for (const answer of flow.ANSWERS['1-2'].listen.slice(0, 2)) {
    await flow.select(room, answer);
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: '下一题', exact: true }).click();
  }
  await flow.select(room, 'house');
  await page.unroute('**/unit1-2/content.js*'); await page.reload();
  await expect(room.locator('.progress-copy')).toHaveText('第 3 / 5 题');
  await expect(room.getByRole('button', { name: 'house', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(room.locator('.fb')).toBeEmpty();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await flow.activity(page, '1-2', 'listen');
  await expect(room.getByRole('list', { name: '本轮成果' }).locator('.completion-number')).toHaveText(['5', '5', '0']);
  await expect(page.locator('#starCount')).toHaveText('1');
  await expect(page.getByText('课程已升级，重新挑战，全对即可点亮星星！', { exact: true })).toHaveCount(0);
});
