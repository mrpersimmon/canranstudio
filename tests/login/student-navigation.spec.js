'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,saveCourses}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:10000});

test('已登录学生可打开老师登录入口，两个角色的身份判断分开',async({page,browser})=>{
 await adminLogin(page,base);const account=await createStudent(page,'角色入口验收','小禾',[/Lesson 1–2/]);const learner=await studentLogin(browser,account,base),p=learner.page;
 try{await p.goto(base+'admin/');await expect(p.getByRole('heading',{name:'班级管理',exact:true})).toBeVisible();await expect(p.getByLabel('管理员账号')).toBeVisible();await p.getByRole('link',{name:'返回学生入口',exact:true}).click();await expect(p.locator('.journey-home')).toBeVisible();await expect(p.locator('#loginForm')).toHaveCount(0);}finally{await learner.context.close();}
});

test('已登录返回课程、刷新和改密入口不闪登录表单，网络失败允许原位重试',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);const account=await createStudent(page,'导航身份验收','小禾',[/Lesson 1–2/]);const learner=await studentLogin(browser,account,base),p=learner.page;
 try{
  if(await p.getByRole('button',{name:'关闭课程目录',exact:true}).isVisible())await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
  await p.goto(base+'awards/');await expect(p.getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();
  const observeLogin=()=>{window.loginFormSeen=false;const check=()=>{if(document.querySelector('#studentLogin,#loginForm'))window.loginFormSeen=true;};new MutationObserver(check).observe(document,{childList:true,subtree:true});check();};
  await p.addInitScript(observeLogin);await p.evaluate(observeLogin);
  await courseResponse(p,base+'api/me',{hold:true});
  await p.getByRole('link',{name:'我的课程',exact:true}).click();
  await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-transition','preparing');await expect(p.locator('.postoffice')).toBeVisible();await expect(p.locator('#studentLogin,#loginForm')).toHaveCount(0);
  await courseResponse(p,base+'api/me',null,{resumeHeld:true});await expect(p.locator('.journey-home')).toBeVisible();expect(await p.evaluate(()=>window.loginFormSeen)).toBe(false);
  await courseResponse(p,base+'api/me',{status:503,json:{error:'模拟暂时不可用'}});await p.reload();await expect(p.getByRole('heading',{name:'暂时无法连接工作室'})).toBeVisible();await expect(p.locator('#loginForm')).toHaveCount(0);
  await courseResponse(p,base+'api/me',null);await p.getByRole('button',{name:'重试',exact:true}).click();await expect(p.locator('.journey-home')).toBeVisible();expect(await p.evaluate(()=>window.loginFormSeen)).toBe(false);
  await p.getByRole('button',{name:'我的',exact:true}).click();await p.getByRole('link',{name:'修改密码',exact:true}).click();await expect(p.locator('#passwordForm')).toBeVisible();expect(await p.evaluate(()=>window.loginFormSeen)).toBe(false);
  await p.getByRole('button',{name:'返回课程',exact:true}).click();await expect(p.locator('.journey-home')).toBeVisible();expect(await p.evaluate(()=>window.loginFormSeen)).toBe(false);
  await p.getByRole('button',{name:'我的',exact:true}).click();await p.getByRole('button',{name:'退出登录',exact:true}).click();await expect(p.locator('#loginForm')).toBeVisible();await expect(p.locator('#app')).toHaveAttribute('data-session-state','anonymous');
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await learner.context.close();}
});

test('课程与纪念册共用我的面板、旧记录和动效设置，历史入口可跨页打开',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);const account=await createStudent(page,'统一我的验收','喜欢英语和探险的小朋友林小禾',[/Lesson 1–2/]);const learner=await studentLogin(browser,account,base),p=learner.page;
 const measure=()=>p.locator('.student-account-sheet').evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,background:getComputedStyle(el).backgroundColor,rows:[...el.querySelectorAll('.student-account-row')].map(row=>({text:row.textContent,font:getComputedStyle(row).font,height:row.getBoundingClientRect().height}))};});
 try{
  await p.evaluate(()=>{localStorage.setItem('canran:lesson:unit1-2:learning:v1',JSON.stringify({activity:{unitCompleted:{a:1}}}));localStorage.setItem('canran:student:other:canran:lesson:unit3-4:learning:v1',JSON.stringify({activity:{unitCompleted:{a:1,b:1}}}));});
  for(const width of [393,1280]){
   await p.setViewportSize({width,height:852});await p.goto(base);await expect(p.locator('.journey-home')).toBeVisible();
   // Login's shared helper deliberately opens the directory; close the saved
   // modal through its real control before opening a different modal.
   if(await p.getByRole('button',{name:'关闭课程目录',exact:true}).isVisible())await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
   await p.getByRole('button',{name:'我的',exact:true}).click();await p.evaluate(()=>document.fonts.ready);const course=await measure();
   await p.getByRole('button',{name:'本机旧记录',exact:true}).click();await expect(p.getByRole('dialog',{name:'本机旧记录',exact:true})).toBeVisible();await expect(p.locator('#legacy li')).toHaveCount(1);await expect(p.locator('#legacy')).toContainText('Lesson 1–2');
   await p.getByRole('button',{name:'返回我的',exact:true}).click();const toggle=p.getByRole('switch',{name:'纪念册动效',exact:true}),old=await toggle.getAttribute('aria-checked');await toggle.click();
   await p.getByRole('button',{name:'关闭我的',exact:true}).click();await p.goto(base+'awards/');await p.getByRole('button',{name:'我的',exact:true}).click();await p.evaluate(()=>document.fonts.ready);expect(await measure()).toEqual(course);await expect(p.getByRole('switch',{name:'纪念册动效',exact:true})).toHaveAttribute('aria-checked',String(old!=='true'));
   await p.getByRole('button',{name:'关闭我的',exact:true}).click();
  }
  await p.goto(base);await p.getByRole('button',{name:'我的',exact:true}).click();await p.getByRole('button',{name:'历史收藏',exact:true}).click();await expect(p.getByRole('dialog',{name:'历史收藏',exact:true})).toBeVisible();
  const server=await(await p.request.get(base+'api/awards')).json();expect(server.cards).toEqual([]);
  await p.getByRole('button',{name:'关闭历史收藏',exact:true}).click();
  await p.evaluate(()=>{for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{configurable:true,get(){throw new DOMException('blocked','SecurityError');}});});
  const blockedToggle=p.getByRole('switch',{name:'纪念册动效',exact:true}),beforeBlocked=await blockedToggle.getAttribute('aria-checked');await blockedToggle.click();await expect(blockedToggle).toHaveAttribute('aria-checked',String(beforeBlocked!=='true'));
  await p.getByRole('button',{name:'关闭我的',exact:true}).click();await p.getByRole('button',{name:'我的',exact:true}).click();await expect(blockedToggle).toHaveAttribute('aria-checked',String(beforeBlocked!=='true'));
 }finally{await learner.context.close();}
});

test('手机目录只有一个滚动区域，长目录、短结果和末课均可操作',async({page,browser,browserName,isMobile},testInfo)=>{
 test.setTimeout(120000);await adminLogin(page,base);const account=await createStudent(page,'目录滚动验收','小禾',[]);await page.getByRole('button',{name:'全选课程',exact:true}).click();await saveCourses(page);
 const learner=await studentLogin(browser,account,base),p=learner.page;
 try{
  for(const [width,height] of [[320,568],[393,852],[612,913],[768,900]]){
   await p.setViewportSize({width,height});await p.goto(base);await expect(p.locator('.journey-home')).toBeVisible();
   if(await p.locator('.journey-all').getAttribute('aria-expanded')!=='true')await p.getByRole('button',{name:'全部课程',exact:true}).click();
   const dialog=p.getByRole('dialog',{name:'全部课程',exact:true});
   await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveCount(0);
   if(browserName==='webkit'&&isMobile){
    testInfo.annotations.push({type:'platform-limit',description:'Mobile WebKit has no mouse wheel API; outer programmatic scroll and native focus scrolling remain checked.'});
   }else{const rect=await dialog.boundingBox();await p.mouse.move(rect.x+rect.width-3,rect.y+rect.height/2);await p.mouse.wheel(0,900);}
   // overflow:clip must reject even direct outer scrolling, unlike a second
   // hidden/auto scroll container. The inner list still follows real focus.
   await dialog.evaluate(el=>{el.scrollTop=900;});
   expect(await dialog.evaluate(el=>el.scrollTop)).toBe(0);
   const last=dialog.locator('.journey-locate').last();await last.focus();
   const state=await dialog.evaluate(el=>{const list=el.querySelector('.journey-course-list'),r=list.getBoundingClientRect(),last=list.querySelector('.journey-course:last-child').getBoundingClientRect();return {outerScroll:el.scrollTop,listScroll:list.scrollTop,listBottom:r.bottom,lastBottom:last.bottom,dialogBottom:el.getBoundingClientRect().bottom,screen:innerHeight};});
   expect(state.outerScroll).toBe(0);expect(state.listScroll).toBeGreaterThan(0);expect(state.lastBottom).toBeLessThanOrEqual(state.listBottom+1);expect(state.dialogBottom).toBeLessThanOrEqual(height+1);
   await dialog.getByRole('searchbox',{name:'查找 Lesson',exact:true}).fill('9999');await expect(dialog.getByText('没有找到这节课',{exact:true})).toBeVisible();expect((await dialog.boundingBox()).height).toBeLessThanOrEqual(height);
   await dialog.getByRole('searchbox',{name:'查找 Lesson',exact:true}).fill('144');await dialog.locator('.journey-course:not([hidden]) .journey-locate').click();await expect(p.locator('.journey-map')).toHaveAttribute('data-chapter','woodland');
  }
 }finally{await learner.context.close();}
});

test('未登录、过期和旧学习码的入口只在身份明确后显示登录',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);const account=await createStudent(page,'身份边界验收','小禾',[/Lesson 1–2/]);const learner=await studentLogin(browser,account,base),p=learner.page;
 try{
  await p.goto(base+'#card=retired-code');await expect(p.locator('.journey-home')).toBeVisible();await expect(p.locator('#loginForm')).toHaveCount(0);
  await p.goto(base+'awards/');await expect(p.getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();await p.goBack();await expect(p.locator('.journey-home')).toBeVisible();await expect(p.locator('#loginForm')).toHaveCount(0);
  await courseResponse(p,base+'api/me',{status:401,json:{error:'登录已失效'}});await p.reload();await expect(p.locator('#loginForm')).toBeVisible();await expect(p.locator('.journey-home')).toHaveCount(0);
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await learner.context.close();}
});
