'use strict';
const {test,expect}=require('@playwright/test');
const flow=require('../support/thirteen-types-flow');
const {installPrevious,book,noOverflow,currentArt}=require('../support/unit12-v154');
test.use({browserName:process.env.UNIT12_REVIEW_BROWSER||'chromium',reducedMotion:'reduce',actionTimeout:8000});
test('首页与封面沿用已确认纪念卡故事插画',async({page})=>{
 await page.goto('/');const home=page.getByRole('region',{name:'礼貌小帮手',exact:true});
 await expect(home.locator('.featured-art img')).toHaveCount(1);
 await expect(home.locator('.featured-art img')).toHaveAttribute('src',/unit1-2-handbag-closeup.webp/);
 await page.goto('/unit1-2/');await expect(page.locator('#cover .unit-cover-art img')).toHaveCount(1);
 await expect(page.locator('#cover .unit-cover-art img')).toHaveAttribute('src',/unit1-2-handbag-closeup.webp/);
});
test('实际显示的短示范写入本次提交，独立题不补记示范',async({page})=>{
 await page.goto('/unit1-2/#learn/trans');const room=page.locator('.stage-trans');
 await flow.select(room,'Is this your book?');await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await page.getByRole('button',{name:'学习记录',exact:true}).click();
 await expect(page.locator('#learningRecord')).toContainText('看过示范');
 await page.getByRole('button',{name:'关闭',exact:true}).click();
 await room.getByRole('button',{name:'下一题',exact:true}).click();
 await flow.select(room,'这是不是你的铅笔。');await room.getByRole('button',{name:'检查答案',exact:true}).click();
 const saved=await book(page);expect(saved.records['u12-grammar-v4-ask-or-tell'].revealed).toBe(true);
 expect(Boolean(saved.records['u12-grammar-v4-yes-no-purpose'].revealed)).toBe(false);
 await page.reload();expect((await book(page)).records).toEqual(saved.records);
});
for(const width of [320,390,768,1280])test(`四宽 ${width}：首页、词卡、完整对白、人物与答前材料`,async({page},info)=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:900});
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 await page.getByRole('region',{name:'礼貌小帮手',exact:true}).screenshot({path:info.outputPath('home.png')});await noOverflow(page,width);
 await page.goto('/unit1-2/');await page.evaluate(()=>document.fonts.ready);await page.locator('#cover').screenshot({path:info.outputPath('cover.png')});
 await page.goto('/unit1-2/#learn/words');
 const words=page.locator('.stage-words');const seen=[];
 for(let i=0;i<4;i++){
  const names=await words.locator('.unit-word strong').allTextContents();seen.push(...names);
  await words.locator('.unit-word').first().click();await expect(words.locator('.unit-word').first()).toHaveAttribute('aria-expanded','true');
  await noOverflow(page,width);await words.screenshot({path:info.outputPath('words-'+i+'.png')});
  if(i<3)await words.getByRole('button',{name:'下一组',exact:true}).click();
 }
 expect(seen).toHaveLength(21);expect(new Set(seen).size).toBe(21);
 await page.goto('/unit1-2/#learn/text');const text=page.locator('.stage-text');await currentArt(page);
 await text.getByRole('button',{name:'开始故事',exact:true}).click();
 for(let i=0;i<7;i++){
  await expect(text.locator('.btext')).toHaveCount(i+1);
  await text.locator('.bbtns button').last().click();await expect(text.locator('.bcn').last()).toBeVisible();
  await noOverflow(page,width);
  if([0,2,5,6].includes(i))await text.locator('#unit12-dialogue').screenshot({path:info.outputPath('dialogue-'+i+'.png')});
  await text.locator('.bbtns button').last().click();
  if(i===3){await page.reload();await expect(text.locator('.btext')).toHaveCount(4);}
  await text.getByRole('button',{name:i===6?'读完了':'下一句',exact:true}).click();
 }
 expect(await text.locator('.btext').allTextContents()).toEqual(['Excuse me!','Yes?','Is this your handbag?','Pardon?','Is this your handbag?','Yes, it is.','Thank you very much.']);
 await flow.activity(page,'1-2','manners',{capture:async(room,i,state)=>{if(state==='blank'&&i>=2){await currentArt(page);await room.screenshot({path:info.outputPath('manners-'+i+'.png')});await noOverflow(page,width);}}});
 await page.goto('/unit1-2/#learn/certificate');await expect(page.getByRole('button',{name:'保存动图',exact:true})).toBeDisabled();
 await page.getByRole('article',{name:'我的纪念卡',exact:true}).screenshot({path:info.outputPath('card.png')});
});
test('37题未答材料逐题审查、五区与零英语声音、声音失败仍可完成',async({page},info)=>{
 test.setTimeout(90000);const voice=[],errors=[],materials=[];
 page.on('request',r=>{if(/\/unit1-2\/audio\//.test(r.url()))voice.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.audioFailures=0;HTMLMediaElement.prototype.play=function(){window.audioFailures++;return Promise.reject(new Error('sound unavailable'));};});
 await flow.story(page,'1-2');let count=0;
 for(const id of ['listen','roles','trans','manners','exam'])await flow.activity(page,'1-2',id,{capture:async(room,i,state)=>{
  if(state!=='blank')return;count++;await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  materials.push({zone:id,number:i+1,text:await room.innerText()});
  await room.screenshot({path:info.outputPath(id+'-'+(i+1)+'-unanswered.png')});
  if(id==='roles'&&i===1)await expect(room.locator('.task-reading')).toContainText('Pardon?');
  if(id==='roles'&&i===4)await expect(room.locator('.task-reading')).toContainText('Is this your handbag?');
  if(id==='manners'&&i===3)await expect(room.locator('.quest-conversation')).toContainText('Yes, it is.');
  if(id==='trans'&&i>=10)await expect(room.locator('.grammar-model')).toHaveCount(0);
  if(id==='exam')await expect(room.locator('.grammar-model')).toHaveCount(0);
 }});
 await require('fs/promises').writeFile(info.outputPath('unanswered-materials.json'),JSON.stringify(materials,null,2));
 expect(count).toBe(37);await expect(page.locator('#starCount')).toHaveText('5');expect(voice).toEqual([]);expect(errors).toEqual([]);expect(await page.evaluate(()=>window.audioFailures)).toBeGreaterThan(0);
});
test('真实前版中途错答和未提交选择升级后保留同一轮，已完成五星与精确日期不变',async({page})=>{
 test.setTimeout(90000);let restore=await installPrevious(page);
 await page.goto('/unit1-2/#learn/trans');const room=page.locator('.stage-trans');
 await flow.select(room,'This is your book.');await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await flow.select(room,'Is this your book?');const before=await book(page);
 await restore();await page.reload();const after=await book(page);
 expect(after.groups['unit12-trans-practice/five-zones-v1']).toEqual(before.groups['unit12-trans-practice/five-zones-v1']);
 expect(after.records).toEqual(before.records);expect(after.activity.unit12HistorySnapshot.groups).toEqual(before.groups);
 await expect(room.getByRole('button',{name:'Is this your book?',exact:true})).toHaveAttribute('aria-pressed','true');
 await flow.activity(page,'1-2','trans');await expect(page.locator('#starCount')).toHaveText('0');
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await flow.complete(page,'1-2');
 const earned=await book(page),date=await page.locator('#certificateDate').getAttribute('datetime');await page.reload();
 await expect(page.locator('#starCount')).toHaveText('5');await expect(page.locator('#certificateDate')).toHaveAttribute('datetime',date);
 expect((await book(page)).activity.unit12HistorySnapshot).toEqual(after.activity.unit12HistorySnapshot);
 expect((await book(page)).activity.unitAwardClaims).toEqual(earned.activity.unitAwardClaims);
});
for(const [width,height]of [[320,568],[390,500]])test(`短屏 ${width}x${height} 三卡与两个操作完整，键盘提交和错误次数保留`,async({page},info)=>{
 await page.setViewportSize({width,height});await page.goto('/unit1-2/#learn/listen');const room=page.locator('.stage-listen');
 await flow.select(room,flow.ANSWERS['1-2'].listen[0]);await room.getByRole('button',{name:'检查答案',exact:true}).focus();await page.keyboard.press('Enter');await room.getByRole('button',{name:'下一题',exact:true}).click();
 await flow.activity(page,'1-2','listen');await expect(room.locator('.completion-number')).toHaveText(['5','5','0']);
 const stats=await room.locator('.completion-stats').boundingBox(),actions=await room.locator('.practice-finish-actions').boundingBox();expect(stats.y).toBeGreaterThan(0);expect(actions.y+actions.height).toBeLessThanOrEqual(height+1);
 await page.screenshot({path:info.outputPath('short-completion.png')});await page.reload();await expect(room.locator('.completion-number')).toHaveText(['5','5','0']);
});
