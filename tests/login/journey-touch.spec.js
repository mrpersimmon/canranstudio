'use strict';
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {waitForModulesReady}=require('../support/journey-modules');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
// Honour the WebKit release project as well as an explicit local override.
test.use({...(process.env.JOURNEY_REVIEW_BROWSER?{browserName:process.env.JOURNEY_REVIEW_BROWSER,...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{})}:{}),actionTimeout:10000});

async function visibleTouchPoint(page,selector,id){
  const target=page.locator(selector);
  await target.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const point=await target.evaluate(el=>{
    const box=el.getBoundingClientRect(),x=box.x+box.width/2,y=box.y+box.height/2;
    const hit=document.elementFromPoint(x,y)?.closest('[data-landmark-select],[data-map-course]');
    return{x,y,owner:hit?.dataset.landmarkSelect||hit?.dataset.mapCourse};
  });
  expect(point.owner,'the visible touch point belongs to this course').toBe(id);
  return point;
}

test('原生触摸轻点人物在正常抬手后仍选中，连续轻点和下一次选课不丢失',async({page,browser})=>{
  await adminLogin(page,base);const account=await createStudent(page,'原生轻点','轻点同学',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    await waitForModulesReady(p,['unit1-2','unit3-4','unit5-6']);
    const before=await(await p.request.get(base+'api/me')).json();
    await p.evaluate(()=>{window.__nativeTaps=[];for(const type of ['pointerdown','pointerup','pointerleave','click'])document.addEventListener(type,event=>{if(event.target.matches?.('[data-landmark-select]'))window.__nativeTaps.push({type,pointerType:event.pointerType,trusted:event.isTrusted});},true);});
    for(const size of [{width:390,height:844},{width:320,height:568}]){
      await p.setViewportSize(size);
      for(const id of ['unit3-4','unit3-4','unit5-6','unit1-2']){
        const point=await visibleTouchPoint(p,`[data-story-course="${id}"]`,id);
        await p.touchscreen.tap(point.x,point.y);
        await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
        const hit=p.locator(`[data-landmark-select="${id}"]`);
        await expect(hit).toHaveAttribute('aria-pressed','true');await expect(hit).toHaveAttribute('data-pressed','false');
        await expect.poll(()=>hit.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBeGreaterThan(0);
        expect(await hit.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBeLessThanOrEqual(1);
      }
    }
    const events=await p.evaluate(()=>window.__nativeTaps);
    expect(events.filter(e=>e.type==='pointerdown')).toHaveLength(8);
    expect(events.filter(e=>e.type==='click')).toHaveLength(8);
    expect(events.every(e=>e.trusted)).toBe(true);
    expect(events.filter(e=>e.type==='pointerdown').every(e=>e.pointerType==='touch')).toBe(true);
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});

test('Lesson轻点不叠加系统蓝色高亮，选中状态与键盘焦点仍清晰',async({page,browser,browserName},testInfo)=>{
  await adminLogin(page,base);const account=await createStudent(page,'触摸反馈统一','选课同学',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();await waitForModulesReady(p,['unit1-2','unit3-4','unit5-6']);
    const id='unit3-4',button=p.locator(`[data-map-course="${id}"]`),text=button.locator('.journey-node-lesson-text');
    // Tap the nested text, where a UA may paint its inherited highlight.
    const supportsHighlight=await p.evaluate(()=>CSS.supports('-webkit-tap-highlight-color','transparent'));
    if(browserName==='chromium')expect(supportsHighlight).toBe(true);
    if(supportsHighlight){
      for(const control of [button,text,p.locator(`[data-landmark-select="${id}"]`)])expect(await control.evaluate(el=>getComputedStyle(el).getPropertyValue('-webkit-tap-highlight-color'))).toBe('rgba(0, 0, 0, 0)');
    }else testInfo.annotations.push({type:'compatibility',description:'This WebKit port does not implement tap-highlight-color; native touch selection and keyboard focus are still checked. The supported Chromium engine must verify transparency.'});
    const point=await visibleTouchPoint(p,`[data-map-course="${id}"]`,id);await p.touchscreen.tap(point.x,point.y);
    await expect(button).toHaveAttribute('aria-pressed','true');await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
    await expect(button).toHaveCSS('background-color','rgb(36, 107, 69)');
    expect(await button.evaluate(el=>el.matches(':focus-visible'))).toBe(false);
    await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');
    await expect(button).toBeFocused();expect(await button.evaluate(el=>el.matches(':focus-visible'))).toBe(true);
    await expect(button).toHaveCSS('outline-style','solid');await expect(button).toHaveCSS('outline-width','3px');
    await button.press('Enter');await expect(button).toHaveAttribute('aria-pressed','true');
    await p.emulateMedia({reducedMotion:'reduce'});await button.press('Space');await expect(button).toHaveAttribute('aria-pressed','true');
  }finally{await student.context.close();}
});

test('点击三课人物可选中并回弹，重复点击不叠加动画，键盘和短屏仍可用',async({page,browser})=>{
  const account=await (async()=>{await adminLogin(page,base);return createStudent(page,'地标触感','小探索员',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);})();
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'no-preference'}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    const before=await(await p.request.get(base+'api/me')).json();
    await waitForModulesReady(p,['unit1-2','unit3-4','unit5-6']);
    // Hit a visible point on the picture through the real pointer pipeline.
    // A forced image click can land behind the fixed course dock; the image
    // deliberately delegates pointer events to its owning scene button.
    const picture=p.locator('[data-story-course="unit3-4"]');
    await picture.evaluate(img=>img.scrollIntoView({block:'center',behavior:'instant'}));
    const target=await picture.evaluate(img=>{const box=img.getBoundingClientRect(),x=box.x+box.width/2,y=box.y+box.height/2;return{x,y,owner:document.elementFromPoint(x,y)?.closest('[data-landmark-select]')?.getAttribute('data-landmark-select')};});
    expect(target.owner).toBe('unit3-4');await p.mouse.click(target.x,target.y);
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit3-4');
    for(const id of ['unit5-6','unit1-2','unit3-4']){
      const hit=p.locator(`[data-landmark-select="${id}"]`);
      await hit.click();await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
      const motion=hit.locator('.journey-story-motion');
      await expect.poll(()=>motion.evaluate(el=>el.getAnimations().length)).toBeGreaterThan(0);
      const box=await hit.boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);
      await p.mouse.down();await expect(hit).toHaveAttribute('data-pressed','true');await p.mouse.up();
      await hit.click();expect(await motion.evaluate(el=>el.getAnimations().length)).toBeLessThanOrEqual(1);
      await expect.poll(()=>motion.evaluate(el=>el.getAnimations().length)).toBe(0);
    }
    await p.setViewportSize({width:320,height:568});
    const keyboard=p.locator('[data-landmark-select="unit5-6"]');
    await keyboard.focus();await keyboard.press('Enter');
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit5-6');
    expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(320);
    await p.emulateMedia({reducedMotion:'reduce'});await keyboard.press('Space');
    expect(await keyboard.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBe(0);
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});

test('触摸纵向拖动人物是滚动，不误选课程或触发回弹',async({page,browser,browserName})=>{
  await adminLogin(page,base);const account=await createStudent(page,'地图拖动','滑动同学',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:320,height:568},isMobile:true,hasTouch:true}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    const selected=await p.locator('.journey-dock').getAttribute('data-selected-course');
    const hit=p.locator('[data-landmark-select="unit3-4"]');await expect(hit).toBeVisible();
    // Pointer cancellation is the browser contract when a native touch pan
    // takes over. Also guard against a delayed synthetic click after movement.
    await hit.dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch',isPrimary:true,button:0,clientX:140,clientY:300});
    await hit.dispatchEvent('pointermove',{pointerId:1,pointerType:'touch',isPrimary:true,clientX:140,clientY:220});
    await hit.dispatchEvent('pointercancel',{pointerId:1,pointerType:'touch',isPrimary:true});
    await hit.dispatchEvent('click',{detail:1});
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',selected);
    await expect(hit).toHaveAttribute('data-pressed','false');
    expect(await hit.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBe(0);
    expect(await hit.evaluate(el=>getComputedStyle(el).touchAction)).toContain('pan-y');
    // Check the next tap after the cancellation contract independently of
    // native inertia: tapping a moving page may only stop its scroll.
    const point=await visibleTouchPoint(p,'[data-story-course="unit3-4"]','unit3-4');
    await p.touchscreen.tap(point.x,point.y);
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit3-4');
    await p.locator(`[data-map-course="${selected}"]`).click();
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',selected);
    if(browserName==='chromium'){
      // Also exercise Chromium's native touch pipeline, beyond the cancellation
      // contract above. This is device emulation, not a physical-phone claim.
      const cdp=await student.context.newCDPSession(p),point=await visibleTouchPoint(p,'[data-story-course="unit3-4"]','unit3-4');
      const {x,y}=point,before=await p.evaluate(()=>scrollY);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
      for(let step=1;step<=6;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-step*18,id:1}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await expect.poll(()=>p.evaluate(()=>scrollY)).toBeGreaterThan(before+30);
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',selected);
      expect(await hit.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBe(0);
      await cdp.detach();
    }
  }finally{await student.context.close();}
});
