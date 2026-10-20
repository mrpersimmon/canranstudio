'use strict';
const {test,expect}=require('@playwright/test');
const {ANSWERS,DIALOGUE,SPEAKERS,select,story,activity}=require('../support/unit1314-fivezones');
test.use({actionTimeout:7000,...(process.env.UNIT1314_BROWSER==='webkit'?{browserName:'webkit'}:{})});
test('53题、完整原文、五区五星及教材参考均可真实完成',async({page},info)=>{
 test.setTimeout(180000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});
 await story(page);await expect(page.locator('#starCount')).toHaveText('0');
 for(const [id,answers]of Object.entries(ANSWERS)){
  const room=await activity(page,id,{inspect:async(room,i,phase)=>{if(phase==='before'){if(id==='grammar'&&[0,2,4,7,9,10].includes(i))await expect(room.locator('.practice-context')).not.toBeEmpty();if(id==='exam'&&[3,10,11,13,15,16].includes(i))await expect(room.locator('.practice-context')).not.toBeEmpty();if(id==='apply'&&[4,5].includes(i))await expect(room.locator('.practice-context')).not.toBeEmpty();if(id==='exam'&&i===5){await expect(room.locator('.task-evidence-image')).toBeVisible();expect(await room.locator('.task-evidence-image').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);}}}});
  await expect(room.locator('.completion-stat')).toHaveCount(3);await room.locator('.completion-card').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');await room.screenshot({path:info.outputPath(id+'-completed.png')});
 }
 await expect(page.locator('#starCount')).toHaveText('5');await page.goto('/unit13-14/#learn/certificate');await expect(page.locator('.stage-certificate .story-award-paper')).toHaveAttribute('data-stars','5');
 await page.goto('/unit13-14/#learn/apply');await page.getByText('课本小参考 · 第14课',{exact:true}).click();
 for(const number of [20,30,40,50,60,70,80,90,100,101]){await expect(page.locator('.gallery-current small')).toHaveText(String(number));if(number!==101)await page.getByRole('button',{name:'下一幅配色图',exact:true}).click();}
 for(let i=0;i<12;i++){await expect(page.locator('.model-current + .reference-pager span')).toHaveText((i+1)+' / 12');if(i<11)await page.getByRole('button',{name:'下一份问答',exact:true}).click();}await expect(page.locator('.model-current')).toContainText('Sophie / skirt / yellow');
 await page.goto('/unit13-14/#learn/certificate');await page.getByText('课后练习纸',{exact:true}).click();await expect(page.locator('.writing-a li')).toHaveCount(5);await expect(page.locator('.writing-b li')).toHaveCount(12);await expect(page.locator('.writing-rule')).toHaveCount(29);
 expect(errors).toEqual([]);expect(voices).toEqual([]);
});
test('错误和部分填答刷新保留，完整重练才获星，已获星不扣回',async({page})=>{
 test.setTimeout(120000);await page.goto('/unit13-14/#learn/grammar');const room=page.locator('.stage-grammar'),check=room.getByRole('button',{name:'检查答案',exact:true});
 await select(room,{fills:['are']});await check.click();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await check.click();await page.reload();await expect(room.locator('.fb')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await expect(check).toBeEnabled();await select(room,ANSWERS.grammar[0]);await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await activity(page,'grammar',{expectPerfect:false});await expect(room.locator('.completion-number')).toHaveText(['11','11','2']);await expect(page.locator('#starCount')).toHaveText('0');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await activity(page,'grammar');await expect(page.locator('#starCount')).toHaveText('1');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await select(room,{fills:['are']});await check.click();await page.reload();await expect(page.locator('#starCount')).toHaveText('1');
});
for(const width of [320,390,768,1280])test(`场景与词卡 ${width}：完整13句、中文内滚动、相向人物及旧链接`,async({page},info)=>{
 await page.setViewportSize({width,height:width<500?568:900});await page.goto('/unit13-14/#learn/text');const room=page.locator('.stage-text');
 await expect(room.locator('.colour-records')).toHaveCount(0);await expect(room.locator('.story-lead')).toHaveText('What colour is Anna’s hat?');
 for(let i=0;i<13;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();await expect(room.locator('.colour-cast')).toHaveAttribute('data-pose',i<5?'arrival':i<10?'dress':i<12?'reveal':'wear');
  const bounds=await room.locator('.colour-world').boundingBox(),actor=await room.locator('.cast-image:visible').boundingBox(),log=await room.locator('.dialogue-log').boundingBox(),frame=await room.locator('.dialogue-stage').boundingBox();expect(actor.x).toBeGreaterThanOrEqual(bounds.x);expect(actor.x+actor.width).toBeLessThanOrEqual(bounds.x+bounds.width+1);expect(log.y+log.height).toBeLessThan(actor.y+15);expect(bounds.y+bounds.height).toBeLessThanOrEqual(frame.y+frame.height+1);expect(actor.y+actor.height).toBeLessThanOrEqual(bounds.y+bounds.height);if([0,5,10].includes(i))await room.screenshot({path:info.outputPath('pose-'+i+'-'+width+'.png')});
 }
 expect(await room.locator('.btext').first().evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Award Nunito');await room.screenshot({path:info.outputPath('story-'+width+'.png')});await page.reload();await expect(room.locator('.btext span')).toHaveCount(13);await expect(room.locator('.bcn:visible')).toHaveCount(0);
 await page.goto('/unit13-14/#learn/words');await expect(page.locator('.unit-word')).toHaveCount(6);await page.getByRole('button',{name:'colour',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto('/unit13-14/#learn/colours');await expect(page).toHaveURL(/#learn\/grammar$/);await page.goto('/unit13-14/#learn/trans');await expect(page).toHaveURL(/#learn\/apply$/);
});
for(const [width,height]of [[320,568],[390,500]])test(`短屏 ${width}x${height}：五区三卡和操作完整可见`,async({page},info)=>{
 test.setTimeout(180000);await page.setViewportSize({width,height});await story(page);
 for(const id of Object.keys(ANSWERS)){const room=await activity(page,id);await room.locator('.completion-stats').scrollIntoViewIfNeeded();await expect(room.locator('.completion-card')).toHaveAttribute('data-result-motion','finished');
  const cards=await room.locator('.completion-stat').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height};}));expect(cards).toHaveLength(3);expect(Math.max(...cards.map(b=>b.y))-Math.min(...cards.map(b=>b.y))).toBeLessThan(2);expect(Math.max(...cards.map(b=>b.w))-Math.min(...cards.map(b=>b.w))).toBeLessThan(2);
  await room.getByRole('group',{name:'完成后的操作',exact:true}).scrollIntoViewIfNeeded();expect(await room.locator('.completion-stat,.practice-finish-actions button').evaluateAll(es=>es.every(e=>{const b=e.getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight;}))).toBe(true);await room.screenshot({path:info.outputPath(id+'-'+width+'-short.png')});
 }
});
