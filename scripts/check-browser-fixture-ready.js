'use strict';
// A loaded test adapter is not a rendered course. Exercise a delayed initial
// storage lock so reload tests cannot interact with the installer placeholder.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {createVisualServer}=require('./serve-visual-check');
async function main(){
  const {server}=createVisualServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});
  try{
    for(const [width,height] of require('./visual-proof').VIEWPORTS){
      const page=await browser.newPage({viewport:{width,height}});
      await page.addInitScript(()=>{
        const request=navigator.locks.request.bind(navigator.locks);
        let initial=true;
        navigator.locks.request=(name,...args)=>{
          const callback=args.pop(),delay=initial?1000:0;initial=false;
          return request(name,...args,async lock=>{
            if(delay)await new Promise(resolve=>setTimeout(resolve,delay));
            return callback(lock);
          });
        };
      });
      try{
        await page.goto('http://127.0.0.1:'+server.address().port+'/__qa__/frame.html');
        for(const state of ['initial','reload']){
          if(state==='reload')await page.reload();
          await page.waitForFunction(()=>window.fixture?.ready,undefined,{timeout:15000});
          const ready=await page.evaluate(()=>({
            reloads:fixture.completedDispatches.reload||0,
            rendered:!!document.querySelector('[data-learning-path] .lp-shell'),
            review:!!document.querySelector('button[data-action="journey-nav"][data-id="review"]:not(:disabled)'),
            errors:fixture.errors
          }));
          assert(ready.reloads>0&&ready.rendered&&ready.review,
            width+'x'+height+' '+state+' claimed ready before the first rendered reload: '+JSON.stringify(ready));
          assert.deepEqual(ready.errors,[]);
        }
      }finally{await page.close();}
    }
    console.log('Browser adapter readiness passed: delayed initial storage lock and reload at four viewports.');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={main};
