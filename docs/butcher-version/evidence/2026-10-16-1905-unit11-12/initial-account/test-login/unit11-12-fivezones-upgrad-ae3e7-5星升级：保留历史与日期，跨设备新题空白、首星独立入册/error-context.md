# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unit11-12-fivezones-upgrade.spec.js >> 真实旧账号15星升级：保留历史与日期，跨设备新题空白、首星独立入册
- Location: tests\login\unit11-12-fivezones-upgrade.spec.js:10:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#wordPageProgress')
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('#wordPageProgress')

```

```yaml
- region "课程加载":
  - heading "失物招领小侦探" [level=1]
  - status "课程准备状态": 课程未能打开，再试一次。
  - progressbar "课程准备进度"
  - paragraph: 学习记录会保留。错误编号：L06
  - button "再试一次"
  - link "返回课程":
    - /url: /lesson/
```

# Test source

```ts
  1  | 'use strict';
  2  | const {test,expect}=require('@playwright/test');
  3  | const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
  4  | const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
  5  | const {adminLogin,createStudent,signIn}=require('./helpers');
  6  | const {activity}=require('../support/unit1112-fivezones');
  7  | async function linkOrCopy(source,target){const stat=await fs.stat(source);if(stat.isDirectory())await fs.symlink(source,target,process.platform==='win32'?'junction':'dir');else await fs.copyFile(source,target);}
  8  | 
  9  | test.use({actionTimeout:10000,...(process.env.UNIT1112_BROWSER==='webkit'?{...require('@playwright/test').devices['iPhone 13'],browserName:'webkit'}:{})});
  10 | test('真实旧账号15星升级：保留历史与日期，跨设备新题空白、首星独立入册',async({browser},info)=>{
  11 |  test.setTimeout(180000);
  12 |  const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-u1112-upgrade-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
  13 |  const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1),ports=require('../support/login-test-ports'),origin=ports.origin(4267);
  14 |  let server,first,second;
  15 |  try{
  16 |   // A real predecessor application and database, not injected completion JSON.
  17 |   await fs.mkdir(oldRoot);for(const entry of await fs.readdir(root,{withFileTypes:true})){if(['.git','unit11-12'].includes(entry.name))continue;if(/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const name of await fs.readdir(path.join(root,entry.name)))await linkOrCopy(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));}else await linkOrCopy(path.join(root,entry.name),path.join(oldRoot,entry.name));}
  18 |   await fs.mkdir(path.join(oldRoot,'unit11-12'));for(const name of await fs.readdir(path.join(root,'unit11-12'))){if(['index.html','content.js','unit.js','unit.css','scene.js'].includes(name))await fs.copyFile(path.join(root,'tests/fixtures/unit11-12-before-fivezones',name),path.join(oldRoot,'unit11-12',name));else await linkOrCopy(path.join(root,'unit11-12',name),path.join(oldRoot,'unit11-12',name));}
  19 |   // The former unit depended on the full Lesson49 definition, whereas current
  20 |   // protected units receive only feedback sounds. Freeze that old dependency.
  21 |   await fs.copyFile(path.join(root,'core/course-catalog.js'),path.join(oldRoot,'unit11-12/legacy-catalog.js'));
  22 |   const html=path.join(oldRoot,'unit11-12/index.html');await fs.writeFile(html,(await fs.readFile(html,'utf8')).replaceAll('/tests/fixtures/unit11-12-before-fivezones/','/unit11-12/').replace('/core/course-catalog.js','/unit11-12/legacy-catalog.js'));
  23 |   const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
  24 |   const start=async legacy=>{server=await createApp({root:legacy?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4267),'127.0.0.1',resolve));};
  25 |   await start(true);first=await browser.newContext({baseURL:origin});const p=await first.newPage();
  26 |   await adminLogin(p,base);const account=await createStudent(p,'采访升级验收班','小禾',[/Lesson 11–12/]);await signIn(p,account,base);
  27 |   const prepareStarted=Date.now();await p.goto(base+'unit11-12/#learn/words');await expect(p.locator('.unit-word').first()).toBeVisible({timeout:30000});info.annotations.push({type:'old-course-ready',description:String(Date.now()-prepareStarted)+'ms; no old answers or certificate injected'});
  28 |   await require('../support/unit11-12-flow').completeUnit1112(p,prefix);await p.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await p.getByRole('button',{name:'领取单元证书',exact:true}).click();
  29 |   const date=(await p.locator('#certificateDate').innerText()).match(/\d+/g);await p.keyboard.press('Escape');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  30 |   await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;await start(false);
> 31 |   await p.goto(base+'unit11-12/?course-retry=1#learn/certificate');await expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(p.locator('#starCount')).toHaveText('0');const history=p.locator('.legacy-learning');await history.locator('summary').first().click();await expect(history).toContainText('15 / 15');await expect(history.locator('.legacy-name')).toContainText('小禾');expect((await history.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date);
     |                                                                                                                 ^ Error: expect(locator).toBeVisible() failed
  32 |   await history.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(p.locator('#legacyCertificateName')).toHaveText('小禾');expect((await p.locator('#legacyCertificateDate').innerText()).match(/\d+/g)).toEqual(date);await p.keyboard.press('Escape');
  33 |   await history.screenshot({path:info.outputPath('retained-history.png')});
  34 |   second=await browser.newContext({baseURL:origin});const other=await second.newPage();await signIn(other,account,base);await other.goto(base+'unit11-12/#learn/certificate');await expect(other.locator('#wordPageProgress')).toBeVisible({timeout:30000});await other.locator('.legacy-learning summary').first().click();await expect(other.locator('.legacy-learning')).toContainText('15 / 15');expect((await other.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date);
  35 |   await other.goto(base+'unit11-12/#learn/roles');await expect(other.locator('.stage-roles .progress-copy')).toHaveText('第 3 / 4 题');await expect(other.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(other.locator('#starCount')).toHaveText('0');
  36 |   await other.goto(base+'unit11-12/#learn/listen');await other.locator('.stage-listen').getByRole('button',{name:'再练一轮',exact:true}).click();await activity(other,'listen',{base:prefix,keepAward:true});const reward=other.getByRole('dialog',{name:/纪念卡结算/});await expect(reward.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();await reward.press('Escape');await expect(other.locator('#starCount')).toHaveText('1');await expect(other.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await other.getByRole('link',{name:'我的纪念册',exact:true}).click();await expect(other.getByRole('button',{name:'放大 Lesson 11–12 归还物品小能手',exact:true}).locator('.certificate')).toHaveAttribute('data-stars','1');
  37 |   await p.reload();await expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(p.locator('#starCount')).toHaveText('1');await p.locator('.legacy-learning summary').first().click();await expect(p.locator('.legacy-learning')).toContainText('15 / 15');expect((await p.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date);
  38 |  }finally{await first?.close();await second?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});if(!path.resolve(temporary).startsWith(path.join(os.tmpdir(),'canran-u1112-upgrade-')))throw new Error('Unexpected test cleanup path');await fs.rm(temporary,{recursive:true,force:true});}
  39 | });
  40 | 
```