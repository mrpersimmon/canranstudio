'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
for(const [unit,id]of [['unit41-42','u4142-v1-a-bread'],['unit59-60','u5960-v1-a-they'],['unit143-144','u143144-v1-a-reply']])test(unit+' compact scene opens complete original context without changing an answer',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+id,state:'correct',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 const record=()=>frame.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)).groups));
 const before=await record();
 for(const device of [...devices,{id:'small-phone',viewport:{width:320,height:568}}]){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  const preview=frame.locator('.learning-surface .learning-context-preview'),scene=frame.locator('.learning-surface .learning-context-source>[class$="-application"]');
  if(device.viewport.height<=700){
   await expect(preview).toBeVisible();await expect(scene).toBeHidden();const expected=await scene.textContent();
   await preview.click();const dialog=frame.locator('#learning-reference-sheet');await expect(dialog).toBeVisible();await expect(dialog.locator('.learning-reference-content')).toHaveText(expected);
   await expect(dialog.getByRole('button',{name:'关闭学习参考'})).toBeInViewport();expect(await record()).toBe(before);
   await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'-context.png')});
   await dialog.getByRole('button',{name:'关闭学习参考'}).click();await expect(preview).toBeFocused();
  }else{await expect(preview).toBeHidden();await expect(scene).toBeVisible();}
  expect(await record()).toBe(before);
  await expect(frame.locator('.practice-submit-row:visible')).toBeInViewport();
 }
});
