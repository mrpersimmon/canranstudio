'use strict';
const { expect } = require('@playwright/test');
// Independent manuscript: textbook paper pages 2–13 and the reviewed coverage
// matrix. No application answer table is consulted by these page walkthroughs.
const EXAMS = {
  '1-2': [
    { prompt: '女士先怎样回应招呼？', answer: 'Yes?', wrong: 'Yes, it is.' },
    { prompt: '你先确认，再感谢', answer: 'Yes, it is. Thank you very much.' },
    { prompt: '这两句里的 your 和 it 分别指什么？', answer: 'your 指女士的；it 指手提包' },
    { prompt: '没听清同学刚说的话', answer: 'Pardon?' },
    { prompt: '同学正要走开', answer: 'Excuse me!' },
    { prompt: 'Is this your pencil?', answer: '铅笔' },
    { prompt: '这是你的外套吗？', answer: ['Is', 'this', 'your', 'coat?'] },
    { prompt: '听问句，选出正在询问的物品。', answer: '房子', audio: true }
  ],
  '3-4': [
    { prompt: '向这位男士道歉', answer: 'Sorry, sir. Is this your umbrella?', wrong: 'Number five. Here is my ticket.' },
    { prompt: '哪张记录有依据？', answer: '外套是我的；雨伞主人还不知道' },
    { prompt: '这位是你的老师吗？', answer: 'Is this your teacher?' },
    { prompt: '为这位客人选一张认领记录。', answer: '五号：外套和雨伞' },
    { prompt: '出示你自己的寄存牌', answer: ['Here', 'is', 'my', 'ticket.'] },
    { prompt: '书是对面同学的', answer: ['No.', 'It', "isn't", 'my book.', "It's", 'your book.'] },
    { prompt: '工作人员把寄存牌递回给你', answer: 'your' },
    { prompt: '最后一句在问什么？怎样回答？', answer: '问雨伞；Yes, it is.' },
    { prompt: "Here's your ticket. It isn't my umbrella. It's your umbrella.", answer: 'Here is / is not / It is' }
  ],
  '5-6': [
    { prompt: '哪份记录符合？', answer: 'Hans 是德国人；汽车是日本品牌', wrong: 'Hans 和汽车都是德国的' },
    { prompt: '早晨向班里介绍 Hans', answer: ['Good morning.', 'This is', 'Hans.', "He's", 'a German', 'student.'] },
    { prompt: '现在可以确定什么？', answer: '这是一位新同学' },
    { prompt: '哪一句直接表达“很高兴见到你”？', answer: 'Nice to meet you.' },
    { prompt: 'Ben is German, too.', answer: 'Ben 和 Hans 都是德国人' },
    { prompt: '接着介绍 Hans、Sophie 和她的汽车', answer: 'He / She / It' },
    { prompt: '依次补好三个空。', answer: '不填 / a / an' },
    { prompt: 'What make is it?', answer: "It's a Volvo. / It's a Swedish car." },
    { prompt: '先否定不符合的情况，再说明正确情况', answer: ['She', "isn't", 'a Swedish student.', "She's", 'a French student.'] },
    { prompt: "He's German. She's French. It isn't an English car.", answer: 'He is / She is / is not' }
  ]
};
async function choose(room, question) {
  if (question.audio) {
    await room.getByRole('button', { name: '听一遍', exact: true }).click();
    await expect(room.getByRole('button', { name: '再听一遍', exact: true })).toBeVisible({ timeout: 15000 });
  }
  if (Array.isArray(question.answer)) {
    for (const token of question.answer) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  } else await room.locator('.practice-options').getByRole('button', { name: question.answer, exact: true }).click();
}
async function finishExam(page, unit, start = 0) {
  const room = page.locator('.stage-exam'), questions = EXAMS[unit];
  for (let i = start; i < questions.length; i++) {
    await expect(room.locator('.practice-content h3')).toContainText(questions[i].prompt);
    await choose(room, questions[i]);
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
    await room.getByRole('button', { name: i === questions.length - 1 ? '查看本次记录' : '下一题', exact: true }).click();
  }
}
module.exports = { EXAMS, choose, finishExam };
