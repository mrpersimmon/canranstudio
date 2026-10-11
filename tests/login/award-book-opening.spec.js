'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {finishZone}=require('../support/unit1-2-award-flow');

async function observeOpening(page){
 await page.addInitScript(()=>{
  window.openingFrames=[];
  const sample=()=>{
   const cover=document.querySelector('.book-cover'),book=document.querySelector('.book');
   if(cover&&book&&getComputedStyle(cover).visibility==='visible'){
    const moving=cover.querySelector('.card-holder'),flat=book.querySelector(':scope > .leaf-left .card-holder');
    const box=el=>el?{x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}:null;
    window.openingFrames.push({opacity:getComputedStyle(cover).opacity,transform:getComputedStyle(cover).transform,moving:box(moving),flat:box(flat),ready:[...book.querySelectorAll('img')].every(img=>img.complete&&img.naturalWidth>0),width:document.documentElement.scrollWidth});
   }
   requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
 });
}

test('A 开场的封面始终不透明，真实卡片随封底落位并无跳变接到书页',async({page,browser})=>{
 test.setTimeout(90000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
 await adminLogin(page,base);const account=await createStudent(page,'侧翻开场班','小雨',[/Lesson 1–2/]);
 const learner=await studentLogin(browser,account,base),tab=learner.page;
 await finishZone(tab,'trans',{base:base+'unit1-2/'});await expect(tab.locator('#studentSyncStatus')).toHaveText('已同步');
 await tab.setViewportSize({width:1280,height:844});await observeOpening(tab);
 await tab.goto(base+'awards/');
 const cover=tab.getByRole('button',{name:'打开纪念册',exact:true});
 await expect(cover).toBeVisible();await expect(cover.getByRole('img',{name:'灿然英语工作室'})).toBeVisible();
 await expect(cover).toHaveCount(0);
 const frames=await tab.evaluate(()=>window.openingFrames);
 expect(frames.length).toBeGreaterThan(10);
 expect(new Set(frames.map(f=>f.transform)).size).toBeGreaterThan(5);
 expect(frames.every(f=>Number(f.opacity)===1),'封面不能靠淡出变透明结束').toBe(true);
 expect(frames.every(f=>f.ready),'开场中实际图片节点必须已可显示').toBe(true);
 const moving=frames.filter(f=>f.moving&&f.flat);
 expect(moving.length,'真实左页卡片应跟随翻动的封底').toBeGreaterThan(5);
 const last=moving.at(-1);
 for(const key of ['x','y','width','height'])expect(Math.abs(last.moving[key]-last.flat[key]),key+' 应无缝接上静态书页').toBeLessThan(2);
 await expect(tab.locator('.book')).toHaveAttribute('aria-busy','false');
 await expect(tab.getByRole('button',{name:'放大 Lesson 1–2 礼貌小帮手'})).toBeEnabled();
 await expect(tab.getByRole('complementary',{name:'开书动画方案比较'})).toHaveCount(0);
 await tab.screenshot({path:'output/login/album-opening-A-finished.png'});
 await learner.context.close();
});

test('手机自动侧翻与点击跳过保持书页可操作，旧样板网址不再显示比较条',async({page,browser})=>{
 test.setTimeout(90000);const base=process.env.AWARD_TEST_BASE||'/lesson/';
 await adminLogin(page,base);const account=await createStudent(page,'手机侧翻班','小雨',[/Lesson 1–2/]);
 const learner=await studentLogin(browser,account,base),tab=learner.page,errors=[];
 tab.on('pageerror',error=>errors.push(error.message));
 await finishZone(tab,'trans',{base:base+'unit1-2/'});await expect(tab.locator('#studentSyncStatus')).toHaveText('已同步');
 await tab.emulateMedia({reducedMotion:'reduce'});await observeOpening(tab);
 for(const width of [320,390]){
  await tab.setViewportSize({width,height:844});await tab.goto(base+'awards/');
  const cover=tab.getByRole('button',{name:'打开纪念册',exact:true});
  await expect(cover).toBeVisible();await expect(tab.getByRole('button',{name:'目录',exact:true})).toBeDisabled();
  const initial=await cover.evaluate(el=>getComputedStyle(el).transform);
  await expect.poll(()=>cover.evaluate(el=>getComputedStyle(el).transform)).not.toBe(initial);
  if(width===390)await cover.click({force:true});
  await expect(cover).toHaveCount(0);await expect(tab.locator('.book')).toHaveAttribute('aria-busy','false');
  const frames=await tab.evaluate(()=>window.openingFrames);
  expect(frames.length).toBeGreaterThan(2);expect(frames.every(f=>f.width<=width&&f.ready&&Number(f.opacity)===1)).toBe(true);
  await tab.getByRole('button',{name:'放大 Lesson 1–2 礼貌小帮手'}).click();
  const modal=tab.getByRole('dialog',{name:'Lesson 1–2 纪念卡'});await expect(modal).toBeVisible();
  await expect(modal.locator('.certificate')).toHaveAttribute('data-stars','1');
  await modal.press('Escape');await expect(cover).toHaveCount(0);
  await expect(tab.getByRole('button',{name:'放大 Lesson 1–2 礼貌小帮手'})).toBeFocused();
  await tab.screenshot({path:'output/login/album-opening-A-'+width+'.png'});
 }
 await tab.goto(base+'awards/?prototype=opening&variant=C');
 const cover=tab.getByRole('button',{name:'打开纪念册',exact:true});await expect(cover).toBeVisible();await cover.press('Space');
 await expect(cover).toHaveCount(0);await expect(tab.locator('.book')).toBeFocused();
 await expect(tab.getByRole('complementary',{name:'开书动画方案比较'})).toHaveCount(0);
 expect(errors).toEqual([]);await learner.context.close();
});
