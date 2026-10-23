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

test('目录与课内提示更新，保留当前版本直到明确选择，位置和已获纪念卡日期不变',async({page,browser},info)=>{
 test.setTimeout(120000);const student=await learner(page,browser),p=student.page;
 try{
  await finishZone(p,'listen',{base:course});await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
  const awards=await(await p.request.get(base+'api/awards')).json();
  await p.goto(course+'#learn/words');await ready(p);await position(p);const oldTitle=await p.title();
  await publish(p);await p.goto(base);const card=p.locator('[data-unit="unit1-2"]');
  await expect(card.getByText('有新版课程',{exact:true})).toBeVisible();
  await expect(card.getByRole('link',{name:'进入新版',exact:true})).toBeVisible();
  await card.locator('.primary-button').click();await ready(p);await expect(p).toHaveTitle(oldTitle);const resumeUrl=p.url();
  const notice=p.getByRole('region',{name:'课程更新',exact:true});await expect(notice).toBeVisible();
  for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:500});await notice.scrollIntoViewIfNeeded();expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(notice.getByRole('button',{name:'进入新版',exact:true})).toBeInViewport();await notice.screenshot({path:info.outputPath('notice-'+width+'.png')});if(width===320)await p.screenshot({path:info.outputPath('page-320.png')});}
  await notice.getByRole('button',{name:'继续当前版本',exact:true}).click();await expect(p).toHaveTitle(oldTitle);
  await p.reload();await ready(p);await expect(p).toHaveTitle(oldTitle);await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
  await notice.getByRole('button',{name:'进入新版',exact:true}).click();await ready(p);await expect(p).toHaveTitle('新版课程选择验收');
  await expect(p).toHaveURL(resumeUrl);await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
  await expect(notice).toHaveCount(0);expect(await(await p.request.get(base+'api/awards')).json()).toEqual(awards);
  await p.reload();await ready(p);await expect(p).toHaveTitle('新版课程选择验收');
 }finally{await student.context.close();}
});

test('新版文件失败可重试或继续当前版本，目录的进入新版可直接恢复',async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser),p=student.page;
 try{
  await p.goto(course+'#learn/words');await ready(p);await position(p);const oldTitle=await p.title();
  const release=await publish(p);await courseResponse(p,release.item.url,{status:503});
  await p.reload();await ready(p);const notice=p.getByRole('region',{name:'课程更新',exact:true});
  await notice.getByRole('button',{name:'进入新版',exact:true}).click();
  const loader=p.getByRole('region',{name:'课程加载',exact:true});await expect(loader).toContainText('错误编号：L03',{timeout:15000});
  await loader.getByRole('button',{name:'继续当前版本',exact:true}).click();await ready(p);await expect(p).toHaveTitle(oldTitle);await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
  await courseResponse(p,release.item.url,{body:release.bytes,contentType:release.item.type});
  await p.goto(base);await p.locator('[data-unit="unit1-2"]').getByRole('link',{name:'进入新版',exact:true}).click();
  await ready(p);await expect(p).toHaveTitle('新版课程选择验收');await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
 }finally{await student.context.close();}
});

for(const mode of ['save-data','no-worker'])test(`${mode}仍检查更新，重新联网出现提醒并由学生选择新版`,async({page,browser})=>{
 test.setTimeout(90000);const student=await learner(page,browser,mode==='no-worker'?{serviceWorkers:'block'}:{}),p=student.page;
 try{
  if(mode==='save-data')await p.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true}}));
  await p.clock.install();
  await p.goto(course+'#learn/words');await ready(p);await position(p);const oldTitle=await p.title();
  const release=await publish(p);let downloads=0;
  student.context.on('response',response=>{if(response.url().endsWith(release.item.url))downloads++;});
  await student.context.setOffline(true);await student.context.setOffline(false);
  // Foreground/network events share a 30-second minimum check interval.
  await p.clock.fastForward(31000);
  const notice=p.getByRole('region',{name:'课程更新',exact:true});await expect(notice).toBeVisible({timeout:15000});
  await expect(p).toHaveTitle(oldTitle);expect(downloads).toBe(0);
  await notice.getByRole('button',{name:'进入新版',exact:true}).click();await ready(p);await expect(p).toHaveTitle('新版课程选择验收');
  await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');expect(downloads).toBeGreaterThan(0);
 }finally{await student.context.close();}
});

test('升级前已缓存的旧加载程序也能收到新提醒，不要求清缓存',async({page,browser})=>{
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
  await p.goto(base);await expect(p.locator('[data-unit="unit1-2"]').getByText('有新版课程',{exact:true})).toBeVisible();
  await p.locator('[data-unit="unit1-2"] .primary-button').click();await ready(p);
  await p.getByRole('region',{name:'课程更新',exact:true}).getByRole('button',{name:'进入新版',exact:true}).click();
  await ready(p);await expect(p).toHaveTitle('新版课程选择验收');await expect(p.locator('#wordPageProgress')).toContainText('2 / 4');
 }finally{await student.context.close();}
});
