'use strict';
const {expect}=require('@playwright/test');
const {select,advance}=require('./unit31-32-flow');
// Independent expected language: PDF 99–102, approved review draft; never read runtime answers.
const DIALOGUE=['It is a fine day today.','There are some clouds in the sky, but the sun is shining.','Mr. Jones is with his family.','They are walking over the bridge.','There are some boats on the river.','Mr. Jones and his wife are looking at them.','Sally is looking at a big ship.','The ship is going under the bridge.','Tim is looking at an aeroplane.','The aeroplane is flying over the river.'];
const ANSWERS={
 listen:[{match:[['day','一天'],['cloud','云'],['sky','天空']]},{match:[['boat','小船'],['ship','轮船'],['aeroplane','飞机']]},'bridge',{match:[['sleep','睡觉'],['cry','哭'],['wait','等待']]},{match:[['shave','刮脸'],['wash','洗'],['jump','跳']]},'他和家人在一起。','发光；照耀'],
 roles:['Mr. Jones and his family','some boats','Sally → a big ship; Tim → an aeroplane','画面二'],
 observe:['1号船',{cloze:['over']},'从桥上走过'],
 be:[{cloze:['are','is']},'They are waiting for a bus.',{cloze:['walking','shining']},{cloze:['flying']}],
 trans:[['What','are','they','doing?'],['They','are','washing','dishes.']],
 exam:['有云，阳光依然灿烂。','琼斯先生和他的家人','The birds',{cloze:['under','on']},'河流上空',['What','are','the','men','doing?'],{cloze:['are','is']},{match:[['sleep','睡觉'],['cry','哭'],['wash','洗']]},'They are shaving.',{cloze:['coming','giving']},{cloze:['crying']},'They are waiting for a bus.',['The','children','are','jumping','off','the','wall.']]
};
const WRONG=['有云，所以太阳没有照耀。','只有琼斯先生','The children',{cloze:['on','under']},'桥下面',['are','What','the','men','doing?'],{cloze:['is','are']},{match:[['sleep','哭'],['cry','洗'],['wash','睡觉']]},'He is shaving.',{cloze:['comeing','giveing']},{cloze:['criing']},'She is waiting for a bus.',['The','children','jumping','are','off','the','wall.']];
async function activity(page,id,base=''){
 await page.goto(base+'/unit33-34/#learn/'+id);const room=page.locator('.stage-'+id);
 for(const [i,answer]of ANSWERS[id].entries()){await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await advance(room,i===ANSWERS[id].length-1,id==='exam');}
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function story(page,base=''){await page.goto(base+'/unit33-34/#learn/text');const room=page.locator('.stage-text');for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('课文看完了！');}
async function complete(page,base=''){await activity(page,'listen',base);await story(page,base);for(const id of ['roles','observe','be','trans','exam'])await activity(page,id,base);await page.goto(base+'/unit33-34/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,ANSWERS,WRONG,select,advance,activity,story,complete};
