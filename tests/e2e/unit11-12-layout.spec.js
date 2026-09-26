'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('单张示范卡在宽窄屏居中，打印填空至少留出 64 像素书写宽度',async({page})=>{
 for(const width of [320,1280]){await page.setViewportSize({width,height:740});await page.goto('/unit11-12/#learn/models');const card=await page.locator('.model-example .phrase-card').boundingBox(),room=await page.locator('.stage-models').boundingBox();expect(Math.abs(card.x+card.width/2-room.x-room.width/2)).toBeLessThan(2);}
 await page.goto('/unit11-12/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('.reference-writing .writing-blank')).toHaveCount(4);for(const blank of await page.locator('.reference-writing .writing-blank').all())expect((await blank.boundingBox()).width).toBeGreaterThanOrEqual(64);
});
for(const width of [320,390,768,1280])test(`${width} 各站无横向溢出，图标和三人舞台完整，帮助关闭后返回焦点`,async({page})=>{
 test.setTimeout(60000);await page.setViewportSize({width,height:740});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['words','listen','text','roles','phrases','owner','models','trans','exam','certificate']){
  await page.goto('/unit11-12/#learn/'+id);const room=page.locator('.stage-'+id);await expect(room.getByRole('heading').first()).toBeInViewport();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);

  await room.getByRole('button',{name:'怎么玩',exact:true}).click();await page.keyboard.press('Escape');await expect(room.getByRole('button',{name:'怎么玩',exact:true})).toBeFocused();
  if([390,1280].includes(width)&&['words','listen','text','owner','trans','models'].includes(id))await page.screenshot({path:`output/playwright/unit11-12/${id}-${width}.png`});
 }
 expect(errors).toEqual([]);
});
test('18 张词卡在窄屏可翻面、读音标，末组刷新后仍有下一站',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.goto('/unit11-12/#learn/words');const room=page.locator('.stage-words');
 const ipa=['/huːz/','/bluː/','/pɚˈhæps/','/waɪt/','/kætʃ/','/ˈfɑːðɚ/','/ˈmʌðɚ/','/blaʊs/','/ˈsɪstɚ/','/taɪ/','/ˈbrʌðɚ/','/hɪz/','/hɝː/','/ʃɝːt/','/suːt/','/skɝːt/','/sʌn/','/ˈdɑːt̬ɚ/'];
 for(let i=0;i<18;i+=6){await expect(room.locator('.word-phonetic')).toHaveText(ipa.slice(i,i+6));for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();expect(await card.evaluate(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)).toBe(true);await card.click();await expect(card).toHaveAttribute('aria-expanded','false');await expect(card.locator('.word-phonetic')).toBeVisible();}if(i<12)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 await page.reload();await expect(room.getByRole('button',{name:'daughter',exact:true})).toContainText('/ˈdɑːt̬ɚ/');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page.locator('.stage-listen')).toContainText('第 1 / 13 题');await expect(page.locator('.stage-listen').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
for(const width of [320,1280])test(`${width} 灯泡在检查左边，反馈不推移操作，最后一题明确完成再结算`,async({page})=>{
 await page.setViewportSize({width,height:740});await page.goto('/unit11-12/#learn/owner');await page.evaluate(()=>document.fonts.ready);const room=page.locator('.stage-owner'),actions=room.getByRole('group',{name:'作答操作',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true}),hint=room.getByRole('button',{name:'给点线索',exact:true});
 const y=()=>actions.evaluate(el=>el.getBoundingClientRect().top+scrollY),before=await y(),h=await hint.boundingBox(),c=await check.boundingBox();expect(h.x+h.width).toBeLessThan(c.x);await hint.click();expect(await y()).toBeCloseTo(before,0);await room.getByRole('button',{name:'his',exact:true}).click();await check.click();expect(await y()).toBeCloseTo(before,0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const [i,answer]of ['her','your',"shirt's"].entries()){

  await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));if(i===2)await expect(room.getByRole('button',{name:'下一站：认领小画册',exact:true})).toHaveCount(0);await room.getByRole('button',{name:i===2?'完成这一站':'下一题',exact:true}).click();
 }
 const finish=room.getByRole('group',{name:'完成后的操作',exact:true});await expect(finish.getByRole('button')).toHaveCount(2);for(const b of await finish.getByRole('button').all()){const box=await b.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width);expect(box.height).toBeGreaterThanOrEqual(44);}await room.screenshot({path:`output/playwright/unit11-12/finish-${width}.png`});
});
test('词块支持撤回和键盘；错序刷新不获正确，换题不继承已选词块',async({page})=>{
 await page.goto('/unit11-12/#learn/trans');const room=page.locator('.stage-trans'),bank=room.getByRole('group',{name:'待选词块',exact:true}),selected=room.getByRole('group',{name:'已选词块',exact:true});const order=await bank.getByRole('button').allTextContents();await bank.getByRole('button',{name:'Whose',exact:true}).click();await selected.getByRole('button',{name:'撤回 Whose',exact:true}).click();
 for(const token of ['is','Whose','that','tie?'])await bank.getByRole('button',{name:token,exact:true}).click();await page.reload();expect(await bank.getByRole('button').allTextContents()).toEqual(order);await expect(selected.getByRole('button')).toHaveCount(4);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await room.getByRole('button',{name:'再试一次',exact:true}).click();
 for(const token of ['Whose','is','that','tie?'])await bank.getByRole('button',{name:token,exact:true}).press('Enter');await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.getByRole('status')).toContainText('答对了！');await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(selected.getByRole('button')).toHaveCount(0);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
