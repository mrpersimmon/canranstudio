'use strict';
const {expect}=require('@playwright/test');
const {select,advance}=require('./unit31-32-flow');
// Independent expected language transcribed from textbook PDF 103–106 and the design review.
// Never derive expected answers from the runtime question objects.
const DIALOGUE=['This is a photograph of our village.','Our village is in a valley.','It is between two hills.','The village is on a river.','Here is another photograph of the village.','My wife and I are walking along the banks of the river.','We are on the left.','There is a boy in the water.','He is swimming across the river.','Here is another photograph.','This is the school building.','It is beside a park.','The park is on the right.','Some children are coming out of the building.','Some of them are going into the park.'];
const ANSWERS={
 listen:[{match:[['photograph','照片'],['village','村庄'],['valley','山谷']]},{match:[['hill','小山'],['bank','河岸'],['water','水']]},{match:[['building','建筑物'],['park','公园'],['swim','游泳']]},'另一张照片','说话人的妻子'],
 roles:['在河边','My wife and I','照片二','Some children'],
 observe:['照片三',{cloze:['across','along']},'照片一','照片二'],
 be:['Where is the man going?',{cloze:['is','are']},'near the tree',{cloze:['swimming','walking']}],
 trans:[['Where','is','the','boy','swimming?'],['The','children','are','going','into','the','park.']],
 exam:[{cloze:['between','on']},'valley','说话人和妻子','从楼里出来，其中一些走进公园。','没有，只说了其中一些。','照片二',{cloze:['along','across']},{cloze:['beside','between']},'从树枝上离开、向下跳',{cloze:['under','over']},{cloze:['on','in']},'near the tree','Where are they reading?',{cloze:['is','are']},['Where','are','the','cats','running?'],{cloze:['running','coming']}]
};
const WRONG=[{cloze:['under','in']},'bank','只有说话人','从公园出来，其中一些走进楼里。','有，明确说了全部。','照片一',{cloze:['across','along']},{cloze:['between','beside']},'坐在树枝上不动',{cloze:['over','under']},{cloze:['in','on']},'sitting','What are they doing?',{cloze:['are','is']},['are','Where','the','cats','running?'],{cloze:['runing','comming']}];
async function activity(page,id,base=''){
 await page.goto(base+'/unit35-36/#learn/'+id);const room=page.locator('.stage-'+id);
 for(const [i,answer]of ANSWERS[id].entries()){await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await advance(room,i===ANSWERS[id].length-1,id==='exam');}
 await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
}
async function story(page,base=''){await page.goto(base+'/unit35-36/#learn/text');const room=page.locator('.stage-text');for(let i=0;i<DIALOGUE.length;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room).toContainText('课文看完了！');}
async function complete(page,base=''){await activity(page,'listen',base);await story(page,base);for(const id of ['roles','observe','be','trans','exam'])await activity(page,id,base);await page.goto(base+'/unit35-36/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,ANSWERS,WRONG,select,advance,activity,story,complete};
