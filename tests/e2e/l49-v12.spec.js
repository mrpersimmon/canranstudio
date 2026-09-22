'use strict';
const {subjectAnswers,submitSubject,finishSubjects}=require('../support/l49-subject-flow');

const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function audioBoundary(page) {
  await page.addInitScript(() => {
    window.recordedAudio = [];
    window.legacyTones = 0;
    if (window.AudioContext) {
      const create = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function (...args) { window.legacyTones++; return create.apply(this, args); };
    }
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; this.paused = true; }
      play() { this.paused = false; window.recordedAudio.push(this); return Promise.resolve(); }
      pause() { this.paused = true; }
    };
  });
}

test('点击词卡即可朗读并翻面，键盘等价，快速点读只保留当前词', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/words');
  const butcher = page.getByRole('button', { name: 'butcher', exact: true });
  await butcher.click();
  await expect(butcher).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.src))).toEqual(['/lesson49/audio/butcher.mp3']);
  await expect(page.locator('#cardGrid').getByRole('button', { name: '听发音', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'meat', exact: true }).click();
  expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.paused))).toEqual([true, false]);
  await butcher.focus();
  await page.keyboard.press('Enter');
  await expect(butcher).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Space');
  await expect(butcher).toHaveAttribute('aria-expanded', 'true');
  expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.src))).toEqual([
    '/lesson49/audio/butcher.mp3', '/lesson49/audio/meat.mp3', '/lesson49/audio/butcher.mp3', '/lesson49/audio/butcher.mp3'
  ]);
  await page.getByRole('navigation',{name:'学习关卡'}).getByRole('link',{name:'肉店小剧场',exact:true}).click();
  expect(await page.evaluate(() => window.recordedAudio.every(audio => audio.paused))).toBe(true);
});

test('最后一组词卡提供开始听辨，刷新后仍可一步进入第一题', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto('/lesson49/#learn/words');
  for (let index = 0; index < 2; index++) await page.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await expect(page.locator('#wordPageProgress')).toHaveText('3 / 3');
  const start = page.getByRole('button', { name: '下一站：听音寻宝', exact: true });
  await expect(start).toBeEnabled();
  await expect(start).toBeInViewport();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'output/playwright/l49-v12-word-end-after.png' });
  await page.reload();
  await expect(page.locator('#wordPageProgress')).toHaveText('3 / 3');
  await start.click();
  await expect(page.getByRole('heading',{name:'听音寻宝',exact:true})).toBeInViewport();
  await expect(page.locator('#listenPractice')).toContainText('第 1 / 14 题');
  await expect(page.getByRole('button', { name: '听一遍', exact: true })).toBeVisible();
  await expect(page.locator('#cardGrid')).toBeVisible();
});

test('检查答案时播放对应反馈音，选择、提示、重试、继续和恢复保持安静', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/doare');
  const room = page.locator('#doarePractice');
  await room.getByRole('button', { name: 'Are you like meat?', exact: true }).click();
  await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(0);
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  expect(await page.evaluate(() => window.recordedAudio.map(audio => [audio.src, audio.volume]))).toEqual([
    ['/assets/feedback/duolingo-incorrect.mp3', 0.35]
  ]);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await room.getByRole('button', { name: 'Do you like meat?', exact: true }).click();
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(1);
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  expect(await page.evaluate(() => window.recordedAudio.map(audio => [audio.src, audio.volume, audio.paused]))).toEqual([
    ['/assets/feedback/duolingo-incorrect.mp3', 0.35, true],
    ['/assets/feedback/duolingo-correct.mp3', 0.35, false]
  ]);
  await page.reload();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: /^(下一题|完成这一站)$/, exact: true }).click();
  await expect(room).toContainText('想知道新朋友是不是老师');
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(0);
});

test('最后一题先响正确音，手动完成后才响完成音，重新进入和刷新不重播', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/pouch');
  const room = page.locator('#pouchPractice');
  await room.getByRole('button', { name: 'To tell you the truth', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.src))).toEqual(['/assets/feedback/duolingo-correct.mp3']);
  await room.getByRole('button', { name: /^(下一题|完成这一站)$/, exact: true }).click();
  await expect(room).toContainText('这一组完成了！');
  expect(await page.evaluate(() => window.legacyTones)).toBe(0);
  expect(await page.evaluate(() => window.recordedAudio.map(audio => [audio.src, audio.volume]))).toEqual([
    ['/assets/feedback/duolingo-correct.mp3', 0.35], ['/assets/feedback/duolingo-complete.mp3', 0.5]
  ]);
  await expect(page.locator('.growth-reveal')).toBeVisible();
  await page.waitForTimeout(750);
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'下一站：心声接力',exact:true}).click();
  await page.goBack();
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(2);
  await page.reload();
  await expect(room).toContainText('这一组完成了！');
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(0);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await room.getByRole('button', { name: 'To tell you the truth', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await room.getByRole('button', { name: /^(下一题|完成这一站)$/, exact: true }).click();
  expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.src))).toEqual([
    '/assets/feedback/duolingo-correct.mp3', '/assets/feedback/duolingo-complete.mp3'
  ]);
});

test('主语分拣也有正误和完成音，答案反馈停留到手动继续', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/subjects');
  const stage=page.locator('.stage-subjects');
  for (let index = 0; index < 13; index++) {
    const subject = await page.locator('#tpItemText').innerText();
    await submitSubject(stage,index===0?'第一人称':subjectAnswers[index-1],false);
    await expect(page.locator('#tpItemText')).toHaveText(subject);
    await expect(stage.getByRole('button',{name:index===0?'再试一次':index===12?'完成':'继续',exact:true})).toBeVisible();
    const sounds = await page.evaluate(() => window.recordedAudio.map(audio => audio.src));
    expect(sounds.at(-1)).toBe(index === 0 ? '/assets/feedback/duolingo-incorrect.mp3' : '/assets/feedback/duolingo-correct.mp3');
    await stage.getByRole('button',{name:index===0?'再试一次':index===12?'完成':'继续',exact:true}).click();
  }
  await expect(stage).toContainText('分拣完成！');
  expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.src))).toEqual([
    '/assets/feedback/duolingo-incorrect.mp3', ...Array(12).fill('/assets/feedback/duolingo-correct.mp3'), '/assets/feedback/duolingo-complete.mp3'
  ]);
  await page.reload();
  await expect(stage).toContainText('分拣完成！');
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(0);
});

test('mutton hotpot 点读加载本地录音并真实播放到结束，不调用系统朗读', async ({ page }) => {
  await page.addInitScript(() => {
    window.pronunciationEnds = [];
    window.systemSpeech = [];
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(src) {
        super(src);
        this.addEventListener('ended', () => window.pronunciationEnds.push(new URL(this.src).pathname));
      }
    };
    speechSynthesis.speak = utterance => { window.systemSpeech.push(utterance.text); };
  });
  await page.goto('/lesson49/#learn/words');
  for (let index = 0; index < 2; index++) await page.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await page.getByRole('button', { name: 'mutton hotpot', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.pronunciationEnds), { timeout: 8000 }).toEqual(['/lesson49/audio/mutton_hotpot.mp3']);
  expect(await page.evaluate(() => window.systemSpeech)).toEqual([]);
  await expect(page.locator('.fcard.flipped:visible')).toContainText('羊肉火锅');
});

test('课堂投屏入口和独立页面均已移除，学生课程正常打开', async ({ page }) => {
  await page.goto('/lesson49/');
  await expect(page.getByRole('link', { name: /课堂投屏/ })).toHaveCount(0);
  const response = await page.goto('/lesson49/present/');
  expect(response.status()).toBe(404);
  await expect(page.getByRole('button', { name: /全屏|下一步|显示提示/ })).toHaveCount(0);
  await page.goto('/lesson49/');
  await page.getByRole('button',{name:'开始冒险',exact:true}).click();
  await expect(page.getByRole('button', { name: 'butcher', exact: true })).toBeVisible();
});

test('课文最后一句听完后等待手动完成，只在完成动作播放完成音', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/text');
  await page.getByRole('button', { name: '开始听课文', exact: true }).click();
  for (let index = 0; index < 11; index++) {
    await page.evaluate(() => window.recordedAudio.at(-1).dispatchEvent(new Event('ended')));
    if (index < 10) await page.getByRole('button', { name: '下一句', exact: true }).click();
  }
  const feedback = () => page.evaluate(() => window.recordedAudio.filter(audio => audio.src.includes('/feedback/')).map(audio => audio.src));
  expect(await feedback()).toEqual([]);
  await page.getByRole('button', { name: '完成课文学习', exact: true }).click();
  await expect(page.locator('#l2done')).toContainText('完整听过原文');
  expect(await feedback()).toEqual(['/assets/feedback/duolingo-complete.mp3']);
  await page.reload();
  await expect(page.locator('#l2done')).toContainText('完整听过原文');
  expect(await feedback()).toEqual([]);
});

test('领取证书播放同款完成音，关闭和恢复保持安静', async ({ page }) => {
  await audioBoundary(page);
  await page.addInitScript(() => localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 3, l3: 3, l4: 3, l5: 3 })));
  await page.goto('/lesson49/#learn/certificate');
  await page.getByRole('button', { name: '领取证书', exact: true }).click();
  await expect(page.locator('#certModal')).toBeVisible();
  expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.src))).toEqual(['/assets/feedback/duolingo-complete.mp3']);
  await page.locator('#certModal').getByRole('button', { name: '关闭', exact: true }).click();
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(1);
  await page.reload();
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(0);
});

test('三种反馈录音都能由浏览器真实播放到结束', async ({ page }) => {
  await page.addInitScript(() => {
    window.feedbackEnds = [];
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(src) {
        super(src);
        this.addEventListener('ended', () => window.feedbackEnds.push(new URL(this.src).pathname));
      }
    };
  });
  await page.goto('/lesson49/#learn/pouch');
  const room = page.locator('#pouchPractice');
  const wrong = room.locator('.practice-options button').filter({ hasNotText: 'To tell you the truth' }).first();
  await wrong.click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.feedbackEnds)).toEqual(['/assets/feedback/duolingo-incorrect.mp3']);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await room.getByRole('button', { name: 'To tell you the truth', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.feedbackEnds.length)).toBe(2);
  await room.getByRole('button', { name: /^(下一题|完成这一站)$/, exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.feedbackEnds), { timeout: 8000 }).toEqual([
    '/assets/feedback/duolingo-incorrect.mp3', '/assets/feedback/duolingo-correct.mp3', '/assets/feedback/duolingo-complete.mp3'
  ]);
});

test('听辨选项不朗读，旧反馈结束不充当听完新单词，音效失败仍可继续', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/listen');
  await page.getByRole('button', { name: '开始听辨', exact: true }).click();
  const room = page.locator('#listenPractice');
  await room.getByRole('button', { name: 'butcher', exact: true }).click();
  expect(await page.evaluate(() => window.recordedAudio.length)).toBe(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await page.evaluate(() => window.recordedAudio.at(-1).dispatchEvent(new Event('ended')));
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  expect(await page.evaluate(() => window.recordedAudio.at(-1).src)).toBe('/assets/feedback/duolingo-correct.mp3');
  await room.getByRole('button', { name: /^(下一题|完成这一站)$/, exact: true }).click();
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: 'meat', exact: true }).click();
  await page.evaluate(() => window.recordedAudio.find(audio => audio.src.includes('/feedback/')).dispatchEvent(new Event('ended')));
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await page.evaluate(() => {
    window.recordedAudio.at(-1).dispatchEvent(new Event('ended'));
    Audio.prototype.play = function () { return Promise.reject(new Error('Audio unavailable')); };
  });
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: /^(下一题|完成这一站)$/, exact: true }).click();
  await expect(room).toContainText('第 3 / 14 题');
  await expect(page.locator('#speechNotice')).toBeHidden();
});

for (const [activity, answer] of [
  ['give', 'Mrs. Bird'], ['either', '两个人都喜欢牛排'], ['fill', 'likes'], ['choice', "He doesn't like chicken."], ['trans', ['She', 'likes', 'peaches.']]
]) {
  test(activity + ' 的正确作答使用统一反馈音', async ({ page }) => {
    await audioBoundary(page);
    await page.goto('/lesson49/#learn/' + activity);
    const room = page.locator('[data-activity="'+activity+'"]');
    for (const token of Array.isArray(answer) ? answer : [answer]) await room.getByRole('button', { name: token, exact: true }).click();
    expect(await page.evaluate(() => window.recordedAudio.length)).toBe(0);
    await room.getByRole('button', { name: '检查答案', exact: true }).click();
    await expect(room.getByRole('status')).toHaveText('答对了！');
    expect(await page.evaluate(() => window.recordedAudio.map(audio => audio.src))).toEqual(['/assets/feedback/duolingo-correct.mp3']);
  });
}
