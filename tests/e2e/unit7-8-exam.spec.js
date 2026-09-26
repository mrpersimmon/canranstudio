'use strict';
const { test, expect } = require('@playwright/test');
const { EXAM, selectAnswer } = require('../support/unit7-8-exam');
const { finishExamFrom } = require('../support/unit7-8-exam');
const fs = require('node:fs/promises');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('十题综合挑战逐项作答，冠词与缩写确实需要选择，错答和线索保留独立记录', async ({ page }) => {
  await page.goto('/unit7-8/#learn/exam');
  const room = page.locator('.stage-exam');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
  for (let i = 0; i < EXAM.length; i++) {
    await expect(room.locator('.practice-content h3')).toContainText(EXAM[i].prompt);
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i));
    if (i === 0) {
      await selectAnswer(room, EXAM[i].wrong); await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await expect(room.getByRole('button', { name: '下一题', exact: true })).toBeHidden();
      await expect(room.locator('.practice-options .correct')).toHaveCount(0);
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    if (i === 4) await room.getByRole('button', { name: '给点线索', exact: true }).click();
    if (i >= 7) {
      await page.reload(); await expect(check).toBeDisabled();
      await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
    }
    await selectAnswer(room, EXAM[i].answer); await check.click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    await room.getByRole('button', { name: i === 9 ? '查看本次记录' : '下一题', exact: true }).click();
  }
  await expect(room).toContainText('首次独立答对 8 / 10');
  await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');
  await room.getByText('下次再练', { exact: true }).click();
  await expect(room.locator('.unit-results li')).toHaveText(['从英文介绍提取国籍和职业', '按资料作第一人称否定回答']);
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await expect(page.locator('#starCount')).toHaveText('3');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

async function useThreeQuestionVersion(page) {
  let old = true;
  for (const name of ['index.html', 'content.js', 'unit.js', 'unit.css', 'scene.js']) {
    const body = await fs.readFile('tests/fixtures/unit7-8-exam3-before/' + name);
    const url = name === 'index.html' ? /\/unit7-8\/(?:index\.html)?(?:\?.*)?$/ : `**/unit7-8/${name}*`;
    await page.route(url, route => old ? route.fulfill({ contentType: name.endsWith('.html') ? 'text/html' : name.endsWith('.css') ? 'text/css' : 'text/javascript', body }) : route.continue());
  }
  return () => { old = false; };
}

test('三题旧挑战通关升级只保留真实三题，新增七题未答，补完才恢复证书', async ({ page }) => {
  test.setTimeout(60000);
  const upgrade = await useThreeQuestionVersion(page);
  await require('../fixtures/unit7-8-exam3-before/flow').completeUnit78(page);
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('十题小记者');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const date = await page.locator('#certificateDate').innerText(); await page.keyboard.press('Escape');
  upgrade(); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('12');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('十题小记者');
  await page.getByRole('button', { name: '继续：采访小挑战', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/exam$/);
  const room = page.locator('.stage-exam');
  await expect(room).toContainText('第 4 / 10 题');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await finishExamFrom(page, 3);
  await expect(room).toContainText('首次独立答对 10 / 10');
  await room.getByRole('button', { name: '下一站：我的单元证书', exact: true }).click();
  await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(page.locator('#certificateDate')).toHaveText(date); await page.keyboard.press('Escape');
  await page.goto('/unit7-8/#learn/exam'); await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await page.reload(); await expect(room).toContainText('第 1 / 10 题');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
});

test('旧未提交选择升级仍是草稿，新增拼句刷新与暂停不代答', async ({ page }) => {
  const upgrade = await useThreeQuestionVersion(page);
  await page.goto('/unit7-8/#learn/exam'); const room = page.locator('.stage-exam');
  await selectAnswer(room, EXAM[0].answer); await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await selectAnswer(room, EXAM[1].answer);
  upgrade(); await page.reload();
  await expect(room.getByRole('button', { name: EXAM[1].answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(room.getByRole('status')).toBeEmpty();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await selectAnswer(room, EXAM[2].answer); await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: 'What nationality', exact: true }).click();
  await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).click(); await page.reload();
  await room.getByRole('button', { name: '继续挑战', exact: true }).click();
  await expect(room.getByRole('button', { name: '撤回 What nationality', exact: true })).toBeVisible();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
});

for (const width of [320, 390, 768, 1280]) test(`${width} 十题长题干、词块和末题操作完整，灯泡与检查区稳定`, async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/lesson/unit7-8/#learn/exam'); await page.evaluate(() => document.fonts.ready);
  const room = page.locator('.stage-exam');
  for (let i = 0; i < EXAM.length; i++) {
    await expect(room.locator('.practice-content h3')).toContainText(EXAM[i].prompt);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const control of await room.locator('.practice-options button').all()) {
      expect(await control.evaluate(el => el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      const box = await control.boundingBox(); expect(box.height).toBeGreaterThanOrEqual(44);
    }
    const actions = room.getByRole('group', { name: '作答操作', exact: true });
    const position = () => actions.evaluate(el => el.getBoundingClientRect().top + scrollY);
    const before = await position();
    if (i === 5) {
      const hint = room.getByRole('button', { name: '给点线索', exact: true });
      const h = await hint.boundingBox(), c = await room.getByRole('button', { name: '检查答案', exact: true }).boundingBox();
      expect(h.x + h.width).toBeLessThan(c.x); await hint.click(); expect(await position()).toBeCloseTo(before, 0);
    }
    await selectAnswer(room, EXAM[i].answer); expect(await position()).toBeCloseTo(before, 0);
    if (Array.isArray(EXAM[i].answer)) {
      const chosen = room.getByRole('group', { name: '已选词块', exact: true });
      expect(await chosen.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
    }
    if ([3, 5, 6, 8, 9].includes(i)) await room.screenshot({ path: `output/playwright/unit7-8-exam/q${i + 1}-${width}.png` });
    await room.getByRole('button', { name: '检查答案', exact: true }).click(); expect(await position()).toBeCloseTo(before, 0);
    if (i === 9) {
      await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10');
      await page.reload(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10');
      await expect(room.getByRole('button', { name: '查看本次记录', exact: true })).toBeVisible();
    }
    await room.getByRole('button', { name: i === 9 ? '查看本次记录' : '下一题', exact: true }).click();
  }
  await expect(room).toContainText('首次独立答对 9 / 10');
  const finish = room.getByRole('group', { name: '完成后的操作', exact: true });
  await expect(finish.getByRole('button')).toHaveCount(2);
  for (const button of await finish.getByRole('button').all()) {
    const box = await button.boundingBox(); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
  await room.screenshot({ path: `output/playwright/unit7-8-exam/finish-${width}.png` });
});

test('整课包离线刷新仍是十题，当前新题未提交不计分', async ({ page, context }) => {
  await page.goto('/lesson/unit7-8/#learn/exam');
  await expect(page.locator('#courseLoader')).toHaveCount(0); const room = page.locator('.stage-exam');
  for (let i = 0; i < 3; i++) {
    await selectAnswer(room, EXAM[i].answer); await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: '下一题', exact: true }).click();
  }
  await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: 'What nationality', exact: true }).click();
  await context.setOffline(true); const response = await page.reload(); expect(response.headers()['x-course-offline']).toBe('1');
  await expect(room).toContainText('第 4 / 10 题'); await expect(room.getByRole('button', { name: '撤回 What nationality', exact: true })).toBeVisible();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});
