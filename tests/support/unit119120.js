'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against source pages and the teaching brief.
// Never read runtime answer fields or inject records and stars.
const ANSWERS={
listen:['torch',{pairs:[['story','故事'],['happen','发生'],['enter','进入']]},{pairs:[['thief','贼'],['parrot','鹦鹉'],['exercise book','练习本']]},'黑暗的','voice',{fills:['thieves']},'批改了',{locate:'downstairs'}],
roles:['George的一位朋友，姓名未说明','在床上看书','进入了房子','屋里很黑','George的鹦鹉Henry','扔下手电筒，尽快逃跑','已经离开，具体去了哪里未写','不矛盾，anyone这里指人，Henry是鹦鹉','不能，原文只给出George的要求'],
grammar:[{fills:['had','had']},{fills:['left','seen']},{fills:['hadn’t','hadn’t']},['Had','she','left','before seven'],'Yes, he had. No, she hadn’t.','I had read the letter.','火车先开走，随后我到达',['She went out','after','she had finished','her work'],['He had washed','his hands','before','he ate'],{fills:['had completed']},{fills:['had lived']},{fills:['have','had']},{fills:['had already']},{fills:['had just reached']},{fills:['had had']},'两句都可表达这一先后；第二句更突出此前完成',{fills:['was reading','had read']},{fills:['mine']},'尽他们所能地快跑，未给具体速度','他说明因做成书架而自豪，且此前从未这样自豪',{fills:['hadn’t']},['What','had you done','before dinner'],{fills:['had already closed']}],
apply:['The train had already left.',['Jimmy left home','after','he had had breakfast'],{fills:['have','had']},['It was too late.','You','had already','corrected it'],'She had finished work before she went out.',{fills:['Had','had']},'不能，记录只到2020年，之后未说明','George说完之后Henry的行动记录'],
exam:['I是George的一位朋友',{pairs:[['voice','说话声'],['enter','进入'],['exercise book','练习本']]},{fills:['thieves']},{fills:['had','seen']},{fills:['hadn’t']},['Had','they','arrived','before lunch'],'Yes, she had. No, he hadn’t.','I had bought a ticket.','May先离开，Ben随后到达',['He went to bed','after','he had done his homework'],['She had taken','the examination','before','she went on holiday'],{fills:['had written']},{fills:['had known']},{fills:['have','had']},'It was too late. They had already shut it.',{fills:['had just sat']},{fills:['had had']},'两句都可以，不把after当必须用had的开关',{fills:['was writing','had written']},{fills:['hers']},'他们尽可能快地逃跑，具体速度未知','Henry仍在，George让它接着睡；是否睡着未写','人物对此前经历与这次感受的明确说明']
};

async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit119-120/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一段',exact:true}).isVisible())await room.getByRole('button',{name:'下一段',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit119-120/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
