'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer review against the source pages and task premises.
// Do not obtain expected answers from the application's questions or state.
const ANSWERS={
listen:[{pairs:[['football','足球'],['win','赢'],['world','世界']]},{pairs:[['poor','贫穷的'],['depend','依靠；取决于'],['dream','梦；梦想']]},'足球彩票',{locate:'pleasant'},'在乡下',{fills:['on']}],
roles:['在填足球彩票的表格','不能，他说差不多完成','Brian确信本周会赢，Julie说以前从没赢过；本周结果未给出','去见见世面','环游世界并住最好的旅馆','回家，在乡下买大房子并有一个漂亮花园','如果把那笔钱全花光','再次赢只是Brian的设想；Julie提醒一切依赖条件'],
grammar:[{locate:'If you finish early'},{fills:['rains','will']},{fills:['arrives']},{fills:['doesn’t','won’t']},['I’ll','call you','if','I','finish early'],['What','will','you','do','if it rains'],'满足条件时可以用，不等于一定使用或已经使用',{fills:['must']},['If you see Anna,','please','give','her this note'],{fills:['如果','是否']},'能，这里的if表示是否，可以谈未来','不能，留下也可能有别的原因',{fills:['No','Yes']},{fills:['am','are']}],
apply:['the hall','还没有，老师尚未检查','不能，没有说明没空时她会怎么做','Not yet. I haven’t seen Anna yet.',['If you borrow this book,','please','return it','on Friday'],'询问Anna明天是否会来',{fills:['can','must']},'If the weather is fine, we’ll go out; no outing has happened yet.'],
exam:[{pairs:[['poor','贫穷的'],['world','世界'],['depend','依靠；取决于']]},{fills:['comes','will']},{fills:['doesn’t','won’t']},['We’ll','wait here','if','the bus','is late'],['What','will','you','do','if you miss the bus'],'有票时可以进去，但尚未证明已经进去',{fills:['must']},['If you arrive first,','please','wait','for us'],{fills:['是否','如果']},'不成立，这里在问是否，will return可以保留','不能，可能有其他开窗原因','不能，原话只说了下雨时的安排',{fills:['am','are']},{fills:['No','Yes']},'Brian说如果赢很多钱，他们会环游世界','回家并在乡下买大房子','想再试着赢，不保证一定成功','快完成了，仍不能写成已经全部完成']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit137-138/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit137-138/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
