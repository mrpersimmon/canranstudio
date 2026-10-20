'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed against textbook pages and the lesson draft.
// Never derive this sheet from runtime answer fields or inject progress/stars.
const ANSWERS={
listen:['dress',{pairs:[['madam','女士；夫人（尊称）'],['suit','适合'],['as well','也；同样']]},'漂亮、时髦',{locate:'suit'},'绿裙也太小，但不说明两裙一样大','它根本不适合我','漂亮的','尺码'],
roles:['喜欢颜色，但对她太小','All right.','绿裙更小','绿色的','女士的看法','像那件蓝裙、而且尺码适合她的','这家店里的衣服；不能保证合身','没有交代购买结果'],
grammar:[{fills:['smaller','smallest']},{fills:['larger','largest']},{fills:['heavier','heaviest']},{fills:['hotter','hottest']},{fills:['more','most']},{fills:['less','least']},{fills:['better','best']},{fills:['worse','worst']},['The red ruler is','longer than','the blue one'],{fills:['the']},'可以，比较对象可由当前袋子理解','还不能，C的长度未知','The day before yesterday was the hottest of these three days.','dress','不能，还要知道其他箱子的重量','说话人见过的那些物品',{fills:['wetter','nicest']},['The green case is','the heaviest','of the three'],{fills:['more','least']},'Box A is bigger than Box B.'],
apply:['The blue case is heavier than the brown one.','green',['The blue hat is','less expensive than','the red one'],'B · blue / M','C is the largest box in Shop A.','Mia thinks the blue dress is prettier.','还要比较同一范围内其他袋子的重量','Could you show me a larger one, please?'],
exam:['绿裙更小，两件对女士都太小','女士表达的看法','不一定，原文说这件对她仍太小','没有交代',{fills:['cleaner','cleanest']},{fills:['nicer','nicest']},{fills:['easier','easiest']},{fills:['thinner','thinnest']},{fills:['more','most']},{fills:['less','least']},{fills:['better','best']},{fills:['worse','worst']},['The red ruler is','longer than','the blue one'],{fills:['the']},'没有，比较对象是当前这条围巾','不能，C的重量未知','Yesterday was the hottest of these three days.','dress','不能，还需要其他帽子的价格','说话人曾经见过的建筑',{fills:['shorter']},'All right, thank you.',{fills:['either']},'根本不适合我']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit107-108/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit107-108/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
