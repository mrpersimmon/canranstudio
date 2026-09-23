'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('导航进入寻物交接站，先看音标词卡，整卡翻义无需配音',async({page})=>{
 const audio=[],errors=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.getByRole('link',{name:'开始学习：寻物交接站',exact:true}).click();
 await expect(page).toHaveURL(/\/unit21-22\/#learn\/words$/);
 const room=page.getByRole('region',{name:'寻物小图鉴',exact:true});
 await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
 const card=room.getByRole('button',{name:'give',exact:true});await expect(card).toContainText('/ɡɪv/');
 await card.click();await expect(card.locator('.word-meaning')).toHaveText('给；递给');await expect(card).toHaveAccessibleDescription('给；递给');
 await card.click();await expect(card.locator('.word-meaning')).toBeHidden();
 await expect(page.locator('#starCount')).toHaveText('0');expect(audio).toEqual([]);expect(errors).toEqual([]);
});

const {DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit2122}=require('../support/unit21-22-flow');
test('所有声音不可用仍完成26题与8段原文，领取并导出课堂证书',async({page})=>{
 test.setTimeout(45000);const audio=[],errors=[];
 await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>{audio.push(r.request().url());return r.abort();});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
 await page.goto('/unit21-22/#learn/certificate');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
 await completeUnit2122(page);expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);expect(await page.evaluate(()=>voiceCalls)).toBe(0);expect(errors).toEqual([]);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小小交接员');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'寻物交接站纪念',exact:true});await expect(dialog).toContainText('完成 Lesson 21–22 课堂配套练习');await expect(dialog.locator('#certificateName')).toHaveText('小小交接员');const day=await dialog.locator('#certificateDate').innerText();
 await dialog.screenshot({path:'output/playwright/unit21-22/certificate-desktop.png'});const download=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await(await download).saveAs('output/playwright/unit21-22/certificate-saved.png');
 const pdf=await page.pdf({path:'output/playwright/unit21-22/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(day);
});

test('14题各有依据，连续错答不泄题，最后三题刷新不代答，重练不重复计星',async({page})=>{
 await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());await page.goto('/unit21-22/#learn/listen');const room=page.locator('.stage-listen');await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
 for(const [i,answer] of ANSWERS.listen.entries()){
  if(i>=11)await page.reload();await expect(room).toContainText('第 '+(i+1)+' / 14 题');const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(i===0||i===13){for(let j=0;j<2;j++){await room.getByRole('button',{name:i===0?'寻找':'瓶子',exact:true}).click();await check.click();if(j===1)await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i===13?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(page.locator('#starCount')).toHaveText('3');await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(page.locator('#starCount')).toHaveText('3');
});

test('原文8段与两次确认完整保留，人物准确，主动完成末段才解锁',async({page})=>{
 await page.goto('/unit21-22/#learn/roles');await page.getByRole('button',{name:'先看故事',exact:true}).click();const room=page.locator('.stage-text');await expect(room).toContainText('男士想要哪一本书？');
 for(let i=0;i<DIALOGUE.length;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));await expect(room.locator('.dialogue-actor.is-current')).toHaveText([SPEAKERS[i]]);await expect(room.getByRole('status')).toHaveText((i+1)+' / 8 段对白');
  if(i===3){await room.getByRole('button',{name:'看中文',exact:true}).first().click();await expect(room.locator('.bcn').first()).toHaveText('请拿本书给我，简。');await page.reload();await expect(room.locator('.btext')).toHaveCount(4);}
 }
 await expect(room.locator('.btext button')).toHaveCount(0);await expect(page.locator('#starCount')).toHaveText('0');await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('1');await room.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();await expect(page.getByRole('button',{name:'先看故事',exact:true})).toHaveCount(0);
});

const WORDS=['give','one','which','book','red','blue','empty','full','large','little','sharp','blunt','big','small','box','glass','cup','bottle','tin','knife','fork','spoon','me','him','her','us','them','his','our','their','dirty','clean','new','old','this','that'];
const PH=['/ɡɪv/','/wʌn/','/wɪtʃ/','/bʊk/','/red/','/bluː/','/ˈempti/','/fʊl/','/lɑːrdʒ/','/ˈlɪt̬əl/','/ʃɑːrp/','/blʌnt/','/bɪɡ/','/smɑːl/','/bɑːks/','/ɡlæs/','/kʌp/','/ˈbɑːt̬əl/','/tɪn/','/naɪf/','/fɔːrk/','/spuːn/','/miː/','/hɪm/','/hɝː/','/ʌs/','/ðem/','/hɪz/','/aʊr/','/ðer/','/ˈdɝːt̬i/','/kliːn/','/nuː/','/oʊld/','/ðɪs/','/ðæt/'];
test('36张完整音标词卡可翻义，图片加载，末组有下一站且刷新保留页码',async({page})=>{
 const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.goto('/unit21-22/#learn/words');const room=page.locator('.stage-words');
 for(let p=0;p<6;p++){
  await expect(room.locator('.unit-word strong')).toHaveText(WORDS.slice(p*6,p*6+6));await expect(room.locator('.word-phonetic')).toHaveText(PH.slice(p*6,p*6+6));await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await expect(card).toHaveAccessibleDescription(await card.locator('.word-meaning').innerText());await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
  if(p<5)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room).toContainText('6 / 6');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen$/);expect(audio).toEqual([]);
});

test('16幅图、五种接收者、A六题与B八组完整，实际打印为一张A4',async({page})=>{
 await page.goto('/unit21-22/#learn/phrases');await expect(page.locator('.stage-phrases .phrase-grid strong')).toHaveText(['me','him','her','us','them'].map(x=>`Give ${x} a book, please.`));
 await page.goto('/unit21-22/#learn/models');const room=page.locator('.stage-models');await room.getByText('看看十六幅物品图',{exact:true}).click();
 await expect(room.locator('.comparison-gallery strong')).toHaveText(['a dirty cup','a clean cup','an empty glass','a full glass','a large bottle','a small bottle','a big box','a little box','a new tin','an old tin','a sharp knife','a blunt knife','a new spoon','an old spoon','a large fork','a small fork']);
 await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);await room.locator('.comparison-gallery').screenshot({path:'output/playwright/unit21-22/gallery-desktop.png'});await expect(room.locator('.reference-card button')).toHaveCount(0);
 const models=[['cup','dirty','clean'],['glass','empty','full'],['bottle','large','small'],['box','big','little'],['tin','new','old'],['knife','sharp','blunt'],['spoon','new','old'],['fork','large','small']];
 await room.getByText('看看完整问答',{exact:true}).click();await expect(room.locator('.reply-models strong')).toHaveText(models.map(([a,b,c])=>`Give me a ${a}, please.\nWhich one? This ${b} one?\nNo, not this ${b} one. That ${c} one.\nHere you are.\nThank you.`));
 const refs=["Is this Nicola's coat? No, it's not. ___ coat is grey.","Are these your pens? No, they're not. ___ pens are blue.","Is this Mr. Jackson's hat? No, it's not. ___ hat is black.","Are these the children's books? No, they're not. ___ books are red.","Is this Helen's dog? No, it's not. ___ dog is brown and white.","Is this your father's tie? No, it's not. ___ tie is orange."];
 await room.getByText('这些物品是谁的？',{exact:true}).click();await expect(room.locator('.be-models li')).toHaveText(refs.map((x,i)=>x.replace('___',['Her','Our','His','Their','Her','His'][i])));await expect(room).toContainText('第 2 题由两位同学一起回答');await expect(room).toContainText('Nicola 和 Helen 是女士');
 await room.getByText('跟老师读数字',{exact:true}).click();await expect(room).toContainText('1,001 · 1,002 · 1,003 · 1,004 · 1,005 · 1,006 · 1,007 · 1,008 · 1,009 · 1,010 · 1,011 · 1,012 · 1,013 · 1,014 · 1,015 · 1,016');
 await room.getByRole('button',{name:'下一站：句子小帮手',exact:true}).click();await expect(page).toHaveURL(/#learn\/be$/);
 await page.goto('/unit21-22/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(refs);await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(models.map(([a,b,c])=>`${a} / (this ${b}) / that ${c}`));
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(48);const pdf=await page.pdf({path:'output/playwright/unit21-22/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('one随先行词理解，her区分接收者与所属，近义大小词不互斥',async({page})=>{
 await page.goto('/unit21-22/#learn/phrases');const room=page.locator('.stage-phrases');await room.getByText('给谁？谁的？',{exact:true}).click();await expect(room).toContainText('Give her a book. 是给她一本书；her book 是她的书');await room.getByText('哪一个？这一件，那一件',{exact:true}).click();await expect(room).toContainText('one 也可以代替 cup');await expect(room).toContainText('不只表示数字一');
 await page.goto('/unit21-22/#learn/models');await page.getByText('把物品说准确',{exact:true}).click();await expect(page.locator('.stage-models')).toContainText('large 和 big 在这里都表示大；little 和 small 在这里都表示小');await expect(page.locator('.stage-models')).toContainText('a / an 看后面紧挨着的词的起始音');
});

test('证书长名字在三种窄屏中完整，实际保存图片与单元主题一致',async({page})=>{
 test.setTimeout(45000);await completeUnit2122(page);await page.emulateMedia({reducedMotion:'reduce'});
 const name='热爱探险和英语学习的小朋友李明小明';await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill(name);await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'寻物交接站纪念',exact:true}),paper=dialog.locator('.certificate-paper');await expect(paper).toHaveCSS('animation-name','none');await expect(paper).toHaveCSS('opacity','1');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:740});await expect(dialog.locator('#certificateName')).toHaveText(name);expect((await dialog.locator('#certificateName').boundingBox()).height).toBeLessThanOrEqual(100);expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  const bounds=await paper.boundingBox();for(const box of await paper.locator('h3,p,li,img').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right};}))){expect(box.left).toBeGreaterThanOrEqual(bounds.x-1);expect(box.right).toBeLessThanOrEqual(bounds.x+bounds.width+1);}
  expect((await dialog.getByRole('button',{name:'保存图片',exact:true}).boundingBox()).height).toBeGreaterThanOrEqual(44);await dialog.screenshot({path:`output/playwright/unit21-22/certificate-long-${width}.png`});
 }
 const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson21-22-寻物交接站.png');const path='output/playwright/unit21-22/certificate-long-saved.png';await download.saveAs(path);
 const png=await require('node:fs/promises').readFile(path);expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const band=await paper.evaluate(el=>getComputedStyle(el,'::before').backgroundColor.match(/\d+/g).slice(0,3).map(Number));const pixel=await require('sharp')(png).extract({left:100,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();expect([...pixel]).toEqual(band);
 await dialog.getByRole('button',{name:'关闭',exact:true}).click();await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeFocused();
});

test('证书空名字有友好称呼，插图加载失败不假保存，恢复后可重试',async({page})=>{
 test.setTimeout(45000);await completeUnit2122(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('');await page.route('**/assets/unit21-22/jane.svg',r=>r.abort());await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'寻物交接站纪念',exact:true});await expect(dialog.locator('#certificateName')).toHaveText('细心的小小交接员');const downloads=[];page.on('download',d=>downloads.push(d));await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('图片暂时没有生成');await expect(dialog.getByRole('button',{name:'保存图片',exact:true})).toBeEnabled();expect(downloads).toHaveLength(0);
 await page.unroute('**/assets/unit21-22/jane.svg');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await pending;await expect(dialog.getByRole('status')).toContainText('纪念图片已保存');expect(downloads).toHaveLength(1);
});

test('证书长名字在资源较慢时仍生成实际图片',async({page})=>{
 test.setTimeout(45000);
 await completeUnit2122(page);
 await page.route('**/assets/unit21-22/jane.svg',async route=>{await new Promise(resolve=>setTimeout(resolve,6000));await route.continue();});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('热爱英语的小小交接员');
 await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.locator('#certificateDialog');
 const pending=page.waitForEvent('download',{timeout:15000});
 await dialog.getByRole('button',{name:'保存图片',exact:true}).click();
 const download=await pending;
 const p='output/playwright/unit21-22/certificate-slow.png';await download.saveAs(p);
 const bytes=await require('node:fs/promises').readFile(p);expect(bytes.readUInt32BE(16)).toBe(1440);expect(bytes.readUInt32BE(20)).toBe(1100);
 await expect(dialog.getByRole('status')).toContainText('纪念图片已保存');
});
