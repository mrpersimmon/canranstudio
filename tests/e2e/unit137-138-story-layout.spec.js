'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT137_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of paper278/PDF311:9 original turns,15 complete reading steps.
const lines=[
['julie','Are you doing the football pools, Brian?'],
['brian','Yes, I’ve nearly finished, Julie.'],
['brian','I’m sure we’ll win something this week.'],
['julie','You always say that, but we never win anything!'],
['julie','What will you do if you win a lot of money?'],
['brian','If I win a lot of money I’ll buy you a mink coat.'],
['julie','I don’t want a mink coat! I want to see the world.'],
['brian','All right. If we win a lot of money we’ll travel round the world and we’ll stay at the best hotels.'],
['brian','Then we’ll return home and buy a big house in the country.'],
['brian','We’ll have a beautiful garden and …'],
['julie','But if we spend all that money we’ll be poor again.'],
['julie','What’ll we do then?'],
['brian','If we spend all the money we’ll try and win the football pools again.'],
['julie','It’s a pleasant dream'],
['julie','but everything depends on ‘if’!']
];
const speakers={julie:'Julie',brian:'Brian'};
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const expected=i<=1?'writing':[2,5,7,8,9,12].includes(i)?'imagine':'reply';
 await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);await expect(world.locator('.dream-cast:visible')).toHaveCount(1);
 await expect(world).toHaveAttribute('data-scene','home');await expect(world.locator('.dream-group')).toHaveAttribute('data-pose',expected);await expect(world.locator('.dream-group')).toHaveAttribute('data-cast','pair');
 for(const name of ['writing','imagine','reply']){if(name===expected)await expect(world.locator('.'+name)).toBeVisible();else await expect(world.locator('.'+name)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);
 expect(await world.locator('.dream-cast:visible').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
}
for(const width of [320,390,768,1280])test(width+'：15步完整原文、客厅三种姿态、中文续读与无剧情结论',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit137-138/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.dream-world'),log=room.getByRole('log');
 await expect(room.getByText('What would Julie like to do, if she had the money?（如果Julie有那笔钱，她想做什么？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit137-138/world.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(speakers[lines[i][0]]);await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+(lines[i][0]==='brian'?'left':'right')));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===14?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const materialBottom=b.y+b.height;
  for(const img of await world.locator('.dream-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(materialBottom);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,width:b.width};}));for(let j=0;j<labels.length;j++)for(let k=j+1;k<labels.length;k++)expect(labels[j].x+labels[j].width<=labels[k].x||labels[k].x+labels[k].width<=labels[j].x).toBe(true);
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if([1,2,3,5,6,7,9,10,12,14].includes(i)){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}if(i<14)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(15);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,14);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
