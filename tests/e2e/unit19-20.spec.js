'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('导航进入冰淇淋休息站，先看音标词卡，整卡翻义无需配音',async({page})=>{
  const audio=[],errors=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.getByRole('link',{name:'开始学习：冰淇淋休息站',exact:true}).click();
  await expect(page).toHaveURL(/\/unit19-20\/#learn\/words$/);
  const room=page.getByRole('region',{name:'公园小图鉴',exact:true});
  await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
  const card=room.getByRole('button',{name:'tired',exact:true});await expect(card).toContainText('/taɪrd/');
  await card.click();await expect(card.locator('.word-meaning')).toHaveText('累的；疲倦的');await expect(card).toHaveAccessibleDescription('累的；疲倦的');
  await card.click();await expect(card.locator('.word-meaning')).toBeHidden();
  await expect(page.locator('#starCount')).toHaveText('0');expect(audio).toEqual([]);expect(errors).toEqual([]);
});

const {DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit1920}=require('../support/unit19-20-flow');
test('配套练习无需任何配音，28题与完整原文通关，领取并导出准确的课堂证书', async ({ page }) => {
  test.setTimeout(45000);
  const audio=[],errors=[];
  await page.route(/\.(mp3|wav|ogg)(\?|$)/,route=>{audio.push(route.request().url());return route.abort();});
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
  await page.goto('/unit19-20/#learn/certificate');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await completeUnit1920(page);
  expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);
  expect(await page.evaluate(()=>globalThis.voiceCalls)).toBe(0);expect(errors).toEqual([]);
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小观察员');
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'冰淇淋休息站纪念',exact:true});
  await expect(dialog).toContainText('完成 Lesson 19–20 课堂配套练习');
  await expect(dialog.locator('#certificateName')).toHaveText('小观察员');
  const day=await dialog.locator('#certificateDate').innerText();
  await dialog.screenshot({path:'output/playwright/unit19-20/certificate-desktop.png'});
  const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();
  await(await download).saveAs('output/playwright/unit19-20/certificate-saved.png');
  const pdf=await page.pdf({path:'output/playwright/unit19-20/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.keyboard.press('Escape');await page.reload();
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  await expect(dialog.locator('#certificateDate')).toHaveText(day);
});



test('15题覆盖两课新词，错答不泄题，最后三题刷新不代答，重练不重复计星',async({page})=>{
 await page.route(/\.(mp3|wav|ogg)(\?|$)/,r=>r.abort());await page.goto('/unit19-20/#learn/listen');const room=page.locator('.stage-listen');
 await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
 for(const [i,answer] of ANSWERS.listen.entries()){
  if(i>=12)await page.reload();await expect(room).toContainText('第 '+(i+1)+' / 15 题');
  const check=room.getByRole('button',{name:'检查答案',exact:true});await expect(check).toBeDisabled();await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
  if(i===0){await room.getByRole('button',{name:'忙碌的',exact:true}).click();await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await expect(room.locator('.practice-options .is-correct')).toHaveCount(0);await room.getByRole('button',{name:'再试一次',exact:true}).click();}
  await room.getByRole('button',{name:answer,exact:true}).click();await check.click();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));await room.getByRole('button',{name:i===14?'完成这一站':'下一题',exact:true}).click();
 }
 await expect(page.locator('#starCount')).toHaveText('3');await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
 await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(page.locator('#starCount')).toHaveText('3');
});

test('原文13段完整保留，分角色接话与合说准确，最后一段后显式完成才解锁',async({page})=>{
 await page.goto('/unit19-20/#learn/roles');await page.getByRole('button',{name:'先看故事',exact:true}).click();const room=page.locator('.stage-text');
 await expect(room).toContainText('孩子们为什么向妈妈道谢？');
 for(let i=0;i<DIALOGUE.length;i++){
  await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
  await expect(room.locator('.dialogue-actor.is-current')).toHaveText(SPEAKERS[i]==='孩子们'?['女孩','男孩']:[SPEAKERS[i]]);
  await expect(room.getByRole('status')).toHaveText((i+1)+' / 13 段对白');
  if(i===4){await room.getByRole('button',{name:'看中文',exact:true}).first().click();await expect(room.locator('.bcn').first()).toHaveText('怎么啦，孩子们？');await expect(room.locator('.bcn').first()).toBeVisible();await page.reload();await expect(room.locator('.btext')).toHaveCount(5);}
 }
 await expect(room.locator('.btext button')).toHaveCount(0);await expect(page.locator('#starCount')).toHaveText('0');await room.getByRole('button',{name:'完成课文',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('1');await room.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();await expect(page.getByRole('button',{name:'先看故事',exact:true})).toHaveCount(0);
});

const WORDS=['tired','thirsty','children','boy','mum','ice cream','matter','sit down','right','child','all right','big','small','open','shut','light','heavy','long','shoe','grandfather','grandmother','clean','dirty','hot','cold','fat','thin','old','young','new','short','tall','them','nice'];
const PH=['/taɪrd/','/ˈθɝːsti/','/ˈtʃɪldrən/','/bɔɪ/','/mʌm/','/ˈaɪs ˌkriːm/','/ˈmæt̬ɚ/','/sɪt daʊn/','/raɪt/','/tʃaɪld/','/ˌɑːl ˈraɪt/','/bɪɡ/','/smɑːl/','/ˈoʊpən/','/ʃʌt/','/laɪt/','/ˈhevi/','/lɑːŋ/','/ʃuː/','/ˈɡrænfɑːðɚ/','/ˈɡrænmʌðɚ/','/kliːn/','/ˈdɝːt̬i/','/hɑːt/','/koʊld/','/fæt/','/θɪn/','/oʊld/','/jʌŋ/','/nuː/','/ʃɔːrt/','/tɑːl/','/ðem/','/naɪs/'];
test('34张卡片默认音标、翻面词义可访问，图片完整加载，末组有下一站',async({page})=>{
 const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});await page.goto('/unit19-20/#learn/words');const room=page.locator('.stage-words');
 for(let p=0;p<6;p++){
  await expect(room.locator('.unit-word strong')).toHaveText(WORDS.slice(p*6,p*6+6));await expect(room.locator('.word-phonetic')).toHaveText(PH.slice(p*6,p*6+6));await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await expect(card).toHaveAccessibleDescription(await card.locator('.word-meaning').innerText());await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
  if(p<5)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
 }
 await page.reload();await expect(room).toContainText('6 / 6');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen$/);expect(audio).toEqual([]);
});

test('教材20幅对比图、A六题、B十组与数字完整，练习纸实际导出单页A4',async({page})=>{
 await page.goto('/unit19-20/#learn/models');const room=page.locator('.stage-models');await room.getByText('看看二十幅对比图',{exact:true}).click();
 await expect(room.locator('.comparison-gallery strong')).toHaveText(['clean','dirty','hot','cold','fat','thin','big','small','open','shut','light','heavy','old','young','old','new','short','tall','short','long'].map(x=>`They're ${x}.`));
 await expect(room.locator('.comparison-gallery .phrase-card>span')).toHaveText(['干净的孩子们','脏了的孩子们','感到热的邮递员们','感到冷的孩子们','胖的理发师们','瘦的理发师们','大的鞋子','小的鞋子','开着的店铺','关着的店铺','轻的箱子','重的箱子','年老的人','年轻的人','旧的帽子','新的帽子','矮的警察们','高的警察们','短的裤子','长的裤子']);
 await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);await room.locator('.comparison-gallery').screenshot({path:'output/playwright/unit19-20/gallery-desktop.png'});await expect(room.locator('.reference-card button')).toHaveCount(0);
 const models=[['the children','tired','thirsty'],['the postmen','cold','hot'],['the hairdressers','thin','fat'],['the shoes','small','big'],['the shops','shut','open'],['his cases','heavy','light'],['grandmother and grandfather','young','old'],['their hats','old','new'],['the policemen','short','tall'],['his trousers','short','long']];
 await room.getByText('看看完整问答',{exact:true}).click();await expect(room.locator('.reply-models strong')).toHaveText(models.map(([a,b,c])=>`Are ${a} ${b} or ${c}? They're not ${b}. They're ${c}.`));await expect(room).toContainText('这些是新的练习情境');
 const refs=['Those children ___ tired.','Their mother ___ tired, too.','That ice cream man ___ very busy.','His ice creams ___ very nice.',"What's the matter, children? We ___ thirsty.","What's the matter, Tim? I ___ tired."];
 await room.getByText('am、is 还是 are？',{exact:true}).click();await expect(room.locator('.be-models li')).toHaveText(refs.map((x,i)=>x.replace('___',['are','is','is','are','are','am'][i])));
 await room.getByText('跟老师读数字',{exact:true}).click();await expect(room).toContainText('105 · 106 · 217 · 218 · 321 · 322 · 433 · 434 · 545 · 546 · 657 · 658 · 769 · 770 · 881 · 882 · 998 · 999 · 1,000 · 1,001');
 await room.getByRole('button',{name:'下一站：句子小帮手',exact:true}).click();await expect(page).toHaveURL(/#learn\/be$/);
 await page.goto('/unit19-20/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(refs);await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(models.map(([a,b,c])=>`${a} / (${b}) / ${c}`));
 await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(60);const pdf=await page.pdf({path:'output/playwright/unit19-20/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('同词依语境判断，体形无好坏暗示，否定不能补出未说的信息',async({page})=>{
 await page.goto('/unit19-20/#learn/phrases');const room=page.locator('.stage-phrases');await room.getByText('看对象，选意思',{exact:true}).click();await expect(room).toContainText('grandfather 可以指祖父或外祖父');await expect(room).toContainText('short 形容身高是矮的');await room.getByText('把话放回故事里',{exact:true}).click();await expect(room).toContainText('休息不等于懒惰');await expect(room).toContainText('不代表一个人的好坏');
 await completeStory(page);await page.goto('/unit19-20/#learn/roles');const roles=page.locator('.stage-roles');await roles.getByRole('button',{name:ANSWERS.roles[0],exact:true}).click();await roles.getByRole('button',{name:'检查答案',exact:true}).click();await roles.getByRole('button',{name:'下一题',exact:true}).click();await roles.getByRole('button',{name:'Yes, we are, thank you!',exact:true}).click();await roles.getByRole('button',{name:'检查答案',exact:true}).click();await expect(roles.getByRole('status')).toHaveText('再看看，试一次。');await expect(roles.locator('.practice-options .is-correct')).toHaveCount(0);
});
