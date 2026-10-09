'use strict';
const fs = require('node:fs/promises');
const { test, expect } = require('@playwright/test');
const oldFlow = require('../fixtures/unit1-2-award-before/flow');
const flow = require('../support/thirteen-types-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('已发布纪念卡升级语法版：旧五星日期保留，旧问句入口可续学，新星须独立赢得', async ({ page }) => {
  test.setTimeout(120000);
  let before = true;
  await page.route('**/unit1-2/*', async route => {
    const name = new URL(route.request().url()).pathname.split('/').pop() || 'index.html';
    if (before && ['index.html', 'content.js', 'unit.js'].includes(name)) {
      await route.fulfill({ body: await fs.readFile('tests/fixtures/unit1-2-award-before/' + name),
        contentType: name.endsWith('.js') ? 'text/javascript' : 'text/html' });
    } else await route.continue();
  });
  await oldFlow.complete(page, '1-2');
  await expect(page.locator('#starCount')).toHaveText('5');
  const originalDate = await page.locator('#certificateDate').textContent();
  before = false; await page.reload();
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#certificateDate')).toBeHidden();
  await page.goto('/unit1-2/#learn/workshop');
  await expect(page).toHaveURL(/#learn\/trans$/);
  const grammar = page.locator('.stage-trans');
  await expect(grammar.locator('.progress-copy')).toHaveText('第 1 / 12 题');
  await expect(grammar.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.goto('/unit1-2/#learn/listen');
  const words = page.locator('.stage-listen');
  // The old workshop's unchanged watch task joins the four completed words.
  await expect(words.getByRole('list', { name: '本轮成果' }).locator('strong')).toHaveText(['5', '5', '0']);
  await expect(page.locator('#starCount')).toHaveText('0');
  await words.getByRole('button', { name: '再练一轮', exact: true }).click();
  await flow.activity(page, '1-2', 'listen');
  await expect(page.locator('#starCount')).toHaveText('1');
  before = true; await page.goto('/unit1-2/#learn/certificate'); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('5');
  await expect(page.locator('#certificateDate')).toHaveText(originalDate);
});
