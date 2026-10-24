'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against source pages and the teaching brief.
// Never read runtime answer fields or inject records and stars.
const ANSWERS={
listen:['beard',{pairs:[['during the trip','旅行期间'],['a trip','一次旅行'],['travel','旅行（动词）']]},{pairs:[['offer','提供；提出'],['job','工作'],['guess','猜']]},{fills:['grew']},'小猫','我拍了一张照片','我把胡子刮掉了',{locate:'during'}],
roles:['Mike','旅行时认识的人','不能，原文没有说明we是否包含Scott','Scott赞叹这条船漂亮','那个人提供过工作机会，未说明Mike是否接受','I是Mike，you是Scott','Mike自己','旅行期间留了胡子，回家时刮掉','他说妻子不喜欢那胡子','不能，只知道Mike这样描述妻子的喜好'],
grammar:[{fills:['I met','I took']},'That’s the man who offered me a job.',['The man','standing behind the counter','is Ben'],{fills:['repairing']},'The boy on the blue bike is Ben.',{fills:['was waiting']},['This is the ship','we travelled','on'],['That’s the man','I told you','about'],'The woman I spoke to is May.','This is the gift my mother gave me.',{fills:['found']},{fills:['you','me']},{fills:['during','for']},{fills:['a','an']},'What beautiful photographs!','What fine weather!',['How','beautiful','the ship','is'],['How','beautifully','she','sings'],{fills:['What','How']},{fills:['Yes','No']},['These are the boxes','we keep the papers','in'],['The woman','reading by the window','is May'],{fills:['What','How']}],
apply:['A',['The man','standing by the ship','is Ben'],'That’s right. This is the film you told me about.',{fills:['on','about']},'What beautiful ships!',['How','beautifully','she','sings'],['That’s right.','This is something','you must decide','about'],'不能，仍需保留Ben travelled on这段辨认线索'],
exam:[{pairs:[['offer','提供；提出'],['beard','络腮胡子'],['kitten','小猫']]},'旅行期间的Mike',{fills:['I saw','I bought']},'The man who came yesterday is Ben.',['The people','waiting by the door','are our friends'],'The car on the left is mine.',{fills:['was reading']},['This is the chair','I sat','on'],'This is the village I wrote to you about.','The house we live in is small.',{fills:['bought']},{fills:['you','me']},{fills:['during','for']},{fills:['an','a']},'What beautiful flowers!','What lovely weather!',['How','kind','you','are'],['How','quickly','he','runs'],{fills:['What','How']},{fills:['Yes','No']},{fills:['grew','grown']},'不能，只确认对方提供过工作机会','Mike说妻子不喜欢那胡子，这是他给出的刮胡子理由','That’s right. This is something new you haven’t thought about.']
};

async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit123-124/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit123-124/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
