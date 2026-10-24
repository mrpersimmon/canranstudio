'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet: textbook142–145, guide Grammar129, workbook202–207.
// Do not read lesson answer fields, internal state or bypass learner actions.
const ANSWERS={
 listen:['a phone',{pairs:[['once','一次'],['twice','两次'],['three times','三次']]},'接了电话',{pairs:[['yesterday','昨天'],['the day before yesterday','前天'],['the night before last','前天夜里']]},'她觉得他很讨厌','又一次','emptied the basket','你对他说了什么'],
 roles:['昨天4次，前天3次','Pauline’s boss','typing letters','没有接','at nine o’clock','Pauline本人','Pauline以母亲口吻说，请别再打给女儿','No, he didn’t.'],
 grammar:[{fills:['cleaned']},{fills:['played']},{fills:['worked']},{fills:['arrived']},{fills:['emptied']},{fills:['played']},{fills:['stopped']},{fills:['opened']},{fills:['said']},{fills:['didn’t answer','telephone']},{fills:['Did','arrive']},'Yes, he did.','No, they didn’t.',{locate:'telephone'},['When','did','you','arrive home'],'She answered the phone.',{fills:['washes','washed']},{fills:['play','stayed']}],
 apply:[{fills:['cleaned']},'I answered the phone at nine yesterday evening.','Yes, I did.','I turned on the television this morning.',['When','did','she','telephone her husband'],'No, we didn’t. We stayed at home.','Monday','She listened to the radio.'],
 exam:[{pairs:[['telephone','打电话'],['answer','接听；回答'],['awful','糟糕的']]},'twice','前天夜里','He sharpened the pencil.','Ron昨天4次、前天3次给Pauline打电话','老板接听；Pauline正在打信','前一次没接，九点接了','Pauline，用母亲的口吻','Ron后来没有再次打电话',{fills:['rained']},{fills:['walked']},{fills:['watched']},{fills:['shaved']},{fills:['studied','enjoyed']},{fills:['planned','listened']},{fills:['said']},{fills:['didn’t open']},{fills:['Did','air']},'Yes, he did.','No, she didn’t.',{locate:'empty'},['When','did','they','play a game'],'They climbed the hill.','Yes, we did.',{fills:['arrives','arrived']},'I didn’t play a game. I stayed at home last night.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit71-72/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit71-72/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
