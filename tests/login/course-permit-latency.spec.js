'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';

for(const device of devices)test('an authorized slow course permit opens the word page on '+device.name,async({page,browser})=>{
 const permit=base+'api/courses/unit1-2/permit';
 await adminLogin(page,base);
 const student=await createStudent(page,'慢连接 '+device.name,'验收同学',[/^Lesson 1–2 /]);
 const {page:p,context}=await studentLogin(browser,student,base,contextOptions(device));
 try{
  await courseResponse(page,permit,{hold:true});
  await p.goto(base+'unit1-2/#learn/words');
  await expect.poll(async()=> (await(await page.request.get('/__test__/course-held')).json()).includes(permit),{timeout:30000}).toBe(true);
  // The worker's local handshake has a 1.2 s deadline. This reply includes a real HTTP round trip.
  await new Promise(resolve=>setTimeout(resolve,2000));
  await expect(p.locator('#courseLoader')).toBeVisible();
  await expect(p.locator('.learning-surface .unit-word')).toHaveCount(0);
  await courseResponse(page,permit,null,{resumeHeld:true});
  await expect(p.locator('#courseLoadingDetail')).not.toContainText('L05');
  const word=p.locator('.learning-surface .unit-word').first();
  await expect(word).toBeInViewport({timeout:20000});
  await word.tap();await expect(word).toHaveAttribute('aria-expanded','true');
  expect(await p.evaluate(()=>[innerWidth,innerHeight])).toEqual([device.viewport.width,device.viewport.height]);
 }finally{
  await courseResponse(page,permit,null,{resumeHeld:true});
  await context.close();
 }
});
