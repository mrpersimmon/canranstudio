'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});
async function open(page,browser,device,label){
 await adminLogin(page,base);const account=await createStudent(page,label,'小禾',[/Lesson 1–2 /]);
 return studentLogin(browser,account,base,contextOptions(device));
}
async function answer(room,index){await flow.select(room,flow.ANSWERS['1-2'].exam[index]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');}

for(const device of devices)test(`${device.name}：综合挑战图片题切换每个可见帧保持完整与不透明`,async({page,browser},info)=>{
 test.setTimeout(120000);const s=await open(page,browser,device,'图片切题-'+device.id),p=s.page;
 try{
  await p.addInitScript(()=>{
   window.questionFrames=[];window.captureQuestionFrames=false;
   const sample=()=>{
    if(window.captureQuestionFrames){
     const room=document.querySelector('.learning-surface.stage-exam'),content=room?.querySelector('.practice-content');
     if(content){const b=content.getBoundingClientRect();window.questionFrames.push({question:content.querySelector('.progress-copy')?.textContent,opacity:Number(getComputedStyle(content).opacity),box:{x:b.x,y:b.y,width:b.width,height:b.height},images:[...content.querySelectorAll('img')].filter(i=>i.getClientRects().length).map(i=>({source:i.getAttribute('src'),ready:i.complete&&i.naturalWidth>0}))});}
    }
    requestAnimationFrame(sample);
   };requestAnimationFrame(sample);
  });
  await p.goto(base+'unit1-2/#learn/exam');await courseReadyForAssertions(p);const room=p.locator('.stage-exam');
  for(let i=0;i<5;i++){await answer(room,i);if(i<4)await room.getByRole('button',{name:'下一题',exact:true}).click();}
  await p.screenshot({path:info.outputPath('question-5.png'),scale:'css'});
  await p.evaluate(()=>{window.questionFrames=[];window.captureQuestionFrames=true;});
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  await expect.poll(()=>p.evaluate(()=>window.questionFrames.filter(f=>f.question==='第 6 / 10 题').length)).toBeGreaterThanOrEqual(16);
  await p.evaluate(()=>window.captureQuestionFrames=false);
  const frames=await p.evaluate(()=>window.questionFrames);await fs.writeFile(info.outputPath('frames-5-6.json'),JSON.stringify(frames,null,2));
  await p.screenshot({path:info.outputPath('question-6.png'),scale:'css'});
  const visible=frames.filter(f=>f.question==='第 6 / 10 题');expect(visible.length).toBeGreaterThan(0);
  expect(visible.filter(f=>f.opacity<.999),'换题不应再次把整张题卡淡成背景色').toEqual([]);
  expect(visible.flatMap(f=>f.images.filter(i=>!i.ready)),'新题可见时图片必须可绘制').toEqual([]);
  const last=visible.at(-1).box;expect(visible.filter(f=>Math.abs(f.box.height-last.height)>1||Math.abs(f.box.y-last.y)>1),'新题不能先显示旧尺寸再重排').toEqual([]);
  expect(visible.every(f=>f.images.length===3)).toBe(true);
  const capture=async(label,name,button)=>{
   await p.evaluate(()=>{window.questionFrames=[];window.captureQuestionFrames=true;});await button.click();
   await expect.poll(()=>p.evaluate(label=>window.questionFrames.filter(f=>f.question===label).length,label)).toBeGreaterThanOrEqual(16);
   await p.evaluate(()=>window.captureQuestionFrames=false);const frames=await p.evaluate(label=>window.questionFrames.filter(f=>f.question===label),label);
   await fs.writeFile(info.outputPath(name+'.json'),JSON.stringify(frames,null,2));
   expect(frames.every(f=>f.opacity>=.999&&f.images.length===3&&f.images.every(i=>i.ready))).toBe(true);
   const end=frames.at(-1).box;expect(frames.every(f=>Math.abs(f.box.height-end.height)<=1&&Math.abs(f.box.y-end.y)<=1)).toBe(true);
  };
  await answer(room,5);await room.getByRole('button',{name:'下一题',exact:true}).click();await answer(room,6);
  await capture('第 8 / 10 题','frames-7-8',room.getByRole('button',{name:'下一题',exact:true}));
  const before=await notebook(p);await room.getByRole('button',{name:'上一题',exact:true}).click();
  await capture('回看 6 / 10','frames-review-7-6',room.getByRole('button',{name:'上一题',exact:true}));expect(await notebook(p)).toEqual(before);
 }finally{await s.context.close();}
});

const notebook=p=>p.evaluate(()=>{const n=JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1'));return {groups:n.groups,records:n.records};});
for(const device of devices)test(`${device.name}：阶段导航替代下拉且不改作答与完成事实`,async({page,browser},info)=>{
 const s=await open(page,browser,device,'阶段导航-'+device.id),p=s.page;
 try{
  await p.goto(base+'unit1-2/#learn/trans');await courseReadyForAssertions(p);
  await p.locator('.stage-trans').getByRole('button',{name:'This is your book.',exact:true}).click();const saved=await notebook(p);
  await expect(p.getByRole('combobox',{name:'切换学习关卡'})).toHaveCount(0);
  const milestones=p.locator('.learning-milestones');await expect(milestones.getByRole('link')).toHaveCount(5);
  for(const[label,stage]of [['词汇','words'],['故事','text'],['语法','trans'],['应用','manners'],['挑战','exam']]){
   const link=milestones.getByRole('link',{name:label,exact:true});await expect(link).toBeInViewport({ratio:1});const box=await link.boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
   await link.tap();await expect(p.locator('.stage-'+stage)).toHaveClass(/learning-surface/);await expect(link).toHaveAttribute('aria-current','step');expect(await notebook(p)).toEqual(saved);
  }
  await milestones.getByRole('link',{name:'语法',exact:true}).press('Enter');await expect(p.locator('.stage-trans').getByRole('button',{name:'This is your book.',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(milestones.locator('.is-complete')).toHaveCount(0);
  await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'我的纪念卡',exact:true}).click();await expect(p.locator('.stage-certificate')).toHaveClass(/learning-surface/);expect(await notebook(p)).toEqual(saved);
  await p.screenshot({path:info.outputPath('stage-navigation.png'),scale:'css'});
 }finally{await s.context.close();}
});

for(const device of devices)test(`${device.name}：十题结算按题数归类，重复错答与奖星仍按原记录`,async({page,browser},info)=>{
 test.setTimeout(120000);const s=await open(page,browser,device,'题数统计-'+device.id),p=s.page;
 try{
  await p.goto(base+'unit1-2/#learn/exam');await courseReadyForAssertions(p);const room=p.locator('.stage-exam');
  for(let i=0;i<10;i++){
   if(i===0||i===2){
    await flow.select(room,{fills:i===0?['Pardon?','Yes, it is.']:['我的','手提包']});await room.getByRole('button',{name:'检查答案',exact:true}).click();
    await expect(room.locator('.fb')).toHaveText('答错了，再试试。');await room.getByRole('button',{name:'再试一次',exact:true}).click();
    if(i===0){await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
    await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:i===0?'Yes?':'你的',exact:true}).click();
    await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
   }else await answer(room,i);
   await room.getByRole('button',{name:i===9?'完成挑战':'下一题',exact:true}).click();
  }
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  await expect.soft(room.locator('.completion-number')).toHaveText(['8','8','2']);
  await expect.soft(room.locator('.completion-stat-label')).toHaveText(['连续答对','首答正确','订正完成']);
  await expect.soft(room.locator('.completion-unit')).toHaveText(['次','题','题']);
  for(const icon of await room.locator('.completion-stat-value img').all())await expect.soft(icon).toBeVisible();
  await expect.soft(room.getByText('下次再练',{exact:true})).toHaveCount(0);
  await expect(room.getByRole('button',{name:'查看纪念卡',exact:true})).toBeInViewport({ratio:1});await expect(p.locator('#starCount')).toHaveText('0');
  const saved=await notebook(p),round=Object.values(saved.groups).find(g=>g.signature?.includes('exam-attention'));
  expect(round.states.length).toBe(10);expect(round.states.reduce((n,x)=>n+x.attempts,0)).toBe(13);expect(round.states.filter(x=>x.firstCorrect).length).toBe(8);
  await p.screenshot({path:info.outputPath('question-count-result.png'),scale:'css'});
  await p.getByRole('button',{name:'更多学习操作'}).click();await p.getByRole('button',{name:'学习记录',exact:true}).click();await p.locator('.learning-record-group[data-activity="exam"]').getByText('本轮详情',{exact:true}).click();
  await expect(p.locator('#unitNotebook')).toContainText('连续答对 8 次 · 本次答对 10 次 · 本次答错 3 次');await p.locator('#unitNotebook').getByRole('button',{name:'关闭',exact:true}).click();expect(await notebook(p)).toEqual(saved);
 }finally{await s.context.close();}
});
