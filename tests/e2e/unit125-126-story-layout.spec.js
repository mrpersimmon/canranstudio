'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT125_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independently transcribed from paper254/PDF287. Consecutive Susan turns stay separate.
const lines=[
['susan','Can’t you come in and have tea now, Peter?'],
['peter','Not yet. I must water the garden first.'],
['susan','Do you have to water it now?'],
['peter','I’m afraid I must. Look at it! It’s terribly dry.'],
['susan','What a nuisance!'],
['peter','Last summer it was very dry, too. Don’t you remember? I had to water it every day.'],
['susan','Well, I’ll have tea by myself.'],
['susan','That was quick! Have you finished already?'],
['peter','Yes. Look out of the window.'],
['susan','It’s raining! That means you don’t need to water the garden.'],
['peter','That was a pleasant surprise. It means I can have tea, instead.']
];
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const tea=i>=9,inside=i>=7;await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);await expect(world.locator('.garden-cast:visible')).toHaveCount(tea?0:2);await expect(world.locator('.garden-group-image:visible')).toHaveCount(tea?1:0);
 await expect(world).toHaveAttribute('data-phase',tea?'tea':inside?'rain':'garden');await expect(world).toHaveAttribute('data-watering',inside?'false':'true');
 for(const[s,v]of [['.peter-water',!inside],['.peter-point',inside&&!tea],['.susan-invite',i<4],['.susan-disappointed',i>=4&&i<7],['.susan-look',inside&&!tea],['.rain-window',inside]]){if(v)await expect(world.locator(s)).toBeVisible();else await expect(world.locator(s)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);
 expect(await world.locator('.garden-cast:visible,.garden-group-image:visible').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
}
for(const width of [320,390,768,1280])test(width+'：11轮完整原文、浇水与看雨切景、双人茶桌和中文续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit125-126/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.garden-world'),log=room.getByRole('log');
 await expect(room.getByText('Does Susan have tea by herself?（Susan是一个人喝茶吗？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit125-126/tea.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(lines[i][0]==='peter'?'Peter':'Susan');await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+(lines[i][0]==='peter'?'left':'right')));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===10?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  let materialBottom=b.y+b.height;if(i>=7){const rain=await world.locator('.rain-window').boundingBox();expect(rain.y).toBeGreaterThanOrEqual(materialBottom);materialBottom=rain.y+rain.height;}
  for(const img of await world.locator('.garden-cast:visible,.garden-group-image:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(materialBottom);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,width:b.width};}));expect(labels[0].x+labels[0].width<=labels[1].x||labels[1].x+labels[1].width<=labels[0].x).toBe(true);
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if([3,4,6,7,8,9,10].includes(i)){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}if(i<10)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(11);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,10);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
