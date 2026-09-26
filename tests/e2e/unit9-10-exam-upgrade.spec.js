'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const { EXAM, selectAnswer, finishExamFrom } = require('../support/unit9-10-exam');
const oldFlow = require('../fixtures/unit9-10-short-exam-before/flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
async function oldEdition(page) {
  let old = true;
  for (const name of ['index.html', 'content.js', 'unit.js', 'unit.css', 'scene.js']) {
    const body = await fs.readFile('tests/fixtures/unit9-10-short-exam-before/' + name);
    const url = name === 'index.html' ? /\/unit9-10\/(?:index\.html)?(?:\?.*)?$/ : `**/unit9-10/${name}*`;
    await page.route(url, route => old ? route.fulfill({ body, contentType: name.endsWith('html') ? 'text/html' : name.endsWith('css') ? 'text/css' : 'text/javascript' }) : route.continue());
  }
  return () => { old = false; };
}

test('9–10 三题旧挑战完成后保留有效题，新增题亲自补完才重新领证', async ({ page }) => {
  test.setTimeout(90000); const upgrade = await oldEdition(page); await oldFlow.completeUnit910(page);
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('问候小伙伴');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const date = await page.locator('#certificateDate').innerText(); await page.keyboard.press('Escape');
  upgrade(); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('12');
  await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('问候小伙伴');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '继续：街角小挑战', exact: true }).click(); const room = page.locator('.stage-exam');
  await expect(room).toContainText('第 4 / 10 题'); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await finishExamFrom(page, 3); await expect(room).toContainText('首次独立答对 10 / 10');
  await room.getByRole('button', { name: '下一站：我的单元证书', exact: true }).click(); await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click(); await expect(page.locator('#certificateDate')).toHaveText(date); await page.keyboard.press('Escape');
  await page.goto('/unit9-10/#learn/exam'); await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

test('9–10 旧草稿只是选择，升级、暂停与刷新都不代为判对', async ({ page }) => {
  const upgrade = await oldEdition(page); await page.goto('/unit9-10/#learn/exam'); const room = page.locator('.stage-exam');
  await selectAnswer(room, EXAM[0].answer); await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await selectAnswer(room, EXAM[1].answer); upgrade(); await page.reload();
  await expect(room.getByRole('button', { name: EXAM[1].answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1'); await expect(room.getByRole('status')).toBeEmpty();
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: 'Look at', exact: true }).click();
  await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).click(); await page.reload(); await room.getByRole('button', { name: '继续挑战', exact: true }).click();
  await expect(room.getByRole('button', { name: '撤回 Look at', exact: true })).toBeVisible();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

test('9–10 缓存版断网刷新保留新增题的未提交词块，下一题仍为空', async ({ page, context }) => {
  test.setTimeout(60000); await page.goto('/lesson/unit9-10/#learn/exam'); const room = page.locator('.stage-exam');
  for (let i = 0; i < 8; i++) {
    await selectAnswer(room, EXAM[i].answer); await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  }
  await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: 'Look', exact: true }).click();
  await context.setOffline(true); const response = await page.reload(); expect(response.headers()['x-course-offline']).toBe('1');
  await expect(room.getByRole('button', { name: '撤回 Look', exact: true })).toBeVisible();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '8'); await expect(room.getByRole('status')).toBeEmpty();
  for (const token of ['at', 'Helen.', "She's", 'very well.']) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room).toContainText('第 10 / 10 题'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await context.setOffline(false);
});
