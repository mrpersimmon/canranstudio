'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {inspectLearningLayout}=require('../support/learning-layout-audit');
const first=require('../support/thirteen-types-flow'),middle=require('../support/unit34-v154'),last=require('../support/unit56-v154');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const saved=p=>p.evaluate(()=>{const data=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));return {groups:data.groups,records:data.records};});
test.use({actionTimeout:8000});

for(const device of devices)test(`${device.name}：三课姓名实际文字、材料、图文与完成操作不互相遮挡`,async({page,browser},info)=>{
 test.setTimeout(240000);await adminLogin(page,base);const a=await createStudent(page,'布局审查-'+device.id,'小禾',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /]),s=await studentLogin(browser,a,base,contextOptions(device)),p=s.page,report=[];
 try{
  for(const pair of ['1-2','3-4','5-6']){
   const flow=pair==='1-2'?first:pair==='3-4'?middle:last;
   if(pair==='1-2')await first.story(p,pair,base.slice(0,-1));else await flow.story(p,base.slice(0,-1));
   await p.goto(base+'unit'+pair+'/#learn/text');await courseReadyForAssertions(p);expect(await p.locator('.stage-text').evaluate(inspectLearningLayout)).toEqual([]);
   const footer=p.locator('.stage-text .practice-finish-actions');await expect(footer).toBeInViewport({ratio:1});await p.screenshot({path:info.outputPath(pair+'-story.png'),scale:'css'});
   const capture=async(room,index,phase)=>{
    expect(await room.evaluate(inspectLearningLayout)).toEqual([]);
    const material=await room.locator('.task-reading').evaluateAll(items=>items.map(el=>({height:el.clientHeight,total:el.scrollHeight,width:el.clientWidth,text:el.innerText})));
    report.push({pair,index,phase,material});
    if(index===0&&phase==='blank')await p.screenshot({path:info.outputPath(pair+'-reading.png'),scale:'css'});
   };
   const room=p.locator('.stage-roles');
   // A hash navigation can resolve before WebKit has activated the new panel.
   // Wait for the target, not the still-visible story used by the legacy helper.
   await p.goto(base+'unit'+pair+'/#learn/roles');await expect(room).toHaveClass(/practice-screen-stage/);await expect(room.locator('.progress-copy')).toHaveText(/^第 \d+ \/ \d+ 题$/);
   if(pair==='1-2')await first.activity(p,pair,'roles',{base:base.slice(0,-1),capture,navigate:false});else await flow.activity(p,'roles',{base:base.slice(0,-1),capture,navigate:false});
   expect(await room.evaluate(inspectLearningLayout)).toEqual([]);await expect(room.locator('.practice-finish-actions')).toBeInViewport({ratio:1});
   const before=await saved(p);await p.getByRole('button',{name:'更多学习操作',exact:true}).click();await p.getByRole('button',{name:'回看本轮答题',exact:true}).click();
   expect(await room.evaluate(inspectLearningLayout)).toEqual([]);await expect(room.getByRole('button',{name:'返回结果',exact:true})).toBeInViewport({ratio:1});expect(await saved(p)).toEqual(before);
   await p.getByRole('button',{name:'更多学习操作',exact:true}).click();await p.getByRole('button',{name:'学习记录',exact:true}).click();const record=p.locator('#unitNotebook');await expect(record.getByRole('button',{name:'关闭',exact:true})).toBeInViewport({ratio:1});await record.getByRole('button',{name:'关闭',exact:true}).click();expect(await saved(p)).toEqual(before);
   await p.goto(base+'unit'+pair+'/#learn/words');await p.reload();await courseReadyForAssertions(p);
   const words=p.locator('.stage-words');for(const card of await words.locator('.unit-word').all()){await card.click();expect(await card.evaluate(inspectLearningLayout)).toEqual([]);await card.click();}await expect(words.getByRole('button',{name:/^下一组(?:词卡)?$/,exact:true})).toBeInViewport({ratio:1});
   expect(await saved(p)).toEqual(before);
  }
 }finally{await fs.writeFile(info.outputPath('layout-audit.json'),JSON.stringify(report,null,2));await s.context.close();}
});
