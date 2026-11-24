'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {inspectWholeBookScene}=require('../support/whole-book-scene-audit');
for(const unit of ['unit29-30','unit143-144']) for(const device of devices){
 test(unit+' stays still while reading on '+device.name,async({page})=>{
  await page.goto('/?'+new URLSearchParams({unit,page:'story-start',device:device.id}));
  const s=page.frameLocator('#frame-shell iframe:not(.pending)').locator('.learning-surface');
  const next=s.locator('.stage-ctrl>.btn-green');await next.click();
  const row=s.locator('.bubble-row').first();await expect(row).toBeVisible();
  const unchanged=await s.evaluate(async el=>{
   await document.fonts.ready;
   const world=el.querySelector('.learning-story-art');
   const frames=n=>new Promise(resolve=>{function tick(){if(--n)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});
   await frames(16);
   let writes=0,layouts=0;
   const observer=new MutationObserver(rs=>{for(const r of rs)if(r.oldValue===r.target.getAttribute('hidden'))writes++;});
   observer.observe(world,{attributes:true,attributeOldValue:true,attributeFilter:['hidden'],subtree:true});
   const query=world.querySelectorAll;
   world.querySelectorAll=function(sel){if(sel==='*')layouts++;return query.call(this,sel);};
   try{await frames(30);return {writes,layouts};}finally{observer.disconnect();delete world.querySelectorAll;}
  });
  expect(unchanged).toEqual({writes:0,layouts:0});
  await row.getByRole('button',{name:'看中文'}).click();await expect(row.locator('.bcn')).toBeVisible();
  await row.getByRole('button',{name:'收起中文'}).click();await next.click();
  await expect(s.locator('.bubble-row')).toHaveCount(2);
  expect(await s.evaluate(inspectWholeBookScene)).toEqual([]);
  expect(await next.evaluate(b=>{const r=b.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1;})).toBe(true);
 });
}
