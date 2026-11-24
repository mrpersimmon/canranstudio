'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {inspectWholeBookScene}=require('../support/whole-book-scene-audit');
const {UNITS}=require('../../server/catalog'),{devices}=require('../support/required-phone-devices');
test.describe.configure({mode:'parallel'});
for(const unit of process.env.ROLLOUT_UNITS?.split(',')||UNITS)test(unit+' story poses, preserved text and one-step continuation',async({page},info)=>{
 test.setTimeout(180000);const issues=[],captured=new Set(),captures=[];
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.id===unit),lines=course.entries.filter(e=>e.kind==='story-line');
 await page.goto('/?'+new URLSearchParams({unit,page:'story-start',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const [i,line]of lines.entries()){
  await frame.locator('.learning-surface .stage-ctrl>.btn-green').click();
  await expect(frame.locator('.dialogue-log .bubble-row')).toHaveCount(i+1);
  await expect(frame.locator('.dialogue-log .bubble-row').last().locator('.btext')).toHaveText(line.subtitle);
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
   await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const fault=await frame.locator('.stage-text').evaluate(surface=>{
    const faults=[],world=surface.querySelector('.learning-story-art'),visible=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).visibility!=='hidden';
    const log=surface.querySelector('.dialogue-log'),bubble=log.lastElementChild,lr=log.getBoundingClientRect(),br=bubble.getBoundingClientRect();
    if(lr.height<80||br.bottom>lr.bottom+2||br.bottom<=lr.top)faults.push({type:'dialogue-not-readable',log:lr.toJSON(),bubble:br.toJSON()});
    if(world){const b=world.getBoundingClientRect();for(const image of world.querySelectorAll('img'))if(visible(image)){const r=image.getBoundingClientRect();if(r.width&&r.height&&(r.left<b.left-1||r.right>b.right+1||r.top<b.top-1||r.bottom>b.bottom+1))faults.push({type:'actor-prop-clipped',src:image.getAttribute('src'),box:r.toJSON(),world:b.toJSON()});}}
    for(const image of surface.querySelectorAll('img'))if(visible(image)&&(!image.complete||!image.naturalWidth))faults.push({type:'image-late',src:image.getAttribute('src')});
    const control=surface.querySelector('.stage-ctrl'),b=control.getBoundingClientRect();if(b.bottom>innerHeight-5)faults.push({type:'control-clipped'});
    return faults;
   });
   fault.push(...await frame.locator('.stage-text').evaluate(inspectWholeBookScene));
   if(fault.length)issues.push({line:i+1,device:device.id,fault});
   if(process.env.STORY_CAPTURE==='1'&&device===devices[0]){
    const signature=await frame.locator('.stage-text').evaluate(surface=>{
     const stage=surface.querySelector('.dialogue-stage'),world=surface.querySelector('.learning-story-art');
     const visible=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).display!=='none';
     return JSON.stringify({background:getComputedStyle(stage).backgroundImage,world:world&&Object.fromEntries(Object.entries(world.dataset).filter(([key])=>!['readingLine','speaker','sceneFit','sceneScale'].includes(key))),images:[...stage.querySelectorAll('img')].filter(visible).map(im=>im.getAttribute('src')),names:[...stage.querySelectorAll('.actor-label')].filter(visible).map(e=>e.textContent)});
    });
    if(!captured.has(signature)){captured.add(signature);const file='pose-'+String(i+1).padStart(2,'0')+'.png';await page.locator('#frame-shell').screenshot({path:info.outputPath(file)});captures.push({line:i+1,file,signature:JSON.parse(signature)});}
   }
  }
 }
 if(process.env.STORY_TRANSLATION_CHECK==='1')for(const device of devices){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  const last=frame.locator('.dialogue-log .bubble-row').last(),toggle=last.locator('.bbtns button[aria-expanded]');
  if(await toggle.getAttribute('aria-expanded')==='true')await toggle.click();await toggle.click();
  await expect(last.locator('.bcn')).toBeVisible();await frame.evaluate(()=>document.fonts.ready);
  await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  expect(await last.locator('.bcn').evaluate(e=>e.getBoundingClientRect().bottom<=e.closest('.dialogue-log').getBoundingClientRect().bottom+2),unit+' '+device.id+' translated ending remains visible').toBe(true);
 }
 await frame.locator('.learning-surface .stage-ctrl>.btn-green').click();
 await expect(frame.locator('.stage-roles')).toHaveClass(/learning-surface/);
 await fs.writeFile(info.outputPath('story-findings.json'),JSON.stringify({unit,lines:lines.length,poses:lines.length*devices.length,issues,captures},null,2));
 expect(issues).toEqual([]);
});
