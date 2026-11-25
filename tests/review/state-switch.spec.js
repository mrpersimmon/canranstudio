'use strict';
const {test,expect}=require('@playwright/test');
const question={unit:'unit3-4',page:'q:u34-grammar-v1-known-owner',state:'selected',device:'chrome-iphone-se'};
async function ready(page){await expect(page.locator('#loading')).toBeHidden({timeout:30000});await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(page.locator('#error')).toBeHidden();}
async function selectState(page,state){
 // This compatibility branch also measures the old implementation before the fix.
 if(await page.locator('select#state').count())await page.locator('select#state').selectOption(state);
 else await page.locator('#state-buttons button[data-state="'+state+'"]').click();
 await ready(page);
}
test('changing a question state reuses the loaded document and does not reload course resources',async({page},info)=>{
 const documents=[];page.on('request',r=>{if(r.resourceType()==='document'&&r.url().includes('/lesson/'))documents.push(r.url());});
 await page.goto('/?'+new URLSearchParams(question));await ready(page);
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),before=await frame.locator('body').evaluate(()=>performance.timeOrigin),count=documents.length;
 const start=Date.now();await selectState(page,'wrong');const elapsed=Date.now()-start;
 await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
 const after=await frame.locator('body').evaluate(()=>performance.timeOrigin);
 const evidence={browser:info.project.name,elapsedMs:elapsed,documentRequests:documents.length-count,sameDocument:before===after};
 console.log('State switch:',JSON.stringify(evidence));await info.attach('state-switch-timing',{body:JSON.stringify(evidence),contentType:'application/json'});
 expect(after).toBe(before);expect(documents.length).toBe(count);
});
test('display states are directly clickable buttons with a clear selected state',async({page})=>{
 await page.goto('/?'+new URLSearchParams(question));await ready(page);
 const group=page.getByRole('group',{name:'展示状态',exact:true});await expect(group).toBeVisible();
 await expect(group.getByRole('button',{name:'已选未检查',exact:true})).toHaveAttribute('aria-pressed','true');
 await group.getByRole('button',{name:'答错',exact:true}).click();await ready(page);
 await expect(group.getByRole('button',{name:'答错',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(group.locator('[aria-pressed="true"]')).toHaveCount(1);
});

test('in-place rapid state changes, history and resetting retain only the latest isolated demonstration',async({page})=>{
 await page.goto('/?'+new URLSearchParams(question));await ready(page);
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),origin=await frame.locator('body').evaluate(()=>performance.timeOrigin);
 await page.evaluate(()=>localStorage.setItem('state-switch-sentinel','unchanged'));
 await page.locator('#state-buttons [data-state=review]').click();await page.locator('#state-buttons [data-state=hint]').click();await page.locator('#state-buttons [data-state=wrong]').click();await ready(page);
 await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');await expect(frame.locator('[data-practice-review]:visible')).toHaveCount(0);
 await page.locator('#state-buttons [data-state=corrected]').click();await ready(page);await expect(frame.locator('.practice-answer-note:visible')).toContainText('答对了');
 await page.locator('#state-buttons [data-state=before]').click();await ready(page);
 const state=await frame.locator('body').evaluate(()=>{const key=CanranCore.learningContext.progress.learningKey;const saved=JSON.parse(localStorage.getItem(key));return {origin:performance.timeOrigin,records:Object.keys(saved.records),group:Object.values(saved.groups).find(g=>g.signature.includes('u34-grammar-v1-known-owner'))};});
 expect(state.origin).toBe(origin);expect(state.group.states.at(-1).attempts).toBe(0);expect(state.records).not.toContain('u34-grammar-v1-known-owner');
 expect(await page.evaluate(()=>localStorage.getItem('state-switch-sentinel'))).toBe('unchanged');
 expect(await frame.locator('body').evaluate(()=>localStorage.getItem('state-switch-sentinel'))).toBeNull();
 // Reapplying the highlighted preset also resets an exploratory answer.
 await frame.getByRole('button',{name:'No.',exact:true}).click();await selectState(page,'before');
 await expect(frame.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 expect(await frame.locator('body').evaluate(()=>Object.values(JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)).groups).find(g=>g.signature.includes('u34-grammar-v1-known-owner')).states.at(-1).tokens||[])).toEqual([]);
 expect(await frame.locator('body').evaluate(()=>performance.timeOrigin)).toBe(origin);
 await page.locator('#state-buttons [data-state=before]').press('ArrowRight');await ready(page);
 await expect(page.locator('#state-buttons [data-state=selected]')).toBeFocused();await expect(frame.getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();
 expect(new URL(page.url()).searchParams.get('page')).toBe(question.page);
 await page.getByRole('button',{name:'重置本页',exact:true}).click();await ready(page);expect(await frame.locator('body').evaluate(()=>performance.timeOrigin)).not.toBe(origin);
 await expect(frame.getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();
});

test('in-place word meanings, translation, results and original awards stay reversible',async({page})=>{
 test.setTimeout(120000);
 const cases=[
  {page:'words-0',from:'collapsed',to:'expanded'},
  {page:'story-0',from:'english',to:'translated'},
  {page:'result:reply',from:'perfect',to:'corrected'},
  {page:'award:reply',from:'earned',to:'replay'}
 ];
 for(const c of cases){
  await page.goto('/?'+new URLSearchParams({...question,page:c.page,state:c.from,stars:5}));await ready(page);
  const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),time=await frame.locator('body').evaluate(()=>performance.timeOrigin);
  for(const state of [c.to,c.from,c.to]){
   await selectState(page,state);
   expect(await frame.locator('body').evaluate(()=>performance.timeOrigin)).toBe(time);
   if(c.page==='words-0')await expect(frame.locator('.unit-words .unit-word').first()).toHaveAttribute('aria-expanded',String(state==='expanded'));
   if(c.page==='story-0')await expect(frame.locator('.dialogue-log .bcn').last()).toBeVisible({visible:state==='translated'});
   if(c.page==='result:reply')await expect(frame.locator('.award-round-result')).toHaveAttribute('data-perfect',String(state==='perfect'));
   if(c.page==='award:reply'){await expect(frame.locator('.award-reveal[open]')).toBeVisible();await expect(frame.locator('.award-reveal')).toHaveAttribute('data-kind',state==='replay'?'replay':'full');}
  }
 }
});

test('in-place replies arriving after page navigation cannot finish the newer page request',async({page})=>{
 await page.goto('/?'+new URLSearchParams(question));await ready(page);
 const oldFrame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 const oldRequest=await page.evaluate(()=>{
  window.prematureReady=[];new MutationObserver(()=>{if(document.querySelector('iframe.pending')&&document.getElementById('frame-shell').getAttribute('aria-busy')!=='true')window.prematureReady.push(true);}).observe(document.getElementById('frame-shell'),{childList:true,attributes:true});
  document.querySelector('#state-buttons [data-state=hint]').click();const id=document.querySelector('iframe:not(.pending)').dataset.request;document.getElementById('next').click();return id;
 });
 // Reproduce a late completion from the old document, independent of engine scheduling.
 await oldFrame.evaluate(id=>parent.postMessage({type:'review-ready',requestId:id,fastStates:true},location.origin),oldRequest);
 await ready(page);
 expect(await page.evaluate(()=>window.prematureReady)).toEqual([]);
 const destination=new URL(page.url()).searchParams.get('page');expect(destination).not.toBe(question.page);
 await expect(page.locator('#frame-shell iframe:not(.pending)')).toHaveAttribute('data-page',destination,{timeout:1000});
 await expect(page.locator('#frame-shell iframe.pending')).toHaveCount(0);
});

test('in-place state changes keep each of Lessons 1–6 on its own original question',async({page})=>{
 const catalog=await(await page.request.get('/review/catalog.json')).json();
 for(const course of catalog.courses.slice(0,3)){
  const entry=course.entries.find(e=>e.kind==='question'&&e.states.includes('explanation'))||course.entries.find(e=>e.kind==='question'&&e.activity==='introduce');
  await page.goto('/?'+new URLSearchParams({...question,unit:course.id,page:entry.id,state:'before'}));await ready(page);
  const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),time=await frame.locator('body').evaluate(()=>performance.timeOrigin);
  for(const state of ['correct','wrong','corrected','review','explanation','before'].filter(s=>entry.states.includes(s))){
   await selectState(page,state);expect(await frame.locator('body').evaluate(()=>performance.timeOrigin)).toBe(time);
   if(state==='wrong')await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
   if(state==='review')await expect(frame.locator('[data-practice-review]:visible')).toHaveCount(1);
   if(state==='explanation')await expect(frame.locator('.learning-explanation-sheet[open]')).toBeVisible();
   if(state==='before'){await expect(frame.locator('dialog[open]')).toHaveCount(0);await expect(frame.locator('[data-practice-review]:visible')).toHaveCount(0);}
  }
 }
});

for(const device of require('../support/required-phone-devices.json').devices)test('state controls fit '+device.name+' without page overflow',async({page},info)=>{
 await page.setViewportSize(device.viewport);
 await page.goto('/?'+new URLSearchParams({...question,device:device.id}));await ready(page);
 const group=page.getByRole('group',{name:'展示状态',exact:true});
 for(const state of ['hint','review','before']){
  await selectState(page,state);const button=group.locator('[data-state="'+state+'"]');await expect(button).toBeInViewport();
  expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)');await expect.poll(()=>frame.locator('body').evaluate(()=>[innerWidth,innerHeight])).toEqual([device.viewport.width,device.viewport.height]);
 await page.screenshot({path:info.outputPath('state-buttons.png')});
});
