'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,select,story,activity,complete}=require('../support/thirteen-types-flow');
test.use({reducedMotion:'reduce',actionTimeout:4000});
for(const pair of ['1-2','25-26'])for(const base of ['','/lesson'])test(`${pair} ${base||'root'} 无配音完整通关与真实证书`,async({page})=>{
 test.setTimeout(90000);const audio=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());
 await page.addInitScript(()=>{window.voiceCalls=0;speechSynthesis.speak=()=>voiceCalls++;});
 await complete(page,pair,base);expect(audio.every(url=>url.includes('/assets/feedback/')||/\/resources\//.test(url))).toBe(true);expect(await page.evaluate(()=>voiceCalls)).toBe(0);expect(errors).toEqual([]);
 const claim=page.getByRole('button',{name:'领取单元证书',exact:true});await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('体验小朋友');await claim.click();
 const dialog=page.locator('dialog[open]');const date=await dialog.locator('#certificateDate').innerText();
 const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await(await download).saveAs(`output/test-thirteen-types/${pair}-${base?'lesson':'root'}-certificate.png`);
 await page.keyboard.press('Escape');await page.reload();await claim.click();await expect(dialog.locator('#certificateDate')).toHaveText(date);
});
test('辨认问句保存选择，错误只重试，新题保持未答',async({page})=>{
 await page.goto('/unit1-2/#learn/trans');const room=page.locator('.stage-trans'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await expect(room.getByRole('textbox')).toHaveCount(0);await expect(check).toBeDisabled();await select(room,'This is your book.');await page.reload();await expect(room.getByRole('button',{name:'This is your book.',exact:true})).toHaveAttribute('aria-pressed','true');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');
 await page.reload();await room.getByRole('button',{name:'再试一次',exact:true}).click();await select(room,'Is this your book?');await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
 await page.reload();await expect(room.locator('.progress-copy')).toHaveText('第 1 / 12 题');await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(check).toBeDisabled();
 await page.getByRole('button',{name:'学习手记',exact:true}).click();await expect(page.locator('#learningRecord')).toContainText('修正后完成');
});
test('中文词块含干扰项，刷新保持排序，错误保留草稿且可撤回修正',async({page})=>{
 await page.goto('/unit25-26/#learn/observe');const room=page.locator('.stage-observe'),bank=room.getByRole('group',{name:'待选词块',exact:true}),chosen=room.getByRole('group',{name:'已选词块',exact:true}),check=room.getByRole('button',{name:'检查答案',exact:true});
 const order=await bank.locator('button').allTextContents();await bank.getByRole('button',{name:'桌子里',exact:true}).click();await expect(check).toBeDisabled();await page.reload();await expect(bank.locator('button')).toHaveText(order);await expect(chosen).toContainText('桌子里');
 await bank.getByRole('button',{name:'有',exact:true}).click();await bank.getByRole('button',{name:'一个瓶子',exact:true}).click();await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await expect(chosen.getByRole('button')).toHaveCount(3);
 await select(room,['桌子上','有','一个瓶子']);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');expect(await bank.locator('button').count()).toBe(6);
});
test('情境在确认正确答案之前不交包、不显示新位置；刷新还原真实状态',async({page})=>{
 await page.goto('/unit1-2/#learn/manners');const room=page.locator('.stage-manners');
 for(const answer of ANSWERS['1-2'].manners.slice(0,2)){await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 await select(room,'Yes, it is.');await expect(room.locator('.street-stage')).not.toHaveClass(/is-returned/);await page.reload();await expect(room.locator('.street-stage')).not.toHaveClass(/is-returned/);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.street-stage')).toHaveClass(/is-returned/);await page.reload();await expect(room.locator('.quest-outcome')).toHaveText('手提包回到你手中了。');
 await page.goto('/unit25-26/#learn/errands');const kitchen=page.locator('.stage-errands');await expect(kitchen.locator('.task-reading-turn')).toHaveCount(6);await select(kitchen,ANSWERS['25-26'].errands[0]);await kitchen.getByRole('button',{name:'检查答案',exact:true}).click();await kitchen.getByRole('button',{name:'下一题',exact:true}).click();
 await select(kitchen,'What colour is it?');await kitchen.getByRole('button',{name:'检查答案',exact:true}).click();await expect(kitchen.locator('.inquiry-discovery img')).toHaveCount(0);await kitchen.getByRole('button',{name:'再试一次',exact:true}).click();await select(kitchen,'Where is it?');await expect(kitchen.locator('.inquiry-discovery img')).toHaveCount(0);await kitchen.getByRole('button',{name:'检查答案',exact:true}).click();await expect(kitchen.locator('.inquiry-discovery img')).toBeVisible();await expect(kitchen.locator('.inquiry-dialogue')).toContainText('It is in the cup.');await page.reload();await expect(kitchen.locator('.inquiry-discovery img')).toBeVisible();
});
for(const width of [320,390,768,1280])test(`${width} 两套题作答前后可读、可操作且无横向溢出`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width,height:width===390?640:850});
 for(const pair of ['1-2','25-26']){
  await story(page,pair);
  for(const id of Object.keys(ANSWERS[pair]))await activity(page,pair,id,{capture:async(room,i,state)=>{
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   for(const control of await room.locator('.practice-options button:visible,.practice-options input:visible').all()){
    const box=await control.boundingBox();expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+1);expect(box.height).toBeGreaterThanOrEqual(44);
   }
   if((id==='roles'&&i===0)||(id==='trans'&&i===0)||(id==='errands')||(id==='manners'&&i===2)){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`output/test-thirteen-types/${pair}-${width}-${id}-${i}-${state}.png`,fullPage:true,clip:await room.boundingBox()});}
  }});
 }
});
for(const pair of ['1-2','25-26'])test(`${pair} 真实旧轮次升级保留相同题和纪念信息，新题必须亲自作答`,async({page})=>{
 test.setTimeout(90000);const legacy=require('../support/units1-30-tasks');
 await page.addInitScript(()=>{window.Audio=class extends EventTarget{play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});
 await require('../support/types-predecessor').installPredecessor(page,pair);
 const before=`/tests/fixtures/unit${pair}-types-before/`;
 await page.goto(before+'#learn/text');const text=page.locator('.stage-text');await text.getByRole('button',{name:pair==='1-2'?'开始听课文':'开始看课文',exact:true}).click();
 const count=pair==='1-2'?7:12;for(let i=1;i<count;i++)await text.getByRole('button',{name:'下一句',exact:true}).click();await text.getByRole('button',{name:pair==='1-2'?'完成课文学习':'完成课文',exact:true}).click();
 for(const id of Object.keys(legacy.CASES[pair].old)){
  await page.goto(before+'#learn/'+id);const room=page.locator('.stage-'+id),items=legacy.answers(pair,id);
  for(let i=0;i<items.length;i++){
   if(items[i].audio)await room.getByRole('button',{name:'听一遍',exact:true}).click();
   await legacy.select(room,items[i].answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.locator('.fb')).toHaveText('答对了！');await room.getByRole('button',{name:i===items.length-1?(id==='exam'?'查看本次记录':'完成这一站'):'下一题',exact:true}).click();
  }
 }
 await page.goto(before+'#learn/certificate');await expect(page.locator('#starCount')).toHaveText('15');await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('升级小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
 await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('升级小伙伴');
 await page.goto(`/unit${pair}/#learn/exam`);await expect(page.locator('.stage-exam .progress-copy')).toHaveText(pair==='1-2'?'第 2 / 10 题':'第 6 / 9 题');await expect(page.locator('.stage-exam').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await complete(page,pair);await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(date);
});
