'use strict';
const{test,expect}=require('@playwright/test');
const{adminLogin,createStudent,signIn}=require('./helpers');
const{finishExamFrom}=require('../support/unit11-12-exam');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),http=require('node:http');

// Keep the browser-produced payload intact, but split one UTF-8 character
// across network writes. All learning and result assertions still use the UI.
async function fragmentedUploads(page){
 let count=0;
 await page.route('**/api/progress',async route=>{
  const request=route.request(),bytes=request.postDataBuffer(),marker=Buffer.from('perhaps时刻');
  // The last occurrence belongs to the current completion proof, not its predecessor.
  const at=bytes.lastIndexOf(marker);
  if(at<0)return route.continue();
  const split=at+Buffer.byteLength('perhaps')+1;count++;
  const response=await new Promise((resolve,reject)=>{
   const outgoing=http.request(request.url(),{method:request.method(),headers:request.headers()},incoming=>{
    const chunks=[];incoming.on('data',chunk=>chunks.push(chunk));incoming.on('end',()=>resolve({status:incoming.statusCode,headers:incoming.headers,body:Buffer.concat(chunks)}));incoming.on('error',reject);
   });
   outgoing.on('error',reject);outgoing.write(bytes.subarray(0,split));setTimeout(()=>outgoing.end(bytes.subarray(split)),20);
  });
  await route.fulfill(response);
 });
 return()=>count;
}

for(const fixture of ['classroom','short-exam'])test(`11–12 ${fixture} 旧服务器升级换设备，保留有效三题，补完后恢复15星和原证书`,async({browser})=>{
 test.setTimeout(120000);
 const{createApp}=require('../../server/app'),{openStore}=require('../../server/store');
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-unit1112-upgrade-')),oldRoot=path.join(directory,'old'),dataDir=path.join(directory,'data');
 const root=path.resolve(__dirname,'../..'),origin='http://127.0.0.1:4199';let server,first,second,third;
 const start=async source=>{server=await createApp({root:source,dataDir,origin,basePath:'/'});await new Promise(resolve=>server.listen(4199,'127.0.0.1',resolve));};
 try{
  await fs.mkdir(oldRoot);
  for(const entry of await fs.readdir(root,{withFileTypes:true})){
   if(entry.name.startsWith('.')||entry.name==='unit11-12')continue;
   if(entry.isDirectory()&&/^unit\d+-\d+$/.test(entry.name)){await fs.mkdir(path.join(oldRoot,entry.name));for(const name of await fs.readdir(path.join(root,entry.name)))await fs.symlink(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));}
   else await fs.symlink(path.join(root,entry.name),path.join(oldRoot,entry.name));
  }
  await fs.mkdir(path.join(oldRoot,'unit11-12'));
  const legacyRoot=path.join(root,`tests/fixtures/unit11-12-${fixture}-before`),frozen=['index.html','content.js','unit.js','unit.css','scene.js'];
  for(const name of await fs.readdir(path.join(root,'unit11-12'))){
   if(frozen.includes(name)){
    try{await fs.copyFile(path.join(legacyRoot,name),path.join(oldRoot,'unit11-12',name));}catch(error){if(error.code!=='ENOENT')throw error;}
   }else await fs.symlink(path.join(root,'unit11-12',name),path.join(oldRoot,'unit11-12',name));
  }
  const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();await start(oldRoot);
  first=await browser.newContext({baseURL:origin});const old=await first.newPage();await adminLogin(old,'/');const account=await createStudent(old,'认领升级验收','课堂体验',[/Lesson 11–12 /]);await signIn(old,account,'/');
  await require(`../fixtures/unit11-12-${fixture}-before/flow`).completeUnit1112(old);await old.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('认领小侦探');await old.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await old.locator('#certificateDate').innerText();await old.keyboard.press('Escape');await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await first.close();first=null;await new Promise(resolve=>server.close(resolve));server=null;await start(root);
  second=await browser.newContext({baseURL:origin});const current=await second.newPage();await signIn(current,account,'/');await expect(current.locator('.course')).toContainText('12 / 15');await current.goto('/unit11-12/#learn/certificate');await expect(current.locator('#starCount')).toHaveText('12');await expect(current.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('认领小侦探');await expect(current.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  for(const id of ['roles','owner','trans']){await current.goto('/unit11-12/#learn/'+id);await expect(current.locator('.stage-'+id).getByRole('group',{name:'完成后的操作',exact:true})).toBeVisible();}
  await current.goto('/unit11-12/#learn/exam');const room=current.locator('.stage-exam');await expect(room).toContainText('第 4 / 10 题');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','3');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  const splitCount=fixture==='short-exam'?await fragmentedUploads(current):null;
  await finishExamFrom(current,3);await room.getByRole('button',{name:'下一站：我的单元证书',exact:true}).click();await expect(current.locator('#starCount')).toHaveText('15');await current.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(current.locator('#certificateDate')).toHaveText(date);await current.keyboard.press('Escape');
  await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');if(splitCount)expect(splitCount()).toBeGreaterThan(0);
  third=await browser.newContext({baseURL:origin});const restored=await third.newPage();await signIn(restored,account,'/');await expect(restored.locator('.course')).toContainText('15 / 15');await restored.goto('/unit11-12/#learn/exam');await expect(restored.locator('.stage-exam')).toContainText('首次独立答对 10 / 10');await restored.goto('/unit11-12/#learn/certificate');await expect(restored.locator('#starCount')).toHaveText('15');await expect(restored.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('认领小侦探');
 }finally{await first?.close();await second?.close();await third?.close();if(server)await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});}
});
