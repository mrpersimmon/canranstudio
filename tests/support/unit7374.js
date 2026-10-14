'use strict';
const {expect}=require('@playwright/test');const {select:commonSelect}=require('./units1-30-tasks');
// Independent answer sheet authored from textbook150–153 / guide132–133.
// Do not read lesson answer fields or inject learner progress.
const ANSWERS={
 listen:['a bus stop',{pairs:[['hand','手'],['pocket','衣袋'],['phrasebook','常用语手册']]},'突然地',{pairs:[['slowly','缓慢地'],['hurriedly','匆忙地'],['pleasantly','友好地']]},'他听不懂英语','口渴地喝','phrases','热情地向我问好'],
 roles:['上星期去了伦敦','她不熟悉伦敦','near a bus stop','Mrs. Mills','King Street','他讲德语','从自己的衣袋拿出手册并翻开','抱歉，我不会说英语'],
 grammar:[{locate:'pleasantly'},{fills:['slow','slowly']},'She held the cup carefully.',{fills:['thirstily']},{fills:['hard','fast']},'We arrived home late.',{fills:['good','well']},{pairs:[['go','went'],['see','saw'],['lose','lost']]},{fills:['spoke','understood']},{fills:['took','found']},{pairs:[['gave','give'],['drank','drink'],['ate','eat']]},{fills:['cut','put']},'已经读过；过去式读/red/',{fills:['go','walked']},{locate:'“I am sorry,”'},'游客自己','“I am lost,” Mrs. Mills said.',['He','read','the phrase','slowly'],'He swam well yesterday.','“I can help,” Mary said.'],
 apply:[{fills:['slowly']},'I am sorry. I do not speak English.','Can you tell me the way to King Street, please?','I drank water. I didn’t drink tea.',['I','greeted','her','warmly'],'先伸手进衣袋，再取出手册','“I lost my way,” Tom said.','他匆忙刮脸，割伤得很厉害'],
 exam:[{pairs:[['pocket','衣袋'],['greet','问候'],['suddenly','突然地']]},'a phrasebook','友好地','Mrs. Mills · London · last week','不熟悉伦敦，所以迷路','他讲德语，国籍未说明','取出手册 → 翻开 → 找到短语 → 慢慢读','Mrs. Mills的想法','游客说明自己不会英语；是否到国王街未交代',{locate:'slowly'},{fills:['careful','carefully']},{fills:['happily']},'They worked very hard.',{fills:['fast']},{fills:['late']},{fills:['good','well']},{pairs:[['go','went'],['see','saw'],['lose','lost']]},{fills:['understand']},{fills:['spoke']},{fills:['took','gave']},{fills:['ate','drank']},'过去读过，拼写不变，读/red/',{pairs:[['cut','cut'],['put','put'],['read','read']]},{fills:['go','went']},'“I am ready,” Mary said.','游客',['He','opened','the book','slowly'],'I met Jane yesterday and greeted her warmly.']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit73-74/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit73-74/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
