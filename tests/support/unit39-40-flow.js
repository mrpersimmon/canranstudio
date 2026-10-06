'use strict';
const {expect}=require('@playwright/test');
const previous=require('./unit37-38-flow');
// Independent expectations transcribed from PDF111–114 and the reviewed task draft.
// Never read the application question objects to construct expected answers.
const DIALOGUE=['What are you going to do with that vase, Penny?','I’m going to put it on this table, Sam.','Don’t do that.','Give it to me.','What are you going to do with it?','I’m going to put it here, in front of the window.','Be careful!','Don’t drop it!','Don’t put it there, Sam.','Put it here, on this shelf.','There we are!','It’s a lovely vase.','Those flowers are lovely, too.'];
const ANSWERS={
 listen:[{match:[['vase','花瓶'],['flower','花'],['front','前面']]},{match:[['show','给……看'],['send','寄送'],['take','带给']]},'小心一点','掉下'],
 roles:['桌子上',{handoff:['花瓶','Sam']},'in front of the window','花'],
 observe:['Penny 在提醒 Sam 小心。','换到架子上','把那张画给我看'],
 be:[{cloze:['it','them']},{cloze:['to']},{cloze:['do']},{cloze:['with']}],
 trans:[['Give','it','to','me.'],['I’m','going','to','turn','them','off.']],
 exam:['vase','架子上','Sam 打算把它放在窗前。','别让它掉下去',{cloze:['put']},{cloze:['with']},'Penny','Mrs. Jones',{cloze:['to']},{cloze:['show','send']},'把这些花带给我的妻子',{cloze:['it','them']},'Put it on.',{cloze:['on','off']},['I’m','going','to','give','them','to','the','children.'],['What','are','you','going','to','do','with','it?']]
};
const WRONG=['flower','桌子上','Sam 已经把它放好了。','把它扔到地上',{cloze:['putting']},{cloze:['on']},'Sam','these books',{cloze:['with']},{cloze:['send','show']},'把这些花给我看',{cloze:['them','it']},'Put on it.',{cloze:['off','on']},['I’m','going','to','give','to','them','the','children.'],['are','What','you','going','to','do','with','it?']];
async function activity(page,id,base=''){await page.goto(base+'/unit39-40/#learn/'+id);const r=page.locator('.stage-'+id);for(const[i,a]of ANSWERS[id].entries()){await expect(r.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await previous.select(r,a);await r.getByRole('button',{name:'检查答案',exact:true}).click();await expect(r.getByRole('status')).toHaveText('答对了！');await expect(r.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await previous.advance(r,i===ANSWERS[id].length-1,id==='exam');}await expect(r.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);}
async function story(page,base=''){await page.goto(base+'/unit39-40/#learn/text');const r=page.locator('.stage-text');for(let i=0;i<13;i++){await r.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(r.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}await r.getByRole('button',{name:'完成课文',exact:true}).click();await expect(r).toContainText('课文看完了！');}
async function complete(page,base=''){await activity(page,'listen',base);await story(page,base);for(const id of ['roles','observe','be','trans','exam'])await activity(page,id,base);await page.goto(base+'/unit39-40/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,ANSWERS,WRONG,select:previous.select,advance:previous.advance,activity,story,complete};
