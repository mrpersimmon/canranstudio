'use strict';
const { test, expect } = require('@playwright/test');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });

async function unlocked(page, automatic = true, realAudio = false) {
  await page.addInitScript(({ automatic, realAudio }) => {
    const key = 'canran:l49:learning:v1';
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({
      version: 1, groups: {}, records: {}, activity: { fullDialogue: true }
    }));
    window.playedAudio = [];
    if (realAudio) {
      const NativeAudio = window.Audio;
      window.Audio = function (src) { const audio = new NativeAudio(src); window.playedAudio.push(audio); return audio; };
      window.Audio.prototype = NativeAudio.prototype;
      window.speechCount = 0;
      const speak = speechSynthesis.speak.bind(speechSynthesis);
      speechSynthesis.speak = utterance => { window.speechCount++; speak(utterance); };
      return;
    }
    window.Audio = class extends EventTarget {
      constructor(src) { super(); this.src = src; this.currentTime = 0; this.paused = true; }
      play() {
        this.paused = false; window.playedAudio.push(this);
        if (automatic) queueMicrotask(() => this.dispatchEvent(new Event('ended')));
        return Promise.resolve();
      }
      pause() { this.paused = true; }
    };
  }, { automatic, realAudio });
  await page.goto('/lesson49/#learn/roles');
}

// v1.7 retains the v1.6 scene/audio contract; role selection and model disclosure were retired.
const answers = ['steak', 'Beef, please.', "To tell you the truth, Mrs. Bird, I don't like chicken either.", 'Lamb, please.', 'I like steak, too.'];
async function choose(room, value, advance = true) {
  await room.getByRole('group', { name: '选择回应', exact: true }).getByRole('button', { name: value, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.locator('#rolePractice').getByRole('status')).toHaveText('答对了！');
  if (advance) await room.getByRole('button', { name: /^(下一题|完成这一站)$/ }).click();
}

test('双人舞台保留站位，检查正确后才显示对应食物', async ({ page }) => {
  await unlocked(page);
  const room = page.locator('.stage-roles');
  const scene = room.getByRole('region', { name: '当前情境', exact: true });
  const butcher = room.getByRole('group', { name: '老板', exact: true });
  const bird = room.getByRole('group', { name: '伯德夫人', exact: true });
  const left = (await butcher.boundingBox()).x, right = (await bird.boundingBox()).x;
  expect(left).toBeLessThan(right);
  await expect(scene).toContainText('课文中，Mrs. Bird 的丈夫喜欢什么肉？');
  await expect.poll(() => scene.innerText()).not.toContain('steak');
  const options = room.getByRole('group', { name: '选择回应', exact: true });
  for (const food of ['steak', 'lamb', 'chicken']) await expect(options.getByRole('button', { name: food, exact: true }).locator('img')).toBeVisible();
  await options.getByRole('button', { name: 'steak', exact: true }).click();
  await expect.poll(() => scene.innerText()).not.toContain('steak');
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(scene.getByRole('button', { name: 'steak', exact: true })).toBeVisible();
  expect((await butcher.boundingBox()).x).toBe(left); expect((await bird.boundingBox()).x).toBe(right);
});

test('播放失败可重试且不阻塞答题，离开后迟到录音不污染新场景', async ({ page }) => {
  await unlocked(page, false);
  const room = page.locator('.stage-roles');
  const scene = room.getByRole('region', { name: '当前情境', exact: true });
  await choose(room, 'steak');
  await page.evaluate(() => {
    window.successfulPlay = Audio.prototype.play;
    Audio.prototype.play = () => Promise.reject(new Error('Device unavailable'));
    speechSynthesis.speak = utterance => queueMicrotask(() => utterance.onerror?.());
  });
  const cue = scene.getByRole('button', { name: 'Do you want beef or lamb?', exact: true });
  await cue.press('Enter');
  await expect(scene).toContainText('没听清？再点一次。');
  await room.getByRole('group', { name: '选择回应', exact: true }).getByRole('button', { name: 'Beef, please.', exact: true }).click();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
  await page.evaluate(() => { Audio.prototype.play = window.successfulPlay; });
  await cue.press('Space');
  await expect(cue).toHaveAttribute('aria-busy', 'true');
  const old = await page.evaluate(() => window.playedAudio.length - 1);
  await page.getByRole('navigation', { name: '学习关卡' }).getByRole('link', { name: '肉店小剧场', exact: true }).click();
  expect(await page.evaluate(index => window.playedAudio[index].paused, old)).toBe(true);
  await page.evaluate(index => window.playedAudio[index].dispatchEvent(new Event('ended')), old);
  await expect(cue).toHaveAttribute('aria-busy', 'false');
  await expect(scene).toContainText('第 2 / 5 题');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled();
});

test('三句情境台词播放对应本地录音到真实结束，不借用近似台词或合成兜底', async ({ page }) => {
  test.setTimeout(60000);
  await unlocked(page, true, true);
  const room = page.locator('.stage-roles');
  const scene = room.getByRole('region', { name: '当前情境', exact: true });
  async function hear(text, filename) {
    const cue = scene.getByRole('button', { name: text, exact: true });
    await cue.click();
    const source = '/lesson49/audio/' + filename;
    await expect.poll(() => page.evaluate(source => window.playedAudio.some(audio => audio.src.endsWith(source)), source)).toBe(true);
    await expect.poll(() => page.evaluate(source => { const audio=window.playedAudio.filter(audio => audio.src.endsWith(source)).at(-1); return audio && {ended:audio.ended,speech:window.speechCount}; }, source), { timeout: 15000 }).toMatchObject({ended:true,speech:0});
    await expect(cue).toHaveAttribute('aria-busy', 'false');
  }
  for (const answer of answers.slice(0, 3)) await choose(room, answer);
  await choose(room, 'Lamb, please.', false);
  await hear('Lamb, please.', 'lamb_please.mp3');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await hear('I like steak.', 'i_like_steak.mp3');
  await choose(room, 'I like steak, too.', false);
  await hear('I like steak, too.', 'i_like_steak_too.mp3');
});

test('阅读即可作答，错答和未检查选择不进入舞台，换题停止旧朗读', async ({ page }) => {
  await unlocked(page, false);
  const room = page.locator('.stage-roles');
  const scene = room.getByRole('region', { name: '当前情境', exact: true });
  await choose(room, 'steak');
  const cue = scene.getByRole('button', { name: 'Do you want beef or lamb?', exact: true });
  await room.getByRole('group', { name: '选择回应', exact: true }).getByRole('button', { name: 'Thank you.', exact: true }).click();
  await expect(scene.getByRole('button', { name: 'Thank you.', exact: true })).toHaveCount(0);
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.locator('#rolePractice').getByRole('status')).toHaveText('再看看，试一次。Beef, please. 请给我牛肉。');
  await expect(scene.getByRole('button', { name: 'Thank you.', exact: true })).toHaveCount(0);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await cue.click(); await expect(cue).toHaveAttribute('aria-busy', 'true');
  await choose(room, 'Beef, please.', false);
  const reply = scene.getByRole('button', { name: 'Beef, please.', exact: true });
  await reply.click(); await expect(reply).toHaveAttribute('aria-busy', 'true');
  await expect(cue).toHaveAttribute('aria-busy', 'false');
  const oldAudio = await page.evaluate(() => window.playedAudio.length - 1);
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(scene).toContainText('第 3 / 5 题');
  const newCue = scene.getByRole('button', { name: "No, thank you. My husband likes steak, but he doesn't like chicken.", exact: true });
  await newCue.click();
  await page.evaluate(index => window.playedAudio[index].dispatchEvent(new Event('ended')), oldAudio);
  await expect(newCue).toHaveAttribute('aria-busy', 'true');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});
