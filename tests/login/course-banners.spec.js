'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const { saveCourses, adminLogin,createStudent,studentLogin,fillLogin}=require('./helpers');
const {activity,complete}=require('../support/unit31-32-flow');
test('登录后每单元一横幅、只列班级课程，图鉴入口、进度与跨设备继续保留',async({page,browser})=>{
 test.setTimeout(180000);await adminLogin(page);const account=await createStudent(page,'横幅验收班','小观察员',[/Lesson 3–4 /,/Lesson 31–32 /]);const student=await studentLogin(browser,account);let second;
 try{
  await expect(student.page.locator('.featured-course')).toHaveCount(2);await expect(student.page.locator('.featured-course[data-unit="unit31-32"] h2')).toHaveText('花园观察小队');
  for(const width of [320,390,768,1280]){await student.page.setViewportSize({width,height:900});const boxes=await student.page.locator('.featured-course').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}));expect(boxes[1].y).toBeGreaterThan(boxes[0].y+boxes[0].h);expect(boxes[0].w).toBeCloseTo(boxes[1].w,0);expect(await student.page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await expect.poll(()=>student.page.locator('.course-directory img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);await student.page.screenshot({path:`output/playwright/unit31-32/login-banners-${width}.png`,fullPage:true});}
  await student.page.getByRole('link',{name:'开始学习：花园观察小队',exact:true}).click();await expect(student.page).toHaveURL(/unit31-32\/#learn\/words$/);await expect(student.page.locator('.stage-words h3')).toBeInViewport();await activity(student.page,'listen','/lesson');await expect(student.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await student.page.getByRole('link',{name:'我的课程',exact:true}).click();const banner=student.page.locator('[data-unit="unit31-32"]');await expect(banner).toContainText('3 / 15');await expect(banner.getByRole('link')).toHaveAttribute('href','/lesson/unit31-32/#learn/text');
  second=await studentLogin(browser,account);await expect(second.page.locator('[data-unit="unit31-32"]')).toContainText('3 / 15');await second.page.goto('/lesson/unit5-6/');await expect(second.page.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();
  await student.page.getByRole('button',{name:'切换学生',exact:true}).click();await expect(student.page.getByLabel('学号',{exact:true})).toBeVisible();await expect(student.page.locator('.featured-course')).toHaveCount(0);
 }finally{await student.context.close();await second?.context.close();}
});
test('全部21个横幅完整加载、管理页保留21项开课选择且新班默认关闭新课',async({page})=>{
 await adminLogin(page);await page.getByLabel('新班级名称').fill('全部横幅检查');await page.getByRole('button',{name:'创建班级',exact:true}).click();await expect(page.locator('#courses').getByRole('checkbox')).toHaveCount(21);await expect(page.getByRole('checkbox',{name:/Lesson 31–32 /})).not.toBeChecked();await expect(page.getByRole('checkbox',{name:/Lesson 33–34 /})).not.toBeChecked();await expect(page.getByRole('checkbox',{name:/Lesson 35–36 /})).not.toBeChecked();await expect(page.getByRole('checkbox',{name:/Lesson 37–38 /})).not.toBeChecked();await expect(page.getByRole('checkbox',{name:/Lesson 39–40 /})).not.toBeChecked();for(const b of await page.locator('#courses').getByRole('checkbox').all())await b.check();await saveCourses(page);await page.getByRole('link',{name:'预览这个班',exact:true}).click();await expect(page.locator('.featured-course')).toHaveCount(21);await expect(page.locator('.course-directory')).not.toContainText('音标乐园');await expect.poll(()=>page.locator('.course-directory img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);await expect(page.getByRole('link',{name:'返回班级管理',exact:true})).toBeVisible();
});
test('新单元真实登录完整通关、姓名和15星同步到另一浏览器，旧课程仍关闭',async({page,browser})=>{
 test.setTimeout(180000);await adminLogin(page);const account=await createStudent(page,'花园完整验收','花园同学',[/Lesson 31–32 /]);const first=await studentLogin(browser,account);let second;
 try{await complete(first.page,'/lesson');await first.page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('花园同学');await first.page.getByRole('button',{name:'领取单元证书',exact:true}).click();await first.page.keyboard.press('Escape');await expect(first.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');second=await studentLogin(browser,account);await expect(second.page.locator('.course')).toContainText('15 / 15');await second.page.goto('/lesson/unit31-32/#learn/certificate');await expect(second.page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('花园同学');await expect(second.page.getByRole('button',{name:'领取单元证书',exact:true})).toBeEnabled();await second.page.goto('/lesson/lesson49/');await expect(second.page.getByRole('heading',{name:'这节课已下架',exact:true})).toBeVisible();}finally{await first.context.close();await second?.context.close();}
});
test('登录导航图片失败不展示残缺横幅，重试后完整出现',async({page,browser})=>{
 await adminLogin(page);const account=await createStudent(page,'横幅加载恢复','小园',[/Lesson 31–32 /]);const setup=await studentLogin(browser,account);await setup.context.close();
 // Exercise actual failed network delivery. The normal worker can fulfill an
 // image without page.route seeing it; cache success is covered separately.
 const context=await browser.newContext({serviceWorkers:'block'});const student={context,page:await context.newPage()};let interrupted=0;
 try{
  await student.page.route('**/assets/unit31-32/Jean.svg',route=>{interrupted++;return route.abort();});await student.page.goto('/lesson/');await fillLogin(student.page,account);
  await expect(student.page.getByRole('heading',{name:'画面还没准备好',exact:true})).toBeVisible();await expect(student.page.locator('.featured-course')).toHaveCount(0);
  expect(interrupted).toBeGreaterThan(0);
  await student.page.unroute('**/assets/unit31-32/Jean.svg');await student.page.getByRole('button',{name:'再试一次',exact:true}).click();
  await expect(student.page.locator('.featured-course')).toHaveCount(1);await expect.poll(()=>student.page.locator('.featured-art img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
 }finally{await student.context.close();}
});
