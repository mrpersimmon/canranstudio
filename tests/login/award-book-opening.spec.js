'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {finishZone}=require('../support/unit1-2-award-flow');
const {courseResponse}=require('../support/course-response-faults');

test('邮局先准备原卡；图片失败可重试，等待时仍能打开和关闭我的',async({page,browser})=>{
 test.setTimeout(90000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
 await adminLogin(page,base);const account=await createStudent(page,'邮局准备班','小雨',[/Lesson 1–2/]);
 const learner=await studentLogin(browser,account,base),tab=learner.page;
 try{
  await finishZone(tab,'trans',{base:base+'unit1-2/'});await expect(tab.locator('#studentSyncStatus')).toHaveText('已同步');
  const collection=await(await tab.request.get(base+'api/awards')).json(),image=collection.cards[0].scene;
  // Worker-owned fetches can bypass page.route; fail the real HTTP response.
  await courseResponse(tab,image,{status:503});
  await tab.goto(base+'awards/');await expect(tab.getByRole('heading',{name:'暂时打不开纪念卡',exact:true})).toBeVisible();
  await expect(tab.locator('.postoffice-hero-card')).toHaveCount(0);await expect(tab.locator('.postoffice-scene-art')).toBeVisible();
  await tab.getByRole('button',{name:'我的',exact:true}).click();await tab.getByRole('button',{name:'关闭我的',exact:true}).click();
  await courseResponse(tab,image,null);await tab.getByRole('button',{name:'再试一次',exact:true}).click();
  await expect(tab.locator('.postoffice-scene')).toHaveAttribute('aria-busy','false');
  await expect(tab.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-stars','1');
  await expect(tab.locator('.book-cover,.turning-leaf,.mobile-turning-leaf')).toHaveCount(0);
 }finally{await learner.context.close();}
});

test('手机原卡保持完整横向比例；键盘、关闭回焦和旧样板地址仍可操作',async({page,browser,browserName})=>{
 test.setTimeout(90000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
 await adminLogin(page,base);const account=await createStudent(page,'手机邮局班','小雨',[/Lesson 1–2/]);
 const learner=await studentLogin(browser,account,base),tab=learner.page,errors=[];tab.on('pageerror',error=>errors.push(error.message));
 try{
  await finishZone(tab,'trans',{base:base+'unit1-2/'});await expect(tab.locator('#studentSyncStatus')).toHaveText('已同步');
  for(const width of [320,390]){
   await tab.setViewportSize({width,height:844});await tab.goto(base+'awards/');
   const hero=tab.getByRole('button',{name:'查看并保存纪念卡：Lesson 1–2 礼貌小帮手',exact:true});await expect(hero).toBeVisible();
   await expect(tab.locator('.postoffice-card-option')).toHaveCount(3);await expect(tab.locator('.postoffice-card-option:disabled')).toHaveCount(2);
   const box=await hero.locator('.card-frame').evaluate(el=>({w:el.clientWidth,h:el.clientHeight}));expect(Math.abs(box.w/box.h-1640/880)).toBeLessThan(.02);
   expect(await tab.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await hero.press('Enter');const modal=tab.getByRole('dialog',{name:'Lesson 1–2 纪念卡'});await expect(modal).toBeVisible();
   await expect(modal.locator('.certificate')).toHaveAttribute('data-stars','1');await expect(modal.locator('a')).toHaveCount(0);
   await modal.press('Escape');await expect(hero).toBeFocused();
   // Windows WebKit does not expose this platform-specific CSS property.
   // Keep the computed-color assertion on supporting engines, and record
   // the unsupported observation rather than treating it as a phone result.
   const tapColorSupported=await hero.evaluate(()=>CSS.supports('-webkit-tap-highlight-color','transparent'));
   if(tapColorSupported)await expect(hero).toHaveCSS('-webkit-tap-highlight-color','rgba(0, 0, 0, 0)');
   else{expect(browserName).toBe('webkit');test.info().annotations.push({type:'platform-limit',description:'Tap highlight CSS is unavailable in Windows WebKit; Chromium checks the computed transparent value. Physical phones are not covered.'});}
   await tab.screenshot({path:'output/login/postoffice-'+width+'.png'});
  }
  await tab.goto(base+'awards/?prototype=opening&variant=C');await expect(tab.locator('.postoffice-hero-card')).toBeVisible();
  await expect(tab.getByRole('button',{name:'打开纪念册',exact:true})).toHaveCount(0);await expect(tab.getByRole('complementary',{name:'开书动画方案比较'})).toHaveCount(0);
  expect(errors).toEqual([]);
 }finally{await learner.context.close();}
});
