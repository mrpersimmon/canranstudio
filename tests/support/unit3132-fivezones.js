'use strict';
const {expect}=require('@playwright/test');
const {select:commonSelect}=require('./unit31-32-flow');
const {ANSWERS:OLD,DIALOGUE}=require('./unit31-32-flow');
// Independent manuscript: reviewed source pages and target map, never runtime answers.
const SPEAKERS=['琼','杰克','琼','杰克','琼','杰克','杰克','琼','琼','杰克','琼','杰克','杰克','杰克'];
const ANSWERS={listen:OLD.listen,roles:OLD.roles,
grammar:['is climbing',{cloze:['am','are']},['The children','aren’t','cleaning','the room.'],['Is','she','typing','a letter?'],'Yes, I am.',{cloze:['it isn’t']},'表示这周正在进行的阅读，不要求此刻正翻书。','She is in the garden.',{cloze:['opening','putting']},...OLD.observe],
apply:[...OLD.be,...OLD.trans,{cloze:['Where is']},'They are reading a magazine.'],
exam:[...OLD.exam,{cloze:['am','are']},['The children','aren’t','reading','a book.'],['Is','he','opening','the window?'],'Yes, I am.','可以，它也能说现阶段正在进行的活动。','The dog is in the garden.',{cloze:['opening','taking']}]
};

async function select(room,answer){await commonSelect(room,answer);}
async function story(page,base=''){
 await page.goto(base+'/unit31-32/#learn/text');const room=page.locator('.stage-text');await expect(room).toBeVisible({timeout:30000});
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.btext span')).toHaveText(DIALOGUE);await expect(room.locator('.bname')).toHaveText(SPEAKERS);await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(page,id,{base='',inspect,keepAward=false,expectPerfect=true}={}){
 await require('./reward-dialog').handleRewardDialog(page,keepAward);
 await page.goto(base+'/unit31-32/#learn/'+id);const room=page.locator('.stage-'+id),answers=ANSWERS[id];await expect(room).toBeVisible({timeout:30000});
 if(await room.locator('.practice-finish').isVisible())return room;
 const index=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=index;i<answers.length;i++){const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${answers.length} 题`);await inspect?.(room,i,'before');await select(room,answers[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await inspect?.(room,i,'correct');await room.getByRole('button',{name:i===answers.length-1?'完成这一站':'下一题',exact:true}).click();}
 if(expectPerfect)await expect(room.locator('.completion-number')).toHaveText([String(answers.length),String(answers.length),'0']);
 if(!keepAward){
  const card=room.locator('.completion-card');
  // A server-confirmed award may appear after numeric results are already in
  // the DOM. Follow the public settlement sequence before the next activity.
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-result-motion','finished');
 }
 return room;
}
module.exports={ANSWERS,DIALOGUE,SPEAKERS,select,story,activity};
