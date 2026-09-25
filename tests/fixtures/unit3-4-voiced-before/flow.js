'use strict';
const { expect } = require('@playwright/test');
// Independent literal expectations from textbook pages 6–9 and the reviewed
// question manuscript. Never import the application's questions/answer fields.
const DIALOGUE = [
  'My coat and my umbrella please.', 'Here is my ticket.', 'Thank you, sir.',
  'Number five.', "Here's your umbrella and your coat.", 'This is not my umbrella.',
  'Sorry, sir.', 'Is this your umbrella?', "No, it isn't.", 'Is this it?',
  'Yes, it is.', 'Thank you very much.'
];
const ANSWERS = {
  listen: ['umbrella', 'ticket', 'suit', 'school', 'teacher', 'son', 'daughter'],
  roles: ['外套和雨伞', '五号', '雨伞', '客人的', '是不是客人的雨伞', '找回了'],
  manners: ['This is not my umbrella.', 'Sorry, sir.', "No, it isn't.", 'Yes, it is.'],
  ask: ['Is this your teacher?'],
  reply: [
    '你的', 'your',
    ['No.', "It isn't", 'my coat.', "It's", 'your coat.'], "No, it isn't."
  ],
  trans: [['This', 'is', 'not', 'my', 'umbrella.'], ["It's", 'your', 'book.']],
  exam: ['school', 'Sorry, sir. Is this your umbrella?', '外套是我的；雨伞主人还不知道']
};
async function completeStory(page) {
  await page.goto('/unit3-4/#learn/text');
  const room = page.getByRole('region', { name: '衣帽间小剧场', exact: true });
  for (let i = 0; i < DIALOGUE.length; i++) {
    await room.getByRole('button', { name: i ? '下一句' : '开始听课文', exact: true }).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0, i + 1));
    await expect(room.getByRole('button', { name: i === 11 ? '完成课文学习' : '下一句', exact: true })).toBeEnabled({ timeout: 10000 });
  }
  await room.getByRole('button', { name: '完成课文学习', exact: true }).click();
  await expect(room).toContainText('故事听完了！');
}
async function completeActivity(page, id, { exerciseRecovery = false } = {}) {
  await page.goto('/unit3-4/#learn/' + id);
  const room = page.locator('.stage-' + id), answers = ANSWERS[id];
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i], check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i));
    await expect(check).toBeDisabled();
    if (id === 'listen' || (id === 'reply' && i === 0) || (id === 'exam' && i === 0)) await room.getByRole('button', { name: '听一遍', exact: true }).click();
    if (Array.isArray(answer)) {
      const bank = room.getByRole('group', { name: '待选词块', exact: true });
      for (const word of answer) await bank.getByRole('button', { name: word, exact: true }).click();
    } else await room.locator('.practice-options').getByRole('button', { name: answer, exact: true }).click();
    await expect(check).toBeEnabled({ timeout: 10000 });
    if (exerciseRecovery && i === 0 && id === 'exam') {
      await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).click();
      await page.reload();
      await room.getByRole('button', { name: '继续挑战', exact: true }).click();
      await expect(room.getByRole('button', { name: answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
      // Refresh must require the recorded listening evidence again.
      const replay = room.getByRole('button', { name: /^(听一遍|再听一遍)$/ });
      if (await check.isDisabled()) await replay.click();
    }
    await check.click();
    await expect(room.getByRole('status')).toContainText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    if (exerciseRecovery && id === 'listen' && i === 6) {
      await page.reload();
      await expect(room.getByRole('status')).toContainText('答对了！');
    }
    await room.getByRole('button', { name: i === answers.length - 1 ? (id === 'exam' ? '查看本次记录' : '完成这一站') : '下一题', exact: true }).click();
  }
  await expect(room.getByRole('button', { name: '再练一轮', exact: true })).toBeVisible();
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
}
async function completeUnit34(page) {
  await completeActivity(page, 'listen', { exerciseRecovery: true });
  await completeStory(page);
  for (const id of ['roles', 'manners', 'ask', 'trans', 'reply', 'exam']) await completeActivity(page, id, { exerciseRecovery: true });
  await page.goto('/unit3-4/#learn/certificate');
  await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports = { DIALOGUE, ANSWERS, completeStory, completeActivity, completeUnit34 };
