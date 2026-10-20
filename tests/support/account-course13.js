'use strict';
const {expect}=require('@playwright/test'),flow=require('./unit1314-fivezones');
async function completeStory(page,base=''){await flow.story(page,base);}
async function completeActivity(page,id,base=''){
 await flow.activity(page,id,{base,keepAward:true});
 const reveal=page.locator('dialog.award-reveal[open]');
 await expect(reveal).toBeVisible();await page.keyboard.press('Escape');await expect(reveal).toHaveCount(0);
}
async function completeUnit1314(page,base=''){
 await completeStory(page,base);
 for(const id of Object.keys(flow.ANSWERS)){
  await flow.activity(page,id,{base,keepAward:true});
  const reveal=page.locator('dialog.award-reveal[open]');
  await expect(reveal).toBeVisible();await page.keyboard.press('Escape');await expect(reveal).toHaveCount(0);
 }
 await page.goto(base+'/unit13-14/#learn/certificate');
 await expect(page.locator('#starCount')).toHaveText('5');
}
async function expectFreshPractice(page){
 await expect.poll(()=>page.evaluate(()=>{
  const value=JSON.parse(localStorage.getItem(window.CanranCore.unit1314.progress.learningKey)||'{}');
  return {records:Object.keys(value.records||{}),completed:Object.keys(value.activity?.unitCompleted||{})};
 })).toEqual({records:[],completed:[]});
}
module.exports={completeStory,completeActivity,completeUnit1314,expectFreshPractice};
