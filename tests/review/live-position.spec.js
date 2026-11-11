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
 await frame.getByRole('button',{name:'下一组词卡',exact:true}).click();await expect(page.locator('#current-title')).toContainText('词卡 · 第 2 组');
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
