'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const tasks=require('../support/units1-30-tasks');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const options={base:base.replace(/\/$/,''),keepAward:true};
test.use({...(process.env.SETTLEMENT_REVIEW_BROWSER?{browserName:process.env.SETTLEMENT_REVIEW_BROWSER}:{}),viewport:{width:390,height:844}});

// Observe painted frames rather than only the final DOM: the reported defect
// flashed the completed score before the server-confirmed keepsake appeared.
async function observe(page,zone='reply'){
 await page.addInitScript(zone=>{
  window.settlementFrames=[];
  function visible(element){
   if(!element||!element.getClientRects().length)return false;
   for(let current=element;current;current=current.parentElement){
    const style=getComputedStyle(current);
    if(current.hidden||style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;
   }
   return true;
  }
  function sample(){
   const finish=document.querySelector('.stage-'+zone+' .completion-card');
   if(finish&&window.settlementFrames.length<1500)window.settlementFrames.push({modal:!!document.querySelector('dialog.award-reveal[open]'),flight:!!document.querySelector('.award-reveal .travelling-star'),phase:finish.dataset.resultMotion,visible:visible(finish.querySelector('.completion-stats'))});
   requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
 },zone);
}
async function openStudent(page,browser,label){
 await adminLogin(page,base);
 return studentLogin(browser,await createStudent(page,label,'小禾',[/Lesson 3–4/]),base);
}
function playingRuns(frames){return frames.reduce((sum,frame,index)=>sum+(frame.phase==='playing'&&frames[index-1]?.phase!=='playing'?1:0),0);}
const result=page=>page.locator('.stage-reply .completion-card');
const reveal=page=>page.getByRole('dialog',{name:/纪念卡结算/});
const progressPath=base+'api/progress';
async function heldProgress(page){return (await(await page.request.get('/__test__/course-held')).json()).includes(progressPath);}

test('全对等待真实确认时不闪结算，星飞完成才能关闭，关闭后仅一次结算且复练不改原星',async({page,browser},info)=>{
 test.setTimeout(120000);
 const student=await openStudent(page,browser,'结算顺序全对班'),p=student.page;
 try{
  await observe(p);
  await tasks.activity(p,'3-4','reply',{...options,beforeFinish:()=>courseResponse(p,progressPath,{hold:true})});
  await expect.poll(()=>heldProgress(p)).toBe(true);
  await p.screenshot({path:info.outputPath('all-correct-awaiting-confirmation.png')});
  // This is deliberately before releasing the actual server response, not a
  // longer wait that could hide the score flash once the card finally opens.
  await expect(result(p).locator('.completion-stats')).not.toBeVisible();
  await expect(reveal(p)).toHaveAttribute('data-phase','pending');
  await expect(reveal(p)).toHaveAttribute('data-dismissible','false');
  expect((await p.evaluate(()=>window.settlementFrames)).filter(frame=>frame.visible)).toEqual([]);
  await expect(p.locator('#starCount')).toHaveText('0');
  await courseResponse(p,progressPath,null,{resumeHeld:true});
  await expect(reveal(p).locator('.travelling-star')).toBeVisible();
  await reveal(p).click({position:{x:8,y:8}});
  await expect(reveal(p)).toBeVisible();
  await expect(result(p).locator('.completion-stats')).not.toBeVisible();
  await expect(reveal(p).getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();
  await expect(reveal(p).locator('.travelling-star')).toHaveCount(0);
  await expect(reveal(p)).toHaveAttribute('data-dismissible','true');
  await reveal(p).click({position:{x:8,y:8}});
  await expect(reveal(p)).not.toBeVisible();
  await expect(result(p)).toHaveAttribute('data-result-motion','finished');
  await expect(result(p).getByRole('button',{name:'再练一轮',exact:true})).toBeVisible();
  const firstFrames=await p.evaluate(()=>window.settlementFrames);
  expect(firstFrames.filter(frame=>frame.modal&&frame.visible)).toEqual([]);
  expect(playingRuns(firstFrames)).toBe(1);
  const original=await p.evaluate(()=>JSON.parse(localStorage.getItem(CanranCore.unit34.progress.learningKey+':awards:'+CanranCore.unit34.reward.edition)));
  expect(Object.keys(original.zones)).toEqual(['reply']);
  await result(p).getByRole('button',{name:'再练一轮',exact:true}).click();
  await tasks.activity(p,'3-4','reply',options);
  await expect(reveal(p)).toHaveAttribute('data-kind','replay');
  await expect(reveal(p)).toHaveAttribute('data-dismissible','true');
  await expect(reveal(p).locator('.travelling-star')).toHaveCount(0);
  await expect(result(p).locator('.completion-stats')).not.toBeVisible();
  await reveal(p).press('Escape');
  await expect(result(p)).toHaveAttribute('data-result-motion','finished');
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem(CanranCore.unit34.progress.learningKey+':awards:'+CanranCore.unit34.reward.edition)))).toEqual(original);
  await p.reload();
  // Refresh first rebuilds the authorized course behind its real paint guard.
  // Read the hydrated ledger only after that existing readiness boundary.
  await expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  await expect(p.locator('#starCount')).toHaveText('1');
  await expect(reveal(p)).not.toBeVisible();
  await expect(result(p).locator('.completion-stats')).toBeVisible();
  expect(playingRuns(await p.evaluate(()=>window.settlementFrames))).toBe(0);
 }finally{await courseResponse(p,progressPath).catch(()=>{});await student.context.close();}
});

test('同步失败可结束结算，恢复后的真实确认只补星不重新弹卡或播放统计',async({page,browser})=>{
 test.setTimeout(90000);
 const student=await openStudent(page,browser,'结算顺序恢复班'),p=student.page;
 try{
  await observe(p,'listen');
  await tasks.activity(p,'3-4','listen',{...options,beforeFinish:()=>courseResponse(p,progressPath,{hold:true})});
  await expect.poll(()=>heldProgress(p)).toBe(true);
  await expect(reveal(p)).toHaveAttribute('data-phase','pending');
  await expect(p.locator('#starCount')).toHaveText('0');
  await courseResponse(p,progressPath,{status:503,json:{error:'Temporary verification outage'}});
  const finish=p.locator('.stage-listen .completion-card');
  await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','retry');
  await expect(finish).toHaveAttribute('data-result-motion','finished');
  await expect(reveal(p)).not.toBeVisible();
  await courseResponse(p,progressPath);
  const sampleCount=await p.evaluate(()=>window.settlementFrames.length);
  await student.context.setOffline(true);await student.context.setOffline(false);
  await expect(p.locator('#starCount')).toHaveText('1');
  await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await expect.poll(()=>p.evaluate(()=>window.settlementFrames.length)).toBeGreaterThan(sampleCount+2);
  await expect(reveal(p)).not.toBeVisible();
  const frames=await p.evaluate(()=>window.settlementFrames);
  expect(frames.slice(sampleCount).filter(frame=>frame.modal||frame.flight)).toEqual([]);
  expect(playingRuns(frames)).toBe(1);
 }finally{await courseResponse(p,progressPath).catch(()=>{});await student.context.close();}
});

test('有错订正后只显示一次结算，不弹纪念卡也不飞星',async({page,browser},info)=>{
 test.setTimeout(90000);
 const student=await openStudent(page,browser,'结算顺序订正班'),p=student.page;
 try{
  await observe(p);
  await p.goto(base+'unit3-4/#learn/reply');
  const room=p.locator('.stage-reply');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeVisible({timeout:30000});
  await room.locator('.practice-options').getByRole('button').filter({hasNotText:'This is not my coat.'}).first().click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await tasks.activity(p,'3-4','reply',options);
  await expect(result(p)).toHaveAttribute('data-result-motion','finished');
  await expect(result(p).locator('.stat-incorrect .completion-number')).toHaveText('1');
  await expect(reveal(p)).not.toBeVisible();
  await expect(p.locator('#starCount')).toHaveText('0');
  const frames=await p.evaluate(()=>window.settlementFrames);
  expect(frames.filter(frame=>frame.modal)).toEqual([]);
  expect(playingRuns(frames)).toBe(1);
  await p.screenshot({path:info.outputPath('corrected-round-one-result.png')});
 }finally{await student.context.close();}
});

test('旧区补传与当前区一起确认时只飞当前一颗星，不重放旧区奖励',async({page,browser})=>{
 test.setTimeout(120000);
 const student=await openStudent(page,browser,'结算顺序合并确认班'),p=student.page;
 try{
  await observe(p);
  await p.addInitScript(()=>{
   window.settlementFlights=0;
   new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1&&node.classList.contains('travelling-star'))window.settlementFlights++;}).observe(document,{childList:true,subtree:true});
  });
  await tasks.activity(p,'3-4','listen',{...options,beforeFinish:()=>courseResponse(p,progressPath,{status:503,json:{error:'Temporary verification outage'}})});
  await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','retry');
  await expect(p.locator('.stage-listen .completion-card')).toHaveAttribute('data-result-motion','finished');
  await expect(p.locator('#starCount')).toHaveText('0');
  await expect(reveal(p)).not.toBeVisible();
  await tasks.activity(p,'3-4','reply',{...options,beforeFinish:()=>courseResponse(p,progressPath,{hold:true})});
  await expect.poll(()=>heldProgress(p)).toBe(true);
  await expect(reveal(p)).toHaveAttribute('data-phase','pending');
  await expect(result(p).locator('.completion-stats')).not.toBeVisible();
  await courseResponse(p,progressPath,null,{resumeHeld:true});
  await expect(reveal(p).getByRole('group',{name:'已获得 2 / 5 颗星',exact:true})).toBeVisible();
  await expect(reveal(p)).toHaveAttribute('data-dismissible','true');
  expect(await p.evaluate(()=>window.settlementFlights)).toBe(1);
  await reveal(p).press('Escape');
  await expect(result(p)).toHaveAttribute('data-result-motion','finished');
  await expect(p.locator('#starCount')).toHaveText('2');
  expect(playingRuns(await p.evaluate(()=>window.settlementFrames))).toBe(1);
 }finally{await courseResponse(p,progressPath).catch(()=>{});await student.context.close();}
});

test('本机待同步队列写入失败不会锁住结算，恢复后不重弹卡或改写原练习',async({page,browser})=>{
 test.setTimeout(90000);
 const student=await openStudent(page,browser,'结算本机存储故障班'),p=student.page;
 try{
  await observe(p,'listen');
  await p.addInitScript(()=>{
   const original=Storage.prototype.setItem;
   window.failSettlementQueueWrites=false;window.settlementQuotaFailures=0;
   Storage.prototype.setItem=function(key,value){
    if(this===localStorage&&window.failSettlementQueueWrites&&String(key).includes(':pending:unit3-4')){
     window.settlementQuotaFailures++;throw new DOMException('Simulated queue quota exhaustion','QuotaExceededError');
    }
    return original.call(this,key,value);
   };
  });
  await tasks.activity(p,'3-4','listen',{...options,beforeFinish:async()=>{
   // Finish earlier genuine transmissions first, then fail only the next
   // durable queue write. Answer records and server responses are not forged.
   await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
   await p.evaluate(()=>{window.failSettlementQueueWrites=true;});
  }});
  await expect.poll(()=>p.evaluate(()=>window.settlementQuotaFailures)).toBeGreaterThan(0);
  await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','failed');
  await expect(p.locator('#studentSyncStatus')).toHaveText('暂未保存，请先别关闭页面');
  const finish=p.locator('.stage-listen .completion-card');
  await expect(finish).toHaveAttribute('data-result-motion','finished');
  await expect(reveal(p)).not.toBeVisible();
  await expect(p.locator('#starCount')).toHaveText('0');
  const preserved=await p.evaluate(()=>JSON.parse(localStorage.getItem(CanranCore.unit34.progress.learningKey)));
  const sampleCount=await p.evaluate(()=>window.settlementFrames.length);
  await p.evaluate(()=>{window.failSettlementQueueWrites=false;});
  await student.context.setOffline(true);await student.context.setOffline(false);
  await expect(p.locator('#starCount')).toHaveText('1');
  await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  expect(await p.evaluate(()=>JSON.parse(localStorage.getItem(CanranCore.unit34.progress.learningKey)))).toEqual(preserved);
  await expect.poll(()=>p.evaluate(()=>window.settlementFrames.length)).toBeGreaterThan(sampleCount+2);
  expect((await p.evaluate(()=>window.settlementFrames)).slice(sampleCount).filter(frame=>frame.modal||frame.flight)).toEqual([]);
  expect(playingRuns(await p.evaluate(()=>window.settlementFrames))).toBe(1);
 }finally{await student.context.close();}
});
