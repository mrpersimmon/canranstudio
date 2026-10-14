'use strict';
const fs=require('node:fs/promises'),path=require('node:path');
const {relocateSource}=require('../../scripts/public-base-path');
// Historical audio/15-star regressions run the frozen edition explicitly.
// Current five-zone behavior has separate page and authenticated upgrade tests.
async function legacy(page){
 const handlers=[];
 for(const name of ['index.html','content.js','unit.js']){
  const pattern=name==='index.html'?/\/unit49-50\/(?:index\.html)?(?:\?.*)?$/:new RegExp('/unit49-50/'+name.replace('.','\\.')+'(?:\\?.*)?$');
  const handler=async route=>{
   let body=await fs.readFile(path.join(__dirname,'../fixtures/unit49-50-before-fivezones',name),'utf8');
   body=body.replaceAll('/tests/fixtures/unit49-50-before-fivezones/','/unit49-50/');
   if(new URL(route.request().url()).pathname.startsWith('/lesson/'))body=relocateSource(body,'unit49-50/'+name,'/lesson/');
   return route.fulfill({body,contentType:name.endsWith('.html')?'text/html':'text/javascript',headers:{'cache-control':'no-store'}});
  };
  await page.route(pattern,handler);handlers.push([pattern,handler]);
 }
 return async()=>{for(const[pattern,handler]of handlers)await page.unroute(pattern,handler);};
}
async function audioBoundary(page){await page.addInitScript(()=>{window.Audio=class extends EventTarget{constructor(src){super();this.src=src;this.currentTime=0;}play(){queueMicrotask(()=>this.dispatchEvent(new Event('ended')));return Promise.resolve();}pause(){}};});}
module.exports={legacy,audioBoundary};
