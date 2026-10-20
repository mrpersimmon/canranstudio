'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD}=require('./unit4142');
const SPEAKERS=['Sam','Penny','Sam','Sam','Sam','Penny','Penny','Penny','Penny','Penny','Penny','Penny','Penny','Penny','Sam','Penny'];
const DIALOGUE=['Is that bag heavy, Penny?','Not very.','Here!','Put it on this chair.',"What's in it?",'A piece of cheese.','A loaf of bread.','A bar of soap.','A bar of chocolate.','A bottle of milk.','A pound of sugar.','Half a pound of coffee.','A quarter of a pound of tea.','And a tin of tobacco.','Is that tin of tobacco for me?',"Well, it's certainly not for me!"];
const ANSWERS={listen:OLD.listen,roles:OLD.roles,grammar:[...OLD.grammar,'可以，some也能用于这种问句。',{fills:['Are','aren’t']}],apply:OLD.apply,exam:[...OLD.exam.slice(0,8),'Is there any sugar in that bag?',...OLD.exam.slice(9),'Are there any cups? — Yes, there are.\nAre there any plates? — No, there aren’t.','可以，问句在这种情境中也能用some。']};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit41-42/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit41-42/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
