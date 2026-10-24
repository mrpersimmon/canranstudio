 'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against textbook170–173 / guide146–147.
// Only operate page controls. Do not import production answers or inject progress.
const ANSWERS={
listen:['pack',{pairs:[['suitcase','行李箱'],['mess','杂乱'],['leave','离开']]},'已经','刚刚',{pairs:[['peaches','桃子'],['lettuce','生菜'],['beans','豆子']]},'cabbage','很凌乱','eighteen thousand'],
roles:['他已经吃过午饭','十二点半','吃完午饭后','Carol和Tom正在收拾行李箱','Carol和Tom明天出发','你们真幸运啊','在家里'],
grammar:['已经收拾好，可以带走','她五年前搬来，现在仍住这里',{fills:['have','has']},{locate:'have'},{fills:['packed']},{fills:['had']},['I','have','already','packed','my suitcase'],'他刚刚喝过牛奶',{fills:['have','had']},['Has','she','had','lunch','yet'],'Yes, they have.','No, he hasn’t.',{fills:['yet']},{fills:['any']},{fills:['one','some']},{fills:['ever']},{locate:'not'},'She has','I’ve had lunch. I had it at twelve.','They have',['Have','you','packed','your suitcase','yet'],'我们现在仍住在这里'],
apply:['I’ve packed my suitcase.','No, thank you. I’ve already had lunch.',['I','have','just','had','some milk'],{fills:['haven’t','some']},'No, thanks. I’ve already had one.','No, he hasn’t.',{pairs:[['Have you had lunch?','Yes, I have.'],['When did you have lunch?','At half past twelve.'],['Have you packed your suitcase?','No, I haven’t.']]},'She has lived here for five years.'],
exam:[{pairs:[['pack','打包'],['suitcase','行李箱'],['mess','杂乱']]},'twenty thousand','Carol和Tom正在收拾行李，打算明天出发','在家里','12:30吃午饭，之后喝了一杯咖啡','房间已打扫好，现在是干净的','他两年前搬来，现在仍住这儿',{fills:['have']},{fills:['had']},{locate:'have'},{fills:['has','had']},['Has','Ben','packed','his suitcase','yet'],'Yes, they have.',['We','have','already','had','dinner'],'刚刚收拾好',{fills:['yet']},{fills:['ever']},{locate:'not'},'我以前到访过这个镇',{fills:['had']},'He has',{fills:['any']},'No, thanks. I’ve already had one.','No, thanks. I’ve already had some.',{fills:['haven’t','some']},{locate:'pack'},'No, she hasn’t.',{pairs:[['I have packed my suitcase.','过去做好，现在已准备妥当'],['I have lived here for six years.','从过去开始，一直持续到现在'],['I packed my suitcase yesterday.','明确说昨天发生的事']]}]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit83-84/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit83-84/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
