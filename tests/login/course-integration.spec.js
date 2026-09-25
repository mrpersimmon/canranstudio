'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const { isFeedbackAudio } = require('../support/course-resource-urls');
const { completeUnit34 } = require('../support/unit3-4-flow');
const { completeUnit56 } = require('../support/unit5-6-flow');

for (const { id, lesson, complete } of [
  { id: 'unit3-4', lesson: '3–4', complete: completeUnit34 },
  { id: 'unit5-6', lesson: '5–6', complete: completeUnit56 }
]) test(`${lesson} 登录后无配音通关，证书与真实成果跨设备保留`, async ({ page, browser }) => {
  test.setTimeout(150000);
  await adminLogin(page);
  const account = await createStudent(page, `整合验收 ${lesson}`, '合并体验', [new RegExp(`Lesson ${lesson} `)]);
  const student = await studentLogin(browser, account);
  let second;
  const voices = [], errors = [], spoken = [];
  try {
    await student.page.emulateMedia({ reducedMotion: 'reduce' });
    student.page.on('pageerror', error => errors.push(error.message));
    student.context.on('request', request => {
      if (/\.(mp3|ogg|wav)(\?|$)/.test(request.url()) && !isFeedbackAudio(request.url())) voices.push(request.url());
    });
    await student.page.exposeFunction('reportUnexpectedSpeech', text => spoken.push(text));
    await student.page.addInitScript(() => {
      speechSynthesis.speak = utterance => window.reportUnexpectedSpeech(utterance.text);
      HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Audio unavailable', 'NotSupportedError'));
    });
    await student.page.goto(`/lesson/${id}/#learn/certificate`);
    await expect(student.page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
    await complete(student.page, '/lesson');
    await student.page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('合并体验');
    await student.page.getByRole('button', { name: '领取单元证书', exact: true }).click();
    await expect(student.page.getByRole('dialog')).toContainText(`完成 Lesson ${lesson} 课堂配套练习`);
    await student.page.keyboard.press('Escape');
    await expect(student.page.locator('#studentSyncStatus')).toHaveText('学习成果已同步');

    second = await studentLogin(browser, account);
    await expect(second.page.locator('.course')).toContainText('15 / 15');
    await second.page.goto(`/lesson/${id}/#learn/certificate`);
    await expect(second.page.locator('#starCount')).toHaveText('15');
    await expect(second.page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('合并体验');
    await expect(second.page.getByRole('button', { name: '领取单元证书', exact: true })).toBeEnabled();
    expect(voices).toEqual([]); expect(spoken).toEqual([]); expect(errors).toEqual([]);
  } finally { await student.context.close(); await second?.context.close(); }
});

test('登录后的词卡首访与复访换组不闪屏，授权课程内断网仍能翻卡', async ({ page, browser }, testInfo) => {
  await adminLogin(page);
  const account = await createStudent(page, '整合词卡验收', '翻卡体验', [/Lesson 5–6 /]);
  const student = await studentLogin(browser, account);
  try {
    await student.page.setViewportSize({ width: 390, height: 844 });
    for (let visit = 0; visit < 2; visit++) {
      await student.page.goto('/lesson/unit5-6/#learn/words');
      await expect(student.page.locator('#courseLoader')).toHaveCount(0);
      await expect(student.page.locator('.unit-word').first()).toBeVisible();
      if (visit) await student.context.setOffline(true);
      await student.page.evaluate(() => {
        window.transitionFailures = []; window.watchWords = true;
        const sample = frame => {
          const room = document.querySelector('.stage-words');
          const failure = {
            hidden: document.documentElement.hasAttribute('data-course-painting') || getComputedStyle(room).visibility !== 'visible',
            loader: !!document.getElementById('courseLoader'),
            incomplete: frame && [...room.querySelectorAll('img')].some(img => !img.complete || !img.naturalWidth)
          };
          if (Object.values(failure).some(Boolean)) window.transitionFailures.push(failure);
        };
        window.wordsObserver = new MutationObserver(() => sample(false));
        window.wordsObserver.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
        const frame = () => { if (window.watchWords) { sample(true); requestAnimationFrame(frame); } }; requestAnimationFrame(frame);
      });
      for (const [label, pages] of [['下一组词卡', [2, 3, 4]], ['上一组词卡', [3, 2, 1]]]) {
        for (const group of pages) {
          await student.page.getByRole('button', { name: label, exact: true }).click();
          await expect(student.page.locator('#wordPageProgress')).toHaveText(`${group} / 4`);
          await student.page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        }
      }
      const failures = await student.page.evaluate(() => { window.watchWords = false; window.wordsObserver.disconnect(); return window.transitionFailures; });
      await testInfo.attach(`word-visit-${visit}.json`, { body: JSON.stringify(failures), contentType: 'application/json' });
      expect(failures).toEqual([]);
    }
  } finally { await student.context.close(); }
});
