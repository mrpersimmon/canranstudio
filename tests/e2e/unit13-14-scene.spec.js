'use strict';
const{test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('13–14 上楼后展示裙子、再拿出帽子，刷新与重演恢复真实分镜',async({page})=>{
 await page.goto('/unit13-14/#learn/text');const room=page.locator('.stage-text'),scene=room.locator('.dress-cast'),dress=room.locator('.story-dress'),hat=room.locator('.story-hat');
 await expect(scene).toHaveAttribute('data-phase','arrival');await expect(dress).toBeHidden();await expect(hat).toBeHidden();
 for(let i=0;i<13;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  if(i<5)await expect(dress).toBeHidden();else await expect(dress).toBeVisible();
  if(i<10)await expect(hat).toBeHidden();else await expect(hat).toBeVisible();
  if(i===2)await expect(scene).toHaveAttribute('data-phase','upstairs');
  if(i===5){await page.reload();await expect(dress).toBeVisible();await expect(hat).toBeHidden();}
 }
 await expect(scene).toHaveAttribute('data-phase','admire');await expect(hat).toHaveAttribute('alt','Anna 戴起自己的绿色帽子');
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await room.getByRole('button',{name:'再看一遍',exact:true}).click();await expect(scene).toHaveAttribute('data-phase','arrival');await expect(dress).toBeHidden();await expect(hat).toBeHidden();
});
test('13–14 十幅配色图逐页展示，最后一页可直接进入拼句',async({page})=>{
 await page.goto('/unit13-14/#learn/models');const room=page.locator('.stage-models'),album=room.getByRole('group',{name:'当前配色图',exact:true});
 const captions=['umbrella · black','car · blue','shirt · white','coat · grey','case · brown','carpet · red','blouse · yellow','tie · orange','hat · grey and black','dog · brown and white'];
 for(let i=0;i<10;i++){await expect(album).toContainText(captions[i]);await expect(album.locator('img')).toHaveCount(1);if(i<9)await room.getByRole('button',{name:'下一幅配色图',exact:true}).click();}
 await expect(room.getByRole('button',{name:'下一幅配色图',exact:true})).toBeDisabled();await page.reload();await expect(album).toContainText(captions[9]);
 await room.getByRole('button',{name:'下一站：词块拼装台',exact:true}).click();await expect(page).toHaveURL(/#learn\/trans$/);
});

for(const width of [320,390,768,1280])test(`${width} 对白在上方、人物和道具在同一地面，中文不裁切且操作稳定`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit13-14/#learn/text');const room=page.locator('.stage-text'),stage=room.locator('.dialogue-stage'),log=room.getByRole('log');
 const s=await stage.boundingBox(),l=await log.boundingBox();expect(l.width).toBeGreaterThan(s.width*.85);
 const actors=await room.locator('.dialogue-actor').all(),bounds=[];for(const actor of actors){const b=await actor.boundingBox();expect(b.y).toBeGreaterThanOrEqual(l.y+l.height);bounds.push(b);}expect(bounds[1].x).toBeGreaterThan(s.x+s.width*.6);expect(Math.abs(bounds[0].y+bounds[0].height-bounds[1].y-bounds[1].height)).toBeLessThan(3);
 const ctrl=room.locator('.stage-ctrl'),top=()=>ctrl.evaluate(e=>e.getBoundingClientRect().top+scrollY),before=await top();
 for(let i=0;i<13;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();expect(await top()).toBeCloseTo(before,0);
  if([2,5,8,10,12].includes(i)){
   await log.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();const b=await log.boundingBox(),cn=await log.locator('.bubble-row').last().locator('.bcn').boundingBox();expect(cn.y+cn.height).toBeLessThanOrEqual(b.y+b.height);expect(await top()).toBeCloseTo(before,0);
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));const clip=await room.boundingBox();await page.screenshot({path:`output/playwright/unit13-14/scene-${i+1}-${width}.png`,fullPage:true,clip});
  }
 }
 await page.reload();await expect(log.locator('.bubble-row').last()).toBeInViewport({ratio:1});
});
