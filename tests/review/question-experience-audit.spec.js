'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {devices}=require('../support/required-phone-devices');
const {inspectLearningLayout}=require('../support/learning-layout-audit');
const cases=require('../support/question-experience-cases.json').cases.filter(x=>!process.env.QUESTION_UNITS||process.env.QUESTION_UNITS.split(',').includes(x.unit));
test.describe.configure({mode:'parallel'});
async function ready(page){await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(page.locator('#error')).toBeHidden();return page.frames().find(f=>f.parentFrame()===page.mainFrame());}
for(const item of cases)test(item.unit+' '+item.id+' all answer states',async({page},info)=>{
 test.setTimeout(180000);const report=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?'+new URLSearchParams({unit:item.unit,page:'q:'+item.id,state:'before',device:devices[0].id}));let frame=await ready(page);
 const states=await page.locator('#state-buttons [data-state]').evaluateAll(items=>items.map(x=>x.dataset.state));
 for(const state of states){
  await page.locator('#state-buttons [data-state="'+state+'"]').click();frame=await ready(page);
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
   await frame.evaluate(()=>document.fonts.ready);await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const record=await frame.locator('.learning-surface').evaluate((surface,{state,device})=>{
    const active=document.querySelector('dialog[open]')||surface,shown=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).display!=='none';
    const content=surface.querySelector('.practice-content'),actions=surface.querySelector('.practice-submit-row'),options=surface.querySelector('.practice-options'),image=content?.querySelector(':scope>img.practice-scene');
    const box=e=>e?.getBoundingClientRect().toJSON();
    return {state,device,content:box(content),actions:box(actions),options:box(options),image:box(image),scroll:content?Math.max(0,content.scrollHeight-content.clientHeight):0,overflow:document.documentElement.scrollWidth-innerWidth,images:[...active.querySelectorAll('img')].filter(shown).filter(im=>!im.complete||!im.naturalWidth).map(im=>im.getAttribute('src')),dialog:Boolean(document.querySelector('dialog[open]')),viewport:innerHeight};
   },{state,device:device.id});
   record.issues=await frame.locator('.learning-surface').evaluate(inspectLearningLayout);report.push(record);
   if(device===devices[0])await page.locator('#frame-shell').screenshot({path:info.outputPath(state+'.png')});
  }
 }
 await fs.writeFile(info.outputPath('audit.json'),JSON.stringify({...item,states,errors,report},null,2));
 expect(errors).toEqual([]);
 // Record all layout findings before repair; do not silently relabel them passed.
 if(process.env.QUESTION_CAPTURE!=='1')expect(report.filter(r=>r.issues.length||r.overflow>1||r.images.length||r.actions?.bottom>r.viewport-5)).toEqual([]);
});
