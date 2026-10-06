'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {DIALOGUE,ANSWERS,select,advance,activity,story,complete}=require('../support/unit31-32-flow');
const OUT='output/playwright/unit31-32';
test.use({reducedMotion:'reduce'});
test.beforeAll(()=>fs.mkdir(OUT,{recursive:true}));
test('首页横幅进入图鉴；24张音标词卡翻页、释义、再入恢复',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'开始学习：花园观察小队',exact:true}).click();await expect(page).toHaveURL(/unit31-32\/#learn\/words$/);
 const room=page.locator('.stage-words');for(let group=0;group<4;group++){await expect(room.locator('.unit-word')).toHaveCount(6);for(const card of await room.locator('.unit-word').all()){await expect(card.locator('.word-phonetic')).toBeVisible();await expect.poll(()=>card.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await card.click();await expect(card.locator('.word-phonetic')).toBeVisible();}if(group<3)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();}
 await page.reload();await expect(room.locator('#wordPageProgress')).toHaveText('4 / 4');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page.locator('.stage-listen h3').first()).toBeInViewport();await page.getByRole('link',{name:'我的课程',exact:true}).click();await expect(page.getByRole('link',{name:'继续学习：花园观察小队',exact:true})).toHaveAttribute('href','/unit31-32/#learn/listen');
});
test('无任何声音也能完成33任务、14原文到15星，末题需确认，证书PNG和打印',async({page})=>{
 test.setTimeout(180000);const errors=[],voices=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\/(?:audio|voices)\//.test(r.url()))voices.push(r.url());});await page.route(/\.(mp3|ogg|wav)(\?|$)/,r=>r.abort());await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++};HTMLMediaElement.prototype.play=()=>Promise.reject(Error('sound unavailable'));});
 await complete(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('花园小观察员');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const dialog=page.getByRole('dialog',{name:'花园观察小队纪念',exact:true});await expect(dialog).toContainText('完成 Lesson 31–32 课堂配套练习');await expect(dialog).not.toContainText('听力');
 const pending=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;await download.saveAs(OUT+'/certificate.png');await page.screenshot({path:OUT+'/certificate-page.png'});await page.emulateMedia({media:'print'});await page.pdf({path:OUT+'/certificate.pdf',format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});await page.keyboard.press('Escape');await page.reload();await expect(page.locator('#starCount')).toHaveText('15');await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('花园小观察员');expect(voices).toEqual([]);expect(errors).toEqual([]);expect(await page.evaluate(()=>globalThis.voiceCalls)).toBe(0);
});
test('配对部分选择不可提交、错误不公布答案，原题修改与刷新稳定',async({page})=>{
 await page.goto('/unit31-32/#learn/listen');const room=page.locator('.stage-listen');await select(room,{match:[['garden','树']]});await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await select(room,{match:[['tree','花园'],['grass','草地']]});await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await select(room,{match:[['garden','花园'],['tree','树']]});await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');await advance(room,false);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(page.locator('#starCount')).toHaveText('0');
});
test('课文历史保留，翻译与下一句不挤走按钮；末句确认、重看与刷新',async({page})=>{
 await page.goto('/unit31-32/#learn/roles');await page.getByRole('button',{name:'先看课文',exact:true}).click();const room=page.locator('.stage-text');let controlsTop;
 for(let i=0;i<14;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));if([0,3,6,12].includes(i)){await room.getByRole('button',{name:'看中文',exact:true}).last().click();await page.screenshot({path:OUT+'/story-'+i+'.png'});}const top=await room.locator('.stage-ctrl').evaluate(el=>el.getBoundingClientRect().top+scrollY);if(controlsTop===undefined)controlsTop=top;else expect(Math.abs(top-controlsTop)).toBeLessThan(2);if(i===6){await page.reload();await expect(room.locator('.btext')).toHaveCount(7);}}
 await expect(page.locator('#starCount')).toHaveText('0');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('1');await room.getByRole('button',{name:'再看一遍',exact:true}).click();await expect(room.locator('.btext')).toHaveCount(0);await page.reload();await expect(room.getByRole('button',{name:'开始看课文',exact:true})).toBeVisible();
});
test('综合12题逐题错误、恢复与修改，最后一题不代答，重练不加星',async({page})=>{
 test.setTimeout(120000);await page.goto('/unit31-32/#learn/exam');const room=page.locator('.stage-exam');
 for(const [i,answer]of ANSWERS.exam.entries()){
  await expect(room).toContainText(`第 ${i+1} / 12 题`);await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  if(answer.cloze){for(let k=0;k<answer.cloze.length;k++){const group=room.getByRole('group',{name:`第${k+1}处填空`,exact:true});const wrong=group.getByRole('button').filter({hasNotText:answer.cloze[k]}).first();await wrong.click();}}
  else if(Array.isArray(answer))await select(room,answer.slice().reverse());else {const options=room.locator('.practice-options .opt-btn');for(const b of await options.all()){if(await b.textContent()!==answer){await b.click();break;}}}
  await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.is-correct')).toHaveCount(0);if(i===11){await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');}
  await room.getByRole('button',{name:'再试一次',exact:true}).click();if(Array.isArray(answer)){const chosen=room.getByRole('group',{name:'已选词块',exact:true});while(await chosen.getByRole('button').count())await chosen.getByRole('button').first().click();}await select(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));if(i===11)await expect(page.locator('#starCount')).toHaveText('0');await advance(room,i===11,true);
 }
 await expect(room).toContainText('修正后完成 12 题');await expect(page.locator('#starCount')).toHaveText('3');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
});
for(const width of [320,390,768,1280])test(`宽度${width}场景、找人、动作册和词卡无溢出，目标可点且不靠音频`,async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width,height:900});await page.goto('/unit31-32/#learn/text');const room=page.locator('.stage-text');for(let i=0;i<13;i++)await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await room.getByRole('button',{name:'看中文',exact:true}).last().click();await page.goto('/unit31-32/#learn/text');await page.screenshot({path:OUT+'/theatre-'+width+'.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
 await page.goto('/unit31-32/#learn/be');const be=page.locator('.stage-be');await be.getByRole('button',{name:'Tim',exact:true}).click();await be.getByRole('button',{name:'检查答案',exact:true}).click();await expect(be.getByRole('status')).toHaveText('再看看，试一次。');await page.screenshot({path:OUT+'/scene-wrong-'+width+'.png'});await be.getByRole('button',{name:'再试一次',exact:true}).click();await be.getByRole('button',{name:'Sally',exact:true}).click();await be.getByRole('button',{name:'检查答案',exact:true}).click();await expect(be.getByRole('status')).toHaveText('答对了！');
 await page.goto('/unit31-32/#learn/models');for(let i=0;i<6;i++){await expect(page.locator('.stage-models .reference-card')).toHaveCount(3);await expect.poll(()=>page.locator('.stage-models .reference-card img').evaluateAll(imgs=>imgs.every(im=>im.complete&&im.naturalWidth>0))).toBe(true);if(i<5)await page.locator('.stage-models').getByRole('button',{name:'下一页动作',exact:true}).click();}await expect(page.locator('.stage-models .reference-card').last()).toContainText('Mrs. Jones is taking off her coat.');await page.screenshot({path:OUT+'/gallery-'+width+'.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
 await page.goto('/unit31-32/#learn/words');await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();await page.locator('.stage-words').getByRole('button',{name:'after',exact:true}).click();await page.screenshot({path:OUT+'/words-'+width+'.png'});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
});
test('缓存前缀首次准备、重访离线词卡与后续画册全部就绪',async({page,context})=>{
 test.setTimeout(120000);await page.goto('/lesson/unit31-32/#learn/words');await expect(page.locator('#courseLoader')).toBeHidden({timeout:60000});await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();await context.setOffline(true);await page.reload();await expect(page.locator('#courseLoader')).toBeHidden({timeout:30000});await expect(page.locator('#wordPageProgress')).toHaveText('2 / 4');for(let i=0;i<2;i++)await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();await page.goto('/lesson/unit31-32/#learn/models');for(let i=0;i<5;i++)await page.locator('.stage-models').getByRole('button',{name:'下一页动作',exact:true}).click();await expect.poll(()=>page.locator('.stage-models .reference-card img').evaluateAll(imgs=>imgs.every(im=>im.complete&&im.naturalWidth>0))).toBe(true);await context.setOffline(false);
});
test('未答完刷新直接续做，键盘能改选；正常反馈音播放，课堂练习纸保留A5与B10',async({page})=>{
 await page.addInitScript(()=>{
  globalThis.completedSounds=[];const play=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){this.addEventListener('ended',()=>globalThis.completedSounds.push(this.currentSrc),{once:true});return play.call(this);};
  globalThis.print=()=>{globalThis.printRequested=true;};
 });
 await page.goto('/unit31-32/#learn/exam');const room=page.locator('.stage-exam');
 await room.getByRole('button',{name:'What is',exact:true}).press('Enter');
 await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');
 await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await expect.poll(()=>page.evaluate(()=>completedSounds.length)).toBe(1);
 await room.getByRole('button',{name:'再试一次',exact:true}).press('Enter');
 await room.getByRole('button',{name:'Where is',exact:true}).press('Enter');
 await expect(room.getByRole('button',{name:'暂停，稍后继续',exact:true})).toHaveCount(0);await page.reload();
 await expect(room.locator('.progress-copy')).toHaveText('第 1 / 12 题');
 await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 await expect(room.getByRole('button',{name:'Where is',exact:true})).toHaveAttribute('aria-pressed','true');
 await room.getByRole('button',{name:'检查答案',exact:true}).press('Enter');await expect(room.getByRole('status')).toHaveText('答对了！');
 await expect.poll(()=>page.evaluate(()=>completedSounds.length)).toBe(1);
 await expect(page.locator('#starCount')).toHaveText('0');
 await page.goto('/unit31-32/#learn/certificate');await page.locator('#unitWriting>summary').click();
 await expect(page.locator('.reference-writing>li')).toHaveCount(5);await expect(page.locator('.reply-writing>li')).toHaveCount(10);
 await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await expect.poll(()=>page.evaluate(()=>printRequested)).toBe(true);
 await page.emulateMedia({media:'print'});await page.pdf({path:OUT+'/writing.pdf',format:'A4',printBackground:true});
});
