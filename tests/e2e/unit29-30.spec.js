'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('首页新单元从整理小图鉴开始，音标可见',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'开始学习：房间整理行动',exact:true}).click();
 await expect(page).toHaveURL(/\/unit29-30\/#learn\/words$/);await expect(page.getByRole('heading',{name:'整理小图鉴',exact:true})).toBeInViewport();
 await expect(page.locator('.stage-words').getByRole('button',{name:'shut',exact:true}).locator('.word-phonetic')).toHaveText('/ʃʌt/');
});

const {DIALOGUE,ANSWERS,completeUnit2930,completeActivity,completeStory}=require('../support/unit29-30-flow');
test('全部声音失败仍完成23题和完整原文，15星后保存真实证书，刷新保留日期',async({page})=>{
 test.setTimeout(60000);const audio=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());
 await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
 await page.goto('/unit29-30/#learn/certificate');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await completeUnit2930(page);
 expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);expect(await page.evaluate(()=>voiceCalls)).toBe(0);expect(errors).toEqual([]);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小小整理员');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'房间整理行动纪念',exact:true});await expect(dialog).toContainText('完成 Lesson 29–30 课堂配套练习');await expect(dialog.locator('#certificateName')).toHaveText('小小整理员');const day=await dialog.locator('#certificateDate').innerText();
 await dialog.screenshot({path:'output/playwright/unit29-30/certificate-desktop.png'});const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson29-30-房间整理行动.png');await download.saveAs('output/playwright/unit29-30/certificate-saved.png');
 const png=await require('node:fs/promises').readFile('output/playwright/unit29-30/certificate-saved.png');expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const pdf=await page.pdf({path:'output/playwright/unit29-30/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(day);
});


test('证书长名字在三种窄屏中完整，实际保存图片与单元主题一致',async({page})=>{
 test.setTimeout(45000);await completeUnit2930(page);await page.emulateMedia({reducedMotion:'reduce'});
 const name='热爱探险和英语学习的小朋友李明小明';await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill(name);await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'房间整理行动纪念',exact:true}),paper=dialog.locator('.certificate-paper');await expect(paper).toHaveCSS('animation-name','none');await expect(paper).toHaveCSS('opacity','1');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:740});await expect(dialog.locator('#certificateName')).toHaveText(name);expect((await dialog.locator('#certificateName').boundingBox()).height).toBeLessThanOrEqual(100);expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  const bounds=await paper.boundingBox();for(const box of await paper.locator('h3,p,li,img').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right};}))){expect(box.left).toBeGreaterThanOrEqual(bounds.x-1);expect(box.right).toBeLessThanOrEqual(bounds.x+bounds.width+1);}
  expect((await dialog.getByRole('button',{name:'保存图片',exact:true}).boundingBox()).height).toBeGreaterThanOrEqual(44);await dialog.screenshot({path:`output/playwright/unit29-30/certificate-long-${width}.png`});
 }
 const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson29-30-房间整理行动.png');const path='output/playwright/unit29-30/certificate-long-saved.png';await download.saveAs(path);
 const png=await require('node:fs/promises').readFile(path);expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const band=await paper.evaluate(el=>getComputedStyle(el,'::before').backgroundColor.match(/\d+/g).slice(0,3).map(Number));const pixel=await require('sharp')(png).extract({left:100,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();expect([...pixel]).toEqual(band);
 await dialog.getByRole('button',{name:'关闭',exact:true}).click();await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeFocused();
});

test('证书空名字有友好称呼，插图加载失败不假保存，恢复后可重试',async({page})=>{
 test.setTimeout(45000);await completeUnit2930(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('');await page.route('**/assets/unit29-30/Jones.svg',r=>r.abort());await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'房间整理行动纪念',exact:true});await expect(dialog.locator('#certificateName')).toHaveText('能干的整理小帮手');const downloads=[];page.on('download',d=>downloads.push(d));await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('图片暂时没有生成');await expect(dialog.getByRole('button',{name:'保存图片',exact:true})).toBeEnabled();expect(downloads).toHaveLength(0);
 await page.unroute('**/assets/unit29-30/Jones.svg');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await pending;await expect(dialog.getByRole('status')).toContainText('纪念图片已保存');expect(downloads).toHaveLength(1);
});

test('10道词义题连续错答只重试，最后三题刷新不会代答，重练不重复计星',async({page})=>{
 await page.goto('/unit29-30/#learn/listen');const room=page.locator('.stage-listen');await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
 for(const [i,answer] of ANSWERS.listen.entries()){
  if(i>=7)await page.reload();await expect(room).toContainText('第 '+(i+1)+' / 10 题');const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
  if(i===0||i===9)for(let j=0;j<2;j++){await room.getByRole('button',{name:i===0?'厨房':'把铅笔擦干净',exact:true}).click();await check.click();if(j===1)await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i===9?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(page.locator('#starCount')).toHaveText('3');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(page.locator('#starCount')).toHaveText('3');
});

test('原文9句逐句保留，按原角色呈现，主动完成后才解锁理解',async({page})=>{
 await page.goto('/unit29-30/#learn/roles');await page.getByRole('button',{name:'先看课文',exact:true}).click();const room=page.locator('.stage-text');await expect(room).toContainText('艾米要怎样清理地板？');await expect(room.locator('.dialogue-actor')).toHaveCount(2);
 for(let i=0;i<9;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.getByRole('status')).toHaveText((i+1)+' / 9 句原文');
  if(i===4){await room.getByRole('button',{name:'看中文',exact:true}).last().click();await expect(room.locator('.bcn').last()).toHaveText('打开窗户，给房间通通风。');await page.reload();await expect(room.locator('.btext')).toHaveCount(5);}
 }
 await expect(room.locator('.dialogue-log .bname')).toHaveText(['琼斯太太','琼斯太太','琼斯太太','艾米','琼斯太太','琼斯太太','琼斯太太','琼斯太太','琼斯太太']);
 await expect(room.locator('.btext button')).toHaveCount(0);await expect(page.locator('#starCount')).toHaveText('0');await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('1');await room.getByRole('button',{name:'下一站：课文小侦探',exact:true}).click();await expect(page.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

const WORDS=['shut','bedroom','untidy','must','open','air','put','clothes','wardrobe','dust','sweep','empty','read','sharpen','put on','take off','turn on','turn off','come in','make the bed','then','clean','window','door','bed','floor','dressing table','lamp','tap','book'];
const PH=['/ʃʌt/','/ˈbedruːm/','/ʌnˈtaɪdi/','/mʌst/','/ˈoʊpən/','/er/','/pʊt/','/kloʊðz/','/ˈwɔːrdroʊb/','/dʌst/','/swiːp/','/ˈempti/','/riːd/','/ˈʃɑːrpən/','/pʊt ˈɑːn/','/teɪk ˈɑːf/','/tɝːn ˈɑːn/','/tɝːn ˈɑːf/','/kʌm ˈɪn/','/meɪk ðə ˈbed/','/ðen/','/kliːn/','/ˈwɪndoʊ/','/dɔːr/','/bed/','/flɔːr/','/ˈdresɪŋ ˌteɪbəl/','/læmp/','/tæp/','/bʊk/'];
test('30张词卡完整音标、翻义、加载、五组翻页与末组续学',async({page})=>{
 const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.goto('/unit29-30/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
 for(let p=0;p<5;p++){
  await expect(room.locator('.unit-word strong')).toHaveText(WORDS.slice(p*6,p*6+6));await expect(room.locator('.word-phonetic')).toHaveText(PH.slice(p*6,p*6+6));await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await expect(card).toHaveAccessibleDescription(await card.locator('.word-meaning').innerText());await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
  if(p<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room).toContainText('5 / 5');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen$/);expect(audio).toEqual([]);
});

const GROUPS=[
 [['Open your','Shut your'],['handbag','desk','suitcase','book']],
 [['Put on your','Take off your'],['shirt','watch','shoes','tie','blouse','suit']],
 [['Turn on the','Turn off the'],['stereo','television','lamp','tap','cooker']],
 [['Sweep the'],['floor','kitchen','living room','bedroom']],
 [['Clean the'],['car','cupboard','refrigerator','cooker']],
 [['Dust the'],['cupboard','dressing table','shelves']],
 [['Empty the'],['cup','box','bottle','suitcase']],
 [['Read this'],['book','magazine','newspaper']],
 [['Sharpen these'],['pencils','knives']]
];
const REFS=['The window isn’t clean.','The door isn’t shut.','The wardrobe isn’t open.'];
const REFANS=['Clean it!','Shut it!','Open it!'];
const STEMS=['Shut the','Open the','Put on your','Take off your','Turn on the','Turn off the','Sweep the','Clean the','Dust the','Empty the','Read this','Sharpen these'];
const NOUNS=['stereo','tap','blackboard','cup','window','cupboard','magazine','knives','shirt','door','floor','shoes'];
test('35图项、A三题和B完整搭配库保留，十一句不设唯一答案，打印有足够书写空间',async({page})=>{
 await page.goto('/unit29-30/#learn/models');const room=page.locator('.stage-models');await room.getByText('看看35个动作搭配',{exact:true}).click();
 await expect(room.locator('.comparison-gallery strong')).toHaveText(GROUPS.flatMap(([verbs,nouns])=>nouns.map(noun=>verbs.map(v=>v+' '+noun+'.').join('\n'))));
 await expect(room).toContainText('带活动桌盖的课桌');await expect(room).toContainText('不是要同时做');
 await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);await expect(room.locator('.reference-card button')).toHaveCount(0);
 for(let i=0;i<9;i++)await room.locator('.action-family').nth(i).screenshot({path:'output/playwright/unit29-30/gallery-'+i+'.png'});
 await room.getByText('把问题变成行动',{exact:true}).click();await expect(room.locator('.be-models').first().locator('li')).toHaveText(REFS.map((s,i)=>s+' → '+REFANS[i]));
 await room.getByText('自由搭配任务卡',{exact:true}).click();await expect(room).toContainText('不按同一行配对');for(const noun of NOUNS)await expect(room.locator('.writing-bank')).toContainText(noun);
 await room.getByText('看看一种搭配',{exact:true}).click();await expect(room).toContainText('并非只有这些答案');await expect(room.locator('.be-models').last().locator('li')).toHaveCount(11);
 await room.getByRole('button',{name:'下一站：动作选择站',exact:true}).click();await expect(page).toHaveURL(/#learn\/be$/);
 await page.goto('/unit29-30/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(REFS);
 await expect(page.locator('#unitWriting')).toContainText('写十一句');for(const word of [...STEMS,...NOUNS])await expect(page.locator('#unitWriting .writing-bank')).toContainText(word);
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(14);
 for(const line of await page.locator('.writing-rule').all()){const box=await line.boundingBox();expect(box.height).toBeGreaterThanOrEqual(30);expect(box.width).toBeGreaterThan(500);}
 const pdf=await page.pdf({path:'output/playwright/unit29-30/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});
test('支架按语境释义，图选同等可读，错答不泄露正确状态',async({page})=>{
 await page.goto('/unit29-30/#learn/phrases');const room=page.locator('.stage-phrases');await page.getByText('指令怎样开头？',{exact:true}).click();await expect(room).toContainText('通常省略主语 you');await expect(room).toContainText('is 的缩写');
 await page.getByText('这些词在这里是什么意思？',{exact:true}).click();await expect(room).toContainText('不是造床');await expect(room).toContainText('不等同于 dirty');await expect(room).toContainText('/riːd/');await expect(room).toContainText('不写 a clothes');
 await page.goto('/unit29-30/#learn/exam');const exam=page.locator('.stage-exam');for(const [name,description] of [['甲图','灯没有发光，书摊开着'],['乙图','灯有光芒，书摊开着'],['丙图','灯没有发光，书合着']])await expect(exam.getByRole('button',{name,exact:true})).toHaveAccessibleDescription(description);
 await page.mouse.move(0,0);const styles=await exam.locator('.practice-options button').evaluateAll(xs=>xs.map(x=>{const s=getComputedStyle(x);return[s.backgroundColor,s.borderColor,s.minHeight];}));expect(styles.every(s=>JSON.stringify(s)===JSON.stringify(styles[0]))).toBe(true);
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:800});for(const img of await exam.locator('.picture-option img').all()){const box=await img.boundingBox();expect(box.width).toBeGreaterThanOrEqual(160);expect(box.height).toBeGreaterThanOrEqual(120);}expect(await exam.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);}
 await exam.screenshot({path:'output/playwright/unit29-30/picture-options.png'});for(const name of ['乙图','丙图']){await exam.getByRole('button',{name,exact:true}).click();await exam.getByRole('button',{name:'检查答案',exact:true}).click();await expect(exam.getByRole('status')).toHaveText('再看看，试一次。');await exam.getByRole('button',{name:'再试一次',exact:true}).click();}
});
