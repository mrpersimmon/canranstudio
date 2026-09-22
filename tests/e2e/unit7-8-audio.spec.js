'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

// The voiced contract is archived under fixtures/unit7-8-voiced-before.
// This course now deliberately offers reading practice without narration.
for (const base of ['', '/lesson']) test(`I 词卡保留音标和释义，翻面与刷新不请求配音：${base || '/'}`, async ({ page }) => {
  const requests = [];
  await page.route('**/unit7-8/audio/**', route => { requests.push(route.request().url()); return route.abort(); });
  await page.goto(base + '/unit7-8/#learn/words');
  const words = page.locator('.stage-words');
  for (let i = 0; i < 2; i++) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  const card = words.getByRole('button', { name: 'I', exact: true });
  await expect(card).toContainText('/aɪ/');
  for (let i = 0; i < 2; i++) {
    await card.click(); await expect(card.locator('.word-meaning')).toHaveText('我；说话的人指自己');
    await expect(card.locator('.word-meaning')).toBeVisible();
    await card.click(); await expect(card.locator('.word-meaning')).toBeHidden();
  }
  await page.reload(); await expect(words.locator('#wordPageProgress')).toHaveText('3 / 4');
  for (const en of ['I', 'am', 'are']) await words.getByRole('button', { name: en, exact: true }).click();
  await expect(page.locator('#starCount')).toHaveText('0');
  expect(requests).toEqual([]);
});
