'use strict';
const {test,expect}=require('@playwright/test');
const tasks=require('../support/units1-30-tasks');
const fs=require('node:fs/promises');
test.use({reducedMotion:'reduce',actionTimeout:6000});
for(const pair of ['3-4','5-6'])test(`${pair} 只打开旧页面的空白草稿升级，首轮全对得星且刷新保留`,async({page})=>{
 let before=true;
 await page.route(`**/unit${pair}/*`,async route=>{
  const name=new URL(route.request().url()).pathname.split('/').pop()||'index.html';
  if(before&&['index.html','content.js','unit.js'].includes(name))await route.fulfill({body:await fs.readFile(`tests/fixtures/unit${pair}-before-awards/`+name),contentType:name.endsWith('.js')?'text/javascript':'text/html'});else await route.continue();
 });
 const old=pair==='3-4'?'listen':'refer',current=pair==='3-4'?'listen':'introduce';
 await page.goto(`/unit${pair}/#learn/${old}`);
 await expect(page.locator('.stage-'+old).getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 before=false;await page.reload();
 const room=page.locator('.stage-'+current);
 await expect(room.locator('.progress-copy')).toHaveText(/^第 1 \/ \d+ 题$/);
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await tasks.activity(page,pair,current);await expect(page.locator('#starCount')).toHaveText('1');
 await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
});

for(const pair of ['3-4','5-6'])test(`${pair} 五答题区整轮零错才获星，订正和刷新不补星，重练获星后不撤回`,async({page})=>{
 const id=pair==='3-4'?'listen':'introduce',wrong=pair==='3-4'?'ticket':'He';
 await page.goto(`/unit${pair}/#learn/${id}`);const room=page.locator('.stage-'+id);
 await room.getByRole('button',{name:wrong,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();
 await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await tasks.activity(page,pair,id);
 await expect(page.locator('#starCount')).toHaveText('0');await expect(room.locator('.award-round-result')).toContainText('本轮有过错答');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await tasks.activity(page,pair,id);await expect(page.locator('#starCount')).toHaveText('1');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await room.getByRole('button',{name:wrong,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
 await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.locator('#certificateDate')).toBeHidden();await page.getByText('查看五星任务',{exact:true}).click();await expect(page.getByRole('list',{name:'五星任务'}).getByRole('listitem')).toHaveCount(5);
});

for(const pair of ['3-4','5-6'])test(`${pair} 发卡前真实当前题目保留完成记录和旧证书，新版星星须重练`,async({page})=>{
 test.setTimeout(120000);let before=true;
 await page.route(`**/unit${pair}/*`,async route=>{
  const name=new URL(route.request().url()).pathname.split('/').pop()||'index.html';
  if(before&&['index.html','content.js','unit.js'].includes(name))await route.fulfill({body:await fs.readFile(`tests/fixtures/unit${pair}-before-awards/`+name),contentType:name.endsWith('.js')?'text/javascript':'text/html'});else await route.continue();
 });
 await tasks.story(page,pair);
 for(const id of Object.keys(tasks.CASES[pair].old)){
  await page.goto(`/unit${pair}/#learn/${id}`);const room=page.locator('.stage-'+id),questions=tasks.answers(pair,id);
  for(const [index,q] of questions.entries()){
   await tasks.select(room,q.answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toContainText('答对了！');
   await room.getByRole('button',{name:index===questions.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  }
 }
 await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.locator('#starCount')).toHaveText('15');await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('旧卡姓名');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 before=false;await page.reload();await expect(page.locator('#starCount')).toHaveText('0');await expect(page.locator('#certificateDate')).toBeHidden();
 const ids=pair==='3-4'?['listen','roles','manners','reply','exam']:['listen','roles','introduce','cars','exam'];
 for(const id of ids){await page.goto(`/unit${pair}/#learn/${id}`);await expect(page.locator('.stage-'+id).getByRole('button',{name:'再练一轮',exact:true})).toBeVisible();}
 await page.locator('.stage-exam').getByRole('button',{name:'再练一轮',exact:true}).click();await tasks.activity(page,pair,'exam');await expect(page.locator('#starCount')).toHaveText('1');
 before=true;await page.goto(`/unit${pair}/#learn/certificate`);await page.reload();await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('旧卡姓名');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(date);
});
