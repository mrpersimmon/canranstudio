'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const cases=[['unit37-38','u3738-v1-final-bookcase'],['unit125-126','u125126-v1-a-tomorrow'],['unit127-128','u127128-v1-a-reply']];
test.describe.configure({mode:'parallel'});
for(const [unit,id]of cases)test(id+' uses available space and preserves materials',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+id,state:'before',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame()),q=Object.values(definition(process.cwd(),unit,'/').questions).flat().find(q=>q.id===id);
 for(const device of devices){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  let top;
  for(const state of ['before','selected','wrong','corrected','review']){
   await page.locator('#state-buttons [data-state="'+state+'"]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
   const content=frame.locator('.learning-surface .practice-content');expect(await content.evaluate(e=>e.scrollHeight-e.clientHeight),device.id+' '+state).toBeLessThanOrEqual(2);
   const actions=await frame.locator('.learning-surface .practice-submit-row').boundingBox();if(top!==undefined)expect(actions.y).toBeCloseTo(top,0);top=actions.y;
   if(q.image)expect((await content.locator(':scope>img.practice-scene').boundingBox()).height).toBeGreaterThanOrEqual(128);
  }
  if(q.display?.material){
   const saved=await frame.evaluate(()=>localStorage.getItem(CanranCore.learningContext.progress.learningKey));
   await frame.getByRole('button',{name:'查看题目材料',exact:true}).click();const dialog=frame.locator('#learning-reference-sheet');await expect(dialog).toBeVisible();
   await expect(dialog.locator('.practice-context')).toHaveText(q.display.material,{useInnerText:true});
   expect(await dialog.locator('[class$="-application"]').count()).toBe(1);
   await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'-materials.png')});
   await frame.getByRole('button',{name:'关闭学习参考',exact:true}).click();expect(await frame.evaluate(()=>localStorage.getItem(CanranCore.learningContext.progress.learningKey))).toBe(saved);
   await expect(page.locator('#state-buttons [data-state=full]')).toBeVisible();
  }
  await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'.png')});
 }
});
