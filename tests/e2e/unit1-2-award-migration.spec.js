
'use strict';
const fs=require('node:fs/promises');
const {test,expect}=require('@playwright/test');
const oldFlow=require('../fixtures/unit1-2-before-awards/flow');
const {activity,ANSWERS}=require('../support/thirteen-types-flow');
test('旧版只打开手提包环节，升级后五题首次全对获星且刷新保留',async({page})=>{
 let before=true;
 await page.route('**/unit1-2/*',async route=>{
  const name=new URL(route.request().url()).pathname.split('/').pop()||'index.html';
  if(before&&['index.html','content.js','unit.js'].includes(name))await route.fulfill({body:await fs.readFile('tests/fixtures/unit1-2-before-awards/'+name),contentType:name.endsWith('.js')?'text/javascript':'text/html'});else await route.continue();
 });
 await page.goto('/unit1-2/#learn/manners');const room=page.locator('.stage-manners');
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 // Opening the historical page creates its own empty draft. Do not seed storage.
 before=false;await page.reload();
 await expect(room.locator('.progress-copy')).toHaveText('第 1 / 5 题');
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await expect(room.locator('.fb')).toBeEmpty();
 await activity(page,'1-2','manners');
 await expect(room.getByRole('list',{name:'本轮成果'}).locator('strong')).toHaveText(['5','5','0']);
 await expect(page.locator('#starCount')).toHaveText('1');
 await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
});

test('旧25题升级语法五区，改题未答且不自动发星；新一轮全对后得星',async({page})=>{
 test.setTimeout(90000);let before=true;
 await page.route('**/unit1-2/*',async route=>{
  const name=new URL(route.request().url()).pathname.split('/').pop()||'index.html';
  if(before&&['index.html','content.js','unit.js'].includes(name))await route.fulfill({body:await fs.readFile('tests/fixtures/unit1-2-before-awards/'+name),contentType:name.endsWith('.js')?'text/javascript':'text/html'});else await route.continue();
 });
 await oldFlow.complete(page,'1-2');
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('旧卡姓名');
 await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const oldDate=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 before=false;await page.reload();
 await expect(page.locator('#certificateName')).toHaveText('登录后显示姓名');await expect(page.locator('#starCount')).toHaveText('0');await expect(page.locator('#certificateDate')).toBeHidden();
 for(const [id,count] of [['roles','第 4 / 5 题'],['trans','第 1 / 12 题'],['exam','第 2 / 10 题']]){
  await page.goto('/unit1-2/#learn/'+id);const room=page.locator('.stage-'+id);
  await expect(room.locator('.progress-copy')).toHaveText(count);
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 }
 for(const [old,current] of [['ask','listen'],['trans','trans'],['workshop','trans']]){await page.goto('/unit1-2/#learn/'+old);await expect(page).toHaveURL(new RegExp('#learn/'+current+'$'));}
 // None of the 12 grammar questions is inherited: this is already a full new round.
 await activity(page,'1-2','trans');await expect(page.locator('#starCount')).toHaveText('1');
 await page.locator('.stage-trans').getByRole('button',{name:'再练一轮',exact:true}).click();
 await activity(page,'1-2','trans');await expect(page.locator('#starCount')).toHaveText('1');
 before=true;await page.goto('/unit1-2/#learn/certificate');await page.reload();await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('旧卡姓名');
 await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(oldDate);
});
