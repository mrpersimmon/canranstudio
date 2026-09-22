'use strict';
const { test, expect } = require('@playwright/test');
const { submitSubject } = require('../support/l49-subject-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 7000 });

// Literal expectations from the revised teaching manuscript. No runtime answer imports.
async function choose(room, answer, next = '下一题') {
  if (Array.isArray(answer)) {
    for (const token of answer) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  } else await room.locator('.practice-options').getByRole('button', { name: answer, exact: true }).click();
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  await expect(check).toBeEnabled({ timeout: 12000 });
  await check.click();
  await expect(room.getByRole('status')).toContainText('答对了！');
  if (next) await room.getByRole('button', { name: next, exact: true }).click();
}

test('Lesson 1–2 用一次提问应用和四个综合任务取代换词长队列', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/unit1-2/#learn/ask');
  const ask = page.locator('.stage-ask');
  await expect(ask.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '1');
  await expect(ask.getByRole('heading', { name: '想问同学这支钢笔是不是他的，应该说什么？', exact: true })).toBeVisible();
  await choose(ask, 'Is this your pen?', '完成这一站');
  await expect(ask.getByRole('button', { name: '下一站：词块拼装台', exact: true })).toBeVisible();

  await page.goto('/unit1-2/#learn/exam');
  const exam = page.locator('.stage-exam');
  await expect(exam.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4');
  await exam.getByRole('button', { name: 'car', exact: true }).click();
  await expect(exam.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await exam.getByRole('button', { name: '听一遍', exact: true }).click();
  await choose(exam, 'car');
  await expect(exam).toContainText('Excuse me!');
  await exam.getByRole('button', { name: 'Yes, it is.', exact: true }).click();
  await exam.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(exam.getByRole('status')).toHaveText('再看看，试一次。');
  await exam.getByRole('button', { name: '再试一次', exact: true }).click();
  await choose(exam, 'Yes?');
  await expect(exam).toContainText('Pardon?');
  await choose(exam, 'Is this your handbag?');
  await expect(exam).toContainText('书确实是你的');
  await exam.screenshot({ path: 'output/playwright/unit-dedup/unit12-combined-320.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await choose(exam, 'Yes, it is. Thank you very much.', '查看本次记录');
  await expect(exam).toContainText('首次独立答对 3 / 4');
  await expect(exam.getByRole('button', { name: '下一站：我的单元证书', exact: true })).toBeVisible();
});

test('Lesson 3–4 先拼句再接力，四项接力和三题挑战不重复刷肯定回答', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/unit3-4/#learn/listen');
  await expect(page.locator('.stage-listen').getByRole('progressbar')).toHaveAttribute('aria-valuemax', '7');
  await page.goto('/unit3-4/#learn/ask');
  const ask = page.locator('.stage-ask');
  await expect(ask.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '1');
  await choose(ask, 'Is this your teacher?', '完成这一站');
  await ask.getByRole('button', { name: '下一站：词块拼装台', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/trans$/);
  const trans = page.locator('.stage-trans');
  await expect(trans.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '2');
  await choose(trans, ['This', 'is', 'not', 'my', 'umbrella.']);
  await choose(trans, ["It's", 'your', 'book.'], '完成这一站');
  await trans.getByRole('button', { name: '下一站：你我的接力', exact: true }).click();
  const reply = page.locator('.stage-reply');
  await expect(reply.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4');
  await reply.getByRole('button', { name: '听一遍', exact: true }).click();
  await choose(reply, '你的');
  await expect(reply).toContainText('换同学对你说');
  await choose(reply, 'your');
  await choose(reply, ['No.', "It isn't", 'my coat.', "It's", 'your coat.']);
  await expect(reply).toContainText('不知道是谁的');
  await choose(reply, "No, it isn't.", '完成这一站');
  await reply.getByRole('button', { name: '下一站：认领小挑战', exact: true }).click();
  const exam = page.locator('.stage-exam');
  await expect(exam.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '3');
  await exam.getByRole('button', { name: '听一遍', exact: true }).click();
  await choose(exam, 'school');
  await choose(exam, 'Sorry, sir. Is this your umbrella?');
  await expect(exam).toContainText('Here is my coat. This is not my umbrella.');
  await exam.getByRole('button', { name: '外套是我的；雨伞是工作人员的', exact: true }).click();
  await exam.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(exam.getByRole('status')).toHaveText('再看看，试一次。');
  await exam.getByRole('button', { name: '再试一次', exact: true }).click();
  await exam.screenshot({ path: 'output/playwright/unit-dedup/unit34-evidence-390.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await choose(exam, '外套是我的；雨伞主人还不知道', '查看本次记录');
  await expect(exam).toContainText('首次独立答对 2 / 3');
});

test('Lesson 49–50 区分本次需求和喜好，分拣错题就地重试，五题挑战需要综合判断', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/unit49-50/#learn/doare');
  const asking = page.locator('.stage-doare');
  await expect(asking.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
  for (const answer of ['Do you like meat?', 'Are you a teacher?', 'Does Penny like tomatoes?', 'Do you like peas?']) await choose(asking, answer);
  await expect(asking).toContainText('今天要不要桃子');
  await expect(asking).toContainText('问 Sam');
  await asking.getByRole('button', { name: 'Does she like peaches?', exact: true }).click();
  await asking.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(asking.getByRole('status')).toHaveText('再看看，试一次。');
  await asking.getByRole('button', { name: '再试一次', exact: true }).click();
  await choose(asking, 'Does she want peaches?', '完成这一站');

  await page.goto('/unit49-50/#learn/subjects');
  const subjects = page.locator('.stage-subjects');
  await expect(subjects.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '11');
  const base = ['第三人称单数', '第三人称复数', '第三人称单数', '第一人称', '第二人称', '第三人称单数', '第三人称复数', '第一人称', '第三人称复数', '第三人称单数'];
  for (const answer of base) await submitSubject(subjects, answer);
  await expect(subjects.getByRole('heading', { name: 'they', exact: true })).toBeVisible();
  await submitSubject(subjects, '第一人称', false);
  await expect(subjects.getByRole('status')).toHaveText('再看看，试一次。');
  await subjects.getByRole('button', { name: '再试一次', exact: true }).click();
  await expect(subjects).toContainText('第 11 / 11 题');
  await expect(subjects.getByRole('heading', { name: 'they', exact: true })).toBeVisible();
  await expect(subjects.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.reload();
  await expect(subjects).toContainText('第 11 / 11 题');
  await submitSubject(subjects, '第三人称复数');
  await expect(subjects).toContainText('基础题首次答对 10 / 11');

  await page.goto('/unit49-50/#learn/exam');
  const exam = page.locator('.stage-exam');
  await expect(exam.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '5');
  await exam.getByRole('button', { name: '听一遍', exact: true }).click();
  await choose(exam, 'mince');
  await choose(exam, 'Mrs. Bird: lamb · husband: steak');
  await expect(exam).toContainText('Penny:');
  await choose(exam, 'cabbage');
  await expect(exam).toContainText('B 喜欢鸡肉');
  await exam.getByRole('button', { name: 'I like chicken, too.', exact: true }).click();
  await exam.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(exam.getByRole('status')).toHaveText('再看看，试一次。');
  await exam.getByRole('button', { name: '再试一次', exact: true }).click();
  await choose(exam, 'I like chicken.');
  await expect(exam).toContainText("Sam doesn't likes grapes.");
  await exam.screenshot({ path: 'output/playwright/unit-dedup/unit4950-edit-320.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await choose(exam, 'likes 改为 like', '查看本次记录');
  await expect(exam).toContainText('首次独立答对 4 / 5');
  await expect(exam.getByRole('button', { name: /继续第二段/ })).toHaveCount(0);
});

async function priorEdition(page, unit) {
  let prior = true;
  // Freeze the real pre-change question edition at the HTTP boundary. Progress
  // is earned through learner controls, never injected into local storage.
  await page.route('**/' + unit + '/content.js*', route => prior
    ? route.fulfill({ path: require('node:path').join(__dirname, '../fixtures/unit-dedup-before', unit + '.js'), contentType: 'text/javascript', headers: { 'cache-control': 'no-store' } })
    : route.continue());
  // Fast state-transition setup only; native audio is covered by the tests above.
  await page.addInitScript(() => {
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; }
      play() { queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() {}
    };
  });
  return () => { prior = false; };
}
async function priorGroup(page, unit, activity, answers) {
  await page.goto('/' + unit + '/#learn/' + activity);
  const room = page.locator('.stage-' + activity);
  for (let i = 0; i < answers.length; i++) {
    const hear = room.getByRole('button', { name: '听一遍', exact: true });
    if (await hear.count()) await hear.click();
    await choose(room, answers[i], i === answers.length - 1 ? (activity === 'exam' ? '查看本次记录' : '完成这一站') : '下一题');
  }
}
async function priorStory(page, unit, count) {
  await page.goto('/' + unit + '/#learn/text');
  const room = page.locator('.stage-text');
  await room.getByRole('button', { name: '开始听课文', exact: true }).click();
  for (let i = 1; i < count; i++) await room.getByRole('button', { name: '下一句', exact: true }).click();
  await room.getByRole('button', { name: '完成课文学习', exact: true }).click();
}
async function expectFresh(page, unit, activity, count) {
  await page.goto('/' + unit + '/#learn/' + activity);
  const room = page.locator('.stage-' + activity);
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', String(count));
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(room.locator('button[aria-pressed="true"]')).toHaveCount(0);
}

test('Lesson 1–2 升级只重开旧提问和挑战，未改拼句保留完成', async ({ page }) => {
  const upgrade = await priorEdition(page, 'unit1-2');
  await priorGroup(page, 'unit1-2', 'ask', ['Is this your pen?', 'Is this your pencil?', 'Is this your book?', 'Is this your watch?', 'Is this your coat?', 'Is this your dress?', 'Is this your skirt?', 'Is this your shirt?', 'Is this your car?', 'Is this your house?']);
  await priorGroup(page, 'unit1-2', 'trans', [['Is', 'this', 'your', 'pen?'], ['Yes,', 'it', 'is.'], ['Thank', 'you', 'very', 'much.']]);
  await priorGroup(page, 'unit1-2', 'exam', ['pencil', 'Pardon?', 'Is this your dress?', 'Yes, it is.', '对面的同学', 'car', ['Is', 'this', 'your', 'house?'], 'Thank you very much.']);
  await expect(page.locator('#starCount')).toHaveText('6');
  upgrade();
  await page.reload();
  await expectFresh(page, 'unit1-2', 'ask', 1);
  await expectFresh(page, 'unit1-2', 'exam', 4);
  await page.goto('/unit1-2/#learn/trans');
  await expect(page.locator('.stage-trans').getByRole('button', { name: '再练一轮', exact: true })).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('1');
});

test('Lesson 3–4 升级旧五题接力和拼句后重新作答，课文与理解记录保留', async ({ page }) => {
  const upgrade = await priorEdition(page, 'unit3-4');
  await priorStory(page, 'unit3-4', 12);
  await priorGroup(page, 'unit3-4', 'roles', ['外套和雨伞', '五号', '雨伞', '客人的', '是不是客人的雨伞', '找回了']);
  await priorGroup(page, 'unit3-4', 'ask', ['Is this your suit?', 'Is this your school?', 'Is this your teacher?', 'Is this your son?', 'Is this your daughter?']);
  await priorGroup(page, 'unit3-4', 'trans', [['This', 'is', 'not', 'my', 'umbrella.'], ['No,', 'it', "isn't."], ['It', "isn't", 'my', 'book.'], ["It's", 'your', 'book.']]);
  await priorGroup(page, 'unit3-4', 'reply', ['你的', 'Yes, it is.', 'your', ['No.', "It isn't", 'my coat.', "It's", 'your coat.'], "No, it isn't."]);
  await expect(page.locator('#starCount')).toHaveText('6');
  upgrade();
  await page.reload();
  for (const [activity, count] of [['ask', 1], ['trans', 2], ['reply', 4]]) await expectFresh(page, 'unit3-4', activity, count);
  await page.goto('/unit3-4/#learn/roles');
  await expect(page.locator('.stage-roles').getByRole('button', { name: '再练一轮', exact: true })).toBeVisible();
  await expect(page.locator('.stage-text')).toContainText('故事听完了！');
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('Lesson 49–50 旧理解、问句、分类与挑战不代答新版，交接活动保留', async ({ page }) => {
  test.setTimeout(60000);
  const upgrade = await priorEdition(page, 'unit49-50');
  await priorStory(page, 'unit49-50', 11);
  await priorGroup(page, 'unit49-50', 'roles', ['steak', 'Beef, please.', "To tell you the truth, Mrs. Bird, I don't like chicken either.", 'Lamb, please.', 'I like steak, too.']);
  await priorGroup(page, 'unit49-50', 'give', ['Mrs. Bird', 'that piece', 'Give that piece to me, please.', ['Give', 'that piece', 'to', 'me,', 'please.']]);
  await priorGroup(page, 'unit49-50', 'doare', ['Do you like meat?', 'Are you a teacher?', 'Do you want beef?', 'Does Penny like tomatoes?', 'Do you like peas?', 'Does she want peaches?']);
  await page.goto('/unit49-50/#learn/subjects');
  for (const answer of ['第三人称单数', '第三人称复数', '第三人称单数', '第三人称单数', '第一人称', '第二人称', '第三人称单数', '第三人称复数', '第一人称', '第三人称复数', '第三人称单数', '第三人称复数']) await submitSubject(page.locator('.stage-subjects'), answer);
  await priorGroup(page, 'unit49-50', 'exam', ['mince', 'Mrs. Bird: lamb · husband: steak', ['Give', 'the beef', 'to', 'Lily,', 'please.'], "I don't like lamb either.", 'pear', "Tom likes beans, but he doesn't want any.", 'Does she like peaches?', 'am not', 'like', ['He', "doesn't", 'want', 'any peas.']]);
  upgrade();
  await page.reload();
  for (const [activity, count] of [['roles', 4], ['doare', 5], ['subjects', 11], ['exam', 5]]) await expectFresh(page, 'unit49-50', activity, count);
  await page.goto('/unit49-50/#learn/give');
  await expect(page.locator('.stage-give').getByRole('button', { name: '再练一轮', exact: true })).toBeVisible();
  await page.goto('/unit49-50/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
});
