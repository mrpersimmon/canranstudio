'use strict';
const {expect}=require('@playwright/test');
const {select}=require('./units1-30-tasks');
// Independent reviewed answer manuscript: textbook pp86–89, Guide p79,
// workbook pp119–124. Never read answer fields from runtime course data.
const ANSWERS={
 listen:['kettle','茶壶','behind',{pairs:[['find','找到'],['see','看见'],['boil','沸腾；烧开']]},'现在','橱柜',{pairs:[['of course','当然'],['make the tea','沏茶'],['hurry up','快点']]}],
 roles:['behind the teapot','cups','他没有看见茶叶','水壶里的水开了','他不断问茶叶和杯子在哪儿'],
 grammar:['会；能够',{fills:['can','can']},{fills:['make']},{fills:['can’t']},['Can','Penny','find','the cups'],{fills:['can','can’t']},{fills:['some','any']},{fills:['Is','Are']},{fills:['boxes','dishes']},{fills:['knives','shelves']},'Yes, there are.',['I','can’t','see','the tea']],
 apply:['Yes, I can.','茶壶后面','Yes, there are.','水壶前面',['The cups','are','in front of','the kettle']],
 exam:['水壶',{pairs:[['of course','当然'],['now','现在'],['find','找到'],['boil','沸腾；烧开']]},'茶叶','橱柜里有一些杯子','他会沏茶，但不熟悉物品位置',{fills:['can','make']},{fills:['can’t']},['Can','Sam','see','the teapot'],'No, I can’t.',{fills:['Is','Are']},{fills:['some','any']},{fills:['dishes','shelves']},{fills:['wives','loaves']},{fills:['in front of']},'Yes, there are. Sam can’t see them.']
};
async function story(page,base=''){
 await page.goto(base+'/unit43-44/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit43-44/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);
  await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');
 return room;
}
module.exports={ANSWERS,story,activity};
