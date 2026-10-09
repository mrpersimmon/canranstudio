
'use strict';
const fs=require('node:fs/promises');
const {test,expect}=require('@playwright/test');
const oldFlow=require('../fixtures/unit1-2-before-awards/flow');
const {activity,ANSWERS}=require('../support/thirteen-types-flow');
test('当前25题旧记录合并五区，不自动发星；新挑战全对后得星',async({page})=>{
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
 for(const id of Object.keys(ANSWERS['1-2'])){
  await page.goto('/unit1-2/#learn/'+id);const room=page.locator('.stage-'+id);
  await expect(room.getByRole('button',{name:'再练一轮',exact:true})).toBeVisible();
  await expect(room.locator('.award-round-result')).toContainText('再练一轮');
 }
 for(const old of ['ask','trans']){await page.goto('/unit1-2/#learn/'+old);await expect(page).toHaveURL(/#learn\/workshop$/);}
 await page.locator('.stage-workshop').getByRole('button',{name:'再练一轮',exact:true}).click();
 await activity(page,'1-2','workshop');await expect(page.locator('#starCount')).toHaveText('1');
 before=true;await page.goto('/unit1-2/#learn/certificate');await page.reload();await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('旧卡姓名');
 await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(oldDate);
});
