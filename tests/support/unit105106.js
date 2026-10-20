'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./units1-30-tasks');
// Independently reviewed answer sheet. No runtime answers or injected results.
const ANSWERS={
listen:['dictionary',{pairs:[['spell','拼写'],['mistake','错误'],['present','礼物']]},{locate:'Correct'},'保留这本书','这封信里有很多错误','聪明的；有智慧的','马上',{pairs:[['carry it','把它带上'],['correct it','把它改正'],['keep it','把它保留']]}],
roles:['Sandra','Bob传话，Sandra过来','口头拼对了，但先前只打了一个L','把这封信重打一遍','Sandra答应去重打，文中没有展示重打后的信','一本词典','老板希望词典有帮助，效果尚未交代','不能，文中没有这样的结论'],
grammar:[{fills:['to try']},'A是我自己读，B是Anna读',{fills:['him','help']},['Tell her','to read','the letter'],{fills:['wants','correct']},['What do you','want me','to do'],{fills:['doesn’t','to']},['Tell her','not to','open the door'],'A要求别传这句话，B要求传达别开窗',{fills:['him','himself']},'She wants them to bring their books.','to come引出动作，to my office表示去向','I hope to travel tomorrow.',{fills:['spell','to spell']},{fills:['her','help']},['Tell them','not to','be late'],'Because she doesn’t want him to lose the key.','Tell her to keep this book.'],
apply:['I want to check this letter.','I want Anna to correct the letter.',['Tell Ben','not to','open the window'],{fills:['blue','red']},'The teacher wants her to bring her books.','Because she doesn’t want him to miss the bus.','Could you help me find this word, please?','May答应重打；是否完成还不知道'],
exam:['口头拼对了，已打文字少了一个L','a dictionary','Sandra答应重打，老板希望词典有帮助','改正',{fills:['to learn']},'Ben',{fills:['them','help']},['Tell him','to carry','it'],{fills:['wants','stay']},['What do you','want me','to do'],{fills:['doesn’t','to']},['Tell her','not to','lose it'],'Don’t ask him to wait.',{fills:['her','herself']},'The teacher wants them to bring their books.','to speak','I hope to learn to swim.',{fills:['correct','to correct']},'Because she doesn’t want him to lose the ticket.',{fills:['green','yellow']},'没有，只说明我希望他去改','Could you carry this book for me, please?']
};
async function select(room,answer){if(answer?.locate)await room.locator('.locate-sentence').getByRole('button',{name:answer.locate,exact:true}).click();else await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit105-106/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false}={}){
 await page.goto(base+'/unit105-106/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
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
