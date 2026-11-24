'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const flagPages=[['French','German','Japanese','South Korean','Chinese','Swedish'],['English','American']];
const words=definition(process.cwd(),'unit5-6','/').learning.WORDS;

for(const device of devices)test('flag meanings reveal only on demand: '+device.id,async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit5-6',page:'words-0',state:'collapsed',device:device.id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)');
 await expect(frame.locator('body')).toHaveAttribute('data-practice-viewport',device.viewport.width+'x'+device.viewport.height);
 for(const [index,flags]of flagPages.entries()){
  if(index)await frame.getByRole('button',{name:'下一组',exact:true}).click();
  await expect(frame.locator('#wordPageProgress')).toHaveText((index+1)+' / 4');
  const footer=await frame.locator('.word-controls').boundingBox();
  for(const word of flags){
   const card=frame.getByRole('button',{name:word,exact:true});await expect(card).toBeInViewport();
   expect(await card.innerText()).not.toMatch(/\p{Script=Han}/u);
   const source=await card.locator('img').getAttribute('src'),response=await page.request.get(source);
   expect(response.ok()).toBe(true);expect(await response.text()).not.toMatch(/\p{Script=Han}|<text\b|aria-label=|<rect[^>]*y="92"/u);
   expect(await card.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  }
  await page.locator('#frame-shell').screenshot({path:info.outputPath('front-'+index+'.png')});
  for(const word of flags){
   const card=frame.getByRole('button',{name:word,exact:true}),box=await card.boundingBox();await card.click();
   await expect(card.locator('.word-meaning')).toBeVisible();await expect(card.locator('.word-meaning')).toHaveText(words.find(w=>w.en===word).cn);
   expect(await card.boundingBox()).toEqual(box);expect(await card.evaluate(e=>e.scrollHeight-e.clientHeight)).toBeLessThanOrEqual(1);
  }
  await page.locator('#frame-shell').screenshot({path:info.outputPath('revealed-'+index+'.png')});
  for(const word of flags){const card=frame.getByRole('button',{name:word,exact:true});await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
  expect(await frame.locator('.word-controls').boundingBox()).toEqual(footer);
  expect(await frame.locator('.word-controls').evaluate(e=>e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(device.viewport.height-5);
 }
});
