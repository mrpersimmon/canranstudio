'use strict';
const {chooseJourneyChapter}=require('../support/journey-navigation');
const fs=require('node:fs'),path=require('node:path');
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,openCourseDirectory}=require('./helpers');
const {viewports}=require('../support/journey-viewports');
const {assertUnderLandmarks}=require('../support/journey-under-landmark');
const {assertModules,waitForModulesReady}=require('../support/journey-modules');
const continuous=require('../../course-journey/route-worlds').worlds;
const chapters=require('../../course-journey/complete-journey-chapters.json');
const artwork=require('../../course-journey/chapter-layout');
const {fitFrame}=require('../../course-journey/overlay-layout');
const pack=path.resolve(__dirname,'../../docs/designs/course-journey/production/complete-journey-v1');
const selectedVariants=JSON.parse(fs.readFileSync(path.join(pack,'selected-variants.json'),'utf8'));
const newContactBounds={...require('../support/journey-home-hospitality-contact.json').characters,...require('../support/journey-remaining-contact.json').characters};
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{}),browserName:process.env.JOURNEY_REVIEW_BROWSER||'chromium',actionTimeout:10000});
const allLessons=Array.from({length:72},(_,i)=>new RegExp(`Lesson ${i*2+1}–${i*2+2} `));
const results=who=>who.courses.map(c=>[c.id,c.stars,c.firstFullStarAt]);
async function clickWithVisibleMotion(hit){
 const motion=hit.locator('.journey-story-motion');
 await expect.poll(()=>motion.evaluate(e=>e.getAnimations().length)).toBe(0);
 // Observe rendered transforms inside the browser from the click onward.
 // Asking a slow WebKit driver afterwards can miss an already-finished
 // 380 ms bounce; this keeps the real-motion requirement without extending it.
 await hit.evaluate(el=>{
  el.__journeyMotionSamples=[];
  el.addEventListener('click',()=>{
   const start=performance.now(),target=el.querySelector('.journey-story-motion');
   const sample=()=>{el.__journeyMotionSamples.push(getComputedStyle(target).transform);if(performance.now()-start<900)requestAnimationFrame(sample);};
   requestAnimationFrame(sample);
  },{once:true,capture:true});
 });
 await hit.click();
 await expect.poll(()=>hit.evaluate(el=>el.__journeyMotionSamples.some(value=>value!=='none'&&value!=='matrix(1, 0, 0, 1, 0, 0)'))).toBe(true);
}
const bounds=Object.fromEntries(chapters.flatMap(c=>c.courses).map(id=>{
 const job=selectedVariants[id]||id;
 const receipt=JSON.parse(fs.readFileSync(path.join(pack,job+'-receipt.json'),'utf8'));
 return[id,newContactBounds[id]?.alpha16Bounds||receipt.alpha.bounds.find(b=>b.thresholdExclusive===16).normalized];
}));

test('新增入口在完整尺寸与三种获星状态下保持人物、星章和Lesson底牌同轴对应 @journey-layout',async({page,browser})=>{
 test.setTimeout(1800000);await adminLogin(page,base);
 const account=await createStudent(page,'全旅程尺寸检查','小旅人',allLessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
  let stars=0;
  // Only the isolated test response is varied. No learning or award endpoint
  // is written; real authorization and original server results remain intact.
  await p.route('**/api/me',async route=>{const response=await route.fetch(),who=await response.json();await route.fulfill({response,json:{...who,courses:who.courses.map(c=>({...c,stars}))}});});
  for(stars of [0,2,5]){
   await p.reload();await expect(p.locator('.journey-map-scene')).toHaveAttribute('data-map-state','ready');
   for(const chapter of chapters){
    await chooseJourneyChapter(p,chapter.id);
    if(continuous[chapter.id])await waitForModulesReady(p,chapter.courses);else await expect(p.locator('.journey-map-scene')).toHaveAttribute('data-map-state','ready');
    await expect(p.locator('[data-completion-medal]')).toHaveCount(stars===5?3:0);
    await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await p.locator('[data-map-course="'+chapter.courses[0]+'"]').click();
    const sizes=stars===5?viewports():viewports('map','smoke');
    for(const [width,height]of sizes){
     await p.setViewportSize({width,height});
     if(width===320)await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     // Select every node at the smallest width: the selected plate must keep
     // the complete three-digit Lesson range without introducing extra text.
     const selected=width===320?chapter.courses:[chapter.courses[0]];
     for(const id of selected){
      if(width===320)await p.locator('[data-map-course="'+id+'"]').click();
      if(continuous[chapter.id]){
       await assertModules(p,Object.fromEntries(chapter.courses.map(course=>[course,bounds[course]])),width);
       continue;
      }
      const view=await assertUnderLandmarks(p,bounds,width);
      if(width>=1440&&height<=1024){
       // The real map column is narrower than the window. A portrait fallback
       // is allowed only if its aspect ratio requires it, or the original
       // landscape candidate cannot retain safe 12px entrance separation.
       // Actual rendered separation remains independently checked by the DOM
       // helper above; this calculation proves why the candidate was rejected.
       const frame=await p.evaluate(()=>({width:document.querySelector('.journey-map').clientWidth,height:Math.max(1,innerHeight-(document.querySelector('#siteHeader')?.getBoundingClientRect().height||0)),desktop:!!document.querySelector('.journey-desktop-search')}));
       const horizontalCandidate=frame.width>=600&&frame.width/frame.height>=1;
       if(horizontalCandidate){
        const landscape=fitFrame({scene:artwork.chapters[chapter.id].landscape,characters:artwork.characters,viewportWidth:frame.width,desktop:frame.desktop,composition:'landscape'});
        if(view.composition==='portrait')expect(landscape.overlays.collisions,chapter.id+' portrait fallback must have an unsafe landscape candidate').not.toHaveLength(0);
        else{expect(view.composition,chapter.id+' horizontal composition').toBe('landscape');expect(landscape.overlays.collisions,chapter.id+' safe horizontal candidate').toHaveLength(0);}
       }else expect(view.composition,chapter.id+' tall actual map column uses portrait').toBe('portrait');
      }
      for(const ratio of [view.art[1].height/view.art[0].height,view.art[2].height/view.art[1].height]){expect(ratio,chapter.id+' depth').toBeGreaterThanOrEqual(.75);expect(ratio,chapter.id+' depth').toBeLessThanOrEqual(.95);}
     }
     // Keep the same selected first course between resize samples. Re-clicking
     // it on every width added hundreds of redundant input waits in WebKit.
     if(width===320)await p.locator('[data-map-course="'+chapter.courses[0]+'"]').click();
    }
   }
  }
  await p.unroute('**/api/me');expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});

test('每个新增单元支持奇偶 Lesson 搜索、地图定位、人物反馈与真实课程进入',async({page,browser})=>{
 // This is a 57-course batch, not a cold-load performance budget. Keep the
 // existing per-action and 30-second loader limits for every individual course.
 test.setTimeout(chapters.reduce((n,c)=>n+c.courses.length,0)*30000+60000);await adminLogin(page,base);
 const account=await createStudent(page,'全旅程实际进入','小探索家',allLessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},reducedMotion:'no-preference',serviceWorkers:'block'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  for(const chapter of chapters)for(const id of chapter.courses){
   const n=Number(id.match(/\d+/)[0]);
   await openCourseDirectory(p);
   for(const query of [String(n),'Lesson '+(n+1)]){
    await p.getByLabel('查找 Lesson',{exact:true}).fill(query);
    await expect(p.locator('.journey-course:visible')).toHaveCount(1);
    await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit',id);
   }
   await p.locator('.journey-course:visible .journey-locate').click();
   await expect(p.locator('.journey-map')).toHaveAttribute('data-chapter',chapter.id);
   if(continuous[chapter.id])await waitForModulesReady(p,chapter.courses);else await expect(p.locator('.journey-map-scene')).toHaveAttribute('data-map-state','ready');
   const hit=p.locator('[data-landmark-select="'+id+'"]');await clickWithVisibleMotion(hit);
   await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
   await p.locator('.journey-start').click();await expect(p).toHaveURL(new RegExp(id+'/#learn/words$'));
   await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
   await p.getByRole('link',{name:'我的课程',exact:true}).click();
  }
  await p.reload();await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',chapters.at(-1).courses.at(-1));
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});

test('末课与跨段稀疏授权可独立定位，缺图重试和满星重看不改变成绩',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const selected=[chapters[0].courses[1],chapters.at(-1).courses.at(-1)];
 const lessons=selected.map(id=>{const n=Number(id.match(/\d+/)[0]);return new RegExp(`Lesson ${n}–${n+1} `);});
 const account=await createStudent(page,'全旅程稀疏授权','小向导',lessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
  await expect(p.locator('[data-map-course]')).toHaveCount(1);
  expect((await p.request.get(base+chapters[0].courses[0]+'/')).status()).toBe(403);
  const last=selected.at(-1),lastChapter=chapters.at(-1).id;
  let stars=5;
  await p.route('**/api/me',async route=>{const response=await route.fetch(),who=await response.json();await route.fulfill({response,json:{...who,courses:who.courses.map(c=>({...c,stars}))}});});
  await p.reload();await chooseJourneyChapter(p,lastChapter);
  await expect(p.locator('[data-map-course]')).toHaveCount(1);await expect(p.locator('[data-map-course]')).toHaveAttribute('data-map-course',last);
  const medal=p.locator('[data-completion-medal="'+last+'"]');await medal.click();
  await expect.poll(()=>medal.locator('.journey-medal-face').evaluate(e=>e.getAnimations().length)).toBeGreaterThan(0);
  await p.emulateMedia({reducedMotion:'reduce'});await medal.click();
  expect(await medal.locator('.journey-medal-face').evaluate(e=>e.getAnimations().length)).toBe(0);
  const missing='**/assets/course-journey/'+last+'-landmark-v1.webp*';let failures=0;
  await p.route(missing,route=>{failures++;return route.abort();});
  const entry=p.locator('[data-module-course="'+last+'"]'),label='Lesson '+last.slice(4).replace('-','–');
  await p.reload();await expect(entry).toHaveAttribute('data-art-state','error');
  await expect(entry.locator('.journey-module-status')).toBeVisible();expect(failures).toBeGreaterThan(0);
  await expect(p.locator('[data-route-world]')).toHaveAttribute('data-world-state','ready');
  await expect(entry.locator('[data-map-course]')).toBeVisible();
  await openCourseDirectory(p);await p.getByLabel('查找 Lesson',{exact:true}).fill('Lesson '+Number(last.split('-')[1]));
  await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit',last);
  await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
  await p.unroute(missing);await entry.getByRole('button',{name:'重新加载 '+label+' 场景',exact:true}).click();await waitForModulesReady(p,[last]);
  await p.unroute('**/api/me');expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});
