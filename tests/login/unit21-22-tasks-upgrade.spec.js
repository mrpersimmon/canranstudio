'use strict';
const{test,expect}=require('@playwright/test');
const{adminLogin,createStudent,signIn}=require('./helpers');
const{EXAMS,finishExamFrom}=require('../support/units17-30-exam');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');

for(const[pair,answers]of [['21-22',EXAMS['21-22']]])test(`${pair} 新题型跨设备升级保留旧有效题，完成新题再恢复证书`,async({browser})=>{
 const unit='unit'+pair,fixture='tasks';
 test.setTimeout(120000);
 const{createApp}=require('../../server/app'),{openStore}=require('../../server/store');
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-units1730-upgrade-')),oldRoot=path.join(directory,'old'),dataDir=path.join(directory,'data');
 const root=path.resolve(__dirname,'../..'),origin='http://127.0.0.1:4213';let server,first,second,third;
 const start=async source=>{server=await createApp({root:source,dataDir,origin,basePath:'/'});await new Promise(resolve=>server.listen(4213,'127.0.0.1',resolve));};
 try{
  await fs.mkdir(oldRoot);
  for(const entry of await fs.readdir(root,{withFileTypes:true})){
   if(entry.name.startsWith('.')||entry.name===unit)continue;
   if(entry.isDirectory()&&/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const name of await fs.readdir(path.join(root,entry.name)))await fs.symlink(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));}
   else await fs.symlink(path.join(root,entry.name),path.join(oldRoot,entry.name));
  }
  await fs.mkdir(path.join(oldRoot,unit));
  const legacyRoot=path.join(root,`tests/fixtures/${unit}-${fixture}-before`),frozen=['index.html','content.js','unit.js','unit.css'];
  for(const name of await fs.readdir(path.join(root,unit))){
   if(frozen.includes(name)){
    try{await fs.copyFile(path.join(legacyRoot,name),path.join(oldRoot,unit,name));}catch(error){if(error.code!=='ENOENT')throw error;}
   }else await fs.symlink(path.join(root,unit,name),path.join(oldRoot,unit,name));
  }
  const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();await start(oldRoot);
  first=await browser.newContext({baseURL:origin});const old=await first.newPage();await adminLogin(old,'/');const account=await createStudent(old,'出行升级验收','课堂体验',[new RegExp('Lesson '+pair.replace('-','–')+' ')]);await signIn(old,account,'/');
  await require(`../fixtures/${unit}-${fixture}-before/flow`)[`completeUnit${pair.replace('-','')}`](old);await old.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('出行小侦探');await old.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await old.locator('#certificateDate').innerText();await old.keyboard.press('Escape');await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await first.close();first=null;await new Promise(resolve=>server.close(resolve));server=null;await start(root);
  second=await browser.newContext({baseURL:origin});const current=await second.newPage();await signIn(current,account,'/');await expect(current.locator('.course')).toContainText('4 / 15');await current.goto('/' + unit + '/#learn/certificate');await expect(current.locator('#starCount')).toHaveText('4');await expect(current.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('出行小侦探');await expect(current.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  for(const [id,count]of [['listen',6],['roles',0],['observe',2],['exam',0]]){
   await current.goto('/'+unit+'/#learn/'+id);const room=current.locator('.stage-'+id);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(count));await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
   await require('../support/unit21-22-flow').finishRemainingActivity(current,id);
  }
  await current.goto('/'+unit+'/#learn/certificate');await expect(current.locator('#starCount')).toHaveText('15');await current.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(current.locator('#certificateDate')).toHaveText(date);await current.keyboard.press('Escape');
  await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  third=await browser.newContext({baseURL:origin});const restored=await third.newPage();await signIn(restored,account,'/');await expect(restored.locator('.course')).toContainText('15 / 15');await restored.goto('/' + unit + '/#learn/exam');await expect(restored.locator('.stage-exam')).toContainText(`首次独立答对 ${answers.length} / ${answers.length}`);await restored.goto('/' + unit + '/#learn/certificate');await expect(restored.locator('#starCount')).toHaveText('15');await expect(restored.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('出行小侦探');
 }finally{await first?.close();await second?.close();await third?.close();if(server)await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});}
});
