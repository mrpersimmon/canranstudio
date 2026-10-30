'use strict';
const {test,expect}=require('@playwright/test'),path=require('node:path'),fs=require('node:fs/promises');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {courseResponse}=require('../support/course-response-faults');
const {createAwardBook}=require('../../scripts/award-book-bundle');
const {inspectGifEdges}=require('../support/gif-edges');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
if(process.env.AWARD_CARD_BROWSER)test.use({browserName:process.env.AWARD_CARD_BROWSER});

test('实际下载GIF的60帧均无白边，圆角透明且卡框贴齐画布，保留原卡信息',async({page,browser},info)=>{
 test.setTimeout(150000);await adminLogin(page,base);const account=await createStudent(page,'无白边导出验收','小禾',[/Lesson 1–2/]);
 const learner=await studentLogin(browser,account,base),p=learner.page,receipts=[];
 try{
  const actual=await(await p.request.get(base+'api/awards')).json(),bundle=await createAwardBook(path.resolve(__dirname,'../..'),base);
  const samples=process.env.AWARD_GIF_EDGE_QUICK==='1'?[['unit1-2',1],['unit143-144',5]]:[['unit1-2',1],['unit3-4',3],['unit5-6',5],['unit45-46',5],['unit143-144',5]];
  const cards=samples.map(([course,stars])=>{const [edition,meta]=Object.entries(bundle.editions[course]).at(-1);return {...meta,course,edition,id:course+':'+edition,current:true,name:'喜欢英语的小禾',stars,firstFullStarAt:stars===5?'2026-10-16T03:00:00.000Z':null};});
  await courseResponse(p,base+'api/awards',{json:{...actual,cards}});await p.goto(base+'awards/');
  for(const card of cards){
   await p.getByRole('button',{name:'搜索 Lesson 或纪念卡名称',exact:true}).click();await p.getByRole('searchbox',{name:'搜索 Lesson 或卡名',exact:true}).fill(card.course.match(/\d+/)[0]);
   await p.locator('.directory-current .directory-row').click();const hero=p.locator('.postoffice-hero-card .certificate');await expect(hero).toHaveAttribute('data-unit',card.course);await expect(hero).toHaveAttribute('data-stars',String(card.stars));await expect(hero.locator('.card-name')).toHaveText(card.name);
   await p.locator('.postoffice-hero-card').click();const pending=p.waitForEvent('download');await p.getByRole('button',{name:'保存动图',exact:true}).click();const download=await pending,file=info.outputPath(card.course+'-'+card.stars+'.gif');await download.saveAs(file);expect(download.suggestedFilename()).toContain(card.name);
   receipts.push({course:card.course,stars:card.stars,...await inspectGifEdges(file,{full:card.stars===5})});await p.getByRole('button',{name:'关闭纪念卡',exact:true}).click();
  }
  await courseResponse(p,base+'api/awards',null);expect((await(await p.request.get(base+'api/awards')).json()).cards).toEqual(actual.cards);
  await fs.writeFile(info.outputPath('gif-edge-receipts.json'),JSON.stringify(receipts,null,2));await info.attach('gif-edge-receipts',{body:JSON.stringify(receipts,null,2),contentType:'application/json'});
 }finally{await p.request.post('/__test__/course-responses',{data:{reset:true}});await learner.context.close();}
});
