'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const representatives=['unit7-8','unit13-14','unit21-22','unit27-28','unit49-50','unit71-72','unit87-88','unit143-144'];
for(const unit of representatives)test(unit+' shared shell opens every major page type',async({page},info)=>{
  test.setTimeout(120000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/?'+new URLSearchParams({unit,page:'cover',state:'view',device:devices[0].id}));
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});
  await expect(page.locator('#error')).toBeHidden();
  const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.id===unit);
  expect(course).toBeTruthy();
  for(const id of ['cover','words-0','story-start','story-0','story-complete',course.entries.find(e=>e.kind==='question').id,'result:exam','card']){
    const entry=course.entries.find(e=>e.id===id);expect(entry).toBeTruthy();
    await page.goto('/?'+new URLSearchParams({unit,page:id,state:entry.states[0],device:devices[0].id,stars:'5'}));
    await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
    const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
    await expect(frame.locator('body')).toHaveAttribute('data-learning-shell','');
    await expect(frame.locator('.learning-milestones a')).toHaveCount(5);
    await expect(frame.locator('.learning-surface')).toBeVisible();
    const box=await frame.locator('.learning-surface').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,w:innerWidth,h:innerHeight};});
    expect(box.left).toBeGreaterThanOrEqual(-1);expect(box.right).toBeLessThanOrEqual(box.w+1);expect(box.top).toBeGreaterThanOrEqual(91);expect(box.bottom).toBeLessThanOrEqual(box.h+1);
    if(id==='story-start'||id==='story-0')await expect(frame.locator('.dialogue-status')).not.toContainText('故事看完了');
    if(id==='story-complete'){
      await expect(frame.locator('.dialogue-status')).toContainText('故事看完了');
      const clipped=await frame.locator('.learning-story-art').evaluate(world=>{
        const box=world.getBoundingClientRect();
        return [...world.querySelectorAll('img')].filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden').map(el=>({src:el.getAttribute('src'),box:el.getBoundingClientRect().toJSON()})).filter(({box:r})=>r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1);
      });
      expect(clipped,unit+' original characters remain inside their world').toEqual([]);
    }
    await page.screenshot({path:info.outputPath(id.replaceAll(':','-')+'.png')});
  }
  expect(errors).toEqual([]);
});
