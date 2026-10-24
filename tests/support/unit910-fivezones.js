'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
const {ANSWERS:OLD,DIALOGUE,SPEAKERS}=require('./unit9-10-flow');
// New answers are independently reviewed; unchanged cases reuse the previous
// reviewed manuscript, never the runtime answer fields.
const ANSWERS={
 listen:OLD.listen,
 roles:[...OLD.roles,'Steven和Helen交谈，问起Tony和Emma'],
 grammar:[{fills:['are','is']},'How are you today?',OLD.reply[0],'初次正式见面时相互问候','看起来的外观',['a','clean','shirt'],{fills:['is','clean']},['a','nice','old','car'],{fills:["He's","She's"]},"It's","I'm fine, thanks. / I'm very well, thank you.",{fills:['at','see']},'他不觉得冷','How is your car?'],
 apply:[OLD.reply[1],OLD.reply[2],OLD.describe[0],OLD.describe[2],OLD.describe[3],['Look at','this umbrella.',"It's",'clean.']],
 exam:[OLD.exam[0],'不能确定他的具体年龄或是否年老',OLD.exam[2],{fills:['are','is']},OLD.exam[4],OLD.exam[5],{fills:["He's","She's"]},OLD.exam[7],OLD.exam[8],{pairs:[["How’s（How’s Emma?）",'How is'],["She’s（She’s very well.）",'She is']]},{fills:["It's"]},'他们在相互问候，不能据此判断健康状态','外观：看起来个子高',['a','nice','young','woman'],{fills:['is','dirty']},'A用fine，B用well，两句在这里都合适','回答者说车的状况不错']
};
async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit9-10/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit9-10/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
