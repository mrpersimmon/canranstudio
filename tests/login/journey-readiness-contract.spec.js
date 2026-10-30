'use strict';
const {test,expect}=require('@playwright/test');
const {waitForModulesReady}=require('../support/journey-modules');
const ids=['unit1-2','unit3-4'];
const pixel='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="green"/></svg>');

// This exercises the test helper against real DOM nodes and decoded images.
// It does not modify the application, course data, or student results.
async function fixture(page,courses=ids){
 await page.setContent(`<section class="journey-map" data-chapter="chapter-a"></section>
  <section class="journey-map-scene" data-chapter="chapter-a" data-composition="modules">
  ${courses.length?`<div data-route-world data-world-state="ready"><img data-route-terrain src="${pixel}">
  ${courses.map(id=>`<article data-module-course="${id}" data-art-state="ready"><img data-module-ground src="${pixel}"><img data-story-course src="${pixel}"></article>`).join('')}</div>`:''}</section>`);
 await page.evaluate(()=>Promise.all([...document.images].map(img=>img.decode())));
}
function observe(page){
 const reads=[],calls={locators:0};
 const observed=new Proxy(page,{get(target,key){
  if(key==='evaluate')return async(...args)=>{const value=await target.evaluate(...args);reads.push(value);return value;};
  if(key==='locator')return(...args)=>{calls.locators++;return target.locator(...args);};
  const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value;
 }});
 return{page:observed,reads,calls};
}

test('就绪快检保留切换、课程顺序、真实解码与空目录的原等待边界',async({page})=>{
 for(const expected of [ids,undefined,[]]){
  await fixture(page,expected||ids);
  const probe=observe(page);
  await waitForModulesReady(probe.page,expected);
  // The removed chapter select was read through getByLabel. Its replacement
  // is one locator read of the map identity, not an extra readiness wait.
  expect({snapshots:probe.reads,locatorCalls:probe.calls.locators},'one chapter read and one readiness snapshot; no waiting sequence').toEqual({snapshots:[true],locatorCalls:1});
 }
 const faults=[
  ['missing scene',()=>document.querySelector('.journey-map-scene').remove()],
  ['two scenes',()=>document.body.insertAdjacentHTML('beforeend','<section class="journey-map-scene"></section>')],
  ['previous chapter',()=>document.querySelector('.journey-map-scene').dataset.chapter='previous'],
  ['wrong composition',()=>document.querySelector('.journey-map-scene').dataset.composition='portrait'],
  ['missing course',()=>document.querySelector('[data-module-course]').remove()],
  ['wrong course',()=>document.querySelector('[data-module-course]').dataset.moduleCourse='unit9-10'],
  ['reordered courses',()=>{const first=document.querySelector('[data-module-course]');first.parentNode.append(first);}],
  ['two worlds',()=>document.body.insertAdjacentHTML('beforeend','<div data-route-world data-world-state="ready"></div>')],
  ['missing world',()=>{const world=document.querySelector('[data-route-world]');world.replaceWith(...world.childNodes);}],
  ['world preparing',()=>document.querySelector('[data-route-world]').dataset.worldState='preparing'],
  ['missing terrain',()=>document.querySelector('[data-route-terrain]').remove()],
  ['two terrains',()=>document.body.append(document.querySelector('[data-route-terrain]').cloneNode())],
  ['terrain decode failure',async()=>{const img=document.querySelector('[data-route-terrain]');img.src='data:image/png;base64,broken';await img.decode().catch(()=>{});}],
  ['figure preparing',()=>document.querySelector('[data-module-course]').dataset.artState='loading'],
  ['missing image set',()=>document.querySelectorAll('[data-module-ground],[data-story-course]').forEach(img=>img.remove())],
  ['figure decode failure',async()=>{const img=document.querySelector('[data-story-course]');img.src='data:image/png;base64,broken';await img.decode().catch(()=>{});}],
  ['remaining status',()=>document.querySelector('[data-module-course]').insertAdjacentHTML('beforeend','<span class="journey-module-status" hidden>准备中</span>')]
 ];
 for(const [name,mutate]of faults)await test.step(name,async()=>{
  await fixture(page);await page.evaluate(mutate);
  const probe=observe(page);let resolved=false;
  const pending=waitForModulesReady(probe.page,ids).then(()=>{resolved=true;},error=>error);
  await expect.poll(()=>probe.reads.length).toBe(1);
  expect(probe.reads[0],'incomplete DOM must take the original waiting path').toBe(false);
  expect(resolved,'incomplete DOM is not accepted before restoration').toBe(false);
  await fixture(page);await pending;
  expect(probe.calls.locators,'original waiting checks remain active after the chapter read').toBeGreaterThan(1);
  await waitForModulesReady(page,ids);
 });
 for(const ghost of ['<img data-route-terrain>','<div class="journey-world-passage"></div>']){
  await fixture(page,[]);await page.evaluate(html=>document.body.insertAdjacentHTML('beforeend',html),ghost);
  const probe=observe(page);let resolved=false;
  const pending=waitForModulesReady(probe.page,[]).then(()=>{resolved=true;},error=>error);
  await expect.poll(()=>probe.reads.length).toBe(1);expect(probe.reads[0]).toBe(false);expect(resolved).toBe(false);
  await fixture(page,[]);await pending;expect(probe.calls.locators).toBeGreaterThan(0);
 }
 await fixture(page,[]);
 const probe=observe(page);let resolved=false;
 const pending=waitForModulesReady(probe.page).then(()=>{resolved=true;},error=>error);
 await expect.poll(()=>probe.reads.length).toBe(1);expect(probe.reads[0],'unspecified IDs still require a course').toBe(false);expect(resolved).toBe(false);
 await fixture(page);await pending;
});
