'use strict';
// Expected answers from the approved four-category question manuscript.
// Do not derive them from the page or course catalog.
const subjectAnswers = ['第三人称单数','第三人称复数','第三人称单数','第三人称单数',
  '第一人称','第二人称','第三人称单数','第三人称复数','第一人称','第三人称复数','第三人称单数','第三人称复数'];
async function submitSubject(stage, answer, advance = true) {
  await stage.getByRole('group',{name:'选择主语类别',exact:true}).getByRole('button',{name:answer,exact:true}).click();
  await stage.getByRole('button',{name:'检查答案',exact:true}).click();
  if (advance) await stage.getByRole('button',{name:/^(继续|完成)$/,exact:true}).click();
}
async function finishSubjects(page) {
  for (const answer of subjectAnswers) await submitSubject(page.locator('.stage-subjects'),answer);
}
module.exports = {subjectAnswers,submitSubject,finishSubjects};
