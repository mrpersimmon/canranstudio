'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,DIALOGUE,SPEAKERS,select,story,activity}=require('../support/unit2728-fivezones');
const {expectCompactCompletion}=require('../support/completion-layout');
test.use({actionTimeout:7000,...(process.env.UNIT2728_BROWSER==='webkit'?{browserName:'webkit'}:{})});

test('43题、13句完整叙述、五区五星与逐题未答材料可完成',async({page},info)=>{
 test.setTimeout(240000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});await story(page);
 for(const id of Object.keys(ANSWERS))await activity(page,id,{inspect:async(room,index,state)=>{if(state!=='before')return;const material=room.locator('.practice-context');if(await material.count())await expect(material).toBeVisible();await room.screenshot({path:info.outputPath(id+'-'+String(index+1).padStart(2,'0')+'-unanswered.png')});}});
 await expect(page.locator('#starCount')).toHaveText('5');await page.goto('/unit27-28/#learn/certificate');await expect(page.locator('.story-award-panel')).toContainText('细心客厅发现家');expect(errors).toEqual([]);expect(voices).toEqual([]);await page.locator('.story-award-panel').screenshot({path:info.outputPath('five-stars.png')});
});
test('单选连续错答、订正、刷新和重练保留实际统计与旧星',async({page})=>{
 test.setTimeout(150000);await page.goto('/unit27-28/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 for(let i=0;i<2;i++){await select(room,'a');await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');if(i===0)await room.getByRole('button',{name:'再试一次',exact:true}).click();}
 await page.reload();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await expect(check).toBeDisabled();await select(room,'some');await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await activity(page,'grammar',{expectPerfect:false});await expect(room.locator('.completion-number')).toHaveText(['12','12','2']);await expect(page.locator('#starCount')).toHaveText('0');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,'a');await check.click();await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
});
for(const width of [320,390,768,1280])test('完整客厅、原文叙述与逐句中文 '+width,async({page},info)=>{
 await page.setViewportSize({width,height:width<500?568:900});await page.goto('/unit27-28/#learn/text');const room=page.locator('.stage-text');await expect(room.locator('.story-lead')).toHaveText('Where are the books?');await expect(room.locator('.dialogue-actor')).toHaveCount(0);
 for(let i=0;i<13;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));await expect(room.locator('.desk-world')).toHaveAttribute('data-focus',['room','television','television','magazines','table','newspapers','armchairs','armchairs','stereo','stereo','books','pictures','pictures'][i]);
  const before=await room.locator('.stage-ctrl').boundingBox();await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();const after=await room.locator('.stage-ctrl').boundingBox();expect(Math.abs(after.y-before.y)).toBeLessThan(1);expect(Math.abs(after.height-before.height)).toBeLessThan(1);
  const frame=await room.locator('.desk-world').boundingBox(),reader=await room.locator('.desk-reader').boundingBox(),picture=await room.locator('.living-room-picture').boundingBox();expect(picture.y).toBeGreaterThan(reader.y+reader.height+8);expect(picture.x).toBeGreaterThanOrEqual(frame.x);expect(picture.x+picture.width).toBeLessThanOrEqual(frame.x+frame.width+1);expect(picture.y+picture.height).toBeLessThanOrEqual(frame.y+frame.height+1);
  expect(await room.locator('.room-image').evaluate(e=>e.currentSrc.includes(innerWidth<=600?'living-room-mobile-v1.webp':'living-room-v1.webp'))).toBe(true);
  if([0,3,6,7,9,11].includes(i))await room.screenshot({path:info.outputPath('story-'+width+'-'+i+'.png')});
 }
 await page.reload();await expect(room.locator('.btext span')).toHaveCount(13);await expect(room.locator('.bcn:visible')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 for(const [old,next]of [['be','grammar'],['observe','grammar'],['models','apply'],['trans','apply']]){await page.goto('/unit27-28/#learn/'+old);await expect(page).toHaveURL(new RegExp('#learn/'+next+'$'));}
});
for(const[width,height]of [[320,568],[390,500]])test('短屏三卡、继续操作及阅读按钮 '+width+'x'+height,async({page},info)=>{
 test.setTimeout(240000);await page.setViewportSize({width,height});await story(page);for(const id of Object.keys(ANSWERS)){const room=await activity(page,id);await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await expect(room.locator('.completion-stat')).toHaveCount(3);await expectCompactCompletion(page,room,{illustrated:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);const art=await room.locator('.completion-art').boundingBox(),img=await room.locator('.completion-art>img').boundingBox();expect(img.width).toBeLessThanOrEqual(art.width+1);await room.locator('.practice-finish').screenshot({path:info.outputPath(id+'-finish.png')});}
});
test('双空未齐、错答和刷新保留草稿，不自动选择正确项',async({page})=>{
 await page.goto('/unit27-28/#learn/grammar');const room=page.locator('.stage-grammar');for(let i=0;i<2;i++){await select(room,ANSWERS.grammar[i]);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
 const check=room.getByRole('button',{name:'检查答案',exact:true});await select(room,{fills:['are']});await expect(check).toBeDisabled();await page.reload();await expect(check).toBeDisabled();await room.getByRole('group',{name:'第2处填空',exact:true}).getByRole('button',{name:'any',exact:true}).click();await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await expect(check).toBeEnabled();await select(room,ANSWERS.grammar[2]);await check.click();await expect(room.locator('.fb')).toHaveText('答对了！');
});
test('30张词卡音标、10幅原图、10组五轮问答与两个参考分页完整保留',async({page})=>{
 await page.goto('/unit27-28/#learn/words');const seen=[];for(let n=0;n<5;n++){await expect(page.locator('#wordPageProgress')).toHaveText((n+1)+' / 5');for(const card of await page.locator('.unit-word').all()){seen.push(await card.getAttribute('aria-label'));await expect(card.locator('.word-phonetic')).toBeVisible();await card.click();await expect(card.locator('.word-meaning')).toBeVisible();}if(n<4)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();}expect(new Set(seen).size).toBe(30);
 await page.goto('/unit27-28/#learn/apply');await page.getByText('课本小参考 · 第28课',{exact:true}).click();for(let n=0;n<10;n++){await expect(page.locator('.gallery-current small')).toHaveText(['1,120','2,230','3,340','4,450','5,560','6,670','7,780','8,890','9,999','10,001'][n]);if(n<9)await page.getByRole('button',{name:'下一组物品图',exact:true}).click();}
 for(let n=0;n<10;n++){await expect(page.locator('.model-current + .reference-pager span')).toHaveText((n+1)+' / 10');if(n<9)await page.getByRole('button',{name:'下一份问答',exact:true}).click();}await page.reload();await page.getByText('课本小参考 · 第28课',{exact:true}).click();await expect(page.locator('.gallery-current small')).toHaveText('10,001');await expect(page.locator('.model-current + .reference-pager span')).toHaveText('10 / 10');await expect(page.locator('.model-current')).toContainText("They're near the table.");
});
test('声音全坏仍能完整学习，未出现英语声音请求',async({page},info)=>{
 test.setTimeout(240000);const voices=[];page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});await page.route(/\.(?:mp3|wav|ogg)(?:\?|$)/,route=>route.abort());await page.addInitScript(()=>{window.unit2728PlayFailures=0;HTMLMediaElement.prototype.play=function(){window.unit2728PlayFailures++;return Promise.reject(new Error('Audio unavailable'));};if(window.speechSynthesis)speechSynthesis.speak=()=>{throw new Error('No English speech allowed');};});await story(page);for(const id of Object.keys(ANSWERS))await activity(page,id);await expect(page.locator('#starCount')).toHaveText('5');expect(voices).toEqual([]);const failures=await page.evaluate(()=>window.unit2728PlayFailures);expect(failures).toBeGreaterThan(0);info.annotations.push({type:'actual-audio-rejections',description:String(failures)});
});
