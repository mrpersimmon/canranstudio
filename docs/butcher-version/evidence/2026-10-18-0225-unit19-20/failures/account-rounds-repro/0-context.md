# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit19-20-v153-upgrade.spec.js >> 原65题五星同库更新：原卡全部帧、日期、未改轮次和跨设备历史保留
- Location: tests\login\unit19-20-v153-upgrade.spec.js:12:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.stage-listen .completion-number')
Timeout: 5000ms
- Expected  - 3
+ Received  + 3

  Array [
-   "15",
-   "15",
-   "0",
+   "—",
+   "—",
+   "—",
  ]

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for locator('.stage-listen .completion-number')
    14 × locator resolved to 3 elements

```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
  4  | const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
  5  | const {adminLogin,createStudent,signIn}=require('./helpers');
  6  | const old=require('../support/unit1920-before-v153'),fresh=require('../support/unit1920-fivezones');
  7  | const {FILES}=require('../support/unit1920-v153-legacy');
  8  | const readLearning=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit19-20:learning:v1')));
  9  | const {defaultBrowserType,...mobileProfile}=require('@playwright/test').devices['iPhone 13'];
  10 | test.use({actionTimeout:10000,...(process.env.UNIT1920_BROWSER==='webkit'?{...mobileProfile,browserName:'webkit'}:{})});
  11 | async function linkOrCopy(a,b){if((await fs.stat(a)).isDirectory())await fs.symlink(a,b,process.platform==='win32'?'junction':'dir');else await fs.copyFile(a,b);}
  12 | test('原65题五星同库更新：原卡全部帧、日期、未改轮次和跨设备历史保留',async({browser},info)=>{
  13 |  test.setTimeout(360000);
  14 |  const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-u1920-v153-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
  15 |  const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1),ports=require('../support/login-test-ports'),origin=ports.origin(4271),chain=process.env.UNIT1920_CHAIN_LEGACY==='1';
  16 |  let server,first,second,oldIssuedAt,oldDate;
  17 |  const ledger=()=>{const {DatabaseSync}=require('node:sqlite'),db=new DatabaseSync(path.join(dataDir,'learning.sqlite'),{readOnly:true});try{return db.prepare('SELECT edition,value FROM unit_awards WHERE course=? ORDER BY edition').all('unit19-20');}finally{db.close();}};
  18 |  const ready=async p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  19 |  const restore65=async()=>{for(const n of FILES)await fs.copyFile(path.join(root,'tests/fixtures/unit19-20-before-v153',n),path.join(oldRoot,'unit19-20',n));};
  20 |  try{
  21 |   await fs.mkdir(oldRoot);for(const entry of await fs.readdir(root,{withFileTypes:true})){if(['.git','unit19-20'].includes(entry.name))continue;if(/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const n of await fs.readdir(path.join(root,entry.name)))await linkOrCopy(path.join(root,entry.name,n),path.join(oldRoot,entry.name,n));}else await linkOrCopy(path.join(root,entry.name),path.join(oldRoot,entry.name));}
  22 |   await fs.mkdir(path.join(oldRoot,'unit19-20'));await restore65();
  23 |   if(chain){for(const n of ['index.html','content.js','unit.js','unit.css','scene.js'])await fs.copyFile(path.join(root,'tests/fixtures/unit19-20-before-fivezones',n),path.join(oldRoot,'unit19-20',n));await fs.copyFile(path.join(root,'core/course-catalog.js'),path.join(oldRoot,'unit19-20/legacy-catalog.js'));const html=path.join(oldRoot,'unit19-20/index.html');await fs.writeFile(html,(await fs.readFile(html,'utf8')).replaceAll('/tests/fixtures/unit19-20-before-fivezones/','/unit19-20/').replace('/core/course-catalog.js','/unit19-20/legacy-catalog.js'));}
  24 |   const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
  25 |   const stop=async()=>{await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;};const start=async previous=>{server=await createApp({root:previous?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4271),'127.0.0.1',resolve));};
  26 |   await start(true);first=await browser.newContext({baseURL:origin,...(process.env.UNIT1920_BROWSER==='webkit'?mobileProfile:{})});const p=await first.newPage();await adminLogin(p,base);const account=await createStudent(p,'五星记录保留验收班','小禾',[/Lesson 19–20/]);await signIn(p,account,base);
  27 |   if(chain){await require('../support/unit19-20-flow').completeUnit1920(p,prefix);await p.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await p.getByRole('button',{name:'领取单元证书',exact:true}).click();oldDate=await p.locator('#certificateDate').innerText();oldIssuedAt=(await readLearning(p)).activity.unitClassroomCertificateIssuedAt;await p.keyboard.press('Escape');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await stop();await restore65();await start(true);await p.goto(base+'unit19-20/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('0');info.annotations.push({type:'historical-chain',description:'Real 36-question 15-star certificate -> real 65-question five-star edition -> current 66-question edition'});}
  28 |   await old.story(p,prefix);for(const id of Object.keys(old.ANSWERS)){const room=await old.activity(p,id,{base:prefix,expectPerfect:!chain});if(chain){await room.getByRole('button',{name:'再练一轮',exact:true}).click();await old.activity(p,id,{base:prefix});}}
  29 |   await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await p.goto(base+'unit19-20/#learn/certificate');await ready(p);
  30 |   const date=await p.locator('#certificateDate').innerText(),before=await readLearning(p),awards=ledger();expect(awards).toHaveLength(1);expect(awards[0].edition).toBe('park-five-zones-v1');expect(Object.keys(before.records)).toHaveLength(65);expect(Boolean(before.records['u1920-tasks-v4-be-subject'].revealed)).toBe(false);
  31 |   await fs.writeFile(info.outputPath('before65-progress.json'),JSON.stringify(before));
  32 |   const original=info.outputPath('original-five-star.gif');let download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(original);
  33 |   await stop();await start(false);await p.goto(base+'unit19-20/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#certificateDate')).toHaveText(date);await expect(p.locator('#certificateName')).toHaveText('小禾');await p.getByText('之前的五星学习记录',{exact:true}).click();await expect(p.locator('.historical-learning li')).toHaveCount(65);
  34 |   const retained=info.outputPath('retained-five-star.gif');download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(retained);const sharp=require('sharp');expect((await sharp(original,{animated:true}).raw().toBuffer()).equals(await sharp(retained,{animated:true}).raw().toBuffer())).toBe(true);expect(ledger()).toEqual(awards);await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('retained-five-star-card.png')});
  35 |   second=await browser.newContext({baseURL:origin,...(process.env.UNIT1920_BROWSER==='webkit'?mobileProfile:{})});const other=await second.newPage();await signIn(other,account,base);await other.goto(base+'unit19-20/#learn/certificate');await ready(other);await expect(other.locator('#starCount')).toHaveText('5');await expect(other.locator('#certificateDate')).toHaveText(date);await expect(other.locator('#certificateName')).toHaveText('小禾');
  36 |   const after=await readLearning(other);await fs.writeFile(info.outputPath('after66-progress.json'),JSON.stringify(after));info.annotations.push({type:'history-storage',description:JSON.stringify({snapshot:Boolean(after.activity.unit1920V153Snapshot),remote:Boolean(after.activity.unit1920V153Progress),marker:after.activity.unit1920V153Migration,remoteRecords:Object.keys(after.activity.unit1920V153Progress?.records||{}).length})});expect((after.activity.unit1920V153Snapshot||after.activity.unit1920V153Progress).records).toEqual(before.records);await other.getByText('之前的五星学习记录',{exact:true}).click();await expect(other.locator('.historical-learning li')).toHaveCount(65);
> 37 |   for(const id of ['listen','roles','grammar','apply']){await other.goto(base+'unit19-20/#learn/'+id);await ready(other);await expect(other.locator('.stage-'+id+' .completion-number')).toHaveText([String(old.ANSWERS[id].length),String(old.ANSWERS[id].length),'0']);const key='unit1920-'+id+'-practice/five-zones-v1';expect(after.groups[key].runId).toBe(before.groups[key].runId);expect(after.groups[key].states).toEqual(before.groups[key].states);}
     |                                                                                                                                                                                          ^ Error: expect(locator).toHaveText(expected) failed
  38 |   await other.goto(base+'unit19-20/#learn/exam');await expect(other.locator('.stage-exam .progress-copy')).toHaveText('第 4 / 24 题');await expect(other.locator('.stage-exam').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await fresh.activity(other,'exam',{base:prefix,expectPerfect:false});
  39 |   // Re-practising unchanged questions records the new visible support without
  40 |   // rewriting the frozen original independent submissions or old award date.
  41 |   await other.goto(base+'unit19-20/#learn/grammar');await other.locator('.stage-grammar').getByRole('button',{name:'再练一轮',exact:true}).click();await fresh.activity(other,'grammar',{base:prefix});await expect(other.locator('#studentSyncStatus')).toHaveText('学习成果已同步');expect(ledger()).toEqual(awards);await p.reload();await ready(p);expect((await readLearning(p)).activity.unit1920V153Snapshot.records).toEqual(before.records);await expect(p.locator('#certificateDate')).toHaveText(date);
  42 |   if(chain){for(const tab of [p,other]){await tab.goto(base+'unit19-20/#learn/certificate');await ready(tab);await tab.locator('.legacy-learning>summary').click();await expect(tab.locator('.legacy-issued-date')).toHaveAttribute('data-issued-at',oldIssuedAt);await tab.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(tab.locator('#legacyCertificateDate')).toHaveText(oldDate);await expect(tab.locator('#legacyCertificateName')).toHaveText('小禾');await tab.keyboard.press('Escape');}await p.locator('.legacy-learning').screenshot({path:info.outputPath('retained-15-star-history.png')});}
  43 |  }finally{await first?.close();await second?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});if(!path.resolve(temporary).startsWith(path.join(os.tmpdir(),'canran-u1920-v153-')))throw Error('Unexpected test cleanup path');await fs.rm(temporary,{recursive:true,force:true});}
  44 | });
  45 | 
```