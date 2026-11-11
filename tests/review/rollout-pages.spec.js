'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises');
const {UNITS}=require('../../server/catalog');
const {devices:requiredDevices}=require('../support/required-phone-devices');
const devices=process.env.ROLLOUT_EXTRA_DEVICES?[
 {id:'small-phone',viewport:{width:320,height:568}},
 {id:'tablet',viewport:{width:768,height:1024}},
 {id:'desktop',viewport:{width:1366,height:768}}
]:requiredDevices;
const selected=process.env.ROLLOUT_UNITS?.split(',')||UNITS;
test.describe.configure({mode:'parallel'});
for(const unit of selected)test(unit+' complete presentation on required phones',async({page},info)=>{
 test.setTimeout(300000);const findings=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.id===unit);
 const entries=course.entries.filter(e=>['cover','words','story-start','story-complete','reference','record','menu','writing','result','card'].includes(e.kind));
 await page.goto('/?'+new URLSearchParams({unit,page:'cover',device:devices[0].id}));
 let layouts=0;
 for(const entry of entries){
  if(entry.id!=='cover')await page.locator('.entry[data-page="'+entry.id+'"]').evaluate(el=>el.click());
  await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');
  await expect(page.locator('#error')).toBeHidden();
  const frame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);
   await frame.waitForFunction(size=>document.body.dataset.practiceViewport===size,device.viewport.width+'x'+device.viewport.height);
   await frame.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const issues=await frame.evaluate(({kind,index})=>{
    const issues=[],shown=e=>e.getClientRects().length&&!e.closest('[hidden]')&&getComputedStyle(e).visibility!=='hidden';
    const surface=document.querySelector('.learning-surface'),dialog=document.querySelector('dialog[open]'),root=dialog||surface;
    if(document.documentElement.scrollWidth>innerWidth+1)issues.push({type:'horizontal-overflow'});
    for(const e of root.querySelectorAll('img'))if(shown(e)&&(!e.complete||!e.naturalWidth))issues.push({type:'image-not-ready',src:e.getAttribute('src')});
    for(const e of root.querySelectorAll('.word-controls,.practice-finish-actions,#startBtn,.story-award-actions'))if(shown(e)){
     const r=e.getBoundingClientRect();if(r.right>innerWidth+1||r.left<-1||r.bottom>innerHeight-5)issues.push({type:'actions-clipped',class:e.className,box:r.toJSON()});
    }
    const art=root.querySelector('.learning-story-art');if(art){const box=art.getBoundingClientRect();for(const e of art.querySelectorAll('img'))if(shown(e)){const r=e.getBoundingClientRect();if(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1)issues.push({type:'scene-clipped',class:e.className,src:e.getAttribute('src')});}}
    if(kind==='story-complete'){const log=root.querySelector('.dialogue-log'),last=log.lastElementChild,b=log.getBoundingClientRect(),r=last.getBoundingClientRect();if(b.height<80||r.bottom>b.bottom+2||r.bottom<=b.top)issues.push({type:'story-dialogue-hidden'});}
    if(kind==='words')for(const card of root.querySelectorAll('.unit-word')){
     if(card.scrollWidth>card.clientWidth+2)issues.push({type:'word-overflow',text:card.textContent});
     if(card.scrollHeight>card.clientHeight+1)issues.push({type:'word-inner-scroll',text:card.textContent,pixels:card.scrollHeight-card.clientHeight});
     const b=card.getBoundingClientRect(),c=card.closest('.learning-word-content').getBoundingClientRect();if(innerHeight>=667&&b.bottom>c.bottom+2)issues.push({type:'word-offscreen',text:card.textContent});
     const nth=[...root.querySelectorAll('.unit-word')].indexOf(card),word=CanranCore.learningContext.learning.WORDS[index*6+nth];
     const footer=root.querySelector('.word-controls').getBoundingClientRect();card.click();
     for(const [selector,value]of [['strong',word.en],['.word-phonetic',word.ph],['.word-meaning',word.cn],['.word-example',word.example]])if(value){const node=card.querySelector(selector);if(!node||node.hidden||node.textContent!==value)issues.push({type:'word-detail-missing',word:word.en,selector});}
     if(Math.abs(footer.top-root.querySelector('.word-controls').getBoundingClientRect().top)>1)issues.push({type:'word-expansion-moves-actions',word:word.en});card.click();
    }
    if(dialog){const b=dialog.getBoundingClientRect();if(b.left<0||b.right>innerWidth+1||b.top<0||b.bottom>innerHeight+1)issues.push({type:'dialog-outside'});
     if(dialog.scrollWidth>dialog.clientWidth+2)issues.push({type:'dialog-horizontal-scroll'});
    }
    return issues;
   },{kind:entry.kind,index:entry.index});
   if(issues.length)findings.push({page:entry.id,device:device.id,issues});layouts++;
   if(device===devices[0]&&(['cover','story-complete','card'].includes(entry.id)||entry.id==='words-0'||issues.length&&findings.length<5))await page.locator('#frame-shell').screenshot({path:info.outputPath(entry.id.replace(/[^a-z0-9-]/gi,'_')+'.png')});
  }
 }
 await fs.writeFile(info.outputPath('findings.json'),JSON.stringify({unit,entries:entries.length,layouts,findings,errors},null,2));
 expect(errors).toEqual([]);expect(findings).toEqual([]);
});
