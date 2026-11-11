'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {activity}=require('../support/thirteen-types-flow');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const sizes=[[375,667],[320,568],[600,800],[601,800],[768,1024],[1280,800],[667,375],[375,667]];
const parts=['.story-award-brand,.card-brand','.story-award-title,.card-title','.story-award-name,.card-name','.story-award-stars,.card-stars','.story-award-illustration,.card-scene','.story-award-foot,.card-caption'];

async function geometry(card){
 await expect(card).toBeVisible({timeout:20000});
 await expect.poll(()=>card.evaluate(el=>{const b=el.getBoundingClientRect();return Math.abs(b.width/b.height-1640/880);})).toBeLessThan(.003);
 return card.evaluate((el,selectors)=>{const b=el.getBoundingClientRect();return selectors.map(selector=>{const r=el.querySelector(selector).getBoundingClientRect();return [(r.left-b.left)/b.width,(r.top-b.top)/b.height,r.width/b.width,r.height/b.height];});},parts);
}
function sameComposition(actual,expected){actual.forEach((part,i)=>part.forEach((value,j)=>expect(Math.abs(value-expected[i][j]),parts[i]+' keeps its place').toBeLessThan(.004)));}

test('课程纪念卡跨手机、平板、电脑保持横版比例与同一构图',async({page,browser},info)=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'纪念卡比例验收','小禾',[/Lesson 1–2 /,/Lesson 5–6 /,/Lesson 45–46 /,/Lesson 143–144 /]);
 const learner=await studentLogin(browser,account,base,{viewport:{width:375,height:667},hasTouch:true}),p=learner.page;
 try{
  for(const pair of ['1-2','5-6','45-46','143-144']){
   await p.goto(base+'unit'+pair+'/#learn/certificate');
   await expect(p.locator('#courseLoader')).toHaveCount(0,{timeout:30000});await p.evaluate(()=>document.fonts.ready);
   const card=p.locator('.stage-certificate .story-award-paper');let original;
   for(const [width,height]of sizes){
    await p.setViewportSize({width,height});const current=await geometry(card);if(original)sameComposition(current,original);else original=current;
    expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(pair==='1-2'&&[375,1280].includes(width))await card.screenshot({path:info.outputPath(`course-${width}x${height}.png`)});
   }
  }
  expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual([]);
 }finally{await learner.context.close();}
});

test('真实得星卡片与课程及纪念册共用横版构图，旋转不改变星数',async({page,browser},info)=>{
 test.setTimeout(90000);await adminLogin(page,base);
 const account=await createStudent(page,'得星横版验收','小禾',[/Lesson 1–2 /]),learner=await studentLogin(browser,account,base,{viewport:{width:375,height:667},hasTouch:true}),p=learner.page;
 try{
  await activity(p,'1-2','listen',{base:base.slice(0,-1),keepAward:true});
  const reveal=p.getByRole('dialog',{name:/纪念卡结算/});await expect(reveal).toHaveAttribute('data-dismissible','true');
  const card=reveal.locator('.story-award-paper');const original=await geometry(card);
  const before=(await(await p.request.get(base+'api/awards')).json()).cards;
  for(const [width,height]of sizes){
   await p.setViewportSize({width,height});sameComposition(await geometry(card),original);
   await expect(card.locator('.award-star[data-earned="true"]')).toHaveCount(1);
   const b=await card.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.y).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width);expect(b.y+b.height).toBeLessThanOrEqual(height);
   if(width===375)await p.screenshot({path:info.outputPath('reveal-375.png')});
  }
  await reveal.press('Escape');await p.goto(base+'unit1-2/#learn/certificate');
  sameComposition(await geometry(p.locator('.story-award-panel .story-award-paper')),original);
  await p.getByRole('link',{name:'我的纪念册',exact:true}).click();await expect(p.locator('.postoffice-scene')).toHaveAttribute('aria-busy','false');
  await p.getByRole('button',{name:/^查看并保存纪念卡：Lesson 1–2 /}).click();
  const sheet=p.getByRole('dialog',{name:'Lesson 1–2 纪念卡',exact:true});
  sameComposition(await geometry(sheet.locator('.certificate')),original);
  expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(before);
 }finally{await learner.context.close();}
});
