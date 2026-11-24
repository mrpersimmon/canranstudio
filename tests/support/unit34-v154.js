'use strict';
const {courseButton,readyCourse,restoredPracticeIndex}=require('./course-controls');
const fs=require('fs/promises'),{expect}=require('@playwright/test');
const original=require('./unit3-4-flow'),tasks=require('./units1-30-tasks');
const ANSWERS=original.ANSWERS;
const OLD25={...ANSWERS,reply:tasks.CASES['3-4'].changes.find(x=>x.group==='reply').answers.map(q=>q.answer),exam:tasks.CASES['3-4'].old.exam.map(q=>q.answer)};
const ready=p=>expect(p.locator('#wordPageProgress:visible,.practice-screen-stage .practice-content:visible,.learning-surface:visible').first()).toBeVisible({timeout:30000});
async function installPrevious(page,folder='unit3-4-before-v154'){
 const patterns=[];
 for(const name of ['index.html','content.js','unit.js','unit.css','scene.js']){
  let file='tests/fixtures/'+folder+'/'+name;if(!require('fs').existsSync(file))file='tests/fixtures/unit3-4-before-v154/'+name;
  const pattern=name==='index.html'?'**/unit3-4/':'**/unit3-4/'+name+'*',body=await fs.readFile(file);await page.route(pattern,r=>r.fulfill({body,contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'}));patterns.push(pattern);
 }
 return async()=>{for(const pattern of patterns)await page.unroute(pattern);};
}
async function story(p,base=''){
 await p.goto(base+'/unit3-4/#learn/text');await readyCourse(p);const room=p.locator('.stage-text');
 const complete=room.locator(':scope > .practice-finish:visible');
 const advance=room.getByRole('button',{name:/^(开始看课文|开始故事|下一句|完成课文|去练习)$/,exact:true});
 await expect(advance.or(complete).first()).toBeVisible();
 if(await complete.isVisible())return;
 for(let clicks=0;clicks<=original.DIALOGUE.length;clicks++){
  const label=await advance.innerText();await advance.click();
  if(label==='完成课文'||label==='去练习')return;
 }
 throw Error('完整的原文读完后应当可以进入练习');
}
async function activity(p,id,{base='',old25=false,capture,navigate=true,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(p,keepAward);
 if(navigate)await p.goto(base+'/unit3-4/#learn/'+id);await ready(p);
 const room=p.locator('.stage-'+id),answers=(old25?OLD25:ANSWERS)[id];await expect(room).toBeVisible({timeout:30000});
 const first=await restoredPracticeIndex(room);
 if(first===null){if(!keepAward)await require('./reward-dialog').finishRewardPresentation(p,room);return room;}
 for(let i=first;i<answers.length;i++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  if(await check.isVisible()){if(capture)await capture(room,i,'blank');await tasks.select(room,answers[i]);await check.click();}
  await expect(room.locator('.fb')).toHaveText('答对了！');if(capture)await capture(room,i,'correct');
  await room.getByRole('button',{name:i<answers.length-1?'下一题':id==='exam'?/^(查看本次记录|完成挑战)$/:/^(完成这一站|完成练习)$/,exact:true}).click();
 }
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(p,room);return room;
}
async function complete(p,base='',old25=false){await story(p,base);for(const id of ['listen','roles','reply','manners','exam'])await activity(p,id,{base,old25});await p.goto(base+'/unit3-4/#learn/certificate');await ready(p);}
const book=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit3-4:learning:v1')));
module.exports={ANSWERS,OLD25,ready,story,activity,complete,book,installPrevious,select:tasks.select,DIALOGUE:original.DIALOGUE};
