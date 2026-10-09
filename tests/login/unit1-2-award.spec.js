'use strict';
const fs = require('node:fs');
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, addStudent, studentLogin } = require('./helpers');
const { finishZone, readStory } = require('../support/unit1-2-award-flow');

async function expectManagedLearning(page, account, mount, status, stars) {
  await page.goto(mount + 'admin/');
  await page.getByLabel('查找学生（姓名或学号）').fill(account.number);
  await page.locator('.student-row').filter({ hasText: account.number }).getByRole('button', { name:'查看学习进度', exact:true }).click();
  const row = page.locator('[data-learning-course="unit1-2"]');
  await expect(row.locator('.learning-state')).toHaveText(status);
  await expect(row.getByLabel(`已获得 ${stars} 颗星`, { exact:true })).toBeVisible();
}
test('账号姓名、跨设备五星、首次日期、重开练习与学生隔离', async ({ browser, page }) => {
  test.setTimeout(180000);
  const mount = process.env.AWARD_TEST_BASE || '/lesson/';
  await adminLogin(page, mount);
  const account = await createStudent(page, '纪念卡测试班', '小雨', [/Lesson 1–2/]);
  const other = await addStudent(page, '小明');
  const longName = '热爱探险和英语学习的小朋友李明小明';
  const longAccount = await addStudent(page, longName);
  const first = await studentLogin(browser, account, mount);
  const learner = first.page, base = mount + 'unit1-2/';
  const errors=[];learner.on('pageerror',error=>errors.push(error.message));
  await learner.goto(base + '#learn/workshop');
  await expect(learner.locator('.stage-workshop').getByRole('button', { name:'watch', exact:true })).toBeVisible();
  await first.context.setOffline(true);
  await finishZone(learner, 'workshop', { base });
  await expect(learner.locator('.stage-workshop .award-round-result')).toContainText('联网同步后');
  await expect(learner.locator('#starCount')).toHaveText('0');
  await first.context.setOffline(false);
  await expect(learner.locator('#starCount')).toHaveText('1');
  await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await expectManagedLearning(page, account, mount, '学习中', 1);
  const second = await studentLogin(browser, account, mount);
  await expect(second.page.locator('.course').filter({ hasText:'Lesson 1–2' })).toContainText('1 / 5');
  await second.page.goto(base + '#learn/certificate');
  await expect(second.page.locator('#certificateName')).toHaveText('小雨');
  await expect(second.page.getByRole('group', { name:'已获得 1 / 5 颗星' })).toBeVisible();
  await expect(second.page.getByLabel('纪念卡上的名字')).toHaveCount(0);
  await expect(second.page.locator('#certificateDate')).toBeHidden();
  await second.context.close();
  const workshop = learner.locator('.stage-workshop');
  await workshop.getByRole('button', { name:'再练一轮', exact:true }).click();
  await workshop.getByRole('button', { name:'book', exact:true }).click();
  await workshop.getByRole('button', { name:'检查答案', exact:true }).click();
  await learner.reload();
  await expect(workshop.getByRole('button', { name:'再试一次', exact:true })).toBeVisible();
  await expect(learner.locator('#starCount')).toHaveText('1');
  await readStory(learner, base);
  for (const id of ['roles','listen','manners','exam']) await finishZone(learner, id, { base });
  await expect(learner.locator('#starCount')).toHaveText('5');
  await expect(learner.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await expectManagedLearning(page, account, mount, '已完成', 5);
  // The fifth star was earned without opening or downloading the card.
  await learner.goto(base + '#learn/certificate');
  await expect(learner.locator('#certificateDate')).toBeVisible();
  const firstDate = await learner.locator('#certificateDate').textContent();
  const card=learner.getByRole('article',{name:'我的单元纪念卡'});
  await expect.poll(()=>card.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
  await learner.evaluate(()=>document.fonts.ready);
  for (const width of [320,390,768,1280]) {
    await learner.setViewportSize({width,height:width>=768?720:844});
    await learner.goto(base + '#learn/certificate');
    await expect(card.locator('#certificateName')).toHaveText('小雨');
    await expect(learner.getByLabel('纪念卡上的名字')).toHaveCount(0);
    await expect.poll(()=>card.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
    await learner.evaluate(()=>document.fonts.ready);
    const heading=await learner.locator('.stage-certificate > .stage-heading').boundingBox();
    const topbar=await learner.locator('#topbar').boundingBox();
    expect(heading.y).toBeGreaterThanOrEqual(topbar.y+topbar.height);
    const bounds=await card.boundingBox();
    expect(bounds.width).toBeLessThanOrEqual(width<=540?340:720);
    expect(Math.abs(bounds.x+bounds.width/2-width/2)).toBeLessThan(2);
    const actions=await learner.locator('.story-award-actions').boundingBox();
    expect(actions.y+actions.height).toBeLessThanOrEqual(width>=768?720:844);
    expect(await learner.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
    await learner.screenshot({path:`output/login/award-compact-${width}.png`});
    const download=learner.waitForEvent('download');
    await learner.getByRole('button',{name:'保存纪念卡',exact:true}).click();
    const file=await download;expect(file.suggestedFilename()).toBe('Lesson1-2-礼貌小帮手.png');
    const filePath=`output/login/award-compact-export-${width}.png`;await file.saveAs(filePath);
    const bytes=fs.readFileSync(filePath);
    expect(bytes.readUInt32BE(16)).toBe(1640);expect(bytes.readUInt32BE(20)).toBe(880);
  }
  const save=learner.getByRole('button',{name:'保存纪念卡',exact:true});
  // Exercise a browser export failure, even when all images are cached by the worker.
  await learner.evaluate(()=>{
    const original=HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob=function(callback){
      HTMLCanvasElement.prototype.toBlob=original;callback(null);
    };
  });
  await save.click();await expect(learner.locator('.story-award-status')).toContainText('请再试一次');
  const retryDownload=learner.waitForEvent('download');await save.click();await retryDownload;
  await learner.clock.setFixedTime(new Date(Date.now() + 3 * 86400000));
  await learner.reload(); await expect(learner.locator('#certificateDate')).toHaveText(firstDate);
  await learner.getByRole('button', { name:'小雨 · 学习设置' }).click();
  await learner.getByRole('button', { name:'重开本课', exact:true }).click();
  await Promise.all([
    learner.waitForEvent('load'),
    learner.getByRole('button', { name:'确认重开练习', exact:true }).click()
  ]);
  await expect(learner.getByRole('group', { name:'已获得 5 / 5 颗星' })).toBeVisible();
  await expect(learner.locator('#certificateDate')).toHaveText(firstDate);
  await expectManagedLearning(page, account, mount, '未开始', 5);
  await learner.goto(base + '#learn/workshop');
  await expect(learner.locator('.stage-workshop')).toContainText('第 1 / 4 题');
  const fresh = await studentLogin(browser, account, mount);
  await fresh.page.goto(base + '#learn/certificate');
  await expect(fresh.page.getByRole('group', { name:'已获得 5 / 5 颗星' })).toBeVisible();
  await expect(fresh.page.locator('#certificateDate')).toHaveText(firstDate);
  const different = await studentLogin(browser, other, mount);
  await different.page.goto(base + '#learn/certificate');
  await expect(different.page.locator('#certificateName')).toHaveText('小明');
  await expect(different.page.getByRole('group', { name:'已获得 0 / 5 颗星' })).toBeVisible();
  await expect(different.page.locator('#certificateDate')).toBeHidden();
  const longStudent=await studentLogin(browser,longAccount,mount);
  for (const width of [320,390,768,1280]) {
    await longStudent.page.setViewportSize({width,height:900});
    await longStudent.page.goto(base+'#learn/certificate');
    const name=longStudent.page.locator('#certificateName');
    await expect(name).toHaveText(longName);
    await expect(longStudent.page.getByLabel('纪念卡上的名字')).toHaveCount(0);
    await longStudent.page.evaluate(()=>document.fonts.ready);
    expect(await name.evaluate(el=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1)).toBe(true);
    await longStudent.page.locator('.story-award-panel').screenshot({path:`output/login/award-compact-long-name-${width}.png`});
  }
  await longStudent.context.close();
  expect(errors).toEqual([]);
  await Promise.all([first.context.close(), fresh.context.close(), different.context.close()]);
});

// Finishing with a correction is learning progress even though it earns no star.
test('订正完成但零星，课程首页仍可继续学习',async({browser,page})=>{
 const mount=process.env.AWARD_TEST_BASE||'/lesson/';
 await adminLogin(page,mount);const account=await createStudent(page,'零星续学班','继续学习同学',[/Lesson 1–2/]);
 const student=await studentLogin(browser,account,mount);
 try{
  const p=student.page,base=mount+'unit1-2/';await p.goto(base+'#learn/workshop');const room=p.locator('.stage-workshop');
  await room.getByRole('button',{name:'book',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await expectManagedLearning(page, account, mount, '学习中', 0);
  await room.getByRole('button',{name:'再试一次',exact:true}).click();await finishZone(p,'workshop',{base});
  await expect(p.locator('#starCount')).toHaveText('0');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await p.getByRole('link',{name:'我的课程',exact:true}).click();
  await expect(p.getByRole('link',{name:'继续学习：礼貌小帮手',exact:true})).toBeVisible();
 }finally{await student.context.close();}
});
