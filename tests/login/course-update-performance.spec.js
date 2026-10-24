'use strict';
const {test,expect}=require('@playwright/test'),crypto=require('node:crypto');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/',course='unit1-2';
test.use({...process.env.UPDATE_REVIEW_BROWSER?{browserName:process.env.UPDATE_REVIEW_BROWSER}:{}});
test.afterEach(async({request})=>{await request.post('/__test__/course-responses',{data:{reset:true}});});
async function learner(page,browser){await adminLogin(page,base);const account=await createStudent(page,'更新性能检查','小禾',[/Lesson 1–2/]);return studentLogin(browser,account,base);}
async function ready(p){await expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(p.locator('#courseLoader')).toHaveCount(0);}
test('无更新时只轮询单课元数据，普通检测错峰，撤回仍及时且304没有响应体',async({page,browser},info)=>{
 test.setTimeout(90000);const student=await learner(page,browser),p=student.page,requests=[];
 try{
  // A prior lesson may already have made conditional requests on this shared
  // test server. Reproduce that history with real authenticated HTTP traffic.
  const earlier=await p.request.get(base+'course-withdrawals/'+course+'.json');
  const previous=await p.request.get(base+'course-withdrawals/'+course+'.json',{headers:{'If-None-Match':earlier.headers().etag}});
  expect(previous.status()).toBe(304);
  const readWire=async()=> (await p.request.get('/__test__/course-network')).json();
  const history=await readWire();
  expect(history.some(r=>r.path===base+'course-withdrawals/'+course+'.json'&&r.status===304)).toBe(true);
  // Count only traffic after this visit starts. Other tests share the server;
  // their completed checks must not be mistaken for this page polling twice.
  const wire=async()=> (await readWire()).slice(history.length);
  // A response event can precede body validation and the next scheduled poll
  // in WebKit. Advance the virtual clock only after the real cycle completes.
  await p.addInitScript(()=>{window.withdrawalChecks=0;document.addEventListener('canran:course-withdrawals-checked',()=>window.withdrawalChecks++);});
  await p.clock.install();p.on('response',r=>{if(/course-(?:index|status|withdrawals)/.test(r.url()))requests.push({path:new URL(r.url()).pathname,status:r.status()});});
  await p.goto(base+course+'/#learn/words');await ready(p);
  await expect.poll(()=>requests.filter(r=>r.path.includes('/course-status/')).length).toBe(1);
  const full=requests.filter(r=>r.path.endsWith('course-index.json')).length;
  await p.clock.fastForward(61000);await expect.poll(()=>p.evaluate(()=>window.withdrawalChecks)).toBe(1);expect(requests.filter(r=>r.path.includes('/course-withdrawals/'))).toHaveLength(1);
  expect(requests.filter(r=>r.path.includes('/course-status/'))).toHaveLength(1);
  // WebKit can present a wire 304 as a synthesized 200. Check actual server
  // delivery as well as browser behavior, not a browser-specific event status.
  await p.clock.fastForward(61000);await expect.poll(async()=> (await wire()).filter(r=>r.path===base+'course-withdrawals/'+course+'.json'&&r.status===304&&r.bytes===0&&r.conditional).length).toBe(1);
  await p.clock.fastForward(57000);expect(requests.filter(r=>r.path.includes('/course-status/'))).toHaveLength(1);
  await p.clock.fastForward(122000);await expect.poll(async()=> (await wire()).filter(r=>r.path===base+'course-status/'+course+'.json'&&r.status===304&&r.bytes===0&&r.conditional).length).toBe(1);
  expect(requests.filter(r=>r.path.endsWith('course-index.json'))).toHaveLength(full);
  await info.attach('metadata-requests.json',{body:JSON.stringify({priorRequestCount:history.length,browser:requests,wire:await wire()},null,2),contentType:'application/json'});
 }finally{await student.context.close();}
});

test('已准备同一新版不会在后续检测中重新解码和下载清单，手动进入仍完整验证',async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser),p=student.page;const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
 try{
  await p.addInitScript(()=>{window.updateChecks=0;document.addEventListener('canran:course-update-checked',()=>window.updateChecks++);window.updateImageDecodes=0;const decode=HTMLImageElement.prototype.decode;HTMLImageElement.prototype.decode=function(...args){window.updateImageDecodes++;return decode.apply(this,args);};});
  await p.clock.install();await p.goto(base+course+'/#learn/words');await ready(p);
  const index=await(await p.request.get(base+'course-index.json')).json(),pack=await(await p.request.get(index.courses[course].manifest)).json();
  const old=pack.required.find(i=>i.key===pack.entry),bytes=Buffer.from((await(await p.request.get(old.url)).text()).replace(/<title>.*?<\/title>/,'<title>更新准备只做一次</title>'));
  const item={...old,url:base+'resources/'+sha(bytes)+'/index.html',sha256:sha(bytes),bytes:bytes.length};pack.required=pack.required.map(i=>i.key===old.key?item:i);pack.revision=sha(JSON.stringify(pack.required));const body=JSON.stringify(pack);
  const manifest=base+'course-packages/'+course+'/'+pack.revision+'.json';index.courses[course]={...index.courses[course],revision:pack.revision,manifest,sha256:sha(body)};
  await courseResponse(p,item.url,{body:bytes,contentType:item.type});await courseResponse(p,manifest,{body,contentType:'application/json'});await courseResponse(p,base+'course-index.json',{json:index});
  let fetched=0;p.on('response',r=>{if(r.url().endsWith(manifest))fetched++;});
  await p.clock.fastForward(301000);await expect(p.locator('#courseUpdateStatus')).toContainText('新版已准备好');
  const decoded=await p.evaluate(()=>window.updateImageDecodes);expect(fetched).toBe(1);
  for(let i=0;i<3;i++){const checked=await p.evaluate(()=>window.updateChecks);await p.clock.fastForward(301000);await expect.poll(()=>p.evaluate(()=>window.updateChecks)).toBe(checked+1);await expect(p.locator('#courseUpdateStatus')).toContainText('新版已准备好');}
  expect(fetched).toBe(1);expect(await p.evaluate(()=>window.updateImageDecodes)).toBe(decoded);
  const picture=pack.required.find(i=>i.type.startsWith('image/'));let repaired=0;p.on('response',r=>{if(r.url().endsWith(picture.url))repaired++;});
  // Evict only public resource bytes. Choosing the prepared candidate must
  // still repair a missing file, never trust the preparation label alone.
  await p.evaluate(async({base,picture})=>{for(const name of await caches.keys())if(name.endsWith(':course-cache:v1'))await(await caches.open(name)).delete(base+'resources/'+picture.sha256);},{base,picture});
  await p.getByRole('region',{name:'课程更新',exact:true}).getByRole('button',{name:'刷新课程',exact:true}).click();await ready(p);await expect(p).toHaveTitle('更新准备只做一次');
  expect(repaired).toBeGreaterThan(0);
 }finally{await student.context.close();}
});

test('失败退避不被反复重连绕过，仍可手动进入最新版',async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser),p=student.page;let hits=0;
 try{
  await p.addInitScript(()=>{window.updateChecks=0;document.addEventListener('canran:course-update-checked',()=>window.updateChecks++);});
  await p.clock.install();p.on('response',r=>{if(r.url().endsWith('course-status/'+course+'.json'))hits++;});
  await p.goto(base+course+'/#learn/words');await ready(p);await expect.poll(()=>p.evaluate(()=>window.updateChecks)).toBe(1);
  await courseResponse(p,base+'course-status/'+course+'.json',{status:503});await p.clock.fastForward(301000);await expect.poll(()=>p.evaluate(()=>window.updateChecks)).toBe(2);expect(hits).toBe(2);
  for(let i=0;i<5;i++){await student.context.setOffline(true);await student.context.setOffline(false);await p.clock.fastForward(31000);}
  expect(hits).toBe(2);
  await p.clock.fastForward(481000);await expect.poll(()=>p.evaluate(()=>window.updateChecks)).toBe(3);expect(hits).toBe(3);
  await p.clock.fastForward(601000);expect(hits).toBe(3);
  await courseResponse(p,base+'course-status/'+course+'.json',null);await p.goto(base+course+'/?course-update=1#learn/words');await ready(p);
 }finally{await student.context.close();}
});

test('普通检测退避期间仍在一分钟内检查撤回并停止旧版操作',async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser),p=student.page;
 try{
  await p.addInitScript(()=>{window.updateChecks=0;document.addEventListener('canran:course-update-checked',()=>window.updateChecks++);});await p.clock.install();
  await p.goto(base+course+'/#learn/words');await ready(p);await expect.poll(()=>p.evaluate(()=>window.updateChecks)).toBe(1);
  const index=await(await p.request.get(base+'course-index.json')).json(),key=course+'@'+index.courses[course].revision;
  await courseResponse(p,base+'course-status/'+course+'.json',{status:503});await p.clock.fastForward(301000);await expect.poll(()=>p.evaluate(()=>window.updateChecks)).toBe(2);
  await courseResponse(p,base+'course-withdrawals/'+course+'.json',{json:{schema:1,protocol:1,basePath:base,courseId:course,withdrawn:[key]}});
  await p.clock.fastForward(61000);await expect.poll(()=>p.evaluate(({base,key})=>CanranCourseCache.open(base).get('meta','withdrawn').then(v=>v?.includes(key)),{base,key})).toBe(true);
  await p.locator('.stage-words').getByRole('button',{name:'下一组',exact:true}).click();await expect(p.locator('#courseLoader')).toContainText('课程需要更新，请联网后再试。');
 }finally{await student.context.close();}
});
