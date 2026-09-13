'use strict';
// Isolated records, with the production renderer/controller and deterministic audio.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {createVisualServer}=require('./serve-visual-check');
const {setup}=require('../tests/unit/support/course-harness');
const {answer}=require('../tests/unit/support/tap-exercise');
const unit=require('../content/learning-course.json');
function seedPicture(){
  const placement=require('../core/learning-placement'),empty=require('../core/learning-path-runtime').emptyRecord(unit);
  const target=unit.placement.questions.find(q=>q.form==='T02'&&unit.sources[q.sourceRef].text==='pencil');
  let seed=0;
  while(seed<1000&&!placement.createAttempt(unit,empty,'friends',seed,'2026-09-06T12:00:00Z').questionIds.includes(target.id))seed++;
  assert.ok(seed<1000,'Picture regression requires an actual sampled pencil question');
  const h=setup({random:()=>seed/4294967296});
  h.send({type:'open-placement',id:'friends'});h.send({type:'placement-start'});
  while(h.view().placementAttempt.status==='active'){
    const a=h.view().placementAttempt,q=unit.placement.questions.find(q=>q.id===a.questionIds[a.cursor]);
    if(q.form==='T02'&&unit.sources[q.sourceRef].text==='pencil')break;
    answer(h,q);h.send({type:'placement-check',attemptId:a.id,questionId:q.id});h.send({type:'placement-next',attemptId:a.id,questionId:q.id});
  }
  assert.equal(h.view().placementAttempt.questionIds[h.view().placementAttempt.cursor],target.id);
  const key=h.rt.storageKey,saved=h.adapter.load(key);
  return {records:{[key]:saved},key,now:'2026-09-06T12:00:00Z'};
}
async function main(){
  const {server}=createVisualServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch(),report={status:'running',samples:[]};
  const dir=path.resolve(__dirname,'../test-results/answer-feedback');fs.mkdirSync(dir,{recursive:true});
  try{
    for(const viewport of [{width:832,height:902},{width:420,height:856},{width:320,height:568},{width:906,height:801},{width:1440,height:900}]){
      const page=await browser.newPage({viewport});
      await page.addInitScript(seed=>{window.fixtureReloadSeed=seed;},seedPicture());
      await page.goto('http://127.0.0.1:'+server.address().port+'/__qa__/frame.html');
      await page.waitForFunction(()=>window.fixture?.ready);
      const click=async(action,id)=>{
        const before=await page.evaluate(()=>fixture.dispatchCount);
        await page.locator('[data-action="'+action+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
        await page.waitForFunction(n=>fixture.dispatchCount>n,before);
      };
      await page.locator('.journey-lesson-index summary').click();
      await page.locator('a[href="#chapter-friends"]').click();
      await click('open-placement','friends');await click('placement-start');
      const q=await page.evaluate(()=>{const v=fixture.runtime.snapshot();return fixture.unit.placement.questions.find(q=>q.id===v.placementAttempt.questionIds[v.placementIndex]);});
      await click('exercise-listen',q.listenRefs[0]);
      await page.waitForFunction(()=>fixture.audio.at(-1)?.playing);await page.evaluate(()=>fixture.audio.at(-1).finish());
      await page.waitForFunction(()=>fixture.runtime.snapshot().audio.status==='ended');
      await click('exercise-select',q.answer[0]);
      await page.locator('[data-action="placement-check"]').scrollIntoViewIfNeeded();
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
      const geometry=()=>page.evaluate(()=>({scrollY,images:[...document.querySelectorAll('.lp-picture-options .lp-option-image')].map(img=>{const r=img.getBoundingClientRect(),p=img.parentElement.getBoundingClientRect();return {id:img.parentElement.dataset.id,x:r.x,y:r.y,documentY:r.y+scrollY,relativeX:r.x-p.x,relativeY:r.y-p.y,width:r.width,height:r.height,cardHeight:p.height};})}));
      const before=await geometry();await page.screenshot({path:path.join(dir,viewport.width+'-before.png')});
      await click('placement-check');
      await page.locator('.lp-feedback-success').waitFor();
      const after=await geometry();await page.screenshot({path:path.join(dir,viewport.width+'-after.png')});
      const feedback=await page.locator('.lp-feedback').boundingBox();
      assert.ok(feedback.y>=0&&feedback.y+feedback.height<=viewport.height,'Feedback is visible without scrolling');
      const channel=await page.evaluate(()=>({sounds:fixture.feedbackAudio.map(a=>a.src),heard:fixture.runtime.snapshot().heardRefs,voice:fixture.audio.at(-1).src}));
      assert.deepEqual(channel.sounds,[unit.feedbackSounds.correct.src]);
      await page.evaluate(()=>fixture.feedbackAudio.at(-1).finish());
      assert.deepEqual(await page.evaluate(()=>fixture.runtime.snapshot().heardRefs),channel.heard,'Sound effects cannot earn listening credit');
      const sample={viewport,question:q.id,before,after};report.samples.push(sample);
      for(const a of before.images){const b=after.images.find(b=>b.id===a.id);for(const key of ['x','y','documentY','relativeX','relativeY','width','height'])assert.ok(Math.abs(a[key]-b[key])<1,viewport.width+' '+a.id+' '+key+' shifted '+(b[key]-a[key])+'px');}
      await page.close();
    }
    report.status='passed';
  }finally{
    fs.writeFileSync(path.join(dir,'proof.json'),JSON.stringify(report,null,2)+'\n');
    await browser.close();await new Promise(r=>server.close(r));
  }
  console.log('Answer feedback: stable images, visible feedback and isolated sound channel at five viewport sizes.');
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={seedPicture,main};
