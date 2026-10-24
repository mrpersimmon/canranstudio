'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet authored from textbook154–157 / guide137.
// Do not read lesson answer fields or inject learner progress.
const ANSWERS={
 listen:['a pair of shoes',{pairs:[['buy','买'],['wear','穿；戴'],['ago','以前']]},'现在流行','不舒服',{pairs:[['buy','bought'],['wear','wore'],['have','had']]},'Size five.','一个月以前'],
 roles:['黑色，5号','女士的姐姐，在美国','一个月前有，现在没有','去年和前年','恐怕不能帮她找到这一双','穿着不舒服','这是他的说法，不能代表每个人'],
 grammar:[{locate:'last month'},{pairs:[['last week','上周'],['last month','上个月'],['last year','去年']]},'yesterday evening',['She','bought','these shoes','two weeks','ago'],{fills:['minute','minutes']},'下午3点',{fills:['in']},'周一','2024年',{fills:['asked']},'不能，还要看事情是否发生',{fills:['did','buy']},'I wore them yesterday.',{fills:['went','yesterday']},'She went to the shop two days ago.','When did you buy them? — I bought them last year.'],
 apply:['the month before last','None now.',{fills:['in']},'I washed my hands at ten this morning.',['When','did','you','look at','that photograph'],'I watched television every day this week.','I bought them two days ago and wore them yesterday.'],
 exam:[{pairs:[['pair','双；对'],['fashion','流行式样'],['ago','以前']]},'wear','它们流行，但不舒服','Sister · in the U.S. · last month','类似女士样鞋的鞋','他正在推荐的另一种鞋','推荐的鞋不舒服；没有交代买没买',{fills:['last']},'yesterday evening',{pairs:[['the week before last','上上周'],['the month before last','上上个月'],['the year before last','前年']]},{fills:['days','ago']},'上午8点',{fills:['in']},'周四',{fills:['typed']},'this week不代表已经去过',['When','did','you','wear','them'],'I bought it last month.',{fills:['buy','bought']},'They drank some milk yesterday.','Ann','When did she dust the cupboard? — She dusted it three days ago.','We had these shoes last year, but we don’t have any now.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit75-76/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit75-76/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
