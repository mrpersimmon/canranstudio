'use strict';
const {test,expect}=require('@playwright/test');
const totals={'17-18':16,'19-20':13,'21-22':8,'23-24':8,'25-26':12,'27-28':13,'29-30':9};
// Keep visual evidence of sitting, offering and receiving, not only the final state.
const turningPoints={'19-20':[0,3,7,8],'21-22':[0,2,3,4,6],'23-24':[0,2,3,4,6]};
test.use({reducedMotion:'reduce'});
for(const [pair,total] of Object.entries(totals))for(const width of [320,390,768,1280]){
 test(`${pair} 连续舞台、对白与人物分层 ${width}`,async({page})=>{
  test.setTimeout(60000);await page.setViewportSize({width,height:960});await page.goto(`/unit${pair}/#learn/text`);
  const room=page.locator('.stage-text'),stage=room.locator('.dialogue-stage'),log=room.getByRole('log'),view=stage.locator('.classroom-illustration'),ctrl=room.locator('.stage-ctrl');
  await expect(stage).toHaveClass(/is-story-theatre/);
  await expect(log).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  const top=()=>ctrl.evaluate(e=>e.getBoundingClientRect().top+scrollY),before=await top();
  for(let i=0;i<total;i++){
   await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(log.locator('.btext')).toHaveCount(i+1);expect(await top()).toBeCloseTo(before,0);
   const line=log.locator('.bubble-row').last();
   if(i===Math.floor(total/2)||i===total-1||(turningPoints[pair]||[]).includes(i)){
    await line.getByRole('button',{name:'看中文',exact:true}).click();await expect(line.locator('.bcn')).toBeVisible();
    if(['25-26','27-28'].includes(pair))await expect(line.locator('.bname')).toBeHidden();
    await expect.poll(async()=>{const a=await log.boundingBox(),b=await line.locator('.bcn').boundingBox();return b.y+b.height<=a.y+a.height+1;}).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await top()).toBeCloseTo(before,0);
    const bounds=await view.boundingBox(),stageBounds=await stage.boundingBox();expect(bounds.width).toBeGreaterThan(stageBounds.width*.95);
    const actors=await view.locator('[data-actor]:not([data-actor=""])').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').map(n=>{const b=n.getBoundingClientRect();return {y:b.y,height:b.height};}));
    const logBounds=await log.boundingBox();for(const a of actors){expect(a.height).toBeGreaterThan(width<=390?62:90);expect(a.y).toBeGreaterThanOrEqual(logBounds.y+logBounds.height-2);}
    await room.screenshot({path:`output/playwright/theatre-v21/${pair}-${width}-${i+1}.png`});
   }
  }
  await page.reload();await expect(log.locator('.btext')).toHaveCount(total);await expect(room.getByRole('button',{name:'完成课文',exact:true})).toBeVisible();
  await room.getByRole('button',{name:'完成课文',exact:true}).click();const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish).toBeVisible();
  const roomBounds=await room.boundingBox();
  for(const button of await finish.getByRole('button').all()){
   const box=await button.boundingBox();expect(box.x).toBeGreaterThanOrEqual(roomBounds.x);expect(box.x+box.width).toBeLessThanOrEqual(roomBounds.x+roomBounds.width);expect(box.y+box.height).toBeLessThanOrEqual(roomBounds.y+roomBounds.height);
   await button.scrollIntoViewIfNeeded();await expect(button).toBeInViewport({ratio:1});
  }
  await expect(room.locator('.practice-finish .classroom-keepsake img')).toHaveCount(0);
  await room.screenshot({path:`output/playwright/theatre-v21/${pair}-${width}-complete.png`});
 });
}
