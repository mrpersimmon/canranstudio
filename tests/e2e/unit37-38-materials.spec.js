'use strict';
const{test,expect}=require('@playwright/test');const{ANSWERS,select}=require('../support/unit3738-fivezones');
test.use({actionTimeout:7000,...(process.env.UNIT3738_BROWSER==='webkit'?{browserName:'webkit'}:{})});
for(const width of [320,1280])test('计划与正在上漆、大小工具在未答图中清晰保留 '+width,async({page},info)=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:800});
 for(const id of ['grammar','exam']){await page.goto('/unit37-38/#learn/'+id);const room=page.locator('.stage-'+id);for(let i=0;i<ANSWERS[id].length;i++){
  const inputs=room.locator('.practice-scene,.picture-option>img');for(const im of await inputs.all()){const x=await im.evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,nw:e.naturalWidth,nh:e.naturalHeight}));expect(x.nw).toBeGreaterThan(0);expect(x.width).toBeGreaterThanOrEqual(180);expect(Math.abs(x.width/x.height-x.nw/x.nh)).toBeLessThan(.02);}
  if(await inputs.count())await room.screenshot({path:info.outputPath(id+'-'+(i+1)+'-'+width+'-material.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await select(room,ANSWERS[id][i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');if(i<ANSWERS[id].length-1)await room.getByRole('button',{name:'下一题',exact:true}).click();
 }}
});
