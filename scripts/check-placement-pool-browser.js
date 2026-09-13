'use strict';
// Real authored questions, renderer and controller; only the available bank,
// storage and audio-completion adapter are reduced in this local QA fixture.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright'),{createVisualServer}=require('./serve-visual-check');
async function main(){
  const {server}=createVisualServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']}),origin='http://127.0.0.1:'+server.address().port;
  const dir='test-results/placement-pool';fs.mkdirSync(dir,{recursive:true});const report={status:'running',checks:[],cases:[]};
  try{
    for(const [width,height] of [[320,568],[420,856],[906,801],[1440,900]])for(const mode of ['pass','fail','empty']){
      const count=mode==='empty'?0:6,limit=count?2:0,page=await browser.newPage({viewport:{width,height}});
      await page.addInitScript(size=>{window.fixtureReloadSeed={placementPoolSize:size,randomSeed:37};},count);
      await page.goto(origin+'/__qa__/frame.html');await page.waitForFunction(()=>fixture.ready);
      await page.addScriptTag({url:origin+'/__qa__/readability.js'});
      const click=async(action,id)=>{
        const before=await page.evaluate(action=>fixture.completedDispatches[action]||0,action);
        await page.locator('[data-action="'+action+'"]'+(id?'[data-id="'+id+'"]':'')).first().click();
        await page.waitForFunction(({action,before})=>(fixture.completedDispatches[action]||0)>before,{action,before});
      };
      const check=async state=>{
        await page.locator('.lp-preparation').waitFor({state:'hidden'});
        await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
        const result=await page.evaluate(name=>auditReadability(window,{name,expectedTheme:'dark'}),mode+'-'+state);
        report.checks.push(result);assert.deepEqual(result.errors,[],width+' '+mode+' '+state);
        await page.screenshot({path:dir+'/'+width+'-'+mode+'-'+state+'.png'});
      };
      await click('open-placement','umbrella');await check('intro');
      if(!count){assert.equal(await page.locator('[data-action="placement-start"]').count(),0);assert.match(await page.locator('.lp-placement-description').innerText(),/暂时没有可用的测试题/);}
      else{
        assert.match(await page.locator('.lp-placement-description').innerText(),/抽取 6 题/);
        await click('placement-start');await check('question');
        const n=mode==='pass'?count:limit;
        for(let i=0;i<n;i++){
          const q=await page.evaluate(()=>{const a=fixture.runtime.snapshot().placementAttempt;return fixture.unit.placement.questions.find(q=>q.id===a.questionIds[a.cursor]);});
          for(const ref of q.listenRefs){await click('exercise-listen',ref);await page.evaluate(()=>fixture.audio.at(-1).finish());await page.waitForFunction(()=>fixture.runtime.snapshot().audio.status==='ended');}
          // A passing six-question test may contain exactly one mistake.
          const correct=mode==='pass'&&i>0,ids=correct?q.answer:q.mechanism==='order'?[...q.answer].reverse():[q.options.find(o=>!q.answer.includes(o.id)).id];
          for(const id of ids)await click('exercise-select',id);
          await click('placement-check');
          if(i===n-1){
            assert.equal(await page.locator('.lp-settlement').count(),0);await check('final-feedback');
            const v=await page.evaluate(()=>fixture.runtime.snapshot());assert.equal(v.placementAttempt.status,mode==='pass'?'passed':'failed');
            const saved=await page.evaluate(()=>{const key=fixture.runtime.storageKey;return {placementPoolSize:6,records:{[key]:fixture.adapter.load(key)},key};});
            await page.addInitScript(seed=>{window.fixtureReloadSeed=seed;},saved);await page.reload();await page.waitForFunction(()=>fixture.ready);
            await page.addScriptTag({url:origin+'/__qa__/readability.js'});await click('open-placement','umbrella');await click('placement-start');
            await check('restored-feedback');assert.equal(await page.locator('.lp-settlement').count(),0);
          }
          await click('placement-next');
        }
        await check('result');assert.equal(await page.locator('.lp-settlement-stat.stat-2 dt').innerText(),'剩余机会');
        assert.equal(await page.locator('.lp-settlement-stat.stat-2 [data-settlement-value]').innerText(),mode==='pass'?'1':'0');
        assert.match(await page.locator('.lp-settlement-stat.stat-2 img').getAttribute('src'),/chances-heart\.webp$/);
      }
      report.cases.push({viewport:[width,height],mode,count,maxMistakes:limit});await page.close();
    }
    report.status='passed';
  }finally{fs.writeFileSync(dir+'/proof.json',JSON.stringify(report,null,2)+'\n');await browser.close();await new Promise(r=>server.close(r));}
  console.log('Placement pool: six-question pass/fail, restored final feedback, matching chance art, and empty-bank invitation at four sizes.');
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={main};
