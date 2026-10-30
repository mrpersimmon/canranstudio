'use strict';
const {test,expect}=require('@playwright/test');
const path=require('node:path');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {createAwardBook}=require('../../scripts/award-book-bundle');
const {courseResponse}=require('../support/course-response-faults');
const base=process.env.AWARD_TEST_BASE||'/lesson/';

// Presentation contract only. Real earning, permanent dates, legacy certificates
// and owner isolation remain covered by award-book.spec.js and upgrade tests.
async function collectionFixture(page,browser,{holdInterfaceFont=false,holdOriginalFont=false}={}){
 await adminLogin(page,base);const account=await createStudent(page,'邮局交互样本','收藏同学',[/Lesson 1–2/]);
 const session=await studentLogin(browser,account,base),p=session.page;
 const actual=await(await p.request.get(base+'api/awards')).json(),bundle=await createAwardBook(path.resolve(__dirname,'../..'),base);
 const cards=Object.entries(bundle.editions).map(([course,editions])=>{const [edition,meta]=Object.entries(editions).at(-1);return {...meta,course,edition,id:course+':'+edition,current:true,name:'收藏同学',stars:5,firstFullStarAt:'2026-10-16T03:00:00.000Z'};}).sort((a,b)=>+a.course.match(/\d+/)[0]- +b.course.match(/\d+/)[0]);
 await courseResponse(p,base+'api/awards',{json:{...actual,cards:holdOriginalFont?cards.filter(card=>card.course==='unit7-8'):cards}});
 const fontFile=[...bundle.files.keys()].find(file=>/postoffice-ui-500-.*\.woff2$/.test(file));expect(fontFile).toBeTruthy();
 const interfaceFont=base+fontFile;
 const originalFont=base+[...bundle.files.keys()].find(file=>/award-gothic-500-.*\.woff2$/.test(file));
 if(holdInterfaceFont)await courseResponse(p,interfaceFont,{hold:true});
 if(holdOriginalFont)await courseResponse(p,originalFont,{hold:true});
 await p.goto(base+'awards/',{waitUntil:'domcontentloaded'});
 if(!holdOriginalFont)await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit1-2');
 return {...session,cards,interfaceFont,originalFont,cleanup:()=>p.request.post('/__test__/course-responses',{data:{reset:true}})};
}

test('原卡完整字库冷载超过20秒时继续等待，恢复后保留原名原星数',async({page,browser})=>{
 test.setTimeout(90000);const fixture=await collectionFixture(page,browser,{holdOriginalFont:true}),p=fixture.page;
 try{
  await expect.poll(async()=>await(await p.request.get('/__test__/course-held')).json()).toContain(fixture.originalFont);
  // Deliberately cross the former deadline; this is a controlled HTTP hold.
  await p.waitForTimeout(21000);
  await expect(p.getByRole('heading',{name:'正在准备你的纪念卡…',exact:true})).toBeVisible();
  await expect(p.getByRole('heading',{name:'暂时打不开纪念卡',exact:true})).toHaveCount(0);
  await courseResponse(p,fixture.originalFont,null,{resumeHeld:true});
  const card=p.locator('.postoffice-hero-card .certificate');await expect(card).toHaveAttribute('data-unit','unit7-8');await expect(card).toHaveAttribute('data-stars','5');await expect(card.locator('.card-name')).toHaveText('收藏同学');
 }finally{await fixture.cleanup();await fixture.context.close();}
});

test('界面字体持续等待也不能阻止原卡出现和保存',async({page,browser})=>{
 test.setTimeout(90000);const fixture=await collectionFixture(page,browser,{holdInterfaceFont:true}),p=fixture.page;
 try{
  await expect.poll(async()=>await(await p.request.get('/__test__/course-held')).json()).toContain(fixture.interfaceFont);
  const hero=p.locator('.postoffice-hero-card');await expect(hero.locator('.certificate')).toHaveAttribute('data-unit','unit1-2');
  await hero.click();const modal=p.getByRole('dialog',{name:'Lesson 1–2 纪念卡'});
  const saved=p.waitForEvent('download');await modal.getByRole('button',{name:'保存动图',exact:true}).click();expect((await saved).suggestedFilename()).toMatch(/\.gif$/);
  await expect(modal.locator('.card-name')).toHaveText('收藏同学');
 }finally{await fixture.cleanup();await fixture.context.close();}
});

test('72主卡跨章搜索、全角课号、范围与本章记忆，无重复查看入口',async({page,browser})=>{
 test.setTimeout(90000);const fixture=await collectionFixture(page,browser),p=fixture.page;
 try{
  await p.setViewportSize({width:390,height:844});
  await p.getByRole('button',{name:'搜索 Lesson 或纪念卡名称',exact:true}).click();
  await expect(p.locator('.directory-current .directory-row')).toHaveCount(72);
  // Long result lists must remain within both phone and desktop viewports.
  for(const [width,height] of [[320,568],[390,300],[768,900],[1440,900]]){
   await p.setViewportSize({width,height});
   await expect(p.getByRole('dialog',{name:'搜索纪念卡'})).toHaveCSS('--visible-height',height+'px');
   const bounds=await p.getByRole('dialog',{name:'搜索纪念卡'}).boundingBox();
   expect(bounds.y).toBeGreaterThanOrEqual(0);expect(bounds.y+bounds.height).toBeLessThanOrEqual(height+1);
  }
  await p.setViewportSize({width:390,height:844});
  const query=p.getByRole('searchbox',{name:'搜索 Lesson 或卡名',exact:true});
  for(const [term,expected] of [['Lesson ８',1],['7—12',3],['12-7',0],['145',0],['Ｌｅｓｓｏｎ １４４',1]]){await query.fill(term);await expect(p.locator('.directory-row')).toHaveCount(expected);}
  await query.press('Enter');await expect(p.locator('.postoffice-heading')).toContainText('Lesson 139–144');
  await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit143-144');
  await p.getByRole('button',{name:/^章节信箱 24/}).click();await p.getByRole('dialog',{name:'章节信箱'}).getByRole('button',{name:/Lesson 7–12/}).click();
  await p.getByRole('button',{name:'选择 Lesson 11–12 归还物品小能手',exact:true}).click();
  await p.getByRole('button',{name:/^章节信箱 24/}).click();await p.getByRole('dialog',{name:'章节信箱'}).getByRole('button',{name:/Lesson 139–144/}).click();
  await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit143-144');
  await p.locator('.postoffice-hero-card').click();const detail=p.getByRole('dialog',{name:'Lesson 143–144 纪念卡'});
  await expect(detail.getByRole('button',{name:'下一张纪念卡'})).toBeDisabled();await expect(detail.locator('a')).toHaveCount(0);
  await detail.press('Escape');await expect(p.getByRole('button',{name:/^(查看原卡|放大查看原图)$/})).toHaveCount(0);
 }finally{await fixture.cleanup();await fixture.context.close();}
});

test('切章延迟保留旧卡，快速改选忽略迟到响应，失败后可原位重试',async({page,browser})=>{
 test.setTimeout(90000);const fixture=await collectionFixture(page,browser),p=fixture.page;
 try{
  await p.setViewportSize({width:1440,height:900});
  const target=fixture.cards.find(card=>card.course==='unit7-8');
  await courseResponse(p,target.scene,{hold:true});
  await p.locator('.postoffice-sidebar').getByRole('button',{name:/Lesson 7–12/}).click();
  await expect.poll(async()=>await(await p.request.get('/__test__/course-held')).json()).toContain(target.scene);
  await expect(p.getByRole('status')).toContainText('正在准备');await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit1-2');
  await p.locator('.postoffice-sidebar').getByRole('button',{name:/Lesson 13–18/}).click();
  await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit13-14');
  await courseResponse(p,target.scene,null,{resumeHeld:true});await expect(p.locator('.postoffice-scene')).toHaveAttribute('aria-busy','false');
  await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit13-14');
  const broken=fixture.cards.find(card=>card.course==='unit19-20');
  await courseResponse(p,broken.scene,{status:503});
  await p.locator('.postoffice-sidebar').getByRole('button',{name:/Lesson 19–24/}).click();
  const retry=p.getByRole('button',{name:'重新加载 Lesson 19–20',exact:true});await expect(retry).toBeVisible();
  await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit13-14');
  await courseResponse(p,broken.scene,null);await retry.click();await expect(p.locator('.postoffice-hero-card .certificate')).toHaveAttribute('data-unit','unit19-20');
  await expect(p.locator('.postoffice-card-entry')).toHaveCSS('opacity','1');
 }finally{await fixture.cleanup();await fixture.context.close();}
});
