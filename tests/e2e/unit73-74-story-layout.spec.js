'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT73_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of textbook paper150 / PDF183.
const lines=[
['故事','Last week Mrs. Mills went to London.'],
['故事','She does not know London very well, and she lost her way.'],
['故事','Suddenly, she saw a man near a bus stop.'],
['Mrs. Mills · 心里想','“I can ask him the way,” she said to herself.'],
['Mrs. Mills','“Excuse me,” she said.'],
['Mrs. Mills','“Can you tell me the way to King Street, please?”'],
['故事','The man smiled pleasantly.'],
['故事','He did not understand English!'],
['故事','He spoke German.'],
['故事','He was a tourist.'],
['故事','Then he put his hand into his pocket, and took out a phrasebook.'],
['故事','He opened the book and found a phrase.'],
['故事','He read the phrase slowly.'],
['The tourist','“I am sorry,” he said. “I do not speak English.”']
];
async function uncut(image){await image.evaluate(i=>i.decode());const edge=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)count++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)count++;return count;});expect(edge).toBe(0);}
for(const width of [320,390,768,1280])test(`${width}：14句原文、真实说话人、人物完整与历史重进`,async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit73-74/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.visit-world'),log=room.getByRole('log');
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<14;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bname')).toHaveText(lines[i][0]);await expect(latest).toHaveClass(new RegExp(lines[i][0]==='故事'?'speaker-narrator':lines[i][0]==='The tourist'?'speaker-right':'speaker-left'));
  await expect(world).toHaveAttribute('data-book',i<10?'pocket':i===10?'closed':'open');
  await expect(world.locator('.dialogue-actor:visible')).toHaveCount(i<2?1:2);
  if(i>=2)await expect(world.locator('[data-actor="tourist"] img')).toHaveAttribute('src',new RegExp((i<10?'tourist':i===10?'tourist-closed':'tourist-reading')+'\\.webp$'));
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox(),note=await world.locator('.story-timeline').boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);expect(note.y).toBeGreaterThanOrEqual(b.y+b.height);
  for(const img of await world.locator('.visit-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(note.y+note.height).toBeLessThanOrEqual(a.y);const shownHeight=await img.evaluate(el=>{const box=el.getBoundingClientRect();return Math.min(box.width/el.naturalWidth,box.height/el.naturalHeight)*el.naturalHeight;});expect(shownHeight).toBeGreaterThan(width<600?145:210);}
  for(const label of await world.locator('.actor-label:visible').all()){const a=await label.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);}
  await expect(world.locator('.dialogue-actor')).toHaveCount(2);await expect(world.locator('.at-left img')).toHaveAttribute('alt',/面向右侧的游客/);if(i>=2)await expect(world.locator('.at-right img')).toHaveAttribute('alt',/面向.*Mills夫人/);
  if([0,3,5,10,11,13].includes(i)){await room.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});}
  if(i===10){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(11);await expect(world).toHaveAttribute('data-book','closed');}
  if(i<13)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(14);await expect(world).toHaveAttribute('data-book','open');await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
