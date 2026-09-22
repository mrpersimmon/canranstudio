'use strict';
const {expect}=require('@playwright/test');
// Answers and transcription come from PDF 55–58 and the lesson manuscript, never from runtime data.
const DIALOGUE=['Whose shirt is that?','Is this your shirt, Dave?','No, sir.',"It's not my shirt.",'This is my shirt.',"My shirt's blue.","Is this shirt Tim's?",'Perhaps it is, sir.',"Tim's shirt's white.",'Tim!','Yes, sir?','Is this your shirt?','Yes, sir.','Here you are.','Catch!','Thank you, sir.'];
const SPEAKERS=['老师','老师','Dave','Dave','Dave','Dave','老师','Dave','Dave','老师','Tim','老师','Tim','老师','老师','Tim'];
const ANSWERS={listen:['whose','blue','perhaps','white','catch','father','mother','blouse','sister','tie','brother','his','her'],roles:['Tim','老师手里的白衬衫'],owner:['her','your',"shirt's"],trans:[['Whose','is','that','tie?'],["It's",'my',"sister's."]],exam:['my brother · pen','请 Tim 确认','her']};
async function completeStory(page){
 await page.goto('/unit11-12/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始听课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));await expect(room.getByRole('button',{name:i===15?'完成课文学习':'下一句',exact:true})).toBeEnabled({timeout:15000});}
 await room.getByRole('button',{name:'完成课文学习',exact:true}).click();await expect(room).toContainText('故事听完了！');
}
async function completeActivity(page,id){
 await page.goto('/unit11-12/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(let i=0;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true}),answer=answers[i];await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(id==='listen'||id==='exam'&&i===0)await room.getByRole('button',{name:'听一遍',exact:true}).click();
  if(Array.isArray(answer)){for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  await expect(check).toBeEnabled({timeout:15000});await check.click();await expect(room.getByRole('status')).toContainText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  if(id==='listen'&&i===11){await page.reload();await expect(room.getByRole('status')).toContainText('答对了！');}
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit1112(page){await completeActivity(page,'listen');await completeStory(page);for(const id of ['roles','owner','trans','exam'])await completeActivity(page,id);await page.goto('/unit11-12/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit1112};
