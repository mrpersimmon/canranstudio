'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed manuscript, not extracted from the course answer fields.
const ANSWERS={
 listen:['意大利（人）的','keyboard operator',{pairs:[['engineer','工程师'],['mechanic','机械师；修理机器的人'],['hairdresser','理发师']]},'policeman','policewoman','taxi driver','女空乘','postman','nurse','家庭主妇','milkman'],
 roles:["I'm an engineer.","No, she isn't.",'他既是新学生，也是一名工程师','两人各问对方一次'],
 grammar:[{fills:['is','am']},{fills:['He']},{fills:['her']},{pairs:[['I','me'],['he','him'],['she','her'],['they','them']]},{fills:['We']},{fills:['us']},{fills:['you','you']},{fills:['It']},'What nationality are you?',{fills:['is']},"No, I'm not.",'Yes, I am.',{fills:['her']},{fills:['an','a']}],
 apply:["What's his job?","What's her job?",["What's",'your job?',"I'm",'an engineer.'],['Is','he','a taxi driver?','Yes,','he is.'],{fills:['We','us']},["What's",'your','job']],
 exam:['意大利人；护士','Are you a mechanic?',['My',"name's",'Ben.',"I'm",'an engineer.'],['What nationality','are','you?',"What's",'your','job?'],"No, I'm not.",{fills:['his','her']},{fills:['am','is']},'Yes, she is.',{fills:['an','a']},{pairs:[["name’s（My name’s Ben.）",'name is'],["I’m（I’m a nurse.）",'I am'],["What’s（What’s your job?）",'What is']]},{fills:['Yes, I am.']},{fills:['She','her']},{fills:['They','them']},{fills:['Are']},"It's me."]
};
const DIALOGUE=['I am a new student.',"My name's Robert.",'Nice to meet you.',"My name's Sophie.",'Are you French?','Yes, I am.','Are you French, too?','No, I am not.','What nationality are you?',"I'm Italian.",'Are you a teacher?',"No, I'm not.","What's your job?","I'm a keyboard operator.","What's your job?","I'm an engineer."];
const SPEAKERS=['Robert','Robert','Sophie','Sophie','Robert','Sophie','Sophie','Robert','Sophie','Robert','Robert','Sophie','Robert','Sophie','Sophie','Robert'];
async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit7-8/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit7-8/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');
  if(await check.isEnabled()){ /* a genuine restored draft can already be selected */ }
  await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
