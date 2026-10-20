'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,DIALOGUE,SPEAKERS,select,story,activity}=require('../support/unit1516-fivezones');
test.use({actionTimeout:7000,...(process.env.UNIT1516_BROWSER==='webkit'?{browserName:'webkit'}:{})});
test('55题、完整原文、五区五星及教材参考均可真实完成',async({page},info)=>{
 test.setTimeout(180000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('#starCount')).toHaveText('0');
 for(const [id,answers]of Object.entries(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){
   if(id==='grammar'&&[0,1,2,3,4,5,6,7,8,11,12,13,14,15].includes(i))await expect(room.locator('.practice-context')).not.toBeEmpty();
   if(id==='exam'&&[2,3,4,5,7,8,11,12,13,14,16,17,18,19,20].includes(i))await expect(room.locator('.practice-context')).not.toBeEmpty();
   if(id==='apply'&&i===0)await expect(room).toContainText('两位姑娘都是游客');
   if(id==='apply'&&i===5)await expect(room.locator('.practice-context')).not.toBeEmpty();
   if(id==='exam'&&i===6){const image=room.locator('.practice-scene');await expect(image).toBeVisible();await expect(image).toHaveAttribute('alt','两顶灰色帽子，都带黑色帽带');expect(await image.evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);}
  }}});
  await expect(room.locator('.completion-stat')).toHaveCount(3);await room.locator('.completion-card').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
 }
 await expect(page.locator('#starCount')).toHaveText('5');await page.goto('/unit15-16/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');
 await page.goto('/unit15-16/#learn/apply');await page.getByText('课本小参考 · 第16课',{exact:true}).click();
 for(const number of [60,70,80,90,100,101,102,103,104,105,106,107,108,109,110]){await expect(page.locator('.gallery-current small')).toHaveText(String(number));if(number!==110)await page.getByRole('button',{name:'下一幅出行图',exact:true}).click();}
 for(let i=0;i<12;i++){await expect(page.locator('.model-current + .reference-pager span')).toHaveText((i+1)+' / 12');if(i<11)await page.getByRole('button',{name:'下一份问答',exact:true}).click();}await expect(page.locator('.model-current')).toContainText('cars / red');
 await page.goto('/unit15-16/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('.writing-a li')).toHaveCount(6);await expect(page.locator('.writing-b li')).toHaveCount(12);await expect(page.locator('.writing-rule')).toHaveCount(24);await expect(page.locator('.writing-blank')).toHaveCount(6);
 expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('错误和部分填答刷新保留，完整重练才获星，已获星不扣回',async({page})=>{
 test.setTimeout(120000);await page.goto('/unit15-16/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{fills:['officeres']});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await check.click();await page.reload();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await expect(check).toBeEnabled();await select(room,ANSWERS.grammar[0]);await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await activity(page,'grammar',{expectPerfect:false});await expect(room.locator('.completion-number')).toHaveText(['16','16','2']);await expect(page.locator('#starCount')).toHaveText('0');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,{fills:['officeres']});await check.click();await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
});
for(const width of [320,390,768,1280])test(`场景与词卡 ${width}：完整18句、中文内滚动、相向人物及旧链接`,async({page},info)=>{
 await page.setViewportSize({width,height:width<500?568:900});await page.goto('/unit15-16/#learn/text');const room=page.locator('.stage-text');
 await expect(room.locator('.travel-records')).toHaveCount(0);await expect(room.locator('.story-lead')).toHaveText('Is there a problem with the customs officer?');
 for(let i=0;i<18;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  const before=await room.locator('.stage-ctrl').boundingBox();await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();const after=await room.locator('.stage-ctrl').boundingBox();expect(Math.abs(after.height-before.height)).toBeLessThan(1);
  await expect(room.locator('.travel-cast')).toHaveAttribute('data-phase',i<6?'arrival':i===6?'request':i<8?'handover':i<10?'other-cases':i<12?'own-cases':'travellers');
  if(i<6)await expect(room.locator('.travel-passports')).toBeHidden();else{await expect(room.locator('.travel-passports')).toBeVisible();await expect(room.locator('.travel-passports')).toHaveAttribute('data-place',i===6?'girls':'counter');}
  if(i<8)await expect(room.locator('.travel-other-cases')).toBeHidden();else await expect(room.locator('.travel-other-cases')).toBeVisible();
  if(i<10)await expect(room.locator('.travel-own-cases')).toBeHidden();else await expect(room.locator('.travel-own-cases')).toBeVisible();
  const bounds=await room.locator('.travel-world').boundingBox(),actors=await room.locator('.cast-image').all(),log=await room.locator('.dialogue-log').boundingBox(),frame=await room.locator('.dialogue-stage').boundingBox();
  for(const image of actors){const actor=await image.boundingBox();expect(actor.x).toBeGreaterThanOrEqual(bounds.x);expect(actor.x+actor.width).toBeLessThanOrEqual(bounds.x+bounds.width+1);expect(log.y+log.height).toBeLessThan(actor.y+1);expect(actor.y+actor.height).toBeLessThanOrEqual(bounds.y+bounds.height);}
  expect(bounds.y+bounds.height).toBeLessThanOrEqual(frame.y+frame.height+1);expect(await room.locator('.travel-cast .officer').evaluate(e=>getComputedStyle(e).transform)).toBe('none');
  if([0,6,7,10,11,17].includes(i))await room.screenshot({path:info.outputPath('pose-'+i+'-'+width+'.png')});

 }
 expect(await room.locator('.btext').first().evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Nunito');await room.screenshot({path:info.outputPath('story-'+width+'.png')});await page.reload();await expect(room.locator('.btext span')).toHaveCount(18);await expect(room.locator('.bcn:visible')).toHaveCount(0);
 await page.goto('/unit15-16/#learn/words');await expect(page.locator('.unit-word')).toHaveCount(6);await page.getByRole('button',{name:'customs',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto('/unit15-16/#learn/forms');await expect(page).toHaveURL(/#learn\/grammar$/);await page.goto('/unit15-16/#learn/trans');await expect(page).toHaveURL(/#learn\/apply$/);
});
for(const [width,height]of [[320,568],[390,500]])test(`短屏 ${width}x${height}：五区三卡和操作完整可见`,async({page},info)=>{
 test.setTimeout(180000);await page.setViewportSize({width,height});await story(page);
 for(const id of Object.keys(ANSWERS)){const room=await activity(page,id);await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  const cards=await room.locator('.completion-stat').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height};}));expect(cards).toHaveLength(3);expect(Math.max(...cards.map(b=>b.y))-Math.min(...cards.map(b=>b.y))).toBeLessThan(2);expect(Math.max(...cards.map(b=>b.w))-Math.min(...cards.map(b=>b.w))).toBeLessThan(2);
  await room.getByRole('group',{name:'完成后的操作',exact:true}).scrollIntoViewIfNeeded();expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(es=>es.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);await room.screenshot({path:info.outputPath(id+'-'+width+'-short.png')});
 }
});
