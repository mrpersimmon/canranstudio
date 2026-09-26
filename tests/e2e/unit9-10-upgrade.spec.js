'use strict';
const{test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const legacy=require('../fixtures/unit9-10-classroom-before/flow');
const{finishExamFrom}=require('../support/unit9-10-exam');
const{isFeedbackAudio}=require('../support/course-resource-urls');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function oldClassroom(page){
 let old=true;
 for(const name of ['index.html','content.js','unit.js','unit.css']){
  const body=await fs.readFile('tests/fixtures/unit9-10-classroom-before/'+name);
  const url=name==='index.html'?/\/unit9-10\/(?:index\.html)?(?:\?.*)?$/:`**/unit9-10/${name}*`;
  await page.route(url,route=>old?route.fulfill({contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript',body}):route.continue());
 }
 return()=>{old=false;};
}
test('26题旧课堂升级保留未改活动、姓名与日期，新增综合题完成后恢复15星',async({page})=>{
 test.setTimeout(90000);const upgrade=await oldClassroom(page);await legacy.completeUnit910(page);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('问候小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 upgrade();await page.reload();await expect(page.locator('#starCount')).toHaveText('12');await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('问候小伙伴');
 await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await page.getByRole('button',{name:'继续：街角小挑战',exact:true}).click();await expect(page.locator('.stage-exam')).toContainText('第 4 / 10 题');await finishExamFrom(page,3);await page.locator('.stage-exam').getByRole('button',{name:'下一站：我的单元证书',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('15');
 await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(date);await page.keyboard.press('Escape');
 for(const id of ['reply','describe']){await page.goto('/unit9-10/#learn/'+id);const room=page.locator('.stage-'+id);await expect(room.getByRole('group',{name:'完成后的操作',exact:true})).toBeVisible();await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();}
});
test('旧拼句草稿跟随原题进入问候接力，未答题与未提交的选择绝不自动判对',async({page})=>{
 const upgrade=await oldClassroom(page);await legacy.completeActivity(page,'reply');
 await page.goto('/unit9-10/#learn/trans');await page.locator('.stage-trans').getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:"I'm",exact:true}).click();
 await page.goto('/unit9-10/#learn/describe');await page.locator('.stage-describe').getByRole('button',{name:"He's",exact:true}).click();
 upgrade();await page.reload();const describe=page.locator('.stage-describe');await expect(describe.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(describe.getByRole('button',{name:"He's",exact:true})).toHaveAttribute('aria-pressed','true');await expect(describe.getByRole('status')).toBeEmpty();
 await page.goto('/unit9-10/#learn/trans');await expect(page).toHaveURL(/#learn\/reply$/);const room=page.locator('.stage-reply');await expect(room).toContainText('第 2 / 3 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('button',{name:"撤回 I'm",exact:true})).toBeVisible();
 for(const token of ['fine,','thanks.','And','you?'])await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(room.getByRole('status')).toContainText('答对了！');await room.getByRole('button',{name:'完成这一站',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('3');
 await page.goto('/unit9-10/#learn/describe');await expect(describe).toContainText('第 1 / 4 题');await expect(describe.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
});
test('人物未齐不显示课件，整课加载后断网换主题、翻词卡与刷新续读都完整',async({page,context})=>{
 const voices=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url())&&!isFeedbackAudio(r.url()))voices.push(r.url());});
 let release;const held=new Promise(resolve=>{release=resolve;});await page.route(/tony\.svg(?:\?|$)/,async route=>{await held;await route.continue();});
 try{await page.goto('/lesson/unit9-10/#learn/text',{waitUntil:'domcontentloaded'});await expect(page.getByRole('status',{name:'课程准备状态',exact:true})).toContainText('准备');await expect(page.locator('.stage-text')).not.toBeVisible();}finally{release();}
 await expect(page.locator('#courseLoader')).toHaveCount(0);await context.setOffline(true);const story=page.locator('.stage-text');
 for(let i=0;i<10;i++)await story.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();const response=await page.reload();expect(response.headers()['x-course-offline']).toBe('1');await expect(story.locator('.bubble-row').last()).toBeInViewport({ratio:1});
 await page.goto('/lesson/unit9-10/#learn/models');
 for(const label of ['冷热','忙与懒','脏净']){await page.getByRole('group',{name:'选择观察主题',exact:true}).getByRole('button',{name:label,exact:true}).click();await expect.poll(()=>page.locator('.observation-pair img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);}
 await page.goto('/lesson/unit9-10/#learn/words');await expect(page.locator('#courseLoader')).toHaveCount(0);
 await page.evaluate(()=>{window.wordPaintFailures=[];new MutationObserver(()=>{if(document.querySelector('#courseLoader')||document.documentElement.hasAttribute('data-course-painting'))window.wordPaintFailures.push('loader');for(const img of document.querySelectorAll('.stage-words img'))if(img.getClientRects().length&&(!img.complete||!img.naturalWidth))window.wordPaintFailures.push(img.getAttribute('src'));}).observe(document.body,{childList:true,subtree:true,attributes:true});});
 for(let i=0;i<3;i++)await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();expect(await page.evaluate(()=>window.wordPaintFailures)).toEqual([]);expect(voices).toEqual([]);
});
