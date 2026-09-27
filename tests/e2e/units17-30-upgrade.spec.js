'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs/promises');
const {EXAMS,selectAnswer,finishExamFrom}=require('../support/units17-30-exam');
test.use({reducedMotion:'reduce',actionTimeout:5000});
async function oldEdition(page,pair){
 let old=true;for(const name of ['index.html','content.js','unit.js','unit.css']){
  const body=await fs.readFile(`tests/fixtures/unit${pair}-classroom-before/${name}`),url=name==='index.html'?new RegExp(`/unit${pair}/(?:index\\.html)?(?:\\?.*)?$`):`**/unit${pair}/${name}*`;
  await page.route(url,route=>old?route.fulfill({body,contentType:name.endsWith('html')?'text/html':name.endsWith('css')?'text/css':'text/javascript'}):route.continue());
 }return()=>{old=false;};
}
const TASK_UPGRADES={"17-18": [8, ["forms", "roles"]], "19-20": [7, ["observe", "be"]], "21-22": [4, ["listen", "roles", "observe"]], "23-24": [7, ["listen", "roles"]], "25-26": [4, ["listen", "observe", "roles"]], "27-28": [10, ["roles"]], "29-30": [8, ["roles", "be"]]};
for(const[pair,answers]of Object.entries(EXAMS)){
 test(`${pair} 真实旧两题通关升级保留姓名日期和旧练习，新题必须补做`,async({page})=>{
  test.setTimeout(90000);const flow=require(`../fixtures/unit${pair}-classroom-before/flow`),upgrade=await oldEdition(page,pair);await flow[`completeUnit${pair.replace('-','')}`](page);
  await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('升级小伙伴');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();const date=await page.locator('#certificateDate').innerText();await page.keyboard.press('Escape');
  await page.goto(`/unit${pair}/#learn/words`);await page.locator('.stage-words').getByRole('button',{name:'下一组词卡',exact:true}).click();upgrade();await page.reload();
  await expect(page.locator('#starCount')).toHaveText(String(TASK_UPGRADES[pair][0]));await expect(page.locator('#wordPageProgress')).toHaveText(/^2 \/ /);await expect(page.locator('.stage-text .btext')).toHaveCount(flow.DIALOGUE.length);
  for(const id of Object.keys(flow.ANSWERS).filter(x=>!['exam',...TASK_UPGRADES[pair][1]].includes(x)))await expect(page.locator('.stage-'+id).getByRole('group',{name:'完成后的操作',exact:true})).toBeAttached();
  await page.goto(`/unit${pair}/#learn/certificate`);await expect(page.getByRole('textbox',{name:'证书上的名字',exact:true})).toHaveValue('升级小伙伴');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
  await page.goto(`/unit${pair}/#learn/exam`);const room=page.locator('.stage-exam');await expect(room).toContainText(`第 ${pair==='21-22'?1:3} / ${answers.length} 题`);await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',pair==='21-22'?'0':'2');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
  if(pair!=='21-22')for(const id of TASK_UPGRADES[pair][1])await require('../support/units1-30-tasks').activity(page,pair,id);
  await page.goto('/unit'+pair+'/#learn/exam');
  if(pair==='21-22'){for(const id of ['listen','roles','observe','exam'])await require('../support/unit21-22-flow').finishRemainingActivity(page,id);}else await finishExamFrom(page,pair,2);await room.getByRole('button',{name:'下一站：我的单元证书',exact:true}).click();await expect(page.locator('#starCount')).toHaveText('15');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(page.locator('#certificateDate')).toHaveText(date);await page.keyboard.press('Escape');
  await page.goto(`/unit${pair}/#learn/exam`);await room.getByRole('button',{name:'再练一轮',exact:true}).click();await page.reload();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
 });
 test(`${pair} 缓存版复访断网可翻卡和看新场景，词块草稿刷新不代答`,async({page,context})=>{
  test.setTimeout(90000);await page.goto(`/lesson/unit${pair}/#learn/words`);await expect(page.locator('#courseLoader')).toHaveCount(0);
  await context.setOffline(true);const response=await page.reload();expect(response.headers()['x-course-offline']).toBe('1');await expect(page.locator('#courseLoader')).toHaveCount(0);
  await page.evaluate(()=>{
   window.paintFailures=[];window.watchCourse=true;
   const sample=frame=>{const room=document.getElementById(location.hash.slice(1));if(!room)return;const entry={hidden:document.documentElement.hasAttribute('data-course-painting')||getComputedStyle(room).visibility!=='visible',loader:!!document.getElementById('courseLoader'),missing:frame&&[...room.querySelectorAll('img')].filter(e=>!e.hidden&&e.getClientRects().length).some(e=>!e.complete||!e.naturalWidth)};if(Object.values(entry).some(Boolean))window.paintFailures.push(entry);};
   window.paintObserver=new MutationObserver(()=>sample(false));window.paintObserver.observe(document.documentElement,{subtree:true,attributes:true,childList:true});const frame=()=>{if(window.watchCourse){sample(true);requestAnimationFrame(frame);}};requestAnimationFrame(frame);
  });
  for(const name of ['下一组词卡','下一组词卡','上一组词卡','上一组词卡']){await page.locator('.stage-words').getByRole('button',{name,exact:true}).click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
  const cardFailures=await page.evaluate(()=>{window.watchCourse=false;window.paintObserver.disconnect();return window.paintFailures;});expect(cardFailures).toEqual([]);
  await page.goto(`/lesson/unit${pair}/#learn/text`);const text=page.locator('.stage-text'),total=require(`../support/unit${pair}-flow`).DIALOGUE.length;
  for(let i=0;i<total;i++)await text.getByRole('button',{name:i?'下一句':'开始看课文',exact:true}).click();
  await expect.poll(()=>text.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);
  await page.reload();await expect(text.getByRole('log').locator('.bubble-row').last()).toBeInViewport({ratio:1});
  await page.goto(`/lesson/unit${pair}/#learn/exam`);const room=page.locator('.stage-exam'),order=answers.findIndex(Array.isArray);
  for(const answer of answers.slice(0,order)){await selectAnswer(room,answer);await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();}
  await selectAnswer(room,[answers[order][0]]);await page.reload();await expect(room.getByRole('status')).toBeEmpty();await expect(room.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(order));await expect(room.getByRole('button',{name:'撤回 '+answers[order][0],exact:true})).toBeVisible();
  await selectAnswer(room,answers[order].slice(1));await room.getByRole('button',{name:'检查答案',exact:true}).click();await room.getByRole('button',{name:'下一题',exact:true}).click();await expect(room.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();await expect(room.locator('.practice-options [aria-pressed=true]')).toHaveCount(0);await context.setOffline(false);
 });
}
