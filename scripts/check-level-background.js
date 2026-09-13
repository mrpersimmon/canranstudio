'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');const {createServer}=require('./serve-learning-path');
async function main(){
  let release,requested=false;const held=new Promise(resolve=>{release=resolve;});
  const server=createServer(),serve=server.listeners('request')[0];server.removeAllListeners('request');
  server.on('request',async(req,res)=>{if(req.url.endsWith('/pencil.webp')){requested=true;await held;}if(!res.destroyed)serve(req,res);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:844}}),report={status:'running'};
  await page.addInitScript(()=>{const NativeAudio=window.Audio;window.played=[];window.Audio=function(src){const a=new NativeAudio(src);a.addEventListener('playing',()=>played.push({src:a.src,at:performance.now()}));return a;};window.Audio.prototype=NativeAudio.prototype;});
  try{
    await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.locator('.journey-app').waitFor();
    await page.locator('.journey-node[data-id="K01"]').click();await page.locator('[data-action="open-node"]').click();await page.locator('[data-action="story-start"]').waitFor();
    const deadline=Date.now()+4000;while(!requested&&Date.now()<deadline)await new Promise(resolve=>setTimeout(resolve,20));
    assert.ok(requested,'prepare the next level while this level is idle');
    const clicked=await page.evaluate(()=>performance.now());await page.locator('[data-action="story-start"]').click();
    await page.waitForFunction(()=>played.some(e=>e.src.endsWith('/l01-d01.mp3')),null,{timeout:1500});
    report.currentPlayingMs=await page.evaluate(clicked=>played.find(e=>e.src.endsWith('/l01-d01.mp3')).at-clicked,clicked);
    assert.equal(await page.locator('.lp-preparation').count(),0,'background waiting must never replace the current activity');
    await page.locator('[data-action="map"]').click();await page.locator('.journey-app').waitFor();
    release();report.status='passed';
  }finally{release();fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/level-background.json',JSON.stringify(report,null,2)+'\n');await browser.close();await new Promise(resolve=>server.close(resolve));}
  console.log(JSON.stringify(report));
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});module.exports={main};
