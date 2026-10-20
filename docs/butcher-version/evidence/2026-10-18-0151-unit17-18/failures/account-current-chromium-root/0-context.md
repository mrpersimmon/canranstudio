# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit17-18-teaching-review.spec.js >> 现有62题五星同库更新：有效轮次、原卡全部GIF帧、姓名日期与跨设备回读不变
- Location: tests\login\unit17-18-teaching-review.spec.js:12:1

# Error details

```
TypeError: Cannot read properties of null (reading 'records')
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
  4  | const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
  5  | const {adminLogin,createStudent,signIn}=require('./helpers');
  6  | const {activity,story,ANSWERS}=require('../support/unit1718-fivezones');
  7  | const {FILES,readLearning}=require('../support/unit1718-teaching-review');
  8  | const {defaultBrowserType,...mobileProfile}=require('@playwright/test').devices['iPhone 13'];
  9  | test.use({actionTimeout:10000,...(process.env.UNIT1718_BROWSER==='webkit'?{...mobileProfile,browserName:'webkit'}:{})});
  10 | async function linkOrCopy(a,b){if((await fs.stat(a)).isDirectory())await fs.symlink(a,b,process.platform==='win32'?'junction':'dir');else await fs.copyFile(a,b);}
  11 | 
  12 | test('现有62题五星同库更新：有效轮次、原卡全部GIF帧、姓名日期与跨设备回读不变',async({browser},info)=>{
  13 |  test.setTimeout(240000);
  14 |  const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-u1718-teaching-review-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
  15 |  const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1),ports=require('../support/login-test-ports'),origin=ports.origin(4271);
  16 |  let server,first,second;
  17 |  const ledger=()=>{const {DatabaseSync}=require('node:sqlite'),db=new DatabaseSync(path.join(dataDir,'learning.sqlite'),{readOnly:true});try{return db.prepare('SELECT edition,value FROM unit_awards WHERE course=? ORDER BY edition').all('unit17-18');}finally{db.close();}};
  18 |  const ready=async p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
  19 |  try{
  20 |   // Construct the real prior presentation, including the Worker course package.
  21 |   // Unchanged assessments and the 15-star protection are shared deliberately.
  22 |   await fs.mkdir(oldRoot);
  23 |   for(const entry of await fs.readdir(root,{withFileTypes:true})){
  24 |    if(['.git','unit17-18'].includes(entry.name))continue;
  25 |    if(/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const n of await fs.readdir(path.join(root,entry.name)))await linkOrCopy(path.join(root,entry.name,n),path.join(oldRoot,entry.name,n));}
  26 |    else await linkOrCopy(path.join(root,entry.name),path.join(oldRoot,entry.name));
  27 |   }
  28 |   await fs.mkdir(path.join(oldRoot,'unit17-18'));
  29 |   for(const n of await fs.readdir(path.join(root,'unit17-18')))await linkOrCopy(path.join(root,FILES.includes(n)?'tests/fixtures/unit17-18-before-teaching-review':'unit17-18',n),path.join(oldRoot,'unit17-18',n));
  30 |   const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
  31 |   const stop=async()=>{await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;};
  32 |   const start=async previous=>{server=await createApp({root:previous?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4271),'127.0.0.1',resolve));};
  33 |   await start(true);first=await browser.newContext({baseURL:origin,...(process.env.UNIT1718_BROWSER==='webkit'?mobileProfile:{})});const p=await first.newPage();
  34 |   await adminLogin(p,base);const account=await createStudent(p,'现有五星复核班','小禾',[/Lesson 17–18/]);await signIn(p,account,base);await story(p,prefix);
  35 |   for(const id of Object.keys(ANSWERS))await activity(p,id,{base:prefix});await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
> 36 |   await p.goto(base+'unit17-18/#learn/certificate');await ready(p);const date=await p.locator('#certificateDate').innerText(),before=await readLearning(p),awards=ledger();expect(awards).toHaveLength(1);expect(awards[0].edition).toBe('office-five-zones-v1');expect(Object.keys(before.records)).toHaveLength(62);expect(Boolean(before.records['u1718-tasks-v4-plural-labels'].revealed)).toBe(false);
     |                                                                                                                                                                                                                                                                                            ^ TypeError: Cannot read properties of null (reading 'records')
  37 |   const original=info.outputPath('original-five-star.gif');let download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(original);
  38 |   await stop();await start(false);await p.goto(base+'unit17-18/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText('5');await expect(p.locator('#certificateDate')).toHaveText(date);await expect(p.locator('#certificateName')).toHaveText('小禾');
  39 |   const retained=info.outputPath('retained-five-star.gif');download=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs(retained);const sharp=require('sharp');expect((await sharp(original,{animated:true}).raw().toBuffer()).equals(await sharp(retained,{animated:true}).raw().toBuffer())).toBe(true);expect(ledger()).toEqual(awards);
  40 |   await p.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('retained-five-star-card.png')});
  41 |   second=await browser.newContext({baseURL:origin,...(process.env.UNIT1718_BROWSER==='webkit'?mobileProfile:{})});const other=await second.newPage();await signIn(other,account,base);
  42 |   await other.goto(base+'unit17-18/#learn/certificate');await ready(other);await expect(other.locator('#starCount')).toHaveText('5');await expect(other.locator('#certificateDate')).toHaveText(date);await expect(other.locator('#certificateName')).toHaveText('小禾');
  43 |   const after=await readLearning(other);expect(after.records).toEqual(before.records);
  44 |   for(const id of Object.keys(ANSWERS)){
  45 |    await other.goto(base+'unit17-18/#learn/'+id);await ready(other);const room=other.locator('.stage-'+id);await expect(room.locator('.completion-number')).toHaveText([String(ANSWERS[id].length),String(ANSWERS[id].length),'0']);
  46 |    const key='unit1718-'+id+'-practice/five-zones-v1';expect(after.groups[key].runId).toBe(before.groups[key].runId);expect(after.groups[key].states).toEqual(before.groups[key].states);
  47 |   }
  48 |   await other.goto(base+'unit17-18/#learn/grammar');const room=other.locator('.stage-grammar');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await room.getByRole('button',{name:'She is a nurse.',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await other.reload();await ready(other);await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(other.locator('#starCount')).toHaveText('5');expect(ledger()).toEqual(awards);
  49 |  }finally{await first?.close();await second?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});if(!path.resolve(temporary).startsWith(path.join(os.tmpdir(),'canran-u1718-teaching-review-')))throw Error('Unexpected test cleanup path');await fs.rm(temporary,{recursive:true,force:true});}
  50 | });
  51 | 
```