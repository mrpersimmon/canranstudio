'use strict';
const {expect}=require('@playwright/test');
// Expected language was transcribed from PDF 95–98 and the reviewed question draft,
// deliberately independent of the runtime question/answer objects.
const DIALOGUE=['Where’s Sally, Jack?','She’s in the garden, Jean.','What’s she doing?','She’s sitting under the tree.','Is Tim in the garden, too?','Yes, he is.','He’s climbing the tree.','I beg your pardon?','Who’s climbing the tree?','Tim is.','What about the dog?','The dog’s in the garden, too.','It’s running across the grass.','It’s running after a cat.'];
const ANSWERS={
 listen:[{match:[['garden','花园'],['tree','树'],['grass','草地']]},{match:[['letter','信'],['basket','篮子'],['bone','骨头']]},'cat','打字','做饭',{match:[['milk','牛奶'],['meal','一顿饭'],['tooth','牙齿']]},'清洁','climb'],
 roles:['Tim','It’s running after a cat.','把刚才的话再说一遍'],
 observe:[{match:[['Where is Sally?','她在哪里'],['What is she doing?','她正在做什么'],['Who is climbing the tree?','谁正在爬树']]},{cloze:['is climbing']},'She is shutting the door.'],
 be:['Sally','He is opening the window.',{cloze:['making']},{cloze:['sitting','running']}],
 trans:[['What','is','she','doing?'],['She','isn’t','emptying','the','basket.'],['The','dog','is','running','after','a','cat.']],
 exam:[{cloze:['Where is']},'Sally','What is he doing?','Tim is.',['The','dog','is','running','across','the','grass.'],'猫追着狗',{cloze:['is typing']},'No, he isn’t. He is opening the window.','Yes, it is.',{cloze:['cooking','making']},{cloze:['shutting']},{cloze:['its','at']}]
};
async function select(room,answer){
 if(Array.isArray(answer)){const bank=room.getByRole('group',{name:'待选词块',exact:true});for(const token of answer)await bank.getByRole('button',{name:token,exact:true}).and(bank.locator('button:enabled')).first().click();}
 else if(Array.isArray(answer.match)){for(const [en,cn]of answer.match){const b=room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:en,exact:true});await b.click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:cn,exact:true}).click();}}
 else if(answer.cloze){for(const [i,value]of answer.cloze.entries())await room.getByRole('group',{name:'第'+(i+1)+'处填空',exact:true}).getByRole('button',{name:value,exact:true}).click();}
 else await room.getByRole('button',{name:answer,exact:true}).click();
}
async function advance(room,last,exam=false){await room.getByRole('button',{name:last?(exam?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();}
async function activity(page,id,base=''){
 await page.goto(base+'/unit31-32/#learn/'+id);const room=page.locator('.stage-'+id);
 for(const [i,answer]of ANSWERS[id].entries()){
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await advance(room,i===ANSWERS[id].length-1,id==='exam');
 }
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function story(page,base=''){
 await page.goto(base+'/unit31-32/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('课文看完了！');
}
async function complete(page,base=''){await activity(page,'listen',base);await story(page,base);for(const id of ['roles','observe','be','trans','exam'])await activity(page,id,base);await page.goto(base+'/unit31-32/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,ANSWERS,select,advance,activity,story,complete};
