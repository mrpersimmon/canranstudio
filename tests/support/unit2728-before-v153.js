'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD,DIALOGUE}=require('./unit27-28-flow');
// Independent manuscript: reviewed source pages and target map, never runtime answers.
const SPEAKERS=Array.from({length:13},(_,i)=>String(i+1).padStart(2,'0'));
const ANSWERS={
 listen:OLD.listen,roles:OLD.roles,
 grammar:['some',OLD.observe[0],{fills:['is','some']},{fills:['any','any']},'可以，表达预期有一些牛奶。',{pairs:[['near the table','靠近桌子'],['on the table','在桌子表面上'],['in the box','在盒子里面']]},'几乎要哭了。',{fills:['There','They']},{fills:['men','housewives']},OLD.observe[1],...OLD.be],
 apply:[...OLD.trans,{fills:['are','aren’t']},'They’re on the television.'],
 exam:[...OLD.exam,{fills:['is','some']},'合适，可以带着肯定预期核实。','甲说靠近桌子；乙说几乎要哭了。',{fills:['There','They']},'Yes, there are.',{fills:['men','housewives']}]
};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit27-28/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit27-28/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');if(await room.locator(".fb").innerText()!=="答对了！"){await select(room,answers[i]);await check.click();}await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward){
  const card=room.locator('.completion-card');
  // A server-confirmed award may appear after numeric results are already in
  // the DOM. Follow the public settlement sequence before the next activity.
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-result-motion','finished');
 }
 return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
