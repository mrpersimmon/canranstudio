'use strict';
const {expect}=require('@playwright/test');
const {EXAM}=require('./unit9-10-exam');
// Independent transcription from PDF 51–54 and the reviewed question manuscript.
const DIALOGUE=['Hello, Helen.','Hi, Steven.','How are you today?',"I'm very well, thank you.",'And you?',"I'm fine, thanks.",'How is Tony?',"He's fine, thanks.","How's Emma?","She's very well, too, Helen.",'Goodbye, Helen.','Nice to see you.','Nice to see you, too, Steven.','Goodbye.'];
const SPEAKERS=['Steven','Helen','Steven','Helen','Helen','Steven','Steven','Helen','Helen','Steven','Steven','Steven','Helen','Helen'];
const ANSWERS={listen:["成年女子", "胖的", "thin", "高的", "short", "dirty", "clean", "hot", "冷的；觉得冷的", "年老的", "young", "busy", "懒惰的；不愿付出努力"],roles:["She's very well.",'Steven','Tony'],reply:["I'm fine, thanks.",["I'm",'fine,','thanks.','And','you?'],'Nice to see you, too.'],describe:["He's","It's","She's busy.",['Look at','Emma.',"She's",'cold.']],exam:EXAM.map(question=>question.answer)};
async function completeStory(page,base=""){
 await page.goto(base+'/unit9-10/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<14;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));await expect(room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true})).toBeEnabled({timeout:15000});}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('故事看完了！');
}
async function completeActivity(page,id,base=""){
 await page.goto(base+'/unit9-10/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 for(let i=0;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true}),answer=answers[i];await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(Array.isArray(answer)){for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  await expect(check).toBeEnabled({timeout:15000});await check.click();await expect(room.getByRole('status')).toContainText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
  if(id==='listen'&&i===11){await page.reload();await expect(room.getByRole('status')).toContainText('答对了！');}
  await room.getByRole('button',{name:i===answers.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function completeUnit910(page,base=""){await completeActivity(page,'listen',base);await completeStory(page,base);for(const id of ['roles','reply','describe','exam'])await completeActivity(page,id,base);await page.goto(base+'/unit9-10/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit910};
