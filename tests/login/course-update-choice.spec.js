'use strict';
const {test,expect}=require('@playwright/test');
const crypto=require('node:crypto');
const fs=require('node:fs'),path=require('node:path');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const {finishZone}=require('../support/unit1-2-award-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/',course=base+'unit1-2/';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
test.use({...process.env.UPDATE_REVIEW_BROWSER?{browserName:process.env.UPDATE_REVIEW_BROWSER}:{}});
test.afterEach(async({request})=>{await request.post('/__test__/course-responses',{data:{reset:true}});});

async function learner(page,browser,options={}){
 await adminLogin(page,base);const account=await createStudent(page,'课程更新选择','小禾',[/Lesson 1–2/]);
 const student=await studentLogin(browser,account,base,{viewport:{width:390,height:844},...options});return {...student,account};
}
// Publish a real, independently hashed HTML change through the test HTTP
// boundary. All course scripts, answers and actual learning records stay real.
async function publish(page){
 const index=await(await page.request.get(base+'course-index.json')).json();
 const pack=await(await page.request.get(index.courses['unit1-2'].manifest)).json();
 const entry=pack.required.find(item=>item.key===pack.entry);
 const bytes=Buffer.from((await(await page.request.get(entry.url)).text()).replace(/<title>.*?<\/title>/,'<title>新版课程选择验收</title>'));
 const item={...entry,sha256:sha(bytes),bytes:bytes.length,url:base+'resources/'+sha(bytes)+'/index.html'};
 pack.required=pack.required.map(value=>value.key===entry.key?item:value);pack.revision=sha(JSON.stringify(pack.required));
 const body=JSON.stringify(pack),manifest=base+'course-packages/unit1-2/'+pack.revision+'.json';
 index.courses['unit1-2']={...index.courses['unit1-2'],revision:pack.revision,manifest,sha256:sha(body)};
 await courseResponse(page,item.url,{body:bytes,contentType:item.type});
 await courseResponse(page,manifest,{body,contentType:'application/json'});
 await courseResponse(page,base+'course-index.json',{json:index});
 return {index,item,bytes};
}
async function ready(page){await expect(page.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(page.locator('#courseLoader')).toHaveCount(0);}
async function position(page){await page.locator('.stage-words').getByRole('button',{name:'下一组',exact:true}).click();await expect(page.locator('#wordPageProgress')).toContainText('2 / 4');}

test('已打开页仅提示刷新，下一次进入自动使用最新课包，无旧版选择且成果不被加载层改写',async({page,browser},info)=>{
 test.setTimeout(120000);const student=await learner(page,browser),p=student.page;
 try{
  await finishZone(p,'listen',{base:course});await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
  const awards=await(await p.request.get(base+'api/awards')).json();
  await p.clock.install();await p.goto(course+'#learn/words');await p.reload();await ready(p);await position(p);const oldTitle=await p.title(),resumeUrl=p.url();
  await publish(p);await p.clock.fastForward(301000);
  const notice=p.getByRole('region',{name:'课程更新',exact:true});await expect(notice).toBeVisible();
  await expect(p).toHaveTitle(oldTitle);
  await expect(notice.getByRole('button')).toHaveCount(1);
  await expect(notice.getByRole('button',{name:'刷新课程',exact:true})).toBeVisible();
  await expect(p.getByRole('button',{name:'继续当前版本',exact:true})).toHaveCount(0);
  for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:500});await notice.scrollIntoViewIfNeeded();expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(notice.getByRole('button',{name:'刷新课程',exact:true})).toBeInViewport();await notice.screenshot({path:info.outputPath('notice-'+width+'.png')});}
  // Bind readiness to the new document: the old word cards can still be
  // visible after click resolves and before this same-URL navigation commits.
  await Promise.all([p.waitForEvent('domcontentloaded'),notice.getByRole('button',{name:'刷新课程',exact:true}).click()]);await ready(p);await expect(p).toHaveTitle('新版课程选择验收');
  await expect(p).toHaveURL(resumeUrl);await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
  await expect(notice).toHaveCount(0);expect(await(await p.request.get(base+'api/awards')).json()).toEqual(awards);
  await p.goto(base);const card=p.locator('[data-unit="unit1-2"]');await expect(card.locator('.primary-button')).toBeVisible();
  await expect(card.locator('.course-update-choice')).toHaveCount(0);
  await expect(card.getByRole('link',{name:'进入新版',exact:true})).toHaveCount(0);
  await card.locator('.primary-button').click();await ready(p);await expect(p).toHaveTitle('新版课程选择验收');
 }finally{await student.context.close();}
});

test('旧课包已完整缓存时也必须核验最新版，文件或索引失败仅重试不回到旧版',async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser),p=student.page;
 try{
  await p.goto(course+'#learn/words');await ready(p);await position(p);
  const release=await publish(p);await courseResponse(p,release.item.url,{status:503});
  await p.reload();const loader=p.getByRole('region',{name:'课程加载',exact:true});
  await expect(loader).toContainText('错误编号：L03',{timeout:15000});
  await expect(p.locator('#wordPageProgress')).not.toBeVisible();
  await expect(loader.getByRole('button',{name:'继续当前版本',exact:true})).toHaveCount(0);
  await expect(loader.getByRole('link',{name:'返回课程',exact:true})).toBeVisible();
  await courseResponse(p,release.item.url,{body:release.bytes,contentType:release.item.type});
  await loader.getByRole('button',{name:'再试一次',exact:true}).click();await ready(p);
  await expect(p).toHaveTitle('新版课程选择验收');await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
  await courseResponse(p,base+'course-index.json',{status:503});await p.reload();
  await expect(loader).toContainText('错误编号：L01',{timeout:15000});await expect(p.locator('#wordPageProgress')).not.toBeVisible();
  await expect(loader.getByRole('button',{name:'继续当前版本',exact:true})).toHaveCount(0);
  await courseResponse(p,base+'course-index.json',null);await loader.getByRole('button',{name:'再试一次',exact:true}).click();await ready(p);
 }finally{await student.context.close();}
});

for(const mode of ['save-data','no-worker'])test(`${mode}只提示刷新，重新进入无需选择即加载最新版`,async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser,mode==='no-worker'?{serviceWorkers:'block'}:{}),p=student.page;
 try{
  if(mode==='save-data')await p.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}}));
  await p.clock.install();
  await p.goto(course+'#learn/words');await ready(p);await position(p);const oldTitle=await p.title();
  const release=await publish(p);let downloads=0;
  student.context.on('response',response=>{if(response.url().endsWith(release.item.url))downloads++;});
  await student.context.setOffline(true);await student.context.setOffline(false);
  await p.clock.fastForward(31000);
  const notice=p.getByRole('region',{name:'课程更新',exact:true});await expect(notice).toBeVisible({timeout:15000});
  await expect(p).toHaveTitle(oldTitle);expect(downloads).toBe(0);
  await expect(notice.getByRole('button')).toHaveCount(1);
  await p.reload();await ready(p);await expect(p).toHaveTitle('新版课程选择验收');
  await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');expect(downloads).toBeGreaterThan(0);
 }finally{await student.context.close();}
});

test('升级前缓存的旧加载程序在重新进入时直接使用最新版，不要求清缓存或旧版选择',async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser),p=student.page;
 try{
  const directory=path.join(__dirname,'../fixtures/course-loader-before-update-choice');
  const legacy=fs.readFileSync(path.join(directory,'course-loader.js')),source=JSON.parse(fs.readFileSync(path.join(directory,'manifest.json')));
  expect(sha(legacy)).toBe(source.sha256);expect(legacy.length).toBe(source.bytes);
  const index=await(await p.request.get(base+'course-index.json')).json(),pack=await(await p.request.get(index.courses['unit1-2'].manifest)).json();
  const item=pack.required.find(value=>value.key===base+'core/course-loader.js');
  const old={...item,bytes:legacy.length,sha256:sha(legacy),url:base+'resources/'+sha(legacy)+'/course-loader.js'};
  pack.required=pack.required.map(value=>value.key===item.key?old:value);pack.revision=sha(JSON.stringify(pack.required));
  const body=JSON.stringify(pack),manifest=base+'course-packages/unit1-2/'+pack.revision+'.json';
  index.courses['unit1-2']={...index.courses['unit1-2'],revision:pack.revision,manifest,sha256:sha(body)};
  await courseResponse(p,old.url,{body:legacy,contentType:item.type});await courseResponse(p,manifest,{body,contentType:'application/json'});
  await courseResponse(p,base+'course-index.json',{json:index});await courseResponse(p,base+'core/course-loader.js',{body:legacy,contentType:item.type});
  let initialChecks=0;p.on('response',response=>{if(response.url().endsWith(base+'course-index.json'))initialChecks++;});
  await p.goto(course+'#learn/words');await ready(p);await position(p);await expect.poll(()=>initialChecks).toBeGreaterThanOrEqual(2);
  await courseResponse(p,base+'core/course-loader.js',null);await courseResponse(p,base+'course-index.json',null);await publish(p);
  await p.goto(base);await expect(p.locator('[data-unit="unit1-2"] .primary-button')).toBeVisible();
  await expect(p.locator('[data-unit="unit1-2"] .course-update-choice')).toHaveCount(0);
  await p.locator('[data-unit="unit1-2"] .primary-button').click();await ready(p);
  await expect(p).toHaveTitle('新版课程选择验收');await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
  await expect(p.getByRole('button',{name:'继续当前版本',exact:true})).toHaveCount(0);
 }finally{await student.context.close();}
});
