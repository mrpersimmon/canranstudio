'use strict';
const {test,expect}=require('@playwright/test'),{devices}=require('../support/required-phone-devices');
for(const[unit,id,selector,asset]of [
 ['unit43-44','u4344-v1-a-find','.tea-visual','/assets/learning-whole-book-v1/world-kitchen-v1.webp'],
 ['unit45-46','u4546-v1-a-person-v153','.office-visual','/assets/learning-sample-v2/office-world-v1.webp']
])test(unit+' question scene and detail sheet retain the reviewed backdrop',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+id,state:'before',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:60000});const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const device of devices){await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  const preview=frame.locator('.learning-surface .learning-context-preview');let scope=frame.locator('.learning-surface');
  if(await preview.isVisible()){await preview.click();scope=frame.locator('#learning-reference-sheet');await expect(scope).toBeVisible();}
  await expect(scope.locator(selector)).toBeVisible();expect(await scope.locator(selector).evaluate(e=>getComputedStyle(e).backgroundImage)).toContain(asset);
  expect(await scope.evaluate(e=>e.scrollWidth-e.clientWidth)).toBeLessThanOrEqual(1);
  await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'.png')});
  if(await frame.locator('#learning-reference-sheet').isVisible())await frame.getByRole('button',{name:'关闭学习参考',exact:true}).click();
 }
});
