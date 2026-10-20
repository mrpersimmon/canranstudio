'use strict';
const fs=require('node:fs/promises'),path=require('node:path');
const {relocateSource}=require('../../scripts/public-base-path');
const FILES=['index.html','content.js','unit.js','unit.css','scene.js','grammar.js','references.js','typography.css','legacy.js','legacy.css','legacy-certificate.js'];
async function legacy(page){const handlers=[];
 for(const name of FILES){const pattern=name==='index.html'?/\/unit25-26\/(?:index\.html)?(?:\?.*)?$/:new RegExp('/unit25-26/'+name.replace('.','\\.')+'(?:\\?.*)?$');const handler=async route=>{let body=await fs.readFile(path.join(__dirname,'../fixtures/unit25-26-before-v153',name),'utf8');if(new URL(route.request().url()).pathname.startsWith('/lesson/'))body=relocateSource(body,'unit25-26/'+name,'/lesson/');await route.fulfill({body,contentType:name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript'});};await page.route(pattern,handler);handlers.push([pattern,handler]);}
 return async()=>{for(const[pattern,handler]of handlers)await page.unroute(pattern,handler);};
}
const readLearning=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('canran:unit25-26:learning:v1')));
module.exports={FILES,legacy,readLearning};
