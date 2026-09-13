'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { createServer } = require('./serve-learning-path');
const { seedPicture } = require('./check-answer-feedback');
const unit = require('../content/learning-course.json');
const {setup}=require('../tests/unit/support/course-harness');

async function main() {
  const seed = seedPicture(), attempt = seed.records[seed.key].value.placement.attempts.friends;
  const question = unit.placement.questions.find(q => q.id === attempt.questionIds[attempt.cursor]);
  const pencil = unit.entities[question.options.find(o => question.answer.includes(o.id)).entityId].assetSrc;
  let release, holdURL=pencil;
  let held = new Promise(resolve => { release = resolve; });
  const server = createServer(), serve = server.listeners('request')[0], requests = [];
  server.removeAllListeners('request');
  server.on('request', async (req, res) => {
    requests.push(req.url);
    if (req.url === holdURL) await held;
    if (!res.destroyed) serve(req, res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch(), context = await browser.newContext({viewport:{width:820,height:1180}});
  const page = await context.newPage(), report = {status:'running',cases:[]};
  await page.addInitScript(({key, record}) => {
    if (!sessionStorage.getItem('seeded')) {localStorage.setItem(key,JSON.stringify(record));sessionStorage.setItem('seeded','yes');}
    const NativeAudio=window.Audio;window.canplaySources=[];
    window.Audio=function(src){const audio=new NativeAudio(src);audio.addEventListener('canplay',()=>canplaySources.push(audio.src));return audio;};
    window.Audio.prototype=NativeAudio.prototype;
    const play=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(){return window.startDelay?new Promise((resolve,reject)=>setTimeout(()=>play.call(this).then(resolve,reject),window.startDelay)):play.call(this);};
  }, {key:seed.key,record:seed.records[seed.key]});
  try {
    await page.goto('http://127.0.0.1:' + server.address().port + '/');
    await page.locator('.journey-app').waitFor();
    await page.locator('[data-action="open-placement"][data-id="friends"]').click();
    await page.locator('[data-action="placement-start"]').click();
    await page.getByRole('heading',{name:'正在准备本关',exact:true}).waitFor({timeout:5000});
    assert.equal(await page.locator('.lp-exercise').count(),0);
    release();
    await page.locator('.lp-exercise').waitFor();
    assert.equal(await page.locator('.lp-exercise').getAttribute('data-exercise-id'), question.id);
    assert.ok(await page.locator('.lp-option-image').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)));
    assert.ok(await page.evaluate(src=>canplaySources.includes(new URL(src,location.href).href),unit.sources[question.listenRefs[0]].audioSrc),'the current placement recording is playable before its button is offered');
    for (const id of attempt.questionIds) {
      const q=unit.placement.questions.find(q=>q.id===id);
      for (const ref of new Set([...q.listenRefs,q.sourceRef])) if(unit.sources[ref]?.audioSrc) assert.ok(requests.includes(unit.sources[ref].audioSrc), 'prepare the actual saved question set: '+ref);
    }
    await context.setOffline(true);
    await page.evaluate(()=>{window.startDelay=1000;});
    await page.locator('[data-action="exercise-listen"][data-id="'+question.listenRefs[0]+'"]').click();
    await page.locator('.lp-audio-wait[aria-label="正在准备声音…"]').waitFor({timeout:750});
    assert.equal(await page.locator('[data-action="exercise-listen"][data-id="'+question.listenRefs[0]+'"]').isDisabled(),true,'waiting speech suppresses duplicate play requests');
    await page.locator('[data-action="exercise-select"][data-id="'+question.answer[0]+'"]').click();
    await page.locator('[data-action="placement-check"]').click();
    await page.locator('.lp-feedback-success').waitFor();
    await page.reload();
    await page.locator('.journey-app').waitFor();
    await page.locator('[data-action="open-placement"][data-id="friends"]').click();
    await page.locator('[data-action="placement-start"]').click();
    await page.locator('.lp-feedback-success').waitFor();
    assert.equal(await page.locator('.lp-exercise').getAttribute('data-exercise-id'), question.id);
    report.cases.push('saved placement set prepared before display; offline answer and feedback survive reload');
    await context.close();
    const h=setup();for(const id of ['K01','K03','K04'])h.finish(id);
    const challengePage=await browser.newPage({viewport:{width:820,height:1180}});
    await challengePage.addInitScript(({key,record})=>localStorage.setItem(key,JSON.stringify(record)),{key:h.rt.storageKey,record:h.adapter.load(h.rt.storageKey)});
    holdURL=unit.sources[unit.challenges[0].questions[0].sourceRef].audioSrc;
    held=new Promise(resolve=>{release=resolve;});
    await challengePage.goto('http://127.0.0.1:'+server.address().port+'/');await challengePage.locator('.journey-app').waitFor();
    await challengePage.locator('.journey-nav-item[data-action="journey-nav"][data-id="review"]').click();
    await challengePage.locator('[data-action="open-challenge"][data-id="CH12"]').click();
    await challengePage.locator('[data-action="challenge-start"]').click();
    await challengePage.getByRole('heading',{name:'正在准备本关',exact:true}).waitFor({timeout:5000});
    release();await challengePage.locator('.lp-exercise').waitFor();
    assert.equal(await challengePage.locator('.lp-exercise').getAttribute('data-exercise-id'),'CH12-1:tap');
    report.cases.push('optional challenge prepares its actual questions, including later reference recordings');
    await challengePage.close();
    const reviewRecord=h.adapter.load(h.rt.storageKey),targets=['v3.5:listen-watch','v3.5:listen-confirmation'];
    for(const result of Object.values(reviewRecord.value.results))result.nextDueDay=targets.includes(result.activityId)?'2026-08-0'+(targets.indexOf(result.activityId)+1):'2099-01-01';
    const reviewPage=await browser.newPage({viewport:{width:820,height:1180}});
    await reviewPage.addInitScript(({key,record})=>localStorage.setItem(key,JSON.stringify(record)),{key:h.rt.storageKey,record:reviewRecord});
    holdURL=unit.activities[targets[1]].requiredAudio[1].src;
    const reviewStart=requests.length;
    held=new Promise(resolve=>{release=resolve;});
    await reviewPage.goto('http://127.0.0.1:'+server.address().port+'/');await reviewPage.locator('.journey-app').waitFor();
    await reviewPage.locator('.journey-nav-item[data-id="review"]').click();await reviewPage.locator('[data-action="review"]').click();
    const deadline=Date.now()+5000;
    while(!requests.slice(reviewStart).includes(holdURL)&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,20));
    assert.ok(requests.slice(reviewStart).includes(holdURL),'prepare later review audio before showing the first activity');
    await reviewPage.getByRole('heading',{name:'正在准备本关',exact:true}).waitFor();
    // A later review recording is held. The first activity must still wait.
    assert.equal(await reviewPage.locator('.lp-sound-prompt').count(),0);
    release();await reviewPage.locator('.lp-sound-prompt').waitFor();
    report.cases.push('review prepares the complete selected queue before the first activity');await reviewPage.close();
    const bookPage=await browser.newPage({viewport:{width:820,height:1180}});
    holdURL='/poc/lesson-1-2/course/audio/l01-d04.mp3';held=new Promise(resolve=>{release=resolve;});const bookStart=requests.length;
    await bookPage.goto('http://127.0.0.1:'+server.address().port+'/');await bookPage.locator('.journey-app').waitFor();
    await bookPage.locator('[data-action="journey-book"][data-id="1"]').click();
    const bookDeadline=Date.now()+5000;while(!requests.slice(bookStart).includes(holdURL)&&Date.now()<bookDeadline)await new Promise(resolve=>setTimeout(resolve,20));
    assert.ok(requests.slice(bookStart).includes(holdURL),'book reference recordings are prepared when opening the lesson');
    await bookPage.getByRole('heading',{name:'正在准备本关',exact:true}).waitFor();release();
    await bookPage.locator('[data-action="reference-play"][data-id="L01-D04"]').waitFor();
    report.cases.push('opening lesson references also prepares their recordings');await bookPage.close();
    report.status='passed';
  } finally {
    release();fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/level-preparation-modes.json',JSON.stringify(report,null,2)+'\n');
    await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));
  }
  console.log(JSON.stringify(report));
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={main};
