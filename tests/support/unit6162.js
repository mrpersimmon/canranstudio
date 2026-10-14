'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent reviewed answers: textbook122–125; Grammar111; workbook172–178.
// Never read answers from runtime course data.
const ANSWERS={
 listen:['doctor',{pairs:[['He feels ill.','他觉得不舒服。'],['He looks ill.','他看起来病了。']]},'记起号码',{pairs:[['mouth','嘴'],['tongue','舌头']]},'感冒','那是个好消息。',{pairs:[['headache','头痛'],['earache','耳痛'],['toothache','牙痛']]},{pairs:[['flu','流感'],['measles','麻疹'],['mumps','腮腺炎']]}],
 roles:['He’s in bed.','Jimmy','09754','张开嘴，让他看看舌头','a bad cold','for a week','Jimmy','Because he doesn’t like school.'],
 grammar:['患有',{fills:['a','a']},'I have toothache. 和 I have a toothache. 都可以','have flu / have measles / have mumps',{fills:['has','have']},{fills:['have','doesn’t']},'Because he is ill.',{locate:'I feel ill'},['She stays at home','because','she is ill'],{fills:['because','so']},'He must stay in bed.',{fills:['is','feels']},'a cold / a headache','两句都可以',['Sam goes to bed early','because','he is tired'],{fills:['Does','have']}],
 apply:['09754','He has an earache.',['Because','she is ill'],{fills:['stay','a week']},'分别属于故事与另一组例句','牙医','Sam发烧了。',{pairs:[['52nd','fifty-second'],['63rd','sixty-third'],['107th','one hundred and seventh']]}],
 exam:['He feels ill.','舌头','能否记得医生的电话号码','That is good news.','a bad cold · stay in bed for a week','He doesn’t like school.',['She','has','a headache'],{fills:['a','an']},'两句都可以','has flu / has the flu',['Does','she','have','a toothache'],'No, he doesn’t.',{fills:['is','does not']},'Because they are hungry.',{locate:'it is late'},{fills:['so','because']},{pairs:[['stomach ache','胃痛'],['mumps','腮腺炎'],['dentist','牙医']]},['We','must','call the doctor'],'He must see a doctor.','具体多少度','61说重感冒；麻疹出现在62另一组例句',['Ann goes to bed early','because','she is tired'],{pairs:[['74th','seventy-fourth'],['96th','ninety-sixth'],['118th','one hundred and eighteenth']]}]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit61-62/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit61-62/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
