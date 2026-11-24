'use strict';
const {expect}=require('@playwright/test'),fs=require('node:fs/promises'),{createHash}=require('node:crypto');
const {test,base,preview,previewOptions}=require('../support/transfer-measurement-target');
const {adminLogin,createStudent,studentLogin}=require('../login/helpers'),{devices,contextOptions}=require('../support/required-phone-devices'),{courseReadyForAssertions}=require('../support/completion-layout');
const network=require('../support/first-course-network');
for(const device of devices)test('cold artwork payload '+device.name,async({page,browser,temporaryStudent},info)=>{
 test.setTimeout(preview?420000:150000);let setup;
 if(preview){const context=await browser.newContext(previewOptions);setup={context,page:await context.newPage()};}
 else{await adminLogin(page);const account=await createStudent(page,'插画冷下载 '+device.id,'试读同学',[/^Lesson 45–46 /,/^Lesson 47–48 /]);setup=await studentLogin(browser,account,base);}
 let cookies,index;try{
  if(preview){
   // The cold-artwork sample starts with only a valid student session. The
   // separate font benchmark exercises the actual login form and directory.
   const signed=await setup.page.request.post(base+'api/login',{headers:{Origin:new URL(base).origin},data:{studentNumber:temporaryStudent.number,password:temporaryStudent.password},maxRedirects:0});
   expect(signed.status()).toBe(200);expect((await signed.json()).mustChangePassword).toBeFalsy();
  }
  cookies=await setup.context.cookies();index=await(await setup.page.request.get(base+'course-index.json')).json();
 }finally{await setup.context.close();}
 if(preview&&process.env.ART_FONT_EXPECTED_PUBLICATION){
  const frozen=JSON.parse(await fs.readFile(process.env.ART_FONT_EXPECTED_PUBLICATION,'utf8'));
  for(const id of ['unit45-46','unit47-48'])expect(index.courses[id]).toEqual(frozen.courses[id]);
 }
 const rows=[];
 for(const id of ['unit45-46','unit47-48']){
  const ctx=await browser.newContext({...contextOptions(device),...previewOptions});try{
   await ctx.addCookies(cookies);const p=await ctx.newPage(),manifestResponse=await p.request.get(index.courses[id].manifest),manifest=await manifestResponse.body(),m=JSON.parse(manifest);
   const expected=new Map(m.required.flatMap(i=>i.svgParts?i.svgParts.filter(v=>typeof v!=='string'):[i]).map(i=>[i.sha256,i.bytes]));
   expect(createHash('sha256').update(manifest).digest('hex')).toBe(index.courses[id].sha256);
   let snapshot;const warnings=[];
   if(preview){
    p.on('console',message=>{if(message.type()==='warning'&&message.text().startsWith('Course preparation failed ['))warnings.push(message.text().split('\n')[0]);});
    await ctx.addInitScript(()=>performance.setResourceTimingBufferSize(3000));const cdp=await ctx.newCDPSession(p);snapshot=network.attach(cdp);await cdp.send('Network.enable');
   }
   else await page.request.post('/__test__/first-course-network');
   const started=Date.now();await p.goto(base+id+'/#cover',{waitUntil:'domcontentloaded'});
   const arrivalErrors=[];
   if(preview){
    const waitForArrival=async()=>{
     await p.waitForFunction(()=>!document.querySelector('#courseLoader')||/L0[0-7]/.test(document.querySelector('#courseLoadingDetail')?.textContent||''),null,{timeout:180000});
     return await p.locator('#courseLoader').count()?(await p.locator('#courseLoadingDetail').textContent()).match(/L0[0-7]/)?.[0]:null;
    };
    let code=await waitForArrival();
    if(code==='L01'){
     arrivalErrors.push(code);
     const workers=await Promise.all(ctx.serviceWorkers().map(w=>w.evaluate(()=>performance.getEntriesByType('resource').filter(e=>new URL(e.name).pathname.endsWith('/permit')).map(e=>({ms:Math.round(e.duration),status:e.responseStatus}))).catch(()=>[])));
     await fs.writeFile(info.outputPath(id+'-first-arrival.json'),JSON.stringify({code,warnings,permitResponses:workers.flat()},null,2));
     await p.locator('#courseLoadingRetry').click();
     code=await waitForArrival();
    }
    if(code)throw Error(id+' '+JSON.stringify(warnings)+' '+code);
    await expect(p.locator('html')).not.toHaveAttribute('data-course-painting','');
   }
   else await courseReadyForAssertions(p);
   await expect(p.locator('#cover img[src*="cover-scene"]')).toBeInViewport();
   let log,wire={};if(preview){
    const known=Object.fromEntries(m.required.flatMap(i=>[i,...(i.svgParts||[]).filter(v=>typeof v!=='string')]).map(i=>[i.url,i.bytes]));
    const timing=await p.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('/resources/')).map(r=>({path:new URL(r.name).pathname,at:performance.timeOrigin+r.startTime,decoded:r.decodedBodySize,encoded:r.encodedBodySize})));
    const trace=await snapshot(ctx,started,Date.now()-started,known,timing);
    wire={encodedRequiredBodyBytes:trace.summary.encodedObjectBodyBytes,transferBytesIncludingHeaders:trace.summary.objectTransferBytes};
    log=trace.rows.filter(r=>r.kind==='object'&&!r.worker&&!r.httpCache).map(r=>({path:r.path,status:r.status,bytes:r.bodyBytes}));
    await fs.writeFile(info.outputPath(id+'-network.json'),JSON.stringify({summary:trace.summary,objects:log},null,2));
    expect(trace.summary.workerObjectFetches).toEqual([]); // inspect explicitly if a worker, rather than the page, does a network repair
   }else log=await(await page.request.get('/__test__/first-course-network')).json();
   const got=new Map();
   const audio=new Set(m.audio.map(i=>i.sha256));
   for(const r of log){const hash=r.path.match(/\/resources\/([a-f0-9]{64})\//)?.[1];if(audio.has(hash))continue;expect(expected.has(hash),r.path).toBe(true);expect(r.status).toBe(200);expect(r.bytes).toBe(expected.get(hash));expect(got.has(hash),r.path+' duplicate transfer').toBe(false);got.set(hash,r.bytes);}
   expect(got.size).toBe(expected.size);
   const images=m.required.filter(i=>i.svgParts),layers=new Set(images.flatMap(i=>i.svgParts.filter(v=>typeof v!=='string').map(v=>v.sha256)));
   let originalImagesChecked=0;
   if(preview&&images.length){
    const checked=await p.evaluate(async({id,images})=>{const store=CanranCourseCache.open('/'),active=await store.current(id),bad=[];
     for(const i of images){const bytes=await store.cached(i);if(!bytes||await CanranCourseCache.digest(bytes)!==i.sha256){bad.push(i.key);continue;}
      const img=new Image();img.src=i.key;await img.decode();if(!img.naturalWidth)bad.push(i.key);}
     return {active:active.revision,bad,width:innerWidth,height:innerHeight};},{id,images});
    expect(checked).toEqual({active:m.revision,bad:[],width:device.viewport.width,height:device.viewport.height});originalImagesChecked=images.length;
    await p.locator('#startBtn').click();const word=p.locator('.learning-surface .unit-word').first();await word.tap();await expect(word.locator('.word-meaning')).toBeVisible();
    await p.getByRole('link',{name:'故事',exact:true}).tap();const story=p.locator('.learning-surface.stage-text');
    await story.locator('.stage-ctrl>.btn-green').tap();await story.getByRole('button',{name:'看中文',exact:true}).first().tap();await expect(story.locator('.bcn').first()).toBeVisible();
   }
   rows.push({unit:id,revision:m.revision,requests:got.size,requiredBodyBytes:[...got.values()].reduce((n,x)=>n+x,0),manifestBytes:manifest.length,layerRequests:[...got.keys()].filter(h=>layers.has(h)).length,originalImagesChecked,arrivalErrors,...wire});
   console.log(device.id,id,got.size,rows.at(-1).requiredBodyBytes);
   await fs.writeFile(info.outputPath('art-transfer.json'),JSON.stringify({site:preview?'preview.canranstudio.cn':'isolated loopback',device:device.name,viewport:device.viewport,rows},null,2));
  }finally{await ctx.close();}
 }
});
