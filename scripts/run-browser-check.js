'use strict';
// CI driver. The same self-running suite can be opened in the supported Codex
// browser with visual:serve; neither path adds test routes to the release.
const { chromium } = require('playwright');
const { createVisualServer } = require('./serve-visual-check');
async function main() {
  await require('./check-answer-feedback').main();
  const {server,getReport}=createVisualServer({sharded:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    // Headless Chromium hides scrollbars by default. A CSS gutter alone then
    // reserves pixels without reducing clientWidth, defeating overflow checks.
    browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});
    // The matrix checks every authored activity at every required viewport.
    // Its time budget grows with the course instead of dropping later lessons.
    const activityCount=Object.keys(require('../content/learning-course.json').activities).length;
    await Promise.all(require('./visual-proof').VIEWPORTS.map(async(viewport,shard)=>{
      const page=await browser.newPage({viewport:{width:1500,height:1000},reducedMotion:'no-preference'});
      await page.goto('http://127.0.0.1:'+server.address().port+'/__qa__/runner.html?shard='+shard);
      const progress=setInterval(()=>page.locator('#status').textContent().then(text=>process.stdout.write(viewport.join('x')+' '+text+'\n')).catch(()=>{}),30000);
      try{
        await page.waitForFunction(()=>document.body.dataset.result,undefined,{timeout:Math.max(300000,activityCount*12000)});
        if(await page.locator('body').getAttribute('data-result')!=='passed'){
          process.stderr.write(viewport.join('x')+' failed: '+await page.locator('#status').textContent()+'\n');
          await page.screenshot({path:'test-results/readability-failed-'+viewport.join('x')+'.png',fullPage:true});
        }
      }finally{clearInterval(progress);await page.close();}
    }));
    if(getReport()?.status!=='passed'){
      throw Error('Browser readability suite failed; see test-results/readability-failed.json');
    }
    process.stdout.write('Browser readability passed: '+getReport().checks.length+' rendered states\n');
  } finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
if(require.main===module)main().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
