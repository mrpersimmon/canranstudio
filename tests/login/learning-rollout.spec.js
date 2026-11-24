'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {definition}=require('../../server/progress');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {courseReadyForAssertions}=require('../support/completion-layout');
const {handleRewardDialog,finishRewardPresentation}=require('../support/reward-dialog');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({actionTimeout:8000});
// This suite checks storage and navigation, not curriculum correctness. The
// immutable content contract separately guards every original teaching answer.
async function choose(room,q){
 if(q.type==='scene-find'){
  await room.locator('.scene-find-canvas').getByRole('button',{name:q.spots.find(s=>s.id===q.answer).name,exact:true}).click();
 }else if(q.type==='handoff'){
  const [object,recipient]=JSON.parse(q.answer);
  await room.locator('.handoff-objects').getByRole('button',{name:q.objects.find(item=>item.id===object).name,exact:true}).click();
  await room.locator('.handoff-people').getByRole('button',{name:q.recipients.find(item=>item.id===recipient).name,exact:true}).click();
 }else if(q.type==='match'){
  const order=JSON.parse(q.answer);
  for(let i=0;i<order.length;i++){await room.locator('.match-column:not(.match-meanings) .opt-btn').nth(i).click();await room.locator('.match-meanings [data-pair="'+order[i]+'"]').click();}
 }else if(q.type==='cloze')for(const [i,value]of JSON.parse(q.answer).entries())await room.locator('.cloze-row').nth(i).getByRole('button',{name:value,exact:true}).click();
 else if(q.tokens){
  let prefix='';const used=new Set();
  while(prefix!==q.answer){const at=q.tokens.findIndex((value,i)=>!used.has(i)&&(q.answer===prefix+value||q.answer.startsWith(prefix+value+' ')));if(at<0)throw Error('Missing token '+q.id);await room.locator('.wordbank').getByRole('button',{name:q.tokens[at],exact:true,disabled:false}).first().click();used.add(at);prefix+=q.tokens[at];if(prefix!==q.answer)prefix+=' ';}
 }else await room.locator('.practice-options').getByRole('button',{name:q.answer,exact:true}).click();
}
const saved=p=>p.evaluate(()=>{const n=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));return{groups:n.groups,records:n.records};});
for(const [i,unit]of (process.env.ROLLOUT_UNITS?.split(',')||['unit7-8','unit41-42','unit143-144']).entries())test(unit+' authenticated continuation, readonly review, result and original card',async({page,browser},info)=>{
 test.setTimeout(180000);const device=devices[i%devices.length],u=definition(process.cwd(),unit,base);
  await adminLogin(page,base);const lesson=u.reward.lesson||('Lesson '+unit.slice(4).replace('-','–'));
  const account=await createStudent(page,'全书界面-'+unit,'小禾',[new RegExp(lesson+' ')]),session=await studentLogin(browser,account,base,contextOptions(device)),p=session.page;
 try{
  await handleRewardDialog(p,false);await p.goto(base+unit+'/#learn/exam');await courseReadyForAssertions(p);
  const room=p.locator('.stage-exam');
  for(const [n,q]of u.questions.exam.entries()){
   await choose(room,q);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
   if(n===1){
    const before=await saved(p);await room.getByRole('button',{name:'上一题',exact:true}).click();await expect(room.locator('[data-practice-review]')).toHaveCount(1);expect(await saved(p)).toEqual(before);
    await room.getByRole('button',{name:'回到当前题',exact:true}).click();await p.reload();await courseReadyForAssertions(p);expect(await saved(p)).toEqual(before);
    await p.locator('.learning-milestones a').first().click();await expect(p.locator('.unit-word').first()).toBeVisible();await p.locator('.unit-word').first().click();await expect(p.locator('.unit-word .word-meaning').first()).toBeVisible();
    if(await p.locator('.stage-words[data-word-deck]').count()){
     while(!await p.locator('.unit-word[data-word-kind="context"]').count())await p.locator('.word-controls button').last().click();
     await p.locator('.unit-word[data-word-kind="context"]').first().click();await p.reload();await courseReadyForAssertions(p);
     await expect(p.locator('.unit-word[data-word-kind="context"]').first()).toBeVisible();expect(await saved(p)).toEqual(before);
    }
    await p.locator('.learning-milestones a').last().click();expect(await saved(p)).toEqual(before);
   }
   await room.getByRole('button',{name:n===u.questions.exam.length-1?/^完成/: '下一题',exact:n!==u.questions.exam.length-1}).click();
  }
  await finishRewardPresentation(p,room);await expect(room.locator('.completion-stat-label')).toHaveText(['连续答对','首答正确','订正完成']);
  await expect(room.locator('.completion-number')).toHaveText([String(u.questions.exam.length),String(u.questions.exam.length),'0']);
  await expect(p.locator('.learning-milestones .is-complete')).toHaveCount(1);
  const before=await saved(p);await room.getByRole('button',{name:'查看纪念卡',exact:true}).click();
  await expect(p.locator('.stage-certificate .story-award-paper')).toBeVisible();await expect(p.getByRole('link',{name:'返回首页',exact:true})).toBeVisible();
  const card=await p.locator('.stage-certificate .card-design-plane').boundingBox();expect(card.width/card.height).toBeCloseTo(41/22,1);
  expect(await saved(p)).toEqual(before);await p.screenshot({path:info.outputPath(unit+'-card.png'),scale:'css'});
 }finally{await session.context.close();}
});
