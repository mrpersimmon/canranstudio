'use strict';
const {test,expect}=require('@playwright/test');
const initial={unit:'unit3-4',page:'q:u34-grammar-v1-known-owner',state:'correct',device:'chrome-iphone-se'};
async function ready(page){await expect(page.locator('#loading')).toBeHidden({timeout:30000});await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(page.locator('#error')).toBeHidden();}
async function start(page,device=initial.device){await page.goto('/?'+new URLSearchParams({...initial,device}));await ready(page);return page.frameLocator('#frame-shell iframe:not(.pending)');}
for(const device of require('../support/required-phone-devices.json').devices)test('live position follows the learner from question 7 to 8 on '+device.name,async({page})=>{
 const frame=await start(page,device.id),origin=await frame.locator('body').evaluate(()=>performance.timeOrigin);
 await frame.getByRole('button',{name:'下一题',exact:true}).click();await expect(frame.locator('.progress-copy:visible')).toContainText('第 8 / 10 题');
 await expect(page.locator('#current-title')).toContainText('第 8 题');
 await page.getByRole('group',{name:'展示状态',exact:true}).getByRole('button',{name:'答错',exact:true}).click();await ready(page);
 await expect(frame.locator('.progress-copy:visible')).toContainText('第 8 / 10 题');await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
 await expect(page.locator('#current-title')).toContainText('第 8 题');expect(new URL(page.url()).searchParams.get('page')).toBe('q:u34-grammar-v1-unknown-owner');
 await expect(page.locator('#entries [aria-current=page]')).toContainText('第 8 题');expect(await frame.locator('body').evaluate(()=>performance.timeOrigin)).toBe(origin);
});

test('live position follows word pages, story lines and a restarted round instead of the original entry',async({page})=>{
 const frame=await start(page);
 await frame.getByRole('link',{name:'词汇',exact:true}).click();await expect(page.locator('#current-title')).toContainText('词卡 · 第 1 组');
 await frame.locator('.word-controls').getByRole('button',{name:'下一组',exact:true}).click();await expect(page.locator('#current-title')).toContainText('词卡 · 第 2 组');
 const time=await frame.locator('body').evaluate(()=>performance.timeOrigin);
 await page.locator('#state-buttons [data-state=expanded]').click();await ready(page);
 expect(new URL(page.url()).searchParams.get('page')).toBe('words-1');expect(await frame.locator('body').evaluate(()=>performance.timeOrigin)).toBe(time);
 await frame.getByRole('link',{name:'故事',exact:true}).click();await frame.getByRole('button',{name:'开始故事',exact:true}).click();
 await expect(page.locator('#current-title')).toContainText('课文 · 第 1 句');
 await page.locator('#state-buttons [data-state=translated]').click();await ready(page);await expect(frame.locator('.dialogue-log .bcn').last()).toBeVisible();
 expect(new URL(page.url()).searchParams.get('page')).toBe('story-0');expect(await frame.locator('body').evaluate(()=>performance.timeOrigin)).toBe(time);
 await page.goto('/?'+new URLSearchParams({...initial,page:'result:reply',state:'perfect'}));await ready(page);
 await frame.getByRole('button',{name:'再练一轮',exact:true}).click();await expect(page.locator('#current-title')).toContainText('第 1 题');
 await page.locator('#state-buttons [data-state=wrong]').click();await ready(page);await expect(frame.locator('.progress-copy:visible')).toContainText('第 1 / 10');
});
test('live position follows readonly previous questions and resolves immediate state clicks',async({page})=>{
 let frame=await start(page);await frame.getByRole('button',{name:'上一题',exact:true}).click();await expect(frame.locator('.progress-copy:visible')).toContainText('回看 6 / 10');
 await page.getByRole('group',{name:'展示状态',exact:true}).getByRole('button',{name:'未作答',exact:true}).click();await ready(page);
 await expect(frame.locator('.progress-copy:visible')).toContainText('第 6 / 10');await expect(frame.locator('[data-practice-review]:visible')).toHaveCount(0);
 frame=await start(page);
 // Both genuine UI handlers run before a queued cross-window position message.
 await page.evaluate(()=>{const doc=document.querySelector('iframe:not(.pending)').contentDocument;[...doc.querySelectorAll('.learning-surface button')].find(b=>b.textContent.trim()==='下一题').click();document.querySelector('#state-buttons [data-state=wrong]').click();document.querySelector('#state-buttons [data-state=corrected]').click();});
 await ready(page);await expect(frame.locator('.progress-copy:visible')).toContainText('第 8 / 10');
 await expect(frame.locator('.practice-answer-note:visible')).toContainText('答对了');
 await expect(page.locator('#current-title')).toContainText('第 8 题');
});

test('native reload keeps the current question when rapid turns have a pending address',async({page,context})=>{
 const unit='unit125-126',exam=require('../../server/progress').definition(process.cwd(),unit,'/').questions.exam;
 const target='q:'+exam[5].id;
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+exam[0].id,state:'review',device:initial.device}));await ready(page);
 const active=page.locator('#frame-shell iframe:not(.pending)'),course=active.contentFrame();
 // WebKit refused this same-origin replace during rapid question changes.
 // Keep that one address pending until reload, independent of runner speed.
 await page.evaluate(target=>{
  const replace=history.replaceState.bind(history);
  history.replaceState=(state,title,url)=>{
   if(new URL(url,location.href).searchParams.get('page')===target)throw new DOMException('History updates are limited','SecurityError');
   return replace(state,title,url);
  };
 },target);
 for(let i=0;i<5;i++)await course.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(course.locator('.progress-copy:visible')).toContainText('回看 6 / 25');
 await expect(active).toHaveAttribute('data-page',target);
 const actual=await active.getAttribute('data-page'),oldLink=page.url(),oldPage=new URL(oldLink).searchParams.get('page');
 expect(oldPage).not.toBe(actual);
 await page.reload();await ready(page);
 await expect(course.locator('.progress-copy:visible')).toContainText('回看 6 / 25');
 expect(new URL(page.url()).searchParams.get('page')).toBe(actual);
 const other=await context.newPage();await other.goto(oldLink);await ready(other);
 await expect(other.locator('#frame-shell iframe:not(.pending)')).toHaveAttribute('data-page',oldPage);
 await page.goto(oldLink);await ready(page);await expect(active).toHaveAttribute('data-page',oldPage);
});
