'use strict';
const {expect}=require('@playwright/test');const previous=require('./unit31-32-flow');
// Independent expectations transcribed from textbook PDF107–110 and reviewed teaching brief.
const DIALOGUE=["You're working hard, George.",'What are you doing?',"I'm making a bookcase.",'Give me that hammer please, Dan.','Which hammer?','This one?','No, not that one.','The big one.','Here you are.','Thanks, Dan.','What are you going to do now, George?',"I'm going to paint it.",'What colour are you going to paint it?',"I'm going to paint it pink.",'Pink!',"This bookcase isn't for me.","It's for my daughter, Susan.","Pink's her favourite colour."];
const ANSWERS={
 listen:[{match:[['bookcase','书架'],['hammer','锤子'],['dish','盘子']]},{match:[['make','制作'],['paint','涂色'],['homework','家庭作业']]},'努力地','最喜欢的'],
 roles:['制作书架',{handoff:['大锤子','George']},'Susan','a bookcase'],
 observe:['画面二','现在正在做作业','George 接下来打算做什么'],
 be:[{cloze:['am','is']},{cloze:['wash','washing']},{cloze:['to']},{cloze:['our']}],
 trans:[['What','are','you','going','to','do?'],['Now','I’m','waiting','for','a','bus.']],
 exam:['bookcase','工具二','书架是给 Susan 做的。','Susan','George 打算把书架涂成粉色。',{cloze:['hard']},'I’m going to paint it pink.','I’m going to shave.',{cloze:['am','are']},{cloze:['are','is']},{cloze:['paint','painting']},{cloze:['to','our']},{cloze:['shaving','washing']},'Pink is',['We’re','going','to','do','our','homework.'],['What','are','you','doing','now?']]
};
const WRONG=['hammer','工具一','书架是给 Dan 做的。','Dan','书架已经全部涂成粉色。',{cloze:['pink']},'I’m making a bookcase.','Now I’m shaving.',{cloze:['is','am']},{cloze:['is','are']},{cloze:['painting','paint']},{cloze:['at','his']},{cloze:['shaveing','washhing']},'Pink are',['going','We’re','to','do','our','homework.'],['are','What','you','doing','now?']];
async function select(r,a){if(a.handoff){await r.getByRole('group',{name:'待选物品',exact:true}).getByRole('button',{name:a.handoff[0],exact:true}).click();await r.getByRole('group',{name:'接收者',exact:true}).getByRole('button',{name:a.handoff[1],exact:true}).click();}else await previous.select(r,a);}
async function activity(page,id,base=''){await page.goto(base+'/unit37-38/#learn/'+id);const r=page.locator('.stage-'+id);for(const[i,a]of ANSWERS[id].entries()){await expect(r.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(r,a);await r.getByRole('button',{name:'检查答案',exact:true}).click();await expect(r.getByRole('status')).toHaveText('答对了！');await expect(r.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await previous.advance(r,i===ANSWERS[id].length-1,id==='exam');}await expect(r.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);}
async function story(page,base=''){await page.goto(base+'/unit37-38/#learn/text');const r=page.locator('.stage-text');for(let i=0;i<18;i++){await r.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(r.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));}await r.getByRole('button',{name:'完成课文',exact:true}).click();await expect(r).toContainText('课文看完了！');}
async function complete(page,base=''){await activity(page,'listen',base);await story(page,base);for(const id of ['roles','observe','be','trans','exam'])await activity(page,id,base);await page.goto(base+'/unit37-38/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');}
module.exports={DIALOGUE,ANSWERS,WRONG,select,advance:previous.advance,activity,story,complete};
