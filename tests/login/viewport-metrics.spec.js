'use strict';
const {test,expect}=require('@playwright/test');
const crypto=require('node:crypto');
const {adminLogin,createStudent,signIn}=require('./helpers');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
test.skip(process.env.VIEWPORT_TEST_ENABLED!=='1','独立采集开关与数据隔离由 playwright.viewport.config.js 启用');
const api=async page=>(await page.request.get(base+'api/admin/viewport-metrics')).json();

test('实际页面上报尺寸，旋转回原尺寸去重，管理员可查看并导出待验证环境',async({page,browser})=>{
  test.setTimeout(90000);await adminLogin(page,base);
  const account=await createStudent(page,'尺寸采集验收','尺寸同学',[/Lesson 1–2 /,/Lesson 3–4 /]);
  const context=await browser.newContext({viewport:{width:391,height:845},serviceWorkers:'block'}),p=await context.newPage(),sent=[];
  p.on('request',request=>{if(request.url().endsWith('/api/client-viewports'))try{sent.push(request.postDataJSON());}catch{}});
  try{
    await signIn(p,account,base);
    await expect.poll(()=>sent.filter(item=>item.pageKind==='home'&&item.reason==='initial').length).toBe(1);
    const initial=sent.find(item=>item.pageKind==='home'&&item.reason==='initial');
    expect(initial.layoutWidth).toBe(391);expect(initial.layoutHeight).toBe(845);
    expect(initial).not.toHaveProperty('name');expect(initial).not.toHaveProperty('studentId');
    await expect.poll(async()=>(await api(page)).rows.filter(row=>row.pageKind==='home'&&row.audience==='student'&&row.layoutWidth===391).reduce((n,row)=>n+row.count,0)).toBe(1);
    await p.setViewportSize({width:431,height:933});
    await expect.poll(()=>sent.some(item=>item.pageKind==='home'&&item.layoutWidth===431)).toBe(true);
    await p.setViewportSize({width:391,height:845});
    await p.waitForTimeout(1100);
    expect(sent.filter(item=>item.pageKind==='home'&&item.layoutWidth===391)).toHaveLength(1);
    const duplicate=await p.request.post(base+'api/client-viewports',{headers:{Origin:new URL(p.url()).origin},data:initial});expect(duplicate.status()).toBe(204);
    expect((await api(page)).quality.duplicate).toBeGreaterThanOrEqual(1);
    const denied=await p.request.get(base+'api/admin/viewport-metrics');expect(denied.status()).toBe(403);
    await page.locator('#openViewports').click();
    await expect(page.getByRole('heading',{name:'设备与窗口统计'})).toBeVisible();
    await expect(page.getByRole('heading',{name:'学生首页验证覆盖率：待验证'})).toBeVisible();
    await page.screenshot({path:'output/fronted-opt/viewport-metrics-admin-'+(process.env.VIEWPORT_TEST_BROWSER||'chromium')+'.png',fullPage:true});
    const downloadPromise=page.waitForEvent('download');await page.locator('#viewportExport').click();const download=await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^viewport-candidates-/);
    const report=await api(page);expect(report.coverage.percent).toBeNull();expect(report.candidates.length).toBeGreaterThan(0);
    expect(JSON.stringify(report)).not.toContain(account.number);
    await p.goto(base+'unit1-2/');await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
    await expect.poll(()=>sent.some(item=>item.pageKind==='lesson')).toBe(true);
    await p.goto(base+'awards/');await expect.poll(()=>sent.some(item=>item.pageKind==='album')).toBe(true);
  }finally{await context.close();}
});

test('来源、载荷、预览排除及统计失败不影响正常找课',async({page,browser})=>{
  await adminLogin(page,base);
  const account=await createStudent(page,'采集边界验收','边界同学',[/Lesson 1–2 /]);
  const context=await browser.newContext({viewport:{width:392,height:846}}),p=await context.newPage();
  try{
    const origin=new URL(page.url()).origin;
    const body={v:1,eventId:crypto.randomUUID(),pageKind:'home',reason:'initial',layoutWidth:390,layoutHeight:844,clientWidth:390,visualWidth:390,visualHeight:844,visualScale:1,dpr:3};
    expect((await p.request.post(base+'api/client-viewports',{headers:{Origin:'https://untrusted.invalid'},data:body})).status()).toBe(403);
    expect((await p.request.post(base+'api/client-viewports',{headers:{Origin:origin},data:{...body,name:'不应采集'}})).status()).toBe(400);
    expect((await p.request.post(base+'api/client-viewports',{headers:{Origin:origin},data:{...body,extra:'x'.repeat(5000)}})).status()).toBe(413);
    await p.route('**/api/client-viewports',route=>route.fulfill({status:503}));
    await signIn(p,account,base);await expect(p.locator('.journey-home')).toBeVisible();
    await p.getByRole('button',{name:'关闭课程目录',exact:true}).click();
    await p.locator('.journey-start').click();await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});
    const state=await(await page.request.get(base+'api/admin/state')).json(),group=state.classes.find(c=>c.name==='采集边界验收');
    await page.goto(base+'?preview='+encodeURIComponent(group.id));
    expect(await page.locator('script[src$="/viewport-metrics.js"]').count()).toBe(0);
  }finally{await context.close();}
});
