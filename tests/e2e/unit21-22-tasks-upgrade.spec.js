'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {finishRemainingActivity}=require('../support/unit21-22-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('旧34题真实完成后升级：旧题进度留存，新配对定位交接必须亲自完成',async({page})=>{
 test.setTimeout(90000);let old=true;
 for(const name of ['content.js','unit.js']){const body=await fs.readFile('tests/fixtures/unit21-22-tasks-before/'+name);await page.route('**/unit21-22/'+name+'*',r=>old?r.fulfill({body,contentType:'text/javascript'}):r.continue());}
 await require('../fixtures/unit21-22-tasks-before/flow').completeUnit2122(page);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('找书小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 await page.goto('/unit21-22/#learn/words');await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();old=false;await page.reload();
 await expect(page.locator('#starCount')).toHaveText('4');await expect(page.locator('#wordPageProgress')).toHaveText('2 / 6');await expect(page.locator('.stage-text .btext')).toHaveCount(8);
 for(const [id,count]of [['listen',6],['roles',0],['observe',2],['exam',0]]){
  await page.goto('/unit21-22/#learn/'+id);const room=page.locator('.stage-'+id);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(count));await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await finishRemainingActivity(page,id);
 }
 await page.goto('/unit21-22/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('找书小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(date);await page.keyboard.press('Escape');
 for(const id of ['listen','roles','observe','exam']){await page.goto('/unit21-22/#learn/'+id);const room=page.locator('.stage-'+id);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();}
});

test('旧词义题未提交选择不迁成新配对；修改前后同尺寸留图',async({page})=>{
 test.setTimeout(30000);let old=true;
 for(const name of ['content.js','unit.js']){const body=await fs.readFile('tests/fixtures/unit21-22-tasks-before/'+name);await page.route('**/unit21-22/'+name+'*',r=>old?r.fulfill({body,contentType:'text/javascript'}):r.continue());}
 await page.goto('/unit21-22/#learn/listen');const room=page.locator('.stage-listen');
 for(const answer of ['给；递给','这一本书','哪一本书？','空的 / 满的','大的 / 小的','锋利的 / 钝的']){await room.getByRole('button',{name:answer,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await room.getByRole('button',{name:'盒子；箱子',exact:true}).click();old=false;await page.reload();
 await expect(room.getByRole('heading',{name:'给容器选择配对',exact:true})).toBeVisible();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','6');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 for(const width of [390,1280])for(const edition of ['before','after']){
  old=edition==='before';await page.setViewportSize({width,height:820});await page.goto('/unit21-22/#learn/exam');await page.reload();
  const exam=page.locator('.stage-exam');await page.evaluate(()=>document.fonts.ready);await expect.poll(()=>exam.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'output/test-unit21-22-tasks/'+edition+'-exam-'+width+'.png',fullPage:true,clip:await exam.boundingBox()});
 }
});
