'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, signIn } = require('./helpers');
const { EXAMS, finishExam } = require('../support/units1-6-exam');
const fs = require('node:fs/promises'), os = require('node:os'), path = require('node:path');
for (const [unit, title, oldCount, complete] of [
  ['1-2', '礼貌小挑战', 2, 'completeUnit12'],
  ['3-4', '认领小挑战', 3, 'completeUnit34'],
  ['5-6', '见面小挑战', 3, 'completeUnit56']
]) test(`${unit} 旧短挑战服务器升级换设备，先保留12星与姓名，补完新增题才同步15星`, async ({ browser }) => {
  test.setTimeout(150000);
  const { createApp } = require('../../server/app'), { openStore } = require('../../server/store');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-short-exam-upgrade-'));
  const oldRoot = path.join(directory, 'old'), dataDir = path.join(directory, 'data');
  const root = path.resolve(__dirname, '../..'), origin = 'http://127.0.0.1:4199', course = 'unit' + unit;
  let server, first, second, third;
  const start = async source => { server = await createApp({ root: source, dataDir, origin, basePath: '/' }); await new Promise(resolve => server.listen(4199, '127.0.0.1', resolve)); };
  try {
    await fs.mkdir(oldRoot);
    for (const entry of await fs.readdir(root, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === course) continue;
      if (entry.isDirectory() && /^unit\d+-\d+$/.test(entry.name)) {
        await fs.mkdir(path.join(oldRoot, entry.name));
        for (const name of await fs.readdir(path.join(root, entry.name))) await fs.symlink(path.join(root, entry.name, name), path.join(oldRoot, entry.name, name));
      } else await fs.symlink(path.join(root, entry.name), path.join(oldRoot, entry.name));
    }
    await fs.mkdir(path.join(oldRoot, course));
    const frozen = ['index.html', 'content.js', 'unit.js', 'unit.css', 'scene.js'];
    for (const name of await fs.readdir(path.join(root, course))) {
      if (frozen.includes(name)) await fs.copyFile(path.join(root, `tests/fixtures/${course}-short-exam-before`, name), path.join(oldRoot, course, name));
      else await fs.symlink(path.join(root, course, name), path.join(oldRoot, course, name));
    }
    const store = openStore(dataDir); store.setAdmin('teacher', 'Test-only-classroom-2026!'); store.close(); await start(oldRoot);
    first = await browser.newContext({ baseURL: origin, reducedMotion: 'reduce' }); const old = await first.newPage(); await adminLogin(old, '/');
    const account = await createStudent(old, '综合挑战验收', '课程升级班', [new RegExp('Lesson ' + unit.replace('-', '–') + ' ')]); await signIn(old, account, '/');
    await require(`../fixtures/${course}-short-exam-before/flow`)[complete](old);
    await old.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('综合小达人'); await old.getByRole('button', { name: '领取单元证书', exact: true }).click();
    const date = await old.locator('#certificateDate').innerText(); await old.keyboard.press('Escape');
    await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await first.close(); first = null; await new Promise(resolve => server.close(resolve)); server = null; await start(root);
    second = await browser.newContext({ baseURL: origin, reducedMotion: 'reduce' }); const current = await second.newPage(); await signIn(current, account, '/');
    await expect(current.locator('.course')).toContainText('12 / 15');
    await current.goto(`/${course}/#learn/certificate`); await expect(current.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
    await expect(current.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('综合小达人');
    await current.getByRole('button', { name: '继续：' + title, exact: true }).click();
    const room = current.locator('.stage-exam'); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(oldCount));
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await finishExam(current, unit, oldCount); await room.getByRole('button', { name: '下一站：我的单元证书', exact: true }).click();
    await current.getByRole('button', { name: '领取单元证书', exact: true }).click(); await expect(current.locator('#certificateDate')).toHaveText(date); await current.keyboard.press('Escape');
    await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    third = await browser.newContext({ baseURL: origin, reducedMotion: 'reduce' }); const restored = await third.newPage(); await signIn(restored, account, '/');
    await expect(restored.locator('.course')).toContainText('15 / 15'); await restored.goto(`/${course}/#learn/exam`);
    await expect(restored.locator('.stage-exam')).toContainText(`首次独立答对 ${EXAMS[unit].length} / ${EXAMS[unit].length}`);
    await restored.goto(`/${course}/#learn/certificate`); await expect(restored.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('综合小达人');
  } finally {
    await first?.close(); await second?.close(); await third?.close();
    if (server) await new Promise(resolve => server.close(resolve)); await fs.rm(directory, { recursive: true, force: true });
  }
});
