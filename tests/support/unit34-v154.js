'use strict';
const fs=require('fs/promises'),{expect}=require('@playwright/test');
const original=require('./unit3-4-flow'),tasks=require('./units1-30-tasks');
const ANSWERS=original.ANSWERS;
const OLD25={...ANSWERS,reply:tasks.CASES['3-4'].changes.find(x=>x.group==='reply').answers.map(q=>q.answer),exam:tasks.CASES['3-4'].old.exam.map(q=>q.answer)};
const ready=p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
async function installPrevious(page,folder='unit3-4-before-v154'){
 const patterns=[];
 for(const name of ['index.html','content.js','unit.js','unit.css','scene.js']){
  let file='tests/fixtures/'+folder+'/'+name;if(!require('fs').existsSync(file))file='tests/fixtures/unit3-4-before-v154/'+name;
  const pattern=name==='index.html'?'**/unit3-4/':'**/unit3-4/'+name+'*',body=await fs.readFile(file);await page.route(pattern,r=>r.fulfill({body,contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'}));patterns.push(pattern);
 }
 return async()=>{for(const pattern of patterns)await page.unroute(pattern);};
}
async function story(p,base=''){
 await p.goto(base+'/unit3-4/#learn/text');await ready(p);const room=p.locator('.stage-text');
 if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function activity(p,id,{base='',old25=false,capture,navigate=true,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(p,keepAward);
 if(navigate)await p.goto(base+'/unit3-4/#learn/'+id);await ready(p);
 const room=p.locator('.stage-'+id),answers=(old25?OLD25:ANSWERS)[id];if(await room.locator('.practice-finish').count()){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(p,room);return room;}
 const first=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1;
 for(let i=first;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  if(await check.isVisible()){if(capture)await capture(room,i,'blank');await tasks.select(room,answers[i]);await check.click();}
  await expect(room.locator('.fb')).toHaveText('答对了！');if(capture)await capture(room,i,'correct');
  await room.getByRole('button',{name:i<answers.length-1?'下一题':id==='exam'?'查看本次记录':'完成这一站',exact:true}).click();
 }
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(p,room);return room;
}
async function complete(p,base='',old25=false){await story(p,base);for(const id of ['listen','roles','reply','manners','exam'])await activity(p,id,{base,old25});await p.goto(base+'/unit3-4/#learn/certificate');await ready(p);}
const book=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit3-4:learning:v1')));
module.exports={ANSWERS,OLD25,ready,story,activity,complete,book,installPrevious,select:tasks.select,DIALOGUE:original.DIALOGUE};
