'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD}=require('./unit4546');
const SPEAKERS=['The boss','Bob','The boss','Bob','The boss','Bob','Bob','Pamela','Bob','Pamela','Pamela','Bob','Pamela','Pamela'];
const DIALOGUE=['Can you come here a minute please, Bob?','Yes, sir?','Where’s Pamela?','She’s next door. She’s in her office, sir.','Can she type this letter for me? Ask her please.','Yes, sir.','Can you type this letter for the boss please, Pamela?','Yes, of course I can.','Here you are.','Thank you, Bob.','Bob!','Yes? What’s the matter?','I can’t type this letter.','I can’t read it! The boss’s handwriting is terrible!'];
// Independently reviewed from textbook pp90–93, guide p82 and workbook pp126–130.
const ANSWERS={listen:OLD.listen,roles:OLD.roles,grammar:[...OLD.grammar.slice(0,13),{fills:['she','it']},'把书递给他',OLD.grammar[13]],apply:OLD.apply,exam:[...OLD.exam.slice(0,12),{fills:['How many','letters']},...OLD.exam.slice(13),{fills:['he','it']},'No, she can’t.','过来一会儿']};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit45-46/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit45-46/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');if((await room.locator('.fb').textContent())!=='答对了！'){await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');}await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
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
