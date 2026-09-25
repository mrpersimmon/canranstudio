'use strict';
const { test, expect } = require('@playwright/test');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const { relocateSource } = require('../../scripts/public-base-path');
const repairs = require('../fixtures/pronunciation-repairs.json');

test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
async function observe(page) {
  await page.addInitScript(() => {
    window.pronunciationPlays = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      const event = { src: this.src, rate: this.playbackRate, ended: false };
      window.pronunciationPlays.push(event);
      this.addEventListener('ended', () => { event.ended = true; }, { once: true });
      return Reflect.apply(play, this, args);
    };
  });
}
async function heard(page, control, path) {
  const before = await page.evaluate(() => window.pronunciationPlays.length);
  await control.click();
  await expect.poll(() => page.evaluate(({ before, path }) => window.pronunciationPlays.slice(before).some(event => event.ended && event.rate === 1 && new URL(event.src).pathname === path), { before, path }), { timeout: 15000 }).toBe(true);
}
async function historicalPage(page, course, base) {
  async function previousSource(name) {
    const source = await fs.readFile('tests/fixtures/' + course + '-voiced-before/' + name, 'utf8');
    return base ? relocateSource(source, course + '/' + name, base + '/') : source;
  }
  await page.route(new RegExp('/' + course + '/(?:index\\.html)?(?:\\?.*)?$'), async route => route.fulfill({ contentType: 'text/html', body: await previousSource('index.html') }));
  for (const name of ['content.js', 'unit.js', ...(course === 'unit5-6' ? ['unit.css'] : [])])
    await page.route('**/' + course + '/' + name + '*', async route => route.fulfill({ contentType: name.endsWith('css') ? 'text/css' : 'text/javascript', body: await previousSource(name) }));
}
async function prepare(page, item, base) {
  // Retained audio is checked through the frozen voiced UI, never by adding
  // audio controls back to a current classroom unit. Its no-voice flow has its own checks.
  if (['unit5-6', 'unit11-12'].includes(item.course)) await historicalPage(page, item.course, base);
  const stage = item.kind === 'word' ? 'words' : item.kind === 'model' ? 'models' : 'text';
  await page.goto(`${base}/${item.course}/#learn/${stage}`);
  if (item.kind === 'word') {
    await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  } else if (item.kind === 'dialogue') {
    for (let i = 1; i <= 11; i++) {
      await heard(page, page.locator('.stage-text').getByRole('button', { name: i === 1 ? '开始听课文' : '下一句', exact: true }), `${base}/unit5-6/audio/l05-d${String(i).padStart(2, '0')}.mp3`);
    }
  }
  return control(page, item, item.kind === 'dialogue');
}
function control(page, item, advance = false) {
  if (advance) return page.locator('.stage-text').getByRole('button', { name: '下一句', exact: true });
  return page.locator(item.kind === 'word' ? '.stage-words' : item.kind === 'model' ? '.stage-models' : '.stage-text').getByRole('button', { name: item.text, exact: true });
}
async function verifiedPlayback(page, item, button, base, testInfo) {
  const before = await page.evaluate(() => window.pronunciationPlays.length);
  await button.click();
  const expectedPath = base + '/' + item.path;
  await expect.poll(() => page.evaluate(({ before, path }) => window.pronunciationPlays.slice(before).some(event => event.ended && event.rate === 1 && new URL(event.src).pathname === path), { before, path: expectedPath }), { timeout: 15000 }).toBe(true);
  // Replaying cached audio need not emit a network response. Read the file at
  // the observed native player's URL through the same browser/worker boundary.
  const bytes = Buffer.from(await page.evaluate(async ({ before, path }) => {
    const played = window.pronunciationPlays.slice(before).find(event => event.ended && new URL(event.src).pathname === path);
    const response = await fetch(played.src);
    if (!response.ok) throw new Error('Played audio is unavailable');
    return [...new Uint8Array(await response.arrayBuffer())];
  }, { before, path: expectedPath }));
  // The fingerprint comes from the independent repair fixture, not the package.
  expect(createHash('sha256').update(bytes).digest('hex')).toBe(item.sha256);
  await fs.writeFile(testInfo.outputPath(item.key + '.mp3'), bytes);
}
for (const base of ['', '/lesson']) {
  for (const item of repairs) test(`${['unit5-6', 'unit11-12'].includes(item.course) ? '历史' : ''}修订录音 ${item.issue}：实际文件、重听和刷新 ${base || '/'}`, async ({ page }, testInfo) => {
    test.setTimeout(90000); await observe(page);
    const first = await prepare(page, item, base);
    if (item.ipa) await expect(first).toContainText(item.ipa);
    await verifiedPlayback(page, item, first, base, testInfo);
    await verifiedPlayback(page, item, control(page, item), base, testInfo);
    await page.reload();
    if (item.kind === 'word') await expect(page.locator('#wordPageProgress')).toHaveText('2 / 4');
    if (item.kind === 'dialogue') await expect(page.locator('.stage-text .bubble-row')).toHaveCount(12);
    await verifiedPlayback(page, item, control(page, item), base, testInfo);
    await expect(page.locator('#starCount')).toHaveText('0');
  });
  test(`loose 音标、实际播放与刷新 ${base || '/'}`, async ({ page }) => {
    await observe(page); await page.goto(base + '/soundmark/');
    const word = page.locator('.wchip[data-audio-word="loose"]');
    await expect(word).toContainText('/lu:s/');
    await heard(page, word, base + '/soundmark/audio/loose.mp3');
    await page.reload(); await expect(word).toContainText('/lu:s/');
    await heard(page, word, base + '/soundmark/audio/loose.mp3');
  });
}
test.describe(() => {
// Network-failure fallback is exercised without an already cached worker file.
// Normal cached playback is covered above and by the course-cache tests.
test.use({ serviceWorkers: 'block' });
for (const item of repairs.filter(item => item.kind !== 'dialogue')) test(`${['unit5-6', 'unit11-12'].includes(item.course) ? '历史' : ''}修订录音失败后仍可重试 ${item.issue}`, async ({ page }, testInfo) => {
  await observe(page); const base = '/lesson';
  const button = await prepare(page, item, base);
  let fail = true;
  await page.route('**/' + item.path, route => fail ? route.abort() : route.continue());
  await button.click(); await expect(page.getByText('录音暂时没播出，再点一次试试。', { exact: true })).toBeVisible();
  fail = false;
  await verifiedPlayback(page, item, control(page, item), base, testInfo);
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('历史配音版课文新录音失败不推进，重试后可继续，旧句重听不改变当前句', async ({ page }, testInfo) => {
  test.setTimeout(90000); await observe(page);
  const item = repairs.find(item => item.issue === 'A02'), base = '/lesson';
  const next = await prepare(page, item, base);
  let fail = true;
  await page.route('**/' + item.path, route => fail ? route.abort() : route.continue());
  await next.click();
  await expect(page.locator('.stage-text .dialogue-status')).toHaveText('录音还没听完，点句子再试一次。');
  await expect(next).toBeDisabled();
  fail = false; await verifiedPlayback(page, item, control(page, item), base, testInfo);
  await expect(next).toBeEnabled();
  await heard(page, next, base + '/unit5-6/audio/l05-d13.mp3');
  await verifiedPlayback(page, item, control(page, item), base, testInfo);
  await expect(page.locator('.stage-text .bubble-row')).toHaveCount(13);
});

});

for (const completed of [false, true]) test(`历史配音版只更换录音时保留原课文${completed ? '完成记录' : '当前句'}与其他答题进度`, async ({ page }, testInfo) => {
  test.setTimeout(120000); await observe(page);
  const item = repairs.find(item => item.issue === 'A02');
  let legacy = true;
  await historicalPage(page, 'unit5-6', '');
  const repaired = await fs.readFile('tests/fixtures/unit5-6-voiced-before/content.js');
  const previous = await fs.readFile('tests/fixtures/pronunciation-before/unit5-6-content.js');
  const oldAudio = await fs.readFile('tests/fixtures/pronunciation-before/unit5-6-chang-woo.mp3');
  await page.route('**/unit5-6/content.js*', route => legacy ? route.fulfill({ contentType: 'text/javascript', body: previous }) : route.fulfill({ contentType: 'text/javascript', body: repaired }));
  await page.route('**/' + item.oldPath, route => legacy ? route.fulfill({ contentType: 'audio/mpeg', body: oldAudio }) : route.abort());
  await page.goto('/unit5-6/#learn/listen');
  const listen = page.locator('.stage-listen');
  await heard(page, listen.getByRole('button', { name: '听一遍', exact: true }), '/unit5-6/audio/l05-w07.mp3');
  await listen.getByRole('button', { name: 'French', exact: true }).click();
  await listen.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(listen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await page.goto('/unit5-6/#learn/text');
  const story = page.locator('.stage-text'), count = completed ? 20 : 12;
  for (let i = 1; i <= count; i++) await heard(page, story.getByRole('button', { name: i === 1 ? '开始听课文' : '下一句', exact: true }), '/unit5-6/audio/l05-d' + String(i).padStart(2, '0') + '.mp3');
  if (completed) await story.getByRole('button', { name: '完成课文学习', exact: true }).click();
  const stars = await page.locator('#starCount').textContent();
  legacy = false; await page.reload();
  await expect(story.locator('.bubble-row')).toHaveCount(count);
  await expect(page.locator('#starCount')).toHaveText(stars);
  if (completed) await expect(story.getByText('故事听完了！', { exact: true })).toBeVisible();
  await verifiedPlayback(page, item, control(page, item), '', testInfo);
  await page.goto('/unit5-6/#learn/listen');
  await expect(listen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
});
