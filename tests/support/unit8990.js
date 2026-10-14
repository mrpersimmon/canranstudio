'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independently written answer sheet from the reviewed 89–90 teaching draft.
// Never import runtime answer fields or inject learning/award records.
const ANSWERS={
listen:['for sale','礼貌请求看一看',{pairs:[['believe','相信；认为'],['sell','卖；出售'],['retire','退休']]},'出售的原因',{pairs:[['pound','英镑'],['penny','便士'],['cost','花费']]},'它值这个价钱',{locate:'since'},'在这里住了多久'],
roles:['看看待售的房子','for twenty years / since 1976','他刚退休','乡下的一幢小房子','£68,500','妻子必须先看房','这是Ian的概括，不能代表所有女性'],
grammar:[{fills:['for']},{fills:['since']},{fills:['for','since']},{fills:['since']},{fills:['since','came']},['How long','have','you','lived','here'],{fills:['have','has']},'She has been here for an hour.','不能，还需要知道后来有没有离开',['We','haven’t','seen','each other','for three years'],{fills:['since','left']},'/red/',{fills:['swum','swam']},{locate:'ate'},{fills:['for','since']},['How long','has','she','taught','at this school'],{fills:['since']},{fills:['have','did']}],
apply:['May I have a look at it, please?',{fills:['for','since']},['How long','have','you','lived','here'],'The owner has just retired.',['They','have','been here','for an hour'],{pairs:[['How long have you lived here?','For six years.'],['Why do you want to sell it?','Because I’ve retired.'],['How much does it cost?','£68,500.']]},{fills:['did','hasn’t']},'He hasn’t decided yet.'],
exam:['20 years · since 1976','Nigel还要先让妻子看房','£68,500',{pairs:[['for sale','待售'],['retire','退休'],['worth every penny','值这个价钱']]},'May I have a look at this book, please?',{fills:['for']},{fills:['since']},'for three years / since 2022',{fills:['since']},{fills:['since','left']},{fills:['since']},['How long','has','he','lived','here'],{fills:['have','lived']},'She has been in the library for an hour.','他在2020年来过这里',['I','haven’t','seen','her','for two months'],'/red/',{pairs:[['do','done'],['speak','spoken'],['swim','swum']]},{fills:['come']},['We','didn’t','swim','across the river','yesterday'],'When did you speak to her?',{fills:['saw','hasn’t']},{pairs:[['How long have you lived here?','For five years.'],['When did you read the book?','Last year.'],['Have you done your homework yet?','Yes, I have.']]},'Lily has lived here for six years, since 2019.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit89-90/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit89-90/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
