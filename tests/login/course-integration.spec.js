'use strict';
const { test, expect } = require('@playwright/test');
const { adminLogin, createStudent, studentLogin } = require('./helpers');
const { isFeedbackAudio } = require('../support/course-resource-urls');
const { completeUnit34 } = require('../support/unit3-4-flow');
const { completeUnit56 } = require('../support/unit5-6-flow');
const { completeUnit78 } = require('../support/unit7-8-flow');
const { completeUnit910 } = require('../support/unit9-10-flow');
const { completeUnit1112 } = require('../support/unit11-12-flow');
const { completeUnit1314 } = require('../support/unit13-14-flow');

test('7–8 旧服务器真实完成记录换新设备后保留9星，新her题和七道挑战重答才恢复证书',async({browser})=>{
  test.setTimeout(120000);
  const fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
  const {createApp}=require('../../server/app'),{openStore}=require('../../server/store');
  const {signIn}=require('./helpers'),legacy=require('../fixtures/unit7-8-classroom-before/flow');
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'canran-unit78-upgrade-')),oldRoot=path.join(directory,'old'),dataDir=path.join(directory,'data');
  const root=path.resolve(__dirname,'../..'),origin='http://127.0.0.1:4199';
  let server,first,second,third;
  const start=async source=>{server=await createApp({root:source,dataDir,origin,basePath:'/'});await new Promise(resolve=>server.listen(4199,'127.0.0.1',resolve));};
  try{
    await fs.mkdir(oldRoot);
    for(const entry of await fs.readdir(root,{withFileTypes:true})){
      if(entry.name.startsWith('.')||entry.name==='unit7-8')continue;
      if(entry.isDirectory()&&/^unit\d+-\d+$/.test(entry.name)){
        await fs.mkdir(path.join(oldRoot,entry.name));
        for(const name of await fs.readdir(path.join(root,entry.name)))await fs.symlink(path.join(root,entry.name,name),path.join(oldRoot,entry.name,name));
      }else await fs.symlink(path.join(root,entry.name),path.join(oldRoot,entry.name));
    }
    await fs.mkdir(path.join(oldRoot,'unit7-8'));
    for(const name of ['index.html','content.js','unit.js','unit.css'])await fs.copyFile(path.join(root,'tests/fixtures/unit7-8-classroom-before',name),path.join(oldRoot,'unit7-8',name));
    const store=openStore(dataDir);store.setAdmin('teacher','Test-only-classroom-2026!');store.close();await start(oldRoot);
    first=await browser.newContext({baseURL:origin});const old=await first.newPage();await adminLogin(old,'/');
    const account=await createStudent(old,'采访升级验收','小记者',[/Lesson 7–8 /]);await signIn(old,account,'/');await legacy.completeUnit78(old);
    await old.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('档案小记者');await old.getByRole('button',{name:'领取单元证书',exact:true}).click();await old.keyboard.press('Escape');await expect(old.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    await first.close();first=null;await new Promise(resolve=>server.close(resolve));server=null;await start(root);
    second=await browser.newContext({baseURL:origin});const current=await second.newPage();await signIn(current,account,'/');await expect(current.locator('.course')).toContainText('9 / 15');
    await current.goto('/unit7-8/#learn/certificate');await expect(current.locator('#starCount')).toHaveText('9');await expect(current.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('档案小记者');await expect(current.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
    await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');await current.reload();
    await current.goto('/unit7-8/#learn/interview');const room=current.locator('.stage-interview');await expect(room).toContainText('第 2 / 4 题');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
    await room.getByRole('button',{name:"What's her job?",exact:true}).click();await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();
    for(let i=2;i<4;i++){await current.reload();await expect(room.getByRole('status')).toContainText('答对了！');await room.getByRole('button',{name:i===3?'完成这一站':'下一题',exact:true}).click();}
    await current.goto('/unit7-8/#learn/exam');await expect(current.locator('.stage-exam')).toContainText('第 4 / 10 题');await require('../support/unit7-8-exam').finishExamFrom(current,3);
    await expect(current.locator('#starCount')).toHaveText('15');await expect(current.locator('#studentSyncStatus')).toHaveText('学习成果已同步');
    third=await browser.newContext({baseURL:origin});const restored=await third.newPage();await signIn(restored,account,'/');await expect(restored.locator('.course')).toContainText('15 / 15');await restored.goto('/unit7-8/#learn/certificate');await expect(restored.getByRole('button',{name:'领取单元证书',exact:true})).toBeEnabled();await expect(restored.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('档案小记者');
  }finally{await first?.close();await second?.close();await third?.close();if(server)await new Promise(resolve=>server.close(resolve));await fs.rm(directory,{recursive:true,force:true});}
});

for (const { id, lesson, complete } of [
  { id: 'unit3-4', lesson: '3–4', complete: completeUnit34 },
  { id: 'unit5-6', lesson: '5–6', complete: completeUnit56 },
  { id: 'unit7-8', lesson: '7–8', complete: completeUnit78 },
  { id: 'unit9-10', lesson: '9–10', complete: completeUnit910 },
  { id: 'unit11-12', lesson: '11–12', complete: completeUnit1112 },
  { id: 'unit13-14', lesson: '13–14', complete: completeUnit1314 }
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
