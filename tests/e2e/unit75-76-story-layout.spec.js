'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT75_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of textbook paper154 / PDF187.
const lines=[
['Lady','Do you have any shoes like these?'],['Shop assistant','What size?'],['Lady','Size five.'],['Shop assistant','What colour?'],['Lady','Black.'],['Shop assistant','I’m sorry. We don’t have any.'],['Lady','But my sister bought this pair last month.'],['Shop assistant','Did she buy them here?'],['Lady','No, she bought them in the U.S.'],['Shop assistant','We had some shoes like those a month ago, but we don’t have any now.'],['Lady','Can you get a pair for me, please?'],['Shop assistant','I’m afraid that I can’t. They were in fashion last year and the year before last. But they’re not in fashion this year.'],['Shop assistant','These shoes are in fashion now.'],['Lady','They look very uncomfortable.'],['Shop assistant','They are very uncomfortable. But women always wear uncomfortable shoes!']
];
async function uncut(image){await image.evaluate(i=>i.decode());const edge=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)count++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)count++;return count;});expect(edge).toBe(0);}
for(const width of [320,390,768,1280])test(`${width}：15轮原文、真实说话人、人物完整与历史重进`,async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit75-76/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.visit-world'),log=room.getByRole('log');
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<15;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bname')).toHaveText(lines[i][0]);await expect(latest).toHaveClass(new RegExp(lines[i][0]==='Shop assistant'?'speaker-right':'speaker-left'));
  await expect(world).toHaveAttribute('data-offer',String(i>=12));
  await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);
  await expect(world.locator('[data-actor="assistant"] img')).toHaveAttribute('src',new RegExp((i<12?'assistant':'assistant-shoes')+'\\.webp$'));
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===14?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox(),note=await world.locator('.story-timeline').boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);expect(note.y).toBeGreaterThanOrEqual(b.y+b.height);
  for(const img of await world.locator('.visit-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(note.y+note.height).toBeLessThanOrEqual(a.y);const shownHeight=await img.evaluate(el=>{const box=el.getBoundingClientRect();return Math.min(box.width/el.naturalWidth,box.height/el.naturalHeight)*el.naturalHeight;});expect(shownHeight).toBeGreaterThan(width<600?145:210);}
  for(const label of await world.locator('.actor-label:visible').all()){const a=await label.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);}
  await expect(world.locator('.dialogue-actor')).toHaveCount(2);await expect(world.locator('.at-left img')).toHaveAttribute('alt',/面向右侧的售货员/);await expect(world.locator('.at-right img')).toHaveAttribute('alt',/面向.*女士/);
  if([0,5,9,11,12,14].includes(i)){await room.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});}
  if(i===10){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(11);await expect(world).toHaveAttribute('data-offer','false');}
  if(i===14)await expect(latest.locator('.story-note')).toContainText('不能代表每个人');
  if(i<14)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(15);await expect(world).toHaveAttribute('data-offer','true');await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
