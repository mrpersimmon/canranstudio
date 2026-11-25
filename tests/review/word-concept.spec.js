'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const sizes=[...devices,{id:'small-phone'},{id:'tablet'},{id:'desktop'}];
for(const device of sizes)test(device.id+' context card sample keeps illustrations and sentences separate without layout jumps',async({page},info)=>{
 const catalog=await(await page.request.get('/review/catalog.json')).json();
 expect(catalog.courses[0].entries.filter(e=>e.kind==='word-concept'),'sample is discoverable in the review bench').toHaveLength(2);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'sample:word-context',state:'collapsed',device:device.id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),cards=frame.locator('.sample-group:not([hidden]) .sample-card');
 await expect(cards).toHaveCount(6);
 await expect(cards.locator('.card-context mark')).toHaveText(['Is','am','Are','Perhaps','today','very much']);
 expect(await cards.locator('.card-context mark').last().evaluate(e=>e.getClientRects().length),'very much is one learning chunk').toBe(1);
 await expect(cards.locator('img')).toHaveCount(0);
 const documentFrame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(let group=0;group<2;group++){
  if(group){await frame.getByRole('button',{name:'插画词卡',exact:true}).click();await expect(page).toHaveURL(/page=sample%3Aword-illustrations/);}
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('img')).toHaveCount(group?6:0);
  await expect(cards.locator('.card-context')).toHaveCount(group?0:6);
  const before=await cards.evaluateAll(items=>items.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
  for(let i=0;i<6;i++){
   const card=cards.nth(i);await card.click();await expect(card.locator('.card-meaning')).toBeVisible();await expect(card).toHaveAttribute('aria-expanded','true');
   expect(await card.evaluate(e=>e.scrollHeight-e.clientHeight),await card.getAttribute('data-word')).toBeLessThanOrEqual(1);
   await card.click();await expect(card).toHaveAttribute('aria-expanded','false');
  }
  await page.getByRole('button',{name:'展开词义',exact:true}).click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
  await expect(cards.locator('.card-front:visible')).toHaveCount(0);await expect(cards.locator('.card-back:visible')).toHaveCount(6);
  expect(page.frames().find(f=>f.parentFrame()===page.mainFrame())).toBe(documentFrame);
  const after=await cards.evaluateAll(items=>items.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
  expect(after).toEqual(before);
  await page.getByRole('button',{name:'收起词义',exact:true}).click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
  expect(await frame.locator('body').evaluate(e=>e.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect(frame.locator('#next')).toBeInViewport();
  if(device.id!=='small-phone')for(const card of await cards.all())await expect(card).toBeInViewport();
  await page.locator('#frame-shell').screenshot({path:info.outputPath('group-'+group+'.png')});
 }
 await cards.first().press('Enter');await expect(cards.first()).toHaveAttribute('aria-expanded','true');
 await frame.locator('#context-tab').click();await expect(page).toHaveURL(/page=sample%3Aword-context/);
 expect(errors).toEqual([]);
});
test('the concept sample can return to a real question and reopen without a stuck state switch',async({page})=>{
 const catalog=await(await page.request.get('/review/catalog.json')).json(),question=catalog.courses[0].entries.find(e=>e.kind==='question');
 await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'sample:word-context',device:devices[0].id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await page.locator('.entry[data-page="'+question.id+'"]').click();
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true',{timeout:45000});await expect(page.locator('#error')).toBeHidden();
 await expect(page.locator('#frame-shell iframe:not(.pending)')).toHaveAttribute('src',/\/lesson\/unit1-2\//);
 await expect(page.frameLocator('#frame-shell iframe:not(.pending)').locator('.learning-surface .practice-content')).toBeVisible();
 await page.locator('.entry[data-page="sample:word-context"]').click();await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await expect(page.frameLocator('#frame-shell iframe:not(.pending)').locator('.sample-group:not([hidden]) .sample-card')).toHaveCount(6);
});
