'use strict';
const { isFeedbackAudio } = require('../support/course-resource-urls');
const {test,expect}=require('@playwright/test');
const {completeActivity,completeStory,completeUnit1314}=require('../support/unit13-14-flow');
const fs=require('node:fs/promises');
test.use({reducedMotion:'reduce',actionTimeout:5000});

test('挑战错答与提示分别记账，暂停刷新保留选择，不提前发证',async({page})=>{
  await page.goto('/unit13-14/#learn/exam');const room=page.locator('.stage-exam'),check=room.getByRole('button',{name:'检查答案',exact:true});
  await room.getByRole('button',{name:'case · yellow / hat · orange',exact:true}).click();await check.click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'case · yellow / hat · yellow',exact:true}).click();await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
  await room.getByRole('button',{name:'给点线索',exact:true}).click();await room.getByRole('button',{name:"Her carpet's red.",exact:true}).click();
  await room.getByRole('button',{name:'暂停，稍后继续',exact:true}).click();await page.reload();await room.getByRole('button',{name:'继续挑战',exact:true}).click();
  await expect(room.getByRole('button',{name:"Her carpet's red.",exact:true})).toHaveAttribute('aria-pressed','true');await check.click();
  await room.getByRole('button',{name:'查看本次记录',exact:true}).click();
  await expect(room).toContainText('首次独立答对 0 / 2');await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');
  await page.goto('/unit13-14/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('3');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
});

test('正误和完成反馈音实际播放结束，任何英语声音请求和系统朗读均未发生',async({page})=>{
  const voices=[];let speechCalls=0;await page.exposeFunction('noteEnglishSpeech',()=>speechCalls++);
  await page.route(/\.(mp3|wav|ogg)(\?|$)/,route=>{
    if(!isFeedbackAudio(route.request().url())){voices.push(route.request().url());return route.abort();}
    return route.continue();
  });
  await page.addInitScript(()=>{
    window.soundEvents=[];const play=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(...args){const event={src:this.src,ended:false};window.soundEvents.push(event);this.addEventListener('ended',()=>{event.ended=true;},{once:true});return Reflect.apply(play,this,args);};
    const speak=speechSynthesis.speak;speechSynthesis.speak=function(...args){window.noteEnglishSpeech();return Reflect.apply(speak,this,args);};
  });
  await page.goto('/unit13-14/#learn/exam');const room=page.locator('.stage-exam'),check=room.getByRole('button',{name:'检查答案',exact:true});
  await room.getByRole('button',{name:'case · orange / hat · yellow',exact:true}).click();await check.click();
  await expect.poll(()=>page.evaluate(()=>soundEvents.some(x=>x.src.includes('incorrect')&&x.ended))).toBe(true);
  await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'case · yellow / hat · yellow',exact:true}).click();await check.click();
  await expect.poll(()=>page.evaluate(()=>soundEvents.some(x=>x.src.includes('correct')&&!x.src.includes('incorrect')&&x.ended))).toBe(true);
  await room.getByRole('button',{name:'下一题',exact:true}).click();await room.getByRole('button',{name:"Her carpet's white.",exact:true}).click();await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:"Her carpet's red.",exact:true}).click();await check.click();await room.getByRole('button',{name:'查看本次记录',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>soundEvents.some(x=>x.src.includes('complete')&&x.ended))).toBe(true);
  expect(voices).toEqual([]);expect(speechCalls).toBe(0);
});

test('lesson路径阻断全部声音仍可完整通关和领证，各单元与根路径记录互不串用',async({page})=>{
  test.setTimeout(45000);const voices=[];
  await page.route(/\.(mp3|wav|ogg)(\?|$)/,route=>{if(!isFeedbackAudio(route.request().url()))voices.push(route.request().url());return route.abort();});
  await completeUnit1314(page,'/lesson');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'新衣配色屋纪念',exact:true})).toBeVisible();await page.keyboard.press('Escape');await page.reload();await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('link',{name:'我的课程',exact:true}).click();await expect(page).toHaveURL(/\/lesson\/$/);
  await expect(page.getByRole('link',{name:'继续学习：新衣配色屋',exact:true})).toHaveAttribute('href','/lesson/unit13-14/#learn/certificate');
  for(const unit of ['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12','unit49-50']){
    await page.goto('/lesson/'+unit+'/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('0');
  }
  await page.goto('/unit13-14/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('0');expect(voices).toEqual([]);
});

test('首页续学、同一位置继续冒险、重开取消与确认均遵守网站路径隔离',async({page})=>{
  await page.goto('/unit13-14/#learn/colours');const room=page.locator('.stage-colours');await room.getByRole('button',{name:"What colour's your hat?",exact:true}).click();
  await page.locator('#startBtn').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'继续冒险',exact:true}).click();await expect(room.getByRole('heading').first()).toBeInViewport();
  await page.getByRole('link',{name:'我的课程',exact:true}).click();await page.getByRole('link',{name:'继续学习：新衣配色屋',exact:true}).click();
  await expect(page).toHaveURL(/#learn\/colours$/);await expect(room.getByRole('button',{name:"What colour's your hat?",exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goto('/lesson/unit13-14/#learn/words');await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();
  await page.getByRole('link',{name:'我的课程',exact:true}).click();
  for(const confirm of [false,true]){
    await page.getByRole('button',{name:'设备冒险设置',exact:true}).click();await page.getByRole('button',{name:'重开冒险',exact:true}).click();await page.getByRole('button',{name:'继续确认',exact:true}).click();
    await page.getByRole('button',{name:confirm?'确认重开':'取消重开',exact:true}).click();
    if(!confirm){await page.getByRole('button',{name:'返回课程',exact:true}).click();await expect(page.getByRole('link',{name:'继续学习：新衣配色屋',exact:true})).toBeVisible();}
  }
  await expect(page.getByRole('link',{name:'开始学习：新衣配色屋',exact:true})).toHaveAttribute('href','/lesson/unit13-14/#learn/words');
  await page.getByRole('link',{name:'开始学习：新衣配色屋',exact:true}).click();await expect(page.locator('#wordPageProgress')).toHaveText('1 / 4');
  await page.goto('/unit13-14/#learn/colours');await expect(room.getByRole('button',{name:"What colour's your hat?",exact:true})).toHaveAttribute('aria-pressed','true');
});

test('更新一道理解题只失效对应活动，不清除词卡位置、其他练习和拼句草稿',async({page})=>{
  await completeStory(page);await completeActivity(page,'roles');await completeActivity(page,'colours');
  await page.goto('/unit13-14/#learn/words');await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();
  await page.goto('/unit13-14/#learn/trans');await page.locator('.stage-trans').getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:'This',exact:true}).click();
  await page.route('**/unit13-14/content.js*',async route=>route.fulfill({contentType:'text/javascript',body:(await fs.readFile('unit13-14/content.js','utf8')).replace("q('story-hat',","q('story-hat-v2',")}));
  await page.goto('/unit13-14/#learn/roles');await page.reload();await expect(page.locator('#starCount')).toHaveText('4');
  await expect(page.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(page.locator('.stage-roles').getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await page.goto('/unit13-14/#learn/words');await expect(page.locator('#wordPageProgress')).toHaveText('2 / 4');
  await page.goto('/unit13-14/#learn/trans');await expect(page.locator('.stage-trans').getByRole('button',{name:'撤回 This',exact:true})).toBeVisible();
  await page.goto('/unit13-14/#learn/colours');await expect(page.locator('.stage-colours').getByRole('group',{name:'完成后的操作',exact:true})).toBeVisible();
  await page.goto('/unit13-14/#learn/text');await expect(page.locator('.btext')).toHaveCount(13);await expect(page.getByText('故事看完了！',{exact:true})).toBeVisible();
});

test('关闭JavaScript首页仍提供新单元真实链接',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/lesson/');await expect(page.getByRole('link',{name:'开始学习：新衣配色屋',exact:true})).toHaveAttribute('href','/lesson/unit13-14/#learn/words');await context.close();
});
