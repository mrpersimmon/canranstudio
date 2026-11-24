'use strict';
const {expect}=require('@playwright/test');
const {inspectWholeBookScene}=require('./whole-book-scene-audit');

// The conversation and the illustration share one stage. The lower art plane
// can be narrower than the stage on desktop.
async function expectContinuousTheatre(room,background){
  const stage=room.locator('.dialogue-stage'),log=room.getByRole('log');
  await expect(stage).toBeVisible();
  await expect(log).toBeVisible();
  await expect(stage).toHaveCSS('background-image',new RegExp(background.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  const layout=await stage.evaluate(stage=>{
    const rect=el=>el.getBoundingClientRect(),s=rect(stage),log=stage.querySelector('.dialogue-log'),l=rect(log);
    const world=stage.querySelector('.learning-story-art'),w=rect(world);
    const contains=(a,b)=>b.width>0&&b.height>0&&b.left>=a.left-1&&b.top>=a.top-1&&b.right<=a.right+1&&b.bottom<=a.bottom+1;
    const people=[...world.querySelectorAll('img.cast-image')].filter(im=>im.getClientRects().length);
    return {log:contains(s,l),world:contains(s,w),textFits:log.scrollWidth<=log.clientWidth+1,
      together:log.parentElement===stage&&world.parentElement===stage,
      portraits:people.map(im=>({loaded:im.complete&&im.naturalWidth>0,inStage:contains(s,rect(im))})),
      inset:stage.dataset.fullScene==='true'&&[...world.querySelectorAll('.room-image')].some(im=>im.getClientRects().length)};
  });
  expect(layout.log&&layout.world&&layout.together&&layout.textFits).toBe(true);
  expect(layout.inset).toBe(false);
  for(const portrait of layout.portraits)expect(portrait).toEqual({loaded:true,inStage:true});
  expect(await room.evaluate(inspectWholeBookScene)).toEqual([]);
}
async function expectTheatrePortrait(image,world,dialogueBottom,prop){
  const painted=await image.evaluate(el=>{
    const box=el.getBoundingClientRect();
    const scale=Math.min(box.width/el.naturalWidth,box.height/el.naturalHeight);
    const width=el.naturalWidth*scale,height=el.naturalHeight*scale;
    const [horizontal,vertical]=getComputedStyle(el).objectPosition.split(' ').map(value=>parseFloat(value)/100);
    const left=box.x+(box.width-width)*horizontal,top=box.y+(box.height-height)*vertical;
    return {left,top,right:left+width,bottom:top+height,height};
  });
  expect(painted.left).toBeGreaterThanOrEqual(world.x-1);
  expect(painted.right).toBeLessThanOrEqual(world.x+world.width+1);
  expect(painted.top).toBeGreaterThanOrEqual(Math.max(world.y,dialogueBottom)-1);
  expect(painted.bottom).toBeLessThanOrEqual(world.y+world.height+1);
  expect(painted.height,'人物应占据舞台的主要高度').toBeGreaterThan(Math.min(220,world.height*.6)-1);
  if(prop){
    const overlapX=Math.min(painted.right,prop.x+prop.width)-Math.max(painted.left,prop.x);
    const overlapY=Math.min(painted.bottom,prop.y+prop.height)-Math.max(painted.top,prop.y);
    expect(Math.min(overlapX,overlapY),'独立的照片、场景道具与人物均应可见').toBeLessThanOrEqual(1);
  }
}
module.exports={expectContinuousTheatre,expectTheatrePortrait};
