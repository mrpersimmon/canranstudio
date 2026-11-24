'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {devices}=require('../support/required-phone-devices'),{definition}=require('../../server/progress');
test.describe.configure({mode:'parallel'});
for(const unit of ['unit1-2','unit5-6','unit37-38','unit67-68','unit125-126','unit143-144'])test(unit+' question transitions keep decoded art and stable actions',async({page},info)=>{
 test.setTimeout(120000);const list=definition(process.cwd(),unit,'/').questions.exam;
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+list[0].id,state:'review',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const device of devices){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  await frame.evaluate(()=>{window.questionPaint={running:true,frames:0,faults:[],actions:[]};const sample=()=>{const s=window.questionPaint;if(!s.running)return;s.frames++;const paper=document.querySelector('.learning-surface .practice-content'),root=document.querySelector('.learning-surface'),row=root.querySelector('.practice-submit-row');if(!paper||!row){s.faults.push('missing question');return;}
   const shown=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).visibility==='visible';const missing=[...root.querySelectorAll('img')].filter(shown).filter(im=>!im.complete||!im.naturalWidth).map(im=>im.getAttribute('src'));
   if(missing.length||getComputedStyle(paper).opacity!=='1'||getComputedStyle(paper).visibility!=='visible'||document.documentElement.hasAttribute('data-course-painting'))s.faults.push({missing,opacity:getComputedStyle(paper).opacity});s.actions.push(row.getBoundingClientRect().top);requestAnimationFrame(sample);};requestAnimationFrame(sample);});
  for(let i=1;i<list.length;i++)await frame.locator('.learning-surface').getByRole('button',{name:'下一题',exact:true}).click();
  for(let i=1;i<list.length;i++)await frame.locator('.learning-surface').getByRole('button',{name:'上一题',exact:true}).click();
  const result=await frame.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{window.questionPaint.running=false;resolve(window.questionPaint);})))) ;
  await fs.writeFile(info.outputPath(device.id+'-frames.json'),JSON.stringify(result));expect(result.frames).toBeGreaterThan(1);expect(result.faults).toEqual([]);expect(Math.max(...result.actions)-Math.min(...result.actions)).toBeLessThanOrEqual(1);
 }
});
