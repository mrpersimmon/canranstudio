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
      await page.locator('[data-action="placement-check"]').click();
      if(sound==='unavailable'){
        await page.waitForFunction(()=>observedAudio.some(e=>e.src.includes('/feedback/')&&e.errors));
        assert.equal(await page.locator('[data-action="placement-next"]').isEnabled(),true);
        assert.equal(await page.locator('.lp-notice').count(),0);
      }else{
        await page.waitForFunction(src=>observedAudio.some(e=>e.src===src&&e.ended),unit.feedbackSounds[sound].src);
        const observed=await page.evaluate(()=>observedAudio.filter(e=>e.src.includes('/feedback/')));
        assert.equal(observed.length,1);assert.equal(observed[0].volume,unit.feedbackSounds[sound].volume);assert.equal(observed[0].errors,0);
        if(sound==='correct'){
          await context.setOffline(true);
          await page.locator('.lp-footer [data-action="exercise-listen"]').click();
          await page.waitForFunction(src=>observedAudio.filter(e=>e.src===src&&e.ended).length===2,unit.sources[q.sourceRef].audioSrc);
          // Reopen the graded question. Stored success must remain silent.
          await page.reload();await page.locator('.journey-app').waitFor();
          await page.locator('[data-action="open-placement"][data-id="friends"]').click();await page.locator('[data-action="placement-start"]').click();
          assert.equal(await page.locator('.lp-feedback-success').count(),1);
          assert.equal(await page.evaluate(()=>observedAudio.filter(e=>e.src.includes('/feedback/')).length),0);
          await context.setOffline(false);
        }
        report.samples.push({sound,native:observed[0]});
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
