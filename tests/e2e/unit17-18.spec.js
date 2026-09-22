'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('导航进入办公室探访记，先看音标词卡，整卡翻义无需配音',async({page})=>{
  const audio=[],errors=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await page.getByRole('link',{name:'开始学习：办公室探访记',exact:true}).click();
  await expect(page).toHaveURL(/\/unit17-18\/#learn\/words$/);
  const room=page.getByRole('region',{name:'职业小图鉴',exact:true});
  await expect(room.getByRole('button',{name:'上一组词卡',exact:true})).toBeDisabled();
  const card=room.getByRole('button',{name:'employee',exact:true});await expect(card).toContainText('/ɪmˈplɔɪiː/');
  await card.click();await expect(card.locator('.word-meaning')).toHaveText('雇员；员工');await expect(card).toHaveAccessibleDescription('雇员；员工');
  await card.click();await expect(card.locator('.word-meaning')).toBeHidden();
  await expect(page.locator('#starCount')).toHaveText('0');expect(audio).toEqual([]);expect(errors).toEqual([]);
});

const {DIALOGUE,SPEAKERS,ANSWERS,completeStory,completeActivity,completeUnit1718}=require('../support/unit17-18-flow');
test('配套练习无需任何配音，22题与完整原文通关，领取并导出准确的课堂证书', async ({ page }) => {
  test.setTimeout(45000);
  const audio=[],errors=[];
  await page.route(/\.(mp3|wav|ogg)(\?|$)/,route=>{audio.push(route.request().url());return route.abort();});
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{globalThis.voiceCalls=0;speechSynthesis.speak=()=>{globalThis.voiceCalls++;};});
  await page.goto('/unit17-18/#learn/certificate');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await completeUnit1718(page);
  expect(audio.every(url=>/\/assets\/feedback\//.test(url))).toBe(true);
  expect(await page.evaluate(()=>globalThis.voiceCalls)).toBe(0);expect(errors).toEqual([]);
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小介绍员');
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'办公室探访记纪念',exact:true});
  await expect(dialog).toContainText('完成 Lesson 17–18 课堂配套练习');
  await expect(dialog.locator('#certificateName')).toHaveText('小介绍员');
  const day=await dialog.locator('#certificateDate').innerText();
  await dialog.screenshot({path:'output/playwright/unit17-18/certificate-desktop.png'});
  const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();
  await(await download).saveAs('output/playwright/unit17-18/certificate-saved.png');
  const pdf=await page.pdf({path:'output/playwright/unit17-18/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});
  expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.keyboard.press('Escape');await page.reload();
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  await expect(dialog.locator('#certificateDate')).toHaveText(day);
});


test('8个词各一次，错答可改，最后三题刷新不代答，重练清本轮并保留星星', async ({ page }) => {
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route=>route.abort());
  await page.goto('/unit17-18/#learn/listen'); const room=page.locator('.stage-listen');
  await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
  for(const [i,answer] of ANSWERS.listen.entries()) {
    await expect(room).toContainText('第 '+(i+1)+' / 8 题');
    if(i>=5) await page.reload();
    const check=room.getByRole('button',{name:'检查答案',exact:true});
    await expect(check).toBeDisabled(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i));
    await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
    if(i===0) {
      await room.getByRole('button',{name:'老板',exact:true}).click(); await check.click();
      await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
      await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
      await room.getByRole('button',{name:'再试一次',exact:true}).click();
    }
    await room.getByRole('button',{name:answer,exact:true}).click(); await check.click();
    await expect(room.getByRole('status')).toContainText('答对了！');
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    await room.getByRole('button',{name:i===7?'完成这一站':'下一题',exact:true}).click();
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click(); await page.reload();
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('无音频时逐句读完16句原文，历史中文可展开，刷新续读且看完才解锁理解题', async ({ page }) => {
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route=>route.abort());
  await page.goto('/unit17-18/#learn/roles');
  await expect(page.getByRole('region',{name:'故事小侦探',exact:true}).getByRole('button',{name:'先看故事',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'先看故事',exact:true}).click();
  const room = page.getByRole('region',{name:'办公室小剧场',exact:true});
  await expect(room).toContainText('Michael 和 Jeremy 是做什么工作的？');
  for(let i=0;i<DIALOGUE.length;i++) {
    await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0,i+1));
    await expect(room.locator('.bname')).toHaveText(SPEAKERS.slice(0,i+1));
    await expect(room.locator('.dialogue-actor.is-current')).toHaveText(SPEAKERS[i]);
    await expect(room.getByRole('status')).toHaveText((i+1)+' / 16 句');
    if(i===4) {
      await room.getByRole('button',{name:'看中文',exact:true}).first().click();
      await expect(room.locator('.bcn').first()).toHaveText('来见见我们的雇员吧，理查兹先生。');
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


test('30张词卡默认有准确音标，所有图片完整加载，末组有下一站且刷新续页',async({page})=>{
  const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});
  await page.goto('/unit17-18/#learn/words');const room=page.locator('.stage-words');
  const words=['employee','hard-working','sales rep','man','office','assistant','office assistant','woman','men','women','those','their','these','busy','lazy','job','keyboard operator','mechanic','engineer','hairdresser','teacher','customs officer','taxi driver','nurse','air hostess','housewife','milkman','postman','policeman','policewoman'];
  const ph=['/ɪmˈplɔɪiː/','/ˌhɑːrdˈwɝːkɪŋ/','/ˈseɪlz ˌrep/','/mæn/','/ˈɑːfɪs/','/əˈsɪstənt/','/ˈɑːfɪs əˈsɪstənt/','/ˈwʊmən/','/men/','/ˈwɪmɪn/','/ðoʊz/','/ðer/','/ðiːz/','/ˈbɪzi/','/ˈleɪzi/','/dʒɑːb/','/ˈkiːbɔːrd ˌɑːpəreɪt̬ɚ/','/məˈkænɪk/','/ˌendʒɪˈnɪr/','/ˈherˌdresɚ/','/ˈtiːtʃɚ/','/ˈkʌstəmz ˌɑːfɪsɚ/','/ˈtæksi ˌdraɪvɚ/','/nɝːs/','/ˈer ˌhoʊstɪs/','/ˈhaʊswaɪf/','/ˈmɪlkmən/','/ˈpoʊstmən/','/pəˈliːsmən/','/pəˈliːsˌwʊmən/'];
  for(let p=0;p<5;p++){
    await expect(room.locator('.unit-word strong')).toHaveText(words.slice(p*6,p*6+6));
    await expect(room.locator('.word-phonetic')).toHaveText(ph.slice(p*6,p*6+6));
    await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
    for(const card of await room.locator('.unit-word').all()){await card.click();await expect(card.locator('.word-meaning')).toBeVisible();await card.click();await expect(card.locator('.word-meaning')).toBeHidden();}
    if(p<4)await room.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  await page.reload();await expect(room).toContainText('5 / 5');await room.getByRole('button',{name:'下一站：单词寻宝',exact:true}).click();await expect(page).toHaveURL(/#learn\/listen$/);expect(audio).toEqual([]);
});

test('15组职业、A六题、B十组与数字材料完整，纸笔练习打印为一页A4',async({page})=>{
  const audio=[];page.on('request',r=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(r.url()))audio.push(r.url());});
  await page.goto('/unit17-18/#learn/models');const room=page.locator('.stage-models');
  await room.getByText('看看成双的职业',{exact:true}).click();
  await expect(room.locator('.job-gallery strong')).toHaveText(['sales reps','keyboard operators','mechanics','engineers','hairdressers','teachers','customs officers','taxi drivers','nurses','air hostesses','housewives','milkmen','postmen','policemen','policewomen']);
  await expect.poll(()=>room.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  await room.locator('.job-gallery').screenshot({path:'output/playwright/unit17-18/plural-gallery-desktop.png'});
  await expect(room.locator('.reference-card button')).toHaveCount(0);
  const pairs=[['keyboard operators','air hostesses'],['postmen','policemen'],['policewomen','nurses'],['customs officers','hairdressers'],['hairdressers','teachers'],['engineers','taxi drivers'],['policewomen','keyboard operators'],['milkmen','engineers'],['policemen','milkmen'],['nurses','housewives']];
  await room.getByText('看看完整问答',{exact:true}).click();
  await expect(room.locator('.reply-models strong')).toHaveText(pairs.map(([a,b])=>`What are their jobs? Are they ${a} or ${b}? They aren't ${a}. They're ${b}.`));
  const refs=['That man is tall. ___ is a policeman.','Those girls are busy. ___ are keyboard operators.','Our names are Britt and Inge. ___ are Swedish.','Look at our office assistant. ___ is very hard-working.','Look at Nicola. ___ is very pretty.','Michael Baker and Jeremy Short are employees. ___ are sales reps.'];
  await room.getByText('He、She、We 还是 They？',{exact:true}).click();await expect(room.locator('.pronoun-models li')).toHaveText(refs.map((x,i)=>x.replace('___',['He','They','We','He','She','They'][i])));
  await expect(room).toContainText('不按职业或姓名猜性别');
  await room.getByText('跟老师读数字',{exact:true}).click();await expect(room).toContainText('100 · 200 · 300 · 400 · 500 · 600 · 700 · 800 · 900 · 1,000 · 1,001 · 1,002 · 1,003 · 1,004 · 1,005');
  await room.getByRole('button',{name:'下一站：单词变一变',exact:true}).click();await expect(page).toHaveURL(/#learn\/forms$/);
  await page.goto('/unit17-18/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();
  await expect(page.locator('.reference-writing li>span:first-child')).toHaveText(refs);await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(pairs.map(([a,b])=>'('+a+') / '+b));
  await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();
  await page.emulateMedia({media:'print'});await expect(page.locator('#unitWriting .writing-rule')).toHaveCount(60);
  const pdf=await page.pdf({path:'output/playwright/unit17-18/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);expect(audio).toEqual([]);
});

test('用完整语境区别不很忙与懒惰，保留教师带读而不冒记听力成绩',async({page})=>{
  await page.goto('/unit17-18/#learn/phrases');const room=page.locator('.stage-phrases');
  await room.getByText('把话放回故事里',{exact:true}).click();await expect(room).toContainText('只表示他们不很忙，不能据此判断他们懒惰');await expect(room).toContainText('不是对某一种职业或性别的评价');
  await completeStory(page);await page.goto('/unit17-18/#learn/roles');const roles=page.locator('.stage-roles');
  for(const answer of ANSWERS.roles.slice(0,2)){await roles.getByRole('button',{name:answer,exact:true}).click();await roles.getByRole('button',{name:'检查答案',exact:true}).click();await roles.getByRole('button',{name:'下一题',exact:true}).click();}
  await roles.getByRole('button',{name:'他们很懒',exact:true}).click();await roles.getByRole('button',{name:'检查答案',exact:true}).click();await expect(roles.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(roles.locator('.practice-options .is-correct')).toHaveCount(0);
  await roles.getByRole('button',{name:'再试一次',exact:true}).click();await roles.getByRole('button',{name:'他们不很忙',exact:true}).click();await roles.getByRole('button',{name:'检查答案',exact:true}).click();await expect(roles.getByRole('status')).toContainText('答对了！');
});
