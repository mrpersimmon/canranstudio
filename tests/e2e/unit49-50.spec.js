'use strict';
const { test, expect } = require('@playwright/test');
const { submitSubject } = require('../support/l49-subject-flow');
const { unitSubjectAnswers: subjectAnswers } = require('../support/unit49-50-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

const listeningAnswers = ['butcher','meat','beef','lamb','mutton','steak','mince','chicken','pork','fish','husband','tell','truth','either','tomato','potato','cabbage','lettuce','pea','bean','pear','grape','peach'];
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
async function answer(room, value, next = '下一题') {
  if (Array.isArray(value)) for (const token of value) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  else await room.locator('.practice-options').getByRole('button', { name: value, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status').filter({ hasText: '答对了！' })).toBeVisible();
  if (next) await room.getByRole('button', { name: next, exact: true }).click();
}
async function finishGroup(page, id, values, finalLabel = '完成这一站') {
  await page.goto('/unit49-50/#learn/' + id);
  const room = page.locator('.stage-' + id);
  for (let i = 0; i < values.length; i++) await answer(room, values[i], i === values.length - 1 ? finalLabel : '下一题');
  return room;
}

test('两课共用一个采购单元与词卡，旧课满星不会完成新单元', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }));
    localStorage.setItem('l50-stars-v1', JSON.stringify({ l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 }));
  });
  await page.goto('/unit49-50/');
  await expect(page.getByRole('heading', { name: '晚餐采购大冒险', exact: true })).toBeVisible();
  await expect(page.getByText('新概念英语 · Lesson 49–50', { exact: true })).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.getByRole('button', { name: '开始采购', exact: true }).click();
  const words = page.getByRole('region', { name: '采购小图鉴', exact: true });
  await expect(words.getByRole('button', { name: 'butcher', exact: true })).toBeVisible();
  await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  const tomato = words.getByRole('button', { name: 'tomato', exact: true });
  await expect(tomato).toBeVisible();
  await tomato.click();
  await expect(tomato).toHaveAttribute('aria-expanded', 'true');
  await expect(tomato).toContainText('西红柿');
  await page.reload();
  await expect(words.getByRole('button', { name: 'tomato', exact: true })).toBeVisible();
  await page.goto('/unit49-50/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await page.goto('/lesson49/#learn/certificate');
  await expect(page.locator('#starCount')).toHaveText('15');
});

test('23 词连续听辨，新加入的词必须逐题作答，末题主动完成，重练不代答', async ({ page }) => {
  test.setTimeout(90000);
  await audioBoundary(page);
  await page.goto('/unit49-50/#learn/listen');
  const room = page.getByRole('region', { name: '听音寻宝', exact: true });
  await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
  for (let i = 0; i < listeningAnswers.length; i++) {
    await expect(room).toContainText(`第 ${i + 1} / 23 题`);
    await expect(room.getByRole('button', { pressed: true })).toHaveCount(0);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    const option = room.getByRole('button', { name: listeningAnswers[i], exact: true });
    expect(await option.locator('img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await option.click();
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await room.getByRole('button', { name: '听一遍', exact: true }).click();
    await answer(room, listeningAnswers[i], i === 22 ? null : '下一题');
    if (i === 13) await page.reload();
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  await room.getByRole('button', { name: '完成这一站', exact: true }).click();
  await expect(page.locator('#starCount')).toHaveText('3');
  const actions = room.getByRole('group', { name: '完成后的操作', exact: true });
  await expect(actions.getByRole('button')).toHaveCount(2);
  await expect(actions.getByRole('button', { name: '下一站：老板与客人', exact: true })).toBeVisible();
  await actions.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room).toContainText('第 1 / 23 题');
  await expect(room.getByRole('button', { pressed: true })).toHaveCount(0);
  await page.reload();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('课文必须听完再进入理解题，历史点读与刷新不代替当前句', async ({ page }) => {
  await audioBoundary(page, false);
  await page.goto('/unit49-50/#learn/roles');
  const roles = page.locator('.stage-roles');
  await expect(roles.getByRole('button', { name: 'steak', exact: true })).toHaveCount(0);
  await roles.getByRole('button', { name: '先听故事', exact: true }).click();
  const room = page.locator('.stage-text');
  await room.getByRole('button', { name: '开始听课文', exact: true }).click();
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await page.evaluate(() => window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  await room.getByRole('button', { name: '下一句', exact: true }).click();
  await room.getByRole('button', { name: 'Do you want any meat today, Mrs. Bird?', exact: true }).click();
  await page.evaluate(() => window.unitAudio[1].dispatchEvent(new Event('ended')));
  await page.evaluate(() => window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await page.reload();
  await expect(room.locator('.bubble-row')).toHaveCount(2);
  await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await room.getByRole('button', { name: 'Yes, please.', exact: true }).click();
  await page.evaluate(() => window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  for (let i = 2; i < 11; i++) {
    await room.getByRole('button', { name: '下一句', exact: true }).click();
    await page.evaluate(() => window.unitAudio.at(-1).dispatchEvent(new Event('ended')));
  }
  await room.getByRole('button', { name: '完成课文学习', exact: true }).click();
  await expect(room.locator('.bubble-row')).toHaveCount(11);
  await room.getByRole('button', { name: '下一站：故事小侦探', exact: true }).click();
  await expect(roles.getByRole('button', { name: 'steak', exact: true })).toBeVisible();
  await finishGroup(page, 'roles', ['steak','Beef, please.',"To tell you the truth, Mrs. Bird, I don't like chicken either.",'Lamb, please.']);
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('区分喜好与当前需求，并保留 Written A 的六种否定结构', async ({ page }) => {
  await page.goto('/unit49-50/#learn/needs');
  const room = page.locator('.stage-needs');
  await expect(room).toContainText('Penny 喜欢西红柿，但这次不想买。哪句话符合？');
  await room.getByRole('button', { name: 'She likes tomatoes, and she wants some.', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toContainText('喜欢不等于这次想要');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await answer(room, "She likes tomatoes, but she doesn't want any.");
  await answer(room, "I like potatoes, but I don't want any.");
  await answer(room, 'Yes, he does.');
  await answer(room, "No, I don't.", '完成这一站');
  await finishGroup(page, 'choice', ["don't","doesn't","isn't","can't","aren't",'am not']);
  await page.getByRole('button', { name: '采购手记', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('修正后完成');
  await expect(page.getByRole('dialog')).toContainText('be 的否定');
});

test('从空记录完成整个单元，只有末站结算后领证，保存与打印同一张单元证书', async ({ page }) => {
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await audioBoundary(page);
  await page.goto('/unit49-50/#learn/listen');
  const listening=page.locator('.stage-listen');
  for(let i=0;i<listeningAnswers.length;i++){
    await listening.getByRole('button',{name:'听一遍',exact:true}).click();
    await answer(listening,listeningAnswers[i],i===22?'完成这一站':'下一题');
  }
  await listening.getByRole('button',{name:'下一站：老板与客人',exact:true}).click();
  const story=page.locator('.stage-text');
  await story.getByRole('button',{name:'开始听课文',exact:true}).click();
  for(let i=1;i<11;i++)await story.getByRole('button',{name:'下一句',exact:true}).click();
  await story.getByRole('button',{name:'完成课文学习',exact:true}).click();
  await finishGroup(page,'roles',['steak','Beef, please.',"To tell you the truth, Mrs. Bird, I don't like chicken either.",'Lamb, please.']);
  await finishGroup(page,'doare',['Do you like meat?','Are you a teacher?','Does Penny like tomatoes?','Do you like peas?','Does she want peaches?']);
  await finishGroup(page,'give',['Mrs. Bird','that piece','Give that piece to me, please.',['Give','that piece','to','me,','please.']]);
  await finishGroup(page,'needs',["She likes tomatoes, but she doesn't want any.","I like potatoes, but I don't want any.",'Yes, he does.',"No, I don't."]);
  await finishGroup(page,'pouch',['To tell you the truth']);
  await finishGroup(page,'either',['I like steak, too.',"I don't like chicken either.",'I am not at home either.']);
  await page.goto('/unit49-50/#learn/subjects');
  for(const value of subjectAnswers)await submitSubject(page.locator('.stage-subjects'),value);
  await finishGroup(page,'fill',['likes','like','watches','goes']);
  await finishGroup(page,'choice',["don't","doesn't","isn't","can't","aren't",'am not']);
  await finishGroup(page,'trans',[['She','likes','peaches.'],['She',"doesn't",'want','any tomatoes.'],['Does','he','like','grapes?']]);
  await expect(page.locator('#starCount')).toHaveText('12');
  await page.goto('/unit49-50/#learn/certificate');
  await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'继续：采购小挑战',exact:true}).click();
  const exam=page.locator('.stage-exam');
  const examAnswers=['mince','Mrs. Bird: lamb · husband: steak','cabbage','I like chicken.','likes 改为 like'];
  for(let i=0;i<examAnswers.length;i++){
    if(i===0)await exam.getByRole('button',{name:'听一遍',exact:true}).click();
    await answer(exam,examAnswers[i],i===examAnswers.length-1?null:'下一题');
    if(i===2)await page.reload();
  }
  await expect(page.locator('#starCount')).toHaveText('12');
  await exam.getByRole('button',{name:'查看本次记录',exact:true}).click();
  await expect(page.locator('#starCount')).toHaveText('15');
  await expect(exam).toContainText('首次独立答对 5 / 5');
  await exam.getByRole('button',{name:'下一站：我的单元证书',exact:true}).click();
  await page.reload();
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('小小采购员');
  await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
  const certificate=page.getByRole('dialog',{name:'采购纪念',exact:true});
  await expect(certificate.getByRole('heading',{name:'晚餐采购小达人',exact:true})).toBeVisible();
  await expect(certificate.getByRole('list',{name:'我的五关徽章',exact:true}).getByRole('listitem')).toHaveCount(5);
  await expect(certificate).toContainText('小小采购员');
  await expect(certificate).toContainText('完成 Lesson 49–50 单元练习');
  const download=page.waitForEvent('download');
  await certificate.getByRole('button',{name:'保存图片',exact:true}).click();
  const file=await download;expect(file.suggestedFilename()).toBe('Lesson49-50-采购纪念.png');
  await file.saveAs('output/playwright/unit49-50-certificate.png');
  await page.evaluate(()=>{window.unitPrints=0;window.print=()=>window.unitPrints++;});
  await certificate.getByRole('button',{name:'打印证书',exact:true}).click();
  expect(await page.evaluate(()=>window.unitPrints)).toBe(1);
  await page.emulateMedia({media:'print'});
  await expect(page.locator('#topbar')).toBeHidden();
  await expect(certificate.locator('.certificate-paper')).toBeVisible();
  await page.emulateMedia({media:'screen'});
  await certificate.getByRole('button',{name:'关闭',exact:true}).click();
  await expect(certificate).toBeHidden();
  await page.goto('/lesson50/');await expect(page.locator('#starCount')).toHaveText('0');
  await page.goto('/lesson49/');await expect(page.locator('#starCount')).toHaveText('0');
  expect(errors).toEqual([]);
});

test('电脑和平板手机布局不溢出，翻组后新词卡可见，结束动作集中排列', async ({ page }) => {
  test.setTimeout(90000);
  for(const width of [1280,768,390,320]){
    await page.setViewportSize({width,height:740});
    await page.goto('/unit49-50/#learn/words');
    await page.evaluate(()=>document.fonts.ready);
    const words=page.locator('.stage-words');
    const next=words.getByRole('button',{name:'下一组词卡',exact:true});
    await next.click();
    await expect(words.locator('.unit-word').first()).toBeInViewport();
    await expect(words.locator('.stage-heading')).toBeInViewport();
    for(let i=0;i<3;i++)if(await next.isVisible())await next.click();
    await expect(words.getByRole('button',{name:'下一站：听音寻宝',exact:true})).toBeEnabled();
    const controlsTop=await words.locator('.word-controls').evaluate(el=>el.getBoundingClientRect().top+scrollY);
    await words.getByRole('button',{name:'a pound of mince',exact:true}).click();
    expect(await words.locator('.word-controls').evaluate(el=>el.getBoundingClientRect().top+scrollY)).toBeCloseTo(controlsTop,0);
    await words.screenshot({path:`output/playwright/unit49-50-words-${width}.png`});
    await page.goto('/unit49-50/#learn/needs');
    const room=page.locator('.stage-needs');
    await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
    const scene=await room.locator('.practice-scene').boundingBox(),box=await room.boundingBox();
    expect(Math.abs(scene.x+scene.width/2-box.x-box.width/2)).toBeLessThan(3);
    const actions=room.getByRole('group',{name:'作答操作',exact:true});
    const before=await actions.boundingBox();
    await room.getByRole('button',{name:'给点线索',exact:true}).click();
    const after=await actions.boundingBox();
    expect(Math.abs(after.height-before.height)).toBeLessThanOrEqual(1);
    const hint=await room.getByRole('button',{name:'给点线索',exact:true}).boundingBox(),check=await room.getByRole('button',{name:'检查答案',exact:true}).boundingBox();
    expect(hint.x+hint.width).toBeLessThan(check.x);
    await room.screenshot({path:`output/playwright/unit49-50-needs-${width}.png`});
    await page.goto('/unit49-50/#learn/pouch');
    const pouch=page.locator('.stage-pouch');
    await answer(pouch,'To tell you the truth','完成这一站');
    const finish=pouch.getByRole('group',{name:'完成后的操作',exact:true});
    await expect(finish.getByRole('button')).toHaveCount(2);
    for(const action of await finish.getByRole('button').all()){
      const rect=await action.boundingBox();expect(rect.x).toBeGreaterThanOrEqual(0);expect(rect.x+rect.width).toBeLessThanOrEqual(width);expect(rect.height).toBeGreaterThanOrEqual(44);
    }
    await finish.screenshot({path:`output/playwright/unit49-50-finish-${width}.png`});
    await finish.getByRole('button',{name:'再练一轮',exact:true}).click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    // Return to the first word group through its real controls for the next viewport.
    await page.goto('/unit49-50/#learn/words');
    const previous=words.getByRole('button',{name:'上一组词卡',exact:true});
    while(await previous.isEnabled())await previous.click();
  }
});

test('在长页直接操作另一站后，刷新和封面的继续按钮回到该站', async ({page})=>{
  await page.goto('/unit49-50/#learn/words');
  const room=page.locator('.stage-needs');
  await room.getByRole('button',{name:"She likes tomatoes, but she doesn't want any.",exact:true}).click();
  await expect(page).toHaveURL(/#learn\/needs$/);
  await page.reload();
  await expect(room.getByRole('button',{name:"She likes tomatoes, but she doesn't want any.",exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(room.locator('.stage-heading')).toBeInViewport();
  // The header now returns to the course directory. A bookmarked unit cover
  // remains a supported direct entry with its own resume control.
  await page.goto('/unit49-50/#cover');
  await page.reload();
  await page.getByRole('button',{name:'继续采购',exact:true}).click();
  await expect(page).toHaveURL(/#learn\/needs$/);
});

test('新增九词使用可播放的本地录音与完整图卡，听辨录音失败不能靠后备语音解锁检查', async ({page})=>{
  test.setTimeout(90000);
  await page.addInitScript(()=>{
    window.nativeEnds=[];const NativeAudio=window.Audio;
    window.Audio=class extends NativeAudio{constructor(src){super(src);this.addEventListener('ended',()=>window.nativeEnds.push(new URL(this.src).pathname));}};
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[],speak:utterance=>queueMicrotask(()=>utterance.onend?.()),cancel(){}}});
  });
  await page.goto('/unit49-50/#learn/words');
  const words=page.locator('.stage-words');
  const newWords=[['tomato','potato','cabbage','lettuce'],['pea','bean','pear','grape','peach']];
  for(let i=0;i<2;i++)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();
  for(let group=0;group<2;group++){
    for(const word of newWords[group]){
      const card=words.getByRole('button',{name:word,exact:true});
      expect(await card.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
      await card.click();
      await expect.poll(()=>page.evaluate(()=>window.nativeEnds)).toContain('/lesson50/audio/'+word+'.mp3');
    }
    if(group===0)await words.getByRole('button',{name:'下一组词卡',exact:true}).click();
  }
  let block=true;
  await page.route('**/lesson49/audio/butcher.mp3',route=>block?route.abort():route.continue());
  await page.goto('/unit49-50/#learn/listen');
  const room=page.locator('.stage-listen');
  await room.getByRole('button',{name:'butcher',exact:true}).click();
  await room.getByRole('button',{name:'听一遍',exact:true}).click();
  await expect(room).toContainText('播放未完成，请重听。');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  block=false;
  await room.getByRole('button',{name:'再听一遍',exact:true}).click();
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status').filter({hasText:'答对了！'})).toBeVisible();
});

test('采购挑战延续原课的标题旁暂停，暂停和继续保留本题选择', async ({page})=>{
  await page.goto('/unit49-50/#learn/exam');
  const room=page.locator('.stage-exam'),heading=room.locator('.stage-heading');
  await room.getByRole('button',{name:'mince',exact:true}).click();
  await heading.getByRole('button',{name:'暂停，稍后继续',exact:true}).click();
  await expect(room).toContainText('已暂停 · 第 1 / 5 题');
  await expect(heading.getByRole('button',{name:'暂停，稍后继续',exact:true})).toBeHidden();
  await page.reload();
  await room.getByRole('button',{name:'继续挑战',exact:true}).click();
  await expect(room.getByRole('button',{name:'mince',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  await expect(heading.getByRole('button',{name:'暂停，稍后继续',exact:true})).toBeVisible();
});

test('从长页直接切到另一活动时停止旧录音，迟到的结束事件不推进课文',async ({page})=>{
  await audioBoundary(page,false);
  await page.goto('/unit49-50/#learn/text');
  const story=page.locator('.stage-text');
  await story.getByRole('button',{name:'开始听课文',exact:true}).click();
  await page.locator('.stage-needs').getByRole('button',{name:"She likes tomatoes, but she doesn't want any.",exact:true}).click();
  expect(await page.evaluate(()=>window.unitAudio[0].paused)).toBe(true);
  await page.evaluate(()=>window.unitAudio[0].dispatchEvent(new Event('ended')));
  await expect(story.getByRole('button',{name:'下一句',exact:true})).toBeDisabled();
  await expect(page.locator('.stage-needs').getByRole('button',{name:'检查答案',exact:true})).toBeEnabled();
});
