'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {createServer}=require('./serve-learning-path');
const {createVisualServer}=require('./serve-visual-check');
const unit=require('../content/learning-course.json'),runtime=require('../core/learning-path-runtime'),placement=require('../core/learning-placement'),exercises=require('../core/learning-exercises');
const key=`poc:learning-path:${unit.unitId}:${unit.experienceRevision}`;
async function main(){
 fs.mkdirSync('test-results/review-repair',{recursive:true});
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});const report={checks:[]};
 try{
  const context=await browser.newContext({viewport:{width:420,height:856}});const page=await context.newPage();
  await page.goto(origin);await page.waitForSelector('[data-journey-current]',{timeout:60000});
  report.checks.push({name:'continuous-map',sections:await page.locator('.journey-chapter').count(),nodes:await page.locator('[data-journey-node]').count(),pagingControls:await page.locator('[data-action="journey-section"],[data-action="journey-expand"]').count()});
  assert.equal(report.checks.at(-1).sections,unit.chapters.length);assert.equal(report.checks.at(-1).nodes,unit.nodes.length);assert.equal(report.checks.at(-1).pagingControls,0);
  await page.locator('.journey-lesson-index summary').click();await page.locator('a[href="#chapter-lesson-143-144"]').click();await page.waitForSelector('#chapter-lesson-143-144');
  await page.locator('[data-action="journey-locate"]').click();await page.waitForSelector('[data-journey-current]');
  await page.locator('[data-action="preview-node"][data-id="C04"]').click();await page.locator('[data-action="open-placement"][data-id="umbrella"]').click();await page.locator('[data-action="placement-start"]').click();
  await page.waitForSelector('[data-exercise-id]');
  await page.evaluate(k=>{window.writes=[];const set=Storage.prototype.setItem;Storage.prototype.setItem=function(name,value){window.writes.push({key:name,bytes:value.length});return set.call(this,name,value);};window.optionIdentity=document.querySelector('[data-action="exercise-select"]');},key);
  await page.locator('[data-action="exercise-select"]').first().click();
  await page.waitForFunction(k=>Boolean(localStorage.getItem(k+':draft')),key);
  const draft=await page.evaluate(k=>JSON.parse(localStorage.getItem(k+':draft')).value,key);
  const writes=await page.evaluate(()=>window.writes);assert.equal(writes.filter(w=>w.key===key).length,0);assert.ok(writes.every(w=>w.bytes<1000));assert.ok(await page.evaluate(()=>window.optionIdentity.isConnected));
  report.checks.push({name:'durable-draft',selectedOptions:draft.selected.length,fullRecordWrites:0,maxJournalBytes:Math.max(...writes.map(w=>w.bytes))});
  await page.reload();await page.waitForSelector('[data-journey-current]');await page.locator('[data-action="preview-node"][data-id="C04"]').click();await page.locator('[data-action="open-placement"][data-id="umbrella"]').click();await page.locator('[data-action="placement-start"]').click();assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k+':draft')).value,key),draft);await page.waitForSelector('[data-exercise-id] [aria-pressed="true"]');assert.ok(await page.locator('[aria-pressed="true"]').count());assert.equal(await page.locator('textarea,input, [contenteditable="true"]').count(),0);
  await page.locator('[data-action="map"]').click();
  const audio=unit.sources['L01-D01'].audioSrc;
  await page.evaluate(async url=>{const r=await fetch(url);if(!r.ok)throw Error('audio pre-cache failed');await r.arrayBuffer();},audio);
  await context.setOffline(true);await page.reload();await page.waitForSelector('[data-journey-current]',{timeout:30000});
  assert.equal(await page.evaluate(async url=>(await fetch(url,{headers:{Range:'bytes=0-11'}})).status,audio),206);
  const second=await context.newPage();await second.goto(origin);await second.waitForSelector('[data-journey-current]',{timeout:30000});await second.close();
  report.checks.push({name:'offline-reload-new-page-and-audio-range',passed:true});
  await context.setOffline(false);await page.reload();await page.waitForSelector('[data-journey-current]');
  await page.evaluate(k=>localStorage.setItem(k,'{broken record'),key);await page.reload();await page.waitForSelector('[data-action="recovery-export"]');
  await page.screenshot({path:'test-results/review-repair/recovery-420.png',fullPage:true});
  const downloadEvent=page.waitForEvent('download');await page.locator('[data-action="recovery-export"]').click();const download=await downloadEvent;const downloadPath=await download.path();assert.equal(fs.readFileSync(downloadPath,'utf8'),'{broken record');
  await page.locator('[data-action="recovery-restore"]').click();await page.locator('[data-action="recovery-confirm"]').click();await page.waitForSelector('[data-journey-current]');
  assert.equal(await page.evaluate(k=>localStorage.getItem(k+':recovery:quarantine'),key),'{broken record');
  report.checks.push({name:'export-and-backup-restore',passed:true});
  const legacy=runtime.emptyRecord(unit.keyboardHistory),oldChallenge=unit.keyboardHistory.challenges[0],oldQuestion=oldChallenge.questions[0];
  legacy.challenges[oldChallenge.id]={answers:[{questionId:oldQuestion.id,value:oldQuestion.answers[0],answerPolicyVersion:2,evidence:'independent',at:'2026-09-09'}],draft:{questionId:oldChallenge.questions[1].id,value:'unfinished old answer',wrong:1,hintUsed:true}};
  legacy.placement={attempts:{umbrella:placement.createAttempt(unit.keyboardHistory,legacy,'umbrella',11,'2026-09-09')}};
  assert.ok(runtime.validRecord(legacy,unit.keyboardHistory));
  await page.evaluate(({key,legacy})=>localStorage.setItem(key,JSON.stringify({revision:50,value:legacy})),{key,legacy});
  await page.reload();await page.waitForSelector('[data-journey-current]');
  const upgraded=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).value,key);
  assert.deepEqual(upgraded.keyboardArchive.record,legacy);assert.equal(upgraded.placement.attempts.umbrella,undefined);assert.equal(upgraded.interruptedPlacements.length,1);
  await page.locator('[data-action="journey-nav"][data-id="progress"]').click();await page.locator('.journey-history summary').click();
  assert.ok((await page.locator('.journey-history').innerText()).includes(oldQuestion.answers[0]));assert.equal(await page.locator('textarea,input[type="text"],[contenteditable="true"]').count(),0);
  await page.screenshot({path:'test-results/review-repair/old-record-history-420.png',fullPage:true});
  report.checks.push({name:'old-drafts-and-active-test-migrate-to-readonly-history',passed:true});
  await context.close();
  const profile=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'canran-offline-restart-'));
  let persistent;
  try {
   persistent=await chromium.launchPersistentContext(profile,{viewport:{width:420,height:856}});
   let p=persistent.pages()[0];await p.goto(origin);await p.waitForSelector('[data-journey-current]');
   await p.locator('.journey-node[data-action="preview-node"][data-id="K01"]').click();
   await p.locator('[data-action="open-node"][data-id="K01"]').click();await p.locator('[data-action="story-start"]').click();
   await p.waitForFunction(()=>{const b=document.querySelector('[data-action="continue"]');return b&&!b.disabled;});
   await p.locator('[data-action="continue"]').click();await p.locator('[data-action="map"]').click();
   const saved=await p.evaluate(k=>localStorage.getItem(k),key);assert.ok(saved);
   await persistent.close();persistent=null;
   persistent=await chromium.launchPersistentContext(profile,{viewport:{width:420,height:856}});await persistent.setOffline(true);
   p=persistent.pages()[0];await p.goto(origin);await p.waitForSelector('[data-journey-current]',{timeout:30000});
   assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),saved);
   assert.equal(await p.evaluate(async url=>(await fetch(url,{headers:{Range:'bytes=0-11'}})).status,audio),206);
   report.checks.push({name:'offline-browser-process-restart-and-record-restore',passed:true});
  }finally{await persistent?.close();fs.rmSync(profile,{recursive:true,force:true});}
  // Real production controller and renderer with the repository's explicit
  // audio/clock fixture; no learner data or native listening claim is involved.
  const {server:visual}=createVisualServer();await new Promise(r=>visual.listen(0,'127.0.0.1',r));
  try {
   const page=await browser.newPage({viewport:{width:320,height:568}});
   await page.goto('http://127.0.0.1:'+visual.address().port+'/__qa__/frame.html');await page.waitForFunction(()=>window.fixture?.ready);
   const record=runtime.emptyRecord(unit);let attempt=placement.createAttempt(unit,record,'lesson-49-50',81,'2026-09-09');
   while(attempt.status==='active'){const q=placement.question(unit,attempt.questionIds[attempt.cursor]);attempt=placement.grade(unit,attempt,exercises.solution(q),'2026-09-09',q.listenRefs);if(attempt.status==='active'){attempt.cursor++;attempt.draft=exercises.empty();}}
   record.placement={attempts:{'lesson-49-50':attempt}};
   await page.evaluate(({key,record})=>{fixture.adapter.commit(key,{expectedRevision:0,value:record});}, {key,record});
   // Reload the fixture through a real browser reload, persisting only this lab record.
   await page.addInitScript(({key,record})=>{parent.fixtureReloadSeed={records:{[key]:{revision:1,value:record}},now:'2026-09-09T12:00:00Z'};}, {key,record});
   await page.reload();await page.waitForFunction(()=>window.fixture?.ready);await page.addScriptTag({url:'/__qa__/readability.js'});
   const click=async(action,id)=>{const selector='[data-action="'+action+'"]'+(id?'[data-id="'+id+'"]':'');const before=await page.evaluate(type=>fixture.completedDispatches[type]||0,action);await page.locator(selector).first().click();if(!action.startsWith('journey-')&&action!=='preview-node')await page.waitForFunction(({type,before})=>(fixture.completedDispatches[type]||0)>before,{type:action,before});};
   const state=()=>page.evaluate(()=>fixture.runtime.snapshot());
   const hear=async()=>{for(let i=0;i<40;i++){const s=await state();if(s.audio?.status!=='playing')break;const before=await page.evaluate(()=>fixture.completedDispatches['audio-ended']||0);await page.evaluate(()=>fixture.audio.at(-1).finish());await page.waitForFunction(before=>(fixture.completedDispatches['audio-ended']||0)>before,before);}};
   async function audit(name){
    const result=await page.evaluate(async name=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));return auditReadability(window,{name,expectedTheme:'dark'});},name);
    assert.deepEqual(result.errors,[],name);report.checks.push({name,passed:true,readability:result});
   }
   async function choose(q,correct=true){
    if(q.mechanism!=='pairs')for(const ref of q.listenRefs){await click('exercise-listen',ref);await hear();}
    if(['order','multi'].includes(q.mechanism))for(const id of [...(await state()).response.selected])await click('exercise-select',id);
    if(q.mechanism==='pairs'){for(const [i,p]of q.pairs.entries()){await click('exercise-select',p.id);await hear();await click('exercise-select',correct?p.answer:q.pairs[(i+1)%q.pairs.length].answer);}return;}
    let ids=[...q.answer];
    if(!correct){if(q.mechanism==='order')ids.reverse();else if(q.mechanism==='repair')ids=[q.words.find(o=>o.id!==q.answer[0]).id,q.answer[1]];else ids=[q.options.find(o=>!q.answer.includes(o.id)).id];}
    for(const id of ids)if(['order','multi'].includes(q.mechanism)||!(await state()).response.selected.includes(id))await click('exercise-select',id);
   }
   for(const node of unit.nodes.filter(n=>n.chapterId==='lesson-49-50')){
    await click('preview-node',node.id);await click('open-node',node.id);
    let guard=0;
    while((await state()).screen==='activity'){
     if(++guard>100)throw Error('Pilot did not advance');const s=await state(),a=unit.activities[s.activityId];
     if(a.kind==='interactive-story'){if(!s.storyRevealed)await click('story-start');await hear();}
     else if(a.kind==='teach'){for(const item of a.items){await click('word-play',item.sourceRef);await hear();}}
     else if(a.kind==='match'){for(const item of a.items){await click('match-word',item.sourceRef);await click('match-image',item.entityId);}await hear();}
     else if(a.kind==='exercise'){
      await audit('tap-empty-'+a.id);await choose(a,false);await audit('tap-selected-'+a.id);await click('check');assert.equal((await state()).feedback,'retry');await click('retry');
      await choose(a);await click('check');assert.equal((await state()).feedback,'supported');assert.equal((await state()).canContinue,true);await audit('tap-correct-'+a.id);
      const buttonBounds=await page.locator('.lp-footer .lp-primary').evaluate(b=>{const r=b.getBoundingClientRect();return {top:r.top,bottom:r.bottom,viewport:innerHeight};});
      assert.ok(buttonBounds.top>=0 && buttonBounds.bottom<=buttonBounds.viewport,a.id+' continue must remain visible');
      await page.screenshot({path:'test-results/review-repair/'+a.id.replace(/:/g,'-')+'-320.png',fullPage:true});
      report.checks.push({name:'pilot-ui-'+a.id,passed:true,buttonBounds});
     }else if(a.resultId){await hear();for(const id of a.answer){await click('select',id);}await click('check');await hear();}
     await click('continue');await hear();
    }
    await click('map');
   }
   const result=await state();assert.equal(Object.values(result.record.retrievalReviews).filter(e=>e.origin==='grammar').length,3);
   await page.evaluate(()=>{fixture.now='2026-09-10T12:00:00Z';});await click('journey-nav','review');await click('review');
   const reviewed=[];
   for(let session=0;session<3&&new Set(reviewed).size<3;session++){
   while(['activity','challenge'].includes((await state()).screen)){
    if((await state()).screen==='activity'){
      const a=unit.activities[(await state()).activityId];
      if(a.kind==='exercise')await choose(a);else{await hear();for(const id of a.answer)await click('select',id);}
      await click('check');await hear();await click('continue');continue;
    }
    const q=(await state()).reviewQuestion;assert.ok(q.id.startsWith('G49-delayed-'));
    await choose(q);await click('challenge-check');
    if(!reviewed.length)await page.screenshot({path:'test-results/review-repair/delayed-review-320.png',fullPage:true});
    await click('challenge-next');reviewed.push(q.id);
   }
   if(new Set(reviewed).size<3){await click('map');await click('journey-nav','review');await click('review');}
   }
   assert.equal(new Set(reviewed).size,3);
   assert.equal(Object.values((await state()).record.retrievalReviews).filter(e=>e.origin==='grammar'&&e.lastEvidence==='independent').length,3);
   report.checks.push({name:'three-delayed-grammar-exercises',questionIds:reviewed,passed:true});
   await page.close();
  }finally{await new Promise(r=>visual.close(r));}
  report.status='passed';
 }finally{fs.writeFileSync('test-results/review-repair/browser.json',JSON.stringify(report,null,2)+'\n');await browser.close();await new Promise(r=>server.close(r));}
 console.log(JSON.stringify(report,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
