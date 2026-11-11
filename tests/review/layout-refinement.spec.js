'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const unit=definition(process.cwd(),'unit143-144','/');
async function open(page,device,entry,state='view',id='unit143-144'){
 await page.goto('/?'+new URLSearchParams({unit:id,page:entry,state,device:device.id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 return page.frameLocator('#frame-shell iframe:not(.pending)');
}
test('complete-material preset remains available on the next original record question',async({page})=>{
 const frame=await open(page,devices[0],'q:u143144-v1-a-now','before');
 await page.locator('#state-buttons [data-state="full"]').click();await settled(page);
 const panel=frame.getByRole('dialog',{name:'题目材料',exact:true});await expect(panel).toBeVisible();
 await panel.getByRole('button',{name:'关闭学习参考'}).click();
 await frame.locator('.learning-surface .practice-options').getByRole('button',{name:unit.questions.apply[0].answer,exact:true}).click();
 await frame.getByRole('button',{name:'检查答案',exact:true}).click();await expect(frame.locator('.fb:visible')).toHaveText('答对了！');
 await frame.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(panel).toBeVisible();await expect(panel.locator('.practice-context')).toHaveText(unit.questions.apply[1].display.material);
 await expect(page.locator('#error')).toBeHidden();expect(new URL(page.url()).searchParams.get('page')).toBe('q:u143144-v1-a-past');
});
async function settled(page){await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(page.locator('#error')).toBeHidden();}
test('320px pressure keeps the start of long meanings and all reading/material controls reachable',async({page})=>{
 const phone={id:'small-phone'},words=await open(page,phone,'words-2','collapsed','unit1-2'),card=words.getByRole('button',{name:'is',exact:true});
 await card.click();expect(await card.evaluate(e=>e.querySelector('strong').getBoundingClientRect().top>=e.getBoundingClientRect().top)).toBe(true);
 await expect(words.locator('.word-controls')).toBeInViewport();
 const frame=await open(page,phone,'q:u143144-v1-a-past','correct');await expect(frame.locator('.practice-submit-row:visible')).toBeInViewport();
 await frame.getByRole('button',{name:'查看题目材料',exact:true}).click();await expect(frame.getByRole('button',{name:'关闭学习参考'})).toBeInViewport();await frame.getByRole('button',{name:'关闭学习参考'}).click();
 const story=await open(page,phone,'story-7','english');await expect(story.locator('.stage-ctrl>.btn-green')).toBeInViewport();
 const last=story.locator('.dialogue-log .bubble-row').last();await last.getByRole('button',{name:'看中文',exact:true}).click();await expect(last.locator('.bcn')).toBeVisible();await last.getByRole('button',{name:'收起中文',exact:true}).click();await expect(last.locator('.bcn')).toBeHidden();
});
for(const device of devices){
 test(device.name+' expanded meanings are centered without clipping long original text',async({page},info)=>{
  const frame=await open(page,device,'words-0','collapsed'),city=frame.getByRole('button',{name:'city',exact:true});
  const footer=await frame.locator('.word-controls').boundingBox();await city.click();
  const geometry=await city.evaluate(card=>{const b=card.getBoundingClientRect(),c=[...card.children].filter(e=>e.getClientRects().length&&!e.hidden).map(e=>e.getBoundingClientRect());return {card:(b.top+b.bottom)/2,text:(Math.min(...c.map(x=>x.top))+Math.max(...c.map(x=>x.bottom)))/2,overflow:card.scrollHeight-card.clientHeight};});
  expect(Math.abs(geometry.card-geometry.text)).toBeLessThanOrEqual(2);expect(geometry.overflow).toBe(0);
  expect((await frame.locator('.word-controls').boundingBox()).y).toBe(footer.y);
  await page.locator('#frame-shell').screenshot({path:info.outputPath('centered-city.png')});
  const long=await open(page,device,'words-2','collapsed','unit1-2'),be=long.getByRole('button',{name:'is',exact:true});await be.click();
  await expect(be.locator('.word-meaning')).toHaveText('be 的一种形式；本句搭配 this / it');
  expect(await be.evaluate(e=>e.querySelector('strong').getBoundingClientRect().top>=e.getBoundingClientRect().top)).toBe(true);
 });
 test(device.name+' story has a continuous setting and compact translation controls like Lesson1-2',async({page},info)=>{
  const frame=await open(page,device,'story-7','english'),scene=frame.locator('.stage-text .dialogue-stage'),last=scene.locator('.bubble-row').last(),button=last.getByRole('button',{name:'看中文',exact:true});
  await expect(button).toHaveText('中文');
  const box=await last.evaluate(row=>{const name=row.querySelector('.bname').getBoundingClientRect(),button=row.querySelector('.bbtns').getBoundingClientRect(),text=row.querySelector('.btext').getBoundingClientRect();return{name:name.toJSON(),button:button.toJSON(),text:text.toJSON()};});
  expect(box.name.top).toBeGreaterThanOrEqual(box.button.top-1);expect(box.name.bottom).toBeLessThanOrEqual(box.button.bottom+1);expect(box.text.top).toBeGreaterThanOrEqual(box.button.bottom-1);
  await expect(scene).toHaveCSS('background-image',/woods-world-continuous/);await expect(scene.locator('.learning-story-art')).toHaveCSS('background-image','none');
  await button.click();await expect(last.locator('.bcn')).toHaveText(unit.learning.DIALOGUE[7].cn);await expect(last.locator('.bcn')).toBeVisible();await expect(last.getByRole('button',{name:'收起中文',exact:true})).toHaveText('收起');
  await page.locator('#frame-shell').screenshot({path:info.outputPath('story-translation.png')});
 });
 test(device.name+' progress stays inside its lane and the record question uses one complete material panel',async({page},info)=>{
  const frame=await open(page,device,'q:u143144-v1-a-past','before');
  for(const state of ['before','wrong','correct','review']){
   if(state!=='before'){await page.locator('#state-buttons [data-state="'+state+'"]').click();await settled(page);}
   const content=frame.locator('.learning-surface .practice-content');
   const spacing=await content.evaluate(e=>{const m=e.querySelector('.practice-meter').getBoundingClientRect(),steps=[...e.querySelectorAll('.practice-step')].map(n=>n.getBoundingClientRect()),h=e.querySelector('h3').getBoundingClientRect();return {meter:m.toJSON(),bottom:Math.max(...steps.map(r=>r.bottom)),heading:h.top,scroll:e.scrollHeight-e.clientHeight};});
   expect(spacing.bottom).toBeLessThanOrEqual(spacing.meter.bottom+1);expect(spacing.heading-spacing.bottom).toBeGreaterThanOrEqual(10);
   expect(spacing.scroll).toBeLessThanOrEqual(2);
   await expect(content.locator('.learning-context-preview:visible')).toHaveCount(0);await expect(content.locator('.practice-context:visible')).toHaveCount(0);
   const material=content.getByRole('button',{name:'查看题目材料',exact:true});await expect(material).toBeVisible();
   const before=await content.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)).groups));
   await material.click();const panel=frame.getByRole('dialog',{name:'题目材料',exact:true});await expect(panel).toBeVisible();
   await expect(panel.locator('.practice-context')).toHaveText(unit.questions.apply[1].display.material);
   await expect(panel.locator('img')).toHaveAttribute('src',/inspection-record\.svg$/);await expect(panel.getByRole('button',{name:'关闭学习参考'})).toBeInViewport();
   await panel.getByRole('button',{name:'关闭学习参考'}).click();await expect(material).toBeFocused();
   expect(await content.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)).groups))).toBe(before);
   await page.locator('#frame-shell').screenshot({path:info.outputPath('record-'+state+'.png')});
  }
 });
}
