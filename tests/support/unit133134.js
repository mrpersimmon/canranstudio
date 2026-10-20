'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently transcribed reviewed answers; never read runtime question data.
const ANSWERS={
listen:[{pairs:[['reporter','记者'],['sensational','爆炸性的；耸人听闻的'],['mink coat','貂皮大衣']]},'想知道；感到好奇','newspaper',{locate:'retire'},'另一部电影','很长一段时间'],
roles:['拍完一部新电影','她说准备退休，不打算马上再拍一部','觉得很疲倦，长时间不想再拍电影','Kate','写这篇报道的Alan Jones','London Airport','蓝色连衣裙和貂皮大衣','没有，报道保留不想再拍的意思','她想知道为什么，原文没有揭晓其他原因'],
grammar:['He said he was tired.',{fills:['wanted','didn’t want']},['She said','she','was reading'],{fills:['would']},{fills:['had']},{fills:['had called']},{fills:['told','said']},{fills:['she','she']},{fills:['they','their']},['She said','she','was going to','retire'],'on 9 May','两种都可以，that在这些转述句中可省略','不是；仍然成立时也可保留现在时，要看语境','不能，两种原话都可能回移到had finished',['He asked me','where','I had been']],
apply:['Karen Marsh',['I told Sue','I','was','busy'],'10 May',['She said','she','didn’t want','another film'],{fills:['had','was']},{fills:['her','come']},'He told me he had lost his key.','都不能，仅有转述还不足以确定逐字原话'],
exam:[{pairs:[['reporter','记者'],['sensational','爆炸性的；耸人听闻的'],['mink coat','貂皮大衣']]},{fills:['was']},{fills:['wanted','didn’t want']},['They said','they','were working'],{fills:['would']},{fills:['had']},{fills:['seen']},{fills:['told','said']},{fills:['he','I']},{fills:['they','their']},['He said','he','was going to','leave'],'6 June','两句都能转述同一个陈述','她仍住那里，转述可按语境保留现在时','不能，have seen和saw都可能回移成had seen',['She asked me','where','I had been'],'Alan Jones','她准备退休，长时间不想再拍片；没有说已退休或永远不拍','Liz想知道为什么，没有给出另一个已证实的原因']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit133-134/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit133-134/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
