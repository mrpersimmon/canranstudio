'use strict';

const { test, expect } = require('@playwright/test');

for (const path of ['/', '/home/', '/lesson50/', '/soundmark/']) {
  test(`${path} loads without an uncaught page error`, async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    const response = await page.goto(path);

    expect(response.status()).toBe(200);
    expect(pageErrors).toEqual([]);
    await expect(page.locator('body')).toBeVisible();
  });
}
