'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT117_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of paper238/PDF271. Six narrative paragraphs;
// the mother's narrative retains embedded quotations instead of inventing turns.
const paragraphs=[
'When my husband was going into the dining room this morning, he dropped some coins on the floor.',
'There were coins everywhere. We looked for them, but we could not find them all.',
'While we were having breakfast, our little boy, Tommy, found two small coins on the floor.',
'He put them both into his mouth. We both tried to get the coins, but it was too late. Tommy had already swallowed them!',
'Later that morning, when I was doing the housework, my husband phoned me from the office.',
'“How’s Tommy?” he asked. “I don’t know,” I answered, “Tommy’s been to the toilet three times this morning, but I haven’t had any change yet!”'
];
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const child=i===2||i===3;expect(await world.locator('.dialogue-actor:visible').evaluateAll(es=>es.map(e=>e.dataset.actor).sort())).toEqual((child?['mother','tommy']:['mother','father']).sort());
 await expect(world.locator('.breakfast-cast:visible')).toHaveCount(2);await expect(world).toHaveAttribute('data-place',i>=4?'phone':'dining');
 const poses=[['.mother-neutral',i<2],['.mother-breakfast',i===2],['.mother-concerned',i===3],['.mother-phone',i>=4],['.father-phone',i>=4],['.coins-scattered',i===0||i===1],['.two-coins',i===2]];
 for(const[s,v]of poses){if(v)await expect(world.locator(s)).toBeVisible();else await expect(world.locator(s)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor','mother');
 if(i>=4){await expect(world.locator('[data-actor="mother"] .actor-label')).toHaveText('Mother · 家中');await expect(world.locator('[data-actor="father"] .actor-label')).toHaveText('Father · 办公室');}
 for(const img of await world.locator('.breakfast-cast:visible').all())expect(await img.evaluate(e=>getComputedStyle(e).transform)).toBe('none');
}
for(const width of [320,390,768,1280])test(width+'：六段完整叙述、三人身份、电话两端与按需中文续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit117-118/#learn/text');
 await expect(page.locator('.unit-intro')).toHaveText('读懂早餐时的故事，说清过去那时正在做什么。');
 const room=page.locator('.stage-text'),world=room.locator('.breakfast-world'),log=room.getByRole('log');
 await expect(room.getByText('What does she mean by “change” in the last sentence?（最后一句的change是什么意思？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit117-118/coin.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<paragraphs.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText('Mother · 讲述者');await expect(latest.locator('.btext')).toHaveText(paragraphs[i]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(/speaker-left/);await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};}));expect(labels[0].x+labels[0].width<=labels[1].x||labels[1].x+labels[1].width<=labels[0].x).toBe(true);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===5?'完成课文':'下一段',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  for(const img of await world.locator('.breakfast-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(b.y+b.height);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);const child=await img.evaluate(e=>e.closest('[data-actor]').dataset.actor==='tommy');expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(child?120:width<600?150:220);}
  await room.screenshot({path:info.outputPath('paragraph-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if(i===2||i===3||i===4||i===5){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}
  if(i<5)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(6);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,5);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
