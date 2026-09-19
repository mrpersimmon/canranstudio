'use strict';
const { test, expect } = require('@playwright/test');

test('课程导航只显示实际可用的课程，每张卡片都是直接入口', async ({ page }) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await page.getByText('单课练习',{exact:true}).click();
  for (const id of ['lesson49','lesson50','lesson51','lesson52','lesson53','lesson54','soundmark']) {
    const link=page.locator(`main a[href="/${id}/"]`);
    await expect(link).toHaveCount(1);await expect(link).toBeVisible();
    await link.click();await expect(page).toHaveURL(new RegExp('/'+id+'/$'));
    await page.goBack();
    if (!await page.locator('.single-lessons').getAttribute('open').then(v=>v!==null)) await page.getByText('单课练习',{exact:true}).click();
  }
  await expect(page.locator('main a[href="/lesson55/"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
