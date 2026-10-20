'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently authored against the reviewed textbook and lesson draft.
// Never import content.js answer fields or inject learning / award state.
const ANSWERS={
listen:['往返票',{pairs:[['train','火车'],['platform','站台'],['station','车站']]},'porter',{pairs:[['catch','赶上'],['caught','catch的过去式及过去分词'],['miss','错过']]},{locate:'plenty of'},'在车站旁边',{pairs:[['slow','慢的'],['fast','快的'],['exact','准确的']]},{pairs:[['Geneva','日内瓦'],['Stockholm','斯德哥尔摩'],['Sydney','悉尼']]}],
roles:['两张去伦敦的往返票','8:19','二号站台，过天桥','Ken','车站旁的酒吧','建议现在回车站','那个钟慢了十分钟','下一班车要五小时后才开'],
grammar:[{fills:['leave']},['You','had better','not','wait here'],'现在最好出发','I’d better',{fills:['had better']},'必须出示车票','从必须改为具体建议，不能说意思完全不变','现在最好快一点，否则可能错过车',{fills:['past']},'eight','9:15',{fills:['an hour’s','two hours’']},{pairs:[['two days ago','两天以前'],['in two days’ time','两天以后'],['at two o’clock','在两点钟']]},{fills:['go']},['We','had better','not','stay here'],{pairs:[['You must bring your ticket.','必须带票'],['You had better take a coat.','最好带件外套'],['You had better not wait here.','最好不要在这里等']]},{fills:['left','return']},['When','will','the next train','leave']],
apply:['Two return tickets to London','10 minutes','Platform Three. Over the bridge.',['You','had better','take','an umbrella'],'We had better not wait here.','2027年1月15日','I’ll go to Sydney in a month’s time.','14:15'],
exam:['钟慢了十分钟，他们错过了原定的火车',{pairs:[['a return ticket','一张往返票'],['catch the train','赶上火车'],['miss the train','错过火车']]},{locate:'Over the bridge'},{fills:['call']},['She','had better','not','leave','her bag here'],'建议明天去',{fills:['had better']},'访客必须出示票','等待的动作保留，但变成建议表达','针对这次赶车给建议，晚走可能赶不上','10:17','5:55','8:05','11:00','In five minutes’ time.',{fills:['a week’s','two weeks’']},{fills:['flew','fly']},['What time','will','the next train','leave'],{fills:['of','tickets']},'2027年1月10日','We’ll go to London in a month’s time.','不能，还需要上午或下午的依据']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit95-96/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit95-96/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
