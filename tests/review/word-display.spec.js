'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const singleWord=definition(process.cwd(),'unit3-4','/').learning.WORDS.find(w=>w.en==='sir');
const sizes=[...devices,{id:'small-phone',viewport:{width:320,height:568}},{id:'tablet',viewport:{width:768,height:1024}},{id:'desktop',viewport:{width:1366,height:768}}];
async function open(page,device,unit,entry){
 await page.goto('/?'+new URLSearchParams({unit,page:entry,state:'collapsed',device:device.id}));
 await expect(page.locator('#loading')).toBeHidden({timeout:45000});
 await expect(page.locator('#error')).toBeHidden();
 return page.frameLocator('#frame-shell iframe:not(.pending)');
}
test('wide screens give illustrations readable space and keep cards fixed when all meanings open',async({page},info)=>{
 const frame=await open(page,sizes.at(-1),'unit1-2','words-0'),cards=frame.locator('.unit-word');
 const before=await cards.evaluateAll(items=>items.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
 expect(before[0].height,'landscape slivers waste the available learning space').toBeGreaterThanOrEqual(220);
 expect(await cards.first().locator('img').evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(120);
 for(let i=0;i<await cards.count();i++)await cards.nth(i).click();
 const after=await cards.evaluateAll(items=>items.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};}));
 expect(after).toEqual(before);
 await page.locator('#frame-shell').screenshot({path:info.outputPath('wide-expanded.png')});
});
test('fact diagrams and portrait illustrations share the same caption baseline',async({page})=>{
 const frame=await open(page,sizes.at(-1),'unit7-8','words-0');
 const tops=await frame.locator('.unit-word').evaluateAll(cards=>cards.slice(0,3).map(c=>c.querySelector('.word-phonetic').getBoundingClientRect().top));
 expect(Math.max(...tops)-Math.min(...tops),'different picture shapes must not move the caption area').toBeLessThanOrEqual(1);
});
for(const device of sizes)test(device.id+' sparse cards follow the left column and keep the same card size and controls',async({page},info)=>{
 const frame=await open(page,device,'unit3-4','words-0'),cards=frame.locator('.unit-word'),controls=frame.locator('.word-controls');
 const first=await cards.first().evaluate(e=>{const r=e.getBoundingClientRect();return{left:r.left,top:r.top,height:r.height};}),height=first.height,footer=await controls.boundingBox();
 for(let i=0;i<4;i++)await controls.locator('button').last().click();
 await expect(cards).toHaveCount(1);await expect(cards.first()).toHaveAttribute('aria-label','sir');
 const geometry=await cards.first().evaluate(e=>{const c=e.getBoundingClientRect();return{height:c.height,left:c.left,top:c.top,scroll:e.scrollHeight-e.clientHeight};});
 expect(Math.abs(geometry.left-first.left),'a single card starts in the first column').toBeLessThan(1);
 expect(Math.abs(geometry.top-first.top),'sparse pages keep the normal first row').toBeLessThan(1);
 expect(Math.abs(geometry.height-height),'last-group hint must not shrink the card').toBeLessThan(1);
 expect((await controls.boundingBox()).y).toBe(footer.y);
 expect(geometry.scroll).toBe(0);
 await cards.first().press('Enter');await expect(cards.first().locator('.word-meaning')).toHaveText(singleWord.cn);
 expect(await cards.first().evaluate(e=>e.querySelector('strong').getBoundingClientRect().top>=e.getBoundingClientRect().top)).toBe(true);
 await cards.first().press('Enter');await expect(cards.first()).toHaveAttribute('aria-expanded','false');
 await page.locator('#frame-shell').screenshot({path:info.outputPath('single-card-'+device.id+'.png')});
 const sparse=await open(page,device,'unit1-2','words-3'),boxes=await sparse.locator('.unit-word').evaluateAll(items=>items.map(e=>{const r=e.getBoundingClientRect();return{left:r.left,top:r.top};}));
 const columns=device.viewport.width<=600?2:3;expect(boxes).toHaveLength(3);
 for(let i=columns;i<boxes.length;i++)expect(Math.abs(boxes[i].left-boxes[i%columns].left),'an incomplete row follows normal column order').toBeLessThan(1);
});
