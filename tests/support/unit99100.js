'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet from the reviewed 99–100 draft and original pages.
// Do not read runtime answer fields or inject learning / award records.
const ANSWERS={
listen:['slip',{pairs:[['downstairs','往楼下'],['back','背'],['help','帮助']]},'fall的过去式',{locate:'hurt'},'立即','说话人很确信',{pairs:[['licence','执照'],['X-ray','X光检查'],['a haircut','理发']]},'她觉得冷／她感冒了'],
roles:['他滑了一跤，从楼梯上摔下来','背','I’m afraid that I can’t get up.','Dr. Carter','医生','Lucy','不用，医生说会马上过来'],
grammar:[{fills:['that']},{fills:['she','feels']},{fills:['say','are']},'恐怕赶不上，并非说害怕火车',{fills:['came']},{fills:['has found']},['They say','that','they are washing','the dishes'],{fills:['will come']},{fills:['can','repair']},{fills:['was']},{fills:['was repairing']},{fills:['would leave']},{fills:['had written']},{fills:['goes']},'lives和lived都可以，侧重点不同',{fills:['walked']},{fills:['was cooking']},{fills:['he','has finished']},{fills:['moves']},['She says','that','she doesn’t','speak English']],
apply:['Dr. Carter','Mia says that she has lost her pen.',['The boys say','that','they don’t need','any money'],'She says that she needs a licence.',['He says','that','he can’t','repair the car'],{fills:['would phone']},'Lucy is sure that Andy needs an X-ray.','医生说会来，尚不能确认已经到达'],
exam:['马上过来','Lucy确信需要检查，原文未给诊断结果',{fills:['he','feels']},{fills:['say','are']},['She says','that','she doesn’t','remember him'],'Ben says that he has found his watch.',{fills:['posted']},{fills:['has repaired']},{fills:['is writing']},{fills:['will leave']},{fills:['must','catch']},'委婉告知不好的消息',{fills:['was']},{fills:['were washing']},{fills:['would return']},{fills:['had painted']},{fills:['rises']},'works和worked都可以',{fills:['took']},'She says that she needs some money.',{fills:['that']},'不能补出，原文没有后续到场或检查结果']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit99-100/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit99-100/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
