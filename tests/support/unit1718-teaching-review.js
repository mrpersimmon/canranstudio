'use strict';
const fs=require('node:fs/promises'),path=require('node:path');
const {relocateSource}=require('../../scripts/public-base-path');
const FILES=['unit.js','grammar.js','references.js'];
// Only these presentation files changed. Assessment, sessions, rewards and
// the earlier 15-star migration continue to use the same production files.
async function beforeReview(page){
 const handlers=[];
 for(const name of FILES){
  const pattern=new RegExp('/unit17-18/'+name.replace('.','\\.')+'(?:\\?.*)?$');
  const handler=async route=>{let body=await fs.readFile(path.join(__dirname,'../fixtures/unit17-18-before-teaching-review',name),'utf8');if(new URL(route.request().url()).pathname.startsWith('/lesson/'))body=relocateSource(body,'unit17-18/'+name,'/lesson/');await route.fulfill({body,contentType:'text/javascript'});};
  await page.route(pattern,handler);handlers.push([pattern,handler]);
 }
 return async()=>{for(const[pattern,handler]of handlers)await page.unroute(pattern,handler);};
}
const readLearning=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit17-18:learning:v1')));
module.exports={FILES,beforeReview,readLearning};
