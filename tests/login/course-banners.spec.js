'use strict';
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,signIn,fillLogin,openCourseDirectory}=require('./helpers');
const five=require('../support/unit3132-fivezones');
const {viewports}=require('../support/journey-viewports');
const {assertModules,waitForModulesReady}=require('../support/journey-modules');
const routeWorlds=require('../../course-journey/route-worlds');
const base=process.env.AWARD_TEST_BASE||'/lesson/',mount=base.replace(/\/$/,'');
test.use({...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{}),browserName:process.env.JOURNEY_REVIEW_BROWSER||'chromium'});

test('首段入口在零星部分星和满星时保持成果归属，金章不侵入相邻人物 @journey-layout',async({page,browser})=>{
  test.setTimeout(120000);await adminLogin(page,base);
  const account=await createStudent(page,'首段入口排布回归','小雨',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),p=student.page;
  const bounds={'unit1-2':[.1013,.1188,.9147,.92504],'unit3-4':[.1505,.0998,.871,.95633],'unit5-6':[.1107,.1494,.9102,.9258]};
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    const before=await(await p.request.get(base+'api/me')).json();
    // These response fixtures exercise UI geometry only. They never write
    // grades or claim real course completion; real earning is tested elsewhere.
    let stars=0;
    await p.route('**/api/me',async route=>{const response=await route.fetch(),who=await response.json();await route.fulfill({response,json:{...who,courses:who.courses.map(course=>({...course,stars}))}});});
    let moduleReference;
    for(stars of [0,2,5]){
      await p.reload();await waitForModulesReady(p);
      await p.locator('[data-map-course="unit3-4"]').click();
      await expect(p.locator('[data-completion-medal]')).toHaveCount(stars===5?3:0);
      for(const [width,height] of viewports()){
        await p.setViewportSize({width,height});
        const view=await assertModules(p,bounds,width,moduleReference);moduleReference||=view;
      }
    }
    await p.unroute('**/api/me');
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});


test('旅程地图只收录班级课程，搜索与跨设备续学保留真实星数',async({page,browser})=>{
  test.setTimeout(180000);await adminLogin(page,base);
  const account=await createStudent(page,'地图授权验收','小观察员',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 31–32 /]);
  const first=await studentLogin(browser,account,base);let second;
  try{
    await expect(first.page.locator('.journey-course')).toHaveCount(3);
    await expect(first.page.locator('[data-map-course]')).toHaveCount(2);
    await expect(first.page.locator('[data-story-course]')).toHaveCount(2);
    await first.page.getByLabel('查找 Lesson',{exact:true}).fill('Lesson 32');
    await expect(first.page.locator('.journey-course:visible')).toHaveCount(1);
    await expect(first.page.locator('.journey-course:visible h3')).toHaveText('花园观察小队');
    await first.page.locator('.journey-course:visible a').click();
    await expect(first.page).toHaveURL(/unit31-32\/#learn\/words$/);
    await five.activity(first.page,'listen',{base:mount});
    await expect(first.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await first.page.getByRole('link',{name:'我的课程',exact:true}).click();await openCourseDirectory(first.page);
    await expect(first.page.locator('.course[data-unit="unit31-32"]')).toContainText('1 / 5');
    await expect(first.page.locator('.course[data-unit="unit31-32"] a')).toHaveAttribute('href',base+'unit31-32/#learn/text');
    second=await studentLogin(browser,account,base);
    await expect(second.page.locator('.course[data-unit="unit31-32"]')).toContainText('1 / 5');
    await second.page.getByLabel('查找 Lesson',{exact:true}).fill('Lesson 144');
    await expect(second.page.getByText('没有找到这节课',{exact:true})).toBeVisible();
    await second.page.goto(base+'unit143-144/');
    await expect(second.page.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();
  }finally{await first.context.close();await second?.context.close();}
});

test('完整72单元目录支持精确Lesson搜索、筛选与最后一课，回车先聚焦入口',async({page,browser})=>{
  test.setTimeout(150000);await adminLogin(page,base);
  const lessons=Array.from({length:72},(_,i)=>new RegExp(`Lesson ${i*2+1}–${i*2+2} `));
  const account=await createStudent(page,'完整地图目录','找课同学',lessons),student=await studentLogin(browser,account,base);
  try{
    const p=student.page;await expect(p.locator('.journey-course')).toHaveCount(72);
    await expect(p.locator('[data-map-course]')).toHaveCount(3);
    await p.getByLabel('课程范围',{exact:true}).selectOption('0');
    await expect(p.locator('.journey-course:visible')).toHaveCount(9);
    await p.getByLabel('查找 Lesson',{exact:true}).fill('Lesson 50');
    await expect(p.locator('.journey-course:visible')).toHaveCount(1);
    await expect(p.locator('.journey-course:visible h3')).toHaveText('晚餐采购大冒险');
    await p.getByLabel('查找 Lesson',{exact:true}).press('Enter');
    await expect(p.locator('.journey-course:visible [data-course-enter]')).toBeFocused();
    await expect(p).toHaveURL(new RegExp(base+'$'));
    await p.getByLabel('查找 Lesson',{exact:true}).fill('5');
    await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit5-6');
    await p.getByLabel('查找 Lesson',{exact:true}).fill('Lesson 144');
    await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit143-144');
    await p.locator('.journey-course:visible [data-course-enter]').click();
    await expect(p).toHaveURL(/unit143-144\/#learn\/words$/);
    await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
  }finally{await student.context.close();}
});

test('新单元完整通关、姓名和五星同步到另一浏览器，地图不另算成绩',async({page,browser})=>{
  test.setTimeout(180000);await adminLogin(page,base);
  const account=await createStudent(page,'地图真实成果','花园同学',[/Lesson 31–32 /]),first=await studentLogin(browser,account,base);let second;
  try{
    await five.story(first.page,mount);
    for(const id of Object.keys(five.ANSWERS))await five.activity(first.page,id,{base:mount});
    await expect(first.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    second=await studentLogin(browser,account,base);await expect(second.page.locator('.course')).toContainText('5 / 5');
    await second.page.goto(base+'unit31-32/#learn/certificate');
    // A fresh browser first prepares the protected course package. Check its
    // real ready boundary before inspecting the unchanged award assertions.
    await expect(second.page.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
    await expect(second.page.locator('.story-award-panel .story-award-paper')).toHaveAttribute('data-stars','5');
    await expect(second.page.locator('.story-award-panel')).toContainText('花园同学');
    await second.page.goto(base+'lesson49/');await expect(second.page.getByRole('heading',{name:'这节课已下架',exact:true})).toBeVisible();
  }finally{await first.context.close();await second?.context.close();}
});

test('远景失败不阻断本课，共享地形失败保留目录且重试不改变学习成果',async({page,browser})=>{
  await adminLogin(page,base);
  const account=await createStudent(page,'地图图片恢复','小园',[/Lesson 1–2 /,/Lesson 49–50 /]);
  const context=await browser.newContext({serviceWorkers:'block'}),p=await context.newPage();let ambientHits=0,groundHits=0;
  const ambient='**/assets/course-journey/'+routeWorlds.distant.file+'*',ground='**/assets/course-journey/'+routeWorlds.worlds.opening.file+'*';
  const module=()=>p.locator('[data-module-course="unit1-2"]');
  try{
    await p.route(ambient,route=>{ambientHits++;return route.abort();});
    await signIn(p,account,base);
    const before=await(await p.request.get(base+'api/me')).json();
    // Decoration does not supply a contact plane. Its failure cannot hide the
    // correctly loaded person/platform, disable the Lesson, or show a blocker.
    await waitForModulesReady(p,['unit1-2']);expect(ambientHits).toBeGreaterThan(0);
    await expect(module().locator('[data-landmark-select]')).toBeVisible();
    await expect(module().getByRole('status')).toHaveCount(0);
    await p.getByLabel('查找 Lesson',{exact:true}).fill('50');
    await expect(p.locator('.course:visible a')).toHaveAttribute('href',base+'unit49-50/#learn/words');
    await p.unroute(ambient);
    await p.route(ground,route=>{groundHits++;return route.abort();});
    await p.reload();
    await expect(module()).toHaveAttribute('data-art-state','error');expect(groundHits).toBeGreaterThan(0);
    await expect(module().getByRole('status')).toContainText('场景暂时没准备好');
    await expect(module().locator('[data-landmark-select]')).toBeHidden();
    await expect(module().locator('[data-map-course]')).toBeVisible();
    await expect(module().locator('[data-stars-course]')).toBeVisible();
    await p.getByLabel('查找 Lesson',{exact:true}).fill('50');
    await expect(p.locator('.course:visible a')).toHaveAttribute('href',base+'unit49-50/#learn/words');
    await p.unroute(ground);
    if(await p.getByRole('button',{name:'关闭课程目录',exact:true}).isVisible())await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    await p.getByRole('button',{name:'重新加载 Lesson 1–2 场景',exact:true}).click();
    await waitForModulesReady(p,['unit1-2']);
    await expect.poll(()=>p.locator('.journey-world-distant').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await context.close();}
});

test('手机地图自然滚动，节点切换不跳页，目录搜索和我的区域可操作 @journey-layout',async({page,browser})=>{
  test.setTimeout(120000);await adminLogin(page,base);
  const account=await createStudent(page,'地图手机验收','地图同学',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844}}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    await waitForModulesReady(p);
    const original=await(await p.request.get(base+'api/me')).json();
    for(const [width,height] of viewports('mobileInteraction')){
      await p.setViewportSize({width,height});const node=p.locator('[data-map-course="unit3-4"]');await node.scrollIntoViewIfNeeded();
      // WebKit may scroll a covered target again while preparing the click.
      // Measure from the real pointer event, before the app's selection handler.
      await node.evaluate(node=>{window.journeyPointerStart=null;node.addEventListener('pointerdown',()=>{window.journeyPointerStart=scrollY;},{once:true,capture:true});});
      await node.click();const before=await p.evaluate(()=>window.journeyPointerStart);
      expect(Number.isFinite(before)).toBe(true);
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit3-4');
      expect(Math.abs(await p.evaluate(()=>scrollY)-before)).toBeLessThan(2);
      const geometry=await p.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth,dock:document.querySelector('.journey-dock').getBoundingClientRect().toJSON(),nav:document.querySelector('.journey-bottom-nav').getBoundingClientRect().toJSON(),nodes:[...document.querySelectorAll('[data-map-course]')].map(n=>n.getBoundingClientRect().toJSON())}));
      expect(geometry.scroll).toBeLessThanOrEqual(geometry.width);
      expect(geometry.dock.bottom).toBeLessThanOrEqual(geometry.nav.top+1);expect(geometry.nav.bottom).toBeLessThanOrEqual(height+1);
      for(const rect of geometry.nodes){expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.right).toBeLessThanOrEqual(geometry.width+1);expect(rect.height).toBeGreaterThanOrEqual(44);}
      await p.screenshot({path:`output/fronted-opt/journey-mobile-${width}.png`,fullPage:true});
    }
    await p.setViewportSize({width:390,height:844});await p.reload();
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit3-4');
    await p.getByRole('button',{name:'搜索 Lesson 或课程名称',exact:true}).click();
    await p.getByLabel('查找 Lesson',{exact:true}).fill('6');
    await expect(p.locator('.course:visible')).toHaveAttribute('data-unit','unit5-6');
    // A reduced usable viewport must leave enough room for a complete result
    // and its real 44px controls, rather than a thin, unclickable scroll strip.
    for(const [width,height] of viewports('directoryCompact')){
      await p.setViewportSize({width,height});
      await expect.poll(()=>p.locator('.journey-directory-sheet .journey-course-list').evaluate(el=>el.clientHeight)).toBeGreaterThan(100);
      await expect(p.locator('.journey-course:visible [data-course-enter]')).toBeInViewport();
    }
    await p.getByRole('button',{name:'地图定位：新朋友见面会',exact:true}).click();
    await expect(p.locator('.journey-directory-sheet')).not.toBeVisible();
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit5-6');
    await p.setViewportSize({width:390,height:844});
    await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-map-course="unit1-2"]').click();
    expect(await p.locator('[data-map-course="unit1-2"]').evaluate(n=>getComputedStyle(n).transitionDuration)).toBe('0s');
    await p.getByRole('button',{name:'我的',exact:true}).click();
    await expect(p.getByRole('link',{name:'修改密码',exact:true})).toHaveAttribute('href',base+'?account=password');
    await expect(p.getByRole('button',{name:'退出登录',exact:true})).toBeVisible();
    await p.getByRole('button',{name:'关闭我的',exact:true}).click();
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.stars,c.firstFullStarAt])).toEqual(original.courses.map(c=>[c.stars,c.firstFullStarAt]));
    await p.getByRole('link',{name:'我的纪念册',exact:true}).click();
    await expect(p.getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();
  }finally{await student.context.close();}
});

test('独立场景随可用宽度等比调整，窗口高度不改接地关系，短屏滚动访问每一课 @journey-layout',async({page,browser})=>{
  test.setTimeout(120000);await adminLogin(page,base);
  const account=await createStudent(page,'地图尺寸验收','旅程同学',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce'}),p=student.page;
  const bounds={'unit1-2':[.1013,.1188,.9147,.92504],'unit3-4':[.1505,.0998,.871,.95633],'unit5-6':[.1107,.1494,.9102,.9258]};
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    let reference;const sameWidth=[];
    // The old global map changed zoom with viewport height. Independent local
    // scenes intentionally keep the same composition and foot contact instead.
    for(const [width,height] of [[390,844],[390,932],[390,1024],[768,1024],[1024,768],[1366,768],[320,568]]){
      await p.setViewportSize({width,height});
      const view=await assertModules(p,bounds,width,reference);reference||=view;
      await expect.poll(()=>p.locator('[data-route-terrain]').evaluate((img,file)=>img.complete&&img.naturalWidth>0&&img.currentSrc.includes(file),routeWorlds.worlds.opening.file)).toBe(true);
      if(width===390)sameWidth.push(view);
    }
    for(const view of sameWidth.slice(1))for(const current of view.modules){
      const first=sameWidth[0].modules.find(m=>m.id===current.id);
      expect(current.stage.width,current.id+' height-only resize keeps scene width').toBeCloseTo(first.stage.width,1);
      expect(current.stage.height,current.id+' height-only resize keeps scene height').toBeCloseTo(first.stage.height,1);
    }
    // All three complete controls must remain reachable above the fixed dock
    // through document scroll. This replaces any demand to compress them into
    // one viewport and retains the original actual selection/search checks.
    for(const id of ['unit1-2','unit3-4','unit5-6']){
      const node=p.locator('[data-map-course="'+id+'"]');
      await node.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));
      await expect.poll(()=>node.evaluate(element=>{const rect=element.getBoundingClientRect(),dock=document.querySelector('.journey-dock').getBoundingClientRect();return rect.top>=55&&rect.bottom<=dock.top;})).toBe(true);
      await node.click();await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
    }
    await p.getByRole('button',{name:'搜索 Lesson 或课程名称',exact:true}).click();
    await p.getByLabel('查找 Lesson',{exact:true}).fill('6');
    await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit5-6');
  }finally{await student.context.close();}
});

test('三课人物和场景完整可见，标题不遮人物，单组缺图可恢复且不改成果 @journey-layout',async({page,browser})=>{
  test.setTimeout(120000);await adminLogin(page,base);
  const account=await createStudent(page,'故事人物验收','故事同学',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block'}),p=student.page;
  // Independent alpha bounds measured from the accepted PNGs (see receipts).
  // Transparent padding must not be mistaken for visible heads or hands.
  const subjects={'unit1-2':[.1013,.1188,.9147,.92504],'unit3-4':[.1505,.0998,.871,.95633],'unit5-6':[.1107,.1494,.9102,.9258]};
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    const before=await(await p.request.get(base+'api/me')).json();
    let moduleReference;
    for(const [width,height] of viewports()){
      await p.setViewportSize({width,height});
      const view=await assertModules(p,subjects,width,moduleReference);moduleReference||=view;
    }
    // Geometry may finish on a mobile viewport; recovery below exercises the
    // desktop search control, so restore that explicit interaction context.
    await p.setViewportSize({width:1440,height:1024});
    let failedRequests=0;
    await p.route('**/assets/course-journey/umbrella-counter-v1.webp*',route=>{failedRequests++;return route.abort();});
    const failed=p.locator('[data-module-course="unit3-4"]');
    await p.reload();await expect(failed).toHaveAttribute('data-art-state','error');
    await expect(failed.getByRole('status')).toContainText('场景暂时没准备好');
    await expect(failed.locator('[data-landmark-select]')).toBeHidden();
    await expect(failed.locator('[data-map-course]')).toBeVisible();
    expect(failedRequests).toBeGreaterThan(0);
    await expect(p.locator('[data-story-course="unit5-6"]')).toBeVisible();
    await p.getByLabel('查找 Lesson',{exact:true}).fill('6');
    await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit5-6');
    await p.unroute('**/assets/course-journey/umbrella-counter-v1.webp*');
    await p.getByRole('button',{name:'重新加载 Lesson 3–4 场景',exact:true}).click();
    await waitForModulesReady(p);await expect(failed.getByRole('status')).toHaveCount(0);
    await expect.poll(()=>p.locator('[data-story-course="unit3-4"]').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
    for(const course of before.courses)await expect(p.locator(`[data-stars-course="${course.id}"] [role="img"]`)).toHaveAttribute('aria-label',`${course.stars||0} / ${course.maxStars||5} 颗星`);
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});

// Preserve the release branch's non-blocking artwork-failure regression.
test('登录导航图片失败仍可进入课程，原地重试后插画恢复',async({page,browser})=>{
 await adminLogin(page,base);const account=await createStudent(page,'地图加载恢复','小园',[/Lesson 31–32 /]);const setup=await studentLogin(browser,account,base);await setup.context.close();
 const context=await browser.newContext({serviceWorkers:'block'}),p=await context.newPage();let interrupted=0;
 const missing='**/assets/course-journey/'+routeWorlds.characters['unit31-32'].file+'*';
 try{
  await p.route(missing,route=>{interrupted++;return route.abort();});await p.goto(base);await fillLogin(p,account);
  const entry=p.locator('[data-module-course="unit31-32"]');await expect(entry).toHaveAttribute('data-art-state','error');
  await expect(entry.locator('[data-map-course]')).toBeVisible();await expect(p.locator('.journey-start')).toBeVisible();expect(interrupted).toBeGreaterThan(0);
  await p.unroute(missing);await entry.getByRole('button',{name:'重新加载 Lesson 31–32 场景',exact:true}).click();
  await expect(entry).toHaveAttribute('data-art-state','ready');await expect.poll(()=>entry.locator('[data-story-course]').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
 }finally{await context.close();}
});
