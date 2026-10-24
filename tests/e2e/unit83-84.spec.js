'use strict';
const {test,expect}=require('@playwright/test');
test.use(process.env.UNIT83_BROWSER==='webkit'?{browserName:'webkit'}:{});const {activity,story,ANSWERS,select}=require('../support/unit8384');
test.use({actionTimeout:7000});
test('73题、五区五星、统一三卡、示范记录与零英语配音',async({page},info)=>{
 test.setTimeout(210000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(12);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&id==='exam'&&i===24)await expect(room.locator('.practice-context p')).toHaveText(['Apples ✗ not eaten','Oranges ✓ just eaten']);if(phase==='before'&&((id==='grammar'&&[0,3,6,13].includes(i))||(id==='apply'&&[1,3,6].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  for(const[i,name]of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await page.getByRole('button',{name:'学习手记',exact:true}).click();const records=page.locator('#learningRecord li');
 await expect(records.filter({hasText:'过去完成对现在的影响'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'撤去示范构造完成时问句'})).not.toContainText('看过示范');
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();await page.goto('/unit83-84/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('36张行前图鉴、完整IPA、末组推进与刷新',async({page})=>{
 await page.goto('/unit83-84/#learn/words');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'mess',exact:true});await expect(first).toContainText('/mes/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('杂乱；凌乱');await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();const words=[];
 for(let i=0;i<6;i++){await expect(room.locator('.unit-word')).toHaveCount(6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<5)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(words).toEqual(['mess','pack','suitcase','leave','already','just','yet','ever','never','before','untidy','living room','fruit','bananas','oranges','peaches','apples','vegetables','lettuce','cabbage','peas','beans','meat','beef','lamb','steak','chicken','milk','tea','coffee','wine','beer','packed','had','lived','holiday']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('6 / 6');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('连续两次错答、词块撤回、提示与刷新；订正不发星',async({page})=>{
 test.setTimeout(140000);await page.goto('/unit83-84/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});

 for(let i=0;i<2;i++){await select(room,'还完全没收拾');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===6){
   await expect(room.locator('.progress-copy')).toHaveText(`第 ${i+1} / ${ANSWERS.grammar.length} 题`);
   await expect(room.locator('.grammar-intro .practice-progress')).toBeFocused();
   await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'I',exact:true}).press('Enter');
   await expect(room.getByRole('group',{name:'已选词块',exact:true}).getByRole('button',{name:'撤回 I',exact:true})).toBeVisible();
   await page.reload();await room.getByRole('button',{name:'撤回 I',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===11){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=18)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===21?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['22','22','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['22','22','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对撤销、错误不消除选项、刷新保留但不代答',async({page})=>{
 await page.goto('/unit83-84/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});await select(room,'pack');await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await select(room,{pairs:[['suitcase','行李箱']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'suitcase',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'行李箱',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');
 const wrong=[['suitcase','杂乱'],['mess','离开'],['leave','行李箱']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}await select(room,ANSWERS.listen[1]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('检查正确才登记行前记录；第二题错两次的三卡为7／8／2',async({page})=>{
 test.setTimeout(100000);await page.goto('/unit83-84/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.visit-application');
 for(let i=0;i<8;i++){
  if(i===0)await expect(room.locator('.practice-context p')).toHaveText(['My checklist','Pack the suitcase ✓ done','The suitcase is ready.']);
  if(i===1)for(let k=0;k<2;k++){await select(room,'No, thank you. I haven’t had lunch yet.');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-opened','false');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-opened','false');if(i===1){await page.reload();await expect(world).toHaveAttribute('data-opened','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-opened',String([0,2].includes(i)));
  if([0,2].includes(i)){await page.reload();await expect(world).toHaveAttribute('data-opened','true');await expect(world.locator('.diary-page strong')).toHaveText(i===0?'Packing recorded':'Milk recorded');if(i===2)await expect(world.locator('.diary-page span')).toContainText('刚喝过牛奶');}
  await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }await expect(room.locator('.completion-number')).toHaveText(['7','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('两处填空未完成时不允许提交；刷新不代答',async({page})=>{
 test.setTimeout(90000);await page.goto('/unit83-84/#learn/exam');const room=page.locator('.stage-exam'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<10;i++){await select(room,ANSWERS.exam[i]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'has',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await expect(room.locator('.fb')).toHaveText('');await room.getByRole('group',{name:'第2处填空',exact:true}).getByRole('button',{name:'had',exact:true}).click();await expect(check).toBeEnabled();await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('全部声音失效也能完成五区',async({page})=>{test.setTimeout(210000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);});
test('84课20项食物大数、Grammar两种含义与A7/B10完整参考',async({page},info)=>{
 await page.goto('/unit83-84/#learn/apply');await page.getByText('课本小参考 · 20种食物与大数',{exact:true}).click();await expect(page.locator('.stage-apply .reference-card')).toHaveCount(20);
 expect(await page.locator('.stage-apply .reference-card h4').allTextContents()).toEqual(['fruit','bananas','oranges','peaches','apples','vegetables','lettuce','cabbage','peas','beans','meat','beef','lamb','steak','chicken','milk','tea','coffee','wine','beer']);
 expect(await page.locator('.stage-apply .reference-card small').allTextContents()).toEqual(['1,000','2,000','3,000','4,000','5,000','6,000','7,000','8,000','9,000','10,000','11,000','12,000','13,000','14,000','15,000','16,000','17,000','18,000','19,000','20,000']);await page.locator('.stage-apply .reference-grid').screenshot({path:info.outputPath('materials.png')});
 await page.goto('/unit83-84/#learn/grammar');await page.getByText('语法小参考',{exact:true}).click();for(const str of ['过去分词','持续到现在','haven’t','hasn’t','never','不代表插图里有几千份食物','不能把所有’s'])await expect(page.locator('.stage-grammar details').first()).toContainText(str);
 await page.goto('/unit83-84/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(7);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);for(const text of ['Have a glass of water.','Have some cheese.','Has he had any beans or peas? (He)','Have they had any bananas or oranges? (They)','I’ve already had one.','I haven’t had any vegetables. I’ve just had some fruit.'])await expect(page.locator('#unitWriting')).toContainText(text);
});

for(const width of [320,390,768,1280])test(`${width}宽与短屏：题型、三卡、字体及操作`,async({page},info)=>{
 test.setTimeout(210000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await room.locator('img').evaluateAll(els=>els.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);
   for(const btn of await room.locator('button:visible').all()){const b=await btn.boundingBox();expect(b.height).toBeGreaterThanOrEqual(43);}
   if(id==='exam'||(id==='grammar'&&i>=18))await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
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
 await page.setViewportSize({width,height:844});await page.goto('/unit83-84/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'mess',exact:true})).toBeVisible();
 for(let i=0;i<6;i++){
  for(const card of await room.locator('.unit-word').all()){await card.click();expect(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+2)).toBe(true);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(i===2)await room.screenshot({path:info.outputPath('long-word.png')});if(i<5)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
});
