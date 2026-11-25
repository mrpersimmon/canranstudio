'use strict';
const {test,expect}=require('@playwright/test'),{devices}=require('../support/required-phone-devices');
for(const device of devices)test('word hint stays still while reading on '+device.name,async({page})=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit1-2',page:'words-2',state:'collapsed',device:device.id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 const s=page.frameLocator('#frame-shell iframe:not(.pending)').locator('.learning-surface'),hint=s.locator('.learning-word-destination');
 await expect(hint).toHaveText('点词卡，看词义');
 const count=await hint.evaluate(async label=>{
  await document.fonts.ready;const frames=n=>new Promise(r=>{function tick(){if(--n)requestAnimationFrame(tick);else r();}requestAnimationFrame(tick);});
  await frames(12);let changes=0;const observer=new MutationObserver(rs=>changes+=rs.length);
  observer.observe(label,{childList:true,attributes:true,attributeFilter:['hidden']});
  await frames(30);observer.disconnect();return changes;
 });expect(count).toBe(0);
 const card=s.locator('.unit-word').first();await card.click();await expect(card).toHaveAttribute('aria-expanded','true');
 await s.locator('.word-controls button').last().click();await expect(hint).toContainText('接下来');
});
