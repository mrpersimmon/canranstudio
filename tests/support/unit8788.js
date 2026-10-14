'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet checked against textbook178–181 / guide152.
// Only browser controls are used; do not import lesson answers or inject records.
const ANSWERS={
listen:['garage','接待员',{pairs:[['bring','带来'],['repair','修理'],['try','设法']]},'发生碰撞','lamp-post','他们仍在修理','车现在修好没有','说实话'],
roles:['LFZ 312 G','三天前','仍在修这辆车','车库里','路灯柱','正在设法修，未说明已修好','没有，课文没有说买了新车'],
grammar:['钥匙现在找不到，开不了门',{fills:['brought','brought']},{fills:['Have','have']},['They','haven’t','repaired','the car','yet'],'No, they haven’t. They’re still working on it.','When did you meet her?',{fills:['Did','buy']},{locate:'left'},{pairs:[['buy','bought'],['send','sent'],['sweep','swept']]},{fills:['had']},'He has lived here for ten years.',{fills:['lived']},{fills:['moved']},{fills:['made','made']},'I have cleaned the window.','No, he hasn’t.',['When','did','you','hear','the news'],{fills:['has lived','lived']}],
apply:['Not finished yet.',['We','have','repaired','your car'],{fills:['bring','brought']},'不能，还需要知道当前进度',{pairs:[['Have you met Mrs. Jones yet?','Yes, I have.'],['When did you meet her?','Two weeks ago.'],['Has the boss left yet?','No, he hasn’t.']]},{fills:['had','had']},['She','didn’t','hear','the news','yesterday'],'Sam has worked here since 2020.'],
exam:['LFZ 312 G · three days ago','路灯柱上','修理工还在尝试修理','I have found my bag.',{fills:['met','met']},{fills:['Has','have']},'No, they haven’t.',['We','haven’t','sent','the letter','yet'],'还不能确定是否修好','When did you find it?',{fills:['get']},{locate:'swept'},['When','did','the boss','leave'],{pairs:[['hear','heard'],['lose','lost'],['tell','told']]},{fills:['found']},'吃早饭这一动作','She has worked here for two years.',{fills:['lived']},{fills:['has','left']},{fills:['sent']},'能：过去丢的，现在仍没找到',{fills:['have','met']},'She didn’t hear the news yesterday.',{pairs:[['Has she made the bed yet?','Yes, she has.'],['When did she make it?','At eight this morning.'],['Have you swept the floor yet?','No, I haven’t.']]},'I’ve swept the floor. I swept it at nine this morning.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit87-88/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit87-88/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
