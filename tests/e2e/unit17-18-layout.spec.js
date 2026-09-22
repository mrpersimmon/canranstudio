'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS}=require('../support/unit17-18-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});

for(const width of [320,390,768,1280])test(width+' 各站完整、无横向溢出，帮助返回焦点，所有资源加载',async({page})=>{
  test.setTimeout(45000);await page.setViewportSize({width,height:740});const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const id of ['words','listen','text','roles','phrases','refer','forms','models','trans','exam','certificate']){
    await page.goto('/unit17-18/#learn/'+id);const room=page.locator('.stage-'+id);
    await expect(room.getByRole('heading').first()).toBeInViewport();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
    await room.getByRole('button',{name:'怎么玩',exact:true}).click();await page.keyboard.press('Escape');
    await expect(room.getByRole('button',{name:'怎么玩',exact:true})).toBeFocused();
    if([390,1280].includes(width)&&['words','listen','text','refer','forms','models','trans'].includes(id))await page.screenshot({path:'output/playwright/unit17-18/'+id+'-'+width+'.png'});
  }
  expect(errors).toEqual([]);
});

test('320 窄屏30张词卡展开后字义和音标不裁切，图册成双人物完整可辨',async({page})=>{
  await page.setViewportSize({width:320,height:740});await page.goto('/unit17-18/#learn/words');const room=page.locator('.stage-words');
  for(let p=0;p<5;p++){
    for(const card of await room.locator('.unit-word').all()){
      await card.click();await expect(card.locator('.word-meaning')).toBeVisible();
      expect(await card.evaluate(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)).toBe(true);
      await card.click();await expect(card.locator('.word-phonetic')).toBeVisible();
    }
    if(p<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  await page.goto('/unit17-18/#learn/models');await page.getByText('看看成双的职业',{exact:true}).click();const gallery=page.locator('.job-gallery');
  await gallery.screenshot({path:'output/playwright/unit17-18/job-gallery-320.png'});
});

for(const width of [320,1280])test(width+' 灯泡位于检查左边，反馈不推移操作，结束按钮为居中的主次双按钮',async({page})=>{
  await page.setViewportSize({width,height:740});await page.goto('/unit17-18/#learn/refer');await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-refer'),actions=room.getByRole('group',{name:'作答操作',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true}),hint=room.getByRole('button',{name:'给点线索',exact:true});
  const top=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await top(),h=await hint.boundingBox(),c=await check.boundingBox();
  expect(h.x+h.width).toBeLessThan(c.x);await hint.click();expect(await top()).toBeCloseTo(before,0);
  await room.getByRole('button',{name:"What's his job?",exact:true}).click();await check.click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');expect(await top()).toBeCloseTo(before,0);
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  for(const [i,answer] of ANSWERS.refer.entries()){
    await room.getByRole('button',{name:answer,exact:true}).click();await check.click();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    await room.getByRole('button',{name:i===2?'完成这一站':'下一题',exact:true}).click();
  }
  const group=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(group.getByRole('button')).toHaveCount(2);
  for(const b of await group.getByRole('button').all()){const box=await b.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);expect(box.height).toBeGreaterThanOrEqual(44);}
  await room.screenshot({path:'output/playwright/unit17-18/finish-'+width+'.png'});
});

test('390短屏阅读内部滚动，下一句与重新上演同行，展开中文不移动推进按钮',async({page})=>{
  await page.setViewportSize({width:390,height:500});await page.goto('/unit17-18/#learn/text');await page.evaluate(()=>document.fonts.ready);const room=page.locator('.stage-text');
  const buttons=room.locator('.stage-ctrl'),before=await buttons.evaluate(el=>el.getBoundingClientRect().top+scrollY);
  for(let i=0;i<16;i++){
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    expect(await buttons.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(before,0);
  }
  await room.locator('.bbtns').last().getByRole('button').click();
  expect(await buttons.evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(before,0);
  const advance=await room.getByRole('button',{name:'完成课文',exact:true}).boundingBox(),replay=await room.getByRole('button',{name:'重新上演',exact:true}).boundingBox();
  expect(Math.abs(advance.y-replay.y)).toBeLessThan(2);
  await room.screenshot({path:'output/playwright/unit17-18/story-short-screen.png'});
});

test('词块可撤回、键盘操作、刷新续填；错序不能过关，新题不继承答案',async({page})=>{
  await page.goto('/unit17-18/#learn/trans');const room=page.locator('.stage-trans'),bank=room.getByRole('group',{name:'待选词块',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});
  const order=await bank.getByRole('button').allTextContents();await bank.getByRole('button',{name:'What',exact:true}).click();await selected.getByRole('button',{name:'撤回 What',exact:true}).click();
  for(const token of ['their','are','What','jobs?'])await bank.getByRole('button',{name:token,exact:true}).click();
  await page.reload();expect(await bank.getByRole('button').allTextContents()).toEqual(order);await expect(selected.getByRole('button')).toHaveCount(4);
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  for(const token of ANSWERS.trans[0])await bank.getByRole('button',{name:token,exact:true}).press('Enter');
  await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.getByRole('status')).toContainText('答对了！');
  await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(selected.getByRole('button')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
