'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against source pages and the teaching brief.
// Never read runtime answer fields or inject records and stars.
const ANSWERS={
listen:['knock',{pairs:[['quiet','安静的'],['impossible','不可能的'],['invite','邀请']]},{pairs:[['someone','某人'],['something','某物或某事'],['somewhere','某处']]},'在开玩笑','lemonade','婴儿睡着了','眼镜',{locate:'anything'},'什么也看不见'],
roles:['Carol和Tom','他当时的判断，后来发现大家在花园','不能，只说明Jim当时从窗口看不见什么','the back door','in the garden','没有，只说大家想在花园吃午饭','Tom说明她在开玩笑，并请Jim喝啤酒','beer；原文没有写Jim已经喝下','他重复了饮品名称，不能确定过敏或永久不喜欢'],
grammar:[
{fills:['someone','something']},{fills:['somewhere']},{fills:['Everyone','Everything']},'Someone is waiting和Somebody is waiting都可以',{fills:['is','was']},{fills:['wants']},{fills:['anyone','anything']},{fills:['anybody','anything']},['Nobody','is','in the room'],{fills:['saw','no one']},{fills:['went','nowhere']},'Nowhere. He stayed at home.',{fills:['everywhere','anywhere']},['There is','something','interesting','in the box'],['I’ve got','nothing','to read'],{pairs:[['Someone is waiting.','有人正在等。'],['I met someone.','我遇见了某个人。'],['That’s nothing.','那不算什么。']]},'邀请客人喝点东西','任何人都可以加入，不限定某个人','A: Yes, there is. B: No, there isn’t.','There’s none left.',{pairs:[['_____ is at the gate.（一位访客）','Someone'],['There is _____ on the table.（一个包）','something'],['My pen is _____ in this room.（具体位置未知）','somewhere']]},{fills:['is','wants']},{fills:['heard','nothing']},['She has','something','nice','to eat']
],
apply:['A','She looked everywhere on this map.','Everyone in this group is ready.','Yes, please. Some lemonade.','这个盒子里没有东西，其他地方还不知道',['I','met','no one','yesterday'],'A','The key is somewhere in the room.'],
exam:['Jim当时的判断，后来得到新信息','Tom说明Carol在开玩笑，并提供啤酒；未写Jim已经喝下',{pairs:[['invite','邀请'],['asleep','睡着的'],['glasses','眼镜']]},{pairs:[['一个未说明身份的人','someone'],['一件未说明是什么的物品','something'],['一个未说明具体位置的地方','somewhere']]},{fills:['Everything']},'No one is outside和Nobody is outside都符合',{fills:['is','was']},{fills:['wants']},{fills:['anyone','anything']},{fills:['anything']},['Nobody','is','in the room'],{fills:['met','no one']},{fills:['bought','nothing']},['We','went','nowhere','yesterday'],{fills:['everywhere','anywhere']},['I want','something','cold'],['I’ve got','nothing','to eat'],'Would you like something to drink?','任何访客都可以参加，不说明所有人已参加','Yes, there is.','No, there isn’t.','There’s none left.','There is nothing in this box.',['She has','something','interesting','to read']]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit115-116/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit115-116/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
