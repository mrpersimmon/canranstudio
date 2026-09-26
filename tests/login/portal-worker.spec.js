'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises'), os = require('node:os'), path = require('node:path');
const { createApp } = require('../../server/app');

for (const base of ['/', '/lesson/']) for (const route of ['', 'unit7-8/#learn/exam']) {
  test(`${base}${route} 首次缓存准备结束不能刷新正在输入的登录表单`, async ({ browser }) => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-login-worker-'));
    const origin = 'http://127.0.0.1:4198';
    let server, context, release;
    const gate = new Promise(resolve => { release = resolve; });
    let arrived;
    const requested = new Promise(resolve => { arrived = resolve; });
    try {
      server = await createApp({ dataDir: directory, origin, basePath: base });
      const handle = server.listeners('request')[0]; server.removeListener('request', handle);
      // Hold only the real worker dependency to reproduce typing during install.
      // The login page, form and service worker all remain production code.
      server.on('request', async (request, response) => {
        if (request.url === base + 'core/course-worker.js') { arrived(); await gate; }
        handle(request, response);
      });
      await new Promise(resolve => server.listen(4198, '127.0.0.1', resolve));
      context = await browser.newContext({ baseURL: origin }); const page = await context.newPage();
      await page.goto(base + route); await requested;
      await page.getByLabel('学号', { exact: true }).fill('d00000001');
      await page.getByLabel('密码', { exact: true }).fill('Unsubmitted-test-draft!');
      let navigations = 0; page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations++; });
      release();
      await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.state || '')).toBe('activated');
      // A real browser task after activation lets any navigate() request settle.
      await page.getByRole('button', { name: '忘记学号或密码', exact: true }).click();
      await expect(page.getByRole('status')).toContainText('请联系老师');
      await expect(page.getByLabel('学号', { exact: true })).toHaveValue('d00000001');
      await expect(page.getByLabel('密码', { exact: true })).toHaveValue('Unsubmitted-test-draft!');
      expect(navigations).toBe(0);
    } finally {
      release(); await context?.close(); if (server) await new Promise(resolve => server.close(resolve));
      await fs.rm(directory, { recursive: true, force: true });
    }
  });
}
