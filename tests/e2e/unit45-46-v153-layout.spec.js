'use strict';
const {test,expect}=require('@playwright/test');

test.use({actionTimeout:7000,...(process.env.UNIT4546_BROWSER==='webkit'?{browserName:'webkit'}:{})});

async function assertBobFacesPartner(world){
 const facing=await world.evaluate(el=>{
  const bob=el.querySelector('.actor-bob'),partner=el.querySelector('.office-actor:not(.actor-bob):not([hidden])');
  const b=bob.getBoundingClientRect(),p=partner.getBoundingClientRect();
  // The approved Bob poses face right in the source artwork. Compare their
  // displayed direction with the partner's actual position in both rooms.
  const direction=new DOMMatrixReadOnly(getComputedStyle(bob.querySelector('.office-person>.office-figure')).transform).a;
  return {towardsPartner:direction*((p.x+p.width/2)-(b.x+b.width/2)),captionDirection:new DOMMatrixReadOnly(getComputedStyle(bob.querySelector('span')).transform).a};
 });
 expect(facing.towardsPartner,'Bob 应面向当前同场人物，不能朝向场景外侧').toBeGreaterThan(0);
 expect(facing.captionDirection,'人物朝向变化不能镜像姓名').toBeGreaterThan(0);
 expect(await world.locator('.office-letter').evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).a),'独立信件不能随Bob镜像').toBeGreaterThan(0);
}

async function assertUncut(image){
 await image.evaluate(img=>img.decode());
 // Inspect pixels of the actual browser-rendered asset, not its SVG source.
 const edgePixels=await image.evaluate(img=>{
  const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
  const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);
  const pixels=ctx.getImageData(0,0,c.width,c.height).data;let count=0;
  for(let y=0;y<c.height;y++)for(const x of [0,1,c.width-2,c.width-1])if(pixels[(y*c.width+x)*4+3]>32)count++;
  return count;
 });
 expect(edgePixels,'人物两侧必须留出透明安全边，不把手截在图片边界').toBe(0);
}

test('办公室开场问题、地点和翻译使用同一套中文字体',async({page},info)=>{
 await page.goto('/unit45-46/#learn/text');
 const room=page.locator('.stage-text');
 await room.screenshot({path:info.outputPath('intro.png')});
 const headingFont=await room.locator('.stage-heading h3').evaluate(el=>getComputedStyle(el).fontFamily.split(',')[0].replaceAll('"','').trim());
 for(const target of [room.locator('.story-lead p'),room.locator('.office-location')])
  await expect(target).toHaveCSS('font-family',new RegExp(headingFont));
 await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 await room.getByRole('button',{name:'看中文',exact:true}).click();
 await expect(room.locator('.bcn')).toHaveCSS('font-family',new RegExp(headingFont));
});

test('第6句老板仍持信，实际人物与纸张完整',async({page},info)=>{
 await page.goto('/unit45-46/#learn/text');
 const room=page.locator('.stage-text');
 await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=1;i<6;i++)await room.getByRole('button',{name:'下一句',exact:true}).click();
 await expect(room.locator('.bubble-row').last().locator('.btext')).toHaveText('Yes, sir.');
 const image=room.locator('.actor-boss .office-person>.office-figure');
 await image.evaluate(img=>img.decode());
 await room.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
 await room.screenshot({path:info.outputPath('boss-point.png')});
 await assertUncut(image);
});

for(const width of [320,390,768,1280])test(`${width}宽：对白在场景内、14句全程无重叠，翻译与推进不跳动`,async({page},info)=>{
 test.setTimeout(60000);
 await page.setViewportSize({width,height:width<400?568:900});
 await page.goto('/unit45-46/#learn/text');
 const room=page.locator('.stage-text'),world=room.locator('.office-world'),log=room.getByRole('log');
 const worldBox=await world.boundingBox(),logBox=await log.boundingBox();
 await room.screenshot({path:info.outputPath('intro.png')});
 await assertBobFacesPartner(world);
 expect(logBox.x,'对白留在场景内').toBeGreaterThanOrEqual(worldBox.x);
 expect(logBox.x+logBox.width).toBeLessThanOrEqual(worldBox.x+worldBox.width);
 expect(logBox.y).toBeGreaterThanOrEqual(worldBox.y);
 expect(logBox.y+logBox.height,'对白不能另起一块排在场景下方').toBeLessThanOrEqual(worldBox.y+worldBox.height);
 const locationBox=await room.locator('.office-location').boundingBox();
 expect(locationBox.width,'地点是紧凑标牌，不是铺满地板的横条').toBeLessThan(worldBox.width*.8);
 await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=0;i<14;i++){
  const latest=room.locator('.bubble-row').last();
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);
  await assertBobFacesPartner(world);
  const next=room.getByRole('button',{name:i===13?'完成课文':'下一句',exact:true});
  // Read with the transcript below the sticky navigation. Centering just the
  // next button can put the translation control behind that navigation.
  await log.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
  const before=await next.boundingBox();
  await latest.getByRole('button',{name:'看中文',exact:true}).click();
  const after=await next.boundingBox();
  expect(Math.abs(after.y-before.y),'展开中文不能推动整页或按钮').toBeLessThan(2);
  const bounds=await log.boundingBox(),line=await latest.boundingBox();
  expect(line.y).toBeGreaterThanOrEqual(bounds.y-1);
  expect(line.y+line.height).toBeLessThanOrEqual(bounds.y+bounds.height+1);
  for(const person of await world.locator('.office-actor:visible').all()){
   await assertUncut(person.locator('.office-person>.office-figure'));
   const b=await person.boundingBox(),w=await world.boundingBox();
   const caption=await world.locator('.office-location').boundingBox();
   expect(bounds.y+bounds.height,'对白不能遮住人物').toBeLessThanOrEqual(b.y);
   expect(caption.y+caption.height,'地点标牌不能遮住对白').toBeLessThanOrEqual(bounds.y);
   expect(caption.y+caption.height,'地点标牌不能压住人物头部').toBeLessThanOrEqual(b.y);
   expect(b.x).toBeGreaterThanOrEqual(w.x);
   expect(b.x+b.width).toBeLessThanOrEqual(w.x+w.width);
   expect(b.y).toBeGreaterThanOrEqual(w.y);
   expect(b.y+b.height).toBeLessThanOrEqual(w.y+w.height);
  }
  if(await world.locator('.office-machine').isVisible()){
   const caption=await world.locator('.office-location').boundingBox(),machine=await world.locator('.office-machine').boundingBox();
   expect(caption.y+caption.height,'地点标牌不能遮挡打字机').toBeLessThanOrEqual(machine.y);
   expect(bounds.y+bounds.height,'对白不能遮住打字机').toBeLessThanOrEqual(machine.y);
  }
  if([0,5,6,13].includes(i)){
   // Show the whole stage without embedding the sticky bar mid-illustration.
   await room.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   await room.screenshot({path:info.outputPath(`line-${i+1}.png`)});
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(i<13)await next.click();
 }
 await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(14);
 await assertBobFacesPartner(world);
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
 await expect(room.getByRole('button',{name:'下一站：故事小侦探',exact:true})).toBeVisible();
 await expect(page.locator('#starCount')).toHaveText('0');
});
