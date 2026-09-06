'use strict';
// CI driver. The same self-running suite can be opened in the supported Codex
// browser with visual:serve; neither path adds test routes to the release.
const { chromium } = require('playwright');
const { createVisualServer } = require('./serve-visual-check');
async function main() {
  const {server,getReport}=createVisualServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch();
    const page=await browser.newPage({viewport:{width:1500,height:1000},reducedMotion:'no-preference'});
    await page.goto('http://127.0.0.1:'+server.address().port+'/__qa__/runner.html');
    await page.waitForFunction(()=>document.body.dataset.result,undefined,{timeout:300000});
    if(getReport()?.status!=='passed'){
      await page.screenshot({path:'test-results/readability-failed.png',fullPage:true});
      throw Error('Browser readability suite failed; see test-results/readability-failed.json');
    }
    process.stdout.write('Browser readability passed: '+getReport().checks.length+' rendered states\n');
  } finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
if(require.main===module)main().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
