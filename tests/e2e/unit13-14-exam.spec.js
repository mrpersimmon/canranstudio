'use strict';
const{test,expect}=require('@playwright/test');
const{EXAM,selectAnswer}=require('../support/unit13-14-exam');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('13–14 十题综合覆盖，声音不可用、重试与提示不代答，末三题刷新仍需本人完成',async({page})=>{
 test.setTimeout(60000);await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());await page.goto('/unit13-14/#learn/exam');const room=page.locator('.stage-exam');
 for(let i=0;i<EXAM.length;i++){
  if(i>=7)await page.reload();await expect(room).toContainText(`第 ${i+1} / 10 题`);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(i===0){await selectAnswer(room,EXAM[i].wrong);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.dress-task-result')).toBeEmpty();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  if(i===1)await room.getByRole('button',{name:'给点线索',exact:true}).click();
  await selectAnswer(room,EXAM[i].answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toContainText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i===9?'查看本次记录':'下一题',exact:true}).click();
 }
 await expect(room).toContainText('首次独立答对 8 / 10');await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
});

for(const width of [320,390,768,1280])test(`${width} 挑战十题选项与五词块完整，灯泡及结果不移动操作`,async({page})=>{
 test.setTimeout(60000);await page.setViewportSize({width,height:844});await page.goto('/lesson/unit13-14/#learn/exam');const room=page.locator('.stage-exam');
 for(const[i,question]of EXAM.entries()){
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const actions=room.getByRole('group',{name:'作答操作',exact:true}),position=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await position();
  for(const option of await room.locator('.practice-options button').all()){expect(await option.evaluate(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1)).toBe(true);expect((await option.boundingBox()).height).toBeGreaterThanOrEqual(44);}
  if(i===4){const hint=room.getByRole('button',{name:'给点线索',exact:true}),h=await hint.boundingBox(),c=await room.getByRole('button',{name:'检查答案',exact:true}).boundingBox();expect(h.x+h.width).toBeLessThan(c.x);await hint.click();expect(await position()).toBeCloseTo(before,0);}
  await selectAnswer(room,question.answer);expect(await position()).toBeCloseTo(before,0);
  if(Array.isArray(question.answer))expect(await room.getByRole('group',{name:'已选词块',exact:true}).evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  if([4,5,7,8].includes(i))await room.screenshot({path:`output/playwright/unit13-14/exam-${i+1}-${width}.png`});
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');expect(await position()).toBeCloseTo(before,0);expect(await room.locator('.dress-task-result').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  await room.getByRole('button',{name:i===9?'查看本次记录':'下一题',exact:true}).click();
 }
 const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);
 for(const option of await finish.getByRole('button').all()){const b=await option.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width);expect(b.height).toBeGreaterThanOrEqual(44);}
 await room.screenshot({path:`output/playwright/unit13-14/challenge-finish-${width}.png`});
});
