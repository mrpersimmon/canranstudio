'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const units=(process.env.WHOLE_BOOK_UNITS||Array.from({length:60},(_,i)=>'unit'+(25+i*2)+'-'+(26+i*2)).join(',')).split(',');
test.describe.configure({mode:'parallel'});
for(const unit of units)test(unit+' visual inventory of vocabulary, theatre and original card',async({page},info)=>{
 const states=['words-0','story-start','story-complete','card'],report=[];
 await page.goto('/?'+new URLSearchParams({unit,page:states[0],state:'collapsed',device:'chrome-iphone-se'}));
 for(const [index,state]of states.entries()){
  if(index)await page.locator('.entry[data-page="'+state+'"]').evaluate(e=>e.click());
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
  const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());await frame.waitForFunction(()=>!document.documentElement.hasAttribute('data-course-painting'));
  report.push(await frame.locator('.learning-surface').evaluate((surface,state)=>{const world=surface.querySelector('.learning-story-art'),visible=e=>e.getClientRects().length&&!e.closest('[hidden]');return{state,view:document.body.dataset.learningView,world:world&&{class:world.className,dataset:{...world.dataset},background:getComputedStyle(world).backgroundImage,children:[...world.children].map(e=>({tag:e.tagName,class:e.className})),labels:[...world.querySelectorAll('p,figcaption,.actor-label')].filter(visible).map(e=>({class:e.className,text:e.textContent})),images:[...world.querySelectorAll('img')].filter(visible).map(e=>({src:e.getAttribute('src'),class:e.className,natural:[e.naturalWidth,e.naturalHeight]}))}};},state));
  await page.locator('#frame-shell').screenshot({path:info.outputPath(state+'.png')});
 }
 await fs.writeFile(info.outputPath('inventory.json'),JSON.stringify({unit,report},null,2));
});
