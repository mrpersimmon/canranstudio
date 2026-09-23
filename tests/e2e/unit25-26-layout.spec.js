'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS}=require('../support/unit25-26-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});

for(const width of [320,390,768,1280])test(width+' 各站完整、无横向溢出，帮助返回焦点，所有资源加载',async({page})=>{
  test.setTimeout(45000);await page.setViewportSize({width,height:740});const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const id of ['words','listen','text','roles','phrases','observe','be','models','trans','exam','certificate']){
    await page.goto('/unit25-26/#learn/'+id);const room=page.locator('.stage-'+id);
    await expect(room.getByRole('heading').first()).toBeInViewport();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
    await room.getByRole('button',{name:'怎么玩',exact:true}).click();await page.keyboard.press('Escape');
    await expect(room.getByRole('button',{name:'怎么玩',exact:true})).toBeFocused();
    if([390,1280].includes(width)&&['words','listen','text','observe','be','models','trans'].includes(id))await page.screenshot({path:'output/playwright/unit25-26/'+id+'-'+width+'.png'});
  }
  expect(errors).toEqual([]);
});

test('320 窄屏36张词卡展开后字义和音标不裁切，图册成对对比完整可辨',async({page})=>{
  await page.setViewportSize({width:320,height:740});await page.goto('/unit25-26/#learn/words');const room=page.locator('.stage-words');
  for(let p=0;p<6;p++){
    for(const card of await room.locator('.unit-word').all()){
      await card.click();await expect(card.locator('.word-meaning')).toBeVisible();
      expect(await card.evaluate(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)).toBe(true);
      await card.click();await expect(card.locator('.word-phonetic')).toBeVisible();
    }
    if(p<5)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  await page.goto('/unit25-26/#learn/models');await page.getByText('看看八幅厨房图',{exact:true}).click();const gallery=page.locator('.comparison-gallery');
  await gallery.screenshot({path:'output/playwright/unit25-26/comparison-gallery-320.png'});
});

for(const width of [320,1280])test(width+' 灯泡位于检查左边，反馈不推移操作，结束按钮为居中的主次双按钮',async({page})=>{
  await page.setViewportSize({width,height:740});await page.goto('/unit25-26/#learn/observe');await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-observe'),actions=room.getByRole('group',{name:'作答操作',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true}),hint=room.getByRole('button',{name:'给点线索',exact:true});
  const top=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await top(),h=await hint.boundingBox(),c=await check.boundingBox();
  expect(h.x+h.width).toBeLessThan(c.x);await hint.click();expect(await top()).toBeCloseTo(before,0);
  await room.getByRole('button',{name:"询问冰箱在哪里。",exact:true}).click();await check.click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');expect(await top()).toBeCloseTo(before,0);
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  for(const [i,answer] of ANSWERS.observe.entries()){
    await room.getByRole('button',{name:answer,exact:true}).click();await check.click();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    await room.getByRole('button',{name:i===1?'完成这一站':'下一题',exact:true}).click();
  }
  const group=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(group.getByRole('button')).toHaveCount(2);
  for(const b of await group.getByRole('button').all()){const box=await b.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);expect(box.height).toBeGreaterThanOrEqual(44);}
  await room.screenshot({path:'output/playwright/unit25-26/finish-'+width+'.png'});
});

test('390短屏阅读内部滚动，下一句与从头看同行，展开中文不移动推进按钮',async({page})=>{
  await page.setViewportSize({width:390,height:500});await page.goto('/unit25-26/#learn/text');await page.evaluate(()=>document.fonts.ready);const room=page.locator('.stage-text');
  const buttons=room.locator('.stage-ctrl'),before=await buttons.evaluate(el=>el.getBoundingClientRect().top+scrollY);
  for(let i=0;i<12;i++){
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    expect(await buttons.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(before,0);
  }
  await room.locator('.bbtns').last().getByRole('button').click();
  expect(await buttons.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(before,0);
  const advance=await room.getByRole('button',{name:'完成课文',exact:true}).boundingBox(),replay=await room.getByRole('button',{name:'从头看',exact:true}).boundingBox();
  expect(Math.abs(advance.y-replay.y)).toBeLessThan(2);
  await room.screenshot({path:'output/playwright/unit25-26/story-short-screen.png'});
});

test('词块可撤回、键盘操作、刷新续填；错序不能过关，新题不继承答案',async({page})=>{
  await page.goto('/unit25-26/#learn/trans');const room=page.locator('.stage-trans'),bank=room.getByRole('group',{name:'待选词块',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});
  const order=await bank.getByRole('button').allTextContents();await bank.getByRole('button',{name:'There',exact:true}).click();await selected.getByRole('button',{name:'撤回 There',exact:true}).click();
  for(const token of ['table.','the','on','cup','a','is','There'])await bank.getByRole('button',{name:token,exact:true}).click();
  await page.reload();expect(await bank.getByRole('button').allTextContents()).toEqual(order);await expect(selected.getByRole('button')).toHaveCount(7);
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  for(const token of ANSWERS.trans[0])await bank.getByRole('button',{name:token,exact:true}).press('Enter');
  await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.getByRole('status')).toContainText('答对了！');
  await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(selected.getByRole('button')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

test('320 最后一道长拼句和挑战选项完整可读，不因完成上一题而预选',async({page})=>{
 const {chooseTokens}=require('../support/unit25-26-flow');await page.setViewportSize({width:320,height:740});await page.goto('/unit25-26/#learn/trans');let room=page.locator('.stage-trans');
 for(const answer of ANSWERS.trans.slice(0,2)){await chooseTokens(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await chooseTokens(room,ANSWERS.trans[2]);expect(await room.evaluate(el=>el.scrollWidth<=el.clientWidth+2)).toBe(true);
 const selected=room.getByRole('group',{name:'已选词块',exact:true});expect(await selected.evaluate(el=>el.scrollHeight<=el.clientHeight+2)).toBe(true);
 await room.screenshot({path:'output/playwright/unit25-26/long-order-320.png'});
 await page.goto('/unit25-26/#learn/exam');room=page.locator('.stage-exam');await room.getByRole('button',{name:ANSWERS.exam[0],exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 for(const button of await room.locator('.practice-options button').all()){expect(await button.evaluate(el=>el.scrollWidth<=el.clientWidth+2&&el.scrollHeight<=el.clientHeight+2)).toBe(true);const box=await button.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44);expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(320);}
 await room.screenshot({path:'output/playwright/unit25-26/long-options-320.png'});
});

test('位置图画布上沿和尺寸一致，不因说明换行而上下错位',async({page})=>{
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:740});await page.goto('/unit25-26/#learn/models');await page.getByText('看看八幅厨房图',{exact:true}).click();await page.evaluate(()=>document.fonts.ready);
  const pictures=page.locator('.comparison-gallery .phrase-card>img');await expect(pictures).toHaveCount(8);
  for(let i=0;i<8;i+=2){const a=await pictures.nth(i).boundingBox(),b=await pictures.nth(i+1).boundingBox();if(width>600)expect(Math.abs(a.y-b.y)).toBeLessThan(1);expect(a.height).toBe(b.height);expect(a.width).toBe(b.width);}
 }
});

test('四种宽度全部拼句的词块完整可见，选取与撤回不推移检查按钮',async({browser})=>{
 test.setTimeout(45000);const {chooseTokens}=require('../support/unit25-26-flow');
 for(const width of [320,390,768,1280]){
  const context=await browser.newContext({viewport:{width,height:740},reducedMotion:'reduce'});const page=await context.newPage();await page.goto('http://127.0.0.1:4173/unit25-26/#learn/trans');await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-trans'),actions=room.getByRole('group',{name:'作答操作',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});
  for(const [i,answer] of ANSWERS.trans.entries()){
   const initialTop=await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY);await chooseTokens(room,answer);
   const bounds=await selected.evaluate(el=>({width:el.clientWidth,height:el.clientHeight,scrollWidth:el.scrollWidth,scrollHeight:el.scrollHeight}));
   expect(bounds.scrollWidth,`${width}px Q${i+1}: ${JSON.stringify(bounds)}`).toBeLessThanOrEqual(bounds.width+2);
   expect(bounds.scrollHeight,`${width}px Q${i+1}: ${JSON.stringify(bounds)}`).toBeLessThanOrEqual(bounds.height+2);
   expect(await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(initialTop,0);
   await selected.getByRole('button').last().click();expect(await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(initialTop,0);await chooseTokens(room,[answer.at(-1)]);
   await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toContainText('答对了！');
   await room.getByRole('button',{name:i===2?'完成这一站':'下一题',exact:true}).click();
  }
  await context.close();
 }
});
