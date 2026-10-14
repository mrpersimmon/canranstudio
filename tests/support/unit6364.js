'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed textbook126–129 / Grammar114–115 answer sheet.
// Never extract expected answers from the runtime course definition.
const ANSWERS={
 listen:['他比之前好些了。',{pairs:[['get up','起床'],['remain in bed','继续卧床'],['talk','谈话']]},'library',{pairs:[['rich food','油腻的食物'],['make a noise','弄出喧闹声'],['so quickly','如此快地']]},'现在还不行','match',{pairs:[['drive','开车'],['lean out of','身体探出'],['break','打破']]}],
 roles:['Better.','妈妈对医生','再卧床两天','Jimmy现在不发烧。','每天大约两小时，房间保持温暖','rich food','Mr. Williams也得了重感冒'],
 grammar:['不准玩火柴',{fills:['break']},['You','mustn’t','lean out of the window'],{fills:['be','be']},'两句都能表示禁止喧闹',{fills:['must','mustn’t']},{fills:['for']},{locate:'for a week'},'For thirty minutes.',{fills:['another']},{fills:['is','has']},{fills:['reads','doesn’t']},['Don’t','talk','in the library'],{fills:['for','for']}],
 apply:['You mustn’t make a noise here.',{fills:['open']},['You','mustn’t','break that vase'],'5分钟','每天起来约两小时；房间保暖','练习否定句，不是生病时不许求助的规则',{pairs:[['110','one hundred and ten'],['221','two hundred and twenty-one'],['332','three hundred and thirty-two']]}],
 exam:['他已经可以立刻上学','如此地','油腻的食物','从这次说明起再休息两天','大约两小时，保持房间温暖','Mr. Williams','不准把身体探出窗外',['Don’t','open','that door'],'Jimmy mustn’t play with matches.',{fills:['be','be']},{fills:['must','mustn’t']},'两句都能要求这里不要讲话',{locate:'for an hour'},'For twenty minutes.',{fills:['for']},'再10分钟；总共30分钟',{fills:['is','reads']},'Jimmy doesn’t feel ill. / Jimmy can get up.','You must keep this room clean. You mustn’t make a noise.',{pairs:[['certainly','当然'],['remain','保持；继续'],['yet','还；仍']]},'He has a bad cold, too.',{pairs:[['554','five hundred and fifty-four'],['776','seven hundred and seventy-six'],['998','nine hundred and ninety-eight']]}]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit63-64/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit63-64/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
