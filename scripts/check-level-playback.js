'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('playwright');
const {createServer} = require('./serve-learning-path');

async function main() {
  const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch(), context=await browser.newContext({viewport:{width:390,height:844}}), page=await context.newPage();
  const report={status:'running',browser:browser.version(),viewport:{width:390,height:844},transport:'loopback HTTP with production installer and service worker',samples:[]};
  const timing=(action,suffix,kind)=>page.evaluate(({action,suffix,kind})=>{
    const element=playbackObservation.elements.find(e=>e.src.endsWith(suffix)&&e.events.some(v=>v.type==='playing'));
    const clickAt=playbackObservation.clicks.filter(e=>e.action===action).at(-1).at;
    const playingAt=element.events.filter(e=>e.type==='playing').at(-1).at;
    return {kind,src:element.src,clickAt,canplayAt:element.events.find(e=>e.type==='canplay').at,playingAt,endedAt:element.events.filter(e=>e.type==='ended').at(-1).at,latencyMs:playingAt-clickAt};
  },{action,suffix,kind});
  await page.addInitScript(()=>{
    const NativeAudio=window.Audio;
    window.playbackObservation={elements:[],clicks:[]};
    window.observedPlayers=[];
    window.Audio=function(src){
      const audio=new NativeAudio(src), item={id:playbackObservation.elements.length,src,events:[]};
      observedPlayers.push(audio);
      playbackObservation.elements.push(item);
      for(const type of ['loadstart','canplay','playing','ended','error'])audio.addEventListener(type,()=>item.events.push({type,at:performance.now()}));
      return audio;
    };
    window.Audio.prototype=NativeAudio.prototype;
    const nativePlay=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(){
      if(!window.audioStartDelay)return nativePlay.call(this);
      return new Promise((resolve,reject)=>setTimeout(()=>nativePlay.call(this).then(resolve,reject),window.audioStartDelay));
    };
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-action]');if(button)playbackObservation.clicks.push({action:button.dataset.action,at:performance.now()});
    },true);
  });
  try {
    await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.locator('.journey-app').waitFor();
    await page.locator('.journey-node[data-id="K01"]').click();await page.locator('[data-action="open-node"]').click();
    await page.locator('[data-action="story-start"]').click();
    await page.waitForFunction(()=>playbackObservation.elements.some(e=>e.src.endsWith('/l01-d01.mp3')&&e.events.some(v=>v.type==='ended')));
    report.samples.push(await timing('story-start','/l01-d01.mp3','first'));
    await page.locator('[data-action="continue"]').click();
    await page.waitForFunction(()=>playbackObservation.elements.some(e=>e.src.endsWith('/l01-d02.mp3')&&e.events.some(v=>v.type==='ended')));
    const sample=await page.evaluate(()=>{
      const e=playbackObservation.elements.find(e=>e.src.endsWith('/l01-d02.mp3')&&e.events.some(v=>v.type==='playing'));
      return {...e,clickAt:playbackObservation.clicks.filter(e=>e.action==='continue').at(-1).at};
    });
    assert.ok(sample.events.find(e=>e.type==='canplay').at<sample.clickAt, 'the actual player must be playable before the next-line click');
    report.samples.push({kind:'next',...sample,latencyMs:sample.events.find(e=>e.type==='playing').at-sample.clickAt});
    await page.locator('[data-action="replay"]').click();
    await page.waitForFunction(()=>playbackObservation.elements.some(e=>e.src.endsWith('/l01-d02.mp3')&&e.events.filter(v=>v.type==='ended').length===2));
    report.samples.push(await timing('replay','/l01-d02.mp3','replay'));
    await page.evaluate(()=>{window.audioStartDelay=1500;});
    await page.locator('[data-action="replay"]').click();
    await page.getByText('正在准备声音…',{exact:true}).waitFor({timeout:750});
    assert.equal(await page.locator('[data-action="pause"]').count(),0,'do not claim playing before native playing');
    await page.locator('[data-action="pause"]').waitFor();
    await page.waitForFunction(()=>playbackObservation.elements.some(e=>e.src.endsWith('/l01-d02.mp3')&&e.events.filter(v=>v.type==='ended').length===3));
    await page.evaluate(()=>{window.audioStartDelay=0;});
    for(const line of ['03','04']){
      await page.locator('[data-action="continue"]').click();
      await page.waitForFunction(line=>playbackObservation.elements.some(e=>e.src.endsWith('/l01-d'+line+'.mp3')&&e.events.some(v=>v.type==='ended')),line);
    }
    assert.ok(await page.evaluate(()=>observedPlayers.filter(audio=>audio.getAttribute('src')).length<=2),'release older decoded players; retain only current and next story line');
    await page.locator('[data-action="map"]').click();await page.locator('.journey-app').waitFor();
    assert.equal(await page.evaluate(()=>observedPlayers.filter(audio=>audio.getAttribute('src')).length),0,'leaving the level releases its decoded players');
    await context.setOffline(true);await page.reload();await page.locator('.journey-app').waitFor();
    await page.locator('.journey-node[data-id="K01"]').click();await page.locator('[data-action="open-node"]').click();
    await page.locator('[data-action="story-start"]').click();
    await page.waitForFunction(()=>playbackObservation.elements.some(e=>e.src.endsWith('/l01-d04.mp3')&&e.events.some(v=>v.type==='ended')));
    report.samples.push(await timing('story-start','/l01-d04.mp3','offline-reload'));
    report.status='passed';
  } finally {
    fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/level-playback.json',JSON.stringify(report,null,2)+'\n');
    await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));
  }
  console.log(JSON.stringify(report));
  return report;
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={main};
