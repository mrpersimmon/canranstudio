'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises'), path = require('node:path'), os = require('node:os');
const { DatabaseSync } = require('node:sqlite');
const { createApp } = require('../../server/app');
const { openStore } = require('../../server/store');
const { UNITS } = require('../../server/catalog');
const { EPOCH, MESSAGE } = require('../../server/system-upgrade');
const { signIn } = require('./helpers');
const flow = require('../support/system-upgrade-flow');
const paired = require('../support/units1-30-tasks');
const { dismissRewardDialog } = require('../support/reward-dialog');
const base = process.env.AWARD_TEST_BASE || '/lesson/';
const prefix = base.slice(0, -1);
test.use({ ...(process.env.SYSTEM_UPGRADE_BROWSER ? { browserName: process.env.SYSTEM_UPGRADE_BROWSER } : {}) });

test('真实全星与未通关一次性升级：备份、原证归档、清零、旧离线拒绝、重复执行保留新进度', async ({ browser }, info) => {
  test.setTimeout(360000);
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-system-upgrade-browser-'));
  const dataDir = path.join(temporary, 'data'), backupDirectory = path.join(temporary, 'backup');
  const origin = require('../support/login-test-ports').origin(4358), root = path.resolve(__dirname, '../..');
  let server, first, stale, fresh;
  const start = async () => { server = await createApp({ root, dataDir, origin, basePath: base }); await new Promise(resolve => server.listen(Number(new URL(origin).port), '127.0.0.1', resolve)); };
  const stop = async () => { if (server) { const previous = server; server = null; await new Promise(resolve => { previous.close(resolve); previous.closeAllConnections(); }); } };
  const read = (query, ...args) => { const db = new DatabaseSync(path.join(dataDir, 'learning.sqlite'), { readOnly: true }); try { return db.prepare(query).all(...args); } finally { db.close(); } };
  try {
    let store = openStore(dataDir), group = store.createClass('统一五星升级验收'); store.updateClass(group.id, group.name, UNITS);
    const student = store.createStudents([{ name: '保留证书的小禾', pinyin: 'baoliuzhengshu' }], group.id)[0];
    const account = { number: student.studentNumber, password: store.initialCredential(student.id).initialPassword, fresh: true };
    store.close(); await start();
    first = await browser.newContext({ baseURL: origin, viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Shanghai' });
    const p = await first.newPage(); await signIn(p, account, base);
    const before = await flow.seedBeforeUpgrade(p, prefix);
    const originalAwards = read('SELECT course,edition,value FROM unit_awards WHERE student=? ORDER BY course,edition', student.id).filter(row => JSON.parse(row.value).firstFullStarAt);
    stale = await browser.newContext({ baseURL: origin, viewport: { width: 390, height: 844 } });
    const oldPage = await stale.newPage(); await signIn(oldPage, account, base); await oldPage.goto(base + 'unit5-6/#learn/cars'); await flow.ready(oldPage);
    await stale.setOffline(true);
    const oldPending = await flow.finishOpenCarsOffline(oldPage); expect(oldPending).toBeTruthy(); expect(oldPending.epoch || null).toBe(null);
    await stop(); store = openStore(dataDir);
    let migration; try { migration = await store.applySystemUpgrade({ backupDirectory }); } finally { store.close(); }
    expect(migration.completedCourses).toBe(2); expect(migration.archivedCertificates).toBe(2);
    await start(); await p.goto(base); await expect(p.locator('.course')).toHaveCount(72);
    await expect(p.getByRole('region', { name: '课程体系升级说明', exact: true })).toContainText(MESSAGE);
    for (const course of ['unit1-2', 'unit3-4']) {
      const card = p.locator('[data-unit="' + course + '"]');
      await expect(card).toContainText('已通关'); await expect(card.getByRole('link', { name: /^再次学习/ })).toBeVisible();
    }
    const me = await (await p.request.get(base + 'api/me')).json(); expect(me.systemUpgrade.epoch).toBe(EPOCH);
    expect(me.courses.filter(course => ['unit1-2', 'unit3-4', 'unit5-6'].includes(course.id)).map(course => [course.id, course.stars])).toEqual([['unit1-2', 5], ['unit3-4', 5], ['unit5-6', 0]]);
    const afterAwards = read('SELECT course,edition,value FROM unit_awards WHERE student=? ORDER BY course,edition', student.id);
    expect(afterAwards).toEqual(originalAwards);
    const archives = (await (await p.request.get(base + 'api/certificates')).json()).archives;
    expect(archives).toHaveLength(2);
    // Five-star cards keep their ordinary album placement. Preserving their
    // migration snapshot must not also classify them as old 15-star papers.
    await p.goto(base + 'awards/');
    await expect(p.locator('.postoffice-scene')).toHaveAttribute('aria-busy', 'false', { timeout: 30000 });
    await expect(p.getByRole('heading', { name: '已获得的原证书', exact: true })).toHaveCount(0);
    await expect(p.getByRole('link', { name: '查看原证书', exact: true })).toHaveCount(0);
    await p.getByRole('button', { name: '搜索 Lesson 或纪念卡名称', exact: true }).click();
    const albumDirectory=p.getByRole('dialog', { name: '搜索纪念卡', exact: true });
    await expect(albumDirectory.locator('.directory-row')).toHaveCount(2);
    await expect(albumDirectory).toContainText('Lesson 1–2');
    await expect(albumDirectory).toContainText('Lesson 3–4');
    await albumDirectory.press('Escape');
    for (const certificate of before.certificates) {
      const archived = archives.find(item => item.course === certificate.course);
      expect(archived.issuedAt).toBe(certificate.issuedAt); expect(archived.name).toBe(certificate.name);
      await p.goto(base + certificate.course + '/#learn/certificate'); await flow.ready(p);
      await expect(p.locator('#starCount')).toHaveText('5');
      await expect(p.locator('#certificateName')).toHaveText(certificate.name);
      await expect(p.locator('#certificateDate')).toHaveText(certificate.displayedDate);
    }
    await p.goto(base); await expect(p.locator('.course')).toHaveCount(72);
    await p.screenshot({ path: info.outputPath('upgraded-directory.png'), fullPage: false });
    // A never-started course must not manufacture a 0/15 historical notebook
    // simply because the new epoch has an empty unitCompleted container.
    await p.goto(base + 'unit37-38/#learn/certificate'); await flow.ready(p);
    await expect(p.locator('.legacy-learning,.historical-learning')).toHaveCount(0);
    expect(await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('canran:lesson:unit37-38:learning:v1')).activity || {}).filter(key => /Legacy|History|Migration|V153|V154Seen/.test(key)))).toEqual([]);
    await p.goto(base + 'unit5-6/#learn/introduce'); await flow.ready(p);
    await expect(p.locator('#starCount')).toHaveText('0'); await expect(p.locator('.stage-introduce .progress-copy')).toContainText('第 1 /');
    await expect(p.locator('.stage-introduce').getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(p.getByText('继续当前版本', { exact: true })).toHaveCount(0);
    await stale.setOffline(false);
    await expect(oldPage.getByRole('alertdialog', { name: '课程访问', exact: true })).toBeVisible({ timeout: 15000 });
    // Explicit replay uses the very same genuinely generated old queue, not a
    // forged score. Even a valid logged-in account cannot restore its old epoch.
    const replay = await p.request.post(base + 'api/progress', { headers: { Origin: origin }, data: oldPending });
    expect(replay.status()).toBe(200); expect((await replay.json()).stale).toBe(true);
    expect(read('SELECT value FROM unit_awards WHERE student=? AND course=?', student.id, 'unit5-6')).toEqual([]);
    expect(JSON.parse(read('SELECT value FROM progress WHERE student=? AND course=?', student.id, 'unit5-6')[0].value)).toEqual({});
    await paired.activity(p, '5-6', 'listen', { base: prefix, keepAward: true });
    await expect(p.locator('#starCount')).toHaveText('1'); await dismissRewardDialog(p); await flow.waitSynced(p);
    await stop(); store = openStore(dataDir);
    try { expect((await store.applySystemUpgrade({ backupDirectory: path.join(temporary, 'unused') })).alreadyApplied).toBe(true); } finally { store.close(); }
    await start(); await p.goto(base + 'unit5-6/#learn/words'); await flow.ready(p); await expect(p.locator('#starCount')).toHaveText('1');
    fresh = await browser.newContext({ baseURL: origin, timezoneId: 'Pacific/Honolulu' }); const other = await fresh.newPage(); await signIn(other, account, base);
    const secondArchives = (await (await other.request.get(base + 'api/certificates')).json()).archives;
    expect(secondArchives.map(item => [item.id, item.name, item.issuedAt])).toEqual(archives.map(item => [item.id, item.name, item.issuedAt]));
    await other.goto(base + 'unit1-2/#learn/certificate'); await flow.ready(other);
    await expect(other.locator('#certificateDate')).toHaveText(before.certificates[0].displayedDate);
    await fs.writeFile(info.outputPath('migration-summary.json'), JSON.stringify({ before, migration, afterStars: [5, 5, 0], oldQueueRejected: true, repeatedMigrationPreservedNewStar: true, secondDeviceOriginalNamesAndDates: true }, null, 2));
  } finally {
    await Promise.all([first?.close(), stale?.close(), fresh?.close()]); await stop();
    if (!path.resolve(temporary).startsWith(path.join(os.tmpdir(), 'canran-system-upgrade-browser-'))) throw Error('Unexpected test data cleanup path');
    await fs.rm(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 50 });
  }
});
