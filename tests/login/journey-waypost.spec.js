'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const {studentDocument,returnToHome}=require('../support/student-document');
const {worlds}=require('../../course-journey/route-worlds');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const four=[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /,/Lesson 7–8 /];
async function learner(admin,browser,name,options,lessons=four){
 await adminLogin(admin,base);
 const account=await createStudent(admin,'地图路牌 '+name,'小禾',lessons);
 const result=await studentLogin(browser,account,base,options);
 await result.page.getByRole('button',{name:'关闭课程目录',exact:true}).click();
 return result;
}
async function shown(page,chapter,id){
 await expect(page.locator('.journey-panorama-switch')).toHaveAttribute('data-switching','false');
 await expect(page.locator('.journey-map-scene')).toHaveAttribute('data-chapter',chapter);
 await expect(page.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');
 await expect(page.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
}
const results=courses=>courses.map(c=>[c.id,c.started,c.next,c.stars,c.firstFullStarAt]);

for(const device of devices)test(device.name+' 搜索图标、翻图箭头与路牌共用章节和返回位置',async({page,browser},info)=>{
 test.setTimeout(90000);
 const {page:p,context}=await learner(page,browser,device.id,contextOptions(device));
 try{
  const writes=[];
  p.on('request',r=>{if(r.method()==='POST'&&/\/api\/(?:courses\/[^/]+\/enter|progress)(?:$|\?)/.test(r.url()))writes.push(r.url());});
  const before=results((await(await p.request.get(base+'api/me')).json()).courses),homeURL=p.url();
  const prev=p.getByRole('button',{name:'上一张地图',exact:true}),next=p.getByRole('button',{name:'下一张地图',exact:true});
  const search=p.getByRole('button',{name:'搜索 Lesson 或课程名称',exact:true}),label=p.locator('.journey-chapter-label');
  await shown(p,'opening','unit1-2');await expect(prev).toBeDisabled();await expect(next).toBeEnabled();
  expect(await search.textContent()).toBe('');await expect(search.locator('svg')).toBeVisible();
  const boxes=await Promise.all([prev,next,search].map(el=>el.boundingBox()));
  for(const b of boxes){expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);expect(Math.abs(b.y-boxes[0].y)).toBeLessThanOrEqual(2);}
  await search.tap();
  await expect(p.getByRole('dialog',{name:'选择课程'})).toBeVisible();
  expect(await p.evaluate(()=>document.activeElement.tagName)).toBe('H2');
  await p.getByRole('searchbox',{name:'查找 Lesson'}).fill('Lesson 4');
  await p.locator('[data-course-select="unit3-4"]').tap();await shown(p,'opening','unit3-4');
  const start=await p.evaluate(()=>scrollY);await next.tap();await shown(p,'neighborhood','unit7-8');
  await expect(label).toHaveText('Lesson 7–12');await expect(next).toBeDisabled();await expect(p.locator('.journey-waypost')).toHaveCount(0);
  await prev.tap();await shown(p,'opening','unit3-4');await expect.poll(()=>p.evaluate(()=>scrollY)).toBeCloseTo(start,0);
  await p.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
  const post=p.getByRole('button',{name:'前往下一张地图：Lesson 7–12',exact:true});await expect(post).toBeInViewport({ratio:1});
  const geometry=await post.evaluate(el=>{
   const rect=node=>node.getBoundingClientRect(),r=rect(el),last=rect(document.querySelector('[data-map-info="unit5-6"]')),dock=rect(document.querySelector('.journey-dock'));
   return {aboveDock:r.bottom<=dock.top+1,afterLesson:r.top>=last.bottom+4,hit:el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height*.43)),fits:document.documentElement.scrollWidth<=innerWidth,scroll:scrollY};
  });
  expect(geometry).toMatchObject({aboveDock:true,afterLesson:true,hit:true,fits:true});
  await p.screenshot({path:info.outputPath('map-end.png'),scale:'css'});
  await post.evaluate(el=>el.addEventListener('pointerdown',()=>{window.postDeparture=scrollY;},{once:true}));
  await post.tap();await shown(p,'neighborhood','unit7-8');await expect(label).toBeFocused();
  await prev.tap();await shown(p,'opening','unit3-4');
  const returned=await p.evaluate(()=>({pointer:window.postDeparture,scroll:scrollY,max:document.documentElement.scrollHeight-innerHeight,padding:getComputedStyle(document.querySelector('.journey-home')).paddingBottom,visit:JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage).find(k=>k.startsWith('canran:journey:v1:')))).visits.opening}));
  await expect.poll(()=>p.evaluate(()=>scrollY),{message:JSON.stringify(returned)}).toBeCloseTo(geometry.scroll,0);
  expect(p.url()).toBe(homeURL);expect(writes).toEqual([]);
  expect(results((await(await p.request.get(base+'api/me')).json()).courses)).toEqual(before);
 }finally{await context.close();}
});

test('稀疏授权跳过未开放章节，320 宽完整显示末章课号，慢图可以折返',async({page,browser})=>{
 const {page:p,context}=await learner(page,browser,'稀疏授权',{viewport:{width:320,height:568},hasTouch:true,isMobile:true},[/Lesson 1–2 /,/Lesson 143–144 /]);
 const terrain=base+'assets/course-journey/'+worlds.woodland.file;
 try{
  await shown(p,'opening','unit1-2');const next=p.getByRole('button',{name:'下一张地图',exact:true}),back=p.getByRole('button',{name:'上一张地图',exact:true});
  const post=p.getByRole('button',{name:'前往下一张地图：Lesson 139–144'});
  await expect(post).toBeVisible();
  const lettering=await post.locator('.journey-waypost-lettering').evaluate(el=>({content:el.scrollWidth,available:el.clientWidth,words:[...el.children].map(n=>n.getBoundingClientRect().width)}));
  expect(lettering.content,JSON.stringify(lettering)).toBeLessThanOrEqual(lettering.available);
  await courseResponse(p,terrain,{hold:true});await next.tap();
  await expect(p.locator('.journey-panorama-switch')).toHaveAttribute('data-switching','true');
  await expect(p.locator('.journey-panorama-layer[data-staging="false"] [data-route-world]')).toHaveAttribute('data-route-world','opening');
  await back.tap();await courseResponse(p,terrain,null,{resumeHeld:true});await shown(p,'opening','unit1-2');
  await next.tap();await shown(p,'woodland','unit143-144');
  await expect(p.locator('[data-map-course]')).toHaveCount(1);await expect(next).toBeDisabled();
  await expect(p.locator('.journey-chapter-label')).toHaveText('Lesson 139–144');
  expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }finally{await courseResponse(p,terrain,null,{resumeHeld:true});await context.close();}
});

test('只有一张已开放地图时保留搜索，桌面沿用常驻侧栏',async({page,browser})=>{
 const {page:p,context}=await learner(page,browser,'单张地图',contextOptions(devices[0]),[/Lesson 7–8 /]);
 try{
  await shown(p,'neighborhood','unit7-8');
  await expect(p.locator('.journey-chapter-label')).toHaveText('Lesson 7–12');
  await expect(p.locator('.journey-chapter-nav button,.journey-waypost')).toHaveCount(0);
  await expect(p.locator('.journey-mobile-search')).toBeInViewport();
  await p.setViewportSize({width:1048,height:900});
  await expect(p.getByRole('searchbox',{name:'查找 Lesson'})).toBeVisible();await expect(p.locator('.journey-chapter-nav,.journey-waypost,.journey-mobile-search')).toHaveCount(0);
 }finally{await context.close();}
});

test('翻图后仍可双击地标进课，从课堂返回后可找回上一张的选课位置',async({page,browser})=>{
 const {page:p,context}=await learner(page,browser,'课堂往返',contextOptions(devices[0]));
 try{
  await p.locator('.journey-mobile-search').tap();await p.locator('[data-course-select="unit3-4"]').tap();
  await shown(p,'opening','unit3-4');const scroll=await p.evaluate(()=>scrollY);
  await p.getByRole('button',{name:'下一张地图',exact:true}).tap();await shown(p,'neighborhood','unit7-8');
  const rect=await p.locator('[data-story-course="unit7-8"]').boundingBox();
  const x=rect.x+rect.width/2,y=rect.y+rect.height/2;
  await p.touchscreen.tap(x,y);await p.touchscreen.tap(x+1,y);
  const course=await studentDocument(p,/unit7-8\/#learn\/words$/);
  await expect(course.locator('#wordPageProgress')).toBeVisible();
  const home=await returnToHome(p,course);await shown(home,'neighborhood','unit7-8');
  await home.getByRole('button',{name:'上一张地图',exact:true}).tap();await shown(home,'opening','unit3-4');
  await expect.poll(()=>home.evaluate(()=>scrollY)).toBeCloseTo(scroll,0);
 }finally{await context.close();}
});
