'use strict';
const { test, expect } = require('@playwright/test');
const { DIALOGUE, completeStory, completeUnit56 } = require('../support/unit5-6-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('纸笔练习保留四组指代与十组替换，实际打印一张 A4 并留足书写空间', async ({ page }) => {
  await page.goto('/unit5-6/#learn/certificate');
  await page.getByText('和朋友再试试',{exact:true}).click();
  await expect(page.locator('.reference-writing li')).toHaveText([
    'Alice 是女同学。Alice is a student. ___ isn’t German. ___ is French.',
    'This is her car. ___ is a French car.',
    'Hans is a student. ___ isn’t French. ___ is German.',
    'This is his car. ___ is a German car.'
  ]);
  await expect(page.locator('.reply-writing li>span:first-child')).toHaveText([
    'Naoko · Japanese / German','Peugeot · French / German','Hans · German / French','Xiaohui · Chinese / Japanese','Mini · English / American','Chang-woo · South Korean / Japanese','Luming · Chinese / English','Mercedes · German / French','Toyota · Japanese / Chinese','Ford · American / English'
  ]);
  await page.evaluate(()=>{window.print=()=>{};});
  await page.getByRole('button',{name:'打印练习纸',exact:true}).click();
  await page.emulateMedia({media:'print',reducedMotion:'reduce'});
  for(const row of await page.locator('.reply-writing li').all()){
    await expect(row).toBeVisible();await expect(row.locator('.writing-rule')).toHaveCount(2);
    expect(await row.evaluate(el=>[...el.querySelectorAll('.writing-rule')].every(line=>line.getBoundingClientRect().height>=19&&line.clientWidth>=el.clientWidth*.9))).toBe(true);
  }
  const pdf=await page.pdf({path:'output/playwright/unit5-6/writing-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('真实完成 20 句与 27 题获得 15 星，领取、保存、打印与重练连续，单元记录独立',async({page})=>{
  test.setTimeout(200000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/unit5-6/#learn/certificate');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await completeUnit56(page);
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('乐于交朋友的小雨');
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'新朋友见面会纪念',exact:true});
  await expect(dialog.locator('#certificateName')).toHaveText('乐于交朋友的小雨');
  for(const name of ['Mr. Blake','Sophie'])await expect(dialog.getByRole('img',{name,exact:true})).toBeVisible();
  const date=await dialog.locator('#certificateDate').innerText();
  await dialog.screenshot({path:'output/playwright/unit5-6/certificate-desktop.png'});
  const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();
  await(await download).saveAs('output/playwright/unit5-6/certificate-saved.png');
  const pdf=await page.pdf({path:'output/playwright/unit5-6/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:844});expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);}
  await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeFocused();
  await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(date);await page.keyboard.press('Escape');
  await page.goto('/unit5-6/#learn/listen');const room=page.locator('.stage-listen');await room.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(room).toContainText('第 1 / 9 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  for(const other of ['unit1-2','unit3-4','unit49-50']){await page.goto('/'+other+'/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('0');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();}
  expect(errors).toEqual([]);
});

test('新单元从图鉴开始，24 个词的音标与点读可见，末组主动进入九词听辨', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/unit5-6/');
  await expect(page).toHaveTitle('新朋友见面会 · Lesson 5–6');
  await page.getByRole('button', { name: '开始冒险', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/words$/);
  const words = page.locator('.stage-words');
  await expect(words.locator('.unit-word')).toHaveCount(6);
  await expect(words.getByRole('button', { name: 'French', exact: true })).toContainText('/frentʃ/');
  await words.getByRole('button', { name: 'French', exact: true }).click();
  await expect(words.getByRole('button', { name: 'French', exact: true })).toHaveAttribute('aria-busy', 'false', { timeout: 10000 });
  await expect(words.getByRole('button', { name: 'French', exact: true })).toContainText('法国');
  for (let i = 0; i < 3; i++) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await expect(words.locator('.unit-word')).toHaveCount(6);
  await expect(words.locator('.word-phonetic')).toHaveCount(6);
  await words.getByRole('button', { name: '下一站：听音寻宝', exact: true }).click();
  await expect(page.locator('.stage-listen')).toContainText('第 1 / 9 题');
  await expect(page.locator('.stage-listen').getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('首页与 lesson 子目录有新单元入口，独立继续并保留资源路径', async ({ page }) => {
  const bad=[];page.on('response',r=>{if(r.status()>=400)bad.push(r.url());});
  await page.goto('/lesson/');
  await page.getByRole('link',{name:'开始学习：新朋友见面会',exact:true}).click();
  await expect(page).toHaveURL(/\/lesson\/unit5-6\/#learn\/words$/);
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();
  await page.getByRole('link',{name:'介绍有办法',exact:true}).click();
  await page.locator('.stage-refer').getByRole('button',{name:'She',exact:true}).click();
  await page.getByRole('link',{name:'我的课程',exact:true}).click();
  await expect(page.getByRole('link',{name:'继续学习：新朋友见面会',exact:true})).toHaveAttribute('href','/lesson/unit5-6/#learn/refer');
  await expect(page.getByRole('link',{name:'开始学习：雨伞认领小帮手',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'继续学习：新朋友见面会',exact:true}).click();
  await expect(page.locator('.stage-refer').getByRole('button',{name:'She',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goto('/unit5-6/#learn/refer');
  await expect(page.locator('.stage-refer').getByRole('button',{name:'She',exact:true})).toHaveAttribute('aria-pressed','false');
  expect(bad).toEqual([]);
});

test('20 句原文保留五次问好，舞台跟随介绍人物，听完才解锁理解题', async ({ page }) => {
  test.setTimeout(100000);
  await page.goto('/unit5-6/#learn/roles');
  await expect(page.locator('.stage-roles').getByRole('button',{name:'先听故事',exact:true})).toBeVisible();
  await completeStory(page);
  const story=page.locator('.stage-text');
  await expect(story.locator('.btext span')).toHaveText(DIALOGUE);
  await expect(story.locator('.bname')).toHaveText(['Mr. Blake','Students','Mr. Blake','Mr. Blake','Mr. Blake','Mr. Blake','Mr. Blake','Hans','Mr. Blake','Mr. Blake','Naoko','Mr. Blake','Mr. Blake','Chang-woo','Mr. Blake','Mr. Blake','Luming','Mr. Blake','Mr. Blake','Xiaohui']);
  await story.locator('.bubble-row').nth(10).getByRole('button',{name:'Nice to meet you.',exact:true}).click();
  await expect(story.locator('[data-actor="student"] span')).toHaveText('Naoko');
  await expect(story.locator('.btext[aria-busy="true"]')).toHaveCount(0,{timeout:10000});
  await page.reload();await expect(story.locator('.btext span')).toHaveText(DIALOGUE);
  await expect(page.locator('.stage-roles')).toContainText('第 1 / 4 题');
});

test('题目升版不承接旧选择，未改活动保留；同地址继续仍滚回原活动',async({page})=>{
  await page.goto('/unit5-6/#learn/refer');const refer=page.locator('.stage-refer');
  await refer.getByRole('button',{name:'She',exact:true}).click();await refer.getByRole('button',{name:'检查答案',exact:true}).click();
  await page.goto('/unit5-6/#learn/articles');const articles=page.locator('.stage-articles');await articles.getByRole('button',{name:'a',exact:true}).click();
  await page.locator('#startBtn').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'继续冒险',exact:true}).click();await expect(articles.getByRole('heading').first()).toBeInViewport();
  await expect(articles.getByRole('button',{name:'a',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.route('**/unit5-6/content.js*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace("question('refer-she'","question('refer-she-revised'")});});
  await page.reload();await expect(articles.getByRole('button',{name:'a',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goto('/unit5-6/#learn/refer');await expect(refer.getByRole('button',{name:'She',exact:true})).toHaveAttribute('aria-pressed','false');await expect(refer.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(refer.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
});

test('首页重开包含四个单元，取消保留，确认只清除本路径的学习记录',async({page})=>{
  await page.goto('/unit5-6/#learn/refer');const root=page.locator('.stage-refer');await root.getByRole('button',{name:'She',exact:true}).click();
  for(const path of ['unit1-2/#learn/ask','unit3-4/#learn/reply','unit5-6/#learn/refer','unit49-50/#learn/give']){await page.goto('/lesson/'+path);await expect(page.locator('.stage-'+path.split('#learn/')[1])).toBeVisible();}
  await page.goto('/lesson/');
  await page.getByRole('button',{name:'设备冒险设置',exact:true}).click();await page.getByRole('button',{name:'重开冒险',exact:true}).click();await page.getByRole('button',{name:'继续确认',exact:true}).click();await page.getByRole('button',{name:'取消重开',exact:true}).click();await page.getByRole('button',{name:'返回课程',exact:true}).click();
  for(const name of ['礼貌小帮手','雨伞认领小帮手','新朋友见面会'])await expect(page.getByRole('link',{name:'继续学习：'+name,exact:true})).toBeVisible();
  await page.getByRole('button',{name:'设备冒险设置',exact:true}).click();await page.getByRole('button',{name:'重开冒险',exact:true}).click();await page.getByRole('button',{name:'继续确认',exact:true}).click();await page.getByRole('button',{name:'确认重开',exact:true}).click();
  for(const name of ['礼貌小帮手','雨伞认领小帮手','新朋友见面会'])await expect(page.getByRole('link',{name:'开始学习：'+name,exact:true})).toBeVisible();
  await expect(page.getByRole('region',{name:'晚餐采购大冒险',exact:true}).getByRole('link',{name:'开始学习',exact:true})).toBeVisible();
  await page.goto('/unit5-6/#learn/refer');await expect(root.getByRole('button',{name:'She',exact:true})).toHaveAttribute('aria-pressed','true');
});
