'use strict';
const {test,expect}=require('@playwright/test');
const {EXAMS,selectAnswer}=require('../support/units17-30-exam');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function capture(page,room,path){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path,fullPage:true,clip:await room.boundingBox()});}
for(const[pair,answers]of Object.entries(EXAMS))for(const width of [320,390,768,1280])test(`${pair} ${width} 综合练习逐题独立作答，词块和长选项完整，按钮稳定`,async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:844});await page.goto(`/lesson/unit${pair}/#learn/exam`);const room=page.locator('.stage-exam');
 for(let i=0;i<answers.length;i++){
  if(width===390&&i>=answers.length-3)await page.reload();
  await expect(room).toContainText(`第 ${i+1} / ${answers.length} 题`);const check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(check).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));await expect(room.locator('.practice-options [aria-pressed=true]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const actions=room.getByRole('group',{name:'作答操作',exact:true});const top=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await top();
  for(const option of await room.locator('.practice-options button').all()){expect(await option.evaluate(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1)).toBe(true);expect((await option.boundingBox()).height).toBeGreaterThanOrEqual(44);}
  if(i===(pair==='21-22'?1:2)){const hint=room.getByRole('button',{name:'给点线索',exact:true}),h=await hint.boundingBox(),c=await check.boundingBox();expect(h.x+h.width).toBeLessThan(c.x);await hint.click();expect(await top()).toBeCloseTo(before,0);}
  if(i===3&&width===390){const wrong=room.locator('.practice-options button').filter({hasNotText:answers[i]}).first();await wrong.click();await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);expect(await top()).toBeCloseTo(before,0);await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await selectAnswer(room,answers[i]);expect(await top()).toBeCloseTo(before,0);
  if(Array.isArray(answers[i]))expect(await room.getByRole('group',{name:'已选词块',exact:true}).evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  if(width===390&&Array.isArray(answers[i])){await page.reload();await expect(room.getByRole('status')).toBeEmpty();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));}
  if([390,1280].includes(width)&&[0,2,answers.length-1].includes(i)||Array.isArray(answers[i]))await capture(page,room,`output/playwright/unit${pair}/review-exam-${i+1}-${width}.png`);
  await check.click();await expect(room.getByRole('status')).toHaveText('答对了！');expect(await top()).toBeCloseTo(before,0);await room.getByRole('button',{name:i===answers.length-1?'查看本次记录':'下一题',exact:true}).click();
 }
 await expect(room).toContainText(`首次独立答对 ${answers.length-(width===390?2:1)} / ${answers.length}`);const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);
 for(const b of await finish.getByRole('button').all()){const r=await b.boundingBox();expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);expect(r.height).toBeGreaterThanOrEqual(44);}
 await capture(page,room,`output/playwright/unit${pair}/review-finish-${width}.png`);
});

test('29–30 整理题的选择、灯泡和错答不执行动作，检查正确后才呈现结果',async({page})=>{
 await page.goto('/unit29-30/#learn/exam');const room=page.locator('.stage-exam');for(const answer of EXAMS['29-30'].slice(0,6)){await selectAnswer(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 const view=room.locator('.classroom-illustration');await expect(view).toHaveAttribute('aria-label','窗户已打开，衣服还散在床上');
 await room.getByRole('button',{name:'给点线索',exact:true}).click();await room.getByRole('button',{name:'Put on these clothes.',exact:true}).click();await expect(view.locator('[data-part=clothes]')).toBeVisible();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(view.locator('[data-part=clothes]')).toBeVisible();await expect(room.locator('.classroom-task-result')).toBeEmpty();
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await selectAnswer(room,EXAMS['29-30'][6]);await expect(view.locator('[data-part=clothes]')).toBeVisible();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(view.locator('[data-part=clothes]')).toBeHidden();await expect(view.locator('[data-part=clothes-put]')).toBeVisible();await page.reload();await expect(view.locator('[data-part=clothes-put]')).toBeVisible();
});
