'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {complete}=require('../support/thirteen-types-flow');
const {isFeedbackAudio}=require('../support/course-resource-urls');
for(const pair of ['1-2','25-26'])test(`${pair} 新题型登录后无声通关并在另一台设备保留证书`,async({page,browser})=>{
 test.setTimeout(120000);await adminLogin(page);
 const account=await createStudent(page,'题型成品验收','练习小伙伴',[new RegExp('Lesson '+pair.replace('-','–')+' ')]);
 const first=await studentLogin(browser,account);let second;const voices=[];
 try{
  first.context.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url())&&!isFeedbackAudio(r.url()))voices.push(r.url());});
  await first.page.addInitScript(()=>{HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Test unavailable','NotSupportedError'));});
  if(pair==='25-26'){
   const flow=require('../support/unit2526-fivezones');await flow.story(first.page,'/lesson');for(const id of Object.keys(flow.ANSWERS))await flow.activity(first.page,id,{base:'/lesson'});await first.page.goto('/lesson/unit25-26/#learn/certificate');
  }else await complete(first.page,pair,'/lesson');
  {
   await expect(first.page.locator('#certificateName')).toHaveText('练习小伙伴');
   await expect(first.page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveCount(0);
   await expect(first.page.locator('#starCount')).toHaveText('5');
   await expect(first.page.locator('#studentSyncStatus')).toHaveText(pair==='1-2'?'已同步':'学习成果已同步');
   await expect(first.page.locator('#certificateDate')).toBeVisible();
   await expect(first.page.locator('#certificateDate')).toHaveText(/\d{4}\.\d{2}\.\d{2}/);
  }
  const date=await first.page.locator('#certificateDate').innerText();await first.page.keyboard.press('Escape');
  await expect(first.page.locator('#studentSyncStatus')).toHaveText(pair==='1-2'?'已同步':'学习成果已同步');
  second=await studentLogin(browser,account);await second.page.goto(`/lesson/unit${pair}/#learn/certificate`);
  await expect(second.page.locator('#starCount')).toHaveText('5');
  {
   await expect(second.page.locator('#certificateName')).toHaveText('练习小伙伴');
   await expect(second.page.getByRole('button',{name:'保存动图',exact:true})).toBeEnabled();
  }
  await expect(second.page.locator('#certificateDate')).toHaveText(date);expect(voices).toEqual([]);
 }finally{await first.context.close();await second?.context.close();}
});
