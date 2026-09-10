'use strict';
// Fast preflight of the same post-course suite. It seeds a completed record
// produced by runtime actions in npm test and cannot create release evidence.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {createVisualServer}=require('./serve-visual-check');
async function main(){
  const record=JSON.parse(fs.readFileSync('test-results/review-repair/lab-full-course-record.json','utf8'));
  const {server,getReport}=createVisualServer({sharded:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});
  try{
    const page=await browser.newPage({viewport:{width:1500,height:1000},reducedMotion:'no-preference'});
    await page.addInitScript(record=>window.__postCoursePreflight=record,record);
    await page.goto('http://127.0.0.1:'+server.address().port+'/__qa__/runner.html?shard=0');
    const progress=setInterval(()=>page.locator('#status').textContent().then(text=>console.log(text)).catch(()=>{}),30000);
    try{
      await page.waitForFunction(()=>document.body.dataset.result,undefined,{timeout:30*60*1000});
      const report=await page.evaluate(()=>window.__postCourseReport);
      fs.writeFileSync('test-results/no-keyboard-post-course.json',JSON.stringify(report,null,2)+'\n');
      assert.equal(report.status,'preflight-passed',report.failure);
      assert.equal(getReport(),null,'A scoped preflight must not publish a release proof');
      console.log('Post-course preflight passed: '+report.checks.length+' states; no release proof created.');
    }finally{clearInterval(progress);}
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
