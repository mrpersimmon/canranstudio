'use strict';
const { test, expect } = require('@playwright/test');
const { isFeedbackAudio } = require('../support/course-resource-urls');
const { DIALOGUE, ANSWERS, completeActivity, completeUnit34 } = require('../support/unit3-4-flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 6000 });
const output = 'output/playwright/unit3-4-no-voice/';

async function choose(room, answer) {
  if (Array.isArray(answer)) {
    for (const token of answer) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  } else await room.locator('.practice-options').getByRole('button', { name: answer, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('答对了！');
}

test('全部声音失败仍能完成21题与完整原文并领奖，零英语配音或系统朗读', async ({ page }) => {
  test.setTimeout(120000);
  const voices = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { window.speechCalls = 0; speechSynthesis.speak = () => { window.speechCalls++; }; });
  await page.route(/\.(mp3|wav|ogg)(\?|$)/, route => {
    if (!isFeedbackAudio(route.request().url())) voices.push(route.request().url());
    return route.abort();
  });
  await page.goto('/lesson/unit3-4/#learn/certificate');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await completeUnit34(page, '/lesson');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('小雨');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '雨伞认领小帮手纪念', exact: true });
  await expect(dialog).toContainText('完成 Lesson 3–4 课堂配套练习');
  await page.keyboard.press('Escape'); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('15');
  await expect(page.getByRole('button', { name: /听一遍|重听|播放|开始听/ })).toHaveCount(0);
  expect(await page.evaluate(() => window.speechCalls)).toBe(0);
  expect(voices).toEqual([]); expect(errors).toEqual([]);
});

test('反馈音真实结束，错答只重试且不泄题', async ({ page }) => {
  const voices = [];
  page.on('request', request => { if (/\.mp3/.test(request.url()) && !isFeedbackAudio(request.url())) voices.push(request.url()); });
  await page.addInitScript(() => {
    window.soundEvents = []; const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      const item = { src: this.src, ended: false }; window.soundEvents.push(item);
      this.addEventListener('ended', () => { item.ended = true; }, { once: true }); return Reflect.apply(play, this, args);
    };
  });
  await page.goto('/unit3-4/#learn/listen'); const room = page.locator('.stage-listen');
  await room.getByRole('button', { name: 'ticket', exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await expect.poll(() => page.evaluate(() => window.soundEvents.some(event => event.ended && event.src.endsWith('duolingo-incorrect.mp3')))).toBe(true);
  await room.getByRole('button', { name: '再试一次', exact: true }).click(); await choose(room, 'umbrella');
  await expect.poll(() => page.evaluate(() => window.soundEvents.some(event => event.ended && event.src.endsWith('duolingo-correct.mp3')))).toBe(true);
  await page.getByRole('button', { name: '学习手记', exact: true }).click();
  await expect(page.locator('#learningRecord')).toContainText('修正后完成'); expect(voices).toEqual([]);
});

test('12句原文可续读和翻译，末句主动完成，只有对话内部滚动', async ({ page }) => {
  await page.goto('/unit3-4/#learn/roles'); await page.getByRole('button', { name: '先看故事', exact: true }).click();
  const room = page.locator('.stage-text');
  for (let i = 0; i < DIALOGUE.length; i++) {
    const advance = room.getByRole('button', { name: i ? '下一句' : '开始看课文', exact: true });
    await advance.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await advance.click();
    await expect(room.locator('.btext span')).toHaveText(DIALOGUE.slice(0, i + 1));
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
    await expect(room.locator('button.btext')).toHaveCount(0);
    if (i === 2) { await page.reload(); await expect(room.locator('.bubble-row')).toHaveCount(3); }
  }
  await expect(page.locator('#starCount')).toHaveText('0');
  await expect(room.locator('.cloakroom-props')).toHaveAttribute('data-beat', 'returned');
  const last = room.locator('.bubble-row').last(); await last.getByRole('button', { name: '看中文', exact: true }).click();
  await expect(last).toContainText('非常感谢！');
  await room.getByRole('button', { name: '完成课文', exact: true }).click();
  await expect(page.locator('#starCount')).toHaveText('1');
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.screenshot({ path: output + 'story-complete.png' });
  await room.getByRole('button', { name: '下一站：故事小侦探', exact: true }).click();
  await expect(page.locator('.stage-roles')).toContainText('客人说哪一件不是自己的？');
});

test('七个词义任务不以图配图，末三题刷新不代答，重练清空本轮', async ({ page }) => {
  await page.goto('/unit3-4/#learn/listen'); const room = page.locator('.stage-listen');
  for (let i = 0; i < ANSWERS.listen.length; i++) {
    const check = room.getByRole('button', { name: '检查答案', exact: true });
    await expect(check).toBeDisabled(); await expect(room.locator('.practice-options img')).toHaveCount(0);
    await expect(room.getByRole('button', { name: /听一遍|给点线索/ })).toHaveCount(0);
    if (i >= 4) { await page.reload(); await expect(check).toBeDisabled(); await expect(room.getByRole('button', { name: ANSWERS.listen[i], exact: true })).toHaveAttribute('aria-pressed', 'false'); }
    await choose(room, ANSWERS.listen[i]);
    await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1));
    await room.getByRole('button', { name: i === 6 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(room.getByRole('button', { name: '下一站：衣帽间小剧场', exact: true })).toBeVisible();
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

test('25张音标词卡可翻面，15问和10组否定回应仍供阅读', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 }); await page.goto('/unit3-4/#learn/words');
  const room = page.locator('.stage-words');
  const phonetics = ['/ʌmˈbrelə/','/ˈtɪkɪt/','/ˈkloʊkruːm/','/suːt/','/skuːl/','/ˈtiːtʃɚ/','/sʌn/','/ˈdɑːt̬ɚ/','/pen/','/ˈpensəl/','/bʊk/','/wɑːtʃ/','/koʊt/','/dres/','/skɝːt/','/ʃɝːt/','/kɑːr/','/haʊs/','/pliːz/','/hɪr/','/maɪ/','/ˈnʌmbɚ/','/faɪv/','/ˈsɔːri/','/sɝː/'];
  await expect(room.getByRole('button', { name: '上一组词卡', exact: true })).toBeDisabled();
  for (let start = 0; start < 25; start += 6) {
    const cards = room.locator('.unit-word'); await expect(cards.locator('.word-phonetic')).toHaveText(phonetics.slice(start, start + 6));
    for (const card of await cards.all()) {
      await card.click(); await expect(card.locator('.word-meaning')).toBeVisible();
      expect(await card.evaluate(el => el.scrollWidth <= el.clientWidth + 2 && el.scrollHeight <= el.clientHeight + 2)).toBe(true);
      await card.click(); await expect(card.locator('.word-meaning')).toBeHidden();
    }
    if (start < 24) await room.getByRole('button', { name: '下一组词卡', exact: true }).click();
  }
  await page.reload(); await expect(room).toContainText('5 / 5');
  await room.getByRole('button', { name: '下一站：单词寻宝', exact: true }).click(); await expect(page).toHaveURL(/#learn\/listen$/);
  await page.goto('/unit3-4/#learn/phrases'); const phrases = page.locator('.stage-phrases');
  await expect(phrases.locator('button.phrase-card')).toHaveCount(0);
  await phrases.getByText('换个人或物问一问', { exact: true }).click();
  await expect(phrases.locator('.sentence-models').first().locator('.reference-card')).toHaveCount(15);
  await phrases.getByText('不是我的，是你的', { exact: true }).click();
  for (const word of ['pen','pencil','book','watch','coat','dress','skirt','shirt','car','house']) await expect(phrases.getByText(`No. It isn't my ${word}. It's your ${word}.`, { exact: true })).toBeVisible();
});

for (const width of [320, 1280]) test(width + '柜台答对才交接，灯泡和按钮稳定，结束动作集中', async ({ page }) => {
  await page.setViewportSize({ width, height: 844 }); await page.goto('/unit3-4/#learn/manners');
  const room = page.locator('.stage-manners'), check = room.getByRole('button', { name: '检查答案', exact: true });
  const actions = room.getByRole('group', { name: '作答操作', exact: true });
  const y = () => actions.evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(() => document.fonts.ready); const startY = await y();
  const hint = room.getByRole('button', { name: '给点线索', exact: true });
  const h = await hint.boundingBox(), c = await check.boundingBox(); expect(h.x + h.width).toBeLessThan(c.x);
  await hint.click(); expect(await y()).toBeCloseTo(startY, 0);
  await room.getByRole('button', { name: 'Sorry, sir.', exact: true }).click(); await check.click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await expect(room.locator('.counter-stage')).toHaveAttribute('data-confirmed', 'false'); expect(await y()).toBeCloseTo(startY, 0);
  await room.getByRole('button', { name: '再试一次', exact: true }).click();
  for (let i = 0; i < 4; i++) {
    await room.locator('.practice-options').getByRole('button', { name: ANSWERS.manners[i], exact: true }).click();
    await expect(room.locator('.counter-stage')).toHaveAttribute('data-confirmed', 'false');
    const before = await y(); await check.click(); await expect(room.locator('.counter-stage')).toHaveAttribute('data-confirmed', 'true');
    expect(await y()).toBeCloseTo(before, 0);
    if (i === 3) {
      await expect(room.locator('.counter-item')).toHaveClass(/is-returned/); await page.reload();
      await expect(room.locator('.counter-item')).toHaveClass(/is-returned/); await room.screenshot({ path: output + 'counter-returned-' + width + '.png' });
    }
    await room.getByRole('button', { name: i === 3 ? '完成这一站' : '下一题', exact: true }).click();
  }
  await expect(room).toContainText('雨伞领回来了！');
  await expect(room.getByRole('group', { name: '完成后的操作', exact: true }).getByRole('button')).toHaveCount(2);
  await room.screenshot({ path: output + 'counter-finish-' + width + '.png' });
  await room.getByRole('button', { name: '再练一轮', exact: true }).click();
  await expect(room.locator('.counter-stage')).toHaveAttribute('data-confirmed', 'false');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
});

for (const width of [320, 390, 768, 1280]) test(width + '宽度可阅读操作，帮助关闭回到原按钮', async ({ page }) => {
  await page.setViewportSize({ width, height: 740 }); const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const id of ['words', 'text', 'listen', 'manners', 'reply', 'exam', 'certificate']) {
    await page.goto('/unit3-4/#learn/' + id); const room = page.locator('.stage-' + id);
    await expect(room.getByRole('heading').first()).toBeInViewport();
    if (id === 'text') {
      await room.getByRole('button', { name: '开始看课文', exact: true }).click();
      await room.getByRole('button', { name: '下一句', exact: true }).click();
      expect((await room.locator('.bubble').nth(1).boundingBox()).height).toBeLessThan(160);
      await room.locator('.bubble').nth(1).getByRole('button', { name: '看中文', exact: true }).click();
      const log = await room.locator('.dialogue-log').boundingBox();
      const props = await room.locator('.cloakroom-props').boundingBox();
      if (width <= 600) {
        expect(log.width).toBeGreaterThan(width * .72);
        expect(props.y + props.height).toBeLessThanOrEqual(log.y);
        for (const actor of await room.locator('.dialogue-actor').all()) {
          const box = await actor.boundingBox(); expect(box.y + box.height).toBeLessThanOrEqual(log.y);
        }
      }
      const next = await room.getByRole('button', { name: '下一句', exact: true }).boundingBox();
      const restart = await room.getByRole('button', { name: '重新上演', exact: true }).boundingBox();
      expect(next.y).toBeCloseTo(restart.y, 0);
      expect(restart.x + restart.width).toBeLessThan(next.x);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect.poll(() => room.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    await room.getByRole('button', { name: '怎么玩', exact: true }).click(); await page.keyboard.press('Escape');
    await expect(room.getByRole('button', { name: '怎么玩', exact: true })).toBeFocused();
    if ([390,1280].includes(width)) await room.screenshot({ path: output + id + '-' + width + '.png' });
  }
  expect(errors).toEqual([]);
});

test('接力词块可撤回，未知归属不猜，末题刷新没有自动作答', async ({ page }) => {
  await page.goto('/unit3-4/#learn/reply'); const room = page.locator('.stage-reply');
  await choose(room, 'your'); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: 'No.', exact: true }).click();
  await room.getByRole('button', { name: '撤回 No.', exact: true }).click();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await choose(room, ANSWERS.reply[1]); await page.reload();
  await expect(room.getByRole('status')).toHaveText('答对了！');
  await room.getByRole('button', { name: '下一题', exact: true }).click();
  await room.getByRole('button', { name: "No. It isn't my umbrella. It's your umbrella.", exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click();
  await expect(room.getByRole('status')).toHaveText('再看看，试一次。');
  await room.getByRole('button', { name: '再试一次', exact: true }).click(); await choose(room, "No, it isn't.");
  await room.getByRole('button', { name: '下一题', exact: true }).click(); await page.reload();
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(room).toContainText('It’s your pen.'); await choose(room, '你的');
  await room.getByRole('button', { name: '完成这一站', exact: true }).click();
  await expect(room.getByRole('button', { name: '下一站：认领小挑战', exact: true })).toBeVisible();
});

test('实际证书PNG、单页A4和练习纸导出，两条路径成绩独立', async ({ page }) => {
  test.setTimeout(120000); await completeUnit34(page);
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('小雨');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '雨伞认领小帮手纪念', exact: true });
  const firstDate = await dialog.locator('#certificateDate').textContent();
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: '保存图片', exact: true }).click();
  await (await download).saveAs(output + 'certificate.png');
  await page.emulateMedia({ media: 'print' });
  const certificate = await page.pdf({ path: output + 'certificate.pdf', preferCSSPageSize: true, printBackground: true });
  expect(certificate.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.emulateMedia({ media: 'screen' }); await page.keyboard.press('Escape'); await page.reload();
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  await expect(dialog.locator('#certificateDate')).toHaveText(firstDate); await page.keyboard.press('Escape');
  await page.getByText('和家人再试试', { exact: true }).click();
  await expect(page.locator('.writing-lines li')).toHaveCount(4); await expect(page.locator('.reply-writing li')).toHaveCount(10);
  await page.evaluate(() => { window.print = () => {}; }); await page.getByRole('button', { name: '打印练习纸', exact: true }).click();
  await page.emulateMedia({ media: 'print' });
  const sheet = await page.pdf({ path: output + 'writing.pdf', preferCSSPageSize: true, printBackground: true });
  expect(sheet.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
  await page.emulateMedia({ media: 'screen' }); await page.goto('/lesson/unit3-4/#learn/certificate');
  await expect(page.locator('#starCount')).toHaveText('0');
});

test('首页进入图鉴，旧拼句和提问地址继续到现行活动', async ({ page }) => {
  await page.goto('/lesson/'); await page.getByRole('link', { name: '开始学习：雨伞认领小帮手', exact: true }).click();
  await expect(page).toHaveURL(/#learn\/words$/);
  for (const [oldRoute, current] of [['trans','reply'], ['ask','exam']]) {
    await page.goto('/lesson/unit3-4/#learn/' + oldRoute); await expect(page).toHaveURL(new RegExp('#learn/' + current + '$'));
    await expect(page.locator('.stage-' + current).getByRole('heading').first()).toBeInViewport();
  }
  await page.getByRole('link', { name: '我的课程', exact: true }).click();
  await expect(page.getByRole('link', { name: '继续学习：雨伞认领小帮手', exact: true })).toHaveAttribute('href', '/lesson/unit3-4/#learn/exam');
});

test('整课准备后断网仍能翻后组词卡、刷新续练，缓存不请求英语录音', async ({ page, context }) => {
  const voices = [];
  page.on('request', request => { if (/\.mp3/.test(request.url()) && !isFeedbackAudio(request.url())) voices.push(request.url()); });
  await page.goto('/lesson/unit3-4/#learn/words'); const words = page.locator('.stage-words');
  await expect(words.getByRole('button', { name: '下一组词卡', exact: true })).toBeVisible();
  await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await context.setOffline(true); await page.reload(); await expect(words).toContainText('2 / 5');
  for (let i = 0; i < 3; i++) await words.getByRole('button', { name: '下一组词卡', exact: true }).click();
  await expect(words).toContainText('5 / 5');
  await expect.poll(() => words.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await words.getByRole('button', { name: '下一站：单词寻宝', exact: true }).click();
  await choose(page.locator('.stage-listen'), 'umbrella'); await page.reload();
  await expect(page.locator('.stage-listen').getByRole('status')).toHaveText('答对了！'); expect(voices).toEqual([]);
});
