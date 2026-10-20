'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT129_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription: textbook paper262/PDF295, fourteen turns including consecutive police turns.
const lines=[
['ann','Look, Gary! That policeman’s waving to you. He wants you to stop.'],
['policeman','Where do you think you are? On a race track? You must have been driving at seventy miles an hour.'],
['gary','I can’t have been.'],
['policeman','I was doing eighty when I overtook you.'],
['policeman','Didn’t you see the speed limit?'],
['gary','I’m afraid I didn’t, officer. I must have been dreaming.'],
['ann','He wasn’t dreaming, officer. I was telling him to drive slowly.'],
['gary','That’s why I didn’t see the sign.'],
['policeman','Let me see your driving licence.'],
['policeman','I won’t charge you this time. But you’d better not do it again!'],
['gary','Thank you. I’ll certainly be more careful.'],
['ann','I told you to drive slowly, Gary.'],
['gary','You always tell me to drive slowly, darling.'],
['ann','Well, next time you’d better take my advice!']
];
const speakers={ann:'Ann',gary:'Gary',policeman:'Policeman'};
const side=(i,who)=>who==='policeman'||i>=11&&who==='gary'?'right':'left';
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const ending=i>=11;await expect(world.locator('.dialogue-actor:visible')).toHaveCount(ending?2:3);await expect(world.locator('.road-cast:visible')).toHaveCount(1);
 await expect(world.locator('.road-group')).toHaveAttribute('data-phase',ending?'advice':i>=8?'licence':i<=0?'wave':'talk');
 for(const[s,v]of [['.group-wave',i<=0],['.group-talk',i>0&&i<8],['.group-licence',i>=8&&i<11],['.couple-advice',ending]]){if(v)await expect(world.locator(s)).toBeVisible();else await expect(world.locator(s)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);
 expect(await world.locator('.road-cast:visible').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
}
for(const width of [320,390,768,1280])test(width+'：14轮完整原文、三人比例、驾照唯一与中文续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit129-130/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.road-world'),log=room.getByRole('log');
 await expect(room.getByText('What does Ann advise her husband to do next time?（Ann建议她的丈夫下次做什么？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit129-130/sign.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(speakers[lines[i][0]]);await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+side(i,lines[i][0])));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const car=world.locator('.parked-car');await car.evaluate(e=>e.decode());const c=await car.boundingBox();expect(c.y).toBeGreaterThanOrEqual(b.y+b.height);const materialBottom=c.y+c.height;
  for(const img of await world.locator('.road-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(materialBottom);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,width:b.width};}).sort((a,b)=>a.x-b.x));for(let k=1;k<labels.length;k++)expect(labels[k-1].x+labels[k-1].width).toBeLessThanOrEqual(labels[k].x);
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if([3,4,6,7,8,9,10].includes(i)){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}if(i<13)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(14);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,13);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
