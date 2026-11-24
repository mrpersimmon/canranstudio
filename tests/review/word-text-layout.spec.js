'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {devices}=require('../support/required-phone-devices'),{definition}=require('../../server/progress'),{profilesFor}=require('../../scripts/prepare-word-decks'),{createPages}=require('../../core/word-deck');
const units=process.env.SAMPLE_UNITS?.split(',')||['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12'];
test.describe.configure({mode:'parallel'});
for(const unit of units)test(unit+' all word text keeps its own readable space',async({page},info)=>{
 const source=definition(process.cwd(),unit,'/'),profiles=profilesFor(process.cwd(),unit,source),pages=createPages(source.learning.WORDS,profiles),issues=[];
 await page.goto('/?'+new URLSearchParams({unit,page:'words-0',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:60000});const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 for(const [index,expected]of pages.entries()){
  if(index)await frame.locator('.word-controls button').last().click();await expect(frame.locator('.unit-word>strong')).toHaveText(expected.words.map(w=>w.en));
  for(const device of devices){await page.locator('#device').selectOption(device.id);await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const errors=await frame.locator('.unit-word').evaluateAll(cards=>cards.flatMap(card=>{
    const errors=[],b=card.getBoundingClientRect(),elements=[...card.querySelectorAll(':scope>.word-context,:scope>strong,:scope>.word-phonetic')].filter(e=>e.getClientRects().length),rects=elements.map(e=>({class:e.className,text:e.textContent,b:e.getBoundingClientRect()}));
    for(const e of rects)if(e.b.top<b.top+3||e.b.bottom>b.bottom-3||e.b.left<b.left+3||e.b.right>b.right-3)errors.push({type:'text-outside-card',text:e.text});
    for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],z=rects[j];if(Math.min(a.b.right,z.b.right)-Math.max(a.b.left,z.b.left)>.5&&Math.min(a.b.bottom,z.b.bottom)-Math.max(a.b.top,z.b.top)>.5)errors.push({type:'text-overlap',first:a.text,second:z.text});}
    const context=card.querySelector('.word-context');if(context&&parseFloat(getComputedStyle(context).fontSize)<16)errors.push({type:'context-font-too-small'});
    return errors.map(e=>({word:card.getAttribute('aria-label'),...e}));
   }));if(errors.length)issues.push({page:index,device:device.id,errors});
   await page.locator('#frame-shell').screenshot({path:info.outputPath(expected.kind+'-'+expected.local+'-'+device.id+'.png')});
  }
 }
 await fs.writeFile(info.outputPath('text-findings.json'),JSON.stringify({unit,pages:pages.length,issues},null,2));expect(issues).toEqual([]);
});
