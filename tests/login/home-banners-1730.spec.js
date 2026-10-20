'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin,fillLogin}=require('./helpers');
const {PAIRS,ART,SHA,banners,imageHash}=require('../support/home-banners-1730');
test.use({actionTimeout:10000,...(process.env.BANNER_REVIEW_BROWSER==='webkit'?{browserName:'webkit'}:{})});
test('登录首页七个入口与课内封面、纪念卡使用同一现行插画，刷新和权限保留',async({page,browser},info)=>{
 test.setTimeout(240000);const base=process.env.AWARD_TEST_BASE||'/lesson/';await adminLogin(page,base);const account=await createStudent(page,'首页插画核对班','小禾',PAIRS.map(pair=>new RegExp('Lesson '+pair.replace('-','–')+' ')));const student=await studentLogin(browser,account,base);
 try{
  await expect(student.page.locator('.featured-course')).toHaveCount(7);await banners(student.page,base,info);
  for(const pair of PAIRS){
   await student.page.locator(`[data-unit="unit${pair}"] .primary-button`).click();await expect(student.page).toHaveURL(new RegExp('unit'+pair+'/#learn/words$'));await expect(student.page.locator('#wordPageProgress')).toBeVisible({timeout:30000});
   expect(await imageHash(student.page.locator('#cover .unit-cover-art img'))).toBe(SHA[pair]);expect(await imageHash(student.page.locator('.stage-certificate .story-award-illustration'))).toBe(SHA[pair]);
   if(pair==='17-18'){await student.page.goto(base+'unit17-18/#cover');await student.page.locator('#cover').screenshot({path:info.outputPath('unit17-18-cover.png')});await student.page.goto(base+'unit17-18/#learn/certificate');await student.page.locator('.story-award-panel').screenshot({path:info.outputPath('unit17-18-card.png')});}
   await student.page.getByRole('link',{name:'我的课程',exact:true}).click();await expect(student.page.locator('.featured-course')).toHaveCount(7);
  }
  await student.page.reload();for(const pair of PAIRS)await expect(student.page.locator(`[data-unit="unit${pair}"] .featured-art img`)).toHaveAttribute('src',base+ART[pair]);
  await student.page.goto(base+'unit31-32/');await expect(student.page.getByRole('heading',{name:'这节课还没向你的班级开放',exact:true})).toBeVisible();
 }finally{await student.context.close();}
});
test('新首页插画实际加载失败时不显示残缺入口，重试后恢复七个横幅',async({page,browser},info)=>{
 const base=process.env.AWARD_TEST_BASE||'/lesson/';await adminLogin(page,base);const account=await createStudent(page,'首页插画恢复班','小禾',PAIRS.map(pair=>new RegExp('Lesson '+pair.replace('-','–')+' ')));const setup=await studentLogin(browser,account,base);await setup.context.close();
 const context=await browser.newContext({serviceWorkers:'block'}),p=await context.newPage();let failures=0;const target='**/'+ART['17-18'];
 try{await p.route(target,r=>{failures++;return r.abort();});await p.goto(base);await fillLogin(p,account);await expect(p.getByRole('heading',{name:'画面还没准备好',exact:true})).toBeVisible();await expect(p.locator('.featured-course')).toHaveCount(0);expect(failures).toBeGreaterThan(0);await p.screenshot({path:info.outputPath('image-failure.png')});await p.unroute(target);await p.getByRole('button',{name:'再试一次',exact:true}).click();await expect(p.locator('.featured-course')).toHaveCount(7);for(const pair of PAIRS){const im=p.locator(`[data-unit="unit${pair}"] .featured-art img`);await expect(im).toHaveAttribute('src',base+ART[pair]);await expect.poll(()=>im.evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);}info.annotations.push({type:'actual-image-failures',description:String(failures)});
 }finally{await context.close();}
});
