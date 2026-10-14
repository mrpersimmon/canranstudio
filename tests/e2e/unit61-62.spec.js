'use strict';
const {test,expect}=require('@playwright/test');const {activity,story,ANSWERS,select}=require('../support/unit6162');
test.use({actionTimeout:7000});
test('63题、五区五星、统一三卡、示范记录与零英语配音',async({page},info)=>{
 test.setTimeout(160000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(15);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&((id==='grammar'&&[0,3,9,15].includes(i))||(id==='apply'&&[0,3,7].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  for(const[i,name]of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await page.getByRole('button',{name:'学习手记',exact:true}).click();const records=page.locator('#learningRecord li');
 await expect(records.filter({hasText:'have表示患病'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'读懂本课复合序数词'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'撤去示范独立说明原因'})).not.toContainText('看过示范');
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();await page.goto('/unit61-62/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('26张身体图鉴、完整IPA、末组推进与刷新',async({page})=>{
 await page.goto('/unit61-62/#learn/words');await expect(page.locator('.unit-intro')).toHaveText('读懂身体的信号，说清事情的原因。一起帮 Jimmy 请医生。');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'feel',exact:true});await expect(first).toContainText('/fiːl/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('感觉');await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();const words=[];
 for(let i=0;i<5;i++){await expect(room.locator('.unit-word')).toHaveCount(i===4?2:6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(words).toEqual(['feel','look','must','call','doctor','telephone','remember','mouth','tongue','bad','cold','news','headache','aspirin','earache','toothache','dentist','stomach ache','medicine','temperature','flu','measles','mumps','ill','because','so']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('5 / 5');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('错两次、部分填空、撤回、提示及刷新；订正不发星',async({page})=>{
 test.setTimeout(110000);await page.goto('/unit61-62/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<2;i++){await select(room,'吃掉');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===8){await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'She stays at home',exact:true}).press('Enter');await page.reload();await room.getByRole('button',{name:'撤回 She stays at home',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===1){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'a',exact:true}).click();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'a',exact:true}).click();}
  if(i===7){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=12)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===15?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['16','16','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['16','16','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对可撤销、错项不消除、刷新不代答',async({page})=>{
 await page.goto('/unit61-62/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});await select(room,'doctor');await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await select(room,{pairs:[['He feels ill.','他觉得不舒服。']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'He feels ill.',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'他觉得不舒服。',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 2 对');
 const wrong=[['He feels ill.','他看起来病了。'],['He looks ill.','他觉得不舒服。']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}await select(room,ANSWERS.listen[1]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('核对正确才联系医生；错两次订正及重进保留8／8／2',async({page})=>{
 test.setTimeout(90000);await page.goto('/unit61-62/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.visit-application');
 for(let k=0;k<2;k++){await select(room,'9754');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-sent','false');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(let i=0;i<8;i++){
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-sent','false');if(i===0){await page.reload();await expect(world).toHaveAttribute('data-sent','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-sent',String(i===0));
  if(i===0){await page.reload();await expect(world).toHaveAttribute('data-sent','true');await expect(world.locator('.application-phone')).toHaveCount(1);}
  await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }await expect(room.locator('.completion-number')).toHaveText(['8','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('全部声音失效也能完成五区',async({page})=>{test.setTimeout(160000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);});
test('62八组原文配句、正确变体边界、A6/B8书写与非医疗建议',async({page})=>{
 await page.goto('/unit61-62/#learn/apply');await page.getByText('课本配句 · 8组问答',{exact:true}).click();await expect(page.locator('.reference-grid .reference-card')).toHaveCount(8);await expect(page.locator('.reference-grid .reference-card').first()).toContainText('So she must take an aspirin.');await expect(page.locator('.reference-grid .reference-card').last()).toContainText('Susan has mumps.');await expect(page.locator('.stage-apply .reference-note').first()).toContainText('不是用药建议');
 await page.goto('/unit61-62/#learn/grammar');await page.getByText('情况和原因小参考',{exact:true}).click();await expect(page.locator('.stage-grammar details')).toContainText('mustn’t是禁止，不是“不必”');await expect(page.locator('.stage-grammar details')).toContainText('have the flu');
 await page.goto('/unit61-62/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(6);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(8);
});
for(const width of [320,390,768,1280])test(`${width}宽与短屏：题型、三卡、字体及操作`,async({page},info)=>{
 test.setTimeout(170000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await room.locator('img').evaluateAll(els=>els.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);
   for(const btn of await room.locator('button:visible').all()){const b=await btn.boundingBox();expect(b.height).toBeGreaterThanOrEqual(43);}
   if(id==='exam'||(id==='grammar'&&i>=12))await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
   if((id==='grammar'&&[2,9,13].includes(i))||(id==='apply'&&[0,4,7].includes(i)))await room.screenshot({path:info.outputPath(`${id}-${i}.png`)});
  }}});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
  const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();
  expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
});
for(const width of [320,390,768,1280])test(`${width}宽：长词组音标翻卡不截断`,async({page},info)=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit61-62/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'feel',exact:true})).toBeVisible();
 for(let i=0;i<5;i++){
  for(const card of await room.locator('.unit-word').all()){await card.click();expect(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+2)).toBe(true);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(i===3)await room.screenshot({path:info.outputPath('long-word.png')});if(i<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
});
