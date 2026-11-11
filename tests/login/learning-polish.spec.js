'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});
async function start(page,browser,device,label){await adminLogin(page,base);const account=await createStudent(page,label,'小禾',[/Lesson 1–2 /]);return studentLogin(browser,account,base,contextOptions(device));}
const snapshot=p=>p.evaluate(()=>{const n=JSON.parse(localStorage.getItem(CanranCore.unit12.progress.learningKey));return {groups:n.groups,records:n.records};});
async function answer(room,value){await flow.select(room,value);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');}

for(const device of devices)test(`${device.name}：课文结束、灯泡讲解与对话行完整对齐`,async({page,browser},info)=>{
 test.setTimeout(120000);const s=await start(page,browser,device,'排列复查-'+device.id),p=s.page;
 try{
  await flow.story(p,'1-2',base.slice(0,-1));await p.goBack();const story=p.locator('.stage-text');
  await expect(story.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();
  const result=await story.evaluate(el=>{const finish=el.querySelector(':scope>.practice-finish'),r=x=>x.getBoundingClientRect().toJSON();return {count:r(el.querySelector('.dialogue-status')),finish:r(finish),children:[...finish.children].map(r),buttons:[...finish.querySelectorAll('button')].map(r)};});
  await fs.writeFile(info.outputPath('story-footer.json'),JSON.stringify(result,null,2));await p.screenshot({path:info.outputPath('story-footer.png'),scale:'css'});
  expect.soft(result.children.every(b=>b.top>=result.finish.top-1&&b.bottom<=result.finish.bottom+1),'完成区的文字不能溢出到阅读计数上').toBe(true);
  expect.soft(Math.abs(result.buttons[0].y-result.buttons[1].y),'两个推进按钮应齐平').toBeLessThanOrEqual(1);
  expect.soft(result.count.bottom).toBeLessThanOrEqual(result.finish.top);
  await p.locator('.learning-milestones').getByRole('link',{name:'语法',exact:true}).click();const grammar=p.locator('.stage-trans');
  for(let i=0;i<6;i++){await answer(grammar,flow.ANSWERS['1-2'].trans[i]);if(i<5)await grammar.getByRole('button',{name:'下一题',exact:true}).click();}
  const previous=grammar.getByRole('button',{name:'上一题',exact:true}),help=grammar.getByRole('button',{name:'讲解',exact:true}),next=grammar.getByRole('button',{name:'下一题',exact:true});
  const [a,b,c]=await Promise.all([previous.boundingBox(),help.boundingBox(),next.boundingBox()]);
  expect.soft(b.x).toBeGreaterThanOrEqual(a.x+a.width);expect.soft(b.x+b.width).toBeLessThanOrEqual(c.x);expect.soft(b.y).toBeCloseTo(a.y,0);expect.soft(b.height).toBeGreaterThanOrEqual(44);
  await expect.soft(help.locator('img')).toHaveAttribute('src',/\/hint\.svg$/);
  await p.screenshot({path:info.outputPath('explanation.png'),scale:'css'});
  const before=await snapshot(p);await help.click();await expect(p.getByRole('dialog',{name:'这一题的讲解'})).toBeVisible();await p.getByRole('button',{name:'知道了',exact:true}).click();await expect(help).toBeFocused();expect(await snapshot(p)).toEqual(before);
  await p.locator('.learning-milestones').getByRole('link',{name:'挑战',exact:true}).click();const exam=p.locator('.stage-exam');
  for(let i=0;i<3;i++){await answer(exam,flow.ANSWERS['1-2'].exam[i]);await exam.getByRole('button',{name:'下一题',exact:true}).click();}
  const saved=await snapshot(p);await exam.getByRole('button',{name:'上一题',exact:true}).click();
  const lines=await exam.locator('.task-reading-turn').evaluateAll(rows=>rows.map(row=>{const r=x=>x.getBoundingClientRect().toJSON();return {row:r(row),name:r(row.querySelector('small')),text:r(row.querySelector('span'))};}));
  expect(lines).toHaveLength(2);for(const line of lines){expect.soft(line.name.y).toBeCloseTo(line.text.y,0);expect.soft(line.name.x-line.row.x).toBeGreaterThanOrEqual(6);expect.soft(line.name.x+line.name.width+6).toBeLessThanOrEqual(line.text.x);}
  expect.soft(lines[0].name.x).toBeCloseTo(lines[1].name.x,0);await p.screenshot({path:info.outputPath('reading-rows.png'),scale:'css'});expect(await snapshot(p)).toEqual(saved);
 }finally{await s.context.close();}
});

for(const device of devices)test(`${device.name}：不同题型切换的纸面与操作栏持续稳定`,async({page,browser},info)=>{
 test.setTimeout(120000);const s=await start(page,browser,device,'纸面连续-'+device.id),p=s.page;
 try{
  await p.addInitScript(()=>{window.surfaceFrames=[];window.captureSurfaces=false;const frame=()=>{if(window.captureSurfaces){const el=document.querySelector('.learning-surface'),content=el?.querySelector('.practice-content'),actions=el?.querySelector('.practice-submit-row');const r=x=>x?.getBoundingClientRect().toJSON();window.surfaceFrames.push({paper:r(content),actions:r(actions),question:content?.querySelector('.progress-copy')?.textContent,opacity:content?Number(getComputedStyle(content).opacity):0,visibility:content?getComputedStyle(content).visibility:'missing',scrollX,scrollY});}requestAnimationFrame(frame);};requestAnimationFrame(frame);});
  await p.goto(base+'unit1-2/#learn/exam');await courseReadyForAssertions(p);const room=p.locator('.stage-exam'),positions=[];
  for(let i=0;i<8;i++){
   await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / 10 题`);
   const card=await room.locator('.practice-content').boundingBox(),action=await room.locator('.practice-submit-row').boundingBox();positions.push({question:i+1,card,action});
   expect.soft(await room.locator('.practice-content').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
   await answer(room,flow.ANSWERS['1-2'].exam[i]);
   if(i<7){await p.evaluate(()=>window.captureSurfaces=true);await room.getByRole('button',{name:'下一题',exact:true}).click();await expect.poll(()=>p.evaluate(q=>window.surfaceFrames.filter(f=>f.question===q).length,`第 ${i+2} / 10 题`)).toBeGreaterThanOrEqual(3);await p.evaluate(()=>window.captureSurfaces=false);}
  }
  const frames=await p.evaluate(()=>window.surfaceFrames);await fs.writeFile(info.outputPath('surface-boundaries.json'),JSON.stringify({positions,frames},null,2));
  expect(frames.filter(f=>!f.paper||f.visibility!=='visible'||f.opacity<.999),'不能跳过空白或隐藏帧来判断通过').toEqual([]);
  const first=positions[0];expect(positions.map(x=>({question:x.question,deltaHeight:Math.abs(x.card.height-first.card.height),deltaTop:Math.abs(x.card.y-first.card.y)})).filter(x=>x.deltaHeight>1||x.deltaTop>1),'前后题纸面边界不能忽大忽小或重新居中').toEqual([]);
  expect(frames.every(f=>Math.abs(f.paper.height-first.card.height)<=1&&Math.abs(f.paper.y-first.card.y)<=1&&Math.abs(f.actions.y-first.action.y)<=1)).toBe(true);
 }finally{await s.context.close();}
});
