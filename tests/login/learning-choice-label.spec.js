'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {inspectLearningLayout}=require('../support/learning-layout-audit');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test('长句选项在选中、判分禁用与转屏后保持文字完整',async({page,browser},info)=>{
 test.setTimeout(90000);await adminLogin(page,base);const a=await createStudent(page,'长句按钮验证','小禾',[/Lesson 3–4 /]),s=await studentLogin(browser,a,base,contextOptions(devices[0])),p=s.page,report=[];
 try{
  await p.goto(base+'unit3-4/#learn/manners');await courseReadyForAssertions(p);const room=p.locator('.stage-manners'),choice=room.getByRole('button',{name:'My coat and my umbrella please.',exact:true});
  await p.screenshot({path:info.outputPath('before.png'),scale:'css'});expect(await room.evaluate(inspectLearningLayout)).toEqual([]);await choice.click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
  for(const viewport of [...devices.map(d=>d.viewport),{width:320,height:568}]){
   await p.setViewportSize(viewport);await expect(p.locator('body')).toHaveAttribute('data-practice-viewport',viewport.width+'x'+viewport.height);
   const beforeFrame=await room.evaluate(inspectLearningLayout);
   // Resize-event bookkeeping is not a completed browser layout. Keep the
   // transient observation for diagnosis, then inspect a painted-frame boundary.
   await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const issues=await room.evaluate(inspectLearningLayout),geometry=await choice.evaluate(el=>{const names=['display','height','minHeight','maxHeight','flex','flexShrink','alignItems','gridTemplateRows','fontSize','lineHeight','overflow'];return [el,...(el.firstElementChild?[el.firstElementChild]:[]),el.parentElement,el.parentElement.parentElement].map(x=>({tag:x.tagName,class:x.className,box:x.getBoundingClientRect().toJSON(),style:Object.fromEntries(names.map(n=>[n,getComputedStyle(x)[n]])),html:x===el?el.outerHTML:undefined}));});
   await p.screenshot({path:info.outputPath('after-'+viewport.width+'.png'),scale:'css'});
   report.push({viewport,beforeFrame,issues,geometry,afterScreenshot:await room.evaluate(inspectLearningLayout),heightAfterScreenshot:(await choice.boundingBox()).height});
  }
  await fs.writeFile(info.outputPath('choice-layout.json'),JSON.stringify(report,null,2));
  expect(report.flatMap(x=>x.beforeFrame),'The initial observation must fit without a screenshot forcing reflow').toEqual([]);
  expect(report.flatMap(x=>x.issues)).toEqual([]);
  expect(report.flatMap(x=>x.afterScreenshot)).toEqual([]);
 }finally{await s.context.close();}
});
