'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const {openStore}=require('../../server/store');
const {createApp}=require('../../server/app');
const {createCoursePackages}=require('../../scripts/course-packages');
const {UNITS}=require('../../server/catalog');
const {openMyAccount}=require('./helpers');
const base=process.env.AWARD_TEST_BASE||'/lesson/',password='Test-only-cooldown-2026!';
test.use({browserName:process.env.AUTH_COOLDOWN_BROWSER||'chromium'});
let bundle;
async function fixture(){
  const root=path.resolve(__dirname,'../..'),directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-cooldown-'));
  const store=openStore(directory);store.setAdmin('test-owner',password);
  const group=store.createClass('登录倒计时班');store.updateClass(group.id,group.name,['unit1-2']);
  const students=store.createStudents([{name:'小禾',pinyin:'xiaohe'},{name:'小雨',pinyin:'xiaoyu'}],group.id);
  for(const student of students)store.changePassword(student.id,password);store.close();
  const reservation=http.createServer();await new Promise(resolve=>reservation.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+reservation.address().port;await new Promise(resolve=>reservation.close(resolve));
  bundle ||= await createCoursePackages({root,basePath:base,courseIds:UNITS,isolatedDefinitions:true});
  const server=await createApp({root,dataDir:directory,origin,basePath:base,bundle});await new Promise(resolve=>server.listen(Number(new URL(origin).port),'127.0.0.1',resolve));
  const db=new DatabaseSync(path.join(directory,'learning.sqlite'));
  return {origin,students,db,async call(route,data){return fetch(origin+base+'api/'+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(data)});},
    async lock(kind,identity){for(let i=0;i<10;i++)expect((await this.call(kind==='admin'?'admin/login':'login',kind==='admin'?{username:identity,password:'wrong'}:{studentNumber:identity,password:'wrong'})).status).toBe(401);},
    deadline(kind,identity,ms){const deadline=Date.now()+ms;db.prepare('UPDATE auth_throttle SET expires=? WHERE key=?').run(deadline,'failure:'+kind+':'+crypto.createHash('sha256').update(identity).digest('hex'));return deadline;},
    async close(){db.close();await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});}};
}

for(const kind of ['student','admin'])test(kind+'：真实429显示剩余时间和北京时间，客户端时钟错误也能到期，且不会自动重试',async({browser})=>{
  const f=await fixture(),context=await browser.newContext({viewport:{width:390,height:844}});
  try{
    const page=await context.newPage(),identity=kind==='admin'?'test-owner':f.students[0].studentNumber;
    await page.goto(f.origin+base+(kind==='admin'?'admin/':''));
    await page.getByLabel(kind==='admin'?'管理员账号或老师工号':'学号',{exact:true}).fill(identity);
    await page.getByLabel(kind==='admin'?'管理员密码 / 老师密码':'密码',{exact:true}).fill(password);
    await f.lock(kind,identity);
    await page.clock.setFixedTime(new Date('2040-01-01T00:00:00Z'));
    const deadline=f.deadline(kind,identity,3800),route=kind==='admin'?'admin/login':'login';
    let requests=0;page.on('request',request=>{if(request.method()==='POST'&&request.url().endsWith('/api/'+route))requests++;});
    const response=page.waitForResponse(r=>r.request().method()==='POST'&&r.url().endsWith('/api/'+route));
    const button=page.getByRole('button',{name:kind==='admin'?'登录管理页':'进入我的课程',exact:true});
    await button.click();const denied=await response;expect(denied.status()).toBe(429);
    const body=await denied.json();expect(body.cooldown.retryAt).toBe(deadline);expect(body.cooldown.serverTime).toBeLessThan(deadline);
    expect(Number(denied.headers()['retry-after'])).toBeGreaterThan(0);
    await expect(page.getByRole('timer')).toBeVisible();await expect(button).toBeDisabled();
    const time=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(deadline));
    await expect(page.getByRole('status')).toContainText('解除时间：'+time+'（北京时间）');
    await expect(page.getByRole('status')).not.toContainText('十五分钟');
    await page.getByLabel(kind==='admin'?'管理员账号或老师工号':'学号',{exact:true}).press('Enter');
    await page.screenshot({path:test.info().outputPath('login-cooldown.png')});
    await expect(button).toBeEnabled();await expect(page.getByRole('status')).toContainText('等待已结束');
    expect(requests).toBe(1);
    await button.click();await expect(page.getByRole('heading',{name:kind==='admin'?'班级管理':'学习旅程 · 小禾的课程',exact:true})).toBeVisible();
    if(kind==='admin')await expect(page.getByRole('button',{name:'退出管理',exact:true})).toBeVisible();
    expect(requests).toBe(2);
  }finally{await context.close();await f.close();}
});

test('账号冷却不阻止切换另一学生；来源冷却不能通过改学号解除',async({browser})=>{
  const f=await fixture(),context=await browser.newContext();
  try{
    const page=await context.newPage(),first=f.students[0].studentNumber;
    await page.goto(f.origin+base);await page.getByLabel('学号',{exact:true}).fill(first);await page.getByLabel('密码',{exact:true}).fill(password);
    await f.lock('student',first);await page.getByRole('button',{name:'进入我的课程'}).click();await expect(page.getByRole('timer')).toBeVisible();
    await page.getByLabel('学号',{exact:true}).fill(f.students[1].studentNumber);await expect(page.getByRole('button',{name:'进入我的课程'})).toBeEnabled();
    await page.getByRole('button',{name:'进入我的课程'}).click();await expect(page.getByRole('heading',{name:'小雨的课程'})).toBeVisible();
    await openMyAccount(page);await page.getByRole('button',{name:'退出登录',exact:true}).click();await page.getByLabel('学号',{exact:true}).fill(first);await page.getByLabel('密码',{exact:true}).fill(password);
    const ip='ip:'+crypto.createHash('sha256').update('127.0.0.1').digest('hex');
    f.db.prepare('UPDATE auth_throttle SET count=120,expires=? WHERE key=?').run(Date.now()+60000,ip);
    await page.getByRole('button',{name:'进入我的课程'}).click();await expect(page.getByRole('timer')).toBeVisible();
    await page.getByLabel('学号',{exact:true}).fill(f.students[1].studentNumber);await expect(page.getByRole('button',{name:'进入我的课程'})).toBeDisabled();
    await expect(page.getByRole('status')).toContainText('当前网络');
  }finally{await context.close();await f.close();}
});

test('管理员修正大小写后作为另一登录标识处理，不被错误用户名的倒计时挡住',async({browser})=>{
  const f=await fixture(),context=await browser.newContext();
  try{
    const page=await context.newPage();await page.goto(f.origin+base+'admin/');
    await page.getByLabel('管理员账号或老师工号').fill('TEST-OWNER');await page.getByLabel('管理员密码 / 老师密码').fill(password);
    await f.lock('admin','TEST-OWNER');await page.getByRole('button',{name:'登录管理页'}).click();await expect(page.getByRole('timer')).toBeVisible();
    await page.getByLabel('管理员账号或老师工号').fill('test-owner');await expect(page.getByRole('button',{name:'登录管理页'})).toBeEnabled();
    await page.getByRole('button',{name:'登录管理页'}).click();await expect(page.getByRole('button',{name:'退出管理'})).toBeVisible();
  }finally{await context.close();await f.close();}
});

test('设备休眠后墙上时钟已过截止点，按钮及时恢复且仍由服务器决定能否登录',async({browser})=>{
  const f=await fixture(),context=await browser.newContext();
  try{
    const page=await context.newPage();await page.goto(f.origin+base+'admin/');
    await page.getByLabel('管理员账号或老师工号').fill('test-owner');await page.getByLabel('管理员密码 / 老师密码').fill(password);
    await f.lock('admin','test-owner');await page.clock.install();
    await page.getByRole('button',{name:'登录管理页'}).click();await expect(page.getByRole('timer')).toBeVisible();
    // Some devices suspend their monotonic timer during sleep. Advance wall
    // time alone; the real backend still rejects an unexpired account.
    await page.clock.setSystemTime(new Date(Date.now()+3600000));await page.clock.runFor(1000);
    await expect(page.getByRole('button',{name:'登录管理页'})).toBeEnabled();
    await page.getByRole('button',{name:'登录管理页'}).click();await expect(page.getByRole('timer')).toBeVisible();await expect(page.getByRole('button',{name:'登录管理页'})).toBeDisabled();
    f.deadline('admin','test-owner',-1);await page.clock.setSystemTime(new Date(Date.now()+7200000));await page.clock.runFor(1000);
    await page.getByRole('button',{name:'登录管理页'}).click();await expect(page.getByRole('button',{name:'退出管理'})).toBeVisible();
  }finally{await context.close();await f.close();}
});
