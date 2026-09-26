'use strict';
const { test, expect } = require('@playwright/test');
const { DIALOGUE, SPEAKERS, ANSWERS, completeStory, completeActivity, completeUnit1314 } = require('../support/unit13-14-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

test('完整保留十幅配色图、A五组合句与B十二组问答，静态阅读和A4练习纸均无需配音', async ({ page }) => {
  const audio=[];page.on('request',request=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(request.url()))audio.push(request.url());});
  await page.goto('/unit13-14/#learn/phrases');
  await expect(page.locator('.stage-phrases .reference-card strong')).toHaveText(["What colour's your new dress?","It's the same colour.",'Come upstairs and see it.','That is a lovely hat!']);
  await page.getByRole('button',{name:'下一站：颜色说清楚',exact:true}).click();await expect(page).toHaveURL(/#learn\/colours$/);
  await page.goto('/unit13-14/#learn/models');
  const room=page.locator('.stage-models');
  const labels=['umbrella · black','car · blue','shirt · white','coat · grey','case · brown','carpet · red','blouse · yellow','tie · orange','hat · grey and black','dog · brown and white'];
  for(let i=0;i<labels.length;i++){await expect(room.locator('.colour-gallery strong')).toHaveText(labels[i]);if(i<9)await room.getByRole('button',{name:'下一幅配色图',exact:true}).click();}
  for(const img of await room.locator('img').all())expect(await img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  await expect(room.locator('.reference-card button')).toHaveCount(0);
  await room.getByText('看看完整问答',{exact:true}).click();
  const pairs=[['Steven','car','blue','His'],['Tim','shirt','white','His'],['Sophie','coat','grey','Her'],['Mrs. White','carpet','red','Her'],['Dave','tie','orange','His'],['Steven','hat','grey and black','His'],['Helen','dog','brown and white','Her'],['Hans','pen','green','His'],['Luming','suit','grey','His'],['Stella','pencil','blue','Her'],['Xiaohui','handbag','brown','Her'],['Sophie','skirt','yellow','Her']];
  for(let i=0;i<pairs.length;i++){const[owner,object,colour,pronoun]=pairs[i];await expect(room.locator('.reply-models strong')).toHaveText("What colour's "+owner+"'s "+object+"? "+pronoun+' '+object+"'s "+colour+'.');if(i<11)await room.getByRole('button',{name:'下一份问答',exact:true}).click();}
  await room.getByText('两句合一句',{exact:true}).click();
  await expect(room.locator('.merge-models strong')).toHaveText(["This is Paul's car.","This is Sophie's coat.","This is Helen's dog.","This is my father's suit.","This is my daughter's dress."]);
  await page.goto('/unit13-14/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();
  await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(['This is Paul. This is his car.','This is Sophie. This is her coat.','This is Helen. This is her dog.','This is my father. This is his suit.','This is my daughter. This is her dress.']);
  await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(pairs.map(([owner,object,colour,pronoun])=>owner+' / '+object+' / '+colour+' · '+(pronoun==='His'?'he':'she')));
  await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();
  await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(29);
  const pdf=await page.pdf({path:'output/playwright/unit13-14/writing-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  expect(audio).toEqual([]);
});

test('配套练习无需任何配音，34题与完整原文通关，领取并导出准确的课堂证书', async ({ page }) => {
  test.setTimeout(45000);
  const audio=[],errors=[];
  await page.route(/\.(mp3|wav|ogg)(\?|$)/,route=>{audio.push(route.request().url());return route.abort();});
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
  await page.goto('/unit13-14/#learn/certificate');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await completeUnit1314(page);
  expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);
  expect(await page.evaluate(()=>globalThis.voiceCalls)).toBe(0);expect(errors).toEqual([]);
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小配色师');
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'新衣配色屋纪念',exact:true});
  await expect(dialog).toContainText('完成 Lesson 13–14 课堂配套练习');
  await expect(dialog.locator('#certificateName')).toHaveText('小配色师');
  const day=await dialog.locator('#certificateDate').innerText();
  await dialog.screenshot({path:'output/playwright/unit13-14/certificate-desktop.png'});
  const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();
  await(await download).saveAs('output/playwright/unit13-14/certificate-saved.png');
  const pdf=await page.pdf({path:'output/playwright/unit13-14/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.keyboard.press('Escape');await page.reload();
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  await expect(dialog.locator('#certificateDate')).toHaveText(day);
});

test('从首页进入新衣配色屋，21张音标词卡可翻义翻页，全程不调用英语配音', async ({ page }) => {
  const audio = [], errors = [];
  page.on('request', request => { if (/\.(mp3|wav|ogg)(\?|$)/.test(request.url())) audio.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('link', { name: '开始学习：新衣配色屋', exact: true }).click();
  await expect(page).toHaveURL(/\/unit13-14\/#learn\/words$/);
  await expect(page.locator('#starCount')).toHaveText('0');
  const atlas = page.getByRole('region', { name: '配色小图鉴', exact: true });
  const words = ['colour','green','come','upstairs','smart','hat','same','lovely','case','carpet','dog','black','grey','brown','red','yellow','orange','blue','white','dress','new'];
  const phonetics = ['/ˈkʌlɚ/','/ɡriːn/','/kʌm/','/ʌpˈsterz/','/smɑːrt/','/hæt/','/seɪm/','/ˈlʌvli/','/keɪs/','/ˈkɑːrpət/','/dɑːɡ/','/blæk/','/ɡreɪ/','/braʊn/','/red/','/ˈjeloʊ/','/ˈɔːrɪndʒ/','/bluː/','/waɪt/','/dres/','/nuː/'];
  await expect(atlas.getByRole('button', { name: '上一组词卡', exact: true })).toBeDisabled();
  for (let p = 0; p < 4; p++) {
    for (let i = p * 6; i < Math.min(p * 6 + 6, words.length); i++) {
      const card = atlas.getByRole('button', { name: words[i], exact: true });
      await expect(card).toContainText(phonetics[i]);
      expect(await card.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      await card.click(); await expect(card.locator('.word-meaning')).toBeVisible();
      await card.click(); await expect(card.locator('.word-meaning')).toBeHidden();
    }
    if (p < 3) await atlas.getByRole('button', { name: '下一组词卡', exact: true }).click();
  }
  await page.reload(); await expect(atlas).toContainText('4 / 4');
  await atlas.getByRole('button', { name: '下一站：单词寻宝', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/listen$/);
  expect(audio).toEqual([]); expect(errors).toEqual([]);
});

test('17个新词各一次，错答可改，最后三题刷新不代答，重练清本轮并保留星星', async ({ page }) => {
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route=>route.abort());
  await page.goto('/unit13-14/#learn/listen'); const room=page.locator('.stage-listen');
  await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
  for(const [i,answer] of ANSWERS.listen.entries()) {
    await expect(room).toContainText('第 '+(i+1)+' / 17 题');
    if(i>=14) await page.reload();
    const check=room.getByRole('button',{name:'检查答案',exact:true});
    await expect(check).toBeDisabled(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
    await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
    if(i===0) {
      await room.getByRole('button',{name:'职业',exact:true}).click(); await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
      await room.getByRole('button',{name:'再试一次',exact:true}).click();
    }
    await room.getByRole('button',{name:answer,exact:true}).click(); await check.click();
    await expect(room.getByRole('status')).toContainText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    await room.getByRole('button',{name:i===16?'完成这一站':'下一题',exact:true}).click();
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click(); await page.reload();
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('无音频时逐句读完13句原文，历史中文可展开，刷新续读且看完才解锁理解题', async ({ page }) => {
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route=>route.abort());
  await page.goto('/unit13-14/#learn/roles');
  await expect(page.getByRole('region',{name:'故事小侦探',exact:true}).getByRole('button',{name:'先看故事',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'先看故事',exact:true}).click();
  const room = page.getByRole('region',{name:'新衣小剧场',exact:true});
  await expect(room).toContainText('Anna 的帽子是什么颜色？');
  for(let i=0;i<DIALOGUE.length;i++) {
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
    await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
    await expect(room.locator('.dialogue-actor.is-current')).toHaveText(SPEAKERS[i]);
    await expect(room.getByRole('status')).toHaveText((i+1)+' / 13 句');
    if(i===4) {
      await room.getByRole('button',{name:'看中文',exact:true}).first().click();
      await expect(room.locator('.bcn').first()).toHaveText('你的新连衣裙是什么颜色的？');
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
