'use strict';
const { test, expect } = require('@playwright/test');
const { DIALOGUE, PEOPLE, ANSWERS, completeActivity, completeUnit56 } = require('../support/unit5-6-flow');
const { isFeedbackAudio } = require('../support/course-resource-urls');
test.use({ actionTimeout: 5000 });
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

test('无配音小剧场可主动阅读，角色随句子变化且 Sophie 始终在场', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/unit5-6/#learn/text');
  const story = page.locator('.stage-text');
  await story.screenshot({ path: 'output/playwright/unit5-6-classroom/story-current.png' });
  await expect(story.getByRole('button', { name: '开始看课文', exact: true })).toBeVisible();
  await expect(story.getByRole('button', { name: /听|播放/ })).toHaveCount(0);
  await story.getByRole('button', { name: '开始看课文', exact: true }).click();
  for (let i = 1; i < 8; i++) await story.getByRole('button', { name: '下一句', exact: true }).click();
  await expect(story.locator('.btext').last()).toHaveText('Nice to meet you.');
  await expect(story.locator('[data-person="sophie"]')).toBeVisible();
  await expect(story.locator('[data-person="hans"]')).toBeVisible();
  await expect(story.locator('[data-person="hans"]')).toHaveClass(/is-speaking/);
});

test('全部声音失败仍可完成23题与20句，旧重复问答不再必做', async ({ page }) => {
  test.setTimeout(120000); const voices = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { window.speechCalls = 0; speechSynthesis.speak = () => { window.speechCalls++; }; });
  await page.route(/\.(mp3|ogg|wav)(\?|$)/, route => { if (!isFeedbackAudio(route.request().url())) voices.push(route.request().url()); return route.abort(); });
  await page.goto('/lesson/unit5-6/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await completeUnit56(page, '/lesson');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('新朋友小雨');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '新朋友见面会纪念', exact: true })).toContainText('完成 Lesson 5–6 课堂配套练习');
  await page.keyboard.press('Escape'); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('15');
  await expect(page.getByRole('button', { name: /听一遍|重听|播放|开始听/ })).toHaveCount(0);
  expect(await page.evaluate(() => window.speechCalls)).toBe(0);
  expect(voices).toEqual([]); expect(errors).toEqual([]);
});

test('正误与完成反馈仍真实播放，词义题末三题没有预选或图配图泄题', async ({ page }) => {
  await page.addInitScript(() => {
    window.soundEvents = []; const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      const item = { src: this.src, ended: false }; window.soundEvents.push(item);
      this.addEventListener('ended', () => { item.ended = true; }, { once: true }); return Reflect.apply(play, this, args);
    };
  });
  await page.goto('/unit5-6/#learn/listen'); const room = page.locator('.stage-listen');
  await room.getByRole('button', { name: '德国（人）的', exact: true }).click(); await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(room.locator('.practice-options .correct')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.soundEvents.some(x => x.ended && x.src.endsWith('duolingo-incorrect.mp3')))).toBe(true);
  await page.reload(); await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  for (let i = 0; i < ANSWERS.listen.length; i++) {
    if (i >= 5) await page.reload();
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled(); await expect(room.locator('.practice-options img')).toHaveCount(0);
    await expect(room.locator('.practice-options button[aria-pressed="true"]')).toHaveCount(0);
    await room.getByRole('button', { name: ANSWERS.listen[i], exact: true }).click(); await check.click();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    if (i === 0) await expect.poll(() => page.evaluate(() => window.soundEvents.some(x => x.ended && x.src.endsWith('duolingo-correct.mp3')))).toBe(true);
    await room.getByRole('button', { name: i === 7 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect.poll(() => page.evaluate(() => window.soundEvents.some(x => x.ended && x.src.endsWith('duolingo-complete.mp3')))).toBe(true);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

test('挑战暂停与刷新保留选择及提示记录，综合题不冒认听力', async ({ page }) => {
  await page.goto('/unit5-6/#learn/exam'); const room = page.locator('.stage-exam');
  await room.getByRole('button', { name: 'Hans 和汽车都是德国的', exact: true }).click(); await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await room.getByRole('button', { name: ANSWERS.exam[0], exact: true }).click();
  await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).click(); await page.reload();
  await room.getByRole('button', { name: '继续挑战', exact: true }).click();
  await expect(room.getByRole('button', { name: ANSWERS.exam[0], exact: true })).toHaveAttribute('aria-pressed', 'true');
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await room.getByRole('button', { name: '给点线索', exact: true }).click();
  for (const token of ANSWERS.exam[1]) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await room.getByRole('button', { name: ANSWERS.exam[2], exact: true }).click(); await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: '查看本次记录', exact: true }).click();
  await expect(room).toContainText('首次独立答对 1 / 3'); await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');
  await page.goto('/unit5-6/#learn/certificate'); await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
});

for (const width of [390, 1280]) test(width + '教室分镜、翻译、末句及合影完整，页面不随下一句跳动', async ({ page }) => {
  await page.setViewportSize({ width, height: 1280 });
  await page.goto('/unit1-2/#learn/text'); await page.locator('.stage-text').screenshot({ path: `output/playwright/unit5-6-classroom/reference-${width}.png` });
  await page.goto('/unit5-6/#cover'); await page.locator('#cover').screenshot({ path: `output/playwright/unit5-6-classroom/cover-${width}.png` });
  await page.goto('/unit5-6/#learn/roles'); await page.getByRole('button', { name: '先看故事', exact: true }).click();
  const room = page.locator('.stage-text');
  for (let i = 0; i < 20; i++) {
    const next = room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true });
    await next.scrollIntoViewIfNeeded(); const y = await page.evaluate(() => scrollY);
    await next.click(); expect(await page.evaluate(() => scrollY)).toBeCloseTo(y, 0);
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0, i + 1));
    await expect(room.locator('.classroom-classmate span')).toHaveText(PEOPLE[i]);
    await expect(room.locator('[data-person="sophie"]')).toBeVisible();
    if ([2,7,10,13,16,19].includes(i)) {
      const last = room.locator('.bubble-row').last(); await last.getByRole('button', { name: '看中文', exact: true }).click();
      const bubble = await last.boundingBox(), log = await room.locator('.dialogue-log').boundingBox();
      expect(bubble.y + bubble.height).toBeLessThanOrEqual(log.y + log.height);
      const cast = await room.locator('.classroom-cast').boundingBox();
      if (width === 390) expect(cast.y + cast.height).toBeLessThan(log.y);
      await room.screenshot({ path: `output/playwright/unit5-6-classroom/story-${i + 1}-${width}.png` });
      await page.reload(); await expect(room.locator('.bubble-row').last()).toBeInViewport({ ratio: 1 });
    }
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await expect(room.locator('.classroom-photo')).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('1');
  await room.screenshot({ path: `output/playwright/unit5-6-classroom/story-finish-${width}.png` });
  await completeActivity(page, 'roles'); await page.locator('.stage-roles').screenshot({ path: `output/playwright/unit5-6-classroom/friends-finish-${width}.png` });
  await page.goto('/unit5-6/#learn/text'); await room.getByRole('button', { name: '再看一遍', exact: true }).click();
  await expect(room.locator('.classroom-classmate span')).toHaveText('Students'); await expect(room.locator('.bubble-row')).toHaveCount(0);
  const restart = await room.getByRole('button', { name: '重新上演', exact: true }).boundingBox(), start = await room.getByRole('button', { name: '开始看课文', exact: true }).boundingBox();
  expect(restart.x + restart.width).toBeLessThan(start.x); expect(restart.y).toBeCloseTo(start.y, 0);
  await page.goto('/unit5-6/#learn/models');
  await expect(page.locator('.car-showroom article')).toHaveCount(6);
  await expect(page.locator('.stage-models button').filter({ hasText: 'What make' })).toHaveCount(0);
  await page.locator('.stage-models').screenshot({ path: `output/playwright/unit5-6-classroom/cars-${width}.png` });
});

test('后段人物缺图时先等待，准备后离线可读20句并恢复最新句', async ({ page, context }) => {
  const voices = []; page.on('request', request => { if (/\.mp3/.test(request.url()) && !isFeedbackAudio(request.url())) voices.push(request.url()); });
  let release; const held = new Promise(resolve => { release = resolve; });
  await page.route(/xiaohui\.svg(?:\?|$)/, async route => { await held; await route.continue(); });
  try {
    await page.goto('/lesson/unit5-6/#learn/text', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('status', { name: '课程准备状态', exact: true })).toContainText('准备');
    await expect(page.locator('.stage-text')).not.toBeVisible();
  } finally { release(); }
  await expect(page.locator('#courseLoader')).toHaveCount(0);
  await context.setOffline(true); const room = page.locator('.stage-text');
  for (let i = 0; i < 20; i++) {
    await room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true }).click();
    await expect.poll(() => room.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    if ([7,13,19].includes(i)) {
      const response = await page.reload();
      expect(response.headers()['x-course-offline']).toBe('1');
      await expect(room.locator('.bubble-row').last()).toBeInViewport({ ratio: 1 });
    }
  }
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await expect(room.locator('.classroom-photo')).toBeVisible(); expect(voices).toEqual([]);
  await page.goto('/lesson/unit5-6/#learn/words');
  const words = page.locator('.stage-words');
  for (let i = 0; i < 4; i++) {
    await expect.poll(() => words.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    if (i < 3) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  }
  await page.reload(); await expect(page.locator('#wordPageProgress')).toHaveText('4 / 4');
});

for (const width of [390, 1280]) test(width + '共用人物与汽车的后续课程仍清晰可见', async ({ page }) => {
  await page.setViewportSize({ width, height: 1280 });
  for (const [course, stage, label] of [['unit7-8', 'phrases', 'am、is、are 怎么选'], ['unit9-10', 'models', '换个说法，说清楚']]) {
    await page.goto('/lesson/' + course + '/#learn/' + stage);
    await page.getByText(label, { exact: true }).click();
    const reference = page.locator('details').filter({ has: page.getByText(label, { exact: true }) });
    await expect.poll(() => reference.locator('img').evaluateAll(images => images.length > 0 && images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await reference.screenshot({ path: `output/playwright/unit5-6-classroom/shared-${course}-${width}.png` });
  }
});

test('词卡仅翻面，新的词义题在无声音时仍可检查', async ({ page }) => {
  const voices = [];
  page.on('request', request => { if (request.url().includes('/unit5-6/audio/')) voices.push(request.url()); });
  await page.route('**/*.mp3', route => route.abort());
  await page.goto('/unit5-6/#learn/words');
  const french = page.locator('.stage-words').getByRole('button', { name: 'French', exact: true });
  await french.click(); await expect(french).toContainText('法国（人）的');
  await french.click(); await expect(french).toHaveAttribute('aria-expanded', 'false');
  expect(voices).toEqual([]);
  await page.goto('/unit5-6/#learn/listen');
  const room = page.locator('.stage-listen');
  await expect(room.getByRole('heading', { name: '单词寻宝', exact: true })).toBeVisible();
  await room.getByRole('button', { name: '法国（人）的', exact: true }).click();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
});
