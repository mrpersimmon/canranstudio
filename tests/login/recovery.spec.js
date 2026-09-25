'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
const {completeActivity}=require('../support/unit13-14-flow');
const {adminLogin,addStudent,signIn,fillLogin,setPassword,readInitialPassword}=require('./helpers');
test('停服务备份恢复后，原学号密码、班级和真实成果仍可使用',async({browser})=>{
 test.setTimeout(60000);const root=await fs.mkdtemp(path.join(os.tmpdir(),'canran-recovery-'));let server,context;
 const active=path.join(root,'active'),restored=path.join(root,'restored'),backup=path.join(root,'backup');
 const store=openStore(active);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();
 async function start(dataDir){server=await createApp({dataDir,origin:'http://127.0.0.1:4194'});await new Promise(r=>server.listen(4194,'127.0.0.1',r));}
 try{
  await start(active);context=await browser.newContext({baseURL:'http://127.0.0.1:4194'});const page=await context.newPage();
  await page.goto('/lesson/admin/');await page.getByLabel('管理员账号').fill('teacher');await page.getByLabel('管理员密码').fill('Test-only-classroom-2026!');await page.getByRole('button',{name:'登录管理页'}).click();
  await page.getByLabel('新班级名称').fill('备份班');await page.getByRole('button',{name:'创建班级',exact:true}).click();await page.getByRole('checkbox',{name:/Lesson 13–14 /}).check();await page.getByRole('button',{name:'保存开放课程'}).click();await expect(page.getByRole('status')).toContainText('开放课程已保存');
  const account=await addStudent(page,'豆豆'),pending=await addStudent(page,'待领取同学');await signIn(page,account);await completeActivity(page,'colours','/lesson');await expect(page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await context.close();context=null;await new Promise(r=>server.close(r));server=null;
  execFileSync(process.execPath,['server/manage.js','backup',backup],{env:{...process.env,LESSON_DATA_DIR:active}});
  execFileSync(process.execPath,['server/manage.js','restore',backup],{env:{...process.env,LESSON_DATA_DIR:restored}});
  await start(restored);context=await browser.newContext({baseURL:'http://127.0.0.1:4194'});const recovered=await context.newPage();await recovered.goto('/lesson/');await fillLogin(recovered,account);await expect(recovered.getByRole('heading',{name:'豆豆的课程'})).toBeVisible();await expect(recovered.locator('.course')).toContainText('3 / 15');
  await recovered.locator('.course').click();await expect(recovered.locator('#starCount')).toHaveText('3');
  await adminLogin(recovered);await recovered.getByRole('button',{name:'管理 备份班',exact:true}).click();
  const pendingRow=recovered.locator('.student-row').filter({hasText:pending.number});
  expect(await readInitialPassword(recovered,pendingRow)).toBe(pending.initialPassword);
  await recovered.goto('/lesson/');await recovered.getByRole('button',{name:'切换学生',exact:true}).click();
  await expect(recovered.getByLabel('学号',{exact:true})).toBeVisible();
  await fillLogin(recovered,pending);await setPassword(recovered);await expect(recovered.getByRole('heading',{name:'待领取同学的课程'})).toBeVisible();
 }finally{await context?.close();if(server)await new Promise(r=>server.close(r));await fs.rm(root,{recursive:true,force:true});}
});

test('学习卡数据库升级保留原学生成果，旧卡及旧会话失效，重启不重复分配学号',async({browser})=>{
 test.setTimeout(90000);const directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-card-upgrade-'));let server,context;
 const origin='http://127.0.0.1:4196';
 async function stop(){await new Promise(r=>server.close(r));server=null;}
 async function start(factory){server=await factory({dataDir:directory,origin});await new Promise(r=>server.listen(4196,'127.0.0.1',r));}
 try{
  const oldStore=require('../fixtures/learning-card-before/store').openStore(directory);oldStore.setAdmin('teacher','Test-only-classroom-2026!');oldStore.close();
  await start(require('../fixtures/learning-card-before/app').createApp);context=await browser.newContext({baseURL:origin});const page=await context.newPage();
  await page.goto('/lesson/admin/');await page.getByLabel('管理员账号').fill('teacher');await page.getByLabel('管理员密码').fill('Test-only-classroom-2026!');await page.getByRole('button',{name:'登录管理页'}).click();
  await page.getByLabel('新班级名称').fill('升级前班级');await page.getByRole('button',{name:'创建班级',exact:true}).click();await page.getByRole('checkbox',{name:/Lesson 13–14 /}).check();await page.getByRole('button',{name:'保存开放课程'}).click();await expect(page.getByRole('status')).toContainText('开放课程已保存');
  await page.getByLabel('学生姓名或课堂称呼，每行一位').fill('段晓东');await page.getByRole('button',{name:'添加学生',exact:true}).click();await page.getByRole('button',{name:'学习卡',exact:true}).click();const oldCode=(await page.locator('.learning-code').textContent()).replace(/-/g,'');
  await page.goto('/lesson/#card='+oldCode);await expect(page.locator('.course')).toBeVisible();await completeActivity(page,'colours','/lesson');await expect(page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
  await stop();await start(createApp);
  await page.reload();await expect(page.getByLabel('学号',{exact:true})).toBeVisible();await expect(page.locator('.stage-colours')).toHaveCount(0);
  await page.goto('/lesson/#card='+oldCode);await expect(page.getByRole('status')).toContainText('旧学习码不再使用');expect(new URL(page.url()).hash).toBe('');
  expect(await page.evaluate(async code=>(await fetch('/lesson/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})})).status,oldCode)).toBe(401);
  await page.goto('/lesson/admin/');await page.getByRole('button',{name:'管理 升级前班级'}).click();await expect(page.locator('.student-number')).toHaveText('d00000001');
  await page.getByRole('button',{name:'查看账号'}).click();const initialPassword=await page.locator('.initial-password').textContent();expect(initialPassword).not.toBe('duanxiaodong');
  await page.goto('/lesson/');await fillLogin(page,{number:'d00000001',password:initialPassword});await setPassword(page,'Upgrade-journey-2026');await expect(page.locator('.course')).toContainText('3 / 15');
  await stop();await start(createApp);await page.reload();await expect(page.locator('.course')).toContainText('3 / 15');
  await page.goto('/lesson/admin/');await page.getByRole('button',{name:'管理 升级前班级'}).click();const next=await addStudent(page,'李明');expect(next.number).toBe('l00000002');
 }finally{await context?.close();if(server)await stop();await fs.rm(directory,{recursive:true,force:true});}
});

test('旧公开缓存在线迁移后要求登录，真实匿名成果保留而不认领',async({browser})=>{
 test.setTimeout(60000);const directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-migrate-'));let server,context;
 try{
  server=await require('../../scripts/preview-courses').serveCourses({port:4195});context=await browser.newContext({baseURL:'http://127.0.0.1:4195'});const page=await context.newPage();
  await completeActivity(page,'colours','/lesson');await expect(page.locator('#starCount')).toHaveText('3');
  const old=await context.newPage();await old.goto('/lesson/lesson49/');await expect(old.locator('#courseLoader')).toHaveCount(0);
  await new Promise(r=>server.close(r));server=null;const store=openStore(directory);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();server=await createApp({dataDir:directory,origin:'http://127.0.0.1:4195'});await new Promise(r=>server.listen(4195,'127.0.0.1',r));
  await page.goto('/lesson/admin/');await page.getByLabel('管理员账号').fill('teacher');await page.getByLabel('管理员密码').fill('Test-only-classroom-2026!');await page.getByRole('button',{name:'登录管理页'}).click();
  await expect(old.getByRole('heading',{name:'这节课已下架',exact:true})).toBeVisible();
  await page.getByLabel('新班级名称').fill('迁移班');await page.getByRole('button',{name:'创建班级',exact:true}).click();await page.getByRole('checkbox',{name:/Lesson 13–14 /}).check();await page.getByRole('button',{name:'保存开放课程'}).click();await expect(page.getByRole('status')).toContainText('开放课程已保存');const account=await addStudent(page,'新同学');await signIn(page,account);await page.getByText('本机旧记录',{exact:true}).click();await expect(page.locator('#legacy')).toContainText('unit13-14 · 1 项活动完成');
  await page.locator('.course').click();await expect(page.locator('#starCount')).toHaveText('0');await page.goto('/lesson/unit13-14/#learn/colours');await expect(page.locator('.stage-colours').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 }finally{await context?.close();if(server)await new Promise(r=>server.close(r));await fs.rm(directory,{recursive:true,force:true});}
});
