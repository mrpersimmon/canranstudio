'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {definition}=require('../../server/progress');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const units=process.env.STORY_UNITS?.split(',')||['unit25-26','unit31-32','unit65-66','unit125-126','unit135-136','unit143-144'];
const stored=page=>page.evaluate(()=>{const state=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));return {dialogue:state.activity.unitDialogue,groups:state.groups,records:state.records};});
for(const [index,unit]of units.entries())test(unit+' keeps actual reading history through the theatre change',async({page,browser},info)=>{
 test.setTimeout(180000);const u=definition(process.cwd(),unit,base),device=devices[index%devices.length];
 await adminLogin(page,base);const account=await createStudent(page,'剧场记录-'+unit,'小禾',[new RegExp(u.reward.lesson+' ')]),student=await studentLogin(browser,account,base,contextOptions(device)),p=student.page;
 try{
  await p.goto(base+unit+'/#learn/text');await courseReadyForAssertions(p);const story=p.locator('.stage-text');
  for(let i=0;i<3;i++)await story.locator('.stage-ctrl>.btn-green').click();
  await expect(story.locator('.bubble-row')).toHaveCount(3);const before=await stored(p);
  await p.reload();await courseReadyForAssertions(p);await expect(story.locator('.bubble-row')).toHaveCount(3);expect(await stored(p)).toEqual(before);
  await p.locator('.learning-milestones a').first().click();await p.locator('.learning-milestones a').nth(1).click();expect(await stored(p)).toEqual(before);
  for(let i=3;i<u.learning.DIALOGUE.length;i++)await story.locator('.stage-ctrl>.btn-green').click();
  await expect(story.locator('.bubble-row')).toHaveCount(u.learning.DIALOGUE.length);
  await story.locator('.stage-ctrl>.btn-green').click();await expect(p.locator('body')).toHaveAttribute('data-learning-view','question');
  const completed=await stored(p);expect(completed.dialogue.done).toBe(true);expect(completed.records).toEqual(before.records);
  await p.goto(base+unit+'/#learn/text');await courseReadyForAssertions(p);expect(await stored(p)).toEqual(completed);
  await p.screenshot({path:info.outputPath(unit+'-'+device.id+'.png'),scale:'css'});
 }finally{await student.context.close();}
});
