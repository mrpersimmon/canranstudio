'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against source pages and the teaching brief.
// Never read runtime answer fields or inject records and stars.
const ANSWERS={
listen:['counter',{pairs:[['customer','顾客'],['manager','经理'],['serve','接待；服务']]},{pairs:[['forget','忘记'],['recognize','认出'],['road','路']]},'两本很贵的词典，具体价格未给',{fills:['forgot']},'把帽子戴上的动作','30分钟',{locate:'straight away'}],
roles:['把买好的两本词典带走','Caroline，那位站在柜台后面的女士','在柜台上','顾客','她记得接待的是戴帽子的人，而眼前顾客尚未戴上帽子','them指两本词典，it指帽子','戴上自己的帽子以便核对身份','现在认出这位顾客了','不能，原文结束于认出顾客'],
grammar:[{fills:['who','which']},'两句都可以，that可用于这两种限定描述',['He is the man','whom','I served','yesterday'],'没有；这里who作宾语，whom或that也可用','the woman所指的女士','我接待了那位女士',['He is the man','who','came here','last week'],['This is the car','which','the mechanic repaired','yesterday'],{fills:['is','are']},{fills:['helped','is repairing']},['The woman','whom','I was talking','to','is May'],{fills:['which']},'I met the woman who carries a red bag.',{fills:['to post','meeting']},['Please','put','it','on'],{fills:['wearing','putting on']},'把窗户关上','发光的东西并不都是金子',{fills:['served','serve']},['She is the nurse','who','looked after me'],{fills:['is','are']},'These are the books which I bought yesterday.'],
apply:['A','The man who is repairing the road.',['These are the books','which','I bought','yesterday'],{fills:['it','on']},'Lee is the person whom Pat served.','He forgot to take the books with him.','不能，两人都符合，还需要额外线索','不能，只确认对方答应了请求'],
exam:[{pairs:[['customer','顾客'],['counter','柜台'],['recognize','认出']]},'Caroline认出了顾客',{fills:['who','which']},'两句都可以，that在这里既可指人也可指物',['She is the woman','whom','I invited','to the party'],'可用whom或that；这一宾语关系中也可省略','第一句是男孩看见我；第二句是我看见男孩',['I am the person','who','wrote to you'],['This is the umbrella','which','I bought','last week'],{fills:['is','are']},{fills:['called','is reading']},['This is the pencil','which','I was writing','with'],{fills:['which']},'正在提篮子的那条狗',{fills:['to bring','visiting']},['Please','put','it','on'],{fills:['putting on','wearing']},'All right.','不能因为发光就认定都是金子','不能，两人都符合这一描述',{fills:['forgot','forgotten']},'them指两本词典，it指帽子',{fills:['met','meet']}]
};

async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit121-122/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit121-122/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
