'use strict';
const {expect}=require('@playwright/test'); const {select:commonSelect}=require('./units1-30-tasks');
// Independent manuscript: sourced from textbook pp114–117 and Grammar p104.
// Expected answers never come from runtime question data.
const ANSWERS={
 listen:["o’clock",'shop','此刻',{pairs:[['by car','乘小汽车'],['on foot','步行']]},{pairs:[['every day','每天'],['usually','通常'],['tonight','今晚']]},'book','living room'],
 roles:[{pairs:[['every day','by car'],['today','on foot']]},'She is going to the shops.','in the garden',{fills:['aren’t','are playing']},'an interesting book',{pairs:[['eight o’clock','children → school'],['ten o’clock','Mrs. Sawyer → shops'],['nine o’clock','Mr. Sawyer → book']]},'不能确定原因，课文没有说'],
 grammar:['平时反复发生的事',{fills:['am','are']},{fills:['drinks','is drinking']},{fills:['coming','swimming']},['They','are not','playing','now'],['Are','the children','reading','now'],{fills:['does','is']},'最近暂时住在这里',{fills:['likes','knows']},{fills:['is reading','wants']},{fills:['walks','is going']},'He isn’t reading. He is cooking.','today不能单独决定时态，要看说的是什么','They are living with us this month.'],
 apply:[{fills:['ten']},['What','are','you','doing','now'],{fills:['Does','Is']},'No, I’m not. I’m reading a book.',['I','usually','cook','in the evening','but tonight','I am reading'],{fills:['at','is shaving']},{pairs:[['13th','thirteenth'],['14th','fourteenth'],['21st','twenty-first'],['22nd','twenty-second']]},'It’s six o’clock. The children are playing in the garden now.'],
 exam:["It’s eleven o’clock.",{fills:['by','on']},{locate:'At the moment'},'平时上午待在家；今天上午去商店','习惯在客厅喝茶，今天下午在花园喝茶','He is reading a book.',['school','shops','garden','book'],'经常发生的习惯',{fills:['am','is']},{fills:['reads','is writing']},['They','are not','watching television','now'],['Is','she','drinking tea','now'],{fills:['do','are']},'My parents live in Beijing.','She is living with her aunt this week.',{fills:['likes','knows']},'I want some tea now.',{fills:['at',"o’clock"]},{pairs:[['11th','eleventh'],['12th','twelfth'],['15th','fifteenth'],['20th','twentieth']]},{fills:['making','running']},'只能确定此刻没做作业，不能断定一整天都没做','She usually drinks tea in the living room, but now she is drinking coffee in the garden.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit57-58/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一段',exact:true}).isVisible())await room.getByRole('button',{name:'下一段',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit57-58/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();
  await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
