'use strict';
// Observe the real controller at every DOM mutation, including transitions
// shorter than one animation frame. Only native play start is held for probes;
// playing/ended and the release installer/service worker remain native.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { createServer } = require('./serve-learning-path');
const { seedPicture } = require('./check-answer-feedback');
const { setup } = require('../tests/unit/support/course-harness');
const unit = require('../content/learning-course.json');

async function observe(page, seed) {
  await page.addInitScript(({key,record}) => {
    if (key && !sessionStorage.getItem('playback-seed')) {
      localStorage.setItem(key, JSON.stringify(record)); sessionStorage.setItem('playback-seed', 'yes');
    }
    window.playbackProbe = { events: [], observations: [], active: false, delay: 0, plays: 0, pendingStarts: 0 };
    const probe = window.playbackProbe, NativeAudio = Audio;
    window.Audio = function(src) {
      const audio = new NativeAudio(src);
      for (const type of ['playing','waiting','ended','error']) audio.addEventListener(type, () => probe.events.push({type,src,at:performance.now()}));
      return audio;
    };
    window.Audio.prototype = NativeAudio.prototype;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
      probe.plays++;
      if (probe.reject) return Promise.reject(new DOMException('Playback probe', 'NotAllowedError'));
      if (!probe.delay) return play.call(this);
      probe.pendingStarts++;
      return new Promise((resolve,reject) => setTimeout(() => {probe.pendingStarts--;play.call(this).then(resolve,reject);},probe.delay));
    };
    probe.sample = () => {
      const rect = el => { const r=el?.getBoundingClientRect(); return r && {x:r.x,y:r.y,width:r.width,height:r.height}; };
      const indicator=document.querySelector('.lp-audio-wait');
      const image=document.querySelector('.lp-option-image,.lp-vocabulary-image,.lp-story-object');
      return {at:performance.now(),footer:rect(document.querySelector('.lp-footer')),image:rect(image),imageSame:image===probe.image,
        preparing:!!document.querySelector('.lp-preparation'),banner:!!document.querySelector('.lp-notice'),waiting:!!indicator && getComputedStyle(indicator).visibility!=='hidden',scrollY};
    };
    new MutationObserver(() => { if(probe.active) probe.observations.push(probe.sample()); }).observe(document,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','disabled','aria-busy']});
  },seed || {});
}
async function begin(page,delay=0) {
  return page.evaluate(delay => {
    const p=playbackProbe;p.active=false;p.delay=delay;p.events=[];p.observations=[];p.image=document.querySelector('.lp-option-image,.lp-vocabulary-image,.lp-story-object');p.active=true;
    const before=p.sample();p.observations.push(before);return before;
  },delay);
}
async function finish(page,before) {
  await page.waitForFunction(()=>playbackProbe.events.some(e=>e.type==='ended'));
  const result=await page.evaluate(()=>{playbackProbe.active=false;return {events:playbackProbe.events,observations:playbackProbe.observations};});
  for (const state of result.observations) {
    assert.equal(state.preparing,false,'playback cannot replace a prepared question with the preparation page');
    assert.equal(state.banner,false,'playback cannot insert a full-width preparation banner');
    assert.equal(state.imageSame,true,'keep the existing question image nodes');
    for(const key of ['x','y','width','height'])assert.ok(Math.abs(state.footer[key]-before.footer[key])<1,'footer '+key+' shifted '+(state.footer[key]-before.footer[key])+'px during playback');
    if(before.image)for(const key of ['x','y','width','height'])assert.ok(Math.abs(state.image[key]-before.image[key])<1,'picture '+key+' shifted during playback');
    assert.equal(state.scrollY,before.scrollY,'playback cannot scroll the question');
  }
  return result;
}
async function main() {
  const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch(), report={status:'running',cases:[]};
  const dir=path.resolve('test-results/playback-stability');fs.mkdirSync(dir,{recursive:true});
  const seed=seedPicture(),attempt=seed.records[seed.key].value.placement.attempts.friends;
  const q=unit.placement.questions.find(q=>q.id===attempt.questionIds[attempt.cursor]);
  try {
    for(const viewport of [{width:320,height:568},{width:390,height:844},{width:820,height:1180},{width:1440,height:900}]) {
      const page=await browser.newPage({viewport,reducedMotion:'reduce'});
      await observe(page,{key:seed.key,record:seed.records[seed.key]});
      await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.locator('.journey-app').waitFor();
      await page.locator('[data-action="open-placement"][data-id="friends"]').click();await page.locator('[data-action="placement-start"]').click();await page.locator('.lp-exercise').waitFor();
      const play=page.locator('[data-action="exercise-listen"][data-id="'+q.listenRefs[0]+'"]').first();
      await play.scrollIntoViewIfNeeded();
      for(const delay of [0,150,1200]) {
        const before=await begin(page,delay);await page.screenshot({path:path.join(dir,viewport.width+'-before.png')});await play.click();
        if(delay===1200) {
          await page.locator('[data-action="exercise-listen"][disabled]').first().waitFor();
          assert.equal(await page.evaluate(()=>playbackProbe.events.some(e=>e.type==='playing')),false,'waiting is not playing');
          await page.locator('.lp-audio-wait').first().waitFor({timeout:750});
          await page.screenshot({path:path.join(dir,viewport.width+'-waiting.png')});
          const count=await page.evaluate(()=>playbackProbe.plays);
          await play.evaluate(button=>button.click());
          assert.equal(await page.evaluate(()=>playbackProbe.plays),count,'waiting suppresses duplicate playback');
        }
        const result=await finish(page,before);
        if(delay<300)assert.ok(result.observations.every(s=>!s.waiting),'short native startup must not flash a loading indicator');
        report.cases.push({viewport,delay,...result});
      }
      await page.evaluate(()=>{playbackProbe.reject=true;});await play.click();await page.locator('[data-action="retry-audio"]').waitFor();
      assert.equal(await page.locator('.lp-audio-wait').count(),0,'failed playback clears the waiting indicator');
      await page.evaluate(()=>{playbackProbe.reject=false;playbackProbe.delay=0;playbackProbe.events=[];});
      await page.locator('[data-action="retry-audio"]').click();await page.waitForFunction(()=>playbackProbe.events.some(e=>e.type==='ended'));
      assert.equal(await page.locator('.lp-notice').count(),0,'successful retry clears the error');
      await page.close();
    }
    const page=await browser.newPage({viewport:{width:390,height:844}});await observe(page);
    await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.locator('.journey-app').waitFor();
    await page.locator('.journey-node[data-id="K01"]').click();await page.locator('[data-action="open-node"]').click();await page.locator('[data-action="story-start"]').click();
    await page.waitForFunction(()=>playbackProbe.events.some(e=>e.type==='ended'));
    for(const delay of [150,1200]) {
      const before=await begin(page,delay);await page.locator('[data-action="replay"]').click();
      if(delay===1200)await page.locator('.lp-audio-wait').waitFor({timeout:750});
      report.cases.push({kind:'story-replay',delay,...await finish(page,before)});
    }
    await page.evaluate(()=>{playbackProbe.delay=1200;});await page.locator('[data-action="replay"]').click();await page.locator('[data-action="map"]').click();await page.locator('.journey-app').waitFor();
    // Leaving releases the player's source. Deliver the delayed start; its
    // native promise may stay pending without a source, but no UI may return.
    await page.waitForFunction(()=>playbackProbe.pendingStarts===0);
    assert.equal(await page.locator('.lp-audio-wait,.lp-preparation,.lp-notice').count(),0);
    await page.close();
    const book=await browser.newPage({viewport:{width:390,height:844}});await observe(book);
    await book.goto('http://127.0.0.1:'+server.address().port+'/');await book.locator('.journey-app').waitFor();
    await book.locator('[data-action="journey-book"][data-id="1"]').click();
    const reference=book.locator('[data-action="reference-play"][data-id="L01-D01"]');await reference.waitFor();await reference.scrollIntoViewIfNeeded();
    const bookBefore=await begin(book,1200);await reference.click();await book.locator('.lp-audio-wait').waitFor({timeout:750});
    report.cases.push({kind:'reference',delay:1200,...await finish(book,bookBefore)});await book.close();
    const h=setup();h.finish('K01');
    const words=await browser.newPage({viewport:{width:390,height:844}});await observe(words,{key:h.rt.storageKey,record:h.adapter.load(h.rt.storageKey)});
    await words.goto('http://127.0.0.1:'+server.address().port+'/');await words.locator('.journey-app').waitFor();
    await words.locator('.journey-node[data-id="K03"]').click();await words.locator('[data-action="open-node"]').click();await words.locator('.lp-vocabulary').waitFor();
    const word=words.locator('[data-action="word-play"]').first();await word.scrollIntoViewIfNeeded();
    const wordBefore=await begin(words,1200);await word.click();await word.locator('.lp-word-cue').getByText('准备中…',{exact:true}).waitFor({timeout:750});
    report.cases.push({kind:'word',delay:1200,...await finish(words,wordBefore)});await words.close();
    report.status='passed';
  }finally{fs.writeFileSync(path.join(dir,'proof.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync('test-results/playback-stability.json',JSON.stringify(report,null,2)+'\n');await browser.close();await new Promise(resolve=>server.close(resolve));}
  console.log('Playback stability passed: '+report.cases.length+' native startup/replay cases, delayed feedback, error retry and exit.');
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={main};
