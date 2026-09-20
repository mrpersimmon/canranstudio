'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce' });

for (const [unit, label] of [['unit1-2', '继续冒险'], ['unit49-50', '继续采购']]) {
  for (const base of ['/', '/lesson/']) for (const width of [390, 1280]) test(`${unit} ${base} ${width} 像素：手动滚回封面后，继续按钮重新定位当前章节`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(`${base}${unit}/#l3`);
    const heading = page.locator('#l3 > .chapter-heading h2');
    await expect(heading).toBeInViewport();
    const resume = page.getByRole('button', { name: label, exact: true });
    const address = page.url();
    for (let attempt = 0; attempt < 2; attempt++) {
      await resume.scrollIntoViewIfNeeded();
      await expect(heading).not.toBeInViewport();
      await resume.click();
      await expect(page).toHaveURL(address);
      await expect(heading).toBeInViewport();
    }
    // Native chapter navigation still works, and Back returns to the prior stop.
    const previousTitle = await heading.textContent();
    const navigation = page.getByRole('navigation', { name: '学习关卡', exact: true });
    if (width < 700) await navigation.getByRole('combobox', { name: '选择关卡', exact: true }).selectOption({ index: 0 });
    else await navigation.getByRole('link').first().click();
    await page.goBack();
    await expect(page).toHaveURL(address);
    await expect(page.getByRole('heading', { name: previousTitle, exact: true })).toBeInViewport();
  });
}

test('不同地址时可以继续到已保存章节，排除按钮失效或保存位置错误', async ({ page }) => {
  await page.goto('/unit1-2/#l3');
  await expect(page.locator('#l3 > .chapter-heading h2')).toBeInViewport();
  await page.goto('/unit1-2/#cover');
  await page.getByRole('button', { name: '继续冒险', exact: true }).click();
  await expect(page).toHaveURL(/#l3$/);
  await expect(page.getByRole('heading', { name: '开口有礼貌', exact: true })).toBeInViewport();
});

for (const [unit, label, activity, answer] of [
  ['unit1-2', '继续冒险', 'manners', 'Pardon?'],
  ['unit49-50', '继续采购', 'needs', "She likes tomatoes, but she doesn't want any."]
]) test(`${unit} 继续到当前答题区：键盘操作、未提交选择和刷新恢复不变`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto(`/${unit}/#learn/${activity}`);
  const room = page.locator('.stage-' + activity), heading = room.locator('.stage-heading h3');
  const option = room.getByRole('button', { name: answer, exact: true });
  await option.click();
  const stars = await page.locator('#starCount').textContent();
  const resume = page.getByRole('button', { name: label, exact: true });
  await resume.scrollIntoViewIfNeeded();
  await expect(heading).not.toBeInViewport();
  await resume.focus(); await page.keyboard.press('Enter');
  await expect(heading).toBeInViewport();
  await expect(option).toHaveAttribute('aria-pressed', 'true');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(page.locator('#starCount')).toHaveText(stars);
  await page.reload();
  await expect(heading).toBeInViewport();
  await expect(option).toHaveAttribute('aria-pressed', 'true');
});

test('Lesson 49 单课参考：滚回封面后仍可继续上次活动', async ({ page }) => {
  await page.goto('/lesson49/#learn/give');
  const heading = page.locator('.stage-give .stage-heading h3');
  await expect(heading).toBeInViewport();
  const resume = page.getByRole('button', { name: '继续上次', exact: true });
  await resume.scrollIntoViewIfNeeded();
  await expect(heading).not.toBeInViewport();
  await resume.click();
  await expect(heading).toBeInViewport();
});
