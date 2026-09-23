'use strict';
const {expect}=require('@playwright/test');
// Independently transcribed from PDF 83–86 and the reviewed draft, not product answers.
const DIALOGUE=["Mrs. Smith's kitchen is small.",'There is a refrigerator in the kitchen.','The refrigerator is white.','It is on the right.','There is an electric cooker in the kitchen.','The cooker is blue.','It is on the left.','There is a table in the middle of the room.','There is a bottle on the table.','The bottle is empty.','There is a cup on the table, too.','The cup is clean.'];
const ANSWERS={
 listen:['太太','厨房','refrigerator','右边','用电的','左边','炉灶；炊具','中间','……的','房间','它在哪里？','在……里面'],
 roles:['blue','refrigerator'],observe:['介绍厨房里有一台冰箱。','an · The'],be:['It is in the cupboard.','It'],
 trans:[['There','is','a','cup','on','the','table.'],["There's",'a','bottle','in','the','refrigerator.'],['Where','is','it?']],
 exam:['甲图','桌上有杯子。']
};
async function chooseTokens(room,tokens){const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of tokens)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();}
async function completeStory(page,base=''){
 await page.goto(base+'/unit25-26/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('课文看完了！');
}
async function completeActivity(page,id,base=''){
 await page.goto(base+'/unit25-26/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(const [i,answer] of answers.entries()){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(Array.isArray(answer))await chooseTokens(room,answer);else await room.getByRole('button',{name:answer,exact:true}).click();
  await check.click();await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit2526(page,base=''){
 await completeActivity(page,'listen',base);await completeStory(page,base);
 for(const id of ['roles','observe','be','trans','exam'])await completeActivity(page,id,base);
 await page.goto(base+'/unit25-26/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={DIALOGUE,ANSWERS,chooseTokens,completeStory,completeActivity,completeUnit2526};
