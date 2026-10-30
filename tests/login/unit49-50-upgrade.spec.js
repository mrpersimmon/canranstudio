'use strict';
// Frozen paper certificates used the learner's local date. Generate the
// historical original in Shanghai; compare its current copy on a UTC device.
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
const {adminLogin,createStudent,signIn}=require('./helpers');
const {activity}=require('../support/unit4950');
test.use({actionTimeout:10000,...(process.env.UNIT49_BROWSER==='webkit'?{...require('@playwright/test').devices['iPhone 13'],browserName:'webkit'}:{})});
test('真实旧账号15星升级：保留历史与日期，跨设备新题空白、首星独立入册',async({browser},info)=>{
 test.setTimeout(180000);
 const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-u4950-upgrade-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
 const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1),ports=require('../support/login-test-ports'),origin=ports.origin(4261);
 let server,first,second;
 try{
  // A real predecessor application and database, not injected completion JSON.
  await fs.mkdir(oldRoot);for(const entry of await fs.readdir(root,{withFileTypes:true})){if(['.git','unit49-50'].includes(entry.name))continue;if(/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const name of await fs.readdir(path.join(root,entry.name)))await fs.symlink(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));}else await fs.symlink(path.join(root,entry.name),path.join(oldRoot,entry.name));}
  await fs.mkdir(path.join(oldRoot,'unit49-50'));for(const name of await fs.readdir(path.join(root,'unit49-50'))){if(['index.html','content.js','unit.js'].includes(name))await fs.copyFile(path.join(root,'tests/fixtures/unit49-50-before-fivezones',name),path.join(oldRoot,'unit49-50',name));else await fs.symlink(path.join(root,'unit49-50',name),path.join(oldRoot,'unit49-50',name));}
  // The former unit depended on the full Lesson49 definition, whereas current
  // protected units receive only feedback sounds. Freeze that old dependency.
  await fs.copyFile(path.join(root,'core/course-catalog.js'),path.join(oldRoot,'unit49-50/legacy-catalog.js'));
  const html=path.join(oldRoot,'unit49-50/index.html');await fs.writeFile(html,(await fs.readFile(html,'utf8')).replaceAll('/tests/fixtures/unit49-50-before-fivezones/','/unit49-50/').replace('/core/course-catalog.js','/unit49-50/legacy-catalog.js'));
  const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
  const start=async legacy=>{server=await createApp({root:legacy?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4261),'127.0.0.1',resolve));};
  await start(true);first=await browser.newContext({baseURL:origin,timezoneId:'Asia/Shanghai'});const p=await first.newPage();
  await adminLogin(p,base);const account=await createStudent(p,'采购升级验收班','小禾',[/Lesson 49–50/]);await signIn(p,account,base);
  await require('../support/unit49-50-flow').completeUnit(p,{basePath:base});await p.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await p.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const date=(await p.locator('#certificateDate').innerText()).match(/\d+/g);await p.keyboard.press('Escape');await expect(p.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;await start(false);
  await p.goto(base+'unit49-50/?course-retry=1#learn/certificate');await expect(p.locator('#starCount')).toHaveText('0');const history=p.locator('.legacy-learning');await history.locator('summary').click();await expect(history).toContainText('15 / 15');await expect(history.locator('.legacy-name')).toContainText('小禾');expect((await history.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date);
  await history.screenshot({path:info.outputPath('retained-history.png')});
  second=await browser.newContext({baseURL:origin,timezoneId:'UTC'});const other=await second.newPage();await signIn(other,account,base);await other.goto(base+'unit49-50/#learn/certificate');await other.locator('.legacy-learning summary').click();await expect(other.locator('.legacy-learning')).toContainText('15 / 15');expect((await other.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date);
  await other.goto(base+'unit49-50/#learn/roles');await expect(other.locator('.stage-roles .progress-copy')).toHaveText('第 1 / 6 题');await expect(other.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(other.locator('#starCount')).toHaveText('0');
  await activity(other,'listen',{base:prefix,keepAward:true});const reward=other.getByRole('dialog',{name:/纪念卡结算/});await expect(reward.getByRole('group',{name:'已获得 1 / 5 颗星',exact:true})).toBeVisible();await expect(reward).not.toHaveAttribute('data-dismissible','false');await reward.press('Escape');await expect(other.locator('#starCount')).toHaveText('1');await expect(other.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await other.getByRole('link',{name:'我的纪念册',exact:true}).click();await expect(other.getByRole('button',{name:'查看并保存纪念卡：Lesson 49–50 晚餐采购小达人',exact:true}).locator('.certificate')).toHaveAttribute('data-stars','1');
  await p.reload();await expect(p.locator('#starCount')).toHaveText('1');await p.locator('.legacy-learning summary').click();await expect(p.locator('.legacy-learning')).toContainText('15 / 15');expect((await p.locator('.legacy-issued-date').innerText()).match(/\d+/g)).toEqual(date);
 }finally{await first?.close();await second?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});await fs.rm(temporary,{recursive:true,force:true});}
});
