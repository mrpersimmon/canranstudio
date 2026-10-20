'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD}=require('./unit4344');
const SPEAKERS=['Penny','Sam','Sam','Penny','Sam','Penny','Penny','Sam','Penny','Sam','Sam','Penny','Penny','Sam','Penny'];
const DIALOGUE=['Can you make the tea, Sam?','Yes, of course I can, Penny.','Is there any water in this kettle?','Yes, there is.','Where’s the tea?','It’s over there, behind the teapot.','Can you see it?','I can see the teapot, but I can’t see the tea.','There it is! It’s in front of you!','Ah yes, I can see it now.','Where are the cups?','There are some in the cupboard.','Can you find them?','Yes. Here they are.','Hurry up, Sam! The kettle’s boiling!'];
// Reviewed manuscript: textbook 86–89, guide 79, workbook 119–125.
const ANSWERS={listen:OLD.listen,roles:OLD.roles,grammar:[...OLD.grammar.slice(0,10),{fills:['are','aren’t']},['but','I','can’t','see the tea'],'Sam can make the tea.'],apply:OLD.apply,exam:[...OLD.exam,'Penny can make the tea.']};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit43-44/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit43-44/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');if((await room.locator('.fb').textContent())!=='答对了！'){await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');}await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward){
  const card=room.locator('.completion-card');
  // A server-confirmed award may appear after numeric results are already in
  // the DOM. Follow the public settlement sequence before the next activity.
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-result-motion','finished');
 }
 return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
