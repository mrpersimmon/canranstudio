'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD,DIALOGUE,SPEAKERS}=require('./unit13-14-flow');
// Independent manuscript: reviewed source pages and target map, never runtime answers.
const ANSWERS={listen:OLD.listen,roles:[...OLD.roles,'Anna的新连衣裙','颜色相同，都是绿色'],
grammar:[{fills:['is']},OLD.colours[0],{fills:['are']},OLD.colours[1],{fills:['the']},OLD.exam[3],{fills:['Look']},{fills:['Don’t']},{fills:['and','see']},'邀请对方过来看看',{fills:['Her','is']}],
apply:[...OLD.trans,['Come upstairs','and','see','my case.'],'Please don’t open this case.','再问帽子是什么颜色'],
exam:[...OLD.exam.slice(0,3),{fills:['too']},...OLD.exam.slice(4),{fills:['the']},{fills:['is','are']},{fills:['Come']},{fills:['Don’t','open']},'Come and see my hat.','请求先别开箱，不能确定后来是否打开','两件物品颜色相同，但具体颜色未给出']};
async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit13-14/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit13-14/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
