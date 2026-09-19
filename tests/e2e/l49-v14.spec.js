'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

const words = ['butcher','meat','beef','lamb','steak','mince','chicken','husband','tell','truth','either','mutton','pork','fish'];

async function audioBoundary(page, automatic = true) {
  await page.addInitScript(automatic => {
    window.playedAudio = [];
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; this.paused = true; }
      play() {
        this.paused = false; window.playedAudio.push(this);
        if (automatic) queueMicrotask(() => this.dispatchEvent(new Event('ended')));
        return Promise.resolve();
      }
      pause() { this.paused = true; }
    };
  }, automatic);
}

async function submitWord(room, word) {
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: word, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
}

function completed(word) {
  return { selection: word, attempts: 1, firstCorrect: true, checked: true, correct: true, hintUsed: false };
}

async function legacyProgress(page, progress) {
  await page.addInitScript(progress => {
    if (!localStorage.getItem('canran:l49:learning:v1')) {
      localStorage.setItem('canran:l49:learning:v1', JSON.stringify(progress));
      localStorage.setItem('l49-stars-v1', JSON.stringify({ l1: 3, l2: 2, l3: 0, l4: 0, l5: 0 }));
    }
  }, progress);
}

test('听音寻宝连续14词，末题先反馈，完成返回后能从第一词重练', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/listen');
  await page.getByRole('button', { name: '开始听辨', exact: true }).click();
  const room = page.locator('#listenPractice');
  const stage = page.getByRole('region', { name: '听音寻宝', exact: true });
  for (let i = 0; i < words.length; i++) {
    await expect(room).toContainText(`第 ${i + 1} / 14 题`);
    await submitWord(room, words[i]);
    await expect(page.locator('#starCount')).toHaveText('0');
    await expect(stage.getByRole('button', { name: '下一站：老板与客人', exact: true })).toBeHidden();
    await room.getByRole('button', { name: /^(下一题|完成这一站)$/ }).click();
    if (i === 5) {
      await page.goto('/lesson49/#learn/words');
      await page.goBack(); await page.reload();
      await expect(room).toContainText('第 7 / 14 题');
    }
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  await page.waitForTimeout(800); await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '再听3个词', exact: true })).toHaveCount(0);
  await stage.getByRole('button', { name: '下一站：老板与客人', exact: true }).click();
  await expect(page.getByRole('heading', { name: '老板与客人', exact: true })).toBeInViewport();
  await page.goto('/lesson49/#learn/words');
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await page.getByRole('button', { name: '下一站：听音寻宝', exact: true }).click();
  await expect(room).toContainText('完成');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room).toContainText('第 1 / 14 题');
  await expect(page.locator('#starCount')).toHaveText('3');
  await page.reload();
  await expect(room).toContainText('第 1 / 14 题');
  await submitWord(room, 'butcher');
  for (let i = 1; i < words.length; i++) {
    await room.getByRole('button', { name: '下一题', exact: true }).click();
    await expect(room).toContainText(`第 ${i + 1} / 14 题`);
    await expect(room.getByRole('status')).toBeEmpty();
    await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
    await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await submitWord(room, words[i]);
  }
  await room.getByRole('button', { name: '完成这一站', exact: true }).click();
  await expect(room).toContainText('寻宝完成！');
  await expect(page.locator('#starCount')).toHaveText('3');
});

test('旧11词完成和3词草稿合并，未提交选择、提示及已得星星可以恢复', async ({ page }) => {
  const core = words.slice(0, 11), extra = ['mutton','pork','fish'];
  const draft = { selection: 'pork', attempts: 0, checked: false, hintUsed: true };
  await legacyProgress(page, {
    version: 1,
    groups: {
      'listenPractice/core': { index: 11, signature: core.map(word => 'listen-' + word).join('|'), states: core.map(completed) },
      'listenPractice/extra': { index: 1, signature: 'listen-mutton|listen-pork|listen-fish', states: [completed('mutton'), draft] }
    },
    records: Object.fromEntries([...core,'mutton'].map(word => ['listen-' + word, { ...completed(word), target: '听辨 ' + word, prompt: '听一听，选出单词。' }])),
    activity: { listenMode: 'extra', coreListeningComplete: true }
  });
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/listen');
  const room = page.locator('#listenPractice');
  await expect(room).toContainText('第 13 / 14 题');
  await expect(room.getByRole('button', { name: 'pork', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(room.locator('.practice-hint')).toHaveCount(0);
  await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(page.locator('#starCount')).toHaveText('5');
  await page.reload();
  await expect(room.getByRole('button', { name: 'pork', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room).toContainText('第 14 / 14 题');
  await submitWord(room, extra[2]);
  await room.getByRole('button', { name: '完成这一站', exact: true }).click();
  await expect(page.locator('#starCount')).toHaveText('5');
});

test('大喇叭配四张图文选项，真实听完才能提交，答后卡片位置稳定', async ({ page }) => {
  await audioBoundary(page, false);
  await page.setViewportSize({ width: 1080, height: 900 });
  await page.goto('/lesson49/#learn/listen');
  await page.getByRole('button', { name: '开始听辨', exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  const room = page.locator('#listenPractice');
  const speaker = room.getByRole('button', { name: '听一遍', exact: true });
  await expect(room.getByRole('button', { name: '给点线索', exact: true })).toHaveCount(0);
  await expect(speaker.locator('img')).toHaveAttribute('src', '/assets/lesson49/icons/audio.svg');
  const speakerBox = await speaker.boundingBox();
  expect(speakerBox.width).toBeGreaterThanOrEqual(80);
  expect(speakerBox.height).toBeGreaterThanOrEqual(80);
  for (const word of ['butcher','husband','tell','truth']) {
    const choice = room.getByRole('button', { name: word, exact: true });
    await expect(choice.locator('img')).toHaveAttribute('src', '/assets/lesson49/icons/' + word + '.svg');
    await expect(choice).toContainText(word);
  }
  const butcher = room.getByRole('button', { name: 'butcher', exact: true });
  await butcher.locator('img').click();
  await expect(butcher).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  await expect(check).toBeDisabled();
  await speaker.press('Enter');
  await expect(room.getByRole('button', { name: '再听一遍', exact: true })).toHaveAttribute('aria-busy', 'true');
  await expect(check).toBeDisabled();
  await page.evaluate(() => window.playedAudio.at(-1).dispatchEvent(new Event('ended')));
  await expect(check).toBeEnabled();
  await expect(room.locator('.practice-audio-status')).toBeEmpty();
  await check.scrollIntoViewIfNeeded();
  await expect(check).toBeInViewport();
  const before = await butcher.boundingBox(), scrollBefore = await page.evaluate(() => scrollY);
  await check.click();
  expect(Math.abs((await butcher.boundingBox()).y - before.y)).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await expect(room.getByRole('status')).toHaveText('答对了！');
  expect(await page.evaluate(() => window.playedAudio.at(-1).src)).toBe('/assets/feedback/duolingo-correct.mp3');
});

for (const viewport of [{ width: 320, height: 568 }, { width: 768, height: 1024 }, { width: 1280, height: 900 }]) {
  test(`${viewport.width} 完成页两个操作相邻居中，桌面次左主右、手机主上次下`, async ({ page }) => {
    await legacyProgress(page, {
      version: 1, records: {}, activity: { listenMode: 'extra', coreListeningComplete: true },
      groups: Object.fromEntries([['core', words.slice(0, 11)], ['extra', words.slice(11)]].map(([id, values]) => [
        'listenPractice/' + id,
        { index: values.length, signature: values.map(word => 'listen-' + word).join('|'), states: values.map(completed) }
      ]))
    });
    await page.setViewportSize(viewport);
    await page.goto('/lesson49/#learn/listen');
    await page.evaluate(() => document.fonts.ready);
    const stage = page.getByRole('region', { name: '听音寻宝', exact: true });
    const next = stage.getByRole('button', { name: '下一站：老板与客人', exact: true });
    const again = stage.getByRole('button', { name: '再练一轮', exact: true });
    await expect(next).toBeInViewport({ratio:1}); await expect(again).toBeInViewport({ratio:1});
    const a = await next.boundingBox(), b = await again.boundingBox();
    if(viewport.width<=580){
      expect(b.y-a.y-a.height).toBeGreaterThanOrEqual(10);
      expect(b.y-a.y-a.height).toBeLessThanOrEqual(20);
      expect(Math.abs((a.x+a.width/2)-(b.x+b.width/2))).toBeLessThanOrEqual(1);
    }else{
      expect(a.y).toBe(b.y);
      expect(a.x-b.x-b.width).toBeGreaterThanOrEqual(10);
      expect(a.x-b.x-b.width).toBeLessThanOrEqual(16);
    }
    const group=await stage.getByRole('group',{name:'完成后的操作',exact:true}).boundingBox(),box=await stage.boundingBox();
    expect(Math.abs(group.x+group.width/2-box.x-box.width/2)).toBeLessThanOrEqual(1);
    expect(box.height).toBeLessThan(440);
    await page.screenshot({ path: `output/playwright/l49-v14-finish-${viewport.width}.png` });
    await again.click();
    await expect(stage).toContainText('第 1 / 14 题');
    await expect(next).toBeHidden();
  });
}

test('词卡、短语与相关帮助不暴露来源分类，图义和点读保留', async ({ page }) => {
  await audioBoundary(page);
  await page.goto('/lesson49/#learn/words');
  const shelf = page.getByRole('region', { name: '肉店小图鉴', exact: true });
  const internalLabels = /教材词|补充词|课文短语|补充表达|选看，不考查/;
  for (let group = 0; group < 3; group++) {
    expect(await shelf.innerText()).not.toMatch(internalLabels);
    if (group < 2) await shelf.getByRole('button', { name: '下一组词卡', exact: true }).click();
  }
  await shelf.getByRole('button', { name: 'mutton hotpot', exact: true }).click();
  await expect(shelf).toContainText('羊肉火锅');
  expect(await shelf.innerText()).not.toMatch(internalLabels);
  expect(await page.evaluate(() => window.playedAudio.at(-1).src)).toBe('/lesson49/audio/mutton_hotpot.mp3');
  const listening = page.getByRole('region', { name: '听音寻宝', exact: true });
  await listening.getByRole('button', { name: '怎么玩', exact: true }).click();
  await page.getByText('听辨记录', { exact: true }).click();
  expect(await page.getByRole('dialog').innerText()).not.toMatch(internalLabels);
  await expect(page.locator('#vocabCoverage')).toContainText('0 / 14');
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  const pouch = page.getByRole('region', { name: '店员小锦囊', exact: true });
  for (const expression of ['To tell you the truth','To be honest','Well','Yeah','That is to say']) {
    await pouch.locator('summary').filter({ hasText: expression }).click();
  }
  expect(await pouch.innerText()).not.toMatch(/补充 ·|课文表达 ·/);
});

test('课文播放和恢复使用按钮状态，正常听完不插入说明句', async ({ page }) => {
  await audioBoundary(page, false);
  await page.goto('/lesson49/#learn/text');
  const next = page.getByRole('button', { name: '开始听课文', exact: true });
  await next.click();
  const advance = page.locator('#nextBtn');
  await expect(advance).toBeDisabled();
  await page.evaluate(() => window.playedAudio.at(-1).dispatchEvent(new Event('ended')));
  await expect(advance).toBeEnabled();
  await expect(page.locator('#dialogueStatus')).toBeEmpty();
  await expect(page.locator('#bubbleArea')).toContainText('Do you want any meat today');
  await page.reload();
  await expect(advance).toBeEnabled();
  await expect(page.locator('#dialogueStatus')).toBeEmpty();
  await page.getByRole('button', { name: '重听本句', exact: true }).click();
  await expect(advance).toBeDisabled();
  await expect(page.locator('#dialogueStatus')).toBeEmpty();
});

test('旧轮重练草稿优先于历史成绩，未作答的新题不会被历史答案填满', async ({ page }) => {
  await legacyProgress(page, {
    version: 1,
    groups: {
      'listenPractice/core': { index: 2, signature: words.slice(0, 11).map(word => 'listen-' + word).join('|'), states: [completed('butcher'), completed('meat'), { selection: 'beef', attempts: 0, checked: false, hintUsed: false }] },
      'listenPractice/extra': { index: 3, signature: 'listen-mutton|listen-pork|listen-fish', states: ['mutton','pork','fish'].map(completed) }
    },
    records: Object.fromEntries(words.map(word => ['listen-' + word, { ...completed(word), target: '听辨 ' + word, prompt: '听一听，选出单词。' }])),
    activity: { listenMode: 'core', coreListeningComplete: true }
  });
  await audioBoundary(page); await page.goto('/lesson49/#learn/listen');
  const room = page.locator('#listenPractice');
  await expect(room).toContainText('第 3 / 14 题');
  await expect(room.getByRole('button', { name: 'beef', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await submitWord(room, 'beef');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room).toContainText('第 4 / 14 题');
  await expect(room.getByRole('status')).toBeEmpty();
  await expect(room.getByRole('button', { name: 'lamb', exact: true })).toBeEnabled();
  for (let i = 3; i < words.length; i++) {
    await expect(room).toContainText(`第 ${i + 1} / 14 题`);
    await expect(room.getByRole('status')).toBeEmpty();
    await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
    await submitWord(room, words[i]);
    await room.getByRole('button', { name: i < 13 ? '下一题' : '完成这一站', exact: true }).click();
  }
  await expect(room).toContainText('寻宝完成！');
  await page.getByRole('button', { name: '学徒手记', exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('听辨 fish');
  await expect(page.locator('#starCount')).toHaveText('5');
});

test('旧三词最后一题的正确反馈在升级后仍等待手动完成', async ({ page }) => {
  await legacyProgress(page, {
    version: 1, records: {}, activity: { listenMode: 'extra', coreListeningComplete: true },
    groups: {
      'listenPractice/core': { index: 11, signature: words.slice(0, 11).map(word => 'listen-' + word).join('|'), states: words.slice(0, 11).map(completed) },
      'listenPractice/extra': { index: 2, signature: 'listen-mutton|listen-pork|listen-fish', states: ['mutton','pork','fish'].map(completed) }
    }
  });
  await audioBoundary(page); await page.goto('/lesson49/#learn/listen');
  const stage = page.getByRole('region', { name: '听音寻宝', exact: true });
  await expect(stage).toContainText('第 14 / 14 题');
  await expect(stage.getByRole('status')).toHaveText('答对了！');
  await expect(stage.getByRole('button', { name: '下一站：老板与客人', exact: true })).toBeHidden();
  expect(await page.evaluate(() => window.playedAudio.length)).toBe(0);
  await stage.getByRole('button', { name: '完成这一站', exact: true }).click();
  await expect(stage).toContainText('寻宝完成！');
  expect(await page.evaluate(() => window.playedAudio.map(audio => audio.src))).toEqual(['/assets/feedback/duolingo-complete.mp3']);
});

for (const viewport of [{ width: 320, height: 568 }, { width: 768, height: 1024 }, { width: 1280, height: 900 }]) {
  test(`${viewport.width} 图卡反馈和重试不跳动，下一题题干可见`, async ({ page }) => {
    await audioBoundary(page); await page.setViewportSize(viewport);
    await page.goto('/lesson49/#learn/listen');
    await page.getByRole('button', { name: '开始听辨', exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    const room = page.locator('#listenPractice');
    const choices = room.locator('.practice-options button');
    const boxes = await choices.evaluateAll(items => items.map(item => item.getBoundingClientRect().toJSON()));
    expect(boxes[0].y).toBe(boxes[1].y);
    expect(boxes[2].y).toBe(boxes[3].y);
    expect(boxes[0].x).toBe(boxes[2].x);
    expect(boxes[2].y).toBeGreaterThan(boxes[0].y + boxes[0].height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `output/playwright/l49-v14-question-${viewport.width}.png` });
    await room.getByRole('button', { name: '听一遍', exact: true }).click();
    await room.getByRole('button', { name: 'truth', exact: true }).click();
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await check.scrollIntoViewIfNeeded();
    const scroll = await page.evaluate(() => scrollY);
    const before = await choices.evaluateAll(items => items.map(item => ({ text: item.innerText, x: item.getBoundingClientRect().x, y: item.getBoundingClientRect().y })));
    await check.click();
    await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
    expect(await choices.evaluateAll(items => items.map(item => ({ text: item.innerText, x: item.getBoundingClientRect().x, y: item.getBoundingClientRect().y })))).toEqual(before);
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    await room.getByRole('button', { name: '再试一次', exact: true }).click();
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    await submitWord(room, 'butcher');
    await room.getByRole('button', { name: '下一题', exact: true }).scrollIntoViewIfNeeded();
    await room.getByRole('button', { name: '下一题', exact: true }).click();
    await expect(room).toContainText('第 2 / 14 题');
    await expect.poll(async()=>{
      const question=await room.locator('.practice-content h3').boundingBox(),bar=await page.locator('#topbar').boundingBox();
      return question.y>=bar.y+bar.height && question.y+question.height<=page.viewportSize().height;
    }).toBe(true);
  });
}

test('14个词从大喇叭加载本地录音并真实结束，完成后可以重练', async ({ page }) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    window.finishedWords = [];
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(src) {
        super(src);
        this.addEventListener('ended', () => { if (src.includes('/lesson49/audio/')) window.finishedWords.push(new URL(this.src).pathname); });
      }
    };
  });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/lesson49/#learn/listen');
  await page.getByRole('button', { name: '开始听辨', exact: true }).click();
  const room = page.locator('#listenPractice');
  for (const word of words) {
    await room.getByRole('button', { name: word, exact: true }).click();
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled();
    await room.getByRole('button', { name: '听一遍', exact: true }).click();
    await expect(check).toBeEnabled({ timeout: 8000 });
    await expect(room.locator('.practice-audio-status')).toBeEmpty();
    await check.click();
    await room.getByRole('button', { name: /^(下一题|完成这一站)$/ }).click();
  }
  expect(await page.evaluate(() => window.finishedWords)).toEqual(words.map(word => '/lesson49/audio/' + word + '.mp3'));
  expect(errors).toEqual([]);
  await page.waitForTimeout(800); await page.keyboard.press('Escape');
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room).toContainText('第 1 / 14 题');
});
