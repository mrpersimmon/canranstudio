'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {VIEWPORTS,PROOF,fingerprint,validateReport,assertVisualProof}=require('../../scripts/visual-proof');
function validReport(){return {schema:1,status:'passed',checks:VIEWPORTS.flatMap(viewport=>[
  ...['loader','map','story-two-lines','references','celebration','review-complete','blocked','save-failure','map-return','reload-map'].map(name=>({name,viewport,expectedTheme:'dark',canvas:'rgb(20, 31, 35)',errors:[]})),
  ...Object.keys(require('../../content/learning-course.json').activities).map(activityId=>({name:'activity-'+activityId,activityId,viewport,expectedTheme:'dark',canvas:'rgb(20, 31, 35)',errors:[]}))
]),mutations:['white-on-light','dark-multiply','missing-image','opaque-art','theme-discontinuity'].map(name=>({name,caught:true}))};}
test('visual release gate fails closed on errors, missing screens, missing widths and ineffective negative controls',()=>{
  validateReport(validReport());
  for(const mutate of [
    p=>{p.status='running';},
    p=>{p.checks[0].canvas='rgb(223, 230, 223)';},
    p=>{p.checks[0].expectedTheme='light';},
    p=>{p.checks[0].errors.push({rule:'color-contrast'});},
    p=>{p.checks=p.checks.filter(c=>c.name!=='story-two-lines');},
    p=>{p.checks=p.checks.filter(c=>c.viewport[0]!==320);},
    p=>{p.checks=p.checks.filter(c=>c.activityId!==Object.keys(require('../../content/learning-course.json').activities).at(-1));},
    p=>{p.mutations[0].caught=false;}
  ]){const proof=validReport();mutate(proof);assert.throws(()=>validateReport(proof));}
});
test('browser proof is required and expires when any public asset or browser checker changes',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'canran-visual-proof-'));
  const prepared={sources:new Map([['path.css',Buffer.from('original CSS')]])};
  try{
    for(const file of ['tests/browser/check.js','scripts/visual-proof.js','scripts/serve-visual-check.js','scripts/run-browser-check.js','package.json','package-lock.json']){
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
