'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {UNITS}=require('../../server/catalog');
const {devices}=require('../support/required-phone-devices');
test.describe.configure({mode:'parallel'});

// Capture actual first, middle and last story states before judging composition.
// No invented screenshots or preset pass statuses: the review ledger names
// inspected evidence and each course's actual scene/actor treatment.
for(const unit of process.env.STORY_UNITS?.split(',')||UNITS)test(unit+' theatre composition inventory',async({page},info)=>{
 test.setTimeout(180000);
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.id===unit),lines=course.entries.filter(e=>e.kind==='story-line');
 const states=[lines[0],lines[Math.floor(lines.length/2)],lines.at(-1)],report=[];
 await page.goto('/?'+new URLSearchParams({unit,page:states[0].id,state:'english',device:devices[0].id}));
 for(const [i,state]of states.entries()){
  if(i)await page.locator('.entry[data-page="'+state.id+'"]').click();
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
  const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
  await expect(frame.locator('.dialogue-log .bubble-row').last().locator('.btext')).toHaveText(state.subtitle);
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);
   await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
   await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   report.push(await frame.locator('.learning-surface .dialogue-stage').evaluate((stage,info)=>{
    const visible=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).visibility!=='hidden',box=e=>e.getBoundingClientRect().toJSON();
    return {...info,stage:box(stage),background:getComputedStyle(stage).backgroundImage,log:box(stage.querySelector('.dialogue-log')),world:[...stage.children].filter(e=>e!==stage.querySelector('.dialogue-log')).map(e=>({class:e.className,box:box(e),dataset:{...e.dataset},background:getComputedStyle(e).backgroundImage})),images:[...stage.querySelectorAll('img')].filter(visible).map(im=>({src:im.getAttribute('src'),class:im.className,box:box(im),natural:[im.naturalWidth,im.naturalHeight]})),names:[...stage.querySelectorAll('.actor-label,.name')].filter(visible).map(e=>({text:e.textContent,box:box(e)}))};
   },{unit,state:state.id,index:state.index,device:device.id}));
   await page.locator('#frame-shell').screenshot({path:info.outputPath((i===0?'first':i===1?'middle':'last')+'-'+device.id+'.png')});
  }
 }
 await fs.writeFile(info.outputPath('composition.json'),JSON.stringify({unit,lines:lines.length,report},null,2));
});
