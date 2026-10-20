'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed against the three source books and stated task premises.
// Never obtain expected answers from the runtime answer fields or saved results.
const ANSWERS={
listen:[{pairs:[['extra','额外的'],['company','公司'],['line','线路']]},{pairs:[['overseas','海外的；国外的'],['engineering','工程'],['engineer','工程师']]},{locate:'repairing'},'顺便说；顺便问','额外的一些工作','是我，请讲'],
roles:['在Overseas Engineering Company工作的John Smith','Mary邀请了Charlotte和Graham','老板要求Graham做额外工作，他说要留在办公室','不能，他说不知道什么时候做完','Mary是否需要帮忙','确认名叫John Smith、是工程师，否认在该公司工作','正在修理Graham的电话线路','接听者没有理解晚餐话题；未写Mary已收到消息'],
grammar:['He wants to know if I am tired.',{fills:['why','when']},{fills:['does']},['She wants to know','when','they','left'],['Tell me','what','you','are cooking'],'I don’t know when he will finish.','两句都可表达想知道是否准备好',{fills:['whether']},'whether or not she is ready；if she is ready or not','A里的that可省；B里的where不能直接省',{fills:['my','is']},'I want to know who called.',{fills:['how far','how long']},'不能，只说明说话人不知道是否已到',{fills:['didn’t call']},{fills:['Yes','No']},'Do you know where she is?'],
apply:['Card A','不能，18:00是到达计划，工作结束仍未知','Mia wants to know if you are ready.','Yes. Anna took the notebook.','Could you tell me how far the museum is from school?',['They are talking about','whether','to leave now','or not'],{fills:['if','is']},['Tell me','why','she','didn’t send','the message']],
exam:[{pairs:[['extra','额外的'],['engineering','工程'],['line','线路']]},'She wants to know if they are ready.',{fills:['why','when']},['He wants to know','what','Anna','does'],{fills:['went']},{fills:['are reading']},['I want to know','when','she','can start'],'两句都可表达不知道是否来了',{fills:['whether']},{fills:['whether']},{fills:['their','are']},'I wonder who sent the note.',{fills:['how far','how long']},'不能，只知道说话人不确定是否已到',{fills:['didn’t come']},{fills:['Yes','No']},'Do you know what he is doing?','不能，删除后不再表达同一个原因问题','不是，前者问是否迟到，后者问迟到原因','接听者确认姓名和工程师身份，但否认在那家公司工作','Mary是否需要帮助没有答复；John说正在修理线路']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit139-140/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit139-140/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
