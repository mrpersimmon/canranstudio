"use strict";
const { test, expect } = require('@playwright/test');
const flow = require('../support/thirteen-types-flow');
const fs = require('node:fs/promises');
const OUT = 'output/playwright/unit1-2-completion';
test.use({ actionTimeout: 5000, reducedMotion: 'reduce' });

test('三张统计卡按本轮首次提交计数，真实完成后默认依次入场和跳数', async ({ page }) => {
  await page.addInitScript(() => {
    window.completionMotionFrames = [];
    window.completionOverflowFrames = [];
    const sample = () => {
      const cards = [...document.querySelectorAll('.stage-manners .completion-stat')];
      if (cards.length && window.completionMotionFrames.length < 180) {
        window.completionMotionFrames.push(cards.map(card => ({
          transform: getComputedStyle(card).transform,
          number: card.querySelector('.completion-number')?.textContent
        })));
        const stats = cards[0].parentElement;
        window.completionOverflowFrames.push(stats.scrollWidth - stats.clientWidth);
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.goto('/unit1-2/#learn/manners');
  const room = page.locator('.stage-manners');
  await flow.activity(page, '1-2', 'manners', { capture: async (activity, i, state) => {
    if (i !== 2 || state !== 'blank') return;
    await flow.select(activity, 'Pardon?');
    await activity.getByRole('button', { name: '检查答案', exact: true }).click();
    await activity.getByRole('button', { name: '再试一次', exact: true }).click();
  } });
  await expect(room.locator('.completion-stat-label')).toHaveText(['连续答对', '本次答对', '本次答错']);
  await expect(room.locator('.completion-number')).toHaveText(['2', '4', '1']);
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion', 'finished');
  await expect.poll(() => page.evaluate(() => window.completionMotionFrames.length)).toBeGreaterThan(30);
  const frames = await page.evaluate(() => window.completionMotionFrames);
  for (let index = 0; index < 3; index++) {
    expect(new Set(frames.map(frame => frame[index].transform)).size, `统计卡 ${index + 1} 应有真实位移`).toBeGreaterThan(3);
  }
  expect(new Set(frames.map(frame => frame[1].number)).size, '答对数字应从 0 递增到最终值').toBeGreaterThan(2);
  expect(await page.evaluate(() => Math.max(...window.completionOverflowFrames)), '统计卡入场全过程不能横向溢出').toBeLessThanOrEqual(1);
  await expect(page.locator('#starCount')).toHaveText('0');
});

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
  const result = room.getByRole('list', { name: '本轮成果', exact: true });
  await expect(result.locator('.completion-number')).toHaveText(counts.map(String));
}

test('语法小工坊保留人物成果画面，恢复三张统计卡', async ({ page }) => {
  await flow.activity(page, '1-2', 'trans');
  const room = page.locator('.stage-trans');
  await fs.mkdir(OUT, { recursive: true });
  await room.screenshot({ path: OUT + '/grammar-result.png' });
  await fs.writeFile(OUT + '/observed-result.json', JSON.stringify(await room.locator('.practice-finish').evaluate(el => ({
    text: el.innerText, images: Array.from(el.querySelectorAll('img')).map(img => ({ src: img.getAttribute('src'), loaded: img.complete && img.naturalWidth > 0 }))
  })), null, 2));
  await expectResults(room, [12, 12, 0]);
  await expect(room.getByRole('heading', { name: '问答练习完成！', exact: true })).toBeVisible();
  await expect(room.locator('.completion-art .completion-man')).toBeVisible();
  await expect(room.locator('.completion-art .completion-woman')).toBeVisible();
});

for (const base of ['', '/lesson']) test(`${base || 'root'} 五个答题环节统一新版结算，结果和按钮在四种宽度保持完整`, async ({ page }) => {
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
    ['manners', 5, '综合挑战', 'exam'], ['exam', 10, '我的纪念卡', 'certificate']
  ];
  for (const [id, total, nextName, nextId] of cases) {
    await flow.activity(page, '1-2', id, { base });
    const room = page.locator('.stage-' + id);
    await expectResults(room, [total, total, 0]);
    await expect(room.getByText('这一组完成了！', { exact: true })).toHaveCount(0);
    const result = room.getByRole('list', { name: '本轮成果' });
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      const box = await result.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(await result.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      const actions = room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button');
      await expect(actions).toHaveCount(2);
      const [again, next] = await actions.evaluateAll(items => items.map(el => { const b = el.getBoundingClientRect(); return { x:b.x, y:b.y, right:b.right, height:b.height }; }));
      expect(again.height).toBeGreaterThanOrEqual(44); expect(next.height).toBeGreaterThanOrEqual(44);
      expect(Math.abs(again.y - next.y)).toBeLessThan(2); expect(again.right).toBeLessThan(next.x);
      await expect.poll(() => room.locator('.completion-card img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
      await room.screenshot({ path: `${OUT}/${base ? 'lesson' : 'root'}-${id}-${width}.png` });
    }
    await page.reload(); await expectResults(room, [total, total, 0]);
    await room.getByRole('button', { name: nextId === 'certificate' ? '查看纪念卡' : '下一站：' + nextName, exact: true }).click();
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
      await expect(room.locator('.fb')).toHaveText('再看看。');
      await page.reload(); await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    await flow.select(room, flow.ANSWERS['1-2'].manners[i]); await check.click();
    await room.getByRole('button', { name: i === 4 ? '完成这一组' : '下一题', exact: true }).click();
  }
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion', 'playing');
  await expectResults(room, [0, 0, 5]);
  await page.reload(); await expectResults(room, [0, 0, 5]);
  await expect(room.locator('.completion-card')).not.toHaveClass(/is-celebrating/);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.getByRole('list', { name: '本轮成果' })).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.reload(); await flow.activity(page, '1-2', 'manners');
  await expectResults(room, [5, 5, 0]);
});
