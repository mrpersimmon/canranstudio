'use strict';
const {expect}=require('@playwright/test');
// Independently transcribed from PDF 87–90 and the reviewed draft, not product answers.
const DIALOGUE=["Mrs. Smith's living room is large.",'There is a television in the room.','The television is near the window.','There are some magazines on the television.','There is a table in the room.','There are some newspapers on the table.','There are some armchairs in the room.','The armchairs are near the table.','There is a stereo in the room.','The stereo is near the door.','There are some books on the stereo.','There are some pictures in the room.','The pictures are on the wall.'];
const ANSWERS={
 listen:['客厅','靠近','window','扶手椅','door','图画','墙','长裤'],
 roles:['On the stereo.','the table'],observe:['are','knives · policemen'],be:['Are there any pictures in the room?','tickets'],
 trans:[['There','are','some','pictures','on','the','wall.'],['Are','there','any','books','in','the','room?'],['No,','there',"aren't",'any','books','in','the','room.']],
 exam:['甲图','桌上没有杯子。']
};
async function chooseTokens(room,tokens){const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of tokens)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();}
async function completeStory(page,base=''){
 await page.goto(base+'/unit27-28/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('课文看完了！');
}
async function completeActivity(page,id,base=''){
 await page.goto(base+'/unit27-28/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(const [i,answer] of answers.entries()){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(Array.isArray(answer))await chooseTokens(room,answer);else await room.getByRole('button',{name:answer,exact:true}).click();
  await check.click();await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit2728(page,base=''){
 await completeActivity(page,'listen',base);await completeStory(page,base);
 for(const id of ['roles','observe','be','trans','exam'])await completeActivity(page,id,base);
 await page.goto(base+'/unit27-28/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={DIALOGUE,ANSWERS,chooseTokens,completeStory,completeActivity,completeUnit2728};
