'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function choose(room,answer,next='下一题'){
  if(Array.isArray(answer))for(const token of answer)await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();
  else await room.locator('.practice-options').getByRole('button',{name:answer,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  if(next)await room.getByRole('button',{name:next,exact:true}).click();
}

test('归还任务：错答不推进、选中不交包，刷新保持实际状态，末题结算与重练由孩子控制',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/unit1-2/#learn/manners');const room=page.locator('.stage-manners');
  const bag=room.locator('.quest-handbag');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuemax','4');
  await room.getByRole('button',{name:'Pardon?',exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(room.locator('.quest-conversation')).toBeEmpty();
  await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await choose(room,'Excuse me!',null);
  await expect(room.locator('.quest-conversation')).toContainText('Yes?');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(room.locator('.quest-conversation')).toContainText('Pardon?');
  await choose(room,'Is this your handbag?');
  await expect(room.locator('.quest-conversation')).toContainText('Yes, it is.');
  await room.getByRole('button',{name:'女士',exact:true}).click();
  await expect(bag).toHaveAttribute('alt','等待归还的手提包');
  await page.reload();await expect(room.getByRole('button',{name:'女士',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(bag).toHaveAttribute('alt','等待归还的手提包');
  await room.getByRole('button',{name:'男士',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(bag).toHaveAttribute('alt','等待归还的手提包');
  await room.getByRole('button',{name:'再试一次',exact:true}).click();await choose(room,'女士',null);
  await expect(room.getByRole('button',{name:'女士',exact:true}).locator('.quest-handbag')).toHaveCount(1);
  await page.reload();await expect(bag).toHaveAttribute('alt','已经交到女士手中的手提包');
  await room.getByRole('button',{name:'下一题',exact:true}).click();
  await expect(room.getByRole('group',{name:'已选词块',exact:true}).getByRole('button')).toHaveCount(0);
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(bag).toHaveAttribute('alt','已经交到女士手中的手提包');
  await choose(room,['Thank','you','very','much.'],null);
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','4');
  await room.getByRole('button',{name:'完成这一站',exact:true}).click();
  await expect(room).toContainText('手提包送回去了！');await expect(room.locator('.handbag-keepsake')).toContainText('Thank you very much.');
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(bag).toHaveAttribute('alt','等待归还的手提包');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();expect(errors).toEqual([]);
});

test('物品任务依据英文问句，选项不重复英文答案，声音不可用仍可完成场景',async({page})=>{
  await page.route('**/*.mp3',route=>route.abort());
  await page.goto('/unit1-2/#learn/ask');const room=page.locator('.stage-ask');
  await expect(room.locator('.quest-conversation')).toContainText('Is this your watch?');
  await expect(room.locator('.practice-options')).not.toContainText('watch');
  await room.getByRole('button',{name:'书',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.is-found')).toHaveCount(0);
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await room.getByRole('button',{name:'手表',exact:true}).focus();await page.keyboard.press('Enter');
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('button',{name:'手表',exact:true})).toHaveClass(/is-found/);
  await room.getByRole('button',{name:'完成这一站',exact:true}).click();await expect(room).toContainText('找到啦！');
});

for(const width of [320,390,768,1280])test(`${width} 像素场景、对白、人物目标、操作区与结束按钮`,async({page})=>{
  await page.setViewportSize({width,height:844});await page.goto('/unit1-2/#learn/manners');await page.evaluate(()=>document.fonts.ready);
  const room=page.locator('.stage-manners'),row=room.getByRole('group',{name:'作答操作',exact:true});
  const y=()=>row.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await y();
  await room.getByRole('button',{name:'给点线索',exact:true}).click();expect(await y()).toBeCloseTo(before,0);
  await choose(room,'Excuse me!',null);expect(await y()).toBeCloseTo(before,0);
  await room.getByRole('button',{name:'下一题',exact:true}).click();await choose(room,'Is this your handbag?');
  if(width<600){
    const speechBottom=await room.locator('.quest-speech').evaluateAll(bubbles=>Math.max(...bubbles.map(bubble=>bubble.getBoundingClientRect().bottom)));
    for(const who of ['男士','女士'])expect(speechBottom,'对白不应遮住可点击人物').toBeLessThanOrEqual((await room.getByRole('button',{name:who,exact:true}).boundingBox()).y);
    expect(await room.locator('.quest-conversation').evaluate(el=>el.scrollHeight<=el.clientHeight+1),'作答依据应完整可见').toBe(true);
  }
  const beforeDelivery=await y();await room.getByRole('button',{name:'女士',exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();expect(await y()).toBeCloseTo(beforeDelivery,0);
  const recipient=room.getByRole('button',{name:'女士',exact:true});
  await expect.poll(()=>recipient.evaluate(el=>el.getAnimations({subtree:true}).every(animation=>animation.playState==='finished'))).toBe(true);
  const personImage=await recipient.locator(':scope > img').boundingBox(),heldBag=await recipient.locator('.quest-handbag').boundingBox();
  expect(heldBag.height,'拿到手里后，包不应盖住人物').toBeLessThan(personImage.height*.5);
  expect(heldBag.x+heldBag.width/2,'手提包在人物手边').toBeGreaterThan(personImage.x+personImage.width*.65);
  for(const who of ['男士','女士']){const b=await room.getByRole('button',{name:who,exact:true}).boundingBox();expect(b.width).toBeGreaterThanOrEqual(44);expect(b.height).toBeGreaterThanOrEqual(44);expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  await room.screenshot({path:`output/playwright/unit1-2-scene-return-${width}.png`});
  await room.getByRole('button',{name:'下一题',exact:true}).click();await choose(room,['Thank','you','very','much.'],'完成这一站');
  await room.screenshot({path:`output/playwright/unit1-2-scene-finish-${width}.png`});
  for(const control of await room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button').all()){
    const b=await control.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width);expect(b.height).toBeGreaterThanOrEqual(44);
  }
  await page.goto('/unit1-2/#learn/ask');await page.locator('.stage-ask').screenshot({path:`output/playwright/unit1-2-scene-find-${width}.png`});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  await page.goto('/unit1-2/#cover');await page.locator('#cover').screenshot({path:`output/playwright/unit1-2-scene-cover-${width}.png`});
});

test('真实旧题稿升级：词汇听辨与原文保留，新场景不能继承旧完成或答案',async({page})=>{
  await page.addInitScript(()=>{window.Audio=class extends EventTarget{constructor(src){super();this.src=src;this.currentTime=0;}play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});
  let old=true;
  for(const file of ['content.js','unit.js'])await page.route('**/unit1-2/'+file+'*',route=>old?route.fulfill({contentType:'text/javascript',body:fs.readFileSync('tests/fixtures/unit1-2-scene-before/'+file,'utf8')}):route.continue());
  await page.goto('/unit1-2/#learn/listen');const listen=page.locator('.stage-listen');
  for(const [i,answer] of ['handbag','pen','pencil','book','watch','coat','dress','skirt','shirt','car','house'].entries()){
    await listen.getByRole('button',{name:'听一遍',exact:true}).click();await choose(listen,answer,i===10?'完成这一站':'下一题');
  }
  await page.goto('/unit1-2/#learn/text');const story=page.locator('.stage-text');await story.getByRole('button',{name:'开始听课文',exact:true}).click();
  for(let i=1;i<7;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
  await page.goto('/unit1-2/#learn/manners');const room=page.locator('.stage-manners');
  for(const [i,answer] of ['Excuse me!','Pardon?','Yes, it is.','Thank you very much.'].entries())await choose(room,answer,i===3?'完成这一站':'下一题');
  old=false;await page.reload();
  await expect(page.locator('#starCount')).toHaveText('4');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(listen.getByRole('button',{name:'再练一轮',exact:true})).toBeAttached();await expect(story.locator('.bubble-row')).toHaveCount(7);
  await expect(story.getByRole('button',{name:'再听一遍',exact:true})).toBeAttached();
});

test('发布子路径的新场景与人物不逃逸到根路径',async({page})=>{
  const outside=[],failed=[];
  page.on('request',request=>{const url=new URL(request.url());if(url.protocol==='http:'&&url.origin==='http://127.0.0.1:4173'&&!url.pathname.startsWith('/lesson/'))outside.push(url.pathname);});
  page.on('response',response=>{if(response.status()>=400)failed.push(response.url());});
  await page.goto('/lesson/unit1-2/#learn/manners');const room=page.locator('.stage-manners');await choose(room,'Excuse me!');await choose(room,'Is this your handbag?');await choose(room,'女士');
  await choose(room,['Thank','you','very','much.'],'完成这一站');
  await expect.poll(()=>page.locator('.handbag-keepsake img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
  expect(outside).toEqual([]);expect(failed).toEqual([]);
});
