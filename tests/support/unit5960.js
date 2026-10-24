'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent reviewed manuscript: textbook118–121, Grammar108, workbook166–171.
// No answers are extracted from course objects or the browser's runtime state.
const ANSWERS={
 listen:['envelope',{pairs:[['writing paper','信纸'],['pad','信笺簿']]},'尺寸大小','glue','chalk','找回的零钱','shop assistant',{pairs:[['peas','豌豆'],['beans','豆角'],['lettuces','生菜']]}],
 roles:['the large size','有，但信笺簿只有大本的','pads','a bottle of glue','没有，她没有接受小盒粉笔','That’s all, thank you.','售货员找给她的零钱'],
 grammar:['拥有',{fills:['have','has']},['I','don’t','have','any glue'],['Do','you','have','any envelopes'],'Yes, I do.','No, they don’t.',{fills:['some','any']},{fills:['envelopes','writing paper']},'I have a book now.','She is having lunch now.',['We','don’t','have','any envelopes'],{fills:['Do','don’t']},{fills:['tomatoes','mince']},'He has a car. He is having tea now.'],
 apply:['small envelope','No, I don’t. I only have large ones.',{fills:['We','potatoes']},['They','don’t have','any grapes','but they have','some bananas'],'a bottle of glue','No, thank you.','It’s ten o’clock.',['My change','please']],
 exam:['an envelope',{locate:'glue'},'大号信封、大本信笺簿、一瓶胶水','店员提出小盒，但她说No, thank you.','不能，原文没有给出金额','I have an envelope.',{fills:['have','has']},['I','don’t have','any soap'],['Do','they','have','any glue'],{fills:['do','don’t']},{fills:['some','any']},{fills:['grapes','writing paper']},{fills:['peaches','potatoes']},'Lily has a bike.','They are having breakfast now.','We don’t have any bread, but we have some biscuits.',{fills:['They','eggs']},{fills:['ones','one']},{pairs:[['a bottle of','glue'],['a box of','chalk']]},'It’s three o’clock.',{pairs:[['23rd','twenty-third'],['24th','twenty-fourth'],['30th','thirtieth'],['36th','thirty-sixth']]},'I only have small envelopes. Do you want some?',['I','don’t have','any honey','but I have','some jam']]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit59-60/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit59-60/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
