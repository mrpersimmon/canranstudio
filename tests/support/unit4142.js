'use strict';
const {expect}=require('@playwright/test');
const {select}=require('./units1-30-tasks');
// Manually reviewed against the three source PDFs and the teaching manuscript.
// Tests only operate visible inputs; no reads of production answer fields.
const ANSWERS={
 listen:['cheese','soap',{pairs:[['tea','茶'],['coffee','咖啡'],['milk','牛奶']]},'面包','chocolate','sugar',{pairs:[['tobacco','烟草；烟丝'],['bird','鸟'],['tin','罐']]}],
 roles:['不太重','this chair',{pairs:[['sugar','一磅'],['coffee','半磅'],['tea','四分之一磅']],leftLabel:'物品',rightLabel:'原文中的量'},'a bar of soap · a bar of chocolate','Penny'],
 grammar:[{fills:['is','is']},{fills:['are','is']},{pairs:[['a loaf of bread','一条面包'],['a bar of soap','一块肥皂'],['a bottle of milk','一瓶牛奶']],leftLabel:'数量表达',rightLabel:'意思'},'two loaves of bread',['Half','a pound','of coffee'],{fills:['some','a']},['Is there','any tea','in that tin'],{fills:['any']},['Is there','a bird','in that tree'],{fills:['one','some']},{fills:['is','are']},['There are','three bars','of soap']],
 apply:['bread','两瓶牛奶','No, there isn’t.','桌上',['There is','a bottle','of milk','on the table']],
 exam:['bread',{pairs:[['sugar','糖'],['tea','茶'],['soap','肥皂'],['chocolate','巧克力']]},'不太重；放到椅子上',{fills:['half','a quarter of']},'Sam',{fills:['loaf','piece']},{fills:['are','loaves']},{fills:['a','some']},['Is there','any sugar','in that bag'],['There isn’t','any tea','in the bag'],{fills:['one','some']},{fills:['in','on']},{fills:['is','are']},'Yes, there is. There are two bottles of milk.']
};
async function story(page,base=''){
 await page.goto(base+'/unit41-42/#learn/text');const room=page.locator('.stage-text');
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=1;i<16;i++)await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit41-42/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 if(await room.locator('.practice-finish').isVisible())return;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(check).toBeDisabled();
  await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);
  await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');
 return room;
}
module.exports={ANSWERS,activity,story};
