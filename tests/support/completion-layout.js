'use strict';
const { expect, test } = require('@playwright/test');

async function courseReadyForAssertions(page) {
  const start = Date.now();
  // This is the existing course paint boundary, not the statistics timeout.
  // Loading/performance suites keep their own independent latency assertions.
  await expect(page.locator('#courseLoader')).toHaveCount(0, { timeout: 30000 });
  await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing', '');
  await expect(page.locator('html')).not.toHaveAttribute('data-course-painting', '');
  test.info().annotations.push({ type: 'course-ready', description: `${Date.now() - start} ms before content assertions` });
}

// A completion is usable when its metrics and both actions fit the actual
// viewport. Its total height is allowed to change with the approved content.
async function expectCompactCompletion(page, room, { illustrated = false } = {}) {
  const results = room.getByRole('list', { name: '本轮成果', exact: true });
  // Boxes can be visible behind the loader while startup still restores the
  // chapter scroll. Exercise the ready page, as a learner would, before moving it.
  await courseReadyForAssertions(page);
  await expect(results).toBeVisible();
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
  // The intersection API rounds a fractional stroke at some viewport scales.
  // Check all four edges in CSS pixels and the actual text, including nested clips.
  const visible = await results.evaluate(list => new Promise(resolve => {
    const observer = new IntersectionObserver(([entry]) => {
      observer.disconnect();
      const box = entry.boundingClientRect, clip = entry.intersectionRect;
      const text = [...list.querySelectorAll('.completion-stat-label, .completion-number, .completion-unit')];
      resolve({ edges: Math.max(clip.left - box.left, clip.top - box.top, box.right - clip.right, box.bottom - clip.bottom),
        readable: text.length === 9 && text.every(el => {
          const range = document.createRange(); range.selectNodeContents(el);
          const r = range.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.left >= clip.left && r.right <= clip.right && r.top >= clip.top && r.bottom <= clip.bottom;
        }) });
    });
    observer.observe(list);
  }));
  expect(visible.edges, '完整统计区域的四边').toBeLessThanOrEqual(1);
  expect(visible.readable, '所有统计标签、数字和单位都在可视范围内').toBe(true);
  const byQuestion = await page.locator('body[data-learning-shell]').count() > 0;
  await expect(results.locator('.completion-stat-label')).toHaveText(byQuestion
    ? ['连续答对', '首答正确', '订正完成'] : ['连续答对', '本次答对', '本次答错']);
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
  const topbarBottom = await page.locator(byQuestion ? '.learning-milestones' : '#topbar').evaluate(el => el.getBoundingClientRect().bottom);
  expect(cards[0].y).toBeGreaterThanOrEqual(topbarBottom);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

module.exports = { expectCompactCompletion, courseReadyForAssertions };
