'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet from the reviewed 101–102 draft and original pages.
// Do not read runtime answer fields or inject learning / award records.
const ANSWERS={
listen:['card',{pairs:[['youth','青年'],['association','协会'],['member','成员']]},'苏格兰',{locate:'soon'},'请Penny说大声一点',{pairs:[['write','原形'],['wrote','过去式'],['written','过去分词']]},'身体好','他几乎听不见'],
roles:['Jimmy写，Penny读','苏格兰的一家青年招待所','The Youth Hostels Association.','Penny和Grandmother等收信的一方','她听不见Penny念的内容','Jimmy说不久会写信','她似乎觉得写得太少：问“就这些吗”','明信片上写不了很多'],
grammar:['写明信片的Jimmy',{fills:['is','herself']},{fills:['we']},{fills:['arrived','will leave']},{fills:['is shutting','has shut']},'He says he is tired. / He says that he is tired.',{fills:['isn’t it','are they']},{fills:['doesn’t she','do they']},{fills:['didn’t she']},{fills:['hasn’t he','have they']},{fills:['can’t she','will he']},{fills:['isn’t there']},{fills:['is she','can he']},{fills:['do they','don’t they']},{fills:['is there','isn’t there']},{fills:['isn’t he','isn’t it']},'Yes, she can.','No, she can’t.','第一句升调，第二句降调',['Ann says','she has written','her letter'],{fills:['do they','isn’t she']},'Yes, she has.','She says she is shutting the door.'],
apply:['Ben','Of course. I’ll speak up.',{fills:['they']},'Yes, he has.','No, he hasn’t.',['She says','she has written','the card'],{fills:['aren’t there']},'她期待认同，对方仍可回应'],
exam:['Jimmy','Grandmother似乎觉得字数少，Penny说明明信片写不了很多',{fills:['are','themselves']},{fills:['we']},{fills:['they']},{fills:['arrived','will leave']},'He says he is reading the magazine.',{fills:['has put on']},'She says she needs a haircut.',{fills:['isn’t it','are they']},{fills:['doesn’t she','do they']},{fills:['didn’t they']},{fills:['hasn’t she','have we']},{fills:['can’t he','will they']},['isn’t','there'],{fills:['does he','can they']},{fills:['do they','don’t they']},{fills:['is there','isn’t there']},{fills:['isn’t she','isn’t it']},'Yes, he can.','No, he can’t.','升调 ↗','常用降调期待确认，仍可以回应','他说不久会写，没有给出具体日期或已寄出的结果',['They say','they must wait for','a bus']]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit101-102/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit101-102/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
