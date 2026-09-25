'use strict';
const { test, expect } = require('@playwright/test');
const { completeUnit34 } = require('../support/unit3-4-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 6000 });

test('真实听完 12 句、完成 27 题后领奖，刷新、暂停、末题、重练与实际导出连贯', async ({ page }) => {
  test.setTimeout(240000);
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/unit3-4/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await expect(page.locator('.stage-roles').getByRole('button', { name: '先听故事', exact: true })).toBeAttached();
  await completeUnit34(page);
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('认真认领的小雨');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '雨伞认领小帮手纪念', exact: true });
  await expect(dialog.locator('#certificateName')).toHaveText('认真认领的小雨');
  for (const name of ['客人', '工作人员']) await expect(dialog.getByRole('img', { name, exact: true })).toBeVisible();
  const firstDate = await dialog.locator('#certificateDate').innerText();
  await dialog.screenshot({ path: 'output/playwright/unit3-4/certificate-desktop.png' });
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: '保存图片', exact: true }).click();
  await (await download).saveAs('output/playwright/unit3-4/certificate-saved.png');
  const pdf = await page.pdf({ path: 'output/playwright/unit3-4/certificate-print.pdf', preferCSSPageSize: true, printBackground: true });
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeFocused();
  await page.reload(); await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(dialog.locator('#certificateDate')).toHaveText(firstDate);
  await page.keyboard.press('Escape');
  await page.getByText('和家人再试试', { exact: true }).click();
  await expect(page.locator('.writing-lines li')).toHaveText(['This is not my umbrella.', 'Sorry, sir.', 'Is this your umbrella?', 'No, it isn’t!']);
  await expect(page.locator('.reply-writing li')).toHaveCount(10);
  await page.evaluate(() => { window.print = () => {}; });
  await page.getByRole('button', { name: '打印练习纸', exact: true }).click();
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  for (const line of await page.locator('.writing-lines li, .reply-writing li').all()) await expect(line).toBeVisible();
  // One-page output alone cannot establish that a child has room to write.
  for (const question of await page.locator('.reply-writing li').all()) {
    await expect(question.locator('.writing-rule')).toHaveCount(2);
    expect(await question.evaluate(el => [...el.querySelectorAll('.writing-rule')].every(line => {
      const box = line.getBoundingClientRect();
      return box.width >= el.clientWidth * 0.9 && box.height >= 19;
    }))).toBe(true);
  }
  const sheet = await page.pdf({ path: 'output/playwright/unit3-4/writing-print.pdf', preferCSSPageSize: true, printBackground: true });
  expect(sheet.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.emulateMedia({ media: 'screen' }); await page.reload();
  await page.goto('/unit3-4/#learn/listen'); const listening = page.locator('.stage-listen');
  await listening.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(listening).toContainText('第 1 / 7 题');
  await expect(listening.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(listening.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.goto('/unit1-2/#learn/certificate');
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await page.route('**/unit3-4/content.js*', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace("id: 'unit3-4', version: 1,", "id: 'unit3-4', version: 2,") });
  });
  await page.goto('/unit3-4/#learn/certificate');
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await page.goto('/unit3-4/#learn/roles');
  await expect(page.locator('.stage-roles').getByRole('button', { name: '先听故事', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('子目录入口与三单元记录独立，封面同地址继续会重新定位', async ({ page }) => {
  const outside = [], failed = [];
  page.on('request', req => { const u = new URL(req.url()); if (u.protocol === 'http:' && u.origin === 'http://127.0.0.1:4173' && !u.pathname.startsWith('/lesson/')) outside.push(u.pathname); });
  page.on('response', res => { if (res.status() >= 400) failed.push(res.url()); });
  await page.goto('/lesson/');
  await page.getByRole('link', { name: '开始学习：雨伞认领小帮手', exact: true }).click();
  await expect(page).toHaveURL(/\/lesson\/unit3-4\/#learn\/words$/);
  await page.getByRole('link', { name: '你我的小工坊', exact: true }).click();
  await page.locator('#startBtn').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: '继续冒险', exact: true }).click();
  await expect(page.getByRole('heading', { name: '你我的小工坊', exact: true })).toBeInViewport();
  await page.getByRole('link', { name: '我的课程', exact: true }).click();
  await expect(page.getByRole('link', { name: '继续学习：雨伞认领小帮手', exact: true })).toHaveAttribute('href', '/lesson/unit3-4/#l4');
  await expect(page.getByRole('link', { name: '开始学习：礼貌小帮手', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: '晚餐采购大冒险', exact: true }).getByRole('link', { name: '开始学习', exact: true })).toBeVisible();
  expect(outside).toEqual([]); expect(failed).toEqual([]);
});

test('重开包含新单元，取消保留三单元记录，确认只清除当前路径版本', async ({ page }) => {
  await page.goto('/unit3-4/#learn/reply');
  for (const route of ['unit1-2/#learn/ask', 'unit3-4/#learn/reply', 'unit49-50/#learn/give']) { await page.goto('/lesson/' + route); await expect(page.locator('.stage-' + route.split('#learn/')[1])).toBeVisible(); }
  await page.goto('/lesson/');
  const records = () => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.includes('learning:'))));
  const before = await records();
  expect(before['canran:unit3-4:learning:v1']).toBeTruthy();
  for (const id of ['unit1-2', 'unit3-4', 'unit49-50']) expect(before['canran:lesson:' + id + ':learning:v1']).toBeTruthy();
  await page.getByRole('button', { name: '设备冒险设置', exact: true }).click();
  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '取消重开', exact: true }).click();
  expect(await records()).toEqual(before);
  await page.getByRole('button', { name: '重开冒险', exact: true }).click();
  await page.getByRole('button', { name: '继续确认', exact: true }).click();
  await page.getByRole('button', { name: '确认重开', exact: true }).click();
  await expect(page.getByRole('link', { name: '开始学习：雨伞认领小帮手', exact: true })).toBeVisible();
  const after = await records();
  expect(after['canran:unit3-4:learning:v1']).toBe(before['canran:unit3-4:learning:v1']);
  for (const id of ['unit1-2', 'unit3-4', 'unit49-50']) expect(after['canran:lesson:' + id + ':learning:v1']).toBeUndefined();
});

for (const width of [320, 390, 768, 1280]) test(`${width} 宽度图鉴音标、舞台、图选项、拼句与帮助可操作`, async ({ page }) => {
  await page.setViewportSize({ width, height: 740 });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  for (const activity of ['words', 'text', 'listen', 'reply', 'trans', 'certificate']) {
    await page.goto('/unit3-4/#learn/' + activity);
    const room = page.locator('.stage-' + activity);
    await expect(room.getByRole('heading').first()).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect.poll(() => room.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    if (activity === 'words') {
      const cards = room.locator('.unit-word');
      await expect(cards).toHaveCount(6);
      for (const card of await cards.all()) {
        await expect(card.locator('.word-phonetic')).toBeVisible();
        expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth + 2)).toBe(true);
      }
    }
    await room.getByRole('button', { name: '怎么玩', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(room.getByRole('button', { name: '怎么玩', exact: true })).toBeFocused();
    if ([390, 1280].includes(width)) await page.screenshot({ path: `output/playwright/unit3-4/${activity}-${width}.png` });
  }
  expect(errors).toEqual([]);
});

test('精简必做题后，Lesson 4 十组完整否定示范仍可点读', async ({ page }) => {
  await page.goto('/unit3-4/#learn/phrases');
  const room = page.getByRole('region', { name: '认领小锦囊', exact: true });
  await room.getByText('不是我的，是你的', { exact: true }).click();
  for (const word of ['pen', 'pencil', 'book', 'watch', 'coat', 'dress', 'skirt', 'shirt', 'car', 'house']) {
    await expect(room.getByRole('button', { name: `No. It isn't my ${word}. It's your ${word}.`, exact: true })).toBeVisible();
  }
  await expect(room).toContainText('只知道“不是我的”时，还不能断定“就是你的”。');
  await page.goto('/unit3-4/#learn/reply');
  const reply = page.getByRole('region', { name: '你我的接力', exact: true });
  await expect(reply).toContainText('同学正在对你说话');
  await expect(reply.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4');
  await reply.getByRole('button', { name: '你的', exact: true }).click();
  await reply.getByRole('button', { name: '听一遍', exact: true }).click();
  await expect(reply.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled({ timeout: 12000 });
  await reply.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(reply.getByRole('status')).toContainText('答对了！');
});

test('首页进入 Lesson 3–4 先看图鉴，翻页可进入听音并独立继续', async ({ page }) => {
  await page.goto('/');
  const entry = page.getByRole('region', { name: '雨伞认领小帮手', exact: true });
  await entry.getByRole('link', { name: '开始学习：雨伞认领小帮手', exact: true }).click();
  await expect(page).toHaveURL(/\/unit3-4\/#learn\/words$/);
  const words = page.getByRole('region', { name: '认领小图鉴', exact: true });
  await expect(words.getByRole('button', { name: 'umbrella', exact: true })).toContainText('/ʌmˈbrelə/');
  await expect(words.getByRole('button', { name: '上一组词卡', exact: true })).toBeDisabled();
  for (let i = 0; i < 4; i++) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await words.getByRole('button', { name: '下一站：听音寻宝', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
  await page.getByRole('link', { name: '我的课程', exact: true }).click();
  await expect(entry.getByRole('link', { name: '继续学习：雨伞认领小帮手', exact: true })).toHaveAttribute('href', '/unit3-4/#learn/listen');
  await expect(page.getByRole('link', { name: '开始学习：礼貌小帮手', exact: true })).toBeVisible();
});

test('25 张词卡的音标在窄屏、翻面、翻页和刷新后始终可见', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 }); await page.goto('/unit3-4/#learn/words');
  const room = page.locator('.stage-words');
  const phonetics = [
    '/ʌmˈbrelə/','/ˈtɪkɪt/','/ˈkloʊkruːm/','/suːt/','/skuːl/','/ˈtiːtʃɚ/',
    '/sʌn/','/ˈdɑːt̬ɚ/','/pen/','/ˈpensəl/','/bʊk/','/wɑːtʃ/',
    '/koʊt/','/dres/','/skɝːt/','/ʃɝːt/','/kɑːr/','/haʊs/',
    '/pliːz/','/hɪr/','/maɪ/','/ˈnʌmbɚ/','/faɪv/','/ˈsɔːri/','/sɝː/'
  ];
  for (let start = 0; start < 25; start += 6) {
    const cards = room.locator('.unit-word');
    await expect(cards.locator('.word-phonetic')).toHaveText(phonetics.slice(start, start + 6));
    for (const card of await cards.all()) {
      await card.click(); await expect(card.locator('.word-meaning')).toBeVisible();
      expect(await card.evaluate(el => el.scrollHeight <= el.clientHeight + 2 && el.scrollWidth <= el.clientWidth + 2)).toBe(true);
      await card.click(); await expect(card).toHaveAttribute('aria-expanded', 'false');
      await expect(card.locator('.word-phonetic')).toBeVisible();
    }
    if (start < 24) await room.getByRole('button', { name: '下一组词卡', exact: true }).click();
  }
  await page.reload(); await expect(room.getByRole('button', { name: 'sir', exact: true })).toContainText('/sɝː/');
});

for (const width of [320, 1280]) test(`${width} 灯泡位于检查左侧，提示和反馈不推移按钮，结束操作集中`, async ({ page }) => {
  await page.setViewportSize({ width, height: 740 }); await page.goto('/unit3-4/#learn/manners');
  await page.evaluate(() => document.fonts.ready);
  const room = page.locator('.stage-manners'), actions = room.getByRole('group', { name: '作答操作', exact: true });
  const y = () => actions.evaluate(el => el.getBoundingClientRect().top + scrollY);
  const before = await y(), hint = room.getByRole('button', { name: '给点线索', exact: true }), check = room.getByRole('button', { name: '检查答案', exact: true });
  const h = await hint.boundingBox(), c = await check.boundingBox(); expect(h.x + h.width).toBeLessThan(c.x);
  await hint.click(); expect(await y()).toBeCloseTo(before, 0);
  await room.getByRole('button', { name: 'Yes, it is.', exact: true }).click(); await check.click();
  expect(await y()).toBeCloseTo(before, 0); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  const answers = ['This is not my umbrella.', 'Sorry, sir.', "No, it isn't.", 'Yes, it is.'];
  for (let i = 0; i < answers.length; i++) {
    await room.locator('.practice-options').getByRole('button', { name: answers[i], exact: true }).click();
    await check.click(); if (i === 0) expect(await y()).toBeCloseTo(before, 0);
    await room.getByRole('button', { name: i === answers.length - 1 ? '完成这一站' : '下一题', exact: true }).click();
  }
  const finish = room.getByRole('group', { name: '完成后的操作', exact: true });
  await expect(finish.getByRole('button')).toHaveCount(2);
  for (const b of await finish.getByRole('button').all()) {
    const bounds = await b.boundingBox(); expect(bounds.x).toBeGreaterThanOrEqual(0); expect(bounds.x + bounds.width).toBeLessThanOrEqual(width); expect(bounds.height).toBeGreaterThanOrEqual(44);
  }
  await room.screenshot({ path: `output/playwright/unit3-4/finish-${width}.png` });
});

test('词块撤回、错误、刷新和重试保持候选位置，下一题不携带旧答案', async ({ page }) => {
  await page.goto('/unit3-4/#learn/trans'); const room = page.locator('.stage-trans');
  const bank = room.getByRole('group', { name: '待选词块', exact: true }), selected = room.getByRole('group', { name: '已选词块', exact: true });
  const order = await bank.getByRole('button').allTextContents();
  await bank.getByRole('button', { name: 'not', exact: true }).click(); await selected.getByRole('button', { name: '撤回 not', exact: true }).click();
  for (const token of ['This','not','is','my','umbrella.']) await bank.getByRole('button', { name: token, exact: true }).click();
  await page.reload(); expect(await bank.getByRole('button').allTextContents()).toEqual(order);
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await room.getByRole('button', { name: '再试一次', exact: true }).click(); expect(await bank.getByRole('button').allTextContents()).toEqual(order);
  for (const token of ['This','is','not','my','umbrella.']) await bank.getByRole('button', { name: token, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(selected.getByRole('button')).toHaveCount(0); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});
