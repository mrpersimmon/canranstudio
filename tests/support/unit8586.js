'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet checked against textbook174–177 / guide150.
// Operate page controls only; no production-answer imports or progress injection.
const ANSWERS={
listen:['cinema','正在放映哪部电影',{pairs:[['ever','曾经'],['never','从来没有'],['beautiful','美丽的']]},'城市','很糟糕','一直在下雨',{pairs:[['sharpened a pencil','削过铅笔'],['aired a room','给房间通过风'],['dusted a cupboard','给橱柜掸过灰']]},'11th / 15th'],
roles:['Paris in the Spring.','没有，他只是看过这部电影','去年在电视上看过','Ken','一直下雨，天气很糟','虽然老，但很好看','Ken说的那次下雨天气'],
grammar:['她去过巴黎，已经回来','他去电影院了，还没回来','她已在巴黎待了三天，现在仍在那里',{fills:['to','in']},{fills:['been to']},{fills:['been in']},['Have','you','ever','been','to Paris'],{locate:'not'},{locate:'to'},['How long','has','she','been','in Paris'],{fills:['Have','has']},'When did you go there?',{fills:['seen','saw']},{fills:['Did','go']},'Lily has been to the cinema.','他去巴黎了，还没有回来','Ben has been in Paris since Monday.',{pairs:[['She has been to Paris.','去过，已经回来'],['She has gone to Paris.','去了，还没回来'],['She has been in Paris for a week.','已在巴黎待了一周，仍在那里']]}],
apply:['She has been to the cinema.',['Ben','has','gone','to the cinema'],{fills:['in','for']},'No, she hasn’t.',{pairs:[['Have you ever been to Paris?','Yes, I have.'],['When did you go there?','Last April.'],['How long have you been in London?','For three days.']]},{fills:['aired','haven’t']},'I’ve already typed the letter. I typed it at nine this morning.',{fills:['done','did']}],
exam:['Ken去过巴黎，George没去过','《巴黎之春》，去年在电视上','一直下雨',{pairs:[['emptied the basket','倒空过篮子'],['answered the telephone','接过电话'],['turned on the television','打开过电视']]},'13th','He has been to the cinema.','Sue has gone to Paris.','He has been in London for a week.',{fills:['to','in']},'去过两次',{fills:['for','since']},['Has','she','ever','been','to London'],{locate:'not'},{locate:'to'},['How long','have','you','been','in Paris'],{fills:['have','has']},'When did you go there?',{fills:['seen','saw']},{fills:['go']},'I’ve already opened it.',{fills:['washed']},{fills:['done']},'No, she hasn’t.',{pairs:[['I have been to the cinema.','我去过电影院，现已回来'],['He has gone to the cinema.','他去电影院了，还没回来'],['We have been in London for two days.','我们已在伦敦待了两天，仍在那里']]}]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit85-86/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit85-86/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
