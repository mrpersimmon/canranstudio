'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright'),{createServer}=require('./serve-learning-path');
const {setup}=require('../tests/unit/support/course-harness');
async function main(){
  const h=setup();for(const id of ['K01','K03'])h.finish(id);
  const server=createServer(),serve=server.listeners('request')[0],requests=[];server.removeAllListeners('request');server.on('request',(req,res)=>{requests.push(req.url);serve(req,res);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:844}}),report={status:'running'};
  await page.addInitScript(({key,record})=>{
    localStorage.setItem(key,JSON.stringify(record));
    const decode=Image.prototype.decode,held=new Promise(resolve=>{window.releaseHouseDecode=resolve;});
    Image.prototype.decode=function(){return this.src.endsWith('/house.webp')?decode.call(this).then(()=>held):decode.call(this);};
  },{key:h.rt.storageKey,record:h.adapter.load(h.rt.storageKey)});
  try{
    await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.locator('.journey-app').waitFor();
    await page.locator('.journey-node[data-id="K04"]').click();await page.locator('[data-action="open-node"]').click();
    await page.locator('.lp-vocabulary').waitFor({timeout:5000});
    assert.ok(requests.includes('/poc/lesson-1-2/course/assets/v3/house.webp'),'download the entire level, including the later house image');
    assert.ok(await page.locator('.lp-vocabulary-image').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0)));
    for(const ref of ['L02-W05','L02-W06','L02-W07','L02-W08']){
      await page.locator('[data-action="word-play"][data-id="'+ref+'"]').click();
      await page.locator('[data-action="word-play"][data-id="'+ref+'"].is-heard').waitFor();
    }
    await page.locator('[data-action="continue"]').click();
    for(const [ref,id] of [['L02-W05','coat'],['L02-W06','dress'],['L02-W07','skirt'],['L02-W08','shirt']]){
      await page.locator('[data-action="match-word"][data-id="'+ref+'"]').click();await page.locator('[data-action="match-image"][data-id="'+id+'"]').click();
    }
    await page.locator('[data-action="continue"]').click();
    await page.locator('[data-action="select"][data-id="L02-W05"]').click();await page.locator('[data-action="check"]').click();
    await page.locator('[data-action="continue"]').click();
    await page.getByRole('heading',{name:'正在准备本关',exact:true}).waitFor({timeout:5000});
    assert.equal(await page.locator('.lp-vocabulary').count(),0,'do not show the later activity before its image decode is ready');
    await page.evaluate(()=>window.releaseHouseDecode());await page.locator('.lp-vocabulary').waitFor();
    report.status='passed';
  }finally{await page.evaluate(()=>window.releaseHouseDecode?.()).catch(()=>{});fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/level-decode-window.json',JSON.stringify(report,null,2)+'\n');await browser.close();await new Promise(resolve=>server.close(resolve));}
  console.log(JSON.stringify(report));
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});module.exports={main};
