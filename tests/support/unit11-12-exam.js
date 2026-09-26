'use strict';
const { expect } = require('@playwright/test');
// Independent answers: textbook PDF 55–58 and the v2.1 coverage manuscript.
const EXAM = [
 { prompt: "This is my brother's pen.", answer: 'my brother · pen', wrong: 'my sister · pen' },
 { prompt: 'Dave 这样说', answer: '请 Tim 确认' },
 { prompt: 'This is ___ pen.', answer: 'her' },
 { prompt: '手边', answer: 'Whose is this handbag?' },
 { prompt: '依次补好', answer: 'my / your' },
 { prompt: '父亲', answer: "father's / his" },
 { prompt: "Tim's shirt's white.", answer: "Tim's shirt is white." },
 { prompt: '分别问', answer: 'Dave: No, sir. / Tim: Yes, sir.' },
 { prompt: '远处', answer: ['Whose', 'shirt', 'is', 'that?'] },
 { prompt: '归还', answer: '老师：Here you are. / Tim：Thank you, sir.' }
];
async function selectAnswer(room, answer) {
 if (Array.isArray(answer)) for (const token of answer) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
 else await room.locator('.practice-options').getByRole('button', { name: answer, exact: true }).click();
}
async function finishExamFrom(page, start = 0) {
 const room = page.locator('.stage-exam');
 for (let i = start; i < EXAM.length; i++) {
  await expect(room.locator('.claim-task-heading')).toContainText(EXAM[i].prompt);
  await selectAnswer(room, EXAM[i].answer);
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: i === 9 ? '查看本次记录' : '下一题', exact: true }).click();
 }
}
module.exports = { EXAM, selectAnswer, finishExamFrom };
