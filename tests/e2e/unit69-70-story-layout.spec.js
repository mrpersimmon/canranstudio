'use strict';
const {test,expect}=require('@playwright/test');
// Independently transcribed from textbook paper138 / PDF171.
const lines=[
'There is a car race near our town every year. In 1995, there was a very big race.',
'There were hundreds of people there. My wife and I were at the race. Our friends Julie and Jack were there, too. You can see us in the crowd. We are standing on the left.',
'There were twenty cars in the race. There were English cars, French cars, German cars, Italian cars, American cars and Japanese cars.',
'It was an exciting finish. The winner was Billy Stewart. He was in car number fifteen. Five other cars were just behind him.',
'On the way home, my wife said to me, “Don’t drive so quickly! You’re not Billy Stewart!”'];
async function uncut(image){await image.evaluate(i=>i.decode());const edge=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)count++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)count++;return count;});expect(edge).toBe(0);}
for(const width of [320,390,768,1280])test(`${width}：5段完整叙述，人物同源完整，时间线与历史重进`,async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit69-70/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.visit-world'),log=room.getByRole('log');
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<5;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.btext')).toHaveText(lines[i]);await expect(latest.locator('.bname')).toHaveText('我 · 叙述者');
  await expect(world).toHaveAttribute('data-beat',['town','crowd','cars','finish','home'][i]);if(i===4)await expect(world.locator('.visit-location')).toContainText('不是赛道');if(i===3)await expect(world.locator('.story-race-car')).toBeVisible();
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===4?'完成课文':'下一段',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox(),note=await world.locator('.story-timeline').boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);expect(note.y).toBeGreaterThanOrEqual(b.y+b.height);
  for(const img of await world.locator('.visit-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(note.y+note.height,'paragraph '+i+' note '+JSON.stringify(note)+' actor '+JSON.stringify(a)).toBeLessThanOrEqual(a.y);const shownHeight=await img.evaluate(el=>{const box=el.getBoundingClientRect();return Math.min(box.width/el.naturalWidth,box.height/el.naturalHeight)*el.naturalHeight;});expect(shownHeight).toBeGreaterThan(width<600?145:210);}
  if(i===1)for(const person of await world.locator('.dialogue-actor').all()){const a=await person.boundingBox();expect(a.x+a.width).toBeLessThan(w.x+w.width*.76);}
  if(i===3){const car=await world.locator('.story-race-car').boundingBox();expect(car.y).toBeGreaterThan(note.y+note.height);for(const person of await world.locator('.dialogue-actor').all()){const a=await person.boundingBox();expect(car.x+car.width<=a.x||car.x>=a.x+a.width).toBe(true);}}
  for(const label of await world.locator('.actor-label:visible').all()){const a=await label.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);}
  await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);await expect(world.locator('.at-left:visible img')).toHaveAttribute('alt',/面向右侧的妻子/);await expect(world.locator('.at-right:visible img')).toHaveAttribute('alt',/面向左侧的丈夫/);
  if([0,1,2,3,4].includes(i)){await room.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});}
  if(i===2){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(3);await expect(world).toHaveAttribute('data-beat','cars');}
  if(i<4)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(5);await expect(world).toHaveAttribute('data-beat','home');await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
