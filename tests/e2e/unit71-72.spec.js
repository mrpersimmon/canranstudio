'use strict';
const {courseButton,courseReference,expectRecordExample,expectCompletionDestination,expectResultIcons,expectRoundCounts,expectVocabulary,incorrectFeedback,openCourseReference,openLearningRecord}=require('../support/course-controls');
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT71_BROWSER==='webkit'?{browserName:'webkit'}:{});const {activity,story,ANSWERS,select}=require('../support/unit7172');
test.use({actionTimeout:7000});
test('68题、五区五星、统一三卡、示范记录与零英语配音',async({page},info)=>{
 test.setTimeout(160000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(12);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&((id==='grammar'&&[0,3,6,13].includes(i))||(id==='apply'&&[1,3,6].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  await expectResultIcons(room);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await openLearningRecord(page);
 await expectRecordExample(page,"过去已发生动作",true);await expectRecordExample(page,"撤去示范区分习惯和昨天",false);
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();await page.goto('/unit71-72/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('34张电话图鉴、完整IPA、末组推进与刷新',async({page})=>{
 await page.goto('/unit71-72/#learn/words');await expect(page.locator('.unit-intro')).toHaveText('读懂故事里的话外音，用过去式把昨天的事情说清楚。');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'awful',exact:true});await expect(first).toContainText('/ˈɔːfəl/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('让人讨厌的；糟糕的');await expect(courseButton(room, "previousWords")).toBeDisabled();const words=[];
 for(let i=0;i<6;i++){await expect(room.locator('.unit-word')).toHaveCount(i===5?4:6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<5)await courseButton(room, "nextWords").click();}
 await expectVocabulary(page, words, ['awful','telephone','time','answer','last','phone','again','say','aired','cleaned','opened','sharpened','turned on','listened','boiled','arrived','played','stayed','shaved','climbed','telephoned','called','emptied','study','plan','stop','work','enjoy','yesterday','the day before yesterday','yesterday morning','yesterday afternoon','last night','the night before last']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('6 / 6');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('连续两次错答、两空门槛、词块撤回、提示与刷新；订正不发星',async({page})=>{
 test.setTimeout(140000);await page.goto('/unit71-72/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{fills:['cleans']});
 for(let i=0;i<2;i++){await check.click();await expect(room.locator('.fb')).toHaveText(await incorrectFeedback(room));await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===9){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'didn’t answer',exact:true}).click();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'didn’t answer',exact:true}).click();}
  if(i===14){
   await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${ANSWERS.grammar.length} 题`);
   await expect(room.locator('.grammar-intro .practice-progress')).toBeFocused();
   await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'When',exact:true}).press('Enter');
   await expect(room.getByRole('group',{name:'已选词块',exact:true}).getByRole('button',{name:'撤回 When',exact:true})).toBeVisible();
   await page.reload();await room.getByRole('button',{name:'撤回 When',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===4){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=16)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await courseButton(room, i===17?"finishPractice":'下一题').click();
 }
 await expectRoundCounts(room.locator('.completion-number'), ['18','18','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expectRoundCounts(room.locator('.completion-number'), ['18','18','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对撤销、错误不消除选项、刷新保留但不代答',async({page})=>{
 await page.goto('/unit71-72/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});await select(room,'a phone');await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await select(room,{pairs:[['once','一次']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'once',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'一次',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');
 const wrong=[['once','两次'],['twice','一次'],['three times','三次']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText(await incorrectFeedback(room));await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}await select(room,ANSWERS.listen[1]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('检查正确才登记来电；第二题错两次的三卡为7／8／2',async({page})=>{
 test.setTimeout(100000);await page.goto('/unit71-72/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.visit-application');
 for(let i=0;i<8;i++){
  if(i===1)for(let k=0;k<2;k++){await select(room,'I answered the phone at six yesterday evening.');await check.click();await expect(room.locator('.fb')).toHaveText(await incorrectFeedback(room));await expect(world).toHaveAttribute('data-stamped','false');await expect(world.locator('.diary-stamp')).toHaveCount(1);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-stamped','false');if(i===1){await page.reload();await expect(world).toHaveAttribute('data-stamped','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-stamped',String(i===1));
  if(i===1){await page.reload();await expect(world).toHaveAttribute('data-stamped','true');await expect(world.locator('.diary-stamp')).toHaveText('已核对 ✓');await expect(world.locator('.diary-stamp')).toHaveCount(1);}
  await courseButton(room, i===7?"finishPractice":'下一题').click();
 }await expectRoundCounts(room.locator('.completion-number'), ['7','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('全部声音失效也能完成五区',async({page})=>{test.setTimeout(160000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);});
test('72课15动作、12时间格与A4/B10练习纸',async({page})=>{
 await page.goto('/unit71-72/#learn/apply');await openCourseReference(page,'课本小参考 · 过去的动作');await expect(courseReference(page).locator(".reference-card")).toHaveCount(15);await expect(courseReference(page).locator(".reference-card").first()).toContainText('aired');await expect(courseReference(page).locator(".reference-card").last()).toContainText('emptied');await expect(courseReference(page).first()).toContainText('不绑定某一真实月份');
 await openCourseReference(page,'今天、昨天与前天');await expect(courseReference(page).locator(".time-reference td")).toHaveCount(12);await expect(courseReference(page).locator(".time-reference")).toContainText('the night before last');
 await page.goto('/unit71-72/#learn/grammar');await openCourseReference(page,'过去式小参考');for(const str of ['didn’t + 动词原形','元音字母+y','不双写','不固定等于过去','不是实际母亲接听'])await expect(courseReference(page)).toContainText(str);
 await page.goto('/unit71-72/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(4);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);
});
for(const width of [320,390,768,1280])test(`${width}宽与短屏：题型、三卡、字体及操作`,async({page},info)=>{
 test.setTimeout(170000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await room.locator('img').evaluateAll(els=>els.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);
   for(const btn of await room.locator('button:visible').all()){const b=await btn.boundingBox();expect(b.height).toBeGreaterThanOrEqual(43);}
   if(id==='exam'||(id==='grammar'&&i>=16))await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
   if((id==='grammar'&&[2,9,13].includes(i))||(id==='apply'&&[1,4,6].includes(i)))await room.screenshot({path:info.outputPath(`${id}-${i}.png`)});
  }}});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
  await expectCompletionDestination(room,id);
  const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();
  expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
});
for(const width of [320,390,768,1280])test(`${width}宽：长词组音标翻卡不截断`,async({page},info)=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit71-72/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'awful',exact:true})).toBeVisible();
 for(let i=0;i<6;i++){
  for(const card of await room.locator('.unit-word').all()){await card.click();expect(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+2)).toBe(true);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(i===5)await room.screenshot({path:info.outputPath('long-word.png')});if(i<5)await courseButton(room, "nextWords").click();
 }
});
