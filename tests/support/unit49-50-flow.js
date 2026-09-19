'use strict';
const { expect } = require('@playwright/test');
const { subjectAnswers, submitSubject } = require('./l49-subject-flow');

// Fixed expectations transcribed from the approved unit. Setup earns a real
// browser session through the learner flow, without fabricating completion.
async function completeUnit(page, { basePath = '/' } = {}) {
  await page.addInitScript(() => {
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; }
      play() { queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() {}
    };
  });
  const answer = async (room, value, next) => {
    if (Array.isArray(value)) {
      for (const token of value) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
    } else await room.locator('.practice-options').getByRole('button', { name: value, exact: true }).click();
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.getByRole('status').filter({ hasText: '答对了！' })).toBeVisible();
    await room.getByRole('button', { name: next, exact: true }).click();
  };
  const group = async (id, values, audioAt = [], final = '完成这一站') => {
    await page.goto(basePath + 'unit49-50/#learn/' + id);
    const room = page.locator('.stage-' + id);
    for (let i = 0; i < values.length; i++) {
      if (audioAt.includes(i)) await room.getByRole('button', { name: '听一遍', exact: true }).click();
      await answer(room, values[i], i === values.length - 1 ? final : '下一题');
      if (id === 'exam' && i === 4) await room.getByRole('button', { name: '继续第二段（5 题）', exact: true }).click();
    }
  };
  const words = ['butcher', 'meat', 'beef', 'lamb', 'mutton', 'steak', 'mince', 'chicken', 'pork', 'fish', 'husband', 'tell', 'truth', 'either', 'tomato', 'potato', 'cabbage', 'lettuce', 'pea', 'bean', 'pear', 'grape', 'peach'];
  await group('listen', words, words.map((word, index) => index));
  await page.goto(basePath + 'unit49-50/#learn/text');
  const story = page.locator('.stage-text');
  await story.getByRole('button', { name: '开始听课文', exact: true }).click();
  for (let i = 1; i < 11; i++) await story.getByRole('button', { name: '下一句', exact: true }).click();
  await story.getByRole('button', { name: '完成课文学习', exact: true }).click();
  await group('roles', ['steak', 'Beef, please.', "To tell you the truth, Mrs. Bird, I don't like chicken either.", 'Lamb, please.', 'I like steak, too.']);
  await group('doare', ['Do you like meat?', 'Are you a teacher?', 'Do you want beef?', 'Does Penny like tomatoes?', 'Do you like peas?', 'Does she want peaches?']);
  await group('give', ['Mrs. Bird', 'that piece', 'Give that piece to me, please.', ['Give', 'that piece', 'to', 'me,', 'please.']]);
  await group('needs', ["She likes tomatoes, but she doesn't want any.", "I like potatoes, but I don't want any.", 'Yes, he does.', "No, I don't."]);
  await group('pouch', ['To tell you the truth']);
  await group('either', ['I like steak, too.', "I don't like chicken either.", 'I am not at home either.']);
  await page.goto(basePath + 'unit49-50/#learn/subjects');
  for (const value of subjectAnswers) await submitSubject(page.locator('.stage-subjects'), value);
  await group('fill', ['likes', 'like', 'watches', 'goes']);
  await group('choice', ["don't", "doesn't", "isn't", "can't", "aren't", 'am not']);
  await group('trans', [['She', 'likes', 'peaches.'], ['She', "doesn't", 'want', 'any tomatoes.'], ['Does', 'he', 'like', 'grapes?']]);
  await group('exam', ['mince', 'Mrs. Bird: lamb · husband: steak', ['Give', 'the beef', 'to', 'Lily,', 'please.'], "I don't like lamb either.", 'pear', "Tom likes beans, but he doesn't want any.", 'Does she like peaches?', 'am not', 'like', ['He', "doesn't", 'want', 'any peas.']], [0, 4], '查看本次记录');
  await page.goto(basePath + 'unit49-50/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeEnabled();
}
module.exports = { completeUnit };
