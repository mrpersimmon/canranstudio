'use strict';
const { test, expect } = require('@playwright/test');
const { EXAM, selectAnswer } = require('../support/unit11-12-exam');
const { isFeedbackAudio } = require('../support/course-resource-urls');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('11–12 十题完成认领表达链，所有声音失败、错答与末题刷新不代答', async ({ page }) => {
 test.setTimeout(60000); const voices = [], errors = [];
 page.on('pageerror', error => errors.push(error.message));
 await page.route(/\.(mp3|wav|ogg)(\?|$)/, route => { if (!isFeedbackAudio(route.request().url())) voices.push(route.request().url()); return route.abort(); });
 await page.goto('/unit11-12/#learn/exam'); const room = page.locator('.stage-exam');
 await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '10');
 for (const [i, question] of EXAM.entries()) {
  await expect(room.locator('.claim-task-heading')).toContainText(question.prompt);
  const check = room.getByRole('button', { name: '检查答案', exact: true }); await expect(check).toBeDisabled();
  await expect(room.locator('.claim-task-result')).toBeEmpty();
  if (i === 0) {
   await selectAnswer(room, question.wrong); await check.click();
   await expect(room.getByRole('status')).toHaveText('再看看，试一次。'); await expect(room.locator('.claim-task-result')).toBeEmpty();
   await expect(room.locator('.practice-options .correct,.practice-options .good')).toHaveCount(0);
   await expect(room.getByRole('button', { name: '下一题', exact: true })).toHaveCount(0);
   await room.getByRole('button', { name: '再试一次', exact: true }).click();
  }
  if (i === 4) await room.getByRole('button', { name: '给点线索', exact: true }).click();
  if (i >= 7) { await page.reload(); await expect(check).toBeDisabled(); await expect(room.getByRole('status')).toBeEmpty(); await expect(room.locator('.practice-options button[aria-pressed="true"]')).toHaveCount(0); }
  await selectAnswer(room, question.answer); await expect(room.locator('.claim-task-result')).toBeEmpty(); await check.click();
  await expect(room.getByRole('status')).toHaveText('答对了！'); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
  if (i === 1) await expect(room.locator('.claim-task-result')).toHaveText('下一步：请 Tim 确认');
  await room.getByRole('button', { name: i === 9 ? '查看本次记录' : '下一题', exact: true }).click();
 }
 await expect(room).toContainText('首次独立答对 8 / 10'); await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');
 await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
 await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
 await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
 expect(voices).toEqual([]); expect(errors).toEqual([]);
});

for (const width of [320,390,768,1280]) test(`${width} 物主四选项两行两列，挑战长对白、词块和结束操作完整稳定`, async ({ page }) => {
 test.setTimeout(60000); await page.setViewportSize({width,height:844});
 await page.goto('/lesson/unit11-12/#learn/owner'); const owner=page.locator('.stage-owner');
 await expect(owner.locator('.practice-options>.opt-btn')).toHaveCount(4);
 const choices=await owner.locator('.practice-options>.opt-btn').all(), boxes=[];
 for (const choice of choices) boxes.push(await choice.boundingBox());
 expect(boxes).toHaveLength(4);
 expect(boxes[1].y).toBeCloseTo(boxes[0].y,0); expect(boxes[2].y).toBeGreaterThan(boxes[0].y);
 expect(boxes[3].y).toBeCloseTo(boxes[2].y,0); expect(boxes[2].x).toBeCloseTo(boxes[0].x,0);
 for(const box of boxes){expect(box.width).toBeCloseTo(boxes[0].width,0);expect(box.height).toBeGreaterThanOrEqual(44);}
 await owner.screenshot({path:`output/playwright/unit11-12-exam/owner-${width}.png`});
 await page.goto('/lesson/unit11-12/#learn/exam'); const room=page.locator('.stage-exam');
 for(const [i,question] of EXAM.entries()){
  await expect(room.locator('.claim-task-heading')).toContainText(question.prompt);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const control of await room.locator('.practice-options button').all()){
   expect(await control.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);
   expect((await control.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  if(i===3)await expect(room.locator('.claim-evidence img')).toHaveAttribute('src',/handbag\.svg/);
  if(i===4)await expect(room.locator('.claim-evidence img')).toHaveAttribute('src',/blue-shirt\.svg/);
  if(i===5)await expect(room.locator('.claim-evidence img')).toHaveAttribute('src',/suit\.svg/);
  const actions=room.getByRole('group',{name:'作答操作',exact:true}),position=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await position();
  if(i===4){const hint=room.getByRole('button',{name:'给点线索',exact:true}),h=await hint.boundingBox(),c=await room.getByRole('button',{name:'检查答案',exact:true}).boundingBox();expect(h.x+h.width).toBeLessThan(c.x);await hint.click();expect(await position()).toBeCloseTo(before,0);}
  await selectAnswer(room,question.answer);expect(await position()).toBeCloseTo(before,0);
  if(Array.isArray(question.answer))expect(await room.getByRole('group',{name:'已选词块',exact:true}).evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  if(i>=7)await room.screenshot({path:`output/playwright/unit11-12-exam/q${i+1}-${width}.png`});
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');
  expect(await position()).toBeCloseTo(before,0);expect(await room.locator('.claim-task-result').evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
  await room.getByRole('button',{name:i===9?'查看本次记录':'下一题',exact:true}).click();
 }
 const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);
 for(const control of await finish.getByRole('button').all()){const b=await control.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width);expect(b.height).toBeGreaterThanOrEqual(44);}
 await room.screenshot({path:`output/playwright/unit11-12-exam/finish-${width}.png`});
});
