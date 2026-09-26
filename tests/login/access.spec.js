'use strict';
const { test, expect } = require('@playwright/test');

const {adminLogin,createStudent,fillLogin,setPassword,signIn,studentLogin}=require('./helpers');

test('未登录先看到学号密码入口，不能直接进入教学单元', async ({ page }) => {
  await page.goto('/lesson/');
  await expect(page.getByRole('textbox', { name: '学号', exact: true })).toBeVisible();
  await expect(page.locator('a[href*="unit1-2"]')).toHaveCount(0);
  await page.goto('/lesson/unit1-2/#learn/words');
  await expect(page.getByRole('textbox', { name: '学号', exact: true })).toBeVisible();
  await expect(page.locator('.unit-word')).toHaveCount(0);
});

test('学号密码进入自己的班级，七项下架且旧直链不能越权', async ({ page, browser }) => {
  await adminLogin(page);
  const code=await createStudent(page,'入口班','小明',[/Lesson 1–2 /]);
  const context=await browser.newContext();const student=await context.newPage();
  await signIn(student,code);
  await expect(student.getByRole('heading',{name:'小明的课程'})).toBeVisible();
  await expect(student.locator('.course')).toHaveCount(1);
  await student.locator('.course').click();
  await expect(student.getByRole('heading',{name:'物品小图鉴',exact:true})).toBeVisible();
  await student.goto('/lesson/unit3-4/');
  await expect(student.getByRole('heading',{name:'这节课还没向你的班级开放'})).toBeVisible();
  for (const id of ['lesson49','lesson50','lesson51','lesson52','lesson53','lesson54','soundmark']) {
    const response=await student.goto('/lesson/'+id+'/');expect(response.status()).toBe(410);
    await expect(student.getByRole('heading',{name:'这节课已下架'})).toBeVisible();
  }
  await context.close();
});

test('管理员可以创建班级并只开放 Lesson 1–2', async ({ page }) => {
  await page.goto('/lesson/admin/');
  await page.getByRole('textbox', { name: '管理员账号' }).fill('teacher');
  await page.getByLabel('管理员密码').fill('Test-only-classroom-2026!');
  await page.getByRole('button', { name: '登录管理页' }).click();
  await page.getByLabel('新班级名称').fill('A 班');
  await page.getByRole('button', { name: '创建班级', exact: true }).click();
  await page.getByRole('button', { name: '管理 A 班', exact: true }).click();
  await page.getByRole('checkbox', { name: /Lesson 1–2 / }).check();
  await page.getByRole('button', { name: '保存开放课程' }).click();
  await expect(page.getByRole('status')).toContainText('已保存');
  await expect(page.getByRole('checkbox')).toHaveCount(16);
  await expect(page.getByRole('checkbox', { name: /Lesson 1–2 / })).toBeChecked();
});

const {completeStory,completeActivity,completeUnit1314}=require('../support/unit13-14-flow');
test('已完成活动跨设备同步，未提交选项留在原设备',async({page,browser})=>{
 await adminLogin(page);const code=await createStudent(page,'同步班','小月',[/Lesson 13–14 /]);
 const a=await studentLogin(browser,code);await completeStory(a.page,'/lesson');
 await expect(a.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
 await a.page.goto('/lesson/unit13-14/#learn/colours');await a.page.getByRole('button',{name:"What colour's your hat?",exact:true}).click();
 const b=await studentLogin(browser,code);await b.page.goto('/lesson/unit13-14/#learn/text');
 await expect(b.page.locator('.stage-text')).toContainText('故事看完了！');
 await b.page.goto('/lesson/unit13-14/#learn/colours');await expect(b.page.locator('.stage-colours').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await completeActivity(b.page,'colours','/lesson');await expect(b.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
 await a.page.goto('/lesson/unit13-14/#learn/words');await a.page.reload();await expect(a.page.locator('#starCount')).toHaveText('4');
 await a.context.close();await b.context.close();
});

test('A/B 范围、已缓存课程换人、清单与固定资源均受权限限制',async({page,browser})=>{
 await adminLogin(page);const aCode=await createStudent(page,'边界 A 班','小甲',[/Lesson 1–2 /]);
 const bCode=await createStudent(page,'边界 B 班','小乙',[/Lesson 1–2 /,/Lesson 3–4 /,/Lesson 5–6 /,/Lesson 7–8 /,/Lesson 9–10 /]);
 const b=await studentLogin(browser,bCode);await expect(b.page.locator('.course')).toHaveCount(5);
 const entries=await b.page.evaluate(async()=>{const i=await(await fetch('/lesson/course-index.json')).json(),url=i.courses['unit9-10'].manifest,p=await(await fetch(url)).json();return {manifest:url,resource:p.required.find(r=>r.key.endsWith('/unit9-10/content.js')).url};});
 await b.page.goto('/lesson/unit9-10/#learn/listen');await expect(b.page.locator('.stage-listen').getByRole('heading').first()).toBeVisible();
 const old=await b.context.newPage();await old.goto('/lesson/unit9-10/#learn/listen');await expect(old.locator('.stage-listen').getByRole('heading').first()).toBeVisible();
 await b.page.goto('/lesson/');await b.page.getByRole('button',{name:'切换学生',exact:true}).click();await fillLogin(b.page,aCode);await setPassword(b.page);
 await expect(b.page.getByRole('heading',{name:'小甲的课程'})).toBeVisible();await expect(b.page.locator('.course')).toHaveCount(1);
 await expect(old.getByRole('alertdialog',{name:'课程访问'})).toBeVisible();
 await b.page.goBack();await expect(b.page.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();await expect(b.page.locator('.stage-listen')).toBeHidden();
 for(const url of [entries.manifest,entries.resource,'/lesson/unit9-10/content.js','/lesson/core/course-catalog.js','/lesson/api/admin/state'])expect(await b.page.evaluate(async url=>(await fetch(url)).status,url)).toBe(403);
 await b.page.goto('/lesson/unit9-10/#learn/listen');await expect(b.page.getByRole('heading',{name:'这节课还没向你的班级开放'})).toBeVisible();await expect(b.page.locator('.stage-listen')).toHaveCount(0);
 await b.context.close();
});

test('两小时静默续期、三十分钟后台回归核验，收回权限不清空当前操作',async({page,browser})=>{
 await adminLogin(page);const code=await createStudent(page,'续期班','小雨',[/Lesson 13–14 /]);const a=await studentLogin(browser,code);
 await a.page.clock.install();await a.page.goto('/lesson/unit13-14/#learn/colours');const choice=a.page.locator('.stage-colours').getByRole('button',{name:"What colour's your hat?",exact:true});await choice.click();
 let checks=0;a.page.on('request',r=>{if(r.url().endsWith('/unit13-14/enter'))checks++;});
 await a.page.clock.fastForward(7201000);await expect.poll(()=>checks).toBe(1);await expect(a.page.locator('#accessGate')).toHaveCount(0);await expect(choice).toHaveAttribute('aria-pressed','true');
 // The browser's visibility event is a host signal, never a submitted answer or grant.
 await a.page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await a.page.clock.fastForward(1801000);
 await a.page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await expect.poll(()=>checks).toBe(2);
 await expect(choice).toHaveAttribute('aria-pressed','true');
 await page.getByRole('checkbox',{name:/Lesson 13–14 /}).uncheck();await page.getByRole('button',{name:'保存开放课程'}).click();await expect(page.getByRole('status')).toContainText('开放课程已保存');
 await a.page.clock.fastForward(7201000);await expect(a.page.locator('#accessGate')).toContainText('这节课还没向你的班级开放');
 await page.getByRole('checkbox',{name:/Lesson 13–14 /}).check();await page.getByRole('button',{name:'保存开放课程'}).click();await expect(page.getByRole('status')).toContainText('开放课程已保存');
 await a.page.locator('#accessGate').getByRole('button',{name:'再试一次'}).click();await expect(a.page.locator('#accessGate')).toHaveCount(0);await expect(choice).toHaveAttribute('aria-pressed','true');await a.context.close();
});

test('离线完成归原学生、联网同步；缓存复访不重复下载，离线新进必须等待',async({page,browser})=>{
 await adminLogin(page);const code=await createStudent(page,'离线班','小森',[/Lesson 13–14 /]);const a=await studentLogin(browser,code);
 await a.page.goto('/lesson/unit13-14/#learn/colours');const room=a.page.locator('.stage-colours');await expect(room.getByRole('heading').first()).toBeVisible();await a.context.setOffline(true);
 for(const [i,answer] of ["What colour's your hat?",'一只棕白相间的狗'].entries()){await room.getByRole('button',{name:answer,exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:i?'完成这一站':'下一题',exact:true}).click();}
 await expect(a.page.locator('#studentSyncStatus')).toContainText('本机');await a.context.setOffline(false);await expect(a.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
 const b=await studentLogin(browser,code);await b.page.goto('/lesson/unit13-14/#learn/colours');await expect(b.page.locator('#starCount')).toHaveText('3');
 let downloads=0;a.page.on('request',r=>{if(r.url().includes('/resources/'))downloads++;});await a.page.reload();await expect(a.page.locator('.stage-colours .practice-finish')).toBeVisible();expect(downloads).toBe(0);
 await a.context.setOffline(true);await a.page.reload();await expect(a.page.getByRole('heading',{name:'联网后再进入'})).toBeVisible();await expect(a.page.locator('.stage-colours')).toHaveCount(0);await a.context.close();await b.context.close();
});

test('完整无配音课程成果与证书同步，重开后旧设备不能恢复旧成绩',async({page,browser})=>{
 test.setTimeout(120000);await adminLogin(page);const code=await createStudent(page,'证书班','小星',[/Lesson 13–14 /]);const a=await studentLogin(browser,code);await completeUnit1314(a.page,'/lesson');
 await a.page.getByLabel('证书上的名字').fill('小星');await a.page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(a.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
 const b=await studentLogin(browser,code);await b.page.goto('/lesson/unit13-14/#learn/certificate');await expect(b.page.locator('#starCount')).toHaveText('15');await expect(b.page.getByLabel('证书上的名字')).toHaveValue('小星');
 await b.page.getByRole('button',{name:'小星 · 学习设置'}).click();await b.page.getByRole('button',{name:'重开本课',exact:true}).click();await b.page.getByRole('button',{name:'确认清空本课个人成果',exact:true}).click();await expect(b.page.locator('#starCount')).toHaveText('0');
 await a.page.reload();await expect(a.page.locator('#starCount')).toHaveText('0');await expect(a.page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await expect(a.page.getByLabel('证书上的名字')).toHaveValue('');await expect(b.page.getByLabel('证书上的名字')).toHaveValue('');await a.context.close();await b.context.close();
});

test('转班、停用、恢复、重置密码和空班预览',async({page,browser})=>{
 await adminLogin(page);const code=await createStudent(page,'调班前','可可',[/Lesson 13–14 /]);const a=await studentLogin(browser,code);await completeActivity(a.page,'colours','/lesson');await expect(a.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
 await page.getByLabel('新班级名称').fill('调班后');await page.getByRole('button',{name:'创建班级',exact:true}).click();await expect(page.getByRole('heading',{name:'调班后 · 开放课程'})).toBeVisible();
 await page.getByRole('link',{name:'预览这个班'}).click();await expect(page.getByRole('heading',{name:'老师还没开放课程'})).toBeVisible();await expect(page.locator('.course')).toHaveCount(0);await page.getByRole('link',{name:'返回班级管理'}).click();
 await page.getByRole('button',{name:'管理 调班前',exact:true}).click();await page.getByRole('button',{name:'管理学生',exact:true}).click();await page.getByLabel('当前班级').selectOption({label:'调班后'});await page.getByRole('button',{name:'保存学生信息'}).click();
 await a.page.goto('/lesson/');await expect(a.page.getByRole('heading',{name:'老师还没开放课程'})).toBeVisible();
 await page.getByRole('checkbox',{name:/Lesson 13–14 /}).check();await page.getByRole('button',{name:'保存开放课程'}).click();await a.page.getByRole('button',{name:'刷新课程'}).click();await expect(a.page.locator('.course')).toContainText('3 / 15');
 await page.getByRole('button',{name:'管理学生',exact:true}).click();await page.getByLabel('学习状态').selectOption('false');await page.getByRole('button',{name:'保存学生信息'}).click();await a.page.reload();await expect(a.page.getByRole('status')).toContainText('学生账号已停用');
 await page.getByRole('button',{name:'管理学生',exact:true}).click();await page.getByLabel('学习状态').selectOption('true');await page.getByRole('button',{name:'保存学生信息'}).click();await page.getByRole('button',{name:'管理学生',exact:true}).click();await page.getByRole('button',{name:'重置密码',exact:true}).click();await page.getByRole('button',{name:'确认重置密码'}).click();const resetPassword=await page.locator('.initial-password').textContent();expect(resetPassword).not.toBe(code.initialPassword);
 await a.page.reload();await fillLogin(a.page,code);await expect(a.page.getByRole('status')).toContainText('学号或密码不正确');await fillLogin(a.page,code,resetPassword);await setPassword(a.page,'Reset-class-journey-2026');await expect(a.page.locator('.course')).toContainText('3 / 15');await a.context.close();
});

test('16 个教学单元冷启动、图片完整、词卡和一道真实作答，手机界面',async({page,browser})=>{
 test.setTimeout(120000);await adminLogin(page);const code=await createStudent(page,'课程回归班','小童',[/Lesson 1–2 /]);
 // The helper checks matching labels one by one, so select all in the management UI.
 await page.getByRole('button',{name:'管理 课程回归班'}).click();for(const box of await page.getByRole('checkbox').all())await box.check();await page.getByRole('button',{name:'保存开放课程'}).click();await expect(page.getByRole('status')).toContainText('开放课程已保存');
 const a=await studentLogin(browser,code);await a.page.setViewportSize({width:390,height:844});const errors=[];a.page.on('pageerror',e=>errors.push(e.message));
 const answers={'unit1-2':'Excuse me!','unit3-4':'My umbrella, please.', 'unit5-6':'Sophie','unit7-8':'工程师','unit9-10':'成年女子','unit11-12':'Whose','unit13-14':'颜色','unit15-16':'雇员；受雇的人','unit17-18':'man','unit19-20':'累的；疲倦的','unit21-22':'给','unit23-24':'哪些','unit25-26':'厨房','unit27-28':'客厅','unit29-30':'关上；关闭','unit49-50':'Mrs. Bird'};
 for(const id of Object.keys(answers)){
  await a.page.goto('/lesson/'+id+'/#learn/words');await expect(a.page.locator('.unit-word').first()).toBeVisible();await expect(a.page.locator('#courseLoader')).toHaveCount(0);
  expect(await a.page.evaluate(()=>[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  expect(await a.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await a.page.locator('.unit-word').first().click();
  await a.page.screenshot({path:'output/login/'+id+'-mobile.png'});
  // A wrong submitted answer must remain an unfinished exercise in every unit.
  await a.page.goto('/lesson/'+id+'/#learn/'+(id==='unit49-50'?'give':id==='unit1-2'?'manners':'listen'));
  const room=a.page.locator('.stage-'+(id==='unit49-50'?'give':id==='unit1-2'?'manners':'listen'));await expect(room.locator('.practice-options button').first()).toBeVisible();
  if(['unit3-4','unit5-6'].includes(id))await expect(room.getByRole('button',{name:'听一遍',exact:true})).toHaveCount(0);
  await room.locator('.practice-options button').first().click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText(/答对了|再看看/);
 }
 expect(errors).toEqual([]);await a.context.close();
});

test('49–50 完整课程真实音频、作答和证书，成果换设备保留',async({page,browser})=>{
 test.setTimeout(240000);await adminLogin(page);const code=await createStudent(page,'肉店班','小厨',[/Lesson 49–50 /]);const a=await studentLogin(browser,code);
 await require('../support/unit49-50-flow').completeUnit(a.page,{basePath:'/lesson/',realAudio:true});await expect(a.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
 const b=await studentLogin(browser,code);await b.page.goto('/lesson/unit49-50/#learn/certificate');await expect(b.page.locator('#starCount')).toHaveText('15');await expect(b.page.getByRole('button',{name:'领取单元证书',exact:true})).toBeEnabled();await a.context.close();await b.context.close();
});

test('冷启动图片失败保持加载页，修复后重试；未登录的脚本关闭页面无课件',async({page,browser})=>{
 await adminLogin(page);const code=await createStudent(page,'图片班','阿青',[/Lesson 13–14 /]);const a=await studentLogin(browser,code);
 await a.page.route('**/resources/**/dress.svg',route=>route.abort());await a.page.goto('/lesson/unit13-14/#learn/words');
 await expect(a.page.getByRole('button',{name:'再试一次',exact:true})).toBeVisible();await expect(a.page.locator('.unit-word')).toHaveCount(0);
 await a.page.unroute('**/resources/**/dress.svg');await a.page.getByRole('button',{name:'再试一次',exact:true}).click();await expect(a.page.locator('.unit-word').first()).toBeVisible();
 expect(await a.page.evaluate(()=>[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth>0))).toBe(true);await a.context.close();
 const none=await browser.newContext({javaScriptEnabled:false});const blank=await none.newPage();await blank.goto('/lesson/unit13-14/');await expect(blank.getByLabel('学号',{exact:true})).toBeVisible();await expect(blank.locator('#lessonWorkspace')).toHaveCount(0);await none.close();
});

test('学生不能提交别人的成果，旧上传不能覆盖重开，来源校验与登录限速有效',async({page,browser})=>{
 await adminLogin(page);const code=await createStudent(page,'接口边界班','果果',[/Lesson 13–14 /]);const a=await studentLogin(browser,code);let completed;
 a.page.on('request',r=>{if(r.url().endsWith('/api/progress')){const body=r.postDataJSON();if(body?.value.activity.unitCompleted.colours)completed=body;}});
 await completeActivity(a.page,'colours','/lesson');await expect(a.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');expect(completed).toBeTruthy();
 const bCode=await createStudent(page,'接口另一班','木木',[/Lesson 13–14 /]);const b=await studentLogin(browser,bCode);
 const denied=await b.page.evaluate(async body=>{const r=await fetch('/lesson/api/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return r.status;},completed);expect(denied).toBe(403);
 await a.page.getByRole('button',{name:'果果 · 学习设置'}).click();await a.page.getByRole('button',{name:'重开本课',exact:true}).click();await a.page.getByRole('button',{name:'确认清空本课个人成果',exact:true}).click();await expect(a.page.locator('#starCount')).toHaveText('0');
 const stale=await a.page.evaluate(async body=>(await fetch('/lesson/api/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).json(),completed);expect(stale.stale).toBe(true);await a.page.reload();await expect(a.page.locator('#starCount')).toHaveText('0');
 const cross=await page.request.post('/lesson/api/admin/classes',{headers:{Origin:'https://another-origin.invalid'},data:{name:'不应该创建的班级'}});expect(cross.status()).toBe(403);await page.reload();await expect(page.getByRole('button',{name:'管理 不应该创建的班级',exact:true})).toHaveCount(0);
 await b.page.getByRole('button',{name:'切换学生',exact:true}).click();await b.page.getByLabel('学号',{exact:true}).fill('x99999999');await b.page.getByLabel('密码',{exact:true}).fill('Invalid-password-123');
 for(let i=0;i<13;i++){await b.page.getByRole('button',{name:'进入我的课程'}).click();await expect(b.page.getByRole('status')).toHaveText(i===12?'尝试有些频繁，请一分钟后再试':'学号或密码不正确，或账号已停用。初始密码已使用或过期时，请联系老师重置。');}
 await a.context.close();await b.context.close();
});

test('进入核验失败时可见重试界面，不被资源加载层遮住',async({page,browser})=>{
 await adminLogin(page);const code=await createStudent(page,'核验失败班','小方',[/Lesson 13–14 /]);const a=await studentLogin(browser,code);
 await a.page.route('**/api/courses/unit13-14/enter',route=>route.abort());await a.page.goto('/lesson/unit13-14/#learn/words');await expect(a.page.getByRole('alertdialog',{name:'课程访问'})).toBeVisible();await expect(a.page.locator('.unit-word')).toHaveCount(0);
 await a.page.unroute('**/api/courses/unit13-14/enter');await a.page.locator('#accessGate').getByRole('button',{name:'再试一次'}).click();await expect(a.page.locator('.unit-word').first()).toBeVisible();await a.context.close();
});
