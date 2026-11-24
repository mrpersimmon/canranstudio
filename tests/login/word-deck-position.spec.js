'use strict';
const {test,expect}=require('@playwright/test');
const {adminLogin,createStudent,studentLogin}=require('./helpers');
const {devices,contextOptions}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const {courseReadyForAssertions}=require('../support/completion-layout');
const base=process.env.AWARD_TEST_BASE||'/lesson/';
const units=process.env.WORD_DECK_UNITS?.split(',')||['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12'];
for(const [i,unit]of units.entries())test(unit+' legacy words resume by anchor and grouped position survives a fresh signed-in session',async({page,browser})=>{
 test.setTimeout(120000);const d=devices[i%devices.length],source=definition(process.cwd(),unit,'/'),legacyPage=Math.min(2,Math.ceil(source.learning.WORDS.length/6)-1),legacyWord=source.learning.WORDS[legacyPage*6].en;
 await adminLogin(page,base);const account=await createStudent(page,'词卡续学-'+unit,'小禾',[new RegExp('Lesson '+unit.slice(4).replace('-','–')+' ')]);
 let session=await studentLogin(browser,account,base,contextOptions(d)),p=session.page;
 try{
  // Seed the old page through the authenticated protocol before opening the
  // new renderer. No answer, completion or star is manufactured by this seed.
  const headers={Origin:new URL(p.url()).origin},entry=await p.request.post(base+'api/courses/'+unit+'/enter',{headers,data:{}});expect(entry.ok()).toBe(true);const access=await entry.json();
  const seed=await p.request.post(base+'api/progress',{headers,data:{course:unit,studentId:access.student.id,grant:access.grant,generation:access.progress.generation,epoch:access.systemUpgrade?.epoch,value:{version:1,groups:{},records:{},activity:{unitWordPage:legacyPage}}}});expect(seed.ok()).toBe(true);
  await p.goto(base+unit+'/#learn/words');await courseReadyForAssertions(p);
  await expect(p.getByRole('button',{name:legacyWord,exact:true})).toBeVisible();
  const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey)));
  expect((await saved()).activity.unitWordDeck.anchor).toBe(legacyWord);expect((await saved()).activity.unitWordPage).toBe(legacyPage);
  const initialGroups=(await saved()).groups;
  const pageIndex=async()=>Number((await p.locator('#wordPageProgress').textContent()).split('/')[0].trim())-1;
  const goToPage=async target=>{for(let tries=0;tries<10;tries++){const current=await pageIndex();if(current===target)return;const controls=p.locator('.word-controls button');await(current<target?controls.last():controls.first()).click();}throw Error('Unable to reach word page');};
  const pageCount=Math.ceil(source.learning.WORDS.length/6),targetIndex=((await pageIndex())+1)%pageCount;
  await goToPage(targetIndex);const card=p.locator('.unit-word').last(),anchor=await card.getAttribute('aria-label');
  const synced=p.waitForResponse(r=>{if(!r.url().endsWith('/api/progress'))return false;try{return r.request().postDataJSON()?.value?.activity?.unitWordDeck?.anchor===anchor;}catch{return false;}},{timeout:15000});
  await card.click();expect((await synced).ok()).toBe(true);
  await p.reload();await courseReadyForAssertions(p);expect(await pageIndex()).toBe(targetIndex);await expect(p.getByRole('button',{name:anchor,exact:true})).toBeVisible();
  expect((await saved()).groups).toEqual(initialGroups);expect((await saved()).records).toEqual({});await expect(p.locator('#starCount')).toHaveText('0');
  await session.context.close();session=await studentLogin(browser,account,base,contextOptions(d));p=session.page;
  await p.goto(base+unit+'/#learn/words');await courseReadyForAssertions(p);
  expect(await pageIndex()).toBe(targetIndex);await expect(p.getByRole('button',{name:anchor,exact:true})).toBeVisible();
  expect((await saved()).activity.unitWordDeck.anchor).toBe(anchor);expect((await saved()).records).toEqual({});await expect(p.locator('#starCount')).toHaveText('0');
  if(i===0){
   await p.route('**/api/progress',route=>route.abort());
   await goToPage((targetIndex+1)%pageCount);
   const offlineCard=p.locator('.unit-word').last(),offlineAnchor=await offlineCard.getAttribute('aria-label');await offlineCard.click();
   await p.reload();await courseReadyForAssertions(p);expect((await saved()).activity.unitWordDeck.anchor,'an older remote reading position must not replace unsynced local navigation').toBe(offlineAnchor);
   await expect(p.getByRole('button',{name:offlineAnchor,exact:true})).toBeVisible();await p.unroute('**/api/progress');
  }
 }finally{await session.context.close();}
});
