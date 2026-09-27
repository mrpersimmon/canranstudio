'use strict';
const {expect}=require('@playwright/test');
// Independent transcription from PDF 75–78 and the authored question draft.
const DIALOGUE=['Give me a book please, Jane.','Which book?','This one?','No, not that one. The red one.','This one?','Yes, please.','Here you are.','Thank you.'];
const SPEAKERS=['男士','简（Jane）','简（Jane）','男士','简（Jane）','男士','简（Jane）','男士'];
const ANSWERS={
 listen:['给；递给','这一本书','哪一本书？','空的 / 满的','大的 / 小的','锋利的 / 钝的',{pairs:[['box','盒子；箱子'],['bottle','瓶子'],['tin','罐头盒']]},'glass','杯子',{pairs:[['knife','刀子'],['fork','叉子'],['spoon','勺子']]}],
 roles:['The red one','第一次没有选对，第二次选对了。'],
 observe:['说话的人和他的同伴','Give her a cup, please.',{object:'盒子',recipient:'简和男士'}],
 be:['Our','an'],
 trans:[['Give','her','a','clean cup,','please.'],['Which','one?','This','blue','one?'],['No,','not','this','empty','one.','That','full','one.']],
 exam:['把小瓶子递给说话的人。','还要确认要空的还是满的。']
};
async function chooseTokens(room,tokens){const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of tokens)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();}
ANSWERS.exam=require('./units17-30-exam').EXAMS['21-22'];
async function completeStory(page,base=''){
 await page.goto(base+'/unit21-22/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('故事看完了！');
}
async function completeActivity(page,id,base=''){
 await page.goto(base+'/unit21-22/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(const [i,answer] of answers.entries()){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  await require('./units17-30-exam').selectAnswer(room,answer);
  await check.click();await expect(room.getByRole('status')).toContainText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit2122(page,base=''){
 await completeActivity(page,'listen',base);await completeStory(page,base);
 for(const id of ['roles','observe','be','trans','exam'])await completeActivity(page,id,base);
 await page.goto(base+'/unit21-22/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');
}
async function finishRemainingActivity(page,id,base=''){
 await page.goto(base+'/unit21-22/#learn/'+id);const room=page.locator('.stage-'+id);
 if(await room.getByRole('group',{name:'完成后的操作',exact:true}).isVisible())return;
 const first=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=first;i<ANSWERS[id].length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  if(await check.isVisible()){await require('./units17-30-exam').selectAnswer(room,ANSWERS[id][i]);await check.click();}
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button',{name:i===ANSWERS[id].length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
}
module.exports={finishRemainingActivity,DIALOGUE,SPEAKERS,ANSWERS,chooseTokens,completeStory,completeActivity,completeUnit2122};
