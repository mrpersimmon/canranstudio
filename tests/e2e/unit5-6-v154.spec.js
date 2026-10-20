'use strict';
const {test,expect}=require('@playwright/test');
const flow=require('../support/unit56-v154');
test.use({browserName:process.env.UNIT56_REVIEW_BROWSER||'chromium',reducedMotion:'reduce',actionTimeout:10000});
test('当前首页使用确认故事图',async({page})=>{await page.goto('/');await expect(page.locator('[data-unit="unit5-6"] img')).toHaveCount(1);});
test('Grammar先示范特殊疑问句，再立即练习信息类型',async({page})=>{await page.goto('/unit5-6/#learn/introduce');const room=page.locator('.stage-introduce');await expect(room.getByRole('region',{name:'短示范',exact:true})).toContainText('What make is it?');await expect(room.getByRole('region',{name:'短示范',exact:true})).not.toContainText('Toyota');await expect(room.locator('.practice-context')).toContainText('Toyota · Japanese');await expect(room.locator('.progress-copy')).toHaveText('第 1 / 11 题');});
test('原文理解在未答页提供必要对白',async({page})=>{await require('../support/unit5-6-flow').completeStory(page);await page.goto('/unit5-6/#learn/roles');await expect(page.locator('.stage-roles').getByRole('region',{name:'阅读材料',exact:true})).toContainText('Sophie is a new student.');});
test('正文字体实际加载Nunito，图内标签采用本课字体轮廓',async({page})=>{await page.goto('/unit5-6/#learn/words');await flow.ready(page);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>Array.from(document.fonts).some(f=>f.family.includes('Lesson Nunito')&&f.status==='loaded'))).toBe(true);await expect(page.getByRole('button',{name:'French',exact:true}).locator('img')).toHaveAttribute('src',/french-v154\.svg$/);await page.goto('/unit5-6/#learn/cars');await expect(page.locator('.application-figure img')).toHaveAttribute('src',/volvo-v154\.svg$/);});

for(const width of [320,390,768,1280])test(`${width}宽首页、24词卡、20句及七名人物同场可读`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:900});await page.goto('/');await page.locator('[data-unit="unit5-6"]').screenshot({path:info.outputPath('home.png')});
 await page.goto('/unit5-6/#cover');await flow.ready(page);await page.locator('#cover').screenshot({path:info.outputPath('cover.png')});
 await page.goto('/unit5-6/#learn/words');const words=page.locator('.stage-words'),names=[];
 for(let i=0;i<4;i++){names.push(...await words.locator('.unit-word strong').allTextContents());await words.locator('.unit-word').first().click();await expect(words.locator('.unit-word').first()).toHaveAttribute('aria-expanded','true');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);if(i===0||i===3)await words.screenshot({path:info.outputPath('words-'+i+'.png')});if(i<3)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();}expect(names).toHaveLength(24);expect(new Set(names).size).toBe(24);
 await page.goto('/unit5-6/#learn/text');const room=page.locator('.stage-text');await expect(room.locator('.story-lead')).toContainText('Is Chang-woo Chinese?');
 for(let i=0;i<20;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(flow.DIALOGUE.slice(0,i+1));await expect(room.locator('.classroom-classmate span')).toHaveText(flow.PEOPLE[i]);await expect(room.locator('.bcn:visible')).toHaveCount(0);
  const world=await room.locator('.dialogue-stage').boundingBox(),log=await room.locator('.dialogue-log').boundingBox();expect(log.x).toBeGreaterThanOrEqual(world.x);expect(log.x+log.width).toBeLessThanOrEqual(world.x+world.width);expect(log.y+log.height).toBeLessThan(world.y+world.height);
  for(const actor of await room.locator('.classroom-person>img').all()){const b=await actor.boundingBox();expect(b.x).toBeGreaterThanOrEqual(world.x);expect(b.x+b.width).toBeLessThanOrEqual(world.x+world.width);expect(b.y).toBeGreaterThanOrEqual(log.y+log.height);}
  if([0,4,7,10,13,16,19].includes(i)){await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();await expect(room.locator('.bcn').last()).toBeVisible();await room.locator('.dialogue-stage').screenshot({path:info.outputPath('story-'+i+'.png')});await room.locator('.bubble-row').last().getByRole('button',{name:'收起中文',exact:true}).click();}
  if(i===12){await page.reload();await flow.ready(page);await expect(room.locator('.btext span')).toHaveText(flow.DIALOGUE.slice(0,13));}
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(room.locator('.photo-people>figure')).toHaveCount(7);await room.locator('.current-photo').screenshot({path:info.outputPath('class-photo.png')});
 await flow.activity(page,'cars',{capture:async(host,i,state)=>{if(i===3)await host.screenshot({path:info.outputPath('application-'+state+'.png')});}});
 await page.goto('/unit5-6/#learn/certificate');await page.getByRole('article',{name:'我的单元纪念卡',exact:true}).screenshot({path:info.outputPath('card.png')});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
});

test('36题未答材料、两空上限、撤支持、真实声音故障与五星',async({page},info)=>{
 test.setTimeout(120000);const voices=[],errors=[],materials=[];page.on('request',r=>{if(/\/unit5-6\/audio\/|\/tts(?:\/|\?)/.test(r.url()))voices.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.soundFailures=0;window.speechCalls=0;HTMLMediaElement.prototype.play=function(){window.soundFailures++;return Promise.reject(new Error('sound unavailable'));};if('speechSynthesis' in window)window.speechSynthesis.speak=()=>window.speechCalls++;});
 await flow.story(page);for(const id of ['listen','roles','introduce','cars','exam'])await flow.activity(page,id,{capture:async(room,i,state)=>{if(state!=='blank')return;await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();expect(await room.locator('.cloze-row').count()).toBeLessThanOrEqual(2);materials.push({zone:id,number:i+1,text:await room.innerText()});await room.screenshot({path:info.outputPath(id+'-'+(i+1)+'-blank.png')});if(id==='roles')await expect(room.locator('.task-reading')).toBeVisible();if(id==='introduce'&&i===10||id==='cars'&&i===3||id==='exam')await expect(room.locator('.grammar-model')).toHaveCount(0);}});
 expect(materials).toHaveLength(36);await require('fs/promises').writeFile(info.outputPath('unanswered-materials.json'),JSON.stringify(materials,null,2));expect(voices).toEqual([]);expect(errors).toEqual([]);expect(await page.evaluate(()=>window.soundFailures)).toBeGreaterThan(0);expect(await page.evaluate(()=>window.speechCalls)).toBe(0);await expect(page.locator('#starCount')).toHaveText('5');
});

for(const[width,height]of [[320,568],[390,500]])test(`${width}x${height}短屏三卡与推进完整`,async({page},info)=>{
 await page.setViewportSize({width,height});await flow.activity(page,'listen');const room=page.locator('.stage-listen');await expect(room.locator('.completion-number')).toHaveText(['4','4','0']);const actions=await room.locator('.practice-finish-actions').boundingBox();expect(actions.y+actions.height).toBeLessThanOrEqual(height+1);await page.screenshot({path:info.outputPath('completion.png')});await page.reload();await flow.ready(page);await expect(room.locator('.completion-number')).toHaveText(['4','4','0']);
});

test('原26题五星、词卡和错答草稿保留，新增题未答且旧帮助不追写',async({page})=>{
 test.setTimeout(120000);const restore=await flow.installPrevious(page);await flow.complete(page,'','before');const original=await flow.book(page),date=await page.locator('#certificateDate').getAttribute('datetime');
 await page.goto('/unit5-6/#learn/words');await page.getByRole('button',{name:'下一组词卡',exact:true}).click();await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
 await page.goto('/unit5-6/#learn/introduce');const grammar=page.locator('.stage-introduce');await grammar.getByRole('button',{name:'再练一轮',exact:true}).click();await grammar.getByRole('button',{name:'It',exact:true}).click();await grammar.getByRole('button',{name:'检查答案',exact:true}).click();await grammar.getByRole('button',{name:'再试一次',exact:true}).click();await grammar.getByRole('button',{name:'She',exact:true}).click();const draft=await flow.book(page);
 await restore();await page.reload();await flow.ready(page);const upgraded=await flow.book(page);expect(upgraded.activity.unit56HistorySnapshot.records).toEqual(draft.records);expect(upgraded.activity.unit56HistorySnapshot.groups).toEqual(draft.groups);expect(upgraded.activity.unit56HistorySnapshot.activity.unitWordPage).toBe(2);await expect(page.locator('#starCount')).toHaveText('5');await expect(grammar.locator('.progress-copy')).toHaveText('第 1 / 11 题');await expect(grammar.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await page.goto('/unit5-6/#learn/roles');await expect(page.locator('.stage-roles .progress-copy')).toHaveText('第 1 / 3 题');await flow.activity(page,'roles');await page.goto('/unit5-6/#learn/cars');await expect(page.locator('.stage-cars .progress-copy')).toHaveText('第 4 / 4 题');await flow.activity(page,'cars');
 await page.goto('/unit5-6/#learn/exam');await expect(page.locator('.stage-exam .progress-copy')).toHaveText('第 6 / 14 题');await flow.activity(page,'exam');await flow.activity(page,'introduce');
 await page.goto('/unit5-6/#learn/certificate');await expect(page.locator('#certificateDate')).toHaveAttribute('datetime',date);const after=await flow.book(page);expect(after.groups['unit56-listen-practice/tasks-v4']).toEqual(original.groups['unit56-listen-practice/tasks-v4']);expect(after.activity.unit56HistorySnapshot).toEqual(upgraded.activity.unit56HistorySnapshot);
});

test('显示过短示范的新提交记帮助，独立题不记帮助；双空草稿可续做',async({page})=>{
 await flow.activity(page,'introduce',{capture:async(room,i,state)=>{if(state==='blank'&&i===10){const first=room.getByRole('group',{name:'第1处填空',exact:true});await first.getByRole('button',{name:'She is Sophie.',exact:true}).click();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await page.reload();await flow.ready(page);await expect(first.getByRole('button',{name:'She is Sophie.',exact:true})).toHaveAttribute('aria-pressed','true');}}});
 const book=await flow.book(page);expect(book.records['u56-v154-wh-meaning'].revealed).toBe(true);expect(book.records['u56-v154-wh-independent'].revealed).not.toBe(true);await page.getByRole('button',{name:'学习手记',exact:true}).click();await expect(page.locator('#learningRecord')).toContainText('看过示范');
});
