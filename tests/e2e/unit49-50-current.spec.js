'use strict';
const {test,expect}=require('@playwright/test');const {activity,story,ANSWERS}=require('../support/unit4950');const {select}=require('../support/units1-30-tasks');
test.use({actionTimeout:6000});
test('60题、五区五星、统一结算及零英语配音请求',async({page},info)=>{
 test.setTimeout(120000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(11);await expect(page.locator('#starCount')).toHaveText('0');let n=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'&&((id==='grammar'&&[0,2,8,10,13].includes(i))||(id==='apply'&&[0,2,5].includes(i))))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++n));await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  for(const[i,name]of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
  expect(await room.locator('.completion-next-prefix').evaluate(e=>e.getBoundingClientRect().height<=parseFloat(getComputedStyle(e).lineHeight)+2)).toBe(true);
 }
 await page.getByRole('button',{name:'学习手记',exact:true}).click();
 const records=page.locator('#learningRecord li');
 await expect(records.filter({hasText:'选择疑问句让对方选哪一种'})).toContainText('看过示范后完成');
 await expect(records.filter({hasText:'转述喜欢但本次不要'})).toContainText('看过示范后完成');
 await expect(records.filter({hasText:'撤去示范后构成选择问句'})).not.toContainText('看过示范');
 await page.getByRole('button',{name:'关闭',exact:true}).click();await page.reload();
 await page.getByRole('button',{name:'学习手记',exact:true}).click();await expect(records.filter({hasText:'转述喜欢但本次不要'})).toContainText('看过示范后完成');await page.getByRole('button',{name:'关闭',exact:true}).click();
 await page.goto('/unit49-50/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 expect(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('30张图鉴：首组翻义、IPA完整、末组推进与刷新',async({page})=>{
 await page.goto('/unit49-50/#learn/words');const room=page.locator('.stage-words'),first=room.getByRole('button',{name:'butcher',exact:true});
 await expect(first).toContainText('/ˈbʊtʃə/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('卖肉者');
 await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
 const words=[];for(let i=0;i<5;i++){await expect(room.locator('.unit-word')).toHaveCount(6);words.push(...await room.locator('.unit-word strong').allTextContents());expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);if(i<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(words).toEqual(['butcher','meat','beef','lamb','husband','steak','mince','chicken','tell','truth','either','tomato','potato','cabbage','lettuce','pea','bean','pear','grape','peach','piece','pound','What about…?','to tell you the truth','or','both','neither','all','none','too']);
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('5 / 5');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
});
test('语法错两次、部分填空、撤回、提示和刷新，订正不发星',async({page})=>{
 test.setTimeout(90000);await page.goto('/unit49-50/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<2;i++){await select(room,'要多少豌豆');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===5){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'Which',exact:true}).click();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'Which',exact:true}).click();}
  if(i===3){await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'Do',exact:true}).press('Enter');await page.reload();await room.getByRole('button',{name:'撤回 Do',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===8){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i>=12)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===13?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['14','14','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['14','14','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('配对可撤销，错项不消除；刷新不代答',async({page})=>{
 await page.goto('/unit49-50/#learn/listen');const room=page.locator('.stage-listen'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{pairs:[['beef','牛肉']]});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'beef',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'牛肉',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 4 对');
 const wrong=[['beef','羔羊肉'],['lamb','牛肉'],['steak','牛排'],['chicken','鸡；鸡肉']];await select(room,{pairs:wrong});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const[l,r]of wrong){await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:l,exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:r,exact:true}).click();}
 await select(room,ANSWERS.listen[0]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('应用只有最后正确提交才备货；两次错答保留为4／8／2',async({page})=>{
 await page.goto('/unit49-50/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.market-world');
 for(let i=0;i<8;i++){
  if(i===4){for(let k=0;k<2;k++){await select(room,{fills:['am not','isn’t']});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-prepared','false');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();for(const[j,a]of ['am not','isn’t'].entries())await room.getByRole('group',{name:`第${j+1}处填空`,exact:true}).getByRole('button',{name:a,exact:true}).click();}}
  await select(room,ANSWERS.apply[i]);await expect(world).toHaveAttribute('data-prepared','false');
  if(i===7){await page.reload();await expect(world).toHaveAttribute('data-prepared','false');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-prepared',String(i===7));
  if(i===7){await page.reload();await expect(world).toHaveAttribute('data-prepared','true');await expect(world.locator('.market-order')).toBeVisible();await expect(world.locator('.market-steak')).toBeHidden();}
  await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['4','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('全部声音失效也能完成五区',async({page})=>{
 test.setTimeout(120000);let failures=0;await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>{failures++;return r.abort();});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(failures).toBeGreaterThan(0);
});
test('Lesson50十二组替换与序数词、六加十道书写材料',async({page})=>{
 await page.goto('/unit49-50/#learn/grammar');await page.getByText('蔬果摊与序数词',{exact:true}).click();await expect(page.locator('.reference-card')).toHaveCount(12);await expect(page.locator('.reference-card').first()).toContainText('13th · thirteenth');await expect(page.locator('.reference-card').last()).toContainText('24th · twenty-fourth');
 await page.goto('/unit49-50/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(6);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);
});
for(const width of [320,390,768,1280])test(`${width}宽与短屏：题型、结算、字体和操作`,async({page},info)=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await room.locator('img').evaluateAll(els=>els.every(e=>e.complete&&e.naturalWidth>0))).toBe(true);
   for(const btn of await room.locator('button:visible').all()){const b=await btn.boundingBox();expect(b.height).toBeGreaterThanOrEqual(43);}
   if(id==='apply'&&i<7)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(1);
   else if(id!=='grammar')await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
   if((id==='grammar'&&[0,8,10,13].includes(i))||(id==='apply'&&[3,5].includes(i)))await room.screenshot({path:info.outputPath(`${id}-${i}.png`)});
  }}});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
  expect(await room.locator('.completion-next-prefix,.completion-next-name').evaluateAll(els=>els.every(e=>e.getBoundingClientRect().height<=parseFloat(getComputedStyle(e).lineHeight)+2))).toBe(true);
  const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();
  expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
});
