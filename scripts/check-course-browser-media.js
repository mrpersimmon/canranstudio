'use strict';
// Exercise the production installer, service worker, localStorage and Audio.
// Only test records are seeded; audio events are observed, never simulated.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {createServer}=require('./serve-learning-path');
const {setup}=require('../tests/unit/support/course-harness');
const baseline=require('../content/expansion/lesson1-6-baseline.json');
const unit=require('../content/learning-course.json');
async function main(){
  const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
  const browser=await chromium.launch(),report={status:'running',revision:unit.releaseRevision,samples:[],errors:[]};
  try{
    const context=await browser.newContext({viewport:{width:420,height:856}}),page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(String(error)));
    await page.addInitScript(()=>{
      window.__nativeAudio=[];const NativeAudio=window.Audio;
      window.Audio=function(...args){const audio=new NativeAudio(...args),event={src:args[0]||'',ended:false,errors:0};window.__nativeAudio.push(event);audio.addEventListener('ended',()=>{event.ended=true;event.duration=audio.duration;});audio.addEventListener('error',()=>event.errors++);return audio;};window.Audio.prototype=NativeAudio.prototype;
    });
    await page.goto(url);await page.locator('.journey-app').waitFor();
    assert.ok(await page.locator('.journey-node').count()<unit.nodes.length);
    await page.locator('[data-action="journey-expand"]').click();
    assert.equal(await page.locator('.journey-node').count(),unit.nodes.length);
    await page.locator('[data-action="journey-expand"]').click();
    assert.equal(await page.evaluate(()=>window.__coursePackage.result.manifest.revision),unit.releaseRevision);
    await page.locator('[data-action="journey-nav"][data-id="book"]').click();
    const sampleRefs=['L01-D01','L07-D01','L21-D01','L25-D01','L27-NUM10','L31-D04','L33-D08','L35-D03','L37-D03','L39-D08','L41-D06','L43-D01','L45-D03','L47-D01','L49-D15','L49-ORD01',
      'L51-D07','L53-ORD12','L59-E08','L69-D05','L73-W11','L87-D03','L89-E07','L91-D10','L101-D04','L113-D02','L121-E01','L129-D05','L133-D04','L141-D14','L143-E06'];
    for(const ref of sampleRefs){
      const source=unit.sources[ref];assert.ok(source,ref);
      const group=unit.referenceGroups.find(g=>g.sourceRefs.includes(ref));
      const button=page.locator('[data-action="reference-section"][data-id="'+group.id+'"]');
      if(await button.getAttribute('aria-pressed')!=='true')await button.click();
      await page.locator('[data-action="reference-play"][data-id="'+ref+'"]').click();
      await page.waitForFunction(src=>window.__nativeAudio.some(a=>a.src===src&&a.ended),source.audioSrc,{timeout:30000});
      const proof=await page.evaluate(async src=>{
        const full=await fetch(src),hash=full.headers.get('X-Course-Media-Verified');
        const range=await fetch(src,{headers:{Range:'bytes=0-11'}});
        return{audio:window.__nativeAudio.find(a=>a.src===src&&a.ended),hash,rangeStatus:range.status,rangeBytes:(await range.arrayBuffer()).byteLength};
      },source.audioSrc);
      assert.equal(proof.audio.errors,0,ref);assert.match(proof.hash,/^[a-f0-9]{64}$/);assert.equal(proof.rangeStatus,206);assert.equal(proof.rangeBytes,12);
      report.samples.push({ref,...proof});
    }
    await context.setOffline(true);
    const lastRef=sampleRefs.at(-1);
    await page.locator('[data-action="reference-play"][data-id="'+lastRef+'"]').click();
    await page.waitForFunction(src=>window.__nativeAudio.filter(a=>a.src===src&&a.ended).length===2,unit.sources[lastRef].audioSrc,{timeout:15000});
    report.offlineReplay=true;await context.close();
    const old=setup({unit:baseline});for(const node of baseline.nodes)old.finish(node.id);
    const oldRecord=old.adapter.load(old.rt.storageKey);
    const upgraded=await browser.newContext({viewport:{width:906,height:801}}),p=await upgraded.newPage();
    await p.addInitScript(({key,record})=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem(key,JSON.stringify(record));sessionStorage.setItem('seeded','yes');}}, {key:old.rt.storageKey,record:oldRecord});
    await p.goto(url);await p.locator('.journey-app').waitFor();
    await p.locator('[data-action="journey-expand"]').click();
    assert.equal(await p.locator('.journey-step.is-done').count(),11);
    assert.equal(await p.locator('[data-journey-current]').getAttribute('data-id'),'L07-STORY');
    const migrated=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)).value,old.rt.storageKey);
    assert.deepEqual(require('../tests/unit/support/review-history').evidenceOnly(migrated),oldRecord.value);
    assert.deepEqual(await p.evaluate(key=>JSON.parse(localStorage.getItem(key+':recovery:migration')).value,old.rt.storageKey),oldRecord.value);
    await p.locator('.journey-node[data-id="L07-STORY"]').click();await p.locator('[data-action="open-node"][data-id="L07-STORY"]').click();
    await p.locator('.lp-scene-painting').waitFor();assert.equal(await p.locator('.lp-scene-painting').evaluate(img=>img.complete&&img.naturalWidth>0),true);
    report.upgrade={preservedNodes:11,next:'L07-STORY',loadedScene:true};await upgraded.close();
    assert.deepEqual(report.errors,[]);report.status='passed';
  }finally{
    report.finishedAt=new Date().toISOString();fs.mkdirSync(path.resolve(__dirname,'../test-results'),{recursive:true});fs.writeFileSync(path.resolve(__dirname,'../test-results/native-media-proof.json'),JSON.stringify(report,null,2)+'\n');
    await browser.close();await new Promise(r=>server.close(r));
  }
  console.log('Native browser: '+report.samples.length+' real ended recordings, verified ranges, offline replay and preserved six-lesson progress.');
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
