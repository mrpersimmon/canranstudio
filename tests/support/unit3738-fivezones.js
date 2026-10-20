'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./unit37-38-flow');
const {ANSWERS:OLD,DIALOGUE}=require('./unit37-38-flow');
// Independent manuscript: reviewed source pages and target map, never runtime answers.
const SPEAKERS=['Dan','Dan','George','George','Dan','Dan','George','George','Dan','George','Dan','George','Dan','George','Dan','George','George','George'];
const ANSWERS={listen:OLD.listen,roles:OLD.roles,
grammar:[{cloze:['am','make']},'会议预计按计划在九点开始。','看这些迹象，可能很快要下雨。',{cloze:['not']},{cloze:['Is','he is']},'说话人的弟弟。','早餐吃鸡蛋。','对方寄来了一封信。','来取自己的书包。','我支持你的计划。',{cloze:['example']},...OLD.observe],
apply:[...OLD.be,...OLD.trans,{match:[['This cake is for Lily.','这个蛋糕是给莉莉的。'],['I have fish for lunch.','我午餐吃鱼。'],['Thank you for your help.','谢谢你的帮助。']]},'Yes, I am.'],
exam:[...OLD.exam,'英语课按安排将在八点开始。','看样子盘子快要掉下来了。',['I','am','not','going','to','paint','this','table.'],'Is Lily going to make a cake? — No, she isn’t.',{cloze:['for']},{cloze:['for']},'对方帮助了说话人。',{match:[['They are going for a walk.','他们要去散步。'],['We are for this plan.','我们支持这个计划。'],['For example, we can draw a cup.','例如，我们可以画一个杯子。'],['Who are they waiting for?','他们在等谁？']]}]};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit37-38/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit37-38/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward){
  const card=room.locator('.completion-card');
  // A server-confirmed award may appear after numeric results are already in
  // the DOM. Follow the public settlement sequence before the next activity.
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-result-motion','finished');
 }
 return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
