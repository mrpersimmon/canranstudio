'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed from the textbook and teaching brief. No runtime answers.
const ANSWERS={
listen:['model',{pairs:[['afford','付得起'],['price','价格'],['deposit','预付定金']]},'分几期付款购买','它值这个价钱','比那个便宜些','困难的',{pairs:[['interesting','有趣的'],['comfortable','舒适的'],['important','重要的']]},{locate:'price'}],
roles:['Mr. Frith','较贵的500英镑，另一个300英镑','喜欢电视机，但不喜欢价格，认为付不起','店员','Mr. Frith的判断',{fills:['30','14']},'先付30英镑，再每月14英镑，付三年','这是Mr. Frith的说法，不能据此确定所有富翁习惯或购买结果'],
grammar:[{fills:['more','most']},{fills:['less','least']},'more expensive',{fills:['as','as']},{fills:['heavy']},['Box A is','not as heavy as','Box B'],'not as comfortable as和not so comfortable as都可以','不能，资料只说明重量相同','A 20 cm，B 10 cm','不能，只能确定A相对更凉一些','Yes, it is.','No, it isn’t.','B is not as expensive as A.','能，20英镑正好覆盖20英镑价格',{fills:['most','least']},'说话人曾经读过的书',{fills:['more','less']},{fills:['comfortable','as']},'A比B暖一些，不等于A很热',['The blue model is','the most expensive','of the three']],
apply:['B · £40','A · 2 kg','不能，还需要质量方面的资料','A is as clear as B.','How much does this model cost?','£50','For Mia, C is the most difficult of these three tasks.','Model A · £40'],
exam:[{fills:['500','300']},{fills:['30','14']},'三年','喜欢电视机，但不喜欢价格','Mr. Frith的评价','Mr. Frith对百万富翁的说法，不作为所有人的消费规律',{fills:['more','most']},{fills:['less','least']},{fills:['as','as']},{fills:['long']},'not as expensive as和not so expensive as都可用','重量相同，不能推出价格或质量相同','A 15 cm，B 8 cm','A比B暖一些，不能因此认定A很热','Yes, it is.','No, it isn’t.','A is not as expensive as B.',['The blue model is','less expensive than','the red one'],'不能，还不知道C的价格','说话人曾经读过的书','不能，还要核对后续款项与相应条件','£534','没有，例题否定并改换了原来的比较，还增加最高级范围','没有确认，询问方案不等于已经购买']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit111-112/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit111-112/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
