'use strict';
const {expect}=require('@playwright/test');
// Independent manuscript: textbook pp.26–29 and the approved v2.0 coverage table.
const EXAM=[
 {answer:'case · yellow / hat · yellow',wrong:'case · yellow / hat · orange'},
 {answer:"Her carpet's red.",wrong:"His carpet's red."},
 {answer:'到楼上看连衣裙',wrong:'到楼下看连衣裙'},
 {answer:'都是新的',wrong:'都是绿色的'},
 {answer:['What','colour','is','your','dress?']},
 {answer:"His hat's grey and black.",wrong:"His hat's grey."},
 {answer:"Steven's umbrella is black.",wrong:"Steven is umbrella's black."},
 {answer:['This','is','my',"father's",'suit.']},
 {answer:"What colour's Sophie's coat?",wrong:"What colour's your coat?"},
 {answer:'That is a lovely hat!',wrong:"That's a nice dress."}
];
async function selectAnswer(room,answer){
 if(Array.isArray(answer))for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();
 else await room.getByRole('button',{name:answer,exact:true}).click();
}
async function finishExamFrom(page,start=0){
 const room=page.locator('.stage-exam');
 for(let i=start;i<EXAM.length;i++){
  await expect(room).toContainText(`第 ${i+1} / 10 题`);await selectAnswer(room,EXAM[i].answer);
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toContainText('答对了！');
  await room.getByRole('button',{name:i===9?'查看本次记录':'下一题',exact:true}).click();
 }
}
module.exports={EXAM,selectAnswer,finishExamFrom};
