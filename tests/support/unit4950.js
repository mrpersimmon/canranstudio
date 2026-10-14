'use strict';
const {expect}=require('@playwright/test');const {select}=require('./units1-30-tasks');
// Page-answer manuscript, independently checked against textbook pp98–101,
// Guide Grammar p91 and workbook pp136–138. Never read runtime answer objects.
const ANSWERS={
 listen:[{pairs:[['beef','牛肉'],['lamb','羔羊肉'],['steak','牛排'],['chicken','鸡；鸡肉']]},'mince',{pairs:[['tomato','西红柿'],['potato','土豆'],['cabbage','卷心菜'],['lettuce','莴苣']]},'豌豆',{pairs:[['pear','梨'],['grape','葡萄'],['peach','桃']]},'丈夫',{pairs:[['tell','告诉'],['truth','实情'],['meat','肉']]},'也不'],
 roles:['steak','lamb','一块牛排和一磅肉馅','Mrs. Bird','老板和Mrs. Bird的丈夫','不能，原文没说明她自己的这个喜好'],
 grammar:['要豌豆还是豆角','or','Lamb, please.',['Do','you','want','beef','or','chicken'],['Is','this','cabbage','or','lettuce'],{fills:['Which','or']},'I want peaches.',{fills:['Yes, please.','Lamb, please.']},'Both, please.','Either.','Neither. I want lamb.',{fills:['All','None']},['Do','you','want','tomatoes','or','potatoes'],'这三种都不要，想要苹果'],
 apply:[{fills:['likes','want']},'No, he doesn’t.',{fills:['too','either']},['Give','that piece','to','me,','please.'],{fills:['don’t','doesn’t']},{fills:['isn’t','aren’t']},{fills:['can’t','am not']},'卷心菜和梨'],
 exam:[{pairs:[['meat','肉'],['beef','牛肉'],['mince','肉馅'],['steak','牛排']]},{pairs:[['pea','豌豆'],['bean','豆角'],['lettuce','莴苣']]},{fills:['lamb','steak']},'丈夫不喜欢鸡肉',{fills:['or']},'A pear, please.',['Do','you','want','steak','or','chicken'],['Is','this','a pear','or','a peach'],['Which','do','you','want,','apples','or','pears'],'Either.','Both, please.','Neither. I want beans.',{fills:['All','None']},{fills:['likes','want']},{fills:['Does','like']},{fills:['do','doesn’t']},{fills:['don’t','doesn’t']},{fills:['isn’t','aren’t']},{fills:['can’t','am not']},{fills:['too','either']},'the butcher',['Give','the beans','to','her,','please.'],'豆角和土豆',{pairs:[['20th','twentieth'],['21st','twenty-first'],['22nd','twenty-second'],['24th','twenty-fourth']]}]
};
async function story(page,base=''){
 await page.goto(base+'/unit49-50/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit49-50/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();
  await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,story,activity};
