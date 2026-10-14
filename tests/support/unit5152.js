'use strict';
const {expect}=require('@playwright/test');const {select}=require('./units1-30-tasks');
// Independent answer manuscript: textbook pp102–105; Guide Grammar p94.
// These expectations are not taken from runtime question/answer fields.
const ANSWERS={
 listen:[{pairs:[['spring','春季'],['summer','夏季'],['autumn','秋季'],['winter','冬季']]},'weather','windy',{pairs:[['always','总是'],['often','经常'],['sometimes','有时']]},{pairs:[['February','二月'],['June','六月'],['September','九月'],['December','十二月']]},{pairs:[['Brazil','巴西'],['the Netherlands','荷兰'],['Norway','挪威'],['Sweden','瑞典']]},'rain','宜人的'],
 roles:['Greece',{fills:['windy','warm']},'every day','November','有时下雪','Dimitri觉得本国气候宜人'],
 grammar:['天气怎么样',['What’s','the weather','like','today'],{fills:['climate','like']},'What is',{fills:['It’s']},'It’s windy.',{fills:['is','rains']},'She’s friendly.',['What’s','the room','like'],'It’s warm, but it rains sometimes.','It’s big and clean.',['What’s','the weather','like','in spring']],
 apply:['I come from Brazil.',{fills:['comes','France']},['Where','do','you','come from'],{fills:['doesn’t','comes']},'下雪的冬日',['June','July','August'],{pairs:[['21st','twenty-first'],['22nd','twenty-second'],['23rd','twenty-third'],['31st','thirty-first']]},'来自挪威，今天温暖'],
 exam:['climate',{pairs:[['January','一月'],['April','四月'],['August','八月'],['November','十一月']]},{pairs:[['Italy','意大利'],['Russia','俄罗斯'],['Spain','西班牙'],['the U.S.','美国']]},'来自希腊，气候宜人',{fills:['warm','cold']},'常常冷，有时下雪','sometimes',['What','is','the weather','like today'],{fills:['What’s','like']},'He’s quiet.',['What’s','your new bag','like'],'It’s warm. It isn’t raining.',{fills:['is','shines']},'It’s very pleasant.',{fills:['is','comes']},{fills:['are','come']},['Where','do','they','come from'],{fills:['Does','come']},['He','doesn’t','come from','Norway'],'She’s Dutch.','twenty-first','来自德国，春季有时下雨']
};
async function story(page,base=''){
 await page.goto(base+'/unit51-52/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit51-52/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();
  await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,story,activity};
