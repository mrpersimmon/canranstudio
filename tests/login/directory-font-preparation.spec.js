'use strict';
const {test,expect}=require('@playwright/test'),{adminLogin,createStudent,signIn,fillLogin,setPassword}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({browserName:process.env.DIRECTORY_REVIEW_BROWSER||'chromium'});
test('目录先校验共用字体，点课复用缓存且不减少姓名和旧证字库',async({page},info)=>{
 test.setTimeout(120000);await adminLogin(page,base);const account=await createStudent(page,'字体预备核验班','小禾',[/Lesson 1–2/]);await page.locator('#adminLogout').click();await expect(page.getByRole('button',{name:'登录管理页',exact:true})).toBeVisible();await signIn(page,account,base);
 await expect(page.locator('html')).toHaveAttribute('data-shared-fonts-ready','5');const index=await (await page.request.get(base+'course-index.json')).json();expect(Object.keys(index.courses)).toEqual(['unit1-2']);expect(index.sharedFonts.map(f=>f.key.split('/').at(-1))).toEqual(['award-gothic-500.woff2','lesson-gothic-body-400.woff2','award-gothic-brand-400.woff2','award-nunito.woff2','award-round.woff2']);
 const cache=await page.evaluate(async({base,fonts})=>{const store=CanranCourseCache.open(base);return Promise.all(fonts.map(async f=>({key:f.key,bytes:(await store.cached(f))?.byteLength,expected:f.bytes})));},{base,fonts:index.sharedFonts});expect(cache.every(f=>f.bytes===f.expected)).toBe(true);
 const network=[];page.on('request',r=>{if(index.sharedFonts.some(f=>r.url().endsWith(f.url)))network.push(r.url());});await page.locator('.course[data-unit="unit1-2"] .primary-button').click();await expect(page.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(page.locator('#courseLoader')).toHaveCount(0);expect(network).toEqual([]);
 const loaded=await page.evaluate(()=>document.fonts.check('500 24px "Lesson Gothic"','龚龑')&&document.fonts.check('400 24px "Award Round"','小禾')&&document.fonts.check('24px "ZCOOL KuaiLe"','礼貌小达人'));expect(loaded).toBe(true);await page.screenshot({path:info.outputPath('cached-course.png')});
});
test('字体下载失败不封锁目录，后台重试不改学习成果',async({page},info)=>{
 test.setTimeout(120000);await adminLogin(page,base);const account=await createStudent(page,'字体失败核验班','小雨',[/Lesson 1–2/]);await page.locator('#adminLogout').click();await expect(page.getByRole('button',{name:'登录管理页',exact:true})).toBeVisible();let hits=0;
 // WebKit may own this fetch in its worker. Fail at the test HTTP server and
 // verify an actual 503, rather than assuming a page route intercepted it.
 const target=base+'resources/*/award-gothic-500.woff2';page.context().on('response',r=>{if(r.url().endsWith('/award-gothic-500.woff2')&&r.status()===503)hits++;});await courseResponse(page,target,{status:503});await page.goto(base);await fillLogin(page,account);await setPassword(page);
 await expect(page.locator('.course')).toHaveCount(1,{timeout:10000});await expect(page.locator('#directoryPrepareRetry')).toBeVisible({timeout:30000});expect(hits).toBeGreaterThan(0);await expect(page.locator('.course .primary-button')).toBeVisible();const before=await(await page.request.get(base+'api/me')).json();expect(before.courses[0].stars).toBe(0);await page.screenshot({path:info.outputPath('font-failure.png')});
 await courseResponse(page,target,null);await page.locator('#directoryPrepareRetry').click();await expect(page.locator('.course')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('data-shared-fonts-ready','5');await expect(page.locator('#directoryPrepareRetry')).toBeHidden();const after=await(await page.request.get(base+'api/me')).json();expect(after.student.id).toBe(before.student.id);expect(after.courses[0].stars).toBe(0);await page.screenshot({path:info.outputPath('font-retry.png')});
});

test.describe('目录字体准备的离开和返回',()=>{
 test.use({serviceWorkers:'block'});
 test('后台字体未完成也能立即点课，返回目录后继续准备且成绩不变',async({page},info)=>{
  test.setTimeout(90000);
  await page.addInitScript(()=>{window.addEventListener('pageshow',event=>{window.directoryHistoryRestore={persisted:event.persisted};});});
  await adminLogin(page,base);const account=await createStudent(page,'字体取消核验班','小禾',[/Lesson 1–2/]);
  await page.locator('#adminLogout').click();await signIn(page,account,base);
  const before=await(await page.request.get(base+'api/me')).json();
  const index=await(await page.request.get(base+'course-index.json')).json();
  const font=index.sharedFonts.find(item=>item.key.endsWith('/award-nunito.woff2'));
  // Evict public font bytes only. The real login and learning/award stores
  // remain unchanged; the server holds the directory's actual HTTP request.
  await page.evaluate(async({base,font})=>{const store=CanranCourseCache.open(base);await(await store.cache).delete(base+'resources/'+font.sha256);},{base,font});
  await courseResponse(page,font.url,{hold:true});
  try{
   await page.goto(base);
   await expect.poll(async()=>await(await page.request.get('/__test__/course-held')).json()).toContain(font.url);
   const held=await(await page.request.get('/__test__/course-held?details=1')).json();
   const original=held.find(request=>request.path===font.url);expect(original).toBeDefined();
   const clickedAt=Date.now();
   // Chromium need not emit a Page requestfailed event for the old document
   // across navigation. Observe the actual held connection instead: its ID
   // must close while the new course may legitimately request the same URL.
   await Promise.all([
    expect.poll(async()=>{
     const requests=await(await page.request.get('/__test__/course-held?details=1')).json();
     return requests.map(request=>request.id);
    },{timeout:5000}).not.toContain(original.id),
    page.locator('.course[data-unit="unit1-2"] .primary-button').click()
   ]);
   await info.attach('directory-font-cancellation.json',{contentType:'application/json',body:Buffer.from(JSON.stringify({requestId:original.id,cancelConfirmedMs:Date.now()-clickedAt}))});
   await courseResponse(page,font.url,null,{resumeHeld:true});
   await expect(page.locator('#courseLoader')).toHaveCount(0,{timeout:15000});
   expect(Date.now()-clickedAt).toBeLessThan(15000);
   await expect(page.locator('#wordPageProgress')).toBeVisible();
   await page.goBack();
   await expect(page.locator('.course')).toHaveCount(1);
   await expect(page.locator('html')).toHaveAttribute('data-shared-fonts-ready','5',{timeout:15000});
   await info.attach('directory-history-restore.json',{contentType:'application/json',body:Buffer.from(JSON.stringify(await page.evaluate(()=>window.directoryHistoryRestore)))});
   const after=await(await page.request.get(base+'api/me')).json();
   expect(after.student.id).toBe(before.student.id);
   expect(after.courses.map(c=>({id:c.id,stars:c.stars,completed:c.completed}))).toEqual(before.courses.map(c=>({id:c.id,stars:c.stars,completed:c.completed})));
  }finally{await courseResponse(page,font.url,null,{resumeHeld:true});}
 });
});
