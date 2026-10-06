'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS}=require('../support/unit25-26-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});

for(const width of [320,390,768,1280])test(width+' 各站完整、无横向溢出，手记返回焦点，所有资源加载',async({page})=>{
  test.setTimeout(45000);await page.setViewportSize({width,height:740});const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const id of ['words','listen','text','roles','phrases','observe','be','models','trans','errands','exam','certificate']){
    await page.goto('/unit25-26/#learn/'+id);const room=page.locator('.stage-'+id);
    await expect(room.getByRole('heading').first()).toBeInViewport();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
    await expect(room.getByRole('button',{name:'怎么玩',exact:true})).toHaveCount(0);
    await page.locator('#notebookButton').click();await page.keyboard.press('Escape');await expect(page.locator('#notebookButton')).toBeFocused();
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

test('位置图画布上沿和尺寸一致，不因说明换行而上下错位',async({page})=>{
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:740});await page.goto('/unit25-26/#learn/models');if(await page.locator('.visual-gallery').getAttribute('open')===null)await page.getByText('看看八幅厨房图',{exact:true}).click();await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-models'),prev=room.getByRole('button',{name:'上一页图册',exact:true}),next=room.getByRole('button',{name:'下一页图册',exact:true});
  while(await prev.isEnabled())await prev.click();let seen=0;
  do{const pictures=room.locator('.comparison-gallery .phrase-card>img');await expect(pictures).toHaveCount(1);
   const a=await pictures.first().boundingBox();expect(a.width).toBeGreaterThan(120);expect(a.height).toBeGreaterThan(90);

   seen+=await pictures.count();if(!await next.isEnabled())break;await next.click();
  }while(seen<=8);expect(seen).toBe(8);
 }
});

test('四种宽度全部拼句的词块完整可见，选取与撤回不推移检查按钮',async({browser,baseURL})=>{
 test.setTimeout(45000);const {chooseTokens}=require('../support/unit25-26-flow');
 for(const width of [320,390,768,1280]){
  const context=await browser.newContext({viewport:{width,height:740},reducedMotion:'reduce'});const page=await context.newPage();await page.goto(baseURL+'/unit25-26/#learn/trans');await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-trans'),actions=room.getByRole('group',{name:'作答操作',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});
  for(const [i,answer] of ANSWERS.trans.entries()){
   const initialTop=await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY);await chooseTokens(room,answer);
   const bounds=await selected.evaluate(el=>({width:el.clientWidth,height:el.clientHeight,scrollWidth:el.scrollWidth,scrollHeight:el.scrollHeight}));
   expect(bounds.scrollWidth,`${width}px Q${i+1}: ${JSON.stringify(bounds)}`).toBeLessThanOrEqual(bounds.width+2);
   expect(bounds.scrollHeight,`${width}px Q${i+1}: ${JSON.stringify(bounds)}`).toBeLessThanOrEqual(bounds.height+2);
   expect(await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(initialTop,0);
   await selected.getByRole('button').last().click();expect(await actions.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(initialTop,0);await chooseTokens(room,[answer.at(-1)]);
   await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toContainText('答对了！');
   await room.getByRole('button',{name:i===ANSWERS.trans.length-1?'完成这一站':'下一题',exact:true}).click();
  }
  await context.close();
 }
});
