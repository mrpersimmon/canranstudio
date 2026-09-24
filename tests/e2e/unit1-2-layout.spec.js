'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function audioBoundary(page) {
  await page.addInitScript(()=>{
    window.Audio=class extends EventTarget { constructor(src){super();this.src=src;this.currentTime=0;} play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();} pause(){} };
  });
}
async function answer(room,value,next='下一题') {
  await room.locator('.practice-options').getByRole('button',{name:value,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status').filter({hasText:'答对了！'})).toBeVisible();
  if(next)await room.getByRole('button',{name:next,exact:true}).click();
}
for(const width of [320,390,768,1280]) {
  test(`${width} 像素：舞台、选项、灯泡、反馈与结束按钮不溢出或跳动`,async({page})=>{
    await audioBoundary(page);await page.setViewportSize({width,height:740});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('/unit1-2/#learn/text');await page.evaluate(()=>document.fonts.ready);
    const story=page.locator('.stage-text');
    const footerY=()=>story.locator('.stage-ctrl').evaluate(el=>el.getBoundingClientRect().top+scrollY);
    const before=await footerY();
    await story.getByRole('button',{name:'开始听课文',exact:true}).click();
    await story.getByRole('button',{name:'下一句',exact:true}).click();
    await expect(story.getByRole('img',{name:'等待归还的手提包',exact:true})).toBeVisible();
    const log=story.getByRole('log',{name:'课文对话',exact:true});
    for(const control of await log.getByRole('button').all())expect((await control.boundingBox()).height,'点读与翻译仍有足够点击面积').toBeGreaterThanOrEqual(44);
    for(const bubble of await log.locator('.bubble').all())expect((await bubble.boundingBox()).height,'短对白不再撑成高卡片').toBeLessThanOrEqual(120);
    if(width<=600){
      const bottom=(await log.boundingBox()).y+(await log.boundingBox()).height;
      for(const person of await story.locator('.dialogue-actor').all())expect((await person.boundingBox()).y).toBeGreaterThanOrEqual(bottom);
      expect((await log.boundingBox()).width,'手机英文有整行宽度').toBeGreaterThan(width*.68);
      const man=await story.locator('[data-actor=man]>img').boundingBox(),woman=await story.locator('[data-actor=woman]>img').boundingBox(),bag=await story.locator('.dialogue-handbag').boundingBox();
      expect(man.x+man.width,'等待归还时，包与两侧人物各有空间').toBeLessThanOrEqual(bag.x);
      expect(bag.x+bag.width).toBeLessThanOrEqual(woman.x);
    }
    await story.screenshot({path:`output/playwright/unit1-2-dialogue-short-${width}.png`});
    for(let i=2;i<7;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
    expect(await footerY()).toBeCloseTo(before,0);
    await expect(story.getByRole('img',{name:'女士确认后的手提包',exact:true})).toBeVisible();
    await expect(log.locator('.bubble-row')).toHaveCount(7);
    await story.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();
    expect(await footerY()).toBeCloseTo(before,0);
    await story.screenshot({path:`output/playwright/unit1-2-story-${width}.png`});
    // Keyboard scrolling reaches prior speech; replay must not move the page or lose history.
    await log.focus();await page.keyboard.press('Control+Home');await log.getByRole('button',{name:'Excuse me!',exact:true}).click();
    await expect(log.locator('.bubble-row')).toHaveCount(7);expect(await footerY()).toBeCloseTo(before,0);
    await log.getByRole('button',{name:'Is this your handbag?',exact:true}).first().click();
    const longBubble=log.locator('.bubble-row').nth(2);
    await longBubble.getByRole('button',{name:'看中文',exact:true}).click();
    await expect(longBubble.locator('.bcn')).toBeVisible();
    expect(await longBubble.locator('.btext').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'长句完整换行，不横向截断').toBe(true);
    await story.screenshot({path:`output/playwright/unit1-2-dialogue-history-${width}.png`});
    await page.goto('/unit1-2/#learn/words');const words=page.locator('.stage-words');
    await words.screenshot({path:`output/playwright/unit1-2-words-${width}.png`});
    await page.goto('/unit1-2/#learn/listen');const listen=page.locator('.stage-listen');
    await listen.screenshot({path:`output/playwright/unit1-2-listen-${width}.png`});
    await page.goto('/unit1-2/#learn/manners');const room=page.locator('.stage-manners');
    const parcel=room.locator('.quest-handbag'),parcelBox=await parcel.boundingBox();
    expect(parcelBox.width,'手提包有独立可辨的尺寸').toBeGreaterThanOrEqual(width<=600?84:108);
    await room.screenshot({path:`output/playwright/unit1-2-scene-attention-${width}.png`});
    const row=room.getByRole('group',{name:'作答操作',exact:true});
    const rowY=()=>row.evaluate(el=>el.getBoundingClientRect().top+scrollY);const initialY=await rowY();
    const hint=room.getByRole('button',{name:'给点线索',exact:true});const check=room.getByRole('button',{name:'检查答案',exact:true});
    const h=await hint.boundingBox(),c=await check.boundingBox();expect(h.x+h.width).toBeLessThan(c.x);
    await hint.click();expect(await rowY()).toBeCloseTo(initialY,0);
    await room.getByRole('button',{name:'Pardon?',exact:true}).click();await check.click();
    expect(await rowY()).toBeCloseTo(initialY,0);
    await room.getByRole('button',{name:'再试一次',exact:true}).click();
    await answer(room,'Excuse me!',null);expect(await rowY()).toBeCloseTo(initialY,0);
    await room.getByRole('button',{name:'下一题',exact:true}).click();
    await answer(room,'Is this your handbag?');await answer(room,'女士');
    for(const word of ['Thank','you','very','much.'])await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:word,exact:true}).click();
    await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'完成这一站',exact:true}).click();
    const finish=room.getByRole('group',{name:'完成后的操作',exact:true});
    await expect(finish.getByRole('button')).toHaveCount(2);
    for(const control of await finish.getByRole('button').all()){
      const b=await control.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width);expect(b.height).toBeGreaterThanOrEqual(44);
    }
    await room.screenshot({path:`output/playwright/unit1-2-finish-${width}.png`});
    await page.goto('/unit1-2/#learn/trans');await page.locator('.stage-trans').screenshot({path:`output/playwright/unit1-2-order-${width}.png`});
    await page.goto('/unit1-2/#learn/phrases');await page.locator('.stage-phrases').getByText('换个物品问一问',{exact:true}).click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
    expect(errors).toEqual([]);
  });
}

test('词块撤回、错误、刷新、修正和末题都沿用同一行为，历史分数不能答未来题',async({page})=>{
  await audioBoundary(page);await page.goto('/unit1-2/#learn/trans');const room=page.locator('.stage-trans');
  const bank=room.getByRole('group',{name:'待选词块',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});
  const order=await bank.getByRole('button').allTextContents();
  await bank.getByRole('button',{name:'this',exact:true}).click();
  await selected.getByRole('button',{name:'撤回 this',exact:true}).click();
  await expect(bank.getByRole('button',{name:'this',exact:true})).toBeEnabled();
  for(const word of ['this','Is','your','pen?'])await bank.getByRole('button',{name:word,exact:true}).click();
  await page.reload();expect(await bank.getByRole('button').allTextContents()).toEqual(order);
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();expect(await bank.getByRole('button').allTextContents()).toEqual(order);
  for(const word of ['Is','this','your','pen?'])await bank.getByRole('button',{name:word,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(selected.getByRole('button')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  for(const words of [['Yes,','it','is.']]){
    for(const word of words)await bank.getByRole('button',{name:word,exact:true}).click();
    await room.getByRole('button',{name:'检查答案',exact:true}).click();
    await room.getByRole('button',{name:'完成这一站',exact:true}).click();
  }
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(selected.getByRole('button')).toHaveCount(0);
});

test('键盘可播放、查看帮助与关闭弹层，短屏换题能看到题干',async({page})=>{
  await audioBoundary(page);await page.setViewportSize({width:390,height:400});
  await page.goto('/unit1-2/#learn/words');const words=page.locator('.stage-words');
  const card=words.getByRole('button',{name:'handbag',exact:true});await card.focus();await page.keyboard.press('Enter');await expect(card).toHaveAttribute('aria-expanded','true');
  const help=words.getByRole('button',{name:'怎么玩',exact:true});await help.focus();await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog',{name:'物品小图鉴',exact:true})).toBeVisible();await page.keyboard.press('Escape');await expect(help).toBeFocused();
  await page.goto('/unit1-2/#learn/manners');const room=page.locator('.stage-manners');
  await answer(room,'Excuse me!');
  await expect(room.getByRole('heading',{name:'她没听清，男士接下来怎么说？',exact:true})).toBeInViewport();
});
