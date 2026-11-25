'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');

// A miniature room beside two small portraits can pass clipping checks while
// still breaking the accepted Lesson 1–2 theatre composition.
const reviewDevices=[...devices,{id:'small-phone',name:'320 小屏压力'}];
for(const device of reviewDevices)test('room story shares one illustrated stage on '+device.name,async({page},info)=>{
 await page.goto('/?'+new URLSearchParams({unit:'unit29-30',page:'story-3',state:'english',device:device.id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),stage=frame.locator('.learning-surface .dialogue-stage');
 await expect(frame.locator('.dialogue-log .bubble-row').last().locator('.btext')).toHaveText('What must I do, Mrs. Jones?');
 await page.locator('#frame-shell').screenshot({path:info.outputPath('story-'+device.id+'.png')});
 const geometry=await stage.evaluate(e=>{
  const box=e.getBoundingClientRect(),room=e.querySelector('.room-furniture').getBoundingClientRect(),cast=[...e.querySelectorAll('.desk-cast .cast-image')].map(image=>{
   const r=image.getBoundingClientRect();return {left:r.left,right:r.right,paintedHeight:Math.min(r.height,r.width*image.naturalHeight/image.naturalWidth)};
  });
  return {background:getComputedStyle(e).backgroundImage,log:getComputedStyle(e.querySelector('.dialogue-log')).backgroundColor,width:box.width,height:box.height,roomWidth:room.width,cast};
 });
 expect(geometry.background,'a continuous environment is required, not a blank paper behind an inset diagram').toMatch(/url\(/);
 expect(geometry.log).toBe('rgba(0, 0, 0, 0)');
 expect(geometry.roomWidth).toBeGreaterThanOrEqual(geometry.width*.97);
 expect(geometry.cast[1].right-geometry.cast[0].left).toBeGreaterThan(geometry.width*.8);
 for(const actor of geometry.cast)expect(actor.paintedHeight,'characters must remain readable, like the Lesson 1–2 reference').toBeGreaterThan(geometry.width*.3);
 await frame.locator('.dialogue-log .bubble-row').last().getByRole('button',{name:'看中文'}).click();
 await expect(frame.locator('.dialogue-log .bubble-row').last().locator('.bcn')).toBeVisible();
 const before=await stage.boundingBox();
 await frame.locator('.learning-surface .stage-ctrl>.btn-green').click();
 await expect(frame.locator('.dialogue-log .bubble-row').last().locator('.btext')).toHaveText('Open the window and air the room.');
 expect(await stage.boundingBox()).toEqual(before);
 await expect(frame.locator('.learning-story-art')).toHaveAttribute('data-focus','window');
 const focus=await frame.locator('.room-focus').boundingBox();
 expect(focus.width).toBeGreaterThan(50);
 await page.locator('#frame-shell').screenshot({path:info.outputPath('window-'+device.id+'.png')});
});
