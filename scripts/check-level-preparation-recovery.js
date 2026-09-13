'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const {createServer}=require('./serve-learning-path');
async function main(){
  const server=createServer(),serve=server.listeners('request')[0],requests=[],failures=new Set();
  let release;const held=new Promise(resolve=>{release=resolve;});
  let releaseOptional;const optionalHeld=new Promise(resolve=>{releaseOptional=resolve;});let stallOptional=false;
  server.removeAllListeners('request');
  server.on('request',async(req,res)=>{
    requests.push(req.url);
    if(stallOptional&&req.url.startsWith('/assets/feedback/'))await optionalHeld;
    if(failures.has(req.url)){res.writeHead(503);res.end();return;}
    if(/\/l01-d0[234]\.mp3$/.test(req.url))await held;
    if(!res.destroyed)serve(req,res);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:844}}),report={status:'running',cases:[]};
  try{
    await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.locator('.journey-app').waitFor();
    await page.locator('.journey-node[data-id="K01"]').click();await page.locator('[data-action="open-node"]').click();
    await page.getByRole('heading',{name:'正在准备本关',exact:true}).waitFor();
    while(!requests.some(src=>src.endsWith('/l01-d02.mp3')))await new Promise(resolve=>setTimeout(resolve,20));
    await page.getByText('网络有点慢，可以再等等或重试。',{exact:true}).waitFor({timeout:12000});
    assert.equal(await page.getByRole('button',{name:'再试一次',exact:true}).isEnabled(),true);
    await page.getByRole('button',{name:'返回路线',exact:true}).click();await page.locator('.journey-app').waitFor();
    release();
    // Allow the three in-flight source responses to finish. Cancellation must
    // stop scheduling the remaining requests, even though valid bytes may stay.
    await new Promise(resolve=>setTimeout(resolve,750));
    assert.equal(requests.some(src=>/\/l01-d0[567]\.mp3$/.test(src)),false,'returning cancels obsolete preparation');
    assert.equal(await page.locator('.journey-app').count(),1);
    await page.locator('.journey-node[data-id="K01"]').click();await page.locator('[data-action="open-node"]').click();
    await page.locator('[data-action="story-start"]').waitFor();
    report.cases.push('return cancels queued media; reenter resumes without granting listening or completion');
    await page.close();
    const retryPage=await browser.newPage({viewport:{width:390,height:844}}),speech='/poc/lesson-1-2/course/audio/l01-d02.mp3';
    failures.add(speech);const since=requests.length;
    await retryPage.goto('http://127.0.0.1:'+server.address().port+'/');await retryPage.locator('.journey-app').waitFor();
    await retryPage.locator('.journey-node[data-id="K01"]').click();await retryPage.locator('[data-action="open-node"]').click();
    await retryPage.getByRole('heading',{name:'还没准备好',exact:true}).waitFor({timeout:12000}).catch(async error=>{console.error(await retryPage.locator('[data-learning-path]').innerText(),requests.slice(since));throw error;});
    assert.equal(await retryPage.locator('.lp-interactive-story').count(),0);
    failures.delete(speech);await retryPage.getByRole('button',{name:'再试一次',exact:true}).click();
    await retryPage.locator('[data-action="story-start"]').waitFor();
    assert.equal(requests.slice(since).filter(src=>src.endsWith('/handbag.webp')).length,1,'retry reuses verified required images');
    report.cases.push('required speech failure blocks entry; retry reuses valid media');await retryPage.close();
    const {seedPicture}=require('./check-answer-feedback'),unit=require('../content/learning-course.json'),seed=seedPicture();
    const a=seed.records[seed.key].value.placement.attempts.friends,q=unit.placement.questions.find(q=>q.id===a.questionIds[a.cursor]);
    for(const sound of Object.values(unit.feedbackSounds))failures.add(sound.src);
    stallOptional=true;
    const optionalPage=await browser.newPage({viewport:{width:390,height:844}});
    await optionalPage.addInitScript(({key,record})=>localStorage.setItem(key,JSON.stringify(record)),{key:seed.key,record:seed.records[seed.key]});
    await optionalPage.goto('http://127.0.0.1:'+server.address().port+'/');await optionalPage.locator('.journey-app').waitFor();
    await optionalPage.locator('[data-action="open-placement"][data-id="friends"]').click();await optionalPage.locator('[data-action="placement-start"]').click();
    await optionalPage.locator('.lp-exercise').waitFor({timeout:10000});releaseOptional();
    await optionalPage.locator('[data-action="exercise-listen"]').first().click();await optionalPage.locator('[data-action="exercise-select"][data-id="'+q.answer[0]+'"]').click();
    await optionalPage.locator('[data-action="placement-check"]').click();await optionalPage.locator('.lp-feedback-success').waitFor();
    assert.equal(await optionalPage.locator('[data-action="placement-next"]').isEnabled(),true);
    report.cases.push('missing optional feedback sounds do not block learning or grading');await optionalPage.close();report.status='passed';
  }finally{release();releaseOptional();fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/level-preparation-recovery.json',JSON.stringify(report,null,2)+'\n');await browser.close();await new Promise(resolve=>server.close(resolve));}
  console.log(JSON.stringify(report));
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={main};
