'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function capture(page,name){
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 const id=new URL(page.url()).hash.slice('#learn/'.length),clip=await page.locator('.stage-'+id).boundingBox();
 await page.screenshot({path:`output/playwright/unit11-12/${name}.png`,fullPage:true,clip});
}
test('白衬衫等待本人确认再归还，蓝衬衫不提前出现，刷新和重演保持时序',async({page})=>{
 await page.goto('/unit11-12/#learn/text');const room=page.locator('.stage-text'),white=room.getByRole('img',{name:/白衬衫/}),blue=room.getByRole('img',{name:/蓝衬衫/});
 await expect(white).toHaveAttribute('alt','凳子上待认领的白衬衫');await expect(blue).toBeHidden();
 for(let i=0;i<16;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  if(i===3)await expect(blue).toBeHidden();
  if(i===4)await expect(blue).toBeVisible();
  if(i>=1&&i<=12)await expect(white).toHaveAttribute('alt','老师举着待认领的白衬衫');
  if(i===7){await page.reload();await expect(white).toHaveAttribute('alt','老师举着待认领的白衬衫');await expect(room.locator('.bubble-row').last()).toBeInViewport({ratio:1});}
  if(i===13)await expect(white).toHaveAttribute('alt','老师递出已确认的白衬衫');
  if(i===14)await expect(white).toHaveAttribute('alt','老师抛向 Tim 的白衬衫');
 }
 await expect(white).toHaveAttribute('alt','Tim 接到自己的白衬衫');await expect(page.locator('#starCount')).toHaveText('0');await capture(page,'story-returned-1280');
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await room.getByRole('button',{name:'再看一遍',exact:true}).click();await expect(white).toHaveAttribute('alt','凳子上待认领的白衬衫');await expect(blue).toBeHidden();
});
test('手机对白占满一行，三人同地面，中文展开与刷新不丢当前句',async({page})=>{
 test.setTimeout(60000);
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:844});await page.goto('/unit11-12/#learn/text');const room=page.locator('.stage-text'),log=room.getByRole('log'),stage=room.locator('.dialogue-stage');
  const s=await stage.boundingBox(),l=await log.boundingBox(),actors=await room.locator('.dialogue-actor').all();expect(l.width).toBeGreaterThan(s.width*.85);
  const bottoms=[];for(const actor of actors){const b=await actor.boundingBox();expect(b.y).toBeGreaterThanOrEqual(l.y+l.height);bottoms.push(b.y+b.height);}expect(Math.max(...bottoms)-Math.min(...bottoms)).toBeLessThan(3);
  await room.getByRole('button',{name:'重新上演',exact:true}).click();
  for(let i=0;i<9;i++)await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  const ctrl=room.locator('.stage-ctrl'),before=await ctrl.evaluate(el=>el.getBoundingClientRect().top+scrollY);
  await log.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();
  const cn=await log.locator('.bubble-row').last().locator('.bcn').boundingBox(),b=await log.boundingBox();expect(cn.y+cn.height).toBeLessThanOrEqual(b.y+b.height-2);expect(await ctrl.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(before,0);
  await capture(page,`story-clues-${width}`);await page.reload();await expect(log.locator('.bubble-row').last()).toBeInViewport({ratio:1});
 }
});
test('十二组认领档案一次展示一件，翻页完整并可直接下一站',async({page})=>{
 await page.goto('/unit11-12/#learn/models');const room=page.locator('.stage-models'),record=room.getByRole('group',{name:'当前认领档案',exact:true});
 const owners=['Stella','Paul','Sophie','Steven','my son','my daughter','my father','my mother','my sister','my brother','Sophie','Hans'];
 const objects=['handbag','car','coat','umbrella','pen','dress','suit','skirt','blouse','tie','pen','pencil'];
 for(let i=0;i<12;i++){await expect(record).toContainText(`Whose is this ${objects[i]}?`);await expect(record).toContainText(`It's ${owners[i]}'s.`);await expect(record.locator('img')).toHaveCount(1);await capture(page,`record-${i+1}`);if(i<11)await room.getByRole('button',{name:'下一份档案',exact:true}).click();}
 await expect(room.getByRole('button',{name:'下一份档案',exact:true})).toBeDisabled();await page.reload();await expect(record).toContainText("It's Hans's.");await room.getByRole('button',{name:'上一份档案',exact:true}).click();await expect(record).toContainText("It's Sophie's.");await room.getByRole('button',{name:'下一站：词块拼装台',exact:true}).click();await expect(page).toHaveURL(/#learn\/trans$/);
});
test('Perhaps 题只在正确提交后记录先确认，不把猜测画成归还',async({page})=>{
 await page.goto('/unit11-12/#learn/exam');const room=page.locator('.stage-exam');await room.getByRole('button',{name:'my brother · pen',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 const record=room.locator('.claim-task-result');await expect(record).toHaveText('');await room.getByRole('button',{name:'直接认定是 Tim 的',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(record).toHaveText('');await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'请 Tim 确认',exact:true}).click();await expect(record).toHaveText('');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(record).toHaveText('下一步：请 Tim 确认');await expect(room.getByRole('img',{name:'Tim 接到自己的白衬衫',exact:true})).toHaveCount(0);await capture(page,'perhaps-confirm');
});
