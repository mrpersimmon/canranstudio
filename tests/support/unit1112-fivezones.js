'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD,DIALOGUE,SPEAKERS}=require('./unit11-12-flow');
// Independently transcribed from the reviewed target map and source pages.
const ANSWERS={listen:OLD.listen,roles:[...OLD.roles,'Tim: Yes, sir.','回应老师叫自己，等老师说什么事'],
grammar:[{fills:['Who','Whose']},'Whose book is this? / Whose is this book?',OLD.owner[0],OLD.owner[1],{fills:['our','their']},{fills:['It’s','Its']},{fills:['my','mine']},OLD.owner[2],{fills:['girl’s']},{fills:['boys’']},{fills:['Jo and May’s']},{fills:['Jo’s and May’s']},{fills:['my brother’s']},'不是Dave的，真正主人还不确定'],
apply:[...OLD.trans,'No, it isn’t. It’s May’s.','Here you are.','向Jo核实是不是他的',['It’s','his','pen.']],
exam:[...OLD.exam.slice(0,4),{fills:['my','your']},{fills:['father’s','his']},...OLD.exam.slice(6),{fills:['their','our']},{fills:['Its','It’s']},{fills:['mine','my']},{fills:['girls’','boy’s']},{fills:['Ann and Ben’s','Ann’s and Ben’s']},{fills:['Whose','Who']},'不是Ann的，真正主人尚待确认','Whose pen is that? / Whose is that pen?']};
async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit11-12/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit11-12/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
