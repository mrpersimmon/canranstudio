'use strict';
const fs=require('node:fs/promises'),path=require('node:path');
const {relocateSource}=require('../../scripts/public-base-path');

// The two archived controllers predate the compact learning shell. Use the
// HTML that wired their teaching presentation, while exercising shared storage
// and server reconciliation from the current release.
const FILES=['index.html','unit.js','grammar.js','references.js'];
async function installPriorPresentation(page,unit){
 const listeners=[];
 for(const name of FILES){
  const matcher=url=>url.pathname.endsWith('/'+unit+'/'+(name==='index.html'?'':name))||
    name==='index.html'&&url.pathname.endsWith('/'+unit+'/index.html');
  const source=await fs.readFile(path.join(__dirname,'../fixtures',unit+'-before-teaching-review',name),'utf8');
  const listener=async route=>{
   const prefix=new URL(route.request().url()).pathname.startsWith('/lesson/')?'/lesson/':'/';
   const body=prefix==='/'?source:relocateSource(source,unit+'/'+name,prefix);
   await route.fulfill({body,contentType:name==='index.html'?'text/html':'text/javascript',headers:{'cache-control':'no-store'}});
  };
  await page.route(matcher,listener);listeners.push([matcher,listener]);
 }
 return async()=>{for(const [matcher,listener] of listeners)await page.unroute(matcher,listener);};
}
module.exports={FILES,installPriorPresentation};
