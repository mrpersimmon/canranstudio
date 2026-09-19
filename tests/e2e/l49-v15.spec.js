'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function audioBoundary(page, automatic = true) {
  await page.addInitScript(automatic => {
    window.playedAudio = [];
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; this.paused = true; }
      play() {
        this.paused = false; window.playedAudio.push(this);
        if (automatic) queueMicrotask(() => this.dispatchEvent(new Event('ended')));
        return Promise.resolve();
      }
      pause() { this.paused = true; }
    };
  }, automatic);
}

async function finishAudio(page, index = -1) {
  await page.evaluate(index => {
    const audio = window.playedAudio.at(index);
    audio.paused = true;
    audio.dispatchEvent(new Event('ended'));
  }, index);
}

test('听音删除无效线索，重试和刷新不恢复它，其他活动保留实质提示', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/listen');
  await page.getByRole('button', { name: '开始听辨', exact: true }).click();
  const room = page.locator('#listenPractice');
  const noHint = async () => {
    await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
    await expect(room).not.toContainText('需要时可以回看词卡');
  };
  await noHint();
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: 'husband', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toContainText('再看看');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await noHint();
  await page.reload();
  await noHint();
  await page.screenshot({ path: 'output/playwright/l49-v15-listen.png' });
  await page.goto('/lesson49/#learn/doare');
  const grammar = page.locator('#doarePractice');
  await grammar.getByRole('button', { name: '给点线索', exact: true }).click();
  await expect(grammar.locator('.practice-hint')).toBeVisible();
});

for (const width of [1280, 768, 390, 320]) test(`${width}宽度的上一组保留完整按钮轮廓，往返分组不挪动整页`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/lesson49/#learn/words');
  await page.evaluate(() => document.fonts.ready);
  const previous = page.getByRole('button', { name: '上一组词卡', exact: true });
  const pageNumber = page.locator('#wordPageProgress');
  const buttonShape = async () => {
    await expect(previous).toHaveCSS('border-top-style', 'solid');
    expect(await previous.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth))).toBeGreaterThanOrEqual(2);
    expect(await previous.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    expect((await previous.boundingBox()).height).toBeGreaterThanOrEqual(44);
  };
  await expect(previous).toBeDisabled();
  await buttonShape();
  await previous.scrollIntoViewIfNeeded();
  const initialScroll = await page.evaluate(() => scrollY);
  for (const number of ['2 / 3', '3 / 3']) {
    await page.getByRole('button', { name: '下一组词卡', exact: true }).click();
    await expect(pageNumber).toHaveText(number);
  }
  await expect(page.getByRole('button', { name: '下一站：听音寻宝', exact: true })).toBeEnabled();
  await expect(previous).toBeEnabled();
  await buttonShape();
  for (const number of ['2 / 3', '1 / 3']) {
    await previous.press('Enter');
    await expect(pageNumber).toHaveText(number);
    expect(await page.evaluate(() => scrollY)).toBe(initialScroll);
  }
  await expect(previous).toBeDisabled();
  await page.screenshot({ path: `output/playwright/l49-v15-words-${width}.png` });
});

test('历史句可点读并高亮，打断当前句或晚到的音频结束不会误推进', async ({ page }) => {
  await audioBoundary(page, false);
  await page.goto('/lesson49/#learn/text');
  const next = page.locator('#nextBtn');
  const lines = page.getByRole('log', { name: '课文对话' });
  await next.click();
  await finishAudio(page);
  await next.click();
  await expect(next).toBeDisabled();
  const history = lines.getByRole('button', { name: 'Do you want any meat today, Mrs. Bird?', exact: true });
  const current = lines.getByRole('button', { name: 'Yes, please.', exact: true });
  const restingColor = await history.evaluate(node => getComputedStyle(node.closest('.bubble')).backgroundColor);
  await history.click();
  await expect(history).toHaveAttribute('aria-busy', 'true');
  expect(await history.evaluate(node => getComputedStyle(node.closest('.bubble')).backgroundColor)).not.toBe(restingColor);
  await expect(current).toHaveAttribute('aria-busy', 'false');
  expect(await page.evaluate(() => window.playedAudio.at(-1).src)).toBe('/lesson49/audio/do_you_want_any_meat_today_mrs_bird.mp3');
  expect(await page.evaluate(() => window.playedAudio[1].paused)).toBe(true);
  await finishAudio(page, 1); // The cancelled current recording reports a late ended event.
  await expect(next).toBeDisabled();
  await finishAudio(page);
  await expect(history).toHaveAttribute('aria-busy', 'false');
  await expect(next).toBeDisabled();
  await current.press('Enter');
  await expect(current).toHaveAttribute('aria-busy', 'true');
  expect(await page.evaluate(() => window.playedAudio.at(-1).src)).toBe('/lesson49/audio/yes_please.mp3');
  await finishAudio(page);
  await expect(next).toBeEnabled();
  await history.press('Space');
  await finishAudio(page);
  await expect(next).toBeEnabled();
  await expect(lines.locator('.bubble-row')).toHaveCount(2);
  await expect(page.locator('#starCount')).toHaveText('0');
  await next.click();
  await expect(lines).toContainText('Do you want beef or lamb?');
  await expect(lines.locator('.bubble-row')).toHaveCount(3);
  await expect(next).toBeDisabled();
});

test('逐句中文开关互不影响，也不会误触句子朗读', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/text');
  const next = page.locator('#nextBtn');
  await next.click(); await expect(next).toBeEnabled();
  await next.click(); await expect(next).toBeEnabled();
  const rows = page.locator('#bubbleArea .bubble-row');
  const first = rows.nth(0), second = rows.nth(1);
  await first.getByRole('button', { name: '看中文', exact: true }).click();
  await expect(first.locator('.bcn')).toBeVisible();
  await expect(second.locator('.bcn')).toBeHidden();
  await second.getByRole('button', { name: '看中文', exact: true }).press('Enter');
  await first.getByRole('button', { name: '收起中文', exact: true }).click();
  await expect(first.locator('.bcn')).toBeHidden();
  await expect(second.locator('.bcn')).toBeVisible();
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(2);
  await page.reload();
  await expect(rows).toHaveCount(2);
  await expect(rows.locator('.bcn:visible')).toHaveCount(0);
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
});

test('中途离开和刷新恢复对白，未听完的当前句仍需重听，取消播放不留高亮', async ({ page }) => {
  await audioBoundary(page, false);
  await page.goto('/lesson49/#learn/text');
  const next = page.locator('#nextBtn');
  const lines = page.getByRole('log', { name: '课文对话' });
  await next.click(); await finishAudio(page);
  await next.click();
  await page.getByRole('navigation', { name: '学习关卡' }).getByRole('link', { name: '开门准备', exact: true }).click();
  expect(await page.evaluate(() => window.playedAudio.at(-1).paused)).toBe(true);
  await expect(lines.locator('[aria-busy="true"]')).toHaveCount(0);
  await finishAudio(page);
  await page.getByRole('navigation', { name: '学习关卡' }).getByRole('link', { name: '肉店小剧场', exact: true }).click();
  await expect(next).toBeDisabled();
  await page.reload();
  await expect(lines.locator('.bubble-row:visible')).toHaveCount(2);
  await expect(next).toBeDisabled();
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  await lines.getByRole('button', { name: 'Yes, please.', exact: true }).click();
  await finishAudio(page);
  await expect(next).toBeEnabled();
  await next.click();
  await expect(lines).toContainText('Do you want beef or lamb?');
  await expect(lines.locator('.bubble-row:visible')).toHaveCount(3);
});

test('十一句完成后保留全部对白，刷新保持静音，显式重演从第一句累积并保留奖励', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/text');
  const next = page.locator('#nextBtn');
  const lines = page.getByRole('log', { name: '课文对话' });
  for (let i = 0; i < 11; i++) {
    await next.click();
    await expect(next).toBeEnabled();
    await expect(lines.locator('.bubble-row:visible')).toHaveCount(i + 1);
  }
  await expect(next).toHaveText('完成课文学习');
  await expect(page.locator('#starCount')).toHaveText('0');
  await next.click();
  await expect(lines.locator('.bubble-row:visible')).toHaveCount(11);
  await expect(page.locator('#starCount')).toHaveText('2');
  await page.reload();
  await expect(lines.locator('.bubble-row:visible')).toHaveCount(11);
  await expect(page.getByRole('button', { name: '下一站：故事小侦探', exact: true })).toBeEnabled();
  await expect(page.locator('#rolePractice')).toBeVisible();
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  await expect(page.getByRole('button', { name: '重新上演', exact: true })).toBeHidden();
  await page.getByRole('button', { name: '重看课文', exact: true }).click();
  await expect(page.getByRole('region', { name: '听前问题', exact: true })).toBeVisible();
  await next.click();
  await expect(lines.locator('.bubble-row:visible')).toHaveCount(1);
  await expect(lines).toContainText('Do you want any meat today, Mrs. Bird?');
  await expect(page.locator('#starCount')).toHaveText('2');
  await expect(page.locator('#rolePractice')).toBeVisible();
  expect(await page.evaluate(() => window.playedAudio.map(audio => audio.src))).toEqual(['/lesson49/audio/do_you_want_any_meat_today_mrs_bird.mp3']);
});

for (const viewport of [{ width: 1280, height: 900 }, { width: 768, height: 1024 }, { width: 320, height: 640 }]) {
  test(`${viewport.width}宽度中对白持续累积与中文展开只影响内部滚动，整页和按钮稳定`, async ({ page }) => {
    await audioBoundary(page, false);
    await page.setViewportSize(viewport);
    await page.goto('/lesson49/#learn/text');
    await page.evaluate(() => document.fonts.ready);
    const next = page.locator('#nextBtn');
    await next.click(); await finishAudio(page); await expect(next).toBeEnabled();
    const area = page.locator('#bubbleArea');
    const initialBox = await next.boundingBox();
    const areaHeight = (await area.boundingBox()).height;
    const initialScroll = await page.evaluate(() => scrollY);
    for (let i = 1; i < 11; i++) {
      await next.click(); await finishAudio(page); await expect(next).toBeEnabled();
      await expect(area.locator('.bubble-row:visible')).toHaveCount(i + 1);
      expect(await page.evaluate(() => scrollY)).toBe(initialScroll);
      expect(Math.abs((await next.boundingBox()).y - initialBox.y)).toBeLessThanOrEqual(2);
      expect((await area.boundingBox()).height).toBe(areaHeight);
    }
    await area.getByRole('button', { name: '看中文', exact: true }).last().click();
    expect((await area.boundingBox()).height).toBe(areaHeight);
    expect((await page.locator('body').boundingBox()).width).toBeLessThanOrEqual(viewport.width);
    await next.scrollIntoViewIfNeeded();
    const current = area.getByRole('button', { name: "To tell you the truth, Mrs. Bird, I don't like chicken either!", exact: true });
    await current.click();
    const scrollAfterClick = await page.evaluate(() => scrollY);
    const dialogueScroll = await area.evaluate(node => node.scrollTop);
    await finishAudio(page);
    await expect(next).toBeEnabled();
    expect((await area.boundingBox()).height).toBe(areaHeight);
    // Measure from the user's playback action, not before the browser reveals the clicked sentence.
    expect(await page.evaluate(() => scrollY)).toBe(scrollAfterClick);
    expect(await area.evaluate(node => node.scrollTop)).toBe(dialogueScroll);
    await page.screenshot({ path: `output/playwright/l49-v15-dialogue-${viewport.width}.png` });
  });
}

test('历史句录音失败后可直接重试，不影响已听完的当前句继续', async ({ page }) => {
  await audioBoundary(page, false);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: undefined });
  });
  await page.goto('/lesson49/#learn/text');
  const next = page.locator('#nextBtn');
  await next.click(); await finishAudio(page);
  await next.click(); await finishAudio(page);
  const lines = page.getByRole('log', { name: '课文对话' });
  const history = lines.getByRole('button', { name: 'Do you want any meat today, Mrs. Bird?', exact: true });
  await history.click();
  await page.evaluate(() => window.playedAudio.at(-1).dispatchEvent(new Event('error')));
  await expect(page.locator('#dialogueStatus')).toContainText('录音还没有播放完');
  await expect(history).toHaveAttribute('aria-busy', 'false');
  await expect(next).toBeEnabled();
  await history.click(); await finishAudio(page);
  await expect(page.locator('#dialogueStatus')).toBeEmpty();
  await expect(next).toBeEnabled();
  await expect(lines.locator('.bubble-row:visible')).toHaveCount(2);
  await expect(page.locator('#starCount')).toHaveText('0');
});
