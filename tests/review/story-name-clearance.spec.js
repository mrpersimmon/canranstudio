'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {devices}=require('../support/required-phone-devices'),{inspectStoryNameClearance}=require('../support/story-name-clearance');
const units=(process.env.NAME_CLEARANCE_UNITS||'unit7-8,unit9-10,unit11-12,unit13-14,unit15-16,unit17-18,unit19-20,unit21-22,unit23-24').split(',');
test.describe.configure({mode:'parallel'});
for(const unit of units)test(unit+' names never overlap people through the whole story',async({page},info)=>{
 test.setTimeout(180000);const findings=[];
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.id===unit),lines=course.entries.filter(e=>e.kind==='story-line');
 await page.goto('/?'+new URLSearchParams({unit,page:'story-start',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const [i,line]of lines.entries()){
  await frame.locator('.learning-surface .stage-ctrl>.btn-green').click();await expect(frame.locator('.dialogue-log .bubble-row').last().locator('.btext')).toHaveText(line.subtitle);
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
   await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const measurement=await frame.locator('.learning-surface').evaluate(inspectStoryNameClearance);expect(measurement.names.length).toBeGreaterThan(0);
   if(measurement.issues.length)findings.push({line:i+1,device:device.id,...measurement});
   if((unit==='unit13-14'&&[0,5,10,11,12].includes(i))||i===lines.length-1)await page.locator('#frame-shell').screenshot({path:info.outputPath('line-'+(i+1)+'-'+device.id+'.png')});
  }
 }
 await fs.writeFile(info.outputPath('name-findings.json'),JSON.stringify({unit,lines:lines.length,poses:lines.length*devices.length,findings},null,2));
 expect(findings).toEqual([]);
});

test('composite name rows also fit pressure, tablet and desktop sizes',async({page})=>{
 const catalog=await(await page.request.get('/review/catalog.json')).json(),extra=catalog.devices.filter(d=>['small-phone','tablet','desktop'].includes(d.id));
 for(const unit of ['unit7-8','unit9-10','unit11-12','unit13-14']){
  await page.goto('/?'+new URLSearchParams({unit,page:'story-complete',device:extra[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
  const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
  for(const device of extra){
   await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.width+'x'+device.height);
   expect((await frame.locator('.learning-surface').evaluate(inspectStoryNameClearance)).issues,unit+' '+device.id).toEqual([]);
   await expect(frame.locator('.learning-story-art')).toHaveAttribute('data-scene-fit','ready');
  }
 }
});
