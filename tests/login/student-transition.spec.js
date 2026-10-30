'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:10000});
const {createAwardBook}=require('../../scripts/award-book-bundle');
const path=require('node:path');
async function setup(page,browser,options={}){
 await adminLogin(page,base);const account=await createStudent(page,'柔和切换验收','小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 5–6/]);
 const learner=await studentLogin(browser,account,base,{viewport:{width:393,height:852},hasTouch:true,...options}),p=learner.page;
 if(await p.getByRole('button',{name:'关闭课程目录',exact:true}).isVisible())await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
 await expect(p.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');return learner;
}
test('课程和纪念册软切换保留导航节点与原位置，正常动效和浏览器前后退一致',async({page,browser})=>{
 test.setTimeout(90000);const learner=await setup(page,browser),p=learner.page;
 try{
  await p.evaluate(()=>{window.transitionDocumentMarker='same-document';window.originalStudentHeader=document.querySelector('#siteHeader .student-header');});
  await p.locator('[data-map-course="unit3-4"]').click();await p.evaluate(()=>window.scrollTo(0,450));const scroll=await p.evaluate(()=>scrollY);
  await p.getByRole('link',{name:'我的纪念册',exact:true}).tap();await expect(p.getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();
  expect(await p.evaluate(()=>window.transitionDocumentMarker)).toBe('same-document');expect(await p.evaluate(()=>window.originalStudentHeader===document.querySelector('#siteHeader .student-header'))).toBe(true);
  await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-transition','idle');await expect(p).toHaveURL(new RegExp(base+'awards/$'));
  await p.getByRole('link',{name:'我的课程',exact:true}).tap();await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit3-4');await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-transition','idle');
  await expect.poll(()=>p.evaluate(()=>scrollY)).toBeCloseTo(scroll,0);await p.goBack();await expect(p.getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();await p.goForward();await expect(p.locator('.journey-home')).toBeVisible();expect(await p.evaluate(()=>window.transitionDocumentMarker)).toBe('same-document');
 }finally{await learner.context.close();}
});
test('慢网保留原画面，失败可重试，快速改选不提交过时页面',async({page,browser})=>{
 test.setTimeout(90000);const learner=await setup(page,browser),p=learner.page;
 try{
  await courseResponse(p,base+'api/awards',{hold:true});await p.getByRole('link',{name:'我的纪念册',exact:true}).tap();await expect(p.locator('.student-navigation-status')).toContainText('正在打开纪念册');await expect(p.locator('.journey-home')).toBeVisible();await expect(p.locator('#loginForm')).toHaveCount(0);
  await p.getByRole('link',{name:'我的课程',exact:true}).tap();await courseResponse(p,base+'api/awards',null,{resumeHeld:true});await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-page','courses');await expect(p.locator('.postoffice')).toHaveCount(0);
  await courseResponse(p,base+'api/awards',{status:503,json:{error:'temporary'}});await p.getByRole('link',{name:'我的纪念册',exact:true}).tap();await expect(p.getByRole('button',{name:'重试切换',exact:true})).toBeVisible();await expect(p.locator('.journey-home')).toBeVisible();
  await courseResponse(p,base+'api/awards',null);await p.getByRole('button',{name:'重试切换',exact:true}).click();await expect(p.getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();
  await courseResponse(p,base+'api/me',{status:401,json:{error:'登录已失效'}});await p.getByRole('link',{name:'我的课程',exact:true}).tap();await expect(p.locator('#loginForm')).toBeVisible();await expect(p.locator('.postoffice,.journey-home')).toHaveCount(0);
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await learner.context.close();}
});
test('减少动态时取消页面位移，直接纪念册入口与桌面导航保持一致',async({page,browser})=>{
 const learner=await setup(page,browser,{reducedMotion:'reduce',viewport:{width:1280,height:852}}),p=learner.page;
 try{
  await p.goto(base+'awards/');await expect(p.getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();const header=await p.locator('#siteHeader .student-header').boundingBox();
  await p.evaluate(()=>{window.transitionDocumentMarker='direct-album';});await p.getByRole('link',{name:'我的课程',exact:true}).click();await expect(p.locator('.journey-home')).toBeVisible();await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-transition','idle');
  expect(await p.locator('#siteHeader .student-header').boundingBox()).toEqual(header);expect(await p.evaluate(()=>window.transitionDocumentMarker)).toBe('direct-album');
  expect(await p.locator('.student-page').evaluateAll(nodes=>nodes.flatMap(n=>n.getAnimations()).length)).toBe(0);
 }finally{await learner.context.close();}
});

test('非空纪念册切入时原卡完整可见，保存与原课号保持一致',async({page,browser})=>{
 test.setTimeout(90000);const learner=await setup(page,browser),p=learner.page;
 try{
  const actual=await(await p.request.get(base+'api/awards')).json(),bundle=await createAwardBook(path.resolve(__dirname,'../..'),base),[edition,meta]=Object.entries(bundle.editions['unit1-2']).at(-1);
  await courseResponse(p,base+'api/awards',{json:{...actual,cards:[{...meta,course:'unit1-2',edition,id:'unit1-2:'+edition,current:true,name:'小禾',stars:5,firstFullStarAt:'2026-10-16T03:00:00.000Z'}]}});
  await courseResponse(p,meta.scene,{hold:true});await p.getByRole('link',{name:'我的纪念册',exact:true}).tap();
  await expect.poll(async()=>await(await p.request.get('/__test__/course-held')).json()).toContain(meta.scene);await expect(p.locator('.journey-home')).toBeVisible();await expect(p.locator('.student-page[data-page="awards"]')).toHaveAttribute('data-phase','preparing');
  await courseResponse(p,meta.scene,null,{resumeHeld:true});await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-page','awards');
  const card=p.locator('.postoffice-hero-card .card-frame');await expect(card).toBeVisible();const box=await card.boundingBox();expect(box.width).toBeGreaterThan(280);expect(box.height).toBeGreaterThan(140);
  await p.locator('.postoffice-hero-card').tap();await expect(p.getByRole('dialog',{name:'Lesson 1–2 纪念卡',exact:true})).toBeVisible();await expect(p.getByRole('button',{name:'保存动图',exact:true})).toBeEnabled();
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await learner.context.close();}
});

test('过渡中间帧始终有已准备的画面，导航几何在手机和平板电脑尺寸保持稳定',async({page,browser},info)=>{
 test.setTimeout(120000);const learner=await setup(page,browser),p=learner.page,frames=[];
 try{
  for(const [width,height]of [[320,568],[393,852],[768,900],[1280,852]]){
   await p.setViewportSize({width,height});
   for(const target of ['awards','courses']){
    await p.evaluate(()=>{window.transitionFrames=[];window.captureTransition=true;const sample=()=>{if(!window.captureTransition)return;const workspace=document.querySelector('[data-student-workspace]'),header=document.querySelector('#siteHeader').getBoundingClientRect();const layers=[...document.querySelectorAll('.student-page:not([data-phase="preparing"])')].map(el=>({page:el.dataset.page,opacity:Number(getComputedStyle(el).opacity),phase:el.dataset.phase}));window.transitionFrames.push({phase:workspace.dataset.transition,header:{x:header.x,y:header.y,width:header.width,height:header.height},layers});requestAnimationFrame(sample);};requestAnimationFrame(sample);});
    await p.getByRole('link',{name:target==='awards'?'我的纪念册':'我的课程',exact:true}).click();await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-page',target);await expect(p.locator('[data-student-workspace]')).toHaveAttribute('data-transition','idle');
    const captured=await p.evaluate(()=>{window.captureTransition=false;return window.transitionFrames;});const moving=captured.filter(f=>f.phase==='entering');expect(moving.length).toBeGreaterThan(1);
    for(const frame of moving){expect(1-frame.layers.reduce((v,l)=>v*(1-l.opacity),1)).toBeGreaterThanOrEqual(.98);expect(frame.header).toEqual(captured[0].header);}
    frames.push({width,height,target,frames:captured});
   }
  }
  await info.attach('transition-frames',{body:JSON.stringify(frames,null,2),contentType:'application/json'});
 }finally{await learner.context.close();}
});
