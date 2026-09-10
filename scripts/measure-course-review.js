'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {chromium}=require('playwright');
const {createServer}=require('./serve-learning-path');
const runtime=require('../core/learning-path-runtime'),unit=require('../content/learning-course.json');
const baseline='68728442524e9aeb7052b7c643cfbcd6b2070fd3';
const readOld=file=>execFileSync('git',['show',baseline+':'+file],{encoding:'utf8',maxBuffer:20*1024*1024});
const oldUnit=JSON.parse(readOld('content/learning-course.json'));
function legacy(record){
 const old=structuredClone(record);
 for(const field of ['contractVersion','completedNodeContracts','contentMigration','retrievalReviews'])delete old[field];
 for(const field of ['completed','attempts'])for(const id of Object.keys(old[field]))if(!oldUnit.activities[id])delete old[field][id];
 for(const [id,result] of Object.entries(old.results)){
  if(!oldUnit.activities[result.activityId])delete old.results[id];
  else {delete result.contractVersion;result.assessment=oldUnit.activities[result.activityId].assessment;}
 }
 for(const ref of Object.keys(old.sourceContacts))if(!oldUnit.sources[ref])delete old.sourceContacts[ref];
 return old;
}
async function main(){
 if(!fs.existsSync('test-results/review-repair/lab-new-course-record.json')){
  const h=require('../tests/unit/support/course-harness').setup();for(const n of unit.nodes.slice(0,3))h.finish(n.id);
  fs.writeFileSync('test-results/review-repair/lab-new-course-record.json',JSON.stringify(h.adapter.load(h.rt.storageKey)));
 }
 const cases=['new','half','full'].map(name=>{
  const envelope=JSON.parse(fs.readFileSync(`test-results/review-repair/lab-${name}-course-record.json`));
  assert.ok(runtime.validRecord(envelope.value,unit),name+' fixture must match the current catalog');
  return {name,envelope};
 });
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});
 const report={baseline,currentRelease:unit.releaseRevision,viewport:[420,856],cpuThrottle:4,repetitions:9,scope:'Synthetic valid runtime records, real Chromium localStorage and forced map layout. These timings are not phone or keyboard-to-paint measurements. Other repository checks may run concurrently.',cases:[]};
 report.fingerprint=require('./visual-proof').fingerprint(require('./build-learning-path-release').prepare());
 try{
  for(const version of ['before','after']){
   const context=await browser.newContext({viewport:{width:420,height:856}}),page=await context.newPage();
   await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForSelector('.journey-app');
   const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   if(version==='before')for(const file of ['learning-challenges','learning-placement','learning-store','learning-journey','learning-path-runtime','learning-path-scene'])await page.addScriptTag({content:readOld('core/'+file+'.js')});
   for(const item of cases){
    const data=version==='before'?legacy(item.envelope.value):item.envelope.value;
    const result=await page.evaluate(({unit,record,version})=>{
     const core=window.CanranCore,light=version==='after',key=`poc:learning-path:${unit.unitId}:${unit.experienceRevision}`;
     if(!core.learningPathRuntime.validRecord(record,unit))throw Error('Invalid benchmark record');
     const container=document.querySelector('[data-learning-path]');
     const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
     const inputSamples=[],mapSamples=[];let mapNodes,writeSizes=[];
     for(let trial=0;trial<9;trial++){
      localStorage.clear();localStorage.setItem(key,JSON.stringify({revision:1,value:record}));
      const writes=[],storage={getItem:k=>localStorage.getItem(k),setItem:(k,v)=>{writes.push({key:k,size:v.length});localStorage.setItem(k,v);}};
      const rt=core.learningPathRuntime.createRuntime({unit,adapter:core.learningStore.createLocalStorageAdapter(storage),now:()=>new Date('2026-09-09T12:00:00'),random:()=>.2});
      const renderer=core.learningPathScene.createRenderer(unit),start=performance.now();
      container.innerHTML=renderer.render(rt.snapshot(light));void container.offsetHeight;
      mapSamples.push(performance.now()-start);mapNodes=container.querySelectorAll('[data-journey-node]').length;
      const challenge=unit.challenges[0];rt.dispatch({type:'open-challenge',id:challenge.id},{light});
      if(rt.dispatch({type:'challenge-start'},{light}).view.screen!=='challenge')throw Error('Challenge input unavailable');
      writes.length=0;const draft='Give me an empty glass.';
      for(let i=1;i<=draft.length;i++){
       const start=performance.now();rt.dispatch({type:'challenge-input',value:draft.slice(0,i)},{light});inputSamples.push(performance.now()-start);
      }
      writeSizes=writes.map(w=>w.size);
     }
     return {version,recordCharacters:JSON.stringify(record).length,completed:Object.keys(record.completed).length,mapNodes,mapMedianMs:median(mapSamples),inputMedianMs:median(inputSamples),inputP95Ms:[...inputSamples].sort((a,b)=>a-b)[Math.floor(inputSamples.length*.95)],inputWriteSizes:writeSizes};
    },{unit:version==='before'?oldUnit:unit,record:data,version});
    report.cases.push({name:item.name,...result});
   }
   await context.close();
  }
  report.status='measured';report.finishedAt=new Date().toISOString();fs.writeFileSync('test-results/review-repair/performance.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
