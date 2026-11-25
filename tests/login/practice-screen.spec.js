'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const fs=require('node:fs/promises');
const {viewports:requiredPhoneViewports}=require('../support/required-phone-devices');
const {inspectLearningLayout}=require('../support/learning-layout-audit');
test.use({actionTimeout:8000});
const firstFlow=require('../support/thirteen-types-flow'),middleFlow=require('../support/unit34-v154'),lastFlow=require('../support/unit56-v154');

async function measureQuestion(room){
 return room.evaluate(el=>{
  const content=el.querySelector('.practice-content'),actions=el.querySelector('.practice-submit-row'),b=content.getBoundingClientRect(),a=actions.getBoundingClientRect();
  const visible=x=>x.getClientRects().length&&!x.closest('[hidden]')&&!x.classList.contains('is-placed')&&getComputedStyle(x).visibility!=='hidden';
  const outside=[...content.querySelectorAll('button,input')].filter(visible).filter(x=>{
   const r=x.getBoundingClientRect();if(r.top<b.top-1||r.bottom>b.bottom+1||r.left<b.left-1||r.right>b.right+1)return true;
   for(let parent=x.parentElement;parent&&parent!==content;parent=parent.parentElement){const s=getComputedStyle(parent),p=parent.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(s.overflowY)&&(r.top<p.top-1||r.bottom>p.bottom+1))return true;if(/auto|scroll|hidden|clip/.test(s.overflowX)&&(r.left<p.left-1||r.right>p.right+1))return true;}return false;
  }).map(x=>x.getAttribute('aria-label')||x.textContent);
  return {width:innerWidth,height:innerHeight,overflow:content.scrollHeight-content.clientHeight,scroll:content.scrollTop,outside,guardEntries:window.learningGuardEntries||0,actions:{y:a.y,bottom:a.bottom,height:a.height},hasReading:!!el.querySelector('.task-reading'),text:content.innerText};
 });
}

test('375×667配对题不用滚动即可配对和检查，反馈保持原位',async({page,browser},info)=>{
 test.setTimeout(60000);await adminLogin(page,base);
 const account=await createStudent(page,'单屏练习验收','小禾',[/Lesson 1–2 /]);
 const student=await studentLogin(browser,account,base,{viewport:{width:375,height:667},hasTouch:true}),p=student.page;
 try{
  await p.goto(base+'unit1-2/#learn/listen');await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
  const room=p.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(check).toBeInViewport({ratio:1});
  await p.screenshot({path:info.outputPath('matching-375.png')});
  const before=await check.boundingBox();
  for(const[en,cn]of [['coat','外套'],['dress','连衣裙'],['skirt','半身裙']]){
   const left=room.getByRole('button',{name:en,exact:true}),right=room.getByRole('button',{name:cn,exact:true});
   await expect(left).toBeInViewport({ratio:1});await left.tap();await expect(right).toBeInViewport({ratio:1});await right.tap();
  }
  await check.tap();await expect(room.locator('.fb')).toHaveText('答对了！');
  const next=room.getByRole('button',{name:'下一题',exact:true});await expect(next).toBeInViewport({ratio:1});
  const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThanOrEqual(1);expect(Math.abs(after.height-before.height)).toBeLessThanOrEqual(1);
  await p.screenshot({path:info.outputPath('matching-feedback-375.png')});
  await next.tap();await expect(room.locator('.progress-copy')).toHaveText('第 2 / 5 题');await expect(check).toBeInViewport({ratio:1});
 }finally{await student.context.close();}
});

for(const pair of ['1-2','3-4','5-6'])test(`Lesson ${pair} 全部题目在手机的作答与反馈布局`,async({page,browser},info)=>{
 test.setTimeout(240000);await adminLogin(page,base);const label=pair.replace('-','–');
 const account=await createStudent(page,'全题单屏'+pair,'小禾',[new RegExp('Lesson '+label+' ')]),student=await studentLogin(browser,account,base,{viewport:{width:375,height:667},hasTouch:true}),p=student.page;
 const report=[],issues=[],positions=new Map();
 try{
  await p.addInitScript(()=>{window.learningGuardEntries=0;let ready=false;document.addEventListener('canran:course-ready',()=>ready=true);new MutationObserver(rows=>{if(ready)for(const row of rows)if(row.attributeName==='data-course-painting'&&row.oldValue===null)window.learningGuardEntries++;}).observe(document,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['data-course-painting']});});
  if(pair==='1-2')await firstFlow.story(p,pair,base.slice(0,-1));else await (pair==='3-4'?middleFlow:lastFlow).story(p,base.slice(0,-1));
  const groups=pair==='1-2'?Object.keys(firstFlow.ANSWERS[pair]):Object.keys(pair==='3-4'?middleFlow.ANSWERS:lastFlow.CURRENT);
  for(const group of groups){
   const capture=async(room,index,phase)=>{
    const viewports=[...requiredPhoneViewports(),[320,568],...(index===0&&phase==='blank'?[[390,844],[768,1024],[1366,768]]:[])];
    for(const[width,height]of viewports){
     await p.setViewportSize({width,height});await expect(p.locator('body')).toHaveAttribute('data-practice-screen','');
     await expect(p.locator('body')).toHaveAttribute('data-practice-viewport',width+'x'+height);
     const m=await measureQuestion(room);m.textIssues=await room.evaluate(inspectLearningLayout);report.push({group,index,phase,...m});
     const key=group+'-'+index+'-'+width;
     if(m.overflow>2||m.outside.length||m.actions.y<0||m.actions.bottom>height||m.guardEntries||m.textIssues.length)issues.push({group,index,phase,...m});
     if(phase==='blank')positions.set(key,m.actions.y);else if(Math.abs(m.actions.y-positions.get(key))>1)issues.push({group,index,width,phase,shift:m.actions.y-positions.get(key)});
     if(index===0&&width===375&&phase==='blank'||m.overflow>2&&width===320&&phase==='blank')await p.screenshot({path:info.outputPath(`${group}-${index}-${width}-${phase}.png`)});
    }
   };
   if(pair==='1-2')await firstFlow.activity(p,pair,group,{base:base.slice(0,-1),capture});else await (pair==='3-4'?middleFlow:lastFlow).activity(p,group,{base:base.slice(0,-1),capture});
  }
  await fs.writeFile(info.outputPath('geometry.json'),JSON.stringify(report,null,2));
  await expect(p.locator('#starCount')).toHaveText('5');expect(issues.map(({group,index,width,phase,overflow,outside,shift,guardEntries,textIssues})=>({group,index,width,phase,overflow,outside,shift,guardEntries,textIssues}))).toEqual([]);
 }finally{await fs.writeFile(info.outputPath('issues.json'),JSON.stringify(issues,null,2));await student.context.close();}
});

test('错答、重试、更多菜单及旋转保持作答记录，线索不推移操作区',async({page,browser},info)=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'单屏记录保护','小禾',[/Lesson 1–2 /]),student=await studentLogin(browser,account,base,{viewport:{width:375,height:667},hasTouch:true}),p=student.page;
 const saved=()=>p.evaluate(()=>{const book=JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1'));return {groups:book.groups,records:book.records};});
 try{
  await p.goto(base+'unit1-2/#learn/listen');await expect(p.locator('body')).toHaveAttribute('data-practice-screen','',{timeout:30000});
  const room=p.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});
  await firstFlow.select(room,{pairs:[['coat','连衣裙'],['dress','半身裙'],['skirt','外套']]});const position=await check.boundingBox();await check.tap();
  await expect(room.locator('.fb')).toHaveText('答错了，再试试。');const retry=room.getByRole('button',{name:'再试一次',exact:true});expect(Math.abs((await retry.boundingBox()).y-position.y)).toBeLessThanOrEqual(1);
  const before=await saved();
  for(const[width,height]of [[320,568],[667,375],[1366,768],[375,667]]){await p.setViewportSize({width,height});await expect(retry).toBeInViewport({ratio:1});}
  const more=p.getByRole('button',{name:'更多学习操作',exact:true});await more.click();
  const menuBox=await p.getByRole('dialog',{name:'学习操作',exact:true}).boundingBox();expect(menuBox.x).toBeGreaterThanOrEqual(14);expect(menuBox.y).toBeGreaterThanOrEqual(16);expect(Math.abs(menuBox.x+menuBox.width/2-375/2)).toBeLessThanOrEqual(1);expect(menuBox.y+menuBox.height).toBeLessThanOrEqual(651);
  await p.getByRole('dialog',{name:'学习操作',exact:true}).getByRole('button',{name:'学习记录',exact:true}).click();await expect(p.locator('#unitNotebook')).toBeVisible();await p.locator('#unitNotebook [data-close]').click();await expect(more).toBeFocused();
  await more.click();await p.getByRole('dialog',{name:'学习操作',exact:true}).getByRole('button',{name:'学习设置',exact:true}).click();await expect(p.locator('.student-settings-dialog')).toBeVisible();
  for(const[width,height]of requiredPhoneViewports()){
   await p.setViewportSize({width,height});const settings=p.locator('.student-settings-dialog'),box=await settings.boundingBox();
   expect(box.x).toBeGreaterThanOrEqual(8);expect(box.y).toBeGreaterThanOrEqual(8);expect(box.x+box.width).toBeLessThanOrEqual(width-8);expect(box.y+box.height).toBeLessThanOrEqual(height-8);
   await expect(p.locator('.student-settings-close')).toBeInViewport({ratio:1});await p.screenshot({path:info.outputPath('settings-'+width+'.png')});
  }
  await p.setViewportSize({width:375,height:667});await p.locator('.student-settings-close').click();await expect(more).toBeFocused();
  expect(await saved()).toEqual(before);await p.reload();await require('../support/completion-layout').courseReadyForAssertions(p);await expect(retry).toBeVisible();expect(await saved()).toEqual(before);
  await p.locator('.learning-milestones').getByRole('link',{name:'语法',exact:true}).click();await expect(p.locator('.stage-trans')).toHaveClass(/practice-screen-stage/);expect(await saved()).toEqual(before);
  await p.goBack();await expect(retry).toBeVisible();expect(await saved()).toEqual(before);
  await retry.tap();await firstFlow.select(room,{pairs:[['coat','外套'],['dress','连衣裙'],['skirt','半身裙']]});await check.tap();await expect(room.locator('.fb')).toHaveText('答对了！');
  await p.screenshot({path:info.outputPath('retry-correct-375.png')});
  await p.goto(base+'unit1-2/#learn/exam');const exam=p.locator('.stage-exam'),hint=exam.getByRole('button',{name:'给点线索',exact:true}),row=exam.getByRole('group',{name:'作答操作',exact:true});
  const initial=await row.boundingBox();await hint.tap();await expect(exam.locator('.practice-hint')).toBeVisible();expect(Math.abs((await row.boundingBox()).y-initial.y)).toBeLessThanOrEqual(1);
  await exam.getByRole('button',{name:'收起线索',exact:true}).tap();await expect(exam.locator('.practice-hint')).not.toBeVisible();await expect(hint).toHaveAttribute('aria-expanded','false');await hint.tap();await expect(exam.locator('.practice-hint')).toBeVisible();
  expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual([]);
 }finally{await student.context.close();}
});

test('街角场景的整个人物按钮可触摸，归还手提包不被对白遮挡',async({page,browser},info)=>{
 test.setTimeout(60000);await adminLogin(page,base);const account=await createStudent(page,'场景触摸验收','小禾',[/Lesson 1–2 /]),student=await studentLogin(browser,account,base,{viewport:{width:375,height:667},hasTouch:true}),p=student.page;
 try{
  await firstFlow.activity(p,'1-2','manners',{base:base.slice(0,-1),capture:async(room,index,phase)=>{
   if(index!==3)return;
   const target=room.getByRole('button',{name:'女士',exact:true});
   if(phase==='blank'){
    for(const[width,height]of [[320,568],...requiredPhoneViewports()]){await p.setViewportSize({width,height});await expect(p.locator('body')).toHaveAttribute('data-practice-viewport',width+'x'+height);await expect(target).toBeInViewport({ratio:1});expect(await target.evaluate(el=>{const b=el.getBoundingClientRect(),hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return hit===el||el.contains(hit);})).toBe(true);}
    await p.screenshot({path:info.outputPath('street-before-375.png')});await target.tap();await expect(target).toHaveAttribute('aria-pressed','true');
   }else{
    const bag=room.locator('.quest-person-target[data-person="woman"] .quest-handbag');await expect(bag).toBeVisible();
    await bag.evaluate(el=>Promise.allSettled(el.getAnimations().map(animation=>animation.finished)));
    for(const[width,height]of requiredPhoneViewports()){
     await p.setViewportSize({width,height});await expect(p.locator('body')).toHaveAttribute('data-practice-viewport',width+'x'+height);
     const boxes=await bag.evaluate(img=>{const target=img.closest('.quest-person-target'),b=img.getBoundingClientRect(),t=target.getBoundingClientRect(),label=target.querySelector(':scope>span').getBoundingClientRect(),actor=target.querySelector('.quest-portrait').getBoundingClientRect();return {left:b.left,right:b.right,bottom:b.bottom,targetLeft:t.left,targetRight:t.right,labelTop:label.top,ratio:b.width/actor.height};});
     expect(boxes.left).toBeGreaterThanOrEqual(boxes.targetLeft);expect(boxes.right).toBeLessThanOrEqual(boxes.targetRight);expect(boxes.bottom).toBeLessThanOrEqual(boxes.labelTop);expect(boxes.ratio).toBeLessThanOrEqual(.36);
     await p.screenshot({path:info.outputPath('street-after-'+width+'.png')});
    }
   }
  }});await expect(p.locator('#starCount')).toHaveText('1');
 }finally{await student.context.close();}
});
