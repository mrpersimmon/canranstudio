'use strict';

const { test, expect } = require('@playwright/test');
const { subjectAnswers, submitSubject } = require('../support/l49-subject-flow');
const { unitSubjectAnswers } = require('../support/unit49-50-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function expectProgress(room, completed, total, current) {
  const meter = room.getByRole('progressbar', { name: '本轮进度', exact: true });
  await expect(meter).toBeVisible();
  await expect.poll(() => meter.evaluate(node => Number(node.getAttribute('aria-valuenow') ?? node.value))).toBe(completed);
  await expect(meter).toHaveAttribute('aria-valuemax', String(total));
  await expect(meter.locator('.practice-step')).toHaveCount(total);
  await expect(meter.locator('.is-complete')).toHaveCount(completed);
  await expect(meter.locator('.is-current')).toHaveCount(current === null ? 0 : 1);
  if (current !== null) await expect(meter.locator('.practice-step').nth(current - 1)).toHaveClass(/is-current/);
}

async function choose(room, answer) {
  if (Array.isArray(answer)) {
    for (const word of answer) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: word, exact: true }).click();
  } else {
    await room.locator('.practice-options').getByRole('button', { name: answer, exact: true }).click();
  }
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status').filter({ hasText: '答对了！' })).toBeVisible();
}

test('交接题每次答对立即填绿，4/4 答对即全绿，刷新与重练保持真实进度', async ({ page }) => {
  await page.goto('/unit49-50/#learn/give');
  const room = page.locator('.stage-give');
  const answers = ['Mrs. Bird', 'that piece', 'Give that piece to me, please.', ['Give', 'that piece', 'to', 'me,', 'please.']];
  for (let i = 0; i < answers.length; i++) {
    await expect(room).toContainText(`第 ${i + 1} / 4 题`);
    await choose(room, answers[i]);
    await expectProgress(room, i + 1, 4, null);
    // 答对只更新显示，仍由孩子主动推进。
    await expect(room).toContainText(`第 ${i + 1} / 4 题`);
    if (i < 3) {
      await room.getByRole('button', { name: '下一题', exact: true }).click();
      await expectProgress(room, i + 1, 4, i + 2);
    }
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.reload();
  await expectProgress(room, 4, 4, null);
  await room.screenshot({ path: 'output/playwright/progress-give-complete.png' });
  await room.getByRole('button', { name: '完成这一站', exact: true }).click();
  await expect(room).toContainText('这一组完成了！');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expectProgress(room, 0, 4, 1);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await room.screenshot({ path: 'output/playwright/progress-give-start.png' });
});

test('分拣答错不填绿，回练只补上原题，最后一次答对立刻满格', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/unit49-50/#learn/subjects');
  const room = page.locator('.stage-subjects');
  const total = unitSubjectAnswers.length;
  for (let i = 0; i < total; i++) {
    await expectProgress(room, 0, total, i + 1);
    await submitSubject(room, unitSubjectAnswers[i] === '第一人称' ? '第二人称' : '第一人称', false);
    await expectProgress(room, 0, total, i + 1);
    await room.getByRole('button', { name: '继续', exact: true }).click();
  }
  await expect(room).toContainText(`回练 · 还有 ${total} 道待练`);
  await page.reload();
  await expectProgress(room, 0, total, 1);
  for (let i = 0; i < total; i++) {
    await submitSubject(room, unitSubjectAnswers[i], false);
    await expectProgress(room, i + 1, total, null);
    if (i < total - 1) await room.getByRole('button', { name: '继续', exact: true }).click();
  }
  await expect(room.getByRole('button', { name: '完成', exact: true })).toBeVisible();
  await page.reload();
  await expectProgress(room, total, total, null);
  await room.screenshot({ path: 'output/playwright/progress-subject-review-complete.png' });
  await room.getByRole('button', { name: '完成', exact: true }).click();
  await expect(room).toContainText(`基础题首次答对 0 / ${total}`);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expectProgress(room, 0, total, 1);
});

test('Lesson 49 的提示、选中和错答不会填绿，答对更新时操作按钮不跳动', async ({ page }) => {
  await page.goto('/lesson49/#learn/fill');
  await page.evaluate(() => document.fonts.ready);
  const room = page.locator('.stage-fill');
  await expectProgress(room, 0, 7, 1);
  await room.getByRole('button', { name: '给点线索', exact: true }).click();
  await expectProgress(room, 0, 7, 1);
  await room.getByRole('button', { name: 'like', exact: true }).click();
  await expectProgress(room, 0, 7, 1);
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expectProgress(room, 0, 7, 1);
  await page.reload();
  await expectProgress(room, 0, 7, 1);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await expectProgress(room, 0, 7, 1);
  await room.getByRole('button', { name: 'likes', exact: true }).click();
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  await check.scrollIntoViewIfNeeded();
  const before = await check.boundingBox();
  await check.click();
  await expectProgress(room, 1, 7, null);
  const after = await room.getByRole('button', { name: '下一题', exact: true }).boundingBox();
  expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(2);
  await page.reload();
  await expectProgress(room, 1, 7, null);
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expectProgress(room, 1, 7, 2);
});

test('分拣间隔题重答不重复计数，再错则撤回该格，修正后恢复', async ({ page }) => {
  await page.goto('/lesson49/#learn/subjects');
  const room = page.locator('.stage-subjects');
  for (let i = 0; i < 12; i++) await submitSubject(room, i === 11 ? '第一人称' : subjectAnswers[i]);
  await expect(room.locator('#tpItemText')).toHaveText('Mrs. Bird');
  await expectProgress(room, 11, 12, 1);
  // 已答对的间隔题保留绿色，同时用黄色描边标记当前题。
  await expect(room.locator('.practice-step').first()).toHaveClass(/is-complete/);
  await submitSubject(room, '第一人称', false);
  await expectProgress(room, 10, 12, 1);
  await page.reload();
  await expectProgress(room, 10, 12, 1);
  await room.getByRole('button', { name: '继续', exact: true }).click();
  await expectProgress(room, 10, 12, 2);
  await submitSubject(room, '第三人称复数', false);
  await expectProgress(room, 10, 12, null);
  await room.getByRole('button', { name: '继续', exact: true }).click();
  await expect(room.locator('#tpItemText')).toHaveText('they');
  await submitSubject(room, '第三人称复数', false);
  await expectProgress(room, 11, 12, null);
  await expect(room.locator('.practice-step').last()).toHaveClass(/is-complete/);
  await expect(room.locator('.practice-step').first()).not.toHaveClass(/is-complete/);
  await room.getByRole('button', { name: '继续', exact: true }).click();
  await submitSubject(room, '第三人称单数', false);
  await expectProgress(room, 12, 12, null);
  await room.getByRole('button', { name: '完成', exact: true }).click();
  await expect(room).toContainText('基础题首次答对 11 / 12');
});

async function fastAudio(page) {
  await page.addInitScript(() => {
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; }
      play() { queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() {}
    };
  });
}

test('320 窄屏的 23 词进度完整可见，重听和刷新不增加正确数', async ({ page }) => {
  await fastAudio(page);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/unit49-50/#learn/listen');
  const room = page.locator('.stage-listen');
  await expectProgress(room, 0, 23, 1);
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await expectProgress(room, 0, 23, 1);
  await choose(room, 'butcher');
  await expectProgress(room, 1, 23, null);
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await page.reload();
  await expectProgress(room, 1, 23, 2);
  const meter = room.getByRole('progressbar', { name: '本轮进度', exact: true });
  await meter.scrollIntoViewIfNeeded();
  const boxes = await meter.locator('.practice-step').evaluateAll(nodes => nodes.map(node => {
    const { x, width, right } = node.getBoundingClientRect();
    return { x, width, right };
  }));
  for (const box of boxes) {
    expect(box.width).toBeGreaterThan(4);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(320);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await room.locator('.practice-content').screenshot({ path: 'output/playwright/progress-listen-320.png' });
});

for (const scenario of [
  {
    course: 'unit49-50', label: '组合单元五题连续挑战', segmented: false,
    answers: ['mince', 'Mrs. Bird: lamb · husband: steak', 'cabbage', 'I like chicken.', 'likes 改为 like'],
    score: '首次独立答对 5 / 5'
  },
  {
    course: 'lesson49', label: 'Lesson 49 单课十题分段挑战', segmented: true,
    answers: ['mince', 'Mrs. Bird: lamb · husband: steak', 'Are you a student?', 'Do you want chicken?',
      ['Give', 'the beef', 'to', 'Lily,', 'please.'], 'Sam', 'I like lamb, too.', 'want', "Tom doesn't like beef.", "I don't like lamb either."],
    score: '首次且未用额外提示答对：10 / 10'
  }
]) test(`${scenario.label}：暂停、刷新、末题满格和重练保持真实进度`, async ({ page }) => {
  await fastAudio(page);
  await page.goto(`/${scenario.course}/#learn/exam`);
  const room = page.locator('.stage-exam');
  if (scenario.course === 'lesson49') await room.getByRole('button', { name: '开始挑战', exact: true }).click();
  const { answers } = scenario;
  const total = answers.length;
  for (let i = 0; i < answers.length; i++) {
    await expectProgress(room, i, total, i + 1);
    if (i === 0) await room.getByRole('button', { name: '听一遍', exact: true }).click();
    await choose(room, answers[i]);
    await expectProgress(room, i + 1, total, null);
    if (i === 0) {
      await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).click();
      await page.reload();
      await room.getByRole('button', { name: '继续挑战', exact: true }).click();
      await expectProgress(room, 1, total, null);
    }
    if (i < total - 1) await room.getByRole('button', { name: '下一题', exact: true }).click();
    if (i === 4 && scenario.segmented) {
      await expect(room).toContainText('已完成 5 / 10 题');
      await page.reload();
      await room.getByRole('button', { name: '继续第二段（5 题）', exact: true }).click();
      await expectProgress(room, 5, 10, 6);
    }
  }
  if (!scenario.segmented) await expect(room.getByRole('button', { name: '继续第二段（5 题）', exact: true })).toHaveCount(0);
  await expect(room.getByRole('button', { name: '查看本次记录', exact: true })).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('0');
  await room.getByRole('button', { name: '查看本次记录', exact: true }).click();
  if (scenario.course === 'lesson49') {
    const reward = page.getByRole('dialog', { name: '红白遮阳棚', exact: true });
    await expect(reward).toBeVisible();
    await expect.poll(async () => { await page.keyboard.press('Escape'); return reward.isVisible(); }).toBe(false);
  }
  await expect(room).toContainText(scenario.score);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expectProgress(room, 0, total, 1);
});
