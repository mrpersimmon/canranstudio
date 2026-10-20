'use strict';const{test,expect}=require('@playwright/test');const{ANSWERS,select}=require('../support/unit3940-fivezones');
test.use({actionTimeout:7000,...(process.env.UNIT3940_BROWSER==='webkit'?{browserName:'webkit'}:{})});
for(const width of [320,1280])test('未答材料独立完整，最终位置图不预先放花瓶 '+width,async({page},info)=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:800});
 for(const id of ['grammar','exam']){await page.goto('/unit39-40/#learn/'+id);const room=page.locator('.stage-'+id);for(let i=0;i<ANSWERS[id].length;i++){
  await expect.poll(()=>room.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  if(id==='exam'&&i===1){await expect(room).toContainText('Put it here, on this shelf.');await room.screenshot({path:info.outputPath('empty-placement-'+width+'.png')});}
  if(id==='grammar'&&[2,3,6].includes(i))await room.screenshot({path:info.outputPath('grammar-'+(i+1)+'-'+width+'.png')});
  await select(room,ANSWERS[id][i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');if(i<ANSWERS[id].length-1)await room.getByRole('button',{name:'下一题',exact:true}).click();
 }}
});
