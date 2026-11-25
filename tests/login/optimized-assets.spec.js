'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises'),path=require('node:path');
const {adminLogin,createStudent,studentLogin,fillLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices'),{courseReadyForAssertions}=require('../support/completion-layout');
const {choose}=require('../support/answer-question'),{definition}=require('../../server/progress');
const {handleRewardDialog,finishRewardPresentation}=require('../support/reward-dialog');
const {courseResponse}=require('../support/course-response-faults'),base=process.env.AWARD_TEST_BASE||'/lesson/';
for(const device of devices)test(device.name+' reconstructs the original 45–48 cover, poses, words and results',async({page,browser},info)=>{
 test.setTimeout(240000);await adminLogin(page,base);
 const account=await createStudent(page,'原图传输 '+device.id,'核对同学',[/^Lesson 45–46 /,/^Lesson 47–48 /]);
 const {context,page:p}=await studentLogin(browser,account,base,contextOptions(device)),report=[];
 try{
  await handleRewardDialog(p,false);
  for(const id of ['unit45-46','unit47-48']){
   const index=await(await p.request.get(base+'course-index.json')).json(),pack=await(await p.request.get(index.courses[id].manifest)).json(),items=pack.required.filter(i=>i.svgParts);
   expect(items.length).toBe(id==='unit45-46'?15:2);
   await page.request.post('/__test__/first-course-network');await p.goto(base+id+'/#cover');await courseReadyForAssertions(p);
   const cover=p.locator('#cover img[src*="cover-scene"]');await expect(cover).toBeVisible();
   const wire=await(await page.request.get('/__test__/first-course-network')).json();
   const layers=new Map(items.flatMap(i=>i.svgParts).filter(x=>typeof x!=='string').map(i=>[i.url,i]));
   const payloads=wire.filter(r=>layers.has(r.path)&&r.status===200);expect(payloads.length).toBe(layers.size);expect(new Set(payloads.map(r=>r.path)).size).toBe(layers.size);
   for(const row of payloads)expect(row.bytes).toBe(layers.get(row.path).bytes);
   expect(wire.filter(r=>items.some(i=>i.url===r.path))).toHaveLength(0);
   const rendering=await p.evaluate(async({items,base})=>{
    const store=CanranCourseCache.open(base),out=[];
    async function raster(buffer,width){
     const url=URL.createObjectURL(new Blob([buffer],{type:'image/svg+xml'}));
     try{const img=new Image();img.src=url;await img.decode();const c=document.createElement('canvas');c.width=width;c.height=Math.ceil(width*img.naturalHeight/img.naturalWidth);
      const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);return ctx.getImageData(0,0,c.width,c.height).data;
     }finally{URL.revokeObjectURL(url);}
    }
    for(const i of items){
     const displayed=await store.cached(i),original=await(await fetch(i.url)).arrayBuffer();
     const width=Math.floor(/(?:cover|completion)-scene/.test(i.key)?innerWidth-42:(innerWidth-42)/2)*devicePixelRatio;
     const a=await raster(displayed,width),b=await raster(original,width);let different=0,visible=false;
     for(let j=0;j<a.length;j+=4){visible||=a[j+3]>0;if(a[j]!==b[j]||a[j+1]!==b[j+1]||a[j+2]!==b[j+2]||a[j+3]!==b[j+3])different++;}
     out.push({file:i.key,sha:await CanranCourseCache.digest(displayed),different,visible});
    }return {viewport:[innerWidth,innerHeight],out};
   },{items,base});
   expect(rendering.viewport).toEqual([device.viewport.width,device.viewport.height]);
   for(const [i,r]of rendering.out.entries()){expect(r.sha,r.file).toBe(items[i].sha256);expect(r.different,r.file).toBe(0);expect(r.visible,r.file).toBe(true);}
   await p.locator('#startBtn').click();const word=p.locator('.learning-surface .unit-word').first();await word.click();await expect(word.locator('.word-meaning')).toBeVisible();
   await p.getByRole('link',{name:'故事',exact:true}).click();const story=p.locator('.learning-surface.stage-text');await story.locator('.stage-ctrl>.btn-green').click();await story.getByRole('button',{name:'看中文',exact:true}).first().click();await expect(story.locator('.bcn').first()).toBeVisible();
   await p.goto(base+id+'/#learn/listen');await courseReadyForAssertions(p);const room=p.locator('.stage-listen'),unit=definition(process.cwd(),id,base),qs=unit.questions.listen;
   for(const [n,q]of qs.entries()){await choose(room,q);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:n===qs.length-1?/^完成/:'下一题',exact:n!==qs.length-1}).click();}
   await finishRewardPresentation(p,room);await expect(room.locator('.completion-card')).toBeVisible();
   await expect(room.locator('.completion-card img[src*="completion-scene"]')).toBeVisible();
   await p.goto(base+id+'/#learn/certificate');await courseReadyForAssertions(p);await expect(p.locator('.story-award-illustration').first()).toHaveAttribute('src',unit.reward.scene);
   const sum=a=>a.reduce((n,v)=>n+v,0),oldSvgBytes=sum([...new Map(items.map(i=>[i.sha256,i.bytes])).values()]);
   report.push({id,logicalImages:items.length,originalSvgBytes:oldSvgBytes,layerTransfers:payloads.length,layerBytes:sum(payloads.map(r=>r.bytes)),allPixelsEqual:true});
  }
  await fs.writeFile(info.outputPath('art-wire.json'),JSON.stringify(report,null,2));
 }finally{await context.close();}
});

for(const device of devices)test(device.name+' leaves a streaming directory font immediately and resumes its exact suffix',async({page,browser})=>{
 test.setTimeout(110000);await adminLogin(page,base);const account=await createStudent(page,'字体接力 '+device.id,'字库同学',[/^Lesson 1–2 /]);
 const setup=await studentLogin(browser,account,base),index=await(await setup.page.request.get(base+'course-index.json')).json(),font=index.sharedFonts.find(i=>i.key.endsWith('/award-gothic-500.woff2'));
 await setup.context.close();const ctx=await browser.newContext(contextOptions(device)),p=await ctx.newPage();
 try{
  const key=base+'font-preparation/'+font.sha256;
  await ctx.addInitScript(({key,url,base})=>{
   if(!location.pathname.endsWith('/unit1-2/'))return;
   const native=window.fetch;window.fetch=async function(input,opts){
    if(input===url&&opts?.headers){const range=new Headers(opts.headers).get('Range');if(range){
     const disk=await CanranCourseCache.open(base).cache,r=await disk.match(key);window.handoffRequest={range,stored:Number(r?.headers.get('Content-Length'))||0};
    }}return native.apply(this,arguments);
   };
  },{key,url:font.url,base});
  await courseResponse(page,font.url,{paceOnce:true});
  await p.goto(base);await fillLogin(p,account);await expect(p.locator('.journey-start')).toBeVisible();
  const saved=()=>p.evaluate(async({key,base})=>{if(!window.CanranCourseCache)return 0;const disk=await CanranCourseCache.open(base).cache;const r=await disk?.match(key);return Number(r?.headers.get('Content-Length'))||0;},{key,base});
  await expect.poll(saved,{timeout:20000,intervals:[50,100]}).toBeGreaterThanOrEqual(256*1024);const known=await saved();
  const suffix=p.waitForResponse(r=>r.url().endsWith(font.url)&&r.status()===206);
  await p.locator('.journey-start').tap();const rangeHeader=(await suffix).headers()['content-range'],actual=await p.evaluate(()=>window.handoffRequest);
  expect(actual.stored).toBeGreaterThanOrEqual(known);expect(actual.range).toBe('bytes='+actual.stored+'-');
  expect(rangeHeader).toBe('bytes '+actual.stored+'-'+(font.bytes-1)+'/'+font.bytes);
  await courseReadyForAssertions(p);await expect(p.locator('.learning-surface .unit-word').first()).toBeVisible();
  const result=await p.evaluate(async({font,base})=>{const store=CanranCourseCache.open(base),bytes=await store.cached(font);
   return {whole:await CanranCourseCache.digest(bytes),size:bytes.byteLength,partial:!!(await(await store.cache).match(base+'font-preparation/'+font.sha256)),width:innerWidth};},{font,base});
  expect(result).toEqual({whole:font.sha256,size:font.bytes,partial:false,width:device.viewport.width});
 }finally{await courseResponse(page,font.url).catch(()=>{});await ctx.close();}
});
