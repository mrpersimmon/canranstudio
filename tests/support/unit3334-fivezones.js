'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./unit33-34-flow');
const {ANSWERS:OLD,DIALOGUE}=require('./unit33-34-flow');
// Independent manuscript: reviewed source pages and target map, never runtime answers.
const SPEAKERS=Array.from({length:10},(_,i)=>String(i+1).padStart(2,'0'));
const ANSWERS={listen:OLD.listen,roles:OLD.roles,
grammar:['under','横穿道路，从一边到另一边。',{cloze:['on','over']},'两种都可以表示从桥上走过。','和妈妈一起。','女孩有长长的黑发。','写信使用的工具。',...OLD.observe],
apply:[...OLD.be,...OLD.trans,{match:[['walk with my friend','和朋友一起走'],['a bag with books','装着书的包'],['write with a pencil','用铅笔写']]}],
exam:[...OLD.exam,'从道路一边走向另一边。',{cloze:['on','over']},'妈妈和爸爸在一起。',{cloze:['with']},{cloze:['with']},'两句都能成立，不必悬空。']};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit33-34/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit33-34/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
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
