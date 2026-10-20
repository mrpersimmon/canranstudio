'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT121_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of paper246/PDF279. Preserve all thirteen turns.
const lines=[
['customer','I bought two expensive dictionaries here half an hour ago, but I forgot to take them with me.'],
['manager','Who served you, sir?'],
['customer','The lady who is standing behind the counter.'],
['manager','Which books did you buy?'],
['customer','The books which are on the counter.'],
['manager','Did you serve this gentleman half an hour ago, Caroline? He says he’s the man who bought these books.'],
['caroline','I can’t remember. The man who I served was wearing a hat.'],
['manager','Have you got a hat, sir?'],
['customer','Yes, I have.'],
['manager','Would you put it on, please?'],
['customer','All right.'],
['manager','Is this the man that you served, Caroline?'],
['caroline','Yes. I recognize him now.']
];
const names={customer:'Customer',manager:'Manager',caroline:'Caroline'};
const positions=i=>i>=11?{customer:'left',manager:'middle',caroline:'right'}:i===5||i===6?{manager:'left',caroline:'right'}:i===2?{customer:'left',caroline:'right'}:{customer:'left',manager:'right'};
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 const expected=Object.keys(positions(i));expect(await world.locator('.dialogue-actor:visible').evaluateAll(es=>es.map(e=>e.dataset.actor).sort())).toEqual(expected.sort());
 await expect(world.locator('.bookshop-cast:visible')).toHaveCount(i>=11?0:expected.length);await expect(world).toHaveAttribute('data-hat',i>=11?'worn':i>=8?'held':'absent');
 for(const[s,v]of [['.customer-plain',i<8&&expected.includes('customer')],['.customer-holding',i>=8&&i<11],['.customer-hat',false],['.caroline-think',i<11&&expected.includes('caroline')],['.caroline-recognize',false],['.story-counter',i>=0&&i<11],['.questioning-trio',i===11],['.recognized-trio',i===12]]){if(v)await expect(world.locator(s)).toBeVisible();else await expect(world.locator(s)).toBeHidden();}
 if(i>=0)await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);
 for(const img of await world.locator('.bookshop-cast:visible').all()){const actor=await img.evaluate(e=>({who:e.closest('[data-actor]').dataset.actor,position:e.closest('[data-actor]').dataset.position,transform:getComputedStyle(e).transform}));expect(actor.transform).toBe(actor.who==='manager'&&actor.position==='right'?'matrix(-1, 0, 0, 1, 0, 0)':'none');}
}
for(const width of [320,390,768,1280])test(width+'：13轮完整对话、三人身份、帽子状态与按需中文续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit121-122/#learn/text');
 await expect(page.locator('.unit-intro')).toHaveText('读懂书店里的对话，用线索说清是哪一个人、哪一本书。');
 const room=page.locator('.stage-text'),world=room.locator('.bookshop-world'),log=room.getByRole('log');
 await expect(room.getByText('Why didn’t Caroline recognize the customer straight away?（为什么Caroline没有马上认出顾客？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit121-122/hat.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(names[lines[i][0]]);await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+(positions(i)[lines[i][0]]==='middle'?'center':positions(i)[lines[i][0]])));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  const labels=await world.locator('.dialogue-actor:visible .actor-label').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};}));for(let j=0;j<labels.length;j++)for(let k=j+1;k<labels.length;k++)expect(labels[j].x+labels[j].width<=labels[k].x||labels[k].x+labels[k].width<=labels[j].x).toBe(true);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===12?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  for(const img of await world.locator('.bookshop-cast:visible,.bookshop-group-image:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(b.y+b.height);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if(i===2||i===5||i===8||i===10||i===11||i===12){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}
  if(i<12)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(13);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await pose(world,12);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
