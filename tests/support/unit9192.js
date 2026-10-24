'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent expected responses from the reviewed teaching draft and source pages.
// Do not import the runtime answer fields or inject learning/award records.
const ANSWERS={
listen:['move','他仍然在这里',{pairs:[['person','一个人'],['people','人们'],['neighbour','邻居']]},{locate:'miss'},'对Ian的不舍与同情',{pairs:[['tomorrow','明天'],['the day after tomorrow','后天'],['tonight','今晚']]},'请代我问候他',{pairs:[['pack his bags','整理他的行李'],['sweep the floor','扫地'],['make an appointment','预约']]}],
roles:['上星期','仍在这里，尚未搬走','明天下午','她认为他们后天会搬进来','Linda请Jenny代为问候','他一直是好邻居，大家会想念他','妻子想离开这幢房子','同意Ian不想离开'],
grammar:[{fills:['telephone']},{fills:['be','be']},{pairs:[['I will','I’ll'],['they will','they’ll'],['will not','won’t']]},{fills:['won’t']},['Will','you','see','her','tomorrow'],{fills:['will','won’t']},['When','will','he','finish work'],'星期三',{fills:['are','pack']},'根据眼前迹象预测要下雨','队伍按安排九点集合','马上就要开始','return原形',{fills:['be']},{fills:['be','won’t']},'When will Ben arrive? — Tomorrow evening.','有明天整理的打算，不能说已经整理好',{fills:['got','get']}],
apply:['Linda → Jenny → Ian','6月11日下午','Yes, I will.','I’ll help you.','They are going to pack tomorrow.',['When','will','you','repair','my car'],{pairs:[['The team is to meet at nine.','按正式安排集合'],['The bus is about to leave.','马上就要出发'],['I am going to paint this room.','打算粉刷房间']]},'Jenny认为他们后天会来，尚未入住'],
exam:['房子已售，Ian尚未搬走','Ian的妻子','我会想念你',{fills:['person','people']},{fills:['paint']},{fills:['be']},{fills:['won’t']},['Will','they','arrive','tomorrow'],'No, they won’t.',['When','will','she','telephone','you'],{pairs:[['he’ll','he will'],['it’ll','it will'],['won’t','will not']]},'星期日晚上','后天夜里',{fills:['is','drive']},'根据眼前迹象预测快掉下去','按安排来访者十点到达','The bus is about to leave.','这里两种都可表达我将回来',{fills:['be']},{fills:['snowed','snow']},'不能，需要明天安排或其他依据','I’ll lend you a pen.','Anna想离开','Mia plans to pack on 22 June in the afternoon.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit91-92/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit91-92/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
