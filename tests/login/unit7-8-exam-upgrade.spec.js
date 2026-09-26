'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, signIn } = require('./helpers');
const legacy = require('../fixtures/unit7-8-exam3-before/flow');
const { finishExamFrom } = require('../support/unit7-8-exam');
const fs = require('node:fs/promises'), os = require('node:os'), path = require('node:path');

test('7–8三题旧服务器升级换设备，保留12星与姓名，新增七题完成后才同步15星', async ({ browser }) => {
  test.setTimeout(120000);
  const { createApp } = require('../../server/app'), { openStore } = require('../../server/store');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-unit78-exam-upgrade-'));
  const oldRoot = path.join(directory, 'old'), dataDir = path.join(directory, 'data');
  const root = path.resolve(__dirname, '../..'), origin = 'http://127.0.0.1:4199';
  let server, first, second, third;
  const start = async source => { server = await createApp({ root: source, dataDir, origin, basePath: '/' }); await new Promise(resolve => server.listen(4199, '127.0.0.1', resolve)); };
  try {
    await fs.mkdir(oldRoot);
    for (const entry of await fs.readdir(root, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'unit7-8') continue;
      if (entry.isDirectory() && /^unit\d+-\d+$/.test(entry.name)) {
        await fs.mkdir(path.join(oldRoot, entry.name));
        for (const name of await fs.readdir(path.join(root, entry.name))) await fs.symlink(path.join(root, entry.name, name), path.join(oldRoot, entry.name, name));
      } else await fs.symlink(path.join(root, entry.name), path.join(oldRoot, entry.name));
    }
    await fs.mkdir(path.join(oldRoot, 'unit7-8'));
    for (const name of ['index.html', 'content.js', 'unit.js', 'unit.css', 'scene.js']) await fs.copyFile(path.join(root, 'tests/fixtures/unit7-8-exam3-before', name), path.join(oldRoot, 'unit7-8', name));
    const store = openStore(dataDir); store.setAdmin('teacher', 'Test-only-classroom-2026!'); store.close(); await start(oldRoot);
    first = await browser.newContext({ baseURL: origin }); const old = await first.newPage(); await adminLogin(old, '/');
    const account = await createStudent(old, '综合挑战升级验收', '采访班', [/Lesson 7–8 /]); await signIn(old, account, '/');
    await legacy.completeUnit78(old);
    await old.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('综合小记者'); await old.getByRole('button', { name: '领取单元证书', exact: true }).click();
    const date = await old.locator('#certificateDate').innerText(); await old.keyboard.press('Escape');
    await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await first.close(); first = null; await new Promise(resolve => server.close(resolve)); server = null; await start(root);
    second = await browser.newContext({ baseURL: origin }); const current = await second.newPage(); await signIn(current, account, '/');
    await expect(current.locator('.course')).toContainText('12 / 15');
    await current.goto('/unit7-8/#learn/certificate'); await expect(current.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
    await expect(current.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('综合小记者');
    await current.getByRole('button', { name: '继续：采访小挑战', exact: true }).click();
    await expect(current).toHaveURL(/#learn\/exam$/);
    const room = current.locator('.stage-exam');
    await expect(room).toContainText('第 4 / 10 题'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await finishExamFrom(current, 3); await expect(room).toContainText('首次独立答对 10 / 10');
    await room.getByRole('button', { name: '下一站：我的单元证书', exact: true }).click();
    await current.getByRole('button', { name: '领取单元证书', exact: true }).click(); await expect(current.locator('#certificateDate')).toHaveText(date); await current.keyboard.press('Escape');
    await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    third = await browser.newContext({ baseURL: origin }); const restored = await third.newPage(); await signIn(restored, account, '/');
    await expect(restored.locator('.course')).toContainText('15 / 15'); await restored.goto('/unit7-8/#learn/exam');
    await expect(restored.locator('.stage-exam')).toContainText('首次独立答对 10 / 10');
    await restored.goto('/unit7-8/#learn/certificate'); await expect(restored.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('综合小记者');
  } finally {
    await first?.close(); await second?.close(); await third?.close();
    if (server) await new Promise(resolve => server.close(resolve)); await fs.rm(directory, { recursive: true, force: true });
  }
});
