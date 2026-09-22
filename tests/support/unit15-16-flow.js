'use strict';
const {expect} = require('@playwright/test');
// Independently transcribed from textbook PDF 63–66 and the reviewed question draft.
const DIALOGUE = ['Are you Swedish?','No, we are not.','We are Danish.','Are your friends Danish, too?',"No, they aren't.",'They are Norwegian.','Your passports, please.','Here they are.','Are these your cases?',"No, they aren't.",'Our cases are brown.','Here they are.','Are you tourists?','Yes, we are.','Are your friends tourists, too?','Yes, they are.',"That's fine.",'Thank you very much.'];
const SPEAKERS = ['海关官员','姑娘们','姑娘们','海关官员','姑娘们','姑娘们','海关官员','姑娘们','海关官员','姑娘们','姑娘们','姑娘们','海关官员','姑娘们','海关官员','姑娘们','海关官员','姑娘们'];
const ANSWERS = {
  listen:['海关','官员','女孩；姑娘','丹麦的；丹麦人的','friend','挪威的；挪威人的','passport','旅游者','俄罗斯的；俄罗斯人的','荷兰的；荷兰人的','这些'],
  roles:['Norwegian','护照',"That's fine."],
  reply:['Yes, we are.',"No, they aren't.",'Our'],
  forms:['friends','dresses','an'],
  trans:[['Are','these','your','cases?'],['What','colour','are','your','passports?'],['Our','hats','are','black','and','grey.']],
  exam:['朋友：Russian；身份：tourists','Yes, they are.']
};
async function completeStory(page,base='') {
  await page.goto(base+'/unit15-16/#learn/text'); const room=page.locator('.stage-text');
  for(let i=0;i<DIALOGUE.length;i++) {
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
    await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  }
  await room.getByRole('button',{name:'完成课文',exact:true}).click();
  await expect(room).toContainText('故事看完了！');
}
async function completeActivity(page,id,base='') {
  await page.goto(base+'/unit15-16/#learn/'+id); const room=page.locator('.stage-'+id);
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
async function completeUnit1516(page,base='') {
  await completeActivity(page,'listen',base); await completeStory(page,base);
  for(const id of ['roles','reply','forms','trans','exam']) await completeActivity(page,id,base);
  await page.goto(base+'/unit15-16/#learn/certificate'); await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit1516};
