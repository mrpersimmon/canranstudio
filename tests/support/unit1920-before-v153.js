'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD,DIALOGUE,SPEAKERS}=require('./unit19-20-flow');
// Independent manuscript: reviewed source pages and target map, never runtime answers.
const ANSWERS={
listen:OLD.listen,roles:OLD.roles,
grammar:['长椅旁有两个孩子。',{fills:['is','are']},{fills:['is']},"There's",{fills:['is not']},"There aren't any shoes in the box.",{fills:['no','no']},['Is','there','an','ice cream man?'],{fills:['Are','Is']},{fills:['is',"aren't"]},{fills:['anything','anything']},{fills:['Who','What']},'Where are the two children?',{fills:['many','much']},...OLD.be],
apply:[...OLD.observe,...OLD.trans,{fills:['an','a']},['How many','children','are','there','in the park?'],['How much','water','is','there','in the bottle?']],
exam:[...OLD.exam,'花园里有三位女士。',{fills:['is','are','is']},'There is',{fills:['is not','are not']},'There is no water in the glass.',{fills:['Are','Is']},{fills:['are',"isn't"]},{fills:['anything']},{fills:['Who','What']},'Where is the case?',{fills:['many','much']},['There','are','two','benches','here.']]
};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit19-20/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit19-20/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');if(await room.locator('.fb').innerText()!=='答对了！'){await select(room,answers[i]);await check.click();}await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
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
