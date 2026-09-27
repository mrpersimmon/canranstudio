'use strict';
const {expect} = require('@playwright/test');
// Independently transcribed from textbook PDF 67–70 and the reviewed question draft.
const DIALOGUE = ["Come and meet our employees, Mr. Richards.","Thank you, Mr. Jackson.","This is Nicola Grey, and this is Claire Taylor.","How do you do?","Those women are very hard-working.","What are their jobs?","They're keyboard operators.","This is Michael Baker, and this is Jeremy Short.","How do you do?","They aren't very busy!","What are their jobs?","They're sales reps.","They're very lazy.","Who is this young man?","This is Jim.","He's our office assistant."];
const SPEAKERS = ['Mr. Jackson','Mr. Richards','Mr. Jackson','Mr. Richards','Mr. Richards','Mr. Richards','Mr. Jackson','Mr. Jackson','Mr. Richards','Mr. Richards','Mr. Richards','Mr. Jackson','Mr. Jackson','Mr. Richards','Mr. Jackson','Mr. Jackson'];
const ANSWERS = {
  listen:['雇员；员工','勤奋的','销售代表；推销员','成年男子；男人','办公室','assistant','那些','她们的'],
  roles:['sales reps','Nicola Grey 和 Claire Taylor','他们不很忙'],
  refer:['Who is this young man?','He','We'],
  forms:['men / women','policewomen','housewives'],
  trans:[['What','are','their','jobs?'],['Are','they','engineers','or','taxi drivers?'],['They',"aren't",'nurses.',"They're",'housewives.']],
  exam:['They are keyboard operators.','women · nurses / men · engineers']
};
async function completeStory(page,base='') {
  await page.goto(base+'/unit17-18/#learn/text'); const room=page.locator('.stage-text');
  for(let i=0;i<DIALOGUE.length;i++) {
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
    await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  }
  await room.getByRole('button',{name:'完成课文',exact:true}).click();
  await expect(room).toContainText('故事看完了！');
}
async function completeActivity(page,id,base='') {
  await page.goto(base+'/unit17-18/#learn/'+id); const room=page.locator('.stage-'+id);
  const answers=ANSWERS[id];
  for(const [i,answer] of answers.entries()) {
    const check=room.getByRole('button',{name:'检查答案',exact:true});
    await expect(check).toBeDisabled(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
    if(Array.isArray(answer)) for(const token of answer) await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();
    else await room.getByRole('button',{name:answer,exact:true}).click();
    await check.click(); await expect(room.getByRole('status')).toContainText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  }
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit1718(page,base='') {
  await completeActivity(page,'listen',base); await completeStory(page,base);
  for(const id of ['roles','refer','forms','trans','exam']) await completeActivity(page,id,base);
  await page.goto(base+'/unit17-18/#learn/certificate'); await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit1718};
