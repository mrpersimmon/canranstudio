'use strict';
const {test,expect}=require('@playwright/test'),{devices}=require('../support/required-phone-devices');
test.describe.configure({mode:'parallel'});
for(const[unit,id]of require('../support/whole-book-short-tasks.json'))test(id+' fits without shrinking text or moving feedback',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit,page:id,state:'before',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:60000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const device of devices){await page.locator('#device').selectOption(device.id);let actionTop;
  for(const state of ['before','correct']){await page.locator('#state-buttons [data-state="'+state+'"]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(page.locator('#error')).toBeHidden();
   const content=frame.locator('.learning-surface .practice-content');expect(await content.evaluate(e=>e.scrollHeight-e.clientHeight),device.id+' '+state).toBeLessThanOrEqual(1);
   const y=await frame.locator('.learning-surface .practice-submit-row').evaluate(e=>e.getBoundingClientRect().top);if(actionTop!==undefined)expect(y).toBe(actionTop);actionTop=y;
  }
  const material=frame.locator('.learning-surface [data-reviewed-material]');if(await material.count()){
   const textBefore=await frame.locator('.learning-surface .learning-question-heading').innerText();
   const saved=await frame.evaluate(()=>localStorage.getItem(CanranCore.learningContext.progress.learningKey));await material.click();await expect(frame.locator('#learning-reference-sheet')).toBeVisible();
   const image=frame.locator('#learning-reference-sheet .learning-material-image');await expect(image).toBeVisible();expect(await image.evaluate(e=>e.getBoundingClientRect().width)).toBeGreaterThanOrEqual(250);
   expect(await image.evaluate(e=>Math.abs(e.getBoundingClientRect().width/e.getBoundingClientRect().height-e.naturalWidth/e.naturalHeight))).toBeLessThan(.03);
   await frame.getByRole('button',{name:'关闭学习参考',exact:true}).click();expect(await frame.evaluate(()=>localStorage.getItem(CanranCore.learningContext.progress.learningKey))).toBe(saved);expect(await frame.locator('.learning-surface .learning-question-heading').innerText()).toBe(textBefore);
   if(device.id==='chrome-iphone-se'){await page.locator('#state-buttons [data-state=full]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(image).toBeVisible();await frame.getByRole('button',{name:'关闭学习参考',exact:true}).click();}
  }
  await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'.png')});
 }
});
