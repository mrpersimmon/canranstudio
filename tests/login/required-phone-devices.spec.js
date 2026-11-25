'use strict';
const {test,expect}=require('@playwright/test');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});

for(const device of devices)test(`${device.name} ${device.viewport.width}×${device.viewport.height}：作答、回看和讲解`,async({page,browser},info)=>{
 test.setTimeout(120000);await adminLogin(page,base);
 const account=await createStudent(page,device.id,'小禾',[/Lesson 1–2 /]);
 const student=await studentLogin(browser,account,base,contextOptions(device)),p=student.page;
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1')));
 try{
  await p.goto(base+'unit1-2/#learn/trans');await courseReadyForAssertions(p);
  expect(await p.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,touch:navigator.maxTouchPoints>0}))).toEqual({...device.viewport,dpr:device.deviceScaleFactor,touch:true});
  const room=p.locator('.stage-trans'),check=room.getByRole('button',{name:'检查答案',exact:true});
  for(let i=0;i<9;i++){
   await expect(check).toBeInViewport({ratio:1});const before=await room.locator('.practice-submit-row').boundingBox();
   await flow.select(room,flow.ANSWERS['1-2'].trans[i]);await check.tap();await expect(room.locator('.fb')).toHaveText('答对了！');
   const after=await room.locator('.practice-submit-row').boundingBox();expect(after.y).toBeCloseTo(before.y,0);expect(after.height).toBe(before.height);
   expect(await room.locator('.practice-content').evaluate(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+1)).toBe(true);
   if(i<8)await room.getByRole('button',{name:'下一题',exact:true}).tap();
  }
  await expect(room.locator('.learning-question-heading .practice-context')).toHaveText('手表是你的，你也准备好了。');
  await p.screenshot({path:info.outputPath(device.id+'-question.png'),scale:'css'});
  const saved=await state();await room.getByRole('button',{name:'上一题',exact:true}).tap();await expect(room.locator('.progress-copy')).toHaveText('回看 8 / 12');
  expect(await room.locator('.practice-options button').evaluateAll(items=>items.length>0&&items.every(item=>item.disabled))).toBe(true);expect(await state()).toEqual(saved);
  await room.getByRole('button',{name:'讲解',exact:true}).tap();const dialog=p.getByRole('dialog',{name:'这一题的讲解',exact:true}),box=await dialog.boundingBox();
  expect(Math.abs(box.x+box.width/2-device.viewport.width/2)).toBeLessThanOrEqual(1);expect(Math.abs(box.y+box.height/2-device.viewport.height/2)).toBeLessThanOrEqual(1);
  await expect(dialog.getByRole('button',{name:'知道了',exact:true})).toBeInViewport({ratio:1});await p.screenshot({path:info.outputPath(device.id+'-explanation.png'),scale:'css'});
  await dialog.getByRole('button',{name:'知道了',exact:true}).tap();await room.getByRole('button',{name:'下一题',exact:true}).tap();
  await expect(room.locator('.progress-copy')).toHaveText('第 9 / 12 题');expect((await state()).groups).toEqual(saved.groups);expect((await state()).records).toEqual(saved.records);
 }finally{await student.context.close();}
});
