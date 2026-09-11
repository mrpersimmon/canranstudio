'use strict';
// Real media events on the production installer, controller, and service worker.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const {createServer}=require('./serve-learning-path');
const {setup}=require('../tests/unit/support/course-harness');
const {answer}=require('../tests/unit/support/tap-exercise');
const {seedPicture}=require('./check-answer-feedback');
const unit=require('../content/learning-course.json');
function beforeResult(correct){
  const h=setup({random:()=>2/4294967296});h.send({type:'open-placement',id:'friends'});h.send({type:'placement-start'});
  for(let i=0;i<(correct?19:4);i++){
    const a=h.view().placementAttempt,q=unit.placement.questions.find(q=>q.id===a.questionIds[a.cursor]),identity={attemptId:a.id,questionId:q.id};
    answer(h,q,correct);h.send({type:'placement-check',...identity});h.send({type:'placement-next',...identity});
  }
  const key=h.rt.storageKey;return {key,records:{[key]:h.adapter.load(key)}};
}
async function main(){
  const dir='output/playwright/placement-repair';fs.mkdirSync(dir,{recursive:true});
  const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch(),report={status:'running',samples:[],errors:[]};
  try{
    for(const sound of ['correct','incorrect','complete','failed','unavailable']){
      const correct=['correct','complete'].includes(sound),seed=['complete','failed'].includes(sound)?beforeResult(correct):seedPicture();
      const attempt=seed.records[seed.key].value.placement.attempts.friends,q=unit.placement.questions.find(q=>q.id===attempt.questionIds[attempt.cursor]);
      const context=await browser.newContext({viewport:{width:420,height:856}}),page=await context.newPage();
      await page.addInitScript(({key,record})=>{
        if(!sessionStorage.getItem('seeded')){localStorage.setItem(key,JSON.stringify(record));sessionStorage.setItem('seeded','yes');}
        const NativeAudio=window.Audio;window.observedAudio=[];
        window.Audio=function(src){const a=new NativeAudio(src),e={src,ended:false,errors:0,paused:0};window.observedAudio.push(e);
          a.addEventListener('ended',()=>{e.ended=true;e.volume=a.volume;e.duration=a.duration;});a.addEventListener('error',()=>e.errors++);a.addEventListener('pause',()=>e.paused++);return a;};
        window.Audio.prototype=NativeAudio.prototype;
      },{key:seed.key,record:seed.records[seed.key]});
      page.on('pageerror',e=>report.errors.push(String(e)));
      if(sound==='unavailable')await context.route('**/assets/feedback/*',route=>route.abort());
      await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.locator('.journey-app').waitFor();
      await page.locator('[data-action="open-placement"][data-id="friends"]').click();await page.locator('[data-action="placement-start"]').click();
      for(const ref of q.listenRefs){
        await page.locator('[data-action="exercise-listen"][data-id="'+ref+'"]').click();
        await page.waitForFunction(src=>observedAudio.some(e=>e.src===src&&e.ended),unit.sources[ref].audioSrc);
      }
      const selected=correct?q.answer:q.mechanism==='order'?[...q.answer].reverse():[q.options.find(o=>!q.answer.includes(o.id)).id];
      for(const id of selected)await page.locator('[data-action="exercise-select"][data-id="'+id+'"]').click();
      await page.locator('[data-action="placement-check"]').scrollIntoViewIfNeeded();
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
      const geometry=()=>page.evaluate(()=>({scrollY,images:[...document.querySelectorAll('.lp-picture-options .lp-option-image')].map(i=>{const r=i.getBoundingClientRect();return {id:i.parentElement.dataset.id,src:i.getAttribute('src'),x:r.x,y:r.y,width:r.width,height:r.height};})}));
      const before=await geometry();await page.screenshot({path:dir+'/native-'+sound+'-before.png'});
      await page.locator('[data-action="placement-check"]').click();
      await page.locator(correct?'.lp-feedback-success':'.lp-feedback-retry').waitFor({state:'visible'});
      const after=await geometry();if(before.images.length)assert.deepEqual(after,before,'native picture options must remain in place after grading');
      await page.screenshot({path:dir+'/native-'+sound+'-feedback.png'});
      const terminal=['complete','failed'].includes(sound);
      let beforeReload=[];
      if(terminal){
        await page.locator(correct?'.lp-feedback-success':'.lp-feedback-retry').waitFor({state:'visible'});
        await page.waitForFunction(src=>observedAudio.some(e=>e.src===src&&e.ended),unit.feedbackSounds[correct?'correct':'incorrect'].src);
        assert.equal(await page.locator('.lp-settlement').count(),0,'last-answer feedback remains until manual continue');
        beforeReload=await page.evaluate(()=>observedAudio.filter(e=>e.src.includes('/feedback/')));
        const finalRecord=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),seed.key);
        const finalAttempt=finalRecord.value.placement.attempts.friends;
        assert.equal(finalAttempt.feedbackPending,true);assert.ok(finalAttempt.elapsedMs>0);
        await page.reload();await page.locator('.journey-app').waitFor();
        await page.locator('[data-action="open-placement"][data-id="friends"]').click();
        await page.locator('.lp-placement-intro').waitFor();
        assert.equal(await page.locator('.lp-placement-hearts').getAttribute('aria-label'),'剩余 '+(correct?5:0)+' 次机会，共 5 次');
        await page.locator('[data-action="placement-start"]').click();
        await page.locator(correct?'.lp-feedback-success':'.lp-feedback-retry').waitFor({state:'visible'});
        assert.equal(await page.locator('.lp-settlement').count(),0);
        assert.equal(await page.evaluate(()=>observedAudio.filter(e=>e.src.includes('/feedback/')).length),0,'restoring final feedback must stay silent');
        await page.locator('[data-action="placement-next"]').click();
        await page.locator('.lp-settlement').waitFor({state:'visible'});
        assert.ok((await page.locator('.lp-settlement').innerText()).includes('剩余机会'));
        assert.equal(await page.locator('.lp-settlement-stat.stat-2 .lp-settlement-metric-art').getAttribute('src'),unit.settlement.metricAssets.chances);
        const settled=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),seed.key);
        assert.equal(settled.value.placement.attempts.friends.elapsedMs,finalAttempt.elapsedMs,'final feedback and reload must not extend the duration');
        await page.screenshot({path:dir+'/native-'+sound+'-result.png'});
      }
      if(sound==='unavailable'){
        await page.waitForFunction(()=>observedAudio.some(e=>e.src.includes('/feedback/')&&e.errors));
        assert.equal(await page.locator('[data-action="placement-next"]').isEnabled(),true);
        assert.equal(await page.locator('.lp-notice').count(),0);
      }else{
        await page.waitForFunction(src=>observedAudio.some(e=>e.src===src&&e.ended),unit.feedbackSounds[sound].src);
        const observed=[...beforeReload,...await page.evaluate(()=>observedAudio.filter(e=>e.src.includes('/feedback/')))];
        assert.deepEqual(observed.map(e=>e.src),terminal?[unit.feedbackSounds[correct?'correct':'incorrect'].src,unit.feedbackSounds[sound].src]:[unit.feedbackSounds[sound].src]);
        assert.equal(observed.at(-1).volume,unit.feedbackSounds[sound].volume);assert.ok(observed.every(e=>e.errors===0));
        if(sound==='correct'){
          await context.setOffline(true);
          await page.locator('.lp-footer [data-action="exercise-listen"]').click();
          await page.waitForFunction(src=>observedAudio.filter(e=>e.src===src&&e.ended).length===2,unit.sources[q.sourceRef].audioSrc);
          // Reopen the graded question. Stored success must remain silent.
          await page.reload();await page.locator('.journey-app').waitFor();
          await page.locator('[data-action="open-placement"][data-id="friends"]').click();await page.locator('[data-action="placement-start"]').click();
          // Click completion can precede the controller's queued Web Lock action.
          // Wait for restored feedback before counting it or checking silence.
          await page.locator('.lp-feedback-success').waitFor({state:'visible'});
          assert.equal(await page.locator('.lp-feedback-success').count(),1);
          assert.equal(await page.evaluate(()=>observedAudio.filter(e=>e.src.includes('/feedback/')).length),0);
          await context.setOffline(false);
        }
        report.samples.push({sound,native:observed.at(-1),sequence:observed.map(e=>e.src),...(before.images.length?{picture:{before,after}}:{}),...(terminal?{finalFeedbackRestored:true,durationFrozen:true}:{})});
      }
      await context.close();
    }
    assert.deepEqual(report.errors,[]);report.unavailableDoesNotBlock=true;report.offlineSpeechReplay=true;report.restoredFeedbackSilent=true;report.status='passed';
  }finally{
    fs.writeFileSync('test-results/feedback-audio-native.json',JSON.stringify(report,null,2)+'\n');
    await browser.close();await new Promise(r=>server.close(r));
  }
  console.log('Native feedback: four real ended effects, offline speech replay, silent restore and nonblocking failure.');
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={main};
