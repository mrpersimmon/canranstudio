'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT79_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of textbook paper162 / PDF195.
const lines=[
['Tom','What are you doing, Carol?'],['Carol','I’m making a shopping list, Tom.'],['Tom','What do we need?'],['Carol','We need a lot of things this week.'],['Carol','I must go to the grocer’s. We haven’t got much tea or coffee, and we haven’t got any sugar or jam.'],['Tom','What about vegetables?'],['Carol','I must go to the greengrocer’s. We haven’t got many tomatoes, but we’ve got a lot of potatoes.'],['Carol','I must go to the butcher’s, too. We need some meat. We haven’t got any meat at all.'],['Tom','Have we got any beer and wine?'],['Carol','No, we haven’t. And I’m not going to get any!'],['Tom','I hope that you’ve got some money.'],['Carol','I haven’t got much.'],['Tom','Well, I haven’t got much either!']
];
async function uncut(image){await image.evaluate(i=>i.decode());const edge=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)count++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)count++;return count;});expect(edge).toBe(0);}
for(const width of [320,390,768,1280])test(`${width}：13轮原文、真实说话人、人物完整与历史重进`,async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit79-80/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.visit-world'),log=room.getByRole('log');
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<13;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bname')).toHaveText(lines[i][0]);await expect(latest).toHaveClass(new RegExp(lines[i][0]==='Tom'?'speaker-right':'speaker-left'));
  await expect(world).toHaveAttribute('data-stock',i>=10?'money':i>=9?'plan':i>=7?'meat':i>=6?'vegetables':i>=4?'groceries':'start');
  await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===12?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox(),note=await world.locator('.story-timeline').boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);expect(note.y).toBeGreaterThanOrEqual(b.y+b.height);
  for(const img of await world.locator('.visit-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(note.y+note.height).toBeLessThanOrEqual(a.y);const shownHeight=await img.evaluate(el=>{const box=el.getBoundingClientRect();return Math.min(box.width/el.naturalWidth,box.height/el.naturalHeight)*el.naturalHeight;});expect(shownHeight).toBeGreaterThan(width<600?145:210);}
  for(const label of await world.locator('.actor-label:visible').all()){const a=await label.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);}
  await expect(world.locator('.dialogue-actor')).toHaveCount(2);await expect(world.locator('.at-left img')).toHaveAttribute('alt',/面向右侧的Tom/);await expect(world.locator('.at-right img')).toHaveAttribute('alt',/面向左侧的Carol/);
  if([0,4,6,7,9,12].includes(i)){await room.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});}
  if(i===6){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(7);await expect(world).toHaveAttribute('data-stock','vegetables');}
  if(i<12)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(13);await expect(world).toHaveAttribute('data-stock','money');await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
