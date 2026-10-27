'use strict';
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,openCourseDirectory}=require('./helpers');
const {viewports}=require('../support/journey-viewports');
const {assertModules,waitForModulesReady}=require('../support/journey-modules');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{}),browserName:process.env.JOURNEY_REVIEW_BROWSER||'chromium',actionTimeout:10000});
const pairs=[19,21,23,25,27,29],ids=pairs.map(n=>'unit'+n+'-'+(n+1));
const lessons=[/Lesson 1–2 /,...pairs.map(n=>new RegExp('Lesson '+n+'–'+(n+1)+' '))];
const chapters=[['kindness',ids.slice(0,3)],['home',ids.slice(3)]];
// Independent alpha > 16 measurements of the accepted native PNGs. Their
// complete alpha support, references and original bytes are retained in receipts.
const bounds={
 'unit19-20':[.063796,.059809,.975279,.965710],
 'unit21-22':[.098086,.097289,.952153,.952951],
 'unit23-24':[.082935,.093301,.959330,.951356],
 'unit25-26':[.104466,.047847,.930622,.956140],
 'unit27-28':[.062201,.049442,.959330,.956938],
 'unit29-30':[.090112,.047847,.950558,.964115]
};
const results=who=>who.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]);

test('六课精确搜索、跨段定位、人物选择、实际进入与刷新返回保持真实成果',async({page,browser})=>{
 test.setTimeout(240000);await adminLogin(page,base);
 const account=await createStudent(page,'日常旅程入口','小帮手',lessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844}}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  for(const n of pairs){
   await openCourseDirectory(p);await p.getByLabel('查找 Lesson',{exact:true}).fill('Lesson '+(n+1));
   const result=p.locator('.journey-course:visible');await expect(result).toHaveCount(1);
   const id='unit'+n+'-'+(n+1);await expect(result).toHaveAttribute('data-unit',id);
   await result.locator('.journey-locate').click();
   await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue(n<25?'kindness':'home');
   await waitForModulesReady(p,n<25?ids.slice(0,3):ids.slice(3));
   await p.locator('[data-landmark-select="'+id+'"]').click();
   await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
   await p.locator('.journey-start').click();await expect(p).toHaveURL(new RegExp(id+'/#learn/words$'));
   await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
   await p.getByRole('link',{name:'我的课程',exact:true}).click();
  }
  await p.reload();await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('home');
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit29-30');
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});

for(const [chapter,courseIds] of chapters)test(chapter+' 三课在完整尺寸及三种星级下按各自布局合同保持人物与成果归属 @journey-layout',async({page,browser})=>{
 test.setTimeout(180000);await adminLogin(page,base);
 const account=await createStudent(page,'日常地图 '+chapter,'小观察员',lessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
  await p.getByLabel('旅程地图范围',{exact:true}).selectOption(chapter);
  let stars=0;
  // UI geometry samples only: real authorization remains intact and no grade
  // endpoint is written. They do not claim actual learning or award issuance.
  await p.route('**/api/me',async route=>{const response=await route.fetch(),who=await response.json();await route.fulfill({response,json:{...who,courses:who.courses.map(c=>({...c,stars}))}});});
  for(stars of [0,2,5]){
   await p.reload();await waitForModulesReady(p,courseIds);
   await p.locator('[data-map-course="'+courseIds[0]+'"]').click();
   await expect(p.locator('[data-completion-medal]')).toHaveCount(stars===5?3:0);
   for(const [width,height] of viewports()){
    await p.setViewportSize({width,height});
    await assertModules(p,Object.fromEntries(courseIds.map(id=>[id,bounds[id]])),width);
   }
  }
  await p.unroute('**/api/me');expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});

test('跨两段稀疏授权不泄露课程，缺图可切段和搜索，重试不改变成果',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'日常稀疏授权','小向导',[/Lesson 23–24 /,/Lesson 29–30 /]);
 const student=await studentLogin(browser,account,base,{viewport:{width:1440,height:1024},serviceWorkers:'block'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  // Desktop keeps the directory in the sidebar; its real closing control is
  // “返回地图”, unlike the mobile modal's “关闭课程目录”.
  await p.getByRole('button',{name:'返回地图',exact:true}).click();
  await expect(p.locator('[data-map-course]')).toHaveCount(1);await expect(p.locator('[data-map-course]')).toHaveAttribute('data-map-course','unit23-24');
  expect((await p.request.get(base+'unit21-22/')).status()).toBe(403);
  let hits=0;await p.route('**/assets/course-journey/shelf-glasses-pair-v1.webp*',route=>{hits++;return route.abort();});
  await p.reload();await expect(p.locator('[data-module-course="unit23-24"]')).toHaveAttribute('data-art-state','error');expect(hits).toBeGreaterThan(0);
  await p.getByLabel('查找 Lesson',{exact:true}).fill('30');
  const result=p.locator('.journey-course:visible');await expect(result).toHaveAttribute('data-unit','unit29-30');await result.locator('.journey-locate').click();
  await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('home');await waitForModulesReady(p,['unit29-30']);
  await expect(p.locator('[data-map-course]')).toHaveCount(1);await expect(p.locator('.journey-map-message')).toHaveCount(0);
  await p.getByLabel('旅程地图范围',{exact:true}).selectOption('kindness');await expect(p.locator('[data-module-course="unit23-24"]')).toHaveAttribute('data-art-state','error');
  await p.unroute('**/assets/course-journey/shelf-glasses-pair-v1.webp*');await p.getByRole('button',{name:'重新加载 Lesson 23–24 场景',exact:true}).click();await waitForModulesReady(p,['unit23-24']);
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});

test('新六课人物有点击回弹，金章可重看，减少动态立即停止且不写成绩',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'日常入口反馈','小旅人',lessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'no-preference',serviceWorkers:'block'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await p.route('**/api/me',async route=>{const response=await route.fetch(),who=await response.json();await route.fulfill({response,json:{...who,courses:who.courses.map(c=>({...c,stars:5}))}});});
  await p.reload();await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
  for(const [chapter,courseIds] of chapters){
   await p.getByLabel('旅程地图范围',{exact:true}).selectOption(chapter);await waitForModulesReady(p,courseIds);await expect(p.locator('[data-completion-medal]')).toHaveCount(3);
   for(const id of courseIds){
    const hit=p.locator('[data-landmark-select="'+id+'"]'),motion=hit.locator('.journey-story-motion');await hit.click();
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
    await expect.poll(()=>motion.evaluate(el=>el.getAnimations().length)).toBeGreaterThan(0);
    await expect.poll(()=>motion.evaluate(el=>el.getAnimations().length)).toBe(0);
    const medal=p.locator('[data-completion-medal="'+id+'"]');await medal.click();
    await expect.poll(()=>medal.locator('.journey-medal-face').evaluate(el=>el.getAnimations().length)).toBeGreaterThan(0);
    await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
   }
  }
  await p.emulateMedia({reducedMotion:'reduce'});
  const hit=p.locator('[data-landmark-select="unit29-30"]');await hit.focus();await hit.press('Enter');
  expect(await hit.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBe(0);
  expect(await p.locator('[data-completion-medal="unit29-30"] .journey-medal-face').evaluate(el=>el.getAnimations().length)).toBe(0);
  await p.unroute('**/api/me');expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});
