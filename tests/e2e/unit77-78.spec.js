'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT77_BROWSER==='webkit'?{browserName:'webkit'}:{});const {activity,story,ANSWERS,select}=require('../support/unit7778');
test.use({actionTimeout:7000});
test('66题、五区五星、统一三卡、示范记录与零英语配音',async({page},info)=>{
 test.setTimeout(160000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(12);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&id==='exam'&&i===24)await expect(room.locator('.practice-context p')).toHaveText(['Ann: Monday, 2 p.m.','Ben: Tuesday, 2 p.m.','Tom: Monday, 10 a.m.']);if(phase==='before'&&((id==='grammar'&&[0,3,6,13].includes(i))||(id==='apply'&&[1,3,6].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  for(const[i,name]of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await page.getByRole('button',{name:'学习手记',exact:true}).click();const records=page.locator('#learningRecord li');
 await expect(records.filter({hasText:'识别缩略式否定疑问开头'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'撤去示范后按事实作答'})).not.toContainText('看过示范');
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();await page.goto('/unit77-78/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('24张诊所图鉴、完整IPA、末组推进与刷新',async({page})=>{
 await page.goto('/unit77-78/#learn/words');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'appointment',exact:true});await expect(first).toContainText('/əˈpɔɪntmənt/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('约会；预约');await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();const words=[];
 for(let i=0;i<4;i++){await expect(room.locator('.unit-word')).toHaveCount(6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<3)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(words).toEqual(['appointment','urgent','till','dentist','nurse','toothache','awful','busy','wait','moment','now','earlier','a.m.','p.m.','o’clock','half past','a quarter past','a quarter to','April','Monday','buy','bought','lose','lost']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('4 / 4');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('连续两次错答、词块撤回、提示与刷新；订正不发星',async({page})=>{
 test.setTimeout(140000);await page.goto('/unit77-78/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{locate:'you'});
 for(let i=0;i<2;i++){await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===2){
   await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${ANSWERS.grammar.length} 题`);
   await expect(room.locator('.grammar-intro .practice-progress')).toBeFocused();
   await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'Is',exact:true}).press('Enter');
   await expect(room.getByRole('group',{name:'已选词块',exact:true}).getByRole('button',{name:'撤回 Is',exact:true})).toBeVisible();
   await page.reload();await room.getByRole('button',{name:'撤回 Is',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===5){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=16)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===17?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['18','18','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['18','18','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对撤销、错误不消除选项、刷新保留但不代答',async({page})=>{
 await page.goto('/unit77-78/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});await select(room,'appointment');await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await select(room,{pairs:[['urgent','急迫的']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'urgent',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'急迫的',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');
 const wrong=[['urgent','等待'],['wait','直到……为止'],['till','急迫的']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}await select(room,ANSWERS.listen[1]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('检查正确才核对提议；第二题错两次的三卡为7／8／2',async({page})=>{
 test.setTimeout(100000);await page.goto('/unit77-78/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.visit-application');
 for(let i=0;i<8;i++){
  if(i===0)await expect(room.locator('.practice-context')).toHaveText('Can you come at 10 a.m. on Monday, April 24th?');
  if(i===1)for(let k=0;k<2;k++){await select(room,'02:00');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-opened','false');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-opened','false');if(i===1){await page.reload();await expect(world).toHaveAttribute('data-opened','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-opened',String(i<2));
  if(i<2){await page.reload();await expect(world).toHaveAttribute('data-opened','true');await expect(world.locator('.diary-page strong')).toHaveText(i===0?'10 a.m.':'14:00');if(i===0)await expect(world.locator('.diary-page span')).toContainText('提议');}
  await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }await expect(room.locator('.completion-number')).toHaveText(['7','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('两处填空未完成时不允许提交；刷新不代答',async({page})=>{
 test.setTimeout(90000);await page.goto('/unit77-78/#learn/exam');const room=page.locator('.stage-exam'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<19;i++){await select(room,ANSWERS.exam[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'in',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await expect(room.locator('.fb')).toHaveText('');await room.getByRole('group',{name:'第2处填空',exact:true}).getByRole('button',{name:'in',exact:true}).click();await expect(check).toBeEnabled();await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('全部声音失效也能完成五区',async({page})=>{test.setTimeout(160000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);});
test('78课十二钟点、星期月份年份日期、A5/B4与三例完整参考',async({page},info)=>{
 await page.goto('/unit77-78/#learn/apply');await page.getByText('课本小参考 · 十二个钟点',{exact:true}).click();await expect(page.locator('.stage-apply .reference-card')).toHaveCount(12);await expect(page.locator('.stage-apply .reference-card').first()).toContainText('at 1:00');await expect(page.locator('.stage-apply .reference-card').last()).toContainText('at 12:55');await page.locator('.stage-apply .reference-grid').screenshot({path:info.outputPath('twelve-clocks.png')});
 await page.goto('/unit77-78/#learn/grammar');await page.getByText('语法小参考',{exact:true}).click();for(const str of ['Is she not','Yes, she is','No, she isn’t','Won’t you','Couldn’t you','When did'])await expect(page.locator('.stage-grammar details').first()).toContainText(str);
 await page.getByText('课本小参考 · 星期、月份与日期',{exact:true}).click();await expect(page.locator('.writing-bank>div')).toHaveCount(4);for(const str of ['Sunday','December','2021','6th Dec.'])await expect(page.locator('.writing-bank')).toContainText(str);
 await page.goto('/unit77-78/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(5);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(4);for(const text of ['airs the room','quarter past eleven','5th January','half past seven','on Wednesday','in May'])await expect(page.locator('#unitWriting')).toContainText(text);
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
  for(const label of await room.locator('.completion-next-prefix,.completion-next-name').all())expect(await label.evaluate(e=>e.scrollWidth<=e.clientWidth+1&&e.getBoundingClientRect().height<=parseFloat(getComputedStyle(e).lineHeight)+2)).toBe(true);
  const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();
  expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
});
for(const width of [320,390,768,1280])test(`${width}宽：长词组音标翻卡不截断`,async({page},info)=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit77-78/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'appointment',exact:true})).toBeVisible();
 for(let i=0;i<4;i++){
  for(const card of await room.locator('.unit-word').all()){await card.click();expect(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+2)).toBe(true);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(i===3)await room.screenshot({path:info.outputPath('long-word.png')});if(i<3)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
});
