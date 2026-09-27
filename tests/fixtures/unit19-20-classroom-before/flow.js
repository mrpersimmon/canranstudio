'use strict';
const {expect}=require('@playwright/test');
// Independent textbook transcription (PDF 71–74) and the author question draft.
const DIALOGUE=["What's the matter, children?","We're tired ...","... and thirsty, Mum.",'Sit down here.','Are you all right now?',"No, we aren't.","Look! There's an ice cream man.",'Two ice creams please.','Here you are, children.','Thanks, Mum.','These ice creams are nice.','Are you all right now?','Yes, we are, thank you!'];
const SPEAKERS=['妈妈','女孩','男孩','妈妈','妈妈','男孩','妈妈','妈妈','妈妈','孩子们','女孩','妈妈','孩子们'];
const ANSWERS={
 listen:['累的；疲倦的','口渴的','孩子们','男孩','妈妈','ice cream','怎么了？','坐下','你们现在好些了吗？','大的 / 小的','open / shut','轻的 / 重的','long','鞋子','祖父或外祖父 / 祖母或外祖母'],
 roles:['妈妈给了他们冰淇淋。',"No, we aren't.",'好吃的'],
 observe:['旧的','短的','这些鞋子'],
 be:['are / is',"They're clean."],
 trans:[['Sit','down','here.'],['Are','you','all right','now?'],["They're",'not','dirty.',"They're",'clean.']],
 exam:['累了；不渴','大；不是新的']
};
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
  if(Array.isArray(answer))await chooseTokens(room,answer);else await room.getByRole('button',{name:answer,exact:true}).click();
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
