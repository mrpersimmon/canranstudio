'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
const FRAMES={'17-18':16,'19-20':13,'21-22':8,'23-24':8,'25-26':12,'27-28':13,'29-30':9};
async function capture(page,room,path){await room.screenshot({path,animations:'disabled'});}
for(const[pair,total]of Object.entries(FRAMES))test(`${pair} 分镜按原文推进，长句中文不裁切，四种宽度不移动推进按钮`,async({page})=>{
 test.setTimeout(90000);
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:844});await page.goto(`/lesson/unit${pair}/#learn/text`);const room=page.locator('.stage-text'),log=room.getByRole('log'),view=room.locator('.classroom-illustration'),ctrl=room.locator('.stage-ctrl');await room.getByRole('button',{name:width===320?/^(重新上演|从头看)$/: '再看一遍',exact:true}).click();
  await expect(log.locator('.btext')).toHaveCount(0);const top=()=>ctrl.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await top();
  for(let i=0;i<total;i++){
   await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(log.locator('.btext')).toHaveCount(i+1);expect(await top()).toBeCloseTo(before,0);
   if(width===1280){
    if(pair==='17-18'){await expect(view.locator('[data-part=nicola]'))[i>=2&&i<=6?'toBeVisible':'toBeHidden']();await expect(view.locator('[data-part=michael]'))[i>=7&&i<=12?'toBeVisible':'toBeHidden']();await expect(view.locator('[data-part=jim]'))[i>=13?'toBeVisible':'toBeHidden']();}
    if(pair==='19-20'){await expect(view.locator('[data-part=vendor-cart]'))[i>=6?'toBeVisible':'toBeHidden']();await expect(view.locator('[data-part=cone-girl]'))[i>=7?'toBeVisible':'toBeHidden']();if(i>=8){const cone=await view.locator('[data-part=cone-girl]').boundingBox(),child=await view.locator('[data-actor=girl]:visible').boundingBox();expect(cone.x).toBeGreaterThan(child.x-20);expect(cone.x).toBeLessThan(child.x+child.width);}}
    if(pair==='21-22'&&i>=4){const item=await view.locator('[data-part=red-book]').boundingBox(),owner=await view.locator(i>=6?'[data-part=man]':'[data-part=jane]').boundingBox();expect(Math.max(owner.x-item.x-item.width,item.x-owner.x-owner.width,0)).toBeLessThan(35);}
    if(pair==='23-24'&&i>=4){const item=await view.locator('[data-part=shelf-glasses]').boundingBox(),owner=await view.locator(i>=6?'[data-part=man]':'[data-part=jane]').boundingBox();expect(Math.max(owner.x-item.x-item.width,item.x-owner.x-owner.width,0)).toBeLessThan(35);}
    if(pair==='25-26'){for(const name of ['fridge','cooker','cup'])await expect(view.locator('[data-part='+name+']')).toBeVisible();}
    if(pair==='27-28'){for(const name of ['television','magazines','books'])await expect(view.locator('[data-part='+name+']')).toBeVisible();}
    if(pair==='29-30'){await expect(view.locator('[data-part=clothes]')).toBeVisible();await expect(view.locator('[data-part=window-open]')).toBeHidden();await expect(view.locator('[data-part=bed-tidy]')).toBeHidden();}
   }
   if(['25-26','27-28'].includes(pair)){
    const line=log.locator('.bubble-row').last();await expect(line.locator('.bname')).toBeHidden();expect(await line.locator('.btext').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
   }
   if(i===Math.floor(total/2)||i===total-1){
    const last=log.locator('.bubble-row').last();await last.getByRole('button',{name:'看中文',exact:true}).click();await expect.poll(async()=>{const b=await log.boundingBox(),c=await last.locator('.bcn').boundingBox();return c.y+c.height<=b.y+b.height+1;}).toBe(true);
    expect(await top()).toBeCloseTo(before,0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const v=await view.boundingBox(),b=await log.boundingBox();expect(v.width).toBeGreaterThan(b.width*.95);if(width<=640)expect(v.y).toBeGreaterThanOrEqual(b.y+b.height-4);else{expect(b.x).toBeGreaterThan(v.x);expect(b.x+b.width).toBeLessThan(v.x+v.width);}
    await capture(page,room,`output/playwright/unit${pair}/review-scene-${i+1}-${width}.png`);
   }
  }
  await page.reload();await expect(log.locator('.btext')).toHaveCount(total);await expect(log.locator('.bubble-row').last()).toBeInViewport({ratio:1});
  if(pair==='25-26'){const left=await view.locator('[data-part=cooker]').boundingBox(),middle=await view.locator('[data-part=table]').boundingBox(),right=await view.locator('[data-part=fridge]').boundingBox();expect(left.x+left.width).toBeLessThan(middle.x);expect(middle.x+middle.width).toBeLessThan(right.x);}
  if(pair==='27-28'){const a=await view.locator('[data-part=magazines]').boundingBox(),tv=await view.locator('[data-part=television]').boundingBox();expect(a.x).toBeGreaterThan(tv.x);expect(a.y+a.height).toBeLessThanOrEqual(tv.y+10);}
  await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.getByRole('group',{name:'完成后的操作',exact:true})).toBeVisible();
 }
});

const ALBUMS={
 '17-18':['看看成双的职业','图册',15],'19-20':['看看二十幅对比图','图册',10],'21-22':['看看十六幅物品图','图册',8],'23-24':['看看十幅位置图','图册',10],'25-26':['看看八幅厨房图','图册',8],'27-28':['看看十幅位置图','图册',10],'29-30':['看看35个动作搭配','动作',9]
};
for(const[pair,[title,label,pages]]of Object.entries(ALBUMS))test(`${pair} 图册翻页按钮不随内容高度跳动，刷新保留末页`,async({page})=>{
 for(const width of [320,1280]){
  await page.setViewportSize({width,height:844});await page.goto(`/unit${pair}/#learn/models`);const room=page.locator('.stage-models'),details=room.locator('details').filter({has:page.locator('summary').getByText(title,{exact:true})});if(await details.getAttribute('open')===null)await room.getByText(title,{exact:true}).click();
  const previous=room.getByRole('button',{name:'上一页'+label,exact:true}),next=room.getByRole('button',{name:'下一页'+label,exact:true});while(await previous.isEnabled())await previous.click();
  const top=()=>next.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await top();
  for(let i=1;i<pages;i++){await next.click();expect(await top()).toBeCloseTo(before,0);}
  await expect(next).toBeDisabled();await page.reload();await room.getByText(title,{exact:true}).click();await expect(next).toBeDisabled();await expect(details.locator('.album-controls span')).toHaveText(`${pages} / ${pages}`);
  await capture(page,room,`output/playwright/unit${pair}/review-album-${width}.png`);
 }
});
