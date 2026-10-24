'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Reviewed independently from the textbook and authored task conditions, not runtime answers.
const ANSWERS={
listen:[{pairs:[['future','未来的'],['latest','最新的'],['introduce','介绍']]},{pairs:[['get married','结婚'],['hotel','饭店；旅馆'],['really','真的；确实']]},'最新消息',{locate:'introduce'},'未来的丈夫','第六'],
roles:['尚未确定，她说有可能且拿不定主意','问问未来的丈夫','Marsh小姐对记者说的','Carlos','他们准备下周结婚','London Hotel','现场接受介绍的记者们','Liz，随后Kate表示赞同','Kate说他将是第六任丈夫；原文没有讲此前婚姻的细节'],
grammar:['She said she would leave.',{fills:['could']},['He said','he','might','return'],{fills:['wouldn’t','couldn’t']},['She said','she','would have to','ask'],'都可在这个计划语境使用；不能把was going to一律判错',{fills:['use']},{fills:['me','open']},{fills:['lets','let']},'A是在主动提出帮忙，B是在说明许可',['Mia','introduces','Ben','to Sue'],'退休仍是可能，结婚是她说的计划；都不是已经发生的证明','不一定，同一天转述且仍指同一明天时可以保留',{fills:['No','Yes']},{fills:['might','finished']},'不能，原话can或could都可能得到这个could转述',{fills:['get','are']}],
apply:['26 October–1 November','Ben获得开窗许可，但还没有开始开窗','Ben',{fills:['couldn’t','could']},'She told me she would let me use it.',{fills:['might','her']},'She might retire. They plan to get married next week.','原录音或可靠的逐字记录'],
exam:[{pairs:[['future','未来的'],['latest','最新的'],['introduce','介绍']]},['He said','he','would','write'],{fills:['could']},['They said','they','might','return'],{fills:['wouldn’t','couldn’t']},['He said','he','would have to','wait'],'两句都可转述这个计划，不能据此说已经完成',{fills:['her','sit']},{fills:['lets','let']},'A主动提出介绍，B说明允许；都不能只凭句式证明任务已完成',['Anna','introduces','Lee','to Tom'],'是，两次都指6 June',{fills:['No','Yes']},{fills:['might','taken']},'不可以，原话可能是may，也可能已有might',{fills:['get','are']},'不能，有许可但还没开始','退休尚未定，结婚是她说的下周计划','Marsh小姐说的，Carlos没有本段台词','注明Kate说他将是第六任丈夫，不补此前经历或已举行婚礼']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit135-136/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit135-136/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
