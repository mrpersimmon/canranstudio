'use strict';
const {expect}=require('@playwright/test');
// Independent manuscript: textbook pp.30–33 and v2.0 coverage table, not runtime answers.
const EXAM=[
 {answer:'朋友：Russian；身份：tourists',wrong:'朋友：Norwegian；身份：tourists'},
 {answer:'Yes, they are.',wrong:'Yes, we are.'},
 {answer:"No, we aren't.",wrong:'Yes, we are.'},
 {answer:"aren't",wrong:"isn't"},
 {answer:'Are these',wrong:'Are this'},
 {answer:['What','colour','are','your','cases?']},
 {answer:'Our hats are black and grey.',wrong:'Our hats are black.'},
 {answer:'friends / dresses',wrong:'friends / dresss'},
 {answer:'an / a',wrong:'a / an'},
 {answer:'棕色箱子',wrong:'护照'},
 {answer:'Thank you very much.',wrong:'Your passports, please.'}
];
async function selectAnswer(room,answer){
 if(Array.isArray(answer))for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();
 else await room.getByRole('button',{name:answer,exact:true}).click();
}
async function finishExamFrom(page,start=0){
 const room=page.locator('.stage-exam');
 for(let i=start;i<EXAM.length;i++){
  await expect(room).toContainText(`第 ${i+1} / 11 题`);await selectAnswer(room,EXAM[i].answer);
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toContainText('答对了！');
  await room.getByRole('button',{name:i===10?'查看本次记录':'下一题',exact:true}).click();
 }
}
module.exports={EXAM,selectAnswer,finishExamFrom};
