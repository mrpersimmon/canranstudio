'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {VIEWPORTS,PROOF,fingerprint,validateReport,assertVisualProof}=require('../../scripts/visual-proof');
function validReport(){return {schema:1,status:'passed',checks:VIEWPORTS.flatMap(viewport=>[
  ...['settlement-visibility-input','loader','map','story-two-lines','references','celebration','replay-complete','replay-return-map','review-complete','review-return-map','blocked','save-failure','map-return','reload-map',...require('../../content/learning-course.json').nodes.map(node=>'completion-return-'+node.id),...require('../../scripts/visual-proof').CHALLENGE_SCREENS,...require('../../content/learning-course.json').challenges.flatMap(c=>c.questions.flatMap(q=>['challenge-empty-','challenge-filled-','challenge-correct-'].map(prefix=>prefix+q.id)))].map(name=>({name,viewport,expectedTheme:'dark',canvas:'rgb(20, 31, 35)',journeyLayout:{pitch:162,gaps:[162,162]},sessionProgress:{label:'本次闯关进度',completed:6,total:6},centeredIcons:[{action:'journey-locate',x:0,y:0}],completionBoundary:(['celebration','replay-complete','review-complete'].includes(name)||name.startsWith('challenge-complete-'))?{action:'map',inViewport:true}:null,errors:[]})),
  ...Object.values(require('../../content/learning-course.json').activities).filter(a=>a.kind==='teach').flatMap(a=>['words-queued-','words-heard-'].map(prefix=>({name:prefix+a.id,activityId:a.id,viewport,expectedTheme:'dark',canvas:'rgb(20, 31, 35)',errors:[]}))),
  ...Object.keys(require('../../content/learning-course.json').activities).map(activityId=>({name:'activity-'+activityId,activityId,viewport,expectedTheme:'dark',canvas:'rgb(20, 31, 35)',errors:[]}))
]).map(check=>({...check,...(check.completionBoundary?{sessionProgress:null,settlement:{headerAbsent:true,values:['6','×3','1:30'],completed:6,finished:true}}:{}),viewportGeometry:{width:check.viewport[0],contentWidth:check.viewport[0]-15,scrollWidth:check.viewport[0]-15,scrollbarWidth:15}})),mutations:['settlement-historical-total','settlement-lesson-header','placement-heart-mismatch','placement-answer-type-mismatch','white-on-light','dark-multiply','missing-image','opaque-art','theme-discontinuity','uneven-node-spacing','completion-skips-map','completion-button-offscreen','off-center-arrow','route-progress-in-lesson','scrollbar-width-overflow','low-contrast-sticky-title','covered-sticky-title'].map(name=>({name,caught:true}))};}
test('visual release gate fails closed on errors, missing screens, missing widths and ineffective negative controls',()=>{
  validateReport(validReport());
  for(const mutate of [
    p=>{p.status='running';},
    p=>{p.checks=p.checks.filter(c=>c.name!=='settlement-visibility-input');},
    p=>{p.checks=p.checks.filter(c=>c.name!=='placement-passed');},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='placement-heart-mismatch');},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='placement-answer-type-mismatch');},
    p=>{delete p.checks[0].viewportGeometry;},
    p=>{p.checks[0].viewportGeometry={};},
    p=>{p.checks[0].viewportGeometry.scrollbarWidth=0;},
    p=>{p.checks[0].viewportGeometry.scrollWidth=p.checks[0].viewport[0];},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='scrollbar-width-overflow');},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='low-contrast-sticky-title');},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='covered-sticky-title');},
    p=>{p.checks[0].canvas='rgb(223, 230, 223)';},
    p=>{p.checks[0].expectedTheme='light';},
    p=>{p.checks[0].errors.push({rule:'color-contrast'});},
    p=>{p.checks=p.checks.filter(c=>c.name!=='story-two-lines');},
    p=>{p.checks=p.checks.filter(c=>c.viewport[0]!==320);},
    p=>{p.checks=p.checks.filter(c=>c.activityId!==Object.keys(require('../../content/learning-course.json').activities).at(-1));},
    p=>{p.checks=p.checks.filter(c=>!c.name.startsWith('words-queued-'));},
    p=>{p.checks.find(c=>c.name==='map').journeyLayout.gaps[0]=264;},
    p=>{p.checks=p.checks.filter(c=>c.name!=='completion-return-K01');},
    p=>{p.checks=p.checks.filter(c=>c.name!=='replay-return-map');},
    p=>{p.checks.find(c=>c.name==='celebration').completionBoundary.action='continue-course';},
    p=>{p.checks.find(c=>c.name==='review-complete').completionBoundary.inViewport=false;},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='completion-skips-map');},
    p=>{p.mutations[0].caught=false;},
    p=>{p.checks.find(c=>c.name==='celebration').sessionProgress={total:11,completed:6};},
    p=>{p.checks.find(c=>c.name==='celebration').settlement.headerAbsent=false;},
    p=>{p.checks.find(c=>c.name==='celebration').settlement.finished=false;},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='settlement-historical-total');},
    p=>{p.mutations=p.mutations.filter(m=>m.name!=='settlement-lesson-header');},
    p=>{p.checks.find(c=>c.name==='map').centeredIcons[0].x=-5;},
    p=>{p.checks=p.checks.filter(c=>c.name!=='reset-failed');},
    p=>{p.checks=p.checks.filter(c=>c.name!=='challenge-filled-CH12-1');}
  ]){const proof=validReport();mutate(proof);assert.throws(()=>validateReport(proof));}
});
test('browser proof is required and expires when any public asset or browser checker changes',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'canran-visual-proof-'));
  const prepared={sources:new Map([['path.css',Buffer.from('original CSS')]])};
  try{
    for(const file of ['tests/browser/check.js','scripts/visual-proof.js','scripts/serve-visual-check.js','scripts/run-browser-check.js','scripts/verify-course-media.js','package.json','package-lock.json']){
      fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),'fixture');
    }
    assert.throws(()=>assertVisualProof(prepared,root),/No browser readability proof/);
    const proof={...validReport(),fingerprint:fingerprint(prepared,root)};
    fs.mkdirSync(path.join(root,'test-results'));fs.writeFileSync(path.join(root,PROOF),JSON.stringify(proof));
    assertVisualProof(prepared,root);
    assert.throws(()=>assertVisualProof({sources:new Map([['path.css',Buffer.from('changed CSS')]])},root),/stale/);
    fs.appendFileSync(path.join(root,'tests/browser/check.js'),'changed');
    assert.throws(()=>assertVisualProof(prepared,root),/stale/);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
