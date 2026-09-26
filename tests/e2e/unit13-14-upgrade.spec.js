'use strict';
const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const { EXAM, selectAnswer, finishExamFrom } = require('../support/unit13-14-exam');
const oldFlow = require('../fixtures/unit13-14-classroom-before/flow');
test.use({ reducedMotion: 'reduce', actionTimeout: 5000 });
async function oldEdition(page) {
  let old = true;
  for (const name of ['index.html', 'content.js', 'unit.js', 'unit.css']) {
    const body = await fs.readFile('tests/fixtures/unit13-14-classroom-before/' + name);
    const url = name === 'index.html' ? /\/unit13-14\/(?:index\.html)?(?:\?.*)?$/ : `**/unit13-14/${name}*`;
    await page.route(url, route => old ? route.fulfill({ body, contentType: name.endsWith('html') ? 'text/html' : name.endsWith('css') ? 'text/css' : 'text/javascript' }) : route.continue());
  }
  return () => { old = false; };
}

test('13–14 两题旧挑战完成后保留有效题，新增题亲自补完才重新领证', async ({ page }) => {
  test.setTimeout(90000); const upgrade = await oldEdition(page); await oldFlow.completeUnit1314(page);
  await page.goto('/unit13-14/#learn/words'); await page.locator('.stage-words').getByRole('button', { name: '下一组词卡', exact: true }).click();
  await page.goto('/unit13-14/#learn/certificate');
  await page.getByRole('textbox', { name: '证书上的名字', exact: true }).fill('配色小达人');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click();
  const date = await page.locator('#certificateDate').innerText(); await page.keyboard.press('Escape');
  upgrade(); await page.reload();
  await expect(page.locator('#starCount')).toHaveText('12');
  await expect(page.getByRole('textbox', { name: '证书上的名字', exact: true })).toHaveValue('配色小达人');
  await expect(page.getByRole('button', { name: '领取单元证书', exact: true })).toBeDisabled();
  await expect(page.locator('#wordPageProgress')).toHaveText('2 / 4'); await expect(page.locator('.stage-text .btext')).toHaveCount(13);
  for (const id of ['roles','colours','trans']) await expect(page.locator('.stage-'+id).getByRole('group', { name: '完成后的操作', exact: true })).toBeAttached();
  await page.getByRole('button', { name: '继续：配色小挑战', exact: true }).click(); const room = page.locator('.stage-exam');
  await expect(room).toContainText('第 3 / 10 题'); await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
  await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await finishExamFrom(page, 2); await expect(room).toContainText('首次独立答对 10 / 10');
  await room.getByRole('button', { name: '下一站：我的单元证书', exact: true }).click(); await expect(page.locator('#starCount')).toHaveText('15');
  await page.getByRole('button', { name: '领取单元证书', exact: true }).click(); await expect(page.locator('#certificateDate')).toHaveText(date); await page.keyboard.press('Escape');
  await page.goto('/unit13-14/#learn/exam'); await room.getByRole('button', { name: '再练一轮', exact: true }).click(); await page.reload();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
});

test('13–14 整课准备后，首次与断网复访翻词卡和剧情换物都没有加载闪屏', async ({ page, context }) => {
  test.setTimeout(60000);
  for(let visit=0;visit<2;visit++) {
    await page.goto('/lesson/unit13-14/#learn/words'); await expect(page.locator('#courseLoader')).toHaveCount(0);
    if(visit)await context.setOffline(true);
    await page.evaluate(()=>{
      window.paintFailures=[];window.watchCourse=true;
      const sample=frame=>{
        const id=location.hash.slice(1),room=document.getElementById(id);if(!room)return;
        const entry={hidden:document.documentElement.hasAttribute('data-course-painting')||getComputedStyle(room).visibility!=='visible',loader:!!document.getElementById('courseLoader'),missing:frame&&[...room.querySelectorAll('img')].filter(e=>!e.hidden&&e.getClientRects().length).some(e=>!e.complete||!e.naturalWidth)};
        if(Object.values(entry).some(Boolean))window.paintFailures.push(entry);
      };
      window.paintObserver=new MutationObserver(()=>sample(false));window.paintObserver.observe(document.documentElement,{subtree:true,attributes:true,childList:true});
      const frame=()=>{if(window.watchCourse){sample(true);requestAnimationFrame(frame);}};requestAnimationFrame(frame);
    });
    for(const name of ['下一组词卡','下一组词卡','下一组词卡','上一组词卡','上一组词卡','上一组词卡']){
      await page.locator('.stage-words').getByRole('button',{name,exact:true}).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    }
    await page.getByRole('link',{name:'一件新连衣裙',exact:true}).click();const room=page.locator('.stage-text');await room.getByRole('button',{name:'重新上演',exact:true}).click();
    for(let i=0;i<13;i++){await room.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
    const failures=await page.evaluate(()=>{window.watchCourse=false;window.paintObserver.disconnect();return window.paintFailures;});expect(failures).toEqual([]);
    await context.setOffline(false);
  }
});

test('13–14 旧草稿只是选择，升级、暂停与刷新都不代为判对', async ({ page }) => {
  const upgrade = await oldEdition(page); await page.goto('/unit13-14/#learn/exam'); const room = page.locator('.stage-exam');
  await selectAnswer(room, EXAM[0].answer); await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await selectAnswer(room, EXAM[1].answer); upgrade(); await page.reload();
  await expect(room.getByRole('button', { name: EXAM[1].answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1'); await expect(room.getByRole('status')).toBeEmpty();
  await room.getByRole('button', { name: '暂停，稍后继续', exact: true }).click(); await page.reload(); await room.getByRole('button', { name: '继续挑战', exact: true }).click();
  await expect(room.getByRole('button', { name: EXAM[1].answer, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1'); await expect(room.getByRole('status')).toBeEmpty();
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await expect(room.locator('.practice-options [aria-pressed="true"]')).toHaveCount(0);
});

test('13–14 缓存版断网刷新保留新增题的未提交词块，下一题仍为空', async ({ page, context }) => {
  test.setTimeout(60000); await page.goto('/lesson/unit13-14/#learn/exam'); const room = page.locator('.stage-exam');
  for (let i = 0; i < 7; i++) {
    await selectAnswer(room, EXAM[i].answer); await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  }
  await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: 'This', exact: true }).click();
  await context.setOffline(true); const response = await page.reload(); expect(response.headers()['x-course-offline']).toBe('1');
  await expect(room.getByRole('button', { name: '撤回 This', exact: true })).toBeVisible();
  await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '7'); await expect(room.getByRole('status')).toBeEmpty();
  for (const token of ['is', 'my', "father's", 'suit.']) await room.getByRole('group', { name: '待选词块', exact: true }).getByRole('button', { name: token, exact: true }).click();
  await room.getByRole('button', { name: '检查答案', exact: true }).click(); await room.getByRole('button', { name: '下一题', exact: true }).click();
  await expect(room).toContainText('第 9 / 10 题'); await expect(room.getByRole('button', { name: '检查答案', exact: true })).toBeDisabled();
  await context.setOffline(false);
});

test('13–14 完成整课加载后，刷新对白仍展示已读的最后一句', async ({ page, context }) => {
  // Keep real images and decoding, but model a device whose decoding spans a paint.
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      return decode.call(this).then(() => new Promise(resolve => setTimeout(resolve, 80)));
    };
  });
  await page.goto('/lesson/unit13-14/#learn/text'); await expect(page.locator('#courseLoader')).toHaveCount(0);
  const room = page.locator('.stage-text'), log = room.getByRole('log');
  for (let i=0; i<13; i++) await room.getByRole('button', { name:i?'下一句':'开始看课文', exact:true }).click();
  await context.setOffline(true); await page.reload(); await expect(page.locator('#courseLoader')).toHaveCount(0);
  await expect(room.locator('.dialogue-status')).toHaveText('13 / 13 句');
  await expect(log.locator('.bubble-row').last()).toBeInViewport({ ratio:1 });
});
