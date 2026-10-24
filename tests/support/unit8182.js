 'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against textbook166–169 / guide144.
// Only operate page controls. Do not import production answers or inject progress.
const ANSWERS={
listen:['烤的',{pairs:[['breakfast','早饭'],['lunch','午饭'],['dinner','本故事中的晚饭']]},'快好了','haircut',{pairs:[['restaurant','餐馆'],['party','聚会'],['holiday','假期']]},'我准备好了',{pairs:[['have a lesson','上课'],['have a good time','玩得开心'],['have a bath','洗澡']]}],
roles:['Sam','楼上，正在洗澡','礼貌地谢绝提议','七点','在餐馆','她准备的晚饭和他们午饭吃的一样','Tom和Sam吃过午饭'],
grammar:[{locate:'have'},{fills:['drank']},{pairs:[['have a swim','游泳'],['have a lesson','上课'],['have a good time','玩得开心']]},{fills:['has']},{fills:['having']},{fills:['is','having']},{fills:['had']},['Did','you','have','a swim','yesterday'],{locate:'had'},'Yes, I did.',['Do','you','have','lessons','on Friday'],{fills:['does','have']},{fills:['are','have']},['They','must','have','a meal'],'She is having lunch.',{fills:['不填词','a']},['Are','they','having','lunch','now'],['What','did','she','have','for lunch']],
apply:['I had a lesson at nine.','He is having a swim.','We’re going to have dinner.',['I','had','bread and milk','for breakfast'],{fills:['had','have']},'At a restaurant.','We enjoyed ourselves.',{pairs:[['What do you have for breakfast?','Bread and milk.'],['When do you have breakfast?','At seven.'],['Do you have breakfast at home?','Yes, I do.']]}],
exam:[{pairs:[['nearly','将近'],['ready','准备好的'],['restaurant','餐馆']]},'We had a holiday.','Tom and Sam','午饭和准备的晚饭都是烤牛肉和土豆','七点可以吃晚饭，谈话时还快好了','喝茶或吃茶点的活动',{fills:['has']},{fills:['having']},{fills:['are','having']},{fills:['had']},['Did','they','have','a party','last night'],{locate:'had'},'No, I didn’t.',['Does','he','have','lessons','on Sunday'],{fills:['does','have']},['We','are going to','have','a party','tomorrow'],{fills:['have']},'They are having a lesson.',{fills:['不填词','a']},{pairs:[['I had some milk.','I drank some milk.'],['They had a meal.','They ate a meal.'],['You had a good time.','You enjoyed yourself.']]},{fills:['are eating']},'Eat','We had a lesson today.',{fills:['had','have']},['What','did','she','have','for dinner yesterday'],'In the classroom.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit81-82/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit81-82/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
