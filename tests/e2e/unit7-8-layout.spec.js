'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
for(const width of [320,1280])test(`${width} 无配音课文翻句时按钮稳定，看图选词完整可见`,async({page})=>{
 await page.setViewportSize({width,height:800});await page.goto('/unit7-8/#learn/text');await page.evaluate(()=>document.fonts.ready);
 const story=page.locator('.stage-text'),controls=story.locator('.stage-ctrl');
 await story.getByRole('button',{name:'开始看课文',exact:true}).click();
 const before=await controls.evaluate(el=>({y:el.getBoundingClientRect().top,scroll:scrollY}));
 for(let i=1;i<16;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
 const after=await controls.evaluate(el=>({y:el.getBoundingClientRect().top,scroll:scrollY}));
 expect(after.y).toBeCloseTo(before.y,0);expect(after.scroll).toBeCloseTo(before.scroll,0);
 expect(await story.locator('.dialogue-log').evaluate(el=>el.scrollTop>0&&el.scrollHeight>el.clientHeight)).toBe(true);
 await page.screenshot({path:`output/playwright/unit7-8-classroom/story-${width}.png`});
 await page.goto('/unit7-8/#learn/listen');const room=page.locator('.stage-listen');
 await room.getByRole('button',{name:'意大利（人）的',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await expect(room.locator('.practice-scene')).toBeVisible();await expect(room.locator('.practice-options img')).toHaveCount(0);
 for(const b of await room.locator('.practice-options button').all())expect(await b.evaluate(el=>el.scrollWidth<=el.clientWidth&&el.scrollHeight<=el.clientHeight)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`output/playwright/unit7-8-classroom/picture-${width}.png`,fullPage:false});
});
for(const width of [320,390,768,1280])test(`${width} 各站无横向溢出、图标完整，双人人名不挤入对白`,async({page})=>{
 test.setTimeout(60000);await page.setViewportSize({width,height:740});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['words','listen','text','roles','phrases','reply','be','models','interview','trans','exam','certificate']){
  await page.goto('/unit7-8/#learn/'+id);const room=page.locator('.stage-'+id);await expect(room.getByRole('heading').first()).toBeInViewport();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  if(id==='text')expect(await room.locator('.dialogue-stage').evaluate(el=>{const log=el.querySelector('.dialogue-log').getBoundingClientRect(),left=el.querySelector('[data-actor="teacher"] span').getBoundingClientRect(),right=el.querySelector('[data-actor="student"] span').getBoundingClientRect();return left.right<=log.left&&right.left>=log.right;})).toBe(true);
  await room.getByRole('button',{name:'怎么玩',exact:true}).click();await page.keyboard.press('Escape');await expect(room.getByRole('button',{name:'怎么玩',exact:true})).toBeFocused();
  if([390,1280].includes(width)&&['words','listen','text','be','trans','models'].includes(id))await page.screenshot({path:`output/playwright/unit7-8/${id}-${width}.png`});
 }
 expect(errors).toEqual([]);
});

test('22 张词卡窄屏正反面不裁切音标或解释，最后一组主动进入单词寻宝',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.goto('/unit7-8/#learn/words');const room=page.locator('.stage-words');
 const ipa=['/ɪˈtæljən/','/ˈkiːbɔːrd ˌɑːpəreɪt̬ɚ/','/ˌendʒɪˈnɪr/','/pəˈliːsmən/','/pəˈliːsˌwʊmən/','/ˈtæksi ˌdraɪvɚ/','/ˈer ˌhoʊstɪs/','/ˈpoʊstmən/','/nɝːs/','/məˈkænɪk/','/ˈherˌdresɚ/','/ˈhaʊswaɪf/','/ˈmɪlkmən/','/aɪ/','/æm/','/ɑːr/','/neɪm/','/wɑːt/','/ˌnæʃənˈælət̬i/','/dʒɑːb/','/ˈkiːbɔːrd/','/ˈɑːpəreɪt̬ɚ/'];
 for(let i=0;i<22;i+=6){
  await expect(room.locator('.word-phonetic')).toHaveText(ipa.slice(i,i+6));
  for(const card of await room.locator('.unit-word').all()){
   await card.click();await expect(card.locator('.word-meaning')).toBeVisible();expect(await card.evaluate(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)).toBe(true);
   await card.click();await expect(card).toHaveAttribute('aria-expanded','false');await expect(card.locator('.word-phonetic')).toBeVisible();
  }
  if(i<18)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room.getByRole('button',{name:'nationality',exact:true})).toContainText('/ˌnæʃənˈælət̬i/');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page.locator('.stage-listen')).toContainText('第 1 / 13 题');await expect(page.locator('.stage-listen').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

for(const width of [320,1280])test(`${width} 灯泡在检查左边，错答、提示和结束操作不乱跳`,async({page})=>{
 await page.setViewportSize({width,height:740});await page.goto('/unit7-8/#learn/be');await page.evaluate(()=>document.fonts.ready);const room=page.locator('.stage-be'),actions=room.getByRole('group',{name:'作答操作',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true}),hint=room.getByRole('button',{name:'给点线索',exact:true});
 const y=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await y(),h=await hint.boundingBox(),c=await check.boundingBox();expect(h.x+h.width).toBeLessThan(c.x);await hint.click();expect(await y()).toBeCloseTo(before,0);await room.getByRole('button',{name:'am / am',exact:true}).click();await check.click();expect(await y()).toBeCloseTo(before,0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const [i,answer]of ['is / am','is / is'].entries()){await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i?'完成这一站':'下一题',exact:true}).click();}
 const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);for(const b of await finish.getByRole('button').all()){const box=await b.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);expect(box.height).toBeGreaterThanOrEqual(44);}await room.screenshot({path:`output/playwright/unit7-8/finish-${width}.png`});
});

test('词块可撤回、键盘重组，刷新保留草稿，下一题不继承答案',async({page})=>{
 await page.goto('/unit7-8/#learn/trans');const room=page.locator('.stage-trans'),bank=room.getByRole('group',{name:'待选词块',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});const order=await bank.getByRole('button').allTextContents();await bank.getByRole('button',{name:"What's",exact:true}).click();await selected.getByRole('button',{name:"撤回 What's",exact:true}).click();
 for(const token of ['your job?',"What's","I'm",'an engineer.'])await bank.getByRole('button',{name:token,exact:true}).click();await page.reload();expect(await bank.getByRole('button').allTextContents()).toEqual(order);await expect(selected.getByRole('button')).toHaveCount(4);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const token of ["What's",'your job?',"I'm",'an engineer.'])await bank.getByRole('button',{name:token,exact:true}).press('Enter');await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.getByRole('status')).toContainText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(selected.getByRole('button')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
