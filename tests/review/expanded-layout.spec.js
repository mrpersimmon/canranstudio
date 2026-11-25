'use strict';
const {test,expect}=require('@playwright/test'),{devices}=require('../support/required-phone-devices');
for(const [unit,id]of [['unit17-18','u1718-five-g-irregular'],['unit17-18','u1718-five-g-whole-plural'],['unit21-22','u2122-five-g-which-question']])test('expanded sample short task fits: '+id,async({page})=>{
 for(const device of devices){let actionTop;
  for(const state of ['before','correct']){
   await page.goto('/?'+new URLSearchParams({unit,page:'q:'+id,state,device:device.id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
   const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),content=frame.locator('.learning-surface .practice-content');
   expect(await content.evaluate(e=>e.scrollHeight-e.clientHeight),id+' '+device.id+' '+state).toBeLessThanOrEqual(1);
   const model=content.locator('.grammar-model');expect(await model.evaluate(e=>e.scrollHeight-e.clientHeight),'short model stays completely readable').toBeLessThanOrEqual(1);
   const actions=await frame.locator('.learning-surface .practice-submit-row').boundingBox();if(actionTop!==undefined)expect(actions.y).toBe(actionTop);actionTop=actions.y;
   // The bench may visually scale a Pro Max to fit the desktop window. Touch
   // targets are measured inside the phone frame, in CSS px, not outer pixels.
   for(const token of await content.locator('.wordbank .word-token,.translation-answer .opt-btn').all())expect(await token.evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
 }
});
