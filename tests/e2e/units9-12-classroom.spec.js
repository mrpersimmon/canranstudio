'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const units = [
  { id: 'unit9-10', title: 'Lesson 9–10', ...require('../support/unit9-10-flow') },
    { id: 'unit11-12', title: 'Lesson 11–12', ...require('../support/unit11-12-flow') }
];
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
const vocabularyAnswers = {
  'unit9-10': ['成年女子','胖的','thin','高的','short','dirty','clean','hot','冷的；觉得冷的','年老的','young','busy','懒惰的；不愿付出努力'],
  'unit11-12': ['谁的','蓝色的','也许；不确定','white','接住','father','母亲','blouse','姐姐；妹妹','tie','brother','他的','她的']
};
async function blockVoices(page, all = false) {
  const voices = [];
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route => {
    const feedback = new URL(route.request().url()).pathname.includes('/assets/feedback/');
    if (!feedback) voices.push(route.request().url());
    return !feedback || all ? route.abort() : route.continue();
  });
  return voices;
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

for (const unit of units) test(`${unit.title} 无配音可逐句看完原文，刷新续读，中文独立展开`, async ({ page }) => {
  const voices = await blockVoices(page);
  await page.goto('/' + unit.id + '/#learn/roles');
  await page.getByRole('button', { name: /先[听看]故事/ }).click();
  const room = page.locator('.stage-text');
  for (let i = 0; i < unit.DIALOGUE.length; i++) {
    await room.getByRole('button', { name: i ? '下一句' : /开始[听看]课文/, exact: true }).click();
    await expect(room.locator('.btext span')).toHaveText(unit.DIALOGUE.slice(0, i + 1));
    await expect(room.locator('.bname')).toHaveText(unit.SPEAKERS.slice(0, i + 1));
    if (i < unit.DIALOGUE.length - 1) await expect(room.getByRole('button', { name: '下一句', exact: true })).toBeEnabled({ timeout: 1500 });
    if (i === 3) {
      await room.locator('.bubble-row').first().getByRole('button', { name: '看中文', exact: true }).click();
      await expect(room.locator('.bubble-row').first().getByRole('button', { name: '收起中文', exact: true })).toBeVisible();
      await page.reload(); await expect(room.locator('.bubble-row')).toHaveCount(4);
    }
    if (unit.id === 'unit11-12') await expect(room.locator('.dialogue-actor.is-current span')).toHaveText(unit.SPEAKERS[i]);
  }
  await expect(room.getByRole('button', { name: /听|播放/ })).toHaveCount(0);
  await expect(room.locator('button.btext')).toHaveCount(0);
  await expect(page.locator('#starCount')).toHaveText('0');
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await expect(room.getByText('故事看完了！', { exact: true })).toBeVisible();
  await expect(page.locator('#starCount')).toHaveText('1');
  await room.getByRole('button', { name: '下一站：故事小侦探', exact: true }).click();
  await expect(page.locator('.stage-roles .practice-options button')).not.toHaveCount(0);
  expect(voices).toEqual([]);
});

for (const unit of units) test(`${unit.title} 图鉴只展开释义、图册供阅读，挑战读英文，正误音独立保留`, async ({ page }) => {
  const voices = await blockVoices(page); await observeSound(page);
  await page.goto('/' + unit.id + '/#learn/words');
  const card = page.locator('.stage-words').getByRole('button', { name: unit.id === 'unit9-10' ? 'hello' : 'whose', exact: true });
  await card.click(); await expect(card.locator('.word-meaning')).toBeVisible();
  await card.click(); await expect(card.locator('.word-meaning')).toBeHidden(); await expect(card.locator('.word-phonetic')).toBeVisible();
  await page.goto('/' + unit.id + '/#learn/phrases'); await expect(page.locator('button.phrase-card')).toHaveCount(0);
  await expect(page.locator('.stage-phrases article.phrase-card')).toHaveCount(4);
  await page.goto('/' + unit.id + '/#learn/models'); await expect(page.locator('.stage-models article.phrase-card')).not.toHaveCount(0);
  await page.goto('/' + unit.id + '/#learn/exam'); const room = page.locator('.stage-exam');
  await expect(room.getByRole('button', { name: '听一遍', exact: true })).toHaveCount(0);
  await expect(room.locator('.practice-content h3')).toContainText(unit.id === 'unit9-10' ? 'Tony is very well, thanks.' : "This is my brother's pen. It's his pen.");
  const check = room.getByRole('button', { name: '检查答案', exact: true });
  await room.getByRole('button', { name: unit.id === 'unit9-10' ? 'Emma · fine' : 'my sister · pen', exact: true }).click(); await check.click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await expect.poll(() => page.evaluate(() => window.classroomSounds.some(x => x.src.includes('incorrect') && x.ended))).toBe(true);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  await room.getByRole('button', { name: unit.id === 'unit9-10' ? 'Tony · fine' : 'my brother · pen', exact: true }).click(); await check.click();
  await expect(room.getByRole('status')).toContainText('答对了！');
  await expect.poll(() => page.evaluate(() => window.classroomSounds.some(x => x.src.includes('correct') && !x.src.includes('incorrect') && x.ended))).toBe(true);
  expect(await page.evaluate(() => window.classroomSpeechCalls)).toBe(0); expect(voices).toEqual([]);
});

for (const unit of units) test(`${unit.title} 单词寻宝覆盖13个新词，读词义或看图作答，末题不自动选择`, async ({ page }) => {
  const voices = await blockVoices(page);
  await page.goto('/' + unit.id + '/#learn/listen'); const room = page.locator('.stage-listen');
  await expect(room.getByRole('button', { name: /听一遍|给点线索/ })).toHaveCount(0);
  await expect(room.getByRole('heading', { name: '单词寻宝', exact: true })).toBeVisible();
  for (const [i, answer] of vocabularyAnswers[unit.id].entries()) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled(); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i));
    if (i >= 11) { await page.reload(); await expect(check).toBeDisabled(); await expect(room.getByRole('button', { name: answer, exact: true })).toHaveAttribute('aria-pressed', 'false'); }
    if (unit.id === 'unit9-10' && i === 5 || unit.id === 'unit11-12' && i === 7) {
      await expect(room.locator('.practice-scene')).toBeVisible(); await expect(room.locator('.practice-options img')).toHaveCount(0);
    }
    if (i === 0) {
      await room.getByRole('button', { name: unit.id === 'unit9-10' ? '母亲' : '谁', exact: true }).click(); await check.click();
      await expect(room.getByRole('status')).not.toContainText('答对了'); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
      await room.getByRole('button', { name: '再试一次', exact: true }).click();
    }
    await room.getByRole('button', { name: answer, exact: true }).click(); await check.click();
    await expect(room.getByRole('status')).toContainText('答对了！');
    await room.getByRole('button', { name: i === 12 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(page.locator('#starCount')).toHaveText('3');
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled(); expect(voices).toEqual([]);
});

for (const unit of units) test(`${unit.title} lesson 路径全部声音失败仍可完成整课和领证，根路径记录独立`, async ({ page }) => {
  const voices = await blockVoices(page, true); await observeSound(page); const errors = []; page.on('pageerror', e => errors.push(e.message));
  const complete = unit.completeUnit910 || unit.completeUnit1112;
  await complete(page, '/lesson');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(page.getByRole('dialog').filter({ hasText: unit.title + ' 课堂配套练习' })).toBeVisible();
  await page.keyboard.press('Escape'); await page.reload(); await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('link', { name: '我的课程', exact: true }).click();
  await expect(page).toHaveURL(/\/lesson\/$/);
  await page.goto('/' + unit.id + '/#learn/certificate'); await expect(page.locator('#starCount')).toHaveText('0');
  expect(voices).toEqual([]); expect(errors).toEqual([]); expect(await page.evaluate(() => window.classroomSpeechCalls)).toBe(0);
});

async function useVoicedVersion(page, id) {
  let voiced = true;
  const prefix = 'tests/fixtures/' + id + '-voiced-before/';
  await page.route(new RegExp('/' + id + '/(?:index\\.html)?(?:\\?.*)?$'), async route => voiced ? route.fulfill({ contentType: 'text/html', body: await fs.readFile(prefix + 'index.html') }) : route.continue());
  for (const name of ['content.js','unit.js']) await page.route('**/' + id + '/' + name + '*', async route => voiced ? route.fulfill({ contentType: 'text/javascript', body: await fs.readFile(prefix + name) }) : route.continue());
  return () => { voiced = false; };
}
for (const unit of units) test(`${unit.title} 旧录音中断可续读，保留词卡页、原练习与词块草稿`, async ({ page }) => {
  test.setTimeout(60000); const upgrade = await useVoicedVersion(page, unit.id);
  const old = require('../fixtures/' + unit.id + '-voiced-before/flow');
  const unchanged = unit.id === 'unit9-10' ? 'reply' : 'owner';
  await old.completeActivity(page, unchanged);
  await page.goto('/' + unit.id + '/#learn/words'); await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  await page.goto('/' + unit.id + '/#learn/trans');
  const firstToken = unit.id === 'unit9-10' ? "I'm" : 'Whose';
  await page.locator('.stage-trans').getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: firstToken, exact: true }).click();
  await page.goto('/' + unit.id + '/#learn/listen'); const listen = page.locator('.stage-listen');
  await listen.getByRole('button', { name: '听一遍', exact: true }).click();
  await listen.getByRole('button', { name: unit.id === 'unit9-10' ? 'woman' : 'whose', exact: true }).click();
  await expect(listen.getByRole('button', { name: '检查答案', exact: true })).toBeEnabled({ timeout: 15000 });
  await listen.getByRole('button', { name: '检查答案', exact: true }).click(); await expect(listen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  await page.goto('/' + unit.id + '/#learn/text'); const story = page.locator('.stage-text');
  await story.getByRole('button', { name: '开始听课文', exact: true }).click();
  await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeEnabled({ timeout: 15000 });
  await page.route('**/' + unit.id + '/audio/*d02.mp3', route => route.abort());
  await story.getByRole('button', { name: '下一句', exact: true }).click();
  await expect(story.locator('.dialogue-status')).toContainText('录音还没听完');
  upgrade(); const voices = await blockVoices(page); await page.reload();
  await expect(story.locator('.bubble-row')).toHaveCount(2); await expect(story.getByRole('button', { name: '下一句', exact: true })).toBeEnabled();
  await expect(page.locator('#starCount')).toHaveText('3');
  await page.goto('/' + unit.id + '/#learn/' + unchanged); await expect(page.locator('.stage-' + unchanged).getByRole('group', { name: '完成后的操作', exact: true })).toBeVisible();
  await page.goto('/' + unit.id + '/#learn/trans'); await expect(page.locator('.stage-trans').getByRole('group', { name: '已选词块', exact: true }).getByRole('button', { name: '撤回 ' + firstToken, exact: true })).toBeVisible();
  await page.goto('/' + unit.id + '/#learn/words'); await expect(page.locator('#wordPageProgress')).toHaveText(unit.id === 'unit9-10' ? '2 / 4' : '2 / 3');
  await page.goto('/' + unit.id + '/#learn/listen'); await expect(listen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0'); await expect(listen.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  expect(voices).toEqual([]);
});

for (const unit of units) test(`${unit.title} 旧15星升级保留9星，新题独立完成后再领课堂配套证书`, async ({ page }) => {
  test.setTimeout(180000); const upgrade = await useVoicedVersion(page, unit.id);
  const old = require('../fixtures/' + unit.id + '-voiced-before/flow');
  await (old.completeUnit910 || old.completeUnit1112)(page);
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('旧版学员');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click(); await expect(page.locator('#certificateName')).toHaveText('旧版学员'); await page.keyboard.press('Escape');
  upgrade(); const voices = await blockVoices(page); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('9'); await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('旧版学员'); await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  for (const id of ['listen','exam']) {
    await page.goto('/' + unit.id + '/#learn/' + id); const room = page.locator('.stage-' + id);
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
    await unit.completeActivity(page, id);
  }
  await page.goto('/' + unit.id + '/#learn/certificate'); await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(page.locator('#certificateName')).toHaveText('旧版学员'); await expect(page.getByRole('dialog').filter({ hasText: unit.title + ' 课堂配套练习' })).toBeVisible();
  expect(voices).toEqual([]);
});

for (const unit of units) for (const width of [320,1280]) test(`${unit.title} ${width} 阅读控件不跳动，图片题和长词义选项完整`, async ({ page }) => {
  await page.setViewportSize({ width, height: 800 }); await blockVoices(page);
  await page.goto('/' + unit.id + '/#learn/text'); await page.evaluate(() => document.fonts.ready);
  const story = page.locator('.stage-text'); await story.getByRole('button', { name: '开始看课文', exact: true }).click();
  const controls = story.locator('.stage-ctrl'); const before = await controls.evaluate(el => ({ y: el.getBoundingClientRect().top, scroll: scrollY }));
  for (let i=1; i<unit.DIALOGUE.length; i++) await story.getByRole('button', { name: '下一句', exact: true }).click();
  const after = await controls.evaluate(el => ({ y: el.getBoundingClientRect().top, scroll: scrollY }));
  expect(after.y).toBeCloseTo(before.y,0); expect(after.scroll).toBeCloseTo(before.scroll,0);
  const restart = await controls.getByRole('button', { name: '重新上演', exact: true }).boundingBox();
  const advance = await controls.getByRole('button', { name: '完成课文', exact: true }).boundingBox();
  expect(restart.x + restart.width).toBeLessThan(advance.x);
  expect(restart.y).toBeCloseTo(advance.y,0); expect(restart.height).toBeCloseTo(advance.height,0);
  await page.screenshot({ path: `output/playwright/units9-12-classroom/${unit.id}-story-${width}.png` });
  await page.goto('/' + unit.id + '/#learn/listen'); const room = page.locator('.stage-listen');
  for (const [i,answer] of vocabularyAnswers[unit.id].entries()) {
    for (const option of await room.locator('.practice-options button').all()) expect(await option.evaluate(el=>el.scrollHeight<=el.clientHeight&&el.scrollWidth<=el.clientWidth)).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if (unit.id==='unit9-10' && [5,12].includes(i) || unit.id==='unit11-12' && [7,12].includes(i)) await page.screenshot({ path: `output/playwright/units9-12-classroom/${unit.id}-q${i+1}-${width}.png` });
    await room.getByRole('button', { name: answer, exact: true }).click(); await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: i===12?'完成这一站':'下一题', exact:true }).click();
  }
});
