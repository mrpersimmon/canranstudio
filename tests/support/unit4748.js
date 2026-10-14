'use strict';
const {expect}=require('@playwright/test');const {select}=require('./units1-30-tasks');
// Independent page-answer manuscript, checked against textbook pp94–97 and
// Guide Grammar pp86–87. Never read expectations from runtime answer objects.
const ANSWERS={
 listen:[{pairs:[['butter','黄油'],['honey','蜂蜜'],['jam','果酱'],['biscuit','饼干']]},'新鲜的','成熟的',{pairs:[['pure','纯净的'],['sweet','甜的'],['choice','上等的；精选的']]},'want','不加奶的咖啡','orange','黑板'],
 roles:['black coffee',{fills:['Yes, please.','No, thank you.']},'一块饼干','Yes, please, Christine.','她不喜欢咖啡里加奶'],
 grammar:['我的喜好','every day',{fills:['am','is']},['She','is','not','a teacher'],['Are','they','students'],{fills:['like']},{fills:['likes']},{fills:['don’t','like']},{fills:['doesn’t','want']},['Do','you','want','any sugar'],{fills:['Does','like']},{fills:['do','doesn’t']},['He','doesn’t','like','oranges'],{fills:['are','drink']}],
 apply:[['Do','you','like','tea'],'No, thank you.','tea',{fills:['one','any']},['Yes, please.','I want','one'],'茶和一块饼干'],
 exam:[{pairs:[['fresh','新鲜的'],['pure','纯净的'],['ripe','成熟的'],['sweet','甜的']]},'honey','喜欢香蕉，但现在不要','加糖，不加奶','an apple',{fills:['one','any']},'I drink milk every day.','often',{fills:['am','isn’t']},['Is','Ann','a guest'],{fills:['likes']},{fills:['want']},['We','don’t','like','jam'],{fills:['doesn’t','want']},['Do','you','like','eggs'],{fills:['Does','want']},{fills:['do','doesn’t']},'No, thank you.',{fills:['over','under']},{pairs:[['1st','first'],['2nd','second'],['3rd','third'],['12th','twelfth']]}]
};
async function story(page,base=''){
 await page.goto(base+'/unit47-48/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit47-48/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();
  await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');
 return room;
}
module.exports={ANSWERS,story,activity};
