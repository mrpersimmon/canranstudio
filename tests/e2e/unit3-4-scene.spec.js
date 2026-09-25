'use strict';
const { test, expect } = require('@playwright/test');
const { ANSWERS, DIALOGUE } = require('../support/unit3-4-flow');
test.use({ reducedMotion: 'reduce' });
const output = 'output/playwright/unit3-4-scene/';
async function capture(room, name) {
  await room.evaluate(el => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - document.getElementById('topbar').getBoundingClientRect().height - 12, behavior: 'instant' }));
  await room.screenshot({ path: output + name });
}


for (const width of [390, 1280]) test(width + '衣帽间人物站在前景，正确提交才把雨伞交到客人手边', async ({ page }) => {
  await page.setViewportSize({ width, height: 1280 });
  await page.goto('/unit3-4/#learn/manners');
  await page.evaluate(() => document.fonts.ready);
  const room = page.locator('.stage-manners'), stage = room.locator('.counter-stage');
  const visitor = stage.locator('.counter-visitor > img');
  const person = await visitor.boundingBox(), scene = await stage.boundingBox();
  // These detect the actual reported small/floating actors, not CSS class names.
  expect(person.height).toBeGreaterThanOrEqual(width < 600 ? 126 : 190);
  expect(scene.y + scene.height - person.y - person.height).toBeLessThan(70);
  await capture(room, 'counter-start-' + width + '.png');
  const positions = [];
  for (let i = 0; i < 4; i++) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled();
    if (i === 3) {
      const before = await stage.locator('.counter-item img').boundingBox();
      positions.push(before);
      await room.getByRole('button', { name: 'Sorry, sir.', exact: true }).click();
      await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      expect((await stage.locator('.counter-item img').boundingBox()).x).toBeCloseTo(before.x, 0);
      await expect(stage).not.toContainText('客人已领回');
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    await room.locator('.practice-options').getByRole('button', { name: ANSWERS.manners[i], exact: true }).click();
    if (i === 3) expect((await stage.locator('.counter-item img').boundingBox()).x).toBeCloseTo(positions[0].x, 0);
    await check.click();
    if (i === 3) {
      const item = await stage.locator('.counter-item img').boundingBox(), owner = await visitor.boundingBox();
      expect(item.x).toBeLessThan(positions[0].x - 20);
      // Handoff is physically beside the owner, not only a changed text label.
      expect(item.x).toBeLessThan(owner.x + owner.width);
      expect(item.x + item.width).toBeGreaterThan(owner.x + owner.width * .55);
      await page.reload(); await expect(stage).toContainText('客人已领回');
      await capture(room, 'counter-returned-' + width + '.png');
    } else await capture(room, 'counter-step-' + (i + 1) + '-' + width + '.png');
    await room.getByRole('button', { name: i === 3 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await capture(room, 'counter-finish-' + width + '.png');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(stage).not.toContainText('客人已领回');
});

for (const width of [390, 1280]) test(width + '课文的柜台与人物、短长对白和领回状态可见', async ({ page }) => {
  await page.setViewportSize({ width, height: 1280 });
  await page.goto('/unit3-4/#cover');
  await page.locator('#cover').screenshot({ path: output + 'cover-' + width + '.png' });
  await page.goto('/unit3-4/#learn/text');
  const room = page.locator('.stage-text');
  let waitingX;
  for (let i = 0; i < DIALOGUE.length; i++) {
    await room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true }).click();
    const umbrella = room.locator('.umbrella-prop img');
    if (i === 9) {
      waitingX = (await umbrella.boundingBox()).x;
      await expect(room.locator('.cloakroom-props')).not.toContainText('客人确认：是这把');
    }
    if (i === 10) {
      expect((await umbrella.boundingBox()).x).toBeLessThan(waitingX - 20);
      await expect(room.locator('.cloakroom-props')).toContainText('客人确认：是这把');
      await page.reload();
      await expect(room.locator('.cloakroom-props')).toContainText('客人确认：是这把');
      await expect(room.locator('.bubble-row').nth(i)).toBeInViewport({ ratio: 1 });
    }
    if ([1,4,10].includes(i)) {
      await room.locator('.bubble-row').nth(i).getByRole('button', { name: '看中文', exact: true }).click();
      const bubble = await room.locator('.bubble-row').nth(i).boundingBox(), transcript = await room.locator('.dialogue-log').boundingBox();
      expect(bubble.y + bubble.height).toBeLessThanOrEqual(transcript.y + transcript.height);
      await capture(room, 'story-line-' + (i + 1) + '-' + width + '.png');
    }
  }
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await capture(room, 'story-finish-' + width + '.png');
  await room.getByRole('button', { name: '再看一遍', exact: true }).click();
  await expect(room.locator('.cloakroom-props')).not.toContainText('客人确认：是这把');
});

test('缓存入口刷新后显示已读末句，场景和阅读位置保持一致', async ({ page }) => {
  // A real WebView can finish fonts before connected images decode and the
  // loader reveals the page. Reproduce that order without modifying course data.
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function () {
      await decode.call(this);
      if (this.isConnected) await new Promise(resolve => setTimeout(resolve, 150));
    };
  });
  await page.goto('/lesson/unit3-4/#learn/text');
  const room = page.locator('.stage-text');
  await expect(page.locator('#courseLoader')).toHaveCount(0);
  for (let i = 0; i < 8; i++) await room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true }).click();
  await expect(room.locator('.bubble-row').last()).toContainText('Is this your umbrella?');
  await page.reload();
  await expect(page.locator('#courseLoader')).toHaveCount(0);
  await expect(room.locator('.dialogue-status')).toHaveText('8 / 12 句');
  await expect(room.locator('.bubble-row').last()).toBeInViewport({ ratio: 1 });
  await expect(page.locator('#starCount')).toHaveText('0');
});
