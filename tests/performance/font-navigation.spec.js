'use strict';
const {expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {test,base,preview,previewOptions}=require('../support/transfer-measurement-target');
const {adminLogin,createStudent,studentLogin,fillLogin}=require('../login/helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
function observe(){
 const now=()=>performance.timeOrigin+performance.now(),buffers=new WeakMap(),readers=new WeakMap(),stats=window.fontReads=[];
 const native=window.fetch;
 window.fetch=async function(input,opts){
  const url=new URL(typeof input==='string'?input:input.url,location.href),start=now(),r=await native.apply(this,arguments);
  if(url.pathname.includes('/resources/')&&/\/(?:award-gothic-500|award-round)\.woff2$/.test(url.pathname)&&r.body){
   const item={font:url.pathname.split('/').at(-1),hash:url.pathname.split('/').at(-2),status:r.status,range:new Headers(opts?.headers).get('Range'),contentRange:r.headers.get('Content-Range'),start,bytes:0};stats.push(item);buffers.set(r.body,item);
  }return r;
 };
 const get=ReadableStream.prototype.getReader,read=ReadableStreamDefaultReader.prototype.read;
 ReadableStream.prototype.getReader=function(){const r=get.apply(this,arguments);if(buffers.has(this))readers.set(r,buffers.get(this));return r;};
 ReadableStreamDefaultReader.prototype.read=function(){const r=readers.get(this);if(!r)return read.apply(this,arguments);return read.apply(this,arguments).then(v=>{if(v.value)r.bytes+=v.value.byteLength;return v;});};
 document.addEventListener('submit',e=>{if(e.target.id==='loginForm')sessionStorage.setItem('bench-login',String(now()));},true);
 document.addEventListener('click',e=>{if(e.target.closest('a.journey-start')){
  sessionStorage.setItem('bench-click',String(now()));sessionStorage.setItem('bench-home-fonts',JSON.stringify(stats));
 }},true);
}
async function measureHandoff(device,trials,{page,browser,temporaryStudent},info){
 test.setTimeout(preview?780000:240000);let account=temporaryStudent;
 if(!preview){await adminLogin(page,base);account=await createStudent(page,'字体接续 '+device.id,'测速同学',[/^Lesson 1–2 /]);
  const setup=await studentLogin(browser,account,base);await setup.context.close();}
 const rows=[],errors=[];
 const output=trials.includes('checkpoint')?'checkpoint-handoff.json':'handoff.json';
 const save=()=>fs.writeFile(info.outputPath(output),JSON.stringify({site:preview?'preview.canranstudio.cn':'isolated loopback',device:device.name,viewport:device.viewport,engine:browser.version(),rows},null,2));
 for(const dwell of trials){
  const ctx=await browser.newContext({...contextOptions(device),...previewOptions});try{
   await ctx.addInitScript(observe);const p=await ctx.newPage(),session=await ctx.newCDPSession(p);
   const failedRequests=[],loaderWarnings=[];
   if(preview){
    p.on('console',message=>{if(message.type()==='warning'&&message.text().startsWith('Course preparation failed ['))loaderWarnings.push(message.text().split('\n')[0]);});
    p.on('requestfailed',request=>{
     const url=new URL(request.url());
     if(url.origin===new URL(base).origin)failedRequests.push({path:url.pathname,reason:request.failure()?.errorText});
    });
   }
   await session.send('Network.enable');await session.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1250000,uploadThroughput:1250000,connectionType:'cellular3g'});
   await p.goto(base,{waitUntil:'domcontentloaded'});await fillLogin(p,account);const start=p.locator('.journey-start');
   await expect(start).toBeVisible({timeout:40000});
   const homeReadyAt=Date.now();
   if(dwell==='checkpoint'){
    // Poll the resolved storage read. The predicate itself returns a Promise
    // even when no bytes have been written yet.
    const saved=()=>p.evaluate(async()=>{
     const font=window.fontReads.find(r=>r.font==='award-gothic-500.woff2'&&r.bytes>=524288&&r.bytes<4456656);
     if(!font||!window.CanranCourseCache)return 0;
     const disk=await CanranCourseCache.open('/').cache;
     const entry=await disk?.match('/font-preparation/'+font.hash);
     return Number(entry?.headers.get('Content-Length'))||0;
    });
    await expect.poll(saved,{timeout:120000,intervals:[50,100]}).toBeGreaterThanOrEqual(524288);
   }else if(dwell)await p.evaluate(ms=>new Promise(r=>setTimeout(r,ms)),dwell);
   const actualDwell=Date.now()-homeReadyAt;
   await start.click();
   const arrival=await p.waitForFunction(()=>{
    if(document.querySelector('.learning-surface .unit-word')?.getClientRects().length&&!document.querySelector('#courseLoader')&&document.fonts.status==='loaded')return 'ready';
    const detail=document.querySelector('#courseLoadingDetail')?.textContent.match(/L0[0-7]/);
    return detail?.[0];
   },null,{timeout:preview?180000:70000}).then(h=>h.jsonValue()).catch(()=> 'timed-out');
   if(arrival!=='ready'){
    const view=await p.evaluate(()=>({route:location.pathname+location.hash,fonts:document.fonts.status,status:document.querySelector('#courseLoadingStatus')?.textContent,progress:document.querySelector('#courseLoadingProgress')?.value,active:document.querySelector('.learning-surface')?.className,wordButtons:document.querySelectorAll('.learning-surface .unit-word').length}));
    await fs.writeFile(info.outputPath('arrival-'+dwell+'-failure.json'),JSON.stringify({arrival,view,failedRequests,loaderWarnings},null,2));
    if(preview&&typeof dwell==='number'){
     const time=await p.evaluate(()=>{
      const bytes=records=>records.filter(r=>r.font==='award-gothic-500.woff2').reduce((n,r)=>n+r.bytes,0);
      return {clickAt:Number(sessionStorage.getItem('bench-click')),now:performance.timeOrigin+performance.now(),homeBytes:bytes(JSON.parse(sessionStorage.getItem('bench-home-fonts')||'[]')),courseBytes:bytes(window.fontReads||[])};
     });
     rows.push({trigger:'fixed',dwellMs:dwell,arrival,courseOpened:false,homeBytes:time.homeBytes,courseBytes:time.courseBytes,observedAfterClickMs:Math.round(time.now-time.clickAt),warnings:loaderWarnings});
     errors.push(dwell);await save();console.log(device.id,dwell,'did not open',arrival,loaderWarnings);continue;
    }
    throw Error('Course did not reach the word page: '+JSON.stringify({arrival,view,loaderWarnings,failedRequests:failedRequests.slice(-4)}));
   }
   // Restore a fresh learner's initial word page even when reusing the same
   // test identity in another fresh browser; no answer or notebook is seeded.
   const prev=p.locator('.learning-surface .word-controls button').first();
   while(await prev.isEnabled())await prev.click();
   for(let i=0;i<8&&!p.url().endsWith('#learn/listen');i++)await p.locator('.learning-surface .word-controls button').last().click();
   const option=p.locator('.learning-surface .practice-content button:visible:enabled').first();await expect(option).toBeInViewport();
   const timing=await p.evaluate(()=>({loginAt:Number(sessionStorage.getItem('bench-login')),clickAt:Number(sessionStorage.getItem('bench-click')),readyAt:performance.timeOrigin+performance.now(),home:JSON.parse(sessionStorage.getItem('bench-home-fonts')),course:window.fontReads,viewport:[innerWidth,innerHeight]}));await option.click();
   expect(timing.viewport).toEqual([device.viewport.width,device.viewport.height]);expect(timing.loginAt).toBeGreaterThan(0);
   const full=4456656,large='award-gothic-500.woff2',home=timing.home.filter(r=>r.font===large),course=timing.course.filter(r=>r.font===large);
   const homeBytes=home.reduce((t,r)=>t+r.bytes,0),courseBytes=course.reduce((t,r)=>t+r.bytes,0);
   const row={dwellMs:dwell==='checkpoint'?actualDwell:dwell,trigger:dwell==='checkpoint'?'stored-prefix':'fixed',loginToQuestionMs:Math.round(timing.readyAt-timing.loginAt),clickToQuestionMs:Math.round(timing.readyAt-timing.clickAt),homeBytes,courseBytes,largeFontBytes:full,reusedBytes:full-courseBytes,repeatedBytes:Math.max(0,homeBytes+courseBytes-full),home:timing.home.map(({start,...r})=>r),course:timing.course.map(({start,...r})=>r)};
   rows.push(row);console.log(device.id,dwell,JSON.stringify([homeBytes,courseBytes,row.reusedBytes,row.loginToQuestionMs,row.clickToQuestionMs]));
   await save();
   if(process.env.FONT_HANDOFF_EXPECT_RESUME==='1'&&homeBytes>=512*1024&&homeBytes<full){expect(row.reusedBytes).toBeGreaterThanOrEqual(256*1024);expect(course.some(r=>r.status===206)).toBe(true);}
   if(dwell==='checkpoint'){
    expect(homeBytes).toBeLessThan(full);expect(row.reusedBytes).toBeGreaterThanOrEqual(524288);
    const suffix=course.find(r=>r.status===206);expect(suffix?.contentRange).toBe('bytes '+row.reusedBytes+'-'+(full-1)+'/'+full);
    const ok=await p.evaluate(async()=>{
     const index=await(await fetch('/course-index.json')).json();
     const font=index.sharedFonts.find(i=>i.key.endsWith('/award-gothic-500.woff2'));
     const bytes=await CanranCourseCache.open('/').cached(font);
     return bytes?.byteLength===font.bytes&&await CanranCourseCache.digest(bytes)===font.sha256;
    });
    expect(ok).toBe(true);
   }
  }finally{await ctx.close();}
 }
 expect(errors,'public visits which failed to open').toEqual([]);
}
for(const device of devices)test('measured directory font handoff '+device.name,async({page,browser,temporaryStudent},info)=>{
 await measureHandoff(device,[0,2000,5000],{page,browser,temporaryStudent},info);
});
if(preview&&process.env.FONT_HANDOFF_CHECKPOINT_TRIAL==='1')test('verified public font checkpoint on iPhone SE',async({page,browser,temporaryStudent},info)=>{
 await measureHandoff(devices[0],['checkpoint'],{page,browser,temporaryStudent},info);
});
