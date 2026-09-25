'use strict';
const { test, expect } = require('@playwright/test');

async function watchTransition(page, action, testInfo, name) {
  await page.evaluate(() => {
    window.wordFrames = [];
    window.wordFrameDone = false;
    const sample = kind => {
      const room = document.querySelector('.stage-words');
      window.wordFrames.push({ kind, y: scrollY, height: room.getBoundingClientRect().height,
        painting: document.documentElement.hasAttribute('data-course-painting'),
        loader: !!document.getElementById('courseLoader'),
        visibility: getComputedStyle(room).visibility,
        blankImages: [...room.querySelectorAll('img')].filter(img => !img.complete || !img.naturalWidth).length });
    };
    sample('before');
    const observer = new MutationObserver(() => sample('mutation'));
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
    const frame = () => { if (!window.wordFrameDone) { sample('frame'); requestAnimationFrame(frame); } };
    requestAnimationFrame(frame);
    window.finishWordFrames = () => new Promise(resolve => {
      let left = 12;
      function finish() { if (--left) requestAnimationFrame(finish); else { window.wordFrameDone = true; observer.disconnect(); resolve(window.wordFrames); } }
      requestAnimationFrame(finish);
    });
  });
  await action();
  const frames = await page.evaluate(() => window.finishWordFrames());
  await testInfo.attach(name + '.json', { body: JSON.stringify(frames, null, 2), contentType: 'application/json' });
  expect(frames.filter(x => x.painting || x.loader || x.visibility !== 'visible')).toEqual([]);
  expect(frames.filter(x => x.kind === 'frame' && x.blankImages)).toEqual([]);
}

for (const course of ['unit1-2', 'unit3-4', 'unit5-6', 'unit7-8', 'unit29-30', 'unit49-50'])
for (const width of course === 'unit5-6' ? [390, 1280] : [390]) test(`${course} ${width} 词卡往返不隐藏课程、不展示加载层或半张图`, async ({ page, context }, testInfo) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/lesson/' + course + '/#learn/words');
  await expect(page.locator('#courseLoader')).toHaveCount(0);
  const next = page.getByRole('button', { name: '下一组词卡', exact: true });
  const previous = page.getByRole('button', { name: '上一组词卡', exact: true });
  // Cold and revisited pages, then offline: all movement comes from real buttons.
  for (let visit = 0; visit < 2; visit++) {
    if (visit) { await context.setOffline(true); const response = await page.reload(); expect(response.headers()['x-course-offline']).toBe('1'); }
    const total = Number((await page.locator('#wordPageProgress').textContent()).split('/')[1]);
    for (let i = 1; i < total; i++) {
      await next.scrollIntoViewIfNeeded();
      await watchTransition(page, () => next.click(), testInfo, `visit-${visit}-next-${i}`);
      await expect(page.locator('#wordPageProgress')).toHaveText(`${i + 1} / ${total}`);
    }
    for (let i = total; i > 1; i--) {
      await previous.scrollIntoViewIfNeeded();
      await watchTransition(page, () => previous.click(), testInfo, `visit-${visit}-previous-${i}`);
      await expect(page.locator('#wordPageProgress')).toHaveText(`${i - 1} / ${total}`);
    }
  }
});

test.describe('会话降级', () => {
  test.use({ serviceWorkers: 'block' });
  test('存储被禁用时，已准备的词卡仍能离线切换且不闪加载层', async ({ page, context }, testInfo) => {
    await page.addInitScript(() => {
      for (const name of ['indexedDB', 'caches']) Object.defineProperty(window, name, { get() { throw new DOMException('Blocked', 'SecurityError'); } });
    });
    await page.goto('/lesson/unit5-6/#learn/words');
    await expect(page.getByText('这次可正常学习，下次可能需要重新准备。', { exact: true })).toBeVisible();
    await context.setOffline(true);
    await watchTransition(page, () => page.getByRole('button', { name: '下一组词卡', exact: true }).click(), testInfo, 'memory-fallback');
    await expect(page.locator('#wordPageProgress')).toHaveText('2 / 4');
  });
});
