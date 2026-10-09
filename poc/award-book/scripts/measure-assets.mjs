import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const base=process.env.PREVIEW_BASE_URL||'http://127.0.0.1:4264';
const files=['index.html',...(await fs.readdir(path.join(root,'dist/client/assets'))).map(n=>'assets/'+n)];
const resources=await Promise.all(files.map(async file=>{
  const response=await fetch(base+'/'+(file==='index.html'?'':file),{headers:{'Accept-Encoding':'gzip'}});
  await response.arrayBuffer();
  if(!response.ok)throw new Error(file+': '+response.status);
  return {file,status:response.status,responseBodyBytes:Number(response.headers.get('content-length')),encoding:response.headers.get('content-encoding')||'identity',cacheControl:response.headers.get('cache-control')};
}));
const total=resources.reduce((sum,row)=>sum+row.responseBodyBytes,0);
const fullFont=(await fs.stat(path.join(root,'../../assets/awards/award-round.woff2'))).size;
const subset=resources.find(row=>row.file.includes('award-book-subset')).responseBodyBytes;
const result={measuredAt:new Date().toISOString(),scope:'Local preview static HTTP resource transfer budget. Not browser cold-start timing or production load testing.',resources,totalResponseBodyBytes:total,fullNameFontBytes:fullFont,demoSubsetFontBytes:subset,withFullNameFontBytes:total+fullFont-subset};
await fs.writeFile('/private/tmp/award-book-http-budget.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({totalResponseBodyBytes:total,withFullNameFontBytes:result.withFullNameFontBytes,requests:resources.length}));
