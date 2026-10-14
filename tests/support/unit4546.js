'use strict';
const {expect}=require('@playwright/test');
const {select}=require('./units1-30-tasks');
// Independently reviewed manuscript: textbook pp90–93, Guide Grammar p82,
// workbook pp126–130. Do not derive expectations from course answer objects.
const ANSWERS={
 listen:['老板','minute','写出来的字迹',{pairs:[['ask','问；请求'],['type','打字'],['lift','举起']]},'饼干','在隔壁','很糟糕'],
 roles:['隔壁的办公室','me','Pamela','她看不懂老板的字迹','她会打字，但这封信的字迹难读'],
 grammar:['I can’t type.',{fills:['can’t','lift']},['Can','Bob','read','this letter'],{fills:['can','can’t']},{fills:['we','they']},'Who can type?',['What','can','she','do'],'Where can I find Pamela?',{fills:['When']},{fills:['How']},['How many','letters','can','you','see'],{fills:['How much']},{fills:['can','type']},['I can','make cakes','but','I can’t','make biscuits']],
 apply:['Can you come here, please?','Pamela','Pamela','I can type, but I can’t read this letter.',['Who','can','read','this letter']],
 exam:[{pairs:[['boss','老板'],['minute','分钟'],['ask','问；请求'],['handwriting','字迹']]},'cake','会打字，但读不懂这封信','老板',{fills:['can’t','lift']},['Can','Pamela','read','this book'],'No, I can’t.',{fills:['we','they']},['Who','can','make biscuits'],['What','can','they','do'],{fills:['Where','When']},{fills:['How']},{fills:['How many']},['How much','water','can','you','see'],{fills:['can','make']},{fills:['but','can’t']},'Here you are.','1,000']
};
async function story(page,base=''){
 await page.goto(base+'/unit45-46/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit45-46/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
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
