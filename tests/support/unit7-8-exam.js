'use strict';
const { expect } = require('@playwright/test');
// Independent expectations from the reviewed Lesson 7–8 challenge manuscript.
// Never read the course's answer fields to solve the learner page.
const EXAM = [
  { prompt: "I'm Italian. I'm a nurse.", answer: '意大利人；护士', wrong: '法国人；护士' },
  { prompt: 'She is a mechanic.', answer: 'Are you a mechanic?', wrong: 'Is she a mechanic?' },
  { prompt: '你扮演 Ben，职业是工程师。', answer: ['My', "name's", 'Ben.', "I'm", 'an engineer.'] },
  { prompt: '先问对方国籍，再问职业。', answer: ['What nationality', 'are', 'you?', "What's", 'your', 'job?'] },
  { prompt: "Sophie: I'm French. I'm not Italian.", answer: "No, I'm not.", wrong: 'Yes, I am.' },
  { prompt: '向 Ben 询问两位不在场朋友的职业。', answer: 'his / her', wrong: 'your / your' },
  { prompt: '把 Ben 的三句话补完整。', answer: 'am / is / Are', wrong: 'is / am / Are' },
  { prompt: "Sophie: I'm a keyboard operator.", answer: 'Yes, she is.', wrong: 'Yes, I am.' },
  { prompt: '两位朋友各自介绍职业：', answer: 'an / a', wrong: 'a / an' },
  { prompt: "My name's Ben. I'm an engineer. What's your job?", answer: 'name is / I am / What is', wrong: 'name am / I am / What is' }
];
async function selectAnswer(room, answer) {
  if (Array.isArray(answer)) {
    for (const token of answer) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  } else await room.locator('.practice-options').getByRole('button', { name: answer, exact: true }).click();
}
async function finishExamFrom(page, start = 0) {
  const room = page.locator('.stage-exam');
  for (let i = start; i < EXAM.length; i++) {
    await expect(room.locator('.practice-content h3')).toContainText(EXAM[i].prompt);
    await selectAnswer(room, EXAM[i].answer);
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
    await room.getByRole('button', { name: i === 9 ? '查看本次记录' : '下一题', exact: true }).click();
  }
}
module.exports = { EXAM, selectAnswer, finishExamFrom };
