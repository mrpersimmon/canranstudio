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
  await complete(first.page,pair,'/lesson');
  if(pair==='1-2'){
   await expect(first.page.locator('#certificateName')).toHaveText('练习小伙伴');
   await expect(first.page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveCount(0);
   await expect(first.page.locator('#starCount')).toHaveText('5');
   await expect(first.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
   await expect(first.page.locator('#certificateDate')).toBeVisible();
   await expect(first.page.locator('#certificateDate')).toHaveText(/\d{4}\.\d{2}\.\d{2}/);
  }else{
   await first.page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('练习小伙伴');
   await first.page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  }
  const date=await first.page.locator('#certificateDate').innerText();await first.page.keyboard.press('Escape');
  await expect(first.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  second=await studentLogin(browser,account);await second.page.goto(`/lesson/unit${pair}/#learn/certificate`);
  await expect(second.page.locator('#starCount')).toHaveText(pair==='1-2'?'5':'15');
  if(pair==='1-2'){
   await expect(second.page.locator('#certificateName')).toHaveText('练习小伙伴');
   await expect(second.page.getByRole('button',{name:'保存纪念卡',exact:true})).toBeEnabled();
  }else{
   await expect(second.page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('练习小伙伴');
   await second.page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  }
  await expect(second.page.locator('#certificateDate')).toHaveText(date);expect(voices).toEqual([]);
 }finally{await first.context.close();await second?.context.close();}
});
