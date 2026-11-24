'use strict';
const {test,expect}=require('@playwright/test');
const {inspectWholeBookScene}=require('../support/whole-book-scene-audit');
const units=['unit1-2','unit5-6','unit25-26','unit31-32','unit37-38','unit55-56','unit65-66','unit125-126','unit135-136','unit143-144'].filter(id=>!process.env.STORY_UNITS||process.env.STORY_UNITS.split(',').includes(id));
for(const unit of units)test(unit+' theatre retains its people and controls at pressure and wide sizes',async({page},info)=>{
 const catalog=await(await page.request.get('/review/catalog.json')).json(),extra=catalog.devices.filter(d=>['small-phone','tablet','desktop'].includes(d.id));
 await page.goto('/?'+new URLSearchParams({unit,page:unit==='unit5-6'?'story-0':'story-complete',device:extra[0].id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const device of extra){
  await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.width+'x'+device.height);
  await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const issues=await frame.locator('.learning-surface').evaluate(surface=>{const r=surface.getBoundingClientRect(),button=[...surface.querySelectorAll('.stage-ctrl>.btn-green,.practice-finish-actions [data-station-next]')].find(e=>e.getClientRects().length&&!e.closest('[hidden]')),b=button?.getBoundingClientRect();return {overflow:surface.scrollWidth-surface.clientWidth,visibleButton:Boolean(b&&b.width>0&&b.height>=42&&b.top>=0&&b.bottom<=innerHeight-4),stageVisible:r.width>0};});
  expect(issues.overflow).toBeLessThanOrEqual(1);expect(issues.visibleButton).toBe(true);expect(issues.stageVisible).toBe(true);
  expect(await frame.locator('.learning-surface').evaluate(inspectWholeBookScene)).toEqual([]);
  await page.locator('#frame-shell').screenshot({path:info.outputPath(device.id+'.png')});
 }
});
