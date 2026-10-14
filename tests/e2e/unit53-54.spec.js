'use strict';
const {test,expect}=require('@playwright/test');const {activity,story,ANSWERS}=require('../support/unit5354');const {select}=require('../support/units1-30-tasks');
test.use({actionTimeout:7000});
test('69题、五区五星、统一三卡、示范记录与零英语配音',async({page},info)=>{
 test.setTimeout(150000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(8);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&((id==='grammar'&&[0,5,9,17].includes(i))||(id==='apply'&&[0,4,7].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  for(const[i,name]of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await page.getByRole('button',{name:'学习手记',exact:true}).click();const records=page.locator('#learningRecord li');
 await expect(records.filter({hasText:'分辨like的喜欢与状况用法'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'国家名与国籍词各就其位'})).toContainText('看过示范后完成');await expect(records.filter({hasText:'独立区分介词like与动词like'})).not.toContainText('看过示范');
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();
 await page.goto('/unit53-54/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('42张图鉴、方位与国家完整、IPA、末组推进与刷新',async({page})=>{
 await page.goto('/unit53-54/#learn/words');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'mild',exact:true});await expect(first).toContainText('/maɪld/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('温和的');
 await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();const words=[];
 for(let i=0;i<7;i++){await expect(room.locator('.unit-word')).toHaveCount(6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<6)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(words).toEqual(['mild','always','north','east','wet','west','south','season','best','night','rise','early','set','late','interesting','subject','conversation','day','Australia','Australian','Austria','Austrian','Canada','Canadian','China','Chinese','Finland','Finnish','India','Indian','Japan','Japanese','South Korea','South Korean','Nigeria','Nigerian','Poland','Polish','Thailand','Thai','Turkey','Turkish']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('7 / 7');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('语法错两次、部分填空、撤回、提示及刷新；订正不发星',async({page})=>{
 test.setTimeout(100000);await page.goto('/unit53-54/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<2;i++){await select(room,'像');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===3){await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'I',exact:true}).press('Enter');await page.reload();await room.getByRole('button',{name:'撤回 I',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===14){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'to have',exact:true}).click();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'to have',exact:true}).click();}
  if(i===7){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=14)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===17?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['18','18','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['18','18','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对可撤销、错项不消除、刷新不代答',async({page})=>{
 await page.goto('/unit53-54/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{pairs:[['north','北方']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'north',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'北方',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 4 对');
 const wrong=[['north','东方'],['east','北方'],['west','西方'],['south','南方']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}await select(room,ANSWERS.listen[0]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('接待记录只在检查正确后完成，订正统计为4／8／2',async({page})=>{
 test.setTimeout(90000);await page.goto('/unit53-54/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.weather-world');
 for(let i=0;i<8;i++){
  if(i===4){for(let k=0;k<2;k++){await select(room,['The sun','is','rises','early']);await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-observation','directions');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-sent','false');if(i===7){await page.reload();await expect(world).toHaveAttribute('data-sent','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-sent',String(i===7));
  if(i===7){await page.reload();await expect(world).toHaveAttribute('data-sent','true');await expect(world.locator('.weather-board')).toHaveAttribute('src',/board-complete/);}
  await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }await expect(room.locator('.completion-number')).toHaveText(['4','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('全部声音失效也能完成五区',async({page})=>{test.setTimeout(150000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);});
test('Lesson54十二组完整国籍来源与20th–103rd、四加十组书写材料',async({page})=>{
 await page.goto('/unit53-54/#learn/apply');await page.getByText('国家与国籍 · 12张访客卡',{exact:true}).click();await expect(page.locator('.reference-card')).toHaveCount(12);await expect(page.locator('.reference-card').first()).toContainText('20th · twentieth');await expect(page.locator('.reference-card').last()).toContainText('103rd · hundred and third');await expect(page.locator('.reference-card').nth(2)).toContainText('He comes from Canada.');
 await page.goto('/unit53-54/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(4);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);
});
for(const width of [320,390,768,1280])test(`${width}宽与短屏：题型、三卡、字体及操作`,async({page},info)=>{
 test.setTimeout(160000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await room.locator('img').evaluateAll(els=>els.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);
   for(const btn of await room.locator('button:visible').all()){const b=await btn.boundingBox();expect(b.height).toBeGreaterThanOrEqual(43);}
   if(id==='exam'||(id==='grammar'&&i>=14))await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
   if((id==='grammar'&&[0,11,17].includes(i))||(id==='apply'&&[1,4,7].includes(i)))await room.screenshot({path:info.outputPath(`${id}-${i}.png`)});
  }}});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
  const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();
  expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
});
for(const width of [320,390,768,1280])test(`${width}宽：长国籍词与音标不截断`,async({page},info)=>{
 await page.setViewportSize({width,height:844});await page.goto('/unit53-54/#learn/words');const room=page.locator('.stage-words');for(let i=0;i<5;i++)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 await expect(room.getByRole('button',{name:'South Korean',exact:true})).toBeVisible();expect(await room.locator('.unit-word strong,.word-phonetic').evaluateAll(els=>els.every(e=>e.scrollWidth<=e.clientWidth+1))).toBe(true);await room.screenshot({path:info.outputPath('long-words.png')});
});
