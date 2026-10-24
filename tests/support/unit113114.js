'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against source pages and the teaching brief.
// Never read runtime answer fields or inject records and stars.
const ANSWERS={
listen:['note',{pairs:[['conductor','售票员'],['passenger','乘客'],['fare','车费；票价']]},'把这张纸币兑换开','一点零钱也没有','我也不能换开纸币','我也有一些零钱',{pairs:[['small change','零钱'],['get off','下车'],['except','除……外（不包括）']]},{locate:'Except'}],
roles:['Trafalgar Square','纸币面额是十英镑，车费未给出','第一位没有零钱，第二位也没有','第四位乘客，承接第三位说不能换开纸币','两位流浪汉','售票员当时的说法，不能当作财富调查结果','不能，原文没有给两人的零钱总额','不能，这是售票员的要求，后文未交代实际下车或成交'],
grammar:[{fills:['can','can']},{fills:['So','Neither']},{fills:['am','is']},{fills:['was','were']},{fills:['do','does']},{fills:['did','did']},{fills:['will','will']},'Neither could I.','So must I.','So have I.',{fills:['has','have']},{fills:['is','are']},'So did I.',['Neither','can','I'],'Neither am I.',{fills:['too','either']},{fills:['no','none']},{fills:['saw','no']},{fills:['of']},'不能，还要知道B是否也喜欢','A: Yes, I have. B: No, I haven’t.','Neither can I和Nor can I都可用',{fills:['So','Neither']},{fills:['am','were']},{fills:['does','did']},['I','can’t swim','either']],
apply:['A · 0枚','A · 五枚£2','So can I.','I can’t swim.','两人都没有信封',['Except','us'],'每种面额和数量，才能算总额',['So','was','I']],
exam:['两位流浪汉','small change','第四位乘客','不能，是售票员当时的概括','两人说有零钱，但未写换钞、买票或下车结果',{fills:['So','Neither']},{fills:['am','is']},{fills:['was','were']},{fills:['does','do']},'So did I.',{fills:['will','could']},'So must I.','So have I.',{fills:['has','have']},{fills:['is','are']},['Neither','can','I'],{fills:['too','either']},{fills:['no','none']},{fills:['saw','no']},'None of the four people can change the note.','可以，none可承接牛奶的零数量','Neither can I与Nor can I都可用','不能，需要B的实际喜好','Yes, I have.','No, I haven’t.',{fills:['us']}]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit113-114/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit113-114/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
