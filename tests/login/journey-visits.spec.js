'use strict';
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,openCourseDirectory}=require('./helpers');
const {viewports}=require('../support/journey-viewports');
const {assertModules,waitForModulesReady}=require('../support/journey-modules');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{}),browserName:process.env.JOURNEY_REVIEW_BROWSER||'chromium',actionTimeout:10000});
const lessons=[/Lesson 1–2 /,/Lesson 13–14 /,/Lesson 15–16 /,/Lesson 17–18 /];
const ids=['unit13-14','unit15-16','unit17-18'];
test('第三段三课按精确Lesson搜索、定位和实际进课，刷新恢复当前地图',async({page,browser})=>{
  test.setTimeout(180000);await adminLogin(page,base);
  const account=await createStudent(page,'拜访之旅','小访客',lessons),student=await studentLogin(browser,account,base,{viewport:{width:390,height:844}}),p=student.page;
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    const before=await(await p.request.get(base+'api/me')).json();
    for(const n of [14,16,18]){
      await openCourseDirectory(p);await p.getByLabel('查找 Lesson',{exact:true}).fill(String(n));
      const result=p.locator('.journey-course:visible');await expect(result).toHaveCount(1);
      await expect(result).toHaveAttribute('data-unit','unit'+(n-1)+'-'+n);
      await result.locator('.journey-locate').click();
      await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('visits');
      await waitForModulesReady(p,ids);
      await p.locator('[data-landmark-select="unit'+(n-1)+'-'+n+'"]').click();
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit'+(n-1)+'-'+n);
      await p.locator('.journey-start').click();
      await expect(p).toHaveURL(new RegExp('unit'+(n-1)+'-'+n+'/#learn/words$'));
      await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
      await p.getByRole('link',{name:'我的课程',exact:true}).click();
    }
    await p.reload();await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('visits');
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit17-18');
    const after=await(await p.request.get(base+'api/me')).json();
    expect(after.courses.map(c=>[c.id,c.stars,c.firstFullStarAt])).toEqual(before.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]));
  }finally{await student.context.close();}
});

test('第三段连续长廊在完整矩阵和三种星级下人地绑定、信息同轴且贴近人物 @journey-layout',async({page,browser})=>{
  test.setTimeout(180000);await adminLogin(page,base);
  const account=await createStudent(page,'拜访地图尺寸','小园',lessons);
  const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),p=student.page;
  // Independent measurements of the accepted native PNGs at alpha > 16.
  // The receipt also records faint alpha support; silhouettes, not padding,
  // determine whether the characters or their key props are obstructed.
  const bounds={'unit13-14':[.089314,.124402,.927432,.917863],'unit15-16':[.146484,.102539,.904948,.926758],'unit17-18':[.093099,.078125,.923177,.959961]};
  try{
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    await p.getByLabel('旅程地图范围',{exact:true}).selectOption('visits');
    let stars=0;
    // Geometry-only fixtures do not save grades or replace real earning tests.
    await p.route('**/api/me',async route=>{const response=await route.fetch(),who=await response.json();await route.fulfill({response,json:{...who,courses:who.courses.map(c=>({...c,stars}))}});});
    for(stars of [0,2,5]){
      await p.reload();await waitForModulesReady(p,ids);
      await p.locator('[data-map-course="unit13-14"]').click();
      await expect(p.locator('[data-completion-medal]')).toHaveCount(stars===5?3:0);
      for(const [width,height] of viewports()){
        await p.setViewportSize({width,height});
        await assertModules(p,bounds,width);
      }
    }
    await p.unroute('**/api/me');await p.setViewportSize({width:1440,height:1024});
    let hits=0;await p.route('**/assets/course-journey/office-introduction-v1.webp*',route=>{hits++;return route.abort();});
    await p.reload();await expect(p.locator('[data-module-course="unit17-18"]')).toHaveAttribute('data-art-state','error');expect(hits).toBeGreaterThan(0);
    await expect(p.locator('[data-module-course="unit13-14"]')).toHaveAttribute('data-art-state','ready');
    await p.getByLabel('查找 Lesson',{exact:true}).fill('14');await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit13-14');
    await p.unroute('**/assets/course-journey/office-introduction-v1.webp*');
    await p.getByRole('button',{name:'重新加载 Lesson 17–18 场景',exact:true}).click();await waitForModulesReady(p,ids);
  }finally{await student.context.close();}
});

test('只授权17–18时显示第三段唯一入口，不泄露另两课',async({page,browser})=>{
  await adminLogin(page,base);const account=await createStudent(page,'单课拜访','小禾',[/Lesson 17–18 /]);
  const student=await studentLogin(browser,account,base),p=student.page;
  try{
    await expect(p.locator('[data-map-course]')).toHaveCount(1);
    await expect(p.locator('[data-map-course]')).toHaveAttribute('data-map-course','unit17-18');
    await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('visits');
    expect((await p.request.get(base+'unit13-14/')).status()).toBe(403);
  }finally{await student.context.close();}
});
