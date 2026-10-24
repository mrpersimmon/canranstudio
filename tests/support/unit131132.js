'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed visible premises and source pages; no runtime answers.
const ANSWERS={
listen:[{pairs:[['Egypt','埃及'],['abroad','在国外；到国外'],['worry','担忧']]},{pairs:[['make up one’s mind','打定主意'],['look after','照料；照看'],['in the end','最后；终于']]},'by sea','最后',{fills:['worried']},{locate:'look after'},'对正在听话的Gary及同行的人'],
roles:['故事中的今年','妻子想去，他也想去，但还拿不定主意','没有，Gary说可能乘船','没有，他说可能便宜，但花时间长','Martin很有把握，Gary提醒他别那么肯定','不能，只说明可能哪里也去不了','Gary在表达自己的评价','狗、房子、花园','不能，这是Gary接着每年情况作的概括，今年仍未定','他们还没决定安排，又担心谁照看狗、房子和花园'],
grammar:['We may go tomorrow.',{fills:['be','go']},['We','may','travel','by air tomorrow'],['He','may','not','come tonight'],'两句都可表示明天可能下雨，不能仅凭词硬定百分比',{fills:['Maybe','may be']},['He','may','be','reading'],{fills:['been']},{fills:['forgotten']},['They','may','have been','playing'],{fills:['be','have been']},['She','may not','have','heard the phone'],'She may be at home.',['They','may','go','abroad'],{fills:['our','her']},['I’m not sure.','She may','have been','Russian'],{fills:['Yes','No']},'不同，A是可能不来，B是没有许可'],
apply:['这两条虚构方案中，乘船较便宜但用时较长','We may travel by sea. We’re not sure.','照看房子',['He','may','be','reading now'],'I may have passed the exam. I’m not sure.',{fills:['seen','sure']},'It may be cheaper, but it takes a long time.','不能，今年仍未定，后面是Gary对每年情况的概括'],
exam:[{pairs:[['Egypt','埃及'],['abroad','在国外；到国外'],['worry','担忧']]},'两人都想去，但还没决定',{fills:['be','leave']},['She','may','visit','tomorrow'],['We','may','not','leave today'],'两句都能表示明天可能出发，不能凭词指定百分比',{fills:['Maybe','may be']},['They','may','be','waiting'],{fills:['been']},{fills:['taken']},['He','may','have been','reading'],{fills:['be','have been']},['He','may not','have','heard the question'],'She may be at the station.',['We','may','go abroad'],{fills:['their','his']},'I’m not sure. They may have been bakers.',{fills:['Yes','No']},'A是可能不在；B是规则不允许','不能，还没有回复','It may be cheaper, but it takes a long time.','没有，课文仍保留可能与未决定']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit131-132/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit131-132/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
