'use strict';
const {test,expect}=require('@playwright/test');
const lines=['Do you like coffee, Ann?','Yes, I do.','Do you want a cup?','Yes, please, Christine.','Do you want any sugar?','Yes, please.','Do you want any milk?','No, thank you. I don’t like milk in my coffee. I like black coffee.','Do you like biscuits?','Yes, I do.','Do you want one?','Yes, please.'];
async function uncut(image){
 await image.evaluate(i=>i.decode());
 const edge=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)count++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)count++;return count;});expect(edge).toBe(0);
}
for(const width of [320,390,768,1280])test(`${width}：12段对白及中文在场景内，人物相向完整，糖奶饼干变化准确`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit47-48/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.coffee-world'),log=room.getByRole('log');
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<12;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.btext')).toHaveText(lines[i]);
  await expect(world).toHaveAttribute('data-cup',i<3?'table':'ann');await expect(world).toHaveAttribute('data-sugar',String(i>=5));await expect(world).toHaveAttribute('data-milk',i<7?'waiting':'declined');await expect(world).toHaveAttribute('data-biscuit',i<11?'table':'ann');
  await expect(world.locator('.coffee-milk')).toBeVisible();if(i>=3)await expect(world.locator('.coffee-cup')).toBeHidden();if(i===11)await expect(world.locator('.coffee-biscuit')).toBeHidden();
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===11?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),last=await latest.boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(b.y+b.height).toBeLessThanOrEqual(w.y+w.height);
  expect(last.y).toBeGreaterThanOrEqual(b.y-1);expect(last.y+last.height).toBeLessThanOrEqual(b.y+b.height+1);
  for(const who of ['christine','ann']){
   const actor=world.locator('.actor-'+who),img=actor.locator('img'),a=await actor.boundingBox();await uncut(img);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(b.y+b.height).toBeLessThanOrEqual(a.y);
   const direction=await img.evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).a);expect(direction).toBeGreaterThan(0); // source Christine faces right; source Ann faces left; neither label nor face is mirrored.
  }
  expect(await world.locator('.actor-christine').evaluate(e=>e.getBoundingClientRect().x)).toBeLessThan(await world.locator('.actor-ann').evaluate(e=>e.getBoundingClientRect().x));
  if([0,5,7,11].includes(i)){await room.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});}
  if(i===7){await page.reload();await expect(world).toHaveAttribute('data-milk','declined');await expect(room.locator('.bubble-row')).toHaveCount(8);}
  if(i<11)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(12);await expect(world.locator('.actor-ann>img')).toHaveAttribute('src',/ann-biscuit/);
 await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
