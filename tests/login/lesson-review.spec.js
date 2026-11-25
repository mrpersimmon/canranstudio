'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseReadyForAssertions}=require('../support/completion-layout');
const flow=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});
async function start(page,browser){
 await adminLogin(page,base);const account=await createStudent(page,'题目回看验收','小禾',[/Lesson 1–2 /]);
 const student=await studentLogin(browser,account,base,{viewport:{width:375,height:667},hasTouch:true});
 await student.page.goto(base+'unit1-2/#learn/trans');await courseReadyForAssertions(student.page);return student;
}
const snapshot=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1')));
async function answer(room,value){await flow.select(room,value);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');}

test('回看不移动作答位置、不改草稿和记录，当前题仍保留订正次数',async({page,browser})=>{
 test.setTimeout(90000);const s=await start(page,browser),p=s.page,room=p.locator('.stage-trans');
 try{
  await expect(room.getByRole('button',{name:'上一题',exact:true})).toBeDisabled();
  await answer(room,flow.ANSWERS['1-2'].trans[0]);await room.getByRole('button',{name:'下一题',exact:true}).click();
  const selected=room.locator('.practice-options .opt-btn').first();await selected.click();const draftLabel=await selected.getAttribute('aria-pressed');expect(draftLabel).toBe('true');
  const before=await snapshot(p);await room.getByRole('button',{name:'上一题',exact:true}).click();
  await expect(room.locator('.progress-copy')).toHaveText('回看 1 / 12');await expect(room.locator('.fb')).toHaveText('首答正确');
  expect(await room.locator('.practice-options button').evaluateAll(items=>items.every(item=>item.disabled))).toBe(true);
  await room.locator('.practice-options button').first().dispatchEvent('click');
  const during=await snapshot(p);expect(during).toEqual(before);
  await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(room.locator('.progress-copy')).toHaveText('第 2 / 12 题');
  expect((await snapshot(p)).groups).toEqual(before.groups);expect((await snapshot(p)).records).toEqual(before.records);
  // A deliberately wrong current answer still records the error before correction.
  const wrong=room.locator('.practice-options button').filter({hasNotText:'这是不是你的铅笔。'}).first();await wrong.click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await answer(room,flow.ANSWERS['1-2'].trans[1]);await room.getByRole('button',{name:'下一题',exact:true}).click();await room.getByRole('button',{name:'上一题',exact:true}).click();await expect(room.locator('.fb')).toHaveText('订正后答对');
  const corrected=await snapshot(p),group=Object.values(corrected.groups).find(g=>g.signature.includes('u12-five-zones-v1-reply-pairs'));expect(group.states[1].attempts).toBe(2);expect(group.states[1].firstCorrect).toBe(false);
  await p.reload();await courseReadyForAssertions(p);await expect(room.locator('.progress-copy')).toHaveText('第 3 / 12 题');expect((await snapshot(p)).records).toEqual(corrected.records);
 }finally{await s.context.close();}
});

test('情境属于题干，答后讲解按需打开，回看配对词块填空不改答案和反馈位置',async({page,browser},info)=>{
 test.setTimeout(180000);const s=await start(page,browser),p=s.page,room=p.locator('.stage-trans');
 try{
  await expect(p.getByRole('list',{name:'学习进度：已学 0 / 5 个阶段',exact:true})).toBeVisible();
  await expect(p.locator('.learning-milestones .is-current')).toHaveText('3语法');await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(0);
  for(let i=0;i<flow.ANSWERS['1-2'].trans.length;i++){
   if(i===8){await expect(room.locator('.learning-question-heading .practice-context')).toHaveText('手表是你的，你也准备好了。');await p.screenshot({path:info.outputPath('context-in-question-375.png')});}
   const initial=await room.locator('.practice-submit-row').boundingBox();await answer(room,flow.ANSWERS['1-2'].trans[i]);
   await expect(room.locator('.grammar-rule')).not.toBeVisible();const explanation=room.getByRole('button',{name:'讲解',exact:true});
   // The final two independent-transfer questions have no authored rule.
   if(i<10)await expect(explanation).toBeEnabled();else await expect(explanation).toHaveCount(0);
   expect((await room.locator('.practice-submit-row').boundingBox()).y).toBe(initial.y);
   if(i===4){
    const before=await snapshot(p);await explanation.click();const dialog=p.getByRole('dialog',{name:'这一题的讲解',exact:true});
    await expect(dialog).toContainText('I 不变，am 放前面');
    for(const [width,height]of [[320,568],[375,667]]){
     await p.setViewportSize({width,height});const box=await dialog.boundingBox();expect(Math.abs(box.x+box.width/2-width/2)).toBeLessThanOrEqual(1);expect(Math.abs(box.y+box.height/2-height/2)).toBeLessThanOrEqual(1);
     expect(box.x).toBeGreaterThanOrEqual(14);expect(box.y).toBeGreaterThanOrEqual(20);await expect(dialog.getByRole('button',{name:'知道了',exact:true})).toBeInViewport({ratio:1});
    }
    await p.screenshot({path:info.outputPath('explanation-375.png')});await dialog.getByRole('button',{name:'知道了',exact:true}).click();await expect(explanation).toBeFocused();expect(await snapshot(p)).toEqual(before);
   }
   await room.getByRole('button',{name:i===11?'完成练习':'下一题',exact:true}).click();
   if([2,3,4,8,9].includes(i)){
    const before=await snapshot(p);await room.getByRole('button',{name:'上一题',exact:true}).click();await expect(room.locator('.progress-copy')).toHaveText(`回看 ${i+1} / 12`);
    expect(await room.locator('.practice-options button').evaluateAll(items=>items.every(item=>item.disabled))).toBe(true);
    await p.setViewportSize({width:320,height:568});await expect(room.getByRole('button',{name:'下一题',exact:true})).toBeInViewport({ratio:1});
    if(i===8)await p.screenshot({path:info.outputPath('review-matching-320.png')});expect(await snapshot(p)).toEqual(before);
    await room.getByRole('button',{name:'回到当前题',exact:true}).click();await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+2} / 12 题`);
    await p.setViewportSize({width:375,height:667});
   }
  }
  await require('../support/reward-dialog').dismissRewardDialog(p);await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(1);
 }finally{await s.context.close();}
});

test('本轮结果回看不重结算不授星，里程碑与重练同步但保留已有星星',async({page,browser},info)=>{
 test.setTimeout(120000);const s=await start(page,browser),p=s.page;
 try{
  await flow.activity(p,'1-2','listen',{base:base.slice(0,-1)});const room=p.locator('.stage-listen');
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  await expect(p.getByRole('list',{name:'学习进度：已学 1 / 5 个阶段',exact:true})).toBeVisible();
  await expect(p.locator('#starCount')).toHaveText('1');
  await expect(p.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','synced');
  const saved=await snapshot(p),awards=(await(await p.request.get(base+'api/awards')).json()).cards,requests=[];
  p.on('request',request=>{if(request.method()==='POST'&&/api\/progress/.test(request.url()))requests.push(request.url());});
  await p.getByRole('button',{name:'更多学习操作',exact:true}).click();await p.getByRole('button',{name:'回看本轮答题',exact:true}).click();
  await expect(room.locator('.progress-copy')).toHaveText('回看 1 / 5');await p.screenshot({path:info.outputPath('review-completed-375.png')});
  for(let i=1;i<5;i++)await room.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(room.locator('.progress-copy')).toHaveText('回看 5 / 5');await room.getByRole('button',{name:'查看本轮结果',exact:true}).click();
  await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await expect(p.getByRole('dialog',{name:/纪念卡结算/})).not.toBeVisible();
  expect(await snapshot(p)).toEqual(saved);expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(awards);expect(requests).toEqual([]);
  await p.getByRole('button',{name:'更多学习操作',exact:true}).click();await p.getByRole('button',{name:'回看本轮答题',exact:true}).click();await p.reload();await courseReadyForAssertions(p);await expect(room.locator('.completion-card')).toBeVisible();expect((await snapshot(p)).groups).toEqual(saved.groups);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await expect(p.getByRole('list',{name:'学习进度：已学 1 / 5 个阶段',exact:true})).toBeVisible();await expect(room.getByRole('button',{name:'上一题',exact:true})).toBeDisabled();
  await expect(p.locator('#starCount')).toHaveText('1');expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(awards);
 }finally{await s.context.close();}
});

test('人物归还场景和故事理解回看只读，回到结果后下一站仍可用',async({page,browser})=>{
 test.setTimeout(120000);const s=await start(page,browser),p=s.page;
 try{
  await flow.story(p,'1-2',base.slice(0,-1));
  for(const id of ['roles','manners']){
   await flow.activity(p,'1-2',id,{base:base.slice(0,-1)});const room=p.locator('.stage-'+id);
   await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');const before=await snapshot(p);
   await p.getByRole('button',{name:'更多学习操作',exact:true}).click();await p.getByRole('button',{name:'回看本轮答题',exact:true}).click();
   if(id==='manners'){
    for(let i=0;i<3;i++)await room.getByRole('button',{name:'下一题',exact:true}).click();
    await expect(room.getByRole('button',{name:'女士',exact:true})).toBeDisabled();await expect(room.locator('.quest-person-target[data-person="woman"] .quest-handbag')).toBeVisible();
   }else expect(await room.locator('.translation-answer button').evaluateAll(items=>items.length>0&&items.every(x=>x.disabled))).toBe(true);
   await p.getByRole('button',{name:'更多学习操作',exact:true}).click();await p.getByRole('button',{name:'返回本轮结果',exact:true}).click();
   await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');expect(await snapshot(p)).toEqual(before);
   await expect.poll(()=>room.evaluate(el=>el.contains(document.activeElement))).toBe(true);
   await room.getByRole('button',{name:/^下一站：/}).click();await expect(p).toHaveURL(id==='roles'?/#learn\/trans$/:/#learn\/exam$/);
  }
 }finally{await s.context.close();}
});
