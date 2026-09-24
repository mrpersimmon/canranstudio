'use strict';
const { test, expect } = require('@playwright/test');
const { DIALOGUE } = require('../support/unit3-4-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
async function observeNativeAudio(page) {
  await page.addInitScript(() => {
    window.nativePlays = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      const result = { src: this.src, ended: false }; window.nativePlays.push(result);
      this.addEventListener('ended', () => { result.ended = true; }, { once: true });
      return Reflect.apply(play, this, args);
    };
  });
}
async function heard(page, control, path) {
  const before = await page.evaluate(() => window.nativePlays.length);
  await control.click();
  await expect.poll(() => page.evaluate(({ before, path }) => window.nativePlays.slice(before).some(item => new URL(item.src).pathname === path && item.ended), { before, path }), { timeout: 15000 }).toBe(true);
}
test('63 段录音逐一从页面原生播完，词卡、12 句原文及完整问答绑定正确', async ({ page }) => {
  test.setTimeout(300000); await observeNativeAudio(page);
  const failed = []; page.on('response', r => { if (r.status() >= 400) failed.push(r.url()); });
  await page.goto('/unit3-4/#learn/words'); const words = page.locator('.stage-words');
  const entries = [
    ['umbrella','l03-w01'],['ticket','l03-w05'],['cloakroom','l03-w10'],['suit','l04-w01'],['school','l04-w02'],['teacher','l04-w03'],
    ['son','l04-w04'],['daughter','l04-w05'],['pen','l02-w01'],['pencil','l02-w02'],['book','l02-w03'],['watch','l02-w04'],
    ['coat','l02-w05'],['dress','l02-w06'],['skirt','l02-w07'],['shirt','l02-w08'],['car','l02-w09'],['house','l02-w10'],
    ['please','l03-w02'],['here','l03-w03'],['my','l03-w04'],['number','l03-w06'],['five','l03-w07'],['sorry','l03-w08'],['sir','l03-w09']
  ];
  for (let i = 0; i < entries.length; i++) {
    if (i && i % 6 === 0) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
    await heard(page, words.getByRole('button', { name: entries[i][0], exact: true }), '/unit3-4/audio/' + entries[i][1] + '.mp3');
  }
  await page.getByRole('link', { name: '找回我的伞', exact: true }).click(); const story = page.locator('.stage-text');
  for (let i = 0; i < 12; i++) {
    await heard(page, story.getByRole('button', { name: i ? '下一句' : '开始听课文', exact: true }), '/unit3-4/audio/l03-d' + String(i + 1).padStart(2,'0') + '.mp3');
    await expect(story.locator('.btext span')).toHaveText(DIALOGUE.slice(0, i + 1));
  }
  await story.getByRole('button', { name: '完成课文学习', exact: true }).click();
  await page.getByRole('link', { name: '礼貌认领', exact: true }).click(); const phrases = page.locator('.stage-phrases');
  await phrases.getByText('换个人或物问一问', { exact: true }).click();
  const models = ['pen','pencil','book','watch','coat','dress','skirt','shirt','car','house','suit','school','teacher','son','daughter'];
  for (let i = 0; i < models.length; i++) await heard(page, phrases.getByRole('button', { name: `Is this your ${models[i]}?`, exact: true }), '/unit3-4/audio/l04-p' + String(i + 1).padStart(2,'0') + '.mp3');
  await heard(page, phrases.getByRole('button', { name: "No. It isn't my umbrella. It's your umbrella.", exact: true }), '/unit3-4/audio/reply-umbrella.mp3');
  await phrases.getByText('不是我的，是你的', { exact: true }).click();
  for (const word of models.slice(0, 10)) await heard(page, phrases.getByRole('button', { name: `No. It isn't my ${word}. It's your ${word}.`, exact: true }), '/unit3-4/audio/reply-' + word + '.mp3');
  const paths = await page.evaluate(() => [...new Set(window.nativePlays.filter(item => item.ended && item.src.includes('/unit3-4/audio/')).map(item => new URL(item.src).pathname))]);
  expect(paths).toHaveLength(63); expect(failed).toEqual([]);
});

test.describe(() => {
// Fault injection covers an uncached browser; cached replay is verified separately.
test.use({ serviceWorkers: 'block' });
test('子目录听辨失败可重试，未真实听完不解锁，错答重试与反馈声保持一致', async ({ page }) => {
  test.setTimeout(60000); await observeNativeAudio(page);
  let fail = true; await page.route('**/unit3-4/audio/l03-w01.mp3', route => fail ? route.abort() : route.continue());
  await page.goto('/lesson/unit3-4/#learn/listen'); const room = page.locator('.stage-listen');
  await room.getByRole('button', { name: 'umbrella', exact: true }).click();
  await room.getByRole('button', { name: '听一遍', exact: true }).click();
  await expect(room).toContainText('播放未完成，请重听。');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  fail = false;
  await heard(page, room.getByRole('button', { name: '再听一遍', exact: true }), '/lesson/unit3-4/audio/l03-w01.mp3');
  await room.locator('.practice-options button').filter({ hasNotText: 'umbrella' }).first().click();
  await heard(page, room.getByRole('button', { name: '检查答案', exact: true }), '/lesson/assets/feedback/duolingo-incorrect.mp3');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await room.getByRole('button', { name: 'umbrella', exact: true }).click();
  await heard(page, room.getByRole('button', { name: '听一遍', exact: true }), '/lesson/unit3-4/audio/l03-w01.mp3');
  await heard(page, room.getByRole('button', { name: '检查答案', exact: true }), '/lesson/assets/feedback/duolingo-correct.mp3');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  expect(await page.evaluate(() => window.nativePlays.every(item => new URL(item.src).pathname.startsWith('/lesson/')))).toBe(true);
});
});

test('课文旧句重听及离开时的旧回调不能替新句完成', async ({ page }) => {
  test.setTimeout(60000); await observeNativeAudio(page);
  await page.goto('/unit3-4/#learn/text'); const story = page.locator('.stage-text');
  await heard(page, story.getByRole('button', { name: '开始听课文', exact: true }), '/unit3-4/audio/l03-d01.mp3');
  await story.getByRole('button', { name: '下一句', exact: true }).click();
  await story.getByRole('button', { name: DIALOGUE[0], exact: true }).click();
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await expect(story.locator('.bubble-row.is-playing')).toHaveCount(0, { timeout: 10000 });
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await heard(page, story.getByRole('button', { name: DIALOGUE[1], exact: true }), '/unit3-4/audio/l03-d02.mp3');
  await story.getByRole('button', { name: '下一句', exact: true }).click();
  await page.getByRole('link', { name: '礼貌认领', exact: true }).click();
  await page.getByRole('link', { name: '找回我的伞', exact: true }).click();
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeDisabled();
  await heard(page, story.getByRole('button', { name: DIALOGUE[2], exact: true }), '/unit3-4/audio/l03-d03.mp3');
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeEnabled();
});
