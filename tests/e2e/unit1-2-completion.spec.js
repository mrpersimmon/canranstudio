"use strict";
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
const fs = require('node:fs/promises');
const OUT = 'output/playwright/unit1-2-completion';
test.use({ actionTimeout: 5000, reducedMotion: 'reduce' });

test('390×500 短屏结束后从插画顶部露出，不被固定导航遮挡', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  for (const id of ['listen', 'trans']) {
    await flow.activity(page, '1-2', id);
    const room = page.locator('.stage-' + id);
    await expect.poll(() => room.locator('.completion-art').evaluate(art =>
      art.getBoundingClientRect().top - document.getElementById('topbar').getBoundingClientRect().bottom)).toBeGreaterThanOrEqual(0);
    await page.screenshot({ path: `${OUT}/short-${id}.png` });
  }
});

async function expectResults(room, counts) {
  const cards = room.getByRole('list', { name: '本轮成果', exact: true }).getByRole('listitem');
  await expect(cards).toHaveText([`最高连对${counts[0]}题`, `本次答对${counts[1]}题`, `本次答错${counts[2]}题`]);
  for (const [index, kind] of ['streak', 'correct', 'incorrect'].entries()) {
    await expect(cards.nth(index).locator('img')).toHaveAttribute('src', new RegExp('/' + kind + '-v1\\.png(?:[?]|$)'));
    await expect.poll(() => cards.nth(index).locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
}

test('语法小工坊结束使用已认可的人物成果画面与三枚 imagegen 图标', async ({ page }) => {
  await flow.activity(page, '1-2', 'trans');
  const room = page.locator('.stage-trans');
  await fs.mkdir(OUT, { recursive: true });
  await room.screenshot({ path: OUT + '/grammar-result.png' });
  await fs.writeFile(OUT + '/observed-result.json', JSON.stringify(await room.locator('.practice-finish').evaluate(el => ({
    text: el.innerText, images: Array.from(el.querySelectorAll('img')).map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0 }))
  })), null, 2));
  await expectResults(room, [12, 12, 0]);
  await expect(room.getByRole('heading', { name: '会问，也会答！', exact: true })).toBeVisible();
  await expect(room.locator('.completion-art .completion-man')).toBeVisible();
  await expect(room.locator('.completion-art .completion-woman')).toBeVisible();
});

for (const base of ['', '/lesson']) test(`${base || 'root'} 五个答题环节统一新版结算，三卡和按钮在四种宽度保持完整`, async ({ page }) => {
  test.setTimeout(120000);
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await fs.mkdir(OUT, { recursive: true });
  await flow.story(page, '1-2', base);
  for (const id of ['words', 'text']) {
    await page.goto(`${base}/unit1-2/#learn/${id}`);
    await expect(page.locator('.stage-' + id).getByRole('list', { name: '本轮成果' })).toHaveCount(0);
  }
  const cases = [
    ['listen', 5, '相遇小剧场', 'text'], ['roles', 5, '语法小工坊', 'trans'],
    ['trans', 12, '帮忙还手提包', 'manners'],
    ['manners', 5, '礼貌小挑战', 'exam'], ['exam', 10, '我的单元纪念卡', 'certificate']
  ];
  for (const [id, total, nextName, nextId] of cases) {
    await flow.activity(page, '1-2', id, { base });
    const room = page.locator('.stage-' + id);
    await expectResults(room, [total, total, 0]);
    await expect(room.getByText('这一组完成了！', { exact: true })).toHaveCount(0);
    const cards = room.getByRole('list', { name: '本轮成果' }).getByRole('listitem');
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const boxes = await cards.evaluateAll(items => items.map(el => {
        const box = el.getBoundingClientRect(); return { x: box.x, right: box.right, y: box.y, width: box.width, height: box.height, fits: el.scrollWidth <= el.clientWidth + 1 };
      }));
      expect(boxes.every(b => b.fits && b.x >= 0 && b.right <= width)).toBe(true);
      for (const prop of ['y', 'width', 'height']) expect(Math.max(...boxes.map(b => b[prop])) - Math.min(...boxes.map(b => b[prop]))).toBeLessThan(2);
      const units = await cards.getByText('题', { exact: true }).evaluateAll(items => items.map(el => el.getBoundingClientRect().y));
      expect(Math.max(...units) - Math.min(...units)).toBeLessThan(2);
      const actions = room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button');
      await expect(actions).toHaveCount(2);
      const [again, next] = await actions.evaluateAll(items => items.map(el => { const b = el.getBoundingClientRect(); return { x:b.x, y:b.y, right:b.right, height:b.height }; }));
      expect(again.height).toBeGreaterThanOrEqual(44); expect(next.height).toBeGreaterThanOrEqual(44);
      expect(Math.abs(again.y - next.y)).toBeLessThan(2); expect(again.right).toBeLessThan(next.x);
      await expect.poll(() => room.locator('.completion-card img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
      await room.screenshot({ path: `${OUT}/${base ? 'lesson' : 'root'}-${id}-${width}.png` });
    }
    await page.reload(); await expectResults(room, [total, total, 0]);
    await room.getByRole('button', { name: '下一站：' + nextName, exact: true }).click();
    await expect(page).toHaveURL(new RegExp('#learn/' + nextId + '$'));
  }
  expect(errors).toEqual([]);
});

test('全错后改正仍记五题错误，刷新不重播庆祝，再练重新统计', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/unit1-2/#learn/manners'); const room = page.locator('.stage-manners');
  for (const [i, wrong] of [{fills:['it']}, 'Yes, it is.', 'Pardon?', '男士', ['you','Thank','very much']].entries()) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    for (let repeat = 0; repeat < 2; repeat++) {
      // Cloze keeps its filled slot on retry; a second click would empty it.
      // Choice questions clear their selection; token selection is rebuilt.
      if (repeat === 0 || !wrong?.fills) await flow.select(room, wrong);
      await expect(check).toBeEnabled(); await check.click();
      await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
      await page.reload(); await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    await flow.select(room, flow.ANSWERS['1-2'].manners[i]); await check.click();
    await room.getByRole('button', { name: i === 4 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(room.locator('.completion-card')).toHaveClass(/is-celebrating/);
  await expectResults(room, [0, 0, 5]);
  await page.reload(); await expectResults(room, [0, 0, 5]);
  await expect(room.locator('.completion-card')).not.toHaveClass(/is-celebrating/);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.getByRole('list', { name: '本轮成果' })).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.reload(); await flow.activity(page, '1-2', 'manners');
  await expectResults(room, [5, 5, 0]);
});
