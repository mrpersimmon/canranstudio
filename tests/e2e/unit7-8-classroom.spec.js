'use strict';
const { isFeedbackAudio } = require('../support/course-resource-urls');
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const { DIALOGUE, SPEAKERS, completeActivity, completeUnit78 } = require('../support/unit7-8-flow');
const { ANSWERS } = require('../fixtures/unit7-8-classroom-before/flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function blockVoices(page) {
  const requests = [];
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route => {
    if (isFeedbackAudio(route.request().url())) return route.continue();
    requests.push(route.request().url()); return route.abort();
  });
  return requests;
}

async function observeSound(page) {
  await page.addInitScript(() => {
    window.classroomSounds = []; window.classroomSpeechCalls = 0;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      const event = { src: this.src, ended: false }; window.classroomSounds.push(event);
      this.addEventListener('ended', () => { event.ended = true; }, { once: true });
      return Reflect.apply(play, this, args);
    };
    const speak = speechSynthesis.speak;
    speechSynthesis.speak = function (...args) { window.classroomSpeechCalls++; return Reflect.apply(speak, this, args); };
  });
}

test('课文无配音也能浏览全部原文、刷新续读并主动完成', async ({ page }) => {
  const requests = await blockVoices(page);
  await page.goto('/unit7-8/#learn/roles');
  await page.getByRole('button', { name: /先[听看]故事/ }).click();
  const story = page.locator('.stage-text');
  for (let i = 0; i < DIALOGUE.length; i++) {
    await story.getByRole('button', { name: i ? '下一句' : /开始[听看]课文/, exact: true }).click();
    await expect(story.locator('.btext span')).toHaveText(DIALOGUE.slice(0, i + 1));
    await expect(story.locator('.bname')).toHaveText(SPEAKERS.slice(0, i + 1));
    await expect(story.getByRole('button', { name: i === 15 ? '完成课文' : '下一句', exact: true })).toBeEnabled();
    if (i === 3) {
      await story.locator('.bubble-row').first().getByRole('button', { name: '看中文', exact: true }).click();
      await expect(story.locator('.bubble-row').first()).toContainText('我是一名新学生。');
      await page.reload();
      await expect(story.locator('.bubble-row')).toHaveCount(4);
    }
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(story.getByRole('button', { name: /听|播放/ })).toHaveCount(0);
  await expect(story.locator('button.btext')).toHaveCount(0);
  await story.getByRole('button', { name: '完成课文', exact: true }).click();
  await expect(story.getByText('故事看完了！', { exact: true })).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('1');
  await story.getByRole('button', { name: '下一站：朋友资料卡', exact: true }).click();
  await expect(page.locator('.stage-roles').getByRole('button', { name: "I'm an engineer.", exact: true })).toBeVisible();
  expect(requests).toEqual([]);
});

test('单词寻宝以13个新词的词义和图片作答，不需播放且末题刷新不代答', async ({ page }) => {
  const requests = await blockVoices(page);
  await page.goto('/unit7-8/#learn/listen');
  const room = page.locator('.stage-listen');
  const answers = ['意大利（人）的', 'keyboard operator', '工程师', 'policeman', 'policewoman', 'taxi driver', '女空乘', 'postman', 'nurse', '机械师；修理机器的人', 'hairdresser', '家庭主妇', 'milkman'];
  for (let i = 0; i < answers.length; i++) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled();
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i));
    await expect(room.getByRole('button', { name: /听一遍|给点线索/ })).toHaveCount(0);
    if (i === 0) {
      await expect(room.locator('.practice-content h3')).toContainText('Italian');
      expect(await room.locator('.practice-options').getByRole('button').allTextContents()).toEqual(expect.arrayContaining(['意大利（人）的', '法国（人）的', '德国（人）的']));
    }
    if (i === 1) {
      await expect(room.locator('.practice-scene')).toHaveAttribute('src', '/assets/unit7-8/keyboard-operator.svg');
      await expect(room.locator('.practice-options img')).toHaveCount(0);
      await expect(room.locator('.practice-content h3')).not.toContainText('keyboard operator');
    }
    if (i >= 11) {
      await page.reload();
      await expect(check).toBeDisabled();
      await expect(room.getByRole('button', { name: answers[i], exact: true })).toHaveAttribute('aria-pressed', 'false');
    }
    await room.getByRole('button', { name: answers[i], exact: true }).click();
    await expect(check).toBeEnabled(); await check.click();
    await expect(room.getByRole('status')).toContainText('答对了！');
    await room.getByRole('button', { name: i === 12 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(room.getByRole('heading', { name: '单词寻宝', exact: true })).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  expect(requests).toEqual([]);
});

test('图鉴和示范供阅读，挑战读英文作答，正误反馈音仍正常', async ({ page }) => {
  const requests = await blockVoices(page); await observeSound(page);
  await page.goto('/lesson/unit7-8/#learn/words');
  const words = page.locator('.stage-words');
  for (let i = 0; i < 2; i++) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  const card = words.getByRole('button', { name: 'I', exact: true });
  await expect(card).toContainText('/aɪ/'); await card.click();
  await expect(card.locator('.word-meaning')).toHaveText('我；说话的人指自己');
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  await card.click(); await expect(card.locator('.word-meaning')).toBeHidden();
  await page.reload(); await expect(words.locator('#wordPageProgress')).toHaveText('3 / 4');
  await page.goto('/lesson/unit7-8/#learn/phrases');
  const phrases = page.locator('.stage-phrases');
  await expect(phrases.getByRole('button', { name: 'What nationality are you?', exact: true })).toHaveCount(0);
  await expect(phrases.getByText('What nationality are you?', { exact: true })).toBeVisible();
  await phrases.getByText('am、is、are 怎么选', { exact: true }).click();
  await expect(phrases.getByText('My name is Xiaohui. I am Chinese.', { exact: true })).toBeVisible();
  await page.goto('/lesson/unit7-8/#learn/models');
  const models = page.locator('.stage-models');
  await expect(models.getByRole('button', { name: "I'm a nurse.", exact: true })).toHaveCount(0);
  await expect(models.getByText("I'm a nurse.", { exact: true })).toBeVisible();
  await expect(models.getByText('替图中人物问一问', { exact: true })).toBeHidden();
  await page.goto('/lesson/unit7-8/#learn/exam');
  const exam = page.locator('.stage-exam'), check = exam.getByRole('button', { name: '检查答案', exact: true });
  await expect(exam.locator('.practice-content h3')).toContainText("I'm Italian. I'm a nurse.");
  await expect(exam.getByRole('button', { name: /听一遍|再听/ })).toHaveCount(0);
  await exam.getByRole('button', { name: '法国人；护士', exact: true }).click();
  await check.click(); await expect(exam.getByRole('status')).toHaveText('再看看，试一次。');
  await expect.poll(() => page.evaluate(() => window.classroomSounds.some(x => x.ended && x.src.endsWith('/assets/feedback/duolingo-incorrect.mp3')))).toBe(true);
  await exam.getByRole('button', { name: '再试一次', exact: true }).click();
  await exam.getByRole('button', { name: '意大利人；护士', exact: true }).click(); await check.click();
  await expect.poll(() => page.evaluate(() => window.classroomSounds.some(x => x.ended && x.src.endsWith('/assets/feedback/duolingo-correct.mp3')))).toBe(true);
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => window.classroomSpeechCalls)).toBe(0);
});

test('lesson 路径全部声音不可用时仍能完成32题、浏览原文并领取证书', async ({ page }) => {
  test.setTimeout(90000);
  const voices = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route => {
    if (!isFeedbackAudio(route.request().url())) voices.push(route.request().url());
    return route.abort();
  });
  await page.goto('/lesson/unit7-8/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await completeUnit78(page, '/lesson');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('小小采访员');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const certificate = page.getByRole('dialog', { name: '新朋友采访站纪念', exact: true });
  await expect(certificate).toContainText('完成 Lesson 7–8 课堂配套练习');
  await expect(certificate).not.toContainText('认真听');
  await page.keyboard.press('Escape'); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('15');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeEnabled();
  await page.goto('/unit7-8/#learn/certificate');
  await expect(page.locator('#starCount')).toHaveText('0');
  expect(voices).toEqual([]); expect(errors).toEqual([]);
});

async function useVoicedVersion(page) {
  let old = true;
  const files = Object.fromEntries(await Promise.all(['index.html', 'content.js', 'unit.js'].map(async name => [name, await fs.readFile('tests/fixtures/unit7-8-voiced-before/' + name)])));
  await page.route(/\/unit7-8\/(?:index\.html)?(?:\?.*)?$/, route => old ? route.fulfill({ contentType: 'text/html', body: files['index.html'] }) : route.continue());
  for (const name of ['content.js', 'unit.js']) await page.route('**/unit7-8/' + name + '*', route => old ? route.fulfill({ contentType: 'text/javascript', body: files[name] }) : route.continue());
  await observeSound(page);
  return () => { old = false; };
}

const oldWords = ['Italian', 'keyboard operator', 'engineer', 'policeman', 'policewoman', 'taxi driver', 'air hostess', 'postman', 'nurse', 'mechanic', 'hairdresser', 'housewife', 'milkman'];
async function finishVoicedActivity(page, id) {
  await page.goto('/unit7-8/#learn/' + id);
  const room = page.locator('.stage-' + id), answers = id === 'listen' ? oldWords : ANSWERS[id];
  for (let i = 0; i < answers.length; i++) {
    if (id === 'listen' || id === 'exam' && i === 0) await room.getByRole('button', { name: '听一遍', exact: true }).click();
    if (Array.isArray(answers[i])) for (const token of answers[i]) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
    else await room.locator('.practice-options').getByRole('button', { name: answers[i], exact: true }).click();
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeEnabled({ timeout: 15000 }); await check.click();
    await room.getByRole('button', { name: i === answers.length - 1 ? id === 'exam' ? '查看本次记录' : '完成这一站' : '下一题', exact: true }).click();
  }
}

test('旧配音中断的位置可续读，未改练习与选择保留，旧听辨不代答', async ({ page }) => {
  test.setTimeout(60000); const upgrade = await useVoicedVersion(page);
  await finishVoicedActivity(page, 'reply');
  await page.goto('/unit7-8/#learn/be');
  await page.locator('.stage-be').getByRole('button', { name: 'is / am', exact: true }).click();
  await page.goto('/unit7-8/#learn/listen');
  const vocab = page.locator('.stage-listen');
  await vocab.getByRole('button', { name: 'Italian', exact: true }).click();
  await vocab.getByRole('button', { name: '听一遍', exact: true }).click();
  await expect(vocab.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled({ timeout: 15000 });
  await vocab.getByRole('button', { name: '检查答案', exact: true }).click();
  await page.goto('/unit7-8/#learn/text');
  const story = page.locator('.stage-text');
  await story.getByRole('button', { name: '开始听课文', exact: true }).click();
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeEnabled({ timeout: 15000 });
  await page.route('**/unit7-8/audio/l07-d02.mp3', route => route.abort());
  await story.getByRole('button', { name: '下一句', exact: true }).click();
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await expect(story.locator('.bubble-row')).toHaveCount(2);
  upgrade(); await page.reload();
  await expect(story.locator('.btext span')).toHaveText(DIALOGUE.slice(0, 2));
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeEnabled();
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.goto('/unit7-8/#learn/reply');
  await expect(page.locator('.stage-reply')).toContainText('第 2 / 3 题');
  await page.goto('/unit7-8/#learn/be');
  await expect(page.locator('.stage-reply').getByRole('button', { name: 'is / am', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/unit7-8/#learn/listen');
  await expect(vocab.getByRole('heading', { name: '单词寻宝', exact: true })).toBeVisible();
  await expect(vocab.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(vocab.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

test('旧15星不填满新词汇和阅读挑战，其他活动保留，重做后可领新版证书', async ({ page }) => {
  test.setTimeout(180000); const upgrade = await useVoicedVersion(page);
  await finishVoicedActivity(page, 'listen');
  await page.goto('/unit7-8/#learn/text');
  const story = page.locator('.stage-text');
  for (let i = 0; i < 16; i++) {
    await story.getByRole('button', { name: i ? '下一句' : '开始听课文', exact: true }).click();
    await expect(story.getByRole('button', { name: i === 15 ? '完成课文学习' : '下一句', exact: true })).toBeEnabled({ timeout: 15000 });
  }
  await story.getByRole('button', { name: '完成课文学习', exact: true }).click();
  for (const id of ['roles', 'reply', 'be', 'interview', 'trans', 'exam']) await finishVoicedActivity(page, id);
  await page.goto('/unit7-8/#learn/certificate');
  await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('原来的小记者');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click(); await page.keyboard.press('Escape');
  upgrade(); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('6');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('原来的小记者');
  await page.goto('/unit7-8/#learn/text'); await expect(story.getByText('故事看完了！', { exact: true })).toBeVisible();
  await page.goto('/unit7-8/#learn/exam');
  await expect(page.locator('.stage-exam').getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(page.locator('.stage-exam').getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await completeActivity(page, 'listen'); await completeActivity(page, 'exam');
  await finishChangedInterview(page);
  await page.goto('/unit7-8/#learn/certificate'); await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '新朋友采访站纪念', exact: true })).toContainText('课堂配套练习');
});

async function finishChangedInterview(page) {
 await page.goto('/unit7-8/#learn/interview');const room=page.locator('.stage-interview');
 await expect(room).toContainText('第 2 / 4 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 await room.getByRole('button',{name:"What's her job?",exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();
 await room.getByRole('button',{name:'下一题',exact:true}).click();
 for(let i=2;i<4;i++){
  await page.reload();
  await expect(room).toContainText(`第 ${i+1} / 4 题`);await expect(room.getByRole('status')).toContainText('答对了！');
  await room.getByRole('button',{name:i===3?'完成这一站':'下一题',exact:true}).click();
 }
}

test('27题旧课堂记录升级重答新her题和七道新增挑战，保留合并题、词块、姓名，重练不能再导入', async({page})=>{
 test.setTimeout(120000);let old=true;
 for(const name of ['index.html','content.js','unit.js','unit.css']){
  const body=await fs.readFile('tests/fixtures/unit7-8-classroom-before/'+name);
  const url=name==='index.html'?/\/unit7-8\/(?:index\.html)?(?:\?.*)?$/:`**/unit7-8/${name}*`;
  await page.route(url,route=>old?route.fulfill({contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript',body}):route.continue());
 }
 const legacy=require('../fixtures/unit7-8-classroom-before/flow');await legacy.completeUnit78(page);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('升级核验');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await page.keyboard.press('Escape');
 old=false;await page.reload();await expect(page.locator('#starCount')).toHaveText('9');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('升级核验');
 await finishChangedInterview(page);await page.goto('/unit7-8/#learn/exam');await expect(page.locator('.stage-exam')).toContainText('第 4 / 10 题');await require('../support/unit7-8-exam').finishExamFrom(page,3);await page.goto('/unit7-8/#learn/interview');await page.reload();await expect(page.locator('#starCount')).toHaveText('15');
 const room=page.locator('.stage-interview');await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room).toContainText('第 1 / 4 题');await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

test('人物资源未齐先等待，整课准备后离线阅读与词卡换组完整且不闪加载',async({page,context})=>{
 const voices=[];page.on('request',request=>{if(/\.(mp3|wav|ogg)(\?|$)/.test(request.url())&&!isFeedbackAudio(request.url()))voices.push(request.url());});
 let release;const held=new Promise(resolve=>{release=resolve;});
 await page.route(/sophie\.svg(?:\?|$)/,async route=>{await held;await route.continue();});
 try{
  await page.goto('/lesson/unit7-8/#learn/text',{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('status',{name:'课程准备状态',exact:true})).toContainText('准备');await expect(page.locator('.stage-text')).not.toBeVisible();
 }finally{release();}
 await expect(page.locator('#courseLoader')).toHaveCount(0);await context.setOffline(true);
 const story=page.locator('.stage-text');
 for(let i=0;i<16;i++){
  await story.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  if([3,13,15].includes(i)){const response=await page.reload();expect(response.headers()['x-course-offline']).toBe('1');await expect(story.locator('.bubble-row').last()).toBeInViewport({ratio:1});}
 }
 await story.getByRole('button',{name:'完成课文',exact:true}).click();await expect(story.getByRole('group',{name:'随课文填写的采访档案',exact:true})).toContainText('keyboard operator');
 await page.goto('/lesson/unit7-8/#learn/words');await expect(page.locator('#courseLoader')).toHaveCount(0);
 await page.evaluate(()=>{
  window.unit78PaintFailures=[];
  const inspect=()=>{
   if(document.querySelector('#courseLoader')||document.documentElement.hasAttribute('data-course-painting'))window.unit78PaintFailures.push('loader');
   for(const img of document.querySelectorAll('.stage-words img'))if(img.getClientRects().length&&(!img.complete||!img.naturalWidth))window.unit78PaintFailures.push(img.getAttribute('src'));
  };
  new MutationObserver(inspect).observe(document.body,{childList:true,subtree:true,attributes:true});
 });
 for(let i=0;i<3;i++)await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();
 expect(await page.evaluate(()=>window.unit78PaintFailures)).toEqual([]);
 await page.reload();await expect(page.locator('#wordPageProgress')).toHaveText('4 / 4');expect(voices).toEqual([]);
});
