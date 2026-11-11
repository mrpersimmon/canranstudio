'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const fs=require('node:fs/promises');
async function open(page,unit,device){
  await page.goto('/?'+new URLSearchParams({unit,page:'cover',state:'view',device}));
  await expect(page.locator('#loading')).toBeHidden({timeout:30000});
  await expect(page.locator('#error')).toBeHidden();
  return page.frameLocator('#frame-shell iframe:not(.pending)');
}
async function geometry(frame){
  return frame.locator('#cover').evaluate(cover=>{
    const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
    const style=el=>{const s=getComputedStyle(el);return {padding:s.padding,margin:s.margin,flex:s.flex,justify:s.justifyContent,overflow:s.overflow};};
    const art=cover.querySelector('.current-cover'),copy=cover.querySelector('.cover-copy'),button=cover.querySelector('#startBtn');
    return {cover:rect(cover),art:rect(art),source:rect(copy.querySelector('.unit-source')),copy:rect(copy),button:rect(button),styles:{cover:style(cover),art:style(art),copy:style(copy)},overflow:cover.scrollHeight-cover.clientHeight,horizontal:cover.scrollWidth-cover.clientWidth,viewport:{width:innerWidth,height:innerHeight}};
  });
}
for(const device of devices){
  test('course covers reserve comfortable button space on '+device.name,async({page},info)=>{
    for(const unit of ['unit3-4','unit1-2','unit5-6']){
      const frame=await open(page,unit,device.id),g=await geometry(frame);
      if(unit==='unit3-4')expect(await frame.locator('.current-cover').evaluate(el=>getComputedStyle(el).backgroundImage)).not.toBe('none');
      await info.attach(unit+'-cover-layout',{body:JSON.stringify(g,null,2),contentType:'application/json'});
      await page.screenshot({path:info.outputPath(unit+'-'+device.id+'.png')});
      // Keep a view of the course itself for visual review, not only outer-frame geometry.
      await page.locator('#frame-shell iframe:not(.pending)').screenshot({path:info.outputPath(unit+'-'+device.id+'-phone.png')});
      await fs.writeFile(info.outputPath(unit+'-'+device.id+'-geometry.json'),JSON.stringify(g,null,2));
      expect(g.cover.bottom-g.button.bottom).toBeGreaterThanOrEqual(16);
      expect(g.button.height).toBeGreaterThanOrEqual(48);
      expect(g.button.x-g.cover.x).toBeGreaterThanOrEqual(16);
      expect(g.cover.right-g.button.right).toBeGreaterThanOrEqual(16);
      expect(g.overflow).toBeLessThanOrEqual(1);
      expect(g.horizontal).toBeLessThanOrEqual(1);
      expect(g.source.y-g.art.bottom).toBeGreaterThanOrEqual(12);
      expect(g.source.y-g.art.bottom).toBeLessThanOrEqual(32);
      await frame.locator('#startBtn').click();
      await expect(frame.locator('#cover')).not.toHaveClass(/learning-surface/);
      await expect(frame.locator('.learning-surface')).toBeVisible();
    }
  });
}
test('course covers also fit small phones, tablets and desktop without changing the artwork',async({page})=>{
  for(const unit of ['unit1-2','unit3-4','unit5-6']){
    const frame=await open(page,unit,'small-phone');
    for(const [device,width]of [['small-phone',320],['tablet',768],['desktop',1366],[devices[0].id,375]]){
      await page.locator('#device').selectOption(device);
      await expect.poll(()=>frame.locator('body').evaluate(()=>innerWidth)).toBe(width);
      const g=await geometry(frame);
      expect(g.cover.bottom-g.button.bottom).toBeGreaterThanOrEqual(16);
      expect(g.overflow).toBeLessThanOrEqual(1);expect(g.horizontal).toBeLessThanOrEqual(1);
      expect(g.source.y-g.art.bottom).toBeLessThanOrEqual(32);
      await expect(frame.locator('.current-cover>img')).toBeVisible();
    }
  }
});
test('a very short cover scrolls from the complete illustration to the complete action',async({page},info)=>{
  await page.setViewportSize({width:667,height:375});
  // Use the same review course document directly so this is a real short CSS
  // viewport, not a scaled-down tall iframe in the bench.
  await page.goto('/lesson/unit3-4/?page=cover&state=view&unit=unit3-4&request=short-cover');
  const cover=page.locator('#cover.learning-surface');await expect(cover).toBeVisible({timeout:30000});
  await expect(page.locator('body')).toHaveAttribute('data-learning-view','cover');
  expect(await cover.evaluate(el=>el.scrollTop)).toBe(0);
  const top=await page.locator('.current-cover').boundingBox(),box=await cover.boundingBox();
  expect(top.y-box.y).toBeGreaterThanOrEqual(16);
  await page.locator('#startBtn').scrollIntoViewIfNeeded();
  await expect(page.locator('#startBtn')).toBeInViewport({ratio:1});
  expect(await cover.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath('short-cover-action.png')});
  await page.locator('#startBtn').click();await expect(cover).not.toBeVisible();
});
