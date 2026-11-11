'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const words=definition(process.cwd(),'unit143-144','/').learning.WORDS.slice(0,6);
for(const device of devices)test(device.name+' reviewed word illustrations retain the six-card layout and original learning text',async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit143-144',page:'words-0',state:'collapsed',device:device.id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),cards=frame.locator('.unit-word'),footer=frame.locator('.word-controls');
 await expect(cards).toHaveCount(6);const start=await footer.boundingBox();
 for(const [i,word]of words.entries()){
  const card=cards.nth(i);await expect(card).toHaveAttribute('data-word-art','illustration');
  await expect(card.locator('img')).toHaveAttribute('src',/\/assets\/word-art-v2\/.+\.webp$/);
  expect(await card.locator('img').evaluate(im=>im.complete&&im.naturalWidth===512)).toBe(true);
  expect(await card.evaluate(e=>e.scrollHeight-e.clientHeight)).toBe(0);
  const box=await card.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);
  await card.click();await expect(card.locator('strong')).toHaveText(word.en);await expect(card.locator('.word-phonetic')).toHaveText(word.ph);await expect(card.locator('.word-meaning')).toHaveText(word.cn);await expect(card.locator('.word-meaning')).toBeVisible();
  expect((await footer.boundingBox()).y).toBe(start.y);await card.click();
 }
 await page.locator('#frame-shell').screenshot({path:info.outputPath('unit143-reviewed-word-art.png')});
 await page.goto('/?'+new URLSearchParams({unit:'unit7-8',page:'words-2',state:'collapsed',device:device.id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const self=frame.getByRole('button',{name:'I',exact:true});await expect(self.locator('img')).toHaveAttribute('src',/\/unit7-8\/i\.svg$/);
 await self.click();await expect(self.locator('.word-meaning')).toHaveText('我；说话的人指自己');await expect(footer).toBeInViewport();
});
