'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {finishZone}=require('../support/unit1-2-award-flow');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {devices,contextOptions}=require('../support/required-phone-devices');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
if(process.env.COURSE_ENDING_BROWSER)test.use({browserName:process.env.COURSE_ENDING_BROWSER});

async function state(page){
  return page.evaluate(()=>{
    const book=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));
    const round=Object.entries(book.groups).find(([key])=>key.startsWith('unit12-exam-practice/'))[1];
    return {runId:round.runId,index:round.index,answers:round.states.map(s=>({questionId:s.questionId,selection:s.selection,attempts:s.attempts,firstCorrect:s.firstCorrect,checked:s.checked,correct:s.correct})),awards:CanranStudentAccess.awards};
  });
}
test('course ending exits only from the keepsake, keeps records and respects unopened/last units',async({page,browser},info)=>{
  test.setTimeout(180000);
  await adminLogin(page,base);
  const account=await createStudent(page,'课程结尾导航-'+base,'小禾',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 143–144/]);
  const student=await studentLogin(browser,account,base,contextOptions(devices[0]));
  const p=student.page;
  try{
    await finishZone(p,'exam',{base:base+'unit1-2/',keepAward:true});
    const reward=p.getByRole('dialog',{name:/纪念卡结算/});
    await expect(reward).toBeVisible();
    await expect(p.locator('.stage-exam .course-ending-navigation')).not.toBeVisible();
    await expect(reward).toHaveAttribute('data-dismissible','true');
    await reward.press('Escape');
    await expect(reward).not.toBeVisible();
    const result=p.locator('.stage-exam .completion-card');
    await expect(result).toHaveAttribute('data-result-motion','finished');
    const before=await state(p);
    expect(before.index).toBe(10);
    expect(before.answers.every(s=>s.correct&&s.attempts===1)).toBe(true);
    await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(1);
    for(const device of devices){
      await p.setViewportSize(device.viewport);
      await expect(result.getByRole('navigation',{name:'课程结束后导航'})).toHaveCount(0);
      await expect(result.getByRole('button',{name:'查看纪念卡',exact:true})).toBeInViewport({ratio:1});
      await p.screenshot({path:info.outputPath('result-'+device.id+'.png'),scale:'css'});
    }
    await result.getByRole('button',{name:'查看纪念卡',exact:true}).click();
    const card=p.locator('.stage-certificate'),nav=card.getByRole('navigation',{name:'课程结束后导航'});
    await expect(card).toBeVisible();await expect(card.locator('.story-award-tasks')).toHaveCount(0);
    for(const device of devices){
      await p.setViewportSize(device.viewport);
      await expect(nav.getByRole('link',{name:'返回首页',exact:true})).toHaveAttribute('href',new RegExp(base+'$'));
      const next=nav.getByRole('link',{name:'下一课：Lesson 3–4',exact:true});
      await expect(next).toHaveAttribute('href',new RegExp(base+'unit3-4/$'));
      const box=await nav.evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight};});
      expect(box.left).toBeGreaterThanOrEqual(-1);expect(box.right).toBeLessThanOrEqual(box.width+1);expect(box.bottom).toBeLessThanOrEqual(box.height+1);
      expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await p.screenshot({path:info.outputPath('card-'+device.id+'.png'),scale:'css'});
    }
    await card.getByRole('link',{name:'下一课：Lesson 3–4',exact:true}).click();
    await courseReadyForAssertions(p);expect(new URL(p.url()).pathname).toBe(base+'unit3-4/');
    await p.goto(base+'unit3-4/#learn/certificate');await courseReadyForAssertions(p);
    await expect(p.locator('.stage-certificate .course-ending-navigation [data-course-exit=next]')).toBeHidden();
    await p.locator('.stage-certificate').getByRole('link',{name:'返回首页',exact:true}).click();
    await expect(p.locator('.journey-home')).toBeVisible({timeout:30000});
    expect(new URL(p.url()).pathname).toBe(base);
    await p.goto(base+'unit1-2/#learn/exam');await courseReadyForAssertions(p);
    expect(await state(p)).toEqual(before);

    await p.goto(base+'unit143-144/#learn/certificate');await courseReadyForAssertions(p);
    const last=p.locator('.stage-certificate .course-ending-navigation');
    await expect(last.getByRole('link',{name:'返回首页',exact:true})).toBeVisible();
    await expect(last.locator('[data-course-exit=next]')).toBeHidden();
    expect(await p.evaluate(()=>CanranStudentAccess.nextCourse)).toBeNull();
    for(const device of devices){
      await p.setViewportSize(device.viewport);await last.scrollIntoViewIfNeeded();
      await expect(last.getByRole('link',{name:'返回首页',exact:true})).toBeInViewport();
      expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    }
  }finally{await student.context.close();}
});
