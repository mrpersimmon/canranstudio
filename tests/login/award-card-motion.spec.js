'use strict';
const fs = require('node:fs/promises');
const sharp = require('sharp');
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const { finishZone, readStory } = require('../support/unit1-2-award-flow');
const tasks = require('../support/units1-30-tasks');
const base = process.env.AWARD_TEST_BASE || '/lesson/';
test.use({ reducedMotion: 'reduce' });

async function lights(card, stars) {
  await expect(card.locator('.award-star[data-earned="true"]')).toHaveCount(stars);
  const light = card.locator('.award-star[data-earned="true"] .star-glint').first();
  const frames = await light.evaluate(async el => {
    const values = new Set(), start = performance.now();
    while (performance.now() - start < 5200 && values.size < 5) {
      values.add(getComputedStyle(el).opacity + ':' + getComputedStyle(el).transform);
      await new Promise(requestAnimationFrame);
    }
    return [...values];
  });
  expect(frames.length, '已获得的星星应持续闪光').toBeGreaterThan(3);
  expect(await card.locator('.award-star[data-earned="false"]').evaluateAll(stars =>
    stars.every(el => el.getAnimations({ subtree: true }).length === 0))).toBe(true);
  if (stars === 5) {
    const ring = card.locator('.gold-light-ring');
    await expect(ring).toHaveCSS('opacity', '1');
    const gradient = await ring.evaluate(el => getComputedStyle(el).backgroundImage);
    await expect.poll(() => ring.evaluate(el => getComputedStyle(el).backgroundImage)).not.toBe(gradient);
  } else if (await card.locator('.gold-light-ring').count()) {
    await expect(card.locator('.gold-light-ring')).toHaveCSS('opacity', '0');
  }
}

async function saveMotion(page, button, fileName, full) {
  const started = Date.now();
  const pending = page.waitForEvent('download', { timeout: 15000 });
  await button.click();
  const download = await pending;
  expect(download.suggestedFilename()).toMatch(/\.gif$/);
  const path = 'output/login/' + (base === '/' ? 'root-' : '') + fileName + '.gif';
  await download.saveAs(path);
  const info = await sharp(path, { animated: true }).metadata();
  expect(info.format).toBe('gif'); expect(info.width).toBe(984); expect(info.pageHeight).toBe(528);
  expect(info.pages).toBe(60); expect(info.loop).toBe(0);
  expect(info.delay.every(delay => delay === 80)).toBe(true);
  expect((await fs.stat(path)).size).toBeLessThan(6 * 1024 * 1024);
  const crop = (pageIndex, region) => sharp(path, { page: pageIndex }).extract(region).raw().toBuffer();
  const stars = { left: 40, top: 330, width: 400, height: 100 };
  expect((await crop(0, stars)).equals(await crop(15, stars)), '导出的星星在不同帧中必须变化').toBe(false);
  const title = { left: 55, top: 150, width: 360, height: 55 };
  expect((await crop(0, title)).equals(await crop(15, title)), '标题不应随金光变色或闪烁').toBe(true);
  const border = { left: 15, top: 6, width: 940, height: 10 };
  expect((await crop(0, border)).equals(await crop(15, border))).toBe(!full);
  await fs.writeFile(path + '.json', JSON.stringify({ bytes: (await fs.stat(path)).size, elapsedMs: Date.now() - started, width: info.width, height: info.pageHeight, frames: info.pages, loop: info.loop }, null, 2));
  return path;
}

test('课程底部、纪念册和保存动图保持部分星与满星光效，刷新和导出不改变获星记录', async ({ page, browser }) => {
  test.setTimeout(180000);
  await adminLogin(page, base);
  const account = await createStudent(page, '动图验收班', '小雨', [/Lesson 1–2/]);
  const student = await studentLogin(browser, account, base), p = student.page;
  const course = base + 'unit1-2/';
  try {
    await p.goto(course + '#learn/certificate');
    const card = p.locator('.story-award-panel .story-award-paper');
    await expect(card).toHaveAttribute('data-stars', '0');
    await expect(card.locator('.award-star[data-earned="true"]')).toHaveCount(0);
    await expect(p.getByRole('button', { name: '保存动图', exact: true })).toBeDisabled();
    await finishZone(p, 'listen', { base: course, keepAward: true });
    const reveal = p.getByRole('dialog', { name: /纪念卡结算/ });
    await expect(reveal).toBeVisible(); await reveal.press('Escape');
    await p.goto(course + '#learn/certificate');
    await lights(card, 1);
    await student.context.setOffline(true);
    await saveMotion(p, p.getByRole('button', { name: '保存动图', exact: true }), 'course-one-star', false);
    await student.context.setOffline(false);
    await p.getByRole('link', { name: '我的纪念册', exact: true }).click();
    await expect(p.locator('.book')).toHaveAttribute('aria-busy', 'false');
    await lights(p.locator('.certificate'), 1);
    await readStory(p, course);
    for (const id of ['roles', 'trans', 'manners', 'exam']) {
      await finishZone(p, id, { base: course, keepAward: true });
      await expect(reveal).toBeVisible(); await reveal.press('Escape');
    }
    await p.goto(course + '#learn/certificate');
    await lights(card, 5);
    const firstDate = await p.locator('#certificateDate').textContent();
    const requests = []; p.on('request', r => { if (r.method() !== 'GET' && r.url().includes('/api/')) requests.push(r.url()); });
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    requests.length = 0;
    await saveMotion(p, p.getByRole('button', { name: '保存动图', exact: true }), 'course-full-stars', true);
    expect(requests).toEqual([]);
    await p.getByRole('link', { name: '我的纪念册', exact: true }).click();
    await expect(p.locator('.book')).toHaveAttribute('aria-busy', 'false');
    await lights(p.locator('.certificate'), 5);
    await p.getByRole('button', { name: '目录', exact: true }).click();
    const turnSwitch = p.getByRole('switch', { name: '翻页动画' });
    if (await turnSwitch.getAttribute('aria-checked') === 'true') await turnSwitch.click();
    await p.getByRole('button', { name: '关闭目录', exact: true }).click();
    await lights(p.locator('.certificate'), 5);
    await p.getByRole('button', { name: '放大 Lesson 1–2 礼貌小帮手', exact: true }).click();
    const modal = p.getByRole('dialog', { name: 'Lesson 1–2 纪念卡', exact: true });
    await lights(modal.locator('.certificate'), 5);
    // Closing during generation must not leave a delayed download behind.
    const downloads = []; p.on('download', file => downloads.push(file));
    await modal.getByRole('button', { name: '保存动图', exact: true }).click();
    await expect(modal.getByRole('button', { name: '正在保存…', exact: true })).toBeDisabled();
    await modal.getByRole('button', { name: '关闭纪念卡', exact: true }).click();
    await p.getByRole('button', { name: '放大 Lesson 1–2 礼貌小帮手', exact: true }).click();
    await saveMotion(p, modal.getByRole('button', { name: '保存动图', exact: true }), 'album-full-stars', true);
    expect(downloads).toHaveLength(1);
    await modal.getByRole('button', { name: '关闭纪念卡', exact: true }).click();
    await p.goto(course + '#learn/certificate'); await p.reload();
    await expect(p.locator('#certificateDate')).toHaveText(firstDate); await lights(card, 5);
    for (const width of [320, 390, 1280]) {
      await p.setViewportSize({ width, height: 844 }); await p.goto(course + '#learn/certificate');
      await lights(card, 5);
      expect(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await p.screenshot({ path: `output/login/${base === '/' ? 'root-' : ''}course-card-motion-${width}.png` });
    }
  } finally { await student.context.close(); }
});

for (const pair of ['3-4', '5-6']) test(`${pair} 课程内卡片也保持已有星光`, async ({ page, browser }) => {
  await adminLogin(page, base);
  const account = await createStudent(page, '共享卡片验收', '小雨', [new RegExp('Lesson ' + pair.replace('-', '–'))]);
  const student = await studentLogin(browser, account, base), p = student.page;
  try {
    await tasks.activity(p, pair, 'listen', { base: base.slice(0, -1) });
    await p.goto(base + 'unit' + pair + '/#learn/certificate');
    await lights(p.locator('.story-award-panel .story-award-paper'), 1);
  } finally { await student.context.close(); }
});
