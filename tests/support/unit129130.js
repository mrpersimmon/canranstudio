'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent reviewed answer script, transcribed from source and visible premises.
const ANSWERS={
listen:[{pairs:[['wave','招手'],['track','跑道'],['mile','英里']]},{pairs:[['overtake','从后面超越；超车'],['speed limit','限速'],['sign','标记；牌子']]},{pairs:[['driving licence','驾驶执照'],['charge','罚款（本课用法）'],['darling','亲爱的（称呼）']]},'当时思想不集中、走神',{fills:['overtook']},'dreamed和dreamt都可作过去式与过去分词','每小时70英里的速度',{locate:'advice'}],
roles:['停下来','不能，这是警察责问的说法','警察对Gary刚才速度的推测','警察自述自己的速度','他说没有看见','她否定走神，说当时正在提醒他开慢一点','Gary用Ann刚才的提醒解释自己没看见牌子','警察要求查看驾照','这一次不罚款，同时提醒不要再犯','听她的劝告'],
grammar:[{fills:['must','can’t']},{fills:['have','have']},{fills:['seen']},['He','must','have been','reading'],{fills:['be','have been']},'A是当时必须，B是对过去的推测',{fills:['had to','must have been']},'不能，还可能有其他原因',{fills:['can’t','must']},{fills:['been','been']},{fills:['overtook','overtaken']},'都能，dreamed和dreamt都是过去分词',['You','had better','leave','now'],['You','had better','not','run here'],'had；建议现在出发',['Where','do you think','he is'],{fills:['Yes','No']},'说话人认为她过去不可能在那里'],
apply:['He must have been walking.','70是对Gary的推断；80是警察自述自己的速度',{fills:['had to','must have been']},'I don’t think they were. They can’t have been listening to the radio. They must have been watching television.','It must have been the 20th yesterday.',['You','had better','not','leave your bag here'],['Where','do you think','the licence is'],'不能，只说明这一次'],
exam:[{pairs:[['overtake','从后面超越；超车'],['driving licence','驾驶执照'],['charge','罚款（本课用法）']]},'警察自述自己的速度',{fills:['must','can’t']},{fills:['have','have']},{fills:['taken']},['They','must','have been','waiting'],{fills:['be','have been']},'A讲过去的需要，B讲对过去动作的推断',{fills:['had to','must have been']},{fills:['can’t','must']},{fills:['been','been']},{fills:['overtook','overtaken']},'dreamed与dreamt都能作过去分词',['We','had better','wait','here'],['You','had better','not','open it yet'],'had，建议现在听',['Where','do you think','they are'],{fills:['Yes','No']},'不能，还可能有其他原因','说话人认为他过去不可能看见','这次不罚，不代表以后永远免罚','Gary给出解释，Ann也有回应；不能把Gary的话当成作者核实的唯一原因']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit129-130/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit129-130/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
