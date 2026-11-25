'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
test('the keepsake page has no duplicate star-progress section',async({page})=>{
  await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'card',state:'card',device:devices[0].id,stars:'3'}));
  await expect(page.locator('#loading')).toBeHidden({timeout:30000});
  const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
  await expect(frame.locator('.story-award-tasks')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'星星进度',exact:true})).toHaveCount(0);
});
test('a corrected completion without a star never shows a green milestone check',async({page})=>{
  await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'result:exam',state:'corrected',device:devices[0].id}));
  await expect(page.locator('#loading')).toBeHidden({timeout:30000});
  const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
  await expect(frame.locator('#starCount')).toHaveText('0');
  await expect(frame.locator('.learning-course')).toContainText('已学 1/5');
  await expect(frame.locator('.learning-milestones .is-complete')).toHaveCount(0);
});
for(const device of devices){
  test('milestones reflect earned stars across Lessons 1–6 on '+device.name,async({page},info)=>{
    for(const unit of ['unit1-2','unit3-4','unit5-6']){
      await page.goto('/?'+new URLSearchParams({unit,page:'card',state:'card',device:device.id,stars:'0'}));
      await expect(page.locator('#loading')).toBeHidden({timeout:30000});
      const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
      for(const stars of [0,3,5,0]){
        await page.locator('#stars').selectOption(String(stars));
        await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
        await expect(frame.locator('.learning-milestones .is-complete')).toHaveCount(stars);
        await expect(frame.locator('.learning-milestones .is-complete .milestone-point')).toHaveText(Array(stars).fill('✓'));
        await expect(frame.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars',String(stars));
        // Restored awards do not fabricate completion of the current manuscript.
        await expect(frame.locator('.learning-course')).toContainText('已学 0/5');
        await expect(frame.locator('.story-award-tasks')).toHaveCount(0);
        const boxes=await frame.locator('.learning-milestones a').evaluateAll(links=>links.map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,height:r.height,width:innerWidth};}));
        for(const b of boxes){expect(b.left).toBeGreaterThanOrEqual(0);expect(b.right).toBeLessThanOrEqual(b.width);expect(b.height).toBeGreaterThanOrEqual(44);}
        if(stars===5)await page.screenshot({path:info.outputPath(unit+'-five-stars-'+device.id+'.png')});
      }
    }
  });
  test('only the keepsake page provides home and next controls on '+device.name,async({page},info)=>{
    for(const entry of ['result:exam','card']){
      await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:entry,state:entry==='card'?'card':'perfect',device:device.id}));
      await expect(page.locator('#loading')).toBeHidden({timeout:30000});
      const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
      const navigation=frame.getByRole('navigation',{name:'课程结束后导航'}).filter({visible:true});
      if(entry==='result:exam'){
        await expect(navigation).toHaveCount(0);
        await frame.getByRole('button',{name:'查看纪念卡',exact:true}).click();
        await expect(page.locator('#current-title')).toHaveText('我的纪念卡');
      }
      await expect(frame.locator('.story-award-tasks')).toHaveCount(0);
      await expect(navigation.getByRole('link',{name:'返回首页',exact:true})).toBeVisible();
      const next=navigation.getByRole('link',{name:'下一课：Lesson 3–4',exact:true});
      await expect(next).toHaveAttribute('href',/\/lesson\/unit3-4\/$/);
      const rect=await navigation.evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:innerWidth,h:innerHeight};});
      expect(rect.x).toBeGreaterThanOrEqual(-1);expect(rect.right).toBeLessThanOrEqual(rect.w+1);
      expect(rect.y).toBeGreaterThanOrEqual(0);expect(rect.bottom).toBeLessThanOrEqual(rect.h+1);
      await page.screenshot({path:info.outputPath(entry.replace(':','-')+'-'+device.id+'.png')});
      await next.click();
      await expect(page.locator('#current-course')).toContainText('Lesson 3–4');
      await expect(page.locator('#current-title')).toHaveText('课程封面');
    }
  });
}
test('course ending remains reachable on small phones, tablets and desktop layouts',async({page})=>{
  for(const unit of ['unit3-4','unit5-6']){
    await page.goto('/?'+new URLSearchParams({unit,page:'result:exam',state:'corrected',device:'small-phone'}));
    await expect(page.locator('#loading')).toBeHidden({timeout:30000});
    const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
    await expect(frame.locator('.learning-surface .course-ending-navigation')).toHaveCount(0);
    await frame.getByRole('button',{name:'查看纪念卡',exact:true}).click();
    await expect(page.locator('#current-title')).toHaveText('我的纪念卡');
    for(const device of ['small-phone','tablet','desktop']){
      await page.locator('#device').selectOption(device);
      const nav=frame.locator('.learning-surface .course-ending-navigation');
      await expect(nav.getByRole('link',{name:'返回首页',exact:true})).toBeVisible();
      const box=await nav.evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,right:r.right,w:innerWidth,h:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};});
      expect(box.top).toBeGreaterThanOrEqual(0);expect(box.bottom).toBeLessThanOrEqual(box.h+1);expect(box.right).toBeLessThanOrEqual(box.w+1);expect(box.overflow).toBe(false);
    }
    await frame.getByRole('link',{name:'返回首页',exact:true}).click();
    await expect(page.locator('#notice')).toContainText('正式课程会返回学习旅程首页');
    await expect(page.locator('#unit')).toBeFocused();
  }
});
