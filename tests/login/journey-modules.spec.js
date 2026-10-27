'use strict';
const {test,expect,devices}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,openCourseDirectory}=require('./helpers');
const {waitForModulesReady,inspectModules,assertModuleGeometry,assertStableModule}=require('../support/journey-modules');
const {mountLiveJourneyProps}=require('../support/journey-live-props');
const currentWorlds=require('../../course-journey/route-worlds').worlds;
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.use({...(process.env.JOURNEY_REVIEW_BROWSER==='webkit'?devices['iPhone 13']:{}),browserName:process.env.JOURNEY_REVIEW_BROWSER||'chromium',actionTimeout:10000});

const pilot=[
 {chapter:'opening',ids:['unit1-2','unit3-4','unit5-6']},
 {chapter:'neighborhood',ids:['unit7-8','unit9-10','unit11-12']},
 {chapter:'visits',ids:['unit13-14','unit15-16','unit17-18']},
 {chapter:'kindness',ids:['unit19-20','unit21-22','unit23-24']},
 {chapter:'home',ids:['unit25-26','unit27-28','unit29-30']},
 {chapter:'outdoors',ids:['unit31-32','unit33-34','unit35-36']},
 {chapter:'making',ids:['unit37-38','unit39-40','unit41-42']},
 {chapter:'hospitality',ids:['unit43-44','unit45-46','unit47-48']},
 {chapter:'departures',ids:['unit91-92','unit93-94','unit95-96']},
 {chapter:'woodland',ids:['unit139-140','unit141-142','unit143-144']}
];
const lessons=pilot.flatMap(c=>c.ids).map(id=>new RegExp('Lesson '+id.replace('unit','').replace('-','–')+' '));
const sizes=[[320,568],[390,844],[768,1024],[1440,1024]];
// Accepted alpha silhouettes, independent of the module's runtime placement.
// These identify the visible person/props rather than the PNG's empty gutter.
const bounds={
 'unit1-2':[.1013,.1188,.9147,.92504],
 'unit3-4':[.1505,.0998,.871,.95633],
 'unit5-6':[.1107,.1494,.9102,.9258],
 'unit7-8':[.106858,.074163,.933014,.974482],
 'unit9-10':[.187400,.193780,.830941,.850080],
 'unit11-12':[.172526,.086914,.853516,.927734],
 'unit13-14':[.089314,.124402,.927432,.917863],
 'unit15-16':[.146484,.102539,.904948,.926758],
 'unit17-18':[.093099,.078125,.923177,.959961],
 'unit19-20':[.063796,.059809,.975279,.965710],
 'unit21-22':[.098086,.097289,.952153,.952951],
 'unit23-24':[.082935,.093301,.959330,.951356],
 ...Object.fromEntries(Object.entries(require('../support/journey-home-hospitality-contact.json').characters).map(([id,c])=>[id,c.alpha16Bounds])),
 ...Object.fromEntries(Object.entries(require('../support/journey-remaining-contact.json').characters).map(([id,c])=>[id,c.alpha16Bounds]))
};
const results=who=>who.courses.map(c=>[c.id,c.stars,c.maxStars,c.firstFullStarAt,c.next]);
const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
const settle=p=>p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
test('章节切换先保留已解码画面，目标就绪后替换，取消后迟到图片不能覆盖当前章节',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'章节切换连续画面','切换旅人',lessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'}),p=student.page;
 const target='**/assets/course-journey/'+require('../../course-journey/route-worlds').worlds.neighborhood.file+'*';
 const gate=()=>{let release;const promise=new Promise(resolve=>{release=resolve;});return{release,promise};};
 let waiting=gate(),requests=0;
 try{
  await closeDirectory(p);await readyModules(p,pilot[0].ids);
  const before=await(await p.request.get(base+'api/me')).json();
  await p.evaluate(()=>{window.__switchChrome={header:document.querySelector('#siteHeader'),distant:document.querySelector('.journey-world-distant')};});
  // Delay the real terrain request. The previous implementation removed the
  // old chapter immediately and painted loading placeholders, even on revisits.
  await p.route(target,async route=>{const current=waiting;requests++;await current.promise;await route.continue();});
  await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');
  await expect.poll(()=>requests).toBeGreaterThan(0);
  await expect(p.locator('[data-route-world="opening"] [data-route-terrain]')).toBeVisible();
  await expect(p.locator('.journey-panorama-layer[data-staging=true]')).toHaveCSS('opacity','0');
  await expect(p.locator('.journey-panorama-layer:not([data-staging=true])')).toHaveAttribute('inert','');
  await expect(p.locator('.journey-switch-status')).toHaveText('正在打开 Lesson 7–12…');
  waiting.release();await readyModules(p,pilot[1].ids);
  expect(await p.evaluate(()=>window.__switchChrome.header===document.querySelector('#siteHeader')&&window.__switchChrome.distant===document.querySelector('.journey-world-distant'))).toBe(true);
  await expect(p.locator('.journey-panorama-layer')).toHaveCount(1);
  await expect(p.locator('.journey-panorama-layer')).not.toHaveAttribute('inert','');
  await p.unroute(target);
  // A reused image may be satisfied by the decoded-memory cache without a new
  // HTTP request. Hold its real decode completion for cached revisits; the
  // first switch above still verifies an actual delayed network response.
  await p.evaluate(file=>{
   const decode=HTMLImageElement.prototype.decode;window.__modulePending=[];window.__holdModuleDecode=false;
   HTMLImageElement.prototype.decode=function(){const result=decode.call(this);return this.src.includes(file)&&window.__holdModuleDecode?result.then(()=>new Promise(resolve=>window.__modulePending.push(resolve))):result;};
   window.__releaseModuleDecode=()=>{window.__holdModuleDecode=false;window.__modulePending.splice(0).forEach(resolve=>resolve());};
  },currentWorlds.neighborhood.file);
  // Return to the still-decoded garden before the stale decode finishes.
  await p.getByLabel('旅程地图范围',{exact:true}).selectOption('opening');await readyModules(p,pilot[0].ids);
  await p.evaluate(()=>{window.__holdModuleDecode=true;});
  await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');
  await expect.poll(()=>p.evaluate(()=>window.__modulePending.length)).toBeGreaterThan(0);
  await p.getByLabel('旅程地图范围',{exact:true}).selectOption('opening');
  await p.evaluate(()=>window.__releaseModuleDecode());await readyModules(p,pilot[0].ids);await settle(p);
  await expect(p.locator('.journey-map-scene')).toHaveAttribute('data-chapter','opening');
  await expect(p.locator('[data-module-course="unit7-8"]')).toHaveCount(0);
  // Directory location must wait for the prepared layer to become interactive;
  // attempting focus while it is inert silently loses the user's destination.
  await p.evaluate(()=>{window.__holdModuleDecode=true;});
  await p.locator('.journey-mobile-search').click();
  await p.getByLabel('查找 Lesson',{exact:true}).fill('12');
  await p.getByRole('button',{name:'地图定位：失物招领小侦探',exact:true}).click();
  await expect.poll(()=>p.evaluate(()=>window.__modulePending.length)).toBeGreaterThan(0);
  expect(await p.evaluate(()=>!!document.activeElement.closest('[inert]'))).toBe(false);
  await p.evaluate(()=>window.__releaseModuleDecode());await readyModules(p,pilot[1].ids);
  await expect(p.locator('[data-map-course="unit11-12"]')).toBeFocused();
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{waiting.release();await p.evaluate(()=>window.__releaseModuleDecode?.()).catch(()=>{});await p.unroute(target);await student.context.close();}
});

test('同一挂载重读授权时校正失效章节和范围，保留有效选择与查询，空课程后能恢复',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);
 // This authorization scenario deliberately owns the first two chapters and
 // one final course. Expanding the visual pilot must not silently grant139/141.
 const account=await createStudent(page,'连续地图动态授权','随课同学',[...lessons.slice(0,6),/Lesson 143–144 /]);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'}),p=student.page;
 let unmountRoutes,allowed=null,reads=0;
 const errors=[];p.on('pageerror',error=>errors.push(error.message));
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await p.route('**/api/me',async route=>{
   const response=await route.fetch(),who=await response.json();
   await route.fulfill({response,json:{...who,courses:allowed===null?who.courses:who.courses.filter(course=>allowed.includes(course.id))}});
  });
  unmountRoutes=await mountLiveJourneyProps(p,base);
  await expect(p.getByLabel('读取次数',{exact:true})).toHaveText('1');reads=1;
  await closeDirectory(p);
  await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');
  await readyModules(p,pilot[1].ids);
  await p.locator('[data-map-course="unit9-10"]').click();
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit9-10');
  await p.locator('.journey-all').click();
  await p.getByLabel('课程范围',{exact:true}).selectOption('7');
  await expect(p.locator('.journey-course:visible')).toHaveCount(1);
  await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit143-144');
  // Re-fetch the real read-only API without closing the modal: normal close
  // intentionally clears search/range, so it cannot test prop-refresh retention.
  const refresh=async()=>{await p.locator('.props-refresh').evaluate(button=>button.click());await expect(p.getByLabel('读取次数',{exact:true})).toHaveText(String(++reads));};
  // The previous selected chapter and range both disappear from authorization.
  allowed=['unit1-2','unit5-6'];
  await refresh();
  await expect(p.getByLabel('课程范围',{exact:true})).toHaveValue('all');
  await expect(p.locator('.journey-course:visible')).toHaveCount(2);
  await p.getByLabel('查找 Lesson',{exact:true}).fill('5');
  await refresh();
  await expect(p.getByLabel('查找 Lesson',{exact:true})).toHaveValue('5');
  await expect(p.locator('.journey-course:visible')).toHaveCount(1);
  await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit5-6');
  await closeDirectory(p);
  await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('opening');
  await expect(p.locator('.journey-map-scene')).toHaveAttribute('data-chapter','opening');
  await readyModules(p,allowed);
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit1-2');
  await expect(p.locator('[data-map-course="unit9-10"],[data-story-course="unit9-10"]')).toHaveCount(0);
  await expect(p.getByText('你的课程在目录里',{exact:true})).toHaveCount(0);
  await expect(p.locator('.journey-world-passage')).toHaveCount(1);
  await p.locator('.journey-all').click();
  await expect(p.getByLabel('课程范围',{exact:true})).toHaveValue('all');
  await expect(p.getByLabel('查找 Lesson',{exact:true})).toHaveValue('');
  await p.getByLabel('课程范围',{exact:true}).selectOption('0');
  await refresh();
  await expect(p.getByLabel('课程范围',{exact:true})).toHaveValue('0');
  await expect(p.locator('.journey-course:visible')).toHaveCount(2);
  await closeDirectory(p);
  // A fresh response object with still-valid choices must not jump back to the
  // first course simply because the courses array identity changed.
  await p.locator('[data-map-course="unit5-6"]').click();
  await p.getByRole('button',{name:'重新读取课程',exact:true}).click();
  await expect(p.getByLabel('读取次数',{exact:true})).toHaveText(String(++reads));
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit5-6');
  await expect(p.locator('[data-map-course="unit5-6"]')).toHaveAttribute('aria-pressed','true');
  await p.locator('.journey-all').click();
  await p.getByLabel('查找 Lesson',{exact:true}).fill('5');
  await refresh();
  await expect(p.getByLabel('课程范围',{exact:true})).toHaveValue('all');
  await expect(p.getByLabel('查找 Lesson',{exact:true})).toHaveValue('5');
  await expect(p.locator('.journey-course:visible')).toHaveCount(1);
  await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit','unit5-6');
  await closeDirectory(p);
  allowed=[];
  await p.getByRole('button',{name:'重新读取课程',exact:true}).click();
  await expect(p.getByLabel('读取次数',{exact:true})).toHaveText(String(++reads));
  await expect(p.getByRole('heading',{name:'老师还没开放课程',exact:true})).toBeVisible();
  await expect(p.locator('[data-module-course],[data-map-course],[data-route-terrain]')).toHaveCount(0);
  allowed=null;
  // This is the real empty-state action exposed by App, wired to the same
  // read-only refresh callback; no direct state injection or effect duplication.
  await p.getByRole('button',{name:'刷新课程',exact:true}).click();
  await expect(p.getByLabel('读取次数',{exact:true})).toHaveText(String(++reads));
  await readyModules(p,pilot[0].ids);
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit1-2');
  await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue('opening');
  expect(errors,'no maximum-depth loop or stale-course rendering error').toEqual([]);
  await p.unroute('**/api/me');
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{if(unmountRoutes)await unmountRoutes();await student.context.close();}
});
test('缺少中间授权时只保留静态路段，原始段号和页面控制不串到另一课',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'连续地形稀疏段','沿路同学',[/Lesson 1–2 /,/Lesson 5–6 /]);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await closeDirectory(p);await readyModules(p,['unit1-2','unit5-6']);
  await expect(p.locator('[data-module-course="unit3-4"],[data-map-course="unit3-4"],[data-story-course="unit3-4"],[data-stars-course="unit3-4"]')).toHaveCount(0);
  expect((await p.request.get(base+'unit3-4/')).status()).toBe(403);
  await expect(p.locator('.journey-world-passage')).toHaveCount(1);
  await expect(p.locator('.journey-world-passage')).toHaveAttribute('aria-hidden','true');
  await expect(p.locator('.journey-world-passage')).toHaveText('');
  await expect(p.locator('.journey-world-passage button,.journey-world-passage a,.journey-world-passage [tabindex]')).toHaveCount(0);
  const view=await geometry(p);checkGeometry(view);
  expect(view.modules.map(m=>m.index),'do not reindex the last authorized figure onto the hidden middle courtyard').toEqual([0,2]);
  await p.locator('[data-map-course="unit5-6"]').click();
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit5-6');
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});

test('新满星遇到章节共享地形失败时保留待庆祝，重试可见后只播放一次且不改成果',async({page,browser})=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'首次庆祝图片恢复','小星光',lessons.slice(0,3));
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'no-preference'}),p=student.page;
 const target='unit3-4',missing='**/assets/course-journey/'+currentWorlds.opening.file+'*';
 try{
  const before=await(await p.request.get(base+'api/me')).json(),awardsBefore=await(await p.request.get(base+'api/awards')).json();
  await closeDirectory(p);await readyModules(p,pilot[0].ids);
  // Observe genuine animation calls from before React mounts. This does not
  // synthesize animation or completion; the original browser method is retained.
  await p.addInitScript(()=>{
   window.__moduleFirstCelebrations=[];
   const native=Element.prototype.animate;
   Element.prototype.animate=function(...args){
    if(this.classList.contains('journey-story-sheen')){
     const article=this.closest('[data-module-course]');
     if(article)window.__moduleFirstCelebrations.push({id:article.dataset.moduleCourse,state:article.dataset.artState});
    }
    return native.apply(this,args);
   };
  });
  await p.route('**/api/me',async route=>{
   const response=await route.fetch(),who=await response.json();
   await route.fulfill({response,json:{...who,courses:who.courses.map(c=>c.id===target?{...c,stars:5}:c)}});
  });
  await p.route(missing,route=>route.abort());
  await p.reload();
  const article=p.locator('[data-module-course="'+target+'"]');
  await expect(article).toHaveAttribute('data-art-state','error');
  // One authoritative terrain is shared by the chapter. Its failure hides all
  // three figures, but leaves each actual Lesson and reward control usable.
  for(const id of ['unit1-2','unit5-6'])await expect(p.locator('[data-module-course="'+id+'"]')).toHaveAttribute('data-art-state','error');
  await settle(p);
  expect(await p.evaluate(id=>window.__moduleFirstCelebrations.filter(event=>event.id===id),target),'failed scene must not consume its first celebration').toEqual([]);
  await expect(article.locator('[data-completion-medal]')).toBeVisible();
  await expect(article.locator('[data-map-course]')).toBeVisible();
  await p.unroute(missing);
  await p.getByRole('button',{name:'重新加载 Lesson 3–4 场景',exact:true}).click();
  await expect(article).toHaveAttribute('data-art-state','ready');
  await expect.poll(()=>p.evaluate(id=>window.__moduleFirstCelebrations.filter(event=>event.id===id),target)).toEqual([{id:target,state:'ready'}]);
  const sheen=article.locator('.journey-story-sheen');
  await expect.poll(()=>sheen.evaluate(el=>el.getAnimations().length)).toBe(0);
  await article.locator('[data-map-course]').click();
  await settle(p);
  expect(await p.evaluate(id=>window.__moduleFirstCelebrations.filter(event=>event.id===id),target)).toEqual([{id:target,state:'ready'}]);
  await p.unroute('**/api/me');
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
  expect(await(await p.request.get(base+'api/awards')).json()).toEqual(awardsBefore);
 }finally{await student.context.close();}
});


async function closeDirectory(p){
 const mobile=p.getByRole('button',{name:'关闭课程目录',exact:true});
 if(await mobile.isVisible())await mobile.click();
 else if(await p.locator('.journey-directory-desktop:visible').count())await p.locator('.journey-all').click();
}
async function readyModules(p,ids){
 await waitForModulesReady(p,ids);
 await expect(p.locator('[data-module-course]')).toHaveCount(ids.length);
 for(const id of ids){
  const group=p.locator('[data-module-course="'+id+'"]');
  await expect(group).toHaveCount(1);
  await expect(group.locator('[data-module-ground="'+id+'"]')).toBeVisible();
  await expect(group.locator('[data-story-course="'+id+'"]')).toBeVisible();
  await expect.poll(()=>group.locator('[data-module-ground],[data-story-course]').evaluateAll(images=>images.length===2&&images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
 }
 await settle(p);
}
async function geometry(p){return inspectModules(p,bounds);}
function checkGeometry(view){assertModuleGeometry(view,view.modules.map(m=>m.id),view.width);}
function compareLocal(before,after,label){assertStableModule(before,after,label);}

test('代表章节完整场景在手机优先尺寸和两种动效模式下保持局部关系、同轴奖励与自然页面滚动 @journey-layout',async({page,browser})=>{
 test.setTimeout(180000);
 await adminLogin(page,base);
 const account=await createStudent(page,'独立模块布局','模块旅人',lessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await closeDirectory(p);
  for(const chapter of pilot){
   await p.getByLabel('旅程地图范围',{exact:true}).selectOption(chapter.chapter);
   await readyModules(p,chapter.ids);
   await p.emulateMedia({reducedMotion:'reduce'});await settle(p);
   const reference=await geometry(p);checkGeometry(reference);
   for(const reducedMotion of ['reduce','no-preference']){
    await p.emulateMedia({reducedMotion});
    for(const [width,height]of sizes){
     await p.setViewportSize({width,height});await settle(p);
     await expect(async()=>{
      const view=await geometry(p);checkGeometry(view);
      for(const item of view.modules)compareLocal(reference.modules.find(m=>m.id===item.id),item,item.id+' '+width+' '+reducedMotion);
     }).toPass({timeout:5000});
     // Clicking the middle figure is a real pointer action, not a React state
     // injection. Ground and character are allowed to move as a whole; local
     // layout after the response must remain the same and selection is shared.
     const middle=chapter.ids[1],hit=p.locator('[data-landmark-select="'+middle+'"]');
     await hit.scrollIntoViewIfNeeded();
     const localBefore=(await geometry(p)).modules.find(m=>m.id===middle);
     await hit.evaluate(el=>{
      el.__moduleMotionSeen=false;
      el.addEventListener('click',()=>{
       const start=performance.now(),motion=el.querySelector('.journey-story-motion');
       const sample=()=>{
        const value=getComputedStyle(motion).transform;
        if(value!=='none'&&value!=='matrix(1, 0, 0, 1, 0, 0)')el.__moduleMotionSeen=true;
        if(performance.now()-start<800)requestAnimationFrame(sample);
       };
       requestAnimationFrame(sample);
      },{once:true,capture:true});
     });
     await hit.click();
     await expect(p.locator('[data-map-course="'+middle+'"]')).toHaveAttribute('aria-pressed','true');
     await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',middle);
     if(reducedMotion==='no-preference')await expect.poll(()=>hit.evaluate(el=>el.__moduleMotionSeen)).toBe(true);
     await expect.poll(()=>hit.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBe(0);
     compareLocal(localBefore,(await geometry(p)).modules.find(m=>m.id===middle),middle+' selected');
     if(reducedMotion==='reduce'){
      expect(await hit.locator('.journey-story-motion').evaluate(el=>el.getAnimations().length)).toBe(0);
      expect(await hit.evaluate(el=>el.__moduleMotionSeen)).toBe(false);
     }
    }
   }
   // At 320px all modules must remain readable by normal document scrolling.
   // Wheel over the scene itself to catch touch-action/overflow regressions.
   await p.setViewportSize({width:320,height:568});await settle(p);
   await p.locator('[data-module-stage="'+chapter.ids[0]+'"]').scrollIntoViewIfNeeded();
   const start=await p.evaluate(()=>({y:scrollY,max:document.documentElement.scrollHeight-innerHeight}));
   expect(start.max-start.y,'phone scene has useful document scroll range').toBeGreaterThan(50);
   await p.locator('[data-module-stage="'+chapter.ids[0]+'"]').hover();
   await p.mouse.wheel(0,240);
   await expect.poll(()=>p.evaluate(()=>scrollY)).toBeGreaterThan(start.y+20);
   // Selecting the last course can wrap its longer dock title. The new dock
   // height must reserve scroll space immediately, including Lesson 47–48.
   await p.locator('[data-map-course="'+chapter.ids.at(-1)+'"]').click();
   await p.mouse.wheel(0,10000);
   await expect(async()=>{
    const view=await p.evaluate(id=>{
     const plate=document.querySelector('[data-map-course="'+id+'"]').getBoundingClientRect();
     const blockers=[...document.querySelectorAll('.journey-dock,.journey-bottom-nav')].filter(el=>getComputedStyle(el).position==='fixed').map(el=>el.getBoundingClientRect().top);
     return {bottom:plate.bottom,top:plate.top,safeBottom:Math.min(innerHeight,...blockers)};
    },chapter.ids.at(-1));
    expect(view.bottom,'last Lesson has at least 15px clearance above the selected-course dock').toBeLessThanOrEqual(view.safeBottom-15);
    expect(view.top,'last Lesson is visible').toBeGreaterThanOrEqual(0);
   }).toPass({timeout:5000});
  }
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});

test('模块零星部分星满星均来自课程数据，重看只改变反馈，星章不会改变场景锚点',async({page,browser})=>{
 test.setTimeout(120000);await adminLogin(page,base);
 const account=await createStudent(page,'独立模块成果','星章旅人',lessons);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  const awardsBefore=await(await p.request.get(base+'api/awards')).json();
  await closeDirectory(p);
  let stars=0;
  // Presentation-only fixtures: fetch real authorized API response and change
  // only its displayed star count. Never write a learning/award endpoint.
  await p.route('**/api/me',async route=>{
   const response=await route.fetch(),who=await response.json();
   await route.fulfill({response,json:{...who,courses:who.courses.map(c=>({...c,stars}))}});
  });
  const reference=new Map();
  for(stars of [0,2,5]){
   await p.reload();
   for(const chapter of pilot){
    await p.getByLabel('旅程地图范围',{exact:true}).selectOption(chapter.chapter);await readyModules(p,chapter.ids);
    const view=await geometry(p);checkGeometry(view);
    for(const id of chapter.ids){
     const module=p.locator('[data-module-course="'+id+'"]'),row=module.locator('[data-stars-course="'+id+'"]');
     await expect(row.locator('.journey-star[data-earned="true"]')).toHaveCount(stars);
     await expect(row.locator('.journey-star[data-earned="false"]')).toHaveCount(5-stars);
     await expect(module.locator('[data-completion-medal="'+id+'"]')).toHaveCount(stars===5?1:0);
     const local=view.modules.find(m=>m.id===id);
     if(stars===0)reference.set(id,local);else compareLocal(reference.get(id),local,id+' '+stars+' stars');
     if(stars===5){
      const medal=module.locator('[data-completion-medal="'+id+'"]');
      await expect(medal).toHaveAccessibleName(new RegExp('重看 Lesson '));
      await medal.click();
      await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
      await expect(module.locator('[data-map-course="'+id+'"]')).toHaveAttribute('aria-pressed','true');
      expect(await module.locator('.journey-medal-face').evaluate(el=>el.getAnimations().length)).toBe(0);
      compareLocal(local,(await geometry(p)).modules.find(m=>m.id===id),id+' replay');
     }
    }
   }
  }
  await p.unroute('**/api/me');
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
  expect(await(await p.request.get(base+'api/awards')).json()).toEqual(awardsBefore);
 }finally{await student.context.close();}
});

test('稀疏授权只渲染本班入口，共享地形和单课人物故障按各自范围恢复，Lesson12与144可定位进入',async({page,browser})=>{
 test.setTimeout(120000);await adminLogin(page,base);
 const account=await createStudent(page,'独立模块权限恢复','小向导',[/Lesson 9–10 /,/Lesson 11–12 /,/Lesson 143–144 /]);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'}),p=student.page;
 try{
  const before=await(await p.request.get(base+'api/me')).json();
  await expect(p.locator('.journey-course')).toHaveCount(3);
  await closeDirectory(p);await readyModules(p,['unit9-10','unit11-12']);
  await expect(p.locator('[data-module-course="unit7-8"],[data-map-course="unit7-8"]')).toHaveCount(0);
  expect((await p.request.get(base+'unit7-8/')).status()).toBe(403);
  // Exercise ground and figure failures separately so one success cannot mask
  // the other. Lesson selection and the real course link remain available.
  for(const {missing,shared} of [{missing:'**/assets/course-journey/'+currentWorlds.neighborhood.file+'*',shared:true},{missing:'**/assets/course-journey/shirt-return-v1.webp*',shared:false}]){
   let intercepted=0;await p.route(missing,route=>{intercepted++;return route.abort();});
   const failed=p.locator('[data-module-course="unit11-12"]');
   await p.reload();await expect(failed).toHaveAttribute('data-art-state','error');
   await expect(failed.getByRole('status')).toContainText('场景暂时没准备好');
   await expect(failed.locator('[data-landmark-select]')).toBeHidden();
   await expect(failed.locator('[data-map-course]')).toBeVisible();
   await expect(failed.locator('[data-stars-course]')).toBeVisible();
   await expect(p.locator('[data-module-course="unit9-10"]')).toHaveAttribute('data-art-state',shared?'error':'ready');
   expect(intercepted).toBeGreaterThan(0);
   await expect(p.locator('[data-module-course]')).toHaveCount(2);
   await p.locator('[data-map-course="unit11-12"]').click();
   await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit11-12');
   await expect(p.locator('.journey-start')).toHaveAttribute('href',base+'unit11-12/#learn/words');
   // A failure in the pilot must not leak into another chapter.
   await p.getByLabel('旅程地图范围',{exact:true}).selectOption('woodland');
   await expect(p.locator('.journey-module-status')).toHaveCount(0);
   await expect(p.locator('[data-map-course]')).toHaveCount(1);
   await expect(p.locator('[data-map-course]')).toHaveAttribute('data-map-course','unit143-144');
   await p.getByLabel('旅程地图范围',{exact:true}).selectOption('neighborhood');
   await expect(failed).toHaveAttribute('data-art-state','error');
   await expect(failed.getByRole('status')).toContainText('场景暂时没准备好');
   await p.unroute(missing);
   await p.getByRole('button',{name:'重新加载 Lesson 11–12 场景',exact:true}).click();
   await expect(failed).toHaveAttribute('data-art-state','ready');
   await expect(failed.getByRole('status')).toHaveCount(0);
   await readyModules(p,['unit9-10','unit11-12']);
  }
  for(const [query,id,chapter]of [['Lesson 12','unit11-12','neighborhood'],['Lesson 144','unit143-144','woodland']]){
   await openCourseDirectory(p);await p.getByLabel('查找 Lesson',{exact:true}).fill(query);
   await expect(p.locator('.journey-course:visible')).toHaveCount(1);
   await expect(p.locator('.journey-course:visible')).toHaveAttribute('data-unit',id);
   await p.locator('.journey-course:visible .journey-locate').click();
   await expect(p.getByLabel('旅程地图范围',{exact:true})).toHaveValue(chapter);
   await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
   await expect(p.locator('[data-map-course="'+id+'"]')).toHaveAttribute('aria-pressed','true');
   await p.locator('.journey-start').click();
   await expect(p).toHaveURL(new RegExp(id+'/#learn/words$'));
   await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
   await p.getByRole('link',{name:'我的课程',exact:true}).click();
   await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course',id);
  }
  await p.reload();
  await expect(p.locator('.journey-dock')).toHaveAttribute('data-selected-course','unit143-144');
  expect(results(await(await p.request.get(base+'api/me')).json())).toEqual(results(before));
 }finally{await student.context.close();}
});
