'use strict';
const {test,expect}=require('@playwright/test');
const {activity,story,ANSWERS}=require('../support/unit4344');
const {select}=require('../support/units1-30-tasks');
test.use({actionTimeout:6000});
test('44题完整流程、三卡五区五星及无配音',async({page},info)=>{
 test.setTimeout(120000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('.bubble-row')).toHaveCount(15);await expect(page.locator('#starCount')).toHaveText('0');
 let count=0;
 for(const id of Object.keys(ANSWERS)){
  const room=await activity(page,id,{inspect:async(surface,i,phase)=>{if(phase==='before'&&((id==='grammar'&&[0,1,4,7,11].includes(i))||(id==='apply'&&[1,3,4].includes(i))))await surface.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});}});
  await expect(page.locator('#starCount')).toHaveText(String(++count));
  await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
  for(const [i,name] of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
  await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
 }
 await page.goto('/unit43-44/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');
 await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
 await expect.poll(()=>page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
 expect(errors).toEqual([]);expect(voices).toEqual([]);
});

test('18张词卡、音标、翻义与末组推进；不依赖配音',async({page})=>{
 await page.goto('/unit43-44/#learn/words');const room=page.locator('.stage-words');
 const first=room.getByRole('button',{name:'kettle',exact:true});await expect(first).toContainText('/ˈketl/');await expect(first.locator('.word-meaning')).toBeHidden();await first.press('Enter');await expect(first.locator('.word-meaning')).toHaveText('水壶');
 await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
 for(let i=0;i<3;i++){
  await expect(room.locator('.unit-word')).toHaveCount(6);await expect(room.locator('.word-phonetic')).toHaveCount(6);
  await expect.poll(()=>room.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  if(i<2)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('3 / 3');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen/);await expect(page.locator('#starCount')).toHaveText('0');
});

test('15句课文完整历史：找到茶叶与杯子、最后水开；原文没有移动杯子',async({page})=>{
 await page.goto('/unit43-44/#learn/text');const room=page.locator('.stage-text'),world=room.locator('.tea-world');
 await room.getByRole('button',{name:'开始看课文',exact:true}).click();await expect(room.getByRole('log')).toContainText('Can you make the tea, Sam?');
 for(let i=0;i<15;i++){
  await expect(room.locator('.bubble-row')).toHaveCount(i+1);await expect(world).toHaveAttribute('data-cups','cupboard');await expect(world).toHaveAttribute('data-boiling',String(i===14));
  if(i===7){await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();await expect(room.locator('.bubble-row').last()).toContainText('茶壶我看见了');await page.reload();await expect(room.locator('.bubble-row')).toHaveCount(8);}
  if(i===9)await expect(world).toHaveAttribute('data-found','true');
  if(i<14)await room.getByRole('button',{name:'下一句',exact:true}).click();
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('0');await expect(room.locator('.completion-stats')).toHaveCount(0);
 for(const width of [390,1280]){await page.setViewportSize({width,height:844});await page.reload();const box=await room.getByRole('log').boundingBox();await expect.poll(async()=>{const last=await room.locator('.bubble-row').last().locator('.btext').boundingBox();return last.y>=box.y&&last.y+last.height<=box.y+box.height;}).toBe(true);}
});

test('语法反复错答、部分填空、撤回、提示与刷新；订正不发星，重练可获星',async({page})=>{
 test.setTimeout(70000);await page.goto('/unit43-44/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await expect(room.getByRole('region',{name:'短示范'})).toContainText('I can read this book.');
 for(let i=0;i<2;i++){await select(room,'必须');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(room.locator('.grammar-rule')).toBeHidden();await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 for(const [i,answer]of ANSWERS.grammar.entries()){
  if(i===1){await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'can',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第1处填空',exact:true}).getByRole('button',{name:'can',exact:true}).click();}
  if(i===4){
   // Next-question focus is scheduled for the next frame. Start keyboard input
   // after that transition, then prove the selection exists before reloading.
   await expect(room.locator('.practice-progress')).toBeFocused();
   await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'Can',exact:true}).press('Enter');
   await expect(room.getByRole('group',{name:'已选词块'})).toContainText('Can');
   await page.reload();await expect(room.getByRole('group',{name:'已选词块'})).toContainText('Can');
   await room.getByRole('button',{name:'撤回 Can',exact:true}).click();await expect(check).toBeDisabled();
  }
  if(i===8){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
  if(i===11)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
  await expect.poll(()=>room.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  await select(room,answer);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===11?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['12','12','2']);await expect(page.locator('#starCount')).toHaveText('0');await page.reload();await expect(room.locator('.completion-number')).toHaveText(['12','12','2']);
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});

test('场景第三题错两次：3／5／2；杯子仅检查正确后移动，刷新物品守恒',async({page})=>{
 await page.goto('/unit43-44/#learn/apply');const room=page.locator('.stage-apply'),check=room.getByRole('button',{name:'检查答案',exact:true}),world=room.locator('.tea-world');
 for(let i=0;i<5;i++){
  if(i===2){for(let n=0;n<2;n++){await select(room,'Yes, I can.');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await expect(world).toHaveAttribute('data-cups','cupboard');await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  if(i===3){const material=await room.getByRole('region',{name:'题目材料',exact:true}).boundingBox(),stage=await world.boundingBox();expect(material.y+material.height).toBeLessThanOrEqual(stage.y);await expect(room).toContainText('Put the cups in front of the kettle.');}
  await select(room,ANSWERS.apply[i]);if(i===3){await expect(world).toHaveAttribute('data-cups','cupboard');await page.reload();await expect(world).toHaveAttribute('data-cupboard-count','2');}
  await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
  if(i>=3){await expect(world).toHaveAttribute('data-cupboard-count','0');await expect(world).toHaveAttribute('data-counter-count','2');await expect(world.locator('.tea-cups')).toHaveCount(1);await page.reload();await expect(world).toHaveAttribute('data-cups','counter');}
  if(i===4)await expect(room.locator('.practice-finish')).toHaveCount(0);
  await room.getByRole('button',{name:i===4?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['3','5','2']);await expect(page.locator('#starCount')).toHaveText('0');
});

test('配对部分不能检查；已配可撤销；刷新不代答',async({page})=>{
 await page.goto('/unit43-44/#learn/listen');const room=page.locator('.stage-listen');
 for(const answer of ANSWERS.listen.slice(0,3)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await select(room,{pairs:[['find','找到']]});await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await room.getByRole('group',{name:'英文',exact:true}).getByRole('button',{name:'find',exact:true}).click();await room.getByRole('group',{name:'词义',exact:true}).getByRole('button',{name:'找到',exact:true}).click();await expect(room.locator('.match-count')).toHaveText('已配 0 / 3 对');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await select(room,ANSWERS.listen[3]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
});

test('Lesson44全部12组替换、10个复数和7+10书写题有入口',async({page})=>{
 await page.goto('/unit43-44/#learn/grammar');await page.getByText('换个物品问一问',{exact:true}).click();await expect(page.locator('.reference-card')).toHaveCount(12);await expect(page.locator('.reference-card').first()).toContainText('70 · seventy');await expect(page.locator('.reference-card').last()).toContainText('900 · nine hundred');
 await page.getByText('名词变复数',{exact:true}).click();await expect(page.locator('.plural-reference dt')).toHaveCount(10);await expect(page.locator('.plural-reference')).toContainText('wives');
 await page.goto('/unit43-44/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(7);await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);await expect(page.locator('#starCount')).toHaveText('0');
});

for(const width of [320,390,768,1280])test(`${width}宽及短屏：场景、题型、三卡和两按钮`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});await story(page);await page.locator('.stage-text').screenshot({path:info.outputPath('story.png')});
 for(const id of ['grammar','apply','exam']){
  const room=await activity(page,id,{inspect:async(surface,i,phase)=>{
   if(phase==='before'){
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect.poll(()=>surface.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
    for(const button of await surface.locator('button:visible').all()){const box=await button.boundingBox();expect(box.height).toBeGreaterThanOrEqual(43);}
    if((id==='grammar'&&[0,1,4,7,11].includes(i))||(id==='apply'&&[1,3,4].includes(i))||(id==='exam'&&[9,14].includes(i)))await surface.screenshot({path:info.outputPath(`${id}-${i+1}.png`)});
   }
  }});
  await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  const boxes=await room.locator('.completion-stat').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().y));expect(Math.max(...boxes)-Math.min(...boxes)).toBeLessThan(2);
  await room.screenshot({path:info.outputPath(id+'-completion.png')});
  for(const btn of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all()){await btn.scrollIntoViewIfNeeded();const box=await btn.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(page.viewportSize().height);}
  const visibleTogether=await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(els=>els.every(el=>{const b=el.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}));expect(visibleTogether).toBe(true);
 }
});
