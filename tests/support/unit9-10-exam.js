'use strict';
const { expect } = require('@playwright/test');
// Independent manuscript: textbook PDF 51–54 and the v2.1 coverage table.
// These answers never come from the application question definitions.
const EXAM = [
  { prompt: 'Tony is very well, thanks.', answer: 'Tony · fine', wrong: 'Tony · cold' },
  { prompt: 'Steven isn’t cold.', answer: '他不觉得冷' },
  { prompt: '这把伞沾了泥', answer: ['Look at', 'that umbrella.', "It's", 'dirty.'] },
  { prompt: 'How ___ you today?', answer: 'are / is' },
  { prompt: 'Helen 说', answer: "I'm fine, thanks." },
  { prompt: '接着向他道别', answer: 'Nice to see you, too. Goodbye.' },
  { prompt: "Mr. Blake isn't a student.", answer: "He's / She's / It's" },
  { prompt: 'Look at that hairdresser.', answer: "He's busy." },
  { prompt: '请朋友看看 Helen', answer: ['Look', 'at', 'Helen.', "She's", 'very well.'] },
  { prompt: "How's Emma? She's very well.", answer: 'How is / She is' }
];
async function selectAnswer(room, answer) {
  if (Array.isArray(answer)) for (const token of answer) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  else await room.locator('.practice-options').getByRole('button', { name: answer, exact: true }).click();
}
async function finishExamFrom(page, start = 0) {
  const room = page.locator('.stage-exam');
  for (let i = start; i < EXAM.length; i++) {
    await expect(room.locator('.practice-content h3')).toContainText(EXAM[i].prompt);
    await selectAnswer(room, EXAM[i].answer);
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
    await room.getByRole('button', { name: i === EXAM.length - 1 ? '查看本次记录' : '下一题', exact: true }).click();
  }
}
module.exports = { EXAM, selectAnswer, finishExamFrom };
