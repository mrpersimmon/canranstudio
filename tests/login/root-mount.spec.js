'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises'), os = require('node:os'), path = require('node:path');
const { createApp } = require('../../server/app'), { openStore } = require('../../server/store');
const { adminLogin, createStudent, signIn, fillLogin, setPassword } = require('./helpers');
const { completeActivity, completeStory, completeUnit1314 } = require('../support/unit13-14-flow');

async function fixture(browser, basePath) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-root-mount-'));
  const store = openStore(directory); store.setAdmin('teacher', 'Test-only-classroom-2026!'); store.close();
  const origin = 'http://127.0.0.1:4197';
  let server;
  const start = async base => { server = await createApp({ dataDir: directory, origin, basePath: base }); await new Promise(resolve => server.listen(4197, '127.0.0.1', resolve)); };
  await start(basePath);
  const context = await browser.newContext({ baseURL: origin });
  return { context, origin, async move(base) { await new Promise(resolve => server.close(resolve)); await start(base); }, async close() { await context.close(); await new Promise(resolve => server.close(resolve)); await fs.rm(directory, { recursive: true, force: true }); } };
}

test('根目录真实登录、整课与缓存复访可用；旧 lesson 内容下线且匿名资源仍受限', async ({ browser }) => {
  test.setTimeout(120000);
  const f = await fixture(browser, '/');
  try {
    const page = await f.context.newPage();
    const oldRequests = []; page.on('request', request => { if (new URL(request.url()).pathname.startsWith('/lesson/')) oldRequests.push(request.url()); });
    await adminLogin(page, '/');
    const account = await createStudent(page, '根目录发布班', '小北', [/Lesson 13–14 /]);
    await signIn(page, account, '/');
    await expect(page.locator('.course')).toHaveAttribute('href', /\/unit13-14\//);
    await completeUnit1314(page);
    await expect(page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await page.reload(); await expect(page.locator('#starCount')).toHaveText('15');
    expect(oldRequests).toEqual([]);
    expect((await f.context.cookies()).find(cookie => cookie.name === 'canran_student').path).toBe('/');
    expect(await page.evaluate(() => navigator.serviceWorker.controller.scriptURL)).toBe(f.origin + '/core/subpath-worker.js');
    const anonymous = await browser.newContext({ baseURL: f.origin });
    try {
      for (const route of ['/lesson/', '/lesson/unit13-14/', '/lesson/resources/old.js']) expect((await anonymous.request.get(route)).status()).toBe(410);
      expect((await anonymous.request.get('/lesson/core/subpath-worker.js')).status()).toBe(200);
      expect((await anonymous.request.get('/course-index.json')).status()).toBe(401);
      const view = await anonymous.newPage(); await view.goto('/unit13-14/'); await expect(view.getByLabel('学号', { exact: true })).toBeVisible();
      expect((await anonymous.request.get('/core/course-package-service-worker.js')).headers()['service-worker-allowed']).toBe('/');
    } finally { await anonymous.close(); }
  } finally { await f.close(); }
});

test('已有学号密码和真实已完成活动从 lesson 迁至根目录，不因图片路径变化丢成果', async ({ browser }) => {
  test.setTimeout(90000);
  const f = await fixture(browser, '/lesson/');
  try {
    const page = await f.context.newPage(); await adminLogin(page);
    const account = await createStudent(page, '迁址班', '小南', [/Lesson 13–14 /]);
    await signIn(page, account); await completeStory(page, '/lesson'); await completeActivity(page, 'roles', '/lesson');
    await expect(page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    const stars = await page.locator('#starCount').textContent();
    await f.move('/');
    await signIn(page, account, '/'); await page.locator('.course').click();
    await expect(page.locator('#starCount')).toHaveText(stars);
    await page.goto('/unit13-14/#learn/roles');
    await expect(page.locator('.stage-roles').getByRole('group', { name: '完成后的操作', exact: true })).toBeVisible();
    await completeActivity(page, 'colours'); await expect(page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await page.reload(); await expect(page.locator('#starCount')).not.toHaveText(stars);
  } finally { await f.close(); }
});

test('新版首页更新旧 lesson 缓存标签页，旧匿名成果不因清退被删除', async ({ browser }) => {
  test.setTimeout(60000);
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-root-retire-'));
  let server, context;
  try {
    server = await require('../../scripts/preview-courses').serveCourses({ port: 4197 });
    context = await browser.newContext({ baseURL: 'http://127.0.0.1:4197' });
    const old = await context.newPage(); await completeActivity(old, 'colours', '/lesson');
    await expect(old.locator('#starCount')).toHaveText('3');
    await new Promise(resolve => server.close(resolve));
    server = await createApp({ dataDir: directory, origin: 'http://127.0.0.1:4197', basePath: '/' });
    await new Promise(resolve => server.listen(4197, '127.0.0.1', resolve));
    const home = await context.newPage(); await home.goto('/');
    await expect(home.getByLabel('学号', { exact: true })).toBeVisible();
    await expect(old).toHaveURL('http://127.0.0.1:4197/', { timeout: 15000 });
    await expect(old.getByLabel('学号', { exact: true })).toBeVisible();
    expect(await old.evaluate(() => JSON.parse(localStorage.getItem('canran:lesson:unit13-14:learning:v1')).activity.unitCompleted.colours)).toBeTruthy();
  } finally { await context?.close(); if (server) await new Promise(resolve => server.close(resolve)); await fs.rm(directory, { recursive: true, force: true }); }
});

for (const base of ['/', '/lesson/']) test(`${base} 课程直链首次改密和再次登录后均回到原活动`, async ({ browser }) => {
  const f = await fixture(browser, base);
  let context;
  try {
    const admin = await f.context.newPage(); await adminLogin(admin, base);
    const account = await createStudent(admin, '直链班', '小溪', [/Lesson 13–14 /]);
    context = await browser.newContext({ baseURL: f.origin });
    const page = await context.newPage(); await page.goto(base + 'unit13-14/#learn/words');
    await fillLogin(page, account); await setPassword(page);
    await expect(page.locator('.unit-word').first()).toBeVisible();
    await expect(page).toHaveURL(f.origin + base + 'unit13-14/#learn/words');
    await context.clearCookies(); await page.reload();
    await fillLogin(page, account, 'Learning-journey-2026!');
    await expect(page.locator('.unit-word').first()).toBeVisible();
    await expect(page).toHaveURL(f.origin + base + 'unit13-14/#learn/words');
  } finally { await context?.close(); await f.close(); }
});
