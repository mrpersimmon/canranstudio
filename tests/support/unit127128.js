'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Reviewed test script: source pages and visible task conditions, not runtime answers.
const ANSWERS={
listen:[{pairs:[['famous','著名的'],['actress','女演员'],['actor','男演员；演员']]},'通过阅读得知',{pairs:[['recognize','认出'],['beside','在……旁边'],['another look','再看一看']]},'4或更多','不超过4，包括4',{pairs:[['sure','确信的'],['probably','很可能；大概'],['tired','疲倦的']]},{locate:'at least'}],
roles:['Liz','那位女士旁边的人','她从不相信改为认为Liz说得对','不能，她否定第三任并推测第四任或第五任','29是Liz读到的说法，至少40是她的推测','Kate对外表的感叹','已经是一位著名女演员','那么，用来限定“久”的程度','她自己的年龄不超过29岁','Liz读到Karen是29岁，自己也声称不超过29岁；真实年龄未核实'],
grammar:[{fills:['must','can’t']},{fills:['be','be']},['She','must','know','the answer'],{fills:['cost']},['He','must','be','sleeping'],'A是要求，B是推测',{fills:['mustn’t','can’t be']},'不同，A说不会打字，B说不可能是本人',['He','has to','be here','at six o’clock'],['I think','he is','probably','busy'],{fills:['can’t','must']},{fills:['be','be']},{fills:['an','a']},'都包含4，但一个允许更多、一个允许更少',{fills:['read','read']},{fills:['Yes','No']},'不能，还需要归属或其他线索','不能，它表达说话人很确信的推断'],
apply:['It can’t be my new hat. It must be my old one.',{fills:['20th','21st']},'She can’t be a dentist. She must be an engineer.',['They','must','be','watching television'],'B: He must be at the café at three.','B和C',{fills:['listening to the radio','watching television']},'Let me have another look. I think you’re right!'],
exam:[{pairs:[['famous','著名的'],['read','通过阅读得知；读'],['at least','至少；不低于']]},'Liz读到29岁，又推测至少40岁',{fills:['must','can’t']},{fills:['be','be']},['She','must','know','the way'],{fills:['cost']},['He','can’t','be','reading'],'A是要求，B是推测',{fills:['mustn’t','can’t']},'I can’t swim.',['He','has to','be at the office','early tomorrow'],['I think','he is','probably','an engineer'],{fills:['can’t','must']},{fills:['be','be']},{fills:['an','a']},'7或更多','允许，也允许更少',{fills:['read','read']},{fills:['Yes','No']},'不能，还缺颜色和归属依据','说话人很确信，但身份仍可能需要核实','They can’t be reading. They must be playing.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit127-128/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit127-128/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
