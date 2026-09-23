'use strict';
const {expect}=require('@playwright/test');
// Independently transcribed from PDF 91–94 and the authored lesson draft.
const DIALOGUE=['Come in, Amy.','Shut the door, please.',"This bedroom's very untidy.",'What must I do, Mrs. Jones?','Open the window and air the room.','Then put these clothes in the wardrobe.','Then make the bed.','Dust the dressing table.','Then sweep the floor.'];
const ANSWERS={
 listen:['卧室','不整齐的','clothes','衣柜','让房间通风','掸去灰尘','sweep','把杯子倒空','读这本书','削尖这些铅笔'],
 roles:['Sweep the floor.','Dust the dressing table.'],observe:['我应该做什么？','Open','is'],be:['Turn on the lamp.','Take off your shirt.','放进衣柜。'],
 trans:[['What','must','I','do?'],['Then','make','the','bed.'],['Open','the','window','and','air','the','room.']],
 exam:['甲图','Clean it!']
};
async function chooseTokens(room,tokens){const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of tokens)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();}
async function completeStory(page,base=''){
 await page.goto(base+'/unit29-30/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('课文看完了！');
}
async function completeActivity(page,id,base=''){
 await page.goto(base+'/unit29-30/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(const [i,answer] of answers.entries()){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(Array.isArray(answer))await chooseTokens(room,answer);else await room.getByRole('button',{name:answer,exact:true}).click();
  await check.click();await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit2930(page,base=''){
 await completeActivity(page,'listen',base);await completeStory(page,base);
 for(const id of ['roles','observe','be','trans','exam'])await completeActivity(page,id,base);
 await page.goto(base+'/unit29-30/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={DIALOGUE,ANSWERS,chooseTokens,completeStory,completeActivity,completeUnit2930};
