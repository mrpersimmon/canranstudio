'use strict';
const {subjectAnswers,submitSubject,finishSubjects}=require('../support/l49-subject-flow');

const { test, expect } = require('@playwright/test');
test.use({ actionTimeout: 5000, reducedMotion: 'reduce' });
test.setTimeout(60000);


async function openActivity(page,id){
  await page.goto('/lesson49/#learn/'+id);
}
async function retryFeedback(room){
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(room.getByText('看看原因',{exact:true})).toHaveCount(0);
}
async function record(page,text){
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.locator('#learningRecord')).toContainText(text);
  await page.getByRole('button',{name:'关闭',exact:true}).click();
}

async function manualAudio(page) {
  await page.addInitScript(() => {
    window.testRecordings = [];
    window.testPlays = [];
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src=src; this.currentTime=0; this.paused=true; window.testRecordings.push(this); }
      play() { this.paused=false; window.testPlays.push(this.src); return Promise.resolve(); }
      pause() { this.paused=true; }
    };
  });
}

async function finishAudio(page) {
  await page.evaluate(() => window.testRecordings.at(-1).dispatchEvent(new Event('ended')));
}

test('三单答错后保留当前题，孩子点击重试才重新作答', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.5; });
  await page.goto('/lesson49/#learn/subjects');
  const subject = await page.locator('#tpItemText').innerText();
  const stage=page.locator('.stage-subjects');
  await submitSubject(stage,'第一人称',false);
  await page.waitForTimeout(1200);
  await expect(page.locator('#tpItemText')).toHaveText(subject);
  await expect(stage.getByRole('status')).toHaveText('再看看，试一次。');
  await stage.getByRole('button', { name: '再试一次', exact: true }).click();
  await expect(page.locator('#tpItemText')).toHaveText(subject);
  await expect(stage.getByRole('status')).toBeEmpty();
});

test('课文等待录音结束，结束后仍由孩子手动进入下一句', async ({ page }) => {
  await manualAudio(page);
  await page.goto('/lesson49/#learn/text');
  await page.locator('#nextBtn').click();
  await expect(page.locator('#nextBtn')).toBeDisabled();
  await expect(page.locator('#bubbleArea .btext')).toHaveCount(1);
  await finishAudio(page);
  await expect(page.locator('#nextBtn')).toBeEnabled();
  await page.waitForTimeout(3600);
  await expect(page.locator('#bubbleArea .btext')).toHaveCount(1);
  await page.locator('#nextBtn').click();
  await expect(page.locator('#bubbleArea .btext').last()).toHaveText('Yes, please.');
});

test('Do/Are 根据情境选择完整问句，错误解释停留到手动继续', async ({ page }) => {
  await page.goto('/lesson49/#learn/doare');
  const room = page.locator('#t3a');
  await expect(room).toContainText('想知道客人喜不喜欢肉');
  await room.getByRole('button', { name: 'Are you like meat?', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await retryFeedback(room);
  await page.waitForTimeout(1200);
  await expect(room).toContainText('想知道客人喜不喜欢肉');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await room.getByRole('button', { name: 'Do you like meat?', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await record(page,'修正后完成');
  await room.getByRole('button', { name: /^(下一题|完成这一站)$/, exact: true }).click();
  await expect(room).toContainText('想知道新朋友是不是老师');
  await expect(room.getByRole('status')).toBeEmpty();
});

test('词卡保留准确图义和抽象词情境，移除来源分类', async ({ page }) => {
  await page.goto('/lesson49/#learn/words');
  await expect(page.locator('#cardGrid .fcard:visible')).toHaveCount(6);
  const steak = page.locator('.fcard').filter({ has: page.getByText('steak', { exact: true }) });
  await expect(steak.getByRole('img', { name: '一块牛排' }).first()).toBeVisible();
  await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  const mince = page.locator('.fcard').filter({ has: page.getByText('mince', { exact: true }) });
  await expect(mince.getByRole('img', { name: '细碎的肉馅' }).first()).toBeVisible();
  await expect(mince).not.toContainText('教材词');
  const pork = page.locator('.fcard').filter({ has: page.getByText('pork', { exact: true }) });
  await expect(pork).not.toContainText('补充词');
  await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await page.getByRole('button', { name: 'truth', exact: true }).click();
  await expect(page.locator('.fcard.flipped')).toContainText('说出真实的想法');
  await expect(page.locator('#cardGrid')).not.toContainText('instant boiled mutton');
});

test('提示与首次错误分别记录，刷新恢复作答反馈，旧星星不冒充新记录', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('l49-stars-v1', JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3})); });
  await page.goto('/lesson49/#learn/subjects');
  await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByText('学徒手记', { exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('还没有新的作答记录');
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  const room=page.locator('.stage-subjects');
  await room.getByRole('button', {name:'给点线索',exact:true}).click();
  await room.getByRole('button', {name:'第三人称单数',exact:true}).click();
  await room.getByRole('button', {name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await record(page,'提示后完成');
  await page.reload();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await record(page,'提示后完成');
  await room.getByRole('button', {name:'继续',exact:true}).click();
  await room.getByRole('button', {name:'第三人称单数',exact:true}).click();
  await room.getByRole('button', {name:'检查答案',exact:true}).click();
  await page.getByText('学徒手记', { exact:true }).click();
  await expect(page.locator('#learningRecord')).toContainText('首次未答对');
  await expect(page.locator('#learningRecord')).toContainText('提示后完成');
});

test('连续听辨重听不记提示，六题后仍显示待练单词', async ({ page }) => {
  await manualAudio(page);
  await page.addInitScript(() => { localStorage.setItem('l49-stars-v1', JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3})); });
  await page.goto('/lesson49/#learn/listen');
  await page.getByRole('button',{name:'开始听辨',exact:true}).click();
  const room=page.locator('#listenPractice');
  await room.getByRole('button',{name:'听一遍',exact:true}).click();await finishAudio(page);
  await room.getByRole('button',{name:'再听一遍',exact:true}).click();await finishAudio(page);
  for(const word of ['butcher','meat','beef','lamb','steak','mince']){
    if(word!=='butcher'){await room.getByRole('button',{name:'听一遍',exact:true}).click();await finishAudio(page);}
    await choose(room,word);
  }
  await record(page,'未用额外提示答对');
  await page.getByRole('region',{name:'听音寻宝',exact:true}).getByRole('button',{name:'怎么玩',exact:true}).click();
  await page.getByText('听辨记录',{exact:true}).click();
  await expect(page.locator('#vocabCoverage')).toContainText('已练 6 / 14');
  await expect(page.locator('#vocabCoverage')).toContainText('待练：chicken、husband、tell、truth、either、mutton、pork、fish');
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await expect(room).toContainText('第 7 / 14 题');
});

test('锦囊开合不发星星，表达按用途理解后才完成任务', async ({ page }) => {
  await page.goto('/lesson49/#learn/doare');
  await openActivity(page,'pouch');
  const room=page.locator('#t3c');
  const help=page.locator('#pouchGrid');
  for(const item of await help.locator('summary').all())await item.click();
  await expect(page.locator('#st-l3')).toHaveText('☆☆☆');
  await expect(help).toContainText('That is to say');
  await expect(help).toContainText('随和地表示同意');
  await room.locator('#pouchPractice').getByRole('button',{name:'To tell you the truth',exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await expect(page.locator('#st-l3')).toHaveText('☆☆☆');
  await room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true}).click();
  await expect(page.locator('#st-l3')).toHaveText('★☆☆');
});

async function choose(room, answer, next=true) {
  await room.getByRole('button',{name:answer,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  if(next)await room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true}).click();
}

test('either 与 too 先判断两个人的意思，再选择有前文的回应', async ({ page }) => {
  await page.goto('/lesson49/#learn/doare');
  await openActivity(page,'either');
  const room=page.locator('#t3d');
  await expect(room).toContainText('A: I like steak.');
  await choose(room,'两个人都喜欢牛排');
  await choose(room,'I like steak, too.');
  await expect(room).toContainText("A: I don't like chicken.");
  await choose(room,'只有 A 不喜欢鸡肉',false);
  await retryFeedback(room);
  await room.getByRole('button',{name:'再试一次',exact:true}).click();
  await choose(room,'两个人都不喜欢鸡肉');
  await choose(room,"I don't like chicken either.",false);
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await expect(room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true})).toBeVisible();
});

test('give 先理解人物物品，再预测、撤回重排并交给新接收者', async ({ page }) => {
  await page.goto('/lesson49/#learn/doare');
  await openActivity(page,'give');
  const room=page.locator('#givePractice');
  await expect(page.locator('#giveRow2')).toBeHidden();
  await choose(room,'Mrs. Bird');
  await choose(room,'that piece');
  await choose(room,'Give that piece to me, please.',false);
  await expect(page.locator('#st-l3')).toHaveText('☆☆☆');
  await room.getByRole('button',{name:'播放变身魔法',exact:true}).click();
  await expect(room).toContainText('Give that piece to me, please.');
  await expect(room.getByText('to',{exact:true})).toBeVisible();
  await room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true}).click();
  const bank=room.getByRole('group',{name:'待选词块',exact:true});
  await bank.getByRole('button',{name:'Give',exact:true}).click();
  await room.getByRole('group',{name:'已选词块',exact:true}).getByRole('button',{name:'撤回 Give',exact:true}).click();
  await expect(bank.getByRole('button',{name:'Give',exact:true})).toBeEnabled();
  for(const token of ['Give','that piece','to','me,','please.'])await bank.getByRole('button',{name:token,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await record(page,'未用额外提示答对');
  await room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true}).click();
  await choose(room,'Tom',false);
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await expect(room.getByRole('img',{name:'已送给 Tom 的肉品',exact:true})).toBeVisible();
  await page.screenshot({path:'output/playwright/butcher-handoff.png'});
  await page.reload();
  await expect(room.getByRole('status')).toBeVisible();
  await expect(room.getByRole('status')).toHaveText('答对了！');
});

test('主语分类包含 I 和 you，否定句用原形，翻译需要组织词块', async ({ page }) => {
  await page.goto('/lesson49/#learn/subjects');
  await expect(page.locator('#tpProg')).toHaveText('第 1 / 12 题');
  const seen=[];
  for(const answer of subjectAnswers){
    seen.push(await page.locator('#tpItemText').innerText());
    await submitSubject(page.locator('.stage-subjects'),answer);
  }
  expect(seen).toContain('I');expect(seen).toContain('you');
  await openActivity(page,'choice');
  const choice=page.locator('#choiceList');
  await expect(choice).toContainText("He doesn't like chicken.");
  await choose(choice,"He doesn't likes chicken.",false);
  await retryFeedback(choice);
  await choice.getByRole('button',{name:'再试一次',exact:true}).click();
  await choose(choice,"He doesn't like chicken.");
  await openActivity(page,'trans');
  const trans=page.locator('#transList');
  for(const token of ['She','likes','peaches.'])await trans.getByRole('group',{name:'待选词块'}).getByRole('button',{name:token,exact:true}).click();
  await trans.getByRole('button',{name:'检查答案',exact:true}).click();
  await expect(trans.getByRole('status')).toHaveText('答对了！');
  await expect(page.locator('#l4')).not.toContainText('girlfriend');
  await expect(page.locator('#l4')).not.toContainText('beer');
});

test('完整原文听完后开放理解题，使用线索记录为提示后完成', async ({ page }) => {
  await manualAudio(page);
  await page.addInitScript(() => { localStorage.setItem('l49-stars-v1', JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3})); });
  await page.goto('/lesson49/#learn/text');
  await openActivity(page,'roles');
  await expect(page.locator('#rolePractice')).toBeHidden();
  await page.getByRole('button',{name:'先听完整课文',exact:true}).click();
  await page.locator('#nextBtn').click();
  for(let i=0;i<11;i++){
    await finishAudio(page);
    await page.locator('#nextBtn').click();
  }
  await expect(page.locator('#bubbleArea .btext')).toHaveCount(11);
  await expect(page.locator('#l2done')).toContainText('完整听过原文');
  await openActivity(page,'roles');
  const room=page.locator('.stage-roles');
  await choose(room,'steak');
  await expect(room).toContainText('Do you want beef or lamb?');
  await room.getByRole('button',{name:'给点线索',exact:true}).click();
  await choose(room,'Beef, please.',false);
  await expect(room.getByRole('status')).toHaveText('答对了！');
  expect(await page.evaluate(() => window.testPlays.filter(src=>src==='/assets/feedback/duolingo-correct.mp3').length)).toBe(2);
  await record(page,'提示后完成');
  await page.reload();
  await expect(page.getByRole('heading',{name:'故事小侦探',exact:true})).toBeVisible();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await record(page,'提示后完成');
});

async function assemble(room, tokens) {
  const bank=room.getByRole('group',{name:'待选词块',exact:true});
  for(const token of tokens)await bank.getByRole('button',{name:token,exact:true}).click();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  await room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true}).click();
}

test('新订单分两段暂停恢复，最后一题反馈不会被结算跳过', async ({ page }) => {
  test.setTimeout(120000);
  await manualAudio(page);
  await page.setViewportSize({width:390,height:664});
  await page.addInitScript(() => { localStorage.setItem('l49-stars-v1', JSON.stringify({l1:3,l2:3,l3:3,l4:3,l5:3})); });
  await page.goto('/lesson49/#learn/exam');
  await page.getByRole('button',{name:'开始挑战',exact:true}).click();
  const room=page.locator('#examPractice');
  await room.getByRole('button',{name:'听一遍',exact:true}).click();await finishAudio(page);
  await choose(room,'mince');
  expect(await page.evaluate(() => window.testPlays.at(-1))).toBe('/assets/feedback/duolingo-correct.mp3');
  await choose(room,'Mrs. Bird: lamb · husband: steak');
  await choose(room,'Are you a student?');
  await choose(room,'Do you want chicken?');
  await assemble(room,['Give','the beef','to','Lily,','please.']);
  await expect(room).toContainText('已完成 5 / 10 题');
  await page.reload();
  await expect(room).toContainText('已完成 5 / 10 题');
  await room.getByRole('button',{name:'继续第二段（5 题）',exact:true}).click();
  await choose(room,'Sam');
  await choose(room,'I like lamb, too.');
  await choose(room,'want');
  await choose(room,"Tom doesn't like beef.");
  await choose(room,"I don't like lamb either.",false);
  await page.waitForTimeout(1500);
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await expect(page.locator('#quizResult')).toBeHidden();
  await room.getByRole('button',{name:'查看本次记录',exact:true}).click();
  await expect(page.getByRole('button',{name:'下一站：我的学徒证书',exact:true})).toBeVisible();
  await page.getByText('本次答题记录',{exact:true}).click();
  await expect(page.locator('#quizScore')).toBeVisible();
  await expect(page.locator('#quizResult')).toContainText('首次且未用额外提示答对：10 / 10');
  await page.screenshot({path:'output/playwright/butcher-focused-exam-result.png'});
  await expect(page.locator('#quizResult')).toContainText('只说明本次选项和词块任务的表现');
  await room.getByRole('button',{name:'再练一轮',exact:true}).click();
  await expect(page.locator('#quizResult')).toBeHidden();
  await expect(room).toContainText('第 1 / 10 题');
});

test('完成任务后地图成长，重开冒险同时清除新的练习草稿', async ({ page }) => {
  await page.goto('/lesson49/#learn/doare');
  await openActivity(page,'pouch');
  await choose(page.locator('#pouchPractice'),'To tell you the truth');
  const reveal=page.locator('.growth-reveal');
  await expect(reveal).toBeVisible();
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape');
  await expect(reveal).toBeHidden();
  await page.locator('a[href="/?district=first-book-49-60&focus=lesson49"]').first().click();
  const shop=page.locator('[data-course="lesson49"]');
  await expect(shop).toContainText(/\d+ \/ 15 颗星/);
  await page.getByRole('button',{name:'设备冒险设置',exact:true}).click();
  await page.getByRole('button',{name:'重开冒险',exact:true}).click();
  await page.getByRole('button',{name:'继续确认',exact:true}).click();
  await page.getByRole('button',{name:'确认重开',exact:true}).click();
  await page.goto('/lesson49/#learn/doare');
  await expect(page.locator('#starCount')).toHaveText('0');
  await page.getByText('学徒手记',{exact:true}).click();
  await expect(page.locator('#learningRecord')).toContainText('还没有新的作答记录');
});

test('损坏的练习草稿不阻断答题，保存失败可通过页面重试恢复', async ({ page }) => {
  await page.addInitScript(() => {
    if(!sessionStorage.getItem('storage-fixture')){
      localStorage.setItem('canran:l49:learning:v1',JSON.stringify({version:1,groups:{},records:[],activity:{subjectRound:{round:99}}}));
      sessionStorage.setItem('storage-fixture','yes');
    }
    window.testStorageBlocked=true;
    const set=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,value){if(key==='canran:l49:learning:v1'&&window.testStorageBlocked)throw Error('QuotaExceededError');return set.call(this,key,value);};
  });
  await page.goto('/lesson49/#learn/doare');
  const room=page.locator('#t3a');
  await expect(room.getByRole('button',{name:'Do you like meat?',exact:true})).toBeVisible();
  await expect(page.locator('#tpProg')).toHaveText('第 1 / 12 题');
  await choose(room,'Do you like meat?',false);
  await expect(page.locator('#learningSaveWarning')).toBeVisible();
  await expect(page.locator('#learningSaveWarning')).toBeInViewport();
  await expect(page.locator('#learningSaveWarning')).toContainText('暂未保存');
  await page.getByText('学徒手记',{exact:true}).click();
  await expect(page.locator('#learningSaveStatus')).toContainText('暂未保存');
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await page.evaluate(()=>{window.testStorageBlocked=false;});
  await page.getByRole('button',{name:'重试保存',exact:true}).click();
  await expect(page.locator('#learningSaveWarning')).toBeHidden();
  await page.getByRole('button',{name:'学徒手记',exact:true}).click();
  await expect(page.locator('#learningSaveStatus')).toContainText('已保存在这台设备');
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await page.reload();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await record(page,'未用额外提示答对');
});

test('原录音失败时保持课文位置，重试成功后才允许继续', async ({ page }) => {
  await manualAudio(page);
  await page.addInitScript(()=>{
    Object.defineProperty(window,'speechSynthesis',{value:undefined});
    Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined});
  });
  const dialogs=[];page.on('dialog',async dialog=>{dialogs.push(dialog.message());await dialog.dismiss();});
  await page.goto('/lesson49/#learn/text');
  await expect(page.locator('#autoBtn')).toBeVisible();
  await page.locator('#nextBtn').click();
  await page.evaluate(()=>window.testRecordings.at(-1).dispatchEvent(new Event('error')));
  await expect(page.locator('#dialogueStatus')).toContainText('录音还没有播放完');
  await expect(page.locator('#nextBtn')).toBeDisabled();
  expect(dialogs).toEqual([]);
  await page.locator('#autoBtn').click();await finishAudio(page);
  await expect(page.locator('#nextBtn')).toBeEnabled();
  await page.locator('#nextBtn').click();
  await expect(page.locator('#bubbleArea .btext').last()).toHaveText('Yes, please.');
});

test('390 短屏词卡不溢出，答题后选项尺寸稳定且支持键盘继续', async ({ page }) => {
  await page.setViewportSize({width:390,height:664});
  await page.goto('/lesson49/#learn/words');
  for(let i=0;i<2;i++)await page.getByRole('button',{name:'下一组词卡',exact:true}).click();
  await page.getByRole('button',{name:'either',exact:true}).click();
  const card=page.locator('.fcard.flipped');
  const bounds=await card.locator('.fback').boundingBox();
  const copy=await card.locator('.word-context').boundingBox();
  expect(copy.y+copy.height).toBeLessThanOrEqual(bounds.y+bounds.height);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await openActivity(page,'doare');
  const room=page.locator('#t3a');
  const option=room.getByRole('button',{name:'Do you like meat?',exact:true});
  await option.focus();await page.keyboard.press('Enter');
  const before=await option.boundingBox();
  await room.getByRole('button',{name:'检查答案',exact:true}).click();
  const after=await option.boundingBox();
  expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);expect(after.height).toBeGreaterThanOrEqual(44);
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await record(page,'未用额外提示答对');
  await room.getByRole('button',{name: /^(下一题|完成这一站)$/,exact:true}).click();
  await expect(room).toContainText('想知道新朋友是不是老师');
  await page.screenshot({path:'output/playwright/butcher-mobile-390.png'});
});

test('真实本地录音逐段结束后可完成全部原文，仍需手动确认', async ({ page }) => {
  test.setTimeout(180000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/lesson49/#learn/text');
  await page.locator('#nextBtn').click();
  for(let i=0;i<11;i++){
    await expect(page.locator('#nextBtn')).toBeDisabled();
    await expect(page.locator('#nextBtn')).toBeEnabled({timeout:30000});
    await expect(page.locator('#dialogueStatus')).toBeEmpty();
    await expect(page.locator('#bubbleArea .btext')).toHaveCount(i+1);
    if(i===10){
      await expect(page.locator('#l2done')).toBeHidden();
      await page.screenshot({path:'output/playwright/butcher-original-audio.png'});
    }
    await page.locator('#nextBtn').click();
  }
  await expect(page.locator('#l2done')).toContainText('完整听过原文');
  expect(errors).toEqual([]);
});

test('从零完成五关可领学习证书，返回地图显示完成状态', async ({ page }) => {
  test.setTimeout(300000);
  await manualAudio(page);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/lesson49/');
  const dismissGrowth=async()=>{const reveal=page.locator('.growth-reveal');await expect(reveal).toBeVisible();await page.waitForTimeout(800);await page.keyboard.press('Escape');await expect(reveal).toBeHidden();};
  await openActivity(page,'listen');
  await page.locator('#lgStartBtn').click();
  for(const word of ['butcher','meat','beef','lamb','steak','mince','chicken','husband','tell','truth','either','mutton','pork','fish']){
    const room=page.locator('#listenPractice');await room.getByRole('button',{name:'听一遍',exact:true}).click();await finishAudio(page);await choose(room,word);
  }
  await dismissGrowth();
  await openActivity(page,'text');
  await page.locator('#nextBtn').click();for(let i=0;i<11;i++){await finishAudio(page);await page.locator('#nextBtn').click();}
  await dismissGrowth();
  await openActivity(page,'roles');
  for(const answer of ['steak','Beef, please.',"To tell you the truth, Mrs. Bird, I don't like chicken either.",'Lamb, please.','I like steak, too.'])await choose(page.locator('#rolePractice'),answer);
  await openActivity(page,'doare');
  for(const answer of ['Do you like meat?','Are you a teacher?','Are you busy?','Are you at home?','Do you want beef?','Do you sleep well?','Do you make the bed?','Do you put on your coat?'])await choose(page.locator('#doarePractice'),answer);
  await dismissGrowth();
  await openActivity(page,'give');
  const give=page.locator('#givePractice');for(const answer of ['Mrs. Bird','that piece','Give that piece to me, please.'])await choose(give,answer);
  await assemble(give,['Give','that piece','to','me,','please.']);await choose(give,'Tom');await assemble(give,['Show','your ticket','to','Lily,','please.']);
  await openActivity(page,'pouch');await choose(page.locator('#pouchPractice'),'To tell you the truth');
  await openActivity(page,'either');
  for(const answer of ['两个人都喜欢牛排','I like steak, too.','两个人都不喜欢鸡肉',"I don't like chicken either.",'I am a teacher, too.',"I am not at home either."])await choose(page.locator('#eitherPractice'),answer);
  await openActivity(page,'subjects');
  await finishSubjects(page);
  await openActivity(page,'fill');
  for(const answer of ['likes','like','watches','goes','loves','walk','drink'])await choose(page.locator('#fillList'),answer);
  await openActivity(page,'choice');
  for(const answer of ["He doesn't like chicken.","Lucy doesn't want beef.",'gets','works'])await choose(page.locator('#choiceList'),answer);
  await openActivity(page,'trans');
  await assemble(page.locator('#transList'),['She','likes','peaches.']);await assemble(page.locator('#transList'),['He','wants','a car.']);
  await dismissGrowth();
  await openActivity(page,'exam');
  await page.locator('#quizStartBtn').click();const exam=page.locator('#examPractice');
  await exam.getByRole('button',{name:'听一遍',exact:true}).click();await finishAudio(page);await choose(exam,'mince');
  for(const answer of ['Mrs. Bird: lamb · husband: steak','Are you a student?','Do you want chicken?'])await choose(exam,answer);
  await assemble(exam,['Give','the beef','to','Lily,','please.']);await exam.getByRole('button',{name:'继续第二段（5 题）',exact:true}).click();
  for(const answer of ['Sam','I like lamb, too.','want',"Tom doesn't like beef."])await choose(exam,answer);
  await choose(exam,"I don't like lamb either.",false);await exam.getByRole('button',{name:'查看本次记录',exact:true}).click();
  await dismissGrowth();
  await expect(page.locator('#starCount')).toHaveText('15');
  await openActivity(page,'certificate');
  await page.locator('#certBtn').click();await expect(page.locator('#certModal')).toBeVisible();
  await expect(page.locator('#certModal')).toContainText('完成全部五大关卡的学习活动');
  await page.screenshot({path:'output/playwright/butcher-certificate.png',animations:'disabled'});
  await page.locator('#certClose').click();
  await page.locator('a[href="/?district=first-book-49-60&focus=lesson49"]').first().click();
  await expect(page.locator('[data-course="lesson49"]')).toContainText('15 / 15 颗星');
  await page.screenshot({path:'output/playwright/butcher-map-completed.png'});
  expect(errors).toEqual([]);
});
