'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const { completeUnit34, completeActivity } = require('../support/unit3-4-flow');
const { select } = require('../support/units1-30-tasks');
const { courseResponse } = require('../support/course-response-faults');
test.use({ actionTimeout: 10000, browserName: process.env.UNIT34_REVIEW_BROWSER || 'chromium' });

test('实际提交统计跨设备保留：同题两次错答计两次，重练归零且零错才获星', async ({ page, browser }) => {
  test.setTimeout(120000);
  const base = process.env.AWARD_TEST_BASE || '/lesson/';
  const prefix = base.slice(0, -1);
  await adminLogin(page, base);
  const account = await createStudent(page, '本轮次数验收班', '小禾', [/Lesson 3–4/]);
  const first = await studentLogin(browser, account, base); let second;
  try {
    const learner = first.page;
    await completeActivity(learner, 'reply', { prefix, inspect: async (room, i) => {
      if (i !== 3) return;
      const check = room.getByRole('button', { name: '检查答案', exact: true });
      await select(room, { fills: ['is not', 'am not'] });
      for (let attempt = 0; attempt < 2; attempt++) {
        await check.click();
        await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
        await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
        await learner.reload();
        // Reload decrypts and prepares the course before mounting its exercises.
        await expect(learner.locator('#wordPageProgress')).toBeVisible({ timeout: 30000 });
        await expect(room.locator('.progress-copy')).toHaveText('第 4 / 10 题');
        await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
        await room.getByRole('button', { name: '再试一次', exact: true }).click();
        // Retry keeps the selected wrong answer. Submitting it again is a new
        // mistake; changing the selection itself must not count as an attempt.
        await expect(check).toBeEnabled();
      }
    } });
    await expect(learner.locator('.stage-reply .completion-number')).toHaveText(['7', '10', '2']);
    await expect(learner.locator('#starCount')).toHaveText('0');
    await expect(learner.locator('dialog.award-reveal[open]')).toHaveCount(0);
    await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');

    second = await studentLogin(browser, account, base);
    await second.page.goto(base + 'unit3-4/#learn/reply');
    await expect(second.page.locator('#wordPageProgress')).toBeVisible({ timeout: 30000 });
    const room = second.page.locator('.stage-reply');
    await expect(room.locator('.completion-number')).toHaveText(['7', '10', '2']);
    await expect(room.locator('.completion-unit')).toHaveText(['次', '次', '次']);
    await expect(second.page.locator('#starCount')).toHaveText('0');
    await room.getByRole('button', { name: '再练一轮', exact: true }).click();
    await expect(room.locator('.progress-copy')).toHaveText('第 1 / 10 题');
    await completeActivity(second.page, 'reply', { prefix });
    await expect(room.locator('.completion-number')).toHaveText(['10', '10', '0']);
    await expect(second.page.locator('#starCount')).toHaveText('1');
    await expect(second.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await learner.reload();
    await expect(learner.locator('#wordPageProgress')).toBeVisible({ timeout: 30000 });
    await expect(learner.locator('.stage-reply .completion-number')).toHaveText(['10', '10', '0']);
    await expect(learner.locator('#starCount')).toHaveText('1');
  } finally { await first.context.close(); await second?.context.close(); }
});

test('语法新版真实账号全程：五星同步、跨设备、纪念册、离线续练与重进核验', async ({ page, browser, browserName }, info) => {
  test.setTimeout(180000);
  const base = process.env.AWARD_TEST_BASE || '/lesson/';
  await adminLogin(page, base);
  const account = await createStudent(page, '语法独立验收班', '小雨', [/Lesson 3–4/]);
  const first = await studentLogin(browser, account, base); let second;
  try {
    const learner = first.page, errors = [], voices = [];
    learner.on('pageerror', e => errors.push(e.message));
    learner.on('request', r => { if (/\/audio\/|\/tts(?:\/|\?)/.test(r.url())) voices.push(r.url()); });
    await completeUnit34(learner, base.slice(0, -1));
    await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await expect(learner.locator('#certificateName')).toHaveText('小雨');
    const date = await learner.locator('#certificateDate').textContent();
    await learner.getByRole('link', { name: '我的纪念册', exact: true }).click();
    const card = learner.getByRole('button', { name: '查看并保存纪念卡：Lesson 3–4 认领小达人', exact: true });
    await expect(card.locator('.certificate')).toHaveAttribute('data-stars', '5');
    await card.click();
    const modal = learner.getByRole('dialog', { name: 'Lesson 3–4 纪念卡' });
    await expect(modal).toContainText('小雨');
    await expect(modal.locator('.certificate')).toHaveAttribute('data-stars', '5');
    await learner.getByRole('button', { name: '关闭纪念卡', exact: true }).click();
    second = await studentLogin(browser, account, base);
    await expect(second.page.locator('.course')).toContainText('5 / 5');
    await second.page.goto(base + 'unit3-4/#learn/certificate');
    await expect(second.page.locator('#wordPageProgress')).toBeVisible({ timeout: 30000 });
    await expect(second.page.locator('#certificateDate')).toHaveText(date);
    await second.page.goto(base + 'unit3-4/#learn/reply');
    await expect(second.page.locator('#wordPageProgress')).toBeVisible({ timeout: 30000 });
    await expect(second.page.locator('.stage-reply .completion-number')).toHaveText(['10', '10', '0']);
    await second.page.locator('.stage-reply').getByRole('button', { name: '再练一轮', exact: true }).click();
    const room = second.page.locator('.stage-reply');
    await expect(room.getByRole('region', { name: '短示范' })).toBeVisible();
    await expect(room.locator('.progress-copy')).toHaveText('第 1 / 10 题');
    await expect(second.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    const workerState = await second.page.evaluate(async () => ({
      supported: 'serviceWorker' in navigator,
      controlled: Boolean(navigator.serviceWorker?.controller),
      registrations: (await navigator.serviceWorker?.getRegistrations() || []).map(r => ({ scope: r.scope, state: r.active?.state }))
    }));
    await require('fs/promises').writeFile(info.outputPath('worker-state.json'), JSON.stringify(workerState, null, 2));
    await second.context.setOffline(true);
    await room.getByRole('button', { name: 'This is not my coat.', exact: true }).click();
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await room.getByRole('button', { name: '下一题', exact: true }).click();
    await expect(room.locator('.progress-copy')).toHaveText('第 2 / 10 题');
    await expect(second.page.locator('#studentSyncStatus')).toContainText('本机');
    let nativeNavigationFailure = false;
    try { await second.page.reload(); }
    catch (error) {
      // Windows Playwright WebKit rejects the offline navigation before the
      // Worker fallback can replace the document. The original open lesson
      // remains. Diagnose that boundary separately; never call it a new entry.
      if (browserName !== 'webkit' || !String(error).includes('WebKit encountered an internal error')) throw error;
      nativeNavigationFailure = true;
      await expect(room.locator('.progress-copy')).toHaveText('第 2 / 10 题');
      info.annotations.push({ type: 'offline-navigation', description: 'WebKit native navigation rejected; existing document retained; Worker fallback page not verified.' });
    }
    if (nativeNavigationFailure) {
      // Independently reach the application's entry-verification failure path
      // with a real failed request, then recover the same local answer record.
      const entry = base + 'api/courses/unit3-4/enter'; let rejected = 0;
      second.page.on('response', response => { if (new URL(response.url()).pathname === entry && response.status() === 503) rejected++; });
      // A controller can own these requests; page.route is not a reliable
      // injection boundary. Fail the actual test-server HTTP response instead.
      await courseResponse(page, entry, { status: 503, json: { error: 'Temporary test entry failure' } });
      try {
        await second.context.setOffline(false);
        await second.page.goto(base + 'unit3-4/#learn/reply');
        await expect(second.page.getByRole('alertdialog', { name: '课程访问', exact: true })).toBeVisible();
        expect(rejected).toBeGreaterThan(0); await expect(room).toHaveCount(0);
      } finally { await courseResponse(page, entry, null); }
      await second.page.locator('#accessGate').getByRole('button', { name: '再试一次', exact: true }).click();
    } else {
      await expect(second.page.getByRole('heading', { name: '联网后再进入', exact: true })).toBeVisible();
      await expect(room).toHaveCount(0);
      await second.context.setOffline(false);
      await second.page.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    await expect(second.page.locator('#wordPageProgress')).toBeVisible({ timeout: 30000 });
    await expect(room.locator('.progress-copy')).toHaveText('第 2 / 10 题');
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await expect(second.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await expect.poll(() => room.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    expect(errors).toEqual([]); expect(voices).toEqual([]);
  } finally { await first.context.close(); await second?.context.close(); }
});
