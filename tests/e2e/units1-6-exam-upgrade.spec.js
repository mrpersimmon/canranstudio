'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const { EXAMS, choose, finishExam } = require('../support/units1-6-exam');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
const units = [
  { id: '1-2', oldCount: 2, title: '礼貌小挑战', complete: 'completeUnit12' },
  { id: '3-4', oldCount: 3, title: '认领小挑战', complete: 'completeUnit34' },
  { id: '5-6', oldCount: 3, title: '见面小挑战', complete: 'completeUnit56' }
];
async function oldEdition(page, unit) {
  let old = true;
  for (const name of ['index.html', 'content.js', 'unit.js', 'unit.css', 'scene.js']) {
    const body = await fs.readFile(`tests/fixtures/unit${unit}-short-exam-before/${name}`);
    const url = name === 'index.html' ? new RegExp(`/unit${unit}/(?:index\\.html)?(?:\\?.*)?$`) : `**/unit${unit}/${name}*`;
    await page.route(url, route => old ? route.fulfill({ body, contentType: name.endsWith('html') ? 'text/html' : name.endsWith('css') ? 'text/css' : 'text/javascript' }) : route.continue());
  }
  return () => { old = false; };
}
for (const unit of units) {
  test(`${unit.id} 旧课真实通关升级保留前题与姓名，新增题答完才重新领证，重练不复活旧答案`, async ({ page }) => {
    test.setTimeout(90000);
    const upgrade = await oldEdition(page, unit.id);
    await require(`../fixtures/unit${unit.id}-short-exam-before/flow`)[unit.complete](page);
    await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('综合小达人');
    await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
    const date = await page.locator('#certificateDate').innerText(); await page.keyboard.press('Escape');
    upgrade(); await page.reload();
    await expect(page.locator('#starCount')).toHaveText('12');
    await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('综合小达人');
    await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: '继续：' + unit.title, exact: true }).click();
    const room = page.locator('.stage-exam');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(unit.oldCount));
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await finishExam(page, unit.id, unit.oldCount);
    await expect(room).toContainText(`首次独立答对 ${EXAMS[unit.id].length} / ${EXAMS[unit.id].length}`);
    await room.getByRole('button', { name: '下一站：我的单元证书', exact: true }).click();
    await expect(page.locator('#starCount')).toHaveText('15');
    await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
    await expect(page.locator('#certificateDate')).toHaveText(date); await page.keyboard.press('Escape');
    await page.goto(`/unit${unit.id}/#learn/exam`); await room.getByRole('button', { name: '再练一轮', exact: true }).click();
    await page.reload(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  });

  test(`${unit.id} 旧未提交选择升级仍为草稿，暂停刷新保持选择但不计正确`, async ({ page }) => {
    const upgrade = await oldEdition(page, unit.id);
    await page.goto(`/unit${unit.id}/#learn/exam`); const room = page.locator('.stage-exam'), questions = EXAMS[unit.id];
    await choose(room, questions[0]); await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
    await choose(room, questions[1]); upgrade(); await page.reload();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    await expect(room.getByRole('status')).toBeEmpty();
    await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).click(); await page.reload();
    await room.getByRole('button', { name: '继续挑战', exact: true }).click();
    if (Array.isArray(questions[1].answer)) await expect(room.getByRole('group', { name: '已选词块', exact: true }).getByRole('button')).toHaveCount(6);
    else await expect(room.getByRole('button', { name: questions[1].answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  });
}
