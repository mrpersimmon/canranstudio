'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer manuscript checked against the textbook and Grammar pages.
// Never obtain expected answers from the rendered unit's data or runtime state.
const ANSWERS={
 listen:[{pairs:[['morning','早晨'],['noon','中午'],['afternoon','下午'],['evening','傍晚']]},'housework',{pairs:[['live','居住；生活'],['stay','待在；停留'],['arrive','到达']]},'lunch','一起喝茶','通常',{pairs:[['dust','掸去灰尘'],['shave','刮胡子'],['type','打字'],['wash','洗']]},'go to bed'],
 roles:['索耶一家',{pairs:[['Mr. Sawyer','goes to work'],['the children','go to school'],['Mrs. Sawyer','stays at home']]},'the children','at noon','drink tea',{fills:['early','late']},'go to bed',{pairs:[['Mr. Sawyer reads his newspaper','usually'],['Mr. and Mrs. Sawyer watch television','sometimes'],['the children do their homework','always']]}],
 grammar:[{fills:['play','plays']},['She','reads','every day'],{fills:['washes']},{fills:['watches','fixes']},'He misses his friends.',{fills:['goes','does']},{fills:['studies']},{fills:['stays','plays']},'We wash the dishes.',{fills:['live']},['She','eats','her lunch','every day'],{fills:['washes','watches']},'try → tries；play → plays',{fills:['Does','read']},'The children do their homework.'],
 apply:[{fills:['at','in']},['What','does','she','do','in the morning'],{fills:['do','do']},{fills:['doesn’t','watch']},['They','usually','drink tea','together'],'They arrive home early.',{pairs:[['21st','twenty-first'],['22nd','twenty-second'],['23rd','twenty-third'],['24th','twenty-fourth']]},'Tom makes the bed in the morning. He sometimes watches television in the evening.'],
 exam:[{fills:['lives','arrives']},{pairs:[['wash the dishes','housework'],['finish the maths exercises','homework']]},'lunch → noon；homework → night','Mr. Sawyer送孩子们','放学回家 → 做作业 → 睡觉','孩子们到家早；父母有时一起看电视',{locate:'Anna'},['He','opens','the window','every day'],{fills:['finishes']},'He catches the bus every day.',['Dad','fixes','bikes'],{fills:['misses']},{fills:['goes','does']},'Tom carries a bag.','stays / plays',{fills:['live','go']},{fills:['Does','read']},['She','doesn’t','type','at night'],'Anna通常在夜晚读书',['They','come','home','late'],{fills:['in','at']},{pairs:[['31st','thirty-first'],['32nd','thirty-second'],['33rd','thirty-third'],['34th','thirty-fourth']]},'She always eats lunch at noon. She usually sees her friends in the afternoon.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit55-56/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一段',exact:true}).isVisible())await room.getByRole('button',{name:'下一段',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit55-56/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
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
module.exports={ANSWERS,story,activity,select};
