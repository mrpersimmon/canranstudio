require('../support/unit4142-v153-legacy').historicalSuite(require('@playwright/test').test);
'use strict';
const { test, expect } = require('@playwright/test');
const { select } = require('../support/units1-30-tasks');
const { activity, story, ANSWERS } = require('../support/unit4142');
test.use({ actionTimeout: 5000 });

test('购物袋图鉴：先认物品、保留音标、点击翻义、翻页再进入练习', async ({ page }) => {
  await page.goto('/unit41-42/#learn/words');
  const words = page.getByRole('region', { name: '购物袋小图鉴', exact: true });
  await expect(words).toBeVisible();
  const cheese = words.getByRole('button', { name: 'cheese', exact: true });
  await expect(cheese).toContainText('/tʃiːz/');
  await expect(cheese.locator('.word-meaning')).toBeHidden();
  await cheese.click();
  await expect(cheese.locator('.word-meaning')).toHaveText('乳酪；干酪');
  await expect(words.getByRole('button', { name: '上一组词卡', exact: true })).toBeDisabled();
  for (let i = 0; i < 3; i++) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await expect(words.getByRole('button', { name: 'some', exact: true })).toContainText('/sʌm/');
  await words.getByRole('button', { name: '下一站：单词寻宝', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('43 题完整流程：五区五星、无语音请求、所有结算三卡与图标一致', async ({ page }) => {
  test.setTimeout(100000);
  const errors=[], voices=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
  await story(page);
  let stars=0;
  for(const id of Object.keys(ANSWERS)){
    const room=await activity(page,id);
    await expect(page.locator('#starCount')).toHaveText(String(++stars));
    await expect(room.getByRole('list',{name:'本轮成果'}).locator('li')).toHaveCount(3);
    for(const [i,name] of ['streak','correct','incorrect'].entries())await expect(room.locator('.completion-stat img').nth(i)).toHaveAttribute('src',`/assets/unit1-2/completion/${name}-v1.png`);
    await expect(room.getByRole('group',{name:'完成后的操作'}).getByRole('button')).toHaveCount(2);
  }
  await page.goto('/unit41-42/#learn/certificate');
  await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');
  const date=await page.locator('#certificateDate').textContent();await page.reload();
  await expect(page.locator('#certificateDate')).toHaveText(date);
  expect(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
  expect(errors).toEqual([]);expect(voices).toEqual([]);
});

test('词块撤回、重复错答与提示：本次统计按提交，重练归零',async({page})=>{
  test.setTimeout(60000);
  await page.goto('/unit41-42/#learn/grammar');const room=page.locator('.stage-grammar');
  await select(room,{fills:['are','are']});
  for(let i=0;i<2;i++){
    await room.getByRole('button',{name:'检查答案',exact:true}).click();
    await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
    await expect(room.locator('.is-correct')).toHaveCount(0);
    await page.reload();
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
  }
  for(const [i,answer] of ANSWERS.grammar.entries()){
    if(i===4){
      await room.getByRole('group',{name:'待选词块'}).getByRole('button',{name:'Half',exact:true}).press('Enter');
      await page.reload();await expect(room.getByRole('group',{name:'已选词块'})).toContainText('Half');
      await room.getByRole('button',{name:'撤回 Half',exact:true}).click();
      await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
    }
    if(i===8){await room.getByRole('button',{name:'给点线索',exact:true}).click();await page.reload();await expect(room.locator('.practice-hint')).toBeVisible();}
    if(i===11)await expect(room.getByRole('region',{name:'短示范'})).toHaveCount(0);
    await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();
    await expect(room.locator('.fb')).toHaveText('答对了！');
    await room.getByRole('button',{name:i===11?'完成这一站':'下一题',exact:true}).click();
  }
  await expect(room.locator('.completion-number')).toHaveText(['12','12','2']);
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.reload();await expect(room.locator('.completion-number')).toHaveText(['12','12','2']);
  await page.goto('/unit41-42/#learn/certificate');
  await page.getByText('星星进度',{exact:true}).click();
  const retry=page.getByRole('list',{name:'五星任务'}).getByRole('listitem').filter({hasText:'语法小工坊'});
  await expect(retry).toContainText('已完成 · 未获星');
  await retry.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(room.locator('.progress-copy')).toHaveText('第 1 / 12 题');
  await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
});

for(const width of [320,390,768,1280])test(`${width} 宽：舞台、配对、长句、词块、结算和卡片可见`,async({page},info)=>{
  test.setTimeout(90000);await page.setViewportSize({width,height:width===320?568:width===390?500:844});
  await story(page);
  await page.locator('.stage-text').screenshot({path:info.outputPath('story.png')});
  for(const id of ['grammar','apply','exam']){
    const room=await activity(page,id,{inspect:async(surface,i,phase)=>{
      if(phase==='before'){
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
        const check=surface.getByRole('button',{name:'检查答案',exact:true});
        const hint=surface.getByRole('button',{name:'给点线索',exact:true});
        if(await hint.isVisible()){const a=await hint.boundingBox(),b=await check.boundingBox();expect(a.x+a.width).toBeLessThanOrEqual(b.x+1);}
      }
      if((id==='grammar'&&[1,3,4,10,11].includes(i))||(id==='apply'&&[0,2,4].includes(i))||(id==='exam'&&[9,13].includes(i)))await surface.screenshot({path:info.outputPath(`${id}-${i+1}-${phase}.png`)});
    }});
    await room.locator('.completion-stats').scrollIntoViewIfNeeded();
    await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
    const boxes=await room.locator('.completion-stat').evaluateAll(els=>els.map(el=>({x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y})));
    expect(boxes).toHaveLength(3);expect(Math.max(...boxes.map(b=>b.y))-Math.min(...boxes.map(b=>b.y))).toBeLessThan(2);
    await room.screenshot({path:info.outputPath(id+'-completion.png')});
    for(const button of await room.getByRole('group',{name:'完成后的操作'}).getByRole('button').all()){
      await button.scrollIntoViewIfNeeded();const box=await button.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y+box.height).toBeLessThanOrEqual(page.viewportSize().height);
    }
  }
  await page.goto('/unit41-42/#learn/certificate');await page.locator('.stage-certificate').screenshot({path:info.outputPath('card.png')});
});

test('完整小剧场：袋子放上椅子，原文保留历史且阅读不发星', async ({ page }) => {
  await page.goto('/unit41-42/#learn/text');
  const room = page.locator('.stage-text');
  await room.getByRole('button', { name: '开始看课文', exact: true }).click();
  await expect(room.getByRole('log')).toContainText('Is that bag heavy, Penny?');
  await expect(room.locator('.pantry-world')).toHaveAttribute('data-bag', 'carried');
  for (let i = 1; i < 16; i++) {
    await room.getByRole('button', { name: '下一句', exact: true }).click();
    if (i === 3) await expect(room.locator('.pantry-world')).toHaveAttribute('data-bag', 'chair');
    if (i === 8) { await page.reload(); await expect(room.locator('.bubble-row')).toHaveCount(9); }
  }
  await expect(room.locator('.bubble-row')).toHaveCount(16);
  await expect(room.getByRole('log')).toContainText("Well, it's certainly not for me!");
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(room.getByRole('list', { name: '本轮成果' })).toHaveCount(0);
  await room.getByRole('button', { name: '下一站：故事小侦探', exact: true }).click();
  await expect(page.locator('.stage-roles .progress-copy')).toHaveText('第 1 / 5 题');
});

test('语法从 there be 和量词出发：错答不揭底，改正后才出现短规则', async ({ page }) => {
  await page.goto('/unit41-42/#learn/grammar');
  const room = page.locator('.stage-grammar');
  await expect(room.getByRole('region', { name: '短示范' })).toContainText('There is some coffee.');
  await select(room, { fills: ['are', 'are'] });
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  await expect(room.locator('.grammar-rule')).toBeHidden();
  await expect(room.locator('.is-correct')).toHaveCount(0);
  await page.reload();
  await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await select(room, { fills: ['is', 'is'] });
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.locator('.grammar-rule')).toContainText('不可数');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});


test('场景先选后检查：数量改变有依据，第三题两次错答结算为3／5／2',async({page})=>{
  await page.goto('/unit41-42/#learn/apply');const room=page.locator('.stage-apply');
  const check=room.getByRole('button',{name:'检查答案',exact:true});
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：空');
  await page.setViewportSize({width:1280,height:1000});
  await page.evaluate(()=>document.fonts.ready);
  await room.locator('.practice-options').scrollIntoViewIfNeeded();
  const before=await check.boundingBox();
  await select(room,'milk');
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：空');
  expect(Math.abs((await check.boundingBox()).y-before.y)).toBeLessThan(2);
  await select(room,'bread');await check.click();
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包');
  await page.reload();await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包');
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  await select(room,'两瓶牛奶');await check.click();
  await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包、两瓶牛奶');
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  for(let i=0;i<2;i++){
    await select(room,'Yes, there is.');await check.click();
    await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
    await expect(room.locator('.bag-inventory')).toContainText('袋子里：一条面包、两瓶牛奶');
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
  }
  for(let i=2;i<5;i++){
    await select(room,ANSWERS.apply[i]);await check.click();
    await expect(room.locator('.fb')).toHaveText('答对了！');
    if(i===4){await expect(room.locator('.progress-copy')).toHaveText('第 5 / 5 题');await expect(room.locator('.practice-finish')).toHaveCount(0);}
    await room.getByRole('button',{name:i===4?'完成这一站':'下一题',exact:true}).click();
  }
  await expect(room.locator('.completion-number')).toHaveText(['3','5','2']);
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('教材替换和书写保留为参考，不增加答题区',async({page})=>{
  await page.goto('/unit41-42/#learn/grammar');
  await page.getByText('换个物品问一问',{exact:true}).click();
  const cards=page.locator('.reference-card');await expect(cards).toHaveCount(16);
  await expect(cards.filter({hasText:'19 · nineteen'})).toContainText('Is there any tea on that table?');
  await expect(cards.last()).toContainText('100 · a hundred');
  await page.goto('/unit41-42/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();
  await expect(page.locator('#unitWriting ol').nth(0).locator('li')).toHaveCount(6);
  await expect(page.locator('#unitWriting ol').nth(1).locator('li')).toHaveCount(10);
  await expect(page.getByRole('button',{name:'打印练习纸',exact:true})).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('带图选项保持大图在上、文字在下，桌面并排且手机不溢出',async({page},info)=>{
  for(const width of [320,1280]){
    await page.setViewportSize({width,height:900});await page.goto('/unit41-42/#learn/apply');
    const room=page.locator('.stage-apply');await room.locator('.practice-options').scrollIntoViewIfNeeded();
    for(const option of await room.locator('.picture-option').all()){
      const image=await option.locator('img').boundingBox(),label=await option.locator('span').boundingBox();
      expect(image.height).toBeGreaterThanOrEqual(80);expect(image.y+image.height).toBeLessThanOrEqual(label.y+1);
    }
    if(width===1280){const positions=await room.locator('.picture-option').evaluateAll(items=>items.map(item=>item.getBoundingClientRect().y));expect(Math.max(...positions)-Math.min(...positions)).toBeLessThan(2);}
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await room.screenshot({path:info.outputPath(`picture-choices-${width}.png`)});
  }
});

test('同一批物品连续整理：错答和选择不移动，一瓶移出后刷新仍守恒',async({page})=>{
 await page.goto('/unit41-42/#learn/apply');const room=page.locator('.stage-apply');
 for(const answer of ['bread','两瓶牛奶','No, there isn’t.']){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 const instruction=room.getByRole('region',{name:'题目材料',exact:true});
 await expect(instruction).toContainText('Put a bottle of milk on the table.');
 const instructions=await instruction.boundingBox(),stage=await room.locator('.pantry-world').boundingBox();
 expect(instructions.y+instructions.height).toBeLessThanOrEqual(stage.y);
 const bag=room.locator('.bag-contents');const table=room.locator('.pantry-item');
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(2);await expect(table.getByRole('img')).toHaveCount(0);
 await select(room,'椅子上');await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(2);await expect(table.getByRole('img')).toHaveCount(0);
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await select(room,'桌上');
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(2);await expect(table.getByRole('img')).toHaveCount(0);
 await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(1);await expect(table.getByRole('img',{name:'桌上的一瓶牛奶'})).toHaveCount(1);
 await page.reload();await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(1);await expect(table.getByRole('img')).toHaveCount(1);
 await room.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(room.getByRole('heading',{name:'替 Penny 记下桌上的物品'})).toBeVisible();
 await expect(bag.getByRole('img',{name:/牛奶/})).toHaveCount(1);await expect(table.getByRole('img')).toHaveCount(1);
 await expect(room.getByText('翻译这句话',{exact:true})).toHaveCount(0);
 await select(room,['There is','a bottle','of milk','on the table']);await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await room.getByRole('button',{name:'完成这一站',exact:true}).click();await expect(room.locator('.completion-number')).toHaveText(['3','5','1']);await expect(page.locator('#starCount')).toHaveText('0');
});

test('旧页面真实获星后升级：相同题保留，改题未答，旧星不扣',async({page})=>{
 const fs=require('node:fs'),path=require('node:path');const dir=path.resolve('tests/fixtures/unit41-42-before-polish');
 const patterns=['index.html','content.js','unit.js','scene.js','unit.css'];
 const route=async r=>{const pathname=new URL(r.request().url()).pathname;const file=pathname.endsWith('/')?'index.html':path.basename(pathname);if(patterns.includes(file))return r.fulfill({path:path.join(dir,file)});return r.continue();};
 await page.route('**/unit41-42/**',route);await page.goto('/unit41-42/#learn/apply');const room=page.locator('.stage-apply');
 const prior=['bread','两瓶牛奶','No, there isn’t.',{fills:['in','on']},['There is','a piece','of cheese','on the table']];
 for(let i=0;i<prior.length;i++){await select(room,prior[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:i===4?'完成这一站':'下一题',exact:true}).click();}
 await expect(page.locator('#starCount')).toHaveText('1');await page.keyboard.press('Escape');
 await page.unroute('**/unit41-42/**',route);await page.reload();
 await expect(page.locator('#starCount')).toHaveText('1');await expect(room.locator('.progress-copy')).toHaveText('第 4 / 5 题');
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.locator('.pantry-item img')).toHaveCount(0);
 await select(room,'桌上');await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await select(room,['There is','a bottle','of milk','on the table']);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'完成这一站',exact:true}).click();
 await expect(page.locator('#starCount')).toHaveText('1');await expect(room.locator('.completion-number')).toHaveText(['—','—','—']);
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'apply');await expect(page.locator('#starCount')).toHaveText('1');
});

test('工坊展示图不泄题；综合自行识别 loaves 与并列清单规则',async({page})=>{
 await page.goto('/unit41-42/#learn/grammar');const grammar=page.locator('.stage-grammar');
 await expect(grammar.getByRole('region',{name:'短示范'}).locator('img')).toHaveCount(2);
 await expect(grammar.getByRole('region',{name:'短示范'})).not.toContainText('There is a spoon.');
 await activity(page,'exam',{inspect:async(room,index,phase)=>{
  if(phase!=='before')return;
  if(index===6){await expect(room).toContainText('两条面包');await expect(room.getByRole('button',{name:'loaves',exact:true})).toBeVisible();}
  if(index===12)await expect(room).not.toContainText('根据第一项');
 }});
});

test('旧空白草稿升级可正常获星，未改语法保留选项与本轮错答',async({page})=>{
 const path=require('node:path'),dir=path.resolve('tests/fixtures/unit41-42-before-polish');
 const files=['index.html','content.js','unit.js','scene.js','unit.css'];
 const old=async r=>{const pathname=new URL(r.request().url()).pathname,file=pathname.endsWith('/')?'index.html':path.basename(pathname);return files.includes(file)?r.fulfill({path:path.join(dir,file)}):r.continue();};
 await page.route('**/unit41-42/**',old);await page.goto('/unit41-42/#learn/apply');
 await expect(page.locator('.stage-apply .progress-copy')).toHaveText('第 1 / 5 题');
 await page.goto('/unit41-42/#learn/grammar');const room=page.locator('.stage-grammar');
 await select(room,{fills:['are','are']});await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await select(room,{fills:['is','is']});
 await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await select(room,{fills:['are','is']});
 await page.unroute('**/unit41-42/**',old);await page.reload();
 await expect(room.locator('.progress-copy')).toHaveText('第 2 / 12 题');
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();
 await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');
 await room.getByRole('button',{name:'下一题',exact:true}).click();
 for(let i=2;i<ANSWERS.grammar.length;i++){
   await select(room,ANSWERS.grammar[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();
   await room.getByRole('button',{name:i===11?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(room.locator('.completion-number')).toHaveText(['12','12','1']);
 await expect(page.locator('#starCount')).toHaveText('0');
 await activity(page,'apply');await expect(page.locator('#starCount')).toHaveText('1');
});


test('手机续看后切回桌面，当前对白保持在对话区内',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/unit41-42/#learn/text');
 const room=page.locator('.stage-text'),log=room.getByRole('log');
 await room.getByRole('button',{name:'开始看课文',exact:true}).click();
 for(let i=1;i<6;i++)await room.getByRole('button',{name:'下一句',exact:true}).click();
 await page.goto('/unit41-42/#learn/grammar');await page.setViewportSize({width:1280,height:900});
 await page.goto('/unit41-42/#learn/text');
 const visible=async()=>{const box=await log.boundingBox(),line=await room.locator('.bubble-row').last().locator('.btext').boundingBox();return line.y>=box.y&&line.y+line.height<=box.y+box.height;};
 await expect.poll(visible).toBe(true);
 const dialogueBox=await log.boundingBox();
 for(const actor of await room.locator('.pantry-actor>img').all())expect(dialogueBox.y+dialogueBox.height).toBeLessThanOrEqual((await actor.boundingBox()).y);
 await page.reload();await expect.poll(visible).toBe(true);
});
