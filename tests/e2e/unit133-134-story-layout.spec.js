'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT133_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of paper270/PDF303:6 original turns,14 complete reading steps.
const lines=[
['reporter','Have you just made a new film, Miss Marsh?'],
['marsh','Yes, I have.'],
['reporter','Are you going to make another?'],
['marsh','No, I’m not. I’m going to retire.'],
['marsh','I feel very tired. I don’t want to make another film for a long time.'],
['kate','Let’s buy a newspaper, Liz. Listen to this!'],
['kate','‘Karen Marsh: Sensational News! By our reporter, Alan Jones.'],
['kate','Karen Marsh arrived at London Airport today.'],
['kate','She was wearing a blue dress and a mink coat.'],
['kate','She told me she had just made a new film.'],
['kate','She said she was not going to make another.'],
['kate','She said she was going to retire.'],
['kate','She told reporters she felt very tired and didn’t want to make another film for a long time.’'],
['liz','I wonder why!']
];
const speakers={reporter:'Reporter',marsh:'Miss Marsh',kate:'Kate',liz:'Liz'};
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const expected=i>=5?(i===13?'wonder':'read'):(i===1||i>=3?'interview-answer':'interview');
 await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);await expect(world.locator('.news-cast:visible')).toHaveCount(1);
 await expect(world).toHaveAttribute('data-scene',i>=5?'street':'airport');await expect(world.locator('.news-group')).toHaveAttribute('data-pose',expected);
 for(const name of ['interview','interview-answer','read','wonder']){if(name===expected)await expect(world.locator('.'+name)).toBeVisible();else await expect(world.locator('.'+name)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);
 expect(await world.locator('.news-cast:visible').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
}
for(const width of [320,390,768,1280])test(width+'：14步完整原文、两处场景和四种姿态、中文续读与无剧情结论',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit133-134/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.news-world'),log=room.getByRole('log');
 await expect(room.getByText('What reasons did Karen Marsh give for wanting to retire?（Karen Marsh说她为什么想要退休？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit133-134/newspaper.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(speakers[lines[i][0]]);await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+(['reporter','kate'].includes(lines[i][0])?'left':'right')));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const materialBottom=b.y+b.height;
  for(const img of await world.locator('.news-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(materialBottom);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,width:b.width};}));expect(labels[0].x+labels[0].width<=labels[1].x||labels[1].x+labels[1].width<=labels[0].x).toBe(true);
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if([1,3,4,5,8,9,12,13].includes(i)){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}if(i<13)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(14);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,13);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
