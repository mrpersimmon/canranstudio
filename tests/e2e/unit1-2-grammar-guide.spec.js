'use strict';
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

for (const width of [320, 390, 768, 1280]) test(`${width} 工坊十二题与结束卡可读，选择提示和反馈不移动操作区`, async ({ page }) => {
  test.setTimeout(90000); await page.setViewportSize({ width, height: 850 });
  const base = width === 390 ? '/lesson' : '';
  await page.goto(`${base}/unit1-2/#learn/trans`);
  const room = page.locator('.stage-trans');
  for (const [i, answer] of flow.ANSWERS['1-2'].trans.entries()) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    const actions = room.getByRole('group', { name: '作答操作', exact: true });
    await expect(check).toBeDisabled();
    if (i > 0) await expect.poll(() => room.locator('.practice-progress').evaluate(el => Math.round(el.getBoundingClientRect().top - document.getElementById('topbar').getBoundingClientRect().bottom))).toBeGreaterThanOrEqual(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const button of await room.locator('button:visible').all()) {
      const box = await button.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
    const top = () => actions.evaluate(el => el.getBoundingClientRect().top + scrollY);
    const before = await top();
    await room.getByRole('button', { name: '给点线索', exact: true }).click();
    expect(Math.abs(await top() - before)).toBeLessThanOrEqual(2);
    const hint = await room.getByRole('button', { name: '给点线索', exact: true }).boundingBox();
    const submit = await check.boundingBox(); expect(hint.x + hint.width).toBeLessThan(submit.x);
    await flow.select(room, answer); expect(Math.abs(await top() - before)).toBeLessThanOrEqual(2);
    await check.click(); expect(Math.abs(await top() - before)).toBeLessThanOrEqual(2);
    await expect(room.locator('.fb')).toHaveText('答对了！');
    expect(await room.locator('.practice-answer-note').evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
    if ([0, 4, 5, 6, 10].includes(i)) {
      await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({ path: `output/playwright/unit1-2-grammar-v4/${width}-q${i + 1}.png`, fullPage:true, clip:await room.boundingBox() });
    }
    await room.getByRole('button', { name: i === 11 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(room.getByRole('list', { name: '本轮成果', exact: true }).getByRole('listitem')).toHaveCount(3);
  await expect(room.getByRole('list', { name: '本轮成果', exact: true }).locator('strong')).toHaveText(['12','12','0']);
  await expect.poll(() => room.locator('img:visible').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({ path: `output/playwright/unit1-2-grammar-v4/${width}-finish.png`, fullPage:true, clip:await room.boundingBox() });
});

test('原有礼貌表达和十个替换物品保留；跨章节和键盘操作不提交草稿', async ({ page }) => {
  await page.goto('/unit1-2/#learn/exam'); const exam = page.locator('.stage-exam');
  const first = exam.getByRole('group', { name: '第1处填空', exact: true });
  await first.getByRole('button', { name: 'Yes?', exact: true }).click();
  await page.goto('/unit1-2/#learn/phrases'); const room = page.locator('.stage-trans');
  await room.getByRole('button', { name: 'Is this your book?', exact: true }).press('Enter');
  await expect(room.locator('.fb')).toBeEmpty();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
  await page.goto('/unit1-2/#cover'); await page.getByRole('button', { name: '继续冒险', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/trans$/);
  await expect(room.getByRole('button', { name: 'Is this your book?', exact: true })).toHaveAttribute('aria-pressed','true');
  await page.goto('/unit1-2/#learn/manners'); const application = page.locator('.stage-manners');
  await application.getByText('礼貌用语', { exact: true }).click();
  await expect(application.locator('.grammar-expression-list dt')).toHaveText(['Excuse me!', 'Yes?', 'Pardon?', 'Yes, it is.', 'Thank you very much.']);
  await application.getByText('换个物品问一问', { exact: true }).click();
  await expect(application.locator('.reference-card')).toHaveCount(10);
  for (const word of ['pen', 'pencil', 'book', 'watch', 'coat', 'dress', 'skirt', 'shirt', 'car', 'house']) await expect(application.getByText(`Is this your ${word}?`, { exact: true })).toBeVisible();
  await page.goto('/unit1-2/#learn/exam');
  await expect(first.getByRole('button', { name: 'Yes?', exact: true })).toHaveAttribute('aria-pressed','true');
  await expect(exam.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(exam.locator('.fb')).toBeEmpty(); await expect(page.locator('#starCount')).toHaveText('0');
});
