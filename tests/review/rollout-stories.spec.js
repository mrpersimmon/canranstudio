'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {UNITS}=require('../../server/catalog'),{devices}=require('../support/required-phone-devices');
test.describe.configure({mode:'parallel'});
for(const unit of process.env.ROLLOUT_UNITS?.split(',')||UNITS)test(unit+' story poses, preserved text and one-step continuation',async({page},info)=>{
 test.setTimeout(180000);const issues=[];
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
   if(fault.length)issues.push({line:i+1,device:device.id,fault});
  }
 }
 await frame.locator('.learning-surface .stage-ctrl>.btn-green').click();
 await expect(frame.locator('.stage-roles')).toHaveClass(/learning-surface/);
 await fs.writeFile(info.outputPath('story-findings.json'),JSON.stringify({unit,lines:lines.length,poses:lines.length*devices.length,issues},null,2));
 expect(issues).toEqual([]);
});
