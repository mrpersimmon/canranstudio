'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
async function instantAudio(page) {
  await page.addInitScript(()=>{
    window.Audio=class extends EventTarget {
      constructor(src){super();this.src=src;this.currentTime=0;}
      play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}
      pause(){}
    };
  });
}
async function answer(room,value){
  await room.getByRole('button',{name:value,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true}).click();
}
async function visibleQuestion(page, heading) {
  await expect.poll(async () => {
    const box = await heading.boundingBox(), bar = await page.locator('#topbar').boundingBox();
    return box.y >= bar.y + bar.height && box.y + box.height <= page.viewportSize().height;
  }).toBe(true);
}

test('一个听辨入口贯穿14词，暂停恢复且整轮完成后才满星', async ({ page }) => {
  await instantAudio(page);
  await page.goto('/lesson49/#learn/listen');
  await expect(page.getByRole('button',{name:'开始听辨',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:/下一轮听辨|开始第一轮听辨/})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'再听3个词',exact:true})).toBeHidden();
  await page.getByRole('button',{name:'开始听辨',exact:true}).click();
  const room=page.locator('#listenPractice');
  const words=['butcher','meat','beef','lamb','steak','mince','chicken','husband','tell','truth','either','mutton','pork','fish'];
  for(let index=0;index<words.length;index++){
    await expect(room).toContainText(`第 ${index+1} / 14 题`);
    await room.getByRole('button',{name:'听一遍',exact:true}).click();
    await answer(room,words[index]);
    if(index===5){
      await expect(page.locator('#starCount')).toHaveText('0');
      await page.goto('/lesson49/#learn/words');
      await page.goBack();
      await page.reload();
      await expect(room).toContainText('第 7 / 14 题');
    }
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  await page.waitForTimeout(800);await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'再听3个词',exact:true})).toHaveCount(0);
  await expect(page.locator('#starCount')).toHaveText('3');
  await page.goto('/lesson49/#learn/words');
  for(let index=0;index<2;index++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await page.getByRole('button',{name:'下一站：听音寻宝',exact:true}).click();
  await expect(page.getByRole('button',{name:'再听3个词',exact:true})).toHaveCount(0);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(room).toContainText('第 1 / 14 题');
});

test('课文逐段保留前文，仅对话区跟随新句，下一句不移动整页', async ({ page }) => {
  await instantAudio(page);await page.setViewportSize({width:390,height:664});
  await page.goto('/lesson49/#learn/text');await page.evaluate(()=>document.fonts.ready);
  const next=page.locator('#nextBtn');await next.click();await expect(next).toBeEnabled();
  const first=await next.boundingBox(); const scrollBefore=await page.evaluate(()=>scrollY);
  for(let i=0;i<6;i++){
    await next.click();await expect(next).toBeEnabled();
    const now=await next.boundingBox();expect(Math.abs(now.y-first.y)).toBeLessThanOrEqual(2);
    await expect(page.locator('#bubbleArea .bubble-row:visible')).toHaveCount(i+2);
    expect(await page.evaluate(()=>scrollY)).toBe(scrollBefore);
  }
  await expect(page.getByRole('button',{name:/^(已听原文|回到当前句)$/})).toHaveCount(0);
  await expect(page.locator('#bubbleArea .bubble-row:visible')).toHaveCount(7);
  const area=await page.locator('#bubbleArea').boundingBox();
  const last=await page.locator('#bubbleArea .bubble-row').last().boundingBox();
  expect(last.y+last.height).toBeLessThanOrEqual(area.y+area.height);
  expect(await page.locator('#bubbleArea').evaluate(node=>node.scrollTop)).toBeGreaterThan(0);
  await expect(next).toBeInViewport();
});

for(const item of [
  {id:'give',room:'#givePractice',answer:'Mrs. Bird'},
  {id:'either',room:'#eitherPractice',answer:'两个人都喜欢牛排'},
  {id:'fill',room:'#fillList',answer:'likes'},
  {id:'choice',room:'#choiceList',answer:"He doesn't like chicken."},
  {id:'trans',room:'#transList',tokens:['She','likes','peaches.']},
  {id:'exam',room:'#examPractice',answer:'mince',listen:true}
])test(`${item.id} 检查时不跳动，继续后题干可见`,async({page})=>{
  await instantAudio(page);await page.setViewportSize({width:390,height:664});
  await page.goto('/lesson49/#learn/'+item.id);await page.evaluate(()=>document.fonts.ready);
  if(item.id==='exam')await page.locator('#quizStartBtn').click();
  const room=page.locator(item.room);const check=room.getByRole('button',{name:'检查答案',exact:true});
  if(item.listen)await room.getByRole('button',{name:'听一遍',exact:true}).click();
  if(item.tokens){for(const token of item.tokens)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();}
  else await room.getByRole('button',{name:item.answer,exact:true}).click();
  await check.scrollIntoViewIfNeeded();const before=await check.boundingBox();const scrollBefore=await page.evaluate(()=>scrollY);
  await check.click();const next=room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true});
  expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(()=>scrollY)).toBe(scrollBefore);
  await next.click();
  await visibleQuestion(page, room.locator('.practice-content h3'));await expect(check).toBeVisible();
});

for(const route of ['/lesson49/','/unit49-50/'])test(`${route} 人称分拣答错原题重试不跳动，答对继续后新主语可见`,async({page})=>{
  await page.setViewportSize({width:390,height:664});await page.goto(route+'#learn/subjects');await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator('.stage-subjects');
  const subject=stage.locator('#tpItemText');
  await expect(subject).toHaveText('Mrs. Bird');
  const option=stage.getByRole('button',{name:'第一人称',exact:true});
  await option.click();
  const check=stage.getByRole('button',{name:'检查答案',exact:true});
  await check.scrollIntoViewIfNeeded();const scrollBefore=await page.evaluate(()=>scrollY);
  const before=await option.boundingBox();await check.press('Enter');
  expect(Math.abs((await option.boundingBox()).y-before.y)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(()=>scrollY)).toBe(scrollBefore);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(stage.getByRole('button',{name:'继续',exact:true})).toHaveCount(0);
  await expect(stage.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await stage.getByRole('button',{name:'再试一次',exact:true}).press('Enter');
  await expect(subject).toHaveText('Mrs. Bird');
  await expect(check).toBeDisabled();
  expect(Math.abs((await option.boundingBox()).y-before.y)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(()=>scrollY)).toBe(scrollBefore);
  await stage.getByRole('button',{name:'第三人称单数',exact:true}).click();
  await check.scrollIntoViewIfNeeded();
  const correctBefore=await option.boundingBox(),correctScroll=await page.evaluate(()=>scrollY);
  await check.press('Enter');
  await expect(stage.getByRole('status')).toHaveText('答对了！');
  await expect(stage.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
  expect(Math.abs((await option.boundingBox()).y-correctBefore.y)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(()=>scrollY)).toBe(correctScroll);
  await stage.getByRole('button',{name:'继续',exact:true}).press('Enter');
  await expect(subject).toHaveText('Mrs. Bird and her husband');
  await visibleQuestion(page, subject);
  const after=await option.boundingBox();
  expect(Math.abs(after.y+(await page.evaluate(()=>scrollY))-before.y-scrollBefore)).toBeLessThanOrEqual(2);
});

test('故事理解只显示当前任务，离开与刷新保留当前作答位置',async({page})=>{
  await page.addInitScript(()=>{if(!localStorage.getItem('canran:l49:learning:v1'))localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:{},activity:{fullDialogue:true}}));});
  await page.setViewportSize({width:390,height:664});await page.goto('/lesson49/#learn/roles');
  await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-roles'),check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(room.getByRole('button',{name:/我演|更换角色/})).toHaveCount(0);
  await answer(room,'steak');
  await expect(room).toContainText('第 2 / 5 题');
  await page.goto('/lesson49/#learn/doare');await page.goto('/lesson49/#learn/roles');
  await expect(room).toContainText('第 2 / 5 题');await page.reload();
  await expect(room).toContainText('第 2 / 5 题');await expect(check).toBeVisible();
});

test('退出正在播放的活动会停音，回来后可重听到结束',async({page})=>{
  await page.addInitScript(()=>{
    window.activityAudio=[];
    window.Audio=class extends EventTarget{
      constructor(src){super();this.src=src;this.currentTime=0;this.paused=true;window.activityAudio.push(this);}
      play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}
    };
  });
  await page.goto('/lesson49/#learn/text');await page.locator('#nextBtn').click();
  await page.goto('/lesson49/#learn/words');
  expect(await page.evaluate(()=>window.activityAudio.at(-1).paused)).toBe(true);
  await page.goBack();await expect(page.locator('#nextBtn')).toBeDisabled();
  await page.locator('#autoBtn').click();
  await page.evaluate(()=>window.activityAudio.at(-1).dispatchEvent(new Event('ended')));
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

for(const viewport of [{width:320,height:568},{width:844,height:390}])test(`${viewport.width}×${viewport.height} 小屏仍能作答、打开帮助和返回`,async({page})=>{
  await page.setViewportSize(viewport);await page.goto('/lesson49/#learn/doare');await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('#doarePractice');await answer(room,'Do you like meat?');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeVisible();
  await page.getByRole('region',{name:'问话小帮手',exact:true}).getByRole('button',{name:'怎么玩',exact:true}).click();
  await expect(page.locator('#activityHelpDialog')).toBeVisible();
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await page.goto('/lesson49/#learn/words');
  await expect(page.getByRole('heading',{name:'肉店小图鉴',exact:true})).toBeVisible();
  await page.goBack();await expect(room).toContainText('第 2 / 8 题');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('证书使用统一图标并可从公开按钮保存图片、关闭预览',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('l49-stars-v1',JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3})));
  await page.goto('/lesson49/#learn/certificate');
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小学徒');
  await page.locator('#certBtn').click();await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('#certModal .cert-ribbon img')).toBeVisible();
  const file=page.waitForEvent('download');await page.locator('#certSave').click();
  const download=await file;expect(download.suggestedFilename()).toBe('肉店小学徒结业证书-小学徒.png');
  await download.saveAs('output/playwright/butcher-focused-certificate-export.png');
  await expect(page.locator('#certSaveOverlay img')).toBeVisible();
  await page.locator('#certSaveClose').click();await expect(page.locator('#certSaveOverlay')).toHaveCount(0);
});
