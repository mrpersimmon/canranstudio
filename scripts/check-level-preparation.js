'use strict';
// Approved seam: student controls and visible images/media, against the real
// release installer and service worker. Delays/failures are at the HTTP boundary.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { createServer } = require('./serve-learning-path');

async function main() {
  const server = createServer(), serve = server.listeners('request')[0];
  server.removeAllListeners('request');
  let releaseImage;
  const imageHeld = new Promise(resolve => { releaseImage = resolve; });
  server.on('request', async (req, res) => {
    if (req.url === '/poc/lesson-1-2/course/assets/v3/handbag.webp') await imageHeld;
    if (!res.destroyed) serve(req, res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const NativeDate=Date;window.clockAdvance=0;
    window.Date=class extends NativeDate {constructor(...args){super(...(args.length?args:[NativeDate.now()+window.clockAdvance]));}static now(){return NativeDate.now()+window.clockAdvance;}};
    const NativeAudio = window.Audio;
    window.mediaEvents = [];
    window.canplayHeld=false;window.canplayCallbacks=[];window.deferCanplay=true;
    window.imageAppearances=[];const seen=new WeakSet();
    new MutationObserver(()=>document.querySelectorAll('.lp-story-object,.lp-option-image').forEach(img=>{
      if(!seen.has(img)){seen.add(img);imageAppearances.push({src:img.src,complete:img.complete,width:img.naturalWidth});}
    })).observe(document,{childList:true,subtree:true});
    window.Audio = function(src) {
      const audio = new NativeAudio(src);
      for (const type of ['loadstart', 'canplay', 'playing', 'ended', 'error']) audio.addEventListener(type, () => window.mediaEvents.push({ src: audio.src, type, at: performance.now() }));
      if(src.endsWith('/l01-d02.mp3')){
        const add=audio.addEventListener.bind(audio);
        audio.addEventListener=(type,handler,options)=>add(type,type==='canplay'?event=>{if(window.deferCanplay){window.canplayHeld=true;window.canplayCallbacks.push(()=>handler(event));}else handler(event);}:handler,options);
      }
      return audio;
    };
    window.Audio.prototype = NativeAudio.prototype;
  });
  const report = { status: 'running', cases: [] };
  try {
    await page.goto('http://127.0.0.1:' + server.address().port + '/');
    await page.locator('.journey-app').waitFor();
    await page.locator('.journey-node[data-id="K01"]').click();
    await page.locator('[data-action="open-node"][data-id="K01"]').click();
    await page.getByRole('heading', { name: '正在准备本关', exact: true }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('.lp-interactive-story').count(), 0, 'do not expose the story before its required object is ready');
    await page.evaluate(()=>{window.clockAdvance+=120000;});
    releaseImage();
    await page.waitForFunction(()=>window.canplayHeld);
    assert.ok(await page.getByRole('progressbar',{name:'本关准备进度'}).evaluate(p=>p.value<p.max),'do not show 100 percent while a required player is still preparing');
    await page.evaluate(()=>{window.deferCanplay=false;window.canplayCallbacks.forEach(fn=>fn());});
    await page.locator('.lp-interactive-story').waitFor();
    // Intentionally no image.decode() wait: the product must guarantee this at
    // first display, not rely on a QA helper making the missing image appear.
    assert.equal(await page.locator('.lp-story-object').evaluate(img => img.complete && img.naturalWidth > 0), true);
    assert.ok(await page.evaluate(()=>imageAppearances.every(img=>img.complete&&img.width>0)),'required images must be ready at DOM insertion, before any test wait');
    report.cases.push('first story waits for required handbag image');
    await context.setOffline(true);
    await page.evaluate(()=>{window.clockAdvance+=30000;});
    await page.locator('[data-action="story-start"]').click();
    await page.waitForFunction(() => mediaEvents.some(e => e.src.endsWith('/l01-d01.mp3') && e.type === 'ended'));
    await page.locator('[data-action="continue"]').click();
    await page.waitForFunction(() => mediaEvents.some(e => e.src.endsWith('/l01-d02.mp3') && e.type === 'ended'), null, { timeout: 7000 });
    report.cases.push('later sentence plays after preparing the level then going offline');
    for (const line of ['03', '04']) {
      await page.locator('[data-action="continue"]').click();
      await page.waitForFunction(line => mediaEvents.some(e => e.src.endsWith('/l01-d' + line + '.mp3') && e.type === 'ended'), line);
    }
    await page.locator('[data-action="continue"]').click();
    await page.locator('[data-action="select"][data-id="V36-REPEAT"]').click();
    await page.locator('[data-action="check"]').click();
    await page.waitForFunction(() => mediaEvents.some(e => e.src.endsWith('/duolingo-correct.mp3') && e.type === 'ended'), null, { timeout: 7000 });
    for (const line of ['05', '06']) {
      await page.locator('[data-action="continue"]').click();
      await page.waitForFunction(line => mediaEvents.some(e => e.src.endsWith('/l01-d' + line + '.mp3') && e.type === 'ended'), line);
    }
    for (const id of ['handbag-owner', 'L01-D07']) {
      await page.locator('[data-action="continue"]').click();
      await page.locator('[data-action="select"][data-id="' + id + '"]').click();
      await page.locator('[data-action="check"]').click();
      await page.locator('.lp-feedback').waitFor();
      assert.equal(await page.locator('.lp-settlement').count(), 0);
    }
    await page.locator('[data-action="continue"]').click();
    await page.waitForFunction(() => mediaEvents.some(e => e.src.endsWith('/l01-d07.mp3') && e.type === 'ended'));
    await page.locator('[data-action="continue"]').click();
    await page.locator('.lp-settlement').waitFor();
    await page.waitForFunction(() => mediaEvents.some(e => e.src.endsWith('/duolingo-complete.mp3') && e.type === 'ended'));
    assert.equal(await page.locator('.lp-settlement-mascot').evaluate(img => img.complete && img.naturalWidth > 0), true);
    const duration=await page.locator('.lp-settlement-stat.stat-2 [data-settlement-value]').innerText();
    assert.match(duration,/^0:[3-5]\d$/,'preparation time is excluded from learning time');
    report.cases.push('whole level, answer sounds, final feedback and settlement work offline');
    report.status = 'passed';
  } finally {
    releaseImage();
    fs.mkdirSync('test-results', { recursive: true });
    fs.writeFileSync('test-results/level-preparation.json', JSON.stringify(report, null, 2) + '\n');
    await context.close();
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify(report));
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { main };
