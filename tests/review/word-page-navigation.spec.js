'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
for(const device of devices)test('word directory pages reuse the ready course on '+device.name,async({page})=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit25-26',page:'words-0',device:device.id}));await expect(page.locator('#loading')).toBeHidden({timeout:60000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame()),origin=await frame.evaluate(()=>performance.timeOrigin);
 for(const index of [4,2,5,0]){
  await page.locator('.entry[data-page="words-'+index+'"]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(page.locator('#error')).toBeHidden();
  expect(page.frames().find(f=>f.parentFrame()===page.mainFrame())).toBe(frame);expect(await frame.evaluate(()=>performance.timeOrigin)).toBe(origin);
  await expect(frame.locator('#wordPageProgress')).toHaveText((index+1)+' / 6');await expect(page.locator('iframe')).toHaveCount(1);
  await page.locator('#state-buttons [data-state="expanded"]').click();await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(frame.locator('.unit-word').first()).toHaveAttribute('aria-expanded','true');
  expect(await frame.evaluate(()=>performance.timeOrigin)).toBe(origin);
 }
});
