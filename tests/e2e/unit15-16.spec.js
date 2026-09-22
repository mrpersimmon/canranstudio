'use strict';
const { test, expect } = require('@playwright/test');
const { DIALOGUE, SPEAKERS, ANSWERS, completeStory, completeActivity, completeUnit1516 } = require('../support/unit15-16-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('从导航进入护照小检查站，先看有音标的词卡，翻义无需配音', async ({ page }) => {
  const audio = [], errors = [];
  page.on('request', request => { if (/\.(mp3|wav|ogg)(\?|$)/.test(request.url())) audio.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: '开始学习：护照小检查站', exact: true }).click();
  await expect(page).toHaveURL(/\/unit15-16\/#learn\/words$/);
  const room = page.getByRole('region', { name: '出行小图鉴', exact: true });
  await expect(room.getByRole('button', { name: '上一组词卡', exact: true })).toBeDisabled();
  const card = room.getByRole('button', { name: 'customs', exact: true });
  await expect(card).toContainText('/ˈkʌstəmz/');
  await card.click(); await expect(card.locator('.word-meaning')).toHaveText('本课：海关');
  await card.click(); await expect(card.locator('.word-meaning')).toBeHidden();
  await expect(page.locator('#starCount')).toHaveText('0');
  expect(audio).toEqual([]); expect(errors).toEqual([]);
});

test('配套练习无需任何配音，25题与完整原文通关，领取并导出准确的课堂证书', async ({ page }) => {
  test.setTimeout(45000);
  const audio=[],errors=[];
  await page.route(/\.(mp3|wav|ogg)(\?|$)/,route=>{audio.push(route.request().url());return route.abort();});
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
  await page.goto('/unit15-16/#learn/certificate');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await completeUnit1516(page);
  expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);
  expect(await page.evaluate(()=>globalThis.voiceCalls)).toBe(0);expect(errors).toEqual([]);
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小旅行家');
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'护照小检查站纪念',exact:true});
  await expect(dialog).toContainText('完成 Lesson 15–16 课堂配套练习');
  await expect(dialog.locator('#certificateName')).toHaveText('小旅行家');
  const day=await dialog.locator('#certificateDate').innerText();
  await dialog.screenshot({path:'output/playwright/unit15-16/certificate-desktop.png'});
  const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();
  await(await download).saveAs('output/playwright/unit15-16/certificate-saved.png');
  const pdf=await page.pdf({path:'output/playwright/unit15-16/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.keyboard.press('Escape');await page.reload();
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  await expect(dialog.locator('#certificateDate')).toHaveText(day);
});


test('从首页进入护照小检查站，25张音标词卡可翻义翻页，全程不调用英语配音', async ({ page }) => {
  const audio = [], errors = [];
  page.on('request', request => { if (/\.(mp3|wav|ogg)(\?|$)/.test(request.url())) audio.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: '开始学习：护照小检查站', exact: true }).click();
  await expect(page).toHaveURL(/\/unit15-16\/#learn\/words$/);
  await expect(page.locator('#starCount')).toHaveText('0');
  const atlas = page.getByRole('region', { name: '出行小图鉴', exact: true });
  const words = ['customs','officer','girl','Danish','friend','Norwegian','passport','brown','tourist','Russian','Dutch','these','red','grey','yellow','black','orange','customs officer','we','our','they','Swedish','English','American','case'];
  const phonetics = ['/ˈkʌstəmz/','/ˈɑːfɪsɚ/','/ɡɝːl/','/ˈdeɪnɪʃ/','/frend/','/nɔːrˈwiːdʒən/','/ˈpæspɔːrt/','/braʊn/','/ˈtʊrɪst/','/ˈrʌʃən/','/dʌtʃ/','/ðiːz/','/red/','/ɡreɪ/','/ˈjeloʊ/','/blæk/','/ˈɔːrɪndʒ/','/ˈkʌstəmz ˌɑːfɪsɚ/','/wiː/','/ˈaʊər/','/ðeɪ/','/ˈswiːdɪʃ/','/ˈɪŋɡlɪʃ/','/əˈmerɪkən/','/keɪs/'];
  await expect(atlas.getByRole('button', { name: '上一组词卡', exact: true })).toBeDisabled();
  for (let p = 0; p < 5; p++) {
    for (let i = p * 6; i < Math.min(p * 6 + 6, words.length); i++) {
      const card = atlas.getByRole('button', { name: words[i], exact: true });
      await expect(card).toContainText(phonetics[i]);
      expect(await card.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await card.click(); await expect(card.locator('.word-meaning')).toBeVisible();
      await card.click(); await expect(card.locator('.word-meaning')).toBeHidden();
    }
    if (p < 4) await atlas.getByRole('button', { name: '下一组词卡', exact: true }).click();
  }
  await page.reload(); await expect(atlas).toContainText('5 / 5');
  await atlas.getByRole('button', { name: '下一站：单词寻宝', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
  expect(audio).toEqual([]); expect(errors).toEqual([]);
});

test('11个新词各一次，错答可改，最后三题刷新不代答，重练清本轮并保留星星', async ({ page }) => {
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route=>route.abort());
  await page.goto('/unit15-16/#learn/listen'); const room=page.locator('.stage-listen');
  await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
  for(const [i,answer] of ANSWERS.listen.entries()) {
    await expect(room).toContainText('第 '+(i+1)+' / 11 题');
    if(i>=8) await page.reload();
    const check=room.getByRole('button',{name:'检查答案',exact:true});
    await expect(check).toBeDisabled(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
    await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
    if(i===0) {
      await room.getByRole('button',{name:'风俗',exact:true}).click(); await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
      await room.getByRole('button',{name:'再试一次',exact:true}).click();
    }
    await room.getByRole('button',{name:answer,exact:true}).click(); await check.click();
    await expect(room.getByRole('status')).toContainText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    await room.getByRole('button',{name:i===10?'完成这一站':'下一题',exact:true}).click();
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click(); await page.reload();
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('无音频时逐句读完18句原文，历史中文可展开，刷新续读且看完才解锁理解题', async ({ page }) => {
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route=>route.abort());
  await page.goto('/unit15-16/#learn/roles');
  await expect(page.getByRole('region',{name:'故事小侦探',exact:true}).getByRole('button',{name:'先看故事',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'先看故事',exact:true}).click();
  const room = page.getByRole('region',{name:'海关小剧场',exact:true});
  await expect(room).toContainText('最后，海关检查顺利吗？');
  for(let i=0;i<DIALOGUE.length;i++) {
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
    await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
    await expect(room.locator('.dialogue-actor.is-current')).toHaveText(SPEAKERS[i]);
    await expect(room.getByRole('status')).toHaveText((i+1)+' / 18 句');
    if(i===4) {
      await room.getByRole('button',{name:'看中文',exact:true}).first().click();
      await expect(room.locator('.bcn').first()).toHaveText('你们是瑞典人吗？');
      await expect(room.locator('.bcn').first()).toBeVisible();
      await page.reload(); await expect(room.locator('.btext')).toHaveCount(5);
    }
  }
  await expect(room.locator('.btext button')).toHaveCount(0);
  await expect(page.locator('#starCount')).toHaveText('0');
  await room.getByRole('button',{name:'完成课文',exact:true}).click();
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  await expect(page.locator('#starCount')).toHaveText('1');
  await room.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();
  await expect(page.getByRole('button',{name:'先看故事',exact:true})).toHaveCount(0);
});

test('教材四张国籍卡、十五幅复数图、A六题和B十二组问答完整，可打印真实A4练习纸', async ({page})=>{
  const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});
  await page.goto('/unit15-16/#learn/models');const room=page.locator('.stage-models');
  await room.getByText('看看四张国籍卡',{exact:true}).click();
  await expect(room.locator('.nationality-models strong')).toHaveText(['Russian','English','American','Dutch'].map(x=>'Are you '+x+'? → Yes, we are.'));
  await room.getByText('看看成双的物品',{exact:true}).click();
  const pairs=[['books','red'],['shirts','white'],['coats','grey'],['tickets','yellow'],['suits','blue'],['hats','black and grey'],['passports','green'],['umbrellas','black'],['handbags','white'],['ties','orange'],['dogs','brown and white'],['pens','blue'],['cars','red'],['dresses','green'],['blouses','yellow']];
  await expect(room.locator('.colour-gallery strong')).toHaveText(pairs.map(([o,c])=>o+' · '+c));
  await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  await room.locator('.colour-gallery').screenshot({path:'output/playwright/unit15-16/plural-gallery-desktop.png'});
  await expect(room.locator('.reference-card button')).toHaveCount(0);
  await room.getByText('看看完整问答',{exact:true}).click();
  await expect(room.locator('.reply-models strong')).toHaveText(pairs.slice(1,13).map(([o,c])=>'What colour are your '+o+'? Our '+o+' are '+c+'.'));
  await room.getByText('a 还是 an？',{exact:true}).click();
  await expect(room.locator('.article-models li')).toHaveText(['It is an English car.','It is a Japanese car.','It is an Italian car.','It is a French car.','It is an American car.','Robert is not a teacher.']);
  await room.getByRole('button',{name:'下一站：单词变一变',exact:true}).click();await expect(page).toHaveURL(/#learn\/forms$/);
  await page.goto('/unit15-16/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();
  await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(['It is ___ English car.','It is ___ Japanese car.','It is ___ Italian car.','It is ___ French car.','It is ___ American car.','Robert is not ___ teacher.']);
  await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(pairs.slice(1,13).map(([o,c])=>o+' / '+c));
  await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();
  await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(24);
  const pdf=await page.pdf({path:'output/playwright/unit15-16/writing-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  expect(audio).toEqual([]);
});

test('教材图册蓝套装、白手提包、红汽车与可见文字相符',async({page})=>{
  await page.goto('/unit15-16/#learn/models');await page.getByText('看看成双的物品',{exact:true}).click();
  for(const [label,colour] of [['suits · blue','blue'],['handbags · white','white'],['cars · red','red']]){
    const img=page.locator('.colour-gallery .reference-card').filter({hasText:label}).locator('img');
    await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
    // Read the actual picture shown in the page, not asset filenames or answer data.
    const share=await img.evaluate((el,colour)=>{
      const canvas=document.createElement('canvas');canvas.width=el.naturalWidth;canvas.height=el.naturalHeight;
      const ctx=canvas.getContext('2d');ctx.drawImage(el,0,0);const px=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let opaque=0,matched=0;
      for(let i=0;i<px.length;i+=4){if(px[i+3]<220)continue;opaque++;const[r,g,b]=[px[i],px[i+1],px[i+2]];
        if(colour==='blue'?b>r*1.15&&b>g*1.1:colour==='red'?r>b*1.5&&r>g*1.25:r>230&&g>230&&b>230)matched++;
      }return matched/opaque;
    },colour);
    expect(share,label+' 的实际填色').toBeGreaterThan(.25);
  }
});
