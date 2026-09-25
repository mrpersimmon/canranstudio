'use strict';
const { test, expect } = require('@playwright/test');
const { completeActivity } = require('../support/unit3-4-flow');
const legacyReply = require('../fixtures/unit3-4-reply-v1.json');
test.use({ reducedMotion: 'reduce', actionTimeout: 6000 });

// Expected tasks come from the four-step teaching sequence, not runtime data.
const prompts = [
  '同学正在对你说话。听一听，钢笔是谁的？',
  '书是你的。你说“It’s my book.”。换同学对你说：It’s ___ book.',
  '外套是同学的。同学问“Is this your coat?”。用词块回答“不是我的，是你的”。',
  '这把雨伞不是你的，但你不知道是谁的。同学问“Is this your umbrella?”，怎样回答最准确？'
];
const answers = ['你的', 'your', ['No.', "It isn't", 'my coat.', "It's", 'your coat.'], "No, it isn't."];

for (const width of [320, 1280]) test(`${width} 接力用四种判断逐步练习，听辨、换人、拼句和未知归属各有任务`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/unit3-4/#learn/reply');
  const room = page.getByRole('region', { name: '你我的接力', exact: true });
  const meter = room.getByRole('progressbar'), check = room.getByRole('button', { name: '检查答案', exact: true });
  await expect(meter).toHaveAttribute('aria-valuemax', '4');
  for (let i = 0; i < answers.length; i++) {
    await expect(room.getByRole('heading', { name: prompts[i], exact: true })).toBeVisible();
    await expect(meter).toHaveAttribute('aria-valuenow', String(i));
    await expect(check).toBeDisabled();
    if (i === 0) {
      await room.getByRole('button', { name: '你的', exact: true }).click();
      await expect(check).toBeDisabled();
      await room.getByRole('button', { name: '听一遍', exact: true }).click();
      await expect(check).toBeEnabled({ timeout: 12000 });
      await page.reload();
      await expect(room.getByRole('button', { name: '你的', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expect(check).toBeDisabled();
      await room.getByRole('button', { name: '听一遍', exact: true }).click();
      await expect(check).toBeEnabled({ timeout: 12000 });
    } else if (i === 2) {
      const bank = room.getByRole('group', { name: '待选词块', exact: true });
      await bank.getByRole('button', { name: 'No.', exact: true }).click();
      await room.getByRole('button', { name: '撤回 No.', exact: true }).click();
      for (const token of answers[i]) await bank.getByRole('button', { name: token, exact: true }).click();
      await page.reload();
      await expect(room.getByRole('group', { name: '已选词块', exact: true }).getByRole('button')).toHaveCount(5);
    } else {
      if (i === 3) {
        await room.getByRole('button', { name: "No. It isn't my umbrella. It's your umbrella.", exact: true }).click();
        await check.click();
        await expect(meter).toHaveAttribute('aria-valuenow', '3');
        await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
        await room.getByRole('button', { name: '再试一次', exact: true }).click();
      }
      await room.getByRole('button', { name: answers[i], exact: true }).click();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await room.screenshot({ path: `output/playwright/unit3-4-reply/task-${i + 1}-${width}.png` });
    await check.click();
    await expect(room.getByRole('status')).toContainText('答对了！');
    await expect(meter).toHaveAttribute('aria-valuenow', String(i + 1));
    await room.getByRole('button', { name: i === 3 ? '完成这一站' : '下一题', exact: true }).click();
  }
  const finish = room.getByRole('group', { name: '完成后的操作', exact: true });
  await expect(finish.getByRole('button')).toHaveCount(2);
  await expect(finish.getByRole('button', { name: '下一站：认领小挑战', exact: true })).toBeVisible();
  await finish.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(meter).toHaveAttribute('aria-valuenow', '0');
  await expect(check).toBeDisabled();
  await expect(room.getByRole('button', { name: '你的', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('旧十题通过页面完成后，只重开接力四题，其他活动的有效成绩保留', async ({ page }) => {
  let oldEdition = true;
  // Deliver the frozen prior question edition through HTTP, then upgrade it.
  // Both editions earn their progress through actual page answers.
  await page.route('**/unit3-4/content.js*', async route => {
    const response = await route.fetch();
    const source = await response.text();
    await route.fulfill({ response, body: oldEdition ? source.replace('const definition = {', 'questions.reply = ' + JSON.stringify(legacyReply) + ';\n  const definition = {') : source });
  });
  for (const id of ['ask', 'trans']) await completeActivity(page, id);
  await page.goto('/unit3-4/#learn/reply');
  const room = page.getByRole('region', { name: '你我的接力', exact: true });
  const oldWords = ['pen', 'pencil', 'book', 'watch', 'coat', 'dress', 'skirt', 'shirt', 'car', 'house'];
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  for (let i = 0; i < oldWords.length; i++) {
    await room.getByRole('button', { name: `No. It isn't my ${oldWords[i]}. It's your ${oldWords[i]}.`, exact: true }).click();
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: i === 9 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  oldEdition = false;
  await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(room.getByRole('button', { name: '你的', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#starCount')).toHaveText('2');
  for (const id of ['ask', 'trans']) {
    await page.goto('/unit3-4/#learn/' + id);
    await expect(page.locator('.stage-' + id).getByRole('button', { name: '再练一轮', exact: true })).toBeVisible();
  }
  await completeActivity(page, 'reply');
  await expect(page.locator('#starCount')).toHaveText('3');
});
