'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {UNITS}=require('../../server/catalog');
const {devices}=require('../support/required-phone-devices');
const {inspectLearningLayout}=require('../support/learning-layout-audit');
const selected=process.env.ROLLOUT_UNITS?.split(',')||UNITS;
test.describe.configure({mode:'parallel'});
async function ready(page){
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true',{timeout:12000});
 await expect(page.locator('#error')).toBeHidden();
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 await frame.waitForFunction(()=>!document.documentElement.hasAttribute('data-course-painting'));
 return frame;
}
for(const unit of selected)test(unit+' all questions and phone layouts',async({page},info)=>{
 test.setTimeout(600000);const errors=[],findings=[],counts={questions:0,layouts:0};
 page.on('pageerror',error=>errors.push(error.message));
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.id===unit);
 const questions=course.entries.filter(e=>e.kind==='question'&&(!process.env.ROLLOUT_ACTIVITIES||process.env.ROLLOUT_ACTIVITIES.split(',').includes(e.activity)));
 test.skip(!questions.length,'本单元没有所选活动；不冒记为已执行');
 await page.goto('/?'+new URLSearchParams({unit,page:questions[0].id,state:'correct',device:devices[0].id,preset:'correct'}));
 let frame=await ready(page);
 for(const entry of questions){
  await page.locator('.entry[data-page="'+entry.id+'"]').evaluate(el=>el.click());frame=await ready(page);counts.questions++;
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);
   await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
   await frame.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const issues=await frame.locator('.learning-surface').evaluate(inspectLearningLayout);
   const geometry=await frame.locator('.learning-surface').evaluate(surface=>{
    const content=surface.querySelector('.practice-content'),actions=surface.querySelector('.practice-actions'),row=surface.querySelector('.practice-submit-row');
    const b=row?.getBoundingClientRect();return {view:document.body.dataset.learningView,scroll:content?content.scrollHeight-content.clientHeight:0,bodyOverflow:document.documentElement.scrollWidth-innerWidth,actions:b&&{top:b.top,bottom:b.bottom,right:b.right},height:innerHeight,images:[...surface.querySelectorAll('img')].filter(i=>i.getClientRects().length&&!i.closest('[hidden]')).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)};
   });
   if(geometry.bodyOverflow>1||geometry.actions?.bottom>geometry.height-5||geometry.images.length||geometry.view!=='question')issues.push({type:'surface-geometry',...geometry});
   // Long passages may use the owned content scroller. Record, never hide that
   // boundary by shrinking the font or moving the primary action offscreen.
   if(geometry.scroll>3)issues.push({type:'content-scroll',pixels:geometry.scroll});
   if(issues.length){findings.push({page:entry.id,device:device.id,issues});if(findings.length<=6)await page.locator('#frame-shell').screenshot({path:info.outputPath(entry.id.replace(/[^a-z0-9-]/gi,'_')+'-'+device.id+'.png')});}
   counts.layouts++;
  }
 }
 await fs.writeFile(info.outputPath('findings.json'),JSON.stringify({unit,counts,errors,findings},null,2));
 expect(errors).toEqual([]);
 expect(findings.filter(f=>f.issues.some(i=>i.type!=='content-scroll')),unit+' blocking layout findings').toEqual([]);
});
