'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independently authored from textbook158–161 / guide140. Exercise only the UI;
// never import the course's answer fields or inject a completed record.
const ANSWERS={
 listen:['appointment',{pairs:[['urgent','急迫的'],['wait','等待'],['till','直到……为止']]},'牙齿','很难受',{pairs:[['a.m.','上午'],['p.m.','下午'],['at the moment','此刻；现在']]},'等到两点','牙科医生正忙着'],
 roles:['上午；Good morning.','没有预约','牙痛得很厉害，感觉很难受','4月24日星期一上午10点','下午2点','牙科医生，不能现在接诊他','牙痛难受，他很想尽快得到帮助'],
 grammar:[{locate:'Can’t'},{pairs:[['isn’t','is not'],['don’t','do not'],['can’t','cannot']]},['Is','he','not','a dentist'],{fills:['Isn’t']},['Can’t','you','come','a little earlier'],{fills:['Doesn’t']},{fills:['call']},'Yes, she is.','No, he isn’t.','Yes, I can.','No, I can’t.','Yes, I do.','No, I didn’t.',{pairs:[['Isn’t he at home?','惊讶地在公园发现原以为在家的人'],['Isn’t it beautiful?','欣赏花园时赞叹它漂亮'],['Didn’t I tell you?','提醒同伴自己已经说过了']]},'邀请对方一起吃午饭','希望你能早点来','Yes, I do.','No, he doesn’t.'],
 apply:['10 a.m. · Monday, April 24th','14:00',{pairs:[['at','ten o’clock'],['on','Tuesday'],['in','May']]},'2025年11月5日','10:45',{fills:['aired']},'No, I can’t.',['He','lost','his pen','on Saturday']],
 exam:[{pairs:[['appointment','预约'],['urgent','急迫的'],['till','直到……为止']]},'牙痛很厉害，感觉很难受','今天下午','他原先没有预约，护士提出了时间','下午2点；牙科医生此刻很忙','他痛得难受，迫切想得到帮助',['Is','she','not','a nurse'],'Aren’t they here?',{fills:['Doesn’t']},{fills:['lose']},['Can’t','you','wait','till three'],'Yes, she is.','No, I can’t.','Yes, I do.','No, he didn’t.','Thank you.','赞叹花园漂亮',{fills:['at']},{fills:['on']},{fills:['in','in']},'I painted it in 2021.','I saw him at half past seven.',{pairs:[['buy','bought'],['lose','lost'],['empty','emptied']]},'She listened to the news yesterday.','Ann','When did she meet him? — She met him in November.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit77-78/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit77-78/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
