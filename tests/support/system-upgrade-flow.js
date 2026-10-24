'use strict';
const { expect } = require('@playwright/test');
const first = require('./thirteen-types-flow');
const paired = require('./units1-30-tasks');
const { dismissRewardDialog } = require('./reward-dialog');

async function ready(page) {
  await expect(page.locator('#courseLoader')).toHaveCount(0, { timeout: 30000 });
  await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing', '');
  await expect(page.locator('html')).not.toHaveAttribute('data-course-painting', '');
  await expect(page.locator('#wordPageProgress')).toBeVisible({ timeout: 30000 });
}
async function waitSynced(page) {
  await expect(page.locator('#studentSyncStatus')).toHaveText(/^(已同步|学习成果已同步)$/, { timeout: 15000 });
}
async function fullCourse(page, pair, base = '') {
  const flow = pair === '1-2' ? first : paired;
  await flow.story(page, pair, base);
  const zones = pair === '1-2' ? ['listen', 'roles', 'manners', 'trans', 'exam'] : ['listen', 'roles', 'manners', 'reply', 'exam'];
  for (const [index, zone] of zones.entries()) {
    await flow.activity(page, pair, zone, { base, keepAward: true });
    const reveal = page.getByRole('dialog', { name: /纪念卡结算/ });
    await expect(reveal.getByRole('group', { name: `已获得 ${index + 1} / 5 颗星`, exact: true })).toBeVisible();
    await dismissRewardDialog(page);
    await waitSynced(page);
  }
  await page.goto(base + '/unit' + pair + '/#learn/certificate'); await ready(page);
  await expect(page.locator('#starCount')).toHaveText('5');
  await expect(page.locator('#certificateDate')).toBeVisible();
  await waitSynced(page);
  const response = await page.request.get(base + '/api/awards'); expect(response.status()).toBe(200);
  const card = (await response.json()).cards.find(card => card.course === 'unit' + pair && card.stars === 5);
  expect(card).toBeTruthy();
  return { course: 'unit' + pair, edition: card.edition, issuedAt: card.firstFullStarAt,
    name: await page.locator('#certificateName').textContent(), displayedDate: await page.locator('#certificateDate').textContent() };
}
async function partialCourse(page, base = '') {
  await paired.activity(page, '5-6', 'listen', { base, keepAward: true });
  const reveal = page.getByRole('dialog', { name: /纪念卡结算/ });
  await expect(reveal.getByRole('group', { name: '已获得 1 / 5 颗星', exact: true })).toBeVisible();
  await dismissRewardDialog(page); await waitSynced(page);
  await page.goto(base + '/unit5-6/#learn/introduce'); await ready(page);
  const room = page.locator('.stage-introduce');
  await paired.select(room, paired.answers('5-6', 'introduce')[0].answer);
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.locator('.progress-copy')).toContainText('第 2 /');
  return { course: 'unit5-6', stars: 1, draftQuestion: 2 };
}
async function seedBeforeUpgrade(page, base = '') {
  const certificates = [await fullCourse(page, '1-2', base), await fullCourse(page, '3-4', base)];
  const partial = await partialCourse(page, base);
  return { certificates, partial };
}
async function finishOpenCarsOffline(page) {
  const room = page.locator('.stage-cars'), answers = paired.answers('5-6', 'cars');
  for (const [index, question] of answers.entries()) {
    await expect(room.locator('.progress-copy')).toHaveText(`第 ${index + 1} / ${answers.length} 题`);
    await paired.select(room, question.answer);
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
    await room.getByRole('button', { name: index === answers.length - 1 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(page.getByRole('dialog', { name: /纪念卡结算/ })).not.toBeVisible();
  await expect(page.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state', 'retry');
  return page.evaluate(() => {
    const access = CanranStudentAccess, prefix = CanranSystemUpgrade.namespace(access.student.id, access.systemUpgrade);
    return JSON.parse(localStorage.getItem(prefix + 'pending:unit5-6'));
  });
}
module.exports = { ready, waitSynced, fullCourse, partialCourse, seedBeforeUpgrade, finishOpenCarsOffline };
