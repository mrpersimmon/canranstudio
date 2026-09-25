'use strict';
const { test, expect } = require('@playwright/test');
const { DIALOGUE, ANSWERS } = require('../support/unit3-4-flow');
test.use({ reducedMotion: 'reduce' });
const output = 'output/playwright/unit3-4-umbrella/';

async function expectUmbrella(room, design, held = false) {
  const umbrella = room.locator('.umbrella-prop > img');
  await expect(umbrella).toHaveAttribute('alt', (held ? '客人领回的' : '') + design + '雨伞');
  await expect(umbrella).toBeVisible();
  await expect(umbrella).toHaveJSProperty('complete', true);
  expect(await umbrella.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  return umbrella;
}

for (const width of [390, 1280]) test(width + '三次询问对应不同的雨伞，两次否认不交接，刷新和重演保留正确物品', async ({ page }) => {
  await page.setViewportSize({ width, height: 1280 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/unit3-4/#learn/text');
  await expect.poll(() => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  const room = page.locator('.stage-text');
  const before = await room.locator('.umbrella-prop > img').boundingBox();
  for (let i = 0; i < DIALOGUE.length; i++) {
    await room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true }).click();
    await expect(room.locator('.bubble-row').last()).toContainText(DIALOGUE[i]);
    // Literal phases come from the approved storyboard, not the application's data.
    const design = i < 7 ? '红色纯色' : i < 9 ? '黄色条纹' : '紫色圆点';
    const umbrella = await expectUmbrella(room, design, i >= 10);
    if ([4, 5, 7, 8, 9, 10].includes(i)) {
      await room.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - document.getElementById('topbar').getBoundingClientRect().height - 12, behavior: 'instant' }));
      await room.screenshot({ path: output + `story-${i + 1}-${width}.png` });
    }
    if (i < 10) {
      expect((await umbrella.boundingBox()).x).toBeCloseTo(before.x, 0);
      await expect(room).not.toContainText('客人确认：是这把');
    } else expect((await umbrella.boundingBox()).x).toBeLessThan(before.x - 20);
    if ([7, 9, 10].includes(i)) {
      await page.reload();
      await expectUmbrella(room, design, i >= 10);
      await expect(room.locator('.dialogue-status')).toHaveText(`${i + 1} / 12 句`);
      await expect(page.locator('#starCount')).toHaveText('0');
    }
  }
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await expectUmbrella(room, '紫色圆点', true);
  await room.getByRole('button', { name: '再看一遍', exact: true }).click();
  await expectUmbrella(room, '红色纯色');
  await expect(room.getByRole('button', { name: '开始看课文', exact: true })).toBeVisible();
  expect((await room.locator('.umbrella-prop > img').boundingBox()).x).toBeCloseTo(before.x, 0);
});

test('柜台否认和最后确认展示不同的伞，紫色圆点伞确认后保持身份', async ({ page }) => {
  await page.goto('/unit3-4/#learn/manners');
  const room = page.locator('.stage-manners');
  for (let i = 0; i < ANSWERS.manners.length; i++) {
    const umbrella = room.locator('.counter-item > img');
    if (i === 2) await expect(umbrella).toHaveAttribute('alt', '红色纯色雨伞');
    if (i === 3) {
      await expect(umbrella).toHaveAttribute('alt', '紫色圆点雨伞');
      await room.getByRole('button', { name: 'Sorry, sir.', exact: true }).click();
      await room.getByRole('button', { name: '检查答案', exact: true }).click();
      await expect(umbrella).toHaveAttribute('alt', '紫色圆点雨伞');
      await expect(room).not.toContainText('客人已领回');
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    await room.getByRole('button', { name: ANSWERS.manners[i], exact: true }).click();
    if (i === 3) await expect(umbrella).toHaveAttribute('alt', '紫色圆点雨伞');
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    if (i === 3) {
      await expect(umbrella).toHaveAttribute('alt', '客人领回的紫色圆点雨伞');
      await page.reload();
      await expect(umbrella).toHaveAttribute('alt', '客人领回的紫色圆点雨伞');
    }
    await room.getByRole('button', { name: i === 3 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expectUmbrella(room, '紫色圆点', true);
});

test('换伞动作不阻挡连续前进，重新上演会取消过期的画面动作', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/unit3-4/#learn/text');
  const room = page.locator('.stage-text');
  const next = room.getByRole('button', { name: '下一句', exact: true });
  const prop = room.locator('.umbrella-prop');
  for (let i = 0; i < 7; i++) await room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true }).click();
  const controls = await next.boundingBox();
  await next.click();
  // Observe the visible browser animation, not a private task-state function.
  expect(await prop.evaluate(el => el.getAnimations({ subtree: true }).some(animation => animation.playState === 'running'))).toBe(true);
  await expect(next).toBeEnabled();
  await next.click(); await next.click();
  await expect(room.locator('.dialogue-status')).toHaveText('10 / 12 句');
  await expectUmbrella(room, '紫色圆点');
  await expect.poll(() => prop.evaluate(el => el.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
  expect((await next.boundingBox()).y).toBeCloseTo(controls.y, 0);
  await expect(room).not.toContainText('客人确认：是这把');
  await page.reload();
  await expectUmbrella(room, '紫色圆点');
  expect(await prop.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await room.getByRole('button', { name: '重新上演', exact: true }).click();
  for (let i = 0; i < 8; i++) await room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true }).click();
  await room.getByRole('button', { name: '重新上演', exact: true }).click();
  await expectUmbrella(room, '红色纯色');
  await expect.poll(() => prop.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(room.getByRole('button', { name: '开始看课文', exact: true })).toBeVisible();
  await expect(room.locator('.dialogue-status')).toHaveText('');
});

test('第二把伞未准备好时不进课，准备后断网换伞和刷新均不缺图', async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route(/umbrella-yellow\.svg(?:\?|$)/, async route => { await held; await route.continue(); });
  try {
    await page.goto('/lesson/unit3-4/#learn/text', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('status', { name: '课程准备状态', exact: true })).toContainText('准备');
    await expect(page.getByRole('heading', { name: '衣帽间小剧场', exact: true })).not.toBeVisible();
  } finally { release(); }
  const room = page.locator('.stage-text');
  await expect(page.locator('#courseLoader')).toHaveCount(0);
  await expectUmbrella(room, '红色纯色');
  await context.setOffline(true);
  for (let i = 0; i < 12; i++) {
    await room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true }).click();
    const design = i < 7 ? '红色纯色' : i < 9 ? '黄色条纹' : '紫色圆点';
    await expectUmbrella(room, design, i >= 10);
    if ([7, 9, 10].includes(i)) {
      await page.reload();
      await expect(page.locator('#courseLoader')).toHaveCount(0);
      await expectUmbrella(room, design, i >= 10);
      await expect(room.locator('.dialogue-status')).toHaveText(`${i + 1} / 12 句`);
      await expect(page.locator('#starCount')).toHaveText('0');
    }
  }
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await expect(room).toContainText('故事看完了！');
  await expectUmbrella(room, '紫色圆点', true);
});
