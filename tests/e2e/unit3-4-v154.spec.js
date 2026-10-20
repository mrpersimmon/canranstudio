'use strict';
const {test,expect}=require('@playwright/test');
const {completeStory}=require('../support/unit3-4-flow');
const flow=require('../support/unit34-v154');
test.use({browserName:process.env.UNIT34_REVIEW_BROWSER||'chromium',actionTimeout:8000,reducedMotion:'reduce'});
test('首页入口与确认纪念卡同一故事，课文不自动显示剧情结论',async({page})=>{
 await page.goto('/');await expect(page.locator('[data-unit="unit3-4"] .featured-art img')).toHaveCount(1);
 await page.goto('/unit3-4/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<11;i++)await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
 await expect(room.locator('.scene-caption')).toHaveCount(0);
 await expect(room.locator('.bcn:visible')).toHaveCount(0);
});
test('理解题未作答时有原文依据',async({page})=>{
 await completeStory(page);await page.goto('/unit3-4/#learn/roles');const room=page.locator('.stage-roles');
 await expect(room.getByRole('region',{name:'阅读材料',exact:true})).toContainText('This is not my umbrella.');
});
test('真实提交记录已显示的短示范',async({page})=>{
 await page.goto('/unit3-4/#learn/reply');const room=page.locator('.stage-reply');await room.getByRole('button',{name:'This is not my coat.',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await page.getByRole('button',{name:'学习手记',exact:true}).click();await expect(page.locator('#learningRecord')).toContainText('看过示范');
});
for(const width of [320,390,768,1280])test(`${width}宽首页、25词卡、12句课文与三把伞同框可读`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:900});await page.goto('/');await page.locator('[data-unit="unit3-4"]').screenshot({path:info.outputPath('home.png')});
 await page.goto('/unit3-4/');await flow.ready(page);await page.locator('#cover').screenshot({path:info.outputPath('cover.png')});
 await page.goto('/unit3-4/#learn/words');const words=page.locator('.stage-words'),names=[];
 for(let i=0;i<5;i++){names.push(...await words.locator('.unit-word strong').allTextContents());await words.locator('.unit-word').first().click();await expect(words.locator('.unit-word').first()).toHaveAttribute('aria-expanded','true');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);if(i===0||i===4)await words.screenshot({path:info.outputPath('words-'+i+'.png')});if(i<4)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 expect(names).toHaveLength(25);expect(new Set(names).size).toBe(25);
 await page.goto('/unit3-4/#learn/text');const room=page.locator('.stage-text');
 for(let i=0;i<12;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(flow.DIALOGUE.slice(0,i+1));
  await expect(room.locator('.scene-caption')).toHaveCount(0);await expect(room.locator('.bcn:visible')).toHaveCount(0);
  const image=room.locator('.umbrella-prop>img');await expect(image).toHaveAttribute('data-umbrella-artwork',i>=10?'umbrella-held':i>=9?'umbrella':i>=7?'umbrella-yellow':'umbrella-red');
  const world=await room.locator('.cloakroom-props').boundingBox(),log=await room.locator('.dialogue-log').boundingBox();expect(log.x).toBeGreaterThanOrEqual(world.x);expect(log.x+log.width).toBeLessThanOrEqual(world.x+world.width+1);expect(log.y+log.height).toBeLessThanOrEqual(world.y+world.height);
  if([0,4,7,9,10].includes(i)){await room.locator('.bubble-row').last().getByRole('button',{name:'看中文',exact:true}).click();await expect(room.locator('.bcn').last()).toBeVisible();await room.locator('.cloakroom-props').screenshot({path:info.outputPath('story-'+i+'.png')});await room.locator('.bubble-row').last().getByRole('button',{name:'收起中文',exact:true}).click();}
  if(i===8){await page.reload();await flow.ready(page);await expect(room.locator('.btext span')).toHaveText(flow.DIALOGUE.slice(0,9));}
 }
 await room.getByRole('button',{name:'完成课文',exact:true}).click();
 await flow.activity(page,'manners',{capture:async(host,i,state)=>{if(i===3)await host.screenshot({path:info.outputPath('counter-'+state+'.png')});}});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);await page.goto('/unit3-4/#learn/certificate');await page.locator('.stage-certificate .story-award-paper').screenshot({path:info.outputPath('card.png')});
});
test('33题逐题未答材料、撤支持、无英语音频与全部声音失败仍可完成',async({page},info)=>{
 test.setTimeout(90000);const voices=[],errors=[],materials=[];page.on('request',r=>{if(/\/unit3-4\/audio\//.test(r.url()))voices.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.soundFailures=0;HTMLMediaElement.prototype.play=function(){window.soundFailures++;return Promise.reject(new Error('sound unavailable'));};});
 await flow.story(page);for(const id of ['listen','roles','reply','manners','exam'])await flow.activity(page,id,{capture:async(room,i,state)=>{if(state!=='blank')return;await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();materials.push({zone:id,number:i+1,text:await room.innerText()});await room.screenshot({path:info.outputPath(id+'-'+(i+1)+'-blank.png')});if(id==='roles'&&i<2)await expect(room.locator('.task-reading')).toBeVisible();if(id==='reply'&&i>=7||id==='exam')await expect(room.locator('.grammar-model')).toHaveCount(0);}});
 expect(materials).toHaveLength(33);await require('fs/promises').writeFile(info.outputPath('unanswered-materials.json'),JSON.stringify(materials,null,2));expect(voices).toEqual([]);expect(errors).toEqual([]);expect(await page.evaluate(()=>window.soundFailures)).toBeGreaterThan(0);await expect(page.locator('#starCount')).toHaveText('5');
});
for(const[width,height]of [[320,568],[390,500]])test(`${width}x${height}短屏三卡与推进按钮完整`,async({page},info)=>{
 await page.setViewportSize({width,height});await flow.activity(page,'listen');const room=page.locator('.stage-listen');await expect(room.locator('.completion-number')).toHaveText(['5','5','0']);const actions=await room.locator('.practice-finish-actions').boundingBox();expect(actions.y+actions.height).toBeLessThanOrEqual(height+1);await page.screenshot({path:info.outputPath('completion.png')});await page.reload();await flow.ready(page);await expect(room.locator('.completion-number')).toHaveText(['5','5','0']);
});
test('原33题未改轮次、选择、错答及原五星保留；两道补材料题重新亲自作答',async({page})=>{
 test.setTimeout(90000);const restore=await flow.installPrevious(page);await flow.complete(page);const before=await flow.book(page),date=await page.locator('#certificateDate').getAttribute('datetime');
 await page.goto('/unit3-4/#learn/reply');const grammar=page.locator('.stage-reply');await grammar.getByRole('button',{name:'再练一轮',exact:true}).click();await grammar.getByRole('button',{name:'This is my coat.',exact:true}).click();await grammar.getByRole('button',{name:'检查答案',exact:true}).click();await grammar.getByRole('button',{name:'再试一次',exact:true}).click();await grammar.getByRole('button',{name:'This is not my coat.',exact:true}).click();const draft=await flow.book(page);
 await restore();await page.reload();const upgraded=await flow.book(page);expect(upgraded.groups['unit34-reply-practice/grammar-v1']).toEqual(draft.groups['unit34-reply-practice/grammar-v1']);expect(upgraded.activity.unit34HistorySnapshot.records).toEqual(draft.records);await expect(page.locator('#starCount')).toHaveText('5');
 await page.goto('/unit3-4/#learn/roles');const roles=page.locator('.stage-roles');await expect(roles.locator('.progress-copy')).toHaveText('第 1 / 3 题');await expect(roles.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await flow.activity(page,'roles');
 await page.goto('/unit3-4/#learn/certificate');await expect(page.locator('#certificateDate')).toHaveAttribute('datetime',date);const after=await flow.book(page);for(const id of ['listen','manners','exam']){const key=Object.keys(before.groups).find(k=>k.startsWith('unit34-'+id+'-'));expect(after.groups[key]).toEqual(before.groups[key]);}
});
