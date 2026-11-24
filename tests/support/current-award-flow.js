'use strict';
const {restoredPracticeIndex}=require('./course-controls');
// Award/state tests use current controls; curriculum accuracy remains guarded
// independently by the content contract and authored question tests.
const {expect}=require('@playwright/test'),{definition}=require('../../server/progress'),{choose}=require('./answer-question');
const {handleRewardDialog,finishRewardPresentation}=require('./reward-dialog');
async function activity(page,pair,id,{base='',keepAward=false,beforeFinish,navigate=true}={}){
 await handleRewardDialog(page,keepAward);if(navigate)await page.goto(base+'/unit'+pair+'/#learn/'+id);
 await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:45000});
 const room=page.locator('.stage-'+id);await expect(room).toBeVisible();
 const first=await restoredPracticeIndex(room,room.locator('.practice-finish:visible'));
 if(first===null)return;
 const list=definition(process.cwd(),'unit'+pair,base+'/').questions[id];
 for(let n=first;n<list.length;n++){
  const check=room.getByRole('button',{name:'检查答案',exact:true});if(await check.isVisible()){await choose(room,list[n]);await check.click();}
  await expect(room.locator('.fb')).toHaveText('答对了！');if(n===list.length-1)await beforeFinish?.(room);
  await room.getByRole('button',{name:n===list.length-1?/^完成/:'下一题',exact:n!==list.length-1}).click();
 }
 if(!keepAward)await finishRewardPresentation(page,room);
}
async function story(page,pair,base=''){
 await page.goto(base+'/unit'+pair+'/#learn/text');await expect(page.locator('html')).not.toHaveAttribute('data-course-preparing','',{timeout:45000});
 const room=page.locator('.stage-text'),lines=definition(process.cwd(),'unit'+pair,base+'/').learning.DIALOGUE.length;
 for(let i=await room.locator('.bubble-row').count();i<lines;i++)await room.locator('.stage-ctrl>.btn-green').click();
 await room.locator('.stage-ctrl>.btn-green').click();
}
module.exports={activity,story};
