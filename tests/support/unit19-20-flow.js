'use strict';
const taskCases=require('./units1-30-tasks');
const {expect}=require('@playwright/test');
// Independent textbook transcription (PDF 71–74) and the author question draft.
const DIALOGUE=["What's the matter, children?","We're tired ...","... and thirsty, Mum.",'Sit down here.','Are you all right now?',"No, we aren't.","Look! There's an ice cream man.",'Two ice creams please.','Here you are, children.','Thanks, Mum.','These ice creams are nice.','Are you all right now?','Yes, we are, thank you!'];
const SPEAKERS=['妈妈','女孩','男孩','妈妈','妈妈','男孩','妈妈','妈妈','妈妈','孩子们','女孩','妈妈','孩子们'];
const ANSWERS=Object.fromEntries(Object.keys(taskCases.CASES['19-20'].old).map(id=>[id,taskCases.answers('19-20',id).map(q=>q.answer)]));
async function chooseTokens(room,tokens){const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of tokens)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();}

async function completeStory(page,base=''){
 await page.goto(base+'/unit19-20/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('故事看完了！');
}
async function completeActivity(page,id,base=''){
 await page.goto(base+'/unit19-20/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(const [i,answer] of answers.entries()){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(answer&&typeof answer==='object'&&!Array.isArray(answer))await taskCases.select(room,answer);
    else if(Array.isArray(answer))await chooseTokens(room,answer);else await room.getByRole('button',{name:answer,exact:true}).click();
  await check.click();await expect(room.getByRole('status')).toContainText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit1920(page,base=''){
 await completeActivity(page,'listen',base);await completeStory(page,base);
 for(const id of ['roles','observe','be','trans','exam'])await completeActivity(page,id,base);
 await page.goto(base+'/unit19-20/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={DIALOGUE,SPEAKERS,ANSWERS,chooseTokens,completeStory,completeActivity,completeUnit1920};
