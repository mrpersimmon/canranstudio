'use strict';
const { expect } = require('@playwright/test');

// A completion is usable when its metrics and both actions fit the actual
// viewport. Its total height is allowed to change with the approved content.
async function expectCompactCompletion(page, room, { illustrated = false } = {}) {
  const results = room.getByRole('list', { name: '本轮成果', exact: true });
  await expect(results).toBeVisible();
  // Boxes can be visible behind the loader while startup still restores the
  // chapter scroll. Exercise the ready page, as a learner would, before moving it.
  await expect(page.locator('#courseLoader')).toHaveCount(0);
  if (illustrated) {
    // The approved story result includes its illustration and may scroll on a
    // short screen. Keep the image and scroll to the actual visible action row.
    await expect(room.locator('.completion-art')).toBeVisible();
    const actions = room.getByRole('group', { name: '完成后的操作', exact: true });
    // Element scrolling works in mobile WebKit as well as desktop Chromium.
    // This changes only the viewport, never a lesson answer or learning record.
    await actions.evaluate(el => el.scrollIntoView({ block: 'end', behavior: 'instant' }));
    await expect(actions).toBeInViewport({ ratio: 1 });
    const finish = room.locator('.completion-card');
    if (await finish.getAttribute('data-result-motion')) {
      await expect(finish).toHaveAttribute('data-result-motion', 'finished');
    }
  }
  await expect(results).toBeInViewport({ ratio: 1 });
  await expect(results.locator('.completion-stat-label')).toHaveText(['连续答对', '本次答对', '本次答错']);
  const cards = await results.locator('.completion-stat').evaluateAll(items => items.map(el => {
    const box = el.getBoundingClientRect();
    return { x: box.x, y: box.y, right: box.right, bottom: box.bottom,
      readable: [el, ...el.querySelectorAll('.completion-stat-label, .completion-stat-value')]
        .every(part => part.scrollWidth <= part.clientWidth + 1) };
  }));
  expect(cards).toHaveLength(3);
  for (const [index, card] of cards.entries()) {
    expect(card.readable, '统计文字和数字不能被裁切').toBe(true);
    expect(Math.abs(card.y - cards[0].y)).toBeLessThanOrEqual(1);
    if (index) expect(card.x).toBeGreaterThan(cards[index - 1].right);
  }
  const actions = room.getByRole('group', { name: '完成后的操作', exact: true });
  const buttons = actions.getByRole('button');
  await expect(buttons).toHaveCount(2);
  for (const button of await buttons.all()) {
    await expect(button).toBeInViewport({ ratio: 1 });
    const box = await button.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.y).toBeGreaterThanOrEqual(cards[0].bottom);
  }
  const topbarBottom = await page.locator('#topbar').evaluate(el => el.getBoundingClientRect().bottom);
  expect(cards[0].y).toBeGreaterThanOrEqual(topbarBottom);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

module.exports = { expectCompactCompletion };
