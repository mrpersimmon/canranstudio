'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const fs=require('node:fs/promises');
async function open(page,unit,entry,device,state){
  await page.goto('/?'+new URLSearchParams({unit,page:entry,state:state||'view',device,stars:'5'}));
  await expect(page.locator('#loading')).toBeHidden({timeout:30000});
  await expect(page.locator('#error')).toBeHidden();
  return page.frameLocator('#frame-shell iframe:not(.pending)');
}
function inspectReference(content){
  const issues=[],visible=el=>!!el.getClientRects().length;
  let previous;
  for(const card of content.querySelectorAll('.phrase-card')){
    if(!visible(card))continue;
    const image=card.querySelector(':scope>img'),text=[...card.querySelectorAll(':scope>strong,:scope>span')].filter(visible);
    const b=card.getBoundingClientRect(),s=getComputedStyle(card);
    if(previous&&b.top>=previous.bottom-1&&b.top-previous.bottom<8)issues.push({type:'touching-reference-cards',text:card.textContent,gap:b.top-previous.bottom});
    previous=b;
    const texts=text.map(el=>({el,b:el.getBoundingClientRect()}));
    if(image){const i=image.getBoundingClientRect();for(const t of texts)if(Math.min(i.right,t.b.right)-Math.max(i.left,t.b.left)>1&&Math.min(i.bottom,t.b.bottom)-Math.max(i.top,t.b.top)>1)issues.push({type:'image-over-text',text:t.el.textContent});}
    const contentHeight=Math.max(image?.getBoundingClientRect().height||0,texts.reduce((sum,t)=>sum+t.b.height,0)+Math.max(0,texts.length-1)*(parseFloat(s.rowGap)||0));
    const padding=['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((sum,p)=>sum+(parseFloat(s[p])||0),0);
    if(b.height-contentHeight-padding>16)issues.push({type:'excess-card-space',text:card.textContent,extra:b.height-contentHeight-padding});
    for(const {el,b:r}of texts)if(r.left<b.left||r.right>b.right+1)issues.push({type:'text-outside-card',text:el.textContent});
  }
  return issues;
}
for(const device of devices){
  test('all six word cards stay usable on '+device.name,async({page},info)=>{
    test.setTimeout(180000);
    for(const unit of ['unit1-2','unit3-4','unit5-6']){
      const frame=await open(page,unit,'words-0',device.id,'collapsed');
      const catalog=await(await page.request.get('/review/catalog.json')).json();
      const groups=catalog.courses.find(c=>c.id===unit).entries.filter(e=>e.kind==='words').length;
      for(let group=0;group<groups;group++){
        const region=frame.locator('.learning-word-content');
        await expect(frame.locator('#wordPageProgress')).toHaveText(`${group+1} / ${groups}`);
        // The course updates the destination row during its layout frame.
        await region.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        const sizes=await region.evaluate(el=>({height:el.clientHeight,total:el.scrollHeight,scroll:el.scrollTop}));
        await page.screenshot({path:info.outputPath(unit+'-words-'+group+'.png')});
        expect(sizes.total-sizes.height,unit+' group '+group).toBe(0);
        const controls=frame.locator('.word-controls'),before=await controls.boundingBox();
        for(const card of await region.locator('.unit-word').all()){
          const word=await card.getAttribute('aria-label');
          const front=await card.evaluate(el=>{const b=el.getBoundingClientRect();return {overflow:el.scrollHeight-el.clientHeight,clipped:[...el.querySelectorAll(':scope>strong,:scope>.word-phonetic')].some(x=>{const r=x.getBoundingClientRect();return r.top<b.top||r.bottom>b.bottom||r.left<b.left||r.right>b.right;})};});
          expect(front,unit+' '+word).toEqual({overflow:0,clipped:false});
          await card.click();await expect(card).toHaveAttribute('aria-expanded','true');
          await expect(card.locator('strong')).toHaveText(word);
          await expect(card.locator('.word-phonetic')).toBeVisible();
          await expect(card.locator('.word-meaning')).toBeVisible();
          const detail=await card.evaluate(el=>({overflow:el.scrollHeight-el.clientHeight,mode:getComputedStyle(el).overflowY}));
          if(detail.overflow>2)expect(['auto','scroll']).toContain(detail.mode);
          expect(Math.abs((await controls.boundingBox()).y-before.y)).toBeLessThanOrEqual(1);
          await card.click();await expect(card).toHaveAttribute('aria-expanded','false');
        }
        await expect(frame.getByRole('button',{name:/^(下一组(?:词卡)?|下一站：)/})).toBeVisible();
        if(group<groups-1)await frame.getByRole('button',{name:/^下一组(?:词卡)?$/,exact:true}).click();
      }
    }
  });
  test('reference sheets keep pictures and text compact and separate on '+device.name,async({page},info)=>{
    test.setTimeout(180000);const findings=[];
    await page.goto('/');const catalog=await(await page.request.get('/review/catalog.json')).json();
    for(const course of catalog.courses.slice(0,3))for(const entry of course.entries.filter(e=>e.kind==='reference')){
      const frame=await open(page,course.id,entry.id,device.id,'open'),dialog=frame.locator('.learning-reference-sheet');
      await expect(dialog).toBeVisible();
      for(const summary of await dialog.locator('details>summary').all())if(await summary.isVisible())await summary.click();
      const issues=await dialog.locator('.learning-reference-content').evaluate(inspectReference);
      findings.push({unit:course.id,entry:entry.id,issues});
      await page.screenshot({path:info.outputPath(course.id+'-'+entry.id+'.png')});
      const close=dialog.getByRole('button',{name:'关闭学习参考',exact:true});await expect(close).toBeVisible();
      const box=await close.evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,right:r.right,w:innerWidth,h:innerHeight};});
      expect(box.top).toBeGreaterThanOrEqual(0);expect(box.bottom).toBeLessThanOrEqual(box.h);expect(box.right).toBeLessThanOrEqual(box.w);
      await close.click();await expect(dialog).not.toBeVisible();
    }
    await fs.writeFile(info.outputPath('reference-findings.json'),JSON.stringify(findings,null,2));
    expect(findings.filter(x=>x.issues.length)).toEqual([]);
  });
  test('cards and records avoid empty gaps and duplicate row markers on '+device.name,async({page},info)=>{
    const findings=[];
    for(const unit of ['unit1-2','unit3-4','unit5-6']){
      let frame=await open(page,unit,'card',device.id,'card');
      const gap=await frame.locator('.stage-certificate').evaluate(el=>el.querySelector(':scope>.offline-task').getBoundingClientRect().top-el.querySelector('.course-ending-navigation').getBoundingClientRect().bottom);
      if(gap>36)findings.push({unit,type:'empty-status-gap',gap});
      await page.screenshot({path:info.outputPath(unit+'-card.png')});
      frame=await open(page,unit,'records',device.id,'open');
      const markers=await frame.locator('.learning-record-group>ul').evaluateAll(items=>items.map(el=>getComputedStyle(el).listStyleType));
      if(markers.some(x=>x!=='none'))findings.push({unit,type:'duplicate-row-markers',markers});
      await page.screenshot({path:info.outputPath(unit+'-records.png')});
      await frame.locator('#unitNotebook').getByRole('button',{name:'关闭',exact:true}).click();
      await expect(frame.locator('#unitNotebook')).not.toBeVisible();
    }
    await fs.writeFile(info.outputPath('card-record-findings.json'),JSON.stringify(findings,null,2));
    expect(findings).toEqual([]);
  });
}
