'use strict';
const {test,expect}=require('@playwright/test');
const lines=['Do you want any meat today, Mrs. Bird?','Yes, please.','Do you want beef or lamb?','Beef, please.','This lamb’s very good.','I like lamb, but my husband doesn’t.','What about some steak? This is a nice piece.','Give me that piece, please. And a pound of mince, too.','Do you want a chicken, Mrs. Bird? They’re very nice.','No, thank you. My husband likes steak, but he doesn’t like chicken.','To tell you the truth, Mrs. Bird, I don’t like chicken either!'];
async function uncut(image){
 await image.evaluate(i=>i.decode());
 const edge=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)count++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)count++;return count;});expect(edge).toBe(0);
}
for(const width of [320,390,768,1280])test(`${width}：11段对白及中文在场景内，人物相向完整，肉块交接随原文变化`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit49-50/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.market-world'),log=room.getByRole('log');
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<11;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.btext')).toHaveText(lines[i]);
  await expect(world).toHaveAttribute('data-steak',i<6?'counter':i===6?'butcher':'bird');await expect(world).toHaveAttribute('data-mince',String(i>=7));
  if(i>=6)await expect(world.locator('.market-steak')).toBeHidden();if(i>=7)await expect(world.locator('.market-mince')).toBeVisible();
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===10?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),last=await latest.boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(b.y+b.height).toBeLessThanOrEqual(w.y+w.height);
  expect(last.y).toBeGreaterThanOrEqual(b.y-1);expect(last.y+last.height).toBeLessThanOrEqual(b.y+b.height+1);
  for(const who of ['butcher','bird']){
   const actor=world.locator('.actor-'+who),img=actor.locator('img'),a=await actor.boundingBox();await uncut(img);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(b.y+b.height).toBeLessThanOrEqual(a.y);
   const direction=await img.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).a);expect(direction).toBeGreaterThan(0); // source butcher faces right; source Mrs. Bird faces left; neither label nor face is mirrored.
  }
  expect(await world.locator('.actor-butcher').evaluate(e=>e.getBoundingClientRect().x)).toBeLessThan(await world.locator('.actor-bird').evaluate(e=>e.getBoundingClientRect().x));
  if([0,6,7,10].includes(i)){await room.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});}
  if(i===7){await page.reload();await expect(world).toHaveAttribute('data-steak','bird');await expect(room.locator('.bubble-row')).toHaveCount(8);}
  if(i<10)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(11);await expect(world.locator('.actor-bird>img')).toHaveAttribute('src',/bird-parcel/);
 await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
