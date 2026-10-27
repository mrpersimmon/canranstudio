'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,fillLogin,openCourseDirectory}=require('./helpers');
const {PAIRS,SHA,LANDMARK_ART,landmarks,imageHash}=require('../support/home-banners-1730');

test.use({actionTimeout:10000,...(process.env.BANNER_REVIEW_BROWSER==='webkit'?{browserName:'webkit'}:{})});

test('登录首页七个人物入口对应课程，课内封面与纪念卡原图一致，刷新和权限保留',async({page,browser},info)=>{
 test.setTimeout(240000);const base=process.env.AWARD_TEST_BASE||'/lesson/';await adminLogin(page,base);
 const account=await createStudent(page,'首页插画核对班','小禾',PAIRS.map(pair=>new RegExp('Lesson '+pair.replace('-','–')+' '))),student=await studentLogin(browser,account,base);
 try{
  await expect(student.page.locator('.course')).toHaveCount(7);await landmarks(student.page,base,info);
  for(const pair of PAIRS){
   await openCourseDirectory(student.page);await student.page.locator('[data-unit="unit'+pair+'"] .primary-button').click();
   await expect(student.page).toHaveURL(new RegExp('unit'+pair+'/#learn/words$'));await expect(student.page.locator('#wordPageProgress')).toBeVisible({timeout:30000});
   expect(await imageHash(student.page.locator('#cover .unit-cover-art img'))).toBe(SHA[pair]);expect(await imageHash(student.page.locator('.stage-certificate .story-award-illustration'))).toBe(SHA[pair]);
   if(pair==='17-18'){await student.page.goto(base+'unit17-18/#cover');await student.page.locator('#cover').screenshot({path:info.outputPath('unit17-18-cover.png')});await student.page.goto(base+'unit17-18/#learn/certificate');await student.page.locator('.story-award-panel').screenshot({path:info.outputPath('unit17-18-card.png')});}
   await student.page.getByRole('link',{name:'我的课程',exact:true}).click();await openCourseDirectory(student.page);await expect(student.page.locator('.course')).toHaveCount(7);
  }
  await student.page.reload();await landmarks(student.page,base,null,[1280]);
  await student.page.goto(base+'unit31-32/');await expect(student.page.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();
 }finally{await student.context.close();}
});

test('新首页插画实际加载失败仍保留七个入口，原地重试恢复插画',async({page,browser},info)=>{
 const base=process.env.AWARD_TEST_BASE||'/lesson/';await adminLogin(page,base);
 const account=await createStudent(page,'首页插画恢复班','小禾',PAIRS.map(pair=>new RegExp('Lesson '+pair.replace('-','–')+' '))),setup=await studentLogin(browser,account,base);await setup.context.close();
 const context=await browser.newContext({serviceWorkers:'block'}),p=await context.newPage();let failures=0;const target='**/'+LANDMARK_ART['17-18']+'*';
 try{
  await p.route(target,r=>{failures++;return r.abort();});await p.goto(base);await fillLogin(p,account);await openCourseDirectory(p);
  await expect(p.locator('.course')).toHaveCount(7);await expect(p.locator('[data-unit="unit17-18"] .primary-button')).toBeVisible();
  const mobileClose=p.getByRole('button',{name:'关闭课程目录',exact:true});
  if(await mobileClose.isVisible())await mobileClose.click();
  else if(await p.locator('.journey-directory-desktop:visible').count())await p.locator('.journey-all').click();
  const entry=p.locator('[data-module-course="unit17-18"]');
  await expect(entry).toHaveAttribute('data-art-state','error');await expect(entry.locator('[data-map-course]')).toBeVisible();
  await expect(entry.getByRole('button',{name:'重新加载 Lesson 17–18 场景',exact:true})).toBeVisible();expect(failures).toBeGreaterThan(0);await p.screenshot({path:info.outputPath('image-failure.png')});
  await p.unroute(target);await entry.getByRole('button',{name:'重新加载 Lesson 17–18 场景',exact:true}).click();await expect(entry).toHaveAttribute('data-art-state','ready');
  await landmarks(p,base,info,[1280]);await expect(p.locator('.course')).toHaveCount(7);info.annotations.push({type:'actual-image-failures',description:String(failures)});
 }finally{await context.close();}
});
