'use strict';
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
const previous = require('../support/unit12-six-zones-predecessor');
test.use({ actionTimeout: 5000, reducedMotion: 'reduce' });

test('五个答题环节按 5／5／12／5／10 呈现，旧找物入口转到词汇环节', async ({ page }) => {
  await flow.story(page, '1-2');
  await expect(page.locator('.practice-runner')).toHaveCount(5);
  await expect(page.getByRole('heading', { name: '找对物品', exact: true })).toHaveCount(0);
  for (const [id, count] of [['listen', 5], ['roles', 5], ['trans', 12], ['manners', 5], ['exam', 10]]) {
    await page.goto('/unit1-2/#learn/' + id);
    await expect(page.locator('.stage-' + id + ' .progress-copy')).toHaveText(`第 1 / ${count} 题`);
  }
  await page.goto('/unit1-2/#learn/ask');
  await expect(page).toHaveURL(/#learn\/listen$/);
  await page.goto('/unit1-2/#cover');
  await page.getByRole('button', { name: '继续冒险', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
});

test('旧找物位置可从课程首页继续，不退回开始学习', async ({ page }) => {
  const restore = await previous.install(page);
  await page.goto('/unit1-2/#learn/ask');
  await page.locator('.stage-ask').getByRole('button', { name: 'watch', exact: true }).click();
  await restore(); await page.goto('/');
  await page.getByRole('link', { name: '继续学习：礼貌小帮手', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
  await expect(page.locator('.stage-listen .progress-copy')).toHaveText('第 1 / 5 题');
});

for (const selected of [false, true]) test(`六区旧版${selected ? '选中未提交' : '只打开'}，升级后五题首次全对仍可获星`, async ({ page }) => {
  const restore = await previous.install(page);
  await page.goto('/unit1-2/#learn/manners');
  await expect(page.locator('.stage-manners').getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  if (selected) await flow.select(page.locator('.stage-manners'), { fills: ['me'] });
  await restore(); await page.reload();
  const room = page.locator('.stage-manners');
  await expect(room.locator('.fb')).toBeEmpty();
  if (selected) {
    await expect(room.getByRole('button', { name: 'me', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: '下一题', exact: true }).click();
  } else await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await flow.activity(page, '1-2', 'manners');
  await expect(room.getByRole('list', { name: '本轮成果' }).locator('strong')).toHaveText(['5', '5', '0']);
  await expect(page.locator('#starCount')).toHaveText('1');
  await page.reload(); await expect(page.locator('#starCount')).toHaveText('1');
});

test('六区旧记录迁入：未改题保留，改写题未答，历史结果不能拼成零错星星', async ({ page }) => {
  test.setTimeout(90000);
  const restore = await previous.install(page);
  await flow.story(page, '1-2');
  for (const [id, items] of Object.entries(previous.answers())) {
    await page.goto('/unit1-2/#learn/' + id); const room = page.locator('.stage-' + id);
    for (const [i, answer] of items.entries()) {
      await flow.select(room, answer); await room.getByRole('button', { name: '检查答案', exact: true }).click();
      await expect(room.locator('.fb')).toHaveText('答对了！');
      await room.getByRole('button', { name: i < items.length - 1 ? '下一题' : id === 'exam' ? '查看本次记录' : '完成这一站', exact: true }).click();
    }
  }
  await page.goto('/unit1-2/#learn/certificate');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('五区体验');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const date = await page.locator('#certificateDate').innerText(); await page.keyboard.press('Escape');
  const metadata = await page.evaluate(() => { const a=JSON.parse(localStorage.getItem('canran:unit1-2:learning:v1')).activity; return [a.unitName,a.unitCertificateIssuedAt]; });
  await restore(); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.locator('#certificateName')).toHaveText('登录后显示姓名');
  await expect(page.locator('#certificateDate')).toBeHidden();
  for (const [id, progress] of [['roles', '第 5 / 5 题'], ['trans', '第 9 / 12 题']]) {
    await page.goto('/unit1-2/#learn/' + id); const room = page.locator('.stage-' + id);
    await expect(room.locator('.progress-copy')).toHaveText(progress);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(room.locator('.fb')).toBeEmpty();
    await flow.activity(page, '1-2', id);
  }
  await page.goto('/unit1-2/#learn/listen'); const listen = page.locator('.stage-listen');
  await expect(listen.getByRole('list', { name: '本轮成果' }).locator('strong')).toHaveText(['5', '5', '0']);
  await expect(page.locator('#starCount')).toHaveText('0');
  await listen.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(listen.locator('.progress-copy')).toHaveText('第 1 / 5 题');
  await expect(listen.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await flow.activity(page, '1-2', 'listen');
  await expect(page.locator('#starCount')).toHaveText('1');
  await page.goto('/unit1-2/#learn/certificate');
  await expect(page.locator('#certificateDate')).toBeHidden();
  expect(await page.evaluate(() => { const a=JSON.parse(localStorage.getItem('canran:unit1-2:learning:v1')).activity; return [a.unitName,a.unitCertificateIssuedAt]; })).toEqual(metadata);
});

test('学习内容不发星；每区整轮首次零错得一星，改正后完成和重练不会多发或扣回', async ({ page }) => {
  test.setTimeout(60000);
  await flow.story(page, '1-2');
  await expect(page.locator('#starCountWrap')).toContainText('0/5');
  await page.goto('/unit1-2/#learn/manners'); const room = page.locator('.stage-manners');
  await flow.select(room, { fills: ['it'] }); await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await flow.activity(page, '1-2', 'manners');
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(room.getByRole('list', { name: '本轮成果' }).locator('strong')).toHaveText(['4', '4', '1']);
  await expect(room.locator('.completion-award')).toContainText('本轮有过错答');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await flow.activity(page, '1-2', 'manners');
  await expect(page.locator('#starCount')).toHaveText('1');
  await expect(room.locator('.completion-award')).toContainText('整轮零错');
  await page.reload(); await expect(page.locator('#starCount')).toHaveText('1');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await flow.select(room, { fills: ['it'] }); await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await page.reload(); await expect(page.locator('#starCount')).toHaveText('1');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await flow.activity(page, '1-2', 'manners');
  await expect(page.locator('#starCount')).toHaveText('1');
  for (const id of ['listen', 'roles', 'trans', 'exam']) await flow.activity(page, '1-2', id);
  await expect(page.locator('#starCountWrap')).toContainText('5/5');
  await expect(page.locator('.lvl-stars')).toHaveText(['★', '★', '★', '★', '★']);
});

test('迁入题各归其位，故事用原文手提包，工坊以问答配对练习 it 与 I', async ({ page }) => {
  test.setTimeout(60000);
  await flow.activity(page, '1-2', 'listen', { capture: async (room, index, state) => {
    if (index === 4 && state === 'blank') {
      await expect(room).toContainText('Is this your ___?');
      await expect(room.getByRole('img', { name: '一块手表' })).toBeVisible();
    }
  } });
  await flow.story(page, '1-2');
  await flow.activity(page, '1-2', 'roles', { capture: async (room, index, state) => {
    if (index === 4 && state === 'blank') {
      await expect(room).toContainText('Is this your handbag?');
      await expect(room).toContainText('Yes, it is.');
      await expect(room).not.toContainText('shirt');
      await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    }
  } });
  await flow.activity(page, '1-2', 'trans', { capture: async (room, index, state) => {
    if (index === 8 && state === 'blank') {
      await expect(room.getByRole('group', { name: '问句', exact: true })).toBeVisible();
      await expect(room.getByRole('group', { name: '肯定回答', exact: true })).toBeVisible();
    }
  } });
  await page.locator('.stage-trans').getByRole('button', { name: '下一站：帮忙还手提包', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/manners$/);
});
