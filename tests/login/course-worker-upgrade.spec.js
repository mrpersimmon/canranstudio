'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
const {adminLogin,createStudent,signIn}=require('./helpers');
const {courseResponse,installCourseResponseFaults}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const hello=page=>page.evaluate(()=>new Promise(resolve=>{const port=new MessageChannel();port.port1.onmessage=event=>resolve(event.data);navigator.serviceWorker.controller.postMessage({type:'course:hello'},[port.port2]);}));
test.use({...process.env.UPDATE_REVIEW_BROWSER?{browserName:process.env.UPDATE_REVIEW_BROWSER}:{}});

for(const updateFails of [false,true])test((updateFails?'更新失败阻止旧Worker接管并可重试；':'')+'旧Worker必须先升级归档资源能力再固定新课包，归档图真实可读且未知资源仍409',async({browser})=>{
  test.setTimeout(120000);
  const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-worker-archive-'));
  const dataDir=path.join(temporary,'data'),origin=require('../support/login-test-ports').origin(4290);
  let server,context;
  try{
    const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');
    // The same real upgrade command establishes the epoch, including its paired
    // backup. A fresh account is enough to exercise the runtime capability gate.
    try{await store.applySystemUpgrade({backupDirectory:path.join(temporary,'backup'),root});}finally{store.close();}
    server=await createApp({root,dataDir,origin,basePath:base});installCourseResponseFaults(server);
    // The fault replaces only worker bytes; keep the real endpoint's scope
    // header so this is an installed predecessor, not a rejected registration.
    server.prependListener('request',(request,response)=>{if(request.url===base+'core/subpath-worker.js')response.setHeader('Service-Worker-Allowed',base);});
    await new Promise(resolve=>server.listen(Number(new URL(origin).port),'127.0.0.1',resolve));
    context=await browser.newContext({baseURL:origin});const p=await context.newPage();
    const fixture=path.join(root,'tests/fixtures/course-worker-before-archive'),legacy=await fs.readFile(path.join(fixture,'course-worker.js'));
    const manifest=JSON.parse(await fs.readFile(path.join(fixture,'manifest.json'),'utf8'));
    expect(crypto.createHash('sha256').update(legacy).digest('hex')).toBe(manifest.sha256);expect(legacy.length).toBe(manifest.bytes);
    const worker=Buffer.concat([Buffer.from('self.courseAccessRequired=true;\n'),await fs.readFile(path.join(root,'core/course-cache.js')),Buffer.from('\n'),legacy]);
    await courseResponse(p,base+'core/subpath-worker.js',{body:worker,contentType:'text/javascript'});
    await adminLogin(p,base);const account=await createStudent(p,'旧Worker更新验证','小禾',[/Lesson 1–2/]);await signIn(p,account,base);
    await expect.poll(()=>p.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
    expect((await hello(p)).protocol).toBe(1);expect((await hello(p)).archiveAssets).toBeUndefined();
    await p.addInitScript(()=>{window.coursePinCount=0;const post=ServiceWorker.prototype.postMessage;ServiceWorker.prototype.postMessage=function(message,...args){if(message?.type==='course:pin')window.coursePinCount++;return post.call(this,message,...args);};});
    await courseResponse(p,base+'core/subpath-worker.js',{hold:true});
    await p.goto(base+'unit1-2/#learn/words');
    await expect.poll(async()=> (await(await p.request.get('/__test__/course-held')).json()).includes(base+'core/subpath-worker.js')).toBe(true);
    await expect(p.locator('#courseLoader')).toContainText('正在准备新版课程…');
    expect(await p.evaluate(()=>window.coursePinCount)).toBe(0);
    await expect(p.locator('#wordPageProgress')).not.toBeVisible();
    if(updateFails){
      await courseResponse(p,base+'core/subpath-worker.js',{status:503});
      await expect(p.locator('#courseLoader')).toContainText('错误编号：L02');
      expect(await p.evaluate(()=>window.coursePinCount)).toBe(0);
      await expect(p.locator('#wordPageProgress')).not.toBeVisible();
      await courseResponse(p,base+'core/subpath-worker.js',null);
      await p.getByRole('button',{name:'再试一次',exact:true}).click();
    }else await courseResponse(p,base+'core/subpath-worker.js',null,{resumeHeld:true});
    await expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(p.locator('#courseLoader')).toHaveCount(0);
    expect((await hello(p)).archiveAssets).toBe(true);
    const scene=base+'awards/history-assets/unit1-2/assets/awards/unit1-2-handbag-closeup.webp';
    const direct=await p.request.get(scene);expect(direct.status()).toBe(200);
    const expected=crypto.createHash('sha256').update(await direct.body()).digest('hex');
    const observed=await p.evaluate(async scene=>{const response=await fetch(scene),bytes=await response.arrayBuffer(),hash=await crypto.subtle.digest('SHA-256',bytes);return {status:response.status,hash:[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')};},scene);
    expect(observed).toEqual({status:200,hash:expected});
    expect(await p.evaluate(async url=>(await fetch(url)).status,base+'assets/undeclared-archive-probe.webp')).toBe(409);
    expect(await p.evaluate(async url=>(await fetch(url)).status,base+'awards/history-assets/unit3-4/assets/awards/unit3-4-cloakroom-closeup.webp')).toBe(403);
  }finally{
    await context?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});
    if(!path.resolve(temporary).startsWith(path.join(os.tmpdir(),'canran-worker-archive-')))throw Error('Unexpected cleanup directory');
    await fs.rm(temporary,{recursive:true,force:true});
  }
});
