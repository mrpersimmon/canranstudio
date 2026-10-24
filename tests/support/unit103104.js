'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet from the reviewed 103–104 draft and original pages.
// Do not read runtime answer fields or inject learning / award records.
const ANSWERS={
listen:['paper',{pairs:[['exam','考试'],['pass','及格；通过'],['fail','未及格；失败']]},'其余的题',{locate:'answer'},'分数低／墙矮','鼓励Richard振作',{pairs:[['cheap','便宜的'],['fresh','新鲜的'],['sour','酸的']]},'意为笨的，带贬义；不能由一道题不会就给人贴标签'],
roles:['他认为自己及格了','对他不够容易，希望没不及格','16道','除那16道之外的其余题','Gary在表达自己的评价','先写了姓名，之后没有写答题内容','3小时','不能，文中没有最终成绩'],
grammar:[{fills:['too']},'不能，还需要知道我的能力',{fills:['enough']},{fills:['enough']},['slowly','enough'],['We have practised','enough'],{fills:['him','lift']},'The box is light enough for me to carry.',{fills:['big']},'It isn’t light enough for me to carry.','Paul',{fills:['could']},{fills:['couldn’t','write']},'A说过去能力，B是现在的礼貌请求',['Could I','borrow your pen','please'],{fills:['can','can’t']},{fills:['enough','enough']},'Yes, she could.',['Could you','explain this word','please'],'The print is too small for her to read.'],
apply:['There aren’t enough cards.','B · 内宽45 cm','Mia','The music is too loud for Kim to read.','She could read, but she couldn’t write.',['Could you','speak up','please'],'Yes, you can. Here you are.','Cheer up. Let’s wait for the results.'],
exam:['Richard认为自己及格，正式成绩仍未给出','Richard说能回答16道，不能据此确定分数或总题数','three hours','Gary的评价','写了姓名后没有写答题内容',{fills:['too']},'不能，very本身不表示所有人都无法完成',{fills:['enough']},{fills:['enough']},['clearly','enough'],['I have read','enough'],{fills:['them','move']},'The questions are easy enough for her to answer.',{fills:['big']},'The shelf isn’t low enough for him to reach.','Tom',{fills:['could']},{fills:['couldn’t','ride']},'Yes, he could.','No, he couldn’t.',['Could I','use your ruler','please'],'Of course. Let me help you.',{fills:['can','can’t']},'A是过去能力，B是现在礼貌请求']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit103-104/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit103-104/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
