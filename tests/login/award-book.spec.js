'use strict';
const sharp=require('sharp');
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,addStudent,studentLogin,signIn,saveCourses}=require('./helpers');
const {finishZone}=require('../support/unit1-2-award-flow');
const unit34=require('../support/unit3-4-flow');
const unit56=require('../support/unit5-6-flow');
test.use({reducedMotion:'reduce',actionTimeout:10000});

async function expectCardLights(card, full) {
 await expect(card.locator('.award-star[data-earned="true"]')).toHaveCount(full?5:1);
 const light=card.locator('.award-star[data-earned="true"] .star-glint').first();
 const samples=await light.evaluate(async el=>{
  const frames=new Set();const start=performance.now();
  // A quiet interval between glints is intentional; observe up to one cycle.
  while(performance.now()-start<5300&&frames.size<4){const css=getComputedStyle(el);frames.add(css.opacity+':'+css.transform);await new Promise(requestAnimationFrame);}
  const css=getComputedStyle(el);return {frames:[...frames],duration:css.animationDuration,repeat:css.animationIterationCount};
 });
 expect(parseFloat(samples.duration)).toBeGreaterThan(1);expect(samples.repeat).toBe('infinite');expect(samples.frames.length).toBeGreaterThan(3);
 expect(await card.locator('.award-star[data-earned="false"]').evaluateAll(stars=>stars.every(el=>el.getAnimations({subtree:true}).length===0))).toBe(true);
 if(full){
  const ring=card.locator('.gold-light-ring');await expect(ring).toBeVisible();
  const first=await ring.evaluate(el=>getComputedStyle(el).backgroundImage);
  await expect.poll(()=>ring.evaluate(el=>getComputedStyle(el).backgroundImage)).not.toBe(first);
 }else await expect(card.locator('.gold-light-ring')).toHaveCount(0);
}

test('三单元真实获星入册、跨设备、翻页与动图不重复请求、账号隔离',async({page,browser})=>{
 test.setTimeout(240000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
 await adminLogin(page,base);const account=await createStudent(page,'纪念册班','小雨',[/Lesson 1–2/,/Lesson 3–4/,/Lesson 5–6/]);const other=await addStudent(page,'小明');
 const first=await studentLogin(browser,account,base),learner=first.page,errors=[];learner.on('pageerror',e=>errors.push(e.message));
 await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();await expect(learner.getByRole('heading',{name:'我的纪念册'})).toBeVisible();await expect(learner.getByText('点亮第一颗星，收藏第一张纪念卡。')).toBeVisible();
 await finishZone(learner,'trans',{base:base+'unit1-2/'});
 await expect(learner.locator('#studentSyncStatus')).toHaveText(/^(学习成果)?已同步$/);
 await unit34.completeUnit34(learner,base.slice(0,-1));await expect(learner.locator('#studentSyncStatus')).toHaveText(/^(学习成果)?已同步$/);
 await unit56.completeUnit56(learner,base.slice(0,-1));await expect(learner.locator('#studentSyncStatus')).toHaveText(/^(学习成果)?已同步$/);
 await expect(learner.locator('#certificateName')).toHaveText('小雨');
 // All three course cards export using the signed-in name, without a name form.
 for(const course of ['unit1-2','unit3-4','unit5-6']){
  await learner.goto(base+course+'/#learn/certificate');await expect(learner.getByRole('button',{name:'保存动图',exact:true})).toBeEnabled();await first.context.setOffline(true);const download=learner.waitForEvent('download');await learner.getByRole('button',{name:'保存动图',exact:true}).click();
  const file='output/login/'+course+'-keepsake.gif';await(await download).saveAs(file);const info=await sharp(file,{animated:true}).metadata();expect(info.format).toBe('gif');expect(info.width).toBe(984);expect(info.pageHeight).toBe(528);expect(info.pages).toBe(60);expect(info.loop).toBe(0);await first.context.setOffline(false);
 }
 await learner.emulateMedia({reducedMotion:'reduce'});
 await learner.getByRole('link',{name:'我的纪念册',exact:true}).click();
 await expect(learner.getByRole('group',{name:'纪念册书页，左右方向键翻页'})).toBeVisible();
 const cover=learner.getByRole('button',{name:'打开纪念册',exact:true});
 await expect(cover).toBeVisible();await expect(cover.getByRole('img',{name:'灿然英语工作室'})).toBeVisible();
 const coverStart=await cover.evaluate(el=>getComputedStyle(el).transform);
 await expect.poll(()=>cover.evaluate(el=>getComputedStyle(el).transform)).not.toBe(coverStart);
 await expect(cover).toHaveCount(0);
 await expect(learner.locator('.certificate').first()).toHaveAttribute('data-stars','1');await expect(learner.locator('.certificate').nth(1)).toHaveAttribute('data-stars','5');
 await expectCardLights(learner.locator('.certificate').first(),false);
 await expectCardLights(learner.locator('.certificate').nth(1),true);
 const api=await learner.request.get(base+'api/awards');expect(api.headers()['cache-control']).toBe('no-store');const saved=await api.json();expect(saved.cards.map(c=>c.stars)).toEqual([1,5,5]);expect(saved.cards[0].firstFullStarAt).toBeNull();
 const requests=[];learner.on('request',r=>{if(r.url().includes('/api/'))requests.push(r.url());});
 await learner.getByRole('button',{name:'下一页',exact:true}).click();await expect(learner.locator('.certificate').first()).toHaveAttribute('data-unit','unit5-6');
 await learner.getByRole('button',{name:'放大 Lesson 5–6 新朋友小使者',exact:true}).click();const modal=learner.getByRole('dialog',{name:'Lesson 5–6 纪念卡'});
 await expectCardLights(modal.locator('.certificate'),true);
 const download=learner.waitForEvent('download');await modal.getByRole('button',{name:'保存动图',exact:true}).click();await(await download).saveAs('output/login/album-friends.gif');
 await modal.getByRole('button',{name:'关闭纪念卡',exact:true}).click();await learner.getByRole('button',{name:'上一页',exact:true}).click();await expect(learner.locator('.book')).toHaveAttribute('aria-busy','false');expect(requests).toEqual([]);await expect(cover).toHaveCount(0);
 // Every visible image is decoded before the page is revealed; long-lived art
 // responses can be cached, while the collection never has shared caching.
 expect(await learner.locator('.book img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
 const scene=await learner.request.get(saved.cards[0].scene);expect(scene.headers()['cache-control']).toContain('immutable');
 for(const width of [320,390,768,1280]){
  await learner.setViewportSize({width,height:844});await expect(learner.locator('.book')).toBeVisible();expect(await learner.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(learner.locator('.page-count')).toHaveText(width<=700?'第 1 / 3 页':'第 1 / 2 页');
  const offsets=await learner.locator('.book-leaf:not(.empty-leaf)').evaluateAll(leaves=>leaves.map(leaf=>{const page=leaf.getBoundingClientRect(),card=leaf.querySelector('.card-holder').getBoundingClientRect();return {x:Math.abs(card.x+card.width/2-page.x-page.width/2),y:Math.abs(card.y+card.height/2-page.y-page.height/2)};}));
  for(const offset of offsets){expect(offset.x).toBeLessThan(2);expect(offset.y).toBeLessThan(2);}
  await learner.screenshot({path:'output/login/album-'+width+'.png'});
 }
 await learner.setViewportSize({width:1280,height:844});
 await learner.getByRole('button',{name:'目录',exact:true}).click();if(await learner.getByRole('switch',{name:'翻页动画'}).getAttribute('aria-checked')==='false')await learner.getByRole('switch',{name:'翻页动画'}).click();await learner.getByRole('button',{name:'关闭目录'}).click();
 const book=learner.locator('.book');if(await learner.getByRole('button',{name:'上一页',exact:true}).isEnabled()){await learner.getByRole('button',{name:'上一页',exact:true}).click();await expect(book).toHaveAttribute('aria-busy','false');}await expect(book).toHaveAttribute('data-motion','full');await learner.getByRole('button',{name:'下一页',exact:true}).click();
 const turning=learner.locator('.turning-leaf');await expect(turning).toBeVisible();
 const angles=await turning.evaluate(async el=>{const values=new Set(),started=performance.now();while(el.isConnected&&performance.now()-started<400){values.add(getComputedStyle(el).transform);await new Promise(requestAnimationFrame);}return [...values];});
 expect(angles.length,'翻页的纸张应持续转动').toBeGreaterThan(3);await expect(turning).toHaveCount(0);
 await expect(cover).toHaveCount(0);
 await learner.reload();await expect(cover).toBeVisible();await cover.press('Enter');await expect(cover).toHaveCount(0);await expect(book).toHaveAttribute('aria-busy','false');
 await page.getByRole('checkbox',{name:/Lesson 5–6/}).uncheck();await saveCourses(page);
 const second=await studentLogin(browser,account,base);await second.page.goto(base+'awards/');await expect(second.page.locator('.book')).toBeVisible();const onOtherDevice=await(await second.page.request.get(base+'api/awards')).json();expect(onOtherDevice.cards).toEqual(saved.cards);
 const guest=await browser.newContext(),anonymous=await guest.newPage();expect((await anonymous.request.get(base+'api/awards')).status()).toBe(401);await anonymous.goto(base+'awards/');await expect(anonymous.getByRole('button',{name:'进入我的课程'})).toBeVisible();await guest.close();
 const someone=await studentLogin(browser,other,base);await someone.page.goto(base+'awards/');await expect(someone.page.getByRole('heading',{name:'我的纪念册'})).toBeVisible();await expect(someone.page.locator('.certificate')).toHaveCount(0);
 const isolated=await(await someone.page.request.get(base+'api/awards?studentId='+saved.student.id)).json();expect(isolated.cards).toEqual([]);
 const switcher=await first.context.newPage();await switcher.goto(base);await switcher.getByRole('button',{name:'切换学生',exact:true}).click();await expect(learner.locator('.certificate')).toHaveCount(0);await expect(learner.getByRole('heading',{name:'请重新登录'})).toBeVisible();await signIn(switcher,other,base);await expect(learner.getByRole('heading',{name:'我的纪念册'})).toBeVisible();await expect(learner.locator('.certificate')).toHaveCount(0);
 expect(errors).toEqual([]);await first.context.close();await second.context.close();await someone.context.close();
});

test('素材失败只显示可重试加载页，网络恢复后整册显示',async({page,browser})=>{
 test.setTimeout(90000);const base=process.env.AWARD_TEST_BASE||'/lesson/';await adminLogin(page,base);const account=await createStudent(page,'纪念册加载班','小雨',[/Lesson 1–2/]);const learner=await studentLogin(browser,account,base);
 await finishZone(learner.page,'trans',{base:base+'unit1-2/'});await expect(learner.page.locator('#studentSyncStatus')).toHaveText(/^(学习成果)?已同步$/);
 let failed=true;await learner.page.route('**/awards/static/unit1-2-*.webp',route=>failed?route.abort():route.continue());
 await learner.page.goto(base+'awards/');await expect(learner.page.getByRole('heading',{name:'暂时打不开纪念册'})).toBeVisible();await expect(learner.page.locator('.book')).toHaveCount(0);
 failed=false;await learner.page.getByRole('button',{name:'再试一次',exact:true}).click();await expect(learner.page.locator('.book')).toBeVisible();await learner.context.close();
});

test('离开课程的待同步成果由纪念册恢复上传，长姓名不裁切',async({page,browser})=>{
 test.setTimeout(90000);const base=process.env.AWARD_TEST_BASE||'/lesson/',name='热爱探险和英语学习的小朋友李明小明';
 await adminLogin(page,base);const account=await createStudent(page,'离线纪念册班',name,[/Lesson 1–2/]);const learner=await studentLogin(browser,account,base);
 let blocked=true;await learner.page.route('**/api/progress',route=>blocked?route.abort():route.continue());
 await finishZone(learner.page,'trans',{base:base+'unit1-2/'});await expect(learner.page.locator('#starCount')).toHaveText('0');
 await learner.page.goto(base+'awards/');await expect(learner.page.getByText('点亮第一颗星，收藏第一张纪念卡。')).toBeVisible();await expect(learner.page.getByRole('status')).toContainText('待同步');
 blocked=false;await learner.page.reload();await expect(learner.page.locator('.book')).toBeVisible();await expect(learner.page.getByRole('button',{name:'打开纪念册',exact:true})).toHaveCount(0);await expect(learner.page.locator('.certificate')).toHaveAttribute('data-stars','1');
 await expect(learner.page.getByRole('button',{name:/^放大查看/})).toHaveCount(0);
 for(const width of [320,390,1280]){
  await learner.page.setViewportSize({width,height:844});const label=learner.page.locator('.card-name');await expect(label).toHaveText(name);
  expect(await label.evaluate(el=>el.scrollWidth<=el.clientWidth+1&&el.scrollHeight<=el.clientHeight+1)).toBe(true);
  const card=learner.page.getByRole('button',{name:'放大 Lesson 1–2 礼貌小帮手',exact:true});
  if(width===1280)await card.press('Enter');else await card.click();
  const modal=learner.page.getByRole('dialog',{name:'Lesson 1–2 纪念卡',exact:true});
  await expect(modal).toBeVisible();await expect(modal.locator('.card-name')).toHaveText(name);
  await modal.press('Escape');await expect(modal).not.toBeVisible();await expect(card).toBeFocused();
 }
 await learner.context.close();
});
