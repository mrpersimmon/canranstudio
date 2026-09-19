'use strict';
const { test, expect } = require('@playwright/test');
const { subjectAnswers, submitSubject } = require('../support/l49-subject-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function submit(room, value, advance = true) {
  await room.locator('.practice-options').getByRole('button', { name: value, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  if (advance) await room.getByRole('button', { name: '下一题', exact: true }).click();
}

test('接收者题直接问是谁，只能选择人物，并按说话者理解 me', async ({ page }) => {
  await page.goto('/lesson49/#learn/give');
  const room = page.getByRole('region', { name: '交接小帮手', exact: true });
  await expect(room.getByRole('heading', { name: 'Mrs. Bird 说：Give me that piece, please. 接收者是谁？', exact: true })).toBeVisible();
  const options = room.locator('.practice-options');
  await expect(options.getByRole('button')).toHaveCount(2);
  await expect(options.getByRole('button', { name: 'me', exact: true })).toHaveCount(0);
  await expect(options.getByRole('button', { name: 'that piece', exact: true })).toHaveCount(0);
  for (const name of ['Mrs. Bird', 'the butcher']) {
    const option = options.getByRole('button', { name, exact: true });
    await expect(option).toBeVisible();
    expect(await option.locator('img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await submit(room, 'the butcher', false);
  await expect(room.getByRole('status')).toContainText('me 指正在说话的 Mrs. Bird，她是接收者。');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await submit(room, 'Mrs. Bird', false);
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.getByRole('heading', { name: /哪部分表示要给的物品/ })).toBeVisible();
});

test('旧版 me 的完成草稿不能代答人物题，历史手记、星星和其他活动草稿保留', async ({ page }) => {
  await page.addInitScript(() => {
    const key = 'canran:l49:learning:v1';
    if (localStorage.getItem(key)) return;
    const ids = ['give-recipient', 'give-object', 'give-predict', 'give-order', 'give-handoff', 'show-order'];
    const answers = ['me', 'that piece', 'Give that piece to me, please.', 'Give that piece to me, please.', 'Tom', 'Show your ticket to Lily, please.'];
    const states = answers.map((selection, index) => ({
      selection, attempts: 1, firstCorrect: true, checked: true, correct: true,
      hintUsed: false, runId: 'old-give-round', questionId: ids[index],
      ...([3, 5].includes(index) ? { tokens: [0, 1, 2, 3, 4] } : {})
    }));
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      groups: { givePractice: { index: 6, states, signature: ids.join('|'), draftVersion: 2, runId: 'old-give-round' } },
      records: { 'give-recipient': { ...states[0], target: 'give 接收者', prompt: 'Mrs. Bird 说：Give me that piece, please.\n哪一个词表示接收者“给谁”？' } },
      activity: { fullDialogue: true }
    }));
    localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 3, l3: 0, l4: 0, l5: 0 }));
  });
  await page.goto('/lesson49/#learn/roles');
  const roles = page.getByRole('region', { name: '故事小侦探', exact: true });
  await roles.getByRole('button', { name: 'steak', exact: true }).click();
  await page.goto('/lesson49/#learn/give');
  const room = page.getByRole('region', { name: '交接小帮手', exact: true });
  await expect(room).toContainText('第 1 / 6 题');
  await expect(room.getByRole('status')).toBeEmpty();
  await expect(room.getByRole('button', { pressed: true })).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('6');
  await submit(room, 'Mrs. Bird', false);
  await page.reload();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await expect(room.getByRole('button', { name: 'Mrs. Bird', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/lesson49/#learn/roles');
  await expect(roles.getByRole('button', { name: 'steak', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(roles.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
  await expect(page.locator('#starCount')).toHaveText('6');
  await page.getByRole('button', { name: '学徒手记', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('listitem').filter({ hasText: '哪一个词表示接收者“给谁”？' })).toBeVisible();
});

test('we 属于第一人称复数，误选第三人称复数时解释包含说话者', async ({ page }) => {
  await page.goto('/lesson49/#learn/subjects');
  const room = page.getByRole('region', { name: '分拣小能手', exact: true });
  for (const answer of subjectAnswers.slice(0, 8)) await submitSubject(room, answer);
  await expect(room).toContainText('we');
  await submitSubject(room, '第三人称复数', false);
  await expect(room.getByRole('status')).toContainText('正确答案：第一人称');
  await expect(room.getByRole('status')).toContainText('we 包含说话者，是第一人称复数。');
});

test('变身魔法以原句、箭头、新句横向对照，窄屏保持可读且重播不重复插入', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 960 });
  await page.goto('/lesson49/#learn/give');
  await page.evaluate(() => document.fonts.ready);
  const room = page.getByRole('region', { name: '交接小帮手', exact: true });
  await submit(room, 'Mrs. Bird');
  await submit(room, 'that piece');
  const scene = room.locator('.morph-scene');
  const play = room.getByRole('button', { name: '播放变身魔法', exact: true });
  await expect(play).toBeHidden();
  await submit(room, 'Give that piece to me, please.', false);
  await expect(scene).toBeHidden();
  await play.click();
  await expect(scene).toHaveText(/^Give me that piece, please\.\s*→\s*Give that piece to me, please\.$/);
  await expect(scene.getByText('to', { exact: true })).toBeVisible();
  const before = scene.getByText(/^Give me that piece, please\.(?:\s*→)?$/);
  const after = scene.getByText('Give that piece to me, please.', { exact: true });
  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    const left = await before.boundingBox(), right = await after.boundingBox();
    expect(left.x + left.width).toBeLessThan(right.x);
    expect(Math.abs(left.y + left.height / 2 - right.y - right.height / 2)).toBeLessThanOrEqual(2);
    if (width === 1280) {
      expect(left.height).toBeLessThan(40);
      expect(right.height).toBeLessThan(40);
    }
    expect(await before.evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
    expect(await scene.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await scene.screenshot({ path: `output/playwright/l49-v113-morph-${width}.png` });
  }
  await play.click();
  await expect(scene).toHaveCount(1);
  await expect(scene).toHaveText(/^Give me that piece, please\.\s*→\s*Give that piece to me, please\.$/);
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.getByRole('group', { name: '待选词块', exact: true })).toBeVisible();
});
