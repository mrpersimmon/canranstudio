'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT135_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of paper274/PDF307:7 original turns,18 complete reading steps.
const lines=[
['reporter','Are you really going to retire, Miss Marsh?'],
['marsh','I may. I can’t make up my mind.'],
['marsh','I will have to ask my future husband.'],
['marsh','He won’t let me make another film.'],
['reporter','Your future husband, Miss Marsh?'],
['marsh','Yes. Let me introduce him to you.'],
['marsh','His name is Carlos.'],
['marsh','We’re going to get married next week.'],
['kate','Look, Liz! Here’s another report about Karen Marsh.'],
['kate','Listen: ‘Karen Marsh: The latest.'],
['kate','At her London Hotel today Miss Marsh told reporters she might retire.'],
['kate','She said she couldn’t make up her mind.'],
['kate','She said she would have to ask her future husband.'],
['kate','She said her future husband would not let her make another film.'],
['kate','Then she introduced us to Carlos and told us they would get married next week.’'],
['liz','That’s sensational news, isn’t it, Kate?'],
['kate','It certainly is.'],
['kate','He’ll be her sixth husband!']
];
const speakers={reporter:'Reporter',marsh:'Miss Marsh',kate:'Kate',liz:'Liz'};
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const street=i>=8,trio=i>=5&&i<8,expected=street?(i>=15?'discuss':'read'):(trio?'hotel-introduce':i<0||i===0||i===4?'hotel-ask':'hotel-reply');
 await expect(world.locator('.dialogue-actor:visible')).toHaveCount(trio?3:2);await expect(world.locator('.report-cast:visible')).toHaveCount(1);
 await expect(world).toHaveAttribute('data-scene',street?'street':'hotel');await expect(world.locator('.report-group')).toHaveAttribute('data-pose',expected);await expect(world.locator('.report-group')).toHaveAttribute('data-cast',trio?'trio':'pair');
 for(const name of ['hotel-ask','hotel-reply','hotel-introduce','read','discuss']){if(name===expected)await expect(world.locator('.'+name)).toBeVisible();else await expect(world.locator('.'+name)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);
 await expect(world.locator('[data-actor="carlos"].is-current')).toHaveCount(0);
 expect(await world.locator('.report-cast:visible').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
}
for(const width of [320,390,768,1280])test(width+'：18步完整原文、两处场景和五种姿态、中文续读与无剧情结论',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit135-136/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.report-world'),log=room.getByRole('log');
 await expect(room.getByText('Is Karen Marsh going to retire, do you think?（你认为Karen Marsh会退休吗？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit135-136/report.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(speakers[lines[i][0]]);await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+(i>=5&&i<8?'center':['reporter','kate'].includes(lines[i][0])?'left':'right')));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===17?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const materialBottom=b.y+b.height;
  for(const img of await world.locator('.report-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(materialBottom);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,width:b.width};}));for(let j=0;j<labels.length;j++)for(let k=j+1;k<labels.length;k++)expect(labels[j].x+labels[j].width<=labels[k].x||labels[k].x+labels[k].width<=labels[j].x).toBe(true);
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if([1,3,4,5,6,7,8,10,13,14,15,17].includes(i)){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}if(i<17)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(18);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,17);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
