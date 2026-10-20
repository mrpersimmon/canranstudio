'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT93_BROWSER==='webkit'?{browserName:'webkit'}:{});
// Independently checked against textbook paper190 / PDF223: narration, not dialogue.
const paragraphs=[
'Nigel is our new next-door neighbour. He’s a pilot.',
'He was in the R.A.F.',
'He will fly to New York next month.',
'The month after next he’ll fly to Tokyo.',
'At the moment, he’s in Madrid. He flew to Spain a week ago.',
'He’ll return to London the week after next.',
'He’s only forty-one years old, and he has already been to nearly every country in the world.',
'Nigel is a very lucky man. But his wife isn’t very lucky. She usually stays at home!'
];
const frames=['plane','wings','new-york','tokyo','madrid','london','globe','home'];
async function uncut(image){await image.evaluate(i=>i.decode());const count=await image.evaluate(img=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;let n=0;for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(p[(y*c.width+x)*4+3]>32)n++;for(let x=0;x<c.width;x++)for(const y of [0,1,c.height-2,c.height-1])if(p[(y*c.width+x)*4+3]>32)n++;return n;});expect(count).toBe(0);}
for(const width of [320,390,768,1280])test(`${width}：8段完整旁白、按需中文、插图切换与续读`,async({page},info)=>{
 test.setTimeout(150000);await page.setViewportSize({width,height:width<400?568:1000});await page.goto('/unit93-94/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.travel-world'),log=room.getByRole('log');await expect(room.getByLabel('故事进展',{exact:true})).toHaveCount(0);await expect(room.getByText('为什么说Nigel很幸运？',{exact:true})).toBeVisible();await room.screenshot({path:info.outputPath('intro.png')});await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<8;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);const latest=room.locator('.bubble-row').last();await expect(latest.locator('.bname')).toHaveText('旁白');await expect(latest.locator('.btext')).toHaveText(paragraphs[i]);await expect(latest.locator('.bcn')).toBeHidden();await expect(latest).toHaveClass(/speaker-narrator/);await expect(world.locator('aside')).toHaveCount(0);await expect(world).toHaveAttribute('data-scene',i===7?'home':'travel');await expect(world.locator('.dialogue-actor:visible')).toHaveCount(1);await expect(world.locator('[data-actor="nigel"]')).toBeVisible({visible:i!==7});await expect(world.locator('[data-actor="wife"]')).toBeVisible({visible:i===7});await expect(world.locator('.travel-illustration img')).toHaveAttribute('src','/assets/unit93-94/'+frames[i]+'.svg');
  await log.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));const next=room.getByRole('button',{name:i===7?'完成课文':'下一段',exact:true}),before=await next.boundingBox();await latest.getByRole('button',{name:'看中文',exact:true}).click();expect(Math.abs((await next.boundingBox()).y-before.y)).toBeLessThan(2);const b=await log.boundingBox(),w=await world.boundingBox(),toggle=await latest.getByRole('button',{name:'收起中文',exact:true}).boundingBox();expect(b.x).toBeGreaterThanOrEqual(w.x);expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);expect(toggle.y+toggle.height).toBeLessThanOrEqual(b.y+b.height+1);expect(await log.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const img=world.locator('.travel-cast:visible');await uncut(img);const a=await img.boundingBox(),art=await world.locator('.travel-illustration').boundingBox();expect(a.y).toBeGreaterThanOrEqual(b.y+b.height);expect(a.y+a.height).toBeLessThanOrEqual(w.y+w.height);expect(a.x).toBeGreaterThanOrEqual(w.x);expect(a.x+a.width).toBeLessThanOrEqual(art.x);expect(art.x+art.width).toBeLessThanOrEqual(w.x+w.width);expect(art.y).toBeGreaterThanOrEqual(b.y+b.height);const shown=await img.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.width/el.naturalWidth,r.height/el.naturalHeight)*el.naturalHeight;});expect(shown).toBeGreaterThan(width<600?145:210);
  if(i===7){await expect(latest.locator('.bcn')).toContainText('通常待在家里');await latest.getByRole('button',{name:'收起中文',exact:true}).click();await expect(latest.locator('.bcn')).toBeHidden();}
  await room.screenshot({path:info.outputPath(`paragraph-${i+1}.png`)});
  if(i===4){await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(5);await expect(world.locator('.travel-illustration img')).toHaveAttribute('src','/assets/unit93-94/madrid.svg');}
  if(i<7)await next.click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.completion-stats')).toHaveCount(0);await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(8);await expect(room.locator('.bcn:visible')).toHaveCount(0);await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();await expect(world.locator('aside')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
