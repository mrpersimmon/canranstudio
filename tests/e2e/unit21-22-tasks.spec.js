'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function reachContainers(page){
 await page.goto('/unit21-22/#learn/listen');
 const room=page.locator('.stage-listen');
 for(const answer of ['给；递给','这一本书','哪一本书？','空的 / 满的','大的 / 小的','锋利的 / 钝的']){
  await room.getByRole('button',{name:answer,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await room.getByRole('button',{name:'下一题',exact:true}).click();
 }
 return room;
}
async function pair(room,left,right){
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:left,exact:true}).click();
 await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:right,exact:true}).click();
}
test('配对先完整选择再检查，错配和刷新保留原位，修改后才计进度',async({page})=>{
 const room=await reachContainers(page),check=room.getByRole('button',{name:'检查答案',exact:true});
 await expect(room.getByRole('heading',{name:'给容器选择配对',exact:true})).toBeVisible();
 await expect(room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'瓶子',exact:true})).toBeDisabled();
 const labels=await room.getByRole('group',{name:'词义',exact:true}).getByRole('button').evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-label')));
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'box',exact:true}).press('Enter');
 await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'瓶子',exact:true}).press('Enter');await expect(check).toBeDisabled();
 await page.reload();await expect(room.locator('.match-count')).toHaveText('已配 1 / 3 对');await expect(check).toBeDisabled();
 await pair(room,'bottle','盒子；箱子');await pair(room,'tin','罐头盒');
 await expect(room.getByRole('status')).toBeEmpty();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','6');
 await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await expect(room.locator('.is-correct')).toHaveCount(0);
 await room.getByRole('button',{name:'再试一次',exact:true}).click();
 expect(await room.getByRole('group',{name:'词义',exact:true}).getByRole('button').evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-label')))).toEqual(labels);
 await pair(room,'box','盒子；箱子');await expect(check).toBeDisabled();
 await pair(room,'tin','罐头盒');await expect(room.locator('.match-count')).toHaveText('已配 1 / 3 对');await pair(room,'tin','罐头盒');
 await pair(room,'bottle','瓶子');await check.click();
 await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','7');
 await page.getByRole('button',{name:'学习手记',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'学习手记',exact:true})).toContainText('修正后完成');
});
test('原文定位保留完整句子，错选只提示重试，点选不直接判分',async({page})=>{
 await require('../support/unit21-22-flow').completeStory(page);
 await page.goto('/unit21-22/#learn/roles');const room=page.locator('.stage-roles');
 const text=room.getByRole('group',{name:'原文选词',exact:true});
 await expect(text).toContainText('No, not that one. The red one.');
 await text.getByRole('button',{name:'not that one',exact:true}).click();
 await expect(room.getByRole('status')).toBeEmpty();
 await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 await room.getByRole('button',{name:'再试一次',exact:true}).click();
 await text.getByRole('button',{name:'The red one',exact:true}).press('Enter');
 await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');
 await expect(room.getByRole('status')).toHaveText('答对了！');
 await room.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
test('交接先选物再选人，错送不移动；离开、刷新和改选后只交接一件物品',async({page})=>{
 await page.goto('/unit21-22/#learn/exam');const room=page.locator('.stage-exam');
 const objects=room.getByRole('group',{name:'待选物品',exact:true}),people=room.getByRole('group',{name:'接收者',exact:true});
 const check=room.getByRole('button',{name:'检查答案',exact:true});
 await expect(objects).toBeVisible();
 await objects.getByRole('button',{name:'小瓶子',exact:true}).click();await expect(check).toBeDisabled();
 await expect(room.getByRole('button',{name:'暂停，稍后继续',exact:true})).toHaveCount(0);await page.reload();
 await expect(room.getByRole('button',{name:'继续挑战',exact:true})).toHaveCount(0);
 await expect(objects.getByRole('button',{name:'小瓶子',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(check).toBeDisabled();
 await people.getByRole('button',{name:'男士',exact:true}).click();
 await expect(room.getByRole('img',{name:'小瓶子',exact:true})).toBeVisible();
 await expect(room.locator('.handoff-arrived')).toHaveCount(0);await check.click();
 await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await expect(room.locator('.handoff-arrived')).toHaveCount(0);await page.reload();
 await room.getByRole('button',{name:'再试一次',exact:true}).click();
 await people.getByRole('button',{name:'简（Jane）',exact:true}).press('Enter');
 await expect(room.locator('.handoff-arrived')).toHaveCount(0);
 await check.press('Enter');await expect(room.getByRole('status')).toHaveText('答对了！');
 await expect(room.locator('.handoff-arrived')).toHaveCount(1);
 await expect(people.getByRole('button',{name:'简（Jane）',exact:true}).getByRole('img',{name:'已送给简（Jane）的小瓶子',exact:true})).toBeVisible();
 await expect(objects.getByRole('img',{name:'小瓶子',exact:true})).toHaveCount(0);
 await page.reload();await expect(room.locator('.handoff-arrived')).toHaveCount(1);
 await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
 await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(check).toBeDisabled();
});
for(const width of [320,390,768,1280])test(width+' 新题型布局、稳定操作与实际画面证据',async({page})=>{
 test.setTimeout(45000);await page.setViewportSize({width,height:820});
 const dir='output/test-unit21-22-tasks';
 async function inspect(room,name){
  await page.evaluate(()=>document.fonts.ready);
  await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const b of await room.locator('.task-input button').all()){
   const r=await b.boundingBox();expect(r.height).toBeGreaterThanOrEqual(44);expect(r.x).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);
   expect(await b.evaluate(el=>el.scrollWidth<=el.clientWidth+2&&el.scrollHeight<=el.clientHeight+2)).toBe(true);
  }
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:dir+'/'+name+'-'+width+'.png',fullPage:true,clip:await room.boundingBox()});
 }
 let room=await reachContainers(page);await inspect(room,'matching-blank');
 await pair(room,'box','瓶子');await pair(room,'bottle','盒子；箱子');await pair(room,'tin','罐头盒');await room.getByRole('button',{name:'检查答案',exact:true}).click();await inspect(room,'matching-wrong');
 await page.goto('/unit21-22/#learn/exam');room=page.locator('.stage-exam');await inspect(room,'handoff-blank');
 const actions=room.getByRole('group',{name:'作答操作',exact:true}),top=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await top();
 await room.getByRole('button',{name:'给点线索',exact:true}).click();expect(await top()).toBeCloseTo(before,0);
 await room.getByRole('group',{name:'待选物品',exact:true}).getByRole('button',{name:'大瓶子',exact:true}).click();await inspect(room,'handoff-partial');
 await room.getByRole('group',{name:'接收者',exact:true}).getByRole('button',{name:'简（Jane）',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await expect(room.getByRole('status')).toHaveText('再看看，试一次。');expect(await top()).toBeCloseTo(before,0);await inspect(room,'handoff-wrong');
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('group',{name:'待选物品',exact:true}).getByRole('button',{name:'小瓶子',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await expect(room.getByRole('status')).toHaveText('答对了！');expect(await top()).toBeCloseTo(before,0);await inspect(room,'handoff-correct');
 await page.goto('/unit21-22/#learn/observe');room=page.locator('.stage-observe');
 for(const answer of ['说话的人和他的同伴','Give her a cup, please.']){await room.getByRole('button',{name:answer,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await inspect(room,'handoff-group');await require('../support/units17-30-exam').selectAnswer(room,{object:'盒子',recipient:'简和男士'});await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'完成这一站',exact:true}).click();await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:dir+'/finish-'+width+'.png',fullPage:true,clip:await room.boundingBox()});
 await require('../support/unit21-22-flow').completeStory(page);await page.goto('/unit21-22/#learn/roles');room=page.locator('.stage-roles');await inspect(room,'locate-blank');
 await room.getByRole('group',{name:'原文选词',exact:true}).getByRole('button',{name:'The red one',exact:true}).click();await inspect(room,'locate-selected');
});
