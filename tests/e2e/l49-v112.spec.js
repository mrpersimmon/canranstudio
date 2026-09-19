'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('错题直接说明，重试与答对后清除纠错，不再提供展开原因入口', async ({ page }) => {
  await page.goto('/lesson49/#learn/doare');
  const room = page.getByRole('region', { name: '问话小帮手', exact: true });
  const feedback = room.getByRole('region', { name: '答题反馈', exact: true });
  const explanation = '本句用动词 like 表达喜好，一般现在时问句是 Do you like meat?';
  await room.getByRole('button', { name: 'Are you like meat?', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(feedback.getByText(explanation, { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(room.getByText('看看原因', { exact: true })).toHaveCount(0);
  await expect(room.getByRole('status')).toContainText(explanation);
  await page.reload();
  await expect(feedback.getByText(explanation, { exact: true }).filter({ visible: true })).toBeVisible();
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await expect(feedback).toHaveText('', { useInnerText: true });
  await room.getByRole('button', { name: 'Do you like meat?', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(feedback).toHaveText('答对了！', { useInnerText: true });
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(feedback).toHaveText('', { useInnerText: true });
  await expect(room.getByRole('button', { name: '给点线索', exact: true })).toBeEnabled();
});

test('分拣题答对只显示成功，答错保留对应误选的纠错信息', async ({ page }) => {
  await page.goto('/lesson49/#learn/subjects');
  const room = page.getByRole('region', { name: '分拣小能手', exact: true });
  await room.getByRole('button', { name: '第三人称单数', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: '继续', exact: true }).click();
  await room.getByRole('button', { name: '第三人称单数', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toContainText('正确答案：第三人称复数');
  await expect(room.getByRole('status')).toContainText('两个人');
  await expect(room.getByText('看看原因', { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(room.getByRole('status')).toContainText('正确答案：第三人称复数');
  await room.getByRole('button', { name: '继续', exact: true }).click();
  await expect(room.getByRole('status')).toBeEmpty();
  await expect(room.getByRole('button', { name: '给点线索', exact: true })).toBeEnabled();
});

for (const activity of [
  { id: 'listen', name: '听音寻宝', start: '开始听辨', wrong: 'husband', right: 'butcher' },
  { id: 'exam', name: '老板的挑战', start: '开始挑战', wrong: 'beef', right: 'mince' }
]) test(`${activity.name}听辨答错后可重听重选，不展示释义或原因入口`, async ({ page }) => {
  await page.goto('/lesson49/#learn/' + activity.id);
  const room = page.getByRole('region', { name: activity.name, exact: true });
  await room.getByRole('button', { name: activity.start, exact: true }).click();
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: activity.wrong, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(room.getByText('看看原因', { exact: true })).toHaveCount(0);
  await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
  await room.getByRole('button', { name: '再听一遍', exact: true }).click();
  await expect(room.getByRole('button', { name: '再听一遍', exact: true })).toHaveAttribute('aria-busy', 'false');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: activity.right, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.getByRole('status')).toBeEmpty();
});

for (const width of [320, 390, 768, 1280]) test(`${width}px 直接纠错完整可见，灯泡、检查和重试的位置稳定`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/lesson49/#learn/doare');
  await page.evaluate(() => document.fonts.ready);
  const room = page.getByRole('region', { name: '问话小帮手', exact: true });
  const feedback = room.getByRole('region', { name: '答题反馈', exact: true });
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  await room.getByRole('button', { name: 'Are you like meat?', exact: true }).click();
  await check.scrollIntoViewIfNeeded();
  const before = await check.boundingBox(), scroll = await page.evaluate(() => scrollY);
  await room.getByRole('button', { name: '给点线索', exact: true }).click();
  expect((await check.boundingBox()).y).toBeCloseTo(before.y, 0);
  await check.click();
  const status = await room.getByRole('status').boundingBox(), note = await feedback.boundingBox();
  expect(status.y + status.height).toBeLessThanOrEqual(note.y + note.height);
  expect((await room.getByRole('button', { name: '再试一次', exact: true }).boundingBox()).y).toBeCloseTo(before.y, 0);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  await page.screenshot({ path: `output/playwright/l49-v112-correction-${width}.png` });
});

test('词块拼装答错直接纠错，重拼答对后清除解释并保留真实首答记录', async ({ page }) => {
  await page.goto('/lesson49/#learn/trans');
  const room = page.getByRole('region', { name: '词块拼装台', exact: true });
  for (const token of ['She', 'peaches.', 'likes']) {
    await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  }
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toContainText('She likes peaches.');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await expect(room.getByRole('status')).toBeEmpty();
  for (const token of ['She', 'likes', 'peaches.']) {
    await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  }
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await page.getByRole('button', { name: '学徒手记', exact: true }).click();
  const record = page.getByRole('dialog').getByRole('listitem').filter({ hasText: '词块表达' });
  await expect(record).toContainText('首次未答对');
  await expect(record).toContainText('额外提示未用');
  await expect(record).toContainText('提交 2 次');
});

test('320px 锦囊纠错只说明本题依据，全文不需要在反馈区内滚动', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/lesson49/#learn/pouch');
  await page.evaluate(() => document.fonts.ready);
  const room = page.getByRole('region', { name: '店员小锦囊', exact: true });
  await room.locator('.practice-options').getByRole('button', { name: 'Yeah', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toContainText('课文用 To tell you the truth 引出坦白的话');
  const feedback = room.getByRole('region', { name: '答题反馈', exact: true });
  expect(await feedback.evaluate(node => node.scrollHeight <= node.clientHeight)).toBe(true);
});
