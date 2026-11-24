'use strict';
const {test,expect}=require('@playwright/test');
for(const [unit,id]of [['unit37-38','u3738-v1-final-bookcase'],['unit59-60','u5960-v1-a-they'],['unit127-128','u127128-v1-a-reply']])test(id+' 320px pressure keeps controls and materials reachable',async({page})=>{
 await page.goto('/?'+new URLSearchParams({unit,page:'q:'+id,state:'review',device:'small-phone'}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 await frame.page().locator('#device').selectOption({label:'320 小屏压力 · 320×568'});
 await frame.waitForFunction(()=>innerWidth===320&&innerHeight===568);
 const metrics=await frame.locator('.practice-submit-row:visible').evaluate(e=>{const r=e.getBoundingClientRect();return{width:document.documentElement.scrollWidth,top:r.top,bottom:r.bottom,small:[...e.querySelectorAll('button')].filter(b=>b.getClientRects().length&&!b.hidden).some(b=>b.getBoundingClientRect().height<44)};});
 expect(metrics.width).toBeLessThanOrEqual(320);expect(metrics.bottom).toBeLessThanOrEqual(565);expect(metrics.small).toBe(false);
 const material=frame.getByRole('button',{name:'查看题目材料',exact:true});if(await material.count()){await material.click();await expect(frame.locator('#learning-reference-sheet')).toBeVisible();await frame.getByRole('button',{name:'关闭学习参考',exact:true}).click();}
});
