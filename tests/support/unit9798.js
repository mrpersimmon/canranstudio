'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet from the reviewed 97–98 draft and original pages.
// Do not read runtime answer fields or inject learning / award records.
const ANSWERS={
listen:['zip',{pairs:[['label','标签'],['handle','把手'],['address','地址']]},'把箱子遗留在火车上',{locate:'describe'},'这箱子不是我的','£3.50',{pairs:[['keys','钥匙'],['passport','护照'],['phrasebook','短语手册']]},'它是谁的'],
roles:['几天前，开往伦敦的火车上','小蓝箱，有拉链，把手上有标签','No, that’s not mine.','他的姓名和地址','David Hall · 83, Bridge Street','Three pounds fifty pence.','拿到的箱子不属于他，服务员给错了','没有，结尾他说给错了箱子'],
grammar:[{fills:['Tom’s']},'the boys’ room',{fills:['children’s']},{fills:['boss’s']},{fills:['Tom and Anna’s','Tom’s and Anna’s']},{fills:['two-day','days’']},'这座城市的公园','面包店',['the back','of','the book'],'我姐姐或妹妹',{fills:['my father’s']},{fills:['mine']},{pairs:[['It’s blue.','it is'],['It’s got a zip.','it has'],['Hall’s case','霍尔的箱子']]},{fills:['my','mine']},{fills:['him','belong']},{fills:['is','are']},{fills:['students’','children’s']},'Mia and Leo’s car',['two books','of','Ben’s'],'Yes, it’s yours.'],
apply:['A · 小蓝箱，有拉链，把手有标签','Yes, they’re mine. They belong to me.','地址不同，应继续核对','Eva and Tom’s boat','Yes, it’s ours. It belongs to us.',['This case','doesn’t','belong','to me'],['on the handle','of','the blue case'],{fills:['Ella’s']}],
exam:['Mr. Hall说拿到的箱子不属于他','不能，结尾仍明确说给错了箱子',{fills:['is','has']},{fills:['brother’s']},'the girls’ bags',{fills:['men’s']},'the boss’s hat','Leo and May’s room','Ada’s and Ben’s hats',{fills:['five-minute','minutes’']},'这座城市的历史','是Rosa的外套',['the door','of','the room'],'照片拍的是Tom，不能据此确认谁拥有它',{fills:['my sister’s']},{fills:['hers']},{fills:['our','ours']},{fills:['his','hers']},'They’re theirs. They belong to them.',{fills:['belong','them']},['Whose','are','these keys'],'Yes, it’s mine. It belongs to me.','Yes, they’re ours.','不能，还没有真正主人的信息']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit97-98/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit97-98/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;}
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(page,room);return room;
}
module.exports={ANSWERS,select,story,activity};
