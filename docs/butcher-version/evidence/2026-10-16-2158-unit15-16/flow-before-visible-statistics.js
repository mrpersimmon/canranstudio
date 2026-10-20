'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD,DIALOGUE,SPEAKERS}=require('./unit15-16-flow');
// Independent manuscript: reviewed source pages and target map, never runtime answers.
const ANSWERS={
listen:OLD.listen,
roles:[...OLD.roles,'不能确定，只知道不属于姑娘们'],
grammar:[{fills:['officers']},{fills:['cases']},{fills:['watches','boxes']},{fills:['babies','boys']},{fills:['Henrys']},{fills:['photos','potatoes']},{fills:['knives','leaves']},'handkerchiefs；英式也可用handkerchieves',{fills:['am','is']},{fills:["They're","I'm not"]},"We aren't tourists. / We're not tourists.",{fills:['Are','these']},{fills:['We','Our']},{fills:['an','a']},'只指小林一个人的',{fills:['are','cars']}],
apply:[OLD.reply[0],OLD.reply[1],...OLD.trans,'Your passports, please.'],
exam:[OLD.exam[0],OLD.exam[1],{fills:["we aren't"]},{fills:['are','Dutch']},{fills:['Are','these']},{fills:['are','Our']},OLD.exam[6],{fills:['friends','dresses']},{fills:['an','a']},OLD.exam[9],OLD.exam[10],{fills:['cities','keys']},{fills:['radios','tomatoes']},{fills:['leaves','roofs']},'two Henrys','两种复数写法都可以','We are not tourists.',{fills:['am','is']},'不能，your可能指一人或多人','These are my passports.','We are tourists.']};
async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit15-16/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await page.goto(base+'/unit15-16/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward){
  const modal=page.locator('dialog.award-reveal[open]'),card=room.locator('.completion-card');
  // A server-confirmed award may appear after numeric results are already in
  // the DOM. Follow the public settlement sequence before the next activity.
  await expect.poll(async()=>await modal.isVisible()?'award':await card.getAttribute('data-result-motion')).toMatch(/^(award|finished)$/);
  if(await modal.isVisible())await page.keyboard.press('Escape');
  await expect(card).toHaveAttribute('data-result-motion','finished');
 }
 return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
