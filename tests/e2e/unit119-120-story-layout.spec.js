'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT119_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of paper242/PDF275: seven narrative paragraphs.
const paragraphs=[
'Do you like stories? I want to tell you a true story. It happened to a friend of mine a year ago.',
'While my friend, George, was reading in bed, two thieves climbed into his kitchen.',
'After they had entered the house, they went into the dining room. It was very dark, so they turned on a torch.',
'Suddenly, they heard a voice behind them. “What’s up? What’s up?” someone called. The thieves dropped the torch and ran away as quickly as they could.',
'George heard the noise and came downstairs quickly.',
'He turned on the light, but he couldn’t see anyone. The thieves had already gone.',
'But George’s parrot, Henry, was still there. “What’s up, George?” he called. “Nothing, Henry,” George said and smiled. “Go back to sleep.”'
];
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const expected=i===1?['george']:i===2||i===3?['thieves']:i===4||i===5?['george']:i===6?['george','henry']:[];
 expect(await world.locator('.dialogue-actor:visible').evaluateAll(es=>es.map(e=>e.dataset.actor).sort())).toEqual(expected.sort());
 await expect(world.locator('.night-cast:visible')).toHaveCount(expected.length);await expect(world).toHaveAttribute('data-place',i===1?'bedroom':i>=5?'lit':'dark');
 for(const[s,v]of [['.george-reading',i===1],['.george-alert',i===4||i===5],['.george-smile',i===6],['.thieves-torch',i===2],['.thieves-running',i===3],['.henry-perch',i===6],['.floor-torch',i===3]]){if(v)await expect(world.locator(s)).toBeVisible();else await expect(world.locator(s)).toBeHidden();}
 await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveCount(0);
 if(i===6){await expect(world.locator('[data-actor="george"]')).toHaveAttribute('data-position','left');await expect(world.locator('[data-actor="henry"]')).toHaveAttribute('data-position','right');}
 for(const img of await world.locator('.night-cast:visible').all())expect(await img.evaluate(e=>getComputedStyle(e).transform)).toBe('none');
}
for(const width of [320,390,768,1280])test(width+'：七段完整叙述、道具交接、Henry末段揭晓与按需中文续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit119-120/#learn/text');
 await expect(page.locator('.unit-intro')).toHaveText('读懂夜里的故事，说清在那之前已经发生了什么。');
 const room=page.locator('.stage-text'),world=room.locator('.night-world'),log=room.getByRole('log');
 await expect(room.getByText('Who called out to the thieves in the dark?（谁在黑暗中对小偷喊话？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit119-120/torch.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<paragraphs.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText('Narrator · 讲述者');await expect(latest.locator('.btext')).toHaveText(paragraphs[i]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(/speaker-left/);await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};}));if(labels.length===2)expect(labels[0].x+labels[0].width<=labels[1].x||labels[1].x+labels[1].width<=labels[0].x).toBe(true);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===6?'完成课文':'下一段',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  for(const img of await world.locator('.night-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(b.y+b.height);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  await room.screenshot({path:info.outputPath('paragraph-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if(i===2||i===3||i===4||i===5){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}
  if(i<6)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(7);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,6);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
