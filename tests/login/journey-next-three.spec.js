'use strict';
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,openCourseDirectory}=require('./helpers');
const {viewports}=require('../support/journey-viewports');
const {assertModules,waitForModulesReady}=require('../support/journey-modules');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{}),browserName:process.env.JOURNEY_REVIEW_BROWSER||'chromium',actionTimeout:10000});
const lessons=[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /,/Lesson 7–8 /,/Lesson 9–10 /,/Lesson 11–12 /];
const ready=p=>waitForModulesReady(p);

test('第二段三课可切换、点人物、按Lesson定位和实际进入，刷新回到当前课',async({page,browser})=>{
  test.setTimeout(180000);await adminLogin(page,base);
  const account=await createStudent(page,'第二段地图','新旅伴',lessons),student=await studentLogin(browser,account,base,{viewport:{width:390,height:844}}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    const before=await(await p.request.get(base+'api/me')).json();
    await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');await ready(p);
    await expect(p.locator('[data-map-course]')).toHaveCount(3);
    for(const id of ['unit7-8','unit9-10','unit11-12']){
      await p.locator(`[data-landmark-select="${id}"]`).click();
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
      await expect(p.locator(`[data-map-course="${id}"]`)).toHaveAttribute('aria-pressed','true');
    }
    await expect(p.locator('[data-completion-medal]')).toHaveCount(0);
    // Searching an even lesson must land on the exact pair, even when the
    // student starts in the other map district. Enter the actual course route.
    for(const n of [8,10,12]){
      await p.getByLabel('旅程地图范围',{exact:true}).selectOption('opening');
      await openCourseDirectory(p);await p.getByLabel('查找 Lesson',{exact:true}).fill(String(n));
      const result=p.locator('.journey-course:visible');await expect(result).toHaveCount(1);
      await expect(result).toHaveAttribute('data-unit',`unit${n-1}-${n}`);
      await result.locator('.journey-locate').click();await ready(p);
      await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('neighborhood');
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',`unit${n-1}-${n}`);
      await p.locator('.journey-dock .journey-start').click();
      await expect(p).toHaveURL(new RegExp(`unit${n-1}-${n}/#learn/words$`));
      await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
      await p.getByRole('link',{name:'我的课程',exact:true}).click();await ready(p);
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',`unit${n-1}-${n}`);
    }
    await p.reload();await ready(p);
    await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('neighborhood');
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit11-12');
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});

test('第二段完整局部场景和点击区适配统一尺寸，缺图可恢复且不污染另一段地图 @journey-layout',async({page,browser})=>{
  test.setTimeout(120000);await adminLogin(page,base);
  const account=await createStudent(page,'邻里地图尺寸','小白',lessons),student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),p=student.page;
  const bounds={'unit7-8':[.106858,.074163,.933014,.974482],'unit9-10':[.187400,.193780,.830941,.850080],'unit11-12':[.172526,.086914,.853516,.927734]};
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');await ready(p);
    await p.locator('[data-map-course="unit11-12"]').click();
    let moduleReference;
    for(const [width,height] of viewports()){
      await p.setViewportSize({width,height});
      const view=await assertModules(p,bounds,width,moduleReference);moduleReference||=view;
    }
    await p.setViewportSize({width:1440,height:1024});
    let blocked=0;await p.route('**/assets/course-journey/shirt-return-v1.webp*',route=>{blocked++;return route.abort();});
    const failed=()=>p.locator('[data-module-course="unit11-12"]');
    await p.reload();await expect(failed()).toHaveAttribute('data-art-state','error');expect(blocked).toBeGreaterThan(0);
    await expect(failed().getByRole('status')).toContainText('场景暂时没准备好');
    await expect(failed().locator('[data-landmark-select]')).toBeHidden();
    await expect(failed().locator('[data-map-course]')).toBeVisible();
    for(const id of ['unit7-8','unit9-10'])await expect(p.locator('[data-module-course="'+id+'"]')).toHaveAttribute('data-art-state','ready');
    await p.getByLabel('旅程地图范围',{exact:true}).selectOption('opening');await ready(p);await expect(p.locator('[data-module-course][data-art-state="error"]')).toHaveCount(0);
    await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');await expect(p.locator('[data-module-course]')).toHaveCount(3);await expect(failed()).toHaveAttribute('data-art-state','error');
    await p.unroute('**/assets/course-journey/shirt-return-v1.webp*');await p.getByRole('button',{name:'重新加载 Lesson 11–12 场景',exact:true}).click();
    await ready(p);await expect(failed().getByRole('status')).toHaveCount(0);await expect(p.locator('[data-story-course="unit11-12"]')).toBeVisible();
  }finally{await student.context.close();}
});

test('只开放Lesson11–12时直接展示第二段且不泄露未授权课程入口',async({page,browser})=>{
  await adminLogin(page,base);const account=await createStudent(page,'稀疏第二段','小叶',[/Lesson 11–12 /,/Lesson 31–32 /]);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844}}),p=student.page;
  try{
    await expect(p.locator('.journey-course')).toHaveCount(2);
    await expect(p.locator('[data-map-course]')).toHaveCount(1);
    await expect(p.locator('[data-map-course]')).toHaveAttribute('data-map-course','unit11-12');
    await p.getByLabel('查找 Lesson',{exact:true}).fill('8');await expect(p.getByText('没有找到这节课',{exact:true})).toBeVisible();
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();await ready(p);
    // Lesson 31–32 is also authorized and now has its own map district.
    // Assert the exact two allowed districts, not the pre-expansion count.
    expect(await p.getByLabel('旅程地图范围',{exact:true}).locator('option').evaluateAll(options=>options.map(option=>option.value))).toEqual(['neighborhood','outdoors']);
    await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('neighborhood');
    await p.goto(base+'unit7-8/');await expect(p.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();
  }finally{await student.context.close();}
});

test('第二段三课的星章统一跟随人物，零星部分星满星不串位 @journey-layout',async({page,browser})=>{
  test.setTimeout(120000);await adminLogin(page,base);const account=await createStudent(page,'信息位置回归','小树',lessons);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),p=student.page;
  const bounds={'unit7-8':[.106858,.074163,.933014,.974482],'unit9-10':[.187400,.193780,.830941,.850080],'unit11-12':[.172526,.086914,.853516,.927734]};
  try{
    const before=await(await p.request.get(base+'api/me')).json();
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');
    let stars=0;await p.route('**/api/me',async route=>{const response=await route.fetch(),who=await response.json();await route.fulfill({response,json:{...who,courses:who.courses.map(c=>({...c,stars}))}});});
    let moduleReference;
    for(stars of [0,2,5]){
      await p.reload();await ready(p);await expect(p.locator('[data-completion-medal]')).toHaveCount(stars===5?3:0);
      for(const [width,height] of viewports()){await p.setViewportSize({width,height});const view=await assertModules(p,bounds,width,moduleReference);moduleReference||=view;}
    }
    await p.unroute('**/api/me');const after=await(await p.request.get(base+'api/me')).json();expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});

test('第二段人物绑定同一连续地形的原始区段，真实鞋底位于本课铺地 @journey-layout',async({page,browser})=>{
  await adminLogin(page,base);const account=await createStudent(page,'人物站位回归','小禾',lessons);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce'}),p=student.page;
  const subjects={'unit7-8':{bounds:[.106858,.074163,.933014,.974482],anchor:[.519936,.974482]},'unit9-10':{bounds:[.187400,.193780,.830941,.850080],anchor:[.509171,.850080],soles:[.2273,.7871]},'unit11-12':{bounds:[.172526,.086914,.853516,.927734],anchor:[.51,.927734],soles:[.1797,.8105]}};
  const bounds=Object.fromEntries(Object.entries(subjects).map(([id,value])=>[id,value.bounds]));
  // Independently viewed v3 continuous image, in each complete square section.
  // The patch IMG contains the full 1:3 source; using its rectangle as a local
  // foot frame would silently mix source and section coordinates.
  const floors={'unit9-10':[.24,.46,.78,.61],'unit11-12':[.24,.46,.78,.61]};
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');await ready(p);
    let reference;
    for(const [width,height] of viewports()){
      await p.setViewportSize({width,height});
      const geometry=await assertModules(p,bounds,width,reference);reference||=geometry;
      await expect(async()=>{
        const figures=await p.evaluate(subjects=>Object.fromEntries([...document.querySelectorAll('[data-story-course]')].map(img=>{
          const id=img.dataset.storyCourse,r=img.getBoundingClientRect(),s=subjects[id],ground=img.closest('[data-module-course]').querySelector('.journey-story-motion').getBoundingClientRect();
          return [id,{visibleHeight:r.height*(s.bounds[3]-s.bounds[1]),feet:[(r.left+r.width*s.anchor[0]-ground.left)/ground.width,(r.top+r.height*s.anchor[1]-ground.top)/ground.height],soles:s.soles?.map(x=>(r.left+r.width*x-ground.left)/ground.width)}];
        })),subjects);
        for(const id of ['unit9-10','unit11-12']){
          const [x,y]=figures[id].feet,[left,top,right,bottom]=floors[id];
          expect(x,id+' local feet center').toBeGreaterThanOrEqual(left);expect(x).toBeLessThanOrEqual(right);
          expect(y,id+' local feet depth').toBeGreaterThanOrEqual(top);expect(y).toBeLessThanOrEqual(bottom);
          expect(figures[id].soles[0],id+' left shoe stays on own paving').toBeGreaterThanOrEqual(left);
          expect(figures[id].soles[1],id+' right shoe stays on own paving').toBeLessThanOrEqual(right);
        }
      }).toPass({timeout:5000});
    }
  }finally{await student.context.close();}
});

test('小屏点击和键盘定位只滚动页面，不滚动地图内部裁切层 @journey-layout',async({page,browser})=>{
  await adminLogin(page,base);const account=await createStudent(page,'地图内部滚动','小川',lessons);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce'}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');await ready(p);
    await p.setViewportSize({width:320,height:568});
    for(const id of ['unit11-12','unit9-10','unit7-8']){
      await p.locator(`[data-map-course="${id}"]`).click();
      await p.getByRole('link',{name:'我的课程',exact:true}).click();
      expect(await p.locator('.journey-map-scene').evaluate(el=>({x:el.scrollLeft,y:el.scrollTop})),id+' shifted the map camera').toEqual({x:0,y:0});
    }
    const last=p.locator('[data-map-course="unit11-12"]');await last.focus();await last.press('Enter');
    expect(await p.locator('.journey-map-scene').evaluate(el=>el.scrollTop)).toBe(0);
  }finally{await student.context.close();}
});
