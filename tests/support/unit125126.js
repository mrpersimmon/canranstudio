'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against source pages and the teaching brief.
// Never read runtime answer fields or inject records and stars.
const ANSWERS={
listen:['water',{pairs:[['terribly','非常；很'],['dry','干的；干燥的'],['nuisance','令人烦恼的事或人']]},{pairs:[['mean','意味着；意思是'],['surprise','惊奇；意外的事'],['immediately','立即地']]},{fills:['meant']},'令人愉快的意外','我打算独自喝茶','改为喝茶，不再继续原先的浇水安排',{locate:'immediately'}],
roles:['邀请Peter进来喝茶','现在还不行，他想先浇花园','他说花园干得厉害','当时也很干，他不得不每天浇水','不能，这是Susan当时的打算，后来情况变了','不能，后文说明下雨使继续浇水不再必要','现在不需要继续给花园浇水','正在下雨','不是，Peter现在可以和她一起喝茶','Peter觉得这次变化令人愉快'],
grammar:[{fills:['have to','has to']},{fills:['water']},{fills:['Do','Does']},['Did','you','have to','take a taxi','yesterday'],{fills:['had to']},['I','will','have to','get up','at six tomorrow'],{fills:['have had to','has had to']},'能，都表达必须，说话角度可以不同',{fills:['don’t have to','mustn’t']},['You','needn’t','wait here'],{fills:['don’t','doesn’t']},['Must','she','decide','now'],{fills:['must','needn’t']},'三种都可以表达不必现在离开',{fills:['didn’t need to']},'不能，只说明当时不必买',['We','won’t','have to','come tomorrow'],{fills:['myself','herself']},{fills:['Yes','No']},'She needn’t leave early.',{fills:['Did','have']},{fills:['had to','will have to']}],
apply:['B',{fills:['mustn’t','don’t have to']},'No, you don’t need to.',{fills:['has to','too']},'I’ve had to wait for two hours.',['I','won’t','have to','clean the room tomorrow'],['Does','Jim','really have to','meet her','today'],'不能，还需要明天的安排'],
exam:[{pairs:[['dry','干的；干燥的'],['mean','意味着；意思是'],['immediately','立即地']]},'下雨使现在继续浇水不再必要',{fills:['have to','has to']},{fills:['go']},{fills:['Do','Does']},['Did','they','have to','leave early','yesterday'],{fills:['had to']},['We','will','have to','leave early','tomorrow'],{fills:['have had to','has had to']},'现在离开是必要的',{fills:['don’t have to','mustn’t']},['She','needn’t','come today'],{fills:['doesn’t','need']},['Must','we','leave','now'],{fills:['must','needn’t']},'两种都能表示不必等待',{fills:['didn’t need to']},'不能，只知道她当时不必等',['They','won’t','have to','work tomorrow'],{fills:['ourselves','themselves']},{fills:['Yes','No']},'He needn’t decide immediately.','Peter结束了浇水，后文解释现在下雨了',{fills:['meant','meant']},'不能，明天的安排还没有给出']
};

async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit125-126/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit125-126/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
