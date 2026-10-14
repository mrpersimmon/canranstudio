'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises'), os = require('node:os'), path = require('node:path');
const { adminLogin, createStudent, studentLogin, signIn } = require('./helpers');
const flow = require('../support/thirteen-types-flow');
const tasks = require('../support/units1-30-tasks');
const { expectCompactCompletion } = require('../support/completion-layout');
const base = process.env.AWARD_TEST_BASE || '/lesson/';

// Explicit contexts do not inherit the page fixture's device settings.
function deviceSettings() {
  const use = test.info().project.use;
  return Object.fromEntries(['viewport', 'isMobile', 'hasTouch', 'deviceScaleFactor', 'userAgent']
    .filter(key => use[key] !== undefined).map(key => [key, use[key]]));
}

async function twoErrors(room) {
  for (let repeat = 0; repeat < 2; repeat++) {
    await flow.select(room, 'Pardon?');
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.locator('.fb')).toHaveText('再看看。');
    if (!repeat) await room.getByRole('button', { name: '再试一次', exact: true }).click();
  }
}

test('登录手机短屏完成后统计与操作完整，再进和重练保留已获星', async ({ page, browser }) => {
  await adminLogin(page, base);
  const account = await createStudent(page, '短屏结算验收', '小岚', [/Lesson 3–4/]);
  const student = await studentLogin(browser, account, base, deviceSettings());
  try {
    const p = student.page;
    await p.setViewportSize({ width: 320, height: 568 });
    await tasks.activity(p, '3-4', 'listen', { base: base.slice(0, -1), keepAward: true });
    const reward = p.getByRole('dialog', { name: /纪念卡结算/ });
    await expect(reward.getByRole('group', { name: '已获得 1 / 5 颗星', exact: true })).toBeVisible();
    await reward.press('Escape'); await expect(reward).not.toBeVisible();
    const room = p.locator('.stage-listen');
    await expectCompactCompletion(p, room, { illustrated: true });
    await expect(room.locator('.completion-number')).toHaveText(['5', '5', '0']);
    await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await room.getByRole('button', { name: '下一站：衣帽间小剧场', exact: true }).click();
    await expect(p).toHaveURL(/#learn\/text$/);
    await p.goBack(); await p.reload();
    await expectCompactCompletion(p, room, { illustrated: true });
    await expect(room.locator('.completion-number')).toHaveText(['5', '5', '0']);
    await expect(p.locator('#starCount')).toHaveText('1');
    await p.screenshot({ path: `output/playwright/submission-statistics/login-${test.info().project.name || 'chromium'}-${base === '/' ? 'root' : 'lesson'}-320x568.png` });
    await room.getByRole('button', { name: '再练一轮', exact: true }).click();
    await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');
    await p.reload();
    await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');
    await expect(p.locator('#starCount')).toHaveText('1');
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  } finally { await student.context.close(); }
});

test('旧课包升级保留中途错答、既有五星和首次满星日期，另一设备统计一致', async ({ browser }) => {
  test.setTimeout(150000);
  const { createApp } = require('../../server/app'), { openStore } = require('../../server/store');
  const { createCoursePackages } = require('../../scripts/course-packages');
  const { UNITS } = require('../../server/catalog');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'canran-statistics-upgrade-'));
  const root = path.resolve(__dirname, '../..'), origin = require('../support/login-test-ports').origin(4248);
  const frozen = new Set(['core/lesson49-practice.js', 'unit1-2/completion.js', 'unit1-2/completion.css']);
  let server, first, second;
  const start = async old => {
    const bundle = old ? await createCoursePackages({ root, basePath: base, courseIds: UNITS, isolatedDefinitions: true,
      readSource: relative => fs.readFile(path.join(root, frozen.has(relative) ? 'tests/fixtures/submission-statistics-before/' + relative : relative)) }) : null;
    server = await createApp({ root, dataDir: directory, origin, basePath: base, bundle });
    await new Promise(resolve => server.listen(require('../support/login-test-ports').port(4248), '127.0.0.1', resolve));
  };
  try {
    const store = openStore(directory); store.setAdmin('teacher', 'Test-only-classroom-2026!'); store.close();
    await start(true);
    first = await browser.newContext({ ...deviceSettings(), baseURL: origin }); const p = await first.newPage();
    await adminLogin(p, base); const account = await createStudent(p, '统计升级验收', '小禾', [/Lesson 1–2/]);
    await signIn(p, account, base);
    await flow.story(p, '1-2', base.slice(0, -1));
    for (const [index, id] of ['listen', 'roles', 'trans', 'manners', 'exam'].entries()) {
      await flow.activity(p, '1-2', id, { base: base.slice(0, -1), keepAward: true });
      const reward = p.getByRole('dialog', { name: /纪念卡结算/ });
      await expect(reward.getByRole('group', { name: `已获得 ${index + 1} / 5 颗星`, exact: true })).toBeVisible();
      await reward.press('Escape'); await expect(reward).not.toBeVisible();
      await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    }
    await p.goto(base + 'unit1-2/#learn/certificate');
    await expect(p.locator('#starCount')).toHaveText('5');
    await expect(p.locator('#certificateDate')).toBeVisible();
    const date = await p.locator('#certificateDate').textContent();
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    await p.goto(base + 'unit1-2/#learn/manners'); const room = p.locator('.stage-manners');
    await room.getByRole('button', { name: '再练一轮', exact: true }).click();
    for (const answer of [{ fills: ['me'] }, 'Yes?']) {
      await flow.select(room, answer); await room.getByRole('button', { name: '检查答案', exact: true }).click();
      await room.getByRole('button', { name: '下一题', exact: true }).click();
    }
    await twoErrors(room);
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    await new Promise(resolve => server.close(resolve)); server = null; await start(false);
    // An open course deliberately keeps its cached edition. The public retry
    // navigation requests the new package without deleting any learning data.
    await p.goto(base + 'unit1-2/?course-retry=1#learn/manners');
    // Versioned resource hashes and real drafts both survive the deployment boundary.
    await expect(room.locator('.progress-copy')).toHaveText('第 3 / 5 题');
    await expect(room.locator('.fb')).toHaveText('再看看。');
    await expect(p.locator('#starCount')).toHaveText('5');
    await room.getByRole('button', { name: '再试一次', exact: true }).click();
    await flow.activity(p, '1-2', 'manners', { base: base.slice(0, -1) });
    await expect(room.locator('.completion-number')).toHaveText(['3', '5', '2']);
    await expect(room.locator('.completion-unit')).toHaveText(['次', '次', '次']);
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    await p.getByRole('button', { name: '学习记录', exact: true }).click();
    const section = p.locator('#learningRecord section').filter({ has: p.getByRole('heading', { name: '帮忙还手提包', exact: true }) });
    await expect(section.getByText('订正完成', { exact: true })).toHaveCount(1);
    await expect(section.getByText('首次答对', { exact: true })).toHaveCount(4);
    await section.getByText('本轮详情', { exact: true }).click();
    await expect(section).toContainText('连续答对 3 次 · 本次答对 5 次 · 本次答错 2 次');
    await p.getByRole('dialog', { name: '学习记录', exact: true }).getByRole('button', { name: '关闭', exact: true }).click();
    await p.goto(base + 'unit1-2/#learn/certificate'); await expect(p.locator('#certificateDate')).toHaveText(date);
    await p.clock.setFixedTime(new Date(Date.now() + 86400000)); await p.reload();
    await expect(p.locator('#certificateDate')).toHaveText(date); await expect(p.locator('#starCount')).toHaveText('5');
    second = await browser.newContext({ ...deviceSettings(), baseURL: origin }); const other = await second.newPage();
    await signIn(other, account, base); await other.goto(base + 'unit1-2/#learn/manners');
    await expect(other.locator('.stage-manners .completion-number')).toHaveText(['3', '5', '2']);
    await other.reload(); await expect(other.locator('.stage-manners .completion-number')).toHaveText(['3', '5', '2']);
    await other.goto(base + 'unit1-2/#learn/certificate');
    await expect(other.locator('#certificateDate')).toHaveText(date); await expect(other.locator('#certificateName')).toHaveText('小禾');
    await other.getByRole('link', { name: '我的纪念册', exact: true }).click();
    await expect(other.locator('.book')).toHaveAttribute('aria-busy', 'false');
    await expect(other.locator('.certificate')).toHaveAttribute('data-stars', '5');
  } finally {
    await first?.close(); await second?.close();
    if (server) await new Promise(resolve => server.close(resolve));
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test('有错轮次同步到另一设备仍为零星，重复传输不增加统计，重练从零开始', async ({ page, browser }) => {
  test.setTimeout(90000); await adminLogin(page, base);
  const account = await createStudent(page, '统计同步验收', '小雨', [/Lesson 1–2/]);
  // Page routing is not a reliable fault boundary for WebKit worker requests.
  // The upgrade test above covers Worker allow; this fault case uses fallback.
  const first = await studentLogin(browser, account, base, { ...deviceSettings(), serviceWorkers: 'block' }); let second;
  try {
    const p = first.page;
    let completedTransmissions = 0, loseReplies = true;
    await p.route('**/api/progress', async route => {
      const payload = route.request().postDataJSON();
      if (payload?.value?.activity?.unitCompleted?.manners) {
        completedTransmissions++;
        if (loseReplies) {
          // The server accepts the genuine submission; only its reply is lost.
          // Reload then exercises the real client's persistent retry queue.
          await route.fetch(); await route.abort('failed'); return;
        }
      }
      await route.continue();
    });
    await flow.activity(p, '1-2', 'manners', { base: base.slice(0, -1), capture: async (room, i, phase) => {
      if (i !== 2 || phase !== 'blank') return;
      await twoErrors(room); await p.reload();
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    } });
    await expect(p.locator('.stage-manners .completion-number')).toHaveText(['3', '5', '2']);
    await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state', 'retry');
    // Resend/merge the same accepted proof without another learner submission.
    loseReplies = false;
    await p.reload(); await p.reload();
    await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
    expect(completedTransmissions).toBeGreaterThanOrEqual(2);
    await expect(p.locator('.stage-manners .completion-number')).toHaveText(['3', '5', '2']);
    await expect(p.locator('#starCount')).toHaveText('0');
    second = await studentLogin(browser, account, base, deviceSettings()); const other = second.page;
    await other.goto(base + 'unit1-2/#learn/manners');
    await expect(other.locator('.stage-manners .completion-number')).toHaveText(['3', '5', '2']);
    await expect(other.locator('#starCount')).toHaveText('0');
    await other.locator('.stage-manners').getByRole('button', { name: '再练一轮', exact: true }).click();
    await other.reload(); await expect(other.locator('.stage-manners .progress-copy')).toHaveText('第 1 / 5 题');
    await flow.activity(other, '1-2', 'manners', { base: base.slice(0, -1) });
    await expect(other.locator('.stage-manners .completion-number')).toHaveText(['5', '5', '0']);
    await expect(other.locator('#starCount')).toHaveText('1');
  } finally { await first.context.close(); await second?.context.close(); }
});
