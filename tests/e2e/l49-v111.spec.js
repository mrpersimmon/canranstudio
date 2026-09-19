'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function fastAudio(page) {
  await page.addInitScript(() => {
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; }
      play() { queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() {}
    };
  });
}

test('升级加载避开未标版本及 v1.11、v1.12 旧组件，刷新保留星星、题号和待检查选择', async ({ page }) => {
  await fastAudio(page);
  await page.addInitScript(() => {
    if (!localStorage.getItem('canran:l49:learning:v1')) {
      localStorage.setItem('canran:l49:learning:v1', JSON.stringify({ version: 1, groups: {}, records: {}, activity: { fullDialogue: true } }));
      localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 3, l3: 3, l4: 0, l5: 0 }));
    }
  });
  const errors = [], staleRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  // Older cached resources must not mix with this upgrade.
  await page.route(url => /^\/core\/(course-catalog\.js|lesson49-(practice\.js|role-stage\.js|subjects\.js|experience\.(js|css)))$/.test(url.pathname) && (!url.search || ['butcher-1.11', 'butcher-1.12'].includes(url.searchParams.get('v'))), route => {
    staleRequests.push(route.request().url());
    return route.abort('failed');
  });
  await page.goto('/lesson49/#learn/exam');
  const exam = page.getByRole('region', { name: '老板的挑战', exact: true });
  await exam.getByRole('button', { name: '开始挑战', exact: true }).click();
  await answerQuestion(exam, 'mince');
  await page.goto('/lesson49/#learn/roles');
  const story = page.getByRole('region', { name: '故事小侦探', exact: true });
  await story.getByRole('button', { name: 'steak', exact: true }).click();
  await page.reload();
  await expect(story.getByRole('button', { name: 'steak', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(story.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
  await page.goto('/lesson49/#learn/exam');
  await expect(exam.locator('.practice-progress')).toContainText('第 2 / 10 题');
  await expect(exam.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('9');
  await expect(exam.getByRole('button', { name: '暂停，稍后继续', exact: true })).toHaveText('暂停');
  expect(staleRequests).toEqual([]);
  expect(errors).toEqual([]);
});

async function questionVisible(page, heading) {
  await expect.poll(async () => {
    const box = await heading.boundingBox();
    const top = await page.locator('#topbar').boundingBox();
    return box && box.y >= top.y + top.height && box.y + box.height <= page.viewportSize().height;
  }).toBe(true);
}

test('短屏从检查区换题后，新题题干可见；检查反馈本身不移动按钮', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto('/lesson49/#learn/fill');
  await page.evaluate(() => document.fonts.ready);
  const room = page.getByRole('region', { name: '动词换装间', exact: true });
  await room.getByRole('button', { name: 'likes', exact: true }).click();
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  await check.scrollIntoViewIfNeeded();
  const before = await check.boundingBox();
  await check.click();
  const next = room.getByRole('button', { name: '下一题', exact: true });
  expect(Math.abs((await next.boundingBox()).y - before.y)).toBeLessThanOrEqual(2);
  await next.click();
  await questionVisible(page, room.getByRole('heading', { name: 'My parents ___ fish.', exact: true }));
});

test('挑战从长听力题切换到阅读题，题干必须出现在顶部导航下方', async ({ page }) => {
  await fastAudio(page);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/lesson49/#learn/exam');
  await page.evaluate(() => document.fonts.ready);
  const room = page.getByRole('region', { name: '老板的挑战', exact: true });
  await room.getByRole('button', { name: '开始挑战', exact: true }).click();
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: 'mince', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await questionVisible(page, room.getByRole('heading', { name: '根据原文，哪张偏好卡同时符合 Mrs. Bird 和她丈夫？', exact: true }));
  await questionVisible(page, room.getByRole('progressbar', { name: '本轮进度', exact: true }));
});

test('下一题题干已在视口内时，保持滚动位置', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/lesson49/#learn/fill');
  await page.evaluate(() => document.fonts.ready);
  const room = page.getByRole('region', { name: '动词换装间', exact: true });
  await room.getByRole('button', { name: 'likes', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  const before = await page.evaluate(() => scrollY);
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await questionVisible(page, room.getByRole('heading', { name: 'My parents ___ fish.', exact: true }));
  expect(await page.evaluate(() => scrollY)).toBe(before);
});

test('两处听辨均为大喇叭和两列图文选项，挑战暂停在标题旁', async ({ page }) => {
  await fastAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  const sizes = [];
  for (const [id, name, start] of [['listen', '听音寻宝', '开始听辨'], ['exam', '老板的挑战', '开始挑战']]) {
    await page.goto('/lesson49/#learn/' + id);
    const room = page.getByRole('region', { name, exact: true });
    await room.getByRole('button', { name: start, exact: true }).click();
    const speaker = room.getByRole('button', { name: '听一遍', exact: true });
    const box = await speaker.boundingBox(); sizes.push(box);
    expect(box.width).toBeGreaterThanOrEqual(72);
    await expect(speaker.locator('img')).toBeVisible();
    const choices = room.locator('.practice-options').getByRole('button');
    await expect(choices).toHaveCount(4);
    for (const option of await choices.all()) await expect(option.locator('img')).toBeVisible();
    const boxes = await choices.evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().x));
    expect(new Set(boxes.map(Math.round)).size).toBe(2);
    await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
    const action = await room.getByRole('button', { name: '检查答案', exact: true }).boundingBox();
    const area = await room.boundingBox();
    expect(action.width).toBe(210);
    expect(Math.abs(action.x + action.width / 2 - area.x - area.width / 2)).toBeLessThan(2);
    if (id === 'exam') {
      const pause = await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).boundingBox();
      const title = await room.getByRole('heading', { name, exact: true }).boundingBox();
      expect(Math.abs(pause.y + pause.height / 2 - title.y - title.height / 2)).toBeLessThan(12);
    }
  }
  expect(sizes[0].width).toBe(sizes[1].width);
});

test('选择题反馈靠近答案；直接纠错、提示和检查都不推移操作按钮', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/lesson49/#learn/doare');
  const room = page.getByRole('region', { name: '问话小帮手', exact: true });
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  const last = await room.locator('.practice-options').boundingBox();
  const first = await check.boundingBox();
  expect(first.y - last.y - last.height).toBeLessThanOrEqual(160);
  await room.getByRole('button', { name: '给点线索', exact: true }).click();
  expect((await check.boundingBox()).y).toBeCloseTo(first.y, 0);
  await room.getByRole('button', { name: 'Are you like meat?', exact: true }).click();
  await check.click();
  const retry = room.getByRole('button', { name: '再试一次', exact: true });
  await expect(room.getByRole('status')).toContainText('本句用动词 like');
  expect((await retry.boundingBox()).y).toBeCloseTo(first.y, 0);
  await retry.click();
  await room.getByRole('button', { name: 'Do you like meat?', exact: true }).click();
  await check.click();
  const next = room.getByRole('button', { name: '下一题', exact: true });
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await expect(room.getByText('看看原因', { exact: true })).toHaveCount(0);
  expect((await next.boundingBox()).y).toBeCloseTo(first.y, 0);
});

const examAnswers = ['mince', 'Mrs. Bird: lamb · husband: steak', 'Are you a student?', 'Do you want chicken?',
  ['Give', 'the beef', 'to', 'Lily,', 'please.'], 'Sam', 'I like lamb, too.', 'want', "Tom doesn't like beef.", "I don't like lamb either."];
async function answerQuestion(room, answer) {
  const audio = room.getByRole('button', { name: '听一遍', exact: true });
  if (await audio.isVisible()) await audio.click();
  for (const value of Array.isArray(answer) ? answer : [answer]) await room.locator('.practice-options').getByRole('button', { name: value, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: /^(下一题|完成这一站|查看本次记录)$/ }).click();
}
const promptStyle = room => room.locator('.practice-content h3').evaluate(node => {
  const style = getComputedStyle(node);
  return ['backgroundColor', 'borderStyle', 'fontSize', 'textAlign', 'padding'].map(key => style[key]);
});

test('普通练习和挑战的问句、回应与填空使用同一表现，结束后可重练和继续', async ({ page }) => {
  await fastAudio(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  const styles = {};
  for (const id of ['doare', 'either', 'fill']) {
    await page.goto('/lesson49/#learn/' + id);
    styles[id] = await promptStyle(page.locator('.stage-' + id));
  }
  await page.goto('/lesson49/#learn/exam');
  const room = page.getByRole('region', { name: '老板的挑战', exact: true });
  await room.getByRole('button', { name: '开始挑战', exact: true }).click();
  for (let i = 0; i < examAnswers.length; i++) {
    if (i === 0) {
      await room.getByRole('button', { name: '听一遍', exact: true }).click();
      await room.getByRole('button', { name: 'beef', exact: true }).click();
      await room.getByRole('button', { name: '检查答案', exact: true }).click();
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    if (i === 1) await room.getByRole('button', { name: '给点线索', exact: true }).click();
    if (i === 2) expect(await promptStyle(room)).toEqual(styles.doare);
    if (i === 6) expect(await promptStyle(room)).toEqual(styles.either);
    if (i === 7) expect(await promptStyle(room)).toEqual(styles.fill);
    await answerQuestion(room, examAnswers[i]);
    if (i === 4) await room.getByRole('button', { name: '继续第二段（5 题）', exact: true }).click();
  }
  const reward = page.getByRole('dialog', { name: '红白遮阳棚', exact: true });
  await expect(reward).toBeVisible();
  await page.evaluate(() => new Promise(requestAnimationFrame));
  await expect(reward).toBeFocused();
  // The reward has a brief accidental-dismissal guard; close it through the keyboard.
  await expect.poll(async () => { await page.keyboard.press('Escape'); return reward.isVisible(); }).toBe(false);
  await expect(room.locator('.practice-finish > p')).toHaveText('挑战完成！');
  await expect(room.locator('.challenge-highlights > div')).toHaveText(['8 / 10首次无提示答对', '1提示后完成', '1修正后完成']);
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await questionVisible(page, room.getByRole('heading', { name: '听订单，选出录音里出现的单词。', exact: true }));
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});
