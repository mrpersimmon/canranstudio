'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {adminLogin,createStudent,studentLogin,saveCourses}=require('./helpers');
const {studentDocument,returnToHome}=require('../support/student-document');
const {ANSWERS,select}=require('../support/unit78-fivezones');
const {dismissRewardDialog}=require('../support/reward-dialog');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const four=[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /,/Lesson 7–8 /];
const fourth='unit7-8';
// The recovery project defaults to a touch phone, including for new contexts.
const desktopOptions=height=>({viewport:{width:1048,height},screen:{width:1048,height},isMobile:false,hasTouch:false,deviceScaleFactor:1,userAgent:undefined});
for(const device of [null,...devices])test((device?.name||'桌面')+' 四课账号选择第四课、双击、得星并返回原地标',async({page,browser},info)=>{
 test.setTimeout(100000);await adminLogin(page,base);
 const student=await createStudent(page,'课程选择 '+(device?.id||'desktop'),'小禾',four);
 const {page:p,context}=await studentLogin(browser,student,base,device?contextOptions(device):desktopOptions(900));
 try{
  // Observe the first mounted chapter in each new document, including the
  // returning home before it is presented. Never seed selection or progress.
  await context.addInitScript(()=>{
   window.mountedChapters=[];
   new MutationObserver(()=>{const id=document.querySelector('.journey-map')?.dataset.chapter;
    if(id&&window.mountedChapters.at(-1)!==id)window.mountedChapters.push(id);
   }).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['data-chapter']});
  });
  await p.reload();await expect(p.locator('.journey-map')).toHaveAttribute('data-chapter','opening');
  await expect(p.getByRole('button',{name:'全部课程',exact:true})).toHaveCount(0);
  if(device){
   await p.getByRole('button',{name:'搜索 Lesson 或课程名称',exact:true}).tap();
   await expect(p.getByRole('dialog',{name:'选择课程'})).toBeVisible();
   expect(await p.evaluate(()=>document.activeElement.tagName)).toBe('H2');
  }
  const rows=p.locator('[data-course-select]:visible'),search=p.getByRole('searchbox',{name:'查找 Lesson'});
  await expect(rows).toHaveCount(4);
  await expect(rows.nth(3)).toContainText('新朋友采访站');
  if(device){
   const sheet=await p.getByRole('dialog',{name:'选择课程'}).boundingBox(),last=await rows.last().boundingBox();
   expect(sheet.y+sheet.height-last.y-last.height).toBeLessThan(32);
  }
  await search.fill('Lesson 8');await expect(rows).toHaveCount(1);
  await expect(p.locator('.journey-map')).toHaveAttribute('data-chapter','opening');
  await rows.click();if(device)await expect(p.getByRole('dialog')).toHaveCount(0);
  await expect(p.locator('[data-route-world="neighborhood"]')).toHaveAttribute('data-world-state','ready');
  await expect(p.locator('.journey-panorama-switch')).toHaveAttribute('data-switching','false');
  await expect(p.locator('[data-map-course]')).toHaveCount(1);
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',fourth);
  const figure=p.locator('[data-story-course="unit7-8"]'),landmark=p.locator('[data-landmark-select="unit7-8"]');
  await expect(figure).toBeInViewport();
  if(device){
   const rect=await figure.boundingBox(),x=rect.x+rect.width/2,y=rect.y+rect.height/2;
   expect(await p.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('[data-landmark-select]')?.dataset.landmarkSelect,{x,y})).toBe(fourth);
   await p.touchscreen.tap(x,y);await p.touchscreen.tap(x,y);
  }else await landmark.dblclick();
  const course=await studentDocument(p,/unit7-8\/#learn\/words$/);
  await course.getByRole('link',{name:'应用',exact:true}).click();
  const room=course.locator('.stage-apply');
  for(const [i,answer] of ANSWERS.apply.entries()){
   await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();
   await expect(room.locator('.fb')).toHaveText('答对了！');
   await room.getByRole('button',{name:i===ANSWERS.apply.length-1?'完成练习':'下一题',exact:true}).click();
  }
  await expect(course.locator('#starCount')).toHaveText('1');await dismissRewardDialog(course);
  const home=await returnToHome(p,course);
  await expect(home.locator('.journey-dock')).toHaveAttribute('data-selected-course',fourth);
  await expect(home.locator('.journey-dock .journey-stars')).toHaveAttribute('aria-label','1 / 5 颗星');
  await expect(home.locator('[data-stars-course="unit7-8"] [data-earned="true"]')).toHaveCount(1);
  await expect(home.locator('[data-map-course="unit7-8"]')).toBeInViewport({ratio:1});
  expect(await home.evaluate(()=>window.mountedChapters)).toEqual(['neighborhood']);
  expect((await(await p.request.get(base+'api/me')).json()).courses.find(c=>c.id===fourth).stars).toBe(1);
  await p.screenshot({path:info.outputPath('returned-map.png'),scale:'css'});
  if(device)await home.getByRole('button',{name:'搜索 Lesson 或课程名称',exact:true}).tap();
  await expect(home.locator('[data-course-select="unit7-8"]')).toHaveAttribute('aria-pressed','true');
  await expect(home.locator('[data-course-select="unit7-8"]')).toContainText('1 / 5');
  await expect(home.locator('[data-course-select]:visible')).toHaveCount(4);
  expect(await home.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }finally{await context.close();}
});

test('从第五六课的纪念卡进入下一课，返回首页优先定位实际离开的课',async({page,browser})=>{
 const {enterDirectoryCourse}=require('./helpers');
 await adminLogin(page,base);const student=await createStudent(page,'课内续学定位','小禾',four);
 const {page:p,context}=await studentLogin(browser,student,base,contextOptions(devices[0]));
 try{
  await enterDirectoryCourse(p,'unit5-6');const third=await studentDocument(p,/unit5-6\/#learn\/words$/);
  await third.getByRole('button',{name:'更多学习操作',exact:true}).tap();
  await third.getByRole('button',{name:'我的纪念卡',exact:true}).tap();
  await third.locator('[data-course-exit="next"]').tap();
  const fourthPage=await studentDocument(p,url=>url.pathname.endsWith('/unit7-8/'));
  const home=await returnToHome(p,fourthPage);
  await expect(home.locator('.journey-map')).toHaveAttribute('data-chapter','neighborhood');
  await expect(home.locator('.journey-dock')).toHaveAttribute('data-selected-course',fourth);
  await expect(home.locator('[data-map-course="unit7-8"]')).toBeInViewport({ratio:1});
 }finally{await context.close();}
});

test('桌面长列表独立滚动，清除搜索保留当前课程',async({page,browser})=>{
 await adminLogin(page,base);const student=await createStudent(page,'侧栏长目录','小禾',[]);
 await page.getByRole('button',{name:'全选课程',exact:true}).click();await saveCourses(page);
 const {page:p,context}=await studentLogin(browser,student,base,desktopOptions(720));
 try{
  const list=p.locator('.journey-directory-desktop'),rows=list.locator('[data-course-select]'),search=p.getByRole('searchbox');
  await expect(rows).toHaveCount(72);
  expect(await p.evaluate(()=>navigator.maxTouchPoints)).toBe(0);
  const before=[await search.boundingBox(),await p.locator('.journey-start').boundingBox(),await p.evaluate(()=>scrollY)];
  await list.hover();await p.mouse.wheel(0,1200);
  await expect.poll(()=>list.evaluate(node=>node.scrollTop)).toBeGreaterThan(100);
  expect([await search.boundingBox(),await p.locator('.journey-start').boundingBox(),await p.evaluate(()=>scrollY)]).toEqual(before);
  await search.fill('144');await expect(rows).toHaveCount(1);await search.press('Enter');
  await expect(p.locator('.journey-map')).toHaveAttribute('data-chapter','woodland');
  await p.getByRole('button',{name:'清除搜索',exact:true}).click();await expect(rows).toHaveCount(72);
  await expect(rows.last()).toHaveAttribute('aria-pressed','true');await expect(rows.last()).toBeInViewport();
 }finally{await context.close();}
});
