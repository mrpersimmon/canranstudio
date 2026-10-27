'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,waitForCourseReady}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({serviceWorkers:'block'});

test('真实资源等待期间不能把初始零星当成就绪，教师预览就绪后仍禁止保存个人成果',async({page})=>{
 await adminLogin(page,base);await createStudent(page,'课页就绪边界','小禾',[/Lesson 85–86 /]);
 const preview=await page.getByRole('link',{name:'预览这个班',exact:true}).getAttribute('href');
 const resource=base+'resources/*/ken.webp';let pending;
 await courseResponse(page,resource,{hold:true});
 try{
  await page.goto(preview);await page.locator('.journey-start').click();
  await page.goto(page.url().replace(/#.*$/,'#learn/certificate'));
  await expect.poll(async()=>{
   const held=await(await page.request.get('/__test__/course-held')).json();
   return held.some(url=>url.startsWith(base+'resources/')&&url.endsWith('/ken.webp'));
  }).toBe(true);
  let finished=false;pending=waitForCourseReady(page);pending.then(()=>{finished=true;},()=>{});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await expect(page.getByRole('region',{name:'课程加载',exact:true})).toBeVisible();
  expect(finished).toBe(false);
  await courseResponse(page,resource,null,{resumeHeld:true});await pending;
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
 }finally{await courseResponse(page,resource,null,{resumeHeld:true});await pending?.catch(()=>{});}
});
