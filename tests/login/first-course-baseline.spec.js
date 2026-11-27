'use strict';
const {studentDocument}=require('../support/student-document');

const {test:baseTest,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin,fillLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const network=require('../support/first-course-network');
const previewAccounts=process.env.FIRST_COURSE_PREVIEW_ACCOUNTS,previewAdmin=process.env.FIRST_COURSE_PREVIEW_ADMIN_FILE,preview=Boolean(previewAccounts||previewAdmin);
const {provision,origin}=require('../support/first-course-preview-student'),base=preview?origin+'/':process.env.AWARD_TEST_BASE||'/lesson/';
const test=baseTest.extend({temporaryStudent:async({},use)=>{
 const owner=previewAdmin?await provision(previewAdmin,process.env.FIRST_COURSE_PREVIEW_PROXY):null;
 try{await use(owner?.account);}finally{await owner?.close();}
}});
test.use({trace:'off',screenshot:'off',video:'off'});
// A real student portal on the isolated account server. Collect evidence for
// cold, directory-warmed, and revisited courses separately, never pooled.
for(const device of devices)test('first course baseline '+device.name,async({page,browser,temporaryStudent},info)=>{
 test.setTimeout(300000);let account;
 if(temporaryStudent)account=temporaryStudent;
 else if(previewAccounts)account=JSON.parse(await fs.readFile(previewAccounts,'utf8'))[device.id];
 else{
  await adminLogin(page,base);account=await createStudent(page,'首课测量 '+device.id,'首课同学',[/^Lesson 1–2 /]);
  const setup=await studentLogin(browser,account,base);await setup.context.close();
 }
 const report=[],waterfalls=[];
 for(const prepared of [false,true]){
  const proxy=preview&&process.env.FIRST_COURSE_PREVIEW_PROXY;
  const ctx=await browser.newContext({...contextOptions(device),...(proxy?{proxy:{server:proxy}}:{})});
  try{
   const p=await ctx.newPage(),cdp=await ctx.newCDPSession(p);
   const snapshot=network.attach(cdp);
   await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1250000,uploadThroughput:1250000,connectionType:'cellular3g'});
   await p.addInitScript(()=>{
    performance.setResourceTimingBufferSize(3000);
    const now=()=>performance.timeOrigin+performance.now(),key='first-course-click';
    document.addEventListener('click',e=>{if(e.target.closest('a.journey-start'))sessionStorage.setItem(key,String(now()));},true);
    if(!location.pathname.endsWith('/unit1-2/'))return;
    const t=Number(sessionStorage.getItem(key));if(!t)return;
    const data=window.firstCourseMeasurement={};const decodes=[];
    const native=HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode=async function(){const from=now();try{return await native.call(this);}finally{decodes.push([from,now()]);}};
    const tick=()=>{
     if(!window.CanranStudentHandoff?.preparing&&!document.querySelector('#courseLoader')&&document.fonts.status==='loaded'){
      const visible=sel=>[...document.querySelectorAll(sel)].some(x=>!x.disabled&&x.getClientRects().length&&getComputedStyle(x).visibility!=='hidden');
      if(!data.wordsMs&&visible('.learning-surface .unit-word')){
       data.wordsMs=Math.round(now()-t);data.decodes=decodes.length;
       let end=0,union=0;for(const [lo,hi]of decodes.sort((a,b)=>a[0]-b[0])){union+=Math.max(0,hi-Math.max(end,lo));end=Math.max(end,hi);}data.decodeActiveMs=Math.round(union);
      }
      if(visible('.learning-surface .practice-content button:not(:disabled)')){data.questionMs=Math.round(now()-t);return;}
     }
     requestAnimationFrame(tick);
    };requestAnimationFrame(tick);
   });
   await p.goto(base,{waitUntil:'domcontentloaded'});await fillLogin(p,account);
   for(const kind of (prepared?['directory-ready','revisit']:['fresh-login'])){
    if(kind==='revisit')await p.goto(base,{waitUntil:'domcontentloaded'});
    if(!preview)await page.request.post('/__test__/first-course-network');
    const start=p.locator('.journey-start');await expect(start).toBeVisible({timeout:40000});
    if(kind==='directory-ready')await p.waitForFunction(()=>Number(document.documentElement.dataset.sharedFontsReady)>0,null,{timeout:60000});
    const fontsAtClick=await p.evaluate(()=>Number(document.documentElement.dataset.sharedFontsReady)||0);
    await start.click();const course=await studentDocument(p,/unit1-2\/#learn\/words$/,70000);await course.waitForFunction(()=>window.firstCourseMeasurement?.wordsMs,null,{timeout:70000});
    let steps=0;const next=course.locator('.learning-surface .word-controls button').last();
    while(!p.url().endsWith('#learn/listen')&&steps<8){await next.click();steps++;}
    await course.waitForFunction(()=>window.firstCourseMeasurement?.questionMs,null,{timeout:20000});
    const first=course.locator('.learning-surface .practice-content button:visible:enabled').first();await first.click();
    const {from,data}=await course.evaluate(()=>({from:Number(sessionStorage.getItem('first-course-click')),data:window.firstCourseMeasurement}));
    const expected=await course.evaluate(async()=>{const pack=await CanranCourseCache.open(location.pathname.replace(/unit1-2\/$/,'')).current('unit1-2');
     return Object.fromEntries(pack.required.flatMap(i=>[i,...(i.svgParts||[]).filter(p=>typeof p!=='string')]).map(i=>[i.url.replace(/^\/lesson\//,'/'),i.bytes]));});
    const timing=await course.evaluate(()=>performance.getEntriesByType('resource').filter(e=>e.name.includes('/resources/')).map(e=>({path:new URL(e.name).pathname.replace(/^\/lesson\//,'/'),at:performance.timeOrigin+e.startTime,encoded:e.encodedBodySize,decoded:e.decodedBodySize})));
    const trace=await snapshot(ctx,from,data.questionMs,expected,timing);
    if(!preview){
     const log=await(await page.request.get('/__test__/first-course-network')).json(),served=log.filter(r=>r.start>=from-2&&r.end<=from+data.questionMs+2&&(r.status===200||r.status===206));
     trace.summary.originObjectBodyBytes=served.reduce((n,r)=>n+r.bytes,0);trace.summary.originObjects=served.length;
     trace.summary.originRequiredBodyBytes=served.filter(r=>Object.hasOwn(expected,r.path.replace(/^\/lesson\//,'/'))).reduce((n,r)=>n+r.bytes,0);
     const counts=new Map();
     for(const r of trace.rows.filter(r=>r.kind==='object'&&!r.worker&&!r.httpCache&&(r.status===200||r.status===206))){
      const key=r.path+' '+r.bodyBytes;counts.set(key,(counts.get(key)||0)+1);
     }
     trace.originExtra=[];for(const r of served){const path=r.path.replace(/^\/lesson\//,'/'),key=path+' '+r.bytes;
      if(counts.get(key)>0)counts.set(key,counts.get(key)-1);
      else trace.originExtra.push({path,bytes:r.bytes,at:Math.round(r.start-from),done:Math.round(r.end-from)});
     }
     const missing=[...counts].filter(([,n])=>n>0);if(missing.length||trace.originExtra.length)await fs.writeFile(info.outputPath('boundary-'+kind+'.json'),JSON.stringify({missing,originExtra:trace.originExtra,startedBeforeClick:trace.startedBeforeClick},null,2));
     expect(missing,'successful course fetch must have an independent server receipt').toEqual([]);
     expect(trace.summary.objectBodyBytes).toBe(trace.summary.originRequiredBodyBytes);
    }
    waterfalls.push({kind,...trace});
    report.push({kind,fontsAtClick,wordPageTaps:steps,...data,network:trace.summary});
   }
  }finally{await ctx.close();}
 }
 const result={site:preview?'preview.canranstudio.cn':'isolated loopback',device:device.name,viewport:device.viewport,engine:browser.version(),network:'Chromium page CDP 10 Mbps / 150 ms; worker traffic is not independently shaped',samples:report};
 console.log('First course: '+JSON.stringify(report.map(s=>[device.id,s.kind,s.questionMs,s.network.objects,s.network.objectBodyBytes])));await fs.writeFile(info.outputPath('first-course.json'),JSON.stringify(result,null,2));
 await fs.writeFile(info.outputPath('first-course-network.json'),JSON.stringify(waterfalls,null,2));
});
