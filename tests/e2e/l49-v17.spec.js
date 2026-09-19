'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function captureScene(page, room, path) {
  const original = page.viewportSize();
  await page.setViewportSize({ width: original.width, height: 1400 });
  await room.screenshot({ style: '#topbar{visibility:hidden!important} :focus{outline:none!important}', path });
  await page.setViewportSize(original);
}

async function openStory(page) {
  await page.addInitScript(() => {
    if (!localStorage.getItem('canran:l49:learning:v1')) localStorage.setItem('canran:l49:learning:v1', JSON.stringify({
      version: 1, groups: {}, records: {}, activity: { fullDialogue: true }
    }));
  });
  await page.goto('/lesson49/#learn/roles');
  await page.evaluate(() => document.fonts.ready);
}

test('作答卡组与操作区在舞台中线，灯泡线索具有完整按钮轮廓', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openStory(page);
  const room = page.locator('.stage-roles');
  const center = async locator => { const box = await locator.boundingBox(); return box.x + box.width / 2; };
  const middle = await center(room);
  for (const item of [room.getByRole('group', { name: '选择回应', exact: true }), room.getByRole('group', { name: '作答操作', exact: true })]) {
    expect(Math.abs(await center(item) - middle)).toBeLessThan(2);
  }
  const hint = room.getByRole('button', { name: '给点线索', exact: true });
  await expect(hint.locator('img')).toBeVisible();
  expect(await hint.locator('img').evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
  await expect(hint).toHaveText('');
  await expect(hint).toHaveCSS('border-top-style', 'solid');
  expect(await hint.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth))).toBeGreaterThanOrEqual(2);
  expect(await hint.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  expect((await hint.boundingBox()).height).toBeGreaterThanOrEqual(44);
});

const prompts = [
  '课文中，Mrs. Bird 的丈夫喜欢什么肉？',
  '课文中，老板问要牛肉还是羔羊肉时，Mrs. Bird 怎么回答？',
  '课文中，Mrs. Bird 说丈夫不喜欢鸡肉后，老板怎么回应？',
  '如果 Mrs. Bird 这次想买羔羊肉，她应该怎么回答？',
  '顾客说“I like steak.”，如果老板也喜欢牛排，他应该怎么回答？'
];
const answers = ['steak', 'Beef, please.', "To tell you the truth, Mrs. Bird, I don't like chicken either.", 'Lamb, please.', 'I like steak, too.'];

async function audioBoundary(page, automatic = true) {
  await page.addInitScript(automatic => {
    window.playedAudio = [];
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.paused = true; this.currentTime = 0; }
      play() { this.paused = false; window.playedAudio.push(this); if (automatic) queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() { this.paused = true; }
    };
  }, automatic);
}

test('先看三个问题再听课文，完整听过并手动完成才开放故事作答', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/text');
  const lead = page.getByRole('region', { name: '听前问题', exact: true });
  await expect(lead.getByRole('listitem')).toHaveText(['丈夫喜欢什么肉？', 'Mrs. Bird 先选了哪种肉？', '老板喜欢鸡肉吗？']);
  await expect(lead.getByRole('button')).toHaveCount(0);
  await captureScene(page, page.locator('.stage-text'), 'output/playwright/l49-v17-lead.png');
  await expect(page.locator('#rolePractice')).toBeHidden();
  const next = page.locator('#nextBtn');
  for (let i = 0; i < 11; i++) { await next.click(); await expect(next).toBeEnabled(); }
  await expect(lead).toHaveCount(0);
  await expect(page.locator('#rolePractice')).toBeHidden();
  await expect(page.getByRole('button', { name: '下一站：故事小侦探', exact: true })).toBeHidden();
  await next.click();
  await expect(page.getByRole('button', { name: '下一站：故事小侦探', exact: true })).toBeEnabled();
  await expect(page.locator('#rolePractice')).toBeVisible();
  await expect(page.locator('.stage-roles')).toContainText('第 1 / 5 题');
  await expect.poll(async () => { await page.keyboard.press('Escape'); return page.locator('.growth-reveal').isVisible(); }).toBe(false);
  await next.click();
  await expect(lead).toBeVisible();
  await expect(next).toHaveText('开始听课文');
  await expect(page.locator('#rolePractice').getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.reload();
  await expect(lead).toBeVisible();
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
});

test('统一五题都有明确题干，未选不检查，末题反馈后手动完成', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 0, l2: 2, l3: 0, l4: 0, l5: 0 }));
  });
  await openStory(page);
  const room = page.getByRole('region', { name: '故事小侦探', exact: true });
  const scene = room.getByRole('region', { name: '当前情境', exact: true });
  const options = room.getByRole('group', { name: '选择回应', exact: true });
  await expect(room.getByRole('button', { name: /我演|更换角色|看看怎么说/ })).toHaveCount(0);
  for (let i = 0; i < 5; i++) {
    await expect(room.getByRole('heading', { name: prompts[i], exact: true })).toBeVisible();
    await expect(room).toContainText(`第 ${i + 1} / 5 题`);
    await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await options.getByRole('button', { name: answers[i], exact: true }).click();
    await expect(scene.getByRole('button', { name: answers[i], exact: true })).toHaveCount(0);
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.locator('#rolePractice').getByRole('status')).toHaveText('答对了！');
    await expect(scene.getByRole('button', { name: answers[i], exact: true })).toBeVisible();
    await expect(page.locator('#st-l2')).toHaveText('★★☆');
    await expect(room.getByRole('button', { name: '下一站：问话小帮手', exact: true })).toBeHidden();
    await room.getByRole('button', { name: i === 4 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(room).toContainText('破案完成！');
  await expect(page.locator('#st-l2')).toHaveText('★★★');
  const finish = room.getByRole('group', { name: '完成后的操作', exact: true });
  await expect(finish.getByRole('button')).toHaveCount(2);
  await finish.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room).toContainText('第 1 / 5 题');
  await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

for (const width of [320, 390, 600, 768, 1280]) test(`${width} 宽度灯泡紧邻检查按钮，线索就近展开且不挤动操作`, async ({ page }) => {
  await page.setViewportSize({ width, height: width < 500 ? 664 : 900 });
  await audioBoundary(page);
  await openStory(page);
  const room = page.locator('.stage-roles');
  const options = room.getByRole('group', { name: '选择回应', exact: true });
  const y = locator => locator.evaluate(node => node.getBoundingClientRect().top + scrollY);
  const hint = room.getByRole('button', { name: '给点线索', exact: true });
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  const initial = { hint: await y(hint), options: await y(options), check: await y(check) };
  if ([390, 1280].includes(width)) await captureScene(page, room, `output/playwright/l49-v17-story-${width}.png`);
  for (let i = 0; i < 5; i++) {
    const title = room.getByRole('heading', { name: prompts[i], exact: true });
    await expect(title).toBeVisible();
    expect(await title.evaluate(node => node.scrollHeight <= node.clientHeight + 2)).toBe(true);
    expect(await y(hint)).toBeCloseTo(initial.hint, 0);
    const h = await hint.boundingBox(), t = await title.boundingBox(), c = await check.boundingBox();
    const storyArea = await room.locator('.role-scroll').boundingBox();
    expect(t.y + t.height).toBeLessThanOrEqual(storyArea.y + 2);
    expect(h.y).toBeCloseTo(c.y, 0);
    expect(c.x - h.x - h.width).toBeGreaterThanOrEqual(8);
    expect(c.x - h.x - h.width).toBeLessThanOrEqual(16);
    await hint.focus(); const before = await page.evaluate(() => scrollY);
    await hint.press('Enter');
    await expect(room.locator('.practice-hint')).toBeVisible();
    await expect(room.locator('.practice-hint')).toBeInViewport();
    await expect(hint).toHaveAttribute('aria-expanded', 'true');
    expect(await page.evaluate(() => scrollY)).toBe(before);
    expect(await y(options)).toBeCloseTo(initial.options, 0);
    expect(await y(check)).toBeCloseTo(initial.check, 0);
    if (i === 2 && [390, 1280].includes(width)) await captureScene(page, room, `output/playwright/l49-v17-long-${width}.png`);
    for (const option of await options.getByRole('button').all()) {
      expect(await option.evaluate(node => node.scrollWidth <= node.clientWidth && node.scrollHeight <= node.clientHeight)).toBe(true);
    }
    await options.getByRole('button', { name: answers[i], exact: true }).click();
    await check.scrollIntoViewIfNeeded(); const scroll = await page.evaluate(() => scrollY);
    await check.press('Enter');
    const next = room.getByRole('button', { name: i === 4 ? '完成这一站' : '下一题', exact: true });
    expect(await y(next)).toBeCloseTo(initial.check, 0);
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    await next.press('Enter');
    if (i < 4) await expect.poll(async () => {
      const question = await room.getByRole('heading', { name: prompts[i + 1], exact: true }).boundingBox();
      const bar = await page.locator('#topbar').boundingBox();
      return question.y >= bar.y + bar.height && question.y + question.height <= page.viewportSize().height;
    }).toBe(true);
  }
});

test('旧角色草稿和历史成绩不预填新题，旧星星保留，新草稿静音续练', async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('canran:l49:learning:v1')) return;
    const ids = ['story-husband', 'role-bird-original', 'role-bird-transfer'];
    const states = ['steak', 'Beef, please.', 'Lamb, please.'].map((selection, i) => ({
      selection, attempts: 1, firstCorrect: true, checked: true, correct: true,
      hintUsed: true, revealed: true, runId: 'old-role-run', questionId: ids[i]
    }));
    const old = { index: 3, states, signature: ids.join('|'), draftVersion: 2, runId: 'old-role-run' };
    localStorage.setItem('canran:l49:learning:v1', JSON.stringify({ version: 1,
      groups: { rolePractice: old, 'rolePractice/bird': old },
      records: { 'role-bird-original': { ...states[1], target: '原文角色接话', prompt: 'Do you want beef or lamb?' } },
      activity: { fullDialogue: true, storyRole: 'bird' }
    }));
    localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 3, l3: 0, l4: 0, l5: 0 }));
  });
  await audioBoundary(page);
  await openStory(page);
  const room = page.locator('.stage-roles'), options = room.getByRole('group', { name: '选择回应', exact: true });
  const feedback = room.locator('#rolePractice').getByRole('status');
  await expect(room).toContainText('第 1 / 5 题');
  await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('6');
  await page.getByRole('button', { name: '学徒手记', exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('看过示范后完成');
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await options.getByRole('button', { name: 'chicken', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(feedback).toHaveText('再看看，试一次。Mrs. Bird 说丈夫喜欢 steak；他不喜欢 chicken。她自己喜欢 lamb。');
  await page.reload();
  await expect(feedback).toHaveText('再看看，试一次。Mrs. Bird 说丈夫喜欢 steak；他不喜欢 chicken。她自己喜欢 lamb。');
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await options.getByRole('button', { name: 'steak', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await page.reload();
  await expect(feedback).toHaveText('答对了！');
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room).toContainText('第 2 / 5 题');
  await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
  await options.getByRole('button', { name: 'Beef, please.', exact: true }).click();
  await page.reload();
  await expect(options.getByRole('button', { name: 'Beef, please.', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(feedback).toBeEmpty();
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  for (const answer of answers.slice(1)) {
    await options.getByRole('button', { name: answer, exact: true }).click();
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: /^(下一题|完成这一站)$/ }).click();
  }
  await page.reload();
  await expect(room).toContainText('破案完成！');
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  await expect(page.locator('#starCount')).toHaveText('6');
  await page.getByRole('button', { name: '学徒手记', exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('看过示范后完成');
  await expect(page.locator('#learningRecord')).toContainText(prompts[1]);
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room).toContainText('第 1 / 5 题');
  await expect(options.locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(feedback).toBeEmpty();
});

test('辅助操作有按钮轮廓，课文点读气泡有喇叭，折叠内容有展开标记', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/text');
  for (const button of [page.getByRole('button', { name: '学徒手记', exact: true }), page.locator('.stage-text').getByRole('button', { name: '怎么玩', exact: true }), page.locator('#autoBtn'), page.locator('#replayBtn')]) {
    await expect(button).toHaveCSS('border-top-style', 'solid');
    expect(await button.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth))).toBeGreaterThanOrEqual(2);
    expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  await page.locator('#nextBtn').click();
  const line = page.getByRole('button', { name: 'Do you want any meat today, Mrs. Bird?', exact: true });
  await expect(line.locator('img')).toBeVisible();
  await line.press('Space');
  await expect.poll(() => page.evaluate(() => window.playedAudio.length)).toBe(2);
  const summary = page.locator('.stage-choice').getByText('看例子', { exact: true });
  expect(await summary.evaluate(node => getComputedStyle(node, '::after').content)).not.toBe('none');
  await summary.click();
  await expect(page.locator('.stage-choice .practice-example')).toHaveAttribute('open', '');
});
