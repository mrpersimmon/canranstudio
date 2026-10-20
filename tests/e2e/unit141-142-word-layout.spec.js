'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT141_BROWSER==='webkit'?{browserName:'webkit'}:{});
test('四宽词卡正面：完整英文词形与实际可用宽度',async({page},info)=>{
 for(const width of [320,390,768,1280]){
  await page.setViewportSize({width,height:900});await page.goto('/unit141-142/#learn/words');
  const room=page.locator('.stage-words'),previous=room.getByRole('button',{name:'上一组词卡',exact:true});
  while(await previous.isEnabled())await previous.click();
  for(let group=0;group<3;group++){
   await expect(room.locator('.unit-word')).toHaveCount(6);
   await room.screenshot({path:info.outputPath('words-'+width+'-'+(group+1)+'.png')});
   for(const label of await room.locator('.unit-word strong:visible').all()){
    const data=await label.evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);const cs=getComputedStyle(el);return{word:el.textContent,width:el.clientWidth,font:cs.fontSize,rects:[...range.getClientRects()].filter(r=>r.width>0).map(r=>({width:r.width,y:r.y}))};});
    if(/^[A-Za-z]+$/.test(data.word))expect(data.rects.length,JSON.stringify({screen:width,...data})).toBe(1);
   }
   if(group<2)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
 }
});
