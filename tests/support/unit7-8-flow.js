'use strict';
const { expect } = require('@playwright/test');
// Independent expectations from textbook paper pages 14–17 and the unit manuscript.
const DIALOGUE=['I am a new student.',"My name's Robert.",'Nice to meet you.',"My name's Sophie.",'Are you French?','Yes, I am.','Are you French, too?','No, I am not.','What nationality are you?',"I'm Italian.",'Are you a teacher?',"No, I'm not.","What's your job?","I'm a keyboard operator.","What's your job?","I'm an engineer."];
const SPEAKERS=['Robert','Robert','Sophie','Sophie','Robert','Sophie','Sophie','Robert','Sophie','Robert','Robert','Sophie','Robert','Sophie','Sophie','Robert'];
const ANSWERS={listen:['意大利（人）的','keyboard operator','工程师','policeman','policewoman','taxi driver','女空乘','postman','nurse','机械师；修理机器的人','hairdresser','家庭主妇','milkman'],roles:["I'm an engineer.","No, she isn't."],reply:["I'm Italian.",'is / am','is / is'],interview:["What's his job?","What's her job?",["What's",'your job?',"I'm",'an engineer.'],['Is','he','a taxi driver?','Yes,','he is.']],exam:require('./unit7-8-exam').EXAM.map(item=>item.answer)};
async function completeStory(page,base=''){
 await page.goto(base+'/unit7-8/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
  await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  await expect(room.getByRole('button',{name:i===15?'完成课文':'下一句',exact:true})).toBeEnabled({timeout:15000});
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('故事看完了！');
}
async function completeActivity(page,id,base=''){
 await page.goto(base+'/unit7-8/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(let i=0;i<answers.length;i++){
  const answer=answers[i],check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(Array.isArray(answer)){for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}
  else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  await expect(check).toBeEnabled({timeout:15000});await check.click();await expect(room.getByRole('status')).toContainText('答对了！');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  if(id==='listen'&&i===11){await page.reload();await expect(room.getByRole('status')).toContainText('答对了！');}
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit78(page,base=''){await completeActivity(page,'listen',base);await completeStory(page,base);for(const id of ['roles','reply','interview','exam'])await completeActivity(page,id,base);await page.goto(base+'/unit7-8/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit78};
