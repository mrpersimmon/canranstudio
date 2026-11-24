'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress'),{choose}=require('../support/answer-question');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:10000});
if(process.env.LOCAL_AWARDS_BROWSER)test.use({browserName:process.env.LOCAL_AWARDS_BROWSER});
async function open(page,browser,label,device=devices[0],extra={}){
 await adminLogin(page,base);const account=await createStudent(page,label,'即时星星同学',[/^Lesson 1–2 /]);
 const session=await studentLogin(browser,account,base,{...contextOptions(device),...extra}),p=session.page;
 await p.addInitScript(()=>{window.localAwardFlights=[];new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)if(n.nodeType===1&&n.classList.contains('travelling-star'))window.localAwardFlights.push(performance.now());}).observe(document,{subtree:true,childList:true});});
 await p.goto(base+'unit1-2/#learn/listen');await expect(p.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:45000});return session;
}
async function complete(p,beforeFinish=async()=>{}){
 const room=p.locator('.stage-listen'),qs=definition(process.cwd(),'unit1-2',base).questions.listen;
 for(const[n,q]of qs.entries()){await choose(room,q);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');if(n===qs.length-1)await beforeFinish();await room.getByRole('button',{name:n===qs.length-1?/^完成/:'下一题',exact:n!==qs.length-1}).click();}
 return room;
}
async function closeCard(p){const card=p.locator('.award-reveal[open]');await expect(card).toHaveAttribute('data-dismissible','true',{timeout:4000});await card.press('Escape');await expect(p.locator('.stage-listen .completion-card')).toHaveAttribute('data-result-motion','finished');}
const snapshot=p=>p.evaluate(()=>JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)));
for(const device of devices)test(device.id+' flies before a held confirmation and never flies twice',async({page,browser},info)=>{
 test.setTimeout(150000);const session=await open(page,browser,'本机得星-'+device.id,device),p=session.page;
 try{
  let start;await complete(p,async()=>{await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await courseResponse(p,base+'api/progress',{hold:true});start=await p.evaluate(()=>performance.now());});
  await expect(p.locator('.travelling-star')).toBeVisible({timeout:1200});await expect(p.locator('#starCount')).toHaveText('1');
  const flightStartMs=(await p.evaluate(()=>window.localAwardFlights[0]))-start;expect(flightStartMs).toBeLessThan(1000);
  await fs.writeFile(info.outputPath('timing.json'),JSON.stringify({device:device.name,viewport:device.viewport,flightStartMs,serverResponseHeld:true},null,2));
  await closeCard(p);await expect(p.locator('.award-reveal[open]')).toHaveCount(0);await p.goto(base+'unit1-2/#learn/certificate');
  const save=p.getByRole('button',{name:'保存动图',exact:true});await expect(save).toBeDisabled();await expect(p.locator('.story-award-status')).toContainText('同步');
  const before=await snapshot(p);await p.screenshot({path:info.outputPath('pending-card.png'),scale:'css'});
  await courseResponse(p,base+'api/progress',null,{resumeHeld:true});await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await expect(save).toBeEnabled();await expect(p.locator('.award-reveal[open]')).toHaveCount(0);expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(1);expect(await snapshot(p)).toEqual(before);
 }finally{await courseResponse(p,base+'api/progress').catch(()=>{});await session.context.close();}
});
test('offline local award survives refresh, syncs later and keeps the original proof',async({page,browser})=>{
 test.setTimeout(150000);const session=await open(page,browser,'离线本机得星'),p=session.page;
 try{
  await courseResponse(p,base+'api/progress',{hold:true});await session.context.setOffline(true);await complete(p);await expect(p.locator('.travelling-star')).toBeVisible({timeout:1200});await expect(p.locator('#starCount')).toHaveText('1');await closeCard(p);const before=await snapshot(p);
  await session.context.setOffline(false);await p.reload();await expect(p.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:45000});await expect(p.locator('#starCount')).toHaveText('1');expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(0);expect((await snapshot(p)).activity.unitAwardClaims).toEqual(before.activity.unitAwardClaims);
  await courseResponse(p,base+'api/progress',null,{resumeHeld:true});await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await expect(p.locator('#starCount')).toHaveText('1');expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(0);
 }finally{await session.context.setOffline(false);await courseResponse(p,base+'api/progress').catch(()=>{});await session.context.close();}
});
test('a real server rejection corrects the provisional star and leaves answers readable',async({page,browser})=>{
 test.setTimeout(150000);const session=await open(page,browser,'远端复核纠正',devices[0],{serviceWorkers:'block'}),p=session.page;let reviews;
 try{
  await p.route('**/api/progress',async route=>{const data=route.request().postDataJSON();if(data.value?.activity?.unitAwardClaims?.listen){data.value.activity.unitAwardClaims.listen.roundPolicy='retired-edition';const response=await route.fetch({postData:data});reviews=(await response.json()).awardReviews;await route.fulfill({response});}else await route.continue();});
  await complete(p);await expect.poll(()=>reviews?.[0]?.accepted).toBe(false);await expect(p.locator('#starCount')).toHaveText('0');await expect(p.locator('.award-confirmation')).toContainText('版本');
  await expect(p.locator('.award-reveal[open]')).toHaveAttribute('data-dismissible','true');await p.locator('.award-reveal[open]').press('Escape');const saved=await snapshot(p);expect(Object.keys(saved.records).length).toBeGreaterThan(0);expect(saved.activity.unitAwardClaims.listen.roundPolicy).not.toBe('retired-edition');
  await p.reload();await expect(p.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:45000});await expect(p.locator('#starCount')).toHaveText('0');expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(0);
 }finally{await session.context.close();}
});
test('local storage failure cannot produce an unsaved visual star',async({page,browser})=>{
 test.setTimeout(120000);const session=await open(page,browser,'本机保存失败'),p=session.page;
 try{
  await complete(p,async()=>{await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await p.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(String(k).endsWith(':learning:v1'))throw new DOMException('Test-only quota','QuotaExceededError');return set.call(this,k,v);};});});
  await expect(p.locator('.stage-listen .completion-card')).toHaveAttribute('data-result-motion','finished');await expect(p.locator('#starCount')).toHaveText('0');expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(0);
 }finally{await session.context.close();}
});
test('refresh rebuilds a failed outbox from durable local proof without another flight',async({page,browser})=>{
 test.setTimeout(150000);const session=await open(page,browser,'同步队列恢复'),p=session.page;
 try{
  await p.addInitScript(()=>{const set=Storage.prototype.setItem;window.failAwardOutbox=false;Storage.prototype.setItem=function(k,v){if(window.failAwardOutbox&&String(k).includes(':pending:unit1-2'))throw new DOMException('Test-only outbox quota','QuotaExceededError');return set.call(this,k,v);};});
  await p.reload();await expect(p.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:45000});
  await complete(p,async()=>{await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await p.evaluate(()=>window.failAwardOutbox=true);});
  await expect(p.locator('#starCount')).toHaveText('1');await closeCard(p);const proof=(await snapshot(p)).activity.unitAwardClaims;
  await courseResponse(p,base+'api/progress',{hold:true});await p.reload();await expect(p.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:45000});await expect(p.locator('#starCount')).toHaveText('1');expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(0);
  await expect.poll(async()=> (await(await p.request.get('/__test__/course-held')).json()).length).toBeGreaterThan(0);
  await courseResponse(p,base+'api/progress',null,{resumeHeld:true});await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');expect((await snapshot(p)).activity.unitAwardClaims).toEqual(proof);expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(0);
 }finally{await courseResponse(p,base+'api/progress').catch(()=>{});await session.context.close();}
});
test('temporary server failure retries in the background without another user action or flight',async({page,browser})=>{
 test.setTimeout(150000);const session=await open(page,browser,'后台自动重试'),p=session.page;
 try{
  await complete(p,async()=>{await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await courseResponse(p,base+'api/progress',{status:503,json:{error:'temporary'}});});
  await expect(p.locator('#starCount')).toHaveText('1');await closeCard(p);await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','retry');
  await courseResponse(p,base+'api/progress');await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced',{timeout:12000});expect(await p.evaluate(()=>window.localAwardFlights.length)).toBe(1);await expect(p.locator('.award-reveal[open]')).toHaveCount(0);
 }finally{await courseResponse(p,base+'api/progress').catch(()=>{});await session.context.close();}
});
for(const device of devices)test(device.id+' returning home does not wait for the pending award upload',async({page,browser})=>{
 test.setTimeout(150000);const session=await open(page,browser,'后台同步返回首页-'+device.id,device),p=session.page;
 try{
  await p.addInitScript(path=>{
   if(location.pathname!==path)return;
   const load=document.fonts.load.bind(document.fonts);
   document.fonts.load=async(...args)=>{if(args[0]!=='600 20px "Baloo 2"')return load(...args);
    await new Promise(resolve=>window.releaseDirectoryFont=resolve);
    const result=await load(...args);window.directoryFontFinished=true;return result;
   };
  },base);
  await complete(p,async()=>{await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');await courseResponse(p,base+'api/progress',{hold:true});});await closeCard(p);
  await p.goto(base);await expect(p.locator('.journey-home')).toBeVisible({timeout:2500});await expect(p.locator('[data-home-status]')).toContainText('保存在本机');
  await courseResponse(p,base+'api/progress',null,{resumeHeld:true});await expect(p.locator('[data-map-course=unit1-2]')).toHaveAttribute('aria-label',/1 \/ 5/);await expect(p.locator('[data-home-status]')).toHaveText('');
  await p.waitForFunction(()=>typeof window.releaseDirectoryFont==='function');await p.evaluate(()=>window.releaseDirectoryFont());
  await p.waitForFunction(()=>window.directoryFontFinished===true);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await expect(p.locator('[data-home-status]')).toHaveText('');
 }finally{await courseResponse(p,base+'api/progress').catch(()=>{});await session.context.close();}
});
