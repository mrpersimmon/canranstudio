'use strict';
const {test,expect,devices}=require('@playwright/test');
const fs=require('fs/promises'),path=require('path'),os=require('os'),sharp=require('sharp');
const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
const {adminLogin,createStudent,signIn}=require('./helpers'),flow=require('../support/thirteen-types-flow'),old25=require('../fixtures/unit1-2-before-awards/flow');
const {defaultBrowserType,...mobile}=devices['iPhone 13'];
const webkit=process.env.UNIT12_REVIEW_BROWSER==='webkit';
test.use({actionTimeout:10000,...(webkit?{...mobile,browserName:'webkit'}:{})});
for(const kind of ['card','certificate'])test(`同库更新与跨设备：原${kind==='card'?'五星全部GIF帧':'25题证书PNG'}和精确日期保留`,async({browser},info)=>{
 test.setTimeout(300000);
 const root=path.resolve(__dirname,'../..'),temp=await fs.mkdtemp(path.join(os.tmpdir(),'canran-unit12-v154-')),oldRoot=path.join(temp,'site'),dataDir=path.join(temp,'accounts');
 const base=process.env.AWARD_TEST_BASE||'/lesson/',prefix=base.slice(0,-1),ports=require('../support/login-test-ports'),origin=ports.origin(4271);let server,first,second;
 const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:lesson:unit1-2:learning:v1')));
 const ready=async p=>expect(p.locator('#wordPageProgress')).toBeVisible({timeout:30000});
 const stop=async()=>{if(server){await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;}};
 const start=async old=>{server=await createApp({root:old?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4271),'127.0.0.1',resolve));};
 try{
  await fs.mkdir(oldRoot);for(const e of await fs.readdir(root,{withFileTypes:true})){if(['.git','unit1-2'].includes(e.name))continue;const a=path.join(root,e.name),b=path.join(oldRoot,e.name);
   // Directory enumeration intentionally ignores symlinked course roots. Keep
   // real unit directories so this fixture exposes the actual 72-course catalog.
   if(/^unit\d+-\d+$/.test(e.name)){await fs.mkdir(b);for(const child of await fs.readdir(a,{withFileTypes:true})){if(child.isDirectory())await fs.symlink(path.join(a,child.name),path.join(b,child.name),process.platform==='win32'?'junction':'dir');else await fs.copyFile(path.join(a,child.name),path.join(b,child.name));}}
   else if(e.isDirectory())await fs.symlink(a,b,process.platform==='win32'?'junction':'dir');else await fs.copyFile(a,b);
  }
  await fs.mkdir(path.join(oldRoot,'unit1-2'));
  for(const e of await fs.readdir(path.join(root,'unit1-2'),{withFileTypes:true})){const a=path.join(root,'unit1-2',e.name),b=path.join(oldRoot,'unit1-2',e.name);if(e.isDirectory())await fs.symlink(a,b,process.platform==='win32'?'junction':'dir');else await fs.copyFile(a,b);}
  const fixture=kind==='card'?'unit1-2-before-v154':'unit1-2-before-awards';
  for(const name of await fs.readdir(path.join(root,'tests/fixtures',fixture)))if(/\.(js|css|html)$/.test(name)&&name!=='flow.js')await fs.copyFile(path.join(root,'tests/fixtures',fixture,name),path.join(oldRoot,'unit1-2',name));
  const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
  await start(true);first=await browser.newContext({baseURL:origin,...(webkit?mobile:{})});const p=await first.newPage();await adminLogin(p,base);const account=await createStudent(p,'历史成果保留验收','小禾',[/Lesson 1–2/]);await signIn(p,account,base);
  if(kind==='card')await flow.complete(p,'1-2',prefix);else{
   // The frozen 2026-10-06 helper assumed a 5-second load. Keep its independent
   // answers; explicitly wait for the historical page's real ready boundary.
   await p.goto(base+'unit1-2/#learn/text');await ready(p);const text=p.locator('.stage-text');await text.getByRole('button',{name:'开始看课文',exact:true}).click();while(await text.getByRole('button',{name:'下一句',exact:true}).isVisible())await text.getByRole('button',{name:'下一句',exact:true}).click();await text.getByRole('button',{name:'完成课文',exact:true}).click();
   for(const[id,answers]of Object.entries(old25.ANSWERS['1-2'])){await p.goto(base+'unit1-2/#learn/'+id);await ready(p);const room=p.locator('.stage-'+id);for(let i=0;i<answers.length;i++){await old25.select(room,answers[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i<answers.length-1?'下一题':id==='exam'?'查看本次记录':'完成这一站',exact:true}).click();}}
   await p.goto(base+'unit1-2/#learn/certificate');await ready(p);await p.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('原证姓名');await p.getByRole('button',{name:'领取单元证书',exact:true}).click();
  }
  await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');const before=await read(p),date=await p.locator('#certificateDate').innerText(),ext=kind==='card'?'gif':'png';
  const beforeFile=info.outputPath('before.'+ext);let download=p.waitForEvent('download');await p.getByRole('button',{name:kind==='card'?'保存动图':'保存图片',exact:true}).click();await(await download).saveAs(beforeFile);
  if(kind==='certificate')await p.keyboard.press('Escape');
  await stop();await start(false);await p.goto(base+'unit1-2/?course-retry=1#learn/certificate');await ready(p);await expect(p.locator('#starCount')).toHaveText(kind==='card'?'5':'0');
  await p.getByText('之前的学习记录与证书',{exact:true}).click();
  if(kind==='certificate'){await p.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(p.locator('#legacyCertificateDate')).toHaveText(date);await expect(p.locator('#legacyCertificateName')).toHaveText('原证姓名');}
  else await expect(p.locator('#certificateDate')).toHaveText(date);
  const afterFile=info.outputPath('after.'+ext);download=p.waitForEvent('download');await p.getByRole('button',{name:kind==='card'?'保存动图':'保存图片',exact:true}).click();await(await download).saveAs(afterFile);
  const opts=kind==='card'?{animated:true}:{};expect((await sharp(beforeFile,opts).raw().toBuffer()).equals(await sharp(afterFile,opts).raw().toBuffer())).toBe(true);
  if(kind==='card'){const meta=await sharp(afterFile,{animated:true}).metadata();expect(meta.pages).toBe(60);}else await p.keyboard.press('Escape');
  await expect(p.locator('#studentSyncStatus')).toHaveText('已同步');
  second=await browser.newContext({baseURL:origin,...(webkit?mobile:{})});const q=await second.newPage();await signIn(q,account,base);await q.goto(base+'unit1-2/#learn/certificate');await ready(q);
  await q.getByText('之前的学习记录与证书',{exact:true}).click();const archive=(await read(q)).activity.unit12HistoryProgress;expect(archive.records).toEqual(before.records);
  if(kind==='certificate'){await expect(q.locator('.legacy-issued-date')).toHaveAttribute('data-issued-at',before.activity.unitCertificateIssuedAt);await q.getByRole('button',{name:'查看旧证书',exact:true}).click();await expect(q.locator('#legacyCertificateName')).toHaveText('原证姓名');await expect(q.locator('#legacyCertificateDate')).toHaveText(date);await q.keyboard.press('Escape');}
  else{
   await expect(q.locator('#certificateDate')).toHaveText(date);const fresh=await read(q);for(const [key,g]of Object.entries(before.groups))if(g.index===g.states.length){expect(fresh.groups[key].runId).toBe(g.runId);expect(fresh.groups[key].states).toEqual(g.states);}
  }
  await flow.activity(q,'1-2','trans',{base:prefix});
  await expect(q.locator('#studentSyncStatus')).toHaveText('已同步');await q.goto(base+'unit1-2/#learn/certificate');await q.reload();await ready(q);
  expect((await read(q)).activity.unit12HistoryProgress.records).toEqual(before.records);
  await fs.writeFile(info.outputPath('preservation.json'),JSON.stringify({kind,engine:webkit?'webkit':'chromium',base,oldRecords:Object.keys(before.records).length,archivedRecords:Object.keys(archive.records).length,exportPixelsIdentical:true,date,issuedAt:before.activity.unitCertificateIssuedAt||null},null,2));
 }catch(error){await fs.writeFile(info.outputPath('primary-error.txt'),error.stack||String(error));throw error;}
 finally{await first?.close();await second?.close();await stop();if(!path.resolve(temp).startsWith(path.join(os.tmpdir(),'canran-unit12-v154-')))throw Error('Invalid cleanup path');try{await fs.rm(temp,{recursive:true,force:true});}catch(error){info.annotations.push({type:'temporary-cleanup',description:temp+' '+error.code});}}
});
