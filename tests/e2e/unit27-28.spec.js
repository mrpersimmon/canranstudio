'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('首页新单元从客厅小图鉴开始，音标可见',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'开始学习：客厅发现之旅',exact:true}).click();
 await expect(page).toHaveURL(/\/unit27-28\/#learn\/words$/);await expect(page.getByRole('heading',{name:'客厅小图鉴',exact:true})).toBeInViewport();
 await expect(page.locator('.stage-words').getByRole('button',{name:'near',exact:true}).locator('.word-phonetic')).toHaveText('/nɪr/');
});

const {DIALOGUE,ANSWERS,completeUnit2728,completeActivity,completeStory}=require('../support/unit27-28-flow');
test('全部声音失败仍完成19题和完整原文，15星后保存真实证书，刷新保留日期',async({page})=>{
 test.setTimeout(60000);const audio=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());
 await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
 await page.goto('/unit27-28/#learn/certificate');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await completeUnit2728(page);
 expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);expect(await page.evaluate(()=>voiceCalls)).toBe(0);expect(errors).toEqual([]);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小小客厅向导');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'客厅发现之旅纪念',exact:true});await expect(dialog).toContainText('完成 Lesson 27–28 课堂配套练习');await expect(dialog.locator('#certificateName')).toHaveText('小小客厅向导');const day=await dialog.locator('#certificateDate').innerText();
 await dialog.screenshot({path:'output/playwright/unit27-28/certificate-desktop.png'});const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson27-28-客厅发现之旅.png');await download.saveAs('output/playwright/unit27-28/certificate-saved.png');
 const png=await require('node:fs/promises').readFile('output/playwright/unit27-28/certificate-saved.png');expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const pdf=await page.pdf({path:'output/playwright/unit27-28/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(day);
});


test('证书长名字在三种窄屏中完整，实际保存图片与单元主题一致',async({page})=>{
 test.setTimeout(45000);await completeUnit2728(page);await page.emulateMedia({reducedMotion:'reduce'});
 const name='热爱探险和英语学习的小朋友李明小明';await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill(name);await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'客厅发现之旅纪念',exact:true}),paper=dialog.locator('.certificate-paper');await expect(paper).toHaveCSS('animation-name','none');await expect(paper).toHaveCSS('opacity','1');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:740});await expect(dialog.locator('#certificateName')).toHaveText(name);expect((await dialog.locator('#certificateName').boundingBox()).height).toBeLessThanOrEqual(100);expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  const bounds=await paper.boundingBox();for(const box of await paper.locator('h3,p,li,img').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right};}))){expect(box.left).toBeGreaterThanOrEqual(bounds.x-1);expect(box.right).toBeLessThanOrEqual(bounds.x+bounds.width+1);}
  expect((await dialog.getByRole('button',{name:'保存图片',exact:true}).boundingBox()).height).toBeGreaterThanOrEqual(44);await dialog.screenshot({path:`output/playwright/unit27-28/certificate-long-${width}.png`});
 }
 const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson27-28-客厅发现之旅.png');const path='output/playwright/unit27-28/certificate-long-saved.png';await download.saveAs(path);
 const png=await require('node:fs/promises').readFile(path);expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const band=await paper.evaluate(el=>getComputedStyle(el,'::before').backgroundColor.match(/\d+/g).slice(0,3).map(Number));const pixel=await require('sharp')(png).extract({left:100,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();expect([...pixel]).toEqual(band);
 await dialog.getByRole('button',{name:'关闭',exact:true}).click();await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeFocused();
});

test('证书空名字有友好称呼，插图加载失败不假保存，恢复后可重试',async({page})=>{
 test.setTimeout(45000);await completeUnit2728(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('');await page.route('**/assets/unit27-28/Mrs.svg',r=>r.abort());await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'客厅发现之旅纪念',exact:true});await expect(dialog.locator('#certificateName')).toHaveText('细心的客厅发现家');const downloads=[];page.on('download',d=>downloads.push(d));await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('图片暂时没有生成');await expect(dialog.getByRole('button',{name:'保存图片',exact:true})).toBeEnabled();expect(downloads).toHaveLength(0);
 await page.unroute('**/assets/unit27-28/Mrs.svg');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await pending;await expect(dialog.getByRole('status')).toContainText('纪念图片已保存');expect(downloads).toHaveLength(1);
});

test('8道词义题连续错答只重试，最后三题刷新不会代答，重练不重复计星',async({page})=>{
 await page.goto('/unit27-28/#learn/listen');const room=page.locator('.stage-listen');await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
 for(const [i,answer] of ANSWERS.listen.entries()){
  if(i>=5)await page.reload();await expect(room).toContainText('第 '+(i+1)+' / 8 题');const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
  if(i===0||i===7)for(let j=0;j<2;j++){await room.getByRole('button',{name:i===0?'厨房':'领带',exact:true}).click();await check.click();if(j===1)await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(page.locator('#starCount')).toHaveText('3');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(page.locator('#starCount')).toHaveText('3');
});

test('原文13句逐句保留，不虚构对话，主动完成后才解锁理解',async({page})=>{
 await page.goto('/unit27-28/#learn/roles');await page.getByRole('button',{name:'先看课文',exact:true}).click();const room=page.locator('.stage-text');await expect(room).toContainText('书在哪里？');await expect(room.locator('.dialogue-actor')).toHaveCount(0);
 for(let i=0;i<13;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.getByRole('status')).toHaveText((i+1)+' / 13 句原文');
  if(i===4){await room.getByRole('button',{name:'看中文',exact:true}).last().click();await expect(room.locator('.bcn').last()).toHaveText('客厅里有张桌子。');await page.reload();await expect(room.locator('.btext')).toHaveCount(5);}
 }
 await expect(room.locator('.btext button')).toHaveCount(0);await expect(page.locator('#starCount')).toHaveText('0');await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('1');await room.getByRole('button',{name:'下一站：课文小侦探',exact:true}).click();await expect(page.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

const WORDS=['living room','near','window','armchair','door','picture','wall','trousers','television','stereo','magazines','newspapers','books','armchairs','pictures','some','any','there','they','are','knife','knives','policeman','policemen','housewife','housewives','man','men','keyboard operator','office'];
const PH=['/ˈlɪvɪŋ ˌruːm/','/nɪr/','/ˈwɪndoʊ/','/ˈɑːrmtʃer/','/dɔːr/','/ˈpɪktʃɚ/','/wɑːl/','/ˈtraʊzɚz/','/ˈteləvɪʒən/','/ˈsterioʊ/','/ˌmæɡəˈziːnz/','/ˈnuːzˌpeɪpɚz/','/bʊks/','/ˈɑːrmtʃerz/','/ˈpɪktʃɚz/','/sʌm/','/ˈeni/','/ðer/','/ðeɪ/','/ɑːr/','/naɪf/','/naɪvz/','/pəˈliːsmən/','/pəˈliːsmən/','/ˈhaʊswaɪf/','/ˈhaʊswaɪvz/','/mæn/','/men/','/ˈkiːbɔːrd ˌɑːpəreɪt̬ɚ/','/ˈɑːfɪs/'];
test('30张词卡完整音标、翻义、加载、五组翻页与末组续学',async({page})=>{
 const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.goto('/unit27-28/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
 for(let p=0;p<5;p++){
  await expect(room.locator('.unit-word strong')).toHaveText(WORDS.slice(p*6,p*6+6));await expect(room.locator('.word-phonetic')).toHaveText(PH.slice(p*6,p*6+6));await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await expect(card).toHaveAccessibleDescription(await card.locator('.word-meaning').innerText());await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
  if(p<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room).toContainText('5 / 5');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen$/);expect(audio).toEqual([]);
});

const PICTURES=[
 ['cigarettes','on the dressing table','They are near that box.'],['plates','on the cooker','They are clean.'],['trousers','on the bed','They are near that shirt.'],['bottles','in the refrigerator','They are empty.'],['shoes','on the floor',"They're near the bed."],['knives','on the table',"They're in that box."],['forks','on the shelf',"They're near those spoons."],['bottles','on the cupboard',"They're near those tins."],['tickets','on the shelf',"They're in that handbag."],['glasses','on the television',"They're near those bottles."]
];
const WRITING=[['books','in the room','magazines','on the television'],['ties','on the floor','shoes','near the bed'],['glasses','on the cupboard','bottles','near those tins'],['newspapers','on the shelf','tickets','in that handbag'],['forks','on the table','knives','in that box'],['cups','on the stereo','glasses','near those bottles'],['cups','in the kitchen','plates','on the cooker'],['glasses','in the kitchen','bottles','in the refrigerator'],['books','in the room','pictures','on the wall'],['chairs','in the room','armchairs','near the table']];
const REFS=['There is a pencil on the desk.','There is a knife near that tin.','There is a policeman in the kitchen.','There is a newspaper in the living room.','There is a keyboard operator in the office.'];
const REFANS=['There are some pencils on the desk.','There are some knives near that tin.','There are some policemen in the kitchen.','There are some newspapers in the living room.','There are some keyboard operators in the office.'];
test('图句十组、A五题和B十组五句问答完整，打印一页且有完整句书写空间',async({page})=>{
 await page.goto('/unit27-28/#learn/models');const room=page.locator('.stage-models');await room.getByText('看看十幅位置图',{exact:true}).click();await expect(room.locator('.comparison-gallery strong')).toHaveText(PICTURES.map(([noun,place,rest])=>`There are some ${noun} ${place}.\n${rest}`));
 await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);await room.locator('.comparison-gallery').screenshot({path:'output/playwright/unit27-28/gallery-desktop.png'});await expect(room.locator('.reference-card button')).toHaveCount(0);
 await room.getByText('看看十组完整问答',{exact:true}).click();await expect(room).toContainText('不是课文客厅的物品清单');await expect(room).toContainText('本组的 chairs 指无扶手的普通椅子');await expect(room.locator('.reply-models strong')).toHaveText(WRITING.map(([asked,place,actual,loc])=>`Are there any ${asked} ${place}?\nNo, there aren't any ${asked} ${place}.\nThere are some ${actual}.\nWhere are they?\nThey're ${loc}.`));
 await room.getByText('把一句变成复数',{exact:true}).click();await expect(room.locator('.be-models li')).toHaveText(REFS.map((s,i)=>s+' → '+REFANS[i]));
 await room.getByText('跟老师读数字',{exact:true}).click();await expect(room).toContainText('1,120 · 2,230 · 3,340 · 4,450 · 5,560 · 6,670 · 7,780 · 8,890 · 9,999 · 10,001');await room.getByRole('button',{name:'下一站：位置问答站',exact:true}).click();await expect(page).toHaveURL(/#learn\/be$/);
 await page.goto('/unit27-28/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(REFS);await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(WRITING.map(([a,p,b,l])=>`(${a}) / ${p} / ${b} / ${l}`));await expect(page.locator('#unitWriting')).toContainText('任选一组');await expect(page.locator('#unitWriting')).toContainText('扶手椅也是椅子的一种');
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(10);for(const line of await page.locator('.writing-rule').all()){const box=await line.boundingBox();expect(box.height).toBeGreaterThanOrEqual(24);expect(box.width).toBeGreaterThan(500);}
 const pdf=await page.pdf({path:'output/playwright/unit27-28/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('语法支架不误教，图选同等可读，连续错误不泄露正确的双条件',async({page})=>{
 await page.goto('/unit27-28/#learn/phrases');await page.getByText('一个与多个，怎样介绍？',{exact:true}).click();const room=page.locator('.stage-phrases');await expect(room).toContainText('一条裤子也用这个形式');await expect(room).toContainText('不只按裤子条数');await page.getByText('有、没有，还是在哪里？',{exact:true}).click();await expect(room).toContainText('不等于所有问句都只能用 any');await expect(room).toContainText('不要求接触');
 await page.goto('/unit27-28/#learn/exam');const exam=page.locator('.stage-exam');for(const [name,description] of [['甲图','叉子和勺子相邻放在同一架子上'],['乙图','叉子和勺子相邻放在桌子上'],['丙图','叉子在左边架子上，勺子在远处的另一个架子上']])await expect(exam.getByRole('button',{name,exact:true})).toHaveAccessibleDescription(description);
 await page.mouse.move(0,0);const styles=await exam.locator('.practice-options button').evaluateAll(xs=>xs.map(x=>{const s=getComputedStyle(x);return[s.backgroundColor,s.borderColor,s.minHeight];}));expect(styles.every(s=>JSON.stringify(s)===JSON.stringify(styles[0]))).toBe(true);
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:800});for(const img of await exam.locator('.picture-option img').all()){const box=await img.boundingBox();expect(box.width).toBeGreaterThanOrEqual(160);expect(box.height).toBeGreaterThanOrEqual(120);}expect(await exam.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);}
 await exam.screenshot({path:'output/playwright/unit27-28/picture-options.png'});for(const name of ['乙图','丙图']){await exam.getByRole('button',{name,exact:true}).click();await exam.getByRole('button',{name:'检查答案',exact:true}).click();await expect(exam.getByRole('status')).toHaveText('再看看，试一次。');await exam.getByRole('button',{name:'再试一次',exact:true}).click();}
});
