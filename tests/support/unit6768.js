'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet from textbook paper134–137 and guide Grammar122.
// Never read a program answer field to choose an option.
const ANSWERS={
listen:['the greengrocer’s',{pairs:[['Monday','星期一'],['Tuesday','星期二'],['Wednesday','星期三']]},'Jimmy没去上学',{pairs:[['Thursday','星期四'],['Friday','星期五'],['Saturday','星期六'],['Sunday','星期日']]},'你们身体都好吗','乡下','度过'],
roles:[{pairs:[['Mrs. Williams','肉店'],['Mrs. Johnson','果蔬店']]},'He’s very well.','Monday to Thursday','Very well, thank you.','计划去乡下住三天','Mrs. Johnson的母亲家','你们真幸运'],
grammar:['我昨天在家',{fills:['was','were']},{fills:['were','were']},{fills:['was','were']},{fills:['was','is']},{pairs:[['was not','wasn’t'],['were not','weren’t'],['is not','isn’t']]},['They','were','not','at home','yesterday'],['Was','Pam','at school','yesterday'],{fills:['Were','was']},'Yes, I was.','No, we weren’t.',{fills:['was','wasn’t']},{fills:['Where','When']},['When','was','she','at the dairy'],{fills:['were','are']},{locate:'was'}],
apply:['I was at the baker’s.','On Saturday.',{fills:['was','is']},['Where','were','you','on Tuesday'],{fills:['at','on']},{fills:['home','the office']},'twenty to two',['We','were','at church','on Monday']],
exam:[{pairs:[['the dairy','乳品店'],['the baker’s','面包店'],['the grocer’s','食品杂货店']]},{pairs:[['Tuesday','星期二'],['Thursday','星期四'],['Saturday','星期六']]},'在乡下度过周末','Williams刚才在肉店，Johnson刚才在果蔬店','今天身体很好；上周一至四缺课','Friday, Saturday and Sunday','计划住在Johnson夫人的母亲家','不能，只说了昨天在家',{fills:['was','were']},{fills:['was','were']},{fills:['was','is']},['She','was','not','absent from school','last week'],['Were','they','in the country','yesterday'],'Yes, I was.','No, we weren’t.',{locate:'weren’t'},{fills:['Where']},['When','was','she','at the office'],{fills:['at','on']},{fills:['home','the office']},'at church / at school','twenty-five past one','都表示1:50','We were at the dairy at one thirty-five yesterday.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit67-68/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit67-68/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
