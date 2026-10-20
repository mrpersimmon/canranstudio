'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet reviewed against the source pages and teaching brief.
// Do not read runtime answers or inject learning records.
const ANSWERS={
listen:['teaspoonful',{pairs:[['idea','主意'],['pity','遗憾'],['instead','代替']]},'建议；忠告','牛奶','更少的糖','比较范围内最少的牛奶',{pairs:[['best','最好的'],['worse','更差的'],['worst','最差的']]},{locate:'instead'}],
roles:['Charlotte','只要少许，没有给出精确茶匙数','一勺半，比两勺少','Yes, please.','Charlotte认为盒里有一些，还不是清点结果','盒子是空的，原因没有交代','饼干','Charlotte在这段对话里给Jane的建议'],
grammar:[{fills:['much','many']},{fills:['few','little']},{fills:['a few']},{fills:['few']},{fills:['a little']},{fills:['little']},{fills:['a few','a little']},'不够，三张少于需要的六张','不能，需核对实际数量',{fills:['more','more']},{fills:['most']},{fills:['less','fewer']},{fills:['least','fewest']},{fills:['teaspoonfuls']},{fills:['better','better']},{fills:['worse','worst']},'B is farther/further than A; C is the farthest/furthest of the three.','不能，还不知道你有多少',{fills:['many','much']},{fills:['a little','few']},{fills:['less','fewest']},['The park is','farther from our school','than the library']],
apply:['B · 一满匙和半匙','A · 100 ml','We have a few cups, but not enough for everyone.',{fills:['less','fewer']},'Yes, please.','先查看并核对盒内实际数量',['Have an apple','instead'],'the station'],
exam:['a little，没有精确茶匙数','一勺半，比提议的两勺少','Charlotte先估计有一些，Jane后来发现空盒','a biscuit',{fills:['much','many']},{fills:['few','little']},{fills:['a few']},{fills:['few']},'There is very little water, but it is not zero.',{fills:['a few','a little']},'有一些，但不够这次任务','够，A有3张，任务只需2张',{fills:['more','more']},'C',{fills:['less','fewer']},{fills:['least','fewest']},'bottles，瓶数',{fills:['teaspoonfuls']},{fills:['better','best']},{fills:['worse','worst']},'farther和further都可以',['The museum is','the furthest','from the school'],'不能，还缺比较对象的数量和范围','a piece of advice','Have an apple instead.','No, thank you.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit109-110/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit109-110/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.progress-copy')).toHaveText('第 '+(i+1)+' / '+answers.length+' 题');await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();
  await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward&&await page.locator('dialog.award-reveal[open]').isVisible())await page.keyboard.press('Escape');return room;
}
module.exports={ANSWERS,select,story,activity};
