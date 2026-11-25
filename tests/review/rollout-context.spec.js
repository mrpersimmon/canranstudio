'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
for(const device of devices)test(device.name+' 从验收台直接打开选图对照与单幅路线材料',async({page})=>{
 const examples=[
  {unit:'unit27-28',id:'u2728-v1-exam-picture',images:['forks-shelf','forks-table','forks-far-spoons'],labels:['甲图','乙图','丙图']},
  {unit:'unit35-36',id:'u3536-v1-along-across',images:['routes-compare']}
 ];
 for(const example of examples){
  await page.goto('/?'+new URLSearchParams({unit:example.unit,page:'q:'+example.id,state:'full',device:device.id}));
  const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),sheet=frame.getByRole('dialog',{name:'题目材料',exact:true});
  await expect(sheet).toBeVisible({timeout:45000});
  const sources=await sheet.locator('img').evaluateAll(images=>images.map(image=>new URL(image.src).pathname).sort());
  expect(sources).toEqual(example.images.map(name=>'/lesson/assets/'+example.unit+'/'+name+'.svg').sort());
  if(example.labels){
   const labels=await sheet.locator('figcaption').allTextContents();
   expect(labels.sort()).toEqual([...example.labels].sort());
  }
  await sheet.getByRole('button',{name:'关闭学习参考'}).click();
  await expect(frame.getByRole('button',{name:'查看题目材料',exact:true})).toBeFocused();
  await expect(frame.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(page.locator('#error')).toBeHidden();
 }
});
for(const [unit,id,material]of [
 ['unit41-42','u4142-v1-a-bread'],
 ['unit59-60','u5960-v1-a-they','Do Ann and Ben have any glue?'],
 ['unit143-144','u143144-v1-a-reply','The stated plan is to post them at 14:00.']
])test(unit+' compact scene opens complete original context without changing an answer',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+id,state:'correct',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 const record=()=>frame.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)).groups));
 const before=await record();
 for(const device of [...devices,{id:'small-phone',viewport:{width:320,height:568}}]){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
  const surface=frame.locator('.learning-surface');
  const preview=material?surface.getByRole('button',{name:'查看题目材料',exact:true}):surface.locator('.learning-context-preview');
  const source=surface.locator(material?'.learning-material-source':'.learning-context-source');
  const scene=source.locator(':scope>[class$="-application"]');
  if(material||device.viewport.height<=700){
   await expect(preview).toBeVisible();await expect(scene).toBeHidden();const expected=await scene.textContent();
   await preview.click();const dialog=frame.locator('#learning-reference-sheet');await expect(dialog).toBeVisible();
   const displayed=dialog.locator('.learning-reference-content [class$="-application"]');await expect(displayed).toBeVisible();await expect(displayed).toHaveText(expected);
   if(material)await expect(dialog.locator('.learning-reference-content')).toContainText(material);
   await expect(dialog.getByRole('button',{name:'关闭学习参考'})).toBeInViewport();expect(await record()).toBe(before);
   await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'-context.png')});
   await dialog.getByRole('button',{name:'关闭学习参考'}).click();await expect(preview).toBeFocused();
  }else{await expect(preview).toBeHidden();await expect(scene).toBeVisible();}
  expect(await record()).toBe(before);
  await expect(frame.locator('.practice-submit-row:visible')).toBeInViewport();
 }
});
