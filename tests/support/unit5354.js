'use strict';
const {expect}=require('@playwright/test');const {select}=require('./units1-30-tasks');
// Independent textbook/Grammar answer manuscript. No reading runtime answer fields.
const ANSWERS={
 listen:[{pairs:[['north','北方'],['east','东方'],['west','西方'],['south','南方']]},'night',{pairs:[['rise','升起'],['set','落下'],['early','早'],['late','晚']]},'mild',{pairs:[['Australia','澳大利亚'],['Austria','奥地利'],['Nigeria','尼日利亚'],['Poland','波兰']]},'wet',{pairs:[['an interesting subject','一个有趣的话题'],['a conversation','一次谈话'],['my favourite season','我最喜欢的季节']]},'总是'],
 roles:['England','并不总是宜人',{pairs:[['the North','often cold'],['the East','windy'],['the West','often wet'],['the South','sometimes warm']]},'spring and summer',{fills:['long','short']},{fills:['late','early']},'他们的气候'],
 grammar:['喜欢',{fills:['her']},'两句都可以',['I','like','to walk','in spring'],'Jim likes us to ask questions.',['I’d like','to drink','some water'],'Yes, please.','you（你）',{fills:['looks like']},'She’s friendly.','一杯茶',{fills:['swimming']},'你喜欢春天的哪一点','It’s lovely.',{fills:['to have','having']},['She','would like','me','to help'],'你想参观花园吗','I like the long days.'],
 apply:['I come from Canada.',{fills:['is','comes']},['Where','do','you','come from'],{fills:['doesn’t','come']},['The sun','often','rises','early'],{fills:['do','best']},{pairs:[['40th','fortieth'],['100th','hundredth'],['101st','hundred and first'],['102nd','hundred and second']]},'来自泰国，最喜欢夏天'],
 exam:[{fills:['east']},{fills:['short','long']},'太阳升得早，落得晚',{pairs:[['Nigeria','Nigerian'],['Poland','Polish'],['Thailand','Thai'],['Turkey','Turkish']]},'来自英格兰，温和但并不总是宜人','西部常常潮湿，南部有时暖和','spring and summer','气候是他们爱谈的话题',{pairs:[['often','经常'],['always','总是'],['sometimes','有时']]},'气候怎么样',{fills:['them']},'可以，两种形式都正确',{fills:['them','to ask']},['I','would like','to sit','here'],'No, thank you.','us（我们）',{fills:['looks like']},'He’s quiet.',{fills:['drinking','to drink']},'I like the flowers.','It’s interesting.',{fills:['are','come']},{fills:['Does','come']},['The sun','doesn’t','set','late'],'It is often wet in the West.',['Which season','does','she','like best'],{pairs:[['30th','thirtieth'],['50th','fiftieth'],['90th','ninetieth'],['103rd','hundred and third']]},'来自芬兰，想看看花园']
};
async function story(page,base=''){
 await page.goto(base+'/unit53-54/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible();
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit53-54/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();
  await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');
  await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,story,activity};
