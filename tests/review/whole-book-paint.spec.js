'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {devices}=require('../support/required-phone-devices');
const units=process.env.ROLLOUT_UNITS?.split(',')||Array.from({length:60},(_,i)=>'unit'+(25+i*2)+'-'+(26+i*2));
test.describe.configure({mode:'parallel'});
for(const unit of units)test(unit+' visible word transitions never flash a loader or undecoded image',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit,page:'words-0',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const device of devices){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  await frame.evaluate(()=>{window.paintAudit={running:true,frames:0,faults:[]};const sample=()=>{const state=window.paintAudit;if(!state.running)return;state.frames++;const root=document.querySelector('.learning-surface'),bad=[...root.querySelectorAll('img')].filter(im=>im.getClientRects().length&&!im.closest('[hidden]')&&getComputedStyle(im).display!=='none'&&(!im.complete||!im.naturalWidth)).map(im=>im.getAttribute('src'));if(document.documentElement.hasAttribute('data-course-painting')||getComputedStyle(root).visibility!=='visible'||bad.length)state.faults.push({images:bad,guard:document.documentElement.hasAttribute('data-course-painting')});requestAnimationFrame(sample);};requestAnimationFrame(sample);});
  const total=+(await frame.locator('#wordPageProgress').textContent()).split('/')[1];
  for(let n=1;n<total;n++)await frame.locator('.word-controls button').last().click();
  for(let n=1;n<total;n++)await frame.locator('.word-controls button').first().click();
  const result=await frame.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{window.paintAudit.running=false;resolve(window.paintAudit);})))) ;
  await fs.writeFile(info.outputPath(device.id+'-frames.json'),JSON.stringify(result));expect(result.frames).toBeGreaterThan(0);expect(result.faults).toEqual([]);
 }
});
