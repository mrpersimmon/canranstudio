'use strict';
const {test,expect}=require('@playwright/test');
const {devices}=require('../support/required-phone-devices');
const {definition}=require('../../server/progress');
const {profilesFor}=require('../../scripts/prepare-word-decks');
const deck=require('../../core/word-deck');
const adoptions=require('../../assets/word-art-v2/adoptions.json');
const units=process.env.SAMPLE_UNITS?.split(',')||['unit1-2','unit3-4','unit5-6','unit7-8','unit9-10','unit11-12'];
test.describe.configure({mode:'parallel'});
for(const unit of units)test(unit+' real grouped word cards preserve every word and stable phone interactions',async({page},info)=>{
 test.setTimeout(600000); // Later units contain up to 57 original words across three phone sizes.
 const original=definition(process.cwd(),unit,'/'),profiles=profilesFor(process.cwd(),unit,original),pages=deck.createPages(original.learning.WORDS,profiles);
 const catalog=await(await page.request.get('/review/catalog.json')).json(),entries=catalog.courses.find(c=>c.id===unit).entries.filter(e=>e.kind==='words');
 expect(entries.map(e=>e.wordKind),'the bench must expose the actual course groups').toEqual(pages.map(p=>p.kind));
 await page.goto('/?'+new URLSearchParams({unit,page:'words-0',device:devices[0].id}));await expect(page.locator('#loading')).toBeHidden({timeout:45000});await expect(page.locator('#error')).toBeHidden();
 const frame=page.frameLocator('#frame-shell iframe:not(.pending)'),documentFrame=page.frames().find(f=>f.parentFrame()===page.mainFrame());
 await expect(frame.locator('.word-kind-tabs')).toHaveCount(0);
 const protectedState=()=>documentFrame.evaluate(()=>{const n=JSON.parse(localStorage.getItem(CanranCore.learningContext.progress.learningKey));return{groups:n.groups,records:n.records,completed:n.activity.unitCompleted,claims:n.activity.unitAwardClaims};});
 const before=await protectedState();
 await documentFrame.evaluate(()=>{window.deckPaintEvents=0;new MutationObserver(()=>{if(document.documentElement.hasAttribute('data-course-painting'))window.deckPaintEvents++;}).observe(document.documentElement,{attributes:true,attributeFilter:['data-course-painting']});});
 for(const [index,expected]of pages.entries()){
  if(index)await frame.locator('.word-controls button').last().click();
  const cards=frame.locator('.unit-word');await expect(cards.locator('strong')).toHaveText(expected.words.map(w=>w.en));
  await expect(page.locator('#current-title')).toHaveText(`词卡 · 第 ${index+1} 组`);
  await expect(frame.locator('#wordPageProgress')).toHaveText(`${index+1} / ${pages.length}`);
  await expect(frame.locator('.word-controls button').last()).toHaveText(index===pages.length-1?'下一站':'下一组');
  for(const device of devices){
   await page.locator('#device').selectOption(device.id);await expect(frame.locator('body')).toHaveAttribute('data-practice-viewport',device.viewport.width+'x'+device.viewport.height);
   const footer=await frame.locator('.word-controls').boundingBox();
   if(expected.words.length<6){const aligned=await cards.evaluateAll(items=>{const grid=items[0].parentElement.getBoundingClientRect(),p=items[0].closest('.learning-word-content').getBoundingClientRect(),first=items[0].getBoundingClientRect();return{left:first.left-grid.left,top:grid.top-p.top};});expect(Math.abs(aligned.left)).toBeLessThan(1);expect(Math.abs(aligned.top)).toBeLessThan(1);}
   for(const [i,word]of expected.words.entries()){
    const card=cards.nth(i),kind=profiles[word.en].kind;await expect(card).toHaveAttribute('data-word-kind',kind);await expect(card).toBeInViewport();
    const issues=await card.evaluate(e=>{const b=e.getBoundingClientRect(),parent=e.closest('.learning-word-content').getBoundingClientRect();return{scroll:e.scrollHeight-e.clientHeight,bottom:b.bottom-parent.bottom,late:[...e.querySelectorAll('img')].filter(im=>im.getClientRects().length&&!im.closest('[hidden]')&&(!im.complete||!im.naturalWidth)).length};});
    expect(issues.scroll,unit+' '+word.en+' '+device.id).toBeLessThanOrEqual(1);expect(issues.bottom).toBeLessThanOrEqual(1);expect(issues.late).toBe(0);
    if(kind==='context'){await expect(card.locator('img')).toHaveCount(0);if(profiles[word.en].presentation==='word')await expect(card.locator('.word-context')).toHaveCount(0);else{await expect(card.locator('.word-context')).toHaveText(profiles[word.en].sentence);const focus=profiles[word.en].focus||word.en;expect((await card.locator('.word-context mark').allTextContents()).map(x=>x.toLowerCase())).toEqual((Array.isArray(focus)?focus:[focus]).map(x=>x.toLowerCase()));}}
    else {const art=adoptions.entries.find(item=>item.unit===unit&&item.word===word.en);await expect(card).toHaveAttribute('data-word-art',art.presentation||'illustration');if(art.composition)await expect(card.locator('.sample-word-art')).toBeVisible();else if(unit!=='unit5-6')await expect(card.locator(':scope>img')).toHaveAttribute('src','/lesson'+art.asset);}
    const box=await card.boundingBox();await card.click();await expect(card.locator('.word-meaning')).toHaveText(word.cn);await expect(card.locator('.word-phonetic')).toHaveText(word.ph);
    expect(await card.boundingBox()).toEqual(box);expect(await card.evaluate(e=>e.querySelector('strong').getBoundingClientRect().top>=e.getBoundingClientRect().top)).toBe(true);
    if(word.example){await expect(card.locator('.word-example')).toHaveText(word.example);if(word.example!==profiles[word.en].sentence)await expect(card.locator('.word-example')).toBeVisible();}
    await card.click();expect((await frame.locator('.word-controls').boundingBox()).y).toBe(footer.y);
   }
   expect(await frame.locator('.word-controls').evaluate(e=>e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(device.viewport.height-5);
   await page.locator('#frame-shell').screenshot({path:info.outputPath(expected.kind+'-'+expected.local+'-'+device.id+'.png')});
  }
 }
 expect(await protectedState()).toEqual(before);expect(await documentFrame.evaluate(()=>window.deckPaintEvents)).toBe(0);
 await frame.locator('.word-controls button').last().click();await expect(frame.locator('body')).toHaveAttribute('data-learning-view','question');
 await frame.getByRole('link',{name:'词汇',exact:true}).click();await expect(frame.locator('.unit-words')).toHaveAttribute('data-word-kind',pages.at(-1).kind);
 expect(await protectedState()).toEqual(before);
});
