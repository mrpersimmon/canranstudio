'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT123_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independent transcription of paper250/PDF283. Keep both repeated responses.
const lines=[
['mike','Look, Scott. This is a photograph I took during my trip to Australia.'],
['scott','Let me see it, Mike.'],
['scott','This is a good photograph. Who are these people?'],
['mike','They’re people I met during the trip.'],
['mike','That’s the ship we travelled on.'],
['scott','What a beautiful ship!'],
['scott','Who’s this?'],
['mike','That’s the man I told you about. Remember?'],
['scott','Ah yes. The one who offered you a job in Australia.'],
['mike','That’s right.'],
['scott','Who’s this?'],
['mike','Guess!'],
['scott','It’s not you, is it?'],
['mike','That’s right.'],
['mike','I grew a beard during the trip, but I shaved it off when I came home.'],
['scott','Why did you shave it off?'],
['mike','My wife didn’t like it!']
];
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
async function pose(world,i){
 await expect(world.locator('.dialogue-actor:visible')).toHaveCount(2);await expect(world.locator('.photo-cast:visible')).toHaveCount(2);
 await expect(world).toHaveAttribute('data-photo',i<0?'none':i<4?'people':i<6?'ship':i<10?'man':'beard');
 for(const[s,v]of [['.mike-show',i<14],['.mike-chin',i>=14],['.scott-listen',i<10||i>=14],['.scott-surprised',i>=10&&i<14]]){if(v)await expect(world.locator(s)).toBeVisible();else await expect(world.locator(s)).toBeHidden();}
 if(i>=0){await expect(world.locator('.dialogue-actor.is-current:visible')).toHaveAttribute('data-actor',lines[i][0]);await expect(world.locator('.travel-photo-image:visible')).toHaveCount(1);await expect(world.locator('.travel-photo-image:visible')).toHaveAttribute('data-photo',i<4?'people':i<6?'ship':i<10?'man':'beard');}
 else await expect(world.locator('.travel-photo-display')).toBeHidden();
 expect(await world.locator('.photo-cast:visible').evaluateAll(es=>es.every(e=>getComputedStyle(e).transform==='none'))).toBe(true);
}
for(const width of [320,390,768,1280])test(width+'：17轮完整对话、现场与照片分开、按需中文续读',async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit123-124/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.photo-world'),log=room.getByRole('log');
 await expect(room.getByText('Who is the man with the beard?（照片中留络腮胡子的男士是谁？）',{exact:true})).toBeVisible();await pose(world,-1);await expect(room.locator('.story-lead img')).toHaveAttribute('src','/assets/unit123-124/photograph.svg');await room.locator('.story-lead img').evaluate(i=>i.decode());
 const lead=await room.locator('.story-lead').boundingBox(),introLog=await log.boundingBox();expect(lead.y).toBeGreaterThanOrEqual(introLog.y);expect(lead.y+lead.height).toBeLessThanOrEqual(introLog.y+introLog.height+1);
 await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<lines.length;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText(lines[i][0]==='mike'?'Mike':'Scott');await expect(latest.locator('.btext')).toHaveText(lines[i][1]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(new RegExp('speaker-'+(lines[i][0]==='mike'?'left':'right')));await pose(world,i);
  await expect(room.locator('.story-note,.story-timeline')).toHaveCount(0);await expect(world.locator('aside')).toHaveCount(0);
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===16?'完成课文':'下一句',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);
  if(i===13)await expect(latest.locator('.bcn')).toHaveText('不，是我。');
  const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox(),photo=await world.locator('.travel-photo-display').boundingBox();
  expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  expect(photo.y).toBeGreaterThanOrEqual(b.y+b.height);expect(photo.x).toBeGreaterThanOrEqual(w.x);expect(photo.x+photo.width).toBeLessThanOrEqual(w.x+w.width);
  for(const img of await world.locator('.photo-cast:visible').all()){await uncut(img);const a=await img.boundingBox();expect(a.y).toBeGreaterThanOrEqual(photo.y+photo.height);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(w.x+w.width);expect(await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;})).toBeGreaterThan(width<600?150:220);}
  await room.screenshot({path:info.outputPath('line-'+(i+1)+'.png')});await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();
  if([3,5,9,12,13,14,16].includes(i)){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(i+1);await pose(world,i);}
  if(i<16)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(17);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：照片小侦探',exact:true})).toBeVisible();await pose(world,16);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
