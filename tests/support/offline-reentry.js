'use strict';
const { expect } = require('@playwright/test');

// Use only after a /lesson/ static course was fully prepared and its context went
// offline. The old cached HTML response is evidence of a retained shell, not
// permission to open an obsolete course. The original exercise/record checks
// continue on the freshly validated page, offline again.
async function reloadWithLatestCheck(page, context, reloadOptions) {
  const course = new URL(page.url()).pathname.match(/^\/lesson\/(unit\d+-\d+)\//)?.[1];
  if (!course) throw Error('Expected a paired lesson for offline re-entry');
  const key = 'canran:lesson:' + course + ':learning:v1';
  const before = await page.evaluate(key => localStorage.getItem(key), key);
  expect(before, 'The existing real notebook must be present before re-entry').not.toBeNull();
  const response = await page.reload(reloadOptions);
  await expect(page.locator('#courseLoader')).toBeVisible();
  await expect(page.getByRole('button', { name: '再试一次', exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-course-preparing', '');
  expect(await page.evaluate(key => localStorage.getItem(key), key), 'An offline refusal must not rewrite the existing notebook').toBe(before);
  await context.setOffline(false);
  await page.getByRole('button', { name: '再试一次', exact: true }).click();
  await expect(page.locator('#courseLoader')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing', '');
  await expect(page.locator('html')).not.toHaveAttribute('data-course-painting', '');
  await context.setOffline(true);
  return response;
}

module.exports = { reloadWithLatestCheck };
