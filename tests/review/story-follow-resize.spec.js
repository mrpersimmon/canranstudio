'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
for(const [unit,count]of [['unit1-2',6],['unit133-134',6],['unit135-136',16],['unit141-142',6]].filter(([id])=>!process.env.STORY_UNITS||process.env.STORY_UNITS.split(',').includes(id)))test(unit+' follows the latest line through resize without stealing historical reading',async({page},info)=>{
 test.setTimeout(180000);await page.goto('/?'+new URLSearchParams({unit,page:'story-start',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame()),log=frame.locator('.dialogue-log');
 for(let line=0;line<count;line++){
  await frame.locator('.learning-surface .stage-ctrl>.btn-green').click();
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
   await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const visible=await log.evaluate(e=>e.lastElementChild.getBoundingClientRect().bottom<=e.getBoundingClientRect().bottom+2);expect(visible,'newest line stays at the bottom after reflow').toBe(true);
   if(device===devices[0]){
    const read=()=>log.evaluate(e=>({width:e.clientWidth,height:e.clientHeight,scroll:e.scrollTop,total:e.scrollHeight,bubble:e.lastElementChild.getBoundingClientRect().toJSON(),last:e.lastElementChild.textContent}));
    const before=await read();await page.locator('#frame-shell').screenshot({path:info.outputPath('line-'+line+'.png')});
    await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const after=await read();if(process.env.STORY_CAPTURE_PROBE==='1')console.log(JSON.stringify({line:line+1,before,after}));
    expect(await log.evaluate(e=>e.lastElementChild.getBoundingClientRect().bottom<=e.getBoundingClientRect().bottom+2),'late text reflow after paint must keep the newest line visible').toBe(true);
   }
  }
 }
 const ledger=()=>frame.evaluate(()=>{const state=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));return{activity:state.activity.unitDialogue,records:state.records,groups:state.groups};});const before=await ledger();
 await log.evaluate(e=>{e.scrollTop=0;});await expect.poll(()=>log.evaluate(e=>e.scrollTop)).toBeLessThan(1);
 for(const device of [...devices].reverse()){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  expect(await log.evaluate(e=>e.scrollTop),'manual reading of the beginning must remain at the beginning').toBeLessThan(1);
 }
 expect(await ledger()).toEqual(before);
});
