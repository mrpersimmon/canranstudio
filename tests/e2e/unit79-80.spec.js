'use strict';
const {courseButton,courseReference,expectNoVerdict,expectRecordExample,expectResultIcons,expectRoundCounts,expectVocabulary,incorrectFeedback,openCourseReference,openLearningRecord}=require('../support/course-controls');
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT79_BROWSER==='webkit'?{browserName:'webkit'}:{});const {activity,story,ANSWERS,select}=require('../support/unit7980');
test.use({actionTimeout:7000});
test('62题、五区五星、统一三卡、示范记录与零英语配音',async({page},info)=>{
 test.setTimeout(160000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(13);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&id==='exam'&&i===22)await expect(room.locator('.practice-context p')).toHaveText(['Home: no writing paper; no eggs; enough bread.','Guide: writing paper — newsagent’s; eggs — grocer’s; bread — baker’s.']);if(phase==='before'&&((id==='grammar'&&[0,3,6,13].includes(i))||(id==='apply'&&[1,3,6].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  await expectResultIcons(room);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await openLearningRecord(page);
 await expectRecordExample(page,"must表示说话人认为有必要",true);await expectRecordExample(page,"独立根据必须的语境回答",false);
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();await page.goto('/unit79-80/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('36张购物图鉴、完整IPA、末组推进与刷新',async({page})=>{
 await page.goto('/unit79-80/#learn/words');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'shopping',exact:true});await expect(first).toContainText('/ˈʃɒpɪŋ/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('购物');await expect(courseButton(room, "previousWords")).toBeDisabled();const words=[];
 for(let i=0;i<6;i++){await expect(room.locator('.unit-word')).toHaveCount(6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<5)await courseButton(room, "nextWords").click();}
 await expectVocabulary(page, words, ['shopping','list','vegetable','need','hope','thing','money','groceries','fruit','stationery','newsagent','chemist','the grocer’s','the greengrocer’s','the butcher’s','the newsagent’s','the baker’s','the chemist’s','much','many','a lot of','some','any','at all','envelopes','glue','writing paper','medicine','cheese','bread','butter','jam','honey','beans','peas','cabbages']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('6 / 6');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('连续两次错答、词块撤回、提示与刷新；订正不发星',async({page})=>{
 test.setTimeout(140000);await page.goto('/unit79-80/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{locate:'go'});
 for(let i=0;i<2;i++){await check.click();await expect(room.locator('.fb')).toHaveText(await incorrectFeedback(room));await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===1){
   await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${ANSWERS.grammar.length} 题`);
   await expect(room.locator('.grammar-intro .practice-progress')).toBeFocused();
   await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'She',exact:true}).press('Enter');
   await expect(room.getByRole('group',{name:'已选词块',exact:true}).getByRole('button',{name:'撤回 She',exact:true})).toBeVisible();
   await page.reload();await room.getByRole('button',{name:'撤回 She',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===11){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=14)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await courseButton(room, i===15?"finishPractice":'下一题').click();
 }
 await expectRoundCounts(room.locator('.completion-number'), ['16','16','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expectRoundCounts(room.locator('.completion-number'), ['16','16','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对撤销、错误不消除选项、刷新保留但不代答',async({page})=>{
 await page.goto('/unit79-80/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});await select(room,'list');await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await select(room,{pairs:[['shopping','购物']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'shopping',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'购物',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');
 const wrong=[['shopping','需要'],['need','希望'],['hope','购物']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText(await incorrectFeedback(room));await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}await select(room,ANSWERS.listen[1]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('检查正确才登记清单；第二题错两次的三卡为7／8／2',async({page})=>{
 test.setTimeout(100000);await page.goto('/unit79-80/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.visit-application');
 for(let i=0;i<8;i++){
  if(i===0)await expect(room.locator('.practice-context p')).toHaveText(['Home stock','jam: none','potatoes: plenty','tea: enough']);
  if(i===1)for(let k=0;k<2;k++){if(k===0)await select(room,{fills:['much','many']});await check.click();await expect(room.locator('.fb')).toHaveText(await incorrectFeedback(room));await expect(world).toHaveAttribute('data-opened','false');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-opened','false');if(i===1){await page.reload();await expect(world).toHaveAttribute('data-opened','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-opened',String([0,4].includes(i)));
  if([0,4].includes(i)){await page.reload();await expect(world).toHaveAttribute('data-opened','true');await expect(world.locator('.diary-page strong')).toHaveText(i===0?'jam':'the baker’s');if(i===0)await expect(world.locator('.diary-page span')).toContainText('还未购买');}
  await courseButton(room, i===7?"finishPractice":'下一题').click();
 }await expectRoundCounts(room.locator('.completion-number'), ['7','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('两处填空未完成时不允许提交；刷新不代答',async({page})=>{
 test.setTimeout(90000);await page.goto('/unit79-80/#learn/exam');const room=page.locator('.stage-exam'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<16;i++){await select(room,ANSWERS.exam[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'don’t',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await expectNoVerdict(room.locator('.fb'));await room.getByRole('group',{name:'第2处填空',exact:true}).getByRole('button',{name:'to',exact:true}).click();await expect(check).toBeEnabled();await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('全部声音失效也能完成五区',async({page})=>{test.setTimeout(160000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);});
test('80课六类商店26种物品、语义边界与A5/B7完整参考',async({page},info)=>{
 await page.goto('/unit79-80/#learn/apply');await openCourseReference(page,'课本小参考 · 六类商店与26种物品');await expect(courseReference(page).locator(".reference-card")).toHaveCount(6);await expect(page.locator('.shop-goods li')).toHaveCount(26);
 const expected=['cheese','eggs','butter','honey','jam','biscuits','pears','oranges','bananas','beans','peas','cabbages','lamb','beef','steak','mince','chicken','glue','envelopes','writing paper','newspapers','magazines','bread','cakes','aspirins','medicine'];
 expect(await page.locator('.shop-goods li>span').allTextContents()).toEqual(expected);await courseReference(page).locator(".reference-grid").screenshot({path:info.outputPath('six-shops.png')});
 await page.goto('/unit79-80/#learn/grammar');await openCourseReference(page,'语法小参考');for(const str of ['mustn’t','needn’t','Need he come','She needs','Does he need','not much'])await expect(courseReference(page).first()).toContainText(str);
 await page.goto('/unit79-80/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(5);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(7);for(const text of ['I don’t have any eggs.','I haven’t got many eggs.','He hasn’t got much coffee.','Has he got any medicine?','意思'])await expect(page.locator('#unitWriting')).toContainText(text);
});
for(const width of [320,390,768,1280])test(`${width}宽与短屏：题型、三卡、字体及操作`,async({page},info)=>{
 test.setTimeout(170000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await room.locator('img').evaluateAll(els=>els.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);
   for(const btn of await room.locator('button:visible').all()){const b=await btn.boundingBox();expect(b.height).toBeGreaterThanOrEqual(43);}
   if(id==='exam'||(id==='grammar'&&i>=14))await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
   if((id==='grammar'&&[2,9,13].includes(i))||(id==='apply'&&[1,4,6].includes(i)))await room.screenshot({path:info.outputPath(`${id}-${i}.png`)});
  }}});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
  for(const label of await room.locator('.completion-next-prefix,.completion-next-name').all())expect(await label.evaluate(e=>e.scrollWidth<=e.clientWidth+1&&e.getBoundingClientRect().height<=parseFloat(getComputedStyle(e).lineHeight)+2)).toBe(true);
  const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();
  expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
});
for(const width of [320,390,768,1280])test(`${width}宽：长词组音标翻卡不截断`,async({page},info)=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit79-80/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'shopping',exact:true})).toBeVisible();
 for(let i=0;i<6;i++){
  for(const card of await room.locator('.unit-word').all()){await card.click();expect(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+2)).toBe(true);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(i===2)await room.screenshot({path:info.outputPath('long-word.png')});if(i<5)await courseButton(room, "nextWords").click();
 }
});
