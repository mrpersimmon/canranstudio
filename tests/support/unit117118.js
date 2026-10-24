'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against source pages and the teaching brief.
// Never read runtime answer fields or inject records and stars.
const ANSWERS={
listen:['coin',{pairs:[['dining room','饭厅'],['mouth','嘴'],['toilet','厕所；盥洗室']]},{pairs:[['swallow','吞下；咽下'],['ring','（钟、铃等）鸣响'],['drop','掉落；使落下']]},'那天上午晚些时候','寻找的过程','both','rang',{locate:'floor'}],
roles:['Tommy的母亲','他把一些硬币掉在地板上','没全找到，原文没有给出当时找回的枚数','两枚小硬币，面额未说明','讲述者母亲和她的丈夫','父母没能拿到硬币时，Tommy已经吞下了','父亲在办公室，母亲正在做家务','既指零钱，也让人联想到情况的变化','只确认母亲说去过三次；未交代硬币取出或孩子康复'],
grammar:[{fills:['was','were']},{fills:['having','sitting']},{fills:['writing','lying']},{fills:['wasn’t','weren’t']},['Were','they','playing','at four yesterday'],'Yes, she was. No, they weren’t.','I was washing the dishes.',{fills:['was reading']},{fills:['was writing','rang']},['When','I was reading,','the phone rang'],{fills:['was cooking','was washing']},'When I was reading和While I was reading都能引出这段背景','正在那个时候，两件事恰好相遇','不能，还需要后续行动信息',{fills:['was reading','finished']},'就是our little boy的名字，不是另一个孩子',{fills:['both','all']},{fills:['We','them']},'I found them all和I found all of them都可用',{fills:['both']},'I couldn’t find them all.',{fills:['were','wasn’t']},['What','were you doing','when I called'],{fills:['was drawing','arrived']},{fills:['They','them']}],
apply:['She was reading.','May was cooking while Ben was washing the dishes.','I was drawing a picture.',{fills:['wasn’t','was']},['Just as','I was opening the door,','the bell rang'],['I','put','them','both','on the table'],'I couldn’t find them all.','铃响后的行动记录'],
exam:['Tommy的母亲','零钱和情况的变化',{pairs:[['dining room','饭厅'],['later','后来'],['ring','（钟、铃等）鸣响']]},{fills:['was','were']},{fills:['writing','sitting']},{fills:['wasn’t','weren’t']},['Was','she','cooking','at six yesterday'],'Yes, he was. No, they weren’t.','I was dusting the bedroom.',{fills:['was writing']},{fills:['was cooking','rang']},{fills:['was reading','was drawing']},['When','I was cooking,','Ben arrived'],'When I was walking与While I was walking都可引出背景','到达恰在Ben正离开的时候',{fills:['finished']},'一个人，Ben就是my friend',{fills:['both','all']},{fills:['We','us']},'I took them all和I took all of them都可以',{fills:['both']},'不能，原话没有给出找回的具体数量','Tommy已经吞下了硬币','母亲说去过三次厕所，未交代取出硬币或康复结果']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit117-118/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一段',exact:true}).isVisible())await room.getByRole('button',{name:'下一段',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit117-118/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
