'use strict';
const { test, expect } = require('@playwright/test');

test.use({ viewport: { width: 1100, height: 900 }, reducedMotion: 'reduce' });

const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
function contrast(a, b) {
  const luminance = color => rgb(color).map(value => value / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}
const appearance = locator => locator.evaluate(element => {
  const s = getComputedStyle(element);
  return { background: s.backgroundColor, foreground: s.color, border: s.borderTopColor, borderWidth: s.borderTopWidth };
});

test('两单元有清晰的冷暖场景，图鉴与答题区有层次，选项和操作仍遵循同一视觉规则', async ({ page }) => {
  const views = [];
  for (const unit of ['unit1-2', 'unit49-50']) {
    await page.goto(`/${unit}/#learn/text`);
    await page.evaluate(() => document.fonts.ready);
    const story = await appearance(page.locator('.stage-text'));
    await page.goto(`/${unit}/#learn/words`);
    const shelf = await appearance(page.locator('.stage-words'));
    const card = await appearance(page.locator('.unit-word').first());
    await page.goto(`/${unit}/#learn/listen`);
    const listen = page.locator('.stage-listen');
    const options = await Promise.all((await listen.locator('.practice-options button').all()).map(appearance));
    expect(options).toHaveLength(4);
    expect(options.every(option => JSON.stringify(option) === JSON.stringify(options[0]))).toBe(true);
    const check = listen.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled();
    views.push({ story, shelf, card, option: options[0], audio: await appearance(listen.getByRole('button', { name: '听一遍', exact: true })) });
  }
  // A child can distinguish the two settings without interpreting a label.
  const blue = rgb(views[0].story.background), peach = rgb(views[1].story.background);
  expect.soft(blue[2] - blue[0], '相遇故事使用可辨识的浅蓝场景').toBeGreaterThan(8);
  expect.soft(peach[0] - peach[2], '采购故事使用暖桃场景').toBeGreaterThan(16);
  for (const view of views) {
    expect(view.shelf.background).not.toBe(view.story.background);
    expect(view.shelf.background).not.toBe(view.card.background);
    expect(contrast(view.card.border, view.card.background)).toBeGreaterThan(contrast(view.shelf.border, view.shelf.background));
  }
  expect(views[0].option).toEqual(views[1].option);
  expect(views[0].audio).toEqual(views[1].audio);
});

for (const [unit, answer] of [['unit1-2', 'handbag'], ['unit49-50', 'butcher']]) {
  test(`${unit} 换主题保留已答题，继续后不代答，主按钮和反馈文字清晰可读`, async ({ page }) => {
    await page.addInitScript(() => {
      window.Audio = class extends EventTarget {
        constructor(src) { super(); this.src = src; this.currentTime = 0; }
        play() { queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
        pause() {}
      };
    });
    // Earn the state through the old appearance, then load the new theme.
    await page.route('**/core/unit-theme.css*', route => route.fulfill({ contentType: 'text/css', body: '' }));
    await page.goto(`/${unit}/#learn/listen`);
    const room = page.locator('.stage-listen');
    await room.getByRole('button', { name: '听一遍', exact: true }).click();
    await room.getByRole('button', { name: answer, exact: true }).click();
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    await page.unroute('**/core/unit-theme.css*');
    await page.reload();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    await expect(room.getByRole('button', { name: answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
    const feedback = await appearance(room.locator('.fb.good'));
    const surface = await appearance(room);
    expect.soft(contrast(feedback.foreground, surface.background), '答对反馈文字对比至少 4.5:1').toBeGreaterThanOrEqual(4.5);
    const next = room.getByRole('button', { name: '下一题', exact: true });
    const main = await appearance(next);
    expect(contrast(main.foreground, main.background)).toBeGreaterThanOrEqual(4.5);
    await next.click();
    await expect(room.getByRole('button', { pressed: true })).toHaveCount(0);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  });
}

for (const width of [320, 1100]) for (const unit of ['unit1-2', 'unit49-50']) {
  test(`${unit} ${width} 像素：人物与对白不遮挡，翻译和重听不移动操作区，图鉴与听辨可操作`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      window.Audio = class extends EventTarget {
        constructor(src) { super(); this.src = src; this.currentTime = 0; }
        play() { queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
        pause() {}
      };
    });
    await page.goto(`/${unit}/#learn/text`);
    await page.evaluate(() => document.fonts.ready);
    const story = page.locator('.stage-text');
    await story.getByRole('button', { name: '开始听课文', exact: true }).click();
    await story.getByRole('button', { name: '下一句', exact: true }).click();
    await story.screenshot({ path: `output/playwright/unit-theme/${unit}-story-${width}.png` });
    const people = story.locator('.char,.dialogue-actor');
    const left = await people.first().boundingBox(), right = await people.last().boundingBox();
    const log = await story.getByRole('log', { name: '课文对话', exact: true }).boundingBox();
    if (unit === 'unit1-2' && width <= 600) {
      expect.soft(log.y + log.height).toBeLessThanOrEqual(Math.min(left.y, right.y));
      expect.soft(left.x + left.width).toBeLessThanOrEqual(right.x);
    } else {
      expect.soft(left.x + left.width).toBeLessThanOrEqual(log.x);
      expect.soft(right.x).toBeGreaterThanOrEqual(log.x + log.width);
    }
    const position = () => story.locator('.stage-ctrl').evaluate(el => el.getBoundingClientRect().top + scrollY);
    const before = await position();
    await story.getByRole('button', { name: '看中文', exact: true }).last().click();
    await story.getByRole('button', { name: '重听本句', exact: true }).click();
    expect(await position()).toBeCloseTo(before, 0);
    await page.goto(`/${unit}/#learn/words`);
    const words = page.locator('.stage-words');
    await words.screenshot({ path: `output/playwright/unit-theme/${unit}-words-${width}.png` });
    const prev = words.getByRole('button', { name: '上一组词卡', exact: true }), next = words.getByRole('button', { name: '下一组词卡', exact: true });
    await expect(prev).toBeDisabled();
    const a = await prev.boundingBox(), b = await next.boundingBox();
    expect(a.y).toBeCloseTo(b.y, 0); expect(Math.min(a.height, b.height)).toBeGreaterThanOrEqual(44);
    await next.click(); await prev.click();
    for (let i = 0; i < 8 && await next.isVisible(); i++) await next.click();
    const continueButton = words.getByRole('button', { name: '下一站：听音寻宝', exact: true });
    await expect(continueButton).toBeVisible();
    const lastPrev = await prev.boundingBox(), lastNext = await continueButton.boundingBox();
    expect.soft(lastPrev.y, '末组长按钮也应与上一组对齐').toBeCloseTo(lastNext.y, 0);
    expect.soft(lastPrev.height, '末组翻页按钮等高').toBeCloseTo(lastNext.height, 0);
    await words.screenshot({ path: `output/playwright/unit-theme/${unit}-words-last-${width}.png` });
    await page.goto(`/${unit}/#learn/listen`);
    await page.locator('.stage-listen').screenshot({ path: `output/playwright/unit-theme/${unit}-listen-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
