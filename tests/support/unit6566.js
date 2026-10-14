'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet: textbook paper130–133, guide Grammar118–119.
// Reviewed against the sources and design, never extracted from course data.
const ANSWERS={
listen:['key',{pairs:[['dad','爸爸'],['mum','妈妈'],['baby','婴儿']]},'half past ten','early','祝你玩得开心','hear',{pairs:[['myself','我自己'],['ourselves','我们自己'],['yourselves','你们自己']]}],
roles:['Meet some friends.','10:30','前门的钥匙','Jill 18岁；Tom是爸爸','她18岁了，而且一向早回家','给了；不晚于11:15','Jill和她的朋友们'],
grammar:[{fills:['myself','ourselves']},{fills:['yourself','yourselves']},{fills:['himself','herself']},{fills:['itself']},{locate:'themselves'},'镜子里的Jill自己','他们亲自做这张卡',{pairs:[['we','ourselves'],['you（多人）','yourselves'],['they','themselves']]},'two o’clock',{fills:['past']},['It’s','a quarter to','three'],'都表示7:30','thirteen to seven',{fills:['at','in']},{fills:['on','on']},{fills:['from','in']},{pairs:[['1949','nineteen forty-nine'],['1902','nineteen oh two'],['2000','two thousand']]},'two fifty-three',{fills:['ourselves']},'3:45'],
apply:[{fills:['nine']},'9:45','It’s July 6th.','He’s twelve years old.',['Enjoy','yourselves'],['We','must see the dentist','at a quarter to four'],'她有今晚见朋友的计划',{pairs:[['1st','first'],['2nd','second'],['3rd','third']]}],
exam:['听见',{pairs:[['key','钥匙'],['baby','婴儿'],['mum','妈妈']]},'去见几个朋友，具体地点没说','She always comes home early.','Jill拿钥匙，不晚于11:15回家',{fills:['myself','ourselves']},{fills:['yourself','yourselves']},{fills:['himself','herself']},{fills:['itself','themselves']},'第一句',{locate:'ourselves'},'three o’clock','2:15',['It’s','a quarter to','two'],'两种都是3:30','3:40',{fills:['at','in']},{fills:['on','on']},{fills:['from','in']},'It’s March 8th.','nineteen forty-nine',{pairs:[['1902','nineteen oh two'],['2000','two thousand'],['253','two fifty-three']]},'两种都可以','She’s eighteen.',['They','must see the boss','at half past one'],'请求允许拿钥匙',{pairs:[['11th','eleventh'],['12th','twelfth'],['16th','sixteenth']]}]
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit65-66/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit65-66/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
