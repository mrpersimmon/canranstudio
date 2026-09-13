'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {createVisualServer}=require('./serve-visual-check');
const {seedPicture}=require('./check-answer-feedback');
async function main(){
  const dir=path.resolve(__dirname,'../output/playwright/placement-repair');
  fs.mkdirSync(dir,{recursive:true});
  const {server}=createVisualServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch(),report={status:'running',samples:[],failures:[]};
  try{
    for(const viewport of [{width:832,height:902},{width:420,height:856},{width:320,height:568},{width:906,height:801},{width:1440,height:900}])for(const randomSeed of [1,8,37]){
      const page=await browser.newPage({viewport});
      await page.addInitScript(seed=>{window.fixtureReloadSeed=seed;},{...seedPicture(),randomSeed});
      await page.goto('http://127.0.0.1:'+server.address().port+'/__qa__/frame.html');await page.waitForFunction(()=>fixture.ready);
      const click=async(action,id)=>{const n=await page.evaluate(()=>fixture.dispatchCount);await page.locator('[data-action="'+action+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();await page.waitForFunction(n=>fixture.dispatchCount>n,n);};
      await click('open-placement','friends');await click('placement-start');
      const q=await page.evaluate(()=>{const v=fixture.runtime.snapshot();return fixture.unit.placement.questions.find(q=>q.id===v.placementAttempt.questionIds[v.placementIndex]);});
      await click('exercise-listen',q.listenRefs[0]);await page.waitForFunction(()=>fixture.audio.at(-1)?.playing);await page.evaluate(()=>fixture.audio.at(-1).finish());await page.waitForFunction(()=>fixture.runtime.snapshot().heardRefs.length>0);
      await click('exercise-select',q.answer[0]);await page.locator('[data-action="placement-check"]').scrollIntoViewIfNeeded();
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
      const geometry=()=>page.evaluate(()=>({scrollY,heard:fixture.runtime.snapshot().heardRefs,images:[...document.querySelectorAll('.lp-picture-options .lp-option-image')].map(i=>{const r=i.getBoundingClientRect();return {id:i.parentElement.dataset.id,src:i.getAttribute('src'),x:r.x,y:r.y,width:r.width,height:r.height};})}));
      const before=await geometry();await page.screenshot({path:path.join(dir,`current-${viewport.width}-${randomSeed}-before.png`)});
      await click('placement-check');await page.locator('.lp-feedback-success').waitFor();const after=await geometry();
      await page.screenshot({path:path.join(dir,`current-${viewport.width}-${randomSeed}-after.png`)});
      const sample={viewport,randomSeed,question:q.id,before,after};report.samples.push(sample);
      try{assert.deepEqual(after.images,before.images,'picture identities must stay in their selected positions');assert.deepEqual(after.heard,before.heard,'listening completion must survive grading');assert.equal(after.scrollY,before.scrollY);}catch(e){report.failures.push({viewport,randomSeed,error:e.message});}
      await page.close();
    }
    report.status=report.failures.length?'failed':'passed';assert.equal(report.failures.length,0,JSON.stringify(report.failures));
  }finally{fs.writeFileSync(path.join(dir,'picture-proof.json'),JSON.stringify(report,null,2)+'\n');await browser.close();await new Promise(r=>server.close(r));}
  console.log('Placement feedback: changing random streams preserve images, scroll and completed listening.');
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={main};
