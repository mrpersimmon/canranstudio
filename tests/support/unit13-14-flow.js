'use strict';
const {expect} = require('@playwright/test');
const {EXAM}=require('./unit13-14-exam');
// Independently transcribed from PDF 59–62 and the shared classroom contract.
const DIALOGUE = ["What colour's your new dress?","It's green.",'Come upstairs and see it.','Thank you.','Look!','Here it is!',"That's a nice dress.","It's very smart.","My hat's new, too.",'What colour is it?', "It's the same colour.", "It's green, too.",'That is a lovely hat!'];
const SPEAKERS = ['Louise','Anna','Anna','Louise','Anna','Anna','Louise','Louise','Anna','Louise','Anna','Anna','Louise'];
const ANSWERS = {
  listen:['颜色','green','来','upstairs','漂亮的；时髦的','hat','相同的','可爱的；漂亮的','case','carpet','dog','黑色的','grey','brown','红色的','yellow','橙色的'],
  roles:['green','都是新的'],
  colours:["What colour's your hat?",'一只棕白相间的狗'],
  trans:[['This','is',"Helen's",'dog.'],['What',"colour's","Steven's",'hat?'],['Her',"coat's",'grey.']],
  exam:EXAM.map(item=>item.answer)
};
async function completeStory(page,base='') {
  await page.goto(base+'/unit13-14/#learn/text'); const room=page.locator('.stage-text');
  for(let i=0;i<DIALOGUE.length;i++) {
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
    await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  }
  await room.getByRole('button',{name:'完成课文',exact:true}).click();
  await expect(room).toContainText('故事看完了！');
}
async function completeActivity(page,id,base='') {
  await page.goto(base+'/unit13-14/#learn/'+id); const room=page.locator('.stage-'+id);
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
async function completeUnit1314(page,base='') {
  await completeActivity(page,'listen',base); await completeStory(page,base);
  for(const id of ['roles','colours','trans','exam']) await completeActivity(page,id,base);
  await page.goto(base+'/unit13-14/#learn/certificate'); await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit1314};
