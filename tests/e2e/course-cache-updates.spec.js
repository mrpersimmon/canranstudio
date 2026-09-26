'use strict';
const { test, expect, chromium } = require('@playwright/test');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { createCoursePackages } = require('../../scripts/course-packages');
const { completeUnit2930 } = require('../support/unit29-30-flow');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
test('固定 10 Mbps 与 150 毫秒环境记录首次点课到完整画面的耗时', async ({ page, context, browser }, testInfo) => {
  test.setTimeout(60000);
  const network = await context.newCDPSession(page);
  await network.send('Network.enable');
  await network.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1250000, uploadThroughput: 1250000, connectionType: 'cellular3g' });
  await page.goto('/lesson/', { waitUntil: 'domcontentloaded' });
  const entry = page.locator('a[href="/lesson/unit1-2/#learn/words"]');
  await expect(entry).toBeVisible({ timeout: 30000 });
  const start = Date.now();
  await entry.click();
  await expect(page.getByRole('heading', { name: '物品小图鉴', exact: true })).toBeVisible({ timeout: 30000 });
  const elapsed = Date.now() - start;
  await fs.writeFile(testInfo.outputPath('first-visit.json'), JSON.stringify({ browser: browser.version(), cpu: os.cpus()[0].model, downMbps: 10, latencyMs: 150, from: 'prepared navigation', target: 'unit1-2', elapsedMs: elapsed }, null, 2));
  await expect.poll(() => page.locator('img:visible').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  expect(elapsed).toBeLessThan(5000);
});
test('两个标签页同时准备同课，关掉一页后另一页仍能完整进入', async ({ context }) => {
  let release, seen;
  const held = new Promise(resolve => { release = resolve; });
  const requested = new Promise(resolve => { seen = resolve; });
  let finished = 0;
  await context.route(/\/handbag\.svg$/, async route => { seen(); await held; try { await route.continue(); finished++; } catch {} });
  const first = await context.newPage(), second = await context.newPage();
  await first.goto('/lesson/unit1-2/#learn/words', { waitUntil: 'domcontentloaded' });
  await requested;
  await second.goto('/lesson/unit1-2/#learn/words', { waitUntil: 'domcontentloaded' });
  await expect(second.getByRole('status', { name: '课程准备状态', exact: true })).toBeVisible();
  await first.close(); release();
  await expect(second.getByRole('heading', { name: '物品小图鉴', exact: true })).toBeVisible();
  await expect.poll(() => second.locator('.stage-words img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
});

test('已知撤回版本不会继续推进作答，新版失败时保留位置等待更新', async ({ page, context, request }) => {
  await page.goto('/lesson/unit29-30/#learn/words');
  await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  const index = await (await request.get('/lesson/course-index.json')).json();
  index.withdrawn = ['unit29-30@' + index.courses['unit29-30'].revision];
  await context.route('**/lesson/course-index.json', route => route.fulfill({ json: index }));
  await page.reload();
  await expect(page.locator('.stage-words')).toContainText('2 / 5');
  // The rendered old page remains stable until the learner tries an operation.
  await expect(async () => {
    await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
    await expect(page.getByText('课程需要更新，请联网后再试。', { exact: true })).toBeVisible();
  }).toPass({ timeout: 5000 });
  await page.reload();
  await expect(page.getByRole('button', { name: '再试一次', exact: true })).toBeVisible();
  await expect(page.locator('.stage-words')).not.toBeVisible();
});

test('缓存录音支持真实点播和断网分段读取，下载不增加听辨进度', async ({ page, context }) => {
  await page.addInitScript(() => {
    window.observedAudioEnded = false;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) { this.addEventListener('ended', () => { window.observedAudioEnded = true; }, { once: true }); return play.apply(this, args); };
  });
  await page.goto('/lesson/unit1-2/#learn/words');
  await page.locator('.stage-words').getByRole('button', { name: 'handbag', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.observedAudioEnded)).toBe(true);
  await context.setOffline(true);
  const range = await page.evaluate(async () => {
    const response = await fetch('/lesson/unit1-2/audio/l01-w03.mp3', { headers: { Range: 'bytes=0-31' } });
    return { status: response.status, bytes: (await response.arrayBuffer()).byteLength, contentRange: response.headers.get('content-range') };
  });
  expect(range.status).toBe(206); expect(range.bytes).toBe(32); expect(range.contentRange).toMatch(/^bytes 0-31\/\d+$/);
  await page.goto('/lesson/unit1-2/#learn/listen');
  await expect(page.locator('.stage-listen').getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('完整缓存 20 次复访恢复可操作位置并记录实际耗时', async ({ page, browser }, testInfo) => {
  test.setTimeout(45000);
  await page.goto('/lesson/unit29-30/#learn/words');
  const next = page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true });
  await expect(next).toBeVisible();
  const samples = [], fetched = [];
  page.on('request', request => { if (/\/resources\/.*\.(?:svg|png|woff2|js|html)$/.test(request.url())) fetched.push(request.url()); });
  for (let i = 0; i < 20; i++) {
    const start = Date.now();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(next).toBeVisible();
    samples.push(Date.now() - start);
  }
  const p95 = [...samples].sort((a, b) => a - b)[18];
  await fs.writeFile(testInfo.outputPath('warm-visits.json'), JSON.stringify({ browser: browser.version(), platform: process.platform, cpu: os.cpus()[0].model, samples, p95 }, null, 2));
  await testInfo.attach('warm-visits.json', { contentType: 'application/json', body: Buffer.from(JSON.stringify({ browser: browser.version(), platform: process.platform, cpu: os.cpus()[0].model, samples, p95 })) });
  expect(fetched).toEqual([]);
  expect(p95).toBeLessThan(1500);
});

async function revisedCourse(request, id = 'unit29-30') {
  const index = await (await request.get('/lesson/course-index.json')).json();
  const pack = await (await request.get(index.courses[id].manifest)).json();
  const entry = pack.required.find(item => item.key === pack.entry);
  const original = await (await request.get(entry.url)).body();
  const bytes = Buffer.from(original.toString().replace(/<title>.*?<\/title>/, '<title>新版课程缓存验收</title>'));
  const updated = { ...entry, sha256: sha(bytes), bytes: bytes.length, url: '/lesson/resources/' + sha(bytes) + '/index.html' };
  pack.required = pack.required.map(item => item.key === pack.entry ? updated : item);
  pack.revision = sha(JSON.stringify(pack.required.map(item => [item.key, item.sha256])));
  const body = Buffer.from(JSON.stringify(pack));
  index.courses[id] = { ...index.courses[id], revision: pack.revision, manifest: '/lesson/course-packages/' + id + '/' + pack.revision + '.json', sha256: sha(body) };
  return { index, pack, updated, bytes, body };
}

test('普通更新后台准备，旧页不被改写，下一次进入使用完整新版且不重下未变文件', async ({ page, context, request }) => {
  await page.goto('/lesson/unit29-30/#learn/words');
  const oldTitle = await page.title();
  await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  const revision = await revisedCourse(request);
  let newFetched = false;
  const fetched = [];
  await context.route('**/lesson/course-index.json', route => route.fulfill({ json: revision.index }));
  await context.route('**' + revision.index.courses['unit29-30'].manifest, route => route.fulfill({ body: revision.body, contentType: 'application/json' }));
  await context.route('**/lesson/resources/**', async route => {
    fetched.push(route.request().url());
    if (new URL(route.request().url()).pathname === revision.updated.url) { newFetched = true; await route.fulfill({ body: revision.bytes, contentType: revision.updated.type }); }
    else await route.continue();
  });
  // Another visit opens the old complete package and discovers the normal update.
  const second = await context.newPage();
  await second.goto('/lesson/unit29-30/#learn/words');
  await expect(second).toHaveTitle(oldTitle);
  await expect.poll(() => newFetched).toBe(true);
  // Use UI reloads until the prepared version is committed; never inspect its private index.
  await expect(async () => {
    await second.reload();
    await expect(second).toHaveTitle('新版课程缓存验收');
  }).toPass({ timeout: 15000 });
  await expect(page).toHaveTitle(oldTitle);
  await expect(second.locator('.stage-words')).toContainText('2 / 5');
  expect(fetched.filter(url => !url.endsWith('.mp3'))).toEqual([new URL(revision.updated.url, page.url()).href]);
});

test('损坏一张已存图片，刷新只补齐该文件并保留词卡页', async ({ page, request }) => {
  const index = await (await request.get('/lesson/course-index.json')).json();
  const pack = await (await request.get(index.courses['unit29-30'].manifest)).json();
  const item = pack.required.find(item => item.key.endsWith('/assets/unit29-30/bedroom.svg')) || pack.required.find(item => item.type === 'image/svg+xml');
  await page.goto('/lesson/unit29-30/#learn/words');
  await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  // Fault injection at the browser storage boundary, without forging a learning record.
  await page.evaluate(async item => {
    for (const name of await caches.keys()) if (name.startsWith('canran:lesson:course-cache:')) {
      const cache = await caches.open(name);
      await cache.put('/lesson/resources/' + item.sha256, new Response('broken image'));
    }
  }, item);
  const fetched = [];
  page.on('request', request => { if (request.url().includes('/lesson/resources/') && !request.url().endsWith('.mp3')) fetched.push(request.url()); });
  await page.reload();
  await expect(page.locator('.stage-words')).toContainText('2 / 5');
  expect(fetched).toEqual([new URL(item.url, page.url()).href]);
});

test('已准备课程在浏览器重启后断网仍可进入，未知课程明确要求联网', async () => {
  test.setTimeout(45000);
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-cache-browser-'));
  const packages = await createCoursePackages({ root: process.cwd(), basePath: '/lesson/' });
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const item = packages.generated.get(url.pathname.slice('/lesson/'.length) + (url.pathname.endsWith('/') ? 'index.html' : ''));
    if (!item) return response.writeHead(404).end();
    response.writeHead(200, { 'Content-Type': item.type, 'Service-Worker-Allowed': '/lesson/' }).end(item.body);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  let context;
  try {
    context = await chromium.launchPersistentContext(profile, { headless: true });
    let page = await context.newPage();
    await page.goto(origin + '/lesson/unit29-30/#learn/words');
    await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
    await context.close();
    await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
    context = await chromium.launchPersistentContext(profile, { headless: true, offline: true });
    page = await context.newPage();
    await page.goto(origin + '/lesson/unit29-30/#learn/words');
    await expect(page.locator('.stage-words')).toContainText('2 / 5');
    await page.goto(origin + '/lesson/unit27-28/');
    await expect(page.getByRole('heading', { name: '这节课还没准备好', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: '再试一次', exact: true })).toBeVisible();
  } finally { server.close(); await context?.close(); await fs.rm(profile, { recursive: true, force: true }); }
});

test('无配音课断网走完所有题型并保存证书，不请求英语配音', async ({ page, context }) => {
  const recordings = [], errors = [];
  page.on('request', request => { if (/\.mp3(?:[?#]|$)/.test(request.url()) && !/duolingo-/.test(request.url())) recordings.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/lesson/unit29-30/#learn/words');
  await expect(page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true })).toBeVisible();
  await context.setOffline(true);
  await completeUnit2930(page, '/lesson');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('小小整理家');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '保存图片', exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(/\.png$/);
  expect(recordings).toEqual([]); expect(errors).toEqual([]);
});
