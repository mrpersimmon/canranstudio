'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
const fixture=require('../support/unit49-50-legacy-site'),{adminLogin,createStudent,signIn}=require('./helpers');
const base=process.env.AWARD_TEST_BASE||'/';
test.use({...(process.env.CERTIFICATE_ARCHIVE_BROWSER?{browserName:process.env.CERTIFICATE_ARCHIVE_BROWSER}:{})});

test('真实旧纸证独立归档后原名日期PNG和打印不变，关课仍可查看且不恢复学习进度',async({browser,browserName},info)=>{
 test.setTimeout(180000);
 const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-certificate-archive-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
 const ports=require('../support/login-test-ports'),origin=ports.origin(4288);let server,context;
 const stop=async()=>{if(server){await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;}};
 const start=async old=>{server=await createApp({root:old?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4288),'127.0.0.1',resolve));};
 const png=async(page,name)=>{const waiting=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();await(await waiting).saveAs(info.outputPath(name));return require('sharp')(info.outputPath(name)).raw().toBuffer({resolveWithObject:true});};
 const type=page=>page.locator('.certificate-paper').evaluate(element=>[...element.querySelectorAll('p,h3,.certificate-to,.certificate-badge>span:last-child')].map(node=>{const s=getComputedStyle(node);return {text:node.textContent,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight};}));
 try{
  await fixture.prepare(root,oldRoot);let store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();await start(true);
  context=await browser.newContext({baseURL:origin,timezoneId:'Asia/Shanghai'});const page=await context.newPage();await adminLogin(page,base);
  const account=await createStudent(page,'原件归档验收班','账户原姓名',[/Lesson 49–50/]);await signIn(page,account,base);
  await require('../support/unit49-50-flow').completeUnit(page,{basePath:base});await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小禾');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const name=await page.locator('#certificateName').innerText(),date=await page.locator('#certificateDate').innerText(),original=await png(page,'original-paper.png'),originalType=await type(page);let originalPrintType;
  if(browserName==='chromium'){await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印证书',exact:true}).click();await page.emulateMedia({media:'print'});originalPrintType=await type(page);await page.pdf({path:info.outputPath('original-paper.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));}
  await page.keyboard.press('Escape');await expect(page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await stop();store=openStore(dataDir);const student=store.students().find(row=>row.studentNumber===account.number);
  const report=await store.applySystemUpgrade({backupDirectory:path.join(temporary,'backup'),root});expect(report.archivedCertificates).toBe(1);
  const archive=store.certificateArchives(student.id,'unit49-50')[0],raw=JSON.stringify(archive),generation=store.progress(student.id,'unit49-50').generation;
  expect(archive.name).toBe(name);expect(archive.kind).toBe('legacy-paper');expect(store.progress(student.id,'unit49-50').value).toEqual({});
  store.updateClass(student.classId,'原件归档验收班',[]);store.close();await start(false);
  await page.goto(base+'awards/');await expect(page.getByRole('heading',{name:'已获得的原证书'})).toBeVisible({timeout:30000});
  await expect(page.locator('#historicalCertificates li')).toHaveCount(1);
  await expect(page.locator('#historicalCertificates')).toContainText('15星原版通关证书');
  await page.getByRole('link',{name:'查看原证书',exact:true}).click();const dialog=page.locator('#legacyCertificateDialog');await expect(dialog).toBeVisible({timeout:30000});
  await expect(dialog.locator('#legacyCertificateName')).toHaveText(name);await expect(dialog.locator('#legacyCertificateDate')).toHaveText(date);
  expect(await type(page)).toEqual(originalType);const preserved=await png(page,'archived-paper.png');expect(preserved.info).toEqual(original.info);expect(preserved.data.equals(original.data),'Original paper PNG remains byte-identical after decoding').toBe(true);
  await page.evaluate(()=>{window.archivePrints=0;window.print=()=>window.archivePrints++;});await page.getByRole('button',{name:'打印证书',exact:true}).click();expect(await page.evaluate(()=>window.archivePrints)).toBe(1);
  if(browserName==='chromium'){await page.emulateMedia({media:'print'});expect(await type(page)).toEqual(originalPrintType);await page.pdf({path:info.outputPath('archived-paper.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});}await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  await dialog.locator('.certificate-paper').evaluate(async element=>{await Promise.allSettled(element.getAnimations({subtree:true}).filter(animation=>animation.effect?.getTiming().iterations!==Infinity).map(animation=>animation.finished));});
  await dialog.screenshot({path:info.outputPath('archived-paper-view.png')});
  expect((await page.request.get(base+'awards/history-assets/unit49-50/unit49-50/content.js')).status()).toBe(404);
  expect((await page.request.get(base+'awards/history-assets/unit49-50/server/store.js')).status()).toBe(404);
  expect((await page.request.get(base+'awards/history-assets/unit1-2/assets/awards/paper.webp')).status()).toBe(403);
  const originalArt=base+'awards/history-assets/unit49-50/assets/lesson49/icons/butcher.svg';
  const artResponse=await page.request.get(originalArt);expect(artResponse.status()).toBe(200);expect(artResponse.headers()['cache-control']).toBe('private, no-cache');
  const etag=artResponse.headers().etag;expect(etag).toMatch(/^"[a-f0-9]{64}"$/);expect((await artResponse.body()).length).toBeGreaterThan(0);
  const unchanged=await page.request.get(originalArt,{headers:{'If-None-Match':etag}});expect(unchanged.status()).toBe(304);expect((await unchanged.body()).length).toBe(0);
  // Possessing an original image's ETag does not turn the archive namespace
  // into a teaching-source endpoint or bypass the other-course ownership gate.
  expect((await page.request.get(base+'awards/history-assets/unit49-50/unit49-50/content.js',{headers:{'If-None-Match':etag}})).status()).toBe(404);
  expect((await page.request.get(base+'awards/history-assets/unit1-2/assets/awards/paper.webp',{headers:{'If-None-Match':etag}})).status()).toBe(403);
  store=openStore(dataDir);expect(JSON.stringify(store.certificateArchive(student.id,archive.id))).toBe(raw);expect(store.progress(student.id,'unit49-50')).toEqual({generation,value:{}});store.close();
  const stranger=await browser.newContext({baseURL:origin});expect((await stranger.request.get(base+'api/certificates/'+archive.id)).status()).toBe(401);expect((await stranger.request.get(originalArt,{headers:{'If-None-Match':etag}})).status()).toBe(401);await stranger.close();
 }finally{await context?.close();await stop();await fixture.cleanup(temporary,root);}
});

test('仅本机未同步旧纸证可独立查看下载原件，未知匿名键不认领也不补发服务器五星',async({browser},info)=>{
 test.setTimeout(180000);
 const root=path.resolve(__dirname,'../..'),temporary=await fs.mkdtemp(path.join(os.tmpdir(),'canran-local-certificate-')),oldRoot=path.join(temporary,'old-site'),dataDir=path.join(temporary,'accounts');
 const ports=require('../support/login-test-ports'),origin=ports.origin(4289);let server,context;
 const stop=async()=>{if(server){await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});server=null;}};
 const start=async old=>{server=await createApp({root:old?oldRoot:root,dataDir,origin,basePath:base});await new Promise(resolve=>server.listen(ports.port(4289),'127.0.0.1',resolve));};
 const png=async(page,name)=>{const waiting=page.waitForEvent('download');await page.getByRole('button',{name:'保存图片',exact:true}).click();await(await waiting).saveAs(info.outputPath(name));return require('sharp')(info.outputPath(name)).raw().toBuffer({resolveWithObject:true});};
 try{
  await fixture.prepare(root,oldRoot);let store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();await start(true);
  context=await browser.newContext({baseURL:origin,timezoneId:'Asia/Shanghai',serviceWorkers:'block'});const page=await context.newPage();await adminLogin(page,base);
  const account=await createStudent(page,'本机原件验收班','本机账户姓名',[/Lesson 49–50/]);await signIn(page,account,base);
  await require('../support/unit49-50-flow').completeUnit(page,{basePath:base});await expect(page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  // Keep the original, genuinely claimed paper only on this browser: the real
  // client saves it locally, but the certificate-bearing HTTP upload fails.
  await page.route('**/api/progress',async route=>{if(route.request().postDataJSON()?.value?.activity?.unitCertificateIssuedAt)await route.abort('failed');else await route.continue();});
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('本机小禾');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const original=await png(page,'local-original.png'),date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');await expect(page.locator('#studentSyncStatus')).toHaveAttribute('data-sync-state','retry');
  const local=await page.evaluate(()=>{const key='canran:student:'+CanranStudentAccess.student.id+':canran:lesson:unit49-50:learning:v1';return{key,value:localStorage.getItem(key)};});
  await stop();store=openStore(dataDir);const student=store.students().find(row=>row.studentNumber===account.number);expect(store.progress(student.id,'unit49-50').value.activity.unitCertificateIssuedAt).toBeUndefined();
  await store.applySystemUpgrade({backupDirectory:path.join(temporary,'backup'),root});expect(store.certificateArchives(student.id)).toHaveLength(0);store.close();await start(false);await page.unroute('**/api/progress');
  await page.goto(base+'awards/');await expect(page.getByRole('heading',{name:'这台设备保留的旧证资料'})).toBeVisible({timeout:30000});
  // Copy the genuinely earned receipt into unrelated test-only namespaces as
  // negative ownership controls. No achievement or answer is fabricated.
  await page.evaluate(book=>{localStorage.setItem('canran:lesson:unit49-50:learning:v1',book);localStorage.setItem('canran:student:another-test-owner:canran:lesson:unit49-50:learning:v1',book);},local.value);
  const copies=await page.evaluate(async()=>{const access=await(await fetch(document.querySelector('meta[name="award-base"]').content+'api/awards')).json();return CanranLocalCertificates.collect(access);});expect(copies).toHaveLength(1);expect(copies[0].name).toBe('本机小禾');
  await page.getByRole('link',{name:'查看本机原证',exact:true}).click();const dialog=page.locator('#legacyCertificateDialog');await expect(dialog).toBeVisible({timeout:30000});await expect(dialog.locator('#legacyCertificateName')).toHaveText('本机小禾');await expect(dialog.locator('#legacyCertificateDate')).toHaveText(date);
  const preserved=await png(page,'local-preserved.png');expect(preserved.info).toEqual(original.info);expect(preserved.data.equals(original.data)).toBe(true);await dialog.screenshot({path:info.outputPath('local-paper-view.png')});
  expect(await page.evaluate(key=>localStorage.getItem(key),local.key)).toBe(local.value);
  store=openStore(dataDir);expect(store.certificateArchives(student.id)).toHaveLength(0);expect(store.courseUpgrade(student.id,'unit49-50').stars).toBe(0);expect(store.progress(student.id,'unit49-50').value).toEqual({});store.close();
  await page.goto(base+'awards/');const download=page.waitForEvent('download');await page.getByRole('button',{name:'下载保留副本',exact:true}).click();await(await download).saveAs(info.outputPath('local-certificate-copy.json'));const copy=JSON.parse(await fs.readFile(info.outputPath('local-certificate-copy.json'),'utf8'));expect(copy.certificate.snapshot.activity.unitCertificateIssuedAt).toBe(JSON.parse(local.value).activity.unitCertificateIssuedAt);
  // The collector's exact owner prefix is observable from its source contract;
  // an anonymous copy never becomes an account award or enters this list.
  expect(copies.every(item=>item.sourceKey.startsWith('canran:student:'+student.id+':'))).toBe(true);
 }finally{await context?.close();await stop();await fixture.cleanup(temporary,root);}
});
