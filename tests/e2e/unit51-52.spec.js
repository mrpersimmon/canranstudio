'use strict';
const {test,expect}=require('@playwright/test');const {activity,story,ANSWERS}=require('../support/unit5152');const {select}=require('../support/units1-30-tasks');
test.use({actionTimeout:7000});
test('56题、五区五星、统一三卡、示范记录与零英语配音',async({page},info)=>{
 test.setTimeout(150000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(12);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&((id==='grammar'&&[0,6,7,11].includes(i))||(id==='apply'&&[0,4,7].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  for(const[i,name]of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await page.getByRole('button',{name:'学习手记',exact:true}).click();const records=page.locator('#learningRecord li');
 await expect(records.filter({hasText:'识别询问状况的意义'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'填写明信片上的国家来源'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'独立构成状况提问'})).not.toContainText('看过示范');
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();
 await page.goto('/unit51-52/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('42张图鉴、月份与国家完整、IPA、末组推进与刷新',async({page})=>{
 await page.goto('/unit51-52/#learn/words');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'Greece',exact:true});await expect(first).toContainText('/ɡriːs/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('希腊');
 await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();const words=[];
 for(let i=0;i<7;i++){await expect(room.locator('.unit-word')).toHaveCount(6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<6)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(words).toEqual(['Greece','climate','country','pleasant','weather','spring','windy','warm','rain','sometimes','summer','autumn','winter','snow','January','February','March','April','May','June','July','August','September','October','November','December','the U.S.','Brazil','the Netherlands','England','France','Germany','Italy','Norway','Russia','Spain','Sweden','always','often','shine','hot','cold']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('7 / 7');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('语法错两次、部分填空、撤回、提示及刷新；订正不发星',async({page})=>{
 test.setTimeout(100000);await page.goto('/unit51-52/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<2;i++){await select(room,'你喜欢什么天气');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===1){await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'What’s',exact:true}).press('Enter');await page.reload();await room.getByRole('button',{name:'撤回 What’s',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===2){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'climate',exact:true}).click();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'climate',exact:true}).click();}
  if(i===7){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=10)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===11?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['12','12','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['12','12','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对可撤销、错项不消除、刷新不代答',async({page})=>{
 await page.goto('/unit51-52/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{pairs:[['spring','春季']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'spring',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'春季',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 4 对');
 const wrong=[['spring','夏季'],['summer','春季'],['autumn','秋季'],['winter','冬季']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}await select(room,ANSWERS.listen[0]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('明信片只在检查正确后完成，订正统计为4／8／2',async({page})=>{
 test.setTimeout(90000);await page.goto('/unit51-52/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.climate-world');
 for(let i=0;i<8;i++){
  if(i===4){for(let k=0;k<2;k++){await select(room,'炎热的夏日');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-season','all');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-sent','false');if(i===7){await page.reload();await expect(world).toHaveAttribute('data-sent','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-sent',String(i===7));if(i===4)await expect(world).toHaveAttribute('data-season','winter');
  if(i===7){await page.reload();await expect(world).toHaveAttribute('data-sent','true');await expect(world.locator('.climate-album')).toHaveAttribute('src',/postcard/);}
  await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }await expect(room.locator('.completion-number')).toHaveText(['4','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('全部声音失效也能完成五区',async({page})=>{test.setTimeout(150000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);});
test('Lesson52十二组完整国籍来源与20th–31st、七加十组书写材料',async({page})=>{
 await page.goto('/unit51-52/#learn/apply');await page.getByText('国家与国籍 · 12张旅行卡',{exact:true}).click();await expect(page.locator('.reference-card')).toHaveCount(12);await expect(page.locator('.reference-card').first()).toContainText('20th · twentieth');await expect(page.locator('.reference-card').last()).toContainText('31st · thirty-first');await expect(page.locator('.reference-card').nth(2)).toContainText('She comes from the Netherlands.');
 await page.goto('/unit51-52/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(7);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);
});
for(const width of [320,390,768,1280])test(`${width}宽与短屏：题型、三卡、字体及操作`,async({page},info)=>{
 test.setTimeout(160000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await room.locator('img').evaluateAll(els=>els.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);
   for(const btn of await room.locator('button:visible').all()){const b=await btn.boundingBox();expect(b.height).toBeGreaterThanOrEqual(43);}
   if(id==='exam'||(id==='grammar'&&i>=10))await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
   if((id==='grammar'&&[0,6,11].includes(i))||(id==='apply'&&[1,4,7].includes(i)))await room.screenshot({path:info.outputPath(`${id}-${i}.png`)});
  }}});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
  const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();
  expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
});
for(const width of [320,390,768,1280])test(`${width}宽：所有月份与长国名词卡均可读`,async({page},info)=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit51-52/#learn/words');const room=page.locator('.stage-words');
 for(let i=0;i<7;i++){
  for(const card of await room.locator('.unit-word').all()){
   const b=await card.boundingBox();for(const el of await card.locator('strong:visible,.word-phonetic:visible,img:visible').all()){const t=await el.boundingBox();expect(t.x).toBeGreaterThanOrEqual(b.x-1);expect(t.x+t.width).toBeLessThanOrEqual(b.x+b.width+1);}
   await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await card.click();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(i===4)await room.screenshot({path:info.outputPath('countries.png')});if(i<6)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
});
