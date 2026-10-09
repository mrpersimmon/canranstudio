'use strict';
const{test,expect}=require('@playwright/test');
const{adminLogin,createStudent,signIn}=require('./helpers');
const{CASES,story,activity,answers}=require('../support/units1-30-tasks');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
for(const pair of Object.keys(CASES).filter(x=>CASES[x].changes.length))test(`${pair} 账号在三台设备间升级题目，保留历史并独立完成新任务`,async({browser})=>{
 test.setTimeout(150000);
 const{createApp}=require('../../server/app'),{openStore}=require('../../server/store');
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-tasks-v4-account-'));
 const root=path.resolve(__dirname,'../..'),oldRoot=path.join(directory,'old'),dataDir=path.join(directory,'data'),unit='unit'+pair;
 const port=Number(process.env.TASKS_UPGRADE_PORT||4223),origin='http://127.0.0.1:'+port;let server;const contexts=[];
 const start=async source=>{server=await createApp({root:source,dataDir,origin,basePath:'/'});await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));};
 const device=async()=>{const c=await browser.newContext({baseURL:origin});contexts.push(c);const page=await c.newPage();
  if(pair==='1-2')await page.addInitScript(()=>{window.Audio=class extends EventTarget{play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});
  return page;
 };
 try{
  await fs.mkdir(oldRoot);
  for(const entry of await fs.readdir(root,{withFileTypes:true})){
   if(entry.name.startsWith('.'))continue;
   if(entry.isDirectory()&&/^unit\d+-\d+$/.test(entry.name)){
    await fs.mkdir(path.join(oldRoot,entry.name));
    for(const name of await fs.readdir(path.join(root,entry.name))){
     if(entry.name===unit&&['index.html','content.js','unit.js','unit.css'].includes(name))
      await fs.copyFile(path.join(root,'tests/fixtures/units1-30-tasks-before',unit,name),path.join(oldRoot,unit,name));
     else await fs.symlink(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));
    }
   }else await fs.symlink(path.join(root,entry.name),path.join(oldRoot,entry.name));
  }
  const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();await start(oldRoot);
  const old=await device();await adminLogin(old,'/');const account=await createStudent(old,'题目升级验收','测试小伙伴',[new RegExp('Lesson '+pair.replace('-','–')+' ')]);
  await signIn(old,account,'/');await story(old,pair);for(const group of Object.keys(CASES[pair].old))await activity(old,pair,group,{old:true});
  await old.goto('/'+unit+'/#learn/certificate');await expect(old.locator('#starCount')).toHaveText('15');
  await old.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('认真小伙伴');await old.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const date=await old.locator('#certificateDate').innerText();await old.keyboard.press('Escape');await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await contexts[0].close();await new Promise(resolve=>server.close(resolve));server=null;await start(root);
  const current=await device();await signIn(current,account,'/');await current.goto('/'+unit+'/#learn/certificate');
  if(pair==='1-2'){
   await expect(current.locator('#starCount')).toHaveText('0');
   await expect(current.locator('#certificateName')).toHaveText('测试小伙伴');
   await expect(current.locator('#certificateDate')).toBeHidden();
   const flow=require('../support/thirteen-types-flow');
   await flow.story(current,pair);
   for(const id of Object.keys(flow.ANSWERS[pair]))await flow.activity(current,pair,id);
   // Start a new complete round after carrying forward compatible historical work.
   for(const id of Object.keys(flow.ANSWERS[pair])){
    await current.goto('/'+unit+'/#learn/'+id);
    await current.locator('.stage-'+id).getByRole('button',{name:'再练一轮',exact:true}).click();
    await flow.activity(current,pair,id);
   }
   await current.goto('/'+unit+'/#learn/certificate');
   await expect(current.locator('#starCount')).toHaveText('5');
   await expect(current.locator('#certificateDate')).toBeVisible();
   const fullDate=await current.locator('#certificateDate').innerText();
   await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
   const restored=await device();await signIn(restored,account,'/');
   await expect(restored.locator('.course')).toContainText('5 / 5');
   await restored.goto('/'+unit+'/#learn/certificate');
   await expect(restored.locator('#certificateName')).toHaveText('测试小伙伴');
   await expect(restored.locator('#starCount')).toHaveText('5');
   await expect(restored.locator('#certificateDate')).toHaveText(fullDate);
   return;
  }
  await expect(current.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await expect(current.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('认真小伙伴');
  if(['1-2','25-26'].includes(pair)){
   await require('../support/thirteen-types-flow').complete(current,pair);
  }else for(const group of Object.keys(CASES[pair].old)){
   const change=CASES[pair].changes.find(x=>x.group===group);
   await current.goto('/'+unit+'/#learn/'+group);const room=current.locator('.stage-'+group);
   if(change){
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(change.answers.findIndex(q=>q.fresh)));
    await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
    await activity(current,pair,group);
   }else await expect(room.locator('.practice-finish')).toBeVisible();
  }
  await current.goto('/'+unit+'/#learn/certificate');await expect(current.locator('#starCount')).toHaveText('15');
  await current.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(current.locator('#certificateDate')).toHaveText(date);await current.keyboard.press('Escape');
  await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  const restored=await device();await signIn(restored,account,'/');await expect(restored.locator('.course')).toContainText('15 / 15');
  await restored.goto('/'+unit+'/#learn/exam');const count=answers(pair,'exam').length;await expect(restored.locator('.stage-exam')).toContainText(`首次独立答对 ${count} / ${count}`);
  await restored.goto('/'+unit+'/#learn/certificate');await expect(restored.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('认真小伙伴');await expect(restored.locator('#starCount')).toHaveText('15');
 }finally{for(const c of contexts)await c.close();if(server)await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});}
});
