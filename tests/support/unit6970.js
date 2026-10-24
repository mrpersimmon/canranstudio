'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet transcribed from textbook pp138–141 and guide Grammar125.
// Page behavior only: never read program answer fields.
const ANSWERS={
 listen:['a car race',{pairs:[['crowd','人群'],['winner','获胜者'],['town','城镇']]},'激动人心的结尾','The blue car is behind the red car.','正好，紧紧地',{pairs:[['January','一月'],['June','六月'],['July','七月']]},'Denmark','在回家的路上'],
 roles:['1995','叙述者、妻子、Julie和Jack','on the left','twenty','不是，还提到法国、德国等国家的汽车','Billy Stewart · car 15','另外5辆车紧随Billy之后','别把回家当比赛，别开太快'],
 grammar:[{fills:['at']},{fills:['at','at']},{fills:['on','on']},{fills:['in','on']},{fills:['in','in']},{fills:['in','in']},{fills:['at']},{fills:['in','in']},{fills:['at','at']},{pairs:[['Feb.','February'],['Sept.','September'],['Nov.','November']]},{fills:['September']},{fills:['23rd']},'October the first / the first of October','同一个日期，两种顺序',['We','were','here','on','June 23rd'],{fills:['不填','不填']},{locate:'in'},{fills:['at','on']},{fills:['at','in']},'On May 25th.'],
 apply:[{fills:['in','in']},'on April 24th at three o’clock','We were in Australia.','They were at the stationer’s.',['When','were','they','in Denmark'],'No, they weren’t. They were at the park.','on Sunday morning','26th June 2017'],
 exam:[{pairs:[['race','比赛'],['crowd','人群'],['winner','获胜者']]},'前者数以百计；后者500人','the stationer’s',{pairs:[['August','八月'],['October','十月'],['December','十二月']]},'每年有比赛；故事回忆1995年那次',{pairs:[['20','参赛车总数'],['15','冠军车号'],['5','紧随冠军的其他汽车数']]},'照片中我们站在左边','她的丈夫，即叙述者','比赛结尾激动人心',{fills:['at']},{fills:['in','in']},{fills:['in']},{fills:['at']},{fills:['at']},{fills:['on','on']},{fills:['in','on']},{fills:['at']},'March · April · November',{fills:['21st','22nd']},'April the twenty-fourth / the twenty-fourth of April','May 25th, 2020 = 25th May 2020',{fills:['不填']},{fills:['at','on']},{fills:['in','in']},'We were at school on February 22nd.',['They','were','in Austria','in August'],'Don’t drive so quickly!','They were at the office on March 23rd at four o’clock.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit69-70/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一段',exact:true}).isVisible())await room.getByRole('button',{name:'下一段',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit69-70/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
