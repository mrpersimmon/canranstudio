'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

const nounAnswers=['handbag','pen','pencil','book','watch','coat','dress','skirt','shirt','car','house'];
async function answer(room,value,next='下一题') {
  if(Array.isArray(value)) for(const token of value) await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();
  else await room.locator('.practice-options').getByRole('button',{name:value,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status').filter({hasText:'答对了！'})).toBeVisible();
  if(next) await room.getByRole('button',{name:next,exact:true}).click();
}

async function finishGroup(page,id,values,final='完成这一站') {
  await page.goto('/unit1-2/#learn/'+id);
  const room=page.locator('.stage-'+id);
  for(let i=0;i<values.length;i++)await answer(room,values[i],i===values.length-1?final:'下一题');
  return room;
}

async function audioBoundary(page, automatic = true) {
  await page.addInitScript(automatic => {
    window.unitAudio = [];
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; this.paused = true; }
      play() { this.paused = false; window.unitAudio.push(this); if (automatic) queueMicrotask(() => this.dispatchEvent(new Event('ended'))); return Promise.resolve(); }
      pause() { this.paused = true; }
    };
  }, automatic);
}

test('Lesson 1–2 可回看课文，先听完整七句再回答归属问题，历史重听不替当前句完成', async ({ page }) => {
  await audioBoundary(page, false);
  await page.goto('/unit1-2/');
  await expect(page.getByRole('heading', {name:'礼貌小帮手',exact:true})).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.getByRole('button', {name:'开始冒险',exact:true}).click();
  await expect(page).toHaveURL(/#learn\/words$/);
  await page.getByRole('link', {name:'手提包的故事',exact:true}).click();
  const story=page.getByRole('region',{name:'相遇小剧场',exact:true});
  const detective=page.getByRole('region',{name:'故事小侦探',exact:true});
  await expect(detective.getByRole('button',{name:'对面的女士',exact:true})).toHaveCount(0);
  await story.getByRole('button',{name:'开始听课文',exact:true}).click();
  await expect(story.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();
  await page.evaluate(()=>window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  await story.getByRole('button',{name:'下一句',exact:true}).click();
  await story.getByRole('button',{name:'Excuse me!',exact:true}).click();
  await page.evaluate(()=>window.unitAudio[1].dispatchEvent(new Event('ended')));
  await page.evaluate(()=>window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  await expect(story.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();
  await page.reload();
  await expect(story.locator('.bubble-row')).toHaveCount(2);
  await story.getByRole('button',{name:'Yes?',exact:true}).click();
  await page.evaluate(()=>window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  for(let i=2;i<7;i++){
    await story.getByRole('button',{name:'下一句',exact:true}).click();
    await page.evaluate(()=>window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  }
  await expect(story.locator('.btext')).toHaveText(['Excuse me!','Yes?','Is this your handbag?','Pardon?','Is this your handbag?','Yes, it is.','Thank you very much.']);
  await expect(detective.getByRole('button',{name:'对面的女士',exact:true})).toHaveCount(0);
  await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
  await story.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();
  await expect(detective.getByRole('heading',{name:'男士问“Is this your handbag?”，这里的 your 指谁？',exact:true})).toBeVisible();
  await expect(detective.getByRole('button',{name:'对面的女士',exact:true})).toBeEnabled();
});

test('22 题与七句原文构成完整单元，礼貌与指代不误教，末题结算后才能领取和保存证书',async({page})=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await audioBoundary(page);
  await page.goto('/unit1-2/#learn/certificate');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'继续：听音寻宝',exact:true}).click();
  const listening=page.locator('.stage-listen');
  for(let i=0;i<nounAnswers.length;i++){
    await listening.getByRole('button',{name:'听一遍',exact:true}).click();
    await answer(listening,nounAnswers[i],i===10?'完成这一站':'下一题');
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  await listening.getByRole('button',{name:'下一站：相遇小剧场',exact:true}).click();
  await expect(page).toHaveURL(/#learn\/text$/);
  const story=page.locator('.stage-text');
  await story.getByRole('button',{name:'开始听课文',exact:true}).click();
  for(let i=1;i<7;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
  await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
  await story.getByRole('button',{name:'下一站：故事小侦探',exact:true}).click();
  await expect(page).toHaveURL(/#learn\/roles$/);
  const detective=await finishGroup(page,'roles',['对面的女士','手提包']);
  await expect(page.locator('#starCount')).toHaveText('6');
  await detective.getByRole('button',{name:'下一站：礼貌小锦囊',exact:true}).click();
  const phrases=page.locator('.stage-phrases');
  await expect(phrases.getByRole('button',{name:'Yes?',exact:true})).toContainText('什么事');
  await expect(phrases.getByRole('button',{name:'Yes, it is.',exact:true})).toContainText('确认');
  await phrases.getByRole('button',{name:'下一站：帮忙还手提包',exact:true}).click();
  const manners=page.locator('.stage-manners');
  await manners.getByRole('button',{name:'Pardon?',exact:true}).click();
  await manners.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(manners.getByRole('status')).toHaveText('再看看，试一次。');
  await manners.getByRole('button',{name:'再试一次',exact:true}).click();
  await finishGroup(page,'manners',['Excuse me!','Is this your handbag?','女士',['Thank','you','very','much.']]);
  await finishGroup(page,'ask',['手表']);
  await finishGroup(page,'trans',[['Is','this','your','pen?'],['Yes,','it','is.']]);
  await expect(page.locator('#starCount')).toHaveText('12');
  await page.goto('/unit1-2/#learn/certificate');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'继续：礼貌小挑战',exact:true}).click();
  const exam=page.locator('.stage-exam');
  const values=['Yes?','Yes, it is. Thank you very much.'];
  for(let i=0;i<values.length;i++){
    await answer(exam,values[i],i===values.length-1?null:'下一题');
    if(i===1)await page.reload();
  }
  await expect(exam.getByRole('progressbar')).toHaveAttribute('aria-valuenow','2');
  await expect(page.locator('#starCount')).toHaveText('12');
  await exam.getByRole('button',{name:'查看本次记录',exact:true}).click();
  await expect(exam).toContainText('首次独立答对 2 / 2');
  await expect(page.locator('#starCount')).toHaveText('15');
  await exam.getByRole('button',{name:'下一站：我的单元证书',exact:true}).click();
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小小礼貌员');
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const certificate=page.getByRole('dialog',{name:'礼貌小帮手纪念',exact:true});
  await expect(certificate.getByRole('heading',{name:'礼貌小达人',exact:true})).toBeVisible();
  await expect(certificate).toContainText('小小礼貌员');
  await expect(certificate).toContainText('完成 Lesson 1–2 单元练习');
  await expect(certificate.getByRole('list',{name:'我的五关徽章'}).getByRole('listitem')).toHaveCount(5);
  await expect(certificate.getByRole('list',{name:'我的五关徽章'}).getByRole('listitem')).toContainText(['身边的小物品','手提包的故事','开口有礼貌','问句小工坊','小帮手出发']);
  const download=page.waitForEvent('download');await certificate.getByRole('button',{name:'保存图片',exact:true}).click();
  const file=await download;expect(file.suggestedFilename()).toBe('Lesson1-2-礼貌小帮手.png');
  await file.saveAs('output/playwright/unit1-2-certificate.png');
  const bytes=require('node:fs').readFileSync('output/playwright/unit1-2-certificate.png');
  expect(bytes.readUInt32BE(16)).toBe(1440);expect(bytes.readUInt32BE(20)).toBe(1100);
  const band = await certificate.locator('.certificate-paper').evaluate(el => getComputedStyle(el, '::before').backgroundColor.match(/\d+/g).slice(0, 3).map(Number));
  const pixel = await require('sharp')(bytes).extract({left:100,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();
  expect([...pixel], '保存的纪念图片与页面使用同一单元主题').toEqual(band);
  await page.pdf({path:'output/playwright/unit1-2-certificate.pdf',preferCSSPageSize:true,printBackground:true});
  await certificate.getByRole('button',{name:'关闭',exact:true}).click();
  await page.context().storageState({path:'output/playwright/unit1-2-complete-state.json'});
  await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  await expect(certificate).toContainText('小小礼貌员');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'学习手记',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'学习手记',exact:true})).toContainText('修正后完成');
  await page.goto('/unit49-50/');await expect(page.locator('#starCount')).toHaveText('0');
  expect(errors).toEqual([]);
});

test('21 张词卡点读且功能词有语境，11 词听辨逐题提交、末题即时全绿、重练不代答',async({page})=>{
  test.setTimeout(60000);
  await audioBoundary(page);
  await page.goto('/unit1-2/#learn/words');
  const words=page.getByRole('region',{name:'物品小图鉴',exact:true});
  const allWords=[['handbag','pen','pencil','book','watch','coat'],['dress','skirt','shirt','car','house','excuse'],['me','yes','is','this','your','pardon'],['it','thank you','very much']];
  for(let group=0;group<4;group++){
    await expect(words.locator('.unit-word')).toHaveCount(allWords[group].length);
    for(const word of allWords[group]){
      const card=words.getByRole('button',{name:word,exact:true});
      await expect(card.locator('img')).toBeVisible();
      await card.click();await expect(card).toHaveAttribute('aria-expanded','true');
    }
    if(group<3)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  await expect(words.getByRole('button',{name:'it',exact:true})).toContainText('本句指手提包');
  await page.reload();await expect(words.locator('.unit-word')).toHaveCount(3);
  await expect(words.getByRole('button',{name:'上一组词卡',exact:true})).toBeEnabled();
  await words.getByRole('button',{name:'下一站：听音寻宝',exact:true}).click();
  const room=page.getByRole('region',{name:'听音寻宝',exact:true});
  await expect(room.getByRole('button',{name:'给点线索',exact:true})).toHaveCount(0);
  for(let i=0;i<nounAnswers.length;i++){
    await expect(room).toContainText(`第 ${i+1} / 11 题`);
    await expect(room.getByRole('button',{pressed:true})).toHaveCount(0);
    await room.getByRole('button',{name:nounAnswers[i],exact:true}).click();
    await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
    await room.getByRole('button',{name:'听一遍',exact:true}).click();
    await answer(room,nounAnswers[i],null);
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
    if(i<10) await room.getByRole('button',{name:'下一题',exact:true}).click();
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  await room.getByRole('button',{name:'完成这一站',exact:true}).click();
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(room.getByRole('group',{name:'完成后的操作',exact:true}).getByRole('button')).toHaveCount(2);
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();
  await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});
