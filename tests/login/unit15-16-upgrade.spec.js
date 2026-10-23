'use strict';
// Frozen paper certificates used the learner's local date. Generate the
// historical original in Shanghai; compare its current copy on a UTC device.
const{test,expect}=require('@playwright/test');
const{adminLogin,createStudent,signIn}=require('./helpers');
const{finishExamFrom}=require('../support/unit15-16-exam');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');

async function linkOrCopy(source,target){const stat=await fs.stat(source);if(stat.isDirectory())await fs.symlink(source,target,process.platform==='win32'?'junction':'dir');else await fs.copyFile(source,target);}

for(const fixture of ['classroom'])test(`15–16 ${fixture} 旧25题先升31题再升五星，原两题和证书日期保留`,async({browser})=>{
 test.setTimeout(180000);
 const{createApp}=require('../../server/app'),{openStore}=require('../../server/store');
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-unit1516-upgrade-')),oldRoot=path.join(directory,'old'),dataDir=path.join(directory,'data');
 const root=path.resolve(__dirname,'../..'),origin=require('../support/login-test-ports').origin(4199);let server,first,second,third;
 const start=async source=>{server=await createApp({root:source,dataDir,origin,basePath:'/'});await new Promise(resolve=>server.listen(require('../support/login-test-ports').port(4199),'127.0.0.1',resolve));};
 try{
  await fs.mkdir(oldRoot);
  for(const entry of await fs.readdir(root,{withFileTypes:true})){
   if(entry.name.startsWith('.')||entry.name==='unit15-16')continue;
   if(entry.isDirectory()&&/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const name of await fs.readdir(path.join(root,entry.name)))await linkOrCopy(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));}
   else await linkOrCopy(path.join(root,entry.name),path.join(oldRoot,entry.name));
  }
  await fs.mkdir(path.join(oldRoot,'unit15-16'));
  const legacyRoot=path.join(root,`tests/fixtures/unit15-16-${fixture}-before`),frozen=['index.html','content.js','unit.js','unit.css','scene.js'];
  for(const name of await fs.readdir(path.join(root,'unit15-16'))){
   if(frozen.includes(name)){
    try{await fs.copyFile(path.join(legacyRoot,name),path.join(oldRoot,'unit15-16',name));}catch(error){if(error.code!=='ENOENT')throw error;}
   }else await linkOrCopy(path.join(root,'unit15-16',name),path.join(oldRoot,'unit15-16',name));
  }
  const prepareLegacyCatalog=async()=>{await fs.copyFile(path.join(root,'core/course-catalog.js'),path.join(oldRoot,'unit15-16/legacy-catalog.js'));const html=path.join(oldRoot,'unit15-16/index.html');await fs.writeFile(html,(await fs.readFile(html,'utf8')).replace(/\/tests\/fixtures\/unit15-16-[^/]+\//g,'/unit15-16/').replace('/core/course-catalog.js','/unit15-16/legacy-catalog.js'));};await prepareLegacyCatalog();
  const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();await start(oldRoot);
  first=await browser.newContext({baseURL:origin,timezoneId:'Asia/Shanghai'});const old=await first.newPage();await adminLogin(old,'/');const account=await createStudent(old,'出行升级验收','课堂体验',[/Lesson 15–16 /]);await signIn(old,account,'/');
  await require(`../fixtures/unit15-16-${fixture}-before/flow`).completeUnit1516(old);await old.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('出行小侦探');await old.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await old.locator('#certificateDate').innerText();await old.keyboard.press('Escape');await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await first.close();first=null;await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;for(const name of frozen)await fs.copyFile(path.join(root,'tests/fixtures/unit15-16-before-fivezones',name),path.join(oldRoot,'unit15-16',name));await prepareLegacyCatalog();await start(oldRoot);
  second=await browser.newContext({baseURL:origin,timezoneId:'Asia/Shanghai'});const current=await second.newPage();await signIn(current,account,'/');await expect(current.locator('.course')).toContainText('4 / 15');await current.goto('/unit15-16/#learn/certificate');await expect(current.locator('#starCount')).toHaveText('4');await expect(current.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('出行小侦探');await expect(current.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  for(const id of ['listen', 'roles', 'reply'])await require('../support/units1-30-tasks').activity(current,'15-16',id);
  for(const id of ['roles','reply','forms','trans']){await current.goto('/unit15-16/#learn/'+id);await expect(current.locator('.stage-'+id).getByRole('group',{name:'完成后的操作',exact:true})).toBeVisible();}
  await current.goto('/unit15-16/#learn/exam');const room=current.locator('.stage-exam');await expect(room).toContainText('第 3 / 11 题');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','2');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await finishExamFrom(current,2);await room.getByRole('button',{name:'下一站：我的单元证书',exact:true}).click();await expect(current.locator('#starCount')).toHaveText('15');await current.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(current.locator('#certificateDate')).toHaveText(date);await current.keyboard.press('Escape');
  await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  third=await browser.newContext({baseURL:origin,timezoneId:'Asia/Shanghai'});const restored=await third.newPage();await signIn(restored,account,'/');await expect(restored.locator('.course')).toContainText('15 / 15');await restored.goto('/unit15-16/#learn/exam');await expect(restored.locator('.stage-exam')).toContainText('首次独立答对 11 / 11');await restored.goto('/unit15-16/#learn/certificate');await expect(restored.locator('#starCount')).toHaveText('15');await expect(restored.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('出行小侦探');
  await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;await start(root);await restored.goto('/unit15-16/?course-retry=1#learn/certificate');await expect(restored.locator('#wordPageProgress')).toBeVisible({timeout:30000});await expect(restored.locator('#starCount')).toHaveText('0');await restored.locator('.legacy-learning summary').first().click();await expect(restored.locator('.legacy-learning')).toContainText('15 / 15');await restored.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(restored.locator('#legacyCertificateName')).toHaveText('出行小侦探');await expect(restored.locator('#legacyCertificateDate')).toHaveText(date);

  // Only the current renderer is opened on this independent UTC device.
  await first?.close();first=await browser.newContext({baseURL:origin,timezoneId:'UTC'});const crossZone=await first.newPage();await signIn(crossZone,account,'/');await crossZone.goto('/unit15-16/#learn/certificate');await expect(crossZone.locator('#wordPageProgress')).toBeVisible({timeout:30000});await crossZone.locator('.legacy-learning summary').first().click();await crossZone.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(crossZone.locator('#legacyCertificateDate')).toHaveText(date);
 }finally{await first?.close();await second?.close();await third?.close();if(server)await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});if(!path.resolve(directory).startsWith(path.join(os.tmpdir(),'canran-unit1516-upgrade-')))throw new Error('Unexpected cleanup path');await fs.rm(directory,{recursive:true,force:true});}
});
