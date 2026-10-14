'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT77_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of textbook paper158 / PDF191.
const lines=[
['Nurse','Good morning, Mr. Croft.'],['Mr. Croft','Good morning, nurse. I want to see the dentist, please.'],['Nurse','Do you have an appointment?'],['Mr. Croft','No, I don’t.'],['Nurse','Is it urgent?'],['Mr. Croft','Yes, it is. It’s very urgent. I feel awful. I have a terrible toothache.'],['Nurse','Can you come at 10 a.m. on Monday, April 24th?'],['Mr. Croft','I must see the dentist now, nurse.'],['Nurse','The dentist is very busy at the moment. Can you come at 2 p.m.?'],['Mr. Croft','That’s very late. Can the dentist see me now?'],['Nurse','I’m afraid that he can’t, Mr. Croft. Can’t you wait till this afternoon?'],['Mr. Croft','I can wait, but my toothache can’t!']
];
async function uncut(image){await image.evaluate(i=>i.decode());const edge=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let count=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)count++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)count++;return count;});expect(edge).toBe(0);}
for(const width of [320,390,768,1280])test(`${width}：12轮原文、真实说话人、人物完整与历史重进`,async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit77-78/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.visit-world'),log=room.getByRole('log');
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<12;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bname')).toHaveText(lines[i][0]);await expect(latest).toHaveClass(new RegExp(lines[i][0]==='Nurse'?'speaker-right':'speaker-left'));
  await expect(world).toHaveAttribute('data-proposal',i>=8?'afternoon':i>=6?'morning':'none');
  await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===11?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();const after=await next.boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox(),note=await world.locator('.story-timeline').boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);expect(note.y).toBeGreaterThanOrEqual(b.y+b.height);
  for(const img of await world.locator('.visit-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(note.y+note.height).toBeLessThanOrEqual(a.y);const shownHeight=await img.evaluate(el=>{const box=el.getBoundingClientRect();return Math.min(box.width/el.naturalWidth,box.height/el.naturalHeight)*el.naturalHeight;});expect(shownHeight).toBeGreaterThan(width<600?145:210);}
  for(const label of await world.locator('.actor-label:visible').all()){const a=await label.boundingBox();expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);}
  await expect(world.locator('.dialogue-actor')).toHaveCount(2);await expect(world.locator('.at-left img')).toHaveAttribute('alt',/面向右侧护士/);await expect(world.locator('.at-right img')).toHaveAttribute('alt',/面向左侧的克罗夫特先生/);
  if([0,5,6,8,10,11].includes(i)){await room.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});}
  if(i===6){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(7);await expect(world).toHaveAttribute('data-proposal','morning');}
  if(i<11)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(12);await expect(world).toHaveAttribute('data-proposal','afternoon');await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
