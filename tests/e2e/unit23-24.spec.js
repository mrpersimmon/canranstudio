'use strict';
const {test,expect}=require('@playwright/test');
const {DIALOGUE,SPEAKERS,ANSWERS,completeUnit2324}=require('../support/unit23-24-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});

test('首页新单元从房间小图鉴开始，显示本课音标',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'开始学习：房间寻物队',exact:true}).click();
 await expect(page).toHaveURL(/\/unit23-24\/#learn\/words$/);await expect(page.getByRole('heading',{name:'房间小图鉴',exact:true})).toBeInViewport();
 const card=page.locator('.stage-words').getByRole('button',{name:'on',exact:true});await expect(card.locator('.word-phonetic')).toHaveText('/ɑːn/');await card.click();await expect(card.locator('.word-meaning')).toBeVisible();
});

test('全部声音失败仍完成26题和完整原文，15星后保存真实证书，刷新保留日期',async({page})=>{
 test.setTimeout(60000);const audio=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());
 await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
 await page.goto('/unit23-24/#learn/certificate');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await completeUnit2324(page);
 expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);expect(await page.evaluate(()=>voiceCalls)).toBe(0);expect(errors).toEqual([]);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小小寻物队员');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'房间寻物队纪念',exact:true});await expect(dialog).toContainText('完成 Lesson 23–24 课堂配套练习');await expect(dialog.locator('#certificateName')).toHaveText('小小寻物队员');const day=await dialog.locator('#certificateDate').innerText();
 await dialog.screenshot({path:'output/playwright/unit23-24/certificate-desktop.png'});const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson23-24-房间寻物队.png');await download.saveAs('output/playwright/unit23-24/certificate-saved.png');
 const png=await require('node:fs/promises').readFile('output/playwright/unit23-24/certificate-saved.png');expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const pdf=await page.pdf({path:'output/playwright/unit23-24/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(day);
});

test('15道词义题连续错答不泄题，末三题刷新不代答，重练不重复计星',async({page})=>{
 await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());await page.goto('/unit23-24/#learn/listen');const room=page.locator('.stage-listen');await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
 for(const [i,answer] of ANSWERS.listen.entries()){
  if(i>=12)await page.reload();await expect(room).toContainText('第 '+(i+1)+' / 15 题');const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(i===0||i===14){for(let j=0;j<2;j++){await room.getByRole('button',{name:i===0?'在……里面':'正好两个玻璃杯。',exact:true}).click();await check.click();if(j===1)await page.reload();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));await room.getByRole('button',{name:'再试一次',exact:true}).click();}}
  await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i===14?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(page.locator('#starCount')).toHaveText('3');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(page.locator('#starCount')).toHaveText('3');
});

test('原文8段完整、历史句可回看、中文按句展开，主动完成末段才解锁理解',async({page})=>{
 await page.goto('/unit23-24/#learn/roles');await page.getByRole('button',{name:'先看故事',exact:true}).click();const room=page.locator('.stage-text');await expect(room).toContainText('男士想要哪些杯子？');
 for(let i=0;i<DIALOGUE.length;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));await expect(room.locator('.dialogue-actor.is-current')).toHaveText([SPEAKERS[i]]);await expect(room.getByRole('status')).toHaveText((i+1)+' / 8 段对白');
  if(i===3){await room.getByRole('button',{name:'看中文',exact:true}).first().click();await expect(room.locator('.bcn').first()).toHaveText('请拿给我一些玻璃杯，简。');await page.reload();await expect(room.locator('.btext')).toHaveCount(4);}
 }
 await expect(room.locator('.btext button')).toHaveCount(0);await expect(page.locator('#starCount')).toHaveText('0');await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('1');await room.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();await expect(page.getByRole('button',{name:'先看故事',exact:true})).toHaveCount(0);
 const roles=page.locator('.stage-roles');for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:800});for(const img of await roles.locator('.picture-option img').all()){const box=await img.boundingBox();expect(box.width).toBeGreaterThanOrEqual(160);expect(box.height).toBeGreaterThanOrEqual(120);}expect(await roles.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);}await roles.screenshot({path:'output/playwright/unit23-24/story-options.png'});
});

const WORDS=['on','shelf','desk','table','plate','cupboard','cigarette','television','floor','dressing table','magazine','bed','newspaper','stereo','some','glass','glasses','one','ones','these','those','give','me','him','her','us','them','pen','tie','chair'];
const PH=['/ɑːn/','/ʃelf/','/desk/','/ˈteɪbəl/','/pleɪt/','/ˈkʌbɚd/','/ˈsɪɡəret/','/ˈteləvɪʒən/','/flɔːr/','/ˈdresɪŋ ˌteɪbəl/','/ˌmæɡəˈziːn/','/bed/','/ˈnuːzˌpeɪpɚ/','/ˈsterioʊ/','/sʌm/','/ɡlæs/','/ˈɡlæsɪz/','/wʌn/','/wʌnz/','/ðiːz/','/ðoʊz/','/ɡɪv/','/miː/','/hɪm/','/hɝː/','/ʌs/','/ðem/','/pen/','/taɪ/','/tʃer/'];
test('30张完整音标词卡可翻义，图片加载，末组有下一站且刷新保留页码',async({page})=>{
 const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.goto('/unit23-24/#learn/words');const room=page.locator('.stage-words');await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
 for(let p=0;p<5;p++){
  await expect(room.locator('.unit-word strong')).toHaveText(WORDS.slice(p*6,p*6+6));await expect(room.locator('.word-phonetic')).toHaveText(PH.slice(p*6,p*6+6));await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await expect(card).toHaveAccessibleDescription(await card.locator('.word-meaning').innerText());await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
  if(p<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room).toContainText('5 / 5');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen$/);expect(audio).toEqual([]);
});

const MODELS=[['pens','desk'],['ties','chair'],['spoons','table'],['plates','cupboard'],['cigarettes','television'],['boxes','floor'],['bottles','dressing table'],['books','shelf'],['magazines','bed'],['newspapers','stereo']];
const REFS=['Give Jane this watch. Give ___ this one, too.','Give the children these ice creams. Give ___ these, too.','Give Tom this book. Give ___ this one, too.','That is my passport. Give ___ my passport please.','That is my coat. Give ___ my coat please.','Those are our umbrellas. Give ___ our umbrellas please.'];
test('十幅位置图、五种接收者、A六题与B十组完整，实际打印为一张A4',async({page})=>{
 await page.goto('/unit23-24/#learn/phrases');await page.getByText('同样的物品，可以递给不同的人',{exact:true}).click();await expect(page.locator('.recipient-models strong')).toHaveText(['me','him','her','us','them'].map(x=>`Give ${x} some glasses, please.`));
 await page.goto('/unit23-24/#learn/models');const room=page.locator('.stage-models');await room.getByText('看看十幅位置图',{exact:true}).click();await expect(room.locator('.comparison-gallery strong')).toHaveText(MODELS.map(([a,b])=>`${a} / on the ${b}`));
 await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);await room.locator('.comparison-gallery').screenshot({path:'output/playwright/unit23-24/gallery-desktop.png'});await expect(room.locator('.reference-card button')).toHaveCount(0);
 await room.getByText('看看完整问答',{exact:true}).click();await expect(room.locator('.reply-models strong')).toHaveText(MODELS.map(([a,b])=>`Give me some ${a} please.\nWhich ones? These?\nNo, not those. The ones on the ${b}.`));
 await room.getByText('把物品递给谁？',{exact:true}).click();await expect(room.locator('.be-models li')).toHaveText(REFS.map((x,i)=>x.replace('___',['her','them','him','me','me','us'][i])));await expect(room).toContainText('Tim 和 Tom 是男士');
 await room.getByText('跟老师读数字',{exact:true}).click();await expect(room).toContainText('1,117 · 1,218 · 1,319 · 1,420 · 1,521 · 1,622 · 1,723 · 1,824 · 1,925 · 2,000');
 await room.getByRole('button',{name:'下一站：位置小帮手',exact:true}).click();await expect(page).toHaveURL(/#learn\/be$/);
 await page.goto('/unit23-24/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(REFS);await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(MODELS.map(([a,b])=>`${a} / on the ${b}`));
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(30);const pdf=await page.pdf({path:'output/playwright/unit23-24/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('学习材料正确区分some数量、ones回指、位置关系，图片选项有同等可读描述',async({page})=>{
 await page.goto('/unit23-24/#learn/phrases');await page.getByText('一个，一些；这个，这些',{exact:true}).click();const phrases=page.locator('.stage-phrases');await expect(phrases).toContainText('some 不告诉我们准确有几只');await expect(phrases).toContainText('也能用 ones 代替 books');await expect(phrases).toContainText('站在说话者的位置看');
 await page.goto('/unit23-24/#learn/models');await page.getByText('看清物品和位置',{exact:true}).click();await expect(page.locator('.stage-models')).toContainText('on the cupboard 是在橱柜顶面，不是柜子里面');await expect(page.locator('.stage-models')).toContainText('box → boxes');
 await page.goto('/unit23-24/#learn/be');const room=page.locator('.stage-be');for(const [name,description] of [['甲组','三本书叠放在书桌台面上'],['乙组','三本书放在书桌打开的抽屉里'],['丙组','三本书放在书桌上方的独立墙上搁板上']])await expect(room.getByRole('button',{name,exact:true})).toHaveAccessibleDescription(description);
 await page.mouse.move(0,0);const styles=await room.locator('.practice-options button').evaluateAll(xs=>xs.map(x=>{const s=getComputedStyle(x);return[s.backgroundColor,s.borderColor,s.minHeight];}));expect(styles.every(s=>JSON.stringify(s)===JSON.stringify(styles[0]))).toBe(true);
 for(const width of [320,390,768,1280]){await page.setViewportSize({width,height:800});for(const img of await room.locator('.picture-option img').all()){const box=await img.boundingBox();expect(box.width).toBeGreaterThanOrEqual(160);expect(box.height).toBeGreaterThanOrEqual(120);}expect(await room.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);}
 await room.screenshot({path:'output/playwright/unit23-24/location-options.png'});await room.getByRole('button',{name:'丙组',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
 await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'甲组',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(room).toContainText('两位同学请简把雨伞递回给自己');
 expect((await room.locator('.practice-options button').allTextContents()).sort()).toEqual(['our','us','we']);await room.getByRole('button',{name:'we',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'us',exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await expect(room.getByRole('status')).toHaveText('答对了！');
});

test('证书长名字在三种窄屏中完整，实际保存图片与单元主题一致',async({page})=>{
 test.setTimeout(45000);await completeUnit2324(page);await page.emulateMedia({reducedMotion:'reduce'});
 const name='热爱探险和英语学习的小朋友李明小明';await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill(name);await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'房间寻物队纪念',exact:true}),paper=dialog.locator('.certificate-paper');await expect(paper).toHaveCSS('animation-name','none');await expect(paper).toHaveCSS('opacity','1');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:740});await expect(dialog.locator('#certificateName')).toHaveText(name);expect((await dialog.locator('#certificateName').boundingBox()).height).toBeLessThanOrEqual(100);expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  const bounds=await paper.boundingBox();for(const box of await paper.locator('h3,p,li,img').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right};}))){expect(box.left).toBeGreaterThanOrEqual(bounds.x-1);expect(box.right).toBeLessThanOrEqual(bounds.x+bounds.width+1);}
  expect((await dialog.getByRole('button',{name:'保存图片',exact:true}).boundingBox()).height).toBeGreaterThanOrEqual(44);await dialog.screenshot({path:`output/playwright/unit23-24/certificate-long-${width}.png`});
 }
 const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('Lesson23-24-房间寻物队.png');const path='output/playwright/unit23-24/certificate-long-saved.png';await download.saveAs(path);
 const png=await require('node:fs/promises').readFile(path);expect(png.readUInt32BE(16)).toBe(1440);expect(png.readUInt32BE(20)).toBe(1100);
 const band=await paper.evaluate(el=>getComputedStyle(el,'::before').backgroundColor.match(/\d+/g).slice(0,3).map(Number));const pixel=await require('sharp')(png).extract({left:100,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();expect([...pixel]).toEqual(band);
 await dialog.getByRole('button',{name:'关闭',exact:true}).click();await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeFocused();
});

test('证书空名字有友好称呼，插图加载失败不假保存，恢复后可重试',async({page})=>{
 test.setTimeout(45000);await completeUnit2324(page);await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('');await page.route('**/assets/unit23-24/jane.svg',r=>r.abort());await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'房间寻物队纪念',exact:true});await expect(dialog.locator('#certificateName')).toHaveText('细心的房间小向导');const downloads=[];page.on('download',d=>downloads.push(d));await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('图片暂时没有生成');await expect(dialog.getByRole('button',{name:'保存图片',exact:true})).toBeEnabled();expect(downloads).toHaveLength(0);
 await page.unroute('**/assets/unit23-24/jane.svg');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const pending=page.waitForEvent('download',{timeout:15000});await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await pending;await expect(dialog.getByRole('status')).toContainText('纪念图片已保存');expect(downloads).toHaveLength(1);
});
