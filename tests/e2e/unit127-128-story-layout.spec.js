'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT127_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independently transcribed from textbook paper258/PDF291; all twelve speaker turns.
const lines=[
['kate','Can you recognize that woman, Liz?'],
['liz','I think I can, Kate. It must be Karen Marsh, the actress.'],
['kate','I thought so. Who’s that beside her?'],
['liz','That must be Conrad Reeves.'],
['kate','Conrad Reeves, the actor? It can’t be. Let me have another look. I think you’re right! Isn’t he her third husband?'],
['liz','No. He must be her fourth or fifth.'],
['kate','Doesn’t Karen Marsh look old!'],
['liz','She does, doesn’t she! I read she’s twenty-nine, but she must be at least forty.'],
['kate','I’m sure she is.'],
['liz','She was a famous actress when I was still at school.'],
['kate','That was a long time ago, wasn’t it?'],
['liz','Not that long ago! I’m not more than twenty-nine myself.']
];
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);await expect(world.locator('.cafe-cast:visible')).toHaveCount(2);
 await expect(world).toHaveAttribute('data-phase',i>=10?'reply':i>=4?'look':'ask');
 for(const[s,v]of [['.kate-ask',i<4||i>=6],['.kate-look',i>=4&&i<6],['.liz-talk',i<10],['.liz-reply',i>=10]]){if(v)await expect(world.locator(s)).toBeVisible();else await expect(world.locator(s)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);
 expect(await world.locator('.cafe-cast:visible').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
}
for(const width of [320,390,768,1280])test(width+'：12轮完整原文、双方朝向、四种姿态和中文续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit127-128/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.cafe-world'),log=room.getByRole('log');
 await expect(room.getByText('Who is only twenty-nine, and why is it so unclear?（谁只有29岁？为什么这件事如此模糊不清？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit127-128/recognize.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(lines[i][0]==='kate'?'Kate':'Liz');await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+(lines[i][0]==='kate'?'left':'right')));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===11?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const guests=world.locator('.cafe-guests');await uncut(guests);const g=await guests.boundingBox();expect(g.y).toBeGreaterThanOrEqual(b.y+b.height);const materialBottom=g.y+g.height;
  for(const img of await world.locator('.cafe-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(materialBottom);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,width:b.width};}));expect(labels[0].x+labels[0].width<=labels[1].x||labels[1].x+labels[1].width<=labels[0].x).toBe(true);
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if([3,4,6,7,8,9,10].includes(i)){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}if(i<11)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(12);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,11);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
