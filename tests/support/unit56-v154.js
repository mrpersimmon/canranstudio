'use strict';
const fs=require('fs/promises'),{expect}=require('@playwright/test'),{CURRENT,BEFORE,CLASSROOM}=require('./unit56-answers'),tasks=require('./units1-30-tasks');
const original=require('./unit5-6-flow');
async function ready(p){await expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(p.locator('html')).not.toHaveAttribute('data-course-painting','',{timeout:30000});}
async function installPrevious(page,folder='unit5-6-before-v154'){
 const patterns=[];for(const name of ['index.html','content.js','unit.js','unit.css','scene.js']){let file='tests/fixtures/'+folder+'/'+name;if(!require('fs').existsSync(file))file='tests/fixtures/unit5-6-before-v154/'+name;const pattern=name==='index.html'?'**/unit5-6/':'**/unit5-6/'+name+'*',body=await fs.readFile(file);await page.route(pattern,r=>r.fulfill({body,contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'}));patterns.push(pattern);}return async()=>{for(const pattern of patterns)await page.unroute(pattern);};
}
async function story(p,base=''){
 await p.goto(base+'/unit5-6/#learn/text');await ready(p);const room=p.locator('.stage-text');if(await room.getByRole('button',{name:'再看一遍',exact:true}).isVisible())return;
 if(await room.getByRole('button',{name:'开始看课文',exact:true}).isVisible())await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 while(await room.getByRole('button',{name:'下一句',exact:true}).isVisible())await room.getByRole('button',{name:'下一句',exact:true}).click();await room.getByRole('button',{name:'完成课文',exact:true}).click();
}
async function select(room,answer){if(answer?.fills){for(let i=0;i<answer.fills.length;i++){const b=room.getByRole('group',{name:'第'+(i+1)+'处填空',exact:true}).getByRole('button',{name:answer.fills[i],exact:true});if(await b.getAttribute('aria-pressed')!=='true')await b.click();}}else await tasks.select(room,answer);}
async function activity(p,id,{base='',edition='current',capture,navigate=true,keepAward=false}={}){
 await require('./reward-dialog').handleRewardDialog(p,keepAward);if(navigate)await p.goto(base+'/unit5-6/#learn/'+id);await ready(p);
 const room=p.locator('.stage-'+id),answers=({current:CURRENT,before:BEFORE,classroom:CLASSROOM}[edition])[id];let guard=0;
 while(!await room.locator('.practice-finish').count()){
  if(++guard>answers.length+1)throw Error('Practice did not advance: '+id);
  const i=Number((await room.locator('.progress-copy').innerText()).match(/第 (\d+)/)[1])-1,check=room.getByRole('button',{name:'检查答案',exact:true});
  const retry=room.getByRole('button',{name:'再试一次',exact:true});if(await retry.isVisible())await retry.click();
  if(await check.isVisible()){if(capture)await capture(room,i,'blank');await select(room,answers[i].answer);await check.click();}
  await expect(room.locator('.fb')).toHaveText('答对了！');if(capture)await capture(room,i,'correct');
  await room.getByRole('button',{name:i<answers.length-1?'下一题':id==='exam'?'查看本次记录':'完成这一站',exact:true}).click();
 }
 if(!keepAward)await require('./reward-dialog').finishRewardPresentation(p,room);return room;
}
async function complete(p,base='',edition='current'){await story(p,base);for(const id of Object.keys({current:CURRENT,before:BEFORE,classroom:CLASSROOM}[edition]))await activity(p,id,{base,edition});await p.goto(base+'/unit5-6/#learn/certificate');await ready(p);}
const book=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit5-6:learning:v1')));
module.exports={CURRENT,BEFORE,CLASSROOM,ready,installPrevious,story,activity,complete,select,book,DIALOGUE:original.DIALOGUE,PEOPLE:original.PEOPLE};
