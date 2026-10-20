'use strict';
const fs=require('node:fs/promises'),path=require('node:path');
const {relocateSource}=require('../../scripts/public-base-path');
const FILES=['unit.js','grammar.js','references.js'];
async function beforeReview(page){const handlers=[];
 for(const name of FILES){const pattern=new RegExp('/unit21-22/'+name.replace('.','\\.')+'(?:\\?.*)?$');const handler=async route=>{let body=await fs.readFile(path.join(__dirname,'../fixtures/unit21-22-before-teaching-review',name),'utf8');if(new URL(route.request().url()).pathname.startsWith('/lesson/'))body=relocateSource(body,'unit21-22/'+name,'/lesson/');await route.fulfill({body,contentType:'text/javascript'});};await page.route(pattern,handler);handlers.push([pattern,handler]);}
 return async()=>{for(const[pattern,handler]of handlers)await page.unroute(pattern,handler);};
}
const readLearning=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit21-22:learning:v1')));
module.exports={FILES,beforeReview,readLearning};
