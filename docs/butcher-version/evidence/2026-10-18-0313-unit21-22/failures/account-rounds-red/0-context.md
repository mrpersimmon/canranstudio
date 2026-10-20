# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit21-22-teaching-review.spec.js >> 45题原五星更新：全部有效轮次、原卡全帧、姓名日期与跨设备旧证保留
- Location: tests\login\unit21-22-teaching-review.spec.js:12:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.stage-listen .completion-number')
Timeout: 5000ms
- Expected  - 3
+ Received  + 3

  Array [
-   "10",
-   "10",
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
  6  | const old=require('../support/unit2122-before-teaching-review'),fresh=require('../support/unit2122-fivezones');
  7  | const {FILES}=require('../support/unit2122-teaching-review');
  8  | const readLearning=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit21-22:learning:v1')));
  9  | const {defaultBrowserType,...mobileProfile}=require('@playwright/test').devices['iPhone 13'];
  10 | test.use({actionTimeout:10000,...(process.env.UNIT2122_BROWSER==='webkit'?{...mobileProfile,browserName:'webkit'}:{})});
  11 | async function linkOrCopy(a,b){if((await fs.stat(a)).isDirectory())await fs.symlink(a,b,process.platform==='win32'?'junction':'dir');else await fs.copyFile(a,b);}
  12 | test('45题原五星更新：全部有效轮次、原卡全帧、姓名日期与跨设备旧证保留',async({browser},info)=>{
  13 |  test.setTimeout(300000);
  14 |  const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-u2122-review-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
  15 |  const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1),ports=require('../support/login-test-ports'),origin=ports.origin(4271),chain=process.env.UNIT2122_CHAIN_LEGACY==='1';
  16 |  let server,first,second,oldIssuedAt,oldDate;
  17 |  const ready=async p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  18 |  const ledger=()=>{const {DatabaseSync}=require('node:sqlite'),db=new DatabaseSync(path.join(dataDir,'learning.sqlite'),{readOnly:true});try{return db.prepare('SELECT edition,value FROM unit_awards WHERE course=? ORDER BY edition').all('unit21-22');}finally{db.close();}};
  19 |  const restore45=async()=>{for(const n of await fs.readdir(path.join(root,'unit21-22')))if(n!=='README.md')await fs.copyFile(path.join(root,FILES.includes(n)?'tests/fixtures/unit21-22-before-teaching-review':'unit21-22',n),path.join(oldRoot,'unit21-22',n));};
  20 |  try{
  21 |   await fs.mkdir(oldRoot);for(const entry of await fs.readdir(root,{withFileTypes:true})){if(['.git','unit21-22'].includes(entry.name))continue;if(/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const n of await fs.readdir(path.join(root,entry.name)))await linkOrCopy(path.join(root,entry.name,n),path.join(oldRoot,entry.name,n));}else await linkOrCopy(path.join(root,entry.name),path.join(oldRoot,entry.name));}
  22 |   await fs.mkdir(path.join(oldRoot,'unit21-22'));await restore45();
  23 |   if(chain){for(const n of ['index.html','content.js','unit.js','unit.css','scene.js'])await fs.copyFile(path.join(root,'tests/fixtures/unit21-22-before-fivezones',n),path.join(oldRoot,'unit21-22',n));await fs.copyFile(path.join(root,'core/course-catalog.js'),path.join(oldRoot,'unit21-22/legacy-catalog.js'));const html=path.join(oldRoot,'unit21-22/index.html');await fs.writeFile(html,(await fs.readFile(html,'utf8')).replaceAll('/tests/fixtures/unit21-22-before-fivezones/','/unit21-22/').replace('/core/course-catalog.js','/unit21-22/legacy-catalog.js'));}
  24 |   const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
  25 |   const stop=async()=>{await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;};const start=async previous=>{server=await createApp({root:previous?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4271),'127.0.0.1',resolve));};
  26 |   await start(true);first=await browser.newContext({baseURL:origin,...(process.env.UNIT2122_BROWSER==='webkit'?mobileProfile:{})});const p=await first.newPage();await adminLogin(p,base);const account=await createStudent(p,'交接记录保留验收班','小禾',[/Lesson 21–22/]);await signIn(p,account,base);
  27 |   if(chain){await require('../support/unit21-22-flow').completeUnit2122(p,prefix);await p.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await p.getByRole('button',{name:'领取单元证书',exact:true}).click();oldDate=await p.locator('#certificateDate').innerText();oldIssuedAt=(await readLearning(p)).activity.unitClassroomCertificateIssuedAt;await p.keyboard.press('Escape');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await stop();await restore45();await start(true);await p.goto(base+'unit21-22/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('0');info.annotations.push({type:'historical-chain',description:'Real 30-question 15-star certificate -> real 45-question five-star round -> current presentation, unchanged 45 questions'});}
  28 |   await old.story(p,prefix);for(const id of Object.keys(old.ANSWERS)){const room=await old.activity(p,id,{base:prefix,expectPerfect:!chain});if(chain){await room.getByRole('button',{name:'再练一轮',exact:true}).click();await old.activity(p,id,{base:prefix});}}
  29 |   await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await p.goto(base+'unit21-22/#learn/certificate');await ready(p);
  30 |   const date=await p.locator('#certificateDate').innerText(),before=await readLearning(p),awards=ledger();expect(awards).toHaveLength(1);expect(awards[0].edition).toBe('books-five-zones-v1');expect(Object.keys(before.records)).toHaveLength(45);expect(Boolean(before.records['u2122-v1-owner-our'].revealed)).toBe(false);await fs.writeFile(info.outputPath('before45-progress.json'),JSON.stringify(before));
  31 |   const original=info.outputPath('original-five-star.gif');let download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(original);
  32 |   await stop();await start(false);await p.goto(base+'unit21-22/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#certificateDate')).toHaveText(date);await expect(p.locator('#certificateName')).toHaveText('小禾');
  33 |   const retained=info.outputPath('retained-five-star.gif');download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(retained);const sharp=require('sharp');expect((await sharp(original,{animated:true}).raw().toBuffer()).equals(await sharp(retained,{animated:true}).raw().toBuffer())).toBe(true);await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');expect(ledger()).toEqual(awards);await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('retained-five-star-card.png')});
  34 |   second=await browser.newContext({baseURL:origin,...(process.env.UNIT2122_BROWSER==='webkit'?mobileProfile:{})});const other=await second.newPage();await signIn(other,account,base);await other.goto(base+'unit21-22/#learn/certificate');await ready(other);await expect(other.locator('#starCount')).toHaveText('5');await expect(other.locator('#certificateDate')).toHaveText(date);await expect(other.locator('#certificateName')).toHaveText('小禾');
  35 |   const after=await readLearning(other);await fs.writeFile(info.outputPath('after45-progress.json'),JSON.stringify(after));expect(after.records).toEqual(before.records);
> 36 |   for(const id of Object.keys(old.ANSWERS)){await other.goto(base+'unit21-22/#learn/'+id);await ready(other);await expect(other.locator('.stage-'+id+' .completion-number')).toHaveText([String(old.ANSWERS[id].length),String(old.ANSWERS[id].length),'0']);const key='unit2122-'+id+'-practice/five-zones-v1';expect(after.groups[key].runId).toBe(before.groups[key].runId);expect(after.groups[key].states).toEqual(before.groups[key].states);}
     |                                                                                                                                                                              ^ Error: expect(locator).toHaveText(expected) failed
  37 |   await other.goto(base+'unit21-22/#learn/grammar');const room=other.locator('.stage-grammar');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await fresh.select(room,'I');await room.getByRole('button',{name:'检查答案',exact:true}).click();await other.reload();await ready(other);await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(other.locator('#starCount')).toHaveText('5');expect(ledger()).toEqual(awards);
  38 |   if(chain){for(const tab of [p,other]){await tab.goto(base+'unit21-22/#learn/certificate');await ready(tab);await tab.locator('.legacy-learning>summary').click();await expect(tab.locator('.legacy-issued-date')).toHaveAttribute('data-issued-at',oldIssuedAt);await tab.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(tab.locator('#legacyCertificateDate')).toHaveText(oldDate);await expect(tab.locator('#legacyCertificateName')).toHaveText('小禾');await tab.keyboard.press('Escape');}await p.locator('.legacy-learning').screenshot({path:info.outputPath('retained-15-star-history.png')});}
  39 |  }finally{await first?.close();await second?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});if(!path.resolve(temporary).startsWith(path.join(os.tmpdir(),'canran-u2122-review-')))throw Error('Unexpected test cleanup path');await fs.rm(temporary,{recursive:true,force:true});}
  40 | });
  41 | 
```