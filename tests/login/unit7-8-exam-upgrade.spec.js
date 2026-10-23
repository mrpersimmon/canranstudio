'use strict';
// Frozen paper certificates used the learner's local date. Generate the
// historical original in Shanghai; compare its current copy on a UTC device.
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, signIn } = require('./helpers');
const legacy = require('../fixtures/unit7-8-exam3-before/flow');
const { finishExamFrom } = require('../support/unit7-8-exam');
const tasks = require('../fixtures/classroom-before-fivezones/tests/support/units1-30-tasks');
const { createSite, removeTemporaryDirectory } = require('../support/historical-site');
const fs = require('node:fs/promises'), os = require('node:os'), path = require('node:path');

test('7–8三题旧挑战先升十一题再升五星版，跨设备保留原证与日期，新题不代答', async ({ browser }) => {
  test.setTimeout(180000);
  const { createApp } = require('../../server/app'), { openStore } = require('../../server/store');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-unit78-exam-upgrade-'));
  const oldRoot = path.join(directory, 'old'), dataDir = path.join(directory, 'data');
  const elevenRoot = path.join(directory, 'eleven-question-edition');
  const root = path.resolve(__dirname, '../..'), origin = require('../support/login-test-ports').origin(4199);
  let server, first, second, third;
  const start = async source => { server = await createApp({ root: source, dataDir, origin, basePath: '/' }); await new Promise(resolve => server.listen(require('../support/login-test-ports').port(4199), '127.0.0.1', resolve)); };
  try {
    // The three-question -> eleven-question contract precedes five-zone awards.
    // Keep both genuine editions and then exercise the current migration too.
    await createSite(oldRoot, { classroom:true, overlays:{'unit7-8':path.join(root,'tests/fixtures/unit7-8-exam3-before')} });
    await createSite(elevenRoot, { classroom:true });
    const store = openStore(dataDir); store.setAdmin('teacher', 'Test-only-classroom-2026!'); store.close(); await start(oldRoot);
    first = await browser.newContext({ baseURL: origin, timezoneId: 'Asia/Shanghai' }); const old = await first.newPage(); await adminLogin(old, '/');
    const account = await createStudent(old, '综合挑战升级验收', '采访班', [/Lesson 7–8 /]); await signIn(old, account, '/');
    await legacy.completeUnit78(old);
    await old.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('综合小记者'); await old.clock.setFixedTime(new Date('2026-10-23T16:10:00.000Z')); await old.getByRole('button', { name: '领取单元证书', exact: true }).click();
    const date = await old.locator('#certificateDate').innerText(); await old.keyboard.press('Escape');
    const issuedAt=await old.evaluate(()=>JSON.parse(localStorage.getItem(window.CanranCore.unit78.progress.learningKey)).activity.unitClassroomCertificateIssuedAt);
    expect(Number.isFinite(Date.parse(issuedAt))).toBe(true);
    expect(issuedAt).toBe('2026-10-23T16:10:00.000Z');
    await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await first.close(); first = null; await new Promise(resolve => server.close(resolve)); server = null; await start(elevenRoot);
    second = await browser.newContext({ baseURL: origin, timezoneId: 'Asia/Shanghai' }); const current = await second.newPage(); await signIn(current, account, '/');
    await expect(current.locator('.course')).toContainText('6 / 15');
    await current.goto('/unit7-8/#learn/certificate'); await expect(current.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
    await expect(current.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('综合小记者');
    for(const id of ['listen','reply'])await tasks.activity(current,'7-8',id);await current.goto('/unit7-8/#learn/certificate');
    await current.getByRole('button', { name: '继续：采访小挑战', exact: true }).click();
    await expect(current).toHaveURL(/#learn\/exam$/);
    const room = current.locator('.stage-exam');
    await expect(room).toContainText('第 4 / 11 题'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await finishExamFrom(current, 3); await expect(room).toContainText('首次独立答对 11 / 11');
    await room.getByRole('button', { name: '下一站：我的单元证书', exact: true }).click();
    await current.getByRole('button', { name: '领取单元证书', exact: true }).click(); await expect(current.locator('#certificateDate')).toHaveText(date); await current.keyboard.press('Escape');
    await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    third = await browser.newContext({ baseURL: origin, timezoneId: 'Asia/Shanghai' }); const restored = await third.newPage(); await signIn(restored, account, '/');
    await expect(restored.locator('.course')).toContainText('15 / 15'); await restored.goto('/unit7-8/#learn/exam');
    await expect(restored.locator('.stage-exam')).toContainText('首次独立答对 11 / 11');
    await restored.goto('/unit7-8/#learn/certificate'); await expect(restored.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('综合小记者');
    expect(await restored.evaluate(()=>JSON.parse(localStorage.getItem(window.CanranCore.unit78.progress.learningKey)).activity.unitClassroomCertificateIssuedAt)).toBe(issuedAt);
    // This real historical renderer fills its certificate only when opened.
    await restored.getByRole('button',{name:'领取单元证书',exact:true}).click();
    await expect(restored.locator('#certificateDate')).toHaveText(date);
    expect(await restored.evaluate(()=>JSON.parse(localStorage.getItem(window.CanranCore.unit78.progress.learningKey)).activity.unitClassroomCertificateIssuedAt)).toBe(issuedAt);
    await restored.keyboard.press('Escape');

    await new Promise(resolve => {server.close(resolve);server.closeAllConnections();});server=null;await start(root);
    await restored.goto('/unit7-8/?course-retry=1#learn/certificate');
    await expect(restored.locator('#wordPageProgress')).toBeVisible({timeout:30000});
    await expect(restored.locator('#starCount')).toHaveText('0');
    const history=restored.locator('.legacy-learning');
    await history.locator('summary').first().click();
    await expect(history).toContainText('15 / 15');
    await expect(history.locator('.legacy-name')).toContainText('综合小记者');
    expect((await history.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date.match(/\d+/g));
    await history.getByRole('button',{name:'查看旧证书',exact:true}).click();
    await expect(restored.locator('#legacyCertificateName')).toHaveText('综合小记者');
    await expect(restored.locator('#legacyCertificateDate')).toHaveText(date);
    await restored.keyboard.press('Escape');

    await second.close();second=await browser.newContext({baseURL:origin,timezoneId:'UTC'});
    const fresh=await second.newPage();await signIn(fresh,account,'/');
    await fresh.goto('/unit7-8/#learn/certificate');
    await expect(fresh.locator('#wordPageProgress')).toBeVisible({timeout:30000});
    await expect(fresh.locator('#starCount')).toHaveText('0');
    await expect(fresh.locator('#certificateName')).toHaveText('采访班');
    await expect(fresh.locator('#certificateDate')).toBeHidden();
    await fresh.locator('.legacy-learning summary').first().click();
    await expect(fresh.locator('.legacy-name')).toContainText('综合小记者');
    expect((await fresh.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date.match(/\d+/g));
    await fresh.goto('/unit7-8/#learn/roles');
    await expect(fresh.locator('.stage-roles .progress-copy')).toHaveText('第 3 / 4 题');
    await expect(fresh.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  } finally {
    await first?.close(); await second?.close(); await third?.close();
    if (server) await new Promise(resolve => {server.close(resolve);server.closeAllConnections();});await removeTemporaryDirectory(directory);
  }
});
