'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const units=['unit7-8','unit9-10','unit11-12','unit13-14','unit15-16','unit17-18','unit19-20','unit21-22','unit23-24'];
for(const unit of units)test(unit+' story keeps teaching text without floating place tags',async({page},info)=>{
 test.setTimeout(180000);
 const source=definition(process.cwd(),unit,'/');
 await page.goto('/?'+new URLSearchParams({unit,page:'story-0',state:'english',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),world=frame.locator('.learning-story-art');
 for(const device of devices){
  await page.locator('#device').selectOption(device.id);await expect(frame.locator('body')).toHaveAttribute('data-practice-viewport',device.viewport.width+'x'+device.viewport.height);
  await expect(world.locator('p[class$="-location"]')).toHaveCount(0);
  const actorNames=(await world.locator('.actor-label').allTextContents()).join(' ');expect(actorNames.trim()).not.toBe('');
  if(['unit21-22','unit23-24'].includes(unit)){
   const widths=await world.locator('.actor-label').evaluateAll(labels=>labels.map(label=>{const text=document.createRange();text.selectNodeContents(label);return {name:label.textContent,box:label.getBoundingClientRect().width,text:text.getBoundingClientRect().width};}));
   for(const label of widths)expect(label.box-label.text,label.name+' should not sit in an oversized blank bar').toBeLessThanOrEqual(20);
  }
  const first=frame.locator('.dialogue-log .bubble-row').first();await expect(first.locator('.btext')).toHaveText(source.learning.DIALOGUE[0].text);
  await first.getByRole('button',{name:'看中文',exact:true}).click();await expect(first.locator('.bcn')).toBeVisible();await expect(first.locator('.bcn')).toHaveText(source.learning.DIALOGUE[0].cn);await first.getByRole('button',{name:'收起中文',exact:true}).click();
  await page.locator('#frame-shell').screenshot({path:info.outputPath('opening-'+device.id+'.png')});
 }
 // Reach the exact transition that previously introduced a new room tag.
 if(unit==='unit13-14'){
  for(let i=1;i<=4;i++)await frame.getByRole('button',{name:'下一句',exact:true}).click();
  await expect(world).toHaveAttribute('aria-label',/楼上的房间/);await expect(world.locator('p[class$="-location"]')).toHaveCount(0);
 }
});
