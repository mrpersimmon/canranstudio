'use strict';
const fs=require('node:fs'),crypto=require('node:crypto');
async function main(){
  const checks=['level-preparation','level-preparation-modes','level-preparation-recovery','level-playback','level-background','level-decode-window'];
  const report={status:'running',environment:'Local HTTP, isolated Chromium, desktop CPU; mobile/tablet viewports are not physical-device acceptance',checks:[],playback:[]};
  try{
    for(const name of checks){
      await require('./check-'+name).main();
      report.checks.push({name,...JSON.parse(fs.readFileSync('test-results/'+name+'.json','utf8'))});
    }
    report.sourceManifestSha256=crypto.createHash('sha256').update(fs.readFileSync('poc/learning-path/course-package-manifest.json')).digest('hex');
    report.playback=report.checks.find(check=>check.name==='level-playback').samples;
    report.status='passed';
  }finally{fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/learning-media.json',JSON.stringify(report,null,2)+'\n');}
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
