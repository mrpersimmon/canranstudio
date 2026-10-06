'use strict';
const {expect}=require('@playwright/test');
const legacy=require('./units1-30-tasks');
// Independent transcription of the reviewed teaching draft; no runtime answers.
const ANSWERS={
 '1-2':{
  listen:[{pairs:[['coat','外套'],['dress','连衣裙'],['skirt','半身裙']]},'pen','house','pencil'],
  roles:[['这是','你的','手提包','吗？'],'女士请他重复。','very much','对面的女士'],
  manners:[{fills:['me']},'Yes?','Yes, it is.','女士',['Thank','you','very much']],
  ask:['watch','衬衫'],trans:[{fills:['book']},['Is','this','your','car']],
  exam:[{fills:['Yes?','Yes, it is.']},'Yes, it is. Thank you very much.','your 指女士的；it 指手提包','Pardon?','Excuse me!','铅笔',['Is','this','your','coat?'],'房子']
 },
 '25-26':{
  listen:[{pairs:[['on the left','在左边'],['on the right','在右边'],['in the middle','在中间']]},'refrigerator','kitchen','太太','用电的','炉灶；炊具','房间'],
  roles:['of the room','蓝色 · 左边','refrigerator'],
  observe:[['桌子上','有','一个瓶子'],{fills:['an','The']}],
  be:[{fills:['in']},{fills:['clean']},'It is in the cupboard.'],trans:[["There's",'a','fork','on','the','tin']],
  errands:['换成橱柜里干净的杯子。','Where is it?'],
  exam:['甲图','桌上有杯子。','左边 · 右边 · 中间','bottle · cup','It',{fills:['an','The']},['Where','is','the','bottle?'],'There is a bottle in the refrigerator.',"There's a clean cup on the table."]
 }
};
async function select(room,answer){
 if(Array.isArray(answer)&&await room.locator('.translation-input').count()){
  const placed=room.getByRole('group',{name:'已选词块',exact:true});while(await placed.getByRole('button').count())await placed.getByRole('button').first().click();
 }
 return legacy.select(room,answer);
}
async function story(page,pair,base=''){
 await page.goto(`${base}/unit${pair}/#learn/text`);const room=page.locator('.stage-text');
 await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,pair,id,{base='',capture}={}){
 await page.goto(`${base}/unit${pair}/#learn/${id}`);const room=page.locator('.stage-'+id),items=ANSWERS[pair][id];
 await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','');await expect(room).toBeVisible();
 if(await room.locator('.practice-finish').isVisible())return;
 const first=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=first;i<items.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  if(await check.isVisible()){
   if(capture)await capture(room,i,'blank');
   await select(room,items[i]);await expect(check).toBeEnabled();await check.click();
  }
  await expect(room.locator('.fb')).toHaveText('答对了！');
  if(capture)await capture(room,i,'correct');
  await room.getByRole('button',{name:i===items.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function complete(page,pair,base=''){
 await story(page,pair,base);for(const id of Object.keys(ANSWERS[pair]))await activity(page,pair,id,{base});
 await page.goto(`${base}/unit${pair}/#learn/certificate`);await expect(page.locator('#starCount')).toHaveText('15');
}
module.exports={ANSWERS,select,story,activity,complete};
