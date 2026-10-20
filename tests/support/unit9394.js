'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet from the reviewed 93–94 teaching draft.
// Never read runtime answer keys or inject learning/award state.
const ANSWERS={
listen:['pilot',{locate:'return'},{pairs:[['fly','原形'],['flew','过去式'],['flown','过去分词']]},{pairs:[['New York','纽约'],['Tokyo','东京'],['Madrid','马德里']]},{pairs:[['Athens','雅典'],['Geneva','日内瓦'],['Stockholm','斯德哥尔摩']]},'几乎每一个国家','住在隔壁的邻居',{pairs:[['at the moment','现在'],['the week after next','下下周'],['the year after next','后年']]}],
roles:['现在是飞行员，曾在英国皇家空军任职','Madrid','New York','the month after next','London · the week after next','Spain','只有四十一岁，已去过几乎每个国家','她通常待在家里'],
grammar:['He arrived at nine.',{fills:['returned']},'She has been here for an hour.',{fills:['been']},{fills:['had']},{fills:['kept']},{fills:['on']},{fills:['over']},'She has been a member of the team since 2020.',{fills:['lived']},{fills:['kept']},{fills:['been','had']},{fills:['up']},'这两周里他没有来过这里','不能，还需知道他后来是否离开',{fills:['did','will']},'2027年1月',{fills:['to','from']},'The plane has just arrived.',{fills:['had']},['When','will','you','return','to London'],{fills:['borrowed','kept']}],
apply:[{pairs:[['A week ago','Flew to Spain'],['At the moment','In Madrid'],['Next month','Will fly to New York']]},'2027年2月',['When','will','you','return','to London'],'Mia has kept the book for two days.',{fills:['been']},'Lily will go with him.','No, I won’t fly to Tokyo. I’ll fly to London.','不能，她后来已卖掉相机'],
exam:['现在在Madrid，一星期前飞往Spain',{pairs:[['next month','New York'],['the month after next','Tokyo'],['the week after next','London']]},'他去过世界上几乎每个国家',{fills:['flew','flown']},{pairs:[['Mumbai','孟买'],['Seoul','首尔'],['Sydney','悉尼']]},{fills:['from','in']},{fills:['went','go']},'2026年',['When','did','you','fly','to Rome','last year'],['When','will','they','return','to Sydney'],'She has been in the library for two hours.','I have just bought a book.',{fills:['had']},{fills:['kept']},{fills:['been']},{fills:['on','over']},'Ben has been a member of the team since 2018.',{fills:['lived']},{fills:['kept']},{fills:['been','had']},{fills:['up']},'这一个月没有买过书','不能，九点已经回来了','No, he won’t arrive from Moscow. He’ll arrive from Madrid.','Beth.','She has been at home for two days. She will fly to Paris tomorrow.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit93-94/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一段',exact:true}).isVisible())await room.getByRole('button',{name:'下一段',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit93-94/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
