'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {definition}=require('../../server/progress');
const {choose}=require('../support/answer-question');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {handleRewardDialog,finishRewardPresentation}=require('../support/reward-dialog');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:10000});
const units=process.env.JOURNEY_UNITS?.split(',')||['unit1-2','unit37-38','unit49-50','unit95-96','unit125-126','unit143-144'];
const stored=p=>p.evaluate(()=>{const s=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));return{activity:s.activity,groups:s.groups,records:s.records};});
for(const [number,unit]of units.entries())test(unit+' complete learner journey preserves real answers and continuation',async({page,browser},info)=>{
 test.setTimeout(300000);const u=definition(process.cwd(),unit,base),first=+unit.slice(4).split('-')[0],next=first<143?'unit'+(first+2)+'-'+(first+3):null,device=devices[number%devices.length];
 await adminLogin(page,base);const lessons=[new RegExp('^Lesson '+first+'–'+(first+1)+' ')];if(next)lessons.push(new RegExp('^Lesson '+(first+2)+'–'+(first+3)+' '));
 const account=await createStudent(page,'全流程-'+unit,'验收同学',lessons),student=await studentLogin(browser,account,base,contextOptions(device)),p=student.page,report={unit,device:device.id,activities:[],corrected:null};
 try{
  await handleRewardDialog(p,false);
  await p.locator('.course[data-unit="'+unit+'"] [data-course-enter]').click();await courseReadyForAssertions(p);
  if(await p.getByRole('button',{name:'开始冒险',exact:true}).isVisible())await p.getByRole('button',{name:'开始冒险',exact:true}).click();
  else await p.locator('.learning-milestones a').first().click();await expect(p.locator('body')).toHaveAttribute('data-learning-view','words');
  const wordPages=+(await p.locator('#wordPageProgress').textContent()).split('/')[1];
  for(let i=0;i<wordPages;i++){await p.locator('.unit-word').first().click();await expect(p.locator('.unit-word').first()).toHaveAttribute('aria-expanded','true');await p.locator('.word-controls button').last().click();}
  for(const stage of u.stages)for(const [activity]of stage.activities){
   if(activity==='words'||activity==='certificate')continue;
   const room=p.locator('.stage-'+activity);await expect(room).toBeVisible();
   if(activity==='text'){
    for(let i=0;i<u.learning.DIALOGUE.length;i++)await room.locator('.stage-ctrl>.btn-green').click();
    await expect(room.locator('.bubble-row')).toHaveCount(u.learning.DIALOGUE.length);await room.locator('.stage-ctrl>.btn-green').click();report.activities.push({activity,lines:u.learning.DIALOGUE.length});continue;
   }
   const list=u.questions[activity];let corrected=0;
   for(const [i,q]of list.entries()){
    if(!report.corrected&&activity==='exam'&&q.options&&(!q.type||q.type==='choice')){
     await room.locator('.practice-options').getByRole('button',{name:q.options.find(x=>x!==q.answer),exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答错了，再试试。');corrected++;report.corrected=q.id;
     await room.getByRole('button',{name:'再试一次',exact:true}).click();
    }
    await choose(room,q);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
    if(activity==='exam'&&i===2){
     const snapshot=await stored(p);await room.getByRole('button',{name:'上一题',exact:true}).click();await expect(room.locator('[data-practice-review]')).toHaveCount(1);
     expect(await stored(p)).toEqual(snapshot);await room.getByRole('button',{name:'回到当前题',exact:true}).click();await p.reload();await courseReadyForAssertions(p);expect(await stored(p)).toEqual(snapshot);
    }
    await room.getByRole('button',{name:i===list.length-1?/^完成/:'下一题',exact:i!==list.length-1}).click();
   }
   await finishRewardPresentation(p,room);await expect(room.locator('.completion-number').nth(1)).toHaveText(String(list.length-corrected));await expect(room.locator('.completion-number').nth(2)).toHaveText(String(corrected));
   await expect(room.getByRole('link',{name:'返回首页',exact:true})).toHaveCount(0);
   report.activities.push({activity,questions:list.length,corrected});await room.locator('.practice-finish-actions .btn-green').click();
  }
  const certificate=p.locator('.stage-certificate .story-award-paper');await expect(certificate).toBeVisible();const before=await stored(p),cardText=await certificate.innerText();
  expect(before.records[report.corrected].attempts).toBe(2);expect(before.records[report.corrected].firstCorrect).toBe(false);
  await p.reload();await courseReadyForAssertions(p);expect(await stored(p)).toEqual(before);expect(await certificate.innerText()).toBe(cardText);
  await p.screenshot({path:info.outputPath(unit+'-card.png'),scale:'css'});
  if(next){await p.locator('[data-course-exit=next]').click();await courseReadyForAssertions(p);await expect(p).toHaveURL(new RegExp('/'+next+'/'));await p.locator('.practice-screen-back').click();}
  else await p.locator('[data-course-exit=home]').click();
  await expect(p.locator('.journey-home')).toBeVisible();await expect(p.getByLabel('密码',{exact:true})).toHaveCount(0);
  await fs.writeFile(info.outputPath('journey.json'),JSON.stringify(report,null,2));
 }finally{await student.context.close();}
});
