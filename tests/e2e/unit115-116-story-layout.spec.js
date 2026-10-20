'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT115_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription from paper234/PDF267; four speakers, fourteen turns.
const lines=[
['Helen','Isn’t there anyone at home?'],
['Jim','I’ll knock again, Helen. Everything’s very quiet. I’m sure there’s no one at home.'],
['Helen','But that’s impossible. Carol and Tom invited us to lunch. Look through the window.'],
['Helen','Can you see anything?'],
['Jim','Nothing at all.'],
['Helen','Let’s try the back door.'],
['Jim','Look! Everyone’s in the garden.'],
['Carol','Hello, Helen. Hello, Jim.'],
['Tom','Everybody wants to have lunch in the garden. It’s nice and warm out here.'],
['Carol','Come and have something to drink.'],
['Jim','Thanks, Carol. May I have a glass of beer please?'],
['Carol','Beer? There’s none left. You can have some lemonade.'],
['Jim','Lemonade!'],
['Tom','Don’t believe her, Jim. She’s only joking. Have some beer!']
];
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const actors=i<6?['helen','jim']:i===7?['helen','carol']:i===6||i===8||i===13?['jim','tom']:['jim','carol'];
 expect(await world.locator('.dialogue-actor:visible').evaluateAll(es=>es.map(e=>e.dataset.actor).sort())).toEqual([...actors].sort());
 await expect(world.locator('.garden-cast:visible')).toHaveCount(2);
 await expect(world).toHaveAttribute('data-place',i<6?'door':'garden');
 await expect(world).toHaveAttribute('data-view',i===3||i===4?'window':'door');
 if(i===3||i===4)expect(await world.evaluate(e=>getComputedStyle(e).backgroundImage)).toContain('house-window.svg');
 for(const[selector,visible]of [['.jim-knock',i===1],['.jim-look',i===3||i===4],['.tom-beer',i===13]]){if(visible)await expect(world.locator(selector)).toBeVisible();else await expect(world.locator(selector)).toBeHidden();}
 const jim=world.locator('.jim-talk');if(await jim.isVisible())expect(await jim.evaluate(e=>getComputedStyle(e).transform)).toBe(i>=6?'matrix(-1, 0, 0, 1, 0, 0)':'none');
 if(i>=0)expect(await world.locator('.dialogue-actor.is-current:visible').getAttribute('data-actor')).toBe(lines[i][0].toLowerCase());
}
for(const width of [320,390,768,1280])test(width+'：14轮原文、四人换景与全部姿态、按需中文和续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit115-116/#learn/text');await expect(page.locator('.unit-intro')).toHaveText('从门口走进花园，说清人、事物与地点。');const room=page.locator('.stage-text'),world=room.locator('.garden-world'),log=room.getByRole('log');await expect(room.getByText('What does Jim have to drink?（吉姆有什么可喝的？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit115-116/lemonade.svg');await room.locator('.story-lead img').evaluate(img=>img.decode());await expect(world.locator('aside')).toHaveCount(0);await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(lines[i][0]);await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(['Carol','Tom'].includes(lines[i][0])||lines[i][0]==='Jim'&&i<6?/speaker-right/:/speaker-left/);await expect(world.locator('aside')).toHaveCount(0);await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await pose(world,i);const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};}));for(let a=0;a<labels.length;a++)for(let b=a+1;b<labels.length;b++)expect(labels[a].x+labels[a].width<=labels[b].x||labels[b].x+labels[b].width<=labels[a].x||labels[a].y+labels[a].height<=labels[b].y||labels[b].y+labels[b].height<=labels[a].y).toBe(true);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  for(const img of await world.locator('.garden-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(b.y+b.height);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?125:210);}
  if([0,1,3,4,5,6,7,8,9,11,13].includes(i))await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if(i===3||i===6||i===7||i===13){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}
  if(i<13)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(14);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,13);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
