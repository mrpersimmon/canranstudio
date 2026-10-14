'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent exercise answer sheet: textbook162–165 / guide142. Operate only
// rendered inputs; never read the production answers or inject award state.
const ANSWERS={
listen:['list',{pairs:[['shopping','购物'],['need','需要'],['hope','希望']]},'cabbages',{pairs:[['groceries','食品杂货'],['fruit','水果'],['stationery','文具']]},'需要买的东西','钱',{pairs:[['newsagent','报刊零售商'],['chemist','药剂师'],['the baker’s','面包店']]}],
roles:['写购物清单','茶、咖啡不多；糖、果酱没有','番茄不多，土豆很多','一点儿肉也没有','家里没有，她也不打算买','钱','他们在商量购物，钱都不多'],
grammar:[{locate:'must'},['She','must','go','to the baker’s'],{fills:['mustn’t']},{fills:['needn’t']},['Must','I','finish','today'],'No, you needn’t.',{pairs:[['You must go.','必须去'],['You needn’t go.','不必去'],['You mustn’t go.','不准去']]},['Need','I','wait'],'No, you needn’t.',{fills:['needs']},['We','need','to buy','some bread'],{fills:['need']},{fills:['doesn’t','to']},{fills:['buy']},'Yes, you must.',{locate:'buy'}],
apply:['jam',{fills:['many','much']},'We haven’t got any sugar.',{fills:['hasn’t']},'the baker’s','She needs an envelope.','We needn’t buy potatoes.',['I','must go','to the greengrocer’s','to get','some bananas']],
exam:[{pairs:[['shopping','购物'],['list','清单'],['money','钱']]},'希望对方还有钱',{pairs:[['stationery','文具'],['newsagent','报刊零售商'],['chemist','药剂师']]},'tomatoes: not many; potatoes: a lot','They haven’t got any meat at all.','Carol不打算买酒；两人的钱都不多',['He','must','write','a list'],{fills:['mustn’t']},{fills:['needn’t']},'No, you needn’t.',['Must','we','leave','now'],'Yes, you must.',{fills:['come']},'No, you needn’t.',['She','needs','to buy','some envelopes'],{fills:['need']},{fills:['don’t','to']},{fills:['many','much']},'We haven’t got any butter.',{pairs:[['bread and cakes','the baker’s'],['pears and cabbages','the greengrocer’s'],['beef and chicken','the butcher’s']]},'We’ve got some glue, but we haven’t got any envelopes.','We’ve got a lot of eggs and a lot of milk.','the newsagent’s and the grocer’s',['I','must go','to the newsagent’s','to buy','some magazines']]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit79-80/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit79-80/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
