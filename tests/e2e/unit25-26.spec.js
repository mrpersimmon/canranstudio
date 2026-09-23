'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('首页新单元从厨房小图鉴开始，音标可见',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'开始学习：厨房探访记',exact:true}).click();
 await expect(page).toHaveURL(/\/unit25-26\/#learn\/words$/);await expect(page.getByRole('heading',{name:'厨房小图鉴',exact:true})).toBeInViewport();
 await expect(page.locator('.stage-words').getByRole('button',{name:'kitchen',exact:true}).locator('.word-phonetic')).toHaveText('/ˈkɪtʃən/');
});

const {DIALOGUE,ANSWERS,completeUnit2526,completeActivity,completeStory}=require('../support/unit25-26-flow');
test('全部声音失败仍完成23题和完整原文，15星后保存真实证书，刷新保留日期',async({page})=>{
 test.setTimeout(60000);const audio=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());
 await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
 await page.goto('/unit25-26/#learn/certificate');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await completeUnit2526(page);
 expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);expect(await page.evaluate(()=>voiceCalls)).toBe(0);expect(errors).toEqual([]);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小小厨房向导');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'厨房探访记纪念',exact:true});await expect(dialog).toContainText('完成 Lesson 25–26 课堂配套练习');await expect(dialog.locator('#certificateName')).toHaveText('小小厨房向导');const day=await dialog.locator('#certificateDate').innerText();
 await dialog.screenshot({path:'output/playwright/unit25-26/certificate-desktop.png'});const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson25-26-厨房探访记.png');await download.saveAs('output/playwright/unit25-26/certificate-saved.png');
 const png=await require('node:fs/promises').readFile('output/playwright/unit25-26/certificate-saved.png');expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const pdf=await page.pdf({path:'output/playwright/unit25-26/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(day);
});


test('证书长名字在三种窄屏中完整，实际保存图片与单元主题一致',async({page})=>{
 test.setTimeout(45000);await completeUnit2526(page);await page.emulateMedia({reducedMotion:'reduce'});
 const name='热爱探险和英语学习的小朋友李明小明';await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill(name);await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'厨房探访记纪念',exact:true}),paper=dialog.locator('.certificate-paper');await expect(paper).toHaveCSS('animation-name','none');await expect(paper).toHaveCSS('opacity','1');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:740});await expect(dialog.locator('#certificateName')).toHaveText(name);expect((await dialog.locator('#certificateName').boundingBox()).height).toBeLessThanOrEqual(100);expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  const bounds=await paper.boundingBox();for(const box of await paper.locator('h3,p,li,img').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right};}))){expect(box.left).toBeGreaterThanOrEqual(bounds.x-1);expect(box.right).toBeLessThanOrEqual(bounds.x+bounds.width+1);}
  expect((await dialog.getByRole('button',{name:'保存图片',exact:true}).boundingBox()).height).toBeGreaterThanOrEqual(44);await dialog.screenshot({path:`output/playwright/unit25-26/certificate-long-${width}.png`});
 }
 const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson25-26-厨房探访记.png');const path='output/playwright/unit25-26/certificate-long-saved.png';await download.saveAs(path);
 const png=await require('node:fs/promises').readFile(path);expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const band=await paper.evaluate(el=>getComputedStyle(el,'::before').backgroundColor.match(/\d+/g).slice(0,3).map(Number));const pixel=await require('sharp')(png).extract({left:100,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();expect([...pixel]).toEqual(band);
 await dialog.getByRole('button',{name:'关闭',exact:true}).click();await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeFocused();
});

test('证书空名字有友好称呼，插图加载失败不假保存，恢复后可重试',async({page})=>{
 test.setTimeout(45000);await completeUnit2526(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('');await page.route('**/assets/unit25-26/Mrs.svg',r=>r.abort());await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'厨房探访记纪念',exact:true});await expect(dialog.locator('#certificateName')).toHaveText('细心的厨房小向导');const downloads=[];page.on('download',d=>downloads.push(d));await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('图片暂时没有生成');await expect(dialog.getByRole('button',{name:'保存图片',exact:true})).toBeEnabled();expect(downloads).toHaveLength(0);
 await page.unroute('**/assets/unit25-26/Mrs.svg');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await pending;await expect(dialog.getByRole('status')).toContainText('纪念图片已保存');expect(downloads).toHaveLength(1);
});

test('12道词义题连续错答只重试，最后三题刷新不会代答，重练不重复计星',async({page})=>{
 await page.goto('/unit25-26/#learn/listen');const room=page.locator('.stage-listen');await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
 for(const [i,answer] of ANSWERS.listen.entries()){
  if(i>=9)await page.reload();await expect(room).toContainText('第 '+(i+1)+' / 12 题');const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
  if(i===0||i===11)for(let j=0;j<2;j++){await room.getByRole('button',{name:i===0?'妈妈':'在……上面',exact:true}).click();await check.click();if(j===1)await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i===11?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(page.locator('#starCount')).toHaveText('3');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(page.locator('#starCount')).toHaveText('3');
});

test('原文12句逐句保留，不虚构对话，主动完成后才解锁理解',async({page})=>{
 await page.goto('/unit25-26/#learn/roles');await page.getByRole('button',{name:'先看课文',exact:true}).click();const room=page.locator('.stage-text');await expect(room).toContainText('电炉是什么颜色？');await expect(room.locator('.dialogue-actor')).toHaveCount(0);
 for(let i=0;i<12;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.getByRole('status')).toHaveText((i+1)+' / 12 句原文');
  if(i===4){await room.getByRole('button',{name:'看中文',exact:true}).last().click();await expect(room.locator('.bcn').last()).toHaveText('厨房里有一台电炉。');await page.reload();await expect(room.locator('.btext')).toHaveCount(5);}
 }
 await expect(room.locator('.btext button')).toHaveCount(0);await expect(page.locator('#starCount')).toHaveText('0');await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('1');await room.getByRole('button',{name:'下一站：课文小侦探',exact:true}).click();await expect(page.locator('.stage-roles').getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

const WORDS=['Mrs.','kitchen','refrigerator','electric','cooker','electric cooker','right','left','middle','of','room','where','in','there','a','an','the','on','cup','box','glass','knife','fork','tin','bottle','pencil','spoon','table','empty','full','clean','dirty','large','sharp','blunt','small'];
const PH=['/ˈmɪsɪz/','/ˈkɪtʃən/','/rɪˈfrɪdʒəreɪt̬ɚ/','/ɪˈlektrɪk/','/ˈkʊkɚ/','/ɪˈlektrɪk ˈkʊkɚ/','/raɪt/','/left/','/ˈmɪdəl/','/ɑːv/','/ruːm/','/wer/','/ɪn/','/ðer/','/eɪ/','/æn/','/ðiː/','/ɑːn/','/kʌp/','/bɑːks/','/ɡlæs/','/naɪf/','/fɔːrk/','/tɪn/','/ˈbɑːt̬əl/','/ˈpensəl/','/spuːn/','/ˈteɪbəl/','/ˈempti/','/fʊl/','/kliːn/','/ˈdɝːt̬i/','/lɑːrdʒ/','/ʃɑːrp/','/blʌnt/','/smɑːl/'];
test('36张词卡完整音标、翻义、加载、六组翻页与末组续学',async({page})=>{
 const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.goto('/unit25-26/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
 for(let p=0;p<6;p++){
  await expect(room.locator('.unit-word strong')).toHaveText(WORDS.slice(p*6,p*6+6));await expect(room.locator('.word-phonetic')).toHaveText(PH.slice(p*6,p*6+6));await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await expect(card).toHaveAccessibleDescription(await card.locator('.word-meaning').innerText());await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
  if(p<5)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room).toContainText('6 / 6');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen$/);expect(audio).toEqual([]);
});

const PICTURES=[['cup','on','table','clean'],['box','on','floor','large'],['glass','in','cupboard','empty'],['knife','on','plate','sharp'],['fork','on','tin','dirty'],['bottle','in','refrigerator','full'],['pencil','on','desk','blunt'],['spoon','in','cup','small']];
const REFS=['Give me ___ glass. Which glass? ___ empty one.','Give me some cups. Which cups? ___ cups on the table.','Is there ___ book on ___ table? Yes, there is. Is ___ book red?','Is there ___ knife in that box? Yes, there is. Is ___ knife sharp?'];
test('原图八组、A四题八空、B七组两句完整，实际打印一张A4',async({page})=>{
 await page.goto('/unit25-26/#learn/models');const room=page.locator('.stage-models');await room.getByText('看看八幅厨房图',{exact:true}).click();await expect(room.locator('.comparison-gallery strong')).toHaveText(PICTURES.map(([a,p,b,c])=>`There is a ${a} ${p} the ${b}.\nThe ${a} is ${c}.`));
 await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);await room.locator('.comparison-gallery').screenshot({path:'output/playwright/unit25-26/gallery-desktop.png'});await expect(room.locator('.reference-card button')).toHaveCount(0);
 await room.getByText('看看完整表达',{exact:true}).click();await expect(room.locator('.reply-models strong')).toHaveText(PICTURES.slice(0,7).map(([a,p,b,c])=>`There's a ${a} ${p} the ${b}.\nThe ${a} is ${c}.`));
 await room.getByText('给小空格选冠词',{exact:true}).click();const answers=[['a','The'],['The'],['a','the','the'],['a','the']];await expect(room.locator('.be-models li')).toHaveText(REFS.map((s,i)=>{let j=0;return s.replace(/___/g,()=>answers[i][j++]);}));await expect(room).toContainText('桌子是双方都知道的那张');
 await room.getByText('跟老师读数字',{exact:true}).click();await expect(room).toContainText('3,000 · 4,000 · 5,000 · 6,000 · 7,000 · 8,000 · 9,000 · 10,000');await room.getByRole('button',{name:'下一站：位置小帮手',exact:true}).click();await expect(page).toHaveURL(/#learn\/be$/);
 await page.goto('/unit25-26/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(REFS);await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(PICTURES.slice(0,7).map(([a,p,b,c])=>`${a} ${p} the ${b} / ${c}`));await expect(page.locator('.writing-blank')).toHaveCount(8);
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(14);const pdf=await page.pdf({path:'output/playwright/unit25-26/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('语法支架不误教，图选同等可读，连续错误不泄露正确的双条件',async({page})=>{
 await page.goto('/unit25-26/#learn/phrases');await page.getByText('先介绍，再接着说',{exact:true}).click();const room=page.locator('.stage-phrases');await expect(room).toContainText('不表示只有杯子');await expect(room).toContainText('there 不译成“那里”');await page.getByText('a、an 和 the 怎么选？',{exact:true}).click();await expect(room).toContainText('不只看字母');await expect(room).toContainText('不能只靠数它出现了几次');
 await page.goto('/unit25-26/#learn/exam');const exam=page.locator('.stage-exam');for(const [name,description] of [['甲图','空玻璃杯在橱柜里面'],['乙图','装满液体的玻璃杯在橱柜里面'],['丙图','空玻璃杯放在橱柜顶面上']])await expect(exam.getByRole('button',{name,exact:true})).toHaveAccessibleDescription(description);
 await page.mouse.move(0,0);const styles=await exam.locator('.practice-options button').evaluateAll(xs=>xs.map(x=>{const s=getComputedStyle(x);return[s.backgroundColor,s.borderColor,s.minHeight];}));expect(styles.every(s=>JSON.stringify(s)===JSON.stringify(styles[0]))).toBe(true);
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:800});for(const img of await exam.locator('.picture-option img').all()){const box=await img.boundingBox();expect(box.width).toBeGreaterThanOrEqual(160);expect(box.height).toBeGreaterThanOrEqual(120);}expect(await exam.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);}
 await exam.screenshot({path:'output/playwright/unit25-26/picture-options.png'});for(const name of ['乙图','丙图']){await exam.getByRole('button',{name,exact:true}).click();await exam.getByRole('button',{name:'检查答案',exact:true}).click();await expect(exam.getByRole('status')).toHaveText('再看看，试一次。');await exam.getByRole('button',{name:'再试一次',exact:true}).click();}
});
