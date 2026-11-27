'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {adminLogin,createStudent,studentLogin,selectDirectoryCourse,enterDirectoryCourse}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const active='iframe[data-student-view="active"]';

async function learner(page,browser,name,options={}){
 await adminLogin(page,base);
 const account=await createStudent(page,name,'小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 5–6/]);
 return studentLogin(browser,account,base,{...contextOptions(devices[0]),...options});
}

for(const [index,device] of devices.entries())test(device.name+' keeps the map and lesson until the destination is ready',async({page,browser},info)=>{
 test.setTimeout(100000);
 await adminLogin(page,base);
 const account=await createStudent(page,'课程交接'+device.name,'小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 5–6/]);
 const {page:p,context}=await studentLogin(browser,account,base,{...contextOptions(device),reducedMotion:'no-preference'});
 try{
  const directory=p.getByRole('button',{name:'关闭课程目录',exact:true});
  if(await directory.isVisible())await directory.tap();
  await expect(p.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');
  const id=index===2?'unit1-2':'unit3-4';
  if(index<2)await p.locator(index===0?'[data-landmark-select="'+id+'"]':'[data-map-course="'+id+'"]').tap();
  const link=p.locator('.journey-start');
  const url=new URL(base,p.url()).href;
  await courseResponse(p,base+'course-index.json',{hold:true});
  await link.tap();
  await expect(p.locator('.student-document-status')).toContainText('正在打开 Lesson '+id.slice(4).replace('-','–')+'…');
  await expect(p.locator('.journey-home')).toBeVisible();expect(p.url()).toBe(url);
  await expect(p.getByRole('button',{name:'取消切换'})).toBeInViewport();
  await p.getByRole('button',{name:'取消切换'}).tap();
  await expect(p.locator('.student-document-pane')).toHaveCount(0);
  await courseResponse(p,base+'course-index.json',null,{resumeHeld:true});
  await expect(link).toBeFocused();
  await p.evaluate(()=>{
   window.departureScroll=[];window.addEventListener('canran:save-workspace',()=>window.departureScroll.push(scrollY));
   window.handoffFrames=[];
   const sample=()=>{
    const target=document.querySelector('iframe[data-student-view="active"]');
    if(target){
     const outgoing=document.querySelector('iframe[data-student-view="leaving"]')||document.querySelector('.journey-home');
     const opacity=Number(getComputedStyle(target).opacity);
     if(opacity>0&&opacity<1)window.handoffFrames.push({returning:!!target.contentDocument?.querySelector('.journey-home'),covered:!!outgoing?.getClientRects().length&&getComputedStyle(outgoing).visibility!=='hidden'&&Number(getComputedStyle(outgoing).opacity)===1});
    }
    window.samplingFrame=requestAnimationFrame(sample);
   };
   sample();
  });
  await link.tap();
  await expect(p).toHaveURL(new RegExp('/'+id+'/#learn/'));
  const course=p.frameLocator(active);
  await expect(course.locator('#wordPageProgress')).toBeVisible();
  await expect(course.getByRole('link',{name:'我的课程',exact:true})).toBeInViewport();
  await courseResponse(p,base+'api/me',{hold:true});
  await course.getByRole('link',{name:'我的课程',exact:true}).tap();
  await expect(course.locator('.student-document-status')).toContainText('正在打开课程首页…');
  await expect(course.locator('#wordPageProgress')).toBeVisible();
  await info.attach('等待时的课内视口',{contentType:'application/json',body:JSON.stringify(await course.locator('.student-document-status').evaluate(el=>{
   const rect=node=>node.getBoundingClientRect().toJSON(),s=getComputedStyle(el);
   return {width:innerWidth,height:innerHeight,scroll:scrollY,visual:[visualViewport.width,visualViewport.height],status:rect(el),cancel:rect(el.lastElementChild),frame:rect(frameElement),position:s.position,top:s.top,bottom:s.bottom,parent:el.parentNode.tagName,css:!!document.querySelector('#studentHandoffCss')?.sheet};
  }))});
  await expect(course.getByRole('button',{name:'取消切换'})).toBeInViewport();
  await courseResponse(p,base+'api/me',null,{resumeHeld:true});
  await expect(p).toHaveURL(url);
  const home=p.frameLocator(active);
  await expect(home.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
  await expect(home.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');
  const departure=await p.evaluate(()=>window.departureScroll);
  const returned=await home.locator('body').evaluate(()=>({scroll:scrollY,saved:Object.entries(sessionStorage).filter(([k])=>k.startsWith('canran:workspace')||k.startsWith('canran:journey:v1')),focus:document.activeElement?.tagName}));
  await info.attach('地图离开与返回位置',{contentType:'application/json',body:JSON.stringify({departure,returned})});
  expect(departure.at(-1),'后台准备课程不能滚动首页').toBe(departure[0]);
  await expect.poll(()=>home.locator('body').evaluate(()=>scrollY),{message:JSON.stringify({departure,returned})}).toBeCloseTo(departure[0],0);
  await expect(home.locator('#loginForm')).toHaveCount(0);
  await expect.poll(()=>p.evaluate(()=>window.handoffFrames.some(f=>f.returning))).toBe(true);
  const samples=await p.evaluate(()=>{cancelAnimationFrame(window.samplingFrame);return window.handoffFrames;});
  await info.attach('过渡可见帧',{contentType:'application/json',body:JSON.stringify(samples)});
  expect(samples.some(f=>!f.returning)&&samples.every(f=>f.covered)).toBe(true);
  expect(await home.locator('body').evaluate(el=>el.scrollWidth<=el.ownerDocument.documentElement.clientWidth+1)).toBe(true);
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await context.close();}
});

test('目录进课失败可重试，快速改选只进入最后一课',async({page,browser})=>{
 const {page:p,context}=await learner(page,browser,'目录重试');
 try{
  const path=base+'api/courses/unit3-4/enter';
  await selectDirectoryCourse(p,'unit3-4');const entry=p.locator('.journey-start');
  await courseResponse(p,path,{status:503,json:{error:'暂时无法打开'}});
  await entry.tap();
  await expect(p.getByRole('button',{name:'重试切换'})).toBeInViewport();
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit3-4');
  await courseResponse(p,path,{hold:true});
  await p.getByRole('button',{name:'重试切换'}).tap();
  await expect.poll(async()=>await(await p.request.get('/__test__/course-held')).json()).toContain(path);
  await enterDirectoryCourse(p,'unit5-6');
  await expect(p).toHaveURL(/unit5-6\/#learn\//);
  await courseResponse(p,path,null,{resumeHeld:true});
  await expect(p.frameLocator(active).locator('#wordPageProgress')).toBeVisible();
  await expect(p.locator('iframe[data-student-view]')).toHaveCount(1);
  const me=await(await p.request.get(base+'api/me')).json();
  expect(me.courses.map(course=>course.stars)).toEqual([0,0,0]);
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await context.close();}
});

test('减少动态、课内地址、浏览器前后退与纪念册返回',async({page,browser})=>{
 const {page:p,context}=await learner(page,browser,'导航历史',{reducedMotion:'reduce'});
 try{
  await p.getByRole('button',{name:'关闭课程目录'}).tap();
  const homeURL=p.url();await p.locator('.journey-start').tap();
  const course=p.frameLocator(active);
  await expect(course.locator('#wordPageProgress')).toBeVisible();
  const wordsURL=p.url();
  expect(await p.locator(active).evaluate(el=>el.getAnimations().length)).toBe(0);
  await course.getByRole('link',{name:'语法',exact:true}).tap();
  await expect(p).toHaveURL(/#learn\/(manners|trans)$/);const grammarURL=p.url();
  await p.goBack();await expect(p).toHaveURL(wordsURL);
  await expect(p.frameLocator(active).locator('.learning-surface .unit-word').first()).toBeVisible();
  await p.goBack();await expect(p).toHaveURL(homeURL);await expect(p.frameLocator(active).locator('.journey-home')).toBeVisible();
  await p.goForward();await expect(p).toHaveURL(wordsURL);await expect(p.frameLocator(active).locator('#wordPageProgress')).toBeVisible();
  await p.goForward();await expect(p).toHaveURL(grammarURL);
  await p.frameLocator(active).getByRole('link',{name:'我的课程',exact:true}).tap();
  await expect(p.frameLocator(active).locator('.journey-home')).toBeVisible();
  await p.frameLocator(active).getByRole('link',{name:'我的纪念册',exact:true}).tap();
  await expect(p).toHaveURL(/awards\/$/);await expect(p.frameLocator(active).getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();
  await p.goBack();await expect(p.frameLocator(active).locator('.journey-home')).toBeVisible();
  await p.goForward();await expect(p.frameLocator(active).getByRole('heading',{name:'我的纪念册',exact:true})).toBeVisible();
 }finally{await context.close();}
});

test('从课程直达链接答对一轮，返回首页即显示新星',async({page,browser})=>{
 test.setTimeout(90000);
 const {page:p,context}=await learner(page,browser,'得星后返回');
 try{
  await p.goto(base+'unit1-2/#learn/listen');
  await require('../support/thirteen-types-flow').activity(p,'1-2','listen',{navigate:false});
  await p.getByRole('link',{name:'我的课程',exact:true}).tap();
  await expect(p.frameLocator(active).locator('[data-stars-course="unit1-2"] [data-earned="true"]')).toHaveCount(1);
  expect((await(await p.request.get(base+'api/me')).json()).courses.find(c=>c.id==='unit1-2').stars).toBe(1);
 }finally{await context.close();}
});

test('下一环节只增加一次历史记录，前进可恢复课堂',async({page,browser})=>{
 const {page:p,context}=await learner(page,browser,'环节历史');
 try{
  const homeUrl=p.url();
  await enterDirectoryCourse(p,'unit1-2');
  const course=p.frameLocator(active),progress=course.locator('#wordPageProgress');
  await expect(progress).toBeVisible();
  const wordsUrl=p.url(),total=Number((await progress.textContent()).split('/').at(-1));
  for(let i=0;i<total;i++)await course.locator('.learning-surface .word-controls button').last().tap();
  await expect(p).toHaveURL(/#learn\/listen$/);
  const firstQuestion=p.url();
  await p.evaluate(()=>history.back());await expect(p).toHaveURL(wordsUrl);await expect(progress).toBeVisible();
  await p.evaluate(()=>history.back());await expect(p).toHaveURL(homeUrl);await expect(p.frameLocator(active).locator('.journey-home')).toBeVisible();
  await p.evaluate(()=>history.forward());await expect(p).toHaveURL(wordsUrl);await expect(progress).toBeVisible();
  await p.evaluate(()=>history.forward());await expect(p).toHaveURL(firstQuestion);await expect(course.locator('.learning-surface .practice-content')).toBeVisible();
 }finally{await context.close();}
});

test('取消未提交的进课记录，身份失效立即回到登录',async({page,browser})=>{
 const {page:p,context}=await learner(page,browser,'导航权限');
 try{
  for(const [route,policy] of [['unit1-2/','DENY'],['unit1-2/?student-view=1','SAMEORIGIN'],['admin/?student-view=1','DENY']]){
   const response=await p.request.get(base+route);
   expect(response.headers()['x-frame-options']).toBe(policy);
   expect(response.headers()['content-security-policy']).toContain("frame-ancestors '"+(policy==='DENY'?'none':'self')+"'");
  }
  const path=base+'api/courses/unit1-2/permit';
  const visits=[];
  p.on('request',request=>{if(request.method()==='POST'&&request.url().endsWith('/courses/unit1-2/enter'))visits.push(request.postDataJSON());});
  await selectDirectoryCourse(p,'unit1-2');const entry=p.locator('.journey-start');
  const checkpoint=()=>p.evaluate(()=>Object.entries(localStorage).filter(([k])=>/unit1-2.*(?:learning|awards)|generation:unit1-2|pending:unit1-2/.test(k)).sort());
  const original=await checkpoint();
  await courseResponse(p,path,{hold:true});await entry.tap();
  await expect.poll(async()=>await(await p.request.get('/__test__/course-held')).json(),{timeout:30000}).toContain(path);
  await p.getByRole('button',{name:'取消切换'}).tap();
  await courseResponse(p,path,null,{resumeHeld:true});
  expect(await checkpoint()).toEqual(original);
  expect(visits.length).toBeGreaterThan(0);expect(visits.every(v=>v.prepareOnly===true)).toBe(true);
  await courseResponse(p,path,{hold:true});await entry.tap();
  await expect.poll(async()=>await(await p.request.get('/__test__/course-held')).json(),{timeout:30000}).toContain(path);
  expect((await p.request.post(base+'api/logout',{headers:{Origin:new URL(p.url()).origin},data:{}})).ok()).toBe(true);
  await courseResponse(p,path,null,{resumeHeld:true});
  await expect(p.locator('#loginForm')).toBeVisible();await expect(p.locator('.journey-home,.student-document-pane')).toHaveCount(0);
  expect(await checkpoint()).toEqual(original);expect(visits.every(v=>v.prepareOnly===true)).toBe(true);
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await context.close();}
});
