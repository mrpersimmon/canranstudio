'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {studentDocument}=require('../support/student-document');
const {courseResponse}=require('../support/course-response-faults');
const {chapterFor}=require('../../course-journey/model');
const {worlds}=require('../../course-journey/route-worlds');
const base=process.env.AWARD_TEST_BASE||'/lesson/';

async function checkNotice(screen,message){
 const notice=screen.locator('.student-navigation-status:visible');
 await expect(notice).toHaveCount(1);
 await expect(notice).toHaveAttribute('role','status');
 await expect(notice).toContainText(message);
 await expect(notice).toBeInViewport({ratio:1});
 const cancel=notice.getByRole('button',{name:'取消切换',exact:true});
 await expect(cancel).toHaveText('取消');
 const box=await cancel.boundingBox();
 expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
 return notice.evaluate(node=>{
  const css=getComputedStyle(node),indicator=getComputedStyle(node,'::before'),rect=node.getBoundingClientRect();
  if(rect.left<10 || rect.right>innerWidth-10 || document.documentElement.scrollWidth>innerWidth)throw Error('提示超出可用宽度');
  for(const bar of document.querySelectorAll('.journey-dock,[data-student-bottom-nav]')){
   const b=bar.getBoundingClientRect();
   if(getComputedStyle(bar).position==='fixed' && b.height && rect.top<b.bottom && rect.bottom>b.top)throw Error('提示遮挡底部操作');
  }
  return [css.backgroundColor,css.color,css.borderColor,css.borderRadius,css.fontFamily,css.fontSize,css.height,indicator.width,indicator.borderTopColor];
 });
}
for(const device of devices)test(device.name+' 翻图、进课、返回和纪念册使用同一种等待提示',async({page,browser},info)=>{
 test.setTimeout(120000);
 await adminLogin(page,base);
 const account=await createStudent(page,'导航提示 '+device.id,'小禾',[/Lesson 1–2 /,/Lesson 31–32 /]);
 const {page:p,context}=await studentLogin(browser,account,base,contextOptions(device));
 const terrain=base+'assets/course-journey/'+worlds[chapterFor('unit31-32')].file;
 const hold=url=>courseResponse(p,url,{hold:true}),release=url=>courseResponse(p,url,null,{resumeHeld:true});
 try{
  await p.getByRole('button',{name:'关闭课程目录'}).tap();
  await expect(p.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');
  await hold(terrain);await p.getByRole('button',{name:'下一张地图',exact:true}).tap();
  const appearance=await checkNotice(p,'正在打开 Lesson 31–36 地图…');
  expect(appearance[7]).toBe('16px');
  await p.screenshot({path:info.outputPath('map-notice.png'),scale:'css'});
  await p.getByRole('button',{name:'取消切换'}).tap();
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit1-2');
  await expect(p.locator('.student-navigation-status:visible')).toHaveCount(0);
  await release(terrain);await p.getByRole('button',{name:'下一张地图',exact:true}).tap();
  await expect(p.locator('[data-route-world="'+chapterFor('unit31-32')+'"]')).toHaveAttribute('data-world-state','ready');
  await expect(p.locator('.journey-panorama-switch')).toHaveAttribute('data-switching','false');
  const enter=base+'api/courses/unit31-32/enter';
  await hold(enter);await p.locator('.journey-start').tap();
  expect(await checkNotice(p,'正在打开 Lesson 31–32…')).toEqual(appearance);
  await release(enter);
  const course=await studentDocument(p,url=>url.pathname.endsWith('/unit31-32/'));
  await hold(base+'api/me');await course.getByRole('link',{name:'我的课程',exact:true}).tap();
  expect(await checkNotice(course,'正在打开课程首页…')).toEqual(appearance);
  await p.screenshot({path:info.outputPath('course-return-notice.png'),scale:'css'});
  await release(base+'api/me');
  const home=await studentDocument(p,url=>url.pathname===base);
  await hold(base+'api/awards');await home.getByRole('link',{name:'我的纪念册',exact:true}).tap();
  expect(await checkNotice(home,'正在打开纪念册…')).toEqual(appearance);
  await release(base+'api/awards');await expect(home.locator('.postoffice')).toBeVisible();
  await hold(base+'api/me');await home.getByRole('link',{name:'我的课程',exact:true}).tap();
  expect(await checkNotice(home,'正在打开课程首页…')).toEqual(appearance);
  await release(base+'api/me');await expect(home.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit31-32');
  await expect(home.locator('.student-navigation-status:visible')).toHaveCount(0);
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await context.close();}
});

test('改选纪念册时只提示当前目标，取消后可继续原翻图操作',async({page,browser})=>{
 await adminLogin(page,base);
 const account=await createStudent(page,'连续切换提示','小禾',[/Lesson 1–2 /,/Lesson 31–32 /]);
 const {page:p,context}=await studentLogin(browser,account,base,{...contextOptions(devices[0]),reducedMotion:'reduce'});
 const terrain=base+'assets/course-journey/'+worlds[chapterFor('unit31-32')].file;
 try{
  await p.getByRole('button',{name:'关闭课程目录'}).tap();
  await expect(p.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');
  await courseResponse(p,base+'api/awards',{hold:true});
  await p.evaluate(()=>{
   window.noticeMessages=[];
   const track=new MutationObserver(records=>{
    for(const record of records)for(const el of record.addedNodes){
     if(el.nodeType===1&&el.matches('[data-navigation-notice]'))window.noticeMessages.push(el.textContent);
    }
   });
   track.observe(document.body,{childList:true});
   const bar=document.querySelector('[data-student-bottom-nav]');
   bar.querySelector('[aria-label="我的纪念册"]').click();
   bar.querySelector('[aria-label="我的课程"]').click();
  });
  await courseResponse(p,terrain,{hold:true});await p.getByRole('button',{name:'下一张地图',exact:true}).tap();
  const current=p.locator('.student-navigation-status:visible');
  await expect(current).toContainText('Lesson 31–36 地图');
  expect(await p.evaluate(()=>window.noticeMessages.some(message=>message.includes('纪念册')))).toBe(false);
  await p.getByRole('link',{name:'我的纪念册',exact:true}).tap();
  await expect(current).toHaveCount(1);await expect(current).toContainText('正在打开纪念册…');
  expect(await current.evaluate(el=>getComputedStyle(el,'::before').animationName)).toBe('none');
  await current.getByRole('button',{name:'取消切换'}).tap();
  await expect(current).toContainText('Lesson 31–36 地图');
  await current.getByRole('button',{name:'取消切换'}).tap();
  await expect(current).toHaveCount(0);await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit1-2');
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await context.close();}
});
