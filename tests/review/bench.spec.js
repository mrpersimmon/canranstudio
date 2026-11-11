'use strict';
const {test,expect}=require('@playwright/test');
async function open(page,options={}){
 await page.goto('/?'+new URLSearchParams({unit:'unit3-4',page:'cover',device:'chrome-iphone-se',...options}));
 await expect(page.locator('#loading')).toBeHidden({timeout:60000});
 await expect(page.locator('#error')).toBeHidden();
 return page.frameLocator('#frame-shell iframe:not(.pending)');
}
test('real lesson preview opens, changes viewport, and directly renders a selected question',async({page})=>{
 const frame=await open(page);
 await expect(frame.locator('#cover')).toBeVisible();
 const catalog=await (await page.request.get('/review/catalog.json')).json();
 const entry=catalog.courses[1].entries.find(e=>e.kind==='question'&&e.activity==='roles');
 await page.locator('#entries button').filter({has:page.locator('span',{hasText:entry.title})}).click();
 await expect(page.locator('#loading')).toBeHidden({timeout:30000});
 await expect(frame.locator('.practice-runner:visible')).toContainText('第 1');
 await page.locator('#state-buttons [data-state="wrong"]').click();await ready(page);
 await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
 for(const d of catalog.devices.slice(0,3)){
  await page.locator('#device').selectOption(d.id);
  await expect.poll(()=>frame.locator('body').evaluate(()=>[innerWidth,innerHeight])).toEqual([d.width,d.height]);
 }
});
module.exports={open};
async function ready(page){await expect(page.locator('#loading')).toBeHidden({timeout:30000});await expect(page.locator('#frame-shell')).not.toHaveAttribute('aria-busy','true');await expect(page.locator('#error')).toBeHidden();}

test('cover navigation keeps all three real covers visible on required phones and desktop',async({page})=>{
 await open(page,{unit:'unit1-2'});
 const catalog=await(await page.request.get('/review/catalog.json')).json();
 for(const course of catalog.courses.slice(0,3)){
  const frame=await choose(page,course.id,course.entries.find(e=>e.id==='cover'));
  for(const d of [...catalog.devices.slice(0,3),catalog.devices.find(d=>d.id==='desktop')]){
   await page.locator('#device').selectOption(d.id);
   await expect(frame.locator('#cover')).toBeVisible();await expect(frame.locator('#startBtn')).toBeVisible();
   // IntersectionObserver ratios round after the outer frame is scaled (e.g.
   // 0.999998). Verify containment in the actual course CSS viewport instead.
   const box=await frame.locator('#startBtn').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight};});
   expect(box.left).toBeGreaterThanOrEqual(-.01);expect(box.top).toBeGreaterThanOrEqual(-.01);expect(box.right).toBeLessThanOrEqual(box.width+.01);expect(box.bottom).toBeLessThanOrEqual(box.height+.01);
   await expect.poll(()=>frame.locator('#cover').evaluate(el=>getComputedStyle(el).display)).toBe('flex');
   if(d.id==='desktop')expect(await frame.locator('#cover').evaluate(el=>el.getBoundingClientRect().width)).toBeLessThanOrEqual(740);
  }
 }
});

async function choose(page,unit,entry,state){
 if(await page.locator('#unit').inputValue()!==unit)await page.locator('#unit').selectOption(unit);
 if(new URL(page.url()).searchParams.get('page')!==entry.id)await page.locator('#entries button').filter({has:page.locator('span',{hasText:new RegExp('^'+entry.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')})}).click();
 if(state&&await page.locator('#state-buttons [data-state="'+state+'"]').getAttribute('aria-pressed')!=='true')await page.locator('#state-buttons [data-state="'+state+'"]').click();
 await ready(page);
 return page.frameLocator('#frame-shell iframe:not(.pending)');
}
for(const unit of ['unit1-2','unit3-4','unit5-6'])test(unit+' complete directory opens original pages, questions, results and awards',async({page},testInfo)=>{
 test.setTimeout(300000);
 await open(page,{unit});
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.id===unit);
 for(const entry of course.entries){
  await test.step(entry.id+' '+entry.title,async()=>{
   const frame=await choose(page,unit,entry);
   if(entry.kind==='question'){
    const runner=frame.locator('.practice-runner:visible');await expect(runner).toBeVisible();
    await expect.poll(()=>runner.evaluate(el=>CanranCore.lesson49Practice.controllerFor(el).progress().index)).toBe(entry.index);
   }
   if(entry.kind==='story-line')await expect(frame.locator('.dialogue-status:visible')).toContainText((entry.index+1)+' /');
   if(entry.kind==='result')await expect(frame.locator('.practice-finish:visible')).toBeVisible();
   if(entry.kind==='award')await expect(frame.locator('.award-reveal[open]')).toBeVisible({timeout:10000});
   if(['reference','record','menu'].includes(entry.kind))await expect(frame.locator('dialog[open]')).toBeVisible();
   if(entry.kind==='card')await expect(frame.locator('.story-award-paper:visible')).toContainText('验收同学');
  });
 }
 await page.screenshot({path:testInfo.outputPath(unit+'-directory.png')});
});

for(const type of ['选择','配对','填空','词块组句','指认','词块排序'])test('states use the real feedback and readonly review · '+type,async({page})=>{
 await open(page,{unit:'unit1-2'});
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses.find(c=>c.entries.some(e=>e.kind==='question'&&e.type===type));
 const entry=course.entries.find(e=>e.kind==='question'&&e.type===type);
 for(const state of ['selected','correct','wrong','corrected','review']){
  const frame=await choose(page,course.id,entry,state);
  if(['correct','wrong','corrected'].includes(state))await expect(frame.locator('.practice-answer-note:visible')).toContainText(state==='wrong'?'答错了':'答对了');
  if(state==='selected')await expect(frame.getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();
  if(state==='review')await expect(frame.locator('.practice-runner:visible')).toHaveAttribute('data-practice-review','');
 }
});
test('states use the original hints, explanations, translations and reward overlays',async({page})=>{
 await open(page,{unit:'unit1-2'});
 const catalog=await(await page.request.get('/review/catalog.json')).json(),course=catalog.courses[0];
 for(const state of ['hint','explanation','full']){
  const entry=course.entries.find(e=>e.states.includes(state));expect(entry,state).toBeTruthy();const frame=await choose(page,course.id,entry,state);
  if(state==='hint')await expect(frame.locator('.practice-hint:visible')).toBeVisible();
  else await expect(frame.locator('dialog[open]')).toBeVisible();
 }
 await choose(page,course.id,course.entries.find(e=>e.id==='story-0'),'translated');
 const card=course.entries.find(e=>e.id==='card');await choose(page,course.id,card,'card');
 const award=course.entries.find(e=>e.kind==='award');const frame=await choose(page,course.id,award,'replay');await expect(frame.locator('.award-reveal[open]')).toBeVisible();
});

test.describe('required phone snapshots',()=>{
 test.describe.configure({mode:'parallel'});
for(const device of require('../support/required-phone-devices.json').devices)for(const unit of ['unit1-2','unit3-4','unit5-6'])test('all three phone sizes · '+device.name+' · '+unit+' reference sheets, words, cards and directory',async({page},testInfo)=>{
 // Each device/course has its own session and budget. Repeated real package
 // integrity checks in Windows WebKit must not exhaust one aggregate test.
 test.setTimeout(120000);
  await open(page,{unit,device:device.id});
  const catalog=await(await page.request.get('/review/catalog.json')).json();
  const course=catalog.courses.find(c=>c.id===unit);
   let frame=await choose(page,course.id,course.entries.find(e=>e.id==='cover'));
   await expect(frame.locator('#startBtn')).toBeVisible();
   frame=await choose(page,course.id,course.entries.find(e=>e.id==='words-0'),'expanded');
   await expect(frame.locator('.unit-word:visible')).toHaveCount(6);
   for(const entry of course.entries.filter(e=>['reference','record','menu','writing'].includes(e.kind))){
    frame=await choose(page,course.id,entry);await expect(frame.locator('dialog[open]')).toBeVisible();
    const rect=await frame.locator('dialog[open]').evaluate(el=>({x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,right:el.getBoundingClientRect().right,bottom:el.getBoundingClientRect().bottom,w:innerWidth,h:innerHeight}));
    expect(rect.x).toBeGreaterThanOrEqual(-1);expect(rect.y).toBeGreaterThanOrEqual(-1);expect(rect.right).toBeLessThanOrEqual(rect.w+1);expect(rect.bottom).toBeLessThanOrEqual(rect.h+1);
   }
   frame=await choose(page,course.id,course.entries.find(e=>e.id==='card'),'card');
   await expect(frame.locator('.story-award-tasks')).toHaveCount(0);
  await page.screenshot({path:testInfo.outputPath(device.id+'.png')});
 await page.setViewportSize({width:375,height:667});
 await page.getByRole('button',{name:'页面目录',exact:true}).click();
 await page.getByRole('searchbox').fill('认领小挑战');await expect(page.locator('#entries button').first()).toBeVisible();
 await page.locator('#entries button').first().click();await expect(page.locator('#directory-dialog')).not.toBeVisible();
 await ready(page);
 expect(await page.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
});

test('search, keyboard, history, copied links, rapid selection and reset keep demonstration data isolated',async({page,context})=>{
 test.setTimeout(120000);
 const requests=[];page.on('request',r=>{if(r.method()!=='GET'||new URL(r.url()).pathname.startsWith('/api/'))requests.push(r.url());});
 let frame=await open(page);
 await page.evaluate(()=>localStorage.setItem('review-isolation-sentinel','keep'));
 await page.getByRole('searchbox').fill('Lesson 1-2');await expect(page.locator('#entries button')).toHaveCount(67);
 await page.getByRole('searchbox').fill('第 2 题');const results=await page.locator('#entries button').count();expect(results).toBe(15);
 await page.locator('#entries button').first().click();await ready(page);const firstUrl=page.url();
 await page.getByRole('searchbox').press('ArrowRight');expect(page.url()).toEqual(firstUrl);
 await page.getByRole('button',{name:'下一页',exact:true}).click();await ready(page);expect(page.url()).not.toEqual(firstUrl);
 await page.goBack();await ready(page);expect(page.url()).toEqual(firstUrl);
 await page.getByRole('searchbox').fill('');
 const course=(await(await page.request.get('/review/catalog.json')).json()).courses[0],q=course.entries.find(e=>e.kind==='question'&&e.activity==='roles');
 frame=await choose(page,course.id,q,'wrong');
 await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
 expect(await page.evaluate(()=>localStorage.getItem('review-isolation-sentinel'))).toBe('keep');
 expect(await frame.locator('body').evaluate(()=>localStorage.getItem('review-isolation-sentinel'))).toBeNull();
 const storage=await page.evaluate(()=>Object.keys(localStorage));expect(storage.filter(k=>k.includes('learning')||k.includes('awards'))).toEqual([]);
 await page.getByRole('button',{name:'复制本项链接',exact:true}).click();
 await expect.poll(async()=>await page.locator('#notice').textContent()).toMatch(/已复制|尺寸模拟/);
 if(await page.locator('#copy-dialog').isVisible())await page.getByRole('button',{name:'关闭',exact:true}).click();
 const location=page.url();await page.reload();await ready(page);expect(page.url()).toEqual(location);await expect(frame.locator('.practice-answer-note:visible')).toContainText('答错了');
 await page.locator('#state-buttons [data-state="before"]').click();await page.locator('#state-buttons [data-state="corrected"]').click();await ready(page);
 await expect(frame.locator('.practice-answer-note:visible')).toContainText('答对了');
 await page.getByRole('button',{name:'重置本页',exact:true}).click();await ready(page);await expect(frame.locator('.practice-answer-note:visible')).toContainText('答对了');
 await page.locator('#current-title').click();await page.keyboard.press('ArrowRight');await ready(page);expect(new URL(page.url()).searchParams.get('page')).not.toBe(q.id);
 expect(requests).toEqual([]);
});
