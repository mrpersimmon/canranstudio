'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
async function ready(page){await expect(page.locator('#loading')).toBeHidden({timeout:30000});await expect(page.locator('#error')).toBeHidden();}
async function controls(scope){
  const boxes=await scope.locator('button:visible').evaluateAll(items=>items.map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent.trim(),x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height,w:innerWidth,h:innerHeight};}));
  for(const b of boxes){expect(b.x).toBeGreaterThanOrEqual(8);expect(b.right).toBeLessThanOrEqual(b.w-8);expect(b.bottom).toBeLessThanOrEqual(b.h-8);expect(b.y).toBeGreaterThanOrEqual(0);expect(b.height).toBeGreaterThanOrEqual(44);}
}
for(const unit of ['unit1-2','unit3-4','unit5-6']){
  test(unit+' result types and reward overlays remain complete on all required phones',async({page},info)=>{
    test.setTimeout(180000);await page.goto('/');
    const course=(await(await page.request.get('/review/catalog.json')).json()).courses.find(c=>c.id===unit);
    for(const entry of course.entries.filter(e=>e.kind==='result')){
      await page.goto('/?'+new URLSearchParams({unit,page:entry.id,state:'perfect',device:devices[0].id}));await ready(page);
      const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),surface=frame.locator('.learning-surface');
      for(const device of devices){
        await page.locator('#device').selectOption(device.id);
        await expect.poll(()=>surface.evaluate(()=>innerWidth)).toBe(device.viewport.width);
        for(const state of ['perfect','corrected']){
          await page.locator('#state-buttons [data-state="'+state+'"]').click();await ready(page);
          await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
          await controls(surface.locator('.practice-finish-actions'));
          const stats=await surface.locator('.completion-stats').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,bottom:r.bottom,w:innerWidth,h:innerHeight};});
          expect(stats.x).toBeGreaterThanOrEqual(8);expect(stats.right).toBeLessThanOrEqual(stats.w-8);expect(stats.y).toBeGreaterThanOrEqual(92);expect(stats.bottom).toBeLessThanOrEqual(stats.h-60);
          await expect(surface.locator('.course-ending-navigation')).toHaveCount(0);
        }
        if(entry.activity==='exam')await page.screenshot({path:info.outputPath('result-'+device.id+'.png')});
      }
    }
    for(const stars of [1,5]){
      const award=course.entries.find(e=>e.kind==='award');
      await page.goto('/?'+new URLSearchParams({unit,page:award.id,state:'earned',device:devices[0].id,stars:String(stars)}));await ready(page);
      const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),dialog=frame.locator('.award-reveal');
      await expect(dialog).toHaveAttribute('data-dismissible','true',{timeout:15000});
      for(const device of devices){
        await page.locator('#device').selectOption(device.id);
        const box=await dialog.locator('.card-frame').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,ratio:r.width/r.height,w:innerWidth,h:innerHeight};});
        expect(box.x).toBeGreaterThanOrEqual(8);expect(box.right).toBeLessThanOrEqual(box.w-8);expect(box.y).toBeGreaterThanOrEqual(8);expect(box.bottom).toBeLessThanOrEqual(box.h-8);expect(box.ratio).toBeCloseTo(1640/880,2);
        await expect(dialog.getByText('点击任意位置继续',{exact:true})).toBeVisible();
        if(stars===5)await page.screenshot({path:info.outputPath('award-'+device.id+'.png')});
      }
      await dialog.press('Escape');await expect(dialog).not.toBeVisible();
    }
  });
}
