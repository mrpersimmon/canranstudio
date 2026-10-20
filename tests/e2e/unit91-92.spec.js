'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,select,story,activity}=require('../support/unit9192');
test.use({actionTimeout:7000,...(process.env.UNIT91_BROWSER==='webkit'?{browserName:'webkit'}:{})});
test('66题完整通关：五区、三卡、独立题与零英语录音',async({page},info)=>{
 test.setTimeout(240000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(14);let stars=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{
   if(phase==='before'&&(id==='exam'||id==='grammar'&&i>=14))await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
   if(phase==='before'&&id==='grammar'&&i===16)await expect(room.locator('.practice-context')).toContainText('She is going to pack her bags tomorrow.');
   if(phase==='before'&&id==='apply')await expect(room.locator('.future-application')).toHaveAttribute('data-recorded','false');
   if(phase==='correct'&&id==='apply')await expect(room.locator('.future-application')).toHaveAttribute('data-recorded','true');
  }});
  await expect(page.locator('#starCount')).toHaveText(String(++stars));await expect(room.locator('.completion-stat')).toHaveCount(3);
  for(const[i,name]of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await room.screenshot({path:info.outputPath(id+'-complete.png')});
 }
 await page.getByRole('button',{name:'学习手记',exact:true}).click();await expect(page.locator('#learningRecord li').filter({hasText:'will后接动词原形'})).toContainText('看过示范后完成');await expect(page.locator('#learningRecord li').filter({hasText:'独立表达将来状态'})).not.toContainText('看过示范');await page.getByRole('button',{name:'关闭',exact:true}).click();
 await page.reload();await page.goto('/unit91-92/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('30张音标词卡、完整时间表、16动作与书写A4／B8',async({page},info)=>{
 await page.goto('/unit91-92/#learn/words');const words=page.locator('.stage-words'),seen=[];
 for(let n=0;n<5;n++){await expect(words.locator('.unit-word')).toHaveCount(6);seen.push(...await words.locator('.unit-word strong').allTextContents());for(const card of await words.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();}if(n<4)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(seen).toEqual(['still','move','miss','neighbour','person','people','poor','tomorrow','the day after tomorrow','tonight','regards','will','rain','snow','leave','get up','arrive','finish work','have a holiday','drive home','have a haircut','telephone me','have a shave','pack his bags','sweep the floor','paint this room','repair my car','make an appointment','shall','soon']);
 await page.reload();await expect(words.locator('#wordPageProgress')).toHaveText('5 / 5');await words.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);
 await page.goto('/unit91-92/#learn/apply');await page.getByText('课本小参考 · 时间表与16组动作',{exact:true}).click();await expect(page.locator('.reference-card')).toHaveCount(16);await expect(page.locator('.time-reference tr')).toHaveCount(5);await expect(page.locator('.time-reference')).toContainText('the night after next');await page.locator('.stage-apply .offline-task').screenshot({path:info.outputPath('reference.png')});
 await page.goto('/unit91-92/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(4);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(8);for(const text of ['He will not believe me.','She swept the floor yesterday.','这不是从昨天推断明天一定相同'])await expect(page.locator('#unitWriting')).toContainText(text);
});
test('错两次、刷新、撤销、线索与重练：错误不会被洗掉',async({page})=>{
 test.setTimeout(180000);await page.goto('/unit91-92/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let k=0;k<2;k++){if(k===0)await select(room,{fills:['telephones']});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const[i,a]of ANSWERS.grammar.entries()){
  if(i===1){await select(room,{fills:['be']});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'be',exact:true}).click();}
  if(i===4){await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'Will',exact:true}).press('Enter');await page.reload();await room.getByRole('button',{name:'撤回 Will',exact:true}).click();await expect(check).toBeDisabled();}
  if(i===6){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  await select(room,a);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===17?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['18','18','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['18','18','2']);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});
test('应用第二题错两次：未检查不登记、刷新保持、结算7／8／2',async({page})=>{
 test.setTimeout(120000);await page.goto('/unit91-92/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.future-application');
 for(const[i,a]of ANSWERS.apply.entries()){
  if(i===1){await expect(room.locator('.practice-context')).toContainText('Conversation day: 10 June');for(let k=0;k<2;k++){await select(room,'6月11日上午');await check.click();await expect(world).toHaveAttribute('data-recorded','false');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  await select(room,a);await expect(world).toHaveAttribute('data-recorded','false');await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await expect(world).toHaveAttribute('data-recorded','true');if(i===1){await page.reload();await expect(world).toHaveAttribute('data-recorded','true');await expect(world).toContainText('Ian · 11 June · afternoon');}await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }await expect(room.locator('.completion-number')).toHaveText(['7','8','2']);await expect(page.locator('#starCount')).toHaveText('0');
});
test('声音全部失败仍能完成五区',async({page})=>{test.setTimeout(240000);await page.addInitScript(()=>{window.testSoundFailures=0;HTMLMediaElement.prototype.play=function(){window.testSoundFailures++;return Promise.reject(new DOMException('Simulated unavailable audio','NotSupportedError'));};});await page.route(/\.(mp3|wav|ogg)(?:\?|$)/,r=>r.abort());await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(await page.evaluate(()=>window.testSoundFailures)).toBeGreaterThan(0);});
test('打印练习纸保留12题且可见，结束打印恢复学习页面',async({page},info)=>{
 await page.goto('/unit91-92/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();
 await page.evaluate(()=>{window.testPrintCalls=0;window.print=()=>{window.testPrintCalls++;};});
 await page.getByRole('button',{name:'打印练习纸',exact:true}).click();expect(await page.evaluate(()=>window.testPrintCalls)).toBe(1);
 await page.emulateMedia({media:'print'});const writing=page.locator('#unitWriting');await expect(writing).toBeVisible();await expect(writing.locator('li:visible')).toHaveCount(12);await expect(page.locator('#topbar')).toBeHidden();await expect(page.locator('.story-award-panel')).toBeHidden();
 await writing.screenshot({path:info.outputPath('worksheet-print.png')});
 await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));await page.emulateMedia({media:'screen'});await expect(page.locator('body')).not.toHaveClass(/print-writing/);await expect(page.locator('#topbar')).toBeVisible();
});
for(const width of [320,390,768,1280])test(`${width}宽／短屏：所有题型、材料、三卡、字体与按钮`,async({page},info)=>{
 test.setTimeout(240000);await page.setViewportSize({width,height:width===320?568:width===390?500:900});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase!=='before')return;expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);for(const btn of await room.locator('button:visible').all())expect((await btn.boundingBox()).height).toBeGreaterThanOrEqual(43);if((id==='grammar'&&[1,8,10,11,14].includes(i))||(id==='apply'&&[0,1,6].includes(i)))await room.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});const ys=await room.locator('.completion-stat').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().y));expect(Math.max(...ys)-Math.min(...ys)).toBeLessThan(2);
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all())await btn.scrollIntoViewIfNeeded();expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);
 }
 await page.goto('/unit91-92/#learn/words');const room=page.locator('.stage-words');for(let i=0;i<5;i++){for(const card of await room.locator('.unit-word').all()){await card.click();expect(await card.evaluate(e=>e.scrollHeight<=e.clientHeight+2)).toBe(true);}if(i===1)await room.screenshot({path:info.outputPath('long-word.png')});if(i<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(await room.locator('.word-phonetic').evaluateAll(els=>els.every(e=>getComputedStyle(e).fontFamily.startsWith('Arial')))).toBe(true);
});
